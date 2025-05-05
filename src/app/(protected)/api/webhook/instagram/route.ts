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
// import type { VoiceflowVariables } from "@/types/voiceflow"

// export async function GET(req: NextRequest) {
//   const hub = req.nextUrl.searchParams.get("hub.challenge")
//   return new NextResponse(hub)
// }

// export async function POST(req: NextRequest) {
//   console.log("POST request received")
//   let webhook_payload, matcher, userId, userMessage, pageId, senderId, recipientId

//   try {
//     webhook_payload = await req.json()
//     console.log("Received webhook payload:", JSON.stringify(webhook_payload, null, 2))

//     // Extractcommon information from webhook payload
//     if (webhook_payload.entry[0].messaging) {
//       pageId = webhook_payload.entry[0].id
//       senderId = webhook_payload.entry[0].messaging[0].sender.id
//       recipientId = webhook_payload.entry[0].messaging[0].recipient.id
//       userMessage = webhook_payload.entry[0].messaging[0].message.text
//       userId = `${pageId}_${senderId}`
//       matcher = await matchKeyword(userMessage)
//     } else if (webhook_payload.entry[0].changes && webhook_payload.entry[0].changes[0].field === "comments") {
//       pageId = webhook_payload.entry[0].id
//       senderId = webhook_payload.entry[0].changes[0].value.from.id
//       userMessage = webhook_payload.entry[0].changes[0].value.text
//       userId = `${pageId}_${senderId}`
//       matcher = await matchKeyword(userMessage)
//     } else {
//       return NextResponse.json({ message: "Unsupported webhook payload" }, { status: 400 })
//     }

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
//       automation = await getKeywordAutomation(matcher.automationId, webhook_payload.entry[0].messaging ? true : false)
//     } else {
//       const customer_history = await getChatHistory(pageId, senderId)
//       if (customer_history.history.length > 0) {
//         automation = await findAutomation(customer_history.automationId!)
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
//               const automationGoals = JSON.parse(business.automationGoals as string)
//               businessVariables.primary_goal = automationGoals.primaryGoal || ""
//               businessVariables.response_time = automationGoals.responseTime?.toString() || ""
//               businessVariables.custom_goals = automationGoals.customGoals || ""
//             }

//             if (business.customerJourney) {
//               const customerJourney = JSON.parse(business.customerJourney as string)
//               businessVariables.journey_steps = JSON.stringify(customerJourney.journeySteps || [])
//             }

//             if (business.features) {
//               const features = JSON.parse(business.features as string)
//               businessVariables.enabled_features =
//                 features.features
//                   ?.filter((f: any) => f.enabled)
//                   .map((f: any) => f.name)
//                   .join(", ") || ""
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
//       // let voiceflowResponse =
//       //   "I'm sorry, but I'm having trouble processing your request right now. Please try again later."
//       // let voiceflowVariables: VoiceflowVariables = {}
//       let voiceflowResponse: { text: string; buttons?: { name: string; payload: string }[] } = {
//         text: "I'm sorry, but I'm having trouble processing your request right now. Please try again later.",
//       };
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
//         // await storeConversationMessage(pageId, "bot", voiceflowResponse, true, automation?.id || null)
//         await storeConversationMessage(pageId, "bot", voiceflowResponse.text, true, automation?.id || null);

//         // Send response
//         if (webhook_payload.entry[0].messaging) {
//           // const direct_message = await sendDM(
//           //   pageId,
//           //   senderId,
//           //   voiceflowResponse,
//           //   automation?.User?.integrations[0].token || process.env.DEFAULT_PAGE_TOKEN!,
//           // )
//           const direct_message = await sendDM(
//             pageId,
//             senderId,
//             voiceflowResponse.text, // Use the text property
//             automation?.User?.integrations[0].token || process.env.DEFAULT_PAGE_TOKEN!,
//             voiceflowResponse.buttons // Pass the buttons
//           );

