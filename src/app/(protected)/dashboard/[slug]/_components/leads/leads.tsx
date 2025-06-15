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


"use client"

import React from "react"

import { handleMergeDuplicates } from "@/actions/leads"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
  ArrowDownRight,
  Sparkles,
  Timer,
  PieChart,
  LineChart,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

interface PremiumLeadsDashboardProps {
  analytics: any
  recentLeads: any[]
  topLeads: any[]
  hasDuplicates: boolean
  duplicateCount: number
  userId: string
}

function getStatusColor(status: string) {
  switch (status) {
    case "NEW":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "QUALIFYING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "QUALIFIED":
      return "bg-green-100 text-green-800 border-green-200"
    case "CONVERTED":
      return "bg-purple-100 text-purple-800 border-purple-200"
    case "LOST":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

function getScoreColor(score: number) {
  if (score >= 85) return "text-purple-600 font-bold"
  if (score >= 70) return "text-green-600 font-bold"
  if (score >= 50) return "text-yellow-600 font-semibold"
  if (score >= 30) return "text-orange-600"
  return "text-red-600"
}

function getTierBadge(metadata: any) {
  const lastAnalysis = metadata?.lastAnalysis
  const tier = lastAnalysis?.leadTier

  if (!tier) return null

  const tierConfig = {
    PLATINUM: { icon: Crown, color: "bg-purple-100 text-purple-800 border-purple-200", label: "Platinum" },
    GOLD: { icon: Award, color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Gold" },
    SILVER: { icon: Star, color: "bg-gray-100 text-gray-800 border-gray-200", label: "Silver" },
    BRONZE: { icon: Users, color: "bg-orange-100 text-orange-800 border-orange-200", label: "Bronze" },
  }

  const config = tierConfig[tier as keyof typeof tierConfig]
  if (!config) return null

  const IconComponent = config.icon

  return (
    <Badge className={`${config.color} ml-2`}>
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
      const result = await onMergeDuplicates()
      if (result.success) {
        router.refresh()
      }
    })
  }

  return (
    <Alert className="border-orange-200 bg-orange-50">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertTitle className="text-orange-800">Duplicate Leads Detected</AlertTitle>
      <AlertDescription className="text-orange-700">
        Found {duplicateCount} groups of duplicate leads. Merge them to improve your revenue analytics.
        <Button variant="outline" size="sm" className="ml-2" onClick={handleMerge} disabled={isPending}>
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

  const revenueGrowthIcon = analytics.revenueMetrics?.revenueGrowth >= 0 ? ArrowUpRight : ArrowDownRight
  const revenueGrowthColor = analytics.revenueMetrics?.revenueGrowth >= 0 ? "text-green-600" : "text-red-600"

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.totalLeads}</div>
          <p className="text-xs text-muted-foreground">AI-powered lead generation</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{analytics.qualifiedLeads}</div>
          <p className="text-xs text-muted-foreground">{analytics.conversionRate}% conversion rate</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenue Pipeline</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            {getRevenueDisplay(analytics.revenueMetrics?.totalEstimatedRevenue || 0)}
          </div>
          <p className="text-xs text-muted-foreground">Estimated total value</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-yellow-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expected Revenue</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">
            {getRevenueDisplay(analytics.revenueMetrics?.totalExpectedRevenue || 0)}
          </div>
          <div className={`text-xs flex items-center ${revenueGrowthColor}`}>
            {React.createElement(revenueGrowthIcon, { className: "h-3 w-3 mr-1" })}
            {Math.abs(analytics.revenueMetrics?.revenueGrowth || 0)}% vs last week
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-orange-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg ROI</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{analytics.revenueMetrics?.averageROI || 0}%</div>
          <p className="text-xs text-muted-foreground">Return on investment</p>
        </CardContent>
      </Card>
    </div>
  )
}

