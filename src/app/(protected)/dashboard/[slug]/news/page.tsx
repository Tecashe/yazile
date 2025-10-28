"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, MessageSquare } from "lucide-react"
import { onGetLinkedInAccounts } from "@/actions/linkedin"
import { onGetWhatsAppAccounts } from "@/actions/whatsapp"
import { onGetFacebookPages } from "@/actions/facebook"

export default function DashboardPage() {
  const [linkedInAccounts, setLinkedInAccounts] = useState<any[]>([])
  const [whatsAppAccounts, setWhatsAppAccounts] = useState<any[]>([])
  const [facebookPages, setFacebookPages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      const [linkedIn, whatsApp, facebook] = await Promise.all([
        onGetLinkedInAccounts(),
        onGetWhatsAppAccounts(),
        onGetFacebookPages(),
      ])

      if (linkedIn.status === 200) setLinkedInAccounts(linkedIn.data || [])
      if (whatsApp.status === 200) setWhatsAppAccounts(whatsApp.data || [])
      if (facebook.status === 200) setFacebookPages(facebook.data || [])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const totalAccounts = linkedInAccounts.length + whatsAppAccounts.length + facebookPages.length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage your DM automation across all platforms</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Connected Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAccounts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {linkedInAccounts.length} LinkedIn • {whatsAppAccounts.length} WhatsApp • {facebookPages.length} Facebook
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Automations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">Across all platforms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Messages Processed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              LinkedIn
            </CardTitle>
            <CardDescription>Professional messaging automation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Connected Accounts: {linkedInAccounts.length}</p>
              {linkedInAccounts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No accounts connected</p>
              ) : (
                <div className="space-y-2">
                  {linkedInAccounts.map((account) => (
                    <div key={account.id} className="text-sm">
                      <p className="font-medium">
                        {account.firstName} {account.lastName}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {account.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button variant="outline" className="w-full bg-transparent">
              Manage LinkedIn
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              WhatsApp
            </CardTitle>
            <CardDescription>Business messaging automation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Connected Accounts: {whatsAppAccounts.length}</p>
              {whatsAppAccounts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No accounts connected</p>
              ) : (
                <div className="space-y-2">
                  {whatsAppAccounts.map((account) => (
                    <div key={account.id} className="text-sm">
                      <p className="font-medium">{account.displayName || account.phoneNumber}</p>
                      <Badge variant={account.businessVerified ? "default" : "secondary"} className="text-xs">
                        {account.businessVerified ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button variant="outline" className="w-full bg-transparent">
              Manage WhatsApp
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Facebook
            </CardTitle>
            <CardDescription>Page messaging automation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Connected Pages: {facebookPages.length}</p>
              {facebookPages.length === 0 ? (
                <p className="text-sm text-muted-foreground">No pages connected</p>
              ) : (
                <div className="space-y-2">
                  {facebookPages.map((page) => (
                    <div key={page.id} className="text-sm">
                      <p className="font-medium">{page.pageName}</p>
                      <Badge variant={page.isVerified ? "default" : "secondary"} className="text-xs">
                        {page.isVerified ? "Verified" : "Unverified"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button variant="outline" className="w-full bg-transparent">
              Manage Facebook
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Start Guide</CardTitle>
          <CardDescription>Get started with DM automation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <p className="font-medium">Connect Your Accounts</p>
                <p className="text-sm text-muted-foreground">Link your LinkedIn, WhatsApp, and Facebook accounts</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <p className="font-medium">Create Automations</p>
                <p className="text-sm text-muted-foreground">
                  Set up triggers and automated responses for each platform
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <p className="font-medium">Monitor & Optimize</p>
                <p className="text-sm text-muted-foreground">Track performance and refine your automations</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
