// import { client } from "@/lib/prisma"
// import { Prisma } from "@prisma/client"
// import type { LeadStatus, Lead } from "@prisma/client"


// /**
//  * Analyzes a message for sentiment and intent using n8n workflow
//  */
// export async function analyzeMessage(message: string) {
//   try {
//     const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || "https://yaziln8n.onrender.com/webhook/analyze-message"

//     const response = await fetch(n8nWebhookUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         ...(process.env.N8N_API_KEY && {
//           Authorization: `Bearer ${process.env.N8N_API_KEY}`,
//         }),
//       },
//       body: JSON.stringify({
//         message: message,
//         analysisType: "lead_qualification",
//         timestamp: new Date().toISOString(),
//       }),
//     })

//     if (!response.ok) {
//       throw new Error(`n8n request failed: ${response.status} ${response.statusText}`)
//     }

//     const analysis = await response.json()

//     // Ensure the response has the expected structure
//     return {
//       sentiment: Number(analysis.sentiment) || 0,
//       purchaseIntent: Number(analysis.purchaseIntent) || 0,
//       questionIntent: Boolean(analysis.questionIntent),
//       informationSharing: Boolean(analysis.informationSharing),
//       objections: Boolean(analysis.objections),
//       intent: analysis.intent || null,
//       confidence: Number(analysis.confidence) || 0,
//     }
//   } catch (error) {
//     console.error("Error analyzing message with n8n:", error)
//     // Return default values on error
//     return {
//       sentiment: 0,
//       purchaseIntent: 0,
//       questionIntent: false,
//       informationSharing: false,
//       objections: false,
//       intent: null,
//       confidence: 0,
//     }
//   }
// }

// /**
//  * Processes a new interaction and updates lead scores
//  */
// export async function processInteractionE(leadId: string, content: string, type: string, direction: string) {
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
//         intent: analysis.intent as Prisma.InputJsonValue,
//         timestamp: new Date(),
//         metadata: {
//           confidence: analysis.confidence,
//           analysisTimestamp: new Date().toISOString(),
//         } as Prisma.InputJsonValue,
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

//     // Calculate new scores based on analysis
//     const scores = calculateLeadScores(lead.qualificationData, analysis)

//     // Update the qualification data
//     await client.leadQualificationData.upsert({
//       where: { leadId },
//       update: {
//         intentScore: scores.intentScore,
//         sentimentScore: scores.sentimentScore,
//         recencyScore: scores.recencyScore,
//         engagementScore: scores.engagementScore,
//         aiAnalysis: {
//           ...((lead.qualificationData?.aiAnalysis as Record<string, any>) || {}),
//           [new Date().toISOString()]: analysis,
//         } as Prisma.InputJsonValue,
//         updatedAt: new Date(),
//       },
//       create: {
//         leadId,
//         intentScore: scores.intentScore,
//         sentimentScore: scores.sentimentScore,
//         recencyScore: scores.recencyScore,
//         demographicScore: 0,
//         frequencyScore: 0,
//         engagementScore: scores.engagementScore,
//         qualificationData: Prisma.JsonNull,
//         aiAnalysis: {
//           [new Date().toISOString()]: analysis,
//         } as Prisma.InputJsonValue,
//       },
//     })

//     // Update the lead with new total score and last contact date
//     const updatedLead = await client.lead.update({
//       where: { id: leadId },
//       data: {
//         score: scores.totalScore,
//         lastContactDate: new Date(),
//         updatedAt: new Date(),
//       },
//     })

//     // Check if the lead should be qualified based on score
//     if (scores.totalScore >= 10 && lead.status === "QUALIFYING") {
//       await qualifyLead(leadId)
//     }

//     return {
//       interaction,
//       lead: updatedLead,
//       analysis,
//       scores,
//     }
//   } catch (error) {
//     console.error("Error processing interaction:", error)
//     throw error
//   }
// }

// /**
//  * Calculates lead scores based on current data and new analysis
//  */
// function calculateLeadScores(currentData: any, analysis: any) {
//   // Get current scores or default to 0
//   let intentScore = currentData?.intentScore || 0
//   let sentimentScore = currentData?.sentimentScore || 0
//   let recencyScore = currentData?.recencyScore || 0
//   let engagementScore = currentData?.engagementScore || 0

//   // Update intent score based on purchase intent
//   if (analysis.purchaseIntent > 8) {
//     intentScore += 4
//   } else if (analysis.purchaseIntent > 6) {
//     intentScore += 3
//   } else if (analysis.purchaseIntent > 4) {
//     intentScore += 2
//   } else if (analysis.purchaseIntent > 2) {
//     intentScore += 1
//   }

//   // Update sentiment score
//   if (analysis.sentiment > 0.7) {
//     sentimentScore += 3
//   } else if (analysis.sentiment > 0.3) {
//     sentimentScore += 2
//   } else if (analysis.sentiment > 0) {
//     sentimentScore += 1
//   } else if (analysis.sentiment < -0.5) {
//     sentimentScore -= 2
//   } else if (analysis.sentiment < 0) {
//     sentimentScore -= 1
//   }

//   // Update engagement score based on interaction type
//   if (analysis.questionIntent) {
//     engagementScore += 2
//   }
//   if (analysis.informationSharing) {
//     engagementScore += 3
//   }
//   if (analysis.objections) {
//     engagementScore += 1 // Even objections show engagement
//   }

//   // Update recency score (reset to max on new interaction)
//   recencyScore = 5

//   // Cap scores to prevent runaway scoring
//   intentScore = Math.min(intentScore, 15)
//   sentimentScore = Math.max(Math.min(sentimentScore, 10), -5)
//   engagementScore = Math.min(engagementScore, 10)

//   const totalScore = intentScore + sentimentScore + recencyScore + engagementScore

//   return {
//     intentScore,
//     sentimentScore,
//     recencyScore,
//     engagementScore,
//     totalScore,
//   }
// }

// /**
//  * Qualifies a lead based on its score and other criteria
//  */
// export async function qualifyLead(leadId: string) {
//   try {
//     const lead = await client.lead.findUnique({
//       where: { id: leadId },
//       include: { qualificationData: true },
//     })

//     if (!lead) {
//       throw new Error(`Lead not found: ${leadId}`)
//     }

//     // Update the lead status to QUALIFIED
//     const qualifiedLead = await client.lead.update({
//       where: { id: leadId },
//       data: {
//         status: "QUALIFIED",
//         qualifiedDate: new Date(),
//         updatedAt: new Date(),
//       },
//     })

//     // Send to n8n for further processing
//     await sendLeadToN8n(qualifiedLead)

//     return qualifiedLead
//   } catch (error) {
//     console.error("Error qualifying lead:", error)
//     throw error
//   }
// }

// /**
//  * Sends qualified lead data to n8n for further processing
//  */
// async function sendLeadToN8n(lead: Lead) {
//   try {
//     const n8nLeadWebhookUrl = process.env.N8N_LEAD_WEBHOOK_URL

//     if (!n8nLeadWebhookUrl) {
//       console.log("N8N_LEAD_WEBHOOK_URL not configured, skipping lead notification")
//       return
//     }

//     const response = await fetch(n8nLeadWebhookUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         ...(process.env.N8N_API_KEY && {
//           Authorization: `Bearer ${process.env.N8N_API_KEY}`,
//         }),
//       },
//       body: JSON.stringify({
//         leadId: lead.id,
//         userId: lead.userId,
//         instagramUserId: lead.instagramUserId,
//         pageId: lead.pageId,
//         name: lead.name,
//         email: lead.email,
//         phone: lead.phone,
//         status: lead.status,
//         score: lead.score,
//         source: lead.source,
//         firstContactDate: lead.firstContactDate,
//         lastContactDate: lead.lastContactDate,
//         qualifiedDate: lead.qualifiedDate,
//         tags: lead.tags,
//         metadata: lead.metadata,
//         eventType: "lead_qualified",
//         timestamp: new Date().toISOString(),
//       }),
//     })

