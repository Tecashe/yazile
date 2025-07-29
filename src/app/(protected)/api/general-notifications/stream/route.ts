import type { NextRequest } from "next/server"
import { auth } from "@clerk/nextjs/server"
import {
  getGeneralNotifications,
  getGeneralNotificationCount,
} from "@/actions/notifications/general-notifications"
import { onUserInfor } from "@/actions/user"

export async function GET(request: NextRequest) {
  const  user  = await onUserInfor()
  const userId = user.data?.id

  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  const encoder = new TextEncoder()

  const customReadable = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const data = `data: ${JSON.stringify({ type: "connected", timestamp: new Date().toISOString() })}\n\n`
      controller.enqueue(encoder.encode(data))

      let lastNotificationCount = 0

      // Set up interval to check for new notifications
      const interval = setInterval(async () => {
        try {
          const [notifications, currentCount] = await Promise.all([
            getGeneralNotifications(5),
            getGeneralNotificationCount(),
          ])

          // Check if there are new notifications
          if (currentCount > lastNotificationCount) {
            const recentNotifications = notifications.filter(
              (n) => new Date(n.createdAt).getTime() > Date.now() - 60000, // Last minute
            )

            if (recentNotifications.length > 0) {
              const data = `data: ${JSON.stringify({
                type: "notifications",
                data: recentNotifications,
                count: currentCount,
                timestamp: new Date().toISOString(),
              })}\n\n`
              controller.enqueue(encoder.encode(data))
            }
          }

          lastNotificationCount = currentCount

          // Send heartbeat every 30 seconds
          const heartbeat = `data: ${JSON.stringify({
            type: "heartbeat",
            count: currentCount,
            timestamp: new Date().toISOString(),
          })}\n\n`
          controller.enqueue(encoder.encode(heartbeat))
        } catch (error) {
          console.error("Error in general notification stream:", error)
        }
      }, 30000)

      // Clean up on close
      request.signal.addEventListener("abort", () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new Response(customReadable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control",
    },
  })
}
