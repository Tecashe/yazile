"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Check, Loader2 } from "lucide-react"
import { WorkflowCategory, type WorkflowComplexity } from "@prisma/client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

// Template type definition
interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: WorkflowCategory
  icon: string | null
  complexity: WorkflowComplexity
  estimatedSetupTime: number
  featured: boolean
  popular: boolean
  userWorkflows: string[]
}

interface TemplateGroupProps {
  title: string
  templates: WorkflowTemplate[]
  selectedTemplateId: string | null
  onSelectTemplate: (templateId: string) => void
}

interface CreateWorkflowFormProps {
  redirectAfterCreate?: boolean
  defaultTemplateId?: string
  preSelectedCategory?: WorkflowCategory
}

function TemplateGroup({ title, templates, selectedTemplateId, onSelectTemplate }: TemplateGroupProps) {
  if (templates.length === 0) return null

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={cn(
              "cursor-pointer transition-all hover:border-primary",
              selectedTemplateId === template.id ? "border-2 border-primary" : "",
            )}
            onClick={() => onSelectTemplate(template.id)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="font-medium">{template.name}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
                </div>
                {template.icon && (
                  <div className="text-muted-foreground">
                    <span className="text-xl">{template.icon}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
                <span>Est. setup: {template.estimatedSetupTime} min</span>
                <span className="capitalize">{template.complexity.toLowerCase()}</span>
              </div>
            </CardContent>
            {selectedTemplateId === template.id && (
              <div className="absolute top-2 right-2 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                <Check className="h-3 w-3 text-primary-foreground" />
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

export function CreateWorkflowForm({
  redirectAfterCreate = true,
  defaultTemplateId,
  preSelectedCategory,
}: CreateWorkflowFormProps) {
  const router = useRouter()
  const pathname = usePathname()
  const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
  const slug = slugMatch ? slugMatch[1] : "" // Extract just the captured group


  // State
  const [isLoading, setIsLoading] = useState(false)
  const [loadingTemplates, setLoadingTemplates] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([])
  const [selectedCategory, setSelectedCategory] = useState<WorkflowCategory | "ALL">(preSelectedCategory || "ALL")
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(defaultTemplateId || null)
  const [workflowName, setWorkflowName] = useState("")

  // Fetch templates
  useEffect(() => {
    const fetchTemplates = async () => {
      setLoadingTemplates(true)
      try {
        const params = new URLSearchParams()
        if (selectedCategory !== "ALL") {
          params.append("category", selectedCategory)
        }

        const response = await fetch(`/api/n8n-templates?${params.toString()}`)
        if (!response.ok) {
          throw new Error("Failed to fetch templates")
        }

        const data = await response.json()
        setTemplates(data.templates)

        // If we have a defaultTemplateId, make sure it's selected
        if (defaultTemplateId && !selectedTemplateId) {
          setSelectedTemplateId(defaultTemplateId)

          // Find the template to get its name for the workflow name suggestion
          const template = data.templates.find((t: WorkflowTemplate) => t.id === defaultTemplateId)
          if (template) {
            setWorkflowName(`My ${template.name}`)
          }
        }
      } catch (error) {
        console.error("Error fetching templates:", error)
        toast({
          title: "Error fetching templates",
          description: "Failed to load workflow templates. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoadingTemplates(false)
      }
    }

    fetchTemplates()
  }, [selectedCategory, defaultTemplateId, selectedTemplateId])

  // Set a default name when a template is selected
  useEffect(() => {
    if (selectedTemplateId && !workflowName) {
      const template = templates.find((t) => t.id === selectedTemplateId)
      if (template) {
        setWorkflowName(`My ${template.name}`)
      }
    }
  }, [selectedTemplateId, templates, workflowName])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedTemplateId) {
      toast({
        title: "Select a template",
        description: "Please select a workflow template to continue.",
        variant: "destructive",
      })
      return
    }

    if (!workflowName.trim()) {
      toast({
        title: "Enter a name",
        description: "Please provide a name for your workflow.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch("/api/workflows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId: selectedTemplateId,
          name: workflowName.trim(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create workflow")
      }

      const workflow = await response.json()

      toast({
        title: "Workflow created",
        description: "Your new workflow has been created successfully.",
      })

      if (redirectAfterCreate) {
        // Redirect to the workflow configuration page
        router.push(`/dashboard/${slug}/agents/workflows/${workflow.id}/configure`)
      } else {
        // Reset the form
        setSelectedTemplateId(null)
        setWorkflowName("")
      }
    } catch (error) {
      console.error("Error creating workflow:", error)
      toast({
        title: "Error creating workflow",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Organize templates by category
  const featuredTemplates = templates.filter((t) => t.featured)
  const popularTemplates = templates.filter((t) => t.popular && !t.featured)
  const otherTemplates = templates.filter((t) => !t.featured && !t.popular)

  // Get all available categories
  const categories = Object.values(WorkflowCategory)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Category Filter */}
      <div className="space-y-2">
        <Label htmlFor="category">Filter by Category</Label>
        <RadioGroup
          id="category"
          value={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value as WorkflowCategory | "ALL")}
          className="flex flex-wrap gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ALL" id="category-all" />
            <Label htmlFor="category-all" className="cursor-pointer">
              All
            </Label>
          </div>

          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <RadioGroupItem value={category} id={`category-${category.toLowerCase()}`} />
              <Label htmlFor={`category-${category.toLowerCase()}`} className="cursor-pointer">
                {category
                  .replace(/_/g, " ")
                  .toLocaleLowerCase()
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Template Selection */}
      <div className="space-y-6">
        <Label htmlFor="template-selection">Select a Workflow Template</Label>

        {loadingTemplates ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </div>
          </div>
        ) : templates.length === 0 ? (
          <div className="bg-background border rounded-lg p-6 text-center">
            <p className="text-muted-foreground">No templates found for the selected category.</p>
            <Button variant="outline" className="mt-2" onClick={() => setSelectedCategory("ALL")}>
              View All Templates
            </Button>
          </div>
        ) : (
          <div id="template-selection" className="space-y-6">
            <TemplateGroup
              title="Featured Templates"
              templates={featuredTemplates}
              selectedTemplateId={selectedTemplateId}
              onSelectTemplate={setSelectedTemplateId}
            />

            <TemplateGroup
              title="Popular Templates"
              templates={popularTemplates}
              selectedTemplateId={selectedTemplateId}
              onSelectTemplate={setSelectedTemplateId}
            />

            <TemplateGroup
              title={selectedCategory === "ALL" ? "All Templates" : "Other Templates"}
              templates={otherTemplates}
              selectedTemplateId={selectedTemplateId}
              onSelectTemplate={setSelectedTemplateId}
            />
          </div>
        )}
      </div>

      {/* Workflow Name */}
      <div className="space-y-2">
        <Label htmlFor="workflow-name">Workflow Name</Label>
        <Input
          id="workflow-name"
          placeholder="Enter a name for your workflow"
          value={workflowName}
          onChange={(e) => setWorkflowName(e.target.value)}
          disabled={!selectedTemplateId || submitting}
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end">
        <Button type="submit" disabled={!selectedTemplateId || !workflowName.trim() || submitting}>
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Workflow
        </Button>
      </div>
    </form>
  )
}
