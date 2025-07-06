"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, AlertTriangle, Target, Activity, BarChart3, PieChart, LineChart } from "lucide-react"
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
} from "recharts"

interface DetailedSentimentModalProps {
  automationId: string
  trigger: React.ReactNode
}

interface SentimentStats {
  basicStats: Array<{
    name: string
    value: number
    color: string
  }>
  advanced: {
    totalAnalyses: number
    averageConfidence: number
    riskDistribution: {
      high: number
      medium: number
      low: number
    }
    conversionMetrics: {
      advocates: number
      atRisk: number
      neutral: number
      conversionRate: number
      churnRisk: number
    }
    recentTrend: Array<{
      sentiment: string
      confidence: number
      date: string
    }>
  }
}

export function DetailedSentimentModal({ automationId, trigger }: DetailedSentimentModalProps) {
  const [stats, setStats] = useState<SentimentStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const fetchStats = async () => {
    if (!open) return

    setLoading(true)
    try {
      const response = await fetch(`/api/sentiment-stats/${automationId}`)
      if (response.ok) {
        const data = await response.json()
        setStats(data.data)
      }
    } catch (error) {
      console.error("Error fetching detailed sentiment stats:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [open, automationId])

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "#EF4444"
      case "medium":
        return "#F59E0B"
      case "low":
        return "#10B981"
      default:
        return "#6B7280"
    }
  }

  const getConversionInsight = (stats: SentimentStats) => {
    const { conversionRate, churnRisk } = stats.advanced.conversionMetrics

    if (conversionRate > 60) {
      return {
        status: "Excellent",
        message: "Your conversations are highly effective at building positive relationships",
        color: "text-green-600",
        icon: TrendingUp,
      }
    } else if (conversionRate > 30) {
      return {
        status: "Good",
        message: "Most conversations are going well, with room for improvement",
        color: "text-blue-600",
        icon: Activity,
      }
    } else if (churnRisk > 40) {
      return {
        status: "At Risk",
        message: "High churn risk detected - immediate attention needed",
        color: "text-red-600",
        icon: AlertTriangle,
      }
    } else {
      return {
        status: "Neutral",
        message: "Conversations are balanced but could be more engaging",
        color: "text-yellow-600",
        icon: TrendingDown,
      }
    }
  }

  const riskData = stats
    ? [
        { name: "Low Risk", value: stats.advanced.riskDistribution.low, color: "#10B981" },
        { name: "Medium Risk", value: stats.advanced.riskDistribution.medium, color: "#F59E0B" },
        { name: "High Risk", value: stats.advanced.riskDistribution.high, color: "#EF4444" },
      ]
    : []

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Detailed Sentiment Analysis</span>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : stats ? (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="conversion">Lead Conversion</TabsTrigger>
              <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.advanced.totalAnalyses}</div>
                    <p className="text-xs text-muted-foreground">Last 30 days</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{(stats.advanced.averageConfidence * 100).toFixed(1)}%</div>
                    <Progress value={stats.advanced.averageConfidence * 100} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sentiment Distribution</CardTitle>
                    <PieChart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {stats.basicStats.map((stat) => (
                        <div key={stat.name} className="flex items-center justify-between">
                          <span className="text-sm">{stat.name}</span>
                          <Badge variant="outline" style={{ color: stat.color }}>
                            {stat.value}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="conversion" className="space-y-4">
              {(() => {
                const insight = getConversionInsight(stats)
                const IconComponent = insight.icon
                return (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <IconComponent className={`w-5 h-5 ${insight.color}`} />
                        <span>Lead Conversion Analysis</span>
                      </CardTitle>
                      <CardDescription className={insight.color}>
                        Status: {insight.status} - {insight.message}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">Conversion Rate</span>
                              <span className="text-2xl font-bold text-green-600">
                                {stats.advanced.conversionMetrics.conversionRate}%
                              </span>
                            </div>
                            <Progress value={stats.advanced.conversionMetrics.conversionRate} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-1">
                              {stats.advanced.conversionMetrics.advocates} out of {stats.advanced.totalAnalyses}{" "}
                              conversations
                            </p>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">Churn Risk</span>
                              <span className="text-2xl font-bold text-red-600">
                                {stats.advanced.conversionMetrics.churnRisk}%
                              </span>
                            </div>
                            <Progress value={stats.advanced.conversionMetrics.churnRisk} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-1">
                              {stats.advanced.conversionMetrics.atRisk} conversations at risk
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-medium">Customer Journey Distribution</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 rounded bg-green-50 border border-green-200">
                              <span className="text-sm text-green-800">Advocates</span>
                              <Badge className="bg-green-100 text-green-800">
                                {stats.advanced.conversionMetrics.advocates}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded bg-gray-50 border border-gray-200">
                              <span className="text-sm text-gray-800">Neutral</span>
                              <Badge className="bg-gray-100 text-gray-800">
                                {stats.advanced.conversionMetrics.neutral}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded bg-red-50 border border-red-200">
                              <span className="text-sm text-red-800">At Risk</span>
                              <Badge className="bg-red-100 text-red-800">
                                {stats.advanced.conversionMetrics.atRisk}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })()}

              <Card>
                <CardHeader>
                  <CardTitle>Actionable Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.advanced.conversionMetrics.conversionRate < 30 && (
                      <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                        <p className="text-sm text-yellow-800">
                          <strong>Recommendation:</strong> Consider reviewing your automation responses to be more
                          engaging and personalized.
                        </p>
                      </div>
                    )}
                    {stats.advanced.conversionMetrics.churnRisk > 30 && (
                      <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                        <p className="text-sm text-red-800">
                          <strong>Urgent:</strong> High churn risk detected. Review negative conversations and implement
                          immediate follow-up strategies.
                        </p>
                      </div>
                    )}
                    {stats.advanced.conversionMetrics.conversionRate > 50 && (
                      <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                        <p className="text-sm text-green-800">
                          <strong>Great job!</strong> Your automation is performing well. Consider scaling similar
                          strategies to other automations.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="risk" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Level Distribution</CardTitle>
                  <CardDescription>Analysis of conversation risk levels over the last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={riskData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {riskData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-red-200 bg-red-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-red-800">High Risk</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">{stats.advanced.riskDistribution.high}</div>
                    <p className="text-xs text-red-600">Immediate attention needed</p>
                  </CardContent>
                </Card>

                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-yellow-800">Medium Risk</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">{stats.advanced.riskDistribution.medium}</div>
                    <p className="text-xs text-yellow-600">Monitor closely</p>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-green-800">Low Risk</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{stats.advanced.riskDistribution.low}</div>
                    <p className="text-xs text-green-600">Performing well</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <LineChart className="w-5 h-5" />
                    <span>Recent Sentiment Trend</span>
                  </CardTitle>
                  <CardDescription>Sentiment analysis results from the last 10 conversations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={stats.advanced.recentTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 1]} />
                        <Tooltip
                          formatter={(value, name) => [`${((value as number) * 100).toFixed(1)}%`, "Confidence"]}
                          labelFormatter={(label) => `Date: ${label}`}
                        />
                        <Line
                          type="monotone"
                          dataKey="confidence"
                          stroke="#8884d8"
                          strokeWidth={2}
                          dot={{ fill: "#8884d8" }}
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No sentiment data available yet.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
