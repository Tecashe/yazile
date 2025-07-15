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










// import { client } from "@/lib/prisma"

// // Enhanced types for the system
// interface N8NAnalysisResponse {
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
//   priorityLead: boolean
//   notificationMessage?: string
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
// }

// /**
//  * Enhanced AI-powered message analysis
//  */
// export async function analyzeMessage(message: string, userId?: string, customerId?: string): Promise<MessageAnalysis> {
//   const maxRetries = 3
//   let lastError: Error | null = null

//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || "https://yaziln8n.onrender.com/webhook/analyze-message"

//       console.log(`🚀 Enhanced AI Analysis (attempt ${attempt}/${maxRetries})`)

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
//           analysisType: "enhanced_lead_qualification",
//           userId: userId,
//           customerId: customerId,
//           timestamp: new Date().toISOString(),
//         }),
//       })

//       if (!response.ok) {
//         throw new Error(`Enhanced n8n request failed: ${response.status} ${response.statusText}`)
//       }

//       const result: N8NAnalysisResponse = await response.json()

//       if (!result.success) {
//         throw new Error(`Enhanced N8N Analysis failed: ${result.error?.message || "Unknown error"}`)
//       }

//       if (!result.analysis) {
//         throw new Error("Enhanced N8N returned success but no analysis data")
//       }

//       const analysis = result.analysis

//       console.log(
//         `💎 Enhanced analysis complete - Tier: ${analysis.leadTier}, Score: ${analysis.qualificationScore}, ROI: ${analysis.revenueMetrics.roi}%, Est. Value: $${analysis.estimatedValue}`,
//       )

//       // Track analytics
//       if (userId) {
//         await trackAnalytics(userId, analysis)
//       }

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
//       }
//     } catch (error) {
//       lastError = error as Error
//       console.error(`❌ Enhanced analysis error (attempt ${attempt}):`, error)

//       if (attempt < maxRetries) {
//         const waitTime = Math.pow(2, attempt) * 1000
//         console.log(`⏳ Waiting ${waitTime}ms before retry...`)
//         await new Promise((resolve) => setTimeout(resolve, waitTime))
//       }
//     }
//   }

//   console.error(`💥 Enhanced analysis failed after ${maxRetries} attempts:`, lastError)

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
//     riskFactors: ["Enhanced analysis failed - requires manual review"],
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
//   }
// }

// /**
//  * Track analytics for business intelligence
//  */
// async function trackAnalytics(userId: string, analysis: any) {
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
//     console.error("Error tracking analytics:", error)
//   }
// }

// /**
//  * Get enhanced lead analytics
//  */
// export async function getPremiumLeadAnalytics(userId: string) {
//   try {
//     console.log(`📊 Getting enhanced analytics for user ${userId}`)

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
//       // Enhanced analytics
//       client.premiumAnalytics.findMany({
//         where: { userId },
//         orderBy: { date: "desc" },
//         take: 30,
//       }),
//     ])

//     // Calculate revenue insights
//     const totalEstimatedRevenue = revenueMetrics.reduce((sum, metric) => sum + Number(metric.totalEstimatedRevenue), 0)
//     const totalExpectedRevenue = revenueMetrics.reduce((sum, metric) => sum + Number(metric.totalExpectedRevenue), 0)
//     const averageROI =
//       revenueMetrics.length > 0
//         ? revenueMetrics.reduce((sum, metric) => sum + Number(metric.averageROI), 0) / revenueMetrics.length
//         : 0

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
//       // Enhanced features
//       revenueMetrics: {
//         totalEstimatedRevenue,
//         totalExpectedRevenue,
//         averageROI: Math.round(averageROI * 100) / 100,
//         revenueGrowth: calculateRevenueGrowth(revenueMetrics),
//       },
//       tierDistribution,
//       enhancedInsights: {
//         highValueLeads: tierDistribution.platinum + tierDistribution.gold,
//         averageLeadValue: totalLeads > 0 ? Math.round(totalEstimatedRevenue / totalLeads) : 0,
//         conversionProbability: calculateAverageConversionProbability(premiumAnalytics),
//       },
//       generatedAt: new Date().toISOString(),
//     }

//     console.log(`💎 Enhanced analytics generated for user ${userId}: $${totalEstimatedRevenue} estimated revenue`)

//     return result
//   } catch (error) {
//     console.error("❌ Error getting enhanced lead analytics:", error)
//     throw error
//   }
// }

// /**
//  * Calculate revenue growth trend
//  */
// function calculateRevenueGrowth(metrics: any[]) {
//   if (metrics.length < 2) return 0

//   const recent = metrics.slice(0, 7).reduce((sum, m) => sum + Number(m.totalExpectedRevenue), 0)
//   const previous = metrics.slice(7, 14).reduce((sum, m) => sum + Number(m.totalExpectedRevenue), 0)

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

// /**
//  * Merge duplicate leads
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
//           revenueOpportunities: true,
//           scheduledActions: true,
//         },
//         orderBy: { firstContactDate: "asc" },
//       })

//       if (duplicateLeads.length > 1) {
//         const primaryLead = duplicateLeads[0]
//         const duplicatesToMerge = duplicateLeads.slice(1)

//         // Use transaction for data integrity
//         await client.$transaction(async (tx) => {
//           // Merge enhanced data
//           for (const duplicate of duplicatesToMerge) {
//             // Move interactions to primary lead
//             await tx.leadInteraction.updateMany({
//               where: { leadId: duplicate.id },
//               data: { leadId: primaryLead.id },
//             })

//             // Move revenue opportunities
//             await tx.revenueOpportunity.updateMany({
//               where: { leadId: duplicate.id },
//               data: { leadId: primaryLead.id },
//             })

//             // Move scheduled actions
//             await tx.scheduledAction.updateMany({
//               where: { leadId: duplicate.id },
//               data: { leadId: primaryLead.id },
//             })

//             // Merge qualification data (keep highest scores)
//             if (duplicate.qualificationData && primaryLead.qualificationData) {
//               await tx.leadQualificationData.update({
//                 where: { leadId: primaryLead.id },
//                 data: {
//                   intentScore: Math.max(
//                     duplicate.qualificationData.intentScore,
//                     primaryLead.qualificationData.intentScore,
//                   ),
//                   sentimentScore: Math.max(
//                     duplicate.qualificationData.sentimentScore,
//                     primaryLead.qualificationData.sentimentScore,
//                   ),
//                   engagementScore: Math.max(
//                     duplicate.qualificationData.engagementScore,
//                     primaryLead.qualificationData.engagementScore,
//                   ),
//                   revenueScore: Math.max(
//                     duplicate.qualificationData.revenueScore || 0,
//                     primaryLead.qualificationData.revenueScore || 0,
//                   ),
//                   // estimatedValue:
//                   //   duplicate.qualificationData.estimatedValue > primaryLead.qualificationData.estimatedValue
//                   //     ? duplicate.qualificationData.estimatedValue
//                   //     : primaryLead.qualificationData.estimatedValue,
//                   estimatedValue: 
//                   (duplicate.qualificationData.estimatedValue ?? 0) > (primaryLead.qualificationData.estimatedValue ?? 0)
//                     ? duplicate.qualificationData.estimatedValue
//                     : primaryLead.qualificationData.estimatedValue,
//                 },
//               })
//             }

//             // Update primary lead with best data
//             await tx.lead.update({
//               where: { id: primaryLead.id },
//               data: {
//                 score: Math.max(duplicate.score, primaryLead.score),
//                 lastContactDate:
//                   duplicate.lastContactDate > primaryLead.lastContactDate
//                     ? duplicate.lastContactDate
//                     : primaryLead.lastContactDate,
//                 name: duplicate.name || primaryLead.name,
//                 email: duplicate.email || primaryLead.email,
//                 phone: duplicate.phone || primaryLead.phone,
//                 tags: Array.from(new Set([...primaryLead.tags, ...duplicate.tags])),
//               },
//             })

//             // Delete the duplicate lead
//             await tx.lead.delete({
//               where: { id: duplicate.id },
//             })
//           }
//         })

//         console.log(`Merged ${duplicatesToMerge.length} duplicate enhanced leads for ${group.instagramUserId}`)
//       }
//     }

//     return { mergedGroups: duplicateGroups.length }
//   } catch (error) {
//     console.error("Error merging duplicate enhanced leads:", error)
//     throw error
//   }
// }





// import { client } from "@/lib/prisma"
// import { Prisma } from "@prisma/client"
// import type { Lead } from "@prisma/client"

