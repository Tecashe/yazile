// still in use - Enhanced header with real database integration
"use client"

import { useState } from "react"
import { useWorkflowStore } from "@/lib/workflow-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import {
  Play,
  Square,
  Save,
  Plus,
  Copy,
  Settings,
  Share,
  Download,
  Upload,
  MoreHorizontal,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"

export function EnhancedWorkflowHeader() {
  const {
    workflowName,
    workflowDescription,
    isRunning,
    isDirty,
    setIsRunning,
    saveWorkflow,
    createNewWorkflow,
    duplicateWorkflow,
    setWorkflowMetadata,
    exportWorkflow,
    importWorkflow,
    publishWorkflow,
    validateWorkflow,
  } = useWorkflowStore()

  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState(workflowName)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await saveWorkflow()
    } catch (error) {
      console.error("Save error:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleRunToggle = async () => {
    if (isRunning) {
      setIsRunning(false)
      toast.info("Workflow stopped")
    } else {
      const validation = validateWorkflow()
      if (!validation.isValid) {
        toast.error(`Cannot run workflow: ${validation.errors[0]}`)
        return
      }

      setIsRunning(true)
      toast.success("Workflow started")

      // Auto-stop after demo period
      setTimeout(() => {
        setIsRunning(false)
        toast.info("Workflow stopped")
      }, 30000)
    }
  }

  const handleNameSubmit = () => {
    setWorkflowMetadata(null, tempName, workflowDescription)
    setIsEditingName(false)
    toast.success("Workflow name updated")
  }

  const handleExport = () => {
    try {
      const exportData = exportWorkflow()
      const blob = new Blob([exportData], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${workflowName.replace(/\s+/g, "-").toLowerCase()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      toast.error("Failed to export workflow")
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
        toast.error("Failed to import workflow. Please check the file format.")
      }
    }
    input.click()
  }

  const handlePublish = async () => {
    const validation = validateWorkflow()
    if (!validation.isValid) {
      toast.error(`Cannot publish workflow: ${validation.errors.join(", ")}`)
      return
    }

    try {
      await publishWorkflow()
    } catch (error) {
      console.error("Publish error:", error)
    }
  }

  const handleShare = async () => {
    try {
      const exportData = exportWorkflow()
      await navigator.clipboard.writeText(exportData)
      toast.success("Workflow data copied to clipboard!")
    } catch (error) {
      toast.error("Failed to copy workflow data")
    }
  }

  const handleSettings = () => {
    const { setRightPanelTab } = useWorkflowStore.getState()
    setRightPanelTab("settings")
    toast.info("Settings panel opened")
  }

  const validation = validateWorkflow()

  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between">
      {/* Left section - Workflow info */}
      <div className="flex items-center gap-4">
        {isEditingName ? (
          <div className="flex items-center gap-2">
            <Input
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleNameSubmit()
                if (e.key === "Escape") {
                  setTempName(workflowName)
                  setIsEditingName(false)
                }
              }}
              className="h-8 text-lg font-semibold"
              autoFocus
            />
          </div>
        ) : (
          <h1
            className="text-lg font-semibold text-foreground cursor-pointer hover:text-primary transition-colors"
            onClick={() => setIsEditingName(true)}
          >
            {workflowName}
          </h1>
        )}

        {isDirty && (
          <Badge variant="secondary" className="text-xs">
            Unsaved changes
          </Badge>
        )}

        {isRunning && (
          <Badge variant="default" className="text-xs bg-green-500 hover:bg-green-600">
            Running
          </Badge>
        )}

        {!validation.isValid && (
          <Badge variant="destructive" className="text-xs">
            <AlertTriangle className="w-3 h-3 mr-1" />
            {validation.errors.length} errors
          </Badge>
        )}

        {validation.isValid && (
          <Badge variant="outline" className="text-xs text-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Valid
          </Badge>
        )}
      </div>

      {/* Right section - Actions */}
      <div className="flex items-center gap-2">
        <Button variant={isRunning ? "destructive" : "default"} size="sm" onClick={handleRunToggle} className="gap-2">
          {isRunning ? (
            <>
              <Square className="h-4 w-4" />
              Stop
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Run
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          className="gap-2 bg-transparent"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save"}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={createNewWorkflow} className="gap-2">
              <Plus className="h-4 w-4" />
              New Workflow
            </DropdownMenuItem>
            <DropdownMenuItem onClick={duplicateWorkflow} className="gap-2">
              <Copy className="h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleImport} className="gap-2">
              <Upload className="h-4 w-4" />
              Import
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExport} className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleShare} className="gap-2">
              <Share className="h-4 w-4" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handlePublish} className="gap-2" disabled={!validation.isValid}>
              <CheckCircle className="h-4 w-4" />
              Publish
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSettings} className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
