"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, Activity, Clock, Zap } from "lucide-react"

interface UsageData {
  date: string
  requests: number
  errors: number
  avgResponseTime: number
}

interface EndpointUsage {
  endpoint: string
  requests: number
  percentage: number
}

interface UsageAnalyticsProps {
  integrationId: string
  integrationName: string
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function UsageAnalytics({ integrationId, integrationName }: UsageAnalyticsProps) {
  const [usageData, setUsageData] = useState<UsageData[]>([])
  const [endpointData, setEndpointData] = useState<EndpointUsage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Simulate API calls for analytics data
        const [usageResponse, endpointResponse] = await Promise.all([
          fetch(`/api/integrations/${integrationId}/usage-analytics`),
          fetch(`/api/integrations/${integrationId}/endpoint-usage`),
        ])

        const usage = await usageResponse.json()
        const endpoints = await endpointResponse.json()

        setUsageData(usage)
        setEndpointData(endpoints)
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [integrationId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Usage Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalRequests = usageData.reduce((sum, day) => sum + day.requests, 0)
  const totalErrors = usageData.reduce((sum, day) => sum + day.errors, 0)
  const avgResponseTime = usageData.reduce((sum, day) => sum + day.avgResponseTime, 0) / usageData.length
  const errorRate = totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Requests</p>
                <p className="text-2xl font-bold">{totalRequests.toLocaleString()}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Error Rate</p>
                <p className="text-2xl font-bold">{errorRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Response</p>
                <p className="text-2xl font-bold">{avgResponseTime.toFixed(0)}ms</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Peak Day</p>
                <p className="text-2xl font-bold">{Math.max(...usageData.map((d) => d.requests)).toLocaleString()}</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Analytics - {integrationName}</CardTitle>
          <CardDescription>Detailed usage patterns and performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="requests" className="space-y-4">
            <TabsList>
              <TabsTrigger value="requests">Request Volume</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="endpoints">Endpoint Usage</TabsTrigger>
            </TabsList>

            <TabsContent value="requests" className="space-y-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="requests" fill="#0088FE" name="Requests" />
                    <Bar dataKey="errors" fill="#FF8042" name="Errors" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="avgResponseTime"
                      stroke="#00C49F"
                      name="Avg Response Time (ms)"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="endpoints" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={endpointData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name} (${percentage}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="requests"
                      >
                        {endpointData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Endpoint Breakdown</h4>
                  {endpointData.map((endpoint, index) => (
                    <div key={endpoint.endpoint} className="flex items-center justify-between p-2 rounded border">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm font-mono">{endpoint.endpoint}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {endpoint.requests.toLocaleString()} ({endpoint.percentage}%)
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
