import { client } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import type { LeadStatus, Lead } from "@prisma/client"

/**
 * Analyzes a message for sentiment and intent using n8n workflow
 */
export async function analyzeMessage(message: string) {
  try {
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || "https://yaziln8n.onrender.com/webhook/analyze-message"

    const response = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.N8N_API_KEY && {
          Authorization: `Bearer ${process.env.N8N_API_KEY}`,
        }),
      },
      body: JSON.stringify({
        message: message,
        analysisType: "lead_qualification",
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error(`n8n request failed: ${response.status} ${response.statusText}`)
    }

    const analysis = await response.json()

    // Ensure the response has the expected structure
    return {
      sentiment: Number(analysis.sentiment) || 0,
      purchaseIntent: Number(analysis.purchaseIntent) || 0,
      questionIntent: Boolean(analysis.questionIntent),
      informationSharing: Boolean(analysis.informationSharing),
      objections: Boolean(analysis.objections),
      intent: analysis.intent || null,
      confidence: Number(analysis.confidence) || 0,
    }
  } catch (error) {
    console.error("Error analyzing message with n8n:", error)
    // Return default values on error
    return {
      sentiment: 0,
      purchaseIntent: 0,
      questionIntent: false,
      informationSharing: false,
      objections: false,
      intent: null,
      confidence: 0,
    }
  }
}

/**
 * Processes a new interaction and updates lead scores
 */
export async function processInteractionE(leadId: string, content: string, type: string, direction: string) {
  try {
    // Analyze the message content
    const analysis = await analyzeMessage(content)

    // Create the interaction record
    const interaction = await client.leadInteraction.create({
      data: {
        leadId,
        type,
        content,
        direction,
        sentiment: analysis.sentiment,
        intent: analysis.intent as Prisma.InputJsonValue,
        timestamp: new Date(),
        metadata: {
          confidence: analysis.confidence,
          analysisTimestamp: new Date().toISOString(),
        } as Prisma.InputJsonValue,
      },
    })

    // Get the lead and its qualification data
    const lead = await client.lead.findUnique({
      where: { id: leadId },
      include: { qualificationData: true },
    })

    if (!lead) {
      throw new Error(`Lead not found: ${leadId}`)
    }

    // Calculate new scores based on analysis
    const scores = calculateLeadScores(lead.qualificationData, analysis)

    // Update the qualification data
    await client.leadQualificationData.upsert({
      where: { leadId },
      update: {
        intentScore: scores.intentScore,
        sentimentScore: scores.sentimentScore,
        recencyScore: scores.recencyScore,
        engagementScore: scores.engagementScore,
        aiAnalysis: {
          ...((lead.qualificationData?.aiAnalysis as Record<string, any>) || {}),
          [new Date().toISOString()]: analysis,
        } as Prisma.InputJsonValue,
        updatedAt: new Date(),
      },
      create: {
        leadId,
        intentScore: scores.intentScore,
        sentimentScore: scores.sentimentScore,
        recencyScore: scores.recencyScore,
        demographicScore: 0,
        frequencyScore: 0,
        engagementScore: scores.engagementScore,
        qualificationData: Prisma.JsonNull,
        aiAnalysis: {
          [new Date().toISOString()]: analysis,
        } as Prisma.InputJsonValue,
      },
    })

    // Update the lead with new total score and last contact date
    const updatedLead = await client.lead.update({
      where: { id: leadId },
      data: {
        score: scores.totalScore,
        lastContactDate: new Date(),
        updatedAt: new Date(),
      },
    })

    // Check if the lead should be qualified based on score
    if (scores.totalScore >= 10 && lead.status === "QUALIFYING") {
      await qualifyLead(leadId)
    }

    return {
      interaction,
      lead: updatedLead,
      analysis,
      scores,
    }
  } catch (error) {
    console.error("Error processing interaction:", error)
    throw error
  }
}

/**
 * Calculates lead scores based on current data and new analysis
 */