// // Enhanced types for the system
// interface N8NAnalysisResponse {
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
//     followUpTimeline?: Array<{
//       action: string
//       delay: number
//     }>
//     competitorAnalysis?: {
//       urgencyIndicators: boolean
//       priceShoppingSignals: boolean
//       competitorMentions: boolean
//     }
//     salesIntelligence?: {
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
//   priorityLead: boolean
//   notificationMessage?: string
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
//   followUpTimeline?: Array<{
//     action: string
//     delay: number
//   }>
//   competitorAnalysis?: {
//     urgencyIndicators: boolean
//     priceShoppingSignals: boolean
//     competitorMentions: boolean
//   }
//   salesIntelligence?: {
//     bestContactTime: string
//     communicationPreference: string
//     decisionMakingStage: string
//     objectionHandling: string[]
//   }
// }

// /**
//  * Enhanced AI-powered message analysis
//  */
// export async function analyzeMessage(message: string, userId?: string, customerId?: string): Promise<MessageAnalysis> {
//   const maxRetries = 3
//   let lastError: Error | null = null

//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || "https://yaziln8n.onrender.com/webhook/analyze-message"

//       console.log(`🚀 Enhanced AI Analysis (attempt ${attempt}/${maxRetries})`)

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
//           analysisType: "enhanced_lead_qualification",
//           userId: userId,
//           customerId: customerId,
//           timestamp: new Date().toISOString(),
//         }),
//       })

//       if (!response.ok) {
//         throw new Error(`Enhanced n8n request failed: ${response.status} ${response.statusText}`)
//       }

//       const result: N8NAnalysisResponse = await response.json()

//       if (!result.success) {
//         throw new Error(`Enhanced N8N Analysis failed: ${result.error?.message || "Unknown error"}`)
//       }

//       if (!result.analysis) {
//         throw new Error("Enhanced N8N returned success but no analysis data")
//       }

//       const analysis = result.analysis

//       console.log(
//         `💎 Enhanced analysis complete - Tier: ${analysis.leadTier}, Score: ${analysis.qualificationScore}, ROI: ${analysis.revenueMetrics.roi}%, Est. Value: $${analysis.estimatedValue}`,
//       )

//       // Track analytics
//       if (userId) {
//         await trackAnalytics(userId, analysis)
//       }

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
//       console.error(`❌ Enhanced analysis error (attempt ${attempt}):`, error)

//       if (attempt < maxRetries) {
//         const waitTime = Math.pow(2, attempt) * 1000
//         console.log(`⏳ Waiting ${waitTime}ms before retry...`)
//         await new Promise((resolve) => setTimeout(resolve, waitTime))
//       }
//     }
//   }

//   console.error(`💥 Enhanced analysis failed after ${maxRetries} attempts:`, lastError)

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
//     riskFactors: ["Enhanced analysis failed - requires manual review"],
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
//  * Track analytics for business intelligence
//  */
// async function trackAnalytics(userId: string, analysis: any) {
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
//     console.error("Error tracking analytics:", error)
//   }
// }

// /**
//  * Enhanced lead scores calculation with revenue intelligence
//  */
// function calculatePremiumLeadScores(currentData: any, analysis: MessageAnalysis) {
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
//     const analysis = await analyzeMessage(content, userId, customerId)

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
//         revenueScore: scores.revenueScore,
//         leadTier: scores.leadTier as any,
//         estimatedValue: scores.estimatedValue,
//         roi: scores.roi,
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
//         revenueScore: scores.revenueScore,
//         leadTier: scores.leadTier as any,
//         estimatedValue: scores.estimatedValue,
//         roi: scores.roi,
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
//     if (analysis.followUpTimeline && analysis.followUpTimeline.length > 0) {
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
// async function handlePremiumLeadQualification(lead: Lead, analysis: MessageAnalysis) {
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
// async function sendPremiumLeadToN8n(lead: Lead, analysis: MessageAnalysis) {
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
// async function updateRevenueMetrics(userId: string, analysis: MessageAnalysis) {
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
//  * Enhanced lead analysis with premium features - THIS IS THE MISSING FUNCTION
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
//  * Get enhanced lead analytics
//  */
// export async function getPremiumLeadAnalytics(userId: string) {
//   try {
//     console.log(`📊 Getting enhanced analytics for user ${userId}`)

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
//       // Enhanced analytics
//       client.premiumAnalytics.findMany({
//         where: { userId },
//         orderBy: { date: "desc" },
//         take: 30,
//       }),
//     ])

//     // Calculate revenue insights
//     const totalEstimatedRevenue = revenueMetrics.reduce((sum, metric) => sum + Number(metric.totalEstimatedRevenue), 0)
//     const totalExpectedRevenue = revenueMetrics.reduce((sum, metric) => sum + Number(metric.totalExpectedRevenue), 0)
//     const averageROI =
//       revenueMetrics.length > 0
//         ? revenueMetrics.reduce((sum, metric) => sum + Number(metric.averageROI), 0) / revenueMetrics.length
//         : 0

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
//       // Enhanced features
//       revenueMetrics: {
//         totalEstimatedRevenue,
//         totalExpectedRevenue,
//         averageROI: Math.round(averageROI * 100) / 100,
//         revenueGrowth: calculateRevenueGrowth(revenueMetrics),
//       },
//       tierDistribution,
//       enhancedInsights: {
//         highValueLeads: tierDistribution.platinum + tierDistribution.gold,
//         averageLeadValue: totalLeads > 0 ? Math.round(totalEstimatedRevenue / totalLeads) : 0,
//         conversionProbability: calculateAverageConversionProbability(premiumAnalytics),
//       },
//       generatedAt: new Date().toISOString(),
//     }

//     console.log(`💎 Enhanced analytics generated for user ${userId}: $${totalEstimatedRevenue} estimated revenue`)

//     return result
//   } catch (error) {
//     console.error("❌ Error getting enhanced lead analytics:", error)
//     throw error
//   }
// }

// /**
//  * Calculate revenue growth trend
//  */
// function calculateRevenueGrowth(metrics: any[]) {
//   if (metrics.length < 2) return 0

//   const recent = metrics.slice(0, 7).reduce((sum, m) => sum + Number(m.totalExpectedRevenue), 0)
//   const previous = metrics.slice(7, 14).reduce((sum, m) => sum + Number(m.totalExpectedRevenue), 0)

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

// /**
//  * Merge duplicate leads
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
//           revenueOpportunities: true,
//           scheduledActions: true,
//         },
//         orderBy: { firstContactDate: "asc" },
//       })

//       if (duplicateLeads.length > 1) {
//         const primaryLead = duplicateLeads[0]
//         const duplicatesToMerge = duplicateLeads.slice(1)

//         // Use transaction for data integrity
//         await client.$transaction(async (tx) => {
//           // Merge enhanced data
//           for (const duplicate of duplicatesToMerge) {
//             // Move interactions to primary lead
//             await tx.leadInteraction.updateMany({
//               where: { leadId: duplicate.id },
//               data: { leadId: primaryLead.id },
//             })

//             // Move revenue opportunities
//             await tx.revenueOpportunity.updateMany({
//               where: { leadId: duplicate.id },
//               data: { leadId: primaryLead.id },
//             })

//             // Move scheduled actions
//             await tx.scheduledAction.updateMany({
//               where: { leadId: duplicate.id },
//               data: { leadId: primaryLead.id },
//             })

//             // Merge qualification data (keep highest scores)
//             if (duplicate.qualificationData && primaryLead.qualificationData) {
//               await tx.leadQualificationData.update({
//                 where: { leadId: primaryLead.id },
//                 data: {
//                   intentScore: Math.max(
//                     duplicate.qualificationData.intentScore,
//                     primaryLead.qualificationData.intentScore,
//                   ),
//                   sentimentScore: Math.max(
//                     duplicate.qualificationData.sentimentScore,
//                     primaryLead.qualificationData.sentimentScore,
//                   ),
//                   engagementScore: Math.max(
//                     duplicate.qualificationData.engagementScore,
//                     primaryLead.qualificationData.engagementScore,
//                   ),
//                   revenueScore: Math.max(
//                     duplicate.qualificationData.revenueScore || 0,
//                     primaryLead.qualificationData.revenueScore || 0,
//                   ),
//                   estimatedValue:
//                     (duplicate.qualificationData.estimatedValue ?? 0) >
//                     (primaryLead.qualificationData.estimatedValue ?? 0)
//                       ? duplicate.qualificationData.estimatedValue
//                       : primaryLead.qualificationData.estimatedValue,
//                 },
//               })
//             }

//             // Update primary lead with best data
//             await tx.lead.update({
//               where: { id: primaryLead.id },
//               data: {
//                 score: Math.max(duplicate.score, primaryLead.score),
//                 lastContactDate:
//                   duplicate.lastContactDate > primaryLead.lastContactDate
//                     ? duplicate.lastContactDate
//                     : primaryLead.lastContactDate,
//                 name: duplicate.name || primaryLead.name,
//                 email: duplicate.email || primaryLead.email,
//                 phone: duplicate.phone || primaryLead.phone,
//                 tags: Array.from(new Set([...primaryLead.tags, ...duplicate.tags])),
//               },
//             })

