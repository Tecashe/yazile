import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"
import { getAuth } from "@clerk/nextjs/server"

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request)

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const user = await client.user.findUnique({
      where: { clerkId: userId },
      select: { isAdmin: true },
    })

    if (!user?.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get analytics data
    const [
      totalRequests,
      requestsByStatus,
      requestsByUrgency,
      completionRate,
      averageCompletionTime,
      templateUsage,
      recentActivity,
    ] = await Promise.all([
      // Total requests
      client.customWorkflowRequest.count(),

      // Requests by status
      client.customWorkflowRequest.groupBy({
        by: ["status"],
        _count: {
          status: true,
        },
      }),

      // Requests by urgency
      client.customWorkflowRequest.groupBy({
        by: ["urgency"],
        _count: {
          urgency: true,
        },
      }),

      // Completion rate
      client.customWorkflowRequest.findMany({
        select: {
          status: true,
          createdAt: true,
          actualDelivery: true,
        },
      }),

      // Average completion time
      client.customWorkflowRequest.findMany({
        where: {
          status: "COMPLETED",
          actualDelivery: { not: null },
        },
        select: {
          createdAt: true,
          actualDelivery: true,
        },
      }),

      // Template usage
      client.businessWorkflowTemplate.findMany({
        include: {
          _count: {
            select: {
              businessConfigs: true,
            },
          },
        },
        orderBy: {
          businessConfigs: {
            _count: "desc",
          },
        },
        take: 10,
      }),

      // Recent activity
      client.customWorkflowRequest.findMany({
        include: {
          user: {
            select: {
              firstname: true,
              lastname: true,
              email: true,
            },
          },
          // assignedAdmin: {
          //   select: {
          //     firstname: true,
          //     lastname: true,
          //   },
          // },
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 20,
      }),
    ])

    // Calculate completion rate
    const completedRequests = completionRate.filter((r) => r.status === "COMPLETED").length
    const completionRatePercentage = totalRequests > 0 ? (completedRequests / totalRequests) * 100 : 0

    // Calculate average completion time
    const completionTimes = averageCompletionTime.map((request) => {
      const created = new Date(request.createdAt)
      const completed = new Date(request.actualDelivery!)
      return completed.getTime() - created.getTime()
    })

    const avgCompletionTimeMs =
      completionTimes.length > 0 ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length : 0
    const avgCompletionTimeDays = Math.round(avgCompletionTimeMs / (1000 * 60 * 60 * 24))

    return NextResponse.json({
      success: true,
      analytics: {
        totalRequests,
        requestsByStatus: requestsByStatus.reduce(
          (acc, item) => {
            acc[item.status] = item._count.status
            return acc
          },
          {} as Record<string, number>,
        ),
        requestsByUrgency: requestsByUrgency.reduce(
          (acc, item) => {
            acc[item.urgency] = item._count.urgency
            return acc
          },
          {} as Record<string, number>,
        ),
        completionRate: Math.round(completionRatePercentage),
        averageCompletionTime: avgCompletionTimeDays,
        templateUsage,
        recentActivity,
      },
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
