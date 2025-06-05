import axios, { type AxiosError } from "axios"
import { getBusinessForWebhook } from "@/actions/businfo"
import type { VoiceflowVariables, VoiceflowResult } from "@/types/voiceflow"
import type { JsonValue } from "@prisma/client/runtime/library"


import { client } from "@/lib/prisma"


const API_KEY = process.env.VOICEFLOW_API_KEY
const PROJECT_ID = process.env.VOICEFLOW_PROJECT_ID
const VERSION_ID = process.env.VOICEFLOW_VERSION_ID

interface VoiceflowResponse {
  type: string
  payload: any
}


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






// interface ConversationAnalytics {
//   totalConversations: number
//   completedConversations: number
//   averageSessionLength: number
//   averageResponseTime: number
//   completionRate: number
//   userSatisfactionAvg: number
//   topIntents: Array<{ intent: string; count: number }>
//   dropOffPoints: Array<{ step: string; dropOffRate: number }>
//   sentimentDistribution: { positive: number; neutral: number; negative: number }
//   conversionRate: number
//   engagementScore: number
// }

// interface ABTestConfig {
//   name: string
//   description?: string
//   variants: Array<{
//     id: string
//     name: string
//     flowChanges: any
//     trafficPercentage: number
//   }>
//   metrics: string[]
//   startDate: Date
//   endDate: Date
// }

// export class EnhancedVoiceflowService {
//   private requestCache = new Map<string, Promise<any>>()

//   // 1. CONVERSATION ANALYTICS
//   async getConversationAnalytics(
//     userId: string,
//     automationId: string,
//     dateRange?: { start: Date; end: Date },
//   ): Promise<ConversationAnalytics> {
//     try {
//       // Get analytics from our database
//       const analytics = await client.voiceflowAnalytics.findMany({
//         where: {
//           userId,
//           automationId,
//           date: dateRange
//             ? {
//                 gte: dateRange.start,
//                 lte: dateRange.end,
//               }
//             : {
//                 gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
//               },
//         },
//         orderBy: { date: "desc" },
//       })

//       if (analytics.length === 0) {
//         // Return default analytics if no data
//         return {
//           totalConversations: 0,
//           completedConversations: 0,
//           averageSessionLength: 0,
//           averageResponseTime: 0,
//           completionRate: 0,
//           userSatisfactionAvg: 0,
//           topIntents: [],
//           dropOffPoints: [],
//           sentimentDistribution: { positive: 0, neutral: 0, negative: 0 },
//           conversionRate: 0,
//           engagementScore: 0,
//         }
//       }

//       // Aggregate analytics data
//       const aggregated = analytics.reduce(
//         (acc, curr) => {
//           acc.totalConversations += curr.totalConversations
//           acc.completedConversations += curr.completedConversations
//           acc.averageSessionLength += curr.averageSessionLength
//           acc.averageResponseTime += curr.averageResponseTime
//           acc.completionRate += curr.completionRate
//           acc.userSatisfactionAvg += curr.userSatisfactionAvg
//           acc.conversionRate += curr.conversionRate
//           acc.engagementScore += curr.engagementScore

//           // Merge top intents
//           if (curr.topIntents) {
//             const intents = JSON.parse(curr.topIntents as string)
//             Object.entries(intents).forEach(([intent, count]) => {
//               const existing = acc.topIntents.find((i) => i.intent === intent)
//               if (existing) {
//                 existing.count += count as number
//               } else {
//                 acc.topIntents.push({ intent, count: count as number })
//               }
//             })
//           }

//           // Merge drop-off points
//           if (curr.dropOffPoints) {
//             const dropOffs = JSON.parse(curr.dropOffPoints as string)
//             Object.entries(dropOffs).forEach(([step, rate]) => {
//               const existing = acc.dropOffPoints.find((d) => d.step === step)
//               if (existing) {
//                 existing.dropOffRate = (existing.dropOffRate + (rate as number)) / 2
//               } else {
//                 acc.dropOffPoints.push({ step, dropOffRate: rate as number })
//               }
//             })
//           }

