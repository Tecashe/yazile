
// "use client"

// import React, { useState, useTransition, useMemo, useEffect } from "react"
// import { handleMergeDuplicates } from "@/actions/leads"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { Progress } from "@/components/ui/progress"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Separator } from "@/components/ui/separator"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Label } from "@/components/ui/label"
// import { Switch } from "@/components/ui/switch"
// import {
//   Users,
//   TrendingUp,
//   MessageSquare,
//   Target,
//   Calendar,
//   BarChart3,
//   Clock,
//   Star,
//   Plus,
//   AlertTriangle,
//   Merge,
//   RefreshCw,
//   Brain,
//   DollarSign,
//   Crown,
//   Award,
//   ArrowUpRight,
//   Sparkles,
//   Timer,
//   PieChart,
//   LineChart,
//   Download,
//   Search,
//   Filter,
//   Settings,
//   Mail,
//   Phone,
//   Eye,
//   ExternalLink,
//   Zap,
//   TrendingDown,
//   Activity,
//   Shield,
//   CheckCircle,
//   Loader2,
//   Trash2,
//   User,
// } from "lucide-react"
// import { formatDistanceToNow } from "date-fns"
// import { useRouter } from "next/navigation"
// import { toast } from "sonner"
// import { manualSyncToCRM, batchSyncToCRM } from "@/lib/lead-qualification"

// interface PremiumLeadsDashboardProps {
//   analytics: any
//   recentLeads: any[]
//   topLeads: any[]
//   hasDuplicates: boolean
//   duplicateCount: number
//   userId: string
//   onMergeDuplicates?: (userId: string) => Promise<{ success: boolean; mergedGroups?: number; error?: string }>
//   interactions: any[]
// }

// // Enhanced utility functions
// function getStatusColor(status: string) {
//   const colors = {
//     NEW: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
//     QUALIFYING:
//       "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
//     QUALIFIED:
//       "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
//     CONVERTED:
//       "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
//     LOST: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
//   }
//   return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
// }

// function getScoreColor(score: number) {
//   if (score >= 85) return "text-purple-600 font-bold dark:text-purple-400"
//   if (score >= 70) return "text-green-600 font-bold dark:text-green-400"
//   if (score >= 50) return "text-yellow-600 font-semibold dark:text-yellow-400"
//   if (score >= 30) return "text-orange-600 dark:text-orange-400"
//   return "text-red-600 dark:text-red-400"
// }

// function getScoreProgress(score: number) {
//   if (score >= 85) return { color: "bg-purple-500", width: (score / 100) * 100 }
//   if (score >= 70) return { color: "bg-green-500", width: (score / 100) * 100 }
//   if (score >= 50) return { color: "bg-yellow-500", width: (score / 100) * 100 }
//   if (score >= 30) return { color: "bg-orange-500", width: (score / 100) * 100 }
//   return { color: "bg-red-500", width: (score / 100) * 100 }
// }

// function getMarketingCompletenessColor(completeness: number) {
//   if (completeness >= 80) return "text-green-600 font-bold"
//   if (completeness >= 60) return "text-blue-600 font-semibold"
//   if (completeness >= 40) return "text-yellow-600 font-semibold"
//   if (completeness >= 20) return "text-orange-600"
//   return "text-red-600"
// }

// function getTierBadge(metadata: any) {
//   const lastAnalysis = metadata?.lastAnalysis
//   const tier = lastAnalysis?.leadTier

//   if (!tier) return null

//   const tierConfig = {
//     PLATINUM: {
//       icon: Crown,
//       color: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/20 dark:text-purple-400",
//       label: "Platinum",
//     },
//     GOLD: {
//       icon: Award,
//       color: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400",
//       label: "Gold",
//     },
//     SILVER: {
//       icon: Star,
//       color: "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900/20 dark:text-gray-400",
//       label: "Silver",
//     },
//     BRONZE: {
//       icon: Users,
//       color: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/20 dark:text-orange-400",
//       label: "Bronze",
//     },
//   }

//   const config = tierConfig[tier as keyof typeof tierConfig]
//   if (!config) return null

//   const IconComponent = config.icon

//   return (
//     <Badge className={`${config.color} ml-2 px-2 py-1`}>
//       <IconComponent className="w-3 h-3 mr-1" />
//       {config.label}
//     </Badge>
//   )
// }

// function getRevenueDisplay(value: number) {
//   if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
//   if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`
//   return `$${value.toFixed(0)}`
// }

// // Marketing Information Display Component
// function MarketingInfoDisplay({ lead, compact = false }: { lead: any; compact?: boolean }) {
//   if (!lead) return null

//   const completeness = lead.metadata?.marketingCompleteness || 0
//   const hasName = !!lead.name
//   const hasEmail = !!lead.email
//   const hasPhone = !!lead.phone

//   if (compact) {
//     return (
//       <div className="flex items-center gap-2 text-xs">
//         <div className={`flex items-center gap-1 ${getMarketingCompletenessColor(completeness)}`}>
//           <User className="h-3 w-3" />
//           <span>{completeness}% complete</span>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-2">
//       <div className="flex items-center justify-between">
//         <span className="text-sm font-medium">Contact Information</span>
//         <Badge variant="outline" className={getMarketingCompletenessColor(completeness)}>
//           {completeness}% Complete
//         </Badge>
//       </div>
//       <div className="grid grid-cols-2 gap-2 text-xs">
//         {hasName && (
//           <div className="flex items-center gap-1">
//             <User className="h-3 w-3 text-muted-foreground" />
//             <span>{lead.name}</span>
//           </div>
//         )}
//         {hasEmail && (
//           <div className="flex items-center gap-1">
//             <Mail className="h-3 w-3 text-muted-foreground" />
//             <span>{lead.email}</span>
//           </div>
//         )}
//         {hasPhone && (
//           <div className="flex items-center gap-1">
//             <Phone className="h-3 w-3 text-muted-foreground" />
//             <span>{lead.phone}</span>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// // Enhanced components
// function DuplicateAlert({
//   hasDuplicates,
//   duplicateCount,
//   onMergeDuplicates,
// }: {
//   hasDuplicates: boolean
//   duplicateCount: number
//   onMergeDuplicates: () => Promise<{ success: boolean; mergedGroups?: number; error?: string }>
// }) {
//   const [isPending, startTransition] = useTransition()
//   const router = useRouter()

//   if (!hasDuplicates) return null

//   const handleMerge = () => {
//     startTransition(async () => {
//       try {
//         const result = await onMergeDuplicates()
//         if (result.success) {
//           toast.success(`Successfully merged ${result.mergedGroups} duplicate groups`)
//           router.refresh()
//         } else {
//           toast.error(result.error || "Failed to merge duplicates")
//         }
//       } catch (error) {
//         toast.error("An error occurred while merging duplicates")
//       }
//     })
//   }

//   return (
//     <Alert className="border-orange-200 bg-orange-50/50 dark:bg-orange-900/10">
//       <AlertTriangle className="h-4 w-4 text-orange-600" />
//       <AlertTitle className="text-orange-800 dark:text-orange-400">Duplicate Leads Detected</AlertTitle>
//       <AlertDescription className="text-orange-700 dark:text-orange-300">
//         Found {duplicateCount} groups of duplicate leads. Merge them to improve your revenue analytics and data quality.
//         <Button
//           variant="outline"
//           size="sm"
//           className="ml-2 border-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/20"
//           onClick={handleMerge}
//           disabled={isPending}
//         >
//           {isPending ? <RefreshCw className="mr-2 h-3 w-3 animate-spin" /> : <Merge className="mr-2 h-3 w-3" />}
//           {isPending ? "Merging..." : "Merge Duplicates"}
//         </Button>
//       </AlertDescription>
//     </Alert>
//   )
// }

// function PremiumAnalyticsCards({ analytics }: { analytics: any }) {
//   if (!analytics) {
//     return (
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
//         {[1, 2, 3, 4, 5].map((i) => (
//           <Card key={i} className="animate-pulse">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <div className="h-4 bg-gray-200 rounded w-20"></div>
//               <div className="h-4 w-4 bg-gray-200 rounded"></div>
//             </CardHeader>
//             <CardContent>
//               <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
//               <div className="h-3 bg-gray-200 rounded w-24"></div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     )
//   }

//   const cards = [
//     {
//       title: "Total Leads",
//       value: analytics.totalLeads,
//       subtitle: "AI-powered lead generation",
//       icon: Users,
//       color: "border-l-blue-500",
//       trend: null,
//     },
//     {
//       title: "Qualified Leads",
//       value: analytics.qualifiedLeads,
//       subtitle: `${analytics.conversionRate}% conversion rate`,
//       icon: Target,
//       color: "border-l-green-500",
//       trend: analytics.conversionRate >= 15 ? "up" : analytics.conversionRate >= 10 ? "stable" : "down",
//     },
//     {
//       title: "Revenue Pipeline",
//       value: getRevenueDisplay(analytics.revenueMetrics?.totalEstimatedRevenue || 0),
//       subtitle: "Estimated total value",
//       icon: DollarSign,
//       color: "border-l-purple-500",
//       trend: null,
//     },
//     {
//       title: "Expected Revenue",
//       value: getRevenueDisplay(analytics.revenueMetrics?.totalExpectedRevenue || 0),
//       subtitle: `${Math.abs(analytics.revenueMetrics?.revenueGrowth || 0)}% vs last week`,
//       icon: TrendingUp,
//       color: "border-l-yellow-500",
//       trend: analytics.revenueMetrics?.revenueGrowth >= 0 ? "up" : "down",
//     },
//     {
//       title: "Avg ROI",
//       value: `${analytics.revenueMetrics?.averageROI || 0}%`,
//       subtitle: "Return on investment",
//       icon: BarChart3,
//       color: "border-l-orange-500",
//       trend:
//         analytics.revenueMetrics?.averageROI >= 200
//           ? "up"
//           : analytics.revenueMetrics?.averageROI >= 100
//             ? "stable"
//             : "down",
//     },
//   ]

//   return (
//     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
//       {cards.map((card, index) => {
//         const IconComponent = card.icon
//         const trendIcon = card.trend === "up" ? ArrowUpRight : card.trend === "down" ? TrendingDown : Activity
//         const trendColor =
//           card.trend === "up" ? "text-green-500" : card.trend === "down" ? "text-red-500" : "text-blue-500"

//         return (
//           <Card key={index} className={`${card.color} border-l-4 hover:shadow-lg transition-all duration-200 group`}>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
//                 {card.title}
//               </CardTitle>
//               <IconComponent className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold mb-1">{card.value}</div>
//               <div className="flex items-center text-xs text-muted-foreground">
//                 {card.trend && React.createElement(trendIcon, { className: `h-3 w-3 mr-1 ${trendColor}` })}
//                 <span>{card.subtitle}</span>
//               </div>
//             </CardContent>
//           </Card>
//         )
//       })}
//     </div>
//   )
// }

// // UNIFIED CRM Integration Component - Professional Implementation
// function UnifiedCRMIntegration({ userId, analytics }: { userId: string; analytics: any }) {
//   const [currentConfig, setCurrentConfig] = useState<any>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [isConnecting, setIsConnecting] = useState(false)
//   const [testConnection, setTestConnection] = useState(false)
//   const [showNewConnection, setShowNewConnection] = useState(false)
//   const [newConnection, setNewConnection] = useState({
//     provider: "",
//     name: "",
//     apiKey: "",
//     apiSecret: "",
//     baseUrl: "",
//   })

//   // Sync Settings State
//   const [syncSettings, setSyncSettings] = useState({
//     autoSyncQualified: true,
//     createDealsHighValue: true,
//     syncLeadScores: true,
//     realTimeSync: true,
//   })

//   // Manual Sync State
//   const [isManualSyncing, setIsManualSyncing] = useState(false)
//   const [isBatchSyncing, setIsBatchSyncing] = useState(false)
//   const [selectedLeads, setSelectedLeads] = useState<string[]>([])
//   const [syncFilters, setSyncFilters] = useState({
//     status: "",
//     minScore: "",
//     leadTier: "",
//   })

//   const providers = [
//     {
//       id: "HUBSPOT",
//       name: "HubSpot",
//       description: "Connect with HubSpot CRM for contacts and deals",
//       logo: "/hubspot.png",
//       features: ["Contacts", "Deals", "Companies", "Custom Properties"],
//       supportsOAuth: true,
//       requiresSecret: false,
//       requiresBaseUrl: false,
//       oauthScopes: ["crm.objects.contacts.write", "crm.objects.deals.write"],
//     },
//     {
//       id: "SALESFORCE",
//       name: "Salesforce",
//       description: "Integrate with Salesforce for lead management",
//       logo: "/salesforce.png",
//       features: ["Leads", "Opportunities", "Accounts", "Custom Fields"],
//       supportsOAuth: true,
//       requiresSecret: true,
//       requiresBaseUrl: true,
//       oauthScopes: ["api", "refresh_token"],
//     },
//     {
//       id: "PIPEDRIVE",
//       name: "Pipedrive",
//       description: "Sync leads with Pipedrive pipeline",
//       logo: "/pipedrive.png",
//       features: ["Persons", "Deals", "Organizations", "Activities"],
//       supportsOAuth: true,
//       requiresSecret: false,
//       requiresBaseUrl: true,
//       oauthScopes: ["base"],
//     },
//     {
//       id: "ZOHO",
//       name: "Zoho CRM",
//       description: "Connect with Zoho CRM for comprehensive lead management",
//       logo: "/zoho.png",
//       features: ["Leads", "Contacts", "Deals", "Custom Modules"],
//       supportsOAuth: false,
//       requiresSecret: true,
//       requiresBaseUrl: true,
//       oauthScopes: [],
//     },
//   ]

//   useEffect(() => {
//     fetchCurrentConfig()
//     fetchSyncSettings()
//   }, [userId])

//   const fetchCurrentConfig = async () => {
//     try {
//       const response = await fetch(`/api/crm/config?userId=${userId}`)
//       if (response.ok) {
//         const config = await response.json()
//         setCurrentConfig(config)
//       }
//     } catch (error) {
//       console.error("Error fetching CRM config:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const fetchSyncSettings = async () => {
//     try {
//       const response = await fetch(`/api/crm/sync-settings?userId=${userId}`)
//       if (response.ok) {
//         const settings = await response.json()
//         setSyncSettings(settings)
//       }
//     } catch (error) {
//       console.error("Error fetching sync settings:", error)
//     }
//   }

//   const updateSyncSettings = async (newSettings: any) => {
//     try {
//       const response = await fetch("/api/crm/sync-settings", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId,
//           settings: newSettings,
//         }),
//       })

//       if (response.ok) {
//         setSyncSettings(newSettings)
//         toast.success("Sync settings updated successfully")
//       } else {
//         toast.error("Failed to update sync settings")
//       }
//     } catch (error) {
//       toast.error("Error updating sync settings")
//       console.error("Sync settings error:", error)
//     }
//   }

//   const handleOAuthConnect = async (provider: any) => {
//     setIsConnecting(true)
//     try {
//       const response = await fetch("/api/crm/connect", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId,
//           provider: provider.id,
//           connectionType: "oauth",
//         }),
//       })

//       const data = await response.json()

//       if (response.ok && data.oauthUrl) {
//         window.location.href = data.oauthUrl
//       } else {
//         toast.error(data.error || "Failed to initiate OAuth connection")
//       }
//     } catch (error) {
//       toast.error("Failed to connect CRM")
//       console.error("OAuth connection error:", error)
//     } finally {
//       setIsConnecting(false)
//     }
//   }

//   const handleApiKeyConnect = async () => {
//     if (!newConnection.provider || !newConnection.name || !newConnection.apiKey) {
//       toast.error("Please fill in all required fields")
//       return
//     }

//     const selectedProvider = providers.find((p) => p.id === newConnection.provider)
//     if (selectedProvider?.requiresSecret && !newConnection.apiSecret) {
//       toast.error("API Secret is required for this provider")
//       return
//     }
//     if (selectedProvider?.requiresBaseUrl && !newConnection.baseUrl) {
//       toast.error("Base URL is required for this provider")
//       return
//     }

//     setIsConnecting(true)
//     try {
//       const response = await fetch("/api/crm/connect", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId,
//           connectionType: "api",
//           ...newConnection,
//         }),
//       })

//       if (response.ok) {
//         toast.success("CRM connected successfully!")
//         setShowNewConnection(false)
//         setNewConnection({ provider: "", name: "", apiKey: "", apiSecret: "", baseUrl: "" })
//         fetchCurrentConfig()
//       } else {
//         const error = await response.json()
//         toast.error(error.error || "Failed to connect CRM")
//       }
//     } catch (error) {
//       toast.error("Failed to connect CRM")
//       console.error("Connection error:", error)
//     } finally {
//       setIsConnecting(false)
//     }
//   }

//   const handleTestConnection = async () => {
//     setTestConnection(true)
//     try {
//       const response = await fetch("/api/crm/test", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId }),
//       })

//       if (response.ok) {
//         toast.success("CRM connection is working!")
//       } else {
//         const error = await response.json()
//         toast.error(error.error || "CRM connection failed")
//       }
//     } catch (error) {
//       toast.error("Failed to test connection")
//     } finally {
//       setTestConnection(false)
//     }
//   }

//   const handleDisconnect = async () => {
//     if (!confirm("Are you sure you want to disconnect your CRM? This will stop all automatic syncing.")) {
//       return
//     }

//     try {
//       const response = await fetch("/api/crm/disconnect", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId }),
//       })

//       if (response.ok) {
//         toast.success("CRM disconnected successfully")
//         setCurrentConfig(null)
//       } else {
//         toast.error("Failed to disconnect CRM")
//       }
//     } catch (error) {
//       toast.error("Failed to disconnect CRM")
//     }
//   }

//   const handleManualSync = async () => {
//     if (selectedLeads.length === 0) {
//       toast.error("Please select leads to sync")
//       return
//     }

//     setIsManualSyncing(true)
//     try {
//       const result = await manualSyncToCRM(selectedLeads, userId)

//       if (result.success && result.summary) {
//         toast.success(`Successfully synced ${result.summary.successful} leads to CRM`)
//         if (result.summary.failed > 0) {
//           toast.warning(`${result.summary.failed} leads failed to sync`)
//         }
//         setSelectedLeads([])
//       } else {
//         toast.error(result.error || "Failed to sync leads")
//       }
//     } catch (error) {
//       toast.error("An error occurred during sync")
//       console.error("Manual sync error:", error)
//     } finally {
//       setIsManualSyncing(false)
//     }
//   }

//   const handleBatchSync = async () => {
//     setIsBatchSyncing(true)
//     try {
//       const filters = {
//         status: syncFilters.status || undefined,
//         minScore: syncFilters.minScore ? Number.parseInt(syncFilters.minScore) : undefined,
//         leadTier: syncFilters.leadTier || undefined,
//       }

//       const result = await batchSyncToCRM(userId, filters)

//       if (result.success && result.summary) {
//         toast.success(`Batch sync completed: ${result.summary.successful} leads synced`)
//         if (result.summary.failed > 0) {
//           toast.warning(`${result.summary.failed} leads failed to sync`)
//         }
//       } else {
//         toast.error(result.error || "Batch sync failed")
//       }
//     } catch (error) {
//       toast.error("An error occurred during batch sync")
//       console.error("Batch sync error:", error)
//     } finally {
//       setIsBatchSyncing(false)
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <Loader2 className="h-8 w-8 animate-spin" />
//         <span className="ml-2">Loading CRM configuration...</span>
//       </div>
//     )
//   }

//   const crmStats = analytics?.crmStatus?.integrations || []
//   const hasActiveCRM = currentConfig?.isActive || false

//   return (
//     <div className="space-y-6">
//       {/* CRM Connection Status */}
//       {hasActiveCRM ? (
//         <Card className="border-green-200 bg-green-50/50 dark:bg-green-900/10">
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-3">
//                 <div className="w-12 h-12 flex items-center justify-center">
//                   <img
//                     src={providers.find((p) => p.id === currentConfig.provider)?.logo || "/placeholder.svg"}
//                     alt="Provider Logo"
//                     className="w-12 h-12 object-contain"
//                   />
//                 </div>
//                 <div>
//                   <CardTitle className="flex items-center gap-2">
//                     {providers.find((p) => p.id === currentConfig.provider)?.name}
//                     <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
//                       <CheckCircle className="h-3 w-3 mr-1" />
//                       Connected
//                     </Badge>
//                   </CardTitle>
//                   <CardDescription>
//                     {currentConfig.name} - Connected on {new Date(currentConfig.createdAt).toLocaleDateString()}
//                   </CardDescription>
//                 </div>
//               </div>
//               <div className="flex space-x-2">
//                 <Button variant="outline" size="sm" onClick={handleTestConnection} disabled={testConnection}>
//                   {testConnection ? (
//                     <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                   ) : (
//                     <Settings className="h-4 w-4 mr-2" />
//                   )}
//                   Test Connection
//                 </Button>
//                 <Button variant="destructive" size="sm" onClick={handleDisconnect}>
//                   <Trash2 className="h-4 w-4 mr-2" />
//                   Disconnect
//                 </Button>
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-2 gap-4 text-sm">
//               <div>
//                 <Label className="text-muted-foreground">Provider</Label>
//                 <p className="font-medium">{currentConfig.provider}</p>
//               </div>
//               <div>
//                 <Label className="text-muted-foreground">Status</Label>
//                 <p className="font-medium text-green-600">Active & Syncing</p>
//               </div>
//               <div>
//                 <Label className="text-muted-foreground">Last Sync</Label>
//                 <p className="font-medium">
//                   {currentConfig.lastSynced ? new Date(currentConfig.lastSynced).toLocaleString() : "Never"}
//                 </p>
//               </div>
//               <div>
//                 <Label className="text-muted-foreground">Base URL</Label>
//                 <p className="font-medium">{currentConfig.baseUrl || "Default"}</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="space-y-6">
//           {!showNewConnection ? (
//             <>
//               <div className="text-center py-8">
//                 <ExternalLink className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
//                 <h3 className="text-lg font-semibold mb-2">Connect Your CRM</h3>
//                 <p className="text-muted-foreground mb-6">
//                   Automatically sync your qualified leads to your favorite CRM platform
//                 </p>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {providers.map((provider) => (
//                   <Card key={provider.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
//                     <CardHeader>
//                       <div className="flex items-center space-x-3">
//                         <div className="w-12 h-12 flex items-center justify-center">
//                           <img
//                             src={provider.logo || "/placeholder.svg"}
//                             alt={`${provider.name} logo`}
//                             className="w-12 h-12 object-contain"
//                           />
//                         </div>
//                         <div>
//                           <CardTitle className="text-lg flex items-center gap-2">
//                             {provider.name}
//                             {provider.supportsOAuth && (
//                               <Badge variant="outline" className="text-xs">
//                                 <Shield className="h-3 w-3 mr-1" />
//                                 OAuth
//                               </Badge>
//                             )}
//                           </CardTitle>
//                           <CardDescription className="text-sm">{provider.description}</CardDescription>
//                         </div>
//                       </div>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-3">
//                         <div>
//                           <Label className="text-sm font-medium">Features:</Label>
//                           <div className="flex flex-wrap gap-1 mt-1">
//                             {provider.features.map((feature) => (
//                               <Badge key={feature} variant="outline" className="text-xs">
//                                 {feature}
//                               </Badge>
//                             ))}
//                           </div>
//                         </div>
//                         <div className="flex gap-2">
//                           {provider.supportsOAuth && (
//                             <Button
//                               className="flex-1"
//                               onClick={() => handleOAuthConnect(provider)}
//                               disabled={isConnecting}
//                             >
//                               {isConnecting ? (
//                                 <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                               ) : (
//                                 <Shield className="h-4 w-4 mr-2" />
//                               )}
//                               OAuth Connect
//                             </Button>
//                           )}
//                           <Button
//                             variant="outline"
//                             className="flex-1"
//                             onClick={() => {
//                               setNewConnection({ ...newConnection, provider: provider.id })
//                               setShowNewConnection(true)
//                             }}
//                           >
//                             <ExternalLink className="h-4 w-4 mr-2" />
//                             API Key
//                           </Button>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </>
//           ) : (
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <div className="text-2xl">
//                     <img
//                       src={providers.find((p) => p.id === newConnection.provider)?.logo || "/placeholder.svg"}
//                       alt="Provider Logo"
//                       className="w-8 h-8 object-contain"
//                     />
//                   </div>
//                   Connect {providers.find((p) => p.id === newConnection.provider)?.name}
//                 </CardTitle>
//                 <CardDescription>
//                   Enter your {providers.find((p) => p.id === newConnection.provider)?.name} API credentials to connect
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="name">Connection Name</Label>
//                   <Input
//                     id="name"
//                     placeholder="e.g., Main CRM Account"
//                     value={newConnection.name}
//                     onChange={(e) => setNewConnection({ ...newConnection, name: e.target.value })}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="apiKey">API Key *</Label>
//                   <Input
//                     id="apiKey"
//                     type="password"
//                     placeholder="Enter your API key"
//                     value={newConnection.apiKey}
//                     onChange={(e) => setNewConnection({ ...newConnection, apiKey: e.target.value })}
//                   />
//                 </div>

//                 {providers.find((p) => p.id === newConnection.provider)?.requiresSecret && (
//                   <div className="space-y-2">
//                     <Label htmlFor="apiSecret">API Secret *</Label>
//                     <Input
//                       id="apiSecret"
//                       type="password"
//                       placeholder="Enter your API secret"
//                       value={newConnection.apiSecret}
//                       onChange={(e) => setNewConnection({ ...newConnection, apiSecret: e.target.value })}
//                     />
//                   </div>
//                 )}

//                 {providers.find((p) => p.id === newConnection.provider)?.requiresBaseUrl && (
//                   <div className="space-y-2">
//                     <Label htmlFor="baseUrl">Base URL *</Label>
//                     <Input
//                       id="baseUrl"
//                       placeholder="e.g., https://your-instance.salesforce.com"
//                       value={newConnection.baseUrl}
//                       onChange={(e) => setNewConnection({ ...newConnection, baseUrl: e.target.value })}
//                     />
//                   </div>
//                 )}

//                 <div className="flex space-x-2">
//                   <Button onClick={handleApiKeyConnect} disabled={isConnecting} className="flex-1">
//                     {isConnecting ? (
//                       <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                     ) : (
//                       <CheckCircle className="h-4 w-4 mr-2" />
//                     )}
//                     Connect
//                   </Button>
//                   <Button variant="outline" onClick={() => setShowNewConnection(false)}>
//                     Cancel
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </div>
//       )}

//       {/* Sync Settings - Only show if CRM is connected */}
//       {hasActiveCRM && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Sync Settings</CardTitle>
//             <CardDescription>Configure how leads are synchronized with your CRM</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <Label className="text-sm font-medium">Auto-sync qualified leads</Label>
//                 <p className="text-xs text-muted-foreground">
//                   Automatically sync leads when they reach &ldquo;Qualified&rdquo; status
//                 </p>
//               </div>
//               <Switch
//                 checked={syncSettings.autoSyncQualified}
//                 onCheckedChange={(checked) => updateSyncSettings({ ...syncSettings, autoSyncQualified: checked })}
//               />
//             </div>
//             <Separator />
//             <div className="flex items-center justify-between">
//               <div>
//                 <Label className="text-sm font-medium">Create deals for high-value leads</Label>
//                 <p className="text-xs text-muted-foreground">
//                   Create deals/opportunities for Platinum and Gold tier leads
//                 </p>
//               </div>
//               <Switch
//                 checked={syncSettings.createDealsHighValue}
//                 onCheckedChange={(checked) => updateSyncSettings({ ...syncSettings, createDealsHighValue: checked })}
//               />
//             </div>
//             <Separator />
//             <div className="flex items-center justify-between">
//               <div>
//                 <Label className="text-sm font-medium">Sync lead scores</Label>
//                 <p className="text-xs text-muted-foreground">Include AI-generated lead scores in CRM records</p>
//               </div>
//               <Switch
//                 checked={syncSettings.syncLeadScores}
//                 onCheckedChange={(checked) => updateSyncSettings({ ...syncSettings, syncLeadScores: checked })}
//               />
//             </div>
//             <Separator />
//             <div className="flex items-center justify-between">
//               <div>
//                 <Label className="text-sm font-medium">Real-time sync</Label>
//                 <p className="text-xs text-muted-foreground">Sync leads immediately when qualified</p>
//               </div>
//               <Switch
//                 checked={syncSettings.realTimeSync}
//                 onCheckedChange={(checked) => updateSyncSettings({ ...syncSettings, realTimeSync: checked })}
//               />
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Manual Sync Controls - Only show if CRM is connected */}
//       {hasActiveCRM && (
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <RefreshCw className="h-5 w-5 text-primary" />
//               Manual Sync Controls
//             </CardTitle>
//             <CardDescription>Manually sync leads to your CRM with advanced filtering options</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             {/* CRM Status Overview */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="p-4 bg-green-50 border border-green-200 rounded-xl dark:bg-green-900/20 dark:border-green-800">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-green-500/10 rounded-lg">
//                     <CheckCircle className="h-5 w-5 text-green-600" />
//                   </div>
//                   <div>
//                     <span className="text-sm font-medium text-green-700 dark:text-green-300">Connected CRMs</span>
//                     <div className="text-2xl font-bold text-green-600 mt-1">1</div>
//                   </div>
//                 </div>
//               </div>

//               <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl dark:bg-blue-900/20 dark:border-blue-800">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-blue-500/10 rounded-lg">
//                     <Activity className="h-5 w-5 text-blue-600" />
//                   </div>
//                   <div>
//                     <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Active Syncs</span>
//                     <div className="text-2xl font-bold text-blue-600 mt-1">1</div>
//                   </div>
//                 </div>
//               </div>

//               <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl dark:bg-purple-900/20 dark:border-purple-800">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-purple-500/10 rounded-lg">
//                     <Clock className="h-5 w-5 text-purple-600" />
//                   </div>
//                   <div>
//                     <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Last Sync</span>
//                     <div className="text-sm font-bold text-purple-600 mt-1">
//                       {currentConfig?.lastSynced
//                         ? formatDistanceToNow(new Date(currentConfig.lastSynced)) + " ago"
//                         : "Never"}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <Separator />

//             {/* Manual Sync Section */}
//             <div className="space-y-4">
//               <div className="flex items-center gap-2">
//                 <div className="p-1 bg-blue-500/10 rounded">
//                   <RefreshCw className="h-4 w-4 text-blue-600" />
//                 </div>
//                 <h4 className="font-semibold text-blue-700 dark:text-blue-300">Manual Sync</h4>
//               </div>

