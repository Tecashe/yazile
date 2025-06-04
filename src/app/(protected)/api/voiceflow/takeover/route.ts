import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { client } from "@/lib/prisma"
import { enhancedVoiceflowService } from "@/lib/voiceflow"

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { automationId, instagramUserId, agentId, reason } = await req.json()

    if (!automationId || !instagramUserId || !agentId) {
      return NextResponse.json(
        { error: "Automation ID, Instagram User ID, and agent ID are required" },
        { status: 400 },
      )
    }

    // Get user from database
    const user = await client.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify user owns this automation
    const automation = await client.automation.findFirst({
      where: {
        id: automationId,
        userId: user.id,
      },
    })

    if (!automation) {
      return NextResponse.json({ error: "Automation not found" }, { status: 404 })
    }

    const result = await enhancedVoiceflowService.takeoverConversation(
      user.id,
      automationId,
      instagramUserId,
      agentId,
      reason,
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error taking over conversation:", error)
    return NextResponse.json({ error: "Failed to take over conversation" }, { status: 500 })
  }
}
