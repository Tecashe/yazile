import axios, { type AxiosError, type AxiosResponse } from "axios"
import { client } from "@/lib/prisma"


///for testing


// Enhanced types for Instagram messaging
interface InstagramQuickReply {
  content_type: "text"
  title: string
  payload: string
}

interface InstagramButton {
  type: "web_url" | "postback"
  title: string
  url?: string
  payload?: string
}

interface InstagramGenericElement {
  title: string
  subtitle?: string
  image_url?: string
  buttons?: InstagramButton[]
}

interface InstagramAttachment {
  type: "template"
  payload: {
    template_type: "generic" | "button"
    elements?: InstagramGenericElement[]
    text?: string
    buttons?: InstagramButton[]
  }
}

interface VoiceflowResponse {
  text?: string
  quickReplies?: Array<{ name: string; payload: string }>
  buttons?: Array<{ name: string; payload: string }>
  carousel?: Array<{
    title: string
    subtitle?: string
    imageUrl?: string
    buttons?: Array<{ name: string; payload: string; url?: string }>
  }>
  attachment?: any
}

///for testing


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



type InstagramQuickReplyE = {
  content_type: "text"
  title: string
  payload: string
}


export const sendDME = async (
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



export const sendPrivateMessageE = async (
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
export async function sendDMsE(
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
export async function sendPrivateMessagesE(
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

//////////// FOR TESTING



// Enhanced DM sending function with support for all message types
export async function sendDMsEE(
  userId: string,
  receiverId: string,
  prompt: string,
  token: string,
  quickReplies?: InstagramQuickReply[],
  buttons?: InstagramButton[],
  carousel?: InstagramGenericElement[],
  attachment?: InstagramAttachment,
): Promise<AxiosResponse> {
  try {
    const messagePayload: Record<string, any> = {
      recipient: { id: receiverId },
      messaging_type: "RESPONSE",
    }

    // Handle different message types
    if (attachment) {
      // Template messages (carousels, button templates)
      messagePayload.message = {
        attachment: attachment
      }
    } else if (carousel && carousel.length > 0) {
      // Carousel template
      messagePayload.message = {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: carousel.slice(0, 10) // Instagram supports max 10 elements
          }
        }
      }
    } else if (buttons && buttons.length > 0) {
      // Button template
      messagePayload.message = {
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text: prompt,
            buttons: buttons.slice(0, 3) // Instagram supports max 3 buttons in button template
          }
        }
      }
    } else {
      // Regular text message
      messagePayload.message = { text: prompt }
      
      // Add quick replies if provided
      if (quickReplies && quickReplies.length > 0) {
        messagePayload.message.quick_replies = quickReplies.slice(0, 13) // Max 13 quick replies
      }
    }

    console.log("Sending enhanced DM payload to Instagram:", JSON.stringify(messagePayload, null, 2))

    const response = await axios.post(`${process.env.INSTAGRAM_BASE_URL}/v21.0/${userId}/messages`, messagePayload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: 15000,
    })

    await logMessageDelivery(userId, receiverId, prompt, "DM", true)
    console.log("Instagram DM API response status:", response.status)
    return response
  } catch (error) {
    const axiosError = error as AxiosError
    console.error("Error sending enhanced DM to Instagram:", axiosError.response?.data || axiosError.message)
    await logMessageDelivery(userId, receiverId, prompt, "DM", false, axiosError.message)
    throw error
  }
}

// Enhanced private message sending function
export async function sendPrivateMessages(
  userId: string,
  commentId: string,
  prompt: string,
  token: string,
  quickReplies?: InstagramQuickReply[],
  buttons?: InstagramButton[],
  carousel?: InstagramGenericElement[],
  attachment?: InstagramAttachment,
): Promise<AxiosResponse> {
  try {
    const messagePayload: Record<string, any> = {
      recipient: { comment_id: commentId },
      messaging_type: "RESPONSE",
    }

    // Handle different message types (same logic as DM)
    if (attachment) {
      messagePayload.message = {
        attachment: attachment
      }
    } else if (carousel && carousel.length > 0) {
      messagePayload.message = {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: carousel.slice(0, 10)
          }
        }
      }
    } else if (buttons && buttons.length > 0) {
      messagePayload.message = {
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text: prompt,
            buttons: buttons.slice(0, 3)
          }
        }
      }
    } else {
      messagePayload.message = { text: prompt }
      
      if (quickReplies && quickReplies.length > 0) {
        messagePayload.message.quick_replies = quickReplies.slice(0, 13)
      }
    }

    console.log("Sending enhanced private message payload:", JSON.stringify(messagePayload, null, 2))

    const response = await axios.post(`${process.env.INSTAGRAM_BASE_URL}/v21.0/${userId}/messages`, messagePayload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: 15000,
    })

    await logMessageDelivery(userId, commentId, prompt, "COMMENT", true)
    console.log("Instagram private message API response status:", response.status)
    return response
  } catch (error) {
    const axiosError = error as AxiosError
    console.error("Error sending enhanced private message to Instagram:", axiosError.response?.data || axiosError.message)
    await logMessageDelivery(userId, commentId, prompt, "COMMENT", false, axiosError.message)
    throw error
  }
}

