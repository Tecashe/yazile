
// import { NextResponse } from "next/server"
// import { pusherServer } from "@/lib/pusher"
// import { onUserInfor } from "@/actions/user"

// export async function POST(request: Request, { params }: { params: { chatId: string } }) {
//   try {
//     const user = await onUserInfor()
//     if (!user.data?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const chatId = params.chatId
//     const action = await request.json()

//     // Broadcast the drawing action to all clients
//     if (pusherServer) {
//       await pusherServer.trigger(`whiteboard-${chatId}`, "draw-action", action)
//     }

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("Error in whiteboard API:", error)
//     return NextResponse.json({ error: "Failed to process drawing action" }, { status: 500 })
//   }
// }

import { NextResponse } from "next/server"
import { pusherServer } from "@/lib/pusher"
import { onUserInfor } from "@/actions/user"
import { client } from "@/lib/prisma"

export async function POST(req: Request, { params }: { params: { chatId: string } }) {
  try {
    const user = await onUserInfor()
    if (!user.data?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const chatId = params.chatId
    const drawAction = await req.json()

    // Check if user is a participant in this chat
    const userParticipation = await client.collabChatParticipant.findFirst({
      where: {
        chatId,
        userId: user.data.id,
      },
    })

    if (!userParticipation) {
      return NextResponse.json({ error: "You don't have access to this chat" }, { status: 403 })
    }

    // Broadcast the drawing action to all clients
    await pusherServer.trigger(`whiteboard-${chatId}`, "draw-action", drawAction)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in whiteboard API:", error)
    return NextResponse.json({ error: "Failed to process drawing action" }, { status: 500 })
  }
}
