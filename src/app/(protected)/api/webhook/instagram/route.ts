
// import { type NextRequest, NextResponse } from "next/server"
// import {
//   createChatHistory,
//   trackResponses,
//   checkProcessedMessage,
//   markMessageAsProcessed,
//   decideTriggerAction,
//   updateConversationState,
//   logTriggerExecution,
//   checkDuplicateResponse,
//   getRecentResponseCount,
//   markResponseAsSent,
// } from "@/actions/webhook/queries"
// import { getBusinessProfileForAutomation, getOrCreateDefaultAutomation } from "@/actions/webhook/business-profile"
// import { generateGeminiResponse, buildConversationContext } from "@/lib/gemini"
// import {
//   createVoiceflowUser,
//   fetchEnhancedBusinessVariables,
//   getVoiceflowHealth,
//   getEnhancedVoiceflowResponse,
// } from "@/lib/voiceflow"
// import { analyzeLead } from "@/lib/lead-qualification"
// import {  sendPrivateMessages, transformVoiceflowToInstagram } from "@/lib/fetch"
// import {sendDMs} from "@/lib/voiceflow"
// import { client } from "@/lib/prisma"
// import { storeConversationMessage } from "@/actions/chats/queries"
// import { handleInstagramDeauthWebhook, handleInstagramDataDeletionWebhook } from "@/lib/deauth"
// import { verifyInstagramWebhook } from "@/utils/instagram"
// import { trackMessageForSentiment } from "@/lib/sentiment-tracker"
// import { getBusinessByAutomationId } from "@/actions/businfo/queries"


// // Enhanced interfaces aligned with Instagram capabilities
// interface InstagramAlignedButton {
//   title: string;
//   payload: string;
//   url?: string;  // For web_url buttons
// }

// interface InstagramAlignedQuickReply {
//   content_type: "text";
//   title: string;
//   payload: string;
// }

// interface InstagramAlignedCarouselElement {
//   title: string;
//   subtitle?: string;
//   image_url?: string;
//   buttons?: InstagramAlignedButton[];
// }

// interface InstagramAlignedMessage {
//   text: string;
//   quickReplies?: InstagramAlignedQuickReply[];
//   buttons?: InstagramAlignedButton[];
//   carousel?: InstagramAlignedCarouselElement[];
//   attachment?: {
//     type: 'image' | 'video' | 'audio' | 'file';
//     url: string;
//     caption?: string;
//   };
//   // Instagram-specific metadata
//   requiresHumanHandoff?: boolean;
//   priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
//   sentiment?: "positive" | "neutral" | "negative";
//   complexity?: "simple" | "medium" | "complex";
// }

// // Enhanced interfaces to handle all possible Voiceflow structures
// interface VoiceflowButton {
//   // Common properties across different Voiceflow versions
//   name?: string;
//   title?: string;
//   text?: string;
//   label?: string;
  
//   // Payload variations
//   payload?: string | object;
//   value?: string;
//   request?: {
//     type?: string;
//     payload?: {
//       intent?: {
//         name?: string;
//       };
//       query?: string;
//     };
//   };
  
//   // URL for web buttons
//   url?: string;
//   link?: string;
  
//   // Legacy support
//   id?: string;
//   type?: string;
// }

// interface EnhancedVoiceflowResponse {
//   text?: string;
//   quickReplies?: Array<{
//     name?: string;
//     title?: string;
//     payload?: string;
//     value?: string;
//   }>;
//   buttons?: VoiceflowButton[];
//   carousel?: Array<{
//     title: string;
//     subtitle?: string;
//     imageUrl?: string;
//     image_url?: string;
//     buttons?: VoiceflowButton[];
//   }>;
//   attachment?: any;
//   variables?: Record<string, any>;
  
//   // Handle Voiceflow trace types
//   traces?: Array<{
//     type: string;
//     payload?: any;
//   }>;
// }


// // ============================================================================
// // ENHANCED TYPES & INTERFACES
// // ============================================================================

// interface WebhookData {
//   pageId: string
//   senderId: string
//   recipientId?: string
//   userMessage: string
//   messageId?: string
//   commentId?: string
//   messageType: "DM" | "COMMENT"
//   isEcho?: boolean
// }

// interface ProcessingContext {
//   data: WebhookData
//   automation: any
//   conversationUserId: string
//   userMessage: string
//   triggerDecision: any
//   startTime: number
//   messageKey: string
// }

// interface ProcessingResult {
//   success: boolean
//   responseText?: string
//   buttons?: any[]
//   quickReplies?: any[]
//   carousel?: any[]
//   attachment?: any
//   variables?: Record<string, any>
//   aiSystem: string
//   error?: string
//   extractedData?: {
//     name?: string
//     email?: string
//     phone?: string
//   }
// }

// interface VoiceflowResponse {
//   text?: string
//   quickReplies?: Array<{ name: string; payload: string }>
//   buttons?: Array<{ name: string; payload: string; url?: string }>
//   carousel?: Array<{
//     title: string
//     subtitle?: string
//     imageUrl?: string
//     buttons?: Array<{ name: string; payload: string; url?: string }>
//   }>
//   attachment?: any
//   variables?: Record<string, any>
// }

// interface InstagramQuickReply {
//   content_type: "text"
//   title: string
//   payload: string
// }

// interface InstagramButton {
//   type: "web_url" | "postback"
//   title: string
//   url?: string
//   payload?: string
// }

// interface InstagramGenericElement {
//   title: string
//   subtitle?: string
//   image_url?: string
//   buttons?: InstagramButton[]
// }

// interface InstagramAttachment {
//   type: "template"
//   payload: {
//     template_type: "generic" | "button"
//     elements?: InstagramGenericElement[]
//     text?: string
//     buttons?: InstagramButton[]
//   }
// }

// // ============================================================================
// // CONFIGURATION & CONSTANTS
// // ============================================================================

// const CONFIG = {
//   TIMEOUTS: {
//     VOICEFLOW: 15000,
//     GEMINI: 10000,
//     PROFILE: 5000,
//     TOTAL_PROCESSING: 30000,
//   },
//   RATE_LIMITS: {
//     MAX_RESPONSES_PER_2MIN: 3,
//     DUPLICATE_WINDOW: 8000,
//   },
//   RETRY: {
//     MAX_ATTEMPTS: 3,
//     BASE_DELAY: 1000,
//     MAX_DELAY: 5000,
//     BACKOFF_MULTIPLIER: 2,
//   },
//   CLEANUP_INTERVAL: 5 * 60 * 1000,
// } as const



// // ============================================================================
// // ENHANCED MEMORY MANAGEMENT
// // ============================================================================

// class EnhancedMemoryManager {
//   private static instance: EnhancedMemoryManager
//   private recentMessages = new Map<string, number>()
//   private processingMessages = new Set<string>()
//   private cleanupInterval: NodeJS.Timeout
//   private metrics = {
//     duplicatesBlocked: 0,
//     messagesProcessed: 0,
//     cleanupRuns: 0,
//   }

//   private constructor() {
//     this.cleanupInterval = setInterval(() => {
//       this.cleanup()
//     }, CONFIG.CLEANUP_INTERVAL)
//   }

//   static getInstance(): EnhancedMemoryManager {
//     if (!EnhancedMemoryManager.instance) {
//       EnhancedMemoryManager.instance = new EnhancedMemoryManager()
//     }
//     return EnhancedMemoryManager.instance
//   }

//   isDuplicate(key: string, timestamp: number): boolean {
//     const lastTime = this.recentMessages.get(key)
//     const isDupe = lastTime ? timestamp - lastTime < CONFIG.RATE_LIMITS.DUPLICATE_WINDOW : false
//     if (isDupe) this.metrics.duplicatesBlocked++
//     return isDupe
//   }

//   isProcessing(key: string): boolean {
//     return this.processingMessages.has(key)
//   }

//   markMessage(key: string, timestamp: number): void {
//     this.recentMessages.set(key, timestamp)
//     this.metrics.messagesProcessed++
//   }

//   startProcessing(key: string): void {
//     this.processingMessages.add(key)
//   }

//   finishProcessing(key: string): void {
//     this.processingMessages.delete(key)
//   }

//   private cleanup(): void {
//     const cutoff = Date.now() - CONFIG.CLEANUP_INTERVAL
//     const keysToDelete: string[] = []

//     this.recentMessages.forEach((timestamp, key) => {
//       if (timestamp < cutoff) {
//         keysToDelete.push(key)
//       }
//     })

//     keysToDelete.forEach((key) => {
//       this.recentMessages.delete(key)
//     })

//     this.processingMessages.clear()
//     this.metrics.cleanupRuns++

//     Logger.info(`🧹 Memory cleanup: removed ${keysToDelete.length} old entries`)
//   }

//   getMetrics() {
//     return {
//       ...this.metrics,
//       recentMessagesCount: this.recentMessages.size,
//       processingCount: this.processingMessages.size,
//     }
//   }
// }

// // ============================================================================
// // ENHANCED LOGGER
// // ============================================================================

// class Logger {
//   static info(message: string, data?: any): void {
//     const timestamp = new Date().toISOString()
//     console.log(`[${timestamp}] ℹ️ ${message}`, data ? JSON.stringify(data, null, 2) : "")
//   }

//   static success(message: string, data?: any): void {
//     const timestamp = new Date().toISOString()
//     console.log(`[${timestamp}] ✅ ${message}`, data ? JSON.stringify(data, null, 2) : "")
//   }

//   static warning(message: string, data?: any): void {
//     const timestamp = new Date().toISOString()
//     console.log(`[${timestamp}] ⚠️ ${message}`, data ? JSON.stringify(data, null, 2) : "")
//   }

//   static error(message: string, error?: any): void {
//     const timestamp = new Date().toISOString()
//     console.error(`[${timestamp}] ❌ ${message}`, error)
//   }

//   static debug(message: string, data?: any): void {
//     const timestamp = new Date().toISOString()
//     console.log(`[${timestamp}] 🔍 ${message}`, data ? JSON.stringify(data, null, 2) : "")
//   }

//   static performance(message: string, startTime: number): void {
//     const duration = Date.now() - startTime
//     const timestamp = new Date().toISOString()
//     console.log(`[${timestamp}] ⚡ ${message} (${duration}ms)`)
//   }
// }

// // ============================================================================
// // TIMEOUT MANAGER
// // ============================================================================

// class TimeoutManager {
//   static async withTimeout<T>(promise: Promise<T>, timeoutMs: number, operation: string): Promise<T> {
//     const timeoutPromise = new Promise<never>((_, reject) => {
//       setTimeout(() => reject(new Error(`${operation} timeout after ${timeoutMs}ms`)), timeoutMs)
//     })

//     return Promise.race([promise, timeoutPromise])
//   }
// }

// // ============================================================================
// // RETRY MANAGER
// // ============================================================================

// class RetryManager {
//   static async withRetry<T>(
//     operation: () => Promise<T>,
//     operationName: string,
//     maxAttempts: number = CONFIG.RETRY.MAX_ATTEMPTS,
//   ): Promise<T> {
//     let lastError: Error | null = null

//     for (let attempt = 1; attempt <= maxAttempts; attempt++) {
//       try {
//         Logger.info(`🔄 ${operationName} - Attempt ${attempt}/${maxAttempts}`)
//         const result = await operation()

//         if (attempt > 1) {
//           Logger.success(`✅ ${operationName} succeeded on attempt ${attempt}`)
//         }

//         return result
//       } catch (error) {
//         lastError = error as Error
//         Logger.warning(`⚠️ ${operationName} failed on attempt ${attempt}: ${lastError.message}`)

//         if (attempt < maxAttempts) {
//           const delay = Math.min(
//             CONFIG.RETRY.BASE_DELAY * Math.pow(CONFIG.RETRY.BACKOFF_MULTIPLIER, attempt - 1),
//             CONFIG.RETRY.MAX_DELAY,
//           )
//           Logger.info(`⏳ Retrying ${operationName} in ${delay}ms...`)
//           await new Promise((resolve) => setTimeout(resolve, delay))
//         }
//       }
//     }

//     throw new Error(`${operationName} failed after ${maxAttempts} attempts: ${lastError?.message}`)
//   }
// }



// // ENHANCED: Webhook validator to handle postback events
// class WebhookValidator {
//   static extractData(payload: any): WebhookData | null {
//     try {
//       if (payload?.entry?.[0]?.messaging) {
//         const messaging = payload.entry[0].messaging[0]

//         if (messaging.read || messaging.delivery) {
//           Logger.debug("Ignoring read receipt or delivery confirmation")
//           return null
//         }

//         // Handle regular messages
//         if (messaging.message) {
//           const isEcho = messaging.message?.is_echo === true

//           if (!messaging.message.text) {
//             Logger.debug("Ignoring non-text message")
//             return null
//           }

//           return {
//             pageId: payload.entry[0].id,
//             senderId: messaging.sender.id,
//             recipientId: messaging.recipient.id,
//             userMessage: messaging.message.text,
//             messageId: messaging.message.mid,
//             messageType: "DM",
//             isEcho,
//           }
//         }

//         // CRITICAL: Handle postback events (button clicks)
//         if (messaging.postback) {
//           return {
//             pageId: payload.entry[0].id,
//             senderId: messaging.sender.id,
//             recipientId: messaging.recipient.id,
//             userMessage: messaging.postback.payload || messaging.postback.title || "Button clicked",
//             messageId: `postback_${Date.now()}`,
//             messageType: "DM",
//             isEcho: false,
//           }
//         }
//       } else if (payload?.entry?.[0]?.changes && payload.entry[0].changes[0].field === "comments") {
//         const changeValue = payload.entry[0].changes[0].value

//         if (!changeValue.text) {
//           Logger.debug("Ignoring comment without text")
//           return null
//         }

//         return {
//           pageId: payload.entry[0].id,
//           senderId: changeValue.from.id,
//           userMessage: changeValue.text,
//           commentId: changeValue.id,
//           messageType: "COMMENT",
//           isEcho: false,
//         }
//       }
//     } catch (error) {
//       Logger.error("Failed to extract webhook data", error)
//     }

//     return null
//   }

//   static isSpecialWebhook(payload: any): string | null {
//     if (payload?.object === "instagram" && payload?.entry?.[0]?.changes?.[0]?.field === "deauthorizations") {
//       return "deauth"
//     }
//     if (payload?.object === "instagram" && payload?.entry?.[0]?.changes?.[0]?.field === "data_deletion") {
//       return "data_deletion"
//     }
//     if (payload?.entry?.[0]?.messaging?.[0]?.read || payload?.entry?.[0]?.messaging?.[0]?.delivery) {
//       return "receipt"
//     }
//     return null
//   }
// }



// // ENHANCED: Voiceflow response transformer with proper button handling
// function transformVoiceflowResponseToInstagrame(voiceflowResponse: VoiceflowResponse): {
//   text: string
//   quickReplies?: InstagramQuickReply[]
//   buttons?: InstagramButton[]
//   carousel?: InstagramGenericElement[]
//   attachment?: InstagramAttachment
// } {
//   const result: any = {
//     text: voiceflowResponse.text || ""
//   }

//   // Transform quick replies
//   if (voiceflowResponse.quickReplies && voiceflowResponse.quickReplies.length > 0) {
//     result.quickReplies = voiceflowResponse.quickReplies.slice(0, 13).map((reply) => ({
//       content_type: "text" as const,
//       title: String(reply.name  || "").substring(0, 20) || "Option",
//       payload: String(reply.payload || reply.name || "").substring(0, 1000)
//     }))
//   }

//   // CRITICAL FIX: Transform buttons with proper title handling
//   if (voiceflowResponse.buttons && voiceflowResponse.buttons.length > 0) {
//     result.buttons = voiceflowResponse.buttons.slice(0, 3).map((button) => {
//       // Extract title from multiple possible sources
//       const buttonTitle = button.payload  || "Testing"
//       const buttonPayload = button.payload  || button.name || "button_clicked"
      
//       return {
//         type: button.url ? "web_url" as const : "postback" as const,
//         title: String(buttonTitle).substring(0, 20),
//         name: String(buttonTitle).substring(0, 20), // Keep name for compatibility
//         url: button.url,
//         payload: button.url ? undefined : String(buttonPayload).substring(0, 1000)
//       }
//     })
//   }

//   // Transform carousel
//   if (voiceflowResponse.carousel && voiceflowResponse.carousel.length > 0) {
//     result.carousel = voiceflowResponse.carousel.slice(0, 10).map((card) => {
//       const element: InstagramGenericElement = {
//         title: String(card.title || "").substring(0, 80) || "Card",
//         subtitle: card.subtitle ? String(card.subtitle).substring(0, 80) : undefined,
//         image_url: card.imageUrl  || undefined
//       }

//       if (card.buttons && card.buttons.length > 0) {
//         element.buttons = card.buttons.slice(0, 3).map((button) => {
//           const buttonTitle =  button.name || "ButtonE"
//           const buttonPayload = button.payload || button.name || "button_clicked"
          
//           return {
//             type: button.url ? "web_url" as const : "postback" as const,
//             title: String(buttonTitle).substring(0, 20),
//             url: button.url,
//             payload: button.url ? undefined : String(buttonPayload).substring(0, 1000)
//           }
//         })
//       }

//       return element
//     })
//   }

//   // Handle custom attachments
//   if (voiceflowResponse.attachment) {
//     result.attachment = voiceflowResponse.attachment
//   }

//   return result
// }


// class MessageProcessor {
//   private static generateKey(data: WebhookData, timestamp: number): string {
//     const baseId = data.messageId || data.commentId || `${timestamp}_${Math.random().toString(36).substr(2, 9)}`
//     const messageContent = data.userMessage.substring(0, 50)
//     const messageLength = data.userMessage.length
//     return `${data.pageId}_${data.senderId}_${baseId}_${messageLength}_${messageContent.replace(/\s+/g, "_")}`
//   }

//   static async processImmediate(data: WebhookData, startTime: number): Promise<void> {
//     const messageKey = this.generateKey(data, startTime)
//     const duplicateKey = `${data.pageId}_${data.senderId}_${data.userMessage}_${data.messageType}`

//     Logger.info(`🚀 IMMEDIATE PROCESSING: ${data.messageType} from ${data.senderId}`)
//     Logger.debug(`Message: "${data.userMessage.substring(0, 100)}..."`)

//     const memoryManager = EnhancedMemoryManager.getInstance()

//     // Enhanced duplicate checking
//     if (memoryManager.isDuplicate(duplicateKey, startTime)) {
//       Logger.warning(`Duplicate message blocked: ${duplicateKey}`)
//       return
//     }

//     if (memoryManager.isProcessing(duplicateKey)) {
//       Logger.warning(`Message already being processed: ${duplicateKey}`)
//       return
//     }

//     // Database processing check
//     const isProcessed = await checkProcessedMessage(messageKey)
//     if (isProcessed) {
//       Logger.warning(`Message already processed in DB: ${messageKey.substring(0, 50)}...`)
//       return
//     }

//     memoryManager.startProcessing(duplicateKey)
//     memoryManager.markMessage(duplicateKey, startTime)

//     try {
//       await markMessageAsProcessed(messageKey)
//       Logger.success(`Message marked for processing: ${messageKey.substring(0, 50)}...`)

//       await TimeoutManager.withTimeout(
//         this.processMessage(data, messageKey, startTime),
//         CONFIG.TIMEOUTS.TOTAL_PROCESSING,
//         "Total message processing",
//       )

//       Logger.performance("Message processing completed", startTime)
//     } catch (error) {
//       Logger.error("Message processing failed", error)
//       // NO FALLBACK - Just log the error and let it fail
//       throw error
//     } finally {
//       memoryManager.finishProcessing(duplicateKey)
//     }
//   }

//   private static async processMessage(data: WebhookData, messageKey: string, startTime: number): Promise<void> {
//     Logger.info(`🎯 Processing message: ${messageKey.substring(0, 50)}...`)

//     const context = await this.buildProcessingContext(data, messageKey, startTime)
//     if (!context) {
//       throw new Error("Failed to build processing context")
//     }

//     const isPROUser = context.automation.User?.subscription?.plan === "PRO"
//     Logger.info(`User type: ${isPROUser ? "PRO" : "Standard"}`)

//     let result: ProcessingResult

//     if (isPROUser) {
//       // PRO users get Voiceflow with retry mechanism - NO FALLBACKS
//       result = await VoiceflowHandler.handle(context)
//     } else {
//       // Standard users get Gemini
//       result = await GeminiHandler.handle(context)
//     }

//     if (!result.success) {
//       throw new Error(`AI processing failed: ${result.error}`)
//     }

//     // Create the response object in the format ResponseSender expects
//     const responseForSending = {
//       text: result.responseText || "",
//       quickReplies: result.quickReplies,
//       buttons: result.buttons,
//       carousel: result.carousel,
//       attachment: result.attachment,
//     }

//     // Send the response
//     await ResponseSender.send(context, responseForSending)
    
//     // Process background tasks
//     BackgroundProcessor.process(context, result.responseText!, result.extractedData)

//     Logger.success(`✨ Message successfully processed with ${result.aiSystem}`)
//   }

//   private static async buildProcessingContext(
//     data: WebhookData,
//     messageKey: string,
//     startTime: number,
//   ): Promise<ProcessingContext | null> {
//     try {
//       Logger.debug("Building processing context...")

//       const triggerDecision = await TimeoutManager.withTimeout(
//         decideTriggerAction(data.pageId, data.senderId, data.userMessage, data.messageType),
//         5000,
//         "Trigger decision",
//       )

//       let automation = null

//       // If no specific automation matched, try to get/create default automation
//       if (triggerDecision.triggerType === "NO_MATCH") {
//         Logger.info("🔄 No specific automation matched, checking for default automation...")
//         automation = await getOrCreateDefaultAutomation(data.pageId)
//         if (!automation) {
//           Logger.error("❌ No default automation available - message ignored")
//           return null
//         }
//         Logger.info(`🎯 Using default automation: ${automation.id}`)
//       } else {
//         // Get the specific automation that was triggered
//         try {
//           automation = await client.automation.findUnique({
//             where: { id: triggerDecision.automationId! },
//             include: {
//               User: {
//                 include: {
//                   subscription: true,
//                   integrations: {
//                     where: { name: "INSTAGRAM" },
//                     select: { token: true },
//                   },
//                 },
//               },
//               //TODO
//               // businessWorkflowConfig: {
//               //   select: { id: true },
//               // },
//             },
//           })
//           Logger.info(`🔍 Automation lookup result:`, automation ? `Found: ${automation.id}` : "Not found")
//         } catch (error) {
//           Logger.error(`❌ Error fetching automation ${triggerDecision.automationId}:`, error)
//         }

//         if (!automation) {
//           Logger.warning(`❌ Specific automation not found: ${triggerDecision.automationId}`)
//           // Fallback to default automation
//           automation = await getOrCreateDefaultAutomation(data.pageId)
//           if (!automation) {
//             return null
//           }
//         }
//       }

//       return {
//         data,
//         automation,
//         conversationUserId: `${data.pageId}_${data.senderId}`,
//         userMessage: data.userMessage,
//         triggerDecision,
//         startTime,
//         messageKey,
//       }
//     } catch (error) {
//       Logger.error("Failed to build processing context", error)
//       return null
//     }
//   }


// }


// // ============================================================================
// // ENHANCED VOICEFLOW HANDLER - WITH FULL MESSAGE TYPE SUPPORT
// // ============================================================================

// class VoiceflowHandler { //TODO
//   static async handle(context: ProcessingContext): Promise<ProcessingResult> {
//     Logger.info("🎙️ === VOICEFLOW HANDLER (ENHANCED WITH ALL MESSAGE TYPES) ===")

