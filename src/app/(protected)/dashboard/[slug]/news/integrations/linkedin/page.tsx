"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Loader2, Trash2, Plus } from "lucide-react"
import { onGetLinkedInAccounts, onDisconnectLinkedInAccount } from "@/actions/linkedin"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LinkedInIntegrationPage() {
  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [disconnecting, setDisconnecting] = useState<string | null>(null)

  useEffect(() => {
    fetchAccounts()
  }, [])

  async function fetchAccounts() {
    try {
      setLoading(true)
      const result = await onGetLinkedInAccounts()
      if (result.status === 200) {
        setAccounts(result.data || [])
      } else {
        setError(result.error || "Failed to fetch accounts")
      }
    } catch (err) {
      setError("An error occurred while fetching accounts")
    } finally {
      setLoading(false)
    }
  }

  async function handleDisconnect(accountId: string) {
    try {
      setDisconnecting(accountId)
      const result = await onDisconnectLinkedInAccount(accountId)
      if (result.status === 200) {
        setAccounts(accounts.filter((a) => a.id !== accountId))
      } else {
        setError(result.error || "Failed to disconnect account")
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
          <h1 className="text-3xl font-bold tracking-tight">LinkedIn Integration</h1>
          <p className="text-muted-foreground mt-2">Connect and manage your LinkedIn accounts</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Connect Account
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
      ) : accounts.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No LinkedIn accounts connected yet</p>
              <Button>Connect Your First Account</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {accounts.map((account) => (
            <Card key={account.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {account.firstName} {account.lastName}
                    </CardTitle>
                    <CardDescription>{account.headline}</CardDescription>
                  </div>
                  <Badge variant={account.status === "verified" ? "default" : "secondary"}>{account.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">LinkedIn ID</Label>
                    <p className="font-mono text-sm">{account.linkedInId}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Connected</Label>
                    <p className="text-sm">{new Date(account.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    View Automations
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDisconnect(account.id)}
                    disabled={disconnecting === account.id}
                  >
                    {disconnecting === account.id ? (
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
