// import { type NextRequest, NextResponse } from "next/server"
// import { findAutomation } from "@/actions/automations/queries"
// import {
//   createChatHistory,
//   getChatHistory,
//   getKeywordAutomation,
//   getKeywordPost,
//   matchKeyword,
//   trackResponses,
// } from "@/actions/webhook/queries"
// import { sendDM, sendPrivateMessage } from "@/lib/fetch"
// import { openai } from "@/lib/openai"
// import { client } from "@/lib/prisma"
// import { getVoiceflowResponse, processVoiceflowResponse, createVoiceflowUser } from "@/lib/voiceflow"
// import { storeConversationMessage } from "@/actions/chats/queries"
// import { createMarketingInfoAction } from "@/actions/details"
// import { analyzeLead } from "@/lib/lead-qualification"
// import type { VoiceflowVariables } from "@/types/voiceflow"

// /**
//  * Instagram Quick Reply button type
//  */
// type InstagramQuickReply = {
//   content_type: "text"
//   title: string
//   payload: string
// }

// interface VoiceflowResponseWithButtons {
//   text: string
//   buttons?: { name: string; payload: string | object | any }[]
// }

// /**
//  * Transforms Voiceflow buttons to Instagram-compatible quick replies
//  * Handles both string and non-string payloads
//  */
// function transformButtonsToInstagram(
//   buttons?: { name: string; payload: string | object | any }[],
// ): InstagramQuickReply[] | undefined {
//   if (!buttons || buttons.length === 0) return undefined

//   // Instagram allows max 11 quick replies and has character limits
//   return buttons.slice(0, 11).map((button) => {
//     // Convert name to string and trim to Instagram's limit
//     const buttonName = String(button.name || "").substring(0, 20)

//     // Safely handle various payload types
//     let buttonPayload: string
//     if (typeof button.payload === "string") {
//       buttonPayload = button.payload.substring(0, 1000) // String payloads can use substring directly
//     } else if (button.payload === null || button.payload === undefined) {
//       buttonPayload = buttonName // Fallback to using the button name as payload
//     } else {
//       // For objects or other types, stringify them first
//       try {
//         buttonPayload = JSON.stringify(button.payload).substring(0, 1000)
//       } catch (e) {
//         buttonPayload = String(button.payload).substring(0, 1000)
//       }
//     }

//     return {
//       content_type: "text",
//       title: buttonName,
//       payload: buttonPayload,
//     }
//   })
// }

// interface WebhookData {
//   pageId: string
//   senderId: string
//   recipientId?: string
//   userMessage: string
//   messageId?: string
//   commentId?: string
//   messageType: "DM" | "COMMENT"
// }

// /**
//  * Extracts relevant data from webhook payload
//  */
// function extractWebhookData(payload: any): WebhookData | null {
//   try {
//     if (payload?.entry?.[0]?.messaging) {
//       return {
//         pageId: payload.entry[0].id,
//         senderId: payload.entry[0].messaging[0].sender.id,
//         recipientId: payload.entry[0].messaging[0].recipient.id,
//         userMessage: payload.entry[0].messaging[0].message.text,
//         messageId: payload.entry[0].messaging[0].message.mid,
//         messageType: "DM",
//       }
//     } else if (payload?.entry?.[0]?.changes && payload.entry[0].changes[0].field === "comments") {
//       return {
//         pageId: payload.entry[0].id,
//         senderId: payload.entry[0].changes[0].value.from.id,
//         userMessage: payload.entry[0].changes[0].value.text,
//         commentId: payload.entry[0].changes[0].value.id,
//         messageType: "COMMENT",
//       }
//     }
//   } catch (error) {
//     console.error("Error extracting webhook data:", error)
//   }
//   return null
// }

// export async function GET(req: NextRequest) {
//   const hub = req.nextUrl.searchParams.get("hub.challenge")
//   return new NextResponse(hub)
// }

// export async function POST(req: NextRequest) {
//   console.log("POST request received")
//   let webhook_payload

//   try {
//     webhook_payload = await req.json()
//     console.log("Received webhook payload:", JSON.stringify(webhook_payload, null, 2))

//     // Extract data from webhook payload
//     const data = extractWebhookData(webhook_payload)
//     if (!data) {
//       return NextResponse.json({ message: "Unsupported webhook payload" }, { status: 400 })
//     }

//     const { pageId, senderId, userMessage, messageType } = data
//     const userId = `${pageId}_${senderId}`

//     // Check for keyword match
//     const matcher = await matchKeyword(userMessage)

//     // Check if the conversation is already active
//     const conversationState = await client.conversationState.findUnique({
//       where: { userId },
//     })

//     let isConversationActive = conversationState?.isActive || false

//     if (!isConversationActive && !matcher?.automationId) {
//       // No keyword match and conversation not active, don't respond
//       return NextResponse.json({ message: "No keyword match" }, { status: 200 })
//     }

//     // Set conversation as active if keyword matched
//     if (matcher?.automationId) {
//       await client.conversationState.upsert({
//         where: { userId },
//         update: { isActive: true, updatedAt: new Date() },
//         create: { userId, isActive: true },
//       })
//       isConversationActive = true
//     }

//     // Get automation details
//     let automation
//     if (matcher && matcher.automationId) {
//       automation = await getKeywordAutomation(matcher.automationId, messageType === "DM")
//     } else {
//       const customer_history = await getChatHistory(pageId, senderId)
//       if (customer_history.history.length > 0) {
//         automation = await findAutomation(customer_history.automationId!)
//       }
//     }

//     // Process for lead qualification
//     if (automation?.userId) {
//       try {
//         await analyzeLead({
//           userId: automation.userId,
//           automationId: automation.id,
//           platformId: pageId,
//           customerId: senderId,
//           message: userMessage,
//           messageType,
//           timestamp: new Date(),
//         })
//       } catch (error) {
//         console.error("Error analyzing lead:", error)
//         // Continue processing even if lead analysis fails
//       }
//     }

//     // Handle based on subscription plan
//     if (automation?.User?.subscription?.plan === "PRO") {
//       // PRO users get Voiceflow
//       console.log("Using Voiceflow for PRO user")

//       // Create Voiceflow user
//       console.log("Attempting to create Voiceflow user:", userId)
//       const userCreated = await createVoiceflowUser(userId)
//       if (!userCreated) {
//         console.warn(`Failed to create Voiceflow user: ${userId}. Proceeding with the request.`)
//       }

//       // Get business context
//       let businessVariables: Record<string, string> = {}
//       if (automation?.userId) {
//         try {
                  
//           const business = await client.business.findFirst({
//             where: { userId: automation.userId },
//           })
//           if (business) {
//             businessVariables = {
//               business_name: business.businessName || "Test Name",
//               welcome_message: business.welcomeMessage || "Test",
//               business_industry: business.industry || "",
//               business_type: business.businessType || "",
//               business_description: business.businessDescription || "",
//               instagram_handle: business.instagramHandle || "",
//               website: business.website || "",
//               target_audience: business.targetAudience || "",
//               response_language: business.responseLanguage || "",
//               business_hours: business.businessHours || "",
//               auto_reply_enabled: business.autoReplyEnabled ? "Yes" : "No",
//               promotion_message: business.promotionMessage || "",
//               automation_setup_complete: business.automationSetupComplete ? "Yes" : "No",
//               automation_setup_date: business.automationSetupDate?.toISOString() || "",
//               automation_additional_notes: business.automationAdditionalNotes || "",
             