//     try {
//       if (await this.isRateLimited(context)) {
//         throw new Error("Rate limit exceeded for Voiceflow processing")
//       }
     

//       const contextData = await this.gatherContext(context)

// // Get business using automationId since business.automationId links to automation.id
// Logger.info(`🔍 Looking up business for automation: ${context.automation.id}`)

// const business = await getBusinessByAutomationId(context.automation.id)

// if (!business) {
//   Logger.error(`❌ No business found for automation: ${context.automation.id}`)
//   throw new Error(`No business linked to automation: ${context.automation.id}`)
// }

// const businessId = business.id
// Logger.info(`✅ Found business: ${businessId}`)

// // Now proceed with the business variables
// const businessVariables = await RetryManager.withRetry(
//   () =>
//     fetchEnhancedBusinessVariables(
//       businessId, // Now we have the correct businessId
//       context.automation.id,
//       context.automation.businessWorkflowConfig?.id || null,
//       {
//         pageId: context.data.pageId,
//         senderId: context.data.senderId,
//         userMessage: context.userMessage,
//         isNewUser: contextData.conversationHistory.length === 0,
//         customerType:
//           contextData.conversationHistory.length >= 10
//             ? "VIP"
//             : contextData.conversationHistory.length > 0
//             ? "RETURNING"
//             : "NEW",
//         messageHistory: contextData.conversationHistory,
//       },
//     ),
//   "Fetch business variables",
// )

//       const response = await this.processVoiceflowWithRetry(context, contextData, businessVariables)

//       return {
//         success: true,
//         responseText: response.text,
//         buttons: response.buttons,
//         quickReplies: response.quickReplies,
//         carousel: response.carousel,
//         attachment: response.attachment,
//         variables: response.variables,
//         extractedData: response.extractedData,
//         aiSystem: response.aiSystem,
//       }
//     } catch (error) {
//       Logger.error("Voiceflow handler failed completely", error)
//       throw error // NO FALLBACK - Let it fail
//     }
//   }

//   private static async isRateLimited(context: ProcessingContext): Promise<boolean> {
//     const count = await getRecentResponseCount(context.data.pageId, context.data.senderId, context.data.messageType, 2)
//     if (count >= CONFIG.RATE_LIMITS.MAX_RESPONSES_PER_2MIN) {
//       Logger.warning(`Rate limit exceeded: ${count} responses in 2 minutes`)
//       return true
//     }
//     return false
//   }

//   private static async gatherContext(context: ProcessingContext) {
//     Logger.debug("Gathering Voiceflow context...")

//     const [historyResult, profileResult] = await Promise.allSettled([
//       TimeoutManager.withTimeout(
//         buildConversationContext(context.data.pageId, context.data.senderId, context.automation.id),
//         CONFIG.TIMEOUTS.PROFILE,
//         "Conversation history",
//       ),
//       TimeoutManager.withTimeout(
//         getBusinessProfileForAutomation(context.automation.id),
//         CONFIG.TIMEOUTS.PROFILE,
//         "Business profile",
//       ),
//     ])

//     const conversationHistory =
//       historyResult.status === "fulfilled" && Array.isArray(historyResult.value) ? historyResult.value : []

//     const profile =
//       profileResult.status === "fulfilled" ? profileResult.value : { profileContent: "", businessContext: {} }

//     Logger.success(`Context gathered - History: ${conversationHistory.length} messages`)

//     return { conversationHistory, profile }
//   }

//   private static async processVoiceflowWithRetry(
//     context: ProcessingContext,
//     contextData: any,
//     businessVariables: Record<string, string>,
//   ) {
//     Logger.debug("Processing with Voiceflow (enhanced with all message types)...")

//     // Create Voiceflow user (non-blocking)
//     createVoiceflowUser(context.conversationUserId).catch((error) =>
//       Logger.warning("Voiceflow user creation failed", error),
//     )

//     // Retrieve Voiceflow credentials from environment variables
//     const voiceflowApiKey = process.env.VOICEFLOW_API_KEY
//     const voiceflowProjectId = process.env.VOICEFLOW_PROJECT_ID
//     const voiceflowVersionId = process.env.VOICEFLOW_VERSION_ID

//     if (!voiceflowApiKey || !voiceflowProjectId) {
//       throw new Error("Voiceflow API Key or Project ID is missing from environment variables")
//     }

//     const isFirstMessage = contextData.conversationHistory.length === 0

//     // Use retry mechanism for Voiceflow API calls
//     const voiceflowResult = await RetryManager.withRetry(
//       async () => {
//         const result = await TimeoutManager.withTimeout(
//           getEnhancedVoiceflowResponse(
//             context.userMessage,
//             context.conversationUserId,
//             businessVariables,
//             voiceflowApiKey,
//             voiceflowProjectId,
//             voiceflowVersionId,
//             {
//               maxRetries: 1, // Let RetryManager handle retries
//               timeoutMs: CONFIG.TIMEOUTS.VOICEFLOW,
//               enableFallbackDetection: false, // Disable internal fallback detection
//               isFirstMessage,
//             },
//           ),
//           CONFIG.TIMEOUTS.VOICEFLOW,
//           "Voiceflow API call",
//         )

//         // Enhanced validation for all response types
//         if (!result.success || !result.response) {
//           throw new Error(`Voiceflow returned invalid response: ${result.error || "Empty response"}`)
//         }

//         // Check if we have at least some content
//         const hasContent = result.response.text || 
//                           result.response.quickReplies?.length || 
//                           result.response.buttons?.length ||
//                           result.response.carousel?.length ||
//                           result.response.attachment

//         if (!hasContent) {
//           throw new Error("Voiceflow returned response with no content")
//         }

//         return result
//       },
//       "Voiceflow API processing",
//       CONFIG.RETRY.MAX_ATTEMPTS,
//     )

//     Logger.success("✨ Enhanced Voiceflow response successful")

//     // Extract customer data from Voiceflow variables
//     const extractedData = this.extractCustomerData(voiceflowResult.variables)

//     // Process lead qualification in background (non-blocking)
//     if (context.automation.User?.id && context.data.senderId !== context.data.pageId) {
//       this.processLeadQualification(context, extractedData)
//     }

//     return {
//       text: voiceflowResult.response?.text,
//       quickReplies: voiceflowResult.response?.quickReplies,
//       buttons: voiceflowResult.response?.buttons,
//       carousel: voiceflowResult.response?.carousel,
//       attachment: voiceflowResult.response?.attachment,
//       variables: voiceflowResult.variables,
//       extractedData,
//       aiSystem: "voiceflow_enhanced_full",
//     }
//   }

//   private static extractCustomerData(variables: any): { name?: string; email?: string; phone?: string } | undefined {
//     if (!variables) return undefined

//     const extractedData = {
//       name:
//         variables.customer_name || variables.clientname || variables.name || variables.user_name || variables.full_name,
//       email:
//         variables.customer_email ||
//         variables.clientemail ||
//         variables.email ||
//         variables.user_email ||
//         variables.email_address,
//       phone:
//         variables.customer_phone ||
//         variables.clientphone ||
//         variables.phone ||
//         variables.user_phone ||
//         variables.phone_number,
//     }

//     // Only return if we have at least one piece of data
//     if (extractedData.name || extractedData.email || extractedData.phone) {
//       Logger.info("📋 Customer data extracted from Voiceflow:", extractedData)
//       return extractedData
//     }

//     return undefined
//   }

//   private static async processLeadQualification(
//     context: ProcessingContext,
//     extractedData?: { name?: string; email?: string; phone?: string },
//   ) {
//     // Run lead qualification in background without blocking response
//     setImmediate(async () => {
//       try {
//         Logger.info("🔍 Starting lead qualification analysis...")

//         const leadAnalysisResult = (await Promise.race([
//           analyzeLead({
//             userId: context.automation.User.id,
//             automationId: context.automation.id,
//             platformId: context.data.pageId,
//             customerId: context.data.senderId,
//             message: context.userMessage,
//             messageType: context.data.messageType,
//             timestamp: new Date(),
//           }),
//           new Promise((_, reject) => setTimeout(() => reject(new Error("Lead analysis timeout")), 10000)),
//         ])) as any

//         if (leadAnalysisResult && leadAnalysisResult.lead) {
//           Logger.success(`📊 Lead analysis completed for ${context.data.senderId}`)

//           // Store marketing info if we extracted customer data
//           if (extractedData && (extractedData.name || extractedData.email || extractedData.phone)) {
//             await this.storeMarketingInfo(context.automation.User.id, extractedData, leadAnalysisResult.lead.id)
//           }
//         }
//       } catch (error) {
//         Logger.error("❌ Error in lead qualification (running in background):", error)
//       }
//     })
//   }

//   private static async storeMarketingInfo(
//     userId: string,
//     extractedData: { name?: string; email?: string; phone?: string },
//     leadId?: string,
//   ) {
//     try {
//       // Create marketing info record
//       await client.marketingInfo.create({
//         data: {
//           name: extractedData.name,
//           email: extractedData.email,
//           phone: extractedData.phone,
//           userId: userId,
//         },
//       })

//       // Update lead with extracted data if we have a lead ID
//       if (leadId) {
//         await client.lead.update({
//           where: { id: leadId },
//           data: {
//             name: extractedData.name,
//             email: extractedData.email,
//             phone: extractedData.phone,
//             metadata: {
//               dataCollectionTimestamp: new Date().toISOString(),
//               extractedFromVoiceflow: true,
//             },
//           },
//         })
//       }

//       Logger.success("📝 Marketing info and lead data stored successfully")
//     } catch (error) {
//       Logger.error("❌ Error storing marketing info:", error)
//     }
//   }
// }

// // ============================================================================
// // GEMINI HANDLER (FOR STANDARD USERS)
// // ============================================================================

// class GeminiHandler {
//   static async handle(context: ProcessingContext): Promise<ProcessingResult> {
//     Logger.info("🔮 === GEMINI HANDLER (STANDARD USERS) ===")

//     try {
//       const count = await getRecentResponseCount(
//         context.data.pageId,
//         context.data.senderId,
//         context.data.messageType,
//         2,
//       )
//       if (count >= CONFIG.RATE_LIMITS.MAX_RESPONSES_PER_2MIN) {
//         throw new Error("Rate limit exceeded for Gemini processing")
//       }

//       const [profileResult, historyResult] = await Promise.allSettled([
//         TimeoutManager.withTimeout(
//           getBusinessProfileForAutomation(context.automation.id),
//           CONFIG.TIMEOUTS.PROFILE,
//           "Business profile",
//         ),
//         TimeoutManager.withTimeout(
//           buildConversationContext(context.data.pageId, context.data.senderId, context.automation.id),
//           CONFIG.TIMEOUTS.PROFILE,
//           "Conversation history",
//         ),
//       ])

//       const profile =
//         profileResult.status === "fulfilled" ? profileResult.value : { profileContent: "", businessContext: {} }

//       const history =
//         historyResult.status === "fulfilled" && Array.isArray(historyResult.value) ? historyResult.value : []

//       Logger.success(`Gemini context gathered - History: ${history.length} messages`)

//       // Process lead qualification for standard users too
//       if (context.automation.User?.id && context.data.senderId !== context.data.pageId) {
//         await this.processLeadQualification(context)
//       }

//       const geminiResponse = await RetryManager.withRetry(
//         () =>
//           TimeoutManager.withTimeout(
//             generateGeminiResponse({
//               userMessage: context.userMessage,
//               businessProfile: profile.profileContent,
//               conversationHistory: history,
//               businessContext: profile.businessContext,
//               isPROUser: false,
//             }),
//             CONFIG.TIMEOUTS.GEMINI,
//             "Gemini response",
//           ),
//         "Gemini API processing",
//       )

//       const responseText = typeof geminiResponse === "string" ? geminiResponse : ""

//       if (!responseText || responseText.trim().length === 0) {
//         throw new Error("Gemini returned empty response")
//       }

//       Logger.success("✨ Gemini response successful")

//       return {
//         success: true,
//         responseText,
//         buttons: undefined,
//         variables: undefined,
//         extractedData: undefined,
//         aiSystem: "gemini_with_retry",
//       }
//     } catch (error) {
//       Logger.error("Gemini handler failed", error)
//       throw error // NO FALLBACK - Let it fail
//     }
//   }

//   private static async processLeadQualification(context: ProcessingContext) {
//     try {
//       Logger.info("🔍 Starting lead qualification for standard user...")

//       await analyzeLead({
//         userId: context.automation.User.id,
//         automationId: context.automation.id,
//         platformId: context.data.pageId,
//         customerId: context.data.senderId,
//         message: context.userMessage,
//         messageType: context.data.messageType,
//         timestamp: new Date(),
//       })

//       Logger.success(`📊 Lead analysis completed for standard user`)
//     } catch (error) {
//       Logger.error("❌ Error in lead qualification for standard user:", error)
//     }
//   }
// }


// // ============================================================================
// // BACKGROUND PROCESSOR (ENHANCED WITH DATA HANDLING)
// // ============================================================================

// class BackgroundProcessor {
//   static process(
//     context: ProcessingContext,
//     responseText: string,
//     extractedData?: { name?: string; email?: string; phone?: string },
//   ): void {
//     Logger.debug("🔄 Starting enhanced background tasks...")

//     Promise.allSettled([
//       storeConversationMessage(
//         context.data.pageId,
//         context.data.senderId,
//         context.userMessage,
//         false,
//         context.automation?.id || null,
//       ),
//       storeConversationMessage(context.data.pageId, "bot", responseText, true, context.automation?.id || null),
//       context.automation?.id
//         ? trackMessageForSentiment(
//             context.automation.id,
//             context.data.pageId,
//             context.data.senderId,
//             context.userMessage,
//           )
//         : Promise.resolve(),
//       createChatHistory(
//         context.automation?.id || null,
//         context.data.pageId,
//         context.data.senderId,
//         context.userMessage,
//       ),
//       createChatHistory(context.automation?.id || null, context.data.pageId, context.data.senderId, responseText),
//       // Update conversation state with enhanced data
//       updateConversationState(context.conversationUserId, {
//         isActive: true,
//         lastTriggerType: context.triggerDecision.triggerType,
//         lastTriggerReason: context.triggerDecision.reason,
//         automationId: context.automation.id,
//         listenMode: context.triggerDecision.triggerType === "KEYWORD" ? "KEYWORDS" : "ALL_MESSAGES",
//         lastMessageLength: context.userMessage.length,
//       }),
//       // Log trigger execution
//       context.triggerDecision.automationId && context.triggerDecision.triggerId && context.automation.User?.id
//         ? logTriggerExecution({
//             triggerId: context.triggerDecision.triggerId,
//             automationId: context.triggerDecision.automationId,
//             userId: context.automation.User.id,
//             messageContent: context.userMessage,
//             triggerType: context.triggerDecision.triggerType as any,
//             confidence: context.triggerDecision.confidence,
//             reason: context.triggerDecision.reason,
//             success: true,
//             responseTime: Date.now() - context.startTime,
//           })
//         : Promise.resolve(),
//     ])
//       .then((results) => {
//         const failures = results.filter((r) => r.status === "rejected").length
//         if (failures === 0) {
//           Logger.success("✅ All enhanced background tasks completed successfully")
//         } else {
//           Logger.warning(`⚠️ ${failures} background tasks failed`)
//         }
//       })
//       .catch((error) => Logger.warning("Enhanced background tasks failed", error))
//   }
// }

// // ============================================================================
// // MAIN ROUTE HANDLERS
// // ============================================================================

// export async function GET(req: NextRequest) {
//   const hub = req.nextUrl.searchParams.get("hub.challenge")
//   return new NextResponse(hub)
// }

// export async function POST(req: NextRequest) {
//   Logger.info("🚀 POST request received")
//   const startTime = Date.now()
//   let webhook_payload

//   try {
//     webhook_payload = await req.json()
//     Logger.debug("📥 Received webhook payload:", webhook_payload)

//     // Handle deauth webhooks
//     const specialWebhook = WebhookValidator.isSpecialWebhook(webhook_payload)
//     if (specialWebhook === "deauth") {
//       Logger.info("🔐 Processing Instagram deauthorization webhook")
//       const signature = req.headers.get("x-hub-signature-256")
//       const body = JSON.stringify(webhook_payload)

//       if (!signature || !verifyInstagramWebhook(signature, body, process.env.INSTAGRAM_CLIENT_SECRET!)) {
//         Logger.error("❌ Invalid webhook signature for deauth")
//         return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
//       }

//       const result = await handleInstagramDeauthWebhook(webhook_payload)
//       return NextResponse.json(result, { status: result.status })
//     }

//     // Handle data deletion webhooks
//     if (specialWebhook === "data_deletion") {
//       Logger.info("🗑️ Processing Instagram data deletion webhook")
//       const signature = req.headers.get("x-hub-signature-256")
//       const body = JSON.stringify(webhook_payload)

//       if (!signature || !verifyInstagramWebhook(signature, body, process.env.INSTAGRAM_CLIENT_SECRET!)) {
//         Logger.error("❌ Invalid webhook signature for data deletion")
//         return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
//       }

//       const result = await handleInstagramDataDeletionWebhook(webhook_payload)
//       return NextResponse.json(result, { status: result.status })
//     }

//     // Handle read receipts and delivery confirmations
//     if (specialWebhook === "receipt") {
//       Logger.debug("📖 Received read receipt or delivery confirmation - acknowledging")
//       return NextResponse.json({ message: "Read receipt acknowledged" }, { status: 200 })
//     }

//     const data = WebhookValidator.extractData(webhook_payload)

//     if (!data) {
//       Logger.warning("⚠️ Unsupported webhook payload structure or non-text message")
//       return NextResponse.json({ message: "Unsupported webhook payload" }, { status: 200 })
//     }

//     // Skip echo messages (messages sent by the bot)
//     if (data.isEcho) {
//       Logger.debug("🔄 Skipping echo message (sent by bot)")
//       return NextResponse.json({ message: "Echo message ignored" }, { status: 200 })
//     }

//     await MessageProcessor.processImmediate(data, startTime)

//     const processingTime = Date.now() - startTime
//     Logger.performance("Successfully processed webhook request", startTime)

//     // Get Voiceflow health for response
//     const voiceflowHealth = getVoiceflowHealth()

//     return NextResponse.json(
//       {
//         message: "Request processed successfully",
//         processingTime,
//         messageType: data.messageType,
//         voiceflowHealth: voiceflowHealth,
//         memoryMetrics: EnhancedMemoryManager.getInstance().getMetrics(),
//       },
//       { status: 200 },
//     )
//   } catch (error) {
//     Logger.error("💥 Unhandled error in POST function:", error)
//     return NextResponse.json(
//       {
//         message: "Error processing request",
//         error: error instanceof Error ? error.message : String(error),
//       },
//       { status: 500 },
//     )
//   }
// }

// // ============================================================================
// // ENHANCED RESPONSE SENDER - USING UPDATED MESSAGE FUNCTIONS
// // ============================================================================

// class ResponseSender {
//   static async send(context: ProcessingContext, voiceflowResponse: VoiceflowResponse): Promise<void> {
//     Logger.info(`📤 Sending enhanced response with ${voiceflowResponse.text ? 'text' : 'template'}...`)

//     // Transform Voiceflow response to Instagram format using the updated function
//     const transformed = transformVoiceflowToInstagram(voiceflowResponse)

//     // Check for duplicates based on text content
//     const textContent = transformed.text || "template_message"
//     const isDuplicate = await checkDuplicateResponse(
//       context.data.pageId,
//       context.data.senderId,
//       textContent,
//       context.data.messageType,
//     )

//     if (isDuplicate) {
//       Logger.warning("Duplicate response detected, skipping send to avoid spam")
//       return
//     }

//     const token = context.automation?.User?.integrations?.[0]?.token || process.env.DEFAULT_PAGE_TOKEN!

//     // Use retry mechanism for sending enhanced messages
//     await RetryManager.withRetry(
//       async () => {
//         let result

//         if (context.data.messageType === "DM") {
//           Logger.debug("Sending enhanced DM using updated sendDMs function")
//           // Ensure the transformed object matches InstagramAlignedMessage type
//           const alignedMessage: InstagramAlignedMessage = {
//             text: transformed.text,
//             quickReplies: transformed.quickReplies?.map(qr => ({
//               content_type: "text" as const,
//               title: qr.title,
//               payload: qr.payload || qr.title
//             })),
//             buttons: transformed.buttons?.map(btn => ({
//               title: btn.title,
//               payload: btn.payload || btn.title,
//               url: btn.url
//             })),
//             carousel: transformed.carousel?.map(element => ({
//               title: element.title,
//               subtitle: element.subtitle,
//               image_url: element.image_url,
//               buttons: element.buttons?.map(btn => ({
//                 title: btn.title,
//                 payload: btn.payload || btn.title,
//                 url: btn.url
//               }))
//             })),
//             attachment: transformed.attachment && 
//               ['image', 'video', 'audio', 'file'].includes(transformed.attachment.type) ? {
//               type: transformed.attachment.type as 'image' | 'video' | 'audio' | 'file',
//               url: (transformed.attachment as any).url || '',
//               caption: (transformed.attachment as any).caption
//             } : undefined
//           }
          
//           result = await TimeoutManager.withTimeout(
//             sendDMs(
//               context.data.pageId,
//               context.data.senderId,
//               alignedMessage,
//               token,
//               "DM"
//             ),
//             10000,
//             "Enhanced DM send",
//           )
//         } else if (context.data.messageType === "COMMENT" && context.data.commentId) {
//           Logger.debug("Sending enhanced private message using updated sendPrivateMessages function")
//           result = await TimeoutManager.withTimeout(
//             sendPrivateMessages(
//               context.data.pageId,
//               context.data.commentId,
//               transformed.text,
//               token,
//               transformed.quickReplies,
//               transformed.buttons,
//               transformed.carousel,
//               transformed.attachment
//             ),
//             10000,
//             "Enhanced Comment send",
//           )
//         }

//         if (result?.status !== 200) {
//           throw new Error(`Enhanced send failed with status: ${result?.status}`)
//         }

//         Logger.success(`✅ Enhanced response sent successfully`)

//         // Mark response as sent
//         await Promise.allSettled([
//           markResponseAsSent(
//             context.data.pageId,
//             context.data.senderId,
//             textContent,
//             context.data.messageType,
//             context.automation.id,
//           ),
//           trackResponses(context.automation.id, context.data.messageType),
//         ])

//         return result
//       },
//       "Enhanced message sending",
//       CONFIG.RETRY.MAX_ATTEMPTS,
//     )
//   }

// }


// // ============================================================================
// // COMPREHENSIVE VOICEFLOW-INSTAGRAM BUTTON INTEGRATION SOLUTION
// // ============================================================================



// // ============================================================================
// // SMART BUTTON PROPERTY EXTRACTOR
// // ============================================================================

// class VoiceflowButtonExtractor {
//   /**
//    * Intelligently extracts button title from various Voiceflow structures
//    */
//   static extractTitle(button: VoiceflowButton): string {
//     // Priority order for title extraction
//     const titleCandidates = [
//       button.title,
//       button.name,
//       button.label,
//       button.text,
//       button.request?.payload?.intent?.name,
//       button.id,
//       "Option" // Final fallback
//     ];

//     for (const candidate of titleCandidates) {
//       if (candidate && typeof candidate === 'string' && candidate.trim().length > 0) {
//         return candidate.trim();
//       }
//     }

//     return "Option";
//   }