//           if (direct_message.status === 200) {
//             if (automation) {
//               await trackResponses(automation.id, "DM")
//             }
//             await createChatHistory(automation?.id || "default", pageId, senderId, userMessage)
//             // await createChatHistory(automation?.id || "default", pageId, senderId, voiceflowResponse)
//             await createChatHistory(automation?.id || "default", pageId, senderId, voiceflowResponse.text); // Use voiceflowResponse.text
//             return NextResponse.json({ message: "Message sent" }, { status: 200 })
//           }
//         } else if (webhook_payload.entry[0].changes) {
//           // const comment = await sendPrivateMessage(
//           //   pageId,
//           //   webhook_payload.entry[0].changes[0].value.id,
//           //   voiceflowResponse,
//           //   automation?.User?.integrations[0].token || process.env.DEFAULT_PAGE_TOKEN!,
//           // )
//           const comment = await sendPrivateMessage(
//             pageId,
//             webhook_payload.entry[0].changes[0].value.id,
//             voiceflowResponse.text, // Use voiceflowResponse.text instead of voiceflowResponse
//             automation?.User?.integrations[0].token || process.env.DEFAULT_PAGE_TOKEN!,
//             voiceflowResponse.buttons // Pass the buttons if needed
//           );

//           if (comment.status === 200) {
//             if (automation) {
//               await trackResponses(automation.id, "COMMENT")
//             }
//             return NextResponse.json({ message: "Message sent" }, { status: 200 })
//           }
//         }
//       } catch (error) {
//         console.error("Error in Voiceflow processing:", error)
//       }
//     } else {
//       // Free users get OpenAI
//       console.log("Using OpenAI for free user")

//       if (webhook_payload.entry[0].messaging) {
//         if (automation && automation.trigger) {
//           if (automation.listener && automation.listener.listener === "MESSAGE") {
//             const direct_message = await sendDM(
//               webhook_payload.entry[0].id,
//               webhook_payload.entry[0].messaging[0].sender.id,
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
//               const reciever = createChatHistory(
//                 automation.id,
//                 webhook_payload.entry[0].id,
//                 webhook_payload.entry[0].messaging[0].sender.id,
//                 webhook_payload.entry[0].messaging[0].message.text,
//               )

//               const sender = createChatHistory(
//                 automation.id,
//                 webhook_payload.entry[0].id,
//                 webhook_payload.entry[0].messaging[0].sender.id,
//                 smart_ai_message.choices[0].message.content,
//               )

//               await client.$transaction([reciever, sender])

//               const direct_message = await sendDM(
//                 webhook_payload.entry[0].id,
//                 webhook_payload.entry[0].messaging[0].sender.id,
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

//       if (webhook_payload.entry[0].changes && webhook_payload.entry[0].changes[0].field === "comments") {
//         const automations_post = await getKeywordPost(
//           webhook_payload.entry[0].changes[0].value.media.id,
//           automation?.id!,
//         )

//         if (automation && automations_post && automation.trigger) {
//           if (automation.listener) {
//             if (automation.listener.listener === "MESSAGE") {
//               const direct_message = await sendPrivateMessage(
//                 webhook_payload.entry[0].id,
//                 webhook_payload.entry[0].changes[0].value.id,
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
//                 const reciever = createChatHistory(
//                   automation.id,
//                   webhook_payload.entry[0].id,
//                   webhook_payload.entry[0].changes[0].value.from.id,
//                   webhook_payload.entry[0].changes[0].value.text,
//                 )

//                 const sender = createChatHistory(
//                   automation.id,
//                   webhook_payload.entry[0].id,
//                   webhook_payload.entry[0].changes[0].value.from.id,
//                   smart_ai_message.choices[0].message.content,
//                 )

//                 await client.$transaction([reciever, sender])