//             }

//             // Parse and add JSON fields
//             if (business.automationGoals) {
//               try {
//                 const automationGoals = JSON.parse(business.automationGoals as string)
//                 businessVariables.primary_goal = automationGoals.primaryGoal || ""
//                 businessVariables.response_time = automationGoals.responseTime?.toString() || ""
//                 businessVariables.custom_goals = automationGoals.customGoals || ""
//               } catch (e) {
//                 console.error("Error parsing automationGoals:", e)
//               }
//             }

//             if (business.customerJourney) {
//               try {
//                 const customerJourney = JSON.parse(business.customerJourney as string)
//                 businessVariables.journey_steps = JSON.stringify(customerJourney.journeySteps || [])
//               } catch (e) {
//                 console.error("Error parsing customerJourney:", e)
//               }
//             }

//             if (business.features) {
//               try {
//                 const features = JSON.parse(business.features as string)
//                 businessVariables.enabled_features =
//                   features.features
//                     ?.filter((f: any) => f.enabled)
//                     .map((f: any) => f.name)
//                     .join(", ") || ""
//               } catch (e) {
//                 console.error("Error parsing features:", e)
//               }
//             }

//             if (business.businessTypeData) {
//               businessVariables.business_type_data = business.businessTypeData as string
//             }

//             if (business.websiteAnalysis) {
//               businessVariables.website_analysis = business.websiteAnalysis as string
//             }
//           }
//         } catch (error) {
//           console.error("Error fetching business:", error)
//         }
//       }

//       // Get Voiceflow response
//       let voiceflowResponse: VoiceflowResponseWithButtons = {
//         text: "I'm sorry, but I'm having trouble processing your request right now. Please try again later.",
//         buttons: undefined,
//       }
//       let voiceflowVariables: VoiceflowVariables = {}

//       try {
//         const { response, variables } = await getVoiceflowResponse(userMessage, userId, businessVariables)
//         voiceflowResponse = processVoiceflowResponse(response)
//         voiceflowVariables = variables

//         // Store marketing info if available
//         if (voiceflowVariables.clientname || voiceflowVariables.clientemail || voiceflowVariables.clientphone) {
//           try {
//             const marketingInfo = {
//               name: voiceflowVariables.clientname,
//               email: voiceflowVariables.clientemail,
//               phone: voiceflowVariables.clientphone,
//             }
//             await createMarketingInfoAction(marketingInfo)
//           } catch (error) {
//             console.error("Error storing marketing info:", error)
//           }
//         }

//         // Store conversation
//         await storeConversationMessage(pageId, senderId, userMessage, false, automation?.id || null)
//         await storeConversationMessage(pageId, "bot", voiceflowResponse.text, true, automation?.id || null)

//         // Transform buttons to Instagram format
//         const instagramButtons = transformButtonsToInstagram(voiceflowResponse.buttons)

//         // Send response based on message type
//         if (messageType === "DM") {
//           const direct_message = await sendDM(
//             pageId,
//             senderId,
//             voiceflowResponse.text,
//             automation?.User?.integrations[0].token || process.env.DEFAULT_PAGE_TOKEN!,
//             instagramButtons,
//           )

//           if (direct_message.status === 200) {
//             if (automation) {
//               await trackResponses(automation.id, "DM")
//             }
//             await createChatHistory(automation?.id || "default", pageId, senderId, userMessage)
//             await createChatHistory(automation?.id || "default", pageId, senderId, voiceflowResponse.text)
//             return NextResponse.json({ message: "Message sent" }, { status: 200 })
//           }
//         } else if (messageType === "COMMENT" && data.commentId) {
//           const comment = await sendPrivateMessage(
//             pageId,
//             data.commentId,
//             voiceflowResponse.text,
//             automation?.User?.integrations[0].token || process.env.DEFAULT_PAGE_TOKEN!,
//             instagramButtons,
//           )

//           if (comment.status === 200) {
//             if (automation) {
//               await trackResponses(automation.id, "COMMENT")
//             }
//             return NextResponse.json({ message: "Message sent" }, { status: 200 })
//           }
//         }
//       } catch (error) {
//         console.error("Error in Voiceflow processing:", error)
//         // Fallback to sending just text if buttons fail
//         if (messageType === "DM") {
//           await sendDM(
//             pageId,
//             senderId,
//             voiceflowResponse.text,
//             automation?.User?.integrations[0].token || process.env.DEFAULT_PAGE_TOKEN!,
//           )
//         } else if (messageType === "COMMENT" && data.commentId) {
//           await sendPrivateMessage(
//             pageId,
//             data.commentId,
//             voiceflowResponse.text,
//             automation?.User?.integrations[0].token || process.env.DEFAULT_PAGE_TOKEN!,
//           )
//         }
//       }
//     } else {
//       // Free users get OpenAI
//       console.log("Using OpenAI for free user")

//       if (messageType === "DM") {
//         if (automation && automation.trigger) {
//           if (automation.listener && automation.listener.listener === "MESSAGE") {
//             const direct_message = await sendDM(
//               pageId,
//               senderId,
//               automation.listener?.prompt,
//               automation.User?.integrations[0].token!,
//             )

//             if (direct_message.status === 200) {
//               const tracked = await trackResponses(automation.id, "DM")
//               if (tracked) {
//                 return NextResponse.json({ message: "Message sent" }, { status: 200 })
//               }
//             }
//           }

//           if (automation.listener && automation.listener.listener === "SMARTAI") {
//             const smart_ai_message = await openai.chat.completions.create({
//               model: "gpt-4o",
//               messages: [
//                 {
//                   role: "assistant",
//                   content: `${automation.listener?.prompt}: Keep responses under 2 sentences`,
//                 },
//               ],
//             })

//             if (smart_ai_message.choices[0].message.content) {
//               const reciever = createChatHistory(automation.id, pageId, senderId, userMessage)

//               const sender = createChatHistory(
//                 automation.id,
//                 pageId,
//                 senderId,
//                 smart_ai_message.choices[0].message.content,
//               )

//               await client.$transaction([reciever, sender])

//               const direct_message = await sendDM(
//                 pageId,
//                 senderId,
//                 smart_ai_message.choices[0].message.content,
//                 automation.User?.integrations[0].token!,
//               )

//               if (direct_message.status === 200) {
//                 const tracked = await trackResponses(automation.id, "DM")
//                 if (tracked) {
//                   return NextResponse.json({ message: "Message sent" }, { status: 200 })
//                 }
//               }
//             }
//           }
//         }
//       }

//       if (messageType === "COMMENT" && data.commentId) {
//         const automations_post = await getKeywordPost(
//           webhook_payload.entry[0].changes[0].value.media.id,
//           automation?.id!,
//         )

//         if (automation && automations_post && automation.trigger) {
//           if (automation.listener) {
//             if (automation.listener.listener === "MESSAGE") {
//               const direct_message = await sendPrivateMessage(
//                 pageId,
//                 data.commentId,
//                 automation.listener?.prompt,
//                 automation.User?.integrations[0].token!,
//               )

