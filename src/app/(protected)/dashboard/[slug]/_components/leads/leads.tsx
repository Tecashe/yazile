// "use client"

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { Progress } from "@/components/ui/progress"
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
// } from "lucide-react"
// import { formatDistanceToNow } from "date-fns"

// interface LeadsDashboardProps {
//   analytics: any
//   recentLeads: any[]
//   topLeads: any[]
// }

// function getStatusColor(status: string) {
//   switch (status) {
//     case "NEW":
//       return "bg-blue-100 text-blue-800"
//     case "QUALIFYING":
//       return "bg-yellow-100 text-yellow-800"
//     case "QUALIFIED":
//       return "bg-green-100 text-green-800"
//     case "CONVERTED":
//       return "bg-purple-100 text-purple-800"
//     case "LOST":
//       return "bg-red-100 text-red-800"
//     default:
//       return "bg-gray-100 text-gray-800"
//   }
// }

// function getScoreColor(score: number) {
//   if (score >= 15) return "text-green-600"
//   if (score >= 10) return "text-yellow-600"
//   if (score >= 5) return "text-orange-600"
//   return "text-red-600"
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
//           <div className="text-2xl font-bold">{analytics.qualifiedLeads}</div>
//           <p className="text-xs text-muted-foreground">{analytics.conversionRate}% conversion rate</p>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Converted</CardTitle>
//           <TrendingUp className="h-4 w-4 text-muted-foreground" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold">{analytics.convertedLeads}</div>
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
//         <CardDescription>Latest leads and their qualification status</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {leads.length === 0 ? (
//             <div className="text-center py-8 text-muted-foreground">
//               No leads found. Start engaging with customers to generate leads!
//             </div>
//           ) : (
//             leads.map((lead) => (
//               <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
//                 <div className="flex items-center space-x-4">
//                   <Avatar>
//                     <AvatarFallback>
//                       {lead.name ? lead.name.charAt(0).toUpperCase() : lead.instagramUserId.charAt(0).toUpperCase()}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <p className="text-sm font-medium">
//                       {lead.name || `Instagram User ${lead.instagramUserId.slice(-4)}`}
//                     </p>
//                     <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                       <span>Score: {lead.score}</span>
//                       <span>•</span>
//                       <span>{formatDistanceToNow(new Date(lead.lastContactDate))} ago</span>
//                     </div>
//                     {lead.interactions.length > 0 && (
//                       <p className="text-xs text-muted-foreground mt-1 max-w-md truncate">
//                         Last: {lead.interactions[0].content}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
//                   <div className={`text-sm font-medium ${getScoreColor(lead.score)}`}>{lead.score}</div>
//                 </div>
//               </div>
//             ))
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
//         <CardDescription>Leads with the highest qualification scores</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {leads.length === 0 ? (
//             <div className="text-center py-4 text-muted-foreground">No leads with scores yet</div>
//           ) : (
//             leads.map((lead, index) => (
//               <div key={lead.id} className="flex items-center justify-between">
//                 <div className="flex items-center space-x-3">
//                   <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
//                     {index + 1}
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium">{lead.name || `User ${lead.instagramUserId.slice(-4)}`}</p>
//                     <div className="flex items-center gap-2">
//                       <Badge className={getStatusColor(lead.status)} variant="secondary">
//                         {lead.status}
//                       </Badge>
//                       {lead.email && <Mail className="h-3 w-3 text-muted-foreground" />}
//                       {lead.phone && <Phone className="h-3 w-3 text-muted-foreground" />}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <div className={`text-lg font-bold ${getScoreColor(lead.score)}`}>{lead.score}</div>
//                   {lead.qualificationData && (
//                     <div className="text-xs text-muted-foreground">
//                       Intent: {lead.qualificationData.intentScore} | Sentiment: {lead.qualificationData.sentimentScore}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))
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
//         <CardDescription>Distribution of leads by status</CardDescription>
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
//           Recent Interactions
//         </CardTitle>
//         <CardDescription>Latest customer interactions across all leads</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-3">
//           {interactions.length === 0 ? (
//             <div className="text-center py-4 text-muted-foreground">No recent interactions</div>
//           ) : (
//             interactions.slice(0, 5).map((interaction) => (
//               <div key={interaction.id} className="flex items-start space-x-3 p-3 border rounded-lg">
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

// export function LeadsDashboard({ analytics, recentLeads, topLeads }: LeadsDashboardProps) {
//   return (
//     <>
//       <div className="flex items-center justify-between space-y-2">
//         <h2 className="text-3xl font-bold tracking-tight">Lead Management</h2>
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

//       <LeadAnalyticsCards analytics={analytics} />

//       <Tabs defaultValue="overview" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="leads">All Leads</TabsTrigger>
//           <TabsTrigger value="interactions">Interactions</TabsTrigger>
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
  Phone,
  Mail,
  BarChart3,
  Activity,
  Clock,
  Star,
  Plus,
  AlertTriangle,
  Merge,
  RefreshCw,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

interface LeadsDashboardProps {
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
      return "bg-blue-100 text-blue-800"
    case "QUALIFYING":
      return "bg-yellow-100 text-yellow-800"
    case "QUALIFIED":
      return "bg-green-100 text-green-800"
    case "CONVERTED":
      return "bg-purple-100 text-purple-800"
    case "LOST":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

function getScoreColor(score: number) {
  if (score >= 15) return "text-green-600"
  if (score >= 10) return "text-yellow-600"
  if (score >= 5) return "text-orange-600"
  return "text-red-600"
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
        Found {duplicateCount} groups of duplicate leads. This can happen when the same person contacts you multiple
        times.
        <Button variant="outline" size="sm" className="ml-2" onClick={handleMerge} disabled={isPending}>
          {isPending ? <RefreshCw className="mr-2 h-3 w-3 animate-spin" /> : <Merge className="mr-2 h-3 w-3" />}
          {isPending ? "Merging..." : "Merge Duplicates"}
        </Button>
      </AlertDescription>
    </Alert>
  )
}