//   /**
//    * Intelligently extracts button payload from various Voiceflow structures
//    */
//   static extractPayload(button: VoiceflowButton): string {
//     // Priority order for payload extraction
//     if (button.payload) {
//       if (typeof button.payload === 'string') {
//         return button.payload;
//       }
//       if (typeof button.payload === 'object') {
//         return JSON.stringify(button.payload);
//       }
//     }

//     if (button.value && typeof button.value === 'string') {
//       return button.value;
//     }

//     if (button.request?.payload?.intent?.name) {
//       return button.request.payload.intent.name;
//     }

//     if (button.request?.payload?.query) {
//       return button.request.payload.query;
//     }

//     // Fallback to title-based payload
//     return this.extractTitle(button).toLowerCase().replace(/\s+/g, '_');
//   }

//   /**
//    * Determines if button should be web_url or postback
//    */
//   static extractButtonType(button: VoiceflowButton): 'web_url' | 'postback' {
//     return (button.url || button.link) ? 'web_url' : 'postback';
//   }

//   /**
//    * Extracts URL for web buttons
//    */
//   static extractUrl(button: VoiceflowButton): string | undefined {
//     return button.url || button.link;
//   }
// }

// // ============================================================================
// // ENHANCED VOICEFLOW RESPONSE TRANSFORMER
// // ============================================================================

// function transformVoiceflowResponseToInstagram(voiceflowResponse: EnhancedVoiceflowResponse): {
//   text: string;
//   quickReplies?: InstagramQuickReply[];
//   buttons?: InstagramButton[];
//   carousel?: InstagramGenericElement[];
//   attachment?: InstagramAttachment;
// } {
//   const result: any = {
//     text: voiceflowResponse.text || ""
//   };

//   // Handle Voiceflow traces if present (for newer Voiceflow versions)
//   if (voiceflowResponse.traces && voiceflowResponse.traces.length > 0) {
//     for (const trace of voiceflowResponse.traces) {
//       if (trace.type === 'choice' && trace.payload?.buttons) {
//         voiceflowResponse.buttons = trace.payload.buttons;
//       }
//       if (trace.type === 'text' && trace.payload?.message) {
//         result.text = trace.payload.message;
//       }
//     }
//   }

//   // Transform quick replies with enhanced extraction
//   if (voiceflowResponse.quickReplies && voiceflowResponse.quickReplies.length > 0) {
//     result.quickReplies = voiceflowResponse.quickReplies.slice(0, 13).map((reply) => {
//       const title = reply.title || reply.name || "Option";
//       const payload = reply.payload || reply.value || title;
      
//       return {
//         content_type: "text" as const,
//         title: String(title).substring(0, 20),
//         payload: String(payload).substring(0, 1000)
//       };
//     });
//   }

//   // ENHANCED: Transform buttons with comprehensive property extraction
//   if (voiceflowResponse.buttons && voiceflowResponse.buttons.length > 0) {
//     result.buttons = voiceflowResponse.buttons.slice(0, 3).map((button) => {
//       const title = VoiceflowButtonExtractor.extractTitle(button);
//       const payload = VoiceflowButtonExtractor.extractPayload(button);
//       const buttonType = VoiceflowButtonExtractor.extractButtonType(button);
//       const url = VoiceflowButtonExtractor.extractUrl(button);

//       const instagramButton: InstagramButton = {
//         type: buttonType,
//         title: title.substring(0, 20),
//         // name: title.substring(0, 20) // Keep for compatibility
//       };

//       if (buttonType === 'web_url' && url) {
//         instagramButton.url = url;
//       } else {
//         instagramButton.payload = payload.substring(0, 1000);
//       }

//       return instagramButton;
//     });
//   }

//   // Transform carousel with enhanced button handling
//   if (voiceflowResponse.carousel && voiceflowResponse.carousel.length > 0) {
//     result.carousel = voiceflowResponse.carousel.slice(0, 10).map((card) => {
//       const element: InstagramGenericElement = {
//         title: String(card.title || "").substring(0, 80) || "Card",
//         subtitle: card.subtitle ? String(card.subtitle).substring(0, 80) : undefined,
//         image_url: card.imageUrl || card.image_url || undefined
//       };

//       if (card.buttons && card.buttons.length > 0) {
//         element.buttons = card.buttons.slice(0, 3).map((button) => {
//           const title = VoiceflowButtonExtractor.extractTitle(button);
//           const payload = VoiceflowButtonExtractor.extractPayload(button);
//           const buttonType = VoiceflowButtonExtractor.extractButtonType(button);
//           const url = VoiceflowButtonExtractor.extractUrl(button);

//           const instagramButton: InstagramButton = {
//             type: buttonType,
//             title: title.substring(0, 20)
//           };

//           if (buttonType === 'web_url' && url) {
//             instagramButton.url = url;
//           } else {
//             instagramButton.payload = payload.substring(0, 1000);
//           }

//           return instagramButton;
//         });
//       }

//       return element;
//     });
//   }

//   // Handle custom attachments
//   if (voiceflowResponse.attachment) {
//     result.attachment = voiceflowResponse.attachment;
//   }

//   return result;
// }


// import { type NextRequest, NextResponse } from "next/server"
// import {
//   decideTriggerAction,
//   checkProcessedMessage,
//   markMessageAsProcessed,
//   checkDuplicateResponse,
//   markResponseAsSent,
//   getRecentResponseCount,
//   trackResponses,
//   createChatHistory,
//   updateConversationState,
//   logTriggerExecution,
//   getAutomationWithTriggers,
// } from "@/actions/webhook/queries"
// import { getBusinessProfileForAutomation, getOrCreateDefaultAutomation } from "@/actions/webhook/business-profile"
// import { generateGeminiResponse, buildConversationContext } from "@/lib/gemini"
// import {
//   createVoiceflowUser,
//   fetchEnhancedBusinessVariables,
//   getEnhancedVoiceflowResponse,
// } from "@/lib/voiceflow"
// import { analyzeLead } from "@/lib/lead-qualification"
// import { sendPrivateMessages, transformVoiceflowToInstagram } from "@/lib/fetch"
// import { sendDMs } from "@/lib/voiceflow"
// import { storeConversationMessage } from "@/actions/chats/queries"
// import { handleInstagramDeauthWebhook, handleInstagramDataDeletionWebhook } from "@/lib/deauth"
// import { verifyInstagramWebhook } from "@/utils/instagram"
// import { trackMessageForSentiment } from "@/lib/sentiment-tracker"
// import { getBusinessByAutomationId } from "@/actions/businfo/queries"

// // ============================================================================
// // TYPES & INTERFACES
// // ============================================================================

// interface WebhookPayload {
//   pageId: string
//   senderId: string
//   recipientId?: string
//   userMessage: string
//   messageId?: string
//   commentId?: string
//   messageType: "DM" | "COMMENT"
//   isEcho?: boolean
// }

// interface ProcessingContext {
//   payload: WebhookPayload
//   automation: any
//   userId: string
//   triggerDecision: any
//   startTime: number
//   messageKey: string
// }

// interface ProcessingResult {
//   success: boolean
//   data?: {
//     text?: string
//     quickReplies?: any[]
//     buttons?: any[]
//     carousel?: any[]
//     attachment?: any
//     variables?: Record<string, any>
//     extractedData?: {
//       name?: string
//       email?: string
//       phone?: string
//     }
//   }
//   aiSystem?: string
//   error?: string
// }

// interface ServiceConfig {
//   TIMEOUTS: {
//     VOICEFLOW: number
//     GEMINI: number
//     TOTAL_PROCESSING: number
//   }
//   RATE_LIMITS: {
//     MAX_RESPONSES_PER_PERIOD: number
//     PERIOD_MINUTES: number
//     DUPLICATE_WINDOW_MS: number
//   }
//   RETRY: {
//     MAX_ATTEMPTS: number
//     BASE_DELAY: number
//     BACKOFF_FACTOR: number
//   }
// }

// // ============================================================================
// // CONFIGURATION
// // ============================================================================

// const CONFIG: ServiceConfig = {
//   TIMEOUTS: {
//     VOICEFLOW: 15000,
//     GEMINI: 10000,
//     TOTAL_PROCESSING: 25000,
//   },
//   RATE_LIMITS: {
//     MAX_RESPONSES_PER_PERIOD: 3,
//     PERIOD_MINUTES: 2,
//     DUPLICATE_WINDOW_MS: 8000,
//   },
//   RETRY: {
//     MAX_ATTEMPTS: 2,
//     BASE_DELAY: 1000,
//     BACKOFF_FACTOR: 2,
//   },
// }

// // ============================================================================
// // UTILITIES
// // ============================================================================

// class Logger {
//   private static formatMessage(level: string, message: string, data?: any): string {
//     const timestamp = new Date().toISOString()
//     const dataStr = data ? ` | ${JSON.stringify(data)}` : ""
//     return `[${timestamp}] ${level} ${message}${dataStr}`
//   }

//   static info(message: string, data?: any): void {
//     console.log(this.formatMessage("INFO", message, data))
//   }

//   static warn(message: string, data?: any): void {
//     console.warn(this.formatMessage("WARN", message, data))
//   }

//   static error(message: string, error?: any): void {
//     console.error(this.formatMessage("ERROR", message, error))
//   }

//   static debug(message: string, data?: any): void {
//     if (process.env.NODE_ENV === "development") {
//       console.log(this.formatMessage("DEBUG", message, data))
//     }
//   }
// }

// class TimeoutManager {
//   static async withTimeout<T>(
//     promise: Promise<T>,
//     timeoutMs: number,
//     operationName: string
//   ): Promise<T> {
//     const timeoutPromise = new Promise<never>((_, reject) => {
//       setTimeout(() => {
//         reject(new Error(`Operation '${operationName}' timed out after ${timeoutMs}ms`))
//       }, timeoutMs)
//     })

//     return Promise.race([promise, timeoutPromise])
//   }
// }

// class RetryManager {
//   static async withRetry<T>(
//     operation: () => Promise<T>,
//     operationName: string,
//     maxAttempts: number = CONFIG.RETRY.MAX_ATTEMPTS
//   ): Promise<T> {
//     let lastError: Error

//     for (let attempt = 1; attempt <= maxAttempts; attempt++) {
//       try {
//         const result = await operation()
//         if (attempt > 1) {
//           Logger.info(`Operation '${operationName}' succeeded on attempt ${attempt}`)
//         }
//         return result
//       } catch (error) {
//         lastError = error as Error
//         Logger.warn(`Operation '${operationName}' failed on attempt ${attempt}`, { error: lastError.message })

//         if (attempt < maxAttempts) {
//           const delay = CONFIG.RETRY.BASE_DELAY * Math.pow(CONFIG.RETRY.BACKOFF_FACTOR, attempt - 1)
//           await new Promise(resolve => setTimeout(resolve, delay))
//         }
//       }
//     }

//     throw new Error(`Operation '${operationName}' failed after ${maxAttempts} attempts: ${lastError!.message}`)
//   }
// }

// // ============================================================================
// // WEBHOOK VALIDATOR
// // ============================================================================

// class WebhookValidator {
//   static extractPayload(body: any): WebhookPayload | null {
//     try {
//       // Handle messaging events (DMs and postbacks)
//       if (body?.entry?.[0]?.messaging) {
//         const messaging = body.entry[0].messaging[0]

//         // Skip read receipts and delivery confirmations
//         if (messaging.read || messaging.delivery) {
//           return null
//         }

//         // Handle regular messages
//         if (messaging.message) {
//           if (!messaging.message.text || messaging.message.is_echo) {
//             return null
//           }

//           return {
//             pageId: body.entry[0].id,
//             senderId: messaging.sender.id,
//             recipientId: messaging.recipient.id,
//             userMessage: messaging.message.text,
//             messageId: messaging.message.mid,
//             messageType: "DM",
//             isEcho: false,
//           }
//         }

//         // Handle postback events (button clicks)
//         if (messaging.postback) {
//           return {
//             pageId: body.entry[0].id,
//             senderId: messaging.sender.id,
//             recipientId: messaging.recipient.id,
//             userMessage: messaging.postback.payload || messaging.postback.title || "Button clicked",
//             messageId: `postback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
//             messageType: "DM",
//             isEcho: false,
//           }
//         }
//       }

//       // Handle comment events
//       if (body?.entry?.[0]?.changes?.[0]?.field === "comments") {
//         const changeValue = body.entry[0].changes[0].value

//         if (!changeValue.text) {
//           return null
//         }

//         return {
//           pageId: body.entry[0].id,
//           senderId: changeValue.from.id,
//           userMessage: changeValue.text,
//           commentId: changeValue.id,
//           messageType: "COMMENT",
//           isEcho: false,
//         }
//       }

//       return null
//     } catch (error) {
//       Logger.error("Failed to extract webhook payload", error)
//       return null
//     }
//   }

//   static isSpecialWebhook(body: any): "deauth" | "data_deletion" | "receipt" | null {
//     if (body?.object === "instagram") {
//       const field = body?.entry?.[0]?.changes?.[0]?.field
//       if (field === "deauthorizations") return "deauth"
//       if (field === "data_deletion") return "data_deletion"
//     }

//     if (body?.entry?.[0]?.messaging?.[0]) {
//       const messaging = body.entry[0].messaging[0]
//       if (messaging.read || messaging.delivery) return "receipt"
//     }

//     return null
//   }
// }

// // ============================================================================
// // DUPLICATE PREVENTION SYSTEM
// // ============================================================================

// class DuplicateGuard {
//   private static recentMessages = new Map<string, number>()
//   private static processingMessages = new Set<string>()

//   static generateMessageKey(payload: WebhookPayload): string {
//     const baseId = payload.messageId || payload.commentId || `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
//     const contentHash = payload.userMessage.substring(0, 50).replace(/\s+/g, "_")
//     return `${payload.pageId}_${payload.senderId}_${baseId}_${contentHash}_${payload.messageType}`
//   }

//   static async isDuplicate(payload: WebhookPayload, messageKey: string): Promise<boolean> {
//     const now = Date.now()

//     // Check in-memory recent messages
//     const duplicateKey = `${payload.pageId}_${payload.senderId}_${payload.userMessage}_${payload.messageType}`
//     const lastTime = this.recentMessages.get(duplicateKey)
    
//     if (lastTime && (now - lastTime) < CONFIG.RATE_LIMITS.DUPLICATE_WINDOW_MS) {
//       Logger.warn("Duplicate message blocked (in-memory)", { key: duplicateKey })
//       return true
//     }

//     // Check if currently processing
//     if (this.processingMessages.has(duplicateKey)) {
//       Logger.warn("Message already being processed", { key: duplicateKey })
//       return true
//     }

//     // Check database for processed messages
//     const dbDuplicate = await checkProcessedMessage(messageKey)
//     if (dbDuplicate) {
//       Logger.warn("Message already processed (database)", { key: messageKey })
//       return true
//     }

//     // Mark as processing and update recent messages
//     this.processingMessages.add(duplicateKey)
//     this.recentMessages.set(duplicateKey, now)
    
//     // Clean up old entries
//     this.cleanup()

//     return false
//   }

//   static finishProcessing(payload: WebhookPayload): void {
//     const duplicateKey = `${payload.pageId}_${payload.senderId}_${payload.userMessage}_${payload.messageType}`
//     this.processingMessages.delete(duplicateKey)
//   }

//   private static cleanup(): void {
//     const cutoff = Date.now() - (CONFIG.RATE_LIMITS.DUPLICATE_WINDOW_MS * 2)
    
//     for (const [key, timestamp] of this.recentMessages.entries()) {
//       if (timestamp < cutoff) {
//         this.recentMessages.delete(key)
//       }
//     }
//   }
// }

// // ============================================================================
// // RATE LIMITER
// // ============================================================================

// class RateLimiter {
//   static async checkLimit(payload: WebhookPayload): Promise<boolean> {
//     try {
//       const count = await getRecentResponseCount(
//         payload.pageId,
//         payload.senderId,
//         payload.messageType,
//         CONFIG.RATE_LIMITS.PERIOD_MINUTES
//       )

//       if (count >= CONFIG.RATE_LIMITS.MAX_RESPONSES_PER_PERIOD) {
//         Logger.warn("Rate limit exceeded", {
//           pageId: payload.pageId,
//           senderId: payload.senderId,
//           count,
//           limit: CONFIG.RATE_LIMITS.MAX_RESPONSES_PER_PERIOD
//         })
//         return false
//       }

//       return true
//     } catch (error) {
//       Logger.error("Error checking rate limit", error)
//       return true // Allow on error
//     }
//   }
// }

// // ============================================================================
// // AI PROCESSING HANDLERS
// // ============================================================================

// class VoiceflowProcessor {
//   static async process(context: ProcessingContext): Promise<ProcessingResult> {
//     try {
//       Logger.info("Processing with Voiceflow", { automationId: context.automation.id })

//       // Gather context data
//       const [historyResult, profileResult, businessResult] = await Promise.allSettled([
//         buildConversationContext(context.payload.pageId, context.payload.senderId, context.automation.id),
//         getBusinessProfileForAutomation(context.automation.id),
//         this.getBusinessVariables(context),
//       ])

//       const conversationHistory = historyResult.status === "fulfilled" ? historyResult.value : []
//       const profile = profileResult.status === "fulfilled" ? profileResult.value : { profileContent: "", businessContext: {} }
//       const businessVariables = businessResult.status === "fulfilled" ? businessResult.value : {}

//       // Create Voiceflow user (non-blocking)
//       createVoiceflowUser(context.userId).catch(error => 
//         Logger.warn("Voiceflow user creation failed", error)
//       )

//       // Get Voiceflow response
//       const voiceflowResult = await RetryManager.withRetry(
//         () => this.callVoiceflowAPI(context, businessVariables, conversationHistory.length === 0),
//         "Voiceflow API call"
//       )

//       if (!voiceflowResult.success || !voiceflowResult.response) {
//         throw new Error(`Voiceflow API failed: ${voiceflowResult.error}`)
//       }

//       // Extract customer data
//       const extractedData = this.extractCustomerData(voiceflowResult.variables)

//       // Process lead qualification (background)
//       this.processLeadQualification(context, extractedData)

//       return {
//         success: true,
//         data: {
//           text: voiceflowResult.response.text,
//           quickReplies: voiceflowResult.response.quickReplies,
//           buttons: voiceflowResult.response.buttons,
//           carousel: voiceflowResult.response.carousel,
//           attachment: voiceflowResult.response.attachment,
//           variables: voiceflowResult.variables,
//           extractedData,
//         },
//         aiSystem: "voiceflow",
//       }
//     } catch (error) {
//       Logger.error("Voiceflow processing failed", error)
//       return {
//         success: false,
//         error: `Voiceflow processing failed: ${(error as Error).message}`,
//       }
//     }
//   }

//   private static async getBusinessVariables(context: ProcessingContext): Promise<Record<string, string>> {
//     const business = await getBusinessByAutomationId(context.automation.id)
//     if (!business) {
//       throw new Error(`No business found for automation: ${context.automation.id}`)
//     }

//     return fetchEnhancedBusinessVariables(
//       business.id,
//       context.automation.id,
//       context.automation.businessWorkflowConfig?.id || null,
//       {
//         pageId: context.payload.pageId,
//         senderId: context.payload.senderId,
//         userMessage: context.payload.userMessage,
//         isNewUser: false, // Will be determined by conversation history
//         customerType: "NEW",
//         messageHistory: [],
//       }
//     )
//   }

//   private static async callVoiceflowAPI(
//     context: ProcessingContext,
//     businessVariables: Record<string, string>,
//     isFirstMessage: boolean
//   ): Promise<any> {
//     const voiceflowApiKey = process.env.VOICEFLOW_API_KEY
//     const voiceflowProjectId = process.env.VOICEFLOW_PROJECT_ID
//     const voiceflowVersionId = process.env.VOICEFLOW_VERSION_ID

//     if (!voiceflowApiKey || !voiceflowProjectId) {
//       throw new Error("Voiceflow credentials missing")
//     }

//     return TimeoutManager.withTimeout(
//       getEnhancedVoiceflowResponse(
//         context.payload.userMessage,
//         context.userId,
//         businessVariables,
//         voiceflowApiKey,
//         voiceflowProjectId,
//         voiceflowVersionId,
//         {
//           maxRetries: 1,
//           timeoutMs: CONFIG.TIMEOUTS.VOICEFLOW,
//           enableFallbackDetection: false,
//           isFirstMessage,
//         }
//       ),
//       CONFIG.TIMEOUTS.VOICEFLOW,
//       "Voiceflow API"
//     )
//   }

//   private static extractCustomerData(variables: any): { name?: string; email?: string; phone?: string } | undefined {
//     if (!variables) return undefined

//     const extractedData = {
//       name: variables.customer_name || variables.clientname || variables.name,
//       email: variables.customer_email || variables.clientemail || variables.email,
//       phone: variables.customer_phone || variables.clientphone || variables.phone,
//     }

//     return (extractedData.name || extractedData.email || extractedData.phone) ? extractedData : undefined
//   }

//   private static processLeadQualification(
//     context: ProcessingContext,
//     extractedData?: { name?: string; email?: string; phone?: string }
//   ): void {
//     // Process in background
//     setImmediate(async () => {
//       try {
//         if (!context.automation.User?.id) return

//         await analyzeLead({
//           userId: context.automation.User.id,
//           automationId: context.automation.id,
//           platformId: context.payload.pageId,
//           customerId: context.payload.senderId,
//           message: context.payload.userMessage,
//           messageType: context.payload.messageType,
//           timestamp: new Date(),
//         })

//         Logger.info("Lead qualification completed", { senderId: context.payload.senderId })
//       } catch (error) {
//         Logger.error("Lead qualification failed", error)
//       }
//     })
//   }
// }

// class GeminiProcessor {
//   static async process(context: ProcessingContext): Promise<ProcessingResult> {
//     try {
//       Logger.info("Processing with Gemini", { automationId: context.automation.id })

//       // Gather context
//       const [profileResult, historyResult] = await Promise.allSettled([
//         getBusinessProfileForAutomation(context.automation.id),
//         buildConversationContext(context.payload.pageId, context.payload.senderId, context.automation.id),
//       ])

//       const profile = profileResult.status === "fulfilled" ? profileResult.value : { profileContent: "", businessContext: {} }
//       const history = historyResult.status === "fulfilled" ? historyResult.value : []

//       // Generate response
//       const response = await RetryManager.withRetry(
//         () => TimeoutManager.withTimeout(
//           generateGeminiResponse({
//             automationId: context.automation.id, // ADD THIS LINE
//             userMessage: context.payload.userMessage,
//             businessProfile: profile.profileContent,
//             conversationHistory: history,
//             businessContext: profile.businessContext,
//             isPROUser: false,
//           }),
//           CONFIG.TIMEOUTS.GEMINI,
//           "Gemini API"
//         ),
//         "Gemini processing"
//       )

//       const responseText = typeof response === "string" ? response : ""
//       if (!responseText.trim()) {
//         throw new Error("Gemini returned empty response")
//       }

//       return {
//         success: true,
//         data: { text: responseText },
//         aiSystem: "gemini",
//       }
//     } catch (error) {
//       Logger.error("Gemini processing failed", error)
//       return {
//         success: false,
//         error: `Gemini processing failed: ${(error as Error).message}`,
//       }
//     }
//   }
// }
// // class GeminiProcessor {
// //   static async process(context: ProcessingContext): Promise<ProcessingResult> {
// //     try {
// //       Logger.info("Processing with Gemini", { automationId: context.automation.id })

