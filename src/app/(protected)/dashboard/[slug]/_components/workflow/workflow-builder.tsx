"use client"

import { useState, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Save, Activity, Shield, CreditCard, Calendar, Mail, ShoppingCart, Settings, AlertCircle } from "lucide-react"
import { type Workflow, type WorkflowStep, useWorkflows } from "@/hooks/use-workflows"
import type { Integration } from "@/hooks/use-integrations"
import { WorkflowCanvas } from "./workflow-canvas"
import { AIWorkflowAssistant } from "./ai-workflow-assistant"

interface WorkflowBuilderProps {
  workflow: Workflow
  integrations: Integration[]
  onWorkflowChange: (workflow: Workflow) => void
}

const getIntegrationIcon = (type: string) => {
  switch (type.toUpperCase()) {
    case "STRIPE":
      return CreditCard
    case "SHOPIFY":
      return ShoppingCart
    case "CALENDLY":
      return Calendar
    case "SENDGRID":
      return Mail
    default:
      return Settings
  }
}

export function WorkflowBuilder({ workflow, integrations, onWorkflowChange }: WorkflowBuilderProps) {
  const [isSaving, setIsSaving] = useState(false)
  const { saveWorkflow, updateWorkflow } = useWorkflows()
  const nameInputRef = useRef<HTMLInputElement>(null)
  const descriptionInputRef = useRef<HTMLInputElement>(null)

  const activeIntegrations = integrations.filter((i) => i.isActive)

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    try {
      const savedWorkflow = await saveWorkflow(workflow)
      if (savedWorkflow) {
        onWorkflowChange(savedWorkflow)
        toast({
          title: "Permission Set Saved",
          description: "Your AI agent permissions have been updated successfully.",
        })
      }
    } finally {
      setIsSaving(false)
    }
  }, [workflow, saveWorkflow, onWorkflowChange])

  const handleToggleActive = useCallback(async () => {
    const updatedWorkflow = {
      ...workflow,
      isActive: !workflow.isActive,
      updatedAt: new Date().toISOString(),
    }

    updateWorkflow(workflow.id, { isActive: !workflow.isActive })
    onWorkflowChange(updatedWorkflow)

    // Auto-save when toggling active state
    await saveWorkflow(updatedWorkflow)

    toast({
      title: workflow.isActive ? "Permission Set Deactivated" : "Permission Set Activated",
      description: workflow.isActive
        ? "AI agent permissions have been disabled."
        : "AI agent can now perform the configured actions.",
    })
  }, [workflow, updateWorkflow, onWorkflowChange, saveWorkflow])

  const handleWorkflowUpdate = useCallback(
    (updates: Partial<Workflow>) => {
      const updatedWorkflow = {
        ...workflow,
        ...updates,
        updatedAt: new Date().toISOString(),
      }

      updateWorkflow(workflow.id, updates)
      onWorkflowChange(updatedWorkflow)
    },
    [workflow, updateWorkflow, onWorkflowChange],
  )

  const handleAddPermission = useCallback(
    (integration: Integration, capability: any) => {
      const newStep: WorkflowStep = {
        id: `temp-step-${Date.now()}`,
        stepId: `permission_${workflow.steps.length + 1}`,
        stepType: "permission",
        integrationId: integration.id,
        integrationName: integration.name,
        capabilityId: capability.id,
        capabilityName: capability.name,
        config: {
          description: `Allow AI agent to ${capability.name.toLowerCase()} using ${integration.name}`,
          restrictions: [],
        },
        positionX: 100 + (workflow.steps.length % 3) * 250,
        positionY: 100 + Math.floor(workflow.steps.length / 3) * 150,
        stepOrder: workflow.steps.length,
      }

      handleWorkflowUpdate({
        steps: [...workflow.steps, newStep],
      })

      toast({
        title: "Permission Added",
        description: `AI agent can now ${capability.name.toLowerCase()} using ${integration.name}`,
      })
    },
    [workflow.steps, handleWorkflowUpdate],
  )

  const handleRemovePermission = useCallback(
    (stepId: string) => {
      const step = workflow.steps.find((s) => s.id === stepId)
      handleWorkflowUpdate({
        steps: workflow.steps.filter((s) => s.id !== stepId),
      })

      toast({
        title: "Permission Removed",
        description: step ? `${step.capabilityName} permission removed` : "Permission removed",
      })
    },
    [workflow.steps, handleWorkflowUpdate],
  )

  const handleStepsUpdate = useCallback(
    (steps: WorkflowStep[]) => {
      handleWorkflowUpdate({ steps })
    },
    [handleWorkflowUpdate],
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-3">
          <Input
            ref={nameInputRef}
            value={workflow.name}
            onChange={(e) => handleWorkflowUpdate({ name: e.target.value })}
            className="text-2xl font-bold border-none p-0 h-auto bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Permission Set Name"
          />
          <Input
            ref={descriptionInputRef}
            value={workflow.description}
            onChange={(e) => handleWorkflowUpdate({ description: e.target.value })}
            className="text-muted-foreground border-none p-0 h-auto bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Describe what permissions this set grants to your AI agent"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Label htmlFor="workflow-active" className="text-sm font-medium">
              {workflow.isActive ? "Active" : "Inactive"}
            </Label>
            <Switch id="workflow-active" checked={workflow.isActive} onCheckedChange={handleToggleActive} />
          </div>
          <Button onClick={handleSave} disabled={isSaving} size="sm">
            {isSaving ? (
              <>
                <Activity className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Permissions Canvas */}
        <div className="lg:col-span-3">
          <WorkflowCanvas workflow={workflow} onStepsUpdate={handleStepsUpdate} onRemoveStep={handleRemovePermission} />
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Add Permissions Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-4 w-4" />
                Grant Permissions
              </CardTitle>
              <CardDescription className="text-xs">Click to allow AI agent to perform these actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeIntegrations.map((integration) => {
                const IntegrationIcon = getIntegrationIcon(integration.type)
                return (
                  <div key={integration.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <IntegrationIcon className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">{integration.name}</span>
                    </div>
                    <div className="space-y-1 ml-6">
                      {integration.capabilities.map((capability) => {
                        const isGranted = workflow.steps.some(
                          (s) => s.integrationId === integration.id && s.capabilityId === capability.id,
                        )
                        return (
                          <Button
                            key={capability.id}
                            variant={isGranted ? "secondary" : "ghost"}
                            size="sm"
                            className="w-full justify-start text-xs h-8 hover:bg-primary/10"
                            onClick={() => !isGranted && handleAddPermission(integration, capability)}
                            disabled={isGranted}
                          >
                            <Shield className="h-3 w-3 mr-2" />
                            {capability.name}
                            {isGranted && <span className="ml-auto text-xs text-muted-foreground">✓</span>}
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}

              {activeIntegrations.length === 0 && (
                <div className="text-center py-4">
                  <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No active integrations. Enable integrations to grant permissions.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Assistant */}
          <AIWorkflowAssistant
            workflow={workflow}
            integrations={integrations}
            onWorkflowUpdate={handleWorkflowUpdate}
          />
        </div>
      </div>
    </div>
  )
}
