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

// // Enhanced typing speed calculation
// export function calculateTypingDelay(
//   messageLength: number,
//   options?: {
//     baseWPM?: number
//     variabilityFactor?: number
//     minDelay?: number
//     maxDelay?: number
//     includeThinkingTime?: boolean
//   },
// ): number {
//   const {
//     baseWPM = 45, // Average human typing speed
//     variabilityFactor = 0.3, // 30% variability
//     minDelay = 1000, // 1 second minimum
//     maxDelay = 4000, // 12 seconds maximum
//     includeThinkingTime = true,
//   } = options || {}

//   // Calculate base typing time (characters per minute to milliseconds)
//   const charactersPerMinute = baseWPM * 5 // Average 5 characters per word
//   const baseTypingTime = (messageLength / charactersPerMinute) * 60 * 1000

//   // Add thinking/processing time for longer messages
//   const thinkingTime = includeThinkingTime ? Math.min(messageLength * 10, 3000) : 0

//   // Add natural variability
//   const variability = 1 + (Math.random() - 0.5) * variabilityFactor
//   const totalTime = (baseTypingTime + thinkingTime) * variability

//   // Apply min/max constraints
//   return Math.min(Math.max(totalTime, minDelay), maxDelay)
// }

// // Enhanced retry mechanism with circuit breaker pattern
// class CircuitBreaker {
//   private failures = 0
//   private lastFailureTime = 0
//   private state: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED"

//   constructor(
//     private maxFailures = 5,
//     private resetTimeout = 60000, // 1 minute
//   ) {}

//   async execute<T>(operation: () => Promise<T>): Promise<T> {
//     if (this.state === "OPEN") {
//       if (Date.now() - this.lastFailureTime > this.resetTimeout) {
//         this.state = "HALF_OPEN"
//       } else {
//         throw new Error("Circuit breaker is OPEN")
//       }
//     }

//     try {
//       const result = await operation()
//       this.onSuccess()
//       return result
//     } catch (error) {
//       this.onFailure()
//       throw error
//     }
//   }

//   private onSuccess() {
//     this.failures = 0
//     this.state = "CLOSED"
//   }

//   private onFailure() {
//     this.failures++
//     this.lastFailureTime = Date.now()

//     if (this.failures >= this.maxFailures) {
//       this.state = "OPEN"
//     }
//   }
// }

// const voiceflowCircuitBreaker = new CircuitBreaker()

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
//   return voiceflowCircuitBreaker.execute(async () => {
//     const maxRetries = 3
//     let lastError: Error | null = null

//     for (let attempt = 1; attempt <= maxRetries; attempt++) {
//       try {
//         console.log(`Voiceflow API attempt ${attempt} for user ${userId}`)

//         const response = await axios.post<VoiceflowResponse[]>(
//           `https://general-runtime.voiceflow.com/state/user/${userId}/interact`,
//           {
//             request: { type: "text", payload: userInput },
//             state: { variables: businessVariables },
//           },
//           {
//             headers: {
//               Authorization: API_KEY,
//               versionID: VERSION_ID,
//               accept: "application/json",
//               "content-type": "application/json",
//             },
//             timeout: 15000,
//           },
//         )

//         const updatedVariables = await fetchVoiceflowVariables(userId)
//         console.log(`Voiceflow API success on attempt ${attempt}`)
//         return { response: response.data, variables: updatedVariables }
//       } catch (error) {
//         lastError = error as Error
//         console.error(`Voiceflow API attempt ${attempt} failed:`, error)

//         if (attempt < maxRetries) {
//           const baseDelay = Math.pow(2, attempt) * 1000
//           const jitter = Math.random() * 1000
//           const delay = baseDelay + jitter

//           console.log(`Retrying Voiceflow API in ${Math.round(delay)}ms...`)
//           await new Promise((resolve) => setTimeout(resolve, delay))
//         }
//       }
//     }

//     console.error("All Voiceflow API attempts failed")
//     throw lastError || new Error("Failed to get Voiceflow response after all retries")
//   })
// }

// async function fetchVoiceflowVariables(userId: string): Promise<VoiceflowVariables> {
//   const maxRetries = 2

//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       const response = await axios.get<{ variables: VoiceflowVariables }>(
//         `https://general-runtime.voiceflow.com/state/user/${userId}`,
//         {
//           headers: {
//             Authorization: API_KEY,
//             versionID: VERSION_ID,
//             accept: "application/json",
//           },
//           timeout: 8000,
//         },
//       )
//       return response.data.variables || {}
//     } catch (error) {
//       console.error(`Error fetching Voiceflow variables (attempt ${attempt}):`, error)

//       if (attempt < maxRetries) {
//         await new Promise((resolve) => setTimeout(resolve, 2000))
//       }
//     }
//   }

//   console.warn("Failed to fetch Voiceflow variables, returning empty object")
//   return {}
// }

// export function processVoiceflowResponse(traces: VoiceflowTrace[]): {
//   text: string
//   buttons?: { name: string; payload: string }[]
//   requiresHumanHandoff?: boolean
//   priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
//   sentiment?: "positive" | "neutral" | "negative"
// } {
//   let result = ""
//   const buttons: { name: string; payload: string }[] = []
//   let requiresHumanHandoff = false
//   let priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT" = "MEDIUM"
//   let sentiment: "positive" | "neutral" | "negative" = "neutral"

//   for (const trace of traces) {
//     switch (trace.type) {
//       case "text":
//         if ("message" in trace.payload) {
//           result += (trace.payload as VoiceflowTextPayload).message + "\n"
//         }
//         break

//       case "choice":
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
//         if ("image" in trace.payload) {
//           result += `[Image: ${trace.payload.image}]\n`
//         }
//         break

//       case "speak":
//         if ("message" in trace.payload) {
//           result += (trace.payload as VoiceflowTextPayload).message + "\n"
//         }
//         break

//       case "end":
//         result += "\n[Conversation ended]"
//         break

//       case "flow":
//         if ("direction" in trace.payload) {
//           result += `[Flow: ${trace.payload.direction}]\n`
//         }
//         break

//       case "handoff":
//         // Custom trace type for human handoff
//         requiresHumanHandoff = true
//         if ("reason" in trace.payload) {
//           result += `\n[Escalating to human agent: ${trace.payload.reason}]\n`
//         }
//         break

//       case "priority":
//         // Custom trace type for setting priority
//         if ("level" in trace.payload) {
//           priority = trace.payload.level
//         }
//         break

//       case "sentiment":
//         // Custom trace type for sentiment analysis
//         if ("value" in trace.payload) {
//           sentiment = trace.payload.value
//         }
//         break

//       case "debug":
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
//     requiresHumanHandoff,
//     priority,
//     sentiment,
//   }
// }

// export async function createVoiceflowUser(userId: string): Promise<boolean> {
//   if (userCreationCache.has(userId)) {
//     console.log(`User creation already in progress for ${userId}`)
//     return await userCreationCache.get(userId)!
//   }

//   const creationPromise = createVoiceflowUserInternal(userId)
//   userCreationCache.set(userId, creationPromise)

//   try {
//     const result = await creationPromise
//     return result
//   } finally {
//     setTimeout(() => {
//       userCreationCache.delete(userId)
//     }, 5000)
//   }
// }

// async function createVoiceflowUserInternal(userId: string): Promise<boolean> {
//   const maxRetries = 3

//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       const response = await axios.put(
//         "https://api.voiceflow.com/v2/transcripts",
//         {
//           projectID: PROJECT_ID,
//           versionID: VERSION_ID,
//           sessionID: userId,
//         },
//         {
//           headers: {
//             accept: "application/json",
//             "content-type": "application/json",
//             Authorization: API_KEY,
//           },
//           timeout: 12000,
//         },
//       )
//       console.log(`Voiceflow user created successfully: ${userId}`)
//       return response.status === 200 || response.status === 201
//     } catch (error) {
//       console.error(`Error creating Voiceflow user (attempt ${attempt}):`, error)

//       if (attempt < maxRetries) {
//         const delay = Math.pow(2, attempt - 1) * 1000
//         await new Promise((resolve) => setTimeout(resolve, delay))
//       }
//     }
//   }

//   console.error(`Failed to create Voiceflow user after ${maxRetries} attempts`)
//   return false
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
//         timeout: 10000,
//       },
//     )
//     console.log(`Voiceflow user reset successfully: ${userId}`)
//     return response.status === 200
//   } catch (error) {
//     console.error("Error resetting Voiceflow user:", error)
//     return false
//   }
// }


// import axios from "axios"
// import { getBusinessForWebhook } from "@/actions/businfo"
// import { getBusinessProfileForAutomation } from "@/actions/webhook/business-profile"
// import type { VoiceflowVariables } from "@/types/voiceflow"
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

// // Enhanced typing speed calculation with personality
// export function calculateTypingDelay(
//   messageLength: number,
//   options?: {
//     baseWPM?: number
//     variabilityFactor?: number
//     minDelay?: number
//     maxDelay?: number
//     includeThinkingTime?: boolean
//     isPROUser?: boolean
//     messageComplexity?: "simple" | "medium" | "complex"
//   },
// ): number {
//   const {
//     baseWPM = 45,
//     variabilityFactor = 0.3,
//     minDelay = 1000,
//     maxDelay = 8000,
//     includeThinkingTime = true,
//     isPROUser = false,
//     messageComplexity = "medium",
//   } = options || {}

//   // PRO users get slightly faster responses (premium experience)
//   const adjustedWPM = isPROUser ? baseWPM * 1.2 : baseWPM

//   // Adjust for message complexity
//   const complexityMultiplier = {
//     simple: 0.8,
//     medium: 1.0,
//     complex: 1.3,
//   }[messageComplexity]

//   const charactersPerMinute = adjustedWPM * 5
//   const baseTypingTime = (messageLength / charactersPerMinute) * 60 * 1000 * complexityMultiplier

//   // Enhanced thinking time based on message complexity
//   let thinkingTime = 0
//   if (includeThinkingTime) {
//     const baseThinkingTime = Math.min(messageLength * 8, 2500)
//     const complexityThinking = {
//       simple: 0.5,
//       medium: 1.0,
//       complex: 1.5,
//     }[messageComplexity]
//     thinkingTime = baseThinkingTime * complexityThinking
//   }

//   const variability = 1 + (Math.random() - 0.5) * variabilityFactor
//   const totalTime = (baseTypingTime + thinkingTime) * variability

//   return Math.min(Math.max(totalTime, minDelay), maxDelay)
// }

// // Enhanced circuit breaker with health monitoring
// class EnhancedCircuitBreaker {
//   private failures = 0
//   private successes = 0
//   private lastFailureTime = 0
//   private lastSuccessTime = 0
//   private state: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED"
//   private healthScore = 1.0

//   constructor(
//     private maxFailures = 5,
//     private resetTimeout = 60000,
//     private healthThreshold = 0.7,
//   ) {}

//   async execute<T>(operation: () => Promise<T>): Promise<T> {
//     if (this.state === "OPEN") {
//       if (Date.now() - this.lastFailureTime > this.resetTimeout) {
//         this.state = "HALF_OPEN"
//         console.log("🔄 Circuit breaker moving to HALF_OPEN state")
//       } else {
//         throw new Error(`Circuit breaker is OPEN. Health score: ${this.healthScore.toFixed(2)}`)
//       }
//     }

//     try {
//       const result = await operation()
//       this.onSuccess()
//       return result
//     } catch (error) {
//       this.onFailure()
//       throw error
//     }
//   }

//   private onSuccess() {
//     this.successes++
//     this.lastSuccessTime = Date.now()
//     this.state = "CLOSED"

//     // Update health score
//     const totalOperations = this.successes + this.failures
//     this.healthScore = totalOperations > 0 ? this.successes / totalOperations : 1.0

//     // Reset failure count on sustained success
//     if (this.successes >= 10) {
//       this.failures = Math.max(0, this.failures - 1)
//     }

//     console.log(`✅ Voiceflow operation successful. Health score: ${this.healthScore.toFixed(2)}`)
//   }

//   private onFailure() {
//     this.failures++
//     this.lastFailureTime = Date.now()

//     // Update health score
//     const totalOperations = this.successes + this.failures
//     this.healthScore = totalOperations > 0 ? this.successes / totalOperations : 0.0

//     if (this.failures >= this.maxFailures || this.healthScore < this.healthThreshold) {
//       this.state = "OPEN"
//       console.log(`❌ Circuit breaker OPEN. Failures: ${this.failures}, Health: ${this.healthScore.toFixed(2)}`)
//     }
//   }

//   getHealthScore(): number {
//     return this.healthScore
//   }

//   getState(): string {
//     return this.state
//   }
// }

// const voiceflowCircuitBreaker = new EnhancedCircuitBreaker()

// // Enhanced user creation cache with TTL
// const userCreationCache = new Map<string, { promise: Promise<boolean>; timestamp: number }>()
// const USER_CACHE_TTL = 300000 // 5 minutes

// // Enhanced business variables with conversation context
// export async function fetchEnhancedBusinessVariables(
//   businessId: string,
//   automationId: string,
//   conversationContext?: {
//     pageId: string
//     senderId: string
//     userMessage: string
//     isNewUser: boolean
//     customerType: string
//     messageHistory: Array<{ role: "user" | "assistant"; content: string }>
//   },
// ): Promise<Record<string, string>> {
//   console.log("🔍 Fetching enhanced business variables...")

//   try {
//     // Get business profile description
//     const { profileContent, businessContext } = await getBusinessProfileForAutomation(automationId)

//     // Get traditional business data
//     const businessResponse = await getBusinessForWebhook(businessId)

//     if (businessResponse.status !== 200 || !businessResponse.data.business) {
//       throw new Error(`Failed to fetch business data. Status: ${businessResponse.status}`)
//     }

//     const businessData: BusinessData = businessResponse.data.business

//     const result: Record<string, string> = {
//       // Enhanced business profile integration
//       business_profile: profileContent,
//       business_name: businessContext.businessName || businessData.businessName || "Default Business Name",
//       welcome_message: businessContext.welcomeMessage || businessData.welcomeMessage || "Welcome!",
//       business_industry: businessContext.industry || businessData.industry || "General",
//       business_type: businessData.businessType || "General",
//       business_description:
//         businessContext.businessDescription || businessData.businessDescription || "No description provided",
//       instagram_handle: businessData.instagramHandle || "",
//       response_language: businessContext.responseLanguage || businessData.responseLanguage || "English",
//       business_hours: businessData.businessHours || "Not specified",
//       auto_reply_enabled: businessData.autoReplyEnabled ? "Yes" : "No",
//       promotion_message: businessContext.promotionMessage || businessData.promotionMessage || "",
//       target_audience: businessContext.targetAudience || businessData.targetAudience || "",
//       website: businessData.website || "",
//     }

//     // Add conversation context if available
//     if (conversationContext) {
//       result.customer_type = conversationContext.customerType
//       result.is_new_user = conversationContext.isNewUser.toString()
//       result.current_message = conversationContext.userMessage
//       result.conversation_history = conversationContext.messageHistory
//         .slice(-5)
//         .map((msg) => `${msg.role}: ${msg.content}`)
//         .join(" | ")
//       result.conversation_length = conversationContext.messageHistory.length.toString()

//       // Add conversation insights
//       const hasQuestions = conversationContext.userMessage.includes("?")
//       const hasUrgentWords = /urgent|asap|immediately|emergency|help/i.test(conversationContext.userMessage)
//       const hasPurchaseIntent = /buy|purchase|order|price|cost|payment/i.test(conversationContext.userMessage)

//       result.has_questions = hasQuestions.toString()
//       result.is_urgent = hasUrgentWords.toString()
//       result.has_purchase_intent = hasPurchaseIntent.toString()
//     }

//     // Parse JSON fields safely with enhanced error handling
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
//         console.error("❌ Error parsing automationGoals:", e)
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
//         console.error("❌ Error parsing customerJourney:", e)
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
//         console.error("❌ Error parsing features:", e)
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

//     // Add system context
//     result.system_timestamp = new Date().toISOString()
//     result.voiceflow_health_score = voiceflowCircuitBreaker.getHealthScore().toFixed(2)

//     console.log("✅ Enhanced business variables prepared")
//     return result
//   } catch (error) {
//     console.error("❌ Error in fetchEnhancedBusinessVariables:", error)
//     throw error
//   }
// }

