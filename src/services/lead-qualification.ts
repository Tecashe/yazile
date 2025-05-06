// import { generateText } from "ai"
// import { openai } from "@ai-sdk/openai"
// import { Prisma } from "@prisma/client"
// import { client } from "@/lib/prisma"
// import type { Lead } from "@prisma/client"

// // Define the valid lead statuses based on your Prisma schema
// type LeadStatus = "NEW" | "QUALIFYING" | "QUALIFIED" | "DISQUALIFIED" | "CONVERTED" | "NURTURING" | "LOST"

// /**
//  * Interface for lead analysis parameters
//  */
// interface LeadAnalysisParams {
//   userId: string
//   automationId: string
//   platformId: string
//   customerId: string
//   message: string
//   messageType: "DM" | "COMMENT"
//   timestamp: Date
// }

// /**
//  * Interface for n8n workflow parameters
//  */
// interface N8nWorkflowParams {
//   workflowId: string
//   webhookUrl: string
//   data: Record<string, any>
// }

// /**
//  * Analyzes a message for sentiment and intent using AI
//  */
// export async function analyzeMessage(message: string): Promise<any> {
//   try {
//     const { text } = await generateText({
//       model: openai("gpt-4o"),
//       prompt: `
//         Analyze the following customer message for lead qualification:
//         "${message}"
        
//         Provide a JSON response with these fields:
//         - sentiment: number from -1.0 (negative) to 1.0 (positive)
//         - purchaseIntent: number from 0 to 10
//         - questionIntent: boolean (is the person asking questions?)
//         - informationSharing: boolean (is the person sharing personal information?)
//         - objections: boolean (is the person raising concerns?)
        
//         JSON response only:
//       `,
//       system: "You are a lead qualification assistant that analyzes customer messages. Respond with JSON only.",
//     })

//     // Parse the JSON response
//     try {
//       // Clean the response to ensure it's valid JSON
//       const jsonText = text.replace(/```json|```/g, "").trim()
//       return JSON.parse(jsonText)
//     } catch (e) {
//       console.error("Failed to parse AI analysis:", e)
//       return {
//         sentiment: 0,
//         purchaseIntent: 0,
//         questionIntent: false,
//         informationSharing: false,
//         objections: false,
//       }
//     }
//   } catch (error) {
//     console.error("Error analyzing message:", error)
//     return {
//       sentiment: 0,
//       purchaseIntent: 0,
//       questionIntent: false,
//       informationSharing: false,
//       objections: false,
//     }
//   }
// }

// /**
//  * Processes a new interaction and updates lead scores
//  */
// export async function processInteraction(
//   leadId: string,
//   content: string,
//   type: string,
//   direction: string,
// ): Promise<any> {
//   try {
//     // Analyze the message content
//     const analysis = await analyzeMessage(content)

//     // Create the interaction record
//     const interaction = await client.leadInteraction.create({
//       data: {
//         leadId,
//         type,
//         content,
//         direction,
//         sentiment: analysis.sentiment,
//         intent: analysis as Prisma.InputJsonValue,
//         timestamp: new Date(),
//       },
//     })

//     // Get the lead and its qualification data
//     const lead = await client.lead.findUnique({
//       where: { id: leadId },
//       include: { qualificationData: true },
//     })

//     if (!lead) {
//       throw new Error(`Lead not found: ${leadId}`)
//     }

//     // Update qualification scores
//     let intentScore = lead.qualificationData?.intentScore || 0
//     let sentimentScore = lead.qualificationData?.sentimentScore || 0
//     let recencyScore = lead.qualificationData?.recencyScore || 0
//     let engagementScore = lead.qualificationData?.engagementScore || 0

//     // Update intent score based on purchase intent
//     if (analysis.purchaseIntent > 7) {
//       intentScore += 15
//     } else if (analysis.purchaseIntent > 5) {
//       intentScore += 10
//     } else if (analysis.purchaseIntent > 3) {
//       intentScore += 5
//     }

//     // Cap at 100
//     intentScore = Math.min(100, intentScore)

