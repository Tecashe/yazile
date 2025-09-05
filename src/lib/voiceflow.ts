
import { getBusinessForWebhook } from "@/actions/businfo"
import { getUserFromBusiness } from "@/actions/businfo/queries"
import { getBusinessProfileForAutomation } from "@/actions/webhook/business-profile"
import type { VoiceflowVariables } from "@/types/voiceflow"
import { decryptCredentials } from "@/lib/encrypt"
import axios, { type AxiosError, type AxiosResponse } from "axios"
import { client } from "@/lib/prisma" // Assuming you have prisma client

const INSTAGRAM_LIMITS = {
  MESSAGE_LIMIT: 2000, // Instagram text message limit
  QUICK_REPLY_LIMIT: 13, // Instagram quick reply limit
  QUICK_REPLY_TITLE_LIMIT: 20, // Instagram quick reply title limit
  BUTTON_LIMIT: 3, // Instagram button template limit
  BUTTON_TITLE_LIMIT: 20, // Instagram button title limit
  CAROUSEL_LIMIT: 10, // Instagram carousel cards limit
  CAROUSEL_TITLE_LIMIT: 80, // Instagram carousel title limit
  CAROUSEL_SUBTITLE_LIMIT: 80, // Instagram carousel subtitle limit
  PAYLOAD_LIMIT: 1000, // Instagram payload limit
  MEDIA_SIZE_LIMIT: 8 * 1024 * 1024, // 8MB media limit
} as const

// Enhanced interfaces aligned with Instagram capabilities
interface InstagramAlignedButton {
  title: string
  payload: string
  url?: string // For web_url buttons
}

interface InstagramAlignedQuickReply {
  content_type: "text"
  title: string
  payload: string
}

interface InstagramAlignedCarouselElement {
  title: string
  subtitle?: string
  image_url?: string
  buttons?: InstagramAlignedButton[]
}

interface InstagramAlignedMessage {
  text: string
  quickReplies?: InstagramAlignedQuickReply[]
  buttons?: InstagramAlignedButton[]
  carousel?: InstagramAlignedCarouselElement[]
  attachment?: {
    type: "image" | "video" | "audio" | "file"
    url: string
    caption?: string
  }
  // Instagram-specific metadata
  requiresHumanHandoff?: boolean
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  sentiment?: "positive" | "neutral" | "negative"
  complexity?: "simple" | "medium" | "complex"
}

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

const CONFIG = {
  TIMEOUTS: {
    INTERACTION: 15000,
    VARIABLES: 8000,
    USER_CREATION: 12000,
  },
  RETRY: {
    MAX_ATTEMPTS: 3,
    BASE_DELAY: 1000,
    MAX_JITTER: 1000,
  },
  CACHE_TTL: {
    USER_CREATION: 300000, // 5 minutes
    SESSION: 1800000, // 30 minutes
  },
  INSTAGRAM: {
    MESSAGE_LIMIT: 1000,
    QUICK_REPLY_LIMIT: 13,
    QUICK_REPLY_TITLE_LIMIT: 20,
  },
} as const

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface VoiceflowTrace {
  type: string
  payload: any
}

interface VoiceflowButton {
  name: string
  url: string
  request?: {
    payload?:
      | string
      | {
          intent?: { name: string }
          label?: string
          [key: string]: any // Allow for other properties
        }
    type?: string
  }
}

interface BusinessData {
  id: string
  name: string | null
  businessName: string
  businessType: string
  businessDescription: string
  website: string
  responseLanguage: string
  automationId: string | null
  userId: string | null
  createdAt: Date
  updatedAt: Date
}

interface ConversationContext {
  pageId: string
  senderId: string
  userMessage: string
  isNewUser: boolean
  customerType: string
  messageHistory: Array<{ role: "user" | "assistant"; content: string }>
}

interface VoiceflowResponse {
  success: boolean
  response?: {
    text: string
    quickReplies?: Array<{ title: string; payload: string }>
    buttons?: Array<{ title: string; payload: string; url?: string }>
    carousel?: Array<{
      title: string
      description?: string
      image?: string
      buttons?: Array<{ title: string; payload: string; url?: string }>
    }>
    attachment?: {
      type: "image" | "video" | "audio" | "file"
      url: string
      caption?: string
    }
    requiresHumanHandoff?: boolean
    priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
    sentiment?: "positive" | "neutral" | "negative"
    complexity?: "simple" | "medium" | "complex"
  }
  variables?: VoiceflowVariables
  error?: string
  isEmpty?: boolean
  healthScore?: number
  fallbackReason?: string
}

// ============================================================================
// ENHANCED CIRCUIT BREAKER
// ============================================================================

class VoiceflowCircuitBreaker {
  private failures = 0
  private successes = 0
  private lastFailureTime = 0
  private state: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED"
  private healthScore = 1.0

  constructor(
    private maxFailures = 5,
    private resetTimeout = 60000,
    private healthThreshold = 0.7,
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === "OPEN") {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = "HALF_OPEN"
        Logger.info("🔄 Circuit breaker moving to HALF_OPEN state")
      } else {
        throw new Error(`Circuit breaker is OPEN. Health score: ${this.healthScore.toFixed(2)}`)
      }
    }

    try {
      const result = await operation()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  private onSuccess(): void {
    this.successes++
    this.state = "CLOSED"
    const totalOperations = this.successes + this.failures
    this.healthScore = totalOperations > 0 ? this.successes / totalOperations : 1.0

    if (this.successes >= 10) {
      this.failures = Math.max(0, this.failures - 1)
    }

    Logger.success(`Voiceflow operation successful. Health score: ${this.healthScore.toFixed(2)}`)
  }

  private onFailure(): void {
    this.failures++
    this.lastFailureTime = Date.now()
    const totalOperations = this.successes + this.failures
    this.healthScore = totalOperations > 0 ? this.successes / totalOperations : 0.0

    if (this.failures >= this.maxFailures || this.healthScore < this.healthThreshold) {
      this.state = "OPEN"
      Logger.error(`Circuit breaker OPEN. Failures: ${this.failures}, Health: ${this.healthScore.toFixed(2)}`)
    }
  }

  getHealthScore(): number {
    return this.healthScore
  }

  getState(): string {
    return this.state
  }
}

// ============================================================================
// CACHE MANAGEMENT
// ============================================================================

class VoiceflowCacheManager {
  private userCreationCache = new Map<string, { promise: Promise<boolean>; timestamp: number }>()
  private sessionCache = new Map<string, { hasLaunched: boolean; timestamp: number }>()

  cleanExpiredEntries(): void {
    const now = Date.now()

    // Clean user creation cache
    this.userCreationCache.forEach((value, key) => {
      if (now - value.timestamp > CONFIG.CACHE_TTL.USER_CREATION) {
        this.userCreationCache.delete(key)
      }
    })

    // Clean session cache
    this.sessionCache.forEach((value, key) => {
      if (now - value.timestamp > CONFIG.CACHE_TTL.SESSION) {
        this.sessionCache.delete(key)
      }
    })
  }

  getUserCreation(userId: string): Promise<boolean> | undefined {
    return this.userCreationCache.get(userId)?.promise
  }

  setUserCreation(userId: string, promise: Promise<boolean>): void {
    this.userCreationCache.set(userId, { promise, timestamp: Date.now() })
  }

  removeUserCreation(userId: string): void {
    this.userCreationCache.delete(userId)
  }

  getSession(userId: string): { hasLaunched: boolean; timestamp: number } | undefined {
    return this.sessionCache.get(userId)
  }

  setSession(userId: string, hasLaunched: boolean): void {
    this.sessionCache.set(userId, { hasLaunched, timestamp: Date.now() })
  }

  removeSession(userId: string): void {
    this.sessionCache.delete(userId)
  }

  getCacheStats(): { userCreationSize: number; sessionSize: number } {
    return {
      userCreationSize: this.userCreationCache.size,
      sessionSize: this.sessionCache.size,
    }
  }
}

