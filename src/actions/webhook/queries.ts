
// "use server"


// import { type TriggerMode, CustomerType } from "@prisma/client"
// import crypto from "crypto"
// import { client } from '@/lib/prisma'
// import type { Message, Conversation } from "@/types/chat"

// export const matchKeyword = async (keyword: string) => {
//   return await client.keyword.findFirst({
//     where: {
//       word: {
//         equals: keyword,
//         mode: 'insensitive',
//       },
//     },
//   })
// }

// export const getKeywordAutomation = async (
//   automationId: string,
//   dm: boolean
// ) => {
//   return await client.automation.findUnique({
//     where: {
//       id: automationId,
//     },

//     include: {
//       dms: dm,
//       trigger: {
//         where: {
//           type: dm ? 'DM' : 'COMMENT',
//         },
//       },
//       listener: true,
//       User: {
//         select: {
//           subscription: {
//             select: {
//               plan: true,
//             },
//           },
//           integrations: {
//             select: {
//               token: true,              
//             },
//           },
//         },
//       },
//     },
//   })
// }
// export const trackResponses = async (
//   automationId: string,
//   type: 'COMMENT' | 'DM'
// ) => {
//   if (type === 'COMMENT') {
//     return await client.listener.update({
//       where: { automationId },
//       data: {
//         commentCount: {
//           increment: 1,
//         },
//       },
//     })
//   }

//   if (type === 'DM') {
//     return await client.listener.update({
//       where: { automationId },
//       data: {
//         dmCount: {
//           increment: 1,
//         },
//       },
//     })
//   }
// }

// export const createChatHistory = (
//   automationId: string,
//   sender: string,
//   reciever: string,
//   message: string
// ) => {
//   return client.automation.update({
//     where: {
//       id: automationId,
//     },
//     data: {
//       dms: {
//         create: {
//           reciever,
//           senderId: sender,
//           message,
//         },
//       },
//     },
//   })
// }

// export const getKeywordPost = async (postId: string, automationId: string) => {
//   return await client.post.findFirst({
//     where: {
//       AND: [{ postid: postId }, { automationId }],
//     },
//     select: { automationId: true },
//   })
// }

// export const getChatHistory = async (sender: string, reciever: string) => {
//   const history = await client.dms.findMany({
//     where: {
//       AND: [{ senderId: sender }, { reciever }],
//     },
//     orderBy: { createdAt: 'asc' },
//   })
//   const chatSession: {
//     role: 'assistant' | 'user'
//     content: string
//   }[] = history.map((chat) => {
//     return {
//       role: chat.reciever ? 'assistant' : 'user',
//       content: chat.message!,
//     }
//   })

//   return {
//     history: chatSession,
//     automationId: history[history.length - 1].automationId,
//   }
// }



// // Enhanced trigger evaluation functions
// export const getActiveTriggersForAutomation = async (automationId: string) => {
//   return await client.trigger.findMany({
//     where: {
//       automationId,
//       isActive: true,
//     },
//     orderBy: {
//       priority: "desc", // Higher priority first
//     },
//     include: {
//       Automation: {
//         include: {
//           User: {
//             select: {
//               subscription: {
//                 select: {
//                   plan: true,
//                 },
//               },
//               integrations: {
//                 select: {
//                   token: true,
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
//   })
// }

// export const getAllActiveAutomationsForPage = async (pageId: string) => {
//   return await client.automation.findMany({
//     where: {
//       active: true,
//       User: {
//         integrations: {
//           some: {
//             instagramId: pageId,
//           },
//         },
//       },
//     },
//     include: {
//       trigger: {
//         where: {
//           isActive: true,
//         },
//         orderBy: {
//           priority: "desc",
//         },
//       },
//       keywords: true,
//       User: {
//         include: {
//           subscription: true,
//           integrations: true,
//         },
//       },
//     },
//   })
// }

// export const updateConversationState = async (
//   userId: string,
//   updates: {
//     isActive?: boolean
//     lastTriggerType?: string
//     lastTriggerReason?: string
//     customerType?: CustomerType
//     interactionCount?: number
//     sentiment?: number
//   },
// ) => {
//   return await client.conversationState.upsert({
//     where: { userId },
//     update: {
//       ...updates,
//       lastInteractionAt: new Date(),
//       updatedAt: new Date(),
//     },
//     create: {
//       userId,
//       isActive: updates.isActive ?? true,
//       lastTriggerType: updates.lastTriggerType,
//       lastTriggerReason: updates.lastTriggerReason,
//       customerType: updates.customerType ?? CustomerType.NEW,
//       interactionCount: updates.interactionCount ?? 1,
//       sentiment: updates.sentiment,
//     },
//   })
// }

// export const logTriggerExecution = async (data: {
//   triggerId: string
//   automationId: string
//   userId: string
//   messageContent: string
//   triggerType: TriggerMode
//   confidence?: number
//   reason?: string
//   success: boolean
//   responseTime?: number
//   errorMessage?: string
//   metadata?: any
// }) => {
//   return await client.triggerExecution.create({
//     data,
//   })
// }

// export const getAIAnalysisFromCache = async (messageContent: string) => {
//   const messageHash = crypto.createHash("sha256").update(messageContent).digest("hex")

//   return await client.aIAnalysisCache.findFirst({
//     where: {
//       messageHash,
//       expiresAt: {
//         gt: new Date(),
//       },
//     },
//   })
// }

// export const cacheAIAnalysis = async (
//   messageContent: string,
//   analysis: {
//     confidence: number
//     intent?: string
//     sentiment?: number
//     isSpam: boolean
//     businessRelevant: boolean
//   },
// ) => {
//   const messageHash = crypto.createHash("sha256").update(messageContent).digest("hex")
//   const expiresAt = new Date()
//   expiresAt.setHours(expiresAt.getHours() + 24) // Cache for 24 hours

//   return await client.aIAnalysisCache.upsert({
//     where: { messageHash },
//     update: {
//       analysis,
//       confidence: analysis.confidence,
//       intent: analysis.intent,
//       sentiment: analysis.sentiment,
//       isSpam: analysis.isSpam,
//       businessRelevant: analysis.businessRelevant,
//       expiresAt,
//     },
//     create: {
//       messageHash,
//       analysis,
//       confidence: analysis.confidence,
//       intent: analysis.intent,
//       sentiment: analysis.sentiment,
//       isSpam: analysis.isSpam,
//       businessRelevant: analysis.businessRelevant,
//       expiresAt,
//     },
//   })
// }

