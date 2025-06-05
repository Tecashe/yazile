// "use client"

// import { useEffect, useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Progress } from "@/components/ui/progress"
// import {
//   Bot,
//   Zap,
//   Users,
//   Activity,
//   CheckCircle,
//   AlertCircle,
//   Target,
//   BarChart3,
//   Play,
//   Pause,
//   Sparkles,
//   Instagram,
//   Send,
//   Clock,
//   ArrowUpRight,
//   ArrowDownRight,
// } from "lucide-react"
// import { motion } from "framer-motion"
// import { cn } from "@/lib/utils"
// import {
//   getDashboardStats,
//   getRecentActivity,
//   getLeadAnalytics,
//   getAutomationPerformance,
//   getIntegrationStats,
// } from "@/actions/dashboard/d-actions"

// type DashboardStats = Awaited<ReturnType<typeof getDashboardStats>>
// type RecentActivity = Awaited<ReturnType<typeof getRecentActivity>>
// type LeadAnalytics = Awaited<ReturnType<typeof getLeadAnalytics>>
// type AutomationPerformance = Awaited<ReturnType<typeof getAutomationPerformance>>
// type IntegrationStats = Awaited<ReturnType<typeof getIntegrationStats>>

// export function RealDashboardCards() {
//   const [stats, setStats] = useState<DashboardStats | null>(null)
//   const [activity, setActivity] = useState<RecentActivity | null>(null)
//   const [leadAnalytics, setLeadAnalytics] = useState<LeadAnalytics | null>(null)
//   const [automationPerformance, setAutomationPerformance] = useState<AutomationPerformance | null>(null)
//   const [integrationStats, setIntegrationStats] = useState<IntegrationStats | null>(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const [statsData, activityData, leadData, automationData, integrationData] = await Promise.all([
//           getDashboardStats(),
//           getRecentActivity(),
//           getLeadAnalytics(),
//           getAutomationPerformance(),
//           getIntegrationStats(),
//         ])

//         setStats(statsData)
//         setActivity(activityData)
//         setLeadAnalytics(leadData)
//         setAutomationPerformance(automationData)
//         setIntegrationStats(integrationData)
//       } catch (error) {
//         console.error("Error fetching dashboard data:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [])

//   if (loading) {
//     return (
//       <div className="space-y-6">
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//           {[...Array(4)].map((_, i) => (
//             <Card key={i} className="border-border/50 bg-card/50">
//               <CardHeader className="animate-pulse">
//                 <div className="h-4 bg-muted rounded w-3/4"></div>
//                 <div className="h-8 bg-muted rounded w-1/2"></div>
//               </CardHeader>
//             </Card>
//           ))}
//         </div>
//       </div>
//     )
//   }

//   if (!stats) return null

//   const statCards = [
//     {
//       title: "Total Automations",
//       value: stats.totalAutomations,
//       subtitle: `${stats.activeAutomations} active`,
//       change: stats.activeAutomations > 0 ? "+100%" : "0%",
//       trend: stats.activeAutomations > 0 ? "up" : "neutral",
//       icon: Zap,
//       color: "text-amber-500",
//       bgColor: "bg-amber-500/10",
//     },
//     {
//       title: "Total Leads",
//       value: stats.totalLeads.toLocaleString(),
//       subtitle: `${stats.qualifiedLeads} qualified`,
//       change: stats.leadGrowth > 0 ? `+${stats.leadGrowth}` : "0",
//       trend: stats.leadGrowth > 0 ? "up" : "neutral",
//       icon: Users,
//       color: "text-green-500",
//       bgColor: "bg-green-500/10",
//     },
//     {
//       title: "Conversion Rate",
//       value: `${stats.conversionRate}%`,
//       subtitle: `${stats.convertedLeads} converted`,
//       change: stats.conversionRate > 0 ? "Good" : "Needs work",
//       trend: stats.conversionRate > 15 ? "up" : "down",
//       icon: Target,
//       color: "text-blue-500",
//       bgColor: "bg-blue-500/10",
//     },
//     {
//       title: "Integrations",
//       value: stats.integrations,
//       subtitle: `${stats.businesses} businesses`,
//       change: stats.subscription,
//       trend: stats.subscription === "PRO" ? "up" : "neutral",
//       icon: Bot,
//       color: "text-purple-500",
//       bgColor: "bg-purple-500/10",
//     },
//   ]

