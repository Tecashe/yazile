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







//THIS IS FOR TESTING DEDUPLICATION AND IT WORKED 

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
//     if (isProcessed) {
//       console.log(`Message already processed: ${messageKey}`)
//       return NextResponse.json({ message: "Already processed" }, { status: 200 })
//     }

//     // // Mark message as being processed
//     await markMessageAsProcessed(messageKey)

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



//use this one, it is latest as of 13/june 2025\


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
//   getFallbackAutomation,
//   getPageToken,
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
//     if (isProcessed) {
//       console.log(`Message already processed: ${messageKey}`)
//       return NextResponse.json({ message: "Already processed" }, { status: 200 })
//     }

//     // Mark message as being processed
//     await markMessageAsProcessed(messageKey)

//     // Check for keyword match
//     const matcher = await matchKeyword(userMessage)

//     // Check if the conversation is already active
//     const conversationState = await client.conversationState.findUnique({
//       where: { userId },
//     })

//     let isConversationActive = conversationState?.isActive || false

//     // NEW: Handle fallback automation if no keyword and not active conversation
//     if (!isConversationActive && !matcher?.automationId) {
//       const fallbackAutomation = await getFallbackAutomation(pageId, messageType)
//       if (fallbackAutomation) {
//         console.log("Using fallback automation")

//         // Get page token
//         const token = await getPageToken(pageId)

//         // Get buttons from automation listener
//         // const buttons = fallbackAutomation.buttons
//         // const instagramButtons = buttons ? transformButtonsToInstagram(buttons) : undefined
//         const buttons = fallbackAutomation.buttons
//         const instagramButtons = buttons && Array.isArray(buttons) && buttons.every(btn => 
//           typeof btn === 'object' && btn !== null && 'name' in btn && 'payload' in btn
//         ) ? transformButtonsToInstagram(buttons as { name: string; payload: any; }[]) : undefined

//         if (messageType === "DM") {
//           await sendDM(
//             pageId,
//             senderId,
//             fallbackAutomation.listener?.prompt || "Hi, how can I help you today?",
//             token,
//             instagramButtons
//           )
//         } else if (messageType === "COMMENT" && data.commentId) {
//           await sendPrivateMessage(
//             pageId,
//             data.commentId,
//             fallbackAutomation.listener?.prompt || "Hi, how can I help you today?",
//             token,
//             instagramButtons
//           )
//         }
//         return NextResponse.json({ message: "Fallback automation triggered" }, { status: 200 })
//       } else {
//         console.log("No fallback automation found")
//         return NextResponse.json({ message: "No keyword match" }, { status: 200 })
//       }
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
//       text: "Thanks for your message! I'm a bit busy at the moment but I'll get back to you soon with a proper answer. 😊",
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
//     // Friendly fallback message
//     const fallbackText = "Thanks for your message! I'm a bit busy at the moment but I'll get back to you soon with a proper answer. 😊"

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



//PREVIOUSLY WORKING

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
//   getFallbackAutomation,
//   getPageToken,
// } from "@/actions/webhook/queries"
// import { sendDM, sendPrivateMessage } from "@/lib/fetch"
// import { openai } from "@/lib/openai"
// import { client } from "@/lib/prisma"
// import { getVoiceflowResponse, processVoiceflowResponse, createVoiceflowUser } from "@/lib/voiceflow"
// import { storeConversationMessage } from "@/actions/chats/queries"
// import { createMarketingInfoAction } from "@/actions/details"
// import { analyzeLead } from "@/lib/lead-qualification"
// import { 
//   handleInstagramDeauthWebhook, 
//   handleInstagramDataDeletionWebhook, 
  
// } from '@/lib/deauth'
// import { verifyInstagramWebhook } from '@/utils/instagram'

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

// /**
//  * Checks if webhook is a deauthorization request
//  */
// function isDeauthWebhook(payload: any): boolean {
//   return payload?.object === 'instagram' && payload?.entry?.[0]?.changes?.[0]?.field === 'deauthorizations'
// }

// /**
//  * Checks if webhook is a data deletion request
//  */
// function isDataDeletionWebhook(payload: any): boolean {
//   return payload?.object === 'instagram' && payload?.entry?.[0]?.changes?.[0]?.field === 'data_deletion'
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

//     // Check for deauthorization webhooks first
//     if (isDeauthWebhook(webhook_payload)) {
//       console.log("Processing Instagram deauthorization webhook")
      
//       const signature = req.headers.get('x-hub-signature-256')
//       const body = JSON.stringify(webhook_payload)
      
//       // Verify the webhook signature
//       if (!signature || !verifyInstagramWebhook(signature, body, process.env.INSTAGRAM_CLIENT_SECRET!)) {
//         console.error('Invalid webhook signature for deauth')
//         return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
//       }

//       // Handle the deauthorization
//       const result = await handleInstagramDeauthWebhook(webhook_payload)
//       return NextResponse.json(result, { status: result.status })
//     }

//     // Check for data deletion webhooks
//     if (isDataDeletionWebhook(webhook_payload)) {
//       console.log("Processing Instagram data deletion webhook")
      
//       const signature = req.headers.get('x-hub-signature-256')
//       const body = JSON.stringify(webhook_payload)
      
//       // Verify the webhook signature
//       if (!signature || !verifyInstagramWebhook(signature, body, process.env.INSTAGRAM_CLIENT_SECRET!)) {
//         console.error('Invalid webhook signature for data deletion')
//         return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
//       }

//       // Handle the data deletion request
//       const result = await handleInstagramDataDeletionWebhook(webhook_payload)
//       return NextResponse.json(result, { status: result.status })
//     }

//     // Continue with regular message/comment processing
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
//     if (isProcessed) {
//       console.log(`Message already processed: ${messageKey}`)
//       return NextResponse.json({ message: "Already processed" }, { status: 200 })
//     }

//     // Mark message as being processed
//     await markMessageAsProcessed(messageKey)

//     // Check for keyword match
//     const matcher = await matchKeyword(userMessage)

//     // Check if the conversation is already active
//     const conversationState = await client.conversationState.findUnique({
//       where: { userId },
//     })

//     let isConversationActive = conversationState?.isActive || false

//     // NEW: Handle fallback automation if no keyword and not active conversation
//     if (!isConversationActive && !matcher?.automationId) {
//       const fallbackAutomation = await getFallbackAutomation(pageId, messageType)
//       if (fallbackAutomation) {
//         console.log("Using fallback automation")

//         // Get page token
//         const token = await getPageToken(pageId)

//         // Get buttons from automation listener
//         // const buttons = fallbackAutomation.buttons
//         // const instagramButtons = buttons ? transformButtonsToInstagram(buttons) : undefined
//         const buttons = fallbackAutomation.buttons
//         const instagramButtons = buttons && Array.isArray(buttons) && buttons.every(btn => 
//           typeof btn === 'object' && btn !== null && 'name' in btn && 'payload' in btn
//         ) ? transformButtonsToInstagram(buttons as { name: string; payload: any; }[]) : undefined

//         if (messageType === "DM") {
//           await sendDM(
//             pageId,
//             senderId,
//             fallbackAutomation.listener?.prompt || "Hi, how can I help you today?",
//             token,
//             instagramButtons
//           )
//         } else if (messageType === "COMMENT" && data.commentId) {
//           await sendPrivateMessage(
//             pageId,
//             data.commentId,
//             fallbackAutomation.listener?.prompt || "Hi, how can I help you today?",
//             token,
//             instagramButtons
//           )
//         }
//         return NextResponse.json({ message: "Fallback automation triggered" }, { status: 200 })
//       } else {
//         console.log("No fallback automation found")
//         return NextResponse.json({ message: "No keyword match" }, { status: 200 })
//       }
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
//       text: "Thanks for your message! I'm a bit busy at the moment but I'll get back to you soon with a proper answer. 😊",
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
//     // Friendly fallback message
//     const fallbackText = "Thanks for your message! I'm a bit busy at the moment but I'll get back to you soon with a proper answer. 😊"

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
//   getFallbackAutomation,
//   getPageToken,
// } from "@/actions/webhook/queries"
// import { sendDM, sendPrivateMessage } from "@/lib/fetch"
// import { openai } from "@/lib/openai"
// import { client } from "@/lib/prisma"
// import { getVoiceflowResponse, processVoiceflowResponse, createVoiceflowUser } from "@/lib/voiceflow"
// import { storeConversationMessage } from "@/actions/chats/queries"
// import { createMarketingInfoAction } from "@/actions/details"
// import { analyzeLead } from "@/lib/lead-qualification"
// import { handleInstagramDeauthWebhook, handleInstagramDataDeletionWebhook } from "@/lib/deauth"
// import { verifyInstagramWebhook } from "@/utils/instagram"
// import { trackMessageForSentiment } from "@/lib/sentiment-tracker"

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

// /**
//  * Checks if webhook is a deauthorization request
//  */
// function isDeauthWebhook(payload: any): boolean {
//   return payload?.object === "instagram" && payload?.entry?.[0]?.changes?.[0]?.field === "deauthorizations"
// }

// /**
//  * Checks if webhook is a data deletion request
//  */
// function isDataDeletionWebhook(payload: any): boolean {
//   return payload?.object === "instagram" && payload?.entry?.[0]?.changes?.[0]?.field === "data_deletion"
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

//     // Check for deauthorization webhooks first
//     if (isDeauthWebhook(webhook_payload)) {
//       console.log("Processing Instagram deauthorization webhook")

//       const signature = req.headers.get("x-hub-signature-256")
//       const body = JSON.stringify(webhook_payload)

//       // Verify the webhook signature
//       if (!signature || !verifyInstagramWebhook(signature, body, process.env.INSTAGRAM_CLIENT_SECRET!)) {
//         console.error("Invalid webhook signature for deauth")
//         return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
//       }

//       // Handle the deauthorization
//       const result = await handleInstagramDeauthWebhook(webhook_payload)
//       return NextResponse.json(result, { status: result.status })
//     }

//     // Check for data deletion webhooks
//     if (isDataDeletionWebhook(webhook_payload)) {
//       console.log("Processing Instagram data deletion webhook")

//       const signature = req.headers.get("x-hub-signature-256")
//       const body = JSON.stringify(webhook_payload)

//       // Verify the webhook signature
//       if (!signature || !verifyInstagramWebhook(signature, body, process.env.INSTAGRAM_CLIENT_SECRET!)) {
//         console.error("Invalid webhook signature for data deletion")
//         return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
//       }

//       // Handle the data deletion request
//       const result = await handleInstagramDataDeletionWebhook(webhook_payload)
//       return NextResponse.json(result, { status: result.status })
//     }

//     // Continue with regular message/comment processing
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
//     if (isProcessed) {
//       console.log(`Message already processed: ${messageKey}`)
//       return NextResponse.json({ message: "Already processed" }, { status: 200 })
//     }

//     // Mark message as being processed
//     await markMessageAsProcessed(messageKey)

//     // Check for keyword match
//     const matcher = await matchKeyword(userMessage)

//     // Check if the conversation is already active
//     const conversationState = await client.conversationState.findUnique({
//       where: { userId },
//     })

//     let isConversationActive = conversationState?.isActive || false

//     // NEW: Handle fallback automation if no keyword and not active conversation
//     if (!isConversationActive && !matcher?.automationId) {
//       const fallbackAutomation = await getFallbackAutomation(pageId, messageType)
//       if (fallbackAutomation) {
//         console.log("Using fallback automation")

//         // Get page token
//         const token = await getPageToken(pageId)

//         // Get buttons from automation listener
//         // const buttons = fallbackAutomation.buttons
//         // const instagramButtons = buttons ? transformButtonsToInstagram(buttons) : undefined
//         const buttons = fallbackAutomation.buttons
//         const instagramButtons =
//           buttons &&
//           Array.isArray(buttons) &&
//           buttons.every((btn) => typeof btn === "object" && btn !== null && "name" in btn && "payload" in btn)
//             ? transformButtonsToInstagram(buttons as { name: string; payload: any }[])
//             : undefined

//         if (messageType === "DM") {
//           await sendDM(
//             pageId,
//             senderId,
//             fallbackAutomation.listener?.prompt || "Hi, how can I help you today?",
//             token,
//             instagramButtons,
//           )
//         } else if (messageType === "COMMENT" && data.commentId) {
//           await sendPrivateMessage(
//             pageId,
//             data.commentId,
//             fallbackAutomation.listener?.prompt || "Hi, how can I help you today?",
//             token,
//             instagramButtons,
//           )
//         }
//         return NextResponse.json({ message: "Fallback automation triggered" }, { status: 200 })
//       } else {
//         console.log("No fallback automation found")
//         return NextResponse.json({ message: "No keyword match" }, { status: 200 })
//       }
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
//       text: "Thanks for your message! I'm a bit busy at the moment but I'll get back to you soon with a proper answer. 😊",
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

//     // Track message for sentiment analysis (every 4 messages)
//     if (automation?.id) {
//       await trackMessageForSentiment(automation.id, pageId, senderId, userMessage)
//     }

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
//     // Friendly fallback message
//     const fallbackText =
//       "Thanks for your message! I'm a bit busy at the moment but I'll get back to you soon with a proper answer. 😊"

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

//           // Track message for sentiment analysis (every 4 messages)
//           if (automation?.id) {
//             await trackMessageForSentiment(automation.id, pageId, senderId, userMessage)
//           }

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

//             // Track message for sentiment analysis (every 4 messages)
//             if (automation?.id) {
//               await trackMessageForSentiment(automation.id, pageId, senderId, userMessage)
//             }

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

//           // Track message for sentiment analysis (every 4 messages)
//           if (automation?.id) {
//             await trackMessageForSentiment(automation.id, pageId, senderId, userMessage)
//           }

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
//   getFallbackAutomation,
//   getPageToken,
// } from "@/actions/webhook/queries"
// import { sendDM, sendPrivateMessage } from "@/lib/fetch"
// import { openai } from "@/lib/openai"
// import { client } from "@/lib/prisma"
// import { getVoiceflowResponse, processVoiceflowResponse, createVoiceflowUser } from "@/lib/voiceflow"
// import { storeConversationMessage } from "@/actions/chats/queries"
// import { analyzeLead } from "@/lib/lead-qualification"
// import { handleInstagramDeauthWebhook, handleInstagramDataDeletionWebhook } from "@/lib/deauth"
// import { verifyInstagramWebhook } from "@/utils/instagram"
// import { trackMessageForSentiment } from "@/lib/sentiment-tracker"

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

// /**
//  * Checks if webhook is a deauthorization request
//  */
// function isDeauthWebhook(payload: any): boolean {
//   return payload?.object === "instagram" && payload?.entry?.[0]?.changes?.[0]?.field === "deauthorizations"
// }

// /**
//  * Checks if webhook is a data deletion request
//  */
// function isDataDeletionWebhook(payload: any): boolean {
//   return payload?.object === "instagram" && payload?.entry?.[0]?.changes?.[0]?.field === "data_deletion"
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

//     // Check for deauthorization webhooks first
//     if (isDeauthWebhook(webhook_payload)) {
//       console.log("Processing Instagram deauthorization webhook")

//       const signature = req.headers.get("x-hub-signature-256")
//       const body = JSON.stringify(webhook_payload)

//       if (!signature || !verifyInstagramWebhook(signature, body, process.env.INSTAGRAM_CLIENT_SECRET!)) {
//         console.error("Invalid webhook signature for deauth")
//         return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
//       }

//       const result = await handleInstagramDeauthWebhook(webhook_payload)
//       return NextResponse.json(result, { status: result.status })
//     }

//     // Check for data deletion webhooks
//     if (isDataDeletionWebhook(webhook_payload)) {
//       console.log("Processing Instagram data deletion webhook")

//       const signature = req.headers.get("x-hub-signature-256")
//       const body = JSON.stringify(webhook_payload)

//       if (!signature || !verifyInstagramWebhook(signature, body, process.env.INSTAGRAM_CLIENT_SECRET!)) {
//         console.error("Invalid webhook signature for data deletion")
//         return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
//       }

//       const result = await handleInstagramDataDeletionWebhook(webhook_payload)
//       return NextResponse.json(result, { status: result.status })
//     }

//     // Continue with regular message/comment processing
//     const data = extractWebhookData(webhook_payload)
//     if (!data) {
//       return NextResponse.json({ message: "Unsupported webhook payload" }, { status: 400 })
//     }

//     const { pageId, senderId, userMessage, messageType } = data
//     const userId = `${pageId}_${senderId}`
//     const messageKey = generateMessageKey(data, startTime)

//     // Check for duplicate message processing
//     const isProcessed = await checkProcessedMessage(messageKey)
//     if (isProcessed) {
//       console.log(`Message already processed: ${messageKey}`)
//       return NextResponse.json({ message: "Already processed" }, { status: 200 })
//     }

//     // Mark message as being processed
//     await markMessageAsProcessed(messageKey)

//     // Check for keyword match
//     const matcher = await matchKeyword(userMessage)

//     // Check if the conversation is already active
//     const conversationState = await client.conversationState.findUnique({
//       where: { userId },
//     })

//     let isConversationActive = conversationState?.isActive || false

//     // Handle fallback automation if no keyword and not active conversation
//     if (!isConversationActive && !matcher?.automationId) {
//       const fallbackAutomation = await getFallbackAutomation(pageId, messageType)
//       if (fallbackAutomation) {
//         console.log("Using fallback automation")

//         const token = await getPageToken(pageId)
//         const buttons = fallbackAutomation.buttons
//         const instagramButtons =
//           buttons &&
//           Array.isArray(buttons) &&
//           buttons.every((btn) => typeof btn === "object" && btn !== null && "name" in btn && "payload" in btn)
//             ? transformButtonsToInstagram(buttons as { name: string; payload: any }[])
//             : undefined

//         if (messageType === "DM") {
//           await sendDM(
//             pageId,
//             senderId,
//             fallbackAutomation.listener?.prompt || "Hi, how can I help you today?",
//             token,
//             instagramButtons,
//           )
//         } else if (messageType === "COMMENT" && data.commentId) {
//           await sendPrivateMessage(
//             pageId,
//             data.commentId,
//             fallbackAutomation.listener?.prompt || "Hi, how can I help you today?",
//             token,
//             instagramButtons,
//           )
//         }
//         return NextResponse.json({ message: "Fallback automation triggered" }, { status: 200 })
//       } else {
//         console.log("No fallback automation found")
//         return NextResponse.json({ message: "No keyword match" }, { status: 200 })
//       }
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

//     // Process for lead qualification and get lead ID   automation?.userId && senderId !== pageId
//     let leadAnalysisResult = null
//     // if (automation?.userId) {
//     if (automation?.userId && senderId !== pageId) {
//       try {
//         leadAnalysisResult = await analyzeLead({
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
//       }
//     }

//     // Handle based on subscription plan
//     if (automation?.User?.subscription?.plan === "PRO") {
//       console.log("Using Voiceflow for PRO user")
//       await handleVoiceflowResponse(data, automation, userId, userMessage, leadAnalysisResult)
//     } else {
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

// async function handleVoiceflowResponse(
//   data: WebhookData,
//   automation: any,
//   userId: string,
//   userMessage: string,
//   leadAnalysisResult: any,
// ) {
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
//       text: "Thanks for your message! I'm a bit busy at the moment but I'll get back to you soon with a proper answer. 😊",
//       buttons: undefined,
//     }
//     let voiceflowVariables: VoiceflowVariables = {}

//     const { response, variables } = await getVoiceflowResponse(userMessage, userId, businessVariables)
//     voiceflowResponse = processVoiceflowResponse(response)
//     voiceflowVariables = variables

//     // Store marketing info if available
//     if (voiceflowVariables.clientname || voiceflowVariables.clientemail || voiceflowVariables.clientphone) {
//       try {
//         // Find the user ID from the automation
//         const automationUserId = automation?.userId

//         if (automationUserId) {
//           // Create or update marketing info linked to the user
//           await client.marketingInfo.create({
//             data: {
//               name: voiceflowVariables.clientname || voiceflowVariables.name,
//               email: voiceflowVariables.clientemail || voiceflowVariables.email,
//               phone: voiceflowVariables.clientphone || voiceflowVariables.phone,
//               userId: automationUserId,
//             },
//           })

//           // Also update the lead with the same information if we have a lead
//           if (leadAnalysisResult?.lead?.id) {
//             const existingLead = await client.lead.findUnique({
//               where: { id: leadAnalysisResult.lead.id },
//               select: { metadata: true },
//             })

//             // Safely handle the metadata as a JSON object
//             const currentMetadata = (existingLead?.metadata as Record<string, any>) || {}

//             await client.lead.update({
//               where: { id: leadAnalysisResult.lead.id },
//               data: {
//                 name: voiceflowVariables.clientname || voiceflowVariables.name,
//                 email: voiceflowVariables.clientemail || voiceflowVariables.email,
//                 phone: voiceflowVariables.clientphone || voiceflowVariables.phone,
//                 metadata: {
//                   ...currentMetadata,
//                   marketingInfoCaptured: true,
//                   lastMarketingUpdate: new Date().toISOString(),
//                 },
//               },
//             })
//           }

//           console.log("Marketing info stored successfully")
//         }
//       } catch (error) {
//         console.error("Error storing marketing info:", error)
//       }
//     }

//     // Store conversation
//     await storeConversationMessage(pageId, senderId, userMessage, false, automation?.id || null)

//     // Track message for sentiment analysis
//     if (automation?.id) {
//       await trackMessageForSentiment(automation.id, pageId, senderId, userMessage)
//     }

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
//     const fallbackText =
//       "Thanks for your message! I'm a bit busy at the moment but I'll get back to you soon with a proper answer. 😊"

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

//           if (automation?.id) {
//             await trackMessageForSentiment(automation.id, pageId, senderId, userMessage)
//           }

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

//             if (automation?.id) {
//               await trackMessageForSentiment(automation.id, pageId, senderId, userMessage)
//             }

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

//           if (automation?.id) {
//             await trackMessageForSentiment(automation.id, pageId, senderId, userMessage)
//           }

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













// import { type NextRequest, NextResponse } from "next/server"
// import { findAutomation } from "@/actions/automations/queries"
// import {
//   createChatHistory,
//   getChatHistory,
//   getKeywordPost,
//   trackResponses,
//   checkProcessedMessage,
//   markMessageAsProcessed,
//   decideTriggerAction,
//   getAutomationWithTriggers,
//   updateConversationState,
//   logTriggerExecution,
// } from "@/actions/webhook/queries"
// import { sendDM, sendPrivateMessage } from "@/lib/fetch"
// import { openai } from "@/lib/openai"
// import { client } from "@/lib/prisma"
// import { getVoiceflowResponse, processVoiceflowResponse, createVoiceflowUser } from "@/lib/voiceflow"
// import { storeConversationMessage } from "@/actions/chats/queries"
// import { analyzeLead } from "@/lib/lead-qualification"
// import { handleInstagramDeauthWebhook, handleInstagramDataDeletionWebhook } from "@/lib/deauth"
// import { verifyInstagramWebhook } from "@/utils/instagram"
// import { trackMessageForSentiment } from "@/lib/sentiment-tracker"

// import type { VoiceflowVariables } from "@/types/voiceflow"

// type InstagramQuickReply = {
//   content_type: "text"
//   title: string
//   payload: string
// }

// interface VoiceflowResponseWithButtons {
//   text: string
//   buttons?: { name: string; payload: string | object | any }[]
// }

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

// function extractWebhookData(payload: any): WebhookData | null {
//   try {
//     if (payload?.entry?.[0]?.messaging) {
//       const messaging = payload.entry[0].messaging[0]
//       const isEcho = messaging.message?.is_echo === true

//       return {
//         pageId: payload.entry[0].id,
//         senderId: messaging.sender.id,
//         recipientId: messaging.recipient.id,
//         userMessage: messaging.message.text,
//         messageId: messaging.message.mid,
//         messageType: "DM",
//         isEcho,
//       }
//     } else if (payload?.entry?.[0]?.changes && payload.entry[0].changes[0].field === "comments") {
//       return {
//         pageId: payload.entry[0].id,
//         senderId: payload.entry[0].changes[0].value.from.id,
//         userMessage: payload.entry[0].changes[0].value.text,
//         commentId: payload.entry[0].changes[0].value.id,
//         messageType: "COMMENT",
//         isEcho: false,
//       }
//     }
//   } catch (error) {
//     console.error("Error extracting webhook data:", error)
//   }
//   return null
// }

