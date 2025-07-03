"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Send, MessageSquare, Tag, Clock } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

interface LeadActionsModalProps {
  lead: any
  isOpen: boolean
  onClose: () => void
  actionType: "email" | "call" | "note" | "status" | "campaign" | "followup" | null
}

export function LeadActionsModal({ lead, isOpen, onClose, actionType }: LeadActionsModalProps) {
  const [emailData, setEmailData] = useState({
    subject: `Follow up - ${lead?.name || lead?.instagramUserId}`,
    body: `Hi ${lead?.name || "there"},\n\nI wanted to follow up on our recent conversation...\n\nBest regards`,
  })

  const [noteData, setNoteData] = useState("")
  const [newStatus, setNewStatus] = useState(lead?.status || "NEW")
  const [followupDate, setFollowupDate] = useState<Date>()
  const [campaignName, setCampaignName] = useState("")

  const handleSendEmail = async () => {
    if (!lead?.email) {
      toast.error("No email address available")
      return
    }

    // In a real app, you'd send this via your email service
    const mailtoLink = `mailto:${lead.email}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`
    window.location.href = mailtoLink

    toast.success("Email client opened")
    onClose()
  }

  const handleAddNote = async () => {
    if (!noteData.trim()) {
      toast.error("Please enter a note")
      return
    }

    // In a real app, you'd save this to your database
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Note added successfully")
      setNoteData("")
      onClose()
    } catch (error) {
      toast.error("Failed to add note")
    }
  }

  const handleUpdateStatus = async () => {
    try {
      // In a real app, you'd update this in your database
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success(`Status updated to ${newStatus}`)
      onClose()
    } catch (error) {
      toast.error("Failed to update status")
    }
  }

  const handleScheduleFollowup = async () => {
    if (!followupDate) {
      toast.error("Please select a follow-up date")
      return
    }

    try {
      // In a real app, you'd create a calendar event or reminder
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success(`Follow-up scheduled for ${format(followupDate, "PPP")}`)
      onClose()
    } catch (error) {
      toast.error("Failed to schedule follow-up")
    }
  }

  const handleAddToCampaign = async () => {
    if (!campaignName.trim()) {
      toast.error("Please enter a campaign name")
      return
    }

    try {
      // In a real app, you'd add the lead to a marketing campaign
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success(`Added to campaign: ${campaignName}`)
      setCampaignName("")
      onClose()
    } catch (error) {
      toast.error("Failed to add to campaign")
    }
  }

  const renderActionContent = () => {
    switch (actionType) {
      case "email":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="email-subject">Subject</Label>
              <Input
                id="email-subject"
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email-body">Message</Label>
              <Textarea
                id="email-body"
                rows={6}
                value={emailData.body}
                onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSendEmail}>
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </div>
          </div>
        )

      case "note":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="note">Add Note</Label>
              <Textarea
                id="note"
                rows={4}
                placeholder="Enter your note about this lead..."
                value={noteData}
                onChange={(e) => setNoteData(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleAddNote}>
                <Plus className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </div>
          </div>
        )

      case "status":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Update Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="QUALIFYING">Qualifying</SelectItem>
                  <SelectItem value="QUALIFIED">Qualified</SelectItem>
                  <SelectItem value="CONVERTED">Converted</SelectItem>
                  <SelectItem value="LOST">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleUpdateStatus}>
                <Tag className="h-4 w-4 mr-2" />
                Update Status
              </Button>
            </div>
          </div>
        )

      case "followup":
        return (
          <div className="space-y-4">
            <div>
              <Label>Schedule Follow-up</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {followupDate ? format(followupDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={followupDate} onSelect={setFollowupDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleScheduleFollowup}>
                <Clock className="h-4 w-4 mr-2" />
                Schedule Follow-up
              </Button>
            </div>
          </div>
        )

      case "campaign":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="campaign">Campaign Name</Label>
              <Input
                id="campaign"
                placeholder="Enter campaign name..."
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleAddToCampaign}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Add to Campaign
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const getTitle = () => {
    switch (actionType) {
      case "email":
        return "Send Email"
      case "note":
        return "Add Note"
      case "status":
        return "Update Status"
      case "followup":
        return "Schedule Follow-up"
      case "campaign":
        return "Add to Campaign"
      default:
        return "Lead Action"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{lead?.name || `@${lead?.instagramUserId}`}</DialogDescription>
        </DialogHeader>
        {renderActionContent()}
      </DialogContent>
    </Dialog>
  )
}
