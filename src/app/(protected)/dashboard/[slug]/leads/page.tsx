//WORKING JUST FINE

// import { Suspense } from "react"
// import { redirect } from "next/navigation"
// import { onUserInfor } from "@/actions/user"
// import { client } from "@/lib/prisma"
// import { getLeadAnalytics } from "@/lib/lead-qualification"
// import { LeadsDashboard } from "../_components/leads/leads"

// // Server action to get leads data with improved performance
// async function getLeadsData(userId: string) {
//   try {
//     const [analytics, recentLeads, topLeads, duplicateCount] = await Promise.all([
//       getLeadAnalytics(userId),
//       client.lead.findMany({
//         where: { userId },
//         include: {
//           qualificationData: true,
//           interactions: {
//             take: 1,
//             orderBy: { timestamp: "desc" },
//           },
//         },
//         orderBy: { lastContactDate: "desc" },
//         take: 20, // Increased for better overview
//       }),
//       client.lead.findMany({
//         where: { userId },
//         include: {
//           qualificationData: true,
//         },
//         orderBy: { score: "desc" },
//         take: 10, // Increased for better insights
//       }),
//       // Check for potential duplicates
//       client.lead.groupBy({
//         by: ["instagramUserId", "pageId"],
//         where: { userId },
//         having: {
//           id: { _count: { gt: 1 } },
//         },
//         _count: { id: true },
//       }),
//     ])

//     return {
//       analytics,
//       recentLeads,
//       topLeads,
//       hasDuplicates: duplicateCount.length > 0,
//       duplicateCount: duplicateCount.length,
//     }
//   } catch (error) {
//     console.error("Error fetching leads data:", error)
//     return {
//       analytics: null,
//       recentLeads: [],
//       topLeads: [],
//       hasDuplicates: false,
//       duplicateCount: 0,
//     }
//   }
// }

// export default async function LeadsPage() {
//   const user = await onUserInfor()
//   const userId = user.data?.id

//   if (!user?.data?.id) {
//     redirect("/sign-in")
//   }

//   const { analytics, recentLeads, topLeads, hasDuplicates, duplicateCount } = await getLeadsData(user.data.id)

//   return (
//     <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
//       <Suspense fallback={<div>Loading...</div>}>
//         <LeadsDashboard
//           analytics={analytics}
//           recentLeads={recentLeads}
//           topLeads={topLeads}
//           hasDuplicates={hasDuplicates}
//           duplicateCount={duplicateCount}
//           userId={userId || ""}
//         />
//       </Suspense>
//     </div>
//   )
// }


// import { Suspense } from "react"
// import { redirect } from "next/navigation"
// import { onUserInfor } from "@/actions/user"
// import { client } from "@/lib/prisma"
// import { getPremiumLeadAnalytics ,mergeDuplicateLeads} from "@/lib/lead-qualification"
// import { PremiumLeadsDashboard } from "../_components/leads/leads"

// // Enhanced server action to get premium leads data
// async function getPremiumLeadsData(userId: string) {
//   try {
//     const [analytics, recentLeads, topLeads, duplicateCount] = await Promise.all([
//       getPremiumLeadAnalytics(userId),
//       client.lead.findMany({
//         where: { userId },
//         include: {
//           qualificationData: true,
//           interactions: {
//             take: 1,
//             orderBy: { timestamp: "desc" },
//           },
//         },
//         orderBy: { lastContactDate: "desc" },
//         take: 20,
//       }),
//       client.lead.findMany({
//         where: { userId },
//         include: {
//           qualificationData: true,
//         },
//         orderBy: [{ score: "desc" }, { lastContactDate: "desc" }],
//         take: 10,
//       }),
//       // Check for potential duplicates
//       client.lead.groupBy({
//         by: ["instagramUserId", "pageId"],
//         where: { userId },
//         having: {
//           id: { _count: { gt: 1 } },
//         },
//         _count: { id: true },
//       }),
//     ])

//     return {
//       analytics,
//       recentLeads,
//       topLeads,
//       hasDuplicates: duplicateCount.length > 0,
//       duplicateCount: duplicateCount.length,
//     }
//   } catch (error) {
//     console.error("Error fetching premium leads data:", error)
//     return {
//       analytics: null,
//       recentLeads: [],
//       topLeads: [],
//       hasDuplicates: false,
//       duplicateCount: 0,
//     }
//   }
// }

