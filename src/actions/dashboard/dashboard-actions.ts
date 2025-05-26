"use server"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function getOverviewStats() {
  try {
    const [totalUsers, newUsersThisMonth, activeCampaigns, monthlyRevenue, activeAutomations] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      prisma.campaign.count({
        where: { status: "ACTIVE" },
      }),
      prisma.payment.aggregate({
        where: {
          status: "COMPLETED",
          paymentDate: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        _sum: { amount: true },
      }),
      prisma.automation.count({
        where: { active: true },
      }),
    ])

    // Calculate growth percentages (simplified)
    const campaignGrowth = 12.5 // This would be calculated based on previous month data
    const revenueGrowth = 8.2
    const automationEfficiency = 94.5

    return {
      totalUsers,
      newUsersThisMonth,
      activeCampaigns,
      campaignGrowth,
      monthlyRevenue: monthlyRevenue._sum.amount || 0,
      revenueGrowth,
      activeAutomations,
      automationEfficiency,
    }
  } catch (error) {
    console.error("Error fetching overview stats:", error)
    return {
      totalUsers: 0,
      newUsersThisMonth: 0,
      activeCampaigns: 0,
      campaignGrowth: 0,
      monthlyRevenue: 0,
      revenueGrowth: 0,
      activeAutomations: 0,
      automationEfficiency: 0,
    }
  }
}

export async function getUserStats() {
  try {
    const [total, influencers, businesses, admins] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isInfluencer: true } }),
      prisma.user.count({ where: { isABusiness: true } }),
      prisma.user.count({ where: { isAdmin: true } }),
    ])

    return { total, influencers, businesses, admins }
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return { total: 0, influencers: 0, businesses: 0, admins: 0 }
  }
}

export async function getRecentUsers() {
  try {
    return await prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        isInfluencer: true,
        isABusiness: true,
        isAdmin: true,
        createdAt: true,
      },
    })
  } catch (error) {
    console.error("Error fetching recent users:", error)
    return []
  }
}

export async function getInfluencerStats() {
  try {
    const [total, active, avgEngagementResult, totalEarningsResult] = await Promise.all([
      prisma.influencer.count(),
      prisma.influencer.count({ where: { status: "ACTIVE" } }),
      prisma.influencer.aggregate({
        _avg: { engagementRate: true },
      }),
      prisma.influencerEarnings.aggregate({
        _sum: { amount: true },
      }),
    ])

    return {
      total,
      active,
      avgEngagement: Math.round((avgEngagementResult._avg.engagementRate || 0) * 100) / 100,
      totalEarnings: totalEarningsResult._sum.amount || 0,
    }
  } catch (error) {
    console.error("Error fetching influencer stats:", error)
    return { total: 0, active: 0, avgEngagement: 0, totalEarnings: 0 }
  }
}

export async function getTopInfluencers() {
  try {
    return await prisma.influencer.findMany({
      take: 10,
      orderBy: [{ engagementRate: "desc" }, { followers: "desc" }],
      select: {
        id: true,
        name: true,
        username: true,
        profilePicture: true,
        followers: true,
        engagementRate: true,
        status: true,
      },
    })
  } catch (error) {
    console.error("Error fetching top influencers:", error)
    return []
  }
}

export async function getCampaignStats() {
  try {
    const [total, active, completed, totalBudgetResult] = await Promise.all([
      prisma.campaign.count(),
      prisma.campaign.count({ where: { status: "ACTIVE" } }),
      prisma.campaign.count({ where: { status: "COMPLETED" } }),
      prisma.campaign.aggregate({
        _sum: { budget: true },
      }),
    ])

    return {
      total,
      active,
      completed,
      totalBudget: totalBudgetResult._sum.budget || 0,
    }
  } catch (error) {
    console.error("Error fetching campaign stats:", error)
    return { total: 0, active: 0, completed: 0, totalBudget: 0 }
  }
}

