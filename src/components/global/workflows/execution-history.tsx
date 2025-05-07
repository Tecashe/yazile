"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format, formatDistanceToNow } from "date-fns"
import type { ExecutionStatus } from "@prisma/client"
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ChevronRight,
  PauseCircle,
  Play,
  Timer,
  PanelLeft,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"

interface ExecutionHistoryProps {
  workflowId: string
  limit?: number
  showWorkflowInfo?: boolean
}

interface Execution {
  id: string
  status: ExecutionStatus
  startedAt: string
  completedAt: string | null
  success: boolean | null
  duration: number | null
  n8nExecutionId: string | null
  events: Array<{
    id: string
    timestamp: string
    eventType: string
    nodeName: string | null
    message: string | null
  }>
}

export function ExecutionHistory({ workflowId, limit = 5, showWorkflowInfo = false }: ExecutionHistoryProps) {
  const router = useRouter()

  // State
  const [isLoading, setIsLoading] = useState(true)
  const [executions, setExecutions] = useState<Execution[]>([])
  const [totalExecutions, setTotalExecutions] = useState(0)

  // Fetch execution history
  useEffect(() => {
    const fetchExecutions = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/workflows/${workflowId}/executions?limit=${limit}`)
        if (!response.ok) {
          throw new Error("Failed to fetch executions")
        }

        const data = await response.json()
        setExecutions(data.executions)
        setTotalExecutions(data.pagination.total)
      } catch (error) {
        console.error("Error fetching executions:", error)
        toast({
          title: "Error",
          description: "Failed to load execution history. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchExecutions()
  }, [workflowId, limit])

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
          <AlertTriangle className="h-4 w-4 text-amber-500" />
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
  const handleViewExecution = (executionId: string) => {
    router.push(`/workflows/${workflowId}/executions/${executionId}`)
  }

  // Render loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    )
  }

  // Render empty state
  if (executions.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="space-y-2">
          <p className="text-muted-foreground">No executions found for this workflow</p>
          <Button variant="outline" onClick={() => router.push(`/workflows/${workflowId}`)}>
            Back to Workflow
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Started</TableHead>
              {!showWorkflowInfo && <TableHead>Duration</TableHead>}
              {showWorkflowInfo && <TableHead>Workflow</TableHead>}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {executions.map((execution) => (
              <TableRow
                key={execution.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleViewExecution(execution.id)}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(execution.status, execution.success)}
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
                    >
                      {execution.status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs">{format(new Date(execution.startedAt), "MMM d, h:mm a")}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(execution.startedAt), { addSuffix: true })}
                    </span>
                  </div>
                </TableCell>
                {!showWorkflowInfo && (
                  <TableCell>{execution.duration ? formatDuration(execution.duration) : "-"}</TableCell>
                )}
                {showWorkflowInfo && (
                  <TableCell>
                    <span className="font-medium">Workflow Name</span>
                  </TableCell>
                )}
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="h-7">
                    <PanelLeft className="mr-1 h-3.5 w-3.5" />
                    <span className="sr-md:not-sr-only sr-only">View</span>
                    <ChevronRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalExecutions > executions.length && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => router.push(`/workflows/${workflowId}/executions`)}>
            View All ({totalExecutions}) Executions
          </Button>
        </div>
      )}
    </div>
  )
}
