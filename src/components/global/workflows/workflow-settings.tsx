"use client"

import { useWorkflowStore } from "@/lib/workflow-store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Settings, Trash2, Download, RefreshCw } from "lucide-react"
import { toast } from "sonner"

export function WorkflowSettings() {
  const { workflowName, workflowDescription, nodes, setWorkflowMetadata, createNewWorkflow, saveWorkflow, isDirty } =
    useWorkflowStore()

  const handleClearWorkflow = () => {
    if (confirm("Are you sure you want to clear the entire workflow? This action cannot be undone.")) {
      createNewWorkflow()
      toast.success("Workflow cleared")
    }
  }

  const handleExportSettings = () => {
    const settings = {
      name: workflowName,
      description: workflowDescription,
      nodeCount: nodes.length,
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(settings, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${workflowName.replace(/\s+/g, "-").toLowerCase()}-settings.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success("Settings exported!")
  }

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Workflow Settings
        </h3>
        <p className="text-sm text-muted-foreground">Configure global workflow properties and preferences</p>
      </div>

      <Card className="p-4 space-y-4">
        <h4 className="font-semibold">General Settings</h4>

        <div>
          <Label htmlFor="workflowName">Workflow Name</Label>
          <Input
            id="workflowName"
            value={workflowName}
            onChange={(e) => setWorkflowMetadata(null, e.target.value, workflowDescription)}
            className="mt-1"
            placeholder="Enter workflow name..."
          />
        </div>

        <div>
          <Label htmlFor="workflowDescription">Description</Label>
          <Textarea
            id="workflowDescription"
            value={workflowDescription}
            onChange={(e) => setWorkflowMetadata(null, workflowName, e.target.value)}
            className="mt-1"
            placeholder="Describe what this workflow does..."
            rows={3}
          />
        </div>

        <Separator />

        <div>
          <h5 className="font-medium mb-2">Workflow Statistics</h5>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{nodes.length}</div>
              <div className="text-sm text-muted-foreground">Total Blocks</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {nodes.reduce((acc, node) => acc + node.connections.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Connections</div>
            </div>
          </div>
        </div>

        <div>
          <h5 className="font-medium mb-2">Block Types</h5>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(nodes.map((n) => n.type))).map((type) => (
              <Badge key={type} variant="outline" className="capitalize">
                {type} ({nodes.filter((n) => n.type === type).length})
              </Badge>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-4 space-y-4">
        <h4 className="font-semibold">Execution Settings</h4>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto-save</Label>
              <p className="text-sm text-muted-foreground">Automatically save changes</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Debug Mode</Label>
              <p className="text-sm text-muted-foreground">Show detailed execution logs</p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Error Handling</Label>
              <p className="text-sm text-muted-foreground">Continue on errors</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>

      <Card className="p-4 space-y-4">
        <h4 className="font-semibold text-destructive">Danger Zone</h4>

        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={handleExportSettings}
            className="w-full justify-start gap-2 bg-transparent"
          >
            <Download className="h-4 w-4" />
            Export Settings
          </Button>

          <Button variant="outline" onClick={() => window.location.reload()} className="w-full justify-start gap-2">
            <RefreshCw className="h-4 w-4" />
            Reset UI
          </Button>

          <Button variant="destructive" onClick={handleClearWorkflow} className="w-full justify-start gap-2">
            <Trash2 className="h-4 w-4" />
            Clear Workflow
          </Button>
        </div>
      </Card>

      {isDirty && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-yellow-800">Unsaved Changes</p>
              <p className="text-sm text-yellow-600">You have unsaved changes to your workflow</p>
            </div>
            <Button onClick={saveWorkflow} size="sm">
              Save Now
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
