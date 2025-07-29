"use client"

import { useState, useEffect, useCallback } from "react"
import {
  getGeneralNotifications,
  getGeneralNotificationCount,
  markGeneralNotificationAsRead,
  markAllGeneralNotificationsAsRead,
  type GeneralNotificationData,
} from "@/actions/notifications/general-notifications"

export function useGeneralNotifications(businessId?: string) {
  const [notifications, setNotifications] = useState<GeneralNotificationData[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true)
      const [notificationData, count] = await Promise.all([
        getGeneralNotifications(20, businessId),
        getGeneralNotificationCount(businessId),
      ])

      setNotifications(notificationData)
      setUnreadCount(count)
    } catch (error) {
      console.error("Error fetching general notifications:", error)
    } finally {
      setIsLoading(false)
    }
  }, [businessId])

  // Mark notification as read
  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await markGeneralNotificationAsRead(notificationId)

        // Update local state immediately for better UX
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, isRead: true, readAt: new Date() } : n)),
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
      } catch (error) {
        console.error("Error marking general notification as read:", error)
        // Refresh to get correct state
        fetchNotifications()
      }
    },
    [fetchNotifications],
  )

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      await markAllGeneralNotificationsAsRead(businessId)

      // Update local state
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, readAt: new Date() })))
      setUnreadCount(0)
    } catch (error) {
      console.error("Error marking all general notifications as read:", error)
      // Refresh to get correct state
      fetchNotifications()
    }
  }, [businessId, fetchNotifications])

  // Real-time polling
  useEffect(() => {
    fetchNotifications()

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)

    return () => clearInterval(interval)
  }, [fetchNotifications])

  // Listen for custom notification events (from SSE)
  useEffect(() => {
    const handleNewNotification = () => {
      fetchNotifications()
    }

    window.addEventListener("newGeneralNotification", handleNewNotification)
    return () => window.removeEventListener("newGeneralNotification", handleNewNotification)
  }, [fetchNotifications])

  // Refresh when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchNotifications()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [fetchNotifications])

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications,
  }
}

// Hook for real-time general notification streaming
export function useGeneralNotificationStream() {
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    const eventSource = new EventSource("/api/general-notifications/stream")

    eventSource.onopen = () => {
      setIsConnected(true)
      console.log("📡 General notification stream connected")
    }

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setLastUpdate(new Date())

        if (data.type === "notifications") {
          // Trigger notification refresh
          window.dispatchEvent(new CustomEvent("newGeneralNotification", { detail: data }))
        }
      } catch (error) {
        console.error("Error parsing general notification stream data:", error)
      }
    }

    eventSource.onerror = () => {
      setIsConnected(false)
      console.log("❌ General notification stream disconnected")
    }

    return () => {
      eventSource.close()
      setIsConnected(false)
    }
  }, [])

  return { isConnected, lastUpdate }
}