//           // Merge sentiment distribution
//           if (curr.sentimentDistribution) {
//             const sentiment = JSON.parse(curr.sentimentDistribution as string)
//             acc.sentimentDistribution.positive += sentiment.positive || 0
//             acc.sentimentDistribution.neutral += sentiment.neutral || 0
//             acc.sentimentDistribution.negative += sentiment.negative || 0
//           }

//           return acc
//         },
//         {
//           totalConversations: 0,
//           completedConversations: 0,
//           averageSessionLength: 0,
//           averageResponseTime: 0,
//           completionRate: 0,
//           userSatisfactionAvg: 0,
//           conversionRate: 0,
//           engagementScore: 0,
//           topIntents: [] as Array<{ intent: string; count: number }>,
//           dropOffPoints: [] as Array<{ step: string; dropOffRate: number }>,
//           sentimentDistribution: { positive: 0, neutral: 0, negative: 0 },
//         },
//       )

//       // Calculate averages
//       const count = analytics.length
//       return {
//         ...aggregated,
//         averageSessionLength: aggregated.averageSessionLength / count,
//         averageResponseTime: aggregated.averageResponseTime / count,
//         completionRate: aggregated.completionRate / count,
//         userSatisfactionAvg: aggregated.userSatisfactionAvg / count,
//         conversionRate: aggregated.conversionRate / count,
//         engagementScore: aggregated.engagementScore / count,
//         topIntents: aggregated.topIntents.sort((a, b) => b.count - a.count).slice(0, 10),
//         dropOffPoints: aggregated.dropOffPoints.sort((a, b) => b.dropOffRate - a.dropOffRate).slice(0, 5),
//       }
//     } catch (error) {
//       console.error("Error getting conversation analytics:", error)
//       throw error
//     }
//   }

//   // 2. USER JOURNEY TRACKING
//   async getUserJourney(userId: string, automationId: string, instagramUserId: string) {
//     try {
//       // Get user's journey data
//       const journey = await client.voiceflowUserJourney.findUnique({
//         where: {
//           userId_automationId_instagramUserId: {
//             userId,
//             automationId,
//             instagramUserId,
//           },
//         },
//       })

//       // Get conversation events for this user
//       const events = await client.voiceflowConversationEvent.findMany({
//         where: {
//           userId,
//           automationId,
//           instagramUserId,
//         },
//         orderBy: { timestamp: "asc" },
//         take: 100, // Limit to last 100 events
//       })

//       // Get personalization data
//       const personalization = await client.userPersonalization.findUnique({
//         where: {
//           userId_automationId_instagramUserId: {
//             userId,
//             automationId,
//             instagramUserId,
//           },
//         },
//       })

//       return {
//         journey,
//         events,
//         personalization,
//         touchpoints: journey?.touchpoints ? JSON.parse(journey.touchpoints as string) : [],
//         conversionEvents: journey?.conversionEvents ? JSON.parse(journey.conversionEvents as string) : [],
//       }
//     } catch (error) {
//       console.error("Error getting user journey:", error)
//       throw error
//     }
//   }

//   // 3. DYNAMIC FLOW MANAGEMENT
//   async updateFlowForUser(userId: string, automationId: string, instagramUserId: string, flowUpdates: any) {
//     try {
//       // Store flow customizations in our database
//       const customization = await client.userFlowCustomization.upsert({
//         where: {
//           userId_automationId_instagramUserId: {
//             userId,
//             automationId,
//             instagramUserId,
//           },
//         },
//         update: {
//           flowUpdates: JSON.stringify(flowUpdates),
//           lastApplied: new Date(),
//           updatedAt: new Date(),
//         },
//         create: {
//           userId,
//           automationId,
//           instagramUserId,
//           flowUpdates: JSON.stringify(flowUpdates),
//           lastApplied: new Date(),
//         },
//       })

