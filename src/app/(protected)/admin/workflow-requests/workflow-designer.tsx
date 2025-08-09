
"use client"

import type * as React from "react"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, ArrowLeft, Save, Upload, Loader2, Settings } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import type {
  CustomWorkflowRequest,
  WorkflowTemplate,
  ParsedWorkflow,
  WorkflowComplexity,
  WorkflowTemplateCategory,
  Integration,
  CredentialField,
} from "@/types/workflow"

interface AdminWorkflowDesignerProps {
  initialRequest?: CustomWorkflowRequest | null
  initialTemplate?: WorkflowTemplate | null
  onBackToDashboard: () => void
  onTemplateSaved: () => void
}

const defaultWorkflowDesign: ParsedWorkflow = {
  title: "New Workflow Template",
  description: "A description of this new workflow template.",
  steps: [],
  benefits: [],
  integrations: [], // This will be populated with detailed Integration objects
  metrics: {
    automationRate: "N/A",
    responseTime: "N/A",
    accuracy: "N/A",
  },
  complexity: "MEDIUM",
  estimatedCost: "N/A",
  roi: "N/A",
}

const defaultTemplateForm = {
  name: "",
  category: "CUSTOM" as WorkflowTemplateCategory,
  description: "",
  complexity: "MEDIUM" as WorkflowComplexity,
  isPublic: false,
  isActive: true,
  operations: [] as string[],
  features: [] as string[],
  integrations: [] as Integration[], // Now stores detailed Integration objects
  voiceflowProjectId: "",
  voiceflowVersionId: "",
}

