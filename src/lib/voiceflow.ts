// import axios, { type AxiosError } from "axios"
// import { getBusinessForWebhook } from "@/actions/businfo"
// import type { VoiceflowVariables, VoiceflowResult } from "@/types/voiceflow"
// import type { JsonValue } from "@prisma/client/runtime/library"


// import { client } from "@/lib/prisma"


// const API_KEY = process.env.VOICEFLOW_API_KEY
// const PROJECT_ID = process.env.VOICEFLOW_PROJECT_ID
// const VERSION_ID = process.env.VOICEFLOW_VERSION_ID

// interface VoiceflowResponse {
//   type: string
//   payload: any
// }


// interface VoiceflowButton {
//   name: string;
//   request?: {
//     payload?: string;
//     type?: string;
//   };
// }

// interface VoiceflowChoicePayload {
//   buttons?: VoiceflowButton[];
// }

// interface VoiceflowTextPayload {
//   message: string;
// }

// interface VoiceflowTrace {
//   type: string;
//   payload: VoiceflowChoicePayload | VoiceflowTextPayload | any;
// }



// interface BusinessData {
//   id: string
//   name: string | null
//   businessName: string
//   businessType: string
//   businessDescription: string
//   industry: string
//   automationSetupComplete: boolean
//   automationSetupDate: Date | null
//   automationAdditionalNotes: string | null
//   automationGoals: JsonValue | null
//   customerJourney: JsonValue | null
//   features: JsonValue | null
//   businessTypeData: JsonValue | null
//   websiteAnalysis: JsonValue | null
//   targetAudience: string
//   website: string
//   instagramHandle: string
//   welcomeMessage: string
//   responseLanguage: string
//   businessHours: string
//   autoReplyEnabled: boolean
//   promotionMessage: string
//   createdAt: Date
//   updatedAt: Date
//   userId: string | null
// }

// export async function fetchBusinessVariables(businessId: string): Promise<Record<string, string>> {
//   console.log("Entering fetchBusinessVariables function")
//   try {
//     const businessResponse = await getBusinessForWebhook(businessId)
//     console.log("getBusinessForWebhook response:", JSON.stringify(businessResponse, null, 2))

//     if (businessResponse.status !== 200 || !businessResponse.data.business) {
//       throw new Error(`Failed to fetch business data. Status: ${businessResponse.status}`)
//     }

//     const businessData: BusinessData = businessResponse.data.business

//     if (!businessData.businessName && !businessData.welcomeMessage && !businessData.industry) {
//       throw new Error("All business data fields are empty")
//     }

//     const result: Record<string, string> = {
//       business_name: businessData.businessName || "Default Business Name",
//       welcome_message: businessData.welcomeMessage || "Welcome to our business!",
//       business_industry: businessData.industry || "General",
//       business_type: businessData.businessType || "General",
//       business_description: businessData.businessDescription || "No description provided",
//       instagram_handle: businessData.instagramHandle || "",
//       response_language: businessData.responseLanguage || "English",
//       business_hours: businessData.businessHours || "Not specified",
//       auto_reply_enabled: businessData.autoReplyEnabled ? "Yes" : "No",
//       promotion_message: businessData.promotionMessage || "No current promotions",
//     }

//     // Parse and add JSON fields
//     if (businessData.automationGoals) {
//       const automationGoals = businessData.automationGoals as Record<string, any>
//       result.primary_goal = automationGoals.primaryGoal || ""
//       result.response_time = automationGoals.responseTime?.toString() || ""
//       result.custom_goals = automationGoals.customGoals || ""
//     }

//     if (businessData.customerJourney) {
//       const customerJourney = businessData.customerJourney as Record<string, any>
//       result.journey_steps = JSON.stringify(customerJourney.journeySteps || [])
//     }

//     if (businessData.features) {
//       const features = businessData.features as Record<string, any>
//       result.enabled_features =
//         features.features
//           ?.filter((f: any) => f.enabled)
//           .map((f: any) => f.name)
//           .join(", ") || ""
//     }

//     if (businessData.businessTypeData) {
//       result.business_type_data = JSON.stringify(businessData.businessTypeData)
//     }

//     if (businessData.websiteAnalysis) {
//       result.website_analysis = JSON.stringify(businessData.websiteAnalysis)
//     }

