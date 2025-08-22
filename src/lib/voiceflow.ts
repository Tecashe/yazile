
import { getBusinessForWebhook } from "@/actions/businfo"
import { getBusinessProfileForAutomation } from "@/actions/webhook/business-profile"
import type { VoiceflowVariables } from "@/types/voiceflow"
import type { JsonValue } from "@prisma/client/runtime/library"
import { decrypt } from "@/lib/encryption"
import axios from "axios"



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
  request?: {
    payload?: string
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
  automationId: string
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

// export async function fetchEnhancedBusinessVariables(
//   businessId: string,
//   automationId: string,
//   workflowConfigId: string | null,
//   conversationContext?: ConversationContext,
// ): Promise<Record<string, string>> {
//   Logger.info("🔍 Fetching enhanced business variables...")

//   try {
//     // Get business profile and traditional business data in parallel
//     const [profileResult, businessResult] = await Promise.allSettled([
//       getBusinessProfileForAutomation(automationId),
//       getBusinessForWebhook(businessId),
//     ])

//     // Handle business profile
//     const { profileContent, businessContext } =
//       profileResult.status === "fulfilled" ? profileResult.value : { profileContent: "", businessContext: {} }

//     let businessData: BusinessData | null = null
//     if (
//       businessResult.status === "fulfilled" &&
//       businessResult.value.status === 200 &&
//       businessResult.value.data.business
//     ) {
//       businessData = businessResult.value.data.business
//     } else {
//       Logger.warning("Business data fetch failed, using profile data only")
//     }

//     // Fetch workflow configuration and credentials if workflowConfigId is provided
//     let workflowConfigWithCredentials: any = null
//     let crmIntegration: any = null

    
//     // Build robust fallback variables
//     const result: Record<string, string> = {
//       // Core business information with multiple fallbacks
//       business_profile: profileContent || "Professional business assistant",
//       business_name: businessContext.businessName || businessData?.businessName || "Our Business",
//       welcome_message:"Hello! How can I help you today?",
//       business_industry: businessContext.businessType || businessData?.industry || "Customer Service",
//       business_type: businessData?.businessType || "Service Business",
//       business_description:
//         businessContext.businessDescription ||
//         businessData?.businessDescription ||
//         "We provide excellent customer service",
//       instagram_handle: businessData?.instagramHandle || "",
//       response_language: businessData?.responseLanguage || "English", // Use businessData directly
//       business_hours: businessData?.businessHours || "24/7",
//       auto_reply_enabled: businessData?.autoReplyEnabled ? "Yes" : "Yes", // Default to Yes
//       promotion_message: "Thank you for contacting us!",
//       target_audience:"Valued customers",
//       website: businessData?.website || "",

//       // Customer data placeholders
//       customer_name: "",
//       customer_email: "",
//       customer_phone: "",

//       // System status
//       system_status: "operational",
//       fallback_mode: businessData ? "false" : "true",
//       workflow_config_id: workflowConfigId || "", // Pass the workflow config ID to Voiceflow
//     }

//     // Add conversation context
//     if (conversationContext) {
//       result.customer_type = conversationContext.customerType
//       result.is_new_user = conversationContext.isNewUser.toString()
//       result.current_message = conversationContext.userMessage
//       result.conversation_history = conversationContext.messageHistory
//         .slice(-3) // Reduce to last 3 messages to avoid overwhelming Voiceflow
//         .map((msg) => `${msg.role}: ${msg.content}`)
//         .join(" | ")
//       result.conversation_length = conversationContext.messageHistory.length.toString()

//       // Conversation insights
//       const hasQuestions = conversationContext.userMessage.includes("?")
//       const hasUrgentWords = /urgent|asap|immediately|emergency|help/i.test(conversationContext.userMessage)
//       const hasPurchaseIntent = /buy|purchase|order|price|cost|payment/i.test(conversationContext.userMessage)

//       result.has_questions = hasQuestions.toString()
//       result.is_urgent = hasUrgentWords.toString()
//       result.has_purchase_intent = hasPurchaseIntent.toString()

//       // Add greeting detection
//       const isGreeting = /^(hi|hello|hey|good morning|good afternoon|good evening)$/i.test(
//         conversationContext.userMessage.trim(),
//       )
//       result.is_greeting = isGreeting.toString()
//     }

//     // Parse JSON fields safely only if businessData exists
//     if (businessData) {
//       const jsonFields = [
//         { field: businessData.automationGoals, keys: ["primary_goal", "response_time", "custom_goals"] },
//         { field: businessData.customerJourney, keys: ["journey_steps"] },
//         { field: businessData.features, keys: ["enabled_features"] },
//       ]

//       jsonFields.forEach(({ field, keys }) => {
//         if (field) {
//           try {
//             const parsed = typeof field === "string" ? JSON.parse(field) : (field as Record<string, any>)
//             keys.forEach((key) => {
//               if (key === "journey_steps") {
//                 result[key] = JSON.stringify(parsed.journeySteps || [])
//               } else if (key === "enabled_features") {
//                 result[key] =
//                   parsed.features
//                     ?.filter((f: any) => f.enabled)
//                     .map((f: any) => f.name)
//                     .join(", ") || ""
//               } else {
//                 result[key] = parsed[key.replace("_", "")] || ""
//               }
//             })
//           } catch (error) {
//             Logger.error(`Error parsing ${keys[0]}:`, error)
//             // Set safe defaults
//             keys.forEach((key) => {
//               result[key] = ""
//             })
//           }
//         }
//       })

//       // Add remaining fields
//       if (businessData.businessTypeData) {
//         result.business_type_data = JSON.stringify(businessData.businessTypeData)
//       }
//       if (businessData.websiteAnalysis) {
//         result.website_analysis = JSON.stringify(businessData.websiteAnalysis)
//       }

//       result.automation_setup_complete = businessData.automationSetupComplete ? "Yes" : "No"
//       result.automation_setup_date = businessData.automationSetupDate?.toISOString() || ""
//       result.automation_additional_notes = businessData.automationAdditionalNotes || ""
//     } else {
//       // Set safe defaults when no business data
//       result.primary_goal = "Provide excellent customer service"
//       result.response_time = "immediate"
//       result.custom_goals = "Help customers effectively"
//       result.journey_steps = "[]"
//       result.enabled_features = "chat, support"
//       result.automation_setup_complete = "Yes"
//       result.automation_setup_date = new Date().toISOString()
//       result.automation_additional_notes = "Using fallback configuration"
//     }

//     // Add CRM integration credentials to variables
//     if (crmIntegration) {
//       try {
//         const decryptedCredentials = decrypt(crmIntegration.apiKey)
//         const parsedConfig = JSON.parse(decryptedCredentials)

//         // Map credentials to Voiceflow variables using a consistent naming convention
//         // Example: integrationName_credentialField
//         // Ensure these variable names are defined in your Voiceflow projects
//         for (const key in parsedConfig) {
//           if (Object.prototype.hasOwnProperty.call(parsedConfig, key)) {
//             const vfVarName = `${crmIntegration.provider.toLowerCase().replace(/\s/g, "_")}_${key}`
//             result[vfVarName] = parsedConfig[key]
//           }
//         }

//         Logger.debug(`Decrypted and added variables for ${crmIntegration.provider}`)
//       } catch (e) {
//         Logger.error(`Failed to decrypt or parse credentials for ${crmIntegration.provider}:`, e)
//       }
//     } else {
//       Logger.warning(`No CRM integration found for workflow config ID ${workflowConfigId}. Using default variables.`)
//     }

//     // Add decrypted integration credentials to variables
//     if (workflowConfigWithCredentials && workflowConfigWithCredentials.credentials) {
//       workflowConfigWithCredentials.credentials.forEach((cred: any) => {
//         try {
//           const decryptedCredential = decrypt(cred.apiKey)
//           const parsedCredential = JSON.parse(decryptedCredential)
//           for (const key in parsedCredential) {
//             if (Object.prototype.hasOwnProperty.call(parsedCredential, key)) {
//               const vfVarName = `${cred.integrationName.toLowerCase().replace(/\s/g, "_")}_${key}`
//               result[vfVarName] = parsedCredential[key]
//             }
//           }
//           Logger.debug(`Decrypted and added variables for ${cred.integrationName}`)
//         } catch (e) {
//           Logger.error(`Failed to decrypt or parse credentials for ${cred.integrationName}:`, e)
//         }
//       })
//     }

//     result.system_timestamp = new Date().toISOString()
//     result.voiceflow_health_score = circuitBreaker.getHealthScore().toFixed(2)

//     Logger.success(`✅ Enhanced business variables prepared (fallback mode: ${result.fallback_mode})`)
//     return result
//   } catch (error) {
//     Logger.error("❌ Error in fetchEnhancedBusinessVariables:", error)

//     // Return minimal safe variables
//     return {
//       business_name: "Customer Service",
//       welcome_message: "Hello! How can I help you today?",
//       business_industry: "Customer Service",
//       response_language: "English",
//       customer_type: conversationContext?.customerType || "NEW",
//       is_new_user: conversationContext?.isNewUser?.toString() || "true",
//       current_message: conversationContext?.userMessage || "",
//       system_status: "fallback",
//       fallback_mode: "true",
//       system_timestamp: new Date().toISOString(),
//       voiceflow_health_score: "0.5",
//       workflow_config_id: workflowConfigId || "",
//     }
//   }
// }

// Updated BusinessData interface to match your new Business model

export async function fetchEnhancedBusinessVariables(
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
      profileResult.status === "fulfilled" ? profileResult.value : { 
        profileContent: "", 
        businessContext: {
          businessName: "Our Business",
          businessType: "Service",
          website: "",
          responseLanguage: "English",
          businessDescription: "",
          name: "",
        }
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

    // Fetch workflow configuration and credentials if workflowConfigId is provided
    // let workflowConfigWithCredentials: any = null
    // let crmIntegration: any = null

    // if (workflowConfigId) {
    //   try {
    //     workflowConfigWithCredentials = await client.businessWorkflowConfig.findUnique({
    //       where: { id: workflowConfigId },
    //       include: { credentials: true },
    //     })

    //     if (!workflowConfigWithCredentials) {
    //       Logger.warning(`Workflow config with ID ${workflowConfigId} not found.`)
    //     } else {
    //       // Fetch CRM integration separately if crmIntegrationId exists
    //       if (workflowConfigWithCredentials.crmIntegrationId) {
    //         try {
    //           crmIntegration = await client.crmIntegration.findUnique({
    //             where: { id: workflowConfigWithCredentials.crmIntegrationId },
    //           })
    //           if (!crmIntegration) {
    //             Logger.warning(`CRM integration with ID ${workflowConfigWithCredentials.crmIntegrationId} not found.`)
    //           }
    //         } catch (crmError) {
    //           Logger.error(
    //             `Error fetching CRM integration for ${workflowConfigWithCredentials.crmIntegrationId}:`,
    //             crmError,
    //           )
    //         }
    //       }
    //     }
    //   } catch (dbError) {
    //     Logger.error(`Error fetching workflow config with credentials for ${workflowConfigId}:`, dbError)
    //   }
    // } else {
    //   Logger.warning("No workflowConfigId provided to fetch integration credentials.")
    // }
    
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

    // Add CRM integration credentials to variables
    // if (crmIntegration) {
    //   try {
    //     const decryptedCredentials = decrypt(crmIntegration.apiKey)
    //     const parsedConfig = JSON.parse(decryptedCredentials)

    //     // Map credentials to Voiceflow variables using a consistent naming convention
    //     for (const key in parsedConfig) {
    //       if (Object.prototype.hasOwnProperty.call(parsedConfig, key)) {
    //         const vfVarName = `${crmIntegration.provider.toLowerCase().replace(/\s/g, "_")}_${key}`
    //         result[vfVarName] = parsedConfig[key]
    //       }
    //     }

    //     Logger.debug(`Decrypted and added variables for ${crmIntegration.provider}`)
    //   } catch (e) {
    //     Logger.error(`Failed to decrypt or parse credentials for ${crmIntegration.provider}:`, e)
    //   }
    // } else {
    //   Logger.warning(`No CRM integration found for workflow config ID ${workflowConfigId}. Using default variables.`)
    // }

    // Add decrypted integration credentials to variables
    // if (workflowConfigWithCredentials && workflowConfigWithCredentials.credentials) {
    //   workflowConfigWithCredentials.credentials.forEach((cred: any) => {
    //     try {
    //       const decryptedCredential = decrypt(cred.apiKey)
    //       const parsedCredential = JSON.parse(decryptedCredential)
    //       for (const key in parsedCredential) {
    //         if (Object.prototype.hasOwnProperty.call(parsedCredential, key)) {
    //           const vfVarName = `${cred.integrationName.toLowerCase().replace(/\s/g, "_")}_${key}`
    //           result[vfVarName] = parsedCredential[key]
    //         }
    //       }
    //       Logger.debug(`Decrypted and added variables for ${cred.integrationName}`)
    //     } catch (e) {
    //       Logger.error(`Failed to decrypt or parse credentials for ${cred.integrationName}:`, e)
    //     }
    //   })
    // }

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
// VOICEFLOW RESPONSE PROCESSOR
// ============================================================================

export function processEnhancedVoiceflowResponse(traces: VoiceflowTrace[]): {
  text: string
  quickReplies?: { title: string; payload: string }[]
  requiresHumanHandoff?: boolean
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  sentiment?: "positive" | "neutral" | "negative"
  complexity?: "simple" | "medium" | "complex"
} {
  let result = ""
  const quickReplies: { title: string; payload: string }[] = []
  let requiresHumanHandoff = false
  let priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT" = "MEDIUM"
  let sentiment: "positive" | "neutral" | "negative" = "neutral"
  let complexity: "simple" | "medium" | "complex" = "medium"

  for (const trace of traces) {
    switch (trace.type) {
      case "speak":
      case "text":
        if ("message" in trace.payload) {
          const message = trace.payload.message
          result += message + "\n"

          // Analyze complexity
          if (message.length > 200 || message.split(".").length > 3) {
            complexity = "complex"
          } else if (message.length < 50) {
            complexity = "simple"
          }
        }
        break

      case "choice":
        if ("buttons" in trace.payload && Array.isArray(trace.payload.buttons)) {
          trace.payload.buttons.forEach((button: VoiceflowButton) => {
            // Ensure we always have a valid title
            let title = button.name || "Option"

            // Trim to Instagram limits and ensure it's not empty
            title = title.trim()
            if (title.length === 0) {
              title = "Select"
            }

            if (title.length > CONFIG.INSTAGRAM.QUICK_REPLY_TITLE_LIMIT) {
              title = title.substring(0, CONFIG.INSTAGRAM.QUICK_REPLY_TITLE_LIMIT - 3) + "..."
            }

            quickReplies.push({
              title,
              payload: button.request?.payload || button.name || title,
            })
          })
        }
        break

      case "visual":
        if ("image" in trace.payload) {
          result += `📷 Image: ${trace.payload.image}\n`
        }
        break

      case "card":
        if (trace.payload) {
          if ("title" in trace.payload) {
            result += `*${trace.payload.title}*\n`
          }
          if ("description" in trace.payload) {
            result += `${trace.payload.description}\n`
          }
        }
        break

      case "end":
        result += "\nHello, what brings you today, how can I help you?"
        break

      case "handoff":
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

      case "path":
        // Handle the path trace type
        if ("path" in trace.payload) {
          Logger.debug(`Path trace detected: ${trace.payload.path}`)
          // Don't add any text for path traces - they're just flow control
        }
        break

      case "debug":
        Logger.debug("Voiceflow debug:", trace.payload)
        break

      case "knowledgeBase":
        // COMPLETELY IGNORE KNOWLEDGE BASE TRACES
        Logger.debug("Ignoring knowledgeBase trace - workflow responses only")
        break

      default:
        Logger.warning(`Unhandled trace type: ${trace.type}`, trace)
        break
    }
  }

  // If we only got knowledge base traces and no actual workflow content, return empty
  if (!result.trim()) {
    Logger.warning("No workflow content found - only knowledge base traces detected")
    return {
      text: "",
      quickReplies: undefined,
      requiresHumanHandoff: false,
      priority: "LOW",
      sentiment: "neutral",
      complexity: "simple",
    }
  }

  // Auto-detect sentiment
  if (sentiment === "neutral") {
    const text = result.toLowerCase()
    if (text.includes("sorry") || text.includes("apologize") || text.includes("unfortunately")) {
      sentiment = "negative"
    } else if (
      text.includes("great") ||
      text.includes("excellent") ||
      text.includes("wonderful") ||
      text.includes("thank")
    ) {
      sentiment = "positive"
    }
  }

  // Trim to Instagram limits
  let finalText = result.trim()
  if (finalText.length > CONFIG.INSTAGRAM.MESSAGE_LIMIT) {
    finalText = finalText.substring(0, CONFIG.INSTAGRAM.MESSAGE_LIMIT - 3) + "..."
  }

  const limitedQuickReplies = quickReplies.slice(0, CONFIG.INSTAGRAM.QUICK_REPLY_LIMIT)

  return {
    text: finalText,
    quickReplies: limitedQuickReplies.length > 0 ? limitedQuickReplies : undefined,
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
    "sorry, i didn't get that",
    "can you repeat that",
    "i'm not sure what you mean",
    "error",
    "something went wrong",
    "please try again",
    "system error",
    "unable to process",
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
    enableFallbackDetection = true,
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
