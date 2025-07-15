// "use client"

// import { useState } from "react"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Calendar } from "@/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { CalendarIcon, Plus, Send, MessageSquare, Tag, Clock } from "lucide-react"
// import { format } from "date-fns"
// import { toast } from "sonner"

// interface LeadActionsModalProps {
//   lead: any
//   isOpen: boolean
//   onClose: () => void
//   actionType: "email" | "call" | "note" | "status" | "campaign" | "followup" | null
// }

// export function LeadActionsModal({ lead, isOpen, onClose, actionType }: LeadActionsModalProps) {
//   const [emailData, setEmailData] = useState({
//     subject: `Follow up - ${lead?.name || lead?.instagramUserId}`,
//     body: `Hi ${lead?.name || "there"},\n\nI wanted to follow up on our recent conversation...\n\nBest regards`,
//   })

//   const [noteData, setNoteData] = useState("")
//   const [newStatus, setNewStatus] = useState(lead?.status || "NEW")
//   const [followupDate, setFollowupDate] = useState<Date>()
//   const [campaignName, setCampaignName] = useState("")

//   const handleSendEmail = async () => {
//     if (!lead?.email) {
//       toast.error("No email address available")
//       return
//     }

//     // In a real app, you'd send this via your email service
//     const mailtoLink = `mailto:${lead.email}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`
//     window.location.href = mailtoLink

//     toast.success("Email client opened")
//     onClose()
//   }

//   const handleAddNote = async () => {
//     if (!noteData.trim()) {
//       toast.error("Please enter a note")
//       return
//     }

//     // In a real app, you'd save this to your database
//     try {
//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1000))
//       toast.success("Note added successfully")
//       setNoteData("")
//       onClose()
//     } catch (error) {
//       toast.error("Failed to add note")
//     }
//   }

//   const handleUpdateStatus = async () => {
//     try {
//       // In a real app, you'd update this in your database
//       await new Promise((resolve) => setTimeout(resolve, 1000))
//       toast.success(`Status updated to ${newStatus}`)
//       onClose()
//     } catch (error) {
//       toast.error("Failed to update status")
//     }
//   }

//   const handleScheduleFollowup = async () => {
//     if (!followupDate) {
//       toast.error("Please select a follow-up date")
//       return
//     }

//     try {
//       // In a real app, you'd create a calendar event or reminder
//       await new Promise((resolve) => setTimeout(resolve, 1000))
//       toast.success(`Follow-up scheduled for ${format(followupDate, "PPP")}`)
//       onClose()
//     } catch (error) {
//       toast.error("Failed to schedule follow-up")
//     }
//   }

//   const handleAddToCampaign = async () => {
//     if (!campaignName.trim()) {
//       toast.error("Please enter a campaign name")
//       return
//     }

//     try {
//       // In a real app, you'd add the lead to a marketing campaign
//       await new Promise((resolve) => setTimeout(resolve, 1000))
//       toast.success(`Added to campaign: ${campaignName}`)
//       setCampaignName("")
//       onClose()
//     } catch (error) {
//       toast.error("Failed to add to campaign")
//     }
//   }

//   const renderActionContent = () => {
//     switch (actionType) {
//       case "email":
//         return (
//           <div className="space-y-4">
//             <div>
//               <Label htmlFor="email-subject">Subject</Label>
//               <Input
//                 id="email-subject"
//                 value={emailData.subject}
//                 onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
//               />
//             </div>
//             <div>
//               <Label htmlFor="email-body">Message</Label>
//               <Textarea
//                 id="email-body"
//                 rows={6}
//                 value={emailData.body}
//                 onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
//               />
//             </div>
//             <div className="flex justify-end gap-2">
//               <Button variant="outline" onClick={onClose}>
//                 Cancel
//               </Button>
//               <Button onClick={handleSendEmail}>
//                 <Send className="h-4 w-4 mr-2" />
//                 Send Email
//               </Button>
//             </div>
//           </div>
//         )

//       case "note":
//         return (
//           <div className="space-y-4">
//             <div>
//               <Label htmlFor="note">Add Note</Label>
//               <Textarea
//                 id="note"
//                 rows={4}
//                 placeholder="Enter your note about this lead..."
//                 value={noteData}
//                 onChange={(e) => setNoteData(e.target.value)}
//               />
//             </div>
//             <div className="flex justify-end gap-2">
//               <Button variant="outline" onClick={onClose}>
//                 Cancel
//               </Button>
//               <Button onClick={handleAddNote}>
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add Note
//               </Button>
//             </div>
//           </div>
//         )

//       case "status":
//         return (
//           <div className="space-y-4">
//             <div>
//               <Label htmlFor="status">Update Status</Label>
//               <Select value={newStatus} onValueChange={setNewStatus}>
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="NEW">New</SelectItem>
//                   <SelectItem value="QUALIFYING">Qualifying</SelectItem>
//                   <SelectItem value="QUALIFIED">Qualified</SelectItem>
//                   <SelectItem value="CONVERTED">Converted</SelectItem>
//                   <SelectItem value="LOST">Lost</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="flex justify-end gap-2">
//               <Button variant="outline" onClick={onClose}>
//                 Cancel
//               </Button>
//               <Button onClick={handleUpdateStatus}>
//                 <Tag className="h-4 w-4 mr-2" />
//                 Update Status
//               </Button>
//             </div>
//           </div>
//         )

