// "use client"

// import type { ReactNode } from "react"
// import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Plus, CheckCircle2, Loader2 } from "lucide-react"
// import { useQuery } from "@tanstack/react-query"
// import { onUserInfo } from "@/actions/user"
// import { onOAuthInstagram } from "@/actions/integrations"
// import { useState } from "react"

// interface IntegrationCardProps {
//   title: string
//   description: string
//   icon: ReactNode
//   strategy: "INSTAGRAM" | "CRM"
//   category?:string
// }

// export default function IntegrationCard({ title, description, icon, strategy }: IntegrationCardProps) {
//   const [isConnecting, setIsConnecting] = useState(false)

//   // Fetch user data to check if integration exists
//   const { data } = useQuery({
//     queryKey: ["user-profile"],
//     queryFn: onUserInfo,
//   })

//   // Check if this integration is already connected
//   const integrated = data?.data?.integrations?.find((integration: any) => integration.name === strategy)

//   const connectedCount = integrated ? 1 : 0
//   const activeCount = integrated ? 1 : 0

//   const handleConnect = async () => {
//     setIsConnecting(true)
//     try {
//       // This will redirect to Instagram OAuth
//       await onOAuthInstagram(strategy)
//     } catch (error) {
//       console.error("Error connecting:", error)
//       setIsConnecting(false)
//     }
//   }

//   return (
//     <Card className="overflow-hidden border-2 border-blue-100 dark:border-blue-900 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 hoverScale glowHover">
//       <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 pb-8 radial--gradient--pink">
//         <div className="flex justify-between items-start">
//           <div className="bg-white dark:bg-blue-800 p-3 rounded-lg shadow-sm">{icon}</div>
//           <Badge
//             variant={connectedCount > 0 ? "default" : "outline"}
//             className={connectedCount > 0 ? "bg-blue-600 dark:bg-blue-700" : ""}
//           >
//             {connectedCount > 0 ? `${activeCount}/${connectedCount} Connected` : "Not Connected"}
//           </Badge>
//         </div>
//       </CardHeader>
//       <CardContent className="pt-6">
//         <div className="space-y-2">
//           <h3 className="font-bold text-xl">{title}</h3>
//           <p className="text-muted-foreground text-sm">{description}</p>
//         </div>
//       </CardContent>
//       <CardFooter className="flex justify-between border-t p-4">
//         <div className="flex items-center text-sm text-muted-foreground">
//           {connectedCount > 0 ? <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> : null}
//           {connectedCount === 0
//             ? "No accounts connected"
//             : connectedCount === 1
//               ? "1 account connected"
//               : `${connectedCount} accounts connected`}
//         </div>
//         <Button
//           size="sm"
//           onClick={handleConnect}
//           disabled={isConnecting || integrated?.name === strategy}
//           className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800"
//         >
//           {isConnecting ? (
//             <>
//               <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Connecting...
//             </>
//           ) : integrated ? (
//             "Connected"
//           ) : (
//             <>
//               <Plus className="h-4 w-4 mr-1" /> Connect
//             </>
//           )}
//         </Button>
//       </CardFooter>
//     </Card>
//   )
// }

// "use client"

// import type { ReactNode } from "react"
// import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Plus, CheckCircle2, Loader2 } from "lucide-react"
// import { useQuery } from "@tanstack/react-query"
// import { onUserInfo } from "@/actions/user"
// import { onOAuthInstagram } from "@/actions/integrations"
// import { useState } from "react"

// interface IntegrationCardProps {
//   title: string
//   description: string
//   icon: ReactNode
//   strategy: "INSTAGRAM" | "CRM"
//   category?: string
// }

// export default function IntegrationCard({ title, description, icon, strategy }: IntegrationCardProps) {
//   const [isConnecting, setIsConnecting] = useState(false)

//   // Fetch user data to check if integration exists
//   const { data } = useQuery({
//     queryKey: ["user-profile"],
//     queryFn: onUserInfo,
//   })

//   // Check if this integration is already connected
//   const integrated = data?.data?.integrations?.find((integration: any) => integration.name === strategy)

