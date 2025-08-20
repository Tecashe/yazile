"use server"

import { revalidatePath } from "next/cache"
import { client } from "@/lib/prisma"

// Enhanced logging utility
function logError(context: string, error: any, extra?: Record<string, any>) {
  const timestamp = new Date().toISOString()
  const errorInfo = {
    timestamp,
    context,
    errorName: error?.name || "UnknownError",
    errorMessage: error?.message || "No error message",
    stack: error?.stack || "No stack trace",
    ...extra,
  }

  console.error(`[${timestamp}] ${context}:`, JSON.stringify(errorInfo, null, 2))
}

export interface ScheduledPost {
  id: string
  caption: string
  mediaType: string
  mediaUrl: string
  thumbnailUrl: string | null
  scheduledDate: string
  publishedDate: string | null
  status: string
  automationId?: string | null
}

export async function schedulePost(formData: FormData) {
  const caption = formData.get("caption") as string
  const mediaType = formData.get("mediaType") as string
  const mediaUrl = formData.get("mediaUrl") as string
  const thumbnailUrl = formData.get("thumbnailUrl") as string
  const scheduledDate = formData.get("scheduledDate") as string
  const userId = formData.get("userId") as string

  try {
    logError("schedulePost - Start", {
      userId,
      mediaType,
      scheduledDate,
      hasCaption: !!caption,
      hasMediaUrl: !!mediaUrl,
    })

    const scheduledContent = await client.scheduledContent.create({
      data: {
        caption,
        mediaType,
        mediaUrl,
        thumbnailUrl,
        scheduledDate: new Date(scheduledDate),
        status: "scheduled",
        userId,
      },
    })

    logError("schedulePost - Success", {
      postId: scheduledContent.id,
    })

    revalidatePath("/schedule")
    return { success: true, data: scheduledContent }
  } catch (error) {
    logError("schedulePost - Failed", error, {
      userId,
      mediaType,
      scheduledDate,
    })

    return {
      success: false,
      error: "Failed to schedule post. Please try again later.",
    }
  }
}

export async function getScheduledPosts(
  clerkId: string,
): Promise<{ success: boolean; data?: ScheduledPost[]; error?: string }> {
  try {
    logError("getScheduledPosts - Start", { clerkId })

    const user = await client.user.findUnique({
      where: { clerkId },
    })

    if (!user) {
      logError("getScheduledPosts - User not found", { clerkId })
      return { success: false, error: "User not found" }
    }

    const scheduledPosts = await client.scheduledContent.findMany({
      where: {
        userId: user.id,
        // Only show scheduled and pending posts, not published ones
        status: { in: ["scheduled", "pending"] },
      },
      orderBy: { scheduledDate: "asc" },
      select: {
        id: true,
        caption: true,
        mediaType: true,
        mediaUrl: true,
        thumbnailUrl: true,
        scheduledDate: true,
        publishedDate: true,
        status: true,
        automationId: true,
      },
    })

    const formattedPosts: ScheduledPost[] = scheduledPosts.map((post) => ({
      ...post,
      scheduledDate: post.scheduledDate.toISOString(),
      publishedDate: post.publishedDate ? post.publishedDate.toISOString() : null,
    }))

    logError("getScheduledPosts - Success", {
      userId: user.id,
      count: formattedPosts.length,
    })

    return { success: true, data: formattedPosts }
  } catch (error) {
    logError("getScheduledPosts - Failed", error, { clerkId })
    return {
      success: false,
      error: "Failed to fetch scheduled posts. Please try again later.",
    }
  }
}