// export const getBusinessHours = async (userId: string) => {
//   return await client.businessHours.findUnique({
//     where: { userId },
//   })
// }

// export const isWithinBusinessHours = async (userId: string, timestamp: Date) => {
//   const businessHours = await getBusinessHours(userId)

//   if (!businessHours || !businessHours.isActive) {
//     return true // If no business hours set, always allow
//   }

//   const day = timestamp.getDay() // 0 = Sunday, 1 = Monday, etc.
//   const time = timestamp.toTimeString().slice(0, 5) // "HH:MM"

//   const daySchedule = {
//     0: { start: businessHours.sundayStart, end: businessHours.sundayEnd },
//     1: { start: businessHours.mondayStart, end: businessHours.mondayEnd },
//     2: { start: businessHours.tuesdayStart, end: businessHours.tuesdayEnd },
//     3: { start: businessHours.wednesdayStart, end: businessHours.wednesdayEnd },
//     4: { start: businessHours.thursdayStart, end: businessHours.thursdayEnd },
//     5: { start: businessHours.fridayStart, end: businessHours.fridayEnd },
//     6: { start: businessHours.saturdayStart, end: businessHours.saturdayEnd },
//   }

//   const schedule = daySchedule[day as keyof typeof daySchedule]

//   if (!schedule.start || !schedule.end) {
//     return false // Day is closed
//   }

//   return time >= schedule.start && time <= schedule.end
// }

// export const getCustomerType = async (pageId: string, senderId: string): Promise<CustomerType> => {
//   const existingHistory = await client.dms.findFirst({
//     where: {
//       senderId,
//       reciever: pageId,
//     },
//   })

//   if (!existingHistory) {
//     return CustomerType.NEW
//   }

//   // Check interaction frequency to determine if VIP
//   const interactionCount = await client.dms.count({
//     where: {
//       senderId,
//       reciever: pageId,
//       createdAt: {
//         gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
//       },
//     },
//   })

//   if (interactionCount >= 10) {
//     return CustomerType.VIP
//   }

//   return CustomerType.RETURNING
// }

// export const updateTriggerAnalytics = async (
//   triggerId: string,
//   execution: {
//     success: boolean
//     confidence?: number
//     responseTime?: number
//     wasSpam?: boolean
//   },
// ) => {
//   const today = new Date()
//   today.setHours(0, 0, 0, 0)

//   return await client.triggerAnalytics.upsert({
//     where: {
//       triggerId_date: {
//         triggerId,
//         date: today,
//       },
//     },
//     update: {
//       totalExecutions: { increment: 1 },
//       successfulExecutions: execution.success ? { increment: 1 } : undefined,
//       failedExecutions: !execution.success ? { increment: 1 } : undefined,
//       spamFiltered: execution.wasSpam ? { increment: 1 } : undefined,
//     },
//     create: {
//       triggerId,
//       date: today,
//       totalExecutions: 1,
//       successfulExecutions: execution.success ? 1 : 0,
//       failedExecutions: execution.success ? 0 : 1,
//       spamFiltered: execution.wasSpam ? 1 : 0,
//       averageConfidence: execution.confidence,
//       averageResponseTime: execution.responseTime,
//     },
//   })
// }

// export const updateWebhookPerformance = async (
//   userId: string,
//   execution: {
//     success: boolean
//     responseTime?: number
//     triggerType?: TriggerMode
//     errorType?: string
//   },
// ) => {
//   const today = new Date()
//   today.setHours(0, 0, 0, 0)
//   const currentHour = new Date().getHours()

//   return await client.webhookPerformance.upsert({
//     where: {
//       userId_date: {
//         userId,
//         date: today,
//       },
//     },
//     update: {
//       totalRequests: { increment: 1 },
//       successfulRequests: execution.success ? { increment: 1 } : undefined,
//       failedRequests: !execution.success ? { increment: 1 } : undefined,
//       peakHour: currentHour,
//     },
//     create: {
//       userId,
//       date: today,
//       totalRequests: 1,
//       successfulRequests: execution.success ? 1 : 0,
//       failedRequests: execution.success ? 0 : 1,
//       averageResponseTime: execution.responseTime,
//       peakHour: currentHour,
//     },
//   })
// }








// "use server"

// import { type TriggerMode, CustomerType } from "@prisma/client"
// import crypto from "crypto"
// import { client } from "@/lib/prisma"

// export const matchKeyword = async (keyword: string) => {
//   return await client.keyword.findFirst({
//     where: {
//       word: {
//         equals: keyword,
//         mode: "insensitive",
//       },
//     },
//   })
// }

// export const getKeywordAutomation = async (automationId: string, dm: boolean) => {
//   return await client.automation.findUnique({
//     where: {
//       id: automationId,
//     },
//     include: {
//       dms: dm,
//       trigger: {
//         where: {
//           type: dm ? "DM" : "COMMENT",
//         },
//       },
//       listener: true,
//       User: {
//         select: {
//           subscription: {
//             select: {
//               plan: true,
//             },
//           },
//           integrations: {
//             select: {
//               token: true,
//             },
//           },
//         },
//       },
//     },
//   })
// }

// // NEW: Get automations that listen to everything (not just keywords)
// export const getOpenListenerAutomations = async (pageId: string, messageType: "DM" | "COMMENT") => {
//   return await client.automation.findMany({
//     where: {
//       active: true,
//       listenMode: "ALL_MESSAGES", // New field we'll add to schema
//       User: {
//         integrations: {
//           some: {
//             instagramId: pageId,
//           },
//         },
//       },
//       trigger: {
//         some: {
//           type: messageType,
//           isActive: true,
//         },
//       },
//     },
//     include: {
//       trigger: {
//         where: {
//           type: messageType,
//           isActive: true,
//         },
//       },
//       listener: true,
//       User: {
//         select: {
//           subscription: {
//             select: {
//               plan: true,
//             },
//           },
//           integrations: {
//             select: {
//               token: true,
//             },
//           },
//         },
//       },
//     },
//     orderBy: {
//       createdAt: "desc", // Most recent automation takes priority
//     },
//     take: 1, // Only get the first matching automation
//   })
// }

