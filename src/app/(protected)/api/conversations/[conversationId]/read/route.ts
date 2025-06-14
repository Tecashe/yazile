// import { type NextRequest, NextResponse } from "next/server"
// import { ChatDatabase } from "@/lib/db-operations"
// import { PusherService } from "@/lib/pusher-helper"
// import { onUserInfor } from "@/actions/user"

// export async function POST(request: NextRequest, { params }: { params: { conversationId: string } }) {
//   try {
//     const userr =  await onUserInfor()
//     const  userId  = userr.data?.id

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const body = await request.json()
//     const { automationId } = body

//     await ChatDatabase.markConversationAsRead(params.conversationId)

//     // Trigger Pusher event for real-time updates
//     if (automationId) {
//       await PusherService.triggerMessageRead(automationId, {
//         conversationId: params.conversationId,
//         userId,
//         data: { messageIds: [] }, // You can implement specific message IDs if needed
//       })
//     }

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("Error marking conversation as read:", error)
//     return NextResponse.json({ error: "Failed to mark conversation as read" }, { status: 500 })
//   }
// }


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
    const { automationId } = body

    await ChatDatabase.markConversationAsRead(params.conversationId)

    // Trigger Pusher event for real-time updates
    if (automationId) {
      await PusherService.triggerMessageRead(automationId, {
        conversationId: params.conversationId,
        userId,
        data: { messageIds: [] }, // You can implement specific message IDs if needed
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error marking conversation as read:", error)
    return NextResponse.json({ error: "Failed to mark conversation as read" }, { status: 500 })
  }
}
