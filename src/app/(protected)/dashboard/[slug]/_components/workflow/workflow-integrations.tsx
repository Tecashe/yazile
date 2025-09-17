"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { CreditCard, Calendar, Mail, ShoppingCart, Settings, CheckCircle, Plus, ExternalLink } from "lucide-react"

interface Integration {
  id: string
  name: string
  type: string
  isActive: boolean
  capabilities: Array<{
    id: string
    name: string
    description: string
  }>
}

const getIntegrationIcon = (type: string) => {
  switch (type.toUpperCase()) {
    case "STRIPE":
      return CreditCard
    case "SHOPIFY":
      return ShoppingCart
    case "CALENDLY":
      return Calendar
    case "SENDGRID":
      return Mail
    default:
      return Settings
  }
}

interface WorkflowIntegrationsProps {
  integrations: Integration[]
  onToggleIntegration?: (integrationId: string) => void
}

export default function WorkflowIntegrations({ integrations, onToggleIntegration }: WorkflowIntegrationsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Connected Integrations</h2>
          <p className="text-muted-foreground">Manage your connected services and their available capabilities</p>
        </div>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Integration
        </Button>
      </div>

      {integrations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Settings className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Integrations Connected</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Connect your first integration to start building AI workflows that can interact with your business tools.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Connect Your First Integration
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {integrations.map((integration) => {
            const IntegrationIcon = getIntegrationIcon(integration.type)
            return (
              <Card key={integration.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <IntegrationIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <Badge variant={integration.isActive ? "default" : "secondary"} className="mt-1">
                          {integration.isActive ? "Connected" : "Disconnected"}
                        </Badge>
                      </div>
                    </div>
                    <Switch
                      checked={integration.isActive}
                      onCheckedChange={() => onToggleIntegration?.(integration.id)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Available Actions:</Label>
                      <div className="mt-2 space-y-1">
                        {integration.capabilities.map((capability) => (
                          <div key={capability.id} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-primary flex-shrink-0" />
                            <span className="flex-1">{capability.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <ExternalLink className="h-3 w-3 mr-2" />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