//               if (direct_message.status === 200) {
//                 const tracked = await trackResponses(automation.id, "COMMENT")
//                 if (tracked) {
//                   return NextResponse.json({ message: "Message sent" }, { status: 200 })
//                 }
//               }
//             }

//             if (automation.listener.listener === "SMARTAI") {
//               const smart_ai_message = await openai.chat.completions.create({
//                 model: "gpt-4o",
//                 messages: [
//                   {
//                     role: "assistant",
//                     content: `${automation.listener?.prompt}: keep responses under 2 sentences`,
//                   },
//                 ],
//               })

//               if (smart_ai_message.choices[0].message.content) {
//                 const reciever = createChatHistory(automation.id, pageId, senderId, userMessage)

//                 const sender = createChatHistory(
//                   automation.id,
//                   pageId,
//                   senderId,
//                   smart_ai_message.choices[0].message.content,
//                 )

//                 await client.$transaction([reciever, sender])

//                 const direct_message = await sendPrivateMessage(
//                   pageId,
//                   data.commentId,
//                   smart_ai_message.choices[0].message.content,
//                   automation.User?.integrations[0].token!,
//                 )

//                 if (direct_message.status === 200) {
//                   const tracked = await trackResponses(automation.id, "COMMENT")
//                   if (tracked) {
//                     return NextResponse.json({ message: "Message sent" }, { status: 200 })
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }

//       // Handle continued conversations for free users
//       if (!matcher && messageType === "DM" && data.recipientId) {
//         const customer_history = await getChatHistory(data.recipientId, senderId)

//         if (customer_history.history.length > 0) {
//           const automation = await findAutomation(customer_history.automationId!)

//           if (automation?.listener?.listener === "SMARTAI") {
//             const smart_ai_message = await openai.chat.completions.create({
//               model: "gpt-4o",
//               messages: [
//                 {
//                   role: "assistant",
//                   content: `${automation.listener?.prompt}: keep responses under 2 sentences`,
//                 },
//                 ...customer_history.history,
//                 {
//                   role: "user",
//                   content: userMessage,
//                 },
//               ],
//             })

//             if (smart_ai_message.choices[0].message.content) {
//               const reciever = createChatHistory(automation.id, pageId, senderId, userMessage)

//               const sender = createChatHistory(
//                 automation.id,
//                 pageId,
//                 senderId,
//                 smart_ai_message.choices[0].message.content,
//               )

//               await client.$transaction([reciever, sender])

//               const direct_message = await sendDM(
//                 pageId,
//                 senderId,
//                 smart_ai_message.choices[0].message.content,
//                 automation.User?.integrations[0].token!,
//               )

//               if (direct_message.status === 200) {
//                 return NextResponse.json({ message: "Message sent" }, { status: 200 })
//               }
//             }
//           }
//         }
//       }
//     }

//     return NextResponse.json({ message: "Request processed" }, { status: 200 })
//   } catch (error) {
//     console.error("Unhandled error in POST function:", error)
//     return NextResponse.json(
//       {
//         message: "Error processing request",
//         error: error instanceof Error ? error.message : String(error),
//         stack: error instanceof Error ? error.stack : undefined,
//       },
//       { status: 500 },
//     )
//   }
// }



import { type NextRequest, NextResponse } from "next/server"
import { findAutomation } from "@/actions/automations/queries"
import {
  createChatHistory,
  getChatHistory,
  getKeywordAutomation,
  getKeywordPost,
  matchKeyword,
  trackResponses,
  checkProcessedMessage,
  markMessageAsProcessed,
  shouldContinueConversation,
  updateConversationState,
} from "@/actions/webhook/queries"
import { sendDMWithTyping, sendPrivateMessageWithTyping } from "@/lib/fetch"
import { openai } from "@/lib/openai"
import { client } from "@/lib/prisma"
import {
  getVoiceflowResponse,
  processVoiceflowResponse,
  createVoiceflowUser,
  calculateTypingDelay,
} from "@/lib/voiceflow"
import { storeConversationMessage } from "@/actions/chats/queries"
import { createMarketingInfoAction } from "@/actions/details"
import { analyzeLead } from "@/lib/lead-qualification"
import { initiateHumanHandoff, getHandoffStatus, isUserInHandoff, addHandoffMessage } from "@/lib/human-handoff"
import type { VoiceflowVariables } from "@/types/voiceflow"

