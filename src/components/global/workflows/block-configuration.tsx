"use client"

import { useWorkflowStore, type WorkflowNode } from "@/lib/workflow-store"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2 } from "lucide-react"

interface BlockConfigurationProps {
  node: WorkflowNode
}

export function BlockConfiguration({ node }: BlockConfigurationProps) {
  const { updateNode } = useWorkflowStore()

  const handleDataUpdate = (updates: any) => {
    updateNode(node.id, { data: { ...node.data, ...updates } })
  }

  const renderTriggerConfig = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="triggerTitle">Trigger Title</Label>
        <Input
          id="triggerTitle"
          value={node.data.title || ""}
          onChange={(e) => handleDataUpdate({ title: e.target.value })}
          placeholder="Enter trigger title"
        />
      </div>

      <div>
        <Label htmlFor="triggerDescription">Description</Label>
        <Textarea
          id="triggerDescription"
          value={node.data.description || ""}
          onChange={(e) => handleDataUpdate({ description: e.target.value })}
          placeholder="Describe when this trigger activates"
          rows={3}
        />
      </div>

      <div>
        <Label>Trigger Type</Label>
        <Select
          value={node.data.triggerType || "dm"}
          onValueChange={(value) => handleDataUpdate({ triggerType: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dm">Direct Message</SelectItem>
            <SelectItem value="comment">Comment</SelectItem>
            <SelectItem value="mention">Mention</SelectItem>
            <SelectItem value="story_reply">Story Reply</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Platforms</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {["instagram", "facebook", "twitter"].map((platform) => (
            <Badge
              key={platform}
              variant={node.data.platforms?.includes(platform) ? "default" : "outline"}
              className="cursor-pointer capitalize"
              onClick={() => {
                const platforms = node.data.platforms || []
                const updated = platforms.includes(platform)
                  ? platforms.filter((p: string) => p !== platform)
                  : [...platforms, platform]
                handleDataUpdate({ platforms: updated })
              }}
            >
              {platform}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )

  const renderTextConfig = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="textMessage">Message</Label>
        <Textarea
          id="textMessage"
          value={node.data.message || ""}
          onChange={(e) => handleDataUpdate({ message: e.target.value })}
          placeholder="Enter your message text"
          rows={4}
        />
        <p className="text-xs text-muted-foreground mt-1">Use variables like {"{user_name}"} for personalization</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Quick Reply Buttons</Label>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const buttons = node.data.buttons || []
              handleDataUpdate({
                buttons: [...buttons, { text: "New Button", action: "continue", id: crypto.randomUUID() }],
              })
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Button
          </Button>
        </div>

        {(node.data.buttons || []).map((button: any, index: number) => (
          <div key={button.id} className="flex gap-2 mb-2">
            <Input
              value={button.text}
              onChange={(e) => {
                const buttons = [...(node.data.buttons || [])]
                buttons[index] = { ...button, text: e.target.value }
                handleDataUpdate({ buttons })
              }}
              placeholder="Button text"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const buttons = (node.data.buttons || []).filter((_: any, i: number) => i !== index)
                handleDataUpdate({ buttons })
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )

  const renderImageConfig = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          value={node.data.imageUrl || ""}
          onChange={(e) => handleDataUpdate({ imageUrl: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <Label htmlFor="imageCaption">Caption</Label>
        <Textarea
          id="imageCaption"
          value={node.data.caption || ""}
          onChange={(e) => handleDataUpdate({ caption: e.target.value })}
          placeholder="Optional image caption"
          rows={3}
        />
      </div>

      {node.data.imageUrl && (
        <div>
          <Label>Preview</Label>
          <div className="mt-2 border rounded-lg overflow-hidden">
            <img
              src={node.data.imageUrl || "/placeholder.svg"}
              alt="Preview"
              className="w-full h-32 object-cover"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=128&width=256&text=Invalid+Image"
              }}
            />
          </div>
        </div>
      )}
    </div>
  )

  const renderConditionConfig = () => (
    <div className="space-y-4">
      <div>
        <Label>Condition Type</Label>
        <Select
          value={node.data.condition || "contains"}
          onValueChange={(value) => handleDataUpdate({ condition: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="contains">Contains</SelectItem>
            <SelectItem value="equals">Equals</SelectItem>
            <SelectItem value="starts_with">Starts With</SelectItem>
            <SelectItem value="ends_with">Ends With</SelectItem>
            <SelectItem value="regex">Regular Expression</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="conditionValue">Value to Check</Label>
        <Input
          id="conditionValue"
          value={node.data.value || ""}
          onChange={(e) => handleDataUpdate({ value: e.target.value })}
          placeholder="Enter text to match"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={node.data.caseSensitive || false}
          onCheckedChange={(checked) => handleDataUpdate({ caseSensitive: checked })}
        />
        <Label>Case Sensitive</Label>
      </div>
    </div>
  )

  const renderDelayConfig = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="delayDuration">Duration</Label>
          <Input
            id="delayDuration"
            type="number"
            value={node.data.duration || 5}
            onChange={(e) => handleDataUpdate({ duration: Number.parseInt(e.target.value) || 5 })}
            min="1"
          />
        </div>
        <div>
          <Label>Unit</Label>
          <Select value={node.data.unit || "seconds"} onValueChange={(value) => handleDataUpdate({ unit: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="seconds">Seconds</SelectItem>
              <SelectItem value="minutes">Minutes</SelectItem>
              <SelectItem value="hours">Hours</SelectItem>
              <SelectItem value="days">Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={node.data.randomize || false}
          onCheckedChange={(checked) => handleDataUpdate({ randomize: checked })}
        />
        <Label>Add Random Variation (±20%)</Label>
      </div>
    </div>
  )

  const renderApiConfig = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="apiEndpoint">API Endpoint</Label>
        <Input
          id="apiEndpoint"
          value={node.data.endpoint || ""}
          onChange={(e) => handleDataUpdate({ endpoint: e.target.value })}
          placeholder="https://api.example.com/endpoint"
        />
      </div>

      <div>
        <Label>HTTP Method</Label>
        <Select value={node.data.method || "POST"} onValueChange={(value) => handleDataUpdate({ method: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="POST">POST</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
            <SelectItem value="PATCH">PATCH</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="apiBody">Request Body (JSON)</Label>
        <Textarea
          id="apiBody"
          value={node.data.body || ""}
          onChange={(e) => handleDataUpdate({ body: e.target.value })}
          placeholder='{"key": "value"}'
          rows={4}
        />
      </div>
    </div>
  )

  const renderWebhookConfig = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="webhookUrl">Webhook URL</Label>
        <Input
          id="webhookUrl"
          value={node.data.url || ""}
          onChange={(e) => handleDataUpdate({ url: e.target.value })}
          placeholder="https://your-webhook-url.com"
        />
      </div>

      <div>
        <Label htmlFor="webhookPayload">Payload (JSON)</Label>
        <Textarea
          id="webhookPayload"
          value={node.data.payload || ""}
          onChange={(e) => handleDataUpdate({ payload: e.target.value })}
          placeholder='{"message": "{{message}}", "user": "{{user}}"}'
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="webhookRetries">Max Retries</Label>
        <Input
          id="webhookRetries"
          type="number"
          value={node.data.retries || 3}
          onChange={(e) => handleDataUpdate({ retries: Number.parseInt(e.target.value) || 3 })}
          min="0"
          max="10"
        />
      </div>
    </div>
  )

  const renderButtonConfig = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <Label>Button Options</Label>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            const buttons = node.data.buttons || []
            handleDataUpdate({
              buttons: [...buttons, { text: "New Option", action: "continue", id: crypto.randomUUID() }],
            })
          }}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Button
        </Button>
      </div>

      {(node.data.buttons || []).map((button: any, index: number) => (
        <Card key={button.id}>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div>
                <Label>Button Text</Label>
                <Input
                  value={button.text}
                  onChange={(e) => {
                    const buttons = [...(node.data.buttons || [])]
                    buttons[index] = { ...button, text: e.target.value }
                    handleDataUpdate({ buttons })
                  }}
                  placeholder="Button text"
                />
              </div>

              <div>
                <Label>Action</Label>
                <Select
                  value={button.action || "continue"}
                  onValueChange={(value) => {
                    const buttons = [...(node.data.buttons || [])]
                    buttons[index] = { ...button, action: value }
                    handleDataUpdate({ buttons })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="continue">Continue Flow</SelectItem>
                    <SelectItem value="end">End Conversation</SelectItem>
                    <SelectItem value="restart">Restart Flow</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  const buttons = (node.data.buttons || []).filter((_: any, i: number) => i !== index)
                  handleDataUpdate({ buttons })
                }}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remove Button
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const getConfigContent = () => {
    switch (node.type) {
      case "trigger":
        return renderTriggerConfig()
      case "text":
        return renderTextConfig()
      case "image":
        return renderImageConfig()
      case "condition":
        return renderConditionConfig()
      case "delay":
        return renderDelayConfig()
      case "api":
        return renderApiConfig()
      case "webhook":
        return renderWebhookConfig()
      case "button":
        return renderButtonConfig()
      default:
        return <div className="text-center text-muted-foreground">No configuration available for this block type.</div>
    }
  }

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2 capitalize">{node.type} Configuration</h3>
        <p className="text-sm text-muted-foreground">
          Configure the properties and behavior of this {node.type} block.
        </p>
      </div>

      <Separator />

      {getConfigContent()}
    </div>
  )
}
