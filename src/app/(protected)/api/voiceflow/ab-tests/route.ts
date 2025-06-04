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

    const abTests = await client.voiceflowABTest.findMany({
      where: {
        userId: user.id,
        automationId,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(abTests)
  } catch (error) {
    console.error("Error fetching A/B tests:", error)
    return NextResponse.json({ error: "Failed to fetch A/B tests" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { automationId, testConfig } = await req.json()

    if (!automationId || !testConfig) {
      return NextResponse.json({ error: "Automation ID and test config are required" }, { status: 400 })
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

    const result = await enhancedVoiceflowService.createABTest(user.id, automationId, testConfig)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error creating A/B test:", error)
    return NextResponse.json({ error: "Failed to create A/B test" }, { status: 500 })
  }
}