//     // Update sentiment score
//     if (analysis.sentiment > 0.5) {
//       sentimentScore += 10
//     } else if (analysis.sentiment > 0) {
//       sentimentScore += 5
//     } else if (analysis.sentiment < -0.5) {
//       sentimentScore -= 10
//     } else if (analysis.sentiment < 0) {
//       sentimentScore -= 5
//     }

//     // Keep within 0-100 range
//     sentimentScore = Math.max(0, Math.min(100, sentimentScore))

//     // Update recency score (more recent interactions get higher scores)
//     recencyScore = 100 // Reset to max when there's a new interaction

//     // Update engagement score
//     engagementScore = Math.min(100, engagementScore + 5)

//     // Calculate total score - weighted average
//     const totalScore = Math.round(
//       intentScore * 0.4 + sentimentScore * 0.3 + recencyScore * 0.15 + engagementScore * 0.15,
//     )

//     // Update the qualification data
//     await client.leadQualificationData.upsert({
//       where: { leadId },
//       update: {
//         intentScore,
//         sentimentScore,
//         recencyScore,
//         engagementScore,
//         aiAnalysis: analysis as Prisma.InputJsonValue,
//         updatedAt: new Date(),
//       },
//       create: {
//         leadId,
//         intentScore,
//         sentimentScore,
//         recencyScore,
//         engagementScore,
//         demographicScore: 0,
//         frequencyScore: 0,
//         qualificationData: Prisma.JsonNull,
//         aiAnalysis: analysis as Prisma.InputJsonValue,
//       },
//     })

//     // Update the lead score
//     await client.lead.update({
//       where: { id: leadId },
//       data: {
//         score: totalScore,
//         // lastInteractionAt is removed as it doesn't exist in your schema
//         updatedAt: new Date(),
//       },
//     })

//     // Check if the lead should be qualified based on score
//     if (totalScore >= 75 && lead.status === "QUALIFYING") {
//       await qualifyLead(leadId)
//     }

//     return interaction
//   } catch (error) {
//     console.error("Error processing interaction:", error)
//     throw error
//   }
// }

// /**
//  * Qualifies a lead based on its score and other criteria
//  */
// export async function qualifyLead(leadId: string): Promise<boolean> {
//   try {
//     const lead = await client.lead.findUnique({
//       where: { id: leadId },
//       include: {
//         qualificationData: true,
//         user: true,
//       },
//     })

//     if (!lead) {
//       throw new Error(`Lead not found: ${leadId}`)
//     }

//     // Update the lead status to QUALIFIED
//     await client.lead.update({
//       where: { id: leadId },
//       data: {
//         status: "QUALIFIED",
//         qualifiedDate: new Date(),
//         updatedAt: new Date(),
//       },
//     })

//     // Check if we should send this lead to n8n
//     const shouldSendToN8n = lead.score >= 75 && !lead.sentToN8n

//     if (shouldSendToN8n) {
//       await sendLeadToN8n(leadId, lead.userId)
//     }

//     return true
//   } catch (error) {
//     console.error("Error qualifying lead:", error)
//     throw error
//   }
// }

// /**
//  * Creates a new lead from an Instagram interaction
//  */
// export async function createLeadFromInstagram(
//   userId: string,
//   automationId: string | null,
//   instagramUserId: string,
//   pageId: string,
//   initialMessage: string,
// ): Promise<Lead> {
//   try {
//     // Create the lead
//     const lead = await client.lead.create({
//       data: {
//         userId,
//         automationId,
//         instagramUserId,
//         pageId,
//         status: "NEW",
//         score: 0,
//         // totalInteractions is removed as it doesn't exist in your schema
//         firstContactDate: new Date(),
//         lastContactDate: new Date(),
//         sentToN8n: false,
//       },
//     })

//     // Process the initial interaction
//     await processInteraction(lead.id, initialMessage, "message", "inbound")

//     // Update lead status to QUALIFYING
//     await client.lead.update({
//       where: { id: lead.id },
//       data: {
//         status: "QUALIFYING",
//       },
//     })

