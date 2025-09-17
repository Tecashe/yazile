"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { GitBranch, Bot, ArrowDown, Trash2, CreditCard, Calendar, Mail, ShoppingCart, Settings } from "lucide-react"
import type { Workflow, WorkflowStep } from "@/hooks/use-workflows"

interface WorkflowCanvasProps {
  workflow: Workflow
  onStepsUpdate: (steps: WorkflowStep[]) => void
  onRemoveStep: (stepId: string) => void
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

export function WorkflowCanvas({ workflow, onStepsUpdate, onRemoveStep }: WorkflowCanvasProps) {
  const [draggedStep, setDraggedStep] = useState<WorkflowStep | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleDragStart = useCallback((e: React.DragEvent, step: WorkflowStep) => {
    setDraggedStep(step)
    e.dataTransfer.effectAllowed = "move"
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverIndex(index)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent, dropIndex: number) => {
      e.preventDefault()
      setDragOverIndex(null)

      if (!draggedStep) return

      const currentIndex = workflow.steps.findIndex((s) => s.id === draggedStep.id)
      if (currentIndex === -1 || currentIndex === dropIndex) return

      const newSteps = [...workflow.steps]
      const [movedStep] = newSteps.splice(currentIndex, 1)
      newSteps.splice(dropIndex, 0, movedStep)

      // Update step orders
      const updatedSteps = newSteps.map((step, index) => ({
        ...step,
        stepOrder: index,
      }))

      onStepsUpdate(updatedSteps)
      setDraggedStep(null)

      toast({
        title: "Step Reordered",
        description: "Workflow step order updated",
      })
    },
    [workflow.steps, draggedStep, onStepsUpdate],
  )

  const handleCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    // Handle external drops (from capability buttons) here if needed
    setDraggedStep(null)
  }, [])

  const StepCard = ({ step, index }: { step: WorkflowStep; index: number }) => {
    const IntegrationIcon = getIntegrationIcon(step.integrationName)
    const isDraggedOver = dragOverIndex === index

    return (
      <div
        className={`relative ${isDraggedOver ? "transform scale-105" : ""} transition-transform duration-200`}
        onDragOver={(e) => handleDragOver(e, index)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, index)}
      >
        {isDraggedOver && <div className="absolute -top-2 left-0 right-0 h-1 bg-primary rounded-full z-10" />}

        <Card
          className="group cursor-move hover:shadow-md transition-all duration-200 border-l-4 border-l-primary/30"
          draggable
          onDragStart={(e) => handleDragStart(e, step)}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <IntegrationIcon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{step.capabilityName}</h4>
                <p className="text-xs text-muted-foreground">{step.integrationName}</p>
                <Badge variant="outline" className="text-xs mt-1">
                  {step.stepType}
                </Badge>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveStep(step.id)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          Workflow Canvas
        </CardTitle>
        <CardDescription>
          Drag steps to reorder them. Your AI agent will execute these steps in sequence.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          ref={canvasRef}
          className="min-h-[400px] bg-muted/30 rounded-lg p-6 relative"
          onDrop={handleCanvasDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {workflow.steps.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="p-4 rounded-full bg-muted/50 mb-4">
                <Bot className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Start Building Your Workflow</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                Add steps from the panel on the right to create an intelligent automation sequence for your AI agent.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {workflow.steps
                .sort((a, b) => a.stepOrder - b.stepOrder)
                .map((step, index) => (
                  <div key={step.id}>
                    <StepCard step={step} index={index} />
                    {index < workflow.steps.length - 1 && (
                      <div className="flex justify-center py-2">
                        <ArrowDown className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
