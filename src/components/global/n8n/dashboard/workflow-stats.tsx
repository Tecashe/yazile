"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Activity, CheckCircle, XCircle, Zap } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"

interface WorkflowStatsProps {
  userId: string
  period?: "day" | "week" | "month" | "all"
}

interface WorkflowStats {
  totalWorkflows: number
  activeWorkflows: number
  inactiveWorkflows: number
  errorWorkflows: number
  draftWorkflows: number
  totalExecutions: number
  successfulExecutions: number
  failedExecutions: number
  lastExecution: {
    id: string
    workflowId: string
    workflowName: string
    status: string
    success: boolean
    startedAt: string
  } | null
}

export function WorkflowStats({ userId, period = "all" }: WorkflowStatsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
  const slug = slugMatch ? slugMatch[1] : "" // Extract just the captured group
  

  // State
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<WorkflowStats | null>(null)

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/dashboard/workflow-stats?period=${period}`)
        if (!response.ok) {
          throw new Error("Failed to fetch workflow stats")
        }

        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Error fetching workflow stats:", error)
        toast({
          title: "Error",
          description: "Failed to load workflow statistics. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [period])

  // Render loading state
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 w-full" />
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Workflow Statistics</CardTitle>
          <CardDescription>No statistics available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Create your first workflow to see statistics.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push(`/dashboard/${slug}/agents/workflows/new`)}>Create Workflow</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Workflows */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWorkflows}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeWorkflows} active, {stats.inactiveWorkflows} inactive
            </p>
          </CardContent>
        </Card>

        {/* Active Workflows */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
            <Zap className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeWorkflows}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalWorkflows > 0
                ? `${Math.round((stats.activeWorkflows / stats.totalWorkflows) * 100)}% of total workflows`
                : "No workflows created yet"}
            </p>
          </CardContent>
        </Card>

        {/* Successful Executions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Executions</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successfulExecutions}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalExecutions > 0
                ? `${Math.round((stats.successfulExecutions / stats.totalExecutions) * 100)}% success rate`
                : "No executions yet"}
            </p>
          </CardContent>
        </Card>

        {/* Failed Executions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Executions</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.failedExecutions}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalExecutions > 0
                ? `${Math.round((stats.failedExecutions / stats.totalExecutions) * 100)}% failure rate`
                : "No executions yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Last Execution */}
      {stats.lastExecution && (
        <Card>
          <CardHeader>
            <CardTitle>Last Workflow Execution</CardTitle>
            <CardDescription>
              {formatDistanceToNow(new Date(stats.lastExecution.startedAt), { addSuffix: true })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{stats.lastExecution.workflowName}</p>
                <div className="flex items-center mt-1">
                  {stats.lastExecution.success ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive mr-1" />
                  )}
                  <span className={stats.lastExecution.success ? "text-green-600" : "text-destructive"}>
                    {stats.lastExecution.status}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"     
                onClick={() =>
                  router.push(`/dashboard/${slug}/agents/workflows/${stats.lastExecution?.workflowId}/executions/${stats.lastExecution?.id}`)
                }
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
