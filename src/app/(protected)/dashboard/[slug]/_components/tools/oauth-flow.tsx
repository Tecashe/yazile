"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Loader2, ExternalLink, Shield, Key } from "lucide-react"
import { OAuthManager } from "@/lib/oauth"
import type { IntegrationDefinition, OAuthConfig } from "@/types/integration"

interface OAuthFlowProps {
  integration: IntegrationDefinition
  onSuccess: (tokens: { access_token: string; refresh_token?: string; expires_in?: number }) => void
  onError: (error: string) => void
}

export function OAuthFlow({ integration, onSuccess, onError }: OAuthFlowProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")
  const [selectedScopes, setSelectedScopes] = useState<string[]>(integration.oauthConfig?.scopes || [])

  const handleOAuthConnect = async () => {
    if (!integration.oauthConfig) {
      onError("OAuth configuration not available for this integration")
      return
    }

    try {
      setIsConnecting(true)
      setProgress(10)
      setCurrentStep("Preparing OAuth flow...")

      const oauthManager = OAuthManager.getInstance()

      const config: OAuthConfig = {
        ...integration.oauthConfig,
        scopes: selectedScopes,
        redirectUri: `${window.location.origin}/oauth/callback`,
      } as OAuthConfig

      setProgress(25)
      setCurrentStep("Opening authorization window...")

      // Start OAuth flow
      const { code, state } = await oauthManager.startOAuthFlow(config)

      setProgress(60)
      setCurrentStep("Exchanging authorization code...")

      // Exchange code for tokens
      const tokens = await oauthManager.exchangeCodeForToken(config, code, state)

      setProgress(90)
      setCurrentStep("Finalizing connection...")

      // Validate tokens by making a test API call
      await validateTokens(integration.type, tokens.access_token)

      setProgress(100)
      setCurrentStep("Connected successfully!")

      setTimeout(() => {
        onSuccess(tokens)
      }, 500)
    } catch (error) {
      console.error("OAuth flow error:", error)
      onError(error instanceof Error ? error.message : "OAuth connection failed")
    } finally {
      setIsConnecting(false)
      setProgress(0)
      setCurrentStep("")
    }
  }

  const validateTokens = async (integrationType: string, accessToken: string) => {
    // Make a simple API call to validate the token
    const endpoints: Record<string, string> = {
      CALENDLY: "https://api.calendly.com/users/me",
      HUBSPOT: "https://api.hubapi.com/oauth/v1/access-tokens/" + accessToken,
      SALESFORCE: "/services/oauth2/userinfo",
      ZOOM: "https://api.zoom.us/v2/users/me",
    }

    const endpoint = endpoints[integrationType]
    if (!endpoint) return // Skip validation for unknown types

    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Token validation failed: ${response.statusText}`)
    }
  }

  const availableScopes = integration.oauthConfig?.scopes || []
  const scopeDescriptions: Record<string, string> = {
    // Calendly scopes
    read: "Read your calendar events and availability",
    write: "Create and modify calendar events",

    // HubSpot scopes
    contacts: "Access and manage contacts",
    content: "Access and manage content",
    reports: "Access analytics and reports",
    social: "Access social media accounts",
    automation: "Access and manage workflows",

    // Salesforce scopes
    api: "Access Salesforce APIs",
    web: "Access Salesforce web interface",
    refresh_token: "Maintain long-term access",
    openid: "Access user identity information",

    // Zoom scopes
    "meeting:write": "Create and manage meetings",
    "meeting:read": "Read meeting information",
    "user:read": "Read user profile information",
    "webinar:write": "Create and manage webinars",
  }

  return (
    <div className="space-y-6">
      {/* OAuth Security Notice */}
      <Alert className="border-blue-500/20 bg-blue-500/5">
        <Shield className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-600">
          <strong>Secure OAuth 2.0 Authentication</strong>
          <br />
          This integration uses industry-standard OAuth 2.0 for secure authentication. Your credentials are never stored
          on our servers.
        </AlertDescription>
      </Alert>

      {/* Scope Selection */}
      {availableScopes.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Permission Scopes
            </CardTitle>
            <CardDescription>Select the permissions you want to grant for this integration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {availableScopes.map((scope) => (
              <div key={scope} className="flex items-start gap-3 p-3 rounded-lg border">
                <input
                  type="checkbox"
                  id={scope}
                  checked={selectedScopes.includes(scope)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedScopes([...selectedScopes, scope])
                    } else {
                      setSelectedScopes(selectedScopes.filter((s) => s !== scope))
                    }
                  }}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label htmlFor={scope} className="font-medium text-sm cursor-pointer">
                    {scope}
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    {scopeDescriptions[scope] || `Access ${scope} functionality`}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Connection Progress */}
      {isConnecting && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Connecting to {integration.name}...</span>
                <span className="font-medium text-blue-400">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground">{currentStep}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connect Button */}
      <Button
        onClick={handleOAuthConnect}
        disabled={isConnecting || selectedScopes.length === 0}
        className="w-full"
        size="lg"
      >
        {isConnecting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <ExternalLink className="h-4 w-4 mr-2" />
            Connect with {integration.name}
          </>
        )}
      </Button>

      {/* OAuth Flow Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
            1
          </div>
          <span>Authorize permissions</span>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
            2
          </div>
          <span>Secure token exchange</span>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
            3
          </div>
          <span>Connection established</span>
        </div>
      </div>
    </div>
  )
}
