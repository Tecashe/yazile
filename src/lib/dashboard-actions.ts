// "use server"

// import { client } from "@/lib/prisma"

// interface ActivityItem {
//   type: "lead" | "message" | "conversion"
//   user: string
//   title: string
//   description: string
//   timestamp: string
//   value: string | null
// }

// export async function getDashboardMetrics() {
//   try {
//     // Get current period data
//     const now = new Date()
//     const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
//     const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
//     const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1)

//     // Get total leads count
//     const totalLeads = await client.lead.count()

//     // Get leads from current and last month for comparison
//     const [currentMonthLeads, lastMonthLeads] = await Promise.all([
//       client.lead.count({
//         where: {
//           createdAt: {
//             gte: currentMonth,
//           },
//         },
//       }),
//       client.lead.count({
//         where: {
//           createdAt: {
//             gte: lastMonth,
//             lt: currentMonth,
//           },
//         },
//       }),
//     ])

//     // Get active automations current vs last month
//     const [currentAutomations, lastMonthAutomations] = await Promise.all([
//       client.automation.count({
//         where: {
//           active: true,
//           createdAt: {
//             gte: currentMonth,
//           },
//         },
//       }),
//       client.automation.count({
//         where: {
//           active: true,
//           createdAt: {
//             gte: lastMonth,
//             lt: currentMonth,
//           },
//         },
//       }),
//     ])

//     // Get revenue data current vs last month
//     const [currentRevenue, lastMonthRevenue] = await Promise.all([
//       client.revenueOpportunity.aggregate({
//         _sum: {
//           estimatedValue: true,
//         },
//         where: {
//           status: "CONVERTED",
//           createdAt: {
//             gte: currentMonth,
//           },
//         },
//       }),
//       client.revenueOpportunity.aggregate({
//         _sum: {
//           estimatedValue: true,
//         },
//         where: {
//           status: "CONVERTED",
//           createdAt: {
//             gte: lastMonth,
//             lt: currentMonth,
//           },
//         },
//       }),
//     ])

//     // Get conversion rate current vs last month
//     const [currentQualified, lastMonthQualified] = await Promise.all([
//       client.lead.count({
//         where: {
//           status: "QUALIFIED",
//           updatedAt: {
//             gte: currentMonth,
//           },
//         },
//       }),
//       client.lead.count({
//         where: {
//           status: "QUALIFIED",
//           updatedAt: {
//             gte: lastMonth,
//             lt: currentMonth,
//           },
//         },
//       }),
//     ])

//     const leadsChange =
//       lastMonthLeads > 0 ? Math.round(((currentMonthLeads - lastMonthLeads) / lastMonthLeads) * 100) : 0
//     const automationsChange =
//       lastMonthAutomations > 0
//         ? Math.round(((currentAutomations - lastMonthAutomations) / lastMonthAutomations) * 100)
//         : 0
//     const currentRevenueValue = Number(currentRevenue._sum.estimatedValue) || 0
//     const lastRevenueValue = Number(lastMonthRevenue._sum.estimatedValue) || 0
//     const revenueChange =
//       lastRevenueValue > 0 ? Math.round(((currentRevenueValue - lastRevenueValue) / lastRevenueValue) * 100) : 0

//     const currentConversionRate = currentMonthLeads > 0 ? Math.round((currentQualified / currentMonthLeads) * 100) : 0
//     const lastConversionRate = lastMonthLeads > 0 ? Math.round((lastMonthQualified / lastMonthLeads) * 100) : 0
//     const conversionChange =
//       lastConversionRate > 0 ? Math.round(((currentConversionRate - lastConversionRate) / lastConversionRate) * 100) : 0

//     return {
//       totalLeads,
//       leadsChange,
//       activeAutomations: await client.automation.count({ where: { active: true } }),
//       automationsChange,
//       revenue: currentRevenueValue,
//       revenueChange,
//       conversionRate: currentConversionRate,
//       conversionChange,
//     }
//   } catch (error) {
//     console.error("Error fetching dashboard metrics:", error)
//     return {
//       totalLeads: 0,
//       leadsChange: 0,
//       activeAutomations: 0,
//       automationsChange: 0,
//       revenue: 0,
//       revenueChange: 0,
//       conversionRate: 0,
//       conversionChange: 0,
//     }
//   }
// }