// ============================================================================
// LOGGER UTILITY
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
}

// ============================================================================
// GLOBAL INSTANCES
// ============================================================================

const circuitBreaker = new VoiceflowCircuitBreaker()
const cacheManager = new VoiceflowCacheManager()

// ============================================================================
// BUSINESS VARIABLES FETCHER
// ============================================================================

// New function to manage Voiceflow sessions

async function upsertVoiceflowSession(params: {
  sessionId: string
  tenantId: string
  userId: string
  platform: string
  variables?: Record<string, any>
  context?: ConversationContext
}) {
  try {
    const { sessionId, tenantId, userId, platform, variables = {}, context } = params

    await client.voiceflowSession.upsert({
      where: { sessionId },
      update: {
        lastActiveAt: new Date(),
        variables: JSON.stringify(variables),
        context: JSON.stringify(context),
        status: "ACTIVE",
      },
      create: {
        sessionId,
        tenantId,
        userId,
        platform,
        variables: JSON.stringify(variables),
        context: JSON.stringify(context),
        status: "ACTIVE",
        startedAt: new Date(),
        lastActiveAt: new Date(),
      },
    })

    Logger.success(`✅ Voiceflow session upserted: ${sessionId}`)
  } catch (error) {
    Logger.error("Error upserting Voiceflow session:", error)
  }
}


async function fetchTenantIntegrations(
  businessId: string,
  userId: string,
): Promise<{
  tenantId: string | null
  userId: string | null
  stripeCredentials: any | null
  crmCredentials: any | null
  integrations: Array<{
    id: string
    type: string
    name: string
    credentials: any
    capabilities: Record<string, boolean> // Added capabilities
  }>
  capabilityVariables: Record<string, string>
}> {
  try {
    Logger.info(`Fetching tenant integrations for business: ${businessId}, user: ${userId}`)

    // Find tenant by userId (assuming your tenant is linked to the business owner)
    const tenant = await client.tenant.findFirst({
      where: {
        userId: userId, // Link tenant to the business owner
      },
      include: {
        integrations: {
          where: {
            isActive: true,
          },
        },
      },
    })

    if (!tenant) {
      Logger.warning(`No tenant found for user: ${userId}`)
      return {
        tenantId: null,
        userId: null,
        stripeCredentials: null,
        crmCredentials: null,
        integrations: [],
        capabilityVariables: {},
      }
    }

    Logger.info(`Found tenant: ${tenant.id} with ${tenant.integrations.length} integrations`)

    // Decrypt and organize credentials
    const integrations: Array<{
      id: string
      type: string
      name: string
      credentials: any
      capabilities: Record<string, boolean>
    }> = []

    let stripeCredentials = null
    let crmCredentials = null
    const capabilityVariables: Record<string, string> = {}

    for (const integration of tenant.integrations) {
      try {
        // Use decryptCredentials function which handles the encrypted:iv format
        const decryptedCredentials = decryptCredentials(integration.encryptedCredentials)

        const capabilities = integration.capabilities ? JSON.parse(integration.capabilities) : {}

        integrations.push({
          id: integration.id,
          type: integration.type,
          name: integration.name,
          credentials: decryptedCredentials,
          capabilities,
        })

        const integrationPrefix = integration.type.toLowerCase()

        // Set integration availability
        capabilityVariables[`has_${integrationPrefix}_integration`] = "true"

        // Set specific capability flags based on integration type
        if (integration.type === "STRIPE") {
          stripeCredentials = decryptedCredentials
          capabilityVariables[`stripe_can_create_payment_links`] = capabilities.createPaymentLinks ? "true" : "false"
          capabilityVariables[`stripe_can_verify_payments`] = capabilities.verifyPayments ? "true" : "false"
          capabilityVariables[`stripe_can_create_refunds`] = capabilities.createRefunds ? "true" : "false"
          capabilityVariables[`stripe_can_manage_customers`] = capabilities.manageCustomers ? "true" : "false"
          capabilityVariables[`stripe_can_list_products`] = capabilities.listProducts ? "true" : "false"
        } else if (integration.type === "HUBSPOT") {
          crmCredentials = decryptedCredentials
          capabilityVariables[`hubspot_can_create_contacts`] = capabilities.createContacts ? "true" : "false"
          capabilityVariables[`hubspot_can_update_contacts`] = capabilities.updateContacts ? "true" : "false"
          capabilityVariables[`hubspot_can_create_deals`] = capabilities.createDeals ? "true" : "false"
        } else if (integration.type === "MAILCHIMP") {
          capabilityVariables[`mailchimp_can_add_subscribers`] = capabilities.addSubscribers ? "true" : "false"
          capabilityVariables[`mailchimp_can_send_campaigns`] = capabilities.sendCampaigns ? "true" : "false"
        } else if (integration.type === "TWILIO") {
          capabilityVariables[`twilio_can_send_sms`] = capabilities.sendSMS ? "true" : "false"
          capabilityVariables[`twilio_can_make_calls`] = capabilities.makeCalls ? "true" : "false"
        } else if (integration.type === "CALENDLY") {
          capabilityVariables[`calendly_can_create_bookings`] = capabilities.createBookings ? "true" : "false"
          capabilityVariables[`calendly_can_list_events`] = capabilities.listEvents ? "true" : "false"
        } else if (integration.type === "SHOPIFY") {
          capabilityVariables[`shopify_can_search_products`] = capabilities.searchProducts ? "true" : "false"
          capabilityVariables[`shopify_can_check_inventory`] = capabilities.checkInventory ? "true" : "false"
          capabilityVariables[`shopify_can_create_discounts`] = capabilities.createDiscounts ? "true" : "false"
        } else if (integration.type === "SLACK") {
          capabilityVariables[`slack_can_send_messages`] = capabilities.sendMessages ? "true" : "false"
          capabilityVariables[`slack_can_create_channels`] = capabilities.createChannels ? "true" : "false"
        } else if (integration.type === "PAYPAL") {
          capabilityVariables[`paypal_can_create_payments`] = capabilities.createPayments ? "true" : "false"
          capabilityVariables[`paypal_can_create_invoices`] = capabilities.createInvoices ? "true" : "false"
        }

        Logger.info(`Processed capabilities for ${integration.type}: ${integration.name}`)
      } catch (error) {
        Logger.error(`Failed to decrypt credentials for integration ${integration.id}:`, error)
      }
    }

    return {
      tenantId: tenant.id,
      userId: tenant.userId,
      stripeCredentials,
      crmCredentials,
      integrations,
      capabilityVariables,
    }
  } catch (error) {
    Logger.error("Error fetching tenant integrations:", error)
    return {
      tenantId: null,
      userId: null,
      stripeCredentials: null,
      crmCredentials: null,
      integrations: [],
      capabilityVariables: {},
    }
  }
}


// Helper function to generate deterministic UUID from string
function generateDeterministicUuid(input: string): string {
  const crypto = require("crypto")
  const hash = crypto.createHash("md5").update(`instagram_${input}`).digest("hex")
  return [hash.slice(0, 8), hash.slice(8, 12), hash.slice(12, 16), hash.slice(16, 20), hash.slice(20, 32)].join("-")
}