//   const connectedCount = integrated ? 1 : 0
//   const activeCount = integrated ? 1 : 0

//   const handleConnect = async () => {
//     setIsConnecting(true)
//     try {
//       // This will redirect to Instagram OAuth
//       await onOAuthInstagram(strategy)
//     } catch (error) {
//       console.error("Error connecting:", error)
//       setIsConnecting(false)
//     }
//   }

//   return (
//     <Card className="overflow-hidden border-2 border-border hover:border-ring/50 transition-all duration-300 hoverScale glowHover bg-card">
//       <CardHeader className="bg-secondary/30 dark:bg-secondary/20 pb-8">
//         <div className="flex justify-between items-start">
//           <div className="bg-background dark:bg-secondary p-3 rounded-lg shadow-sm border border-border">{icon}</div>
//           <Badge
//             variant={connectedCount > 0 ? "default" : "outline"}
//             className={connectedCount > 0 ? "bg-primary text-primary-foreground" : ""}
//           >
//             {connectedCount > 0 ? `${activeCount}/${connectedCount} Connected` : "Not Connected"}
//           </Badge>
//         </div>
//       </CardHeader>
//       <CardContent className="pt-6">
//         <div className="space-y-2">
//           <h3 className="font-bold text-xl text-foreground">{title}</h3>
//           <p className="text-muted-foreground text-sm">{description}</p>
//         </div>
//       </CardContent>
//       <CardFooter className="flex justify-between border-t border-border p-4">
//         <div className="flex items-center text-sm text-muted-foreground">
//           {connectedCount > 0 ? <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> : null}
//           {connectedCount === 0
//             ? "No accounts connected"
//             : connectedCount === 1
//               ? "1 account connected"
//               : `${connectedCount} accounts connected`}
//         </div>
//         <Button
//           size="sm"
//           onClick={handleConnect}
//           disabled={isConnecting || integrated?.name === strategy}
//           className="bg-primary text-primary-foreground hover:bg-primary/90"
//         >
//           {isConnecting ? (
//             <>
//               <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Connecting...
//             </>
//           ) : integrated ? (
//             "Connected"
//           ) : (
//             <>
//               <Plus className="h-4 w-4 mr-1" /> Connect
//             </>
//           )}
//         </Button>
//       </CardFooter>
//     </Card>
//   )
// }


// "use client"

// import type { ReactNode } from "react"
// import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Plus, CheckCircle2, Loader2 } from "lucide-react"
// import { useQuery } from "@tanstack/react-query"
// import { onUserInfo } from "@/actions/user"
// import { onOAuthInstagram } from "@/actions/integrations"
// import { useState } from "react"

// interface IntegrationCardProps {
//   title: string
//   description: string
//   icon: ReactNode
//   strategy: "INSTAGRAM" | "CRM"
//   category?: string
// }

// export default function IntegrationCard({ title, description, icon, strategy }: IntegrationCardProps) {
//   const [isConnecting, setIsConnecting] = useState(false)

//   // Fetch user data to check if integration exists
//   const { data } = useQuery({
//     queryKey: ["user-profile"],
//     queryFn: onUserInfo,
//   })

//   // Check if this integration is already connected
//   const integrated = data?.data?.integrations?.find((integration: any) => integration.name === strategy)

//   const connectedCount = integrated ? 1 : 0
//   const activeCount = integrated ? 1 : 0

//   const handleConnect = async () => {
//     setIsConnecting(true)
//     try {
//       if (strategy === "INSTAGRAM") {
//         // This will redirect to Instagram OAuth
//         await onOAuthInstagram(strategy)
//       } else if (strategy === "CRM") {
//         // Redirect to CRM configuration page
//         window.location.href = "/integrations/crm"
//       }
//     } catch (error) {
//       console.error("Error connecting:", error)
//       setIsConnecting(false)
//     }
//   }