//       // Update Voiceflow variables to reflect flow changes
//       try {
//         const response = await axios.patch(
//           `https://api.voiceflow.com/v2/state/user/${instagramUserId}/variables`,
//           {
//             flow_customizations: JSON.stringify(flowUpdates),
//             automation_context: automationId,
//           },
//           { headers: { Authorization: API_KEY } },
//         )
//         return { customization, voiceflowResponse: response.data }
//       } catch (vfError) {
//         console.warn("Voiceflow update failed, but local customization saved:", vfError)
//         return { customization, voiceflowResponse: null }
//       }
//     } catch (error) {
//       console.error("Error updating flow for user:", error)
//       throw error
//     }
//   }

//   async createPersonalizedBranch(userId: string, automationId: string, instagramUserId: string, userProfile: any) {
//     try {
//       const personalizationData = {
//         userId,
//         automationId,
//         instagramUserId,
//         industry: userProfile.industry,
//         engagementLevel: userProfile.engagementScore || 0,
//         purchaseIntent: userProfile.purchaseIntent || 0.0,
//         preferences: JSON.stringify(userProfile.preferences || {}),
//         behaviorPattern: JSON.stringify(userProfile.behaviorPattern || {}),
//         lastInteraction: new Date(),
//         totalInteractions: userProfile.totalInteractions || 0,
//         conversionProbability: userProfile.conversionProbability || 0.0,
//       }

//       // Store personalization in our database
//       const personalization = await client.userPersonalization.upsert({
//         where: {
//           userId_automationId_instagramUserId: {
//             userId,
//             automationId,
//             instagramUserId,
//           },
//         },
//         update: personalizationData,
//         create: personalizationData,
//       })

//       // Create personalized flow in Voiceflow
//       try {
//         const response = await axios.post(
//           `https://api.voiceflow.com/v2/projects/${PROJECT_ID}/flows/personalized`,
//           {
//             userID: instagramUserId,
//             profile: userProfile,
//             conditions: {
//               industry: userProfile.industry,
//               engagement_level: userProfile.engagementScore,
//               purchase_intent: userProfile.purchaseIntent,
//             },
//           },
//           { headers: { Authorization: API_KEY } },
//         )
//         return { personalization, voiceflowResponse: response.data }
//       } catch (vfError) {
//         console.warn("Voiceflow personalization failed, but local data saved:", vfError)
//         return { personalization, voiceflowResponse: null }
//       }
//     } catch (error) {
//       console.error("Error creating personalized branch:", error)
//       throw error
//     }
//   }

//   // 4. A/B TESTING & OPTIMIZATION
//   async createABTest(userId: string, automationId: string, testConfig: ABTestConfig) {
//     try {
//       // Store A/B test in our database
//       const abTest = await client.voiceflowABTest.create({
//         data: {
//           userId,
//           automationId,
//           name: testConfig.name,
//           description: testConfig.description,
//           variants: JSON.stringify(testConfig.variants),
//           metrics: testConfig.metrics,
//           startDate: testConfig.startDate,
//           endDate: testConfig.endDate,
//           status: "ACTIVE",
//           trafficSplit: JSON.stringify(
//             testConfig.variants.reduce(
//               (acc, variant) => {
//                 acc[variant.id] = variant.trafficPercentage
//                 return acc
//               },
//               {} as Record<string, number>,
//             ),
//           ),
//         },
//       })

//       // Create experiment in Voiceflow
//       try {
//         const voiceflowExperiment = await axios.post(
//           `https://api.voiceflow.com/v2/projects/${PROJECT_ID}/experiments`,
//           {
//             name: testConfig.name,
//             variants: testConfig.variants,
//             trafficSplit: testConfig.variants.map((v) => v.trafficPercentage),
//             metrics: testConfig.metrics,
//           },
//           { headers: { Authorization: API_KEY } },
//         )

