"use server"

import { prisma } from "@/lib/prisma"

// Record workflow analytics
export async function recordWorkflowAnalytics(
  userId: string,
  workflowId: string,
  metrics: {
    executions?: number
    completions?: number
    failures?: number
    avgDuration?: number
    responses?: number
    buttonClicks?: number
    conversions?: number
    platformStats?: any
  },
) {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const analytics = await prisma.workflowAnalytics.upsert({
      where: {
        userId_workflowId_date: {
          userId,
          workflowId,
          date: today,
        },
      },
      update: {
        executions: { increment: metrics.executions || 0 },
        completions: { increment: metrics.completions || 0 },
        failures: { increment: metrics.failures || 0 },
        responses: { increment: metrics.responses || 0 },
        buttonClicks: { increment: metrics.buttonClicks || 0 },
        conversions: { increment: metrics.conversions || 0 },
        ...(metrics.avgDuration && { avgDuration: metrics.avgDuration }),
        ...(metrics.platformStats && { platformStats: metrics.platformStats }),
      },
      create: {
        userId,
        workflowId,
        date: today,
        executions: metrics.executions || 0,
        completions: metrics.completions || 0,
        failures: metrics.failures || 0,
        avgDuration: metrics.avgDuration,
        responses: metrics.responses || 0,
        buttonClicks: metrics.buttonClicks || 0,
        conversions: metrics.conversions || 0,
        platformStats: metrics.platformStats,
      },
    })

    return { success: true, analytics }
  } catch (error) {
    console.error("Error recording analytics:", error)
    return { success: false, error: "Failed to record analytics" }
  }
}

// Get workflow analytics
export async function getWorkflowAnalytics(userId: string, workflowId?: string, days = 30) {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const analytics = await prisma.workflowAnalytics.findMany({
      where: {
        userId,
        ...(workflowId && { workflowId }),
        date: { gte: startDate },
      },
      include: {
        workflow: {
          select: {
            name: true,
            triggerType: true,
          },
        },
      },
      orderBy: { date: "desc" },
    })

    return { success: true, analytics }
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return { success: false, error: "Failed to fetch analytics" }
  }
}