// function generateMessageKey(data: WebhookData, timestamp: number): string {
//   const baseId = data.messageId || data.commentId || `${timestamp}_${Math.random().toString(36).substr(2, 9)}`
//   const messageContent = data.userMessage.substring(0, 50)
//   const messageLength = data.userMessage.length

//   return `${data.pageId}_${data.senderId}_${baseId}_${messageLength}_${messageContent.replace(/\s+/g, "_")}`
// }

// function isDeauthWebhook(payload: any): boolean {
//   return payload?.object === "instagram" && payload?.entry?.[0]?.changes?.[0]?.field === "deauthorizations"
// }

// function isDataDeletionWebhook(payload: any): boolean {
//   return payload?.object === "instagram" && payload?.entry?.[0]?.changes?.[0]?.field === "data_deletion"
// }

// export async function GET(req: NextRequest) {
//   const hub = req.nextUrl.searchParams.get("hub.challenge")
//   return new NextResponse(hub)
// }

// export async function POST(req: NextRequest) {
//   console.log("🚀 POST request received")
//   const startTime = Date.now()
//   let webhook_payload

//   try {
//     webhook_payload = await req.json()
//     console.log("📥 Received webhook payload:", JSON.stringify(webhook_payload, null, 2))

//     if (isDeauthWebhook(webhook_payload)) {
//       console.log("🔐 Processing Instagram deauthorization webhook")
//       const signature = req.headers.get("x-hub-signature-256")
//       const body = JSON.stringify(webhook_payload)

//       if (!signature || !verifyInstagramWebhook(signature, body, process.env.INSTAGRAM_CLIENT_SECRET!)) {
//         console.error("❌ Invalid webhook signature for deauth")
//         return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
//       }

//       const result = await handleInstagramDeauthWebhook(webhook_payload)
//       return NextResponse.json(result, { status: result.status })
//     }

//     if (isDataDeletionWebhook(webhook_payload)) {
//       console.log("🗑️ Processing Instagram data deletion webhook")
//       const signature = req.headers.get("x-hub-signature-256")
//       const body = JSON.stringify(webhook_payload)

//       if (!signature || !verifyInstagramWebhook(signature, body, process.env.INSTAGRAM_CLIENT_SECRET!)) {
//         console.error("❌ Invalid webhook signature for data deletion")
//         return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
//       }

//       const result = await handleInstagramDataDeletionWebhook(webhook_payload)
//       return NextResponse.json(result, { status: result.status })
//     }

//     const data = extractWebhookData(webhook_payload)
//     if (!data) {
//       console.log("⚠️ Unsupported webhook payload structure")
//       return NextResponse.json({ message: "Unsupported webhook payload" }, { status: 400 })
//     }

//     // Skip echo messages (messages sent by the bot)
//     if (data.isEcho) {
//       console.log("🔄 Skipping echo message (sent by bot)")
//       return NextResponse.json({ message: "Echo message ignored" }, { status: 200 })
//     }

//     const { pageId, senderId, userMessage, messageType } = data
//     const conversationUserId = `${pageId}_${senderId}` // For conversation tracking
//     const messageKey = generateMessageKey(data, startTime)

//     console.log(`📨 Processing ${messageType}: "${userMessage.substring(0, 100)}..." from ${senderId}`)

//     const isProcessed = await checkProcessedMessage(messageKey)
//     if (isProcessed) {
//       console.log(`⏭️ Skipping duplicate message: ${messageKey.substring(0, 50)}...`)
//       return NextResponse.json({ message: "Duplicate message skipped" }, { status: 200 })
//     }

//     await markMessageAsProcessed(messageKey)
//     console.log(`✅ Marked message as processed: ${messageKey.substring(0, 50)}...`)

//     const triggerDecision = await decideTriggerAction(pageId, senderId, userMessage, messageType)
//     console.log(`🎯 Trigger Decision:`, triggerDecision)

//     if (triggerDecision.triggerType === "NO_MATCH") {
//       console.log("❌ No automation triggered - message ignored")
//       return NextResponse.json({ message: "No matching automation found" }, { status: 200 })
//     }

//     let automation = null
//     try {
//       automation = await getAutomationWithTriggers(triggerDecision.automationId!, messageType)
//       console.log(`🔍 Automation lookup result:`, automation ? `Found: ${automation.id}` : "Not found")
//     } catch (error) {
//       console.error(`❌ Error fetching automation ${triggerDecision.automationId}:`, error)
//     }

//     if (!automation) {
//       console.log(`❌ Automation not found or inactive: ${triggerDecision.automationId}`)
//       try {
//         const fallbackAutomation = await client.automation.findUnique({
//           where: { id: triggerDecision.automationId! },
//           include: {
//             User: {
//               select: {
//                 id: true,
//                 subscription: { select: { plan: true } },
//                 integrations: { select: { token: true } },
//               },
//             },
//             listener: true,
//             trigger: true,
//           },
//         })

//         if (fallbackAutomation) {
//           console.log(
//             `⚠️ Found automation but it may be inactive: ${fallbackAutomation.id}, active: ${fallbackAutomation.active}`,
//           )
//           automation = fallbackAutomation
//         }
//       } catch (fallbackError) {
//         console.error("❌ Fallback automation lookup failed:", fallbackError)
//       }

//       if (!automation) {
//         return NextResponse.json({ message: "Automation not found or inactive" }, { status: 404 })
//       }
//     }

//     console.log(
//       `🤖 Using automation: ${automation.id} (${automation.User?.subscription?.plan || "FREE"}) - Active: ${automation.active}`,
//     )

//     // FIXED: Log trigger execution with proper user UUID from automation owner
//     if (triggerDecision.automationId && triggerDecision.triggerId && automation.User?.id) {
//       try {
//         await logTriggerExecution({
//           triggerId: triggerDecision.triggerId,
//           automationId: triggerDecision.automationId,
//           userId: automation.User.id, // ← FIXED: Use actual user UUID, not pageId_senderId
//           messageContent: userMessage,
//           triggerType: triggerDecision.triggerType as any,
//           confidence: triggerDecision.confidence,
//           reason: triggerDecision.reason,
//           success: true,
//           responseTime: Date.now() - startTime,
//         })
//         console.log(`📊 Logged trigger execution: ${triggerDecision.triggerId}`)
//       } catch (error) {
//         console.error("❌ Error logging trigger execution:", error)
//       }
//     } else {
//       console.log(
//         `⚠️ Skipping trigger execution log - missing data: triggerId=${triggerDecision.triggerId}, automationId=${triggerDecision.automationId}, userId=${automation.User?.id}`,
//       )
//     }

//     await updateConversationState(conversationUserId, {
//       isActive: true,
//       lastTriggerType: triggerDecision.triggerType,
//       lastTriggerReason: triggerDecision.reason,
//       automationId: automation.id,
//       listenMode: triggerDecision.triggerType === "KEYWORD" ? "KEYWORDS" : "ALL_MESSAGES",
//       lastMessageLength: userMessage.length,
//     })

//     let leadAnalysisResult = null
//     if (automation.User?.id && senderId !== pageId) {
//       try {
//         leadAnalysisResult = await analyzeLead({
//           userId: automation.User.id,
//           automationId: automation.id,
//           platformId: pageId,
//           customerId: senderId,
//           message: userMessage,
//           messageType,
//           timestamp: new Date(),
//         })
//         console.log(
//           `📊 Lead analysis completed:`,
//           leadAnalysisResult?.lead?.id ? "Lead created/updated" : "No lead action",
//         )
//       } catch (error) {
//         console.error("❌ Error analyzing lead:", error)
//       }
//     }

//     if (automation.User?.subscription?.plan === "PRO") {
//       console.log("🚀 Using Voiceflow for PRO user")
//       console.log(`🔍 Automation User ID: ${automation.User?.id}`)
//       console.log(`🔍 Subscription Plan: ${automation.User?.subscription?.plan}`)
//       console.log(`🔍 Conversation User ID: ${conversationUserId}`)
//       console.log(`🔍 Message Type: ${messageType}`)
//       console.log(`🔍 User Message: "${userMessage}"`)

//       try {
//         await handleVoiceflowResponse(
//           data,
//           automation,
//           conversationUserId,
//           userMessage,
//           leadAnalysisResult,
//           triggerDecision,
//         )
//         console.log("✅ Voiceflow response handling completed")
//       } catch (error) {
//         console.error("💥 Error in Voiceflow response handling:", error)
//         throw error // Re-throw to see the full error
//       }
//     } else {
//       console.log("🤖 Using OpenAI for free user")
//       console.log(`🔍 Subscription Plan: ${automation.User?.subscription?.plan || "FREE/UNDEFINED"}`)
//       await handleOpenAIResponse(data, automation, webhook_payload, userMessage, triggerDecision)
//     }

//     const processingTime = Date.now() - startTime
//     console.log(`✅ Successfully processed message in ${processingTime}ms: ${messageKey.substring(0, 50)}...`)
//     return NextResponse.json(
//       {
//         message: "Request processed successfully",
//         processingTime,
//         triggerType: triggerDecision.triggerType,
//         automationId: automation.id,
//       },
//       { status: 200 },
//     )
//   } catch (error) {
//     console.error("💥 Unhandled error in POST function:", error)
//     return NextResponse.json(
//       {
//         message: "Error processing request",
//         error: error instanceof Error ? error.message : String(error),
//       },
//       { status: 500 },
//     )
//   }
// }

// async function handleVoiceflowResponse(
//   data: WebhookData,
//   automation: any,
//   conversationUserId: string,
//   userMessage: string,
//   leadAnalysisResult: any,
//   triggerDecision: any,
// ) {
//   console.log("🎙️ === VOICEFLOW HANDLER STARTED ===")
//   console.log(`🎙️ Data:`, { pageId: data.pageId, senderId: data.senderId, messageType: data.messageType })
//   console.log(`🎙️ Automation ID: ${automation?.id}`)
//   console.log(`🎙️ Conversation User ID: ${conversationUserId}`)
//   console.log(`🎙️ User Message: "${userMessage}"`)
//   console.log(`🎙️ Trigger Decision:`, triggerDecision)

//   const { pageId, senderId, messageType } = data

//   try {
//     console.log("🎙️ Starting Voiceflow processing...")

//     // Add a step-by-step log for each major operation
//     console.log("🎙️ Step 1: Creating Voiceflow user...")
//     const userCreated = await createVoiceflowUser(conversationUserId)
//     console.log(`🎙️ Step 1 Result: User created = ${userCreated}`)

//     if (!userCreated) {
//       console.warn(`⚠️ Failed to create Voiceflow user: ${conversationUserId}. Proceeding with the request.`)
//     }

//     console.log("🎙️ Step 2: Preparing business variables...")
//     let businessVariables: Record<string, string> = {}
//     if (automation?.User?.id) {
//       try {
//         const business = await client.business.findFirst({
//           where: { userId: automation.User.id },
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
//             trigger_type: triggerDecision.triggerType,
//             trigger_reason: triggerDecision.reason,
//             trigger_confidence: triggerDecision.confidence.toString(),
//           }

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
//               console.error("❌ Error parsing automationGoals:", e)
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
//               console.error("❌ Error parsing customerJourney:", e)
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
//               console.error("❌ Error parsing features:", e)
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
//         console.error("❌ Error fetching business:", error)
//       }
//     }

//     let voiceflowResponse: VoiceflowResponseWithButtons = {
//       text: "Thanks for your message! I'm a bit busy at the moment but I'll get back to you soon with a proper answer. 😊",
//       buttons: undefined,
//     }
//     let voiceflowVariables: VoiceflowVariables = {}

//     console.log("🎯 Getting Voiceflow response...")
//     const { response, variables } = await getVoiceflowResponse(userMessage, conversationUserId, businessVariables)
//     voiceflowResponse = processVoiceflowResponse(response)
//     voiceflowVariables = variables

//     console.log(`💬 Voiceflow response: "${voiceflowResponse.text.substring(0, 100)}..."`)
//     if (voiceflowResponse.buttons?.length) {
//       console.log(`🔘 Response includes ${voiceflowResponse.buttons.length} buttons`)
//     }

//     if (voiceflowVariables.clientname || voiceflowVariables.clientemail || voiceflowVariables.clientphone) {
//       try {
//         const automationUserId = automation?.User?.id

//         if (automationUserId) {
//           await client.marketingInfo.create({
//             data: {
//               name: voiceflowVariables.clientname || voiceflowVariables.name,
//               email: voiceflowVariables.clientemail || voiceflowVariables.email,
//               phone: voiceflowVariables.clientphone || voiceflowVariables.phone,
//               userId: automationUserId,
//             },
//           })

//           if (leadAnalysisResult?.lead?.id) {
//             const existingLead = await client.lead.findUnique({
//               where: { id: leadAnalysisResult.lead.id },
//               select: { metadata: true },
//             })

//             const currentMetadata = (existingLead?.metadata as Record<string, any>) || {}

//             await client.lead.update({
//               where: { id: leadAnalysisResult.lead.id },
//               data: {
//                 name: voiceflowVariables.clientname || voiceflowVariables.name,
//                 email: voiceflowVariables.clientemail || voiceflowVariables.email,
//                 phone: voiceflowVariables.clientphone || voiceflowVariables.phone,
//                 metadata: {
//                   ...currentMetadata,
//                   marketingInfoCaptured: true,
//                   lastMarketingUpdate: new Date().toISOString(),
//                 },
//               },
//             })
//           }

//           console.log("📝 Marketing info stored successfully")
//         }
//       } catch (error) {
//         console.error("❌ Error storing marketing info:", error)
//       }
//     }

//     await storeConversationMessage(pageId, senderId, userMessage, false, automation?.id || null)

//     if (automation?.id) {
//       await trackMessageForSentiment(automation.id, pageId, senderId, userMessage)
//     }

//     await storeConversationMessage(pageId, "bot", voiceflowResponse.text, true, automation?.id || null)

//     const instagramButtons = transformButtonsToInstagram(voiceflowResponse.buttons)
//     const token = automation?.User?.integrations?.[0]?.token || process.env.DEFAULT_PAGE_TOKEN!

//     if (messageType === "DM") {
//       console.log("📤 Sending DM response...")
//       const direct_message = await sendDM(pageId, senderId, voiceflowResponse.text, token, instagramButtons)

//       if (direct_message.status === 200) {
//         console.log("✅ DM sent successfully")
//         if (automation) {
//           await trackResponses(automation.id, "DM")
//         }
//         await createChatHistory(automation?.id || "default", pageId, senderId, userMessage)
//         await createChatHistory(automation?.id || "default", pageId, senderId, voiceflowResponse.text)
//       } else {
//         console.error("❌ Failed to send DM:", direct_message)
//       }
//     } else if (messageType === "COMMENT" && data.commentId) {
//       console.log("📤 Sending comment response...")
//       const comment = await sendPrivateMessage(pageId, data.commentId, voiceflowResponse.text, token, instagramButtons)

//       if (comment.status === 200) {
//         console.log("✅ Comment response sent successfully")
//         if (automation) {
//           await trackResponses(automation.id, "COMMENT")
//         }
//       } else {
//         console.error("❌ Failed to send comment response:", comment)
//       }
//     }
//   } catch (error) {
//     console.error("💥 Error in Voiceflow processing:", error)
//     const fallbackText =
//       "Thanks for your message! I'm a bit busy at the moment but I'll get back to you soon with a proper answer. 😊"

//     console.log("🔄 Sending fallback response...")
//     const token = automation?.User?.integrations?.[0]?.token || process.env.DEFAULT_PAGE_TOKEN!

//     if (messageType === "DM") {
//       await sendDM(pageId, senderId, fallbackText, token)
//     } else if (messageType === "COMMENT" && data.commentId) {
//       await sendPrivateMessage(pageId, data.commentId, fallbackText, token)
//     }
//   }
// }

// async function handleOpenAIResponse(
//   data: WebhookData,
//   automation: any,
//   webhook_payload: any,
//   userMessage: string,
//   triggerDecision: any,
// ) {
//   const { pageId, senderId, messageType } = data

//   console.log("🤖 Processing with OpenAI for free user...")

//   if (messageType === "DM") {
//     if (automation && automation.trigger) {
//       if (automation.listener && automation.listener.listener === "MESSAGE") {
//         console.log("📝 Using MESSAGE listener")
//         const direct_message = await sendDM(
//           pageId,
//           senderId,
//           automation.listener?.prompt,
//           automation.User?.integrations[0].token!,
//         )

//         if (direct_message.status === 200) {
//           console.log("✅ MESSAGE response sent successfully")
//           await trackResponses(automation.id, "DM")
//         }
//       }

//       if (automation.listener && automation.listener.listener === "SMARTAI") {
//         console.log("🧠 Using SMARTAI listener")
//         const smart_ai_message = await openai.chat.completions.create({
//           model: "gpt-4o",
//           messages: [
//             {
//               role: "assistant",
//               content: `${automation.listener?.prompt}: Keep responses under 2 sentences. Context: This was triggered by ${triggerDecision.triggerType} (${triggerDecision.reason})`,
//             },
//           ],
//         })

//         if (smart_ai_message.choices[0].message.content) {
//           const reciever = createChatHistory(automation.id, pageId, senderId, userMessage)
//           const sender = createChatHistory(automation.id, pageId, senderId, smart_ai_message.choices[0].message.content)

//           await client.$transaction([reciever, sender])

//           if (automation?.id) {
//             await trackMessageForSentiment(automation.id, pageId, senderId, userMessage)
//           }

//           const direct_message = await sendDM(
//             pageId,
//             senderId,
//             smart_ai_message.choices[0].message.content,
//             automation.User?.integrations[0].token!,
//           )

//           if (direct_message.status === 200) {
//             console.log("✅ SMARTAI response sent successfully")
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
//           console.log("📝 Using MESSAGE listener for comment")
//           const direct_message = await sendPrivateMessage(
//             pageId,
//             data.commentId,
//             automation.listener?.prompt,
//             automation.User?.integrations[0].token!,
//           )

//           if (direct_message.status === 200) {
//             console.log("✅ MESSAGE comment response sent successfully")
//             await trackResponses(automation.id, "COMMENT")
//           }
//         }

//         if (automation.listener.listener === "SMARTAI") {
//           console.log("🧠 Using SMARTAI listener for comment")
//           const smart_ai_message = await openai.chat.completions.create({
//             model: "gpt-4o",
//             messages: [
//               {
//                 role: "assistant",
//                 content: `${automation.listener?.prompt}: keep responses under 2 sentences. Context: This was triggered by ${triggerDecision.triggerType} (${triggerDecision.reason})`,
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

//             if (automation?.id) {
//               await trackMessageForSentiment(automation.id, pageId, senderId, userMessage)
//             }

//             const direct_message = await sendPrivateMessage(
//               pageId,
//               data.commentId,
//               smart_ai_message.choices[0].message.content,
//               automation.User?.integrations[0].token!,
//             )

//             if (direct_message.status === 200) {
//               console.log("✅ SMARTAI comment response sent successfully")
//               await trackResponses(automation.id, "COMMENT")
//             }
//           }
//         }
//       }
//     }
//   }

//   if (messageType === "DM" && data.recipientId && triggerDecision.triggerType === "HISTORY_CONTINUE") {
//     console.log("📚 Continuing conversation based on chat history")
//     const customer_history = await getChatHistory(data.recipientId, senderId)

//     if (customer_history.history.length > 0) {
//       const automation = await findAutomation(customer_history.automationId!)

//       if (automation?.listener?.listener === "SMARTAI") {
//         console.log("🧠 Using SMARTAI for conversation continuation")
//         const smart_ai_message = await openai.chat.completions.create({
//           model: "gpt-4o",
//           messages: [
//             {
//               role: "assistant",
//               content: `${automation.listener?.prompt}: keep responses under 2 sentences. Context: Continuing previous conversation.`,
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

//           if (automation?.id) {
//             await trackMessageForSentiment(automation.id, pageId, senderId, userMessage)
//           }

//           const direct_message = await sendDM(
//             pageId,
//             senderId,
//             smart_ai_message.choices[0].message.content,
//             automation.User?.integrations[0].token!,
//           )

//           if (direct_message.status === 200) {
//             console.log("✅ Conversation continuation response sent successfully")
//           }
//         }
//       }
//     }
//   }
// }





// import { type NextRequest, NextResponse } from "next/server"
// import { findAutomation } from "@/actions/automations/queries"
// import {
//   createChatHistory,
//   getChatHistory,
//   getKeywordPost,
//   trackResponses,
//   checkProcessedMessage,
//   markMessageAsProcessed,
//   decideTriggerAction,
//   getAutomationWithTriggers,
//   updateConversationState,
//   logTriggerExecution,
// } from "@/actions/webhook/queries"
// import { sendDM, sendPrivateMessage } from "@/lib/fetch"
// import { openai } from "@/lib/openai"
// import { client } from "@/lib/prisma"
// import { getVoiceflowResponse, processVoiceflowResponse, createVoiceflowUser } from "@/lib/voiceflow"
// import { storeConversationMessage } from "@/actions/chats/queries"
// import { analyzeLead } from "@/lib/lead-qualification"
// import { handleInstagramDeauthWebhook, handleInstagramDataDeletionWebhook } from "@/lib/deauth"
// import { verifyInstagramWebhook } from "@/utils/instagram"
// import { trackMessageForSentiment } from "@/lib/sentiment-tracker"

// import type { VoiceflowVariables } from "@/types/voiceflow"

// type InstagramQuickReply = {
//   content_type: "text"
//   title: string
//   payload: string
// }

// interface VoiceflowResponseWithButtons {
//   text: string
//   buttons?: { name: string; payload: string | object | any }[]
// }

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

// function extractWebhookData(payload: any): WebhookData | null {
//   try {
//     if (payload?.entry?.[0]?.messaging) {
//       const messaging = payload.entry[0].messaging[0]
//       const isEcho = messaging.message?.is_echo === true

//       return {
//         pageId: payload.entry[0].id,
//         senderId: messaging.sender.id,
//         recipientId: messaging.recipient.id,
//         userMessage: messaging.message.text,
//         messageId: messaging.message.mid,
//         messageType: "DM",
//         isEcho,
//       }
//     } else if (payload?.entry?.[0]?.changes && payload.entry[0].changes[0].field === "comments") {
//       return {
//         pageId: payload.entry[0].id,
//         senderId: payload.entry[0].changes[0].value.from.id,
//         userMessage: payload.entry[0].changes[0].value.text,
//         commentId: payload.entry[0].changes[0].value.id,
//         messageType: "COMMENT",
//         isEcho: false,
//       }
//     }
//   } catch (error) {
//     console.error("Error extracting webhook data:", error)
//   }
//   return null
// }

// function generateMessageKey(data: WebhookData, timestamp: number): string {
//   const baseId = data.messageId || data.commentId || `${timestamp}_${Math.random().toString(36).substr(2, 9)}`
//   const messageContent = data.userMessage.substring(0, 50)
//   const messageLength = data.userMessage.length

//   return `${data.pageId}_${data.senderId}_${baseId}_${messageLength}_${messageContent.replace(/\s+/g, "_")}`
// }

// function isDeauthWebhook(payload: any): boolean {
//   return payload?.object === "instagram" && payload?.entry?.[0]?.changes?.[0]?.field === "deauthorizations"
// }

// function isDataDeletionWebhook(payload: any): boolean {
//   return payload?.object === "instagram" && payload?.entry?.[0]?.changes?.[0]?.field === "data_deletion"
// }

// export async function GET(req: NextRequest) {
//   const hub = req.nextUrl.searchParams.get("hub.challenge")
//   return new NextResponse(hub)
// }

// export async function POST(req: NextRequest) {
//   console.log("🚀 POST request received")
//   const startTime = Date.now()
//   let webhook_payload

//   try {
//     webhook_payload = await req.json()
//     console.log("📥 Received webhook payload:", JSON.stringify(webhook_payload, null, 2))

//     if (isDeauthWebhook(webhook_payload)) {
//       console.log("🔐 Processing Instagram deauthorization webhook")
//       const signature = req.headers.get("x-hub-signature-256")
//       const body = JSON.stringify(webhook_payload)

//       if (!signature || !verifyInstagramWebhook(signature, body, process.env.INSTAGRAM_CLIENT_SECRET!)) {
//         console.error("❌ Invalid webhook signature for deauth")
//         return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
//       }

//       const result = await handleInstagramDeauthWebhook(webhook_payload)
//       return NextResponse.json(result, { status: result.status })
//     }

//     if (isDataDeletionWebhook(webhook_payload)) {
//       console.log("🗑️ Processing Instagram data deletion webhook")
//       const signature = req.headers.get("x-hub-signature-256")
//       const body = JSON.stringify(webhook_payload)