function LeadTierDistribution({ analytics }: { analytics: any }) {
  if (!analytics?.tierDistribution) return null

  const { platinum, gold, silver, bronze } = analytics.tierDistribution
  const total = platinum + gold + silver + bronze

  if (total === 0) return null

  const tiers = [
    { name: "Platinum", value: platinum, color: "bg-purple-500", icon: Crown },
    { name: "Gold", value: gold, color: "bg-yellow-500", icon: Award },
    { name: "Silver", value: silver, color: "bg-gray-400", icon: Star },
    { name: "Bronze", value: bronze, color: "bg-orange-500", icon: Users },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
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
                    <span>{tier.name}</span>
                  </div>
                  <span className="font-medium">
                    {tier.value} ({Math.round(percentage)}%)
                  </span>
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Revenue Insights
        </CardTitle>
        <CardDescription>AI-powered revenue intelligence</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">High-Value Leads</span>
            </div>
            <span className="text-lg font-bold text-purple-600">{insights.highValueLeads}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Avg Lead Value</span>
            </div>
            <span className="text-lg font-bold text-green-600">{getRevenueDisplay(insights.averageLeadValue)}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Conversion Probability</span>
            </div>
            <span className="text-lg font-bold text-blue-600">{insights.conversionProbability}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PremiumLeadsTable({ leads }: { leads: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Premium Lead Pipeline
        </CardTitle>
        <CardDescription>AI-qualified leads with revenue intelligence</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leads.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No premium leads found yet.</p>
              <p className="text-sm">Start engaging with customers to generate AI-qualified revenue opportunities!</p>
            </div>
          ) : (
            leads.map((lead) => {
              const lastAnalysis = lead.metadata?.lastAnalysis
              return (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>
                        {lead.name ? lead.name.charAt(0).toUpperCase() : lead.instagramUserId.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center">
                        <p className="text-sm font-medium">
                          {lead.name || `Instagram User ${lead.instagramUserId.slice(-4)}`}
                        </p>
                        {getTierBadge(lead.metadata)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Score: {lead.score}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(lead.lastContactDate))} ago</span>
                        {lastAnalysis?.estimatedValue && (
                          <>
                            <span>•</span>
                            <span className="text-green-600 font-medium">
                              Est: {getRevenueDisplay(lastAnalysis.estimatedValue)}
                            </span>
                          </>
                        )}
                        {lastAnalysis?.roi && (
                          <>
                            <span>•</span>
                            <span className="text-blue-600 font-medium">ROI: {lastAnalysis.roi}%</span>
                          </>
                        )}
                      </div>
                      {lead.interactions.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1 max-w-md truncate">
                          Last: {lead.interactions[0].content}
                        </p>
                      )}
                      {lastAnalysis?.notificationMessage && (
                        <p className="text-xs text-blue-600 mt-1 font-medium">
                          <Brain className="w-3 h-3 inline mr-1" />
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
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                    <div className={`text-sm font-medium ${getScoreColor(lead.score)}`}>{lead.score}</div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function TopRevenueLeadsCard({ leads }: { leads: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5" />
          Top Revenue Opportunities
        </CardTitle>
        <CardDescription>Highest value leads ranked by AI revenue prediction</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leads.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No high-value leads yet</p>
            </div>
          ) : (
            leads.map((lead, index) => {
              const lastAnalysis = lead.metadata?.lastAnalysis
              return (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <p className="text-sm font-medium">{lead.name || `User ${lead.instagramUserId.slice(-4)}`}</p>
                        {getTierBadge(lead.metadata)}
                      </div>
                      <div className="flex items-center gap-2">
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
      </CardContent>
    </Card>
  )
}

function RecentAIAnalysisCard({ interactions }: { interactions: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Revenue Analysis
        </CardTitle>
        <CardDescription>Latest customer interactions with revenue intelligence</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {interactions.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent AI analysis</p>
            </div>
          ) : (
            interactions.slice(0, 5).map((interaction) => {
              const metadata = interaction.metadata
              return (
                <div
                  key={interaction.id}
                  className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
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
                      <span>{interaction.type}</span>
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
                      <p className="text-xs text-blue-600 mt-1 font-medium">
                        <Sparkles className="w-3 h-3 inline mr-1" />
                        {metadata.notificationMessage}
                      </p>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
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
}: PremiumLeadsDashboardProps) {
  const handleMerge = () => handleMergeDuplicates(userId)

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Crown className="h-8 w-8 text-purple-600" />
            Premium AI Revenue Intelligence
          </h2>
          <p className="text-muted-foreground">
            Advanced AI-powered lead qualification with revenue prediction and ROI optimization
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <LineChart className="mr-2 h-4 w-4" />
            Revenue Report
          </Button>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </div>

      <DuplicateAlert hasDuplicates={hasDuplicates} duplicateCount={duplicateCount} onMergeDuplicates={handleMerge} />

      <PremiumAnalyticsCards analytics={analytics} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Revenue Overview</TabsTrigger>
          <TabsTrigger value="leads">Lead Pipeline</TabsTrigger>
          <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="insights">Revenue Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
              <PremiumLeadsTable leads={recentLeads} />
            </div>
            <div className="col-span-3 space-y-4">
              <TopRevenueLeadsCard leads={topLeads} />
              <LeadTierDistribution analytics={analytics} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="leads" className="space-y-4">
          <PremiumLeadsTable leads={recentLeads} />
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <RecentAIAnalysisCard interactions={analytics?.recentInteractions || []} />
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <RevenueInsightsCard analytics={analytics} />
            <LeadTierDistribution analytics={analytics} />
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}
