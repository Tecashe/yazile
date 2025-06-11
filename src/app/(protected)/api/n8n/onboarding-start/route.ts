import { type NextRequest, NextResponse } from "next/server"
import { onCurrentUser } from "@/actions/user"

export async function POST(request: NextRequest) {
  try {
    const user = await onCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { userType, timestamp, step } = body

    // Trigger n8n workflow for onboarding start
    const n8nWebhookUrl = process.env.N8N_ONBOARDING_START_WEBHOOK_URL

    if (n8nWebhookUrl) {
      const n8nPayload = {
        userId: user.id,
        userEmail: user.emailAddresses[0],
        userType,
        step,
        timestamp,
        event: "onboarding_started",
        metadata: {
          source: "web_app",
          userAgent: request.headers.get("user-agent"),
          ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
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
    console.error("Error triggering n8n onboarding start:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
