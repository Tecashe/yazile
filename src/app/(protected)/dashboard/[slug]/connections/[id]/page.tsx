"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { 
  ArrowLeft, 
  Settings, 
  Workflow, 
  ExternalLink, 
  Loader, 
  AlertTriangle, 
  RefreshCw, 
  Edit,
  Save,
  X,
  Trash2,
  TestTube,
  CheckCircle,
  XCircle,
  PlusCircle,
  Copy,
  Eye,
  EyeOff
} from "lucide-react"
import { onUserInfor } from "@/actions/user"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { ErrorBoundary } from "react-error-boundary"

// Define types for our data
interface N8nWorkflow {
  id: string
  name: string
  workflowType: string
  isActive: boolean
  description?: string
  lastRun?: string
  status?: 'success' | 'error' | 'running' | 'waiting'
}

interface N8nConnection {
  id: string
  name: string
  n8nUrl: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  description?: string
  apiKey?: string
  webhookUrl?: string
  workflows: N8nWorkflow[]
  stats?: {
    totalWorkflows: number
    activeWorkflows: number
    totalExecutions: number
    successfulExecutions: number
    failedExecutions: number
  }
}

interface EditFormData {
  name: string
  n8nUrl: string
  description: string
  isActive: boolean
}

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="p-6 text-center">
      <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-red-500">Something went wrong</h2>
      <p className="text-muted-foreground mt-2 mb-4">
        {error.message || "We encountered an error while loading the connection details."}
      </p>
      <Button onClick={resetErrorBoundary}>
        <RefreshCw className="mr-2 h-4 w-4" />
        Try Again
      </Button>
    </div>
  )
}

