// "use client"

// import { useEffect, useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts"
// import {
//   Zap,
//   Users,
//   Target,
//   Clock,
//   ArrowUpRight,
//   ArrowDownRight,
//   TrendingUp,
//   DollarSign,
//   Timer,
//   MessageSquare,
//   Filter,
// } from "lucide-react"
// import { motion } from "framer-motion"
// import { cn } from "@/lib/utils"
// import {
//   getEnhancedDashboardStats,
//   getLeadFunnelAnalytics,
//   getTimeBasedAnalytics,
//   getPlatformPerformance,
//   getLeadSourceAnalytics,
//   getEngagementMetrics,
//   getBusinessImpactMetrics,
// } from "@/actions/dashboard/d-actions"

// // Types for the enhanced data
// type EnhancedStats = Awaited<ReturnType<typeof getEnhancedDashboardStats>>
// type FunnelData = Awaited<ReturnType<typeof getLeadFunnelAnalytics>>
// type TimeData = Awaited<ReturnType<typeof getTimeBasedAnalytics>>
// type PlatformData = Awaited<ReturnType<typeof getPlatformPerformance>>
// type SourceData = Awaited<ReturnType<typeof getLeadSourceAnalytics>>
// type EngagementData = Awaited<ReturnType<typeof getEngagementMetrics>>
// type BusinessImpactData = Awaited<ReturnType<typeof getBusinessImpactMetrics>>


// export function EnhancedDashboardCards() {
//   const [stats, setStats] = useState<EnhancedStats | null>(null)
//   const [funnelData, setFunnelData] = useState<FunnelData | null>(null)
//   const [timeData, setTimeData] = useState<TimeData | null>(null)
//   const [platformData, setPlatformData] = useState<PlatformData | null>(null)
//   const [sourceData, setSourceData] = useState<SourceData | null>(null)
//   const [engagementData, setEngagementData] = useState<EngagementData | null>(null)
//   const [businessImpact, setBusinessImpact] = useState<BusinessImpactData | null>(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const [
//           statsData,
//           funnelAnalytics,
//           timeAnalytics,
//           platformAnalytics,
//           sourceAnalytics,
//           engagementAnalytics,
//           businessImpactData,
//         ] = await Promise.all([
//           getEnhancedDashboardStats(),
//           getLeadFunnelAnalytics(),
//           getTimeBasedAnalytics(),
//           getPlatformPerformance(),
//           getLeadSourceAnalytics(),
//           getEngagementMetrics(),
//           getBusinessImpactMetrics(),
//         ])

//         setStats(statsData)
//         setFunnelData(funnelAnalytics)
//         setTimeData(timeAnalytics)
//         setPlatformData(platformAnalytics)
//         setSourceData(sourceAnalytics)
//         setEngagementData(engagementAnalytics)
//         setBusinessImpact(businessImpactData)
//       } catch (error) {
//         console.error("Error fetching enhanced dashboard data:", error)
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
//           {[...Array(8)].map((_, i) => (
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

//   const enhancedStatCards = [
//     {
//       title: "Total Leads",
//       value: stats.totalLeads.toLocaleString(),
//       subtitle: `${stats.leadsLast30Days} this month`,
//       change: `${stats.leadGrowthRate > 0 ? "+" : ""}${stats.leadGrowthRate}%`,
//       trend: stats.leadGrowthRate > 0 ? "up" : stats.leadGrowthRate < 0 ? "down" : "neutral",
//       icon: Users,
//       color: "text-blue-500",
//       bgColor: "bg-blue-500/10",
//     },
//     {
//       title: "Conversion Rate",
//       value: `${stats.conversionRate}%`,
//       subtitle: `${stats.convertedLeads} converted`,
//       change: stats.qualificationRate > 0 ? `${stats.qualificationRate}% qualified` : "No qualified leads",
//       trend: stats.conversionRate > 15 ? "up" : "down",
//       icon: Target,
//       color: "text-green-500",
//       bgColor: "bg-green-500/10",
//     },
//     {
//       title: "Avg. Time to Convert",
//       value: `${stats.avgTimeToConversion} days`,
//       subtitle: "Lead velocity",
//       change: stats.avgTimeToConversion < 7 ? "Fast" : stats.avgTimeToConversion < 14 ? "Good" : "Slow",
//       trend: stats.avgTimeToConversion < 7 ? "up" : "down",
//       icon: Clock,
//       color: "text-purple-500",
//       bgColor: "bg-purple-500/10",
//     },
//     {
//       title: "Automation Efficiency",
//       value: stats.avgLeadsPerAutomation.toString(),
//       subtitle: "Leads per automation",
//       change: `${stats.avgConversionsPerAutomation} conversions avg`,
//       trend: stats.avgLeadsPerAutomation > 10 ? "up" : "neutral",
//       icon: Zap,
//       color: "text-amber-500",
//       bgColor: "bg-amber-500/10",
//     },
//   ]