// //       // Gather context
// //       const [profileResult, historyResult] = await Promise.allSettled([
// //         getBusinessProfileForAutomation(context.automation.id),
// //         buildConversationContext(context.payload.pageId, context.payload.senderId, context.automation.id),
// //       ])

// //       const profile = profileResult.status === "fulfilled" ? profileResult.value : { profileContent: "", businessContext: {} }
// //       const history = historyResult.status === "fulfilled" ? historyResult.value : []

// //       // Generate response
// //       const response = await RetryManager.withRetry(
// //         () => TimeoutManager.withTimeout(
// //           generateGeminiResponse({
// //             userMessage: context.payload.userMessage,
// //             businessProfile: profile.profileContent,
// //             conversationHistory: history,
// //             businessContext: profile.businessContext,
// //             isPROUser: false,
// //           }),
// //           CONFIG.TIMEOUTS.GEMINI,
// //           "Gemini API"
// //         ),
// //         "Gemini processing"
// //       )

// //       const responseText = typeof response === "string" ? response : ""
// //       if (!responseText.trim()) {
// //         throw new Error("Gemini returned empty response")
// //       }

// //       return {
// //         success: true,
// //         data: { text: responseText },
// //         aiSystem: "gemini",
// //       }
// //     } catch (error) {
// //       Logger.error("Gemini processing failed", error)
// //       return {
// //         success: false,
// //         error: `Gemini processing failed: ${(error as Error).message}`,
// //       }
// //     }
// //   }
// // }

// // ============================================================================
// // RESPONSE SENDER
// // ============================================================================

// class ResponseSender {
//   static async send(context: ProcessingContext, result: ProcessingResult): Promise<void> {
//     if (!result.success || !result.data?.text) {
//       throw new Error("Cannot send invalid response")
//     }

//     const { text, quickReplies, buttons, carousel, attachment } = result.data

//     // Check for duplicate response
//     const isDuplicate = await checkDuplicateResponse(
//       context.payload.pageId,
//       context.payload.senderId,
//       text,
//       context.payload.messageType
//     )

//     if (isDuplicate) {
//       Logger.warn("Duplicate response blocked", { text: text.substring(0, 50) })
//       return
//     }

//     const token = context.automation.User?.integrations?.[0]?.token || process.env.DEFAULT_PAGE_TOKEN

//     try {
//       let sendResult

//       if (context.payload.messageType === "DM") {
//         // Transform to Instagram format
//         const instagramMessage = transformVoiceflowToInstagram({ 
//           text, 
//           quickReplies, 
//           buttons, 
//           carousel, 
//           attachment 
//         })
        
//         sendResult = await TimeoutManager.withTimeout(
//           sendDMs(
//             context.payload.pageId,
//             context.payload.senderId,
//             instagramMessage as any,
//             token,
//             "DM"
//           ),
//           10000,
//           "Send DM"
//         )
//       } else if (context.payload.messageType === "COMMENT" && context.payload.commentId) {
//         sendResult = await TimeoutManager.withTimeout(
//           sendPrivateMessages(
//             context.payload.pageId,
//             context.payload.commentId,
//             text,
//             token,
//             quickReplies,
//             buttons,
//             carousel,
//             attachment
//           ),
//           10000,
//           "Send comment reply"
//         )
//       }

//       if (sendResult?.status !== 200) {
//         throw new Error(`Send failed with status: ${sendResult?.status}`)
//       }

//       // Mark as sent
//       await markResponseAsSent(
//         context.payload.pageId,
//         context.payload.senderId,
//         text,
//         context.payload.messageType,
//         context.automation.id
//       )

//       Logger.info("Response sent successfully", { 
//         messageType: context.payload.messageType,
//         length: text.length 
//       })

//     } catch (error) {
//       Logger.error("Failed to send response", error)
//       throw error
//     }
//   }
// }

// // ============================================================================
// // BACKGROUND PROCESSOR
// // ============================================================================

// class BackgroundProcessor {
//   static process(context: ProcessingContext, result: ProcessingResult): void {
//     const tasks = [
//       // Store conversation messages
//       storeConversationMessage(
//         context.payload.pageId,
//         context.payload.senderId,
//         context.payload.userMessage,
//         false,
//         context.automation.id
//       ),
//       storeConversationMessage(
//         context.payload.pageId,
//         "bot",
//         result.data?.text || "",
//         true,
//         context.automation.id
//       ),
      
//       // Track analytics
//       trackResponses(context.automation.id, context.payload.messageType),
//       createChatHistory(
//         context.automation.id,
//         context.payload.pageId,
//         context.payload.senderId,
//         context.payload.userMessage
//       ),
//       createChatHistory(
//         context.automation.id,
//         context.payload.pageId,
//         context.payload.senderId,
//         result.data?.text || ""
//       ),

//       // Update conversation state
//       updateConversationState(context.userId, {
//         isActive: true,
//         lastTriggerType: context.triggerDecision.triggerType,
//         lastTriggerReason: context.triggerDecision.reason,
//         automationId: context.automation.id,
//         listenMode: context.triggerDecision.triggerType === "KEYWORD" ? "KEYWORDS" : "ALL_MESSAGES",
//         lastMessageLength: context.payload.userMessage.length,
//       }),

//       // Track sentiment
//       context.automation.id ? trackMessageForSentiment(
//         context.automation.id,
//         context.payload.pageId,
//         context.payload.senderId,
//         context.payload.userMessage
//       ) : Promise.resolve(),

//       // Log trigger execution
//       context.triggerDecision.triggerId ? logTriggerExecution({
//         triggerId: context.triggerDecision.triggerId,
//         automationId: context.automation.id,
//         userId: context.automation.User?.id,
//         messageContent: context.payload.userMessage,
//         triggerType: context.triggerDecision.triggerType,
//         confidence: context.triggerDecision.confidence,
//         reason: context.triggerDecision.reason,
//         success: result.success,
//         responseTime: Date.now() - context.startTime,
//       }) : Promise.resolve(),
//     ]

//     Promise.allSettled(tasks)
//       .then(results => {
//         const failed = results.filter(r => r.status === "rejected").length
//         if (failed === 0) {
//           Logger.info("All background tasks completed")
//         } else {
//           Logger.warn(`${failed} background tasks failed`)
//         }
//       })
//       .catch(error => Logger.error("Background processing error", error))
//   }
// }

// // ============================================================================
// // MAIN MESSAGE PROCESSOR
// // ============================================================================

// class MessageProcessor {
//   static async process(payload: WebhookPayload, startTime: number): Promise<void> {
//     const messageKey = DuplicateGuard.generateMessageKey(payload)
    
//     Logger.info("Processing message", {
//       messageType: payload.messageType,
//       senderId: payload.senderId,
//       messageLength: payload.userMessage.length
//     })

//     try {
//       // Duplicate prevention
//       if (await DuplicateGuard.isDuplicate(payload, messageKey)) {
//         return
//       }

//       // Rate limiting
//       if (!await RateLimiter.checkLimit(payload)) {
//         return
//       }

//       // Mark as processed
//       await markMessageAsProcessed(messageKey)

//       // Build processing context
//       const context = await this.buildContext(payload, messageKey, startTime)
//       if (!context) {
//         Logger.warn("Failed to build processing context")
//         return
//       }

//       // Process with timeout
//       await TimeoutManager.withTimeout(
//         this.processMessage(context),
//         CONFIG.TIMEOUTS.TOTAL_PROCESSING,
//         "Total message processing"
//       )

//       Logger.info("Message processed successfully", {
//         duration: Date.now() - startTime,
//         automation: context.automation.id
//       })

//     } catch (error) {
//       Logger.error("Message processing failed", error)
//       throw error
//     } finally {
//       DuplicateGuard.finishProcessing(payload)
//     }
//   }

//   private static async buildContext(
//     payload: WebhookPayload,
//     messageKey: string,
//     startTime: number
//   ): Promise<ProcessingContext | null> {
//     try {
//       // Decide trigger action
//       const triggerDecision = await decideTriggerAction(
//         payload.pageId,
//         payload.senderId,
//         payload.userMessage,
//         payload.messageType
//       )

//       let automation = null

//       if (triggerDecision.triggerType === "NO_MATCH") {
//         // Get or create default automation
//         automation = await getOrCreateDefaultAutomation("INSTAGRAM")
//         if (!automation) {
//           Logger.warn("No default automation available")
//           return null
//         }
//       } else {
//         // Get specific automation
//         automation = await getAutomationWithTriggers(
//           triggerDecision.automationId!,
//           payload.messageType
//         )
        
//         if (!automation) {
//           Logger.warn(`Automation not found: ${triggerDecision.automationId}`)
//           // Fallback to default
//           automation = await getOrCreateDefaultAutomation("INSTAGRAM")
//           if (!automation) return null
//         }
//       }

//       return {
//         payload,
//         automation,
//         userId: `${payload.pageId}_${payload.senderId}`,
//         triggerDecision,
//         startTime,
//         messageKey,
//       }
//     } catch (error) {
//       Logger.error("Failed to build context", error)
//       return null
//     }
//   }

//   private static async processMessage(context: ProcessingContext): Promise<void> {
//     const isPROUser = context.automation.User?.subscription?.plan === "PRO"
    
//     let result: ProcessingResult

//     // Process with appropriate AI system
//     if (isPROUser) {
//       result = await VoiceflowProcessor.process(context)
      
//       // Fallback to Gemini if Voiceflow fails for PRO users
//       if (!result.success) {
//         Logger.warn("Voiceflow failed, falling back to Gemini")
//         result = await GeminiProcessor.process(context)
//       }
//     } else {
//       result = await GeminiProcessor.process(context)
//     }

//     if (!result.success) {
//       throw new Error(result.error || "AI processing failed")
//     }

//     // Send response
//     await ResponseSender.send(context, result)

//     // Process background tasks
//     BackgroundProcessor.process(context, result)
//   }
// }

// // ============================================================================
// // MAIN ROUTE HANDLERS
// // ============================================================================

// export async function GET(req: NextRequest): Promise<NextResponse> {
//   const challenge = req.nextUrl.searchParams.get("hub.challenge")
//   return new NextResponse(challenge)
// }

// export async function POST(req: NextRequest): Promise<NextResponse> {
//   const startTime = Date.now()
  
//   try {
//     const body = await req.json()
    
//     Logger.debug("Webhook received", { 
//       hasEntry: !!body?.entry?.length,
//       entryCount: body?.entry?.length || 0
//     })

//     // Handle special webhooks
//     const specialType = WebhookValidator.isSpecialWebhook(body)
    
//     if (specialType === "deauth") {
//       const signature = req.headers.get("x-hub-signature-256")
//       const bodyStr = JSON.stringify(body)
      
//       if (!signature || !verifyInstagramWebhook(signature, bodyStr, process.env.INSTAGRAM_CLIENT_SECRET!)) {
//         return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
//       }
      
//       const result = await handleInstagramDeauthWebhook(body)
//       return NextResponse.json(result, { status: result.status })
//     }

//     if (specialType === "data_deletion") {
//       const signature = req.headers.get("x-hub-signature-256")
//       const bodyStr = JSON.stringify(body)
      
//       if (!signature || !verifyInstagramWebhook(signature, bodyStr, process.env.INSTAGRAM_CLIENT_SECRET!)) {
//         return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
//       }
      
//       const result = await handleInstagramDataDeletionWebhook(body)
//       return NextResponse.json(result, { status: result.status })
//     }

//     if (specialType === "receipt") {
//       return NextResponse.json({ message: "Receipt acknowledged" }, { status: 200 })
//     }

//     // Extract and validate payload
//     const payload = WebhookValidator.extractPayload(body)
    
//     if (!payload) {
//       Logger.warn("Unsupported webhook payload or non-text message")
//       return NextResponse.json({ message: "Webhook acknowledged" }, { status: 200 })
//     }

//     // Skip echo messages
//     if (payload.isEcho) {
//       Logger.debug("Skipping echo message")
//       return NextResponse.json({ message: "Echo ignored" }, { status: 200 })
//     }

//     // Process message
//     await MessageProcessor.process(payload, startTime)

//     const processingTime = Date.now() - startTime
    
//     return NextResponse.json({
//       message: "Message processed successfully",
//       processingTime,
//       messageType: payload.messageType,
//       timestamp: new Date().toISOString()
//     }, { status: 200 })

//   } catch (error) {
//     const processingTime = Date.now() - startTime
//     Logger.error("Webhook processing error", {
//       error: (error as Error).message,
//       processingTime
//     })

//     return NextResponse.json({
//       message: "Error processing webhook",
//       error: (error as Error).message,
//       processingTime
//     }, { status: 500 })
//   }
// }











// import { type NextRequest, NextResponse } from "next/server"
// import {
//   decideTriggerAction,
//   checkProcessedMessage,
//   markMessageAsProcessed,
//   checkDuplicateResponse,
//   markResponseAsSent,
//   getRecentResponseCount,
//   trackResponses,
//   createChatHistory,
//   updateConversationState,
//   logTriggerExecution,
//   getAutomationWithTriggers,
// } from "@/actions/webhook/queries"
// import { getBusinessProfileForAutomation, getOrCreateDefaultAutomation } from "@/actions/webhook/business-profile"
// import { generateGeminiResponse, buildConversationContext } from "@/lib/gemini"
// import { createVoiceflowUser, fetchEnhancedBusinessVariables, getEnhancedVoiceflowResponse } from "@/lib/voiceflow"
// import { analyzeLead } from "@/lib/lead-qualification"
// import { sendPrivateMessages, transformVoiceflowToInstagram, replyToComment } from "@/lib/fetch"
// import { sendDMs } from "@/lib/voiceflow"
// import { storeConversationMessage } from "@/actions/chats/queries"
// import { handleInstagramDeauthWebhook, handleInstagramDataDeletionWebhook } from "@/lib/deauth"
// import { verifyInstagramWebhook } from "@/utils/instagram"
// import { trackMessageForSentiment } from "@/lib/sentiment-tracker"
// import { getBusinessByAutomationId } from "@/actions/businfo/queries"

// // ============================================================================
// // TYPES & INTERFACES
// // ============================================================================

// interface WebhookPayload {
//   pageId: string
//   senderId: string
//   recipientId?: string
//   userMessage: string
//   messageId?: string
//   commentId?: string
//   messageType: "DM" | "COMMENT"
//   isEcho?: boolean
// }

// interface ProcessingContext {
//   payload: WebhookPayload
//   automation: any
//   userId: string
//   triggerDecision: any
//   startTime: number
//   messageKey: string
// }

// interface ProcessingResult {
//   success: boolean
//   data?: {
//     text?: string
//     quickReplies?: any[]
//     buttons?: any[]
//     carousel?: any[]
//     attachment?: any
//     variables?: Record<string, any>
//     extractedData?: {
//       name?: string
//       email?: string
//       phone?: string
//     }
//   }
//   aiSystem?: string
//   error?: string
// }

// interface ServiceConfig {
//   TIMEOUTS: {
//     VOICEFLOW: number
//     GEMINI: number
//     TOTAL_PROCESSING: number
//   }
//   RATE_LIMITS: {
//     MAX_RESPONSES_PER_PERIOD: number
//     PERIOD_MINUTES: number
//     DUPLICATE_WINDOW_MS: number
//   }
//   RETRY: {
//     MAX_ATTEMPTS: number
//     BASE_DELAY: number
//     BACKOFF_FACTOR: number
//   }
// }

// // ============================================================================
// // CONFIGURATION
// // ============================================================================

// const CONFIG: ServiceConfig = {
//   TIMEOUTS: {
//     VOICEFLOW: 15000,
//     GEMINI: 10000,
//     TOTAL_PROCESSING: 25000,
//   },
//   RATE_LIMITS: {
//     MAX_RESPONSES_PER_PERIOD: 3,
//     PERIOD_MINUTES: 2,
//     DUPLICATE_WINDOW_MS: 8000,
//   },
//   RETRY: {
//     MAX_ATTEMPTS: 2,
//     BASE_DELAY: 1000,
//     BACKOFF_FACTOR: 2,
//   },
// }

// // ============================================================================
// // UTILITIES
// // ============================================================================

// class Logger {
//   private static formatMessage(level: string, message: string, data?: any): string {
//     const timestamp = new Date().toISOString()
//     const dataStr = data ? ` | ${JSON.stringify(data)}` : ""
//     return `[${timestamp}] ${level} ${message}${dataStr}`
//   }

//   static info(message: string, data?: any): void {
//     console.log(this.formatMessage("INFO", message, data))
//   }

//   static warn(message: string, data?: any): void {
//     console.warn(this.formatMessage("WARN", message, data))
//   }

//   static error(message: string, error?: any): void {
//     console.error(this.formatMessage("ERROR", message, error))
//   }

//   static debug(message: string, data?: any): void {
//     if (process.env.NODE_ENV === "development") {
//       console.log(this.formatMessage("DEBUG", message, data))
//     }
//   }
// }

// class TimeoutManager {
//   static async withTimeout<T>(promise: Promise<T>, timeoutMs: number, operationName: string): Promise<T> {
//     const timeoutPromise = new Promise<never>((_, reject) => {
//       setTimeout(() => {
//         reject(new Error(`Operation '${operationName}' timed out after ${timeoutMs}ms`))
//       }, timeoutMs)
//     })

//     return Promise.race([promise, timeoutPromise])
//   }
// }

// class RetryManager {
//   static async withRetry<T>(
//     operation: () => Promise<T>,
//     operationName: string,
//     maxAttempts: number = CONFIG.RETRY.MAX_ATTEMPTS,
//   ): Promise<T> {
//     let lastError: Error

//     for (let attempt = 1; attempt <= maxAttempts; attempt++) {
//       try {
//         const result = await operation()
//         if (attempt > 1) {
//           Logger.info(`Operation '${operationName}' succeeded on attempt ${attempt}`)
//         }
//         return result
//       } catch (error) {
//         lastError = error as Error
//         Logger.warn(`Operation '${operationName}' failed on attempt ${attempt}`, { error: lastError.message })

//         if (attempt < maxAttempts) {
//           const delay = CONFIG.RETRY.BASE_DELAY * Math.pow(CONFIG.RETRY.BACKOFF_FACTOR, attempt - 1)
//           await new Promise((resolve) => setTimeout(resolve, delay))
//         }
//       }
//     }

//     throw new Error(`Operation '${operationName}' failed after ${maxAttempts} attempts: ${lastError!.message}`)
//   }
// }

// // ============================================================================
// // WEBHOOK VALIDATOR
// // ============================================================================

// class WebhookValidator {
//   static extractPayload(body: any): WebhookPayload | null {
//     try {
//       // Handle messaging events (DMs and postbacks)
//       if (body?.entry?.[0]?.messaging) {
//         const messaging = body.entry[0].messaging[0]

//         // Skip read receipts and delivery confirmations
//         if (messaging.read || messaging.delivery) {
//           return null
//         }

//         // Handle regular messages
//         if (messaging.message) {
//           if (!messaging.message.text || messaging.message.is_echo) {
//             return null
//           }

//           return {
//             pageId: body.entry[0].id,
//             senderId: messaging.sender.id,
//             recipientId: messaging.recipient.id,
//             userMessage: messaging.message.text,
//             messageId: messaging.message.mid,
//             messageType: "DM",
//             isEcho: false,
//           }
//         }

//         // Handle postback events (button clicks)
//         if (messaging.postback) {
//           return {
//             pageId: body.entry[0].id,
//             senderId: messaging.sender.id,
//             recipientId: messaging.recipient.id,
//             userMessage: messaging.postback.payload || messaging.postback.title || "Button clicked",
//             messageId: `postback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
//             messageType: "DM",
//             isEcho: false,
//           }
//         }
//       }

//       // Handle comment events
//       if (body?.entry?.[0]?.changes?.[0]?.field === "comments") {
//         const changeValue = body.entry[0].changes[0].value

//         if (!changeValue.text) {
//           return null
//         }

//         return {
//           pageId: body.entry[0].id,
//           senderId: changeValue.from.id,
//           userMessage: changeValue.text,
//           commentId: changeValue.id,
//           messageType: "COMMENT",
//           isEcho: false,
//         }
//       }

//       return null
//     } catch (error) {
//       Logger.error("Failed to extract webhook payload", error)
//       return null
//     }
//   }

//   static isSpecialWebhook(body: any): "deauth" | "data_deletion" | "receipt" | null {
//     if (body?.object === "instagram") {
//       const field = body?.entry?.[0]?.changes?.[0]?.field
//       if (field === "deauthorizations") return "deauth"
//       if (field === "data_deletion") return "data_deletion"
//     }

//     if (body?.entry?.[0]?.messaging?.[0]) {
//       const messaging = body.entry[0].messaging[0]
//       if (messaging.read || messaging.delivery) return "receipt"
//     }

//     return null
//   }
// }

// // ============================================================================
// // DUPLICATE PREVENTION SYSTEM
// // ============================================================================

// class DuplicateGuard {
//   private static recentMessages = new Map<string, number>()
//   private static processingMessages = new Set<string>()

//   static generateMessageKey(payload: WebhookPayload): string {
//     const baseId = payload.messageId || payload.commentId || `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
//     const contentHash = payload.userMessage.substring(0, 50).replace(/\s+/g, "_")
//     return `${payload.pageId}_${payload.senderId}_${baseId}_${contentHash}_${payload.messageType}`
//   }

//   static async isDuplicate(payload: WebhookPayload, messageKey: string): Promise<boolean> {
//     const now = Date.now()

//     // Check in-memory recent messages
//     const duplicateKey = `${payload.pageId}_${payload.senderId}_${payload.userMessage}_${payload.messageType}`
//     const lastTime = this.recentMessages.get(duplicateKey)

//     if (lastTime && now - lastTime < CONFIG.RATE_LIMITS.DUPLICATE_WINDOW_MS) {
//       Logger.warn("Duplicate message blocked (in-memory)", { key: duplicateKey })
//       return true
//     }

//     // Check if currently processing
//     if (this.processingMessages.has(duplicateKey)) {
//       Logger.warn("Message already being processed", { key: duplicateKey })
//       return true
//     }

//     // Check database for processed messages
//     const dbDuplicate = await checkProcessedMessage(messageKey)
//     if (dbDuplicate) {
//       Logger.warn("Message already processed (database)", { key: messageKey })
//       return true
//     }

//     // Mark as processing and update recent messages
//     this.processingMessages.add(duplicateKey)
//     this.recentMessages.set(duplicateKey, now)

//     // Clean up old entries
//     this.cleanup()

//     return false
//   }

//   static finishProcessing(payload: WebhookPayload): void {
//     const duplicateKey = `${payload.pageId}_${payload.senderId}_${payload.userMessage}_${payload.messageType}`
//     this.processingMessages.delete(duplicateKey)
//   }

//   private static cleanup(): void {
//     const cutoff = Date.now() - CONFIG.RATE_LIMITS.DUPLICATE_WINDOW_MS * 2

//     for (const [key, timestamp] of this.recentMessages.entries()) {
//       if (timestamp < cutoff) {
//         this.recentMessages.delete(key)
//       }
//     }
//   }
// }

// // ============================================================================
// // RATE LIMITER
// // ============================================================================

// class RateLimiter {
//   static async checkLimit(payload: WebhookPayload): Promise<boolean> {
//     try {
//       const count = await getRecentResponseCount(
//         payload.pageId,
//         payload.senderId,
//         payload.messageType,
//         CONFIG.RATE_LIMITS.PERIOD_MINUTES,
//       )

