"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Loader2, PlayCircle, PauseCircle, Sparkles, BarChart, Activity } from "lucide-react"

interface IntegrationConfig {
  name: string
  apiKey?: string
  apiSecret?: string
  webhookUrl?: string
  projectId?: string
  versionId?: string
  additionalSettings?: Record<string, string>
}

interface BusinessWorkflowConfig {
  id: string
  userId: string
  businessId: string
  workflowTemplateId: string | null
  businessInfo: {
    businessName: string
    businessType: string
    description?: string
    website?: string
    phone?: string
    email?: string
  }
  integrations: { name: string; config: IntegrationConfig }[]
  customRequest?: string
  status: "DRAFT" | "CONFIGURING" | "ACTIVE" | "INACTIVE" | "CUSTOM_REQUEST"
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  workflowTemplate?: {
    id: string
    name: string
    category: string
    description: string
  }
  credentials: {
    id: string
    integrationName: string
    integrationType: string
    encryptedCredentials: string
    isActive: boolean
    lastVerified: Date | null
  }[]
}

interface WorkflowDashboardProps {
  workflowDetails: BusinessWorkflowConfig
  onDeactivate: () => void
  isDeactivating: boolean
}

export default function WorkflowDashboard({ workflowDetails, onDeactivate, isDeactivating }: WorkflowDashboardProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="radial--gradient--automations">
        <div className="max-w-4xl mx-auto p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <PlayCircle className="h-8 w-8 text-green-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              Your Workflow is Running!
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Your &quot;{workflowDetails.workflowTemplate?.name || "Custom Workflow"}&quot; is active and automating
            responses for your business.
          </p>

          <Card className="glassEffect border-2 border-green-500/50 mb-8 p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-2xl flex items-center justify-center gap-2 text-primary">
                <Sparkles className="h-6 w-6" />
                Active Workflow Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-primary">Workflow Type:</Label>
                <p className="text-base bg-accent/50 p-3 rounded-lg">
                  {workflowDetails.workflowTemplate?.name || "Custom Workflow"}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-primary">Business Name:</Label>
                <p className="text-base bg-accent/50 p-3 rounded-lg">{workflowDetails.businessInfo.businessName}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-primary">Business Type:</Label>
                <p className="text-base bg-accent/50 p-3 rounded-lg">{workflowDetails.businessInfo.businessType}</p>
              </div>
              {workflowDetails.customRequest && (
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-primary">Custom Request:</Label>
                  <p className="text-base bg-accent/50 p-3 rounded-lg whitespace-pre-wrap">
                    {workflowDetails.customRequest}
                  </p>
                </div>
              )}
              {workflowDetails.credentials && workflowDetails.credentials.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-primary">Configured Integrations:</Label>
                  <div className="flex flex-wrap gap-2">
                    {workflowDetails.credentials.map((cred, idx) => (
                      <Badge key={idx} variant="secondary" className="text-sm">
                        {cred.integrationName}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-primary">Status:</Label>
                <Badge className="bg-green-600 text-green-50 font-bold px-3 py-1 rounded-full text-sm flex items-center w-fit">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  {workflowDetails.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Placeholder for Workflow Analytics */}
          <Card className="glassEffect border-2 border-border/50 mb-8 p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-2xl flex items-center justify-center gap-2 text-primary">
                <BarChart className="h-6 w-6" />
                Workflow Analytics (Coming Soon!)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
              <p className="text-muted-foreground text-center">
                Detailed insights into your workflow's performance, message volume, and lead qualification will appear
                here.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 bg-accent/50 p-3 rounded-lg">
                  <Label className="text-sm font-semibold text-primary">Total Messages Handled:</Label>
                  <p className="text-xl font-bold text-foreground">--</p>
                </div>
                <div className="space-y-2 bg-accent/50 p-3 rounded-lg">
                  <Label className="text-sm font-semibold text-primary">Leads Qualified:</Label>
                  <p className="text-xl font-bold text-foreground">--</p>
                </div>
                <div className="space-y-2 bg-accent/50 p-3 rounded-lg">
                  <Label className="text-sm font-semibold text-primary">Average Response Time:</Label>
                  <p className="text-xl font-bold text-foreground">--</p>
                </div>
                <div className="space-y-2 bg-accent/50 p-3 rounded-lg">
                  <Label className="text-sm font-semibold text-primary">Successful Integrations:</Label>
                  <p className="text-xl font-bold text-foreground">--</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Placeholder for Recent Activity */}
          <Card className="glassEffect border-2 border-border/50 mb-8 p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-2xl flex items-center justify-center gap-2 text-primary">
                <Activity className="h-6 w-6" />
                Recent Activity (Coming Soon!)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
              <p className="text-muted-foreground text-center">
                See a log of recent interactions, integration calls, and workflow events.
              </p>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  No recent activity to display.
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="mt-8 flex justify-center gap-4">
            <Button
              onClick={onDeactivate}
              disabled={isDeactivating}
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-base font-semibold"
            >
              {isDeactivating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <PauseCircle className="h-4 w-4 mr-2" />
              )}
              {isDeactivating ? "Deactivating..." : "Deactivate Workflow"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-6">
            To choose a different workflow, please deactivate the current one first.
          </p>
        </div>
      </div>
    </div>
  )
}
