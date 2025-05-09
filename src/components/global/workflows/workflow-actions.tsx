"use client"

import { useState } from "react"
import { useRouter,usePathname } from "next/navigation"
import { Play, Pause, Settings, Trash, Edit, History } from "lucide-react"
import type { WorkflowStatus } from "@prisma/client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface WorkflowActionsProps {
  workflow: {
    id: string
    name: string
    status: WorkflowStatus
    isActive: boolean
    n8nWorkflowId: string | null
  }
  onUpdate?: () => void
  variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link" | null
  showLabels?: boolean
}

export function WorkflowActions({ workflow, onUpdate, variant = "outline", showLabels = true }: WorkflowActionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
  const slug = slugMatch ? slugMatch[1] : "" // Extract just the captured group
  
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Check if the workflow is already created in n8n
  const isCreatedInN8n = !!workflow.n8nWorkflowId

  // Check if the workflow can be activated/deactivated
  const canToggleActive =
    isCreatedInN8n && (workflow.status === "READY" || workflow.status === "ACTIVE" || workflow.status === "INACTIVE")

  // Handle workflow activation
  const handleActivate = async () => {
    if (!canToggleActive) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/workflows/${workflow.id}/activate`, {
        method: "POST",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to activate workflow")
      }

      toast({
        title: "Workflow activated",
        description: "Your workflow is now active and ready to run.",
      })

      // Refresh the workflow data
      if (onUpdate) {
        onUpdate()
      } else {
        router.refresh()
      }
    } catch (error) {
      console.error("Error activating workflow:", error)
      toast({
        title: "Error activating workflow",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle workflow deactivation
  const handleDeactivate = async () => {
    if (!canToggleActive) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/workflows/${workflow.id}/deactivate`, {
        method: "POST",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to deactivate workflow")
      }

      toast({
        title: "Workflow deactivated",
        description: "Your workflow has been deactivated.",
      })

      // Refresh the workflow data
      if (onUpdate) {
        onUpdate()
      } else {
        router.refresh()
      }
    } catch (error) {
      console.error("Error deactivating workflow:", error)
      toast({
        title: "Error deactivating workflow",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle workflow execution
  const handleExecute = async () => {
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
        const error = await response.json()
        throw new Error(error.error || "Failed to execute workflow")
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
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    }
  }

  // Handle workflow deletion
  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/workflows/${workflow.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete workflow")
      }

      toast({
        title: "Workflow deleted",
        description: "Your workflow has been deleted successfully.",
      })

      // Navigate back to workflows list
      router.push(`/dashboard/${slug}/agents//workflows`)
      router.refresh()
    } catch (error) {
      console.error("Error deleting workflow:", error)
      toast({
        title: "Error deleting workflow",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {/* Primary Actions */}
        {workflow.isActive ? (
          <Button
            variant="outline"
            className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 hover:text-orange-800"
            onClick={handleDeactivate}
            disabled={isLoading || !canToggleActive}
          >
            <Pause className="h-4 w-4 mr-1" />
            {showLabels && "Deactivate"}
          </Button>
        ) : (
          <Button
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800"
            onClick={handleActivate}
            disabled={isLoading || !canToggleActive}
          >
            <Play className="h-4 w-4 mr-1" />
            {showLabels && "Activate"}
          </Button>
        )}

        {workflow.isActive && workflow.status === "ACTIVE" && (
          <Button variant="default" onClick={handleExecute} disabled={isLoading}>
            <Play className="h-4 w-4 mr-1" />
            {showLabels && "Execute Now"}
          </Button>
        )}

        {/* Secondary Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={variant} disabled={isLoading}>
              <Settings className="h-4 w-4 mr-1" />
              {showLabels && "Actions"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Workflow Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => router.push(`/dashboard/${slug}/agents/workflows/${workflow.id}/configure`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Configuration
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => router.push(`/dashboard/${slug}/agents/workflows/${workflow.id}/executions`)}>
              <History className="h-4 w-4 mr-2" />
              View Execution History
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete Workflow
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the workflow &quot;{workflow.name}&quot; and all associated data. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Deleting..." : "Delete Workflow"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
