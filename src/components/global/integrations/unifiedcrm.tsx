"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CheckCircle,
  ExternalLink,
  Settings,
  Trash2,
  Loader2,
  Shield,
  RefreshCw,
  Activity,
  Clock,
  Target,
} from "lucide-react"


interface UnifiedCRMIntegrationProps {
  userId: string
  analytics: any
  selectedLeads?: string[]
  onLeadSelectionChange?: (leads: string[]) => void
}

export function UnifiedCRMIntegration({
  userId,
  analytics,
  selectedLeads = [],
  onLeadSelectionChange,
}: UnifiedCRMIntegrationProps) {
  const [currentConfig, setCurrentConfig] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isConnecting, setIsConnecting] = useState(false)
  const [testConnection, setTestConnection] = useState(false)
  const [showNewConnection, setShowNewConnection] = useState(false)
  const [newConnection, setNewConnection] = useState({
    provider: "",
    name: "",
    apiKey: "",
    apiSecret: "",
    baseUrl: "",
  })

  // Sync Settings State
  const [syncSettings, setSyncSettings] = useState({
    autoSyncQualified: true,
    createDealsHighValue: true,
    syncLeadScores: true,
    realTimeSync: true,
  })

  // Manual Sync State
  const [isManualSyncing, setIsManualSyncing] = useState(false)
  const [isBatchSyncing, setIsBatchSyncing] = useState(false)
  const [syncFilters, setSyncFilters] = useState({
    status: "",
    minScore: "",
    leadTier: "",
  })

  const providers = [
    {
      id: "HUBSPOT",
      name: "HubSpot",
      description: "Connect with HubSpot CRM for contacts and deals",
      logo: "/hubspot.png",
      features: ["Contacts", "Deals", "Companies", "Custom Properties"],
      supportsOAuth: true,
      requiresSecret: false,
      requiresBaseUrl: false,
      oauthScopes: ["crm.objects.contacts.write", "crm.objects.deals.write"],
    },
    {
      id: "SALESFORCE",
      name: "Salesforce",
      description: "Integrate with Salesforce for lead management",
      logo: "/salesforce.png",
      features: ["Leads", "Opportunities", "Accounts", "Custom Fields"],
      supportsOAuth: true,
      requiresSecret: true,
      requiresBaseUrl: true,
      oauthScopes: ["api", "refresh_token"],
    },
    {
      id: "PIPEDRIVE",
      name: "Pipedrive",
      description: "Sync leads with Pipedrive pipeline",
      logo: "/pipedrive.png",
      features: ["Persons", "Deals", "Organizations", "Activities"],
      supportsOAuth: true,
      requiresSecret: false,
      requiresBaseUrl: true,
      oauthScopes: ["base"],
    },
    {
      id: "ZOHO",
      name: "Zoho CRM",
      description: "Connect with Zoho CRM for comprehensive lead management",
      logo: "/zoho.png",
      features: ["Leads", "Contacts", "Deals", "Custom Modules"],
      supportsOAuth: false,
      requiresSecret: true,
      requiresBaseUrl: true,
      oauthScopes: [],
    },
  ]

  useEffect(() => {
    fetchCurrentConfig()
    fetchSyncSettings()
  }, [userId])

  const fetchCurrentConfig = async () => {
    try {
      const response = await fetch(`/api/crm/config?userId=${userId}`)
      if (response.ok) {
        const config = await response.json()
        setCurrentConfig(config)
      }
    } catch (error) {
      console.error("Error fetching CRM config:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSyncSettings = async () => {
    try {
      const response = await fetch(`/api/crm/sync-settings?userId=${userId}`)
      if (response.ok) {
        const settings = await response.json()
        setSyncSettings(settings)
      }
    } catch (error) {
      console.error("Error fetching sync settings:", error)
    }
  }

  const updateSyncSettings = async (newSettings: any) => {
    try {
      const response = await fetch("/api/crm/sync-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          settings: newSettings,
        }),
      })

      if (response.ok) {
        setSyncSettings(newSettings)
        toast.success("Sync settings updated successfully")
      } else {
        toast.error("Failed to update sync settings")
      }
    } catch (error) {
      toast.error("Error updating sync settings")
      console.error("Sync settings error:", error)
    }
  }

  const handleOAuthConnect = async (provider: any) => {
    setIsConnecting(true)
    try {
      const response = await fetch("/api/crm/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          provider: provider.id,
          connectionType: "oauth",
        }),
      })

      const data = await response.json()

      if (response.ok && data.oauthUrl) {
        window.location.href = data.oauthUrl
      } else {
        toast.error(data.error || "Failed to initiate OAuth connection")
      }
    } catch (error) {
      toast.error("Failed to connect CRM")
      console.error("OAuth connection error:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleApiKeyConnect = async () => {
    if (!newConnection.provider || !newConnection.name || !newConnection.apiKey) {
      toast.error("Please fill in all required fields")
      return
    }

    const selectedProvider = providers.find((p) => p.id === newConnection.provider)
    if (selectedProvider?.requiresSecret && !newConnection.apiSecret) {
      toast.error("API Secret is required for this provider")
      return
    }
    if (selectedProvider?.requiresBaseUrl && !newConnection.baseUrl) {
      toast.error("Base URL is required for this provider")
      return
    }

    setIsConnecting(true)
    try {
      const response = await fetch("/api/crm/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          connectionType: "api",
          ...newConnection,
        }),
      })

      if (response.ok) {
        toast.success("CRM connected successfully!")
        setShowNewConnection(false)
        setNewConnection({ provider: "", name: "", apiKey: "", apiSecret: "", baseUrl: "" })
        fetchCurrentConfig()
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to connect CRM")
      }
    } catch (error) {
      toast.error("Failed to connect CRM")
      console.error("Connection error:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleTestConnection = async () => {
    setTestConnection(true)
    try {
      const response = await fetch("/api/crm/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      if (response.ok) {
        toast.success("CRM connection is working!")
      } else {
        const error = await response.json()
        toast.error(error.error || "CRM connection failed")
      }
    } catch (error) {
      toast.error("Failed to test connection")
    } finally {
      setTestConnection(false)
    }
  }

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect your CRM? This will stop all automatic syncing.")) {
      return
    }

    try {
      const response = await fetch("/api/crm/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      if (response.ok) {
        toast.success("CRM disconnected successfully")
        setCurrentConfig(null)
      } else {
        toast.error("Failed to disconnect CRM")
      }
    } catch (error) {
      toast.error("Failed to disconnect CRM")
    }
  }

  const handleManualSync = async () => {
    if (selectedLeads.length === 0) {
      toast.error("Please select leads to sync")
      return
    }

    setIsManualSyncing(true)
    try {
      // const result = await manualSyncToCRM(selectedLeads, userId)

      // Placeholder for manual sync - replace with actual implementation
      const result = { success: true, summary: { successful: selectedLeads.length, failed: 0 } }

      if (result.success && result.summary) {
        toast.success(`Successfully synced ${result.summary.successful} leads to CRM`)
        if (result.summary.failed > 0) {
          toast.warning(`${result.summary.failed} leads failed to sync`)
        }
        onLeadSelectionChange?.([])
      } else {
        toast.error("Failed to sync leads")
      }
    } catch (error) {
      toast.error("An error occurred during sync")
      console.error("Manual sync error:", error)
    } finally {
      setIsManualSyncing(false)
    }
  }

  const handleBatchSync = async () => {
    setIsBatchSyncing(true)
    try {
      const filters = {
        status: syncFilters.status || undefined,
        minScore: syncFilters.minScore ? Number.parseInt(syncFilters.minScore) : undefined,
        leadTier: syncFilters.leadTier || undefined,
      }

      // const result = await batchSyncToCRM(userId, filters)

      // Placeholder for batch sync - replace with actual implementation
      const result = { success: true, summary: { successful: 25, failed: 2 } }

      if (result.success && result.summary) {
        toast.success(`Batch sync completed: ${result.summary.successful} leads synced`)
        if (result.summary.failed > 0) {
          toast.warning(`${result.summary.failed} leads failed to sync`)
        }
      } else {
        toast.error("Batch sync failed")
      }
    } catch (error) {
      toast.error("An error occurred during batch sync")
      console.error("Batch sync error:", error)
    } finally {
      setIsBatchSyncing(false)
    }
  }

  const handleViewInCRM = (lead: any) => {
    if (lead.crmId) {
      window.open(`https://hubspot.com/contacts/${lead.crmId}`, "_blank")
    } else {
      toast.info("Lead not synced to CRM yet. Would you like to sync now?")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading CRM configuration...</span>
      </div>
    )
  }

  const crmStats = analytics?.crmStatus?.integrations || []
  const hasActiveCRM = currentConfig?.isActive || false

  return (
    <div className="space-y-6">
      {/* CRM Connection Status */}
      {hasActiveCRM ? (
        <Card className="border-green-200 bg-green-50/50 dark:bg-green-900/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 flex items-center justify-center">
                  <img
                    src={providers.find((p) => p.id === currentConfig.provider)?.logo || "/placeholder.svg"}
                    alt="Provider Logo"
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {providers.find((p) => p.id === currentConfig.provider)?.name}
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {currentConfig.name} - Connected on {new Date(currentConfig.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleTestConnection} disabled={testConnection}>
                  {testConnection ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Settings className="h-4 w-4 mr-2" />
                  )}
                  Test Connection
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDisconnect}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-muted-foreground">Provider</Label>
                <p className="font-medium">{currentConfig.provider}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <p className="font-medium text-green-600">Active & Syncing</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Last Sync</Label>
                <p className="font-medium">
                  {currentConfig.lastSynced ? new Date(currentConfig.lastSynced).toLocaleString() : "Never"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Base URL</Label>
                <p className="font-medium">{currentConfig.baseUrl || "Default"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {!showNewConnection ? (
            <>
              <div className="text-center py-8">
                <ExternalLink className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Connect Your CRM</h3>
                <p className="text-muted-foreground mb-6">
                  Automatically sync your qualified leads to your favorite CRM platform
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {providers.map((provider) => (
                  <Card key={provider.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 flex items-center justify-center">
                          <img
                            src={provider.logo || "/placeholder.svg"}
                            alt={`${provider.name} logo`}
                            className="w-12 h-12 object-contain"
                          />
                        </div>
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {provider.name}
                            {provider.supportsOAuth && (
                              <Badge variant="outline" className="text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                OAuth
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="text-sm">{provider.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">Features:</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {provider.features.map((feature) => (
                              <Badge key={feature} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {provider.supportsOAuth && (
                            <Button
                              className="flex-1"
                              onClick={() => handleOAuthConnect(provider)}
                              disabled={isConnecting}
                            >
                              {isConnecting ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : (
                                <Shield className="h-4 w-4 mr-2" />
                              )}
                              OAuth Connect
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            className="flex-1 bg-transparent"
                            onClick={() => {
                              setNewConnection({ ...newConnection, provider: provider.id })
                              setShowNewConnection(true)
                            }}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            API Key
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="text-2xl">
                    <img
                      src={providers.find((p) => p.id === newConnection.provider)?.logo || "/placeholder.svg"}
                      alt="Provider Logo"
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  Connect {providers.find((p) => p.id === newConnection.provider)?.name}
                </CardTitle>
                <CardDescription>
                  Enter your {providers.find((p) => p.id === newConnection.provider)?.name} API credentials to connect
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Connection Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Main CRM Account"
                    value={newConnection.name}
                    onChange={(e) => setNewConnection({ ...newConnection, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key *</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Enter your API key"
                    value={newConnection.apiKey}
                    onChange={(e) => setNewConnection({ ...newConnection, apiKey: e.target.value })}
                  />
                </div>

                {providers.find((p) => p.id === newConnection.provider)?.requiresSecret && (
                  <div className="space-y-2">
                    <Label htmlFor="apiSecret">API Secret *</Label>
                    <Input
                      id="apiSecret"
                      type="password"
                      placeholder="Enter your API secret"
                      value={newConnection.apiSecret}
                      onChange={(e) => setNewConnection({ ...newConnection, apiSecret: e.target.value })}
                    />
                  </div>
                )}

                {providers.find((p) => p.id === newConnection.provider)?.requiresBaseUrl && (
                  <div className="space-y-2">
                    <Label htmlFor="baseUrl">Base URL *</Label>
                    <Input
                      id="baseUrl"
                      placeholder="e.g., https://your-instance.salesforce.com"
                      value={newConnection.baseUrl}
                      onChange={(e) => setNewConnection({ ...newConnection, baseUrl: e.target.value })}
                    />
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button onClick={handleApiKeyConnect} disabled={isConnecting} className="flex-1">
                    {isConnecting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Connect
                  </Button>
                  <Button variant="outline" onClick={() => setShowNewConnection(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Sync Settings - Only show if CRM is connected */}
      {hasActiveCRM && (
        <Card>
          <CardHeader>
            <CardTitle>Sync Settings</CardTitle>
            <CardDescription>Configure how leads are synchronized with your CRM</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Auto-sync qualified leads</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically sync leads when they reach Qualified status
                </p>
              </div>
              <Switch
                checked={syncSettings.autoSyncQualified}
                onCheckedChange={(checked) => updateSyncSettings({ ...syncSettings, autoSyncQualified: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Create deals for high-value leads</Label>
                <p className="text-xs text-muted-foreground">
                  Create deals/opportunities for Platinum and Gold tier leads
                </p>
              </div>
              <Switch
                checked={syncSettings.createDealsHighValue}
                onCheckedChange={(checked) => updateSyncSettings({ ...syncSettings, createDealsHighValue: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Sync lead scores</Label>
                <p className="text-xs text-muted-foreground">Include AI-generated lead scores in CRM records</p>
              </div>
              <Switch
                checked={syncSettings.syncLeadScores}
                onCheckedChange={(checked) => updateSyncSettings({ ...syncSettings, syncLeadScores: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Real-time sync</Label>
                <p className="text-xs text-muted-foreground">Sync leads immediately when qualified</p>
              </div>
              <Switch
                checked={syncSettings.realTimeSync}
                onCheckedChange={(checked) => updateSyncSettings({ ...syncSettings, realTimeSync: checked })}
              />
            </div>
          </CardContent>
        </Card>
      )}     
    </div>
  )
}

// Export the handleViewInCRM function for use in other components
// export const handleViewInCRM = (lead: any) => {
//   if (lead.crmId) {
//     window.open(`https://hubspot.com/contacts/${lead.crmId}`, "_blank")
//   } else {
//     toast.info("Lead not synced to CRM yet. Would you like to sync now?")
//   }
// }