export async function publishPost(postId: string) {
  try {
    logError("publishPost - Start", { postId })

    // First, get the post with user and integration data
    const post = await client.scheduledContent.findUnique({
      where: { id: postId },
      include: {
        User: {
          include: {
            integrations: {
              where: { name: "INSTAGRAM" },
              orderBy: { lastUpdated: "desc" },
            },
          },
        },
      },
    })

    if (!post) {
      logError("publishPost - Post not found", { postId })
      return { success: false, error: "Post not found" }
    }

    if (post.status === "published") {
      logError("publishPost - Already published", { postId })
      return { success: false, error: "Post is already published" }
    }

    if (!post.User) {
      logError("publishPost - User not found", {
        postId,
        userId: post.userId,
      })
      return { success: false, error: "User account not found" }
    }

    if (!post.User.integrations || post.User.integrations.length === 0) {
      logError("publishPost - Instagram integration missing", {
        postId,
        userId: post.userId,
        userClerkId: post.User.clerkId,
      })
      return {
        success: false,
        error: "Instagram account not connected. Please connect your Instagram account in settings.",
      }
    }

    const instagramIntegration = post.User.integrations[0]

    // Validate integration data
    if (!instagramIntegration.instagramId) {
      logError("publishPost - Missing Instagram ID", {
        postId,
        integrationId: instagramIntegration.id,
      })
      return {
        success: false,
        error: "Instagram account not properly configured. Please reconnect your Instagram account.",
      }
    }

    if (!instagramIntegration.token) {
      logError("publishPost - Missing Token", {
        postId,
        integrationId: instagramIntegration.id,
      })
      return {
        success: false,
        error: "Instagram access token missing. Please reconnect your Instagram account.",
      }
    }

    // Log integration details for debugging
    logError("publishPost - Integration Details", {
      postId,
      integrationId: instagramIntegration.id,
      instagramId: instagramIntegration.instagramId,
      hasToken: !!instagramIntegration.token,
      tokenLength: instagramIntegration.token?.length || 0,
      tokenExpires: instagramIntegration.expiresAt,
      username: instagramIntegration.username,
    })

    // Validate media URLs
    const mediaUrls = post.mediaUrl.split(",").filter((url) => url.trim())
    if (mediaUrls.length === 0) {
      logError("publishPost - No media URLs", { postId })
      return { success: false, error: "No media files found for this post" }
    }

    // Prepare API request
    const payload = {
      userId: post.User.clerkId,
      caption: post.caption,
      mediaUrls: mediaUrls,
      mediaType: post.mediaType,
      thumbnailUrl: post.thumbnailUrl,
    }

    // Use the correct environment variable
    const baseUrl = process.env.NEXT_PUBLIC_HOST_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const apiUrl = `${baseUrl}/api/post-to-instagram`

    logError("publishPost - Calling API", {
      apiUrl,
      payload: {
        ...payload,
        mediaUrls: `${payload.mediaUrls.length} URLs`,
        captionLength: payload.caption.length,
      },
      userId: post.User.clerkId,
    })

    // Set post status to pending before API call
    await client.scheduledContent.update({
      where: { id: postId },
      data: { status: "pending" },
    })

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "ScheduledPost/1.0",
      },
      body: JSON.stringify(payload),
    })

    let responseData: any = null
    let errorResponse = ""

    try {
      const responseText = await response.text()
      if (responseText) {
        responseData = JSON.parse(responseText)
      }
    } catch (parseError) {
      errorResponse = "Failed to parse API response"
      logError("publishPost - Response Parse Error", parseError, {
        responseStatus: response.status,
        responseHeaders: Object.fromEntries(response.headers.entries()),
      })
    }

    if (!response.ok) {
      logError("publishPost - API Error Response", null, {
        status: response.status,
        statusText: response.statusText,
        responseData,
        errorResponse,
        apiUrl,
        payload: {
          ...payload,
          mediaUrls: `${payload.mediaUrls.length} URLs`,
        },
        instagramIntegration: {
          id: instagramIntegration.id,
          instagramId: instagramIntegration.instagramId,
          tokenExpires: instagramIntegration.expiresAt,
          hasToken: !!instagramIntegration.token,
        },
      })

      // Revert status back to scheduled on error
      await client.scheduledContent.update({
        where: { id: postId },
        data: { status: "scheduled" },
      })

      // More specific error messages based on status
      if (response.status === 401) {
        return {
          success: false,
          error: "Instagram authentication failed. Please reconnect your Instagram account in settings.",
        }
      }

      if (response.status === 400) {
        return {
          success: false,
          error: responseData?.error || "Invalid post data. Please check your media files and caption.",
        }
      }

      if (response.status === 404) {
        return {
          success: false,
          error: "Instagram account not found. Please reconnect your Instagram account.",
        }
      }

      return {
        success: false,
        error: responseData?.error || `Failed to publish to Instagram (${response.status})`,
      }
    }

    // Success - update post status
    const updatedPost = await client.scheduledContent.update({
      where: { id: postId },
      data: {
        status: "published",
        publishedDate: new Date(),
        instagramPostId: responseData?.data?.instagramPostId || responseData?.postId,
      },
    })

    logError("publishPost - Success", {
      postId,
      instagramPostId: updatedPost.instagramPostId,
      publishedAt: updatedPost.publishedDate,
    })

    revalidatePath("/schedule")

    return {
      success: true,
      data: {
        postId: updatedPost.id,
        instagramPostId: updatedPost.instagramPostId,
        publishedAt: updatedPost.publishedDate,
      },
    }
  } catch (error) {
    logError("publishPost - Failed", error, { postId })

    // Revert status back to scheduled on error
    try {
      await client.scheduledContent.update({
        where: { id: postId },
        data: { status: "scheduled" },
      })
    } catch (revertError) {
      logError("publishPost - Failed to revert status", revertError, { postId })
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to publish post. Please check your Instagram connection and try again.",
    }
  }
}

// Helper function to check Instagram integration status
export async function checkInstagramIntegration(clerkId: string) {
  try {
    const user = await client.user.findUnique({
      where: { clerkId },
      include: {
        integrations: {
          where: { name: "INSTAGRAM" },
          orderBy: { lastUpdated: "desc" },
        },
      },
    })

    if (!user) {
      return { success: false, error: "User not found" }
    }

    if (!user.integrations || user.integrations.length === 0) {
      return {
        success: false,
        error: "Instagram not connected",
        needsConnection: true,
      }
    }

    const integration = user.integrations[0]

    return {
      success: true,
      data: {
        connected: true,
        instagramId: integration.instagramId,
        username: integration.username,
        expiresAt: integration.expiresAt,
        isExpired: integration.expiresAt ? new Date() > integration.expiresAt : false,
      },
    }
  } catch (error) {
    logError("checkInstagramIntegration - Failed", error, { clerkId })
    return { success: false, error: "Failed to check Instagram integration" }
  }
}
