"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { RefreshCw, Clock, AlertTriangle, CheckCircle, Loader2, Calendar } from "lucide-react"
import { OAuthManager } from "@/lib/oauth"
import type { Integration, OAuthConfig } from "@/types/integration"

interface TokenRefreshManagerProps {
  integration: Integration
  onTokenRefreshed: (tokens: { access_token: string; refresh_token?: string; expires_in?: number }) => void
  onError: (error: string) => void
}

export function TokenRefreshManager({ integration, onTokenRefreshed, onError }: TokenRefreshManagerProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [timeUntilExpiry, setTimeUntilExpiry] = useState<string>("")
  const [refreshProgress, setRefreshProgress] = useState(0)

  useEffect(() => {
    if (!integration.tokenExpiresAt) return

    const updateTimeUntilExpiry = () => {
      const expiryTime = new Date(integration.tokenExpiresAt!)
      const now = new Date()
      const diff = expiryTime.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeUntilExpiry("Expired")
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

      if (days > 0) {
        setTimeUntilExpiry(`${days}d ${hours}h`)
      } else if (hours > 0) {
        setTimeUntilExpiry(`${hours}h ${minutes}m`)
      } else {
        setTimeUntilExpiry(`${minutes}m`)
      }
    }

    updateTimeUntilExpiry()
    const interval = setInterval(updateTimeUntilExpiry, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [integration.tokenExpiresAt])

  const handleRefreshToken = async () => {
    if (!integration.oauthConfig) {
      onError("OAuth configuration not available")
      return
    }

    try {
      setIsRefreshing(true)
      setRefreshProgress(20)

      const oauthManager = OAuthManager.getInstance()

      // Get stored refresh token (in real app, this would come from secure storage)
      const refreshToken = await getStoredRefreshToken(integration.id)
      if (!refreshToken) {
        throw new Error("No refresh token available. Please reconnect the integration.")
      }

      setRefreshProgress(50)

      const tokens = await oauthManager.refreshToken(integration.oauthConfig as OAuthConfig, refreshToken)

      setRefreshProgress(80)

      // Store new tokens securely
      await storeTokens(integration.id, tokens)

      setRefreshProgress(100)
      onTokenRefreshed(tokens)
    } catch (error) {
      console.error("Token refresh error:", error)
      onError(error instanceof Error ? error.message : "Failed to refresh token")
    } finally {
      setIsRefreshing(false)
      setRefreshProgress(0)
    }
  }

  const getStoredRefreshToken = async (integrationId: string): Promise<string | null> => {
    // In a real implementation, this would fetch from secure backend storage
    const response = await fetch(`/api/integrations/${integrationId}/refresh-token`)
    if (response.ok) {
      const data = await response.json()
      return data.refresh_token
    }
    return null
  }

  const storeTokens = async (integrationId: string, tokens: any) => {
    // Store tokens securely on the backend
    await fetch(`/api/integrations/${integrationId}/tokens`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tokens),
    })
  }

  const getExpiryStatus = () => {
    if (!integration.tokenExpiresAt) return "unknown"

    const expiryTime = new Date(integration.tokenExpiresAt)
    const now = new Date()
    const diff = expiryTime.getTime() - now.getTime()
    const hoursUntilExpiry = diff / (1000 * 60 * 60)

    if (diff <= 0) return "expired"
    if (hoursUntilExpiry <= 24) return "expiring-soon"
    if (hoursUntilExpiry <= 168) return "expiring-this-week" // 7 days
    return "healthy"
  }

  const expiryStatus = getExpiryStatus()

  const getStatusBadge = () => {
    switch (expiryStatus) {
      case "expired":
        return (
          <Badge variant="secondary" className="bg-red-500/10 text-red-400 border-red-500/20">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Expired
          </Badge>
        )
      case "expiring-soon":
        return (
          <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Expiring Soon
          </Badge>
        )
      case "expiring-this-week":
        return (
          <Badge variant="secondary" className="bg-orange-500/10 text-orange-400 border-orange-500/20">
            <Calendar className="h-3 w-3 mr-1" />
            Expiring This Week
          </Badge>
        )
      case "healthy":
        return (
          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Valid
          </Badge>
        )
      default:
        return null
    }
  }

  if (integration.authType !== "oauth2") {
    return null
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Token Management</CardTitle>
          {getStatusBadge()}
        </div>
        <CardDescription>OAuth tokens automatically refresh to maintain secure access</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Token Expiry Info */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Token expires in:</span>
          </div>
          <span
            className={`text-sm font-mono ${
              expiryStatus === "expired"
                ? "text-red-400"
                : expiryStatus === "expiring-soon"
                  ? "text-yellow-400"
                  : "text-muted-foreground"
            }`}
          >
            {timeUntilExpiry || "Unknown"}
          </span>
        </div>

        {/* Refresh Progress */}
        {isRefreshing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Refreshing token...</span>
              <span className="font-medium text-blue-400">{refreshProgress}%</span>
            </div>
            <Progress value={refreshProgress} className="h-2" />
          </div>
        )}

        {/* Expiry Warning */}
        {(expiryStatus === "expired" || expiryStatus === "expiring-soon") && (
          <Alert className="border-yellow-500/20 bg-yellow-500/5">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-600">
              {expiryStatus === "expired"
                ? "Your access token has expired. Refresh it to continue using this integration."
                : "Your access token will expire soon. Consider refreshing it to avoid interruptions."}
            </AlertDescription>
          </Alert>
        )}

        {/* Manual Refresh Button */}
        <Button
          variant="outline"
          onClick={handleRefreshToken}
          disabled={isRefreshing}
          className="w-full bg-transparent"
        >
          {isRefreshing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Refreshing Token...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Token
            </>
          )}
        </Button>

        {/* Auto-refresh Info */}
        <p className="text-xs text-muted-foreground text-center">
          Tokens are automatically refreshed 24 hours before expiry
        </p>
      </CardContent>
    </Card>
  )
}
