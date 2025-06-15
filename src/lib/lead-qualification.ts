//WORKING JUST FINE

// import { client } from "@/lib/prisma"
// import { Prisma } from "@prisma/client"
// import type { LeadStatus, Lead } from "@prisma/client"

// // Types for better type safety
// interface N8NAnalysisResponse {
//   success: boolean
//   analysis?: {
//     sentiment: number
//     purchaseIntent: number
//     questionIntent: boolean
//     informationSharing: boolean
//     objections: boolean
//     urgencyLevel: number
//     buyerPersona: string
//     intent: {
//       category: string
//       confidence: number
//       keywords: string[]
//       reasoning: string
//     }
//     qualificationScore: number
//     recommendedAction: string
//     riskFactors: string[]
//     opportunities: string[]
//     processedAt: string
//     analysisQuality: {
//       completeness: number
//       confidence: number
//       dataPoints: number
//     }
//     priorityLead?: boolean
//     notificationMessage?: string
//   }
//   error?: {
//     message: string
//     details?: string
//     timestamp: string
//   }
//   timestamp: string
//   version: string
// }

// interface MessageAnalysis {
//   sentiment: number
//   purchaseIntent: number
//   questionIntent: boolean
//   informationSharing: boolean
//   objections: boolean
//   intent: any
//   confidence: number
//   qualificationScore: number
//   urgencyLevel: number
//   buyerPersona: string
//   recommendedAction: string
//   riskFactors: string[]
//   opportunities: string[]
//   analysisQuality?: {
//     completeness: number
//     confidence: number
//     dataPoints: number
//   }
//   priorityLead?: boolean
//   notificationMessage?: string
// }

// /**
//  * Analyzes a message for sentiment and intent using n8n workflow
//  */
// export async function analyzeMessage(message: string): Promise<MessageAnalysis> {
//   const maxRetries = 3
//   let lastError: Error | null = null

//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || "https://yaziln8n.onrender.com/webhook/analyze-message"

//       console.log(`Analyzing message with n8n (attempt ${attempt}/${maxRetries})`)

//       const response = await fetch(n8nWebhookUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           ...(process.env.N8N_API_KEY && {
//             Authorization: `Bearer ${process.env.N8N_API_KEY}`,
//           }),
//         },
//         body: JSON.stringify({
//           message: message.trim(),
//           analysisType: "lead_qualification",
//           timestamp: new Date().toISOString(),
//         }),
//       })

//       if (!response.ok) {
//         throw new Error(`n8n request failed: ${response.status} ${response.statusText}`)
//       }

//       const result: N8NAnalysisResponse = await response.json()

//       // Check if the analysis was successful
//       if (!result.success) {
//         throw new Error(`N8N Analysis failed: ${result.error?.message || "Unknown error"}`)
//       }

//       if (!result.analysis) {
//         throw new Error("N8N returned success but no analysis data")
//       }

//       const analysis = result.analysis

//       console.log(
//         `N8N analysis successful - Score: ${analysis.qualificationScore}, Intent: ${analysis.purchaseIntent}/10, Priority: ${analysis.priorityLead}`,
//       )

//       return {
//         sentiment: Number(analysis.sentiment) || 0,
//         purchaseIntent: Number(analysis.purchaseIntent) || 0,
//         questionIntent: Boolean(analysis.questionIntent),
//         informationSharing: Boolean(analysis.informationSharing),
//         objections: Boolean(analysis.objections),
//         intent: analysis.intent || null,
//         confidence: Number(analysis.intent?.confidence) || 0,
//         qualificationScore: Number(analysis.qualificationScore) || 0,
//         urgencyLevel: Number(analysis.urgencyLevel) || 1,
//         buyerPersona: analysis.buyerPersona || "unknown",
//         recommendedAction: analysis.recommendedAction || "low_priority",
//         riskFactors: analysis.riskFactors || [],
//         opportunities: analysis.opportunities || [],
//         analysisQuality: analysis.analysisQuality,
//         priorityLead: Boolean(analysis.priorityLead),
//         notificationMessage: analysis.notificationMessage,
//       }
//     } catch (error) {
//       lastError = error as Error
//       console.error(`Error analyzing message with n8n (attempt ${attempt}):`, error)

//       // Wait before retrying (exponential backoff)
//       if (attempt < maxRetries) {
//         const waitTime = Math.pow(2, attempt) * 1000 // 2s, 4s, 8s
//         console.log(`Waiting ${waitTime}ms before retry...`)
//         await new Promise((resolve) => setTimeout(resolve, waitTime))
//       }
//     }
//   }

//   console.error(`Failed to analyze message after ${maxRetries} attempts:`, lastError)

//   // Return fallback analysis
//   return {
//     sentiment: 0,
//     purchaseIntent: 0,
//     questionIntent: false,
//     informationSharing: false,
//     objections: false,
//     intent: null,
//     confidence: 0,
//     qualificationScore: 0,
//     urgencyLevel: 1,
//     buyerPersona: "unknown",
//     recommendedAction: "low_priority",
//     riskFactors: ["Analysis failed - manual review required"],
//     opportunities: [],
//     priorityLead: false,
//   }
// }

// /**
//  * Enhanced lead scores calculation using n8n qualification score as base
//  */
// function calculateLeadScores(currentData: any, analysis: MessageAnalysis) {
//   let intentScore = currentData?.intentScore || 0
//   let sentimentScore = currentData?.sentimentScore || 0
//   let recencyScore = currentData?.recencyScore || 0
//   let engagementScore = currentData?.engagementScore || 0

//   // Use n8n's qualification score as a strong indicator
//   const n8nQualificationScore = analysis.qualificationScore || 0

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
//     engagementScore += 1 // Objections show engagement, even if negative
//   }

//   // Urgency level affects engagement
//   if (analysis.urgencyLevel >= 4) {
//     engagementScore += 2
//   } else if (analysis.urgencyLevel >= 3) {
//     engagementScore += 1
//   }

//   // Update recency score (reset to max on new interaction)
//   recencyScore = 5

//   // Cap scores to prevent runaway scoring
//   intentScore = Math.min(intentScore, 15)
//   sentimentScore = Math.max(Math.min(sentimentScore, 10), -5)
//   engagementScore = Math.min(engagementScore, 10)

//   // Calculate total score with n8n qualification score as base
//   const calculatedScore = intentScore + sentimentScore + recencyScore + engagementScore
//   const totalScore = Math.max(n8nQualificationScore, calculatedScore)

//   return {
//     intentScore,
//     sentimentScore,
//     recencyScore,
//     engagementScore,
//     totalScore: Math.min(totalScore, 100), // Cap at 100
//     n8nQualificationScore,
//   }
// }

// /**
//  * Enhanced interaction processing with better error handling and logging
//  */
// export async function processInteraction(
//   leadId: string,
//   content: string,
//   type: string,
//   direction: string,
//   timestamp?: Date,
// ) {
//   try {
//     console.log(`Processing interaction for lead ${leadId}: ${type} ${direction}`)

//     // Analyze the message content
//     const analysis = await analyzeMessage(content)

//     // Create the interaction record with enhanced metadata
//     const interactionId = `${leadId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

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
//           interactionId,
//           qualificationScore: analysis.qualificationScore,
//           purchaseIntent: analysis.purchaseIntent,
//           urgencyLevel: analysis.urgencyLevel,
//           buyerPersona: analysis.buyerPersona,
//           recommendedAction: analysis.recommendedAction,
//           riskFactors: analysis.riskFactors,
//           opportunities: analysis.opportunities,
//           analysisQuality: analysis.analysisQuality,
//           priorityLead: analysis.priorityLead,
//           notificationMessage: analysis.notificationMessage,
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

//     console.log(`Updated scores for lead ${leadId}:`, scores)