export async function fetchEnhancedBusinessVariables(
  businessId: string,
  automationId: string,
  workflowConfigId: string | null,
  conversationContext?: ConversationContext,
): Promise<Record<string, string>> {
  Logger.info("Fetching enhanced business variables with multi-tenant support...")

  try {
    // CRITICAL: Validate businessId first
    if (!businessId) {
      Logger.error("CRITICAL: businessId is undefined/null/empty")
      throw new Error(`businessId is required but received: ${businessId}`)
    }

    Logger.info(`Starting with businessId: ${businessId}, automationId: ${automationId}`)

    // Get business profile and business data in parallel
    const [profileResult, businessResult] = await Promise.allSettled([
      getBusinessProfileForAutomation(automationId),
      getBusinessForWebhook(businessId),
    ])

    // Handle business profile
    const { profileContent, businessContext } =
      profileResult.status === "fulfilled"
        ? profileResult.value
        : {
            profileContent: "",
            businessContext: {
              businessName: "Our Business",
              businessType: "Service",
              website: "",
              responseLanguage: "English",
              businessDescription: "",
              name: "",
            },
          }

    let businessData: BusinessData | null = null
    if (
      businessResult.status === "fulfilled" &&
      businessResult.value.status === 200 &&
      businessResult.value.data.business
    ) {
      businessData = businessResult.value.data.business
    } else {
      Logger.warning("Business data fetch failed, using profile data only")
    }

    // Get user ID from business record
    const businessUser = await getUserFromBusiness(businessId)
    const userId = businessUser?.userId || businessUser?.User?.id

    if (!userId) {
      Logger.warning("No userId found from business record")
    }

    // Fetch tenant integrations with proper IDs
    const tenantData = await fetchTenantIntegrations(businessId, userId || "")

    // FIXED: Handle Voiceflow session with proper UUID mapping
    if (conversationContext && tenantData.tenantId && tenantData.userId) {
      try {
        const sessionId = generateDeterministicUuid(conversationContext.senderId)

        await upsertVoiceflowSession({
          sessionId: sessionId, // Generated UUID from Instagram senderId
          tenantId: tenantData.tenantId, // Actual tenant UUID
          userId: tenantData.userId, // Actual user UUID
          platform: "instagram",
          variables: {},
          context: conversationContext,
        })

        Logger.info(`Voiceflow session created/updated with sessionId: ${sessionId}`)
      } catch (sessionError) {
        Logger.error("Failed to upsert Voiceflow session:", sessionError)
        // Continue execution - session upserting is not critical for variables
      }
    } else {
      Logger.info("Skipping Voiceflow session upsert - missing required IDs or context")
    }

    // Build enhanced variables with tenant information
    const result: Record<string, string> = {
      // Core business information
      business_profile: profileContent || "Professional business assistant",
      business_name: businessContext.businessName || businessData?.businessName || "Our Business",
      display_name: businessContext.name || businessData?.name || "",
      welcome_message: "Hello! How can I help you today?",
      business_type: businessContext.businessType || businessData?.businessType || "Service Business",
      business_description:
        businessContext.businessDescription ||
        businessData?.businessDescription ||
        "We provide excellent customer service",
      website: businessContext.website || businessData?.website || "",
      response_language: businessContext.responseLanguage || businessData?.responseLanguage || "English",
      automation_id: businessData?.automationId || automationId,

      // CRITICAL: Multi-tenant variables for Voiceflow API blocks
      tenant_id: tenantData.tenantId || "",
      system_user_id: tenantData.userId || "",
      has_stripe_integration: tenantData.stripeCredentials ? "true" : "false",
      has_crm_integration: tenantData.crmCredentials ? "true" : "false",
      stripe_configured: tenantData.stripeCredentials ? "true" : "false",

      ...tenantData.capabilityVariables,

      // Session and user context
      session_id: conversationContext?.senderId || "", // Instagram senderId for reference
      user_id: conversationContext?.senderId || "", // Instagram senderId for reference
      sender_id: conversationContext?.senderId || "",

      // Integration status for conditional flows in Voiceflow
      integrations_count: tenantData.integrations.length.toString(),
      available_integrations: tenantData.integrations.map((i) => i.type).join(","),

      // Default values for backward compatibility
      business_industry: businessData?.businessType || "Customer Service",
      instagram_handle: "",
      business_hours: "24/7",
      auto_reply_enabled: "Yes",
      promotion_message: "Thank you for contacting us!",
      target_audience: "Valued customers",

      // Customer data placeholders (will be populated during conversation)
      customer_name: "",
      customer_email: "",
      customer_phone: "",

      // System status
      system_status: "operational",
      fallback_mode: businessData ? "false" : "true",
      workflow_config_id: workflowConfigId || "",
    }

    // Add conversation context if available
    if (conversationContext) {
      result.customer_type = conversationContext.customerType
      result.is_new_user = conversationContext.isNewUser.toString()
      result.current_message = conversationContext.userMessage
      result.page_id = conversationContext.pageId

      result.conversation_history = conversationContext.messageHistory
        .slice(-3)
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join(" | ")
      result.conversation_length = conversationContext.messageHistory.length.toString()

      // Conversation insights
      const hasQuestions = conversationContext.userMessage.includes("?")
      const hasUrgentWords = /urgent|asap|immediately|emergency|help/i.test(conversationContext.userMessage)
      const hasPurchaseIntent = /buy|purchase|order|price|cost|payment/i.test(conversationContext.userMessage)

      result.has_questions = hasQuestions.toString()
      result.is_urgent = hasUrgentWords.toString()
      result.has_purchase_intent = hasPurchaseIntent.toString()

      // Add greeting detection
      const isGreeting = /^(hi|hello|hey|good morning|good afternoon|good evening)$/i.test(
        conversationContext.userMessage.trim(),
      )
      result.is_greeting = isGreeting.toString()
    }

    // Set business operation defaults
    result.primary_goal = "Provide excellent customer service"
    result.response_time = "immediate"
    result.custom_goals = "Help customers effectively"
    result.journey_steps = "[]"
    result.enabled_features = "chat, support"
    result.automation_setup_complete = "Yes"
    result.automation_setup_date = new Date().toISOString()
    result.automation_additional_notes = tenantData.tenantId
      ? "Multi-tenant configuration active"
      : "Single tenant fallback mode"

    // Add system metadata
    result.system_timestamp = new Date().toISOString()
    result.voiceflow_health_score = circuitBreaker.getHealthScore().toFixed(2)

    Logger.success("Enhanced business variables prepared with tenant support")
    Logger.info(`Tenant ID: ${result.tenant_id}`)
    Logger.info(`System User ID: ${result.system_user_id}`)
    Logger.info(`Stripe: ${result.has_stripe_integration}`)
    Logger.info(`CRM: ${result.has_crm_integration}`)

    return result
  } catch (error) {
    Logger.error("Error in fetchEnhancedBusinessVariables:", error)

    // Return minimal safe variables with empty tenant info
    return {
      business_name: "Customer Service",
      welcome_message: "Hello! How can I help you today?",
      business_industry: "Customer Service",
      response_language: "English",
      customer_type: conversationContext?.customerType || "NEW",
      is_new_user: conversationContext?.isNewUser?.toString() || "true",
      current_message: conversationContext?.userMessage || "",
      tenant_id: "", // Empty tenant ID for fallback
      system_user_id: "",
      has_stripe_integration: "false",
      has_crm_integration: "false",
      stripe_configured: "false",
      system_status: "fallback",
      fallback_mode: "true",
      system_timestamp: new Date().toISOString(),
      voiceflow_health_score: "0.5",
      workflow_config_id: workflowConfigId || "",
    }
  }
}