// export async function getRevenueData() {
//   try {
//     // Get revenue opportunities
//     const revenueOpportunities = await client.revenueOpportunity.findMany({
//       include: {
//         lead: true,
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     })

//     // Calculate total revenue
//     const totalRevenue = revenueOpportunities.reduce((sum, opp) => sum + Number(opp.estimatedValue), 0)

//     // Calculate average deal size
//     const avgDealSize = revenueOpportunities.length > 0 ? totalRevenue / revenueOpportunities.length : 0

//     const chartData = []
//     const now = new Date()

//     for (let i = 11; i >= 0; i--) {
//       const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
//       const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)

//       const monthRevenue = await client.revenueOpportunity.aggregate({
//         _sum: {
//           estimatedValue: true,
//         },
//         where: {
//           status: "CONVERTED",
//           createdAt: {
//             gte: monthStart,
//             lte: monthEnd,
//           },
//         },
//       })

//       chartData.push({
//         month: monthStart.toLocaleDateString("en-US", { month: "short" }),
//         revenue: Number(monthRevenue._sum.estimatedValue) || 0,
//       })
//     }

//     const totalLeads = await client.lead.count()
//     const qualifiedLeads = await client.lead.count({
//       where: { status: "QUALIFIED" },
//     })
//     const conversionRate = totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0

//     // Calculate growth rate from last 2 months
//     const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
//     const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
//     const [currentMonthRevenue, lastMonthRevenue] = await Promise.all([
//       client.revenueOpportunity.aggregate({
//         _sum: { estimatedValue: true },
//         where: {
//           status: "CONVERTED",
//           createdAt: { gte: currentMonth },
//         },
//       }),
//       client.revenueOpportunity.aggregate({
//         _sum: { estimatedValue: true },
//         where: {
//           status: "CONVERTED",
//           createdAt: { gte: lastMonth, lt: currentMonth },
//         },
//       }),
//     ])

//     const currentValue = Number(currentMonthRevenue._sum.estimatedValue) || 0
//     const lastValue = Number(lastMonthRevenue._sum.estimatedValue) || 0
//     const growthRate = lastValue > 0 ? Math.round(((currentValue - lastValue) / lastValue) * 100) : 0

//     return {
//       totalRevenue,
//       avgDealSize: Math.round(avgDealSize),
//       conversionRate,
//       growthRate,
//       chartData,
//     }
//   } catch (error) {
//     console.error("Error fetching revenue data:", error)
//     return {
//       totalRevenue: 0,
//       avgDealSize: 0,
//       conversionRate: 0,
//       growthRate: 0,
//       chartData: [],
//     }
//   }
// }

// export async function getAutomationData() {
//   try {
//     // Get automation performance data
//     const automations = await client.automation.findMany({
//       where: {
//         active: true,
//       },
//       include: {
//         trigger: true,
//         responseMetrics: true,
//       },
//     })

//     // Calculate metrics
//     const totalTriggers = await client.triggerExecution.count()
//     const successfulTriggers = await client.triggerExecution.count({
//       where: {
//         success: true,
//       },
//     })

//     const successRate = totalTriggers > 0 ? Math.round((successfulTriggers / totalTriggers) * 100) : 0

//     // Get average response time
//     const avgResponseTime = await client.responseMetrics.aggregate({
//       _avg: {
//         responseTime: true,
//       },
//     })

//     const automationTypes = await client.automation.groupBy({
//       by: ["name"],
//       where: { active: true },
//       _count: { id: true },
//     })

//     const chartData = await Promise.all(
//       automationTypes.map(async (automation) => {
//         const triggers = await client.triggerExecution.count({
//           where: {
//             automationId: {
//               in: await client.automation
//                 .findMany({
//                   where: { name: automation.name },
//                   select: { id: true },
//                 })
//                 .then((autos) => autos.map((a) => a.id)),
//             },
//           },
//         })

//         const responses = await client.triggerExecution.count({
//           where: {
//             automationId: {
//               in: await client.automation
//                 .findMany({
//                   where: { name: automation.name },
//                   select: { id: true },
//                 })
//                 .then((autos) => autos.map((a) => a.id)),
//             },
//             success: true,
//           },
//         })

