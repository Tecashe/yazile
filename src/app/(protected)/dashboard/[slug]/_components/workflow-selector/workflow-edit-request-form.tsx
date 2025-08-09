
"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DialogFooter } from "@/components/ui/dialog"
import { Loader2, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WorkflowEditRequestFormProps {
  workflowRequestId: string
  onSuccess: () => void
  onCancel: () => void
}

export default function WorkflowEditRequestForm({
  workflowRequestId,
  onSuccess,
  onCancel,
}: WorkflowEditRequestFormProps) {
  const [editDetails, setEditDetails] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editDetails.trim()) {
      toast({
        title: "Error",
        description: "Please provide details for your edit request.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/user/workflow-requests/${workflowRequestId}/edit-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ editDetails }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Edit Request Submitted",
          description: "Your request for modifications has been sent to the team.",
          variant: "default",
        })
        onSuccess()
      } else {
        throw new Error(data.error || "Failed to submit edit request.")
      }
    } catch (error: any) {
      console.error("Error submitting edit request:", error)
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred while submitting your request.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="editDetails">
          Describe the modifications you need <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="editDetails"
          placeholder="e.g., 'Please add a step to send a confirmation email after lead qualification', 'Integrate with our new CRM system: Zoho CRM'"
          value={editDetails}
          onChange={(e) => setEditDetails(e.target.value)}
          rows={6}
          required
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Submit Request
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}