//     if (!response.ok) {
//       console.error(`Failed to send lead to n8n: ${response.status} ${response.statusText}`)
//     } else {
//       // Mark as sent to n8n and store execution details
//       const responseData = await response.json()
//       await client.lead.update({
//         where: { id: lead.id },
//         data: {
//           sentToN8n: true,
//           n8nExecutionId: responseData.executionId || null,
//         },
//       })
//     }
//   } catch (error) {
//     console.error("Error sending lead to n8n:", error)
//   }
// }

// /**
//  * Creates a new lead from an Instagram interaction
//  * Returns the lead with qualificationData included
//  */
// export async function createLeadFromInstagram(
//   userId: string,
//   automationId: string | null,
//   instagramUserId: string,
//   pageId: string,
//   initialMessage: string,
// ) {
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
//         source: "instagram",
//         firstContactDate: new Date(),
//         lastContactDate: new Date(),
//         sentToN8n: false,
//         tags: [],
//         metadata: {
//           initialMessage,
//           createdFrom: "webhook",
//         } as Prisma.InputJsonValue,
//       },
//     })

//     // Process the initial interaction
//     await processInteraction(lead.id, initialMessage, "message", "inbound")

//     // Update lead status to QUALIFYING and fetch with qualificationData
//     const updatedLead = await client.lead.update({
//       where: { id: lead.id },
//       data: {
//         status: "QUALIFYING",
//         updatedAt: new Date(),
//       },
//       include: {
//         qualificationData: true,
//       },
//     })

//     return updatedLead
//   } catch (error) {
//     console.error("Error creating lead from Instagram:", error)
//     throw error
//   }
// }

// /**
//  * Updates a lead's status
//  */
// export async function updateLeadStatus(leadId: string, status: LeadStatus, notes?: string) {
//   try {
//     const updateData: Prisma.LeadUpdateInput = {
//       status,
//       updatedAt: new Date(),
//     }

//     // Add status-specific date fields
//     if (status === "QUALIFIED") {
//       updateData.qualifiedDate = new Date()
//     } else if (status === "CONVERTED") {
//       updateData.convertedDate = new Date()
//     }

//     if (notes) {
//       updateData.notes = notes
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
//  * Main function to analyze a lead from Instagram interaction
//  */
// export async function analyzeLeadE(params: {
//   userId: string
//   automationId: string
//   platformId: string
//   customerId: string
//   message: string
//   messageType: "DM" | "COMMENT"
//   timestamp: Date
// }) {
//   try {
//     const { userId, automationId, platformId, customerId, message, messageType } = params

//     // Find existing lead by instagramUserId and pageId (matching schema field names)
//     let lead = await client.lead.findFirst({
//       where: {
//         instagramUserId: customerId,
//         pageId: platformId,
//       },
//       include: { qualificationData: true },
//     })

//     if (!lead) {
//       // Create new lead - this now returns lead with qualificationData
//       lead = await createLeadFromInstagram(userId, automationId, customerId, platformId, message)
//     } else {
//       // Process interaction for existing lead
//       await processInteraction(lead.id, message, messageType.toLowerCase(), "inbound")

//       // Refetch the lead to get updated data
//       lead = await client.lead.findUnique({
//         where: { id: lead.id },
//         include: { qualificationData: true },
//       })
//     }

//     return lead
//   } catch (error) {
//     console.error("Error analyzing lead:", error)
//     return null
//   }
// }

// /**
//  * Gets lead analytics for a user
//  */
// export async function getLeadAnalytics(userId: string) {
//   try {
//     const analytics = await client.lead.groupBy({
//       by: ["status"],
//       where: { userId },
//       _count: {
//         id: true,
//       },
//       _avg: {
//         score: true,
//       },
//     })

//     const totalLeads = await client.lead.count({
//       where: { userId },
//     })

//     const qualifiedLeads = await client.lead.count({
//       where: {
//         userId,
//         status: "QUALIFIED",
//       },
//     })

//     const convertedLeads = await client.lead.count({
//       where: {
//         userId,
//         status: "CONVERTED",
//       },
//     })

//     const conversionRate = totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0
//     const qualificationRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0

//     // Get recent interactions
//     const recentInteractions = await client.leadInteraction.findMany({
//       where: {
//         lead: {
//           userId,
//         },
//       },
//       include: {
//         lead: {
//           select: {
//             id: true,
//             instagramUserId: true,
//             name: true,
//             status: true,
//           },
//         },
//       },
//       orderBy: {
//         timestamp: "desc",
//       },
//       take: 10,
//     })

//     return {
//       analytics,
//       totalLeads,
//       qualifiedLeads,
//       convertedLeads,
//       conversionRate: Math.round(conversionRate * 100) / 100,
//       qualificationRate: Math.round(qualificationRate * 100) / 100,
//       recentInteractions,
//     }
//   } catch (error) {
//     console.error("Error getting lead analytics:", error)
//     throw error
//   }
// }

// /**
//  * Gets detailed lead information with interactions
//  */
// export async function getLeadDetails(leadId: string) {
//   try {
//     const lead = await client.lead.findUnique({
//       where: { id: leadId },
//       include: {
//         qualificationData: true,
//         interactions: {
//           orderBy: {
//             timestamp: "desc",
//           },
//         },
//         user: {
//           select: {
//             id: true,
//             email: true,
//             firstname: true,
//             lastname: true,
//           },
//         },
//         automation: {
//           select: {
//             id: true,
//             name: true,
//           },
//         },
//       },
//     })

//     return lead
//   } catch (error) {
//     console.error("Error getting lead details:", error)
//     throw error
//   }
// }

// /**
//  * Updates lead information (name, email, phone, tags)
//  */
// export async function updateLeadInfo(
//   leadId: string,
//   updates: {
//     name?: string
//     email?: string
//     phone?: string
//     tags?: string[]
//     notes?: string
//   },
// ) {
//   try {
//     const lead = await client.lead.update({
//       where: { id: leadId },
//       data: {
//         ...updates,
//         updatedAt: new Date(),
//       },
//     })

//     return lead
//   } catch (error) {
//     console.error("Error updating lead info:", error)
//     throw error
//   }
// }










// /**
//  * Main function to analyze a lead from Instagram interaction
//  * REPLACE the existing analyzeLead function with this one
//  */
// export async function analyzeLead(params: {
//   userId: string
//   automationId: string
//   platformId: string
//   customerId: string
//   message: string
//   messageType: "DM" | "COMMENT"
//   timestamp: Date
// }) {
//   try {
//     const { userId, automationId, platformId, customerId, message, messageType, timestamp } = params

//     // Use upsert to handle race conditions and prevent duplicate leads
//     const lead = await client.lead.upsert({
//       where: {
//         // This requires a unique constraint: (instagramUserId, pageId)
//         instagramUserId_pageId: {
//           instagramUserId: customerId,
//           pageId: platformId,
//         }
//       },
//       update: {
//         // Update existing lead's last contact info
//         lastContactDate: new Date(),
//         updatedAt: new Date(),
//         // Increment interaction counter if you have one
//       },
//       create: {
//         // Create new lead
//         userId,
//         automationId,
//         instagramUserId: customerId,
//         pageId: platformId,
//         status: "NEW",
//         score: 0,
//         source: "instagram",
//         firstContactDate: new Date(),
//         lastContactDate: new Date(),
//         sentToN8n: false,
//         tags: [],
//         metadata: {
//           initialMessage: message,
//           createdFrom: "webhook",
//           firstMessageTimestamp: timestamp.toISOString(),
//         } as Prisma.InputJsonValue,
//       },
//       include: { qualificationData: true },
//     })