//             // Delete the duplicate lead
//             await tx.lead.delete({
//               where: { id: duplicate.id },
//             })
//           }
//         })

//         console.log(`Merged ${duplicatesToMerge.length} duplicate enhanced leads for ${group.instagramUserId}`)
//       }
//     }

//     return { mergedGroups: duplicateGroups.length }
//   } catch (error) {
//     console.error("Error merging duplicate enhanced leads:", error)
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















import { client } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import type { Lead } from "@prisma/client"

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
    followUpTimeline?: Array<{
      action: string
      delay: number
    }>
    competitorAnalysis?: {
      urgencyIndicators: boolean
      priceShoppingSignals: boolean
      competitorMentions: boolean
    }
    salesIntelligence?: {
      bestContactTime: string
      communicationPreference: string
      decisionMakingStage: string
      objectionHandling: string[]
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
  followUpTimeline?: Array<{
    action: string
    delay: number
  }>
  competitorAnalysis?: {
    urgencyIndicators: boolean
    priceShoppingSignals: boolean
    competitorMentions: boolean
  }
  salesIntelligence?: {
    bestContactTime: string
    communicationPreference: string
    decisionMakingStage: string
    objectionHandling: string[]
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
        followUpTimeline: analysis.followUpTimeline || [],
        competitorAnalysis: analysis.competitorAnalysis || {
          urgencyIndicators: false,
          priceShoppingSignals: false,
          competitorMentions: false,
        },
        salesIntelligence: analysis.salesIntelligence || {
          bestContactTime: "business_hours",
          communicationPreference: "instagram_dm",
          decisionMakingStage: "research",
          objectionHandling: [],
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
    followUpTimeline: [],
    competitorAnalysis: {
      urgencyIndicators: false,
      priceShoppingSignals: false,
      competitorMentions: false,
    },
    salesIntelligence: {
      bestContactTime: "business_hours",
      communicationPreference: "instagram_dm",
      decisionMakingStage: "unknown",
      objectionHandling: [],
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
 * Enhanced lead scores calculation with revenue intelligence
 */
function calculatePremiumLeadScores(currentData: any, analysis: MessageAnalysis) {
  let intentScore = currentData?.intentScore || 0
  let sentimentScore = currentData?.sentimentScore || 0
  let recencyScore = currentData?.recencyScore || 0
  let engagementScore = currentData?.engagementScore || 0
  let revenueScore = currentData?.revenueScore || 0

  // Use premium qualification score as primary indicator
  const premiumQualificationScore = analysis.qualificationScore || 0
  const revenueMultiplier = analysis.revenueMetrics.roi > 100 ? 1.5 : analysis.revenueMetrics.roi > 50 ? 1.2 : 1.0

  // Enhanced intent scoring with revenue consideration
  if (analysis.purchaseIntent > 8) {
    intentScore += 6 * revenueMultiplier
  } else if (analysis.purchaseIntent > 6) {
    intentScore += 4 * revenueMultiplier
  } else if (analysis.purchaseIntent > 4) {
    intentScore += 3 * revenueMultiplier
  } else if (analysis.purchaseIntent > 2) {
    intentScore += 2 * revenueMultiplier
  }

  // Premium sentiment analysis
  if (analysis.sentiment > 0.7) {
    sentimentScore += 4
  } else if (analysis.sentiment > 0.3) {
    sentimentScore += 3
  } else if (analysis.sentiment > 0) {
    sentimentScore += 2
  } else if (analysis.sentiment < -0.5) {
    sentimentScore -= 3
  } else if (analysis.sentiment < 0) {
    sentimentScore -= 2
  }

  // Enhanced engagement scoring
  if (analysis.questionIntent) engagementScore += 3
  if (analysis.informationSharing) engagementScore += 4
  if (analysis.objections) engagementScore += 2
  if (analysis.urgencyLevel >= 4) engagementScore += 3
  if (analysis.urgencyLevel >= 2) engagementScore += 2

  // Revenue score calculation
  revenueScore = Math.min(25, analysis.revenueScore || 0)

  // Lead tier bonus
  let tierBonus = 0
  switch (analysis.leadTier) {
    case "PLATINUM":
      tierBonus = 15
      break
    case "GOLD":
      tierBonus = 10
      break
    case "SILVER":
      tierBonus = 5
      break
    default:
      tierBonus = 0
  }

  // Update recency score
  recencyScore = 5

  // Cap individual scores
  intentScore = Math.min(intentScore, 20)
  sentimentScore = Math.max(Math.min(sentimentScore, 15), -10)
  engagementScore = Math.min(engagementScore, 15)

  // Calculate total score with premium weighting
  const calculatedScore = intentScore + sentimentScore + recencyScore + engagementScore + revenueScore + tierBonus
  const totalScore = Math.max(premiumQualificationScore, calculatedScore)

  return {
    intentScore,
    sentimentScore,
    recencyScore,
    engagementScore,
    revenueScore,
    tierBonus,
    totalScore: Math.min(totalScore, 100),
    premiumQualificationScore,
    leadTier: analysis.leadTier,
    estimatedValue: analysis.estimatedValue,
    roi: analysis.revenueMetrics.roi,
  }
}

/**
 * Premium interaction processing with revenue intelligence
 */
export async function processPremiumInteraction(
  leadId: string,
  content: string,
  type: string,
  direction: string,
  userId: string,
  customerId: string,
  timestamp?: Date,
) {
  try {
    console.log(`💎 Processing premium interaction for lead ${leadId}`)

    // Premium AI analysis
    const analysis = await analyzeMessage(content, userId, customerId)

    // Create enhanced interaction record
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
          // Premium metadata
          qualificationScore: analysis.qualificationScore,
          purchaseIntent: analysis.purchaseIntent,
          urgencyLevel: analysis.urgencyLevel,
          buyerPersona: analysis.buyerPersona,
          recommendedAction: analysis.recommendedAction,
          riskFactors: analysis.riskFactors,
          opportunities: analysis.opportunities,
          analysisQuality: analysis.analysisQuality,
          priorityLead: analysis.priorityLead,
          notificationMessage: analysis.notificationMessage,
          // Revenue intelligence
          revenueScore: analysis.revenueScore,
          leadTier: analysis.leadTier,
          estimatedValue: analysis.estimatedValue,
          followUpStrategy: analysis.followUpStrategy,
          nextActions: analysis.nextActions,
          revenueMetrics: analysis.revenueMetrics,
          followUpTimeline: analysis.followUpTimeline,
          competitorAnalysis: analysis.competitorAnalysis,
          salesIntelligence: analysis.salesIntelligence,
        } as Prisma.InputJsonValue,
      },
    })

    // Get lead with qualification data
    const lead = await client.lead.findUnique({
      where: { id: leadId },
      include: { qualificationData: true },
    })

    if (!lead) {
      throw new Error(`Lead not found: ${leadId}`)
    }

    // Calculate premium scores
    const scores = calculatePremiumLeadScores(lead.qualificationData, analysis)

    console.log(`💰 Premium scores for lead ${leadId}:`, scores)

    // Update qualification data with premium features
    await client.leadQualificationData.upsert({
      where: { leadId },
      update: {
        intentScore: scores.intentScore,
        sentimentScore: scores.sentimentScore,
        recencyScore: scores.recencyScore,
        engagementScore: scores.engagementScore,
        revenueScore: scores.revenueScore,
        leadTier: scores.leadTier as any,
        estimatedValue: scores.estimatedValue,
        roi: scores.roi,
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
        revenueScore: scores.revenueScore,
        leadTier: scores.leadTier as any,
        estimatedValue: scores.estimatedValue,
        roi: scores.roi,
        qualificationData: {
          premiumQualificationScore: scores.premiumQualificationScore,
          leadTier: scores.leadTier,
          estimatedValue: scores.estimatedValue,
          roi: scores.roi,
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

    // Determine new status with premium logic
    let newStatus = lead.status
    const qualificationThreshold = 70

    if (
      analysis.leadTier === "PLATINUM" ||
      analysis.leadTier === "GOLD" ||
      scores.totalScore >= qualificationThreshold
    ) {
      if (lead.status === "NEW" || lead.status === "QUALIFYING") {
        newStatus = "QUALIFIED"
        console.log(`🎯 Lead ${leadId} qualified - Tier: ${analysis.leadTier}, Score: ${scores.totalScore}`)
      }
    } else if (lead.status === "NEW") {
      newStatus = "QUALIFYING"
    }

    // Update lead with premium data
    const updatedLead = await client.lead.update({
      where: { id: leadId },
      data: {
        score: scores.totalScore,
        status: newStatus,
        lastContactDate: new Date(),
        updatedAt: new Date(),
        metadata: {
          ...((lead.metadata as Record<string, any>) || {}),
          lastAnalysis: {
            qualificationScore: analysis.qualificationScore,
            recommendedAction: analysis.recommendedAction,
            buyerPersona: analysis.buyerPersona,
            urgencyLevel: analysis.urgencyLevel,
            priorityLead: analysis.priorityLead,
            notificationMessage: analysis.notificationMessage,
            // Premium fields
            leadTier: analysis.leadTier,
            estimatedValue: analysis.estimatedValue,
            roi: analysis.revenueMetrics.roi,
            followUpStrategy: analysis.followUpStrategy,
            nextActions: analysis.nextActions,
            analysisTimestamp: new Date().toISOString(),
          },
        } as Prisma.InputJsonValue,
        ...(newStatus !== lead.status &&
          newStatus === "QUALIFIED" && {
            qualifiedDate: new Date(),
          }),
      },
    })

    // Premium lead notifications and automation
    if (newStatus === "QUALIFIED" && lead.status !== "QUALIFIED") {
      await handlePremiumLeadQualification(updatedLead, analysis)
    }

    // Schedule follow-up actions
    if (analysis.followUpTimeline && analysis.followUpTimeline.length > 0) {
      await scheduleFollowUpActions(leadId, analysis.followUpTimeline)
    }

    return {
      interaction,
      lead: updatedLead,
      analysis,
      scores,
      statusChanged: newStatus !== lead.status,
      premiumFeatures: {
        leadTier: analysis.leadTier,
        estimatedValue: analysis.estimatedValue,
        roi: analysis.revenueMetrics.roi,
        followUpStrategy: analysis.followUpStrategy,
        nextActions: analysis.nextActions,
      },
    }
  } catch (error) {
    console.error("❌ Error processing premium interaction:", error)
    throw error
  }
}

/**
 * Handle premium lead qualification with advanced automation
 */
async function handlePremiumLeadQualification(lead: Lead, analysis: MessageAnalysis) {
  try {
    console.log(`🚀 Handling premium lead qualification for ${lead.id}`)

    // Send to premium n8n workflow
    await sendPremiumLeadToN8n(lead, analysis)

    // Create revenue opportunity record
    await client.revenueOpportunity.create({
      data: {
        leadId: lead.id,
        userId: lead.userId,
        estimatedValue: analysis.estimatedValue,
        expectedRevenue: analysis.revenueMetrics.expectedRevenue,
        roi: analysis.revenueMetrics.roi,
        conversionProbability: analysis.revenueMetrics.conversionProbability,
        leadTier: analysis.leadTier,
        status: "ACTIVE",
        createdAt: new Date(),
      },
    })

    // Track revenue metrics
    await updateRevenueMetrics(lead.userId, analysis)

    console.log(`💰 Premium lead qualification completed for ${lead.id}`)
  } catch (error) {
    console.error("Error handling premium lead qualification:", error)
  }
}

/**
 * Send premium lead data to enhanced n8n workflow
 */
async function sendPremiumLeadToN8n(lead: Lead, analysis: MessageAnalysis) {
  const maxRetries = 3
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const n8nLeadWebhookUrl = process.env.N8N_PREMIUM_LEAD_WEBHOOK_URL || process.env.N8N_LEAD_WEBHOOK_URL

      if (!n8nLeadWebhookUrl) {
        console.log("N8N_PREMIUM_LEAD_WEBHOOK_URL not configured, skipping premium lead notification")
        return
      }

      console.log(`🚀 Sending premium lead ${lead.id} to n8n (attempt ${attempt}/${maxRetries})`)

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
          // Premium data
          leadTier: analysis.leadTier,
          estimatedValue: analysis.estimatedValue,
          revenueMetrics: analysis.revenueMetrics,
          followUpStrategy: analysis.followUpStrategy,
          nextActions: analysis.nextActions,
          salesIntelligence: analysis.salesIntelligence,
          eventType: "premium_lead_qualified",
          timestamp: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to send premium lead to n8n: ${response.status} ${response.statusText}`)
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

      console.log(`✅ Premium lead ${lead.id} successfully sent to n8n`)
      return responseData
    } catch (error) {
      lastError = error as Error
      console.error(`❌ Error sending premium lead to n8n (attempt ${attempt}):`, error)

      if (attempt < maxRetries) {
        const waitTime = Math.pow(2, attempt) * 1000
        await new Promise((resolve) => setTimeout(resolve, waitTime))
      }
    }
  }

  console.error(`💥 Failed to send premium lead to n8n after ${maxRetries} attempts:`, lastError)
  throw lastError
}

/**
 * Schedule automated follow-up actions
 */
async function scheduleFollowUpActions(leadId: string, timeline: Array<{ action: string; delay: number }>) {
  try {
    for (const item of timeline) {
      const scheduledTime = new Date(Date.now() + item.delay * 60 * 60 * 1000) // delay in hours

      await client.scheduledAction.create({
        data: {
          leadId,
          action: item.action,
          scheduledFor: scheduledTime,
          status: "PENDING",
          createdAt: new Date(),
        },
      })
    }

    console.log(`📅 Scheduled ${timeline.length} follow-up actions for lead ${leadId}`)
  } catch (error) {
    console.error("Error scheduling follow-up actions:", error)
  }
}

/**
 * Update revenue metrics for business intelligence
 */
async function updateRevenueMetrics(userId: string, analysis: MessageAnalysis) {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    await client.revenueMetrics.upsert({
      where: {
        userId_date: {
          userId: userId,
          date: today,
        },
      },
      update: {
        totalEstimatedRevenue: { increment: analysis.estimatedValue },
        totalExpectedRevenue: { increment: analysis.revenueMetrics.expectedRevenue },
        qualifiedLeads: { increment: 1 },
        averageROI: analysis.revenueMetrics.roi,
        updatedAt: new Date(),
      },
      create: {
        userId: userId,
        date: today,
        totalEstimatedRevenue: analysis.estimatedValue,
        totalExpectedRevenue: analysis.revenueMetrics.expectedRevenue,
        qualifiedLeads: 1,
        averageROI: analysis.revenueMetrics.roi,
      },
    })
  } catch (error) {
    console.error("Error updating revenue metrics:", error)
  }
}

/**
 * Sync lead to CRM with comprehensive data
 */
async function syncLeadToCRM(lead: Lead, analysis: MessageAnalysis, crmIntegration: any, options: any) {
  try {
    const crmData = {
      leadId: lead.id,
      name: lead.name || `Instagram User ${lead.instagramUserId}`,
      email: lead.email,
      phone: lead.phone,
      source: "Instagram",
      status: lead.status,
      score: lead.score,
      leadTier: analysis.leadTier,
      estimatedValue: analysis.estimatedValue,
      roi: analysis.revenueMetrics.roi,
      conversionProbability: analysis.revenueMetrics.conversionProbability,
      buyerPersona: analysis.buyerPersona,
      followUpStrategy: analysis.followUpStrategy,
      salesIntelligence: analysis.salesIntelligence,
      competitorAnalysis: analysis.competitorAnalysis,
      nextActions: analysis.nextActions,
      tags: [`Tier:${analysis.leadTier}`, `Score:${lead.score}`, `ROI:${analysis.revenueMetrics.roi}%`, ...lead.tags],
    }

    // Call CRM API based on provider
    let crmResponse
    switch (crmIntegration.provider) {
      case "HUBSPOT":
        crmResponse = await syncToHubSpot(crmData, crmIntegration, options)
        break
      case "SALESFORCE":
        crmResponse = await syncToSalesforce(crmData, crmIntegration, options)
        break
      case "PIPEDRIVE":
        crmResponse = await syncToPipedrive(crmData, crmIntegration, options)
        break
      default:
        throw new Error(`Unsupported CRM provider: ${crmIntegration.provider}`)
    }

    // Update lead with CRM sync info
    await client.lead.update({
      where: { id: lead.id },
      data: {
        metadata: {
          ...((lead.metadata as any) || {}),
          crmSyncData: {
            syncedAt: new Date().toISOString(),
            crmId: crmResponse.crmId,
            provider: crmIntegration.provider,
            dealId: crmResponse.dealId,
            syncStatus: "success",
          },
        },
      },
    })

    console.log(`✅ Lead ${lead.id} successfully synced to ${crmIntegration.provider}`)
    return crmResponse
  } catch (error) {
    console.error(`❌ Error syncing lead to CRM:`, error)
    throw error
  }
}

/**
 * Sync to HubSpot CRM
 */
async function syncToHubSpot(crmData: any, crmIntegration: any, options: any) {
  const hubspotApiUrl = "https://api.hubapi.com"

  // Create contact
  const contactResponse = await fetch(`${hubspotApiUrl}/crm/v3/objects/contacts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${crmIntegration.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: {
        firstname: crmData.name.split(" ")[0] || "",
        lastname: crmData.name.split(" ").slice(1).join(" ") || "",
        email: crmData.email || "",
        phone: crmData.phone || "",
        lifecyclestage: "lead",
        lead_status: crmData.status,
        hs_lead_status: crmData.leadTier,
        lead_score: crmData.score,
        estimated_value: crmData.estimatedValue,
        roi_percentage: crmData.roi,
        conversion_probability: crmData.conversionProbability,
        buyer_persona: crmData.buyerPersona,
        follow_up_strategy: crmData.followUpStrategy,
        lead_source: crmData.source,
        instagram_user_id: crmData.leadId,
      },
    }),
  })

  if (!contactResponse.ok) {
    throw new Error(`HubSpot contact creation failed: ${contactResponse.statusText}`)
  }

  const contact = await contactResponse.json()
  let dealId = null

  // Create deal if requested
  if (options.createDeal) {
    const dealResponse = await fetch(`${hubspotApiUrl}/crm/v3/objects/deals`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${crmIntegration.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: {
          dealname: `${crmData.name} - ${crmData.leadTier} Lead`,
          amount: crmData.estimatedValue,
          dealstage: "appointmentscheduled",
          pipeline: "default",
          lead_tier: crmData.leadTier,
          roi_percentage: crmData.roi,
          conversion_probability: crmData.conversionProbability,
        },
        associations: [
          {
            to: { id: contact.id },
            types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 3 }],
          },
        ],
      }),
    })

    if (dealResponse.ok) {
      const deal = await dealResponse.json()
      dealId = deal.id
    }
  }

  return {
    crmId: contact.id,
    dealId: dealId,
    provider: "HUBSPOT",
  }
}

