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

// JSON Schema types
interface JsonSchemaProperty {
  type: string;
  title?: string;
  description?: string;
  required?: string[];
  properties?: Record<string, JsonSchemaProperty>;
  enum?: string[];
  default?: any;
  minimum?: number;
  maximum?: number;
  pattern?: string;
  dependencies?: Record<string, any>;
  // Add other JSON Schema properties as needed
}

interface ConfigurationSchema {
  type: string;
  required?: string[];
  properties: Record<string, JsonSchemaProperty>;
}

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
    configurationSchema: ConfigurationSchema
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

    // Process JSON Schema properties
    if (configurationSchema?.properties) {
      Object.entries(configurationSchema.properties).forEach(([propertyKey, property]) => {
        if (property.properties) {
          // Handle nested properties (like generalSettings.workflowName)
          Object.entries(property.properties).forEach(([nestedKey, nestedProperty]) => {
            const fieldName = `${propertyKey}.${nestedKey}`
            const isRequired = property.required?.includes(nestedKey) || false
            const value = formData[fieldName]

            if (isRequired && (value === undefined || value === "")) {
              invalidFields.add(fieldName)
            }

            // Validation rules
            if (value !== undefined && value !== "") {
              if (nestedProperty.minimum !== undefined && Number(value) < nestedProperty.minimum) {
                invalidFields.add(fieldName)
              }
              if (nestedProperty.maximum !== undefined && Number(value) > nestedProperty.maximum) {
                invalidFields.add(fieldName)
              }
              if (nestedProperty.pattern && typeof value === "string") {
                const pattern = new RegExp(nestedProperty.pattern)
                if (!pattern.test(value)) {
                  invalidFields.add(fieldName)
                }
              }
            }
          })
        }
      })
    }

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
          // Activate the workflo
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
  const renderField = (fieldName: string, fieldSchema: JsonSchemaProperty, isRequired: boolean = false) => {
    const value = formData[fieldName] !== undefined ? formData[fieldName] : fieldSchema.default
    const isInvalid = invalidFields.has(fieldName)

    // Check dependencies
    if (fieldSchema.dependencies) {
      for (const [depKey, depValue] of Object.entries(fieldSchema.dependencies)) {
        if (formData[depKey] !== depValue) {
          return null
        }
      }
    }

    switch (fieldSchema.type) {
      case "string":
        if (fieldSchema.enum) {
          // Render as select for enum values
          return (
            <Select value={value || ""} onValueChange={(newValue) => handleFieldChange(fieldName, newValue)}>
              <SelectTrigger className={isInvalid ? "border-destructive" : ""}>
                <SelectValue placeholder={`Select ${fieldSchema.title || fieldName}`} />
              </SelectTrigger>
              <SelectContent>
                {fieldSchema.enum.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        }
        
        // Check if it's a textarea (long text)
        if (fieldSchema.description?.includes('textarea') || fieldName.includes('description')) {
          return (
            <Textarea
              id={fieldName}
              value={value || ""}
              placeholder={fieldSchema.title || fieldName}
              onChange={(e) => handleFieldChange(fieldName, e.target.value)}
              className={isInvalid ? "border-destructive" : ""}
            />
          )
        }
        
        return (
          <Input
            id={fieldName}
            value={value || ""}
            placeholder={fieldSchema.title || fieldName}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            className={isInvalid ? "border-destructive" : ""}
          />
        )

      case "number":
      case "integer":
        return (
          <Input
            id={fieldName}
            type="number"
            value={value || ""}
            placeholder={fieldSchema.title || fieldName}
            onChange={(e) => handleFieldChange(fieldName, e.target.value === "" ? "" : Number(e.target.value))}
            className={isInvalid ? "border-destructive" : ""}
            min={fieldSchema.minimum}
            max={fieldSchema.maximum}
          />
        )

      case "boolean":
        return (
          <Switch
            id={fieldName}
            checked={!!value}
            onCheckedChange={(checked) => handleFieldChange(fieldName, checked)}
          />
        )

      case "array":
        if (fieldSchema.enum) {
          // Multi-select for array with enum
          return (
            <div className="space-y-2">
              {fieldSchema.enum.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${fieldName}-${option}`}
                    checked={Array.isArray(value) && value.includes(option)}
                    onCheckedChange={(checked) => {
                      const currentValues = Array.isArray(value) ? [...value] : []
                      if (checked) {
                        if (!currentValues.includes(option)) {
                          handleFieldChange(fieldName, [...currentValues, option])
                        }
                      } else {
                        handleFieldChange(
                          fieldName,
                          currentValues.filter((v) => v !== option),
                        )
                      }
                    }}
                  />
                  <Label htmlFor={`${fieldName}-${option}`} className="cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          )
        }
        return (
          <Textarea
            id={fieldName}
            value={Array.isArray(value) ? value.join(', ') : value || ""}
            placeholder={`Enter values separated by commas`}
            onChange={(e) => handleFieldChange(fieldName, e.target.value.split(',').map(v => v.trim()))}
            className={isInvalid ? "border-destructive" : ""}
          />
        )

      case "object":
        return (
          <Textarea
            id={fieldName}
            value={typeof value === "object" ? JSON.stringify(value, null, 2) : value || ""}
            placeholder={fieldSchema.title || fieldName}
            onChange={(e) => {
              try {
                const jsonValue = JSON.parse(e.target.value)
                handleFieldChange(fieldName, jsonValue)
              } catch {
                // If not valid JSON, store as string
                handleFieldChange(fieldName, e.target.value)
              }
            }}
            className={`font-mono h-40 ${isInvalid ? "border-destructive" : ""}`}
          />
        )

      default:
        return <span>Unsupported field type: {fieldSchema.type}</span>
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
            {workflow.template.configurationSchema?.properties && 
              Object.entries(workflow.template.configurationSchema.properties).map(([sectionKey, section]) => (
                <Card key={sectionKey}>
                  <CardHeader>
                    <CardTitle>{section.title || sectionKey}</CardTitle>
                    {section.description && <CardDescription>{section.description}</CardDescription>}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {section.properties && Object.entries(section.properties).map(([fieldKey, fieldSchema]) => {
                      const fieldName = `${sectionKey}.${fieldKey}`
                      const isRequired = section.required?.includes(fieldKey) || false
                      
                      return (
                        <div key={fieldName} className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor={fieldName} className="flex items-center">
                              {fieldSchema.title || fieldKey}
                              {isRequired && <span className="text-destructive ml-1">*</span>}
                            </Label>
                          </div>
                          {fieldSchema.description && <p className="text-sm text-muted-foreground">{fieldSchema.description}</p>}
                          {renderField(fieldName, fieldSchema, isRequired)}
                          {invalidFields.has(fieldName) && (
                            <p className="text-xs text-destructive mt-1">
                              This field is required or invalid
                            </p>
                          )}
                        </div>
                      )
                    })}
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