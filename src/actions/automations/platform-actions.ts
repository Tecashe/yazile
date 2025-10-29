"use server"

import { onCurrentUser } from "@/actions/user"
import { client } from "@/lib/prisma"
import type { Platform } from "@/lib/constants/platform"
import {
  getAutomationsByPlatform,
  createPlatformAutomation,
  getPlatformIntegration,
  getAllPlatformIntegrations,
} from "./platform-queries"

export const getAllAutomationsByPlatform = async (platform: Platform) => {
  const user = await onCurrentUser()
  try {
    const automations = await getAutomationsByPlatform(user.id, platform)
    if (automations) {
      return { status: 200, data: automations }
    }
    return { status: 404, data: [] }
  } catch (error) {
    console.error("Error fetching automations by platform:", error)
    return { status: 500, data: [] }
  }
}

export const createNewPlatformAutomation = async (platform: Platform, name?: string) => {
  const user = await onCurrentUser()
  try {
    const automation = await createPlatformAutomation(user.id, platform, name)
    if (automation) {
      return { status: 200, data: "Automation created", res: automation }
    }
    return { status: 404, data: "Failed to create automation" }
  } catch (error) {
    console.error("Error creating platform automation:", error)
    return { status: 500, data: "Try refreshing the page first" }
  }
}

export const getPlatformIntegrationStatus = async (platform: Platform) => {
  const user = await onCurrentUser()
  try {
    const integration = await getPlatformIntegration(user.id, platform)
    if (integration) {
      return {
        status: 200,
        data: {
          connected: true,
          platform,
          expiresAt: integration.expiresAt,
          metadata: {
            username: integration.username,
            pageId: integration.pageId,
            phoneNumber: integration.phoneNumber,
          },
        },
      }
    }
    return {
      status: 200,
      data: {
        connected: false,
        platform,
      },
    }
  } catch (error) {
    console.error("Error checking platform integration:", error)
    return { status: 500, data: null }
  }
}

export const getAllPlatformIntegrationStatuses = async () => {
  const user = await onCurrentUser()
  try {
    const integrations = await getAllPlatformIntegrations(user.id)
    const statuses = integrations.map((integration) => ({
      platform: integration.name,
      connected: true,
      expiresAt: integration.expiresAt,
      metadata: {
        username: integration.username,
        pageId: integration.pageId,
        phoneNumber: integration.phoneNumber,
        linkedinId: integration.linkedinId,
      },
    }))
    return { status: 200, data: statuses }
  } catch (error) {
    console.error("Error fetching platform integrations:", error)
    return { status: 500, data: [] }
  }
}

export const savePlatformTrigger = async (
  automationId: string,
  platform: Platform,
  triggerType: string,
  configuration?: Record<string, any>,
) => {
  await onCurrentUser()
  try {
    const trigger = await client.trigger.create({
      data: {
        automationId,
        type: triggerType,
        configuration: configuration || {},
      },
    })

    if (trigger) {
      return { status: 200, data: "Trigger saved successfully" }
    }
    return { status: 404, data: "Failed to save trigger" }
  } catch (error) {
    console.error("Error saving platform trigger:", error)
    return { status: 500, data: "Failed to save trigger" }
  }
}

export const savePlatformResponse = async (
  automationId: string,
  platform: Platform,
  responseType: "SMARTAI" | "MESSAGE",
  responseContent: string,
) => {
  await onCurrentUser()
  try {
    const listener = await client.listener.upsert({
      where: { automationId },
      update: {
        listener: responseType as any,
        prompt: responseContent,
      },
      create: {
        automationId,
        listener: responseType as any,
        prompt: responseContent,
      },
    })

    if (listener) {
      return { status: 200, data: "Response saved successfully" }
    }
    return { status: 404, data: "Failed to save response" }
  } catch (error) {
    console.error("Error saving platform response:", error)
    return { status: 500, data: "Failed to save response" }
  }
}

export const getPlatformPosts = async (platform: Platform) => {
  const user = await onCurrentUser()
  try {
    const integration = await getPlatformIntegration(user.id, platform)

    if (!integration) {
      return { status: 401, data: "Platform not connected" }
    }

    // Platform-specific API calls
    let posts: any[] = []

    switch (platform) {
      case "INSTAGRAM":
        posts = await fetchInstagramPosts(integration.token)
        break
      case "FACEBOOK":
        posts = await fetchFacebookPosts(integration.token, integration.pageId||"")
        break
      case "LINKEDIN":
        posts = await fetchLinkedInPosts(integration.token, integration.linkedinId||"")
        break
      case "WHATSAPP":
        // WhatsApp doesn't have posts, return empty
        posts = []
        break
    }

    return { status: 200, data: posts }
  } catch (error) {
    console.error("Error fetching platform posts:", error)
    return { status: 500, data: [] }
  }
}

async function fetchInstagramPosts(token: string) {
  try {
    const response = await fetch(
      `${process.env.INSTAGRAM_BASE_URL}/me/media?fields=id,caption,media_url,media_type,timestamp&limit=10&access_token=${token}`,
    )
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Error fetching Instagram posts:", error)
    return []
  }
}

async function fetchFacebookPosts(token: string, pageId?: string) {
  try {
    if (!pageId) return []
    const response = await fetch(
      `${process.env.FACEBOOK_BASE_URL}/${pageId}/feed?fields=id,message,story,picture,link&limit=10&access_token=${token}`,
    )
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Error fetching Facebook posts:", error)
    return []
  }
}

async function fetchLinkedInPosts(token: string, linkedinId?: string) {
  try {
    if (!linkedinId) return []
    const response = await fetch(`${process.env.LINKEDIN_BASE_URL}/v2/me/posts?access_token=${token}`)
    const data = await response.json()
    return data.elements || []
  } catch (error) {
    console.error("Error fetching LinkedIn posts:", error)
    return []
  }
}

export const savePlatformPosts = async (
  automationId: string,
  platform: Platform,
  posts: {
    postid: string
    caption?: string
    media: string
    mediaType: "IMAGE" | "VIDEO" | "CAROSEL_ALBUM"
  }[],
) => {
  await onCurrentUser()
  try {
    const savedPosts = await client.post.createMany({
      data: posts.map((post) => ({
        ...post,
        automationId,
      })),
    })

    if (savedPosts) {
      return { status: 200, data: `${posts.length} posts saved successfully` }
    }
    return { status: 404, data: "Failed to save posts" }
  } catch (error) {
    console.error("Error saving platform posts:", error)
    return { status: 500, data: "Failed to save posts" }
  }
}

export const getPlatformConversations = async (platform: Platform, limit = 50) => {
  const user = await onCurrentUser()
  try {
    const conversations = await client.conversation.findMany({
      where: {
        Automation: {
          userId: user.id,
          platform,
        },
      },
      take: limit,
      orderBy: {
        updatedAt: "desc",
      },
    })

    return { status: 200, data: conversations }
  } catch (error) {
    console.error("Error fetching platform conversations:", error)
    return { status: 500, data: [] }
  }
}

export const logPlatformMessage = async (
  automationId: string,
  platform: Platform,
  senderId: string,
  message: string,
  isFromBot = false,
) => {
  await onCurrentUser()
  try {
    const loggedMessage = await client.message.create({
      data: {
        automationId,
        pageId: senderId,
        senderId,
        message,
        isFromBot,
      },
    })

    if (loggedMessage) {
      return { status: 200, data: "Message logged successfully" }
    }
    return { status: 404, data: "Failed to log message" }
  } catch (error) {
    console.error("Error logging platform message:", error)
    return { status: 500, data: "Failed to log message" }
  }
}
