"use server"

import { InstagramAPI } from "@/lib/instagram-api"
import { client } from "@/lib/prisma"
import type { User, ScheduledContent, Integrations } from "@prisma/client"
import { refreshToken } from "@/lib/fetch"
import { AxiosError } from "axios"

const testMediaUrls = [
  "https://via.placeholder.com/150",
  "https://via.placeholder.com/350",
  "https://via.placeholder.com/150/0000FF/808080",
  "https://via.placeholder.com/350/FF0000/FFFFFF",
]

export async function getScheduledContent(clerkId: string) {
  console.log(`[getScheduledContent] Starting for clerkId: ${clerkId}`)
  try {
    const user = (await client.user.findUnique({
      where: { clerkId },
      include: {
        integrations: {
          where: { name: "INSTAGRAM" },
        },
        scheduledContent: true,
      },
    })) as
      | (User & {
          integrations: Integrations[]
          scheduledContent: ScheduledContent[]
        })
      | null

    console.log(`[getScheduledContent] User found:`, user)

    if (!user || user.integrations.length === 0) {
      console.error(`[getScheduledContent] No valid Instagram integration found for clerkId: ${clerkId}`)
      return []
    }

    const integration = user.integrations[0]
    if (!integration.instagramId) {
      console.error(`[getScheduledContent] Instagram ID not found for integration`)
      return []
    }

    const instagramApi = new InstagramAPI(integration.token)
    console.log(`[getScheduledContent] Fetching scheduled content for instagramId: ${integration.instagramId}`)
    const scheduledContent = await instagramApi.getScheduledContent(integration.instagramId)
    console.log(`[getScheduledContent] Scheduled content fetched:`, scheduledContent)

    // Merge Instagram API data with local database data
    const mergedContent = user.scheduledContent.map((localContent: ScheduledContent) => {
      const apiContent = scheduledContent.find((c) => c.id === localContent.instagramPostId)
      return {
        ...localContent,
        ...apiContent,
        status: apiContent ? apiContent.status : localContent.status,
      }
    })

    console.log(`[getScheduledContent] Merged content:`, mergedContent)
    return mergedContent
  } catch (error) {
    console.error(`[getScheduledContent] Error:`, error)
    throw error
  }
}

export async function createScheduledContent(
  clerkId: string,
  contentData: {
    postType: string
    content: string
    scheduledDate: string
    hashtags: string[]
    file?: File | null
    mediaUrl?: string
  },
) {
  console.log(`[createScheduledContent] Starting for clerkId: ${clerkId}`)
  console.log(`[createScheduledContent] Content data:`, JSON.stringify(contentData, null, 2))
  try {
    const user = await client.user.findUnique({
      where: { clerkId },
      include: { integrations: { where: { name: "INSTAGRAM" } } },
    })
    console.log(`[createScheduledContent] User found:`, JSON.stringify(user, null, 2))

    if (!user || user.integrations.length === 0) {
      console.error(`[createScheduledContent] No valid Instagram integration found for clerkId: ${clerkId}`)
      throw new Error("No valid Instagram integration found for this user")
    }

    const integration = user.integrations[0]
    if (!integration.instagramId) {
      console.error(`[createScheduledContent] Instagram ID not found for integration`)
      throw new Error("Instagram ID not found for this integration")
    }

    // Use provided mediaUrl or select a random test URL
    const mediaUrl = contentData.mediaUrl || testMediaUrls[Math.floor(Math.random() * testMediaUrls.length)]

    const instagramApi = new InstagramAPI(integration.token)
    console.log(`[createScheduledContent] Creating scheduled content for instagramId: ${integration.instagramId}`)
    console.log(`[createScheduledContent] Payload:`, JSON.stringify({ ...contentData, mediaUrl }, null, 2))

    const newContent = await instagramApi.createScheduledContent(integration.instagramId, {
      ...contentData,
      mediaUrl,
    })
    console.log(`[createScheduledContent] New content created:`, JSON.stringify(newContent, null, 2))

    const createdContent = await client.scheduledContent.create({
      data: {
        instagramPostId: newContent.id,
        caption: newContent.caption,
        mediaType: newContent.media_type,
        mediaUrl: newContent.media_url,
        thumbnailUrl: newContent.thumbnail_url,
        permalink: newContent.permalink,
        scheduledDate: new Date(newContent.timestamp),
        userId: user.id,
        status: "scheduled",
      },
    })
    console.log(`[createScheduledContent] Content saved to database:`, JSON.stringify(createdContent, null, 2))
    return createdContent
  } catch (error) {
    console.error(`[createScheduledContent] Error:`, error)
    if (error instanceof AxiosError) {
      console.error(`[createScheduledContent] Axios Error Details:`, {
        message: error.message,
        code: error.code,
        response: {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        },
      })
    }
    throw error
  }
}