// // Enhanced Voiceflow response with intelligent retry and fallback detection
// export async function getEnhancedVoiceflowResponse(
//   userInput: string,
//   userId: string,
//   businessVariables: Record<string, string>,
//   options?: {
//     maxRetries?: number
//     timeoutMs?: number
//     enableFallbackDetection?: boolean
//   },
// ): Promise<{
//   success: boolean
//   response?: {
//     text: string
//     buttons?: Array<{ name: string; payload: string }>
//     requiresHumanHandoff?: boolean
//     priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
//     sentiment?: "positive" | "neutral" | "negative"
//     complexity?: "simple" | "medium" | "complex"
//   }
//   variables?: VoiceflowVariables
//   error?: string
//   isEmpty?: boolean
//   healthScore?: number
//   fallbackReason?: string
// }> {
//   const { maxRetries = 3, timeoutMs = 15000, enableFallbackDetection = true } = options || {}

//   try {
//     const result = await voiceflowCircuitBreaker.execute(async () => {
//       let lastError: Error | null = null

//       for (let attempt = 1; attempt <= maxRetries; attempt++) {
//         try {
//           console.log(`🎙️ Voiceflow API attempt ${attempt}/${maxRetries} for user ${userId}`)

//           const response = await axios.post<VoiceflowResponse[]>(
//             `https://general-runtime.voiceflow.com/state/user/${userId}/interact`,
//             {
//               request: { type: "text", payload: userInput },
//               state: { variables: businessVariables },
//             },
//             {
//               headers: {
//                 Authorization: API_KEY,
//                 versionID: VERSION_ID,
//                 accept: "application/json",
//                 "content-type": "application/json",
//               },
//               timeout: timeoutMs,
//             },
//           )

//           const processedResponse = processEnhancedVoiceflowResponse(response.data)
//           const updatedVariables = await fetchVoiceflowVariables(userId)

//           // Enhanced fallback detection
//           if (enableFallbackDetection) {
//             const fallbackCheck = detectFallbackConditions(processedResponse, userInput)
//             if (fallbackCheck.shouldFallback) {
//               console.log(`⚠️ Voiceflow fallback condition detected: ${fallbackCheck.reason}`)
//               return {
//                 success: false,
//                 error: fallbackCheck.reason,
//                 isEmpty: fallbackCheck.isEmpty,
//                 fallbackReason: fallbackCheck.reason,
//                 healthScore: voiceflowCircuitBreaker.getHealthScore(),
//               }
//             }
//           }

//           console.log(`✅ Voiceflow API success on attempt ${attempt}`)
//           return {
//             success: true,
//             response: processedResponse,
//             variables: updatedVariables,
//             healthScore: voiceflowCircuitBreaker.getHealthScore(),
//           }
//         } catch (error) {
//           lastError = error as Error
//           console.error(`❌ Voiceflow API attempt ${attempt} failed:`, error)

//           if (attempt < maxRetries) {
//             const baseDelay = Math.pow(2, attempt) * 1000
//             const jitter = Math.random() * 1000
//             const delay = baseDelay + jitter

//             console.log(`⏳ Retrying Voiceflow API in ${Math.round(delay)}ms...`)
//             await new Promise((resolve) => setTimeout(resolve, delay))
//           }
//         }
//       }

//       throw lastError || new Error("Failed to get Voiceflow response after all retries")
//     })

//     return result
//   } catch (error) {
//     console.error("💥 Voiceflow circuit breaker or final error:", error)
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : String(error),
//       healthScore: voiceflowCircuitBreaker.getHealthScore(),
//       fallbackReason: "Circuit breaker open or API failure",
//     }
//   }
// }

// // Enhanced fallback detection
// function detectFallbackConditions(
//   response: any,
//   userInput: string,
// ): { shouldFallback: boolean; reason: string; isEmpty: boolean } {
//   // Check for empty response
//   if (!response.text || response.text.trim().length === 0) {
//     return { shouldFallback: true, reason: "Empty response from Voiceflow", isEmpty: true }
//   }

//   // Check for generic error responses
//   const genericResponses = [
//     "i don't understand",
//     "sorry, i didn't get that",
//     "can you repeat that",
//     "i'm not sure what you mean",
//     "error",
//     "something went wrong",
//     "please try again",
//     "system error",
//     "unable to process",
//   ]

//   const responseText = response.text.toLowerCase()
//   const isGeneric = genericResponses.some((generic) => responseText.includes(generic))

//   if (isGeneric) {
//     return { shouldFallback: true, reason: `Generic response detected: "${response.text}"`, isEmpty: false }
//   }

//   // Check for very short responses that might indicate issues
//   if (response.text.length < 10 && !response.buttons?.length) {
//     return { shouldFallback: true, reason: "Response too short without buttons", isEmpty: false }
//   }

//   // Check for responses that don't seem to address the user input
//   const userWords = userInput.toLowerCase().split(/\s+/)
//   const responseWords = response.text.toLowerCase().split(/\s+/)
//   const commonWords = userWords.filter((word) => responseWords.includes(word) && word.length > 3)

//   if (userInput.length > 20 && commonWords.length === 0 && !response.buttons?.length) {
//     return {
//       shouldFallback: true,
//       reason: "Response doesn't seem to address user input",
//       isEmpty: false,
//     }
//   }

//   return { shouldFallback: false, reason: "", isEmpty: false }
// }

// // Enhanced response processing with intelligence
// export function processEnhancedVoiceflowResponse(traces: VoiceflowTrace[]): {
//   text: string
//   buttons?: { name: string; payload: string }[]
//   requiresHumanHandoff?: boolean
//   priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
//   sentiment?: "positive" | "neutral" | "negative"
//   complexity?: "simple" | "medium" | "complex"
// } {
//   let result = ""
//   const buttons: { name: string; payload: string }[] = []
//   let requiresHumanHandoff = false
//   let priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT" = "MEDIUM"
//   let sentiment: "positive" | "neutral" | "negative" = "neutral"
//   let complexity: "simple" | "medium" | "complex" = "medium"

//   for (const trace of traces) {
//     switch (trace.type) {
//       case "text":
//         if ("message" in trace.payload) {
//           const message = (trace.payload as VoiceflowTextPayload).message
//           result += message + "\n"

//           // Analyze message complexity
//           if (message.length > 200 || message.split(".").length > 3) {
//             complexity = "complex"
//           } else if (message.length < 50) {
//             complexity = "simple"
//           }
//         }
//         break

//       case "choice":
//         if ("buttons" in trace.payload && Array.isArray(trace.payload.buttons)) {
//           trace.payload.buttons.forEach((button: VoiceflowButton) => {
//             buttons.push({
//               name: button.name,
//               payload: button.request?.payload || button.name,
//             })
//           })
//         }
//         break

//       case "visual":
//         if ("image" in trace.payload) {
//           result += `[Image: ${trace.payload.image}]\n`
//         }
//         break

//       case "speak":
//         if ("message" in trace.payload) {
//           result += (trace.payload as VoiceflowTextPayload).message + "\n"
//         }
//         break

//       case "end":
//         result += "\n[Conversation ended]"
//         break

//       case "handoff":
//         requiresHumanHandoff = true
//         priority = "HIGH"
//         if ("reason" in trace.payload) {
//           result += `\n[Escalating to human agent: ${trace.payload.reason}]\n`
//         }
//         break

//       case "priority":
//         if ("level" in trace.payload) {
//           priority = trace.payload.level
//         }
//         break

//       case "sentiment":
//         if ("value" in trace.payload) {
//           sentiment = trace.payload.value
//         }
//         break

//       case "debug":
//         console.log("🔍 Voiceflow debug:", trace.payload)
//         break

//       default:
//         console.warn(`⚠️ Unhandled trace type: ${trace.type}`, trace)
//         break
//     }
//   }

//   // Auto-detect sentiment if not explicitly set
//   if (sentiment === "neutral") {
//     const text = result.toLowerCase()
//     if (text.includes("sorry") || text.includes("apologize") || text.includes("unfortunately")) {
//       sentiment = "negative"
//     } else if (
//       text.includes("great") ||
//       text.includes("excellent") ||
//       text.includes("wonderful") ||
//       text.includes("thank")
//     ) {
//       sentiment = "positive"
//     }
//   }

//   return {
//     text: result.trim(),
//     buttons: buttons.length > 0 ? buttons : undefined,
//     requiresHumanHandoff,
//     priority,
//     sentiment,
//     complexity,
//   }
// }

// // Enhanced Voiceflow variables fetching
// async function fetchVoiceflowVariables(userId: string): Promise<VoiceflowVariables> {
//   const maxRetries = 2

//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       const response = await axios.get<{ variables: VoiceflowVariables }>(
//         `https://general-runtime.voiceflow.com/state/user/${userId}`,
//         {
//           headers: {
//             Authorization: API_KEY,
//             versionID: VERSION_ID,
//             accept: "application/json",
//           },
//           timeout: 8000,
//         },
//       )
//       return response.data.variables || {}
//     } catch (error) {
//       console.error(`❌ Error fetching Voiceflow variables (attempt ${attempt}):`, error)

//       if (attempt < maxRetries) {
//         await new Promise((resolve) => setTimeout(resolve, 2000))
//       }
//     }
//   }

//   console.warn("⚠️ Failed to fetch Voiceflow variables, returning empty object")
//   return {}
// }

// //Enhanced user creation with cache management
// export async function createVoiceflowUser(userId: string): Promise<boolean> {
//   // Clean expired cache entries
//   const now = Date.now()
//   userCreationCache.forEach((value, key) => {
//     if (now - value.timestamp > USER_CACHE_TTL) {
//       userCreationCache.delete(key)
//     }
//   })

//   if (userCreationCache.has(userId)) {
//     console.log(`👤 User creation already in progress for ${userId}`)
//     return await userCreationCache.get(userId)!.promise
//   }

//   const creationPromise = createVoiceflowUserInternal(userId)
//   userCreationCache.set(userId, { promise: creationPromise, timestamp: now })

//   try {
//     const result = await creationPromise
//     return result
//   } finally {
//     // Clean up cache after completion
//     setTimeout(() => {
//       userCreationCache.delete(userId)
//     }, 10000) // Keep in cache for 10 seconds after completion
//   }
// }

// async function createVoiceflowUserInternal(userId: string): Promise<boolean> {
//   const maxRetries = 3

//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       const response = await axios.put(
//         "https://api.voiceflow.com/v2/transcripts",
//         {
//           projectID: PROJECT_ID,
//           versionID: VERSION_ID,
//           sessionID: userId,
//         },
//         {
//           headers: {
//             accept: "application/json",
//             "content-type": "application/json",
//             Authorization: API_KEY,
//           },
//           timeout: 12000,
//         },
//       )
//       console.log(`✅ Voiceflow user created successfully: ${userId}`)
//       return response.status === 200 || response.status === 201
//     } catch (error) {
//       console.error(`❌ Error creating Voiceflow user (attempt ${attempt}):`, error)

//       if (attempt < maxRetries) {
//         const delay = Math.pow(2, attempt - 1) * 1000
//         await new Promise((resolve) => setTimeout(resolve, delay))
//       }
//     }
//   }

//   console.error(`💥 Failed to create Voiceflow user after ${maxRetries} attempts`)
//   return false
// }

// // Enhanced user reset
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
//         timeout: 10000,
//       },
//     )
//     console.log(`🔄 Voiceflow user reset successfully: ${userId}`)
//     return response.status === 200
//   } catch (error) {
//     console.error("❌ Error resetting Voiceflow user:", error)
//     return false
//   }
// }

// // Health monitoring
// export function getVoiceflowHealth(): {
//   healthScore: number
//   circuitBreakerState: string
//   cacheSize: number
// } {
//   return {
//     healthScore: voiceflowCircuitBreaker.getHealthScore(),
//     circuitBreakerState: voiceflowCircuitBreaker.getState(),
//     cacheSize: userCreationCache.size,
//   }
// }























// import axios from "axios"
// import { getBusinessForWebhook } from "@/actions/businfo"
// import { getBusinessProfileForAutomation } from "@/actions/webhook/business-profile"
// import type { VoiceflowVariables } from "@/types/voiceflow"
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

// // Enhanced circuit breaker with health monitoring
// class EnhancedCircuitBreaker {
//   private failures = 0
//   private successes = 0
//   private lastFailureTime = 0
//   private lastSuccessTime = 0
//   private state: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED"
//   private healthScore = 1.0

//   constructor(
//     private maxFailures = 5,
//     private resetTimeout = 60000,
//     private healthThreshold = 0.7,
//   ) {}

//   async execute<T>(operation: () => Promise<T>): Promise<T> {
//     if (this.state === "OPEN") {
//       if (Date.now() - this.lastFailureTime > this.resetTimeout) {
//         this.state = "HALF_OPEN"
//         console.log("🔄 Circuit breaker moving to HALF_OPEN state")
//       } else {
//         throw new Error(`Circuit breaker is OPEN. Health score: ${this.healthScore.toFixed(2)}`)
//       }
//     }

//     try {
//       const result = await operation()
//       this.onSuccess()
//       return result
//     } catch (error) {
//       this.onFailure()
//       throw error
//     }
//   }

//   private onSuccess() {
//     this.successes++
//     this.lastSuccessTime = Date.now()
//     this.state = "CLOSED"

//     // Update health score
//     const totalOperations = this.successes + this.failures
//     this.healthScore = totalOperations > 0 ? this.successes / totalOperations : 1.0

//     // Reset failure count on sustained success
//     if (this.successes >= 10) {
//       this.failures = Math.max(0, this.failures - 1)
//     }

//     console.log(`✅ Voiceflow operation successful. Health score: ${this.healthScore.toFixed(2)}`)
//   }

//   private onFailure() {
//     this.failures++
//     this.lastFailureTime = Date.now()

//     // Update health score
//     const totalOperations = this.successes + this.failures
//     this.healthScore = totalOperations > 0 ? this.successes / totalOperations : 0.0

//     if (this.failures >= this.maxFailures || this.healthScore < this.healthThreshold) {
//       this.state = "OPEN"
//       console.log(`❌ Circuit breaker OPEN. Failures: ${this.failures}, Health: ${this.healthScore.toFixed(2)}`)
//     }
//   }

//   getHealthScore(): number {
//     return this.healthScore
//   }

//   getState(): string {
//     return this.state
//   }
// }

// const voiceflowCircuitBreaker = new EnhancedCircuitBreaker()

// // Enhanced user creation cache with TTL
// const userCreationCache = new Map<string, { promise: Promise<boolean>; timestamp: number }>()
// const USER_CACHE_TTL = 300000 // 5 minutes

// // Enhanced business variables with conversation context
// export async function fetchEnhancedBusinessVariables(
//   businessId: string,
//   automationId: string,
//   conversationContext?: {
//     pageId: string
//     senderId: string
//     userMessage: string
//     isNewUser: boolean
//     customerType: string
//     messageHistory: Array<{ role: "user" | "assistant"; content: string }>
//   },
// ): Promise<Record<string, string>> {
//   console.log("🔍 Fetching enhanced business variables...")

//   try {
//     // Get business profile description
//     const { profileContent, businessContext } = await getBusinessProfileForAutomation(automationId)

//     // Get traditional business data
//     const businessResponse = await getBusinessForWebhook(businessId)

//     if (businessResponse.status !== 200 || !businessResponse.data.business) {
//       throw new Error(`Failed to fetch business data. Status: ${businessResponse.status}`)
//     }

//     const businessData: BusinessData = businessResponse.data.business

//     const result: Record<string, string> = {
//       // Enhanced business profile integration
//       business_profile: profileContent,
//       business_name: businessContext.businessName || businessData.businessName || "Default Business Name",
//       welcome_message: businessContext.welcomeMessage || businessData.welcomeMessage || "Welcome!",
//       business_industry: businessContext.industry || businessData.industry || "General",
//       business_type: businessData.businessType || "General",
//       business_description:
//         businessContext.businessDescription || businessData.businessDescription || "No description provided",
//       instagram_handle: businessData.instagramHandle || "",
//       response_language: businessContext.responseLanguage || businessData.responseLanguage || "English",
//       business_hours: businessData.businessHours || "Not specified",
//       auto_reply_enabled: businessData.autoReplyEnabled ? "Yes" : "No",
//       promotion_message: businessContext.promotionMessage || businessData.promotionMessage || "",
//       target_audience: businessContext.targetAudience || businessData.targetAudience || "",
//       website: businessData.website || "",
//     }

//     // Add conversation context if available
//     if (conversationContext) {
//       result.customer_type = conversationContext.customerType
//       result.is_new_user = conversationContext.isNewUser.toString()
//       result.current_message = conversationContext.userMessage
//       result.conversation_history = conversationContext.messageHistory
//         .slice(-5)
//         .map((msg) => `${msg.role}: ${msg.content}`)
//         .join(" | ")
//       result.conversation_length = conversationContext.messageHistory.length.toString()

//       // Add conversation insights
//       const hasQuestions = conversationContext.userMessage.includes("?")
//       const hasUrgentWords = /urgent|asap|immediately|emergency|help/i.test(conversationContext.userMessage)
//       const hasPurchaseIntent = /buy|purchase|order|price|cost|payment/i.test(conversationContext.userMessage)