// // Server action to merge duplicates
// async function handleMergeDuplicates(userId: string) {
//   "use server"
//   try {
//     const result = await mergeDuplicateLeads(userId)
//     return { success: true, mergedGroups: result.mergedGroups }
//   } catch (error) {
//     console.error("Error merging duplicates:", error)
//     return { success: false, error: "Failed to merge duplicates" }
//   }
// }

// export default async function PremiumLeadsPage() {
//   const user = await onUserInfor()
//   const userId = user.data?.id

//   if (!user?.data?.id) {
//     redirect("/sign-in")
//   }

//   const { analytics, recentLeads, topLeads, hasDuplicates, duplicateCount } = await getPremiumLeadsData(user.data.id)

//   return (
//     <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
//       <Suspense fallback={<div>Loading premium analytics...</div>}>
//         <PremiumLeadsDashboard
//           analytics={analytics}
//           recentLeads={recentLeads}
//           topLeads={topLeads}
//           hasDuplicates={hasDuplicates}
//           duplicateCount={duplicateCount}
//           userId={userId || ""}
//         />
//       </Suspense>
//     </div>
//   )
// }


import { Suspense } from "react"
import { redirect } from "next/navigation"
import { onUserInfor } from "@/actions/user"
import { client } from "@/lib/prisma"
import { getPremiumLeadAnalytics, mergeDuplicateLeads } from "@/lib/lead-qualification"
import { PremiumLeadsDashboard } from "../_components/leads/leads"

