"use client"

import { useState } from "react"
import { updateHandoffSettings } from "@/actions/human-handoff"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

interface HandoffSettingsFormProps {
  settings: any
}

export function HandoffSettingsForm({ settings }: HandoffSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    try {
      const result = await updateHandoffSettings(formData)
      if (result.success) {
        toast({
          title: "Settings updated",
          description: result.message,
        })
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      {/* General Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">General Settings</h3>

        <div className="flex items-center space-x-2">
          <Switch name="isEnabled" defaultChecked={settings?.isEnabled ?? true} />
          <Label htmlFor="isEnabled">Enable Human Handoff</Label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="defaultPriority">Default Priority</Label>
            <Select name="defaultPriority" defaultValue={settings?.defaultPriority ?? "MEDIUM"}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxWaitTime">Max Wait Time (seconds)</Label>
            <Input name="maxWaitTime" type="number" min="30" max="3600" defaultValue={settings?.maxWaitTime ?? 300} />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch name="autoAssign" defaultChecked={settings?.autoAssign ?? true} />
          <Label htmlFor="autoAssign">Auto-assign to available agents</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch name="businessHoursOnly" defaultChecked={settings?.businessHoursOnly ?? false} />
          <Label htmlFor="businessHoursOnly">Only during business hours</Label>
        </div>
      </div>

      <Separator />

      {/* Notification Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notifications</h3>

        <div className="space-y-2">
          <Label htmlFor="notificationEmail">Notification Email</Label>
          <Input
            name="notificationEmail"
            type="email"
            placeholder="notifications@yourcompany.com"
            defaultValue={settings?.notificationEmail ?? ""}
          />
        </div>
      </div>

      <Separator />

      {/* Slack Integration */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Slack Integration</h3>

        <div className="space-y-2">
          <Label htmlFor="slackWebhookUrl">Slack Webhook URL</Label>
          <Input
            name="slackWebhookUrl"
            type="url"
            placeholder="https://hooks.slack.com/services/..."
            defaultValue={settings?.slackWebhookUrl ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slackChannel">Slack Channel</Label>
          <Input name="slackChannel" placeholder="#customer-support" defaultValue={settings?.slackChannel ?? ""} />
        </div>
      </div>

      <Separator />

      {/* Teams Integration */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Microsoft Teams Integration</h3>

        <div className="space-y-2">
          <Label htmlFor="teamsWebhookUrl">Teams Webhook URL</Label>
          <Input
            name="teamsWebhookUrl"
            type="url"
            placeholder="https://outlook.office.com/webhook/..."
            defaultValue={settings?.teamsWebhookUrl ?? ""}
          />
        </div>
      </div>

      <Separator />

      {/* n8n Integration */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">n8n Integration</h3>

        <div className="space-y-2">
          <Label htmlFor="n8nWorkflowId">n8n Workflow ID</Label>
          <Input name="n8nWorkflowId" placeholder="workflow-id-123" defaultValue={settings?.n8nWorkflowId ?? ""} />
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Settings"}
      </Button>
    </form>
  )
}