//       result.has_questions = hasQuestions.toString()
//       result.is_urgent = hasUrgentWords.toString()
//       result.has_purchase_intent = hasPurchaseIntent.toString()
//     }

//     // Parse JSON fields safely with enhanced error handling
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
//         console.error("❌ Error parsing automationGoals:", e)
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
//         console.error("❌ Error parsing customerJourney:", e)
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
//         console.error("❌ Error parsing features:", e)
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

//     // Add system context
//     result.system_timestamp = new Date().toISOString()
//     result.voiceflow_health_score = voiceflowCircuitBreaker.getHealthScore().toFixed(2)

//     console.log("✅ Enhanced business variables prepared")
//     return result
//   } catch (error) {
//     console.error("❌ Error in fetchEnhancedBusinessVariables:", error)
//     throw error
//   }
// }

// // Enhanced Voiceflow response with intelligent retry and fallback detection
// export async function getEnhancedVoiceflowResponse(
//   userInput: string,
//   userId: string,
//   businessVariables: Record<string, string>,
//   options?: {
//     maxRetries?: number
//     timeoutMs?: number
//     enableFallbackDetection?: boolean
//   },
// ): Promise<{
//   success: boolean
//   response?: {
//     text: string
//     buttons?: Array<{ name: string; payload: string }>
//     requiresHumanHandoff?: boolean
//     priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
//     sentiment?: "positive" | "neutral" | "negative"
//     complexity?: "simple" | "medium" | "complex"
//   }
//   variables?: VoiceflowVariables
//   error?: string
//   isEmpty?: boolean
//   healthScore?: number
//   fallbackReason?: string
// }> {
//   const { maxRetries = 3, timeoutMs = 15000, enableFallbackDetection = true } = options || {}

//   try {
//     const result = await voiceflowCircuitBreaker.execute(async () => {
//       let lastError: Error | null = null

//       for (let attempt = 1; attempt <= maxRetries; attempt++) {
//         try {
//           console.log(`🎙️ Voiceflow API attempt ${attempt}/${maxRetries} for user ${userId}`)

//           const response = await axios.post<VoiceflowResponse[]>(
//             `https://general-runtime.voiceflow.com/state/user/${userId}/interact`,
//             {
//               request: { type: "text", payload: userInput },
//               state: { variables: businessVariables },
//             },
//             {
//               headers: {
//                 Authorization: API_KEY,
//                 versionID: VERSION_ID,
//                 accept: "application/json",
//                 "content-type": "application/json",
//               },
//               timeout: timeoutMs,
//             },
//           )

//           const processedResponse = processEnhancedVoiceflowResponse(response.data)
//           const updatedVariables = await fetchVoiceflowVariables(userId)

//           // Enhanced fallback detection
//           if (enableFallbackDetection) {
//             const fallbackCheck = detectFallbackConditions(processedResponse, userInput)
//             if (fallbackCheck.shouldFallback) {
//               console.log(`⚠️ Voiceflow fallback condition detected: ${fallbackCheck.reason}`)
//               return {
//                 success: false,
//                 error: fallbackCheck.reason,
//                 isEmpty: fallbackCheck.isEmpty,
//                 fallbackReason: fallbackCheck.reason,
//                 healthScore: voiceflowCircuitBreaker.getHealthScore(),
//               }
//             }
//           }

//           console.log(`✅ Voiceflow API success on attempt ${attempt}`)
//           return {
//             success: true,
//             response: processedResponse,
//             variables: updatedVariables,
//             healthScore: voiceflowCircuitBreaker.getHealthScore(),
//           }
//         } catch (error) {
//           lastError = error as Error
//           console.error(`❌ Voiceflow API attempt ${attempt} failed:`, error)

//           if (attempt < maxRetries) {
//             const baseDelay = Math.pow(2, attempt) * 1000
//             const jitter = Math.random() * 1000
//             const delay = baseDelay + jitter

//             console.log(`⏳ Retrying Voiceflow API in ${Math.round(delay)}ms...`)
//             await new Promise((resolve) => setTimeout(resolve, delay))
//           }
//         }
//       }

//       throw lastError || new Error("Failed to get Voiceflow response after all retries")
//     })

//     return result
//   } catch (error) {
//     console.error("💥 Voiceflow circuit breaker or final error:", error)
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : String(error),
//       healthScore: voiceflowCircuitBreaker.getHealthScore(),
//       fallbackReason: "Circuit breaker open or API failure",
//     }
//   }
// }

// // Enhanced fallback detection
// function detectFallbackConditions(
//   response: any,
//   userInput: string,
// ): { shouldFallback: boolean; reason: string; isEmpty: boolean } {
//   // Check for empty response
//   if (!response.text || response.text.trim().length === 0) {
//     return { shouldFallback: true, reason: "Empty response from Voiceflow", isEmpty: true }
//   }

//   // Check for generic error responses
//   const genericResponses = [
//     "i don't understand",
//     "sorry, i didn't get that",
//     "can you repeat that",
//     "i'm not sure what you mean",
//     "error",
//     "something went wrong",
//     "please try again",
//     "system error",
//     "unable to process",
//   ]

//   const responseText = response.text.toLowerCase()
//   const isGeneric = genericResponses.some((generic) => responseText.includes(generic))

//   if (isGeneric) {
//     return { shouldFallback: true, reason: `Generic response detected: "${response.text}"`, isEmpty: false }
//   }

//   // Check for very short responses that might indicate issues
//   if (response.text.length < 10 && !response.buttons?.length) {
//     return { shouldFallback: true, reason: "Response too short without buttons", isEmpty: false }
//   }

//   // Check for responses that don't seem to address the user input
//   const userWords = userInput.toLowerCase().split(/\s+/)
//   const responseWords = response.text.toLowerCase().split(/\s+/)
//   const commonWords = userWords.filter((word) => responseWords.includes(word) && word.length > 3)

//   if (userInput.length > 20 && commonWords.length === 0 && !response.buttons?.length) {
//     return {
//       shouldFallback: true,
//       reason: "Response doesn't seem to address user input",
//       isEmpty: false,
//     }
//   }

//   return { shouldFallback: false, reason: "", isEmpty: false }
// }

// // Enhanced response processing with intelligence
// export function processEnhancedVoiceflowResponse(traces: VoiceflowTrace[]): {
//   text: string
//   buttons?: { name: string; payload: string }[]
//   requiresHumanHandoff?: boolean
//   priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
//   sentiment?: "positive" | "neutral" | "negative"
//   complexity?: "simple" | "medium" | "complex"
// } {
//   let result = ""
//   const buttons: { name: string; payload: string }[] = []
//   let requiresHumanHandoff = false
//   let priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT" = "MEDIUM"
//   let sentiment: "positive" | "neutral" | "negative" = "neutral"
//   let complexity: "simple" | "medium" | "complex" = "medium"

//   for (const trace of traces) {
//     switch (trace.type) {
//       case "text":
//         if ("message" in trace.payload) {
//           const message = (trace.payload as VoiceflowTextPayload).message
//           result += message + "\n"

//           // Analyze message complexity
//           if (message.length > 200 || message.split(".").length > 3) {
//             complexity = "complex"
//           } else if (message.length < 50) {
//             complexity = "simple"
//           }
//         }
//         break

//       case "choice":
//         if ("buttons" in trace.payload && Array.isArray(trace.payload.buttons)) {
//           trace.payload.buttons.forEach((button: VoiceflowButton) => {
//             buttons.push({
//               name: button.name,
//               payload: button.request?.payload || button.name,
//             })
//           })
//         }
//         break

//       case "visual":
//         if ("image" in trace.payload) {
//           result += `[Image: ${trace.payload.image}]\n`
//         }
//         break

//       case "speak":
//         if ("message" in trace.payload) {
//           result += (trace.payload as VoiceflowTextPayload).message + "\n"
//         }
//         break

//       case "end":
//         result += "\n[Conversation ended]"
//         break

//       case "handoff":
//         requiresHumanHandoff = true
//         priority = "HIGH"
//         if ("reason" in trace.payload) {
//           result += `\n[Escalating to human agent: ${trace.payload.reason}]\n`
//         }
//         break

//       case "priority":
//         if ("level" in trace.payload) {
//           priority = trace.payload.level
//         }
//         break

//       case "sentiment":
//         if ("value" in trace.payload) {
//           sentiment = trace.payload.value
//         }
//         break

//       case "debug":
//         console.log("🔍 Voiceflow debug:", trace.payload)
//         break

//       default:
//         console.warn(`⚠️ Unhandled trace type: ${trace.type}`, trace)
//         break
//     }
//   }

//   // Auto-detect sentiment if not explicitly set
//   if (sentiment === "neutral") {
//     const text = result.toLowerCase()
//     if (text.includes("sorry") || text.includes("apologize") || text.includes("unfortunately")) {
//       sentiment = "negative"
//     } else if (
//       text.includes("great") ||
//       text.includes("excellent") ||
//       text.includes("wonderful") ||
//       text.includes("thank")
//     ) {
//       sentiment = "positive"
//     }
//   }

//   return {
//     text: result.trim(),
//     buttons: buttons.length > 0 ? buttons : undefined,
//     requiresHumanHandoff,
//     priority,
//     sentiment,
//     complexity,
//   }
// }

// // Enhanced Voiceflow variables fetching
// async function fetchVoiceflowVariables(userId: string): Promise<VoiceflowVariables> {
//   const maxRetries = 2

//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       const response = await axios.get<{ variables: VoiceflowVariables }>(
//         `https://general-runtime.voiceflow.com/state/user/${userId}`,
//         {
//           headers: {
//             Authorization: API_KEY,
//             versionID: VERSION_ID,
//             accept: "application/json",
//           },
//           timeout: 8000,
//         },
//       )
//       return response.data.variables || {}
//     } catch (error) {
//       console.error(`❌ Error fetching Voiceflow variables (attempt ${attempt}):`, error)

//       if (attempt < maxRetries) {
//         await new Promise((resolve) => setTimeout(resolve, 2000))
//       }
//     }
//   }

//   console.warn("⚠️ Failed to fetch Voiceflow variables, returning empty object")
//   return {}
// }

// // Enhanced user creation with cache management
// export async function createVoiceflowUser(userId: string): Promise<boolean> {
//   // Clean expired cache entries
//   const now = Date.now()
//   userCreationCache.forEach((value, key) => {
//     if (now - value.timestamp > USER_CACHE_TTL) {
//       userCreationCache.delete(key)
//     }
//   })

//   if (userCreationCache.has(userId)) {
//     console.log(`👤 User creation already in progress for ${userId}`)
//     return await userCreationCache.get(userId)!.promise
//   }

//   const creationPromise = createVoiceflowUserInternal(userId)
//   userCreationCache.set(userId, { promise: creationPromise, timestamp: now })

//   try {
//     const result = await creationPromise
//     return result
//   } finally {
//     // Clean up cache after completion
//     setTimeout(() => {
//       userCreationCache.delete(userId)
//     }, 10000) // Keep in cache for 10 seconds after completion
//   }
// }

// async function createVoiceflowUserInternal(userId: string): Promise<boolean> {
//   const maxRetries = 3

//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       const response = await axios.put(
//         "https://api.voiceflow.com/v2/transcripts",
//         {
//           projectID: PROJECT_ID,
//           versionID: VERSION_ID,
//           sessionID: userId,
//         },
//         {
//           headers: {
//             accept: "application/json",
//             "content-type": "application/json",
//             Authorization: API_KEY,
//           },
//           timeout: 12000,
//         },
//       )
//       console.log(`✅ Voiceflow user created successfully: ${userId}`)
//       return response.status === 200 || response.status === 201
//     } catch (error) {
//       console.error(`❌ Error creating Voiceflow user (attempt ${attempt}):`, error)

//       if (attempt < maxRetries) {
//         const delay = Math.pow(2, attempt - 1) * 1000
//         await new Promise((resolve) => setTimeout(resolve, delay))
//       }
//     }
//   }

//   console.error(`💥 Failed to create Voiceflow user after ${maxRetries} attempts`)
//   return false
// }

// // Enhanced user reset
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
//         timeout: 10000,
//       },
//     )
//     console.log(`🔄 Voiceflow user reset successfully: ${userId}`)
//     return response.status === 200
//   } catch (error) {
//     console.error("❌ Error resetting Voiceflow user:", error)
//     return false
//   }
// }

// // Health monitoring
// export function getVoiceflowHealth(): {
//   healthScore: number
//   circuitBreakerState: string
//   cacheSize: number
// } {
//   return {
//     healthScore: voiceflowCircuitBreaker.getHealthScore(),
//     circuitBreakerState: voiceflowCircuitBreaker.getState(),
//     cacheSize: userCreationCache.size,
//   }
// }


// import axios from "axios"
// import { getBusinessForWebhook } from "@/actions/businfo"
// import { getBusinessProfileForAutomation } from "@/actions/webhook/business-profile"
// import type { VoiceflowVariables } from "@/types/voiceflow"
// import type { JsonValue } from "@prisma/client/runtime/library"

// const API_KEY = process.env.VOICEFLOW_API_KEY
// const PROJECT_ID = process.env.VOICEFLOW_PROJECT_ID
// const VERSION_ID = process.env.VOICEFLOW_VERSION_ID

// // Updated session management - track if user needs launch request
// const userSessionCache = new Map<string, { hasLaunched: boolean; timestamp: number }>()
// const SESSION_CACHE_TTL = 1800000 // 30 minutes

// // Instagram message formatting constants
// const INSTAGRAM_MESSAGE_LIMIT = 1000
// const INSTAGRAM_QUICK_REPLY_LIMIT = 13
// const INSTAGRAM_QUICK_REPLY_TITLE_LIMIT = 20

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

// // Enhanced circuit breaker with health monitoring
// class EnhancedCircuitBreaker {
//   private failures = 0
//   private successes = 0
//   private lastFailureTime = 0
//   private lastSuccessTime = 0
//   private state: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED"
//   private healthScore = 1.0

//   constructor(
//     private maxFailures = 5,
//     private resetTimeout = 60000,
//     private healthThreshold = 0.7,
//   ) {}

//   async execute<T>(operation: () => Promise<T>): Promise<T> {
//     if (this.state === "OPEN") {
//       if (Date.now() - this.lastFailureTime > this.resetTimeout) {
//         this.state = "HALF_OPEN"
//         console.log("🔄 Circuit breaker moving to HALF_OPEN state")
//       } else {
//         throw new Error(`Circuit breaker is OPEN. Health score: ${this.healthScore.toFixed(2)}`)
//       }
//     }

//     try {
//       const result = await operation()
//       this.onSuccess()
//       return result
//     } catch (error) {
//       this.onFailure()
//       throw error
//     }
//   }

//   private onSuccess() {
//     this.successes++
//     this.lastSuccessTime = Date.now()
//     this.state = "CLOSED"

//     // Update health score
//     const totalOperations = this.successes + this.failures
//     this.healthScore = totalOperations > 0 ? this.successes / totalOperations : 1.0

//     // Reset failure count on sustained success
//     if (this.successes >= 10) {
//       this.failures = Math.max(0, this.failures - 1)
//     }

//     console.log(`✅ Voiceflow operation successful. Health score: ${this.healthScore.toFixed(2)}`)
//   }

//   private onFailure() {
//     this.failures++
//     this.lastFailureTime = Date.now()

//     // Update health score
//     const totalOperations = this.successes + this.failures
//     this.healthScore = totalOperations > 0 ? this.successes / totalOperations : 0.0

//     if (this.failures >= this.maxFailures || this.healthScore < this.healthThreshold) {
//       this.state = "OPEN"
//       console.log(`❌ Circuit breaker OPEN. Failures: ${this.failures}, Health: ${this.healthScore.toFixed(2)}`)
//     }
//   }

//   getHealthScore(): number {
//     return this.healthScore
//   }

//   getState(): string {
//     return this.state
//   }
// }

// const voiceflowCircuitBreaker = new EnhancedCircuitBreaker()

// // Enhanced user creation cache with TTL
// const userCreationCache = new Map<string, { promise: Promise<boolean>; timestamp: number }>()
// const USER_CACHE_TTL = 300000 // 5 minutes

// // Simple customer data extraction from Voiceflow variables
// export function extractBasicCustomerData(variables: Record<string, any>) {
//   return {
//     name: variables.customer_name || variables.clientname || variables.name || null,
//     email: variables.customer_email || variables.clientemail || variables.email || null,
//     phone: variables.customer_phone || variables.clientphone || variables.phone || null,
//   }
// }

