"use server"

import { client } from "@/lib/prisma"
import type { GeneralNotificationType } from "@prisma/client"

export interface CreateGeneralNotificationData {
  userId: string
  businessId?: string
  type: GeneralNotificationType
  title: string
  message: string
  metadata?: Record<string, any>
  actionUrl?: string
}

// Create a new general notification
export async function createGeneralNotification(data: CreateGeneralNotificationData) {
  try {
    const notification = await client.generalNotification.create({
      data: {
        userId: data.userId,
        businessId: data.businessId,
        type: data.type,
        title: data.title,
        message: data.message,
        metadata: data.metadata || {},
        actionUrl: data.actionUrl,
      },
    })

    // Trigger real-time update
    await triggerGeneralNotificationUpdate(data.userId)

    return notification
  } catch (error) {
    console.error("Error creating general notification:", error)
    throw error
  }
}

// Bulk create general notifications
export async function createBulkGeneralNotifications(notifications: CreateGeneralNotificationData[]) {
  try {
    const result = await client.generalNotification.createMany({
      data: notifications,
    })

    // Trigger updates for all affected users
    // const userIds = [...new Set(notifications.map((n) => n.userId))]
    const userIds = Array.from(new Set(notifications.map((n) => n.userId)))
    await Promise.all(userIds.map((userId) => triggerGeneralNotificationUpdate(userId)))

    return result
  } catch (error) {
    console.error("Error creating bulk general notifications:", error)
    throw error
  }
}

// General notification generators for different events
export class GeneralNotificationGenerator {
  // Lead notifications
  static async notifyLeadGenerated(userId: string, businessId: string, leadData: any) {
    return createGeneralNotification({
      userId,
      businessId,
      type: "LEAD_GENERATED",
      title: "New Lead Generated! 🎉",
      message: `${leadData.name || "Anonymous lead"} from ${leadData.source || "Instagram"} - Score: ${leadData.score}`,
      metadata: {
        leadId: leadData.id,
        score: leadData.score,
        source: leadData.source,
        status: leadData.status,
      },
      actionUrl: `/dashboard/${userId}/leads/${leadData.id}`,
    })
  }

  static async notifyLeadQualified(userId: string, businessId: string, leadData: any) {
    return createGeneralNotification({
      userId,
      businessId,
      type: "LEAD_QUALIFIED",
      title: "Lead Qualified! ⭐",
      message: `${leadData.name} has been qualified as a ${leadData.tier} lead with ${leadData.score}% score`,
      metadata: {
        leadId: leadData.id,
        tier: leadData.tier,
        score: leadData.score,
      },
      actionUrl: `/dashboard/${userId}/leads/${leadData.id}`,
    })
  }

  // Automation notifications
  static async notifyAutomationCompleted(userId: string, businessId: string, automationData: any) {
    return createGeneralNotification({
      userId,
      businessId,
      type: "AUTOMATION_COMPLETED",
      title: "Automation Completed ✅",
      message: `${automationData.name} processed ${automationData.messagesCount} messages and generated ${automationData.leadsCount} leads`,
      metadata: {
        automationId: automationData.id,
        messagesCount: automationData.messagesCount,
        leadsCount: automationData.leadsCount,
      },
      actionUrl: `/dashboard/${userId}/automations/${automationData.id}`,
    })
  }

  static async notifyAutomationError(userId: string, businessId: string, automationData: any, error: string) {
    return createGeneralNotification({
      userId,
      businessId,
      type: "AUTOMATION_ERROR",
      title: "Automation Error ⚠️",
      message: `${automationData.name} encountered an error: ${error}`,
      metadata: {
        automationId: automationData.id,
        error,
      },
      actionUrl: `/dashboard/${userId}/automations/${automationData.id}`,
    })
  }

  // Campaign notifications
  static async notifyCampaignStarted(userId: string, businessId: string, campaignData: any) {
    return createGeneralNotification({
      userId,
      businessId,
      type: "CAMPAIGN_STARTED",
      title: "Campaign Started 🚀",
      message: `${campaignData.name} is now live with ${campaignData.influencersCount} influencers`,
      metadata: {
        campaignId: campaignData.id,
        influencersCount: campaignData.influencersCount,
        budget: campaignData.budget,
      },
      actionUrl: `/dashboard/${userId}/campaigns/${campaignData.id}`,
    })
  }

  // Influencer notifications
  static async notifyInfluencerApplied(userId: string, businessId: string, applicationData: any) {
    return createGeneralNotification({
      userId,
      businessId,
      type: "INFLUENCER_APPLIED",
      title: "New Influencer Application 📝",
      message: `${applicationData.influencerName} applied for "${applicationData.opportunityTitle}"`,
      metadata: {
        applicationId: applicationData.id,
        influencerId: applicationData.influencerId,
        opportunityId: applicationData.opportunityId,
        influencerName: applicationData.influencerName,
      },
      actionUrl: `/dashboard/${userId}/opportunities/${applicationData.opportunityId}`,
    })
  }

  // Workflow notifications
  static async notifyWorkflowActivated(userId: string, businessId: string, workflowData: any) {
    return createGeneralNotification({
      userId,
      businessId,
      type: "WORKFLOW_ACTIVATED",
      title: "Workflow Activated ⚙️",
      message: `Your ${workflowData.type} workflow for ${workflowData.businessName} is now active`,
      metadata: {
        workflowId: workflowData.id,
        workflowType: workflowData.type,
        businessName: workflowData.businessName,
      },
      actionUrl: `/dashboard/${userId}/workflows`,
    })
  }

  // CRM notifications
  static async notifyCRMSyncSuccess(userId: string, businessId: string, syncData: any) {
    return createGeneralNotification({
      userId,
      businessId,
      type: "CRM_SYNC_SUCCESS",
      title: "CRM Sync Successful 💼",
      message: `${syncData.leadsCount} leads synced to ${syncData.crmProvider}`,
      metadata: {
        crmProvider: syncData.crmProvider,
        leadsCount: syncData.leadsCount,
        syncId: syncData.syncId,
      },
      actionUrl: `/dashboard/${userId}/leads`,
    })
  }

  static async notifyCRMSyncError(userId: string, businessId: string, errorData: any) {
    return createGeneralNotification({
      userId,
      businessId,
      type: "CRM_SYNC_ERROR",
      title: "CRM Sync Failed ❌",
      message: `Failed to sync leads to ${errorData.crmProvider}: ${errorData.error}`,
      metadata: {
        crmProvider: errorData.crmProvider,
        error: errorData.error,
      },
      actionUrl: `/dashboard/${userId}/settings/integrations`,
    })
  }

  // System notifications
  static async notifySystemAlert(userId: string, businessId: string, alertData: any) {
    return createGeneralNotification({
      userId,
      businessId,
      type: "SYSTEM_ALERT",
      title: alertData.title,
      message: alertData.message,
      metadata: alertData.metadata || {},
      actionUrl: alertData.actionUrl,
    })
  }
}

// Trigger real-time general notification update
async function triggerGeneralNotificationUpdate(userId: string) {
  console.log(`📡 Triggering general notification update for user: ${userId}`)
}

// Cleanup old general notifications (run this periodically)
export async function cleanupOldGeneralNotifications(daysToKeep = 30) {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

  try {
    const result = await client.generalNotification.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
        isRead: true, // Only delete read notifications
      },
    })

    console.log(`🧹 Cleaned up ${result.count} old general notifications`)
    return result
  } catch (error) {
    console.error("Error cleaning up general notifications:", error)
    throw error
  }
}
