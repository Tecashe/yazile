"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MessageSquare, Info, ChevronDown, Send } from "lucide-react"
import type { Lead, LeadInteraction, LeadQualificationData } from "@prisma/client"

interface LeadCardProps {
  lead: Lead & {
    qualificationData?: LeadQualificationData | null
    interactions?: LeadInteraction[]
  }
  onSendToN8n?: (leadId: string) => void
}

export function LeadCard({ lead, onSendToN8n }: LeadCardProps) {
  const [showInteractions, setShowInteractions] = useState(false)

  // Format the score with percentage
  const scoreDisplay = `${lead.score}%`

  // Determine badge color based on status
const getBadgeVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (status) {
      case "NEW":
        return "secondary"
      case "QUALIFYING":
        return "outline" 
      case "QUALIFIED":
        return "default" 
      case "NURTURING":
        return "default"
      case "CONVERTED":
        return "destructive"
      case "DISQUALIFIED":
        return "outline"
      case "LOST":
        return "destructive"
      default:
        return "outline"
    }
  }

  // Get lead category from AI analysis
  const leadCategory = lead.qualificationData?.aiAnalysis
    ? (lead.qualificationData.aiAnalysis as any).leadCategory || "Unknown"
    : "Unknown"

  // Format the timestamp
  const lastInteractionTime = lead.lastContactDate
    ? formatDistanceToNow(new Date(lead.lastContactDate), { addSuffix: true })
    : "Never"

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-md font-medium">Lead {lead.instagramUserId.slice(0, 8)}...</CardTitle>
          <Badge variant={getBadgeVariant(lead.status)}>{lead.status}</Badge>
        </div>
        <CardDescription className="flex items-center gap-1">
          <MessageSquare className="h-3.5 w-3.5" />
          <span>{lead.interactions?.length || 0} interactions</span>
          <span className="mx-1">•</span>
          <span>Last active {lastInteractionTime}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center">
            <div className="text-2xl font-bold">{scoreDisplay}</div>
            <div className="text-xs text-muted-foreground">Overall Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{lead.qualificationData?.intentScore || 0}%</div>
            <div className="text-xs text-muted-foreground">Intent Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{lead.qualificationData?.engagementScore || 0}%</div>
            <div className="text-xs text-muted-foreground">Engagement</div>
          </div>
        </div>

        {lead.qualificationData?.aiAnalysis && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                <Info className="h-4 w-4 mr-2" />
                AI Analysis
                <ChevronDown className="h-4 w-4 ml-auto" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">Lead Analysis</h4>
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-sm">Category:</div>
                  <div className="text-sm font-medium">{leadCategory}</div>

                  <div className="text-sm">Sentiment:</div>
                  <div className="text-sm font-medium">
                    {(lead.qualificationData.aiAnalysis as any).sentiment || "Unknown"}
                  </div>

                  <div className="text-sm">Buying Intent:</div>
                  <div className="text-sm font-medium">
                    {(lead.qualificationData.aiAnalysis as any).purchaseIntent || "Unknown"}/10
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <h5 className="text-sm font-medium mb-1">Summary</h5>
                  <p className="text-sm text-muted-foreground">
                    {(lead.qualificationData.aiAnalysis as any).summary || "No summary available"}
                  </p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </CardContent>

      {lead.interactions && lead.interactions.length > 0 && showInteractions && (
        <div className="px-6 py-3 bg-muted/50">
          <h5 className="text-sm font-medium mb-2">Recent Interactions</h5>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {lead.interactions.map((interaction) => (
              <div key={interaction.id} className="text-sm p-2 bg-background rounded-md">
                <div className="text-xs text-muted-foreground mb-1">
                  {formatDistanceToNow(new Date(interaction.timestamp), { addSuffix: true })}
                </div>
                <p className="break-words">{interaction.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <CardFooter className="flex justify-between pt-4">
        <Button variant="outline" size="sm" onClick={() => setShowInteractions(!showInteractions)}>
          {showInteractions ? "Hide Interactions" : "View Interactions"}
        </Button>

        {!lead.sentToN8n && lead.status === "QUALIFIED" && onSendToN8n && (
          <Button variant="default" size="sm" onClick={() => onSendToN8n(lead.id)}>
            <Send className="h-4 w-4 mr-2" />
            Send to n8n
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