/**
 * Sync to Salesforce CRM
 */
async function syncToSalesforce(crmData: any, crmIntegration: any, options: any) {
  const salesforceApiUrl = `${crmIntegration.baseUrl}/services/data/v57.0`

  // Create lead
  const leadResponse = await fetch(`${salesforceApiUrl}/sobjects/Lead`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${crmIntegration.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      FirstName: crmData.name.split(" ")[0] || "",
      LastName: crmData.name.split(" ").slice(1).join(" ") || "Unknown",
      Email: crmData.email || "",
      Phone: crmData.phone || "",
      Status: "Open - Not Contacted",
      LeadSource: crmData.source,
      Lead_Score__c: crmData.score,
      Lead_Tier__c: crmData.leadTier,
      Estimated_Value__c: crmData.estimatedValue,
      ROI_Percentage__c: crmData.roi,
      Conversion_Probability__c: crmData.conversionProbability,
      Buyer_Persona__c: crmData.buyerPersona,
      Follow_Up_Strategy__c: crmData.followUpStrategy,
      Instagram_User_ID__c: crmData.leadId,
    }),
  })

  if (!leadResponse.ok) {
    throw new Error(`Salesforce lead creation failed: ${leadResponse.statusText}`)
  }

  const lead = await leadResponse.json()
  let opportunityId = null

  // Create opportunity if requested
  if (options.createDeal) {
    const opportunityResponse = await fetch(`${salesforceApiUrl}/sobjects/Opportunity`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${crmIntegration.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Name: `${crmData.name} - ${crmData.leadTier} Opportunity`,
        Amount: crmData.estimatedValue,
        StageName: "Prospecting",
        CloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        Lead_Tier__c: crmData.leadTier,
        ROI_Percentage__c: crmData.roi,
        Conversion_Probability__c: crmData.conversionProbability,
      }),
    })

    if (opportunityResponse.ok) {
      const opportunity = await opportunityResponse.json()
      opportunityId = opportunity.id
    }
  }

  return {
    crmId: lead.id,
    dealId: opportunityId,
    provider: "SALESFORCE",
  }
}

