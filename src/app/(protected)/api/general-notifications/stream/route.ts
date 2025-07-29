// import type { NextRequest } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import {
//   getGeneralNotifications,
//   getGeneralNotificationCount,
// } from "@/actions/notifications/general-notifications"
// import { onUserInfor } from "@/actions/user"

// export async function GET(request: NextRequest) {
//   const  user  = await onUserInfor()
//   const userId = user.data?.id

//   if (!userId) {
//     return new Response("Unauthorized", { status: 401 })
//   }

//   const encoder = new TextEncoder()

//   const customReadable = new ReadableStream({
//     start(controller) {
//       // Send initial connection message
//       const data = `data: ${JSON.stringify({ type: "connected", timestamp: new Date().toISOString() })}\n\n`
//       controller.enqueue(encoder.encode(data))

//       let lastNotificationCount = 0

//       // Set up interval to check for new notifications
//       const interval = setInterval(async () => {
//         try {
//           const [notifications, currentCount] = await Promise.all([
//             getGeneralNotifications(5),
//             getGeneralNotificationCount(),
//           ])

//           // Check if there are new notifications
//           if (currentCount > lastNotificationCount) {
//             const recentNotifications = notifications.filter(
//               (n) => new Date(n.createdAt).getTime() > Date.now() - 60000, // Last minute
//             )

//             if (recentNotifications.length > 0) {
//               const data = `data: ${JSON.stringify({
//                 type: "notifications",
//                 data: recentNotifications,
//                 count: currentCount,
//                 timestamp: new Date().toISOString(),
//               })}\n\n`
//               controller.enqueue(encoder.encode(data))
//             }
//           }

//           lastNotificationCount = currentCount

//           // Send heartbeat every 30 seconds
//           const heartbeat = `data: ${JSON.stringify({
//             type: "heartbeat",
//             count: currentCount,
//             timestamp: new Date().toISOString(),
//           })}\n\n`
//           controller.enqueue(encoder.encode(heartbeat))
//         } catch (error) {
//           console.error("Error in general notification stream:", error)
//         }
//       }, 30000)

//       // Clean up on close
//       request.signal.addEventListener("abort", () => {
//         clearInterval(interval)
//         controller.close()
//       })
//     },
//   })

//   return new Response(customReadable, {
//     headers: {
//       "Content-Type": "text/event-stream",
//       "Cache-Control": "no-cache",
//       Connection: "keep-alive",
//       "Access-Control-Allow-Origin": "*",
//       "Access-Control-Allow-Headers": "Cache-Control",
//     },
//   })
// }


import type { NextRequest } from "next/server"
import { auth } from "@clerk/nextjs/server"
import {
  getGeneralNotifications,
  getGeneralNotificationCount,
} from "@/actions/notifications/general-notifications"
import { onUserInfor } from "@/actions/user";

// Connection management
const connections = new Map<string, { controller: ReadableStreamDefaultController; lastPing: number }>()

export async function GET(request: NextRequest) {
  const  user  = await onUserInfor()
  const userId = user.data?.id

  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  const encoder = new TextEncoder()
  const connectionId = `${userId}-${Date.now()}`
  let heartbeatInterval: NodeJS.Timeout | null = null
  let dataCheckInterval: NodeJS.Timeout | null = null
  let controller: ReadableStreamDefaultController | null = null

  const cleanup = () => {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval)
      heartbeatInterval = null
    }
    if (dataCheckInterval) {
      clearInterval(dataCheckInterval)
      dataCheckInterval = null
    }
    connections.delete(connectionId)

    try {
      if (controller) {
        controller.close()
      }
    } catch (error) {
      // Controller might already be closed
    }
  }

  const customReadable = new ReadableStream({
    start(_controller) {
      controller = _controller

      // Store connection for management
      connections.set(connectionId, { controller, lastPing: Date.now() })

      // Send initial connection message
      const initialData = `data: ${JSON.stringify({
        type: "connected",
        connectionId,
        timestamp: new Date().toISOString(),
      })}\n\n`

      try {
        controller.enqueue(encoder.encode(initialData))
      } catch (error) {
        console.error("Error sending initial data:", error)
        cleanup()
        return
      }

      let lastNotificationCount = 0

      // Heartbeat to keep connection alive (every 15 seconds)
      heartbeatInterval = setInterval(() => {
        try {
            const connection = connections.get(connectionId)
            if (!connection || !controller) { // Add controller null check
            cleanup()
            return
            }

            const heartbeat = `data: ${JSON.stringify({
            type: "heartbeat",
            timestamp: new Date().toISOString(),
            connectionId,
            })}\n\n`

            controller.enqueue(encoder.encode(heartbeat))
            connection.lastPing = Date.now()
        } catch (error) {
            console.error("Error sending heartbeat:", error)
            cleanup()
        }
        }, 15000)

      // Check for new notifications (every 30 seconds)
      dataCheckInterval = setInterval(async () => {
        try {
          const connection = connections.get(connectionId)
          if (!connection) {
            cleanup()
            return
          }

          const [notifications, currentCount] = await Promise.all([
            getGeneralNotifications(5),
            getGeneralNotificationCount(),
          ])

          // Check if there are new notifications
          if (currentCount > lastNotificationCount) {
                const recentNotifications = notifications.filter(
                    (n) => new Date(n.createdAt).getTime() > Date.now() - 60000, // Last minute
                )
                
                if (recentNotifications.length > 0 && controller) { // Add null check here
                    const data = `data: ${JSON.stringify({
                    type: "notifications",
                    data: recentNotifications,
                    count: currentCount,
                    timestamp: new Date().toISOString(),
                    connectionId,
                    })}\n\n`
                    
                    controller.enqueue(encoder.encode(data))
                }
                }
        //   if (currentCount > lastNotificationCount) {
        //     const recentNotifications = notifications.filter(
        //       (n) => new Date(n.createdAt).getTime() > Date.now() - 60000, // Last minute
        //     )

        //     if (recentNotifications.length > 0) {
        //       const data = `data: ${JSON.stringify({
        //         type: "notifications",
        //         data: recentNotifications,
        //         count: currentCount,
        //         timestamp: new Date().toISOString(),
        //         connectionId,
        //       })}\n\n`

        //       controller.enqueue(encoder.encode(data))
        //     }
        //   }

          lastNotificationCount = currentCount
        } catch (error) {
          console.error("Error checking notifications:", error)
          // Don't cleanup on data errors, just log them
        }
      }, 30000)

      // Handle client disconnect
      request.signal.addEventListener("abort", () => {
        console.log(`SSE connection aborted for user ${userId}`)
        cleanup()
      })

      // Handle errors
      controller.error = (error: any) => {
        console.error("SSE controller error:", error)
        cleanup()
      }
    },
  })

  return new Response(customReadable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control",
      "X-Accel-Buffering": "no", // Disable nginx buffering
    },
  })
}

// Cleanup stale connections (run periodically)
setInterval(() => {
  const now = Date.now()
  const staleThreshold = 60000 // 1 minute
  
  for (const [connectionId, connection] of Array.from(connections.entries())) {
    if (now - connection.lastPing > staleThreshold) {
      console.log(`Cleaning up stale connection: ${connectionId}`)
      try {
        connection.controller.close()
      } catch (error) {
        // Ignore errors when closing stale connections
      }
      connections.delete(connectionId)
    }
  }
}, 30000) // Check every 30 seconds