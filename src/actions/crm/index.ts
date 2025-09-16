// actions/crm.ts
"use server"

import { client } from "@/lib/prisma"
import { getPremiumLeadAnalytics } from "@/lib/lead-qualification"
import { onUserInfor } from "../user" 

export async function getCRMData() {
  try {
    // Get user information first
    const userResponse = await onUserInfor()
    
    if (userResponse.status !== 200 || !userResponse.data) {
      console.error("Failed to get user information:", userResponse.error)
      return {
        status: userResponse.status,
        error: userResponse.error || "Failed to get user information"
      }
    }

    const userId = userResponse.data.id
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
      status: 200,
      data: { 
        analytics, 
        allLeads,
        user: userResponse.data // Include user info in response if needed
      }
    }
  } catch (error) {
    console.error("Error fetching CRM data:", error)
    return {
      status: 500,
      error: "Internal Server Error",
      data: {
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
}