//                 const direct_message = await sendPrivateMessage(
//                   webhook_payload.entry[0].id,
//                   webhook_payload.entry[0].changes[0].value.id,
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
//       if (!matcher) {
//         const customer_history = await getChatHistory(
//           webhook_payload.entry[0].messaging[0].recipient.id,
//           webhook_payload.entry[0].messaging[0].sender.id,
//         )

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
//                   content: webhook_payload.entry[0].messaging[0].message.text,
//                 },
//               ],
//             })

//             if (smart_ai_message.choices[0].message.content) {
//               const reciever = createChatHistory(
//                 automation.id,
//                 webhook_payload.entry[0].id,
//                 webhook_payload.entry[0].messaging[0].sender.id,
//                 webhook_payload.entry[0].messaging[0].message.text,
//               )

//               const sender = createChatHistory(
//                 automation.id,
//                 webhook_payload.entry[0].id,
//                 webhook_payload.entry[0].messaging[0].sender.id,
//                 smart_ai_message.choices[0].message.content,
//               )

//               await client.$transaction([reciever, sender])

//               const direct_message = await sendDM(
//                 webhook_payload.entry[0].id,
//                 webhook_payload.entry[0].messaging[0].sender.id,
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
// import type { VoiceflowVariables } from "@/types/voiceflow"

// type InstagramQuickReplyE = {
//   content_type: 'text';
//   title: string;
//   payload: string;
// };

// type VoiceflowResponseWithButtons = {
//   text: string;
//   buttons?: { name: string; payload: string }[];
// };


// /**
//  * Instagram Quick Reply button type
//  */
// type InstagramQuickReply = {
//   content_type: 'text';
//   title: string;
//   payload: string;
// };

// /**
//  * Transforms Voiceflow buttons to Instagram-compatible quick replies
//  * Handles both string and non-string payloads
//  */
// function transformButtonsToInstagram(
//   buttons?: { name: string; payload: string | object | any }[]
// ): InstagramQuickReply[] | undefined {
//   if (!buttons || buttons.length === 0) return undefined;

//   // Instagram allows max 11 quick replies and has character limits
//   return buttons.slice(0, 11).map(button => {
//     // Convert name to string and trim to Instagram's limit
//     const buttonName = String(button.name || "").substring(0, 20);
    
//     // Safely handle various payload types
//     let buttonPayload: string;
//     if (typeof button.payload === 'string') {
//       buttonPayload = button.payload.substring(0, 1000); // String payloads can use substring directly
//     } else if (button.payload === null || button.payload === undefined) {
//       buttonPayload = buttonName; // Fallback to using the button name as payload
//     } else {
//       // For objects or other types, stringify them first
//       try {
//         buttonPayload = JSON.stringify(button.payload).substring(0, 1000);
//       } catch (e) {
//         buttonPayload = String(button.payload).substring(0, 1000);
//       }
//     }
    
//     return {
//       content_type: 'text',
//       title: buttonName,
//       payload: buttonPayload
//     };
//   });
// }

// // function transformButtonsToInstagramE(
// //   buttons?: { name: string; payload: string }[]
// // ): InstagramQuickReply[] | undefined {
// //   if (!buttons || buttons.length === 0) return undefined;

// //   // Instagram allows max 11 quick replies and has character limits
// //   return buttons.slice(0, 11).map(button => ({
// //     content_type: 'text',
// //     title: button.name.substring(0, 20), // Max 20 chars
// //     payload: button.payload.substring(0, 1000), // Max 1000 chars
// //   }));
// // }

// export async function GET(req: NextRequest) {
//   const hub = req.nextUrl.searchParams.get("hub.challenge")
//   return new NextResponse(hub)
// }

// export async function POST(req: NextRequest) {
//   console.log("POST request received")
//   let webhook_payload, matcher, userId, userMessage, pageId, senderId, recipientId

//   try {
//     webhook_payload = await req.json()
//     console.log("Received webhook payload:", JSON.stringify(webhook_payload, null, 2))

