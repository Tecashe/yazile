//import axios from 'axios'

// export const refreshToken = async (token: string) => {
//   const refresh_token = await axios.get(
//     `${process.env.INSTAGRAM_BASE_URL}/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`
//   )

//   return refresh_token.data
// }


export const sendDMz = async (
  userId: string,
  recieverId: string,
  prompt: string,
  token: string,
  buttons?: { name: string; payload: string }[]
) => {
  const messagePayload: any = {
    recipient: {
      id: recieverId,
    },
    message: {
      text: prompt,
    },
  };

  if (buttons && buttons.length > 0) {
    messagePayload.message.quick_replies = buttons.map((button) => ({
      content_type: "text",
      title: button.name,
      payload: button.payload,
    }));
  }

  console.log("Sending payload to Instagram:", JSON.stringify(messagePayload, null, 2)); // Log payload

  return await axios.post(
    `${process.env.INSTAGRAM_BASE_URL}/v20.0/${userId}/messages`,
    messagePayload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};



// export const sendPrivateMessage = async (
//   userId: string,
//   recieverId: string,
//   prompt: string,
//   token: string,
//   buttons?: { name: string; payload: string }[] // Add buttons as an optional parameter
// ) => {
//   console.log('sending message')

//   // Construct the message payload
//   const messagePayload: any = {
//     recipient: {
//       comment_id: recieverId,
//     },
//     message: {
//       text: prompt,
//     },
//   }

//   // Add quick replies if buttons are provided
//   if (buttons && buttons.length > 0) {
//     messagePayload.message.quick_replies = buttons.map((button) => ({
//       content_type: 'text',
//       title: button.name,
//       payload: button.payload,
//     }))
//   }

//   // Send the request to Instagram's API
//   return await axios.post(
//     `${process.env.INSTAGRAM_BASE_URL}/${userId}/messages`,
//     messagePayload,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     }
//   )
// }


// export const generateTokens = async (code: string) => {
//   const insta_form = new FormData()
//   insta_form.append('client_id', process.env.INSTAGRAM_CLIENT_ID as string)

//   insta_form.append(
//     'client_secret',
//     process.env.INSTAGRAM_CLIENT_SECRET as string
//   )
//   insta_form.append('grant_type', 'authorization_code')
//   insta_form.append(
//     'redirect_uri',
//     `${process.env.NEXT_PUBLIC_HOST_URL}/callback/instagram`
//   )
//   insta_form.append('code', code)

//   const shortTokenRes = await fetch(process.env.INSTAGRAM_TOKEN_URL as string, {
//     method: 'POST',
//     body: insta_form,
//   })

//   const token = await shortTokenRes.json()
//   if (token.permissions.length > 0) {
//     console.log(token, 'got permissions')
//     const long_token = await axios.get(
//       `${process.env.INSTAGRAM_BASE_URL}/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&access_token=${token.access_token}`
//     )

//     return long_token.data

//   }
// }


// import axios from 'axios'

// type InstagramQuickReply = {
//   content_type: 'text';
//   title: string;
//   payload: string;
// };

// export const refreshToken = async (token: string) => {
//   const refresh_token = await axios.get(
//     `${process.env.INSTAGRAM_BASE_URL}/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`
//   )
//   return refresh_token.data
// }

// export const sendDM = async (
//   userId: string,
//   recieverId: string,
//   prompt: string,
//   token: string,
//   quickReplies?: InstagramQuickReply[]
// ) => {
//   const messagePayload: any = {
//     recipient: {
//       id: recieverId,
//     },
//     messaging_type: "RESPONSE", // Add this required parameter
//     message: {
//       text: prompt,
//     },
//   };

//   if (quickReplies && quickReplies.length > 0) {
//     messagePayload.message.quick_replies = quickReplies;
//   }

//   console.log("Sending payload to Instagram:", JSON.stringify(messagePayload, null, 2));

//   try {
//     const response = await axios.post(
//       `${process.env.INSTAGRAM_BASE_URL}/v18.0/${userId}/messages`, // Using a confirmed working API version
//       messagePayload,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
    
//     console.log("Instagram API response:", JSON.stringify(response.data, null, 2));
//     return response;
//   } catch (error) {
//     console.error("Error sending DM to Instagram:", "error.response?.data || error.message ||" );
//     throw error;
//   }
// };

// export const sendDMe = async (
//   userId: string,
//   recieverId: string,
//   prompt: string,
//   token: string,
//   quickReplies?: InstagramQuickReply[]
// ) => {
//   const messagePayload: any = {
//     recipient: {
//       id: recieverId,
//     },
//     message: {
//       text: prompt,
//     },
//   };

//   if (quickReplies && quickReplies.length > 0) {
//     messagePayload.message.quick_replies = quickReplies;
//   }

//   console.log("Sending payload to Instagram:", JSON.stringify(messagePayload, null, 2));

//   return await axios.post(
//     `${process.env.INSTAGRAM_BASE_URL}/v21.0/${userId}/messages`,
//     messagePayload,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );
// };

// export const sendPrivateMessage = async (
//   userId: string,
//   recieverId: string,
//   prompt: string,
//   token: string,
//   quickReplies?: InstagramQuickReply[]
// ) => {
//   console.log('sending message');

//   const messagePayload: any = {
//     recipient: {
//       comment_id: recieverId,
//     },
//     message: {
//       text: prompt,
//     },
//   }

//   if (quickReplies && quickReplies.length > 0) {
//     messagePayload.message.quick_replies = quickReplies;
//   }

//   return await axios.post(
//     `${process.env.INSTAGRAM_BASE_URL}/${userId}/messages`,
//     messagePayload,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     }
//   )
// }

// export const generateTokens = async (code: string) => {
//   const insta_form = new FormData()
//   insta_form.append('client_id', process.env.INSTAGRAM_CLIENT_ID as string)
//   insta_form.append(
//     'client_secret',
//     process.env.INSTAGRAM_CLIENT_SECRET as string
//   )
//   insta_form.append('grant_type', 'authorization_code')
//   insta_form.append(
//     'redirect_uri',
//     `${process.env.NEXT_PUBLIC_HOST_URL}/callback/instagram`
//   )
//   insta_form.append('code', code)

//   const shortTokenRes = await fetch(process.env.INSTAGRAM_TOKEN_URL as string, {
//     method: 'POST',
//     body: insta_form,
//   })

//   const token = await shortTokenRes.json()
//   if (token.permissions.length > 0) {
//     console.log(token, 'got permissions')
//     const long_token = await axios.get(
//       `${process.env.INSTAGRAM_BASE_URL}/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&access_token=${token.access_token}`
//     )

//     return long_token.data
//   }
// }

//THE TOPMOST IS THE ORIGINAL WORKING WITHOUT BUTTONS ANYAWAY

// import axios, { AxiosError, AxiosResponse } from 'axios';

// type InstagramQuickReply = {
//   content_type: 'text';
//   title: string;
//   payload: string;
// };

// /**
//  * Refreshes an Instagram access token
//  * @param token The access token to refresh
//  * @returns The refreshed token data
//  */
// export const refreshToken = async (token: string) => {
//   try {
//     const response = await axios.get(
//       `${process.env.INSTAGRAM_BASE_URL}/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`
//     );
//     return response.data;
//   } catch (error) {
//     const axiosError = error as AxiosError;
//     console.error("Error refreshing token:", axiosError.response?.data || axiosError.message);
//     throw error;
//   }
// };

// /**
//  * Sends a direct message to an Instagram user
//  * @param userId The page/business ID
//  * @param receiverId The recipient's ID
//  * @param prompt The message text
//  * @param token The access token
//  * @param quickReplies Optional quick reply buttons
//  * @returns The API response
//  */
// export const sendDM = async (
//   userId: string,
//   recieverId: string,
//   prompt: string,
//   token: string,
//   quickReplies?: InstagramQuickReply[]
// ): Promise<AxiosResponse> => {
//   const messagePayload: Record<string, any> = {
//     recipient: {
//       id: recieverId,
//     },
//     messaging_type: "RESPONSE", // Required parameter for Meta API
//     message: {
//       text: prompt,
//     },
//   };

//   if (quickReplies && quickReplies.length > 0) {
//     messagePayload.message.quick_replies = quickReplies;
//   }

//   console.log("Sending DM payload to Instagram:", JSON.stringify(messagePayload, null, 2));

//   try {
//     // Using v16.0 which is known to work well with quick replies
//     const response = await axios.post(
//       `${process.env.INSTAGRAM_BASE_URL}/v22.0/${userId}/messages`,
//       messagePayload,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
    
//     console.log("Instagram DM API response status:", response.status);
//     console.log("Instagram DM API response data:", JSON.stringify(response.data, null, 2));
//     return response;
//   } catch (error) {
//     const axiosError = error as AxiosError;
//     console.error(
//       "Error sending DM to Instagram:", 
//       axiosError.response?.status,
//       axiosError.response?.data || axiosError.message
//     );
//     throw error;
//   }
// };

// /**
//  * Sends a private message in response to a comment
//  * @param userId The page/business ID
//  * @param commentId The comment ID to respond to
//  * @param prompt The message text
//  * @param token The access token
//  * @param quickReplies Optional quick reply buttons
//  * @returns The API response
//  */
// export const sendPrivateMessage = async (
//   userId: string,
//   commentId: string,
//   prompt: string,
//   token: string,
//   quickReplies?: InstagramQuickReply[]
// ): Promise<AxiosResponse> => {
//   console.log('Sending private message in response to comment');

//   const messagePayload: Record<string, any> = {
//     recipient: {
//       comment_id: commentId,
//     },
//     messaging_type: "RESPONSE", // Added this required paramete
//     message: {
//       text: prompt,
//     },
//   };

//   if (quickReplies && quickReplies.length > 0) {
//     messagePayload.message.quick_replies = quickReplies;
//   }

//   console.log("Sending private message payload:", JSON.stringify(messagePayload, null, 2));

//   try {
//     // Using explicit API version for consistency
//     const response = await axios.post(
//       `${process.env.INSTAGRAM_BASE_URL}/v22.0/${userId}/messages`,
//       messagePayload,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );
    
//     console.log("Instagram private message API response status:", response.status);
//     console.log("Instagram private message API response data:", JSON.stringify(response.data, null, 2));
//     return response;
//   } catch (error) {
//     const axiosError = error as AxiosError;
//     console.error(
//       "Error sending private message to Instagram:", 
//       axiosError.response?.status,
//       axiosError.response?.data || axiosError.message
//     );
//     throw error;
//   }
// };

// /**
//  * Generates long-lived access tokens from authorization code
//  * @param code The authorization code
//  * @returns The generated token data
//  */
// export const generateTokens = async (code: string) => {
//   try {
//     const insta_form = new FormData();
//     insta_form.append('client_id', process.env.INSTAGRAM_CLIENT_ID as string);
//     insta_form.append(
//       'client_secret',
//       process.env.INSTAGRAM_CLIENT_SECRET as string
//     );
//     insta_form.append('grant_type', 'authorization_code');
//     insta_form.append(
//       'redirect_uri',
//       `${process.env.NEXT_PUBLIC_HOST_URL}/callback/instagram`
//     );
//     insta_form.append('code', code);

//     const shortTokenRes = await fetch(process.env.INSTAGRAM_TOKEN_URL as string, {
//       method: 'POST',
//       body: insta_form,
//     });

//     const token = await shortTokenRes.json();
//     if (token.permissions && token.permissions.length > 0) {
//       console.log("Got permissions:", token);
      
//       const longTokenResponse = await axios.get(
//         `${process.env.INSTAGRAM_BASE_URL}/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&access_token=${token.access_token}`
//       );
      
//       return longTokenResponse.data;
//     } else {
//       console.error("No permissions returned in token response:", token);
//       throw new Error("No permissions received from Instagram");
//     }
//   } catch (error) {
//     const axiosError = error as Error;
//     console.error("Error generating tokens:", axiosError.message);
//     throw error;
//   }
// };


//WE ARE USING THIS UP HERE, BUT THIS DOWN HERE FOR TESTING HANDOFF

// import axios, { type AxiosError, type AxiosResponse } from "axios"
// import { client } from "@/lib/prisma"

// type InstagramQuickReply = {
//   content_type: "text"
//   title: string
//   payload: string
// }

// interface TypingIndicatorOptions {
//   duration?: number
//   pageId: string
//   recipientId: string
//   token: string
// }

// // Enhanced typing indicator functionality
// export async function sendTypingIndicator(options: TypingIndicatorOptions): Promise<void> {
//   const { duration = 3000, pageId, recipientId, token } = options

//   try {
//     // Send typing_on
//     await axios.post(
//       `${process.env.INSTAGRAM_BASE_URL}/v22.0/${pageId}/messages`,
//       {
//         recipient: { id: recipientId },
//         sender_action: "typing_on",
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       },
//     )

