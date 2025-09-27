"use client"

import { useState } from "react"
import { WorkflowsDashboard } from "./workflows-dashboard"
import { WorkflowBuilder } from "./workflow-builder"

type AppView = "dashboard" | "editor"

export function WorkflowApp() {
  const [currentView, setCurrentView] = useState<AppView>("dashboard")
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string | null>(null)

  const handleEditWorkflow = (workflowId: string) => {
    setCurrentWorkflowId(workflowId)
    setCurrentView("editor")
  }

  const handleCreateWorkflow = () => {
    setCurrentWorkflowId(null)
    setCurrentView("editor")
  }

  const handleBackToDashboard = () => {
    setCurrentView("dashboard")
    setCurrentWorkflowId(null)
  }

  if (currentView === "dashboard") {
    return <WorkflowsDashboard onEditWorkflow={handleEditWorkflow} onCreateWorkflow={handleCreateWorkflow} />
  }

  return <WorkflowBuilder workflowId={currentWorkflowId} onBackToDashboard={handleBackToDashboard} />
}
