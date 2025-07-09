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
    const { leadId, userId, followUpData, nextSequence, priority } = body

    console.log(`📅 Scheduling follow-up for lead ${leadId}`)

    // Parse follow-up schedule
    const nextContactDate = new Date(followUpData.nextContact)
    const frequency = followUpData.frequency || "weekly"
    const method = followUpData.method || "email"

    // Create scheduled action
    const scheduledAction = await client.scheduledAction.create({
      data: {
        leadId,
        action: `follow_up_${method}`,
        scheduledFor: nextContactDate,
        status: "PENDING",
        metadata: {
          sequence: nextSequence,
          priority,
          frequency,
          method,
          originalFollowUpData: followUpData,
        } as any,
        createdAt: new Date(),
      },
    })

    // Update lead with follow-up info
    await client.lead.update({
      where: { id: leadId },
      data: {
        metadata: {
          nextFollowUp: {
            scheduledFor: nextContactDate.toISOString(),
            method,
            frequency,
            actionId: scheduledAction.id,
          },
        } as any,
      },
    })

    // If it's a high priority follow-up, create a notification
    if (priority === "high" || priority === "urgent") {
      await client.notification.create({
        data: {
          userId,
          type: "follow_up_scheduled",
          title: "High Priority Follow-up Scheduled",
          message: `Follow-up scheduled for lead via ${method} on ${nextContactDate.toLocaleDateString()}`,
          priority,
          leadId,
          read: false,
        },
      })
    }

    console.log(`✅ Follow-up scheduled for ${nextContactDate.toISOString()}`)

    return NextResponse.json({
      success: true,
      scheduledAction: {
        id: scheduledAction.id,
        scheduledFor: nextContactDate.toISOString(),
        method,
        frequency,
      },
      message: "Follow-up scheduled successfully",
    })
  } catch (error) {
    console.error("❌ Schedule follow-up error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
