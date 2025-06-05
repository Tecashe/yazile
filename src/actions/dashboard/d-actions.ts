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




export async function getEnhancedDashboardStats() {
  const user = await onUserInfor()
  const userId = user.data?.clerkId
  if (!userId) redirect("/sign-in")

  try {
    const user = await client.user.findUnique({
      where: { clerkId: userId },
      include: {
        automations: {
          include: {
            leads: true,
            posts: true,
            dms: true,
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

    // Time periods for analysis
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

    // Basic stats
    const totalAutomations = user.automations.length
    const activeAutomations = user.automations.filter((a) => a.active).length
    const totalLeads = user.leads.length
    const qualifiedLeads = user.leads.filter((l) => l.status === "QUALIFIED").length
    const convertedLeads = user.leads.filter((l) => l.status === "CONVERTED").length

    // Time-based lead analysis
    const leadsLast30Days = user.leads.filter((l) => l.createdAt >= thirtyDaysAgo).length
    const leadsLast60Days = user.leads.filter((l) => l.createdAt >= sixtyDaysAgo && l.createdAt < thirtyDaysAgo).length
    const leadGrowthRate = leadsLast60Days > 0 ? ((leadsLast30Days - leadsLast60Days) / leadsLast60Days) * 100 : 0

    // Conversion metrics
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0
    const qualificationRate = totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0

    // Automation efficiency
    const avgLeadsPerAutomation = activeAutomations > 0 ? totalLeads / activeAutomations : 0
    const avgConversionsPerAutomation = activeAutomations > 0 ? convertedLeads / activeAutomations : 0

    // Lead velocity (average time to conversion)
    const convertedLeadsWithDates = user.leads.filter((l) => l.status === "CONVERTED" && l.convertedDate)
    const avgTimeToConversion =
      convertedLeadsWithDates.length > 0
        ? convertedLeadsWithDates.reduce((sum, lead) => {
            const days = Math.floor((lead.convertedDate!.getTime() - lead.createdAt.getTime()) / (1000 * 60 * 60 * 24))
            return sum + days
          }, 0) / convertedLeadsWithDates.length
        : 0

    return {
      // Basic metrics
      totalAutomations,
      activeAutomations,
      totalLeads,
      qualifiedLeads,
      convertedLeads,
      conversionRate: Math.round(conversionRate * 10) / 10,
      qualificationRate: Math.round(qualificationRate * 10) / 10,

      // Growth metrics
      leadsLast30Days,
      leadGrowthRate: Math.round(leadGrowthRate * 10) / 10,

      // Efficiency metrics
      avgLeadsPerAutomation: Math.round(avgLeadsPerAutomation * 10) / 10,
      avgConversionsPerAutomation: Math.round(avgConversionsPerAutomation * 10) / 10,
      avgTimeToConversion: Math.round(avgTimeToConversion * 10) / 10,

      // Platform data
      integrations: user.integrations.length,
      subscription: user.subscription?.plan || "FREE",
      businesses: user.businesses.length,
    }
  } catch (error) {
    console.error("Error fetching enhanced dashboard stats:", error)
    throw new Error("Failed to fetch enhanced dashboard statistics")
  }
}

// Lead funnel analytics
export async function getLeadFunnelAnalytics() {
  const user = await onUserInfor()
  const userId = user.data?.clerkId
  if (!userId) redirect("/sign-in")

  try {
    const user = await client.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) throw new Error("User not found")

    // Get leads by status for funnel
    const leadsByStatus = await client.lead.groupBy({
      by: ["status"],
      where: { userId: user.id },
      _count: {
        id: true,
      },
    })

    // Calculate funnel conversion rates
    const statusOrder = ["NEW", "QUALIFYING", "QUALIFIED", "NURTURING", "CONVERTED"]
    const funnelData = statusOrder.map((status) => {
      const statusData = leadsByStatus.find((item) => item.status === status)
      return {
        status,
        count: statusData?._count.id || 0,
        percentage: 0, // Will calculate below
      }
    })

    // Calculate conversion percentages
    const totalLeads = funnelData.reduce((sum, item) => sum + item.count, 0)
    funnelData.forEach((item) => {
      item.percentage = totalLeads > 0 ? Math.round((item.count / totalLeads) * 100) : 0
    })

    return funnelData
  } catch (error) {
    console.error("Error fetching lead funnel analytics:", error)
    throw new Error("Failed to fetch lead funnel analytics")
  }
}

// Time-based performance analytics
export async function getTimeBasedAnalytics() {
  const user = await onUserInfor()
  const userId = user.data?.clerkId
  if (!userId) redirect("/sign-in")

  try {
    const user = await client.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) throw new Error("User not found")

    // Get leads for the last 90 days
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

    const leads = await client.lead.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: ninetyDaysAgo,
        },
      },
      select: {
        createdAt: true,
        status: true,
        convertedDate: true,
      },
    })

    // Group by week
    const weeklyData = leads.reduce(
      (acc, lead) => {
        const weekStart = new Date(lead.createdAt)
        weekStart.setDate(weekStart.getDate() - weekStart.getDay()) // Start of week
        const weekKey = weekStart.toISOString().split("T")[0]

        if (!acc[weekKey]) {
          acc[weekKey] = {
            week: weekKey,
            newLeads: 0,
            conversions: 0,
            conversionRate: 0,
          }
        }

        acc[weekKey].newLeads++
        if (lead.status === "CONVERTED") {
          acc[weekKey].conversions++
        }

        return acc
      },
      {} as Record<string, any>,
    )

    // Calculate conversion rates and format data
    const timeSeriesData = Object.values(weeklyData)
      .map((week: any) => ({
        ...week,
        conversionRate: week.newLeads > 0 ? Math.round((week.conversions / week.newLeads) * 100) : 0,
      }))
      .sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime())

    return timeSeriesData
  } catch (error) {
    console.error("Error fetching time-based analytics:", error)
    throw new Error("Failed to fetch time-based analytics")
  }
}

