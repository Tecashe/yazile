"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Webhook, Copy, Check, Eye, EyeOff, Shield, Info, ExternalLink, RefreshCw } from "lucide-react"
import type { WebhookConfig } from "@/types/integration"

interface WebhookConfigurationProps {
  integrationName: string
  integrationType: string
  webhookConfig?: WebhookConfig
  onWebhookConfigChange: (config: WebhookConfig) => void
  environment: string
}

export function WebhookConfiguration({
  integrationName,
  integrationType,
  webhookConfig,
  onWebhookConfigChange,
  environment,
}: WebhookConfigurationProps) {
  const [showSecret, setShowSecret] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [isGeneratingSecret, setIsGeneratingSecret] = useState(false)

  // Generate webhook URL based on environment and integration type
  const generateWebhookUrl = () => {
    const baseUrl = window.location.origin
    const envPrefix = environment === "production" ? "" : `${environment}-`
    return `${baseUrl}/api/webhooks/${envPrefix}${integrationType.toLowerCase()}`
  }

  const webhookUrl = generateWebhookUrl()

  const generateWebhookSecret = () => {
    setIsGeneratingSecret(true)
    // Generate a cryptographically secure random string
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    const secret = btoa(String.fromCharCode.apply(null, Array.from(array)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "")

    setTimeout(() => {
      onWebhookConfigChange({
        ...webhookConfig,
        secret,
        url: webhookUrl,
      } as WebhookConfig)
      setIsGeneratingSecret(false)
    }, 500)
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const getWebhookEvents = (integrationType: string): string[] => {
    const eventMap: Record<string, string[]> = {
      STRIPE: [
        "payment_intent.succeeded",
        "payment_intent.payment_failed",
        "invoice.payment_succeeded",
        "customer.subscription.created",
        "customer.subscription.updated",
        "customer.subscription.deleted",
      ],
      PAYPAL: [
        "PAYMENT.SALE.COMPLETED",
        "PAYMENT.SALE.DENIED",
        "BILLING.SUBSCRIPTION.CREATED",
        "BILLING.SUBSCRIPTION.CANCELLED",
      ],
      SHOPIFY: [
        "orders/create",
        "orders/updated",
        "orders/paid",
        "orders/cancelled",
        "customers/create",
        "customers/update",
      ],
      CALENDLY: ["invitee.created", "invitee.canceled"],
      ZOOM: ["meeting.started", "meeting.ended", "recording.completed"],
    }
    return eventMap[integrationType] || []
  }

  const availableEvents = getWebhookEvents(integrationType)
  const selectedEvents = webhookConfig?.events || []

  const handleEventToggle = (event: string, enabled: boolean) => {
    const newEvents = enabled ? [...selectedEvents, event] : selectedEvents.filter((e) => e !== event)

    onWebhookConfigChange({
      ...webhookConfig,
      events: newEvents,
      url: webhookUrl,
    } as WebhookConfig)
  }

  if (availableEvents.length === 0) {
    return null // Don't show webhook config for integrations that don't support it
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Webhook className="h-4 w-4" />
          Webhook Configuration
        </CardTitle>
        <CardDescription>Configure webhooks to receive real-time notifications from {integrationName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Webhook URL */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            Webhook URL
            <Badge variant="secondary" className="text-xs">
              Auto-generated
            </Badge>
          </Label>
          <div className="flex gap-2">
            <Input value={webhookUrl} readOnly className="font-mono text-sm bg-muted/30" />
            <Button variant="outline" size="sm" onClick={() => copyToClipboard(webhookUrl, "url")}>
              {copiedField === "url" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Use this URL in your {integrationName} webhook settings</p>
        </div>

        {/* Webhook Secret */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            Webhook Secret
            <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
              <Shield className="h-3 w-3 mr-1" />
              Required
            </Badge>
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type={showSecret ? "text" : "password"}
                value={webhookConfig?.secret || ""}
                onChange={(e) =>
                  onWebhookConfigChange({
                    ...webhookConfig,
                    secret: e.target.value,
                    url: webhookUrl,
                  } as WebhookConfig)
                }
                placeholder="Enter or generate a webhook secret"
                className="font-mono text-sm pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowSecret(!showSecret)}
              >
                {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(webhookConfig?.secret || "", "secret")}
              disabled={!webhookConfig?.secret}
            >
              {copiedField === "secret" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={generateWebhookSecret} disabled={isGeneratingSecret}>
              {isGeneratingSecret ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            This secret is used to verify webhook authenticity. Keep it secure!
          </p>
        </div>

        {/* Event Selection */}
        <div className="space-y-3">
          <Label>Webhook Events</Label>
          <p className="text-sm text-muted-foreground">Select which events you want to receive webhooks for</p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableEvents.map((event) => (
              <div key={event} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono bg-muted/30 px-2 py-1 rounded">{event}</code>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{getEventDescription(event)}</p>
                </div>
                <Switch
                  checked={selectedEvents.includes(event)}
                  onCheckedChange={(enabled) => handleEventToggle(event, enabled)}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {selectedEvents.length} of {availableEvents.length} events selected
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onWebhookConfigChange({
                    ...webhookConfig,
                    events: availableEvents,
                    url: webhookUrl,
                  } as WebhookConfig)
                }
                disabled={selectedEvents.length === availableEvents.length}
              >
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onWebhookConfigChange({
                    ...webhookConfig,
                    events: [],
                    url: webhookUrl,
                  } as WebhookConfig)
                }
                disabled={selectedEvents.length === 0}
              >
                Clear All
              </Button>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <Alert className="border-blue-500/20 bg-blue-500/5">
          <Shield className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-600">
            <strong>Security Best Practices:</strong>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Always verify webhook signatures using the secret</li>
              <li>• Use HTTPS endpoints only</li>
              <li>• Implement idempotency for webhook handlers</li>
              <li>• Log webhook events for debugging</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Setup Instructions */}
        <Alert className="border-orange-500/20 bg-orange-500/5">
          <Info className="h-4 w-4 text-orange-500" />
          <AlertDescription className="text-orange-600">
            <strong>Setup Instructions:</strong>
            <br />
            Copy the webhook URL and secret to your {integrationName} dashboard.
            <Button variant="link" className="p-0 h-auto text-orange-600 underline ml-1">
              View {integrationName} webhook docs
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}

function getEventDescription(event: string): string {
  const descriptions: Record<string, string> = {
    // Stripe
    "payment_intent.succeeded": "Triggered when a payment is successfully processed",
    "payment_intent.payment_failed": "Triggered when a payment fails",
    "invoice.payment_succeeded": "Triggered when an invoice payment succeeds",
    "customer.subscription.created": "Triggered when a new subscription is created",
    "customer.subscription.updated": "Triggered when a subscription is modified",
    "customer.subscription.deleted": "Triggered when a subscription is cancelled",

    // PayPal
    "PAYMENT.SALE.COMPLETED": "Triggered when a payment sale is completed",
    "PAYMENT.SALE.DENIED": "Triggered when a payment sale is denied",
    "BILLING.SUBSCRIPTION.CREATED": "Triggered when a billing subscription is created",
    "BILLING.SUBSCRIPTION.CANCELLED": "Triggered when a billing subscription is cancelled",

    // Shopify
    "orders/create": "Triggered when a new order is created",
    "orders/updated": "Triggered when an order is updated",
    "orders/paid": "Triggered when an order is paid",
    "orders/cancelled": "Triggered when an order is cancelled",
    "customers/create": "Triggered when a new customer is created",
    "customers/update": "Triggered when customer information is updated",

    // Calendly
    "invitee.created": "Triggered when someone books a meeting",
    "invitee.canceled": "Triggered when a meeting is cancelled",

    // Zoom
    "meeting.started": "Triggered when a meeting starts",
    "meeting.ended": "Triggered when a meeting ends",
    "recording.completed": "Triggered when a meeting recording is ready",
  }

  return descriptions[event] || "Event notification"
}