// Enhanced getEnhancedVoiceflowResponse to ensure tenant variables are set
export async function getEnhancedVoiceflowResponse(
  userInput: string,
  userId: string,
  businessVariables: Record<string, string>,
  voiceflowApiKey: string,
  voiceflowProjectId: string,
  voiceflowVersionId?: string,
  options?: {
    maxRetries?: number
    timeoutMs?: number
    enableFallbackDetection?: boolean
    isFirstMessage?: boolean
  },
): Promise<VoiceflowResponse> {
  const {
    maxRetries = CONFIG.RETRY.MAX_ATTEMPTS,
    timeoutMs = CONFIG.TIMEOUTS.INTERACTION,
    enableFallbackDetection = false,
    isFirstMessage = false,
  } = options || {}

  if (!voiceflowApiKey || !voiceflowProjectId) {
    Logger.error("Voiceflow API Key or Project ID is missing.")
    return {
      success: false,
      error: "Voiceflow API Key or Project ID is missing.",
      healthScore: circuitBreaker.getHealthScore(),
      fallbackReason: "Missing Voiceflow credentials",
    }
  }

  try {
    const result = await circuitBreaker.execute(async () => {
      let lastError: Error | null = null

      // Clean expired cache entries
      cacheManager.cleanExpiredEntries()

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          Logger.info(`🎙️ Voiceflow API attempt ${attempt}/${maxRetries} for user ${userId}`)

          // Log tenant information for debugging
          Logger.info(
            `🏢 Tenant variables: tenant_id=${businessVariables.tenant_id}, stripe=${businessVariables.has_stripe_integration}`,
          )

          // Check session state
          const sessionData = cacheManager.getSession(userId)
          const needsLaunch = isFirstMessage || !sessionData?.hasLaunched

          // Prepare request payload with enhanced variable passing
          let requestPayload: any
          if (needsLaunch) {
            Logger.info(`🚀 Sending launch request for user ${userId} with tenant variables`)
            requestPayload = {
              action: { type: "launch" },
              config: {
                tts: false,
                stripSSML: true,
                stopAll: true,
                excludeTypes: ["block", "debug", "flow"],
              },
              // CRITICAL: Set variables at launch to ensure they're available immediately
              state: {
                variables: {
                  ...businessVariables,
                  // Ensure critical tenant variables are definitely set
                  tenant_id: businessVariables.tenant_id || "",
                  session_initialized: "true",
                  api_ready: businessVariables.tenant_id ? "true" : "false",
                },
              },
            }
          } else {
            requestPayload = {
              action: { type: "text", payload: userInput },
              config: {
                tts: false,
                stripSSML: true,
                stopAll: true,
                excludeTypes: ["block", "debug", "flow"],
              },
              // Always include variables to maintain state
              state: {
                variables: {
                  ...businessVariables,
                  current_message: userInput,
                  message_timestamp: new Date().toISOString(),
                },
              },
            }
          }

          // Make API call
          const response = await axios.post<VoiceflowTrace[]>(
            `https://general-runtime.voiceflow.com/state/user/${userId}/interact`,
            requestPayload,
            {
              headers: {
                Authorization: voiceflowApiKey,
                versionID: voiceflowVersionId || undefined,
                projectID: voiceflowProjectId,
                accept: "application/json",
                "content-type": "application/json",
              },
              timeout: timeoutMs,
            },
          )

          // Handle launch + text sequence
          if (needsLaunch && userInput.trim().length > 0) {
            Logger.info(`📝 Following up with text request for user ${userId}`)
            const textResponse = await axios.post<VoiceflowTrace[]>(
              `https://general-runtime.voiceflow.com/state/user/${userId}/interact`,
              {
                action: { type: "text", payload: userInput },
                config: {
                  tts: false,
                  stripSSML: true,
                  stopAll: true,
                  excludeTypes: ["block", "debug", "flow"],
                },
                // Maintain variables in follow-up request
                state: {
                  variables: {
                    ...businessVariables,
                    current_message: userInput,
                  },
                },
              },
              {
                headers: {
                  Authorization: voiceflowApiKey,
                  versionID: voiceflowVersionId || undefined,
                  projectID: voiceflowProjectId,
                  accept: "application/json",
                  "content-type": "application/json",
                },
                timeout: timeoutMs,
              },
            )
            response.data = textResponse.data
          }

          // Mark session as launched
          cacheManager.setSession(userId, true)

          // Process response
          const processedResponse = processEnhancedVoiceflowResponse(response.data)
          const updatedVariables = await fetchVoiceflowVariables(
            userId,
            voiceflowApiKey,
            voiceflowProjectId,
            voiceflowVersionId,
          )

          // Fallback detection
          if (enableFallbackDetection) {
            const fallbackCheck = detectFallbackConditions(processedResponse, userInput)
            if (fallbackCheck.shouldFallback) {
              Logger.warning(`Voiceflow fallback condition detected: ${fallbackCheck.reason}`)
              return {
                success: false,
                error: fallbackCheck.reason,
                isEmpty: fallbackCheck.isEmpty,
                fallbackReason: fallbackCheck.reason,
                healthScore: circuitBreaker.getHealthScore(),
              }
            }
          }

          Logger.success(`Voiceflow API success on attempt ${attempt}`)
          return {
            success: true,
            response: processedResponse,
            variables: updatedVariables,
            healthScore: circuitBreaker.getHealthScore(),
          }
        } catch (error) {
          lastError = error as Error
          Logger.error(`Voiceflow API attempt ${attempt} failed:`, error)

          if (attempt < maxRetries) {
            const baseDelay = Math.pow(2, attempt) * CONFIG.RETRY.BASE_DELAY
            const jitter = Math.random() * CONFIG.RETRY.MAX_JITTER
            const delay = baseDelay + jitter

            Logger.info(`⏳ Retrying Voiceflow API in ${Math.round(delay)}ms...`)
            await new Promise((resolve) => setTimeout(resolve, delay))
          }
        }
      }

      throw lastError || new Error("Failed to get Voiceflow response after all retries")
    })

    return result
  } catch (error) {
    Logger.error("💥 Voiceflow circuit breaker or final error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      healthScore: circuitBreaker.getHealthScore(),
      fallbackReason: "Circuit breaker open or API failure",
    }
  }
}

export async function fetchEnhancedBusinessVariablesE(
  businessId: string,
  automationId: string,
  workflowConfigId: string | null,
  conversationContext?: ConversationContext,
): Promise<Record<string, string>> {
  Logger.info("🔍 Fetching enhanced business variables...")

  try {
    // Get business profile and traditional business data in parallel
    const [profileResult, businessResult] = await Promise.allSettled([
      getBusinessProfileForAutomation(automationId),
      getBusinessForWebhook(businessId),
    ])

    // Handle business profile
    const { profileContent, businessContext } =
      profileResult.status === "fulfilled"
        ? profileResult.value
        : {
            profileContent: "",
            businessContext: {
              businessName: "Our Business",
              businessType: "Service",
              website: "",
              responseLanguage: "English",
              businessDescription: "",
              name: "",
            },
          }

    let businessData: BusinessData | null = null
    if (
      businessResult.status === "fulfilled" &&
      businessResult.value.status === 200 &&
      businessResult.value.data.business
    ) {
      businessData = businessResult.value.data.business
    } else {
      Logger.warning("Business data fetch failed, using profile data only")
    }

    // Build robust fallback variables using only fields available in new Business model
    const result: Record<string, string> = {
      // Core business information with multiple fallbacks
      business_profile: profileContent || "Professional business assistant",
      business_name: businessContext.businessName || businessData?.businessName || "Our Business",
      display_name: businessContext.name || businessData?.name || "",
      welcome_message: "Hello! How can I help you today?",
      business_type: businessContext.businessType || businessData?.businessType || "Service Business",
      business_description:
        businessContext.businessDescription ||
        businessData?.businessDescription ||
        "We provide excellent customer service",
      website: businessContext.website || businessData?.website || "",
      response_language: businessContext.responseLanguage || businessData?.responseLanguage || "English",
      automation_id: businessData?.automationId || automationId,

      // Default values for fields that no longer exist in the model
      business_industry: businessData?.businessType || "Customer Service", // Use businessType as industry fallback
      instagram_handle: "", // No longer in model
      business_hours: "24/7", // No longer in model
      auto_reply_enabled: "Yes", // No longer in model, default to Yes
      promotion_message: "Thank you for contacting us!", // No longer in model
      target_audience: "Valued customers", // No longer in model

      // Customer data placeholders
      customer_name: "",
      customer_email: "",
      customer_phone: "",

      // System status
      system_status: "operational",
      fallback_mode: businessData ? "false" : "true",
      workflow_config_id: workflowConfigId || "",
    }

    // Add conversation context
    if (conversationContext) {
      result.customer_type = conversationContext.customerType
      result.is_new_user = conversationContext.isNewUser.toString()
      result.current_message = conversationContext.userMessage
      result.conversation_history = conversationContext.messageHistory
        .slice(-3) // Reduce to last 3 messages to avoid overwhelming Voiceflow
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join(" | ")
      result.conversation_length = conversationContext.messageHistory.length.toString()

      // Conversation insights
      const hasQuestions = conversationContext.userMessage.includes("?")
      const hasUrgentWords = /urgent|asap|immediately|emergency|help/i.test(conversationContext.userMessage)
      const hasPurchaseIntent = /buy|purchase|order|price|cost|payment/i.test(conversationContext.userMessage)

      result.has_questions = hasQuestions.toString()
      result.is_urgent = hasUrgentWords.toString()
      result.has_purchase_intent = hasPurchaseIntent.toString()

      // Add greeting detection
      const isGreeting = /^(hi|hello|hey|good morning|good afternoon|good evening)$/i.test(
        conversationContext.userMessage.trim(),
      )
      result.is_greeting = isGreeting.toString()
    }

    // Since the complex JSON fields no longer exist, set safe defaults
    if (businessData) {
      // Set defaults for fields that were previously JSON parsed
      result.primary_goal = "Provide excellent customer service"
      result.response_time = "immediate"
      result.custom_goals = "Help customers effectively"
      result.journey_steps = "[]"
      result.enabled_features = "chat, support"
      result.business_type_data = ""
      result.website_analysis = ""
      result.automation_setup_complete = "Yes"
      result.automation_setup_date = new Date().toISOString()
      result.automation_additional_notes = "Simplified business configuration"
    } else {
      // Set safe defaults when no business data
      result.primary_goal = "Provide excellent customer service"
      result.response_time = "immediate"
      result.custom_goals = "Help customers effectively"
      result.journey_steps = "[]"
      result.enabled_features = "chat, support"
      result.automation_setup_complete = "Yes"
      result.automation_setup_date = new Date().toISOString()
      result.automation_additional_notes = "Using fallback configuration"
    }

    result.system_timestamp = new Date().toISOString()
    result.voiceflow_health_score = circuitBreaker.getHealthScore().toFixed(2)

    Logger.success(`✅ Enhanced business variables prepared (fallback mode: ${result.fallback_mode})`)
    return result
  } catch (error) {
    Logger.error("❌ Error in fetchEnhancedBusinessVariables:", error)

    // Return minimal safe variables
    return {
      business_name: "Customer Service",
      welcome_message: "Hello! How can I help you today?",
      business_industry: "Customer Service",
      response_language: "English",
      customer_type: conversationContext?.customerType || "NEW",
      is_new_user: conversationContext?.isNewUser?.toString() || "true",
      current_message: conversationContext?.userMessage || "",
      system_status: "fallback",
      fallback_mode: "true",
      system_timestamp: new Date().toISOString(),
      voiceflow_health_score: "0.5",
      workflow_config_id: workflowConfigId || "",
    }
  }
}

