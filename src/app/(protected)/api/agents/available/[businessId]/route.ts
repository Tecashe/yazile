import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"

export async function GET(req: NextRequest, { params }: { params: { businessId: string } }) {
  try {
    const businessId = params.businessId
    const requiredSkills = req.headers.get("x-required-skills")?.split(",") || []
    const preferredLanguage = req.headers.get("x-preferred-language") || "en"

    // Find available agent for this specific business
    const availableAgent = await client.agent.findFirst({
      where: {
        isActive: true,
        isAvailable: true,
        OR: [
          // Agents specifically assigned to this business
          {
            businessAssignments: {
              some: {
                businessId: businessId,
                isActive: true,
              },
            },
          },
          // General agents with matching skills and no specific business assignments
          {
            AND: [
              {
                businessAssignments: {
                  none: {},
                },
              },
              {
                skills: {
                  hasSome: requiredSkills.length > 0 ? requiredSkills : ["general-support"],
                },
              },
              {
                languages: {
                  has: preferredLanguage,
                },
              },
            ],
          },
        ],
      },
      include: {
        handoffs: {
          where: {
            status: {
              in: ["ASSIGNED", "IN_PROGRESS"],
            },
          },
        },
        businessAssignments: {
          where: {
            businessId: businessId,
            isActive: true,
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
          message: "No agents available for this business",
          businessId,
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
          businessId,
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
        skills: availableAgent.skills,
        languages: availableAgent.languages,
        isBusinessSpecific: availableAgent.businessAssignments.length > 0,
      },
      businessId,
    })
  } catch (error) {
    console.error("Error finding available agent for business:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        businessId: params.businessId,
      },
      { status: 500 },
    )
  }
}