function calculateLeadScores(currentData: any, analysis: any) {
  // Get current scores or default to 0
  let intentScore = currentData?.intentScore || 0
  let sentimentScore = currentData?.sentimentScore || 0
  let recencyScore = currentData?.recencyScore || 0
  let engagementScore = currentData?.engagementScore || 0

  // Update intent score based on purchase intent
  if (analysis.purchaseIntent > 8) {
    intentScore += 4
  } else if (analysis.purchaseIntent > 6) {
    intentScore += 3
  } else if (analysis.purchaseIntent > 4) {
    intentScore += 2
  } else if (analysis.purchaseIntent > 2) {
    intentScore += 1
  }

  // Update sentiment score
  if (analysis.sentiment > 0.7) {
    sentimentScore += 3
  } else if (analysis.sentiment > 0.3) {
    sentimentScore += 2
  } else if (analysis.sentiment > 0) {
    sentimentScore += 1
  } else if (analysis.sentiment < -0.5) {
    sentimentScore -= 2
  } else if (analysis.sentiment < 0) {
    sentimentScore -= 1
  }

  // Update engagement score based on interaction type
  if (analysis.questionIntent) {
    engagementScore += 2
  }
  if (analysis.informationSharing) {
    engagementScore += 3
  }
  if (analysis.objections) {
    engagementScore += 1 // Even objections show engagement
  }

  // Update recency score (reset to max on new interaction)
  recencyScore = 5

  // Cap scores to prevent runaway scoring
  intentScore = Math.min(intentScore, 15)
  sentimentScore = Math.max(Math.min(sentimentScore, 10), -5)
  engagementScore = Math.min(engagementScore, 10)

  const totalScore = intentScore + sentimentScore + recencyScore + engagementScore

  return {
    intentScore,
    sentimentScore,
    recencyScore,
    engagementScore,
    totalScore,
  }
}

/**
 * Qualifies a lead based on its score and other criteria
 */
export async function qualifyLead(leadId: string) {
  try {
    const lead = await client.lead.findUnique({
      where: { id: leadId },
      include: { qualificationData: true },
    })

    if (!lead) {
      throw new Error(`Lead not found: ${leadId}`)
    }

    // Update the lead status to QUALIFIED
    const qualifiedLead = await client.lead.update({
      where: { id: leadId },
      data: {
        status: "QUALIFIED",
        qualifiedDate: new Date(),
        updatedAt: new Date(),
      },
    })

    // Send to n8n for further processing
    await sendLeadToN8n(qualifiedLead)

    return qualifiedLead
  } catch (error) {
    console.error("Error qualifying lead:", error)
    throw error
  }
}

/**
 * Sends qualified lead data to n8n for further processing
 */
async function sendLeadToN8n(lead: Lead) {
  try {
    const n8nLeadWebhookUrl = process.env.N8N_LEAD_WEBHOOK_URL

    if (!n8nLeadWebhookUrl) {
      console.log("N8N_LEAD_WEBHOOK_URL not configured, skipping lead notification")
      return
    }

    const response = await fetch(n8nLeadWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.N8N_API_KEY && {
          Authorization: `Bearer ${process.env.N8N_API_KEY}`,
        }),
      },
      body: JSON.stringify({
        leadId: lead.id,
        userId: lead.userId,
        instagramUserId: lead.instagramUserId,
        pageId: lead.pageId,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        status: lead.status,
        score: lead.score,
        source: lead.source,
        firstContactDate: lead.firstContactDate,
        lastContactDate: lead.lastContactDate,
        qualifiedDate: lead.qualifiedDate,
        tags: lead.tags,
        metadata: lead.metadata,
        eventType: "lead_qualified",
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      console.error(`Failed to send lead to n8n: ${response.status} ${response.statusText}`)
    } else {
      // Mark as sent to n8n and store execution details
      const responseData = await response.json()
      await client.lead.update({
        where: { id: lead.id },
        data: {
          sentToN8n: true,
          n8nExecutionId: responseData.executionId || null,
        },
      })
    }
  } catch (error) {
    console.error("Error sending lead to n8n:", error)
  }
}

/**
 * Creates a new lead from an Instagram interaction
 * Returns the lead with qualificationData included
 */
export async function createLeadFromInstagram(
  userId: string,
  automationId: string | null,
  instagramUserId: string,
  pageId: string,
  initialMessage: string,
) {
  try {
    // Create the lead
    const lead = await client.lead.create({
      data: {
        userId,
        automationId,
        instagramUserId,
        pageId,
        status: "NEW",
        score: 0,
        source: "instagram",
        firstContactDate: new Date(),
        lastContactDate: new Date(),
        sentToN8n: false,
        tags: [],
        metadata: {
          initialMessage,
          createdFrom: "webhook",
        } as Prisma.InputJsonValue,
      },
    })

    // Process the initial interaction
    await processInteraction(lead.id, initialMessage, "message", "inbound")

    // Update lead status to QUALIFYING and fetch with qualificationData
    const updatedLead = await client.lead.update({
      where: { id: lead.id },
      data: {
        status: "QUALIFYING",
        updatedAt: new Date(),
      },
      include: {
        qualificationData: true,
      },
    })

    return updatedLead
  } catch (error) {
    console.error("Error creating lead from Instagram:", error)
    throw error
  }
}

/**
 * Updates a lead's status
 */
