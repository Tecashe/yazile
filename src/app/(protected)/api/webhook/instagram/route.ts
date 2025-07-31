
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
// import { sendDM, sendPrivateMessage } from "@/lib/fetch"
// import { client } from "@/lib/prisma"
// import { storeConversationMessage } from "@/actions/chats/queries"
// import { handleInstagramDeauthWebhook, handleInstagramDataDeletionWebhook } from "@/lib/deauth"
// import { verifyInstagramWebhook } from "@/utils/instagram"
// import { trackMessageForSentiment } from "@/lib/sentiment-tracker"

// // ============================================================================
// // TYPES & INTERFACES
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
//   automation: any // This will now include businessWorkflowConfig
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
//   variables?: Record<string, any>
//   aiSystem: string
//   error?: string
//   extractedData?: {
//     name?: string
//     email?: string
//     phone?: string
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
//   CLEANUP_INTERVAL: 5 * 60 * 1000,
//   FALLBACK_RESPONSES: {
//     PRO: "Thank you for your message! As a valued customer, I want to ensure you get the best possible assistance. Let me get back to you with detailed information shortly. 🌟",
//     STANDARD: "Thanks for your message! I'm here to help. Let me get back to you with the information you need. 😊",
//     EMERGENCY: "Hi! Thanks for reaching out. I'm here to help! 😊",
//     SIMPLE: "Hello! 👋",
//   },
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
// // WEBHOOK VALIDATOR
// // ============================================================================

// class WebhookValidator {
//   static extractData(payload: any): WebhookData | null {
//     try {
//       if (payload?.entry?.[0]?.messaging) {
//         const messaging = payload.entry[0].messaging[0]

//         if (messaging.read || messaging.delivery) {
//           Logger.debug("Ignoring read receipt or delivery confirmation")
//           return null
//         }

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

// // ============================================================================
// // BUTTON TRANSFORMER
// // ============================================================================

// function transformButtonsToInstagram(
//   buttons?: { name: string; payload: string | object | any }[],
// ): { name: string; payload: string }[] | undefined {
//   if (!buttons || buttons.length === 0) return undefined

//   return buttons.slice(0, 11).map((button) => {
//     const buttonName = String(button.name || "").substring(0, 20) || "Option"
//     let buttonPayload: string

//     if (typeof button.payload === "string") {
//       buttonPayload = button.payload.substring(0, 1000)
//     } else if (button.payload === null || button.payload === undefined) {
//       buttonPayload = buttonName
//     } else {
//       try {
//         buttonPayload = JSON.stringify(button.payload).substring(0, 1000)
//       } catch (e) {
//         buttonPayload = String(button.payload).substring(0, 1000)
//       }
//     }

//     return {
//       name: buttonName,
//       payload: buttonPayload,
//     }
//   })
// }

// // ============================================================================
// // MESSAGE PROCESSOR
// // ============================================================================

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
//       await this.handleProcessingFailure(data, error)
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
//     Logger.info(`Routing to ${isPROUser ? "PRO Voiceflow" : "Standard Gemini"} handler`)

//     let result: ProcessingResult

//     if (isPROUser) {
//       result = await VoiceflowHandler.handle(context)
//     } else {
//       result = await GeminiHandler.handle(context)
//     }

//     if (!result.success) {
//       throw new Error(`AI processing failed: ${result.error}`)
//     }

//     await ResponseSender.send(context, result.responseText!, result.buttons)
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
//                     // ADD THIS BLOCK
//                     where: { name: "INSTAGRAM" }, // Filter for Instagram integration
//                     select: { token: true }, // Only select the token
//                   },
//                 },
//               },
//               businessWorkflowConfig: {
//                 select: { id: true },
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

//       Logger.success(`Context built - Automation: ${automation.id} (${automation.User?.subscription?.plan || "FREE"})`)

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

//   private static async handleProcessingFailure(data: WebhookData, error: any): Promise<void> {
//     Logger.error("Handling processing failure", error)

//     try {
//       const emergencyResponse = CONFIG.FALLBACK_RESPONSES.EMERGENCY
//       const token = process.env.DEFAULT_PAGE_TOKEN

//       if (!token) {
//         Logger.error("DEFAULT_PAGE_TOKEN is not set in environment variables!")
//         return
//       }

//       if (data.messageType === "DM") {
//         await sendDM(data.pageId, data.senderId, emergencyResponse, token)
//       } else if (data.messageType === "COMMENT" && data.commentId) {
//         await sendPrivateMessage(data.pageId, data.commentId, emergencyResponse, token)
//       }

//       Logger.success("Emergency response sent successfully")
//     } catch (emergencyError) {
//       Logger.error("Emergency response also failed", emergencyError)
//     }
//   }
// }

// // ============================================================================
// // ENHANCED VOICEFLOW HANDLER WITH DATA COLLECTION
// // ============================================================================

// class VoiceflowHandler {
//   static async handle(context: ProcessingContext): Promise<ProcessingResult> {
//     Logger.info("🎙️ === ENHANCED VOICEFLOW WITH DATA COLLECTION INITIATED ===")

//     try {
//       if (await this.isRateLimited(context)) {
//         return {
//           success: false,
//           aiSystem: "voiceflow_rate_limited",
//           error: "Rate limit exceeded",
//         }
//       }

//       const contextData = await this.gatherContext(context)

//       // NEW: Fetch enhanced business variables here, including decrypted client credentials
//       const businessVariables = await fetchEnhancedBusinessVariables(
//         context.automation.businessId, // Use the businessId from the automation
//         context.automation.id, // Pass automation ID
//         context.automation.businessWorkflowConfig?.id || null, // Pass the linked workflow config ID
//         {
//           // Pass conversation context
//           pageId: context.data.pageId,
//           senderId: context.data.senderId,
//           userMessage: context.userMessage,
//           isNewUser: contextData.conversationHistory.length === 0,
//           customerType:
//             contextData.conversationHistory.length >= 10
//               ? "VIP"
//               : contextData.conversationHistory.length > 0
//                 ? "RETURNING"
//                 : "NEW",
//           messageHistory: contextData.conversationHistory,
//         },
//       )

//       const response = await this.processVoiceflowWithVariables(context, contextData, businessVariables) // Pass businessVariables