//     // Update the qualification data with enhanced AI analysis tracking
//     await client.leadQualificationData.upsert({
//       where: { leadId },
//       update: {
//         intentScore: scores.intentScore,
//         sentimentScore: scores.sentimentScore,
//         recencyScore: scores.recencyScore,
//         engagementScore: scores.engagementScore,
//         aiAnalysis: {
//           ...((lead.qualificationData?.aiAnalysis as Record<string, any>) || {}),
//           [new Date().toISOString()]: {
//             ...analysis,
//             calculatedScores: scores,
//             interactionId,
//           },
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
//         qualificationData: {
//           n8nQualificationScore: scores.n8nQualificationScore,
//           lastAnalysis: analysis,
//         } as unknown as Prisma.InputJsonValue,
//         aiAnalysis: {
//           [new Date().toISOString()]: {
//             ...analysis,
//             calculatedScores: scores,
//             interactionId,
//           },
//         } as unknown as Prisma.InputJsonValue,
//       },
//     })

//     // Determine new status based on analysis
//     let newStatus = lead.status
//     const qualificationThreshold = 70 // Match n8n workflow threshold

//     if (analysis.priorityLead || scores.totalScore >= qualificationThreshold) {
//       if (lead.status === "NEW" || lead.status === "QUALIFYING") {
//         newStatus = "QUALIFIED"
//         console.log(`Lead ${leadId} qualified - Priority: ${analysis.priorityLead}, Score: ${scores.totalScore}`)
//       }
//     } else if (lead.status === "NEW") {
//       newStatus = "QUALIFYING"
//     }

//     // Update the lead with new total score, status, and last contact date
//     const updatedLead = await client.lead.update({
//       where: { id: leadId },
//       data: {
//         score: scores.totalScore,
//         status: newStatus,
//         lastContactDate: new Date(),
//         updatedAt: new Date(),
//         // Update metadata with latest analysis
//         metadata: {
//           ...((lead.metadata as Record<string, any>) || {}),
//           lastAnalysis: {
//             qualificationScore: analysis.qualificationScore,
//             recommendedAction: analysis.recommendedAction,
//             buyerPersona: analysis.buyerPersona,
//             urgencyLevel: analysis.urgencyLevel,
//             priorityLead: analysis.priorityLead,
//             notificationMessage: analysis.notificationMessage,
//             analysisTimestamp: new Date().toISOString(),
//           },
//         } as Prisma.InputJsonValue,
//         ...(newStatus !== lead.status &&
//           newStatus === "QUALIFIED" && {
//             qualifiedDate: new Date(),
//           }),
//       },
//     })

//     // Send to n8n for further processing if qualified
//     if (newStatus === "QUALIFIED" && lead.status !== "QUALIFIED") {
//       await sendLeadToN8n(updatedLead)
//     }

//     return {
//       interaction,
//       lead: updatedLead,
//       analysis,
//       scores,
//       statusChanged: newStatus !== lead.status,
//     }
//   } catch (error) {
//     console.error("Error processing interaction:", error)
//     throw error
//   }
// }

// /**
//  * Enhanced n8n lead notification with retry logic
//  */
// async function sendLeadToN8n(lead: Lead) {
//   const maxRetries = 3
//   let lastError: Error | null = null

//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       const n8nLeadWebhookUrl = process.env.N8N_LEAD_WEBHOOK_URL

//       if (!n8nLeadWebhookUrl) {
//         console.log("N8N_LEAD_WEBHOOK_URL not configured, skipping lead notification")
//         return
//       }

//       console.log(`Sending lead ${lead.id} to n8n (attempt ${attempt}/${maxRetries})`)

//       const response = await fetch(n8nLeadWebhookUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           ...(process.env.N8N_API_KEY && {
//             Authorization: `Bearer ${process.env.N8N_API_KEY}`,
//           }),
//         },
//         body: JSON.stringify({
//           leadId: lead.id,
//           userId: lead.userId,
//           instagramUserId: lead.instagramUserId,
//           pageId: lead.pageId,
//           name: lead.name,
//           email: lead.email,
//           phone: lead.phone,
//           status: lead.status,
//           score: lead.score,
//           source: lead.source,
//           firstContactDate: lead.firstContactDate,
//           lastContactDate: lead.lastContactDate,
//           qualifiedDate: lead.qualifiedDate,
//           tags: lead.tags,
//           metadata: lead.metadata,
//           eventType: "lead_qualified",
//           timestamp: new Date().toISOString(),
//         }),
//       })

//       if (!response.ok) {
//         throw new Error(`Failed to send lead to n8n: ${response.status} ${response.statusText}`)
//       }

//       const responseData = await response.json()

//       await client.lead.update({
//         where: { id: lead.id },
//         data: {
//           sentToN8n: true,
//           n8nExecutionId: responseData.executionId || null,
//           updatedAt: new Date(),
//         },
//       })

//       console.log(`Lead ${lead.id} successfully sent to n8n`)
//       return responseData
//     } catch (error) {
//       lastError = error as Error
//       console.error(`Error sending lead to n8n (attempt ${attempt}):`, error)

//       if (attempt < maxRetries) {
//         const waitTime = Math.pow(2, attempt) * 1000
//         await new Promise((resolve) => setTimeout(resolve, waitTime))
//       }
//     }
//   }

//   console.error(`Failed to send lead to n8n after ${maxRetries} attempts:`, lastError)
//   throw lastError
// }

// /**
//  * Enhanced lead analysis with better error handling and logging
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

//       console.log(`Analyzing lead: ${customerId} on platform ${platformId}`)

//       // Use a transaction to ensure atomicity and prevent race conditions
//       const result = await client.$transaction(async (tx) => {
//         // First, try to find existing lead
//         let lead = await tx.lead.findFirst({
//           where: {
//             instagramUserId: customerId,
//             pageId: platformId,
//             userId: userId,
//           },
//           include: { qualificationData: true },
//         })

//         if (!lead) {
//           console.log(`Creating new lead for ${customerId}`)
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
//                 createdAt: new Date().toISOString(),
//               } as Prisma.InputJsonValue,
//             },
//             include: { qualificationData: true },
//           })
//         } else {
//           console.log(`Updating existing lead ${lead.id}`)
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
//       const interactionResult = await processInteraction(
//         result.id,
//         message,
//         messageType.toLowerCase(),
//         "inbound",
//         timestamp,
//       )

//       // Return the final lead with updated qualification data
//       const finalLead = await client.lead.findUnique({
//         where: { id: result.id },
//         include: {
//           qualificationData: true,
//           interactions: {
//             take: 5,
//             orderBy: { timestamp: "desc" },
//           },
//         },
//       })

//       console.log(`Lead analysis completed for ${customerId}: Score ${finalLead?.score}, Status ${finalLead?.status}`)

//       return {
//         lead: finalLead,
//         interaction: interactionResult,
//         isNewLead: result.status === "NEW",
//         statusChanged: interactionResult?.statusChanged || false,
//       }
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
//  * Gets lead analytics for a user with improved performance and caching
//  */
// export async function getLeadAnalytics(userId: string) {
//   try {
//     console.log(`Getting lead analytics for user ${userId}`)

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
//               score: true,
//             },
//           },
//         },
//         orderBy: { timestamp: "desc" },
//         take: 10,
//       }),
//     ])

//     const conversionRate = totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0
//     const qualificationRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0

//     const result = {
//       analytics,
//       totalLeads,
//       qualifiedLeads,
//       convertedLeads,
//       conversionRate: Math.round(conversionRate * 100) / 100,
//       qualificationRate: Math.round(qualificationRate * 100) / 100,
//       recentInteractions,
//       generatedAt: new Date().toISOString(),
//     }

//     console.log(`Analytics generated for user ${userId}: ${totalLeads} total leads, ${qualifiedLeads} qualified`)

//     return result
//   } catch (error) {
//     console.error("Error getting lead analytics:", error)
//     throw error
//   }
// }

// /**
//  * Gets detailed lead information with interactions and enhanced metadata
//  */
// export async function getLeadDetails(leadId: string) {
//   try {
//     console.log(`Getting lead details for ${leadId}`)

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

