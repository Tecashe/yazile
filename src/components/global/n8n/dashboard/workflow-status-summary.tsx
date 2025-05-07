"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Zap, AlertCircle, PauseCircle, FileEdit, Archive } from "lucide-react"
import type { WorkflowStatus } from "@prisma/client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progres"

interface WorkflowStatusSummaryProps {
  title?: string
  description?: string
  showActions?: boolean
}

interface StatusCount {
  status: WorkflowStatus
  count: number
  isActive?: boolean
}

export function WorkflowStatusSummary({
  title = "Workflow Status",
  description = "Summary of your workflow statuses",
  showActions = true,
}: WorkflowStatusSummaryProps) {
  const router = useRouter()

  // State
  const [isLoading, setIsLoading] = useState(true)
  const [statusCounts, setStatusCounts] = useState<StatusCount[]>([])
  const [totalWorkflows, setTotalWorkflows] = useState(0)

  // Fetch status counts
  useEffect(() => {
    const fetchStatusCounts = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/dashboard/workflow-status")
        if (!response.ok) {
          throw new Error("Failed to fetch workflow status counts")
        }

        const data = await response.json()
        setStatusCounts(data.statusCounts)
        setTotalWorkflows(data.total)
      } catch (error) {
        console.error("Error fetching workflow status counts:", error)
        toast({
          title: "Error",
          description: "Failed to load workflow status summary. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStatusCounts()
  }, [])

  // Get status icon
  const getStatusIcon = (status: WorkflowStatus, isActive?: boolean) => {
    if (status === "ACTIVE" && isActive === false) {
      return <PauseCircle className="h-4 w-4 text-amber-500" />
    }

    switch (status) {
      case "ACTIVE":
        return <Zap className="h-4 w-4 text-green-500" />
      case "INACTIVE":
        return <PauseCircle className="h-4 w-4 text-amber-500" />
      case "ERROR":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      case "DRAFT":
      case "CONFIGURING":
        return <FileEdit className="h-4 w-4 text-blue-500" />
      case "ARCHIVED":
        return <Archive className="h-4 w-4 text-muted-foreground" />
      default:
        return null
    }
  }

  // Get status color
  const getStatusColor = (status: WorkflowStatus, isActive?: boolean) => {
    if (status === "ACTIVE" && isActive === false) {
      return "bg-amber-500"
    }

    switch (status) {
      case "ACTIVE":
        return "bg-green-500"
      case "INACTIVE":
        return "bg-amber-500"
      case "ERROR":
        return "bg-destructive"
      case "DRAFT":
      case "CONFIGURING":
      case "READY":
        return "bg-blue-500"
      case "ARCHIVED":
        return "bg-muted-foreground"
      default:
        return "bg-muted"
    }
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
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-8 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Render empty state
  if (statusCounts.length === 0 || totalWorkflows === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <p>No workflows found</p>
            <Button variant="outline" className="mt-2" onClick={() => router.push("/workflows/new")}>
              Create Your First Workflow
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
          {statusCounts.map((item) => (
            <div key={item.status} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getStatusIcon(item.status, item.isActive)}
                  <span className="ml-2 text-sm font-medium">
                    {item.status === "ACTIVE" && item.isActive === false ? "INACTIVE" : item.status}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {item.count} ({Math.round((item.count / totalWorkflows) * 100)}%)
                </span>
              </div>
              <Progress
                value={(item.count / totalWorkflows) * 100}
                className="h-2"
                indicatorClassName={getStatusColor(item.status, item.isActive)}
              />
            </div>
          ))}
        </div>
      </CardContent>
      {showActions && (
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => router.push("/workflows")}>
            View All Workflows
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
