import { type NextRequest, NextResponse } from "next/server"
import { ChatDatabase } from "@/lib/db-operations"
import { PusherService } from "@/lib/pusher-helper"
import { onUserInfor } from "@/actions/user"

export async function POST(request: NextRequest, { params }: { params: { conversationId: string } }) {
  try {
    const userr =  await onUserInfor()
        const  userId  = userr.data?.id

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { content, role, senderId, automationId } = body

    const message = await ChatDatabase.addMessage(params.conversationId, {
      content,
      role,
      senderId,
    })

    // Trigger Pusher event for real-time updates
    if (automationId) {
      await PusherService.triggerNewMessage(automationId, {
        conversationId: params.conversationId,
        data: message,
      })
    }

    return NextResponse.json({ message })
  } catch (error) {
    console.error("Error adding message:", error)
    return NextResponse.json({ error: "Failed to add message" }, { status: 500 })
  }
}