//     if (lead) {
//       console.log(`Lead details retrieved for ${leadId}: Status ${lead.status}, Score ${lead.score}`)
//     } else {
//       console.log(`Lead not found: ${leadId}`)
//     }

//     return lead
//   } catch (error) {
//     console.error("Error getting lead details:", error)
//     throw error
//   }
// }

// /**
//  * Updates a lead's status with enhanced logging
//  */
// export async function updateLeadStatus(leadId: string, status: LeadStatus, notes?: string) {
//   try {
//     console.log(`Updating lead ${leadId} status to ${status}`)

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

//     console.log(`Lead ${leadId} status updated to ${status}`)

//     return lead
//   } catch (error) {
//     console.error("Error updating lead status:", error)
//     throw error
//   }
// }

// /**
//  * Updates lead information with validation
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
//     console.log(`Updating lead info for ${leadId}:`, Object.keys(updates))

//     // Validate email format if provided
//     if (updates.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) {
//       throw new Error("Invalid email format")
//     }

//     const lead = await client.lead.update({
//       where: { id: leadId },
//       data: {
//         ...updates,
//         updatedAt: new Date(),
//       },
//     })

//     console.log(`Lead info updated for ${leadId}`)

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

//           // Update primary lead with best data
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
//               tags: mergeUniqueArrays(primaryLead.tags, duplicate.tags),
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


// import { client } from "@/lib/prisma"
// import { Prisma } from "@prisma/client"
// import type { Lead } from "@prisma/client"

// // Enhanced types for premium system
// interface PremiumN8NAnalysisResponse {
//   success: boolean
//   analysis?: {
//     sentiment: number
//     purchaseIntent: number
//     questionIntent: boolean
//     informationSharing: boolean
//     objections: boolean
//     urgencyLevel: number
//     qualificationScore: number
//     revenueScore: number
//     leadTier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM"
//     estimatedValue: number
//     followUpStrategy: string
//     nextActions: string[]
//     buyerPersona: string
//     intent: {
//       category: string
//       confidence: number
//       keywords: string[]
//       reasoning: string
//     }
//     recommendedAction: string
//     riskFactors: string[]
//     opportunities: string[]
//     processedAt: string
//     analysisQuality: {
//       completeness: number
//       confidence: number
//       dataPoints: number
//     }
//     priorityLead: boolean
//     notificationMessage: string
//     revenueMetrics: {
//       estimatedRevenue: number
//       expectedRevenue: number
//       roi: number
//       conversionProbability: number
//       acquisitionCost: number
//       paybackPeriod: number
//     }
//     followUpTimeline: Array<{
//       action: string
//       delay: number
//     }>
//     competitorAnalysis: {
//       urgencyIndicators: boolean
//       priceShoppingSignals: boolean
//       competitorMentions: boolean
//     }
//     salesIntelligence: {
//       bestContactTime: string
//       communicationPreference: string
//       decisionMakingStage: string
//       objectionHandling: string[]
//     }
//   }
//   error?: {
//     message: string
//     details?: string
//     timestamp: string
//   }
//   timestamp: string
//   version: string
//   processingTime?: number
// }

// interface PremiumMessageAnalysis {
//   sentiment: number
//   purchaseIntent: number
//   questionIntent: boolean
//   informationSharing: boolean
//   objections: boolean
//   intent: any
//   confidence: number
//   qualificationScore: number
//   urgencyLevel: number
//   buyerPersona: string
//   recommendedAction: string
//   riskFactors: string[]
//   opportunities: string[]
//   analysisQuality?: {
//     completeness: number
//     confidence: number
//     dataPoints: number
//   }
//   priorityLead: boolean
//   notificationMessage?: string
//   // Premium features
//   revenueScore: number
//   leadTier: string
//   estimatedValue: number
//   followUpStrategy: string
//   nextActions: string[]
//   revenueMetrics: {
//     estimatedRevenue: number
//     expectedRevenue: number
//     roi: number
//     conversionProbability: number
//     acquisitionCost: number
//     paybackPeriod: number
//   }
//   followUpTimeline: Array<{
//     action: string
//     delay: number
//   }>
//   competitorAnalysis: {
//     urgencyIndicators: boolean
//     priceShoppingSignals: boolean
//     competitorMentions: boolean
//   }
//   salesIntelligence: {
//     bestContactTime: string
//     communicationPreference: string
//     decisionMakingStage: string
//     objectionHandling: string[]
//   }
// }

// /**
//  * Premium AI-powered message analysis with revenue prediction
//  */
// export async function analyzePremiumMessage(
//   message: string,
//   userId: string,
//   customerId: string,
// ): Promise<PremiumMessageAnalysis> {
//   const maxRetries = 3
//   let lastError: Error | null = null

//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       const n8nWebhookUrl =
//         process.env.N8N_PREMIUM_WEBHOOK_URL ||
//         process.env.N8N_WEBHOOK_URL ||
//         "https://yaziln8n.onrender.com/webhook/analyze-premium-lead"

//       console.log(`🚀 Premium AI Analysis (attempt ${attempt}/${maxRetries}) for user ${userId}`)

//       const response = await fetch(n8nWebhookUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           ...(process.env.N8N_API_KEY && {
//             Authorization: `Bearer ${process.env.N8N_API_KEY}`,
//           }),
//         },
//         body: JSON.stringify({
//           message: message.trim(),
//           analysisType: "premium_lead_qualification",
//           userId: userId,
//           customerId: customerId,
//           timestamp: new Date().toISOString(),
//         }),
//       })

//       if (!response.ok) {
//         throw new Error(`Premium n8n request failed: ${response.status} ${response.statusText}`)
//       }

//       const result: PremiumN8NAnalysisResponse = await response.json()

//       if (!result.success) {
//         throw new Error(`Premium N8N Analysis failed: ${result.error?.message || "Unknown error"}`)
//       }

//       if (!result.analysis) {
//         throw new Error("Premium N8N returned success but no analysis data")
//       }

//       const analysis = result.analysis

//       console.log(
//         `💎 Premium analysis complete - Tier: ${analysis.leadTier}, Score: ${analysis.qualificationScore}, ROI: ${analysis.revenueMetrics.roi}%, Est. Value: $${analysis.estimatedValue}`,
//       )

//       // Track premium analytics
//       await trackPremiumAnalytics(userId, analysis)

//       return {
//         sentiment: Number(analysis.sentiment) || 0,
//         purchaseIntent: Number(analysis.purchaseIntent) || 0,
//         questionIntent: Boolean(analysis.questionIntent),
//         informationSharing: Boolean(analysis.informationSharing),
//         objections: Boolean(analysis.objections),
//         intent: analysis.intent || null,
//         confidence: Number(analysis.intent?.confidence) || 0,
//         qualificationScore: Number(analysis.qualificationScore) || 0,
//         urgencyLevel: Number(analysis.urgencyLevel) || 1,
//         buyerPersona: analysis.buyerPersona || "unknown",
//         recommendedAction: analysis.recommendedAction || "low_priority",
//         riskFactors: analysis.riskFactors || [],
//         opportunities: analysis.opportunities || [],
//         analysisQuality: analysis.analysisQuality,
//         priorityLead: Boolean(analysis.priorityLead),
//         notificationMessage: analysis.notificationMessage,
//         // Premium features
//         revenueScore: Number(analysis.revenueScore) || 0,
//         leadTier: analysis.leadTier || "BRONZE",
//         estimatedValue: Number(analysis.estimatedValue) || 100,
//         followUpStrategy: analysis.followUpStrategy || "standard",
//         nextActions: analysis.nextActions || [],
//         revenueMetrics: analysis.revenueMetrics || {
//           estimatedRevenue: 100,
//           expectedRevenue: 10,
//           roi: 0,
//           conversionProbability: 0.1,
//           acquisitionCost: 50,
//           paybackPeriod: 12,
//         },
//         followUpTimeline: analysis.followUpTimeline || [],
//         competitorAnalysis: analysis.competitorAnalysis || {
//           urgencyIndicators: false,
//           priceShoppingSignals: false,
//           competitorMentions: false,
//         },
//         salesIntelligence: analysis.salesIntelligence || {
//           bestContactTime: "business_hours",
//           communicationPreference: "instagram_dm",
//           decisionMakingStage: "research",
//           objectionHandling: [],
//         },
//       }
//     } catch (error) {
//       lastError = error as Error
//       console.error(`❌ Premium analysis error (attempt ${attempt}):`, error)