//     // Wait for the specified duration
//     await new Promise((resolve) => setTimeout(resolve, duration))

//     // Send typing_off
//     await axios.post(
//       `${process.env.INSTAGRAM_BASE_URL}/v22.0/${pageId}/messages`,
//       {
//         recipient: { id: recipientId },
//         sender_action: "typing_off",
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       },
//     )
//   } catch (error) {
//     console.error("Error sending typing indicator:", error)
//   }
// }

// // Enhanced message sending with typing simulation
// export async function sendDMWithTyping(
//   userId: string,
//   receiverId: string,
//   prompt: string,
//   token: string,
//   quickReplies?: InstagramQuickReply[],
//   options?: {
//     simulateTyping?: boolean
//     typingDuration?: number
//     priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
//   },
// ): Promise<AxiosResponse> {
//   const { simulateTyping = true, typingDuration, priority = "MEDIUM" } = options || {}

//   try {
//     // Calculate typing duration if not provided
//     const calculatedTypingDuration = typingDuration || calculateTypingDelay(prompt.length)

//     // Send typing indicator if enabled
//     if (simulateTyping) {
//       await sendTypingIndicator({
//         duration: calculatedTypingDuration,
//         pageId: userId,
//         recipientId: receiverId,
//         token,
//       })
//     }