/**
 * Sync to Pipedrive CRM
 */
async function syncToPipedrive(crmData: any, crmIntegration: any, options: any) {
  const pipedriveApiUrl = `${crmIntegration.baseUrl}/v1`

  // Create person
  const personResponse = await fetch(`${pipedriveApiUrl}/persons?api_token=${crmIntegration.apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: crmData.name,
      email: [{ value: crmData.email, primary: true }],
      phone: [{ value: crmData.phone, primary: true }],
      lead_score: crmData.score,
      lead_tier: crmData.leadTier,
      estimated_value: crmData.estimatedValue,
      roi_percentage: crmData.roi,
      conversion_probability: crmData.conversionProbability,
      buyer_persona: crmData.buyerPersona,
      follow_up_strategy: crmData.followUpStrategy,
    }),
  })

  if (!personResponse.ok) {
    throw new Error(`Pipedrive person creation failed: ${personResponse.statusText}`)
  }

  const person = await personResponse.json()
  let dealId = null

  // Create deal if requested
  if (options.createDeal) {
    const dealResponse = await fetch(`${pipedriveApiUrl}/deals?api_token=${crmIntegration.apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: `${crmData.name} - ${crmData.leadTier} Deal`,
        value: crmData.estimatedValue,
        currency: "USD",
        person_id: person.data.id,
        stage_id: 1,
        lead_tier: crmData.leadTier,
        roi_percentage: crmData.roi,
        conversion_probability: crmData.conversionProbability,
      }),
    })

    if (dealResponse.ok) {
      const deal = await dealResponse.json()
      dealId = deal.data.id
    }
  }

  return {
    crmId: person.data.id,
    dealId: dealId,
    provider: "PIPEDRIVE",
  }
}

/**
 * Manual CRM sync function for button actions
 */

/**
 * Manual CRM sync function for button actions
 */