// ============================================================================
// INSTAGRAM COMPATIBILITY CHECKER
// ============================================================================

class InstagramCompatibilityChecker {
  /**
   * Checks if media URL is compatible with Instagram
   */
  static isMediaCompatible(url: string, type: string): boolean {
    const supportedImageFormats = [".jpg", ".jpeg", ".png", ".gif"]
    const supportedVideoFormats = [".mp4", ".avi", ".mov"]
    const supportedAudioFormats = [".mp3", ".wav", ".ogg"]

    const urlLower = url.toLowerCase()

    switch (type) {
      case "image":
        return supportedImageFormats.some((format) => urlLower.includes(format))
      case "video":
        return supportedVideoFormats.some((format) => urlLower.includes(format))
      case "audio":
        return supportedAudioFormats.some((format) => urlLower.includes(format))
      default:
        return true // Allow files by default
    }
  }

  /**
   * Validates button structure for Instagram compliance
   */
  static validateButton(button: any): InstagramAlignedButton | null {
    let title = ""
    let payload = ""
    let url = undefined

    // Extract title with comprehensive fallback
    if (button.name) title = button.name
    else if (button.title) title = button.title
    else if (button.text) title = button.text
    else if (button.label) title = button.label
    else title = "Option"

    // Clean and validate title
    title = title.trim()
    if (!title || title.length === 0) title = "Select"
    if (title.length > INSTAGRAM_LIMITS.BUTTON_TITLE_LIMIT) {
      title = title.substring(0, INSTAGRAM_LIMITS.BUTTON_TITLE_LIMIT - 3) + "..."
    }

    // Extract payload with comprehensive fallback
    if (button.request?.type === "intent" && button.request.payload?.intent?.name) {
      payload = button.request.payload.intent.name
    } else if (button.request?.type === "text") {
      payload = typeof button.request.payload === "string" ? button.request.payload : button.name || title
    } else if (button.request?.payload?.label) {
      payload = button.request.payload.label
    } else if (button.payload) {
      payload = typeof button.payload === "string" ? button.payload : JSON.stringify(button.payload)
    } else if (button.value) {
      payload = button.value
    } else {
      payload = button.name || title
    }

    // Handle URL for web buttons
    if (button.url || button.link) {
      url = button.url || button.link
    }

    // Validate payload length
    if (payload.length > INSTAGRAM_LIMITS.PAYLOAD_LIMIT) {
      payload = payload.substring(0, INSTAGRAM_LIMITS.PAYLOAD_LIMIT)
    }

    return { title, payload, url }
  }
}

// ============================================================================
// VOICEFLOW RESPONSE PROCESSOR
// ============================================================================