//     // Process the interaction with idempotency
//     await processInteractionWithIdempotency(lead.id, message, messageType.toLowerCase(), "inbound", timestamp)

//     // Update status to QUALIFYING if it's a new lead
//     if (lead.status === "NEW") {
//       await client.lead.update({
//         where: { id: lead.id },
//         data: {
//           status: "QUALIFYING",
//           updatedAt: new Date(),
//         },
//       })
//     }

//     // Return the updated lead with qualification data
//     const updatedLead = await client.lead.findUnique({
//       where: { id: lead.id },
//       include: { qualificationData: true },
//     })

//     return updatedLead
//   } catch (error) {
//     console.error("Error analyzing lead:", error)
//     return null
//   }
// }

// /**
//  * Processes interaction with idempotency to prevent duplicate processing
//  * ADD this new function to your file
//  */
// export async function processInteractionWithIdempotency(
//   leadId: string, 
//   content: string, 
//   type: string, 
//   direction: string, 
//   timestamp: Date
// ) {
//   try {
//     // Create a unique identifier for this interaction
//     const interactionHash = Buffer.from(`${leadId}-${content}-${timestamp.toISOString()}`).toString('base64')

//     // Check if this interaction already exists
//     const existingInteraction = await client.leadInteraction.findFirst({
//       where: {
//         leadId,
//         content,
//         timestamp: {
//           gte: new Date(timestamp.getTime() - 5000), // 5 second window
//           lte: new Date(timestamp.getTime() + 5000),
//         },
//       },
//     })

//     if (existingInteraction) {
//       console.log(`Interaction already processed for lead ${leadId}`)
//       return existingInteraction
//     }

//     // Process the interaction normally
//     return await processInteraction(leadId, content, type, direction)
//   } catch (error) {
//     console.error("Error processing interaction with idempotency:", error)
//     throw error
//   }
// }

// /**
//  * REPLACE the existing processInteraction function with this updated version
//  */
// export async function processInteraction(leadId: string, content: string, type: string, direction: string) {
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
//         intent: analysis.intent as Prisma.InputJsonValue,
//         timestamp: new Date(),
//         metadata: {
//           confidence: analysis.confidence,
//           analysisTimestamp: new Date().toISOString(),
//           interactionId: `${leadId}-${Date.now()}`, // Unique identifier
//         } as Prisma.InputJsonValue,
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

//     // Calculate new scores based on analysis
//     const scores = calculateLeadScores(lead.qualificationData, analysis)

//     // Update the qualification data
//     await client.leadQualificationData.upsert({
//       where: { leadId },
//       update: {
//         intentScore: scores.intentScore,
//         sentimentScore: scores.sentimentScore,
//         recencyScore: scores.recencyScore,
//         engagementScore: scores.engagementScore,
//         aiAnalysis: {
//           ...((lead.qualificationData?.aiAnalysis as Record<string, any>) || {}),
//           [new Date().toISOString()]: analysis,
//         } as Prisma.InputJsonValue,
//         updatedAt: new Date(),
//       },
//       create: {
//         leadId,
//         intentScore: scores.intentScore,
//         sentimentScore: scores.sentimentScore,
//         recencyScore: scores.recencyScore,
//         demographicScore: 0,
//         frequencyScore: 0,
//         engagementScore: scores.engagementScore,
//         qualificationData: Prisma.JsonNull,
//         aiAnalysis: {
//           [new Date().toISOString()]: analysis,
//         } as Prisma.InputJsonValue,
//       },
//     })

//     // Update the lead with new total score and last contact date
//     const updatedLead = await client.lead.update({
//       where: { id: leadId },
//       data: {
//         score: scores.totalScore,
//         lastContactDate: new Date(),
//         updatedAt: new Date(),
//       },
//     })

//     // Check if the lead should be qualified based on score
//     if (scores.totalScore >= 10 && lead.status === "QUALIFYING") {
//       await qualifyLead(leadId)
//     }

//     return {
//       interaction,
//       lead: updatedLead,
//       analysis,
//       scores,
//     }
//   } catch (error) {
//     console.error("Error processing interaction:", error)
//     throw error
//   }
// }

// /**
//  * REMOVE the createLeadFromInstagram function - it's no longer needed
//  * The analyzeLead function now handles lead creation directly
//  */







// import { client } from "@/lib/prisma"
// import { Prisma } from "@prisma/client"
// import type { LeadStatus, Lead } from "@prisma/client"

// /**
//  * Analyzes a message for sentiment and intent using n8n workflow
//  */




// export async function analyzeMessage(message: string) {
//   try {
//     const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || "https://yaziln8n.onrender.com/webhook/analyze-message"

//     const response = await fetch(n8nWebhookUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         ...(process.env.N8N_API_KEY && {
//           Authorization: `Bearer ${process.env.N8N_API_KEY}`,
//         }),
//       },
//       body: JSON.stringify({
//         message: message,
//         analysisType: "lead_qualification",
//         timestamp: new Date().toISOString(),
//       }),
//     })

//     if (!response.ok) {
//       throw new Error(`n8n request failed: ${response.status}`)
//     }

//     const result = await response.json()
    
//     // Check if the analysis was successful
//     if (!result.success) {
//       throw new Error(`Analysis failed: ${result.error?.message || 'Unknown error'}`)
//     }

//     const analysis = result.analysis

//     return {
//       sentiment: Number(analysis.sentiment) || 0,
//       purchaseIntent: Number(analysis.purchaseIntent) || 0,
//       questionIntent: Boolean(analysis.questionIntent),
//       informationSharing: Boolean(analysis.informationSharing),
//       objections: Boolean(analysis.objections),
//       intent: analysis.intent || null,
//       confidence: Number(analysis.intent?.confidence) || 0, // Fixed path
//       qualificationScore: Number(analysis.qualificationScore) || 0,
//       urgencyLevel: Number(analysis.urgencyLevel) || 1,
//       buyerPersona: analysis.buyerPersona || 'unknown',
//       recommendedAction: analysis.recommendedAction || 'low_priority',
//     }
//   } catch (error) {
//     console.error("Error analyzing message with n8n:", error)
//     return {
//       sentiment: 0,
//       purchaseIntent: 0,
//       questionIntent: false,
//       informationSharing: false,
//       objections: false,
//       intent: null,
//       confidence: 0,
//       qualificationScore: 0,
//       urgencyLevel: 1,
//       buyerPersona: 'unknown',
//       recommendedAction: 'low_priority',
//     }
//   }
// }









// export async function analyzeMessageE(message: string) {
//   try {
//     const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || "https://yaziln8n.onrender.com/webhook/analyze-message"

//     const response = await fetch(n8nWebhookUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         ...(process.env.N8N_API_KEY && {
//           Authorization: `Bearer ${process.env.N8N_API_KEY}`,
//         }),
//       },
//       body: JSON.stringify({
//         message: message,
//         analysisType: "lead_qualification",
//         timestamp: new Date().toISOString(),
//       }),
//     })

//     if (!response.ok) {
//       throw new Error(`n8n request failed: ${response.status} ${response.statusText}`)
//     }

//     const analysis = await response.json()

//     return {
//       sentiment: Number(analysis.sentiment) || 0,
//       purchaseIntent: Number(analysis.purchaseIntent) || 0,
//       questionIntent: Boolean(analysis.questionIntent),
//       informationSharing: Boolean(analysis.informationSharing),
//       objections: Boolean(analysis.objections),
//       intent: analysis.intent || null,
//       confidence: Number(analysis.confidence) || 0,
//     }
//   } catch (error) {
//     console.error("Error analyzing message with n8n:", error)
//     return {
//       sentiment: 0,
//       purchaseIntent: 0,
//       questionIntent: false,
//       informationSharing: false,
//       objections: false,
//       intent: null,
//       confidence: 0,
//     }
//   }
// }