export async function manualSyncToCRM(leadIds: string[], userId: string) {
  try {
    console.log(`🔄 Manual CRM sync initiated for ${leadIds.length} leads`)

    // Get CRM integration
    const crmIntegration = await client.crmIntegration.findFirst({
      where: {
        userId: userId,
        isActive: true,
      },
    })

    if (!crmIntegration) {
      throw new Error("No active CRM integration found")
    }

    const results = []

    for (const leadId of leadIds) {
      try {
        // Get lead with full data
        const lead = await client.lead.findUnique({
          where: { id: leadId },
          include: {
            qualificationData: true,
            interactions: {
              take: 1,
              orderBy: { timestamp: "desc" },
            },
          },
        })

        if (!lead) {
          results.push({ leadId, success: false, error: "Lead not found" })
          continue
        }

        // Get latest analysis from metadata - Fix typo here
        // const lastAnalysis = lead.metadata?.lastAnalysis as any
        // Get latest analysis from metadata - Fix type casting
        const metadata = lead.metadata as Record<string, any>
        const lastAnalysis = metadata?.lastAnalysis

        if (!lastAnalysis) {
          results.push({ leadId, success: false, error: "No analysis data available" })
          continue
        }

        if (!lastAnalysis) {
          results.push({ leadId, success: false, error: "No analysis data available" })
          continue
        }

        // Create analysis object for sync - Add all required MessageAnalysis properties
        const analysisForSync: MessageAnalysis = {
          leadTier: lastAnalysis.leadTier || "BRONZE",
          estimatedValue: lastAnalysis.estimatedValue || 100,
          revenueMetrics: {
            roi: lastAnalysis.roi || 0,
            conversionProbability: lastAnalysis.conversionProbability || 0.1,
            expectedRevenue: lastAnalysis.estimatedValue * 0.1 || 10,
            estimatedRevenue: lastAnalysis.estimatedValue || 100,
            acquisitionCost: 50,
            paybackPeriod: 12,
          },
          buyerPersona: lastAnalysis.buyerPersona || "unknown",
          followUpStrategy: lastAnalysis.followUpStrategy || "standard",
          salesIntelligence: lastAnalysis.salesIntelligence || {},
          competitorAnalysis: lastAnalysis.competitorAnalysis || {},
          nextActions: lastAnalysis.nextActions || [],
          // Add missing required properties
          sentiment: 0,
          purchaseIntent: 0,
          questionIntent: false,
          informationSharing: false,
          objections: false,
          intent: null,
          confidence: 0,
          qualificationScore: lastAnalysis.qualificationScore || 0,
          urgencyLevel: lastAnalysis.urgencyLevel || 1,
          recommendedAction: lastAnalysis.recommendedAction || "manual_review",
          riskFactors: lastAnalysis.riskFactors || [],
          opportunities: lastAnalysis.opportunities || [],
          priorityLead: lastAnalysis.priorityLead || false,
          notificationMessage: lastAnalysis.notificationMessage || "",
          revenueScore: lastAnalysis.revenueScore || 0,
          followUpTimeline: lastAnalysis.followUpTimeline || [],
          analysisQuality: lastAnalysis.analysisQuality || {
            completeness: 0.5,
            confidence: 0.5,
            dataPoints: 1,
          },
        }

        // Sync to CRM
        const syncResult = await syncLeadToCRM(lead, analysisForSync, crmIntegration, {
          createDeal: lastAnalysis.leadTier === "PLATINUM" || lastAnalysis.leadTier === "GOLD",
          includeAnalysis: true,
          includeRevenueData: true,
        })

        results.push({
          leadId,
          success: true,
          crmId: syncResult.crmId,
          dealId: syncResult.dealId,
          provider: syncResult.provider,
        })
      } catch (error) {
        console.error(`Error syncing lead ${leadId}:`, error)
        results.push({
          leadId,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    const successCount = results.filter((r) => r.success).length
    const failureCount = results.filter((r) => !r.success).length

    console.log(`✅ Manual CRM sync completed: ${successCount} successful, ${failureCount} failed`)

    return {
      success: true,
      results,
      summary: {
        total: leadIds.length,
        successful: successCount,
        failed: failureCount,
      },
    }
  } catch (error) {
    console.error("❌ Error in manual CRM sync:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      results: [],
    }
  }
}



/**
 * Batch sync leads to CRM
 */
export async function batchSyncToCRM(userId: string, filters?: any) {
  try {
    console.log(`🔄 Batch CRM sync initiated for user ${userId}`)

    // Get leads based on filters
    const whereClause: any = { userId }

    if (filters?.status) {
      whereClause.status = filters.status
    }

    if (filters?.minScore) {
      whereClause.score = { gte: filters.minScore }
    }

    if (filters?.leadTier) {
      whereClause.qualificationData = {
        leadTier: filters.leadTier,
      }
    }

    const leads = await client.lead.findMany({
      where: whereClause,
      include: {
        qualificationData: true,
      },
      take: 100, // Limit batch size
    })

    const leadIds = leads.map((lead) => lead.id)

    return await manualSyncToCRM(leadIds, userId)
  } catch (error) {
    console.error("❌ Error in batch CRM sync:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      results: [],
    }
  }
}

/**
 * Enhanced lead analysis with premium features - THIS IS THE MISSING FUNCTION
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
  const maxRetries = 3
  let attempt = 0

  while (attempt < maxRetries) {
    try {
      const { userId, automationId, platformId, customerId, message, messageType, timestamp } = params

      console.log(`💎 Analyzing premium lead: ${customerId} on platform ${platformId}`)

      // Use transaction for atomicity
      const result = await client.$transaction(async (tx) => {
        // Find or create lead
        let lead = await tx.lead.findFirst({
          where: {
            instagramUserId: customerId,
            pageId: platformId,
            userId: userId,
          },
          include: { qualificationData: true },
        })

        if (!lead) {
          console.log(`🆕 Creating new premium lead for ${customerId}`)
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
                createdFrom: "premium_webhook",
                firstMessageTimestamp: timestamp.toISOString(),
                messageType,
                createdAt: new Date().toISOString(),
                isPremium: true,
              } as Prisma.InputJsonValue,
            },
            include: { qualificationData: true },
          })
        } else {
          console.log(`🔄 Updating existing premium lead ${lead.id}`)
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

      // Process premium interaction
      const interactionResult = await processPremiumInteraction(
        result.id,
        message,
        messageType.toLowerCase(),
        "inbound",
        userId,
        customerId,
        timestamp,
      )

      // Get final lead data
      const finalLead = await client.lead.findUnique({
        where: { id: result.id },
        include: {
          qualificationData: true,
          interactions: {
            take: 5,
            orderBy: { timestamp: "desc" },
          },
        },
      })

      console.log(
        `💰 Premium lead analysis completed for ${customerId}: Tier ${interactionResult?.premiumFeatures?.leadTier}, Score ${finalLead?.score}, Est. Value $${interactionResult?.premiumFeatures?.estimatedValue}`,
      )

      return {
        lead: finalLead,
        interaction: interactionResult,
        isNewLead: result.status === "NEW",
        statusChanged: interactionResult?.statusChanged || false,
        premiumFeatures: interactionResult?.premiumFeatures,
      }
    } catch (error) {
      attempt++
      console.error(`❌ Error analyzing premium lead (attempt ${attempt}):`, error)

      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002" && attempt < maxRetries) {
        console.log(`🔄 Retrying due to unique constraint violation (attempt ${attempt + 1})`)
        await new Promise((resolve) => setTimeout(resolve, 100 * attempt))
        continue
      }

      if (attempt >= maxRetries) {
        console.error(`💥 Failed to analyze premium lead after ${maxRetries} attempts`)
        return null
      }
    }
  }

  return null
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
export async function mergeDuplicateLeadsE(userId: string) {
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
                  estimatedValue:
                    (duplicate.qualificationData.estimatedValue ?? 0) >
                    (primaryLead.qualificationData.estimatedValue ?? 0)
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

/**
 * Helper function to merge arrays and remove duplicates
 */
function mergeUniqueArraysE(arr1: string[], arr2: string[]): string[] {
  const combined = [...arr1, ...arr2]
  return Array.from(new Set(combined))
}































// import { client } from "@/lib/prisma"
// import { Prisma } from "@prisma/client"

// Enhanced types that match your n8n workflow expectations
interface N8NEnhancedAnalysisRequest {
  message: string
  analysisType: "enhanced_lead_qualification"
  userId: string
  customerId: string
  leadId?: string
  leadName?: string
  leadEmail?: string
  leadPhone?: string
  leadStage?: "NEW" | "QUALIFYING" | "QUALIFIED" | "CONVERTED" | "LOST"
  previousInteractions?: number
  leadSource?: string
  businessInfo?: {
    name?: string
    industry?: string
    services?: string
    targetMarket?: string
    priceRange?: string
    valueProposition?: string
    contactName?: string
    fromEmail?: string
    bookingLink?: string
    signupLink?: string
    resourceLink?: string
    testimonial?: string
  }
  webhookUrls?: {
    dashboardNotification?: string
    crmSync?: string
    scheduleFollowUp?: string
    teamNotification?: string
  }
  emailCredentials?: {
    provider?: "sendgrid" | "mailgun" | "resend"
    domain?: string
  }
  apiKey?: string
  timestamp: string
}

interface N8NEnhancedAnalysisResponse {
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
    leadStageRecommendation: "NEW" | "QUALIFYING" | "QUALIFIED" | "CONVERTED" | "LOST"
    intent: {
      category: string
      confidence: number
      keywords: string[]
      reasoning: string
    }
    recommendedActions: {
      immediate: string[]
      shortTerm: string[]
      longTerm: string[]
    }
    emailSequence: {
      trigger: string
      priority: "high" | "medium" | "low"
      delay: number
    }
    followUpSchedule: {
      nextContact: string
      frequency: "daily" | "weekly" | "biweekly" | "monthly"
      method: "email" | "phone" | "sms" | "social"
    }
    personalizationData: {
      painPoints: string[]
      interests: string[]
      budget: string
      timeline: string
      competitors: string[]
      decisionFactors: string[]
    }
    riskFactors: string[]
    opportunities: string[]
    notificationData: {
      priority: "urgent" | "high" | "medium" | "low"
      message: string
      actionRequired: boolean
      suggestedResponse: string
    }
    enhancedScore: {
      totalScore: number
      baseScore: number
      intentBonus: number
      urgencyBonus: number
      sentimentBonus: number
      personaBonus: number
      stageBonus: number
    }
    revenueData: {
      estimatedValue: number
      conversionProbability: number
      expectedRevenue: number
      tier: string
      confidence: number
    }
    automationTriggers: {
      sendEmail: boolean
      scheduleFollowUp: boolean
      notifyTeam: boolean
      updateCRM: boolean
      triggerSequence: boolean
    }
    processingData: {
      processedAt: string
      leadId: string
      userId: string
      businessId?: string
      source: string
      version: string
    }
  }
  actionsTaken?: {
    emailSent: boolean
    crmUpdated: boolean
    followUpScheduled: boolean
    teamNotified: boolean
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

/**
 * Enhanced AI-powered message analysis with comprehensive business context
 */
export async function analyzeEnhancedMessage(
  message: string,
  userId: string,
  customerId: string,
  leadData?: {
    leadId?: string
    name?: string
    email?: string
    phone?: string
    stage?: string
    previousInteractions?: number
    source?: string
  },
  businessContext?: {
    automationId?: string
    businessName?: string
    industry?: string
    services?: string
    valueProposition?: string
  },
): Promise<N8NEnhancedAnalysisResponse> {
  const maxRetries = 3
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const n8nWebhookUrl = "https://yaziln8n.onrender.com/webhook/analyze-message"
      console.log(
        `🚀 Enhanced N8N Analysis (attempt ${attempt}/${maxRetries}) for lead ${leadData?.leadId || customerId}`,
      )

      // Get business profile for enhanced context
      let businessInfo = {}
      if (businessContext?.automationId) {
        try {
          // Fix: Use User relation to find business
          const automation = await client.automation.findUnique({
            where: { id: businessContext.automationId },
            include: {
              User: {
                include: {
                  businesses: true,
                },
              },
            },
          })

          const business = automation?.User?.businesses?.[0]

          if (business) {
            businessInfo = {
              name: business.businessName || businessContext.businessName,
              industry: business.industry,
              services: business.businessDescription,
              targetMarket: business.targetAudience,
              priceRange: "Contact for pricing",
              valueProposition: business.welcomeMessage,
              contactName: business.name,
              fromEmail: `noreply@${business.businessName?.toLowerCase().replace(/\s+/g, "") || "business"}.com`,
              bookingLink: business.website ? `${business.website}/book` : undefined,
              signupLink: business.website ? `${business.website}/signup` : undefined,
              resourceLink: business.website ? `${business.website}/resources` : undefined,
              testimonial: "Working with us was the best decision our clients made this year.",
            }
          }
        } catch (error) {
          console.error("Error fetching business context:", error)
        }
      }

      // Prepare enhanced request payload
      const enhancedRequest: N8NEnhancedAnalysisRequest = {
        message: message.trim(),
        analysisType: "enhanced_lead_qualification",
        userId: userId,
        customerId: customerId,
        leadId: leadData?.leadId,
        leadName: leadData?.name,
        leadEmail: leadData?.email,
        leadPhone: leadData?.phone,
        leadStage: (leadData?.stage as any) || "NEW",
        previousInteractions: leadData?.previousInteractions || 0,
        leadSource: leadData?.source || "instagram",
        businessInfo: businessInfo,
        webhookUrls: {
          dashboardNotification: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/dashboard-notification`,
          crmSync: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/crm-sync`,
          scheduleFollowUp: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/schedule-followup`,
          teamNotification: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/team-notification`,
        },
        emailCredentials: {
          provider: (process.env.EMAIL_PROVIDER as any) || "resend",
          domain: process.env.EMAIL_DOMAIN,
        },
        apiKey: process.env.INTERNAL_API_KEY,
        timestamp: new Date().toISOString(),
      }

      const response = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.N8N_API_KEY && {
            Authorization: `Bearer ${process.env.N8N_API_KEY}`,
          }),
        },
        body: JSON.stringify(enhancedRequest),
        signal: AbortSignal.timeout(30000), // 30 second timeout
      })

      if (!response.ok) {
        throw new Error(`Enhanced n8n request failed: ${response.status} ${response.statusText}`)
      }

      const result: N8NEnhancedAnalysisResponse = await response.json()

      if (!result.success) {
        throw new Error(`Enhanced N8N Analysis failed: ${result.error?.message || "Unknown error"}`)
      }

      if (!result.analysis) {
        throw new Error("Enhanced N8N returned success but no analysis data")
      }

      console.log(
        `💎 Enhanced analysis complete - Tier: ${result.analysis.leadTier}, Score: ${result.analysis.enhancedScore?.totalScore}, Revenue: $${result.analysis.revenueData?.estimatedValue}`,
      )

      // Track analytics if we have the data
      if (result.analysis) {
        await trackEnhancedAnalytics(userId, result.analysis)
      }

      return result
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

  // Return comprehensive fallback analysis
  return {
    success: false,
    error: {
      message: lastError?.message || "Enhanced analysis failed after all retries",
      details: lastError?.stack,
      timestamp: new Date().toISOString(),
    },
    analysis: {
      sentiment: 0,
      purchaseIntent: 0,
      questionIntent: false,
      informationSharing: false,
      objections: false,
      urgencyLevel: 1,
      qualificationScore: 0,
      revenueScore: 0,
      leadTier: "BRONZE",
      estimatedValue: 100,
      followUpStrategy: "manual_review",
      nextActions: ["manual_review"],
      buyerPersona: "unknown",
      leadStageRecommendation: "NEW",
      intent: {
        category: "research",
        confidence: 0,
        keywords: [],
        reasoning: "Analysis failed - manual review required",
      },
      recommendedActions: {
        immediate: ["manual_review"],
        shortTerm: ["contact_lead"],
        longTerm: ["nurture_sequence"],
      },
      emailSequence: {
        trigger: "welcome",
        priority: "low",
        delay: 60,
      },
      followUpSchedule: {
        nextContact: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        frequency: "weekly",
        method: "email",
      },
      personalizationData: {
        painPoints: [],
        interests: [],
        budget: "unknown",
        timeline: "unknown",
        competitors: [],
        decisionFactors: [],
      },
      riskFactors: ["Analysis failed - requires manual review"],
      opportunities: [],
      notificationData: {
        priority: "medium",
        message: "Lead analysis failed - manual review required",
        actionRequired: true,
        suggestedResponse: "Thank you for your message! I'll get back to you shortly with more information.",
      },
      enhancedScore: {
        totalScore: 0,
        baseScore: 0,
        intentBonus: 0,
        urgencyBonus: 0,
        sentimentBonus: 0,
        personaBonus: 0,
        stageBonus: 0,
      },
      revenueData: {
        estimatedValue: 100,
        conversionProbability: 0.1,
        expectedRevenue: 10,
        tier: "BRONZE",
        confidence: 0,
      },
      automationTriggers: {
        sendEmail: false,
        scheduleFollowUp: true,
        notifyTeam: false,
        updateCRM: false,
        triggerSequence: false,
      },
      processingData: {
        processedAt: new Date().toISOString(),
        leadId: leadData?.leadId || customerId,
        userId: userId,
        source: leadData?.source || "unknown",
        version: "2.0.0-fallback",
      },
    },
    timestamp: new Date().toISOString(),
    version: "2.0.0",
  }
}

/**
 * Track enhanced analytics for business intelligence
 */
async function trackEnhancedAnalytics(userId: string, analysis: any) {
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
        totalEstimatedRevenue: { increment: analysis.revenueData?.estimatedValue || 0 },
        totalExpectedRevenue: { increment: analysis.revenueData?.expectedRevenue || 0 },
        averageROI: analysis.enhancedScore?.totalScore || 0,
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
        totalEstimatedRevenue: analysis.revenueData?.estimatedValue || 0,
        totalExpectedRevenue: analysis.revenueData?.expectedRevenue || 0,
        averageROI: analysis.enhancedScore?.totalScore || 0,
      },
    })
  } catch (error) {
    console.error("Error tracking enhanced analytics:", error)
  }
}

