import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    // Verify authorization
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    if (token !== process.env.INTERNAL_API_KEY) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const body = await request.json()
    const { type, leadId, userId, data, message, priority } = body

    console.log(`📊 Dashboard notification: ${type} for lead ${leadId}`)

    // Create notification record
    await client.notification.create({
      data: {
        userId,
        type,
        title: getNotificationTitle(type),
        message,
        priority: priority || "medium",
        data: data as any,
        leadId,
        read: false,
        createdAt: new Date(),
      },
    })

    // If high priority, you could trigger real-time notifications here
    if (priority === "urgent" || priority === "high") {
      // TODO: Implement real-time notification (WebSocket, Server-Sent Events, etc.)
      console.log(`🚨 High priority notification for user ${userId}: ${message}`)
    }

    return NextResponse.json({
      success: true,
      message: "Notification created",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Dashboard notification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function getNotificationTitle(type: string): string {
  switch (type) {
    case "email_sent":
      return "Email Sent"
    case "high_value_lead":
      return "High Value Lead Alert"
    case "lead_qualified":
      return "Lead Qualified"
    case "crm_sync":
      return "CRM Sync Complete"
    default:
      return "Notification"
  }
}