//     result.automation_setup_complete = businessData.automationSetupComplete ? "Yes" : "No"
//     result.automation_setup_date = businessData.automationSetupDate?.toISOString() || ""
//     result.automation_additional_notes = businessData.automationAdditionalNotes || ""

//     return result
//   } catch (error) {
//     console.error("Error in fetchBusinessVariables:", error)
//     throw error
//   }
// }

// export async function getVoiceflowResponse(
//   userInput: string,
//   userId: string,
//   businessVariables: Record<string, string>,
// ): Promise<VoiceflowResult> {
//   try {
//     const response = await axios.post<VoiceflowResponse[]>(
//       `https://general-runtime.voiceflow.com/state/user/${userId}/interact`,
//       {
//         request: { type: "text", payload: userInput },
//         state: { variables: businessVariables },
//       },
//       {
//         headers: {
//           Authorization: API_KEY,
//           versionID: VERSION_ID,
//           accept: "application/json",
//           "content-type": "application/json",
//         },
//       },
//     )

//     const updatedVariables = await fetchVoiceflowVariables(userId)
//     return { response: response.data, variables: updatedVariables }
//   } catch (error) {
//     console.error("Error interacting with Voiceflow:", error)
//     throw error
//   }
// }

// async function fetchVoiceflowVariables(userId: string): Promise<VoiceflowVariables> {
//   try {
//     const response = await axios.get<{ variables: VoiceflowVariables }>(
//       `https://general-runtime.voiceflow.com/state/user/${userId}`,
//       {
//         headers: {
//           Authorization: API_KEY,
//           versionID: VERSION_ID,
//           accept: "application/json",
//         },
//       },
//     )
//     return response.data.variables || {}
//   } catch (error) {
//     console.error("Error fetching Voiceflow variables:", error)
//     throw error
//   }
// }



// export function processVoiceflowResponse(traces: VoiceflowTrace[]): { 
//   text: string; 
//   buttons?: { name: string; payload: string }[] 
// } {
//   let result = "";
//   const buttons: { name: string; payload: string }[] = [];

//   for (const trace of traces) {
//     switch (trace.type) {
//       case "text":
//         // Type guard for text payload
//         if ('message' in trace.payload) {
//           result += (trace.payload as VoiceflowTextPayload).message + "\n";
//         }
//         break;
        
//       case "choice":
//         // Type guard for choice payload
//         if ('buttons' in trace.payload && Array.isArray(trace.payload.buttons)) {
//           if (!result.includes("Select one:")) {
//             result += "\nSelect one:\n";
//           }
//           trace.payload.buttons.forEach((button: VoiceflowButton) => {
//             buttons.push({
//               name: button.name,
//               payload: button.request?.payload || button.name
//             });
//           });
//         }
//         break;
        
//       case "visual":
//         // Handle visual responses (images, cards, etc.)
//         if ('image' in trace.payload) {
//           result += `[Image: ${trace.payload.image}]\n`;
//         }
//         break;
        
//       case "speak":
//         // Handle voice responses
//         if ('message' in trace.payload) {
//           result += (trace.payload as VoiceflowTextPayload).message + "\n";
//         }
//         break;
        
//       case "end":
//         // Handle conversation end
//         result += "\n[Conversation ended]";
//         break;
        
//       case "flow":
//         // Handle flow direction changes
//         if ('direction' in trace.payload) {
//           result += `[Flow: ${trace.payload.direction}]\n`;
//         }
//         break;
        
//       case "debug":
//         // Handle debug information
//         console.log('Voiceflow debug:', trace.payload);
//         break;
        
//       default:
//         console.warn(`Unhandled trace type: ${trace.type}`, trace);
//         break;
//     }
//   }

//   return { 
//     text: result.trim(), 
//     buttons: buttons.length > 0 ? buttons : undefined 
//   };
// }



// export async function createVoiceflowUser(userId: string): Promise<boolean> {
//   try {
//     await axios.put(
//       "https://api.voiceflow.com/v2/transcripts",
//       {
//         projectID: PROJECT_ID,
//         versionID: VERSION_ID,
//         sessionID: userId,
//       },
//       {
//         headers: {
//           accept: "application/json",
//           "content-type": "application/json",
//           Authorization: API_KEY,
//         },
//       },
//     )
//     return true
//   } catch (error) {
//     console.error("Error creating Voiceflow user:", error)
//     return false
//   }
// }