//         // Update our record with Voiceflow experiment ID
//         await client.voiceflowABTest.update({
//           where: { id: abTest.id },
//           data: { voiceflowExperimentId: voiceflowExperiment.data.id },
//         })

//         return { ...abTest, voiceflowExperimentId: voiceflowExperiment.data.id }
//       } catch (vfError) {
//         console.warn("Voiceflow experiment creation failed, but local test created:", vfError)
//         return abTest
//       }
//     } catch (error) {
//       console.error("Error creating A/B test:", error)
//       throw error
//     }
//   }

//   async getABTestResults(testId: string) {
//     try {
//       const abTest = await client.voiceflowABTest.findUnique({
//         where: { id: testId },
//       })

//       if (!abTest) {
//         throw new Error("A/B test not found")
//       }

//       // Get local results
//       const localResults = await client.voiceflowABTestResult.findMany({
//         where: { testId },
//       })

//       const aggregatedResults = localResults.reduce(
//         (acc, result) => {
//           if (!acc[result.variant]) {
//             acc[result.variant] = {
//               conversions: 0,
//               impressions: 0,
//               engagementScore: 0,
//               completionRate: 0,
//               userSatisfaction: 0,
//               count: 0,
//             }
//           }

//           acc[result.variant].conversions += result.conversions
//           acc[result.variant].impressions += result.impressions
//           acc[result.variant].engagementScore += result.engagementScore
//           acc[result.variant].completionRate += result.completionRate
//           acc[result.variant].userSatisfaction += result.userSatisfaction
//           acc[result.variant].count += 1

//           return acc
//         },
//         {} as Record<string, any>,
//       )

//       // Calculate averages
//       Object.keys(aggregatedResults).forEach((variant) => {
//         const data = aggregatedResults[variant]
//         data.conversionRate = data.impressions > 0 ? data.conversions / data.impressions : 0
//         data.engagementScore = data.count > 0 ? data.engagementScore / data.count : 0
//         data.completionRate = data.count > 0 ? data.completionRate / data.count : 0
//         data.userSatisfaction = data.count > 0 ? data.userSatisfaction / data.count : 0
//       })

//       // Try to get Voiceflow results if available
//       let voiceflowResults = null
//       if (abTest.voiceflowExperimentId) {
//         try {
//           const response = await axios.get(
//             `https://api.voiceflow.com/v2/experiments/${abTest.voiceflowExperimentId}/results`,
//             { headers: { Authorization: API_KEY } },
//           )
//           voiceflowResults = response.data
//         } catch (vfError) {
//           console.warn("Could not fetch Voiceflow A/B test results:", vfError)
//         }
//       }

//       return {
//         test: abTest,
//         localResults: aggregatedResults,
//         voiceflowResults,
//       }
//     } catch (error) {
//       console.error("Error getting A/B test results:", error)
//       throw error
//     }
//   }

//   // 5. INTENT RECOGNITION & NLU
//   async analyzeUserIntent(message: string, userId: string, automationId: string) {
//     try {
//       const cacheKey = `intent_${message}_${userId}_${automationId}`

//       if (this.requestCache.has(cacheKey)) {
//         return this.requestCache.get(cacheKey)!
//       }

//       const requestPromise = this.performIntentAnalysis(message, userId, automationId)
//       this.requestCache.set(cacheKey, requestPromise)

//       // Clean up cache after 5 minutes
//       setTimeout(() => {
//         this.requestCache.delete(cacheKey)
//       }, 300000)

//       return await requestPromise
//     } catch (error) {
//       console.error("Error analyzing user intent:", error)
//       return {
//         intent: "unknown",
//         confidence: 0.5,
//         entities: [],
//       }
//     }
//   }

//   private async performIntentAnalysis(message: string, userId: string, automationId: string) {
//     try {
//       // First, check our local training data for business-specific intents
//       const trainingData = await client.voiceflowIntentTraining.findMany({
//         where: {
//           userId,
//           automationId,
//           isVerified: true,
//         },
//         orderBy: { createdAt: "desc" },
//         take: 100,
//       })

