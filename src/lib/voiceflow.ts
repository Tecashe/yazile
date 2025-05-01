

import axios, { type AxiosError } from "axios"
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

export async function fetchBusinessVariablesE(businessId: string): Promise<Record<string, string>> {
  console.log("Entering fetchBusinessVariables functione")
  try {
    console.log("Attempting to call getBusinessForWebhook")
    const businessResponse = await getBusinessForWebhook(businessId)
    console.log("getBusinessForWebhook response:", JSON.stringify(businessResponse, null, 2))

    if (businessResponse.status !== 200 || !businessResponse.data.business) {
      console.error(`Unexpected response: ${JSON.stringify(businessResponse, null, 2)}`)
      throw new Error(`Failed to fetch business data. Status: ${businessResponse.status}`)
    }

    const businessData: BusinessData = businessResponse.data.business

    console.log("Business data:", JSON.stringify(businessData, null, 2))

    if (!businessData.businessName && !businessData.welcomeMessage && !businessData.industry) {
      console.error("All business data fields are empty")
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

    // Parse and add new fields
    if (businessData.automationGoals) {
      const automationGoals = businessData.automationGoals as Record<string, any>
      result.primary_goal = automationGoals.primaryGoal || ""
      result.response_time = automationGoals.responseTime?.toString() || ""
      result.custom_goals = automationGoals.customGoals || ""
    }

    if (businessData.customerJourney) {
      const customerJourney = businessData.customerJourney as Record<string, any>
      result.journey_steps = JSON.stringify(customerJourney.journeySteps || [])
    }

    if (businessData.features) {
      const features = businessData.features as Record<string, any>
      result.enabled_features =
        features.features
          ?.filter((f: any) => f.enabled)
          .map((f: any) => f.name)
          .join(", ") || ""
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

    console.log("Returning business variables:", JSON.stringify(result, null, 2))
    return result
  } catch (error) {
    console.error("Error in fetchBusinessVariables:")
    if (error instanceof Error) {
      console.error("Error name:", error.name)
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError
      console.error("Axios error details:")
      console.error("Request URL:", axiosError.config?.url)
      console.error("Request method:", axiosError.config?.method)
      console.error("Request headers:", JSON.stringify(axiosError.config?.headers, null, 2))
      console.error("Request data:", JSON.stringify(axiosError.config?.data, null, 2))
      console.error("Response status:", axiosError.response?.status)
      console.error("Response data:", JSON.stringify(axiosError.response?.data, null, 2))
    }
    console.error("Full error object:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2))
    throw error
  } finally {
    console.log("Exiting fetchBusinessVariables function")
  }
}

export async function getVoiceflowResponseE(
  userInput: string,
  userId: string,
  businessVariables: Record<string, string>,
): Promise<VoiceflowResult> {
  console.log("Entering getVoiceflowResponse function")
  console.log("User input:", userInput)
  console.log("User ID:", userId)
  console.log("Business variables:", JSON.stringify(businessVariables, null, 2))

  try {
    console.log("Sending request to Voiceflow API")
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
      },
    )

    console.log("Voiceflow API response status:", response.status)
    console.log("Voiceflow API response data:", JSON.stringify(response.data, null, 2))

    // Fetch updated variables after interaction
    const updatedVariables = await fetchVoiceflowVariables(userId)

    return { response: response.data, variables: updatedVariables }
  } catch (error) {
    console.error("Error interacting with Voiceflow:", error)
    throw error
  }
}

async function fetchVoiceflowVariablesE(userId: string): Promise<VoiceflowVariables> {
  console.log("Entering fetchVoiceflowVariables function")
  console.log("User ID:", userId)

  try {
    console.log("Sending request to fetch Voiceflow variables")
    const response = await axios.get<{ variables: VoiceflowVariables }>(
      `https://general-runtime.voiceflow.com/state/user/${userId}`,
      {
        headers: {
          Authorization: API_KEY,
          versionID: VERSION_ID,
          accept: "application/json",
        },
      },
    )
    console.log("Voiceflow variables fetch response status:", response.status)
    console.log("Voiceflow variables fetch response data:", JSON.stringify(response.data, null, 2))

    return response.data.variables || {}
  } catch (error) {
    console.error("Error fetching Voiceflow variables:", error)
    throw error
  }
}



export function processVoiceflowResponseE(traces: VoiceflowResponse[]): { text: string; buttons?: { name: string; payload: string }[] } {
  let result = "";
  let buttons: { name: string; payload: string }[] = [];

  for (const trace of traces) {
    if (trace.type === "text") {
      result += trace.payload.message + "\n";
    } else if (trace.type === "choice") {
      result += "\nSelect one:\n";
      for (const button of trace.payload.buttons) {
        buttons.push({ name: button.name, payload: button.name }); // Use button.name as payload
      }
    }
  }

  console.log("Your Extracted buttons,cashe:", buttons); // Log extracted buttons
  return { text: result.trim(), buttons: buttons.length > 0 ? buttons : undefined };
}


export async function createVoiceflowUserE(userId: string): Promise<boolean> {
  console.log("Entering createVoiceflowUser function")
  console.log("User ID:", userId)

  try {
    console.log("Sending request to create Voiceflow user")
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
      },
    )
    console.log("Voiceflow user creation response status:", response.status)
    console.log("Voiceflow user creation response data:", JSON.stringify(response.data, null, 2))
    return true
  } catch (error) {
    console.error("Error creating Voiceflow user:")
    if (error instanceof Error) {
      console.error("Error name:", error.name)
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError
      console.error("Axios error details:")
      console.error("Request URL:", axiosError.config?.url)
      console.error("Request method:", axiosError.config?.method)
      console.error("Request headers:", JSON.stringify(axiosError.config?.headers, null, 2))
      console.error("Request data:", JSON.stringify(axiosError.config?.data, null, 2))
      console.error("Response status:", axiosError.response?.status)
      console.error("Response data:", JSON.stringify(axiosError.response?.data, null, 2))
    }
    console.error("Full error object:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2))
    return false
  } finally {
    console.log("Exiting createVoiceflowUser function")
  }
}

