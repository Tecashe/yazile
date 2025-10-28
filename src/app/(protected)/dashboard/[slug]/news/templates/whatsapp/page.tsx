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
import { AlertCircle, Loader2, Trash2, Plus } from "lucide-react"
import { onGetWhatsAppAccounts, onGetWhatsAppTemplates, onCreateWhatsAppTemplate } from "@/actions/whatsapp"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function WhatsAppTemplatesPage() {
  const [accounts, setAccounts] = useState<any[]>([])
  const [selectedAccount, setSelectedAccount] = useState<string>("")
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    templateName: "",
    templateId: "",
    language: "en",
    category: "UTILITY",
    status: "PENDING",
    headerType: "TEXT",
    headerText: "",
    bodyText: "",
    footerText: "",
    buttonType: "",
    buttonText: "",
    buttonUrl: "",
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchAccounts()
  }, [])

  useEffect(() => {
    if (selectedAccount) {
      fetchTemplates(selectedAccount)
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

  async function fetchTemplates(accountId: string) {
    try {
      const result = await onGetWhatsAppTemplates(accountId)
      if (result.status === 200) {
        setTemplates(result.data || [])
      }
    } catch (err) {
      setError("Failed to fetch templates")
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedAccount) return

    try {
      setSubmitting(true)
      const result = await onCreateWhatsAppTemplate(selectedAccount, formData)
      if (result.status === 200) {
        setFormData({
          templateName: "",
          templateId: "",
          language: "en",
          category: "UTILITY",
          status: "PENDING",
          headerType: "TEXT",
          headerText: "",
          bodyText: "",
          footerText: "",
          buttonType: "",
          buttonText: "",
          buttonUrl: "",
        })
        setShowForm(false)
        await fetchTemplates(selectedAccount)
      } else {
        setError(result.error || "Failed to create template")
      }
    } catch (err) {
      setError("An error occurred")
    } finally {
      setSubmitting(false)
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
          <h1 className="text-3xl font-bold tracking-tight">WhatsApp Message Templates</h1>
          <p className="text-muted-foreground mt-2">Create and manage WhatsApp message templates</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Template
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
                <CardTitle>Create New Template</CardTitle>
                <CardDescription>WhatsApp templates must be approved before use</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="templateName">Template Name</Label>
                      <Input
                        id="templateName"
                        value={formData.templateName}
                        onChange={(e) => setFormData({ ...formData, templateName: e.target.value })}
                        placeholder="e.g., welcome_template"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={formData.language}
                        onValueChange={(value) => setFormData({ ...formData, language: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="pt">Portuguese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AUTHENTICATION">Authentication</SelectItem>
                          <SelectItem value="MARKETING">Marketing</SelectItem>
                          <SelectItem value="UTILITY">Utility</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="headerType">Header Type</Label>
                      <Select
                        value={formData.headerType}
                        onValueChange={(value) => setFormData({ ...formData, headerType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TEXT">Text</SelectItem>
                          <SelectItem value="IMAGE">Image</SelectItem>
                          <SelectItem value="VIDEO">Video</SelectItem>
                          <SelectItem value="DOCUMENT">Document</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {formData.headerType === "TEXT" && (
                    <div>
                      <Label htmlFor="headerText">Header Text</Label>
                      <Input
                        id="headerText"
                        value={formData.headerText}
                        onChange={(e) => setFormData({ ...formData, headerText: e.target.value })}
                        placeholder="Header text"
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="bodyText">Body Text</Label>
                    <Textarea
                      id="bodyText"
                      value={formData.bodyText}
                      onChange={(e) => setFormData({ ...formData, bodyText: e.target.value })}
                      placeholder="Template body text"
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="footerText">Footer Text (Optional)</Label>
                    <Input
                      id="footerText"
                      value={formData.footerText}
                      onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
                      placeholder="Footer text"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="buttonType">Button Type</Label>
                      <Select
                        value={formData.buttonType}
                        onValueChange={(value) => setFormData({ ...formData, buttonType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="None" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="QUICK_REPLY">Quick Reply</SelectItem>
                          <SelectItem value="CALL_TO_ACTION">Call to Action</SelectItem>
                          <SelectItem value="URL">URL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {formData.buttonType && formData.buttonType !== "none" && (
                      <div>
                        <Label htmlFor="buttonText">Button Text</Label>
                        <Input
                          id="buttonText"
                          value={formData.buttonText}
                          onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                          placeholder="Button text"
                        />
                      </div>
                    )}
                  </div>

                  {formData.buttonType === "URL" && (
                    <div>
                      <Label htmlFor="buttonUrl">Button URL</Label>
                      <Input
                        id="buttonUrl"
                        value={formData.buttonUrl}
                        onChange={(e) => setFormData({ ...formData, buttonUrl: e.target.value })}
                        placeholder="https://example.com"
                        type="url"
                      />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button type="submit" disabled={submitting}>
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Create Template
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
            {templates.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No templates created yet</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              templates.map((template) => (
                <Card key={template.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{template.templateName}</CardTitle>
                        <CardDescription>
                          {template.language.toUpperCase()} • {template.category}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          template.status === "APPROVED"
                            ? "default"
                            : template.status === "REJECTED"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {template.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 p-3 bg-muted rounded space-y-2">
                      {template.headerText && <p className="text-xs font-semibold">{template.headerText}</p>}
                      <p className="text-sm">{template.bodyText}</p>
                      {template.footerText && <p className="text-xs text-muted-foreground">{template.footerText}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4" />
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
