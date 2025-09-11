"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

interface RateLimit {
  limit: number
  remaining: number
  reset: number
  window: string
}

interface UsageQuota {
  used: number
  limit: number
  period: string
  resetDate: string
}

interface RateLimitData {
  integrationId: string
  rateLimit: RateLimit
  quota: UsageQuota
  status: "healthy" | "warning" | "critical"
  lastUpdated: string
}

interface RateLimitMonitorProps {
  integrationId: string
  integrationName: string
}

export function RateLimitMonitor({ integrationId, integrationName }: RateLimitMonitorProps) {
  const [rateLimitData, setRateLimitData] = useState<RateLimitData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRateLimitData = async () => {
      try {
        // Simulate API call to get rate limit data
        const response = await fetch(`/api/integrations/${integrationId}/rate-limits`)
        const data = await response.json()
        setRateLimitData(data)
      } catch (error) {
        console.error("Failed to fetch rate limit data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRateLimitData()
    const interval = setInterval(fetchRateLimitData, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [integrationId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Rate Limits & Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-2 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!rateLimitData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Rate Limits & Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Unable to load rate limit information for {integrationName}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const { rateLimit, quota, status } = rateLimitData
  const rateLimitPercentage = ((rateLimit.limit - rateLimit.remaining) / rateLimit.limit) * 100
  const quotaPercentage = (quota.used / quota.limit) * 100

  const getStatusIcon = () => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "critical":
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800 border-green-200"
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Rate Limits & Usage
          </div>
          <Badge className={getStatusColor()}>
            {getStatusIcon()}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </CardTitle>
        <CardDescription>Monitor API usage and rate limits for {integrationName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rate Limit Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Rate Limit</h4>
            <span className="text-sm text-muted-foreground">
              {rateLimit.remaining}/{rateLimit.limit} remaining
            </span>
          </div>
          <Progress value={rateLimitPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Window: {rateLimit.window}</span>
            <span>Resets: {new Date(rateLimit.reset * 1000).toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Usage Quota Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Usage Quota</h4>
            <span className="text-sm text-muted-foreground">
              {quota.used.toLocaleString()}/{quota.limit.toLocaleString()} used
            </span>
          </div>
          <Progress value={quotaPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Period: {quota.period}</span>
            <span>Resets: {new Date(quota.resetDate).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Warnings */}
        {status === "warning" && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Approaching rate limits. Consider reducing API call frequency.</AlertDescription>
          </Alert>
        )}

        {status === "critical" && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Rate limit exceeded or quota nearly exhausted. API calls may be throttled.
            </AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-muted-foreground">
          Last updated: {new Date(rateLimitData.lastUpdated).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  )
}
