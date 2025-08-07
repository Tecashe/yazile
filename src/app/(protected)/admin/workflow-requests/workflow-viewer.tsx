"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Instagram, Brain, Zap, Star, Clock, TrendingUp, Users, ChevronDown, ChevronRight, Database, FileSpreadsheet, Mail, FileText, PlayCircle, Filter, MessageCircle, Shield, Bot, GitBranch, Bell, Settings, Layers, Activity, Target, Workflow, CheckCircle, Eye, Download, Share2, Code, Lightbulb } from 'lucide-react'

const stepTypeConfigs = {
  trigger: {
    icon: PlayCircle,
    color: "text-emerald-600",
    bgColor: "from-emerald-50 to-green-100",
    borderColor: "border-emerald-300",
    accentColor: "bg-emerald-500",
  },
  analysis: {
    icon: Brain,
    color: "text-purple-600",
    bgColor: "from-purple-50 to-violet-100",
    borderColor: "border-purple-300",
    accentColor: "bg-purple-500",
  },
  filter: {
    icon: Filter,
    color: "text-blue-600",
    bgColor: "from-blue-50 to-cyan-100",
    borderColor: "border-blue-300",
    accentColor: "bg-blue-500",
  },
  response: {
    icon: MessageCircle,
    color: "text-orange-600",
    bgColor: "from-orange-50 to-amber-100",
    borderColor: "border-orange-300",
    accentColor: "bg-orange-500",
  },
  integration: {
    icon: Zap,
    color: "text-yellow-600",
    bgColor: "from-yellow-50 to-orange-100",
    borderColor: "border-yellow-300",
    accentColor: "bg-yellow-500",
  },
  storage: {
    icon: Database,
    color: "text-gray-600",
    bgColor: "from-gray-50 to-slate-100",
    borderColor: "border-gray-300",
    accentColor: "bg-gray-500",
  },
}

interface WorkflowDesignerViewerProps {
  request: {
    id: string
    title: string
    businessObjective: string
    status: string
    urgency: string
    createdAt: string
    estimatedDelivery: string | null
    developmentNotes: string | null
    user: {
      firstname: string
      lastname: string
      email: string
    }
    businessInfo: {
      businessName: string
      businessType: string
      description: string
      website: string
      email: string
    }
    workflowDesign: {
      title: string
      description: string
      platform: string
      estimatedBuildTime: string
      complexity: string
      estimatedCost?: string
      roi?: string
      metrics?: {
        automationRate: string
        responseTime: string
        accuracy: string
        scalability: string
      }
      steps: Array<{
        id: string
        stepNumber: number
        title: string
        description: string
        type: string
        inputs?: string[]
        outputs?: string[]
        details?: string[]
        voiceflowAction?: string
        businessImpact?: string
        estimatedTime?: string
        complexity?: "low" | "medium" | "high"
        assignedIntegration?: {
          id: string
          name: string
          icon: React.ComponentType<{ className?: string }>
          description: string
        }
      }>
      integrations: Array<{
        id: string
        name: string
        icon: React.ComponentType<{ className?: string }>
        description: string
        operations?: string[]
      }>
      benefits?: string[]
      selectedGoals?: Array<{
        id: string
        label: string
        description: string
      }>
      customRequest?: string
      voiceflowFeatures?: string[]
      instagramFocus?: string[]
    }
  }
  onBackToDashboard: () => void
}