//     return lead
//   } catch (error) {
//     console.error("Error creating lead from Instagram:", error)
//     throw error
//   }
// }

// /**
//  * Updates a lead's status
//  */
// export async function updateLeadStatus(leadId: string, status: LeadStatus, notes?: string): Promise<Lead> {
//   try {
//     const updateData: Prisma.LeadUpdateInput = {
//       status,
//       updatedAt: new Date(),
//     }

//     if (notes) {
//       updateData.notes = notes
//     }

//     // Add date fields based on status
//     if (status === "QUALIFIED") {
//       updateData.qualifiedDate = new Date()
//     } else if (status === "CONVERTED") {
//       updateData.convertedDate = new Date()
//     }

//     const lead = await client.lead.update({
//       where: { id: leadId },
//       data: updateData,
//     })

//     return lead
//   } catch (error) {
//     console.error("Error updating lead status:", error)
//     throw error
//   }
// }

// /**
//  * Analyzes a lead based on Instagram interaction
//  */
// export async function analyzeLead(params: LeadAnalysisParams): Promise<Lead | null> {
//   try {
//     const { userId, automationId, platformId, customerId, message, messageType, timestamp } = params

//     // Find existing lead or create a new one
//     let lead = await client.lead.findFirst({
//       where: {
//         instagramUserId: customerId,
//         pageId: platformId,
//       },
//     })

//     if (!lead) {
//       // Create new lead
//       lead = await createLeadFromInstagram(userId, automationId, customerId, platformId, message)
//     } else {
//       // Process interaction for existing lead
//       await processInteraction(lead.id, message, messageType.toLowerCase(), "inbound")

//       // Update last contact date
//       await client.lead.update({
//         where: { id: lead.id },
//         data: {
//           lastContactDate: timestamp,
//         },
//       })
//     }

//     return lead
//   } catch (error) {
//     console.error("Error analyzing lead:", error)
//     return null
//   }
// }

// /**
//  * Sends a lead to n8n for further processing
//  */
// export async function sendLeadToN8n(leadId: string, userId: string): Promise<boolean> {
//   try {
//     // Get the lead with all related data
//     const lead = await client.lead.findUnique({
//       where: { id: leadId },
//       include: {
//         qualificationData: true,
//         interactions: {
//           orderBy: { timestamp: "desc" },
//           take: 10,
//         },
//       },
//     })

//     if (!lead) {
//       throw new Error(`Lead not found: ${leadId}`)
//     }

//     // Get active n8n workflows for this user
//     const workflows = await client.n8nWorkflow.findMany({
//       where: {
//         userId,
//         isActive: true,
//       },
//     })

//     if (!workflows || workflows.length === 0) {
//       console.log("No active n8n workflows found for user:", userId)
//       return false
//     }

//     // Find the lead qualification workflow
//     const qualificationWorkflow =
//       workflows.find(
//         (w) => w.name.toLowerCase().includes("qualification") || w.description?.toLowerCase().includes("qualification"),
//       ) || workflows[0] // Fallback to first workflow if none matches

//     // Check if the workflow has a triggerUrl (not webhookUrl)
//     if (!qualificationWorkflow.triggerUrl) {
//       throw new Error("Workflow has no trigger URL")
//     }

//     // Format lead data for n8n
//     const leadData = {
//       lead: {
//         id: lead.id,
//         name: lead.name,
//         email: lead.email,
//         phone: lead.phone,
//         score: lead.score,
//         status: lead.status,
//         source: lead.source || "Instagram",
//         instagramUserId: lead.instagramUserId,
//         pageId: lead.pageId,
//         firstContactDate: lead.firstContactDate,
//         lastContactDate: lead.lastContactDate,
//         qualifiedDate: lead.qualifiedDate,
//         convertedDate: lead.convertedDate,
//         notes: lead.notes,
//         tags: lead.tags,
//         metadata: lead.metadata,
//       },
//       qualificationData: {
//         engagementScore: lead.qualificationData?.engagementScore || 0,
//         intentScore: lead.qualificationData?.intentScore || 0,
//         sentimentScore: lead.qualificationData?.sentimentScore || 0,
//         demographicScore: lead.qualificationData?.demographicScore || 0,
//         frequencyScore: lead.qualificationData?.frequencyScore || 0,
//         recencyScore: lead.qualificationData?.recencyScore || 0,
//         aiAnalysis: lead.qualificationData?.aiAnalysis || null,
//       },
//       recentInteractions: lead.interactions.map((interaction) => ({
//         type: interaction.type,
//         content: interaction.content,
//         direction: interaction.direction,
//         timestamp: interaction.timestamp,
//         sentiment: interaction.sentiment,
//       })),
//       timestamp: new Date().toISOString(),
//     }