// export const trackResponses = async (automationId: string, type: "COMMENT" | "DM") => {
//   if (type === "COMMENT") {
//     return await client.listener.update({
//       where: { automationId },
//       data: {
//         commentCount: {
//           increment: 1,
//         },
//       },
//     })
//   }

//   if (type === "DM") {
//     return await client.listener.update({
//       where: { automationId },
//       data: {
//         dmCount: {
//           increment: 1,
//         },
//       },
//     })
//   }
// }

// export const createChatHistory = (automationId: string, sender: string, reciever: string, message: string) => {
//   return client.automation.update({
//     where: {
//       id: automationId,
//     },
//     data: {
//       dms: {
//         create: {
//           reciever,
//           senderId: sender,
//           message,
//         },
//       },
//     },
//   })
// }

// export const getKeywordPost = async (postId: string, automationId: string) => {
//   return await client.post.findFirst({
//     where: {
//       AND: [{ postid: postId }, { automationId }],
//     },
//     select: { automationId: true },
//   })
// }

// export const getChatHistory = async (sender: string, reciever: string) => {
//   const history = await client.dms.findMany({
//     where: {
//       AND: [{ senderId: sender }, { reciever }],
//     },
//     orderBy: { createdAt: "asc" },
//   })
//   const chatSession: {
//     role: "assistant" | "user"
//     content: string
//   }[] = history.map((chat) => {
//     return {
//       role: chat.reciever ? "assistant" : "user",
//       content: chat.message!,
//     }
//   })

//   return {
//     history: chatSession,
//     automationId: history[history.length - 1]?.automationId,
//   }
// }

// // ENHANCED: More robust message deduplication
// export const checkProcessedMessage = async (messageKey: string): Promise<boolean> => {
//   try {
//     // Create a more unique hash for the message
//     const messageHash = crypto.createHash("sha256").update(messageKey).digest("hex")

//     const processed = await client.processedMessage.findFirst({
//       where: {
//         messageKey: messageHash,
//         createdAt: {
//           gte: new Date(Date.now() - 300000), // Check last 5 minutes instead of 2
//         },
//       },
//     })

//     if (processed) {
//       console.log(`Message already processed: ${messageKey} (hash: ${messageHash})`)
//       return true
//     }

//     return false
//   } catch (error) {
//     console.error("Error checking processed message:", error)
//     return false
//   }
// }

// export const markMessageAsProcessed = async (messageKey: string): Promise<void> => {
//   try {
//     const messageHash = crypto.createHash("sha256").update(messageKey).digest("hex")

//     // Use upsert to handle race conditions better
//     await client.processedMessage.upsert({
//       where: {
//         messageKey: messageHash,
//       },
//       update: {
//         createdAt: new Date(),
//       },
//       create: {
//         messageKey: messageHash,
//         createdAt: new Date(),
//       },
//     })

//     // Clean up old processed messages (older than 30 minutes)
//     await client.processedMessage.deleteMany({
//       where: {
//         createdAt: {
//           lt: new Date(Date.now() - 1800000), // 30 minutes ago
//         },
//       },
//     })
//   } catch (error) {
//     console.error("Error marking message as processed:", error)
//   }
// }

// // ENHANCED: Better conversation state management
// export const updateConversationState = async (
//   userId: string,
//   updates: {
//     isActive?: boolean
//     lastTriggerType?: string
//     lastTriggerReason?: string
//     customerType?: CustomerType
//     interactionCount?: number
//     sentiment?: number
//     lastMessageLength?: number
//     averageResponseTime?: number
//     isInHandoff?: boolean
//     handoffReason?: string
//     automationId?: string // Track which automation is handling this conversation
//     listenMode?: "KEYWORDS" | "ALL_MESSAGES" // Track the listen mode
//   },
// ) => {
//   return await client.conversationState.upsert({
//     where: { userId },
//     update: {
//       ...updates,
//       lastInteractionAt: new Date(),
//       updatedAt: new Date(),
//       interactionCount: updates.interactionCount ? { increment: 1 } : undefined,
//     },
//     create: {
//       userId,
//       isActive: updates.isActive ?? true,
//       lastTriggerType: updates.lastTriggerType,
//       lastTriggerReason: updates.lastTriggerReason,
//       customerType: updates.customerType ?? CustomerType.NEW,
//       interactionCount: updates.interactionCount ?? 1,
//       sentiment: updates.sentiment,
//       lastInteractionAt: new Date(),
//       lastMessageLength: updates.lastMessageLength,
//       averageResponseTime: updates.averageResponseTime,
//       isInHandoff: updates.isInHandoff ?? false,
//       handoffReason: updates.handoffReason,
//     },
//   })
// }

// // NEW: Check if conversation should continue based on automation settings
// export const shouldContinueConversation = async (
//   userId: string,
//   messageType: "DM" | "COMMENT",
// ): Promise<{
//   shouldContinue: boolean
//   automation?: any
//   reason: string
// }> => {
//   try {
//     const conversationState = await client.conversationState.findUnique({
//       where: { userId },
//     })

//     // If conversation is active and recent (within 24 hours), continue
//     if (conversationState?.isActive) {
//       const timeSinceLastInteraction = Date.now() - conversationState.lastInteractionAt.getTime()
//       const twentyFourHours = 24 * 60 * 60 * 1000

//       if (timeSinceLastInteraction < twentyFourHours) {
//         // Try to get the automation that was handling this conversation
//         if (conversationState.automationId) {
//           const automation = await client.automation.findUnique({
//             where: { id: conversationState.automationId },
//             include: {
//               listener: true,
//               User: {
//                 select: {
//                   subscription: { select: { plan: true } },
//                   integrations: { select: { token: true } },
//                 },
//               },
//             },
//           })

//           if (automation && automation.active) {
//             return {
//               shouldContinue: true,
//               automation,
//               reason: "Continuing active conversation",
//             }
//           }
//         }
//       }
//     }

//     // Check for open listener automations (listen to all messages)
//     const [pageId] = userId.split("_")
//     const openAutomations = await getOpenListenerAutomations(pageId, messageType)

//     if (openAutomations.length > 0) {
//       return {
//         shouldContinue: true,
//         automation: openAutomations[0],
//         reason: "Open listener automation available",
//       }
//     }

//     return {
//       shouldContinue: false,
//       reason: "No active conversation or open listener",
//     }
//   } catch (error) {
//     console.error("Error checking conversation continuation:", error)
//     return {
//       shouldContinue: false,
//       reason: "Error checking conversation state",
//     }
//   }
// }