//     // Prepare message payload
//     const messagePayload: Record<string, any> = {
//       recipient: { id: receiverId },
//       messaging_type: "RESPONSE",
//       message: { text: prompt },
//     }

//     if (quickReplies && quickReplies.length > 0) {
//       messagePayload.message.quick_replies = quickReplies
//     }

//     // Add priority metadata if needed
//     if (priority !== "MEDIUM") {
//       messagePayload.metadata = JSON.stringify({ priority })
//     }

//     console.log("Sending DM payload to Instagram:", JSON.stringify(messagePayload, null, 2))

//     const response = await axios.post(`${process.env.INSTAGRAM_BASE_URL}/v22.0/${userId}/messages`, messagePayload, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     })

//     // Log successful delivery
//     await logMessageDelivery(userId, receiverId, prompt, "DM", true)

//     console.log("Instagram DM API response status:", response.status)
//     return response
//   } catch (error) {
//     const axiosError = error as AxiosError
//     console.error("Error sending DM to Instagram:", axiosError.response?.data || axiosError.message)

//     // Log failed delivery
//     await logMessageDelivery(userId, receiverId, prompt, "DM", false, axiosError.message)

//     throw error
//   }
// }

// // Calculate human-like typing delay
// function calculateTypingDelay(messageLength: number): number {
//   const baseDelay = 1000 + Math.random() * 1000
//   const typingDelay = (messageLength / 200) * 60 * 1000
//   const randomFactor = 0.5 + Math.random() * 0.5
//   return Math.min(Math.max(baseDelay + typingDelay * randomFactor, 1000), 8000)
// }

// // Enhanced private message sending
// export async function sendPrivateMessageWithTyping(
//   userId: string,
//   commentId: string,
//   prompt: string,
//   token: string,
//   quickReplies?: InstagramQuickReply[],
//   options?: {
//     simulateTyping?: boolean
//     typingDuration?: number
//     priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
//   },
// ): Promise<AxiosResponse> {
//   const { simulateTyping = true, typingDuration, priority = "MEDIUM" } = options || {}

//   try {
//     // For comment replies, we can't send typing indicators in the same way
//     // But we can still simulate the delay
//     if (simulateTyping) {
//       const delay = typingDuration || calculateTypingDelay(prompt.length)
//       await new Promise((resolve) => setTimeout(resolve, delay))
//     }

//     const messagePayload: Record<string, any> = {
//       recipient: { comment_id: commentId },
//       messaging_type: "RESPONSE",
//       message: { text: prompt },
//     }

//     if (quickReplies && quickReplies.length > 0) {
//       messagePayload.message.quick_replies = quickReplies
//     }

//     if (priority !== "MEDIUM") {
//       messagePayload.metadata = JSON.stringify({ priority })
//     }

//     console.log("Sending private message payload:", JSON.stringify(messagePayload, null, 2))

//     const response = await axios.post(`${process.env.INSTAGRAM_BASE_URL}/v22.0/${userId}/messages`, messagePayload, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     })

//     await logMessageDelivery(userId, commentId, prompt, "COMMENT", true)

//     console.log("Instagram private message API response status:", response.status)
//     return response
//   } catch (error) {
//     const axiosError = error as AxiosError
//     console.error("Error sending private message to Instagram:", axiosError.response?.data || axiosError.message)

//     await logMessageDelivery(userId, commentId, prompt, "COMMENT", false, axiosError.message)

//     throw error
//   }
// }

