import { type NextRequest, NextResponse } from "next/server"
import { assignHandoff } from "@/lib/human-handoff"

export async function POST(req: NextRequest, { params }: { params: { handoffId: string } }) {
  try {
    const { agentId } = await req.json()

    if (!agentId) {
      return NextResponse.json({ success: false, error: "Agent ID is required" }, { status: 400 })
    }

    const result = await assignHandoff(params.handoffId, agentId)

    if (result.success) {
      return NextResponse.json(result)
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
