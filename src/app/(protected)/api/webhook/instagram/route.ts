
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








//THIS IS FOR TESTING DEDUPLICATION

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
} from "@/actions/webhook/queries"
import { sendDM, sendPrivateMessage } from "@/lib/fetch"
import { openai } from "@/lib/openai"
import { client } from "@/lib/prisma"
import { getVoiceflowResponse, processVoiceflowResponse, createVoiceflowUser } from "@/lib/voiceflow"
import { storeConversationMessage } from "@/actions/chats/queries"
import { createMarketingInfoAction } from "@/actions/details"
import { analyzeLead } from "@/lib/lead-qualification"
import type { VoiceflowVariables } from "@/types/voiceflow"

/**
 * Instagram Quick Reply button type
 */
type InstagramQuickReply = {
  content_type: "text"
  title: string
  payload: string
}

interface VoiceflowResponseWithButtons {
  text: string
  buttons?: { name: string; payload: string | object | any }[]
}

/**
 * Transforms Voiceflow buttons to Instagram-compatible quick replies
 * Handles both string and non-string payloads
 */
function transformButtonsToInstagram(
  buttons?: { name: string; payload: string | object | any }[],
): InstagramQuickReply[] | undefined {
  if (!buttons || buttons.length === 0) return undefined

  // Instagram allows max 11 quick replies and has character limits
  return buttons.slice(0, 11).map((button) => {
    // Convert name to string and trim to Instagram's limit
    const buttonName = String(button.name || "").substring(0, 20)

    // Safely handle various payload types
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

/**
 * Extracts relevant data from webhook payload
 */
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

/**
 * Generates a unique message identifier for deduplication
 */
function generateMessageKey(data: WebhookData, timestamp: number): string {
  const id = data.messageId || data.commentId || `${data.senderId}_${timestamp}`
  return `${data.pageId}_${data.senderId}_${id}`
}

export async function GET(req: NextRequest) {
  const hub = req.nextUrl.searchParams.get("hub.challenge")
  return new NextResponse(hub)
}

export async function POST(req: NextRequest) {
  console.log("POST request received")
  const startTime = Date.now()
  let webhook_payload

  try {
    webhook_payload = await req.json()
    console.log("Received webhook payload:", JSON.stringify(webhook_payload, null, 2))

    // Extract data from webhook payload
    const data = extractWebhookData(webhook_payload)
    if (!data) {
      return NextResponse.json({ message: "Unsupported webhook payload" }, { status: 400 })
    }

    const { pageId, senderId, userMessage, messageType } = data
    const userId = `${pageId}_${senderId}`
    const messageKey = generateMessageKey(data, startTime)

    // Check for duplicate message processing
    const isProcessed = await checkProcessedMessage(messageKey)
    if (isProcessed) {
      console.log(`Message already processed: ${messageKey}`)
      return NextResponse.json({ message: "Already processed" }, { status: 200 })
    }

    // Mark message as being processed
    await markMessageAsProcessed(messageKey)

    // Check for keyword match
    const matcher = await matchKeyword(userMessage)

    // Check if the conversation is already active
    const conversationState = await client.conversationState.findUnique({
      where: { userId },
    })

    let isConversationActive = conversationState?.isActive || false

    if (!isConversationActive && !matcher?.automationId) {
      // No keyword match and conversation not active, don't respond
      return NextResponse.json({ message: "No keyword match" }, { status: 200 })
    }

    // Set conversation as active if keyword matched
    if (matcher?.automationId) {
      await client.conversationState.upsert({
        where: { userId },
        update: {
          isActive: true,
          updatedAt: new Date(),
          lastInteractionAt: new Date(),
        },
        create: {
          userId,
          isActive: true,
          lastInteractionAt: new Date(),
        },
      })
      isConversationActive = true
    }

    // Get automation details
    let automation
    if (matcher && matcher.automationId) {
      automation = await getKeywordAutomation(matcher.automationId, messageType === "DM")
    } else {
      const customer_history = await getChatHistory(pageId, senderId)
      if (customer_history.history.length > 0) {
        automation = await findAutomation(customer_history.automationId!)
      }
    }

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
        // Continue processing even if lead analysis fails
      }
    }

    // Handle based on subscription plan
    if (automation?.User?.subscription?.plan === "PRO") {
      // PRO users get Voiceflow
      console.log("Using Voiceflow for PRO user")
      await handleVoiceflowResponse(data, automation, userId, userMessage)
    } else {
      // Free users get OpenAI
      console.log("Using OpenAI for free user")
      await handleOpenAIResponse(data, automation, webhook_payload, userMessage)
    }

    return NextResponse.json({ message: "Request processed successfully" }, { status: 200 })
  } catch (error) {
    console.error("Unhandled error in POST function:", error)
    return NextResponse.json(
      {
        message: "Error processing request",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

async function handleVoiceflowResponse(data: WebhookData, automation: any, userId: string, userMessage: string) {
  const { pageId, senderId, messageType } = data

  try {
    // Create Voiceflow user if needed
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

          // Parse and add JSON fields safely
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

    // Get Voiceflow response
    let voiceflowResponse: VoiceflowResponseWithButtons = {
      text: "I'm sorry, but I'm having trouble processing your request right now. Please try again later.",
      buttons: undefined,
    }
    let voiceflowVariables: VoiceflowVariables = {}

    const { response, variables } = await getVoiceflowResponse(userMessage, userId, businessVariables)
    voiceflowResponse = processVoiceflowResponse(response)
    voiceflowVariables = variables

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

    // Send response based on message type
    if (messageType === "DM") {
      const direct_message = await sendDM(
        pageId,
        senderId,
        voiceflowResponse.text,
        automation?.User?.integrations[0].token || process.env.DEFAULT_PAGE_TOKEN!,
        instagramButtons,
      )

      if (direct_message.status === 200) {
        if (automation) {
          await trackResponses(automation.id, "DM")
        }
        await createChatHistory(automation?.id || "default", pageId, senderId, userMessage)
        await createChatHistory(automation?.id || "default", pageId, senderId, voiceflowResponse.text)
      }
    } else if (messageType === "COMMENT" && data.commentId) {
      const comment = await sendPrivateMessage(
        pageId,
        data.commentId,
        voiceflowResponse.text,
        automation?.User?.integrations[0].token || process.env.DEFAULT_PAGE_TOKEN!,
        instagramButtons,
      )

      if (comment.status === 200) {
        if (automation) {
          await trackResponses(automation.id, "COMMENT")
        }
      }
    }
  } catch (error) {
    console.error("Error in Voiceflow processing:", error)
    // Fallback to sending just text if buttons fail
    const fallbackText = "I'm sorry, but I'm having trouble processing your request right now. Please try again later."

    if (messageType === "DM") {
      await sendDM(
        pageId,
        senderId,
        fallbackText,
        automation?.User?.integrations[0].token || process.env.DEFAULT_PAGE_TOKEN!,
      )
    } else if (messageType === "COMMENT" && data.commentId) {
      await sendPrivateMessage(
        pageId,
        data.commentId,
        fallbackText,
        automation?.User?.integrations[0].token || process.env.DEFAULT_PAGE_TOKEN!,
      )
    }
  }
}

async function handleOpenAIResponse(data: WebhookData, automation: any, webhook_payload: any, userMessage: string) {
  const { pageId, senderId, messageType } = data

  if (messageType === "DM") {
    if (automation && automation.trigger) {
      if (automation.listener && automation.listener.listener === "MESSAGE") {
        const direct_message = await sendDM(
          pageId,
          senderId,
          automation.listener?.prompt,
          automation.User?.integrations[0].token!,
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

          const direct_message = await sendDM(
            pageId,
            senderId,
            smart_ai_message.choices[0].message.content,
            automation.User?.integrations[0].token!,
          )

          if (direct_message.status === 200) {
            await trackResponses(automation.id, "DM")
          }
        }
      }
    }
  }

  if (messageType === "COMMENT" && data.commentId) {
    const automations_post = await getKeywordPost(webhook_payload.entry[0].changes[0].value.media.id, automation?.id!)

    if (automation && automations_post && automation.trigger) {
      if (automation.listener) {
        if (automation.listener.listener === "MESSAGE") {
          const direct_message = await sendPrivateMessage(
            pageId,
            data.commentId,
            automation.listener?.prompt,
            automation.User?.integrations[0].token!,
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

            const direct_message = await sendPrivateMessage(
              pageId,
              data.commentId,
              smart_ai_message.choices[0].message.content,
              automation.User?.integrations[0].token!,
            )

            if (direct_message.status === 200) {
              await trackResponses(automation.id, "COMMENT")
            }
          }
        }
      }
    }
  }

  // Handle continued conversations for free users
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

          const direct_message = await sendDM(
            pageId,
            senderId,
            smart_ai_message.choices[0].message.content,
            automation.User?.integrations[0].token!,
          )
        }
      }
    }
  }
}













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
//  * Enhanced trigger evaluation system
//  */
// interface TriggerEvaluation {
//   shouldTrigger: boolean
//   automationId?: string
//   triggerType: "KEYWORD" | "UNIVERSAL" | "AI_SMART" | "TIME_BASED" | "EVENT_BASED"
//   confidence?: number
//   reason?: string
// }

// /**
//  * Transforms Voiceflow buttons to Instagram-compatible quick replies
//  */
// function transformButtonsToInstagram(
//   buttons?: { name: string; payload: string | object | any }[],
// ): InstagramQuickReply[] | undefined {
//   if (!buttons || buttons.length === 0) return undefined

//   return buttons.slice(0, 11).map((button) => {
//     const buttonName = String(button.name || "").substring(0, 20)

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
//   timestamp: Date
// }

// /**
//  * Extracts relevant data from webhook payload
//  */
// function extractWebhookData(payload: any): WebhookData | null {
//   try {
//     const timestamp = new Date()

//     if (payload?.entry?.[0]?.messaging) {
//       return {
//         pageId: payload.entry[0].id,
//         senderId: payload.entry[0].messaging[0].sender.id,
//         recipientId: payload.entry[0].messaging[0].recipient.id,
//         userMessage: payload.entry[0].messaging[0].message.text,
//         messageId: payload.entry[0].messaging[0].message.mid,
//         messageType: "DM",
//         timestamp,
//       }
//     } else if (payload?.entry?.[0]?.changes && payload.entry[0].changes[0].field === "comments") {
//       return {
//         pageId: payload.entry[0].id,
//         senderId: payload.entry[0].changes[0].value.from.id,
//         userMessage: payload.entry[0].changes[0].value.text,
//         commentId: payload.entry[0].changes[0].value.id,
//         messageType: "COMMENT",
//         timestamp,
//       }
//     }
//   } catch (error) {
//     console.error("Error extracting webhook data:", error)
//   }
//   return null
// }

// /**
//  * Enhanced trigger evaluation that supports multiple trigger types
//  */
// async function evaluateTriggers(
//   userMessage: string,
//   pageId: string,
//   senderId: string,
//   messageType: "DM" | "COMMENT",
//   timestamp: Date,
// ): Promise<TriggerEvaluation> {
//   try {
//     // Get all active automations for this page
//     const automations = await client.automation.findMany({
//       where: {
//         active: true,
//         User: {
//           integrations: {
//             some: {
//               instagramId: pageId,
//             },
//           },
//         },
//       },
//       include: {
//         trigger: true,
//         keywords: true,
//         User: {
//           include: {
//             subscription: true,
//             integrations: true,
//           },
//         },
//       },
//     })

//     // Evaluate each automation's triggers
//     for (const automation of automations) {
//       for (const trigger of automation.trigger) {
//         const evaluation = await evaluateSingleTrigger(
//           trigger,
//           automation,
//           userMessage,
//           pageId,
//           senderId,
//           messageType,
//           timestamp,
//         )

//         if (evaluation.shouldTrigger) {
//           return {
//             ...evaluation,
//             automationId: automation.id,
//           }
//         }
//       }
//     }

//     return { shouldTrigger: false, triggerType: "KEYWORD" }
//   } catch (error) {
//     console.error("Error evaluating triggers:", error)
//     return { shouldTrigger: false, triggerType: "KEYWORD" }
//   }
// }

// /**
//  * Evaluates a single trigger against the incoming message
//  */
// async function evaluateSingleTrigger(
//   trigger: any,
//   automation: any,
//   userMessage: string,
//   pageId: string,
//   senderId: string,
//   messageType: "DM" | "COMMENT",
//   timestamp: Date,
// ): Promise<Omit<TriggerEvaluation, "automationId">> {
//   switch (trigger.type) {
//     case "KEYWORD":
//       return await evaluateKeywordTrigger(automation.keywords, userMessage)

//     case "UNIVERSAL":
//       return evaluateUniversalTrigger(userMessage, messageType)

//     case "AI_SMART":
//       return await evaluateAISmartTrigger(userMessage, automation, messageType)

//     case "TIME_BASED":
//       return evaluateTimeBasedTrigger(trigger, timestamp)

//     case "EVENT_BASED":
//       return await evaluateEventBasedTrigger(trigger, pageId, senderId, messageType)

//     default:
//       return { shouldTrigger: false, triggerType: "KEYWORD" }
//   }
// }

// /**
//  * Original keyword-based trigger evaluation
//  */
// async function evaluateKeywordTrigger(
//   keywords: any[],
//   userMessage: string,
// ): Promise<Omit<TriggerEvaluation, "automationId">> {
//   const matcher = await matchKeyword(userMessage)

//   if (matcher) {
//     return {
//       shouldTrigger: true,
//       triggerType: "KEYWORD",
//       confidence: 1.0,
//       //reason: `Matched keyword: ${matcher.keyWord}`,
//       reason: `Matched keyword: ${matcher.word}`,
//     }
//   }

//   return { shouldTrigger: false, triggerType: "KEYWORD" }
// }

// /**
//  * Universal trigger - responds to any message
//  */
// function evaluateUniversalTrigger(
//   userMessage: string,
//   messageType: "DM" | "COMMENT",
// ): Omit<TriggerEvaluation, "automationId"> {
//   // Filter out obvious spam or very short messages
//   if (userMessage.length < 2 || /^[!@#$%^&*(),.?":{}|<>]+$/.test(userMessage)) {
//     return {
//       shouldTrigger: false,
//       triggerType: "UNIVERSAL",
//       reason: "Message appears to be spam or invalid",
//     }
//   }

//   return {
//     shouldTrigger: true,
//     triggerType: "UNIVERSAL",
//     confidence: 0.8,
//     reason: "Universal trigger activated for any valid message",
//   }
// }

// /**
//  * AI Smart trigger - uses AI to determine if message is worth responding to
//  */
// async function evaluateAISmartTrigger(
//   userMessage: string,
//   automation: any,
//   messageType: "DM" | "COMMENT",
// ): Promise<Omit<TriggerEvaluation, "automationId">> {
//   try {
//     // Get business context for better AI evaluation
//     const business = await client.business.findFirst({
//       where: { userId: automation.userId },
//     })

//     const businessContext = business
//       ? `
//       Business: ${business.businessName || "Unknown"}
//       Industry: ${business.industry || "General"}
//       Description: ${business.businessDescription || "No description"}
//     `
//       : "No business context available"

//     const aiEvaluation = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "system",
//           content: `You are an AI assistant that evaluates whether incoming messages warrant an automated response. 
          
//           Business Context:
//           ${businessContext}
          
//           Evaluate the message and respond with a JSON object containing:
//           - shouldRespond: boolean (true if this seems like a genuine inquiry/interaction)
//           - confidence: number (0-1, how confident you are)
//           - reason: string (brief explanation)
          
//           Consider these as genuine inquiries:
//           - Questions about products/services
//           - Requests for information
//           - Customer support needs
//           - General greetings and conversation starters
//           - Expressions of interest
          
//           Consider these as NOT worth responding to:
//           - Obvious spam
//           - Gibberish or random characters
//           - Inappropriate content
//           - Messages clearly not intended for business interaction
          
//           Message Type: ${messageType}
//           `,
//         },
//         {
//           role: "user",
//           content: userMessage,
//         },
//       ],
//       temperature: 0.3,
//       max_tokens: 200,
//     })

//     const response = aiEvaluation.choices[0].message.content
//     if (response) {
//       try {
//         const evaluation = JSON.parse(response)
//         return {
//           shouldTrigger: evaluation.shouldRespond || false,
//           triggerType: "AI_SMART",
//           confidence: evaluation.confidence || 0.5,
//           reason: evaluation.reason || "AI evaluation completed",
//         }
//       } catch (parseError) {
//         console.error("Error parsing AI evaluation:", parseError)
//       }
//     }
//   } catch (error) {
//     console.error("Error in AI smart trigger evaluation:", error)
//   }

//   // Fallback to conservative approach
//   return {
//     shouldTrigger: false,
//     triggerType: "AI_SMART",
//     reason: "AI evaluation failed, defaulting to no response",
//   }
// }

// /**
//  * Time-based trigger evaluation
//  */
// function evaluateTimeBasedTrigger(trigger: any, timestamp: Date): Omit<TriggerEvaluation, "automationId"> {
//   // This would typically check against scheduled times
//   // For now, we'll implement basic time-of-day logic
//   const hour = timestamp.getHours()
//   const dayOfWeek = timestamp.getDay()

//   // Example: Only trigger during business hours (9 AM - 6 PM, Mon-Fri)
//   if (trigger.businessHoursOnly) {
//     if (dayOfWeek === 0 || dayOfWeek === 6 || hour < 9 || hour > 18) {
//       return {
//         shouldTrigger: false,
//         triggerType: "TIME_BASED",
//         reason: "Outside business hours",
//       }
//     }
//   }

//   return {
//     shouldTrigger: true,
//     triggerType: "TIME_BASED",
//     confidence: 1.0,
//     reason: "Time-based conditions met",
//   }
// }

// /**
//  * Event-based trigger evaluation
//  */
// async function evaluateEventBasedTrigger(
//   trigger: any,
//   pageId: string,
//   senderId: string,
//   messageType: "DM" | "COMMENT",
// ): Promise<Omit<TriggerEvaluation, "automationId">> {
//   try {
//     // Check for specific events like first-time interaction, return customer, etc.
//     const existingHistory = await client.dms.findFirst({
//       where: {
//         reciever: pageId,
//         senderId: senderId,
//       },
//     })

//     // Example: Trigger only for first-time customers
//     if (trigger.eventType === "FIRST_INTERACTION" && !existingHistory) {
//       return {
//         shouldTrigger: true,
//         triggerType: "EVENT_BASED",
//         confidence: 1.0,
//         reason: "First-time customer interaction",
//       }
//     }

//     // Example: Trigger for returning customers
//     if (trigger.eventType === "RETURNING_CUSTOMER" && existingHistory) {
//       return {
//         shouldTrigger: true,
//         triggerType: "EVENT_BASED",
//         confidence: 1.0,
//         reason: "Returning customer detected",
//       }
//     }
//   } catch (error) {
//     console.error("Error in event-based trigger evaluation:", error)
//   }

//   return {
//     shouldTrigger: false,
//     triggerType: "EVENT_BASED",
//     reason: "Event conditions not met",
//   }
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

//     const { pageId, senderId, userMessage, messageType, timestamp } = data
//     const userId = `${pageId}_${senderId}`

//     // Enhanced trigger evaluation
//     const triggerEvaluation = await evaluateTriggers(userMessage, pageId, senderId, messageType, timestamp)

//     console.log("Trigger evaluation result:", triggerEvaluation)

//     // Check conversation state
//     const conversationState = await client.conversationState.findUnique({
//       where: { userId },
//     })

//     let isConversationActive = conversationState?.isActive || false

//     // Handle trigger activation
//     if (triggerEvaluation.shouldTrigger && triggerEvaluation.automationId) {
//       // Set conversation as active
//       await client.conversationState.upsert({
//         where: { userId },
//         update: {
//           isActive: true,
//           updatedAt: new Date(),
//           lastTriggerType: triggerEvaluation.triggerType,
//           lastTriggerReason: triggerEvaluation.reason,
//         },
//         create: {
//           userId,
//           isActive: true,
//           lastTriggerType: triggerEvaluation.triggerType,
//           lastTriggerReason: triggerEvaluation.reason,
//         },
//       })
//       isConversationActive = true
//     } else if (!isConversationActive) {
//       // No trigger match and conversation not active
//       console.log("No trigger activated and conversation not active")
//       return NextResponse.json(
//         {
//           message: "No trigger activated",
//           evaluation: triggerEvaluation,
//         },
//         { status: 200 },
//       )
//     }

//     // Get automation details
//     let automation
//     if (triggerEvaluation.automationId) {
//       automation = await getKeywordAutomation(triggerEvaluation.automationId, messageType === "DM")
//     } else {
//       // Fallback to existing conversation
//       const customer_history = await getChatHistory(pageId, senderId)
//       if (customer_history.history.length > 0) {
//         automation = await findAutomation(customer_history.automationId!)
//       }
//     }

//     if (!automation) {
//       console.log("No automation found")
//       return NextResponse.json({ message: "No automation found" }, { status: 200 })
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
//           // triggerType: triggerEvaluation.triggerType,
//           // triggerConfidence: triggerEvaluation.confidence,
//         })
//       } catch (error) {
//         console.error("Error analyzing lead:", error)
//       }
//     }

//     // Handle based on subscription plan
//     if (automation?.User?.subscription?.plan === "PRO") {
//       // PRO users get Voiceflow
//       console.log("Using Voiceflow for PRO user")

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
//               trigger_type: triggerEvaluation.triggerType,
//               trigger_confidence: triggerEvaluation.confidence?.toString() || "0",
//               trigger_reason: triggerEvaluation.reason || "",
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
//             return NextResponse.json(
//               {
//                 message: "Message sent",
//                 triggerType: triggerEvaluation.triggerType,
//                 confidence: triggerEvaluation.confidence,
//               },
//               { status: 200 },
//             )
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
//             return NextResponse.json(
//               {
//                 message: "Message sent",
//                 triggerType: triggerEvaluation.triggerType,
//                 confidence: triggerEvaluation.confidence,
//               },
//               { status: 200 },
//             )
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
//       // Free users get OpenAI with enhanced trigger support
//       console.log("Using OpenAI for free user with enhanced triggers")

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
//                 return NextResponse.json(
//                   {
//                     message: "Message sent",
//                     triggerType: triggerEvaluation.triggerType,
//                   },
//                   { status: 200 },
//                 )
//               }
//             }
//           }

//           if (automation.listener && automation.listener.listener === "SMARTAI") {
//             // Enhanced prompt with trigger context
//             const enhancedPrompt = `${automation.listener?.prompt}
            
//             Context: This message was triggered by ${triggerEvaluation.triggerType} trigger${triggerEvaluation.reason ? ` (${triggerEvaluation.reason})` : ""}.
//             Confidence: ${triggerEvaluation.confidence || "N/A"}
            
//             Keep responses under 2 sentences and be helpful and professional.`

//             const smart_ai_message = await openai.chat.completions.create({
//               model: "gpt-4o",
//               messages: [
//                 {
//                   role: "assistant",
//                   content: enhancedPrompt,
//                 },
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
//                 const tracked = await trackResponses(automation.id, "DM")
//                 if (tracked) {
//                   return NextResponse.json(
//                     {
//                       message: "Message sent",
//                       triggerType: triggerEvaluation.triggerType,
//                       confidence: triggerEvaluation.confidence,
//                     },
//                     { status: 200 },
//                   )
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
//                   return NextResponse.json(
//                     {
//                       message: "Message sent",
//                       triggerType: triggerEvaluation.triggerType,
//                     },
//                     { status: 200 },
//                   )
//                 }
//               }
//             }

//             if (automation.listener.listener === "SMARTAI") {
//               const enhancedPrompt = `${automation.listener?.prompt}
              
//               Context: This comment was triggered by ${triggerEvaluation.triggerType} trigger${triggerEvaluation.reason ? ` (${triggerEvaluation.reason})` : ""}.
              
//               Keep responses under 2 sentences and be helpful and professional.`

//               const smart_ai_message = await openai.chat.completions.create({
//                 model: "gpt-4o",
//                 messages: [
//                   {
//                     role: "assistant",
//                     content: enhancedPrompt,
//                   },
//                   {
//                     role: "user",
//                     content: userMessage,
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
//                     return NextResponse.json(
//                       {
//                         message: "Message sent",
//                         triggerType: triggerEvaluation.triggerType,
//                         confidence: triggerEvaluation.confidence,
//                       },
//                       { status: 200 },
//                     )
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }

//       // Handle continued conversations for free users with trigger context
//       if (!triggerEvaluation.shouldTrigger && messageType === "DM" && data.recipientId) {
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
//                 return NextResponse.json(
//                   {
//                     message: "Message sent",
//                     triggerType: "CONVERSATION_CONTINUATION",
//                   },
//                   { status: 200 },
//                 )
//               }
//             }
//           }
//         }
//       }
//     }

//     return NextResponse.json(
//       {
//         message: "Request processed",
//         triggerEvaluation,
//       },
//       { status: 200 },
//     )
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
