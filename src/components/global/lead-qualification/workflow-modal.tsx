"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import type { N8nWorkflowConfig } from "@prisma/client"

interface WorkflowModalProps {
  isOpen: boolean
  onClose: () => void
  workflows: N8nWorkflowConfig[]
}

export function WorkflowModal({ isOpen, onClose, workflows }: WorkflowModalProps) {
  const router = useRouter()
  const [name, setName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [workflowId, setWorkflowId] = useState<string>("")
  const [workflowType, setWorkflowType] = useState<string>("LEAD_QUALIFICATION")
  const [triggerUrl, setTriggerUrl] = useState<string>("")
  const [webhookUrl, setWebhookUrl] = useState<string>("")
  const [isActive, setIsActive] = useState<boolean>(true)
  const [connectionId, setConnectionId] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !workflowId || !triggerUrl || !connectionId) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/n8n/workflows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          connectionId,
          name,
          description,
          workflowId,
          workflowType,
          triggerUrl,
          webhookUrl: webhookUrl || undefined,
          isActive,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create workflow")
      }

      toast({
        title: "Workflow created",
        description: "Your n8n workflow has been created successfully.",
      })

      onClose()
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add n8n Workflow</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="connectionId">n8n Connection *</Label>
            <Select value={connectionId} onValueChange={setConnectionId}>
              <SelectTrigger id="connectionId">
                <SelectValue placeholder="Select a connection" />
              </SelectTrigger>
              <SelectContent>
                {workflows.length > 0 ? (
                  workflows.map((workflow) => (
                    <SelectItem key={workflow.id} value={workflow.connectionId}>
                      {workflow.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No connections available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {workflows.length === 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                <Button
                  variant="link"
                  className="h-auto p-0 text-xs"
                  onClick={() => router.push("/dashboard/integrations/n8n/new")}
                >
                  Create a new n8n connection
                </Button>
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="name">Workflow Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Lead Qualification Workflow"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="This workflow processes qualified leads..."
            />
          </div>

          <div>
            <Label htmlFor="workflowId">n8n Workflow ID *</Label>
            <Input
              id="workflowId"
              value={workflowId}
              onChange={(e) => setWorkflowId(e.target.value)}
              placeholder="123e4567-e89b-12d3-a456-426614174000"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">The ID of your workflow in n8n</p>
          </div>

          <div>
            <Label htmlFor="workflowType">Workflow Type</Label>
            <Select value={workflowType} onValueChange={setWorkflowType}>
              <SelectTrigger id="workflowType">
                <SelectValue placeholder="Select workflow type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LEAD_QUALIFICATION">Lead Qualification</SelectItem>
                <SelectItem value="LEAD_NURTURING">Lead Nurturing</SelectItem>
                <SelectItem value="CRM_SYNC">CRM Sync</SelectItem>
                <SelectItem value="NOTIFICATION">Notification</SelectItem>
                <SelectItem value="CUSTOM">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="triggerUrl">Webhook Trigger URL *</Label>
            <Input
              id="triggerUrl"
              value={triggerUrl}
              onChange={(e) => setTriggerUrl(e.target.value)}
              placeholder="https://n8n.yourdomain.com/webhook/..."
              required
            />
            <p className="text-xs text-muted-foreground mt-1">The webhook URL to trigger this workflow</p>
          </div>

          <div>
            <Label htmlFor="webhookUrl">Callback Webhook URL</Label>
            <Input
              id="webhookUrl"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://yourdomain.com/api/webhook/n8n"
            />
            <p className="text-xs text-muted-foreground mt-1">Optional URL for n8n to call back to your application</p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
            <Label htmlFor="isActive">Active</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Workflow"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
