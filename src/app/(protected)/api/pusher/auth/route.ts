import { type NextRequest, NextResponse } from "next/server"
import { pusherServer } from "@/lib/pusher"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const params = new URLSearchParams(body)

    const socketId = params.get("socket_id")
    const channelName = params.get("channel_name")

    if (!socketId || !channelName) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const authResponse = pusherServer.authorizeChannel(socketId, channelName, {
      user_id: "user-id",
      user_info: {
        name: "User Name",
      },
    })

    return NextResponse.json(authResponse)
  } catch (error) {
    console.error("Pusher auth error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