//   return (
//     <div className="space-y-6">
//       {/* Stats Grid */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         {statCards.map((stat, index) => (
//           <motion.div
//             key={stat.title}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.1 }}
//           >
//             <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 group">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
//                 <div className={cn("p-2 rounded-lg transition-transform group-hover:scale-110", stat.bgColor)}>
//                   <stat.icon className={cn("h-4 w-4", stat.color)} />
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{stat.value}</div>
//                 <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
//                   <span>{stat.subtitle}</span>
//                   <div className="flex items-center">
//                     {stat.trend === "up" ? (
//                       <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
//                     ) : stat.trend === "down" ? (
//                       <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
//                     ) : null}
//                     <span
//                       className={
//                         stat.trend === "up"
//                           ? "text-green-500"
//                           : stat.trend === "down"
//                             ? "text-red-500"
//                             : "text-muted-foreground"
//                       }
//                     >
//                       {stat.change}
//                     </span>
//                   </div>
//                 </div>
//               </CardContent>
//               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
//             </Card>
//           </motion.div>
//         ))}
//       </div>

//       {/* Main Dashboard Grid */}
//       <div className="grid gap-6 lg:grid-cols-3">
//         {/* Automation Performance */}
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.2 }}
//           className="lg:col-span-2"
//         >
//           <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <BarChart3 className="h-5 w-5 text-blue-500" />
//                 Automation Performance
//               </CardTitle>
//               <CardDescription>Your top performing automations</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {automationPerformance?.slice(0, 3).map((automation) => (
//                 <div
//                   key={automation.id}
//                   className="flex items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div
//                       className={cn("p-2 rounded-lg", {
//                         "bg-green-500/20": automation.active,
//                         "bg-gray-500/20": !automation.active,
//                       })}
//                     >
//                       {automation.active ? (
//                         <Play className="h-4 w-4 text-green-500" />
//                       ) : (
//                         <Pause className="h-4 w-4 text-gray-500" />
//                       )}
//                     </div>
//                     <div>
//                       <p className="font-medium">{automation.name}</p>
//                       <p className="text-sm text-muted-foreground">
//                         {automation.totalLeads} leads • {automation.conversionRate}% conversion
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Badge variant={automation.active ? "default" : "secondary"} className="capitalize">
//                       {automation.platform.toLowerCase()}
//                     </Badge>
//                     <div className="text-right">
//                       <div className="text-sm font-medium">{automation.qualifiedLeads}</div>
//                       <div className="text-xs text-muted-foreground">qualified</div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               {automationPerformance?.length === 0 && (
//                 <div className="text-center py-8 text-muted-foreground">
//                   <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                   <p>No automations created yet</p>
//                   <Button className="mt-4" size="sm">
//                     Create Your First Automation
//                   </Button>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Recent Activity */}
//         <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
//           <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Activity className="h-5 w-5 text-green-500" />
//                 Recent Activity
//               </CardTitle>
//               <CardDescription>Latest updates from your automations</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               {activity?.recentLeads.slice(0, 4).map((lead) => (
//                 <div
//                   key={lead.id}
//                   className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
//                 >
//                   <div
//                     className={cn("p-1 rounded-full", {
//                       "bg-green-500/20": lead.status === "QUALIFIED" || lead.status === "CONVERTED",
//                       "bg-blue-500/20": lead.status === "NEW" || lead.status === "NURTURING",
//                       "bg-red-500/20": lead.status === "DISQUALIFIED" || lead.status === "LOST",
//                     })}
//                   >
//                     {(lead.status === "QUALIFIED" || lead.status === "CONVERTED") && (
//                       <CheckCircle className="h-3 w-3 text-green-500" />
//                     )}
//                     {(lead.status === "NEW" || lead.status === "NURTURING") && (
//                       <Clock className="h-3 w-3 text-blue-500" />
//                     )}
//                     {(lead.status === "DISQUALIFIED" || lead.status === "LOST") && (
//                       <AlertCircle className="h-3 w-3 text-red-500" />
//                     )}
//                   </div>
//                   <div className="flex-1 space-y-1">
//                     <p className="text-sm font-medium">New lead: {lead.name}</p>
//                     <p className="text-xs text-muted-foreground">
//                       From {lead.automationName} • {new Date(lead.createdAt).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <Badge variant="outline" className="text-xs">
//                     {lead.status.toLowerCase()}
//                   </Badge>
//                 </div>
//               ))}
//               {activity?.recentLeads.length === 0 && (
//                 <div className="text-center py-4 text-muted-foreground">
//                   <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
//                   <p className="text-sm">No recent leads</p>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>