// /**
//  * Calculates lead scores based on current data and new analysis
//  */
// function calculateLeadScores(currentData: any, analysis: any) {
//   let intentScore = currentData?.intentScore || 0
//   let sentimentScore = currentData?.sentimentScore || 0
//   let recencyScore = currentData?.recencyScore || 0
//   let engagementScore = currentData?.engagementScore || 0

//   // Update intent score based on purchase intent
//   if (analysis.purchaseIntent > 8) {
//     intentScore += 4
//   } else if (analysis.purchaseIntent > 6) {
//     intentScore += 3
//   } else if (analysis.purchaseIntent > 4) {
//     intentScore += 2
//   } else if (analysis.purchaseIntent > 2) {
//     intentScore += 1
//   }

//   // Update sentiment score
//   if (analysis.sentiment > 0.7) {
//     sentimentScore += 3
//   } else if (analysis.sentiment > 0.3) {
//     sentimentScore += 2
//   } else if (analysis.sentiment > 0) {
//     sentimentScore += 1
//   } else if (analysis.sentiment < -0.5) {
//     sentimentScore -= 2
//   } else if (analysis.sentiment < 0) {
//     sentimentScore -= 1
//   }

//   // Update engagement score based on interaction type
//   if (analysis.questionIntent) {
//     engagementScore += 2
//   }
//   if (analysis.informationSharing) {
//     engagementScore += 3
//   }
//   if (analysis.objections) {
//     engagementScore += 1
//   }

//   // Update recency score (reset to max on new interaction)
//   recencyScore = 5

//   // Cap scores to prevent runaway scoring
//   intentScore = Math.min(intentScore, 15)
//   sentimentScore = Math.max(Math.min(sentimentScore, 10), -5)
//   engagementScore = Math.min(engagementScore, 10)

//   const totalScore = intentScore + sentimentScore + recencyScore + engagementScore

//   return {
//     intentScore,
//     sentimentScore,
//     recencyScore,
//     engagementScore,
//     totalScore,
//   }
// }

// /**
//  * Processes interaction with idempotency to prevent duplicate processing
//  */
// export async function processInteractionWithIdempotency(
//   leadId: string,
//   content: string,
//   type: string,
//   direction: string,
//   timestamp: Date,
// ) {
//   try {
//     // Check if this exact interaction already exists (within 10 second window)
//     const existingInteraction = await client.leadInteraction.findFirst({
//       where: {
//         leadId,
//         content,
//         type,
//         direction,
//         timestamp: {
//           gte: new Date(timestamp.getTime() - 10000), // 10 second window
//           lte: new Date(timestamp.getTime() + 10000),
//         },
//       },
//     })

//     if (existingInteraction) {
//       console.log(`Interaction already processed for lead ${leadId}`)
//       return existingInteraction
//     }

//     // Process the interaction normally
//     return await processInteraction(leadId, content, type, direction, timestamp)
//   } catch (error) {
//     console.error("Error processing interaction with idempotency:", error)
//     throw error
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
//   timestamp?: Date,
// ) {
//   try {
//     // Analyze the message content
//     const analysis = await analyzeMessage(content)

//     // Create the interaction record with unique constraint handling
//     const interaction = await client.leadInteraction.create({
//       data: {
//         leadId,
//         type,
//         content,
//         direction,
//         sentiment: analysis.sentiment,
//         intent: analysis.intent as Prisma.InputJsonValue,
//         timestamp: timestamp || new Date(),
//         metadata: {
//           confidence: analysis.confidence,
//           analysisTimestamp: new Date().toISOString(),
//           interactionId: `${leadId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//         } as Prisma.InputJsonValue,
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

//     // Calculate new scores based on analysis
//     const scores = calculateLeadScores(lead.qualificationData, analysis)

//     // Update the qualification data
//     await client.leadQualificationData.upsert({
//       where: { leadId },
//       update: {
//         intentScore: scores.intentScore,
//         sentimentScore: scores.sentimentScore,
//         recencyScore: scores.recencyScore,
//         engagementScore: scores.engagementScore,
//         aiAnalysis: {
//           ...((lead.qualificationData?.aiAnalysis as Record<string, any>) || {}),
//           [new Date().toISOString()]: analysis,
//         } as Prisma.InputJsonValue,
//         updatedAt: new Date(),
//       },
//       create: {
//         leadId,
//         intentScore: scores.intentScore,
//         sentimentScore: scores.sentimentScore,
//         recencyScore: scores.recencyScore,
//         demographicScore: 0,
//         frequencyScore: 0,
//         engagementScore: scores.engagementScore,
//         qualificationData: Prisma.JsonNull,
//         aiAnalysis: {
//           [new Date().toISOString()]: analysis,
//         } as Prisma.InputJsonValue,
//       },
//     })

//     // Update the lead with new total score and last contact date
//     const updatedLead = await client.lead.update({
//       where: { id: leadId },
//       data: {
//         score: scores.totalScore,
//         lastContactDate: new Date(),
//         updatedAt: new Date(),
//       },
//     })

//     // Check if the lead should be qualified based on score
//     if (scores.totalScore >= 10 && lead.status === "QUALIFYING") {
//       await qualifyLead(leadId)
//     }

//     return {
//       interaction,
//       lead: updatedLead,
//       analysis,
//       scores,
//     }
//   } catch (error) {
//     console.error("Error processing interaction:", error)
//     throw error
//   }
// }

// /**
//  * Qualifies a lead based on its score and other criteria
//  */
// export async function qualifyLead(leadId: string) {
//   try {
//     const lead = await client.lead.findUnique({
//       where: { id: leadId },
//       include: { qualificationData: true },
//     })

//     if (!lead) {
//       throw new Error(`Lead not found: ${leadId}`)
//     }

//     // Update the lead status to QUALIFIED
//     const qualifiedLead = await client.lead.update({
//       where: { id: leadId },
//       data: {
//         status: "QUALIFIED",
//         qualifiedDate: new Date(),
//         updatedAt: new Date(),
//       },
//     })

//     // Send to n8n for further processing
//     await sendLeadToN8n(qualifiedLead)

//     return qualifiedLead
//   } catch (error) {
//     console.error("Error qualifying lead:", error)
//     throw error
//   }
// }

// /**
//  * Sends qualified lead data to n8n for further processing
//  */
// async function sendLeadToN8n(lead: Lead) {
//   try {
//     const n8nLeadWebhookUrl = process.env.N8N_LEAD_WEBHOOK_URL

//     if (!n8nLeadWebhookUrl) {
//       console.log("N8N_LEAD_WEBHOOK_URL not configured, skipping lead notification")
//       return
//     }

//     const response = await fetch(n8nLeadWebhookUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         ...(process.env.N8N_API_KEY && {
//           Authorization: `Bearer ${process.env.N8N_API_KEY}`,
//         }),
//       },
//       body: JSON.stringify({
//         leadId: lead.id,
//         userId: lead.userId,
//         instagramUserId: lead.instagramUserId,
//         pageId: lead.pageId,
//         name: lead.name,
//         email: lead.email,
//         phone: lead.phone,
//         status: lead.status,
//         score: lead.score,
//         source: lead.source,
//         firstContactDate: lead.firstContactDate,
//         lastContactDate: lead.lastContactDate,
//         qualifiedDate: lead.qualifiedDate,
//         tags: lead.tags,
//         metadata: lead.metadata,
//         eventType: "lead_qualified",
//         timestamp: new Date().toISOString(),
//       }),
//     })

//     if (!response.ok) {
//       console.error(`Failed to send lead to n8n: ${response.status} ${response.statusText}`)
//     } else {
//       const responseData = await response.json()
//       await client.lead.update({
//         where: { id: lead.id },
//         data: {
//           sentToN8n: true,
//           n8nExecutionId: responseData.executionId || null,
//         },
//       })
//     }
//   } catch (error) {
//     console.error("Error sending lead to n8n:", error)
//   }
// }