export default function WorkflowDesignerViewer({ request, onBackToDashboard }: WorkflowDesignerViewerProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set())
  const [activeView, setActiveView] = useState<"overview" | "steps" | "integrations" | "implementation">("overview")

  const toggleStepExpansion = (stepNumber: number) => {
    setExpandedSteps(prev => {
      const newSet = new Set(prev)
      if (newSet.has(stepNumber)) {
        newSet.delete(stepNumber)
      } else {
        newSet.add(stepNumber)
      }
      return newSet
    })
  }

  const workflow = request.workflowDesign

  const WorkflowStepComponent = ({ step }: { 
  step: {
    id: string
    stepNumber: number
    title: string
    description: string
    type: string
    inputs?: string[]
    outputs?: string[]
    details?: string[]
    voiceflowAction?: string
    businessImpact?: string
    estimatedTime?: string
    complexity?: "low" | "medium" | "high"
    assignedIntegration?: {
      id: string
      name: string
      icon: React.ComponentType<{ className?: string }>
      description: string
    }
  }
}) => {
    // const config = stepTypeConfigs[step.type] || stepTypeConfigs.integration
    const config = stepTypeConfigs[step.type as keyof typeof stepTypeConfigs] || stepTypeConfigs.integration;
    const IconComponent = config.icon
    const isExpanded = expandedSteps.has(step.stepNumber)

    return (
      <div className="relative">
        <div
          className={`rounded-xl border-2 transition-all duration-300 cursor-pointer bg-gradient-to-br ${
            config.bgColor
          } ${config.borderColor} ${
            isExpanded
              ? "shadow-xl scale-[1.02] border-opacity-100"
              : "hover:shadow-lg hover:scale-[1.01] border-opacity-60"
          }`}
          onClick={() => toggleStepExpansion(step.stepNumber)}
        >
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div
                  className={`w-16 h-16 ${config.accentColor} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-xl`}
                >
                  {step.stepNumber}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
                  <IconComponent className={`h-4 w-4 ${config.color}`} />
                </div>
              </div>

              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-3">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">{step.title}</h4>
                  <Badge variant="outline" className="text-xs font-medium">
                    {step.voiceflowAction}
                  </Badge>
                  {step.assignedIntegration && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                      <step.assignedIntegration.icon className="h-3 w-3 mr-1" />
                      {step.assignedIntegration.name}
                    </Badge>
                  )}
                  <Badge variant="outline" className={`text-xs ${
                    step.complexity === "high" ? "border-red-300 text-red-600" :
                    step.complexity === "medium" ? "border-yellow-300 text-yellow-600" :
                    "border-green-300 text-green-600"
                  }`}>
                    {step.complexity}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-3 leading-relaxed">{step.description}</p>

                <div className="flex items-center gap-6 text-sm">
                  {step.inputs && step.inputs.length > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-700 dark:text-green-300 font-medium">
                        Input: {step.inputs.slice(0, 2).join(", ")}
                        {step.inputs.length > 2 && `... (+${step.inputs.length - 2})`}
                      </span>
                    </div>
                  )}
                  {step.outputs && step.outputs.length > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-blue-700 dark:text-blue-300 font-medium">
                        Output: {step.outputs.slice(0, 2).join(", ")}
                        {step.outputs.length > 2 && `... (+${step.outputs.length - 2})`}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                {isExpanded ? (
                  <ChevronDown className="h-6 w-6 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
            </div>
          </div>

          {isExpanded && (
            <div className="border-t border-white/50 bg-white/30 dark:bg-black/10 p-6">
              <div className="grid lg:grid-cols-3 gap-6">
                <div>
                  <h5 className="font-semibold mb-3 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-blue-500" />
                    Implementation Details
                  </h5>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {step.details?.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-semibold mb-3 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-500" />
                    Business Impact
                  </h5>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-green-600 dark:text-green-400 text-xs leading-relaxed">
                        {step.businessImpact}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Execution Time:</span>
                      <Badge variant="secondary">{step.estimatedTime}</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold mb-3 flex items-center gap-2">
                    <Settings className="h-4 w-4 text-purple-500" />
                    Voiceflow Configuration
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Workflow className="h-4 w-4 text-purple-600" />
                        <span className="font-medium text-purple-700 dark:text-purple-300">
                          {step.voiceflowAction}
                        </span>
                      </div>
                      {step.assignedIntegration && (
                        <div className="mt-2">
                          <div className="flex items-center gap-2">
                            <step.assignedIntegration.icon className="h-4 w-4 text-green-600" />
                            <span className="text-xs font-medium text-green-700 dark:text-green-300">
                              {step.assignedIntegration.name}
                            </span>
                          </div>
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                            {step.assignedIntegration.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Complete Input/Output Details */}
              <div className="grid lg:grid-cols-2 gap-6 mt-6 pt-6 border-t border-white/30">
                <div>
                  <h6 className="font-medium mb-3 text-green-700 dark:text-green-300">Complete Inputs:</h6>
                  <div className="space-y-1">
                    {step.inputs?.map((input, idx) => (
                      <div key={idx} className="text-xs p-2 bg-green-50 dark:bg-green-900/20 rounded flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>{input}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h6 className="font-medium mb-3 text-blue-700 dark:text-blue-300">Expected Outputs:</h6>
                  <div className="space-y-1">
                    {step.outputs?.map((output, idx) => (
                      <div key={idx} className="text-xs p-2 bg-blue-50 dark:bg-blue-900/20 rounded flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>{output}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {step.stepNumber < (workflow.steps?.length || 1) && (
          <div className="flex justify-center my-6">
            <div className="relative">
              <div className="w-px h-12 bg-gradient-to-b from-gray-300 via-pink-300 to-gray-100 dark:from-gray-600 dark:via-pink-600 dark:to-gray-800"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" className="mb-6 hover:bg-accent" onClick={onBackToDashboard}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Instagram className="h-8 w-8 text-pink-500" />
                <h1 className="text-4xl font-bold">{workflow.title}</h1>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  <Brain className="h-3 w-3 mr-1" />
                  DeepSeek AI Generated
                </Badge>
              </div>
              <p className="text-muted-foreground text-lg max-w-3xl">{workflow.description}</p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline">
                <Code className="h-4 w-4 mr-2" />
                Generate Code
              </Button>
            </div>
          </div>

          {/* Business Context */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-2 border-blue-200 bg-blue-50 dark:bg-blue-900/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800 dark:text-blue-300">Business</span>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-400">{request.businessInfo.businessName}</p>
                <p className="text-xs text-blue-600 dark:text-blue-500">{request.businessInfo.businessType}</p>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-green-200 bg-green-50 dark:bg-green-900/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800 dark:text-green-300">Requested by</span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-400">
                  {request.user.firstname} {request.user.lastname}
                </p>
                <p className="text-xs text-green-600 dark:text-green-500">{request.user.email}</p>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-purple-200 bg-purple-50 dark:bg-purple-900/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-purple-800 dark:text-purple-300">Timeline</span>
                </div>
                <p className="text-sm text-purple-700 dark:text-purple-400">{workflow.estimatedBuildTime}</p>
                <p className="text-xs text-purple-600 dark:text-purple-500">Build Time</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            {[
              { id: "overview", label: "Overview", icon: Eye },
              { id: "steps", label: "Workflow Steps", icon: Workflow },
              { id: "integrations", label: "Integrations", icon: Zap },
              { id: "implementation", label: "Implementation", icon: Code },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveView(id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content based on active view */}
        {activeView === "overview" && (
          <div className="space-y-6">
            {/* Metrics Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-pink-500 mb-2">{workflow.metrics?.automationRate}</div>
                  <div className="text-sm text-muted-foreground">Automation Rate</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-green-500 mb-2">{workflow.metrics?.responseTime}</div>
                  <div className="text-sm text-muted-foreground">Response Time</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-purple-500 mb-2">{workflow.metrics?.accuracy}</div>
                  <div className="text-sm text-muted-foreground">AI Accuracy</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-orange-500 mb-2">{workflow.complexity}</div>
                  <div className="text-sm text-muted-foreground">Complexity</div>
                </CardContent>
              </Card>
            </div>

            {/* Original Customer Request */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-500" />
                  Original Customer Request
                </CardTitle>
                <CardDescription>The specific automation requirements provided by the customer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{workflow.customRequest}</p>
                </div>
              </CardContent>
            </Card>

            {/* Selected Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-500" />
                  Instagram Automation Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {workflow.selectedGoals?.map((goal) => (
                    <div key={goal.id} className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">{goal.label}</h4>
                      <p className="text-sm text-green-600 dark:text-green-400">{goal.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Expected Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {workflow.benefits?.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-yellow-800 dark:text-yellow-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cost & ROI */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <TrendingUp className="h-5 w-5" />
                    Estimated Cost
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">{workflow.estimatedCost}</div>
                  <p className="text-sm text-green-600">Monthly operational cost including integrations and hosting</p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Star className="h-5 w-5" />
                    Expected ROI
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{workflow.roi}</div>
                  <p className="text-sm text-blue-600">Return on investment through automation and efficiency gains</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeView === "steps" && (
          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl shadow-lg">
                <Workflow className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Workflow Steps ({workflow.steps?.length})</h3>
                <p className="text-muted-foreground">Detailed breakdown of the AI-generated Instagram automation workflow</p>
              </div>
            </div>

            {workflow.steps?.map((step) => (
              <WorkflowStepComponent key={step.id} step={step} />
            ))}
          </div>
        )}

        {activeView === "integrations" && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl shadow-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Required Integrations ({workflow.integrations?.length})</h3>
                <p className="text-muted-foreground">External services and APIs needed for this workflow</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {workflow.integrations?.map((integration) => {
                const IconComponent = integration.icon
                return (
                  <Card key={integration.id} className="border-2 border-blue-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                          <IconComponent className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <span className="text-lg">{integration.name}</span>
                          <Badge variant="outline" className="ml-2 text-xs">Required</Badge>
                        </div>
                      </CardTitle>
                      <CardDescription>{integration.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <h5 className="font-medium mb-3">Available Operations:</h5>
                        <div className="flex flex-wrap gap-2">
                          {integration.operations?.map((operation) => (
                            <Badge key={operation} variant="secondary" className="text-xs">
                              {operation}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {activeView === "implementation" && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-lg">
                <Code className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Implementation Guide</h3>
                <p className="text-muted-foreground">Step-by-step implementation instructions for developers</p>
              </div>
            </div>

            {/* Voiceflow Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="h-5 w-5 text-purple-500" />
                  Voiceflow Features Required
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {workflow.voiceflowFeatures?.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <Settings className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Instagram-Specific Implementation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Instagram className="h-5 w-5 text-pink-500" />
                  Instagram-Specific Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {workflow.instagramFocus?.map((focus, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                      <Instagram className="h-4 w-4 text-pink-600" />
                      <span className="text-sm font-medium">{focus}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Implementation Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  Development Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div>
                      <h4 className="font-medium">Phase 1: Setup & Integration</h4>
                      <p className="text-sm text-muted-foreground">Configure Voiceflow and integrate APIs</p>
                    </div>
                    <Badge variant="secondary">3-5 days</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div>
                      <h4 className="font-medium">Phase 2: AI Training & Logic</h4>
                      <p className="text-sm text-muted-foreground">Implement DeepSeek AI and workflow logic</p>
                    </div>
                    <Badge variant="secondary">5-7 days</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div>
                      <h4 className="font-medium">Phase 3: Testing & Optimization</h4>
                      <p className="text-sm text-muted-foreground">Test workflows and optimize performance</p>
                    </div>
                    <Badge variant="secondary">3-4 days</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div>
                      <h4 className="font-medium">Phase 4: Deployment & Monitoring</h4>
                      <p className="text-sm text-muted-foreground">Deploy to production and set up monitoring</p>
                    </div>
                    <Badge variant="secondary">1-2 days</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-500" />
                  Technical Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium mb-3">Environment Variables Needed:</h5>
                    <div className="space-y-2">
                      <code className="block p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">DEEPSEEK_API_KEY</code>
                      <code className="block p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">INSTAGRAM_ACCESS_TOKEN</code>
                      <code className="block p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">VOICEFLOW_API_KEY</code>
                      {workflow.integrations?.map((integration) => (
                        <code key={integration.id} className="block p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                          {integration.name.toUpperCase().replace(/\s+/g, '_')}_API_KEY
                        </code>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium mb-3">Setup Instructions:</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <span>Set up Instagram Business API access</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <span>Configure Voiceflow project with Instagram channel</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <span>Set up DeepSeek AI API access</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <span>Configure integration API keys and webhooks</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