export function processEnhancedVoiceflowResponse(traces: VoiceflowTrace[]): InstagramAlignedMessage {
  let result = ""
  const quickReplies: InstagramAlignedQuickReply[] = []
  const buttons: InstagramAlignedButton[] = []
  const carousel: InstagramAlignedCarouselElement[] = []
  let attachment: InstagramAlignedMessage["attachment"] = undefined
  let requiresHumanHandoff = false
  let priority: InstagramAlignedMessage["priority"] = "MEDIUM"
  let sentiment: InstagramAlignedMessage["sentiment"] = "neutral"
  let complexity: InstagramAlignedMessage["complexity"] = "medium"

  // Processing flags
  let hasWorkflowContent = false
  let fallbackText = ""

  console.log("🔍 Processing Voiceflow traces for Instagram:", traces.length)

  for (const trace of traces) {
    console.log(`📋 Processing trace type: ${trace.type}`)

    switch (trace.type) {
      case "speak":
      case "text":
        if ("message" in trace.payload) {
          const message = trace.payload.message
          result += message + "\n"
          hasWorkflowContent = true

          // Analyze complexity based on message content
          if (message.length > 200 || message.split(".").length > 3) {
            complexity = "complex"
          } else if (message.length < 50) {
            complexity = "simple"
          }
        }
        break

      case "choice":
        if ("buttons" in trace.payload && Array.isArray(trace.payload.buttons)) {
          hasWorkflowContent = true

          trace.payload.buttons.forEach((button: VoiceflowButton, index: number) => {
            const validatedButton = InstagramCompatibilityChecker.validateButton(button)

            if (validatedButton) {
              console.log(`✅ Button ${index + 1} validated:`, validatedButton)

              // Add to both arrays for maximum compatibility
              buttons.push(validatedButton)
              quickReplies.push({
                content_type: "text",
                title: validatedButton.title,
                payload: validatedButton.payload,
              })
            } else {
              console.warn(`❌ Button ${index + 1} failed validation:`, button)
            }
          })
        }
        break

      case "carousel":
        if ("cards" in trace.payload && Array.isArray(trace.payload.cards)) {
          hasWorkflowContent = true

          trace.payload.cards.forEach((card: any, cardIndex: number) => {
            const carouselItem: InstagramAlignedCarouselElement = {
              title: (card.title || "Card").substring(0, INSTAGRAM_LIMITS.CAROUSEL_TITLE_LIMIT),
              subtitle:
                card.description?.text?.substring(0, INSTAGRAM_LIMITS.CAROUSEL_SUBTITLE_LIMIT) ||
                card.description?.substring(0, INSTAGRAM_LIMITS.CAROUSEL_SUBTITLE_LIMIT),
              image_url: card.imageUrl || card.image,
            }

            // Validate image URL if present
            if (
              carouselItem.image_url &&
              !InstagramCompatibilityChecker.isMediaCompatible(carouselItem.image_url, "image")
            ) {
              console.warn(`⚠️  Carousel card ${cardIndex + 1} has unsupported image format`)
              // Keep the URL but log warning
            }

            // Process carousel buttons with Instagram limits
            if (card.buttons && Array.isArray(card.buttons)) {
              carouselItem.buttons = []

              card.buttons.slice(0, INSTAGRAM_LIMITS.BUTTON_LIMIT).forEach((btn: any, btnIndex: number) => {
                const validatedButton = InstagramCompatibilityChecker.validateButton(btn)

                if (validatedButton) {
                  carouselItem.buttons!.push(validatedButton)
                  console.log(`✅ Carousel card ${cardIndex + 1}, button ${btnIndex + 1} validated`)
                } else {
                  console.warn(`❌ Carousel card ${cardIndex + 1}, button ${btnIndex + 1} failed validation`)
                }
              })
            }

            carousel.push(carouselItem)
          })
        }
        break

      case "cardV2":
        if (trace.payload) {
          hasWorkflowContent = true

          if (trace.payload.title) {
            result += `*${trace.payload.title}*\n`
          }
          if (trace.payload.description?.text) {
            result += `${trace.payload.description.text}\n`
          }

          // Handle cardV2 buttons with Instagram validation
          if (trace.payload.buttons && Array.isArray(trace.payload.buttons)) {
            trace.payload.buttons.forEach((button: any, index: number) => {
              const validatedButton = InstagramCompatibilityChecker.validateButton(button)

              if (validatedButton) {
                buttons.push(validatedButton)
                quickReplies.push({
                  content_type: "text",
                  title: validatedButton.title,
                  payload: validatedButton.payload,
                })
                console.log(`✅ CardV2 button ${index + 1} validated`)
              }
            })
          }
        }
        break

      case "visual":
        if ("image" in trace.payload) {
          hasWorkflowContent = true

          if (InstagramCompatibilityChecker.isMediaCompatible(trace.payload.image, "image")) {
            attachment = {
              type: "image",
              url: trace.payload.image,
              caption: trace.payload.caption,
            }
            console.log("✅ Image attachment validated for Instagram")
          } else {
            console.warn("⚠️  Image format may not be supported by Instagram")
            // Still include it but add to fallback text
            fallbackText += `📷 Image: ${trace.payload.image}\n`
          }
        }
        break

      case "media":
        if ("url" in trace.payload) {
          hasWorkflowContent = true

          let mediaType: "image" | "video" | "audio" | "file" = "file"
          const url = trace.payload.url.toLowerCase()

          // Determine media type
          if (url.includes(".jpg") || url.includes(".jpeg") || url.includes(".png") || url.includes(".gif")) {
            mediaType = "image"
          } else if (url.includes(".mp4") || url.includes(".avi") || url.includes(".mov")) {
            mediaType = "video"
          } else if (url.includes(".mp3") || url.includes(".wav") || url.includes(".ogg")) {
            mediaType = "audio"
          }

          // Validate compatibility
          if (InstagramCompatibilityChecker.isMediaCompatible(trace.payload.url, mediaType)) {
            attachment = {
              type: mediaType,
              url: trace.payload.url,
              caption: trace.payload.caption || trace.payload.title,
            }
            console.log(`✅ ${mediaType} attachment validated for Instagram`)
          } else {
            console.warn(`⚠️  ${mediaType} format may not be supported by Instagram`)
            fallbackText += `📎 Media: ${trace.payload.url}\n`
          }
        }
        break

      case "card":
        if (trace.payload) {
          hasWorkflowContent = true
          if ("title" in trace.payload) {
            result += `*${trace.payload.title}*\n`
          }
          if ("description" in trace.payload) {
            result += `${trace.payload.description}\n`
          }
        }
        break

      case "end":
        hasWorkflowContent = true
        result += "\nHello, what brings you today, how can I help you?"
        break

      case "handoff":
        hasWorkflowContent = true
        requiresHumanHandoff = true
        priority = "HIGH"
        if ("reason" in trace.payload) {
          result += `\n[Escalating to human agent: ${trace.payload.reason}]\n`
        }
        break

      case "priority":
        if ("level" in trace.payload) {
          priority = trace.payload.level
        }
        break

      case "sentiment":
        if ("value" in trace.payload) {
          sentiment = trace.payload.value
        }
        break

      // Instagram doesn't support these - handle gracefully
      case "path":
        console.log(`📍 Path trace ignored for Instagram: ${trace.payload.path}`)
        break

      case "debug":
        console.log("🐛 Debug trace ignored for Instagram:", trace.payload)
        break

      case "knowledgeBase":
        console.log("📚 Knowledge base trace ignored - workflow responses only")
        break

      default:
        console.warn(`⚠️  Unhandled trace type for Instagram: ${trace.type}`, trace)
        break
    }
  }

  // Handle case where only knowledge base or unsupported content was found
  if (!hasWorkflowContent) {
    console.warn("⚠️  No Instagram-compatible workflow content found")
    return {
      text: "",
      requiresHumanHandoff: false,
      priority: "LOW",
      sentiment: "neutral",
      complexity: "simple",
    }
  }

  // Auto-detect sentiment if not explicitly set
  if (sentiment === "neutral") {
    const text = (result + fallbackText).toLowerCase()
    if (
      text.includes("sorry") ||
      text.includes("apologize") ||
      text.includes("unfortunately") ||
      text.includes("problem") ||
      text.includes("error")
    ) {
      sentiment = "negative"
    } else if (
      text.includes("great") ||
      text.includes("excellent") ||
      text.includes("wonderful") ||
      text.includes("thank") ||
      text.includes("perfect") ||
      text.includes("awesome")
    ) {
      sentiment = "positive"
    }
  }

  // Combine main result with fallback text
  let finalText = (result + fallbackText).trim()

  // Apply Instagram text limits
  if (finalText.length > INSTAGRAM_LIMITS.MESSAGE_LIMIT) {
    finalText = finalText.substring(0, INSTAGRAM_LIMITS.MESSAGE_LIMIT - 3) + "..."
    console.warn("⚠️  Text truncated to fit Instagram limits")
  }

  // Apply Instagram limits to arrays
  const limitedQuickReplies = quickReplies.slice(0, INSTAGRAM_LIMITS.QUICK_REPLY_LIMIT)
  const limitedButtons = buttons.slice(0, INSTAGRAM_LIMITS.BUTTON_LIMIT)
  const limitedCarousel = carousel.slice(0, INSTAGRAM_LIMITS.CAROUSEL_LIMIT)

  // Log final result
  console.log("✅ Instagram-aligned processing complete:", {
    textLength: finalText.length,
    quickRepliesCount: limitedQuickReplies.length,
    buttonsCount: limitedButtons.length,
    carouselCount: limitedCarousel.length,
    hasAttachment: !!attachment,
  })

  return {
    text: finalText,
    quickReplies: limitedQuickReplies.length > 0 ? limitedQuickReplies : undefined,
    buttons: limitedButtons.length > 0 ? limitedButtons : undefined,
    carousel: limitedCarousel.length > 0 ? limitedCarousel : undefined,
    attachment,
    requiresHumanHandoff,
    priority,
    sentiment,
    complexity,
  }
}

// ============================================================================
// FALLBACK DETECTION
// ============================================================================