function ConnectionDetailsContent({ connectionId }: { connectionId: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
  const slug = slugMatch ? slugMatch[1] : ""
  const { toast } = useToast()

  const [connection, setConnection] = useState<N8nConnection | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [editForm, setEditForm] = useState<EditFormData>({
    name: "",
    n8nUrl: "",
    description: "",
    isActive: false
  })

  // Check for error or success messages in URL params
  const errorMessage = searchParams.get("error")
  const successMessage = searchParams.get("success")

  useEffect(() => {
  console.log("🔗 Connection ID from params:", connectionId)
  console.log("🔗 Type of connection ID:", typeof connectionId)
  console.log("🔗 Current pathname:", pathname)
  console.log("🔗 Search params:", searchParams.toString())
}, [connectionId, pathname, searchParams])

  useEffect(() => {
    // Show toast for error or success messages from URL
    if (errorMessage) {
      toast({
        title: "Error",
        description: decodeURIComponent(errorMessage),
        variant: "destructive",
      })

      // Clear the error from the URL
      const params = new URLSearchParams(searchParams.toString())
      params.delete("error")
      router.replace(`${pathname}?${params.toString()}`)
    }

    if (successMessage) {
      toast({
        title: "Success",
        description: decodeURIComponent(successMessage),
      })

      // Clear the success message from the URL
      const params = new URLSearchParams(searchParams.toString())
      params.delete("success")
      router.replace(`${pathname}?${params.toString()}`)
    }
  }, [errorMessage, successMessage, toast, router, pathname, searchParams])

  useEffect(() => {
    fetchConnection()
  }, [connectionId, router])

const fetchConnection = async () => {
  try {
    setLoading(true)
    setError(null)
    
    console.log("🔍 Starting connection fetch for ID:", connectionId)

    // Get user info with detailed logging
    console.log("👤 Fetching user information...")
    const userResponse = await onUserInfor()
    console.log("👤 User response:", userResponse)
    
    const userId = userResponse.data?.id
    console.log("👤 Extracted user ID:", userId)

    if (!userId) {
      console.error("❌ No user ID found, redirecting to sign-in")
      router.push("/sign-in")
      return
    }

    // Fetch connection details with detailed logging
    const apiUrl = `/api/n8n/connections/${connectionId}`
    console.log("🌐 Fetching from API URL:", apiUrl)
    
    const response = await fetch(apiUrl)
    console.log("🌐 API Response status:", response.status)
    console.log("🌐 API Response ok:", response.ok)

    if (!response.ok) {
      console.error("❌ API Response not OK")
      
      // Try to get response body for more info
      let errorData
      try {
        errorData = await response.json()
        console.error("❌ Error data:", errorData)
      } catch (e) {
        console.error("❌ Could not parse error response:", e)
        errorData = {}
      }

      if (response.status === 404) {
        console.error("❌ 404 - Connection not found in database")
        throw new Error("Connection not found")
      }
      
      throw new Error(errorData.error || "Failed to fetch connection details")
    }

    const data = await response.json()
    console.log("✅ API Response data:", data)
    console.log("✅ Connection object:", data.connection)

    if (!data.connection) {
      console.error("❌ No connection object in response data")
      throw new Error("No connection data received")
    }

    setConnection(data.connection)
    
    // Initialize edit form
    if (data.connection) {
      const formData = {
        name: data.connection.name || "",
        n8nUrl: data.connection.n8nUrl || "",
        description: data.connection.description || "",
        isActive: data.connection.isActive || false
      }
      console.log("📝 Setting edit form data:", formData)
      setEditForm(formData)
    }
    
    console.log("✅ Connection fetch completed successfully")
    
  } catch (err) {
    console.error("❌ Error in fetchConnection:", err)
    setError(err instanceof Error ? err.message : "An error occurred")
  } finally {
    setLoading(false)
  }
}

  const handleSave = async () => {
    try {
      setSaving(true)
      
      const response = await fetch(`/api/n8n/connections/${connectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to update connection")
      }

      const data = await response.json()
      setConnection(data.connection)
      setEditMode(false)
      
      toast({
        title: "Success",
        description: "Connection updated successfully",
      })
      
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update connection",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleTestConnection = async () => {
    try {
      setTesting(true)
      
      const response = await fetch(`/api/n8n/connections/${connectionId}/test`, {
        method: 'POST',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Connection test failed")
      }

      toast({
        title: "Success",
        description: "Connection test successful",
      })
      
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Connection test failed",
        variant: "destructive",
      })
    } finally {
      setTesting(false)
    }
  }

  const handleDelete = async () => {
    try {
      setDeleting(true)
      
      const response = await fetch(`/api/n8n/connections/${connectionId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to delete connection")
      }

      toast({
        title: "Success",
        description: "Connection deleted successfully",
      })
      
      router.push(`/dashboard/${slug}/connections`)
      
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete connection",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: `${label} copied to clipboard`,
    })
  }

  const getWorkflowStatusIcon = (status?: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'running':
        return <Loader className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return <Workflow className="h-4 w-4 text-muted-foreground" />
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Loading connection details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <p>{error}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchConnection}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/${slug}/connections`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Connections
              </Link>
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  if (!connection) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Connection not found</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href={`/dashboard/${slug}/connections`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Connections
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
        <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Debug Info (remove after fixing):</h3>
            <p><strong>Connection ID:</strong> {connectionId}</p>
            <p><strong>Connection object:</strong> {connection ? 'Found' : 'Not found'}</p>
            <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
            <p><strong>Error:</strong> {error || 'None'}</p>
        </CardContent>
        </Card>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/${slug}/connections`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{connection?.name || "Loading..."}</h1>
            <p className="text-muted-foreground">
              {connection?.createdAt ? (
                <>
                  Created {new Date(connection.createdAt).toLocaleDateString()}
                  {connection.updatedAt && connection.updatedAt !== connection.createdAt && (
                    <> • Updated {new Date(connection.updatedAt).toLocaleDateString()}</>
                  )}
                </>
              ) : (
                "Loading connection details..."
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={connection?.isActive ? "default" : "outline"}>
            {connection?.isActive ? "Active" : "Inactive"}
          </Badge>
          <Button variant="outline" onClick={fetchConnection}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" onClick={() => setEditMode(!editMode)}>
            {editMode ? <X className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
            {editMode ? "Cancel" : "Edit"}
          </Button>
        </div>
      </div>

      {/* Connection Details */}
      <Card>
        <CardHeader>
          <CardTitle>Connection Details</CardTitle>
          <CardDescription>
            {editMode ? "Edit your n8n connection settings" : "View your n8n connection information"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {editMode ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Connection Name</Label>
                  <Input
                    id="name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="Enter connection name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="n8nUrl">n8n URL</Label>
                  <Input
                    id="n8nUrl"
                    value={editForm.n8nUrl}
                    onChange={(e) => setEditForm({ ...editForm, n8nUrl: e.target.value })}
                    placeholder="https://your-n8n-instance.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Optional description for this connection"
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={editForm.isActive}
                  onCheckedChange={(checked) => setEditForm({ ...editForm, isActive: checked })}
                />
                <Label htmlFor="isActive">Active Connection</Label>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Connection Name</h3>
                  <p className="text-sm text-muted-foreground">{connection?.name || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Status</h3>
                  <Badge variant={connection?.isActive ? "default" : "outline"}>
                    {connection?.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  n8n URL
                  {connection?.n8nUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(connection.n8nUrl, "n8n URL")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  )}
                </h3>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">{connection?.n8nUrl || "N/A"}</p>
                  {connection?.n8nUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={connection.n8nUrl} target="_blank">
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
              {connection?.description && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">{connection.description}</p>
                </div>
              )}
              {connection?.webhookUrl && (
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    Webhook URL
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(connection.webhookUrl!, "Webhook URL")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </h3>
                  <p className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded">
                    {connection.webhookUrl}
                  </p>
                </div>
              )}
              {connection?.apiKey && (
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    API Key
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(connection.apiKey!, "API Key")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </h3>
                  <p className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded">
                    {showApiKey ? connection.apiKey : "••••••••••••••••"}
                  </p>
                </div>
              )}
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={handleTestConnection} disabled={testing}>
                  {testing ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <TestTube className="mr-2 h-4 w-4" />
                  )}
                  Test Connection
                </Button>
                <Button variant="outline" onClick={() => setEditMode(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Connection</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this connection? This action cannot be undone.
                        All associated workflows will also be removed.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} disabled={deleting}>
                        {deleting ? (
                          <Loader className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="mr-2 h-4 w-4" />
                        )}
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      {connection.stats && (
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>Connection usage and performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{connection.stats.totalWorkflows}</div>
                <div className="text-sm text-muted-foreground">Total Workflows</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{connection.stats.activeWorkflows}</div>
                <div className="text-sm text-muted-foreground">Active Workflows</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{connection.stats.totalExecutions}</div>
                <div className="text-sm text-muted-foreground">Total Executions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{connection.stats.successfulExecutions}</div>
                <div className="text-sm text-muted-foreground">Successful</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{connection.stats.failedExecutions}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workflows */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Workflows</CardTitle>
              <CardDescription>
                {connection.workflows.length > 0 
                  ? `${connection.workflows.length} workflow${connection.workflows.length === 1 ? '' : 's'} configured`
                  : "No workflows configured"
                }
              </CardDescription>
            </div>
            <Button asChild>
              <Link href={`/dashboard/${slug}/connections/${connection.id}/workflow/new`}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Workflow
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!connection?.workflows || connection.workflows.length === 0 ? (
            <div className="text-center py-8">
              <Workflow className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No workflows configured</p>
              <Button asChild>
                <Link href={`/dashboard/${slug}/connections/${connection?.id}/workflow/new`}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Your First Workflow
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {connection.workflows.map((workflow) => (
                <div key={workflow.id} className="flex items-center justify-between rounded-md border p-4">
                  <div className="flex items-center gap-3">
                    {getWorkflowStatusIcon(workflow.status)}
                    <div>
                      <p className="font-medium">{workflow.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{workflow.workflowType.replace("_", " ")}</span>
                        {workflow.lastRun && (
                          <>
                            <span>•</span>
                            <span>Last run: {new Date(workflow.lastRun).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                      {workflow.description && (
                        <p className="text-sm text-muted-foreground mt-1">{workflow.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={workflow.isActive ? "default" : "outline"}>
                      {workflow.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/${slug}/connections/${connection?.id}/workflow/${workflow.id}`}>
                        <Settings className="mr-2 h-4 w-4" />
                        Manage
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function ConnectionDetailsPage({ params }: { params: { id: string } }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      <ConnectionDetailsContent connectionId={params.id} />
    </ErrorBoundary>
  )
}