// // Enhanced analytics and performance tracking
// export const logResponseMetrics = async (data: {
//   automationId: string
//   userId: string
//   messageLength: number
//   responseTime: number
//   typingDelay: number
//   wasSuccessful: boolean
//   messageType: "DM" | "COMMENT"
//   hasButtons: boolean
//   sentiment?: "positive" | "neutral" | "negative"
//   priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
// }) => {
//   try {
//     await client.responseMetrics.create({
//       data: {
//         ...data,
//         timestamp: new Date(),
//       },
//     })
//   } catch (error) {
//     console.error("Error logging response metrics:", error)
//   }
// }

// // Smart conversation timeout management
// export const checkConversationTimeout = async (userId: string, timeoutMinutes = 30): Promise<boolean> => {
//   try {
//     const conversationState = await client.conversationState.findUnique({
//       where: { userId },
//     })

//     if (!conversationState || !conversationState.isActive) {
//       return false
//     }

//     const timeoutThreshold = new Date(Date.now() - timeoutMinutes * 60 * 1000)

//     if (conversationState.lastInteractionAt < timeoutThreshold) {
//       // Mark conversation as inactive
//       await client.conversationState.update({
//         where: { userId },
//         data: {
//           isActive: false,
//           updatedAt: new Date(),
//         },
//       })
//       return true
//     }

//     return false
//   } catch (error) {
//     console.error("Error checking conversation timeout:", error)
//     return false
//   }
// }

// // All other existing functions remain the same...
// export const logTriggerExecution = async (data: {
//   triggerId: string
//   automationId: string
//   userId: string
//   messageContent: string
//   triggerType: TriggerMode
//   confidence?: number
//   reason?: string
//   success: boolean
//   responseTime?: number
//   errorMessage?: string
//   metadata?: any
// }) => {
//   return await client.triggerExecution.create({
//     data,
//   })
// }

// export const getAIAnalysisFromCache = async (messageContent: string) => {
//   const messageHash = crypto.createHash("sha256").update(messageContent).digest("hex")

//   return await client.aIAnalysisCache.findFirst({
//     where: {
//       messageHash,
//       expiresAt: {
//         gt: new Date(),
//       },
//     },
//   })
// }

// export const cacheAIAnalysis = async (
//   messageContent: string,
//   analysis: {
//     confidence: number
//     intent?: string
//     sentiment?: number
//     isSpam: boolean
//     businessRelevant: boolean
//   },
// ) => {
//   const messageHash = crypto.createHash("sha256").update(messageContent).digest("hex")
//   const expiresAt = new Date()
//   expiresAt.setHours(expiresAt.getHours() + 24) // Cache for 24 hours

//   return await client.aIAnalysisCache.upsert({
//     where: { messageHash },
//     update: {
//       analysis,
//       confidence: analysis.confidence,
//       intent: analysis.intent,
//       sentiment: analysis.sentiment,
//       isSpam: analysis.isSpam,
//       businessRelevant: analysis.businessRelevant,
//       expiresAt,
//     },
//     create: {
//       messageHash,
//       analysis,
//       confidence: analysis.confidence,
//       intent: analysis.intent,
//       sentiment: analysis.sentiment,
//       isSpam: analysis.isSpam,
//       businessRelevant: analysis.businessRelevant,
//       expiresAt,
//     },
//   })
// }

// export const getBusinessHours = async (userId: string) => {
//   return await client.businessHours.findUnique({
//     where: { userId },
//   })
// }

// export const isWithinBusinessHours = async (userId: string, timestamp: Date) => {
//   const businessHours = await getBusinessHours(userId)

//   if (!businessHours || !businessHours.isActive) {
//     return true // If no business hours set, always allow
//   }

//   const day = timestamp.getDay() // 0 = Sunday, 1 = Monday, etc.
//   const time = timestamp.toTimeString().slice(0, 5) // "HH:MM"

//   const daySchedule = {
//     0: { start: businessHours.sundayStart, end: businessHours.sundayEnd },
//     1: { start: businessHours.mondayStart, end: businessHours.mondayEnd },
//     2: { start: businessHours.tuesdayStart, end: businessHours.tuesdayEnd },
//     3: { start: businessHours.wednesdayStart, end: businessHours.wednesdayEnd },
//     4: { start: businessHours.thursdayStart, end: businessHours.thursdayEnd },
//     5: { start: businessHours.fridayStart, end: businessHours.fridayEnd },
//     6: { start: businessHours.saturdayStart, end: businessHours.saturdayEnd },
//   }

//   const schedule = daySchedule[day as keyof typeof daySchedule]

//   if (!schedule.start || !schedule.end) {
//     return false // Day is closed
//   }

//   return time >= schedule.start && time <= schedule.end
// }

// export const getCustomerType = async (pageId: string, senderId: string): Promise<CustomerType> => {
//   const existingHistory = await client.dms.findFirst({
//     where: {
//       senderId,
//       reciever: pageId,
//     },
//   })

//   if (!existingHistory) {
//     return CustomerType.NEW
//   }

//   // Check interaction frequency to determine if VIP
//   const interactionCount = await client.dms.count({
//     where: {
//       senderId,
//       reciever: pageId,
//       createdAt: {
//         gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
//       },
//     },
//   })

//   if (interactionCount >= 10) {
//     return CustomerType.VIP
//   }

//   return CustomerType.RETURNING
// }

// export const updateTriggerAnalytics = async (
//   triggerId: string,
//   execution: {
//     success: boolean
//     confidence?: number
//     responseTime?: number
//     wasSpam?: boolean
//   },
// ) => {
//   const today = new Date()
//   today.setHours(0, 0, 0, 0)

//   return await client.triggerAnalytics.upsert({
//     where: {
//       triggerId_date: {
//         triggerId,
//         date: today,
//       },
//     },
//     update: {
//       totalExecutions: { increment: 1 },
//       successfulExecutions: execution.success ? { increment: 1 } : undefined,
//       failedExecutions: !execution.success ? { increment: 1 } : undefined,
//       spamFiltered: execution.wasSpam ? { increment: 1 } : undefined,
//     },
//     create: {
//       triggerId,
//       date: today,
//       totalExecutions: 1,
//       successfulExecutions: execution.success ? 1 : 0,
//       failedExecutions: execution.success ? 0 : 1,
//       spamFiltered: execution.wasSpam ? 1 : 0,
//       averageConfidence: execution.confidence,
//       averageResponseTime: execution.responseTime,
//     },
//   })
// }