//       if (count >= CONFIG.RATE_LIMITS.MAX_RESPONSES_PER_PERIOD) {
//         Logger.warn("Rate limit exceeded", {
//           pageId: payload.pageId,
//           senderId: payload.senderId,
//           count,
//           limit: CONFIG.RATE_LIMITS.MAX_RESPONSES_PER_PERIOD,
//         })
//         return false
//       }

//       return true
//     } catch (error) {
//       Logger.error("Error checking rate limit", error)
//       return true // Allow on error
//     }
//   }
// }

// // ============================================================================
// // AI PROCESSING HANDLERS
// // ============================================================================

// class VoiceflowProcessor {
//   static async process(context: ProcessingContext): Promise<ProcessingResult> {
//     try {
//       Logger.info("Processing with Voiceflow", { automationId: context.automation.id })

//       // Gather context data
//       const [historyResult, profileResult, businessResult] = await Promise.allSettled([
//         buildConversationContext(context.payload.pageId, context.payload.senderId, context.automation.id),
//         getBusinessProfileForAutomation(context.automation.id),
//         this.getBusinessVariables(context),
//       ])

//       const conversationHistory = historyResult.status === "fulfilled" ? historyResult.value : []
//       const profile =
//         profileResult.status === "fulfilled" ? profileResult.value : { profileContent: "", businessContext: {} }
//       const businessVariables = businessResult.status === "fulfilled" ? businessResult.value : {}

//       // Create Voiceflow user (non-blocking)
//       createVoiceflowUser(context.userId).catch((error) => Logger.warn("Voiceflow user creation failed", error))

//       // Get Voiceflow response
//       const voiceflowResult = await RetryManager.withRetry(
//         () => this.callVoiceflowAPI(context, businessVariables, conversationHistory.length === 0),
//         "Voiceflow API call",
//       )

//       if (!voiceflowResult.success || !voiceflowResult.response) {
//         throw new Error(`Voiceflow API failed: ${voiceflowResult.error}`)
//       }

//       // Extract customer data
//       const extractedData = this.extractCustomerData(voiceflowResult.variables)

//       // Process lead qualification (background)
//       this.processLeadQualification(context, extractedData)

//       return {
//         success: true,
//         data: {
//           text: voiceflowResult.response.text,
//           quickReplies: voiceflowResult.response.quickReplies,
//           buttons: voiceflowResult.response.buttons,
//           carousel: voiceflowResult.response.carousel,
//           attachment: voiceflowResult.response.attachment,
//           variables: voiceflowResult.variables,
//           extractedData,
//         },
//         aiSystem: "voiceflow",
//       }
//     } catch (error) {
//       Logger.error("Voiceflow processing failed", error)
//       return {
//         success: false,
//         error: `Voiceflow processing failed: ${(error as Error).message}`,
//       }
//     }
//   }

//   private static async getBusinessVariables(context: ProcessingContext): Promise<Record<string, string>> {
//     const business = await getBusinessByAutomationId(context.automation.id)
//     if (!business) {
//       throw new Error(`No business found for automation: ${context.automation.id}`)
//     }

//     return fetchEnhancedBusinessVariables(
//       business.id,
//       context.automation.id,
//       context.automation.businessWorkflowConfig?.id || null,
//       {
//         pageId: context.payload.pageId,
//         senderId: context.payload.senderId,
//         userMessage: context.payload.userMessage,
//         isNewUser: false, // Will be determined by conversation history
//         customerType: "NEW",
//         messageHistory: [],
//       },
//     )
//   }

//   private static async callVoiceflowAPI(
//     context: ProcessingContext,
//     businessVariables: Record<string, string>,
//     isFirstMessage: boolean,
//   ): Promise<any> {
//     const voiceflowApiKey = process.env.VOICEFLOW_API_KEY
//     const voiceflowProjectId = process.env.VOICEFLOW_PROJECT_ID
//     const voiceflowVersionId = process.env.VOICEFLOW_VERSION_ID

//     if (!voiceflowApiKey || !voiceflowProjectId) {
//       throw new Error("Voiceflow credentials missing")
//     }

//     return TimeoutManager.withTimeout(
//       getEnhancedVoiceflowResponse(
//         context.payload.userMessage,
//         context.userId,
//         businessVariables,
//         voiceflowApiKey,
//         voiceflowProjectId,
//         voiceflowVersionId,
//         {
//           maxRetries: 1,
//           timeoutMs: CONFIG.TIMEOUTS.VOICEFLOW,
//           enableFallbackDetection: false,
//           isFirstMessage,
//         },
//       ),
//       CONFIG.TIMEOUTS.VOICEFLOW,
//       "Voiceflow API",
//     )
//   }

//   private static extractCustomerData(variables: any): { name?: string; email?: string; phone?: string } | undefined {
//     if (!variables) return undefined

//     const extractedData = {
//       name: variables.customer_name || variables.clientname || variables.name,
//       email: variables.customer_email || variables.clientemail || variables.email,
//       phone: variables.customer_phone || variables.clientphone || variables.phone,
//     }

//     return extractedData.name || extractedData.email || extractedData.phone ? extractedData : undefined
//   }

//   private static processLeadQualification(
//     context: ProcessingContext,
//     extractedData?: { name?: string; email?: string; phone?: string },
//   ): void {
//     // Process in background
//     setImmediate(async () => {
//       try {
//         if (!context.automation.User?.id) return

//         await analyzeLead({
//           userId: context.automation.User.id,
//           automationId: context.automation.id,
//           platformId: context.payload.pageId,
//           customerId: context.payload.senderId,
//           message: context.payload.userMessage,
//           messageType: context.payload.messageType,
//           timestamp: new Date(),
//         })

//         Logger.info("Lead qualification completed", { senderId: context.payload.senderId })
//       } catch (error) {
//         Logger.error("Lead qualification failed", error)
//       }
//     })
//   }
// }

// class GeminiProcessor {
//   static async process(context: ProcessingContext): Promise<ProcessingResult> {
//     try {
//       Logger.info("Processing with Gemini", { automationId: context.automation.id })

//       // Gather context
//       const [profileResult, historyResult] = await Promise.allSettled([
//         getBusinessProfileForAutomation(context.automation.id),
//         buildConversationContext(context.payload.pageId, context.payload.senderId, context.automation.id),
//       ])

//       const profile =
//         profileResult.status === "fulfilled" ? profileResult.value : { profileContent: "", businessContext: {} }
//       const history = historyResult.status === "fulfilled" ? historyResult.value : []

//       // Generate response
//       const response = await RetryManager.withRetry(
//         () =>
//           TimeoutManager.withTimeout(
//             generateGeminiResponse({
//               automationId: context.automation.id, // ADD THIS LINE
//               userMessage: context.payload.userMessage,
//               businessProfile: profile.profileContent,
//               conversationHistory: history,
//               businessContext: profile.businessContext,
//               isPROUser: false,
//             }),
//             CONFIG.TIMEOUTS.GEMINI,
//             "Gemini API",
//           ),
//         "Gemini processing",
//       )

//       const responseText = typeof response === "string" ? response : ""
//       if (!responseText.trim()) {
//         throw new Error("Gemini returned empty response")
//       }

//       return {
//         success: true,
//         data: { text: responseText },
//         aiSystem: "gemini",
//       }
//     } catch (error) {
//       Logger.error("Gemini processing failed", error)
//       return {
//         success: false,
//         error: `Gemini processing failed: ${(error as Error).message}`,
//       }
//     }
//   }
// }

// // ============================================================================
// // RESPONSE SENDER
// // ============================================================================

// class ResponseSender {
//   static async send(context: ProcessingContext, result: ProcessingResult): Promise<void> {
//     if (!result.success || !result.data?.text) {
//       throw new Error("Cannot send invalid response")
//     }

//     const { text, quickReplies, buttons, carousel, attachment } = result.data

//     // Check for duplicate response
//     const isDuplicate = await checkDuplicateResponse(
//       context.payload.pageId,
//       context.payload.senderId,
//       text,
//       context.payload.messageType,
//     )

//     if (isDuplicate) {
//       Logger.warn("Duplicate response blocked", { text: text.substring(0, 50) })
//       return
//     }

//     const token = context.automation.User?.integrations?.[0]?.token || process.env.DEFAULT_PAGE_TOKEN

//     try {
//       let sendResult

//       if (context.payload.messageType === "DM") {
//         // Transform to Instagram format
//         const instagramMessage = transformVoiceflowToInstagram({
//           text,
//           quickReplies,
//           buttons,
//           carousel,
//           attachment,
//         })

//         sendResult = await TimeoutManager.withTimeout(
//           sendDMs(context.payload.pageId, context.payload.senderId, instagramMessage as any, token, "DM"),
//           10000,
//           "Send DM",
//         )
//       } else if (context.payload.messageType === "COMMENT" && context.payload.commentId) {
//         console.log("[v0] Processing COMMENT - sending DM and public reply")
//         console.log("[v0] Automation listener data:", context.automation.listener)

//         // 1. Send the private DM with the AI response
//         const dmResult = await TimeoutManager.withTimeout(
//           sendPrivateMessages(
//             context.payload.pageId,
//             context.payload.commentId,
//             text,
//             token,
//             quickReplies,
//             buttons,
//             carousel,
//             attachment,
//           ),
//           10000,
//           "Send comment DM",
//         )

//         console.log("[v0] DM sent, status:", dmResult?.status)

//         const replyText = context.automation.listener?.commentReply

//         if (replyText && replyText.trim()) {
//           console.log("[v0] Posting public comment reply:", replyText)

//           const commentReplyResult = await TimeoutManager.withTimeout(
//             replyToComment(context.payload.commentId, replyText, token),
//             10000,
//             "Post public comment reply",
//           )

//           console.log("[v0] Public comment reply posted, status:", commentReplyResult?.status)
//         } else {
//           console.log("[v0] No reply text configured, skipping public comment reply")
//         }

//         sendResult = dmResult
//       }

//       if (sendResult?.status !== 200) {
//         throw new Error(`Send failed with status: ${sendResult?.status}`)
//       }

//       // Mark as sent
//       await markResponseAsSent(
//         context.payload.pageId,
//         context.payload.senderId,
//         text,
//         context.payload.messageType,
//         context.automation.id,
//       )

//       Logger.info("Response sent successfully", {
//         messageType: context.payload.messageType,
//         length: text.length,
//       })
//     } catch (error) {
//       Logger.error("Failed to send response", error)
//       throw error
//     }
//   }
// }

// // ============================================================================
// // BACKGROUND PROCESSOR
// // ============================================================================

// class BackgroundProcessor {
//   static process(context: ProcessingContext, result: ProcessingResult): void {
//     const tasks = [
//       // Store conversation messages
//       storeConversationMessage(
//         context.payload.pageId,
//         context.payload.senderId,
//         context.payload.userMessage,
//         false,
//         context.automation.id,
//       ),
//       storeConversationMessage(context.payload.pageId, "bot", result.data?.text || "", true, context.automation.id),

//       // Track analytics
//       trackResponses(context.automation.id, context.payload.messageType),
//       createChatHistory(
//         context.automation.id,
//         context.payload.pageId,
//         context.payload.senderId,
//         context.payload.userMessage,
//       ),
//       createChatHistory(
//         context.automation.id,
//         context.payload.pageId,
//         context.payload.senderId,
//         result.data?.text || "",
//       ),

//       // Update conversation state
//       updateConversationState(context.userId, {
//         isActive: true,
//         lastTriggerType: context.triggerDecision.triggerType,
//         lastTriggerReason: context.triggerDecision.reason,
//         automationId: context.automation.id,
//         listenMode: context.triggerDecision.triggerType === "KEYWORD" ? "KEYWORDS" : "ALL_MESSAGES",
//         lastMessageLength: context.payload.userMessage.length,
//       }),

//       // Track sentiment
//       context.automation.id
//         ? trackMessageForSentiment(
//             context.automation.id,
//             context.payload.pageId,
//             context.payload.senderId,
//             context.payload.userMessage,
//           )
//         : Promise.resolve(),

//       // Log trigger execution
//       context.triggerDecision.triggerId
//         ? logTriggerExecution({
//             triggerId: context.triggerDecision.triggerId,
//             automationId: context.automation.id,
//             userId: context.automation.User?.id,
//             messageContent: context.payload.userMessage,
//             triggerType: context.triggerDecision.triggerType,
//             confidence: context.triggerDecision.confidence,
//             reason: context.triggerDecision.reason,
//             success: result.success,
//             responseTime: Date.now() - context.startTime,
//           })
//         : Promise.resolve(),
//     ]

//     Promise.allSettled(tasks)
//       .then((results) => {
//         const failed = results.filter((r) => r.status === "rejected").length
//         if (failed === 0) {
//           Logger.info("All background tasks completed")
//         } else {
//           Logger.warn(`${failed} background tasks failed`)
//         }
//       })
//       .catch((error) => Logger.error("Background processing error", error))
//   }
// }

// // ============================================================================
// // MAIN MESSAGE PROCESSOR
// // ============================================================================

// class MessageProcessor {
//   static async process(payload: WebhookPayload, startTime: number): Promise<void> {
//     const messageKey = DuplicateGuard.generateMessageKey(payload)

//     Logger.info("Processing message", {
//       messageType: payload.messageType,
//       senderId: payload.senderId,
//       messageLength: payload.userMessage.length,
//     })

//     try {
//       // Duplicate prevention
//       if (await DuplicateGuard.isDuplicate(payload, messageKey)) {
//         return
//       }

//       // Rate limiting
//       if (!(await RateLimiter.checkLimit(payload))) {
//         return
//       }

//       // Mark as processed
//       await markMessageAsProcessed(messageKey)

//       // Build processing context
//       const context = await this.buildContext(payload, messageKey, startTime)
//       if (!context) {
//         Logger.warn("Failed to build processing context")
//         return
//       }

//       // Process with timeout
//       await TimeoutManager.withTimeout(
//         this.processMessage(context),
//         CONFIG.TIMEOUTS.TOTAL_PROCESSING,
//         "Total message processing",
//       )

//       Logger.info("Message processed successfully", {
//         duration: Date.now() - startTime,
//         automation: context.automation.id,
//       })
//     } catch (error) {
//       Logger.error("Message processing failed", error)
//       throw error
//     } finally {
//       DuplicateGuard.finishProcessing(payload)
//     }
//   }

//   private static async buildContext(
//     payload: WebhookPayload,
//     messageKey: string,
//     startTime: number,
//   ): Promise<ProcessingContext | null> {
//     try {
//       // Decide trigger action
//       const triggerDecision = await decideTriggerAction(
//         payload.pageId,
//         payload.senderId,
//         payload.userMessage,
//         payload.messageType,
//       )

//       let automation = null

//       if (triggerDecision.triggerType === "NO_MATCH") {
//         // Get or create default automation
//         automation = await getOrCreateDefaultAutomation("INSTAGRAM")
//         if (!automation) {
//           Logger.warn("No default automation available")
//           return null
//         }
//       } else {
//         // Get specific automation
//         automation = await getAutomationWithTriggers(triggerDecision.automationId!, payload.messageType)

//         if (!automation) {
//           Logger.warn(`Automation not found: ${triggerDecision.automationId}`)
//           // Fallback to default
//           automation = await getOrCreateDefaultAutomation("INSTAGRAM")
//           if (!automation) return null
//         }
//       }

//       return {
//         payload,
//         automation,
//         userId: `${payload.pageId}_${payload.senderId}`,
//         triggerDecision,
//         startTime,
//         messageKey,
//       }
//     } catch (error) {
//       Logger.error("Failed to build context", error)
//       return null
//     }
//   }

//   private static async processMessage(context: ProcessingContext): Promise<void> {
//     const isPROUser = context.automation.User?.subscription?.plan === "PRO"

//     let result: ProcessingResult

//     // Process with appropriate AI system
//     if (isPROUser) {
//       result = await VoiceflowProcessor.process(context)

//       // Fallback to Gemini if Voiceflow fails for PRO users
//       if (!result.success) {
//         Logger.warn("Voiceflow failed, falling back to Gemini")
//         result = await GeminiProcessor.process(context)
//       }
//     } else {
//       result = await GeminiProcessor.process(context)
//     }

//     if (!result.success) {
//       throw new Error(result.error || "AI processing failed")
//     }

//     // Send response
//     await ResponseSender.send(context, result)

//     // Process background tasks
//     BackgroundProcessor.process(context, result)
//   }
// }

// // ============================================================================
// // MAIN ROUTE HANDLERS
// // ============================================================================

// export async function GET(req: NextRequest): Promise<NextResponse> {
//   const challenge = req.nextUrl.searchParams.get("hub.challenge")
//   return new NextResponse(challenge)
// }

// export async function POST(req: NextRequest): Promise<NextResponse> {
//   const startTime = Date.now()

//   try {
//     const body = await req.json()

//     Logger.debug("Webhook received", {
//       hasEntry: !!body?.entry?.length,
//       entryCount: body?.entry?.length || 0,
//     })

//     // Handle special webhooks
//     const specialType = WebhookValidator.isSpecialWebhook(body)

//     if (specialType === "deauth") {
//       const signature = req.headers.get("x-hub-signature-256")
//       const bodyStr = JSON.stringify(body)

//       if (!signature || !verifyInstagramWebhook(signature, bodyStr, process.env.INSTAGRAM_CLIENT_SECRET!)) {
//         return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
//       }

//       const result = await handleInstagramDeauthWebhook(body)
//       return NextResponse.json(result, { status: result.status })
//     }

//     if (specialType === "data_deletion") {
//       const signature = req.headers.get("x-hub-signature-256")
//       const bodyStr = JSON.stringify(body)

//       if (!signature || !verifyInstagramWebhook(signature, bodyStr, process.env.INSTAGRAM_CLIENT_SECRET!)) {
//         return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
//       }

//       const result = await handleInstagramDataDeletionWebhook(body)
//       return NextResponse.json(result, { status: result.status })
//     }

//     if (specialType === "receipt") {
//       return NextResponse.json({ message: "Receipt acknowledged" }, { status: 200 })
//     }

//     // Extract and validate payload
//     const payload = WebhookValidator.extractPayload(body)

//     if (!payload) {
//       Logger.warn("Unsupported webhook payload or non-text message")
//       return NextResponse.json({ message: "Webhook acknowledged" }, { status: 200 })
//     }

//     // Skip echo messages
//     if (payload.isEcho) {
//       Logger.debug("Skipping echo message")
//       return NextResponse.json({ message: "Echo ignored" }, { status: 200 })
//     }

//     // Process message
//     await MessageProcessor.process(payload, startTime)

//     const processingTime = Date.now() - startTime

//     return NextResponse.json(
//       {
//         message: "Message processed successfully",
//         processingTime,
//         messageType: payload.messageType,
//         timestamp: new Date().toISOString(),
//       },
//       { status: 200 },
//     )
//   } catch (error) {
//     const processingTime = Date.now() - startTime
//     Logger.error("Webhook processing error", {
//       error: (error as Error).message,
//       processingTime,
//     })

//     return NextResponse.json(
//       {
//         message: "Error processing webhook",
//         error: (error as Error).message,
//         processingTime,
//       },
//       { status: 500 },
//     )
//   }
// }










import { type NextRequest, NextResponse } from "next/server"
import {
  decideTriggerAction,
  checkProcessedMessage,
  markMessageAsProcessed,
  checkDuplicateResponse,
  markResponseAsSent,
  getRecentResponseCount,
  trackResponses,
  createChatHistory,
  updateConversationState,
  logTriggerExecution,
  getAutomationWithTriggers,
} from "@/actions/webhook/queries"
import { getBusinessProfileForAutomation, getOrCreateDefaultAutomation } from "@/actions/webhook/business-profile"
import { generateGeminiResponse, buildConversationContext } from "@/lib/gemini"
import { createVoiceflowUser, fetchEnhancedBusinessVariables, getEnhancedVoiceflowResponse } from "@/lib/voiceflow"
import { analyzeLead } from "@/lib/lead-qualification"
import {
  sendDMs,
  sendPrivateMessages,
  replyToComment,
  getInstagramUsername,
  generateHumanCommentReply,
  selectCommentReplyVariation,
} from "@/lib/fetch"
import { storeConversationMessage } from "@/actions/chats/queries"
import { handleInstagramDeauthWebhook, handleInstagramDataDeletionWebhook } from "@/lib/deauth"
import { verifyInstagramWebhook } from "@/utils/instagram"
import { trackMessageForSentiment } from "@/lib/sentiment-tracker"
import { getBusinessByAutomationId } from "@/actions/businfo/queries"
import { transformVoiceflowToInstagram } from "@/utils/transformers" // Declare the variable here

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface WebhookPayload {
  pageId: string
  senderId: string
  recipientId?: string
  userMessage: string
  messageId?: string
  commentId?: string
  messageType: "DM" | "COMMENT"
  isEcho?: boolean
}

interface ProcessingContext {
  payload: WebhookPayload
  automation: any
  userId: string
  triggerDecision: any
  startTime: number
  messageKey: string
}

interface ProcessingResult {
  success: boolean
  data?: {
    text?: string
    quickReplies?: any[]
    buttons?: any[]
    carousel?: any[]
    attachment?: any
    variables?: Record<string, any>
    extractedData?: {
      name?: string
      email?: string
      phone?: string
    }
  }
  aiSystem?: string
  error?: string
}

interface ServiceConfig {
  TIMEOUTS: {
    VOICEFLOW: number
    GEMINI: number
    TOTAL_PROCESSING: number
  }
  RATE_LIMITS: {
    MAX_RESPONSES_PER_PERIOD: number
    PERIOD_MINUTES: number
    DUPLICATE_WINDOW_MS: number
  }
  RETRY: {
    MAX_ATTEMPTS: number
    BASE_DELAY: number
    BACKOFF_FACTOR: number
  }
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG: ServiceConfig = {
  TIMEOUTS: {
    VOICEFLOW: 15000,
    GEMINI: 10000,
    TOTAL_PROCESSING: 25000,
  },
  RATE_LIMITS: {
    MAX_RESPONSES_PER_PERIOD: 3,
    PERIOD_MINUTES: 2,
    DUPLICATE_WINDOW_MS: 8000,
  },
  RETRY: {
    MAX_ATTEMPTS: 2,
    BASE_DELAY: 1000,
    BACKOFF_FACTOR: 2,
  },
}

// ============================================================================
// UTILITIES
// ============================================================================

class Logger {
  private static formatMessage(level: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString()
    const dataStr = data ? ` | ${JSON.stringify(data)}` : ""
    return `[${timestamp}] ${level} ${message}${dataStr}`
  }

  static info(message: string, data?: any): void {
    console.log(this.formatMessage("INFO", message, data))
  }

  static warn(message: string, data?: any): void {
    console.warn(this.formatMessage("WARN", message, data))
  }

  static error(message: string, error?: any): void {
    console.error(this.formatMessage("ERROR", message, error))
  }