export async function resetVoiceflowUserE(userId: string): Promise<boolean> {
  console.log("Entering resetVoiceflowUser function")
  console.log("User ID:", userId)

  try {
    console.log("Sending request to reset Voiceflow user")
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
      },
    )
    console.log("Voiceflow user reset response status:", response.status)
    console.log("Voiceflow user reset response data:", JSON.stringify(response.data, null, 2))
    return response.status === 200
  } catch (error) {
    console.error("Error resetting Voiceflow user:")
    if (error instanceof Error) {
      console.error("Error name:", error.name)
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError
      console.error("Axios error details:")
      console.error("Request URL:", axiosError.config?.url)
      console.error("Request method:", axiosError.config?.method)
      console.error("Request headers:", JSON.stringify(axiosError.config?.headers, null, 2))
      console.error("Request data:", JSON.stringify(axiosError.config?.data, null, 2))
      console.error("Response status:", axiosError.response?.status)
      console.error("Response data:", JSON.stringify(axiosError.response?.data, null, 2))
    }
    console.error("Full error object:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2))
    return false
  } finally {
    console.log("Exiting resetVoiceflowUser function")
  }
}



/////////////////



// import axios, { type AxiosError } from "axios"
// import { getBusinessForWebhook } from "@/actions/businfo"
// import type { VoiceflowVariables, VoiceflowResult } from "@/types/voiceflow"
// import type { JsonValue } from "@prisma/client/runtime/library"

// const API_KEY = process.env.VOICEFLOW_API_KEY
// const PROJECT_ID = process.env.VOICEFLOW_PROJECT_ID
// const VERSION_ID = process.env.VOICEFLOW_VERSION_ID

interface VoiceflowButton {
  name: string;
  request?: {
    payload?: string;
    type?: string;
  };
}

interface VoiceflowChoicePayload {
  buttons?: VoiceflowButton[];
}

interface VoiceflowTextPayload {
  message: string;
}

interface VoiceflowTrace {
  type: string;
  payload: VoiceflowChoicePayload | VoiceflowTextPayload | any;
}

interface VoiceflowResponse {
  type: string
  payload: any
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

    // Parse and add JSON fields
    if (businessData.automationGoals) {
      const automationGoals = businessData.automationGoals as Record<string, any>
      result.primary_goal = automationGoals.primaryGoal || ""
      result.response_time = automationGoals.responseTime?.toString() || ""
      result.custom_goals = automationGoals.customGoals || ""
    }