//     // Send to n8n
//     const success = await triggerN8nWorkflow({
//       workflowId: qualificationWorkflow.workflowId,
//       webhookUrl: qualificationWorkflow.triggerUrl, // Use triggerUrl instead of webhookUrl
//       data: leadData,
//     })

//     if (success) {
//       // Mark as sent to n8n
//       await client.lead.update({
//         where: { id: leadId },
//         data: {
//           sentToN8n: true,
//           // sentToN8nAt is removed as it doesn't exist in your schema
//           n8nWorkflowId: qualificationWorkflow.workflowId,
//         },
//       })

//       // Update workflow execution stats
//       await client.n8nWorkflow.update({
//         where: { id: qualificationWorkflow.id },
//         data: {
//           lastExecuted: new Date(),
//           executionCount: { increment: 1 },
//           successCount: { increment: 1 },
//         },
//       })

//       return true
//     }

//     return false
//   } catch (error) {
//     console.error("Error sending lead to n8n:", error)

//     // Log the error to console instead of using errorLog model
//     console.error("Lead qualification error:", {
//       service: "lead-qualification",
//       action: "sendLeadToN8n",
//       message: error instanceof Error ? error.message : String(error),
//       leadId,
//     })

//     return false
//   }
// }

// /**
//  * Triggers an n8n workflow by sending data to its webhook URL
//  */
// export async function triggerN8nWorkflow(params: N8nWorkflowParams): Promise<boolean> {
//   try {
//     const { webhookUrl, data } = params

//     // Send data to n8n webhook
//     const response = await fetch(webhookUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     })

//     if (!response.ok) {
//       const errorText = await response.text()
//       console.error(`Error triggering n8n workflow: ${response.status} ${errorText}`)
//       return false
//     }

//     console.log(`Successfully triggered n8n workflow: ${params.workflowId}`)
//     return true
//   } catch (error) {
//     console.error("Error triggering n8n workflow:", error)
//     return false
//   }
// }

// /**
//  * Manually sends a lead to n8n from the dashboard
//  */
// export async function manualSendLeadToN8n(
//   leadId: string,
//   workflowId: string,
// ): Promise<{ success: boolean; message: string }> {
//   try {
//     // Get the lead
//     const lead = await client.lead.findUnique({
//       where: { id: leadId },
//       include: {
//         qualificationData: true,
//         interactions: {
//           orderBy: { timestamp: "desc" },
//           take: 10,
//         },
//       },
//     })

//     if (!lead) {
//       return { success: false, message: "Lead not found" }
//     }

//     // Get the workflow
//     const workflow = await client.n8nWorkflow.findFirst({
//       where: { workflowId },
//     })

//     if (!workflow || !workflow.triggerUrl) {
//       // Use triggerUrl instead of webhookUrl
//       return { success: false, message: "Workflow not found or missing trigger URL" }
//     }