export async function updateLeadStatus(leadId: string, status: LeadStatus, notes?: string) {
  try {
    const updateData: Prisma.LeadUpdateInput = {
      status,
      updatedAt: new Date(),
    }

    // Add status-specific date fields
    if (status === "QUALIFIED") {
      updateData.qualifiedDate = new Date()
    } else if (status === "CONVERTED") {
      updateData.convertedDate = new Date()
    }

    if (notes) {
      updateData.notes = notes
    }

    const lead = await client.lead.update({
      where: { id: leadId },
      data: updateData,
    })

    return lead
  } catch (error) {
    console.error("Error updating lead status:", error)
    throw error
  }
}

/**
 * Main function to analyze a lead from Instagram interaction
 */
export async function analyzeLeadE(params: {
  userId: string
  automationId: string
  platformId: string
  customerId: string
  message: string
  messageType: "DM" | "COMMENT"
  timestamp: Date
}) {
  try {
    const { userId, automationId, platformId, customerId, message, messageType } = params

    // Find existing lead by instagramUserId and pageId (matching schema field names)
    let lead = await client.lead.findFirst({
      where: {
        instagramUserId: customerId,
        pageId: platformId,
      },
      include: { qualificationData: true },
    })

    if (!lead) {
      // Create new lead - this now returns lead with qualificationData
      lead = await createLeadFromInstagram(userId, automationId, customerId, platformId, message)
    } else {
      // Process interaction for existing lead
      await processInteraction(lead.id, message, messageType.toLowerCase(), "inbound")

      // Refetch the lead to get updated data
      lead = await client.lead.findUnique({
        where: { id: lead.id },
        include: { qualificationData: true },
      })
    }

    return lead
  } catch (error) {
    console.error("Error analyzing lead:", error)
    return null
  }
}

/**
 * Gets lead analytics for a user
 */
export async function getLeadAnalytics(userId: string) {
  try {
    const analytics = await client.lead.groupBy({
      by: ["status"],
      where: { userId },
      _count: {
        id: true,
      },
      _avg: {
        score: true,
      },
    })

    const totalLeads = await client.lead.count({
      where: { userId },
    })

    const qualifiedLeads = await client.lead.count({
      where: {
        userId,
        status: "QUALIFIED",
      },
    })

    const convertedLeads = await client.lead.count({
      where: {
        userId,
        status: "CONVERTED",
      },
    })

    const conversionRate = totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0
    const qualificationRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0

    // Get recent interactions
    const recentInteractions = await client.leadInteraction.findMany({
      where: {
        lead: {
          userId,
        },
      },
      include: {
        lead: {
          select: {
            id: true,
            instagramUserId: true,
            name: true,
            status: true,
          },
        },
      },
      orderBy: {
        timestamp: "desc",
      },
      take: 10,
    })

    return {
      analytics,
      totalLeads,
      qualifiedLeads,
      convertedLeads,
      conversionRate: Math.round(conversionRate * 100) / 100,
      qualificationRate: Math.round(qualificationRate * 100) / 100,
      recentInteractions,
    }
  } catch (error) {
    console.error("Error getting lead analytics:", error)
    throw error
  }
}

/**
 * Gets detailed lead information with interactions
 */
