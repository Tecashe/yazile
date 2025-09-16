

// import IntegrationsPage from "@/components/global/integrations/integrations-page"
// import { Suspense } from "react"


// export default function Page() {
//   return (
//     <Suspense>
//       <IntegrationsPage />
//     </Suspense>
//   )
// }

"use client"

import { Suspense, useState } from "react"
import { redirect } from "next/navigation"
import { onUserInfor } from "@/actions/user"
import { client } from "@/lib/prisma"
import { getPremiumLeadAnalytics } from "@/lib/lead-qualification"
import { UnifiedCRMIntegration } from "../_components/crm/unified"
import IntegrationsPage from "@/components/global/integrations/integrations-page"

async function getCRMData(userId: string) {
  try {
    console.log(`Fetching CRM data for user: ${userId}`)

    const [analytics, allLeads] = await Promise.all([
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

      // Get all leads for CRM integration
      client.lead
        .findMany({
          where: { userId },
          include: {
            qualificationData: true,
            interactions: {
              take: 3,
              orderBy: { timestamp: "desc" },
            },
          },
          orderBy: { lastContactDate: "desc" },
        })
        .catch((error) => {
          console.error("Error getting leads:", error)
          return []
        }),
    ])

    console.log(`Found ${allLeads.length} leads for CRM integration`)

    return {
      analytics,
      allLeads,
    }
  } catch (error) {
    console.error("Error fetching CRM data:", error)
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
      allLeads: [],
    }
  }
}

function CRMIntegrationPage({ userId, analytics, allLeads }: any) {
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])

  const handleLeadSelectionChange = (leads: string[]) => {
    setSelectedLeads(leads)
  }

  return (
    <UnifiedCRMIntegration
      userId={userId}
      analytics={analytics}
      selectedLeads={selectedLeads}
      onLeadSelectionChange={handleLeadSelectionChange}
    />
  )
}

export default async function CRMPage() {
  const user = await onUserInfor()

  if (!user?.data?.id) {
    redirect("/sign-in")
  }

  const { analytics, allLeads } = await getCRMData(user.data.id)

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">CRM Integration</h1>
          <p className="text-muted-foreground mt-2">Connect and sync your leads with your favorite CRM platform</p>
        </div>

        <Suspense
          fallback={
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <div className="text-center">
                  <p className="text-lg font-medium">Loading CRM Integration...</p>
                  <p className="text-sm text-muted-foreground">Preparing your CRM connection interface</p>
                </div>
              </div>
            </div>
          }
        >
          <IntegrationsPage />
          <CRMIntegrationPage userId={user.data.id} analytics={analytics} allLeads={allLeads} />
        </Suspense>
      </div>
    </div>
  )
}