const AdminWorkflowDesigner: React.FC<AdminWorkflowDesignerProps> = ({
  initialRequest,
  initialTemplate,
  onBackToDashboard,
  onTemplateSaved,
}) => {
  const [workflowDesign, setWorkflowDesign] = useState<ParsedWorkflow>(defaultWorkflowDesign)
  const [templateForm, setTemplateForm] = useState(defaultTemplateForm)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (initialRequest?.aiSuggestions?.workflowDesign) {
      setWorkflowDesign(initialRequest.aiSuggestions.workflowDesign)
      setTemplateForm((prev) => ({
        ...prev,
        name: initialRequest.aiSuggestions?.workflowDesign?.title || initialRequest.title,
        description: initialRequest.aiSuggestions?.workflowDesign?.description || initialRequest.businessObjective,
        complexity: initialRequest.aiSuggestions?.workflowDesign?.complexity || "MEDIUM",
        operations: initialRequest.aiSuggestions?.workflowDesign?.steps?.map((s) => s.title) || [],
        features: initialRequest.aiSuggestions?.workflowDesign?.benefits || [],
        integrations: initialRequest.aiSuggestions?.workflowDesign?.integrations || [], // Use detailed integrations
      }))
    } else if (initialTemplate) {
      setWorkflowDesign(initialTemplate.workflowDesign || defaultWorkflowDesign)
      setTemplateForm({
        name: initialTemplate.name,
        category: initialTemplate.category,
        description: initialTemplate.description,
        complexity: initialTemplate.complexity,
        isPublic: initialTemplate.isPublic,
        isActive: initialTemplate.isActive,
        operations: initialTemplate.operations,
        features: initialTemplate.features,
        integrations: initialTemplate.integrations, // Use detailed integrations
        voiceflowProjectId: initialTemplate.voiceflowProjectId || "",
        voiceflowVersionId: initialTemplate.voiceflowVersionId || "",
      })
    } else {
      setWorkflowDesign(defaultWorkflowDesign)
      setTemplateForm(defaultTemplateForm)
    }
  }, [initialRequest, initialTemplate])

  const handleTemplateFormChange = useCallback((field: keyof typeof defaultTemplateForm, value: any) => {
    setTemplateForm((prev) => ({ ...prev, [field]: value }))
  }, [])

  const addIntegration = useCallback(() => {
    setTemplateForm((prev) => ({
      ...prev,
      integrations: [
        ...prev.integrations,
        {
          id: `new-integration-${prev.integrations.length + 1}`,
          name: "",
          description: "",
          pricing: "N/A",
          category: "Other",
          credentialFields: [],
          credentialInstructions: "",
        },
      ],
    }))
  }, [])

  const removeIntegration = useCallback((index: number) => {
    setTemplateForm((prev) => {
      const newIntegrations = prev.integrations.filter((_, i) => i !== index)
      return { ...prev, integrations: newIntegrations }
    })
  }, [])

  const handleIntegrationChange = useCallback((index: number, field: keyof Integration, value: any) => {
    setTemplateForm((prev) => {
      const newIntegrations = [...prev.integrations]
      newIntegrations[index] = { ...newIntegrations[index], [field]: value }
      return { ...prev, integrations: newIntegrations }
    })
  }, [])

  const addCredentialField = useCallback((integrationIndex: number) => {
    setTemplateForm((prev) => {
      const newIntegrations = [...prev.integrations]
      const integration = { ...newIntegrations[integrationIndex] }
      integration.credentialFields = [
        ...(integration.credentialFields || []),
        { name: "", label: "", type: "text", required: true },
      ]
      newIntegrations[integrationIndex] = integration
      return { ...prev, integrations: newIntegrations }
    })
  }, [])

  const removeCredentialField = useCallback((integrationIndex: number, fieldIndex: number) => {
    setTemplateForm((prev) => {
      const newIntegrations = [...prev.integrations]
      const integration = { ...newIntegrations[integrationIndex] }
      integration.credentialFields = (integration.credentialFields || []).filter((_, i) => i !== fieldIndex)
      newIntegrations[integrationIndex] = integration
      return { ...prev, integrations: newIntegrations }
    })
  }, [])

  const handleCredentialFieldChange = useCallback(
    (integrationIndex: number, fieldIndex: number, field: keyof CredentialField, value: any) => {
      setTemplateForm((prev) => {
        const newIntegrations = [...prev.integrations]
        const integration = { ...newIntegrations[integrationIndex] }
        const newCredentialFields = [...(integration.credentialFields || [])]
        newCredentialFields[fieldIndex] = { ...newCredentialFields[fieldIndex], [field]: value }
        integration.credentialFields = newCredentialFields
        newIntegrations[integrationIndex] = integration
        return { ...prev, integrations: newIntegrations }
      })
    },
    [],
  )

  const handleSaveTemplate = async (publish: boolean) => {
    setIsSaving(true)
    try {
      const templateData = {
        ...templateForm,
        // Operations and features can be derived from workflowDesign if needed, or kept separate
        // For now, we'll use the ones directly managed in templateForm
        workflowDesign: workflowDesign, // Save the full design (read-only from request, editable for new)
        isPublic: publish, // Set public status based on button
        originalRequestId: initialRequest?.id || undefined, // Link to original request if applicable
        createdByAdmin: true,
      }

      let response
      if (initialTemplate?.id) {
        // Update existing template
        response = await fetch(`/api/admin/workflow-templates/${initialTemplate.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(templateData),
        })
      } else {
        // Create new template
        response = await fetch("/api/admin/workflow-templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(templateData),
        })
      }

      if (response.ok) {
        toast({
          title: "Success!",
          description: `Template ${publish ? "published" : "saved as draft"} successfully.`,
          variant: "default",
        })
        onTemplateSaved() // Notify parent to refresh templates
        onBackToDashboard() // Go back to dashboard after saving
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to save template.")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBackToDashboard}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h2 className="text-3xl font-bold">
          {initialTemplate ? "Edit Workflow Template" : "Design Workflow Template"}
        </h2>
        <div className="flex gap-2">
          <Button onClick={() => handleSaveTemplate(false)} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            {initialTemplate ? "Save Changes" : "Save Draft"}
          </Button>
          <Button onClick={() => handleSaveTemplate(true)} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
            Publish Template
          </Button>
        </div>
      </div>

      {initialRequest && (
        <Card className="border-l-4 border-blue-500">
          <CardHeader>
            <CardTitle>Original Request Details</CardTitle>
            <CardDescription>
              This template is being designed based on a user&apos;s custom workflow request.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Request Title:</p>
              <p className="text-lg font-semibold">{initialRequest.title}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Business Objective:</p>
              <p className="text-lg font-semibold">{initialRequest.businessObjective}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Requested by:</p>
              <p className="text-lg font-semibold">
                {initialRequest.user.firstname} {initialRequest.user.lastname} ({initialRequest.user.email})
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Current Status:</p>
              <Badge>{initialRequest.status}</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Template Information</CardTitle>
          <CardDescription>Define the core details for this workflow template.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="template-name">Template Name</Label>
            <Input
              id="template-name"
              value={templateForm.name}
              onChange={(e) => handleTemplateFormChange("name", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="template-category">Category</Label>
            <Select
              value={templateForm.category}
              onValueChange={(value) => handleTemplateFormChange("category", value as WorkflowTemplateCategory)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AI_ASSISTANT">AI Assistant</SelectItem>
                <SelectItem value="CUSTOM">Custom</SelectItem>
                <SelectItem value="SALES">Sales</SelectItem>
                <SelectItem value="MARKETING">Marketing</SelectItem>
                <SelectItem value="SUPPORT">Support</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Label htmlFor="template-description">Description</Label>
            <Textarea
              id="template-description"
              value={templateForm.description}
              onChange={(e) => handleTemplateFormChange("description", e.target.value)}
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="template-complexity">Complexity</Label>
            <Select
              value={templateForm.complexity}
              onValueChange={(value) => handleTemplateFormChange("complexity", value as WorkflowComplexity)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select complexity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2 mt-6">
            <Switch
              id="is-public"
              checked={templateForm.isPublic}
              onCheckedChange={(checked) => handleTemplateFormChange("isPublic", checked)}
            />
            <Label htmlFor="is-public">Publicly Available</Label>
          </div>
          <div className="flex items-center space-x-2 mt-6">
            <Switch
              id="is-active"
              checked={templateForm.isActive}
              onCheckedChange={(checked) => handleTemplateFormChange("isActive", checked)}
            />
            <Label htmlFor="is-active">Active Template</Label>
          </div>
          <div>
            <Label htmlFor="voiceflow-project-id">Voiceflow Project ID (Optional)</Label>
            <Input
              id="voiceflow-project-id"
              value={templateForm.voiceflowProjectId}
              onChange={(e) => handleTemplateFormChange("voiceflowProjectId", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="voiceflow-version-id">Voiceflow Version ID (Optional)</Label>
            <Input
              id="voiceflow-version-id"
              value={templateForm.voiceflowVersionId}
              onChange={(e) => handleTemplateFormChange("voiceflowVersionId", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {initialRequest?.aiSuggestions?.workflowDesign && (
        <Card>
          <CardHeader>
            <CardTitle>User&apos;s AI-Suggested Workflow Design (Read-Only)</CardTitle>
            <CardDescription>
              This is the workflow design suggested by AI based on the user&apos;s request. Use this as a reference to build
              the actual Voiceflow project and configure the template.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm">Title:</h4>
              <p className="text-muted-foreground">{workflowDesign.title}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm">Description:</h4>
              <p className="text-muted-foreground">{workflowDesign.description}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm">Steps:</h4>
              {workflowDesign.steps.length === 0 ? (
                <p className="text-muted-foreground italic">No steps provided in AI design.</p>
              ) : (
                <ul className="list-decimal list-inside space-y-2 text-muted-foreground">
                  {workflowDesign.steps.map((step, index) => (
                    <li key={index}>
                      <strong>{step.title}</strong> ({step.type}) - {step.description}
                      {step.selectedIntegrations && step.selectedIntegrations.length > 0 && (
                        <span className="ml-2 text-xs text-blue-600">
                          (Integrates with: {step.selectedIntegrations.map((i) => i.name).join(", ")})
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-sm">Benefits:</h4>
              {workflowDesign.benefits.length === 0 ? (
                <p className="text-muted-foreground italic">No benefits listed.</p>
              ) : (
                <ul className="list-disc list-inside text-muted-foreground">
                  {workflowDesign.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-sm">Suggested Integrations:</h4>
              {workflowDesign.integrations.length === 0 ? (
                <p className="text-muted-foreground italic">No integrations suggested by AI.</p>
              ) : (
                <div className="flex flex-wrap gap-2 mt-1">
                  {workflowDesign.integrations.map((integration, index) => (
                    <Badge key={index} variant="outline">
                      {integration.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sm">Estimated Cost:</h4>
                <p className="text-muted-foreground">{workflowDesign.estimatedCost || "N/A"}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Expected ROI:</h4>
                <p className="text-muted-foreground">{workflowDesign.roi || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Required Integrations & Credentials</CardTitle>
          <CardDescription>
            Define the external services this workflow connects to and the credentials users need to provide.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {templateForm.integrations.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <Settings className="h-12 w-12 mx-auto mb-4" />
              <p>No integrations added yet. Click &ldquo;Add Integration&rdquo; to specify required connections.</p>
            </div>
          )}
          {templateForm.integrations.map((integration, integrationIndex) => (
            <Card key={integrationIndex} className="border-2 border-border/50 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold">Integration #{integrationIndex + 1}</h4>
                <Button variant="ghost" size="icon" onClick={() => removeIntegration(integrationIndex)}>
                  <Trash2 className="h-5 w-5 text-red-500" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`integration-name-${integrationIndex}`}>Integration Name</Label>
                  <Input
                    id={`integration-name-${integrationIndex}`}
                    value={integration.name}
                    onChange={(e) => handleIntegrationChange(integrationIndex, "name", e.target.value)}
                    placeholder="e.g., Salesforce, Mailchimp"
                  />
                </div>
                <div>
                  <Label htmlFor={`integration-category-${integrationIndex}`}>Category</Label>
                  <Input
                    id={`integration-category-${integrationIndex}`}
                    value={integration.category}
                    onChange={(e) => handleIntegrationChange(integrationIndex, "category", e.target.value)}
                    placeholder="e.g., CRM, Email Marketing"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor={`integration-description-${integrationIndex}`}>Description</Label>
                  <Textarea
                    id={`integration-description-${integrationIndex}`}
                    value={integration.description}
                    onChange={(e) => handleIntegrationChange(integrationIndex, "description", e.target.value)}
                    rows={2}
                    placeholder="Brief description of this integration's purpose."
                  />
                </div>
                <div>
                  <Label htmlFor={`integration-pricing-${integrationIndex}`}>Pricing Model</Label>
                  <Input
                    id={`integration-pricing-${integrationIndex}`}
                    value={integration.pricing}
                    onChange={(e) => handleIntegrationChange(integrationIndex, "pricing", e.target.value)}
                    placeholder="e.g., Free, Paid, Per-use"
                  />
                </div>
                <div>
                  <Label htmlFor={`integration-logo-${integrationIndex}`}>Logo URL (Optional)</Label>
                  <Input
                    id={`integration-logo-${integrationIndex}`}
                    value={integration.logoUrl || ""}
                    onChange={(e) => handleIntegrationChange(integrationIndex, "logoUrl", e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>

              <div className="space-y-3 border-t pt-4 mt-4">
                <h5 className="font-semibold text-md">Credential Fields:</h5>
                {integration.credentialFields.length === 0 && (
                  <p className="text-muted-foreground text-sm italic">
                    No credential fields defined for this integration.
                  </p>
                )}
                {integration.credentialFields.map((field, fieldIndex) => (
                  <div key={fieldIndex} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                    <div>
                      <Label htmlFor={`field-name-${integrationIndex}-${fieldIndex}`} className="text-xs">
                        Field Name
                      </Label>
                      <Input
                        id={`field-name-${integrationIndex}-${fieldIndex}`}
                        value={field.name}
                        onChange={(e) =>
                          handleCredentialFieldChange(integrationIndex, fieldIndex, "name", e.target.value)
                        }
                        placeholder="e.g., apiKey"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`field-label-${integrationIndex}-${fieldIndex}`} className="text-xs">
                        Display Label
                      </Label>
                      <Input
                        id={`field-label-${integrationIndex}-${fieldIndex}`}
                        value={field.label}
                        onChange={(e) =>
                          handleCredentialFieldChange(integrationIndex, fieldIndex, "label", e.target.value)
                        }
                        placeholder="e.g., API Key"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`field-type-${integrationIndex}-${fieldIndex}`} className="text-xs">
                        Type
                      </Label>
                      <Select
                        value={field.type}
                        onValueChange={(value) =>
                          handleCredentialFieldChange(
                            integrationIndex,
                            fieldIndex,
                            "type",
                            value as CredentialField["type"],
                          )
                        }
                      >
                        <SelectTrigger id={`field-type-${integrationIndex}-${fieldIndex}`} className="h-8 text-sm">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="password">Password</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="url">URL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`field-required-${integrationIndex}-${fieldIndex}`}
                          checked={field.required}
                          onCheckedChange={(checked) =>
                            handleCredentialFieldChange(integrationIndex, fieldIndex, "required", checked)
                          }
                          className="scale-75"
                        />
                        <Label htmlFor={`field-required-${integrationIndex}-${fieldIndex}`} className="text-xs">
                          Required
                        </Label>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCredentialField(integrationIndex, fieldIndex)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addCredentialField(integrationIndex)}
                  className="mt-2"
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Credential Field
                </Button>
              </div>

              <div className="space-y-2 border-t pt-4 mt-4">
                <Label htmlFor={`instructions-${integrationIndex}`}>Instructions for User</Label>
                <Textarea
                  id={`instructions-${integrationIndex}`}
                  value={integration.credentialInstructions}
                  onChange={(e) => handleIntegrationChange(integrationIndex, "credentialInstructions", e.target.value)}
                  rows={4}
                  placeholder="Provide clear steps for the user to obtain these credentials (e.g., 'Go to Settings > API Keys > Generate New Key')."
                />
              </div>
            </Card>
          ))}
          <Button onClick={addIntegration} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminWorkflowDesigner



