// still in use - API route for workflow analytics
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "30")

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const analytics = await prisma.workflowAnalytics.findMany({
      where: {
        workflowId: params.id,
        date: {
          gte: startDate,
        },
      },
      orderBy: { date: "asc" },
    })

    const executions = await prisma.workflowExecutions.findMany({
      where: {
        workflowId: params.id,
        startedAt: {
          gte: startDate,
        },
      },
      select: {
        status: true,
        startedAt: true,
        completedAt: true,
        platform: true,
      },
    })

    // Calculate summary metrics
    const totalExecutions = executions.length
    const completedExecutions = executions.filter((e) => e.status === "completed").length
    const failedExecutions = executions.filter((e) => e.status === "failed").length
    const avgDuration =
      executions
        .filter((e) => e.completedAt)
        .reduce((acc, e) => {
          const duration = (new Date(e.completedAt!).getTime() - new Date(e.startedAt).getTime()) / 1000
          return acc + duration
        }, 0) / completedExecutions || 0

    const platformBreakdown = executions.reduce(
      (acc, e) => {
        acc[e.platform] = (acc[e.platform] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return NextResponse.json({
      analytics,
      summary: {
        totalExecutions,
        completedExecutions,
        failedExecutions,
        successRate: totalExecutions > 0 ? (completedExecutions / totalExecutions) * 100 : 0,
        avgDuration,
        platformBreakdown,
      },
    })
  } catch (error) {
    console.error("Failed to fetch analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