// /**
//  * Main function to analyze a lead from Instagram interaction
//  * This function prevents duplicate leads and handles race conditions
//  */


// export async function analyzeLead(params: {
//   userId: string
//   automationId: string
//   platformId: string
//   customerId: string
//   message: string
//   messageType: "DM" | "COMMENT"
//   timestamp: Date
// }) {
//   const maxRetries = 3
//   let attempt = 0

//   while (attempt < maxRetries) {
//     try {
//       const { userId, automationId, platformId, customerId, message, messageType, timestamp } = params

//       // Use a transaction to ensure atomicity and prevent race conditions
//       const result = await client.$transaction(async (tx) => {
//         // First, try to find existing lead
//         let lead = await tx.lead.findFirst({
//           where: {
//             instagramUserId: customerId,
//             pageId: platformId,
//             userId: userId, // Also match by userId for additional safety
//           },
//           include: { qualificationData: true },
//         })

//         if (!lead) {
//           // Create new lead if it doesn't exist
//           lead = await tx.lead.create({
//             data: {
//               userId,
//               automationId,
//               instagramUserId: customerId,
//               pageId: platformId,
//               status: "NEW",
//               score: 0,
//               source: "instagram",
//               firstContactDate: timestamp,
//               lastContactDate: timestamp,
//               sentToN8n: false,
//               tags: [],
//               metadata: {
//                 initialMessage: message,
//                 createdFrom: "webhook",
//                 firstMessageTimestamp: timestamp.toISOString(),
//                 messageType,
//               } as Prisma.InputJsonValue,
//             },
//             include: { qualificationData: true },
//           })

//           // Update status to QUALIFYING for new leads
//           lead = await tx.lead.update({
//             where: { id: lead.id },
//             data: { status: "QUALIFYING" },
//             include: { qualificationData: true },
//           })
//         } else {
//           // Update existing lead's last contact date
//           lead = await tx.lead.update({
//             where: { id: lead.id },
//             data: {
//               lastContactDate: timestamp,
//               updatedAt: new Date(),
//             },
//             include: { qualificationData: true },
//           })
//         }

//         return lead
//       })

//       // Process the interaction outside the transaction to avoid long-running operations
//       await processInteractionWithIdempotency(result.id, message, messageType.toLowerCase(), "inbound", timestamp)

//       // Return the final lead with updated qualification data
//       const finalLead = await client.lead.findUnique({
//         where: { id: result.id },
//         include: { qualificationData: true },
//       })

//       return finalLead
//     } catch (error) {
//       attempt++
//       console.error(`Error analyzing lead (attempt ${attempt}):`, error)

//       // If it's a unique constraint violation and we have retries left, try again
//       if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002" && attempt < maxRetries) {
//         console.log(`Retrying due to unique constraint violation (attempt ${attempt + 1})`)
//         await new Promise((resolve) => setTimeout(resolve, 100 * attempt)) // Exponential backoff
//         continue
//       }

//       // If it's the last attempt or a different error, throw it
//       if (attempt >= maxRetries) {
//         console.error(`Failed to analyze lead after ${maxRetries} attempts`)
//         return null
//       }
//     }
//   }

//   return null
// }

// /**
//  * Updates a lead's status
//  */
// export async function updateLeadStatus(leadId: string, status: LeadStatus, notes?: string) {
//   try {
//     const updateData: Prisma.LeadUpdateInput = {
//       status,
//       updatedAt: new Date(),
//     }

//     if (status === "QUALIFIED") {
//       updateData.qualifiedDate = new Date()
//     } else if (status === "CONVERTED") {
//       updateData.convertedDate = new Date()
//     }

//     if (notes) {
//       updateData.notes = notes
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
//  * Gets lead analytics for a user with improved performance
//  */
// export async function getLeadAnalytics(userId: string) {
//   try {
//     // Use Promise.all for parallel execution
//     const [analytics, totalLeads, qualifiedLeads, convertedLeads, recentInteractions] = await Promise.all([
//       client.lead.groupBy({
//         by: ["status"],
//         where: { userId },
//         _count: { id: true },
//         _avg: { score: true },
//       }),
//       client.lead.count({ where: { userId } }),
//       client.lead.count({ where: { userId, status: "QUALIFIED" } }),
//       client.lead.count({ where: { userId, status: "CONVERTED" } }),
//       client.leadInteraction.findMany({
//         where: {
//           lead: { userId },
//           timestamp: {
//             gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
//           },
//         },
//         include: {
//           lead: {
//             select: {
//               id: true,
//               instagramUserId: true,
//               name: true,
//               status: true,
//             },
//           },
//         },
//         orderBy: { timestamp: "desc" },
//         take: 10,
//       }),
//     ])

//     const conversionRate = totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0
//     const qualificationRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0

//     return {
//       analytics,
//       totalLeads,
//       qualifiedLeads,
//       convertedLeads,
//       conversionRate: Math.round(conversionRate * 100) / 100,
//       qualificationRate: Math.round(qualificationRate * 100) / 100,
//       recentInteractions,
//     }
//   } catch (error) {
//     console.error("Error getting lead analytics:", error)
//     throw error
//   }
// }

// /**
//  * Gets detailed lead information with interactions
//  */
// export async function getLeadDetails(leadId: string) {
//   try {
//     const lead = await client.lead.findUnique({
//       where: { id: leadId },
//       include: {
//         qualificationData: true,
//         interactions: {
//           orderBy: { timestamp: "desc" },
//           take: 50, // Limit interactions for performance
//         },
//         user: {
//           select: {
//             id: true,
//             email: true,
//             firstname: true,
//             lastname: true,
//           },
//         },
//         automation: {
//           select: {
//             id: true,
//             name: true,
//           },
//         },
//       },
//     })

//     return lead
//   } catch (error) {
//     console.error("Error getting lead details:", error)
//     throw error
//   }
// }

// /**
//  * Updates lead information (name, email, phone, tags)
//  */
// export async function updateLeadInfo(
//   leadId: string,
//   updates: {
//     name?: string
//     email?: string
//     phone?: string
//     tags?: string[]
//     notes?: string
//   },
// ) {
//   try {
//     const lead = await client.lead.update({
//       where: { id: leadId },
//       data: {
//         ...updates,
//         updatedAt: new Date(),
//       },
//     })

//     return lead
//   } catch (error) {
//     console.error("Error updating lead info:", error)
//     throw error
//   }
// }

// /**
//  * Helper function to merge arrays and remove duplicates
//  */
// function mergeUniqueArrays(arr1: string[], arr2: string[]): string[] {
//   const combined = [...arr1, ...arr2]
//   return Array.from(new Set(combined))
// }

// /**
//  * Merges duplicate leads (if any exist)
//  */
// export async function mergeDuplicateLeads(userId: string) {
//   try {
//     // Find potential duplicates based on instagramUserId and pageId
//     const duplicateGroups = await client.lead.groupBy({
//       by: ["instagramUserId", "pageId"],
//       where: { userId },
//       having: {
//         id: { _count: { gt: 1 } },
//       },
//       _count: { id: true },
//     })

//     for (const group of duplicateGroups) {
//       // Get all leads in this duplicate group
//       const duplicateLeads = await client.lead.findMany({
//         where: {
//           userId,
//           instagramUserId: group.instagramUserId,
//           pageId: group.pageId,
//         },
//         include: {
//           interactions: true,
//           qualificationData: true,
//         },
//         orderBy: { firstContactDate: "asc" }, // Keep the oldest one as primary
//       })

//       if (duplicateLeads.length > 1) {
//         const primaryLead = duplicateLeads[0]
//         const duplicatesToMerge = duplicateLeads.slice(1)