// export async function resetVoiceflowUser(userId: string): Promise<boolean> {
//   try {
//     const response = await axios.post(
//       `https://general-runtime.voiceflow.com/state/user/${userId}/interact`,
//       { request: { type: "reset" } },
//       {
//         headers: {
//           Authorization: API_KEY,
//           versionID: VERSION_ID,
//           accept: "application/json",
//           "content-type": "application/json",
//         },
//       },
//     )
//     return response.status === 200
//   } catch (error) {
//     console.error("Error resetting Voiceflow user:", error)
//     return false
//   }
// }






// import axios from "axios"
// import { getBusinessForWebhook } from "@/actions/businfo"
// import type { VoiceflowVariables, VoiceflowResult } from "@/types/voiceflow"
// import type { JsonValue } from "@prisma/client/runtime/library"

// const API_KEY = process.env.VOICEFLOW_API_KEY
// const PROJECT_ID = process.env.VOICEFLOW_PROJECT_ID
// const VERSION_ID = process.env.VOICEFLOW_VERSION_ID

// interface VoiceflowResponse {
//   type: string
//   payload: any
// }

// interface VoiceflowButton {
//   name: string
//   request?: {
//     payload?: string
//     type?: string
//   }
// }

// interface VoiceflowChoicePayload {
//   buttons?: VoiceflowButton[]
// }

// interface VoiceflowTextPayload {
//   message: string
// }

// interface VoiceflowTrace {
//   type: string
//   payload: VoiceflowChoicePayload | VoiceflowTextPayload | any
// }

// interface BusinessData {
//   id: string
//   name: string | null
//   businessName: string
//   businessType: string
//   businessDescription: string
//   industry: string
//   automationSetupComplete: boolean
//   automationSetupDate: Date | null
//   automationAdditionalNotes: string | null
//   automationGoals: JsonValue | null
//   customerJourney: JsonValue | null
//   features: JsonValue | null
//   businessTypeData: JsonValue | null
//   websiteAnalysis: JsonValue | null
//   targetAudience: string
//   website: string
//   instagramHandle: string
//   welcomeMessage: string
//   responseLanguage: string
//   businessHours: string
//   autoReplyEnabled: boolean
//   promotionMessage: string
//   createdAt: Date
//   updatedAt: Date
//   userId: string | null
// }

// // Cache for Voiceflow user creation to prevent duplicates
// const userCreationCache = new Map<string, Promise<boolean>>()

// export async function fetchBusinessVariables(businessId: string): Promise<Record<string, string>> {
//   console.log("Entering fetchBusinessVariables function")
//   try {
//     const businessResponse = await getBusinessForWebhook(businessId)
//     console.log("getBusinessForWebhook response:", JSON.stringify(businessResponse, null, 2))

//     if (businessResponse.status !== 200 || !businessResponse.data.business) {
//       throw new Error(`Failed to fetch business data. Status: ${businessResponse.status}`)
//     }

//     const businessData: BusinessData = businessResponse.data.business

//     if (!businessData.businessName && !businessData.welcomeMessage && !businessData.industry) {
//       throw new Error("All business data fields are empty")
//     }

//     const result: Record<string, string> = {
//       business_name: businessData.businessName || "Default Business Name",
//       welcome_message: businessData.welcomeMessage || "Welcome to our business!",
//       business_industry: businessData.industry || "General",
//       business_type: businessData.businessType || "General",
//       business_description: businessData.businessDescription || "No description provided",
//       instagram_handle: businessData.instagramHandle || "",
//       response_language: businessData.responseLanguage || "English",
//       business_hours: businessData.businessHours || "Not specified",
//       auto_reply_enabled: businessData.autoReplyEnabled ? "Yes" : "No",
//       promotion_message: businessData.promotionMessage || "No current promotions",
//     }