//       if (attempt < maxRetries) {
//         const waitTime = Math.pow(2, attempt) * 1000
//         console.log(`⏳ Waiting ${waitTime}ms before retry...`)
//         await new Promise((resolve) => setTimeout(resolve, waitTime))
//       }
//     }
//   }

//   console.error(`💥 Premium analysis failed after ${maxRetries} attempts:`, lastError)

//   // Return enhanced fallback analysis
//   return {
//     sentiment: 0,
//     purchaseIntent: 0,
//     questionIntent: false,
//     informationSharing: false,
//     objections: false,
//     intent: null,
//     confidence: 0,
//     qualificationScore: 0,
//     urgencyLevel: 1,
//     buyerPersona: "unknown",
//     recommendedAction: "manual_review",
//     riskFactors: ["Premium analysis failed - requires manual review"],
//     opportunities: [],
//     priorityLead: false,
//     revenueScore: 0,
//     leadTier: "BRONZE",
//     estimatedValue: 100,
//     followUpStrategy: "manual",
//     nextActions: ["manual_review"],
//     revenueMetrics: {
//       estimatedRevenue: 100,
//       expectedRevenue: 10,
//       roi: -100,
//       conversionProbability: 0.1,
//       acquisitionCost: 50,
//       paybackPeriod: 12,
//     },
//     followUpTimeline: [],
//     competitorAnalysis: {
//       urgencyIndicators: false,
//       priceShoppingSignals: false,
//       competitorMentions: false,
//     },
//     salesIntelligence: {
//       bestContactTime: "business_hours",
//       communicationPreference: "instagram_dm",
//       decisionMakingStage: "unknown",
//       objectionHandling: [],
//     },
//   }
// }

// /**
//  * Track premium analytics for business intelligence
//  */
// async function trackPremiumAnalytics(userId: string, analysis: any) {
//   try {
//     const today = new Date()
//     today.setHours(0, 0, 0, 0)

//     await client.premiumAnalytics.upsert({
//       where: {
//         userId_date: {
//           userId: userId,
//           date: today,
//         },
//       },
//       update: {
//         totalAnalyses: { increment: 1 },
//         platinumLeads: analysis.leadTier === "PLATINUM" ? { increment: 1 } : undefined,
//         goldLeads: analysis.leadTier === "GOLD" ? { increment: 1 } : undefined,
//         silverLeads: analysis.leadTier === "SILVER" ? { increment: 1 } : undefined,
//         totalEstimatedRevenue: { increment: analysis.estimatedValue },
//         totalExpectedRevenue: { increment: analysis.revenueMetrics.expectedRevenue },
//         averageROI: analysis.revenueMetrics.roi,
//         updatedAt: new Date(),
//       },
//       create: {
//         userId: userId,
//         date: today,
//         totalAnalyses: 1,
//         platinumLeads: analysis.leadTier === "PLATINUM" ? 1 : 0,
//         goldLeads: analysis.leadTier === "GOLD" ? 1 : 0,
//         silverLeads: analysis.leadTier === "SILVER" ? 1 : 0,
//         bronzeLeads: analysis.leadTier === "BRONZE" ? 1 : 0,
//         totalEstimatedRevenue: analysis.estimatedValue,
//         totalExpectedRevenue: analysis.revenueMetrics.expectedRevenue,
//         averageROI: analysis.revenueMetrics.roi,
//       },
//     })
//   } catch (error) {
//     console.error("Error tracking premium analytics:", error)
//   }
// }

// /**
//  * Enhanced lead scores calculation with revenue intelligence
//  */
// function calculatePremiumLeadScores(currentData: any, analysis: PremiumMessageAnalysis) {
//   let intentScore = currentData?.intentScore || 0
//   let sentimentScore = currentData?.sentimentScore || 0
//   let recencyScore = currentData?.recencyScore || 0
//   let engagementScore = currentData?.engagementScore || 0
//   let revenueScore = currentData?.revenueScore || 0

//   // Use premium qualification score as primary indicator
//   const premiumQualificationScore = analysis.qualificationScore || 0
//   const revenueMultiplier = analysis.revenueMetrics.roi > 100 ? 1.5 : analysis.revenueMetrics.roi > 50 ? 1.2 : 1.0

//   // Enhanced intent scoring with revenue consideration
//   if (analysis.purchaseIntent > 8) {
//     intentScore += 6 * revenueMultiplier
//   } else if (analysis.purchaseIntent > 6) {
//     intentScore += 4 * revenueMultiplier
//   } else if (analysis.purchaseIntent > 4) {
//     intentScore += 3 * revenueMultiplier
//   } else if (analysis.purchaseIntent > 2) {
//     intentScore += 2 * revenueMultiplier
//   }

//   // Premium sentiment analysis
//   if (analysis.sentiment > 0.7) {
//     sentimentScore += 4
//   } else if (analysis.sentiment > 0.3) {
//     sentimentScore += 3
//   } else if (analysis.sentiment > 0) {
//     sentimentScore += 2
//   } else if (analysis.sentiment < -0.5) {
//     sentimentScore -= 3
//   } else if (analysis.sentiment < 0) {
//     sentimentScore -= 2
//   }

//   // Enhanced engagement scoring
//   if (analysis.questionIntent) engagementScore += 3
//   if (analysis.informationSharing) engagementScore += 4
//   if (analysis.objections) engagementScore += 2
//   if (analysis.urgencyLevel >= 4) engagementScore += 3
//   if (analysis.urgencyLevel >= 2) engagementScore += 2

//   // Revenue score calculation
//   revenueScore = Math.min(25, analysis.revenueScore || 0)

//   // Lead tier bonus
//   let tierBonus = 0
//   switch (analysis.leadTier) {
//     case "PLATINUM":
//       tierBonus = 15
//       break
//     case "GOLD":
//       tierBonus = 10
//       break
//     case "SILVER":
//       tierBonus = 5
//       break
//     default:
//       tierBonus = 0
//   }

//   // Update recency score
//   recencyScore = 5

//   // Cap individual scores
//   intentScore = Math.min(intentScore, 20)
//   sentimentScore = Math.max(Math.min(sentimentScore, 15), -10)
//   engagementScore = Math.min(engagementScore, 15)

//   // Calculate total score with premium weighting
//   const calculatedScore = intentScore + sentimentScore + recencyScore + engagementScore + revenueScore + tierBonus
//   const totalScore = Math.max(premiumQualificationScore, calculatedScore)

//   return {
//     intentScore,
//     sentimentScore,
//     recencyScore,
//     engagementScore,
//     revenueScore,
//     tierBonus,
//     totalScore: Math.min(totalScore, 100),
//     premiumQualificationScore,
//     leadTier: analysis.leadTier,
//     estimatedValue: analysis.estimatedValue,
//     roi: analysis.revenueMetrics.roi,
//   }
// }

// /**
//  * Premium interaction processing with revenue intelligence
//  */
// export async function processPremiumInteraction(
//   leadId: string,
//   content: string,
//   type: string,
//   direction: string,
//   userId: string,
//   customerId: string,
//   timestamp?: Date,
// ) {
//   try {
//     console.log(`💎 Processing premium interaction for lead ${leadId}`)

//     // Premium AI analysis
//     const analysis = await analyzePremiumMessage(content, userId, customerId)

