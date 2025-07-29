"use client"

import { useState } from "react"
import { Bell, CheckCheck, Clock, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useGeneralNotifications, useGeneralNotificationStream } from "@/hooks/use-general-notifications"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

const notificationIcons = {
  lead: "👤",
  automation: "🤖",
  campaign: "📢",
  influencer: "⭐",
  workflow: "⚙️",
  crm: "💼",
  system: "🔔",
}

const notificationColors = {
  lead: "bg-green-100 text-green-800 border-green-200",
  automation: "bg-blue-100 text-blue-800 border-blue-200",
  campaign: "bg-purple-100 text-purple-800 border-purple-200",
  influencer: "bg-yellow-100 text-yellow-800 border-yellow-200",
  workflow: "bg-orange-100 text-orange-800 border-orange-200",
  crm: "bg-indigo-100 text-indigo-800 border-indigo-200",
  system: "bg-red-100 text-red-800 border-red-200",
}

export function NotificationDropdown() {
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useGeneralNotifications()
  const { isConnected } = useGeneralNotificationStream()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id)
    if (notification.actionUrl) {
      router.push(notification.actionUrl)
    }
    setIsOpen(false)
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1"
              >
                <Badge
                  variant="destructive"
                  className="h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center animate-pulse"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Connection indicator */}
          <div
            className={cn(
              "absolute -bottom-1 -right-1 w-2 h-2 rounded-full",
              isConnected ? "bg-green-500" : "bg-gray-400",
            )}
          />
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <DropdownMenuLabel className="text-base font-semibold">
            Notifications
            {isConnected && (
              <Badge variant="outline" className="ml-2 text-xs">
                🟢 Live
              </Badge>
            )}
          </DropdownMenuLabel>

          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-7">
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="h-96">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
              <p className="text-xs text-muted-foreground">We&apos;ll notify you when something happens</p>
            </div>
          ) : (
            <div className="p-2">
              <AnimatePresence>
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <DropdownMenuItem
                      className={cn(
                        "flex flex-col items-start p-3 cursor-pointer space-y-2 mb-2 rounded-lg transition-all duration-200",
                        !notification.isRead && "bg-accent/50 border-l-4 border-l-primary",
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start justify-between w-full">
                        <div className="flex items-start space-x-3 flex-1">
                          {/* <div className="text-lg">{notificationIcons[notification.type]}</div> */}
                          <div className="text-lg">{notificationIcons[notification.type as keyof typeof notificationIcons]}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium truncate">{notification.title}</p>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                            <div className="flex items-center justify-between mt-2">
                              {/* <Badge variant="outline" className={cn("text-xs", notificationColors[notification.type])}> */}
                              <Badge variant="outline" className={cn("text-xs", notificationColors[notification.type as keyof typeof notificationColors])}>
                                {notification.type}
                              </Badge>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatTimeAgo(notification.createdAt)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {notification.actionUrl && (
                          <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0 ml-2" />
                        )}
                      </div>
                    </DropdownMenuItem>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button variant="ghost" className="w-full text-sm" asChild>
                <a href="/dashboard/notifications">
                  View all notifications
                  <ExternalLink className="h-3 w-3 ml-2" />
                </a>
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