//               <div className="flex items-center gap-2">
//                 <Button
//                   onClick={handleManualSync}
//                   disabled={isManualSyncing || selectedLeads.length === 0}
//                   className="flex-1"
//                 >
//                   {isManualSyncing ? (
//                     <RefreshCw className="h-4 w-4 animate-spin mr-2" />
//                   ) : (
//                     <RefreshCw className="h-4 w-4 mr-2" />
//                   )}
//                   Sync Selected ({selectedLeads.length})
//                 </Button>

//                 <Button variant="outline" onClick={() => setSelectedLeads([])} disabled={selectedLeads.length === 0}>
//                   Clear Selection
//                 </Button>
//               </div>
//             </div>

//             <Separator />

//             {/* Batch Sync Section */}
//             <div className="space-y-4">
//               <div className="flex items-center gap-2">
//                 <div className="p-1 bg-purple-500/10 rounded">
//                   <Target className="h-4 w-4 text-purple-600" />
//                 </div>
//                 <h4 className="font-semibold text-purple-700 dark:text-purple-300">Batch Sync</h4>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <Label className="text-xs font-medium">Status Filter</Label>
//                   <Select
//                     value={syncFilters.status}
//                     onValueChange={(value) => setSyncFilters({ ...syncFilters, status: value })}
//                   >
//                     <SelectTrigger className="mt-1">
//                       <SelectValue placeholder="All Status" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">All Status</SelectItem>
//                       <SelectItem value="QUALIFIED">Qualified</SelectItem>
//                       <SelectItem value="NEW">New</SelectItem>
//                       <SelectItem value="QUALIFYING">Qualifying</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div>
//                   <Label className="text-xs font-medium">Min Score</Label>
//                   <Input
//                     type="number"
//                     placeholder="Min score"
//                     value={syncFilters.minScore}
//                     onChange={(e) => setSyncFilters({ ...syncFilters, minScore: e.target.value })}
//                     className="mt-1"
//                   />
//                 </div>

//                 <div>
//                   <Label className="text-xs font-medium">Lead Tier</Label>
//                   <Select
//                     value={syncFilters.leadTier}
//                     onValueChange={(value) => setSyncFilters({ ...syncFilters, leadTier: value })}
//                   >
//                     <SelectTrigger className="mt-1">
//                       <SelectValue placeholder="All Tiers" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">All Tiers</SelectItem>
//                       <SelectItem value="PLATINUM">Platinum</SelectItem>
//                       <SelectItem value="GOLD">Gold</SelectItem>
//                       <SelectItem value="SILVER">Silver</SelectItem>
//                       <SelectItem value="BRONZE">Bronze</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               <Button onClick={handleBatchSync} disabled={isBatchSyncing} className="w-full">
//                 {isBatchSyncing ? (
//                   <RefreshCw className="h-4 w-4 animate-spin mr-2" />
//                 ) : (
//                   <Target className="h-4 w-4 mr-2" />
//                 )}
//                 Batch Sync with Filters
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   )
// }

// // Other components remain the same...
// function LeadTierDistribution({ analytics }: { analytics: any }) {
//   if (!analytics?.tierDistribution) return null

//   const { platinum, gold, silver, bronze } = analytics.tierDistribution
//   const total = platinum + gold + silver + bronze

//   if (total === 0) return null

//   const tiers = [
//     {
//       name: "Platinum",
//       value: platinum,
//       color: "bg-purple-500",
//       icon: Crown,
//       revenue: analytics.premiumInsights?.totalPipelineValue * 0.4,
//     },
//     {
//       name: "Gold",
//       value: gold,
//       color: "bg-yellow-500",
//       icon: Award,
//       revenue: analytics.premiumInsights?.totalPipelineValue * 0.3,
//     },
//     {
//       name: "Silver",
//       value: silver,
//       color: "bg-gray-400",
//       icon: Star,
//       revenue: analytics.premiumInsights?.totalPipelineValue * 0.2,
//     },
//     {
//       name: "Bronze",
//       value: bronze,
//       color: "bg-orange-500",
//       icon: Users,
//       revenue: analytics.premiumInsights?.totalPipelineValue * 0.1,
//     },
//   ]

//   return (
//     <Card className="hover:shadow-lg transition-all duration-200">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <PieChart className="h-5 w-5 text-primary" />
//           Lead Tier Distribution
//         </CardTitle>
//         <CardDescription>AI-powered lead classification by revenue potential</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {tiers.map((tier) => {
//             const percentage = total > 0 ? (tier.value / total) * 100 : 0
//             const IconComponent = tier.icon
//             return (
//               <div key={tier.name} className="space-y-2">
//                 <div className="flex items-center justify-between text-sm">
//                   <div className="flex items-center gap-2">
//                     <IconComponent className="h-4 w-4" />
//                     <span className="font-medium">{tier.name}</span>
//                   </div>
//                   <div className="text-right">
//                     <span className="font-medium">
//                       {tier.value} ({Math.round(percentage)}%)
//                     </span>
//                     <div className="text-xs text-muted-foreground">{getRevenueDisplay(tier.revenue || 0)} est.</div>
//                   </div>
//                 </div>
//                 <Progress value={percentage} className="h-2" />
//               </div>
//             )
//           })}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// function RevenueInsightsCard({ analytics }: { analytics: any }) {
//   const insights = analytics?.premiumInsights

//   if (!insights) return null

//   const insightCards = [
//     {
//       icon: Crown,
//       label: "High-Value Leads",
//       value: insights.highValueLeads,
//       color: "bg-purple-50 border-purple-200 dark:bg-purple-900/10 dark:border-purple-800",
//       iconColor: "text-purple-600 dark:text-purple-400",
//       valueColor: "text-purple-600 dark:text-purple-400",
//     },
//     {
//       icon: DollarSign,
//       label: "Avg Lead Value",
//       value: getRevenueDisplay(insights.averageLeadValue),
//       color: "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800",
//       iconColor: "text-green-600 dark:text-green-400",
//       valueColor: "text-green-600 dark:text-green-400",
//     },
//     {
//       icon: Target,
//       label: "Conversion Probability",
//       value: `${insights.conversionProbability}%`,
//       color: "bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800",
//       iconColor: "text-blue-600 dark:text-blue-400",
//       valueColor: "text-blue-600 dark:text-blue-400",
//     },
//   ]

//   return (
//     <Card className="hover:shadow-lg transition-all duration-200">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Sparkles className="h-5 w-5 text-primary" />
//           Revenue Insights
//         </CardTitle>
//         <CardDescription>AI-powered revenue intelligence</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {insightCards.map((card, index) => {
//             const IconComponent = card.icon
//             return (
//               <div
//                 key={index}
//                 className={`flex items-center justify-between p-4 rounded-lg border ${card.color} hover:shadow-md transition-all duration-200`}
//               >
//                 <div className="flex items-center gap-3">
//                   <IconComponent className={`h-5 w-5 ${card.iconColor}`} />
//                   <span className="text-sm font-medium">{card.label}</span>
//                 </div>
//                 <span className={`text-lg font-bold ${card.valueColor}`}>{card.value}</span>
//               </div>
//             )
//           })}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// function EnhancedLeadsTable({
//   leads,
//   onExport,
//   onBulkAction,
//   selectedLeads,
//   onLeadSelection,
// }: {
//   leads: any[]
//   onExport: (format: string, selectedIds: string[]) => void
//   onBulkAction: (action: string, selectedIds: string[]) => void
//   selectedLeads: string[]
//   onLeadSelection: (leadIds: string[]) => void
// }) {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [tierFilter, setTierFilter] = useState("all")

//   const filteredLeads = useMemo(() => {
//     return leads.filter((lead) => {
//       const matchesSearch =
//         !searchTerm ||
//         lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         lead.instagramUserId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         lead.email?.toLowerCase().includes(searchTerm.toLowerCase())

//       const matchesStatus = statusFilter === "all" || lead.status === statusFilter
//       const matchesTier = tierFilter === "all" || lead.metadata?.lastAnalysis?.leadTier === tierFilter

//       return matchesSearch && matchesStatus && matchesTier
//     })
//   }, [leads, searchTerm, statusFilter, tierFilter])

//   const handleSelectAll = () => {
//     if (selectedLeads.length === filteredLeads.length) {
//       onLeadSelection([])
//     } else {
//       onLeadSelection(filteredLeads.map((lead) => lead.id))
//     }
//   }

//   const handleSelectLead = (leadId: string) => {
//     const newSelection = selectedLeads.includes(leadId)
//       ? selectedLeads.filter((id) => id !== leadId)
//       : [...selectedLeads, leadId]
//     onLeadSelection(newSelection)
//   }

//   return (
//     <Card className="hover:shadow-lg transition-all duration-200">
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <div>
//             <CardTitle className="flex items-center gap-2">
//               <Clock className="h-5 w-5 text-primary" />
//               Premium Lead Pipeline
//             </CardTitle>
//             <CardDescription>
//               AI-qualified leads with revenue intelligence ({filteredLeads.length} leads)
//             </CardDescription>
//           </div>
//           <div className="flex items-center gap-2">
//             {selectedLeads.length > 0 && (
//               <>
//                 <Select onValueChange={(action) => onBulkAction(action, selectedLeads)}>
//                   <SelectTrigger className="w-32">
//                     <Settings className="h-4 w-4 mr-2" />
//                     Actions
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="sync-crm">Sync to CRM</SelectItem>
//                     <SelectItem value="send-email">Send Email</SelectItem>
//                     <SelectItem value="update-status">Update Status</SelectItem>
//                     <SelectItem value="add-tags">Add Tags</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Select onValueChange={(format) => onExport(format, selectedLeads)}>
//                   <SelectTrigger className="w-32">
//                     <Download className="h-4 w-4 mr-2" />
//                     Export
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="csv">CSV</SelectItem>
//                     <SelectItem value="excel">Excel</SelectItem>
//                     <SelectItem value="json">JSON</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </>
//             )}
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent>
//         {/* Filters */}
//         <div className="flex flex-col sm:flex-row gap-4 mb-6">
//           <div className="flex-1">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search leads by name, email, or Instagram..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//           </div>
//           <Select value={statusFilter} onValueChange={setStatusFilter}>
//             <SelectTrigger className="w-40">
//               <Filter className="h-4 w-4 mr-2" />
//               <SelectValue placeholder="Status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Status</SelectItem>
//               <SelectItem value="NEW">New</SelectItem>
//               <SelectItem value="QUALIFYING">Qualifying</SelectItem>
//               <SelectItem value="QUALIFIED">Qualified</SelectItem>
//               <SelectItem value="CONVERTED">Converted</SelectItem>
//               <SelectItem value="LOST">Lost</SelectItem>
//             </SelectContent>
//           </Select>
//           <Select value={tierFilter} onValueChange={setTierFilter}>
//             <SelectTrigger className="w-40">
//               <Star className="h-4 w-4 mr-2" />
//               <SelectValue placeholder="Tier" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Tiers</SelectItem>
//               <SelectItem value="PLATINUM">Platinum</SelectItem>
//               <SelectItem value="GOLD">Gold</SelectItem>
//               <SelectItem value="SILVER">Silver</SelectItem>
//               <SelectItem value="BRONZE">Bronze</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Select All */}
//         <div className="flex items-center space-x-2 mb-4">
//           <Checkbox
//             checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
//             onCheckedChange={handleSelectAll}
//           />
//           <span className="text-sm text-muted-foreground">Select All ({selectedLeads.length} selected)</span>
//         </div>

//         <Separator className="mb-4" />

//         {/* Leads List */}
//         <ScrollArea className="h-96">
//           <div className="space-y-4">
//             {filteredLeads.length === 0 ? (
//               <div className="text-center py-12 text-muted-foreground">
//                 <Brain className="h-16 w-16 mx-auto mb-4 opacity-50" />
//                 <p className="text-lg font-medium">No leads found</p>
//                 <p className="text-sm">
//                   Try adjusting your filters or start engaging with customers to generate AI-qualified leads!
//                 </p>
//               </div>
//             ) : (
//               filteredLeads.map((lead) => {
//                 const lastAnalysis = lead.metadata?.lastAnalysis
//                 const isSelected = selectedLeads.includes(lead.id)
//                 const scoreProgress = getScoreProgress(lead.score)
//                 const marketingCompleteness = lead.metadata?.marketingCompleteness || 0

//                 return (
//                   <div
//                     key={lead.id}
//                     className={`flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-all duration-200 cursor-pointer ${
//                       isSelected ? "border-primary bg-primary/5" : ""
//                     }`}
//                     onClick={() => handleSelectLead(lead.id)}
//                   >
//                     <div className="flex items-center space-x-4">
//                       <Checkbox
//                         checked={isSelected}
//                         onChange={() => handleSelectLead(lead.id)}
//                         onClick={(e) => e.stopPropagation()}
//                       />
//                       <Avatar className="h-12 w-12">
//                         <AvatarFallback className="bg-primary/20 text-primary font-semibold">
//                           {lead.name ? lead.name.charAt(0).toUpperCase() : lead.instagramUserId.charAt(0).toUpperCase()}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div className="flex-1">
//                         <div className="flex items-center gap-2">
//                           <p className="text-sm font-medium">
//                             {lead.name || `Instagram User ${lead.instagramUserId.slice(-4)}`}
//                           </p>
//                           {getTierBadge(lead.metadata)}
//                         </div>
//                         <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
//                           <span className="flex items-center gap-1">
//                             <Users className="h-3 w-3" />@{lead.instagramUserId}
//                           </span>
//                           {lead.email && (
//                             <span className="flex items-center gap-1">
//                               <Mail className="h-3 w-3" />
//                               {lead.email}
//                             </span>
//                           )}
//                           {lead.phone && (
//                             <span className="flex items-center gap-1">
//                               <Phone className="h-3 w-3" />
//                               {lead.phone}
//                             </span>
//                           )}
//                           <span>Score: {lead.score}</span>
//                           <span>{formatDistanceToNow(new Date(lead.lastContactDate))} ago</span>
//                         </div>

//                         {/* Score Progress Bar */}
//                         <div className="mt-2">
//                           <div className="flex items-center justify-between mb-1">
//                             <span className="text-xs font-medium">Lead Score</span>
//                             <span className={`text-xs font-bold ${getScoreColor(lead.score)}`}>{lead.score}/100</span>
//                           </div>
//                           <div className="w-full bg-gray-200 rounded-full h-1.5">
//                             <div
//                               className={`${scoreProgress.color} h-1.5 rounded-full transition-all duration-300`}
//                               style={{ width: `${scoreProgress.width}%` }}
//                             ></div>
//                           </div>
//                         </div>

//                         {/* Marketing Information Display */}
//                         {(lead.name || lead.email || lead.phone) && (
//                           <div className="mt-2 p-2 bg-muted/50 rounded-lg">
//                             <MarketingInfoDisplay lead={lead} />
//                           </div>
//                         )}

//                         {lastAnalysis?.estimatedValue && (
//                           <div className="flex items-center gap-4 text-xs mt-1">
//                             <span className="text-green-600 font-medium">
//                               Est: {getRevenueDisplay(lastAnalysis.estimatedValue)}
//                             </span>
//                             {lastAnalysis?.roi && (
//                               <span className="text-blue-600 font-medium">ROI: {lastAnalysis.roi}%</span>
//                             )}
//                             <span className={`font-medium ${getMarketingCompletenessColor(marketingCompleteness)}`}>
//                               Profile: {marketingCompleteness}%
//                             </span>
//                           </div>
//                         )}

//                         {lead.interactions && lead.interactions.length > 0 && (
//                           <p className="text-xs text-muted-foreground mt-1 max-w-md truncate">
//                             Last: {lead.interactions[0].content}
//                           </p>
//                         )}

//                         {lastAnalysis?.notificationMessage && (
//                           <p className="text-xs text-blue-600 mt-1 font-medium flex items-center gap-1">
//                             <Brain className="w-3 h-3" />
//                             {lastAnalysis.notificationMessage}
//                           </p>
//                         )}

//                         {lastAnalysis?.nextActions && lastAnalysis.nextActions.length > 0 && (
//                           <div className="flex gap-1 mt-2">
//                             {lastAnalysis.nextActions.slice(0, 2).map((action: string, index: number) => (
//                               <Badge key={index} variant="outline" className="text-xs">
//                                 <Timer className="w-2 h-2 mr-1" />
//                                 {action.replace(/_/g, " ")}
//                               </Badge>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-4">
//                       <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
//                       <div className={`text-sm font-medium ${getScoreColor(lead.score)}`}>{lead.score}</div>
//                       <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
//                         <Eye className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 )
//               })
//             )}
//           </div>
//         </ScrollArea>
//       </CardContent>
//     </Card>
//   )
// }

// function TopRevenueLeadsCard({ leads }: { leads: any[] }) {
//   return (
//     <Card className="hover:shadow-lg transition-all duration-200">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Crown className="h-5 w-5 text-primary" />
//           Top Revenue Opportunities
//         </CardTitle>
//         <CardDescription>Highest value leads ranked by AI revenue prediction</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ScrollArea className="h-80">
//           <div className="space-y-4">
//             {leads.length === 0 ? (
//               <div className="text-center py-8 text-muted-foreground">
//                 <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                 <p className="text-sm">No high-value leads yet</p>
//                 <p className="text-xs">Focus on engagement to generate premium opportunities</p>
//               </div>
//             ) : (
//               leads.map((lead, index) => {
//                 const lastAnalysis = lead.metadata?.lastAnalysis
//                 const marketingCompleteness = lead.metadata?.marketingCompleteness || 0
//                 return (
//                   <div
//                     key={lead.id}
//                     className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-all duration-200 group"
//                   >
//                     <div className="flex items-center space-x-3">
//                       <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
//                         {index + 1}
//                       </div>
//                       <div>
//                         <div className="flex items-center gap-2">
//                           <p className="text-sm font-medium">{lead.name || `User ${lead.instagramUserId.slice(-4)}`}</p>
//                           {getTierBadge(lead.metadata)}
//                         </div>
//                         <div className="flex items-center gap-2 mt-1">
//                           <Badge className={getStatusColor(lead.status)} variant="secondary">
//                             {lead.status}
//                           </Badge>
//                           {lastAnalysis?.followUpStrategy && (
//                             <Badge variant="outline" className="text-xs">
//                               {lastAnalysis.followUpStrategy.replace(/_/g, " ")}
//                             </Badge>
//                           )}
//                         </div>
//                         {(lead.name || lead.email || lead.phone) && <MarketingInfoDisplay lead={lead} compact />}
//                         {lastAnalysis?.buyerPersona && (
//                           <p className="text-xs text-muted-foreground mt-1">
//                             Persona: {lastAnalysis.buyerPersona.replace(/_/g, " ")}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <div className={`text-lg font-bold ${getScoreColor(lead.score)}`}>
//                         {lastAnalysis?.estimatedValue
//                           ? getRevenueDisplay(lastAnalysis.estimatedValue)
//                           : `${lead.score}pts`}
//                       </div>
//                       {lastAnalysis?.roi && (
//                         <div className="text-xs text-blue-600 font-medium">ROI: {lastAnalysis.roi}%</div>
//                       )}
//                       <div className={`text-xs ${getMarketingCompletenessColor(marketingCompleteness)}`}>
//                         Profile: {marketingCompleteness}%
//                       </div>
//                       {lead.qualificationData && (
//                         <div className="text-xs text-muted-foreground">
//                           Intent: {lead.qualificationData.intentScore} | Sentiment:{" "}
//                           {lead.qualificationData.sentimentScore}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )
//               })
//             )}
//           </div>
//         </ScrollArea>
//       </CardContent>
//     </Card>
//   )
// }

// function RecentAIAnalysisCard({ interactions }: { interactions: any[] }) {
//   return (
//     <Card className="hover:shadow-lg transition-all duration-200">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Brain className="h-5 w-5 text-primary" />
//           AI Revenue Analysis
//         </CardTitle>
//         <CardDescription>Latest customer interactions with revenue intelligence</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ScrollArea className="h-80">
//           <div className="space-y-3">
//             {interactions.length === 0 ? (
//               <div className="text-center py-8 text-muted-foreground">
//                 <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                 <p className="text-sm">No recent AI analysis</p>
//                 <p className="text-xs">Interactions will appear here as they&apos;re analyzed</p>
//               </div>
//             ) : (
//               interactions.slice(0, 10).map((interaction) => {
//                 const metadata = interaction.metadata
//                 const marketingCompleteness = metadata?.marketingCompleteness || 0
//                 return (
//                   <div
//                     key={interaction.id}
//                     className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-all duration-200"
//                   >
//                     <Avatar className="h-8 w-8">
//                       <AvatarFallback className="text-xs bg-primary/20 text-primary">
//                         {interaction.lead.name?.charAt(0) || interaction.lead.instagramUserId.charAt(0)}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2 text-sm">
//                         <span className="font-medium">
//                           {interaction.lead.name || `User ${interaction.lead.instagramUserId.slice(-4)}`}
//                         </span>
//                         <Badge className={getStatusColor(interaction.lead.status)} variant="outline">
//                           {interaction.lead.status}
//                         </Badge>
//                         {metadata?.leadTier && (
//                           <Badge variant="secondary" className="text-xs">
//                             {metadata.leadTier}
//                           </Badge>
//                         )}
//                         {metadata?.hasMarketingInfo && (
//                           <Badge
//                             variant="outline"
//                             className={`text-xs ${getMarketingCompletenessColor(marketingCompleteness)}`}
//                           >
//                             {marketingCompleteness}% Profile
//                           </Badge>
//                         )}
//                       </div>
//                       <p className="text-sm text-muted-foreground mt-1 truncate">{interaction.content}</p>
//                       <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
//                         <span className="capitalize">{interaction.type}</span>
//                         <span>•</span>
//                         <span>{formatDistanceToNow(new Date(interaction.timestamp))} ago</span>
//                         {metadata?.estimatedValue && (
//                           <>
//                             <span>•</span>
//                             <span className="text-green-600 font-medium">
//                               {getRevenueDisplay(metadata.estimatedValue)}
//                             </span>
//                           </>
//                         )}
//                         {interaction.sentiment && (
//                           <>
//                             <span>•</span>
//                             <span className={interaction.sentiment > 0 ? "text-green-600" : "text-red-600"}>
//                               {interaction.sentiment > 0 ? "Positive" : "Negative"}
//                             </span>
//                           </>
//                         )}
//                       </div>
//                       {metadata?.notificationMessage && (
//                         <p className="text-xs text-blue-600 mt-1 font-medium flex items-center gap-1">
//                           <Sparkles className="w-3 h-3" />
//                           {metadata.notificationMessage}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 )
//               })
//             )}
//           </div>
//         </ScrollArea>
//       </CardContent>
//     </Card>
//   )
// }

// export function PremiumLeadsDashboard({
//   analytics,
//   recentLeads,
//   topLeads,
//   hasDuplicates,
//   duplicateCount,
//   userId,
//   onMergeDuplicates,
//   interactions,
// }: PremiumLeadsDashboardProps) {
//   const [selectedLeads, setSelectedLeads] = useState<string[]>([])

//   const handleMerge = () => (onMergeDuplicates ? onMergeDuplicates(userId) : handleMergeDuplicates(userId))

//   const handleExport = (format: string, selectedIds: string[]) => {
//     toast.success(`Exporting ${selectedIds.length} leads as ${format.toUpperCase()}`)
//   }

//   const handleBulkAction = (action: string, selectedIds: string[]) => {
//     toast.success(`Performing ${action} on ${selectedIds.length} leads`)
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between space-y-2">
//         {/* <div>
//           <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
//             <div className="p-2 bg-primary/10 rounded-lg">
//               <Crown className="h-8 w-8 text-primary" />
//             </div>
//             <div>
//               <span>Premium AI Revenue Intelligence</span>
//               <div className="flex items-center gap-2 mt-1">
//                 <Badge variant="secondary" className="text-xs">
//                   <Zap className="h-3 w-3 mr-1" />
//                   AI-Powered
//                 </Badge>
//                 <Badge variant="outline" className="text-xs">
//                   <Activity className="h-3 w-3 mr-1" />
//                   Real-time Analytics
//                 </Badge>
//                 <Badge variant="outline" className="text-xs">
//                   <User className="h-3 w-3 mr-1" />
//                   Contact Capture
//                 </Badge>
//               </div>
//             </div>
//           </h2>
//           <p className="text-muted-foreground mt-2">
//             Advanced AI-powered lead qualification with revenue prediction and contact information capture
//           </p>
//         </div> */}
//         <div className="flex items-center space-x-2">
//           <Button variant="outline">
//             <LineChart className="mr-2 h-4 w-4" />
//             Revenue Report
//           </Button>
//           <Button variant="outline">
//             <Calendar className="mr-2 h-4 w-4" />
//             Schedule Export
//           </Button>
//           <Button>
//             <Plus className="mr-2 h-4 w-4" />
//             Add Lead
//           </Button>
//         </div>
//       </div>

//       {/* Duplicate Alert */}
//       <DuplicateAlert hasDuplicates={hasDuplicates} duplicateCount={duplicateCount} onMergeDuplicates={handleMerge} />

//       {/* Analytics Cards */}
//       <PremiumAnalyticsCards analytics={analytics} />

//       {/* Main Content */}
//       <Tabs defaultValue="overview" className="space-y-6">
//         <TabsList className="grid w-full grid-cols-5">
//           <TabsTrigger value="overview" className="flex items-center gap-2">
//             <BarChart3 className="h-4 w-4" />
//             Overview
//           </TabsTrigger>
//           <TabsTrigger value="leads" className="flex items-center gap-2">
//             <Users className="h-4 w-4" />
//             Lead Pipeline
//           </TabsTrigger>
//           <TabsTrigger value="analysis" className="flex items-center gap-2">
//             <Brain className="h-4 w-4" />
//             AI Analysis
//           </TabsTrigger>
//           <TabsTrigger value="insights" className="flex items-center gap-2">
//             <Sparkles className="h-4 w-4" />
//             Revenue Insights
//           </TabsTrigger>
//           <TabsTrigger value="integrations" className="flex items-center gap-2">
//             <ExternalLink className="h-4 w-4" />
//             Integrations
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="overview" className="space-y-6">
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
//             <div className="col-span-4">
//               <EnhancedLeadsTable
//                 leads={recentLeads}
//                 onExport={handleExport}
//                 onBulkAction={handleBulkAction}
//                 selectedLeads={selectedLeads}
//                 onLeadSelection={setSelectedLeads}
//               />
//             </div>
//             <div className="col-span-3 space-y-6">
//               <TopRevenueLeadsCard leads={topLeads} />
//               <LeadTierDistribution analytics={analytics} />
//             </div>
//           </div>
//         </TabsContent>

//         <TabsContent value="leads" className="space-y-6">
//           <EnhancedLeadsTable
//             leads={recentLeads}
//             onExport={handleExport}
//             onBulkAction={handleBulkAction}
//             selectedLeads={selectedLeads}
//             onLeadSelection={setSelectedLeads}
//           />
//         </TabsContent>

//         <TabsContent value="analysis" className="space-y-6">
//           <div className="grid gap-6 md:grid-cols-2">
//             <RecentAIAnalysisCard interactions={interactions || []} />
//             <LeadTierDistribution analytics={analytics} />
//           </div>
//         </TabsContent>

//         <TabsContent value="insights" className="space-y-6">
//           <div className="grid gap-6 md:grid-cols-2">
//             <RevenueInsightsCard analytics={analytics} />
//             <TopRevenueLeadsCard leads={topLeads} />
//           </div>
//         </TabsContent>

//         <TabsContent value="integrations" className="space-y-6">
//           <UnifiedCRMIntegration userId={userId} analytics={analytics} />
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }






// "use client"

// import React, { useState, useTransition, useMemo, useEffect } from "react"
// import { handleMergeDuplicates } from "@/actions/leads"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { Progress } from "@/components/ui/progress"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Separator } from "@/components/ui/separator"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Label } from "@/components/ui/label"
// import { Switch } from "@/components/ui/switch"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import {
//   Users,
//   TrendingUp,
//   MessageSquare,
//   Target,
//   Calendar,
//   BarChart3,
//   Clock,
//   Star,
//   Plus,
//   AlertTriangle,
//   Merge,
//   RefreshCw,
//   Brain,
//   DollarSign,
//   Crown,
//   Award,
//   ArrowUpRight,
//   Sparkles,
//   Timer,
//   PieChart,
//   LineChart,
//   Download,
//   Search,
//   Filter,
//   Settings,
//   Mail,
//   Phone,
//   Eye,
//   ExternalLink,
//   Zap,
//   TrendingDown,
//   Activity,
//   Shield,
//   CheckCircle,
//   Loader2,
//   Trash2,
//   User,
//   Instagram,
//   Copy,
// } from "lucide-react"
// import { formatDistanceToNow } from "date-fns"
// import { useRouter } from "next/navigation"
// import { toast } from "sonner"
// import { manualSyncToCRM, batchSyncToCRM } from "@/lib/lead-qualification"

// interface PremiumLeadsDashboardProps {
//   analytics: any
//   recentLeads: any[]
//   topLeads: any[]
//   hasDuplicates: boolean
//   duplicateCount: number
//   userId: string
//   onMergeDuplicates?: (userId: string) => Promise<{ success: boolean; mergedGroups?: number; error?: string }>
//   interactions: any[]
// }

// // Enhanced utility functions
// function getStatusColor(status: string) {
//   const colors = {
//     NEW: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
//     QUALIFYING:
//       "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
//     QUALIFIED:
//       "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
//     CONVERTED:
//       "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
//     LOST: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
//   }
//   return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
// }

// function getScoreColor(score: number) {
//   if (score >= 85) return "text-purple-600 font-bold dark:text-purple-400"
//   if (score >= 70) return "text-green-600 font-bold dark:text-green-400"
//   if (score >= 50) return "text-yellow-600 font-semibold dark:text-yellow-400"
//   if (score >= 30) return "text-orange-600 dark:text-orange-400"
//   return "text-red-600 dark:text-red-400"
// }

// function getScoreProgress(score: number) {
//   if (score >= 85) return { color: "bg-purple-500", width: (score / 100) * 100 }
//   if (score >= 70) return { color: "bg-green-500", width: (score / 100) * 100 }
//   if (score >= 50) return { color: "bg-yellow-500", width: (score / 100) * 100 }
//   if (score >= 30) return { color: "bg-orange-500", width: (score / 100) * 100 }
//   return { color: "bg-red-500", width: (score / 100) * 100 }
// }

// function getMarketingCompletenessColor(completeness: number) {
//   if (completeness >= 80) return "text-green-600 font-bold"
//   if (completeness >= 60) return "text-blue-600 font-semibold"
//   if (completeness >= 40) return "text-yellow-600 font-semibold"
//   if (completeness >= 20) return "text-orange-600"
//   return "text-red-600"
// }