// // Message delivery logging
// async function logMessageDelivery(
//   pageId: string,
//   recipientId: string,
//   message: string,
//   type: "DM" | "COMMENT",
//   success: boolean,
//   error?: string,
// ): Promise<void> {
//   try {
//     await client.messageDeliveryLog.create({
//       data: {
//         pageId,
//         recipientId,
//         message: message.substring(0, 1000), // Truncate long messages
//         type,
//         success,
//         error: error?.substring(0, 500),
//         timestamp: new Date(),
//       },
//     })
//   } catch (logError) {
//     console.error("Error logging message delivery:", logError)
//   }
// }

// // Legacy functions for backward compatibility
// export const sendDM = sendDMWithTyping
// export const sendPrivateMessage = sendPrivateMessageWithTyping

// export const refreshToken = async (token: string) => {
//   try {
//     const response = await axios.get(
//       `${process.env.INSTAGRAM_BASE_URL}/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`,
//     )
//     return response.data
//   } catch (error) {
//     const axiosError = error as AxiosError
//     console.error("Error refreshing token:", axiosError.response?.data || axiosError.message)
//     throw error
//   }
// }

// export const generateTokens = async (code: string) => {
//   try {
//     const insta_form = new FormData()
//     insta_form.append("client_id", process.env.INSTAGRAM_CLIENT_ID as string)
//     insta_form.append("client_secret", process.env.INSTAGRAM_CLIENT_SECRET as string)
//     insta_form.append("grant_type", "authorization_code")
//     insta_form.append("redirect_uri", `${process.env.NEXT_PUBLIC_HOST_URL}/callback/instagram`)
//     insta_form.append("code", code)

//     const shortTokenRes = await fetch(process.env.INSTAGRAM_TOKEN_URL as string, {
//       method: "POST",
//       body: insta_form,
//     })

//     const token = await shortTokenRes.json()
//     if (token.permissions && token.permissions.length > 0) {
//       console.log("Got permissions:", token)

//       const longTokenResponse = await axios.get(
//         `${process.env.INSTAGRAM_BASE_URL}/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&access_token=${token.access_token}`,
//       )

//       return longTokenResponse.data
//     } else {
//       console.error("No permissions returned in token response:", token)
//       throw new Error("No permissions received from Instagram")
//     }
//   } catch (error) {
//     const axiosError = error as Error
//     console.error("Error generating tokens:", axiosError.message)
//     throw error
//   }
// }



// import axios, { type AxiosError, type AxiosResponse } from "axios"
// import { client } from "@/lib/prisma"

// type InstagramQuickReply = {
//   content_type: "text"
//   title: string
//   payload: string
// }

// interface TypingIndicatorOptions {
//   duration?: number
//   pageId: string
//   recipientId: string
//   token: string
// }



// export async function sendTypingIndicator(options: TypingIndicatorOptions): Promise<boolean> {
//   const { duration = 3000, pageId, recipientId, token } = options

//   // Validate required parameters
//   if (!pageId || !recipientId || !token) {
//     console.error("Missing required parameters for typing indicator")
//     return false
//   }

//   try {
//     // First, verify the conversation exists and is valid
//     const conversationCheck = await axios.get(
//       `${process.env.INSTAGRAM_BASE_URL}/v21.0/${pageId}/conversations`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         params: {
//           platform: "instagram",
//           user_id: recipientId
//         }
//       }
//     )

//     if (!conversationCheck.data?.data?.length) {
//       console.error("No active conversation found with recipient")
//       return false
//     }

//     // Send typing_on with additional validation
//     const typingOnPayload = {
//       recipient: { id: recipientId },
//       sender_action: "typing_on",
//     }

//     console.log("Sending typing_on with payload:", JSON.stringify(typingOnPayload, null, 2))

//     const typingOnResponse = await axios.post(
//       `${process.env.INSTAGRAM_BASE_URL}/v21.0/${pageId}/messages`,
//       typingOnPayload,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         timeout: 10000, // 10 second timeout
//       }
//     )

//     console.log("Typing on response:", typingOnResponse.data)

//     // Wait for the specified duration
//     await new Promise((resolve) => setTimeout(resolve, Math.min(duration, 20000))) // Max 20 seconds

//     // Send typing_off
//     const typingOffPayload = {
//       recipient: { id: recipientId },
//       sender_action: "typing_off",
//     }

//     await axios.post(
//       `${process.env.INSTAGRAM_BASE_URL}/v21.0/${pageId}/messages`,
//       typingOffPayload,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         timeout: 10000,
//       }
//     )

//     return true
//   } catch (error) {
//     const axiosError = error as AxiosError
    
//     // Enhanced error logging
//     console.error("Error sending typing indicator:", {
//       status: axiosError.response?.status,
//       statusText: axiosError.response?.statusText,
//       data: axiosError.response?.data,
//       config: {
//         url: axiosError.config?.url,
//         method: axiosError.config?.method,
//         headers: axiosError.config?.headers,
//       }
//     })
    
//     // Specific error handling
//     if (axiosError.response?.status === 400) {
//       const errorData = axiosError.response.data as any
//       if (errorData?.error?.code === 100 && errorData?.error?.error_subcode === 2534019) {
//         console.error("Invalid sender action - possible causes:")
//         console.error("1. Invalid recipient ID format")
//         console.error("2. No active conversation with recipient")
//         console.error("3. Missing messaging permissions")
//         console.error("4. Page access token issues")
//       }
//     }
    
//     return false
//   }
// }

// // Alternative: Simplified version that only sends typing_on
// export async function sendSimpleTypingIndicator(options: TypingIndicatorOptions): Promise<boolean> {
//   const { pageId, recipientId, token } = options

//   try {
//     await axios.post(
//       `${process.env.INSTAGRAM_BASE_URL}/v21.0/${pageId}/messages`,
//       {
//         recipient: { id: recipientId },
//         sender_action: "typing_on",
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     )

//     return true
//   } catch (error) {
//     console.error("Simple typing indicator failed:", error)
//     return false
//   }
// }