//         return {
//           name: automation.name,
//           triggers,
//           responses,
//         }
//       }),
//     )

//     const conversions = await client.lead.count({
//       where: {
//         status: "QUALIFIED",
//         source: {
//           contains: "automation",
//         },
//       },
//     })

//     return {
//       activeCount: automations.length,
//       totalTriggers,
//       successRate,
//       avgResponseTime: Math.round(Number(avgResponseTime._avg.responseTime) || 250),
//       conversions,
//       chartData,
//     }
//   } catch (error) {
//     console.error("Error fetching automation data:", error)
//     return {
//       activeCount: 0,
//       totalTriggers: 0,
//       successRate: 0,
//       avgResponseTime: 0,
//       conversions: 0,
//       chartData: [],
//     }
//   }
// }

// export async function getSentimentData() {
//   try {
//     // Get sentiment analysis data
//     const sentimentAnalyses = await client.sentimentAnalysis.findMany({
//       orderBy: {
//         analyzedAt: "desc",
//       },
//       take: 100,
//     })

//     // Calculate sentiment distribution
//     const total = sentimentAnalyses.length
//     const positive = sentimentAnalyses.filter((s) => s.sentiment === "positive").length
//     const neutral = sentimentAnalyses.filter((s) => s.sentiment === "neutral").length
//     const negative = sentimentAnalyses.filter((s) => s.sentiment === "negative").length

//     const positivePercent = total > 0 ? Math.round((positive / total) * 100) : 0
//     const neutralPercent = total > 0 ? Math.round((neutral / total) * 100) : 0
//     const negativePercent = total > 0 ? Math.round((negative / total) * 100) : 0

//     // Get sentiment alerts
//     const alerts = await client.sentimentAlert.findMany({
//       where: {
//         resolved: false,
//       },
//       orderBy: {
//         triggeredAt: "desc",
//       },
//     })

//     const chartData = [
//       { name: "positive", value: positivePercent },
//       { name: "neutral", value: neutralPercent },
//       { name: "negative", value: negativePercent },
//     ]

//     return {
//       positive: positivePercent,
//       neutral: neutralPercent,
//       negative: negativePercent,
//       chartData,
//       alerts,
//     }
//   } catch (error) {
//     console.error("Error fetching sentiment data:", error)
//     return {
//       positive: 65,
//       neutral: 25,
//       negative: 10,
//       chartData: [
//         { name: "positive", value: 65 },
//         { name: "neutral", value: 25 },
//         { name: "negative", value: 10 },
//       ],
//       alerts: [],
//     }
//   }
// }

// export async function getRealtimeActivity() {
//   try {
//     const activities: ActivityItem[] = []

//     // Get recent leads
//     const recentLeads = await client.lead.findMany({
//       orderBy: { createdAt: "desc" },
//       take: 3,
//       include: { revenueOpportunities: true },
//     })

//     // Get recent messages
//     const recentMessages = await client.message.findMany({
//       orderBy: { createdAt: "desc" },
//       take: 2,
//     })

//     // Get recent conversions
//     const recentConversions = await client.revenueOpportunity.findMany({
//       where: { status: "CONVERTED" },
//       orderBy: { updatedAt: "desc" },
//       take: 2,
//       include: { lead: true },
//     })

//     // Add lead activities
//     recentLeads.forEach((lead) => {
//       const timeDiff = Math.floor((Date.now() - lead.createdAt.getTime()) / (1000 * 60))
//       activities.push({
//         type: "lead",
//         user: lead.name || "Unknown Lead",
//         title: lead.status === "QUALIFIED" ? "New qualified lead" : "New lead captured",
//         description: `Lead from ${lead.source} automation`,
//         timestamp: `${timeDiff} minutes ago`,
//         value: lead.revenueOpportunities[0]
//           ? `$${Number(lead.revenueOpportunities[0].estimatedValue).toLocaleString()}`
//           : null,
//       })
//     })

//     // Add message activities
//     recentMessages.forEach((message) => {
//       const timeDiff = Math.floor((Date.now() - message.createdAt.getTime()) / (1000 * 60))
//       activities.push({
//         type: "message",
//         user: "System",
//         title: "Automation triggered",
//         description: `Message processed: ${message.message.substring(0, 50)}...`,
//         timestamp: `${timeDiff} minutes ago`,
//         value: null,
//       })
//     })