//     // Create enhanced interaction record
//     const interactionId = `${leadId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

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
//           interactionId,
//           // Premium metadata
//           qualificationScore: analysis.qualificationScore,
//           purchaseIntent: analysis.purchaseIntent,
//           urgencyLevel: analysis.urgencyLevel,
//           buyerPersona: analysis.buyerPersona,
//           recommendedAction: analysis.recommendedAction,
//           riskFactors: analysis.riskFactors,
//           opportunities: analysis.opportunities,
//           analysisQuality: analysis.analysisQuality,
//           priorityLead: analysis.priorityLead,
//           notificationMessage: analysis.notificationMessage,
//           // Revenue intelligence
//           revenueScore: analysis.revenueScore,
//           leadTier: analysis.leadTier,
//           estimatedValue: analysis.estimatedValue,
//           followUpStrategy: analysis.followUpStrategy,
//           nextActions: analysis.nextActions,
//           revenueMetrics: analysis.revenueMetrics,
//           followUpTimeline: analysis.followUpTimeline,
//           competitorAnalysis: analysis.competitorAnalysis,
//           salesIntelligence: analysis.salesIntelligence,
//         } as Prisma.InputJsonValue,
//       },
//     })

//     // Get lead with qualification data
//     const lead = await client.lead.findUnique({
//       where: { id: leadId },
//       include: { qualificationData: true },
//     })

//     if (!lead) {
//       throw new Error(`Lead not found: ${leadId}`)
//     }

//     // Calculate premium scores
//     const scores = calculatePremiumLeadScores(lead.qualificationData, analysis)

//     console.log(`💰 Premium scores for lead ${leadId}:`, scores)

//     // Update qualification data with premium features
//     await client.leadQualificationData.upsert({
//       where: { leadId },
//       update: {
//         intentScore: scores.intentScore,
//         sentimentScore: scores.sentimentScore,
//         recencyScore: scores.recencyScore,
//         engagementScore: scores.engagementScore,
//         aiAnalysis: {
//           ...((lead.qualificationData?.aiAnalysis as Record<string, any>) || {}),
//           [new Date().toISOString()]: {
//             ...analysis,
//             calculatedScores: scores,
//             interactionId,
//           },
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
//         qualificationData: {
//           premiumQualificationScore: scores.premiumQualificationScore,
//           leadTier: scores.leadTier,
//           estimatedValue: scores.estimatedValue,
//           roi: scores.roi,
//           lastAnalysis: analysis,
//         } as unknown as Prisma.InputJsonValue,
//         aiAnalysis: {
//           [new Date().toISOString()]: {
//             ...analysis,
//             calculatedScores: scores,
//             interactionId,
//           },
//         } as unknown as Prisma.InputJsonValue,
//       },
//     })

//     // Determine new status with premium logic
//     let newStatus = lead.status
//     const qualificationThreshold = 70

//     if (
//       analysis.leadTier === "PLATINUM" ||
//       analysis.leadTier === "GOLD" ||
//       scores.totalScore >= qualificationThreshold
//     ) {
//       if (lead.status === "NEW" || lead.status === "QUALIFYING") {
//         newStatus = "QUALIFIED"
//         console.log(`🎯 Lead ${leadId} qualified - Tier: ${analysis.leadTier}, Score: ${scores.totalScore}`)
//       }
//     } else if (lead.status === "NEW") {
//       newStatus = "QUALIFYING"
//     }

//     // Update lead with premium data
//     const updatedLead = await client.lead.update({
//       where: { id: leadId },
//       data: {
//         score: scores.totalScore,
//         status: newStatus,
//         lastContactDate: new Date(),
//         updatedAt: new Date(),
//         metadata: {
//           ...((lead.metadata as Record<string, any>) || {}),
//           lastAnalysis: {
//             qualificationScore: analysis.qualificationScore,
//             recommendedAction: analysis.recommendedAction,
//             buyerPersona: analysis.buyerPersona,
//             urgencyLevel: analysis.urgencyLevel,
//             priorityLead: analysis.priorityLead,
//             notificationMessage: analysis.notificationMessage,
//             // Premium fields
//             leadTier: analysis.leadTier,
//             estimatedValue: analysis.estimatedValue,
//             roi: analysis.revenueMetrics.roi,
//             followUpStrategy: analysis.followUpStrategy,
//             nextActions: analysis.nextActions,
//             analysisTimestamp: new Date().toISOString(),
//           },
//         } as Prisma.InputJsonValue,
//         ...(newStatus !== lead.status &&
//           newStatus === "QUALIFIED" && {
//             qualifiedDate: new Date(),
//           }),
//       },
//     })

//     // Premium lead notifications and automation
//     if (newStatus === "QUALIFIED" && lead.status !== "QUALIFIED") {
//       await handlePremiumLeadQualification(updatedLead, analysis)
//     }

//     // Schedule follow-up actions
//     if (analysis.followUpTimeline.length > 0) {
//       await scheduleFollowUpActions(leadId, analysis.followUpTimeline)
//     }

//     return {
//       interaction,
//       lead: updatedLead,
//       analysis,
//       scores,
//       statusChanged: newStatus !== lead.status,
//       premiumFeatures: {
//         leadTier: analysis.leadTier,
//         estimatedValue: analysis.estimatedValue,
//         roi: analysis.revenueMetrics.roi,
//         followUpStrategy: analysis.followUpStrategy,
//         nextActions: analysis.nextActions,
//       },
//     }
//   } catch (error) {
//     console.error("❌ Error processing premium interaction:", error)
//     throw error
//   }
// }

// /**
//  * Handle premium lead qualification with advanced automation
//  */
// async function handlePremiumLeadQualification(lead: Lead, analysis: PremiumMessageAnalysis) {
//   try {
//     console.log(`🚀 Handling premium lead qualification for ${lead.id}`)

//     // Send to premium n8n workflow
//     await sendPremiumLeadToN8n(lead, analysis)

//     // Create revenue opportunity record
//     await client.revenueOpportunity.create({
//       data: {
//         leadId: lead.id,
//         userId: lead.userId,
//         estimatedValue: analysis.estimatedValue,
//         expectedRevenue: analysis.revenueMetrics.expectedRevenue,
//         roi: analysis.revenueMetrics.roi,
//         conversionProbability: analysis.revenueMetrics.conversionProbability,
//         leadTier: analysis.leadTier,
//         status: "ACTIVE",
//         createdAt: new Date(),
//       },
//     })

//     // Track revenue metrics
//     await updateRevenueMetrics(lead.userId, analysis)

//     console.log(`💰 Premium lead qualification completed for ${lead.id}`)
//   } catch (error) {
//     console.error("Error handling premium lead qualification:", error)
//   }
// }

// /**
//  * Send premium lead data to enhanced n8n workflow
//  */
// async function sendPremiumLeadToN8n(lead: Lead, analysis: PremiumMessageAnalysis) {
//   const maxRetries = 3
//   let lastError: Error | null = null

//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       const n8nLeadWebhookUrl = process.env.N8N_PREMIUM_LEAD_WEBHOOK_URL || process.env.N8N_LEAD_WEBHOOK_URL

//       if (!n8nLeadWebhookUrl) {
//         console.log("N8N_PREMIUM_LEAD_WEBHOOK_URL not configured, skipping premium lead notification")
//         return
//       }

//       console.log(`🚀 Sending premium lead ${lead.id} to n8n (attempt ${attempt}/${maxRetries})`)

//       const response = await fetch(n8nLeadWebhookUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           ...(process.env.N8N_API_KEY && {
//             Authorization: `Bearer ${process.env.N8N_API_KEY}`,
//           }),
//         },
//         body: JSON.stringify({
//           leadId: lead.id,
//           userId: lead.userId,
//           instagramUserId: lead.instagramUserId,
//           pageId: lead.pageId,
//           name: lead.name,
//           email: lead.email,
//           phone: lead.phone,
//           status: lead.status,
//           score: lead.score,
//           source: lead.source,
//           firstContactDate: lead.firstContactDate,
//           lastContactDate: lead.lastContactDate,
//           qualifiedDate: lead.qualifiedDate,
//           tags: lead.tags,
//           metadata: lead.metadata,
//           // Premium data
//           leadTier: analysis.leadTier,
//           estimatedValue: analysis.estimatedValue,
//           revenueMetrics: analysis.revenueMetrics,
//           followUpStrategy: analysis.followUpStrategy,
//           nextActions: analysis.nextActions,
//           salesIntelligence: analysis.salesIntelligence,
//           eventType: "premium_lead_qualified",
//           timestamp: new Date().toISOString(),
//         }),
//       })