// // Utility function to validate recipient ID format
// export function validateInstagramRecipientId(recipientId: string): boolean {
//   // Instagram user IDs are typically numeric strings
//   return /^\d+$/.test(recipientId) && recipientId.length >= 10
// }

// // Enhanced function with better error handling and validation
// export async function sendTypingIndicatorWithValidation(options: TypingIndicatorOptions): Promise<{
//   success: boolean
//   error?: string
// }> {
//   const { duration = 3000, pageId, recipientId, token } = options

//   // Validate inputs
//   if (!validateInstagramRecipientId(recipientId)) {
//     return { success: false, error: "Invalid recipient ID format" }
//   }

//   try {
//     // Only send typing_on, let Instagram handle the timeout
//     await axios.post(
//       `${process.env.INSTAGRAM_BASE_URL}/v21.0/${pageId}/messages`,
//       {
//         recipient: { id: recipientId },
//         sender_action: "typing_on",
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     )

//     return { success: true }
//   } catch (error) {
//     const axiosError = error as AxiosError
//     const errorData = axiosError.response?.data as any
    
//     let errorMessage = "Unknown error"
    
//     if (errorData?.error?.code === 100) {
//       switch (errorData.error.error_subcode) {
//         case 2534019:
//           errorMessage = "Invalid sender action data - check recipient ID and permissions"
//           break
//         case 2534005:
//           errorMessage = "Message not sent - recipient may have blocked the page"
//           break
//         default:
//           errorMessage = `API Error: ${errorData.error.message}`
//       }
//     }
    
//     return { success: false, error: errorMessage }
//   }
// }





























// // Enhanced message sending with optional typing simulation
// export async function sendDMWithTyping(
//   userId: string,
//   receiverId: string,
//   prompt: string,
//   token: string,
//   quickReplies?: InstagramQuickReply[],
//   options?: {
//     simulateTyping?: boolean
//     typingDuration?: number
//     priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
//     fallbackToDelay?: boolean // New option to use delay if typing fails
//   },
// ): Promise<AxiosResponse> {
//   const { 
//     simulateTyping = true, 
//     typingDuration, 
//     priority = "MEDIUM",
//     fallbackToDelay = true 
//   } = options || {}

//   try {
//     // Calculate typing duration if not provided
//     const calculatedTypingDuration = typingDuration || calculateTypingDelay(prompt.length)

//     // Attempt to send typing indicator if enabled
//     if (simulateTyping) {
//       const typingSuccess = await sendTypingIndicator({
//         duration: calculatedTypingDuration,
//         pageId: userId,
//         recipientId: receiverId,
//         token,
//       })

//       // If typing indicator fails and fallback is enabled, use a simple delay
//       if (!typingSuccess && fallbackToDelay) {
//         console.log("Typing indicator failed, using fallback delay")
//         await new Promise((resolve) => setTimeout(resolve, calculatedTypingDuration))
//       }
//     }

//     // Prepare message payload
//     const messagePayload: Record<string, any> = {
//       recipient: { id: receiverId },
//       messaging_type: "RESPONSE",
//       message: { text: prompt },
//     }

//     if (quickReplies && quickReplies.length > 0) {
//       messagePayload.message.quick_replies = quickReplies
//     }

//     // Add priority metadata if needed
//     if (priority !== "MEDIUM") {
//       messagePayload.metadata = JSON.stringify({ priority })
//     }

//     console.log("Sending DM payload to Instagram:", JSON.stringify(messagePayload, null, 2))

//     const response = await axios.post(`${process.env.INSTAGRAM_BASE_URL}/v22.0/${userId}/messages`, messagePayload, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     })

//     // Log successful delivery
//     await logMessageDelivery(userId, receiverId, prompt, "DM", true)

//     console.log("Instagram DM API response status:", response.status)
//     return response
//   } catch (error) {
//     const axiosError = error as AxiosError
//     console.error("Error sending DM to Instagram:", axiosError.response?.data || axiosError.message)

//     // Log failed delivery
//     await logMessageDelivery(userId, receiverId, prompt, "DM", false, axiosError.message)

//     throw error
//   }
// }

// // Calculate human-like typing delay
// function calculateTypingDelay(messageLength: number): number {
//   const baseDelay = 1000 + Math.random() * 1000
//   const typingDelay = (messageLength / 200) * 60 * 1000
//   const randomFactor = 0.5 + Math.random() * 0.5
//   return Math.min(Math.max(baseDelay + typingDelay * randomFactor, 1000), 8000)
// }

// // Enhanced private message sending
// export async function sendPrivateMessageWithTyping(
//   userId: string,
//   commentId: string,
//   prompt: string,
//   token: string,
//   quickReplies?: InstagramQuickReply[],
//   options?: {
//     simulateTyping?: boolean
//     typingDuration?: number
//     priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
//   },
// ): Promise<AxiosResponse> {
//   const { simulateTyping = true, typingDuration, priority = "MEDIUM" } = options || {}

//   try {
//     // For comment replies, we can't send typing indicators in the same way
//     // But we can still simulate the delay
//     if (simulateTyping) {
//       const delay = typingDuration || calculateTypingDelay(prompt.length)
//       await new Promise((resolve) => setTimeout(resolve, delay))
//     }

//     const messagePayload: Record<string, any> = {
//       recipient: { comment_id: commentId },
//       messaging_type: "RESPONSE",
//       message: { text: prompt },
//     }

//     if (quickReplies && quickReplies.length > 0) {
//       messagePayload.message.quick_replies = quickReplies
//     }

//     if (priority !== "MEDIUM") {
//       messagePayload.metadata = JSON.stringify({ priority })
//     }

//     console.log("Sending private message payload:", JSON.stringify(messagePayload, null, 2))

//     const response = await axios.post(`${process.env.INSTAGRAM_BASE_URL}/v22.0/${userId}/messages`, messagePayload, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     })

//     await logMessageDelivery(userId, commentId, prompt, "COMMENT", true)

//     console.log("Instagram private message API response status:", response.status)
//     return response
//   } catch (error) {
//     const axiosError = error as AxiosError
//     console.error("Error sending private message to Instagram:", axiosError.response?.data || axiosError.message)