// function getTierBadge(metadata: any) {
//   const lastAnalysis = metadata?.lastAnalysis
//   const tier = lastAnalysis?.leadTier

//   if (!tier) return null

//   const tierConfig = {
//     PLATINUM: {
//       icon: Crown,
//       color: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/20 dark:text-purple-400",
//       label: "Platinum",
//     },
//     GOLD: {
//       icon: Award,
//       color: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400",
//       label: "Gold",
//     },
//     SILVER: {
//       icon: Star,
//       color: "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900/20 dark:text-gray-400",
//       label: "Silver",
//     },
//     BRONZE: {
//       icon: Users,
//       color: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/20 dark:text-orange-400",
//       label: "Bronze",
//     },
//   }

//   const config = tierConfig[tier as keyof typeof tierConfig]
//   if (!config) return null

//   const IconComponent = config.icon

//   return (
//     <Badge className={`${config.color} ml-2 px-2 py-1`}>
//       <IconComponent className="w-3 h-3 mr-1" />
//       {config.label}
//     </Badge>
//   )
// }

// function getRevenueDisplay(value: number) {
//   if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
//   if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`
//   return `$${value.toFixed(0)}`
// }

// function copyToClipboard(text: string, label: string) {
//   navigator.clipboard.writeText(text)
//   toast.success(`${label} copied to clipboard`)
// }

// // Enhanced Lead Details Modal Component
// function LeadDetailsModal({ lead, isOpen, onClose }: { lead: any; isOpen: boolean; onClose: () => void }) {
//   if (!lead) return null

//   const lastAnalysis = lead.metadata?.lastAnalysis
//   const marketingCompleteness = lead.metadata?.marketingCompleteness || 0
//   const displayName = lead.name || `@${lead.instagramUserId?.slice(-4) || "Unknown"}`

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
//         <DialogHeader>
//           <div className="flex items-center gap-4">
//             <Avatar className="h-16 w-16">
//               <AvatarFallback className="bg-primary/20 text-primary font-bold text-lg">
//                 {displayName.charAt(0).toUpperCase()}
//               </AvatarFallback>
//             </Avatar>
//             <div className="flex-1">
//               <DialogTitle className="text-2xl flex items-center gap-3">
//                 {displayName}
//                 {lastAnalysis?.leadTier && getTierBadge(lead.metadata)}
//               </DialogTitle>
//               <DialogDescription className="flex items-center gap-4 mt-2">
//                 <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
//                 <span className="text-sm text-muted-foreground">
//                   Score: {lead.score}/100 • Last contact: {formatDistanceToNow(new Date(lead.lastContactDate))} ago
//                 </span>
//               </DialogDescription>
//             </div>
//           </div>
//         </DialogHeader>

//         <ScrollArea className="max-h-[70vh] pr-4">
//           <div className="space-y-6">
//             {/* Contact Information */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold flex items-center gap-2">
//                   <User className="h-5 w-5 text-primary" />
//                   Contact Information
//                 </h3>

//                 <div className="space-y-3">
//                   {lead.name && (
//                     <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
//                       <div className="flex items-center gap-3">
//                         <User className="h-4 w-4 text-muted-foreground" />
//                         <div>
//                           <p className="font-medium">{lead.name}</p>
//                           <p className="text-xs text-muted-foreground">Full Name</p>
//                         </div>
//                       </div>
//                       <Button variant="ghost" size="sm" onClick={() => copyToClipboard(lead.name, "Name")}>
//                         <Copy className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   )}

//                   {lead.email && (
//                     <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
//                       <div className="flex items-center gap-3">
//                         <Mail className="h-4 w-4 text-muted-foreground" />
//                         <div>
//                           <p className="font-medium">{lead.email}</p>
//                           <p className="text-xs text-muted-foreground">Email Address</p>
//                         </div>
//                       </div>
//                       <Button variant="ghost" size="sm" onClick={() => copyToClipboard(lead.email, "Email")}>
//                         <Copy className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   )}

//                   {lead.phone && (
//                     <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
//                       <div className="flex items-center gap-3">
//                         <Phone className="h-4 w-4 text-muted-foreground" />
//                         <div>
//                           <p className="font-medium">{lead.phone}</p>
//                           <p className="text-xs text-muted-foreground">Phone Number</p>
//                         </div>
//                       </div>
//                       <Button variant="ghost" size="sm" onClick={() => copyToClipboard(lead.phone, "Phone")}>
//                         <Copy className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   )}

//                   <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
//                     <div className="flex items-center gap-3">
//                       <Instagram className="h-4 w-4 text-muted-foreground" />
//                       <div>
//                         <p className="font-medium">@{lead.instagramUserId}</p>
//                         <p className="text-xs text-muted-foreground">Instagram Handle</p>
//                       </div>
//                     </div>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => copyToClipboard(lead.instagramUserId, "Instagram")}
//                     >
//                       <Copy className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>

//                 {/* Profile Completeness */}
//                 <div className="p-4 border rounded-lg">
//                   <div className="flex items-center justify-between mb-3">
//                     <span className="text-sm font-medium">Profile Completeness</span>
//                     <span className="text-sm font-bold text-primary">{marketingCompleteness}%</span>
//                   </div>
//                   <Progress value={marketingCompleteness} className="h-2" />
//                   <p className="text-xs text-muted-foreground mt-2">
//                     {marketingCompleteness >= 80
//                       ? "Complete profile - ready for CRM sync"
//                       : marketingCompleteness >= 50
//                         ? "Good progress - collect remaining details"
//                         : "Incomplete profile - gather more contact information"}
//                   </p>
//                 </div>
//               </div>

//               {/* AI Analysis & Revenue */}
//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold flex items-center gap-2">
//                   <Brain className="h-5 w-5 text-primary" />
//                   AI Analysis & Revenue
//                 </h3>

//                 {lastAnalysis && (
//                   <div className="space-y-3">
//                     <div className="p-4 border rounded-lg">
//                       <div className="flex items-center justify-between mb-2">
//                         <span className="text-sm font-medium">Lead Score</span>
//                         <span className="text-lg font-bold text-primary">{lead.score}/100</span>
//                       </div>
//                       <Progress value={lead.score} className="h-2 mb-2" />
//                       <p className="text-xs text-muted-foreground">
//                         {lead.score >= 85
//                           ? "Excellent - High conversion probability"
//                           : lead.score >= 70
//                             ? "Good - Strong potential"
//                             : lead.score >= 50
//                               ? "Fair - Needs nurturing"
//                               : "Low - Requires attention"}
//                       </p>
//                     </div>

//                     {lastAnalysis.estimatedValue > 0 && (
//                       <div className="p-4 border rounded-lg bg-green-50/50 dark:bg-green-900/10">
//                         <div className="flex items-center gap-2 mb-2">
//                           <DollarSign className="h-4 w-4 text-green-600" />
//                           <span className="text-sm font-medium">Revenue Potential</span>
//                         </div>
//                         <p className="text-2xl font-bold text-green-600">
//                           {getRevenueDisplay(lastAnalysis.estimatedValue)}
//                         </p>
//                         {lastAnalysis.roi > 0 && (
//                           <p className="text-xs text-muted-foreground mt-1">Expected ROI: {lastAnalysis.roi}%</p>
//                         )}
//                       </div>
//                     )}

//                     {lastAnalysis.buyerPersona && (
//                       <div className="p-4 border rounded-lg">
//                         <div className="flex items-center gap-2 mb-2">
//                           <Target className="h-4 w-4 text-blue-600" />
//                           <span className="text-sm font-medium">Buyer Persona</span>
//                         </div>
//                         <Badge variant="outline" className="capitalize">
//                           {lastAnalysis.buyerPersona.replace(/_/g, " ")}
//                         </Badge>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>

//             <Separator />

//             {/* Recent Interactions */}
//             {lead.interactions && lead.interactions.length > 0 && (
//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold flex items-center gap-2">
//                   <MessageSquare className="h-5 w-5 text-primary" />
//                   Recent Interactions ({lead.interactions.length})
//                 </h3>

//                 <div className="space-y-3">
//                   {lead.interactions.slice(0, 5).map((interaction: any, index: number) => (
//                     <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
//                       <div className="flex items-start justify-between mb-2">
//                         <div className="flex items-center gap-2">
//                           <Badge variant="outline" className="capitalize">
//                             {interaction.type}
//                           </Badge>
//                           <span className="text-xs text-muted-foreground">
//                             {formatDistanceToNow(new Date(interaction.timestamp))} ago
//                           </span>
//                         </div>
//                         {interaction.sentiment && (
//                           <Badge variant={interaction.sentiment > 0 ? "default" : "destructive"}>
//                             {interaction.sentiment > 0 ? "Positive" : "Negative"}
//                           </Badge>
//                         )}
//                       </div>
//                       <p className="text-sm text-muted-foreground">{interaction.content}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Next Actions */}
//             {lastAnalysis?.nextActions && lastAnalysis.nextActions.length > 0 && (
//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold flex items-center gap-2">
//                   <Activity className="h-5 w-5 text-primary" />
//                   Recommended Actions
//                 </h3>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                   {lastAnalysis.nextActions.map((action: string, index: number) => (
//                     <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
//                       <CheckCircle className="h-4 w-4 text-green-600" />
//                       <span className="text-sm capitalize">{action.replace(/_/g, " ")}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* AI Notification */}
//             {lastAnalysis?.notificationMessage && (
//               <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-lg dark:bg-blue-900/10 dark:border-blue-800">
//                 <div className="flex items-start gap-3">
//                   <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
//                   <div>
//                     <h4 className="font-medium text-blue-800 dark:text-blue-400">AI Insight</h4>
//                     <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">{lastAnalysis.notificationMessage}</p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </ScrollArea>

//         <div className="flex justify-between items-center pt-4 border-t">
//           <div className="flex gap-2">
//             <Button variant="outline" size="sm">
//               <ExternalLink className="h-4 w-4 mr-2" />
//               View in CRM
//             </Button>
//             <Button variant="outline" size="sm">
//               <Mail className="h-4 w-4 mr-2" />
//               Send Email
//             </Button>
//           </div>
//           <Button onClick={onClose}>Close</Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }

// // Marketing Information Display Component
// function MarketingInfoDisplay({ lead, compact = false }: { lead: any; compact?: boolean }) {
//   if (!lead) return null

//   const completeness = lead.metadata?.marketingCompleteness || 0
//   const hasName = !!lead.name
//   const hasEmail = !!lead.email
//   const hasPhone = !!lead.phone

//   if (compact) {
//     return (
//       <div className="flex items-center gap-2 text-xs">
//         <div className={`flex items-center gap-1 ${getMarketingCompletenessColor(completeness)}`}>
//           <User className="h-3 w-3" />
//           <span>{completeness}% complete</span>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-2">
//       <div className="flex items-center justify-between">
//         <span className="text-sm font-medium">Contact Information</span>
//         <Badge variant="outline" className={getMarketingCompletenessColor(completeness)}>
//           {completeness}% Complete
//         </Badge>
//       </div>
//       <div className="grid grid-cols-2 gap-2 text-xs">
//         {hasName && (
//           <div className="flex items-center gap-1">
//             <User className="h-3 w-3 text-muted-foreground" />
//             <span>{lead.name}</span>
//           </div>
//         )}
//         {hasEmail && (
//           <div className="flex items-center gap-1">
//             <Mail className="h-3 w-3 text-muted-foreground" />
//             <span>{lead.email}</span>
//           </div>
//         )}
//         {hasPhone && (
//           <div className="flex items-center gap-1">
//             <Phone className="h-3 w-3 text-muted-foreground" />
//             <span>{lead.phone}</span>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// // Enhanced components
// function DuplicateAlert({
//   hasDuplicates,
//   duplicateCount,
//   onMergeDuplicates,
// }: {
//   hasDuplicates: boolean
//   duplicateCount: number
//   onMergeDuplicates: () => Promise<{ success: boolean; mergedGroups?: number; error?: string }>
// }) {
//   const [isPending, startTransition] = useTransition()
//   const router = useRouter()

//   if (!hasDuplicates) return null

//   const handleMerge = () => {
//     startTransition(async () => {
//       try {
//         const result = await onMergeDuplicates()
//         if (result.success) {
//           toast.success(`Successfully merged ${result.mergedGroups} duplicate groups`)
//           router.refresh()
//         } else {
//           toast.error(result.error || "Failed to merge duplicates")
//         }
//       } catch (error) {
//         toast.error("An error occurred while merging duplicates")
//       }
//     })
//   }

//   return (
//     <Alert className="border-orange-200 bg-orange-50/50 dark:bg-orange-900/10">
//       <AlertTriangle className="h-4 w-4 text-orange-600" />
//       <AlertTitle className="text-orange-800 dark:text-orange-400">Duplicate Leads Detected</AlertTitle>
//       <AlertDescription className="text-orange-700 dark:text-orange-300">
//         Found {duplicateCount} groups of duplicate leads. Merge them to improve your revenue analytics and data quality.
//         <Button
//           variant="outline"
//           size="sm"
//           className="ml-2 border-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/20 bg-transparent"
//           onClick={handleMerge}
//           disabled={isPending}
//         >
//           {isPending ? <RefreshCw className="mr-2 h-3 w-3 animate-spin" /> : <Merge className="mr-2 h-3 w-3" />}
//           {isPending ? "Merging..." : "Merge Duplicates"}
//         </Button>
//       </AlertDescription>
//     </Alert>
//   )
// }

// function PremiumAnalyticsCards({ analytics }: { analytics: any }) {
//   if (!analytics) {
//     return (
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
//         {[1, 2, 3, 4, 5].map((i) => (
//           <Card key={i} className="animate-pulse">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <div className="h-4 bg-gray-200 rounded w-20"></div>
//               <div className="h-4 w-4 bg-gray-200 rounded"></div>
//             </CardHeader>
//             <CardContent>
//               <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
//               <div className="h-3 bg-gray-200 rounded w-24"></div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     )
//   }

//   const cards = [
//     {
//       title: "Total Leads",
//       value: analytics.totalLeads,
//       subtitle: "AI-powered lead generation",
//       icon: Users,
//       color: "border-l-blue-500",
//       trend: null,
//     },
//     {
//       title: "Qualified Leads",
//       value: analytics.qualifiedLeads,
//       subtitle: `${analytics.conversionRate}% conversion rate`,
//       icon: Target,
//       color: "border-l-green-500",
//       trend: analytics.conversionRate >= 15 ? "up" : analytics.conversionRate >= 10 ? "stable" : "down",
//     },
//     {
//       title: "Revenue Pipeline",
//       value: getRevenueDisplay(analytics.revenueMetrics?.totalEstimatedRevenue || 0),
//       subtitle: "Estimated total value",
//       icon: DollarSign,
//       color: "border-l-purple-500",
//       trend: null,
//     },
//     {
//       title: "Expected Revenue",
//       value: getRevenueDisplay(analytics.revenueMetrics?.totalExpectedRevenue || 0),
//       subtitle: `${Math.abs(analytics.revenueMetrics?.revenueGrowth || 0)}% vs last week`,
//       icon: TrendingUp,
//       color: "border-l-yellow-500",
//       trend: analytics.revenueMetrics?.revenueGrowth >= 0 ? "up" : "down",
//     },
//     {
//       title: "Avg ROI",
//       value: `${analytics.revenueMetrics?.averageROI || 0}%`,
//       subtitle: "Return on investment",
//       icon: BarChart3,
//       color: "border-l-orange-500",
//       trend:
//         analytics.revenueMetrics?.averageROI >= 200
//           ? "up"
//           : analytics.revenueMetrics?.averageROI >= 100
//             ? "stable"
//             : "down",
//     },
//   ]

//   return (
//     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
//       {cards.map((card, index) => {
//         const IconComponent = card.icon
//         const trendIcon = card.trend === "up" ? ArrowUpRight : card.trend === "down" ? TrendingDown : Activity
//         const trendColor =
//           card.trend === "up" ? "text-green-500" : card.trend === "down" ? "text-red-500" : "text-blue-500"

//         return (
//           <Card key={index} className={`${card.color} border-l-4 hover:shadow-lg transition-all duration-200 group`}>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
//                 {card.title}
//               </CardTitle>
//               <IconComponent className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold mb-1">{card.value}</div>
//               <div className="flex items-center text-xs text-muted-foreground">
//                 {card.trend && React.createElement(trendIcon, { className: `h-3 w-3 mr-1 ${trendColor}` })}
//                 <span>{card.subtitle}</span>
//               </div>
//             </CardContent>
//           </Card>
//         )
//       })}
//     </div>
//   )
// }

// // UNIFIED CRM Integration Component - Professional Implementation
// function UnifiedCRMIntegration({ userId, analytics }: { userId: string; analytics: any }) {
//   const [currentConfig, setCurrentConfig] = useState<any>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [isConnecting, setIsConnecting] = useState(false)
//   const [testConnection, setTestConnection] = useState(false)
//   const [showNewConnection, setShowNewConnection] = useState(false)
//   const [newConnection, setNewConnection] = useState({
//     provider: "",
//     name: "",
//     apiKey: "",
//     apiSecret: "",
//     baseUrl: "",
//   })

//   // Sync Settings State
//   const [syncSettings, setSyncSettings] = useState({
//     autoSyncQualified: true,
//     createDealsHighValue: true,
//     syncLeadScores: true,
//     realTimeSync: true,
//   })

//   // Manual Sync State
//   const [isManualSyncing, setIsManualSyncing] = useState(false)
//   const [isBatchSyncing, setIsBatchSyncing] = useState(false)
//   const [selectedLeads, setSelectedLeads] = useState<string[]>([])
//   const [syncFilters, setSyncFilters] = useState({
//     status: "",
//     minScore: "",
//     leadTier: "",
//   })

//   const providers = [
//     {
//       id: "HUBSPOT",
//       name: "HubSpot",
//       description: "Connect with HubSpot CRM for contacts and deals",
//       logo: "/hubspot.png",
//       features: ["Contacts", "Deals", "Companies", "Custom Properties"],
//       supportsOAuth: true,
//       requiresSecret: false,
//       requiresBaseUrl: false,
//       oauthScopes: ["crm.objects.contacts.write", "crm.objects.deals.write"],
//     },
//     {
//       id: "SALESFORCE",
//       name: "Salesforce",
//       description: "Integrate with Salesforce for lead management",
//       logo: "/salesforce.png",
//       features: ["Leads", "Opportunities", "Accounts", "Custom Fields"],
//       supportsOAuth: true,
//       requiresSecret: true,
//       requiresBaseUrl: true,
//       oauthScopes: ["api", "refresh_token"],
//     },
//     {
//       id: "PIPEDRIVE",
//       name: "Pipedrive",
//       description: "Sync leads with Pipedrive pipeline",
//       logo: "/pipedrive.png",
//       features: ["Persons", "Deals", "Organizations", "Activities"],
//       supportsOAuth: true,
//       requiresSecret: false,
//       requiresBaseUrl: true,
//       oauthScopes: ["base"],
//     },
//     {
//       id: "ZOHO",
//       name: "Zoho CRM",
//       description: "Connect with Zoho CRM for comprehensive lead management",
//       logo: "/zoho.png",
//       features: ["Leads", "Contacts", "Deals", "Custom Modules"],
//       supportsOAuth: false,
//       requiresSecret: true,
//       requiresBaseUrl: true,
//       oauthScopes: [],
//     },
//   ]

//   useEffect(() => {
//     fetchCurrentConfig()
//     fetchSyncSettings()
//   }, [userId])

//   const fetchCurrentConfig = async () => {
//     try {
//       const response = await fetch(`/api/crm/config?userId=${userId}`)
//       if (response.ok) {
//         const config = await response.json()
//         setCurrentConfig(config)
//       }
//     } catch (error) {
//       console.error("Error fetching CRM config:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const fetchSyncSettings = async () => {
//     try {
//       const response = await fetch(`/api/crm/sync-settings?userId=${userId}`)
//       if (response.ok) {
//         const settings = await response.json()
//         setSyncSettings(settings)
//       }
//     } catch (error) {
//       console.error("Error fetching sync settings:", error)
//     }
//   }

//   const updateSyncSettings = async (newSettings: any) => {
//     try {
//       const response = await fetch("/api/crm/sync-settings", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId,
//           settings: newSettings,
//         }),
//       })

//       if (response.ok) {
//         setSyncSettings(newSettings)
//         toast.success("Sync settings updated successfully")
//       } else {
//         toast.error("Failed to update sync settings")
//       }
//     } catch (error) {
//       toast.error("Error updating sync settings")
//       console.error("Sync settings error:", error)
//     }
//   }

//   const handleOAuthConnect = async (provider: any) => {
//     setIsConnecting(true)
//     try {
//       const response = await fetch("/api/crm/connect", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId,
//           provider: provider.id,
//           connectionType: "oauth",
//         }),
//       })

//       const data = await response.json()

//       if (response.ok && data.oauthUrl) {
//         window.location.href = data.oauthUrl
//       } else {
//         toast.error(data.error || "Failed to initiate OAuth connection")
//       }
//     } catch (error) {
//       toast.error("Failed to connect CRM")
//       console.error("OAuth connection error:", error)
//     } finally {
//       setIsConnecting(false)
//     }
//   }

//   const handleApiKeyConnect = async () => {
//     if (!newConnection.provider || !newConnection.name || !newConnection.apiKey) {
//       toast.error("Please fill in all required fields")
//       return
//     }

//     const selectedProvider = providers.find((p) => p.id === newConnection.provider)
//     if (selectedProvider?.requiresSecret && !newConnection.apiSecret) {
//       toast.error("API Secret is required for this provider")
//       return
//     }
//     if (selectedProvider?.requiresBaseUrl && !newConnection.baseUrl) {
//       toast.error("Base URL is required for this provider")
//       return
//     }

//     setIsConnecting(true)
//     try {
//       const response = await fetch("/api/crm/connect", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId,
//           connectionType: "api",
//           ...newConnection,
//         }),
//       })

//       if (response.ok) {
//         toast.success("CRM connected successfully!")
//         setShowNewConnection(false)
//         setNewConnection({ provider: "", name: "", apiKey: "", apiSecret: "", baseUrl: "" })
//         fetchCurrentConfig()
//       } else {
//         const error = await response.json()
//         toast.error(error.error || "Failed to connect CRM")
//       }
//     } catch (error) {
//       toast.error("Failed to connect CRM")
//       console.error("Connection error:", error)
//     } finally {
//       setIsConnecting(false)
//     }
//   }

//   const handleTestConnection = async () => {
//     setTestConnection(true)
//     try {
//       const response = await fetch("/api/crm/test", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId }),
//       })

//       if (response.ok) {
//         toast.success("CRM connection is working!")
//       } else {
//         const error = await response.json()
//         toast.error(error.error || "CRM connection failed")
//       }
//     } catch (error) {
//       toast.error("Failed to test connection")
//     } finally {
//       setTestConnection(false)
//     }
//   }

//   const handleDisconnect = async () => {
//     if (!confirm("Are you sure you want to disconnect your CRM? This will stop all automatic syncing.")) {
//       return
//     }

//     try {
//       const response = await fetch("/api/crm/disconnect", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId }),
//       })

//       if (response.ok) {
//         toast.success("CRM disconnected successfully")
//         setCurrentConfig(null)
//       } else {
//         toast.error("Failed to disconnect CRM")
//       }
//     } catch (error) {
//       toast.error("Failed to disconnect CRM")
//     }
//   }

//   const handleManualSync = async () => {
//     if (selectedLeads.length === 0) {
//       toast.error("Please select leads to sync")
//       return
//     }

//     setIsManualSyncing(true)
//     try {
//       const result = await manualSyncToCRM(selectedLeads, userId)

//       if (result.success && result.summary) {
//         toast.success(`Successfully synced ${result.summary.successful} leads to CRM`)
//         if (result.summary.failed > 0) {
//           toast.warning(`${result.summary.failed} leads failed to sync`)
//         }
//         setSelectedLeads([])
//       } else {
//         toast.error(result.error || "Failed to sync leads")
//       }
//     } catch (error) {
//       toast.error("An error occurred during sync")
//       console.error("Manual sync error:", error)
//     } finally {
//       setIsManualSyncing(false)
//     }
//   }

//   const handleBatchSync = async () => {
//     setIsBatchSyncing(true)
//     try {
//       const filters = {
//         status: syncFilters.status || undefined,
//         minScore: syncFilters.minScore ? Number.parseInt(syncFilters.minScore) : undefined,
//         leadTier: syncFilters.leadTier || undefined,
//       }

//       const result = await batchSyncToCRM(userId, filters)

//       if (result.success && result.summary) {
//         toast.success(`Batch sync completed: ${result.summary.successful} leads synced`)
//         if (result.summary.failed > 0) {
//           toast.warning(`${result.summary.failed} leads failed to sync`)
//         }
//       } else {
//         toast.error(result.error || "Batch sync failed")
//       }
//     } catch (error) {
//       toast.error("An error occurred during batch sync")
//       console.error("Batch sync error:", error)
//     } finally {
//       setIsBatchSyncing(false)
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <Loader2 className="h-8 w-8 animate-spin" />
//         <span className="ml-2">Loading CRM configuration...</span>
//       </div>
//     )
//   }

//   const crmStats = analytics?.crmStatus?.integrations || []
//   const hasActiveCRM = currentConfig?.isActive || false

//   return (
//     <div className="space-y-6">
//       {/* CRM Connection Status */}
//       {hasActiveCRM ? (
//         <Card className="border-green-200 bg-green-50/50 dark:bg-green-900/10">
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-3">
//                 <div className="w-12 h-12 flex items-center justify-center">
//                   <img
//                     src={providers.find((p) => p.id === currentConfig.provider)?.logo || "/placeholder.svg"}
//                     alt="Provider Logo"
//                     className="w-12 h-12 object-contain"
//                   />
//                 </div>
//                 <div>
//                   <CardTitle className="flex items-center gap-2">
//                     {providers.find((p) => p.id === currentConfig.provider)?.name}
//                     <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
//                       <CheckCircle className="h-3 w-3 mr-1" />
//                       Connected
//                     </Badge>
//                   </CardTitle>
//                   <CardDescription>
//                     {currentConfig.name} - Connected on {new Date(currentConfig.createdAt).toLocaleDateString()}
//                   </CardDescription>
//                 </div>
//               </div>
//               <div className="flex space-x-2">
//                 <Button variant="outline" size="sm" onClick={handleTestConnection} disabled={testConnection}>
//                   {testConnection ? (
//                     <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                   ) : (
//                     <Settings className="h-4 w-4 mr-2" />
//                   )}
//                   Test Connection
//                 </Button>
//                 <Button variant="destructive" size="sm" onClick={handleDisconnect}>
//                   <Trash2 className="h-4 w-4 mr-2" />
//                   Disconnect
//                 </Button>
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-2 gap-4 text-sm">
//               <div>
//                 <Label className="text-muted-foreground">Provider</Label>
//                 <p className="font-medium">{currentConfig.provider}</p>
//               </div>
//               <div>
//                 <Label className="text-muted-foreground">Status</Label>
//                 <p className="font-medium text-green-600">Active & Syncing</p>
//               </div>
//               <div>
//                 <Label className="text-muted-foreground">Last Sync</Label>
//                 <p className="font-medium">
//                   {currentConfig.lastSynced ? new Date(currentConfig.lastSynced).toLocaleString() : "Never"}
//                 </p>
//               </div>
//               <div>
//                 <Label className="text-muted-foreground">Base URL</Label>
//                 <p className="font-medium">{currentConfig.baseUrl || "Default"}</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="space-y-6">
//           {!showNewConnection ? (
//             <>
//               <div className="text-center py-8">
//                 <ExternalLink className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
//                 <h3 className="text-lg font-semibold mb-2">Connect Your CRM</h3>
//                 <p className="text-muted-foreground mb-6">
//                   Automatically sync your qualified leads to your favorite CRM platform
//                 </p>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {providers.map((provider) => (
//                   <Card key={provider.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
//                     <CardHeader>
//                       <div className="flex items-center space-x-3">
//                         <div className="w-12 h-12 flex items-center justify-center">
//                           <img
//                             src={provider.logo || "/placeholder.svg"}
//                             alt={`${provider.name} logo`}
//                             className="w-12 h-12 object-contain"
//                           />
//                         </div>
//                         <div>
//                           <CardTitle className="text-lg flex items-center gap-2">
//                             {provider.name}
//                             {provider.supportsOAuth && (
//                               <Badge variant="outline" className="text-xs">
//                                 <Shield className="h-3 w-3 mr-1" />
//                                 OAuth
//                               </Badge>
//                             )}
//                           </CardTitle>
//                           <CardDescription className="text-sm">{provider.description}</CardDescription>
//                         </div>
//                       </div>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-3">
//                         <div>
//                           <Label className="text-sm font-medium">Features:</Label>
//                           <div className="flex flex-wrap gap-1 mt-1">
//                             {provider.features.map((feature) => (
//                               <Badge key={feature} variant="outline" className="text-xs">
//                                 {feature}
//                               </Badge>
//                             ))}
//                           </div>
//                         </div>
//                         <div className="flex gap-2">
//                           {provider.supportsOAuth && (
//                             <Button
//                               className="flex-1"
//                               onClick={() => handleOAuthConnect(provider)}
//                               disabled={isConnecting}
//                             >
//                               {isConnecting ? (
//                                 <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                               ) : (
//                                 <Shield className="h-4 w-4 mr-2" />
//                               )}
//                               OAuth Connect
//                             </Button>
//                           )}
//                           <Button
//                             variant="outline"
//                             className="flex-1 bg-transparent"
//                             onClick={() => {
//                               setNewConnection({ ...newConnection, provider: provider.id })
//                               setShowNewConnection(true)
//                             }}
//                           >
//                             <ExternalLink className="h-4 w-4 mr-2" />
//                             API Key
//                           </Button>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </>
//           ) : (
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <div className="text-2xl">
//                     <img
//                       src={providers.find((p) => p.id === newConnection.provider)?.logo || "/placeholder.svg"}
//                       alt="Provider Logo"
//                       className="w-8 h-8 object-contain"
//                     />
//                   </div>
//                   Connect {providers.find((p) => p.id === newConnection.provider)?.name}
//                 </CardTitle>
//                 <CardDescription>
//                   Enter your {providers.find((p) => p.id === newConnection.provider)?.name} API credentials to connect
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="name">Connection Name</Label>
//                   <Input
//                     id="name"
//                     placeholder="e.g., Main CRM Account"
//                     value={newConnection.name}
//                     onChange={(e) => setNewConnection({ ...newConnection, name: e.target.value })}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="apiKey">API Key *</Label>
//                   <Input
//                     id="apiKey"
//                     type="password"
//                     placeholder="Enter your API key"
//                     value={newConnection.apiKey}
//                     onChange={(e) => setNewConnection({ ...newConnection, apiKey: e.target.value })}
//                   />
//                 </div>