// Platform performance comparison
export async function getPlatformPerformance() {
  const user = await onUserInfor()
  const userId = user.data?.clerkId
  if (!userId) redirect("/sign-in")

  try {
    const user = await client.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) throw new Error("User not found")

    // Get automation performance by platform
    const automations = await client.automation.findMany({
      where: { userId: user.id },
      include: {
        leads: {
          select: {
            status: true,
          },
        },
        posts: {
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

    // Group by platform
    const platformData = automations.reduce(
      (acc, automation) => {
        const platform = automation.platform
        if (!acc[platform]) {
          acc[platform] = {
            platform,
            automations: 0,
            activeAutomations: 0,
            totalLeads: 0,
            conversions: 0,
            posts: 0,
            dms: 0,
            conversionRate: 0,
            avgLeadsPerAutomation: 0,
          }
        }

        acc[platform].automations++
        if (automation.active) acc[platform].activeAutomations++
        acc[platform].totalLeads += automation._count.leads
        acc[platform].posts += automation._count.posts
        acc[platform].dms += automation._count.dms
        acc[platform].conversions += automation.leads.filter((l) => l.status === "CONVERTED").length

        return acc
      },
      {} as Record<string, any>,
    )

    // Calculate rates
    Object.values(platformData).forEach((platform: any) => {
      platform.conversionRate =
        platform.totalLeads > 0 ? Math.round((platform.conversions / platform.totalLeads) * 100) : 0
      platform.avgLeadsPerAutomation =
        platform.automations > 0 ? Math.round((platform.totalLeads / platform.automations) * 10) / 10 : 0
    })

    return Object.values(platformData)
  } catch (error) {
    console.error("Error fetching platform performance:", error)
    throw new Error("Failed to fetch platform performance")
  }
}

// Lead source analytics
export async function getLeadSourceAnalytics() {
  const user = await onUserInfor()
  const userId = user.data?.clerkId
  if (!userId) redirect("/sign-in")

  try {
    const user = await client.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) throw new Error("User not found")

    // Get leads by source with conversion data
    const leadsBySource = await client.lead.groupBy({
      by: ["source"],
      where: { userId: user.id },
      _count: {
        id: true,
      },
    })

    // Get conversion data by source
    const conversionsBySource = await client.lead.groupBy({
      by: ["source"],
      where: {
        userId: user.id,
        status: "CONVERTED",
      },
      _count: {
        id: true,
      },
    })

    // Combine data
    const sourceAnalytics = leadsBySource.map((source) => {
      const conversions = conversionsBySource.find((c) => c.source === source.source)?._count.id || 0
      const conversionRate = source._count.id > 0 ? Math.round((conversions / source._count.id) * 100) : 0

      return {
        source: source.source,
        totalLeads: source._count.id,
        conversions,
        conversionRate,
        value: source._count.id, // For pie chart
      }
    })

    return sourceAnalytics
  } catch (error) {
    console.error("Error fetching lead source analytics:", error)
    throw new Error("Failed to fetch lead source analytics")
  }
}

// Engagement metrics
export async function getEngagementMetrics() {
  const user = await onUserInfor()
  const userId = user.data?.clerkId
  if (!userId) redirect("/sign-in")

  try {
    const user = await client.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) throw new Error("User not found")

    // Get total interactions
    const totalInteractions = await client.leadInteraction.count({
      where: {
        lead: {
          userId: user.id,
        },
      },
    })

    // Get interactions by type
    const interactionsByType = await client.leadInteraction.groupBy({
      by: ["type"],
      where: {
        lead: {
          userId: user.id,
        },
      },
      _count: {
        id: true,
      },
    })

    // Get recent engagement trends (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentInteractions = await client.leadInteraction.findMany({
      where: {
        lead: {
          userId: user.id,
        },
        timestamp: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        timestamp: true,
        type: true,
      },
    })

    // Group by day for trend analysis
    const dailyEngagement = recentInteractions.reduce(
      (acc, interaction) => {
        const day = interaction.timestamp.toISOString().split("T")[0]
        if (!acc[day]) {
          acc[day] = { date: day, interactions: 0 }
        }
        acc[day].interactions++
        return acc
      },
      {} as Record<string, any>,
    )

    const engagementTrend = Object.values(dailyEngagement).sort(
      (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )

    return {
      totalInteractions,
      interactionsByType: interactionsByType.map((item) => ({
        type: item.type,
        count: item._count.id,
        percentage: totalInteractions > 0 ? Math.round((item._count.id / totalInteractions) * 100) : 0,
      })),
      engagementTrend,
    }
  } catch (error) {
    console.error("Error fetching engagement metrics:", error)
    throw new Error("Failed to fetch engagement metrics")
  }
}

