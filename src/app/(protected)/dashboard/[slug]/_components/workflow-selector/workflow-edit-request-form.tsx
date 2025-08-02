"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WorkflowEditRequestFormProps {
  requestId: string
  onSuccess: () => void
  onCancel: () => void
}

export default function WorkflowEditRequestForm({ requestId, onSuccess, onCancel }: WorkflowEditRequestFormProps) {
  const [editDetails, setEditDetails] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editDetails.trim()) {
      toast({
        title: "Input Required",
        description: "Please provide details for your edit request.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/user/workflow-requests/${requestId}/edit-request`, {
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
          description: "Your modification request has been sent to our team.",
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
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="edit-details">
          Describe the modifications you need <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="edit-details"
          placeholder="e.g., 'Please add an additional step to send a follow-up email after 3 days if no response is received.', 'Integrate with our new CRM system: Zoho CRM.'"
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