//                 {providers.find((p) => p.id === newConnection.provider)?.requiresSecret && (
//                   <div className="space-y-2">
//                     <Label htmlFor="apiSecret">API Secret *</Label>
//                     <Input
//                       id="apiSecret"
//                       type="password"
//                       placeholder="Enter your API secret"
//                       value={newConnection.apiSecret}
//                       onChange={(e) => setNewConnection({ ...newConnection, apiSecret: e.target.value })}
//                     />
//                   </div>
//                 )}

//                 {providers.find((p) => p.id === newConnection.provider)?.requiresBaseUrl && (
//                   <div className="space-y-2">
//                     <Label htmlFor="baseUrl">Base URL *</Label>
//                     <Input
//                       id="baseUrl"
//                       placeholder="e.g., https://your-instance.salesforce.com"
//                       value={newConnection.baseUrl}
//                       onChange={(e) => setNewConnection({ ...newConnection, baseUrl: e.target.value })}
//                     />
//                   </div>
//                 )}

//                 <div className="flex space-x-2">
//                   <Button onClick={handleApiKeyConnect} disabled={isConnecting} className="flex-1">
//                     {isConnecting ? (
//                       <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                     ) : (
//                       <CheckCircle className="h-4 w-4 mr-2" />
//                     )}
//                     Connect
//                   </Button>
//                   <Button variant="outline" onClick={() => setShowNewConnection(false)}>
//                     Cancel
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </div>
//       )}

//       {/* Sync Settings - Only show if CRM is connected */}
//       {hasActiveCRM && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Sync Settings</CardTitle>
//             <CardDescription>Configure how leads are synchronized with your CRM</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <Label className="text-sm font-medium">Auto-sync qualified leads</Label>
//                 <p className="text-xs text-muted-foreground">
//                   Automatically sync leads when they reach &ldquo;Qualified&rdquo; status
//                 </p>
//               </div>
//               <Switch
//                 checked={syncSettings.autoSyncQualified}
//                 onCheckedChange={(checked) => updateSyncSettings({ ...syncSettings, autoSyncQualified: checked })}
//               />
//             </div>
//             <Separator />
//             <div className="flex items-center justify-between">
//               <div>
//                 <Label className="text-sm font-medium">Create deals for high-value leads</Label>
//                 <p className="text-xs text-muted-foreground">
//                   Create deals/opportunities for Platinum and Gold tier leads
//                 </p>
//               </div>
//               <Switch
//                 checked={syncSettings.createDealsHighValue}
//                 onCheckedChange={(checked) => updateSyncSettings({ ...syncSettings, createDealsHighValue: checked })}
//               />
//             </div>
//             <Separator />
//             <div className="flex items-center justify-between">
//               <div>
//                 <Label className="text-sm font-medium">Sync lead scores</Label>
//                 <p className="text-xs text-muted-foreground">Include AI-generated lead scores in CRM records</p>
//               </div>
//               <Switch
//                 checked={syncSettings.syncLeadScores}
//                 onCheckedChange={(checked) => updateSyncSettings({ ...syncSettings, syncLeadScores: checked })}
//               />
//             </div>
//             <Separator />
//             <div className="flex items-center justify-between">
//               <div>
//                 <Label className="text-sm font-medium">Real-time sync</Label>
//                 <p className="text-xs text-muted-foreground">Sync leads immediately when qualified</p>
//               </div>
//               <Switch
//                 checked={syncSettings.realTimeSync}
//                 onCheckedChange={(checked) => updateSyncSettings({ ...syncSettings, realTimeSync: checked })}
//               />
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Manual Sync Controls - Only show if CRM is connected */}
//       {hasActiveCRM && (
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <RefreshCw className="h-5 w-5 text-primary" />
//               Manual Sync Controls
//             </CardTitle>
//             <CardDescription>Manually sync leads to your CRM with advanced filtering options</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             {/* CRM Status Overview */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="p-4 bg-green-50 border border-green-200 rounded-xl dark:bg-green-900/20 dark:border-green-800">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-green-500/10 rounded-lg">
//                     <CheckCircle className="h-5 w-5 text-green-600" />
//                   </div>
//                   <div>
//                     <span className="text-sm font-medium text-green-700 dark:text-green-300">Connected CRMs</span>
//                     <div className="text-2xl font-bold text-green-600 mt-1">1</div>
//                   </div>
//                 </div>
//               </div>

//               <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl dark:bg-blue-900/20 dark:border-blue-800">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-blue-500/10 rounded-lg">
//                     <Activity className="h-5 w-5 text-blue-600" />
//                   </div>
//                   <div>
//                     <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Active Syncs</span>
//                     <div className="text-2xl font-bold text-blue-600 mt-1">1</div>
//                   </div>
//                 </div>
//               </div>

//               <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl dark:bg-purple-900/20 dark:border-purple-800">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-purple-500/10 rounded-lg">
//                     <Clock className="h-5 w-5 text-purple-600" />
//                   </div>
//                   <div>
//                     <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Last Sync</span>
//                     <div className="text-sm font-bold text-purple-600 mt-1">
//                       {currentConfig?.lastSynced
//                         ? formatDistanceToNow(new Date(currentConfig.lastSynced)) + " ago"
//                         : "Never"}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <Separator />

//             {/* Manual Sync Section */}
//             <div className="space-y-4">
//               <div className="flex items-center gap-2">
//                 <div className="p-1 bg-blue-500/10 rounded">
//                   <RefreshCw className="h-4 w-4 text-blue-600" />
//                 </div>
//                 <h4 className="font-semibold text-blue-700 dark:text-blue-300">Manual Sync</h4>
//               </div>

//               <div className="flex items-center gap-2">
//                 <Button
//                   onClick={handleManualSync}
//                   disabled={isManualSyncing || selectedLeads.length === 0}
//                   className="flex-1"
//                 >
//                   {isManualSyncing ? (
//                     <RefreshCw className="h-4 w-4 animate-spin mr-2" />
//                   ) : (
//                     <RefreshCw className="h-4 w-4 mr-2" />
//                   )}
//                   Sync Selected ({selectedLeads.length})
//                 </Button>

//                 <Button variant="outline" onClick={() => setSelectedLeads([])} disabled={selectedLeads.length === 0}>
//                   Clear Selection
//                 </Button>
//               </div>
//             </div>

//             <Separator />

//             {/* Batch Sync Section */}
//             <div className="space-y-4">
//               <div className="flex items-center gap-2">
//                 <div className="p-1 bg-purple-500/10 rounded">
//                   <Target className="h-4 w-4 text-purple-600" />
//                 </div>
//                 <h4 className="font-semibold text-purple-700 dark:text-purple-300">Batch Sync</h4>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <Label className="text-xs font-medium">Status Filter</Label>
//                   <Select
//                     value={syncFilters.status}
//                     onValueChange={(value) => setSyncFilters({ ...syncFilters, status: value })}
//                   >
//                     <SelectTrigger className="mt-1">
//                       <SelectValue placeholder="All Status" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">All Status</SelectItem>
//                       <SelectItem value="QUALIFIED">Qualified</SelectItem>
//                       <SelectItem value="NEW">New</SelectItem>
//                       <SelectItem value="QUALIFYING">Qualifying</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div>
//                   <Label className="text-xs font-medium">Min Score</Label>
//                   <Input
//                     type="number"
//                     placeholder="Min score"
//                     value={syncFilters.minScore}
//                     onChange={(e) => setSyncFilters({ ...syncFilters, minScore: e.target.value })}
//                     className="mt-1"
//                   />
//                 </div>

//                 <div>
//                   <Label className="text-xs font-medium">Lead Tier</Label>
//                   <Select
//                     value={syncFilters.leadTier}
//                     onValueChange={(value) => setSyncFilters({ ...syncFilters, leadTier: value })}
//                   >
//                     <SelectTrigger className="mt-1">
//                       <SelectValue placeholder="All Tiers" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">All Tiers</SelectItem>
//                       <SelectItem value="PLATINUM">Platinum</SelectItem>
//                       <SelectItem value="GOLD">Gold</SelectItem>
//                       <SelectItem value="SILVER">Silver</SelectItem>
//                       <SelectItem value="BRONZE">Bronze</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               <Button onClick={handleBatchSync} disabled={isBatchSyncing} className="w-full">
//                 {isBatchSyncing ? (
//                   <RefreshCw className="h-4 w-4 animate-spin mr-2" />
//                 ) : (
//                   <Target className="h-4 w-4 mr-2" />
//                 )}
//                 Batch Sync with Filters
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   )
// }

// function LeadTierDistribution({ analytics }: { analytics: any }) {
//   if (!analytics?.tierDistribution) return null

//   const { platinum, gold, silver, bronze } = analytics.tierDistribution
//   const total = platinum + gold + silver + bronze

//   if (total === 0) return null

//   const tiers = [
//     {
//       name: "Platinum",
//       value: platinum,
//       color: "bg-purple-500",
//       icon: Crown,
//       revenue: analytics.premiumInsights?.totalPipelineValue * 0.4,
//     },
//     {
//       name: "Gold",
//       value: gold,
//       color: "bg-yellow-500",
//       icon: Award,
//       revenue: analytics.premiumInsights?.totalPipelineValue * 0.3,
//     },
//     {
//       name: "Silver",
//       value: silver,
//       color: "bg-gray-400",
//       icon: Star,
//       revenue: analytics.premiumInsights?.totalPipelineValue * 0.2,
//     },
//     {
//       name: "Bronze",
//       value: bronze,
//       color: "bg-orange-500",
//       icon: Users,
//       revenue: analytics.premiumInsights?.totalPipelineValue * 0.1,
//     },
//   ]

//   return (
//     <Card className="hover:shadow-lg transition-all duration-200">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <PieChart className="h-5 w-5 text-primary" />
//           Lead Tier Distribution
//         </CardTitle>
//         <CardDescription>AI-powered lead classification by revenue potential</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {tiers.map((tier) => {
//             const percentage = total > 0 ? (tier.value / total) * 100 : 0
//             const IconComponent = tier.icon
//             return (
//               <div key={tier.name} className="space-y-2">
//                 <div className="flex items-center justify-between text-sm">
//                   <div className="flex items-center gap-2">
//                     <IconComponent className="h-4 w-4" />
//                     <span className="font-medium">{tier.name}</span>
//                   </div>
//                   <div className="text-right">
//                     <span className="font-medium">
//                       {tier.value} ({Math.round(percentage)}%)
//                     </span>
//                     <div className="text-xs text-muted-foreground">{getRevenueDisplay(tier.revenue || 0)} est.</div>
//                   </div>
//                 </div>
//                 <Progress value={percentage} className="h-2" />
//               </div>
//             )
//           })}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// function RevenueInsightsCard({ analytics }: { analytics: any }) {
//   const insights = analytics?.premiumInsights

//   if (!insights) return null

//   const insightCards = [
//     {
//       icon: Crown,
//       label: "High-Value Leads",
//       value: insights.highValueLeads,
//       color: "bg-purple-50 border-purple-200 dark:bg-purple-900/10 dark:border-purple-800",
//       iconColor: "text-purple-600 dark:text-purple-400",
//       valueColor: "text-purple-600 dark:text-purple-400",
//     },
//     {
//       icon: DollarSign,
//       label: "Avg Lead Value",
//       value: getRevenueDisplay(insights.averageLeadValue),
//       color: "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800",
//       iconColor: "text-green-600 dark:text-green-400",
//       valueColor: "text-green-600 dark:text-green-400",
//     },
//     {
//       icon: Target,
//       label: "Conversion Probability",
//       value: `${insights.conversionProbability}%`,
//       color: "bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800",
//       iconColor: "text-blue-600 dark:text-blue-400",
//       valueColor: "text-blue-600 dark:text-blue-400",
//     },
//   ]

//   return (
//     <Card className="hover:shadow-lg transition-all duration-200">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Sparkles className="h-5 w-5 text-primary" />
//           Revenue Insights
//         </CardTitle>
//         <CardDescription>AI-powered revenue intelligence</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {insightCards.map((card, index) => {
//             const IconComponent = card.icon
//             return (
//               <div
//                 key={index}
//                 className={`flex items-center justify-between p-4 rounded-lg border ${card.color} hover:shadow-md transition-all duration-200`}
//               >
//                 <div className="flex items-center gap-3">
//                   <IconComponent className={`h-5 w-5 ${card.iconColor}`} />
//                   <span className="text-sm font-medium">{card.label}</span>
//                 </div>
//                 <span className={`text-lg font-bold ${card.valueColor}`}>{card.value}</span>
//               </div>
//             )
//           })}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// function EnhancedLeadsTable({
//   leads,
//   onExport,
//   onBulkAction,
//   selectedLeads,
//   onLeadSelection,
// }: {
//   leads: any[]
//   onExport: (format: string, selectedIds: string[]) => void
//   onBulkAction: (action: string, selectedIds: string[]) => void
//   selectedLeads: string[]
//   onLeadSelection: (leadIds: string[]) => void
// }) {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [tierFilter, setTierFilter] = useState("all")
//   const [selectedLead, setSelectedLead] = useState<any>(null)
//   const [isModalOpen, setIsModalOpen] = useState(false)

//   const filteredLeads = useMemo(() => {
//     return leads.filter((lead) => {
//       const displayName = lead.name || `@${lead.instagramUserId?.slice(-4) || "Unknown"}`
//       const matchesSearch =
//         !searchTerm ||
//         displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         lead.instagramUserId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         lead.email?.toLowerCase().includes(searchTerm.toLowerCase())

//       const matchesStatus = statusFilter === "all" || lead.status === statusFilter
//       const matchesTier = tierFilter === "all" || lead.metadata?.lastAnalysis?.leadTier === tierFilter

//       return matchesSearch && matchesStatus && matchesTier
//     })
//   }, [leads, searchTerm, statusFilter, tierFilter])

//   const handleSelectAll = () => {
//     if (selectedLeads.length === filteredLeads.length) {
//       onLeadSelection([])
//     } else {
//       onLeadSelection(filteredLeads.map((lead) => lead.id))
//     }
//   }

//   const handleSelectLead = (leadId: string) => {
//     const newSelection = selectedLeads.includes(leadId)
//       ? selectedLeads.filter((id) => id !== leadId)
//       : [...selectedLeads, leadId]
//     onLeadSelection(newSelection)
//   }

//   const handleViewDetails = (lead: any) => {
//     setSelectedLead(lead)
//     setIsModalOpen(true)
//   }

//   return (
//     <>
//       <Card className="hover:shadow-lg transition-all duration-200">
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle className="flex items-center gap-2">
//                 <Clock className="h-5 w-5 text-primary" />
//                 Premium Lead Pipeline
//               </CardTitle>
//               <CardDescription>
//                 AI-qualified leads with revenue intelligence ({filteredLeads.length} leads)
//               </CardDescription>
//             </div>
//             <div className="flex items-center gap-2">
//               {selectedLeads.length > 0 && (
//                 <>
//                   <Select onValueChange={(action) => onBulkAction(action, selectedLeads)}>
//                     <SelectTrigger className="w-32">
//                       <Settings className="h-4 w-4 mr-2" />
//                       Actions
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="sync-crm">Sync to CRM</SelectItem>
//                       <SelectItem value="send-email">Send Email</SelectItem>
//                       <SelectItem value="update-status">Update Status</SelectItem>
//                       <SelectItem value="add-tags">Add Tags</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <Select onValueChange={(format) => onExport(format, selectedLeads)}>
//                     <SelectTrigger className="w-32">
//                       <Download className="h-4 w-4 mr-2" />
//                       Export
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="csv">CSV</SelectItem>
//                       <SelectItem value="excel">Excel</SelectItem>
//                       <SelectItem value="json">JSON</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </>
//               )}
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {/* Filters */}
//           <div className="flex flex-col sm:flex-row gap-4 mb-6">
//             <div className="flex-1">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search leads by name, email, or Instagram..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10"
//                 />
//               </div>
//             </div>
//             <Select value={statusFilter} onValueChange={setStatusFilter}>
//               <SelectTrigger className="w-40">
//                 <Filter className="h-4 w-4 mr-2" />
//                 <SelectValue placeholder="Status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Status</SelectItem>
//                 <SelectItem value="NEW">New</SelectItem>
//                 <SelectItem value="QUALIFYING">Qualifying</SelectItem>
//                 <SelectItem value="QUALIFIED">Qualified</SelectItem>
//                 <SelectItem value="CONVERTED">Converted</SelectItem>
//                 <SelectItem value="LOST">Lost</SelectItem>
//               </SelectContent>
//             </Select>
//             <Select value={tierFilter} onValueChange={setTierFilter}>
//               <SelectTrigger className="w-40">
//                 <Star className="h-4 w-4 mr-2" />
//                 <SelectValue placeholder="Tier" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Tiers</SelectItem>
//                 <SelectItem value="PLATINUM">Platinum</SelectItem>
//                 <SelectItem value="GOLD">Gold</SelectItem>
//                 <SelectItem value="SILVER">Silver</SelectItem>
//                 <SelectItem value="BRONZE">Bronze</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Select All */}
//           <div className="flex items-center space-x-2 mb-4">
//             <Checkbox
//               checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
//               onCheckedChange={handleSelectAll}
//             />
//             <span className="text-sm text-muted-foreground">Select All ({selectedLeads.length} selected)</span>
//           </div>

//           <Separator className="mb-4" />

//           {/* Leads List */}
//           <ScrollArea className="h-96">
//             <div className="space-y-4">
//               {filteredLeads.length === 0 ? (
//                 <div className="text-center py-12 text-muted-foreground">
//                   <Brain className="h-16 w-16 mx-auto mb-4 opacity-50" />
//                   <p className="text-lg font-medium">No leads found</p>
//                   <p className="text-sm">
//                     Try adjusting your filters or start engaging with customers to generate AI-qualified leads!
//                   </p>
//                 </div>
//               ) : (
//                 filteredLeads.map((lead) => {
//                   const lastAnalysis = lead.metadata?.lastAnalysis
//                   const isSelected = selectedLeads.includes(lead.id)
//                   const scoreProgress = getScoreProgress(lead.score)
//                   const marketingCompleteness = lead.metadata?.marketingCompleteness || 0
//                   const displayName = lead.name || `@${lead.instagramUserId?.slice(-4) || "Unknown"}`

//                   return (
//                     <div
//                       key={lead.id}
//                       className={`flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-all duration-200 cursor-pointer ${
//                         isSelected ? "border-primary bg-primary/5" : ""
//                       }`}
//                       onClick={() => handleSelectLead(lead.id)}
//                     >
//                       <div className="flex items-center space-x-4">
//                         <Checkbox
//                           checked={isSelected}
//                           onChange={() => handleSelectLead(lead.id)}
//                           onClick={(e) => e.stopPropagation()}
//                         />
//                         <Avatar className="h-12 w-12">
//                           <AvatarFallback className="bg-primary/20 text-primary font-semibold">
//                             {displayName.charAt(0).toUpperCase()}
//                           </AvatarFallback>
//                         </Avatar>
//                         <div className="flex-1">
//                           <div className="flex items-center gap-2">
//                             <p className="text-sm font-medium">{displayName}</p>
//                             {getTierBadge(lead.metadata)}
//                           </div>
//                           <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
//                             <span className="flex items-center gap-1">
//                               <Users className="h-3 w-3" />@{lead.instagramUserId}
//                             </span>
//                             {lead.email && (
//                               <span className="flex items-center gap-1">
//                                 <Mail className="h-3 w-3" />
//                                 {lead.email}
//                               </span>
//                             )}
//                             {lead.phone && (
//                               <span className="flex items-center gap-1">
//                                 <Phone className="h-3 w-3" />
//                                 {lead.phone}
//                               </span>
//                             )}
//                             <span>Score: {lead.score}</span>
//                             <span>{formatDistanceToNow(new Date(lead.lastContactDate))} ago</span>
//                           </div>

//                           {/* Score Progress Bar */}
//                           <div className="mt-2">
//                             <div className="flex items-center justify-between mb-1">
//                               <span className="text-xs font-medium">Lead Score</span>
//                               <span className={`text-xs font-bold ${getScoreColor(lead.score)}`}>{lead.score}/100</span>
//                             </div>
//                             <div className="w-full bg-gray-200 rounded-full h-1.5">
//                               <div
//                                 className={`${scoreProgress.color} h-1.5 rounded-full transition-all duration-300`}
//                                 style={{ width: `${scoreProgress.width}%` }}
//                               ></div>
//                             </div>
//                           </div>

//                           {/* Marketing Information Display */}
//                           {(lead.name || lead.email || lead.phone) && (
//                             <div className="mt-2 p-2 bg-muted/50 rounded-lg">
//                               <MarketingInfoDisplay lead={lead} />
//                             </div>
//                           )}

//                           {lastAnalysis?.estimatedValue && (
//                             <div className="flex items-center gap-4 text-xs mt-1">
//                               <span className="text-green-600 font-medium">
//                                 Est: {getRevenueDisplay(lastAnalysis.estimatedValue)}
//                               </span>
//                               {lastAnalysis?.roi && (
//                                 <span className="text-blue-600 font-medium">ROI: {lastAnalysis.roi}%</span>
//                               )}
//                               <span className={`font-medium ${getMarketingCompletenessColor(marketingCompleteness)}`}>
//                                 Profile: {marketingCompleteness}%
//                               </span>
//                             </div>
//                           )}

//                           {lead.interactions && lead.interactions.length > 0 && (
//                             <p className="text-xs text-muted-foreground mt-1 max-w-md truncate">
//                               Last: {lead.interactions[0].content}
//                             </p>
//                           )}

//                           {lastAnalysis?.notificationMessage && (
//                             <p className="text-xs text-blue-600 mt-1 font-medium flex items-center gap-1">
//                               <Brain className="w-3 h-3" />
//                               {lastAnalysis.notificationMessage}
//                             </p>
//                           )}

//                           {lastAnalysis?.nextActions && lastAnalysis.nextActions.length > 0 && (
//                             <div className="flex gap-1 mt-2">
//                               {lastAnalysis.nextActions.slice(0, 2).map((action: string, index: number) => (
//                                 <Badge key={index} variant="outline" className="text-xs">
//                                   <Timer className="w-2 h-2 mr-1" />
//                                   {action.replace(/_/g, " ")}
//                                 </Badge>
//                               ))}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-4">
//                         <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
//                         <div className={`text-sm font-medium ${getScoreColor(lead.score)}`}>{lead.score}</div>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={(e) => {
//                             e.stopPropagation()
//                             handleViewDetails(lead)
//                           }}
//                         >
//                           <Eye className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   )
//                 })
//               )}
//             </div>
//           </ScrollArea>
//         </CardContent>
//       </Card>

//       {/* Lead Details Modal */}
//       <LeadDetailsModal lead={selectedLead} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
//     </>
//   )
// }

// function TopRevenueLeadsCard({ leads }: { leads: any[] }) {
//   return (
//     <Card className="hover:shadow-lg transition-all duration-200">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Crown className="h-5 w-5 text-primary" />
//           Top Revenue Opportunities
//         </CardTitle>
//         <CardDescription>Highest value leads ranked by AI revenue prediction</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ScrollArea className="h-80">
//           <div className="space-y-4">
//             {leads.length === 0 ? (
//               <div className="text-center py-8 text-muted-foreground">
//                 <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                 <p className="text-sm">No high-value leads yet</p>
//                 <p className="text-xs">Focus on engagement to generate premium opportunities</p>
//               </div>
//             ) : (
//               leads.map((lead, index) => {
//                 const lastAnalysis = lead.metadata?.lastAnalysis
//                 const marketingCompleteness = lead.metadata?.marketingCompleteness || 0
//                 const displayName = lead.name || `@${lead.instagramUserId?.slice(-4) || "Unknown"}`
//                 return (
//                   <div
//                     key={lead.id}
//                     className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-all duration-200 group"
//                   >
//                     <div className="flex items-center space-x-3">
//                       <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
//                         {index + 1}
//                       </div>
//                       <div>
//                         <div className="flex items-center gap-2">
//                           <p className="text-sm font-medium">{displayName}</p>
//                           {getTierBadge(lead.metadata)}
//                         </div>
//                         <div className="flex items-center gap-2 mt-1">
//                           <Badge className={getStatusColor(lead.status)} variant="secondary">
//                             {lead.status}
//                           </Badge>
//                           {lastAnalysis?.followUpStrategy && (
//                             <Badge variant="outline" className="text-xs">
//                               {lastAnalysis.followUpStrategy.replace(/_/g, " ")}
//                             </Badge>
//                           )}
//                         </div>
//                         {(lead.name || lead.email || lead.phone) && <MarketingInfoDisplay lead={lead} compact />}
//                         {lastAnalysis?.buyerPersona && (
//                           <p className="text-xs text-muted-foreground mt-1">
//                             Persona: {lastAnalysis.buyerPersona.replace(/_/g, " ")}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <div className={`text-lg font-bold ${getScoreColor(lead.score)}`}>
//                         {lastAnalysis?.estimatedValue
//                           ? getRevenueDisplay(lastAnalysis.estimatedValue)
//                           : `${lead.score}pts`}
//                       </div>
//                       {lastAnalysis?.roi && (
//                         <div className="text-xs text-blue-600 font-medium">ROI: {lastAnalysis.roi}%</div>
//                       )}
//                       <div className={`text-xs ${getMarketingCompletenessColor(marketingCompleteness)}`}>
//                         Profile: {marketingCompleteness}%
//                       </div>
//                       {lead.qualificationData && (
//                         <div className="text-xs text-muted-foreground">
//                           Intent: {lead.qualificationData.intentScore} | Sentiment:{" "}
//                           {lead.qualificationData.sentimentScore}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )
//               })
//             )}
//           </div>
//         </ScrollArea>
//       </CardContent>
//     </Card>
//   )
// }

// function RecentAIAnalysisCard({ interactions }: { interactions: any[] }) {
//   return (
//     <Card className="hover:shadow-lg transition-all duration-200">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Brain className="h-5 w-5 text-primary" />
//           AI Revenue Analysis
//         </CardTitle>
//         <CardDescription>Latest customer interactions with revenue intelligence</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ScrollArea className="h-80">
//           <div className="space-y-3">
//             {interactions.length === 0 ? (
//               <div className="text-center py-8 text-muted-foreground">
//                 <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                 <p className="text-sm">No recent AI analysis</p>
//                 <p className="text-xs">Interactions will appear here as they&apos;re analyzed</p>
//               </div>
//             ) : (
//               interactions.slice(0, 10).map((interaction) => {
//                 const metadata = interaction.metadata
//                 const marketingCompleteness = metadata?.marketingCompleteness || 0
//                 const displayName =
//                   interaction.lead.name || `@${interaction.lead.instagramUserId?.slice(-4) || "Unknown"}`
//                 return (
//                   <div
//                     key={interaction.id}
//                     className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-all duration-200"
//                   >
//                     <Avatar className="h-8 w-8">
//                       <AvatarFallback className="text-xs bg-primary/20 text-primary">
//                         {displayName.charAt(0).toUpperCase()}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2 text-sm">
//                         <span className="font-medium">{displayName}</span>
//                         <Badge className={getStatusColor(interaction.lead.status)} variant="outline">
//                           {interaction.lead.status}
//                         </Badge>
//                         {metadata?.leadTier && (
//                           <Badge variant="secondary" className="text-xs">
//                             {metadata.leadTier}
//                           </Badge>
//                         )}
//                         {metadata?.hasMarketingInfo && (
//                           <Badge
//                             variant="outline"
//                             className={`text-xs ${getMarketingCompletenessColor(marketingCompleteness)}`}
//                           >
//                             {marketingCompleteness}% Profile
//                           </Badge>
//                         )}
//                       </div>
//                       <p className="text-sm text-muted-foreground mt-1 truncate">{interaction.content}</p>
//                       <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
//                         <span className="capitalize">{interaction.type}</span>
//                         <span>•</span>
//                         <span>{formatDistanceToNow(new Date(interaction.timestamp))} ago</span>
//                         {metadata?.estimatedValue && (
//                           <>
//                             <span>•</span>
//                             <span className="text-green-600 font-medium">
//                               {getRevenueDisplay(metadata.estimatedValue)}
//                             </span>
//                           </>
//                         )}
//                         {interaction.sentiment && (
//                           <>
//                             <span>•</span>
//                             <span className={interaction.sentiment > 0 ? "text-green-600" : "text-red-600"}>
//                               {interaction.sentiment > 0 ? "Positive" : "Negative"}
//                             </span>
//                           </>
//                         )}
//                       </div>
//                       {metadata?.notificationMessage && (
//                         <p className="text-xs text-blue-600 mt-1 font-medium flex items-center gap-1">
//                           <Sparkles className="w-3 h-3" />
//                           {metadata.notificationMessage}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 )
//               })
//             )}
//           </div>
//         </ScrollArea>
//       </CardContent>
//     </Card>
//   )
// }

// export function PremiumLeadsDashboard({
//   analytics,
//   recentLeads,
//   topLeads,
//   hasDuplicates,
//   duplicateCount,
//   userId,
//   onMergeDuplicates,
//   interactions,
// }: PremiumLeadsDashboardProps) {
//   const [selectedLeads, setSelectedLeads] = useState<string[]>([])

//   const handleMerge = () => (onMergeDuplicates ? onMergeDuplicates(userId) : handleMergeDuplicates(userId))

//   const handleExport = (format: string, selectedIds: string[]) => {
//     toast.success(`Exporting ${selectedIds.length} leads as ${format.toUpperCase()}`)
//   }

//   const handleBulkAction = (action: string, selectedIds: string[]) => {
//     toast.success(`Performing ${action} on ${selectedIds.length} leads`)
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between space-y-2">
//         <div>
//           <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
//             <div className="p-2 bg-primary/10 rounded-lg">
//               <Crown className="h-8 w-8 text-primary" />
//             </div>
//             <div>
//               <span>Premium AI Revenue Intelligence</span>
//               <div className="flex items-center gap-2 mt-1">
//                 <Badge variant="secondary" className="text-xs">
//                   <Zap className="h-3 w-3 mr-1" />
//                   AI-Powered
//                 </Badge>
//                 <Badge variant="outline" className="text-xs">
//                   <Activity className="h-3 w-3 mr-1" />
//                   Real-time Analytics
//                 </Badge>
//                 <Badge variant="outline" className="text-xs">
//                   <User className="h-3 w-3 mr-1" />
//                   Contact Capture
//                 </Badge>
//               </div>
//             </div>
//           </h2>
//           <p className="text-muted-foreground mt-2">
//             Advanced AI-powered lead qualification with revenue prediction and contact information capture
//           </p>
//         </div>
//         <div className="flex items-center space-x-2">
//           <Button variant="outline">
//             <LineChart className="mr-2 h-4 w-4" />
//             Revenue Report
//           </Button>
//           <Button variant="outline">
//             <Calendar className="mr-2 h-4 w-4" />
//             Schedule Export
//           </Button>
//           <Button>
//             <Plus className="mr-2 h-4 w-4" />
//             Add Lead
//           </Button>
//         </div>
//       </div>