//     // Parse and add JSON fields safely
//     if (businessData.automationGoals) {
//       try {
//         const automationGoals =
//           typeof businessData.automationGoals === "string"
//             ? JSON.parse(businessData.automationGoals)
//             : (businessData.automationGoals as Record<string, any>)
//         result.primary_goal = automationGoals.primaryGoal || ""
//         result.response_time = automationGoals.responseTime?.toString() || ""
//         result.custom_goals = automationGoals.customGoals || ""
//       } catch (e) {
//         console.error("Error parsing automationGoals:", e)
//       }
//     }

//     if (businessData.customerJourney) {
//       try {
//         const customerJourney =
//           typeof businessData.customerJourney === "string"
//             ? JSON.parse(businessData.customerJourney)
//             : (businessData.customerJourney as Record<string, any>)
//         result.journey_steps = JSON.stringify(customerJourney.journeySteps || [])
//       } catch (e) {
//         console.error("Error parsing customerJourney:", e)
//       }
//     }

//     if (businessData.features) {
//       try {
//         const features =
//           typeof businessData.features === "string"
//             ? JSON.parse(businessData.features)
//             : (businessData.features as Record<string, any>)
//         result.enabled_features =
//           features.features
//             ?.filter((f: any) => f.enabled)
//             .map((f: any) => f.name)
//             .join(", ") || ""
//       } catch (e) {
//         console.error("Error parsing features:", e)
//       }
//     }

//     if (businessData.businessTypeData) {
//       result.business_type_data = JSON.stringify(businessData.businessTypeData)
//     }

//     if (businessData.websiteAnalysis) {
//       result.website_analysis = JSON.stringify(businessData.websiteAnalysis)
//     }

//     result.automation_setup_complete = businessData.automationSetupComplete ? "Yes" : "No"
//     result.automation_setup_date = businessData.automationSetupDate?.toISOString() || ""
//     result.automation_additional_notes = businessData.automationAdditionalNotes || ""

//     return result
//   } catch (error) {
//     console.error("Error in fetchBusinessVariables:", error)
//     throw error
//   }
// }

// export async function getVoiceflowResponse(
//   userInput: string,
//   userId: string,
//   businessVariables: Record<string, string>,
// ): Promise<VoiceflowResult> {
//   const maxRetries = 3
//   let lastError: Error | null = null

//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       console.log(`Voiceflow API attempt ${attempt} for user ${userId}`)

//       const response = await axios.post<VoiceflowResponse[]>(
//         `https://general-runtime.voiceflow.com/state/user/${userId}/interact`,
//         {
//           request: { type: "text", payload: userInput },
//           state: { variables: businessVariables },
//         },
//         {
//           headers: {
//             Authorization: API_KEY,
//             versionID: VERSION_ID,
//             accept: "application/json",
//             "content-type": "application/json",
//           },
//           timeout: 10000, // 10 second timeout
//         },
//       )

//       const updatedVariables = await fetchVoiceflowVariables(userId)
//       console.log(`Voiceflow API success on attempt ${attempt}`)
//       return { response: response.data, variables: updatedVariables }
//     } catch (error) {
//       lastError = error as Error
//       console.error(`Voiceflow API attempt ${attempt} failed:`, error)

//       if (attempt < maxRetries) {
//         // Wait before retrying (exponential backoff)
//         const delay = Math.pow(2, attempt) * 1000
//         console.log(`Retrying in ${delay}ms...`)
//         await new Promise((resolve) => setTimeout(resolve, delay))
//       }
//     }
//   }

//   console.error("All Voiceflow API attempts failed")
//   throw lastError || new Error("Failed to get Voiceflow response after all retries")
// }

// async function fetchVoiceflowVariables(userId: string): Promise<VoiceflowVariables> {
//   try {
//     const response = await axios.get<{ variables: VoiceflowVariables }>(
//       `https://general-runtime.voiceflow.com/state/user/${userId}`,
//       {
//         headers: {
//           Authorization: API_KEY,
//           versionID: VERSION_ID,
//           accept: "application/json",
//         },
//         timeout: 5000, // 5 second timeout
//       },
//     )
//     return response.data.variables || {}
//   } catch (error) {
//     console.error("Error fetching Voiceflow variables:", error)
//     return {}
//   }
// }

// export function processVoiceflowResponse(traces: VoiceflowTrace[]): {
//   text: string
//   buttons?: { name: string; payload: string }[]
// } {
//   let result = ""
//   const buttons: { name: string; payload: string }[] = []

