import { Suspense } from "react"
import { redirect } from "next/navigation"
import { onUserInfor } from "@/actions/user"
import { client } from "@/lib/prisma"
import { getPremiumLeadAnalytics, mergeDuplicateLeads } from "@/lib/lead-qualification"
import { LeadsDashboard } from "../../_components/leads/leads-dashboard"

async function getLeadsData(userId: string) {
  try {
    console.log(`Fetching leads data for user: ${userId}`)

    const [analytics, recentLeads, topLeads, duplicateCount, recentInteractions] = await Promise.all([
      getPremiumLeadAnalytics(userId).catch((error) => {
        console.error("Error getting analytics:", error)
        return {
          totalLeads: 0,
          qualifiedLeads: 0,
          convertedLeads: 0,
          conversionRate: 0,
          qualificationRate: 0,
          recentInteractions: [],
          revenueMetrics: {
            totalEstimatedRevenue: 0,
            totalExpectedRevenue: 0,
            averageROI: 0,
            revenueGrowth: 0,
          },
          tierDistribution: {
            platinum: 0,
            gold: 0,
            silver: 0,
            bronze: 0,
          },
          premiumInsights: {
            highValueLeads: 0,
            averageLeadValue: 0,
            conversionProbability: 0,
            totalPipelineValue: 0,
          },
          crmStatus: {
            connected: false,
            integrations: [],
            lastSync: null,
          },
        }
      }),

      // Recent leads with proper error handling
      client.lead
        .findMany({
          where: { userId },
          include: {
            qualificationData: true,
            interactions: {
              take: 5,
              orderBy: { timestamp: "desc" },
            },
          },
          orderBy: { lastContactDate: "desc" },
          take: 50,
        })
        .catch((error) => {
          console.error("Error getting recent leads:", error)
          return []
        }),

      // Top performing leads
      client.lead
        .findMany({
          where: {
            userId,
            score: { gte: 30 },
          },
          include: {
            qualificationData: true,
            interactions: {
              take: 3,
              orderBy: { timestamp: "desc" },
            },
          },
          orderBy: [{ score: "desc" }, { lastContactDate: "desc" }],
          take: 15,
        })
        .catch((error) => {
          console.error("Error getting top leads:", error)
          return []
        }),

      // Check for duplicates
      client.lead
        .groupBy({
          by: ["instagramUserId", "pageId"],
          where: { userId },
          having: {
            id: { _count: { gt: 1 } },
          },
          _count: { id: true },
        })
        .catch((error) => {
          console.error("Error getting duplicates:", error)
          return []
        }),

      // Recent interactions
      client.leadInteraction
        .findMany({
          where: {
            lead: { userId },
          },
          include: {
            lead: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
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
        })
        .catch((error) => {
          console.error("Error getting recent interactions:", error)
          return []
        }),
    ])

    console.log(`Found ${recentLeads.length} recent leads, ${topLeads.length} top leads`)

    // Process leads with safe data handling
    const processedRecentLeads = recentLeads.map((lead) => {
      const qualData = lead?.qualificationData
      const displayName = lead?.name || `@${lead?.instagramUserId || "unknown"}`

      return {
        ...lead,
        name: displayName,
        metadata: {
          lastAnalysis: qualData
            ? {
                leadTier: qualData.leadTier || "BRONZE",
                estimatedValue: Number(qualData.estimatedValue || 0),
                roi: Number(qualData.roi || 0),
              }
            : {
                leadTier: "BRONZE",
                estimatedValue: 0,
                roi: 0,
              },
        },
      }
    })

    const processedTopLeads = topLeads.map((lead) => {
      const qualData = lead?.qualificationData
      const displayName = lead?.name || `@${lead?.instagramUserId || "unknown"}`

      return {
        ...lead,
        name: displayName,
        metadata: {
          lastAnalysis: qualData
            ? {
                leadTier: qualData.leadTier || "BRONZE",
                estimatedValue: Number(qualData.estimatedValue || 0),
                roi: Number(qualData.roi || 0),
              }
            : {
                leadTier: "BRONZE",
                estimatedValue: 0,
                roi: 0,
              },
        },
      }
    })

    return {
      analytics,
      recentLeads: processedRecentLeads,
      topLeads: processedTopLeads,
      hasDuplicates: duplicateCount.length > 0,
      duplicateCount: duplicateCount.length,
      interactions: recentInteractions,
    }
  } catch (error) {
    console.error("Error fetching leads data:", error)
    return {
      analytics: {
        totalLeads: 0,
        qualifiedLeads: 0,
        convertedLeads: 0,
        conversionRate: 0,
        qualificationRate: 0,
        recentInteractions: [],
        revenueMetrics: {
          totalEstimatedRevenue: 0,
          totalExpectedRevenue: 0,
          averageROI: 0,
          revenueGrowth: 0,
        },
        tierDistribution: {
          platinum: 0,
          gold: 0,
          silver: 0,
          bronze: 0,
        },
        premiumInsights: {
          highValueLeads: 0,
          averageLeadValue: 0,
          conversionProbability: 0,
          totalPipelineValue: 0,
        },
        crmStatus: {
          connected: false,
          integrations: [],
          lastSync: null,
        },
      },
      recentLeads: [],
      topLeads: [],
      hasDuplicates: false,
      duplicateCount: 0,
      interactions: [],
    }
  }
}

async function handleMergeDuplicates(userId: string) {
  "use server"
  try {
    const result = await mergeDuplicateLeads(userId)
    return { success: true, mergedGroups: result.mergedGroups }
  } catch (error) {
    console.error("Error merging duplicates:", error)
    return { success: false, error: "Failed to merge duplicates" }
  }
}

export default async function LeadsPage() {
  const user = await onUserInfor()

  if (!user?.data?.id) {
    redirect("/sign-in")
  }

  const leadsData = await getLeadsData(user.data.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <div className="text-center">
                <p className="text-lg font-medium">Loading Professional Dashboard...</p>
                <p className="text-sm text-muted-foreground">Preparing your lead management interface</p>
              </div>
            </div>
          </div>
        }
      >
        <LeadsDashboard initialData={leadsData} userId={user.data.id} onMergeDuplicates={handleMergeDuplicates} />
      </Suspense>
    </div>
  )
}