//       if (!response.ok) {
//         throw new Error(`Failed to send premium lead to n8n: ${response.status} ${response.statusText}`)
//       }

//       const responseData = await response.json()

//       await client.lead.update({
//         where: { id: lead.id },
//         data: {
//           sentToN8n: true,
//           n8nExecutionId: responseData.executionId || null,
//           updatedAt: new Date(),
//         },
//       })

//       console.log(`✅ Premium lead ${lead.id} successfully sent to n8n`)
//       return responseData
//     } catch (error) {
//       lastError = error as Error
//       console.error(`❌ Error sending premium lead to n8n (attempt ${attempt}):`, error)

//       if (attempt < maxRetries) {
//         const waitTime = Math.pow(2, attempt) * 1000
//         await new Promise((resolve) => setTimeout(resolve, waitTime))
//       }
//     }
//   }

//   console.error(`💥 Failed to send premium lead to n8n after ${maxRetries} attempts:`, lastError)
//   throw lastError
// }

// /**
//  * Schedule automated follow-up actions
//  */
// async function scheduleFollowUpActions(leadId: string, timeline: Array<{ action: string; delay: number }>) {
//   try {
//     for (const item of timeline) {
//       const scheduledTime = new Date(Date.now() + item.delay * 60 * 60 * 1000) // delay in hours

//       await client.scheduledAction.create({
//         data: {
//           leadId,
//           action: item.action,
//           scheduledFor: scheduledTime,
//           status: "PENDING",
//           createdAt: new Date(),
//         },
//       })
//     }

//     console.log(`📅 Scheduled ${timeline.length} follow-up actions for lead ${leadId}`)
//   } catch (error) {
//     console.error("Error scheduling follow-up actions:", error)
//   }
// }

// /**
//  * Update revenue metrics for business intelligence
//  */
// async function updateRevenueMetrics(userId: string, analysis: PremiumMessageAnalysis) {
//   try {
//     const today = new Date()
//     today.setHours(0, 0, 0, 0)

//     await client.revenueMetrics.upsert({
//       where: {
//         userId_date: {
//           userId: userId,
//           date: today,
//         },
//       },
//       update: {
//         totalEstimatedRevenue: { increment: analysis.estimatedValue },
//         totalExpectedRevenue: { increment: analysis.revenueMetrics.expectedRevenue },
//         qualifiedLeads: { increment: 1 },
//         averageROI: analysis.revenueMetrics.roi,
//         updatedAt: new Date(),
//       },
//       create: {
//         userId: userId,
//         date: today,
//         totalEstimatedRevenue: analysis.estimatedValue,
//         totalExpectedRevenue: analysis.revenueMetrics.expectedRevenue,
//         qualifiedLeads: 1,
//         averageROI: analysis.revenueMetrics.roi,
//       },
//     })
//   } catch (error) {
//     console.error("Error updating revenue metrics:", error)
//   }
// }

// /**
//  * Enhanced lead analysis with premium features
//  */
// export async function analyzePremiumLead(params: {
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

//       console.log(`💎 Analyzing premium lead: ${customerId} on platform ${platformId}`)

//       // Use transaction for atomicity
//       const result = await client.$transaction(async (tx) => {
//         // Find or create lead
//         let lead = await tx.lead.findFirst({
//           where: {
//             instagramUserId: customerId,
//             pageId: platformId,
//             userId: userId,
//           },
//           include: { qualificationData: true },
//         })

//         if (!lead) {
//           console.log(`🆕 Creating new premium lead for ${customerId}`)
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
//                 createdFrom: "premium_webhook",
//                 firstMessageTimestamp: timestamp.toISOString(),
//                 messageType,
//                 createdAt: new Date().toISOString(),
//                 isPremium: true,
//               } as Prisma.InputJsonValue,
//             },
//             include: { qualificationData: true },
//           })
//         } else {
//           console.log(`🔄 Updating existing premium lead ${lead.id}`)
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

//       // Process premium interaction
//       const interactionResult = await processPremiumInteraction(
//         result.id,
//         message,
//         messageType.toLowerCase(),
//         "inbound",
//         userId,
//         customerId,
//         timestamp,
//       )

//       // Get final lead data
//       const finalLead = await client.lead.findUnique({
//         where: { id: result.id },
//         include: {
//           qualificationData: true,
//           interactions: {
//             take: 5,
//             orderBy: { timestamp: "desc" },
//           },
//         },
//       })

//       console.log(
//         `💰 Premium lead analysis completed for ${customerId}: Tier ${interactionResult?.premiumFeatures?.leadTier}, Score ${finalLead?.score}, Est. Value $${interactionResult?.premiumFeatures?.estimatedValue}`,
//       )

//       return {
//         lead: finalLead,
//         interaction: interactionResult,
//         isNewLead: result.status === "NEW",
//         statusChanged: interactionResult?.statusChanged || false,
//         premiumFeatures: interactionResult?.premiumFeatures,
//       }
//     } catch (error) {
//       attempt++
//       console.error(`❌ Error analyzing premium lead (attempt ${attempt}):`, error)

//       if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002" && attempt < maxRetries) {
//         console.log(`🔄 Retrying due to unique constraint violation (attempt ${attempt + 1})`)
//         await new Promise((resolve) => setTimeout(resolve, 100 * attempt))
//         continue
//       }

//       if (attempt >= maxRetries) {
//         console.error(`💥 Failed to analyze premium lead after ${maxRetries} attempts`)
//         return null
//       }
//     }
//   }

//   return null
// }

// /**
//  * Get premium lead analytics with revenue intelligence
//  */
// export async function getPremiumLeadAnalytics(userId: string) {
//   try {
//     console.log(`📊 Getting premium analytics for user ${userId}`)

//     const [
//       analytics,
//       totalLeads,
//       qualifiedLeads,
//       convertedLeads,
//       recentInteractions,
//       revenueMetrics,
//       premiumAnalytics,
//     ] = await Promise.all([
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
//             gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
//           },
//         },
//         include: {
//           lead: {
//             select: {
//               id: true,
//               instagramUserId: true,
//               name: true,
//               status: true,
//               score: true,
//               metadata: true,
//             },
//           },
//         },
//         orderBy: { timestamp: "desc" },
//         take: 10,
//       }),
//       // Revenue metrics
//       client.revenueMetrics.findMany({
//         where: { userId },
//         orderBy: { date: "desc" },
//         take: 30,
//       }),
//       // Premium analytics
//       client.premiumAnalytics.findMany({
//         where: { userId },
//         orderBy: { date: "desc" },
//         take: 30,
//       }),
//     ])

//     // Calculate revenue insights
//     // const totalEstimatedRevenue = revenueMetrics.reduce((sum, metric) => sum + metric.totalEstimatedRevenue, 0)
//     // const totalExpectedRevenue = revenueMetrics.reduce((sum, metric) => sum + metric.totalExpectedRevenue, 0)
//     // const averageROI =
//     //   revenueMetrics.length > 0
//     //     ? revenueMetrics.reduce((sum, metric) => sum + metric.averageROI, 0) / revenueMetrics.length
//     //     : 0

//     const totalEstimatedRevenue = revenueMetrics.reduce((sum, metric) => 
//       sum + metric.totalEstimatedRevenue.toNumber(), 0)

//     const totalExpectedRevenue = revenueMetrics.reduce((sum, metric) => 
//       sum + metric.totalExpectedRevenue.toNumber(), 0)