//   return (
//     <Card className="overflow-hidden border-2 border-border hover:border-ring/50 transition-all duration-300 hoverScale glowHover bg-card">
//       <CardHeader className="bg-secondary/30 dark:bg-secondary/20 pb-8">
//         <div className="flex justify-between items-start">
//           <div className="bg-background dark:bg-secondary p-3 rounded-lg shadow-sm border border-border">{icon}</div>
//           <Badge
//             variant={connectedCount > 0 ? "default" : "outline"}
//             className={connectedCount > 0 ? "bg-primary text-primary-foreground" : ""}
//           >
//             {connectedCount > 0 ? `${activeCount}/${connectedCount} Connected` : "Not Connected"}
//           </Badge>
//         </div>
//       </CardHeader>
//       <CardContent className="pt-6">
//         <div className="space-y-2">
//           <h3 className="font-bold text-xl text-foreground">{title}</h3>
//           <p className="text-muted-foreground text-sm">{description}</p>
//         </div>
//       </CardContent>
//       <CardFooter className="flex justify-between border-t border-border p-4">
//         <div className="flex items-center text-sm text-muted-foreground">
//           {connectedCount > 0 ? <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> : null}
//           {connectedCount === 0
//             ? "No accounts connected"
//             : connectedCount === 1
//               ? "1 account connected"
//               : `${connectedCount} accounts connected`}
//         </div>
//         <Button
//           size="sm"
//           onClick={handleConnect}
//           disabled={isConnecting || integrated?.name === strategy}
//           className="bg-primary text-primary-foreground hover:bg-primary/90"
//         >
//           {isConnecting ? (
//             <>
//               <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Connecting...
//             </>
//           ) : integrated ? (
//             "Connected"
//           ) : (
//             <>
//               <Plus className="h-4 w-4 mr-1" /> Connect
//             </>
//           )}
//         </Button>
//       </CardFooter>
//     </Card>
//   )
// }


// "use client"

// import type React from "react"

// import { useState, useCallback } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { Check, ExternalLink, Loader2, AlertCircle, Zap } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { cn } from "@/lib/utils"
// import { useIntegrations, type IntegrationStrategy, type ConnectionStatus } from "@/hooks/use-integration"

// interface IntegrationCardProps {
//   title: string
//   description: string
//   icon: React.ReactNode
//   strategy: IntegrationStrategy
//   category?: string
//   features?: string[]
//   comingSoon?: boolean
//   onUserInfo: () => Promise<{ status: number; data?: any }>
//   onConnect: (strategy: IntegrationStrategy) => Promise<void>
// }

// export function IntegrationCard({
//   title,
//   description,
//   icon,
//   strategy,
//   category,
//   features,
//   comingSoon = false,
//   onUserInfo,
//   onConnect,
// }: IntegrationCardProps) {
//   const [isHovered, setIsHovered] = useState(false)
//   const [localConnecting, setLocalConnecting] = useState(false)

//   const { getConnectionStatus, getIntegration, startConnection, isLoading } = useIntegrations({
//     onUserInfo,
//   })

//   const connectionStatus = getConnectionStatus(strategy)
//   const integration = getIntegration(strategy)
//   const isConnected = connectionStatus === "connected"
//   const isConnecting = connectionStatus === "connecting" || localConnecting

//   const handleConnect = useCallback(async () => {
//     if (comingSoon || isConnected || isConnecting) return

//     setLocalConnecting(true)
//     startConnection(strategy)

//     try {
//       await onConnect(strategy)
//     } catch (error) {
//       setLocalConnecting(false)
//       console.error("Connection error:", error)
//     }
//   }, [comingSoon, isConnected, isConnecting, strategy, startConnection, onConnect])

//   const getStatusConfig = (status: ConnectionStatus) => {
//     switch (status) {
//       case "connected":
//         return {
//           label: "Connected",
//           color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
//           dotColor: "bg-emerald-500",
//           icon: <Check className="h-3 w-3" />,
//         }
//       case "connecting":
//         return {
//           label: "Connecting...",
//           color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
//           dotColor: "bg-amber-500",
//           icon: <Loader2 className="h-3 w-3 animate-spin" />,
//         }
//       case "refreshing":
//         return {
//           label: "Syncing",
//           color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
//           dotColor: "bg-blue-500",
//           icon: <Loader2 className="h-3 w-3 animate-spin" />,
//         }
//       case "error":
//         return {
//           label: "Error",
//           color: "bg-red-500/10 text-red-500 border-red-500/20",
//           dotColor: "bg-red-500",
//           icon: <AlertCircle className="h-3 w-3" />,
//         }
//       default:
//         return {
//           label: "Not connected",
//           color: "bg-muted text-muted-foreground border-border",
//           dotColor: "bg-muted-foreground",
//           icon: null,
//         }
//     }
//   }