//       case "followup":
//         return (
//           <div className="space-y-4">
//             <div>
//               <Label>Schedule Follow-up</Label>
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
//                     <CalendarIcon className="mr-2 h-4 w-4" />
//                     {followupDate ? format(followupDate, "PPP") : "Pick a date"}
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0">
//                   <Calendar mode="single" selected={followupDate} onSelect={setFollowupDate} initialFocus />
//                 </PopoverContent>
//               </Popover>
//             </div>
//             <div className="flex justify-end gap-2">
//               <Button variant="outline" onClick={onClose}>
//                 Cancel
//               </Button>
//               <Button onClick={handleScheduleFollowup}>
//                 <Clock className="h-4 w-4 mr-2" />
//                 Schedule Follow-up
//               </Button>
//             </div>
//           </div>
//         )

//       case "campaign":
//         return (
//           <div className="space-y-4">
//             <div>
//               <Label htmlFor="campaign">Campaign Name</Label>
//               <Input
//                 id="campaign"
//                 placeholder="Enter campaign name..."
//                 value={campaignName}
//                 onChange={(e) => setCampaignName(e.target.value)}
//               />
//             </div>
//             <div className="flex justify-end gap-2">
//               <Button variant="outline" onClick={onClose}>
//                 Cancel
//               </Button>
//               <Button onClick={handleAddToCampaign}>
//                 <MessageSquare className="h-4 w-4 mr-2" />
//                 Add to Campaign
//               </Button>
//             </div>
//           </div>
//         )

//       default:
//         return null
//     }
//   }

//   const getTitle = () => {
//     switch (actionType) {
//       case "email":
//         return "Send Email"
//       case "note":
//         return "Add Note"
//       case "status":
//         return "Update Status"
//       case "followup":
//         return "Schedule Follow-up"
//       case "campaign":
//         return "Add to Campaign"
//       default:
//         return "Lead Action"
//     }
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-md">
//         <DialogHeader>
//           <DialogTitle>{getTitle()}</DialogTitle>
//           <DialogDescription>{lead?.name || `@${lead?.instagramUserId}`}</DialogDescription>
//         </DialogHeader>
//         {renderActionContent()}
//       </DialogContent>
//     </Dialog>
//   )
// }



"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Mail, Phone, FileText, User, Tag, Clock } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface LeadActionsModalProps {
  lead: any
  isOpen: boolean
  onClose: () => void
  actionType: "email" | "call" | "note" | "status" | "campaign" | "followup" | null
}

export function LeadActionsModal({ lead, isOpen, onClose, actionType }: LeadActionsModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    status: "",
    note: "",
    followupDate: undefined as Date | undefined,
    followupType: "",
    tags: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      switch (actionType) {
        case "email":
          toast.success(`Email sent to ${lead.name || lead.instagramUserId}`)
          break
        case "call":
          toast.success(`Call logged for ${lead.name || lead.instagramUserId}`)
          break
        case "note":
          toast.success(`Note added to ${lead.name || lead.instagramUserId}`)
          break
        case "status":
          toast.success(`Status updated for ${lead.name || lead.instagramUserId}`)
          break
        case "followup":
          toast.success(`Follow-up scheduled for ${lead.name || lead.instagramUserId}`)
          break
        default:
          toast.success("Action completed successfully")
      }

      onClose()
    } catch (error) {
      toast.error("Failed to complete action")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderContent = () => {
    switch (actionType) {
      case "email":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Email subject"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Email message"
                rows={6}
              />
            </div>
          </div>
        )

      case "note":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="Add a note about this lead..."
                rows={4}
              />
            </div>
          </div>
        )

      case "status":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">New Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
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
          </div>
        )

      case "followup":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Follow-up Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.followupDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.followupDate ? format(formData.followupDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.followupDate}
                    onSelect={(date) => setFormData({ ...formData, followupDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="followupType">Follow-up Type</Label>
              <Select
                value={formData.followupType}
                onValueChange={(value) => setFormData({ ...formData, followupType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select follow-up type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">Phone Call</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="demo">Product Demo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      default:
        return <div>Select an action to continue</div>
    }
  }

  const getTitle = () => {
    switch (actionType) {
      case "email":
        return "Send Email"
      case "call":
        return "Log Call"
      case "note":
        return "Add Note"
      case "status":
        return "Update Status"
      case "followup":
        return "Schedule Follow-up"
      default:
        return "Lead Action"
    }
  }

  const getIcon = () => {
    switch (actionType) {
      case "email":
        return <Mail className="h-5 w-5" />
      case "call":
        return <Phone className="h-5 w-5" />
      case "note":
        return <FileText className="h-5 w-5" />
      case "status":
        return <User className="h-5 w-5" />
      case "followup":
        return <Clock className="h-5 w-5" />
      default:
        return <Tag className="h-5 w-5" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            {getTitle()}
          </DialogTitle>
          <DialogDescription>
            {actionType === "email" && `Send an email to ${lead?.email || "this lead"}`}
            {actionType === "note" && `Add a note for ${lead?.name || lead?.instagramUserId}`}
            {actionType === "status" && `Update the status for ${lead?.name || lead?.instagramUserId}`}
            {actionType === "followup" && `Schedule a follow-up for ${lead?.name || lead?.instagramUserId}`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {renderContent()}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