//     // Extract common information from webhook payload
//     if (webhook_payload.entry[0].messaging) {
//       pageId = webhook_payload.entry[0].id
//       senderId = webhook_payload.entry[0].messaging[0].sender.id
//       recipientId = webhook_payload.entry[0].messaging[0].recipient.id
//       userMessage = webhook_payload.entry[0].messaging[0].message.text
//       userId = `${pageId}_${senderId}`
//       matcher = await matchKeyword(userMessage)
//     } else if (webhook_payload.entry[0].changes && webhook_payload.entry[0].changes[0].field === "comments") {
//       pageId = webhook_payload.entry[0].id
//       senderId = webhook_payload.entry[0].changes[0].value.from.id
//       userMessage = webhook_payload.entry[0].changes[0].value.text
//       userId = `${pageId}_${senderId}`
//       matcher = await matchKeyword(userMessage)
//     } else {
//       return NextResponse.json({ message: "Unsupported webhook payload" }, { status: 400 })
//     }

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
//       automation = await getKeywordAutomation(matcher.automationId, webhook_payload.entry[0].messaging ? true : false)
//     } else {
//       const customer_history = await getChatHistory(pageId, senderId)
//       if (customer_history.history.length > 0) {
//         automation = await findAutomation(customer_history.automationId!)
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
//               const automationGoals = JSON.parse(business.automationGoals as string)
//               businessVariables.primary_goal = automationGoals.primaryGoal || ""
//               businessVariables.response_time = automationGoals.responseTime?.toString() || ""
//               businessVariables.custom_goals = automationGoals.customGoals || ""
//             }

//             if (business.customerJourney) {
//               const customerJourney = JSON.parse(business.customerJourney as string)
//               businessVariables.journey_steps = JSON.stringify(customerJourney.journeySteps || [])
//             }

//             if (business.features) {
//               const features = JSON.parse(business.features as string)
//               businessVariables.enabled_features =
//                 features.features
//                   ?.filter((f: any) => f.enabled)
//                   .map((f: any) => f.name)
//                   .join(", ") || ""
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
//         buttons: undefined
//       };
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
//         await storeConversationMessage(pageId, "bot", voiceflowResponse.text, true, automation?.id || null);

//         // Transform buttons to Instagram format
//         const instagramButtons = transformButtonsToInstagram(voiceflowResponse.buttons)

//         // Send response
//         if (webhook_payload.entry[0].messaging) {
//           const direct_message = await sendDM(
//             pageId,
//             senderId,
//             voiceflowResponse.text,
//             automation?.User?.integrations[0].token || process.env.DEFAULT_PAGE_TOKEN!,
//             instagramButtons
//           );

//           if (direct_message.status === 200) {
//             if (automation) {
//               await trackResponses(automation.id, "DM")
//             }
//             await createChatHistory(automation?.id || "default", pageId, senderId, userMessage)
//             await createChatHistory(automation?.id || "default", pageId, senderId, voiceflowResponse.text);
//             return NextResponse.json({ message: "Message sent" }, { status: 200 })
//           }
//         } else if (webhook_payload.entry[0].changes) {
//           const comment = await sendPrivateMessage(
//             pageId,
//             webhook_payload.entry[0].changes[0].value.id,
//             voiceflowResponse.text,
//             automation?.User?.integrations[0].token || process.env.DEFAULT_PAGE_TOKEN!,
//             instagramButtons
//           );

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
//         if (webhook_payload.entry[0].messaging) {
//           await sendDM(
//             pageId,
//             senderId,
//             voiceflowResponse.text,
//             automation?.User?.integrations[0].token || process.env.DEFAULT_PAGE_TOKEN!
//           );
//         } else if (webhook_payload.entry[0].changes) {
//           await sendPrivateMessage(
//             pageId,
//             webhook_payload.entry[0].changes[0].value.id,
//             voiceflowResponse.text,
//             automation?.User?.integrations[0].token || process.env.DEFAULT_PAGE_TOKEN!
//           );
//         }
//       }
//     } else {
//       // Free users get OpenAI
//       console.log("Using OpenAI for free user")