//       return {
//         success: true,
//         responseText: response.text,
//         buttons: response.buttons,
//         variables: response.variables,
//         extractedData: response.extractedData,
//         aiSystem: response.aiSystem,
//       }
//     } catch (error) {
//       Logger.error("Voiceflow handler failed", error)
//       return {
//         success: false,
//         aiSystem: "voiceflow_failed",
//         error: error instanceof Error ? error.message : String(error),
//       }
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

//   private static async processVoiceflowWithVariables(
//     context: ProcessingContext,
//     contextData: any,
//     businessVariables: Record<string, string>, // NEW: Accept businessVariables
//   ) {
//     Logger.debug("Processing with enhanced Voiceflow...")

//     // Create Voiceflow user (non-blocking)
//     createVoiceflowUser(context.conversationUserId).catch((error) =>
//       Logger.warning("Voiceflow user creation failed", error),
//     )

//     // Retrieve Voiceflow credentials from environment variables (my SaaS's credentials)
//     const voiceflowApiKey = process.env.VOICEFLOW_API_KEY
//     const voiceflowProjectId = process.env.VOICEFLOW_PROJECT_ID
//     const voiceflowVersionId = process.env.VOICEFLOW_VERSION_ID // Optional

//     if (!voiceflowApiKey || !voiceflowProjectId) {
//       Logger.error(
//         "Voiceflow API Key or Project ID is missing from environment variables. Cannot proceed with Voiceflow.",
//       )
//       return this.handleVoiceflowFallback(context, contextData, "Missing Voiceflow environment variables")
//     }

//     try {
//       const isFirstMessage = contextData.conversationHistory.length === 0

//       const voiceflowResult = await TimeoutManager.withTimeout(
//         getEnhancedVoiceflowResponse(
//           context.userMessage,
//           context.conversationUserId,
//           businessVariables, // Pass the fetched businessVariables here
//           voiceflowApiKey,
//           voiceflowProjectId,
//           voiceflowVersionId, // Pass optional version ID
//           {
//             maxRetries: 3,
//             timeoutMs: CONFIG.TIMEOUTS.VOICEFLOW,
//             enableFallbackDetection: true,
//             isFirstMessage,
//           },
//         ),
//         CONFIG.TIMEOUTS.VOICEFLOW,
//         "Enhanced Voiceflow response",
//       )

//       if (voiceflowResult.success && voiceflowResult.response?.text) {
//         Logger.success("✨ Enhanced Voiceflow response successful")

//         // Extract customer data from Voiceflow variables
//         const extractedData = this.extractCustomerData(voiceflowResult.variables)

//         // Process lead qualification in background (non-blocking)
//         if (context.automation.User?.id && context.data.senderId !== context.data.pageId) {
//           this.processLeadQualification(context, extractedData)
//         }

//         return {
//           text: voiceflowResult.response.text,
//           buttons: voiceflowResult.response.quickReplies,
//           variables: voiceflowResult.variables,
//           extractedData,
//           aiSystem: "enhanced_voiceflow_with_data_collection",
//         }
//       } else {
//         Logger.warning(`Voiceflow failed: ${voiceflowResult.fallbackReason || voiceflowResult.error}`)
//         return this.handleVoiceflowFallback(
//           context,
//           contextData,
//           voiceflowResult.fallbackReason || voiceflowResult.error ||"We have an error",
//         )
//       }
//     } catch (error) {
//       Logger.warning("Voiceflow failed, falling back to Gemini", error)
//       return this.handleVoiceflowFallback(context, contextData, error instanceof Error ? error.message : String(error))
//     }
//   }

//   // Add a helper method for fallback logic to avoid repetition
//   private static async handleVoiceflowFallback(context: ProcessingContext, contextData: any, reason: string) {
//     Logger.info(`🔄 Voiceflow fallback triggered due to: ${reason}. Using Gemini Pro fallback...`)
//     try {
//       const geminiResponse = await TimeoutManager.withTimeout(
//         generateGeminiResponse({
//           userMessage: context.userMessage,
//           businessProfile: contextData.profile.profileContent,
//           conversationHistory: contextData.conversationHistory,
//           businessContext: contextData.profile.businessContext,
//           isPROUser: true,
//           isVoiceflowFallback: true,
//         }),
//         CONFIG.TIMEOUTS.GEMINI,
//         "Gemini response",
//       )

//       const responseText = typeof geminiResponse === "string" ? geminiResponse : CONFIG.FALLBACK_RESPONSES.PRO

//       Logger.success("✨ Gemini Pro fallback successful")
//       return {
//         success: true,
//         responseText,
//         buttons: undefined,
//         variables: undefined,
//         extractedData: undefined,
//         aiSystem: "gemini_pro_fallback",
//       }
//     } catch (error) {
//       Logger.warning("🚫 Gemini quota exceeded, using human-like fallback")
//       return {
//         text: CONFIG.FALLBACK_RESPONSES.PRO,
//         buttons: undefined,
//         variables: undefined,
//         extractedData: undefined,
//         aiSystem: "static_pro_fallback",
//       }
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
//       Logger.info("📝 Customer data extracted from Voiceflow:", extractedData)
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
// // GEMINI HANDLER (ENHANCED WITH LEAD QUALIFICATION)
// // ============================================================================

// class GeminiHandler {
//   static async handle(context: ProcessingContext): Promise<ProcessingResult> {
//     Logger.info("🔮 === ENHANCED GEMINI HANDLER INITIATED ===")

//     try {
//       const count = await getRecentResponseCount(
//         context.data.pageId,
//         context.data.senderId,
//         context.data.messageType,
//         2,
//       )
//       if (count >= CONFIG.RATE_LIMITS.MAX_RESPONSES_PER_2MIN) {
//         Logger.warning(`Rate limit exceeded: ${count} responses`)
//         return {
//           success: false,
//           aiSystem: "gemini_rate_limited",
//           error: "Rate limit exceeded",
//         }
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

//       const geminiResponse = await TimeoutManager.withTimeout(
//         generateGeminiResponse({
//           userMessage: context.userMessage,
//           businessProfile: profile.profileContent,
//           conversationHistory: history,
//           businessContext: profile.businessContext,
//           isPROUser: false,
//         }),
//         CONFIG.TIMEOUTS.GEMINI,
//         "Gemini response",
//       )

//       const responseText = typeof geminiResponse === "string" ? geminiResponse : CONFIG.FALLBACK_RESPONSES.STANDARD

