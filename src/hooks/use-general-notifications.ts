// "use client"

// import { useState, useEffect, useCallback } from "react"
// import {
//   getGeneralNotifications,
//   getGeneralNotificationCount,
//   markGeneralNotificationAsRead,
//   markAllGeneralNotificationsAsRead,
//   type GeneralNotificationData,
// } from "@/actions/notifications/general-notifications"

// export function useGeneralNotifications(businessId?: string) {
//   const [notifications, setNotifications] = useState<GeneralNotificationData[]>([])
//   const [unreadCount, setUnreadCount] = useState(0)
//   const [isLoading, setIsLoading] = useState(true)

//   // Fetch notifications
//   const fetchNotifications = useCallback(async () => {
//     try {
//       setIsLoading(true)
//       const [notificationData, count] = await Promise.all([
//         getGeneralNotifications(20, businessId),
//         getGeneralNotificationCount(businessId),
//       ])

//       setNotifications(notificationData)
//       setUnreadCount(count)
//     } catch (error) {
//       console.error("Error fetching general notifications:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }, [businessId])

//   // Mark notification as read
//   const markAsRead = useCallback(
//     async (notificationId: string) => {
//       try {
//         await markGeneralNotificationAsRead(notificationId)

//         // Update local state immediately for better UX
//         setNotifications((prev) =>
//           prev.map((n) => (n.id === notificationId ? { ...n, isRead: true, readAt: new Date() } : n)),
//         )
//         setUnreadCount((prev) => Math.max(0, prev - 1))
//       } catch (error) {
//         console.error("Error marking general notification as read:", error)
//         // Refresh to get correct state
//         fetchNotifications()
//       }
//     },
//     [fetchNotifications],
//   )

//   // Mark all as read
//   const markAllAsRead = useCallback(async () => {
//     try {
//       await markAllGeneralNotificationsAsRead(businessId)

//       // Update local state
//       setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, readAt: new Date() })))
//       setUnreadCount(0)
//     } catch (error) {
//       console.error("Error marking all general notifications as read:", error)
//       // Refresh to get correct state
//       fetchNotifications()
//     }
//   }, [businessId, fetchNotifications])

//   // Real-time polling
//   useEffect(() => {
//     fetchNotifications()

//     // Poll for new notifications every 30 seconds
//     const interval = setInterval(fetchNotifications, 30000)

//     return () => clearInterval(interval)
//   }, [fetchNotifications])

//   // Listen for custom notification events (from SSE)
//   useEffect(() => {
//     const handleNewNotification = () => {
//       fetchNotifications()
//     }

//     window.addEventListener("newGeneralNotification", handleNewNotification)
//     return () => window.removeEventListener("newGeneralNotification", handleNewNotification)
//   }, [fetchNotifications])

//   // Refresh when page becomes visible
//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (!document.hidden) {
//         fetchNotifications()
//       }
//     }

//     document.addEventListener("visibilitychange", handleVisibilityChange)
//     return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
//   }, [fetchNotifications])

//   return {
//     notifications,
//     unreadCount,
//     isLoading,
//     markAsRead,
//     markAllAsRead,
//     refresh: fetchNotifications,
//   }
// }

// // Hook for real-time general notification streaming
// export function useGeneralNotificationStream() {
//   const [isConnected, setIsConnected] = useState(false)
//   const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

//   useEffect(() => {
//     const eventSource = new EventSource("/api/general-notifications/stream")

//     eventSource.onopen = () => {
//       setIsConnected(true)
//       console.log("📡 General notification stream connected")
//     }

//     eventSource.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data)
//         setLastUpdate(new Date())

//         if (data.type === "notifications") {
//           // Trigger notification refresh
//           window.dispatchEvent(new CustomEvent("newGeneralNotification", { detail: data }))
//         }
//       } catch (error) {
//         console.error("Error parsing general notification stream data:", error)
//       }
//     }

//     eventSource.onerror = () => {
//       setIsConnected(false)
//       console.log("❌ General notification stream disconnected")
//     }

//     return () => {
//       eventSource.close()
//       setIsConnected(false)
//     }
//   }, [])

//   return { isConnected, lastUpdate }
// }

"use client"

import { useState, useEffect, useCallback, useRef } from "react"
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

  // Real-time polling fallback (when SSE is not available)
  useEffect(() => {
    fetchNotifications()

    // Fallback polling every 60 seconds (less frequent than SSE)
    const interval = setInterval(fetchNotifications, 60000)

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

// Enhanced hook for real-time notification streaming with robust error handling
export function useGeneralNotificationStream() {
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [connectionAttempts, setConnectionAttempts] = useState(0)
  const [isReconnecting, setIsReconnecting] = useState(false)

  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const maxReconnectAttempts = 5
  const baseReconnectDelay = 1000 // 1 second

  const cleanup = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    setIsConnected(false)
    setIsReconnecting(false)
  }, [])

  const connect = useCallback(() => {
    // Don't create multiple connections
    if (eventSourceRef.current?.readyState === EventSource.OPEN) {
      return
    }

    cleanup()

    try {
      const eventSource = new EventSource("/api/general-notifications/stream")
      eventSourceRef.current = eventSource

      eventSource.onopen = () => {
        setIsConnected(true)
        setIsReconnecting(false)
        setConnectionAttempts(0)
        console.log("📡 General notification stream connected")
      }

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          setLastUpdate(new Date())

          if (data.type === "notifications") {
            // Trigger notification refresh
            window.dispatchEvent(new CustomEvent("newGeneralNotification", { detail: data }))
          } else if (data.type === "heartbeat") {
            // Update last activity time
            setLastUpdate(new Date())
          }
        } catch (error) {
          console.error("Error parsing general notification stream data:", error)
        }
      }

      eventSource.onerror = (error) => {
        console.log("❌ General notification stream error:", error)
        setIsConnected(false)

        // Only attempt reconnection if we haven't exceeded max attempts
        if (connectionAttempts < maxReconnectAttempts) {
          setIsReconnecting(true)
          const delay = Math.min(baseReconnectDelay * Math.pow(2, connectionAttempts), 30000) // Max 30 seconds

          reconnectTimeoutRef.current = setTimeout(() => {
            setConnectionAttempts((prev) => prev + 1)
            connect()
          }, delay)

          console.log(`🔄 Reconnecting in ${delay}ms (attempt ${connectionAttempts + 1}/${maxReconnectAttempts})`)
        } else {
          console.log("🚫 Max reconnection attempts reached, falling back to polling")
          setIsReconnecting(false)
        }
      }
    } catch (error) {
      console.error("Error creating EventSource:", error)
      setIsConnected(false)
      setIsReconnecting(false)
    }
  }, [connectionAttempts, cleanup])

  // Manual reconnect function
  const reconnect = useCallback(() => {
    setConnectionAttempts(0)
    connect()
  }, [connect])

  useEffect(() => {
    connect()

    // Cleanup on unmount
    return cleanup
  }, [connect, cleanup])

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, close connection to save resources
        cleanup()
      } else {
        // Page is visible, reconnect
        setTimeout(() => {
          if (!eventSourceRef.current || eventSourceRef.current.readyState !== EventSource.OPEN) {
            connect()
          }
        }, 1000) // Small delay to avoid rapid reconnections
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [connect, cleanup])

  // Connection health check
  useEffect(() => {
    const healthCheck = setInterval(() => {
      if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
        console.log("🔍 Connection health check: reconnecting closed connection")
        connect()
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(healthCheck)
  }, [connect])

  return {
    isConnected,
    lastUpdate,
    isReconnecting,
    connectionAttempts,
    maxReconnectAttempts,
    reconnect,
  }
}