function detectFallbackConditions(
  response: any,
  userInput: string,
): { shouldFallback: boolean; reason: string; isEmpty: boolean } {
  if (!response.text || response.text.trim().length === 0) {
    return { shouldFallback: true, reason: "Empty response from Voiceflow", isEmpty: true }
  }

  // Check if this is a greeting - be more lenient with generic responses for greetings
  const isGreeting = /^(hi|hello|hey|good morning|good afternoon|good evening)$/i.test(userInput.trim())

  const genericResponses = [
    "i don't understand",
    // "sorry, i didn't get that",
    "can you repeat that",
    // "i'm not sure what you mean",
    // "error",
    // "something went wrong",
    // "please try again",
    // "system error",
    // "unable to process",
  ]

  const responseText = response.text.toLowerCase()
  const isGeneric = genericResponses.some((generic) => responseText.includes(generic))

  // For greetings, only fallback if it's a very generic error response
  if (isGreeting && isGeneric) {
    const isVeryGeneric =
      responseText.includes("error") || responseText.includes("system") || responseText.includes("something went wrong")
    if (!isVeryGeneric) {
      Logger.info("Allowing generic response for greeting")
      return { shouldFallback: false, reason: "", isEmpty: false }
    }
  }

  if (isGeneric) {
    return { shouldFallback: true, reason: `Generic response detected: "${response.text}"`, isEmpty: false }
  }

  if (response.text.length < 10 && !response.quickReplies?.length) {
    return { shouldFallback: true, reason: "Response too short without buttons", isEmpty: false }
  }

  return { shouldFallback: false, reason: "", isEmpty: false }
}

// ============================================================================
// MAIN VOICEFLOW HANDLER
// ============================================================================

export async function getEnhancedVoiceflowResponseE(
  userInput: string,
  userId: string,
  businessVariables: Record<string, string>,
  voiceflowApiKey: string,
  voiceflowProjectId: string,
  voiceflowVersionId?: string,
  options?: {
    maxRetries?: number
    timeoutMs?: number
    enableFallbackDetection?: boolean
    isFirstMessage?: boolean
  },
): Promise<VoiceflowResponse> {
  const {
    maxRetries = CONFIG.RETRY.MAX_ATTEMPTS,
    timeoutMs = CONFIG.TIMEOUTS.INTERACTION,
    enableFallbackDetection = false,
    isFirstMessage = false,
  } = options || {}

  if (!voiceflowApiKey || !voiceflowProjectId) {
    Logger.error("Voiceflow API Key or Project ID is missing.")
    return {
      success: false,
      error: "Voiceflow API Key or Project ID is missing.",
      healthScore: circuitBreaker.getHealthScore(),
      fallbackReason: "Missing Voiceflow credentials",
    }
  }

  try {
    const result = await circuitBreaker.execute(async () => {
      let lastError: Error | null = null

      // Clean expired cache entries
      cacheManager.cleanExpiredEntries()

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          Logger.info(`🎙️ Voiceflow API attempt ${attempt}/${maxRetries} for user ${userId}`)

          // Check session state
          const sessionData = cacheManager.getSession(userId)
          const needsLaunch = isFirstMessage || !sessionData?.hasLaunched

          // Prepare request payload
          let requestPayload: any
          if (needsLaunch) {
            Logger.info(`🚀 Sending launch request for user ${userId}`)
            requestPayload = {
              action: { type: "launch" },
              config: {
                tts: false,
                stripSSML: true,
                stopAll: true,
                excludeTypes: ["block", "debug", "flow"],
              },
            }
          } else {
            requestPayload = {
              action: { type: "text", payload: userInput },
              config: {
                tts: false,
                stripSSML: true,
                stopAll: true,
                excludeTypes: ["block", "debug", "flow"],
              },
            }
          }

          // Add business variables (now passed directly)
          if (Object.keys(businessVariables).length > 0) {
            requestPayload.state = { variables: businessVariables }
          }

          // Make API call
          const response = await axios.post<VoiceflowTrace[]>(
            `https://general-runtime.voiceflow.com/state/user/${userId}/interact`,
            requestPayload,
            {
              headers: {
                Authorization: voiceflowApiKey,
                versionID: voiceflowVersionId || undefined,
                projectID: voiceflowProjectId,
                accept: "application/json",
                "content-type": "application/json",
              },
              timeout: timeoutMs,
            },
          )

          // Handle launch + text sequence
          if (needsLaunch && userInput.trim().length > 0) {
            Logger.info(`📝 Following up with text request for user ${userId}`)
            const textResponse = await axios.post<VoiceflowTrace[]>(
              `https://general-runtime.voiceflow.com/state/user/${userId}/interact`,
              {
                action: { type: "text", payload: userInput },
                config: {
                  tts: false,
                  stripSSML: true,
                  stopAll: true,
                  excludeTypes: ["block", "debug", "flow"],
                },
              },
              {
                headers: {
                  Authorization: voiceflowApiKey,
                  versionID: voiceflowVersionId || undefined,
                  projectID: voiceflowProjectId,
                  accept: "application/json",
                  "content-type": "application/json",
                },
                timeout: timeoutMs,
              },
            )
            response.data = textResponse.data
          }

          // Mark session as launched
          cacheManager.setSession(userId, true)

          // Process response
          const processedResponse = processEnhancedVoiceflowResponse(response.data)
          const updatedVariables = await fetchVoiceflowVariables(
            userId,
            voiceflowApiKey,
            voiceflowProjectId,
            voiceflowVersionId,
          )

          // Fallback detection
          if (enableFallbackDetection) {
            const fallbackCheck = detectFallbackConditions(processedResponse, userInput)
            if (fallbackCheck.shouldFallback) {
              Logger.warning(`Voiceflow fallback condition detected: ${fallbackCheck.reason}`)
              return {
                success: false,
                error: fallbackCheck.reason,
                isEmpty: fallbackCheck.isEmpty,
                fallbackReason: fallbackCheck.reason,
                healthScore: circuitBreaker.getHealthScore(),
              }
            }
          }

          Logger.success(`Voiceflow API success on attempt ${attempt}`)
          return {
            success: true,
            response: processedResponse,
            variables: updatedVariables,
            healthScore: circuitBreaker.getHealthScore(),
          }
        } catch (error) {
          lastError = error as Error
          Logger.error(`Voiceflow API attempt ${attempt} failed:`, error)

          if (attempt < maxRetries) {
            const baseDelay = Math.pow(2, attempt) * CONFIG.RETRY.BASE_DELAY
            const jitter = Math.random() * CONFIG.RETRY.MAX_JITTER
            const delay = baseDelay + jitter

            Logger.info(`⏳ Retrying Voiceflow API in ${Math.round(delay)}ms...`)
            await new Promise((resolve) => setTimeout(resolve, delay))
          }
        }
      }

      throw lastError || new Error("Failed to get Voiceflow response after all retries")
    })

    return result
  } catch (error) {
    Logger.error("💥 Voiceflow circuit breaker or final error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      healthScore: circuitBreaker.getHealthScore(),
      fallbackReason: "Circuit breaker open or API failure",
    }
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

async function fetchVoiceflowVariables(
  userId: string,
  voiceflowApiKey: string,
  voiceflowProjectId: string,
  voiceflowVersionId?: string,
): Promise<VoiceflowVariables> {
  const maxRetries = 2

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.get<{ variables: VoiceflowVariables }>(
        `https://general-runtime.voiceflow.com/state/user/${userId}`,
        {
          headers: {
            Authorization: voiceflowApiKey,
            versionID: voiceflowVersionId || undefined,
            projectID: voiceflowProjectId,
            accept: "application/json",
          },
          timeout: CONFIG.TIMEOUTS.VARIABLES,
        },
      )
      return response.data.variables || {}
    } catch (error) {
      Logger.error(`Error fetching Voiceflow variables (attempt ${attempt}):`, error)
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
    }
  }

  Logger.warning("Failed to fetch Voiceflow variables, returning empty object")
  return {}
}

export async function createVoiceflowUser(userId: string): Promise<boolean> {
  cacheManager.cleanExpiredEntries()

  const existingPromise = cacheManager.getUserCreation(userId)
  if (existingPromise) {
    Logger.info(`User creation already in progress for ${userId}`)
    return await existingPromise
  }

  const creationPromise = Promise.resolve(true) // Voiceflow auto-creates users
  cacheManager.setUserCreation(userId, creationPromise)

  Logger.success(`✅ Voiceflow user will be auto-created on first interaction: ${userId}`)

  setTimeout(() => {
    cacheManager.removeUserCreation(userId)
  }, 10000)

  return true
}

