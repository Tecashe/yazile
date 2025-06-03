import { client } from "@/lib/prisma"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { n8nService } from "./n8n-service"
import type { Lead, LeadStatus } from "@prisma/client"

interface AnalyzeLeadParams {
  userId: string
  automationId: string
  platformId: string
  customerId: string
  message: string
  messageType: string
  timestamp: Date
}

interface ProcessInteractionParams {
  leadId: string
  content: string
  type: string
  direction: string
}

interface UpdateLeadStatusParams {
  leadId: string
  status: LeadStatus
  notes?: string
}

/**
 * Service for lead qualification and management
 */
export class LeadQualificationService {
  /**
   * Analyze a lead based on a message
   */
  async analyzeLead(params: AnalyzeLeadParams): Promise<Lead> {
    const { userId, automationId, platformId, customerId, message, messageType, timestamp } = params

    // Find or create the lead
    let lead = await this.findOrCreateLead(userId, automationId, platformId, customerId)

    // Process the interaction
    await this.processInteraction({
      leadId: lead.id,
      content: message,
      type: messageType.toLowerCase(),
      direction: "inbound",
    })

    // Get the updated lead
    // lead = await client.lead.findUnique({
    //   where: { id: lead.id },
    //   include: {
    //     qualificationData: true,
    //   },
    // })
    // Get the updated lead
    const updatedLead = await client.lead.findUnique({
        where: { id: lead.id },
        include: {
        qualificationData: true,
        },
    })

    if (!updatedLead) {
        throw new Error("Lead not found after processing")
    }
    
  
    lead = updatedLead

    if (!lead) {
      throw new Error("Lead not found after processing")
    }

    // Check if the lead should be sent to n8n
    const shouldSendToN8n = await this.checkQualificationCriteria(lead.id)
    if (shouldSendToN8n && !lead.sentToN8n) {
      await this.sendLeadToN8n(lead.id)
    }

    return lead
  }

  /**
   * Find an existing lead or create a new one
   */
  private async findOrCreateLead(
    userId: string,
    automationId: string,
    platformId: string,
    customerId: string,
  ): Promise<Lead> {
    // Check if lead exists
    let lead = await client.lead.findFirst({
      where: {
        userId,
        instagramUserId: customerId,
        pageId: platformId,
      },
    })

    // If not, create a new lead
    if (!lead) {
      lead = await client.lead.create({
        data: {
          userId,
          automationId,
          instagramUserId: customerId,
          pageId: platformId,
          status: "NEW",
          score: 0,
          source: "instagram",
          firstContactDate: new Date(),
          lastContactDate: new Date(),
          sentToN8n: false,
        },
      })

      // Create initial qualification data
      await client.leadQualificationData.create({
        data: {
          leadId: lead.id,
          engagementScore: 0,
          intentScore: 0,
          sentimentScore: 0,
          demographicScore: 0,
          frequencyScore: 0,
          recencyScore: 0,
        },
      })
    }

    return lead
  }

  /**
   * Process a lead interaction
   */
  async processInteraction(params: ProcessInteractionParams): Promise<void> {
    const { leadId, content, type, direction } = params

    // Analyze the message content
    const analysis = await this.analyzeMessage(content)

    // Create the interaction record
    await client.leadInteraction.create({
      data: {
        leadId,
        type,
        content,
        direction,
        sentiment: analysis.sentiment,
        intent: analysis,
        timestamp: new Date(),
      },
    })

    // Get the lead and its qualification data
    const lead = await client.lead.findUnique({
      where: { id: leadId },
      include: { qualificationData: true },
    })

    if (!lead || !lead.qualificationData) {
      throw new Error(`Lead or qualification data not found: ${leadId}`)
    }

    // Update qualification scores
    let intentScore = lead.qualificationData.intentScore
    let sentimentScore = lead.qualificationData.sentimentScore
    let engagementScore = lead.qualificationData.engagementScore
    let recencyScore = lead.qualificationData.recencyScore
    let frequencyScore = lead.qualificationData.frequencyScore

    // Update intent score based on purchase intent
    if (analysis.purchaseIntent > 7) {
      intentScore += 15
    } else if (analysis.purchaseIntent > 5) {
      intentScore += 10
    } else if (analysis.purchaseIntent > 3) {
      intentScore += 5
    }

    // Cap at 100
    intentScore = Math.min(100, intentScore)

    // Update sentiment score
    if (analysis.sentiment > 0.5) {
      sentimentScore += 10
    } else if (analysis.sentiment > 0) {
      sentimentScore += 5
    } else if (analysis.sentiment < -0.5) {
      sentimentScore -= 10
    } else if (analysis.sentiment < 0) {
      sentimentScore -= 5
    }

    // Keep within 0-100 range
    sentimentScore = Math.max(0, Math.min(100, sentimentScore))

    // Update engagement score
    engagementScore = Math.min(100, engagementScore + 5)

    // Update recency score (more recent interactions get higher scores)
    recencyScore = 100 // Reset to max when there's a new interactionementScore + 5)

    // Update recency score (more recent interactions get higher scores)
    recencyScore = 100 // Reset to max when there's a new interaction

    // Update frequency score
    frequencyScore = Math.min(100, frequencyScore + 5)

    // Calculate total score - weighted average
    const totalScore = Math.round(
      intentScore * 0.4 + sentimentScore * 0.3 + recencyScore * 0.15 + engagementScore * 0.15,
    )

    // Update the qualification data
    await client.leadQualificationData.update({
      where: { leadId },
      data: {
        intentScore,
        sentimentScore,
        recencyScore,
        engagementScore,
        frequencyScore,
        aiAnalysis: analysis,
        updatedAt: new Date(),
      },
    })

    // Update the lead score and last contact date
    await client.lead.update({
      where: { id: leadId },
      data: {
        score: totalScore,
        lastContactDate: new Date(),
        updatedAt: new Date(),
      },
    })

    // Check if the lead should be qualified based on score
    if (totalScore >= 75 && lead.status === "QUALIFYING") {
      await this.qualifyLead(leadId)
    } else if (totalScore >= 50 && lead.status === "NEW") {
      await this.updateLeadStatus({
        leadId,
        status: "QUALIFYING",
      })
    }
  }