// // Enhanced business variables with conversation context
// export async function fetchEnhancedBusinessVariables(
//   businessId: string,
//   automationId: string,
//   conversationContext?: {
//     pageId: string
//     senderId: string
//     userMessage: string
//     isNewUser: boolean
//     customerType: string
//     messageHistory: Array<{ role: "user" | "assistant"; content: string }>
//   },
// ): Promise<Record<string, string>> {
//   console.log("🔍 Fetching enhanced business variables...")

//   try {
//     // Get business profile description
//     const { profileContent, businessContext } = await getBusinessProfileForAutomation(automationId)

//     // Get traditional business data
//     const businessResponse = await getBusinessForWebhook(businessId)

//     if (businessResponse.status !== 200 || !businessResponse.data.business) {
//       throw new Error(`Failed to fetch business data. Status: ${businessResponse.status}`)
//     }

//     const businessData: BusinessData = businessResponse.data.business

//     const result: Record<string, string> = {
//       // Enhanced business profile integration
//       business_profile: profileContent,
//       business_name: businessContext.businessName || businessData.businessName || "Default Business Name",
//       welcome_message: businessContext.welcomeMessage || businessData.welcomeMessage || "Welcome!",
//       business_industry: businessContext.industry || businessData.industry || "General",
//       business_type: businessData.businessType || "General",
//       business_description:
//         businessContext.businessDescription || businessData.businessDescription || "No description provided",
//       instagram_handle: businessData.instagramHandle || "",
//       response_language: businessContext.responseLanguage || businessData.responseLanguage || "English",
//       business_hours: businessData.businessHours || "Not specified",
//       auto_reply_enabled: businessData.autoReplyEnabled ? "Yes" : "No",
//       promotion_message: businessContext.promotionMessage || businessData.promotionMessage || "",
//       target_audience: businessContext.targetAudience || businessData.targetAudience || "",
//       website: businessData.website || "",
//       // Add basic data collection variables for Voiceflow
//       customer_name: "",
//       customer_email: "",
//       customer_phone: "",
//     }

//     // Add conversation context if available
//     if (conversationContext) {
//       result.customer_type = conversationContext.customerType
//       result.is_new_user = conversationContext.isNewUser.toString()
//       result.current_message = conversationContext.userMessage
//       result.conversation_history = conversationContext.messageHistory
//         .slice(-5)
//         .map((msg) => `${msg.role}: ${msg.content}`)
//         .join(" | ")
//       result.conversation_length = conversationContext.messageHistory.length.toString()

//       // Add conversation insights
//       const hasQuestions = conversationContext.userMessage.includes("?")
//       const hasUrgentWords = /urgent|asap|immediately|emergency|help/i.test(conversationContext.userMessage)
//       const hasPurchaseIntent = /buy|purchase|order|price|cost|payment/i.test(conversationContext.userMessage)

//       result.has_questions = hasQuestions.toString()
//       result.is_urgent = hasUrgentWords.toString()
//       result.has_purchase_intent = hasPurchaseIntent.toString()
//     }

//     // Parse JSON fields safely with enhanced error handling
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
//         console.error("❌ Error parsing automationGoals:", e)
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
//         console.error("❌ Error parsing customerJourney:", e)
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
//         console.error("❌ Error parsing features:", e)
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

//     // Add system context
//     result.system_timestamp = new Date().toISOString()
//     result.voiceflow_health_score = voiceflowCircuitBreaker.getHealthScore().toFixed(2)

//     console.log("✅ Enhanced business variables prepared")
//     return result
//   } catch (error) {
//     console.error("❌ Error in fetchEnhancedBusinessVariables:", error)
//     throw error
//   }
// }

// // Enhanced Voiceflow response with intelligent retry and fallback detection
// export async function getEnhancedVoiceflowResponseE(
//   userInput: string,
//   userId: string,
//   businessVariables: Record<string, string>,
//   options?: {
//     maxRetries?: number
//     timeoutMs?: number
//     enableFallbackDetection?: boolean
//   },
// ): Promise<{
//   success: boolean
//   response?: {
//     text: string
//     buttons?: Array<{ name: string; payload: string }>
//     requiresHumanHandoff?: boolean
//     priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
//     sentiment?: "positive" | "neutral" | "negative"
//     complexity?: "simple" | "medium" | "complex"
//   }
//   variables?: VoiceflowVariables
//   error?: string
//   isEmpty?: boolean
//   healthScore?: number
//   fallbackReason?: string
// }> {
//   const { maxRetries = 3, timeoutMs = 15000, enableFallbackDetection = true } = options || {}

//   try {
//     const result = await voiceflowCircuitBreaker.execute(async () => {
//       let lastError: Error | null = null

//       for (let attempt = 1; attempt <= maxRetries; attempt++) {
//         try {
//           console.log(`🎙️ Voiceflow API attempt ${attempt}/${maxRetries} for user ${userId}`)

//           const response = await axios.post<VoiceflowResponse[]>(
//             `https://general-runtime.voiceflow.com/state/user/${userId}/interact`,
//             {
//               request: { type: "text", payload: userInput },
//               state: { variables: businessVariables },
//             },
//             {
//               headers: {
//                 Authorization: API_KEY,
//                 versionID: VERSION_ID,
//                 accept: "application/json",
//                 "content-type": "application/json",
//               },
//               timeout: timeoutMs,
//             },
//           )

//           const processedResponse = processEnhancedVoiceflowResponse(response.data)
//           const updatedVariables = await fetchVoiceflowVariables(userId)

//           // Enhanced fallback detection
//           if (enableFallbackDetection) {
//             const fallbackCheck = detectFallbackConditions(processedResponse, userInput)
//             if (fallbackCheck.shouldFallback) {
//               console.log(`⚠️ Voiceflow fallback condition detected: ${fallbackCheck.reason}`)
//               return {
//                 success: false,
//                 error: fallbackCheck.reason,
//                 isEmpty: fallbackCheck.isEmpty,
//                 fallbackReason: fallbackCheck.reason,
//                 healthScore: voiceflowCircuitBreaker.getHealthScore(),
//               }
//             }
//           }

//           console.log(`✅ Voiceflow API success on attempt ${attempt}`)
//           return {
//             success: true,
//             response: processedResponse,
//             variables: updatedVariables,
//             healthScore: voiceflowCircuitBreaker.getHealthScore(),
//           }
//         } catch (error) {
//           lastError = error as Error
//           console.error(`❌ Voiceflow API attempt ${attempt} failed:`, error)

//           if (attempt < maxRetries) {
//             const baseDelay = Math.pow(2, attempt) * 1000
//             const jitter = Math.random() * 1000
//             const delay = baseDelay + jitter

//             console.log(`⏳ Retrying Voiceflow API in ${Math.round(delay)}ms...`)
//             await new Promise((resolve) => setTimeout(resolve, delay))
//           }
//         }
//       }

//       throw lastError || new Error("Failed to get Voiceflow response after all retries")
//     })

//     return result
//   } catch (error) {
//     console.error("💥 Voiceflow circuit breaker or final error:", error)
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : String(error),
//       healthScore: voiceflowCircuitBreaker.getHealthScore(),
//       fallbackReason: "Circuit breaker open or API failure",
//     }
//   }
// }

// // Enhanced fallback detection
// function detectFallbackConditions(
//   response: any,
//   userInput: string,
// ): { shouldFallback: boolean; reason: string; isEmpty: boolean } {
//   // Check for empty response
//   if (!response.text || response.text.trim().length === 0) {
//     return { shouldFallback: true, reason: "Empty response from Voiceflow", isEmpty: true }
//   }

//   // Check for generic error responses
//   const genericResponses = [
//     "i don't understand",
//     "sorry, i didn't get that",
//     "can you repeat that",
//     "i'm not sure what you mean",
//     "error",
//     "something went wrong",
//     "please try again",
//     "system error",
//     "unable to process",
//   ]

//   const responseText = response.text.toLowerCase()
//   const isGeneric = genericResponses.some((generic) => responseText.includes(generic))

//   if (isGeneric) {
//     return { shouldFallback: true, reason: `Generic response detected: "${response.text}"`, isEmpty: false }
//   }

//   // Check for very short responses that might indicate issues
//   if (response.text.length < 10 && !response.buttons?.length) {
//     return { shouldFallback: true, reason: "Response too short without buttons", isEmpty: false }
//   }

//   // Check for responses that don't seem to address the user input
//   const userWords = userInput.toLowerCase().split(/\s+/)
//   const responseWords = response.text.toLowerCase().split(/\s+/)
//   const commonWords = userWords.filter((word) => responseWords.includes(word) && word.length > 3)

//   if (userInput.length > 20 && commonWords.length === 0 && !response.buttons?.length) {
//     return {
//       shouldFallback: true,
//       reason: "Response doesn't seem to address user input",
//       isEmpty: false,
//     }
//   }

//   return { shouldFallback: false, reason: "", isEmpty: false }
// }

// // Enhanced response processing with intelligence
// export function processEnhancedVoiceflowResponseE(traces: VoiceflowTrace[]): {
//   text: string
//   buttons?: { name: string; payload: string }[]
//   requiresHumanHandoff?: boolean
//   priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
//   sentiment?: "positive" | "neutral" | "negative"
//   complexity?: "simple" | "medium" | "complex"
// } {
//   let result = ""
//   const buttons: { name: string; payload: string }[] = []
//   let requiresHumanHandoff = false
//   let priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT" = "MEDIUM"
//   let sentiment: "positive" | "neutral" | "negative" = "neutral"
//   let complexity: "simple" | "medium" | "complex" = "medium"

//   for (const trace of traces) {
//     switch (trace.type) {
//       case "text":
//         if ("message" in trace.payload) {
//           const message = (trace.payload as VoiceflowTextPayload).message
//           result += message + "\n"

//           // Analyze message complexity
//           if (message.length > 200 || message.split(".").length > 3) {
//             complexity = "complex"
//           } else if (message.length < 50) {
//             complexity = "simple"
//           }
//         }
//         break

//       case "choice":
//         if ("buttons" in trace.payload && Array.isArray(trace.payload.buttons)) {
//           trace.payload.buttons.forEach((button: VoiceflowButton) => {
//             buttons.push({
//               name: button.name,
//               payload: button.request?.payload || button.name,
//             })
//           })
//         }
//         break

//       case "visual":
//         if ("image" in trace.payload) {
//           result += `[Image: ${trace.payload.image}]\n`
//         }
//         break

//       case "speak":
//         if ("message" in trace.payload) {
//           result += (trace.payload as VoiceflowTextPayload).message + "\n"
//         }
//         break

//       case "end":
//         result += "\n[Conversation ended]"
//         break

//       case "handoff":
//         requiresHumanHandoff = true
//         priority = "HIGH"
//         if ("reason" in trace.payload) {
//           result += `\n[Escalating to human agent: ${trace.payload.reason}]\n`
//         }
//         break

//       case "priority":
//         if ("level" in trace.payload) {
//           priority = trace.payload.level
//         }
//         break

//       case "sentiment":
//         if ("value" in trace.payload) {
//           sentiment = trace.payload.value
//         }
//         break

//       case "debug":
//         console.log("🔍 Voiceflow debug:", trace.payload)
//         break

//       default:
//         console.warn(`⚠️ Unhandled trace type: ${trace.type}`, trace)
//         break
//     }
//   }

//   // Auto-detect sentiment if not explicitly set
//   if (sentiment === "neutral") {
//     const text = result.toLowerCase()
//     if (text.includes("sorry") || text.includes("apologize") || text.includes("unfortunately")) {
//       sentiment = "negative"
//     } else if (
//       text.includes("great") ||
//       text.includes("excellent") ||
//       text.includes("wonderful") ||
//       text.includes("thank")
//     ) {
//       sentiment = "positive"
//     }
//   }

//   return {
//     text: result.trim(),
//     buttons: buttons.length > 0 ? buttons : undefined,
//     requiresHumanHandoff,
//     priority,
//     sentiment,
//     complexity,
//   }
// }

// // Enhanced Voiceflow variables fetching
// async function fetchVoiceflowVariablesE(userId: string): Promise<VoiceflowVariables> {
//   const maxRetries = 2

//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       const response = await axios.get<{ variables: VoiceflowVariables }>(
//         `https://general-runtime.voiceflow.com/state/user/${userId}`,
//         {
//           headers: {
//             Authorization: API_KEY,
//             versionID: VERSION_ID,
//             accept: "application/json",
//           },
//           timeout: 8000,
//         },
//       )
//       return response.data.variables || {}
//     } catch (error) {
//       console.error(`❌ Error fetching Voiceflow variables (attempt ${attempt}):`, error)

//       if (attempt < maxRetries) {
//         await new Promise((resolve) => setTimeout(resolve, 2000))
//       }
//     }
//   }

//   console.warn("⚠️ Failed to fetch Voiceflow variables, returning empty object")
//   return {}
// }

// // Enhanced user creation with cache management
// export async function createVoiceflowUserE(userId: string): Promise<boolean> {
//   // Clean expired cache entries
//   const now = Date.now()
//   userCreationCache.forEach((value, key) => {
//     if (now - value.timestamp > USER_CACHE_TTL) {
//       userCreationCache.delete(key)
//     }
//   })

//   if (userCreationCache.has(userId)) {
//     console.log(`👤 User creation already in progress for ${userId}`)
//     return await userCreationCache.get(userId)!.promise
//   }

//   const creationPromise = createVoiceflowUserInternal(userId)
//   userCreationCache.set(userId, { promise: creationPromise, timestamp: now })

//   try {
//     const result = await creationPromise
//     return result
//   } finally {
//     // Clean up cache after completion
//     setTimeout(() => {
//       userCreationCache.delete(userId)
//     }, 10000) // Keep in cache for 10 seconds after completion
//   }
// }

// async function createVoiceflowUserInternal(userId: string): Promise<boolean> {
//   const maxRetries = 3

//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       const response = await axios.put(
//         "https://api.voiceflow.com/v2/transcripts",
//         {
//           projectID: PROJECT_ID,
//           versionID: VERSION_ID,
//           sessionID: userId,
//         },
//         {
//           headers: {
//             accept: "application/json",
//             "content-type": "application/json",
//             Authorization: API_KEY,
//           },
//           timeout: 12000,
//         },
//       )
//       console.log(`✅ Voiceflow user created successfully: ${userId}`)
//       return response.status === 200 || response.status === 201
//     } catch (error) {
//       console.error(`❌ Error creating Voiceflow user (attempt ${attempt}):`, error)

//       if (attempt < maxRetries) {
//         const delay = Math.pow(2, attempt - 1) * 1000
//         await new Promise((resolve) => setTimeout(resolve, delay))
//       }
//     }
//   }

//   console.error(`💥 Failed to create Voiceflow user after ${maxRetries} attempts`)
//   return false
// }

// // Enhanced user reset
// export async function resetVoiceflowUserE(userId: string): Promise<boolean> {
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
//         timeout: 10000,
//       },
//     )
//     console.log(`🔄 Voiceflow user reset successfully: ${userId}`)
//     return response.status === 200
//   } catch (error) {
//     console.error("❌ Error resetting Voiceflow user:", error)
//     return false
//   }
// }

// // Health monitoring
// export function getVoiceflowHealthE(): {
//   healthScore: number
//   circuitBreakerState: string
//   cacheSize: number
// } {
//   return {
//     healthScore: voiceflowCircuitBreaker.getHealthScore(),
//     circuitBreakerState: voiceflowCircuitBreaker.getState(),
//     cacheSize: userCreationCache.size,
//   }
// }




















// // Enhanced Voiceflow response with proper launch handling and Instagram formatting
// export async function getEnhancedVoiceflowResponse(
//   userInput: string,
//   userId: string,
//   businessVariables: Record<string, string>,
//   options?: {
//     maxRetries?: number
//     timeoutMs?: number
//     enableFallbackDetection?: boolean
//     isFirstMessage?: boolean
//   },
// ): Promise<{
//   success: boolean
//   response?: {
//     text: string
//     quickReplies?: Array<{ title: string; payload: string }>
//     requiresHumanHandoff?: boolean
//     priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
//     sentiment?: "positive" | "neutral" | "negative"
//     complexity?: "simple" | "medium" | "complex"
//   }
//   variables?: VoiceflowVariables
//   error?: string
//   isEmpty?: boolean
//   healthScore?: number
//   fallbackReason?: string
// }> {
//   const { maxRetries = 3, timeoutMs = 15000, enableFallbackDetection = true, isFirstMessage = false } = options || {}

//   try {
//     const result = await voiceflowCircuitBreaker.execute(async () => {
//       let lastError: Error | null = null

//       for (let attempt = 1; attempt <= maxRetries; attempt++) {
//         try {
//           console.log(`🎙️ Voiceflow API attempt ${attempt}/${maxRetries} for user ${userId}`)

//           // Clean expired session cache
//           const now = Date.now()
//           userSessionCache.forEach((value, key) => {
//             if (now - value.timestamp > SESSION_CACHE_TTL) {
//               userSessionCache.delete(key)
//             }
//           })

