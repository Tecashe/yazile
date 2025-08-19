"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Settings, Zap, Eye, EyeOff, Loader2, CheckCircle, Users, Globe, Mail, Phone } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { toast } from "@/hooks/use-toast"

interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: string
  complexity: string
  integrations: Integration[]
}

interface Integration {
  id: string
  name: string
  description: string
  credentialFields: CredentialField[]
  credentialInstructions: string
}

interface CredentialField {
  name: string
  label: string
  type: string
  required: boolean
  placeholder?: string
  helpText?: string
}

interface BusinessInfo {
  businessName: string
  businessType: string
  description: string
  website: string
  phone: string
  email: string
}

export default function ConfigureWorkflowPage() {
  const router = useRouter()
  const params = useParams()
  const templateId = params.id as string

  const [template, setTemplate] = useState<WorkflowTemplate | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    businessName: "",
    businessType: "",
    description: "",
    website: "",
    phone: "",
    email: "",
  })
  const [credentials, setCredentials] = useState<Record<string, Record<string, string>>>({})
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const loadTemplate = async () => {
      // Mock template data - replace with actual API call
      const mockTemplate: WorkflowTemplate = {
        id: templateId,
        name: "Lead Qualification Assistant",
        description: "Automatically qualify and route leads based on custom criteria",
        category: "AI_ASSISTANT",
        complexity: "Medium",
        integrations: [
          {
            id: "1",
            name: "HubSpot CRM",
            description: "Customer relationship management platform",
            credentialFields: [
              {
                name: "apiKey",
                label: "API Key",
                type: "password",
                required: true,
                helpText: "Found in HubSpot Settings > Integrations > API Key",
                placeholder: "Enter your HubSpot API key",
              },
              {
                name: "portalId",
                label: "Portal ID",
                type: "text",
                required: true,
                helpText: "Your HubSpot Portal ID",
                placeholder: "12345678",
              },
            ],
            credentialInstructions:
              "To get your API key:\n1. Go to HubSpot Settings\n2. Navigate to Integrations > API Key\n3. Generate or copy your existing API key\n4. Your Portal ID can be found in the URL when logged into HubSpot",
          },
        ],
      }

      // Initialize credentials structure
      const initialCredentials: Record<string, Record<string, string>> = {}
      mockTemplate.integrations.forEach((integration) => {
        initialCredentials[integration.name] = {}
        integration.credentialFields.forEach((field) => {
          initialCredentials[integration.name][field.name] = ""
        })
      })

      setTemplate(mockTemplate)
      setCredentials(initialCredentials)
      setLoading(false)
    }

    loadTemplate()
  }, [templateId])

  const handleCredentialChange = (integrationName: string, fieldName: string, value: string) => {
    setCredentials((prev) => ({
      ...prev,
      [integrationName]: {
        ...prev[integrationName],
        [fieldName]: value,
      },
    }))
  }

  const togglePasswordVisibility = (fieldKey: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [fieldKey]: !prev[fieldKey],
    }))
  }

  const handleActivateWorkflow = async () => {
    setSubmitting(true)

    try {
      // Validate required fields
      let hasErrors = false

      // Check business info
      if (!businessInfo.businessName || !businessInfo.email) {
        toast({
          title: "Missing Business Information",
          description: "Please fill in your business name and email address.",
          variant: "destructive",
        })
        hasErrors = true
      }

      // Check credentials
      template?.integrations.forEach((integration) => {
        integration.credentialFields.forEach((field) => {
          if (field.required && !credentials[integration.name]?.[field.name]) {
            toast({
              title: "Missing Credentials",
              description: `Please provide ${field.label} for ${integration.name}.`,
              variant: "destructive",
            })
            hasErrors = true
          }
        })
      })

      if (hasErrors) {
        setSubmitting(false)
        return
      }

      // Simulate API call to activate workflow
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Workflow Activated Successfully!",
        description: `${template?.name} is now active and processing your business data.`,
      })

      // Redirect to dashboard
      router.push("/workflows/dashboard")
    } catch (error) {
      toast({
        title: "Activation Failed",
        description: "There was an error activating your workflow. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading workflow configuration...</p>
        </div>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Workflow Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested workflow template could not be found.</p>
          <Button onClick={() => router.push("/workflows")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Workflows
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push("/workflows")} className="mb-6 hover:bg-accent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Workflows
          </Button>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Configure {template.name}
            </h1>
            <p className="text-muted-foreground text-lg">
              Set up your business information and integration credentials
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Business Information */}
          <Card className="border-2 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Business Information
              </CardTitle>
              <CardDescription>This information will be used to personalize your automated responses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="businessName" className="text-sm font-medium">
                  Business Name *
                </Label>
                <Input
                  id="businessName"
                  value={businessInfo.businessName}
                  onChange={(e) => setBusinessInfo((prev) => ({ ...prev, businessName: e.target.value }))}
                  placeholder="Enter your business name"
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessType" className="text-sm font-medium">
                  Business Type
                </Label>
                <Input
                  id="businessType"
                  value={businessInfo.businessType}
                  onChange={(e) => setBusinessInfo((prev) => ({ ...prev, businessType: e.target.value }))}
                  placeholder="e.g., Technology, Healthcare, Retail"
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Business Description
                </Label>
                <Textarea
                  id="description"
                  value={businessInfo.description}
                  onChange={(e) => setBusinessInfo((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of your business"
                  className="bg-background min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-sm font-medium">
                    <Globe className="h-4 w-4 inline mr-1" />
                    Website
                  </Label>
                  <Input
                    id="website"
                    value={businessInfo.website}
                    onChange={(e) => setBusinessInfo((prev) => ({ ...prev, website: e.target.value }))}
                    placeholder="https://yourwebsite.com"
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    <Phone className="h-4 w-4 inline mr-1" />
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={businessInfo.phone}
                    onChange={(e) => setBusinessInfo((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                    className="bg-background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Contact Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={businessInfo.email}
                  onChange={(e) => setBusinessInfo((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="contact@yourcompany.com"
                  className="bg-background"
                />
              </div>
            </CardContent>
          </Card>

          {/* Workflow Details */}
          <Card className="border-2 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Workflow Details
              </CardTitle>
              <CardDescription>Review the workflow configuration and requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
                <p className="text-muted-foreground mb-4">{template.description}</p>

                <div className="flex gap-2 mb-4">
                  <Badge variant="outline">{template.category}</Badge>
                  <Badge variant="outline">{template.complexity}</Badge>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Required Integrations ({template.integrations.length})</h4>
                <div className="space-y-3">
                  {template.integrations.map((integration, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="p-2 bg-primary/10 rounded">
                        <Zap className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{integration.name}</p>
                        <p className="text-xs text-muted-foreground">{integration.description}</p>
                      </div>
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Integration Credentials */}
        <div className="mt-8">
          <Card className="border-2 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Integration Credentials
              </CardTitle>
              <CardDescription>Provide the required credentials for each integration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {template.integrations.map((integration, integrationIdx) => (
                <div key={integrationIdx} className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{integration.name}</h3>
                      <p className="text-sm text-muted-foreground">{integration.description}</p>
                    </div>
                  </div>

                  {integration.credentialInstructions && (
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">Setup Instructions:</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {integration.credentialInstructions}
                      </p>
                    </div>
                  )}

                  <div className="grid gap-4">
                    {integration.credentialFields.map((field, fieldIdx) => {
                      const fieldKey = `${integration.name}-${field.name}`
                      const isPassword = field.type === "password"
                      const showPassword = showPasswords[fieldKey]
                      const fieldValue = credentials[integration.name]?.[field.name] || ""
                      const inputType = isPassword && !showPassword ? "password" : field.type

                      return (
                        <div key={fieldIdx} className="space-y-2">
                          <Label htmlFor={fieldKey} className="text-sm font-medium">
                            {field.label}
                            {field.required && <span className="text-destructive ml-1">*</span>}
                          </Label>

                          <div className="relative">
                            <Input
                              id={fieldKey}
                              type={inputType}
                              value={fieldValue}
                              onChange={(e) => handleCredentialChange(integration.name, field.name, e.target.value)}
                              placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                              required={field.required}
                              className="bg-background pr-10"
                            />

                            {isPassword && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-muted"
                                onClick={() => togglePasswordVisibility(fieldKey)}
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            )}
                          </div>

                          {field.helpText && <p className="text-xs text-muted-foreground">{field.helpText}</p>}
                        </div>
                      )
                    })}
                  </div>

                  {integrationIdx < template.integrations.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Activation Button */}
        <div className="mt-8 text-center">
          <Button onClick={handleActivateWorkflow} disabled={submitting} size="lg" className="px-8">
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Activating Workflow...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Activate Workflow
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