// Enhanced function to transform Voiceflow responses to Instagram format
export function transformVoiceflowToInstagram(voiceflowResponse: VoiceflowResponse): {
  text: string
  quickReplies?: InstagramQuickReply[]
  buttons?: InstagramButton[]
  carousel?: InstagramGenericElement[]
  attachment?: InstagramAttachment
} {
  const result: any = {
    text: voiceflowResponse.text || ""
  }

  // Transform quick replies
  if (voiceflowResponse.quickReplies && voiceflowResponse.quickReplies.length > 0) {
    result.quickReplies = voiceflowResponse.quickReplies.slice(0, 13).map((reply) => ({
      content_type: "text" as const,
      title: String(reply.name || "").substring(0, 20) || "Option",
      payload: String(reply.payload || reply.name || "").substring(0, 1000)
    }))
  }

  // Transform buttons for button template
  if (voiceflowResponse.buttons && voiceflowResponse.buttons.length > 0) {
    result.buttons = voiceflowResponse.buttons.slice(0, 3).map((button) => ({
      type: "postback" as const,
      title: String(button.name || "").substring(0, 20) || "Button",
      payload: String(button.payload || button.name || "").substring(0, 1000)
    }))
  }

  // Transform carousel
  if (voiceflowResponse.carousel && voiceflowResponse.carousel.length > 0) {
    result.carousel = voiceflowResponse.carousel.slice(0, 10).map((card) => {
      const element: InstagramGenericElement = {
        title: String(card.title || "").substring(0, 80) || "Card",
        subtitle: card.subtitle ? String(card.subtitle).substring(0, 80) : undefined,
        image_url: card.imageUrl || undefined
      }

      if (card.buttons && card.buttons.length > 0) {
        element.buttons = card.buttons.slice(0, 3).map((button) => ({
          type: button.url ? "web_url" as const : "postback" as const,
          title: String(button.name || "").substring(0, 20) || "Button",
          url: button.url,
          payload: button.url ? undefined : String(button.payload || button.name || "").substring(0, 1000)
        }))
      }

      return element
    })
  }

  return result
}

// Updated generic send function that handles all types
export async function sendInstagramMessage(
  messageType: "DM" | "COMMENT",
  userId: string,
  targetId: string, // receiverId for DM, commentId for COMMENT
  voiceflowResponse: VoiceflowResponse,
  token: string,
): Promise<AxiosResponse> {
  const transformed = transformVoiceflowToInstagram(voiceflowResponse)
  
  if (messageType === "DM") {
    return sendDMs(
      userId,
      targetId,
      transformed.text,
      token,
      transformed.quickReplies,
      transformed.buttons,
      transformed.carousel,
      transformed.attachment
    )
  } else {
    return sendPrivateMessages(
      userId,
      targetId,
      transformed.text,
      token,
      transformed.quickReplies,
      transformed.buttons,
      transformed.carousel,
      transformed.attachment
    )
  }
}


///////////////

export async function sendDMs(
  userId: string,
  receiverId: string,
  prompt: string,
  token: string,
  quickReplies?: InstagramQuickReply[],
  buttons?: InstagramButton[],
  carousel?: InstagramGenericElement[],
  attachment?: InstagramAttachment,
): Promise<AxiosResponse> {
  try {
    const messagePayload: Record<string, any> = {
      recipient: { id: receiverId },
      messaging_type: "RESPONSE",
    }

    // Handle different message types with improved structure
    if (attachment) {
      messagePayload.message = {
        attachment: attachment
      }
    } else if (carousel && carousel.length > 0) {
      // Carousel template
      messagePayload.message = {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: carousel.slice(0, 10).map(card => ({
              title: card.title.substring(0, 80),
              subtitle: card.subtitle?.substring(0, 80),
              image_url: card.image_url,
              buttons: card.buttons?.slice(0, 3).map(btn => ({
                type: btn.url ? "web_url" : "postback",
                title: btn.title.substring(0, 20),
                url: btn.url,
                payload: btn.url ? undefined : btn.payload?.substring(0, 1000)
              }))
            }))
          }
        }
      }
    } else if (buttons && buttons.length > 0) {
      // Button template with proper structure
      messagePayload.message = {
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text: prompt.substring(0, 640), // Instagram limit for button template text
            buttons: buttons.slice(0, 3).map(btn => ({
              type: "postback",
              title: btn.title.substring(0, 20),
              payload: btn.payload?.substring(0, 1000)
            }))
          }
        }
      }
    } else {
      // Regular text message
      messagePayload.message = { text: prompt }
      
      // Add quick replies if provided
      if (quickReplies && quickReplies.length > 0) {
        messagePayload.message.quick_replies = quickReplies.slice(0, 13).map(qr => ({
          content_type: "text",
          title: qr.title.substring(0, 20),
          payload: qr.payload.substring(0, 1000)
        }))
      }
    }

    console.log("Sending enhanced DM payload to Instagram:", JSON.stringify(messagePayload, null, 2))

    const response = await axios.post(`${process.env.INSTAGRAM_BASE_URL}/v21.0/${userId}/messages`, messagePayload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: 15000,
    })

    await logMessageDelivery(userId, receiverId, prompt, "DM", true)
    console.log("Instagram DM API response status:", response.status)
    return response
  } catch (error) {
    const axiosError = error as AxiosError
    console.error("Error sending enhanced DM to Instagram:", axiosError.response?.data || axiosError.message)
    await logMessageDelivery(userId, receiverId, prompt, "DM", false, axiosError.message)
    throw error
  }
}