//         // Merge interactions and data
//         for (const duplicate of duplicatesToMerge) {
//           // Move interactions to primary lead
//           await client.leadInteraction.updateMany({
//             where: { leadId: duplicate.id },
//             data: { leadId: primaryLead.id },
//           })

//           // Merge qualification data (keep highest scores)
//           if (duplicate.qualificationData && primaryLead.qualificationData) {
//             await client.leadQualificationData.update({
//               where: { leadId: primaryLead.id },
//               data: {
//                 intentScore: Math.max(
//                   duplicate.qualificationData.intentScore,
//                   primaryLead.qualificationData.intentScore,
//                 ),
//                 sentimentScore: Math.max(
//                   duplicate.qualificationData.sentimentScore,
//                   primaryLead.qualificationData.sentimentScore,
//                 ),
//                 engagementScore: Math.max(
//                   duplicate.qualificationData.engagementScore,
//                   primaryLead.qualificationData.engagementScore,
//                 ),
//               },
//             })
//           }

//           // Update primary lead with best data - FIXED VERSION
//           await client.lead.update({
//             where: { id: primaryLead.id },
//             data: {
//               score: Math.max(duplicate.score, primaryLead.score),
//               lastContactDate:
//                 duplicate.lastContactDate > primaryLead.lastContactDate
//                   ? duplicate.lastContactDate
//                   : primaryLead.lastContactDate,
//               name: duplicate.name || primaryLead.name,
//               email: duplicate.email || primaryLead.email,
//               phone: duplicate.phone || primaryLead.phone,
//               tags: mergeUniqueArrays(primaryLead.tags, duplicate.tags), // Fixed this line
//             },
//           })

//           // Delete the duplicate lead
//           await client.lead.delete({
//             where: { id: duplicate.id },
//           })
//         }

//         console.log(`Merged ${duplicatesToMerge.length} duplicate leads for ${group.instagramUserId}`)
//       }
//     }

//     return { mergedGroups: duplicateGroups.length }
//   } catch (error) {
//     console.error("Error merging duplicate leads:", error)
//     throw error
//   }
// }








import { client } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import type { LeadStatus, Lead } from "@prisma/client"

// Types for better type safety
interface N8NAnalysisResponse {
  success: boolean
  analysis?: {
    sentiment: number
    purchaseIntent: number
    questionIntent: boolean
    informationSharing: boolean
    objections: boolean
    urgencyLevel: number
    buyerPersona: string
    intent: {
      category: string
      confidence: number
      keywords: string[]
      reasoning: string
    }
    qualificationScore: number
    recommendedAction: string
    riskFactors: string[]
    opportunities: string[]
    processedAt: string
    analysisQuality: {
      completeness: number
      confidence: number
      dataPoints: number
    }
  }
  error?: {
    message: string
    details?: string
    timestamp: string
  }
  timestamp: string
  version: string
}

interface MessageAnalysis {
  sentiment: number
  purchaseIntent: number
  questionIntent: boolean
  informationSharing: boolean
  objections: boolean
  intent: any
  confidence: number
  qualificationScore: number
  urgencyLevel: number
  buyerPersona: string
  recommendedAction: string
  riskFactors: string[]
  opportunities: string[]
  analysisQuality?: {
    completeness: number
    confidence: number
    dataPoints: number
  }
}

/**
 * Analyzes a message for sentiment and intent using n8n workflow
 */
export async function analyzeMessage(message: string): Promise<MessageAnalysis> {
  const maxRetries = 3
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || "https://yaziln8n.onrender.com/webhook/analyze-message"

      console.log(`Analyzing message with n8n (attempt ${attempt}/${maxRetries})`)

      const response = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.N8N_API_KEY && {
            Authorization: `Bearer ${process.env.N8N_API_KEY}`,
          }),
        },
        body: JSON.stringify({
          message: message.trim(),
          analysisType: "lead_qualification",
          timestamp: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error(`n8n request failed: ${response.status} ${response.statusText}`)
      }

      const result: N8NAnalysisResponse = await response.json()

      // Check if the analysis was successful
      if (!result.success) {
        throw new Error(`N8N Analysis failed: ${result.error?.message || 'Unknown error'}`)
      }

      if (!result.analysis) {
        throw new Error("N8N returned success but no analysis data")
      }

      const analysis = result.analysis

      console.log(`N8N analysis successful - Score: ${analysis.qualificationScore}, Intent: ${analysis.purchaseIntent}/10`)

      return {
        sentiment: Number(analysis.sentiment) || 0,
        purchaseIntent: Number(analysis.purchaseIntent) || 0,
        questionIntent: Boolean(analysis.questionIntent),
        informationSharing: Boolean(analysis.informationSharing),
        objections: Boolean(analysis.objections),
        intent: analysis.intent || null,
        confidence: Number(analysis.intent?.confidence) || 0,
        qualificationScore: Number(analysis.qualificationScore) || 0,
        urgencyLevel: Number(analysis.urgencyLevel) || 1,
        buyerPersona: analysis.buyerPersona || 'unknown',
        recommendedAction: analysis.recommendedAction || 'low_priority',
        riskFactors: analysis.riskFactors || [],
        opportunities: analysis.opportunities || [],
        analysisQuality: analysis.analysisQuality,
      }
    } catch (error) {
      lastError = error as Error
      console.error(`Error analyzing message with n8n (attempt ${attempt}):`, error)

      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        const waitTime = Math.pow(2, attempt) * 1000 // 2s, 4s, 8s
        console.log(`Waiting ${waitTime}ms before retry...`)
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }
  }

  console.error(`Failed to analyze message after ${maxRetries} attempts:`, lastError)
  
  // Return fallback analysis
  return {
    sentiment: 0,
    purchaseIntent: 0,
    questionIntent: false,
    informationSharing: false,
    objections: false,
    intent: null,
    confidence: 0,
    qualificationScore: 0,
    urgencyLevel: 1,
    buyerPersona: 'unknown',
    recommendedAction: 'low_priority',
    riskFactors: ['Analysis failed - manual review required'],
    opportunities: [],
  }
}

/**
 * Enhanced lead scores calculation using n8n qualification score as base
 */
function calculateLeadScores(currentData: any, analysis: MessageAnalysis) {
  let intentScore = currentData?.intentScore || 0
  let sentimentScore = currentData?.sentimentScore || 0
  let recencyScore = currentData?.recencyScore || 0
  let engagementScore = currentData?.engagementScore || 0

  // Use n8n's qualification score as a strong indicator
  const n8nQualificationScore = analysis.qualificationScore || 0
  
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
    engagementScore += 1 // Objections show engagement, even if negative
  }

  // Urgency level affects engagement
  if (analysis.urgencyLevel >= 4) {
    engagementScore += 2
  } else if (analysis.urgencyLevel >= 3) {
    engagementScore += 1
  }

  // Update recency score (reset to max on new interaction)
  recencyScore = 5

  // Cap scores to prevent runaway scoring
  intentScore = Math.min(intentScore, 15)
  sentimentScore = Math.max(Math.min(sentimentScore, 10), -5)
  engagementScore = Math.min(engagementScore, 10)

  // Calculate total score with n8n qualification score as base
  const calculatedScore = intentScore + sentimentScore + recencyScore + engagementScore
  const totalScore = Math.max(n8nQualificationScore, calculatedScore)

  return {
    intentScore,
    sentimentScore,
    recencyScore,
    engagementScore,
    totalScore: Math.min(totalScore, 100), // Cap at 100
    n8nQualificationScore,
  }
}

/**
 * Processes interaction with idempotency to prevent duplicate processing
 */