  static debug(message: string, data?: any): void {
    if (process.env.NODE_ENV === "development") {
      console.log(this.formatMessage("DEBUG", message, data))
    }
  }
}

class TimeoutManager {
  static async withTimeout<T>(promise: Promise<T>, timeoutMs: number, operationName: string): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Operation '${operationName}' timed out after ${timeoutMs}ms`))
      }, timeoutMs)
    })

    return Promise.race([promise, timeoutPromise])
  }
}

class RetryManager {
  static async withRetry<T>(
    operation: () => Promise<T>,
    operationName: string,
    maxAttempts: number = CONFIG.RETRY.MAX_ATTEMPTS,
  ): Promise<T> {
    let lastError: Error

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const result = await operation()
        if (attempt > 1) {
          Logger.info(`Operation '${operationName}' succeeded on attempt ${attempt}`)
        }
        return result
      } catch (error) {
        lastError = error as Error
        Logger.warn(`Operation '${operationName}' failed on attempt ${attempt}`, { error: lastError.message })

        if (attempt < maxAttempts) {
          const delay = CONFIG.RETRY.BASE_DELAY * Math.pow(CONFIG.RETRY.BACKOFF_FACTOR, attempt - 1)
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }
    }

    throw new Error(`Operation '${operationName}' failed after ${maxAttempts} attempts: ${lastError!.message}`)
  }
}

// ============================================================================
// WEBHOOK VALIDATOR
// ============================================================================

class WebhookValidator {
  static extractPayload(body: any): WebhookPayload | null {
    try {
      // Handle messaging events (DMs and postbacks)
      if (body?.entry?.[0]?.messaging) {
        const messaging = body.entry[0].messaging[0]

        // Skip read receipts and delivery confirmations
        if (messaging.read || messaging.delivery) {
          return null
        }

        // Handle regular messages
        if (messaging.message) {
          if (!messaging.message.text || messaging.message.is_echo) {
            return null
          }

          return {
            pageId: body.entry[0].id,
            senderId: messaging.sender.id,
            recipientId: messaging.recipient.id,
            userMessage: messaging.message.text,
            messageId: messaging.message.mid,
            messageType: "DM",
            isEcho: false,
          }
        }

        // Handle postback events (button clicks)
        if (messaging.postback) {
          return {
            pageId: body.entry[0].id,
            senderId: messaging.sender.id,
            recipientId: messaging.recipient.id,
            userMessage: messaging.postback.payload || messaging.postback.title || "Button clicked",
            messageId: `postback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            messageType: "DM",
            isEcho: false,
          }
        }
      }

      // Handle comment events
      if (body?.entry?.[0]?.changes?.[0]?.field === "comments") {
        const changeValue = body.entry[0].changes[0].value

        if (!changeValue.text) {
          return null
        }

        return {
          pageId: body.entry[0].id,
          senderId: changeValue.from.id,
          userMessage: changeValue.text,
          commentId: changeValue.id,
          messageType: "COMMENT",
          isEcho: false,
        }
      }

      return null
    } catch (error) {
      Logger.error("Failed to extract webhook payload", error)
      return null
    }
  }

  static isSpecialWebhook(body: any): "deauth" | "data_deletion" | "receipt" | null {
    if (body?.object === "instagram") {
      const field = body?.entry?.[0]?.changes?.[0]?.field
      if (field === "deauthorizations") return "deauth"
      if (field === "data_deletion") return "data_deletion"
    }

    if (body?.entry?.[0]?.messaging?.[0]) {
      const messaging = body.entry[0].messaging[0]
      if (messaging.read || messaging.delivery) return "receipt"
    }

    return null
  }
}

// ============================================================================
// DUPLICATE PREVENTION SYSTEM
// ============================================================================

class DuplicateGuard {
  private static recentMessages = new Map<string, number>()
  private static processingMessages = new Set<string>()