// export const updateWebhookPerformance = async (
//   userId: string,
//   execution: {
//     success: boolean
//     responseTime?: number
//     triggerType?: TriggerMode
//     errorType?: string
//   },
// ) => {
//   const today = new Date()
//   today.setHours(0, 0, 0, 0)
//   const currentHour = new Date().getHours()

//   return await client.webhookPerformance.upsert({
//     where: {
//       userId_date: {
//         userId,
//         date: today,
//       },
//     },
//     update: {
//       totalRequests: { increment: 1 },
//       successfulRequests: execution.success ? { increment: 1 } : undefined,
//       failedRequests: !execution.success ? { increment: 1 } : undefined,
//       peakHour: currentHour,
//     },
//     create: {
//       userId,
//       date: today,
//       totalRequests: 1,
//       successfulRequests: execution.success ? 1 : 0,
//       failedRequests: execution.success ? 0 : 1,
//       averageResponseTime: execution.responseTime,
//       peakHour: currentHour,
//     },
//   })
// }



"use server"

import { type TriggerMode, CustomerType } from "@prisma/client"
import crypto from "crypto"
import { client } from "@/lib/prisma"

export const matchKeyword = async (keyword: string) => {
  return await client.keyword.findFirst({
    where: {
      word: {
        equals: keyword,
        mode: "insensitive",
      },
    },
  })
}

export const getKeywordAutomation = async (automationId: string, dm: boolean) => {
  return await client.automation.findUnique({
    where: {
      id: automationId,
    },
    include: {
      dms: dm,
      trigger: {
        where: {
          type: dm ? "DM" : "COMMENT",
        },
      },
      listener: true,
      User: {
        select: {
          subscription: {
            select: {
              plan: true,
            },
          },
          integrations: {
            select: {
              token: true,
            },
          },
        },
      },
    },
  })
}

// NEW: Get fallback automations
export const getFallbackAutomation = async (pageId: string, messageType: "DM" | "COMMENT") => {
  return await client.automation.findFirst({
    where: {
      active: true,
      isFallback: true,
      User: {
        integrations: {
          some: {
            instagramId: pageId,
          },
        },
      },
      trigger: {
        some: {
          type: messageType,
          isActive: true,
        },
      },
    },
    include: {
      trigger: {
        where: {
          type: messageType,
          isActive: true,
        },
      },
      listener: true,
      User: {
        select: {
          subscription: {
            select: {
              plan: true,
            },
          },
          integrations: {
            select: {
              token: true,
            },
          },
        },
      },
    },
  })
}

export const trackResponses = async (automationId: string, type: "COMMENT" | "DM") => {
  if (type === "COMMENT") {
    return await client.listener.update({
      where: { automationId },
      data: {
        commentCount: {
          increment: 1,
        },
      },
    })
  }

  if (type === "DM") {
    return await client.listener.update({
      where: { automationId },
      data: {
        dmCount: {
          increment: 1,
        },
      },
    })
  }
}

export const createChatHistory = (automationId: string, sender: string, reciever: string, message: string) => {
  return client.automation.update({
    where: {
      id: automationId,
    },
    data: {
      dms: {
        create: {
          reciever,
          senderId: sender,
          message,
        },
      },
    },
  })
}

export const getKeywordPost = async (postId: string, automationId: string) => {
  return await client.post.findFirst({
    where: {
      AND: [{ postid: postId }, { automationId }],
    },
    select: { automationId: true },
  })
}

export const getChatHistory = async (sender: string, reciever: string) => {
  const history = await client.dms.findMany({
    where: {
      AND: [{ senderId: sender }, { reciever }],
    },
    orderBy: { createdAt: "asc" },
  })
  const chatSession: {
    role: "assistant" | "user"
    content: string
  }[] = history.map((chat) => {
    return {
      role: chat.reciever ? "assistant" : "user",
      content: chat.message!,
    }
  })

  return {
    history: chatSession,
    automationId: history[history.length - 1]?.automationId,
  }
}

// ENHANCED: More robust message deduplication
export const checkProcessedMessage = async (messageKey: string): Promise<boolean> => {
  try {
    // Create a more unique hash for the message
    const messageHash = crypto.createHash("sha256").update(messageKey).digest("hex")

    const processed = await client.processedMessage.findFirst({
      where: {
        messageKey: messageHash,
        createdAt: {
          gte: new Date(Date.now() - 300000), // Check last 5 minutes instead of 2
        },
      },
    })

    if (processed) {
      console.log(`Message already processed: ${messageKey} (hash: ${messageHash})`)
      return true
    }

    return false
  } catch (error) {
    console.error("Error checking processed message:", error)
    return false
  }
}

export const markMessageAsProcessed = async (messageKey: string): Promise<void> => {
  try {
    const messageHash = crypto.createHash("sha256").update(messageKey).digest("hex")

    // Use upsert to handle race conditions better
    await client.processedMessage.upsert({
      where: {
        messageKey: messageHash,
      },
      update: {
        createdAt: new Date(),
      },
      create: {
        messageKey: messageHash,
        createdAt: new Date(),
      },
    })

    // Clean up old processed messages (older than 30 minutes)
    await client.processedMessage.deleteMany({
      where: {
        createdAt: {
          lt: new Date(Date.now() - 1800000), // 30 minutes ago
        },
      },
    })
  } catch (error) {
    console.error("Error marking message as processed:", error)
  }
}

// ENHANCED: Better conversation state management
export const updateConversationState = async (
  userId: string,
  updates: {
    isActive?: boolean
    lastTriggerType?: string
    lastTriggerReason?: string
    customerType?: CustomerType
    interactionCount?: number
    sentiment?: number
    lastMessageLength?: number
    averageResponseTime?: number
    isInHandoff?: boolean
    handoffReason?: string
    automationId?: string // Track which automation is handling this conversation
    listenMode?: "KEYWORDS" | "ALL_MESSAGES" // Track the listen mode
  },
) => {
  return await client.conversationState.upsert({
    where: { userId },
    update: {
      ...updates,
      lastInteractionAt: new Date(),
      updatedAt: new Date(),
      interactionCount: updates.interactionCount ? { increment: 1 } : undefined,
    },
    create: {
      userId,
      isActive: updates.isActive ?? true,
      lastTriggerType: updates.lastTriggerType,
      lastTriggerReason: updates.lastTriggerReason,
      customerType: updates.customerType ?? CustomerType.NEW,
      interactionCount: updates.interactionCount ?? 1,
      sentiment: updates.sentiment,
      lastInteractionAt: new Date(),
      lastMessageLength: updates.lastMessageLength,
      averageResponseTime: updates.averageResponseTime,
      isInHandoff: updates.isInHandoff ?? false,
      handoffReason: updates.handoffReason,
    },
  })
}