// Enhanced server action to get comprehensive premium leads data
async function getPremiumLeadsData(userId: string) {
  try {
    const [analytics, recentLeads, topLeads, duplicateCount, tierStats, recentInteractions, crmIntegrations] =
      await Promise.all([
        getPremiumLeadAnalytics(userId),

        // Enhanced recent leads with more comprehensive data
        client.lead.findMany({
          where: { userId },
          include: {
            qualificationData: true,
            interactions: {
              take: 3,
              orderBy: { timestamp: "desc" },
            },
            revenueOpportunities: {
              take: 1,
              orderBy: { createdAt: "desc" },
            },
            scheduledActions: {
              where: { status: "PENDING" },
              take: 2,
              orderBy: { scheduledFor: "asc" },
            },
          },
          orderBy: { lastContactDate: "desc" },
          take: 50,
        }),

        // Top performing leads with enhanced scoring
        client.lead.findMany({
          where: {
            userId,
            score: { gte: 70 }, // Only high-scoring leads
          },
          include: {
            qualificationData: true,
            interactions: {
              take: 2,
              orderBy: { timestamp: "desc" },
            },
            revenueOpportunities: true,
          },
          orderBy: [{ score: "desc" }, { lastContactDate: "desc" }],
          take: 15,
        }),

        // Check for potential duplicates with more sophisticated logic
        client.lead.groupBy({
          by: ["instagramUserId", "pageId"],
          where: { userId },
          having: {
            id: { _count: { gt: 1 } },
          },
          _count: { id: true },
        }),

        // Get comprehensive tier statistics
        client.leadQualificationData.groupBy({
          by: ["leadTier"],
          where: {
            lead: { userId },
            leadTier: { not: null },
          },
          _count: { leadTier: true },
          _avg: {
            estimatedValue: true,
            roi: true,
            engagementScore: true,
            intentScore: true,
          },
          _sum: { estimatedValue: true },
        }),

        // Recent AI-analyzed interactions
        client.leadInteraction.findMany({
          where: {
            lead: { userId },
          },
          include: {
            lead: {
              select: {
                id: true,
                name: true,
                instagramUserId: true,
                status: true,
                score: true,
                qualificationData: {
                  select: {
                    leadTier: true,
                    estimatedValue: true,
                    roi: true,
                  },
                },
              },
            },
          },
          orderBy: { timestamp: "desc" },
          take: 20,
        }),

        // Check CRM integration status
        client.crmIntegration.findMany({
          where: { userId, isActive: true },
          select: {
            id: true,
            provider: true,
            name: true,
            isActive: true,
            lastSynced: true,
          },
        }),
      ])

    // Calculate additional metrics
    const totalEstimatedRevenue = tierStats.reduce((sum, tier) => sum + Number(tier._sum.estimatedValue || 0), 0)
    const avgLeadValue = recentLeads.length > 0 ? totalEstimatedRevenue / recentLeads.length : 0

    // Enhanced analytics with calculated fields
    const enhancedAnalytics = {
      ...analytics,
      totalEstimatedRevenue,
      avgLeadValue,
      tierDistribution: {
        platinum: tierStats.find((t) => t.leadTier === "PLATINUM")?._count.leadTier || 0,
        gold: tierStats.find((t) => t.leadTier === "GOLD")?._count.leadTier || 0,
        silver: tierStats.find((t) => t.leadTier === "SILVER")?._count.leadTier || 0,
        bronze: tierStats.find((t) => t.leadTier === "BRONZE")?._count.leadTier || 0,
      },
      premiumInsights: {
        highValueLeads: topLeads.filter(
          (lead) => lead.qualificationData?.leadTier === "PLATINUM" || lead.qualificationData?.leadTier === "GOLD",
        ).length,
        averageLeadValue: avgLeadValue,
        conversionProbability: analytics?.conversionRate || 0,
        totalPipelineValue: totalEstimatedRevenue,
      },
      recentInteractions: recentInteractions.map((interaction) => ({
        ...interaction,
        metadata: {
          leadTier: interaction.lead.qualificationData?.leadTier,
          estimatedValue: interaction.lead.qualificationData?.estimatedValue,
          roi: interaction.lead.qualificationData?.roi,
          notificationMessage: generateAINotification(interaction),
        },
      })),
      crmStatus: {
        connected: crmIntegrations.length > 0,
        integrations: crmIntegrations,
        lastSync: crmIntegrations.reduce(
          (latest, crm) => (!latest || (crm.lastSynced && crm.lastSynced > latest) ? crm.lastSynced : latest),
          null as Date | null,
        ),
      },
    }

    return {
      analytics: enhancedAnalytics,
      recentLeads: recentLeads.map((lead) => ({
        ...lead,
        metadata: {
          lastAnalysis: lead.qualificationData
            ? {
                leadTier: lead.qualificationData.leadTier,
                estimatedValue: Number(lead.qualificationData.estimatedValue || 0),
                roi: Number(lead.qualificationData.roi || 0),
                notificationMessage: generateLeadNotification(lead),
                nextActions: generateNextActions(lead),
                followUpStrategy: generateFollowUpStrategy(lead),
                buyerPersona: generateBuyerPersona(lead),
              }
            : null,
        },
      })),
      topLeads: topLeads.map((lead) => ({
        ...lead,
        metadata: {
          lastAnalysis: lead.qualificationData
            ? {
                leadTier: lead.qualificationData.leadTier,
                estimatedValue: Number(lead.qualificationData.estimatedValue || 0),
                roi: Number(lead.qualificationData.roi || 0),
                followUpStrategy: generateFollowUpStrategy(lead),
                buyerPersona: generateBuyerPersona(lead),
              }
            : null,
        },
      })),
      hasDuplicates: duplicateCount.length > 0,
      duplicateCount: duplicateCount.length,
      tierStats: tierStats.filter((stat) => stat.leadTier !== null),
    }
  } catch (error) {
    console.error("Error fetching premium leads data:", error)
    return {
      analytics: null,
      recentLeads: [],
      topLeads: [],
      hasDuplicates: false,
      duplicateCount: 0,
      tierStats: [],
    }
  }
}

// Helper functions for AI-generated insights
function generateAINotification(interaction: any): string {
  const { intent, sentiment, lead } = interaction.lead
  const tier = lead.qualificationData?.leadTier

  if (intent && typeof intent === "object" && "purchase_intent" in intent && intent.purchase_intent > 0.7) {
    return `🔥 High purchase intent detected - immediate follow-up recommended`
  }
  if (sentiment && sentiment > 0.5 && tier === "PLATINUM") {
    return `⭐ Platinum lead showing positive sentiment - perfect timing for proposal`
  }
  if (intent && typeof intent === "object" && "information_request" in intent && intent.information_request > 0.6) {
    return `📋 Information request detected - send detailed product info`
  }
  return `🤖 AI analysis complete - lead scored and categorized`
}

