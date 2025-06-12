// "use server"

// import { revalidatePath } from "next/cache"
// import { client } from "@/lib/prisma"

// export interface ScheduledPost {
//   id: string
//   caption: string
//   mediaType: string
//   mediaUrl: string
//   thumbnailUrl: string | null
//   scheduledDate: string
//   publishedDate: string | null
//   status: string
//   automationId?: string | null
// }

// export async function schedulePost(formData: FormData) {
//   const caption = formData.get("caption") as string
//   const mediaType = formData.get("mediaType") as string
//   const mediaUrl = formData.get("mediaUrl") as string
//   const thumbnailUrl = formData.get("thumbnailUrl") as string
//   const scheduledDate = formData.get("scheduledDate") as string
//   const userId = formData.get("userId") as string

//   try {
//     const scheduledContent = await client.scheduledContent.create({
//       data: {
//         caption,
//         mediaType,
//         mediaUrl,
//         thumbnailUrl,
//         scheduledDate: new Date(scheduledDate),
//         status: "scheduled",
//         userId,
//       },
//     })

//     return { success: true, data: scheduledContent }
//   } catch (error) {
//     console.error("Error scheduling post:", error)
//     return { success: false, error: "Failed to schedule post" }
//   }
// }

// export async function getScheduledPosts(
//   clerkId: string,
// ): Promise<{ success: boolean; data?: ScheduledPost[]; error?: string }> {
//   try {
//     const user = await client.user.findUnique({
//       where: { clerkId },
//     })

//     if (!user) {
//       return { success: false, error: "User not found" }
//     }

//     const scheduledPosts = await client.scheduledContent.findMany({
//       where: { userId: user.id },
//       orderBy: { scheduledDate: "asc" },
//       select: {
//         id: true,
//         caption: true,
//         mediaType: true,
//         mediaUrl: true,
//         thumbnailUrl: true,
//         scheduledDate: true,
//         publishedDate: true,
//         status: true,
//         automationId: true,
//       },
//     })

//     const formattedPosts: ScheduledPost[] = scheduledPosts.map((post) => ({
//       ...post,
//       scheduledDate: post.scheduledDate.toISOString(),
//       publishedDate: post.publishedDate ? post.publishedDate.toISOString() : null,
//     }))

//     return { success: true, data: formattedPosts }
//   } catch (error) {
//     console.error("Error fetching scheduled posts:", error)
//     return { success: false, error: "Failed to fetch scheduled posts" }
//   }
// }



// export async function publishPost(postId: string) {
//   try {
//     const post = await client.scheduledContent.findUnique({
//       where: { id: postId },
//       include: {
//         User: {
//           include: {
//             integrations: {
//               where: { name: "INSTAGRAM" },
//             },
//           },
//         },
//       },
//     })

//     if (!post) {
//       return { success: false, error: "Post not found" }
//     }

//     // Call the Instagram API endpoint
//     const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/post-to-instagram`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         userId: post.User?.clerkId,
//         caption: post.caption,
//         mediaUrls: post.mediaUrl.split(","),
//         mediaType: post.mediaType,
//       }),
//     })

//     if (!response.ok) {
//       throw new Error("Failed to publish to Instagrammmmmmmeeeeeghghh")
//     }

//     // Update post status
//     await client.scheduledContent.update({
//       where: { id: postId },
//       data: {
//         status: "published",
//         publishedDate: new Date(),
//       },
//     })

//     revalidatePath("/schedule")
//     return { success: true }
//   } catch (error) {
//     console.error("Error publishing post:", error)
//     return { success: false, error: "Failed to publish postiiiiiiiiiiiiiiiii" }
//   }
// }



"use server"

import { revalidatePath } from "next/cache"
import { client } from "@/lib/prisma"
import { Integrations } from "@prisma/client"

// Enhanced logging utility
function logError(context: string, error: any, extra?: Record<string, any>) {
  const timestamp = new Date().toISOString()
  const errorInfo = {
    timestamp,
    context,
    errorName: error?.name || "UnknownError",
    errorMessage: error?.message || "No error message",
    stack: error?.stack || "No stack trace",
    ...extra
  }
  
  console.error(JSON.stringify(errorInfo, null, 2))
  
  // In production, you'd send this to a logging service
  // sendToLoggingService(errorInfo)
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
      scheduledDate 
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
      postId: scheduledContent.id 
    })
    
    return { success: true, data: scheduledContent }
  } catch (error) {
    logError("schedulePost - Failed", error, { 
      userId, 
      mediaType, 
      scheduledDate 
    })
    
    return { 
      success: false, 
      error: "Failed to schedule post. Please try again later." 
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
      where: { userId: user.id },
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
      count: formattedPosts.length 
    })
    
    return { success: true, data: formattedPosts }
  } catch (error) {
    logError("getScheduledPosts - Failed", error, { clerkId })
    return { 
      success: false, 
      error: "Failed to fetch scheduled posts. Please try again later." 
    }
  }
}

export async function publishPost(postId: string) {
  try {
    logError("publishPost - Start", { postId })

    const post = await client.scheduledContent.findUnique({
      where: { id: postId },
      include: {
        User: {
          include: {
            integrations: {
              where: { name: "INSTAGRAM" },
            },
          },
        },
      },
    })

    if (!post) {
      logError("publishPost - Post not found", { postId })
      return { success: false, error: "Post not found" }
    }

    if (!post.User) {
      logError("publishPost - User not found", { 
        postId, 
        userId: post.userId 
      })
      return { success: false, error: "User account not found" }
    }

    if (!post.User.integrations || post.User.integrations.length === 0) {
      logError("publishPost - Instagram integration missing", { 
        postId, 
        userId: post.userId 
      })
      return { success: false, error: "Instagram integration not set up" }
    }

    const instagramIntegration = post.User.integrations[0]
    
    // Prepare API request
    const payload = {
      userId: post.User.clerkId,
      caption: post.caption,
      mediaUrls: post.mediaUrl.split(","),
      mediaType: post.mediaType,
      thumbnailUrl: post.thumbnailUrl
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/post-to-instagram`
    logError("publishPost - Calling API", { 
      apiUrl, 
      payload: { ...payload, mediaUrls: payload.mediaUrls.length } 
    })

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      let errorResponse = ""
      try {
        errorResponse = await response.text()
      } catch (e) {
        errorResponse = "Failed to read error response"
      }
      
      logError("publishPost - API Error Response", {
        status: response.status,
        statusText: response.statusText,
        errorResponse,
        apiUrl,
        payload: { ...payload, mediaUrls: payload.mediaUrls.length },
        instagramIntegration: {
          id: instagramIntegration.id,
          instagramId: instagramIntegration.instagramId,
          tokenExpires: instagramIntegration.expiresAt
        }
      })
      
      throw new Error(`Instagram API responded with ${response.status}: ${response.statusText}`)
    }

    // Update post status
    await client.scheduledContent.update({
      where: { id: postId },
      data: {
        status: "published",
        publishedDate: new Date(),
      },
    })

    logError("publishPost - Success", { postId })
    revalidatePath("/schedule")
    
    return { success: true }
  } catch (error) {
    logError("publishPost - Failed", error, { postId })
    
    return { 
      success: false, 
      error: error instanceof Error 
        ? error.message 
        : "Failed to publish post. Please check your Instagram connection."
    }
  }
}