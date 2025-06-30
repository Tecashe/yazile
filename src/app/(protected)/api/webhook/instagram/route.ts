
















import { type NextRequest, NextResponse } from "next/server"
import {
  createChatHistory,
  trackResponses,
  checkProcessedMessage,
  markMessageAsProcessed,
  decideTriggerAction,
  getAutomationWithTriggers,
  checkDuplicateResponse,
  getRecentResponseCount,
  markResponseAsSent,
} from "@/actions/webhook/queries"
import { getBusinessProfileForAutomation } from "@/actions/webhook/business-profile"
import { generateGeminiResponse, buildConversationContext } from "@/lib/gemini"
import { createVoiceflowUser, getEnhancedVoiceflowResponse } from "@/lib/voiceflow"
import { sendDM, sendPrivateMessage } from "@/lib/fetch"
import { storeConversationMessage } from "@/actions/chats/queries"
import { trackMessageForSentiment } from "@/lib/sentiment-tracker"

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type InstagramQuickReply = {
  content_type: "text"
  title: string
  payload: string
}

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

interface VoiceflowResponse {
  success: boolean
  response?: {
    text: string
    buttons?: any[]
  }
  variables?: Record<string, any>
  error?: string
}

interface BusinessProfile {
  profileContent: string
  businessContext: {
    businessName?: string
    industry?: string
    welcomeMessage?: string
    responseLanguage?: string
    businessDescription?: string
    targetAudience?: string
    promotionMessage?: string
  }
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
}

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

const CONFIG = {
  TIMEOUTS: {
    VOICEFLOW: 12000, // 12 seconds
    GEMINI: 10000, // 10 seconds
    PROFILE: 5000, // 5 seconds
    BUSINESS_VARS: 5000, // 5 seconds
    TOTAL_PROCESSING: 25000, // 25 seconds max total
  },
  RATE_LIMITS: {
    MAX_RESPONSES_PER_2MIN: 3,
    DUPLICATE_WINDOW: 8000, // 8 seconds
  },
  CLEANUP_INTERVAL: 5 * 60 * 1000, // 5 minutes
  FALLBACK_RESPONSES: {
    PRO: "Thank you for your message! As a valued customer, I want to ensure you get the best possible assistance. Let me get back to you with detailed information shortly. 🌟",
    STANDARD: "Thanks for your message! I'm here to help. Let me get back to you with the information you need. 😊",
    EMERGENCY: "Hi! Thanks for reaching out. I'm here to help! 😊",
    SIMPLE: "Hello! 👋",
  },
} as const

// ============================================================================
// MEMORY MANAGEMENT
// ============================================================================

class MemoryManager {
  private static instance: MemoryManager
  private recentMessages = new Map<string, number>()
  private processingMessages = new Set<string>()
  private cleanupInterval: NodeJS.Timeout

  private constructor() {
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, CONFIG.CLEANUP_INTERVAL)
  }

  static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager()
    }
    return MemoryManager.instance
  }

  isDuplicate(key: string, timestamp: number): boolean {
    const lastTime = this.recentMessages.get(key)
    return lastTime ? timestamp - lastTime < CONFIG.RATE_LIMITS.DUPLICATE_WINDOW : false
  }

  isProcessing(key: string): boolean {
    return this.processingMessages.has(key)
  }

  markMessage(key: string, timestamp: number): void {
    this.recentMessages.set(key, timestamp)
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

    // Clear old processing entries (safety cleanup)
    this.processingMessages.clear()

    console.log(`🧹 Memory cleanup: removed ${keysToDelete.length} old entries`)
  }
}

// ============================================================================
// UTILITIES
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

class TimeoutManager {
  static async withTimeout<T>(promise: Promise<T>, timeoutMs: number, operation: string): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`${operation} timeout after ${timeoutMs}ms`)), timeoutMs)
    })

    return Promise.race([promise, timeoutPromise])
  }
}

