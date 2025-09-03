"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  CreditCard,
  Users,
  Calendar,
  Mail,
  MessageSquare,
  ShoppingCart,
  BarChart3,
  Webhook,
  Settings,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Zap,
  Building2,
  Phone,
  Globe,
  Database,
  Lock,
} from "lucide-react"

// Integration categories and their available services
const INTEGRATION_CATEGORIES = {
  ecommerce: {
    title: "E-commerce & Payments",
    description: "Payment processing, order management, and e-commerce platforms",
    icon: CreditCard,
    color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    integrations: [
      {
        id: "stripe",
        name: "Stripe",
        type: "STRIPE",
        description: "Accept payments, create payment links, manage subscriptions",
        icon: CreditCard,
        fields: [
          { key: "publishable_key", label: "Publishable Key", type: "text", required: true },
          { key: "secret_key", label: "Secret Key", type: "password", required: true },
          { key: "webhook_secret", label: "Webhook Secret", type: "password", required: false },
        ],
        endpoints: ["Create Payment Link", "Verify Payment Status", "Process Refund", "Get Customer Details"],
      },
      {
        id: "shopify",
        name: "Shopify",
        type: "SHOPIFY",
        description: "Sync products, manage orders, track inventory",
        icon: ShoppingCart,
        fields: [
          {
            key: "shop_domain",
            label: "Shop Domain",
            type: "text",
            required: true,
            placeholder: "your-shop.myshopify.com",
          },
          { key: "access_token", label: "Access Token", type: "password", required: true },
          { key: "api_version", label: "API Version", type: "text", required: false, placeholder: "2023-10" },
        ],
        endpoints: ["Get Product Info", "Check Inventory", "Create Order", "Update Order Status"],
      },
    ],
  },
  crm: {
    title: "CRM & Sales",
    description: "Customer relationship management and sales automation",
    icon: Users,
    color: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    integrations: [
      {
        id: "hubspot",
        name: "HubSpot",
        type: "HUBSPOT",
        description: "Manage contacts, deals, and customer interactions",
        icon: Users,
        fields: [
          { key: "api_key", label: "API Key", type: "password", required: true },
          { key: "portal_id", label: "Portal ID", type: "text", required: true },
        ],
        endpoints: ["Create Contact", "Update Deal Stage", "Log Activity", "Get Contact Info"],
      },
      {
        id: "salesforce",
        name: "Salesforce",
        type: "SALESFORCE",
        description: "Enterprise CRM integration for leads and opportunities",
        icon: Building2,
        fields: [
          { key: "client_id", label: "Client ID", type: "text", required: true },
          { key: "client_secret", label: "Client Secret", type: "password", required: true },
          { key: "username", label: "Username", type: "text", required: true },
          { key: "password", label: "Password", type: "password", required: true },
          { key: "security_token", label: "Security Token", type: "password", required: true },
        ],
        endpoints: ["Create Lead", "Update Opportunity", "Search Accounts", "Log Call Activity"],
      },
      {
        id: "pipedrive",
        name: "Pipedrive",
        type: "PIPEDRIVE",
        description: "Simple CRM for managing your sales pipeline",
        icon: BarChart3,
        fields: [
          { key: "api_token", label: "API Token", type: "password", required: true },
          { key: "company_domain", label: "Company Domain", type: "text", required: true, placeholder: "yourcompany" },
        ],
        endpoints: ["Add Person", "Create Deal", "Update Pipeline", "Get Activities"],
      },
    ],
  },
  communication: {
    title: "Communication & Marketing",
    description: "Email marketing, SMS, and communication platforms",
    icon: Mail,
    color: "bg-purple-500/10 border-purple-500/20 text-purple-400",
    integrations: [
      {
        id: "mailchimp",
        name: "Mailchimp",
        type: "MAILCHIMP",
        description: "Email marketing and audience management",
        icon: Mail,
        fields: [
          { key: "api_key", label: "API Key", type: "password", required: true },
          { key: "server_prefix", label: "Server Prefix", type: "text", required: true, placeholder: "us1" },
        ],
        endpoints: ["Add Subscriber", "Send Campaign", "Get List Stats", "Update Contact"],
      },
      {
        id: "sendgrid",
        name: "SendGrid",
        type: "SENDGRID",
        description: "Transactional email delivery service",
        icon: MessageSquare,
        fields: [{ key: "api_key", label: "API Key", type: "password", required: true }],
        endpoints: ["Send Email", "Add to List", "Get Email Stats", "Validate Email"],
      },
      {
        id: "twilio",
        name: "Twilio",
        type: "TWILIO",
        description: "SMS and voice communication platform",
        icon: Phone,
        fields: [
          { key: "account_sid", label: "Account SID", type: "text", required: true },
          { key: "auth_token", label: "Auth Token", type: "password", required: true },
          {
            key: "phone_number",
            label: "Twilio Phone Number",
            type: "text",
            required: true,
            placeholder: "+1234567890",
          },
        ],
        endpoints: ["Send SMS", "Make Call", "Get Message Status", "Lookup Phone Number"],
      },
    ],
  },
  scheduling: {
    title: "Scheduling & Booking",
    description: "Appointment booking and calendar management",
    icon: Calendar,
    color: "bg-orange-500/10 border-orange-500/20 text-orange-400",
    integrations: [
      {
        id: "calendly",
        name: "Calendly",
        type: "CALENDLY",
        description: "Automated scheduling and booking platform",
        icon: Calendar,
        fields: [
          { key: "api_key", label: "API Key", type: "password", required: true },
          { key: "organization_uri", label: "Organization URI", type: "text", required: true },
        ],
        endpoints: ["Create Event", "Get Availability", "Cancel Booking", "Get Event Details"],
      },
      {
        id: "acuity",
        name: "Acuity Scheduling",
        type: "ACUITY",
        description: "Professional appointment scheduling software",
        icon: Calendar,
        fields: [
          { key: "user_id", label: "User ID", type: "text", required: true },
          { key: "api_key", label: "API Key", type: "password", required: true },
        ],
        endpoints: ["Book Appointment", "Check Availability", "Get Appointments", "Update Appointment"],
      },
    ],
  },
  automation: {
    title: "Automation & Webhooks",
    description: "Workflow automation and custom integrations",
    icon: Zap,
    color: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
    integrations: [
      {
        id: "zapier",
        name: "Zapier",
        type: "ZAPIER",
        description: "Connect apps and automate workflows",
        icon: Zap,
        fields: [{ key: "webhook_url", label: "Webhook URL", type: "text", required: true }],
        endpoints: ["Trigger Zap", "Send Data", "Execute Workflow"],
      },
      {
        id: "webhook",
        name: "Custom Webhook",
        type: "WEBHOOK",
        description: "Custom webhook endpoints for any service",
        icon: Webhook,
        fields: [
          { key: "webhook_url", label: "Webhook URL", type: "text", required: true },
          { key: "secret_key", label: "Secret Key", type: "password", required: false },
          { key: "headers", label: "Custom Headers (JSON)", type: "textarea", required: false },
        ],
        endpoints: ["Send POST Request", "Send GET Request", "Custom API Call"],
      },
    ],
  },
}