//       if (!signature || !verifyInstagramWebhook(signature, body, process.env.INSTAGRAM_CLIENT_SECRET!)) {
//         console.error("❌ Invalid webhook signature for data deletion")
//         return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
//       }

//       const result = await handleInstagramDataDeletionWebhook(webhook_payload)
//       return NextResponse.json(result, { status: result.status })
//     }

//     const data = extractWebhookData(webhook_payload)
//     if (!data) {
//       console.log("⚠️ Unsupported webhook payload structure")
//       return NextResponse.json({ message: "Unsupported webhook payload" }, { status: 400 })
//     }

//     // Skip echo messages (messages sent by the bot)
//     if (data.isEcho) {
//       console.log("🔄 Skipping echo message (sent by bot)")
//       return NextResponse.json({ message: "Echo message ignored" }, { status: 200 })
//     }

//     const { pageId, senderId, userMessage, messageType } = data
//     const conversationUserId = `${pageId}_${senderId}` // For conversation tracking
//     const messageKey = generateMessageKey(data, startTime)

//     console.log(`📨 Processing ${messageType}: "${userMessage.substring(0, 100)}..." from ${senderId}`)

//     const isProcessed = await checkProcessedMessage(messageKey)
//     if (isProcessed) {
//       console.log(`⏭️ Skipping duplicate message: ${messageKey.substring(0, 50)}...`)
//       return NextResponse.json({ message: "Duplicate message skipped" }, { status: 200 })
//     }

//     await markMessageAsProcessed(messageKey)
//     console.log(`✅ Marked message as processed: ${messageKey.substring(0, 50)}...`)

//     const triggerDecision = await decideTriggerAction(pageId, senderId, userMessage, messageType)
//     console.log(`🎯 Trigger Decision:`, triggerDecision)

//     if (triggerDecision.triggerType === "NO_MATCH") {
//       console.log("❌ No automation triggered - message ignored")
//       return NextResponse.json({ message: "No matching automation found" }, { status: 200 })
//     }

//     let automation = null
//     try {
//       automation = await getAutomationWithTriggers(triggerDecision.automationId!, messageType)
//       console.log(`🔍 Automation lookup result:`, automation ? `Found: ${automation.id}` : "Not found")
//     } catch (error) {
//       console.error(`❌ Error fetching automation ${triggerDecision.automationId}:`, error)
//     }

//     if (!automation) {
//       console.log(`❌ Automation not found or inactive: ${triggerDecision.automationId}`)
//       try {
//         const fallbackAutomation = await client.automation.findUnique({
//           where: { id: triggerDecision.automationId! },
//           include: {
//             User: {
//               select: {
//                 id: true,
//                 subscription: { select: { plan: true } },
//                 integrations: { select: { token: true } },
//               },
//             },
//             listener: true,
//             trigger: true,
//           },
//         })

//         if (fallbackAutomation) {
//           console.log(
//             `⚠️ Found automation but it may be inactive: ${fallbackAutomation.id}, active: ${fallbackAutomation.active}`,
//           )
//           automation = fallbackAutomation
//         }
//       } catch (fallbackError) {
//         console.error("❌ Fallback automation lookup failed:", fallbackError)
//       }

//       if (!automation) {
//         return NextResponse.json({ message: "Automation not found or inactive" }, { status: 404 })
//       }
//     }

//     console.log(
//       `🤖 Using automation: ${automation.id} (${automation.User?.subscription?.plan || "FREE"}) - Active: ${automation.active}`,
//     )

//     // FIXED: Log trigger execution with proper user UUID from automation owner
//     if (triggerDecision.automationId && triggerDecision.triggerId && automation.User?.id) {
//       try {
//         await logTriggerExecution({
//           triggerId: triggerDecision.triggerId,
//           automationId: triggerDecision.automationId,
//           userId: automation.User.id, // ← FIXED: Use actual user UUID, not pageId_senderId
//           messageContent: userMessage,
//           triggerType: triggerDecision.triggerType as any,
//           confidence: triggerDecision.confidence,
//           reason: triggerDecision.reason,
//           success: true,
//           responseTime: Date.now() - startTime,
//         })
//         console.log(`📊 Logged trigger execution: ${triggerDecision.triggerId}`)
//       } catch (error) {
//         console.error("❌ Error logging trigger execution:", error)
//       }
//     } else {
//       console.log(
//         `⚠️ Skipping trigger execution log - missing data: triggerId=${triggerDecision.triggerId}, automationId=${triggerDecision.automationId}, userId=${automation.User?.id}`,
//       )
//     }

//     await updateConversationState(conversationUserId, {
//       isActive: true,
//       lastTriggerType: triggerDecision.triggerType,
//       lastTriggerReason: triggerDecision.reason,
//       automationId: automation.id,
//       listenMode: triggerDecision.triggerType === "KEYWORD" ? "KEYWORDS" : "ALL_MESSAGES",
//       lastMessageLength: userMessage.length,
//     })

//     let leadAnalysisResult = null
//     if (automation.User?.id && senderId !== pageId) {
//       try {
//         console.log("🔍 Starting lead analysis...")

//         // Add timeout to lead analysis to prevent blocking
//         const leadAnalysisPromise = analyzeLead({
//           userId: automation.User.id,
//           automationId: automation.id,
//           platformId: pageId,
//           customerId: senderId,
//           message: userMessage,
//           messageType,
//           timestamp: new Date(),
//         })

//         // Set a 5-second timeout for lead analysis
//         const timeoutPromise = new Promise((_, reject) =>
//           setTimeout(() => reject(new Error("Lead analysis timeout")), 5000),
//         )

//         leadAnalysisResult = await Promise.race([leadAnalysisPromise, timeoutPromise])
//         console.log(
//           `📊 Lead analysis completed:`,
//           leadAnalysisResult? "Lead created/updated" : "No lead action",
//         )
//       } catch (error) {
//         console.error("❌ Error analyzing lead (continuing anyway):", error)
//         // Continue processing even if lead analysis fails
//       }
//     }

//     console.log("🎯 Lead analysis finished, proceeding to response handling...")

//     if (automation.User?.subscription?.plan === "PRO") {
//       console.log("🚀 Using Voiceflow for PRO user")
//       console.log(`🔍 Automation User ID: ${automation.User?.id}`)
//       console.log(`🔍 Subscription Plan: ${automation.User?.subscription?.plan}`)
//       console.log(`🔍 Conversation User ID: ${conversationUserId}`)
//       console.log(`🔍 Message Type: ${messageType}`)
//       console.log(`🔍 User Message: "${userMessage}"`)

//       try {
//         await handleVoiceflowResponse(
//           data,
//           automation,
//           conversationUserId,
//           userMessage,
//           leadAnalysisResult,
//           triggerDecision,
//         )
//         console.log("✅ Voiceflow response handling completed")
//       } catch (error) {
//         console.error("💥 Error in Voiceflow response handling:", error)
//         throw error // Re-throw to see the full error
//       }
//     } else {
//       console.log("🤖 Using OpenAI for free user")
//       console.log(`🔍 Subscription Plan: ${automation.User?.subscription?.plan || "FREE/UNDEFINED"}`)
//       await handleOpenAIResponse(data, automation, webhook_payload, userMessage, triggerDecision)
//     }

//     const processingTime = Date.now() - startTime
//     console.log(`✅ Successfully processed message in ${processingTime}ms: ${messageKey.substring(0, 50)}...`)
//     return NextResponse.json(
//       {
//         message: "Request processed successfully",
//         processingTime,
//         triggerType: triggerDecision.triggerType,
//         automationId: automation.id,
//       },
//       { status: 200 },
//     )
//   } catch (error) {
//     console.error("💥 Unhandled error in POST function:", error)
//     return NextResponse.json(
//       {
//         message: "Error processing request",
//         error: error instanceof Error ? error.message : String(error),
//       },
//       { status: 500 },
//     )
//   }
// }

// async function handleVoiceflowResponse(
//   data: WebhookData,
//   automation: any,
//   conversationUserId: string,
//   userMessage: string,
//   leadAnalysisResult: any,
//   triggerDecision: any,
// ) {
//   console.log("🎙️ === VOICEFLOW HANDLER STARTED ===")
//   console.log(`🎙️ Data:`, { pageId: data.pageId, senderId: data.senderId, messageType: data.messageType })
//   console.log(`🎙️ Automation ID: ${automation?.id}`)
//   console.log(`🎙️ Conversation User ID: ${conversationUserId}`)
//   console.log(`🎙️ User Message: "${userMessage}"`)
//   console.log(`🎙️ Trigger Decision:`, triggerDecision)

//   const { pageId, senderId, messageType } = data

//   try {
//     console.log("🎙️ Starting Voiceflow processing...")

//     // Add a step-by-step log for each major operation
//     console.log("🎙️ Step 1: Creating Voiceflow user...")
//     const userCreated = await createVoiceflowUser(conversationUserId)
//     console.log(`🎙️ Step 1 Result: User created = ${userCreated}`)

//     if (!userCreated) {
//       console.warn(`⚠️ Failed to create Voiceflow user: ${conversationUserId}. Proceeding with the request.`)
//     }

//     console.log("🎙️ Step 2: Preparing business variables...")
//     let businessVariables: Record<string, string> = {}
//     if (automation?.User?.id) {
//       try {
//         const business = await client.business.findFirst({
//           where: { userId: automation.User.id },
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
//             trigger_type: triggerDecision.triggerType,
//             trigger_reason: triggerDecision.reason,
//             trigger_confidence: triggerDecision.confidence.toString(),
//           }

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
//               console.error("❌ Error parsing automationGoals:", e)
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
//               console.error("❌ Error parsing customerJourney:", e)
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
//               console.error("❌ Error parsing features:", e)
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
//         console.error("❌ Error fetching business:", error)
//       }
//     }

//     let voiceflowResponse: VoiceflowResponseWithButtons = {
//       text: "Thanks for your message! I'm a bit busy at the moment but I'll get back to you soon with a proper answer. 😊",
//       buttons: undefined,
//     }
//     let voiceflowVariables: VoiceflowVariables = {}

//     console.log("🎯 Getting Voiceflow response...")
//     const { response, variables } = await getVoiceflowResponse(userMessage, conversationUserId, businessVariables)
//     voiceflowResponse = processVoiceflowResponse(response)
//     voiceflowVariables = variables

//     console.log(`💬 Voiceflow response: "${voiceflowResponse.text.substring(0, 100)}..."`)
//     if (voiceflowResponse.buttons?.length) {
//       console.log(`🔘 Response includes ${voiceflowResponse.buttons.length} buttons`)
//     }

//     if (voiceflowVariables.clientname || voiceflowVariables.clientemail || voiceflowVariables.clientphone) {
//       try {
//         const automationUserId = automation?.User?.id

//         if (automationUserId) {
//           await client.marketingInfo.create({
//             data: {
//               name: voiceflowVariables.clientname || voiceflowVariables.name,
//               email: voiceflowVariables.clientemail || voiceflowVariables.email,
//               phone: voiceflowVariables.clientphone || voiceflowVariables.phone,
//               userId: automationUserId,
//             },
//           })

//           if (leadAnalysisResult?.lead?.id) {
//             const existingLead = await client.lead.findUnique({
//               where: { id: leadAnalysisResult.lead.id },
//               select: { metadata: true },
//             })

//             const currentMetadata = (existingLead?.metadata as Record<string, any>) || {}

//             await client.lead.update({
//               where: { id: leadAnalysisResult.lead.id },
//               data: {
//                 name: voiceflowVariables.clientname || voiceflowVariables.name,
//                 email: voiceflowVariables.clientemail || voiceflowVariables.email,
//                 phone: voiceflowVariables.clientphone || voiceflowVariables.phone,
//                 metadata: {
//                   ...currentMetadata,
//                   marketingInfoCaptured: true,
//                   lastMarketingUpdate: new Date().toISOString(),
//                 },
//               },
//             })
//           }

//           console.log("📝 Marketing info stored successfully")
//         }
//       } catch (error) {
//         console.error("❌ Error storing marketing info:", error)
//       }
//     }

//     await storeConversationMessage(pageId, senderId, userMessage, false, automation?.id || null)

//     if (automation?.id) {
//       await trackMessageForSentiment(automation.id, pageId, senderId, userMessage)
//     }

//     await storeConversationMessage(pageId, "bot", voiceflowResponse.text, true, automation?.id || null)

//     const instagramButtons = transformButtonsToInstagram(voiceflowResponse.buttons)
//     const token = automation?.User?.integrations?.[0]?.token || process.env.DEFAULT_PAGE_TOKEN!

//     if (messageType === "DM") {
//       console.log("📤 Sending DM response...")
//       const direct_message = await sendDM(pageId, senderId, voiceflowResponse.text, token, instagramButtons)

//       if (direct_message.status === 200) {
//         console.log("✅ DM sent successfully")
//         if (automation) {
//           await trackResponses(automation.id, "DM")
//         }
//         await createChatHistory(automation?.id || "default", pageId, senderId, userMessage)
//         await createChatHistory(automation?.id || "default", pageId, senderId, voiceflowResponse.text)
//       } else {
//         console.error("❌ Failed to send DM:", direct_message)
//       }
//     } else if (messageType === "COMMENT" && data.commentId) {
//       console.log("📤 Sending comment response...")
//       const comment = await sendPrivateMessage(pageId, data.commentId, voiceflowResponse.text, token, instagramButtons)

//       if (comment.status === 200) {
//         console.log("✅ Comment response sent successfully")
//         if (automation) {
//           await trackResponses(automation.id, "COMMENT")
//         }
//       } else {
//         console.error("❌ Failed to send comment response:", comment)
//       }
//     }
//   } catch (error) {
//     console.error("💥 Error in Voiceflow processing:", error)
//     const fallbackText =
//       "Thanks for your message! I'm a bit busy at the moment but I'll get back to you soon with a proper answer. 😊"

//     console.log("🔄 Sending fallback response...")
//     const token = automation?.User?.integrations?.[0]?.token || process.env.DEFAULT_PAGE_TOKEN!

//     if (messageType === "DM") {
//       await sendDM(pageId, senderId, fallbackText, token)
//     } else if (messageType === "COMMENT" && data.commentId) {
//       await sendPrivateMessage(pageId, data.commentId, fallbackText, token)
//     }
//   }
// }

// async function handleOpenAIResponse(
//   data: WebhookData,
//   automation: any,
//   webhook_payload: any,
//   userMessage: string,
//   triggerDecision: any,
// ) {
//   const { pageId, senderId, messageType } = data

//   console.log("🤖 Processing with OpenAI for free user...")

//   if (messageType === "DM") {
//     if (automation && automation.trigger) {
//       if (automation.listener && automation.listener.listener === "MESSAGE") {
//         console.log("📝 Using MESSAGE listener")
//         const direct_message = await sendDM(
//           pageId,
//           senderId,
//           automation.listener?.prompt,
//           automation.User?.integrations[0].token!,
//         )

//         if (direct_message.status === 200) {
//           console.log("✅ MESSAGE response sent successfully")
//           await trackResponses(automation.id, "DM")
//         }
//       }

//       if (automation.listener && automation.listener.listener === "SMARTAI") {
//         console.log("🧠 Using SMARTAI listener")
//         const smart_ai_message = await openai.chat.completions.create({
//           model: "gpt-4o",
//           messages: [
//             {
//               role: "assistant",
//               content: `${automation.listener?.prompt}: Keep responses under 2 sentences. Context: This was triggered by ${triggerDecision.triggerType} (${triggerDecision.reason})`,
//             },
//           ],
//         })

//         if (smart_ai_message.choices[0].message.content) {
//           const reciever = createChatHistory(automation.id, pageId, senderId, userMessage)
//           const sender = createChatHistory(automation.id, pageId, senderId, smart_ai_message.choices[0].message.content)

//           await client.$transaction([reciever, sender])

//           if (automation?.id) {
//             await trackMessageForSentiment(automation.id, pageId, senderId, userMessage)
//           }

//           const direct_message = await sendDM(
//             pageId,
//             senderId,
//             smart_ai_message.choices[0].message.content,
//             automation.User?.integrations[0].token!,
//           )

//           if (direct_message.status === 200) {
//             console.log("✅ SMARTAI response sent successfully")
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
//           console.log("📝 Using MESSAGE listener for comment")
//           const direct_message = await sendPrivateMessage(
//             pageId,
//             data.commentId,
//             automation.listener?.prompt,
//             automation.User?.integrations[0].token!,
//           )

//           if (direct_message.status === 200) {
//             console.log("✅ MESSAGE comment response sent successfully")
//             await trackResponses(automation.id, "COMMENT")
//           }
//         }

//         if (automation.listener.listener === "SMARTAI") {
//           console.log("🧠 Using SMARTAI listener for comment")
//           const smart_ai_message = await openai.chat.completions.create({
//             model: "gpt-4o",
//             messages: [
//               {
//                 role: "assistant",
//                 content: `${automation.listener?.prompt}: keep responses under 2 sentences. Context: This was triggered by ${triggerDecision.triggerType} (${triggerDecision.reason})`,
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

//             if (automation?.id) {
//               await trackMessageForSentiment(automation.id, pageId, senderId, userMessage)
//             }

//             const direct_message = await sendPrivateMessage(
//               pageId,
//               data.commentId,
//               smart_ai_message.choices[0].message.content,
//               automation.User?.integrations[0].token!,
//             )

//             if (direct_message.status === 200) {
//               console.log("✅ SMARTAI comment response sent successfully")
//               await trackResponses(automation.id, "COMMENT")
//             }
//           }
//         }
//       }
//     }
//   }

//   if (messageType === "DM" && data.recipientId && triggerDecision.triggerType === "HISTORY_CONTINUE") {
//     console.log("📚 Continuing conversation based on chat history")
//     const customer_history = await getChatHistory(data.recipientId, senderId)

//     if (customer_history.history.length > 0) {
//       const automation = await findAutomation(customer_history.automationId!)

//       if (automation?.listener?.listener === "SMARTAI") {
//         console.log("🧠 Using SMARTAI for conversation continuation")
//         const smart_ai_message = await openai.chat.completions.create({
//           model: "gpt-4o",
//           messages: [
//             {
//               role: "assistant",
//               content: `${automation.listener?.prompt}: keep responses under 2 sentences. Context: Continuing previous conversation.`,
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

//           if (automation?.id) {
//             await trackMessageForSentiment(automation.id, pageId, senderId, userMessage)
//           }

//           const direct_message = await sendDM(
//             pageId,
//             senderId,
//             smart_ai_message.choices[0].message.content,
//             automation.User?.integrations[0].token!,
//           )

//           if (direct_message.status === 200) {
//             console.log("✅ Conversation continuation response sent successfully")
//           }
//         }
//       }
//     }
//   }
// }











// import { type NextRequest, NextResponse } from "next/server"
// import {
//   createChatHistory,
//   trackResponses,
//   checkProcessedMessage,
//   markMessageAsProcessed,
//   decideTriggerAction,
//   getAutomationWithTriggers,
//   updateConversationState,
//   logTriggerExecution,
// } from "@/actions/webhook/queries"
// import { getBusinessProfileForAutomation, getOrCreateDefaultAutomation } from "@/actions/webhook/business-profile"
// import { generateGeminiResponse, buildConversationContext } from "@/lib/gemini"
// import {
//   getEnhancedVoiceflowResponse,
//   createVoiceflowUser,
//   fetchEnhancedBusinessVariables,
//   calculateTypingDelay,
//   getVoiceflowHealth,
// } from "@/lib/voiceflow"
// import { sendDM, sendPrivateMessage } from "@/lib/fetch"
// import { client } from "@/lib/prisma"
// import { storeConversationMessage } from "@/actions/chats/queries"
// import { analyzeLead } from "@/lib/lead-qualification"
// import { handleInstagramDeauthWebhook, handleInstagramDataDeletionWebhook } from "@/lib/deauth"
// import { verifyInstagramWebhook } from "@/utils/instagram"
// import { trackMessageForSentiment } from "@/lib/sentiment-tracker"

// type InstagramQuickReply = {
//   content_type: "text"
//   title: string
//   payload: string
// }

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

// function extractWebhookData(payload: any): WebhookData | null {
//   try {
//     if (payload?.entry?.[0]?.messaging) {
//       const messaging = payload.entry[0].messaging[0]
//       const isEcho = messaging.message?.is_echo === true

//       return {
//         pageId: payload.entry[0].id,
//         senderId: messaging.sender.id,
//         recipientId: messaging.recipient.id,
//         userMessage: messaging.message.text,
//         messageId: messaging.message.mid,
//         messageType: "DM",
//         isEcho,
//       }
//     } else if (payload?.entry?.[0]?.changes && payload.entry[0].changes[0].field === "comments") {
//       return {
//         pageId: payload.entry[0].id,
//         senderId: payload.entry[0].changes[0].value.from.id,
//         userMessage: payload.entry[0].changes[0].value.text,
//         commentId: payload.entry[0].changes[0].value.id,
//         messageType: "COMMENT",
//         isEcho: false,
//       }
//     }
//   } catch (error) {
//     console.error("Error extracting webhook data:", error)
//   }
//   return null
// }

// function generateMessageKey(data: WebhookData, timestamp: number): string {
//   const baseId = data.messageId || data.commentId || `${timestamp}_${Math.random().toString(36).substr(2, 9)}`
//   const messageContent = data.userMessage.substring(0, 50)
//   const messageLength = data.userMessage.length

//   return `${data.pageId}_${data.senderId}_${baseId}_${messageLength}_${messageContent.replace(/\s+/g, "_")}`
// }

// function isDeauthWebhook(payload: any): boolean {
//   return payload?.object === "instagram" && payload?.entry?.[0]?.changes?.[0]?.field === "deauthorizations"
// }

// function isDataDeletionWebhook(payload: any): boolean {
//   return payload?.object === "instagram" && payload?.entry?.[0]?.changes?.[0]?.field === "data_deletion"
// }

// export async function GET(req: NextRequest) {
//   const hub = req.nextUrl.searchParams.get("hub.challenge")
//   return new NextResponse(hub)
// }

// export async function POST(req: NextRequest) {
//   console.log("🚀 POST request received")
//   const startTime = Date.now()
//   let webhook_payload

//   try {
//     webhook_payload = await req.json()
//     console.log("📥 Received webhook payload:", JSON.stringify(webhook_payload, null, 2))

//     if (isDeauthWebhook(webhook_payload)) {
//       console.log("🔐 Processing Instagram deauthorization webhook")
//       const signature = req.headers.get("x-hub-signature-256")
//       const body = JSON.stringify(webhook_payload)

//       if (!signature || !verifyInstagramWebhook(signature, body, process.env.INSTAGRAM_CLIENT_SECRET!)) {
//         console.error("❌ Invalid webhook signature for deauth")
//         return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
//       }

//       const result = await handleInstagramDeauthWebhook(webhook_payload)
//       return NextResponse.json(result, { status: result.status })
//     }

//     if (isDataDeletionWebhook(webhook_payload)) {
//       console.log("🗑️ Processing Instagram data deletion webhook")
//       const signature = req.headers.get("x-hub-signature-256")
//       const body = JSON.stringify(webhook_payload)

//       if (!signature || !verifyInstagramWebhook(signature, body, process.env.INSTAGRAM_CLIENT_SECRET!)) {
//         console.error("❌ Invalid webhook signature for data deletion")
//         return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
//       }

//       const result = await handleInstagramDataDeletionWebhook(webhook_payload)
//       return NextResponse.json(result, { status: result.status })
//     }

//     const data = extractWebhookData(webhook_payload)
//     if (!data) {
//       console.log("⚠️ Unsupported webhook payload structure")
//       return NextResponse.json({ message: "Unsupported webhook payload" }, { status: 400 })
//     }

//     // Skip echo messages (messages sent by the bot)
//     if (data.isEcho) {
//       console.log("🔄 Skipping echo message (sent by bot)")
//       return NextResponse.json({ message: "Echo message ignored" }, { status: 200 })
//     }

//     const { pageId, senderId, userMessage, messageType } = data
//     const conversationUserId = `${pageId}_${senderId}`
//     const messageKey = generateMessageKey(data, startTime)

//     console.log(`📨 Processing ${messageType}: "${userMessage.substring(0, 100)}..." from ${senderId}`)

//     const isProcessed = await checkProcessedMessage(messageKey)
//     if (isProcessed) {
//       console.log(`⏭️ Skipping duplicate message: ${messageKey.substring(0, 50)}...`)
//       return NextResponse.json({ message: "Duplicate message skipped" }, { status: 200 })
//     }