//   for (const trace of traces) {
//     switch (trace.type) {
//       case "text":
//         // Type guard for text payload
//         if ("message" in trace.payload) {
//           result += (trace.payload as VoiceflowTextPayload).message + "\n"
//         }
//         break

//       case "choice":
//         // Type guard for choice payload
//         if ("buttons" in trace.payload && Array.isArray(trace.payload.buttons)) {
//           if (!result.includes("Select one:")) {
//             result += "\nSelect one:\n"
//           }
//           trace.payload.buttons.forEach((button: VoiceflowButton) => {
//             buttons.push({
//               name: button.name,
//               payload: button.request?.payload || button.name,
//             })
//           })
//         }
//         break

//       case "visual":
//         // Handle visual responses (images, cards, etc.)
//         if ("image" in trace.payload) {
//           result += `[Image: ${trace.payload.image}]\n`
//         }
//         break

//       case "speak":
//         // Handle voice responses
//         if ("message" in trace.payload) {
//           result += (trace.payload as VoiceflowTextPayload).message + "\n"
//         }
//         break

//       case "end":
//         // Handle conversation end
//         result += "\n[Conversation ended]"
//         break

//       case "flow":
//         // Handle flow direction changes
//         if ("direction" in trace.payload) {
//           result += `[Flow: ${trace.payload.direction}]\n`
//         }
//         break

//       case "debug":
//         // Handle debug information
//         console.log("Voiceflow debug:", trace.payload)
//         break

//       default:
//         console.warn(`Unhandled trace type: ${trace.type}`, trace)
//         break
//     }
//   }

//   return {
//     text: result.trim(),
//     buttons: buttons.length > 0 ? buttons : undefined,
//   }
// }

// export async function createVoiceflowUser(userId: string): Promise<boolean> {
//   // Check if we're already creating this user
//   if (userCreationCache.has(userId)) {
//     console.log(`User creation already in progress for ${userId}`)
//     return await userCreationCache.get(userId)!
//   }

//   // Create a promise for this user creation
//   const creationPromise = createVoiceflowUserInternal(userId)
//   userCreationCache.set(userId, creationPromise)

//   try {
//     const result = await creationPromise
//     return result
//   } finally {
//     // Clean up cache after completion
//     setTimeout(() => {
//       userCreationCache.delete(userId)
//     }, 5000) // Remove from cache after 5 seconds
//   }
// }

// async function createVoiceflowUserInternal(userId: string): Promise<boolean> {
//   try {
//     const response = await axios.put(
//       "https://api.voiceflow.com/v2/transcripts",
//       {
//         projectID: PROJECT_ID,
//         versionID: VERSION_ID,
//         sessionID: userId,
//       },
//       {
//         headers: {
//           accept: "application/json",
//           "content-type": "application/json",
//           Authorization: API_KEY,
//         },
//         timeout: 10000, // 10 second timeout
//       },
//     )
//     console.log(`Voiceflow user created successfully: ${userId}`)
//     return response.status === 200 || response.status === 201
//   } catch (error) {
//     console.error("Error creating Voiceflow user:", error)
//     return false
//   }
// }

// export async function resetVoiceflowUser(userId: string): Promise<boolean> {
//   try {
//     const response = await axios.post(
//       `https://general-runtime.voiceflow.com/state/user/${userId}/interact`,
//       { request: { type: "reset" } },
//       {
//         headers: {
//           Authorization: API_KEY,
//           versionID: VERSION_ID,
//           accept: "application/json",
//           "content-type": "application/json",
//         },
//         timeout: 10000, // 10 second timeout
//       },
//     )
//     console.log(`Voiceflow user reset successfully: ${userId}`)
//     return response.status === 200
//   } catch (error) {
//     console.error("Error resetting Voiceflow user:", error)
//     return false
//   }
// }


import axios from "axios"
import { getBusinessForWebhook } from "@/actions/businfo"
import type { VoiceflowVariables, VoiceflowResult } from "@/types/voiceflow"
import type { JsonValue } from "@prisma/client/runtime/library"

const API_KEY = process.env.VOICEFLOW_API_KEY
const PROJECT_ID = process.env.VOICEFLOW_PROJECT_ID
const VERSION_ID = process.env.VOICEFLOW_VERSION_ID