export async function resetVoiceflowUser(
  userId: string,
  voiceflowApiKey: string,
  voiceflowProjectId: string,
  voiceflowVersionId?: string,
): Promise<boolean> {
  try {
    const response = await axios.post(
      `https://general-runtime.voiceflow.com/state/user/${userId}/interact`,
      {
        action: { type: "reset" },
        config: {
          tts: false,
          stripSSML: true,
          stopAll: true,
          excludeTypes: ["block", "debug", "flow"],
        },
      },
      {
        headers: {
          Authorization: voiceflowApiKey,
          versionID: voiceflowVersionId || undefined,
          projectID: voiceflowProjectId,
          accept: "application/json",
          "content-type": "application/json",
        },
        timeout: CONFIG.TIMEOUTS.USER_CREATION,
      },
    )

    cacheManager.removeSession(userId)
    Logger.success(`🔄 Voiceflow user reset successfully: ${userId}`)
    return response.status === 200
  } catch (error) {
    Logger.error("Error resetting Voiceflow user:", error)
    return false
  }
}

export function extractBasicCustomerData(variables: Record<string, any>) {
  return {
    name: variables.customer_name || variables.clientname || variables.name || null,
    email: variables.customer_email || variables.clientemail || variables.email || null,
    phone: variables.customer_phone || variables.clientphone || variables.phone || null,
  }
}

export function formatForInstagramDM(response: {
  text: string
  quickReplies?: { title: string; payload: string }[]
}): {
  text: string
  quick_replies?: Array<{
    content_type: "text"
    title: string
    payload: string
  }>
} {
  const result: any = { text: response.text }

  if (response.quickReplies && response.quickReplies.length > 0) {
    result.quick_replies = response.quickReplies.map((reply) => ({
      content_type: "text",
      title: reply.title,
      payload: reply.payload,
    }))
  }

  return result
}

export function getVoiceflowHealth(): {
  healthScore: number
  circuitBreakerState: string
  cacheStats: { userCreationSize: number; sessionSize: number }
} {
  return {
    healthScore: circuitBreaker.getHealthScore(),
    circuitBreakerState: circuitBreaker.getState(),
    cacheStats: cacheManager.getCacheStats(),
  }
}

// ============================================================================
// DEBUGGING AND TESTING UTILITIES
// ============================================================================

export class InstagramVoiceflowDebugger {
  /**
   * Test the entire pipeline with sample data
   */
  static testInstagramAlignment(): void {
    console.log("🧪 Testing Instagram-Voiceflow alignment...")

    const sampleTraces: VoiceflowTrace[] = [
      {
        type: "text",
        payload: { message: "Hello! How can I help you today?" },
      },
      {
        type: "choice",
        payload: {
          buttons: [
            { name: "Get Started", request: { payload: { intent: { name: "get_started" } } } },
            { name: "Contact Support", request: { payload: "contact_support" } },
            { name: "Learn More", url: "https://example.com" },
          ],
        },
      },
    ]

    const result = processEnhancedVoiceflowResponse(sampleTraces)
    console.log("🎯 Test result:", JSON.stringify(result, null, 2))
  }

  /**
   * Validate Instagram limits compliance
   */
  static validateInstagramCompliance(message: InstagramAlignedMessage): boolean {
    const issues: string[] = []

    if (message.text.length > INSTAGRAM_LIMITS.MESSAGE_LIMIT) {
      issues.push(`Text too long: ${message.text.length}/${INSTAGRAM_LIMITS.MESSAGE_LIMIT}`)
    }

    if (message.quickReplies && message.quickReplies.length > INSTAGRAM_LIMITS.QUICK_REPLY_LIMIT) {
      issues.push(`Too many quick replies: ${message.quickReplies.length}/${INSTAGRAM_LIMITS.QUICK_REPLY_LIMIT}`)
    }

    if (message.buttons && message.buttons.length > INSTAGRAM_LIMITS.BUTTON_LIMIT) {
      issues.push(`Too many buttons: ${message.buttons.length}/${INSTAGRAM_LIMITS.BUTTON_LIMIT}`)
    }

    if (message.carousel && message.carousel.length > INSTAGRAM_LIMITS.CAROUSEL_LIMIT) {
      issues.push(`Too many carousel cards: ${message.carousel.length}/${INSTAGRAM_LIMITS.CAROUSEL_LIMIT}`)
    }

    if (issues.length > 0) {
      console.error("❌ Instagram compliance issues:", issues)
      return false
    }

    console.log("✅ Instagram compliance validated")
    return true
  }
}

export async function sendDMs(
  userId: string,
  receiverId: string,
  message: InstagramAlignedMessage,
  token: string,
  messageType: "DM" | "COMMENT" = "DM",
  commentId?: string,
): Promise<AxiosResponse> {
  console.log("🚀 Sending Instagram-aligned message:", {
    messageType,
    hasText: !!message.text,
    hasButtons: !!message.buttons?.length,
    hasQuickReplies: !!message.quickReplies?.length,
    hasCarousel: !!message.carousel?.length,
    hasAttachment: !!message.attachment,
  })

  const messagePayload: Record<string, any> = {
    recipient: { id: messageType === "DM" ? receiverId : commentId || receiverId },
    messaging_type: "RESPONSE",
  }

  try {
    // Priority 1: Carousel (most engaging)
    if (message.carousel && message.carousel.length > 0) {
      messagePayload.message = {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: message.carousel.map((card) => {
              const element: any = {
                title: card.title,
                subtitle: card.subtitle,
              }

              if (card.image_url) {
                element.image_url = card.image_url
              }

              if (card.buttons && card.buttons.length > 0) {
                element.buttons = card.buttons.map((btn) => ({
                  type: btn.url ? "web_url" : "postback",
                  title: btn.payload,
                  url: btn.url,
                  payload: btn.url ? undefined : btn.payload,
                }))
              }

              return element
            }),
          },
        },
      }
    }
    // Priority 2: Button template (if we have buttons and text)
    else if (message.buttons && message.buttons.length > 0 && message.text) {
      messagePayload.message = {
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text: message.text,
            buttons: message.buttons.map((btn) => ({
              type: btn.url ? "web_url" : "postback",
              title: btn.title,
              url: btn.url,
              payload: btn.url ? undefined : btn.payload,
            })),
          },
        },
      }
    }
    // Priority 3: Media attachment with optional caption
    else if (message.attachment) {
      if (message.attachment.type === "image") {
        messagePayload.message = {
          attachment: {
            type: "image",
            payload: {
              url: message.attachment.url,
              is_reusable: true,
            },
          },
        }

        // Send caption as separate message if present
        if (message.attachment.caption) {
          // This would require a separate API call
          console.log("📝 Image caption would be sent separately:", message.attachment.caption)
        }
      } else {
        // Handle other media types
        messagePayload.message = {
          attachment: {
            type: message.attachment.type,
            payload: {
              url: message.attachment.url,
              is_reusable: true,
            },
          },
        }
      }
    }
    // Priority 4: Text with quick replies
    else {
      messagePayload.message = { text: message.text || "Hello! How can I help you?" }

      if (message.quickReplies && message.quickReplies.length > 0) {
        messagePayload.message.quick_replies = message.quickReplies
      }
    }

    console.log("📤 Final Instagram payload:", JSON.stringify(messagePayload, null, 2))

    // Send the message
    const response = await axios.post(`${process.env.INSTAGRAM_BASE_URL}/v21.0/${userId}/messages`, messagePayload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: 15000,
    })

    console.log("✅ Instagram message sent successfully:", response.status)
    return response
  } catch (error) {
    const axiosError = error as AxiosError
    console.error("❌ Instagram message send failed:", axiosError.response?.data || axiosError.message)

    if (axiosError.response?.data) {
      console.error("📋 Instagram API error details:", JSON.stringify(axiosError.response.data, null, 2))
    }

    throw error
  }
}
