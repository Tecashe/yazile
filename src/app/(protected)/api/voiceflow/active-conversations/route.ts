import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { client } from "@/lib/prisma"
import { enhancedVoiceflowService } from "@/lib/voiceflow"

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const automationId = searchParams.get("automationId")

    if (!automationId) {
      return NextResponse.json({ error: "Automation ID is required" }, { status: 400 })
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

    const conversations = await enhancedVoiceflowService.getActiveConversations(user.id, automationId)

    return NextResponse.json(conversations)
  } catch (error) {
    console.error("Error fetching active conversations:", error)
    return NextResponse.json({ error: "Failed to fetch active conversations" }, { status: 500 })
  }
}
