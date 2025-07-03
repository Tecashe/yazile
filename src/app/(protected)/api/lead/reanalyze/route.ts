import { type NextRequest, NextResponse } from "next/server"
import { analyzeEnhancedMessage } from "@/lib/lead-qualification"
import { client } from "@/lib/prisma"
import { onUserInfor } from "@/actions/user"

export async function POST(request: NextRequest) {
  try {
    const  user  = await onUserInfor()
    const userId = user.data?.id
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { leadId, message } = await request.json()

    if (!leadId || !message) {
      return NextResponse.json({ error: "Missing leadId or message" }, { status: 400 })
    }

    // Get lead data
    const lead = await client.lead.findUnique({
      where: { id: leadId },
      include: {
        interactions: {
          take: 5,
          orderBy: { timestamp: "desc" },
        },
      },
    })

    if (!lead || lead.userId !== userId) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    const leadData = {
      leadId: lead.id,
      name: lead.name || undefined,
      email: lead.email || undefined,
      phone: lead.phone || undefined,
      stage: lead.status,
      previousInteractions: lead.interactions?.length || 0,
      source: lead.source,
    }

    const analysis = await analyzeEnhancedMessage(message, userId, lead.instagramUserId, leadData)

    return NextResponse.json({
      success: analysis.success,
      analysis: analysis.analysis,
      message: analysis.success ? "Re-analysis completed successfully" : "Re-analysis failed",
    })
  } catch (error) {
    console.error("Error re-analyzing lead:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Re-analysis failed",
      },
      { status: 500 },
    )
  }
}
