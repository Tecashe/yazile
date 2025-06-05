"use server"

import { client } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { onUserInfor } from "../user"

export async function getDashboardStats() {
  const  user  = await onUserInfor()
  const userId = user.data?.clerkId
  if (!userId) redirect("/sign-in")

  try {
    // Get user's data
    const user = await client.user.findUnique({
      where: { clerkId: userId },
      include: {
        automations: {
          include: {
            leads: true,
            _count: {
              select: {
                leads: true,
                posts: true,
                dms: true,
              },
            },
          },
        },
        leads: {
          include: {
            interactions: true,
          },
        },
        subscription: true,
        businesses: true,
        integrations: true,
      },
    })

    if (!user) throw new Error("User not found")

    // Calculate stats
    const totalAutomations = user.automations.length
    const activeAutomations = user.automations.filter((a) => a.active).length
    const totalLeads = user.leads.length
    const qualifiedLeads = user.leads.filter((l) => l.status === "QUALIFIED").length
    const convertedLeads = user.leads.filter((l) => l.status === "CONVERTED").length

    // Calculate conversion rate
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0

    // Get recent leads (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentLeads = user.leads.filter((l) => l.createdAt >= thirtyDaysAgo)
    const leadGrowth = recentLeads.length

    // Calculate automation performance
    const automationStats = user.automations.map((automation) => ({
      id: automation.id,
      name: automation.name,
      active: automation.active,
      leadsCount: automation._count.leads,
      postsCount: automation._count.posts,
      dmsCount: automation._count.dms,
      platform: automation.platform,
    }))

    return {
      totalAutomations,
      activeAutomations,
      totalLeads,
      qualifiedLeads,
      convertedLeads,
      conversionRate: Math.round(conversionRate * 10) / 10,
      leadGrowth,
      automationStats,
      integrations: user.integrations.length,
      subscription: user.subscription?.plan || "FREE",
      businesses: user.businesses.length,
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    throw new Error("Failed to fetch dashboard statistics")
  }
}

export async function getRecentActivity() {
  const  user  = await onUserInfor()
  const userId = user.data?.clerkId
  if (!userId) redirect("/sign-in")

  try {
    const user = await client.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) throw new Error("User not found")

    // Get recent leads
    const recentLeads = await client.lead.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        automation: true,
      },
    })

    // Get recent automations
    const recentAutomations = await client.automation.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 3,
    })

    // Get user notifications
    const notifications = await client.userNotification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    })

    return {
      recentLeads: recentLeads.map((lead) => ({
        id: lead.id,
        name: lead.name || "Unknown Lead",
        status: lead.status,
        source: lead.source,
        createdAt: lead.createdAt,
        automationName: lead.automation?.name || "Direct",
      })),
      recentAutomations: recentAutomations.map((automation) => ({
        id: automation.id,
        name: automation.name,
        active: automation.active,
        platform: automation.platform,
        createdAt: automation.createdAt,
      })),
      notifications: notifications.map((notification) => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        read: notification.read,
        createdAt: notification.createdAt,
      })),
    }
  } catch (error) {
    console.error("Error fetching recent activity:", error)
    throw new Error("Failed to fetch recent activity")
  }
}

export async function getLeadAnalytics() {
  const  user  = await onUserInfor()
  const userId = user.data?.clerkId
  if (!userId) redirect("/sign-in")

  try {
    const user = await client.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) throw new Error("User not found")

    // Get leads by status
    const leadsByStatus = await client.lead.groupBy({
      by: ["status"],
      where: { userId: user.id },
      _count: {
        id: true,
      },
    })

    // Get leads by source
    const leadsBySource = await client.lead.groupBy({
      by: ["source"],
      where: { userId: user.id },
      _count: {
        id: true,
      },
    })

    // Get daily lead creation for last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const dailyLeads = await client.lead.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        createdAt: true,
        status: true,
      },
    })

    // Group by day
    const leadsByDay = dailyLeads.reduce(
      (acc, lead) => {
        const day = lead.createdAt.toISOString().split("T")[0]
        if (!acc[day]) {
          acc[day] = { total: 0, qualified: 0, converted: 0 }
        }
        acc[day].total++
        if (lead.status === "QUALIFIED") acc[day].qualified++
        if (lead.status === "CONVERTED") acc[day].converted++
        return acc
      },
      {} as Record<string, { total: number; qualified: number; converted: number }>,
    )

    return {
      leadsByStatus: leadsByStatus.map((item) => ({
        status: item.status,
        count: item._count.id,
      })),
      leadsBySource: leadsBySource.map((item) => ({
        source: item.source,
        count: item._count.id,
      })),
      dailyLeads: Object.entries(leadsByDay).map(([date, counts]) => ({
        date,
        ...counts,
      })),
    }
  } catch (error) {
    console.error("Error fetching lead analytics:", error)
    throw new Error("Failed to fetch lead analytics")
  }
}

export async function getAutomationPerformance() {
  const  user  = await onUserInfor()
  const userId = user.data?.clerkId
  if (!userId) redirect("/sign-in")

  try {
    const user = await client.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) throw new Error("User not found")

    const automations = await client.automation.findMany({
      where: { userId: user.id },
      include: {
        leads: {
          select: {
            status: true,
            createdAt: true,
          },
        },
        posts: {
          select: {
            id: true,
          },
        },
        dms: {
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            leads: true,
            posts: true,
            dms: true,
          },
        },
      },
    })

    return automations.map((automation) => {
      const qualifiedLeads = automation.leads.filter((l) => l.status === "QUALIFIED").length
      const convertedLeads = automation.leads.filter((l) => l.status === "CONVERTED").length
      const conversionRate = automation._count.leads > 0 ? (convertedLeads / automation._count.leads) * 100 : 0

      return {
        id: automation.id,
        name: automation.name,
        active: automation.active,
        platform: automation.platform,
        totalLeads: automation._count.leads,
        qualifiedLeads,
        convertedLeads,
        conversionRate: Math.round(conversionRate * 10) / 10,
        postsCount: automation._count.posts,
        dmsCount: automation._count.dms,
        createdAt: automation.createdAt,
      }
    })
  } catch (error) {
    console.error("Error fetching automation performance:", error)
    throw new Error("Failed to fetch automation performance")
  }
}

export async function getIntegrationStats() {
  const  user  = await onUserInfor()
  const userId = user.data?.clerkId
  if (!userId) redirect("/sign-in")

  try {
    const user = await client.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) throw new Error("User not found")

    const integrations = await client.integrations.findMany({
      where: { userId: user.id },
    })

    return integrations.map((integration) => ({
      id: integration.id,
      name: integration.name,
      username: integration.username,
      followersCount: integration.followersCount,
      followingCount: integration.followingCount,
      postsCount: integration.postsCount,
      lastUpdated: integration.lastUpdated,
    }))
  } catch (error) {
    console.error("Error fetching integration stats:", error)
    throw new Error("Failed to fetch integration statistics")
  }
}