interface Integration {
  id: string
  name: string
  type: string
  isActive: boolean
  lastSyncAt?: string
  config?: any
}

interface IntegrationField {
  key: string
  label: string
  type: string
  required: boolean
  placeholder?: string
}

export default function IntegrationsPage() {
  const [activeCategory, setActiveCategory] = useState("ecommerce")
  const [connectedIntegrations, setConnectedIntegrations] = useState<Integration[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null)
  const [showCredentials, setShowCredentials] = useState<Record<string, boolean>>({})
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Load connected integrations on mount
  useEffect(() => {
    loadConnectedIntegrations()
  }, [])

  const loadConnectedIntegrations = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/integrations")
      if (response.ok) {
        const data = await response.json()
        setConnectedIntegrations(data.integrations || [])
      }
    } catch (error) {
      console.error("Failed to load integrations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnect = async (integration: any) => {
    try {
      setIsLoading(true)
      setError(null)

      // Validate required fields
      const missingFields = integration.fields
        .filter((field: IntegrationField) => field.required && !formData[field.key])
        .map((field: IntegrationField) => field.label)

      if (missingFields.length > 0) {
        setError(`Please fill in required fields: ${missingFields.join(", ")}`)
        return
      }

      // Prepare credentials object
      const credentials: Record<string, string> = {}
      integration.fields.forEach((field: IntegrationField) => {
        if (formData[field.key]) {
          credentials[field.key] = formData[field.key]
        }
      })

      const response = await fetch("/api/integrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: integration.type,
          name: integration.name,
          credentials,
        }),
      })

      if (response.ok) {
        setSuccess(`${integration.name} connected successfully!`)
        setFormData({})
        setSelectedIntegration(null)
        loadConnectedIntegrations()
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to connect integration")
      }
    } catch (error) {
      setError("An unexpected error occurred")
      console.error("Integration connection error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = async (integrationId: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/integrations/${integrationId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setSuccess("Integration disconnected successfully")
        loadConnectedIntegrations()
      } else {
        setError("Failed to disconnect integration")
      }
    } catch (error) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const isConnected = (integrationType: string) => {
    return connectedIntegrations.some((integration) => integration.type === integrationType && integration.isActive)
  }

  const getConnectedIntegration = (integrationType: string) => {
    return connectedIntegrations.find((integration) => integration.type === integrationType && integration.isActive)
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-balance">Integrations</h1>
              <p className="text-muted-foreground">Connect your business tools to automate Instagram DM workflows</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-card/50 border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <div>
                    <p className="text-sm text-muted-foreground">Connected</p>
                    <p className="text-2xl font-bold">{connectedIntegrations.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-muted-foreground">Available</p>
                    <p className="text-2xl font-bold">
                      {Object.values(INTEGRATION_CATEGORIES).reduce((acc, cat) => acc + cat.integrations.length, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-purple-400" />
                  <div>
                    <p className="text-sm text-muted-foreground">Security</p>
                    <p className="text-sm font-medium text-emerald-400">AES-256 Encrypted</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <Alert className="border-destructive/20 bg-destructive/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-destructive">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-emerald-500/20 bg-emerald-500/10">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-emerald-400">{success}</AlertDescription>
          </Alert>
        )}

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-muted/50">
            {Object.entries(INTEGRATION_CATEGORIES).map(([key, category]) => {
              const Icon = category.icon
              return (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="flex items-center gap-2 data-[state=active]:bg-background"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{category.title.split(" ")[0]}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {/* Integration Cards */}
          {Object.entries(INTEGRATION_CATEGORIES).map(([categoryKey, category]) => (
            <TabsContent key={categoryKey} value={categoryKey} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${category.color}`}>
                    <category.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{category.title}</h2>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.integrations.map((integration) => {
                    const connected = isConnected(integration.type)
                    const connectedIntegration = getConnectedIntegration(integration.type)
                    const Icon = integration.icon

                    return (
                      <Card
                        key={integration.id}
                        className={`relative transition-all duration-200 hover:shadow-lg ${
                          connected
                            ? "bg-emerald-500/5 border-emerald-500/20"
                            : "bg-card/50 border-border hover:border-primary/30"
                        }`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${category.color}`}>
                                <Icon className="h-5 w-5" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{integration.name}</CardTitle>
                                {connected && (
                                  <Badge
                                    variant="secondary"
                                    className="mt-1 bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Connected
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <CardDescription className="text-sm">{integration.description}</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {/* Available Endpoints */}
                          <div>
                            <p className="text-sm font-medium mb-2">Available Actions:</p>
                            <div className="flex flex-wrap gap-1">
                              {integration.endpoints.slice(0, 3).map((endpoint, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {endpoint}
                                </Badge>
                              ))}
                              {integration.endpoints.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{integration.endpoints.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>

                          <Separator />

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            {connected ? (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDisconnect(connectedIntegration!.id)}
                                  disabled={isLoading}
                                  className="flex-1"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Disconnect
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedIntegration(integration)}
                                  className="flex-1"
                                >
                                  <Settings className="h-4 w-4 mr-2" />
                                  Configure
                                </Button>
                              </>
                            ) : (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    className="w-full"
                                    onClick={() => {
                                      setSelectedIntegration(integration)
                                      setFormData({})
                                      setError(null)
                                      setSuccess(null)
                                    }}
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Connect
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md bg-card border-border">
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                      <Icon className="h-5 w-5" />
                                      Connect {integration.name}
                                    </DialogTitle>
                                    <DialogDescription>
                                      Enter your {integration.name} credentials to enable automation
                                    </DialogDescription>
                                  </DialogHeader>

                                  <div className="space-y-4">
                                    {integration.fields.map((field: IntegrationField) => (
                                      <div key={field.key} className="space-y-2">
                                        <Label htmlFor={field.key} className="flex items-center gap-2">
                                          {field.label}
                                          {field.required && <span className="text-destructive">*</span>}
                                        </Label>
                                        {field.type === "textarea" ? (
                                          <Textarea
                                            id={field.key}
                                            placeholder={field.placeholder}
                                            value={formData[field.key] || ""}
                                            onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                                            className="bg-background border-border"
                                          />
                                        ) : (
                                          <div className="relative">
                                            <Input
                                              id={field.key}
                                              type={
                                                field.type === "password" && !showCredentials[field.key]
                                                  ? "password"
                                                  : "text"
                                              }
                                              placeholder={field.placeholder}
                                              value={formData[field.key] || ""}
                                              onChange={(e) =>
                                                setFormData({ ...formData, [field.key]: e.target.value })
                                              }
                                              className="bg-background border-border pr-10"
                                            />
                                            {field.type === "password" && (
                                              <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3"
                                                onClick={() =>
                                                  setShowCredentials({
                                                    ...showCredentials,
                                                    [field.key]: !showCredentials[field.key],
                                                  })
                                                }
                                              >
                                                {showCredentials[field.key] ? (
                                                  <EyeOff className="h-4 w-4" />
                                                ) : (
                                                  <Eye className="h-4 w-4" />
                                                )}
                                              </Button>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    ))}

                                    <div className="flex gap-2 pt-4">
                                      <Button
                                        variant="outline"
                                        className="flex-1 bg-transparent"
                                        onClick={() => setSelectedIntegration(null)}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        className="flex-1"
                                        onClick={() => handleConnect(integration)}
                                        disabled={isLoading}
                                      >
                                        {isLoading ? "Connecting..." : "Connect"}
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* API Endpoints Info */}
        <Card className="bg-card/30 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              API Endpoints
            </CardTitle>
            <CardDescription>
              These endpoints will be available for your Voiceflow workflows once integrations are connected
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p className="font-medium text-primary">Payment Processing</p>
                <code className="block bg-muted/50 p-2 rounded text-xs">
                  POST /api/integrations/stripe/create-payment-link
                </code>
                <code className="block bg-muted/50 p-2 rounded text-xs">
                  GET /api/integrations/stripe/verify-payment
                </code>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-primary">CRM Operations</p>
                <code className="block bg-muted/50 p-2 rounded text-xs">
                  POST /api/integrations/hubspot/create-contact
                </code>
                <code className="block bg-muted/50 p-2 rounded text-xs">PUT /api/integrations/hubspot/update-deal</code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