//   const statusConfig = getStatusConfig(connectionStatus)

//   if (isLoading) {
//     return (
//       <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6">
//         <div className="flex items-start gap-4">
//           <div className="h-12 w-12 animate-pulse rounded-xl bg-muted" />
//           <div className="flex-1 space-y-2">
//             <div className="h-5 w-32 animate-pulse rounded bg-muted" />
//             <div className="h-4 w-full animate-pulse rounded bg-muted" />
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <motion.div
//       className={cn(
//         "group relative overflow-hidden rounded-xl border transition-all duration-300",
//         isConnected
//           ? "border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-card to-card"
//           : "border-border bg-card hover:border-primary/30",
//         comingSoon && "opacity-60",
//       )}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       whileHover={{ y: -2 }}
//       transition={{ duration: 0.2 }}
//     >
//       {/* Glassmorphism overlay on hover */}
//       <AnimatePresence>
//         {isHovered && !comingSoon && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none"
//           />
//         )}
//       </AnimatePresence>

//       {/* Connected glow effect */}
//       {isConnected && (
//         <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
//       )}

//       <div className="relative p-6">
//         {/* Header */}
//         <div className="flex items-start justify-between gap-4">
//           <div className="flex items-start gap-4">
//             {/* Icon with animated ring */}
//             <div className="relative">
//               <motion.div
//                 className={cn(
//                   "flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300",
//                   isConnected
//                     ? "bg-emerald-500/10 text-emerald-500"
//                     : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
//                 )}
//                 whileHover={{ scale: 1.05 }}
//               >
//                 {icon}
//               </motion.div>
//               {isConnected && (
//                 <motion.div
//                   className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg"
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   transition={{ type: "spring", stiffness: 500, damping: 25 }}
//                 >
//                   <Check className="h-3 w-3" />
//                 </motion.div>
//               )}
//             </div>

//             {/* Title and description */}
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center gap-2">
//                 <h3 className="font-semibold text-foreground truncate">{title}</h3>
//                 {category && (
//                   <Badge variant="outline" className="text-xs font-normal">
//                     {category}
//                   </Badge>
//                 )}
//               </div>
//               <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{description}</p>
//             </div>
//           </div>

//           {/* Status badge */}
//           <Badge
//             variant="outline"
//             className={cn("shrink-0 gap-1.5 transition-colors duration-300", statusConfig.color)}
//           >
//             {statusConfig.icon}
//             <span className="relative flex h-2 w-2">
//               <span
//                 className={cn(
//                   "absolute inline-flex h-full w-full rounded-full opacity-75",
//                   statusConfig.dotColor,
//                   (isConnecting || connectionStatus === "refreshing") && "animate-ping",
//                 )}
//               />
//               <span className={cn("relative inline-flex h-2 w-2 rounded-full", statusConfig.dotColor)} />
//             </span>
//             {statusConfig.label}
//           </Badge>
//         </div>