    if (businessData.customerJourney) {
      const customerJourney = businessData.customerJourney as Record<string, any>
      result.journey_steps = JSON.stringify(customerJourney.journeySteps || [])
    }

    if (businessData.features) {
      const features = businessData.features as Record<string, any>
      result.enabled_features =
        features.features
          ?.filter((f: any) => f.enabled)
          .map((f: any) => f.name)
          .join(", ") || ""
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
  try {
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
      },
    )

    const updatedVariables = await fetchVoiceflowVariables(userId)
    return { response: response.data, variables: updatedVariables }
  } catch (error) {
    console.error("Error interacting with Voiceflow:", error)
    throw error
  }
}

async function fetchVoiceflowVariables(userId: string): Promise<VoiceflowVariables> {
  try {
    const response = await axios.get<{ variables: VoiceflowVariables }>(
      `https://general-runtime.voiceflow.com/state/user/${userId}`,
      {
        headers: {
          Authorization: API_KEY,
          versionID: VERSION_ID,
          accept: "application/json",
        },
      },
    )
    return response.data.variables || {}
  } catch (error) {
    console.error("Error fetching Voiceflow variables:", error)
    throw error
  }
}



export function processVoiceflowResponse(traces: VoiceflowTrace[]): { 
  text: string; 
  buttons?: { name: string; payload: string }[] 
} {
  let result = "";
  const buttons: { name: string; payload: string }[] = [];

  for (const trace of traces) {
    switch (trace.type) {
      case "text":
        // Type guard for text payload
        if ('message' in trace.payload) {
          result += (trace.payload as VoiceflowTextPayload).message + "\n";
        }
        break;
        
      case "choice":
        // Type guard for choice payload
        if ('buttons' in trace.payload && Array.isArray(trace.payload.buttons)) {
          if (!result.includes("Select one:")) {
            result += "\nSelect one:\n";
          }
          trace.payload.buttons.forEach((button: VoiceflowButton) => {
            buttons.push({
              name: button.name,
              payload: button.request?.payload || button.name
            });
          });
        }
        break;
        
      case "visual":
        // Handle visual responses (images, cards, etc.)
        if ('image' in trace.payload) {
          result += `[Image: ${trace.payload.image}]\n`;
        }
        break;
        
      case "speak":
        // Handle voice responses
        if ('message' in trace.payload) {
          result += (trace.payload as VoiceflowTextPayload).message + "\n";
        }
        break;
        
      case "end":
        // Handle conversation end
        result += "\n[Conversation ended]";
        break;
        
      case "flow":
        // Handle flow direction changes
        if ('direction' in trace.payload) {
          result += `[Flow: ${trace.payload.direction}]\n`;
        }
        break;
        
      case "debug":
        // Handle debug information
        console.log('Voiceflow debug:', trace.payload);
        break;
        
      default:
        console.warn(`Unhandled trace type: ${trace.type}`, trace);
        break;
    }
  }

  return { 
    text: result.trim(), 
    buttons: buttons.length > 0 ? buttons : undefined 
  };
}

// export function processVoiceflowResponse(traces: VoiceflowResponse[]): { 
//   text: string; 
//   buttons?: { name: string; payload: string }[] 
// } {
//   let result = "";
//   const buttons: { name: string; payload: string }[] = [];

//   for (const trace of traces) {
//     switch (trace.type) {
//       case "text":
//         result += trace.payload.message + "\n";
//         break;
        
//       case "choice":
//         if (trace.payload.buttons?.length) {
//           if (!result.includes("Select one:")) {
//             result += "\nSelect one:\n";
//           }
//           trace.payload.buttons.forEach(button => {
//             buttons.push({
//               name: button.name,
//               payload: button.request?.payload || button.name
//             });
//           });
//         }
//         break;
        
//       default:
//         break;
//     }
//   }

//   return { 
//     text: result.trim(), 
//     buttons: buttons.length > 0 ? buttons : undefined 
//   };
// }

export async function createVoiceflowUser(userId: string): Promise<boolean> {
  try {
    await axios.put(
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
      },
    )
    return true
  } catch (error) {
    console.error("Error creating Voiceflow user:", error)
    return false
  }
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
      },
    )
    return response.status === 200
  } catch (error) {
    console.error("Error resetting Voiceflow user:", error)
    return false
  }
}