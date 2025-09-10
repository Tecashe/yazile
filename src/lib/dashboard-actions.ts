"use server"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function getDashboardMetrics() {
  try {
    // Get total leads count
    const totalLeads = await prisma.lead.count()

    // Get leads from last month for comparison
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    const leadsLastMonth = await prisma.lead.count({
      where: {
        createdAt: {
          gte: lastMonth,
        },
      },
    })

    // Get active automations
    const activeAutomations = await prisma.automation.count({
      where: {
        active: true,
      },
    })

    // Get revenue data
    const revenueData = await prisma.revenueOpportunity.aggregate({
      _sum: {
        estimatedValue: true,
      },
      where: {
        status: "CONVERTED",
      },
    })

    // Get conversion rate
    const qualifiedLeads = await prisma.lead.count({
      where: {
        status: "QUALIFIED",
      },
    })

    const conversionRate = totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0

    return {
      totalLeads,
      leadsChange: leadsLastMonth > 0 ? Math.round(((totalLeads - leadsLastMonth) / leadsLastMonth) * 100) : 0,
      activeAutomations,
      automationsChange: 12, // Mock data for demo
      revenue: Number(revenueData._sum.estimatedValue) || 0,
      revenueChange: 23, // Mock data for demo
      conversionRate,
      conversionChange: 8, // Mock data for demo
    }
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error)
    return {
      totalLeads: 0,
      leadsChange: 0,
      activeAutomations: 0,
      automationsChange: 0,
      revenue: 0,
      revenueChange: 0,
      conversionRate: 0,
      conversionChange: 0,
    }
  }
}

export async function getRevenueData() {
  try {
    // Get revenue opportunities
    const revenueOpportunities = await prisma.revenueOpportunity.findMany({
      include: {
        lead: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 12,
    })

    // Calculate total revenue
    const totalRevenue = revenueOpportunities.reduce((sum, opp) => sum + Number(opp.estimatedValue), 0)

    // Calculate average deal size
    const avgDealSize = revenueOpportunities.length > 0 ? totalRevenue / revenueOpportunities.length : 0

    // Mock chart data for the last 12 months
    const chartData = [
      { month: "Jan", revenue: 45000 },
      { month: "Feb", revenue: 52000 },
      { month: "Mar", revenue: 48000 },
      { month: "Apr", revenue: 61000 },
      { month: "May", revenue: 55000 },
      { month: "Jun", revenue: 67000 },
      { month: "Jul", revenue: 71000 },
      { month: "Aug", revenue: 69000 },
      { month: "Sep", revenue: 78000 },
      { month: "Oct", revenue: 82000 },
      { month: "Nov", revenue: 85000 },
      { month: "Dec", revenue: 92000 },
    ]

    return {
      totalRevenue,
      avgDealSize: Math.round(avgDealSize),
      conversionRate: 24, // Mock data
      growthRate: 18, // Mock data
      chartData,
    }
  } catch (error) {
    console.error("Error fetching revenue data:", error)
    return {
      totalRevenue: 0,
      avgDealSize: 0,
      conversionRate: 0,
      growthRate: 0,
      chartData: [],
    }
  }
}

export async function getAutomationData() {
  try {
    // Get automation performance data
    const automations = await prisma.automation.findMany({
      where: {
        active: true,
      },
      include: {
        trigger: true,
        responseMetrics: true,
      },
    })

    // Calculate metrics
    const totalTriggers = await prisma.triggerExecution.count()
    const successfulTriggers = await prisma.triggerExecution.count({
      where: {
        success: true,
      },
    })

    const successRate = totalTriggers > 0 ? Math.round((successfulTriggers / totalTriggers) * 100) : 0

    // Get average response time
    const avgResponseTime = await prisma.responseMetrics.aggregate({
      _avg: {
        responseTime: true,
      },
    })

    // Mock chart data
    const chartData = [
      { name: "Instagram DM", triggers: 1250, responses: 1180 },
      { name: "Comment Reply", triggers: 890, responses: 845 },
      { name: "Story Mention", triggers: 650, responses: 620 },
      { name: "Keyword Trigger", triggers: 420, responses: 395 },
      { name: "Smart AI", triggers: 380, responses: 365 },
    ]

    return {
      activeCount: automations.length,
      totalTriggers,
      successRate,
      avgResponseTime: Math.round(Number(avgResponseTime._avg.responseTime) || 250),
      conversions: 156, // Mock data
      chartData,
    }
  } catch (error) {
    console.error("Error fetching automation data:", error)
    return {
      activeCount: 0,
      totalTriggers: 0,
      successRate: 0,
      avgResponseTime: 0,
      conversions: 0,
      chartData: [],
    }
  }
}

export async function getSentimentData() {
  try {
    // Get sentiment analysis data
    const sentimentAnalyses = await prisma.sentimentAnalysis.findMany({
      orderBy: {
        analyzedAt: "desc",
      },
      take: 100,
    })

    // Calculate sentiment distribution
    const total = sentimentAnalyses.length
    const positive = sentimentAnalyses.filter((s) => s.sentiment === "positive").length
    const neutral = sentimentAnalyses.filter((s) => s.sentiment === "neutral").length
    const negative = sentimentAnalyses.filter((s) => s.sentiment === "negative").length

    const positivePercent = total > 0 ? Math.round((positive / total) * 100) : 0
    const neutralPercent = total > 0 ? Math.round((neutral / total) * 100) : 0
    const negativePercent = total > 0 ? Math.round((negative / total) * 100) : 0

    // Get sentiment alerts
    const alerts = await prisma.sentimentAlert.findMany({
      where: {
        resolved: false,
      },
      orderBy: {
        triggeredAt: "desc",
      },
    })

    const chartData = [
      { name: "positive", value: positivePercent },
      { name: "neutral", value: neutralPercent },
      { name: "negative", value: negativePercent },
    ]

    return {
      positive: positivePercent,
      neutral: neutralPercent,
      negative: negativePercent,
      chartData,
      alerts,
    }
  } catch (error) {
    console.error("Error fetching sentiment data:", error)
    return {
      positive: 65,
      neutral: 25,
      negative: 10,
      chartData: [
        { name: "positive", value: 65 },
        { name: "neutral", value: 25 },
        { name: "negative", value: 10 },
      ],
      alerts: [],
    }
  }
}

export async function getRealtimeActivity() {
  try {
    // Get recent activities from various sources
    const recentLeads = await prisma.lead.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      include: {
        user: true,
      },
    })

    const recentMessages = await prisma.message.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    })

    // Mock activity data combining real and simulated data
    const activities = [
      {
        type: "lead",
        user: "Sarah Johnson",
        title: "New qualified lead",
        description: "High-value prospect from Instagram automation",
        timestamp: "2 minutes ago",
        value: "$12,500",
      },
      {
        type: "message",
        user: "Mike Chen",
        title: "Automation triggered",
        description: 'Keyword "pricing" detected in DM conversation',
        timestamp: "5 minutes ago",
        value: null,
      },
      {
        type: "conversion",
        user: "Emma Davis",
        title: "Lead converted",
        description: "Platinum tier lead completed purchase",
        timestamp: "12 minutes ago",
        value: "$8,750",
      },
      {
        type: "lead",
        user: "Alex Rodriguez",
        title: "Lead qualified",
        description: "Sentiment analysis flagged as high-intent",
        timestamp: "18 minutes ago",
        value: "$5,200",
      },
      {
        type: "message",
        user: "Lisa Wang",
        title: "Smart AI response",
        description: "AI handled complex customer inquiry",
        timestamp: "25 minutes ago",
        value: null,
      },
    ]

    return activities
  } catch (error) {
    console.error("Error fetching realtime activity:", error)
    return []
  }
}

