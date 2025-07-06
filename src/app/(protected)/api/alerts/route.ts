import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate the alert data
    if (!body.alert || !body.automationId || !body.senderId) {
      return NextResponse.json({ success: false, error: "Missing required alert fields" }, { status: 400 })
    }

    const { alert, automationId, senderId, sentiment, confidence, insights, timestamp } = body

    // Store high-risk alert in database (you may need to create this table)
    try {
      await client.sentimentAlert.create({
        data: {
          automationId,
          senderId,
          alertType: alert,
          sentiment,
          confidence,
          riskLevel: insights?.riskLevel || "high",
          urgencyLevel: insights?.urgencyLevel || "high",
          satisfactionLevel: insights?.satisfactionLevel || "dissatisfied",
          insights: JSON.stringify(insights),
          triggeredAt: new Date(timestamp || Date.now()),
          resolved: false,
        },
      })
    } catch (dbError) {
      // If the table doesn't exist, just log the alert
      console.warn("SentimentAlert table not found, logging alert instead:", dbError)
    }

    // Log the high-risk alert
    console.log(`🚨 HIGH RISK ALERT for automation ${automationId}:`, {
      senderId,
      sentiment,
      confidence,
      riskLevel: insights?.riskLevel,
      urgencyLevel: insights?.urgencyLevel,
      satisfactionLevel: insights?.satisfactionLevel,
      recommendedActions: insights?.recommendedActions,
    })

    // Here you could also:
    // - Send email notifications to managers
    // - Create Slack/Discord alerts
    // - Trigger immediate follow-up workflows
    // - Update CRM systems

    return NextResponse.json({
      success: true,
      message: "High risk alert processed successfully",
      data: {
        alertId: `alert_${Date.now()}`,
        automationId,
        senderId,
        alertType: alert,
        riskLevel: insights?.riskLevel,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error processing high risk alert:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