//     await markMessageAsProcessed(messageKey)
//     console.log(`✅ Marked message as processed: ${messageKey.substring(0, 50)}...`)

//     const triggerDecision = await decideTriggerAction(pageId, senderId, userMessage, messageType)
//     console.log(`🎯 Trigger Decision:`, triggerDecision)

//     let automation = null

//     // If no specific automation matched, try to get/create default automation
//     if (triggerDecision.triggerType === "NO_MATCH") {
//       console.log("🔄 No specific automation matched, checking for default automation...")
//       automation = await getOrCreateDefaultAutomation(pageId)

//       if (!automation) {
//         console.log("❌ No default automation available - message ignored")
//         return NextResponse.json({ message: "No automation available" }, { status: 200 })
//       }

//       console.log(`🎯 Using default automation: ${automation.id}`)
//     } else {
//       // Get the specific automation that was triggered
//       try {
//         automation = await getAutomationWithTriggers(triggerDecision.automationId!, messageType)
//         console.log(`🔍 Automation lookup result:`, automation ? `Found: ${automation.id}` : "Not found")
//       } catch (error) {
//         console.error(`❌ Error fetching automation ${triggerDecision.automationId}:`, error)
//       }

//       if (!automation) {
//         console.log(`❌ Specific automation not found: ${triggerDecision.automationId}`)
//         // Fallback to default automation
//         automation = await getOrCreateDefaultAutomation(pageId)
//         if (!automation) {
//           return NextResponse.json({ message: "Automation not found" }, { status: 404 })
//         }
//       }
//     }

//     const isPROUser = automation.User?.subscription?.plan === "PRO"
//     console.log(
//       `🤖 Using automation: ${automation.id} (${automation.User?.subscription?.plan || "FREE"}) - PRO: ${isPROUser}`,
//     )

//     // Log Voiceflow health
//     const voiceflowHealth = getVoiceflowHealth()
//     console.log(
//       `🏥 Voiceflow Health - Score: ${voiceflowHealth.healthScore.toFixed(2)}, State: ${voiceflowHealth.circuitBreakerState}, Cache: ${voiceflowHealth.cacheSize}`,
//     )

//     // Log trigger execution
//     if (triggerDecision.automationId && triggerDecision.triggerId && automation.User?.id) {
//       try {
//         await logTriggerExecution({
//           triggerId: triggerDecision.triggerId,
//           automationId: triggerDecision.automationId,
//           userId: automation.User.id,
//           messageContent: userMessage,
//           triggerType: triggerDecision.triggerType as any,
//           confidence: triggerDecision.confidence,
//           reason: triggerDecision.reason,
//           success: true,
//           responseTime: Date.now() - startTime,
//         })
//         console.log(`📊 Logged trigger execution: ${triggerDecision.triggerId}`)
//       } catch (error) {
//         console.error("❌ Error logging trigger execution:", error)
//       }
//     }

//     // Update conversation state
//     await updateConversationState(conversationUserId, {
//       isActive: true,
//       lastTriggerType: triggerDecision.triggerType,
//       lastTriggerReason: triggerDecision.reason,
//       automationId: automation.id,
//       listenMode: triggerDecision.triggerType === "KEYWORD" ? "KEYWORDS" : "ALL_MESSAGES",
//       lastMessageLength: userMessage.length,
//     })

//     // Lead analysis with timeout
//     let leadAnalysisResult = null
//     if (automation.User?.id && senderId !== pageId) {
//       try {
//         console.log("🔍 Starting lead analysis...")
//         const leadAnalysisPromise = analyzeLead({
//           userId: automation.User.id,
//           automationId: automation.id,
//           platformId: pageId,
//           customerId: senderId,
//           message: userMessage,
//           messageType,
//           timestamp: new Date(),
//         })

//         const timeoutPromise = new Promise((_, reject) =>
//           setTimeout(() => reject(new Error("Lead analysis timeout")), 5000),
//         )

//         leadAnalysisResult = await Promise.race([leadAnalysisPromise, timeoutPromise])
//         console.log(`📊 Lead analysis completed`)
//       } catch (error) {
//         console.error("❌ Error analyzing lead (continuing anyway):", error)
//       }
//     }

//     console.log("🎯 Lead analysis finished, proceeding to response handling...")

//     // 🚀 ENHANCED: Route based on subscription plan with intelligent fallback
//     if (isPROUser) {
//       console.log("🎙️ Using Enhanced Voiceflow for PRO user (with intelligent Gemini fallback)")
//       await handleSuperiorVoiceflowResponse(
//         data,
//         automation,
//         conversationUserId,
//         userMessage,
//         leadAnalysisResult,
//         triggerDecision,
//       )
//     } else {
//       console.log("🔮 Using Enhanced Gemini for non-PRO user")
//       await handleSuperiorGeminiResponse(data, automation, userMessage, triggerDecision)
//     }

//     const processingTime = Date.now() - startTime
//     console.log(`✅ Successfully processed message in ${processingTime}ms: ${messageKey.substring(0, 50)}...`)
//     return NextResponse.json(
//       {
//         message: "Request processed successfully",
//         processingTime,
//         triggerType: triggerDecision.triggerType,
//         automationId: automation.id,
//         aiSystem: isPROUser ? "enhanced_voiceflow_with_gemini_fallback" : "enhanced_gemini",
//         voiceflowHealth: voiceflowHealth,
//       },
//       { status: 200 },
//     )
//   } catch (error) {
//     console.error("💥 Unhandled error in POST function:", error)
//     return NextResponse.json(
//       {
//         message: "Error processing request",
//         error: error instanceof Error ? error.message : String(error),
//       },
//       { status: 500 },
//     )
//   }
// }

// async function handleSuperiorVoiceflowResponse(
//   data: WebhookData,
//   automation: any,
//   conversationUserId: string,
//   userMessage: string,
//   leadAnalysisResult: any,
//   triggerDecision: any,
// ) {
//   console.log("🎙️ === SUPERIOR VOICEFLOW HANDLER STARTED ===")
//   const { pageId, senderId, messageType } = data

//   try {
//     console.log("🎙️ Starting superior Voiceflow processing...")

//     const userCreated = await createVoiceflowUser(conversationUserId)
//     console.log(`🎙️ User created: ${userCreated}`)

//     // Build enhanced conversation context
//     const conversationHistory = await buildConversationContext(pageId, senderId, automation.id)
//     const { profileContent, businessContext } = await getBusinessProfileForAutomation(automation.id)

//     // Determine customer type and context
//     const isNewUser = conversationHistory.length === 0
//     const customerType = conversationHistory.length >= 10 ? "VIP" : conversationHistory.length > 0 ? "RETURNING" : "NEW"

//     console.log("📋 Building enhanced business variables with conversation context...")
//     const businessVariables = await fetchEnhancedBusinessVariables(automation.User?.id || "", automation.id, {
//       pageId,
//       senderId,
//       userMessage,
//       isNewUser,
//       customerType,
//       messageHistory: conversationHistory,
//     })

//     console.log("🎯 Attempting enhanced Voiceflow response...")
//     const voiceflowResult = await getEnhancedVoiceflowResponse(userMessage, conversationUserId, businessVariables, {
//       maxRetries: 3,
//       timeoutMs: 15000,
//       enableFallbackDetection: true,
//     })

//     let finalResponse: string
//     let finalButtons: any[] | undefined
//     let aiSystemUsed: string
//     let typingDelay: number
//     let responseComplexity: "simple" | "medium" | "complex" = "medium"

//     if (voiceflowResult.success && voiceflowResult.response) {
//       console.log("✅ Enhanced Voiceflow response successful")
//       finalResponse = voiceflowResult.response.text
//       finalButtons = voiceflowResult.response.buttons
//       responseComplexity = voiceflowResult.response.complexity || "medium"
//       aiSystemUsed = "enhanced_voiceflow"

//       // Handle marketing info capture
//       if (
//         voiceflowResult.variables?.clientname ||
//         voiceflowResult.variables?.clientemail ||
//         voiceflowResult.variables?.clientphone
//       ) {
//         try {
//           const automationUserId = automation?.User?.id

//           if (automationUserId) {
//             await client.marketingInfo.create({
//               data: {
//                 name: voiceflowResult.variables.clientname || voiceflowResult.variables.name,
//                 email: voiceflowResult.variables.clientemail || voiceflowResult.variables.email,
//                 phone: voiceflowResult.variables.clientphone || voiceflowResult.variables.phone,
//                 userId: automationUserId,
//               },
//             })

//             if (leadAnalysisResult?.lead?.id) {
//               const existingLead = await client.lead.findUnique({
//                 where: { id: leadAnalysisResult.lead.id },
//                 select: { metadata: true },
//               })

//               const currentMetadata = (existingLead?.metadata as Record<string, any>) || {}

//               await client.lead.update({
//                 where: { id: leadAnalysisResult.lead.id },
//                 data: {
//                   name: voiceflowResult.variables.clientname || voiceflowResult.variables.name,
//                   email: voiceflowResult.variables.clientemail || voiceflowResult.variables.email,
//                   phone: voiceflowResult.variables.clientphone || voiceflowResult.variables.phone,
//                   metadata: {
//                     ...currentMetadata,
//                     marketingInfoCaptured: true,
//                     lastMarketingUpdate: new Date().toISOString(),
//                     voiceflowHealthScore: voiceflowResult.healthScore,
//                   },
//                 },
//               })
//             }

//             console.log("📝 Marketing info stored successfully")
//           }
//         } catch (error) {
//           console.error("❌ Error storing marketing info:", error)
//         }
//       }

//       // Handle human handoff if required
//       if (voiceflowResult.response.requiresHumanHandoff) {
//         console.log("🤝 Human handoff required, updating conversation state...")
//         await updateConversationState(conversationUserId, {
//           isInHandoff: true,
//           handoffReason: "Voiceflow requested human handoff",
//         })
//       }
//     } else {
//       console.log(
//         `🔄 Voiceflow failed (${voiceflowResult.fallbackReason}), falling back to superior Gemini for PRO user`,
//       )

//       // Superior Gemini fallback for PRO users
//       finalResponse = await generateGeminiResponse({
//         userMessage,
//         businessProfile: profileContent,
//         conversationHistory,
//         businessContext,
//         isPROUser: true,
//         isVoiceflowFallback: true,
//         voiceflowAttemptedResponse: voiceflowResult.error,
//       })

//       finalButtons = undefined
//       aiSystemUsed = "superior_gemini_pro_fallback"
//       responseComplexity = "complex" // PRO users get complex responses

//       console.log("✅ Superior Gemini fallback response generated for PRO user")
//     }

//     // Calculate intelligent typing delay
//     typingDelay = calculateTypingDelay(finalResponse.length, {
//       isPROUser: true,
//       messageComplexity: responseComplexity,
//       includeThinkingTime: true,
//       baseWPM: 50, // Slightly faster for PRO users
//     })

//     console.log(
//       `💬 Final response (${aiSystemUsed}): "${finalResponse.substring(0, 100)}..." (${finalResponse.length} chars, ${Math.round(typingDelay / 1000)}s delay)`,
//     )

//     // Store conversation messages
//     await storeConversationMessage(pageId, senderId, userMessage, false, automation?.id || null)
//     if (automation?.id) {
//       await trackMessageForSentiment(automation.id, pageId, senderId, userMessage)
//     }
//     await storeConversationMessage(pageId, "bot", finalResponse, true, automation?.id || null)

//     // Add natural typing delay for PRO users
//     if (typingDelay > 1000) {
//       console.log(`⏳ Adding natural typing delay: ${Math.round(typingDelay / 1000)}s`)
//       await new Promise((resolve) => setTimeout(resolve, typingDelay))
//     }

//     // Send response
//     const instagramButtons = transformButtonsToInstagram(finalButtons)
//     const token = automation?.User?.integrations?.[0]?.token || process.env.DEFAULT_PAGE_TOKEN!

//     if (messageType === "DM") {
//       console.log("📤 Sending superior DM response...")
//       const direct_message = await sendDM(pageId, senderId, finalResponse, token, instagramButtons)

//       if (direct_message.status === 200) {
//         console.log("✅ Superior DM sent successfully")
//         if (automation) {
//           await trackResponses(automation.id, "DM")
//         }
//         await createChatHistory(automation?.id || "default", pageId, senderId, userMessage)
//         await createChatHistory(automation?.id || "default", pageId, senderId, finalResponse)
//       } else {
//         console.error("❌ Failed to send DM:", direct_message)
//       }
//     } else if (messageType === "COMMENT" && data.commentId) {
//       console.log("📤 Sending superior comment response...")
//       const comment = await sendPrivateMessage(pageId, data.commentId, finalResponse, token, instagramButtons)

//       if (comment.status === 200) {
//         console.log("✅ Superior comment response sent successfully")
//         if (automation) {
//           await trackResponses(automation.id, "COMMENT")
//         }
//       } else {
//         console.error("❌ Failed to send comment response:", comment)
//       }
//     }
//   } catch (error) {
//     console.error("💥 Error in superior Voiceflow processing:", error)

//     // Final fallback to superior Gemini
//     console.log("🔄 Final fallback to superior Gemini due to error...")
//     await handleSuperiorGeminiResponse(data, automation, userMessage, triggerDecision, true)
//   }
// }

// async function handleSuperiorGeminiResponse(
//   data: WebhookData,
//   automation: any,
//   userMessage: string,
//   triggerDecision: any,
//   isErrorFallback = false,
// ) {
//   console.log("🔮 === SUPERIOR GEMINI HANDLER STARTED ===")
//   const { pageId, senderId, messageType } = data

//   try {
//     // Get business profile and conversation context
//     const { profileContent, businessContext } = await getBusinessProfileForAutomation(automation.id)
//     const conversationHistory = await buildConversationContext(pageId, senderId, automation.id)
//     console.log("📋 Business profile and conversation context loaded for superior Gemini")

//     const isPROUser = automation.User?.subscription?.plan === "PRO"

//     console.log("🔮 Generating superior Gemini response...")
//     const geminiResponse = await generateGeminiResponse({
//       userMessage,
//       businessProfile: profileContent,
//       conversationHistory,
//       businessContext,
//       isPROUser,
//       isVoiceflowFallback: isErrorFallback,
//     })

//     // Calculate intelligent typing delay
//     const typingDelay = calculateTypingDelay(geminiResponse.length, {
//       isPROUser,
//       messageComplexity: isPROUser ? "complex" : "medium",
//       includeThinkingTime: true,
//     })

//     console.log(
//       `💬 Superior Gemini response: "${geminiResponse.substring(0, 100)}..." (${geminiResponse.length} chars, ${Math.round(typingDelay / 1000)}s delay)`,
//     )

//     // Store conversation messages
//     await storeConversationMessage(pageId, senderId, userMessage, false, automation?.id || null)
//     if (automation?.id) {
//       await trackMessageForSentiment(automation.id, pageId, senderId, userMessage)
//     }
//     await storeConversationMessage(pageId, "bot", geminiResponse, true, automation?.id || null)

//     // Add natural typing delay
//     if (typingDelay > 1000) {
//       console.log(`⏳ Adding natural typing delay: ${Math.round(typingDelay / 1000)}s`)
//       await new Promise((resolve) => setTimeout(resolve, typingDelay))
//     }

//     // Send response
//     const token = automation?.User?.integrations?.[0]?.token || process.env.DEFAULT_PAGE_TOKEN!

//     if (messageType === "DM") {
//       console.log("📤 Sending superior DM response...")
//       const direct_message = await sendDM(pageId, senderId, geminiResponse, token)

//       if (direct_message.status === 200) {
//         console.log("✅ Superior DM sent successfully")
//         if (automation) {
//           await trackResponses(automation.id, "DM")
//         }
//         await createChatHistory(automation?.id || "default", pageId, senderId, userMessage)
//         await createChatHistory(automation?.id || "default", pageId, senderId, geminiResponse)
//       } else {
//         console.error("❌ Failed to send DM:", direct_message)
//       }
//     } else if (messageType === "COMMENT" && data.commentId) {
//       console.log("📤 Sending superior comment response...")
//       const comment = await sendPrivateMessage(pageId, data.commentId, geminiResponse, token)

//       if (comment.status === 200) {
//         console.log("✅ Superior comment response sent successfully")
//         if (automation) {
//           await trackResponses(automation.id, "COMMENT")
//         }
//       } else {
//         console.error("❌ Failed to send comment response:", comment)
//       }
//     }
//   } catch (error) {
//     console.error("💥 Error in superior Gemini processing:", error)
//     const fallbackText =
//       "Thanks for your message! I'm here to help. Let me get back to you with the right information. 😊"

//     console.log("🔄 Sending final fallback response...")
//     const token = automation?.User?.integrations?.[0]?.token || process.env.DEFAULT_PAGE_TOKEN!

//     if (messageType === "DM") {
//       await sendDM(pageId, senderId, fallbackText, token)
//     } else if (messageType === "COMMENT" && data.commentId) {
//       await sendPrivateMessage(pageId, data.commentId, fallbackText, token)
//     }
//   }
// }



// import { type NextRequest, NextResponse } from "next/server"

// import {
//   createChatHistory,
//   trackResponses,
//   checkProcessedMessage,
//   markMessageAsProcessed,
//   decideTriggerAction,
//   getAutomationWithTriggers,
//   updateConversationState,
//   logTriggerExecution,
//   checkDuplicateResponse,
//   markResponseAsSent,
//   getRecentResponseCount,
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

// type InstagramQuickReply = {
//   content_type: "text"
//   title: string
//   payload: string
// }

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

// function extractWebhookData(payload: any): WebhookData | null {
//   try {
//     if (payload?.entry?.[0]?.messaging) {
//       const messaging = payload.entry[0].messaging[0]

//       // Check if this is a read receipt - ignore these
//       if (messaging.read) {
//         console.log("📖 Received read receipt - ignoring")
//         return null
//       }

//       // Check if this is a delivery receipt - ignore these
//       if (messaging.delivery) {
//         console.log("📬 Received delivery receipt - ignoring")
//         return null
//       }

//       // Check if this is a regular message
//       if (messaging.message) {
//         const isEcho = messaging.message?.is_echo === true

//         // Make sure the message has text content
//         if (!messaging.message.text) {
//           console.log("📷 Received message without text (possibly media) - ignoring")
//           return null
//         }

//         return {
//           pageId: payload.entry[0].id,
//           senderId: messaging.sender.id,
//           recipientId: messaging.recipient.id,
//           userMessage: messaging.message.text,
//           messageId: messaging.message.mid,
//           messageType: "DM",
//           isEcho,
//         }
//       }

//       // Check if this is a postback (button click)
//       if (messaging.postback) {
//         return {
//           pageId: payload.entry[0].id,
//           senderId: messaging.sender.id,
//           recipientId: messaging.recipient.id,
//           userMessage: messaging.postback.payload || messaging.postback.title || "Button clicked",
//           messageId: `postback_${Date.now()}`,
//           messageType: "DM",
//           isEcho: false,
//         }
//       }
//     } else if (payload?.entry?.[0]?.changes && payload.entry[0].changes[0].field === "comments") {
//       const changeValue = payload.entry[0].changes[0].value

//       // Make sure the comment has text
//       if (!changeValue.text) {
//         console.log("📷 Received comment without text - ignoring")
//         return null
//       }

//       return {
//         pageId: payload.entry[0].id,
//         senderId: changeValue.from.id,
//         userMessage: changeValue.text,
//         commentId: changeValue.id,
//         messageType: "COMMENT",
//         isEcho: false,
//       }
//     }
//   } catch (error) {
//     console.error("Error extracting webhook data:", error)
//   }

//   return null
// }

// function generateMessageKey(data: WebhookData, timestamp: number): string {
//   const baseId = data.messageId || data.commentId || `${timestamp}_${Math.random().toString(36).substr(2, 9)}`
//   const messageContent = data.userMessage.substring(0, 50)
//   const messageLength = data.userMessage.length
//   return `${data.pageId}_${data.senderId}_${baseId}_${messageLength}_${messageContent.replace(/\s+/g, "_")}`
// }

// function isDeauthWebhook(payload: any): boolean {
//   return payload?.object === "instagram" && payload?.entry?.[0]?.changes?.[0]?.field === "deauthorizations"
// }

// function isDataDeletionWebhook(payload: any): boolean {
//   return payload?.object === "instagram" && payload?.entry?.[0]?.changes?.[0]?.field === "data_deletion"
// }

// function isReadReceiptOrDelivery(payload: any): boolean {
//   if (payload?.entry?.[0]?.messaging) {
//     const messaging = payload.entry[0].messaging[0]
//     return !!(messaging.read || messaging.delivery)
//   }
//   return false
// }

// export async function GET(req: NextRequest) {
//   const hub = req.nextUrl.searchParams.get("hub.challenge")
//   return new NextResponse(hub)
// }

// export async function POST(req: NextRequest) {
//   console.log("🚀 POST request received")
//   const startTime = Date.now()
//   let webhook_payload

//   try {
//     webhook_payload = await req.json()
//     console.log("📥 Received webhook payload:", JSON.stringify(webhook_payload, null, 2))

//     // Handle deauth webhooks
//     if (isDeauthWebhook(webhook_payload)) {
//       console.log("🔐 Processing Instagram deauthorization webhook")
//       const signature = req.headers.get("x-hub-signature-256")
//       const body = JSON.stringify(webhook_payload)

//       if (!signature || !verifyInstagramWebhook(signature, body, process.env.INSTAGRAM_CLIENT_SECRET!)) {
//         console.error("❌ Invalid webhook signature for deauth")
//         return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
//       }

//       const result = await handleInstagramDeauthWebhook(webhook_payload)
//       return NextResponse.json(result, { status: result.status })
//     }

//     // Handle data deletion webhooks
//     if (isDataDeletionWebhook(webhook_payload)) {
//       console.log("🗑️ Processing Instagram data deletion webhook")
//       const signature = req.headers.get("x-hub-signature-256")
//       const body = JSON.stringify(webhook_payload)

//       if (!signature || !verifyInstagramWebhook(signature, body, process.env.INSTAGRAM_CLIENT_SECRET!)) {
//         console.error("❌ Invalid webhook signature for data deletion")
//         return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
//       }

//       const result = await handleInstagramDataDeletionWebhook(webhook_payload)
//       return NextResponse.json(result, { status: result.status })
//     }

//     // Handle read receipts and delivery confirmations - just acknowledge them
//     if (isReadReceiptOrDelivery(webhook_payload)) {
//       console.log("📖 Received read receipt or delivery confirmation - acknowledging")
//       return NextResponse.json({ message: "Read receipt acknowledged" }, { status: 200 })
//     }

//     const data = extractWebhookData(webhook_payload)

//     if (!data) {
//       console.log("⚠️ Unsupported webhook payload structure or non-text message")
//       return NextResponse.json({ message: "Unsupported webhook payload" }, { status: 200 })
//     }

//     // Skip echo messages (messages sent by the bot)
//     if (data.isEcho) {
//       console.log("🔄 Skipping echo message (sent by bot)")
//       return NextResponse.json({ message: "Echo message ignored" }, { status: 200 })
//     }

//     const { pageId, senderId, userMessage, messageType } = data
//     const conversationUserId = `${pageId}_${senderId}`
//     const messageKey = generateMessageKey(data, startTime)

//     console.log(`📨 Processing ${messageType}: "${userMessage.substring(0, 100)}..." from ${senderId}`)

//     const isProcessed = await checkProcessedMessage(messageKey)
//     if (isProcessed) {
//       console.log(`⏭️ Skipping duplicate message: ${messageKey.substring(0, 50)}...`)
//       return NextResponse.json({ message: "Duplicate message skipped" }, { status: 200 })
//     }

//     await markMessageAsProcessed(messageKey)
//     console.log(`✅ Marked message as processed: ${messageKey.substring(0, 50)}...`)

//     const triggerDecision = await decideTriggerAction(pageId, senderId, userMessage, messageType)
//     console.log(`🎯 Trigger Decision:`, triggerDecision)

//     let automation = null

//     // If no specific automation matched, try to get/create default automation
//     if (triggerDecision.triggerType === "NO_MATCH") {
//       console.log("🔄 No specific automation matched, checking for default automation...")
//       automation = await getOrCreateDefaultAutomation(pageId)
//       if (!automation) {
//         console.log("❌ No default automation available - message ignored")
//         return NextResponse.json({ message: "No automation available" }, { status: 200 })
//       }
//       console.log(`🎯 Using default automation: ${automation.id}`)
//     } else {
//       // Get the specific automation that was triggered
//       try {
//         automation = await getAutomationWithTriggers(triggerDecision.automationId!, messageType)
//         console.log(`🔍 Automation lookup result:`, automation ? `Found: ${automation.id}` : "Not found")
//       } catch (error) {
//         console.error(`❌ Error fetching automation ${triggerDecision.automationId}:`, error)
//       }