  static generateMessageKey(payload: WebhookPayload): string {
    const baseId = payload.messageId || payload.commentId || `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const contentHash = payload.userMessage.substring(0, 50).replace(/\s+/g, "_")
    return `${payload.pageId}_${payload.senderId}_${baseId}_${contentHash}_${payload.messageType}`
  }

  static async isDuplicate(payload: WebhookPayload, messageKey: string): Promise<boolean> {
    const now = Date.now()

    // Check in-memory recent messages
    const duplicateKey = `${payload.pageId}_${payload.senderId}_${payload.userMessage}_${payload.messageType}`
    const lastTime = this.recentMessages.get(duplicateKey)

    if (lastTime && now - lastTime < CONFIG.RATE_LIMITS.DUPLICATE_WINDOW_MS) {
      Logger.warn("Duplicate message blocked (in-memory)", { key: duplicateKey })
      return true
    }

    // Check if currently processing
    if (this.processingMessages.has(duplicateKey)) {
      Logger.warn("Message already being processed", { key: duplicateKey })
      return true
    }

    // Check database for processed messages
    const dbDuplicate = await checkProcessedMessage(messageKey)
    if (dbDuplicate) {
      Logger.warn("Message already processed (database)", { key: messageKey })
      return true
    }

    // Mark as processing and update recent messages
    this.processingMessages.add(duplicateKey)
    this.recentMessages.set(duplicateKey, now)

    // Clean up old entries
    this.cleanup()

    return false
  }

  static finishProcessing(payload: WebhookPayload): void {
    const duplicateKey = `${payload.pageId}_${payload.senderId}_${payload.userMessage}_${payload.messageType}`
    this.processingMessages.delete(duplicateKey)
  }

  private static cleanup(): void {
    const cutoff = Date.now() - CONFIG.RATE_LIMITS.DUPLICATE_WINDOW_MS * 2

    for (const [key, timestamp] of this.recentMessages.entries()) {
      if (timestamp < cutoff) {
        this.recentMessages.delete(key)
      }
    }
  }
}

// ============================================================================
// RATE LIMITER
// ============================================================================

class RateLimiter {
  static async checkLimit(payload: WebhookPayload): Promise<boolean> {
    try {
      const count = await getRecentResponseCount(
        payload.pageId,
        payload.senderId,
        payload.messageType,
        CONFIG.RATE_LIMITS.PERIOD_MINUTES,
      )

      if (count >= CONFIG.RATE_LIMITS.MAX_RESPONSES_PER_PERIOD) {
        Logger.warn("Rate limit exceeded", {
          pageId: payload.pageId,
          senderId: payload.senderId,
          count,
          limit: CONFIG.RATE_LIMITS.MAX_RESPONSES_PER_PERIOD,
        })
        return false
      }

      return true
    } catch (error) {
      Logger.error("Error checking rate limit", error)
      return true // Allow on error
    }
  }
}

// ============================================================================
// AI PROCESSING HANDLERS
// ============================================================================

class VoiceflowProcessor {
  static async process(context: ProcessingContext): Promise<ProcessingResult> {
    try {
      Logger.info("Processing with Voiceflow", { automationId: context.automation.id })

      // Gather context data
      const [historyResult, profileResult, businessResult] = await Promise.allSettled([
        buildConversationContext(context.payload.pageId, context.payload.senderId, context.automation.id),
        getBusinessProfileForAutomation(context.automation.id),
        this.getBusinessVariables(context),
      ])

      const conversationHistory = historyResult.status === "fulfilled" ? historyResult.value : []
      const profile =
        profileResult.status === "fulfilled" ? profileResult.value : { profileContent: "", businessContext: {} }
      const businessVariables = businessResult.status === "fulfilled" ? businessResult.value : {}

      // Create Voiceflow user (non-blocking)
      createVoiceflowUser(context.userId).catch((error) => Logger.warn("Voiceflow user creation failed", error))

      // Get Voiceflow response
      const voiceflowResult = await RetryManager.withRetry(
        () => this.callVoiceflowAPI(context, businessVariables, conversationHistory.length === 0),
        "Voiceflow API call",
      )

      if (!voiceflowResult.success || !voiceflowResult.response) {
        throw new Error(`Voiceflow API failed: ${voiceflowResult.error}`)
      }

      // Extract customer data
      const extractedData = this.extractCustomerData(voiceflowResult.variables)

      // Process lead qualification (background)
      this.processLeadQualification(context, extractedData)

      return {
        success: true,
        data: {
          text: voiceflowResult.response.text,
          quickReplies: voiceflowResult.response.quickReplies,
          buttons: voiceflowResult.response.buttons,
          carousel: voiceflowResult.response.carousel,
          attachment: voiceflowResult.response.attachment,
          variables: voiceflowResult.variables,
          extractedData,
        },
        aiSystem: "voiceflow",
      }
    } catch (error) {
      Logger.error("Voiceflow processing failed", error)
      return {
        success: false,
        error: `Voiceflow processing failed: ${(error as Error).message}`,
      }
    }
  }

  private static async getBusinessVariables(context: ProcessingContext): Promise<Record<string, string>> {
    const business = await getBusinessByAutomationId(context.automation.id)
    if (!business) {
      throw new Error(`No business found for automation: ${context.automation.id}`)
    }

    return fetchEnhancedBusinessVariables(
      business.id,
      context.automation.id,
      context.automation.businessWorkflowConfig?.id || null,
      {
        pageId: context.payload.pageId,
        senderId: context.payload.senderId,
        userMessage: context.payload.userMessage,
        isNewUser: false, // Will be determined by conversation history
        customerType: "NEW",
        messageHistory: [],
      },
    )
  }

  private static async callVoiceflowAPI(
    context: ProcessingContext,
    businessVariables: Record<string, string>,
    isFirstMessage: boolean,
  ): Promise<any> {
    const voiceflowApiKey = process.env.VOICEFLOW_API_KEY
    const voiceflowProjectId = process.env.VOICEFLOW_PROJECT_ID
    const voiceflowVersionId = process.env.VOICEFLOW_VERSION_ID

    if (!voiceflowApiKey || !voiceflowProjectId) {
      throw new Error("Voiceflow credentials missing")
    }

    return TimeoutManager.withTimeout(
      getEnhancedVoiceflowResponse(
        context.payload.userMessage,
        context.userId,
        businessVariables,
        voiceflowApiKey,
        voiceflowProjectId,
        voiceflowVersionId,
        {
          maxRetries: 1,
          timeoutMs: CONFIG.TIMEOUTS.VOICEFLOW,
          enableFallbackDetection: false,
          isFirstMessage,
        },
      ),
      CONFIG.TIMEOUTS.VOICEFLOW,
      "Voiceflow API",
    )
  }

  private static extractCustomerData(variables: any): { name?: string; email?: string; phone?: string } | undefined {
    if (!variables) return undefined

    const extractedData = {
      name: variables.customer_name || variables.clientname || variables.name,
      email: variables.customer_email || variables.clientemail || variables.email,
      phone: variables.customer_phone || variables.clientphone || variables.phone,
    }

    return extractedData.name || extractedData.email || extractedData.phone ? extractedData : undefined
  }

  private static processLeadQualification(
    context: ProcessingContext,
    extractedData?: { name?: string; email?: string; phone?: string },
  ): void {
    // Process in background
    setImmediate(async () => {
      try {
        if (!context.automation.User?.id) return

        await analyzeLead({
          userId: context.automation.User.id,
          automationId: context.automation.id,
          platformId: context.payload.pageId,
          customerId: context.payload.senderId,
          message: context.payload.userMessage,
          messageType: context.payload.messageType,
          timestamp: new Date(),
        })

        Logger.info("Lead qualification completed", { senderId: context.payload.senderId })
      } catch (error) {
        Logger.error("Lead qualification failed", error)
      }
    })
  }
}

class GeminiProcessor {
  static async process(context: ProcessingContext): Promise<ProcessingResult> {
    try {
      Logger.info("Processing with Gemini", { automationId: context.automation.id })

      // Gather context
      const [profileResult, historyResult] = await Promise.allSettled([
        getBusinessProfileForAutomation(context.automation.id),
        buildConversationContext(context.payload.pageId, context.payload.senderId, context.automation.id),
      ])

      const profile =
        profileResult.status === "fulfilled" ? profileResult.value : { profileContent: "", businessContext: {} }
      const history = historyResult.status === "fulfilled" ? historyResult.value : []

      // Generate response
      const response = await RetryManager.withRetry(
        () =>
          TimeoutManager.withTimeout(
            generateGeminiResponse({
              automationId: context.automation.id, // ADD THIS LINE
              userMessage: context.payload.userMessage,
              businessProfile: profile.profileContent,
              conversationHistory: history,
              businessContext: profile.businessContext,
              isPROUser: false,
            }),
            CONFIG.TIMEOUTS.GEMINI,
            "Gemini API",
          ),
        "Gemini processing",
      )

      const responseText = typeof response === "string" ? response : ""
      if (!responseText.trim()) {
        throw new Error("Gemini returned empty response")
      }

      return {
        success: true,
        data: { text: responseText },
        aiSystem: "gemini",
      }
    } catch (error) {
      Logger.error("Gemini processing failed", error)
      return {
        success: false,
        error: `Gemini processing failed: ${(error as Error).message}`,
      }
    }
  }
}

// ============================================================================
// RESPONSE SENDER
// ============================================================================

class ResponseSender {
  static async send(context: ProcessingContext, result: ProcessingResult): Promise<void> {
    if (!result.success || !result.data?.text) {
      throw new Error("Cannot send invalid response")
    }

    const { text, quickReplies, buttons, carousel, attachment } = result.data

    // Check for duplicate response
    const isDuplicate = await checkDuplicateResponse(
      context.payload.pageId,
      context.payload.senderId,
      text,
      context.payload.messageType,
    )

    if (isDuplicate) {
      Logger.warn("Duplicate response blocked", { text: text.substring(0, 50) })
      return
    }

    const token = context.automation.User?.integrations?.[0]?.token || process.env.DEFAULT_PAGE_TOKEN

    try {
      let sendResult

      if (context.payload.messageType === "DM") {
        // Transform to Instagram format
        const instagramMessage = transformVoiceflowToInstagram({
          text,
          quickReplies,
          buttons,
          carousel,
          attachment,
        })

        sendResult = await TimeoutManager.withTimeout(
          sendDMs(
            context.payload.pageId,
            context.payload.senderId,
            instagramMessage.text,
            token,
            quickReplies,
            buttons,
            carousel,
            attachment,
          ),
          10000,
          "Send DM",
        )
      } else if (context.payload.messageType === "COMMENT" && context.payload.commentId) {
        console.log("[v0] Processing COMMENT - sending DM and public reply")
        console.log("[v0] Automation listener data:", context.automation.listener)

        // 1. Send the private DM with the AI response
        sendResult = await TimeoutManager.withTimeout(
          sendPrivateMessages(
            context.payload.pageId,
            context.payload.commentId,
            text,
            token,
            quickReplies,
            buttons,
            carousel,
            attachment,
          ),
          10000,
          "Send comment reply",
        )

        console.log("[v0] DM sent, status:", sendResult?.status)

        if (
          context.automation.listener?.commentReplyVariations &&
          context.automation.listener.commentReplyVariations.length > 0
        ) {
          try {
            // Fetch Instagram username for personalization
            console.log("[v0] Fetching Instagram username for commenter:", context.payload.senderId)
            const username = await TimeoutManager.withTimeout(
              getInstagramUsername(context.payload.senderId, token),
              5000,
              "Fetch username",
            )

            // Select a random variation with optional username personalization
            const selectedReply = selectCommentReplyVariation(
              context.automation.listener.commentReplyVariations,
              username || undefined,
            )

            console.log("[v0] Selected comment reply variation:", selectedReply)
            console.log("[v0] Username used:", username || "none (anonymous)")

            // Post the personalized public reply
            const commentReplyResult = await TimeoutManager.withTimeout(
              replyToComment(context.payload.commentId, selectedReply, token),
              10000,
              "Post comment reply",
            )

            console.log("[v0] Comment reply posted successfully:", commentReplyResult.status, commentReplyResult.data)
          } catch (error) {
            console.error("[v0] Error posting comment reply:", error)
          }
        } else if (context.automation.listener?.commentReply) {
          // Fallback to old single reply method if no variations
          const baseReply = context.automation.listener.commentReply

          try {
            const username = await TimeoutManager.withTimeout(
              getInstagramUsername(context.payload.senderId, token),
              5000,
              "Fetch username",
            )

            const humanizedReply = generateHumanCommentReply(baseReply, username || undefined)

            console.log("[v0] Posting public comment reply:", humanizedReply)

            const commentReplyResult = await TimeoutManager.withTimeout(
              replyToComment(context.payload.commentId, humanizedReply, token),
              10000,
              "Post comment reply",
            )

            console.log("[v0] Comment reply posted successfully:", commentReplyResult.status, commentReplyResult.data)
          } catch (error) {
            console.error("[v0] Error posting comment reply:", error)
          }
        } else {
          console.log("[v0] No reply text configured, skipping public comment reply")
        }
      }

      if (sendResult?.status !== 200) {
        throw new Error(`Send failed with status: ${sendResult?.status}`)
      }

      // Mark as sent
      await markResponseAsSent(
        context.payload.pageId,
        context.payload.senderId,
        text,
        context.payload.messageType,
        context.automation.id,
      )

      Logger.info("Response sent successfully", {
        messageType: context.payload.messageType,
        length: text.length,
      })
    } catch (error) {
      Logger.error("Failed to send response", error)
      throw error
    }
  }
}

// ============================================================================
// BACKGROUND PROCESSOR
// ============================================================================

class BackgroundProcessor {
  static process(context: ProcessingContext, result: ProcessingResult): void {
    const tasks = [
      // Store conversation messages
      storeConversationMessage(
        context.payload.pageId,
        context.payload.senderId,
        context.payload.userMessage,
        false,
        context.automation.id,
      ),
      storeConversationMessage(context.payload.pageId, "bot", result.data?.text || "", true, context.automation.id),

      // Track analytics
      trackResponses(context.automation.id, context.payload.messageType),
      createChatHistory(
        context.automation.id,
        context.payload.pageId,
        context.payload.senderId,
        context.payload.userMessage,
      ),
      createChatHistory(
        context.automation.id,
        context.payload.pageId,
        context.payload.senderId,
        result.data?.text || "",
      ),

      // Update conversation state
      updateConversationState(context.userId, {
        isActive: true,
        lastTriggerType: context.triggerDecision.triggerType,
        lastTriggerReason: context.triggerDecision.reason,
        automationId: context.automation.id,
        listenMode: context.triggerDecision.triggerType === "KEYWORD" ? "KEYWORDS" : "ALL_MESSAGES",
        lastMessageLength: context.payload.userMessage.length,
      }),

      // Track sentiment
      context.automation.id
        ? trackMessageForSentiment(
            context.automation.id,
            context.payload.pageId,
            context.payload.senderId,
            context.payload.userMessage,
          )
        : Promise.resolve(),

      // Log trigger execution
      context.triggerDecision.triggerId
        ? logTriggerExecution({
            triggerId: context.triggerDecision.triggerId,
            automationId: context.automation.id,
            userId: context.automation.User?.id,
            messageContent: context.payload.userMessage,
            triggerType: context.triggerDecision.triggerType,
            confidence: context.triggerDecision.confidence,
            reason: context.triggerDecision.reason,
            success: result.success,
            responseTime: Date.now() - context.startTime,
          })
        : Promise.resolve(),
    ]

    Promise.allSettled(tasks)
      .then((results) => {
        const failed = results.filter((r) => r.status === "rejected").length
        if (failed === 0) {
          Logger.info("All background tasks completed")
        } else {
          Logger.warn(`${failed} background tasks failed`)
        }
      })
      .catch((error) => Logger.error("Background processing error", error))
  }
}

// ============================================================================
// MAIN MESSAGE PROCESSOR
// ============================================================================

class MessageProcessor {
  static async process(payload: WebhookPayload, startTime: number): Promise<void> {
    const messageKey = DuplicateGuard.generateMessageKey(payload)

    Logger.info("Processing message", {
      messageType: payload.messageType,
      senderId: payload.senderId,
      messageLength: payload.userMessage.length,
    })

    try {
      // Duplicate prevention
      if (await DuplicateGuard.isDuplicate(payload, messageKey)) {
        return
      }

      // Rate limiting
      if (!(await RateLimiter.checkLimit(payload))) {
        return
      }

      // Mark as processed
      await markMessageAsProcessed(messageKey)

      // Build processing context
      const context = await this.buildContext(payload, messageKey, startTime)
      if (!context) {
        Logger.warn("Failed to build processing context")
        return
      }

      // Process with timeout
      await TimeoutManager.withTimeout(
        this.processMessage(context),
        CONFIG.TIMEOUTS.TOTAL_PROCESSING,
        "Total message processing",
      )

      Logger.info("Message processed successfully", {
        duration: Date.now() - startTime,
        automation: context.automation.id,
      })
    } catch (error) {
      Logger.error("Message processing failed", error)
      throw error
    } finally {
      DuplicateGuard.finishProcessing(payload)
    }
  }

  private static async buildContext(
    payload: WebhookPayload,
    messageKey: string,
    startTime: number,
  ): Promise<ProcessingContext | null> {
    try {
      // Decide trigger action
      const triggerDecision = await decideTriggerAction(
        payload.pageId,
        payload.senderId,
        payload.userMessage,
        payload.messageType,
      )

      let automation = null

      if (triggerDecision.triggerType === "NO_MATCH") {
        // Get or create default automation
        automation = await getOrCreateDefaultAutomation("INSTAGRAM")
        if (!automation) {
          Logger.warn("No default automation available")
          return null
        }
      } else {
        // Get specific automation
        automation = await getAutomationWithTriggers(triggerDecision.automationId!, payload.messageType)

        if (!automation) {
          Logger.warn(`Automation not found: ${triggerDecision.automationId}`)
          // Fallback to default
          automation = await getOrCreateDefaultAutomation("INSTAGRAM")
          if (!automation) return null
        }
      }

      return {
        payload,
        automation,
        userId: `${payload.pageId}_${payload.senderId}`,
        triggerDecision,
        startTime,
        messageKey,
      }
    } catch (error) {
      Logger.error("Failed to build context", error)
      return null
    }
  }

  private static async processMessage(context: ProcessingContext): Promise<void> {
    const isPROUser = context.automation.User?.subscription?.plan === "PRO"

    let result: ProcessingResult

    // Process with appropriate AI system
    if (isPROUser) {
      result = await VoiceflowProcessor.process(context)

      // Fallback to Gemini if Voiceflow fails for PRO users
      if (!result.success) {
        Logger.warn("Voiceflow failed, falling back to Gemini")
        result = await GeminiProcessor.process(context)
      }
    } else {
      result = await GeminiProcessor.process(context)
    }

    if (!result.success) {
      throw new Error(result.error || "AI processing failed")
    }

    // Send response
    await ResponseSender.send(context, result)

    // Process background tasks
    BackgroundProcessor.process(context, result)
  }
}

// ============================================================================
// MAIN ROUTE HANDLERS
// ============================================================================

export async function GET(req: NextRequest): Promise<NextResponse> {
  const challenge = req.nextUrl.searchParams.get("hub.challenge")
  return new NextResponse(challenge)
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const startTime = Date.now()

  try {
    const body = await req.json()

    Logger.debug("Webhook received", {
      hasEntry: !!body?.entry?.length,
      entryCount: body?.entry?.length || 0,
    })

    // Handle special webhooks
    const specialType = WebhookValidator.isSpecialWebhook(body)

    if (specialType === "deauth") {
      const signature = req.headers.get("x-hub-signature-256")
      const bodyStr = JSON.stringify(body)

      if (!signature || !verifyInstagramWebhook(signature, bodyStr, process.env.INSTAGRAM_CLIENT_SECRET!)) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }

      const result = await handleInstagramDeauthWebhook(body)
      return NextResponse.json(result, { status: result.status })
    }

    if (specialType === "data_deletion") {
      const signature = req.headers.get("x-hub-signature-256")
      const bodyStr = JSON.stringify(body)

      if (!signature || !verifyInstagramWebhook(signature, bodyStr, process.env.INSTAGRAM_CLIENT_SECRET!)) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }

      const result = await handleInstagramDataDeletionWebhook(body)
      return NextResponse.json(result, { status: result.status })
    }

    if (specialType === "receipt") {
      return NextResponse.json({ message: "Receipt acknowledged" }, { status: 200 })
    }

    // Extract and validate payload
    const payload = WebhookValidator.extractPayload(body)

    if (!payload) {
      Logger.warn("Unsupported webhook payload or non-text message")
      return NextResponse.json({ message: "Webhook acknowledged" }, { status: 200 })
    }

    // Skip echo messages
    if (payload.isEcho) {
      Logger.debug("Skipping echo message")
      return NextResponse.json({ message: "Echo ignored" }, { status: 200 })
    }

    // Process message
    await MessageProcessor.process(payload, startTime)

    const processingTime = Date.now() - startTime

    return NextResponse.json(
      {
        message: "Message processed successfully",
        processingTime,
        messageType: payload.messageType,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    )
  } catch (error) {
    const processingTime = Date.now() - startTime
    Logger.error("Webhook processing error", {
      error: (error as Error).message,
      processingTime,
    })

    return NextResponse.json(
      {
        message: "Error processing webhook",
        error: (error as Error).message,
        processingTime,
      },
      { status: 500 },
    )
  }
}
























// import { type NextRequest, NextResponse } from "next/server"
// import {
//   createChatHistory,
//   trackResponses,
//   checkProcessedMessage,
//   markMessageAsProcessed,
//   decideTriggerAction,
//   updateConversationState,
//   logTriggerExecution,
//   checkDuplicateResponse,
//   getRecentResponseCount,
//   markResponseAsSent,
// } from "@/actions/webhook/queries"
// import { getBusinessProfileForAutomation, getOrCreateDefaultAutomation } from "@/actions/webhook/business-profile"
// import { buildConversationContext } from "@/lib/gemini"
// import {
//   createVoiceflowUser,
//   fetchEnhancedBusinessVariables,
//   getVoiceflowHealth,
//   getEnhancedVoiceflowResponse,
// } from "@/lib/voiceflow"
// import { analyzeLead } from "@/lib/lead-qualification"
// import { sendPrivateMessages, transformVoiceflowToInstagram } from "@/lib/fetch"
// import { sendDMs } from "@/lib/voiceflow"
// import { client } from "@/lib/prisma"
// import { storeConversationMessage } from "@/actions/chats/queries"
// import { handleInstagramDeauthWebhook, handleInstagramDataDeletionWebhook } from "@/lib/deauth"
// import { verifyInstagramWebhook } from "@/utils/instagram"
// import { trackMessageForSentiment } from "@/lib/sentiment-tracker"
// import { getBusinessByAutomationId } from "@/actions/businfo/queries"
// import { executeWorkflow } from "@/lib/workflow-engine"

// interface InstagramAlignedButton {
//   title: string
//   payload: string
//   url?: string // For web_url buttons
// }

// interface InstagramAlignedQuickReply {
//   content_type: "text"
//   title: string
//   payload: string
// }

// interface InstagramAlignedCarouselElement {
//   title: string
//   subtitle?: string
//   image_url?: string
//   buttons?: InstagramAlignedButton[]
// }

// interface InstagramAlignedMessage {
//   text: string
//   quickReplies?: InstagramAlignedQuickReply[]
//   buttons?: InstagramAlignedButton[]
//   carousel?: InstagramAlignedCarouselElement[]
//   attachment?: {
//     type: "image" | "video" | "audio" | "file"
//     url: string
//     caption?: string
//   }
//   // Instagram-specific metadata
//   requiresHumanHandoff?: boolean
//   priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
//   sentiment?: "positive" | "neutral" | "negative"
//   complexity?: "simple" | "medium" | "complex"
// }

// interface VoiceflowButton {
//   // Common properties across different Voiceflow versions
//   name?: string
//   title?: string
//   text?: string
//   label?: string

//   // Payload variations
//   payload?: string | object
//   value?: string
//   request?: {
//     type?: string
//     payload?: {
//       intent?: {
//         name?: string
//       }
//       query?: string
//     }
//   }

//   // URL for web buttons
//   url?: string
//   link?: string

//   // Legacy support
//   id?: string
//   type?: string
// }

// interface EnhancedVoiceflowResponse {
//   text?: string
//   quickReplies?: Array<{
//     name?: string
//     title?: string
//     payload?: string
//     value?: string
//   }>
//   buttons?: VoiceflowButton[]
//   carousel?: Array<{
//     title: string
//     subtitle?: string
//     imageUrl?: string
//     image_url?: string
//     buttons?: VoiceflowButton[]
//   }>
//   attachment?: any
//   variables?: Record<string, any>

//   // Handle Voiceflow trace types
//   traces?: Array<{
//     type: string
//     payload?: any
//   }>
// }

// interface WebhookData {
//   pageId: string
//   senderId: string
//   recipientId?: string
//   userMessage: string
//   messageId?: string
//   commentId?: string
//   messageType: "DM" | "COMMENT"
//   isEcho?: boolean
// }

// interface ProcessingContext {
//   data: WebhookData
//   automation: any
//   conversationUserId: string
//   userMessage: string
//   triggerDecision: any
//   startTime: number
//   messageKey: string
// }

// interface ProcessingResult {
//   success: boolean
//   responseText?: string
//   buttons?: any[]
//   quickReplies?: any[]
//   carousel?: any[]
//   attachment?: any
//   variables?: Record<string, any>
//   aiSystem: string
//   error?: string
//   extractedData?: {
//     name?: string
//     email?: string
//     phone?: string
//   }
// }

// interface VoiceflowResponse {
//   text?: string
//   quickReplies?: Array<{ name: string; payload: string }>
//   buttons?: Array<{ name: string; payload: string; url?: string }>
//   carousel?: Array<{
//     title: string
//     subtitle?: string
//     imageUrl?: string
//     buttons?: Array<{ name: string; payload: string; url?: string }>
//   }>
//   attachment?: any
//   variables?: Record<string, any>
// }

// interface InstagramQuickReply {
//   content_type: "text"
//   title: string
//   payload: string
// }

// interface InstagramButton {
//   type: "web_url" | "postback"
//   title: string
//   url?: string
//   payload?: string
// }

// interface InstagramGenericElement {
//   title: string
//   subtitle?: string
//   image_url?: string
//   buttons?: InstagramButton[]
// }

// interface InstagramAttachment {
//   type: "template"
//   payload: {
//     template_type: "generic" | "button"
//     elements?: InstagramGenericElement[]
//     text?: string
//     buttons?: InstagramButton[]
//   }
// }

// const CONFIG = {
//   TIMEOUTS: {
//     VOICEFLOW: 15000,
//     GEMINI: 10000,
//     WORKFLOW: 12000, // New timeout for workflow execution
//     PROFILE: 5000,
//     TOTAL_PROCESSING: 30000,
//   },
//   RATE_LIMITS: {
//     MAX_RESPONSES_PER_2MIN: 3,
//     DUPLICATE_WINDOW: 8000,
//   },
//   RETRY: {
//     MAX_ATTEMPTS: 3,
//     BASE_DELAY: 1000,
//     MAX_DELAY: 5000,
//     BACKOFF_MULTIPLIER: 2,
//   },
//   CLEANUP_INTERVAL: 5 * 60 * 1000,
// } as const

// class EnhancedMemoryManager {
//   private static instance: EnhancedMemoryManager
//   private recentMessages = new Map<string, number>()
//   private processingMessages = new Set<string>()
//   private cleanupInterval: NodeJS.Timeout
//   private metrics = {
//     duplicatesBlocked: 0,
//     messagesProcessed: 0,
//     cleanupRuns: 0,
//   }

//   private constructor() {
//     this.cleanupInterval = setInterval(() => {
//       this.cleanup()
//     }, CONFIG.CLEANUP_INTERVAL)
//   }

//   static getInstance(): EnhancedMemoryManager {
//     if (!EnhancedMemoryManager.instance) {
//       EnhancedMemoryManager.instance = new EnhancedMemoryManager()
//     }
//     return EnhancedMemoryManager.instance
//   }

//   isDuplicate(key: string, timestamp: number): boolean {
//     const lastTime = this.recentMessages.get(key)
//     const isDupe = lastTime ? timestamp - lastTime < CONFIG.RATE_LIMITS.DUPLICATE_WINDOW : false
//     if (isDupe) this.metrics.duplicatesBlocked++
//     return isDupe
//   }

//   isProcessing(key: string): boolean {
//     return this.processingMessages.has(key)
//   }

//   markMessage(key: string, timestamp: number): void {
//     this.recentMessages.set(key, timestamp)
//     this.metrics.messagesProcessed++
//   }

//   startProcessing(key: string): void {
//     this.processingMessages.add(key)
//   }

//   finishProcessing(key: string): void {
//     this.processingMessages.delete(key)
//   }

//   private cleanup(): void {
//     const cutoff = Date.now() - CONFIG.CLEANUP_INTERVAL
//     const keysToDelete: string[] = []

//     this.recentMessages.forEach((timestamp, key) => {
//       if (timestamp < cutoff) {
//         keysToDelete.push(key)
//       }
//     })

//     keysToDelete.forEach((key) => {
//       this.recentMessages.delete(key)
//     })

//     this.processingMessages.clear()
//     this.metrics.cleanupRuns++

//     Logger.info(`🧹 Memory cleanup: removed ${keysToDelete.length} old entries`)
//   }

//   getMetrics() {
//     return {
//       ...this.metrics,
//       recentMessagesCount: this.recentMessages.size,
//       processingCount: this.processingMessages.size,
//     }
//   }
// }

// class Logger {
//   static info(message: string, data?: any): void {
//     const timestamp = new Date().toISOString()
//     console.log(`[${timestamp}] ℹ️ ${message}`, data ? JSON.stringify(data, null, 2) : "")
//   }

//   static success(message: string, data?: any): void {
//     const timestamp = new Date().toISOString()
//     console.log(`[${timestamp}] ✅ ${message}`, data ? JSON.stringify(data, null, 2) : "")
//   }

//   static warning(message: string, data?: any): void {
//     const timestamp = new Date().toISOString()
//     console.log(`[${timestamp}] ⚠️ ${message}`, data ? JSON.stringify(data, null, 2) : "")
//   }

//   static error(message: string, error?: any): void {
//     const timestamp = new Date().toISOString()
//     console.error(`[${timestamp}] ❌ ${message}`, error)
//   }

//   static debug(message: string, data?: any): void {
//     const timestamp = new Date().toISOString()
//     console.log(`[${timestamp}] 🔍 ${message}`, data ? JSON.stringify(data, null, 2) : "")
//   }

//   static performance(message: string, startTime: number): void {
//     const duration = Date.now() - startTime
//     const timestamp = new Date().toISOString()
//     console.log(`[${timestamp}] ⚡ ${message} (${duration}ms)`)
//   }
// }

// class TimeoutManager {
//   static async withTimeout<T>(promise: Promise<T>, timeoutMs: number, operation: string): Promise<T> {
//     const timeoutPromise = new Promise<never>((_, reject) => {
//       setTimeout(() => reject(new Error(`${operation} timeout after ${timeoutMs}ms`)), timeoutMs)
//     })

//     return Promise.race([promise, timeoutPromise])
//   }
// }

// class RetryManager {
//   static async withRetry<T>(
//     operation: () => Promise<T>,
//     operationName: string,
//     maxAttempts: number = CONFIG.RETRY.MAX_ATTEMPTS,
//   ): Promise<T> {
//     let lastError: Error | null = null

//     for (let attempt = 1; attempt <= maxAttempts; attempt++) {
//       try {
//         Logger.info(`🔄 ${operationName} - Attempt ${attempt}/${maxAttempts}`)
//         const result = await operation()

//         if (attempt > 1) {
//           Logger.success(`✅ ${operationName} succeeded on attempt ${attempt}`)
//         }

//         return result
//       } catch (error) {
//         lastError = error as Error
//         Logger.warning(`⚠️ ${operationName} failed on attempt ${attempt}: ${lastError.message}`)

//         if (attempt < maxAttempts) {
//           const delay = Math.min(
//             CONFIG.RETRY.BASE_DELAY * Math.pow(CONFIG.RETRY.BACKOFF_MULTIPLIER, attempt - 1),
//             CONFIG.RETRY.MAX_DELAY,
//           )
//           Logger.info(`⏳ Retrying ${operationName} in ${delay}ms...`)
//           await new Promise((resolve) => setTimeout(resolve, delay))
//         }
//       }
//     }

//     throw new Error(`${operationName} failed after ${maxAttempts} attempts: ${lastError?.message}`)
//   }
// }

// class WebhookValidator {
//   static extractData(payload: any): WebhookData | null {
//     try {
//       if (payload?.entry?.[0]?.messaging) {
//         const messaging = payload.entry[0].messaging[0]

//         if (messaging.read || messaging.delivery) {
//           Logger.debug("Ignoring read receipt or delivery confirmation")
//           return null
//         }

//         // Handle regular messages
//         if (messaging.message) {
//           const isEcho = messaging.message?.is_echo === true

//           if (!messaging.message.text) {
//             Logger.debug("Ignoring non-text message")
//             return null
//           }

//           return {
//             pageId: payload.entry[0].id,
//             senderId: messaging.sender.id,
//             recipientId: messaging.recipient.id,
//             userMessage: messaging.message.text,
//             messageId: messaging.message.mid,
//             messageType: "DM",
//             isEcho,
//           }
//         }

//         // CRITICAL: Handle postback events (button clicks)
//         if (messaging.postback) {
//           return {
//             pageId: payload.entry[0].id,
//             senderId: messaging.sender.id,
//             recipientId: messaging.recipient.id,
//             userMessage: messaging.postback.payload || messaging.postback.title || "Button clicked",
//             messageId: `postback_${Date.now()}`,
//             messageType: "DM",
//             isEcho: false,
//           }
//         }
//       } else if (payload?.entry?.[0]?.changes && payload.entry[0].changes[0].field === "comments") {
//         const changeValue = payload.entry[0].changes[0].value

//         if (!changeValue.text) {
//           Logger.debug("Ignoring comment without text")
//           return null
//         }

//         return {
//           pageId: payload.entry[0].id,
//           senderId: changeValue.from.id,
//           userMessage: changeValue.text,
//           commentId: changeValue.id,
//           messageType: "COMMENT",
//           isEcho: false,
//         }
//       }
//     } catch (error) {
//       Logger.error("Failed to extract webhook data", error)
//     }

//     return null
//   }

//   static isSpecialWebhook(payload: any): string | null {
//     if (payload?.object === "instagram" && payload?.entry?.[0]?.changes?.[0]?.field === "deauthorizations") {
//       return "deauth"
//     }
//     if (payload?.object === "instagram" && payload?.entry?.[0]?.changes?.[0]?.field === "data_deletion") {
//       return "data_deletion"
//     }
//     if (payload?.entry?.[0]?.messaging?.[0]?.read || payload?.entry?.[0]?.messaging?.[0]?.delivery) {
//       return "receipt"
//     }
//     return null
//   }
// }

// class MessageProcessor {
//   private static generateKey(data: WebhookData, timestamp: number): string {
//     const baseId = data.messageId || data.commentId || `${timestamp}_${Math.random().toString(36).substr(2, 9)}`
//     const messageContent = data.userMessage.substring(0, 50)
//     const messageLength = data.userMessage.length
//     return `${data.pageId}_${data.senderId}_${baseId}_${messageLength}_${messageContent.replace(/\s+/g, "_")}`
//   }

//   static async processImmediate(data: WebhookData, startTime: number): Promise<void> {
//     const messageKey = this.generateKey(data, startTime)
//     const duplicateKey = `${data.pageId}_${data.senderId}_${data.userMessage}_${data.messageType}`

//     Logger.info(`🚀 IMMEDIATE PROCESSING: ${data.messageType} from ${data.senderId}`)
//     Logger.debug(`Message: "${data.userMessage.substring(0, 100)}..."`)

//     const memoryManager = EnhancedMemoryManager.getInstance()

//     // Enhanced duplicate checking
//     if (memoryManager.isDuplicate(duplicateKey, startTime)) {
//       Logger.warning(`Duplicate message blocked: ${duplicateKey}`)
//       return
//     }

//     if (memoryManager.isProcessing(duplicateKey)) {
//       Logger.warning(`Message already being processed: ${duplicateKey}`)
//       return
//     }

//     // Database processing check
//     const isProcessed = await checkProcessedMessage(messageKey)
//     if (isProcessed) {
//       Logger.warning(`Message already processed in DB: ${messageKey.substring(0, 50)}...`)
//       return
//     }

//     memoryManager.startProcessing(duplicateKey)
//     memoryManager.markMessage(duplicateKey, startTime)

//     try {
//       await markMessageAsProcessed(messageKey)
//       Logger.success(`Message marked for processing: ${messageKey.substring(0, 50)}...`)

//       await TimeoutManager.withTimeout(
//         this.processMessage(data, messageKey, startTime),
//         CONFIG.TIMEOUTS.TOTAL_PROCESSING,
//         "Total message processing",
//       )

//       Logger.performance("Message processing completed", startTime)
//     } catch (error) {
//       Logger.error("Message processing failed", error)
//       throw error
//     } finally {
//       memoryManager.finishProcessing(duplicateKey)
//     }
//   }

//   private static async processMessage(data: WebhookData, messageKey: string, startTime: number): Promise<void> {
//     Logger.info(`🎯 Processing message: ${messageKey.substring(0, 50)}...`)

//     const context = await this.buildProcessingContext(data, messageKey, startTime)
//     if (!context) {
//       throw new Error("Failed to build processing context")
//     }

//     const isPROUser = context.automation.User?.subscription?.plan === "PRO"
//     Logger.info(`User type: ${isPROUser ? "PRO" : "Free/Standard"}`)

//     let result: ProcessingResult

//     if (isPROUser) {
//       // PRO users get Voiceflow with retry mechanism
//       result = await VoiceflowHandler.handle(context)
//     } else {
//       result = await WorkflowHandler.handle(context)
//     }

//     if (!result.success) {
//       throw new Error(`AI processing failed: ${result.error}`)
//     }

//     // Create the response object in the format ResponseSender expects
//     const responseForSending = {
//       text: result.responseText || "",
//       quickReplies: result.quickReplies,
//       buttons: result.buttons,
//       carousel: result.carousel,
//       attachment: result.attachment,
//     }

//     // Send the response
//     await ResponseSender.send(context, responseForSending)

//     // Process background tasks
//     BackgroundProcessor.process(context, result.responseText!, result.extractedData)

//     Logger.success(`✨ Message successfully processed with ${result.aiSystem}`)
//   }

//   private static async buildProcessingContext(
//     data: WebhookData,
//     messageKey: string,
//     startTime: number,
//   ): Promise<ProcessingContext | null> {
//     try {
//       Logger.debug("Building processing context...")

//       const triggerDecision = await TimeoutManager.withTimeout(
//         decideTriggerAction(data.pageId, data.senderId, data.userMessage, data.messageType),
//         5000,
//         "Trigger decision",
//       )

//       let automation = null

//       // If no specific automation matched, try to get/create default automation
//       if (triggerDecision.triggerType === "NO_MATCH") {
//         Logger.info("🔄 No specific automation matched, checking for default automation...")
//         automation = await getOrCreateDefaultAutomation(data.pageId)
//         if (!automation) {
//           Logger.error("❌ No default automation available - message ignored")
//           return null
//         }
//         Logger.info(`🎯 Using default automation: ${automation.id}`)
//       } else {
//         // Get the specific automation that was triggered
//         try {
//           automation = await client.automation.findUnique({
//             where: { id: triggerDecision.automationId! },
//             include: {
//               User: {
//                 include: {
//                   subscription: true,
//                   integrations: {
//                     where: { name: "INSTAGRAM" },
//                     select: { token: true },
//                   },
//                 },
//               },
//             },
//           })
//           Logger.info(`🔍 Automation lookup result:`, automation ? `Found: ${automation.id}` : "Not found")
//         } catch (error) {
//           Logger.error(`❌ Error fetching automation ${triggerDecision.automationId}:`, error)
//         }

//         if (!automation) {
//           Logger.warning(`❌ Specific automation not found: ${triggerDecision.automationId}`)
//           // Fallback to default automation
//           automation = await getOrCreateDefaultAutomation(data.pageId)
//           if (!automation) {
//             return null
//           }
//         }
//       }

//       return {
//         data,
//         automation,
//         conversationUserId: `${data.pageId}_${data.senderId}`,
//         userMessage: data.userMessage,
//         triggerDecision,
//         startTime,
//         messageKey,
//       }
//     } catch (error) {
//       Logger.error("Failed to build processing context", error)
//       return null
//     }
//   }
// }

// class WorkflowHandler {
//   static async handle(context: ProcessingContext): Promise<ProcessingResult> {
//     Logger.info("🔧 === WORKFLOW HANDLER (FREE/STANDARD USERS) ===")

//     try {
//       if (await this.isRateLimited(context)) {
//         throw new Error("Rate limit exceeded for Workflow processing")
//       }

//       const contextData = await this.gatherContext(context)

//       // Get business using automationId
//       Logger.info(`🔍 Looking up business for automation: ${context.automation.id}`)

//       const business = await getBusinessByAutomationId(context.automation.id)

//       if (!business) {
//         Logger.error(`❌ No business found for automation: ${context.automation.id}`)
//         throw new Error(`No business linked to automation: ${context.automation.id}`)
//       }

//       const businessId = business.id
//       Logger.info(`✅ Found business: ${businessId}`)

//       // Find active workflows for this business/automation
//       const workflows = await this.findMatchingWorkflows(
//         context.data.pageId,
//         context.data.messageType.toLowerCase(),
//         context.userMessage,
//         businessId,
//       )

//       if (workflows.length === 0) {
//         Logger.warning("No matching workflows found, falling back to simple response")
//         return {
//           success: true,
//           responseText: "Thank you for your message! We'll get back to you soon.",
//           aiSystem: "workflow_fallback",
//         }
//       }

//       // Execute the first matching workflow
//       const workflow = workflows[0]
//       Logger.info(`🔧 Executing workflow: ${workflow.name} (${workflow.id})`)

//       const triggerData = {
//         message: context.userMessage,
//         senderId: context.data.senderId,
//         pageId: context.data.pageId,
//         messageType: context.data.messageType,
//         platform: "instagram",
//         timestamp: new Date().toISOString(),
//         conversationHistory: contextData.conversationHistory,
//         businessContext: contextData.profile.businessContext,
//       }

//       const workflowResult = await RetryManager.withRetry(
//         () =>
//           TimeoutManager.withTimeout(
//             executeWorkflow(
//               workflow.id,
//               workflow.nodes as any[],
//               workflow.connections as any[],
//               triggerData,
//               workflow.userId,
//               "instagram",
//               context.data.senderId,
//             ),
//             CONFIG.TIMEOUTS.WORKFLOW,
//             "Workflow execution",
//           ),
//         "Workflow processing",
//       )

//       if (!workflowResult.success) {
//         throw new Error(`Workflow execution failed: ${workflowResult.error}`)
//       }

//       // Transform workflow responses to the expected format
//       const responses = workflowResult.responses || []
//       const primaryResponse = responses[0] || { text: "Thank you for your message!" }

//       // Process lead qualification for workflow users
//       if (context.automation.User?.id && context.data.senderId !== context.data.pageId) {
//         this.processLeadQualification(context)
//       }

//       Logger.success("✨ Workflow response successful")

//       return {
//         success: true,
//         responseText: primaryResponse.text,
//         buttons: primaryResponse.buttons,
//         quickReplies: primaryResponse.quickReplies,
//         carousel: primaryResponse.carousel,
//         attachment: primaryResponse.attachment,
//         // variables: workflowResult.variables,
//         // extractedData: this.extractCustomerDataFromWorkflow(workflowResult.variables),
//         aiSystem: "workflow_engine",
//       }
//     } catch (error) {
//       Logger.error("Workflow handler failed", error)
//       throw error
//     }
//   }

//   private static async isRateLimited(context: ProcessingContext): Promise<boolean> {
//     const count = await getRecentResponseCount(context.data.pageId, context.data.senderId, context.data.messageType, 2)
//     if (count >= CONFIG.RATE_LIMITS.MAX_RESPONSES_PER_2MIN) {
//       Logger.warning(`Rate limit exceeded: ${count} responses in 2 minutes`)
//       return true
//     }
//     return false
//   }

//   private static async gatherContext(context: ProcessingContext) {
//     Logger.debug("Gathering Workflow context...")

//     const [historyResult, profileResult] = await Promise.allSettled([
//       TimeoutManager.withTimeout(
//         buildConversationContext(context.data.pageId, context.data.senderId, context.automation.id),
//         CONFIG.TIMEOUTS.PROFILE,
//         "Conversation history",
//       ),
//       TimeoutManager.withTimeout(
//         getBusinessProfileForAutomation(context.automation.id),
//         CONFIG.TIMEOUTS.PROFILE,
//         "Business profile",
//       ),
//     ])

//     const conversationHistory =
//       historyResult.status === "fulfilled" && Array.isArray(historyResult.value) ? historyResult.value : []

//     const profile =
//       profileResult.status === "fulfilled" ? profileResult.value : { profileContent: "", businessContext: {} }

//     Logger.success(`Context gathered - History: ${conversationHistory.length} messages`)

//     return { conversationHistory, profile }
//   }

//   private static async findMatchingWorkflows(
//     pageId: string,
//     triggerType: string,
//     messageText: string,
//     businessId: string,
//   ) {
//     try {
//       // Find active workflows for this business and trigger type
//       const workflows = await client.workflows.findMany({
//         where: {
//           isActive: true,
//           triggerType: triggerType === "dm" ? "dm" : "comment",
//           socialAccount: {
//             accountId: pageId,
//             platform: "instagram",
//             isActive: true,
//           },
//           // Link to business through user relationship
//           user: {
//             businesses: {
//               some: {
//                 id: businessId,
//               },
//             },
//           },
//         },
//         include: {
//           socialAccount: true,
//           user: true,
//         },
//       })

//       Logger.info(`🔍 Found ${workflows.length} active workflows for ${triggerType}`)

//       // For now, return all matching workflows
//       // In the future, you could add keyword matching or other filtering logic
//       return workflows
//     } catch (error) {
//       Logger.error("Error finding workflows:", error)
//       return []
//     }
//   }

//   private static extractCustomerDataFromWorkflow(
//     variables: any,
//   ): { name?: string; email?: string; phone?: string } | undefined {
//     if (!variables) return undefined

//     const extractedData = {
//       name: variables.customer_name || variables.name || variables.user_name || variables.full_name,
//       email: variables.customer_email || variables.email || variables.user_email || variables.email_address,
//       phone: variables.customer_phone || variables.phone || variables.user_phone || variables.phone_number,
//     }

//     // Only return if we have at least one piece of data
//     if (extractedData.name || extractedData.email || extractedData.phone) {
//       Logger.info("📋 Customer data extracted from Workflow:", extractedData)
//       return extractedData
//     }

//     return undefined
//   }

//   private static async processLeadQualification(context: ProcessingContext) {
//     // Run lead qualification in background without blocking response
//     setImmediate(async () => {
//       try {
//         Logger.info("🔍 Starting lead qualification analysis for workflow user...")

//         const leadAnalysisResult = (await Promise.race([
//           analyzeLead({
//             userId: context.automation.User.id,
//             automationId: context.automation.id,
//             platformId: context.data.pageId,
//             customerId: context.data.senderId,
//             message: context.userMessage,
//             messageType: context.data.messageType,
//             timestamp: new Date(),
//           }),
//           new Promise((_, reject) => setTimeout(() => reject(new Error("Lead analysis timeout")), 10000)),
//         ])) as any

//         if (leadAnalysisResult && leadAnalysisResult.lead) {
//           Logger.success(`📊 Lead analysis completed for workflow user ${context.data.senderId}`)
//         }
//       } catch (error) {
//         Logger.error("❌ Error in lead qualification for workflow user (running in background):", error)
//       }
//     })
//   }
// }

// class VoiceflowHandler {
//   static async handle(context: ProcessingContext): Promise<ProcessingResult> {
//     Logger.info("🎙️ === VOICEFLOW HANDLER (PRO USERS) ===")

//     try {
//       if (await this.isRateLimited(context)) {
//         throw new Error("Rate limit exceeded for Voiceflow processing")
//       }

//       const contextData = await this.gatherContext(context)

//       // Get business using automationId since business.automationId links to automation.id
//       Logger.info(`🔍 Looking up business for automation: ${context.automation.id}`)

//       const business = await getBusinessByAutomationId(context.automation.id)

//       if (!business) {
//         Logger.error(`❌ No business found for automation: ${context.automation.id}`)
//         throw new Error(`No business linked to automation: ${context.automation.id}`)
//       }

//       const businessId = business.id
//       Logger.info(`✅ Found business: ${businessId}`)

//       // Now proceed with the business variables
//       const businessVariables = await RetryManager.withRetry(
//         () =>
//           fetchEnhancedBusinessVariables(
//             businessId,
//             context.automation.id,
//             context.automation.businessWorkflowConfig?.id || null,
//             {
//               pageId: context.data.pageId,
//               senderId: context.data.senderId,
//               userMessage: context.userMessage,
//               isNewUser: contextData.conversationHistory.length === 0,
//               customerType:
//                 contextData.conversationHistory.length >= 10
//                   ? "VIP"
//                   : contextData.conversationHistory.length > 0
//                     ? "RETURNING"
//                     : "NEW",
//               messageHistory: contextData.conversationHistory,
//             },
//           ),
//         "Fetch business variables",
//       )

//       const response = await this.processVoiceflowWithRetry(context, contextData, businessVariables)

//       return {
//         success: true,
//         responseText: response.text,
//         buttons: response.buttons,
//         quickReplies: response.quickReplies,
//         carousel: response.carousel,
//         attachment: response.attachment,
//         variables: response.variables,
//         extractedData: response.extractedData,
//         aiSystem: response.aiSystem,
//       }
//     } catch (error) {
//       Logger.error("Voiceflow handler failed completely", error)
//       throw error
//     }
//   }

//   private static async isRateLimited(context: ProcessingContext): Promise<boolean> {
//     const count = await getRecentResponseCount(context.data.pageId, context.data.senderId, context.data.messageType, 2)
//     if (count >= CONFIG.RATE_LIMITS.MAX_RESPONSES_PER_2MIN) {
//       Logger.warning(`Rate limit exceeded: ${count} responses in 2 minutes`)
//       return true
//     }
//     return false
//   }

//   private static async gatherContext(context: ProcessingContext) {
//     Logger.debug("Gathering Voiceflow context...")

//     const [historyResult, profileResult] = await Promise.allSettled([
//       TimeoutManager.withTimeout(
//         buildConversationContext(context.data.pageId, context.data.senderId, context.automation.id),
//         CONFIG.TIMEOUTS.PROFILE,
//         "Conversation history",
//       ),
//       TimeoutManager.withTimeout(
//         getBusinessProfileForAutomation(context.automation.id),
//         CONFIG.TIMEOUTS.PROFILE,
//         "Business profile",
//       ),
//     ])

//     const conversationHistory =
//       historyResult.status === "fulfilled" && Array.isArray(historyResult.value) ? historyResult.value : []

//     const profile =
//       profileResult.status === "fulfilled" ? profileResult.value : { profileContent: "", businessContext: {} }

//     Logger.success(`Context gathered - History: ${conversationHistory.length} messages`)

//     return { conversationHistory, profile }
//   }

//   private static async processVoiceflowWithRetry(
//     context: ProcessingContext,
//     contextData: any,
//     businessVariables: Record<string, string>,
//   ) {
//     Logger.debug("Processing with Voiceflow (enhanced with all message types)...")

//     // Create Voiceflow user (non-blocking)
//     createVoiceflowUser(context.conversationUserId).catch((error) =>
//       Logger.warning("Voiceflow user creation failed", error),
//     )

//     // Retrieve Voiceflow credentials from environment variables
//     const voiceflowApiKey = process.env.VOICEFLOW_API_KEY
//     const voiceflowProjectId = process.env.VOICEFLOW_PROJECT_ID
//     const voiceflowVersionId = process.env.VOICEFLOW_VERSION_ID

//     if (!voiceflowApiKey || !voiceflowProjectId) {
//       throw new Error("Voiceflow API Key or Project ID is missing from environment variables")
//     }

//     const isFirstMessage = contextData.conversationHistory.length === 0

//     // Use retry mechanism for Voiceflow API calls
//     const voiceflowResult = await RetryManager.withRetry(
//       async () => {
//         const result = await TimeoutManager.withTimeout(
//           getEnhancedVoiceflowResponse(
//             context.userMessage,
//             context.conversationUserId,
//             businessVariables,
//             voiceflowApiKey,
//             voiceflowProjectId,
//             voiceflowVersionId,
//             {
//               maxRetries: 1,
//               timeoutMs: CONFIG.TIMEOUTS.VOICEFLOW,
//               enableFallbackDetection: false,
//               isFirstMessage,
//             },
//           ),
//           CONFIG.TIMEOUTS.VOICEFLOW,
//           "Voiceflow API call",
//         )

//         // Enhanced validation for all response types
//         if (!result.success || !result.response) {
//           throw new Error(`Voiceflow returned invalid response: ${result.error || "Empty response"}`)
//         }

//         // Check if we have at least some content
//         const hasContent =
//           result.response.text ||
//           result.response.quickReplies?.length ||
//           result.response.buttons?.length ||
//           result.response.carousel?.length ||
//           result.response.attachment

//         if (!hasContent) {
//           throw new Error("Voiceflow returned response with no content")
//         }

//         return result
//       },
//       "Voiceflow API processing",
//       CONFIG.RETRY.MAX_ATTEMPTS,
//     )

//     Logger.success("✨ Enhanced Voiceflow response successful")

//     // Extract customer data from Voiceflow variables
//     const extractedData = this.extractCustomerData(voiceflowResult.variables)

//     // Process lead qualification in background (non-blocking)
//     if (context.automation.User?.id && context.data.senderId !== context.data.pageId) {
//       this.processLeadQualification(context, extractedData)
//     }

//     return {
//       text: voiceflowResult.response?.text,
//       quickReplies: voiceflowResult.response?.quickReplies,
//       buttons: voiceflowResult.response?.buttons,
//       carousel: voiceflowResult.response?.carousel,
//       attachment: voiceflowResult.response?.attachment,
//       variables: voiceflowResult.variables,
//       extractedData,
//       aiSystem: "voiceflow_enhanced_full",
//     }
//   }

//   private static extractCustomerData(variables: any): { name?: string; email?: string; phone?: string } | undefined {
//     if (!variables) return undefined

//     const extractedData = {
//       name:
//         variables.customer_name || variables.clientname || variables.name || variables.user_name || variables.full_name,
//       email:
//         variables.customer_email ||
//         variables.clientemail ||
//         variables.email ||
//         variables.user_email ||
//         variables.email_address,
//       phone:
//         variables.customer_phone ||
//         variables.clientphone ||
//         variables.phone ||
//         variables.user_phone ||
//         variables.phone_number,
//     }

//     // Only return if we have at least one piece of data
//     if (extractedData.name || extractedData.email || extractedData.phone) {
//       Logger.info("📋 Customer data extracted from Voiceflow:", extractedData)
//       return extractedData
//     }

//     return undefined
//   }

//   private static async processLeadQualification(
//     context: ProcessingContext,
//     extractedData?: { name?: string; email?: string; phone?: string },
//   ) {
//     // Run lead qualification in background without blocking response
//     setImmediate(async () => {
//       try {
//         Logger.info("🔍 Starting lead qualification analysis...")

//         const leadAnalysisResult = (await Promise.race([
//           analyzeLead({
//             userId: context.automation.User.id,
//             automationId: context.automation.id,
//             platformId: context.data.pageId,
//             customerId: context.data.senderId,
//             message: context.userMessage,
//             messageType: context.data.messageType,
//             timestamp: new Date(),
//           }),
//           new Promise((_, reject) => setTimeout(() => reject(new Error("Lead analysis timeout")), 10000)),
//         ])) as any

//         if (leadAnalysisResult && leadAnalysisResult.lead) {
//           Logger.success(`📊 Lead analysis completed for ${context.data.senderId}`)

//           // Store marketing info if we extracted customer data
//           if (extractedData && (extractedData.name || extractedData.email || extractedData.phone)) {
//             await this.storeMarketingInfo(context.automation.User.id, extractedData, leadAnalysisResult.lead.id)
//           }
//         }
//       } catch (error) {
//         Logger.error("❌ Error in lead qualification (running in background):", error)
//       }
//     })
//   }

//   private static async storeMarketingInfo(
//     userId: string,
//     extractedData: { name?: string; email?: string; phone?: string },
//     leadId?: string,
//   ) {
//     try {
//       // Create marketing info record
//       await client.marketingInfo.create({
//         data: {
//           name: extractedData.name,
//           email: extractedData.email,
//           phone: extractedData.phone,
//           userId: userId,
//         },
//       })

//       // Update lead with extracted data if we have a lead ID
//       if (leadId) {
//         await client.lead.update({
//           where: { id: leadId },
//           data: {
//             name: extractedData.name,
//             email: extractedData.email,
//             phone: extractedData.phone,
//             metadata: {
//               dataCollectionTimestamp: new Date().toISOString(),
//               extractedFromVoiceflow: true,
//             },
//           },
//         })
//       }

//       Logger.success("📝 Marketing info and lead data stored successfully")
//     } catch (error) {
//       Logger.error("❌ Error storing marketing info:", error)
//     }
//   }
// }

// class BackgroundProcessor {
//   static process(
//     context: ProcessingContext,
//     responseText: string,
//     extractedData?: { name?: string; email?: string; phone?: string },
//   ): void {
//     Logger.debug("🔄 Starting enhanced background tasks...")

//     Promise.allSettled([
//       storeConversationMessage(
//         context.data.pageId,
//         context.data.senderId,
//         context.userMessage,
//         false,
//         context.automation?.id || null,
//       ),
//       storeConversationMessage(context.data.pageId, "bot", responseText, true, context.automation?.id || null),
//       context.automation?.id
//         ? trackMessageForSentiment(
//             context.automation.id,
//             context.data.pageId,
//             context.data.senderId,
//             context.userMessage,
//           )
//         : Promise.resolve(),
//       createChatHistory(
//         context.automation?.id || null,
//         context.data.pageId,
//         context.data.senderId,
//         context.userMessage,
//       ),
//       createChatHistory(context.automation?.id || null, context.data.pageId, context.data.senderId, responseText),
//       // Update conversation state with enhanced data
//       updateConversationState(context.conversationUserId, {
//         isActive: true,
//         lastTriggerType: context.triggerDecision.triggerType,
//         lastTriggerReason: context.triggerDecision.reason,
//         automationId: context.automation.id,
//         listenMode: context.triggerDecision.triggerType === "KEYWORD" ? "KEYWORDS" : "ALL_MESSAGES",
//         lastMessageLength: context.userMessage.length,
//       }),
//       // Log trigger execution
//       context.triggerDecision.automationId && context.triggerDecision.triggerId && context.automation.User?.id
//         ? logTriggerExecution({
//             triggerId: context.triggerDecision.triggerId,
//             automationId: context.triggerDecision.automationId,
//             userId: context.automation.User.id,
//             messageContent: context.userMessage,
//             triggerType: context.triggerDecision.triggerType as any,
//             confidence: context.triggerDecision.confidence,
//             reason: context.triggerDecision.reason,
//             success: true,
//             responseTime: Date.now() - context.startTime,
//           })
//         : Promise.resolve(),
//     ])
//       .then((results) => {
//         const failures = results.filter((r) => r.status === "rejected").length
//         if (failures === 0) {
//           Logger.success("✅ All enhanced background tasks completed successfully")
//         } else {
//           Logger.warning(`⚠️ ${failures} background tasks failed`)
//         }
//       })
//       .catch((error) => Logger.warning("Enhanced background tasks failed", error))
//   }
// }

// export async function GET(req: NextRequest) {
//   const hub = req.nextUrl.searchParams.get("hub.challenge")
//   return new NextResponse(hub)
// }

// export async function POST(req: NextRequest) {
//   Logger.info("🚀 POST request received")
//   const startTime = Date.now()
//   let webhook_payload

//   try {
//     webhook_payload = await req.json()
//     Logger.debug("📥 Received webhook payload:", webhook_payload)

//     // Handle deauth webhooks
//     const specialWebhook = WebhookValidator.isSpecialWebhook(webhook_payload)
//     if (specialWebhook === "deauth") {
//       Logger.info("🔐 Processing Instagram deauthorization webhook")
//       const signature = req.headers.get("x-hub-signature-256")
//       const body = JSON.stringify(webhook_payload)

//       if (!signature || !verifyInstagramWebhook(signature, body, process.env.INSTAGRAM_CLIENT_SECRET!)) {
//         Logger.error("❌ Invalid webhook signature for deauth")
//         return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
//       }

//       const result = await handleInstagramDeauthWebhook(webhook_payload)
//       return NextResponse.json(result, { status: result.status })
//     }

//     // Handle data deletion webhooks
//     if (specialWebhook === "data_deletion") {
//       Logger.info("🗑️ Processing Instagram data deletion webhook")
//       const signature = req.headers.get("x-hub-signature-256")
//       const body = JSON.stringify(webhook_payload)

//       if (!signature || !verifyInstagramWebhook(signature, body, process.env.INSTAGRAM_CLIENT_SECRET!)) {
//         Logger.error("❌ Invalid webhook signature for data deletion")
//         return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
//       }

//       const result = await handleInstagramDataDeletionWebhook(webhook_payload)
//       return NextResponse.json(result, { status: result.status })
//     }

//     // Handle read receipts and delivery confirmations
//     if (specialWebhook === "receipt") {
//       Logger.debug("📖 Received read receipt or delivery confirmation - acknowledging")
//       return NextResponse.json({ message: "Read receipt acknowledged" }, { status: 200 })
//     }

//     const data = WebhookValidator.extractData(webhook_payload)

//     if (!data) {
//       Logger.warning("⚠️ Unsupported webhook payload structure or non-text message")
//       return NextResponse.json({ message: "Unsupported webhook payload" }, { status: 200 })
//     }

//     // Skip echo messages (messages sent by the bot)
//     if (data.isEcho) {
//       Logger.debug("🔄 Skipping echo message (sent by bot)")
//       return NextResponse.json({ message: "Echo message ignored" }, { status: 200 })
//     }

//     await MessageProcessor.processImmediate(data, startTime)

//     const processingTime = Date.now() - startTime
//     Logger.performance("Successfully processed webhook request", startTime)

//     // Get Voiceflow health for response
//     const voiceflowHealth = getVoiceflowHealth()

//     return NextResponse.json(
//       {
//         message: "Request processed successfully",
//         processingTime,
//         messageType: data.messageType,
//         voiceflowHealth: voiceflowHealth,
//         memoryMetrics: EnhancedMemoryManager.getInstance().getMetrics(),
//       },
//       { status: 200 },
//     )
//   } catch (error) {
//     Logger.error("💥 Unhandled error in POST function:", error)
//     return NextResponse.json(
//       {
//         message: "Error processing request",
//         error: error instanceof Error ? error.message : String(error),
//       },
//       { status: 500 },
//     )
//   }
// }

// class ResponseSender {
//   static async send(context: ProcessingContext, voiceflowResponse: VoiceflowResponse): Promise<void> {
//     Logger.info(`📤 Sending enhanced response with ${voiceflowResponse.text ? "text" : "template"}...`)

//     // Transform Voiceflow response to Instagram format using the updated function
//     const transformed = transformVoiceflowToInstagram(voiceflowResponse)

//     // Check for duplicates based on text content
//     const textContent = transformed.text || "template_message"
//     const isDuplicate = await checkDuplicateResponse(
//       context.data.pageId,
//       context.data.senderId,
//       textContent,
//       context.data.messageType,
//     )

//     if (isDuplicate) {
//       Logger.warning("Duplicate response detected, skipping send to avoid spam")
//       return
//     }

//     const token = context.automation?.User?.integrations?.[0]?.token || process.env.DEFAULT_PAGE_TOKEN!

//     // Use retry mechanism for sending enhanced messages
//     await RetryManager.withRetry(
//       async () => {
//         let result

//         if (context.data.messageType === "DM") {
//           Logger.debug("Sending enhanced DM using updated sendDMs function")
//           // Ensure the transformed object matches InstagramAlignedMessage type
//           const alignedMessage: InstagramAlignedMessage = {
//             text: transformed.text,
//             quickReplies: transformed.quickReplies?.map((qr) => ({
//               content_type: "text" as const,
//               title: qr.title,
//               payload: qr.payload || qr.title,
//             })),
//             buttons: transformed.buttons?.map((btn) => ({
//               title: btn.title,
//               payload: btn.payload || btn.title,
//               url: btn.url,
//             })),
//             carousel: transformed.carousel?.map((element) => ({
//               title: element.title,
//               subtitle: element.subtitle,
//               image_url: element.image_url,
//               buttons: element.buttons?.map((btn) => ({
//                 title: btn.title,
//                 payload: btn.payload || btn.title,
//                 url: btn.url,
//               })),
//             })),
//             attachment:
//               transformed.attachment && ["image", "video", "audio", "file"].includes(transformed.attachment.type)
//                 ? {
//                     type: transformed.attachment.type as "image" | "video" | "audio" | "file",
//                     url: (transformed.attachment as any).url || "",
//                     caption: (transformed.attachment as any).caption,
//                   }
//                 : undefined,
//           }

//           result = await TimeoutManager.withTimeout(
//             sendDMs(context.data.pageId, context.data.senderId, alignedMessage, token, "DM"),
//             10000,
//             "Enhanced DM send",
//           )
//         } else if (context.data.messageType === "COMMENT" && context.data.commentId) {
//           Logger.debug("Sending enhanced private message using updated sendPrivateMessages function")
//           result = await TimeoutManager.withTimeout(
//             sendPrivateMessages(
//               context.data.pageId,
//               context.data.commentId,
//               transformed.text,
//               token,
//               transformed.quickReplies,
//               transformed.buttons,
//               transformed.carousel,
//               transformed.attachment,
//             ),
//             10000,
//             "Enhanced Comment send",
//           )
//         }

//         if (result?.status !== 200) {
//           throw new Error(`Enhanced send failed with status: ${result?.status}`)
//         }

//         Logger.success(`✅ Enhanced response sent successfully`)

//         // Mark response as sent
//         await Promise.allSettled([
//           markResponseAsSent(
//             context.data.pageId,
//             context.data.senderId,
//             textContent,
//             context.data.messageType,
//             context.automation.id,
//           ),
//           trackResponses(context.automation.id, context.data.messageType),
//         ])

//         return result
//       },
//       "Enhanced message sending",
//       CONFIG.RETRY.MAX_ATTEMPTS,
//     )
//   }
// }

// function verifyWebhookSignature(payload: string, signature: string | null): boolean {
//   if (!signature) return false

//   const crypto = require("crypto")
//   const secret = process.env.INSTAGRAM_WEBHOOK_SECRET || ""

//   const expectedSignature = "sha256=" + crypto.createHmac("sha256", secret).update(payload).digest("hex")

//   return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
// }
