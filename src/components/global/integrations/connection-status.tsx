

// "use client"

// import { useState, useEffect } from "react"
// import { motion } from "framer-motion"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { CheckCircle, AlertTriangle, XCircle, RefreshCw, Loader2 } from "lucide-react"

// interface ConnectionStatusProps {
//   platform: string
//   accounts: { id: string; isActive: boolean }[]
//   onRefresh?: () => Promise<void>
//   isRefreshing?: boolean
// }

// export default function ConnectionStatus({
//   platform,
//   accounts = [], // Provide default empty array
//   onRefresh,
//   isRefreshing = false,
// }: ConnectionStatusProps) {
//   const [lastChecked, setLastChecked] = useState<Date>(new Date())

//   // Safely handle accounts array
//   const safeAccounts = Array.isArray(accounts) ? accounts : []
//   const activeAccounts = safeAccounts.filter((a) => a && a.isActive).length
//   const totalAccounts = safeAccounts.length

//   let status: "healthy" | "warning" | "error" = "healthy"

//   if (totalAccounts === 0) {
//     status = "error"
//   } else if (activeAccounts < totalAccounts) {
//     status = "warning"
//   }

//   const statusInfo = {
//     healthy: {
//       icon: <CheckCircle className="h-5 w-5 text-green-500" />,
//       color: "bg-green-100 dark:bg-green-900",
//       text: "All connections healthy",
//       badge: <Badge className="bg-green-600 hover:bg-green-700">Healthy</Badge>,
//     },
//     warning: {
//       icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
//       color: "bg-amber-100 dark:bg-amber-900",
//       text: "Some connections need attention",
//       badge: <Badge className="bg-amber-600 hover:bg-amber-700">Warning</Badge>,
//     },
//     error: {
//       icon: <XCircle className="h-5 w-5 text-red" />,
//       color: "bg-red-100 dark:bg-red-900",
//       text: "No active connections",
//       badge: <Badge className="bg-red-600 hover:bg-red-700">Disconnected</Badge>,
//     },
//   }

//   const handleRefresh = async () => {
//     if (onRefresh) {
//       try {
//         await onRefresh()
//         setLastChecked(new Date())
//       } catch (error) {
//         console.error("Error refreshing data:", error)
//       }
//     }
//   }

//   useEffect(() => {
//     // Simulate automatic refresh every 30 seconds
//     const interval = setInterval(() => {
//       setLastChecked(new Date())
//     }, 30000)

//     return () => clearInterval(interval)
//   }, [])

//   return (
//     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
//       <Card className="glassEffect">
//         <CardContent className="p-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <div className={`rounded-full p-2 ${statusInfo[status].color}`}>{statusInfo[status].icon}</div>
//               <div>
//                 <div className="flex items-center space-x-2">
//                   <h3 className="font-medium">Connection Status</h3>
//                   {statusInfo[status].badge}
//                 </div>
//                 <p className="text-sm text-muted-foreground">{statusInfo[status].text}</p>
//               </div>
//             </div>
//             <button
//               onClick={handleRefresh}
//               className="p-2 rounded-full hover:bg-muted transition-colors"
//               disabled={isRefreshing}
//             >
//               {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
//             </button>
//           </div>
//           <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
//             Last checked: {lastChecked.toLocaleTimeString()}
//             {totalAccounts > 0 && (
//               <span className="ml-2">
//                 • {activeAccounts}/{totalAccounts} accounts active
//               </span>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </motion.div>
//   )
// }

"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RefreshCw, CheckCircle2, AlertTriangle, XCircle, Wifi, WifiOff, Clock, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Account {
  id: string
  isActive: boolean
}

interface ConnectionStatusProps {
  platform: string
  accounts: Account[]
  onRefresh: () => Promise<void>
  isRefreshing?: boolean
  lastSynced?: Date | null
  className?: string
}

type HealthStatus = "healthy" | "warning" | "error" | "offline"

