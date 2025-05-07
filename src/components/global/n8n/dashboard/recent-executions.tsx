"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import type { ExecutionStatus } from "@prisma/client"
import { CheckCircle2, XCircle, Clock, Play, PauseCircle, Timer, ChevronRight } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"

interface RecentExecutionsProps {
  limit?: number
  showWorkflowInfo?: boolean
  title?: string
  description?: string
  showViewAll?: boolean
}

interface Execution {
  id: string
  workflowId: string
  status: ExecutionStatus
  startedAt: string
  completedAt: string | null
  success: boolean | null
  duration: number | null
  workflow: {
    id: string
    name: string
  }
}

export function RecentExecutions({
  limit = 5,
  showWorkflowInfo = true,
  title = "Recent Executions",
  description = "Latest workflow executions across all your workflows",
  showViewAll = true,
}: RecentExecutionsProps) {
  const router = useRouter()

  // State
  const [isLoading, setIsLoading] = useState(true)
  const [executions, setExecutions] = useState<Execution[]>([])
  const [totalExecutions, setTotalExecutions] = useState(0)

  // Fetch executions
  useEffect(() => {
    const fetchExecutions = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/dashboard/recent-executions?limit=${limit}`)
        if (!response.ok) {
          throw new Error("Failed to fetch executions")
        }

        const data = await response.json()
        setExecutions(data.executions)
        setTotalExecutions(data.total)
      } catch (error) {
        console.error("Error fetching executions:", error)
        toast({
          title: "Error",
          description: "Failed to load recent executions. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchExecutions()
  }, [limit])

  // Get status icon
  const getStatusIcon = (status: ExecutionStatus, success: boolean | null) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4 text-muted-foreground" />
      case "RUNNING":
        return <Play className="h-4 w-4 text-blue-500" />
      case "COMPLETED":
        return success ? (
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        ) : (
          <XCircle className="h-4 w-4 text-amber-500" />
        )
      case "FAILED":
        return <XCircle className="h-4 w-4 text-destructive" />
      case "CANCELED":
        return <PauseCircle className="h-4 w-4 text-muted-foreground" />
      case "TIMEOUT":
        return <Timer className="h-4 w-4 text-orange-500" />
      default:
        return null
    }
  }

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

  // Handle view execution detail
  const handleViewExecution = (workflowId: string, executionId: string) => {
    router.push(`/workflows/${workflowId}/executions/${executionId}`)
  }

  // Render loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: limit }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Render empty state
  if (executions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <p>No executions found</p>
            <Button variant="outline" className="mt-2" onClick={() => router.push("/workflows")}>
              View Workflows
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {executions.map((execution) => (
            <div
              key={execution.id}
              className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 cursor-pointer"
              onClick={() => handleViewExecution(execution.workflowId, execution.id)}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">{getStatusIcon(execution.status, execution.success)}</div>
                <div>
                  {showWorkflowInfo && <p className="font-medium text-sm">{execution.workflow.name}</p>}
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        execution.status === "COMPLETED" && execution.success
                          ? "default"
                          : execution.status === "COMPLETED" && !execution.success
                            ? "warning"
                            : execution.status === "FAILED"
                              ? "destructive"
                              : execution.status === "RUNNING"
                                ? "secondary"
                                : "outline"
                      }
                      className="text-xs"
                    >
                      {execution.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(execution.startedAt), { addSuffix: true })}
                    </span>
                    {execution.duration && (
                      <span className="text-xs text-muted-foreground">{formatDuration(execution.duration)}</span>
                    )}
                  </div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </CardContent>
      {showViewAll && totalExecutions > executions.length && (
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => router.push("/workflows/executions")}>
            View All Executions
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