// ============================================================================
// WEBHOOK PROCESSORS
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

    const memoryManager = MemoryManager.getInstance()

    // Check for duplicates
    if (memoryManager.isDuplicate(duplicateKey, startTime)) {
      Logger.warning(`Duplicate message blocked: ${duplicateKey}`)
      return
    }

    // Check if currently processing
    if (memoryManager.isProcessing(duplicateKey)) {
      Logger.warning(`Message already being processed: ${duplicateKey}`)
      return
    }

    // Check database processing status
    const isProcessed = await checkProcessedMessage(messageKey)
    if (isProcessed) {
      Logger.warning(`Message already processed in DB: ${messageKey.substring(0, 50)}...`)
      return
    }

    // Mark as processing
    memoryManager.startProcessing(duplicateKey)
    memoryManager.markMessage(duplicateKey, startTime)

    try {
      // Mark as processed in database
      await markMessageAsProcessed(messageKey)
      Logger.success(`Message marked for processing: ${messageKey.substring(0, 50)}...`)

      // Process immediately with timeout protection
      await TimeoutManager.withTimeout(
        this.processMessage(data, messageKey, startTime),
        CONFIG.TIMEOUTS.TOTAL_PROCESSING,
        "Total message processing",
      )

      Logger.performance("Message processing completed", startTime)
    } catch (error) {
      Logger.error("Message processing failed", error)
      await this.handleProcessingFailure(data, error)
    } finally {
      memoryManager.finishProcessing(duplicateKey)
    }
  }

  private static async processMessage(data: WebhookData, messageKey: string, startTime: number): Promise<void> {
    Logger.info(`🎯 Processing message: ${messageKey.substring(0, 50)}...`)

    // Build processing context
    const context = await this.buildProcessingContext(data, messageKey, startTime)
    if (!context) {
      throw new Error("Failed to build processing context")
    }

    // Route to appropriate handler
    const isPROUser = context.automation.User?.subscription?.plan === "PRO"
    Logger.info(`Routing to ${isPROUser ? "PRO Voiceflow" : "Standard Gemini"} handler`)

    let result: ProcessingResult

    if (isPROUser) {
      result = await VoiceflowHandler.handle(context)
    } else {
      result = await GeminiHandler.handle(context)
    }

    if (!result.success) {
      throw new Error(`AI processing failed: ${result.error}`)
    }

    // Send response
    await ResponseSender.send(context, result.responseText!, result.buttons)

    // Background tasks (non-blocking)
    BackgroundProcessor.process(context, result.responseText!)

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

      Logger.debug("Trigger decision completed", triggerDecision)

      const automation = await TimeoutManager.withTimeout(
        getAutomationWithTriggers(triggerDecision.automationId!, data.messageType),
        5000,
        "Automation lookup",
      )

      if (!automation) {
        Logger.error(`Automation not found: ${triggerDecision.automationId}`)
        return null
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

  private static async handleProcessingFailure(data: WebhookData, error: any): Promise<void> {
    Logger.error("Handling processing failure", error)

    try {
      const emergencyResponse = CONFIG.FALLBACK_RESPONSES.EMERGENCY
      const token = process.env.DEFAULT_PAGE_TOKEN!

      if (data.messageType === "DM") {
        await sendDM(data.pageId, data.senderId, emergencyResponse, token)
      } else if (data.messageType === "COMMENT" && data.commentId) {
        await sendPrivateMessage(data.pageId, data.commentId, emergencyResponse, token)
      }

      Logger.success("Emergency response sent successfully")
    } catch (emergencyError) {
      Logger.error("Emergency response also failed", emergencyError)
    }
  }
}

// ============================================================================
// AI HANDLERS
// ============================================================================

class VoiceflowHandler {
  static async handle(context: ProcessingContext): Promise<ProcessingResult> {
    Logger.info("🎙️ === VOICEFLOW HANDLER INITIATED ===")

    try {
      // Rate limiting check
      if (await this.isRateLimited(context)) {
        return {
          success: false,
          aiSystem: "voiceflow_rate_limited",
          error: "Rate limit exceeded",
        }
      }

      // Gather context data
      const contextData = await this.gatherContext(context)

      // Process with Voiceflow
      const response = await this.processVoiceflow(context, contextData)

      return {
        success: true,
        responseText: response.text,
        buttons: response.buttons,
        variables: response.variables,
        aiSystem: response.aiSystem,
      }
    } catch (error) {
      Logger.error("Voiceflow handler failed", error)
      return {
        success: false,
        aiSystem: "voiceflow_failed",
        error: error instanceof Error ? error.message : String(error),
      }
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
      profileResult.status === "fulfilled" && this.isBusinessProfile(profileResult.value)
        ? profileResult.value
        : { profileContent: "", businessContext: {} }

    Logger.success(`Context gathered - History: ${conversationHistory.length} messages`)

    return { conversationHistory, profile }
  }

  private static async processVoiceflow(context: ProcessingContext, contextData: any) {
    Logger.debug("Processing with Voiceflow...")

    // Create Voiceflow user (non-blocking)
    createVoiceflowUser(context.conversationUserId).catch((error) =>
      Logger.warning("Voiceflow user creation failed", error),
    )

    // Build business variables
    const businessVariables = this.buildBusinessVariables(context, contextData)

    // Try Voiceflow first
    try {
      const voiceflowResult = await TimeoutManager.withTimeout(
        getEnhancedVoiceflowResponse(context.userMessage, context.conversationUserId, businessVariables),
        CONFIG.TIMEOUTS.VOICEFLOW,
        "Voiceflow response",
      )

      if (this.isVoiceflowResponse(voiceflowResult) && voiceflowResult.success && voiceflowResult.response?.text) {
        Logger.success("✨ Voiceflow response successful")
        return {
          text: voiceflowResult.response.text,
          buttons: voiceflowResult.response.buttons,
          variables: voiceflowResult.variables,
          aiSystem: "enhanced_voiceflow",
        }
      }
    } catch (error) {
      Logger.warning("Voiceflow failed, falling back to Gemini", error)
    }

    // Fallback to Gemini Pro
    Logger.info("🔄 Using Gemini Pro fallback...")
    try {
      const geminiResponse = await TimeoutManager.withTimeout(
        generateGeminiResponse({
          userMessage: context.userMessage,
          businessProfile: contextData.profile.profileContent,
          conversationHistory: contextData.conversationHistory,
          businessContext: contextData.profile.businessContext,
          isPROUser: true,
          isVoiceflowFallback: true,
        }),
        CONFIG.TIMEOUTS.GEMINI,
        "Gemini Pro fallback",
      )

      const responseText = typeof geminiResponse === "string" ? geminiResponse : CONFIG.FALLBACK_RESPONSES.PRO

      Logger.success("✨ Gemini Pro fallback successful")
      return {
        text: responseText,
        buttons: undefined,
        variables: undefined,
        aiSystem: "gemini_pro_fallback",
      }
    } catch (error) {
      Logger.warning("Gemini Pro fallback also failed", error)
      return {
        text: CONFIG.FALLBACK_RESPONSES.PRO,
        buttons: undefined,
        variables: undefined,
        aiSystem: "static_pro_fallback",
      }
    }
  }

  private static buildBusinessVariables(context: ProcessingContext, contextData: any) {
    const isNewUser = contextData.conversationHistory.length === 0
    const customerType =
      contextData.conversationHistory.length >= 10
        ? "VIP"
        : contextData.conversationHistory.length > 0
          ? "RETURNING"
          : "NEW"

    return {
      business_name: contextData.profile.businessContext.businessName || "Our Business",
      welcome_message: contextData.profile.businessContext.welcomeMessage || "Hello! How can I help you today?",
      business_industry: contextData.profile.businessContext.industry || "",
      business_description: contextData.profile.businessContext.businessDescription || "",
      target_audience: contextData.profile.businessContext.targetAudience || "",
      response_language: contextData.profile.businessContext.responseLanguage || "English",
      customer_type: customerType,
      is_new_user: isNewUser.toString(),
      conversation_length: contextData.conversationHistory.length.toString(),
      trigger_type: context.triggerDecision.triggerType,
      trigger_reason: context.triggerDecision.reason,
    }
  }

  private static isVoiceflowResponse(value: unknown): value is VoiceflowResponse {
    return (
      typeof value === "object" && value !== null && "success" in value && typeof (value as any).success === "boolean"
    )
  }

  private static isBusinessProfile(value: unknown): value is BusinessProfile {
    return typeof value === "object" && value !== null && "profileContent" in value && "businessContext" in value
  }
}

class GeminiHandler {
  static async handle(context: ProcessingContext): Promise<ProcessingResult> {
    Logger.info("🔮 === GEMINI HANDLER INITIATED ===")

    try {
      // Rate limiting check
      const count = await getRecentResponseCount(
        context.data.pageId,
        context.data.senderId,
        context.data.messageType,
        2,
      )
      if (count >= CONFIG.RATE_LIMITS.MAX_RESPONSES_PER_2MIN) {
        Logger.warning(`Rate limit exceeded: ${count} responses`)
        return {
          success: false,
          aiSystem: "gemini_rate_limited",
          error: "Rate limit exceeded",
        }
      }

      // Get context with timeout protection
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
        profileResult.status === "fulfilled" && this.isBusinessProfile(profileResult.value)
          ? profileResult.value
          : { profileContent: "", businessContext: {} }

      const history =
        historyResult.status === "fulfilled" && Array.isArray(historyResult.value) ? historyResult.value : []

      Logger.success(`Gemini context gathered - History: ${history.length} messages`)

      // Generate response with timeout
      const geminiResponse = await TimeoutManager.withTimeout(
        generateGeminiResponse({
          userMessage: context.userMessage,
          businessProfile: profile.profileContent,
          conversationHistory: history,
          businessContext: profile.businessContext,
          isPROUser: false,
        }),
        CONFIG.TIMEOUTS.GEMINI,
        "Gemini response",
      )

      const responseText = typeof geminiResponse === "string" ? geminiResponse : CONFIG.FALLBACK_RESPONSES.STANDARD

      Logger.success("✨ Gemini response successful")

      return {
        success: true,
        responseText,
        buttons: undefined,
        variables: undefined,
        aiSystem: "enhanced_gemini",
      }
    } catch (error) {
      Logger.error("Gemini handler failed", error)
      return {
        success: false,
        responseText: CONFIG.FALLBACK_RESPONSES.STANDARD,
        aiSystem: "gemini_failed_fallback",
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }

  private static isBusinessProfile(value: unknown): value is BusinessProfile {
    return typeof value === "object" && value !== null && "profileContent" in value && "businessContext" in value
  }
}

// ============================================================================
// RESPONSE SENDER
// ============================================================================

class ResponseSender {
  static async send(context: ProcessingContext, text: string, buttons?: any[]): Promise<void> {
    Logger.info(`📤 Sending response: "${text.substring(0, 100)}..."`)

    // Check for duplicates
    const isDuplicate = await checkDuplicateResponse(
      context.data.pageId,
      context.data.senderId,
      text,
      context.data.messageType,
    )
    if (isDuplicate) {
      Logger.warning("Duplicate response detected, skipping")
      return
    }

    const instagramButtons = this.transformButtons(buttons)
    const token = context.automation?.User?.integrations?.[0]?.token || process.env.DEFAULT_PAGE_TOKEN!

    // Multiple fallback responses for guaranteed delivery
    const fallbackResponses = [
      text,
      CONFIG.FALLBACK_RESPONSES.STANDARD,
      CONFIG.FALLBACK_RESPONSES.EMERGENCY,
      CONFIG.FALLBACK_RESPONSES.SIMPLE,
    ]

    for (let i = 0; i < fallbackResponses.length; i++) {
      try {
        const currentResponse = fallbackResponses[i]
        let result

        Logger.debug(`Attempt ${i + 1}: Sending "${currentResponse.substring(0, 50)}..."`)

        if (context.data.messageType === "DM") {
          result = await TimeoutManager.withTimeout(
            sendDM(
              context.data.pageId,
              context.data.senderId,
              currentResponse,
              token,
              i === 0 ? instagramButtons : undefined,
            ),
            10000,
            `DM send attempt ${i + 1}`,
          )
        } else if (context.data.messageType === "COMMENT" && context.data.commentId) {
          result = await TimeoutManager.withTimeout(
            sendPrivateMessage(
              context.data.pageId,
              context.data.commentId,
              currentResponse,
              token,
              i === 0 ? instagramButtons : undefined,
            ),
            10000,
            `Comment send attempt ${i + 1}`,
          )
        }

        if (result?.status === 200) {
          Logger.success(`✅ Response sent successfully (attempt ${i + 1})`)

          // Track the successful response
          await Promise.allSettled([
            markResponseAsSent(
              context.data.pageId,
              context.data.senderId,
              currentResponse,
              context.data.messageType,
              context.automation.id,
            ),
            trackResponses(context.automation.id, context.data.messageType),
          ])

          return
        } else {
          Logger.warning(`Attempt ${i + 1} returned status: ${result?.status}`)
        }
      } catch (error) {
        Logger.error(`Send attempt ${i + 1} failed`, error)
        if (i === fallbackResponses.length - 1) {
          throw new Error(`All ${fallbackResponses.length} send attempts failed`)
        }
      }
    }
  }

  private static transformButtons(
    buttons?: { name: string; payload: string | object | any }[],
  ): InstagramQuickReply[] | undefined {
    if (!buttons || buttons.length === 0) return undefined

    return buttons.slice(0, 11).map((button) => {
      const buttonName = String(button.name || "").substring(0, 20)
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
        content_type: "text",
        title: buttonName,
        payload: buttonPayload,
      }
    })
  }
}

// ============================================================================
// BACKGROUND PROCESSOR
// ============================================================================

class BackgroundProcessor {
  static process(context: ProcessingContext, responseText: string): void {
    Logger.debug("🔄 Starting background tasks...")

    // Store conversation messages (non-blocking)
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
        context.automation?.id || "default",
        context.data.pageId,
        context.data.senderId,
        context.userMessage,
      ),
      createChatHistory(context.automation?.id || "default", context.data.pageId, context.data.senderId, responseText),
    ])
      .then((results) => {
        const failures = results.filter((r) => r.status === "rejected").length
        if (failures === 0) {
          Logger.success("✅ All background tasks completed successfully")
        } else {
          Logger.warning(`⚠️ ${failures} background tasks failed`)
        }
      })
      .catch((error) => Logger.warning("Background tasks failed", error))
  }
}