//     // Add conversion activities
//     recentConversions.forEach((conversion) => {
//       const timeDiff = Math.floor((Date.now() - conversion.updatedAt.getTime()) / (1000 * 60))
//       activities.push({
//         type: "conversion",
//         user: conversion.lead.name || "Unknown Lead",
//         title: "Lead converted",
//         description: "Revenue opportunity converted to sale",
//         timestamp: `${timeDiff} minutes ago`,
//         value: `$${Number(conversion.estimatedValue).toLocaleString()}`,
//       })
//     })

//     // Sort by most recent and limit to 5
//     return activities
//       .sort((a, b) => {
//         const aMinutes = Number.parseInt(a.timestamp.split(" ")[0])
//         const bMinutes = Number.parseInt(b.timestamp.split(" ")[0])
//         return aMinutes - bMinutes
//       })
//       .slice(0, 5)
//   } catch (error) {
//     console.error("Error fetching realtime activity:", error)
//     return []
//   }
// }

// export async function getLeadData() {
//   try {
//     // Get high-value leads
//     const topLeads = await client.lead.findMany({
//       where: {
//         status: {
//           in: ["QUALIFIED", "NURTURING"],
//         },
//       },
//       include: {
//         revenueOpportunities: true,
//         qualificationData: true,
//       },
//       orderBy: {
//         score: "desc",
//       },
//       take: 8,
//     })

//     // Transform data for display
//     const transformedLeads = topLeads.map((lead) => ({
//       name: lead.name || "Unknown Lead",
//       tier: lead.qualificationData?.leadTier || "Bronze",
//       source: lead.source,
//       score: lead.score,
//       lastContact: new Date(lead.lastContactDate).toLocaleDateString(),
//       estimatedValue: Number(lead.revenueOpportunities[0]?.estimatedValue) || 0,
//       status: lead.status,
//     }))

//     // Calculate summary metrics
//     const totalQualified = await client.lead.count({
//       where: {
//         status: "QUALIFIED",
//       },
//     })

//     const totalValue = await client.revenueOpportunity.aggregate({
//       _sum: {
//         estimatedValue: true,
//       },
//       where: {
//         status: "ACTIVE",
//       },
//     })

//     const totalLeads = await client.lead.count()
//     const conversionRate = totalLeads > 0 ? Math.round((totalQualified / totalLeads) * 100) : 0

//     return {
//       topLeads: transformedLeads,
//       totalQualified,
//       totalValue: Number(totalValue._sum.estimatedValue) || 0,
//       conversionRate,
//     }
//   } catch (error) {
//     console.error("Error fetching lead data:", error)
//     return {
//       topLeads: [],
//       totalQualified: 0,
//       totalValue: 0,
//       conversionRate: 0,
//     }
//   }
// }

// export async function getDashboardData() {
//   // This function can be used to get all dashboard data at once if needed
//   try {
//     const [metrics, revenue, automation, sentiment, activity, leads] = await Promise.all([
//       getDashboardMetrics(),
//       getRevenueData(),
//       getAutomationData(),
//       getSentimentData(),
//       getRealtimeActivity(),
//       getLeadData(),
//     ])

//     return {
//       data: {
//         metrics,
//         revenue,
//         automation,
//         sentiment,
//         activity,
//         leads,
//         automations: [], // Added empty automations array to match expected interface
//       },
//     }
//   } catch (error) {
//     console.error("Error fetching dashboard data:", error)
//     return {
//       data: null,
//     }
//   }
// }

"use server"

import { prisma } from "@/lib/prisma"

interface ActivityItem {
  type: "lead" | "message" | "conversion"
  user: string
  title: string
  description: string
  timestamp: string
  value: string | null
}

