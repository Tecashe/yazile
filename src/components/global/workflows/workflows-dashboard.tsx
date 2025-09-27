"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Play, Pause, Edit, Trash2, Copy, Activity, Clock, MessageSquare } from "lucide-react"

interface Workflow {
  id: string
  name: string
  description: string
  status: "active" | "paused" | "draft"
  createdAt: string
  updatedAt: string
  nodeCount: number
  executionCount: number
  lastExecution?: string
}

interface WorkflowsDashboardProps {
  onEditWorkflow: (workflowId: string) => void
  onCreateWorkflow: () => void
}

export function WorkflowsDashboard({ onEditWorkflow, onCreateWorkflow }: WorkflowsDashboardProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newWorkflowName, setNewWorkflowName] = useState("")
  const [newWorkflowDescription, setNewWorkflowDescription] = useState("")

  useEffect(() => {
    loadWorkflows()
  }, [])

  const loadWorkflows = () => {
    // Load workflows from localStorage
    const savedWorkflows = localStorage.getItem("workflows-list")
    if (savedWorkflows) {
      try {
        setWorkflows(JSON.parse(savedWorkflows))
      } catch (error) {
        console.error("Failed to load workflows:", error)
      }
    } else {
      // Create sample workflows if none exist
      const sampleWorkflows: Workflow[] = [
        {
          id: "workflow-1",
          name: "Instagram DM Auto-Reply",
          description: "Automatically respond to Instagram direct messages with personalized replies",
          status: "active",
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-20T14:30:00Z",
          nodeCount: 5,
          executionCount: 247,
          lastExecution: "2024-01-20T14:25:00Z",
        },
        {
          id: "workflow-2",
          name: "Lead Qualification Bot",
          description: "Qualify leads through interactive questions and route to appropriate team members",
          status: "active",
          createdAt: "2024-01-10T09:15:00Z",
          updatedAt: "2024-01-18T16:45:00Z",
          nodeCount: 8,
          executionCount: 156,
          lastExecution: "2024-01-18T16:40:00Z",
        },
        {
          id: "workflow-3",
          name: "Customer Support Triage",
          description: "Automatically categorize and route customer support requests",
          status: "paused",
          createdAt: "2024-01-05T11:30:00Z",
          updatedAt: "2024-01-12T13:20:00Z",
          nodeCount: 6,
          executionCount: 89,
          lastExecution: "2024-01-12T13:15:00Z",
        },
      ]
      setWorkflows(sampleWorkflows)
      localStorage.setItem("workflows-list", JSON.stringify(sampleWorkflows))
    }
  }

  const saveWorkflows = (updatedWorkflows: Workflow[]) => {
    setWorkflows(updatedWorkflows)
    localStorage.setItem("workflows-list", JSON.stringify(updatedWorkflows))
  }

  const filteredWorkflows = workflows.filter(
    (workflow) =>
      workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreateWorkflow = () => {
    if (!newWorkflowName.trim()) return

    const newWorkflow: Workflow = {
      id: `workflow-${Date.now()}`,
      name: newWorkflowName,
      description: newWorkflowDescription,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nodeCount: 1,
      executionCount: 0,
    }

    const updatedWorkflows = [...workflows, newWorkflow]
    saveWorkflows(updatedWorkflows)

    setIsCreateDialogOpen(false)
    setNewWorkflowName("")
    setNewWorkflowDescription("")

    onCreateWorkflow()
  }

  const handleToggleStatus = (workflowId: string) => {
    const updatedWorkflows = workflows.map((workflow) => {
      if (workflow.id === workflowId) {
        return {
          ...workflow,
          status: workflow.status === "active" ? "paused" : ("active" as "active" | "paused"),
          updatedAt: new Date().toISOString(),
        }
      }
      return workflow
    })
    saveWorkflows(updatedWorkflows)
  }

  const handleDeleteWorkflow = (workflowId: string) => {
    const updatedWorkflows = workflows.filter((workflow) => workflow.id !== workflowId)
    saveWorkflows(updatedWorkflows)
  }

  const handleDuplicateWorkflow = (workflow: Workflow) => {
    const duplicatedWorkflow: Workflow = {
      ...workflow,
      id: `workflow-${Date.now()}`,
      name: `${workflow.name} (Copy)`,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      executionCount: 0,
      lastExecution: undefined,
    }

    const updatedWorkflows = [...workflows, duplicatedWorkflow]
    saveWorkflows(updatedWorkflows)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "paused":
        return "bg-yellow-500"
      case "draft":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Workflows</h1>
            <p className="text-muted-foreground mt-1">Manage your DM automation workflows</p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Workflow
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Workflow</DialogTitle>
                <DialogDescription>Create a new automation workflow for your social media accounts.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Workflow Name</Label>
                  <Input
                    id="name"
                    value={newWorkflowName}
                    onChange={(e) => setNewWorkflowName(e.target.value)}
                    placeholder="e.g., Instagram Auto-Reply"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newWorkflowDescription}
                    onChange={(e) => setNewWorkflowDescription(e.target.value)}
                    placeholder="Describe what this workflow does..."
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateWorkflow} disabled={!newWorkflowName.trim()}>
                    Create Workflow
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Stats */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search workflows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{workflows.filter((w) => w.status === "active").length} Active</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>{workflows.filter((w) => w.status === "paused").length} Paused</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <span>{workflows.filter((w) => w.status === "draft").length} Draft</span>
            </div>
          </div>
        </div>

        {/* Workflows Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkflows.map((workflow) => (
            <Card key={workflow.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-1">{workflow.name}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">{workflow.description}</CardDescription>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`${getStatusColor(workflow.status)} text-white capitalize ml-2`}
                  >
                    {workflow.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span>{workflow.nodeCount} nodes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span>{workflow.executionCount} runs</span>
                  </div>
                </div>

                {/* Last execution */}
                {workflow.lastExecution && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Last run: {formatDate(workflow.lastExecution)}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditWorkflow(workflow.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDuplicateWorkflow(workflow)}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteWorkflow(workflow.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    variant={workflow.status === "active" ? "secondary" : "default"}
                    size="sm"
                    onClick={() => handleToggleStatus(workflow.id)}
                    className="gap-1"
                  >
                    {workflow.status === "active" ? (
                      <>
                        <Pause className="h-3 w-3" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3" />
                        Activate
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredWorkflows.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{searchQuery ? "No workflows found" : "No workflows yet"}</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Try adjusting your search terms" : "Create your first automation workflow to get started"}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Workflow
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