//       Logger.success("✨ Gemini response successful")

//       return {
//         success: true,
//         responseText,
//         buttons: undefined,
//         variables: undefined,
//         extractedData: undefined,
//         aiSystem: "enhanced_gemini",
//       }
//     } catch (error) {
//       Logger.error("Gemini handler failed", error)
//       return {
//         success: false,
//         responseText: CONFIG.FALLBACK_RESPONSES.STANDARD,
//         aiSystem: "gemini_failed_fallback",
//         error: error instanceof Error ? error.message : String(error),
//       }
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
// // ENHANCED RESPONSE SENDER
// // ============================================================================

// class ResponseSender {
//   static async send(context: ProcessingContext, text: string, buttons?: any[]): Promise<void> {
//     Logger.info(`📤 Sending response: "${text.substring(0, 100)}..."`)

//     const isDuplicate = await checkDuplicateResponse(
//       context.data.pageId,
//       context.data.senderId,
//       text,
//       context.data.messageType,
//     )

//     if (isDuplicate) {
//       Logger.warning("Duplicate response detected, skipping")
//       return
//     }

//     const formattedButtons = transformButtonsToInstagram(buttons)
//     const token = context.automation?.User?.integrations?.[0]?.token || process.env.DEFAULT_PAGE_TOKEN!

//     const fallbackResponses = [text, CONFIG.FALLBACK_RESPONSES.STANDARD, CONFIG.FALLBACK_RESPONSES.EMERGENCY]

//     for (let i = 0; i < fallbackResponses.length; i++) {
//       try {
//         const currentResponse = fallbackResponses[i]
//         let result

//         Logger.debug(`Attempt ${i + 1}: Sending "${currentResponse.substring(0, 50)}..."`)

//         if (context.data.messageType === "DM") {
//           result = await TimeoutManager.withTimeout(
//             sendDM(
//               context.data.pageId,
//               context.data.senderId,
//               currentResponse,
//               token,
//               i === 0 ? formattedButtons : undefined,
//             ),
//             10000,
//             `DM send attempt ${i + 1}`,
//           )
//         } else if (context.data.messageType === "COMMENT" && context.data.commentId) {
//           result = await TimeoutManager.withTimeout(
//             sendPrivateMessage(
//               context.data.pageId,
//               context.data.commentId,
//               currentResponse,
//               token,
//               i === 0 ? formattedButtons : undefined,
//             ),
//             10000,
//             `Comment send attempt ${i + 1}`,
//           )
//         }

//         if (result?.status === 200) {
//           Logger.success(`✅ Response sent successfully (attempt ${i + 1})`)

//           await Promise.allSettled([
//             markResponseAsSent(
//               context.data.pageId,
//               context.data.senderId,
//               currentResponse,
//               context.data.messageType,
//               context.automation.id,
//             ),
//             trackResponses(context.automation.id, context.data.messageType),
//           ])

//           return
//         } else {
//           Logger.warning(`Attempt ${i + 1} returned status: ${result?.status}`)
//         }
//       } catch (error) {
//         Logger.error(`Send attempt ${i + 1} failed`, error)
//         if (i === fallbackResponses.length - 1) {
//           throw new Error(`All ${fallbackResponses.length} send attempts failed`)
//         }
//       }
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
 
import { type NextRequest, NextResponse } from "next/server"
import {
  createChatHistory,
  trackResponses,
  checkProcessedMessage,
  markMessageAsProcessed,
  decideTriggerAction,
  updateConversationState,
  logTriggerExecution,
  checkDuplicateResponse,
  getRecentResponseCount,
  markResponseAsSent,
} from "@/actions/webhook/queries"
import { getBusinessProfileForAutomation, getOrCreateDefaultAutomation } from "@/actions/webhook/business-profile"
import { generateGeminiResponse, buildConversationContext } from "@/lib/gemini"
import {
  createVoiceflowUser,
  fetchEnhancedBusinessVariables,
  getVoiceflowHealth,
  getEnhancedVoiceflowResponse,
} from "@/lib/voiceflow"
import { analyzeLead } from "@/lib/lead-qualification"
import { sendDM, sendPrivateMessage } from "@/lib/fetch"
import { client } from "@/lib/prisma"
import { storeConversationMessage } from "@/actions/chats/queries"
import { handleInstagramDeauthWebhook, handleInstagramDataDeletionWebhook } from "@/lib/deauth"
import { verifyInstagramWebhook } from "@/utils/instagram"
import { trackMessageForSentiment } from "@/lib/sentiment-tracker"

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface WebhookData {
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
  data: WebhookData
  automation: any
  conversationUserId: string
  userMessage: string
  triggerDecision: any
  startTime: number
  messageKey: string
}

interface ProcessingResult {
  success: boolean
  responseText?: string
  buttons?: any[]
  variables?: Record<string, any>
  aiSystem: string
  error?: string
  extractedData?: {
    name?: string
    email?: string
    phone?: string
  }
}

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

const CONFIG = {
  TIMEOUTS: {
    VOICEFLOW: 15000,
    GEMINI: 10000,
    PROFILE: 5000,
    TOTAL_PROCESSING: 30000,
  },
  RATE_LIMITS: {
    MAX_RESPONSES_PER_2MIN: 3,
    DUPLICATE_WINDOW: 8000,
  },
  RETRY: {
    MAX_ATTEMPTS: 3,
    BASE_DELAY: 1000,
    MAX_DELAY: 5000,
    BACKOFF_MULTIPLIER: 2,
  },
  CLEANUP_INTERVAL: 5 * 60 * 1000,
} as const

// ============================================================================
// ENHANCED MEMORY MANAGEMENT
// ============================================================================

class EnhancedMemoryManager {
  private static instance: EnhancedMemoryManager
  private recentMessages = new Map<string, number>()
  private processingMessages = new Set<string>()
  private cleanupInterval: NodeJS.Timeout
  private metrics = {
    duplicatesBlocked: 0,
    messagesProcessed: 0,
    cleanupRuns: 0,
  }

