"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

interface WorkflowModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function WorkflowModal({ isOpen, onClose }: WorkflowModalProps) {
  const [name, setName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [workflowId, setWorkflowId] = useState<string>("")
  const [triggerUrl, setTriggerUrl] = useState<string>("")
  const [isActive, setIsActive] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !workflowId) {
      alert("Please fill in all required fields")
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
          name,
          description,
          workflowId,
          triggerUrl,
          isActive,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create workflow")
      }

      // Close the modal and refresh the page
      onClose()
      window.location.reload()
    } catch (error) {
      console.error("Error creating workflow:", error)
      alert("Error creating workflow: " + (error as Error).message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add n8n Workflow</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="triggerUrl">Webhook Trigger URL</Label>
            <Input
              id="triggerUrl"
              value={triggerUrl}
              onChange={(e) => setTriggerUrl(e.target.value)}
              placeholder="https://n8n.yourdomain.com/webhook/..."
            />
            <p className="text-xs text-muted-foreground mt-1">The webhook URL to trigger this workflow</p>
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
              {isSubmitting ? "Adding..." : "Add Workflow"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