//       // Simple keyword matching for local intents
//       let bestMatch = { intent: "unknown", confidence: 0.0, entities: [] }
//       const messageLower = message.toLowerCase()

//       for (const training of trainingData) {
//         const trainingTextLower = training.text.toLowerCase()
//         const words = messageLower.split(" ")
//         const trainingWords = trainingTextLower.split(" ")

//         let matchCount = 0
//         for (const word of words) {
//           if (trainingWords.includes(word)) {
//             matchCount++
//           }
//         }

//         const confidence = matchCount / Math.max(words.length, trainingWords.length)
//         if (confidence > bestMatch.confidence) {
//           bestMatch = {
//             intent: training.intent,
//             confidence,
//             entities: training.entities ? JSON.parse(training.entities) : [],
//           }
//         }
//       }

//       // If local confidence is high enough, return it
//       if (bestMatch.confidence > 0.7) {
//         return bestMatch
//       }

//       // Otherwise, try Voiceflow NLU
//       try {
//         const response = await axios.post(
//           `https://api.voiceflow.com/v2/nlu/predict`,
//           {
//             query: message,
//             context: { userId, automationId },
//             projectID: PROJECT_ID,
//           },
//           { headers: { Authorization: API_KEY } },
//         )

//         return response.data
//       } catch (vfError) {
//         console.warn("Voiceflow NLU failed, using local analysis:", vfError)
//         return bestMatch
//       }
//     } catch (error) {
//       console.error("Error in intent analysis:", error)
//       return { intent: "unknown", confidence: 0.5, entities: [] }
//     }
//   }

//   async trainCustomIntents(userId: string, automationId: string, trainingData: any[]) {
//     try {
//       // Store training data in our database
//       const createdTraining = await client.voiceflowIntentTraining.createMany({
//         data: trainingData.map((data) => ({
//           userId,
//           automationId,
//           text: data.text,
//           intent: data.intent,
//           entities: JSON.stringify(data.entities || []),
//           confidence: data.confidence || 1.0,
//           isVerified: true,
//           source: "manual",
//         })),
//       })

//       // Send to Voiceflow for training
//       try {
//         const response = await axios.post(
//           `https://api.voiceflow.com/v2/nlu/train`,
//           {
//             projectID: PROJECT_ID,
//             data: trainingData,
//           },
//           { headers: { Authorization: API_KEY } },
//         )

//         return { local: createdTraining, voiceflow: response.data }
//       } catch (vfError) {
//         console.warn("Voiceflow training failed, but local training saved:", vfError)
//         return { local: createdTraining, voiceflow: null }
//       }
//     } catch (error) {
//       console.error("Error training custom intents:", error)
//       throw error
//     }
//   }

//   // 6. BUSINESS-SPECIFIC KNOWLEDGE BASE
//   async uploadBusinessKnowledge(
//     userId: string,
//     automationId: string,
//     documents: Array<{
//       title: string
//       content: string
//       category: string
//       tags: string[]
//     }>,
//   ) {
//     try {
//       // Store in our database with business-specific context
//       const knowledgeEntries = await Promise.all(
//         documents.map((doc) =>
//           client.businessKnowledge.create({
//             data: {
//               userId,
//               automationId,
//               title: doc.title,
//               content: doc.content,
//               category: doc.category,
//               tags: doc.tags,
//               sourceType: "manual",
//               isActive: true,
//             },
//           }),
//         ),
//       )

//       // Also upload to Voiceflow with business metadata
//       try {
//         const voiceflowDocs = documents.map((doc) => ({
//           ...doc,
//           metadata: {
//             userId,
//             automationId,
//             category: doc.category,
//             tags: doc.tags,
//           },
//         }))

//         const response = await axios.post(
//           `https://api.voiceflow.com/v2/knowledge-base/${PROJECT_ID}/documents`,
//           {
//             documents: voiceflowDocs,
//             autoIndex: true,
//           },
//           { headers: { Authorization: API_KEY } },
//         )

