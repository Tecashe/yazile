"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Loader2, Trash2, Plus } from "lucide-react"
import { onGetFacebookPages, onDisconnectFacebookPage } from "@/actions/facebook"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function FacebookIntegrationPage() {
  const [pages, setPages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [disconnecting, setDisconnecting] = useState<string | null>(null)

  useEffect(() => {
    fetchPages()
  }, [])

  async function fetchPages() {
    try {
      setLoading(true)
      const result = await onGetFacebookPages()
      if (result.status === 200) {
        setPages(result.data || [])
      } else {
        setError(result.error || "Failed to fetch pages")
      }
    } catch (err) {
      setError("An error occurred while fetching pages")
    } finally {
      setLoading(false)
    }
  }

  async function handleDisconnect(pageId: string) {
    try {
      setDisconnecting(pageId)
      const result = await onDisconnectFacebookPage(pageId)
      if (result.status === 200) {
        setPages(pages.filter((p) => p.id !== pageId))
      } else {
        setError(result.error || "Failed to disconnect page")
      }
    } catch (err) {
      setError("An error occurred while disconnecting")
    } finally {
      setDisconnecting(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Facebook Integration</h1>
          <p className="text-muted-foreground mt-2">Connect and manage your Facebook pages</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Connect Page
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : pages.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No Facebook pages connected yet</p>
              <Button>Connect Your First Page</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pages.map((page) => (
            <Card key={page.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{page.pageName}</CardTitle>
                    <CardDescription>{page.category}</CardDescription>
                  </div>
                  <Badge variant={page.isVerified ? "default" : "secondary"}>
                    {page.isVerified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Page ID</p>
                    <p className="font-mono text-sm">{page.pageId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Connected</p>
                    <p className="text-sm">{new Date(page.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    View Automations
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDisconnect(page.id)}
                    disabled={disconnecting === page.id}
                  >
                    {disconnecting === page.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
