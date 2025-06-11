import { type NextRequest, NextResponse } from "next/server"
import { onCurrentUser } from "@/actions/user"

export async function POST(request: NextRequest) {
  try {
    const user = await onCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { userType, step, data, timestamp } = body

    // Trigger n8n workflow for step completion
    const n8nWebhookUrl = process.env.N8N_ONBOARDING_STEP_WEBHOOK_URL

    if (n8nWebhookUrl) {
      const n8nPayload = {
        userId: user.id,
        userEmail: user.emailAddresses[0],
        userType,
        step,
        stepData: data,
        timestamp,
        event: "onboarding_step_completed",
        progress: {
          currentStep: step + 1,
          totalSteps: userType === "influencer" ? 4 : 4,
          percentComplete: ((step + 1) / 4) * 100,
        },
      }

      await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.N8N_WEBHOOK_SECRET}`,
        },
        body: JSON.stringify(n8nPayload),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error triggering n8n onboarding step:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
