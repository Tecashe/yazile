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
  getFallbackAutomation,
  getPageToken,
} from "@/actions/webhook/queries"
import { sendDM, sendPrivateMessage } from "@/lib/fetch"
import { openai } from "@/lib/openai"
import { client } from "@/lib/prisma"
import { getVoiceflowResponse, processVoiceflowResponse, createVoiceflowUser } from "@/lib/voiceflow"
import { storeConversationMessage } from "@/actions/chats/queries"
import { analyzeLead } from "@/lib/lead-qualification"
import { handleInstagramDeauthWebhook, handleInstagramDataDeletionWebhook } from "@/lib/deauth"
import { verifyInstagramWebhook } from "@/utils/instagram"
import { trackMessageForSentiment } from "@/lib/sentiment-tracker"

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
 */
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

/**
 * Checks if webhook is a deauthorization request
 */
function isDeauthWebhook(payload: any): boolean {
  return payload?.object === "instagram" && payload?.entry?.[0]?.changes?.[0]?.field === "deauthorizations"
}

/**
 * Checks if webhook is a data deletion request
 */
function isDataDeletionWebhook(payload: any): boolean {
  return payload?.object === "instagram" && payload?.entry?.[0]?.changes?.[0]?.field === "data_deletion"
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

    // Check for deauthorization webhooks first
    if (isDeauthWebhook(webhook_payload)) {
      console.log("Processing Instagram deauthorization webhook")

      const signature = req.headers.get("x-hub-signature-256")
      const body = JSON.stringify(webhook_payload)

      if (!signature || !verifyInstagramWebhook(signature, body, process.env.INSTAGRAM_CLIENT_SECRET!)) {
        console.error("Invalid webhook signature for deauth")
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }

      const result = await handleInstagramDeauthWebhook(webhook_payload)
      return NextResponse.json(result, { status: result.status })
    }

    // Check for data deletion webhooks
    if (isDataDeletionWebhook(webhook_payload)) {
      console.log("Processing Instagram data deletion webhook")

      const signature = req.headers.get("x-hub-signature-256")
      const body = JSON.stringify(webhook_payload)

      if (!signature || !verifyInstagramWebhook(signature, body, process.env.INSTAGRAM_CLIENT_SECRET!)) {
        console.error("Invalid webhook signature for data deletion")
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }

      const result = await handleInstagramDataDeletionWebhook(webhook_payload)
      return NextResponse.json(result, { status: result.status })
    }

    // Continue with regular message/comment processing
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

    // Handle fallback automation if no keyword and not active conversation
    if (!isConversationActive && !matcher?.automationId) {
      const fallbackAutomation = await getFallbackAutomation(pageId, messageType)
      if (fallbackAutomation) {
        console.log("Using fallback automation")

        const token = await getPageToken(pageId)
        const buttons = fallbackAutomation.buttons
        const instagramButtons =
          buttons &&
          Array.isArray(buttons) &&
          buttons.every((btn) => typeof btn === "object" && btn !== null && "name" in btn && "payload" in btn)
            ? transformButtonsToInstagram(buttons as { name: string; payload: any }[])
            : undefined

        if (messageType === "DM") {
          await sendDM(
            pageId,
            senderId,
            fallbackAutomation.listener?.prompt || "Hi, how can I help you today?",
            token,
            instagramButtons,
          )
        } else if (messageType === "COMMENT" && data.commentId) {
          await sendPrivateMessage(
            pageId,
            data.commentId,
            fallbackAutomation.listener?.prompt || "Hi, how can I help you today?",
            token,
            instagramButtons,
          )
        }
        return NextResponse.json({ message: "Fallback automation triggered" }, { status: 200 })
      } else {
        console.log("No fallback automation found")
        return NextResponse.json({ message: "No keyword match" }, { status: 200 })
      }
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

    // Process for lead qualification and get lead ID   automation?.userId && senderId !== pageId
    let leadAnalysisResult = null
    // if (automation?.userId) {
    if (automation?.userId && senderId !== pageId) {
      try {
        leadAnalysisResult = await analyzeLead({
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
      console.log("Using Voiceflow for PRO user")
      await handleVoiceflowResponse(data, automation, userId, userMessage, leadAnalysisResult)
    } else {
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

async function handleVoiceflowResponse(
  data: WebhookData,
  automation: any,
  userId: string,
  userMessage: string,
  leadAnalysisResult: any,
) {
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
      text: "Thanks for your message! I'm a bit busy at the moment but I'll get back to you soon with a proper answer. 😊",
      buttons: undefined,
    }
    let voiceflowVariables: VoiceflowVariables = {}

    const { response, variables } = await getVoiceflowResponse(userMessage, userId, businessVariables)
    voiceflowResponse = processVoiceflowResponse(response)
    voiceflowVariables = variables

    // Store marketing info if available
    if (voiceflowVariables.clientname || voiceflowVariables.clientemail || voiceflowVariables.clientphone) {
      try {
        // Find the user ID from the automation
        const automationUserId = automation?.userId

        if (automationUserId) {
          // Create or update marketing info linked to the user
          await client.marketingInfo.create({
            data: {
              name: voiceflowVariables.clientname || voiceflowVariables.name,
              email: voiceflowVariables.clientemail || voiceflowVariables.email,
              phone: voiceflowVariables.clientphone || voiceflowVariables.phone,
              userId: automationUserId,
            },
          })

          // Also update the lead with the same information if we have a lead
          if (leadAnalysisResult?.lead?.id) {
            const existingLead = await client.lead.findUnique({
              where: { id: leadAnalysisResult.lead.id },
              select: { metadata: true },
            })

            // Safely handle the metadata as a JSON object
            const currentMetadata = (existingLead?.metadata as Record<string, any>) || {}

            await client.lead.update({
              where: { id: leadAnalysisResult.lead.id },
              data: {
                name: voiceflowVariables.clientname || voiceflowVariables.name,
                email: voiceflowVariables.clientemail || voiceflowVariables.email,
                phone: voiceflowVariables.clientphone || voiceflowVariables.phone,
                metadata: {
                  ...currentMetadata,
                  marketingInfoCaptured: true,
                  lastMarketingUpdate: new Date().toISOString(),
                },
              },
            })
          }

          console.log("Marketing info stored successfully")
        }
      } catch (error) {
        console.error("Error storing marketing info:", error)
      }
    }

    // Store conversation
    await storeConversationMessage(pageId, senderId, userMessage, false, automation?.id || null)

    // Track message for sentiment analysis
    if (automation?.id) {
      await trackMessageForSentiment(automation.id, pageId, senderId, userMessage)
    }

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
    const fallbackText =
      "Thanks for your message! I'm a bit busy at the moment but I'll get back to you soon with a proper answer. 😊"

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

          if (automation?.id) {
            await trackMessageForSentiment(automation.id, pageId, senderId, userMessage)
          }

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

            if (automation?.id) {
              await trackMessageForSentiment(automation.id, pageId, senderId, userMessage)
            }

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

          if (automation?.id) {
            await trackMessageForSentiment(automation.id, pageId, senderId, userMessage)
          }

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