//   const businessImpactCards = [
//     {
//       title: "Estimated Lead Value",
//       value: `$${businessImpact?.totalLeadValue.toLocaleString() || 0}`,
//       subtitle: "Total generated value",
//       change: `$${businessImpact?.avgLeadValue || 0} per lead`,
//       trend: "up",
//       icon: DollarSign,
//       color: "text-emerald-500",
//       bgColor: "bg-emerald-500/10",
//     },
//     {
//       title: "Monthly ROI",
//       value: `${businessImpact?.monthlyROI || 0}%`,
//       subtitle: `$${businessImpact?.monthlyCost || 0} monthly cost`,
//       change: `$${businessImpact?.costPerLead || 0} per lead`,
//       trend: (businessImpact?.monthlyROI || 0) > 100 ? "up" : "down",
//       icon: TrendingUp,
//       color: "text-green-500",
//       bgColor: "bg-green-500/10",
//     },
//     {
//       title: "Time Saved",
//       value: `${businessImpact?.timeSavedHours || 0}h`,
//       subtitle: "Automation efficiency",
//       change: `${businessImpact?.automatedInteractions || 0} interactions`,
//       trend: "up",
//       icon: Timer,
//       color: "text-blue-500",
//       bgColor: "bg-blue-500/10",
//     },
//     {
//       title: "Engagement Rate",
//       value: `${engagementData?.totalInteractions || 0}`,
//       subtitle: "Total interactions",
//       change: "Last 30 days",
//       trend: "up",
//       icon: MessageSquare,
//       color: "text-purple-500",
//       bgColor: "bg-purple-500/10",
//     },
//   ]

//   return (
//     <div className="space-y-6">
//       {/* Enhanced Stats Grid */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         {enhancedStatCards.map((stat, index) => (
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
//             </Card>
//           </motion.div>
//         ))}
//       </div>

//       {/* Business Impact Metrics */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         {businessImpactCards.map((stat, index) => (
//           <motion.div
//             key={stat.title}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4 + index * 0.1 }}
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
//             </Card>
//           </motion.div>
//         ))}
//       </div>

//       {/* Charts Grid */}
//       <div className="grid gap-6 lg:grid-cols-2">
//         {/* Lead Funnel Chart */}
//         <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
//           <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Filter className="h-5 w-5 text-blue-500" />
//                 Lead Conversion Funnel
//               </CardTitle>
//               <CardDescription>Track leads through your conversion process</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={funnelData||undefined} layout="horizontal">
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis type="number" />
//                     <YAxis dataKey="status" type="category" width={80} />
//                     <Tooltip />
//                     <Bar dataKey="count" fill="#8884d8" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Time-based Performance */}
//         <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}>
//           <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <TrendingUp className="h-5 w-5 text-green-500" />
//                 Performance Trends
//               </CardTitle>
//               <CardDescription>Weekly lead generation and conversion trends</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={timeData||undefined}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="week" />
//                     <YAxis />
//                     <Tooltip />
//                     <Line type="monotone" dataKey="newLeads" stroke="#8884d8" strokeWidth={2} />
//                     <Line type="monotone" dataKey="conversions" stroke="#82ca9d" strokeWidth={2} />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>

//       </div>
//     </div>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Zap,
  Users,
  Target,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  DollarSign,
  Timer,
  MessageSquare,
  Filter,
  BarChart3,
} from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  getEnhancedDashboardStats,
  getLeadFunnelAnalytics,
  getTimeBasedAnalytics,
  getEngagementMetrics,
  getBusinessImpactMetrics,
} from "@/actions/dashboard/d-actions"

// Types for the enhanced data
type EnhancedStats = Awaited<ReturnType<typeof getEnhancedDashboardStats>>
type FunnelData = Awaited<ReturnType<typeof getLeadFunnelAnalytics>>
type TimeData = Awaited<ReturnType<typeof getTimeBasedAnalytics>>
type EngagementData = Awaited<ReturnType<typeof getEngagementMetrics>>
type BusinessImpactData = Awaited<ReturnType<typeof getBusinessImpactMetrics>>

