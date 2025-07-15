"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Clock, DollarSign, MessageSquare, Users, Zap, CheckCircle, ArrowLeft, Sparkles } from "lucide-react"

interface WorkflowType {
  id: string
  name: string
  category: string
  description: string
  icon: React.ReactNode
  features: string[]
  integrations: string[]
  complexity: "Simple" | "Medium" | "Complex"
  estimatedSetupTime: number
  operations: string[]
  commonUseCase: string
  borderClass: string
}

const workflowTypes: WorkflowType[] = [
  {
    id: "appointment-based",
    name: "Appointment-Based Services",
    category: "GROUP_1",
    description:
      "Perfect for healthcare, personal services, professional services, and fitness businesses that need booking management.",
    icon: <Calendar className="h-6 w-6" />,
    features: [
      "Calendar integration",
      "Availability checking",
      "Automatic reminders",
      "Rescheduling handling",
      "No-show management",
      "Follow-up sequences",
    ],
    integrations: ["Google Calendar", "Calendly", "Acuity", "Stripe", "Zoom", "SMS"],
    complexity: "Medium",
    estimatedSetupTime: 25,
    operations: ["Booking", "Confirmation", "Reminders", "Follow-up"],
    commonUseCase: "Healthcare providers, salons, consultants, personal trainers",
    borderClass: "card-border-marketing",
  },
  {
    id: "quote-based",
    name: "Quote-Based Services",
    category: "GROUP_2",
    description: "Ideal for contractors, photographers, event planners, and service providers who need custom quotes.",
    icon: <DollarSign className="h-6 w-6" />,
    features: [
      "Photo/detail collection",
      "Scope clarification",
      "Pricing tier management",
      "Project timeline tracking",
      "Quote generation",
      "Negotiation handling",
    ],
    integrations: ["Google Drive", "Dropbox", "QuickBooks", "Stripe", "DocuSign", "Slack"],
    complexity: "Complex",
    estimatedSetupTime: 35,
    operations: ["Inquiry", "Requirements gathering", "Quote", "Negotiation", "Booking"],
    commonUseCase: "Contractors, photographers, event planners, auto services",
    borderClass: "card-border-sales",
  },
  {
    id: "product-sales-high-touch",
    name: "Product Sales (High-Touch)",
    category: "GROUP_3",
    description:
      "For real estate, car dealerships, luxury goods, and custom manufacturing with complex sales processes.",
    icon: <Users className="h-6 w-6" />,
    features: [
      "Inventory checking",
      "Specification gathering",
      "Financing options",
      "Delivery scheduling",
      "Lead qualification",
      "CRM integration",
    ],
    integrations: ["Salesforce", "HubSpot", "Stripe", "PayPal", "Shopify", "Inventory APIs"],
    complexity: "Complex",
    estimatedSetupTime: 40,
    operations: ["Inquiry", "Product matching", "Pricing", "Purchase", "Delivery coordination"],
    commonUseCase: "Real estate agents, car dealerships, jewelry stores, custom manufacturers",
    borderClass: "card-border-customer-support",
  },
  {
    id: "course-program-sales",
    name: "Course/Program Sales",
    category: "GROUP_4",
    description: "Perfect for coaches, course creators, and educational services with enrollment processes.",
    icon: <MessageSquare className="h-6 w-6" />,
    features: [
      "Lead qualification",
      "Payment processing",
      "Access provisioning",
      "Community integration",
      "Progress tracking",
      "Upsell sequences",
    ],
    integrations: ["Teachable", "Thinkific", "Discord", "Slack", "Stripe", "Zoom"],
    complexity: "Medium",
    estimatedSetupTime: 30,
    operations: ["Interest", "Qualification", "Enrollment", "Onboarding"],
    commonUseCase: "Coaches, online course creators, fitness programs, educational services",
    borderClass: "card-border-data-processing",
  },
  {
    id: "quick-transaction",
    name: "Quick Transaction Services",
    category: "GROUP_5",
    description: "For restaurants, retail, and simple booking services that need immediate transactions.",
    icon: <Zap className="h-6 w-6" />,
    features: [
      "Menu/catalog display",
      "Quick payment processing",
      "Order tracking",
      "Instant confirmations",
      "Simple booking",
      "Status updates",
    ],
    integrations: ["Square", "Stripe", "PayPal", "DoorDash", "Uber Eats", "SMS"],
    complexity: "Simple",
    estimatedSetupTime: 15,
    operations: ["Inquiry", "Immediate booking/purchase", "Confirmation"],
    commonUseCase: "Restaurants, retail stores, car washes, quick repair services",
    borderClass: "card-border-social",
  },
]