//       if (!automation) {
//         console.log(`❌ Specific automation not found: ${triggerDecision.automationId}`)
//         // Fallback to default automation
//         automation = await getOrCreateDefaultAutomation(pageId)
//         if (!automation) {
//           return NextResponse.json({ message: "Automation not found" }, { status: 404 })
//         }
//       }
//     }

//     const isPROUser = automation.User?.subscription?.plan === "PRO"
//     console.log(
//       `🤖 Using automation: ${automation.id} (${automation.User?.subscription?.plan || "FREE"}) - PRO: ${isPROUser}`,
//     )

//     // Log Voiceflow health
//     const voiceflowHealth = getVoiceflowHealth()
//     console.log(
//       `🏥 Voiceflow Health - Score: ${voiceflowHealth.healthScore.toFixed(2)}, State: ${voiceflowHealth.circuitBreakerState}, Cache: ${voiceflowHealth.cacheSize}`,
//     )

//     // Log trigger execution
//     if (triggerDecision.automationId && triggerDecision.triggerId && automation.User?.id) {
//       try {
//         await logTriggerExecution({
//           triggerId: triggerDecision.triggerId,
//           automationId: triggerDecision.automationId,
//           userId: automation.User.id,
//           messageContent: userMessage,
//           triggerType: triggerDecision.triggerType as any,
//           confidence: triggerDecision.confidence,
//           reason: triggerDecision.reason,
//           success: true,
//           responseTime: Date.now() - startTime,
//         })
//         console.log(`📊 Logged trigger execution: ${triggerDecision.triggerId}`)
//       } catch (error) {
//         console.error("❌ Error logging trigger execution:", error)
//       }
//     }

//     // Update conversation state
//     await updateConversationState(conversationUserId, {
//       isActive: true,
//       lastTriggerType: triggerDecision.triggerType,
//       lastTriggerReason: triggerDecision.reason,
//       automationId: automation.id,
//       listenMode: triggerDecision.triggerType === "KEYWORD" ? "KEYWORDS" : "ALL_MESSAGES",
//       lastMessageLength: userMessage.length,
//     })

//     // 🚀 ENHANCED: Route based on subscription plan with intelligent fallback and data collection
//     if (isPROUser) {
//       console.log("🎙️ Using Enhanced Voiceflow with Data Collection for PRO user")
//       await handleEnhancedVoiceflowWithDataCollection(
//         data,
//         automation,
//         conversationUserId,
//         userMessage,
//         triggerDecision,
//       )
//     } else {
//       console.log("🔮 Using Enhanced Gemini for non-PRO user")
//       await handleEnhancedGeminiResponse(data, automation, userMessage, triggerDecision)
//     }

//     const processingTime = Date.now() - startTime
//     console.log(`✅ Successfully processed message in ${processingTime}ms: ${messageKey.substring(0, 50)}...`)

//     return NextResponse.json(
//       {
//         message: "Request processed successfully",
//         processingTime,
//         triggerType: triggerDecision.triggerType,
//         automationId: automation.id,
//         aiSystem: isPROUser ? "enhanced_voiceflow_with_data_collection" : "enhanced_gemini",
//         voiceflowHealth: voiceflowHealth,
//       },
//       { status: 200 },
//     )
//   } catch (error) {
//     console.error("💥 Unhandled error in POST function:", error)
//     return NextResponse.json(
//       {
//         message: "Error processing request",
//         error: error instanceof Error ? error.message : String(error),
//       },
//       { status: 500 },
//     )
//   }
// }

// async function handleEnhancedVoiceflowWithDataCollection(
//   data: WebhookData,
//   automation: any,
//   conversationUserId: string,
//   userMessage: string,
//   triggerDecision: any,
// ) {
//   console.log("🎙️ === ENHANCED VOICEFLOW WITH DATA COLLECTION STARTED ===")
//   const { pageId, senderId, messageType } = data

//   try {
//     // Check if we've sent too many responses recently (rate limiting)
//     const recentResponseCount = await getRecentResponseCount(pageId, senderId, messageType, 2)
//     if (recentResponseCount >= 3) {
//       console.log(`🚫 Rate limit: ${recentResponseCount} responses sent in last 2 minutes, skipping`)
//       return
//     }

//     console.log("🎙️ Starting enhanced Voiceflow processing with data collection...")
//     const userCreated = await createVoiceflowUser(conversationUserId)
//     console.log(`🎙️ User created: ${userCreated}`)

//     // Build enhanced conversation context
//     const conversationHistory = await buildConversationContext(pageId, senderId, automation.id)
//     const { profileContent, businessContext } = await getBusinessProfileForAutomation(automation.id)

//     // Determine customer type and context
//     const isNewUser = conversationHistory.length === 0
//     const customerType = conversationHistory.length >= 10 ? "VIP" : conversationHistory.length > 0 ? "RETURNING" : "NEW"

//     console.log("📋 Building enhanced business variables with conversation context...")
//     const businessVariables = await fetchEnhancedBusinessVariables(automation.User?.id || "", automation.id, {
//       pageId,
//       senderId,
//       userMessage,
//       isNewUser,
//       customerType,
//       messageHistory: conversationHistory,
//     })

//     console.log("🎯 Attempting enhanced Voiceflow response with data collection...")
//     const voiceflowResult = await getEnhancedVoiceflowResponse(userMessage, conversationUserId, businessVariables)

//     let finalResponse: string
//     let finalButtons: any[] | undefined
//     let aiSystemUsed: string
//     let extractedCustomerData: any = {}

//     if (voiceflowResult.success && voiceflowResult.response) {
//       console.log("✅ Enhanced Voiceflow response with data collection successful")
//       finalResponse = voiceflowResult.response.text
//       finalButtons = voiceflowResult.response.buttons
//       aiSystemUsed = "enhanced_voiceflow"

//       // Simple data extraction from Voiceflow variables
//       if (voiceflowResult.success && voiceflowResult.variables) {
//         extractedCustomerData = {
//           name:
//             voiceflowResult.variables.customer_name ||
//             voiceflowResult.variables.clientname ||
//             voiceflowResult.variables.name,
//           email:
//             voiceflowResult.variables.customer_email ||
//             voiceflowResult.variables.clientemail ||
//             voiceflowResult.variables.email,
//           phone:
//             voiceflowResult.variables.customer_phone ||
//             voiceflowResult.variables.clientphone ||
//             voiceflowResult.variables.phone,
//         }
//       }

//       // Enhanced lead analysis with collected data
//       let leadAnalysisResult = null
//       if (automation.User?.id && senderId !== pageId) {
//         try {
//           console.log("🔍 Starting enhanced lead analysis with collected data...")
//           leadAnalysisResult = await analyzeLead({
//             userId: automation.User.id,
//             automationId: automation.id,
//             platformId: pageId,
//             customerId: senderId,
//             message: userMessage,
//             messageType,
//             timestamp: new Date(),
//           })
//           console.log(`📊 Enhanced lead analysis completed`)
//         } catch (error) {
//           console.error("❌ Error in enhanced lead analysis (continuing anyway):", error)
//         }
//       }

//       // Handle marketing info capture (name, email, phone only)
//       if (extractedCustomerData.name || extractedCustomerData.email || extractedCustomerData.phone) {
//         try {
//           const automationUserId = automation?.User?.id
//           if (automationUserId) {
//             // Create marketing info without metadata field (it doesn't exist in the schema)
//             await client.marketingInfo.create({
//               data: {
//                 name: extractedCustomerData.name,
//                 email: extractedCustomerData.email,
//                 phone: extractedCustomerData.phone,
//                 userId: automationUserId,
//               },
//             })

//             if (leadAnalysisResult?.lead?.id) {
//               await client.lead.update({
//                 where: { id: leadAnalysisResult.lead.id },
//                 data: {
//                   name: extractedCustomerData.name,
//                   email: extractedCustomerData.email,
//                   phone: extractedCustomerData.phone,
//                   metadata: {
//                     basicDataCollection: {
//                       name: extractedCustomerData.name,
//                       email: extractedCustomerData.email,
//                       phone: extractedCustomerData.phone,
//                       lastDataUpdate: new Date().toISOString(),
//                     },
//                   },
//                 },
//               })
//             }
//             console.log("📝 Basic marketing info stored successfully")
//           }
//         } catch (error) {
//           console.error("❌ Error storing basic marketing info:", error)
//         }
//       }
//     } else {
//       console.log(`🔄 Voiceflow failed, falling back to enhanced Gemini for PRO user`)
//       // Enhanced Gemini fallback for PRO users with collected data context
//       finalResponse = await generateGeminiResponse({
//         userMessage,
//         businessProfile: profileContent,
//         conversationHistory,
//         businessContext,
//         isPROUser: true,
//         isVoiceflowFallback: true,
//         voiceflowAttemptedResponse: voiceflowResult.error,
//       })
//       finalButtons = undefined
//       aiSystemUsed = "enhanced_gemini_pro_fallback_with_data"
//       console.log("✅ Enhanced Gemini fallback response generated for PRO user with data context")
//     }

//     // 🚫 CHECK FOR DUPLICATE RESPONSE BEFORE SENDING
//     const isDuplicate = await checkDuplicateResponse(pageId, senderId, finalResponse, messageType)
//     if (isDuplicate) {
//       console.log("🚫 Duplicate response detected, skipping send")
//       return
//     }

//     console.log(
//       `💬 Final response (${aiSystemUsed}): "${finalResponse.substring(0, 100)}..." (${finalResponse.length} chars)`,
//     )

//     // Store conversation messages
//     await storeConversationMessage(pageId, senderId, userMessage, false, automation?.id || null)
//     if (automation?.id) {
//       await trackMessageForSentiment(automation.id, pageId, senderId, userMessage)
//     }
//     await storeConversationMessage(pageId, "bot", finalResponse, true, automation?.id || null)

//     // Send response immediately (no typing delay)
//     const instagramButtons = transformButtonsToInstagram(finalButtons)
//     const token = automation?.User?.integrations?.[0]?.token || process.env.DEFAULT_PAGE_TOKEN!

//     if (messageType === "DM") {
//       console.log("📤 Sending enhanced DM response...")
//       const direct_message = await sendDM(pageId, senderId, finalResponse, token, instagramButtons)
//       if (direct_message.status === 200) {
//         console.log("✅ Enhanced DM sent successfully")
//         // Mark response as sent to prevent duplicates
//         await markResponseAsSent(pageId, senderId, finalResponse, messageType, automation.id)
//         if (automation) {
//           await trackResponses(automation.id, "DM")
//         }
//         await createChatHistory(automation?.id || "default", pageId, senderId, userMessage)
//         await createChatHistory(automation?.id || "default", pageId, senderId, finalResponse)
//       } else {
//         console.error("❌ Failed to send DM:", direct_message)
//       }
//     } else if (messageType === "COMMENT" && data.commentId) {
//       console.log("📤 Sending enhanced comment response...")
//       const comment = await sendPrivateMessage(pageId, data.commentId, finalResponse, token, instagramButtons)
//       if (comment.status === 200) {
//         console.log("✅ Enhanced comment response sent successfully")
//         // Mark response as sent to prevent duplicates
//         await markResponseAsSent(pageId, senderId, finalResponse, messageType, automation.id)
//         if (automation) {
//           await trackResponses(automation.id, "COMMENT")
//         }
//       } else {
//         console.error("❌ Failed to send comment response:", comment)
//       }
//     }
//   } catch (error) {
//     console.error("💥 Error in enhanced Voiceflow processing with data collection:", error)
//     // Final fallback to enhanced Gemini
//     console.log("🔄 Final fallback to enhanced Gemini due to error...")
//     await handleEnhancedGeminiResponse(data, automation, userMessage, triggerDecision, true)
//   }
// }

// async function handleEnhancedGeminiResponse(
//   data: WebhookData,
//   automation: any,
//   userMessage: string,
//   triggerDecision: any,
//   isErrorFallback = false,
// ) {
//   console.log("🔮 === ENHANCED GEMINI HANDLER STARTED ===")
//   const { pageId, senderId, messageType } = data

//   try {
//     // Check if we've sent too many responses recently (rate limiting)
//     const recentResponseCount = await getRecentResponseCount(pageId, senderId, messageType, 2)
//     if (recentResponseCount >= 3) {
//       console.log(`🚫 Rate limit: ${recentResponseCount} responses sent in last 2 minutes, skipping`)
//       return
//     }

//     // Get business profile and conversation context
//     const { profileContent, businessContext } = await getBusinessProfileForAutomation(automation.id)
//     const conversationHistory = await buildConversationContext(pageId, senderId, automation.id)
//     console.log("📋 Business profile and conversation context loaded for enhanced Gemini")

//     const isPROUser = automation.User?.subscription?.plan === "PRO"
//     console.log("🔮 Generating enhanced Gemini response...")

//     const geminiResponse = await generateGeminiResponse({
//       userMessage,
//       businessProfile: profileContent,
//       conversationHistory,
//       businessContext,
//       isPROUser,
//       isVoiceflowFallback: isErrorFallback,
//     })

//     // 🚫 CHECK FOR DUPLICATE RESPONSE BEFORE SENDING
//     const isDuplicate = await checkDuplicateResponse(pageId, senderId, geminiResponse, messageType)
//     if (isDuplicate) {
//       console.log("🚫 Duplicate response detected, skipping send")
//       return
//     }

//     console.log(
//       `💬 Enhanced Gemini response: "${geminiResponse.substring(0, 100)}..." (${geminiResponse.length} chars)`,
//     )

//     // Store conversation messages
//     await storeConversationMessage(pageId, senderId, userMessage, false, automation?.id || null)
//     if (automation?.id) {
//       await trackMessageForSentiment(automation.id, pageId, senderId, userMessage)
//     }
//     await storeConversationMessage(pageId, "bot", geminiResponse, true, automation?.id || null)

//     // Send response immediately (no typing delay)
//     const token = automation?.User?.integrations?.[0]?.token || process.env.DEFAULT_PAGE_TOKEN!

//     if (messageType === "DM") {
//       console.log("📤 Sending enhanced DM response...")
//       const direct_message = await sendDM(pageId, senderId, geminiResponse, token)
//       if (direct_message.status === 200) {
//         console.log("✅ Enhanced DM sent successfully")
//         // Mark response as sent to prevent duplicates
//         await markResponseAsSent(pageId, senderId, geminiResponse, messageType, automation.id)
//         if (automation) {
//           await trackResponses(automation.id, "DM")
//         }
//         await createChatHistory(automation?.id || "default", pageId, senderId, userMessage)
//         await createChatHistory(automation?.id || "default", pageId, senderId, geminiResponse)
//       } else {
//         console.error("❌ Failed to send DM:", direct_message)
//       }
//     } else if (messageType === "COMMENT" && data.commentId) {
//       console.log("📤 Sending enhanced comment response...")
//       const comment = await sendPrivateMessage(pageId, data.commentId, geminiResponse, token)
//       if (comment.status === 200) {
//         console.log("✅ Enhanced comment response sent successfully")
//         // Mark response as sent to prevent duplicates
//         await markResponseAsSent(pageId, senderId, geminiResponse, messageType, automation.id)
//         if (automation) {
//           await trackResponses(automation.id, "COMMENT")
//         }
//       } else {
//         console.error("❌ Failed to send comment response:", comment)
//       }
//     }
//   } catch (error) {
//     console.error("💥 Error in enhanced Gemini processing:", error)
//     // Only send fallback if we haven't sent any responses recently
//     const recentCount = await getRecentResponseCount(pageId, senderId, messageType, 1)
//     if (recentCount === 0) {
//       const fallbackText =
//         "Hello there, my name is LadyCashe, how can I help you?"
//       // Check if this fallback would be a duplicate
//       const isFallbackDuplicate = await checkDuplicateResponse(pageId, senderId, fallbackText, messageType)
//       if (!isFallbackDuplicate) {
//         console.log("🔄 Sending final fallback response...")
//         const token = automation?.User?.integrations?.[0]?.token || process.env.DEFAULT_PAGE_TOKEN!
//         if (messageType === "DM") {
//           const result = await sendDM(pageId, senderId, fallbackText, token)
//           if (result.status === 200) {
//             await markResponseAsSent(pageId, senderId, fallbackText, messageType, automation.id)
//           }
//         } else if (messageType === "COMMENT" && data.commentId) {
//           const result = await sendPrivateMessage(pageId, data.commentId, fallbackText, token)
//           if (result.status === 200) {
//             await markResponseAsSent(pageId, senderId, fallbackText, messageType, automation.id)
//           }
//         }
//       }
//     }
//   }
// }


// import { type NextRequest, NextResponse } from "next/server"

// import {
//   createChatHistory,
//   trackResponses,
//   checkProcessedMessage,
//   markMessageAsProcessed,
//   decideTriggerAction,
//   getAutomationWithTriggers,
//   updateConversationState,
//   logTriggerExecution,
//   checkDuplicateResponse,
//   markResponseAsSent,
//   getRecentResponseCount,
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

// type InstagramQuickReply = {
//   content_type: "text"
//   title: string
//   payload: string
// }

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

// function extractWebhookData(payload: any): WebhookData | null {
//   try {
//     if (payload?.entry?.[0]?.messaging) {
//       const messaging = payload.entry[0].messaging[0]

//       // Check if this is a read receipt - ignore these
//       if (messaging.read) {
//         console.log("📖 Received read receipt - ignoring")
//         return null
//       }

//       // Check if this is a delivery receipt - ignore these
//       if (messaging.delivery) {
//         console.log("📬 Received delivery receipt - ignoring")
//         return null
//       }

//       // Check if this is a regular message
//       if (messaging.message) {
//         const isEcho = messaging.message?.is_echo === true

//         // Make sure the message has text content
//         if (!messaging.message.text) {
//           console.log("📷 Received message without text (possibly media) - ignoring")
//           return null
//         }

//         return {
//           pageId: payload.entry[0].id,
//           senderId: messaging.sender.id,
//           recipientId: messaging.recipient.id,
//           userMessage: messaging.message.text,
//           messageId: messaging.message.mid,
//           messageType: "DM",
//           isEcho,
//         }
//       }

//       // Check if this is a postback (button click)
//       if (messaging.postback) {
//         return {
//           pageId: payload.entry[0].id,
//           senderId: messaging.sender.id,
//           recipientId: messaging.recipient.id,
//           userMessage: messaging.postback.payload || messaging.postback.title || "Button clicked",
//           messageId: `postback_${Date.now()}`,
//           messageType: "DM",
//           isEcho: false,
//         }
//       }
//     } else if (payload?.entry?.[0]?.changes && payload.entry[0].changes[0].field === "comments") {
//       const changeValue = payload.entry[0].changes[0].value

//       // Make sure the comment has text
//       if (!changeValue.text) {
//         console.log("📷 Received comment without text - ignoring")
//         return null
//       }

//       return {
//         pageId: payload.entry[0].id,
//         senderId: changeValue.from.id,
//         userMessage: changeValue.text,
//         commentId: changeValue.id,
//         messageType: "COMMENT",
//         isEcho: false,
//       }
//     }
//   } catch (error) {
//     console.error("Error extracting webhook data:", error)
//   }

//   return null
// }

// function generateMessageKey(data: WebhookData, timestamp: number): string {
//   const baseId = data.messageId || data.commentId || `${timestamp}_${Math.random().toString(36).substr(2, 9)}`
//   const messageContent = data.userMessage.substring(0, 50)
//   const messageLength = data.userMessage.length
//   return `${data.pageId}_${data.senderId}_${baseId}_${messageLength}_${messageContent.replace(/\s+/g, "_")}`
// }

// function isDeauthWebhook(payload: any): boolean {
//   return payload?.object === "instagram" && payload?.entry?.[0]?.changes?.[0]?.field === "deauthorizations"
// }

// function isDataDeletionWebhook(payload: any): boolean {
//   return payload?.object === "instagram" && payload?.entry?.[0]?.changes?.[0]?.field === "data_deletion"
// }

// function isReadReceiptOrDelivery(payload: any): boolean {
//   if (payload?.entry?.[0]?.messaging) {
//     const messaging = payload.entry[0].messaging[0]
//     return !!(messaging.read || messaging.delivery)
//   }
//   return false
// }

// export async function GET(req: NextRequest) {
//   const hub = req.nextUrl.searchParams.get("hub.challenge")
//   return new NextResponse(hub)
// }

// export async function POST(req: NextRequest) {
//   console.log("🚀 POST request received")
//   const startTime = Date.now()
//   let webhook_payload

//   try {
//     webhook_payload = await req.json()
//     console.log("📥 Received webhook payload:", JSON.stringify(webhook_payload, null, 2))

//     // Handle deauth webhooks
//     if (isDeauthWebhook(webhook_payload)) {
//       console.log("🔐 Processing Instagram deauthorization webhook")
//       const signature = req.headers.get("x-hub-signature-256")
//       const body = JSON.stringify(webhook_payload)

//       if (!signature || !verifyInstagramWebhook(signature, body, process.env.INSTAGRAM_CLIENT_SECRET!)) {
//         console.error("❌ Invalid webhook signature for deauth")
//         return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
//       }

//       const result = await handleInstagramDeauthWebhook(webhook_payload)
//       return NextResponse.json(result, { status: result.status })
//     }

//     // Handle data deletion webhooks
//     if (isDataDeletionWebhook(webhook_payload)) {
//       console.log("🗑️ Processing Instagram data deletion webhook")
//       const signature = req.headers.get("x-hub-signature-256")
//       const body = JSON.stringify(webhook_payload)

//       if (!signature || !verifyInstagramWebhook(signature, body, process.env.INSTAGRAM_CLIENT_SECRET!)) {
//         console.error("❌ Invalid webhook signature for data deletion")
//         return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
//       }

//       const result = await handleInstagramDataDeletionWebhook(webhook_payload)
//       return NextResponse.json(result, { status: result.status })
//     }

//     // Handle read receipts and delivery confirmations - just acknowledge them
//     if (isReadReceiptOrDelivery(webhook_payload)) {
//       console.log("📖 Received read receipt or delivery confirmation - acknowledging")
//       return NextResponse.json({ message: "Read receipt acknowledged" }, { status: 200 })
//     }

//     const data = extractWebhookData(webhook_payload)

//     if (!data) {
//       console.log("⚠️ Unsupported webhook payload structure or non-text message")
//       return NextResponse.json({ message: "Unsupported webhook payload" }, { status: 200 })
//     }

//     // Skip echo messages (messages sent by the bot)
//     if (data.isEcho) {
//       console.log("🔄 Skipping echo message (sent by bot)")
//       return NextResponse.json({ message: "Echo message ignored" }, { status: 200 })
//     }

//     const { pageId, senderId, userMessage, messageType } = data
//     const conversationUserId = `${pageId}_${senderId}`
//     const messageKey = generateMessageKey(data, startTime)

//     console.log(`📨 Processing ${messageType}: "${userMessage.substring(0, 100)}..." from ${senderId}`)

//     const isProcessed = await checkProcessedMessage(messageKey)
//     if (isProcessed) {
//       console.log(`⏭️ Skipping duplicate message: ${messageKey.substring(0, 50)}...`)
//       return NextResponse.json({ message: "Duplicate message skipped" }, { status: 200 })
//     }

//     await markMessageAsProcessed(messageKey)
//     console.log(`✅ Marked message as processed: ${messageKey.substring(0, 50)}...`)

//     const triggerDecision = await decideTriggerAction(pageId, senderId, userMessage, messageType)
//     console.log(`🎯 Trigger Decision:`, triggerDecision)

//     let automation = null

//     // If no specific automation matched, try to get/create default automation
//     if (triggerDecision.triggerType === "NO_MATCH") {
//       console.log("🔄 No specific automation matched, checking for default automation...")
//       automation = await getOrCreateDefaultAutomation(pageId)
//       if (!automation) {
//         console.log("❌ No default automation available - message ignored")
//         return NextResponse.json({ message: "No automation available" }, { status: 200 })
//       }
//       console.log(`🎯 Using default automation: ${automation.id}`)
//     } else {
//       // Get the specific automation that was triggered
//       try {
//         automation = await getAutomationWithTriggers(triggerDecision.automationId!, messageType)
//         console.log(`🔍 Automation lookup result:`, automation ? `Found: ${automation.id}` : "Not found")
//       } catch (error) {
//         console.error(`❌ Error fetching automation ${triggerDecision.automationId}:`, error)
//       }