//       {/* Duplicate Alert */}
//       <DuplicateAlert hasDuplicates={hasDuplicates} duplicateCount={duplicateCount} onMergeDuplicates={handleMerge} />

//       {/* Analytics Cards */}
//       <PremiumAnalyticsCards analytics={analytics} />

//       {/* Main Content */}
//       <Tabs defaultValue="overview" className="space-y-6">
//         <TabsList className="grid w-full grid-cols-5">
//           <TabsTrigger value="overview" className="flex items-center gap-2">
//             <BarChart3 className="h-4 w-4" />
//             Overview
//           </TabsTrigger>
//           <TabsTrigger value="leads" className="flex items-center gap-2">
//             <Users className="h-4 w-4" />
//             Lead Pipeline
//           </TabsTrigger>
//           <TabsTrigger value="analysis" className="flex items-center gap-2">
//             <Brain className="h-4 w-4" />
//             AI Analysis
//           </TabsTrigger>
//           <TabsTrigger value="insights" className="flex items-center gap-2">
//             <Sparkles className="h-4 w-4" />
//             Revenue Insights
//           </TabsTrigger>
//           <TabsTrigger value="integrations" className="flex items-center gap-2">
//             <ExternalLink className="h-4 w-4" />
//             Integrations
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="overview" className="space-y-6">
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
//             <div className="col-span-4">
//               <EnhancedLeadsTable
//                 leads={recentLeads}
//                 onExport={handleExport}
//                 onBulkAction={handleBulkAction}
//                 selectedLeads={selectedLeads}
//                 onLeadSelection={setSelectedLeads}
//               />
//             </div>
//             <div className="col-span-3 space-y-6">
//               <TopRevenueLeadsCard leads={topLeads} />
//               <LeadTierDistribution analytics={analytics} />
//             </div>
//           </div>
//         </TabsContent>

//         <TabsContent value="leads" className="space-y-6">
//           <EnhancedLeadsTable
//             leads={recentLeads}
//             onExport={handleExport}
//             onBulkAction={handleBulkAction}
//             selectedLeads={selectedLeads}
//             onLeadSelection={setSelectedLeads}
//           />
//         </TabsContent>

//         <TabsContent value="analysis" className="space-y-6">
//           <div className="grid gap-6 md:grid-cols-2">
//             <RecentAIAnalysisCard interactions={interactions || []} />
//             <LeadTierDistribution analytics={analytics} />
//           </div>
//         </TabsContent>

//         <TabsContent value="insights" className="space-y-6">
//           <div className="grid gap-6 md:grid-cols-2">
//             <RevenueInsightsCard analytics={analytics} />
//             <TopRevenueLeadsCard leads={topLeads} />
//           </div>
//         </TabsContent>

//         <TabsContent value="integrations" className="space-y-6">
//           <UnifiedCRMIntegration userId={userId} analytics={analytics} />
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }








// "use client"

// import React, { useState, useTransition, useMemo, useEffect } from "react"
// import { handleMergeDuplicates } from "@/actions/leads"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { Progress } from "@/components/ui/progress"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Separator } from "@/components/ui/separator"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Label } from "@/components/ui/label"
// import { Switch } from "@/components/ui/switch"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import {
//   Users,
//   TrendingUp,
//   MessageSquare,
//   Target,
//   Calendar,
//   BarChart3,
//   Clock,
//   Star,
//   Plus,
//   AlertTriangle,
//   Merge,
//   RefreshCw,
//   Brain,
//   DollarSign,
//   Crown,
//   Award,
//   ArrowUpRight,
//   Sparkles,
//   Timer,
//   PieChart,
//   LineChart,
//   Download,
//   Search,
//   Filter,
//   Settings,
//   Mail,
//   Phone,
//   Eye,
//   ExternalLink,
//   Zap,
//   TrendingDown,
//   Activity,
//   Shield,
//   CheckCircle,
//   Loader2,
//   Trash2,
//   User,
//   Instagram,
//   Copy,
// } from "lucide-react"
// import { formatDistanceToNow } from "date-fns"
// import { useRouter } from "next/navigation"
// import { toast } from "sonner"
// import { manualSyncToCRM, batchSyncToCRM } from "@/lib/lead-qualification"
// import { LeadActionsModal } from "./leads-actions-modal"

// interface PremiumLeadsDashboardProps {
//   analytics: any
//   recentLeads: any[]
//   topLeads: any[]
//   hasDuplicates: boolean
//   duplicateCount: number
//   userId: string
//   onMergeDuplicates?: (userId: string) => Promise<{ success: boolean; mergedGroups?: number; error?: string }>
//   interactions: any[]
// }

// // Enhanced utility functions
// function getStatusColor(status: string) {
//   const colors = {
//     NEW: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
//     QUALIFYING:
//       "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
//     QUALIFIED:
//       "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
//     CONVERTED:
//       "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
//     LOST: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
//   }
//   return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
// }

// function getScoreColor(score: number) {
//   if (score >= 85) return "text-purple-600 font-bold dark:text-purple-400"
//   if (score >= 70) return "text-green-600 font-bold dark:text-green-400"
//   if (score >= 50) return "text-yellow-600 font-semibold dark:text-yellow-400"
//   if (score >= 30) return "text-orange-600 dark:text-orange-400"
//   return "text-red-600 dark:text-red-400"
// }

// function getScoreProgress(score: number) {
//   if (score >= 85) return { color: "bg-purple-500", width: (score / 100) * 100 }
//   if (score >= 70) return { color: "bg-green-500", width: (score / 100) * 100 }
//   if (score >= 50) return { color: "bg-yellow-500", width: (score / 100) * 100 }
//   if (score >= 30) return { color: "bg-orange-500", width: (score / 100) * 100 }
//   return { color: "bg-red-500", width: (score / 100) * 100 }
// }

// function getMarketingCompletenessColor(completeness: number) {
//   if (completeness >= 80) return "text-green-600 font-bold"
//   if (completeness >= 60) return "text-blue-600 font-semibold"
//   if (completeness >= 40) return "text-yellow-600 font-semibold"
//   if (completeness >= 20) return "text-orange-600"
//   return "text-red-600"
// }

// function getTierBadge(metadata: any) {
//   const lastAnalysis = metadata?.lastAnalysis
//   const tier = lastAnalysis?.leadTier

//   if (!tier) return null

//   const tierConfig = {
//     PLATINUM: {
//       icon: Crown,
//       color: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/20 dark:text-purple-400",
//       label: "Platinum",
//     },
//     GOLD: {
//       icon: Award,
//       color: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400",
//       label: "Gold",
//     },
//     SILVER: {
//       icon: Star,
//       color: "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900/20 dark:text-gray-400",
//       label: "Silver",
//     },
//     BRONZE: {
//       icon: Users,
//       color: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/20 dark:text-orange-400",
//       label: "Bronze",
//     },
//   }

//   const config = tierConfig[tier as keyof typeof tierConfig]
//   if (!config) return null

//   const IconComponent = config.icon

//   return (
//     <Badge className={`${config.color} ml-2 px-2 py-1`}>
//       <IconComponent className="w-3 h-3 mr-1" />
//       {config.label}
//     </Badge>
//   )
// }

// function getRevenueDisplay(value: number) {
//   if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
//   if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`
//   return `$${value.toFixed(0)}`
// }

// function copyToClipboard(text: string, label: string) {
//   navigator.clipboard.writeText(text)
//   toast.success(`${label} copied to clipboard`)
// }

// // Enhanced Lead Details Modal Component
// function LeadDetailsModal({ lead, isOpen, onClose }: { lead: any; isOpen: boolean; onClose: () => void }) {
 

//   const lastAnalysis = lead.metadata?.lastAnalysis
//   const marketingCompleteness = lead.metadata?.marketingCompleteness || 0
//   const displayName = lead.name || `@${lead.instagramUserId?.slice(-4) || "Unknown"}`

//   // Add state for action modal in LeadDetailsModal
//   const [actionModalOpen, setActionModalOpen] = useState(false)
//   const [currentAction, setCurrentAction] = useState<
//     "email" | "call" | "note" | "status" | "campaign" | "followup" | null
//   >(null)

//    if (!lead) return null
//   // Update the action handlers:
//   const handleViewInCRM = (lead: any) => {
//     if (lead.crmId) {
//       window.open(`https://your-crm.com/contacts/${lead.crmId}`, "_blank")
//     } else {
//       toast.info("Lead not synced to CRM yet. Would you like to sync now?")
//     }
//   }

//   const handleSendEmail = (lead: any) => {
//     setCurrentAction("email")
//     setActionModalOpen(true)
//   }

//   const handleCallLead = (lead: any) => {
//     if (lead.phone) {
//       window.location.href = `tel:${lead.phone}`
//     } else {
//       toast.error("No phone number available for this lead")
//     }
//   }

//   const handleAddNote = (lead: any) => {
//     setCurrentAction("note")
//     setActionModalOpen(true)
//   }

//   const handleUpdateStatus = (lead: any) => {
//     setCurrentAction("status")
//     setActionModalOpen(true)
//   }

//   const handleScheduleFollowup = (lead: any) => {
//     setCurrentAction("followup")
//     setActionModalOpen(true)
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
//         <DialogHeader>
//           <div className="flex items-center gap-4">
//             <Avatar className="h-16 w-16">
//               <AvatarFallback className="bg-primary/20 text-primary font-bold text-lg">
//                 {displayName.charAt(0).toUpperCase()}
//               </AvatarFallback>
//             </Avatar>
//             <div className="flex-1">
//               <DialogTitle className="text-2xl flex items-center gap-3">
//                 {displayName}
//                 {lastAnalysis?.leadTier && getTierBadge(lead.metadata)}
//               </DialogTitle>
//               <DialogDescription className="flex items-center gap-4 mt-2">
//                 <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
//                 <span className="text-sm text-muted-foreground">
//                   Score: {lead.score}/100 • Last contact: {formatDistanceToNow(new Date(lead.lastContactDate))} ago
//                 </span>
//               </DialogDescription>
//             </div>
//           </div>
//         </DialogHeader>

//         <div className="flex flex-col max-h-[70vh]">
//           <ScrollArea className="flex-1 pr-4">
//             <div className="space-y-6">
//               {/* Contact Information */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold flex items-center gap-2">
//                     <User className="h-5 w-5 text-primary" />
//                     Contact Information
//                   </h3>

//                   <div className="space-y-3">
//                     {lead.name && (
//                       <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
//                         <div className="flex items-center gap-3">
//                           <User className="h-4 w-4 text-muted-foreground" />
//                           <div>
//                             <p className="font-medium">{lead.name}</p>
//                             <p className="text-xs text-muted-foreground">Full Name</p>
//                           </div>
//                         </div>
//                         <Button variant="ghost" size="sm" onClick={() => copyToClipboard(lead.name, "Name")}>
//                           <Copy className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     )}

//                     {lead.email && (
//                       <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
//                         <div className="flex items-center gap-3">
//                           <Mail className="h-4 w-4 text-muted-foreground" />
//                           <div>
//                             <p className="font-medium">{lead.email}</p>
//                             <p className="text-xs text-muted-foreground">Email Address</p>
//                           </div>
//                         </div>
//                         <Button variant="ghost" size="sm" onClick={() => copyToClipboard(lead.email, "Email")}>
//                           <Copy className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     )}

//                     {lead.phone && (
//                       <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
//                         <div className="flex items-center gap-3">
//                           <Phone className="h-4 w-4 text-muted-foreground" />
//                           <div>
//                             <p className="font-medium">{lead.phone}</p>
//                             <p className="text-xs text-muted-foreground">Phone Number</p>
//                           </div>
//                         </div>
//                         <Button variant="ghost" size="sm" onClick={() => copyToClipboard(lead.phone, "Phone")}>
//                           <Copy className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     )}

//                     <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
//                       <div className="flex items-center gap-3">
//                         <Instagram className="h-4 w-4 text-muted-foreground" />
//                         <div>
//                           <p className="font-medium">@{lead.instagramUserId}</p>
//                           <p className="text-xs text-muted-foreground">Instagram Handle</p>
//                         </div>
//                       </div>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => copyToClipboard(lead.instagramUserId, "Instagram")}
//                       >
//                         <Copy className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>

//                   {/* Profile Completeness */}
//                   <div className="p-4 border rounded-lg">
//                     <div className="flex items-center justify-between mb-3">
//                       <span className="text-sm font-medium">Profile Completeness</span>
//                       <span className="text-sm font-bold text-primary">{marketingCompleteness}%</span>
//                     </div>
//                     <Progress value={marketingCompleteness} className="h-2" />
//                     <p className="text-xs text-muted-foreground mt-2">
//                       {marketingCompleteness >= 80
//                         ? "Complete profile - ready for CRM sync"
//                         : marketingCompleteness >= 50
//                           ? "Good progress - collect remaining details"
//                           : "Incomplete profile - gather more contact information"}
//                     </p>
//                   </div>
//                 </div>

//                 {/* AI Analysis & Revenue */}
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold flex items-center gap-2">
//                     <Brain className="h-5 w-5 text-primary" />
//                     AI Analysis & Revenue
//                   </h3>

//                   {lastAnalysis && (
//                     <div className="space-y-3">
//                       <div className="p-4 border rounded-lg">
//                         <div className="flex items-center justify-between mb-2">
//                           <span className="text-sm font-medium">Lead Score</span>
//                           <span className="text-lg font-bold text-primary">{lead.score}/100</span>
//                         </div>
//                         <Progress value={lead.score} className="h-2 mb-2" />
//                         <p className="text-xs text-muted-foreground">
//                           {lead.score >= 85
//                             ? "Excellent - High conversion probability"
//                             : lead.score >= 70
//                               ? "Good - Strong potential"
//                               : lead.score >= 50
//                                 ? "Fair - Needs nurturing"
//                                 : "Low - Requires attention"}
//                         </p>
//                       </div>

//                       {lastAnalysis.estimatedValue > 0 && (
//                         <div className="p-4 border rounded-lg bg-green-50/50 dark:bg-green-900/10">
//                           <div className="flex items-center gap-2 mb-2">
//                             <DollarSign className="h-4 w-4 text-green-600" />
//                             <span className="text-sm font-medium">Revenue Potential</span>
//                           </div>
//                           <p className="text-2xl font-bold text-green-600">
//                             {getRevenueDisplay(lastAnalysis.estimatedValue)}
//                           </p>
//                           {lastAnalysis.roi > 0 && (
//                             <p className="text-xs text-muted-foreground mt-1">Expected ROI: {lastAnalysis.roi}%</p>
//                           )}
//                         </div>
//                       )}

//                       {lastAnalysis.buyerPersona && (
//                         <div className="p-4 border rounded-lg">
//                           <div className="flex items-center gap-2 mb-2">
//                             <Target className="h-4 w-4 text-blue-600" />
//                             <span className="text-sm font-medium">Buyer Persona</span>
//                           </div>
//                           <Badge variant="outline" className="capitalize">
//                             {lastAnalysis.buyerPersona.replace(/_/g, " ")}
//                           </Badge>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <Separator />

//               {/* Recent Interactions */}
//               {lead.interactions && lead.interactions.length > 0 && (
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold flex items-center gap-2">
//                     <MessageSquare className="h-5 w-5 text-primary" />
//                     Recent Interactions ({lead.interactions.length})
//                   </h3>

//                   <div className="space-y-3">
//                     {lead.interactions.slice(0, 5).map((interaction: any, index: number) => (
//                       <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
//                         <div className="flex items-start justify-between mb-2">
//                           <div className="flex items-center gap-2">
//                             <Badge variant="outline" className="capitalize">
//                               {interaction.type}
//                             </Badge>
//                             <span className="text-xs text-muted-foreground">
//                               {formatDistanceToNow(new Date(interaction.timestamp))} ago
//                             </span>
//                           </div>
//                           {interaction.sentiment && (
//                             <Badge variant={interaction.sentiment > 0 ? "default" : "destructive"}>
//                               {interaction.sentiment > 0 ? "Positive" : "Negative"}
//                             </Badge>
//                           )}
//                         </div>
//                         <p className="text-sm text-muted-foreground">{interaction.content}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Next Actions */}
//               {lastAnalysis?.nextActions && lastAnalysis.nextActions.length > 0 && (
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold flex items-center gap-2">
//                     <Activity className="h-5 w-5 text-primary" />
//                     Recommended Actions
//                   </h3>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                     {lastAnalysis.nextActions.map((action: string, index: number) => (
//                       <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
//                         <CheckCircle className="h-4 w-4 text-green-600" />
//                         <span className="text-sm capitalize">{action.replace(/_/g, " ")}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* AI Notification */}
//               {lastAnalysis?.notificationMessage && (
//                 <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-lg dark:bg-blue-900/10 dark:border-blue-800">
//                   <div className="flex items-start gap-3">
//                     <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
//                     <div>
//                       <h4 className="font-medium text-blue-800 dark:text-blue-400">AI Insight</h4>
//                       <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
//                         {lastAnalysis.notificationMessage}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </ScrollArea>
//         </div>

//         {/* Update the modal footer with more actions: */}
//         <div className="flex justify-between items-center pt-4 border-t bg-background">
//           <div className="flex gap-2 flex-wrap">
//             <Button variant="outline" size="sm" onClick={() => handleViewInCRM(lead)}>
//               <ExternalLink className="h-4 w-4 mr-2" />
//               View in CRM
//             </Button>
//             <Button variant="outline" size="sm" onClick={() => handleSendEmail(lead)}>
//               <Mail className="h-4 w-4 mr-2" />
//               Send Email
//             </Button>
//             <Button variant="outline" size="sm" onClick={() => handleCallLead(lead)}>
//               <Phone className="h-4 w-4 mr-2" />
//               Call Lead
//             </Button>
//             <Button variant="outline" size="sm" onClick={() => handleAddNote(lead)}>
//               <Plus className="h-4 w-4 mr-2" />
//               Add Note
//             </Button>
//           </div>
//           <div className="flex gap-2">
//             <Button variant="outline" onClick={() => handleUpdateStatus(lead)}>
//               Update Status
//             </Button>
//             <Button onClick={onClose}>Close</Button>
//           </div>
//         </div>

//         {/* Add the LeadActionsModal at the end of the LeadDetailsModal component: */}
//         <LeadActionsModal
//           lead={lead}
//           isOpen={actionModalOpen}
//           onClose={() => setActionModalOpen(false)}
//           actionType={currentAction}
//         />
//       </DialogContent>
//     </Dialog>
//   )
// }

// // Marketing Information Display Component
// function MarketingInfoDisplay({ lead, compact = false }: { lead: any; compact?: boolean }) {
//   if (!lead) return null

//   const completeness = lead.metadata?.marketingCompleteness || 0
//   const hasName = !!lead.name
//   const hasEmail = !!lead.email
//   const hasPhone = !!lead.phone

//   if (compact) {
//     return (
//       <div className="flex items-center gap-2 text-xs">
//         <div className={`flex items-center gap-1 ${getMarketingCompletenessColor(completeness)}`}>
//           <User className="h-3 w-3" />
//           <span>{completeness}% complete</span>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-2">
//       <div className="flex items-center justify-between">
//         <span className="text-sm font-medium">Contact Information</span>
//         <Badge variant="outline" className={getMarketingCompletenessColor(completeness)}>
//           {completeness}% Complete
//         </Badge>
//       </div>
//       <div className="grid grid-cols-2 gap-2 text-xs">
//         {hasName && (
//           <div className="flex items-center gap-1">
//             <User className="h-3 w-3 text-muted-foreground" />
//             <span>{lead.name}</span>
//           </div>
//         )}
//         {hasEmail && (
//           <div className="flex items-center gap-1">
//             <Mail className="h-3 w-3 text-muted-foreground" />
//             <span>{lead.email}</span>
//           </div>
//         )}
//         {hasPhone && (
//           <div className="flex items-center gap-1">
//             <Phone className="h-3 w-3 text-muted-foreground" />
//             <span>{lead.phone}</span>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// // Enhanced components
// function DuplicateAlert({
//   hasDuplicates,
//   duplicateCount,
//   onMergeDuplicates,
// }: {
//   hasDuplicates: boolean
//   duplicateCount: number
//   onMergeDuplicates: () => Promise<{ success: boolean; mergedGroups?: number; error?: string }>
// }) {
//   const [isPending, startTransition] = useTransition()
//   const router = useRouter()

//   if (!hasDuplicates) return null

//   const handleMerge = () => {
//     startTransition(async () => {
//       try {
//         const result = await onMergeDuplicates()
//         if (result.success) {
//           toast.success(`Successfully merged ${result.mergedGroups} duplicate groups`)
//           router.refresh()
//         } else {
//           toast.error(result.error || "Failed to merge duplicates")
//         }
//       } catch (error) {
//         toast.error("An error occurred while merging duplicates")
//       }
//     })
//   }

//   return (
//     <Alert className="border-orange-200 bg-orange-50/50 dark:bg-orange-900/10">
//       <AlertTriangle className="h-4 w-4 text-orange-600" />
//       <AlertTitle className="text-orange-800 dark:text-orange-400">Duplicate Leads Detected</AlertTitle>
//       <AlertDescription className="text-orange-700 dark:text-orange-300">
//         Found {duplicateCount} groups of duplicate leads. Merge them to improve your revenue analytics and data quality.
//         <Button
//           variant="outline"
//           size="sm"
//           className="ml-2 border-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/20 bg-transparent"
//           onClick={handleMerge}
//           disabled={isPending}
//         >
//           {isPending ? <RefreshCw className="mr-2 h-3 w-3 animate-spin" /> : <Merge className="mr-2 h-3 w-3" />}
//           {isPending ? "Merging..." : "Merge Duplicates"}
//         </Button>
//       </AlertDescription>
//     </Alert>
//   )
// }

// function PremiumAnalyticsCards({ analytics }: { analytics: any }) {
//   if (!analytics) {
//     return (
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
//         {[1, 2, 3, 4, 5].map((i) => (
//           <Card key={i} className="animate-pulse">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <div className="h-4 bg-gray-200 rounded w-20"></div>
//               <div className="h-4 w-4 bg-gray-200 rounded"></div>
//             </CardHeader>
//             <CardContent>
//               <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
//               <div className="h-3 bg-gray-200 rounded w-24"></div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     )
//   }

//   const cards = [
//     {
//       title: "Total Leads",
//       value: analytics.totalLeads,
//       subtitle: "AI-powered lead generation",
//       icon: Users,
//       color: "border-l-blue-500",
//       trend: null,
//     },
//     {
//       title: "Qualified Leads",
//       value: analytics.qualifiedLeads,
//       subtitle: `${analytics.conversionRate}% conversion rate`,
//       icon: Target,
//       color: "border-l-green-500",
//       trend: analytics.conversionRate >= 15 ? "up" : analytics.conversionRate >= 10 ? "stable" : "down",
//     },
//     {
//       title: "Revenue Pipeline",
//       value: getRevenueDisplay(analytics.revenueMetrics?.totalEstimatedRevenue || 0),
//       subtitle: "Estimated total value",
//       icon: DollarSign,
//       color: "border-l-purple-500",
//       trend: null,
//     },
//     {
//       title: "Expected Revenue",
//       value: getRevenueDisplay(analytics.revenueMetrics?.totalExpectedRevenue || 0),
//       subtitle: `${Math.abs(analytics.revenueMetrics?.revenueGrowth || 0)}% vs last week`,
//       icon: TrendingUp,
//       color: "border-l-yellow-500",
//       trend: analytics.revenueMetrics?.revenueGrowth >= 0 ? "up" : "down",
//     },
//     {
//       title: "Avg ROI",
//       value: `${analytics.revenueMetrics?.averageROI || 0}%`,
//       subtitle: "Return on investment",
//       icon: BarChart3,
//       color: "border-l-orange-500",
//       trend:
//         analytics.revenueMetrics?.averageROI >= 200
//           ? "up"
//           : analytics.revenueMetrics?.averageROI >= 100
//             ? "stable"
//             : "down",
//     },
//   ]

//   return (
//     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
//       {cards.map((card, index) => {
//         const IconComponent = card.icon
//         const trendIcon = card.trend === "up" ? ArrowUpRight : card.trend === "down" ? TrendingDown : Activity
//         const trendColor =
//           card.trend === "up" ? "text-green-500" : card.trend === "down" ? "text-red-500" : "text-blue-500"

//         return (
//           <Card key={index} className={`${card.color} border-l-4 hover:shadow-lg transition-all duration-200 group`}>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
//                 {card.title}
//               </CardTitle>
//               <IconComponent className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold mb-1">{card.value}</div>
//               <div className="flex items-center text-xs text-muted-foreground">
//                 {card.trend && React.createElement(trendIcon, { className: `h-3 w-3 mr-1 ${trendColor}` })}
//                 <span>{card.subtitle}</span>
//               </div>
//             </CardContent>
//           </Card>
//         )
//       })}
//     </div>
//   )
// }

// // UNIFIED CRM Integration Component - Professional Implementation
// function UnifiedCRMIntegration({ userId, analytics }: { userId: string; analytics: any }) {

  
//   const [currentConfig, setCurrentConfig] = useState<any>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [isConnecting, setIsConnecting] = useState(false)
//   const [testConnection, setTestConnection] = useState(false)
//   const [showNewConnection, setShowNewConnection] = useState(false)
//   const [newConnection, setNewConnection] = useState({
//     provider: "",
//     name: "",
//     apiKey: "",
//     apiSecret: "",
//     baseUrl: "",
//   })

//   // Sync Settings State
//   const [syncSettings, setSyncSettings] = useState({
//     autoSyncQualified: true,
//     createDealsHighValue: true,
//     syncLeadScores: true,
//     realTimeSync: true,
//   })

//   // Manual Sync State
//   const [isManualSyncing, setIsManualSyncing] = useState(false)
//   const [isBatchSyncing, setIsBatchSyncing] = useState(false)
//   const [selectedLeads, setSelectedLeads] = useState<string[]>([])
//   const [syncFilters, setSyncFilters] = useState({
//     status: "",
//     minScore: "",
//     leadTier: "",
//   })

//   const providers = [
//     {
//       id: "HUBSPOT",
//       name: "HubSpot",
//       description: "Connect with HubSpot CRM for contacts and deals",
//       logo: "/hubspot.png",
//       features: ["Contacts", "Deals", "Companies", "Custom Properties"],
//       supportsOAuth: true,
//       requiresSecret: false,
//       requiresBaseUrl: false,
//       oauthScopes: ["crm.objects.contacts.write", "crm.objects.deals.write"],
//     },
//     {
//       id: "SALESFORCE",
//       name: "Salesforce",
//       description: "Integrate with Salesforce for lead management",
//       logo: "/salesforce.png",
//       features: ["Leads", "Opportunities", "Accounts", "Custom Fields"],
//       supportsOAuth: true,
//       requiresSecret: true,
//       requiresBaseUrl: true,
//       oauthScopes: ["api", "refresh_token"],
//     },
//     {
//       id: "PIPEDRIVE",
//       name: "Pipedrive",
//       description: "Sync leads with Pipedrive pipeline",
//       logo: "/pipedrive.png",
//       features: ["Persons", "Deals", "Organizations", "Activities"],
//       supportsOAuth: true,
//       requiresSecret: false,
//       requiresBaseUrl: true,
//       oauthScopes: ["base"],
//     },
//     {
//       id: "ZOHO",
//       name: "Zoho CRM",
//       description: "Connect with Zoho CRM for comprehensive lead management",
//       logo: "/zoho.png",
//       features: ["Leads", "Contacts", "Deals", "Custom Modules"],
//       supportsOAuth: false,
//       requiresSecret: true,
//       requiresBaseUrl: true,
//       oauthScopes: [],
//     },
//   ]

//   useEffect(() => {
//     fetchCurrentConfig()
//     fetchSyncSettings()
//   }, [userId])

//   const fetchCurrentConfig = async () => {
//     try {
//       const response = await fetch(`/api/crm/config?userId=${userId}`)
//       if (response.ok) {
//         const config = await response.json()
//         setCurrentConfig(config)
//       }
//     } catch (error) {
//       console.error("Error fetching CRM config:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const fetchSyncSettings = async () => {
//     try {
//       const response = await fetch(`/api/crm/sync-settings?userId=${userId}`)
//       if (response.ok) {
//         const settings = await response.json()
//         setSyncSettings(settings)
//       }
//     } catch (error) {
//       console.error("Error fetching sync settings:", error)
//     }
//   }

//   const updateSyncSettings = async (newSettings: any) => {
//     try {
//       const response = await fetch("/api/crm/sync-settings", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId,
//           settings: newSettings,
//         }),
//       })

//       if (response.ok) {
//         setSyncSettings(newSettings)
//         toast.success("Sync settings updated successfully")
//       } else {
//         toast.error("Failed to update sync settings")
//       }
//     } catch (error) {
//       toast.error("Error updating sync settings")
//       console.error("Sync settings error:", error)
//     }
//   }

//   const handleOAuthConnect = async (provider: any) => {
//     setIsConnecting(true)
//     try {
//       const response = await fetch("/api/crm/connect", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId,
//           provider: provider.id,
//           connectionType: "oauth",
//         }),
//       })

//       const data = await response.json()

//       if (response.ok && data.oauthUrl) {
//         window.location.href = data.oauthUrl
//       } else {
//         toast.error(data.error || "Failed to initiate OAuth connection")
//       }
//     } catch (error) {
//       toast.error("Failed to connect CRM")
//       console.error("OAuth connection error:", error)
//     } finally {
//       setIsConnecting(false)
//     }
//   }

//   const handleApiKeyConnect = async () => {
//     if (!newConnection.provider || !newConnection.name || !newConnection.apiKey) {
//       toast.error("Please fill in all required fields")
//       return
//     }

//     const selectedProvider = providers.find((p) => p.id === newConnection.provider)
//     if (selectedProvider?.requiresSecret && !newConnection.apiSecret) {
//       toast.error("API Secret is required for this provider")
//       return
//     }
//     if (selectedProvider?.requiresBaseUrl && !newConnection.baseUrl) {
//       toast.error("Base URL is required for this provider")
//       return
//     }

//     setIsConnecting(true)
//     try {
//       const response = await fetch("/api/crm/connect", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId,
//           connectionType: "api",
//           ...newConnection,
//         }),
//       })

