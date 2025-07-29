"use server"

import { client } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { onUserInfor } from "../user"

export interface GeneralNotificationData {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: Date
  readAt: Date | null
  metadata?: Record<string, any>
  actionUrl?: string
  businessId?: string
}

// Get general notifications for current user
export async function getGeneralNotifications(limit = 20, businessId?: string): Promise<GeneralNotificationData[]> {
  try {
     const  user  = await onUserInfor()
      const userId = user.data?.id
    if (!userId) throw new Error("Unauthorized")

    const notifications = await client.generalNotification.findMany({
      where: {
        userId: userId,
        ...(businessId && { businessId }),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    })

    return notifications.map((notification) => ({
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
        readAt: notification.readAt,
        metadata: notification.metadata as Record<string, any>,
        actionUrl: notification.actionUrl ?? undefined, // Convert null to undefined
        businessId: notification.businessId ?? undefined, // Same for businessId if needed
        }))
  } catch (error) {
    console.error("Error fetching general notifications:", error)
    return []
  }
}

// Get general notification count
export async function getGeneralNotificationCount(businessId?: string): Promise<number> {
  try {
     const  user  = await onUserInfor()
  const userId = user.data?.id
    if (!userId) return 0

    return await client.generalNotification.count({
      where: {
        userId: userId,
        isRead: false,
        ...(businessId && { businessId }),
      },
    })
  } catch (error) {
    console.error("Error getting general notification count:", error)
    return 0
  }
}

// Mark general notification as read
export async function markGeneralNotificationAsRead(notificationId: string): Promise<void> {
  try {
    const  user  = await onUserInfor()
    const userId = user.data?.id
    if (!userId) throw new Error("Unauthorized")

    await client.generalNotification.update({
      where: {
        id: notificationId,
        userId: userId, // Ensure user can only mark their own notifications
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    })

    revalidatePath("/dashboard")
  } catch (error) {
    console.error("Error marking general notification as read:", error)
    throw error
  }
}

// Mark all general notifications as read
export async function markAllGeneralNotificationsAsRead(businessId?: string): Promise<void> {
  try {
    const  user  = await onUserInfor()
    const userId = user.data?.id
    if (!userId) throw new Error("Unauthorized")

    await client.generalNotification.updateMany({
      where: {
        userId: userId,
        isRead: false,
        ...(businessId && { businessId }),
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    })

    revalidatePath("/dashboard")
  } catch (error) {
    console.error("Error marking all general notifications as read:", error)
    throw error
  }
}

// Delete general notification
export async function deleteGeneralNotification(notificationId: string): Promise<void> {
  try {
    const  user  = await onUserInfor()
    const userId = user.data?.id
    if (!userId) throw new Error("Unauthorized")

    await client.generalNotification.delete({
      where: {
        id: notificationId,
        userId: userId, // Ensure user can only delete their own notifications
      },
    })

    revalidatePath("/dashboard")
  } catch (error) {
    console.error("Error deleting general notification:", error)
    throw error
  }
}

// Get general notifications by type
export async function getGeneralNotificationsByType(type: string, limit = 10): Promise<GeneralNotificationData[]> {
  try {
    const  user  = await onUserInfor()
    const userId = user.data?.id
    if (!userId) throw new Error("Unauthorized")

    const notifications = await client.generalNotification.findMany({
      where: {
        userId: userId,
        type: type as any,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    })

    return notifications.map((notification) => ({
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
      readAt: notification.readAt,
      metadata: notification.metadata as Record<string, any>,
      actionUrl: notification.actionUrl ?? undefined,
      businessId: notification.businessId ?? undefined,
    }))
  } catch (error) {
    console.error("Error fetching general notifications by type:", error)
    return []
  }
}

// Get general notification statistics
export async function getGeneralNotificationStats(): Promise<{
  total: number
  unread: number
  byType: Record<string, number>
  recent: number
}> {
  try {
    const  user  = await onUserInfor()
    const userId = user.data?.id
    if (!userId) throw new Error("Unauthorized")

    const [total, unread, byType, recent] = await Promise.all([
      // Total notifications
      client.generalNotification.count({
        where: { userId },
      }),
      // Unread notifications
      client.generalNotification.count({
        where: { userId, isRead: false },
      }),
      // Notifications by type
      client.generalNotification.groupBy({
        by: ["type"],
        where: { userId },
        _count: { type: true },
      }),
      // Recent notifications (last 24 hours)
      client.generalNotification.count({
        where: {
          userId,
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      }),
    ])

    const typeStats = byType.reduce(
      (acc, item) => {
        acc[item.type] = item._count.type
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      total,
      unread,
      byType: typeStats,
      recent,
    }
  } catch (error) {
    console.error("Error getting general notification stats:", error)
    return {
      total: 0,
      unread: 0,
      byType: {},
      recent: 0,
    }
  }
}
