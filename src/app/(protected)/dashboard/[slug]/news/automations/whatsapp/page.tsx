"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Loader2, Trash2, Plus, Edit2 } from "lucide-react"
import {
  onGetWhatsAppAccounts,
  onGetWhatsAppAutomations,
  onCreateWhatsAppAutomation,
  onDeleteWhatsAppAutomation,
} from "@/actions/whatsapp"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function WhatsAppAutomationsPage() {
  const [accounts, setAccounts] = useState<any[]>([])
  const [selectedAccount, setSelectedAccount] = useState<string>("")
  const [automations, setAutomations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<{
    name: string
    trigger: string
    triggerValue: string
    responseType: string
    responseContent: string
    isActive: boolean
    businessHoursOnly: boolean
    delayMinutes: number
    maxResponses: number | undefined
  }>({
    name: "",
    trigger: "keyword",
    triggerValue: "",
    responseType: "text",
    responseContent: "",
    isActive: true,
    businessHoursOnly: false,
    delayMinutes: 0,
    maxResponses: undefined,
  })
  
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchAccounts()
  }, [])

  useEffect(() => {
    if (selectedAccount) {
      fetchAutomations(selectedAccount)
    }
  }, [selectedAccount])

  async function fetchAccounts() {
    try {
      setLoading(true)
      const result = await onGetWhatsAppAccounts()
      if (result.status === 200  && result.data) {
        setAccounts(result.data || [])
        if (result.data?.length > 0) {
          setSelectedAccount(result.data[0].id)
        }
      } else {
        setError(result.error || "Failed to fetch accounts")
      }
    } catch (err) {
      setError("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  async function fetchAutomations(accountId: string) {
    try {
      const result = await onGetWhatsAppAutomations(accountId)
      if (result.status === 200) {
        setAutomations(result.data || [])
      }
    } catch (err) {
      setError("Failed to fetch automations")
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedAccount) return

    try {
      setSubmitting(true)
      const result = await onCreateWhatsAppAutomation(selectedAccount, formData)
      if (result.status === 200) {
        setFormData({
          name: "",
          trigger: "keyword",
          triggerValue: "",
          responseType: "text",
          responseContent: "",
          isActive: true,
          businessHoursOnly: false,
          delayMinutes: 0,
          maxResponses: undefined,
        })
        setShowForm(false)
        await fetchAutomations(selectedAccount)
      } else {
        setError(result.error || "Failed to create automation")
      }
    } catch (err) {
      setError("An error occurred")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(ruleId: string) {
    if (!confirm("Are you sure you want to delete this automation?")) return
    try {
      const result = await onDeleteWhatsAppAutomation(ruleId)
      if (result.status === 200) {
        if (selectedAccount) {
          await fetchAutomations(selectedAccount)
        }
      } else {
        setError(result.error || "Failed to delete automation")
      }
    } catch (err) {
      setError("An error occurred")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">WhatsApp Automations</h1>
          <p className="text-muted-foreground mt-2">Set up automated responses for WhatsApp messages</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Automation
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {accounts.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">No WhatsApp accounts connected. Please connect an account first.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            <Label>Select Account</Label>
            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.displayName || account.phoneNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {showForm && (
            <Card>
              <CardHeader>
                <CardTitle>Create New Automation</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Automation Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Welcome Message"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="trigger">Trigger Type</Label>
                      <Select
                        value={formData.trigger}
                        onValueChange={(value) => setFormData({ ...formData, trigger: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="keyword">Keyword</SelectItem>
                          <SelectItem value="welcome">Welcome Message</SelectItem>
                          <SelectItem value="business_hours">Business Hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="triggerValue">Trigger Value</Label>
                      <Input
                        id="triggerValue"
                        value={formData.triggerValue}
                        onChange={(e) => setFormData({ ...formData, triggerValue: e.target.value })}
                        placeholder="e.g., hello, hi"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="responseContent">Response Message</Label>
                    <Textarea
                      id="responseContent"
                      value={formData.responseContent}
                      onChange={(e) => setFormData({ ...formData, responseContent: e.target.value })}
                      placeholder="Enter your automated response"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="delayMinutes">Delay (minutes)</Label>
                      <Input
                        id="delayMinutes"
                        type="number"
                        value={formData.delayMinutes}
                        onChange={(e) =>
                          setFormData({ ...formData, delayMinutes: Number.parseInt(e.target.value) || 0 })
                        }
                        min="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxResponses">Max Responses</Label>
                      <Input
                        id="maxResponses"
                        type="number"
                        value={formData.maxResponses || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            maxResponses: e.target.value ? Number.parseInt(e.target.value) : undefined,
                          })
                        }
                        placeholder="Leave empty for unlimited"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="businessHours"
                        checked={formData.businessHoursOnly}
                        onChange={(e) => setFormData({ ...formData, businessHoursOnly: e.target.checked })}
                      />
                      <Label htmlFor="businessHours" className="cursor-pointer">
                        Business Hours Only
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      />
                      <Label htmlFor="isActive" className="cursor-pointer">
                        Active
                      </Label>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={submitting}>
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Create Automation
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {automations.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No automations created yet</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              automations.map((automation) => (
                <Card key={automation.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{automation.name}</CardTitle>
                        <CardDescription>Trigger: {automation.trigger}</CardDescription>
                      </div>
                      <Badge variant={automation.isActive ? "default" : "secondary"}>
                        {automation.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 p-3 bg-muted rounded">
                      <p className="text-sm">{automation.responseContent}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(automation.id)}
                        className="gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}