//       if (response.ok) {
//         toast.success("CRM connected successfully!")
//         setShowNewConnection(false)
//         setNewConnection({ provider: "", name: "", apiKey: "", apiSecret: "", baseUrl: "" })
//         fetchCurrentConfig()
//       } else {
//         const error = await response.json()
//         toast.error(error.error || "Failed to connect CRM")
//       }
//     } catch (error) {
//       toast.error("Failed to connect CRM")
//       console.error("Connection error:", error)
//     } finally {
//       setIsConnecting(false)
//     }
//   }

//   const handleTestConnection = async () => {
//     setTestConnection(true)
//     try {
//       const response = await fetch("/api/crm/test", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId }),
//       })

//       if (response.ok) {
//         toast.success("CRM connection is working!")
//       } else {
//         const error = await response.json()
//         toast.error(error.error || "CRM connection failed")
//       }
//     } catch (error) {
//       toast.error("Failed to test connection")
//     } finally {
//       setTestConnection(false)
//     }
//   }

//   const handleDisconnect = async () => {
//     if (!confirm("Are you sure you want to disconnect your CRM? This will stop all automatic syncing.")) {
//       return
//     }

//     try {
//       const response = await fetch("/api/crm/disconnect", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId }),
//       })

//       if (response.ok) {
//         toast.success("CRM disconnected successfully")
//         setCurrentConfig(null)
//       } else {
//         toast.error("Failed to disconnect CRM")
//       }
//     } catch (error) {
//       toast.error("Failed to disconnect CRM")
//     }
//   }

//   const handleManualSync = async () => {
//     if (selectedLeads.length === 0) {
//       toast.error("Please select leads to sync")
//       return
//     }

//     setIsManualSyncing(true)
//     try {
//       const result = await manualSyncToCRM(selectedLeads, userId)

//       if (result.success && result.summary) {
//         toast.success(`Successfully synced ${result.summary.successful} leads to CRM`)
//         if (result.summary.failed > 0) {
//           toast.warning(`${result.summary.failed} leads failed to sync`)
//         }
//         setSelectedLeads([])
//       } else {
//         toast.error(result.error || "Failed to sync leads")
//       }
//     } catch (error) {
//       toast.error("An error occurred during sync")
//       console.error("Manual sync error:", error)
//     } finally {
//       setIsManualSyncing(false)
//     }
//   }

//   const handleBatchSync = async () => {
//     setIsBatchSyncing(true)
//     try {
//       const filters = {
//         status: syncFilters.status || undefined,
//         minScore: syncFilters.minScore ? Number.parseInt(syncFilters.minScore) : undefined,
//         leadTier: syncFilters.leadTier || undefined,
//       }

//       const result = await batchSyncToCRM(userId, filters)

//       if (result.success && result.summary) {
//         toast.success(`Batch sync completed: ${result.summary.successful} leads synced`)
//         if (result.summary.failed > 0) {
//           toast.warning(`${result.summary.failed} leads failed to sync`)
//         }
//       } else {
//         toast.error(result.error || "Batch sync failed")
//       }
//     } catch (error) {
//       toast.error("An error occurred during batch sync")
//       console.error("Batch sync error:", error)
//     } finally {
//       setIsBatchSyncing(false)
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <Loader2 className="h-8 w-8 animate-spin" />
//         <span className="ml-2">Loading CRM configuration...</span>
//       </div>
//     )
//   }

//   const crmStats = analytics?.crmStatus?.integrations || []
//   const hasActiveCRM = currentConfig?.isActive || false

//   return (
//     <div className="space-y-6">
//       {/* CRM Connection Status */}
//       {hasActiveCRM ? (
//         <Card className="border-green-200 bg-green-50/50 dark:bg-green-900/10">
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-3">
//                 <div className="w-12 h-12 flex items-center justify-center">
//                   <img
//                     src={providers.find((p) => p.id === currentConfig.provider)?.logo || "/placeholder.svg"}
//                     alt="Provider Logo"
//                     className="w-12 h-12 object-contain"
//                   />
//                 </div>
//                 <div>
//                   <CardTitle className="flex items-center gap-2">
//                     {providers.find((p) => p.id === currentConfig.provider)?.name}
//                     <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
//                       <CheckCircle className="h-3 w-3 mr-1" />
//                       Connected
//                     </Badge>
//                   </CardTitle>
//                   <CardDescription>
//                     {currentConfig.name} - Connected on {new Date(currentConfig.createdAt).toLocaleDateString()}
//                   </CardDescription>
//                 </div>
//               </div>
//               <div className="flex space-x-2">
//                 <Button variant="outline" size="sm" onClick={handleTestConnection} disabled={testConnection}>
//                   {testConnection ? (
//                     <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                   ) : (
//                     <Settings className="h-4 w-4 mr-2" />
//                   )}
//                   Test Connection
//                 </Button>
//                 <Button variant="destructive" size="sm" onClick={handleDisconnect}>
//                   <Trash2 className="h-4 w-4 mr-2" />
//                   Disconnect
//                 </Button>
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-2 gap-4 text-sm">
//               <div>
//                 <Label className="text-muted-foreground">Provider</Label>
//                 <p className="font-medium">{currentConfig.provider}</p>
//               </div>
//               <div>
//                 <Label className="text-muted-foreground">Status</Label>
//                 <p className="font-medium text-green-600">Active & Syncing</p>
//               </div>
//               <div>
//                 <Label className="text-muted-foreground">Last Sync</Label>
//                 <p className="font-medium">
//                   {currentConfig.lastSynced ? new Date(currentConfig.lastSynced).toLocaleString() : "Never"}
//                 </p>
//               </div>
//               <div>
//                 <Label className="text-muted-foreground">Base URL</Label>
//                 <p className="font-medium">{currentConfig.baseUrl || "Default"}</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="space-y-6">
//           {!showNewConnection ? (
//             <>
//               <div className="text-center py-8">
//                 <ExternalLink className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
//                 <h3 className="text-lg font-semibold mb-2">Connect Your CRM</h3>
//                 <p className="text-muted-foreground mb-6">
//                   Automatically sync your qualified leads to your favorite CRM platform
//                 </p>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {providers.map((provider) => (
//                   <Card key={provider.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
//                     <CardHeader>
//                       <div className="flex items-center space-x-3">
//                         <div className="w-12 h-12 flex items-center justify-center">
//                           <img
//                             src={provider.logo || "/placeholder.svg"}
//                             alt={`${provider.name} logo`}
//                             className="w-12 h-12 object-contain"
//                           />
//                         </div>
//                         <div>
//                           <CardTitle className="text-lg flex items-center gap-2">
//                             {provider.name}
//                             {provider.supportsOAuth && (
//                               <Badge variant="outline" className="text-xs">
//                                 <Shield className="h-3 w-3 mr-1" />
//                                 OAuth
//                               </Badge>
//                             )}
//                           </CardTitle>
//                           <CardDescription className="text-sm">{provider.description}</CardDescription>
//                         </div>
//                       </div>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-3">
//                         <div>
//                           <Label className="text-sm font-medium">Features:</Label>
//                           <div className="flex flex-wrap gap-1 mt-1">
//                             {provider.features.map((feature) => (
//                               <Badge key={feature} variant="outline" className="text-xs">
//                                 {feature}
//                               </Badge>
//                             ))}
//                           </div>
//                         </div>
//                         <div className="flex gap-2">
//                           {provider.supportsOAuth && (
//                             <Button
//                               className="flex-1"
//                               onClick={() => handleOAuthConnect(provider)}
//                               disabled={isConnecting}
//                             >
//                               {isConnecting ? (
//                                 <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                               ) : (
//                                 <Shield className="h-4 w-4 mr-2" />
//                               )}
//                               OAuth Connect
//                             </Button>
//                           )}
//                           <Button
//                             variant="outline"
//                             className="flex-1 bg-transparent"
//                             onClick={() => {
//                               setNewConnection({ ...newConnection, provider: provider.id })
//                               setShowNewConnection(true)
//                             }}
//                           >
//                             <ExternalLink className="h-4 w-4 mr-2" />
//                             API Key
//                           </Button>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </>
//           ) : (
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <div className="text-2xl">
//                     <img
//                       src={providers.find((p) => p.id === newConnection.provider)?.logo || "/placeholder.svg"}
//                       alt="Provider Logo"
//                       className="w-8 h-8 object-contain"
//                     />
//                   </div>
//                   Connect {providers.find((p) => p.id === newConnection.provider)?.name}
//                 </CardTitle>
//                 <CardDescription>
//                   Enter your {providers.find((p) => p.id === newConnection.provider)?.name} API credentials to connect
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="name">Connection Name</Label>
//                   <Input
//                     id="name"
//                     placeholder="e.g., Main CRM Account"
//                     value={newConnection.name}
//                     onChange={(e) => setNewConnection({ ...newConnection, name: e.target.value })}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="apiKey">API Key *</Label>
//                   <Input
//                     id="apiKey"
//                     type="password"
//                     placeholder="Enter your API key"
//                     value={newConnection.apiKey}
//                     onChange={(e) => setNewConnection({ ...newConnection, apiKey: e.target.value })}
//                   />
//                 </div>

//                 {providers.find((p) => p.id === newConnection.provider)?.requiresSecret && (
//                   <div className="space-y-2">
//                     <Label htmlFor="apiSecret">API Secret *</Label>
//                     <Input
//                       id="apiSecret"
//                       type="password"
//                       placeholder="Enter your API secret"
//                       value={newConnection.apiSecret}
//                       onChange={(e) => setNewConnection({ ...newConnection, apiSecret: e.target.value })}
//                     />
//                   </div>
//                 )}

//                 {providers.find((p) => p.id === newConnection.provider)?.requiresBaseUrl && (
//                   <div className="space-y-2">
//                     <Label htmlFor="baseUrl">Base URL *</Label>
//                     <Input
//                       id="baseUrl"
//                       placeholder="e.g., https://your-instance.salesforce.com"
//                       value={newConnection.baseUrl}
//                       onChange={(e) => setNewConnection({ ...newConnection, baseUrl: e.target.value })}
//                     />
//                   </div>
//                 )}

//                 <div className="flex space-x-2">
//                   <Button onClick={handleApiKeyConnect} disabled={isConnecting} className="flex-1">
//                     {isConnecting ? (
//                       <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                     ) : (
//                       <CheckCircle className="h-4 w-4 mr-2" />
//                     )}
//                     Connect
//                   </Button>
//                   <Button variant="outline" onClick={() => setShowNewConnection(false)}>
//                     Cancel
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </div>
//       )}

//       {/* Sync Settings - Only show if CRM is connected */}
//       {hasActiveCRM && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Sync Settings</CardTitle>
//             <CardDescription>Configure how leads are synchronized with your CRM</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <Label className="text-sm font-medium">Auto-sync qualified leads</Label>
//                 <p className="text-xs text-muted-foreground">
//                   Automatically sync leads when they reach &ldquo;Qualified&rdquo; status
//                 </p>
//               </div>
//               <Switch
//                 checked={syncSettings.autoSyncQualified}
//                 onCheckedChange={(checked) => updateSyncSettings({ ...syncSettings, autoSyncQualified: checked })}
//               />
//             </div>
//             <Separator />
//             <div className="flex items-center justify-between">
//               <div>
//                 <Label className="text-sm font-medium">Create deals for high-value leads</Label>
//                 <p className="text-xs text-muted-foreground">
//                   Create deals/opportunities for Platinum and Gold tier leads
//                 </p>
//               </div>
//               <Switch
//                 checked={syncSettings.createDealsHighValue}
//                 onCheckedChange={(checked) => updateSyncSettings({ ...syncSettings, createDealsHighValue: checked })}
//               />
//             </div>
//             <Separator />
//             <div className="flex items-center justify-between">
//               <div>
//                 <Label className="text-sm font-medium">Sync lead scores</Label>
//                 <p className="text-xs text-muted-foreground">Include AI-generated lead scores in CRM records</p>
//               </div>
//               <Switch
//                 checked={syncSettings.syncLeadScores}
//                 onCheckedChange={(checked) => updateSyncSettings({ ...syncSettings, syncLeadScores: checked })}
//               />
//             </div>
//             <Separator />
//             <div className="flex items-center justify-between">
//               <div>
//                 <Label className="text-sm font-medium">Real-time sync</Label>
//                 <p className="text-xs text-muted-foreground">Sync leads immediately when qualified</p>
//               </div>
//               <Switch
//                 checked={syncSettings.realTimeSync}
//                 onCheckedChange={(checked) => updateSyncSettings({ ...syncSettings, realTimeSync: checked })}
//               />
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Manual Sync Controls - Only show if CRM is connected */}
//       {hasActiveCRM && (
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <RefreshCw className="h-5 w-5 text-primary" />
//               Manual Sync Controls
//             </CardTitle>
//             <CardDescription>Manually sync leads to your CRM with advanced filtering options</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             {/* CRM Status Overview */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="p-4 bg-green-50 border border-green-200 rounded-xl dark:bg-green-900/20 dark:border-green-800">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-green-500/10 rounded-lg">
//                     <CheckCircle className="h-5 w-5 text-green-600" />
//                   </div>
//                   <div>
//                     <span className="text-sm font-medium text-green-700 dark:text-green-300">Connected CRMs</span>
//                     <div className="text-2xl font-bold text-green-600 mt-1">1</div>
//                   </div>
//                 </div>
//               </div>

//               <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl dark:bg-blue-900/20 dark:border-blue-800">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-blue-500/10 rounded-lg">
//                     <Activity className="h-5 w-5 text-blue-600" />
//                   </div>
//                   <div>
//                     <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Active Syncs</span>
//                     <div className="text-2xl font-bold text-blue-600 mt-1">1</div>
//                   </div>
//                 </div>
//               </div>

//               <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl dark:bg-purple-900/20 dark:border-purple-800">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-purple-500/10 rounded-lg">
//                     <Clock className="h-5 w-5 text-purple-600" />
//                   </div>
//                   <div>
//                     <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Last Sync</span>
//                     <div className="text-sm font-bold text-purple-600 mt-1">
//                       {currentConfig?.lastSynced
//                         ? formatDistanceToNow(new Date(currentConfig.lastSynced)) + " ago"
//                         : "Never"}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <Separator />

//             {/* Manual Sync Section */}
//             <div className="space-y-4">
//               <div className="flex items-center gap-2">
//                 <div className="p-1 bg-blue-500/10 rounded">
//                   <RefreshCw className="h-4 w-4 text-blue-600" />
//                 </div>
//                 <h4 className="font-semibold text-blue-700 dark:text-blue-300">Manual Sync</h4>
//               </div>

//               <div className="flex items-center gap-2">
//                 <Button
//                   onClick={handleManualSync}
//                   disabled={isManualSyncing || selectedLeads.length === 0}
//                   className="flex-1"
//                 >
//                   {isManualSyncing ? (
//                     <RefreshCw className="h-4 w-4 animate-spin mr-2" />
//                   ) : (
//                     <RefreshCw className="h-4 w-4 mr-2" />
//                   )}
//                   Sync Selected ({selectedLeads.length})
//                 </Button>

//                 <Button variant="outline" onClick={() => setSelectedLeads([])} disabled={selectedLeads.length === 0}>
//                   Clear Selection
//                 </Button>
//               </div>
//             </div>

//             <Separator />

//             {/* Batch Sync Section */}
//             <div className="space-y-4">
//               <div className="flex items-center gap-2">
//                 <div className="p-1 bg-purple-500/10 rounded">
//                   <Target className="h-4 w-4 text-purple-600" />
//                 </div>
//                 <h4 className="font-semibold text-purple-700 dark:text-purple-300">Batch Sync</h4>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <Label className="text-xs font-medium">Status Filter</Label>
//                   <Select
//                     value={syncFilters.status}
//                     onValueChange={(value) => setSyncFilters({ ...syncFilters, status: value })}
//                   >
//                     <SelectTrigger className="mt-1">
//                       <SelectValue placeholder="All Status" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">All Status</SelectItem>
//                       <SelectItem value="QUALIFIED">Qualified</SelectItem>
//                       <SelectItem value="NEW">New</SelectItem>
//                       <SelectItem value="QUALIFYING">Qualifying</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div>
//                   <Label className="text-xs font-medium">Min Score</Label>
//                   <Input
//                     type="number"
//                     placeholder="Min score"
//                     value={syncFilters.minScore}
//                     onChange={(e) => setSyncFilters({ ...syncFilters, minScore: e.target.value })}
//                     className="mt-1"
//                   />
//                 </div>

//                 <div>
//                   <Label className="text-xs font-medium">Lead Tier</Label>
//                   <Select
//                     value={syncFilters.leadTier}
//                     onValueChange={(value) => setSyncFilters({ ...syncFilters, leadTier: value })}
//                   >
//                     <SelectTrigger className="mt-1">
//                       <SelectValue placeholder="All Tiers" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">All Tiers</SelectItem>
//                       <SelectItem value="PLATINUM">Platinum</SelectItem>
//                       <SelectItem value="GOLD">Gold</SelectItem>
//                       <SelectItem value="SILVER">Silver</SelectItem>
//                       <SelectItem value="BRONZE">Bronze</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               <Button onClick={handleBatchSync} disabled={isBatchSyncing} className="w-full">
//                 {isBatchSyncing ? (
//                   <RefreshCw className="h-4 w-4 animate-spin mr-2" />
//                 ) : (
//                   <Target className="h-4 w-4 mr-2" />
//                 )}
//                 Batch Sync with Filters
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   )
// }

// function LeadTierDistribution({ analytics }: { analytics: any }) {
//   if (!analytics?.tierDistribution) return null

//   const { platinum, gold, silver, bronze } = analytics.tierDistribution
//   const total = platinum + gold + silver + bronze

//   if (total === 0) return null

//   const tiers = [
//     {
//       name: "Platinum",
//       value: platinum,
//       color: "bg-purple-500",
//       icon: Crown,
//       revenue: analytics.premiumInsights?.totalPipelineValue * 0.4,
//     },
//     {
//       name: "Gold",
//       value: gold,
//       color: "bg-yellow-500",
//       icon: Award,
//       revenue: analytics.premiumInsights?.totalPipelineValue * 0.3,
//     },
//     {
//       name: "Silver",
//       value: silver,
//       color: "bg-gray-400",
//       icon: Star,
//       revenue: analytics.premiumInsights?.totalPipelineValue * 0.2,
//     },
//     {
//       name: "Bronze",
//       value: bronze,
//       color: "bg-orange-500",
//       icon: Users,
//       revenue: analytics.premiumInsights?.totalPipelineValue * 0.1,
//     },
//   ]

//   return (
//     <Card className="hover:shadow-lg transition-all duration-200">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <PieChart className="h-5 w-5 text-primary" />
//           Lead Tier Distribution
//         </CardTitle>
//         <CardDescription>AI-powered lead classification by revenue potential</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {tiers.map((tier) => {
//             const percentage = total > 0 ? (tier.value / total) * 100 : 0
//             const IconComponent = tier.icon
//             return (
//               <div key={tier.name} className="space-y-2">
//                 <div className="flex items-center justify-between text-sm">
//                   <div className="flex items-center gap-2">
//                     <IconComponent className="h-4 w-4" />
//                     <span className="font-medium">{tier.name}</span>
//                   </div>
//                   <div className="text-right">
//                     <span className="font-medium">
//                       {tier.value} ({Math.round(percentage)}%)
//                     </span>
//                     <div className="text-xs text-muted-foreground">{getRevenueDisplay(tier.revenue || 0)} est.</div>
//                   </div>
//                 </div>
//                 <Progress value={percentage} className="h-2" />
//               </div>
//             )
//           })}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// function RevenueInsightsCard({ analytics }: { analytics: any }) {
//   const insights = analytics?.premiumInsights

//   if (!insights) return null

//   const insightCards = [
//     {
//       icon: Crown,
//       label: "High-Value Leads",
//       value: insights.highValueLeads,
//       color: "bg-purple-50 border-purple-200 dark:bg-purple-900/10 dark:border-purple-800",
//       iconColor: "text-purple-600 dark:text-purple-400",
//       valueColor: "text-purple-600 dark:text-purple-400",
//     },
//     {
//       icon: DollarSign,
//       label: "Avg Lead Value",
//       value: getRevenueDisplay(insights.averageLeadValue),
//       color: "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800",
//       iconColor: "text-green-600 dark:text-green-400",
//       valueColor: "text-green-600 dark:text-green-400",
//     },
//     {
//       icon: Target,
//       label: "Conversion Probability",
//       value: `${insights.conversionProbability}%`,
//       color: "bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800",
//       iconColor: "text-blue-600 dark:text-blue-400",
//       valueColor: "text-blue-600 dark:text-blue-400",
//     },
//   ]

//   return (
//     <Card className="hover:shadow-lg transition-all duration-200">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Sparkles className="h-5 w-5 text-primary" />
//           Revenue Insights
//         </CardTitle>
//         <CardDescription>AI-powered revenue intelligence</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {insightCards.map((card, index) => {
//             const IconComponent = card.icon
//             return (
//               <div
//                 key={index}
//                 className={`flex items-center justify-between p-4 rounded-lg border ${card.color} hover:shadow-md transition-all duration-200`}
//               >
//                 <div className="flex items-center gap-3">
//                   <IconComponent className={`h-5 w-5 ${card.iconColor}`} />
//                   <span className="text-sm font-medium">{card.label}</span>
//                 </div>
//                 <span className={`text-lg font-bold ${card.valueColor}`}>{card.value}</span>
//               </div>
//             )
//           })}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// function EnhancedLeadsTable({
//   leads,
//   onExport,
//   onBulkAction,
//   selectedLeads,
//   onLeadSelection,
// }: {
//   leads: any[]
//   onExport: (format: string, selectedIds: string[]) => void
//   onBulkAction: (action: string, selectedIds: string[]) => void
//   selectedLeads: string[]
//   onLeadSelection: (leadIds: string[]) => void
// }) {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [tierFilter, setTierFilter] = useState("all")
//   const [selectedLead, setSelectedLead] = useState<any>(null)
//   const [isModalOpen, setIsModalOpen] = useState(false)

//   const filteredLeads = useMemo(() => {
//     return leads.filter((lead) => {
//       const displayName = lead.name || `@${lead.instagramUserId?.slice(-4) || "Unknown"}`
//       const matchesSearch =
//         !searchTerm ||
//         displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         lead.instagramUserId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         lead.email?.toLowerCase().includes(searchTerm.toLowerCase())

//       const matchesStatus = statusFilter === "all" || lead.status === statusFilter
//       const matchesTier = tierFilter === "all" || lead.metadata?.lastAnalysis?.leadTier === tierFilter

//       return matchesSearch && matchesStatus && matchesTier
//     })
//   }, [leads, searchTerm, statusFilter, tierFilter])

//   const handleSelectAll = () => {
//     if (selectedLeads.length === filteredLeads.length) {
//       onLeadSelection([])
//     } else {
//       onLeadSelection(filteredLeads.map((lead) => lead.id))
//     }
//   }

//   const handleSelectLead = (leadId: string) => {
//     const newSelection = selectedLeads.includes(leadId)
//       ? selectedLeads.filter((id) => id !== leadId)
//       : [...selectedLeads, leadId]
//     onLeadSelection(newSelection)
//   }

//   const handleViewDetails = (lead: any) => {
//     setSelectedLead(lead)
//     setIsModalOpen(true)
//   }

//   return (
//     <>
//       <Card className="hover:shadow-lg transition-all duration-200">
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle className="flex items-center gap-2">
//                 <Clock className="h-5 w-5 text-primary" />
//                 Premium Lead Pipeline
//               </CardTitle>
//               <CardDescription>
//                 AI-qualified leads with revenue intelligence ({filteredLeads.length} leads)
//               </CardDescription>
//             </div>
//             <div className="flex items-center gap-2">
//               {selectedLeads.length > 0 && (
//                 <>
//                   <Select onValueChange={(action) => onBulkAction(action, selectedLeads)}>
//                     <SelectTrigger className="w-32">
//                       <Settings className="h-4 w-4 mr-2" />
//                       Actions
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="sync-crm">Sync to CRM</SelectItem>
//                       <SelectItem value="send-email">Send Email</SelectItem>
//                       <SelectItem value="update-status">Update Status</SelectItem>
//                       <SelectItem value="add-tags">Add Tags</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <Select onValueChange={(format) => onExport(format, selectedLeads)}>
//                     <SelectTrigger className="w-32">
//                       <Download className="h-4 w-4 mr-2" />
//                       Export
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="csv">CSV</SelectItem>
//                       <SelectItem value="excel">Excel</SelectItem>
//                       <SelectItem value="json">JSON</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </>
//               )}
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {/* Filters */}
//           <div className="flex flex-col sm:flex-row gap-4 mb-6">
//             <div className="flex-1">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search leads by name, email, or Instagram..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10"
//                 />
//               </div>
//             </div>
//             <Select value={statusFilter} onValueChange={setStatusFilter}>
//               <SelectTrigger className="w-40">
//                 <Filter className="h-4 w-4 mr-2" />
//                 <SelectValue placeholder="Status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Status</SelectItem>
//                 <SelectItem value="NEW">New</SelectItem>
//                 <SelectItem value="QUALIFYING">Qualifying</SelectItem>
//                 <SelectItem value="QUALIFIED">Qualified</SelectItem>
//                 <SelectItem value="CONVERTED">Converted</SelectItem>
//                 <SelectItem value="LOST">Lost</SelectItem>
//               </SelectContent>
//             </Select>
//             <Select value={tierFilter} onValueChange={setTierFilter}>
//               <SelectTrigger className="w-40">
//                 <Star className="h-4 w-4 mr-2" />
//                 <SelectValue placeholder="Tier" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Tiers</SelectItem>
//                 <SelectItem value="PLATINUM">Platinum</SelectItem>
//                 <SelectItem value="GOLD">Gold</SelectItem>
//                 <SelectItem value="SILVER">Silver</SelectItem>
//                 <SelectItem value="BRONZE">Bronze</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Select All */}
//           <div className="flex items-center space-x-2 mb-4">
//             <Checkbox
//               checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
//               onCheckedChange={handleSelectAll}
//             />
//             <span className="text-sm text-muted-foreground">Select All ({selectedLeads.length} selected)</span>
//           </div>

//           <Separator className="mb-4" />

//           {/* Leads List */}
//           <ScrollArea className="h-96">
//             <div className="space-y-4">
//               {filteredLeads.length === 0 ? (
//                 <div className="text-center py-12 text-muted-foreground">
//                   <Brain className="h-16 w-16 mx-auto mb-4 opacity-50" />
//                   <p className="text-lg font-medium">No leads found</p>
//                   <p className="text-sm">
//                     Try adjusting your filters or start engaging with customers to generate AI-qualified leads!
//                   </p>
//                 </div>
//               ) : (
//                 filteredLeads.map((lead) => {
//                   const lastAnalysis = lead.metadata?.lastAnalysis
//                   const isSelected = selectedLeads.includes(lead.id)
//                   const scoreProgress = getScoreProgress(lead.score)
//                   const marketingCompleteness = lead.metadata?.marketingCompleteness || 0
//                   const displayName = lead.name || `@${lead.instagramUserId?.slice(-4) || "Unknown"}`

//                   return (
//                     <div
//                       key={lead.id}
//                       className={`p-6 border rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer space-y-4 ${
//                         isSelected ? "border-primary bg-primary/5 shadow-sm" : "hover:bg-muted/30"
//                       }`}
//                       onClick={() => handleSelectLead(lead.id)}
//                     >
//                       {/* Header Row */}
//                       <div className="flex items-start justify-between">
//                         <div className="flex items-center space-x-4">
//                           <Checkbox
//                             checked={isSelected}
//                             onChange={() => handleSelectLead(lead.id)}
//                             onClick={(e) => e.stopPropagation()}
//                           />
//                           <Avatar className="h-14 w-14">
//                             <AvatarFallback className="bg-primary/20 text-primary font-semibold text-lg">
//                               {displayName.charAt(0).toUpperCase()}
//                             </AvatarFallback>
//                           </Avatar>
//                           <div className="space-y-1">
//                             <div className="flex items-center gap-3">
//                               <h3 className="text-lg font-semibold">{displayName}</h3>
//                               {getTierBadge(lead.metadata)}
//                               <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
//                             </div>
//                             <p className="text-sm text-muted-foreground">@{lead.instagramUserId}</p>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-3">
//                           <div className="text-right">
//                             <div className={`text-2xl font-bold ${getScoreColor(lead.score)}`}>{lead.score}</div>
//                             <p className="text-xs text-muted-foreground">Lead Score</p>
//                           </div>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={(e) => {
//                               e.stopPropagation()
//                               handleViewDetails(lead)
//                             }}
//                             className="h-10 w-10"
//                           >
//                             <Eye className="h-5 w-5" />
//                           </Button>
//                         </div>
//                       </div>

//                       {/* Contact Information Row */}
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div className="space-y-2">
//                           <Label className="text-xs font-medium text-muted-foreground">CONTACT INFO</Label>
//                           <div className="space-y-1">
//                             {lead.email && (
//                               <div className="flex items-center gap-2 text-sm">
//                                 <Mail className="h-3 w-3 text-muted-foreground" />
//                                 <span className="truncate">{lead.email}</span>
//                               </div>
//                             )}
//                             {lead.phone && (
//                               <div className="flex items-center gap-2 text-sm">
//                                 <Phone className="h-3 w-3 text-muted-foreground" />
//                                 <span>{lead.phone}</span>
//                               </div>
//                             )}
//                             {!lead.email && !lead.phone && (
//                               <p className="text-xs text-muted-foreground">No contact info</p>
//                             )}
//                           </div>
//                         </div>

//                         <div className="space-y-2">
//                           <Label className="text-xs font-medium text-muted-foreground">REVENUE POTENTIAL</Label>
//                           <div className="space-y-1">
//                             {lastAnalysis?.estimatedValue ? (
//                               <div className="text-lg font-bold text-green-600">
//                                 {getRevenueDisplay(lastAnalysis.estimatedValue)}
//                               </div>
//                             ) : (
//                               <div className="text-sm text-muted-foreground">Not calculated</div>
//                             )}
//                             {lastAnalysis?.roi && (
//                               <div className="text-xs text-blue-600 font-medium">ROI: {lastAnalysis.roi}%</div>
//                             )}
//                           </div>
//                         </div>

//                         <div className="space-y-2">
//                           <Label className="text-xs font-medium text-muted-foreground">PROFILE STATUS</Label>
//                           <div className="space-y-2">
//                             <div className="flex items-center justify-between">
//                               <span className="text-xs">Completeness</span>
//                               <span
//                                 className={`text-xs font-bold ${getMarketingCompletenessColor(marketingCompleteness)}`}
//                               >
//                                 {marketingCompleteness}%
//                               </span>
//                             </div>
//                             <Progress value={marketingCompleteness} className="h-1.5" />
//                           </div>
//                         </div>
//                       </div>