/**
 * Enhanced lead analysis with comprehensive n8n integration
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

      console.log(`💎 Analyzing enhanced lead: ${customerId} on platform ${platformId}`)

      // Use transaction for atomicity
      const result = await client.$transaction(async (tx) => {
        // Find or create lead with enhanced data
        let lead = await tx.lead.findFirst({
          where: {
            instagramUserId: customerId,
            pageId: platformId,
            userId: userId,
          },
          include: {
            qualificationData: true,
            interactions: {
              take: 5,
              orderBy: { timestamp: "desc" },
            },
          },
        })

        if (!lead) {
          console.log(`🆕 Creating new enhanced lead for ${customerId}`)
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
                createdFrom: "enhanced_webhook",
                firstMessageTimestamp: timestamp.toISOString(),
                messageType,
                createdAt: new Date().toISOString(),
                isEnhanced: true,
              } as Prisma.InputJsonValue,
            },
            include: {
              qualificationData: true,
              interactions: {
                take: 5,
                orderBy: { timestamp: "desc" },
              },
            },
          })
        } else {
          console.log(`🔄 Updating existing enhanced lead ${lead.id}`)

          lead = await tx.lead.update({
            where: { id: lead.id },
            data: {
              lastContactDate: timestamp,
              updatedAt: new Date(),
            },
            include: {
              qualificationData: true,
              interactions: {
                take: 5,
                orderBy: { timestamp: "desc" },
              },
            },
          })
        }

        return lead
      })

      // Fix: Handle null values properly by converting to undefined
      const leadData = {
        leadId: result.id,
        name: result.name || undefined,
        email: result.email || undefined,
        phone: result.phone || undefined,
        stage: result.status,
        previousInteractions: result.interactions?.length || 0,
        source: result.source,
      }

      const businessContext = {
        automationId,
      }

      // Process enhanced interaction with n8n
      const analysisResult = await analyzeEnhancedMessage(message, userId, customerId, leadData, businessContext)

      if (analysisResult.success && analysisResult.analysis) {
        // Update lead with enhanced analysis results
        await updateLeadWithEnhancedAnalysis(result.id, analysisResult.analysis, message, messageType, timestamp)
      }

      // Get final lead data
      const finalLead = await client.lead.findUnique({
        where: { id: result.id },
        include: {
          qualificationData: true,
          interactions: {
            take: 5,
            orderBy: { timestamp: "desc" },
          },
        },
      })

      console.log(
        `💰 Enhanced lead analysis completed for ${customerId}: Tier ${analysisResult.analysis?.leadTier}, Score ${analysisResult.analysis?.enhancedScore?.totalScore}, Revenue $${analysisResult.analysis?.revenueData?.estimatedValue}`,
      )

      return {
        lead: finalLead,
        analysis: analysisResult,
        isNewLead: result.status === "NEW",
        statusChanged: analysisResult.analysis?.leadStageRecommendation !== result.status,
        enhancedFeatures: {
          leadTier: analysisResult.analysis?.leadTier,
          estimatedValue: analysisResult.analysis?.revenueData?.estimatedValue,
          automationTriggered: analysisResult.actionsTaken,
          nextActions: analysisResult.analysis?.recommendedActions,
        },
      }
    } catch (error) {
      attempt++
      console.error(`❌ Error analyzing enhanced lead (attempt ${attempt}):`, error)

      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002" && attempt < maxRetries) {
        console.log(`🔄 Retrying due to unique constraint violation (attempt ${attempt + 1})`)
        await new Promise((resolve) => setTimeout(resolve, 100 * attempt))
        continue
      }

      if (attempt >= maxRetries) {
        console.error(`💥 Failed to analyze enhanced lead after ${maxRetries} attempts`)
        return null
      }
    }
  }

  return null
}

/**
 * Update lead with enhanced analysis results
 */
