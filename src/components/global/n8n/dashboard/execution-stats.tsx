"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Calendar, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react"
import { format, subDays } from "date-fns"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ExecutionStatsProps {
  userId: string
  period?: "day" | "week" | "month" | "year"
}

interface ExecutionStats {
  period: string
  totalExecutions: number
  successfulExecutions: number
  failedExecutions: number
  averageDuration: number
  executionTrend: number // percentage change from previous period
  successRateTrend: number // percentage change from previous period
  dailyStats: Array<{
    date: string
    totalExecutions: number
    successfulExecutions: number
    failedExecutions: number
  }>
}

export function ExecutionStats({ userId, period: initialPeriod = "week" }: ExecutionStatsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
  const slug = slugMatch ? slugMatch[1] : "" // Extract just the captured group
  
  

  // State
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<ExecutionStats | null>(null)
  const [period, setPeriod] = useState(initialPeriod)

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/dashboard/execution-stats?period=${period}`)
        if (!response.ok) {
          throw new Error("Failed to fetch execution stats")
        }

        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Error fetching execution stats:", error)
        toast({
          title: "Error",
          description: "Failed to load execution statistics. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [period])

  // Format duration
  const formatDuration = (duration: number) => {
    if (duration < 1000) {
      return `${duration}ms`
    } else if (duration < 60000) {
      return `${(duration / 1000).toFixed(2)}s`
    } else {
      const minutes = Math.floor(duration / 60000)
      const seconds = ((duration % 60000) / 1000).toFixed(0)
      return `${minutes}m ${seconds}s`
    }
  }

  // Get period label
  const getPeriodLabel = () => {
    switch (period) {
      case "day":
        return "Today"
      case "week":
        return "This Week"
      case "month":
        return "This Month"
      case "year":
        return "This Year"
      default:
        return "This Week"
    }
  }

  // Get date range
  const getDateRange = () => {
    const endDate = new Date()
    let startDate: Date

    switch (period) {
      case "day":
        startDate = new Date()
        startDate.setHours(0, 0, 0, 0)
        break
      case "week":
        startDate = subDays(endDate, 7)
        break
      case "month":
        startDate = new Date()
        startDate.setMonth(startDate.getMonth() - 1)
        break
      case "year":
        startDate = new Date()
        startDate.setFullYear(startDate.getFullYear() - 1)
        break
      default:
        startDate = subDays(endDate, 7)
    }

    return `${format(startDate, "MMM d, yyyy")} - ${format(endDate, "MMM d, yyyy")}`
  }

  // Render loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32 w-full" />
          ))}
        </div>
      </div>
    )
  }

  // If no stats or no executions
  if (!stats || stats.totalExecutions === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Execution Statistics</CardTitle>
          <CardDescription>No execution data available for the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Run your workflows to see execution statistics.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push(`dashboard/${slug}/agents/workflows`)}>View Workflows</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold">Execution Statistics</h2>
          <p className="text-muted-foreground flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {getDateRange()}
          </p>
        </div>
        <Select value={period} onValueChange={(value) => setPeriod(value as typeof period)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Executions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
            <div
              className={`flex items-center text-xs ${
                stats.executionTrend >= 0 ? "text-green-500" : "text-destructive"
              }`}
            >
              {stats.executionTrend >= 0 ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              {Math.abs(stats.executionTrend)}%
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalExecutions}</div>
            <p className="text-xs text-muted-foreground">
              {stats.successfulExecutions} successful, {stats.failedExecutions} failed
            </p>
          </CardContent>
        </Card>

        {/* Success Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <div
              className={`flex items-center text-xs ${
                stats.successRateTrend >= 0 ? "text-green-500" : "text-destructive"
              }`}
            >
              {stats.successRateTrend >= 0 ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              {Math.abs(stats.successRateTrend)}%
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalExecutions > 0
                ? `${Math.round((stats.successfulExecutions / stats.totalExecutions) * 100)}%`
                : "0%"}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.successfulExecutions} of {stats.totalExecutions} executions
            </p>
          </CardContent>
        </Card>

        {/* Average Duration */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(stats.averageDuration)}</div>
            <p className="text-xs text-muted-foreground">Per workflow execution</p>
          </CardContent>
        </Card>

        {/* Daily Average */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.dailyStats.length > 0
                ? Math.round(
                    stats.dailyStats.reduce((acc, day) => acc + day.totalExecutions, 0) / stats.dailyStats.length,
                  )
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">Executions per day</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Execution Breakdown</CardTitle>
          <CardDescription>Daily execution statistics for the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            {/* This would be replaced with an actual chart component */}
            <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
              <p className="text-muted-foreground">Chart visualization would be displayed here</p>
              <p className="text-xs text-muted-foreground mt-2">
                Daily data: {stats.dailyStats.length} days with {stats.totalExecutions} total executions
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => router.push(`dashboard/${slug}/agents/workflows`)}>
            View All Workflows
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