// NEW: Get page token
export const getPageToken = async (pageId: string) => {
  const integration = await client.integrations.findFirst({
    where: {
      instagramId: pageId,
    },
    select: {
      token: true,
    },
  })
  return integration?.token || process.env.DEFAULT_PAGE_TOKEN!
}

// Enhanced analytics and performance tracking
export const logResponseMetrics = async (data: {
  automationId: string
  userId: string
  messageLength: number
  responseTime: number
  typingDelay: number
  wasSuccessful: boolean
  messageType: "DM" | "COMMENT"
  hasButtons: boolean
  sentiment?: "positive" | "neutral" | "negative"
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
}) => {
  try {
    await client.responseMetrics.create({
      data: {
        ...data,
        timestamp: new Date(),
      },
    })
  } catch (error) {
    console.error("Error logging response metrics:", error)
  }
}

// Smart conversation timeout management
export const checkConversationTimeout = async (userId: string, timeoutMinutes = 30): Promise<boolean> => {
  try {
    const conversationState = await client.conversationState.findUnique({
      where: { userId },
    })

    if (!conversationState || !conversationState.isActive) {
      return false
    }

    const timeoutThreshold = new Date(Date.now() - timeoutMinutes * 60 * 1000)

    if (conversationState.lastInteractionAt < timeoutThreshold) {
      // Mark conversation as inactive
      await client.conversationState.update({
        where: { userId },
        data: {
          isActive: false,
          updatedAt: new Date(),
        },
      })
      return true
    }

    return false
  } catch (error) {
    console.error("Error checking conversation timeout:", error)
    return false
  }
}

// All other existing functions remain the same...
export const logTriggerExecution = async (data: {
  triggerId: string
  automationId: string
  userId: string
  messageContent: string
  triggerType: TriggerMode
  confidence?: number
  reason?: string
  success: boolean
  responseTime?: number
  errorMessage?: string
  metadata?: any
}) => {
  return await client.triggerExecution.create({
    data,
  })
}

export const getAIAnalysisFromCache = async (messageContent: string) => {
  const messageHash = crypto.createHash("sha256").update(messageContent).digest("hex")

  return await client.aIAnalysisCache.findFirst({
    where: {
      messageHash,
      expiresAt: {
        gt: new Date(),
      },
    },
  })
}

export const cacheAIAnalysis = async (
  messageContent: string,
  analysis: {
    confidence: number
    intent?: string
    sentiment?: number
    isSpam: boolean
    businessRelevant: boolean
  },
) => {
  const messageHash = crypto.createHash("sha256").update(messageContent).digest("hex")
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 24) // Cache for 24 hours

  return await client.aIAnalysisCache.upsert({
    where: { messageHash },
    update: {
      analysis,
      confidence: analysis.confidence,
      intent: analysis.intent,
      sentiment: analysis.sentiment,
      isSpam: analysis.isSpam,
      businessRelevant: analysis.businessRelevant,
      expiresAt,
    },
    create: {
      messageHash,
      analysis,
      confidence: analysis.confidence,
      intent: analysis.intent,
      sentiment: analysis.sentiment,
      isSpam: analysis.isSpam,
      businessRelevant: analysis.businessRelevant,
      expiresAt,
    },
  })
}

export const getBusinessHours = async (userId: string) => {
  return await client.businessHours.findUnique({
    where: { userId },
  })
}

export const isWithinBusinessHours = async (userId: string, timestamp: Date) => {
  const businessHours = await getBusinessHours(userId)

  if (!businessHours || !businessHours.isActive) {
    return true // If no business hours set, always allow
  }

  const day = timestamp.getDay() // 0 = Sunday, 1 = Monday, etc.
  const time = timestamp.toTimeString().slice(0, 5) // "HH:MM"

  const daySchedule = {
    0: { start: businessHours.sundayStart, end: businessHours.sundayEnd },
    1: { start: businessHours.mondayStart, end: businessHours.mondayEnd },
    2: { start: businessHours.tuesdayStart, end: businessHours.tuesdayEnd },
    3: { start: businessHours.wednesdayStart, end: businessHours.wednesdayEnd },
    4: { start: businessHours.thursdayStart, end: businessHours.thursdayEnd },
    5: { start: businessHours.fridayStart, end: businessHours.fridayEnd },
    6: { start: businessHours.saturdayStart, end: businessHours.saturdayEnd },
  }

  const schedule = daySchedule[day as keyof typeof daySchedule]

  if (!schedule.start || !schedule.end) {
    return false // Day is closed
  }

  return time >= schedule.start && time <= schedule.end
}

export const getCustomerType = async (pageId: string, senderId: string): Promise<CustomerType> => {
  const existingHistory = await client.dms.findFirst({
    where: {
      senderId,
      reciever: pageId,
    },
  })

  if (!existingHistory) {
    return CustomerType.NEW
  }

  // Check interaction frequency to determine if VIP
  const interactionCount = await client.dms.count({
    where: {
      senderId,
      reciever: pageId,
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      },
    },
  })

  if (interactionCount >= 10) {
    return CustomerType.VIP
  }

  return CustomerType.RETURNING
}

export const updateTriggerAnalytics = async (
  triggerId: string,
  execution: {
    success: boolean
    confidence?: number
    responseTime?: number
    wasSpam?: boolean
  },
) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return await client.triggerAnalytics.upsert({
    where: {
      triggerId_date: {
        triggerId,
        date: today,
      },
    },
    update: {
      totalExecutions: { increment: 1 },
      successfulExecutions: execution.success ? { increment: 1 } : undefined,
      failedExecutions: !execution.success ? { increment: 1 } : undefined,
      spamFiltered: execution.wasSpam ? { increment: 1 } : undefined,
    },
    create: {
      triggerId,
      date: today,
      totalExecutions: 1,
      successfulExecutions: execution.success ? 1 : 0,
      failedExecutions: execution.success ? 0 : 1,
      spamFiltered: execution.wasSpam ? 1 : 0,
      averageConfidence: execution.confidence,
      averageResponseTime: execution.responseTime,
    },
  })
}

