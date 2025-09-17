"use client"

import { useState, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Save, Activity, Plus, CreditCard, Calendar, Mail, ShoppingCart, Settings } from "lucide-react"
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

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    try {
      const savedWorkflow = await saveWorkflow(workflow)
      if (savedWorkflow) {
        onWorkflowChange(savedWorkflow)
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

  const handleAddStep = useCallback(
    (integration: Integration, capability: any) => {
      const newStep: WorkflowStep = {
        id: `temp-step-${Date.now()}`,
        stepId: `step_${workflow.steps.length + 1}`,
        stepType: workflow.steps.length === 0 ? "trigger" : "action",
        integrationId: integration.id,
        integrationName: integration.name,
        capabilityId: capability.id,
        capabilityName: capability.name,
        config: {},
        positionX: 100 + workflow.steps.length * 200,
        positionY: 100,
        stepOrder: workflow.steps.length,
      }

      handleWorkflowUpdate({
        steps: [...workflow.steps, newStep],
      })

      toast({
        title: "Step Added",
        description: `${capability.name} added to workflow`,
      })
    },
    [workflow.steps, handleWorkflowUpdate],
  )

  const handleRemoveStep = useCallback(
    (stepId: string) => {
      handleWorkflowUpdate({
        steps: workflow.steps.filter((s) => s.id !== stepId),
      })

      toast({
        title: "Step Removed",
        description: "Step removed from workflow",
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
            placeholder="Workflow Name"
          />
          <Input
            ref={descriptionInputRef}
            value={workflow.description}
            onChange={(e) => handleWorkflowUpdate({ description: e.target.value })}
            className="text-muted-foreground border-none p-0 h-auto bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Describe what this workflow does"
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
        {/* Workflow Canvas */}
        <div className="lg:col-span-3">
          <WorkflowCanvas workflow={workflow} onStepsUpdate={handleStepsUpdate} onRemoveStep={handleRemoveStep} />
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Add Steps Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Plus className="h-4 w-4" />
                Add Step
              </CardTitle>
              <CardDescription className="text-xs">Drag or click to add capabilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {integrations
                .filter((i) => i.isActive)
                .map((integration) => {
                  const IntegrationIcon = getIntegrationIcon(integration.type)
                  return (
                    <div key={integration.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <IntegrationIcon className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">{integration.name}</span>
                      </div>
                      <div className="space-y-1 ml-6">
                        {integration.capabilities.map((capability) => (
                          <Button
                            key={capability.id}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-xs h-8 hover:bg-primary/10"
                            onClick={() => handleAddStep(integration, capability)}
                          >
                            <Plus className="h-3 w-3 mr-2" />
                            {capability.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )
                })}

              {integrations.filter((i) => i.isActive).length === 0 && (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">
                    No active integrations. Enable integrations to add steps.
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