//                       {/* Score Progress Row */}
//                       <div className="space-y-2">
//                         <div className="flex items-center justify-between">
//                           <Label className="text-xs font-medium text-muted-foreground">LEAD SCORE BREAKDOWN</Label>
//                           <span className={`text-sm font-bold ${getScoreColor(lead.score)}`}>{lead.score}/100</span>
//                         </div>
//                         <div className="w-full bg-gray-200 rounded-full h-2">
//                           <div
//                             className={`${scoreProgress.color} h-2 rounded-full transition-all duration-300`}
//                             style={{ width: `${scoreProgress.width}%` }}
//                           ></div>
//                         </div>
//                         <p className="text-xs text-muted-foreground">
//                           {lead.score >= 85
//                             ? "🎯 Excellent - High conversion probability"
//                             : lead.score >= 70
//                               ? "✅ Good - Strong potential"
//                               : lead.score >= 50
//                                 ? "⚠️ Fair - Needs nurturing"
//                                 : "🔄 Low - Requires attention"}
//                         </p>
//                       </div>

//                       {/* Recent Activity & Actions Row */}
//                       <div className="flex items-center justify-between pt-2 border-t">
//                         <div className="space-y-1">
//                           <Label className="text-xs font-medium text-muted-foreground">LAST ACTIVITY</Label>
//                           {lead.interactions && lead.interactions.length > 0 ? (
//                             <p className="text-sm truncate max-w-md">{lead.interactions[0].content}</p>
//                           ) : (
//                             <p className="text-sm text-muted-foreground">No recent activity</p>
//                           )}
//                           <p className="text-xs text-muted-foreground">
//                             {formatDistanceToNow(new Date(lead.lastContactDate))} ago
//                           </p>
//                         </div>

//                         <div className="flex items-center gap-2">
//                           {lastAnalysis?.nextActions && lastAnalysis.nextActions.length > 0 && (
//                             <div className="flex gap-1">
//                               {lastAnalysis.nextActions.slice(0, 2).map((action: string, index: number) => (
//                                 <Badge key={index} variant="outline" className="text-xs">
//                                   <Timer className="w-2 h-2 mr-1" />
//                                   {action.replace(/_/g, " ")}
//                                 </Badge>
//                               ))}
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       {/* AI Insights Row */}
//                       {lastAnalysis?.notificationMessage && (
//                         <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-3 dark:bg-blue-900/10 dark:border-blue-800">
//                           <div className="flex items-start gap-2">
//                             <Brain className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
//                             <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
//                               {lastAnalysis.notificationMessage}
//                             </p>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   )
//                 })
//               )}
//             </div>
//           </ScrollArea>
//         </CardContent>
//       </Card>

//       {/* Lead Details Modal */}
//       <LeadDetailsModal lead={selectedLead} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
//     </>
//   )
// }

// function TopRevenueLeadsCard({ leads }: { leads: any[] }) {
//   return (
//     <Card className="hover:shadow-lg transition-all duration-200">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Crown className="h-5 w-5 text-primary" />
//           Top Revenue Opportunities
//         </CardTitle>
//         <CardDescription>Highest value leads ranked by AI revenue prediction</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ScrollArea className="h-80">
//           <div className="space-y-4">
//             {leads.length === 0 ? (
//               <div className="text-center py-8 text-muted-foreground">
//                 <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                 <p className="text-sm">No high-value leads yet</p>
//                 <p className="text-xs">Focus on engagement to generate premium opportunities</p>
//               </div>
//             ) : (
//               leads.map((lead, index) => {
//                 const lastAnalysis = lead.metadata?.lastAnalysis
//                 const marketingCompleteness = lead.metadata?.marketingCompleteness || 0
//                 const displayName = lead.name || `@${lead.instagramUserId?.slice(-4) || "Unknown"}`
//                 return (
//                   <div
//                     key={lead.id}
//                     className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-all duration-200 group"
//                   >
//                     <div className="flex items-center space-x-3">
//                       <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
//                         {index + 1}
//                       </div>
//                       <div>
//                         <div className="flex items-center gap-2">
//                           <p className="text-sm font-medium">{displayName}</p>
//                           {getTierBadge(lead.metadata)}
//                         </div>
//                         <div className="flex items-center gap-2 mt-1">
//                           <Badge className={getStatusColor(lead.status)} variant="secondary">
//                             {lead.status}
//                           </Badge>
//                           {lastAnalysis?.followUpStrategy && (
//                             <Badge variant="outline" className="text-xs">
//                               {lastAnalysis.followUpStrategy.replace(/_/g, " ")}
//                             </Badge>
//                           )}
//                         </div>
//                         {(lead.name || lead.email || lead.phone) && <MarketingInfoDisplay lead={lead} compact />}
//                         {lastAnalysis?.buyerPersona && (
//                           <p className="text-xs text-muted-foreground mt-1">
//                             Persona: {lastAnalysis.buyerPersona.replace(/_/g, " ")}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <div className={`text-lg font-bold ${getScoreColor(lead.score)}`}>
//                         {lastAnalysis?.estimatedValue
//                           ? getRevenueDisplay(lastAnalysis.estimatedValue)
//                           : `${lead.score}pts`}
//                       </div>
//                       {lastAnalysis?.roi && (
//                         <div className="text-xs text-blue-600 font-medium">ROI: {lastAnalysis.roi}%</div>
//                       )}
//                       <div className={`text-xs ${getMarketingCompletenessColor(marketingCompleteness)}`}>
//                         Profile: {marketingCompleteness}%
//                       </div>
//                       {lead.qualificationData && (
//                         <div className="text-xs text-muted-foreground">
//                           Intent: {lead.qualificationData.intentScore} | Sentiment:{" "}
//                           {lead.qualificationData.sentimentScore}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )
//               })
//             )}
//           </div>
//         </ScrollArea>
//       </CardContent>
//     </Card>
//   )
// }

// function RecentAIAnalysisCard({ interactions }: { interactions: any[] }) {
//   return (
//     <Card className="hover:shadow-lg transition-all duration-200">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Brain className="h-5 w-5 text-primary" />
//           AI Revenue Analysis
//         </CardTitle>
//         <CardDescription>Latest customer interactions with revenue intelligence</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ScrollArea className="h-80">
//           <div className="space-y-3">
//             {interactions.length === 0 ? (
//               <div className="text-center py-8 text-muted-foreground">
//                 <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                 <p className="text-sm">No recent AI analysis</p>
//                 <p className="text-xs">Interactions will appear here as they&apos;re analyzed</p>
//               </div>
//             ) : (
//               interactions.slice(0, 10).map((interaction) => {
//                 const metadata = interaction.metadata
//                 const marketingCompleteness = metadata?.marketingCompleteness || 0
//                 const displayName =
//                   interaction.lead.name || `@${interaction.lead.instagramUserId?.slice(-4) || "Unknown"}`
//                 return (
//                   <div
//                     key={interaction.id}
//                     className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-all duration-200"
//                   >
//                     <Avatar className="h-8 w-8">
//                       <AvatarFallback className="text-xs bg-primary/20 text-primary">
//                         {displayName.charAt(0).toUpperCase()}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2 text-sm">
//                         <span className="font-medium">{displayName}</span>
//                         <Badge className={getStatusColor(interaction.lead.status)} variant="outline">
//                           {interaction.lead.status}
//                         </Badge>
//                         {metadata?.leadTier && (
//                           <Badge variant="secondary" className="text-xs">
//                             {metadata.leadTier}
//                           </Badge>
//                         )}
//                         {metadata?.hasMarketingInfo && (
//                           <Badge
//                             variant="outline"
//                             className={`text-xs ${getMarketingCompletenessColor(marketingCompleteness)}`}
//                           >
//                             {marketingCompleteness}% Profile
//                           </Badge>
//                         )}
//                       </div>
//                       <p className="text-sm text-muted-foreground mt-1 truncate">{interaction.content}</p>
//                       <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
//                         <span className="capitalize">{interaction.type}</span>
//                         <span>•</span>
//                         <span>{formatDistanceToNow(new Date(interaction.timestamp))} ago</span>
//                         {metadata?.estimatedValue && (
//                           <>
//                             <span>•</span>
//                             <span className="text-green-600 font-medium">
//                               {getRevenueDisplay(metadata.estimatedValue)}
//                             </span>
//                           </>
//                         )}
//                         {interaction.sentiment && (
//                           <>
//                             <span>•</span>
//                             <span className={interaction.sentiment > 0 ? "text-green-600" : "text-red-600"}>
//                               {interaction.sentiment > 0 ? "Positive" : "Negative"}
//                             </span>
//                           </>
//                         )}
//                       </div>
//                       {metadata?.notificationMessage && (
//                         <p className="text-xs text-blue-600 mt-1 font-medium flex items-center gap-1">
//                           <Sparkles className="w-3 h-3" />
//                           {metadata.notificationMessage}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 )
//               })
//             )}
//           </div>
//         </ScrollArea>
//       </CardContent>
//     </Card>
//   )
// }

// export function PremiumLeadsDashboard({
//   analytics,
//   recentLeads,
//   topLeads,
//   hasDuplicates,
//   duplicateCount,
//   userId,
//   onMergeDuplicates,
//   interactions,
// }: PremiumLeadsDashboardProps) {
//   const [selectedLeads, setSelectedLeads] = useState<string[]>([])

//   const handleMerge = () => (onMergeDuplicates ? onMergeDuplicates(userId) : handleMergeDuplicates(userId))

//   const handleExport = (format: string, selectedIds: string[]) => {
//     toast.success(`Exporting ${selectedIds.length} leads as ${format.toUpperCase()}`)
//   }

//   const handleBulkAction = (action: string, selectedIds: string[]) => {
//     toast.success(`Performing ${action} on ${selectedIds.length} leads`)
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between space-y-2">
//         <div>
//           <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
//             <div className="p-2 bg-primary/10 rounded-lg">
//               <Crown className="h-8 w-8 text-primary" />
//             </div>
//             <div>
//               <span>Premium AI Revenue Intelligence</span>
//               <div className="flex items-center gap-2 mt-1">
//                 <Badge variant="secondary" className="text-xs">
//                   <Zap className="h-3 w-3 mr-1" />
//                   AI-Powered
//                 </Badge>
//                 <Badge variant="outline" className="text-xs">
//                   <Activity className="h-3 w-3 mr-1" />
//                   Real-time Analytics
//                 </Badge>
//                 <Badge variant="outline" className="text-xs">
//                   <User className="h-3 w-3 mr-1" />
//                   Contact Capture
//                 </Badge>
//               </div>
//             </div>
//           </h2>
//           <p className="text-muted-foreground mt-2">
//             Advanced AI-powered lead qualification with revenue prediction and contact information capture
//           </p>
//         </div>
//         <div className="flex items-center space-x-2">
//           <Button variant="outline">
//             <LineChart className="mr-2 h-4 w-4" />
//             Revenue Report
//           </Button>
//           <Button variant="outline">
//             <Calendar className="mr-2 h-4 w-4" />
//             Schedule Export
//           </Button>
//           <Button>
//             <Plus className="mr-2 h-4 w-4" />
//             Add Lead
//           </Button>
//         </div>
//       </div>

//       {/* Duplicate Alert */}
//       <DuplicateAlert hasDuplicates={hasDuplicates} duplicateCount={duplicateCount} onMergeDuplicates={handleMerge} />

//       {/* Analytics Cards */}
//       <PremiumAnalyticsCards analytics={analytics} />

//       {/* Main Content */}
//       <Tabs defaultValue="overview" className="space-y-6">
//         <TabsList className="grid w-full grid-cols-5">
//           <TabsTrigger value="overview" className="flex items-center gap-2">
//             <BarChart3 className="h-4 w-4" />
//             Overview
//           </TabsTrigger>
//           <TabsTrigger value="leads" className="flex items-center gap-2">
//             <Users className="h-4 w-4" />
//             Lead Pipeline
//           </TabsTrigger>
//           <TabsTrigger value="analysis" className="flex items-center gap-2">
//             <Brain className="h-4 w-4" />
//             AI Analysis
//           </TabsTrigger>
//           <TabsTrigger value="insights" className="flex items-center gap-2">
//             <Sparkles className="h-4 w-4" />
//             Revenue Insights
//           </TabsTrigger>
//           <TabsTrigger value="integrations" className="flex items-center gap-2">
//             <ExternalLink className="h-4 w-4" />
//             Integrations
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="overview" className="space-y-6">
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
//             <div className="col-span-4">
//               <EnhancedLeadsTable
//                 leads={recentLeads}
//                 onExport={handleExport}
//                 onBulkAction={handleBulkAction}
//                 selectedLeads={selectedLeads}
//                 onLeadSelection={setSelectedLeads}
//               />
//             </div>
//             <div className="col-span-3 space-y-6">
//               <TopRevenueLeadsCard leads={topLeads} />
//               <LeadTierDistribution analytics={analytics} />
//             </div>
//           </div>
//         </TabsContent>

//         <TabsContent value="leads" className="space-y-6">
//           <EnhancedLeadsTable
//             leads={recentLeads}
//             onExport={handleExport}
//             onBulkAction={handleBulkAction}
//             selectedLeads={selectedLeads}
//             onLeadSelection={setSelectedLeads}
//           />
//         </TabsContent>

//         <TabsContent value="analysis" className="space-y-6">
//           <div className="grid gap-6 md:grid-cols-2">
//             <RecentAIAnalysisCard interactions={interactions || []} />
//             <LeadTierDistribution analytics={analytics} />
//           </div>
//         </TabsContent>

//         <TabsContent value="insights" className="space-y-6">
//           <div className="grid gap-6 md:grid-cols-2">
//             <RevenueInsightsCard analytics={analytics} />
//             <TopRevenueLeadsCard leads={topLeads} />
//           </div>
//         </TabsContent>

//         <TabsContent value="integrations" className="space-y-6">
//           <UnifiedCRMIntegration userId={userId} analytics={analytics} />
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }



"use client"

import React, { useState, useTransition, useMemo, useEffect } from "react"
import { handleMergeDuplicates } from "@/actions/leads"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Users,
  TrendingUp,
  MessageSquare,
  Target,
  Calendar,
  BarChart3,
  Clock,
  Star,
  Plus,
  AlertTriangle,
  Merge,
  RefreshCw,
  Brain,
  DollarSign,
  Crown,
  Award,
  ArrowUpRight,
  Sparkles,
  Timer,
  PieChart,
  LineChart,
  Download,
  Search,
  Filter,
  Settings,
  Mail,
  Phone,
  Eye,
  ExternalLink,
  Zap,
  TrendingDown,
  Activity,
  Shield,
  CheckCircle,
  Loader2,
  Trash2,
  User,
  Instagram,
  Copy,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { manualSyncToCRM, batchSyncToCRM } from "@/lib/lead-qualification"
import { LeadActionsModal } from "./leads-actions-modal"

interface PremiumLeadsDashboardProps {
  analytics: any
  recentLeads: any[]
  topLeads: any[]
  hasDuplicates: boolean
  duplicateCount: number
  userId: string
  onMergeDuplicates?: (userId: string) => Promise<{ success: boolean; mergedGroups?: number; error?: string }>
  interactions: any[]
}

// Enhanced utility functions
function getStatusColor(status: string) {
  const colors = {
    NEW: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    QUALIFYING:
      "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
    QUALIFIED:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    CONVERTED:
      "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
    LOST: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  }
  return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
}

function getScoreColor(score: number) {
  if (score >= 85) return "text-purple-600 font-bold dark:text-purple-400"
  if (score >= 70) return "text-green-600 font-bold dark:text-green-400"
  if (score >= 50) return "text-yellow-600 font-semibold dark:text-yellow-400"
  if (score >= 30) return "text-orange-600 dark:text-orange-400"
  return "text-red-600 dark:text-red-400"
}

function getScoreProgress(score: number) {
  if (score >= 85) return { color: "bg-purple-500", width: (score / 100) * 100 }
  if (score >= 70) return { color: "bg-green-500", width: (score / 100) * 100 }
  if (score >= 50) return { color: "bg-yellow-500", width: (score / 100) * 100 }
  if (score >= 30) return { color: "bg-orange-500", width: (score / 100) * 100 }
  return { color: "bg-red-500", width: (score / 100) * 100 }
}

function getMarketingCompletenessColor(completeness: number) {
  if (completeness >= 80) return "text-green-600 font-bold"
  if (completeness >= 60) return "text-blue-600 font-semibold"
  if (completeness >= 40) return "text-yellow-600 font-semibold"
  if (completeness >= 20) return "text-orange-600"
  return "text-red-600"
}

function getTierBadge(metadata: any) {
  // Safe access to metadata
  if (!metadata || !metadata.lastAnalysis) return null

  const lastAnalysis = metadata.lastAnalysis
  const tier = lastAnalysis?.leadTier

  if (!tier) return null

  const tierConfig = {
    PLATINUM: {
      icon: Crown,
      color: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/20 dark:text-purple-400",
      label: "Platinum",
    },
    GOLD: {
      icon: Award,
      color: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400",
      label: "Gold",
    },
    SILVER: {
      icon: Star,
      color: "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900/20 dark:text-gray-400",
      label: "Silver",
    },
    BRONZE: {
      icon: Users,
      color: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/20 dark:text-orange-400",
      label: "Bronze",
    },
  }

  const config = tierConfig[tier as keyof typeof tierConfig]
  if (!config) return null

  const IconComponent = config.icon

  return (
    <Badge className={`${config.color} ml-2 px-2 py-1`}>
      <IconComponent className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  )
}