// ============================================================================
// MAIN ROUTE HANDLERS
// ============================================================================

export async function GET(req: NextRequest) {
  const hub = req.nextUrl.searchParams.get("hub.challenge")
  Logger.info(`📞 Webhook verification: ${hub}`)
  return new NextResponse(hub)
}

export async function POST(req: NextRequest) {
  const startTime = Date.now()
  Logger.info("🚀 === WEBHOOK REQUEST RECEIVED ===")

  try {
    const payload = await req.json()
    Logger.debug("📥 Webhook payload received")

    // Handle special webhooks
    const specialType = WebhookValidator.isSpecialWebhook(payload)
    if (specialType) {
      Logger.info(`🔧 Special webhook handled: ${specialType}`)
      return NextResponse.json({ message: `${specialType} processed` }, { status: 200 })
    }

    // Extract and validate data
    const data = WebhookValidator.extractData(payload)
    if (!data) {
      Logger.warning("⚠️ Unsupported webhook payload or non-text message")
      return NextResponse.json({ message: "Unsupported webhook payload" }, { status: 200 })
    }

    // Skip echo messages
    if (data.isEcho) {
      Logger.debug("🔄 Echo message ignored")
      return NextResponse.json({ message: "Echo message ignored" }, { status: 200 })
    }

    // Process immediately (no delays)
    await MessageProcessor.processImmediate(data, startTime)

    Logger.performance("Total webhook processing time", startTime)

    // Return success to Instagram
    return NextResponse.json({ message: "Message processed successfully" }, { status: 200 })
  } catch (error) {
    Logger.error("💥 Unhandled webhook error", error)
    return NextResponse.json(
      {
        message: "Error processing request",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}





