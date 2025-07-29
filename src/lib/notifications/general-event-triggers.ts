"use server"

import { GeneralNotificationGenerator } from "./notifications"
import { client } from "@/lib/prisma"

// These functions should be called when events happen in your app

export async function onLeadGenerated(leadData: any) {
  try {
    // Get the user and business from the lead's automation
    const userId = leadData.userId
    const businessId = leadData.businessId || leadData.automation?.businessId

    if (userId) {
      await GeneralNotificationGenerator.notifyLeadGenerated(userId, businessId, leadData)
    }
  } catch (error) {
    console.error("Error triggering lead generated general notification:", error)
  }
}

export async function onLeadQualified(leadData: any) {
  try {
    const userId = leadData.userId
    const businessId = leadData.businessId

    if (userId && leadData.qualificationData?.leadTier) {
      await GeneralNotificationGenerator.notifyLeadQualified(userId, businessId, {
        ...leadData,
        tier: leadData.qualificationData.leadTier,
      })
    }
  } catch (error) {
    console.error("Error triggering lead qualified general notification:", error)
  }
}

export async function onAutomationCompleted(automationData: any, stats: any) {
  try {
    const userId = automationData.userId
    const businessId = automationData.businessId

    if (userId) {
      await GeneralNotificationGenerator.notifyAutomationCompleted(userId, businessId, {
        ...automationData,
        messagesCount: stats.messagesCount,
        leadsCount: stats.leadsCount,
      })
    }
  } catch (error) {
    console.error("Error triggering automation completed general notification:", error)
  }
}

export async function onCampaignStarted(campaignData: any) {
  try {
    const userId = campaignData.userId
    const businessId = campaignData.businessId

    if (userId) {
      await GeneralNotificationGenerator.notifyCampaignStarted(userId, businessId, campaignData)
    }
  } catch (error) {
    console.error("Error triggering campaign started general notification:", error)
  }
}

export async function onInfluencerApplied(applicationData: any) {
  try {
    // Get the business owner from the opportunity
    const userId = applicationData.opportunity?.business?.userId
    const businessId = applicationData.opportunity?.businessId

    if (userId) {
      await GeneralNotificationGenerator.notifyInfluencerApplied(userId, businessId, {
        ...applicationData,
        influencerName: applicationData.influencer?.name,
        opportunityTitle: applicationData.opportunity?.title,
      })
    }
  } catch (error) {
    console.error("Error triggering influencer applied general notification:", error)
  }
}

export async function onWorkflowActivated(workflowData: any) {
  try {
    const userId = workflowData.userId
    const businessId = workflowData.businessId

    if (userId) {
      await GeneralNotificationGenerator.notifyWorkflowActivated(userId, businessId, {
        ...workflowData,
        type: workflowData.workflowTemplate?.name || "Custom",
        businessName: workflowData.business?.businessName,
      })
    }
  } catch (error) {
    console.error("Error triggering workflow activated general notification:", error)
  }
}

export async function onCRMSyncCompleted(syncData: any) {
  try {
    const userId = syncData.userId
    const businessId = syncData.businessId

    if (userId) {
      if (syncData.success) {
        await GeneralNotificationGenerator.notifyCRMSyncSuccess(userId, businessId, syncData)
      } else {
        await GeneralNotificationGenerator.notifyCRMSyncError(userId, businessId, syncData)
      }
    }
  } catch (error) {
    console.error("Error triggering CRM sync general notification:", error)
  }
}

// System health checks and alerts
export async function checkSystemHealth(userId: string, businessId?: string) {
  try {
    // Check for inactive automations
    const inactiveAutomations = await client.automation.count({
      where: {
        userId: userId,
        active: false,
      },
    })

    if (inactiveAutomations > 0) {
      await GeneralNotificationGenerator.notifySystemAlert(userId, businessId || "", {
        title: "Inactive Automations Detected ⚠️",
        message: `You have ${inactiveAutomations} inactive automations that could be generating leads`,
        metadata: { count: inactiveAutomations },
        actionUrl: `/dashboard/${userId}/automations`,
      })
    }

    // Check for campaigns with low engagement
    const campaigns = await client.campaign.findMany({
      where: {
        userId: userId,
        status: "ACTIVE",
      },
      include: {
        _count: {
          select: {
            influencers: true,
          },
        },
      },
    })

    const lowPerformingCampaigns = campaigns.filter((c) => c._count.influencers < 2)
    if (lowPerformingCampaigns.length > 0) {
      await GeneralNotificationGenerator.notifySystemAlert(userId, businessId || "", {
        title: "Campaigns Need Attention 📢",
        message: `${lowPerformingCampaigns.length} active campaigns have fewer than 2 influencers`,
        metadata: { count: lowPerformingCampaigns.length },
        actionUrl: `/dashboard/${userId}/campaigns`,
      })
    }
  } catch (error) {
    console.error("Error checking system health:", error)
  }
}
