"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
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

      </div>
    </div>
  )
}