export const updateWebhookPerformance = async (
  userId: string,
  execution: {
    success: boolean
    responseTime?: number
    triggerType?: TriggerMode
    errorType?: string
  },
) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const currentHour = new Date().getHours()

  return await client.webhookPerformance.upsert({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
    update: {
      totalRequests: { increment: 1 },
      successfulRequests: execution.success ? { increment: 1 } : undefined,
      failedRequests: !execution.success ? { increment: 1 } : undefined,
      peakHour: currentHour,
    },
    create: {
      userId,
      date: today,
      totalRequests: 1,
      successfulRequests: execution.success ? 1 : 0,
      failedRequests: execution.success ? 0 : 1,
      averageResponseTime: execution.responseTime,
      peakHour: currentHour,
    },
  })
}



// "use server"

// import { type TriggerMode, CustomerType } from "@prisma/client"
// import crypto from "crypto"
// import { client } from "@/lib/prisma"

// export const matchKeyword = async (keyword: string) => {
//   return await client.keyword.findFirst({
//     where: {
//       word: {
//         equals: keyword,
//         mode: "insensitive",
//       },
//     },
//   })
// }

// export const getKeywordAutomation = async (automationId: string, dm: boolean) => {
//   return await client.automation.findUnique({
//     where: {
//       id: automationId,
//     },
//     include: {
//       dms: dm,
//       trigger: {
//         where: {
//           type: dm ? "DM" : "COMMENT",
//         },
//       },
//       listener: true,
//       User: {
//         select: {
//           subscription: {
//             select: {
//               plan: true,
//             },
//           },
//           integrations: {
//             select: {
//               token: true,
//             },
//           },
//         },
//       },
//     },
//   })
// }

// export const trackResponses = async (automationId: string, type: "COMMENT" | "DM") => {
//   if (type === "COMMENT") {
//     return await client.listener.update({
//       where: { automationId },
//       data: {
//         commentCount: {
//           increment: 1,
//         },
//       },
//     })
//   }

//   if (type === "DM") {
//     return await client.listener.update({
//       where: { automationId },
//       data: {
//         dmCount: {
//           increment: 1,
//         },
//       },
//     })
//   }
// }

// export const createChatHistory = (automationId: string, sender: string, reciever: string, message: string) => {
//   return client.automation.update({
//     where: {
//       id: automationId,
//     },
//     data: {
//       dms: {
//         create: {
//           reciever,
//           senderId: sender,
//           message,
//         },
//       },
//     },
//   })
// }

// export const getKeywordPost = async (postId: string, automationId: string) => {
//   return await client.post.findFirst({
//     where: {
//       AND: [{ postid: postId }, { automationId }],
//     },
//     select: { automationId: true },
//   })
// }

// export const getChatHistory = async (sender: string, reciever: string) => {
//   const history = await client.dms.findMany({
//     where: {
//       AND: [{ senderId: sender }, { reciever }],
//     },
//     orderBy: { createdAt: "asc" },
//   })
//   const chatSession: {
//     role: "assistant" | "user"
//     content: string
//   }[] = history.map((chat) => {
//     return {
//       role: chat.reciever ? "assistant" : "user",
//       content: chat.message!,
//     }
//   })

//   return {
//     history: chatSession,
//     automationId: history[history.length - 1]?.automationId,
//   }
// }

// // Message deduplication functions
// export const checkProcessedMessage = async (messageKey: string): Promise<boolean> => {
//   try {
//     const processed = await client.processedMessage.findFirst({
//       where: {
//         messageKey,
//         createdAt: {
//           gte: new Date(Date.now() - 60000), // Check last 60 seconds
//         },
//       },
//     })
//     return !!processed
//   } catch (error) {
//     console.error("Error checking processed message:", error)
//     return false
//   }
// }

// export const markMessageAsProcessed = async (messageKey: string): Promise<void> => {
//   try {
//     await client.processedMessage.create({
//       data: {
//         messageKey,
//         createdAt: new Date(),
//       },
//     })

//     // Clean up old processed messages (older than 5 minutes)
//     await client.processedMessage.deleteMany({
//       where: {
//         createdAt: {
//           lt: new Date(Date.now() - 300000), // 5 minutes ago
//         },
//       },
//     })
//   } catch (error) {
//     console.error("Error marking message as processed:", error)
//   }
// }

// // Enhanced trigger evaluation functions
// export const getActiveTriggersForAutomation = async (automationId: string) => {
//   return await client.trigger.findMany({
//     where: {
//       automationId,
//       isActive: true,
//     },
//     orderBy: {
//       priority: "desc", // Higher priority first
//     },
//     include: {
//       Automation: {
//         include: {
//           User: {
//             select: {
//               subscription: {
//                 select: {
//                   plan: true,
//                 },
//               },
//               integrations: {
//                 select: {
//                   token: true,
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
//   })
// }

// export const getAllActiveAutomationsForPage = async (pageId: string) => {
//   return await client.automation.findMany({
//     where: {
//       active: true,
//       User: {
//         integrations: {
//           some: {
//             instagramId: pageId,
//           },
//         },
//       },
//     },
//     include: {
//       trigger: {
//         where: {
//           isActive: true,
//         },
//         orderBy: {
//           priority: "desc",
//         },
//       },
//       keywords: true,
//       User: {
//         include: {
//           subscription: true,
//           integrations: true,
//         },
//       },
//     },
//   })
// }

// export const updateConversationState = async (
//   userId: string,
//   updates: {
//     isActive?: boolean
//     lastTriggerType?: string
//     lastTriggerReason?: string
//     customerType?: CustomerType
//     interactionCount?: number
//     sentiment?: number
//   },
// ) => {
//   return await client.conversationState.upsert({
//     where: { userId },
//     update: {
//       ...updates,
//       lastInteractionAt: new Date(),
//       updatedAt: new Date(),
//     },
//     create: {
//       userId,
//       isActive: updates.isActive ?? true,
//       lastTriggerType: updates.lastTriggerType,
//       lastTriggerReason: updates.lastTriggerReason,
//       customerType: updates.customerType ?? CustomerType.NEW,
//       interactionCount: updates.interactionCount ?? 1,
//       sentiment: updates.sentiment,
//       lastInteractionAt: new Date(),
//     },
//   })
// }