//           // Check if user needs launch request
//           const sessionData = userSessionCache.get(userId)
//           const needsLaunch = isFirstMessage || !sessionData?.hasLaunched

//           let requestPayload: any
//           if (needsLaunch) {
//             // Send launch request first
//             console.log(`🚀 Sending launch request for user ${userId}`)
//             requestPayload = {
//               action: { type: "launch" },
//               config: {
//                 tts: false,
//                 stripSSML: true,
//                 stopAll: true,
//                 excludeTypes: ["block", "debug", "flow"]
//               }
//             }
//           } else {
//             // Send text request
//             requestPayload = {
//               action: { type: "text", payload: userInput },
//               config: {
//                 tts: false,
//                 stripSSML: true,
//                 stopAll: true,
//                 excludeTypes: ["block", "debug", "flow"]
//               }
//             }
//           }

//           // Add business variables to state
//           if (Object.keys(businessVariables).length > 0) {
//             requestPayload.state = { variables: businessVariables }
//           }

//           const response = await axios.post<VoiceflowTrace[]>(
//             `https://general-runtime.voiceflow.com/state/user/${userId}/interact`,
//             requestPayload,
//             {
//               headers: {
//                 Authorization: API_KEY,
//                 versionID: VERSION_ID,
//                 accept: "application/json",
//                 "content-type": "application/json",
//               },
//               timeout: timeoutMs,
//             },
//           )

//           // If this was a launch request and we have user input, send the text request
//           if (needsLaunch && userInput.trim().length > 0) {
//             console.log(`📝 Following up with text request for user ${userId}`)
//             const textResponse = await axios.post<VoiceflowTrace[]>(
//               `https://general-runtime.voiceflow.com/state/user/${userId}/interact`,
//               {
//                 action: { type: "text", payload: userInput },
//                 config: {
//                   tts: false,
//                   stripSSML: true,
//                   stopAll: true,
//                   excludeTypes: ["block", "debug", "flow"]
//                 }
//               },
//               {
//                 headers: {
//                   Authorization: API_KEY,
//                   versionID: VERSION_ID,
//                   accept: "application/json",
//                   "content-type": "application/json",
//                 },
//                 timeout: timeoutMs,
//               },
//             )
            
//             // Use the text response instead
//             response.data = textResponse.data
//           }

//           // Mark user as launched
//           userSessionCache.set(userId, { hasLaunched: true, timestamp: now })

//           const processedResponse = processEnhancedVoiceflowResponse(response.data)
//           const updatedVariables = await fetchVoiceflowVariables(userId)

//           // Enhanced fallback detection
//           if (enableFallbackDetection) {
//             const fallbackCheck = detectFallbackConditions(processedResponse, userInput)
//             if (fallbackCheck.shouldFallback) {
//               console.log(`⚠️ Voiceflow fallback condition detected: ${fallbackCheck.reason}`)
//               return {
//                 success: false,
//                 error: fallbackCheck.reason,
//                 isEmpty: fallbackCheck.isEmpty,
//                 fallbackReason: fallbackCheck.reason,
//                 healthScore: voiceflowCircuitBreaker.getHealthScore(),
//               }
//             }
//           }

//           console.log(`✅ Voiceflow API success on attempt ${attempt}`)
//           return {
//             success: true,
//             response: processedResponse,
//             variables: updatedVariables,
//             healthScore: voiceflowCircuitBreaker.getHealthScore(),
//           }
//         } catch (error) {
//           lastError = error as Error
//           console.error(`❌ Voiceflow API attempt ${attempt} failed:`, error)

//           if (attempt < maxRetries) {
//             const baseDelay = Math.pow(2, attempt) * 1000
//             const jitter = Math.random() * 1000
//             const delay = baseDelay + jitter

//             console.log(`⏳ Retrying Voiceflow API in ${Math.round(delay)}ms...`)
//             await new Promise((resolve) => setTimeout(resolve, delay))
//           }
//         }
//       }

//       throw lastError || new Error("Failed to get Voiceflow response after all retries")
//     })

//     return result
//   } catch (error) {
//     console.error("💥 Voiceflow circuit breaker or final error:", error)
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : String(error),
//       healthScore: voiceflowCircuitBreaker.getHealthScore(),
//       fallbackReason: "Circuit breaker open or API failure",
//     }
//   }
// }

// // Enhanced response processing with Instagram DM formatting
// export function processEnhancedVoiceflowResponse(traces: VoiceflowTrace[]): {
//   text: string
//   quickReplies?: { title: string; payload: string }[]
//   requiresHumanHandoff?: boolean
//   priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
//   sentiment?: "positive" | "neutral" | "negative"
//   complexity?: "simple" | "medium" | "complex"
// } {
//   let result = ""
//   const quickReplies: { title: string; payload: string }[] = []
//   let requiresHumanHandoff = false
//   let priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT" = "MEDIUM"
//   let sentiment: "positive" | "neutral" | "negative" = "neutral"
//   let complexity: "simple" | "medium" | "complex" = "medium"

//   for (const trace of traces) {
//     switch (trace.type) {
//       case "speak":
//         if ("message" in trace.payload) {
//           const message = (trace.payload as VoiceflowTextPayload).message
//           result += message + "\n"

//           // Analyze message complexity
//           if (message.length > 200 || message.split(".").length > 3) {
//             complexity = "complex"
//           } else if (message.length < 50) {
//             complexity = "simple"
//           }
//         }
//         break

//       case "text":
//         if ("message" in trace.payload) {
//           const message = (trace.payload as VoiceflowTextPayload).message
//           result += message + "\n"
//         }
//         break

//       case "choice":
//         if ("buttons" in trace.payload && Array.isArray(trace.payload.buttons)) {
//           trace.payload.buttons.forEach((button: VoiceflowButton) => {
//             // Format for Instagram quick replies
//             const title = button.name.length <= INSTAGRAM_QUICK_REPLY_TITLE_LIMIT 
//               ? button.name 
//               : button.name.substring(0, INSTAGRAM_QUICK_REPLY_TITLE_LIMIT - 3) + "..."
            
//             quickReplies.push({
//               title: title,
//               payload: button.request?.payload || button.name,
//             })
//           })
//         }
//         break

//       case "visual":
//         if ("image" in trace.payload) {
//           // Instagram supports images, but we'll note it in text for now
//           result += `📷 Image: ${trace.payload.image}\n`
//         }
//         break

//       case "end":
//         result += "\n[Conversation ended]"
//         break

//       case "handoff":
//         requiresHumanHandoff = true
//         priority = "HIGH"
//         if ("reason" in trace.payload) {
//           result += `\n[Escalating to human agent: ${trace.payload.reason}]\n`
//         }
//         break

//       case "priority":
//         if ("level" in trace.payload) {
//           priority = trace.payload.level
//         }
//         break

//       case "sentiment":
//         if ("value" in trace.payload) {
//           sentiment = trace.payload.value
//         }
//         break

//       case "debug":
//         console.log("🔍 Voiceflow debug:", trace.payload)
//         break

//       // Handle card traces (common in Voiceflow)
//       case "card":
//         if (trace.payload) {
//           if ("title" in trace.payload) {
//             result += `*${trace.payload.title}*\n`
//           }
//           if ("description" in trace.payload) {
//             result += `${trace.payload.description}\n`
//           }
//         }
//         break

//       default:
//         console.warn(`⚠️ Unhandled trace type: ${trace.type}`, trace)
//         break
//     }
//   }

//   // Auto-detect sentiment if not explicitly set
//   if (sentiment === "neutral") {
//     const text = result.toLowerCase()
//     if (text.includes("sorry") || text.includes("apologize") || text.includes("unfortunately")) {
//       sentiment = "negative"
//     } else if (
//       text.includes("great") ||
//       text.includes("excellent") ||
//       text.includes("wonderful") ||
//       text.includes("thank")
//     ) {
//       sentiment = "positive"
//     }
//   }

//   // Trim response to Instagram limits
//   let finalText = result.trim()
//   if (finalText.length > INSTAGRAM_MESSAGE_LIMIT) {
//     finalText = finalText.substring(0, INSTAGRAM_MESSAGE_LIMIT - 3) + "..."
//   }

//   // Limit quick replies for Instagram
//   const limitedQuickReplies = quickReplies.slice(0, INSTAGRAM_QUICK_REPLY_LIMIT)

//   return {
//     text: finalText,
//     quickReplies: limitedQuickReplies.length > 0 ? limitedQuickReplies : undefined,
//     requiresHumanHandoff,
//     priority,
//     sentiment,
//     complexity,
//   }
// }

// // Updated Voiceflow variables fetching with proper error handling
// async function fetchVoiceflowVariables(userId: string): Promise<VoiceflowVariables> {
//   const maxRetries = 2

//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       const response = await axios.get<{ variables: VoiceflowVariables }>(
//         `https://general-runtime.voiceflow.com/state/user/${userId}`,
//         {
//           headers: {
//             Authorization: API_KEY,
//             versionID: VERSION_ID,
//             accept: "application/json",
//           },
//           timeout: 8000,
//         },
//       )
//       return response.data.variables || {}
//     } catch (error) {
//       console.error(`❌ Error fetching Voiceflow variables (attempt ${attempt}):`, error)

//       if (attempt < maxRetries) {
//         await new Promise((resolve) => setTimeout(resolve, 2000))
//       }
//     }
//   }

//   console.warn("⚠️ Failed to fetch Voiceflow variables, returning empty object")
//   return {}
// }

// // Simplified user creation - Voiceflow auto-creates users on first interaction
// export async function createVoiceflowUser(userId: string): Promise<boolean> {
//   // Clean expired cache entries
//   const now = Date.now()
//   userCreationCache.forEach((value, key) => {
//     if (now - value.timestamp > USER_CACHE_TTL) {
//       userCreationCache.delete(key)
//     }
//   })

//   if (userCreationCache.has(userId)) {
//     console.log(`👤 User creation already in progress for ${userId}`)
//     return await userCreationCache.get(userId)!.promise
//   }

//   // Since Voiceflow auto-creates users, we just need to mark them as created
//   const creationPromise = Promise.resolve(true)
//   userCreationCache.set(userId, { promise: creationPromise, timestamp: now })

//   console.log(`✅ Voiceflow user will be auto-created on first interaction: ${userId}`)
//   return true
// }

// // Enhanced user reset with proper request format
// export async function resetVoiceflowUser(userId: string): Promise<boolean> {
//   try {
//     const response = await axios.post(
//       `https://general-runtime.voiceflow.com/state/user/${userId}/interact`,
//       { 
//         action: { type: "reset" },
//         config: {
//           tts: false,
//           stripSSML: true,
//           stopAll: true,
//           excludeTypes: ["block", "debug", "flow"]
//         }
//       },
//       {
//         headers: {
//           Authorization: API_KEY,
//           versionID: VERSION_ID,
//           accept: "application/json",
//           "content-type": "application/json",
//         },
//         timeout: 10000,
//       },
//     )
    
//     // Clear session cache for this user
//     userSessionCache.delete(userId)
    
//     console.log(`🔄 Voiceflow user reset successfully: ${userId}`)
//     return response.status === 200
//   } catch (error) {
//     console.error("❌ Error resetting Voiceflow user:", error)
//     return false
//   }
// }

// // Helper function to format response for Instagram Graph API
// export function formatForInstagramDM(response: {
//   text: string
//   quickReplies?: { title: string; payload: string }[]
// }): {
//   text: string
//   quick_replies?: Array<{
//     content_type: "text"
//     title: string
//     payload: string
//   }>
// } {
//   const result: any = {
//     text: response.text
//   }

//   if (response.quickReplies && response.quickReplies.length > 0) {
//     result.quick_replies = response.quickReplies.map(reply => ({
//       content_type: "text",
//       title: reply.title,
//       payload: reply.payload
//     }))
//   }

//   return result
// }

// // Enhanced health monitoring with session cache info
// export function getVoiceflowHealth(): {
//   healthScore: number
//   circuitBreakerState: string
//   cacheSize: number
//   sessionCacheSize: number
// } {
//   return {
//     healthScore: voiceflowCircuitBreaker.getHealthScore(),
//     circuitBreakerState: voiceflowCircuitBreaker.getState(),
//     cacheSize: userCreationCache.size,
//     sessionCacheSize: userSessionCache.size,
//   }
// }



// import axios from "axios"
// import { getBusinessForWebhook } from "@/actions/businfo"
// import { getBusinessProfileForAutomation } from "@/actions/webhook/business-profile"
// import type { VoiceflowVariables } from "@/types/voiceflow"
// import type { JsonValue } from "@prisma/client/runtime/library"

// // ============================================================================
// // CONFIGURATION & CONSTANTS
// // ============================================================================

// const CONFIG = {
//   API_KEY: process.env.VOICEFLOW_API_KEY!,
//   PROJECT_ID: process.env.VOICEFLOW_PROJECT_ID!,
//   VERSION_ID: process.env.VOICEFLOW_VERSION_ID!,
//   TIMEOUTS: {
//     INTERACTION: 15000,
//     VARIABLES: 8000,
//     USER_CREATION: 12000,
//   },
//   RETRY: {
//     MAX_ATTEMPTS: 3,
//     BASE_DELAY: 1000,
//     MAX_JITTER: 1000,
//   },
//   CACHE_TTL: {
//     USER_CREATION: 300000, // 5 minutes
//     SESSION: 1800000, // 30 minutes
//   },
//   INSTAGRAM: {
//     MESSAGE_LIMIT: 1000,
//     QUICK_REPLY_LIMIT: 13,
//     QUICK_REPLY_TITLE_LIMIT: 20,
//   },
// } as const

// // ============================================================================
// // TYPES & INTERFACES
// // ============================================================================

// interface VoiceflowTrace {
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

// interface ConversationContext {
//   pageId: string
//   senderId: string
//   userMessage: string
//   isNewUser: boolean
//   customerType: string
//   messageHistory: Array<{ role: "user" | "assistant"; content: string }>
// }

// interface VoiceflowResponse {
//   success: boolean
//   response?: {
//     text: string
//     quickReplies?: Array<{ title: string; payload: string }>
//     requiresHumanHandoff?: boolean
//     priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
//     sentiment?: "positive" | "neutral" | "negative"
//     complexity?: "simple" | "medium" | "complex"
//   }
//   variables?: VoiceflowVariables
//   error?: string
//   isEmpty?: boolean
//   healthScore?: number
//   fallbackReason?: string
// }

// // ============================================================================
// // ENHANCED CIRCUIT BREAKER
// // ============================================================================

// class VoiceflowCircuitBreaker {
//   private failures = 0
//   private successes = 0
//   private lastFailureTime = 0
//   private state: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED"
//   private healthScore = 1.0

//   constructor(
//     private maxFailures = 5,
//     private resetTimeout = 60000,
//     private healthThreshold = 0.7,
//   ) {}

//   async execute<T>(operation: () => Promise<T>): Promise<T> {
//     if (this.state === "OPEN") {
//       if (Date.now() - this.lastFailureTime > this.resetTimeout) {
//         this.state = "HALF_OPEN"
//         Logger.info("🔄 Circuit breaker moving to HALF_OPEN state")
//       } else {
//         throw new Error(`Circuit breaker is OPEN. Health score: ${this.healthScore.toFixed(2)}`)
//       }
//     }

//     try {
//       const result = await operation()
//       this.onSuccess()
//       return result
//     } catch (error) {
//       this.onFailure()
//       throw error
//     }
//   }

//   private onSuccess(): void {
//     this.successes++
//     this.state = "CLOSED"
//     const totalOperations = this.successes + this.failures
//     this.healthScore = totalOperations > 0 ? this.successes / totalOperations : 1.0

//     if (this.successes >= 10) {
//       this.failures = Math.max(0, this.failures - 1)
//     }

//     Logger.success(`Voiceflow operation successful. Health score: ${this.healthScore.toFixed(2)}`)
//   }

//   private onFailure(): void {
//     this.failures++
//     this.lastFailureTime = Date.now()
//     const totalOperations = this.successes + this.failures
//     this.healthScore = totalOperations > 0 ? this.successes / totalOperations : 0.0

//     if (this.failures >= this.maxFailures || this.healthScore < this.healthThreshold) {
//       this.state = "OPEN"
//       Logger.error(`Circuit breaker OPEN. Failures: ${this.failures}, Health: ${this.healthScore.toFixed(2)}`)
//     }
//   }

//   getHealthScore(): number {
//     return this.healthScore
//   }

//   getState(): string {
//     return this.state
//   }
// }

// // ============================================================================
// // CACHE MANAGEMENT
// // ============================================================================

// class VoiceflowCacheManager {
//   private userCreationCache = new Map<string, { promise: Promise<boolean>; timestamp: number }>()
//   private sessionCache = new Map<string, { hasLaunched: boolean; timestamp: number }>()

