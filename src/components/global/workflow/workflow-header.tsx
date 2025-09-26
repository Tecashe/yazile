"use client"

import { Button } from "@/components/ui/button"
import { useWorkflowStore } from "@/lib/workflow-store"
import {
  Play,
  Pause,
  Save,
  Download,
  Upload,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react"

export function WorkflowHeader() {
  const {
    isRunning,
    workflowName,
    sidebarCollapsed,
    rightPanelCollapsed,
    setIsRunning,
    setSidebarCollapsed,
    setRightPanelCollapsed,
    saveWorkflow,
    exportWorkflow,
    importWorkflow,
  } = useWorkflowStore()

  const handleExport = () => {
    try {
      const data = exportWorkflow()
      const blob = new Blob([data], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${workflowName.replace(/\s+/g, "-").toLowerCase()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Export failed:", error)
    }
  }

  const handleImport = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const text = await file.text()
        importWorkflow(text)
      } catch (error) {
        console.error("Import failed:", error)
      }
    }
    input.click()
  }

  return (
    <div className="h-14 bg-card border-b border-border flex items-center justify-between px-4 flex-shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            {sidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
          <h1 className="text-lg font-semibold">{workflowName}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleImport}>
          <Upload className="h-4 w-4 mr-2" />
          Import
        </Button>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button variant="outline" size="sm" onClick={saveWorkflow}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button variant={isRunning ? "destructive" : "default"} size="sm" onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? (
            <>
              <Pause className="h-4 w-4 mr-2" />
              Stop
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Test
            </>
          )}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}>
          {rightPanelCollapsed ? <PanelRightOpen className="h-4 w-4" /> : <PanelRightClose className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}
