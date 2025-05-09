"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { formatDistanceToNow, format } from "date-fns"
import { InfoIcon, LinkIcon, Clock, Zap, Activity, Calendar, Trash } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

import { WorkflowStatusBadge } from "./workflow-status-badge"
import { WorkflowActions } from "./workflow-actions"
import { ExecutionHistory } from "./execution-history"

interface WorkflowDetailProps {
  workflowId: string
  showExecutionHistory?: boolean
}

export function WorkflowDetail({ workflowId, showExecutionHistory = true }: WorkflowDetailProps) {
  const router = useRouter()
  const pathname = usePathname()
  const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
  const slug = slugMatch ? slugMatch[1] : "" // Extract just the captured group


  // State
  const [isLoading, setIsLoading] = useState(true)
  const [workflow, setWorkflow] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Fetch workflow data
  useEffect(() => {
    const fetchWorkflow = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/workflows/${workflowId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch workflow")
        }

        const data = await response.json()
        setWorkflow(data)
      } catch (error) {
        console.error("Error fetching workflow:", error)
        toast({
          title: "Error",
          description: "Failed to load workflow details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchWorkflow()
  }, [workflowId])

  // Handle workflow update
  const handleWorkflowUpdate = async () => {
    try {
      const response = await fetch(`/api/workflows/${workflowId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch workflow")
      }

      const data = await response.json()
      setWorkflow(data)
    } catch (error) {
      console.error("Error updating workflow data:", error)
    }
  }

  // Handle delete
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/workflows/${workflowId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete workflow")
      }

      toast({
        title: "Workflow deleted",
        description: "Your workflow has been successfully deleted",
      })

      router.push(`/dashboard/${slug}/agents/workflows`)
    } catch (error) {
      console.error("Error deleting workflow:", error)
      toast({
        title: "Error",
        description: "Failed to delete workflow. Please try again.",
        variant: "destructive",
      })
    } finally {
      setShowDeleteDialog(false)
    }
  }

  // Rendering loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <Skeleton className="h-64 w-full rounded-md" />

        {showExecutionHistory && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-64 w-full rounded-md" />
          </div>
        )}
      </div>
    )
  }

  if (!workflow) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Workflow Not Found</CardTitle>
          <CardDescription>
            The requested workflow could not be found or you dont have permission to view it.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => router.push(`/dashboard/${slug}/agents/workflows`)}>Return to Workflows</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with title and actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">{workflow.name}</h1>
          <p className="text-muted-foreground">Based on the {workflow.template.name} template</p>
        </div>

        <WorkflowActions workflow={workflow} onUpdate={handleWorkflowUpdate} showLabels />
      </div>

      {/* Main content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {showExecutionHistory && <TabsTrigger value="executions">Execution History</TabsTrigger>}
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <WorkflowStatusBadge status={workflow.status} isActive={workflow.isActive} size="lg" />
                <Badge variant="outline" className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  Created {format(new Date(workflow.createdAt), "MMM d, yyyy")}
                </Badge>
                <Badge variant="outline" className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  Updated {formatDistanceToNow(new Date(workflow.updatedAt), { addSuffix: true })}
                </Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-medium mb-2">Template Description</h3>
                  <p className="text-sm text-muted-foreground">{workflow.template.description}</p>
                </div>

                {workflow.webhookUrl && (
                  <div>
                    <h3 className="font-medium mb-2 flex items-center">
                      <LinkIcon className="mr-1 h-4 w-4" />
                      Webhook URL
                    </h3>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-muted p-2 rounded overflow-x-auto max-w-[300px]">
                        {workflow.webhookUrl}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(workflow.webhookUrl)
                          toast({
                            title: "Copied to clipboard",
                            description: "The webhook URL has been copied to your clipboard",
                          })
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Configuration summary - you might want to customize this based on your schema */}
              <div>
                <h3 className="font-medium mb-2">Configuration</h3>
                {Object.keys(workflow.configuration || {}).length > 0 ? (
                  <div className="grid gap-2 text-sm">
                    {Object.entries(workflow.configuration).map(([key, value]) => (
                      <div key={key} className="flex items-start">
                        <span className="font-medium min-w-[140px]">{key}:</span>
                        <span className="text-muted-foreground overflow-hidden text-ellipsis">
                          {typeof value === "object"
                            ? JSON.stringify(value).substring(0, 100) +
                              (JSON.stringify(value).length > 100 ? "..." : "")
                            : String(value).substring(0, 100) + (String(value).length > 100 ? "..." : "")}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No configuration set.{" "}
                    <Button
                      variant="link"
                      className="h-auto p-0"
                      onClick={() => router.push(`/dashboard/${slug}/agents/workflows/${workflowId}/configure`)}
                    >
                      Configure now
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-between">
              <Button variant="outline" onClick={() => router.push(`/dashboard/${slug}/agents/workflows/${workflowId}/configure`)}>
                <InfoIcon className="mr-2 h-4 w-4" />
                Edit Configuration
              </Button>

              {workflow.isActive && workflow.status === "ACTIVE" && (
                <Button
                  onClick={async () => {
                    try {
                      const response = await fetch(`/api/workflows/${workflowId}/executions`, {
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
                        description: "Your workflow is now running",
                      })

                      setActiveTab("executions")
                    } catch (error) {
                      console.error("Error executing workflow:", error)
                      toast({
                        title: "Error",
                        description: "Failed to execute workflow. Please try again.",
                        variant: "destructive",
                      })
                    }
                  }}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Execute Now
                </Button>
              )}
            </CardFooter>
          </Card>

          {workflow.credentials && workflow.credentials.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Connected Credentials</CardTitle>
                <CardDescription>Credentials used by this workflow to connect to external services</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {workflow.credentials.map((credential: any) => (
                    <li key={credential.id} className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{credential.name}</span>
                        <span className="text-sm text-muted-foreground ml-2">({credential.type})</span>
                      </div>
                      <Badge variant="outline">Connected</Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  onClick={() => router.push(`/dashboard/${slug}/agents/workflows/${workflowId}/configure?tab=credentials`)}
                >
                  Manage Credentials
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        {/* Execution History Tab */}
        {showExecutionHistory && (
          <TabsContent value="executions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5" />
                  Execution History
                </CardTitle>
                <CardDescription>View the history of executions for this workflow</CardDescription>
              </CardHeader>
              <CardContent>
                <ExecutionHistory workflowId={workflowId} limit={10} />
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => router.push(`/dashboard/${slug}/agents/workflows/${workflowId}/executions`)}>
                  View All Executions
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        )}

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Settings</CardTitle>
              <CardDescription>Manage settings for your workflow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Danger Zone</h3>
                <p className="text-sm text-muted-foreground mb-4">These actions cannot be undone. Please be certain.</p>

                <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete Workflow
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the workflow &quot;{workflow.name}&quot; and all associated data including
              execution history. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Workflow
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
