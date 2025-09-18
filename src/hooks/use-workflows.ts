"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "@/hooks/use-toast"

export interface WorkflowStep {
  id: string
  stepId: string
  stepType: "trigger" | "action" | "condition" | "permission"
  integrationId: string
  integrationName: string
  capabilityId: string
  capabilityName: string
  config: Record<string, any>
  positionX: number
  positionY: number
  stepOrder: number
  parentStepId?: string
}

export interface WorkflowCondition {
  id: string
  conditionId: string
  field: string
  operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than"
  value: string
  trueStepId?: string
  falseStepId?: string
}

export interface Workflow {
  id: string
  name: string
  description: string
  isActive: boolean
  aiPrompt?: string
  aiGenerated: boolean
  steps: WorkflowStep[]
  conditions: WorkflowCondition[]
  createdAt: string
  updatedAt: string
}

export function useWorkflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadWorkflows = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/workflows")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setWorkflows(data.workflows || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load workflows"
      setError(errorMessage)
      console.error("Failed to load workflows:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const saveWorkflow = useCallback(async (workflow: Workflow): Promise<Workflow | null> => {
    try {
      const isNew = workflow.id.startsWith("temp-")
      const response = await fetch("/api/workflows", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workflow),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const savedWorkflow = await response.json()

      setWorkflows((prev) => {
        const index = prev.findIndex((w) => w.id === workflow.id)
        if (index >= 0) {
          const updated = [...prev]
          updated[index] = savedWorkflow
          return updated
        }
        return [...prev, savedWorkflow]
      })

      toast({
        title: "Success",
        description: `Workflow "${savedWorkflow.name}" saved successfully`,
      })

      return savedWorkflow
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save workflow"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return null
    }
  }, [])

  const deleteWorkflow = useCallback(async (workflowId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/workflows/${workflowId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setWorkflows((prev) => prev.filter((w) => w.id !== workflowId))

      toast({
        title: "Success",
        description: "Workflow deleted successfully",
      })

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete workflow"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    }
  }, [])

  const updateWorkflow = useCallback((workflowId: string, updates: Partial<Workflow>) => {
    setWorkflows((prev) =>
      prev.map((w) => (w.id === workflowId ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w)),
    )
  }, [])

  const addWorkflow = useCallback((workflow: Workflow) => {
    setWorkflows((prev) => [...prev, workflow])
  }, [])

  useEffect(() => {
    loadWorkflows()
  }, [loadWorkflows])

  return {
    workflows,
    isLoading,
    error,
    saveWorkflow,
    deleteWorkflow,
    updateWorkflow,
    addWorkflow,
    refetch: loadWorkflows,
  }
}