//       if (!automation) {
//         console.log(`❌ Specific automation not found: ${triggerDecision.automationId}`)
//         // Fallback to default automation
//         automation = await getOrCreateDefaultAutomation(pageId)
//         if (!automation) {
//           return NextResponse.json({ message: "Automation not found" }, { status: 404 })
//         }
//       }
//     }

//     const isPROUser = automation.User?.subscription?.plan === "PRO"
//     console.log(
//       `🤖 Using automation: ${automation.id} (${automation.User?.subscription?.plan || "FREE"}) - PRO: ${isPROUser}`,
//     )

//     // Log Voiceflow health
//     const voiceflowHealth = getVoiceflowHealth()
//     console.log(
//       `🏥 Voiceflow Health - Score: ${voiceflowHealth.healthScore.toFixed(2)}, State: ${voiceflowHealth.circuitBreakerState}, Cache: ${voiceflowHealth.cacheSize}`,
//     )

//     // Log trigger execution
//     if (triggerDecision.automationId && triggerDecision.triggerId && automation.User?.id) {
//       try {
//         await logTriggerExecution({
//           triggerId: triggerDecision.triggerId,
//           automationId: triggerDecision.automationId,
//           userId: automation.User.id,
//           messageContent: userMessage,
//           triggerType: triggerDecision.triggerType as any,
//           confidence: triggerDecision.confidence,
//           reason: triggerDecision.reason,
//           success: true,
//           responseTime: Date.now() - startTime,
//         })
//         console.log(`📊 Logged trigger execution: ${triggerDecision.triggerId}`)
//       } catch (error) {
//         console.error("❌ Error logging trigger execution:", error)
//       }
//     }

//     // Update conversation state
//     await updateConversationState(conversationUserId, {
//       isActive: true,
//       lastTriggerType: triggerDecision.triggerType,
//       lastTriggerReason: triggerDecision.reason,
//       automationId: automation.id,
//       listenMode: triggerDecision.triggerType === "KEYWORD" ? "KEYWORDS" : "ALL_MESSAGES",
//       lastMessageLength: userMessage.length,
//     })

//     // 🚀 ENHANCED: Route based on subscription plan with intelligent fallback and data collection
//     if (isPROUser) {
//       console.log("🎙️ Using Enhanced Voiceflow with Data Collection for PRO user")
//       await handleEnhancedVoiceflowWithDataCollection(
//         data,
//         automation,
//         conversationUserId,
//         userMessage,
//         triggerDecision,
//       )
//     } else {
//       console.log("🔮 Using Enhanced Gemini for non-PRO user")
//       await handleEnhancedGeminiResponse(data, automation, userMessage, triggerDecision)
//     }

//     const processingTime = Date.now() - startTime
//     console.log(`✅ Successfully processed message in ${processingTime}ms: ${messageKey.substring(0, 50)}...`)

//     return NextResponse.json(
//       {
//         message: "Request processed successfully",
//         processingTime,
//         triggerType: triggerDecision.triggerType,
//         automationId: automation.id,
//         aiSystem: isPROUser ? "enhanced_voiceflow_with_data_collection" : "enhanced_gemini",
//         voiceflowHealth: voiceflowHealth,
//       },
//       { status: 200 },
//     )
//   } catch (error) {
//     console.error("💥 Unhandled error in POST function:", error)
//     return NextResponse.json(
//       {
//         message: "Error processing request",
//         error: error instanceof Error ? error.message : String(error),
//       },
//       { status: 500 },
//     )
//   }
// }

// async function handleEnhancedVoiceflowWithDataCollection(
//   data: WebhookData,
//   automation: any,
//   conversationUserId: string,
//   userMessage: string,
//   triggerDecision: any,
// ) {
//   console.log("🎙️ === ENHANCED VOICEFLOW WITH DATA COLLECTION STARTED ===")
//   const { pageId, senderId, messageType } = data

//   try {
//     // Check if we've sent too many responses recently (rate limiting)
//     const recentResponseCount = await getRecentResponseCount(pageId, senderId, messageType, 2)
//     if (recentResponseCount >= 3) {
//       console.log(`🚫 Rate limit: ${recentResponseCount} responses sent in last 2 minutes, skipping`)
//       return
//     }

//     console.log("🎙️ Starting enhanced Voiceflow processing with data collection...")
//     const userCreated = await createVoiceflowUser(conversationUserId)
//     console.log(`🎙️ User created: ${userCreated}`)

//     // Build enhanced conversation context
//     const conversationHistory = await buildConversationContext(pageId, senderId, automation.id)
//     const { profileContent, businessContext } = await getBusinessProfileForAutomation(automation.id)

//     // Determine customer type and context
//     const isNewUser = conversationHistory.length === 0
//     const customerType = conversationHistory.length >= 10 ? "VIP" : conversationHistory.length > 0 ? "RETURNING" : "NEW"

//     console.log("📋 Building enhanced business variables with conversation context...")

//     let businessVariables: Record<string, any> = {}

//     try {
//       businessVariables = await fetchEnhancedBusinessVariables(automation.User?.id || "", automation.id, {
//         pageId,
//         senderId,
//         userMessage,
//         isNewUser,
//         customerType,
//         messageHistory: conversationHistory,
//       })
//       console.log("✅ Successfully fetched enhanced business variables")
//     } catch (error: any) {
//       console.error("❌ Error in fetchEnhancedBusinessVariables (using fallback):", error)

//       // Fallback business variables if the fetch fails
//       businessVariables = {
//         business_name: businessContext.businessName || "Our Business",
//         welcome_message: businessContext.welcomeMessage || "Hello! How can I help you today?",
//         business_industry: businessContext.industry || "",
//         business_description: businessContext.businessDescription || "",
//         target_audience: businessContext.targetAudience || "",
//         response_language: businessContext.responseLanguage || "English",
//         customer_type: customerType,
//         is_new_user: isNewUser.toString(),
//         conversation_length: conversationHistory.length.toString(),
//         trigger_type: triggerDecision.triggerType,
//         trigger_reason: triggerDecision.reason,
//       }
//     }

//     console.log("🎯 Attempting enhanced Voiceflow response with data collection...")
//     const voiceflowResult = await getEnhancedVoiceflowResponse(userMessage, conversationUserId, businessVariables)

//     let finalResponse: string
//     let finalButtons: any[] | undefined
//     let aiSystemUsed: string
//     let extractedCustomerData: any = {}

//     if (voiceflowResult.success && voiceflowResult.response) {
//       console.log("✅ Enhanced Voiceflow response with data collection successful")
//       finalResponse = voiceflowResult.response.text
//       finalButtons = voiceflowResult.response.buttons
//       aiSystemUsed = "enhanced_voiceflow"

//       // Simple data extraction from Voiceflow variables
//       if (voiceflowResult.success && voiceflowResult.variables) {
//         extractedCustomerData = {
//           name:
//             voiceflowResult.variables.customer_name ||
//             voiceflowResult.variables.clientname ||
//             voiceflowResult.variables.name,
//           email:
//             voiceflowResult.variables.customer_email ||
//             voiceflowResult.variables.clientemail ||
//             voiceflowResult.variables.email,
//           phone:
//             voiceflowResult.variables.customer_phone ||
//             voiceflowResult.variables.clientphone ||
//             voiceflowResult.variables.phone,
//         }
//       }

//       // Enhanced lead analysis with collected data
//       let leadAnalysisResult = null
//       if (automation.User?.id && senderId !== pageId) {
//         try {
//           console.log("🔍 Starting enhanced lead analysis with collected data...")
//           leadAnalysisResult = await analyzeLead({
//             userId: automation.User.id,
//             automationId: automation.id,
//             platformId: pageId,
//             customerId: senderId,
//             message: userMessage,
//             messageType,
//             timestamp: new Date(),
//           })
//           console.log(`📊 Enhanced lead analysis completed`)
//         } catch (error) {
//           console.error("❌ Error in enhanced lead analysis (continuing anyway):", error)
//         }
//       }

//       // Handle marketing info capture (name, email, phone only)
//       if (extractedCustomerData.name || extractedCustomerData.email || extractedCustomerData.phone) {
//         try {
//           const automationUserId = automation?.User?.id
//           if (automationUserId) {
//             // Create marketing info without metadata field (it doesn't exist in the schema)
//             await client.marketingInfo.create({
//               data: {
//                 name: extractedCustomerData.name,
//                 email: extractedCustomerData.email,
//                 phone: extractedCustomerData.phone,
//                 userId: automationUserId,
//               },
//             })

//             if (leadAnalysisResult?.lead?.id) {
//               await client.lead.update({
//                 where: { id: leadAnalysisResult.lead.id },
//                 data: {
//                   name: extractedCustomerData.name,
//                   email: extractedCustomerData.email,
//                   phone: extractedCustomerData.phone,
//                   metadata: {
//                     basicDataCollection: {
//                       name: extractedCustomerData.name,
//                       email: extractedCustomerData.email,
//                       phone: extractedCustomerData.phone,
//                       lastDataUpdate: new Date().toISOString(),
//                     },
//                   },
//                 },
//               })
//             }
//             console.log("📝 Basic marketing info stored successfully")
//           }
//         } catch (error) {
//           console.error("❌ Error storing basic marketing info:", error)
//         }
//       }
//     } else {
//       console.log(`🔄 Voiceflow failed, falling back to enhanced Gemini for PRO user`)
//       // Enhanced Gemini fallback for PRO users with collected data context
//       finalResponse = await generateGeminiResponse({
//         userMessage,
//         businessProfile: profileContent,
//         conversationHistory,
//         businessContext,
//         isPROUser: true,
//         isVoiceflowFallback: true,
//         voiceflowAttemptedResponse: voiceflowResult.error,
//       })
//       finalButtons = undefined
//       aiSystemUsed = "enhanced_gemini_pro_fallback_with_data"
//       console.log("✅ Enhanced Gemini fallback response generated for PRO user with data context")
//     }

//     // 🚫 CHECK FOR DUPLICATE RESPONSE BEFORE SENDING
//     const isDuplicate = await checkDuplicateResponse(pageId, senderId, finalResponse, messageType)
//     if (isDuplicate) {
//       console.log("🚫 Duplicate response detected, skipping send")
//       return
//     }

//     console.log(
//       `💬 Final response (${aiSystemUsed}): "${finalResponse.substring(0, 100)}..." (${finalResponse.length} chars)`,
//     )

//     // Store conversation messages
//     await storeConversationMessage(pageId, senderId, userMessage, false, automation?.id || null)
//     if (automation?.id) {
//       await trackMessageForSentiment(automation.id, pageId, senderId, userMessage)
//     }
//     await storeConversationMessage(pageId, "bot", finalResponse, true, automation?.id || null)

//     // Send response immediately (no typing delay)
//     const instagramButtons = transformButtonsToInstagram(finalButtons)
//     const token = automation?.User?.integrations?.[0]?.token || process.env.DEFAULT_PAGE_TOKEN!

//     if (messageType === "DM") {
//       console.log("📤 Sending enhanced DM response...")
//       const direct_message = await sendDM(pageId, senderId, finalResponse, token, instagramButtons)
//       if (direct_message.status === 200) {
//         console.log("✅ Enhanced DM sent successfully")
//         // Mark response as sent to prevent duplicates
//         await markResponseAsSent(pageId, senderId, finalResponse, messageType, automation.id)
//         if (automation) {
//           await trackResponses(automation.id, "DM")
//         }
//         await createChatHistory(automation?.id || "default", pageId, senderId, userMessage)
//         await createChatHistory(automation?.id || "default", pageId, senderId, finalResponse)
//       } else {
//         console.error("❌ Failed to send DM:", direct_message)
//       }
//     } else if (messageType === "COMMENT" && data.commentId) {
//       console.log("📤 Sending enhanced comment response...")
//       const comment = await sendPrivateMessage(pageId, data.commentId, finalResponse, token, instagramButtons)
//       if (comment.status === 200) {
//         console.log("✅ Enhanced comment response sent successfully")
//         // Mark response as sent to prevent duplicates
//         await markResponseAsSent(pageId, senderId, finalResponse, messageType, automation.id)
//         if (automation) {
//           await trackResponses(automation.id, "COMMENT")
//         }
//       } else {
//         console.error("❌ Failed to send comment response:", comment)
//       }
//     }
//   } catch (error) {
//     console.error("💥 Error in enhanced Voiceflow processing with data collection:", error)
//     // Final fallback to enhanced Gemini
//     console.log("🔄 Final fallback to enhanced Gemini due to error...")
//     await handleEnhancedGeminiResponse(data, automation, userMessage, triggerDecision, true)
//   }
// }

// async function handleEnhancedGeminiResponse(
//   data: WebhookData,
//   automation: any,
//   userMessage: string,
//   triggerDecision: any,
//   isErrorFallback = false,
// ) {
//   console.log("🔮 === ENHANCED GEMINI HANDLER STARTED ===")
//   const { pageId, senderId, messageType } = data

//   try {
//     // Check if we've sent too many responses recently (rate limiting)
//     const recentResponseCount = await getRecentResponseCount(pageId, senderId, messageType, 2)
//     if (recentResponseCount >= 3) {
//       console.log(`🚫 Rate limit: ${recentResponseCount} responses sent in last 2 minutes, skipping`)
//       return
//     }

//     // Get business profile and conversation context
//     const { profileContent, businessContext } = await getBusinessProfileForAutomation(automation.id)
//     const conversationHistory = await buildConversationContext(pageId, senderId, automation.id)
//     console.log("📋 Business profile and conversation context loaded for enhanced Gemini")

//     const isPROUser = automation.User?.subscription?.plan === "PRO"
//     console.log("🔮 Generating enhanced Gemini response...")

//     const geminiResponse = await generateGeminiResponse({
//       userMessage,
//       businessProfile: profileContent,
//       conversationHistory,
//       businessContext,
//       isPROUser,
//       isVoiceflowFallback: isErrorFallback,
//     })

//     // 🚫 CHECK FOR DUPLICATE RESPONSE BEFORE SENDING
//     const isDuplicate = await checkDuplicateResponse(pageId, senderId, geminiResponse, messageType)
//     if (isDuplicate) {
//       console.log("🚫 Duplicate response detected, skipping send")
//       return
//     }

//     console.log(
//       `💬 Enhanced Gemini response: "${geminiResponse.substring(0, 100)}..." (${geminiResponse.length} chars)`,
//     )

//     // Store conversation messages
//     await storeConversationMessage(pageId, senderId, userMessage, false, automation?.id || null)
//     if (automation?.id) {
//       await trackMessageForSentiment(automation.id, pageId, senderId, userMessage)
//     }
//     await storeConversationMessage(pageId, "bot", geminiResponse, true, automation?.id || null)

//     // Send response immediately (no typing delay)
//     const token = automation?.User?.integrations?.[0]?.token || process.env.DEFAULT_PAGE_TOKEN!

//     if (messageType === "DM") {
//       console.log("📤 Sending enhanced DM response...")
//       const direct_message = await sendDM(pageId, senderId, geminiResponse, token)
//       if (direct_message.status === 200) {
//         console.log("✅ Enhanced DM sent successfully")
//         // Mark response as sent to prevent duplicates
//         await markResponseAsSent(pageId, senderId, geminiResponse, messageType, automation.id)
//         if (automation) {
//           await trackResponses(automation.id, "DM")
//         }
//         await createChatHistory(automation?.id || "default", pageId, senderId, userMessage)
//         await createChatHistory(automation?.id || "default", pageId, senderId, geminiResponse)
//       } else {
//         console.error("❌ Failed to send DM:", direct_message)
//       }
//     } else if (messageType === "COMMENT" && data.commentId) {
//       console.log("📤 Sending enhanced comment response...")
//       const comment = await sendPrivateMessage(pageId, data.commentId, geminiResponse, token)
//       if (comment.status === 200) {
//         console.log("✅ Enhanced comment response sent successfully")
//         // Mark response as sent to prevent duplicates
//         await markResponseAsSent(pageId, senderId, geminiResponse, messageType, automation.id)
//         if (automation) {
//           await trackResponses(automation.id, "COMMENT")
//         }
//       } else {
//         console.error("❌ Failed to send comment response:", comment)
//       }
//     }
//   } catch (error) {
//     console.error("💥 Error in enhanced Gemini processing:", error)
//     // Only send fallback if we haven't sent any responses recently
//     const recentCount = await getRecentResponseCount(pageId, senderId, messageType, 1)
//     if (recentCount === 0) {
//       const fallbackText =
//         "Hey there! Thanks for reaching out. I'm getting a lot of messages right now, but I definitely want to help you out. Can you give me just a few minutes to get back to you properly? 😊"
//       // Check if this fallback would be a duplicate
//       const isFallbackDuplicate = await checkDuplicateResponse(pageId, senderId, fallbackText, messageType)
//       if (!isFallbackDuplicate) {
//         console.log("🔄 Sending final fallback response...")
//         const token = automation?.User?.integrations?.[0]?.token || process.env.DEFAULT_PAGE_TOKEN!
//         if (messageType === "DM") {
//           const result = await sendDM(pageId, senderId, fallbackText, token)
//           if (result.status === 200) {
//             await markResponseAsSent(pageId, senderId, fallbackText, messageType, automation.id)
//           }
//         } else if (messageType === "COMMENT" && data.commentId) {
//           const result = await sendPrivateMessage(pageId, data.commentId, fallbackText, token)
//           if (result.status === 200) {
//             await markResponseAsSent(pageId, senderId, fallbackText, messageType, automation.id)
//           }
//         }
//       }
//     }
//   }
// }

























// import { type NextRequest, NextResponse } from "next/server"
// import {
//   createChatHistory,
//   trackResponses,
//   checkProcessedMessage,
//   markMessageAsProcessed,
//   decideTriggerAction,
//   getAutomationWithTriggers,
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

// type InstagramQuickReply = {
//   content_type: "text"
//   title: string
//   payload: string
// }

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

// function extractWebhookData(payload: any): WebhookData | null {
//   try {
//     if (payload?.entry?.[0]?.messaging) {
//       const messaging = payload.entry[0].messaging[0]

//       // Check if this is a read receipt - ignore these
//       if (messaging.read) {
//         console.log("📖 Received read receipt - ignoring")
//         return null
//       }

//       // Check if this is a delivery receipt - ignore these
//       if (messaging.delivery) {
//         console.log("📬 Received delivery receipt - ignoring")
//         return null
//       }

//       // Check if this is a regular message
//       if (messaging.message) {
//         const isEcho = messaging.message?.is_echo === true

//         // Make sure the message has text content
//         if (!messaging.message.text) {
//           console.log("📷 Received message without text (possibly media) - ignoring")
//           return null
//         }

//         return {
//           pageId: payload.entry[0].id,
//           senderId: messaging.sender.id,
//           recipientId: messaging.recipient.id,
//           userMessage: messaging.message.text,
//           messageId: messaging.message.mid,
//           messageType: "DM",
//           isEcho,
//         }
//       }

//       // Check if this is a postback (button click)
//       if (messaging.postback) {
//         return {
//           pageId: payload.entry[0].id,
//           senderId: messaging.sender.id,
//           recipientId: messaging.recipient.id,
//           userMessage: messaging.postback.payload || messaging.postback.title || "Button clicked",
//           messageId: `postback_${Date.now()}`,
//           messageType: "DM",
//           isEcho: false,
//         }
//       }
//     } else if (payload?.entry?.[0]?.changes && payload.entry[0].changes[0].field === "comments") {
//       const changeValue = payload.entry[0].changes[0].value

//       // Make sure the comment has text
//       if (!changeValue.text) {
//         console.log("📷 Received comment without text - ignoring")
//         return null
//       }

//       return {
//         pageId: payload.entry[0].id,
//         senderId: changeValue.from.id,
//         userMessage: changeValue.text,
//         commentId: changeValue.id,
//         messageType: "COMMENT",
//         isEcho: false,
//       }
//     }
//   } catch (error) {
//     console.error("Error extracting webhook data:", error)
//   }

//   return null
// }

// function generateMessageKey(data: WebhookData, timestamp: number): string {
//   const baseId = data.messageId || data.commentId || `${timestamp}_${Math.random().toString(36).substr(2, 9)}`
//   const messageContent = data.userMessage.substring(0, 50)
//   const messageLength = data.userMessage.length
//   return `${data.pageId}_${data.senderId}_${baseId}_${messageLength}_${messageContent.replace(/\s+/g, "_")}`
// }

// function isDeauthWebhook(payload: any): boolean {
//   return payload?.object === "instagram" && payload?.entry?.[0]?.changes?.[0]?.field === "deauthorizations"
// }

// function isDataDeletionWebhook(payload: any): boolean {
//   return payload?.object === "instagram" && payload?.entry?.[0]?.changes?.[0]?.field === "data_deletion"
// }

// function isReadReceiptOrDelivery(payload: any): boolean {
//   if (payload?.entry?.[0]?.messaging) {
//     const messaging = payload.entry[0].messaging[0]
//     return !!(messaging.read || messaging.delivery)
//   }
//   return false
// }

// export async function GET(req: NextRequest) {
//   const hub = req.nextUrl.searchParams.get("hub.challenge")
//   return new NextResponse(hub)
// }

// export async function POST(req: NextRequest) {
//   console.log("🚀 POST request received")
//   const startTime = Date.now()
//   let webhook_payload

//   try {
//     webhook_payload = await req.json()
//     console.log("📥 Received webhook payload:", JSON.stringify(webhook_payload, null, 2))

//     // Handle deauth webhooks
//     if (isDeauthWebhook(webhook_payload)) {
//       console.log("🔐 Processing Instagram deauthorization webhook")
//       const signature = req.headers.get("x-hub-signature-256")
//       const body = JSON.stringify(webhook_payload)

//       if (!signature || !verifyInstagramWebhook(signature, body, process.env.INSTAGRAM_CLIENT_SECRET!)) {
//         console.error("❌ Invalid webhook signature for deauth")
//         return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
//       }

//       const result = await handleInstagramDeauthWebhook(webhook_payload)
//       return NextResponse.json(result, { status: result.status })
//     }

//     // Handle data deletion webhooks
//     if (isDataDeletionWebhook(webhook_payload)) {
//       console.log("🗑️ Processing Instagram data deletion webhook")
//       const signature = req.headers.get("x-hub-signature-256")
//       const body = JSON.stringify(webhook_payload)

//       if (!signature || !verifyInstagramWebhook(signature, body, process.env.INSTAGRAM_CLIENT_SECRET!)) {
//         console.error("❌ Invalid webhook signature for data deletion")
//         return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
//       }

//       const result = await handleInstagramDataDeletionWebhook(webhook_payload)
//       return NextResponse.json(result, { status: result.status })
//     }

//     // Handle read receipts and delivery confirmations - just acknowledge them
//     if (isReadReceiptOrDelivery(webhook_payload)) {
//       console.log("📖 Received read receipt or delivery confirmation - acknowledging")
//       return NextResponse.json({ message: "Read receipt acknowledged" }, { status: 200 })
//     }

//     const data = extractWebhookData(webhook_payload)

//     if (!data) {
//       console.log("⚠️ Unsupported webhook payload structure or non-text message")
//       return NextResponse.json({ message: "Unsupported webhook payload" }, { status: 200 })
//     }

//     // Skip echo messages (messages sent by the bot)
//     if (data.isEcho) {
//       console.log("🔄 Skipping echo message (sent by bot)")
//       return NextResponse.json({ message: "Echo message ignored" }, { status: 200 })
//     }

//     const { pageId, senderId, userMessage, messageType } = data
//     const conversationUserId = `${pageId}_${senderId}`
//     const messageKey = generateMessageKey(data, startTime)

//     console.log(`📨 Processing ${messageType}: "${userMessage.substring(0, 100)}..." from ${senderId}`)

//     const isProcessed = await checkProcessedMessage(messageKey)
//     if (isProcessed) {
//       console.log(`⏭️ Skipping duplicate message: ${messageKey.substring(0, 50)}...`)
//       return NextResponse.json({ message: "Duplicate message skipped" }, { status: 200 })
//     }

//     await markMessageAsProcessed(messageKey)
//     console.log(`✅ Marked message as processed: ${messageKey.substring(0, 50)}...`)

//     const triggerDecision = await decideTriggerAction(pageId, senderId, userMessage, messageType)
//     console.log(`🎯 Trigger Decision:`, triggerDecision)

//     let automation = null

