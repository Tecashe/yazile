//WORKING JUST FINE

// "use client"

// import { handleMergeDuplicates } from "@/actions/leads"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { Progress } from "@/components/ui/progress"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import {
//   Users,
//   TrendingUp,
//   MessageSquare,
//   Target,
//   Calendar,
//   Phone,
//   Mail,
//   BarChart3,
//   Activity,
//   Clock,
//   Star,
//   Plus,
//   AlertTriangle,
//   Merge,
//   RefreshCw,
//   Zap,
//   Brain,
// } from "lucide-react"
// import { formatDistanceToNow } from "date-fns"
// import { useTransition } from "react"
// import { useRouter } from "next/navigation"

// interface LeadsDashboardProps {
//   analytics: any
//   recentLeads: any[]
//   topLeads: any[]
//   hasDuplicates: boolean
//   duplicateCount: number
//   userId: string
// }

// function getStatusColor(status: string) {
//   switch (status) {
//     case "NEW":
//       return "bg-blue-100 text-blue-800 border-blue-200"
//     case "QUALIFYING":
//       return "bg-yellow-100 text-yellow-800 border-yellow-200"
//     case "QUALIFIED":
//       return "bg-green-100 text-green-800 border-green-200"
//     case "CONVERTED":
//       return "bg-purple-100 text-purple-800 border-purple-200"
//     case "LOST":
//       return "bg-red-100 text-red-800 border-red-200"
//     default:
//       return "bg-gray-100 text-gray-800 border-gray-200"
//   }
// }

// function getScoreColor(score: number) {
//   if (score >= 70) return "text-green-600 font-bold"
//   if (score >= 50) return "text-yellow-600 font-semibold"
//   if (score >= 30) return "text-orange-600"
//   return "text-red-600"
// }

// function getPriorityBadge(metadata: any) {
//   const lastAnalysis = metadata?.lastAnalysis
//   if (lastAnalysis?.priorityLead) {
//     return (
//       <Badge variant="destructive" className="ml-2">
//         <Zap className="w-3 h-3 mr-1" />
//         Priority
//       </Badge>
//     )
//   }
//   return null
// }

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
//       const result = await onMergeDuplicates()
//       if (result.success) {
//         router.refresh()
//       }
//     })
//   }

//   return (
//     <Alert className="border-orange-200 bg-orange-50">
//       <AlertTriangle className="h-4 w-4 text-orange-600" />
//       <AlertTitle className="text-orange-800">Duplicate Leads Detected</AlertTitle>
//       <AlertDescription className="text-orange-700">
//         Found {duplicateCount} groups of duplicate leads. This can happen when the same person contacts you multiple
//         times.
//         <Button variant="outline" size="sm" className="ml-2" onClick={handleMerge} disabled={isPending}>
//           {isPending ? <RefreshCw className="mr-2 h-3 w-3 animate-spin" /> : <Merge className="mr-2 h-3 w-3" />}
//           {isPending ? "Merging..." : "Merge Duplicates"}
//         </Button>
//       </AlertDescription>
//     </Alert>
//   )
// }

