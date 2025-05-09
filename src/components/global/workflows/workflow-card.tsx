"use client"

import { useRouter,usePathname } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { MoreHorizontal, PlayCircle, Settings, Trash } from "lucide-react"
import type { WorkflowStatus } from "@prisma/client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import { WorkflowStatusBadge } from "./workflow-status-badge"

interface WorkflowCardProps {
  workflow: {
    id: string
    name: string
    status: WorkflowStatus
    isActive: boolean
    n8nWorkflowId: string | null
    webhookUrl: string | null
    createdAt: string
    updatedAt: string
    template: {
      name: string
      description: string
      category: string
      icon: string | null
    }
    _count?: {
      executions: number
    }
  }
  onDelete?: (id: string) => void
}

export function WorkflowCard({ workflow, onDelete }: WorkflowCardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
  const slug = slugMatch ? slugMatch[1] : "" // Extract just the captured group
  

  // Format dates
  const updatedAtFormatted = formatDistanceToNow(new Date(workflow.updatedAt), { addSuffix: true })

  // Handle view workflow detail
  const handleViewWorkflow = () => {
    router.push(`/dashboard/${slug}/agents/workflows/${workflow.id}`)
  }

  // Handle workflow configuration
  const handleConfigureWorkflow = () => {
    router.push(`/dashboard/${slug}/agents/workflows/${workflow.id}/configure`)
  }

  // Handle workflow execution
  const handleExecuteWorkflow = async () => {
    if (!workflow.isActive || workflow.status !== "ACTIVE") {
      toast({
        title: "Workflow not active",
        description: "Please activate the workflow before executing it.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/workflows/${workflow.id}/executions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputData: {} }),
      })

      if (!response.ok) {
        throw new Error("Failed to execute workflow")
      }

      const execution = await response.json()
      toast({
        title: "Workflow execution started",
        description: "Your workflow is now running.",
      })

      // Redirect to execution details page
      router.push(`/dashboard/${slug}/agents/workflows/${workflow.id}/executions/${execution.id}`)
    } catch (error) {
      console.error("Error executing workflow:", error)
      toast({
        title: "Error executing workflow",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    }
  }

  // Handle workflow deletion
  const handleDeleteWorkflow = async () => {
    if (!confirm("Are you sure you want to delete this workflow? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/workflows/${workflow.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete workflow")
      }

      toast({
        title: "Workflow deleted",
        description: "Your workflow has been deleted successfully.",
      })

      // Call parent onDelete callback if provided
      if (onDelete) {
        onDelete(workflow.id)
      } else {
        // Force a refresh to update the list
        router.refresh()
      }
    } catch (error) {
      console.error("Error deleting workflow:", error)
      toast({
        title: "Error deleting workflow",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base cursor-pointer" onClick={handleViewWorkflow}>
            {workflow.name}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleViewWorkflow}>View details</DropdownMenuItem>
              <DropdownMenuItem onClick={handleConfigureWorkflow}>
                <Settings className="mr-2 h-4 w-4" /> Configure
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleExecuteWorkflow}
                disabled={!workflow.isActive || workflow.status !== "ACTIVE"}
              >
                <PlayCircle className="mr-2 h-4 w-4" /> Execute
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDeleteWorkflow} className="text-destructive">
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="line-clamp-2 text-xs">Based on: {workflow.template.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-1">
          <WorkflowStatusBadge status={workflow.status} isActive={workflow.isActive} />
          <span className="text-xs text-muted-foreground">
            {workflow._count ? `${workflow._count.executions} runs` : ""}
          </span>
        </div>
        {workflow.webhookUrl && (
          <div className="mt-2 text-xs text-muted-foreground truncate" title={workflow.webhookUrl}>
            Webhook URL available
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-1 text-xs text-muted-foreground">Updated {updatedAtFormatted}</CardFooter>
    </Card>
  )
}
