import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    // Find available agent with lowest current load
    const availableAgent = await client.agent.findFirst({
      where: {
        isActive: true,
        isAvailable: true,
      },
      include: {
        handoffs: {
          where: {
            status: {
              in: ["ASSIGNED", "IN_PROGRESS"],
            },
          },
        },
      },
      orderBy: {
        handoffs: {
          _count: "asc",
        },
      },
    })

    if (!availableAgent) {
      return NextResponse.json(
        {
          success: false,
          message: "No agents available",
        },
        { status: 404 },
      )
    }

    // Check if agent is under their max concurrent limit
    if (availableAgent.handoffs.length >= availableAgent.maxConcurrent) {
      return NextResponse.json(
        {
          success: false,
          message: "All agents at maximum capacity",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      agent: {
        id: availableAgent.id,
        name: availableAgent.name,
        email: availableAgent.email,
        currentLoad: availableAgent.handoffs.length,
        maxConcurrent: availableAgent.maxConcurrent,
      },
    })
  } catch (error) {
    console.error("Error finding available agent:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