export async function processInteractionWithIdempotency(
  leadId: string,
  content: string,
  type: string,
  direction: string,
  timestamp: Date,
) {
  try {
    // Generate a unique hash for this interaction
    const interactionHash = generateInteractionHash(leadId, content, type, direction, timestamp)

    // Check if this exact interaction already exists (within 10 second window)
    const existingInteraction = await client.leadInteraction.findFirst({
      where: {
        leadId,
        content,
        type,
        direction,
        timestamp: {
          gte: new Date(timestamp.getTime() - 10000), // 10 second window
          lte: new Date(timestamp.getTime() + 10000),
        },
      },
    })

    if (existingInteraction) {
      console.log(`Interaction already processed for lead ${leadId}`)
      return existingInteraction
    }

    // Process the interaction normally
    return await processInteraction(leadId, content, type, direction, timestamp)
  } catch (error) {
    console.error("Error processing interaction with idempotency:", error)
    throw error
  }
}

/**
 * Generates a unique hash for interaction deduplication
 */
function generateInteractionHash(leadId: string, content: string, type: string, direction: string, timestamp: Date): string {
  const data = `${leadId}-${content.trim()}-${type}-${direction}-${Math.floor(timestamp.getTime() / 10000)}`
  return Buffer.from(data).toString('base64').slice(0, 32)
}

/**
 * Enhanced interaction processing with better error handling and logging
 */