interface VoiceflowResponse {
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

interface VoiceflowChoicePayload {
  buttons?: VoiceflowButton[]
}

interface VoiceflowTextPayload {
  message: string
}

interface VoiceflowTrace {
  type: string
  payload: VoiceflowChoicePayload | VoiceflowTextPayload | any
}

interface BusinessData {
  id: string
  name: string | null
  businessName: string
  businessType: string
  businessDescription: string
  industry: string
  automationSetupComplete: boolean
  automationSetupDate: Date | null
  automationAdditionalNotes: string | null
  automationGoals: JsonValue | null
  customerJourney: JsonValue | null
  features: JsonValue | null
  businessTypeData: JsonValue | null
  websiteAnalysis: JsonValue | null
  targetAudience: string
  website: string
  instagramHandle: string
  welcomeMessage: string
  responseLanguage: string
  businessHours: string
  autoReplyEnabled: boolean
  promotionMessage: string
  createdAt: Date
  updatedAt: Date
  userId: string | null
}

// Enhanced typing speed calculation
export function calculateTypingDelay(
  messageLength: number,
  options?: {
    baseWPM?: number
    variabilityFactor?: number
    minDelay?: number
    maxDelay?: number
    includeThinkingTime?: boolean
  },
): number {
  const {
    baseWPM = 45, // Average human typing speed
    variabilityFactor = 0.3, // 30% variability
    minDelay = 1000, // 1 second minimum
    maxDelay = 4000, // 12 seconds maximum
    includeThinkingTime = true,
  } = options || {}

  // Calculate base typing time (characters per minute to milliseconds)
  const charactersPerMinute = baseWPM * 5 // Average 5 characters per word
  const baseTypingTime = (messageLength / charactersPerMinute) * 60 * 1000

  // Add thinking/processing time for longer messages
  const thinkingTime = includeThinkingTime ? Math.min(messageLength * 10, 3000) : 0

  // Add natural variability
  const variability = 1 + (Math.random() - 0.5) * variabilityFactor
  const totalTime = (baseTypingTime + thinkingTime) * variability

  // Apply min/max constraints
  return Math.min(Math.max(totalTime, minDelay), maxDelay)
}

// Enhanced retry mechanism with circuit breaker pattern
class CircuitBreaker {
  private failures = 0
  private lastFailureTime = 0
  private state: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED"