//     // Format lead data for n8n (same as in sendLeadToN8n)
//     const leadData = {
//       lead: {
//         id: lead.id,
//         name: lead.name,
//         email: lead.email,
//         phone: lead.phone,
//         score: lead.score,
//         status: lead.status,
//         source: lead.source || "Instagram",
//         instagramUserId: lead.instagramUserId,
//         pageId: lead.pageId,
//         firstContactDate: lead.firstContactDate,
//         lastContactDate: lead.lastContactDate,
//         qualifiedDate: lead.qualifiedDate,
//         convertedDate: lead.convertedDate,
//         notes: lead.notes,
//         tags: lead.tags,
//         metadata: lead.metadata,
//       },
//       qualificationData: {
//         engagementScore: lead.qualificationData?.engagementScore || 0,
//         intentScore: lead.qualificationData?.intentScore || 0,
//         sentimentScore: lead.qualificationData?.sentimentScore || 0,
//         demographicScore: lead.qualificationData?.demographicScore || 0,
//         frequencyScore: lead.qualificationData?.frequencyScore || 0,
//         recencyScore: lead.qualificationData?.recencyScore || 0,
//         aiAnalysis: lead.qualificationData?.aiAnalysis || null,
//       },
//       recentInteractions: lead.interactions.map((interaction) => ({
//         type: interaction.type,
//         content: interaction.content,
//         direction: interaction.direction,
//         timestamp: interaction.timestamp,
//         sentiment: interaction.sentiment,
//       })),
//       timestamp: new Date().toISOString(),
//       manualTrigger: true,
//     }

//     // Send to n8n
//     const success = await triggerN8nWorkflow({
//       workflowId: workflow.workflowId,
//       webhookUrl: workflow.triggerUrl, // Use triggerUrl instead of webhookUrl
//       data: leadData,
//     })

//     if (success) {
//       // Mark as sent to n8n
//       await client.lead.update({
//         where: { id: leadId },
//         data: {
//           sentToN8n: true,
//           // sentToN8nAt is removed as it doesn't exist in your schema
//           n8nWorkflowId: workflow.workflowId,
//         },
//       })

//       // Update workflow execution stats
//       await client.n8nWorkflow.update({
//         where: { id: workflow.id },
//         data: {
//           lastExecuted: new Date(),
//           executionCount: { increment: 1 },
//           successCount: { increment: 1 },
//         },
//       })

//       return { success: true, message: "Lead successfully sent to n8n" }
//     }

//     return { success: false, message: "Failed to send lead to n8n" }
//   } catch (error) {
//     console.error("Error manually sending lead to n8n:", error)
//     return {
//       success: false,
//       message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
//     }
//   }
// }


import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { Prisma } from "@prisma/client"
import { client } from "@/lib/prisma"
import type { Lead, LeadStatus } from "@prisma/client"

/**
 * Interface for lead analysis parameters
 */
interface LeadAnalysisParams {
  userId: string
  automationId: string
  platformId: string
  customerId: string
  message: string
  messageType: "DM" | "COMMENT"
  timestamp: Date
}

/**
 * Interface for n8n workflow parameters
 */
interface N8nWorkflowParams {
  workflowId: string
  webhookUrl: string
  data: Record<string, any>
}

/**
 * Analyzes a message for sentiment and intent using AI
 */
export async function analyzeMessage(message: string): Promise<any> {
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
    }
  }
}

/**
 * Processes a new interaction and updates lead scores
 */
export async function processInteraction(
  leadId: string,
  content: string,
  type: string,
  direction: string,
): Promise<any> {
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
        intent: analysis as Prisma.InputJsonValue,
        timestamp: new Date(),
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

    // Update qualification scores
    let intentScore = lead.qualificationData?.intentScore || 0
    let sentimentScore = lead.qualificationData?.sentimentScore || 0
    let recencyScore = lead.qualificationData?.recencyScore || 0
    let engagementScore = lead.qualificationData?.engagementScore || 0

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

    // Update recency score (more recent interactions get higher scores)
    recencyScore = 100 // Reset to max when there's a new interaction

    // Update engagement score
    engagementScore = Math.min(100, engagementScore + 5)

    // Calculate total score - weighted average
    const totalScore = Math.round(
      intentScore * 0.4 + sentimentScore * 0.3 + recencyScore * 0.15 + engagementScore * 0.15,
    )

    // Update the qualification data
    await client.leadQualificationData.upsert({
      where: { leadId },
      update: {
        intentScore,
        sentimentScore,
        recencyScore,
        engagementScore,
        aiAnalysis: analysis as Prisma.InputJsonValue,
        updatedAt: new Date(),
      },
      create: {
        leadId,
        intentScore,
        sentimentScore,
        recencyScore,
        engagementScore,
        demographicScore: 0,
        frequencyScore: 0,
        qualificationData: Prisma.JsonNull,
        aiAnalysis: analysis as Prisma.InputJsonValue,
      },
    })

    // Update the lead score
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
      await qualifyLead(leadId)
    }

    return interaction
  } catch (error) {
    console.error("Error processing interaction:", error)
    throw error
  }
}