function generateLeadNotification(lead: any): string {
  const score = lead.score
  const tier = lead.qualificationData?.leadTier
  const lastInteraction = lead.interactions[0]

  if (score >= 85 && tier === "PLATINUM") {
    return `🎯 Premium opportunity - schedule immediate call`
  }
  if (score >= 70 && lastInteraction?.sentiment > 0.5) {
    return `📞 Positive sentiment detected - great time to connect`
  }
  if (lead.scheduledActions?.length > 0) {
    return `⏰ Scheduled follow-up pending - stay on track`
  }
  return `📊 Lead qualified and ready for engagement`
}

function generateNextActions(lead: any): string[] {
  const actions = []
  const score = lead.score
  const tier = lead.qualificationData?.leadTier

  if (score >= 80) actions.push("immediate_call")
  if (tier === "PLATINUM" || tier === "GOLD") actions.push("send_proposal")
  if (lead.interactions.length === 0) actions.push("initial_outreach")
  if (lead.email) actions.push("email_sequence")

  return actions.slice(0, 3) // Limit to top 3 actions
}

function generateFollowUpStrategy(lead: any): string {
  const tier = lead.qualificationData?.leadTier
  const score = lead.score

  if (tier === "PLATINUM") return "immediate_personal_outreach"
  if (tier === "GOLD" && score >= 70) return "priority_nurturing"
  if (score >= 50) return "automated_sequence"
  return "long_term_nurturing"
}

function generateBuyerPersona(lead: any): string {
  const score = lead.score
  const engagementScore = lead.qualificationData?.engagementScore || 0
  const intentScore = lead.qualificationData?.intentScore || 0

  if (intentScore >= 80) return "ready_buyer"
  if (engagementScore >= 70) return "engaged_prospect"
  if (score >= 60) return "qualified_lead"
  return "early_stage_prospect"
}

// Enhanced server action to merge duplicates with better error handling
async function handleMergeDuplicates(userId: string) {
  "use server"
  try {
    const result = await mergeDuplicateLeads(userId)

    // Log the merge operation for audit purposes
    await client.auditLog.create({
      data: {
        userId,
        action: "MERGE_DUPLICATE_LEADS",
        target: "LEADS",
        details: `Merged ${result.mergedGroups} duplicate lead groups`,
        metadata: {
          mergedGroups: result.mergedGroups,
          timestamp: new Date().toISOString(),
        },
      },
    })

    return { success: true, mergedGroups: result.mergedGroups }
  } catch (error) {
    console.error("Error merging duplicates:", error)

    // Log the error for debugging
    await client.auditLog
      .create({
        data: {
          userId,
          action: "MERGE_DUPLICATE_LEADS_ERROR",
          target: "LEADS",
          details: `Failed to merge duplicates: ${error instanceof Error ? error.message : "Unknown error"}`,
          metadata: {
            error: error instanceof Error ? error.message : "Unknown error",
            timestamp: new Date().toISOString(),
          },
        },
      })
      .catch(() => {}) // Ignore audit log errors

    return { success: false, error: "Failed to merge duplicates" }
  }
}

export default async function PremiumLeadsPage() {
  const user = await onUserInfor()
  const userId = user.data?.id

  if (!user?.data?.id) {
    redirect("/sign-in")
  }

  const { analytics, recentLeads, topLeads, hasDuplicates, duplicateCount, tierStats } = await getPremiumLeadsData(
    user.data.id,
  )

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <div className="text-center">
                <p className="text-lg font-medium">Loading Premium Analytics...</p>
                <p className="text-sm text-muted-foreground">Analyzing your revenue pipeline with AI</p>
              </div>
            </div>
          </div>
        }
      >
        <PremiumLeadsDashboard
          analytics={analytics}
          recentLeads={recentLeads}
          topLeads={topLeads}
          hasDuplicates={hasDuplicates}
          duplicateCount={duplicateCount}
          userId={userId || ""}
          onMergeDuplicates={handleMergeDuplicates}
        />
      </Suspense>
    </div>
  )
}
