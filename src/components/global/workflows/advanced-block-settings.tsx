"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Plus, Trash2, Code, Zap } from "lucide-react"
// import type { WorkflowNode } from "./workflow-builder"

type WorkflowNode = {
  id: string
  type: "trigger" | "text" | "button" | "image" | "condition" | "delay" | "api" | "webhook"
  position: { x: number; y: number }
  data: any
  connections: string[]
}

interface AdvancedBlockSettingsProps {
  node: WorkflowNode
  onUpdate: (updates: Partial<WorkflowNode>) => void
}

export function AdvancedBlockSettings({ node, onUpdate }: AdvancedBlockSettingsProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [customVariable, setCustomVariable] = useState("")

  const updateAdvancedData = (key: string, value: any) => {
    const advanced = node.data.advanced || {}
    onUpdate({
      data: {
        ...node.data,
        advanced: {
          ...advanced,
          [key]: value,
        },
      },
    })
  }

  const addCustomVariable = () => {
    if (!customVariable.trim()) return

    const variables = node.data.advanced?.customVariables || []
    updateAdvancedData("customVariables", [
      ...variables,
      {
        name: customVariable,
        value: "",
        id: Date.now().toString(),
      },
    ])
    setCustomVariable("")
  }

  const removeCustomVariable = (index: number) => {
    const variables = [...(node.data.advanced?.customVariables || [])]
    variables.splice(index, 1)
    updateAdvancedData("customVariables", variables)
  }

  const updateCustomVariable = (index: number, field: string, value: string) => {
    const variables = [...(node.data.advanced?.customVariables || [])]
    variables[index] = { ...variables[index], [field]: value }
    updateAdvancedData("customVariables", variables)
  }

  return (
    <div className="space-y-4">
      <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Advanced Settings
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${isAdvancedOpen ? "rotate-180" : ""}`} />
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="space-y-4">
          {/* Conditional Execution */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="conditional">Conditional Execution</Label>
              <Switch
                id="conditional"
                checked={node.data.advanced?.conditional || false}
                onCheckedChange={(checked) => updateAdvancedData("conditional", checked)}
              />
            </div>
            {node.data.advanced?.conditional && (
              <div className="space-y-2">
                <Input
                  placeholder="Condition (e.g., {{sender}} === 'premium_user')"
                  value={node.data.advanced?.conditionExpression || ""}
                  onChange={(e) => updateAdvancedData("conditionExpression", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Use variables like {`{{sender}}`}, {`{{message}}`}, {`{{platform}}`}
                </p>
              </div>
            )}
          </Card>

          {/* Custom Variables */}
          <Card className="p-4 space-y-3">
            <Label>Custom Variables</Label>
            <div className="space-y-2">
              {(node.data.advanced?.customVariables || []).map((variable: any, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="Variable name"
                    value={variable.name}
                    onChange={(e) => updateCustomVariable(index, "name", e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Value"
                    value={variable.value}
                    onChange={(e) => updateCustomVariable(index, "value", e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm" onClick={() => removeCustomVariable(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Add variable name..."
                  value={customVariable}
                  onChange={(e) => setCustomVariable(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addCustomVariable()}
                  className="flex-1"
                />
                <Button onClick={addCustomVariable} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Rate Limiting */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="rateLimit">Rate Limiting</Label>
              <Switch
                id="rateLimit"
                checked={node.data.advanced?.rateLimit || false}
                onCheckedChange={(checked) => updateAdvancedData("rateLimit", checked)}
              />
            </div>
            {node.data.advanced?.rateLimit && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Max per hour</Label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="10"
                    value={node.data.advanced?.maxPerHour || ""}
                    onChange={(e) => updateAdvancedData("maxPerHour", Number.parseInt(e.target.value) || 1)}
                  />
                </div>
                <div>
                  <Label className="text-xs">Cooldown (min)</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="5"
                    value={node.data.advanced?.cooldownMinutes || ""}
                    onChange={(e) => updateAdvancedData("cooldownMinutes", Number.parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            )}
          </Card>

          {/* Webhook Integration */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="webhook">Webhook Trigger</Label>
              <Switch
                id="webhook"
                checked={node.data.advanced?.webhook || false}
                onCheckedChange={(checked) => updateAdvancedData("webhook", checked)}
              />
            </div>
            {node.data.advanced?.webhook && (
              <div className="space-y-2">
                <Input
                  placeholder="Webhook URL"
                  value={node.data.advanced?.webhookUrl || ""}
                  onChange={(e) => updateAdvancedData("webhookUrl", e.target.value)}
                />
                <Select
                  value={node.data.advanced?.webhookMethod || "POST"}
                  onValueChange={(value) => updateAdvancedData("webhookMethod", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder="Request body (JSON)"
                  value={node.data.advanced?.webhookBody || ""}
                  onChange={(e) => updateAdvancedData("webhookBody", e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </Card>

          {/* Analytics Tracking */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="analytics">Analytics Tracking</Label>
              <Switch
                id="analytics"
                checked={node.data.advanced?.analytics !== false}
                onCheckedChange={(checked) => updateAdvancedData("analytics", checked)}
              />
            </div>
            {node.data.advanced?.analytics !== false && (
              <div className="space-y-2">
                <Input
                  placeholder="Event name (optional)"
                  value={node.data.advanced?.eventName || ""}
                  onChange={(e) => updateAdvancedData("eventName", e.target.value)}
                />
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">
                    Automatically tracks execution, response time, and success rate
                  </span>
                </div>
              </div>
            )}
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