//       if (webhook_payload.entry[0].messaging) {
//         if (automation && automation.trigger) {
//           if (automation.listener && automation.listener.listener === "MESSAGE") {
//             const direct_message = await sendDM(
//               webhook_payload.entry[0].id,
//               webhook_payload.entry[0].messaging[0].sender.id,
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
//               const reciever = createChatHistory(
//                 automation.id,
//                 webhook_payload.entry[0].id,
//                 webhook_payload.entry[0].messaging[0].sender.id,
//                 webhook_payload.entry[0].messaging[0].message.text,
//               )

//               const sender = createChatHistory(
//                 automation.id,
//                 webhook_payload.entry[0].id,
//                 webhook_payload.entry[0].messaging[0].sender.id,
//                 smart_ai_message.choices[0].message.content,
//               )

//               await client.$transaction([reciever, sender])

//               const direct_message = await sendDM(
//                 webhook_payload.entry[0].id,
//                 webhook_payload.entry[0].messaging[0].sender.id,
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

//       if (webhook_payload.entry[0].changes && webhook_payload.entry[0].changes[0].field === "comments") {
//         const automations_post = await getKeywordPost(
//           webhook_payload.entry[0].changes[0].value.media.id,
//           automation?.id!,
//         )

//         if (automation && automations_post && automation.trigger) {
//           if (automation.listener) {
//             if (automation.listener.listener === "MESSAGE") {
//               const direct_message = await sendPrivateMessage(
//                 webhook_payload.entry[0].id,
//                 webhook_payload.entry[0].changes[0].value.id,
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
//                 const reciever = createChatHistory(
//                   automation.id,
//                   webhook_payload.entry[0].id,
//                   webhook_payload.entry[0].changes[0].value.from.id,
//                   webhook_payload.entry[0].changes[0].value.text,
//                 )

//                 const sender = createChatHistory(
//                   automation.id,
//                   webhook_payload.entry[0].id,
//                   webhook_payload.entry[0].changes[0].value.from.id,
//                   smart_ai_message.choices[0].message.content,
//                 )

//                 await client.$transaction([reciever, sender])

//                 const direct_message = await sendPrivateMessage(
//                   webhook_payload.entry[0].id,
//                   webhook_payload.entry[0].changes[0].value.id,
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
//       if (!matcher) {
//         const customer_history = await getChatHistory(
//           webhook_payload.entry[0].messaging[0].recipient.id,
//           webhook_payload.entry[0].messaging[0].sender.id,
//         )

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
//                   content: webhook_payload.entry[0].messaging[0].message.text,
//                 },
//               ],
//             })

//             if (smart_ai_message.choices[0].message.content) {
//               const reciever = createChatHistory(
//                 automation.id,
//                 webhook_payload.entry[0].id,
//                 webhook_payload.entry[0].messaging[0].sender.id,
//                 webhook_payload.entry[0].messaging[0].message.text,
//               )

//               const sender = createChatHistory(
//                 automation.id,
//                 webhook_payload.entry[0].id,
//                 webhook_payload.entry[0].messaging[0].sender.id,
//                 smart_ai_message.choices[0].message.content,
//               )

//               await client.$transaction([reciever, sender])

