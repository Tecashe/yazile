"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, BarChart3, Clock, Zap, CheckCircle, Activity, Download } from "lucide-react"
import type { Integration } from "@/types/integration"

interface IntegrationAnalyticsProps {
  integrations: Integration[]
}

interface AnalyticsData {
  integrationId: string
  dailyRequests: number[]
  responseTimeHistory: number[]
  errorRateHistory: number[]
  uptimeHistory: number[]
  lastUpdated: string
}

export function IntegrationAnalytics({ integrations }: IntegrationAnalyticsProps) {
  const [analyticsData, setAnalyticsData] = useState<Record<string, AnalyticsData>>({})
  const [selectedTimeRange, setSelectedTimeRange] = useState<"24h" | "7d" | "30d">("7d")

  useEffect(() => {
    // Simulate analytics data generation
    const generateAnalyticsData = () => {
      const data: Record<string, AnalyticsData> = {}

      integrations.forEach((integration) => {
        if (integration.isActive) {
          const days = selectedTimeRange === "24h" ? 1 : selectedTimeRange === "7d" ? 7 : 30
          const dataPoints = selectedTimeRange === "24h" ? 24 : days

          data[integration.id] = {
            integrationId: integration.id,
            dailyRequests: Array.from({ length: dataPoints }, () => Math.floor(Math.random() * 1000) + 100),
            responseTimeHistory: Array.from({ length: dataPoints }, () => Math.floor(Math.random() * 500) + 200),
            errorRateHistory: Array.from({ length: dataPoints }, () => Math.random() * 5),
            uptimeHistory: Array.from({ length: dataPoints }, () => 95 + Math.random() * 5),
            lastUpdated: new Date().toISOString(),
          }
        }
      })

      setAnalyticsData(data)
    }

    generateAnalyticsData()
  }, [integrations, selectedTimeRange])

  const calculateTrend = (data: number[]): "up" | "down" | "stable" => {
    if (data.length < 2) return "stable"
    const recent = data.slice(-3).reduce((a, b) => a + b, 0) / 3
    const previous = data.slice(-6, -3).reduce((a, b) => a + b, 0) / 3

    if (recent > previous * 1.05) return "up"
    if (recent < previous * 0.95) return "down"
    return "stable"
  }

  const getTrendIcon = (trend: "up" | "down" | "stable", isGoodTrend = true) => {
    if (trend === "stable") return null

    const isPositive = (trend === "up" && isGoodTrend) || (trend === "down" && !isGoodTrend)

    return trend === "up" ? (
      <TrendingUp className={`h-4 w-4 ${isPositive ? "text-emerald-400" : "text-red-400"}`} />
    ) : (
      <TrendingDown className={`h-4 w-4 ${isPositive ? "text-emerald-400" : "text-red-400"}`} />
    )
  }

  const activeIntegrations = integrations.filter((i) => i.isActive)

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Integration Analytics
              </CardTitle>
              <CardDescription>Performance metrics and usage analytics for your integrations</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Tabs value={selectedTimeRange} onValueChange={(value) => setSelectedTimeRange(value as any)}>
                <TabsList>
                  <TabsTrigger value="24h">24 Hours</TabsTrigger>
                  <TabsTrigger value="7d">7 Days</TabsTrigger>
                  <TabsTrigger value="30d">30 Days</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                <p className="text-2xl font-bold">
                  {Object.values(analyticsData)
                    .reduce((sum, data) => sum + data.dailyRequests.reduce((a, b) => a + b, 0), 0)
                    .toLocaleString()}
                </p>
              </div>
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">
                    {Object.values(analyticsData).length > 0
                      ? Math.round(
                          Object.values(analyticsData).reduce(
                            (sum, data) =>
                              sum +
                              data.responseTimeHistory.reduce((a, b) => a + b, 0) / data.responseTimeHistory.length,
                            0,
                          ) / Object.values(analyticsData).length,
                        )
                      : 0}
                    ms
                  </p>
                  {getTrendIcon("down", true)}
                </div>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-emerald-400">
                    {Object.values(analyticsData).length > 0
                      ? (
                          100 -
                          Object.values(analyticsData).reduce(
                            (sum, data) =>
                              sum + data.errorRateHistory.reduce((a, b) => a + b, 0) / data.errorRateHistory.length,
                            0,
                          ) /
                            Object.values(analyticsData).length
                        ).toFixed(1)
                      : 0}
                    %
                  </p>
                  {getTrendIcon("up", true)}
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Uptime</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-emerald-400">
                    {Object.values(analyticsData).length > 0
                      ? (
                          Object.values(analyticsData).reduce(
                            (sum, data) =>
                              sum + data.uptimeHistory.reduce((a, b) => a + b, 0) / data.uptimeHistory.length,
                            0,
                          ) / Object.values(analyticsData).length
                        ).toFixed(1)
                      : 0}
                    %
                  </p>
                  {getTrendIcon("up", true)}
                </div>
              </div>
              <Zap className="h-8 w-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Per-Integration Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeIntegrations.map((integration) => {
          const data = analyticsData[integration.id]
          if (!data) return null

          const requestTrend = calculateTrend(data.dailyRequests)
          const responseTrend = calculateTrend(data.responseTimeHistory)
          const errorTrend = calculateTrend(data.errorRateHistory)

          return (
            <Card key={integration.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{integration.name}</CardTitle>
                    <CardDescription>{integration.type}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Request Volume */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Request Volume</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-mono">
                        {data.dailyRequests.reduce((a, b) => a + b, 0).toLocaleString()}
                      </span>
                      {getTrendIcon(requestTrend, true)}
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                      style={{ width: "75%" }}
                    />
                  </div>
                </div>

                {/* Response Time */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Avg Response Time</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-mono">
                        {Math.round(
                          data.responseTimeHistory.reduce((a, b) => a + b, 0) / data.responseTimeHistory.length,
                        )}
                        ms
                      </span>
                      {getTrendIcon(responseTrend, false)}
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                      style={{ width: "85%" }}
                    />
                  </div>
                </div>

                {/* Error Rate */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Error Rate</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-mono">
                        {(data.errorRateHistory.reduce((a, b) => a + b, 0) / data.errorRateHistory.length).toFixed(1)}%
                      </span>
                      {getTrendIcon(errorTrend, false)}
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full"
                      style={{ width: "15%" }}
                    />
                  </div>
                </div>

                {/* Rate Limiting Info */}
                {integration.rateLimit && (
                  <div className="pt-2 border-t border-border/50">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Rate Limit</span>
                      <span className="font-mono">
                        {integration.rateLimit.requests}/{integration.rateLimit.window}
                      </span>
                    </div>
                    {integration.rateLimit.remaining !== undefined && (
                      <div className="mt-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Remaining</span>
                          <span>{integration.rateLimit.remaining}</span>
                        </div>
                        <Progress
                          value={(integration.rateLimit.remaining / integration.rateLimit.requests) * 100}
                          className="h-1 mt-1"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Usage Quota */}
                {integration.usageQuota && (
                  <div className="pt-2 border-t border-border/50">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Usage Quota</span>
                      <span className="font-mono">
                        {integration.usageQuota.used.toLocaleString()}/{integration.usageQuota.limit.toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-1">
                      <Progress
                        value={(integration.usageQuota.used / integration.usageQuota.limit) * 100}
                        className="h-2"
                      />
                      <div className="flex items-center justify-between text-xs mt-1">
                        <span className="text-muted-foreground">
                          {((integration.usageQuota.used / integration.usageQuota.limit) * 100).toFixed(1)}% used
                        </span>
                        {integration.usageQuota.resetAt && (
                          <span className="text-muted-foreground">
                            Resets {new Date(integration.usageQuota.resetAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