// function LeadAnalyticsCards({ analytics }: { analytics: any }) {
//   if (!analytics) {
//     return (
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         {[1, 2, 3, 4].map((i) => (
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

//   return (
//     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
//           <Users className="h-4 w-4 text-muted-foreground" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold">{analytics.totalLeads}</div>
//           <p className="text-xs text-muted-foreground">All time leads generated</p>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
//           <Target className="h-4 w-4 text-muted-foreground" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold text-green-600">{analytics.qualifiedLeads}</div>
//           <p className="text-xs text-muted-foreground">{analytics.conversionRate}% conversion rate</p>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Converted</CardTitle>
//           <TrendingUp className="h-4 w-4 text-muted-foreground" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold text-purple-600">{analytics.convertedLeads}</div>
//           <p className="text-xs text-muted-foreground">{analytics.qualificationRate}% of total leads</p>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
//           <Activity className="h-4 w-4 text-muted-foreground" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold">{analytics.recentInteractions?.length || 0}</div>
//           <p className="text-xs text-muted-foreground">Interactions today</p>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// function RecentLeadsTable({ leads }: { leads: any[] }) {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Clock className="h-5 w-5" />
//           Recent Leads
//         </CardTitle>
//         <CardDescription>Latest leads and their AI qualification status</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {leads.length === 0 ? (
//             <div className="text-center py-8 text-muted-foreground">
//               <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
//               <p>No leads found yet.</p>
//               <p className="text-sm">Start engaging with customers to generate AI-qualified leads!</p>
//             </div>
//           ) : (
//             leads.map((lead) => {
//               const lastAnalysis = lead.metadata?.lastAnalysis
//               return (
//                 <div
//                   key={lead.id}
//                   className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   <div className="flex items-center space-x-4">
//                     <Avatar>
//                       <AvatarFallback>
//                         {lead.name ? lead.name.charAt(0).toUpperCase() : lead.instagramUserId.charAt(0).toUpperCase()}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div>
//                       <div className="flex items-center">
//                         <p className="text-sm font-medium">
//                           {lead.name || `Instagram User ${lead.instagramUserId.slice(-4)}`}
//                         </p>
//                         {getPriorityBadge(lead.metadata)}
//                       </div>
//                       <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                         <span>Score: {lead.score}</span>
//                         <span>•</span>
//                         <span>{formatDistanceToNow(new Date(lead.lastContactDate))} ago</span>
//                         {lead.email && <Mail className="h-3 w-3 ml-2" />}
//                         {lead.phone && <Phone className="h-3 w-3 ml-1" />}
//                       </div>
//                       {lead.interactions.length > 0 && (
//                         <p className="text-xs text-muted-foreground mt-1 max-w-md truncate">
//                           Last: {lead.interactions[0].content}
//                         </p>
//                       )}
//                       {lastAnalysis?.notificationMessage && (
//                         <p className="text-xs text-blue-600 mt-1 font-medium">
//                           <Brain className="w-3 h-3 inline mr-1" />
//                           {lastAnalysis.notificationMessage}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
//                     <div className={`text-sm font-medium ${getScoreColor(lead.score)}`}>{lead.score}</div>
//                   </div>
//                 </div>
//               )
//             })
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// function TopLeadsCard({ leads }: { leads: any[] }) {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Star className="h-5 w-5" />
//           Top Scoring Leads
//         </CardTitle>
//         <CardDescription>AI-qualified leads with highest scores</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {leads.length === 0 ? (
//             <div className="text-center py-4 text-muted-foreground">
//               <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
//               <p className="text-sm">No qualified leads yet</p>
//             </div>
//           ) : (
//             leads.map((lead, index) => {
//               const lastAnalysis = lead.metadata?.lastAnalysis
//               return (
//                 <div
//                   key={lead.id}
//                   className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   <div className="flex items-center space-x-3">
//                     <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
//                       {index + 1}
//                     </div>
//                     <div>
//                       <div className="flex items-center">
//                         <p className="text-sm font-medium">{lead.name || `User ${lead.instagramUserId.slice(-4)}`}</p>
//                         {getPriorityBadge(lead.metadata)}
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Badge className={getStatusColor(lead.status)} variant="secondary">
//                           {lead.status}
//                         </Badge>
//                         {lead.email && <Mail className="h-3 w-3 text-muted-foreground" />}
//                         {lead.phone && <Phone className="h-3 w-3 text-muted-foreground" />}
//                       </div>
//                       {lastAnalysis?.buyerPersona && (
//                         <p className="text-xs text-muted-foreground mt-1">Persona: {lastAnalysis.buyerPersona}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className={`text-lg font-bold ${getScoreColor(lead.score)}`}>{lead.score}</div>
//                     {lead.qualificationData && (
//                       <div className="text-xs text-muted-foreground">
//                         Intent: {lead.qualificationData.intentScore} | Sentiment:{" "}
//                         {lead.qualificationData.sentimentScore}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )
//             })
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// function StatusBreakdownCard({ analytics }: { analytics: any }) {
//   if (!analytics?.analytics) return null

//   const statusData = analytics.analytics.reduce((acc: any, item: any) => {
//     acc[item.status] = item._count.id
//     return acc
//   }, {})

//   const total = analytics.totalLeads
//   const statuses = [
//     { name: "New", value: statusData.NEW || 0, color: "bg-blue-500" },
//     { name: "Qualifying", value: statusData.QUALIFYING || 0, color: "bg-yellow-500" },
//     { name: "Qualified", value: statusData.QUALIFIED || 0, color: "bg-green-500" },
//     { name: "Converted", value: statusData.CONVERTED || 0, color: "bg-purple-500" },
//     { name: "Lost", value: statusData.LOST || 0, color: "bg-red-500" },
//   ]

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <BarChart3 className="h-5 w-5" />
//           Lead Status Breakdown
//         </CardTitle>
//         <CardDescription>AI-powered lead qualification distribution</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {statuses.map((status) => (
//             <div key={status.name} className="space-y-2">
//               <div className="flex items-center justify-between text-sm">
//                 <span>{status.name}</span>
//                 <span className="font-medium">
//                   {status.value} ({total > 0 ? Math.round((status.value / total) * 100) : 0}%)
//                 </span>
//               </div>
//               <Progress value={total > 0 ? (status.value / total) * 100 : 0} className="h-2" />
//             </div>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// function RecentInteractionsCard({ interactions }: { interactions: any[] }) {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <MessageSquare className="h-5 w-5" />
//           Recent AI Analysis
//         </CardTitle>
//         <CardDescription>Latest customer interactions with AI insights</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-3">
//           {interactions.length === 0 ? (
//             <div className="text-center py-4 text-muted-foreground">
//               <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
//               <p className="text-sm">No recent interactions</p>
//             </div>
//           ) : (
//             interactions.slice(0, 5).map((interaction) => (
//               <div
//                 key={interaction.id}
//                 className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
//               >
//                 <Avatar className="h-8 w-8">
//                   <AvatarFallback className="text-xs">
//                     {interaction.lead.name?.charAt(0) || interaction.lead.instagramUserId.charAt(0)}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-2 text-sm">
//                     <span className="font-medium">
//                       {interaction.lead.name || `User ${interaction.lead.instagramUserId.slice(-4)}`}
//                     </span>
//                     <Badge className={getStatusColor(interaction.lead.status)} variant="outline">
//                       {interaction.lead.status}
//                     </Badge>
//                     <span className={`text-xs font-medium ${getScoreColor(interaction.lead.score)}`}>
//                       Score: {interaction.lead.score}
//                     </span>
//                   </div>
//                   <p className="text-sm text-muted-foreground mt-1 truncate">{interaction.content}</p>
//                   <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
//                     <span>{interaction.type}</span>
//                     <span>•</span>
//                     <span>{formatDistanceToNow(new Date(interaction.timestamp))} ago</span>
//                     {interaction.sentiment && (
//                       <>
//                         <span>•</span>
//                         <span className={interaction.sentiment > 0 ? "text-green-600" : "text-red-600"}>
//                           {interaction.sentiment > 0 ? "Positive" : "Negative"}
//                         </span>
//                       </>
//                     )}
//                     {interaction.metadata?.priorityLead && (
//                       <>
//                         <span>•</span>
//                         <Badge variant="destructive" className="text-xs">
//                           <Zap className="w-2 h-2 mr-1" />
//                           Priority
//                         </Badge>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// export function LeadsDashboard({
//   analytics,
//   recentLeads,
//   topLeads,
//   hasDuplicates,
//   duplicateCount,
//   userId,
// }: LeadsDashboardProps) {
//   // Create a simple function that returns the server action call
//   const handleMerge = () => handleMergeDuplicates(userId)

//   return (
//     <>
//       <div className="flex items-center justify-between space-y-2">
//         <div>
//           <h2 className="text-3xl font-bold tracking-tight">AI Lead Management</h2>
//           <p className="text-muted-foreground">Powered by advanced AI analysis for intelligent lead qualification</p>
//         </div>
//         <div className="flex items-center space-x-2">
//           <Button variant="outline">
//             <Calendar className="mr-2 h-4 w-4" />
//             Export Data
//           </Button>
//           <Button>
//             <Plus className="mr-2 h-4 w-4" />
//             Add Lead
//           </Button>
//         </div>
//       </div>

//       <DuplicateAlert hasDuplicates={hasDuplicates} duplicateCount={duplicateCount} onMergeDuplicates={handleMerge} />

//       <LeadAnalyticsCards analytics={analytics} />

//       <Tabs defaultValue="overview" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="leads">All Leads</TabsTrigger>
//           <TabsTrigger value="interactions">AI Analysis</TabsTrigger>
//         </TabsList>

//         <TabsContent value="overview" className="space-y-4">
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
//             <div className="col-span-4">
//               <RecentLeadsTable leads={recentLeads} />
//             </div>
//             <div className="col-span-3 space-y-4">
//               <TopLeadsCard leads={topLeads} />
//               <StatusBreakdownCard analytics={analytics} />
//             </div>
//           </div>
//         </TabsContent>

//         <TabsContent value="leads" className="space-y-4">
//           <RecentLeadsTable leads={recentLeads} />
//         </TabsContent>

//         <TabsContent value="interactions" className="space-y-4">
//           <RecentInteractionsCard interactions={analytics?.recentInteractions || []} />
//         </TabsContent>
//       </Tabs>
//     </>
//   )
// }


// "use client"

// import React from "react"

// import { handleMergeDuplicates } from "@/actions/leads"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { Progress } from "@/components/ui/progress"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
//   ArrowDownRight,
//   Sparkles,
//   Timer,
//   PieChart,
//   LineChart,
// } from "lucide-react"
// import { formatDistanceToNow } from "date-fns"
// import { useTransition } from "react"
// import { useRouter } from "next/navigation"

// interface PremiumLeadsDashboardProps {
//   analytics: any
//   recentLeads: any[]
//   topLeads: any[]
//   hasDuplicates: boolean
//   duplicateCount: number
//   userId: string
// }

// function getStatusColor(status: string) {
//   switch (status) {
//     case "NEW":
//       return "bg-blue-100 text-blue-800 border-blue-200"
//     case "QUALIFYING":
//       return "bg-yellow-100 text-yellow-800 border-yellow-200"
//     case "QUALIFIED":
//       return "bg-green-100 text-green-800 border-green-200"
//     case "CONVERTED":
//       return "bg-purple-100 text-purple-800 border-purple-200"
//     case "LOST":
//       return "bg-red-100 text-red-800 border-red-200"
//     default:
//       return "bg-gray-100 text-gray-800 border-gray-200"
//   }
// }

// function getScoreColor(score: number) {
//   if (score >= 85) return "text-purple-600 font-bold"
//   if (score >= 70) return "text-green-600 font-bold"
//   if (score >= 50) return "text-yellow-600 font-semibold"
//   if (score >= 30) return "text-orange-600"
//   return "text-red-600"
// }

// function getTierBadge(metadata: any) {
//   const lastAnalysis = metadata?.lastAnalysis
//   const tier = lastAnalysis?.leadTier

//   if (!tier) return null

//   const tierConfig = {
//     PLATINUM: { icon: Crown, color: "bg-purple-100 text-purple-800 border-purple-200", label: "Platinum" },
//     GOLD: { icon: Award, color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Gold" },
//     SILVER: { icon: Star, color: "bg-gray-100 text-gray-800 border-gray-200", label: "Silver" },
//     BRONZE: { icon: Users, color: "bg-orange-100 text-orange-800 border-orange-200", label: "Bronze" },
//   }

//   const config = tierConfig[tier as keyof typeof tierConfig]
//   if (!config) return null

//   const IconComponent = config.icon

//   return (
//     <Badge className={`${config.color} ml-2`}>
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
//       const result = await onMergeDuplicates()
//       if (result.success) {
//         router.refresh()
//       }
//     })
//   }

//   return (
//     <Alert className="border-orange-200 bg-orange-50">
//       <AlertTriangle className="h-4 w-4 text-orange-600" />
//       <AlertTitle className="text-orange-800">Duplicate Leads Detected</AlertTitle>
//       <AlertDescription className="text-orange-700">
//         Found {duplicateCount} groups of duplicate leads. Merge them to improve your revenue analytics.
//         <Button variant="outline" size="sm" className="ml-2" onClick={handleMerge} disabled={isPending}>
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

//   const revenueGrowthIcon = analytics.revenueMetrics?.revenueGrowth >= 0 ? ArrowUpRight : ArrowDownRight
//   const revenueGrowthColor = analytics.revenueMetrics?.revenueGrowth >= 0 ? "text-green-600" : "text-red-600"

//   return (
//     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
//       <Card className="border-l-4 border-l-blue-500">
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
//           <Users className="h-4 w-4 text-muted-foreground" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold">{analytics.totalLeads}</div>
//           <p className="text-xs text-muted-foreground">AI-powered lead generation</p>
//         </CardContent>
//       </Card>

//       <Card className="border-l-4 border-l-green-500">
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
//           <Target className="h-4 w-4 text-muted-foreground" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold text-green-600">{analytics.qualifiedLeads}</div>
//           <p className="text-xs text-muted-foreground">{analytics.conversionRate}% conversion rate</p>
//         </CardContent>
//       </Card>

//       <Card className="border-l-4 border-l-purple-500">
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Revenue Pipeline</CardTitle>
//           <DollarSign className="h-4 w-4 text-muted-foreground" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold text-purple-600">
//             {getRevenueDisplay(analytics.revenueMetrics?.totalEstimatedRevenue || 0)}
//           </div>
//           <p className="text-xs text-muted-foreground">Estimated total value</p>
//         </CardContent>
//       </Card>

//       <Card className="border-l-4 border-l-yellow-500">
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Expected Revenue</CardTitle>
//           <TrendingUp className="h-4 w-4 text-muted-foreground" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold text-yellow-600">
//             {getRevenueDisplay(analytics.revenueMetrics?.totalExpectedRevenue || 0)}
//           </div>
//           <div className={`text-xs flex items-center ${revenueGrowthColor}`}>
//             {React.createElement(revenueGrowthIcon, { className: "h-3 w-3 mr-1" })}
//             {Math.abs(analytics.revenueMetrics?.revenueGrowth || 0)}% vs last week
//           </div>
//         </CardContent>
//       </Card>

//       <Card className="border-l-4 border-l-orange-500">
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Avg ROI</CardTitle>
//           <BarChart3 className="h-4 w-4 text-muted-foreground" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold text-orange-600">{analytics.revenueMetrics?.averageROI || 0}%</div>
//           <p className="text-xs text-muted-foreground">Return on investment</p>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// function LeadTierDistribution({ analytics }: { analytics: any }) {
//   if (!analytics?.tierDistribution) return null

//   const { platinum, gold, silver, bronze } = analytics.tierDistribution
//   const total = platinum + gold + silver + bronze

//   if (total === 0) return null

//   const tiers = [
//     { name: "Platinum", value: platinum, color: "bg-purple-500", icon: Crown },
//     { name: "Gold", value: gold, color: "bg-yellow-500", icon: Award },
//     { name: "Silver", value: silver, color: "bg-gray-400", icon: Star },
//     { name: "Bronze", value: bronze, color: "bg-orange-500", icon: Users },
//   ]

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <PieChart className="h-5 w-5" />
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
//                     <span>{tier.name}</span>
//                   </div>
//                   <span className="font-medium">
//                     {tier.value} ({Math.round(percentage)}%)
//                   </span>
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

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Sparkles className="h-5 w-5" />
//           Revenue Insights
//         </CardTitle>
//         <CardDescription>AI-powered revenue intelligence</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
//             <div className="flex items-center gap-2">
//               <Crown className="h-4 w-4 text-purple-600" />
//               <span className="text-sm font-medium">High-Value Leads</span>
//             </div>
//             <span className="text-lg font-bold text-purple-600">{insights.highValueLeads}</span>
//           </div>

//           <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
//             <div className="flex items-center gap-2">
//               <DollarSign className="h-4 w-4 text-green-600" />
//               <span className="text-sm font-medium">Avg Lead Value</span>
//             </div>
//             <span className="text-lg font-bold text-green-600">{getRevenueDisplay(insights.averageLeadValue)}</span>
//           </div>

//           <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
//             <div className="flex items-center gap-2">
//               <Target className="h-4 w-4 text-blue-600" />
//               <span className="text-sm font-medium">Conversion Probability</span>
//             </div>
//             <span className="text-lg font-bold text-blue-600">{insights.conversionProbability}%</span>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// function PremiumLeadsTable({ leads }: { leads: any[] }) {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Clock className="h-5 w-5" />
//           Premium Lead Pipeline
//         </CardTitle>
//         <CardDescription>AI-qualified leads with revenue intelligence</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {leads.length === 0 ? (
//             <div className="text-center py-8 text-muted-foreground">
//               <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
//               <p>No premium leads found yet.</p>
//               <p className="text-sm">Start engaging with customers to generate AI-qualified revenue opportunities!</p>
//             </div>
//           ) : (
//             leads.map((lead) => {
//               const lastAnalysis = lead.metadata?.lastAnalysis
//               return (
//                 <div
//                   key={lead.id}
//                   className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   <div className="flex items-center space-x-4">
//                     <Avatar>
//                       <AvatarFallback>
//                         {lead.name ? lead.name.charAt(0).toUpperCase() : lead.instagramUserId.charAt(0).toUpperCase()}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div>
//                       <div className="flex items-center">
//                         <p className="text-sm font-medium">
//                           {lead.name || `Instagram User ${lead.instagramUserId.slice(-4)}`}
//                         </p>
//                         {getTierBadge(lead.metadata)}
//                       </div>
//                       <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                         <span>Score: {lead.score}</span>
//                         <span>•</span>
//                         <span>{formatDistanceToNow(new Date(lead.lastContactDate))} ago</span>
//                         {lastAnalysis?.estimatedValue && (
//                           <>
//                             <span>•</span>
//                             <span className="text-green-600 font-medium">
//                               Est: {getRevenueDisplay(lastAnalysis.estimatedValue)}
//                             </span>
//                           </>
//                         )}
//                         {lastAnalysis?.roi && (
//                           <>
//                             <span>•</span>
//                             <span className="text-blue-600 font-medium">ROI: {lastAnalysis.roi}%</span>
//                           </>
//                         )}
//                       </div>
//                       {lead.interactions.length > 0 && (
//                         <p className="text-xs text-muted-foreground mt-1 max-w-md truncate">
//                           Last: {lead.interactions[0].content}
//                         </p>
//                       )}
//                       {lastAnalysis?.notificationMessage && (
//                         <p className="text-xs text-blue-600 mt-1 font-medium">
//                           <Brain className="w-3 h-3 inline mr-1" />
//                           {lastAnalysis.notificationMessage}
//                         </p>
//                       )}
//                       {lastAnalysis?.nextActions && lastAnalysis.nextActions.length > 0 && (
//                         <div className="flex gap-1 mt-2">
//                           {lastAnalysis.nextActions.slice(0, 2).map((action: string, index: number) => (
//                             <Badge key={index} variant="outline" className="text-xs">
//                               <Timer className="w-2 h-2 mr-1" />
//                               {action.replace(/_/g, " ")}
//                             </Badge>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
//                     <div className={`text-sm font-medium ${getScoreColor(lead.score)}`}>{lead.score}</div>
//                   </div>
//                 </div>
//               )
//             })
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// function TopRevenueLeadsCard({ leads }: { leads: any[] }) {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Crown className="h-5 w-5" />
//           Top Revenue Opportunities
//         </CardTitle>
//         <CardDescription>Highest value leads ranked by AI revenue prediction</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {leads.length === 0 ? (
//             <div className="text-center py-4 text-muted-foreground">
//               <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
//               <p className="text-sm">No high-value leads yet</p>
//             </div>
//           ) : (
//             leads.map((lead, index) => {
//               const lastAnalysis = lead.metadata?.lastAnalysis
//               return (
//                 <div
//                   key={lead.id}
//                   className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   <div className="flex items-center space-x-3">
//                     <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium">
//                       {index + 1}
//                     </div>
//                     <div>
//                       <div className="flex items-center">
//                         <p className="text-sm font-medium">{lead.name || `User ${lead.instagramUserId.slice(-4)}`}</p>
//                         {getTierBadge(lead.metadata)}
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Badge className={getStatusColor(lead.status)} variant="secondary">
//                           {lead.status}
//                         </Badge>
//                         {lastAnalysis?.followUpStrategy && (
//                           <Badge variant="outline" className="text-xs">
//                             {lastAnalysis.followUpStrategy.replace(/_/g, " ")}
//                           </Badge>
//                         )}
//                       </div>
//                       {lastAnalysis?.buyerPersona && (
//                         <p className="text-xs text-muted-foreground mt-1">
//                           Persona: {lastAnalysis.buyerPersona.replace(/_/g, " ")}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className={`text-lg font-bold ${getScoreColor(lead.score)}`}>
//                       {lastAnalysis?.estimatedValue
//                         ? getRevenueDisplay(lastAnalysis.estimatedValue)
//                         : `${lead.score}pts`}
//                     </div>
//                     {lastAnalysis?.roi && (
//                       <div className="text-xs text-blue-600 font-medium">ROI: {lastAnalysis.roi}%</div>
//                     )}
//                     {lead.qualificationData && (
//                       <div className="text-xs text-muted-foreground">
//                         Intent: {lead.qualificationData.intentScore} | Sentiment:{" "}
//                         {lead.qualificationData.sentimentScore}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )
//             })
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// function RecentAIAnalysisCard({ interactions }: { interactions: any[] }) {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Brain className="h-5 w-5" />
//           AI Revenue Analysis
//         </CardTitle>
//         <CardDescription>Latest customer interactions with revenue intelligence</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-3">
//           {interactions.length === 0 ? (
//             <div className="text-center py-4 text-muted-foreground">
//               <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
//               <p className="text-sm">No recent AI analysis</p>
//             </div>
//           ) : (
//             interactions.slice(0, 5).map((interaction) => {
//               const metadata = interaction.metadata
//               return (
//                 <div
//                   key={interaction.id}
//                   className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   <Avatar className="h-8 w-8">
//                     <AvatarFallback className="text-xs">
//                       {interaction.lead.name?.charAt(0) || interaction.lead.instagramUserId.charAt(0)}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center gap-2 text-sm">
//                       <span className="font-medium">
//                         {interaction.lead.name || `User ${interaction.lead.instagramUserId.slice(-4)}`}
//                       </span>
//                       <Badge className={getStatusColor(interaction.lead.status)} variant="outline">
//                         {interaction.lead.status}
//                       </Badge>
//                       {metadata?.leadTier && (
//                         <Badge variant="secondary" className="text-xs">
//                           {metadata.leadTier}
//                         </Badge>
//                       )}
//                     </div>
//                     <p className="text-sm text-muted-foreground mt-1 truncate">{interaction.content}</p>
//                     <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
//                       <span>{interaction.type}</span>
//                       <span>•</span>
//                       <span>{formatDistanceToNow(new Date(interaction.timestamp))} ago</span>
//                       {metadata?.estimatedValue && (
//                         <>
//                           <span>•</span>
//                           <span className="text-green-600 font-medium">
//                             {getRevenueDisplay(metadata.estimatedValue)}
//                           </span>
//                         </>
//                       )}
//                       {interaction.sentiment && (
//                         <>
//                           <span>•</span>
//                           <span className={interaction.sentiment > 0 ? "text-green-600" : "text-red-600"}>
//                             {interaction.sentiment > 0 ? "Positive" : "Negative"}
//                           </span>
//                         </>
//                       )}
//                     </div>
//                     {metadata?.notificationMessage && (
//                       <p className="text-xs text-blue-600 mt-1 font-medium">
//                         <Sparkles className="w-3 h-3 inline mr-1" />
//                         {metadata.notificationMessage}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               )
//             })
//           )}
//         </div>
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
// }: PremiumLeadsDashboardProps) {
//   const handleMerge = () => handleMergeDuplicates(userId)

//   return (
//     <>
//       <div className="flex items-center justify-between space-y-2">
//         <div>
//           <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
//             <Crown className="h-8 w-8 text-purple-600" />
//             Premium AI Revenue Intelligence
//           </h2>
//           <p className="text-muted-foreground">
//             Advanced AI-powered lead qualification with revenue prediction and ROI optimization
//           </p>
//         </div>
//         <div className="flex items-center space-x-2">
//           <Button variant="outline">
//             <LineChart className="mr-2 h-4 w-4" />
//             Revenue Report
//           </Button>
//           <Button variant="outline">
//             <Calendar className="mr-2 h-4 w-4" />
//             Export Data
//           </Button>
//           <Button>
//             <Plus className="mr-2 h-4 w-4" />
//             Add Lead
//           </Button>
//         </div>
//       </div>

//       <DuplicateAlert hasDuplicates={hasDuplicates} duplicateCount={duplicateCount} onMergeDuplicates={handleMerge} />

//       <PremiumAnalyticsCards analytics={analytics} />

//       <Tabs defaultValue="overview" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="overview">Revenue Overview</TabsTrigger>
//           <TabsTrigger value="leads">Lead Pipeline</TabsTrigger>
//           <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
//           <TabsTrigger value="insights">Revenue Insights</TabsTrigger>
//         </TabsList>

//         <TabsContent value="overview" className="space-y-4">
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
//             <div className="col-span-4">
//               <PremiumLeadsTable leads={recentLeads} />
//             </div>
//             <div className="col-span-3 space-y-4">
//               <TopRevenueLeadsCard leads={topLeads} />
//               <LeadTierDistribution analytics={analytics} />
//             </div>
//           </div>
//         </TabsContent>

//         <TabsContent value="leads" className="space-y-4">
//           <PremiumLeadsTable leads={recentLeads} />
//         </TabsContent>

//         <TabsContent value="analysis" className="space-y-4">
//           <RecentAIAnalysisCard interactions={analytics?.recentInteractions || []} />
//         </TabsContent>

//         <TabsContent value="insights" className="space-y-4">
//           <div className="grid gap-4 md:grid-cols-2">
//             <RevenueInsightsCard analytics={analytics} />
//             <LeadTierDistribution analytics={analytics} />
//           </div>
//         </TabsContent>
//       </Tabs>
//     </>
//   )
// }


// "use client"

// import React, { useState, useTransition, useMemo } from "react"
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
//   ArrowDownRight,
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
// } from "lucide-react"
// import { formatDistanceToNow } from "date-fns"
// import { useRouter } from "next/navigation"
// import { toast } from "sonner"

// interface PremiumLeadsDashboardProps {
//   analytics: any
//   recentLeads: any[]
//   topLeads: any[]
//   hasDuplicates: boolean
//   duplicateCount: number
//   userId: string
//   onMergeDuplicates?: (userId: string) => Promise<{ success: boolean; mergedGroups?: number; error?: string }>
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

// function getTierBadge(metadata: any) {
//   const lastAnalysis = metadata?.lastAnalysis
//   const tier = lastAnalysis?.leadTier

//   if (!tier) return null

//   const tierConfig = {
//     PLATINUM: {
//       icon: Crown,
//       color: "bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-300",
//       label: "Platinum",
//       glow: "shadow-lg shadow-purple-500/25",
//     },
//     GOLD: {
//       icon: Award,
//       color: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-yellow-300",
//       label: "Gold",
//       glow: "shadow-lg shadow-yellow-500/25",
//     },
//     SILVER: {
//       icon: Star,
//       color: "bg-gradient-to-r from-gray-400 to-gray-500 text-white border-gray-300",
//       label: "Silver",
//       glow: "shadow-lg shadow-gray-500/25",
//     },
//     BRONZE: {
//       icon: Users,
//       color: "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-300",
//       label: "Bronze",
//       glow: "shadow-lg shadow-orange-500/25",
//     },
//   }

//   const config = tierConfig[tier as keyof typeof tierConfig]
//   if (!config) return null

//   const IconComponent = config.icon

//   return (
//     <Badge className={`${config.color} ${config.glow} ml-2 px-2 py-1`}>
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
//     <Alert className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/10 dark:to-yellow-900/10">
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

//   const revenueGrowthIcon = analytics.revenueMetrics?.revenueGrowth >= 0 ? ArrowUpRight : ArrowDownRight
//   const revenueGrowthColor =
//     analytics.revenueMetrics?.revenueGrowth >= 0
//       ? "text-green-600 dark:text-green-400"
//       : "text-red-600 dark:text-red-400"

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
// }: {
//   leads: any[]
//   onExport: (format: string, selectedIds: string[]) => void
//   onBulkAction: (action: string, selectedIds: string[]) => void
// }) {
//   const [selectedLeads, setSelectedLeads] = useState<string[]>([])
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
//       setSelectedLeads([])
//     } else {
//       setSelectedLeads(filteredLeads.map((lead) => lead.id))
//     }
//   }

//   const handleSelectLead = (leadId: string) => {
//     setSelectedLeads((prev) => (prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]))
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
//                         <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
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
//                         {lastAnalysis?.estimatedValue && (
//                           <div className="flex items-center gap-4 text-xs mt-1">
//                             <span className="text-green-600 font-medium">
//                               Est: {getRevenueDisplay(lastAnalysis.estimatedValue)}
//                             </span>
//                             {lastAnalysis?.roi && (
//                               <span className="text-blue-600 font-medium">ROI: {lastAnalysis.roi}%</span>
//                             )}
//                           </div>
//                         )}
//                         {lead.interactions.length > 0 && (
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
//                 return (
//                   <div
//                     key={lead.id}
//                     className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-all duration-200 group"
//                   >
//                     <div className="flex items-center space-x-3">
//                       <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium">
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
//                 return (
//                   <div
//                     key={interaction.id}
//                     className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-all duration-200"
//                   >
//                     <Avatar className="h-8 w-8">
//                       <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
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

// function CRMStatusCard({ analytics }: { analytics: any }) {
//   const crmStatus = analytics?.crmStatus

//   if (!crmStatus) return null

//   return (
//     <Card className="hover:shadow-lg transition-all duration-200">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <ExternalLink className="h-5 w-5 text-primary" />
//           CRM Integration Status
//         </CardTitle>
//         <CardDescription>Connected systems and sync status</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           <div className="flex items-center justify-between">
//             <span className="text-sm font-medium">Connection Status</span>
//             <Badge variant={crmStatus.connected ? "default" : "secondary"}>
//               {crmStatus.connected ? "Connected" : "Not Connected"}
//             </Badge>
//           </div>

//           {crmStatus.connected && (
//             <>
//               <Separator />
//               <div className="space-y-3">
//                 <h4 className="text-sm font-medium">Active Integrations</h4>
//                 {crmStatus.integrations.map((integration: any) => (
//                   <div key={integration.id} className="flex items-center justify-between p-2 border rounded">
//                     <div>
//                       <p className="text-sm font-medium">{integration.name}</p>
//                       <p className="text-xs text-muted-foreground">{integration.provider}</p>
//                     </div>
//                     <div className="text-right">
//                       <Badge variant="outline" className="text-xs">
//                         {integration.isActive ? "Active" : "Inactive"}
//                       </Badge>
//                       {integration.lastSynced && (
//                         <p className="text-xs text-muted-foreground mt-1">
//                           Last sync: {formatDistanceToNow(new Date(integration.lastSynced))} ago
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}

//           <Button className="w-full" variant={crmStatus.connected ? "outline" : "default"}>
//             <Settings className="h-4 w-4 mr-2" />
//             {crmStatus.connected ? "Manage Integrations" : "Connect CRM"}
//           </Button>
//         </div>
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
// }: PremiumLeadsDashboardProps) {
//   const handleMerge = () => (onMergeDuplicates ? onMergeDuplicates(userId) : handleMergeDuplicates(userId))

//   const handleExport = (format: string, selectedIds: string[]) => {
//     // Implementation for export functionality
//     toast.success(`Exporting ${selectedIds.length} leads as ${format.toUpperCase()}`)
//   }

//   const handleBulkAction = (action: string, selectedIds: string[]) => {
//     // Implementation for bulk actions
//     toast.success(`Performing ${action} on ${selectedIds.length} leads`)
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between space-y-2">
//         <div>
//           <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
//             <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
//               <Crown className="h-8 w-8 text-white" />
//             </div>
//             <div>
//               <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//                 Premium AI Revenue Intelligence
//               </span>
//               <div className="flex items-center gap-2 mt-1">
//                 <Badge variant="secondary" className="text-xs">
//                   <Zap className="h-3 w-3 mr-1" />
//                   AI-Powered
//                 </Badge>
//                 <Badge variant="outline" className="text-xs">
//                   <Activity className="h-3 w-3 mr-1" />
//                   Real-time Analytics
//                 </Badge>
//               </div>
//             </div>
//           </h2>
//           <p className="text-muted-foreground mt-2">
//             Advanced AI-powered lead qualification with revenue prediction and ROI optimization
//           </p>
//         </div>
//         <div className="flex items-center space-x-2">
//           <Button variant="outline" className="hover:bg-primary/5">
//             <LineChart className="mr-2 h-4 w-4" />
//             Revenue Report
//           </Button>
//           <Button variant="outline" className="hover:bg-primary/5">
//             <Calendar className="mr-2 h-4 w-4" />
//             Schedule Export
//           </Button>
//           <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
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
//               <EnhancedLeadsTable leads={recentLeads} onExport={handleExport} onBulkAction={handleBulkAction} />
//             </div>
//             <div className="col-span-3 space-y-6">
//               <TopRevenueLeadsCard leads={topLeads} />
//               <LeadTierDistribution analytics={analytics} />
//             </div>
//           </div>
//         </TabsContent>

//         <TabsContent value="leads" className="space-y-6">
//           <EnhancedLeadsTable leads={recentLeads} onExport={handleExport} onBulkAction={handleBulkAction} />
//         </TabsContent>

//         <TabsContent value="analysis" className="space-y-6">
//           <div className="grid gap-6 md:grid-cols-2">
//             <RecentAIAnalysisCard interactions={analytics?.recentInteractions || []} />
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
//           <div className="grid gap-6 md:grid-cols-2">
//             <CRMStatusCard analytics={analytics} />
//             <Card>
//               <CardHeader>
//                 <CardTitle>Available Integrations</CardTitle>
//                 <CardDescription>Connect with your favorite tools</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-3">
//                   {["HubSpot", "Salesforce", "Pipedrive", "Zoho CRM"].map((crm) => (
//                     <div key={crm} className="flex items-center justify-between p-3 border rounded-lg">
//                       <span className="font-medium">{crm}</span>
//                       <Button variant="outline" size="sm">
//                         <ExternalLink className="h-4 w-4 mr-2" />
//                         Connect
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
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
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface PremiumLeadsDashboardProps {
  analytics: any
  recentLeads: any[]
  topLeads: any[]
  hasDuplicates: boolean
  duplicateCount: number
  userId: string
  onMergeDuplicates?: (userId: string) => Promise<{ success: boolean; mergedGroups?: number; error?: string }>
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

function getTierBadge(metadata: any) {
  const lastAnalysis = metadata?.lastAnalysis
  const tier = lastAnalysis?.leadTier

  if (!tier) return null

  const tierConfig = {
    PLATINUM: {
      icon: Crown,
      color: "bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-300",
      label: "Platinum",
      glow: "shadow-lg shadow-purple-500/25",
    },
    GOLD: {
      icon: Award,
      color: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-yellow-300",
      label: "Gold",
      glow: "shadow-lg shadow-yellow-500/25",
    },
    SILVER: {
      icon: Star,
      color: "bg-gradient-to-r from-gray-400 to-gray-500 text-white border-gray-300",
      label: "Silver",
      glow: "shadow-lg shadow-gray-500/25",
    },
    BRONZE: {
      icon: Users,
      color: "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-300",
      label: "Bronze",
      glow: "shadow-lg shadow-orange-500/25",
    },
  }

  const config = tierConfig[tier as keyof typeof tierConfig]
  if (!config) return null

  const IconComponent = config.icon

  return (
    <Badge className={`${config.color} ${config.glow} ml-2 px-2 py-1`}>
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
    <Alert className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/10 dark:to-yellow-900/10">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertTitle className="text-orange-800 dark:text-orange-400">Duplicate Leads Detected</AlertTitle>
      <AlertDescription className="text-orange-700 dark:text-orange-300">
        Found {duplicateCount} groups of duplicate leads. Merge them to improve your revenue analytics and data quality.
        <Button
          variant="outline"
          size="sm"
          className="ml-2 border-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/20"
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

// CRM Integration Component
function CRMIntegrationSection({ userId }: { userId: string }) {
  const [currentConfig, setCurrentConfig] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isConnecting, setIsConnecting] = useState(false)
  const [testConnection, setTestConnection] = useState(false)
  const [showNewConnection, setShowNewConnection] = useState(false)
  const [connectionType, setConnectionType] = useState<"oauth" | "api">("oauth")
  const [newConnection, setNewConnection] = useState({
    provider: "",
    name: "",
    apiKey: "",
    apiSecret: "",
    baseUrl: "",
  })

  const providers = [
    {
      id: "HUBSPOT",
      name: "HubSpot",
      description: "Connect with HubSpot CRM for contacts and deals",
      logo: "🟠",
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
      logo: "☁️",
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
      logo: "🔵",
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
      logo: "🔶",
      features: ["Leads", "Contacts", "Deals", "Custom Modules"],
      supportsOAuth: false,
      requiresSecret: true,
      requiresBaseUrl: true,
      oauthScopes: [],
    },
  ]

  useEffect(() => {
    fetchCurrentConfig()
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading CRM configuration...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Connection Status */}
      {currentConfig?.isActive ? (
        <Card className="card-hover border-green-200 bg-green-50/50 dark:bg-green-900/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{providers.find((p) => p.id === currentConfig.provider)?.logo}</div>
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
                  <Card key={provider.id} className="card-hover cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{provider.logo}</div>
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
                            className="flex-1"
                            onClick={() => {
                              setNewConnection({ ...newConnection, provider: provider.id })
                              setConnectionType("api")
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
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="text-2xl">{providers.find((p) => p.id === newConnection.provider)?.logo}</div>
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

      {/* Sync Settings */}
      <Card className="card-hover">
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
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Create deals for high-value leads</Label>
              <p className="text-xs text-muted-foreground">
                Create deals/opportunities for Platinum and Gold tier leads
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Sync lead scores</Label>
              <p className="text-xs text-muted-foreground">Include AI-generated lead scores in CRM records</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Real-time sync</Label>
              <p className="text-xs text-muted-foreground">Sync leads immediately when qualified</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Other components remain the same...
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
}: {
  leads: any[]
  onExport: (format: string, selectedIds: string[]) => void
  onBulkAction: (action: string, selectedIds: string[]) => void
}) {
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [tierFilter, setTierFilter] = useState("all")

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        !searchTerm ||
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.instagramUserId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || lead.status === statusFilter
      const matchesTier = tierFilter === "all" || lead.metadata?.lastAnalysis?.leadTier === tierFilter

      return matchesSearch && matchesStatus && matchesTier
    })
  }, [leads, searchTerm, statusFilter, tierFilter])

  const handleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([])
    } else {
      setSelectedLeads(filteredLeads.map((lead) => lead.id))
    }
  }

  const handleSelectLead = (leadId: string) => {
    setSelectedLeads((prev) => (prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]))
  }

  return (
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

                return (
                  <div
                    key={lead.id}
                    className={`flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-all duration-200 cursor-pointer ${
                      isSelected ? "border-primary bg-primary/5" : ""
                    }`}
                    onClick={() => handleSelectLead(lead.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleSelectLead(lead.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                          {lead.name ? lead.name.charAt(0).toUpperCase() : lead.instagramUserId.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">
                            {lead.name || `Instagram User ${lead.instagramUserId.slice(-4)}`}
                          </p>
                          {getTierBadge(lead.metadata)}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />@{lead.instagramUserId}
                          </span>
                          {lead.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {lead.email}
                            </span>
                          )}
                          {lead.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {lead.phone}
                            </span>
                          )}
                          <span>Score: {lead.score}</span>
                          <span>{formatDistanceToNow(new Date(lead.lastContactDate))} ago</span>
                        </div>
                        {lastAnalysis?.estimatedValue && (
                          <div className="flex items-center gap-4 text-xs mt-1">
                            <span className="text-green-600 font-medium">
                              Est: {getRevenueDisplay(lastAnalysis.estimatedValue)}
                            </span>
                            {lastAnalysis?.roi && (
                              <span className="text-blue-600 font-medium">ROI: {lastAnalysis.roi}%</span>
                            )}
                          </div>
                        )}
                        {lead.interactions.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1 max-w-md truncate">
                            Last: {lead.interactions[0].content}
                          </p>
                        )}
                        {lastAnalysis?.notificationMessage && (
                          <p className="text-xs text-blue-600 mt-1 font-medium flex items-center gap-1">
                            <Brain className="w-3 h-3" />
                            {lastAnalysis.notificationMessage}
                          </p>
                        )}
                        {lastAnalysis?.nextActions && lastAnalysis.nextActions.length > 0 && (
                          <div className="flex gap-1 mt-2">
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
                    <div className="flex items-center gap-4">
                      <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                      <div className={`text-sm font-medium ${getScoreColor(lead.score)}`}>{lead.score}</div>
                      <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                        <Eye className="h-4 w-4" />
                      </Button>
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
                return (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{lead.name || `User ${lead.instagramUserId.slice(-4)}`}</p>
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
                const metadata = interaction.metadata
                return (
                  <div
                    key={interaction.id}
                    className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-all duration-200"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
                        {interaction.lead.name?.charAt(0) || interaction.lead.instagramUserId.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">
                          {interaction.lead.name || `User ${interaction.lead.instagramUserId.slice(-4)}`}
                        </span>
                        <Badge className={getStatusColor(interaction.lead.status)} variant="outline">
                          {interaction.lead.status}
                        </Badge>
                        {metadata?.leadTier && (
                          <Badge variant="secondary" className="text-xs">
                            {metadata.leadTier}
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
}: PremiumLeadsDashboardProps) {
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
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Premium AI Revenue Intelligence
              </span>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  AI-Powered
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Activity className="h-3 w-3 mr-1" />
                  Real-time Analytics
                </Badge>
              </div>
            </div>
          </h2>
          <p className="text-muted-foreground mt-2">
            Advanced AI-powered lead qualification with revenue prediction and ROI optimization
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="hover:bg-primary/5">
            <LineChart className="mr-2 h-4 w-4" />
            Revenue Report
          </Button>
          <Button variant="outline" className="hover:bg-primary/5">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Export
          </Button>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
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
              <EnhancedLeadsTable leads={recentLeads} onExport={handleExport} onBulkAction={handleBulkAction} />
            </div>
            <div className="col-span-3 space-y-6">
              <TopRevenueLeadsCard leads={topLeads} />
              <LeadTierDistribution analytics={analytics} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="leads" className="space-y-6">
          <EnhancedLeadsTable leads={recentLeads} onExport={handleExport} onBulkAction={handleBulkAction} />
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <RecentAIAnalysisCard interactions={analytics?.recentInteractions || []} />
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
          <CRMIntegrationSection userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
