"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Star, Award, Clock, Users, CheckCircle2, Code, FileJson, LinkIcon } from "lucide-react"

// Types
type Template = {
  id: string
  name: string
  description: string
  category: string
  icon?: string
  featured: boolean
  popular: boolean
  complexity: "SIMPLE" | "MEDIUM" | "COMPLEX"
  estimatedSetupTime: number
  requiredIntegrations: string[]
  configurationSchema: any
  n8nTemplateId?: string
  visualRepresentation?: string
  expectedOutcomes: string[]
  useCases: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
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

export default function TemplateDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params

  const [template, setTemplate] = useState<Template | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch template details
  useEffect(() => {
    const fetchTemplate = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/templates/${id}`)

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()
        setTemplate(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTemplate()
  }, [id])

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <h1 className="text-3xl font-bold">Loading template...</h1>
        </div>
      </div>
    )
  }

  if (error || !template) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <h1 className="text-3xl font-bold">Template Details</h1>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error || "Template not found"}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => router.push("/admin/templates")}>
              Return to Templates
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <h1 className="text-3xl font-bold">{template.name}</h1>
        <div className="flex space-x-2">
          {template.featured && (
            <Badge variant="outline">
              <Star className="h-3 w-3 mr-1 text-yellow" />
              Featured
            </Badge>
          )}
          {template.popular && (
            <Badge variant="outline">
              <Award className="h-3 w-3 mr-1 text-purple-500" />
              Popular
            </Badge>
          )}
          <Badge variant={template.isActive ? "success" : "outline"}>{template.isActive ? "Active" : "Inactive"}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="configuration">Configuration</TabsTrigger>
              <TabsTrigger value="instances">Instances ({template.userWorkflows.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Template Overview</CardTitle>
                  <CardDescription>Details about this workflow template</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Description</h3>
                    <p className="text-muted-foreground">{template.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Details</h3>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Category:</dt>
                          <dd>{template.category}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Complexity:</dt>
                          <dd>
                            <Badge
                              variant={
                                template.complexity === "SIMPLE"
                                  ? "secondary"
                                  : template.complexity === "MEDIUM"
                                    ? "default"
                                    : "destructive"
                              }
                            >
                              {template.complexity.toLowerCase()}
                            </Badge>
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Setup Time:</dt>
                          <dd className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {template.estimatedSetupTime} minutes
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Total Instances:</dt>
                          <dd className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {template.usageStats.totalInstances}
                          </dd>
                        </div>
                        {template.n8nTemplateId && (
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">n8n Template ID:</dt>
                            <dd>{template.n8nTemplateId}</dd>
                          </div>
                        )}
                      </dl>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Integrations</h3>
                      {template.requiredIntegrations.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1">
                          {template.requiredIntegrations.map((integration, index) => (
                            <li key={index}>{integration}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground">No required integrations</p>
                      )}
                    </div>
                  </div>

                  {template.expectedOutcomes.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Expected Outcomes</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {template.expectedOutcomes.map((outcome, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {template.useCases.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Use Cases</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {template.useCases.map((useCase, index) => (
                          <li key={index}>{useCase}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {template.visualRepresentation && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Visual Representation</h3>
                      <div className="border rounded-md p-2">
                        <img
                          src={template.visualRepresentation || "/placeholder.svg"}
                          alt={`${template.name} visualization`}
                          className="max-w-full h-auto rounded"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => router.push("/admin/templates")}>
                    Back to Templates
                  </Button>
                  <Button onClick={() => router.push(`/admin/templates/edit/${template.id}`)}>Edit Template</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="configuration">
              <Card>
                <CardHeader>
                  <CardTitle>Configuration Schema</CardTitle>
                  <CardDescription>JSON schema for configuring this workflow</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-md p-4 overflow-auto max-h-[500px]">
                    <pre className="text-sm font-mono">{JSON.stringify(template.configurationSchema, null, 2)}</pre>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <FileJson className="h-4 w-4 mr-2" />
                    Download Schema
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="instances">
              <Card>
                <CardHeader>
                  <CardTitle>Workflow Instances</CardTitle>
                  <CardDescription>
                    Users who have implemented this template ({template.userWorkflows.length})
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {template.userWorkflows.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No instances of this template have been created yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {template.userWorkflows.map((workflow) => (
                        <div key={workflow.id} className="border rounded-md p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{workflow.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                Created: {new Date(workflow.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={workflow.isActive ? "success" : "outline"}>
                                {workflow.isActive ? "Active" : "Inactive"}
                              </Badge>
                              <Badge variant="secondary">{workflow.status}</Badge>
                            </div>
                          </div>
                          <div className="mt-2 flex justify-end">
                            <Button variant="outline" size="sm">
                              <LinkIcon className="h-4 w-4 mr-2" />
                              View Workflow
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" onClick={() => router.push(`/admin/templates/edit/${template.id}`)}>
                Edit Template
              </Button>
              <Button variant="outline" className="w-full">
                <Code className="h-4 w-4 mr-2" />
                View n8n Template
              </Button>
              <Button variant="outline" className="w-full">
                Preview Template
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">ID:</dt>
                  <dd className="font-mono">{template.id}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Created:</dt>
                  <dd>{new Date(template.createdAt).toLocaleString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Last Updated:</dt>
                  <dd>{new Date(template.updatedAt).toLocaleString()}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