export function ConnectionStatus({
  platform,
  accounts,
  onRefresh,
  isRefreshing = false,
  lastSynced,
  className,
}: ConnectionStatusProps) {
  const [localRefreshing, setLocalRefreshing] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date>(new Date())

  const activeAccounts = accounts.filter((a) => a.isActive)
  const totalAccounts = accounts.length

  // Determine health status
  const getHealthStatus = (): HealthStatus => {
    if (totalAccounts === 0) return "offline"
    if (activeAccounts.length === 0) return "error"
    if (activeAccounts.length < totalAccounts) return "warning"
    return "healthy"
  }

  const healthStatus = getHealthStatus()

  const statusConfig = {
    healthy: {
      label: "All systems operational",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      icon: CheckCircle2,
      ringColor: "ring-emerald-500/20",
      glowColor: "shadow-emerald-500/20",
    },
    warning: {
      label: "Some accounts need attention",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      icon: AlertTriangle,
      ringColor: "ring-amber-500/20",
      glowColor: "shadow-amber-500/20",
    },
    error: {
      label: "Connection issues detected",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      icon: XCircle,
      ringColor: "ring-red-500/20",
      glowColor: "shadow-red-500/20",
    },
    offline: {
      label: "No accounts connected",
      color: "text-muted-foreground",
      bgColor: "bg-muted",
      borderColor: "border-border",
      icon: WifiOff,
      ringColor: "ring-border",
      glowColor: "",
    },
  }

  const config = statusConfig[healthStatus]
  const StatusIcon = config.icon

  const handleRefresh = useCallback(async () => {
    if (localRefreshing || isRefreshing) return
    setLocalRefreshing(true)
    try {
      await onRefresh()
      setLastChecked(new Date())
    } finally {
      setLocalRefreshing(false)
    }
  }, [localRefreshing, isRefreshing, onRefresh])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastChecked(new Date())
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  // Format relative time
  const formatRelativeTime = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    if (seconds < 60) return "Just now"
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  const isCurrentlyRefreshing = localRefreshing || isRefreshing

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-xl border p-4 transition-all duration-300",
        config.borderColor,
        config.bgColor,
        className,
      )}
    >
      {/* Animated background gradient */}
      <div
        className={cn(
          "absolute inset-0 opacity-50 transition-opacity duration-500",
          healthStatus === "healthy" && "bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent",
          healthStatus === "warning" && "bg-gradient-to-br from-amber-500/5 via-transparent to-transparent",
          healthStatus === "error" && "bg-gradient-to-br from-red-500/5 via-transparent to-transparent",
        )}
      />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Animated status indicator */}
            <div className="relative">
              <motion.div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full",
                  config.bgColor,
                  "ring-2",
                  config.ringColor,
                )}
                animate={
                  healthStatus === "healthy"
                    ? { scale: [1, 1.05, 1] }
                    : healthStatus === "warning" || healthStatus === "error"
                      ? { scale: [1, 1.02, 1] }
                      : {}
                }
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <StatusIcon className={cn("h-5 w-5", config.color)} />
              </motion.div>

              {/* Pulse ring for connected status */}
              {healthStatus === "healthy" && (
                <motion.div
                  className="absolute inset-0 rounded-full ring-2 ring-emerald-500/30"
                  animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-foreground">{platform}</h4>
                <AnimatePresence mode="wait">
                  {isCurrentlyRefreshing && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="text-xs text-muted-foreground"
                    >
                      Syncing...
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <p className={cn("text-sm", config.color)}>{config.label}</p>
            </div>
          </div>

          {/* Refresh button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isCurrentlyRefreshing}
            className="h-9 w-9 rounded-full"
          >
            <RefreshCw className={cn("h-4 w-4 transition-all", isCurrentlyRefreshing && "animate-spin text-primary")} />
          </Button>
        </div>

        {/* Stats row */}
        <div className="mt-4 flex items-center gap-4">
          {/* Active accounts indicator */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {totalAccounts > 0 ? (
                <>
                  <Wifi className={cn("h-4 w-4", config.color)} />
                  <span className="text-sm font-medium text-foreground">
                    {activeAccounts.length}/{totalAccounts}
                  </span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">No accounts</span>
                </>
              )}
            </div>
            <span className="text-xs text-muted-foreground">active</span>
          </div>

          {/* Divider */}
          <div className="h-4 w-px bg-border" />

          {/* Last synced */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>Last checked: {formatRelativeTime(lastSynced || lastChecked)}</span>
          </div>
        </div>

        {/* Health bar */}
        {totalAccounts > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <span>Connection health</span>
              <span>{Math.round((activeAccounts.length / totalAccounts) * 100)}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className={cn(
                  "h-full rounded-full",
                  healthStatus === "healthy" && "bg-emerald-500",
                  healthStatus === "warning" && "bg-amber-500",
                  healthStatus === "error" && "bg-red-500",
                )}
                initial={{ width: 0 }}
                animate={{ width: `${(activeAccounts.length / totalAccounts) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {/* Activity indicator */}
        {healthStatus === "healthy" && (
          <div className="mt-3 flex items-center gap-2 text-xs text-emerald-500">
            <Activity className="h-3.5 w-3.5" />
            <span>Real-time sync active</span>
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-emerald-500"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            />
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default ConnectionStatus
