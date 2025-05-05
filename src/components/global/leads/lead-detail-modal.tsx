"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, MessageSquare, BarChart, User } from "lucide-react"
import type { Lead, LeadInteraction } from "@/types/lead"

// Define types for the workflow object
interface Workflow {
  id: string
  workflowId: string
  name: string
  description?: string
  webhookUrl?: string
  isActive: boolean
}

// Define props for the LeadDetailModal component
interface LeadDetailModalProps {
  lead: Lead
  isOpen: boolean
  onClose: () => void
  workflows: Workflow[]
  onSendToN8n: (leadId: string, workflowId: string) => Promise<void>
}

export default function LeadDetailModal({ lead, isOpen, onClose, workflows, onSendToN8n }: LeadDetailModalProps) {
  const [status, setStatus] = useState<string>(lead.status)
  const [notes, setNotes] = useState<string>(lead.notes || "")
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>(workflows[0]?.workflowId || "")

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/leads/${lead.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus, notes }),
      })

      if (!response.ok) {
        throw new Error("Failed to update lead status")
      }

      setStatus(newStatus)
    } catch (error) {
      console.error("Error updating lead status:", error)
      alert("Error updating lead status: " + (error as Error).message)
    }
  }

  const formatDate = (dateString: string | Date | null | undefined): string => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleString()
  }

  const getSentimentEmoji = (score: number | null | undefined): string => {
    if (!score) return "😐"
    if (score > 2) return "😀"
    if (score > 0) return "🙂"
    if (score === 0) return "😐"
    if (score > -2) return "🙁"
    return "😠"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Lead Details</DialogTitle>
        </DialogHeader>

        <div className="flex items-start gap-4 mb-6">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">{lead.name ? lead.name.charAt(0) : "U"}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h2 className="text-2xl font-bold">{lead.name || "Unknown User"}</h2>
            <p className="text-muted-foreground">{lead.email || lead.instagramUserId}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge
                className={`${
                  status === "NEW"
                    ? "bg-blue-500"
                    : status === "QUALIFYING"
                      ? "bg-yellow-500"
                      : status === "QUALIFIED"
                        ? "bg-green-500"
                        : status === "DISQUALIFIED"
                          ? "bg-red-500"
                          : status === "CONVERTED"
                            ? "bg-purple-500"
                            : status === "NURTURING"
                              ? "bg-indigo-500"
                              : "bg-gray-500"
                }`}
              >
                {status}
              </Badge>
              <p className="text-sm">Score: {lead.score}/10</p>
              <p className="text-sm">Source: {lead.source}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Select value={selectedWorkflow} onValueChange={setSelectedWorkflow}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select workflow" />
              </SelectTrigger>
              <SelectContent>
                {workflows.map((workflow) => (
                  <SelectItem key={workflow.id} value={workflow.workflowId}>
                    {workflow.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={() => onSendToN8n(lead.id, selectedWorkflow)}
              disabled={!selectedWorkflow || lead.sentToN8n}
            >
              <Send className="mr-2 h-4 w-4" />
              {lead.sentToN8n ? "Already Sent" : "Send to n8n"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="interactions">
          <TabsList>
            <TabsTrigger value="interactions">
              <MessageSquare className="mr-2 h-4 w-4" />
              Interactions
            </TabsTrigger>
            <TabsTrigger value="qualification">
              <BarChart className="mr-2 h-4 w-4" />
              Qualification Data
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="interactions">
            <Card>
              <CardHeader>
                <CardTitle>Conversation History</CardTitle>
                <CardDescription>Recent interactions with this lead</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lead.interactions &&
                    lead.interactions.map((interaction: LeadInteraction) => (
                      <div
                        key={interaction.id}
                        className={`p-3 rounded-lg ${
                          interaction.direction === "inbound"
                            ? "bg-muted ml-auto"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-medium">
                            {interaction.direction === "inbound" ? "Customer" : "Bot"}
                          </span>
                          <span className="text-xs">{formatDate(interaction.timestamp)}</span>
                        </div>
                        <p>{interaction.content}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs">
                            Sentiment: {getSentimentEmoji(interaction.sentiment)}
                            {interaction.sentiment ? interaction.sentiment.toFixed(2) : "N/A"}
                          </span>
                          {interaction.intent &&
                            typeof interaction.intent === "object" &&
                            "purchaseIntent" in interaction.intent && (
                              <span className="text-xs">Intent: {(interaction.intent as any).purchaseIntent}/10</span>
                            )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qualification">
            <Card>
              <CardHeader>
                <CardTitle>Qualification Metrics</CardTitle>
                <CardDescription>Data used to qualify this lead</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Scoring Breakdown</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Engagement Score:</span>
                        <span>{lead.qualificationData?.engagementScore || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Intent Score:</span>
                        <span>{lead.qualificationData?.intentScore || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sentiment Score:</span>
                        <span>{lead.qualificationData?.sentimentScore || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Recency Score:</span>
                        <span>{lead.qualificationData?.recencyScore || 0}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Total Score:</span>
                        <span>{lead.score}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Timeline</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>First Contact:</span>
                        <span>{formatDate(lead.firstContactDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Contact:</span>
                        <span>{formatDate(lead.lastContactDate || lead.lastInteractionAt)}</span>
                      </div>
                      {lead.qualifiedDate && (
                        <div className="flex justify-between">
                          <span>Qualified:</span>
                          <span>{formatDate(lead.qualifiedDate)}</span>
                        </div>
                      )}
                      {lead.convertedDate && (
                        <div className="flex justify-between">
                          <span>Converted:</span>
                          <span>{formatDate(lead.convertedDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Lead Profile</CardTitle>
                <CardDescription>Manage lead information and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="status">Lead Status</Label>
                      <Select value={status} onValueChange={handleStatusChange}>
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NEW">New</SelectItem>
                          <SelectItem value="QUALIFYING">Qualifying</SelectItem>
                          <SelectItem value="QUALIFIED">Qualified</SelectItem>
                          <SelectItem value="DISQUALIFIED">Disqualified</SelectItem>
                          <SelectItem value="CONVERTED">Converted</SelectItem>
                          <SelectItem value="NURTURING">Nurturing</SelectItem>
                          <SelectItem value="LOST">Lost</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="source">Source</Label>
                      <div id="source" className="p-2 border rounded-md bg-muted">
                        {lead.source || "Unknown"}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <Button onClick={() => handleStatusChange(status)} className="w-full">
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