//         return { knowledgeEntries, voiceflowResponse: response.data }
//       } catch (vfError) {
//         console.warn("Voiceflow KB upload failed, but local knowledge saved:", vfError)
//         return { knowledgeEntries, voiceflowResponse: null }
//       }
//     } catch (error) {
//       console.error("Error uploading business knowledge:", error)
//       throw error
//     }
//   }

//   async queryBusinessKnowledge(userId: string, automationId: string, query: string, limit = 5) {
//     try {
//       // First, query our business-specific knowledge
//       const businessKnowledge = await client.businessKnowledge.findMany({
//         where: {
//           userId,
//           automationId,
//           isActive: true,
//           OR: [
//             { title: { contains: query, mode: "insensitive" } },
//             { content: { contains: query, mode: "insensitive" } },
//             { tags: { hasSome: query.split(" ") } },
//           ],
//         },
//         take: limit,
//         orderBy: { updatedAt: "desc" },
//       })

//       // Also query Voiceflow KB with business filter
//       let voiceflowResults = []
//       try {
//         const response = await axios.post(
//           `https://api.voiceflow.com/v2/knowledge-base/${PROJECT_ID}/query`,
//           {
//             query: query,
//             filters: { userId, automationId },
//             limit: limit,
//           },
//           { headers: { Authorization: API_KEY } },
//         )
//         voiceflowResults = response.data.results || []
//       } catch (vfError) {
//         console.warn("Voiceflow KB query failed, using local knowledge only:", vfError)
//       }

//       return {
//         businessSpecific: businessKnowledge,
//         voiceflowResults,
//         combinedContext: this.combineKnowledgeContext(businessKnowledge, voiceflowResults),
//       }
//     } catch (error) {
//       console.error("Error querying business knowledge:", error)
//       throw error
//     }
//   }

//   private combineKnowledgeContext(businessKnowledge: any[], voiceflowResults: any[]) {
//     const combined = [
//       ...businessKnowledge.map((kb) => ({
//         source: "business_specific",
//         title: kb.title,
//         content: kb.content,
//         category: kb.category,
//         relevance: 1.0,
//       })),
//       ...voiceflowResults.map((vf, index) => ({
//         source: "voiceflow",
//         title: vf.title || "General Knowledge",
//         content: vf.content,
//         category: vf.metadata?.category || "general",
//         relevance: 1.0 - index * 0.1,
//       })),
//     ]

//     return combined.slice(0, 5) // Return top 5 most relevant
//   }

//   // 7. LIVE CONVERSATION MONITORING
//   async getActiveConversations(userId: string, automationId: string) {
//     try {
//       // Get active conversations from our database
//       const activeConversations = await client.voiceflowLiveConversation.findMany({
//         where: {
//           userId,
//           automationId,
//           isActive: true,
//         },
//         orderBy: { lastActivity: "desc" },
//       })

//       return {
//         conversations: activeConversations,
//         total: activeConversations.length,
//         highPriority: activeConversations.filter((c) => c.priority === "high" || c.priority === "urgent").length,
//       }
//     } catch (error) {
//       console.error("Error getting active conversations:", error)
//       throw error
//     }
//   }

//   async takeoverConversation(
//     userId: string,
//     automationId: string,
//     instagramUserId: string,
//     agentId: string,
//     reason = "manual_intervention",
//   ) {
//     try {
//       // Update conversation state in our database
//       const conversation = await client.voiceflowLiveConversation.update({
//         where: {
//           userId_automationId_instagramUserId: {
//             userId,
//             automationId,
//             instagramUserId,
//           },
//         },
//         data: {
//           isActive: false,
//           takenOverBy: agentId,
//           takenOverAt: new Date(),
//           takenOverReason: reason,
//         },
//       })