/**
 * Qualifies a lead based on its score and other criteria
 */
export async function qualifyLead(leadId: string): Promise<boolean> {
  try {
    const lead = await client.lead.findUnique({
      where: { id: leadId },
      include: {
        qualificationData: true,
        user: true,
      },
    })

    if (!lead) {
      throw new Error(`Lead not found: ${leadId}`)
    }

    // Update the lead status to QUALIFIED
    await client.lead.update({
      where: { id: leadId },
      data: {
        status: "QUALIFIED",
        qualifiedDate: new Date(),
        updatedAt: new Date(),
      },
    })

    // Check if we should send this lead to n8n
    const shouldSendToN8n = lead.score >= 75 && !lead.sentToN8n

    if (shouldSendToN8n) {
      await sendLeadToN8n(leadId, lead.userId)
    }

    return true
  } catch (error) {
    console.error("Error qualifying lead:", error)
    throw error
  }
}

/**
 * Creates a new lead from an Instagram interaction
 */
export async function createLeadFromInstagram(
  userId: string,
  automationId: string | null,
  instagramUserId: string,
  pageId: string,
  initialMessage: string,
): Promise<Lead> {
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
        firstContactDate: new Date(),
        lastContactDate: new Date(),
        sentToN8n: false,
      },
    })

    // Process the initial interaction
    await processInteraction(lead.id, initialMessage, "message", "inbound")

    // Update lead status to QUALIFYING
    await client.lead.update({
      where: { id: lead.id },
      data: {
        status: "QUALIFYING",
      },
    })

    return lead
  } catch (error) {
    console.error("Error creating lead from Instagram:", error)
    throw error
  }
}

/**
 * Updates a lead's status
 */
