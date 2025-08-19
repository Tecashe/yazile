"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Activity,
  Zap,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  Settings,
  PowerOff,
  RefreshCw,
  Plus,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface WorkflowConfig {
  id: string
  name: string
  description: string
  category: string
  complexity: string
  isActive: boolean
  status: string
  createdAt: string
  integrations: Array<{
    id: string
    name: string
    isActive: boolean
    lastVerified: string
  }>
}

export default function WorkflowDashboardPage() {
  const router = useRouter()
  const [workflowConfigs, setWorkflowConfigs] = useState<WorkflowConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const loadWorkflows = async () => {
      // Mock data - replace with actual API call
      const mockWorkflows: WorkflowConfig[] = [
        {
          id: "1",
          name: "Lead Qualification Assistant",
          description: "Automatically qualify and route leads based on custom criteria",
          category: "AI_ASSISTANT",
          complexity: "Medium",
          isActive: true,
          status: "ACTIVE",
          createdAt: "2024-01-15T10:00:00Z",
          integrations: [
            {
              id: "1",
              name: "HubSpot CRM",
              isActive: true,
              lastVerified: "2024-01-20T14:30:00Z",
            },
          ],
        },
      ]

      setTimeout(() => {
        setWorkflowConfigs(mockWorkflows)
        setLoading(false)
      }, 1000)
    }

    loadWorkflows()
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "border-green-200 text-green-700 bg-green-50"
      case "INACTIVE":
        return "border-gray-200 text-gray-700 bg-gray-50"
      case "ERROR":
        return "border-red-200 text-red-700 bg-red-50"
      default:
        return "border-gray-200 text-gray-700 bg-gray-50"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your workflows...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push("/workflows")} className="mb-6 hover:bg-accent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Workflows
          </Button>

          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">My Workflow Dashboard</h1>
            <div className="flex gap-2">
              <Button onClick={handleRefresh} disabled={refreshing} variant="outline">
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button onClick={() => router.push("/workflows")}>
                <Plus className="h-4 w-4 mr-2" />
                Add Workflow
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{workflowConfigs.filter((w) => w.isActive).length}</p>
                  <p className="text-sm text-muted-foreground">Active Workflows</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <Zap className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {workflowConfigs.reduce((acc, w) => acc + w.integrations.length, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Integrations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">98%</p>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-muted/10 rounded-lg">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">2.3s</p>
                  <p className="text-sm text-muted-foreground">Avg Response</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workflows List */}
        {workflowConfigs.length === 0 ? (
          <Card className="border-2 border-border/50">
            <CardContent className="p-12 text-center">
              <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Active Workflows</h3>
              <p className="text-muted-foreground mb-6">
                You haven&apos;t activated any workflows yet. Browse our template library to get started.
              </p>
              <Button onClick={() => router.push("/workflows")}>
                <Zap className="h-4 w-4 mr-2" />
                Browse Templates
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {workflowConfigs.map((config) => (
              <Card key={config.id} className="border-2 border-border/50 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{config.name}</CardTitle>
                      <CardDescription className="mt-2">{config.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getStatusColor(config.status)}>
                        {config.isActive ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {config.status}
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Workflow Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Category</h4>
                      <p className="text-sm text-muted-foreground">{config.category}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Complexity</h4>
                      <p className="text-sm text-muted-foreground">{config.complexity}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Created</h4>
                      <p className="text-sm text-muted-foreground">{new Date(config.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Integrations */}
                  {config.integrations && config.integrations.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-3">Connected Integrations</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {config.integrations.map((integration) => (
                          <div key={integration.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <div className="p-2 bg-primary/10 rounded">
                              <Zap className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{integration.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {integration.isActive ? "Connected" : "Disconnected"} • Last verified:{" "}
                                {new Date(integration.lastVerified).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center">
                              {integration.isActive ? (
                                <CheckCircle className="h-4 w-4 text-primary" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-destructive" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive bg-transparent"
                    >
                      <PowerOff className="h-4 w-4 mr-2" />
                      Deactivate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
