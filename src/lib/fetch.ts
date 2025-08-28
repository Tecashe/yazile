import axios, { type AxiosError, type AxiosResponse } from "axios"
import { client } from "@/lib/prisma"


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



type InstagramQuickReply = {
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



// Corrected sendDM function
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
    messaging_type: "RESPONSE", // REQUIRED: Instagram needs this
  };

  if (buttons && buttons.length > 0) {
    // Instagram limits: max 13 quick replies, 20 chars per title
    messagePayload.message.quick_replies = buttons.slice(0, 13).map((button) => ({
      content_type: "text",
      title: button.name.substring(0, 20), // FIXED: Enforce 20 char limit
      payload: button.payload.substring(0, 1000), // FIXED: Enforce 1000 char limit
    }));
  }

  console.log("Sending payload to Instagram:", JSON.stringify(messagePayload, null, 2));

  try {
    // FIXED: Use correct API version (v18.0 or v19.0, not v21.0)
    const response = await axios.post(
      `${process.env.INSTAGRAM_BASE_URL}/v18.0/${userId}/messages`,
      messagePayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Instagram DM sent successfully:", response.data);
    return response;
  } catch (error) {
    console.error("Instagram DM send failed:",);
    throw error;
  }
};

// Corrected sendPrivateMessage function
export const sendPrivateMessage = async (
  userId: string,
  commentId: string, // This should be the comment ID, not receiver ID
  prompt: string,
  token: string,
  buttons?: { name: string; payload: string }[]
) => {
  console.log('Sending private message to comment:', commentId);

  // FIXED: Correct payload structure for private replies
  const messagePayload: any = {
    message: prompt, // FIXED: Direct message property, no recipient needed
  };

  // Add quick replies if buttons are provided
  if (buttons && buttons.length > 0) {
    messagePayload.quick_replies = buttons.slice(0, 13).map((button) => ({
      content_type: 'text',
      title: button.name.substring(0, 20), // FIXED: Enforce 20 char limit
      payload: button.payload.substring(0, 1000), // FIXED: Enforce 1000 char limit
    }));
  }

  console.log("Sending private reply payload:", JSON.stringify(messagePayload, null, 2));

  try {
    // FIXED: Use correct private reply endpoint
    const response = await axios.post(
      `${process.env.INSTAGRAM_BASE_URL}/v18.0/${commentId}/private_replies`,
      messagePayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("Instagram private reply sent successfully:", response.data);
    return response;
  } catch (error) {
    console.error("Instagram private reply failed:",);
    throw error;
  }
};

// BONUS: Add function to handle Voiceflow button format
export const formatVoiceflowButtonsForInstagram = (
  voiceflowButtons?: any[]
): { name: string; payload: string }[] | undefined => {
  if (!voiceflowButtons || voiceflowButtons.length === 0) return undefined;

  return voiceflowButtons.slice(0, 13).map((button, index) => {
    // Handle different Voiceflow button formats
    let name: string;
    let payload: string;

    if (typeof button === 'string') {
      name = button.substring(0, 20);
      payload = button;
    } else if (button.name || button.title || button.text) {
      name = (button.name || button.title || button.text).substring(0, 20);
      payload = button.payload || button.value || button.name || button.title || button.text;
    } else {
      name = `Option ${index + 1}`;
      payload = JSON.stringify(button).substring(0, 1000);
    }

    return {
      name: name || `Option ${index + 1}`,
      payload: String(payload).substring(0, 1000),
    };
  });
};

// Updated function calls in your webhook (replace in ResponseSender)
export const sendInstagramResponse = async (
  context: any,
  text: string,
  voiceflowButtons?: any[]
) => {
  const formattedButtons = formatVoiceflowButtonsForInstagram(voiceflowButtons);
  const token = context.automation?.User?.integrations?.[0]?.token || process.env.DEFAULT_PAGE_TOKEN!;

  let result;

  if (context.data.messageType === "DM") {
    result = await sendDM(
      context.data.pageId,
      context.data.senderId,
      text,
      token,
      formattedButtons
    );
  } else if (context.data.messageType === "COMMENT" && context.data.commentId) {
    result = await sendPrivateMessage(
      context.data.pageId,
      context.data.commentId,
      text,
      token,
      formattedButtons
    );
  }

  return result;
};