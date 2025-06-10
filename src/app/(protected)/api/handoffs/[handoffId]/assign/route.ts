import { type NextRequest, NextResponse } from "next/server"
import { assignHandoff } from "@/lib/human-handoff"
import { client } from "@/lib/prisma"

export async function POST(req: NextRequest, { params }: { params: { handoffId: string } }) {
  try {
    const { agentId, businessId } = await req.json()
    const requestBusinessId = req.headers.get("x-business-id")

    if (!agentId) {
      return NextResponse.json({ success: false, error: "Agent ID is required" }, { status: 400 })
    }

    // Verify business ID matches
    if (businessId && requestBusinessId && businessId !== requestBusinessId) {
      return NextResponse.json({ success: false, error: "Business ID mismatch" }, { status: 403 })
    }

    // Verify the handoff belongs to the specified business
    const handoff = await client.humanHandoff.findUnique({
      where: { id: params.handoffId },
      include: { business: true },
    })

    if (!handoff) {
      return NextResponse.json({ success: false, error: "Handoff not found" }, { status: 404 })
    }

    if (businessId && handoff.businessId !== businessId) {
      return NextResponse.json({ success: false, error: "Handoff does not belong to this business" }, { status: 403 })
    }

    // Verify the agent can handle this business
    const agent = await client.agent.findUnique({
      where: { id: agentId },
      include: {
        businessAssignments: {
          where: {
            businessId: handoff.businessId,
            isActive: true,
          },
        },
      },
    })

    if (!agent) {
      return NextResponse.json({ success: false, error: "Agent not found" }, { status: 404 })
    }

    // Check if agent is assigned to this business or is a general agent
    const canHandleBusiness =
      agent.businessAssignments.length > 0 || // Specifically assigned to this business
      (await client.agentBusinessAssignment.count({ where: { agentId } })) === 0 // General agent (no specific assignments)

    if (!canHandleBusiness) {
      return NextResponse.json(
        {
          success: false,
          error: "Agent is not authorized to handle this business",
        },
        { status: 403 },
      )
    }

    const result = await assignHandoff(params.handoffId, agentId)

    if (result.success) {
      // Log the assignment for analytics
      await client.agentPerformance.upsert({
        where: {
          agentId_businessId_date: {
            agentId,
            businessId: handoff.businessId,
            date: new Date(),
          },
        },
        update: {
          handoffsHandled: { increment: 1 },
        },
        create: {
          agentId,
          businessId: handoff.businessId,
          date: new Date(),
          handoffsHandled: 1,
        },
      })

      return NextResponse.json({
        ...result,
        businessId: handoff.businessId,
        businessName: handoff.business?.businessName,
      })
    } else {
      return NextResponse.json(result, { status: 400 })
    }
  } catch (error) {
    console.error("Error assigning handoff:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