//   cleanExpiredEntries(): void {
//     const now = Date.now()

//     // Clean user creation cache
//     this.userCreationCache.forEach((value, key) => {
//       if (now - value.timestamp > CONFIG.CACHE_TTL.USER_CREATION) {
//         this.userCreationCache.delete(key)
//       }
//     })

//     // Clean session cache
//     this.sessionCache.forEach((value, key) => {
//       if (now - value.timestamp > CONFIG.CACHE_TTL.SESSION) {
//         this.sessionCache.delete(key)
//       }
//     })
//   }

//   getUserCreation(userId: string): Promise<boolean> | undefined {
//     return this.userCreationCache.get(userId)?.promise
//   }

//   setUserCreation(userId: string, promise: Promise<boolean>): void {
//     this.userCreationCache.set(userId, { promise, timestamp: Date.now() })
//   }

//   removeUserCreation(userId: string): void {
//     this.userCreationCache.delete(userId)
//   }

//   getSession(userId: string): { hasLaunched: boolean; timestamp: number } | undefined {
//     return this.sessionCache.get(userId)
//   }

//   setSession(userId: string, hasLaunched: boolean): void {
//     this.sessionCache.set(userId, { hasLaunched, timestamp: Date.now() })
//   }

//   removeSession(userId: string): void {
//     this.sessionCache.delete(userId)
//   }

//   getCacheStats(): { userCreationSize: number; sessionSize: number } {
//     return {
//       userCreationSize: this.userCreationCache.size,
//       sessionSize: this.sessionCache.size,
//     }
//   }
// }

// // ============================================================================
// // LOGGER UTILITY
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
// }

// // ============================================================================
// // GLOBAL INSTANCES
// // ============================================================================

// const circuitBreaker = new VoiceflowCircuitBreaker()
// const cacheManager = new VoiceflowCacheManager()

// // ============================================================================
// // BUSINESS VARIABLES FETCHER
// // ============================================================================

// export async function fetchEnhancedBusinessVariables(
//   businessId: string,
//   automationId: string,
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

//     // Handle business data
//     if (
//       businessResult.status === "rejected" ||
//       businessResult.value.status !== 200 ||
//       !businessResult.value.data.business
//     ) {
//       throw new Error(`Failed to fetch business data`)
//     }

//     const businessData: BusinessData = businessResult.value.data.business

//     const result: Record<string, string> = {
//       // Core business information
//       business_profile: profileContent,
//       business_name: businessContext.businessName || businessData.businessName || "Default Business Name",
//       welcome_message: businessContext.welcomeMessage || businessData.welcomeMessage || "Welcome!",
//       business_industry: businessContext.industry || businessData.industry || "General",
//       business_type: businessData.businessType || "General",
//       business_description: businessContext.businessDescription || businessData.businessDescription || "",
//       instagram_handle: businessData.instagramHandle || "",
//       response_language: businessContext.responseLanguage || businessData.responseLanguage || "English",
//       business_hours: businessData.businessHours || "Not specified",
//       auto_reply_enabled: businessData.autoReplyEnabled ? "Yes" : "No",
//       promotion_message: businessContext.promotionMessage || businessData.promotionMessage || "",
//       target_audience: businessContext.targetAudience || businessData.targetAudience || "",
//       website: businessData.website || "",

//       // Customer data placeholders
//       customer_name: "",
//       customer_email: "",
//       customer_phone: "",
//     }

//     // Add conversation context
//     if (conversationContext) {
//       result.customer_type = conversationContext.customerType
//       result.is_new_user = conversationContext.isNewUser.toString()
//       result.current_message = conversationContext.userMessage
//       result.conversation_history = conversationContext.messageHistory
//         .slice(-5)
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
//     }

//     // Parse JSON fields safely
//     const jsonFields = [
//       { field: businessData.automationGoals, keys: ["primary_goal", "response_time", "custom_goals"] },
//       { field: businessData.customerJourney, keys: ["journey_steps"] },
//       { field: businessData.features, keys: ["enabled_features"] },
//     ]

//     jsonFields.forEach(({ field, keys }) => {
//       if (field) {
//         try {
//           const parsed = typeof field === "string" ? JSON.parse(field) : (field as Record<string, any>)
//           keys.forEach((key) => {
//             if (key === "journey_steps") {
//               result[key] = JSON.stringify(parsed.journeySteps || [])
//             } else if (key === "enabled_features") {
//               result[key] =
//                 parsed.features
//                   ?.filter((f: any) => f.enabled)
//                   .map((f: any) => f.name)
//                   .join(", ") || ""
//             } else {
//               result[key] = parsed[key.replace("_", "")] || ""
//             }
//           })
//         } catch (e) {
//           Logger.error(`Error parsing ${keys[0]}:`, e)
//         }
//       }
//     })

//     // Add remaining fields
//     if (businessData.businessTypeData) {
//       result.business_type_data = JSON.stringify(businessData.businessTypeData)
//     }
//     if (businessData.websiteAnalysis) {
//       result.website_analysis = JSON.stringify(businessData.websiteAnalysis)
//     }

//     result.automation_setup_complete = businessData.automationSetupComplete ? "Yes" : "No"
//     result.automation_setup_date = businessData.automationSetupDate?.toISOString() || ""
//     result.automation_additional_notes = businessData.automationAdditionalNotes || ""
//     result.system_timestamp = new Date().toISOString()
//     result.voiceflow_health_score = circuitBreaker.getHealthScore().toFixed(2)

//     Logger.success("✅ Enhanced business variables prepared")
//     return result
//   } catch (error) {
//     Logger.error("❌ Error in fetchEnhancedBusinessVariables:", error)
//     throw error
//   }
// }

// // ============================================================================
// // VOICEFLOW RESPONSE PROCESSOR
// // ============================================================================

// export function processEnhancedVoiceflowResponse(traces: VoiceflowTrace[]): {
//   text: string
//   quickReplies?: { title: string; payload: string }[]
//   requiresHumanHandoff?: boolean
//   priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
//   sentiment?: "positive" | "neutral" | "negative"
//   complexity?: "simple" | "medium" | "complex"
// } {
//   let result = ""
//   const quickReplies: { title: string; payload: string }[] = []
//   let requiresHumanHandoff = false
//   let priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT" = "MEDIUM"
//   let sentiment: "positive" | "neutral" | "negative" = "neutral"
//   let complexity: "simple" | "medium" | "complex" = "medium"

//   for (const trace of traces) {
//     switch (trace.type) {
//       case "speak":
//       case "text":
//         if ("message" in trace.payload) {
//           const message = trace.payload.message
//           result += message + "\n"

//           // Analyze complexity
//           if (message.length > 200 || message.split(".").length > 3) {
//             complexity = "complex"
//           } else if (message.length < 50) {
//             complexity = "simple"
//           }
//         }
//         break

//       case "choice":
//         if ("buttons" in trace.payload && Array.isArray(trace.payload.buttons)) {
//           trace.payload.buttons.forEach((button: VoiceflowButton) => {
//             // Ensure we always have a valid title
//             let title = button.name || "Option"

//             // Trim to Instagram limits and ensure it's not empty
//             title = title.trim()
//             if (title.length === 0) {
//               title = "Select"
//             }

//             if (title.length > CONFIG.INSTAGRAM.QUICK_REPLY_TITLE_LIMIT) {
//               title = title.substring(0, CONFIG.INSTAGRAM.QUICK_REPLY_TITLE_LIMIT - 3) + "..."
//             }

//             quickReplies.push({
//               title,
//               payload: button.request?.payload || button.name || title,
//             })
//           })
//         }
//         break

//       case "visual":
//         if ("image" in trace.payload) {
//           result += `📷 Image: ${trace.payload.image}\n`
//         }
//         break

//       case "card":
//         if (trace.payload) {
//           if ("title" in trace.payload) {
//             result += `*${trace.payload.title}*\n`
//           }
//           if ("description" in trace.payload) {
//             result += `${trace.payload.description}\n`
//           }
//         }
//         break

//       case "end":
//         result += "\n[Conversation ended]"
//         break

//       case "handoff":
//         requiresHumanHandoff = true
//         priority = "HIGH"
//         if ("reason" in trace.payload) {
//           result += `\n[Escalating to human agent: ${trace.payload.reason}]\n`
//         }
//         break

//       case "priority":
//         if ("level" in trace.payload) {
//           priority = trace.payload.level
//         }
//         break

//       case "sentiment":
//         if ("value" in trace.payload) {
//           sentiment = trace.payload.value
//         }
//         break

//       case "path":
//         // Handle the path trace type that was causing issues
//         if ("path" in trace.payload) {
//           Logger.debug(`Path trace detected: ${trace.payload.path}`)
//           if (trace.payload.path === "reprompt") {
//             result += "Could you please provide more details about what you're looking for?\n"
//           }
//         }
//         break

//       case "debug":
//         Logger.debug("Voiceflow debug:", trace.payload)
//         break

//       default:
//         Logger.warning(`Unhandled trace type: ${trace.type}`, trace)
//         break
//     }
//   }

//   // Auto-detect sentiment
//   if (sentiment === "neutral") {
//     const text = result.toLowerCase()
//     if (text.includes("sorry") || text.includes("apologize") || text.includes("unfortunately")) {
//       sentiment = "negative"
//     } else if (
//       text.includes("great") ||
//       text.includes("excellent") ||
//       text.includes("wonderful") ||
//       text.includes("thank")
//     ) {
//       sentiment = "positive"
//     }
//   }

//   // Trim to Instagram limits
//   let finalText = result.trim()
//   if (finalText.length > CONFIG.INSTAGRAM.MESSAGE_LIMIT) {
//     finalText = finalText.substring(0, CONFIG.INSTAGRAM.MESSAGE_LIMIT - 3) + "..."
//   }

//   const limitedQuickReplies = quickReplies.slice(0, CONFIG.INSTAGRAM.QUICK_REPLY_LIMIT)

//   return {
//     text: finalText,
//     quickReplies: limitedQuickReplies.length > 0 ? limitedQuickReplies : undefined,
//     requiresHumanHandoff,
//     priority,
//     sentiment,
//     complexity,
//   }
// }

// // ============================================================================
// // FALLBACK DETECTION
// // ============================================================================

// function detectFallbackConditions(
//   response: any,
//   userInput: string,
// ): { shouldFallback: boolean; reason: string; isEmpty: boolean } {
//   if (!response.text || response.text.trim().length === 0) {
//     return { shouldFallback: true, reason: "Empty response from Voiceflow", isEmpty: true }
//   }

//   const genericResponses = [
//     "i don't understand",
//     "sorry, i didn't get that",
//     "can you repeat that",
//     "i'm not sure what you mean",
//     "error",
//     "something went wrong",
//     "please try again",
//     "system error",
//     "unable to process",
//   ]

//   const responseText = response.text.toLowerCase()
//   const isGeneric = genericResponses.some((generic) => responseText.includes(generic))

//   if (isGeneric) {
//     return { shouldFallback: true, reason: `Generic response detected: "${response.text}"`, isEmpty: false }
//   }

//   if (response.text.length < 10 && !response.quickReplies?.length) {
//     return { shouldFallback: true, reason: "Response too short without buttons", isEmpty: false }
//   }

//   return { shouldFallback: false, reason: "", isEmpty: false }
// }

// // ============================================================================
// // MAIN VOICEFLOW HANDLER
// // ============================================================================

// export async function getEnhancedVoiceflowResponse(
//   userInput: string,
//   userId: string,
//   businessVariables: Record<string, string>,
//   options?: {
//     maxRetries?: number
//     timeoutMs?: number
//     enableFallbackDetection?: boolean
//     isFirstMessage?: boolean
//   },
// ): Promise<VoiceflowResponse> {
//   const {
//     maxRetries = CONFIG.RETRY.MAX_ATTEMPTS,
//     timeoutMs = CONFIG.TIMEOUTS.INTERACTION,
//     enableFallbackDetection = true,
//     isFirstMessage = false,
//   } = options || {}

//   try {
//     const result = await circuitBreaker.execute(async () => {
//       let lastError: Error | null = null

//       // Clean expired cache entries
//       cacheManager.cleanExpiredEntries()

//       for (let attempt = 1; attempt <= maxRetries; attempt++) {
//         try {
//           Logger.info(`🎙️ Voiceflow API attempt ${attempt}/${maxRetries} for user ${userId}`)

//           // Check session state
//           const sessionData = cacheManager.getSession(userId)
//           const needsLaunch = isFirstMessage || !sessionData?.hasLaunched

//           // Prepare request payload
//           let requestPayload: any
//           if (needsLaunch) {
//             Logger.info(`🚀 Sending launch request for user ${userId}`)
//             requestPayload = {
//               action: { type: "launch" },
//               config: {
//                 tts: false,
//                 stripSSML: true,
//                 stopAll: true,
//                 excludeTypes: ["block", "debug", "flow"],
//               },
//             }
//           } else {
//             requestPayload = {
//               action: { type: "text", payload: userInput },
//               config: {
//                 tts: false,
//                 stripSSML: true,
//                 stopAll: true,
//                 excludeTypes: ["block", "debug", "flow"],
//               },
//             }
//           }

//           // Add business variables
//           if (Object.keys(businessVariables).length > 0) {
//             requestPayload.state = { variables: businessVariables }
//           }

//           // Make API call
//           const response = await axios.post<VoiceflowTrace[]>(
//             `https://general-runtime.voiceflow.com/state/user/${userId}/interact`,
//             requestPayload,
//             {
//               headers: {
//                 Authorization: CONFIG.API_KEY,
//                 versionID: CONFIG.VERSION_ID,
//                 accept: "application/json",
//                 "content-type": "application/json",
//               },
//               timeout: timeoutMs,
//             },
//           )

//           // Handle launch + text sequence
//           if (needsLaunch && userInput.trim().length > 0) {
//             Logger.info(`📝 Following up with text request for user ${userId}`)
//             const textResponse = await axios.post<VoiceflowTrace[]>(
//               `https://general-runtime.voiceflow.com/state/user/${userId}/interact`,
//               {
//                 action: { type: "text", payload: userInput },
//                 config: {
//                   tts: false,
//                   stripSSML: true,
//                   stopAll: true,
//                   excludeTypes: ["block", "debug", "flow"],
//                 },
//               },
//               {
//                 headers: {
//                   Authorization: CONFIG.API_KEY,
//                   versionID: CONFIG.VERSION_ID,
//                   accept: "application/json",
//                   "content-type": "application/json",
//                 },
//                 timeout: timeoutMs,
//               },
//             )
//             response.data = textResponse.data
//           }

//           // Mark session as launched
//           cacheManager.setSession(userId, true)

//           // Process response
//           const processedResponse = processEnhancedVoiceflowResponse(response.data)
//           const updatedVariables = await fetchVoiceflowVariables(userId)

//           // Fallback detection
//           if (enableFallbackDetection) {
//             const fallbackCheck = detectFallbackConditions(processedResponse, userInput)
//             if (fallbackCheck.shouldFallback) {
//               Logger.warning(`Voiceflow fallback condition detected: ${fallbackCheck.reason}`)
//               return {
//                 success: false,
//                 error: fallbackCheck.reason,
//                 isEmpty: fallbackCheck.isEmpty,
//                 fallbackReason: fallbackCheck.reason,
//                 healthScore: circuitBreaker.getHealthScore(),
//               }
//             }
//           }

//           Logger.success(`Voiceflow API success on attempt ${attempt}`)
//           return {
//             success: true,
//             response: processedResponse,
//             variables: updatedVariables,
//             healthScore: circuitBreaker.getHealthScore(),
//           }
//         } catch (error) {
//           lastError = error as Error
//           Logger.error(`Voiceflow API attempt ${attempt} failed:`, error)

//           if (attempt < maxRetries) {
//             const baseDelay = Math.pow(2, attempt) * CONFIG.RETRY.BASE_DELAY
//             const jitter = Math.random() * CONFIG.RETRY.MAX_JITTER
//             const delay = baseDelay + jitter

//             Logger.info(`⏳ Retrying Voiceflow API in ${Math.round(delay)}ms...`)
//             await new Promise((resolve) => setTimeout(resolve, delay))
//           }
//         }
//       }

//       throw lastError || new Error("Failed to get Voiceflow response after all retries")
//     })

//     return result
//   } catch (error) {
//     Logger.error("💥 Voiceflow circuit breaker or final error:", error)
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : String(error),
//       healthScore: circuitBreaker.getHealthScore(),
//       fallbackReason: "Circuit breaker open or API failure",
//     }
//   }
// }

// // ============================================================================
// // UTILITY FUNCTIONS
// // ============================================================================