// Enhanced retry mechanism with exponential backoff
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000,
  operationName = "operation",
): Promise<T> {
  let lastError: Error

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`${operationName} - Attempt ${attempt}/${maxRetries}`)
      return await operation()
    } catch (error) {
      lastError = error as Error
      console.error(`${operationName} failed on attempt ${attempt}:`, error)

      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000
        console.log(`Retrying ${operationName} in ${Math.round(delay)}ms...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError!
}

type InstagramQuickReply = {
  content_type: "text"
  title: string
  payload: string
}

interface VoiceflowResponseWithButtons {
  text: string
  buttons?: { name: string; payload: string | object | any }[]
  requiresHumanHandoff?: boolean
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  sentiment?: "positive" | "neutral" | "negative"
}

function transformButtonsToInstagram(
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

interface WebhookData {
  pageId: string
  senderId: string
  recipientId?: string
  userMessage: string
  messageId?: string
  commentId?: string
  messageType: "DM" | "COMMENT"
}

function extractWebhookData(payload: any): WebhookData | null {
  try {
    if (payload?.entry?.[0]?.messaging) {
      return {
        pageId: payload.entry[0].id,
        senderId: payload.entry[0].messaging[0].sender.id,
        recipientId: payload.entry[0].messaging[0].recipient.id,
        userMessage: payload.entry[0].messaging[0].message.text,
        messageId: payload.entry[0].messaging[0].message.mid,
        messageType: "DM",
      }
    } else if (payload?.entry?.[0]?.changes && payload.entry[0].changes[0].field === "comments") {
      return {
        pageId: payload.entry[0].id,
        senderId: payload.entry[0].changes[0].value.from.id,
        userMessage: payload.entry[0].changes[0].value.text,
        commentId: payload.entry[0].changes[0].value.id,
        messageType: "COMMENT",
      }
    }
  } catch (error) {
    console.error("Error extracting webhook data:", error)
  }
  return null
}

// ENHANCED: Better message key generation with more uniqueness
function generateMessageKey(data: WebhookData, timestamp: number): string {
  const baseId = data.messageId || data.commentId || `${data.senderId}_${timestamp}`
  const messageContent = data.userMessage.substring(0, 50) // Include part of message content
  return `${data.pageId}_${data.senderId}_${baseId}_${messageContent}_${timestamp}`
}

export async function GET(req: NextRequest) {
  const hub = req.nextUrl.searchParams.get("hub.challenge")
  return new NextResponse(hub)
}

export async function POST(req: NextRequest) {
  console.log("Enhanced POST request received")
  const startTime = Date.now()
  let webhook_payload

  try {
    webhook_payload = await req.json()
    console.log("Received webhook payload:", JSON.stringify(webhook_payload, null, 2))

    const data = extractWebhookData(webhook_payload)
    if (!data) {
      return NextResponse.json({ message: "Unsupported webhook payload" }, { status: 400 })
    }

    const { pageId, senderId, userMessage, messageType } = data
    const userId = `${pageId}_${senderId}`
    const messageKey = generateMessageKey(data, startTime)

    // ENHANCED: More robust deduplication check
    const isProcessed = await checkProcessedMessage(messageKey)
    if (isProcessed) {
      console.log(`Message already processed: ${messageKey}`)
      return NextResponse.json({ message: "Already processed" }, { status: 200 })
    }

    // Mark message as being processed BEFORE processing starts
    await markMessageAsProcessed(messageKey)

    // Check if user is in human handoff mode
    const inHandoff = await isUserInHandoff(pageId, senderId)
    if (inHandoff) {
      console.log(`User ${userId} is in handoff mode`)

      const handoffStatus = await getHandoffStatus(pageId, senderId)
      if (handoffStatus) {
        const activeHandoff = await client.humanHandoff.findFirst({
          where: {
            pageId,
            senderId,
            status: { in: ["PENDING", "ASSIGNED", "IN_PROGRESS"] },
          },
          orderBy: { createdAt: "desc" },
        })

        if (activeHandoff) {
          await addHandoffMessage(activeHandoff.id, userMessage, true, false)
        }

        if (handoffStatus.status === "assigned" || handoffStatus.status === "in_progress") {
          return NextResponse.json({ message: "Message forwarded to agent" }, { status: 200 })
        } else if (handoffStatus.status === "pending") {
          const queueMessage = `You're currently in queue (position ${handoffStatus.queuePosition}). Estimated wait time: ${Math.ceil((handoffStatus.estimatedWaitTime || 0) / 60000)} minutes. An agent will be with you shortly.`

          if (messageType === "DM") {
            await sendDMWithTyping(pageId, senderId, queueMessage, process.env.DEFAULT_PAGE_TOKEN!, undefined, {
              simulateTyping: true,
            })
          }

          return NextResponse.json({ message: "Queue status sent" }, { status: 200 })
        }
      }
    }

    // ENHANCED: Multi-tier automation matching
    let automation: any = null
    let triggerReason = ""

    // 1. First, check for keyword match (highest priority)
    const matcher = await matchKeyword(userMessage)
    if (matcher?.automationId) {
      automation = await getKeywordAutomation(matcher.automationId, messageType === "DM")
      triggerReason = "keyword_match"
      console.log(`Keyword match found: ${matcher.word}`)
    }

    // 2. If no keyword match, check for conversation continuation or open listeners
    if (!automation) {
      const continuationCheck = await shouldContinueConversation(userId, messageType)

      if (continuationCheck.shouldContinue && continuationCheck.automation) {
        automation = continuationCheck.automation
        triggerReason = continuationCheck.reason
        console.log(`Conversation continuation: ${triggerReason}`)
      }
    }

    // 3. If still no automation, exit
    if (!automation) {
      console.log("No automation found for this message")
      return NextResponse.json({ message: "No automation available" }, { status: 200 })
    }

    // Update conversation state with automation info
    await updateConversationState(userId, {
      isActive: true,
      lastTriggerType: triggerReason,
      lastTriggerReason: triggerReason,
      lastMessageLength: userMessage.length,
      automationId: automation.id,
      listenMode: triggerReason === "keyword_match" ? "KEYWORDS" : "ALL_MESSAGES",
    })

    // Process for lead qualification
    if (automation?.userId) {
      try {
        await analyzeLead({
          userId: automation.userId,
          automationId: automation.id,
          platformId: pageId,
          customerId: senderId,
          message: userMessage,
          messageType,
          timestamp: new Date(),
        })
      } catch (error) {
        console.error("Error analyzing lead:", error)
      }
    }

    // Handle based on subscription plan
    if (automation?.User?.subscription?.plan === "PRO") {
      console.log("Using enhanced Voiceflow for PRO user")
      await handleEnhancedVoiceflowResponse(data, automation, userId, userMessage)
    } else {
      console.log("Using enhanced OpenAI for free user")
      await handleEnhancedOpenAIResponse(data, automation, webhook_payload, userMessage)
    }

    return NextResponse.json({ message: "Request processed successfully" }, { status: 200 })
  } catch (error) {
    console.error("Unhandled error in enhanced POST function:", error)
    return NextResponse.json(
      {
        message: "Error processing request",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

async function handleEnhancedVoiceflowResponse(
  data: WebhookData,
  automation: any,
  userId: string,
  userMessage: string,
) {
  const { pageId, senderId, messageType } = data

  try {
    console.log("Attempting to create Voiceflow user:", userId)
    const userCreated = await createVoiceflowUser(userId)
    if (!userCreated) {
      console.warn(`Failed to create Voiceflow user: ${userId}. Proceeding with the request.`)
    }

    // Get business context
    let businessVariables: Record<string, string> = {}
    if (automation?.userId) {
      try {
        const business = await client.business.findFirst({
          where: { userId: automation.userId },
        })
        if (business) {
          businessVariables = {
            business_name: business.businessName || "Test Name",
            welcome_message: business.welcomeMessage || "Test",
            business_industry: business.industry || "",
            business_type: business.businessType || "",
            business_description: business.businessDescription || "",
            instagram_handle: business.instagramHandle || "",
            website: business.website || "",
            target_audience: business.targetAudience || "",
            response_language: business.responseLanguage || "",
            business_hours: business.businessHours || "",
            auto_reply_enabled: business.autoReplyEnabled ? "Yes" : "No",
            promotion_message: business.promotionMessage || "",
            automation_setup_complete: business.automationSetupComplete ? "Yes" : "No",
            automation_setup_date: business.automationSetupDate?.toISOString() || "",
            automation_additional_notes: business.automationAdditionalNotes || "",
          }

          // Parse JSON fields safely
          if (business.automationGoals) {
            try {
              const automationGoals =
                typeof business.automationGoals === "string"
                  ? JSON.parse(business.automationGoals)
                  : business.automationGoals
              businessVariables.primary_goal = automationGoals.primaryGoal || ""
              businessVariables.response_time = automationGoals.responseTime?.toString() || ""
              businessVariables.custom_goals = automationGoals.customGoals || ""
            } catch (e) {
              console.error("Error parsing automationGoals:", e)
            }
          }

          if (business.customerJourney) {
            try {
              const customerJourney =
                typeof business.customerJourney === "string"
                  ? JSON.parse(business.customerJourney)
                  : business.customerJourney
              businessVariables.journey_steps = JSON.stringify(customerJourney.journeySteps || [])
            } catch (e) {
              console.error("Error parsing customerJourney:", e)
            }
          }

          if (business.features) {
            try {
              const features = typeof business.features === "string" ? JSON.parse(business.features) : business.features
              businessVariables.enabled_features =
                features.features
                  ?.filter((f: any) => f.enabled)
                  .map((f: any) => f.name)
                  .join(", ") || ""
            } catch (e) {
              console.error("Error parsing features:", e)
            }
          }

          if (business.businessTypeData) {
            businessVariables.business_type_data = business.businessTypeData as string
          }

          if (business.websiteAnalysis) {
            businessVariables.website_analysis = business.websiteAnalysis as string
          }
        }
      } catch (error) {
        console.error("Error fetching business:", error)
      }
    }

    // Get Voiceflow response with retry mechanism
    let voiceflowResponse: VoiceflowResponseWithButtons = {
      text: "I'm sorry, but I'm having trouble processing your request right now. Please try again later.",
      buttons: undefined,
    }
    let voiceflowVariables: VoiceflowVariables = {}

    try {
      const { response, variables } = await retryWithBackoff(
        () => getVoiceflowResponse(userMessage, userId, businessVariables),
        3,
        2000,
        "Voiceflow API call",
      )
      voiceflowResponse = processVoiceflowResponse(response)
      voiceflowVariables = variables
    } catch (error) {
      console.error("All Voiceflow API attempts failed:", error)
    }

    // Check if human handoff is required
    if (voiceflowResponse.requiresHumanHandoff) {
      const handoffResult = await initiateHumanHandoff({
        userId: automation?.userId || userId,
        pageId,
        senderId,
        automationId: automation?.id,
        reason: "Customer requested human assistance",
        priority: voiceflowResponse.priority || "MEDIUM",
        context: {
          lastMessage: userMessage,
          conversationContext: voiceflowVariables,
          businessType: businessVariables.business_type,
          conversationHistory: await getRecentConversationHistory(pageId, senderId),
        },
      })

      if (messageType === "DM") {
        await sendDMWithTyping(
          pageId,
          senderId,
          handoffResult.message || "I'm connecting you with a human agent who will assist you shortly.",
          automation?.User?.integrations[0].token || process.env.DEFAULT_PAGE_TOKEN!,
          undefined,
          {
            simulateTyping: true,
            priority: voiceflowResponse.priority,
          },
        )
      } else if (messageType === "COMMENT" && data.commentId) {
        await sendPrivateMessageWithTyping(
          pageId,
          data.commentId,
          handoffResult.message || "I'm connecting you with a human agent who will assist you shortly.",
          automation?.User?.integrations[0].token || process.env.DEFAULT_PAGE_TOKEN!,
          undefined,
          {
            simulateTyping: true,
            priority: voiceflowResponse.priority,
          },
        )
      }
      return
    }

    // Store marketing info if available
    if (voiceflowVariables.clientname || voiceflowVariables.clientemail || voiceflowVariables.clientphone) {
      try {
        const marketingInfo = {
          name: voiceflowVariables.clientname,
          email: voiceflowVariables.clientemail,
          phone: voiceflowVariables.clientphone,
        }
        await createMarketingInfoAction(marketingInfo)
      } catch (error) {
        console.error("Error storing marketing info:", error)
      }
    }

    // Store conversation
    await storeConversationMessage(pageId, senderId, userMessage, false, automation?.id || null)
    await storeConversationMessage(pageId, "bot", voiceflowResponse.text, true, automation?.id || null)

    // Transform buttons to Instagram format
    const instagramButtons = transformButtonsToInstagram(voiceflowResponse.buttons)

    // Calculate and apply human-like delay
    const responseDelay = calculateTypingDelay(voiceflowResponse.text.length)
    console.log(`Adding human-like delay of ${Math.round(responseDelay)}ms before responding`)

    // Send response based on message type with enhanced features
    if (messageType === "DM") {
      const direct_message = await retryWithBackoff(
        () =>
          sendDMWithTyping(
            pageId,
            senderId,
            voiceflowResponse.text,
            automation?.User?.integrations[0].token || process.env.DEFAULT_PAGE_TOKEN!,
            instagramButtons,
            {
              simulateTyping: true,
              typingDuration: responseDelay,
              priority: voiceflowResponse.priority,
            },
          ),
        3,
        1500,
        "Instagram DM send",
      )

      if (direct_message.status === 200) {
        if (automation) {
          await trackResponses(automation.id, "DM")
        }
        await createChatHistory(automation?.id || "default", pageId, senderId, userMessage)
        await createChatHistory(automation?.id || "default", pageId, senderId, voiceflowResponse.text)
      }
    } else if (messageType === "COMMENT" && data.commentId) {
      const comment = await retryWithBackoff(
        () =>
          sendPrivateMessageWithTyping(
            pageId,
            data.commentId!,
            voiceflowResponse.text,
            automation?.User?.integrations[0].token || process.env.DEFAULT_PAGE_TOKEN!,
            instagramButtons,
            {
              simulateTyping: true,
              typingDuration: responseDelay,
              priority: voiceflowResponse.priority,
            },
          ),
        3,
        1500,
        "Instagram comment reply",
      )

      if (comment.status === 200) {
        if (automation) {
          await trackResponses(automation.id, "COMMENT")
        }
      }
    }
  } catch (error) {
    console.error("Error in enhanced Voiceflow processing:", error)
    const fallbackText = "I'm sorry, but I'm having trouble processing your request right now. Please try again later."

    if (messageType === "DM") {
      await sendDMWithTyping(
        pageId,
        senderId,
        fallbackText,
        automation?.User?.integrations[0].token || process.env.DEFAULT_PAGE_TOKEN!,
        undefined,
        { simulateTyping: true },
      )
    } else if (messageType === "COMMENT" && data.commentId) {
      await sendPrivateMessageWithTyping(
        pageId,
        data.commentId,
        fallbackText,
        automation?.User?.integrations[0].token || process.env.DEFAULT_PAGE_TOKEN!,
        undefined,
        { simulateTyping: true },
      )
    }
  }
}

async function handleEnhancedOpenAIResponse(
  data: WebhookData,
  automation: any,
  webhook_payload: any,
  userMessage: string,
) {
  const { pageId, senderId, messageType } = data

  // Enhanced OpenAI processing with human-like delays
  if (messageType === "DM") {
    if (automation && automation.trigger) {
      if (automation.listener && automation.listener.listener === "MESSAGE") {
        const responseDelay = calculateTypingDelay(automation.listener?.prompt?.length || 50)

        const direct_message = await sendDMWithTyping(
          pageId,
          senderId,
          automation.listener?.prompt,
          automation.User?.integrations[0].token!,
          undefined,
          {
            simulateTyping: true,
            typingDuration: responseDelay,
          },
        )

        if (direct_message.status === 200) {
          await trackResponses(automation.id, "DM")
        }
      }

      if (automation.listener && automation.listener.listener === "SMARTAI") {
        const smart_ai_message = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "assistant",
              content: `${automation.listener?.prompt}: Keep responses under 2 sentences`,
            },
          ],
        })

        if (smart_ai_message.choices[0].message.content) {
          const reciever = createChatHistory(automation.id, pageId, senderId, userMessage)
          const sender = createChatHistory(automation.id, pageId, senderId, smart_ai_message.choices[0].message.content)

          await client.$transaction([reciever, sender])

          const responseDelay = calculateTypingDelay(smart_ai_message.choices[0].message.content.length)

          const direct_message = await sendDMWithTyping(
            pageId,
            senderId,
            smart_ai_message.choices[0].message.content,
            automation.User?.integrations[0].token!,
            undefined,
            {
              simulateTyping: true,
              typingDuration: responseDelay,
            },
          )

          if (direct_message.status === 200) {
            await trackResponses(automation.id, "DM")
          }
        }
      }
    }
  }

  // Similar enhancements for comment handling...
  if (messageType === "COMMENT" && data.commentId) {
    const automations_post = await getKeywordPost(webhook_payload.entry[0].changes[0].value.media.id, automation?.id!)

    if (automation && automations_post && automation.trigger) {
      if (automation.listener) {
        if (automation.listener.listener === "MESSAGE") {
          const responseDelay = calculateTypingDelay(automation.listener?.prompt?.length || 50)

          const direct_message = await sendPrivateMessageWithTyping(
            pageId,
            data.commentId,
            automation.listener?.prompt,
            automation.User?.integrations[0].token!,
            undefined,
            {
              simulateTyping: true,
              typingDuration: responseDelay,
            },
          )

          if (direct_message.status === 200) {
            await trackResponses(automation.id, "COMMENT")
          }
        }

        if (automation.listener.listener === "SMARTAI") {
          const smart_ai_message = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              {
                role: "assistant",
                content: `${automation.listener?.prompt}: keep responses under 2 sentences`,
              },
            ],
          })

          if (smart_ai_message.choices[0].message.content) {
            const reciever = createChatHistory(automation.id, pageId, senderId, userMessage)
            const sender = createChatHistory(
              automation.id,
              pageId,
              senderId,
              smart_ai_message.choices[0].message.content,
            )

            await client.$transaction([reciever, sender])

            const responseDelay = calculateTypingDelay(smart_ai_message.choices[0].message.content.length)

            const direct_message = await sendPrivateMessageWithTyping(
              pageId,
              data.commentId,
              smart_ai_message.choices[0].message.content,
              automation.User?.integrations[0].token!,
              undefined,
              {
                simulateTyping: true,
                typingDuration: responseDelay,
              },
            )

            if (direct_message.status === 200) {
              await trackResponses(automation.id, "COMMENT")
            }
          }
        }
      }
    }
  }

  // Handle continued conversations for free users with enhanced delays
  if (messageType === "DM" && data.recipientId) {
    const customer_history = await getChatHistory(data.recipientId, senderId)

    if (customer_history.history.length > 0) {
      const automation = await findAutomation(customer_history.automationId!)

      if (automation?.listener?.listener === "SMARTAI") {
        const smart_ai_message = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "assistant",
              content: `${automation.listener?.prompt}: keep responses under 2 sentences`,
            },
            ...customer_history.history,
            {
              role: "user",
              content: userMessage,
            },
          ],
        })

        if (smart_ai_message.choices[0].message.content) {
          const reciever = createChatHistory(automation.id, pageId, senderId, userMessage)
          const sender = createChatHistory(automation.id, pageId, senderId, smart_ai_message.choices[0].message.content)

          await client.$transaction([reciever, sender])

          const responseDelay = calculateTypingDelay(smart_ai_message.choices[0].message.content.length)

          const direct_message = await sendDMWithTyping(
            pageId,
            senderId,
            smart_ai_message.choices[0].message.content,
            automation.User?.integrations[0].token!,
            undefined,
            {
              simulateTyping: true,
              typingDuration: responseDelay,
            },
          )
        }
      }
    }
  }
}