//     await logMessageDelivery(userId, commentId, prompt, "COMMENT", false, axiosError.message)

//     throw error
//   }
// }

// // Simplified versions without typing indicators for reliability
// export async function sendDMSimple(
//   userId: string,
//   receiverId: string,
//   prompt: string,
//   token: string,
//   quickReplies?: InstagramQuickReply[],
// ): Promise<AxiosResponse> {
//   return sendDMWithTyping(userId, receiverId, prompt, token, quickReplies, {
//     simulateTyping: false
//   })
// }

// export async function sendPrivateMessageSimple(
//   userId: string,
//   commentId: string,
//   prompt: string,
//   token: string,
//   quickReplies?: InstagramQuickReply[],
// ): Promise<AxiosResponse> {
//   return sendPrivateMessageWithTyping(userId, commentId, prompt, token, quickReplies, {
//     simulateTyping: false
//   })
// }

// // Message delivery logging
// async function logMessageDelivery(
//   pageId: string,
//   recipientId: string,
//   message: string,
//   type: "DM" | "COMMENT",
//   success: boolean,
//   error?: string,
// ): Promise<void> {
//   try {
//     await client.messageDeliveryLog.create({
//       data: {
//         pageId,
//         recipientId,
//         message: message.substring(0, 1000), // Truncate long messages
//         type,
//         success,
//         error: error?.substring(0, 500),
//         timestamp: new Date(),
//       },
//     })
//   } catch (logError) {
//     console.error("Error logging message delivery:", logError)
//   }
// }

// // Legacy functions for backward compatibility
// export const sendDM = sendDMWithTyping
// export const sendPrivateMessage = sendPrivateMessageWithTyping

// export const refreshToken = async (token: string) => {
//   try {
//     const response = await axios.get(
//       `${process.env.INSTAGRAM_BASE_URL}/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`,
//     )
//     return response.data
//   } catch (error) {
//     const axiosError = error as AxiosError
//     console.error("Error refreshing token:", axiosError.response?.data || axiosError.message)
//     throw error
//   }
// }

// export const generateTokens = async (code: string) => {
//   try {
//     const insta_form = new FormData()
//     insta_form.append("client_id", process.env.INSTAGRAM_CLIENT_ID as string)
//     insta_form.append("client_secret", process.env.INSTAGRAM_CLIENT_SECRET as string)
//     insta_form.append("grant_type", "authorization_code")
//     insta_form.append("redirect_uri", `${process.env.NEXT_PUBLIC_HOST_URL}/callback/instagram`)
//     insta_form.append("code", code)

//     const shortTokenRes = await fetch(process.env.INSTAGRAM_TOKEN_URL as string, {
//       method: "POST",
//       body: insta_form,
//     })

//     const token = await shortTokenRes.json()
//     if (token.permissions && token.permissions.length > 0) {
//       console.log("Got permissions:", token)

//       const longTokenResponse = await axios.get(
//         `${process.env.INSTAGRAM_BASE_URL}/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&access_token=${token.access_token}`,
//       )

//       return longTokenResponse.data
//     } else {
//       console.error("No permissions returned in token response:", token)
//       throw new Error("No permissions received from Instagram")
//     }
//   } catch (error) {
//     const axiosError = error as Error
//     console.error("Error generating tokens:", axiosError.message)
//     throw error
//   }
// }

import axios, { type AxiosError, type AxiosResponse } from "axios"
import { client } from "@/lib/prisma"

type InstagramQuickReply = {
  content_type: "text"
  title: string
  payload: string
}