//       // Notify Voiceflow about takeover
//       try {
//         const response = await axios.post(
//           `https://api.voiceflow.com/v2/conversations/${instagramUserId}/takeover`,
//           {
//             agentID: agentId,
//             reason: reason,
//           },
//           { headers: { Authorization: API_KEY } },
//         )

//         return { conversation, voiceflowResponse: response.data }
//       } catch (vfError) {
//         console.warn("Voiceflow takeover notification failed:", vfError)
//         return { conversation, voiceflowResponse: null }
//       }
//     } catch (error) {
//       console.error("Error taking over conversation:", error)
//       throw error
//     }
//   }

//   // ENHANCED RESPONSE WITH BUSINESS CONTEXT
//   async getEnhancedResponse(
//     userInput: string,
//     instagramUserId: string,
//     userId: string,
//     automationId: string,
//     businessVariables: Record<string, string>,
//   ): Promise<VoiceflowResult> {
//     try {
//       // 1. Analyze intent
//       const intentAnalysis = await this.analyzeUserIntent(userInput, userId, automationId)

//       // 2. Query business-specific knowledge if needed
//       let knowledgeContext = ""
//       if (intentAnalysis.confidence < 0.8 || intentAnalysis.intent === "question") {
//         const knowledge = await this.queryBusinessKnowledge(userId, automationId, userInput)
//         knowledgeContext = JSON.stringify(knowledge.combinedContext)
//       }

//       // 3. Get user's flow customizations
//       const flowCustomizations = await client.userFlowCustomization.findUnique({
//         where: {
//           userId_automationId_instagramUserId: {
//             userId,
//             automationId,
//             instagramUserId,
//           },
//         },
//       })

//       // 4. Get user personalization
//       const personalization = await client.userPersonalization.findUnique({
//         where: {
//           userId_automationId_instagramUserId: {
//             userId,
//             automationId,
//             instagramUserId,
//           },
//         },
//       })

//       // 5. Enhance business variables with context
//       const enhancedVariables = {
//         ...businessVariables,
//         knowledge_context: knowledgeContext,
//         user_intent: intentAnalysis.intent,
//         intent_confidence: intentAnalysis.confidence.toString(),
//         flow_customizations: flowCustomizations?.flowUpdates || "{}",
//         user_personalization: personalization ? JSON.stringify(personalization) : "{}",
//         automation_id: automationId,
//         user_id: userId,
//       }

//       // 6. Get Voiceflow response
//       const response = await this.getVoiceflowResponse(userInput, instagramUserId, enhancedVariables)

//       // 7. Track analytics
//       await this.trackConversationEvent(userId, automationId, instagramUserId, "message_processed", {
//         intent: intentAnalysis.intent,
//         confidence: intentAnalysis.confidence,
//         had_knowledge_context: knowledgeContext.length > 0,
//         response_length: response.response.length,
//       })

//       // 8. Update user personalization
//       if (personalization) {
//         await client.userPersonalization.update({
//           where: { id: personalization.id },
//           data: {
//             lastInteraction: new Date(),
//             totalInteractions: personalization.totalInteractions + 1,
//           },
//         })
//       }

//       return response
//     } catch (error) {
//       console.error("Error getting enhanced response:", error)
//       throw error
//     }
//   }

//   private async getVoiceflowResponse(
//     userInput: string,
//     instagramUserId: string,
//     businessVariables: Record<string, string>,
//   ): Promise<VoiceflowResult> {
//     try {
//       const response = await axios.post(
//         `https://general-runtime.voiceflow.com/state/user/${instagramUserId}/interact`,
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
//           timeout: 10000,
//         },
//       )

//       const updatedVariables = await this.fetchVoiceflowVariables(instagramUserId)
//       return { response: response.data, variables: updatedVariables }
//     } catch (error) {
//       console.error("Error interacting with Voiceflow:", error)

//       // Return fallback response
//       return {
//         response: [
//           {
//             type: "text",
//             payload: { message: "I'm having trouble processing your request right now. Please try again." },
//           },
//         ],
//         variables: {},
//       }
//     }
//   }