  constructor(
    private maxFailures = 5,
    private resetTimeout = 60000, // 1 minute
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === "OPEN") {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = "HALF_OPEN"
      } else {
        throw new Error("Circuit breaker is OPEN")
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

  private onSuccess() {
    this.failures = 0
    this.state = "CLOSED"
  }

  private onFailure() {
    this.failures++
    this.lastFailureTime = Date.now()

    if (this.failures >= this.maxFailures) {
      this.state = "OPEN"
    }
  }
}

const voiceflowCircuitBreaker = new CircuitBreaker()

// Cache for Voiceflow user creation to prevent duplicates
const userCreationCache = new Map<string, Promise<boolean>>()

export async function fetchBusinessVariables(businessId: string): Promise<Record<string, string>> {
  console.log("Entering fetchBusinessVariables function")
  try {
    const businessResponse = await getBusinessForWebhook(businessId)
    console.log("getBusinessForWebhook response:", JSON.stringify(businessResponse, null, 2))

    if (businessResponse.status !== 200 || !businessResponse.data.business) {
      throw new Error(`Failed to fetch business data. Status: ${businessResponse.status}`)
    }

    const businessData: BusinessData = businessResponse.data.business

    if (!businessData.businessName && !businessData.welcomeMessage && !businessData.industry) {
      throw new Error("All business data fields are empty")
    }

    const result: Record<string, string> = {
      business_name: businessData.businessName || "Default Business Name",
      welcome_message: businessData.welcomeMessage || "Welcome to our business!",
      business_industry: businessData.industry || "General",
      business_type: businessData.businessType || "General",
      business_description: businessData.businessDescription || "No description provided",
      instagram_handle: businessData.instagramHandle || "",
      response_language: businessData.responseLanguage || "English",
      business_hours: businessData.businessHours || "Not specified",
      auto_reply_enabled: businessData.autoReplyEnabled ? "Yes" : "No",
      promotion_message: businessData.promotionMessage || "No current promotions",
    }

    // Parse and add JSON fields safely
    if (businessData.automationGoals) {
      try {
        const automationGoals =
          typeof businessData.automationGoals === "string"
            ? JSON.parse(businessData.automationGoals)
            : (businessData.automationGoals as Record<string, any>)
        result.primary_goal = automationGoals.primaryGoal || ""
        result.response_time = automationGoals.responseTime?.toString() || ""
        result.custom_goals = automationGoals.customGoals || ""
      } catch (e) {
        console.error("Error parsing automationGoals:", e)
      }
    }

    if (businessData.customerJourney) {
      try {
        const customerJourney =
          typeof businessData.customerJourney === "string"
            ? JSON.parse(businessData.customerJourney)
            : (businessData.customerJourney as Record<string, any>)
        result.journey_steps = JSON.stringify(customerJourney.journeySteps || [])
      } catch (e) {
        console.error("Error parsing customerJourney:", e)
      }
    }

    if (businessData.features) {
      try {
        const features =
          typeof businessData.features === "string"
            ? JSON.parse(businessData.features)
            : (businessData.features as Record<string, any>)
        result.enabled_features =
          features.features
            ?.filter((f: any) => f.enabled)
            .map((f: any) => f.name)
            .join(", ") || ""
      } catch (e) {
        console.error("Error parsing features:", e)
      }
    }

    if (businessData.businessTypeData) {
      result.business_type_data = JSON.stringify(businessData.businessTypeData)
    }

    if (businessData.websiteAnalysis) {
      result.website_analysis = JSON.stringify(businessData.websiteAnalysis)
    }

    result.automation_setup_complete = businessData.automationSetupComplete ? "Yes" : "No"
    result.automation_setup_date = businessData.automationSetupDate?.toISOString() || ""
    result.automation_additional_notes = businessData.automationAdditionalNotes || ""

    return result
  } catch (error) {
    console.error("Error in fetchBusinessVariables:", error)
    throw error
  }
}

export async function getVoiceflowResponse(
  userInput: string,
  userId: string,
  businessVariables: Record<string, string>,
): Promise<VoiceflowResult> {
  return voiceflowCircuitBreaker.execute(async () => {
    const maxRetries = 3
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Voiceflow API attempt ${attempt} for user ${userId}`)

        const response = await axios.post<VoiceflowResponse[]>(
          `https://general-runtime.voiceflow.com/state/user/${userId}/interact`,
          {
            request: { type: "text", payload: userInput },
            state: { variables: businessVariables },
          },
          {
            headers: {
              Authorization: API_KEY,
              versionID: VERSION_ID,
              accept: "application/json",
              "content-type": "application/json",
            },
            timeout: 15000,
          },
        )

        const updatedVariables = await fetchVoiceflowVariables(userId)
        console.log(`Voiceflow API success on attempt ${attempt}`)
        return { response: response.data, variables: updatedVariables }
      } catch (error) {
        lastError = error as Error
        console.error(`Voiceflow API attempt ${attempt} failed:`, error)

        if (attempt < maxRetries) {
          const baseDelay = Math.pow(2, attempt) * 1000
          const jitter = Math.random() * 1000
          const delay = baseDelay + jitter

          console.log(`Retrying Voiceflow API in ${Math.round(delay)}ms...`)
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }
    }

    console.error("All Voiceflow API attempts failed")
    throw lastError || new Error("Failed to get Voiceflow response after all retries")
  })
}

async function fetchVoiceflowVariables(userId: string): Promise<VoiceflowVariables> {
  const maxRetries = 2

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.get<{ variables: VoiceflowVariables }>(
        `https://general-runtime.voiceflow.com/state/user/${userId}`,
        {
          headers: {
            Authorization: API_KEY,
            versionID: VERSION_ID,
            accept: "application/json",
          },
          timeout: 8000,
        },
      )
      return response.data.variables || {}
    } catch (error) {
      console.error(`Error fetching Voiceflow variables (attempt ${attempt}):`, error)

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
    }
  }

  console.warn("Failed to fetch Voiceflow variables, returning empty object")
  return {}
}

