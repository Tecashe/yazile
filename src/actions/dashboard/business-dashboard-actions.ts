"use server"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function getBusinessOverviewStats(userId: string) {
  try {
    const [
      totalCampaigns,
      activeCampaigns,
      connectedInfluencers,
      newInfluencersThisMonth,
      totalLeads,
      qualifiedLeads,
      avgEngagementResult,
    ] = await Promise.all([
      prisma.campaign.count({ where: { userId } }),
      prisma.campaign.count({ where: { userId, status: "ACTIVE" } }),
      prisma.campaignInfluencer.count({
        where: { campaign: { userId } },
      }),
      prisma.campaignInfluencer.count({
        where: {
          campaign: { userId },
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      prisma.lead.count({ where: { userId } }),
      prisma.lead.count({ where: { userId, status: "QUALIFIED" } }),
      prisma.campaignInfluencer.aggregate({
        where: { campaign: { userId } },
        // _avg: { performance: true },
      }),
    ])

    const avgEngagementRate = 7.2 // This would be calculated from actual campaign data
    const engagementGrowth = 12.5 // This would be calculated from previous month data

    return {
      totalCampaigns,
      activeCampaigns,
      connectedInfluencers,
      newInfluencersThisMonth,
      totalLeads,
      qualifiedLeads,
      avgEngagementRate,
      engagementGrowth,
    }
  } catch (error) {
    console.error("Error fetching business overview stats:", error)
    return {
      totalCampaigns: 0,
      activeCampaigns: 0,
      connectedInfluencers: 0,
      newInfluencersThisMonth: 0,
      totalLeads: 0,
      qualifiedLeads: 0,
      avgEngagementRate: 0,
      engagementGrowth: 0,
    }
  }
}

export async function getMyCampaigns(userId: string) {
  try {
    return await prisma.campaign.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        influencers: {
          select: { id: true },
        },
      },
    })
  } catch (error) {
    console.error("Error fetching user campaigns:", error)
    return []
  }
}

export async function getMyAutomations(userId: string) {
  try {
    return await prisma.automation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        keywords: {
          select: { id: true },
        },
        posts: {
          select: { id: true },
        },
        leads: {
          select: { id: true },
        },
        messages: {
          select: { id: true },
        },
      },
    })
  } catch (error) {
    console.error("Error fetching user automations:", error)
    return []
  }
}

export async function getMyLeads(userId: string) {
  try {
    return await prisma.lead.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    })
  } catch (error) {
    console.error("Error fetching user leads:", error)
    return []
  }
}

export async function getMyLeadStats(userId: string) {
  try {
    const [total, qualified, converted] = await Promise.all([
      prisma.lead.count({ where: { userId } }),
      prisma.lead.count({ where: { userId, status: "QUALIFIED" } }),
      prisma.lead.count({ where: { userId, status: "CONVERTED" } }),
    ])

    const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0

    return { total, qualified, converted, conversionRate }
  } catch (error) {
    console.error("Error fetching user lead stats:", error)
    return { total: 0, qualified: 0, converted: 0, conversionRate: 0 }
  }
}

export async function getMyInfluencers(userId: string) {
  try {
    // Get influencers from user's campaigns
    const campaignInfluencers = await prisma.campaignInfluencer.findMany({
      where: { campaign: { userId } },
      include: {
        influencer: true,
      },
    })

    // Extract unique influencers
    const uniqueInfluencers = campaignInfluencers.reduce((acc, ci) => {
      if (!acc.find((inf) => inf.id === ci.influencer.id)) {
        acc.push(ci.influencer)
      }
      return acc
    }, [] as any[])

    return uniqueInfluencers
  } catch (error) {
    console.error("Error fetching user influencers:", error)
    return []
  }
}

export async function getMyOpportunities(userId: string) {
  try {
    // Get opportunities from user's businesses
    const userBusinesses = await prisma.business.findMany({
      where: { userId },
      select: { id: true },
    })

    const businessIds = userBusinesses.map((b) => b.id)

    return await prisma.opportunity.findMany({
      where: { businessId: { in: businessIds } },
      orderBy: { createdAt: "desc" },
      include: {
        application: {
          select: { id: true },
        },
      },
    })
  } catch (error) {
    console.error("Error fetching user opportunities:", error)
    return []
  }
}

export async function getMyAnalytics(userId: string) {
  try {
    // These would be calculated from actual data
    const campaignPerformance = 78.5
    const campaignTrend = 12.3
    const leadConversion = 24.7
    const leadTrend = -2.1
    const automationSuccess = 92.4
    const automationTrend = 5.8
    const roi = 3.2
    const roiTrend = 15.6

    // Get top performing campaigns
    const topCampaigns = await prisma.campaign.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        influencers: {
          select: { id: true },
        },
      },
    })

    // Add mock performance data
    const topCampaignsWithPerformance = topCampaigns.map((campaign) => ({
      ...campaign,
      performance: Math.floor(Math.random() * 30) + 70, // Random performance between 70-100
    }))

    const achievements = [
      {
        title: "First Campaign Launched",
        description: "Successfully launched your first influencer campaign",
      },
      {
        title: "100 Leads Generated",
        description: "Reached 100 qualified leads through automations",
      },
      {
        title: "5 Influencers Connected",
        description: "Built relationships with 5 quality influencers",
      },
    ]

    return {
      campaignPerformance,
      campaignTrend,
      leadConversion,
      leadTrend,
      automationSuccess,
      automationTrend,
      roi,
      roiTrend,
      topCampaigns: topCampaignsWithPerformance,
      achievements,
    }
  } catch (error) {
    console.error("Error fetching user analytics:", error)
    return {
      campaignPerformance: 0,
      campaignTrend: 0,
      leadConversion: 0,
      leadTrend: 0,
      automationSuccess: 0,
      automationTrend: 0,
      roi: 0,
      roiTrend: 0,
      topCampaigns: [],
      achievements: [],
    }
  }
}

export async function getMyRecentActivity(userId: string) {
  try {
    return await prisma.auditLog.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
      take: 10,
      include: {
        user: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
      },
    })
  } catch (error) {
    console.error("Error fetching user recent activity:", error)
    return []
  }
}