//   private async fetchVoiceflowVariables(instagramUserId: string): Promise<VoiceflowVariables> {
//     try {
//       const response = await axios.get(`https://general-runtime.voiceflow.com/state/user/${instagramUserId}`, {
//         headers: {
//           Authorization: API_KEY,
//           versionID: VERSION_ID,
//           accept: "application/json",
//         },
//       })
//       return response.data.variables || {}
//     } catch (error) {
//       console.error("Error fetching Voiceflow variables:", error)
//       return {}
//     }
//   }

//   private async trackConversationEvent(
//     userId: string,
//     automationId: string,
//     instagramUserId: string,
//     eventType: string,
//     metadata: any,
//   ) {
//     try {
//       await client.voiceflowConversationEvent.create({
//         data: {
//           userId,
//           automationId,
//           instagramUserId,
//           eventType,
//           eventData: JSON.stringify(metadata),
//           intent: metadata.intent,
//           intentConfidence: metadata.confidence,
//           sentiment: metadata.sentiment || 0.0,
//           sessionId: metadata.sessionId || `session_${instagramUserId}_${Date.now()}`,
//           conversationStep: metadata.conversationStep,
//           responseTime: metadata.responseTime || 0,
//           metadata: JSON.stringify(metadata),
//           timestamp: new Date(),
//         },
//       })
//     } catch (error) {
//       console.error("Error tracking conversation event:", error)
//     }
//   }

//   // SYNC BUSINESS PROFILE DESCRIPTION TO KNOWLEDGE BASE
//   async syncBusinessProfileToKnowledge(userId: string, automationId: string) {
//     try {
//       // Get the business profile description
//       const profileDescription = await client.businessProfileDescription.findUnique({
//         where: { automationId },
//         include: { user: true, automation: true },
//       })

//       if (!profileDescription) {
//         console.log("No business profile description found for automation:", automationId)
//         return null
//       }

//       // Check if we already have this in knowledge base
//       const existingKnowledge = await client.businessKnowledge.findFirst({
//         where: {
//           userId,
//           automationId,
//           sourceType: "business_profile",
//           sourceId: profileDescription.id,
//         },
//       })

//       const knowledgeData = {
//         userId,
//         automationId,
//         title: "Business Profile Description",
//         content: profileDescription.content,
//         category: "business_info",
//         tags: ["business", "profile", "description", "about"],
//         sourceType: "business_profile",
//         sourceId: profileDescription.id,
//         isActive: true,
//       }

//       if (existingKnowledge) {
//         // Update existing knowledge
//         const updated = await client.businessKnowledge.update({
//           where: { id: existingKnowledge.id },
//           data: {
//             ...knowledgeData,
//             updatedAt: new Date(),
//           },
//         })
//         return { action: "updated", knowledge: updated }
//       } else {
//         // Create new knowledge entry
//         const created = await client.businessKnowledge.create({
//           data: knowledgeData,
//         })
//         return { action: "created", knowledge: created }
//       }
//     } catch (error) {
//       console.error("Error syncing business profile to knowledge:", error)
//       throw error
//     }
//   }

//   // GET ALL BUSINESS KNOWLEDGE INCLUDING SYNCED PROFILE
//   async getAllBusinessKnowledge(userId: string, automationId: string) {
//     try {
//       // First, sync the business profile
//       await this.syncBusinessProfileToKnowledge(userId, automationId)

//       // Then get all knowledge
//       const knowledge = await client.businessKnowledge.findMany({
//         where: {
//           userId,
//           automationId,
//           isActive: true,
//         },
//         orderBy: [{ sourceType: "asc" }, { updatedAt: "desc" }],
//       })

//       return knowledge
//     } catch (error) {
//       console.error("Error getting all business knowledge:", error)
//       throw error
//     }
//   }
// }

// export const enhancedVoiceflowService = new EnhancedVoiceflowService()
