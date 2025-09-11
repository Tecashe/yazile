"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  Loader2,
  Wifi,
  WifiOff,
  Timer,
  BarChart3,
  Eye,
} from "lucide-react"
import type { Integration } from "@/types/integration"

interface HealthMetrics {
  status: "healthy" | "warning" | "error" | "unknown"
  responseTime: number
  uptime: number
  lastCheck: string
  errorRate: number
  successRate: number
  totalRequests: number
  avgResponseTime: number
}

interface HealthCheck {
  timestamp: string
  status: "success" | "failure"
  responseTime: number
  error?: string
  endpoint: string
}

interface HealthMonitoringDashboardProps {
  integrations: Integration[]
  onRefreshHealth: (integrationId: string) => Promise<void>
}

export function HealthMonitoringDashboard({ integrations, onRefreshHealth }: HealthMonitoringDashboardProps) {
  const [healthMetrics, setHealthMetrics] = useState<Record<string, HealthMetrics>>({})
  const [healthHistory, setHealthHistory] = useState<Record<string, HealthCheck[]>>({})
  const [isRefreshing, setIsRefreshing] = useState<Set<string>>(new Set())
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Auto-refresh health checks every 5 minutes
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(
      () => {
        integrations.forEach((integration) => {
          if (integration.isActive) {
            performHealthCheck(integration.id)
          }
        })
      },
      5 * 60 * 1000,
    ) // 5 minutes

    return () => clearInterval(interval)
  }, [integrations, autoRefresh])

  // Initial health check on mount
  useEffect(() => {
    integrations.forEach((integration) => {
      if (integration.isActive) {
        performHealthCheck(integration.id)
      }
    })
  }, [integrations])

  const performHealthCheck = async (integrationId: string) => {
    const integration = integrations.find((i) => i.id === integrationId)
    if (!integration) return

    try {
      setIsRefreshing((prev) => new Set(prev).add(integrationId))

      // Simulate health check - in production, this would call actual endpoints
      const startTime = Date.now()
      const healthResult = await simulateHealthCheck(integration)
      const responseTime = Date.now() - startTime

      const healthCheck: HealthCheck = {
        timestamp: new Date().toISOString(),
        status: healthResult.success ? "success" : "failure",
        responseTime,
        error: healthResult.error,
        endpoint: healthResult.endpoint,
      }

      // Update health history
      setHealthHistory((prev) => ({
        ...prev,
        [integrationId]: [...(prev[integrationId] || []).slice(-49), healthCheck], // Keep last 50 checks
      }))

      // Calculate metrics
      const history = [...(healthHistory[integrationId] || []), healthCheck]
      const recentChecks = history.slice(-20) // Last 20 checks for metrics
      const successCount = recentChecks.filter((c) => c.status === "success").length
      const totalChecks = recentChecks.length

      const metrics: HealthMetrics = {
        status: healthResult.success ? "healthy" : "error",
        responseTime,
        uptime: (successCount / totalChecks) * 100,
        lastCheck: new Date().toISOString(),
        errorRate: ((totalChecks - successCount) / totalChecks) * 100,
        successRate: (successCount / totalChecks) * 100,
        totalRequests: history.length,
        avgResponseTime: recentChecks.reduce((sum, c) => sum + c.responseTime, 0) / recentChecks.length,
      }

      setHealthMetrics((prev) => ({
        ...prev,
        [integrationId]: metrics,
      }))
    } catch (error) {
      console.error(`Health check failed for ${integrationId}:`, error)
    } finally {
      setIsRefreshing((prev) => {
        const newSet = new Set(prev)
        newSet.delete(integrationId)
        return newSet
      })
    }
  }

  const simulateHealthCheck = async (
    integration: Integration,
  ): Promise<{
    success: boolean
    error?: string
    endpoint: string
  }> => {
    // Simulate different response times and success rates based on integration type
    const delay = Math.random() * 2000 + 500 // 500-2500ms
    await new Promise((resolve) => setTimeout(resolve, delay))

    const successRates: Record<string, number> = {
      STRIPE: 0.95,
      PAYPAL: 0.92,
      SHOPIFY: 0.88,
      CALENDLY: 0.9,
      HUBSPOT: 0.93,
      SALESFORCE: 0.85,
      ZOOM: 0.87,
    }

    const successRate = successRates[integration.type] || 0.9
    const isSuccess = Math.random() < successRate

    const endpoints: Record<string, string> = {
      STRIPE: "/v1/account",
      PAYPAL: "/v1/oauth2/token",
      SHOPIFY: "/admin/api/shop.json",
      CALENDLY: "/users/me",
      HUBSPOT: "/contacts/v1/lists",
      SALESFORCE: "/services/data/v52.0/",
      ZOOM: "/v2/users/me",
    }

    return {
      success: isSuccess,
      error: isSuccess ? undefined : "Connection timeout or authentication failed",
      endpoint: endpoints[integration.type] || "/health",
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
      case "warning":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
      case "error":
        return "text-red-400 bg-red-500/10 border-red-500/20"
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      case "error":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const activeIntegrations = integrations.filter((i) => i.isActive)
  const healthyCount = activeIntegrations.filter((i) => healthMetrics[i.id]?.status === "healthy").length
  const warningCount = activeIntegrations.filter((i) => healthMetrics[i.id]?.status === "warning").length
  const errorCount = activeIntegrations.filter((i) => healthMetrics[i.id]?.status === "error").length

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Active</p>
                <p className="text-2xl font-bold">{activeIntegrations.length}</p>
              </div>
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Healthy</p>
                <p className="text-2xl font-bold text-emerald-400">{healthyCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Warnings</p>
                <p className="text-2xl font-bold text-yellow-400">{warningCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Errors</p>
                <p className="text-2xl font-bold text-red-400">{errorCount}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Status Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Integration Health Status
              </CardTitle>
              <CardDescription>Real-time monitoring of all active integrations</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setAutoRefresh(!autoRefresh)}>
                {autoRefresh ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                {autoRefresh ? "Auto" : "Manual"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  activeIntegrations.forEach((integration) => {
                    performHealthCheck(integration.id)
                  })
                }}
                disabled={isRefreshing.size > 0}
              >
                {isRefreshing.size > 0 ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Refresh All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeIntegrations.map((integration) => {
              const metrics = healthMetrics[integration.id]
              const isRefreshingThis = isRefreshing.has(integration.id)

              return (
                <Card key={integration.id} className="border-border/50">
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {/* Integration Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Activity className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{integration.name}</p>
                            <p className="text-xs text-muted-foreground">{integration.type}</p>
                          </div>
                        </div>
                        {metrics && (
                          <Badge variant="secondary" className={getStatusColor(metrics.status)}>
                            {getStatusIcon(metrics.status)}
                            <span className="ml-1 capitalize">{metrics.status}</span>
                          </Badge>
                        )}
                      </div>

                      {/* Metrics */}
                      {metrics && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Response Time</span>
                            <span className="font-mono">{metrics.responseTime}ms</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Uptime</span>
                            <span className="font-mono">{metrics.uptime.toFixed(1)}%</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Success Rate</span>
                            <span className="font-mono">{metrics.successRate.toFixed(1)}%</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Last Check</span>
                            <span className="text-xs">{new Date(metrics.lastCheck).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => performHealthCheck(integration.id)}
                          disabled={isRefreshingThis}
                          className="flex-1"
                        >
                          {isRefreshingThis ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <RefreshCw className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedIntegration(integration.id)}
                          className="flex-1"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed View Modal/Panel */}
      {selectedIntegration && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {integrations.find((i) => i.id === selectedIntegration)?.name} - Detailed Health Metrics
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => setSelectedIntegration(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="metrics" className="space-y-4">
              <TabsList>
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
              </TabsList>

              <TabsContent value="metrics" className="space-y-4">
                {healthMetrics[selectedIntegration] && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Timer className="h-4 w-4 text-blue-400" />
                            <span className="font-medium">Response Times</span>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Current:</span>
                              <span className="font-mono">{healthMetrics[selectedIntegration].responseTime}ms</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Average:</span>
                              <span className="font-mono">
                                {healthMetrics[selectedIntegration].avgResponseTime.toFixed(0)}ms
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-emerald-400" />
                            <span className="font-medium">Success Metrics</span>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Success Rate:</span>
                              <span className="font-mono">
                                {healthMetrics[selectedIntegration].successRate.toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Error Rate:</span>
                              <span className="font-mono">
                                {healthMetrics[selectedIntegration].errorRate.toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Total Requests:</span>
                              <span className="font-mono">{healthMetrics[selectedIntegration].totalRequests}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {healthHistory[selectedIntegration]
                    ?.slice()
                    .reverse()
                    .map((check, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          {check.status === "success" ? (
                            <CheckCircle className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-400" />
                          )}
                          <div>
                            <p className="text-sm font-medium">
                              {check.status === "success" ? "Health Check Passed" : "Health Check Failed"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(check.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-mono">{check.responseTime}ms</p>
                          {check.error && <p className="text-xs text-red-400">{check.error}</p>}
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="alerts" className="space-y-4">
                <Alert className="border-yellow-500/20 bg-yellow-500/5">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <AlertDescription className="text-yellow-600">
                    <strong>Alert Configuration</strong>
                    <br />
                    Set up automated alerts for health check failures, high response times, and downtime.
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