  private constructor() {
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, CONFIG.CLEANUP_INTERVAL)
  }

  static getInstance(): EnhancedMemoryManager {
    if (!EnhancedMemoryManager.instance) {
      EnhancedMemoryManager.instance = new EnhancedMemoryManager()
    }
    return EnhancedMemoryManager.instance
  }

  isDuplicate(key: string, timestamp: number): boolean {
    const lastTime = this.recentMessages.get(key)
    const isDupe = lastTime ? timestamp - lastTime < CONFIG.RATE_LIMITS.DUPLICATE_WINDOW : false
    if (isDupe) this.metrics.duplicatesBlocked++
    return isDupe
  }

  isProcessing(key: string): boolean {
    return this.processingMessages.has(key)
  }

  markMessage(key: string, timestamp: number): void {
    this.recentMessages.set(key, timestamp)
    this.metrics.messagesProcessed++
  }

  startProcessing(key: string): void {
    this.processingMessages.add(key)
  }

  finishProcessing(key: string): void {
    this.processingMessages.delete(key)
  }

  private cleanup(): void {
    const cutoff = Date.now() - CONFIG.CLEANUP_INTERVAL
    const keysToDelete: string[] = []

    this.recentMessages.forEach((timestamp, key) => {
      if (timestamp < cutoff) {
        keysToDelete.push(key)
      }
    })

    keysToDelete.forEach((key) => {
      this.recentMessages.delete(key)
    })

    this.processingMessages.clear()
    this.metrics.cleanupRuns++

    Logger.info(`🧹 Memory cleanup: removed ${keysToDelete.length} old entries`)
  }

  getMetrics() {
    return {
      ...this.metrics,
      recentMessagesCount: this.recentMessages.size,
      processingCount: this.processingMessages.size,
    }
  }
}

// ============================================================================
// ENHANCED LOGGER
// ============================================================================