export const sendDM = async (
  userId: string,
  recieverId: string,
  prompt: string,
  token: string,
  buttons?: { name: string; payload: string }[]
) => {
  const messagePayload: any = {
    recipient: {
      id: recieverId,
    },
    message: {
      text: prompt,
    },
  };

  if (buttons && buttons.length > 0) {
    messagePayload.message.quick_replies = buttons.map((button) => ({
      content_type: "text",
      title: button.name,
      payload: button.payload,
    }));
  }

  console.log("Sending payload to Instagram:", JSON.stringify(messagePayload, null, 2)); // Log payload

  return await axios.post(
    `${process.env.INSTAGRAM_BASE_URL}/v21.0/${userId}/messages`,
    messagePayload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};



export const sendPrivateMessage = async (
  userId: string,
  recieverId: string,
  prompt: string,
  token: string,
  buttons?: { name: string; payload: string }[] // Add buttons as an optional parameter
) => {
  console.log('sending message')

  // Construct the message payload
  const messagePayload: any = {
    recipient: {
      comment_id: recieverId,
    },
    message: {
      text: prompt,
    },
  }

  // Add quick replies if buttons are provided
  if (buttons && buttons.length > 0) {
    messagePayload.message.quick_replies = buttons.map((button) => ({
      content_type: 'text',
      title: button.name,
      payload: button.payload,
    }))
  }

  // Send the request to Instagram's API
  return await axios.post(
    `${process.env.INSTAGRAM_BASE_URL}/${userId}/messages`,
    messagePayload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
}


export const generateTokenss = async (code: string) => {
  const insta_form = new FormData()
  insta_form.append('client_id', process.env.INSTAGRAM_CLIENT_ID as string)

  insta_form.append(
    'client_secret',
    process.env.INSTAGRAM_CLIENT_SECRET as string
  )
  insta_form.append('grant_type', 'authorization_code')
  insta_form.append(
    'redirect_uri',
    `${process.env.NEXT_PUBLIC_HOST_URL}/callback/instagram`
  )
  insta_form.append('code', code)

  const shortTokenRes = await fetch(process.env.INSTAGRAM_TOKEN_URL as string, {
    method: 'POST',
    body: insta_form,
  })

  const token = await shortTokenRes.json()
  if (token.permissions.length > 0) {
    console.log(token, 'got permissions')
    const long_token = await axios.get(
      `${process.env.INSTAGRAM_BASE_URL}/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&access_token=${token.access_token}`
    )

    return long_token.data

  }
}













// Simple DM sending without typing indicators
export async function sendDMs(
  userId: string,
  receiverId: string,
  prompt: string,
  token: string,
  quickReplies?: InstagramQuickReply[],
): Promise<AxiosResponse> {
  try {
    const messagePayload: Record<string, any> = {
      recipient: { id: receiverId },
      messaging_type: "RESPONSE",
      message: { text: prompt },
    }

    if (quickReplies && quickReplies.length > 0) {
      messagePayload.message.quick_replies = quickReplies
    }

    console.log("Sending DM payload to Instagram:", JSON.stringify(messagePayload, null, 2))

    const response = await axios.post(`${process.env.INSTAGRAM_BASE_URL}/v21.0/${userId}/messages`, messagePayload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: 15000, // 15 second timeout
    })

    // Log successful delivery
    await logMessageDelivery(userId, receiverId, prompt, "DM", true)
    console.log("Instagram DM API response status:", response.status)
    return response
  } catch (error) {
    const axiosError = error as AxiosError
    console.error("Error sending DM to Instagram:", axiosError.response?.data || axiosError.message)

    // Log failed delivery
    await logMessageDelivery(userId, receiverId, prompt, "DM", false, axiosError.message)
    throw error
  }
}

// Simple private message sending without typing indicators
export async function sendPrivateMessages(
  userId: string,
  commentId: string,
  prompt: string,
  token: string,
  quickReplies?: InstagramQuickReply[],
): Promise<AxiosResponse> {
  try {
    const messagePayload: Record<string, any> = {
      recipient: { comment_id: commentId },
      messaging_type: "RESPONSE",
      message: { text: prompt },
    }

    if (quickReplies && quickReplies.length > 0) {
      messagePayload.message.quick_replies = quickReplies
    }

    console.log("Sending private message payload:", JSON.stringify(messagePayload, null, 2))

    const response = await axios.post(`${process.env.INSTAGRAM_BASE_URL}/v21.0/${userId}/messages`, messagePayload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: 15000, // 15 second timeout
    })

    await logMessageDelivery(userId, commentId, prompt, "COMMENT", true)
    console.log("Instagram private message API response status:", response.status)
    return response
  } catch (error) {
    const axiosError = error as AxiosError
    console.error("Error sending private message to Instagram:", axiosError.response?.data || axiosError.message)

    await logMessageDelivery(userId, commentId, prompt, "COMMENT", false, axiosError.message)
    throw error
  }
}

// Message delivery logging
async function logMessageDelivery(
  pageId: string,
  recipientId: string,
  message: string,
  type: "DM" | "COMMENT",
  success: boolean,
  error?: string,
): Promise<void> {
  try {
    await client.messageDeliveryLog.create({
      data: {
        pageId,
        recipientId,
        message: message.substring(0, 1000), // Truncate long messages
        type,
        success,
        error: error?.substring(0, 500),
        timestamp: new Date(),
      },
    })
  } catch (logError) {
    console.error("Error logging message delivery:", logError)
  }
}

// Token management functions
export const refreshToken = async (token: string) => {
  try {
    const response = await axios.get(
      `${process.env.INSTAGRAM_BASE_URL}/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`,
    )
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError
    console.error("Error refreshing token:", axiosError.response?.data || axiosError.message)
    throw error
  }
}

export const generateTokens = async (code: string) => {
  try {
    const insta_form = new FormData()
    insta_form.append("client_id", process.env.INSTAGRAM_CLIENT_ID as string)
    insta_form.append("client_secret", process.env.INSTAGRAM_CLIENT_SECRET as string)
    insta_form.append("grant_type", "authorization_code")
    insta_form.append("redirect_uri", `${process.env.NEXT_PUBLIC_HOST_URL}/callback/instagram`)
    insta_form.append("code", code)

    const shortTokenRes = await fetch(process.env.INSTAGRAM_TOKEN_URL as string, {
      method: "POST",
      body: insta_form,
    })

    const token = await shortTokenRes.json()

    if (token.permissions && token.permissions.length > 0) {
      console.log("Got permissions:", token)
      const longTokenResponse = await axios.get(
        `${process.env.INSTAGRAM_BASE_URL}/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&access_token=${token.access_token}`,
      )
      return longTokenResponse.data
    } else {
      console.error("No permissions returned in token response:", token)
      throw new Error("No permissions received from Instagram")
    }
  } catch (error) {
    const axiosError = error as Error
    console.error("Error generating tokens:", axiosError.message)
    throw error
  }
}




// export const sendDM = async (
//   userId: string,
//   recieverId: string,
//   prompt: string,
//   token: string
// ) => {
//   console.log('sending message....')
//   return await axios.post(
//     `${process.env.INSTAGRAM_BASE_URL}/v21.0/${userId}/messages`,
//     {
//       recipient: {
//         id: recieverId,
//       },
//       message: {
//         text: prompt,
//       },
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     }
//   )
// }

// export const sendDM = async (
//   userId: string,
//   recieverId: string,
//   prompt: string,
//   token: string,
//   buttons?: { name: string; payload: string }[] // Add buttons as an optional parameter
// ) => {
//   console.log('sending message....')

//   // Construct the message payload
//   const messagePayload: any = {
//     recipient: {
//       id: recieverId,
//     },
//     message: {
//       text: prompt,
//     },
//   }

//   // Add quick replies if buttons are provided
//   if (buttons && buttons.length > 0) {
//     messagePayload.message.quick_replies = buttons.map((button) => ({
//       content_type: 'text',
//       title: button.name,
//       payload: button.payload,
//     }))
//   }

//   // Send the request to Instagram's API
//   return await axios.post(
//     `${process.env.INSTAGRAM_BASE_URL}/v21.0/${userId}/messages`,
//     messagePayload,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     }
//   )
// }



