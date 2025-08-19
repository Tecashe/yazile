"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Filter,
  Sparkles,
  AlertTriangle,
  LayoutDashboard,
  Zap,
  CheckCircle,
  Settings,
  ExternalLink,
  Globe,
  Lock,
  ListChecks,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"

interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: string
  complexity: "Simple" | "Medium" | "Complex"
  isPublic: boolean
  integrations: Integration[]
}

interface Integration {
  id: string
  name: string
  description: string
  category: string
  pricing: string
  logoUrl?: string
  credentialFields: CredentialField[]
  credentialInstructions: string
  credentials?: Credential[]
}

interface CredentialField {
  name: string
  label: string
  type: string
  required: boolean
  placeholder?: string
  helpText?: string
}

interface Credential {
  id: string
  integrationName: string
  isActive: boolean
  createdAt: string
}

interface BusinessDetails {
  businessName: string
  businessType: string
  description: string
  website: string
  phone: string
  email: string
}

export default function WorkflowsPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails | null>(null)
  const [businessLoading, setBusinessLoading] = useState(true)

  const categories = [
    { value: "all", label: "All Templates" },
    { value: "AI_ASSISTANT", label: "AI Assistant" },
    { value: "SALES", label: "Sales" },
    { value: "MARKETING", label: "Marketing" },
    { value: "SUPPORT", label: "Support" },
    { value: "CUSTOM", label: "Custom" },
  ]

  useEffect(() => {
    const mockTemplates: WorkflowTemplate[] = [
      {
        id: "1",
        name: "Lead Qualification Assistant",
        description: "Automatically qualify and route leads based on custom criteria",
        category: "AI_ASSISTANT",
        complexity: "Medium",
        isPublic: true,
        integrations: [
          {
            id: "1",
            name: "HubSpot CRM",
            description: "Customer relationship management",
            category: "CRM",
            pricing: "Free",
            credentialFields: [
              {
                name: "apiKey",
                label: "API Key",
                type: "password",
                required: true,
                helpText: "Found in HubSpot settings",
              },
            ],
            credentialInstructions: "Go to HubSpot Settings > Integrations > API Key to generate your key",
          },
        ],
      },
      {
        id: "2",
        name: "Customer Support Automation",
        description: "Handle common support queries with AI-powered responses",
        category: "SUPPORT",
        complexity: "Simple",
        isPublic: true,
        integrations: [
          {
            id: "2",
            name: "Zendesk",
            description: "Customer support platform",
            category: "SUPPORT",
            pricing: "Paid",
            credentialFields: [
              { name: "subdomain", label: "Subdomain", type: "text", required: true },
              { name: "email", label: "Email", type: "email", required: true },
              { name: "token", label: "API Token", type: "password", required: true },
            ],
            credentialInstructions: "Generate API token in Zendesk Admin > Channels > API",
          },
        ],
      },
      {
        id: "3",
        name: "Sales Pipeline Optimizer",
        description: "Optimize your sales pipeline with automated follow-ups and lead scoring",
        category: "SALES",
        complexity: "Complex",
        isPublic: true,
        integrations: [
          {
            id: "3",
            name: "Salesforce",
            description: "Sales automation platform",
            category: "CRM",
            pricing: "Paid",
            credentialFields: [
              { name: "username", label: "Username", type: "text", required: true },
              { name: "password", label: "Password", type: "password", required: true },
              { name: "securityToken", label: "Security Token", type: "password", required: true },
            ],
            credentialInstructions:
              "Get security token from Salesforce Setup > My Personal Information > Reset Security Token",
          },
        ],
      },
    ]

    const mockBusinessDetails: BusinessDetails = {
      businessName: "Acme Corp",
      businessType: "Technology",
      description: "Software solutions provider",
      website: "https://acme.com",
      phone: "+1-555-0123",
      email: "contact@acme.com",
    }

    setTimeout(() => {
      setTemplates(mockTemplates)
      setBusinessDetails(mockBusinessDetails)
      setLoading(false)
      setBusinessLoading(false)
    }, 1000)
  }, [])

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "AI_ASSISTANT":
        return <Sparkles className="h-5 w-5 text-primary" />
      case "SALES":
        return <Zap className="h-5 w-5 text-green-500" />
      case "MARKETING":
        return <LayoutDashboard className="h-5 w-5 text-blue-500" />
      case "SUPPORT":
        return <Settings className="h-5 w-5 text-orange-500" />
      default:
        return <CheckCircle className="h-5 w-5 text-primary" />
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Simple":
        return "border-green-200 text-green-700 bg-green-50"
      case "Medium":
        return "border-yellow-200 text-yellow-700 bg-yellow-50"
      case "Complex":
        return "border-red-200 text-red-700 bg-red-50"
      default:
        return "border-gray-200 text-gray-700 bg-gray-50"
    }
  }

  const handleConfigureTemplate = (template: WorkflowTemplate) => {
    router.push(`/workflows/configure/${template.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading workflows...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Workflow Automation Hub
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover, configure, and deploy powerful automation workflows to streamline your business operations
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-end gap-4 mb-8">
          <Button variant="outline" onClick={() => router.push("/workflows/dashboard")}>
            <LayoutDashboard className="h-4 w-4 mr-2" />
            My Workflows
          </Button>
          <Button variant="outline" onClick={() => router.push("/workflows/requests")}>
            <ListChecks className="h-4 w-4 mr-2" />
            My Requests
          </Button>
        </div>

        {/* Business Details Check */}
        {!businessDetails && (
          <Alert className="mb-8 border-destructive/50 bg-destructive/5">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>
                <strong>Business Details Required:</strong> Complete your business profile to configure and activate
                workflows.
              </span>
              <Button variant="outline" size="sm" className="ml-4 bg-transparent">
                <ExternalLink className="h-4 w-4 mr-2" />
                Complete Business Profile
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search workflows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-input"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className="text-xs"
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <Card className="border-2 border-border/50">
            <CardContent className="p-12 text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-card-foreground mb-2">No Templates Found</h3>
              <p className="text-muted-foreground">
                {searchQuery || selectedCategory !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "No workflow templates are currently available."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-card-foreground">
                Available Templates ({filteredTemplates.length})
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Ready to configure</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="transition-all duration-300 border-2 border-border/50 hover:border-primary/50 hover:shadow-lg flex flex-col"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-primary/10">{getCategoryIcon(template.category)}</div>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-1">{template.name}</CardTitle>
                          <CardDescription className="text-sm">{template.category}</CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="outline" className={getComplexityColor(template.complexity)}>
                          {template.complexity}
                        </Badge>
                        {template.isPublic ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            <Globe className="h-3 w-3 mr-1" />
                            Public
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-orange-50 text-orange-700">
                            <Lock className="h-3 w-3 mr-1" />
                            Private
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-sm text-muted-foreground mb-4 flex-1">{template.description}</p>

                    {/* Integrations */}
                    {template.integrations && template.integrations.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-sm mb-2">Required Integrations:</h4>
                        <div className="flex flex-wrap gap-2">
                          {template.integrations.map((integration, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              <Zap className="h-3 w-3 mr-1" />
                              {integration.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 mt-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => handleConfigureTemplate(template)}
                        disabled={!businessDetails}
                      >
                        <Settings className="h-3 w-3 mr-1" />
                        Configure & Activate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