async function updateLeadWithEnhancedAnalysis(
  leadId: string,
  analysis: any,
  message: string,
  messageType: string,
  timestamp: Date,
) {
  try {
    // Create enhanced interaction record
    const interactionId = `${leadId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    await client.leadInteraction.create({
      data: {
        leadId,
        type: messageType.toLowerCase(),
        content: message,
        direction: "inbound",
        sentiment: analysis.sentiment,
        intent: analysis.intent as Prisma.InputJsonValue,
        timestamp: timestamp,
        metadata: {
          confidence: analysis.intent?.confidence || 0,
          analysisTimestamp: new Date().toISOString(),
          interactionId,
          // Enhanced metadata from n8n analysis
          qualificationScore: analysis.qualificationScore,
          purchaseIntent: analysis.purchaseIntent,
          urgencyLevel: analysis.urgencyLevel,
          buyerPersona: analysis.buyerPersona,
          leadTier: analysis.leadTier,
          estimatedValue: analysis.revenueData?.estimatedValue,
          enhancedScore: analysis.enhancedScore,
          revenueData: analysis.revenueData,
          automationTriggers: analysis.automationTriggers,
          personalizationData: analysis.personalizationData,
          recommendedActions: analysis.recommendedActions,
          emailSequence: analysis.emailSequence,
          followUpSchedule: analysis.followUpSchedule,
          notificationData: analysis.notificationData,
          processingData: analysis.processingData,
        } as Prisma.InputJsonValue,
      },
    })

    // Update qualification data
    await client.leadQualificationData.upsert({
      where: { leadId },
      update: {
        intentScore: Math.min(20, analysis.enhancedScore?.intentBonus || 0),
        sentimentScore: Math.max(-10, Math.min(15, analysis.enhancedScore?.sentimentBonus || 0)),
        recencyScore: 5,
        engagementScore: Math.min(15, (analysis.purchaseIntent || 0) + (analysis.urgencyLevel || 0)),
        revenueScore: Math.min(25, analysis.revenueScore || 0),
        leadTier: analysis.leadTier as any,
        estimatedValue: analysis.revenueData?.estimatedValue || 0,
        roi: analysis.revenueData?.conversionProbability ? analysis.revenueData.conversionProbability * 100 : 0,
        aiAnalysis: {
          [new Date().toISOString()]: {
            ...analysis,
            interactionId,
          },
        } as Prisma.InputJsonValue,
        updatedAt: new Date(),
      },
      create: {
        leadId,
        intentScore: Math.min(20, analysis.enhancedScore?.intentBonus || 0),
        sentimentScore: Math.max(-10, Math.min(15, analysis.enhancedScore?.sentimentBonus || 0)),
        recencyScore: 5,
        demographicScore: 0,
        frequencyScore: 0,
        engagementScore: Math.min(15, (analysis.purchaseIntent || 0) + (analysis.urgencyLevel || 0)),
        revenueScore: Math.min(25, analysis.revenueScore || 0),
        leadTier: analysis.leadTier as any,
        estimatedValue: analysis.revenueData?.estimatedValue || 0,
        roi: analysis.revenueData?.conversionProbability ? analysis.revenueData.conversionProbability * 100 : 0,
        qualificationData: {
          enhancedAnalysis: analysis,
          lastProcessing: analysis.processingData,
        } as unknown as Prisma.InputJsonValue,
        aiAnalysis: {
          [new Date().toISOString()]: {
            ...analysis,
            interactionId,
          },
        } as unknown as Prisma.InputJsonValue,
      },
    })

    // Fix: Map n8n response to valid LeadStatus enum values
    const mapLeadStage = (stage: string) => {
      switch (stage) {
        case "HOT":
          return "QUALIFIED" // Map HOT to QUALIFIED since HOT doesn't exist in enum
        case "QUALIFIED":
          return "QUALIFIED"
        case "CONVERTING":
        case "CONVERTED":
          return "CONVERTED"
        case "QUALIFYING":
          return "QUALIFYING"
        case "LOST":
          return "LOST"
        default:
          return "NEW"
      }
    }

    // Update lead status and metadata
    const newStatus = mapLeadStage(analysis.leadStageRecommendation || "NEW")
    const updateData: any = {
      score: analysis.enhancedScore?.totalScore || 0,
      status: newStatus,
      lastContactDate: new Date(),
      updatedAt: new Date(),
      metadata: {
        lastEnhancedAnalysis: {
          ...analysis,
          analysisTimestamp: new Date().toISOString(),
        },
      } as Prisma.InputJsonValue,
    }

    if (newStatus === "QUALIFIED") {
      updateData.qualifiedDate = new Date()
    }

    await client.lead.update({
      where: { id: leadId },
      data: updateData,
    })

    console.log(
      `✅ Lead ${leadId} updated with enhanced analysis - Score: ${analysis.enhancedScore?.totalScore}, Tier: ${analysis.leadTier}`,
    )
  } catch (error) {
    console.error("❌ Error updating lead with enhanced analysis:", error)
    throw error
  }
}

// Export the enhanced analyze function as the main on
export { analyzeLead as analyzeEnhancedLead }

/**
 * Get enhanced lead analytics
 */
export async function getEnhancedLeadAnalytics(userId: string) {
  try {
    console.log(`📊 Getting enhanced analytics for user ${userId}`)

    const [analytics, totalLeads, qualifiedLeads, convertedLeads, recentInteractions, premiumAnalytics] =
      await Promise.all([
        client.lead.groupBy({
          by: ["status"],
          where: { userId },
          _count: { id: true },
          _avg: { score: true },
        }),
        client.lead.count({ where: { userId } }),
        client.lead.count({ where: { userId, status: { in: ["QUALIFIED"] } } }),
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
        client.premiumAnalytics.findMany({
          where: { userId },
          orderBy: { date: "desc" },
          take: 30,
        }),
      ])

    // Calculate enhanced insights
    const totalEstimatedRevenue = premiumAnalytics.reduce(
      (sum, metric) => sum + Number(metric.totalEstimatedRevenue),
      0,
    )
    const totalExpectedRevenue = premiumAnalytics.reduce((sum, metric) => sum + Number(metric.totalExpectedRevenue), 0)
    const averageROI =
      premiumAnalytics.length > 0
        ? premiumAnalytics.reduce((sum, metric) => sum + Number(metric.averageROI), 0) / premiumAnalytics.length
        : 0

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

    return {
      analytics,
      totalLeads,
      qualifiedLeads,
      convertedLeads,
      conversionRate: Math.round(conversionRate * 100) / 100,
      qualificationRate: Math.round(qualificationRate * 100) / 100,
      recentInteractions,
      enhancedMetrics: {
        totalEstimatedRevenue,
        totalExpectedRevenue,
        averageROI: Math.round(averageROI * 100) / 100,
        tierDistribution,
        highValueLeads: tierDistribution.platinum + tierDistribution.gold,
        averageLeadValue: totalLeads > 0 ? Math.round(totalEstimatedRevenue / totalLeads) : 0,
      },
      generatedAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error("❌ Error getting enhanced lead analytics:", error)
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

          // Update primary lead with best data
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
              tags: mergeUniqueArrays(primaryLead.tags, duplicate.tags),
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