export function EnhancedDashboardCards() {
  const [stats, setStats] = useState<EnhancedStats | null>(null)
  const [funnelData, setFunnelData] = useState<FunnelData | null>(null)
  const [timeData, setTimeData] = useState<TimeData | null>(null)
  const [engagementData, setEngagementData] = useState<EngagementData | null>(null)
  const [businessImpact, setBusinessImpact] = useState<BusinessImpactData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsData, funnelAnalytics, timeAnalytics, engagementAnalytics, businessImpactData] = await Promise.all([
          getEnhancedDashboardStats(),
          getLeadFunnelAnalytics(),
          getTimeBasedAnalytics(),
          getEngagementMetrics(),
          getBusinessImpactMetrics(),
        ])

        setStats(statsData)
        setFunnelData(funnelAnalytics)
        setTimeData(timeAnalytics)
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
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: "Conversion Rate",
      value: `${stats.conversionRate}%`,
      subtitle: `${stats.convertedLeads} converted`,
      change: stats.qualificationRate > 0 ? `${stats.qualificationRate}% qualified` : "No qualified leads",
      trend: stats.conversionRate > 15 ? "up" : "down",
      icon: Target,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Avg. Time to Convert",
      value: `${stats.avgTimeToConversion} days`,
      subtitle: "Lead velocity",
      change: stats.avgTimeToConversion < 7 ? "Fast" : stats.avgTimeToConversion < 14 ? "Good" : "Slow",
      trend: stats.avgTimeToConversion < 7 ? "up" : "down",
      icon: Clock,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      title: "Automation Efficiency",
      value: stats.avgLeadsPerAutomation.toString(),
      subtitle: "Leads per automation",
      change: `${stats.avgConversionsPerAutomation} conversions avg`,
      trend: stats.avgLeadsPerAutomation > 10 ? "up" : "neutral",
      icon: Zap,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
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
      color: "text-chart-5",
      bgColor: "bg-chart-5/10",
    },
    {
      title: "Monthly ROI",
      value: `${businessImpact?.monthlyROI || 0}%`,
      subtitle: `$${businessImpact?.monthlyCost || 0} monthly cost`,
      change: `$${businessImpact?.costPerLead || 0} per lead`,
      trend: (businessImpact?.monthlyROI || 0) > 100 ? "up" : "down",
      icon: TrendingUp,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Time Saved",
      value: `${businessImpact?.timeSavedHours || 0}h`,
      subtitle: "Automation efficiency",
      change: `${businessImpact?.automatedInteractions || 0} interactions`,
      trend: "up",
      icon: Timer,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: "Engagement Rate",
      value: `${engagementData?.totalInteractions || 0}`,
      subtitle: "Total interactions",
      change: "Last 30 days",
      trend: "up",
      icon: MessageSquare,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
  ]

  // Simple funnel visualization component
  const FunnelVisualization = ({ data }: { data: FunnelData | null }) => {
    if (!data || data.length === 0) return <div className="text-muted-foreground">No funnel data available</div>

    const maxCount = Math.max(...data.map((item) => item.count))

    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={item.status} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">{item.status}</span>
              <span className="text-sm text-muted-foreground">{item.count}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <motion.div
                className={cn(
                  "h-2 rounded-full transition-all duration-1000",
                  index === 0
                    ? "bg-chart-1"
                    : index === 1
                      ? "bg-chart-2"
                      : index === 2
                        ? "bg-chart-3"
                        : index === 3
                          ? "bg-chart-4"
                          : "bg-chart-5",
                )}
                initial={{ width: 0 }}
                animate={{ width: `${(item.count / maxCount) * 100}%` }}
                transition={{ delay: index * 0.2 }}
              />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Simple trend visualization component
  const TrendVisualization = ({ data }: { data: TimeData | null }) => {
    if (!data || data.length === 0) return <div className="text-muted-foreground">No trend data available</div>

    const maxLeads = Math.max(...data.map((item) => item.newLeads))
    const maxConversions = Math.max(...data.map((item) => item.conversions))

    return (
      <div className="space-y-4">
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-chart-1"></div>
            <span className="text-muted-foreground">New Leads</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-chart-2"></div>
            <span className="text-muted-foreground">Conversions</span>
          </div>
        </div>

        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={item.week} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">Week {item.week}</span>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>{item.newLeads} leads</span>
                  <span>{item.conversions} conversions</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="w-full bg-muted rounded-full h-1.5">
                  <motion.div
                    className="h-1.5 rounded-full bg-chart-1"
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.newLeads / maxLeads) * 100}%` }}
                    transition={{ delay: index * 0.1 }}
                  />
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <motion.div
                    className="h-1.5 rounded-full bg-chart-2"
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.conversions / maxConversions) * 100}%` }}
                    transition={{ delay: index * 0.1 + 0.05 }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

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
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                  <span>{stat.subtitle}</span>
                  <div className="flex items-center">
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="mr-1 h-3 w-3 text-chart-2" />
                    ) : stat.trend === "down" ? (
                      <ArrowDownRight className="mr-1 h-3 w-3 text-destructive" />
                    ) : null}
                    <span
                      className={
                        stat.trend === "up"
                          ? "text-chart-2"
                          : stat.trend === "down"
                            ? "text-destructive"
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
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                  <span>{stat.subtitle}</span>
                  <div className="flex items-center">
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="mr-1 h-3 w-3 text-chart-2" />
                    ) : stat.trend === "down" ? (
                      <ArrowDownRight className="mr-1 h-3 w-3 text-destructive" />
                    ) : null}
                    <span
                      className={
                        stat.trend === "up"
                          ? "text-chart-2"
                          : stat.trend === "down"
                            ? "text-destructive"
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

      {/* Simplified Data Visualizations */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Lead Funnel Visualization */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Filter className="h-5 w-5 text-chart-1" />
                Lead Conversion Funnel
              </CardTitle>
              <CardDescription>Track leads through your conversion process</CardDescription>
            </CardHeader>
            <CardContent>
              <FunnelVisualization data={funnelData} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Time-based Performance */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <BarChart3 className="h-5 w-5 text-chart-2" />
                Performance Trends
              </CardTitle>
              <CardDescription>Weekly lead generation and conversion trends</CardDescription>
            </CardHeader>
            <CardContent>
              <TrendVisualization data={timeData} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