//       {/* Lead Analytics & Integration Stats */}
//       <div className="grid gap-6 lg:grid-cols-2">
//         {/* Lead Status Breakdown */}
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
//           <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Target className="h-5 w-5 text-purple-500" />
//                 Lead Status Breakdown
//               </CardTitle>
//               <CardDescription>Distribution of your leads by status</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {leadAnalytics?.leadsByStatus.map((item) => {
//                 const percentage = stats.totalLeads > 0 ? (item.count / stats.totalLeads) * 100 : 0
//                 return (
//                   <div key={item.status} className="space-y-2">
//                     <div className="flex items-center justify-between text-sm">
//                       <span className="capitalize text-muted-foreground">
//                         {item.status.toLowerCase().replace("_", " ")}
//                       </span>
//                       <span className="font-medium">
//                         {item.count} ({Math.round(percentage)}%)
//                       </span>
//                     </div>
//                     <Progress value={percentage} className="h-2" />
//                   </div>
//                 )
//               })}
//               {leadAnalytics?.leadsByStatus.length === 0 && (
//                 <div className="text-center py-4 text-muted-foreground">
//                   <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
//                   <p className="text-sm">No lead data available</p>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Integration Stats */}
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
//           <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Instagram className="h-5 w-5 text-pink-500" />
//                 Connected Platforms
//               </CardTitle>
//               <CardDescription>Your social media integrations</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {integrationStats?.map((integration) => (
//                 <div key={integration.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
//                   <div className="flex items-center gap-3">
//                     <div className="p-2 rounded-lg bg-gradient-to-r from-pink-500/20 to-purple-500/20">
//                       <Instagram className="h-4 w-4 text-pink-500" />
//                     </div>
//                     <div>
//                       <p className="font-medium capitalize">{integration.name.toLowerCase()}</p>
//                       <p className="text-sm text-muted-foreground">@{integration.username}</p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-sm font-medium">{integration.followersCount?.toLocaleString() || "0"}</div>
//                     <div className="text-xs text-muted-foreground">followers</div>
//                   </div>
//                 </div>
//               ))}
//               {integrationStats?.length === 0 && (
//                 <div className="text-center py-4 text-muted-foreground">
//                   <Send className="h-8 w-8 mx-auto mb-2 opacity-50" />
//                   <p className="text-sm">No integrations connected</p>
//                   <Button variant="outline" size="sm" className="mt-2">
//                     Connect Platform
//                   </Button>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>

//       {/* Quick Actions */}
//       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
//         <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Sparkles className="h-5 w-5 text-yellow-500" />
//               Quick Actions
//             </CardTitle>
//             <CardDescription>Get started with common tasks</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
//               <Button className="h-auto p-4 flex-col gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600">
//                 <Zap className="h-6 w-6" />
//                 <span className="text-sm">New Automation</span>
//               </Button>
//               <Button variant="outline" className="h-auto p-4 flex-col gap-2 hover:bg-accent/50">
//                 <Users className="h-6 w-6" />
//                 <span className="text-sm">View Leads</span>
//               </Button>
//               <Button variant="outline" className="h-auto p-4 flex-col gap-2 hover:bg-accent/50">
//                 <Instagram className="h-6 w-6" />
//                 <span className="text-sm">Connect Platform</span>
//               </Button>
//               <Button variant="outline" className="h-auto p-4 flex-col gap-2 hover:bg-accent/50">
//                 <BarChart3 className="h-6 w-6" />
//                 <span className="text-sm">View Analytics</span>
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import {
  Zap,
  Users,
  Activity,
  Target,
  BarChart3,
  Sparkles,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  DollarSign,
  Timer,
  MessageSquare,
  Filter,
} from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  getEnhancedDashboardStats,
  getLeadFunnelAnalytics,
  getTimeBasedAnalytics,
  getPlatformPerformance,
  getLeadSourceAnalytics,
  getEngagementMetrics,
  getBusinessImpactMetrics,
} from "@/actions/dashboard/d-actions"

