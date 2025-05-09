"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter,usePathname } from "next/navigation"
import { Loader2, ChevronRight, AlertCircle, Lock } from "lucide-react"
import type { WorkflowStatus } from "@prisma/client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { WorkflowCredentialsForm } from "./workflow-credentials-form"
import type { WorkflowConfigSchema, WorkflowConfigSection, WorkflowConfigField } from "@/types/n8n"

interface WorkflowConfigurationFormProps {
  workflowId: string
  activateAfterSave?: boolean
}

interface WorkflowData {
  id: string
  name: string
  status: WorkflowStatus
  isActive: boolean
  n8nWorkflowId: string | null
  configuration: Record<string, any>
  template: {
    id: string
    name: string
    description: string
    configurationSchema: WorkflowConfigSchema
    requiredIntegrations: string[]
  }
  credentials: Array<{
    id: string
    name: string
    type: string
  }>
}

export function WorkflowConfigurationForm({ workflowId, activateAfterSave = false }: WorkflowConfigurationFormProps) {
  const router = useRouter()
  const pathname = usePathname()
  const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
  const slug = slugMatch ? slugMatch[1] : "" // Extract just the captured group
  

  // State
  const [isLoading, setIsLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [workflow, setWorkflow] = useState<WorkflowData | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState("configuration")

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

        // Initialize form data with existing configuration or empty object
        setFormData(data.configuration || {})

        // If template requires credentials and none are set, switch to credentials tab
        if (data.template.requiredIntegrations?.length > 0 && (!data.credentials || data.credentials.length === 0)) {
          setActiveTab("credentials")
        }
      } catch (error) {
        console.error("Error fetching workflow:", error)
        toast({
          title: "Error",
          description: "Failed to load workflow configuration. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchWorkflow()
  }, [workflowId])

  // Handle form field changes
  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }))

    // Remove field from invalid set if it's now valid
    if (invalidFields.has(fieldName)) {
      const newInvalidFields = new Set(invalidFields)
      newInvalidFields.delete(fieldName)
      setInvalidFields(newInvalidFields)
    }
  }

  // Validate form fields
  const validateFields = (): boolean => {
    if (!workflow) return false

    const invalidFields = new Set<string>()
    const { configurationSchema } = workflow.template

    configurationSchema.sections.forEach((section) => {
      section.fields.forEach((field) => {
        if (field.required && (formData[field.name] === undefined || formData[field.name] === "")) {
          invalidFields.add(field.name)
        }

        // Validation rules
        if (field.validation) {
          const value = formData[field.name]

          if (value !== undefined) {
            if (field.validation.min !== undefined && value < field.validation.min) {
              invalidFields.add(field.name)
            }

            if (field.validation.max !== undefined && value > field.validation.max) {
              invalidFields.add(field.name)
            }

            if (field.validation.pattern && typeof value === "string") {
              const pattern = new RegExp(field.validation.pattern)
              if (!pattern.test(value)) {
                invalidFields.add(field.name)
              }
            }
          }
        }
      })
    })

    setInvalidFields(invalidFields)
    return invalidFields.size === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!workflow) return

    // Validate fields
    if (!validateFields()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch(`/api/workflows/${workflowId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          configuration: formData,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update workflow configuration")
      }

      const updatedWorkflow = await response.json()
      setWorkflow(updatedWorkflow)

      toast({
        title: "Configuration Saved",
        description: "Your workflow configuration has been saved successfully.",
      })

      // If the workflow was in DRAFT state, it should now be in READY state
      if (workflow.status === "DRAFT" && updatedWorkflow.status === "READY") {
        if (activateAfterSave) {
          // Activate the workflow
          await activateWorkflow()
        }
      }

      // If we need to set up credentials but they're not set yet, switch to credentials tab
      if (
        updatedWorkflow.template.requiredIntegrations?.length > 0 &&
        (!updatedWorkflow.credentials || updatedWorkflow.credentials.length === 0)
      ) {
        setActiveTab("credentials")
      } else if (activateAfterSave && updatedWorkflow.status === "READY" && !updatedWorkflow.isActive) {
        // Activate the workflow
        await activateWorkflow()
      }
    } catch (error) {
      console.error("Error updating workflow configuration:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Activate workflow
  const activateWorkflow = async () => {
    if (!workflow) return

    try {
      const response = await fetch(`/api/workflows/${workflowId}/activate`, {
        method: "POST",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to activate workflow")
      }

      const activatedWorkflow = await response.json()
      setWorkflow(activatedWorkflow)

      toast({
        title: "Workflow Activated",
        description: "Your workflow has been activated and is now ready to run.",
      })

      // Redirect to workflow detail page
      router.push(`/dashboard/${slug}/agents/workflows/${workflowId}`)
    } catch (error) {
      console.error("Error activating workflow:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    }
  }

  // Handle credential update
  const handleCredentialsUpdate = () => {
    // Refresh workflow data to get updated credentials
    const fetchWorkflow = async () => {
      try {
        const response = await fetch(`/api/workflows/${workflowId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch workflow")
        }

        const data = await response.json()
        setWorkflow(data)

        // Switch back to configuration tab if needed
        if (activeTab === "credentials") {
          setActiveTab("configuration")
        }
      } catch (error) {
        console.error("Error refreshing workflow:", error)
      }
    }

    fetchWorkflow()
  }

  // Render field based on type
  const renderField = (field: WorkflowConfigField) => {
    const value = formData[field.name] !== undefined ? formData[field.name] : field.default
    const isInvalid = invalidFields.has(field.name)

    // Check if field depends on another field
    if (field.dependsOn) {
      const dependencyValue = formData[field.dependsOn.field]
      if (dependencyValue !== field.dependsOn.value) {
        return null
      }
    }

    switch (field.type) {
      case "text":
        return (
          <Input
            id={field.name}
            value={value || ""}
            placeholder={field.placeholder}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className={isInvalid ? "border-destructive" : ""}
          />
        )

      case "number":
        return (
          <Input
            id={field.name}
            type="number"
            value={value || ""}
            placeholder={field.placeholder}
            onChange={(e) => handleFieldChange(field.name, e.target.value === "" ? "" : Number(e.target.value))}
            className={isInvalid ? "border-destructive" : ""}
            min={field.validation?.min}
            max={field.validation?.max}
          />
        )

      case "textarea":
        return (
          <Textarea
            id={field.name}
            value={value || ""}
            placeholder={field.placeholder}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className={isInvalid ? "border-destructive" : ""}
          />
        )

      case "boolean":
        return (
          <Switch
            id={field.name}
            checked={!!value}
            onCheckedChange={(checked) => handleFieldChange(field.name, checked)}
          />
        )

      case "select":
        return (
          <Select value={value || ""} onValueChange={(newValue) => handleFieldChange(field.name, newValue)}>
            <SelectTrigger className={isInvalid ? "border-destructive" : ""}>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "multiselect":
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.name}-${option.value}`}
                  checked={Array.isArray(value) && value.includes(option.value)}
                  onCheckedChange={(checked) => {
                    const currentValues = Array.isArray(value) ? [...value] : []
                    if (checked) {
                      if (!currentValues.includes(option.value)) {
                        handleFieldChange(field.name, [...currentValues, option.value])
                      }
                    } else {
                      handleFieldChange(
                        field.name,
                        currentValues.filter((v) => v !== option.value),
                      )
                    }
                  }}
                />
                <Label htmlFor={`${field.name}-${option.value}`} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        )

      case "credential":
        return (
          <div className="space-y-2">
            <div className="flex items-center text-muted-foreground text-sm">
              <Lock className="mr-1 h-4 w-4" />
              Managed in the Credentials tab
            </div>
            <Button variant="outline" type="button" onClick={() => setActiveTab("credentials")}>
              Configure Credentials
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        )

      case "json":
      case "code":
        return (
          <Textarea
            id={field.name}
            value={typeof value === "object" ? JSON.stringify(value, null, 2) : value || ""}
            placeholder={field.placeholder}
            onChange={(e) => {
              try {
                const jsonValue = JSON.parse(e.target.value)
                handleFieldChange(field.name, jsonValue)
              } catch {
                // If not valid JSON, store as string
                handleFieldChange(field.name, e.target.value)
              }
            }}
            className={`font-mono h-40 ${isInvalid ? "border-destructive" : ""}`}
          />
        )

      default:
        return <span>Unsupported field type: {field.type}</span>
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full" />

        <div className="space-y-4">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-32 w-full" />
        </div>

        <div className="space-y-4">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  }

  if (!workflow) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load workflow configuration. Please try again.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configure Workflow</h1>
        <p className="text-muted-foreground">
          Set up your &quot;{workflow.name}&quot; workflow based on the {workflow.template.name} template
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="credentials">
            Credentials
            {workflow.template.requiredIntegrations?.length > 0 &&
              (!workflow.credentials || workflow.credentials.length === 0) && (
                <span className="ml-1 rounded-full bg-destructive text-destructive-foreground w-4 h-4 text-xs flex items-center justify-center">
                  !
                </span>
              )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="configuration" className="space-y-6 py-4">
          {workflow.template.requiredIntegrations?.length > 0 &&
            (!workflow.credentials || workflow.credentials.length === 0) && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Credentials Required</AlertTitle>
                <AlertDescription>
                  This workflow requires credentials for {workflow.template.requiredIntegrations.join(", ")}. Please set
                  up your credentials in the Credentials tab before activating this workflow.
                </AlertDescription>
              </Alert>
            )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Render configuration sections */}
            {workflow.template.configurationSchema.sections.map((section: WorkflowConfigSection) => (
              <Card key={section.id}>
                <CardHeader>
                  <CardTitle>{section.title}</CardTitle>
                  {section.description && <CardDescription>{section.description}</CardDescription>}
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.fields.map((field: WorkflowConfigField) => (
                    <div key={field.name} className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor={field.name} className="flex items-center">
                          {field.label}
                          {field.required && <span className="text-destructive ml-1">*</span>}
                          {field.advanced && <span className="text-xs ml-2 text-muted-foreground">(Advanced)</span>}
                        </Label>
                      </div>
                      {field.description && <p className="text-sm text-muted-foreground">{field.description}</p>}
                      {renderField(field)}
                      {invalidFields.has(field.name) && (
                        <p className="text-xs text-destructive mt-1">
                          {field.validation?.message || "This field is required or invalid"}
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/workflows/${workflowId}`)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Configuration
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="credentials" className="py-4">
          <WorkflowCredentialsForm
            workflowId={workflowId}
            requiredIntegrations={workflow.template.requiredIntegrations}
            existingCredentials={workflow.credentials}
            onUpdate={handleCredentialsUpdate}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