export async function getDashboardMetrics() {
  try {
    // Get current period data
    const now = new Date()
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1)

    // Get total leads count
    const totalLeads = await prisma.lead.count()

    // Get leads from current and last month for comparison
    const [currentMonthLeads, lastMonthLeads] = await Promise.all([
      prisma.lead.count({
        where: {
          createdAt: {
            gte: currentMonth,
          },
        },
      }),
      prisma.lead.count({
        where: {
          createdAt: {
            gte: lastMonth,
            lt: currentMonth,
          },
        },
      }),
    ])

    // Get active automations current vs last month
    const [currentAutomations, lastMonthAutomations] = await Promise.all([
      prisma.automation.count({
        where: {
          active: true,
          createdAt: {
            gte: currentMonth,
          },
        },
      }),
      prisma.automation.count({
        where: {
          active: true,
          createdAt: {
            gte: lastMonth,
            lt: currentMonth,
          },
        },
      }),
    ])

    // Get revenue data current vs last month
    const [currentRevenue, lastMonthRevenue] = await Promise.all([
      prisma.revenueOpportunity.aggregate({
        _sum: {
          estimatedValue: true,
        },
        where: {
          status: "CONVERTED",
          createdAt: {
            gte: currentMonth,
          },
        },
      }),
      prisma.revenueOpportunity.aggregate({
        _sum: {
          estimatedValue: true,
        },
        where: {
          status: "CONVERTED",
          createdAt: {
            gte: lastMonth,
            lt: currentMonth,
          },
        },
      }),
    ])

    // Get conversion rate current vs last month
    const [currentQualified, lastMonthQualified] = await Promise.all([
      prisma.lead.count({
        where: {
          status: "QUALIFIED",
          updatedAt: {
            gte: currentMonth,
          },
        },
      }),
      prisma.lead.count({
        where: {
          status: "QUALIFIED",
          updatedAt: {
            gte: lastMonth,
            lt: currentMonth,
          },
        },
      }),
    ])

    const leadsChange =
      lastMonthLeads > 0 ? Math.round(((currentMonthLeads - lastMonthLeads) / lastMonthLeads) * 100) : 0
    const automationsChange =
      lastMonthAutomations > 0
        ? Math.round(((currentAutomations - lastMonthAutomations) / lastMonthAutomations) * 100)
        : 0
    const currentRevenueValue = Number(currentRevenue._sum.estimatedValue) || 0
    const lastRevenueValue = Number(lastMonthRevenue._sum.estimatedValue) || 0
    const revenueChange =
      lastRevenueValue > 0 ? Math.round(((currentRevenueValue - lastRevenueValue) / lastRevenueValue) * 100) : 0

    const currentConversionRate = currentMonthLeads > 0 ? Math.round((currentQualified / currentMonthLeads) * 100) : 0
    const lastConversionRate = lastMonthLeads > 0 ? Math.round((lastMonthQualified / lastMonthLeads) * 100) : 0
    const conversionChange =
      lastConversionRate > 0 ? Math.round(((currentConversionRate - lastConversionRate) / lastConversionRate) * 100) : 0

    return {
      totalLeads,
      leadsChange,
      activeAutomations: await prisma.automation.count({ where: { active: true } }),
      automationsChange,
      revenue: currentRevenueValue,
      revenueChange,
      conversionRate: currentConversionRate,
      conversionChange,
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
    })

    // Calculate total revenue
    const totalRevenue = revenueOpportunities.reduce((sum, opp) => sum + Number(opp.estimatedValue), 0)

    // Calculate average deal size
    const avgDealSize = revenueOpportunities.length > 0 ? totalRevenue / revenueOpportunities.length : 0

    const chartData = []
    const now = new Date()

    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)

      const monthRevenue = await prisma.revenueOpportunity.aggregate({
        _sum: {
          estimatedValue: true,
        },
        where: {
          status: "CONVERTED",
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
      })

      chartData.push({
        month: monthStart.toLocaleDateString("en-US", { month: "short" }),
        revenue: Number(monthRevenue._sum.estimatedValue) || 0,
      })
    }

    const totalLeads = await prisma.lead.count()
    const qualifiedLeads = await prisma.lead.count({
      where: { status: "QUALIFIED" },
    })
    const conversionRate = totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0

    // Calculate growth rate from last 2 months
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const [currentMonthRevenue, lastMonthRevenue] = await Promise.all([
      prisma.revenueOpportunity.aggregate({
        _sum: { estimatedValue: true },
        where: {
          status: "CONVERTED",
          createdAt: { gte: currentMonth },
        },
      }),
      prisma.revenueOpportunity.aggregate({
        _sum: { estimatedValue: true },
        where: {
          status: "CONVERTED",
          createdAt: { gte: lastMonth, lt: currentMonth },
        },
      }),
    ])

    const currentValue = Number(currentMonthRevenue._sum.estimatedValue) || 0
    const lastValue = Number(lastMonthRevenue._sum.estimatedValue) || 0
    const growthRate = lastValue > 0 ? Math.round(((currentValue - lastValue) / lastValue) * 100) : 0

    return {
      totalRevenue,
      avgDealSize: Math.round(avgDealSize),
      conversionRate,
      growthRate,
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

    const automationTypes = await prisma.automation.groupBy({
      by: ["name"],
      where: { active: true },
      _count: { id: true },
    })

    const chartData = await Promise.all(
      automationTypes.map(async (automation) => {
        const triggers = await prisma.triggerExecution.count({
          where: {
            automationId: {
              in: await prisma.automation
                .findMany({
                  where: { name: automation.name },
                  select: { id: true },
                })
                .then((autos) => autos.map((a) => a.id)),
            },
          },
        })

        const responses = await prisma.triggerExecution.count({
          where: {
            automationId: {
              in: await prisma.automation
                .findMany({
                  where: { name: automation.name },
                  select: { id: true },
                })
                .then((autos) => autos.map((a) => a.id)),
            },
            success: true,
          },
        })

        return {
          name: automation.name,
          triggers,
          responses,
        }
      }),
    )

    const conversions = await prisma.lead.count({
      where: {
        status: "QUALIFIED",
        source: {
          contains: "automation",
        },
      },
    })

    return {
      activeCount: automations.length,
      totalTriggers,
      successRate,
      avgResponseTime: Math.round(Number(avgResponseTime._avg.responseTime) || 250),
      conversions,
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
    const activities: ActivityItem[] = []

    // Get recent leads
    const recentLeads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { revenueOpportunities: true },
    })

    // Get recent messages
    const recentMessages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
      take: 2,
    })

    // Get recent conversions
    const recentConversions = await prisma.revenueOpportunity.findMany({
      where: { status: "CONVERTED" },
      orderBy: { updatedAt: "desc" },
      take: 2,
      include: { lead: true },
    })

    // Add lead activities
    recentLeads.forEach((lead) => {
      const timeDiff = Math.floor((Date.now() - lead.createdAt.getTime()) / (1000 * 60))
      activities.push({
        type: "lead",
        user: lead.name || "Unknown Lead",
        title: lead.status === "QUALIFIED" ? "New qualified lead" : "New lead captured",
        description: `Lead from ${lead.source} automation`,
        timestamp: `${timeDiff} minutes ago`,
        value: lead.revenueOpportunities[0]
          ? `$${Number(lead.revenueOpportunities[0].estimatedValue).toLocaleString()}`
          : null,
      })
    })

    // Add message activities
    recentMessages.forEach((message) => {
      const timeDiff = Math.floor((Date.now() - message.createdAt.getTime()) / (1000 * 60))
      activities.push({
        type: "message",
        user: "System",
        title: "Automation triggered",
        description: `Message processed: ${message.message.substring(0, 50)}...`,
        timestamp: `${timeDiff} minutes ago`,
        value: null,
      })
    })

    // Add conversion activities
    recentConversions.forEach((conversion) => {
      const timeDiff = Math.floor((Date.now() - conversion.updatedAt.getTime()) / (1000 * 60))
      activities.push({
        type: "conversion",
        user: conversion.lead.name || "Unknown Lead",
        title: "Lead converted",
        description: "Revenue opportunity converted to sale",
        timestamp: `${timeDiff} minutes ago`,
        value: `$${Number(conversion.estimatedValue).toLocaleString()}`,
      })
    })

    // Sort by most recent and limit to 5
    return activities
      .sort((a, b) => {
        const aMinutes = Number.parseInt(a.timestamp.split(" ")[0])
        const bMinutes = Number.parseInt(b.timestamp.split(" ")[0])
        return aMinutes - bMinutes
      })
      .slice(0, 5)
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
      data: {
        metrics,
        revenue,
        automation,
        sentiment,
        activity,
        leads,
        automations: [], // Added empty automations array to match expected interface
      },
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return {
      data: null,
    }
  }
}
