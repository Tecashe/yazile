"use client"

import { useState, useEffect } from "react"
import { useRouter,usePathname } from "next/navigation"
import { ArrowLeft, Clock, BarChart3, Zap, CheckCircle, AlertCircle } from "lucide-react"
import type { WorkflowCategory, WorkflowComplexity } from "@prisma/client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface TemplateDetailProps {
  templateId: string
}

interface Template {
  id: string
  name: string
  description: string
  category: WorkflowCategory
  icon: string | null
  complexity: WorkflowComplexity
  estimatedSetupTime: number
  featured: boolean
  popular: boolean
  requiredIntegrations: string[]
  configurationSchema: any
  visualRepresentation: any
  expectedOutcomes: string[]
  useCases: string[]
  userWorkflows: Array<{
    id: string
    name: string
    status: string
    isActive: boolean
    createdAt: string
    updatedAt: string
  }>
  usageStats: {
    totalInstances: number
  }
}

export function TemplateDetail({ templateId }: TemplateDetailProps) {
  const router = useRouter()
  const pathname = usePathname()
  const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
  const slug = slugMatch ? slugMatch[1] : "" // Extract just the captured group


  // State
  const [isLoading, setIsLoading] = useState(true)
  const [template, setTemplate] = useState<Template | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  // Fetch template data
  useEffect(() => {
    const fetchTemplate = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/templates/${templateId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch template")
        }

        const data = await response.json()
        setTemplate(data)
      } catch (error) {
        console.error("Error fetching template:", error)
        toast({
          title: "Error",
          description: "Failed to load template details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTemplate()
  }, [templateId])

  // Handle create workflow from template
  const handleCreateWorkflow = () => {
    router.push(`/agents/workflows/new?templateId=${templateId}`)
  }

  // Format complexity for display
  const formatComplexity = (complexity: WorkflowComplexity) => {
    return complexity.charAt(0) + complexity.slice(1).toLowerCase()
  }

  // Render loading state
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

        <div className="space-y-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-32 w-full rounded-md" />
        </div>
      </div>
    )
  }

  if (!template) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Template not found or you don&apos;t have permission to view it.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with title and actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => router.push(`/agents/templates`)}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="text-2xl font-bold">{template.name}</h1>
            {template.featured && <Badge variant="default">Featured</Badge>}
            {template.popular && !template.featured && <Badge variant="secondary">Popular</Badge>}
          </div>
          <p className="text-muted-foreground">
            {template.category.replace(/_/g, " ")} • {formatComplexity(template.complexity)} •{" "}
            {template.estimatedSetupTime} min setup
          </p>
        </div>

        <Button onClick={handleCreateWorkflow}>
          <Zap className="mr-2 h-4 w-4" />
          Use This Template
        </Button>
      </div>

      {/* Main content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="visualization">Visualization</TabsTrigger>
          {template.userWorkflows.length > 0 && <TabsTrigger value="my-workflows">My Workflows</TabsTrigger>}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{template.description}</p>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {template.expectedOutcomes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Expected Outcomes</CardTitle>
                  <CardDescription>What this workflow will help you achieve</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {template.expectedOutcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {template.useCases.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Use Cases</CardTitle>
                  <CardDescription>Common scenarios for this workflow</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {template.useCases.map((useCase, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{useCase}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {template.requiredIntegrations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Required Integrations</CardTitle>
                <CardDescription>External services needed for this workflow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {template.requiredIntegrations.map((integration) => (
                    <Badge key={integration} variant="outline" className="text-sm py-1">
                      {integration}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Stats</CardTitle>
              <CardDescription>Usage statistics for this template</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Complexity</p>
                  <div className="flex items-center">
                    <BarChart3 className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="font-medium">{formatComplexity(template.complexity)}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Setup Time</p>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="font-medium">{template.estimatedSetupTime} minutes</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Workflows</p>
                  <p className="font-medium">{template.usageStats.totalInstances}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Your Workflows</p>
                  <p className="font-medium">{template.userWorkflows.length}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button onClick={handleCreateWorkflow}>
                <Zap className="mr-2 h-4 w-4" />
                Create Workflow from Template
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="configuration">
          <Card>
            <CardHeader>
              <CardTitle>Configuration Schema</CardTitle>
              <CardDescription>Required configuration for this workflow template</CardDescription>
            </CardHeader>
            <CardContent>
              {template.configurationSchema.sections.map((section: any) => (
                <div key={section.id} className="mb-6">
                  <h3 className="text-lg font-medium mb-2">{section.title}</h3>
                  {section.description && <p className="text-sm text-muted-foreground mb-4">{section.description}</p>}

                  <div className="space-y-4">
                    {section.fields.map((field: any) => (
                      <div key={field.name} className="border rounded-md p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{field.label}</p>
                            {field.description && <p className="text-sm text-muted-foreground">{field.description}</p>}
                          </div>
                          {field.required && (
                            <Badge variant="outline" className="text-destructive border-destructive">
                              Required
                            </Badge>
                          )}
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground">Type: {field.type}</p>
                          {field.default !== undefined && (
                            <p className="text-sm text-muted-foreground">
                              Default:{" "}
                              {typeof field.default === "object"
                                ? JSON.stringify(field.default)
                                : String(field.default)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Visualization Tab */}
        <TabsContent value="visualization">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Visualization</CardTitle>
              <CardDescription>Visual representation of the workflow steps</CardDescription>
            </CardHeader>
            <CardContent>
              {template.visualRepresentation ? (
                <div className="border rounded-md p-4 bg-muted/50">
                  {/* This would be replaced with an actual visualization component */}
                  <pre className="text-xs overflow-x-auto">
                    {JSON.stringify(template.visualRepresentation, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
                  <p className="text-muted-foreground">No visualization available for this template</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Workflows Tab */}
        {template.userWorkflows.length > 0 && (
          <TabsContent value="my-workflows">
            <Card>
              <CardHeader>
                <CardTitle>My Workflows Using This Template</CardTitle>
                <CardDescription>Workflows you have created from this template</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {template.userWorkflows.map((workflow) => (
                    <div
                      key={workflow.id}
                      className="flex justify-between items-center p-4 border rounded-md hover:bg-muted/50 cursor-pointer"
                      onClick={() => router.push(`/agents/workflows/${workflow.id}`)}
                    >
                      <div>
                        <p className="font-medium">{workflow.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Status: {workflow.status} • {workflow.isActive ? "Active" : "Inactive"}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button onClick={handleCreateWorkflow}>
                  <Zap className="mr-2 h-4 w-4" />
                  Create Another Workflow
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