//     // If no specific automation matched, try to get/create default automation
//     if (triggerDecision.triggerType === "NO_MATCH") {
//       console.log("🔄 No specific automation matched, checking for default automation...")
//       automation = await getOrCreateDefaultAutomation(pageId)
//       if (!automation) {
//         console.log("❌ No default automation available - message ignored")
//         return NextResponse.json({ message: "No automation available" }, { status: 200 })
//       }
//       console.log(`🎯 Using default automation: ${automation.id}`)
//     } else {
//       // Get the specific automation that was triggered
//       try {
//         automation = await getAutomationWithTriggers(triggerDecision.automationId!, messageType)
//         console.log(`🔍 Automation lookup result:`, automation ? `Found: ${automation.id}` : "Not found")
//       } catch (error) {
//         console.error(`❌ Error fetching automation ${triggerDecision.automationId}:`, error)
//       }

//       if (!automation) {
//         console.log(`❌ Specific automation not found: ${triggerDecision.automationId}`)
//         // Fallback to default automation
//         automation = await getOrCreateDefaultAutomation(pageId)
//         if (!automation) {
//           return NextResponse.json({ message: "Automation not found" }, { status: 404 })
//         }
//       }
//     }

//     const isPROUser = automation.User?.subscription?.plan === "PRO"
//     console.log(
//       `🤖 Using automation: ${automation.id} (${automation.User?.subscription?.plan || "FREE"}) - PRO: ${isPROUser}`,
//     )

//     // Log Voiceflow health
//     const voiceflowHealth = getVoiceflowHealth()
//     console.log(
//       `🏥 Voiceflow Health - Score: ${voiceflowHealth.healthScore.toFixed(2)}, State: ${voiceflowHealth.circuitBreakerState}, Cache: ${voiceflowHealth.cacheSize}`,
//     )

//     // Log trigger execution
//     if (triggerDecision.automationId && triggerDecision.triggerId && automation.User?.id) {
//       try {
//         await logTriggerExecution({
//           triggerId: triggerDecision.triggerId,
//           automationId: triggerDecision.automationId,
//           userId: automation.User.id,
//           messageContent: userMessage,
//           triggerType: triggerDecision.triggerType as any,
//           confidence: triggerDecision.confidence,
//           reason: triggerDecision.reason,
//           success: true,
//           responseTime: Date.now() - startTime,
//         })
//         console.log(`📊 Logged trigger execution: ${triggerDecision.triggerId}`)
//       } catch (error) {
//         console.error("❌ Error logging trigger execution:", error)
//       }
//     }

//     // Update conversation state
//     await updateConversationState(conversationUserId, {
//       isActive: true,
//       lastTriggerType: triggerDecision.triggerType,
//       lastTriggerReason: triggerDecision.reason,
//       automationId: automation.id,
//       listenMode: triggerDecision.triggerType === "KEYWORD" ? "KEYWORDS" : "ALL_MESSAGES",
//       lastMessageLength: userMessage.length,
//     })

//     // 🚀 ENHANCED: Route based on subscription plan with intelligent fallback and data collection
//     if (isPROUser) {
//       console.log("🎙️ Using Enhanced Voiceflow with Data Collection for PRO user")
//       await handleEnhancedVoiceflowWithDataCollection(
//         data,
//         automation,
//         conversationUserId,
//         userMessage,
//         triggerDecision,
//       )
//     } else {
//       console.log("🔮 Using Enhanced Gemini for non-PRO user")
//       await handleEnhancedGeminiResponse(data, automation, userMessage, triggerDecision)
//     }

//     const processingTime = Date.now() - startTime
//     console.log(`✅ Successfully processed message in ${processingTime}ms: ${messageKey.substring(0, 50)}...`)

//     return NextResponse.json(
//       {
//         message: "Request processed successfully",
//         processingTime,
//         triggerType: triggerDecision.triggerType,
//         automationId: automation.id,
//         aiSystem: isPROUser ? "enhanced_voiceflow_with_data_collection" : "enhanced_gemini",
//         voiceflowHealth: voiceflowHealth,
//       },
//       { status: 200 },
//     )
//   } catch (error) {
//     console.error("💥 Unhandled error in POST function:", error)
//     return NextResponse.json(
//       {
//         message: "Error processing request",
//         error: error instanceof Error ? error.message : String(error),
//       },
//       { status: 500 },
//     )
//   }
// }

// async function handleEnhancedVoiceflowWithDataCollection(
//   data: WebhookData,
//   automation: any,
//   conversationUserId: string,
//   userMessage: string,
//   triggerDecision: any,
// ) {
//   console.log("🎙️ === ENHANCED VOICEFLOW WITH DATA COLLECTION STARTED ===")
//   const { pageId, senderId, messageType } = data

//   try {
//     // Check if we've sent too many responses recently (rate limiting)
//     const recentResponseCount = await getRecentResponseCount(pageId, senderId, messageType, 2)
//     if (recentResponseCount >= 3) {
//       console.log(`🚫 Rate limit: ${recentResponseCount} responses sent in last 2 minutes, skipping`)
//       return
//     }

//     console.log("🎙️ Starting enhanced Voiceflow processing with data collection...")
//     const userCreated = await createVoiceflowUser(conversationUserId)
//     console.log(`🎙️ User created: ${userCreated}`)

//     // Build enhanced conversation context
//     const conversationHistory = await buildConversationContext(pageId, senderId, automation.id)
//     const { profileContent, businessContext } = await getBusinessProfileForAutomation(automation.id)

//     // Determine customer type and context
//     const isNewUser = conversationHistory.length === 0
//     const customerType = conversationHistory.length >= 10 ? "VIP" : conversationHistory.length > 0 ? "RETURNING" : "NEW"

//     console.log("📋 Building enhanced business variables with conversation context...")
//     let businessVariables: Record<string, any> = {}

//     try {
//       businessVariables = await fetchEnhancedBusinessVariables(automation.User?.id || "", automation.id, {
//         pageId,
//         senderId,
//         userMessage,
//         isNewUser,
//         customerType,
//         messageHistory: conversationHistory,
//       })
//       console.log("✅ Successfully fetched enhanced business variables")
//     } catch (error: any) {
//       console.error("❌ Error in fetchEnhancedBusinessVariables (using fallback):", error)

//       // Fallback business variables if the fetch fails
//       businessVariables = {
//         business_name: businessContext.businessName || "Our Business",
//         welcome_message: businessContext.welcomeMessage || "Hello! How can I help you today?",
//         business_industry: businessContext.industry || "",
//         business_description: businessContext.businessDescription || "",
//         target_audience: businessContext.targetAudience || "",
//         response_language: businessContext.responseLanguage || "English",
//         customer_type: customerType,
//         is_new_user: isNewUser.toString(),
//         conversation_length: conversationHistory.length.toString(),
//         trigger_type: triggerDecision.triggerType,
//         trigger_reason: triggerDecision.reason,
//       }
//     }

//     console.log("🎯 Attempting enhanced Voiceflow response with data collection...")
//     let voiceflowResult
//     try {
//       voiceflowResult = await getEnhancedVoiceflowResponse(userMessage, conversationUserId, businessVariables)
//     } catch (error) {
//       console.error("❌ Error in getEnhancedVoiceflowResponse:", error)
//       // Handle the error gracefully, e.g., by setting a default response
//       voiceflowResult = {
//         success: false,
//         response: {
//           text: "I'm sorry, I encountered an issue processing your request. Please try again later.",
//           buttons: [],
//         },
//       }
//     }

//     let finalResponse: string
//     let finalButtons: any[] | undefined
//     let aiSystemUsed: string
//     let extractedCustomerData: any = {}

//     if (voiceflowResult.success && voiceflowResult.response) {
//       console.log("✅ Enhanced Voiceflow response with data collection successful")
//       finalResponse = voiceflowResult.response.text
//       finalButtons = voiceflowResult.response.buttons
//       aiSystemUsed = "enhanced_voiceflow"

//       // Simple data extraction from Voiceflow variables
//       if (voiceflowResult.success && voiceflowResult.variables) {
//         extractedCustomerData = {
//           name:
//             voiceflowResult.variables.customer_name ||
//             voiceflowResult.variables.clientname ||
//             voiceflowResult.variables.name,
//           email:
//             voiceflowResult.variables.customer_email ||
//             voiceflowResult.variables.clientemail ||
//             voiceflowResult.variables.email,
//           phone:
//             voiceflowResult.variables.customer_phone ||
//             voiceflowResult.variables.clientphone ||
//             voiceflowResult.variables.phone,
//         }
//       }

//       // Enhanced lead analysis with collected data
//       let leadAnalysisResult = null
//       if (automation.User?.id && senderId !== pageId) {
//         try {
//           console.log("🔍 Starting enhanced lead analysis with collected data...")
//           leadAnalysisResult = await analyzeLead({
//             userId: automation.User.id,
//             automationId: automation.id,
//             platformId: pageId,
//             customerId: senderId,
//             message: userMessage,
//             messageType,
//             timestamp: new Date(),
//           })
//           console.log(`📊 Enhanced lead analysis completed`)
//         } catch (error) {
//           console.error("❌ Error in enhanced lead analysis (continuing anyway):", error)
//         }
//       }

//       // Handle marketing info capture (name, email, phone only)
//       if (extractedCustomerData.name || extractedCustomerData.email || extractedCustomerData.phone) {
//         try {
//           const automationUserId = automation?.User?.id
//           if (automationUserId) {
//             // Create marketing info without metadata field (it doesn't exist in the schema)
//             await client.marketingInfo.create({
//               data: {
//                 name: extractedCustomerData.name,
//                 email: extractedCustomerData.email,
//                 phone: extractedCustomerData.phone,
//                 userId: automationUserId,
//               },
//             })

//             if (leadAnalysisResult?.lead?.id) {
//               await client.lead.update({
//                 where: { id: leadAnalysisResult.lead.id },
//                 data: {
//                   name: extractedCustomerData.name,
//                   email: extractedCustomerData.email,
//                   phone: extractedCustomerData.phone,
//                   metadata: {
//                     basicDataCollection: {
//                       name: extractedCustomerData.name,
//                       email: extractedCustomerData.email,
//                       phone: extractedCustomerData.phone,
//                       lastDataUpdate: new Date().toISOString(),
//                     },
//                   },
//                 },
//               })
//             }
//             console.log("📝 Basic marketing info stored successfully")
//           }
//         } catch (error) {
//           console.error("❌ Error storing basic marketing info:", error)
//         }
//       }
//     } else {
//       console.log(`🔄 Voiceflow failed, falling back to enhanced Gemini for PRO user`)
//       // Enhanced Gemini fallback for PRO users with collected data context
//       finalResponse = await generateGeminiResponse({
//         userMessage,
//         businessProfile: profileContent,
//         conversationHistory,
//         businessContext,
//         isPROUser: true,
//         isVoiceflowFallback: true,
//         voiceflowAttemptedResponse: voiceflowResult.error,
//       })
//       finalButtons = undefined
//       aiSystemUsed = "enhanced_gemini_pro_fallback_with_data"
//       console.log("✅ Enhanced Gemini fallback response generated for PRO user with data context")
//     }

//     // 🚫 CHECK FOR DUPLICATE RESPONSE BEFORE SENDING
//     const isDuplicate = await checkDuplicateResponse(pageId, senderId, finalResponse, messageType)
//     if (isDuplicate) {
//       console.log("🚫 Duplicate response detected, skipping send")
//       return
//     }

//     console.log(
//       `💬 Final response (${aiSystemUsed}): "${finalResponse.substring(0, 100)}..." (${finalResponse.length} chars)`,
//     )

//     // Store conversation messages
//     await storeConversationMessage(pageId, senderId, userMessage, false, automation?.id || null)
//     if (automation?.id) {
//       await trackMessageForSentiment(automation.id, pageId, senderId, userMessage)
//     }
//     await storeConversationMessage(pageId, "bot", finalResponse, true, automation?.id || null)

//     // Send response immediately (no typing delay)
//     const instagramButtons = transformButtonsToInstagram(finalButtons)
//     const token = automation?.User?.integrations?.[0]?.token || process.env.DEFAULT_PAGE_TOKEN!

//     if (messageType === "DM") {
//       console.log("📤 Sending enhanced DM response...")
//       const direct_message = await sendDM(pageId, senderId, finalResponse, token, instagramButtons)
//       if (direct_message.status === 200) {
//         console.log("✅ Enhanced DM sent successfully")
//         // Mark response as sent to prevent duplicates
//         await markResponseAsSent(pageId, senderId, finalResponse, messageType, automation.id)
//         if (automation) {
//           await trackResponses(automation.id, "DM")
//         }
//         await createChatHistory(automation?.id || "default", pageId, senderId, userMessage)
//         await createChatHistory(automation?.id || "default", pageId, senderId, finalResponse)
//       } else {
//         console.error("❌ Failed to send DM:", direct_message)
//       }
//     } else if (messageType === "COMMENT" && data.commentId) {
//       console.log("📤 Sending enhanced comment response...")
//       const comment = await sendPrivateMessage(pageId, data.commentId, finalResponse, token, instagramButtons)
//       if (comment.status === 200) {
//         console.log("✅ Enhanced comment response sent successfully")
//         // Mark response as sent to prevent duplicates
//         await markResponseAsSent(pageId, senderId, finalResponse, messageType, automation.id)
//         if (automation) {
//           await trackResponses(automation.id, "COMMENT")
//         }
//       } else {
//         console.error("❌ Failed to send comment response:", comment)
//       }
//     }
//   } catch (error) {
//     console.error("💥 Error in enhanced Voiceflow processing with data collection:", error)
//     // Final fallback to enhanced Gemini
//     console.log("🔄 Final fallback to enhanced Gemini due to error...")
//     await handleEnhancedGeminiResponse(data, automation, userMessage, triggerDecision, true)
//   }
// }

// async function handleEnhancedGeminiResponse(
//   data: WebhookData,
//   automation: any,
//   userMessage: string,
//   triggerDecision: any,
//   isErrorFallback = false,
// ) {
//   console.log("🔮 === ENHANCED GEMINI HANDLER STARTED ===")
//   const { pageId, senderId, messageType } = data

//   try {
//     // Check if we've sent too many responses recently (rate limiting)
//     const recentResponseCount = await getRecentResponseCount(pageId, senderId, messageType, 2)
//     if (recentResponseCount >= 3) {
//       console.log(`🚫 Rate limit: ${recentResponseCount} responses sent in last 2 minutes, skipping`)
//       return
//     }

//     // Get business profile and conversation context
//     const { profileContent, businessContext } = await getBusinessProfileForAutomation(automation.id)
//     const conversationHistory = await buildConversationContext(pageId, senderId, automation.id)
//     console.log("📋 Business profile and conversation context loaded for enhanced Gemini")

//     const isPROUser = automation.User?.subscription?.plan === "PRO"
//     console.log("🔮 Generating enhanced Gemini response...")

//     const geminiResponse = await generateGeminiResponse({
//       userMessage,
//       businessProfile: profileContent,
//       conversationHistory,
//       businessContext,
//       isPROUser,
//       isVoiceflowFallback: isErrorFallback,
//     })

//     // 🚫 CHECK FOR DUPLICATE RESPONSE BEFORE SENDING
//     const isDuplicate = await checkDuplicateResponse(pageId, senderId, geminiResponse, messageType)
//     if (isDuplicate) {
//       console.log("🚫 Duplicate response detected, skipping send")
//       return
//     }

//     console.log(
//       `💬 Enhanced Gemini response: "${geminiResponse.substring(0, 100)}..." (${geminiResponse.length} chars)`,
//     )

//     // Store conversation messages
//     await storeConversationMessage(pageId, senderId, userMessage, false, automation?.id || null)
//     if (automation?.id) {
//       await trackMessageForSentiment(automation.id, pageId, senderId, userMessage)
//     }
//     await storeConversationMessage(pageId, "bot", geminiResponse, true, automation?.id || null)

//     // Send response immediately (no typing delay)
//     const token = automation?.User?.integrations?.[0]?.token || process.env.DEFAULT_PAGE_TOKEN!

//     if (messageType === "DM") {
//       console.log("📤 Sending enhanced DM response...")
//       const direct_message = await sendDM(pageId, senderId, geminiResponse, token)
//       if (direct_message.status === 200) {
//         console.log("✅ Enhanced DM sent successfully")
//         // Mark response as sent to prevent duplicates
//         await markResponseAsSent(pageId, senderId, geminiResponse, messageType, automation.id)
//         if (automation) {
//           await trackResponses(automation.id, "DM")
//         }
//         await createChatHistory(automation?.id || "default", pageId, senderId, userMessage)
//         await createChatHistory(automation?.id || "default", pageId, senderId, geminiResponse)
//       } else {
//         console.error("❌ Failed to send DM:", direct_message)
//       }
//     } else if (messageType === "COMMENT" && data.commentId) {
//       console.log("📤 Sending enhanced comment response...")
//       const comment = await sendPrivateMessage(pageId, data.commentId, geminiResponse, token)
//       if (comment.status === 200) {
//         console.log("✅ Enhanced comment response sent successfully")
//         // Mark response as sent to prevent duplicates
//         await markResponseAsSent(pageId, senderId, geminiResponse, messageType, automation.id)
//         if (automation) {
//           await trackResponses(automation.id, "COMMENT")
//         }
//       } else {
//         console.error("❌ Failed to send comment response:", comment)
//       }
//     }
//   } catch (error) {
//     console.error("💥 Error in enhanced Gemini processing:", error)
//     // Only send fallback if we haven't sent any responses recently
//     const recentCount = await getRecentResponseCount(pageId, senderId, messageType, 1)
//     if (recentCount === 0) {
//       const fallbackText =
//         "Hey there! Thanks for reaching out. I'm getting a lot of messages right now, but I definitely want to help you out. Can you give me just a few minutes to get back to you properly? 😊"
//       // Check if this fallback would be a duplicate
//       const isFallbackDuplicate = await checkDuplicateResponse(pageId, senderId, fallbackText, messageType)
//       if (!isFallbackDuplicate) {
//         console.log("🔄 Sending final fallback response...")
//         const token = automation?.User?.integrations?.[0]?.token || process.env.DEFAULT_PAGE_TOKEN!
//         if (messageType === "DM") {
//           const result = await sendDM(pageId, senderId, fallbackText, token)
//           if (result.status === 200) {
//             await markResponseAsSent(pageId, senderId, fallbackText, messageType, automation.id)
//           }
//         } else if (messageType === "COMMENT" && data.commentId) {
//           const result = await sendPrivateMessage(pageId, data.commentId, fallbackText, token)
//           if (result.status === 200) {
//             await markResponseAsSent(pageId, senderId, fallbackText, messageType, automation.id)
//           }
//         }
//       }
//     }
//   }
// }







// import { type NextRequest, NextResponse } from "next/server"
// import {
//   createChatHistory,
//   trackResponses,
//   checkProcessedMessage,
//   markMessageAsProcessed,
//   decideTriggerAction,
//   getAutomationWithTriggers,
//   checkDuplicateResponse,
//   getRecentResponseCount,
//   markResponseAsSent,
// } from "@/actions/webhook/queries"
// import { getBusinessProfileForAutomation } from "@/actions/webhook/business-profile"
// import { generateGeminiResponse, buildConversationContext } from "@/lib/gemini"
// import { createVoiceflowUser, getEnhancedVoiceflowResponse, fetchEnhancedBusinessVariables } from "@/lib/voiceflow"
// import { sendDM, sendPrivateMessage } from "@/lib/fetch"
// import { storeConversationMessage } from "@/actions/chats/queries"
// import { trackMessageForSentiment } from "@/lib/sentiment-tracker"
// import axios from "axios"

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
//   automation: any
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
// }

// interface BusinessData {
//   businessName: string
//   welcomeMessage: string
//   industry: string
//   businessType: string
//   businessDescription: string
//   instagramHandle: string
//   responseLanguage: string
//   businessHours: string
//   autoReplyEnabled: boolean
//   promotionMessage: string
//   targetAudience: string
//   website: string
//   automationGoals: string
//   customerJourney: string
//   features: string
//   businessTypeData: any
//   websiteAnalysis: any
//   automationSetupComplete: boolean
//   automationSetupDate: Date
//   automationAdditionalNotes: string
// }

// interface ConversationContext {
//   pageId: string
//   senderId: string
//   userMessage: string
//   isNewUser: boolean
//   customerType: string
//   messageHistory: { role: string; content: string }[]
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

// // Add this near the top of the file after the imports
// async function validateInstagramToken(token: string, pageId: string): Promise<boolean> {
//   try {
//     const response = await axios.get(`https://graph.instagram.com/v21.0/${pageId}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       timeout: 5000,
//     })
//     return response.status === 200
//   } catch (error) {
//     Logger.error("Token validation failed:", error)
//     return false
//   }
// }

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
//     BackgroundProcessor.process(context, result.responseText!)

//     Logger.success(`✨ Message successfully processed with ${result.aiSystem}`)
//   }

//   private static async buildProcessingContext(
//     data: WebhookData,
//     messageKey: string,
//     startTime: number,
//   ): Promise<ProcessingContext | null> {
//     try {
//       Logger.debug("Building processing context...")

//       const [triggerDecision, automation] = await Promise.all([
//         TimeoutManager.withTimeout(
//           decideTriggerAction(data.pageId, data.senderId, data.userMessage, data.messageType),
//           5000,
//           "Trigger decision",
//         ),
//         TimeoutManager.withTimeout(
//           decideTriggerAction(data.pageId, data.senderId, data.userMessage, data.messageType).then((decision) =>
//             getAutomationWithTriggers(decision.automationId!, data.messageType),
//           ),
//           5000,
//           "Automation lookup",
//         ),
//       ])

//       if (!automation) {
//         Logger.error(`Automation not found`)
//         return null
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
//         return // Stop if token is missing
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
// // ENHANCED VOICEFLOW HANDLER
// // ============================================================================

// class VoiceflowHandler {
//   static async handle(context: ProcessingContext): Promise<ProcessingResult> {
//     Logger.info("🎙️ === ENHANCED VOICEFLOW HANDLER INITIATED ===")

//     try {
//       if (await this.isRateLimited(context)) {
//         return {
//           success: false,
//           aiSystem: "voiceflow_rate_limited",
//           error: "Rate limit exceeded",
//         }
//       }

//       const contextData = await this.gatherContext(context)
//       const response = await this.processVoiceflow(context, contextData)

//       return {
//         success: true,
//         responseText: response.text,
//         buttons: response.buttons,
//         variables: response.variables,
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

//   private static async processVoiceflow(context: ProcessingContext, contextData: any) {
//     Logger.debug("Processing with Voiceflow...")

//     // Create Voiceflow user (non-blocking)
//     createVoiceflowUser(context.conversationUserId).catch((error) =>
//       Logger.warning("Voiceflow user creation failed", error),
//     )

//     // Build enhanced business variables
//     const businessVariables = await this.buildEnhancedBusinessVariables(context, contextData)

//     // Try Voiceflow with enhanced handling
//     try {
//       const isFirstMessage = contextData.conversationHistory.length === 0

//       const voiceflowResult = await TimeoutManager.withTimeout(
//         getEnhancedVoiceflowResponse(context.userMessage, context.conversationUserId, businessVariables, {
//           maxRetries: 3,
//           timeoutMs: CONFIG.TIMEOUTS.VOICEFLOW,
//           enableFallbackDetection: true,
//           isFirstMessage,
//         }),
//         CONFIG.TIMEOUTS.VOICEFLOW,
//         "Enhanced Voiceflow response",
//       )

//       if (voiceflowResult.success && voiceflowResult.response?.text) {
//         Logger.success("✨ Enhanced Voiceflow response successful")
//         return {
//           text: voiceflowResult.response.text,
//           buttons: voiceflowResult.response.quickReplies,
//           variables: voiceflowResult.variables,
//           aiSystem: "enhanced_voiceflow",
//         }
//       } else {
//         Logger.warning(`Voiceflow failed: ${voiceflowResult.fallbackReason || voiceflowResult.error}`)
//       }
//     } catch (error) {
//       Logger.warning("Voiceflow failed, falling back to Gemini", error)
//     }

//     // Enhanced Gemini Pro fallback
//     Logger.info("🔄 Using Gemini Pro fallback...")
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
//         text: responseText,
//         buttons: undefined,
//         variables: undefined,
//         aiSystem: "gemini_pro_fallback",
//       }
//     } catch (error) {
//       Logger.warning("🚫 Gemini quota exceeded, using human-like fallback")
//       return {
//         text: CONFIG.FALLBACK_RESPONSES.PRO,
//         buttons: undefined,
//         variables: undefined,
//         aiSystem: "static_pro_fallback",
//       }
//     }
//   }