export async function deleteScheduledContent(clerkId: string, contentId: string) {
  console.log(`[deleteScheduledContent] Starting for clerkId: ${clerkId}, contentId: ${contentId}`)
  try {
    const user = await client.user.findUnique({
      where: { clerkId },
      include: { integrations: { where: { name: "INSTAGRAM" } } },
    })
    console.log(`[deleteScheduledContent] User found:`, user)

    if (!user || user.integrations.length === 0) {
      console.error(`[deleteScheduledContent] No valid Instagram integration found for clerkId: ${clerkId}`)
      throw new Error("No valid Instagram integration found for this user")
    }

    const integration = user.integrations[0]
    const instagramApi = new InstagramAPI(integration.token)
    console.log(`[deleteScheduledContent] Deleting content from Instagram`)
    await instagramApi.deleteScheduledContent(contentId)
    console.log(`[deleteScheduledContent] Content deleted from Instagram`)

    const deletedContent = await client.scheduledContent.delete({
      where: { instagramPostId: contentId, userId: user.id },
    })
    console.log(`[deleteScheduledContent] Content deleted from database:`, deletedContent)
    return deletedContent
  } catch (error) {
    console.error(`[deleteScheduledContent] Error:`, error)
    throw error
  }
}

export async function updateScheduledContent(clerkId: string, contentId: string, updateData: any) {
  console.log(`[updateScheduledContent] Starting for clerkId: ${clerkId}, contentId: ${contentId}`)
  console.log(`[updateScheduledContent] Update data:`, updateData)
  try {
    const user = await client.user.findUnique({
      where: { clerkId },
      include: { integrations: { where: { name: "INSTAGRAM" } } },
    })
    console.log(`[updateScheduledContent] User found:`, user)

    if (!user || user.integrations.length === 0) {
      console.error(`[updateScheduledContent] No valid Instagram integration found for clerkId: ${clerkId}`)
      throw new Error("No valid Instagram integration found for this user")
    }

    const integration = user.integrations[0]
    const instagramApi = new InstagramAPI(integration.token)
    console.log(`[updateScheduledContent] Updating content on Instagram`)
    const updatedContent = await instagramApi.updateScheduledContent(contentId, updateData)
    console.log(`[updateScheduledContent] Content updated on Instagram:`, updatedContent)

    const updatedDbContent = await client.scheduledContent.update({
      where: { instagramPostId: contentId, userId: user.id },
      data: {
        caption: updatedContent.caption,
        scheduledDate: new Date(updatedContent.timestamp),
      },
    })
    console.log(`[updateScheduledContent] Content updated in database:`, updatedDbContent)
    return updatedDbContent
  } catch (error) {
    console.error(`[updateScheduledContent] Error:`, error)
    throw error
  }
}

export async function refreshInstagramData(clerkId: string) {
  console.log(`[refreshInstagramData] Starting for clerkId: ${clerkId}`)
  try {
    const user = await client.user.findUnique({
      where: { clerkId },
      include: { integrations: { where: { name: "INSTAGRAM" } } },
    })
    console.log(`[refreshInstagramData] User found:`, user)

    if (!user || user.integrations.length === 0) {
      console.error(`[refreshInstagramData] No valid Instagram integration found for clerkId: ${clerkId}`)
      return { status: 404, message: "No valid Instagram integration found" }
    }

    const integration = user.integrations[0]
    if (!integration.instagramId) {
      console.error(`[refreshInstagramData] Instagram ID not found for integration`)
      return { status: 404, message: "Instagram ID not found for this integration" }
    }

    console.log(`[refreshInstagramData] Refreshing token`)
    const refreshedToken = await refreshToken(integration.token)
    console.log(`[refreshInstagramData] Token refreshed:`, refreshedToken)

    const instagramApi = new InstagramAPI(refreshedToken.access_token)
    console.log(`[refreshInstagramData] Fetching user profile`)
    const instaData = await instagramApi.getUserProfile(integration.instagramId)
    console.log(`[refreshInstagramData] User profile fetched:`, instaData)

    const updatedIntegration = await client.integrations.update({
      where: { id: integration.id },
      data: {
        token: refreshedToken.access_token,
        expiresAt: new Date(Date.now() + refreshedToken.expires_in * 1000),
        username: instaData.username,
        fullName: instaData.name,
        profilePicture: instaData.profile_picture_url,
        followersCount: instaData.followers_count,
        followingCount: instaData.follows_count,
        postsCount: instaData.media_count,
        lastUpdated: new Date(),
      },
    })
    console.log(`[refreshInstagramData] Integration updated in database:`, updatedIntegration)
    return { status: 200, data: instaData }
  } catch (error) {
    console.error(`[refreshInstagramData] Error:`, error)
    return { status: 500, message: "Error refreshing Instagram data" }
  }
}