function LeadAnalyticsCards({ analytics }: { analytics: any }) {
  if (!analytics) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
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

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.totalLeads}</div>
          <p className="text-xs text-muted-foreground">All time leads generated</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.qualifiedLeads}</div>
          <p className="text-xs text-muted-foreground">{analytics.conversionRate}% conversion rate</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Converted</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.convertedLeads}</div>
          <p className="text-xs text-muted-foreground">{analytics.qualificationRate}% of total leads</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.recentInteractions?.length || 0}</div>
          <p className="text-xs text-muted-foreground">Interactions today</p>
        </CardContent>
      </Card>
    </div>
  )
}

function RecentLeadsTable({ leads }: { leads: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Leads
        </CardTitle>
        <CardDescription>Latest leads and their qualification status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leads.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No leads found. Start engaging with customers to generate leads!
            </div>
          ) : (
            leads.map((lead) => (
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
                    <p className="text-sm font-medium">
                      {lead.name || `Instagram User ${lead.instagramUserId.slice(-4)}`}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Score: {lead.score}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(lead.lastContactDate))} ago</span>
                      {lead.email && <Mail className="h-3 w-3 ml-2" />}
                      {lead.phone && <Phone className="h-3 w-3 ml-1" />}
                    </div>
                    {lead.interactions.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1 max-w-md truncate">
                        Last: {lead.interactions[0].content}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                  <div className={`text-sm font-medium ${getScoreColor(lead.score)}`}>{lead.score}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function TopLeadsCard({ leads }: { leads: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Top Scoring Leads
        </CardTitle>
        <CardDescription>Leads with the highest qualification scores</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leads.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">No leads with scores yet</div>
          ) : (
            leads.map((lead, index) => (
              <div
                key={lead.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{lead.name || `User ${lead.instagramUserId.slice(-4)}`}</p>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(lead.status)} variant="secondary">
                        {lead.status}
                      </Badge>
                      {lead.email && <Mail className="h-3 w-3 text-muted-foreground" />}
                      {lead.phone && <Phone className="h-3 w-3 text-muted-foreground" />}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getScoreColor(lead.score)}`}>{lead.score}</div>
                  {lead.qualificationData && (
                    <div className="text-xs text-muted-foreground">
                      Intent: {lead.qualificationData.intentScore} | Sentiment: {lead.qualificationData.sentimentScore}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function StatusBreakdownCard({ analytics }: { analytics: any }) {
  if (!analytics?.analytics) return null

  const statusData = analytics.analytics.reduce((acc: any, item: any) => {
    acc[item.status] = item._count.id
    return acc
  }, {})

  const total = analytics.totalLeads
  const statuses = [
    { name: "New", value: statusData.NEW || 0, color: "bg-blue-500" },
    { name: "Qualifying", value: statusData.QUALIFYING || 0, color: "bg-yellow-500" },
    { name: "Qualified", value: statusData.QUALIFIED || 0, color: "bg-green-500" },
    { name: "Converted", value: statusData.CONVERTED || 0, color: "bg-purple-500" },
    { name: "Lost", value: statusData.LOST || 0, color: "bg-red-500" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Lead Status Breakdown
        </CardTitle>
        <CardDescription>Distribution of leads by status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statuses.map((status) => (
            <div key={status.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{status.name}</span>
                <span className="font-medium">
                  {status.value} ({total > 0 ? Math.round((status.value / total) * 100) : 0}%)
                </span>
              </div>
              <Progress value={total > 0 ? (status.value / total) * 100 : 0} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function RecentInteractionsCard({ interactions }: { interactions: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Recent Interactions
        </CardTitle>
        <CardDescription>Latest customer interactions across all leads</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {interactions.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">No recent interactions</div>
          ) : (
            interactions.slice(0, 5).map((interaction) => (
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
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 truncate">{interaction.content}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <span>{interaction.type}</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(interaction.timestamp))} ago</span>
                    {interaction.sentiment && (
                      <>
                        <span>•</span>
                        <span className={interaction.sentiment > 0 ? "text-green-600" : "text-red-600"}>
                          {interaction.sentiment > 0 ? "Positive" : "Negative"}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}



export function LeadsDashboard({
  analytics,
  recentLeads,
  topLeads,
  hasDuplicates,
  duplicateCount,
  userId, // Use userId instead of onMergeDuplicates
}: LeadsDashboardProps) {
  // Create a simple function that returns the server action call
  const handleMerge = () => handleMergeDuplicates(userId)

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Lead Management</h2>
        <div className="flex items-center space-x-2">
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

      <DuplicateAlert
        hasDuplicates={hasDuplicates}
        duplicateCount={duplicateCount}
        onMergeDuplicates={handleMerge} // Pass the simple handler
      />

      <LeadAnalyticsCards analytics={analytics} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leads">All Leads</TabsTrigger>
          <TabsTrigger value="interactions">Interactions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
              <RecentLeadsTable leads={recentLeads} />
            </div>
            <div className="col-span-3 space-y-4">
              <TopLeadsCard leads={topLeads} />
              <StatusBreakdownCard analytics={analytics} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="leads" className="space-y-4">
          <RecentLeadsTable leads={recentLeads} />
        </TabsContent>

        <TabsContent value="interactions" className="space-y-4">
          <RecentInteractionsCard interactions={analytics?.recentInteractions || []} />
        </TabsContent>
      </Tabs>
    </>
  )
}