export async function updateLeadStatus(leadId: string, status: LeadStatus, notes?: string): Promise<Lead> {
  try {
    const updateData: Prisma.LeadUpdateInput = {
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
 * Analyzes a lead based on Instagram interaction
 */
export async function analyzeLead(params: LeadAnalysisParams): Promise<Lead | null> {
  try {
    const { userId, automationId, platformId, customerId, message, messageType, timestamp } = params

    // Find existing lead or create a new one
    let lead = await client.lead.findFirst({
      where: {
        instagramUserId: customerId,
        pageId: platformId,
      },
    })

    if (!lead) {
      // Create new lead
      lead = await createLeadFromInstagram(userId, automationId, customerId, platformId, message)
    } else {
      // Process interaction for existing lead
      await processInteraction(lead.id, message, messageType.toLowerCase(), "inbound")

      // Update last contact date
      await client.lead.update({
        where: { id: lead.id },
        data: {
          lastContactDate: timestamp,
        },
      })
    }

    return lead
  } catch (error) {
    console.error("Error analyzing lead:", error)
    return null
  }
}

/**
 * Sends a lead to n8n for further processing
 */
export async function sendLeadToN8n(leadId: string, userId: string): Promise<boolean> {
  try {
    // Get the lead with all related data
    const lead = await client.lead.findUnique({
      where: { id: leadId },
      include: {
        qualificationData: true,
        interactions: {
          orderBy: { timestamp: "desc" },
          take: 10,
        },
      },
    })

    if (!lead) {
      throw new Error(`Lead not found: ${leadId}`)
    }

    // Get active n8n workflows for this user
    const workflows = await client.n8nWorkflow.findMany({
      where: {
        userId,
        isActive: true,
      },
    })

    if (!workflows || workflows.length === 0) {
      console.log("No active n8n workflows found for user:", userId)
      return false
    }

    // Find the lead qualification workflow
    const qualificationWorkflow =
      workflows.find(
        (w) => w.name.toLowerCase().includes("qualification") || w.description?.toLowerCase().includes("qualification"),
      ) || workflows[0] // Fallback to first workflow if none matches

    // Check if the workflow has a triggerUrl
    if (!qualificationWorkflow.triggerUrl) {
      throw new Error("Workflow has no trigger URL")
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
        source: lead.source || "Instagram",
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

    // Send to n8n
    const success = await triggerN8nWorkflow({
      workflowId: qualificationWorkflow.workflowId,
      webhookUrl: qualificationWorkflow.triggerUrl,
      data: leadData,
    })

    if (success) {
      // Mark as sent to n8n
      await client.lead.update({
        where: { id: leadId },
        data: {
          sentToN8n: true,
          n8nWorkflowId: qualificationWorkflow.workflowId,
        },
      })

      // Update workflow execution stats
      await client.n8nWorkflow.update({
        where: { id: qualificationWorkflow.id },
        data: {
          lastExecuted: new Date(),
          executionCount: { increment: 1 },
          successCount: { increment: 1 },
        },
      })

      return true
    }

    return false
  } catch (error) {
    console.error("Error sending lead to n8n:", error)

    // Log the error to console
    console.error("Lead qualification error:", {
      service: "lead-qualification",
      action: "sendLeadToN8n",
      message: error instanceof Error ? error.message : String(error),
      leadId,
    })

    return false
  }
}

/**
 * Triggers an n8n workflow by sending data to its webhook URL
 */
export async function triggerN8nWorkflow(params: N8nWorkflowParams): Promise<boolean> {
  try {
    const { webhookUrl, data } = params

    // Send data to n8n webhook
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Error triggering n8n workflow: ${response.status} ${errorText}`)
      return false
    }

    console.log(`Successfully triggered n8n workflow: ${params.workflowId}`)
    return true
  } catch (error) {
    console.error("Error triggering n8n workflow:", error)
    return false
  }
}

/**
 * Manually sends a lead to n8n from the dashboard
 */
export async function manualSendLeadToN8n(
  leadId: string,
  workflowId: string,
): Promise<{ success: boolean; message: string }> {
  try {
    // Get the lead
    const lead = await client.lead.findUnique({
      where: { id: leadId },
      include: {
        qualificationData: true,
        interactions: {
          orderBy: { timestamp: "desc" },
          take: 10,
        },
      },
    })

    if (!lead) {
      return { success: false, message: "Lead not found" }
    }

    // Get the workflow
    const workflow = await client.n8nWorkflow.findFirst({
      where: { workflowId },
    })

    if (!workflow || !workflow.triggerUrl) {
      return { success: false, message: "Workflow not found or missing trigger URL" }
    }

    // Format lead data for n8n (same as in sendLeadToN8n)
    const leadData = {
      lead: {
        id: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        score: lead.score,
        status: lead.status,
        source: lead.source || "Instagram",
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
      manualTrigger: true,
    }

    // Send to n8n
    const success = await triggerN8nWorkflow({
      workflowId: workflow.workflowId,
      webhookUrl: workflow.triggerUrl,
      data: leadData,
    })

    if (success) {
      // Mark as sent to n8n
      await client.lead.update({
        where: { id: leadId },
        data: {
          sentToN8n: true,
          n8nWorkflowId: workflow.workflowId,
        },
      })

      // Update workflow execution stats
      await client.n8nWorkflow.update({
        where: { id: workflow.id },
        data: {
          lastExecuted: new Date(),
          executionCount: { increment: 1 },
          successCount: { increment: 1 },
        },
      })

      return { success: true, message: "Lead successfully sent to n8n" }
    }

    return { success: false, message: "Failed to send lead to n8n" }
  } catch (error) {
    console.error("Error manually sending lead to n8n:", error)
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}