//         {/* Connected account info */}
//         <AnimatePresence>
//           {isConnected && integration && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: "auto" }}
//               exit={{ opacity: 0, height: 0 }}
//               transition={{ duration: 0.2 }}
//               className="mt-4 overflow-hidden"
//             >
//               <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
//                 {integration.profilePicture ? (
//                   <img
//                     src={integration.profilePicture || "/placeholder.svg"}
//                     alt={integration.username || "Profile"}
//                     className="h-8 w-8 rounded-full object-cover ring-2 ring-background"
//                   />
//                 ) : (
//                   <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">
//                     {integration.username?.charAt(0).toUpperCase() || "?"}
//                   </div>
//                 )}
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-medium text-foreground truncate">@{integration.username || "Unknown"}</p>
//                   {integration.followersCount !== null && (
//                     <p className="text-xs text-muted-foreground">
//                       {integration.followersCount?.toLocaleString()} followers
//                     </p>
//                   )}
//                 </div>
//                 <Zap className="h-4 w-4 text-emerald-500" />
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Features list */}
//         {features && features.length > 0 && (
//           <div className="mt-4 flex flex-wrap gap-2">
//             {features.slice(0, 3).map((feature, index) => (
//               <span
//                 key={index}
//                 className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
//               >
//                 {feature}
//               </span>
//             ))}
//             {features.length > 3 && (
//               <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
//                 +{features.length - 3} more
//               </span>
//             )}
//           </div>
//         )}

//         {/* Action button */}
//         <div className="mt-4">
//           {comingSoon ? (
//             <Button variant="outline" disabled className="w-full bg-transparent">
//               Coming Soon
//             </Button>
//           ) : isConnected ? (
//             <Button variant="outline" className="w-full group/btn bg-transparent" asChild>
//               <a href={`/integrations/${strategy.toLowerCase()}`}>
//                 Manage Integration
//                 <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
//               </a>
//             </Button>
//           ) : (
//             <Button
//               onClick={handleConnect}
//               disabled={isConnecting}
//               className={cn("w-full transition-all duration-300", isConnecting && "bg-amber-500 hover:bg-amber-600")}
//             >
//               {isConnecting ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Connecting...
//                 </>
//               ) : (
//                 <>
//                   Connect {title}
//                   <ExternalLink className="ml-2 h-4 w-4" />
//                 </>
//               )}
//             </Button>
//           )}
//         </div>
//       </div>
//     </motion.div>
//   )
// }
"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ExternalLink, Loader2, AlertCircle, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useIntegrations, type IntegrationStrategy, type ConnectionStatus } from "@/hooks/use-integration"

interface IntegrationCardProps {
  title: string
  description: string
  icon: React.ReactNode
  strategy: IntegrationStrategy
  category?: string
  features?: string[]
  comingSoon?: boolean
  onUserInfo: () => Promise<{ status: number; data?: any }>
  onConnect: (strategy: IntegrationStrategy) => Promise<void>
}