// Types for the enhanced data
type EnhancedStats = Awaited<ReturnType<typeof getEnhancedDashboardStats>>
type FunnelData = Awaited<ReturnType<typeof getLeadFunnelAnalytics>>
type TimeData = Awaited<ReturnType<typeof getTimeBasedAnalytics>>
type PlatformData = Awaited<ReturnType<typeof getPlatformPerformance>>
type SourceData = Awaited<ReturnType<typeof getLeadSourceAnalytics>>
type EngagementData = Awaited<ReturnType<typeof getEngagementMetrics>>
type BusinessImpactData = Awaited<ReturnType<typeof getBusinessImpactMetrics>>

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1", "#d084d0"]

export function EnhancedDashboardCards() {
  const [stats, setStats] = useState<EnhancedStats | null>(null)
  const [funnelData, setFunnelData] = useState<FunnelData | null>(null)
  const [timeData, setTimeData] = useState<TimeData | null>(null)
  const [platformData, setPlatformData] = useState<PlatformData | null>(null)
  const [sourceData, setSourceData] = useState<SourceData | null>(null)
  const [engagementData, setEngagementData] = useState<EngagementData | null>(null)
  const [businessImpact, setBusinessImpact] = useState<BusinessImpactData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          statsData,
          funnelAnalytics,
          timeAnalytics,
          platformAnalytics,
          sourceAnalytics,
          engagementAnalytics,
          businessImpactData,
        ] = await Promise.all([
          getEnhancedDashboardStats(),
          getLeadFunnelAnalytics(),
          getTimeBasedAnalytics(),
          getPlatformPerformance(),
          getLeadSourceAnalytics(),
          getEngagementMetrics(),
          getBusinessImpactMetrics(),
        ])

        setStats(statsData)
        setFunnelData(funnelAnalytics)
        setTimeData(timeAnalytics)
        setPlatformData(platformAnalytics)
        setSourceData(sourceAnalytics)
        setEngagementData(engagementAnalytics)
        setBusinessImpact(businessImpactData)
      } catch (error) {
        console.error("Error fetching enhanced dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="border-border/50 bg-card/50">
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) return null

  const enhancedStatCards = [
    {
      title: "Total Leads",
      value: stats.totalLeads.toLocaleString(),
      subtitle: `${stats.leadsLast30Days} this month`,
      change: `${stats.leadGrowthRate > 0 ? "+" : ""}${stats.leadGrowthRate}%`,
      trend: stats.leadGrowthRate > 0 ? "up" : stats.leadGrowthRate < 0 ? "down" : "neutral",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Conversion Rate",
      value: `${stats.conversionRate}%`,
      subtitle: `${stats.convertedLeads} converted`,
      change: stats.qualificationRate > 0 ? `${stats.qualificationRate}% qualified` : "No qualified leads",
      trend: stats.conversionRate > 15 ? "up" : "down",
      icon: Target,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Avg. Time to Convert",
      value: `${stats.avgTimeToConversion} days`,
      subtitle: "Lead velocity",
      change: stats.avgTimeToConversion < 7 ? "Fast" : stats.avgTimeToConversion < 14 ? "Good" : "Slow",
      trend: stats.avgTimeToConversion < 7 ? "up" : "down",
      icon: Clock,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Automation Efficiency",
      value: stats.avgLeadsPerAutomation.toString(),
      subtitle: "Leads per automation",
      change: `${stats.avgConversionsPerAutomation} conversions avg`,
      trend: stats.avgLeadsPerAutomation > 10 ? "up" : "neutral",
      icon: Zap,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
  ]

  const businessImpactCards = [
    {
      title: "Estimated Lead Value",
      value: `$${businessImpact?.totalLeadValue.toLocaleString() || 0}`,
      subtitle: "Total generated value",
      change: `$${businessImpact?.avgLeadValue || 0} per lead`,
      trend: "up",
      icon: DollarSign,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Monthly ROI",
      value: `${businessImpact?.monthlyROI || 0}%`,
      subtitle: `$${businessImpact?.monthlyCost || 0} monthly cost`,
      change: `$${businessImpact?.costPerLead || 0} per lead`,
      trend: (businessImpact?.monthlyROI || 0) > 100 ? "up" : "down",
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Time Saved",
      value: `${businessImpact?.timeSavedHours || 0}h`,
      subtitle: "Automation efficiency",
      change: `${businessImpact?.automatedInteractions || 0} interactions`,
      trend: "up",
      icon: Timer,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Engagement Rate",
      value: `${engagementData?.totalInteractions || 0}`,
      subtitle: "Total interactions",
      change: "Last 30 days",
      trend: "up",
      icon: MessageSquare,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {enhancedStatCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={cn("p-2 rounded-lg transition-transform group-hover:scale-110", stat.bgColor)}>
                  <stat.icon className={cn("h-4 w-4", stat.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                  <span>{stat.subtitle}</span>
                  <div className="flex items-center">
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                    ) : stat.trend === "down" ? (
                      <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                    ) : null}
                    <span
                      className={
                        stat.trend === "up"
                          ? "text-green-500"
                          : stat.trend === "down"
                            ? "text-red-500"
                            : "text-muted-foreground"
                      }
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Business Impact Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {businessImpactCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={cn("p-2 rounded-lg transition-transform group-hover:scale-110", stat.bgColor)}>
                  <stat.icon className={cn("h-4 w-4", stat.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                  <span>{stat.subtitle}</span>
                  <div className="flex items-center">
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                    ) : stat.trend === "down" ? (
                      <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                    ) : null}
                    <span
                      className={
                        stat.trend === "up"
                          ? "text-green-500"
                          : stat.trend === "down"
                            ? "text-red-500"
                            : "text-muted-foreground"
                      }
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Lead Funnel Chart */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-blue-500" />
                Lead Conversion Funnel
              </CardTitle>
              <CardDescription>Track leads through your conversion process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnelData||undefined} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="status" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Time-based Performance */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Performance Trends
              </CardTitle>
              <CardDescription>Weekly lead generation and conversion trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeData||undefined}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="newLeads" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="conversions" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Platform Performance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                Platform Comparison
              </CardTitle>
              <CardDescription>Performance across different platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={platformData||undefined}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="platform" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="totalLeads" fill="#8884d8" />
                    <Bar dataKey="conversions" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Lead Sources Pie Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-500" />
                Lead Sources
              </CardTitle>
              <CardDescription>Distribution of leads by source</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sourceData||undefined}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ source, percentage }) => `${source}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sourceData?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Engagement Analytics */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-pink-500" />
              Engagement Analytics
            </CardTitle>
            <CardDescription>Daily engagement trends and interaction types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Engagement Trend */}
              <div className="h-64">
                <h4 className="text-sm font-medium mb-4">Daily Engagement Trend</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={engagementData?.engagementTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="interactions" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Interaction Types */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Interaction Types</h4>
                {engagementData?.interactionsByType.map((interaction, index) => (
                  <div key={interaction.type} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize">{interaction.type}</span>
                      <span className="font-medium">
                        {interaction.count} ({interaction.percentage}%)
                      </span>
                    </div>
                    <Progress value={interaction.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              Business Insights & Actions
            </CardTitle>
            <CardDescription>Recommended actions based on your performance data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <Button className="h-auto p-4 flex-col gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600">
                <Target className="h-6 w-6" />
                <span className="text-sm">Optimize Funnel</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col gap-2 hover:bg-accent/50">
                <TrendingUp className="h-6 w-6" />
                <span className="text-sm">View ROI Report</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col gap-2 hover:bg-accent/50">
                <Users className="h-6 w-6" />
                <span className="text-sm">Segment Leads</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col gap-2 hover:bg-accent/50">
                <BarChart3 className="h-6 w-6" />
                <span className="text-sm">Export Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