interface IntegrationConfig {
  name: string
  apiKey?: string
  apiSecret?: string
  webhookUrl?: string
  additionalSettings?: Record<string, string>
}

export default function WorkflowSelector() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowType | null>(null)
  const [step, setStep] = useState<"selection" | "configuration" | "integrations" | "review">("selection")
  const [businessInfo, setBusinessInfo] = useState({
    businessName: "",
    businessType: "",
    description: "",
    website: "",
    phone: "",
    email: "",
  })
  const [integrationConfigs, setIntegrationConfigs] = useState<Record<string, IntegrationConfig>>({})
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])

  const handleWorkflowSelect = (workflow: WorkflowType) => {
    setSelectedWorkflow(workflow)
    setStep("configuration")
  }

  const handleBusinessInfoSubmit = () => {
    setStep("integrations")
  }

  const handleIntegrationToggle = (integration: string) => {
    setSelectedIntegrations((prev) =>
      prev.includes(integration) ? prev.filter((i) => i !== integration) : [...prev, integration],
    )
  }

  const handleIntegrationConfig = (integration: string, config: Partial<IntegrationConfig>) => {
    setIntegrationConfigs((prev) => ({
      ...prev,
      [integration]: { ...prev[integration], name: integration, ...config },
    }))
  }

  const handleFinalSubmit = async () => {
    // Here you would submit to your API
    const workflowData = {
      workflowType: selectedWorkflow,
      businessInfo,
      integrations: selectedIntegrations.map((name) => ({
        name,
        config: integrationConfigs[name] || { name },
      })),
    }

    console.log("Submitting workflow configuration:", workflowData)
    // API call would go here
  }

  if (step === "selection") {
    return (
      <div className="min-h-screen bg-background">
        <div className="radial--gradient--automations">
          <div className="max-w-7xl mx-auto p-6">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Sparkles className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Choose Your Business Workflow
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Select the workflow type that best matches your business model for automated social media responses
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 staggeredFadeIn">
              {workflowTypes.map((workflow, index) => (
                <Card
                  key={workflow.id}
                  className={`cursor-pointer transition-all duration-300 border-2 glassEffect ${workflow.borderClass} staggered-entrance hover:scale-105`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleWorkflowSelect(workflow)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-xl bg-primary/10 template-icon-container">{workflow.icon}</div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{workflow.name}</CardTitle>
                        <div className="flex gap-2 flex-wrap">
                          <Badge
                            variant={
                              workflow.complexity === "Simple"
                                ? "default"
                                : workflow.complexity === "Medium"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="text-xs"
                          >
                            {workflow.complexity}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {workflow.estimatedSetupTime}min
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-sm leading-relaxed">{workflow.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-sm mb-3 text-primary">Process Flow:</h4>
                      <div className="space-y-2">
                        {workflow.operations.map((operation, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                              {idx + 1}
                            </div>
                            <span className="text-sm text-muted-foreground">{operation}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-3 text-primary">Key Features:</h4>
                      <ul className="space-y-2">
                        {workflow.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                        {workflow.features.length > 3 && (
                          <li className="text-xs text-muted-foreground ml-6">
                            +{workflow.features.length - 3} more features
                          </li>
                        )}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-3 text-primary">Perfect For:</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{workflow.commonUseCase}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === "configuration" && selectedWorkflow) {
    return (
      <div className="min-h-screen bg-background">
        <div className="radial--gradient--automations">
          <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
              <Button variant="ghost" onClick={() => setStep("selection")} className="mb-6 hover:bg-accent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Selection
              </Button>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Configure Your {selectedWorkflow.name} Workflow
                </h1>
                <p className="text-muted-foreground text-lg">
                  Provide your business information to customize the workflow
                </p>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <Card className="glassEffect border-2 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Business Information
                  </CardTitle>
                  <CardDescription>
                    This information will be used to personalize your automated responses
                  </CardDescription>
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
                      placeholder="Your Business Name"
                      className="bg-background/50 border-border/50 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessType" className="text-sm font-medium">
                      Business Type *
                    </Label>
                    <Input
                      id="businessType"
                      value={businessInfo.businessType}
                      onChange={(e) => setBusinessInfo((prev) => ({ ...prev, businessType: e.target.value }))}
                      placeholder="e.g., Hair Salon, Photography Studio"
                      className="bg-background/50 border-border/50 focus:border-primary"
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
                      placeholder="Brief description of your services..."
                      rows={3}
                      className="bg-background/50 border-border/50 focus:border-primary resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-sm font-medium">
                        Website
                      </Label>
                      <Input
                        id="website"
                        value={businessInfo.website}
                        onChange={(e) => setBusinessInfo((prev) => ({ ...prev, website: e.target.value }))}
                        placeholder="https://yourwebsite.com"
                        className="bg-background/50 border-border/50 focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={businessInfo.phone}
                        onChange={(e) => setBusinessInfo((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="+1 (555) 123-4567"
                        className="bg-background/50 border-border/50 focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={businessInfo.email}
                      onChange={(e) => setBusinessInfo((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="contact@yourbusiness.com"
                      className="bg-background/50 border-border/50 focus:border-primary"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className={`glassEffect border-2 ${selectedWorkflow.borderClass}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {selectedWorkflow.icon}
                    Workflow Overview
                  </CardTitle>
                  <CardDescription>Here's what your {selectedWorkflow.name} workflow will include</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div>
                      <h4 className="font-semibold mb-4 text-primary flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Process Flow:
                      </h4>
                      <div className="space-y-3">
                        {selectedWorkflow.operations.map((operation, idx) => (
                          <div key={idx} className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-semibold">
                              {idx + 1}
                            </div>
                            <span className="text-sm font-medium">{operation}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-4 text-primary">Key Features:</h4>
                      <ul className="space-y-3">
                        {selectedWorkflow.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-4 text-primary">Available Integrations:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedWorkflow.integrations.map((integration, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {integration}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-10 flex justify-end">
              <Button
                onClick={handleBusinessInfoSubmit}
                disabled={!businessInfo.businessName || !businessInfo.businessType}
                size="lg"
                className="px-8 py-3 text-base font-semibold"
              >
                Continue to Integrations
                <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === "integrations" && selectedWorkflow) {
    return (
      <div className="min-h-screen bg-background">
        <div className="radial--gradient--automations">
          <div className="max-w-5xl mx-auto p-6">
            <div className="mb-8">
              <Button variant="ghost" onClick={() => setStep("configuration")} className="mb-6 hover:bg-accent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Configuration
              </Button>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Setup Integrations
                </h1>
                <p className="text-muted-foreground text-lg">
                  Configure the integrations needed for your {selectedWorkflow.name} workflow
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {selectedWorkflow.integrations.map((integration, index) => (
                <Card
                  key={integration}
                  className={`glassEffect border-2 transition-all duration-300 ${
                    selectedIntegrations.includes(integration) ? "border-primary/50 glow" : "border-border/50"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Zap className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{integration}</CardTitle>
                          <CardDescription>Configure your {integration} integration</CardDescription>
                        </div>
                      </div>
                      <Checkbox
                        checked={selectedIntegrations.includes(integration)}
                        onCheckedChange={() => handleIntegrationToggle(integration)}
                        className="scale-125"
                      />
                    </div>
                  </CardHeader>

                  {selectedIntegrations.includes(integration) && (
                    <CardContent className="space-y-4 border-t border-border/20 pt-6">
                      <div className="space-y-2">
                        <Label htmlFor={`${integration}-api-key`} className="text-sm font-medium">
                          API Key
                        </Label>
                        <Input
                          id={`${integration}-api-key`}
                          type="password"
                          placeholder="Enter your API key"
                          onChange={(e) => handleIntegrationConfig(integration, { apiKey: e.target.value })}
                          className="bg-background/50 border-border/50 focus:border-primary"
                        />
                      </div>

                      {["Stripe", "PayPal", "Salesforce"].includes(integration) && (
                        <div className="space-y-2">
                          <Label htmlFor={`${integration}-api-secret`} className="text-sm font-medium">
                            API Secret
                          </Label>
                          <Input
                            id={`${integration}-api-secret`}
                            type="password"
                            placeholder="Enter your API secret"
                            onChange={(e) => handleIntegrationConfig(integration, { apiSecret: e.target.value })}
                            className="bg-background/50 border-border/50 focus:border-primary"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor={`${integration}-webhook`} className="text-sm font-medium">
                          Webhook URL (Optional)
                        </Label>
                        <Input
                          id={`${integration}-webhook`}
                          placeholder="https://your-webhook-url.com"
                          onChange={(e) => handleIntegrationConfig(integration, { webhookUrl: e.target.value })}
                          className="bg-background/50 border-border/50 focus:border-primary"
                        />
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>

            <div className="mt-10 flex justify-between">
              <Button variant="outline" onClick={() => setStep("configuration")} size="lg">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button onClick={() => setStep("review")} size="lg" className="px-8">
                Review Configuration
                <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === "review" && selectedWorkflow) {
    return (
      <div className="min-h-screen bg-background">
        <div className="radial--gradient--automations">
          <div className="max-w-5xl mx-auto p-6">
            <div className="mb-8">
              <Button variant="ghost" onClick={() => setStep("integrations")} className="mb-6 hover:bg-accent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Integrations
              </Button>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Review & Deploy
                </h1>
                <p className="text-muted-foreground text-lg">
                  Review your configuration before deploying your workflow
                </p>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2 mb-10">
              <Card className="glassEffect border-2 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Workflow Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-primary">Selected Workflow:</Label>
                    <p className="text-sm bg-accent/50 p-3 rounded-lg">{selectedWorkflow.name}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-primary">Business Name:</Label>
                    <p className="text-sm bg-accent/50 p-3 rounded-lg">{businessInfo.businessName}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-primary">Business Type:</Label>
                    <p className="text-sm bg-accent/50 p-3 rounded-lg">{businessInfo.businessType}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-primary">Estimated Setup Time:</Label>
                    <p className="text-sm bg-accent/50 p-3 rounded-lg flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {selectedWorkflow.estimatedSetupTime} minutes
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="glassEffect border-2 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Configured Integrations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedIntegrations.length > 0 ? (
                    <div className="space-y-3">
                      {selectedIntegrations.map((integration) => (
                        <div key={integration} className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium">{integration}</span>
                          <Badge variant="outline" className="ml-auto text-xs">
                            Configured
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">No integrations configured</p>
                      <p className="text-xs text-muted-foreground mt-1">You can add integrations later</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="glassEffect border-2 border-primary/30 mb-10">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-primary">
                  <Sparkles className="h-5 w-5" />
                  What happens next?
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    Your Voiceflow workflow will be automatically configured
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    Integration connections will be tested and verified
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    Your automation will be activated for social media DMs
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    You&apos;ll receive a confirmation email with setup details
                  </li>
                </ul>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep("integrations")} size="lg">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleFinalSubmit}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-8 py-3 text-base font-semibold glow"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Deploy Workflow 🚀
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
