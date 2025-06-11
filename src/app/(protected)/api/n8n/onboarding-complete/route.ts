import { type NextRequest, NextResponse } from "next/server"
import { onCurrentUser } from "@/actions/user"

export async function POST(request: NextRequest) {
  try {
    const user = await onCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { userType, finalData, timestamp } = body

    // Trigger n8n workflow for onboarding completion
    const n8nWebhookUrl = process.env.N8N_ONBOARDING_COMPLETE_WEBHOOK_URL

    if (n8nWebhookUrl) {
      const n8nPayload = {
        userId: user.id,
        userEmail: user.emailAddresses[0],
        userType,
        finalData,
        timestamp,
        event: "onboarding_completed",
        profile: {
          businessName: finalData.businessName,
          businessType: finalData.businessType,
          instagramHandle: finalData.instagramHandle,
          categories: finalData.categories,
          goals: finalData.goals,
          monthlyGoal: finalData.monthlyGoal,
        },
        nextActions:
          userType === "influencer"
            ? ["setup_creator_profile", "browse_opportunities", "connect_brands"]
            : ["setup_automation", "connect_instagram", "configure_responses"],
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
    console.error("Error triggering n8n onboarding complete:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
