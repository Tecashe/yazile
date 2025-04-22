import { NextResponse } from "next/server"
import {
  getScheduledContent,
  createScheduledContent,
  deleteScheduledContent,
  updateScheduledContent,
} from "@/lib/insta"
import { currentUser } from "@clerk/nextjs/server"
import { AxiosError } from "axios"

export async function GET(req: Request) {
  console.log("GET /api/scheduled-content: Started")
  try {
    const user = await currentUser()
    if (!user) {
      console.warn("GET /api/scheduled-content: Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log(`GET /api/scheduled-content: Fetching content for user ${user.id}`)
    const scheduledContent = await getScheduledContent(user.id)
    console.log(`GET /api/scheduled-content: Successfully fetched ${scheduledContent.length} items`)
    return NextResponse.json({ scheduledContent })
  } catch (error) {
    console.error("Error in GET /api/scheduled-content:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  console.log("POST /api/scheduled-content: Started")
  try {
    const user = await currentUser()
    if (!user) {
      console.warn("POST /api/scheduled-content: Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const postType = formData.get("postType") as string
    const content = formData.get("content") as string
    const scheduledDate = formData.get("scheduledDate") as string
    const hashtags = formData.getAll("hashtags[]") as string[]
    const mediaUrl = formData.get("mediaUrl") as string | null

    console.log(`POST /api/scheduled-content: Creating content for user ${user.id}`, {
      postType,
      contentPreview: content.substring(0, 100),
      scheduledDate,
      hashtags,
      hasMediaUrl: !!mediaUrl,
    })

    const contentData = {
      postType,
      content,
      scheduledDate,
      hashtags,
      mediaUrl: mediaUrl || undefined,
    }

    const newContent = await createScheduledContent(user.id, contentData)
    console.log(`POST /api/scheduled-content: Successfully created content for user ${user.id}`)
    return NextResponse.json(newContent)
  } catch (error) {
    console.error("Error in POST /api/scheduled-content:", error)

    if (error instanceof AxiosError) {
      console.error("Axios Error Details:", {
        message: error.message,
        code: error.code,
        response: {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        },
      })

      // Check if it's an Instagram API error
      if (error.response?.data?.error) {
        const instagramError = error.response.data.error
        console.error("Instagram API Error:", {
          message: instagramError.message,
          type: instagramError.type,
          code: instagramError.code,
          subcode: instagramError.subcode,
          fbtrace_id: instagramError.fbtrace_id,
        })

        return NextResponse.json(
          { error: "Instagram API Error", details: instagramError },
          { status: error.response.status },
        )
      }
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  console.log("DELETE /api/scheduled-content: Started")
  try {
    const user = await currentUser()
    if (!user) {
      console.warn("DELETE /api/scheduled-content: Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const contentId = searchParams.get("id")

    if (!contentId) {
      return NextResponse.json({ error: "Content ID is required" }, { status: 400 })
    }

    const deletedContent = await deleteScheduledContent(user.id, contentId)
    console.log(`DELETE /api/scheduled-content: Successfully deleted content for user ${user.id}`)
    return NextResponse.json(deletedContent)
  } catch (error) {
    console.error("Error in DELETE /api/scheduled-content:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  console.log("PUT /api/scheduled-content: Started")
  try {
    const user = await currentUser()
    if (!user) {
      console.warn("PUT /api/scheduled-content: Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const contentId = searchParams.get("id")

    if (!contentId) {
      return NextResponse.json({ error: "Content ID is required" }, { status: 400 })
    }

    const formData = await req.formData()
    const content = formData.get("content") as string
    const scheduledDate = formData.get("scheduledDate") as string

    const updateData = {
      caption: content,
      timestamp: scheduledDate,
    }

    const updatedContent = await updateScheduledContent(user.id, contentId, updateData)
    console.log(`PUT /api/scheduled-content: Successfully updated content for user ${user.id}`)
    return NextResponse.json(updatedContent)
  } catch (error) {
    console.error("Error in PUT /api/scheduled-content:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

