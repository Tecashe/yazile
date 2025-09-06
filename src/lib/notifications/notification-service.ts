// lib/notifications/notification-service.ts
import { client } from '@/lib/prisma'
import { pusherServer } from '@/lib/pusher'
import { GeneralNotificationType } from '@prisma/client'

export interface NotificationData {
  userId: string
  businessId?: string
  type: GeneralNotificationType
  title: string
  message: string
  metadata?: any
  actionUrl?: string
}

export class NotificationService {
  /**
   * Create and send a notification via Pusher
   */
  static async createNotification(data: NotificationData) {
    try {
      // Create notification in database
      const notification = await client.generalNotification.create({
        data: {
          userId: data.userId,
          businessId: data.businessId,
          type: data.type,
          title: data.title,
          message: data.message,
          metadata: data.metadata,
          actionUrl: data.actionUrl,
        },
        include: {
          user: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
            }
          },
          business: {
            select: {
              id: true,
              name: true,
              businessName: true,
            }
          }
        }
      })

      // Send real-time notification via Pusher
      await pusherServer.trigger(
        `user-${data.userId}`,
        'notification',
        {
          id: notification.id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          metadata: notification.metadata,
          actionUrl: notification.actionUrl,
          createdAt: notification.createdAt,
          business: notification.business,
        }
      )

      // Update unread count
      const unreadCount = await this.getUnreadCount(data.userId)
      await pusherServer.trigger(
        `user-${data.userId}`,
        'unread-count',
        { count: unreadCount }
      )

      return notification
    } catch (error) {
      console.error('Error creating notification:', error)
      throw error
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string, userId: string) {
    try {
      const notification = await client.generalNotification.update({
        where: {
          id: notificationId,
          userId: userId,
        },
        data: {
          isRead: true,
          readAt: new Date(),
        }
      })

      // Update unread count
      const unreadCount = await this.getUnreadCount(userId)
      await pusherServer.trigger(
        `user-${userId}`,
        'unread-count',
        { count: unreadCount }
      )

      return notification
    } catch (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: string) {
    try {
      await client.generalNotification.updateMany({
        where: {
          userId: userId,
          isRead: false,
        },
        data: {
          isRead: true,
          readAt: new Date(),
        }
      })

      // Update unread count to 0
      await pusherServer.trigger(
        `user-${userId}`,
        'unread-count',
        { count: 0 }
      )

      return true
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      throw error
    }
  }

  /**
   * Get unread notification count
   */
  static async getUnreadCount(userId: string): Promise<number> {
    return await client.generalNotification.count({
      where: {
        userId: userId,
        isRead: false,
      }
    })
  }

  /**
   * Get notifications for a user with pagination
   */
  static async getNotifications(
    userId: string, 
    page: number = 1, 
    limit: number = 20,
    businessId?: string
  ) {
    const skip = (page - 1) * limit
    
    const where = {
      userId: userId,
      ...(businessId && { businessId: businessId })
    }

    const [notifications, total] = await Promise.all([
      client.generalNotification.findMany({
        where,
        include: {
          business: {
            select: {
              id: true,
              name: true,
              businessName: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit,
      }),
      client.generalNotification.count({ where })
    ])

    return {
      notifications,
      total,
      page,
      limit,
      hasMore: skip + notifications.length < total,
    }
  }

  /**
   * Delete a notification
   */
  static async deleteNotification(notificationId: string, userId: string) {
    try {
      await client.generalNotification.delete({
        where: {
          id: notificationId,
          userId: userId,
        }
      })

      // Update unread count
      const unreadCount = await this.getUnreadCount(userId)
      await pusherServer.trigger(
        `user-${userId}`,
        'unread-count',
        { count: unreadCount }
      )

      return true
    } catch (error) {
      console.error('Error deleting notification:', error)
      throw error
    }
  }

  /**
   * Send system-wide notifications (admin only)
   */
  static async sendSystemNotification(
    userIds: string[], 
    data: Omit<NotificationData, 'userId'>
  ) {
    try {
      const notifications = await Promise.all(
        userIds.map(userId => 
          this.createNotification({ ...data, userId })
        )
      )

      return notifications
    } catch (error) {
      console.error('Error sending system notifications:', error)
      throw error
    }
  }

  /**
   * Business-specific notification helpers
   */
  static async notifyLeadGenerated(userId: string, businessId: string, leadData: any) {
    return this.createNotification({
      userId,
      businessId,
      type: 'LEAD_GENERATED',
      title: 'New Lead Generated',
      message: `A new lead "${leadData.name || 'Unknown'}" has been generated for your business.`,
      metadata: { leadId: leadData.id, leadName: leadData.name },
      actionUrl: `/leads/${leadData.id}`,
    })
  }

  static async notifyLeadQualified(userId: string, businessId: string, leadData: any) {
    return this.createNotification({
      userId,
      businessId,
      type: 'LEAD_QUALIFIED',
      title: 'Lead Qualified',
      message: `Lead "${leadData.name}" has been qualified and is ready for follow-up.`,
      metadata: { leadId: leadData.id, leadName: leadData.name, score: leadData.score },
      actionUrl: `/leads/${leadData.id}`,
    })
  }

  static async notifyAutomationCompleted(userId: string, businessId: string, automationData: any) {
    return this.createNotification({
      userId,
      businessId,
      type: 'AUTOMATION_COMPLETED',
      title: 'Automation Completed',
      message: `Automation "${automationData.name}" has completed successfully.`,
      metadata: { automationId: automationData.id, automationName: automationData.name },
      actionUrl: `/automations/${automationData.id}`,
    })
  }

  static async notifyAutomationError(userId: string, businessId: string, automationData: any, error: string) {
    return this.createNotification({
      userId,
      businessId,
      type: 'AUTOMATION_ERROR',
      title: 'Automation Error',
      message: `Automation "${automationData.name}" encountered an error.`,
      metadata: { 
        automationId: automationData.id, 
        automationName: automationData.name, 
        error 
      },
      actionUrl: `/automations/${automationData.id}`,
    })
  }

  static async notifyCrmSyncSuccess(userId: string, businessId: string, syncData: any) {
    return this.createNotification({
      userId,
      businessId,
      type: 'CRM_SYNC_SUCCESS',
      title: 'CRM Sync Successful',
      message: `Successfully synced ${syncData.count} records to your CRM.`,
      metadata: syncData,
      actionUrl: '/integrations/crm',
    })
  }

  static async notifyCrmSyncError(userId: string, businessId: string, error: string) {
    return this.createNotification({
      userId,
      businessId,
      type: 'CRM_SYNC_ERROR',
      title: 'CRM Sync Failed',
      message: 'Failed to sync data to your CRM. Please check your integration settings.',
      metadata: { error },
      actionUrl: '/integrations/crm',
    })
  }
}