class Logger {
  static info(message: string, data?: any): void {
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] ℹ️ ${message}`, data ? JSON.stringify(data, null, 2) : "")
  }

  static success(message: string, data?: any): void {
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] ✅ ${message}`, data ? JSON.stringify(data, null, 2) : "")
  }

  static warning(message: string, data?: any): void {
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] ⚠️ ${message}`, data ? JSON.stringify(data, null, 2) : "")
  }

  static error(message: string, error?: any): void {
    const timestamp = new Date().toISOString()
    console.error(`[${timestamp}] ❌ ${message}`, error)
  }

  static debug(message: string, data?: any): void {
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] 🔍 ${message}`, data ? JSON.stringify(data, null, 2) : "")
  }

  static performance(message: string, startTime: number): void {
    const duration = Date.now() - startTime
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] ⚡ ${message} (${duration}ms)`)
  }
}

// ============================================================================
// TIMEOUT MANAGER
// ============================================================================

class TimeoutManager {
  static async withTimeout<T>(promise: Promise<T>, timeoutMs: number, operation: string): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`${operation} timeout after ${timeoutMs}ms`)), timeoutMs)
    })

    return Promise.race([promise, timeoutPromise])
  }
}

// ============================================================================
// RETRY MANAGER
// ============================================================================

class RetryManager {
  static async withRetry<T>(
    operation: () => Promise<T>,
    operationName: string,
    maxAttempts: number = CONFIG.RETRY.MAX_ATTEMPTS,
  ): Promise<T> {
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        Logger.info(`🔄 ${operationName} - Attempt ${attempt}/${maxAttempts}`)
        const result = await operation()

        if (attempt > 1) {
          Logger.success(`✅ ${operationName} succeeded on attempt ${attempt}`)
        }

        return result
      } catch (error) {
        lastError = error as Error
        Logger.warning(`⚠️ ${operationName} failed on attempt ${attempt}: ${lastError.message}`)

        if (attempt < maxAttempts) {
          const delay = Math.min(
            CONFIG.RETRY.BASE_DELAY * Math.pow(CONFIG.RETRY.BACKOFF_MULTIPLIER, attempt - 1),
            CONFIG.RETRY.MAX_DELAY,
          )
          Logger.info(`⏳ Retrying ${operationName} in ${delay}ms...`)
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }
    }

    throw new Error(`${operationName} failed after ${maxAttempts} attempts: ${lastError?.message}`)
  }
}

// ============================================================================
// WEBHOOK VALIDATOR
// ============================================================================

class WebhookValidator {
  static extractData(payload: any): WebhookData | null {
    try {
      if (payload?.entry?.[0]?.messaging) {
        const messaging = payload.entry[0].messaging[0]

        if (messaging.read || messaging.delivery) {
          Logger.debug("Ignoring read receipt or delivery confirmation")
          return null
        }

        if (messaging.message) {
          const isEcho = messaging.message?.is_echo === true

          if (!messaging.message.text) {
            Logger.debug("Ignoring non-text message")
            return null
          }

          return {
            pageId: payload.entry[0].id,
            senderId: messaging.sender.id,
            recipientId: messaging.recipient.id,
            userMessage: messaging.message.text,
            messageId: messaging.message.mid,
            messageType: "DM",
            isEcho,
          }
        }

        if (messaging.postback) {
          return {
            pageId: payload.entry[0].id,
            senderId: messaging.sender.id,
            recipientId: messaging.recipient.id,
            userMessage: messaging.postback.payload || messaging.postback.title || "Button clicked",
            messageId: `postback_${Date.now()}`,
            messageType: "DM",
            isEcho: false,
          }
        }
      } else if (payload?.entry?.[0]?.changes && payload.entry[0].changes[0].field === "comments") {
        const changeValue = payload.entry[0].changes[0].value

        if (!changeValue.text) {
          Logger.debug("Ignoring comment without text")
          return null
        }

        return {
          pageId: payload.entry[0].id,
          senderId: changeValue.from.id,
          userMessage: changeValue.text,
          commentId: changeValue.id,
          messageType: "COMMENT",
          isEcho: false,
        }
      }
    } catch (error) {
      Logger.error("Failed to extract webhook data", error)
    }

    return null
  }

  static isSpecialWebhook(payload: any): string | null {
    if (payload?.object === "instagram" && payload?.entry?.[0]?.changes?.[0]?.field === "deauthorizations") {
      return "deauth"
    }
    if (payload?.object === "instagram" && payload?.entry?.[0]?.changes?.[0]?.field === "data_deletion") {
      return "data_deletion"
    }
    if (payload?.entry?.[0]?.messaging?.[0]?.read || payload?.entry?.[0]?.messaging?.[0]?.delivery) {
      return "receipt"
    }
    return null
  }
}

// ============================================================================
// BUTTON TRANSFORMER
// ============================================================================

function transformButtonsToInstagram(
  buttons?: { name: string; payload: string | object | any }[],
): { name: string; payload: string }[] | undefined {
  if (!buttons || buttons.length === 0) return undefined

  return buttons.slice(0, 11).map((button) => {
    const buttonName = String(button.name || "").substring(0, 20) || "Option"
    let buttonPayload: string

    if (typeof button.payload === "string") {
      buttonPayload = button.payload.substring(0, 1000)
    } else if (button.payload === null || button.payload === undefined) {
      buttonPayload = buttonName
    } else {
      try {
        buttonPayload = JSON.stringify(button.payload).substring(0, 1000)
      } catch (e) {
        buttonPayload = String(button.payload).substring(0, 1000)
      }
    }

    return {
      name: buttonName,
      payload: buttonPayload,
    }
  })
}

// ============================================================================
// MESSAGE PROCESSOR
// ============================================================================

class MessageProcessor {
  private static generateKey(data: WebhookData, timestamp: number): string {
    const baseId = data.messageId || data.commentId || `${timestamp}_${Math.random().toString(36).substr(2, 9)}`
    const messageContent = data.userMessage.substring(0, 50)
    const messageLength = data.userMessage.length
    return `${data.pageId}_${data.senderId}_${baseId}_${messageLength}_${messageContent.replace(/\s+/g, "_")}`
  }

  static async processImmediate(data: WebhookData, startTime: number): Promise<void> {
    const messageKey = this.generateKey(data, startTime)
    const duplicateKey = `${data.pageId}_${data.senderId}_${data.userMessage}_${data.messageType}`

    Logger.info(`🚀 IMMEDIATE PROCESSING: ${data.messageType} from ${data.senderId}`)
    Logger.debug(`Message: "${data.userMessage.substring(0, 100)}..."`)

    const memoryManager = EnhancedMemoryManager.getInstance()

    // Enhanced duplicate checking
    if (memoryManager.isDuplicate(duplicateKey, startTime)) {
      Logger.warning(`Duplicate message blocked: ${duplicateKey}`)
      return
    }

    if (memoryManager.isProcessing(duplicateKey)) {
      Logger.warning(`Message already being processed: ${duplicateKey}`)
      return
    }

    // Database processing check
    const isProcessed = await checkProcessedMessage(messageKey)
    if (isProcessed) {
      Logger.warning(`Message already processed in DB: ${messageKey.substring(0, 50)}...`)
      return
    }

    memoryManager.startProcessing(duplicateKey)
    memoryManager.markMessage(duplicateKey, startTime)

    try {
      await markMessageAsProcessed(messageKey)
      Logger.success(`Message marked for processing: ${messageKey.substring(0, 50)}...`)

      await TimeoutManager.withTimeout(
        this.processMessage(data, messageKey, startTime),
        CONFIG.TIMEOUTS.TOTAL_PROCESSING,
        "Total message processing",
      )

      Logger.performance("Message processing completed", startTime)
    } catch (error) {
      Logger.error("Message processing failed", error)
      // NO FALLBACK - Just log the error and let it fail
      throw error
    } finally {
      memoryManager.finishProcessing(duplicateKey)
    }
  }

  private static async processMessage(data: WebhookData, messageKey: string, startTime: number): Promise<void> {
    Logger.info(`🎯 Processing message: ${messageKey.substring(0, 50)}...`)

    const context = await this.buildProcessingContext(data, messageKey, startTime)
    if (!context) {
      throw new Error("Failed to build processing context")
    }

    const isPROUser = context.automation.User?.subscription?.plan === "PRO"
    Logger.info(`User type: ${isPROUser ? "PRO" : "Standard"}`)

    let result: ProcessingResult

    if (isPROUser) {
      // PRO users get Voiceflow with retry mechanism - NO FALLBACKS
      result = await VoiceflowHandler.handle(context)
    } else {
      // Standard users get Gemini
      result = await GeminiHandler.handle(context)
    }

    if (!result.success) {
      throw new Error(`AI processing failed: ${result.error}`)
    }

    await ResponseSender.send(context, result.responseText!, result.buttons)
    BackgroundProcessor.process(context, result.responseText!, result.extractedData)

    Logger.success(`✨ Message successfully processed with ${result.aiSystem}`)
  }

  private static async buildProcessingContext(
    data: WebhookData,
    messageKey: string,
    startTime: number,
  ): Promise<ProcessingContext | null> {
    try {
      Logger.debug("Building processing context...")

      const triggerDecision = await TimeoutManager.withTimeout(
        decideTriggerAction(data.pageId, data.senderId, data.userMessage, data.messageType),
        5000,
        "Trigger decision",
      )

      let automation = null

      // If no specific automation matched, try to get/create default automation
      if (triggerDecision.triggerType === "NO_MATCH") {
        Logger.info("🔄 No specific automation matched, checking for default automation...")
        automation = await getOrCreateDefaultAutomation(data.pageId)
        if (!automation) {
          Logger.error("❌ No default automation available - message ignored")
          return null
        }
        Logger.info(`🎯 Using default automation: ${automation.id}`)
      } else {
        // Get the specific automation that was triggered
        try {
          automation = await client.automation.findUnique({
            where: { id: triggerDecision.automationId! },
            include: {
              User: {
                include: {
                  subscription: true,
                  integrations: {
                    where: { name: "INSTAGRAM" },
                    select: { token: true },
                  },
                },
              },
              businessWorkflowConfig: {
                select: { id: true },
              },
            },
          })
          Logger.info(`🔍 Automation lookup result:`, automation ? `Found: ${automation.id}` : "Not found")
        } catch (error) {
          Logger.error(`❌ Error fetching automation ${triggerDecision.automationId}:`, error)
        }

        if (!automation) {
          Logger.warning(`❌ Specific automation not found: ${triggerDecision.automationId}`)
          // Fallback to default automation
          automation = await getOrCreateDefaultAutomation(data.pageId)
          if (!automation) {
            return null
          }
        }
      }

      Logger.success(`Context built - Automation: ${automation.id} (${automation.User?.subscription?.plan || "FREE"})`)

      return {
        data,
        automation,
        conversationUserId: `${data.pageId}_${data.senderId}`,
        userMessage: data.userMessage,
        triggerDecision,
        startTime,
        messageKey,
      }
    } catch (error) {
      Logger.error("Failed to build processing context", error)
      return null
    }
  }
}

// ============================================================================
// ENHANCED VOICEFLOW HANDLER - NO FALLBACKS, ONLY RETRIES
// ============================================================================

class VoiceflowHandler {
  static async handle(context: ProcessingContext): Promise<ProcessingResult> {
    Logger.info("🎙️ === VOICEFLOW HANDLER (NO FALLBACKS) ===")

    try {
      if (await this.isRateLimited(context)) {
        throw new Error("Rate limit exceeded for Voiceflow processing")
      }

      const contextData = await this.gatherContext(context)

      // Fetch enhanced business variables with retry
      const businessVariables = await RetryManager.withRetry(
        () =>
          fetchEnhancedBusinessVariables(
            context.automation.businessId,
            context.automation.id,
            context.automation.businessWorkflowConfig?.id || null,
            {
              pageId: context.data.pageId,
              senderId: context.data.senderId,
              userMessage: context.userMessage,
              isNewUser: contextData.conversationHistory.length === 0,
              customerType:
                contextData.conversationHistory.length >= 10
                  ? "VIP"
                  : contextData.conversationHistory.length > 0
                    ? "RETURNING"
                    : "NEW",
              messageHistory: contextData.conversationHistory,
            },
          ),
        "Fetch business variables",
      )

      const response = await this.processVoiceflowWithRetry(context, contextData, businessVariables)

      return {
        success: true,
        responseText: response.text,
        buttons: response.buttons,
        variables: response.variables,
        extractedData: response.extractedData,
        aiSystem: response.aiSystem,
      }
    } catch (error) {
      Logger.error("Voiceflow handler failed completely", error)
      throw error // NO FALLBACK - Let it fail
    }
  }

  private static async isRateLimited(context: ProcessingContext): Promise<boolean> {
    const count = await getRecentResponseCount(context.data.pageId, context.data.senderId, context.data.messageType, 2)
    if (count >= CONFIG.RATE_LIMITS.MAX_RESPONSES_PER_2MIN) {
      Logger.warning(`Rate limit exceeded: ${count} responses in 2 minutes`)
      return true
    }
    return false
  }

  private static async gatherContext(context: ProcessingContext) {
    Logger.debug("Gathering Voiceflow context...")

    const [historyResult, profileResult] = await Promise.allSettled([
      TimeoutManager.withTimeout(
        buildConversationContext(context.data.pageId, context.data.senderId, context.automation.id),
        CONFIG.TIMEOUTS.PROFILE,
        "Conversation history",
      ),
      TimeoutManager.withTimeout(
        getBusinessProfileForAutomation(context.automation.id),
        CONFIG.TIMEOUTS.PROFILE,
        "Business profile",
      ),
    ])

    const conversationHistory =
      historyResult.status === "fulfilled" && Array.isArray(historyResult.value) ? historyResult.value : []

    const profile =
      profileResult.status === "fulfilled" ? profileResult.value : { profileContent: "", businessContext: {} }

    Logger.success(`Context gathered - History: ${conversationHistory.length} messages`)

    return { conversationHistory, profile }
  }

  private static async processVoiceflowWithRetry(
    context: ProcessingContext,
    contextData: any,
    businessVariables: Record<string, string>,
  ) {
    Logger.debug("Processing with Voiceflow (with retry mechanism)...")

    // Create Voiceflow user (non-blocking)
    createVoiceflowUser(context.conversationUserId).catch((error) =>
      Logger.warning("Voiceflow user creation failed", error),
    )

    // Retrieve Voiceflow credentials from environment variables
    const voiceflowApiKey = process.env.VOICEFLOW_API_KEY
    const voiceflowProjectId = process.env.VOICEFLOW_PROJECT_ID
    const voiceflowVersionId = process.env.VOICEFLOW_VERSION_ID

    if (!voiceflowApiKey || !voiceflowProjectId) {
      throw new Error("Voiceflow API Key or Project ID is missing from environment variables")
    }

    const isFirstMessage = contextData.conversationHistory.length === 0

    // Use retry mechanism for Voiceflow API calls
    const voiceflowResult = await RetryManager.withRetry(
      async () => {
        const result = await TimeoutManager.withTimeout(
          getEnhancedVoiceflowResponse(
            context.userMessage,
            context.conversationUserId,
            businessVariables,
            voiceflowApiKey,
            voiceflowProjectId,
            voiceflowVersionId,
            {
              maxRetries: 1, // Let RetryManager handle retries
              timeoutMs: CONFIG.TIMEOUTS.VOICEFLOW,
              enableFallbackDetection: false, // Disable internal fallback detection
              isFirstMessage,
            },
          ),
          CONFIG.TIMEOUTS.VOICEFLOW,
          "Voiceflow API call",
        )

        // Only accept successful responses with actual content
        if (!result.success || !result.response?.text || result.response.text.trim().length === 0) {
          throw new Error(`Voiceflow returned invalid response: ${result.error || "Empty response"}`)
        }

        return result
      },
      "Voiceflow API processing",
      CONFIG.RETRY.MAX_ATTEMPTS,
    )

    Logger.success("✨ Voiceflow response successful")

    // Extract customer data from Voiceflow variables
    const extractedData = this.extractCustomerData(voiceflowResult.variables)

    // Process lead qualification in background (non-blocking)
    if (context.automation.User?.id && context.data.senderId !== context.data.pageId) {
      this.processLeadQualification(context, extractedData)
    }

    return {
      text: voiceflowResult.response?.text,
      buttons: voiceflowResult.response?.quickReplies,
      variables: voiceflowResult.variables,
      extractedData,
      aiSystem: "voiceflow_with_retry",
    }
  }

  private static extractCustomerData(variables: any): { name?: string; email?: string; phone?: string } | undefined {
    if (!variables) return undefined

    const extractedData = {
      name:
        variables.customer_name || variables.clientname || variables.name || variables.user_name || variables.full_name,
      email:
        variables.customer_email ||
        variables.clientemail ||
        variables.email ||
        variables.user_email ||
        variables.email_address,
      phone:
        variables.customer_phone ||
        variables.clientphone ||
        variables.phone ||
        variables.user_phone ||
        variables.phone_number,
    }

    // Only return if we have at least one piece of data
    if (extractedData.name || extractedData.email || extractedData.phone) {
      Logger.info("📝 Customer data extracted from Voiceflow:", extractedData)
      return extractedData
    }

    return undefined
  }

  private static async processLeadQualification(
    context: ProcessingContext,
    extractedData?: { name?: string; email?: string; phone?: string },
  ) {
    // Run lead qualification in background without blocking response
    setImmediate(async () => {
      try {
        Logger.info("🔍 Starting lead qualification analysis...")

        const leadAnalysisResult = (await Promise.race([
          analyzeLead({
            userId: context.automation.User.id,
            automationId: context.automation.id,
            platformId: context.data.pageId,
            customerId: context.data.senderId,
            message: context.userMessage,
            messageType: context.data.messageType,
            timestamp: new Date(),
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Lead analysis timeout")), 10000)),
        ])) as any

        if (leadAnalysisResult && leadAnalysisResult.lead) {
          Logger.success(`📊 Lead analysis completed for ${context.data.senderId}`)

          // Store marketing info if we extracted customer data
          if (extractedData && (extractedData.name || extractedData.email || extractedData.phone)) {
            await this.storeMarketingInfo(context.automation.User.id, extractedData, leadAnalysisResult.lead.id)
          }
        }
      } catch (error) {
        Logger.error("❌ Error in lead qualification (running in background):", error)
      }
    })
  }

  private static async storeMarketingInfo(
    userId: string,
    extractedData: { name?: string; email?: string; phone?: string },
    leadId?: string,
  ) {
    try {
      // Create marketing info record
      await client.marketingInfo.create({
        data: {
          name: extractedData.name,
          email: extractedData.email,
          phone: extractedData.phone,
          userId: userId,
        },
      })

      // Update lead with extracted data if we have a lead ID
      if (leadId) {
        await client.lead.update({
          where: { id: leadId },
          data: {
            name: extractedData.name,
            email: extractedData.email,
            phone: extractedData.phone,
            metadata: {
              dataCollectionTimestamp: new Date().toISOString(),
              extractedFromVoiceflow: true,
            },
          },
        })
      }

      Logger.success("📝 Marketing info and lead data stored successfully")
    } catch (error) {
      Logger.error("❌ Error storing marketing info:", error)
    }
  }
}

// ============================================================================
// GEMINI HANDLER (FOR STANDARD USERS)
// ============================================================================

class GeminiHandler {
  static async handle(context: ProcessingContext): Promise<ProcessingResult> {
    Logger.info("🔮 === GEMINI HANDLER (STANDARD USERS) ===")

    try {
      const count = await getRecentResponseCount(
        context.data.pageId,
        context.data.senderId,
        context.data.messageType,
        2,
      )
      if (count >= CONFIG.RATE_LIMITS.MAX_RESPONSES_PER_2MIN) {
        throw new Error("Rate limit exceeded for Gemini processing")
      }

      const [profileResult, historyResult] = await Promise.allSettled([
        TimeoutManager.withTimeout(
          getBusinessProfileForAutomation(context.automation.id),
          CONFIG.TIMEOUTS.PROFILE,
          "Business profile",
        ),
        TimeoutManager.withTimeout(
          buildConversationContext(context.data.pageId, context.data.senderId, context.automation.id),
          CONFIG.TIMEOUTS.PROFILE,
          "Conversation history",
        ),
      ])

      const profile =
        profileResult.status === "fulfilled" ? profileResult.value : { profileContent: "", businessContext: {} }

      const history =
        historyResult.status === "fulfilled" && Array.isArray(historyResult.value) ? historyResult.value : []

      Logger.success(`Gemini context gathered - History: ${history.length} messages`)

      // Process lead qualification for standard users too
      if (context.automation.User?.id && context.data.senderId !== context.data.pageId) {
        await this.processLeadQualification(context)
      }

      const geminiResponse = await RetryManager.withRetry(
        () =>
          TimeoutManager.withTimeout(
            generateGeminiResponse({
              userMessage: context.userMessage,
              businessProfile: profile.profileContent,
              conversationHistory: history,
              businessContext: profile.businessContext,
              isPROUser: false,
            }),
            CONFIG.TIMEOUTS.GEMINI,
            "Gemini response",
          ),
        "Gemini API processing",
      )

      const responseText = typeof geminiResponse === "string" ? geminiResponse : ""

      if (!responseText || responseText.trim().length === 0) {
        throw new Error("Gemini returned empty response")
      }

      Logger.success("✨ Gemini response successful")

      return {
        success: true,
        responseText,
        buttons: undefined,
        variables: undefined,
        extractedData: undefined,
        aiSystem: "gemini_with_retry",
      }
    } catch (error) {
      Logger.error("Gemini handler failed", error)
      throw error // NO FALLBACK - Let it fail
    }
  }

  private static async processLeadQualification(context: ProcessingContext) {
    try {
      Logger.info("🔍 Starting lead qualification for standard user...")

      await analyzeLead({
        userId: context.automation.User.id,
        automationId: context.automation.id,
        platformId: context.data.pageId,
        customerId: context.data.senderId,
        message: context.userMessage,
        messageType: context.data.messageType,
        timestamp: new Date(),
      })

      Logger.success(`📊 Lead analysis completed for standard user`)
    } catch (error) {
      Logger.error("❌ Error in lead qualification for standard user:", error)
    }
  }
}

// ============================================================================
// ENHANCED RESPONSE SENDER - WITH RETRY MECHANISM
// ============================================================================

class ResponseSender {
  static async send(context: ProcessingContext, text: string, buttons?: any[]): Promise<void> {
    Logger.info(`📤 Sending response: "${text.substring(0, 100)}..."`)

    const isDuplicate = await checkDuplicateResponse(
      context.data.pageId,
      context.data.senderId,
      text,
      context.data.messageType,
    )

    if (isDuplicate) {
      Logger.warning("Duplicate response detected, skipping send to avoid spam")
      return
    }

    const formattedButtons = transformButtonsToInstagram(buttons)
    const token = context.automation?.User?.integrations?.[0]?.token || process.env.DEFAULT_PAGE_TOKEN!

    // Use retry mechanism for sending messages
    await RetryManager.withRetry(
      async () => {
        let result

        if (context.data.messageType === "DM") {
          result = await TimeoutManager.withTimeout(
            sendDM(context.data.pageId, context.data.senderId, text, token, formattedButtons),
            10000,
            "DM send",
          )
        } else if (context.data.messageType === "COMMENT" && context.data.commentId) {
          result = await TimeoutManager.withTimeout(
            sendPrivateMessage(context.data.pageId, context.data.commentId, text, token, formattedButtons),
            10000,
            "Comment send",
          )
        }

        if (result?.status !== 200) {
          throw new Error(`Send failed with status: ${result?.status}`)
        }

        Logger.success(`✅ Response sent successfully`)

        // Mark response as sent
        await Promise.allSettled([
          markResponseAsSent(
            context.data.pageId,
            context.data.senderId,
            text,
            context.data.messageType,
            context.automation.id,
          ),
          trackResponses(context.automation.id, context.data.messageType),
        ])

        return result
      },
      "Message sending",
      CONFIG.RETRY.MAX_ATTEMPTS,
    )
  }
}

// ============================================================================
// BACKGROUND PROCESSOR (ENHANCED WITH DATA HANDLING)
// ============================================================================

class BackgroundProcessor {
  static process(
    context: ProcessingContext,
    responseText: string,
    extractedData?: { name?: string; email?: string; phone?: string },
  ): void {
    Logger.debug("🔄 Starting enhanced background tasks...")

    Promise.allSettled([
      storeConversationMessage(
        context.data.pageId,
        context.data.senderId,
        context.userMessage,
        false,
        context.automation?.id || null,
      ),
      storeConversationMessage(context.data.pageId, "bot", responseText, true, context.automation?.id || null),
      context.automation?.id
        ? trackMessageForSentiment(
            context.automation.id,
            context.data.pageId,
            context.data.senderId,
            context.userMessage,
          )
        : Promise.resolve(),
      createChatHistory(
        context.automation?.id || null,
        context.data.pageId,
        context.data.senderId,
        context.userMessage,
      ),
      createChatHistory(context.automation?.id || null, context.data.pageId, context.data.senderId, responseText),
      // Update conversation state with enhanced data
      updateConversationState(context.conversationUserId, {
        isActive: true,
        lastTriggerType: context.triggerDecision.triggerType,
        lastTriggerReason: context.triggerDecision.reason,
        automationId: context.automation.id,
        listenMode: context.triggerDecision.triggerType === "KEYWORD" ? "KEYWORDS" : "ALL_MESSAGES",
        lastMessageLength: context.userMessage.length,
      }),
      // Log trigger execution
      context.triggerDecision.automationId && context.triggerDecision.triggerId && context.automation.User?.id
        ? logTriggerExecution({
            triggerId: context.triggerDecision.triggerId,
            automationId: context.triggerDecision.automationId,
            userId: context.automation.User.id,
            messageContent: context.userMessage,
            triggerType: context.triggerDecision.triggerType as any,
            confidence: context.triggerDecision.confidence,
            reason: context.triggerDecision.reason,
            success: true,
            responseTime: Date.now() - context.startTime,
          })
        : Promise.resolve(),
    ])
      .then((results) => {
        const failures = results.filter((r) => r.status === "rejected").length
        if (failures === 0) {
          Logger.success("✅ All enhanced background tasks completed successfully")
        } else {
          Logger.warning(`⚠️ ${failures} background tasks failed`)
        }
      })
      .catch((error) => Logger.warning("Enhanced background tasks failed", error))
  }
}

// ============================================================================
// MAIN ROUTE HANDLERS
// ============================================================================

export async function GET(req: NextRequest) {
  const hub = req.nextUrl.searchParams.get("hub.challenge")
  return new NextResponse(hub)
}

export async function POST(req: NextRequest) {
  Logger.info("🚀 POST request received")
  const startTime = Date.now()
  let webhook_payload

  try {
    webhook_payload = await req.json()
    Logger.debug("📥 Received webhook payload:", webhook_payload)

    // Handle deauth webhooks
    const specialWebhook = WebhookValidator.isSpecialWebhook(webhook_payload)
    if (specialWebhook === "deauth") {
      Logger.info("🔐 Processing Instagram deauthorization webhook")
      const signature = req.headers.get("x-hub-signature-256")
      const body = JSON.stringify(webhook_payload)

      if (!signature || !verifyInstagramWebhook(signature, body, process.env.INSTAGRAM_CLIENT_SECRET!)) {
        Logger.error("❌ Invalid webhook signature for deauth")
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }

      const result = await handleInstagramDeauthWebhook(webhook_payload)
      return NextResponse.json(result, { status: result.status })
    }

    // Handle data deletion webhooks
    if (specialWebhook === "data_deletion") {
      Logger.info("🗑️ Processing Instagram data deletion webhook")
      const signature = req.headers.get("x-hub-signature-256")
      const body = JSON.stringify(webhook_payload)

      if (!signature || !verifyInstagramWebhook(signature, body, process.env.INSTAGRAM_CLIENT_SECRET!)) {
        Logger.error("❌ Invalid webhook signature for data deletion")
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }

      const result = await handleInstagramDataDeletionWebhook(webhook_payload)
      return NextResponse.json(result, { status: result.status })
    }

    // Handle read receipts and delivery confirmations
    if (specialWebhook === "receipt") {
      Logger.debug("📖 Received read receipt or delivery confirmation - acknowledging")
      return NextResponse.json({ message: "Read receipt acknowledged" }, { status: 200 })
    }

    const data = WebhookValidator.extractData(webhook_payload)

    if (!data) {
      Logger.warning("⚠️ Unsupported webhook payload structure or non-text message")
      return NextResponse.json({ message: "Unsupported webhook payload" }, { status: 200 })
    }

    // Skip echo messages (messages sent by the bot)
    if (data.isEcho) {
      Logger.debug("🔄 Skipping echo message (sent by bot)")
      return NextResponse.json({ message: "Echo message ignored" }, { status: 200 })
    }

    await MessageProcessor.processImmediate(data, startTime)

    const processingTime = Date.now() - startTime
    Logger.performance("Successfully processed webhook request", startTime)

    // Get Voiceflow health for response
    const voiceflowHealth = getVoiceflowHealth()

    return NextResponse.json(
      {
        message: "Request processed successfully",
        processingTime,
        messageType: data.messageType,
        voiceflowHealth: voiceflowHealth,
        memoryMetrics: EnhancedMemoryManager.getInstance().getMetrics(),
      },
      { status: 200 },
    )
  } catch (error) {
    Logger.error("💥 Unhandled error in POST function:", error)
    return NextResponse.json(
      {
        message: "Error processing request",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