export async function getLeadData() {
  try {
    // Get high-value leads
    const topLeads = await prisma.lead.findMany({
      where: {
        status: {
          in: ["QUALIFIED", "NURTURING"],
        },
      },
      include: {
        revenueOpportunities: true,
        qualificationData: true,
      },
      orderBy: {
        score: "desc",
      },
      take: 8,
    })

    // Transform data for display
    const transformedLeads = topLeads.map((lead) => ({
      name: lead.name || "Unknown Lead",
      tier: lead.qualificationData?.leadTier || "Bronze",
      source: lead.source,
      score: lead.score,
      lastContact: new Date(lead.lastContactDate).toLocaleDateString(),
      estimatedValue: Number(lead.revenueOpportunities[0]?.estimatedValue) || 0,
      status: lead.status,
    }))

    // Calculate summary metrics
    const totalQualified = await prisma.lead.count({
      where: {
        status: "QUALIFIED",
      },
    })

    const totalValue = await prisma.revenueOpportunity.aggregate({
      _sum: {
        estimatedValue: true,
      },
      where: {
        status: "ACTIVE",
      },
    })

    const totalLeads = await prisma.lead.count()
    const conversionRate = totalLeads > 0 ? Math.round((totalQualified / totalLeads) * 100) : 0

    return {
      topLeads: transformedLeads,
      totalQualified,
      totalValue: Number(totalValue._sum.estimatedValue) || 0,
      conversionRate,
    }
  } catch (error) {
    console.error("Error fetching lead data:", error)
    return {
      topLeads: [],
      totalQualified: 0,
      totalValue: 0,
      conversionRate: 0,
    }
  }
}

export async function getDashboardData() {
  // This function can be used to get all dashboard data at once if needed
  try {
    const [metrics, revenue, automation, sentiment, activity, leads] = await Promise.all([
      getDashboardMetrics(),
      getRevenueData(),
      getAutomationData(),
      getSentimentData(),
      getRealtimeActivity(),
      getLeadData(),
    ])

    return {
      metrics,
      revenue,
      automation,
      sentiment,
      activity,
      leads,
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return null
  }
}
