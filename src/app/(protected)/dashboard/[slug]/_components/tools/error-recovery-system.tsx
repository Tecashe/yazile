"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, RefreshCw, Clock, CheckCircle, XCircle, Zap, Settings, History } from "lucide-react"

interface ErrorLog {
  id: string
  timestamp: string
  type: "auth" | "rate_limit" | "network" | "validation" | "server"
  message: string
  details: string
  integrationId: string
  integrationName: string
  resolved: boolean
  autoRetryCount: number
  lastRetryAt?: string
}

interface RecoveryAction {
  id: string
  type: "retry" | "refresh_token" | "reconnect" | "manual"
  label: string
  description: string
  automated: boolean
}

interface ErrorRecoverySystemProps {
  integrationId?: string
}

export function ErrorRecoverySystem({ integrationId }: ErrorRecoverySystemProps) {
  const [errors, setErrors] = useState<ErrorLog[]>([])
  const [loading, setLoading] = useState(true)
  const [retrying, setRetrying] = useState<string | null>(null)

  useEffect(() => {
    fetchErrors()
    const interval = setInterval(fetchErrors, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [integrationId])

  const fetchErrors = async () => {
    try {
      const url = integrationId ? `/api/integrations/${integrationId}/errors` : "/api/integrations/errors"
      const response = await fetch(url)
      const data = await response.json()
      setErrors(data)
    } catch (error) {
      console.error("Failed to fetch errors:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = async (errorId: string, action: RecoveryAction) => {
    setRetrying(errorId)
    try {
      const response = await fetch(`/api/integrations/errors/${errorId}/retry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: action.type }),
      })

      if (response.ok) {
        await fetchErrors() // Refresh the error list
      }
    } catch (error) {
      console.error("Retry failed:", error)
    } finally {
      setRetrying(null)
    }
  }

  const getErrorIcon = (type: ErrorLog["type"]) => {
    switch (type) {
      case "auth":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "rate_limit":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "network":
        return <Zap className="h-4 w-4 text-orange-500" />
      case "validation":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "server":
        return <Settings className="h-4 w-4 text-gray-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-red-500" />
    }
  }

  const getRecoveryActions = (error: ErrorLog): RecoveryAction[] => {
    switch (error.type) {
      case "auth":
        return [
          {
            id: "refresh_token",
            type: "refresh_token",
            label: "Refresh Token",
            description: "Attempt to refresh the authentication token",
            automated: true,
          },
          {
            id: "reconnect",
            type: "reconnect",
            label: "Reconnect",
            description: "Re-establish the connection with fresh credentials",
            automated: false,
          },
        ]
      case "rate_limit":
        return [
          {
            id: "retry_later",
            type: "retry",
            label: "Retry Later",
            description: "Wait for rate limit reset and retry automatically",
            automated: true,
          },
        ]
      case "network":
        return [
          {
            id: "retry_now",
            type: "retry",
            label: "Retry Now",
            description: "Immediately retry the failed request",
            automated: false,
          },
        ]
      default:
        return [
          {
            id: "retry",
            type: "retry",
            label: "Retry",
            description: "Retry the failed operation",
            automated: false,
          },
        ]
    }
  }

  const activeErrors = errors.filter((e) => !e.resolved)
  const resolvedErrors = errors.filter((e) => e.resolved)

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Recovery System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Error Recovery System
        </CardTitle>
        <CardDescription>Monitor and resolve integration errors automatically or manually</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active" className="flex items-center gap-2">
              Active Issues
              {activeErrors.length > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {activeErrors.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="resolved" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Resolved
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeErrors.length === 0 ? (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>No active errors. All integrations are functioning normally.</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {activeErrors.map((error) => (
                  <Card key={error.id} className="border-l-4 border-l-red-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            {getErrorIcon(error.type)}
                            <span className="font-medium">{error.integrationName}</span>
                            <Badge variant="outline">{error.type.replace("_", " ")}</Badge>
                          </div>

                          <p className="text-sm text-muted-foreground">{error.message}</p>

                          <details className="text-xs">
                            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                              Technical Details
                            </summary>
                            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">{error.details}</pre>
                          </details>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Occurred: {new Date(error.timestamp).toLocaleString()}</span>
                            {error.autoRetryCount > 0 && <span>Auto-retries: {error.autoRetryCount}</span>}
                            {error.lastRetryAt && (
                              <span>Last retry: {new Date(error.lastRetryAt).toLocaleString()}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
                          {getRecoveryActions(error).map((action) => (
                            <Button
                              key={action.id}
                              size="sm"
                              variant={action.automated ? "default" : "outline"}
                              onClick={() => handleRetry(error.id, action)}
                              disabled={retrying === error.id}
                              className="whitespace-nowrap"
                            >
                              {retrying === error.id ? (
                                <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                              ) : action.automated ? (
                                <Zap className="h-3 w-3 mr-1" />
                              ) : (
                                <RefreshCw className="h-3 w-3 mr-1" />
                              )}
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4">
            {resolvedErrors.length === 0 ? (
              <Alert>
                <History className="h-4 w-4" />
                <AlertDescription>No resolved errors in recent history.</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2">
                {resolvedErrors.slice(0, 10).map((error) => (
                  <div key={error.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <div>
                        <span className="text-sm font-medium">{error.integrationName}</span>
                        <p className="text-xs text-muted-foreground">{error.message}</p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(error.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