  /**
   * Analyze a message for sentiment and intent
   */

  
  private async analyzeMessage(message: string): Promise<any> {
    try {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: `
          Analyze the following customer message for lead qualification:
          "${message}"
          
          Provide a JSON response with these fields:
          - sentiment: number from -1.0 (negative) to 1.0 (positive)
          - purchaseIntent: number from 0 to 10
          - questionIntent: boolean (is the person asking questions?)
          - informationSharing: boolean (is the person sharing personal information?)
          - objections: boolean (is the person raising concerns?)
          - leadCategory: string (cold, warm, hot)
          - summary: string (brief analysis of the message)
          
          JSON response only:
        `,
        system: "You are a lead qualification assistant that analyzes customer messages. Respond with JSON only.",
      })

      // Parse the JSON response
      try {
        // Clean the response to ensure it's valid JSON
        const jsonText = text.replace(/```json|```/g, "").trim()
        return JSON.parse(jsonText)
      } catch (e) {
        console.error("Failed to parse AI analysis:", e)
        return {
          sentiment: 0,
          purchaseIntent: 0,
          questionIntent: false,
          informationSharing: false,
          objections: false,
          leadCategory: "cold",
          summary: "Failed to analyze message.",
        }
      }
    } catch (error) {
      console.error("Error analyzing message:", error)
      return {
        sentiment: 0,
        purchaseIntent: 0,
        questionIntent: false,
        informationSharing: false,
        objections: false,
        leadCategory: "cold",
        summary: "Error analyzing message.",
      }
    }
  }

  

  /**
   * Qualify a lead
   */
  async qualifyLead(leadId: string): Promise<void> {
    await this.updateLeadStatus({
      leadId,
      status: "QUALIFIED",
      notes: "Automatically qualified based on score",
    })
  }

  /**
   * Update a lead's status
   */
  async updateLeadStatus(params: UpdateLeadStatusParams): Promise<Lead> {
    const { leadId, status, notes } = params

    const updateData: any = {
      status,
      updatedAt: new Date(),
    }

    if (notes) {
      updateData.notes = notes
    }

    // Add date fields based on status
    if (status === "QUALIFIED") {
      updateData.qualifiedDate = new Date()
    } else if (status === "CONVERTED") {
      updateData.convertedDate = new Date()
    }

    return client.lead.update({
      where: { id: leadId },
      data: updateData,
    })
  }

  /**
   * Check if a lead meets qualification criteria
   */
  async checkQualificationCriteria(leadId: string): Promise<boolean> {
    // Get the lead with qualification data
    const lead = await client.lead.findUnique({
      where: { id: leadId },
      include: {
        qualificationData: true,
        user: true,
      },
    })

    if (!lead || !lead.qualificationData) {
      return false
    }

    // Get the user's qualification rules
    const rules = await client.leadQualificationRule.findMany({
      where: {
        userId: lead.userId,
        isActive: true,
      },
    })

    // If no rules are defined, use default threshold
    if (!rules || rules.length === 0) {
      return lead.score >= 75 // Default qualification threshold
    }

    // Check if lead meets all required criteria
    return rules.every((rule) => {
      const scoreType = rule.scoreType
      const threshold = rule.threshold
      const operator = rule.operator

      // Get the appropriate score based on rule type
      let actualScore = 0
      switch (scoreType) {
        case "OVERALL":
          actualScore = lead.score
          break
        case "ENGAGEMENT":
          actualScore = lead.qualificationData?.engagementScore || 0
          break
        case "INTENT":
          actualScore = lead.qualificationData?.intentScore || 0
          break
        case "SENTIMENT":
          actualScore = lead.qualificationData?.sentimentScore || 0
          break
        case "FREQUENCY":
          actualScore = lead.qualificationData?.frequencyScore || 0
          break
        case "RECENCY":
          actualScore = lead.qualificationData?.recencyScore || 0
          break
      }

      // Check if the score meets the criteria based on operator
      switch (operator) {
        case "GREATER_THAN":
          return actualScore > threshold
        case "LESS_THAN":
          return actualScore < threshold
        case "EQUAL_TO":
          return actualScore === threshold
        case "GREATER_THAN_OR_EQUAL":
          return actualScore >= threshold
        case "LESS_THAN_OR_EQUAL":
          return actualScore <= threshold
        default:
          return false
      }
    })
  }

  /**
   * Send a lead to n8n for processing
   */
  async sendLeadToN8n(leadId: string): Promise<boolean> {
    // Get the lead with all related data
    const lead = await client.lead.findUnique({
      where: { id: leadId },
      include: {
        qualificationData: true,
        interactions: {
          orderBy: { timestamp: "desc" },
          take: 10,
        },
        user: true,
      },
    })

    if (!lead) {
      throw new Error(`Lead not found: ${leadId}`)
    }

    // Get active n8n workflows for this user
    const workflows = await client.n8nWorkflowConfig.findMany({
      where: {
        connection: {
          userId: lead.userId,
        },
        workflowType: "LEAD_QUALIFICATION",
        isActive: true,
      },
    })

    if (!workflows || workflows.length === 0) {
      console.log("No active lead qualification workflows found for user:", lead.userId)
      return false
    }

    // Format lead data for n8n
    const leadData = {
      lead: {
        id: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        score: lead.score,
        status: lead.status,
        source: lead.source,
        instagramUserId: lead.instagramUserId,
        pageId: lead.pageId,
        firstContactDate: lead.firstContactDate,
        lastContactDate: lead.lastContactDate,
        qualifiedDate: lead.qualifiedDate,
        convertedDate: lead.convertedDate,
        notes: lead.notes,
        tags: lead.tags,
        metadata: lead.metadata,
      },
      qualificationData: {
        engagementScore: lead.qualificationData?.engagementScore || 0,
        intentScore: lead.qualificationData?.intentScore || 0,
        sentimentScore: lead.qualificationData?.sentimentScore || 0,
        demographicScore: lead.qualificationData?.demographicScore || 0,
        frequencyScore: lead.qualificationData?.frequencyScore || 0,
        recencyScore: lead.qualificationData?.recencyScore || 0,
        aiAnalysis: lead.qualificationData?.aiAnalysis || null,
      },
      recentInteractions: lead.interactions.map((interaction) => ({
        type: interaction.type,
        content: interaction.content,
        direction: interaction.direction,
        timestamp: interaction.timestamp,
        sentiment: interaction.sentiment,
      })),
      timestamp: new Date().toISOString(),
    }

    // Try to execute each workflow until one succeeds
    for (const workflow of workflows) {
      try {
        const result = await n8nService.executeWorkflow({
          workflowId: workflow.workflowId,
          data: leadData,
        })

        if (result.success) {
          // Mark as sent to n8n
          await client.lead.update({
            where: { id: leadId },
            data: {
              sentToN8n: true,
              n8nWorkflowId: workflow.workflowId,
              n8nExecutionId: result.executionId,
            },
          })

          return true
        }
      } catch (error) {
        console.error(`Error executing workflow ${workflow.name}:`, error)
      }
    }

    return false
  }

  /**
   * Get all leads for a user
   */
  async getLeads(userId: string, filter?: { status?: string }): Promise<Lead[]> {
    const whereClause: any = { userId }

    if (filter?.status && filter.status !== "all") {
      whereClause.status = filter.status
    }

    return client.lead.findMany({
      where: whereClause,
      include: {
        qualificationData: true,
        interactions: {
          orderBy: { timestamp: "desc" },
          take: 5,
        },
      },
      orderBy: {
        lastContactDate: "desc",
      },
    })
  }

  /**
   * Get lead statistics for a user
   */
  async getLeadStats(userId: string): Promise<any> {
    const total = await client.lead.count({ where: { userId } })
    const qualified = await client.lead.count({ where: { userId, status: "QUALIFIED" } })
    const nurturing = await client.lead.count({ where: { userId, status: "NURTURING" } })
    const new_leads = await client.lead.count({ where: { userId, status: "NEW" } })
    const qualifying = await client.lead.count({ where: { userId, status: "QUALIFYING" } })
    const converted = await client.lead.count({ where: { userId, status: "CONVERTED" } })
    const disqualified = await client.lead.count({ where: { userId, status: "DISQUALIFIED" } })
    const lost = await client.lead.count({ where: { userId, status: "LOST" } })

    // Calculate average score
    const leads = await client.lead.findMany({
      where: { userId },
      select: { score: true },
    })

    const averageScore = leads.length > 0 ? leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length : 0

    return {
      total,
      qualified,
      nurturing,
      new: new_leads,
      qualifying,
      converted,
      disqualified,
      lost,
      averageScore,
    }
  }
}

// Export a singleton instance
export const leadQualificationService = new LeadQualificationService()