//     const averageROI = revenueMetrics.length > 0
//       ? revenueMetrics.reduce((sum, metric) => sum + metric.averageROI.toNumber(), 0) / revenueMetrics.length
//       : 0

//     // Calculate lead tier distribution
//     const tierDistribution = premiumAnalytics.reduce(
//       (acc, analytics) => {
//         acc.platinum += analytics.platinumLeads
//         acc.gold += analytics.goldLeads
//         acc.silver += analytics.silverLeads
//         acc.bronze += analytics.bronzeLeads
//         return acc
//       },
//       { platinum: 0, gold: 0, silver: 0, bronze: 0 },
//     )

//     const conversionRate = totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0
//     const qualificationRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0

//     const result = {
//       analytics,
//       totalLeads,
//       qualifiedLeads,
//       convertedLeads,
//       conversionRate: Math.round(conversionRate * 100) / 100,
//       qualificationRate: Math.round(qualificationRate * 100) / 100,
//       recentInteractions,
//       // Premium features
//       revenueMetrics: {
//         totalEstimatedRevenue,
//         totalExpectedRevenue,
//         averageROI: Math.round(averageROI * 100) / 100,
//         revenueGrowth: calculateRevenueGrowth(revenueMetrics),
//       },
//       tierDistribution,
//       premiumInsights: {
//         highValueLeads: tierDistribution.platinum + tierDistribution.gold,
//         averageLeadValue: totalLeads > 0 ? Math.round(totalEstimatedRevenue / totalLeads) : 0,
//         conversionProbability: calculateAverageConversionProbability(premiumAnalytics),
//       },
//       generatedAt: new Date().toISOString(),
//     }

//     console.log(`💎 Premium analytics generated for user ${userId}: $${totalEstimatedRevenue} estimated revenue`)

//     return result
//   } catch (error) {
//     console.error("❌ Error getting premium lead analytics:", error)
//     throw error
//   }
// }

// /**
//  * Calculate revenue growth trend
//  */
// function calculateRevenueGrowth(metrics: any[]) {
//   if (metrics.length < 2) return 0

//   const recent = metrics.slice(0, 7).reduce((sum, m) => sum + m.totalExpectedRevenue, 0)
//   const previous = metrics.slice(7, 14).reduce((sum, m) => sum + m.totalExpectedRevenue, 0)

//   if (previous === 0) return recent > 0 ? 100 : 0
//   return Math.round(((recent - previous) / previous) * 100)
// }

// /**
//  * Calculate average conversion probability
//  */
// function calculateAverageConversionProbability(analytics: any[]) {
//   if (analytics.length === 0) return 0

//   const totalLeads = analytics.reduce((sum, a) => sum + a.totalAnalyses, 0)
//   const weightedProbability = analytics.reduce((sum, a) => {
//     const platinumWeight = a.platinumLeads * 0.8
//     const goldWeight = a.goldLeads * 0.6
//     const silverWeight = a.silverLeads * 0.3
//     const bronzeWeight = a.bronzeLeads * 0.1
//     return sum + platinumWeight + goldWeight + silverWeight + bronzeWeight
//   }, 0)

//   return totalLeads > 0 ? Math.round((weightedProbability / totalLeads) * 100) : 0
// }

// // Export the enhanced analyze function as the main one
// export const analyzeLead = analyzePremiumLead



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

//           // Update primary lead with best data
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
//               tags: mergeUniqueArrays(primaryLead.tags, duplicate.tags),
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

// Enhanced types for the system
interface N8NAnalysisResponse {
  success: boolean
  analysis?: {
    sentiment: number
    purchaseIntent: number
    questionIntent: boolean
    informationSharing: boolean
    objections: boolean
    urgencyLevel: number
    qualificationScore: number
    revenueScore: number
    leadTier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM"
    estimatedValue: number
    followUpStrategy: string
    nextActions: string[]
    buyerPersona: string
    intent: {
      category: string
      confidence: number
      keywords: string[]
      reasoning: string
    }
    recommendedAction: string
    riskFactors: string[]
    opportunities: string[]
    processedAt: string
    analysisQuality: {
      completeness: number
      confidence: number
      dataPoints: number
    }
    priorityLead: boolean
    notificationMessage: string
    revenueMetrics: {
      estimatedRevenue: number
      expectedRevenue: number
      roi: number
      conversionProbability: number
      acquisitionCost: number
      paybackPeriod: number
    }
  }
  error?: {
    message: string
    details?: string
    timestamp: string
  }
  timestamp: string
  version: string
  processingTime?: number
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
  priorityLead: boolean
  notificationMessage?: string
  revenueScore: number
  leadTier: string
  estimatedValue: number
  followUpStrategy: string
  nextActions: string[]
  revenueMetrics: {
    estimatedRevenue: number
    expectedRevenue: number
    roi: number
    conversionProbability: number
    acquisitionCost: number
    paybackPeriod: number
  }
}

/**
 * Enhanced AI-powered message analysis
 */
export async function analyzeMessage(message: string, userId?: string, customerId?: string): Promise<MessageAnalysis> {
  const maxRetries = 3
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || "https://yaziln8n.onrender.com/webhook/analyze-message"

      console.log(`🚀 Enhanced AI Analysis (attempt ${attempt}/${maxRetries})`)

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
          analysisType: "enhanced_lead_qualification",
          userId: userId,
          customerId: customerId,
          timestamp: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error(`Enhanced n8n request failed: ${response.status} ${response.statusText}`)
      }

      const result: N8NAnalysisResponse = await response.json()

      if (!result.success) {
        throw new Error(`Enhanced N8N Analysis failed: ${result.error?.message || "Unknown error"}`)
      }

      if (!result.analysis) {
        throw new Error("Enhanced N8N returned success but no analysis data")
      }

      const analysis = result.analysis

      console.log(
        `💎 Enhanced analysis complete - Tier: ${analysis.leadTier}, Score: ${analysis.qualificationScore}, ROI: ${analysis.revenueMetrics.roi}%, Est. Value: $${analysis.estimatedValue}`,
      )

      // Track analytics
      if (userId) {
        await trackAnalytics(userId, analysis)
      }

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
        buyerPersona: analysis.buyerPersona || "unknown",
        recommendedAction: analysis.recommendedAction || "low_priority",
        riskFactors: analysis.riskFactors || [],
        opportunities: analysis.opportunities || [],
        analysisQuality: analysis.analysisQuality,
        priorityLead: Boolean(analysis.priorityLead),
        notificationMessage: analysis.notificationMessage,
        revenueScore: Number(analysis.revenueScore) || 0,
        leadTier: analysis.leadTier || "BRONZE",
        estimatedValue: Number(analysis.estimatedValue) || 100,
        followUpStrategy: analysis.followUpStrategy || "standard",
        nextActions: analysis.nextActions || [],
        revenueMetrics: analysis.revenueMetrics || {
          estimatedRevenue: 100,
          expectedRevenue: 10,
          roi: 0,
          conversionProbability: 0.1,
          acquisitionCost: 50,
          paybackPeriod: 12,
        },
      }
    } catch (error) {
      lastError = error as Error
      console.error(`❌ Enhanced analysis error (attempt ${attempt}):`, error)

      if (attempt < maxRetries) {
        const waitTime = Math.pow(2, attempt) * 1000
        console.log(`⏳ Waiting ${waitTime}ms before retry...`)
        await new Promise((resolve) => setTimeout(resolve, waitTime))
      }
    }
  }

  console.error(`💥 Enhanced analysis failed after ${maxRetries} attempts:`, lastError)

  // Return enhanced fallback analysis
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
    buyerPersona: "unknown",
    recommendedAction: "manual_review",
    riskFactors: ["Enhanced analysis failed - requires manual review"],
    opportunities: [],
    priorityLead: false,
    revenueScore: 0,
    leadTier: "BRONZE",
    estimatedValue: 100,
    followUpStrategy: "manual",
    nextActions: ["manual_review"],
    revenueMetrics: {
      estimatedRevenue: 100,
      expectedRevenue: 10,
      roi: -100,
      conversionProbability: 0.1,
      acquisitionCost: 50,
      paybackPeriod: 12,
    },
  }
}