export function IntegrationCard({
  title,
  description,
  icon,
  strategy,
  category,
  features,
  comingSoon = false,
  onUserInfo,
  onConnect,
}: IntegrationCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [localConnecting, setLocalConnecting] = useState(false)

  const { getConnectionStatus, getIntegration, startConnection, isLoading } = useIntegrations({
    onUserInfo,
  })

  const connectionStatus = getConnectionStatus(strategy)
  const integration = getIntegration(strategy)
  const isConnected = connectionStatus === "connected"
  const isConnecting = connectionStatus === "connecting" || localConnecting

  const handleConnect = useCallback(async () => {
    if (comingSoon || isConnected || isConnecting) return

    setLocalConnecting(true)
    startConnection(strategy)

    try {
      await onConnect(strategy)
    } catch (error) {
      setLocalConnecting(false)
      console.error("Connection error:", error)
    }
  }, [comingSoon, isConnected, isConnecting, strategy, startConnection, onConnect])

  const getStatusConfig = (status: ConnectionStatus) => {
    switch (status) {
      case "connected":
        return {
          label: "Connected",
          color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
          dotColor: "bg-emerald-500",
          icon: <Check className="h-3 w-3" />,
        }
      case "connecting":
        return {
          label: "Connecting...",
          color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
          dotColor: "bg-amber-500",
          icon: <Loader2 className="h-3 w-3 animate-spin" />,
        }
      case "refreshing":
        return {
          label: "Syncing",
          color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
          dotColor: "bg-blue-500",
          icon: <Loader2 className="h-3 w-3 animate-spin" />,
        }
      case "error":
        return {
          label: "Error",
          color: "bg-red-500/10 text-red-500 border-red-500/20",
          dotColor: "bg-red-500",
          icon: <AlertCircle className="h-3 w-3" />,
        }
      default:
        return {
          label: "Not connected",
          color: "bg-muted text-muted-foreground border-border",
          dotColor: "bg-muted-foreground",
          icon: null,
        }
    }
  }

  const statusConfig = getStatusConfig(connectionStatus)

  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 animate-pulse rounded-xl bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-32 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden rounded-xl border transition-all duration-300",
        isConnected
          ? "border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-card to-card"
          : "border-border bg-card hover:border-primary/30",
        comingSoon && "opacity-60",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {/* Glassmorphism overlay on hover */}
      <AnimatePresence>
        {isHovered && !comingSoon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Connected glow effect */}
      {isConnected && (
        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      )}

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Icon with animated ring */}
            <div className="relative">
              <motion.div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300 overflow-hidden",
                  isConnected
                    ? "bg-emerald-500/10 text-emerald-500 ring-2 ring-emerald-500/30"
                    : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
                )}
                whileHover={{ scale: 1.05 }}
              >
                {isConnected && integration?.profilePicture ? (
                  <img
                    src={integration.profilePicture || "/placeholder.svg"}
                    alt={integration.username || title}
                    className="h-full w-full object-cover"
                    crossOrigin="anonymous"
                  />
                ) : (
                  icon
                )}
              </motion.div>
              {isConnected && (
                <motion.div
                  className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                  <Check className="h-3 w-3" />
                </motion.div>
              )}
            </div>

            {/* Title and description */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground truncate">{title}</h3>
                {category && (
                  <Badge variant="outline" className="text-xs font-normal">
                    {category}
                  </Badge>
                )}
              </div>
              {isConnected && integration?.username ? (
                <p className="mt-0.5 text-sm font-medium text-primary">@{integration.username}</p>
              ) : null}
              <p
                className={cn(
                  "text-sm text-muted-foreground line-clamp-2",
                  isConnected && integration?.username ? "mt-0.5" : "mt-1",
                )}
              >
                {description}
              </p>
            </div>
          </div>

          {/* Status badge */}
          <Badge
            variant="outline"
            className={cn("shrink-0 gap-1.5 transition-colors duration-300", statusConfig.color)}
          >
            {statusConfig.icon}
            <span className="relative flex h-2 w-2">
              <span
                className={cn(
                  "absolute inline-flex h-full w-full rounded-full opacity-75",
                  statusConfig.dotColor,
                  (isConnecting || connectionStatus === "refreshing") && "animate-ping",
                )}
              />
              <span className={cn("relative inline-flex h-2 w-2 rounded-full", statusConfig.dotColor)} />
            </span>
            {statusConfig.label}
          </Badge>
        </div>

        {/* Connected account info */}
        <AnimatePresence>
          {isConnected && integration && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 overflow-hidden"
            >
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                {integration.profilePicture ? (
                  <img
                    src={integration.profilePicture || "/placeholder.svg"}
                    alt={integration.username || "Profile"}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-background"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {integration.username?.charAt(0).toUpperCase() || "?"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">@{integration.username || "Unknown"}</p>
                  {integration.followersCount !== null && (
                    <p className="text-xs text-muted-foreground">
                      {integration.followersCount?.toLocaleString()} followers
                    </p>
                  )}
                </div>
                <Zap className="h-4 w-4 text-emerald-500" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features list */}
        {features && features.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
              >
                {feature}
              </span>
            ))}
            {features.length > 3 && (
              <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                +{features.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Action button */}
        <div className="mt-4">
          {comingSoon ? (
            <Button variant="outline" disabled className="w-full bg-transparent">
              Coming Soon
            </Button>
          ) : isConnected ? (
            <Button variant="outline" className="w-full group/btn bg-transparent" asChild>
              <a href={`/integrations/${strategy.toLowerCase()}`}>
                Manage Integration
                <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
              </a>
            </Button>
          ) : (
            <Button
              onClick={handleConnect}
              disabled={isConnecting}
              className={cn("w-full transition-all duration-300", isConnecting && "bg-amber-500 hover:bg-amber-600")}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  Connect {title}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
