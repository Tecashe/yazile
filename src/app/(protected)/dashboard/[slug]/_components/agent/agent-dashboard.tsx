"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { getBusinessWithActiveAgent, getAvailableIntegrations } from "@/actions/ai-agents"
import { Bot, Building2, Edit, Globe, MessageSquare, Settings, Zap, CheckCircle, Loader2 } from "lucide-react"

interface AgentDashboardProps {
  onEdit: () => void
}

export function AgentDashboard({ onEdit }: AgentDashboardProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [business, setBusiness] = useState<any>(null)
  const [activeAgent, setActiveAgent] = useState<any>(null)
  const [integrations, setIntegrations] = useState<any[]>([])

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true)

        // Load business with active agent
        const businessResult = await getBusinessWithActiveAgent()
        if (businessResult.status === 200 && businessResult.data) {
          setBusiness(businessResult.data)
          setActiveAgent(businessResult.data.aiAgents[0] || null)
        }

        // Load integrations
        const integrationsResult = await getAvailableIntegrations()
        if (integrationsResult.status === 200) {
          setIntegrations(integrationsResult.data)
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [toast])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    )
  }

  if (!business || !activeAgent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Active Agent</h3>
            <p className="text-muted-foreground mb-4">You need to create and activate an AI agent first.</p>
            <Button onClick={onEdit}>Create Agent</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getCapabilityDescription = (integrationType: string, capability: string, enabled: boolean) => {
    if (!enabled) return null

    const descriptions: Record<string, Record<string, string>> = {
      STRIPE: {
        create_payment_links: "Create payment links for customers",
        process_refunds: "Process refunds and handle payment disputes",
        view_transactions: "View and explain transaction history",
        manage_subscriptions: "Manage customer subscriptions",
      },
      SHOPIFY: {
        view_orders: "View and track customer orders",
        update_inventory: "Update product inventory levels",
        create_discounts: "Create discount codes for customers",
        manage_customers: "Manage customer information",
      },
      GOOGLE_CALENDAR: {
        schedule_meetings: "Schedule meetings and appointments",
        view_availability: "Check availability and free time slots",
        send_invites: "Send calendar invites to participants",
      },
      SLACK: {
        send_messages: "Send messages to team channels",
        create_channels: "Create new channels for discussions",
        manage_notifications: "Manage notification settings",
      },
      MAILCHIMP: {
        manage_campaigns: "Create and manage email campaigns",
        segment_audiences: "Segment audiences for targeted messaging",
        track_analytics: "Track email performance analytics",
      },
    }

    return descriptions[integrationType]?.[capability] || `${capability.replace(/_/g, " ")}`
  }

  return (
    <div className="min-h-screen bg-background dark">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Agent Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Your AI assistant is ready to handle DMs for {business.businessName}
                </p>
              </div>
            </div>
            <Button onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Setup
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Agent Card */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                Active AI Agent
              </CardTitle>
              <CardDescription>Currently handling your DMs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                  {activeAgent.avatar ? (
                    <img
                      src={activeAgent.avatar || "/placeholder.svg"}
                      alt={activeAgent.name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-semibold text-primary">
                      {activeAgent.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{activeAgent.name}</h3>
                  <p className="text-muted-foreground">{activeAgent.description}</p>
                  <Badge variant="secondary" className="mt-1">
                    {activeAgent.agentType?.replace(/-/g, " ") || "AI Assistant"}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Introductory Message
                </h4>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm italic">
                    "
                    {activeAgent.introductoryStatement ||
                      `Hi, I'm ${activeAgent.name} from ${business.businessName}. How can I help you today?`}
                    "
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Language</h4>
                  <p className="text-sm text-muted-foreground">{activeAgent.primaryLanguage || "English"}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Tone</h4>
                  <p className="text-sm text-muted-foreground capitalize">{activeAgent.tone || "Professional"}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Personality Traits</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Friendliness:</span>
                    <span>{activeAgent.friendliness || 7}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Formality:</span>
                    <span>{activeAgent.formality || 5}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Enthusiasm:</span>
                    <span>{activeAgent.enthusiasm || 6}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Empathy:</span>
                    <span>{activeAgent.empathy || 7}/10</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Business Profile
              </CardTitle>
              <CardDescription>Your business information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold">{business.businessName}</h4>
                <p className="text-sm text-muted-foreground">{business.businessType}</p>
              </div>

              {business.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {business.website}
                  </a>
                </div>
              )}

              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{business.businessDescription}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Response Language</h4>
                <p className="text-sm text-muted-foreground">{business.responseLanguage || "English"}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Integration Capabilities */}
        {integrations.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Agent Capabilities
              </CardTitle>
              <CardDescription>What {activeAgent.name} can do with your connected integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {integrations.map((integration) => {
                  const capabilities = integration.parsedCapabilities || {}
                  const enabledCapabilities = Object.entries(capabilities).filter(([_, enabled]) => enabled)

                  if (enabledCapabilities.length === 0) {
                    return (
                      <div key={integration.id} className="border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Settings className="h-5 w-5 text-muted-foreground" />
                          <h4 className="font-semibold">{integration.name || integration.type}</h4>
                          <Badge variant="outline">Connected</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          No specific capabilities configured for this integration.
                        </p>
                      </div>
                    )
                  }

                  return (
                    <div key={integration.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Settings className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold">{integration.name || integration.type}</h4>
                        <Badge variant="secondary">{enabledCapabilities.length} capabilities</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        This is what {activeAgent.name} can do with your {integration.name || integration.type}{" "}
                        integration:
                      </p>
                      <ul className="space-y-2">
                        {enabledCapabilities.map(([capability, enabled]) => {
                          const description = getCapabilityDescription(integration.type, capability, enabled as boolean)
                          if (!description) return null

                          return (
                            <li key={capability} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span>{description}</span>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}