//               const direct_message = await sendDM(
//                 webhook_payload.entry[0].id,
//                 webhook_payload.entry[0].messaging[0].sender.id,
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
      buttonPayload = button.payload.substring(0, 1000) // String payloads can use substring directly
    } else if (button.payload === null || button.payload === undefined) {
      buttonPayload = buttonName // Fallback to using the button name as payload
    } else {
      // For objects or other types, stringify them first
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

export async function GET(req: NextRequest) {
  const hub = req.nextUrl.searchParams.get("hub.challenge")
  return new NextResponse(hub)
}

export async function POST(req: NextRequest) {
  console.log("POST request received")
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
        update: { isActive: true, updatedAt: new Date() },
        create: { userId, isActive: true },
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

      // Create Voiceflow user
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

            // Parse and add JSON fields
            if (business.automationGoals) {
              try {
                const automationGoals = JSON.parse(business.automationGoals as string)
                businessVariables.primary_goal = automationGoals.primaryGoal || ""
                businessVariables.response_time = automationGoals.responseTime?.toString() || ""
                businessVariables.custom_goals = automationGoals.customGoals || ""
              } catch (e) {
                console.error("Error parsing automationGoals:", e)
              }
            }

            if (business.customerJourney) {
              try {
                const customerJourney = JSON.parse(business.customerJourney as string)
                businessVariables.journey_steps = JSON.stringify(customerJourney.journeySteps || [])
              } catch (e) {
                console.error("Error parsing customerJourney:", e)
              }
            }

            if (business.features) {
              try {
                const features = JSON.parse(business.features as string)
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

      try {
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
            return NextResponse.json({ message: "Message sent" }, { status: 200 })
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
            return NextResponse.json({ message: "Message sent" }, { status: 200 })
          }
        }
      } catch (error) {
        console.error("Error in Voiceflow processing:", error)
        // Fallback to sending just text if buttons fail
        if (messageType === "DM") {
          await sendDM(
            pageId,
            senderId,
            voiceflowResponse.text,
            automation?.User?.integrations[0].token || process.env.DEFAULT_PAGE_TOKEN!,
          )
        } else if (messageType === "COMMENT" && data.commentId) {
          await sendPrivateMessage(
            pageId,
            data.commentId,
            voiceflowResponse.text,
            automation?.User?.integrations[0].token || process.env.DEFAULT_PAGE_TOKEN!,
          )
        }
      }
    } else {
      // Free users get OpenAI
      console.log("Using OpenAI for free user")

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
              const tracked = await trackResponses(automation.id, "DM")
              if (tracked) {
                return NextResponse.json({ message: "Message sent" }, { status: 200 })
              }
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

              const sender = createChatHistory(
                automation.id,
                pageId,
                senderId,
                smart_ai_message.choices[0].message.content,
              )

              await client.$transaction([reciever, sender])

              const direct_message = await sendDM(
                pageId,
                senderId,
                smart_ai_message.choices[0].message.content,
                automation.User?.integrations[0].token!,
              )

              if (direct_message.status === 200) {
                const tracked = await trackResponses(automation.id, "DM")
                if (tracked) {
                  return NextResponse.json({ message: "Message sent" }, { status: 200 })
                }
              }
            }
          }
        }
      }

      if (messageType === "COMMENT" && data.commentId) {
        const automations_post = await getKeywordPost(
          webhook_payload.entry[0].changes[0].value.media.id,
          automation?.id!,
        )

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
                const tracked = await trackResponses(automation.id, "COMMENT")
                if (tracked) {
                  return NextResponse.json({ message: "Message sent" }, { status: 200 })
                }
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
                  const tracked = await trackResponses(automation.id, "COMMENT")
                  if (tracked) {
                    return NextResponse.json({ message: "Message sent" }, { status: 200 })
                  }
                }
              }
            }
          }
        }
      }

      // Handle continued conversations for free users
      if (!matcher && messageType === "DM" && data.recipientId) {
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

              const sender = createChatHistory(
                automation.id,
                pageId,
                senderId,
                smart_ai_message.choices[0].message.content,
              )

              await client.$transaction([reciever, sender])

              const direct_message = await sendDM(
                pageId,
                senderId,
                smart_ai_message.choices[0].message.content,
                automation.User?.integrations[0].token!,
              )

              if (direct_message.status === 200) {
                return NextResponse.json({ message: "Message sent" }, { status: 200 })
              }
            }
          }
        }
      }
    }

    return NextResponse.json({ message: "Request processed" }, { status: 200 })
  } catch (error) {
    console.error("Unhandled error in POST function:", error)
    return NextResponse.json(
      {
        message: "Error processing request",
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