export async function getLeadDetails(leadId: string) {
  try {
    const lead = await client.lead.findUnique({
      where: { id: leadId },
      include: {
        qualificationData: true,
        interactions: {
          orderBy: {
            timestamp: "desc",
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          },
        },
        automation: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return lead
  } catch (error) {
    console.error("Error getting lead details:", error)
    throw error
  }
}

/**
 * Updates lead information (name, email, phone, tags)
 */
export async function updateLeadInfo(
  leadId: string,
  updates: {
    name?: string
    email?: string
    phone?: string
    tags?: string[]
    notes?: string
  },
) {
  try {
    const lead = await client.lead.update({
      where: { id: leadId },
      data: {
        ...updates,
        updatedAt: new Date(),
      },
    })

    return lead
  } catch (error) {
    console.error("Error updating lead info:", error)
    throw error
  }
}










/**
 * Main function to analyze a lead from Instagram interaction
 * REPLACE the existing analyzeLead function with this one
 */
export async function analyzeLead(params: {
  userId: string
  automationId: string
  platformId: string
  customerId: string
  message: string
  messageType: "DM" | "COMMENT"
  timestamp: Date
}) {
  try {
    const { userId, automationId, platformId, customerId, message, messageType, timestamp } = params

    // Use upsert to handle race conditions and prevent duplicate leads
    const lead = await client.lead.upsert({
      where: {
        // This requires a unique constraint: (instagramUserId, pageId)
        instagramUserId_pageId: {
          instagramUserId: customerId,
          pageId: platformId,
        }
      },
      update: {
        // Update existing lead's last contact info
        lastContactDate: new Date(),
        updatedAt: new Date(),
        // Increment interaction counter if you have one
      },
      create: {
        // Create new lead
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
        tags: [],
        metadata: {
          initialMessage: message,
          createdFrom: "webhook",
          firstMessageTimestamp: timestamp.toISOString(),
        } as Prisma.InputJsonValue,
      },
      include: { qualificationData: true },
    })

    // Process the interaction with idempotency
    await processInteractionWithIdempotency(lead.id, message, messageType.toLowerCase(), "inbound", timestamp)

    // Update status to QUALIFYING if it's a new lead
    if (lead.status === "NEW") {
      await client.lead.update({
        where: { id: lead.id },
        data: {
          status: "QUALIFYING",
          updatedAt: new Date(),
        },
      })
    }

    // Return the updated lead with qualification data
    const updatedLead = await client.lead.findUnique({
      where: { id: lead.id },
      include: { qualificationData: true },
    })

    return updatedLead
  } catch (error) {
    console.error("Error analyzing lead:", error)
    return null
  }
}

/**
 * Processes interaction with idempotency to prevent duplicate processing
 * ADD this new function to your file
 */
export async function processInteractionWithIdempotency(
  leadId: string, 
  content: string, 
  type: string, 
  direction: string, 
  timestamp: Date
) {
  try {
    // Create a unique identifier for this interaction
    const interactionHash = Buffer.from(`${leadId}-${content}-${timestamp.toISOString()}`).toString('base64')

    // Check if this interaction already exists
    const existingInteraction = await client.leadInteraction.findFirst({
      where: {
        leadId,
        content,
        timestamp: {
          gte: new Date(timestamp.getTime() - 5000), // 5 second window
          lte: new Date(timestamp.getTime() + 5000),
        },
      },
    })

    if (existingInteraction) {
      console.log(`Interaction already processed for lead ${leadId}`)
      return existingInteraction
    }

    // Process the interaction normally
    return await processInteraction(leadId, content, type, direction)
  } catch (error) {
    console.error("Error processing interaction with idempotency:", error)
    throw error
  }
}

/**
 * REPLACE the existing processInteraction function with this updated version
 */
export async function processInteraction(leadId: string, content: string, type: string, direction: string) {
  try {
    // Analyze the message content
    const analysis = await analyzeMessage(content)

    // Create the interaction record
    const interaction = await client.leadInteraction.create({
      data: {
        leadId,
        type,
        content,
        direction,
        sentiment: analysis.sentiment,
        intent: analysis.intent as Prisma.InputJsonValue,
        timestamp: new Date(),
        metadata: {
          confidence: analysis.confidence,
          analysisTimestamp: new Date().toISOString(),
          interactionId: `${leadId}-${Date.now()}`, // Unique identifier
        } as Prisma.InputJsonValue,
      },
    })

    // Get the lead and its qualification data
    const lead = await client.lead.findUnique({
      where: { id: leadId },
      include: { qualificationData: true },
    })

    if (!lead) {
      throw new Error(`Lead not found: ${leadId}`)
    }

    // Calculate new scores based on analysis
    const scores = calculateLeadScores(lead.qualificationData, analysis)

    // Update the qualification data
    await client.leadQualificationData.upsert({
      where: { leadId },
      update: {
        intentScore: scores.intentScore,
        sentimentScore: scores.sentimentScore,
        recencyScore: scores.recencyScore,
        engagementScore: scores.engagementScore,
        aiAnalysis: {
          ...((lead.qualificationData?.aiAnalysis as Record<string, any>) || {}),
          [new Date().toISOString()]: analysis,
        } as Prisma.InputJsonValue,
        updatedAt: new Date(),
      },
      create: {
        leadId,
        intentScore: scores.intentScore,
        sentimentScore: scores.sentimentScore,
        recencyScore: scores.recencyScore,
        demographicScore: 0,
        frequencyScore: 0,
        engagementScore: scores.engagementScore,
        qualificationData: Prisma.JsonNull,
        aiAnalysis: {
          [new Date().toISOString()]: analysis,
        } as Prisma.InputJsonValue,
      },
    })

    // Update the lead with new total score and last contact date
    const updatedLead = await client.lead.update({
      where: { id: leadId },
      data: {
        score: scores.totalScore,
        lastContactDate: new Date(),
        updatedAt: new Date(),
      },
    })

    // Check if the lead should be qualified based on score
    if (scores.totalScore >= 10 && lead.status === "QUALIFYING") {
      await qualifyLead(leadId)
    }

    return {
      interaction,
      lead: updatedLead,
      analysis,
      scores,
    }
  } catch (error) {
    console.error("Error processing interaction:", error)
    throw error
  }
}

/**
 * REMOVE the createLeadFromInstagram function - it's no longer needed
 * The analyzeLead function now handles lead creation directly
 */