/**
 * Track analytics for business intelligence
 */
async function trackAnalytics(userId: string, analysis: any) {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    await client.premiumAnalytics.upsert({
      where: {
        userId_date: {
          userId: userId,
          date: today,
        },
      },
      update: {
        totalAnalyses: { increment: 1 },
        platinumLeads: analysis.leadTier === "PLATINUM" ? { increment: 1 } : undefined,
        goldLeads: analysis.leadTier === "GOLD" ? { increment: 1 } : undefined,
        silverLeads: analysis.leadTier === "SILVER" ? { increment: 1 } : undefined,
        totalEstimatedRevenue: { increment: analysis.estimatedValue },
        totalExpectedRevenue: { increment: analysis.revenueMetrics.expectedRevenue },
        averageROI: analysis.revenueMetrics.roi,
        updatedAt: new Date(),
      },
      create: {
        userId: userId,
        date: today,
        totalAnalyses: 1,
        platinumLeads: analysis.leadTier === "PLATINUM" ? 1 : 0,
        goldLeads: analysis.leadTier === "GOLD" ? 1 : 0,
        silverLeads: analysis.leadTier === "SILVER" ? 1 : 0,
        bronzeLeads: analysis.leadTier === "BRONZE" ? 1 : 0,
        totalEstimatedRevenue: analysis.estimatedValue,
        totalExpectedRevenue: analysis.revenueMetrics.expectedRevenue,
        averageROI: analysis.revenueMetrics.roi,
      },
    })
  } catch (error) {
    console.error("Error tracking analytics:", error)
  }
}

/**
 * Get enhanced lead analytics
 */
export async function getPremiumLeadAnalytics(userId: string) {
  try {
    console.log(`📊 Getting enhanced analytics for user ${userId}`)

    const [
      analytics,
      totalLeads,
      qualifiedLeads,
      convertedLeads,
      recentInteractions,
      revenueMetrics,
      premiumAnalytics,
    ] = await Promise.all([
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
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
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
              metadata: true,
            },
          },
        },
        orderBy: { timestamp: "desc" },
        take: 10,
      }),
      // Revenue metrics
      client.revenueMetrics.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: 30,
      }),
      // Enhanced analytics
      client.premiumAnalytics.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: 30,
      }),
    ])

    // Calculate revenue insights
    const totalEstimatedRevenue = revenueMetrics.reduce((sum, metric) => sum + Number(metric.totalEstimatedRevenue), 0)
    const totalExpectedRevenue = revenueMetrics.reduce((sum, metric) => sum + Number(metric.totalExpectedRevenue), 0)
    const averageROI =
      revenueMetrics.length > 0
        ? revenueMetrics.reduce((sum, metric) => sum + Number(metric.averageROI), 0) / revenueMetrics.length
        : 0

    // Calculate lead tier distribution
    const tierDistribution = premiumAnalytics.reduce(
      (acc, analytics) => {
        acc.platinum += analytics.platinumLeads
        acc.gold += analytics.goldLeads
        acc.silver += analytics.silverLeads
        acc.bronze += analytics.bronzeLeads
        return acc
      },
      { platinum: 0, gold: 0, silver: 0, bronze: 0 },
    )

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
      // Enhanced features
      revenueMetrics: {
        totalEstimatedRevenue,
        totalExpectedRevenue,
        averageROI: Math.round(averageROI * 100) / 100,
        revenueGrowth: calculateRevenueGrowth(revenueMetrics),
      },
      tierDistribution,
      enhancedInsights: {
        highValueLeads: tierDistribution.platinum + tierDistribution.gold,
        averageLeadValue: totalLeads > 0 ? Math.round(totalEstimatedRevenue / totalLeads) : 0,
        conversionProbability: calculateAverageConversionProbability(premiumAnalytics),
      },
      generatedAt: new Date().toISOString(),
    }

    console.log(`💎 Enhanced analytics generated for user ${userId}: $${totalEstimatedRevenue} estimated revenue`)

    return result
  } catch (error) {
    console.error("❌ Error getting enhanced lead analytics:", error)
    throw error
  }
}

/**
 * Calculate revenue growth trend
 */
function calculateRevenueGrowth(metrics: any[]) {
  if (metrics.length < 2) return 0

  const recent = metrics.slice(0, 7).reduce((sum, m) => sum + Number(m.totalExpectedRevenue), 0)
  const previous = metrics.slice(7, 14).reduce((sum, m) => sum + Number(m.totalExpectedRevenue), 0)

  if (previous === 0) return recent > 0 ? 100 : 0
  return Math.round(((recent - previous) / previous) * 100)
}

/**
 * Calculate average conversion probability
 */
function calculateAverageConversionProbability(analytics: any[]) {
  if (analytics.length === 0) return 0

  const totalLeads = analytics.reduce((sum, a) => sum + a.totalAnalyses, 0)
  const weightedProbability = analytics.reduce((sum, a) => {
    const platinumWeight = a.platinumLeads * 0.8
    const goldWeight = a.goldLeads * 0.6
    const silverWeight = a.silverLeads * 0.3
    const bronzeWeight = a.bronzeLeads * 0.1
    return sum + platinumWeight + goldWeight + silverWeight + bronzeWeight
  }, 0)

  return totalLeads > 0 ? Math.round((weightedProbability / totalLeads) * 100) : 0
}

/**
 * Merge duplicate leads
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
          revenueOpportunities: true,
          scheduledActions: true,
        },
        orderBy: { firstContactDate: "asc" },
      })

      if (duplicateLeads.length > 1) {
        const primaryLead = duplicateLeads[0]
        const duplicatesToMerge = duplicateLeads.slice(1)

        // Use transaction for data integrity
        await client.$transaction(async (tx) => {
          // Merge enhanced data
          for (const duplicate of duplicatesToMerge) {
            // Move interactions to primary lead
            await tx.leadInteraction.updateMany({
              where: { leadId: duplicate.id },
              data: { leadId: primaryLead.id },
            })

            // Move revenue opportunities
            await tx.revenueOpportunity.updateMany({
              where: { leadId: duplicate.id },
              data: { leadId: primaryLead.id },
            })

            // Move scheduled actions
            await tx.scheduledAction.updateMany({
              where: { leadId: duplicate.id },
              data: { leadId: primaryLead.id },
            })

            // Merge qualification data (keep highest scores)
            if (duplicate.qualificationData && primaryLead.qualificationData) {
              await tx.leadQualificationData.update({
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
                  revenueScore: Math.max(
                    duplicate.qualificationData.revenueScore || 0,
                    primaryLead.qualificationData.revenueScore || 0,
                  ),
                  // estimatedValue:
                  //   duplicate.qualificationData.estimatedValue > primaryLead.qualificationData.estimatedValue
                  //     ? duplicate.qualificationData.estimatedValue
                  //     : primaryLead.qualificationData.estimatedValue,
                  estimatedValue: 
                  (duplicate.qualificationData.estimatedValue ?? 0) > (primaryLead.qualificationData.estimatedValue ?? 0)
                    ? duplicate.qualificationData.estimatedValue
                    : primaryLead.qualificationData.estimatedValue,
                },
              })
            }

            // Update primary lead with best data
            await tx.lead.update({
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
                tags: Array.from(new Set([...primaryLead.tags, ...duplicate.tags])),
              },
            })

            // Delete the duplicate lead
            await tx.lead.delete({
              where: { id: duplicate.id },
            })
          }
        })

        console.log(`Merged ${duplicatesToMerge.length} duplicate enhanced leads for ${group.instagramUserId}`)
      }
    }

    return { mergedGroups: duplicateGroups.length }
  } catch (error) {
    console.error("Error merging duplicate enhanced leads:", error)
    throw error
  }
}