export async function getRecentCampaigns() {
  try {
    return await prisma.campaign.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        budget: true,
        status: true,
        influencers: {
          select: { id: true },
        },
      },
    })
  } catch (error) {
    console.error("Error fetching recent campaigns:", error)
    return []
  }
}

export async function getLeadStats() {
  try {
    const [total, qualified, converted, avgScoreResult] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: "QUALIFIED" } }),
      prisma.lead.count({ where: { status: "CONVERTED" } }),
      prisma.lead.aggregate({
        _avg: { score: true },
      }),
    ])

    const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0

    return {
      total,
      qualified,
      conversionRate,
      avgScore: Math.round(avgScoreResult._avg.score || 0),
    }
  } catch (error) {
    console.error("Error fetching lead stats:", error)
    return { total: 0, qualified: 0, conversionRate: 0, avgScore: 0 }
  }
}

export async function getRecentLeads() {
  try {
    return await prisma.lead.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        score: true,
        status: true,
        source: true,
      },
    })
  } catch (error) {
    console.error("Error fetching recent leads:", error)
    return []
  }
}

export async function getAutomationStats() {
  try {
    const [total, active, messagesResult, postsResult] = await Promise.all([
      prisma.automation.count(),
      prisma.automation.count({ where: { active: true } }),
      prisma.message.count(),
      prisma.post.count(),
    ])

    // Calculate success rate (simplified)
    const successRate = 92.5 // This would be calculated based on actual success/failure data

    return {
      total,
      active,
      successRate,
      messagesSent: messagesResult,
    }
  } catch (error) {
    console.error("Error fetching automation stats:", error)
    return { total: 0, active: 0, successRate: 0, messagesSent: 0 }
  }
}

export async function getActiveAutomations() {
  try {
    return await prisma.automation.findMany({
      where: { active: true },
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        platform: true,
        active: true,
        keywords: {
          select: { id: true },
        },
        posts: {
          select: { id: true },
        },
        leads: {
          select: { id: true },
        },
      },
    })
  } catch (error) {
    console.error("Error fetching active automations:", error)
    return []
  }
}

export async function getRevenueStats() {
  try {
    const [monthlyRevenueResult, totalRevenueResult, activeSubscriptions, pendingInvoices] = await Promise.all([
      prisma.payment.aggregate({
        where: {
          status: "COMPLETED",
          paymentDate: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: { status: "COMPLETED" },
        _sum: { amount: true },
      }),
      prisma.subscription.count({
        where: { status: "ACTIVE" },
      }),
      prisma.invoice.count({
        where: { status: "SENT" },
      }),
    ])

    return {
      monthlyRevenue: monthlyRevenueResult._sum.amount || 0,
      totalRevenue: totalRevenueResult._sum.amount || 0,
      activeSubscriptions,
      pendingInvoices,
    }
  } catch (error) {
    console.error("Error fetching revenue stats:", error)
    return { monthlyRevenue: 0, totalRevenue: 0, activeSubscriptions: 0, pendingInvoices: 0 }
  }
}

export async function getRecentPayments() {
  try {
    return await prisma.payment.findMany({
      take: 10,
      orderBy: { paymentDate: "desc" },
      select: {
        id: true,
        amount: true,
        status: true,
        paymentMethod: true,
        invoice: {
          select: {
            invoiceNumber: true,
          },
        },
        user: {
          select: {
            email: true,
          },
        },
      },
    })
  } catch (error) {
    console.error("Error fetching recent payments:", error)
    return []
  }
}

export async function getRecentActivity() {
  try {
    return await prisma.auditLog.findMany({
      take: 10,
      orderBy: { timestamp: "desc" },
      select: {
        id: true,
        action: true,
        target: true,
        timestamp: true,
        user: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
      },
    })
  } catch (error) {
    console.error("Error fetching recent activity:", error)
    return []
  }
}
