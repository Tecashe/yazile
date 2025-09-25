"use client"

import { Button } from "@/components/ui/button"
import { Play, Pause, Save, Settings, Download, Upload, FolderOpen } from "lucide-react"

interface WorkflowHeaderProps {
  isRunning: boolean
  onRun: () => void
  onSave: () => void
  onLoad?: () => void
}

export function WorkflowHeader({ isRunning, onRun, onSave, onLoad }: WorkflowHeaderProps) {
  const exportWorkflow = () => {
    // In a real app, this would export to JSON file
    console.log("Exporting workflow...")
    alert("Export functionality would be implemented here")
  }

  const importWorkflow = () => {
    // In a real app, this would import from JSON file
    console.log("Importing workflow...")
    alert("Import functionality would be implemented here")
  }

  return (
    <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">Social Media Automation</h1>
        <div className="text-sm text-muted-foreground">Workflow Builder</div>
      </div>

      <div className="flex items-center gap-2">
        {onLoad && (
          <Button variant="outline" size="sm" onClick={onLoad}>
            <FolderOpen className="w-4 h-4 mr-2" />
            Load
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={importWorkflow}>
          <Upload className="w-4 h-4 mr-2" />
          Import
        </Button>
        <Button variant="outline" size="sm" onClick={exportWorkflow}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button variant="outline" size="sm" onClick={onSave}>
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
        <Button onClick={onRun} className={isRunning ? "bg-destructive hover:bg-destructive/90" : ""}>
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              Stop Test
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Test Run
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