// export const logTriggerExecution = async (data: {
//   triggerId: string
//   automationId: string
//   userId: string
//   messageContent: string
//   triggerType: TriggerMode
//   confidence?: number
//   reason?: string
//   success: boolean
//   responseTime?: number
//   errorMessage?: string
//   metadata?: any
// }) => {
//   return await client.triggerExecution.create({
//     data,
//   })
// }

// export const getAIAnalysisFromCache = async (messageContent: string) => {
//   const messageHash = crypto.createHash("sha256").update(messageContent).digest("hex")

//   return await client.aIAnalysisCache.findFirst({
//     where: {
//       messageHash,
//       expiresAt: {
//         gt: new Date(),
//       },
//     },
//   })
// }

// export const cacheAIAnalysis = async (
//   messageContent: string,
//   analysis: {
//     confidence: number
//     intent?: string
//     sentiment?: number
//     isSpam: boolean
//     businessRelevant: boolean
//   },
// ) => {
//   const messageHash = crypto.createHash("sha256").update(messageContent).digest("hex")
//   const expiresAt = new Date()
//   expiresAt.setHours(expiresAt.getHours() + 24) // Cache for 24 hours

//   return await client.aIAnalysisCache.upsert({
//     where: { messageHash },
//     update: {
//       analysis,
//       confidence: analysis.confidence,
//       intent: analysis.intent,
//       sentiment: analysis.sentiment,
//       isSpam: analysis.isSpam,
//       businessRelevant: analysis.businessRelevant,
//       expiresAt,
//     },
//     create: {
//       messageHash,
//       analysis,
//       confidence: analysis.confidence,
//       intent: analysis.intent,
//       sentiment: analysis.sentiment,
//       isSpam: analysis.isSpam,
//       businessRelevant: analysis.businessRelevant,
//       expiresAt,
//     },
//   })
// }

// export const getBusinessHours = async (userId: string) => {
//   return await client.businessHours.findUnique({
//     where: { userId },
//   })
// }

// export const isWithinBusinessHours = async (userId: string, timestamp: Date) => {
//   const businessHours = await getBusinessHours(userId)

//   if (!businessHours || !businessHours.isActive) {
//     return true // If no business hours set, always allow
//   }

//   const day = timestamp.getDay() // 0 = Sunday, 1 = Monday, etc.
//   const time = timestamp.toTimeString().slice(0, 5) // "HH:MM"

//   const daySchedule = {
//     0: { start: businessHours.sundayStart, end: businessHours.sundayEnd },
//     1: { start: businessHours.mondayStart, end: businessHours.mondayEnd },
//     2: { start: businessHours.tuesdayStart, end: businessHours.tuesdayEnd },
//     3: { start: businessHours.wednesdayStart, end: businessHours.wednesdayEnd },
//     4: { start: businessHours.thursdayStart, end: businessHours.thursdayEnd },
//     5: { start: businessHours.fridayStart, end: businessHours.fridayEnd },
//     6: { start: businessHours.saturdayStart, end: businessHours.saturdayEnd },
//   }

//   const schedule = daySchedule[day as keyof typeof daySchedule]

//   if (!schedule.start || !schedule.end) {
//     return false // Day is closed
//   }

//   return time >= schedule.start && time <= schedule.end
// }

// export const getCustomerType = async (pageId: string, senderId: string): Promise<CustomerType> => {
//   const existingHistory = await client.dms.findFirst({
//     where: {
//       senderId,
//       reciever: pageId,
//     },
//   })

//   if (!existingHistory) {
//     return CustomerType.NEW
//   }

//   // Check interaction frequency to determine if VIP
//   const interactionCount = await client.dms.count({
//     where: {
//       senderId,
//       reciever: pageId,
//       createdAt: {
//         gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
//       },
//     },
//   })

//   if (interactionCount >= 10) {
//     return CustomerType.VIP
//   }

//   return CustomerType.RETURNING
// }

// export const updateTriggerAnalytics = async (
//   triggerId: string,
//   execution: {
//     success: boolean
//     confidence?: number
//     responseTime?: number
//     wasSpam?: boolean
//   },
// ) => {
//   const today = new Date()
//   today.setHours(0, 0, 0, 0)

//   return await client.triggerAnalytics.upsert({
//     where: {
//       triggerId_date: {
//         triggerId,
//         date: today,
//       },
//     },
//     update: {
//       totalExecutions: { increment: 1 },
//       successfulExecutions: execution.success ? { increment: 1 } : undefined,
//       failedExecutions: !execution.success ? { increment: 1 } : undefined,
//       spamFiltered: execution.wasSpam ? { increment: 1 } : undefined,
//     },
//     create: {
//       triggerId,
//       date: today,
//       totalExecutions: 1,
//       successfulExecutions: execution.success ? 1 : 0,
//       failedExecutions: execution.success ? 0 : 1,
//       spamFiltered: execution.wasSpam ? 1 : 0,
//       averageConfidence: execution.confidence,
//       averageResponseTime: execution.responseTime,
//     },
//   })
// }

// export const updateWebhookPerformance = async (
//   userId: string,
//   execution: {
//     success: boolean
//     responseTime?: number
//     triggerType?: TriggerMode
//     errorType?: string
//   },
// ) => {
//   const today = new Date()
//   today.setHours(0, 0, 0, 0)
//   const currentHour = new Date().getHours()

//   return await client.webhookPerformance.upsert({
//     where: {
//       userId_date: {
//         userId,
//         date: today,
//       },
//     },
//     update: {
//       totalRequests: { increment: 1 },
//       successfulRequests: execution.success ? { increment: 1 } : undefined,
//       failedRequests: !execution.success ? { increment: 1 } : undefined,
//       peakHour: currentHour,
//     },
//     create: {
//       userId,
//       date: today,
//       totalRequests: 1,
//       successfulRequests: execution.success ? 1 : 0,
//       failedRequests: execution.success ? 0 : 1,
//       averageResponseTime: execution.responseTime,
//       peakHour: currentHour,
//     },
//   })
// }