export async function processInteraction(
  leadId: string,
  content: string,
  type: string,
  direction: string,
  timestamp?: Date,
) {
  try {
    console.log(`Processing interaction for lead ${leadId}: ${type} ${direction}`)

    // Analyze the message content
    const analysis = await analyzeMessage(content)

    // Create the interaction record with enhanced metadata
    const interactionId = `${leadId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const interaction = await client.leadInteraction.create({
      data: {
        leadId,
        type,
        content,
        direction,
        sentiment: analysis.sentiment,
        intent: analysis.intent as Prisma.InputJsonValue,
        timestamp: timestamp || new Date(),
        metadata: {
          confidence: analysis.confidence,
          analysisTimestamp: new Date().toISOString(),
          interactionId,
          qualificationScore: analysis.qualificationScore,
          purchaseIntent: analysis.purchaseIntent,
          urgencyLevel: analysis.urgencyLevel,
          buyerPersona: analysis.buyerPersona,
          recommendedAction: analysis.recommendedAction,
          riskFactors: analysis.riskFactors,
          opportunities: analysis.opportunities,
          analysisQuality: analysis.analysisQuality,
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

    console.log(`Updated scores for lead ${leadId}:`, scores)

    // Update the qualification data with enhanced AI analysis tracking
    await client.leadQualificationData.upsert({
      where: { leadId },
      update: {
        intentScore: scores.intentScore,
        sentimentScore: scores.sentimentScore,
        recencyScore: scores.recencyScore,
        engagementScore: scores.engagementScore,
        aiAnalysis: {
          ...((lead.qualificationData?.aiAnalysis as Record<string, any>) || {}),
          [new Date().toISOString()]: {
            ...analysis,
            calculatedScores: scores,
            interactionId,
          },
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
        qualificationData: {
          n8nQualificationScore: scores.n8nQualificationScore,
          lastAnalysis: analysis,
        } as unknown as Prisma.InputJsonValue,
        aiAnalysis: {
          [new Date().toISOString()]: {
            ...analysis,
            calculatedScores: scores,
            interactionId,
          },
        } as unknown as Prisma.InputJsonValue,
      },
    })

    // Update the lead with new total score and last contact date
    const updatedLead = await client.lead.update({
      where: { id: leadId },
      data: {
        score: scores.totalScore,
        lastContactDate: new Date(),
        updatedAt: new Date(),
        // Update metadata with latest analysis
        metadata: {
          ...((lead.metadata as Record<string, any>) || {}),
          lastAnalysis: {
            qualificationScore: analysis.qualificationScore,
            recommendedAction: analysis.recommendedAction,
            buyerPersona: analysis.buyerPersona,
            urgencyLevel: analysis.urgencyLevel,
            analysisTimestamp: new Date().toISOString(),
          },
        } as Prisma.InputJsonValue,
      },
    })

    // Check if the lead should be qualified based on score
    const qualificationThreshold = 70 // Match n8n workflow threshold
    if (scores.totalScore >= qualificationThreshold && lead.status === "QUALIFYING") {
      console.log(`Lead ${leadId} qualified with score ${scores.totalScore}`)
      await qualifyLead(leadId)
    } else if (analysis.qualificationScore >= qualificationThreshold && lead.status === "QUALIFYING") {
      console.log(`Lead ${leadId} qualified by n8n score ${analysis.qualificationScore}`)
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
 * Enhanced lead qualification with better logging
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

    console.log(`Qualifying lead ${leadId} with score ${lead.score}`)

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

    console.log(`Lead ${leadId} successfully qualified and sent to n8n`)

    return qualifiedLead
  } catch (error) {
    console.error("Error qualifying lead:", error)
    throw error
  }
}

/**
 * Enhanced n8n lead notification with retry logic
 */
async function sendLeadToN8n(lead: Lead) {
  const maxRetries = 3
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const n8nLeadWebhookUrl = process.env.N8N_LEAD_WEBHOOK_URL

      if (!n8nLeadWebhookUrl) {
        console.log("N8N_LEAD_WEBHOOK_URL not configured, skipping lead notification")
        return
      }

      console.log(`Sending lead ${lead.id} to n8n (attempt ${attempt}/${maxRetries})`)

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
        throw new Error(`Failed to send lead to n8n: ${response.status} ${response.statusText}`)
      }

      const responseData = await response.json()
      
      await client.lead.update({
        where: { id: lead.id },
        data: {
          sentToN8n: true,
          n8nExecutionId: responseData.executionId || null,
          updatedAt: new Date(),
        },
      })

      console.log(`Lead ${lead.id} successfully sent to n8n`)
      return responseData

    } catch (error) {
      lastError = error as Error
      console.error(`Error sending lead to n8n (attempt ${attempt}):`, error)

      if (attempt < maxRetries) {
        const waitTime = Math.pow(2, attempt) * 1000
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }
  }

  console.error(`Failed to send lead to n8n after ${maxRetries} attempts:`, lastError)
  throw lastError
}

/**
 * Enhanced lead analysis with better error handling and logging
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
  const maxRetries = 3
  let attempt = 0

  while (attempt < maxRetries) {
    try {
      const { userId, automationId, platformId, customerId, message, messageType, timestamp } = params

      console.log(`Analyzing lead: ${customerId} on platform ${platformId}`)

      // Use a transaction to ensure atomicity and prevent race conditions
      const result = await client.$transaction(async (tx) => {
        // First, try to find existing lead
        let lead = await tx.lead.findFirst({
          where: {
            instagramUserId: customerId,
            pageId: platformId,
            userId: userId,
          },
          include: { qualificationData: true },
        })

        if (!lead) {
          console.log(`Creating new lead for ${customerId}`)
          // Create new lead if it doesn't exist
          lead = await tx.lead.create({
            data: {
              userId,
              automationId,
              instagramUserId: customerId,
              pageId: platformId,
              status: "NEW",
              score: 0,
              source: "instagram",
              firstContactDate: timestamp,
              lastContactDate: timestamp,
              sentToN8n: false,
              tags: [],
              metadata: {
                initialMessage: message,
                createdFrom: "webhook",
                firstMessageTimestamp: timestamp.toISOString(),
                messageType,
                createdAt: new Date().toISOString(),
              } as Prisma.InputJsonValue,
            },
            include: { qualificationData: true },
          })

          // Update status to QUALIFYING for new leads
          lead = await tx.lead.update({
            where: { id: lead.id },
            data: { status: "QUALIFYING" },
            include: { qualificationData: true },
          })
        } else {
          console.log(`Updating existing lead ${lead.id}`)
          // Update existing lead's last contact date
          lead = await tx.lead.update({
            where: { id: lead.id },
            data: {
              lastContactDate: timestamp,
              updatedAt: new Date(),
            },
            include: { qualificationData: true },
          })
        }

        return lead
      })

      // Process the interaction outside the transaction to avoid long-running operations
      const interactionResult = await processInteractionWithIdempotency(
        result.id, 
        message, 
        messageType.toLowerCase(), 
        "inbound", 
        timestamp
      )

      // Return the final lead with updated qualification data
      const finalLead = await client.lead.findUnique({
        where: { id: result.id },
        include: { qualificationData: true },
      })

      console.log(`Lead analysis completed for ${customerId}: Score ${finalLead?.score}, Status ${finalLead?.status}`)

      return {
        lead: finalLead,
        interaction: interactionResult,
        isNewLead: result.status === "NEW",
      }

    } catch (error) {
      attempt++
      console.error(`Error analyzing lead (attempt ${attempt}):`, error)

      // If it's a unique constraint violation and we have retries left, try again
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002" && attempt < maxRetries) {
        console.log(`Retrying due to unique constraint violation (attempt ${attempt + 1})`)
        await new Promise((resolve) => setTimeout(resolve, 100 * attempt)) // Exponential backoff
        continue
      }

      // If it's the last attempt or a different error, throw it
      if (attempt >= maxRetries) {
        console.error(`Failed to analyze lead after ${maxRetries} attempts`)
        return null
      }
    }
  }

  return null
}

/**
 * Updates a lead's status with enhanced logging
 */
export async function updateLeadStatus(leadId: string, status: LeadStatus, notes?: string) {
  try {
    console.log(`Updating lead ${leadId} status to ${status}`)

    const updateData: Prisma.LeadUpdateInput = {
      status,
      updatedAt: new Date(),
    }

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

    console.log(`Lead ${leadId} status updated to ${status}`)

    return lead
  } catch (error) {
    console.error("Error updating lead status:", error)
    throw error
  }
}

/**
 * Gets lead analytics for a user with improved performance and caching
 */
export async function getLeadAnalytics(userId: string) {
  try {
    console.log(`Getting lead analytics for user ${userId}`)

    // Use Promise.all for parallel execution
    const [analytics, totalLeads, qualifiedLeads, convertedLeads, recentInteractions] = await Promise.all([
      client.lead.groupBy({
        by: ["status"],
        where: { userId },
        _count: { id: true },
        _avg: { score: true },
      }),
      client.lead.count({ where: { userId } }),
      client.lead.count({ where: { userId, status: "QUALIFIED" } }),
      client.lead.count({ where: { userId, status: "CONVERTED" } }),
      client.leadInteraction.findMany({
        where: {
          lead: { userId },
          timestamp: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
        include: {
          lead: {
            select: {
              id: true,
              instagramUserId: true,
              name: true,
              status: true,
              score: true,
            },
          },
        },
        orderBy: { timestamp: "desc" },
        take: 10,
      }),
    ])

    const conversionRate = totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0
    const qualificationRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0

    const result = {
      analytics,
      totalLeads,
      qualifiedLeads,
      convertedLeads,
      conversionRate: Math.round(conversionRate * 100) / 100,
      qualificationRate: Math.round(qualificationRate * 100) / 100,
      recentInteractions,
      generatedAt: new Date().toISOString(),
    }

    console.log(`Analytics generated for user ${userId}: ${totalLeads} total leads, ${qualifiedLeads} qualified`)

    return result
  } catch (error) {
    console.error("Error getting lead analytics:", error)
    throw error
  }
}

/**
 * Gets detailed lead information with interactions and enhanced metadata
 */
export async function getLeadDetails(leadId: string) {
  try {
    console.log(`Getting lead details for ${leadId}`)

    const lead = await client.lead.findUnique({
      where: { id: leadId },
      include: {
        qualificationData: true,
        interactions: {
          orderBy: { timestamp: "desc" },
          take: 50, // Limit interactions for performance
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

    if (lead) {
      console.log(`Lead details retrieved for ${leadId}: Status ${lead.status}, Score ${lead.score}`)
    } else {
      console.log(`Lead not found: ${leadId}`)
    }

    return lead
  } catch (error) {
    console.error("Error getting lead details:", error)
    throw error
  }
}

/**
 * Updates lead information with validation
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
    console.log(`Updating lead info for ${leadId}:`, Object.keys(updates))

    // Validate email format if provided
    if (updates.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) {
      throw new Error("Invalid email format")
    }

    const lead = await client.lead.update({
      where: { id: leadId },
      data: {
        ...updates,
        updatedAt: new Date(),
      },
    })

    console.log(`Lead info updated for ${leadId}`)

    return lead
  } catch (error) {
    console.error("Error updating lead info:", error)
    throw error
  }
}

/**
 * Helper function to merge arrays and remove duplicates
 */
function mergeUniqueArrays(arr1: string[], arr2: string[]): string[] {
  const combined = [...arr1, ...arr2]
  return Array.from(new Set(combined))
}


/**
 * Merges duplicate leads (if any exist)
 */
export async function mergeDuplicateLeads(userId: string) {
  try {
    // Find potential duplicates based on instagramUserId and pageId
    const duplicateGroups = await client.lead.groupBy({
      by: ["instagramUserId", "pageId"],
      where: { userId },
      having: {
        id: { _count: { gt: 1 } },
      },
      _count: { id: true },
    })

    for (const group of duplicateGroups) {
      // Get all leads in this duplicate group
      const duplicateLeads = await client.lead.findMany({
        where: {
          userId,
          instagramUserId: group.instagramUserId,
          pageId: group.pageId,
        },
        include: {
          interactions: true,
          qualificationData: true,
        },
        orderBy: { firstContactDate: "asc" }, // Keep the oldest one as primary
      })

      if (duplicateLeads.length > 1) {
        const primaryLead = duplicateLeads[0]
        const duplicatesToMerge = duplicateLeads.slice(1)

        // Merge interactions and data
        for (const duplicate of duplicatesToMerge) {
          // Move interactions to primary lead
          await client.leadInteraction.updateMany({
            where: { leadId: duplicate.id },
            data: { leadId: primaryLead.id },
          })

          // Merge qualification data (keep highest scores)
          if (duplicate.qualificationData && primaryLead.qualificationData) {
            await client.leadQualificationData.update({
              where: { leadId: primaryLead.id },
              data: {
                intentScore: Math.max(
                  duplicate.qualificationData.intentScore,
                  primaryLead.qualificationData.intentScore,
                ),
                sentimentScore: Math.max(
                  duplicate.qualificationData.sentimentScore,
                  primaryLead.qualificationData.sentimentScore,
                ),
                engagementScore: Math.max(
                  duplicate.qualificationData.engagementScore,
                  primaryLead.qualificationData.engagementScore,
                ),
              },
            })
          }

          // Update primary lead with best data - FIXED VERSION
          await client.lead.update({
            where: { id: primaryLead.id },
            data: {
              score: Math.max(duplicate.score, primaryLead.score),
              lastContactDate:
                duplicate.lastContactDate > primaryLead.lastContactDate
                  ? duplicate.lastContactDate
                  : primaryLead.lastContactDate,
              name: duplicate.name || primaryLead.name,
              email: duplicate.email || primaryLead.email,
              phone: duplicate.phone || primaryLead.phone,
              tags: mergeUniqueArrays(primaryLead.tags, duplicate.tags), // Fixed this line
            },
          })

          // Delete the duplicate lead
          await client.lead.delete({
            where: { id: duplicate.id },
          })
        }

        console.log(`Merged ${duplicatesToMerge.length} duplicate leads for ${group.instagramUserId}`)
      }
    }

    return { mergedGroups: duplicateGroups.length }
  } catch (error) {
    console.error("Error merging duplicate leads:", error)
    throw error
  }
}