// ROI and business impact metrics
export async function getBusinessImpactMetrics() {
  const user = await onUserInfor()
  const userId = user.data?.clerkId
  if (!userId) redirect("/sign-in")

  try {
    const user = await client.user.findUnique({
      where: { clerkId: userId },
      include: {
        subscription: true,
        automations: {
          include: {
            leads: true,
          },
        },
      },
    })

    if (!user) throw new Error("User not found")

    // Calculate estimated value metrics
    const avgLeadValue = 100 // This could be configurable per business
    const totalLeadValue = user.automations.reduce((sum, automation) => {
      return sum + automation.leads.filter((l) => l.status === "CONVERTED").length * avgLeadValue
    }, 0)

    // Calculate cost (subscription cost)
    const subscriptionCost = user.subscription?.plan === "PRO" ? 99 : 0 // Monthly cost
    const monthlyCost = subscriptionCost

    // Calculate ROI
    const monthlyROI = monthlyCost > 0 ? ((totalLeadValue - monthlyCost) / monthlyCost) * 100 : 0

    // Time savings calculation (estimated)
    const automatedInteractions = await client.dms.count({
      where: {
        Automation: {
          userId: user.id,
        },
      },
    })

    const estimatedTimeSaved = automatedInteractions * 2 // 2 minutes per interaction
    const timeSavedHours = Math.round(estimatedTimeSaved / 60)

    return {
      totalLeadValue,
      monthlyCost,
      monthlyROI: Math.round(monthlyROI),
      timeSavedHours,
      automatedInteractions,
      avgLeadValue,
      costPerLead:
        user.automations.reduce((sum, a) => sum + a.leads.length, 0) > 0
          ? Math.round(monthlyCost / user.automations.reduce((sum, a) => sum + a.leads.length, 0))
          : 0,
    }
  } catch (error) {
    console.error("Error fetching business impact metrics:", error)
    throw new Error("Failed to fetch business impact metrics")
  }
}