// async function fetchVoiceflowVariables(userId: string): Promise<VoiceflowVariables> {
//   const maxRetries = 2

//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       const response = await axios.get<{ variables: VoiceflowVariables }>(
//         `https://general-runtime.voiceflow.com/state/user/${userId}`,
//         {
//           headers: {
//             Authorization: CONFIG.API_KEY,
//             versionID: CONFIG.VERSION_ID,
//             accept: "application/json",
//           },
//           timeout: CONFIG.TIMEOUTS.VARIABLES,
//         },
//       )
//       return response.data.variables || {}
//     } catch (error) {
//       Logger.error(`Error fetching Voiceflow variables (attempt ${attempt}):`, error)
//       if (attempt < maxRetries) {
//         await new Promise((resolve) => setTimeout(resolve, 2000))
//       }
//     }
//   }

//   Logger.warning("Failed to fetch Voiceflow variables, returning empty object")
//   return {}
// }

// export async function createVoiceflowUser(userId: string): Promise<boolean> {
//   cacheManager.cleanExpiredEntries()

//   const existingPromise = cacheManager.getUserCreation(userId)
//   if (existingPromise) {
//     Logger.info(`User creation already in progress for ${userId}`)
//     return await existingPromise
//   }

//   const creationPromise = Promise.resolve(true) // Voiceflow auto-creates users
//   cacheManager.setUserCreation(userId, creationPromise)

//   Logger.success(`✅ Voiceflow user will be auto-created on first interaction: ${userId}`)

//   setTimeout(() => {
//     cacheManager.removeUserCreation(userId)
//   }, 10000)

//   return true
// }

// export async function resetVoiceflowUser(userId: string): Promise<boolean> {
//   try {
//     const response = await axios.post(
//       `https://general-runtime.voiceflow.com/state/user/${userId}/interact`,
//       {
//         action: { type: "reset" },
//         config: {
//           tts: false,
//           stripSSML: true,
//           stopAll: true,
//           excludeTypes: ["block", "debug", "flow"],
//         },
//       },
//       {
//         headers: {
//           Authorization: CONFIG.API_KEY,
//           versionID: CONFIG.VERSION_ID,
//           accept: "application/json",
//           "content-type": "application/json",
//         },
//         timeout: CONFIG.TIMEOUTS.USER_CREATION,
//       },
//     )

//     cacheManager.removeSession(userId)
//     Logger.success(`🔄 Voiceflow user reset successfully: ${userId}`)
//     return response.status === 200
//   } catch (error) {
//     Logger.error("Error resetting Voiceflow user:", error)
//     return false
//   }
// }

// export function extractBasicCustomerData(variables: Record<string, any>) {
//   return {
//     name: variables.customer_name || variables.clientname || variables.name || null,
//     email: variables.customer_email || variables.clientemail || variables.email || null,
//     phone: variables.customer_phone || variables.clientphone || variables.phone || null,
//   }
// }

// export function formatForInstagramDM(response: {
//   text: string
//   quickReplies?: { title: string; payload: string }[]
// }): {
//   text: string
//   quick_replies?: Array<{
//     content_type: "text"
//     title: string
//     payload: string
//   }>
// } {
//   const result: any = { text: response.text }

//   if (response.quickReplies && response.quickReplies.length > 0) {
//     result.quick_replies = response.quickReplies.map((reply) => ({
//       content_type: "text",
//       title: reply.title,
//       payload: reply.payload,
//     }))
//   }

//   return result
// }

// export function getVoiceflowHealth(): {
//   healthScore: number
//   circuitBreakerState: string
//   cacheStats: { userCreationSize: number; sessionSize: number }
// } {
//   return {
//     healthScore: circuitBreaker.getHealthScore(),
//     circuitBreakerState: circuitBreaker.getState(),
//     cacheStats: cacheManager.getCacheStats(),
//   }
// }















// import axios from "axios"
// import { getBusinessForWebhook } from "@/actions/businfo"
// import { getBusinessProfileForAutomation } from "@/actions/webhook/business-profile"
// import type { VoiceflowVariables } from "@/types/voiceflow"
// import type { JsonValue } from "@prisma/client/runtime/library"

// // ============================================================================
// // CONFIGURATION & CONSTANTS
// // ============================================================================

// const CONFIG = {
//   API_KEY: process.env.VOICEFLOW_API_KEY!,
//   PROJECT_ID: process.env.VOICEFLOW_PROJECT_ID!,
//   VERSION_ID: process.env.VOICEFLOW_VERSION_ID!,
//   TIMEOUTS: {
//     INTERACTION: 15000,
//     VARIABLES: 8000,
//     USER_CREATION: 12000,
//   },
//   RETRY: {
//     MAX_ATTEMPTS: 3,
//     BASE_DELAY: 1000,
//     MAX_JITTER: 1000,
//   },
//   CACHE_TTL: {
//     USER_CREATION: 300000, // 5 minutes
//     SESSION: 1800000, // 30 minutes
//   },
//   INSTAGRAM: {
//     MESSAGE_LIMIT: 1000,
//     QUICK_REPLY_LIMIT: 13,
//     QUICK_REPLY_TITLE_LIMIT: 20,
//   },
// } as const

// // ============================================================================
// // TYPES & INTERFACES
// // ============================================================================

// interface VoiceflowTrace {
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

// interface ConversationContext {
//   pageId: string
//   senderId: string
//   userMessage: string
//   isNewUser: boolean
//   customerType: string
//   messageHistory: Array<{ role: "user" | "assistant"; content: string }>
// }

// interface VoiceflowResponse {
//   success: boolean
//   response?: {
//     text: string
//     quickReplies?: Array<{ title: string; payload: string }>
//     requiresHumanHandoff?: boolean
//     priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
//     sentiment?: "positive" | "neutral" | "negative"
//     complexity?: "simple" | "medium" | "complex"
//   }
//   variables?: VoiceflowVariables
//   error?: string
//   isEmpty?: boolean
//   healthScore?: number
//   fallbackReason?: string
// }

// // ============================================================================
// // ENHANCED CIRCUIT BREAKER
// // ============================================================================

// class VoiceflowCircuitBreaker {
//   private failures = 0
//   private successes = 0
//   private lastFailureTime = 0
//   private state: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED"
//   private healthScore = 1.0

//   constructor(
//     private maxFailures = 5,
//     private resetTimeout = 60000,
//     private healthThreshold = 0.7,
//   ) {}

//   async execute<T>(operation: () => Promise<T>): Promise<T> {
//     if (this.state === "OPEN") {
//       if (Date.now() - this.lastFailureTime > this.resetTimeout) {
//         this.state = "HALF_OPEN"
//         Logger.info("🔄 Circuit breaker moving to HALF_OPEN state")
//       } else {
//         throw new Error(`Circuit breaker is OPEN. Health score: ${this.healthScore.toFixed(2)}`)
//       }
//     }

//     try {
//       const result = await operation()
//       this.onSuccess()
//       return result
//     } catch (error) {
//       this.onFailure()
//       throw error
//     }
//   }

//   private onSuccess(): void {
//     this.successes++
//     this.state = "CLOSED"
//     const totalOperations = this.successes + this.failures
//     this.healthScore = totalOperations > 0 ? this.successes / totalOperations : 1.0

//     if (this.successes >= 10) {
//       this.failures = Math.max(0, this.failures - 1)
//     }

//     Logger.success(`Voiceflow operation successful. Health score: ${this.healthScore.toFixed(2)}`)
//   }

//   private onFailure(): void {
//     this.failures++
//     this.lastFailureTime = Date.now()
//     const totalOperations = this.successes + this.failures
//     this.healthScore = totalOperations > 0 ? this.successes / totalOperations : 0.0

//     if (this.failures >= this.maxFailures || this.healthScore < this.healthThreshold) {
//       this.state = "OPEN"
//       Logger.error(`Circuit breaker OPEN. Failures: ${this.failures}, Health: ${this.healthScore.toFixed(2)}`)
//     }
//   }

//   getHealthScore(): number {
//     return this.healthScore
//   }

//   getState(): string {
//     return this.state
//   }
// }

// // ============================================================================
// // CACHE MANAGEMENT
// // ============================================================================

// class VoiceflowCacheManager {
//   private userCreationCache = new Map<string, { promise: Promise<boolean>; timestamp: number }>()
//   private sessionCache = new Map<string, { hasLaunched: boolean; timestamp: number }>()

//   cleanExpiredEntries(): void {
//     const now = Date.now()

//     // Clean user creation cache
//     this.userCreationCache.forEach((value, key) => {
//       if (now - value.timestamp > CONFIG.CACHE_TTL.USER_CREATION) {
//         this.userCreationCache.delete(key)
//       }
//     })

//     // Clean session cache
//     this.sessionCache.forEach((value, key) => {
//       if (now - value.timestamp > CONFIG.CACHE_TTL.SESSION) {
//         this.sessionCache.delete(key)
//       }
//     })
//   }

//   getUserCreation(userId: string): Promise<boolean> | undefined {
//     return this.userCreationCache.get(userId)?.promise
//   }

//   setUserCreation(userId: string, promise: Promise<boolean>): void {
//     this.userCreationCache.set(userId, { promise, timestamp: Date.now() })
//   }

//   removeUserCreation(userId: string): void {
//     this.userCreationCache.delete(userId)
//   }

//   getSession(userId: string): { hasLaunched: boolean; timestamp: number } | undefined {
//     return this.sessionCache.get(userId)
//   }

//   setSession(userId: string, hasLaunched: boolean): void {
//     this.sessionCache.set(userId, { hasLaunched, timestamp: Date.now() })
//   }

//   removeSession(userId: string): void {
//     this.sessionCache.delete(userId)
//   }

//   getCacheStats(): { userCreationSize: number; sessionSize: number } {
//     return {
//       userCreationSize: this.userCreationCache.size,
//       sessionSize: this.sessionCache.size,
//     }
//   }
// }

// // ============================================================================
// // LOGGER UTILITY
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
// }

// // ============================================================================
// // GLOBAL INSTANCES
// // ============================================================================

// const circuitBreaker = new VoiceflowCircuitBreaker()
// const cacheManager = new VoiceflowCacheManager()

// // ============================================================================
// // BUSINESS VARIABLES FETCHER
// // ============================================================================

// export async function fetchEnhancedBusinessVariables(
//   businessId: string,
//   automationId: string,
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

//     // Handle business data with better error handling
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

//     // Build robust fallback variables
//     const result: Record<string, string> = {
//       // Core business information with multiple fallbacks
//       business_profile: profileContent || "Professional business assistant",
//       business_name: businessContext.businessName || businessData?.businessName || "Our Business",
//       welcome_message:
//         businessContext.welcomeMessage || businessData?.welcomeMessage || "Hello! How can I help you today?",
//       business_industry: businessContext.industry || businessData?.industry || "Customer Service",
//       business_type: businessData?.businessType || "Service Business",
//       business_description:
//         businessContext.businessDescription ||
//         businessData?.businessDescription ||
//         "We provide excellent customer service",
//       instagram_handle: businessData?.instagramHandle || "",
//       response_language: businessContext.responseLanguage || businessData?.responseLanguage || "English",
//       business_hours: businessData?.businessHours || "24/7",
//       auto_reply_enabled: businessData?.autoReplyEnabled ? "Yes" : "Yes", // Default to Yes
//       promotion_message:
//         businessContext.promotionMessage || businessData?.promotionMessage || "Thank you for contacting us!",
//       target_audience: businessContext.targetAudience || businessData?.targetAudience || "Valued customers",
//       website: businessData?.website || "",

//       // Customer data placeholders
//       customer_name: "",
//       customer_email: "",
//       customer_phone: "",

//       // System status
//       system_status: "operational",
//       fallback_mode: businessData ? "false" : "true",
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
//           } catch (e) {
//             Logger.error(`Error parsing ${keys[0]}:`, e)
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
//     }
//   }
// }

// // ============================================================================
// // VOICEFLOW RESPONSE PROCESSOR
// // ============================================================================

// export function processEnhancedVoiceflowResponse(traces: VoiceflowTrace[]): {
//   text: string
//   quickReplies?: { title: string; payload: string }[]
//   requiresHumanHandoff?: boolean
//   priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
//   sentiment?: "positive" | "neutral" | "negative"
//   complexity?: "simple" | "medium" | "complex"
// } {
//   let result = ""
//   const quickReplies: { title: string; payload: string }[] = []
//   let requiresHumanHandoff = false
//   let priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT" = "MEDIUM"
//   let sentiment: "positive" | "neutral" | "negative" = "neutral"
//   let complexity: "simple" | "medium" | "complex" = "medium"

//   for (const trace of traces) {
//     switch (trace.type) {
//       case "speak":
//       case "text":
//         if ("message" in trace.payload) {
//           const message = trace.payload.message
//           result += message + "\n"

//           // Analyze complexity
//           if (message.length > 200 || message.split(".").length > 3) {
//             complexity = "complex"
//           } else if (message.length < 50) {
//             complexity = "simple"
//           }
//         }
//         break

//       case "choice":
//         if ("buttons" in trace.payload && Array.isArray(trace.payload.buttons)) {
//           trace.payload.buttons.forEach((button: VoiceflowButton) => {
//             // Ensure we always have a valid title
//             let title = button.name || "Option"

//             // Trim to Instagram limits and ensure it's not empty
//             title = title.trim()
//             if (title.length === 0) {
//               title = "Select"
//             }

//             if (title.length > CONFIG.INSTAGRAM.QUICK_REPLY_TITLE_LIMIT) {
//               title = title.substring(0, CONFIG.INSTAGRAM.QUICK_REPLY_TITLE_LIMIT - 3) + "..."
//             }

//             quickReplies.push({
//               title,
//               payload: button.request?.payload || button.name || title,
//             })
//           })
//         }
//         break

//       case "visual":
//         if ("image" in trace.payload) {
//           result += `📷 Image: ${trace.payload.image}\n`
//         }
//         break

//       case "card":
//         if (trace.payload) {
//           if ("title" in trace.payload) {
//             result += `*${trace.payload.title}*\n`
//           }
//           if ("description" in trace.payload) {
//             result += `${trace.payload.description}\n`
//           }
//         }
//         break

//       case "end":
//         result += "\n[Conversation ended]"
//         break

//       case "handoff":
//         requiresHumanHandoff = true
//         priority = "HIGH"
//         if ("reason" in trace.payload) {
//           result += `\n[Escalating to human agent: ${trace.payload.reason}]\n`
//         }
//         break

//       case "priority":
//         if ("level" in trace.payload) {
//           priority = trace.payload.level
//         }
//         break

//       case "sentiment":
//         if ("value" in trace.payload) {
//           sentiment = trace.payload.value
//         }
//         break

//       case "path":
//         // Handle the path trace type
//         if ("path" in trace.payload) {
//           Logger.debug(`Path trace detected: ${trace.payload.path}`)
//           // Don't add any text for path traces - they're just flow control
//         }
//         break

//       case "debug":
//         Logger.debug("Voiceflow debug:", trace.payload)
//         break

//       case "knowledgeBase":
//         // COMPLETELY IGNORE KNOWLEDGE BASE TRACES
//         Logger.debug("Ignoring knowledgeBase trace - workflow responses only")
//         break

//       default:
//         Logger.warning(`Unhandled trace type: ${trace.type}`, trace)
//         break
//     }
//   }

//   // If we only got knowledge base traces and no actual workflow content, return empty
//   if (!result.trim()) {
//     Logger.warning("No workflow content found - only knowledge base traces detected")
//     return {
//       text: "",
//       quickReplies: undefined,
//       requiresHumanHandoff: false,
//       priority: "LOW",
//       sentiment: "neutral",
//       complexity: "simple",
//     }
//   }

//   // Auto-detect sentiment
//   if (sentiment === "neutral") {
//     const text = result.toLowerCase()
//     if (text.includes("sorry") || text.includes("apologize") || text.includes("unfortunately")) {
//       sentiment = "negative"
//     } else if (
//       text.includes("great") ||
//       text.includes("excellent") ||
//       text.includes("wonderful") ||
//       text.includes("thank")
//     ) {
//       sentiment = "positive"
//     }
//   }

//   // Trim to Instagram limits
//   let finalText = result.trim()
//   if (finalText.length > CONFIG.INSTAGRAM.MESSAGE_LIMIT) {
//     finalText = finalText.substring(0, CONFIG.INSTAGRAM.MESSAGE_LIMIT - 3) + "..."
//   }

//   const limitedQuickReplies = quickReplies.slice(0, CONFIG.INSTAGRAM.QUICK_REPLY_LIMIT)

//   return {
//     text: finalText,
//     quickReplies: limitedQuickReplies.length > 0 ? limitedQuickReplies : undefined,
//     requiresHumanHandoff,
//     priority,
//     sentiment,
//     complexity,
//   }
// }