function getRevenueDisplay(value: number) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`
  return `$${value.toFixed(0)}`
}

function copyToClipboard(text: string, label: string) {
  navigator.clipboard.writeText(text)
  toast.success(`${label} copied to clipboard`)
}

// Enhanced Lead Details Modal Component
function LeadDetailsModal({ lead, isOpen, onClose }: { lead: any; isOpen: boolean; onClose: () => void }) {
  const [actionModalOpen, setActionModalOpen] = useState(false)
  const [currentAction, setCurrentAction] = useState<
    "email" | "call" | "note" | "status" | "campaign" | "followup" | null
  >(null)

  if (!lead) return null

  // Safe access to metadata
  const lastAnalysis = lead.metadata?.lastAnalysis || null
  const marketingCompleteness = lead.metadata?.marketingCompleteness || 0
  const displayName = lead.name || `@${lead.instagramUserId?.slice(-4) || "Unknown"}`

  // Update the action handlers:
  const handleViewInCRM = (lead: any) => {
    if (lead.crmId) {
      window.open(`https://your-crm.com/contacts/${lead.crmId}`, "_blank")
    } else {
      toast.info("Lead not synced to CRM yet. Would you like to sync now?")
    }
  }

  const handleSendEmail = (lead: any) => {
    setCurrentAction("email")
    setActionModalOpen(true)
  }

  const handleCallLead = (lead: any) => {
    if (lead.phone) {
      window.location.href = `tel:${lead.phone}`
    } else {
      toast.error("No phone number available for this lead")
    }
  }

  const handleAddNote = (lead: any) => {
    setCurrentAction("note")
    setActionModalOpen(true)
  }

  const handleUpdateStatus = (lead: any) => {
    setCurrentAction("status")
    setActionModalOpen(true)
  }

  const handleScheduleFollowup = (lead: any) => {
    setCurrentAction("followup")
    setActionModalOpen(true)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/20 text-primary font-bold text-lg">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-2xl flex items-center gap-3">
                {displayName}
                {getTierBadge(lead.metadata)}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-4 mt-2">
                <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                <span className="text-sm text-muted-foreground">
                  Score: {lead.score}/100 • Last contact: {formatDistanceToNow(new Date(lead.lastContactDate))} ago
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col max-h-[70vh]">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Contact Information
                  </h3>

                  <div className="space-y-3">
                    {lead.name && (
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{lead.name}</p>
                            <p className="text-xs text-muted-foreground">Full Name</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(lead.name, "Name")}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {lead.email && (
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{lead.email}</p>
                            <p className="text-xs text-muted-foreground">Email Address</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(lead.email, "Email")}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {lead.phone && (
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{lead.phone}</p>
                            <p className="text-xs text-muted-foreground">Phone Number</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(lead.phone, "Phone")}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Instagram className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">@{lead.instagramUserId}</p>
                          <p className="text-xs text-muted-foreground">Instagram Handle</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(lead.instagramUserId, "Instagram")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Profile Completeness */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">Profile Completeness</span>
                      <span className="text-sm font-bold text-primary">{marketingCompleteness}%</span>
                    </div>
                    <Progress value={marketingCompleteness} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      {marketingCompleteness >= 80
                        ? "Complete profile - ready for CRM sync"
                        : marketingCompleteness >= 50
                          ? "Good progress - collect remaining details"
                          : "Incomplete profile - gather more contact information"}
                    </p>
                  </div>
                </div>

                {/* AI Analysis & Revenue */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    AI Analysis & Revenue
                  </h3>

                  {lastAnalysis && (
                    <div className="space-y-3">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Lead Score</span>
                          <span className="text-lg font-bold text-primary">{lead.score}/100</span>
                        </div>
                        <Progress value={lead.score} className="h-2 mb-2" />
                        <p className="text-xs text-muted-foreground">
                          {lead.score >= 85
                            ? "Excellent - High conversion probability"
                            : lead.score >= 70
                              ? "Good - Strong potential"
                              : lead.score >= 50
                                ? "Fair - Needs nurturing"
                                : "Low - Requires attention"}
                        </p>
                      </div>

                      {lastAnalysis.estimatedValue > 0 && (
                        <div className="p-4 border rounded-lg bg-green-50/50 dark:bg-green-900/10">
                          <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium">Revenue Potential</span>
                          </div>
                          <p className="text-2xl font-bold text-green-600">
                            {getRevenueDisplay(lastAnalysis.estimatedValue)}
                          </p>
                          {lastAnalysis.roi > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">Expected ROI: {lastAnalysis.roi}%</p>
                          )}
                        </div>
                      )}

                      {lastAnalysis.buyerPersona && (
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium">Buyer Persona</span>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {lastAnalysis.buyerPersona.replace(/_/g, " ")}
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Recent Interactions */}
              {lead.interactions && lead.interactions.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Recent Interactions ({lead.interactions.length})
                  </h3>

                  <div className="space-y-3">
                    {lead.interactions.slice(0, 5).map((interaction: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="capitalize">
                              {interaction.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(interaction.timestamp))} ago
                            </span>
                          </div>
                          {interaction.sentiment && (
                            <Badge variant={interaction.sentiment > 0 ? "default" : "destructive"}>
                              {interaction.sentiment > 0 ? "Positive" : "Negative"}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{interaction.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Actions */}
              {lastAnalysis?.nextActions && lastAnalysis.nextActions.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Recommended Actions
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {lastAnalysis.nextActions.map((action: string, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm capitalize">{action.replace(/_/g, " ")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Notification */}
              {lastAnalysis?.notificationMessage && (
                <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-lg dark:bg-blue-900/10 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800 dark:text-blue-400">AI Insight</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        {lastAnalysis.notificationMessage}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Update the modal footer with more actions: */}
        <div className="flex justify-between items-center pt-4 border-t bg-background">
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => handleViewInCRM(lead)}>
              <ExternalLink className="h-4 w-4 mr-2" />
              View in CRM
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleSendEmail(lead)}>
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleCallLead(lead)}>
              <Phone className="h-4 w-4 mr-2" />
              Call Lead
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleAddNote(lead)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleUpdateStatus(lead)}>
              Update Status
            </Button>
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>

        {/* Add the LeadActionsModal at the end of the LeadDetailsModal component: */}
        <LeadActionsModal
          lead={lead}
          isOpen={actionModalOpen}
          onClose={() => setActionModalOpen(false)}
          actionType={currentAction}
        />
      </DialogContent>
    </Dialog>
  )
}

// Marketing Information Display Component
function MarketingInfoDisplay({ lead, compact = false }: { lead: any; compact?: boolean }) {
  if (!lead) return null

  const completeness = lead.metadata?.marketingCompleteness || 0
  const hasName = !!lead.name
  const hasEmail = !!lead.email
  const hasPhone = !!lead.phone

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <div className={`flex items-center gap-1 ${getMarketingCompletenessColor(completeness)}`}>
          <User className="h-3 w-3" />
          <span>{completeness}% complete</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Contact Information</span>
        <Badge variant="outline" className={getMarketingCompletenessColor(completeness)}>
          {completeness}% Complete
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        {hasName && (
          <div className="flex items-center gap-1">
            <User className="h-3 w-3 text-muted-foreground" />
            <span>{lead.name}</span>
          </div>
        )}
        {hasEmail && (
          <div className="flex items-center gap-1">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <span>{lead.email}</span>
          </div>
        )}
        {hasPhone && (
          <div className="flex items-center gap-1">
            <Phone className="h-3 w-3 text-muted-foreground" />
            <span>{lead.phone}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// Enhanced components
function DuplicateAlert({
  hasDuplicates,
  duplicateCount,
  onMergeDuplicates,
}: {
  hasDuplicates: boolean
  duplicateCount: number
  onMergeDuplicates: () => Promise<{ success: boolean; mergedGroups?: number; error?: string }>
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  if (!hasDuplicates) return null

  const handleMerge = () => {
    startTransition(async () => {
      try {
        const result = await onMergeDuplicates()
        if (result.success) {
          toast.success(`Successfully merged ${result.mergedGroups} duplicate groups`)
          router.refresh()
        } else {
          toast.error(result.error || "Failed to merge duplicates")
        }
      } catch (error) {
        toast.error("An error occurred while merging duplicates")
      }
    })
  }

  return (
    <Alert className="border-orange-200 bg-orange-50/50 dark:bg-orange-900/10">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertTitle className="text-orange-800 dark:text-orange-400">Duplicate Leads Detected</AlertTitle>
      <AlertDescription className="text-orange-700 dark:text-orange-300">
        Found {duplicateCount} groups of duplicate leads. Merge them to improve your revenue analytics and data quality.
        <Button
          variant="outline"
          size="sm"
          className="ml-2 border-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/20 bg-transparent"
          onClick={handleMerge}
          disabled={isPending}
        >
          {isPending ? <RefreshCw className="mr-2 h-3 w-3 animate-spin" /> : <Merge className="mr-2 h-3 w-3" />}
          {isPending ? "Merging..." : "Merge Duplicates"}
        </Button>
      </AlertDescription>
    </Alert>
  )
}

function PremiumAnalyticsCards({ analytics }: { analytics: any }) {
  if (!analytics) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: "Total Leads",
      value: analytics.totalLeads,
      subtitle: "AI-powered lead generation",
      icon: Users,
      color: "border-l-blue-500",
      trend: null,
    },
    {
      title: "Qualified Leads",
      value: analytics.qualifiedLeads,
      subtitle: `${analytics.conversionRate}% conversion rate`,
      icon: Target,
      color: "border-l-green-500",
      trend: analytics.conversionRate >= 15 ? "up" : analytics.conversionRate >= 10 ? "stable" : "down",
    },
    {
      title: "Revenue Pipeline",
      value: getRevenueDisplay(analytics.revenueMetrics?.totalEstimatedRevenue || 0),
      subtitle: "Estimated total value",
      icon: DollarSign,
      color: "border-l-purple-500",
      trend: null,
    },
    {
      title: "Expected Revenue",
      value: getRevenueDisplay(analytics.revenueMetrics?.totalExpectedRevenue || 0),
      subtitle: `${Math.abs(analytics.revenueMetrics?.revenueGrowth || 0)}% vs last week`,
      icon: TrendingUp,
      color: "border-l-yellow-500",
      trend: analytics.revenueMetrics?.revenueGrowth >= 0 ? "up" : "down",
    },
    {
      title: "Avg ROI",
      value: `${analytics.revenueMetrics?.averageROI || 0}%`,
      subtitle: "Return on investment",
      icon: BarChart3,
      color: "border-l-orange-500",
      trend:
        analytics.revenueMetrics?.averageROI >= 200
          ? "up"
          : analytics.revenueMetrics?.averageROI >= 100
            ? "stable"
            : "down",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {cards.map((card, index) => {
        const IconComponent = card.icon
        const trendIcon = card.trend === "up" ? ArrowUpRight : card.trend === "down" ? TrendingDown : Activity
        const trendColor =
          card.trend === "up" ? "text-green-500" : card.trend === "down" ? "text-red-500" : "text-blue-500"

        return (
          <Card key={index} className={`${card.color} border-l-4 hover:shadow-lg transition-all duration-200 group`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                {card.title}
              </CardTitle>
              <IconComponent className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{card.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {card.trend && React.createElement(trendIcon, { className: `h-3 w-3 mr-1 ${trendColor}` })}
                <span>{card.subtitle}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

// UNIFIED CRM Integration Component - Professional Implementation
function UnifiedCRMIntegration({ userId, analytics }: { userId: string; analytics: any }) {
  const [currentConfig, setCurrentConfig] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isConnecting, setIsConnecting] = useState(false)
  const [testConnection, setTestConnection] = useState(false)
  const [showNewConnection, setShowNewConnection] = useState(false)
  const [newConnection, setNewConnection] = useState({
    provider: "",
    name: "",
    apiKey: "",
    apiSecret: "",
    baseUrl: "",
  })

  // Sync Settings State
  const [syncSettings, setSyncSettings] = useState({
    autoSyncQualified: true,
    createDealsHighValue: true,
    syncLeadScores: true,
    realTimeSync: true,
  })

  // Manual Sync State
  const [isManualSyncing, setIsManualSyncing] = useState(false)
  const [isBatchSyncing, setIsBatchSyncing] = useState(false)
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [syncFilters, setSyncFilters] = useState({
    status: "",
    minScore: "",
    leadTier: "",
  })

  const providers = [
    {
      id: "HUBSPOT",
      name: "HubSpot",
      description: "Connect with HubSpot CRM for contacts and deals",
      logo: "/hubspot.png",
      features: ["Contacts", "Deals", "Companies", "Custom Properties"],
      supportsOAuth: true,
      requiresSecret: false,
      requiresBaseUrl: false,
      oauthScopes: ["crm.objects.contacts.write", "crm.objects.deals.write"],
    },
    {
      id: "SALESFORCE",
      name: "Salesforce",
      description: "Integrate with Salesforce for lead management",
      logo: "/salesforce.png",
      features: ["Leads", "Opportunities", "Accounts", "Custom Fields"],
      supportsOAuth: true,
      requiresSecret: true,
      requiresBaseUrl: true,
      oauthScopes: ["api", "refresh_token"],
    },
    {
      id: "PIPEDRIVE",
      name: "Pipedrive",
      description: "Sync leads with Pipedrive pipeline",
      logo: "/pipedrive.png",
      features: ["Persons", "Deals", "Organizations", "Activities"],
      supportsOAuth: true,
      requiresSecret: false,
      requiresBaseUrl: true,
      oauthScopes: ["base"],
    },
    {
      id: "ZOHO",
      name: "Zoho CRM",
      description: "Connect with Zoho CRM for comprehensive lead management",
      logo: "/zoho.png",
      features: ["Leads", "Contacts", "Deals", "Custom Modules"],
      supportsOAuth: false,
      requiresSecret: true,
      requiresBaseUrl: true,
      oauthScopes: [],
    },
  ]

  useEffect(() => {
    fetchCurrentConfig()
    fetchSyncSettings()
  }, [userId])

  const fetchCurrentConfig = async () => {
    try {
      const response = await fetch(`/api/crm/config?userId=${userId}`)
      if (response.ok) {
        const config = await response.json()
        setCurrentConfig(config)
      }
    } catch (error) {
      console.error("Error fetching CRM config:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSyncSettings = async () => {
    try {
      const response = await fetch(`/api/crm/sync-settings?userId=${userId}`)
      if (response.ok) {
        const settings = await response.json()
        setSyncSettings(settings)
      }
    } catch (error) {
      console.error("Error fetching sync settings:", error)
    }
  }

  const updateSyncSettings = async (newSettings: any) => {
    try {
      const response = await fetch("/api/crm/sync-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          settings: newSettings,
        }),
      })

      if (response.ok) {
        setSyncSettings(newSettings)
        toast.success("Sync settings updated successfully")
      } else {
        toast.error("Failed to update sync settings")
      }
    } catch (error) {
      toast.error("Error updating sync settings")
      console.error("Sync settings error:", error)
    }
  }

  const handleOAuthConnect = async (provider: any) => {
    setIsConnecting(true)
    try {
      const response = await fetch("/api/crm/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          provider: provider.id,
          connectionType: "oauth",
        }),
      })

      const data = await response.json()

      if (response.ok && data.oauthUrl) {
        window.location.href = data.oauthUrl
      } else {
        toast.error(data.error || "Failed to initiate OAuth connection")
      }
    } catch (error) {
      toast.error("Failed to connect CRM")
      console.error("OAuth connection error:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleApiKeyConnect = async () => {
    if (!newConnection.provider || !newConnection.name || !newConnection.apiKey) {
      toast.error("Please fill in all required fields")
      return
    }

    const selectedProvider = providers.find((p) => p.id === newConnection.provider)
    if (selectedProvider?.requiresSecret && !newConnection.apiSecret) {
      toast.error("API Secret is required for this provider")
      return
    }
    if (selectedProvider?.requiresBaseUrl && !newConnection.baseUrl) {
      toast.error("Base URL is required for this provider")
      return
    }

    setIsConnecting(true)
    try {
      const response = await fetch("/api/crm/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          connectionType: "api",
          ...newConnection,
        }),
      })

      if (response.ok) {
        toast.success("CRM connected successfully!")
        setShowNewConnection(false)
        setNewConnection({ provider: "", name: "", apiKey: "", apiSecret: "", baseUrl: "" })
        fetchCurrentConfig()
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to connect CRM")
      }
    } catch (error) {
      toast.error("Failed to connect CRM")
      console.error("Connection error:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleTestConnection = async () => {
    setTestConnection(true)
    try {
      const response = await fetch("/api/crm/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      if (response.ok) {
        toast.success("CRM connection is working!")
      } else {
        const error = await response.json()
        toast.error(error.error || "CRM connection failed")
      }
    } catch (error) {
      toast.error("Failed to test connection")
    } finally {
      setTestConnection(false)
    }
  }

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect your CRM? This will stop all automatic syncing.")) {
      return
    }

    try {
      const response = await fetch("/api/crm/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      if (response.ok) {
        toast.success("CRM disconnected successfully")
        setCurrentConfig(null)
      } else {
        toast.error("Failed to disconnect CRM")
      }
    } catch (error) {
      toast.error("Failed to disconnect CRM")
    }
  }

  const handleManualSync = async () => {
    if (selectedLeads.length === 0) {
      toast.error("Please select leads to sync")
      return
    }

    setIsManualSyncing(true)
    try {
      const result = await manualSyncToCRM(selectedLeads, userId)

      if (result.success && result.summary) {
        toast.success(`Successfully synced ${result.summary.successful} leads to CRM`)
        if (result.summary.failed > 0) {
          toast.warning(`${result.summary.failed} leads failed to sync`)
        }
        setSelectedLeads([])
      } else {
        toast.error(result.error || "Failed to sync leads")
      }
    } catch (error) {
      toast.error("An error occurred during sync")
      console.error("Manual sync error:", error)
    } finally {
      setIsManualSyncing(false)
    }
  }

  const handleBatchSync = async () => {
    setIsBatchSyncing(true)
    try {
      const filters = {
        status: syncFilters.status || undefined,
        minScore: syncFilters.minScore ? Number.parseInt(syncFilters.minScore) : undefined,
        leadTier: syncFilters.leadTier || undefined,
      }

      const result = await batchSyncToCRM(userId, filters)

      if (result.success && result.summary) {
        toast.success(`Batch sync completed: ${result.summary.successful} leads synced`)
        if (result.summary.failed > 0) {
          toast.warning(`${result.summary.failed} leads failed to sync`)
        }
      } else {
        toast.error(result.error || "Batch sync failed")
      }
    } catch (error) {
      toast.error("An error occurred during batch sync")
      console.error("Batch sync error:", error)
    } finally {
      setIsBatchSyncing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading CRM configuration...</span>
      </div>
    )
  }

  const crmStats = analytics?.crmStatus?.integrations || []
  const hasActiveCRM = currentConfig?.isActive || false

  return (
    <div className="space-y-6">
      {/* CRM Connection Status */}
      {hasActiveCRM ? (
        <Card className="border-green-200 bg-green-50/50 dark:bg-green-900/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 flex items-center justify-center">
                  <img
                    src={providers.find((p) => p.id === currentConfig.provider)?.logo || "/placeholder.svg"}
                    alt="Provider Logo"
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {providers.find((p) => p.id === currentConfig.provider)?.name}
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {currentConfig.name} - Connected on {new Date(currentConfig.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleTestConnection} disabled={testConnection}>
                  {testConnection ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Settings className="h-4 w-4 mr-2" />
                  )}
                  Test Connection
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDisconnect}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-muted-foreground">Provider</Label>
                <p className="font-medium">{currentConfig.provider}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <p className="font-medium text-green-600">Active & Syncing</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Last Sync</Label>
                <p className="font-medium">
                  {currentConfig.lastSynced ? new Date(currentConfig.lastSynced).toLocaleString() : "Never"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Base URL</Label>
                <p className="font-medium">{currentConfig.baseUrl || "Default"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {!showNewConnection ? (
            <>
              <div className="text-center py-8">
                <ExternalLink className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Connect Your CRM</h3>
                <p className="text-muted-foreground mb-6">
                  Automatically sync your qualified leads to your favorite CRM platform
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {providers.map((provider) => (
                  <Card key={provider.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 flex items-center justify-center">
                          <img
                            src={provider.logo || "/placeholder.svg"}
                            alt={`${provider.name} logo`}
                            className="w-12 h-12 object-contain"
                          />
                        </div>
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {provider.name}
                            {provider.supportsOAuth && (
                              <Badge variant="outline" className="text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                OAuth
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="text-sm">{provider.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">Features:</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {provider.features.map((feature) => (
                              <Badge key={feature} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {provider.supportsOAuth && (
                            <Button
                              className="flex-1"
                              onClick={() => handleOAuthConnect(provider)}
                              disabled={isConnecting}
                            >
                              {isConnecting ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : (
                                <Shield className="h-4 w-4 mr-2" />
                              )}
                              OAuth Connect
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            className="flex-1 bg-transparent"
                            onClick={() => {
                              setNewConnection({ ...newConnection, provider: provider.id })
                              setShowNewConnection(true)
                            }}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            API Key
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="text-2xl">
                    <img
                      src={providers.find((p) => p.id === newConnection.provider)?.logo || "/placeholder.svg"}
                      alt="Provider Logo"
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  Connect {providers.find((p) => p.id === newConnection.provider)?.name}
                </CardTitle>
                <CardDescription>
                  Enter your {providers.find((p) => p.id === newConnection.provider)?.name} API credentials to connect
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Connection Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Main CRM Account"
                    value={newConnection.name}
                    onChange={(e) => setNewConnection({ ...newConnection, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key *</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Enter your API key"
                    value={newConnection.apiKey}
                    onChange={(e) => setNewConnection({ ...newConnection, apiKey: e.target.value })}
                  />
                </div>

                {providers.find((p) => p.id === newConnection.provider)?.requiresSecret && (
                  <div className="space-y-2">
                    <Label htmlFor="apiSecret">API Secret *</Label>
                    <Input
                      id="apiSecret"
                      type="password"
                      placeholder="Enter your API secret"
                      value={newConnection.apiSecret}
                      onChange={(e) => setNewConnection({ ...newConnection, apiSecret: e.target.value })}
                    />
                  </div>
                )}

                {providers.find((p) => p.id === newConnection.provider)?.requiresBaseUrl && (
                  <div className="space-y-2">
                    <Label htmlFor="baseUrl">Base URL *</Label>
                    <Input
                      id="baseUrl"
                      placeholder="e.g., https://your-instance.salesforce.com"
                      value={newConnection.baseUrl}
                      onChange={(e) => setNewConnection({ ...newConnection, baseUrl: e.target.value })}
                    />
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button onClick={handleApiKeyConnect} disabled={isConnecting} className="flex-1">
                    {isConnecting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Connect
                  </Button>
                  <Button variant="outline" onClick={() => setShowNewConnection(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Sync Settings - Only show if CRM is connected */}
      {hasActiveCRM && (
        <Card>
          <CardHeader>
            <CardTitle>Sync Settings</CardTitle>
            <CardDescription>Configure how leads are synchronized with your CRM</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Auto-sync qualified leads</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically sync leads when they reach &ldquo;Qualified&rdquo; status
                </p>
              </div>
              <Switch
                checked={syncSettings.autoSyncQualified}
                onCheckedChange={(checked) => updateSyncSettings({ ...syncSettings, autoSyncQualified: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Create deals for high-value leads</Label>
                <p className="text-xs text-muted-foreground">
                  Create deals/opportunities for Platinum and Gold tier leads
                </p>
              </div>
              <Switch
                checked={syncSettings.createDealsHighValue}
                onCheckedChange={(checked) => updateSyncSettings({ ...syncSettings, createDealsHighValue: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Sync lead scores</Label>
                <p className="text-xs text-muted-foreground">Include AI-generated lead scores in CRM records</p>
              </div>
              <Switch
                checked={syncSettings.syncLeadScores}
                onCheckedChange={(checked) => updateSyncSettings({ ...syncSettings, syncLeadScores: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Real-time sync</Label>
                <p className="text-xs text-muted-foreground">Sync leads immediately when qualified</p>
              </div>
              <Switch
                checked={syncSettings.realTimeSync}
                onCheckedChange={(checked) => updateSyncSettings({ ...syncSettings, realTimeSync: checked })}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Manual Sync Controls - Only show if CRM is connected */}
      {hasActiveCRM && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              Manual Sync Controls
            </CardTitle>
            <CardDescription>Manually sync leads to your CRM with advanced filtering options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* CRM Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl dark:bg-green-900/20 dark:border-green-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">Connected CRMs</span>
                    <div className="text-2xl font-bold text-green-600 mt-1">1</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl dark:bg-blue-900/20 dark:border-blue-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Activity className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Active Syncs</span>
                    <div className="text-2xl font-bold text-blue-600 mt-1">1</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl dark:bg-purple-900/20 dark:border-purple-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Last Sync</span>
                    <div className="text-sm font-bold text-purple-600 mt-1">
                      {currentConfig?.lastSynced
                        ? formatDistanceToNow(new Date(currentConfig.lastSynced)) + " ago"
                        : "Never"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Manual Sync Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-blue-500/10 rounded">
                  <RefreshCw className="h-4 w-4 text-blue-600" />
                </div>
                <h4 className="font-semibold text-blue-700 dark:text-blue-300">Manual Sync</h4>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={handleManualSync}
                  disabled={isManualSyncing || selectedLeads.length === 0}
                  className="flex-1"
                >
                  {isManualSyncing ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Sync Selected ({selectedLeads.length})
                </Button>

                <Button variant="outline" onClick={() => setSelectedLeads([])} disabled={selectedLeads.length === 0}>
                  Clear Selection
                </Button>
              </div>
            </div>

            <Separator />

            {/* Batch Sync Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-purple-500/10 rounded">
                  <Target className="h-4 w-4 text-purple-600" />
                </div>
                <h4 className="font-semibold text-purple-700 dark:text-purple-300">Batch Sync</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs font-medium">Status Filter</Label>
                  <Select
                    value={syncFilters.status}
                    onValueChange={(value) => setSyncFilters({ ...syncFilters, status: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="QUALIFIED">Qualified</SelectItem>
                      <SelectItem value="NEW">New</SelectItem>
                      <SelectItem value="QUALIFYING">Qualifying</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs font-medium">Min Score</Label>
                  <Input
                    type="number"
                    placeholder="Min score"
                    value={syncFilters.minScore}
                    onChange={(e) => setSyncFilters({ ...syncFilters, minScore: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-xs font-medium">Lead Tier</Label>
                  <Select
                    value={syncFilters.leadTier}
                    onValueChange={(value) => setSyncFilters({ ...syncFilters, leadTier: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="All Tiers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tiers</SelectItem>
                      <SelectItem value="PLATINUM">Platinum</SelectItem>
                      <SelectItem value="GOLD">Gold</SelectItem>
                      <SelectItem value="SILVER">Silver</SelectItem>
                      <SelectItem value="BRONZE">Bronze</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleBatchSync} disabled={isBatchSyncing} className="w-full">
                {isBatchSyncing ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Target className="h-4 w-4 mr-2" />
                )}
                Batch Sync with Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function LeadTierDistribution({ analytics }: { analytics: any }) {
  if (!analytics?.tierDistribution) return null

  const { platinum, gold, silver, bronze } = analytics.tierDistribution
  const total = platinum + gold + silver + bronze

  if (total === 0) return null

  const tiers = [
    {
      name: "Platinum",
      value: platinum,
      color: "bg-purple-500",
      icon: Crown,
      revenue: analytics.premiumInsights?.totalPipelineValue * 0.4,
    },
    {
      name: "Gold",
      value: gold,
      color: "bg-yellow-500",
      icon: Award,
      revenue: analytics.premiumInsights?.totalPipelineValue * 0.3,
    },
    {
      name: "Silver",
      value: silver,
      color: "bg-gray-400",
      icon: Star,
      revenue: analytics.premiumInsights?.totalPipelineValue * 0.2,
    },
    {
      name: "Bronze",
      value: bronze,
      color: "bg-orange-500",
      icon: Users,
      revenue: analytics.premiumInsights?.totalPipelineValue * 0.1,
    },
  ]

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5 text-primary" />
          Lead Tier Distribution
        </CardTitle>
        <CardDescription>AI-powered lead classification by revenue potential</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tiers.map((tier) => {
            const percentage = total > 0 ? (tier.value / total) * 100 : 0
            const IconComponent = tier.icon
            return (
              <div key={tier.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4" />
                    <span className="font-medium">{tier.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">
                      {tier.value} ({Math.round(percentage)}%)
                    </span>
                    <div className="text-xs text-muted-foreground">{getRevenueDisplay(tier.revenue || 0)} est.</div>
                  </div>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function RevenueInsightsCard({ analytics }: { analytics: any }) {
  const insights = analytics?.premiumInsights

  if (!insights) return null

  const insightCards = [
    {
      icon: Crown,
      label: "High-Value Leads",
      value: insights.highValueLeads,
      color: "bg-purple-50 border-purple-200 dark:bg-purple-900/10 dark:border-purple-800",
      iconColor: "text-purple-600 dark:text-purple-400",
      valueColor: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: DollarSign,
      label: "Avg Lead Value",
      value: getRevenueDisplay(insights.averageLeadValue),
      color: "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800",
      iconColor: "text-green-600 dark:text-green-400",
      valueColor: "text-green-600 dark:text-green-400",
    },
    {
      icon: Target,
      label: "Conversion Probability",
      value: `${insights.conversionProbability}%`,
      color: "bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800",
      iconColor: "text-blue-600 dark:text-blue-400",
      valueColor: "text-blue-600 dark:text-blue-400",
    },
  ]

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Revenue Insights
        </CardTitle>
        <CardDescription>AI-powered revenue intelligence</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insightCards.map((card, index) => {
            const IconComponent = card.icon
            return (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg border ${card.color} hover:shadow-md transition-all duration-200`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className={`h-5 w-5 ${card.iconColor}`} />
                  <span className="text-sm font-medium">{card.label}</span>
                </div>
                <span className={`text-lg font-bold ${card.valueColor}`}>{card.value}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function EnhancedLeadsTable({
  leads,
  onExport,
  onBulkAction,
  selectedLeads,
  onLeadSelection,
}: {
  leads: any[]
  onExport: (format: string, selectedIds: string[]) => void
  onBulkAction: (action: string, selectedIds: string[]) => void
  selectedLeads: string[]
  onLeadSelection: (leadIds: string[]) => void
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [tierFilter, setTierFilter] = useState("all")
  const [selectedLead, setSelectedLead] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const displayName = lead.name || `@${lead.instagramUserId?.slice(-4) || "Unknown"}`
      const matchesSearch =
        !searchTerm ||
        displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.instagramUserId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || lead.status === statusFilter
      const matchesTier = tierFilter === "all" || lead.metadata?.lastAnalysis?.leadTier === tierFilter

      return matchesSearch && matchesStatus && matchesTier
    })
  }, [leads, searchTerm, statusFilter, tierFilter])

  const handleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      onLeadSelection([])
    } else {
      onLeadSelection(filteredLeads.map((lead) => lead.id))
    }
  }

  const handleSelectLead = (leadId: string) => {
    const newSelection = selectedLeads.includes(leadId)
      ? selectedLeads.filter((id) => id !== leadId)
      : [...selectedLeads, leadId]
    onLeadSelection(newSelection)
  }

  const handleViewDetails = (lead: any) => {
    setSelectedLead(lead)
    setIsModalOpen(true)
  }

  return (
    <>
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Premium Lead Pipeline
              </CardTitle>
              <CardDescription>
                AI-qualified leads with revenue intelligence ({filteredLeads.length} leads)
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {selectedLeads.length > 0 && (
                <>
                  <Select onValueChange={(action) => onBulkAction(action, selectedLeads)}>
                    <SelectTrigger className="w-32">
                      <Settings className="h-4 w-4 mr-2" />
                      Actions
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sync-crm">Sync to CRM</SelectItem>
                      <SelectItem value="send-email">Send Email</SelectItem>
                      <SelectItem value="update-status">Update Status</SelectItem>
                      <SelectItem value="add-tags">Add Tags</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select onValueChange={(format) => onExport(format, selectedLeads)}>
                    <SelectTrigger className="w-32">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search leads by name, email, or Instagram..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="NEW">New</SelectItem>
                <SelectItem value="QUALIFYING">Qualifying</SelectItem>
                <SelectItem value="QUALIFIED">Qualified</SelectItem>
                <SelectItem value="CONVERTED">Converted</SelectItem>
                <SelectItem value="LOST">Lost</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-40">
                <Star className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="PLATINUM">Platinum</SelectItem>
                <SelectItem value="GOLD">Gold</SelectItem>
                <SelectItem value="SILVER">Silver</SelectItem>
                <SelectItem value="BRONZE">Bronze</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Select All */}
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm text-muted-foreground">Select All ({selectedLeads.length} selected)</span>
          </div>

          <Separator className="mb-4" />

          {/* Leads List */}
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {filteredLeads.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Brain className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No leads found</p>
                  <p className="text-sm">
                    Try adjusting your filters or start engaging with customers to generate AI-qualified leads!
                  </p>
                </div>
              ) : (
                filteredLeads.map((lead) => {
                  const lastAnalysis = lead.metadata?.lastAnalysis
                  const isSelected = selectedLeads.includes(lead.id)
                  const scoreProgress = getScoreProgress(lead.score)
                  const marketingCompleteness = lead.metadata?.marketingCompleteness || 0
                  const displayName = lead.name || `@${lead.instagramUserId?.slice(-4) || "Unknown"}`

                  return (
                    <div
                      key={lead.id}
                      className={`p-6 border rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer space-y-4 ${
                        isSelected ? "border-primary bg-primary/5 shadow-sm" : "hover:bg-muted/30"
                      }`}
                      onClick={() => handleSelectLead(lead.id)}
                    >
                      {/* Header Row */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleSelectLead(lead.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <Avatar className="h-14 w-14">
                            <AvatarFallback className="bg-primary/20 text-primary font-semibold text-lg">
                              {displayName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-semibold">{displayName}</h3>
                              {getTierBadge(lead.metadata)}
                              <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">@{lead.instagramUserId}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${getScoreColor(lead.score)}`}>{lead.score}</div>
                            <p className="text-xs text-muted-foreground">Lead Score</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewDetails(lead)
                            }}
                            className="h-10 w-10"
                          >
                            <Eye className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>

                      {/* Contact Information Row */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-muted-foreground">CONTACT INFO</Label>
                          <div className="space-y-1">
                            {lead.email && (
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                <span className="truncate">{lead.email}</span>
                              </div>
                            )}
                            {lead.phone && (
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                <span>{lead.phone}</span>
                              </div>
                            )}
                            {!lead.email && !lead.phone && (
                              <p className="text-xs text-muted-foreground">No contact info</p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-muted-foreground">REVENUE POTENTIAL</Label>
                          <div className="space-y-1">
                            {lastAnalysis?.estimatedValue ? (
                              <div className="text-lg font-bold text-green-600">
                                {getRevenueDisplay(lastAnalysis.estimatedValue)}
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground">Not calculated</div>
                            )}
                            {lastAnalysis?.roi && (
                              <div className="text-xs text-blue-600 font-medium">ROI: {lastAnalysis.roi}%</div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-muted-foreground">PROFILE STATUS</Label>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs">Completeness</span>
                              <span
                                className={`text-xs font-bold ${getMarketingCompletenessColor(marketingCompleteness)}`}
                              >
                                {marketingCompleteness}%
                              </span>
                            </div>
                            <Progress value={marketingCompleteness} className="h-1.5" />
                          </div>
                        </div>
                      </div>

                      {/* Score Progress Row */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-medium text-muted-foreground">LEAD SCORE BREAKDOWN</Label>
                          <span className={`text-sm font-bold ${getScoreColor(lead.score)}`}>{lead.score}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${scoreProgress.color} h-2 rounded-full transition-all duration-300`}
                            style={{ width: `${scoreProgress.width}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {lead.score >= 85
                            ? "🎯 Excellent - High conversion probability"
                            : lead.score >= 70
                              ? "✅ Good - Strong potential"
                              : lead.score >= 50
                                ? "⚠️ Fair - Needs nurturing"
                                : "🔄 Low - Requires attention"}
                        </p>
                      </div>

                      {/* Recent Activity & Actions Row */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="space-y-1">
                          <Label className="text-xs font-medium text-muted-foreground">LAST ACTIVITY</Label>
                          {lead.interactions && lead.interactions.length > 0 ? (
                            <p className="text-sm truncate max-w-md">{lead.interactions[0].content}</p>
                          ) : (
                            <p className="text-sm text-muted-foreground">No recent activity</p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(lead.lastContactDate))} ago
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {lastAnalysis?.nextActions && lastAnalysis.nextActions.length > 0 && (
                            <div className="flex gap-1">
                              {lastAnalysis.nextActions.slice(0, 2).map((action: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  <Timer className="w-2 h-2 mr-1" />
                                  {action.replace(/_/g, " ")}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* AI Insights Row */}
                      {lastAnalysis?.notificationMessage && (
                        <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-3 dark:bg-blue-900/10 dark:border-blue-800">
                          <div className="flex items-start gap-2">
                            <Brain className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                              {lastAnalysis.notificationMessage}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Lead Details Modal */}
      <LeadDetailsModal lead={selectedLead} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}

function TopRevenueLeadsCard({ leads }: { leads: any[] }) {
  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-primary" />
          Top Revenue Opportunities
        </CardTitle>
        <CardDescription>Highest value leads ranked by AI revenue prediction</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-4">
            {leads.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No high-value leads yet</p>
                <p className="text-xs">Focus on engagement to generate premium opportunities</p>
              </div>
            ) : (
              leads.map((lead, index) => {
                const lastAnalysis = lead.metadata?.lastAnalysis
                const marketingCompleteness = lead.metadata?.marketingCompleteness || 0
                const displayName = lead.name || `@${lead.instagramUserId?.slice(-4) || "Unknown"}`
                return (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{displayName}</p>
                          {getTierBadge(lead.metadata)}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getStatusColor(lead.status)} variant="secondary">
                            {lead.status}
                          </Badge>
                          {lastAnalysis?.followUpStrategy && (
                            <Badge variant="outline" className="text-xs">
                              {lastAnalysis.followUpStrategy.replace(/_/g, " ")}
                            </Badge>
                          )}
                        </div>
                        {(lead.name || lead.email || lead.phone) && <MarketingInfoDisplay lead={lead} compact />}
                        {lastAnalysis?.buyerPersona && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Persona: {lastAnalysis.buyerPersona.replace(/_/g, " ")}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getScoreColor(lead.score)}`}>
                        {lastAnalysis?.estimatedValue
                          ? getRevenueDisplay(lastAnalysis.estimatedValue)
                          : `${lead.score}pts`}
                      </div>
                      {lastAnalysis?.roi && (
                        <div className="text-xs text-blue-600 font-medium">ROI: {lastAnalysis.roi}%</div>
                      )}
                      <div className={`text-xs ${getMarketingCompletenessColor(marketingCompleteness)}`}>
                        Profile: {marketingCompleteness}%
                      </div>
                      {lead.qualificationData && (
                        <div className="text-xs text-muted-foreground">
                          Intent: {lead.qualificationData.intentScore} | Sentiment:{" "}
                          {lead.qualificationData.sentimentScore}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

function RecentAIAnalysisCard({ interactions }: { interactions: any[] }) {
  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Revenue Analysis
        </CardTitle>
        <CardDescription>Latest customer interactions with revenue intelligence</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-3">
            {interactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No recent AI analysis</p>
                <p className="text-xs">Interactions will appear here as they&apos;re analyzed</p>
              </div>
            ) : (
              interactions.slice(0, 10).map((interaction) => {
                const metadata = interaction.metadata || {}
                const marketingCompleteness = metadata?.marketingCompleteness || 0
                const displayName =
                  interaction.lead.name || `@${interaction.lead.instagramUserId?.slice(-4) || "Unknown"}`
                return (
                  <div
                    key={interaction.id}
                    className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-all duration-200"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-primary/20 text-primary">
                        {displayName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">{displayName}</span>
                        <Badge className={getStatusColor(interaction.lead.status)} variant="outline">
                          {interaction.lead.status}
                        </Badge>
                        {metadata?.leadTier && (
                          <Badge variant="secondary" className="text-xs">
                            {metadata.leadTier}
                          </Badge>
                        )}
                        {metadata?.hasMarketingInfo && (
                          <Badge
                            variant="outline"
                            className={`text-xs ${getMarketingCompletenessColor(marketingCompleteness)}`}
                          >
                            {marketingCompleteness}% Profile
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 truncate">{interaction.content}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span className="capitalize">{interaction.type}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(interaction.timestamp))} ago</span>
                        {metadata?.estimatedValue && (
                          <>
                            <span>•</span>
                            <span className="text-green-600 font-medium">
                              {getRevenueDisplay(metadata.estimatedValue)}
                            </span>
                          </>
                        )}
                        {interaction.sentiment && (
                          <>
                            <span>•</span>
                            <span className={interaction.sentiment > 0 ? "text-green-600" : "text-red-600"}>
                              {interaction.sentiment > 0 ? "Positive" : "Negative"}
                            </span>
                          </>
                        )}
                      </div>
                      {metadata?.notificationMessage && (
                        <p className="text-xs text-blue-600 mt-1 font-medium flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          {metadata.notificationMessage}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export function PremiumLeadsDashboard({
  analytics,
  recentLeads,
  topLeads,
  hasDuplicates,
  duplicateCount,
  userId,
  onMergeDuplicates,
  interactions,
}: PremiumLeadsDashboardProps) {
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])

  const handleMerge = () => (onMergeDuplicates ? onMergeDuplicates(userId) : handleMergeDuplicates(userId))

  const handleExport = (format: string, selectedIds: string[]) => {
    toast.success(`Exporting ${selectedIds.length} leads as ${format.toUpperCase()}`)
  }

  const handleBulkAction = (action: string, selectedIds: string[]) => {
    toast.success(`Performing ${action} on ${selectedIds.length} leads`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Crown className="h-8 w-8 text-primary" />
            </div>
            <div>
              <span>Premium AI Revenue Intelligence</span>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  AI-Powered
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Activity className="h-3 w-3 mr-1" />
                  Real-time Analytics
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <User className="h-3 w-3 mr-1" />
                  Contact Capture
                </Badge>
              </div>
            </div>
          </h2>
          <p className="text-muted-foreground mt-2">
            Advanced AI-powered lead qualification with revenue prediction and contact information capture
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <LineChart className="mr-2 h-4 w-4" />
            Revenue Report
          </Button>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Duplicate Alert */}
      <DuplicateAlert hasDuplicates={hasDuplicates} duplicateCount={duplicateCount} onMergeDuplicates={handleMerge} />

      {/* Analytics Cards */}
      <PremiumAnalyticsCards analytics={analytics} />

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="leads" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Lead Pipeline
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Analysis
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Revenue Insights
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Integrations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
              <EnhancedLeadsTable
                leads={recentLeads}
                onExport={handleExport}
                onBulkAction={handleBulkAction}
                selectedLeads={selectedLeads}
                onLeadSelection={setSelectedLeads}
              />
            </div>
            <div className="col-span-3 space-y-6">
              <TopRevenueLeadsCard leads={topLeads} />
              <LeadTierDistribution analytics={analytics} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="leads" className="space-y-6">
          <EnhancedLeadsTable
            leads={recentLeads}
            onExport={handleExport}
            onBulkAction={handleBulkAction}
            selectedLeads={selectedLeads}
            onLeadSelection={setSelectedLeads}
          />
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <RecentAIAnalysisCard interactions={interactions || []} />
            <LeadTierDistribution analytics={analytics} />
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <RevenueInsightsCard analytics={analytics} />
            <TopRevenueLeadsCard leads={topLeads} />
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <UnifiedCRMIntegration userId={userId} analytics={analytics} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