export function processVoiceflowResponse(traces: VoiceflowTrace[]): {
  text: string
  buttons?: { name: string; payload: string }[]
  requiresHumanHandoff?: boolean
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  sentiment?: "positive" | "neutral" | "negative"
} {
  let result = ""
  const buttons: { name: string; payload: string }[] = []
  let requiresHumanHandoff = false
  let priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT" = "MEDIUM"
  let sentiment: "positive" | "neutral" | "negative" = "neutral"

  for (const trace of traces) {
    switch (trace.type) {
      case "text":
        if ("message" in trace.payload) {
          result += (trace.payload as VoiceflowTextPayload).message + "\n"
        }
        break

      case "choice":
        if ("buttons" in trace.payload && Array.isArray(trace.payload.buttons)) {
          if (!result.includes("Select one:")) {
            result += "\nSelect one:\n"
          }
          trace.payload.buttons.forEach((button: VoiceflowButton) => {
            buttons.push({
              name: button.name,
              payload: button.request?.payload || button.name,
            })
          })
        }
        break

      case "visual":
        if ("image" in trace.payload) {
          result += `[Image: ${trace.payload.image}]\n`
        }
        break

      case "speak":
        if ("message" in trace.payload) {
          result += (trace.payload as VoiceflowTextPayload).message + "\n"
        }
        break

      case "end":
        result += "\n[Conversation ended]"
        break

      case "flow":
        if ("direction" in trace.payload) {
          result += `[Flow: ${trace.payload.direction}]\n`
        }
        break

      case "handoff":
        // Custom trace type for human handoff
        requiresHumanHandoff = true
        if ("reason" in trace.payload) {
          result += `\n[Escalating to human agent: ${trace.payload.reason}]\n`
        }
        break

      case "priority":
        // Custom trace type for setting priority
        if ("level" in trace.payload) {
          priority = trace.payload.level
        }
        break

      case "sentiment":
        // Custom trace type for sentiment analysis
        if ("value" in trace.payload) {
          sentiment = trace.payload.value
        }
        break

      case "debug":
        console.log("Voiceflow debug:", trace.payload)
        break

      default:
        console.warn(`Unhandled trace type: ${trace.type}`, trace)
        break
    }
  }

  return {
    text: result.trim(),
    buttons: buttons.length > 0 ? buttons : undefined,
    requiresHumanHandoff,
    priority,
    sentiment,
  }
}

export async function createVoiceflowUser(userId: string): Promise<boolean> {
  if (userCreationCache.has(userId)) {
    console.log(`User creation already in progress for ${userId}`)
    return await userCreationCache.get(userId)!
  }

  const creationPromise = createVoiceflowUserInternal(userId)
  userCreationCache.set(userId, creationPromise)

  try {
    const result = await creationPromise
    return result
  } finally {
    setTimeout(() => {
      userCreationCache.delete(userId)
    }, 5000)
  }
}

async function createVoiceflowUserInternal(userId: string): Promise<boolean> {
  const maxRetries = 3

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.put(
        "https://api.voiceflow.com/v2/transcripts",
        {
          projectID: PROJECT_ID,
          versionID: VERSION_ID,
          sessionID: userId,
        },
        {
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            Authorization: API_KEY,
          },
          timeout: 12000,
        },
      )
      console.log(`Voiceflow user created successfully: ${userId}`)
      return response.status === 200 || response.status === 201
    } catch (error) {
      console.error(`Error creating Voiceflow user (attempt ${attempt}):`, error)

      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt - 1) * 1000
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  console.error(`Failed to create Voiceflow user after ${maxRetries} attempts`)
  return false
}

export async function resetVoiceflowUser(userId: string): Promise<boolean> {
  try {
    const response = await axios.post(
      `https://general-runtime.voiceflow.com/state/user/${userId}/interact`,
      { request: { type: "reset" } },
      {
        headers: {
          Authorization: API_KEY,
          versionID: VERSION_ID,
          accept: "application/json",
          "content-type": "application/json",
        },
        timeout: 10000,
      },
    )
    console.log(`Voiceflow user reset successfully: ${userId}`)
    return response.status === 200
  } catch (error) {
    console.error("Error resetting Voiceflow user:", error)
    return false
  }
}