// // ============================================================================
// // FALLBACK DETECTION
// // ============================================================================

// function detectFallbackConditions(
//   response: any,
//   userInput: string,
// ): { shouldFallback: boolean; reason: string; isEmpty: boolean } {
//   if (!response.text || response.text.trim().length === 0) {
//     return { shouldFallback: true, reason: "Empty response from Voiceflow", isEmpty: true }
//   }

//   // Check if this is a greeting - be more lenient with generic responses for greetings
//   const isGreeting = /^(hi|hello|hey|good morning|good afternoon|good evening)$/i.test(userInput.trim())

//   const genericResponses = [
//     "i don't understand",
//     "sorry, i didn't get that",
//     "can you repeat that",
//     "i'm not sure what you mean",
//     "error",
//     "something went wrong",
//     "please try again",
//     "system error",
//     "unable to process",
//   ]

//   const responseText = response.text.toLowerCase()
//   const isGeneric = genericResponses.some((generic) => responseText.includes(generic))

//   // For greetings, only fallback if it's a very generic error response
//   if (isGreeting && isGeneric) {
//     const isVeryGeneric =
//       responseText.includes("error") || responseText.includes("system") || responseText.includes("something went wrong")
//     if (!isVeryGeneric) {
//       Logger.info("Allowing generic response for greeting")
//       return { shouldFallback: false, reason: "", isEmpty: false }
//     }
//   }

//   if (isGeneric) {
//     return { shouldFallback: true, reason: `Generic response detected: "${response.text}"`, isEmpty: false }
//   }

//   if (response.text.length < 10 && !response.quickReplies?.length) {
//     return { shouldFallback: true, reason: "Response too short without buttons", isEmpty: false }
//   }

//   return { shouldFallback: false, reason: "", isEmpty: false }
// }

// // ============================================================================
// // MAIN VOICEFLOW HANDLER
// // ============================================================================

// export async function getEnhancedVoiceflowResponse(
//   userInput: string,
//   userId: string,
//   businessVariables: Record<string, string>,
//   options?: {
//     maxRetries?: number
//     timeoutMs?: number
//     enableFallbackDetection?: boolean
//     isFirstMessage?: boolean
//   },
// ): Promise<VoiceflowResponse> {
//   const {
//     maxRetries = CONFIG.RETRY.MAX_ATTEMPTS,
//     timeoutMs = CONFIG.TIMEOUTS.INTERACTION,
//     enableFallbackDetection = true,
//     isFirstMessage = false,
//   } = options || {}

//   try {
//     const result = await circuitBreaker.execute(async () => {
//       let lastError: Error | null = null

//       // Clean expired cache entries
//       cacheManager.cleanExpiredEntries()

//       for (let attempt = 1; attempt <= maxRetries; attempt++) {
//         try {
//           Logger.info(`🎙️ Voiceflow API attempt ${attempt}/${maxRetries} for user ${userId}`)

//           // Check session state
//           const sessionData = cacheManager.getSession(userId)
//           const needsLaunch = isFirstMessage || !sessionData?.hasLaunched

//           // Prepare request payload
//           let requestPayload: any
//           if (needsLaunch) {
//             Logger.info(`🚀 Sending launch request for user ${userId}`)
//             requestPayload = {
//               action: { type: "launch" },
//               config: {
//                 tts: false,
//                 stripSSML: true,
//                 stopAll: true,
//                 excludeTypes: ["block", "debug", "flow"],
//               },
//             }
//           } else {
//             requestPayload = {
//               action: { type: "text", payload: userInput },
//               config: {
//                 tts: false,
//                 stripSSML: true,
//                 stopAll: true,
//                 excludeTypes: ["block", "debug", "flow"],
//               },
//             }
//           }

//           // Add business variables
//           if (Object.keys(businessVariables).length > 0) {
//             requestPayload.state = { variables: businessVariables }
//           }

//           // Make API call
//           const response = await axios.post<VoiceflowTrace[]>(
//             `https://general-runtime.voiceflow.com/state/user/${userId}/interact`,
//             requestPayload,
//             {
//               headers: {
//                 Authorization: CONFIG.API_KEY,
//                 versionID: CONFIG.VERSION_ID,
//                 accept: "application/json",
//                 "content-type": "application/json",
//               },
//               timeout: timeoutMs,
//             },
//           )

//           // Handle launch + text sequence
//           if (needsLaunch && userInput.trim().length > 0) {
//             Logger.info(`📝 Following up with text request for user ${userId}`)
//             const textResponse = await axios.post<VoiceflowTrace[]>(
//               `https://general-runtime.voiceflow.com/state/user/${userId}/interact`,
//               {
//                 action: { type: "text", payload: userInput },
//                 config: {
//                   tts: false,
//                   stripSSML: true,
//                   stopAll: true,
//                   excludeTypes: ["block", "debug", "flow"],
//                 },
//               },
//               {
//                 headers: {
//                   Authorization: CONFIG.API_KEY,
//                   versionID: CONFIG.VERSION_ID,
//                   accept: "application/json",
//                   "content-type": "application/json",
//                 },
//                 timeout: timeoutMs,
//               },
//             )
//             response.data = textResponse.data
//           }

//           // Mark session as launched
//           cacheManager.setSession(userId, true)

//           // Process response
//           const processedResponse = processEnhancedVoiceflowResponse(response.data)
//           const updatedVariables = await fetchVoiceflowVariables(userId)

//           // Fallback detection
//           if (enableFallbackDetection) {
//             const fallbackCheck = detectFallbackConditions(processedResponse, userInput)
//             if (fallbackCheck.shouldFallback) {
//               Logger.warning(`Voiceflow fallback condition detected: ${fallbackCheck.reason}`)
//               return {
//                 success: false,
//                 error: fallbackCheck.reason,
//                 isEmpty: fallbackCheck.isEmpty,
//                 fallbackReason: fallbackCheck.reason,
//                 healthScore: circuitBreaker.getHealthScore(),
//               }
//             }
//           }

//           Logger.success(`Voiceflow API success on attempt ${attempt}`)
//           return {
//             success: true,
//             response: processedResponse,
//             variables: updatedVariables,
//             healthScore: circuitBreaker.getHealthScore(),
//           }
//         } catch (error) {
//           lastError = error as Error
//           Logger.error(`Voiceflow API attempt ${attempt} failed:`, error)

//           if (attempt < maxRetries) {
//             const baseDelay = Math.pow(2, attempt) * CONFIG.RETRY.BASE_DELAY
//             const jitter = Math.random() * CONFIG.RETRY.MAX_JITTER
//             const delay = baseDelay + jitter

//             Logger.info(`⏳ Retrying Voiceflow API in ${Math.round(delay)}ms...`)
//             await new Promise((resolve) => setTimeout(resolve, delay))
//           }
//         }
//       }

//       throw lastError || new Error("Failed to get Voiceflow response after all retries")
//     })

//     return result
//   } catch (error) {
//     Logger.error("💥 Voiceflow circuit breaker or final error:", error)
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : String(error),
//       healthScore: circuitBreaker.getHealthScore(),
//       fallbackReason: "Circuit breaker open or API failure",
//     }
//   }
// }

// // ============================================================================
// // UTILITY FUNCTIONS
// // ============================================================================

// async function fetchVoiceflowVariables(userId: string): Promise<VoiceflowVariables> {
//   const maxRetries = 2

//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       const response = await axios.get<{ variables: VoiceflowVariables }>(
//         `https://general-runtime.voiceflow.com/state/user/${userId}`,
//         {
//           headers: {
//             Authorization: CONFIG.API_KEY,
//             versionID: CONFIG.VERSION_ID,
//             accept: "application/json",
//           },
//           timeout: CONFIG.TIMEOUTS.VARIABLES,
//         },
//       )
//       return response.data.variables || {}
//     } catch (error) {
//       Logger.error(`Error fetching Voiceflow variables (attempt ${attempt}):`, error)
//       if (attempt < maxRetries) {
//         await new Promise((resolve) => setTimeout(resolve, 2000))
//       }
//     }
//   }

//   Logger.warning("Failed to fetch Voiceflow variables, returning empty object")
//   return {}
// }

// export async function createVoiceflowUser(userId: string): Promise<boolean> {
//   cacheManager.cleanExpiredEntries()

//   const existingPromise = cacheManager.getUserCreation(userId)
//   if (existingPromise) {
//     Logger.info(`User creation already in progress for ${userId}`)
//     return await existingPromise
//   }

//   const creationPromise = Promise.resolve(true) // Voiceflow auto-creates users
//   cacheManager.setUserCreation(userId, creationPromise)

//   Logger.success(`✅ Voiceflow user will be auto-created on first interaction: ${userId}`)

//   setTimeout(() => {
//     cacheManager.removeUserCreation(userId)
//   }, 10000)

//   return true
// }

// export async function resetVoiceflowUser(userId: string): Promise<boolean> {
//   try {
//     const response = await axios.post(
//       `https://general-runtime.voiceflow.com/state/user/${userId}/interact`,
//       {
//         action: { type: "reset" },
//         config: {
//           tts: false,
//           stripSSML: true,
//           stopAll: true,
//           excludeTypes: ["block", "debug", "flow"],
//         },
//       },
//       {
//         headers: {
//           Authorization: CONFIG.API_KEY,
//           versionID: CONFIG.VERSION_ID,
//           accept: "application/json",
//           "content-type": "application/json",
//         },
//         timeout: CONFIG.TIMEOUTS.USER_CREATION,
//       },
//     )

//     cacheManager.removeSession(userId)
//     Logger.success(`🔄 Voiceflow user reset successfully: ${userId}`)
//     return response.status === 200
//   } catch (error) {
//     Logger.error("Error resetting Voiceflow user:", error)
//     return false
//   }
// }

// export function extractBasicCustomerData(variables: Record<string, any>) {
//   return {
//     name: variables.customer_name || variables.clientname || variables.name || null,
//     email: variables.customer_email || variables.clientemail || variables.email || null,
//     phone: variables.customer_phone || variables.clientphone || variables.phone || null,
//   }
// }

// export function formatForInstagramDM(response: {
//   text: string
//   quickReplies?: { title: string; payload: string }[]
// }): {
//   text: string
//   quick_replies?: Array<{
//     content_type: "text"
//     title: string
//     payload: string
//   }>
// } {
//   const result: any = { text: response.text }

//   if (response.quickReplies && response.quickReplies.length > 0) {
//     result.quick_replies = response.quickReplies.map((reply) => ({
//       content_type: "text",
//       title: reply.title,
//       payload: reply.payload,
//     }))
//   }

//   return result
// }

// export function getVoiceflowHealth(): {
//   healthScore: number
//   circuitBreakerState: string
//   cacheStats: { userCreationSize: number; sessionSize: number }
// } {
//   return {
//     healthScore: circuitBreaker.getHealthScore(),
//     circuitBreakerState: circuitBreaker.getState(),
//     cacheStats: cacheManager.getCacheStats(),
//   }
// }













import axios from "axios"
import { getBusinessForWebhook } from "@/actions/businfo"
import { getBusinessProfileForAutomation } from "@/actions/webhook/business-profile"
import type { VoiceflowVariables } from "@/types/voiceflow"
import type { JsonValue } from "@prisma/client/runtime/library"
import { decrypt } from "@/lib/encryption"
import { client } from "@/lib/prisma"

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
      profileResult.status === "fulfilled" ? profileResult.value : { profileContent: "", businessContext: {} }

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
    let workflowConfigWithCredentials: any = null
    if (workflowConfigId) {
      try {
        workflowConfigWithCredentials = await client.businessWorkflowConfig.findUnique({
          where: { id: workflowConfigId },
          include: { credentials: true },
        })
        if (!workflowConfigWithCredentials) {
          Logger.warning(`Workflow config with ID ${workflowConfigId} not found.`)
        }
      } catch (dbError) {
        Logger.error(`Error fetching workflow config with credentials for ${workflowConfigId}:`, dbError)
      }
    } else {
      Logger.warning("No workflowConfigId provided to fetch integration credentials.")
    }

    // Build robust fallback variables
    const result: Record<string, string> = {
      // Core business information with multiple fallbacks
      business_profile: profileContent || "Professional business assistant",
      business_name: businessContext.businessName || businessData?.businessName || "Our Business",
      welcome_message:
        businessContext.welcomeMessage || businessData?.welcomeMessage || "Hello! How can I help you today?",
      business_industry: businessContext.industry || businessData?.industry || "Customer Service",
      business_type: businessData?.businessType || "Service Business",
      business_description:
        businessContext.businessDescription ||
        businessData?.businessDescription ||
        "We provide excellent customer service",
      instagram_handle: businessData?.instagramHandle || "",
      response_language: businessData?.responseLanguage || "English", // Use businessData directly
      business_hours: businessData?.businessHours || "24/7",
      auto_reply_enabled: businessData?.autoReplyEnabled ? "Yes" : "Yes", // Default to Yes
      promotion_message:
        businessContext.promotionMessage || businessData?.promotionMessage || "Thank you for contacting us!",
      target_audience: businessContext.targetAudience || businessData?.targetAudience || "Valued customers",
      website: businessData?.website || "",

      // Customer data placeholders
      customer_name: "",
      customer_email: "",
      customer_phone: "",

      // System status
      system_status: "operational",
      fallback_mode: businessData ? "false" : "true",
      workflow_config_id: workflowConfigId || "", // Pass the workflow config ID to Voiceflow
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

    // Parse JSON fields safely only if businessData exists
    if (businessData) {
      const jsonFields = [
        { field: businessData.automationGoals, keys: ["primary_goal", "response_time", "custom_goals"] },
        { field: businessData.customerJourney, keys: ["journey_steps"] },
        { field: businessData.features, keys: ["enabled_features"] },
      ]

      jsonFields.forEach(({ field, keys }) => {
        if (field) {
          try {
            const parsed = typeof field === "string" ? JSON.parse(field) : (field as Record<string, any>)
            keys.forEach((key) => {
              if (key === "journey_steps") {
                result[key] = JSON.stringify(parsed.journeySteps || [])
              } else if (key === "enabled_features") {
                result[key] =
                  parsed.features
                    ?.filter((f: any) => f.enabled)
                    .map((f: any) => f.name)
                    .join(", ") || ""
              } else {
                result[key] = parsed[key.replace("_", "")] || ""
              }
            })
          } catch (error) {
            Logger.error(`Error parsing ${keys[0]}:`, error)
            // Set safe defaults
            keys.forEach((key) => {
              result[key] = ""
            })
          }
        }
      })

      // Add remaining fields
      if (businessData.businessTypeData) {
        result.business_type_data = JSON.stringify(businessData.businessTypeData)
      }
      if (businessData.websiteAnalysis) {
        result.website_analysis = JSON.stringify(businessData.websiteAnalysis)
      }

      result.automation_setup_complete = businessData.automationSetupComplete ? "Yes" : "No"
      result.automation_setup_date = businessData.automationSetupDate?.toISOString() || ""
      result.automation_additional_notes = businessData.automationAdditionalNotes || ""
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

    // NEW: Add decrypted integration credentials to variables
    if (workflowConfigWithCredentials && workflowConfigWithCredentials.credentials) {
      workflowConfigWithCredentials.credentials.forEach((cred: any) => {
        try {
          const decryptedCredentials = decrypt(cred.encryptedCredentials)
          const parsedConfig = JSON.parse(decryptedCredentials)

          // Map credentials to Voiceflow variables using a consistent naming convention
          // Example: integrationName_credentialField
          // Ensure these variable names are defined in your Voiceflow projects
          for (const key in parsedConfig) {
            if (Object.prototype.hasOwnProperty.call(parsedConfig, key)) {
              const vfVarName = `${cred.integrationName.toLowerCase().replace(/\s/g, "_")}_${key}`
              result[vfVarName] = parsedConfig[key]
            }
          }
          // Handle additionalSettings separately if they contain nested objects
          if (parsedConfig.additionalSettings) {
            for (const subKey in parsedConfig.additionalSettings) {
              if (Object.prototype.hasOwnProperty.call(parsedConfig.additionalSettings, subKey)) {
                const vfVarName = `${cred.integrationName.toLowerCase().replace(/\s/g, "_")}_${subKey}`
                result[vfVarName] = parsedConfig.additionalSettings[subKey]
              }
            }
          }

          Logger.debug(`Decrypted and added variables for ${cred.integrationName}`)
        } catch (e) {
          Logger.error(`Failed to decrypt or parse credentials for ${cred.integrationName}:`, e)
        }
      })
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
        result += "\n[Conversation ended]"
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
  businessVariables: Record<string, string>, // CHANGED: Now explicitly takes businessVariables
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

      // REMOVED: Logic to fetch activeWorkflowConfigId and businessVariables internally.
      // These are now passed as arguments to this function.

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