// Helper function to get recent conversation history
async function getRecentConversationHistory(pageId: string, senderId: string) {
  try {
    const messages = await client.message.findMany({
      where: {
        pageId,
        senderId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    })

    return messages.map((msg) => ({
      content: msg.message,
      isFromCustomer: !msg.isFromBot,
      timestamp: msg.createdAt,
    }))
  } catch (error) {
    console.error("Error fetching conversation history:", error)
    return []
  }
}





// THIS IS FOR TESTING DEDUPLICATION AND IT WORKED 

// import { type NextRequest, NextResponse } from "next/server"
// import { findAutomation } from "@/actions/automations/queries"
// import {
//   createChatHistory,
//   getChatHistory,
//   getKeywordAutomation,
//   getKeywordPost,
//   matchKeyword,
//   trackResponses,
//   checkProcessedMessage,
//   markMessageAsProcessed,
// } from "@/actions/webhook/queries"
// import { sendDM, sendPrivateMessage } from "@/lib/fetch"
// import { openai } from "@/lib/openai"
// import { client } from "@/lib/prisma"
// import { getVoiceflowResponse, processVoiceflowResponse, createVoiceflowUser } from "@/lib/voiceflow"
// import { storeConversationMessage } from "@/actions/chats/queries"
// import { createMarketingInfoAction } from "@/actions/details"
// import { analyzeLead } from "@/lib/lead-qualification"
// import type { VoiceflowVariables } from "@/types/voiceflow"

// /**
//  * Instagram Quick Reply button type
//  */
// type InstagramQuickReply = {
//   content_type: "text"
//   title: string
//   payload: string
// }

// interface VoiceflowResponseWithButtons {
//   text: string
//   buttons?: { name: string; payload: string | object | any }[]
// }

// /**
//  * Transforms Voiceflow buttons to Instagram-compatible quick replies
//  * Handles both string and non-string payloads
//  */
// function transformButtonsToInstagram(
//   buttons?: { name: string; payload: string | object | any }[],
// ): InstagramQuickReply[] | undefined {
//   if (!buttons || buttons.length === 0) return undefined

//   // Instagram allows max 11 quick replies and has character limits
//   return buttons.slice(0, 11).map((button) => {
//     // Convert name to string and trim to Instagram's limit
//     const buttonName = String(button.name || "").substring(0, 20)

//     // Safely handle various payload types
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
//       content_type: "text",
//       title: buttonName,
//       payload: buttonPayload,
//     }
//   })
// }

// interface WebhookData {
//   pageId: string
//   senderId: string
//   recipientId?: string
//   userMessage: string
//   messageId?: string
//   commentId?: string
//   messageType: "DM" | "COMMENT"
// }

// /**
//  * Extracts relevant data from webhook payload
//  */
// function extractWebhookData(payload: any): WebhookData | null {
//   try {
//     if (payload?.entry?.[0]?.messaging) {
//       return {
//         pageId: payload.entry[0].id,
//         senderId: payload.entry[0].messaging[0].sender.id,
//         recipientId: payload.entry[0].messaging[0].recipient.id,
//         userMessage: payload.entry[0].messaging[0].message.text,
//         messageId: payload.entry[0].messaging[0].message.mid,
//         messageType: "DM",
//       }
//     } else if (payload?.entry?.[0]?.changes && payload.entry[0].changes[0].field === "comments") {
//       return {
//         pageId: payload.entry[0].id,
//         senderId: payload.entry[0].changes[0].value.from.id,
//         userMessage: payload.entry[0].changes[0].value.text,
//         commentId: payload.entry[0].changes[0].value.id,
//         messageType: "COMMENT",
//       }
//     }
//   } catch (error) {
//     console.error("Error extracting webhook data:", error)
//   }
//   return null
// }

// /**
//  * Generates a unique message identifier for deduplication
//  */
// function generateMessageKey(data: WebhookData, timestamp: number): string {
//   const id = data.messageId || data.commentId || `${data.senderId}_${timestamp}`
//   return `${data.pageId}_${data.senderId}_${id}`
// }

// export async function GET(req: NextRequest) {
//   const hub = req.nextUrl.searchParams.get("hub.challenge")
//   return new NextResponse(hub)
// }

// export async function POST(req: NextRequest) {
//   console.log("POST request received")
//   const startTime = Date.now()
//   let webhook_payload

//   try {
//     webhook_payload = await req.json()
//     console.log("Received webhook payload:", JSON.stringify(webhook_payload, null, 2))

//     // Extract data from webhook payload
//     const data = extractWebhookData(webhook_payload)
//     if (!data) {
//       return NextResponse.json({ message: "Unsupported webhook payload" }, { status: 400 })
//     }

//     const { pageId, senderId, userMessage, messageType } = data
//     const userId = `${pageId}_${senderId}`
//     const messageKey = generateMessageKey(data, startTime)

//     // Check for duplicate message processing
//     const isProcessed = await checkProcessedMessage(messageKey)
//     // if (isProcessed) {
//     //   console.log(`Message already processed: ${messageKey}`)
//     //   return NextResponse.json({ message: "Already processed" }, { status: 200 })
//     // }

//     // // Mark message as being processed
//     // await markMessageAsProcessed(messageKey)

//     // Check for keyword match
//     const matcher = await matchKeyword(userMessage)

//     // Check if the conversation is already active
//     const conversationState = await client.conversationState.findUnique({
//       where: { userId },
//     })

//     let isConversationActive = conversationState?.isActive || false

//     if (!isConversationActive && !matcher?.automationId) {
//       // No keyword match and conversation not active, don't respond
//       return NextResponse.json({ message: "No keyword match" }, { status: 200 })
//     }

//     // Set conversation as active if keyword matched
//     if (matcher?.automationId) {
//       await client.conversationState.upsert({
//         where: { userId },
//         update: {
//           isActive: true,
//           updatedAt: new Date(),
//           lastInteractionAt: new Date(),
//         },
//         create: {
//           userId,
//           isActive: true,
//           lastInteractionAt: new Date(),
//         },
//       })
//       isConversationActive = true
//     }

//     // Get automation details
//     let automation
//     if (matcher && matcher.automationId) {
//       automation = await getKeywordAutomation(matcher.automationId, messageType === "DM")
//     } else {
//       const customer_history = await getChatHistory(pageId, senderId)
//       if (customer_history.history.length > 0) {
//         automation = await findAutomation(customer_history.automationId!)
//       }
//     }

//     // Process for lead qualification
//     if (automation?.userId) {
//       try {
//         await analyzeLead({
//           userId: automation.userId,
//           automationId: automation.id,
//           platformId: pageId,
//           customerId: senderId,
//           message: userMessage,
//           messageType,
//           timestamp: new Date(),
//         })
//       } catch (error) {
//         console.error("Error analyzing lead:", error)
//         // Continue processing even if lead analysis fails
//       }
//     }

//     // Handle based on subscription plan
//     if (automation?.User?.subscription?.plan === "PRO") {
//       // PRO users get Voiceflow
//       console.log("Using Voiceflow for PRO user")
//       await handleVoiceflowResponse(data, automation, userId, userMessage)
//     } else {
//       // Free users get OpenAI
//       console.log("Using OpenAI for free user")
//       await handleOpenAIResponse(data, automation, webhook_payload, userMessage)
//     }

//     return NextResponse.json({ message: "Request processed successfully" }, { status: 200 })
//   } catch (error) {
//     console.error("Unhandled error in POST function:", error)
//     return NextResponse.json(
//       {
//         message: "Error processing request",
//         error: error instanceof Error ? error.message : String(error),
//       },
//       { status: 500 },
//     )
//   }
// }

// async function handleVoiceflowResponse(data: WebhookData, automation: any, userId: string, userMessage: string) {
//   const { pageId, senderId, messageType } = data

//   try {
//     // Create Voiceflow user if needed
//     console.log("Attempting to create Voiceflow user:", userId)
//     const userCreated = await createVoiceflowUser(userId)
//     if (!userCreated) {
//       console.warn(`Failed to create Voiceflow user: ${userId}. Proceeding with the request.`)
//     }

//     // Get business context
//     let businessVariables: Record<string, string> = {}
//     if (automation?.userId) {
//       try {
//         const business = await client.business.findFirst({
//           where: { userId: automation.userId },
//         })
//         if (business) {
//           businessVariables = {
//             business_name: business.businessName || "Test Name",
//             welcome_message: business.welcomeMessage || "Test",
//             business_industry: business.industry || "",
//             business_type: business.businessType || "",
//             business_description: business.businessDescription || "",
//             instagram_handle: business.instagramHandle || "",
//             website: business.website || "",
//             target_audience: business.targetAudience || "",
//             response_language: business.responseLanguage || "",
//             business_hours: business.businessHours || "",
//             auto_reply_enabled: business.autoReplyEnabled ? "Yes" : "No",
//             promotion_message: business.promotionMessage || "",
//             automation_setup_complete: business.automationSetupComplete ? "Yes" : "No",
//             automation_setup_date: business.automationSetupDate?.toISOString() || "",
//             automation_additional_notes: business.automationAdditionalNotes || "",
//           }

//           // Parse and add JSON fields safely
//           if (business.automationGoals) {
//             try {
//               const automationGoals =
//                 typeof business.automationGoals === "string"
//                   ? JSON.parse(business.automationGoals)
//                   : business.automationGoals
//               businessVariables.primary_goal = automationGoals.primaryGoal || ""
//               businessVariables.response_time = automationGoals.responseTime?.toString() || ""
//               businessVariables.custom_goals = automationGoals.customGoals || ""
//             } catch (e) {
//               console.error("Error parsing automationGoals:", e)
//             }
//           }

//           if (business.customerJourney) {
//             try {
//               const customerJourney =
//                 typeof business.customerJourney === "string"
//                   ? JSON.parse(business.customerJourney)
//                   : business.customerJourney
//               businessVariables.journey_steps = JSON.stringify(customerJourney.journeySteps || [])
//             } catch (e) {
//               console.error("Error parsing customerJourney:", e)
//             }
//           }

//           if (business.features) {
//             try {
//               const features = typeof business.features === "string" ? JSON.parse(business.features) : business.features
//               businessVariables.enabled_features =
//                 features.features
//                   ?.filter((f: any) => f.enabled)
//                   .map((f: any) => f.name)
//                   .join(", ") || ""
//             } catch (e) {
//               console.error("Error parsing features:", e)
//             }
//           }

//           if (business.businessTypeData) {
//             businessVariables.business_type_data = business.businessTypeData as string
//           }

//           if (business.websiteAnalysis) {
//             businessVariables.website_analysis = business.websiteAnalysis as string
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching business:", error)
//       }
//     }

//     // Get Voiceflow response
//     let voiceflowResponse: VoiceflowResponseWithButtons = {
//       text: "I'm sorry, but I'm having trouble processing your request right now. Please try again later.",
//       buttons: undefined,
//     }
//     let voiceflowVariables: VoiceflowVariables = {}

//     const { response, variables } = await getVoiceflowResponse(userMessage, userId, businessVariables)
//     voiceflowResponse = processVoiceflowResponse(response)
//     voiceflowVariables = variables

//     // Store marketing info if available
//     if (voiceflowVariables.clientname || voiceflowVariables.clientemail || voiceflowVariables.clientphone) {
//       try {
//         const marketingInfo = {
//           name: voiceflowVariables.clientname,
//           email: voiceflowVariables.clientemail,
//           phone: voiceflowVariables.clientphone,
//         }
//         await createMarketingInfoAction(marketingInfo)
//       } catch (error) {
//         console.error("Error storing marketing info:", error)
//       }
//     }

//     // Store conversation
//     await storeConversationMessage(pageId, senderId, userMessage, false, automation?.id || null)
//     await storeConversationMessage(pageId, "bot", voiceflowResponse.text, true, automation?.id || null)

//     // Transform buttons to Instagram format
//     const instagramButtons = transformButtonsToInstagram(voiceflowResponse.buttons)

//     // Send response based on message type
//     if (messageType === "DM") {
//       const direct_message = await sendDM(
//         pageId,
//         senderId,
//         voiceflowResponse.text,
//         automation?.User?.integrations[0].token || process.env.DEFAULT_PAGE_TOKEN!,
//         instagramButtons,
//       )

//       if (direct_message.status === 200) {
//         if (automation) {
//           await trackResponses(automation.id, "DM")
//         }
//         await createChatHistory(automation?.id || "default", pageId, senderId, userMessage)
//         await createChatHistory(automation?.id || "default", pageId, senderId, voiceflowResponse.text)
//       }
//     } else if (messageType === "COMMENT" && data.commentId) {
//       const comment = await sendPrivateMessage(
//         pageId,
//         data.commentId,
//         voiceflowResponse.text,
//         automation?.User?.integrations[0].token || process.env.DEFAULT_PAGE_TOKEN!,
//         instagramButtons,
//       )

//       if (comment.status === 200) {
//         if (automation) {
//           await trackResponses(automation.id, "COMMENT")
//         }
//       }
//     }
//   } catch (error) {
//     console.error("Error in Voiceflow processing:", error)
//     // Fallback to sending just text if buttons fail
//     const fallbackText = "I'm sorry, but I'm having trouble processing your request right now. Please try again later."

//     if (messageType === "DM") {
//       await sendDM(
//         pageId,
//         senderId,
//         fallbackText,
//         automation?.User?.integrations[0].token || process.env.DEFAULT_PAGE_TOKEN!,
//       )
//     } else if (messageType === "COMMENT" && data.commentId) {
//       await sendPrivateMessage(
//         pageId,
//         data.commentId,
//         fallbackText,
//         automation?.User?.integrations[0].token || process.env.DEFAULT_PAGE_TOKEN!,
//       )
//     }
//   }
// }

// async function handleOpenAIResponse(data: WebhookData, automation: any, webhook_payload: any, userMessage: string) {
//   const { pageId, senderId, messageType } = data

//   if (messageType === "DM") {
//     if (automation && automation.trigger) {
//       if (automation.listener && automation.listener.listener === "MESSAGE") {
//         const direct_message = await sendDM(
//           pageId,
//           senderId,
//           automation.listener?.prompt,
//           automation.User?.integrations[0].token!,
//         )

//         if (direct_message.status === 200) {
//           await trackResponses(automation.id, "DM")
//         }
//       }

//       if (automation.listener && automation.listener.listener === "SMARTAI") {
//         const smart_ai_message = await openai.chat.completions.create({
//           model: "gpt-4o",
//           messages: [
//             {
//               role: "assistant",
//               content: `${automation.listener?.prompt}: Keep responses under 2 sentences`,
//             },
//           ],
//         })

//         if (smart_ai_message.choices[0].message.content) {
//           const reciever = createChatHistory(automation.id, pageId, senderId, userMessage)
//           const sender = createChatHistory(automation.id, pageId, senderId, smart_ai_message.choices[0].message.content)

//           await client.$transaction([reciever, sender])

//           const direct_message = await sendDM(
//             pageId,
//             senderId,
//             smart_ai_message.choices[0].message.content,
//             automation.User?.integrations[0].token!,
//           )

//           if (direct_message.status === 200) {
//             await trackResponses(automation.id, "DM")
//           }
//         }
//       }
//     }
//   }

//   if (messageType === "COMMENT" && data.commentId) {
//     const automations_post = await getKeywordPost(webhook_payload.entry[0].changes[0].value.media.id, automation?.id!)

//     if (automation && automations_post && automation.trigger) {
//       if (automation.listener) {
//         if (automation.listener.listener === "MESSAGE") {
//           const direct_message = await sendPrivateMessage(
//             pageId,
//             data.commentId,
//             automation.listener?.prompt,
//             automation.User?.integrations[0].token!,
//           )

//           if (direct_message.status === 200) {
//             await trackResponses(automation.id, "COMMENT")
//           }
//         }

//         if (automation.listener.listener === "SMARTAI") {
//           const smart_ai_message = await openai.chat.completions.create({
//             model: "gpt-4o",
//             messages: [
//               {
//                 role: "assistant",
//                 content: `${automation.listener?.prompt}: keep responses under 2 sentences`,
//               },
//             ],
//           })

//           if (smart_ai_message.choices[0].message.content) {
//             const reciever = createChatHistory(automation.id, pageId, senderId, userMessage)
//             const sender = createChatHistory(
//               automation.id,
//               pageId,
//               senderId,
//               smart_ai_message.choices[0].message.content,
//             )

//             await client.$transaction([reciever, sender])

//             const direct_message = await sendPrivateMessage(
//               pageId,
//               data.commentId,
//               smart_ai_message.choices[0].message.content,
//               automation.User?.integrations[0].token!,
//             )

//             if (direct_message.status === 200) {
//               await trackResponses(automation.id, "COMMENT")
//             }
//           }
//         }
//       }
//     }
//   }

//   // Handle continued conversations for free users
//   if (messageType === "DM" && data.recipientId) {
//     const customer_history = await getChatHistory(data.recipientId, senderId)

//     if (customer_history.history.length > 0) {
//       const automation = await findAutomation(customer_history.automationId!)

//       if (automation?.listener?.listener === "SMARTAI") {
//         const smart_ai_message = await openai.chat.completions.create({
//           model: "gpt-4o",
//           messages: [
//             {
//               role: "assistant",
//               content: `${automation.listener?.prompt}: keep responses under 2 sentences`,
//             },
//             ...customer_history.history,
//             {
//               role: "user",
//               content: userMessage,
//             },
//           ],
//         })

//         if (smart_ai_message.choices[0].message.content) {
//           const reciever = createChatHistory(automation.id, pageId, senderId, userMessage)
//           const sender = createChatHistory(automation.id, pageId, senderId, smart_ai_message.choices[0].message.content)

//           await client.$transaction([reciever, sender])

//           const direct_message = await sendDM(
//             pageId,
//             senderId,
//             smart_ai_message.choices[0].message.content,
//             automation.User?.integrations[0].token!,
//           )
//         }
//       }
//     }
//   }
// }

