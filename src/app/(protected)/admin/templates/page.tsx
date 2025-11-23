

"use client"

import React from "react"
import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Filter,
  Star,
  Award,
  Check,
  X,
  RefreshCw,
  Search,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  FileJson,
  Zap,
  Sparkles,
  Database,
  Settings,
} from "lucide-react"

// Types
type Template = {
  id: string
  name: string
  description: string
  category: string
  icon?: string
  featured: boolean
  popular: boolean
  complexity: "SIMPLE" | "MEDIUM" | "COMPLEX"
  estimatedSetupTime: number
  requiredIntegrations: string[]
  configurationSchema: any
  n8nTemplateId?: string
  visualRepresentation?: string
  expectedOutcomes: string[]
  useCases: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
  lastVerified?: string
  isVerified?: boolean
  _count?: {
    userWorkflows: number
  }
  userWorkflows?: string[]
}

type N8nTemplate = {
  id: string
  name: string
  description?: string
  nodes: any[]
  connections: any
  active: boolean
  createdAt: string
  updatedAt: string
}

type PaginationInfo = {
  total: number
  limit: number
  offset: number
}

type VerificationStatus = "idle" | "loading" | "success" | "error"

export default function TemplatesAdminPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // State
  const [templates, setTemplates] = useState<Template[]>([])
  const [n8nTemplates, setN8nTemplates] = useState<N8nTemplate[]>([])
  const [isLoadingN8nTemplates, setIsLoadingN8nTemplates] = useState(false)
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    limit: 10,
    offset: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL")
  const [showFeatured, setShowFeatured] = useState<boolean | undefined>(undefined)
  const [showPopular, setShowPopular] = useState<boolean | undefined>(undefined)
  const [selectedComplexity, setSelectedComplexity] = useState<string>("ALL")
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("idle")
  const [selectedN8nTemplate, setSelectedN8nTemplate] = useState<N8nTemplate | null>(null)
  const [templatePreview, setTemplatePreview] = useState<any>(null)
  const [isTemplatePreviewLoading, setIsTemplatePreviewLoading] = useState(false)

  // Add these new state variables after the existing ones
  const [isAutoGenerating, setIsAutoGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [autoSuggestions, setAutoSuggestions] = useState({
    category: "",
    complexity: "",
    estimatedTime: 0,
    integrations: [] as string[],
    outcomes: [] as string[],
    useCases: [] as string[],
  })

  // Template form state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isN8nBrowserOpen, setIsN8nBrowserOpen] = useState(false)
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null)
  const [activeTab, setActiveTab] = useState("basic")
  const [isTestingConfig, setIsTestingConfig] = useState(false)

  // Form data with proper initialization
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    icon: "",
    featured: false,
    popular: false,
    complexity: "MEDIUM" as "SIMPLE" | "MEDIUM" | "COMPLEX",
    estimatedSetupTime: 15,
    requiredIntegrations: [] as string[],
    configurationSchema: "{}",
    n8nTemplateId: "",
    visualRepresentation: "",
    expectedOutcomes: [] as string[],
    useCases: [] as string[],
    isActive: true,
  })

  // Categories
  const categories = [
    "MARKETING",
    "SALES",
    "CUSTOMER_SUPPORT",
    "DATA_PROCESSING",
    "DOCUMENT_MANAGEMENT",
    "SOCIAL_MEDIA",
    "COMMUNICATION",
    "INTEGRATION",
    "UTILITY",
    "CUSTOM",
  ]

  // Form validation
  const isFormValid = useMemo(() => {
    const requiredFields = [
      formData.name.trim(),
      formData.description.trim(),
      formData.category.trim(),
      formData.n8nTemplateId.trim(),
      formData.configurationSchema.trim(),
    ]

    // Check if all required fields are filled
    const allFieldsFilled = requiredFields.every((field) => field.length > 0)

    // Check if configuration schema is valid JSON
    let isValidJson = true
    try {
      JSON.parse(formData.configurationSchema)
    } catch {
      isValidJson = false
    }

    return allFieldsFilled && isValidJson
  }, [formData])

  // Fetch templates
  const fetchTemplates = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Build query params
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (selectedCategory && selectedCategory !== "ALL") params.append("category", selectedCategory)
      if (showFeatured !== undefined) params.append("featured", String(showFeatured))
      if (showPopular !== undefined) params.append("popular", String(showPopular))
      if (selectedComplexity && selectedComplexity !== "ALL") params.append("complexity", selectedComplexity)
      params.append("limit", String(pagination.limit))
      params.append("offset", String(pagination.offset))

      const response = await fetch(`/api/templates?${params.toString()}`)

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      setTemplates(Array.isArray(data.templates) ? data.templates : [])
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setTemplates([])
    } finally {
      setIsLoading(false)
    }
  }, [searchTerm, selectedCategory, showFeatured, showPopular, selectedComplexity, pagination.limit, pagination.offset])

  // Fetch n8n templates
  const fetchN8nTemplates = useCallback(async () => {
    setIsLoadingN8nTemplates(true)
    try {
      const response = await fetch("/api/n8n/templates")
      if (!response.ok) {
        throw new Error(`Error fetching n8n templates: ${response.statusText}`)
      }
      const data = await response.json()
      setN8nTemplates(Array.isArray(data.templates) ? data.templates : [])
    } catch (err) {
      setN8nTemplates([])
      toast({
        title: "Error fetching n8n templates",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoadingN8nTemplates(false)
    }
  }, [])

  // Fetch n8n template details
  const fetchN8nTemplateDetails = useCallback(async (templateId: string) => {
    setIsTemplatePreviewLoading(true)
    try {
      const response = await fetch(`/api/n8n/templates/${templateId}`)
      if (!response.ok) {
        throw new Error(`Error fetching template details: ${response.statusText}`)
      }
      const data = await response.json()
      setTemplatePreview(data)
      return data
    } catch (err) {
      toast({
        title: "Error fetching template details",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      })
      return null
    } finally {
      setIsTemplatePreviewLoading(false)
    }
  }, [])

  // Verify n8n template
  const verifyN8nTemplate = useCallback(async (templateId: string) => {
    setVerificationStatus("loading")
    try {
      const response = await fetch(`/api/n8n/templates/${templateId}/verify`)
      if (!response.ok) {
        throw new Error(`Template verification failed: ${response.statusText}`)
      }
      const data = await response.json()
      setVerificationStatus("success")
      toast({
        title: "Template verified",
        description: "The n8n template exists and is valid.",
        variant: "default",
      })
      return data
    } catch (err) {
      setVerificationStatus("error")
      toast({
        title: "Template verification failed",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      })
      return null
    }
  }, [])

  // Generate configuration schema from n8n template
  const generateSchemaFromTemplate = useCallback(async (templateId: string) => {
    try {
      const response = await fetch(`/api/n8n/templates/${templateId}/schema`)
      if (!response.ok) {
        throw new Error(`Failed to generate schema: ${response.statusText}`)
      }
      const data = await response.json()
      return data.schema
    } catch (err) {
      toast({
        title: "Error generating schema",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      })
      return null
    }
  }, [])

  // Test template configuration
  const testTemplateConfiguration = useCallback(async (templateId: string, configuration: any) => {
    try {
      const response = await fetch(`/api/n8n/templates/${templateId}/test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ configuration }),
      })

      if (!response.ok) {
        throw new Error(`Configuration test failed: ${response.statusText}`)
      }

      const data = await response.json()

      toast({
        title: "Configuration test successful",
        description: "The template configuration is valid and works with this n8n template.",
        variant: "default",
      })

      return data
    } catch (err) {
      toast({
        title: "Configuration test failed",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      })
      return null
    }
  }, [])

  // Auto-generate template data from n8n template
  const autoGenerateTemplateData = useCallback(
    async (n8nTemplate: N8nTemplate) => {
      setIsAutoGenerating(true)
      setGenerationProgress(0)

      try {
        // Step 1: Analyze template structure (20%)
        setGenerationProgress(20)
        const analysis = await analyzeN8nTemplate(n8nTemplate)

        // Step 2: Generate schema (40%)
        setGenerationProgress(40)
        const schema = await generateSchemaFromTemplate(n8nTemplate.id)

        // Step 3: Generate suggestions (60%)
        setGenerationProgress(60)
        const suggestions = await generateSmartSuggestions(analysis)

        // Step 4: Auto-fill form (80%)
        setGenerationProgress(80)
        setFormData((prev) => ({
          ...prev,
          name: prev.name || n8nTemplate.name,
          description: prev.description || n8nTemplate.description || generateDescription(analysis),
          category: suggestions.category,
          complexity: suggestions.complexity,
          estimatedSetupTime: suggestions.estimatedTime,
          requiredIntegrations: suggestions.integrations,
          configurationSchema: schema ? JSON.stringify(schema, null, 2) : prev.configurationSchema,
          expectedOutcomes: suggestions.outcomes,
          useCases: suggestions.useCases,
          n8nTemplateId: n8nTemplate.id,
        }))

        setAutoSuggestions(suggestions)
        setGenerationProgress(100)

        toast({
          title: "Auto-generation complete",
          description: "Template data has been automatically generated and populated.",
          variant: "default",
        })
      } catch (error) {
        toast({
          title: "Auto-generation failed",
          description: error instanceof Error ? error.message : "Failed to auto-generate template data",
          variant: "destructive",
        })
      } finally {
        setIsAutoGenerating(false)
        setTimeout(() => setGenerationProgress(0), 2000)
      }
    },
    [generateSchemaFromTemplate],
  )

  // Helper function to analyze n8n template
  const analyzeN8nTemplate = async (template: N8nTemplate) => {
    const nodes = template.nodes || []
    const integrations = new Set<string>()
    const nodeTypes = new Set<string>()

    nodes.forEach((node) => {
      if (node.type) {
        nodeTypes.add(node.type)
        const integration = extractIntegrationName(node.type)
        if (integration) integrations.add(integration)
      }
    })

    return {
      nodeCount: nodes.length,
      integrations: Array.from(integrations),
      nodeTypes: Array.from(nodeTypes),
      hasWebhooks: nodes.some((node) => node.type?.includes("webhook")),
      hasScheduler: nodes.some((node) => node.type?.includes("cron") || node.type?.includes("schedule")),
      hasConditionals: nodes.some((node) => node.type?.includes("if") || node.type?.includes("switch")),
      hasLoops: nodes.some((node) => node.type?.includes("loop")),
      hasTransformations: nodes.some((node) => node.type?.includes("function") || node.type?.includes("code")),
    }
  }

  // Helper function to extract integration name from node type
  const extractIntegrationName = (nodeType: string): string | null => {
    const integrationMap: Record<string, string> = {
      slack: "Slack",
      google: "Google Workspace",
      sheets: "Google Sheets",
      gmail: "Gmail",
      webhook: "Webhooks",
      http: "HTTP Request",
      airtable: "Airtable",
      notion: "Notion",
      hubspot: "HubSpot",
      salesforce: "Salesforce",
      zapier: "Zapier",
      discord: "Discord",
      telegram: "Telegram",
      twitter: "Twitter",
      linkedin: "LinkedIn",
      facebook: "Facebook",
      instagram: "Instagram",
      youtube: "YouTube",
      stripe: "Stripe",
      paypal: "PayPal",
      shopify: "Shopify",
      mailchimp: "Mailchimp",
      sendgrid: "SendGrid",
      twilio: "Twilio",
    }

    const lowerType = nodeType.toLowerCase()
    for (const [key, value] of Object.entries(integrationMap)) {
      if (lowerType.includes(key)) return value
    }
    return null
  }

  // Generate smart suggestions based on analysis
  const generateSmartSuggestions = async (analysis: any) => {
    let category = "UTILITY"
    if (analysis.integrations.some((i: string) => ["Slack", "Discord", "Telegram"].includes(i))) {
      category = "COMMUNICATION"
    } else if (analysis.integrations.some((i: string) => ["HubSpot", "Salesforce"].includes(i))) {
      category = "SALES"
    } else if (analysis.integrations.some((i: string) => ["Google Sheets", "Airtable", "Notion"].includes(i))) {
      category = "DATA_PROCESSING"
    } else if (
      analysis.integrations.some((i: string) => ["Twitter", "LinkedIn", "Facebook", "Instagram"].includes(i))
    ) {
      category = "SOCIAL_MEDIA"
    } else if (analysis.integrations.some((i: string) => ["Mailchimp", "SendGrid"].includes(i))) {
      category = "MARKETING"
    }

    let complexity: "SIMPLE" | "MEDIUM" | "COMPLEX" = "MEDIUM"
    if (analysis.nodeCount <= 3 && !analysis.hasConditionals && !analysis.hasLoops) {
      complexity = "SIMPLE"
    } else if (
      analysis.nodeCount > 10 ||
      (analysis.hasConditionals && analysis.hasLoops && analysis.hasTransformations)
    ) {
      complexity = "COMPLEX"
    }

    let estimatedTime = 15
    if (complexity === "SIMPLE") estimatedTime = 5
    else if (complexity === "COMPLEX") estimatedTime = 30
    estimatedTime += analysis.integrations.length * 2

    const outcomes = []
    if (analysis.hasScheduler) outcomes.push("Automated scheduling")
    if (analysis.hasWebhooks) outcomes.push("Real-time data processing")
    if (analysis.integrations.length > 1) outcomes.push("Cross-platform integration")
    if (analysis.hasTransformations) outcomes.push("Data transformation")
    if (outcomes.length === 0) outcomes.push("Streamlined workflow automation")

    const useCases = generateUseCases(category, analysis.integrations)

    return {
      category,
      complexity,
      estimatedTime,
      integrations: analysis.integrations,
      outcomes,
      useCases,
    }
  }

  // Generate description based on analysis
  const generateDescription = (analysis: any): string => {
    const parts = []

    if (analysis.nodeCount <= 3) {
      parts.push("A simple workflow that")
    } else if (analysis.nodeCount <= 7) {
      parts.push("A comprehensive workflow that")
    } else {
      parts.push("An advanced workflow that")
    }

    if (analysis.integrations.length > 0) {
      parts.push(`integrates with ${analysis.integrations.join(", ")}`)
    }

    if (analysis.hasScheduler) {
      parts.push("runs on a schedule")
    } else if (analysis.hasWebhooks) {
      parts.push("responds to real-time events")
    }

    if (analysis.hasTransformations) {
      parts.push("and transforms data")
    }

    parts.push("to automate your business processes.")

    return parts.join(" ").replace(/\s+/g, " ").trim()
  }

  // Generate use cases based on category and integrations
  const generateUseCases = (category: string, integrations: string[]): string[] => {
    const useCaseMap: Record<string, string[]> = {
      COMMUNICATION: ["Team notifications", "Customer support automation", "Internal alerts"],
      SALES: ["Lead management", "Deal tracking", "Sales reporting"],
      DATA_PROCESSING: ["Data synchronization", "Report generation", "Data backup"],
      SOCIAL_MEDIA: ["Content scheduling", "Social media monitoring", "Engagement tracking"],
      MARKETING: ["Email campaigns", "Lead nurturing", "Marketing analytics"],
      CUSTOMER_SUPPORT: ["Ticket management", "Customer feedback", "Support automation"],
      DOCUMENT_MANAGEMENT: ["Document processing", "File organization", "Content management"],
      INTEGRATION: ["System integration", "API orchestration", "Data migration"],
      UTILITY: ["Process automation", "Task scheduling", "System monitoring"],
    }

    const useCases = useCaseMap[category] || useCaseMap["UTILITY"]

    if (integrations.includes("Slack")) useCases.push("Slack automation")
    if (integrations.includes("Google Sheets")) useCases.push("Spreadsheet automation")
    if (integrations.includes("HubSpot")) useCases.push("CRM automation")

    return useCases.slice(0, 3)
  }

  // Fixed Template Form component with proper focus management
  const TemplateForm = React.memo(() => {
    // Use refs to track input values without causing re-renders
    const inputRefs = useRef<{ [key: string]: HTMLInputElement | HTMLTextAreaElement }>({})
    const debounceTimeouts = useRef<{ [key: string]: NodeJS.Timeout }>({})

    // Stable input change handler that doesn't cause re-renders
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target

      // Store ref to the input
      inputRefs.current[name] = e.target

      // Clear existing timeout
      if (debounceTimeouts.current[name]) {
        clearTimeout(debounceTimeouts.current[name])
      }

      // Debounce the state update to prevent focus loss
      debounceTimeouts.current[name] = setTimeout(() => {
        setFormData((prev) => ({ ...prev, [name]: value }))
      }, 500) // 500ms debounce
    }, [])

    // Fixed comma-separated input handler
    const handleCommaSeparatedChange = useCallback(
      (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value

        // Store ref to the input
        inputRefs.current[name] = e.target

        // Clear existing timeout
        if (debounceTimeouts.current[name]) {
          clearTimeout(debounceTimeouts.current[name])
        }

        // Debounce the array conversion and state update
        debounceTimeouts.current[name] = setTimeout(() => {
          const arrayValue = value
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item.length > 0)

          setFormData((prev) => ({ ...prev, [name]: arrayValue }))
        }, 500)
      },
      [],
    )

    // Handle select changes (no debounce needed)
    const handleSelectChange = useCallback((name: string, value: string) => {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }, [])

    // Handle checkbox changes (no debounce needed)
    const handleCheckboxChange = useCallback((name: string, checked: boolean) => {
      setFormData((prev) => ({ ...prev, [name]: checked }))
    }, [])

    // Handle n8n template verification
    const handleVerifyTemplate = useCallback(async () => {
      if (!formData.n8nTemplateId) {
        toast({
          title: "Verification failed",
          description: "Please enter an n8n template ID",
          variant: "destructive",
        })
        return
      }

      const result = await verifyN8nTemplate(formData.n8nTemplateId)
      if (result) {
        await fetchN8nTemplateDetails(formData.n8nTemplateId)
      }
    }, [formData.n8nTemplateId, verifyN8nTemplate, fetchN8nTemplateDetails])

    // Handle configuration schema generation
    const handleGenerateSchema = useCallback(async () => {
      if (!formData.n8nTemplateId) {
        toast({
          title: "Schema generation failed",
          description: "Please enter an n8n template ID",
          variant: "destructive",
        })
        return
      }

      const schema = await generateSchemaFromTemplate(formData.n8nTemplateId)
      if (schema) {
        setFormData((prev) => ({
          ...prev,
          configurationSchema: JSON.stringify(schema, null, 2),
        }))

        toast({
          title: "Schema generated",
          description: "Configuration schema has been generated from the n8n template",
          variant: "default",
        })
      }
    }, [formData.n8nTemplateId, generateSchemaFromTemplate])

    // Handle configuration testing
    const handleTestConfiguration = useCallback(async () => {
      if (!formData.n8nTemplateId) {
        toast({
          title: "Test failed",
          description: "Please enter an n8n template ID",
          variant: "destructive",
        })
        return
      }

      let configObject
      try {
        configObject = JSON.parse(formData.configurationSchema)
      } catch (err) {
        toast({
          title: "Invalid JSON",
          description: "The configuration schema is not valid JSON",
          variant: "destructive",
        })
        return
      }

      setIsTestingConfig(true)
      await testTemplateConfiguration(formData.n8nTemplateId, configObject)
      setIsTestingConfig(false)
    }, [formData.n8nTemplateId, formData.configurationSchema, testTemplateConfiguration])

    // Open n8n template browser
    const handleOpenN8nBrowser = useCallback(() => {
      fetchN8nTemplates()
      setIsN8nBrowserOpen(true)
    }, [fetchN8nTemplates])

    // Cleanup timeouts on unmount
    useEffect(() => {
      return () => {
        Object.values(debounceTimeouts.current).forEach((timeout) => {
          if (timeout) clearTimeout(timeout)
        })
      }
    }, [])

    return (
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="n8n" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              n8n Integration
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Advanced
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6 mt-6">
            <div className="grid gap-6">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right font-medium">
                  Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="Enter template name"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right font-medium pt-2">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={formData.description}
                  onChange={handleInputChange}
                  className="col-span-3 min-h-[100px]"
                  placeholder="Describe what this template does..."
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right font-medium">
                  Category *
                </Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((categoryItem) => (
                      <SelectItem key={categoryItem} value={categoryItem}>
                        {categoryItem.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="icon" className="text-right font-medium">
                  Icon
                </Label>
                <Input
                  id="icon"
                  name="icon"
                  defaultValue={formData.icon}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="Icon name or URL"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Options</Label>
                <div className="col-span-3 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => handleCheckboxChange("featured", checked as boolean)}
                    />
                    <Label htmlFor="featured" className="text-sm font-medium flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow" />
                      Mark as featured
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="popular"
                      checked={formData.popular}
                      onCheckedChange={(checked) => handleCheckboxChange("popular", checked as boolean)}
                    />
                    <Label htmlFor="popular" className="text-sm font-medium flex items-center gap-2">
                      <Award className="h-4 w-4 text-purple-500" />
                      Mark as popular
                    </Label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="complexity" className="text-right font-medium">
                  Complexity
                </Label>
                <Select value={formData.complexity} onValueChange={(value) => handleSelectChange("complexity", value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select complexity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SIMPLE">🟢 Simple</SelectItem>
                    <SelectItem value="MEDIUM">🟡 Medium</SelectItem>
                    <SelectItem value="COMPLEX">🔴 Complex</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="estimatedSetupTime" className="text-right font-medium">
                  Setup Time (min)
                </Label>
                <Input
                  id="estimatedSetupTime"
                  name="estimatedSetupTime"
                  type="number"
                  min="1"
                  defaultValue={formData.estimatedSetupTime}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="n8n" className="space-y-6 mt-6">
            <Alert className="border-blue-200 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">n8n Integration</AlertTitle>
              <AlertDescription className="text-blue-700">
                Connect this template to an n8n workflow. You can either enter a template ID manually or browse
                available templates.
              </AlertDescription>
            </Alert>

            {isAutoGenerating && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-blue-600">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span className="font-medium">Auto-generating template data...</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${generationProgress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Analyzing template structure and generating configuration schema
                </p>
              </div>
            )}

            {autoSuggestions.category && !isAutoGenerating && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Auto-generation Complete</AlertTitle>
                <AlertDescription className="text-green-700">
                  Template data has been automatically generated based on the n8n workflow analysis. You can review and
                  modify the suggestions before saving.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid gap-6">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="n8nTemplateId" className="text-right font-medium">
                  n8n Template ID *
                </Label>
                <div className="col-span-3 flex gap-2">
                  <Input
                    id="n8nTemplateId"
                    name="n8nTemplateId"
                    defaultValue={formData.n8nTemplateId}
                    onChange={handleInputChange}
                    className="flex-1"
                    placeholder="Enter n8n template ID"
                    required
                  />
                  <Button type="button" variant="outline" onClick={handleOpenN8nBrowser} className="whitespace-nowrap">
                    <Search className="mr-2 h-4 w-4" />
                    Browse
                  </Button>
                  {formData.n8nTemplateId && !isAutoGenerating && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => selectedN8nTemplate && autoGenerateTemplateData(selectedN8nTemplate)}
                      className="whitespace-nowrap bg-gradient-to-r from-green-50 to-blue-50 border-green-200 hover:from-green-100 hover:to-blue-100"
                    >
                      <Sparkles className="mr-2 h-4 w-4 text-green-600" />
                      Smart Setup
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right">
                  <Label className="font-medium">Template Status</Label>
                </div>
                <div className="col-span-3 flex items-center gap-4">
                  {verificationStatus === "idle" && (
                    <Button type="button" variant="outline" onClick={handleVerifyTemplate}>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Verify Template
                    </Button>
                  )}

                  {verificationStatus === "loading" && (
                    <Button type="button" variant="outline" disabled>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </Button>
                  )}

                  {verificationStatus === "success" && (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-md">
                      <Check className="h-5 w-5" />
                      <span className="font-medium">Template verified successfully</span>
                    </div>
                  )}

                  {verificationStatus === "error" && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-md">
                      <X className="h-5 w-5" />
                      <span className="font-medium">Template verification failed</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="configurationSchema" className="text-right font-medium pt-2">
                  Config Schema *
                </Label>
                <div className="col-span-3 space-y-3">
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateSchema}
                      disabled={!formData.n8nTemplateId || verificationStatus !== "success"}
                    >
                      <FileJson className="mr-2 h-4 w-4" />
                      Generate Schema
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleTestConfiguration}
                      disabled={!formData.n8nTemplateId || verificationStatus !== "success" || isTestingConfig}
                    >
                      {isTestingConfig ? (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Zap className="mr-2 h-4 w-4" />
                      )}
                      Test Configuration
                    </Button>
                  </div>
                  <Textarea
                    id="configurationSchema"
                    name="configurationSchema"
                    defaultValue={formData.configurationSchema}
                    onChange={handleInputChange}
                    className="font-mono text-sm min-h-[200px]"
                    placeholder="JSON Schema for configuration..."
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    JSON Schema that defines the configuration options for this template.
                  </p>
                </div>
              </div>

              {templatePreview && (
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-right">
                    <Label className="font-medium">Template Preview</Label>
                  </div>
                  <div className="col-span-3">
                    <Card className="border-2 border-dashed border-muted-foreground/25">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Database className="h-5 w-5 text-blue-600" />
                          {templatePreview.name}
                        </CardTitle>
                        {templatePreview.description && (
                          <CardDescription>{templatePreview.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium">Nodes:</span>
                            <Badge variant="secondary">{templatePreview.nodes?.length || 0}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Active:</span>
                            <Badge variant={templatePreview.active ? "default" : "secondary"}>
                              {templatePreview.active ? "Yes" : "No"}
                            </Badge>
                          </div>
                          <div className="flex justify-between col-span-2">
                            <span className="font-medium">Last Updated:</span>
                            <span>{new Date(templatePreview.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {templatePreview.nodes && templatePreview.nodes.length > 0 && (
                          <Accordion type="single" collapsible className="mt-4">
                            <AccordionItem value="nodes">
                              <AccordionTrigger>Workflow Nodes ({templatePreview.nodes.length})</AccordionTrigger>
                              <AccordionContent>
                                <div className="grid gap-2">
                                  {templatePreview.nodes.map((node: any, index: number) => (
                                    <div key={node.id || index} className="rounded border p-3 text-sm bg-muted/30">
                                      <div className="font-medium">{node.name}</div>
                                      <div className="text-xs text-muted-foreground">{node.type}</div>
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() =>
                            window.open(`${process.env.NEXT_PUBLIC_N8N_URL}/workflow/${templatePreview.id}`, "_blank")
                          }
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View in n8n
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6 mt-6">
            <div className="grid gap-6">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="requiredIntegrations" className="text-right font-medium">
                  Required Integrations
                </Label>
                <Input
                  id="requiredIntegrations"
                  defaultValue={formData.requiredIntegrations.join(", ")}
                  onChange={handleCommaSeparatedChange("requiredIntegrations")}
                  className="col-span-3"
                  placeholder="e.g., Slack, Google Sheets, Webhook"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="visualRepresentation" className="text-right font-medium">
                  Visual Representation
                </Label>
                <Input
                  id="visualRepresentation"
                  name="visualRepresentation"
                  defaultValue={formData.visualRepresentation}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="URL to image or diagram"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expectedOutcomes" className="text-right font-medium">
                  Expected Outcomes
                </Label>
                <Input
                  id="expectedOutcomes"
                  defaultValue={formData.expectedOutcomes.join(", ")}
                  onChange={handleCommaSeparatedChange("expectedOutcomes")}
                  className="col-span-3"
                  placeholder="e.g., Automated reports, Data sync, Notifications"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="useCases" className="text-right font-medium">
                  Use Cases
                </Label>
                <Input
                  id="useCases"
                  defaultValue={formData.useCases.join(", ")}
                  onChange={handleCommaSeparatedChange("useCases")}
                  className="col-span-3"
                  placeholder="e.g., Lead management, Customer onboarding, Data backup"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Status</Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleCheckboxChange("isActive", checked as boolean)}
                  />
                  <Label htmlFor="isActive" className="text-sm font-medium">
                    Template is active and available for use
                  </Label>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    )
  })
  TemplateForm.displayName = "TemplateForm"

  // N8n Template Browser component with fixed filter
  const N8nTemplateBrowser = React.memo(() => {
    const [searchN8n, setSearchN8n] = useState("")

    const filteredTemplates = useMemo(() => {
      if (!Array.isArray(n8nTemplates)) return []

      return n8nTemplates.filter(
        (template) =>
          template.name.toLowerCase().includes(searchN8n.toLowerCase()) ||
          (template.description && template.description.toLowerCase().includes(searchN8n.toLowerCase())),
      )
    }, [searchN8n, n8nTemplates])

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchN8n}
            onChange={(e) => setSearchN8n(e.target.value)}
            className="flex-1"
          />
        </div>

        {isLoadingN8nTemplates ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-3 border rounded-lg">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-3 w-[200px]" />
                </div>
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No templates found</p>
            <p className="text-sm">Try a different search term or check your n8n connection.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="flex justify-between items-center p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleSelectN8nTemplate(template)}
              >
                <div className="flex-1">
                  <h4 className="font-medium flex items-center gap-2">
                    <Database className="h-4 w-4 text-blue-600" />
                    {template.name}
                  </h4>
                  {template.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{template.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {template.nodes?.length || 0} nodes
                    </Badge>
                    <Badge variant={template.active ? "default" : "secondary"} className="text-xs">
                      {template.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="ml-4">
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Select</span>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  })
  N8nTemplateBrowser.displayName = "N8nTemplateBrowser"

  // Create template
  const handleCreateTemplate = useCallback(async () => {
    if (!isFormValid) {
      toast({
        title: "Form validation failed",
        description: "Please fill in all required fields with valid data.",
        variant: "destructive",
      })
      return
    }

    try {
      let configData = { ...formData }

      try {
        if (typeof configData.configurationSchema === "string") {
          const parsedConfig = JSON.parse(configData.configurationSchema)
          configData = {
            ...configData,
            configurationSchema: parsedConfig,
          }
        }
      } catch (jsonError) {
        setError("Configuration Schema must be valid JSON")
        return
      }

      const response = await fetch("/api/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(configData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create template")
      }

      // Reset form and close dialog
      setFormData({
        name: "",
        description: "",
        category: "",
        icon: "",
        featured: false,
        popular: false,
        complexity: "MEDIUM",
        estimatedSetupTime: 15,
        requiredIntegrations: [],
        configurationSchema: "{}",
        n8nTemplateId: "",
        visualRepresentation: "",
        expectedOutcomes: [],
        useCases: [],
        isActive: true,
      })
      setIsCreateDialogOpen(false)
      setActiveTab("basic")
      setVerificationStatus("idle")
      setTemplatePreview(null)

      fetchTemplates()

      toast({
        title: "Success",
        description: "Template created successfully",
      })
    } catch (err) {
      console.error("Error creating template:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }, [formData, isFormValid, fetchTemplates])

  const handleUpdateTemplate = useCallback(async () => {
    if (!currentTemplate || !isFormValid) {
      toast({
        title: "Form validation failed",
        description: "Please fill in all required fields with valid data.",
        variant: "destructive",
      })
      return
    }

    try {
      let configData = { ...formData }

      try {
        if (typeof configData.configurationSchema === "string") {
          const parsedConfig = JSON.parse(configData.configurationSchema)
          configData = {
            ...configData,
            configurationSchema: parsedConfig,
          }
        }
      } catch (jsonError) {
        setError("Configuration Schema must be valid JSON")
        return
      }

      const response = await fetch(`/api/templates/${currentTemplate.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(configData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update template")
      }

      setCurrentTemplate(null)
      setIsEditDialogOpen(false)
      setActiveTab("basic")
      setVerificationStatus("idle")
      setTemplatePreview(null)

      fetchTemplates()

      toast({
        title: "Success",
        description: "Template updated successfully",
      })
    } catch (err) {
      console.error("Error updating template:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }, [currentTemplate, formData, isFormValid, fetchTemplates])

  // Delete template
  const handleDeleteTemplate = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/templates/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to delete template")
        }

        fetchTemplates()

        toast({
          title: "Success",
          description: "Template deleted successfully",
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      }
    },
    [fetchTemplates],
  )

  // Verify all templates
  const verifyAllTemplates = useCallback(async () => {
    toast({
      title: "Verification started",
      description: "Verifying all templates with n8n. This may take a while.",
    })

    let successCount = 0
    let failCount = 0

    for (const template of templates) {
      if (template.n8nTemplateId) {
        try {
          await verifyN8nTemplate(template.n8nTemplateId)
          successCount++
        } catch (err) {
          failCount++
        }
      }
    }

    toast({
      title: "Verification complete",
      description: `${successCount} templates verified successfully. ${failCount} templates failed verification.`,
    })

    fetchTemplates()
  }, [templates, verifyN8nTemplate, fetchTemplates])

  const openEditDialog = useCallback(
    (template: Template) => {
      setCurrentTemplate(template)
      setFormData({
        name: template.name,
        description: template.description,
        category: template.category,
        icon: template.icon || "",
        featured: template.featured,
        popular: template.popular,
        complexity: template.complexity,
        estimatedSetupTime: template.estimatedSetupTime,
        requiredIntegrations: template.requiredIntegrations,
        configurationSchema: JSON.stringify(template.configurationSchema, null, 2),
        n8nTemplateId: template.n8nTemplateId || "",
        visualRepresentation: template.visualRepresentation || "",
        expectedOutcomes: template.expectedOutcomes,
        useCases: template.useCases,
        isActive: template.isActive,
      })
      setIsEditDialogOpen(true)
      setActiveTab("basic")
      setVerificationStatus(template.isVerified ? "success" : "idle")

      if (template.n8nTemplateId) {
        fetchN8nTemplateDetails(template.n8nTemplateId)
      } else {
        setTemplatePreview(null)
      }
    },
    [fetchN8nTemplateDetails],
  )

  // Initial fetch
  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  // Apply filters
  const applyFilters = useCallback(() => {
    setPagination((prev) => ({ ...prev, offset: 0 }))
  }, [])

  // Reset filters
  const resetFilters = useCallback(() => {
    setSearchTerm("")
    setSelectedCategory("ALL")
    setShowFeatured(undefined)
    setShowPopular(undefined)
    setSelectedComplexity("ALL")
    setPagination((prev) => ({ ...prev, offset: 0 }))
  }, [])

  // Handle pagination
  const handlePreviousPage = useCallback(() => {
    if (pagination.offset - pagination.limit >= 0) {
      setPagination((prev) => ({ ...prev, offset: prev.offset - prev.limit }))
    }
  }, [pagination.offset, pagination.limit])

  const handleNextPage = useCallback(() => {
    if (pagination.offset + pagination.limit < pagination.total) {
      setPagination((prev) => ({ ...prev, offset: prev.offset + prev.limit }))
    }
  }, [pagination.offset, pagination.limit, pagination.total])

  // Handle n8n template selection with auto-generation
  const handleSelectN8nTemplate = useCallback(
    async (template: N8nTemplate) => {
      setSelectedN8nTemplate(template)
      setIsN8nBrowserOpen(false)

      await autoGenerateTemplateData(template)
      await fetchN8nTemplateDetails(template.id)
    },
    [autoGenerateTemplateData, fetchN8nTemplateDetails],
  )

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Workflow Templates
          </h1>
          <p className="text-muted-foreground mt-2">Manage and configure your n8n workflow templates</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={verifyAllTemplates} className="shadow-sm">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Verify All Templates
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="mr-2 h-4 w-4" /> Add Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">Create New Template</DialogTitle>
                <DialogDescription>Fill in the details to create a new workflow template.</DialogDescription>
              </DialogHeader>
              <TemplateForm />
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateTemplate}
                  disabled={!isFormValid}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Create Template
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="border-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <CardDescription>Filter templates by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search" className="text-sm font-medium">
                Search
              </Label>
              <div className="flex mt-1">
                <Input
                  id="search"
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category" className="text-sm font-medium">
                Category
              </Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="complexity" className="text-sm font-medium">
                Complexity
              </Label>
              <Select value={selectedComplexity} onValueChange={setSelectedComplexity}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Any complexity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Any complexity</SelectItem>
                  <SelectItem value="SIMPLE">🟢 Simple</SelectItem>
                  <SelectItem value="MEDIUM">🟡 Medium</SelectItem>
                  <SelectItem value="COMPLEX">🔴 Complex</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col">
              <Label className="mb-1 text-sm font-medium">Flags</Label>
              <div className="flex space-x-4 mt-1">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured-filter"
                    checked={showFeatured === true}
                    onCheckedChange={(checked) => {
                      if (checked === true) setShowFeatured(true)
                      else if (showFeatured === true) setShowFeatured(undefined)
                      else setShowFeatured(true)
                    }}
                  />
                  <label htmlFor="featured-filter" className="text-sm">
                    Featured
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="popular-filter"
                    checked={showPopular === true}
                    onCheckedChange={(checked) => {
                      if (checked === true) setShowPopular(true)
                      else if (showPopular === true) setShowPopular(undefined)
                      else setShowPopular(true)
                    }}
                  />
                  <label htmlFor="popular-filter" className="text-sm">
                    Popular
                  </label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={resetFilters}>
            Reset Filters
          </Button>
          <Button
            onClick={applyFilters}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Filter className="mr-2 h-4 w-4" /> Apply Filters
          </Button>
        </CardFooter>
      </Card>

      {/* Templates Table */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Complexity</TableHead>
                <TableHead className="font-semibold">n8n Status</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Usage</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                      <p className="text-muted-foreground">Loading templates...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : templates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <Database className="h-12 w-12 text-muted-foreground opacity-50" />
                      <p className="text-lg font-medium text-muted-foreground">No templates found</p>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your filters or create a new template.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                templates.map((template) => (
                  <TableRow key={template.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                          {template.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{template.name}</div>
                          <div className="flex mt-1 space-x-1">
                            {template.featured && (
                              <Badge
                                variant="outline"
                                className="text-xs border-yellow-300 text-yellow-700 bg-yellow-50"
                              >
                                <Star className="h-3 w-3 mr-1 text-yellow" />
                                Featured
                              </Badge>
                            )}
                            {template.popular && (
                              <Badge
                                variant="outline"
                                className="text-xs border-purple-300 text-purple-700 bg-purple-50"
                              >
                                <Award className="h-3 w-3 mr-1 text-purple-500" />
                                Popular
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-medium">
                        {template.category.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          template.complexity === "SIMPLE"
                            ? "secondary"
                            : template.complexity === "MEDIUM"
                              ? "default"
                              : "destructive"
                        }
                        className="font-medium"
                      >
                        {template.complexity === "SIMPLE" && "🟢"}
                        {template.complexity === "MEDIUM" && "🟡"}
                        {template.complexity === "COMPLEX" && "🔴"}
                        {" " + template.complexity.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {template.n8nTemplateId ? (
                        template.isVerified ? (
                          <Badge
                            variant="default"
                            className="flex items-center gap-1 bg-green-100 text-green-800 border-green-300"
                          >
                            <Check className="h-3 w-3" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1 border-orange-300 text-orange-700 bg-orange-50"
                          >
                            <AlertCircle className="h-3 w-3" />
                            Unverified
                          </Badge>
                        )
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground border-muted">
                          No n8n ID
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={template.isActive ? "default" : "outline"}
                        className={template.isActive ? "bg-green-100 text-green-800 border-green-300" : ""}
                      >
                        {template.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="font-mono">
                          {template._count?.userWorkflows || 0}
                        </Badge>
                        <span className="text-sm text-muted-foreground">instances</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(template)}
                          className="hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="hover:bg-red-50">
                              <Trash2 className="h-4 w-4 text-red" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                {template._count && template._count.userWorkflows > 0 ? (
                                  <>
                                    This template is currently in use by {template._count.userWorkflows} workflows. It
                                    will be marked as inactive instead of being deleted.
                                  </>
                                ) : (
                                  "This action cannot be undone. This will permanently delete the template."
                                )}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteTemplate(template.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {template._count && template._count.userWorkflows > 0 ? "Deactivate" : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t p-4 bg-muted/20">
          <div className="text-sm text-muted-foreground">
            Showing {pagination.offset + 1}-{Math.min(pagination.offset + templates.length, pagination.total)} of{" "}
            {pagination.total} templates
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={pagination.offset === 0}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous Page</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={pagination.offset + pagination.limit >= pagination.total}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next Page</span>
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit Template</DialogTitle>
            <DialogDescription>Update the details of this workflow template.</DialogDescription>
          </DialogHeader>
          <TemplateForm />
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateTemplate}
              disabled={!isFormValid}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Update Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* n8n Template Browser Dialog */}
      <Dialog open={isN8nBrowserOpen} onOpenChange={setIsN8nBrowserOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Database className="h-6 w-6 text-blue-600" />
              Browse n8n Templates
            </DialogTitle>
            <DialogDescription>
              Select a template from your n8n instance to integrate with this workflow template.
            </DialogDescription>
          </DialogHeader>
          <N8nTemplateBrowser />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsN8nBrowserOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