//   private static async buildEnhancedBusinessVariables(context: ProcessingContext, contextData: any) {
//     const isNewUser = contextData.conversationHistory.length === 0
//     const customerType =
//       contextData.conversationHistory.length >= 10
//         ? "VIP"
//         : contextData.conversationHistory.length > 0
//           ? "RETURNING"
//           : "NEW"

//     // Use enhanced business variables fetcher
//     try {
//       return await fetchEnhancedBusinessVariables(context.automation.User?.id || "default", context.automation.id, {
//         pageId: context.data.pageId,
//         senderId: context.data.senderId,
//         userMessage: context.userMessage,
//         isNewUser,
//         customerType,
//         messageHistory: contextData.conversationHistory,
//       })
//     } catch (error) {
//       Logger.error("Failed to fetch enhanced business variables, using fallback", error)

//       // Fallback to basic variables
//       return {
//         business_name: contextData.profile.businessContext.businessName || "Our Business",
//         welcome_message: contextData.profile.businessContext.welcomeMessage || "Hello! How can I help you today?",
//         customer_type: customerType,
//         is_new_user: isNewUser.toString(),
//         conversation_length: contextData.conversationHistory.length.toString(),
//         trigger_type: context.triggerDecision.triggerType,
//         trigger_reason: context.triggerDecision.reason,
//       }
//     }
//   }
// }

// // ============================================================================
// // GEMINI HANDLER (UNCHANGED BUT ENHANCED LOGGING)
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

//     const formattedButtons = this.formatButtons(buttons)
//     const token = context.automation?.User?.integrations?.[0]?.token || process.env.DEFAULT_PAGE_TOKEN!

//     // Validate token before attempting to send
//     const isValidToken = await validateInstagramToken(token, context.data.pageId)
//     if (!isValidToken) {
//       Logger.error("Invalid Instagram token detected")
//       throw new Error("Invalid Instagram token - please reconnect your Instagram account")
//     }

//     // Enhanced fallback responses with better error handling
//     const fallbackResponses = [
//       text,
//       CONFIG.FALLBACK_RESPONSES.STANDARD,
//       CONFIG.FALLBACK_RESPONSES.EMERGENCY,
//       CONFIG.FALLBACK_RESPONSES.SIMPLE,
//     ]

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

//   private static formatButtons(
//     buttons?: { name: string; payload: string | object | any }[],
//   ): { name: string; payload: string }[] | undefined {
//     if (!buttons || buttons.length === 0) return undefined

//     return buttons.slice(0, 11).map((button) => {
//       // Ensure button name is never empty
//       let buttonName = String(button.name || "").trim()
//       if (buttonName.length === 0) {
//         buttonName = "Option"
//       }

//       buttonName = buttonName.substring(0, 20)

//       let buttonPayload: string

//       if (typeof button.payload === "string") {
//         buttonPayload = button.payload.substring(0, 1000)
//       } else if (button.payload === null || button.payload === undefined) {
//         buttonPayload = buttonName
//       } else {
//         try {
//           buttonPayload = JSON.stringify(button.payload).substring(0, 1000)
//         } catch (e) {
//           buttonPayload = String(button.payload).substring(0, 1000)
//         }
//       }

//       return {
//         name: buttonName,
//         payload: buttonPayload,
//       }
//     })
//   }
// }

// // ============================================================================
// // BACKGROUND PROCESSOR (UNCHANGED)
// // ============================================================================

// class BackgroundProcessor {
//   static process(context: ProcessingContext, responseText: string): void {
//     Logger.debug("🔄 Starting background tasks...")

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
//     ])
//       .then((results) => {
//         const failures = results.filter((r) => r.status === "rejected").length
//         if (failures === 0) {
//           Logger.success("✅ All background tasks completed successfully")
//         } else {
//           Logger.warning(`⚠️ ${failures} background tasks failed`)
//         }
//       })
//       .catch((error) => Logger.warning("Background tasks failed", error))
//   }
// }

// // ============================================================================
// // MAIN ROUTE HANDLERS
// // ============================================================================

// export async function GET(req: NextRequest) {
//   const hub = req.nextUrl
//   // Handle GET request logic here
//   return NextResponse.json({ message: "GET request received" })
// }

// export async function POST(req: NextRequest) {
//   const payload = await req.json()
//   const webhookData = WebhookValidator.extractData(payload)

//   if (!webhookData) {
//     return NextResponse.json({ message: "Invalid webhook data" }, { status: 400 })
//   }

//   const specialWebhook = WebhookValidator.isSpecialWebhook(payload)
//   if (specialWebhook) {
//     Logger.info(`Handling special webhook: ${specialWebhook}`)
//     // Handle special webhook logic here
//     return NextResponse.json({ message: "Special webhook handled" })
//   }

//   const startTime = Date.now()
//   await MessageProcessor.processImmediate(webhookData, startTime)

//   return NextResponse.json({ message: "Message processed successfully" })
// }











// import { type NextRequest, NextResponse } from "next/server"
// import {
//   createChatHistory,
//   trackResponses,
//   checkProcessedMessage,
//   markMessageAsProcessed,
//   decideTriggerAction,
//   getAutomationWithTriggers,
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
//   automation: any
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
//           automation = await getAutomationWithTriggers(triggerDecision.automationId!, data.messageType)
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
//       const response = await this.processVoiceflow(context, contextData)

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

//   private static async processVoiceflow(context: ProcessingContext, contextData: any) {
//     Logger.debug("Processing with enhanced Voiceflow...")

//     // Create Voiceflow user (non-blocking)
//     createVoiceflowUser(context.conversationUserId).catch((error) =>
//       Logger.warning("Voiceflow user creation failed", error),
//     )

//     // Build enhanced business variables
//     const businessVariables = await this.buildEnhancedBusinessVariables(context, contextData)

//     // Try Voiceflow with enhanced handling
//     try {
//       const isFirstMessage = contextData.conversationHistory.length === 0

//       const voiceflowResult = await TimeoutManager.withTimeout(
//         getEnhancedVoiceflowResponse(context.userMessage, context.conversationUserId, businessVariables, {
//           maxRetries: 3,
//           timeoutMs: CONFIG.TIMEOUTS.VOICEFLOW,
//           enableFallbackDetection: true,
//           isFirstMessage,
//         }),
//         CONFIG.TIMEOUTS.VOICEFLOW,
//         "Enhanced Voiceflow response",
//       )

//       if (voiceflowResult.success && voiceflowResult.response?.text) {
//         Logger.success("✨ Enhanced Voiceflow response successful")

//         // Extract customer data from Voiceflow variables
//         const extractedData = this.extractCustomerData(voiceflowResult.variables)

//         // Process lead qualification if we have user data
//         if (context.automation.User?.id && context.data.senderId !== context.data.pageId) {
//           await this.processLeadQualification(context, extractedData)
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
//       }
//     } catch (error) {
//       Logger.warning("Voiceflow failed, falling back to Gemini", error)
//     }

//     // Enhanced Gemini Pro fallback
//     Logger.info("🔄 Using Gemini Pro fallback...")
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
//         text: responseText,
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

//   private static async buildEnhancedBusinessVariables(context: ProcessingContext, contextData: any) {
//     const isNewUser = contextData.conversationHistory.length === 0
//     const customerType =
//       contextData.conversationHistory.length >= 10
//         ? "VIP"
//         : contextData.conversationHistory.length > 0
//           ? "RETURNING"
//           : "NEW"

//     try {
//       return await fetchEnhancedBusinessVariables(context.automation.User?.id || "default", context.automation.id, {
//         pageId: context.data.pageId,
//         senderId: context.data.senderId,
//         userMessage: context.userMessage,
//         isNewUser,
//         customerType,
//         messageHistory: contextData.conversationHistory,
//       })
//     } catch (error) {
//       Logger.error("Failed to fetch enhanced business variables, using fallback", error)

//       return {
//         business_name: contextData.profile.businessContext.businessName || "Our Business",
//         welcome_message: contextData.profile.businessContext.welcomeMessage || "Hello! How can I help you today?",
//         customer_type: customerType,
//         is_new_user: isNewUser.toString(),
//         conversation_length: contextData.conversationHistory.length.toString(),
//         trigger_type: context.triggerDecision.triggerType,
//         trigger_reason: context.triggerDecision.reason,
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
//     try {
//       Logger.info("🔍 Starting lead qualification analysis...")

//       const leadAnalysisResult = await analyzeLead({
//         userId: context.automation.User.id,
//         automationId: context.automation.id,
//         platformId: context.data.pageId,
//         customerId: context.data.senderId,
//         message: context.userMessage,
//         messageType: context.data.messageType,
//         timestamp: new Date(),
//       })

//       if (leadAnalysisResult?.lead) {
//         Logger.success(`📊 Lead analysis completed for ${context.data.senderId}`)

//         // Store marketing info if we extracted customer data
//         if (extractedData && (extractedData.name || extractedData.email || extractedData.phone)) {
//           await this.storeMarketingInfo(context.automation.User.id, extractedData, leadAnalysisResult.lead.id)
//         }
//       }
//     } catch (error) {
//       Logger.error("❌ Error in lead qualification (continuing anyway):", error)
//     }
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















// import { type NextRequest, NextResponse } from "next/server"
// import {
//   createChatHistory,
//   trackResponses,
//   checkProcessedMessage,
//   markMessageAsProcessed,
//   decideTriggerAction,
//   getAutomationWithTriggers,
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
//   automation: any
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
//           automation = await getAutomationWithTriggers(triggerDecision.automationId!, data.messageType)
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
//       const response = await this.processVoiceflow(context, contextData)

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

//   private static async processVoiceflow(context: ProcessingContext, contextData: any) {
//     Logger.debug("Processing with enhanced Voiceflow...")

//     // Create Voiceflow user (non-blocking)
//     createVoiceflowUser(context.conversationUserId).catch((error) =>
//       Logger.warning("Voiceflow user creation failed", error),
//     )

//     // Build enhanced business variables
//     const businessVariables = await this.buildEnhancedBusinessVariables(context, contextData)

//     // Try Voiceflow with enhanced handling
//     try {
//       const isFirstMessage = contextData.conversationHistory.length === 0

//       const voiceflowResult = await TimeoutManager.withTimeout(
//         getEnhancedVoiceflowResponse(context.userMessage, context.conversationUserId, businessVariables, {
//           maxRetries: 3,
//           timeoutMs: CONFIG.TIMEOUTS.VOICEFLOW,
//           enableFallbackDetection: true,
//           isFirstMessage,
//         }),
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
//       }
//     } catch (error) {
//       Logger.warning("Voiceflow failed, falling back to Gemini", error)
//     }

//     // Enhanced Gemini Pro fallback
//     Logger.info("🔄 Using Gemini Pro fallback...")
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
//         text: responseText,
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

//   private static async buildEnhancedBusinessVariables(context: ProcessingContext, contextData: any) {
//     const isNewUser = contextData.conversationHistory.length === 0
//     const customerType =
//       contextData.conversationHistory.length >= 10
//         ? "VIP"
//         : contextData.conversationHistory.length > 0
//           ? "RETURNING"
//           : "NEW"

//     try {
//       return await fetchEnhancedBusinessVariables(context.automation.User?.id || "default", context.automation.id, {
//         pageId: context.data.pageId,
//         senderId: context.data.senderId,
//         userMessage: context.userMessage,
//         isNewUser,
//         customerType,
//         messageHistory: contextData.conversationHistory,
//       })
//     } catch (error) {
//       Logger.error("Failed to fetch enhanced business variables, using fallback", error)

//       return {
//         business_name: contextData.profile.businessContext.businessName || "Our Business",
//         welcome_message: contextData.profile.businessContext.welcomeMessage || "Hello! How can I help you today?",
//         customer_type: customerType,
//         is_new_user: isNewUser.toString(),
//         conversation_length: contextData.conversationHistory.length.toString(),
//         trigger_type: context.triggerDecision.triggerType,
//         trigger_reason: context.triggerDecision.reason,
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

//         const leadAnalysisResult = await Promise.race([
//           analyzeLead({
//             userId: context.automation.User.id,
//             automationId: context.automation.id,
//             platformId: context.data.pageId,
//             customerId: context.data.senderId,
//             message: context.userMessage,
//             messageType: context.data.messageType,
//             timestamp: new Date(),
//         }),
//         new Promise((_, reject) => setTimeout(() => reject(new Error("Lead analysis timeout")), 10000)),
//       ]) as any

//       if (leadAnalysisResult && leadAnalysisResult.lead) {
//         Logger.success(`📊 Lead analysis completed for ${context.data.senderId}`)

//         // Store marketing info if we extracted customer data
//         if (extractedData && (extractedData.name || extractedData.email || extractedData.phone)) {
//           await this.storeMarketingInfo(context.automation.User.id, extractedData, leadAnalysisResult.lead.id)
//         }
//       }
//     } catch (error) {
//       Logger.error("❌ Error in lead qualification (running in background):", error)
//     }
//   })
// }

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

// // class GeminiHandler {
// //   static async handle(context: ProcessingContext): Promise<ProcessingResult> {
// //     Logger.info("🔮 === ENHANCED GEMINI HANDLER INITIATED ===")

// //     try {
// //       const count = await getRecentResponseCount(
// //         context.data.pageId,
// //         context.data.senderId,
// //         context.data.messageType,
// //         2,
// //       )
// //       if (count >= CONFIG.RATE_LIMITS.MAX_RESPONSES_PER_2MIN) {
// //         Logger.warning(`Rate limit exceeded: ${count} responses`)
// //         return {
// //           success: false,
// //           aiSystem: "gemini_rate_limited",
// //           error: "Rate limit exceeded",
// //         }
// //       }

// //       const [profileResult, historyResult] = await Promise.allSettled([
// //         TimeoutManager.withTimeout(
// //           getBusinessProfileForAutomation(context.automation.id),
// //           CONFIG.TIMEOUTS.PROFILE,
// //           "Business profile",
// //         ),
// //         TimeoutManager.withTimeout(
// //           buildConversationContext(context.data.pageId, context.data.senderId, context.automation.id),
// //           CONFIG.TIMEOUTS.PROFILE,
// //           "Conversation history",
// //         ),
// //       ])

// //       const profile =
// //         profileResult.status === "fulfilled" ? profileResult.value : { profileContent: "", businessContext: {} }

// //       const history =
// //         historyResult.status === "fulfilled" && Array.isArray(historyResult.value) ? historyResult.value : []

// //       Logger.success(`Gemini context gathered - History: ${history.length} messages`)

// //       // Process lead qualification in background for standard users (non-blocking)
// //       if (context.automation.User?.id && context.data.senderId !== context.data.pageId) {
// //         this.processLeadQualification(context)
// //       }

// //       const geminiResponse = await TimeoutManager.withTimeout(
// //         generateGeminiResponse({
// //           userMessage: context.userMessage,
// //           businessProfile: profile.profileContent,
// //           conversationHistory: history,
// //           businessContext: profile.businessContext,
// //           isPROUser: false,
// //         }),
// //         CONFIG.TIMEOUTS.GEMINI,
// //         "Gemini response",
// //       )

// //       const responseText = typeof geminiResponse === "string" ? geminiResponse : CONFIG.FALLBACK_RESPONSES.STANDARD

// //       Logger.success("✨ Gemini response successful")

// //       return {
// //         success: true,
// //         responseText,
// //         buttons: undefined,
// //         variables: undefined,
// //         extractedData: undefined,
// //         aiSystem: "enhanced_gemini",
// //       }
// //     } catch (error) {
// //       Logger.error("Gemini handler failed", error)
// //       return {
// //         success: false,
// //         responseText: CONFIG.FALLBACK_RESPONSES.STANDARD,
// //         aiSystem: "gemini_failed_fallback",
// //         error: error instanceof Error ? error.message : String(error),
// //       }
// //     }
// //   }
  

// //   private static async processLeadQualification(context: ProcessingContext) {
// //     // Run lead qualification in background without blocking response
// //     setImmediate(async () => {
// //       try {
// //         Logger.info("🔍 Starting lead qualification for standard user...")

// //         const leadAnalysisResult = await Promise.race([
// //           analyzeLead({
// //             userId: context.automation.User.id,
// //             automationId: context.automation.id,
// //             platformId: context.data.pageId,
// //             customerId: context.data.senderId,
// //             message: context.userMessage,
// //             messageType: context.data.messageType,
// //             timestamp: new Date(),
// //         }),
// //         new Promise((_, reject) => setTimeout(() => reject(new Error("Lead analysis timeout")), 10000)),
// //       ]) as any

// //       if (leadAnalysisResult && leadAnalysisResult.lead) {
// //         Logger.success(`📊 Lead analysis completed for standard user`)
// //       }
// //     } catch (error) {
// //       Logger.error("❌ Error in lead qualification for standard user (running in background):", error)
// //     }
// //   })
// // }

//  class GeminiHandler {
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
  automation: any // This will now include businessWorkflowConfig
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
  CLEANUP_INTERVAL: 5 * 60 * 1000,
  FALLBACK_RESPONSES: {
    PRO: "Thank you for your message! As a valued customer, I want to ensure you get the best possible assistance. Let me get back to you with detailed information shortly. 🌟",
    STANDARD: "Thanks for your message! I'm here to help. Let me get back to you with the information you need. 😊",
    EMERGENCY: "Hi! Thanks for reaching out. I'm here to help! 😊",
    SIMPLE: "Hello! 👋",
  },
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
      await this.handleProcessingFailure(data, error)
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
            // Changed from getAutomationWithTriggers
            where: { id: triggerDecision.automationId! },
            include: {
              User: {
                include: {
                  subscription: true,
                },
              },
              businessWorkflowConfig: {
                // NEW: Include the related workflow config
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

  private static async handleProcessingFailure(data: WebhookData, error: any): Promise<void> {
    Logger.error("Handling processing failure", error)

    try {
      const emergencyResponse = CONFIG.FALLBACK_RESPONSES.EMERGENCY
      const token = process.env.DEFAULT_PAGE_TOKEN

      if (!token) {
        Logger.error("DEFAULT_PAGE_TOKEN is not set in environment variables!")
        return
      }

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
// ENHANCED VOICEFLOW HANDLER WITH DATA COLLECTION
// ============================================================================

class VoiceflowHandler {
  static async handle(context: ProcessingContext): Promise<ProcessingResult> {
    Logger.info("🎙️ === ENHANCED VOICEFLOW WITH DATA COLLECTION INITIATED ===")

    try {
      if (await this.isRateLimited(context)) {
        return {
          success: false,
          aiSystem: "voiceflow_rate_limited",
          error: "Rate limit exceeded",
        }
      }

      const contextData = await this.gatherContext(context)

      // NEW: Fetch enhanced business variables here, including decrypted client credentials
      const businessVariables = await fetchEnhancedBusinessVariables(
        context.automation.businessId, // Use the businessId from the automation
        context.automation.id, // Pass automation ID
        context.automation.businessWorkflowConfig?.id || null, // Pass the linked workflow config ID
        {
          // Pass conversation context
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
      )

      const response = await this.processVoiceflowWithVariables(context, contextData, businessVariables) // Pass businessVariables

      return {
        success: true,
        responseText: response.text,
        buttons: response.buttons,
        variables: response.variables,
        extractedData: response.extractedData,
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
      profileResult.status === "fulfilled" ? profileResult.value : { profileContent: "", businessContext: {} }

    Logger.success(`Context gathered - History: ${conversationHistory.length} messages`)

    return { conversationHistory, profile }
  }

  private static async processVoiceflowWithVariables(
    context: ProcessingContext,
    contextData: any,
    businessVariables: Record<string, string>, // NEW: Accept businessVariables
  ) {
    Logger.debug("Processing with enhanced Voiceflow...")

    // Create Voiceflow user (non-blocking)
    createVoiceflowUser(context.conversationUserId).catch((error) =>
      Logger.warning("Voiceflow user creation failed", error),
    )

    // Retrieve Voiceflow credentials from environment variables (my SaaS's credentials)
    const voiceflowApiKey = process.env.VOICEFLOW_API_KEY
    const voiceflowProjectId = process.env.VOICEFLOW_PROJECT_ID
    const voiceflowVersionId = process.env.VOICEFLOW_VERSION_ID // Optional

    if (!voiceflowApiKey || !voiceflowProjectId) {
      Logger.error(
        "Voiceflow API Key or Project ID is missing from environment variables. Cannot proceed with Voiceflow.",
      )
      return this.handleVoiceflowFallback(context, contextData, "Missing Voiceflow environment variables")
    }

    try {
      const isFirstMessage = contextData.conversationHistory.length === 0

      const voiceflowResult = await TimeoutManager.withTimeout(
        getEnhancedVoiceflowResponse(
          context.userMessage,
          context.conversationUserId,
          businessVariables, // Pass the fetched businessVariables here
          voiceflowApiKey,
          voiceflowProjectId,
          voiceflowVersionId, // Pass optional version ID
          {
            maxRetries: 3,
            timeoutMs: CONFIG.TIMEOUTS.VOICEFLOW,
            enableFallbackDetection: true,
            isFirstMessage,
          },
        ),
        CONFIG.TIMEOUTS.VOICEFLOW,
        "Enhanced Voiceflow response",
      )

      if (voiceflowResult.success && voiceflowResult.response?.text) {
        Logger.success("✨ Enhanced Voiceflow response successful")

        // Extract customer data from Voiceflow variables
        const extractedData = this.extractCustomerData(voiceflowResult.variables)

        // Process lead qualification in background (non-blocking)
        if (context.automation.User?.id && context.data.senderId !== context.data.pageId) {
          this.processLeadQualification(context, extractedData)
        }

        return {
          text: voiceflowResult.response.text,
          buttons: voiceflowResult.response.quickReplies,
          variables: voiceflowResult.variables,
          extractedData,
          aiSystem: "enhanced_voiceflow_with_data_collection",
        }
      } else {
        Logger.warning(`Voiceflow failed: ${voiceflowResult.fallbackReason || voiceflowResult.error}`)
        return this.handleVoiceflowFallback(
          context,
          contextData,
          voiceflowResult.fallbackReason || voiceflowResult.error ||"Error",
        )
      }
    } catch (error) {
      Logger.warning("Voiceflow failed, falling back to Gemini", error)
      return this.handleVoiceflowFallback(context, contextData, error instanceof Error ? error.message : String(error))
    }
  }

  // Add a helper method for fallback logic to avoid repetition
  private static async handleVoiceflowFallback(context: ProcessingContext, contextData: any, reason: string) {
    Logger.info(`🔄 Voiceflow fallback triggered due to: ${reason}. Using Gemini Pro fallback...`)
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
        "Gemini response",
      )

      const responseText = typeof geminiResponse === "string" ? geminiResponse : CONFIG.FALLBACK_RESPONSES.PRO

      Logger.success("✨ Gemini Pro fallback successful")
      return {
        success: true,
        responseText,
        buttons: undefined,
        variables: undefined,
        extractedData: undefined,
        aiSystem: "gemini_pro_fallback",
      }
    } catch (error) {
      Logger.warning("🚫 Gemini quota exceeded, using human-like fallback")
      return {
        text: CONFIG.FALLBACK_RESPONSES.PRO,
        buttons: undefined,
        variables: undefined,
        extractedData: undefined,
        aiSystem: "static_pro_fallback",
      }
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
// GEMINI HANDLER (ENHANCED WITH LEAD QUALIFICATION)
// ============================================================================

class GeminiHandler {
  static async handle(context: ProcessingContext): Promise<ProcessingResult> {
    Logger.info("🔮 === ENHANCED GEMINI HANDLER INITIATED ===")

    try {
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
        extractedData: undefined,
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
// ENHANCED RESPONSE SENDER
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
      Logger.warning("Duplicate response detected, skipping")
      return
    }

    const formattedButtons = transformButtonsToInstagram(buttons)
    const token = context.automation?.User?.integrations?.[0]?.token || process.env.DEFAULT_PAGE_TOKEN!

    const fallbackResponses = [text, CONFIG.FALLBACK_RESPONSES.STANDARD, CONFIG.FALLBACK_RESPONSES.EMERGENCY]

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
              i === 0 ? formattedButtons : undefined,
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
              i === 0 ? formattedButtons : undefined,
            ),
            10000,
            `Comment send attempt ${i + 1}`,
          )
        }

        if (result?.status === 200) {
          Logger.success(`✅ Response sent successfully (attempt ${i + 1})`)

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
