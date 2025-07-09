import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    // Verify authorization
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { type, leadId, userId, urgency, message, leadData } = body

    console.log(`🚨 Team notification: ${type} for lead ${leadId}`)

    // Create team notification
    const notification = await client.notification.create({
      data: {
        userId,
        type,
        title: getTeamNotificationTitle(type, leadData),
        message,
        priority: urgency || "medium",
        data: {
          leadData,
          notificationType: type,
          timestamp: new Date().toISOString(),
        } as any,
        leadId,
        read: false,
        createdAt: new Date(),
      },
    })

    // For high-value leads, also create an alert
    if (type === "high_value_lead" && leadData?.tier === "PLATINUM") {
      await client.alert.create({
        data: {
          userId,
          type: "PLATINUM_LEAD",
          title: "💎 Platinum Lead Alert!",
          message: `${leadData.name || "Lead"} is a PLATINUM tier lead worth $${leadData.revenue?.toLocaleString()}`,
          priority: "URGENT",
          leadId,
          metadata: {
            leadTier: leadData.tier,
            estimatedValue: leadData.revenue,
            score: leadData.score,
            intent: leadData.intent,
          } as any,
        },
      })
    }

    // Send real-time notification (implement based on your setup)
    if (urgency === "urgent") {
      // TODO: Implement real-time team notification
      // This could be WebSocket, Slack, email, SMS, etc.
      console.log(`🚨 URGENT: ${message}`)
    }

    return NextResponse.json({
      success: true,
      notificationId: notification.id,
      message: "Team notification sent",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Team notification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function getTeamNotificationTitle(type: string, leadData: any): string {
  switch (type) {
    case "high_value_lead":
      return `🔥 ${leadData?.tier || "High Value"} Lead Alert`
    case "urgent_follow_up":
      return "⚡ Urgent Follow-up Required"
    case "lead_qualified":
      return "✅ Lead Qualified"
    case "conversion_opportunity":
      return "💰 Conversion Opportunity"
    default:
      return "📢 Team Notification"
  }
}