// export const sendPrivateMessage = async (
//   userId: string,
//   recieverId: string,
//   prompt: string,
//   token: string
// ) => {
//   console.log('sending message')
//   return await axios.post(
//     `${process.env.INSTAGRAM_BASE_URL}/${userId}/messages`,
//     {
//       recipient: {
//         comment_id: recieverId,
//       },
//       message: {
//         text: prompt,
//       },
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     }
//   )
// }



// import axios from 'axios'

// export const refreshToken = async (token: string) => {
//   const refresh_token = await axios.get(
//     `${process.env.INSTAGRAM_BASE_URL}/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`
//   )

//   return refresh_token.data
// }

// export const sendDM = async (
//   userId: string,
//   recieverId: string,
//   prompt: string,
//   token: string
// ) => {
//   console.log('sending message....')
//   return await axios.post(
//     `${process.env.INSTAGRAM_BASE_URL}/v21.0/${userId}/messages`,
//     {
//       recipient: {
//         id: recieverId,
//       },
//       message: {
//         text: prompt,
//       },
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     }
//   )
// }

// export const sendPrivateMessage = async (
//   userId: string,
//   recieverId: string,
//   prompt: string,
//   token: string
// ) => {
//   console.log('sending message')
//   return await axios.post(
//     `${process.env.INSTAGRAM_BASE_URL}/${userId}/messages`,
//     {
//       recipient: {
//         comment_id: recieverId,
//       },
//       message: {
//         text: prompt,
//       },
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     }
//   )
// }

// // New function for WhatsApp messages
// export const sendWhatsAppMessage = async (
//   phoneNumberId: string,
//   recipientNumber: string,
//   prompt: string,
//   token: string
// ) => {
//   console.log('sending WhatsApp message....')
//   return await axios.post(
//     `${process.env.WHATSAPP_BASE_URL || 'https://graph.facebook.com/v17.0'}/${phoneNumberId}/messages`,
//     {
//       messaging_product: "whatsapp",
//       recipient_type: "individual",
//       to: recipientNumber,
//       type: "text",
//       text: {
//         preview_url: false,
//         body: prompt,
//       },
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     }
//   )
// }

// // New function for Facebook Messenger messages
// export const sendFacebookMessage = async (
//   pageId: string,
//   recipientId: string,
//   prompt: string,
//   token: string
// ) => {
//   console.log('sending Facebook message....')
//   return await axios.post(
//     `${process.env.FACEBOOK_BASE_URL || 'https://graph.facebook.com/v17.0'}/${pageId}/messages`,
//     {
//       recipient: {
//         id: recipientId,
//       },
//       message: {
//         text: prompt,
//       },
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     }
//   )
// }

// // New function for Facebook comments
// export const sendFacebookComment = async (
//   postId: string,
//   commentId: string,
//   prompt: string,
//   token: string
// ) => {
//   console.log('sending Facebook comment....')
//   // For replying to a comment
//   const endpoint = commentId 
//     ? `${process.env.FACEBOOK_BASE_URL || 'https://graph.facebook.com/v17.0'}/${commentId}/comments` 
//     : `${process.env.FACEBOOK_BASE_URL || 'https://graph.facebook.com/v17.0'}/${postId}/comments`;
  
//   return await axios.post(
//     endpoint,
//     {
//       message: prompt,
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     }
//   )
// }

// export const generateTokens = async (code: string) => {
//   const insta_form = new FormData()
//   insta_form.append('client_id', process.env.INSTAGRAM_CLIENT_ID as string)

//   insta_form.append(
//     'client_secret',
//     process.env.INSTAGRAM_CLIENT_SECRET as string
//   )
//   insta_form.append('grant_type', 'authorization_code')
//   insta_form.append(
//     'redirect_uri',
//     `${process.env.NEXT_PUBLIC_HOST_URL}/callback/instagram`
//   )
//   insta_form.append('code', code)

//   const shortTokenRes = await fetch(process.env.INSTAGRAM_TOKEN_URL as string, {
//     method: 'POST',
//     body: insta_form,
//   })

//   const token = await shortTokenRes.json()
//   if (token.permissions.length > 0) {
//     console.log(token, 'got permissions')
//     const long_token = await axios.get(
//       `${process.env.INSTAGRAM_BASE_URL}/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&access_token=${token.access_token}`
//     )

//     return long_token.data
//   }
// }

// // New function for generating WhatsApp tokens
// export const generateWhatsAppTokens = async (code: string) => {
//   const whatsapp_form = new FormData()
//   whatsapp_form.append('client_id', process.env.WHATSAPP_CLIENT_ID as string)
//   whatsapp_form.append(
//     'client_secret',
//     process.env.WHATSAPP_CLIENT_SECRET as string
//   )
//   whatsapp_form.append('grant_type', 'authorization_code')
//   whatsapp_form.append(
//     'redirect_uri',
//     `${process.env.NEXT_PUBLIC_HOST_URL}/callback/whatsapp`
//   )
//   whatsapp_form.append('code', code)

//   const tokenRes = await fetch(process.env.WHATSAPP_TOKEN_URL || process.env.FACEBOOK_TOKEN_URL as string, {
//     method: 'POST',
//     body: whatsapp_form,
//   })

//   return await tokenRes.json()
// }

// // New function for generating Facebook tokens
// export const generateFacebookTokens = async (code: string) => {
//   const facebook_form = new FormData()
//   facebook_form.append('client_id', process.env.FACEBOOK_CLIENT_ID as string)
//   facebook_form.append(
//     'client_secret',
//     process.env.FACEBOOK_CLIENT_SECRET as string
//   )
//   facebook_form.append('grant_type', 'authorization_code')
//   facebook_form.append(
//     'redirect_uri',
//     `${process.env.NEXT_PUBLIC_HOST_URL}/callback/facebook`
//   )
//   facebook_form.append('code', code)

//   const tokenRes = await fetch(process.env.FACEBOOK_TOKEN_URL as string, {
//     method: 'POST',
//     body: facebook_form,
//   })

//   return await tokenRes.json()
// }