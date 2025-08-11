



"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  CheckCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  User,
  Calendar,
  RefreshCw,
  Eye,
  Edit,
  Loader2,
  Star,
  TrendingUp,
  Zap,
  Building,
  Mail,
  ChevronDown,
  ChevronRight,
  Brain,
  Layers,
  Activity,
  Settings,
  Plus,
  Globe,
  Lock,
  GitBranch,
  Database,
  Filter,
  MessageCircle,
  Bell,
  Shield,
  Bot,
  PlayCircle,
  Timer,
  Puzzle,
  Wand2,
} from "lucide-react"
import type { CustomWorkflowRequest, WorkflowTemplate, WorkflowStep } from "@/types/workflow"
import AdminWorkflowDesigner from "./workflow-designer"
import WorkflowDesignerViewer from "./workflow-viewer"

const statusConfig = {
  SUBMITTED: {
    label: "Submitted",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    progress: 10,
    icon: MessageSquare,
  },
  UNDER_REVIEW: {
    label: "Under Review",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    progress: 25,
    icon: Eye,
  },
  APPROVED: {
    label: "Approved",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    progress: 40,
    icon: CheckCircle,
  },
  IN_DEVELOPMENT: {
    label: "In Development",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    progress: 70,
    icon: Loader2,
  },
  READY_FOR_TESTING: {
    label: "Ready for Testing",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    progress: 90,
    icon: AlertCircle,
  },
  COMPLETED: {
    label: "Completed",
    color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
    progress: 100,
    icon: CheckCircle,
  },
  REJECTED: {
    label: "Rejected",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    progress: 0,
    icon: AlertCircle,
  },
  CANCELED: {
    label: "Canceled",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    progress: 0,
    icon: AlertCircle,
  },
  EDIT_REQUESTED: {
    // Added EDIT_REQUESTED status
    label: "Edit Requested",
    color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    progress: 80, // Or appropriate progress
    icon: Edit,
  },
}

const urgencyConfig = {
  LOW: { label: "Low", color: "bg-gray-100 text-gray-800" },
  NORMAL: { label: "Normal", color: "bg-blue-100 text-blue-800" },
  HIGH: { label: "High", color: "bg-orange-100 text-orange-800" },
  CRITICAL: { label: "Critical", color: "bg-red-100 text-red-800" },
}

const stepTypeConfigs: Record<string, any> = {
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
  notification: {
    icon: Bell,
    color: "text-red-600",
    bgColor: "from-red-50 to-pink-100",
    borderColor: "border-red-300",
    accentColor: "bg-red-500",
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
  routing: {
    icon: GitBranch,
    color: "text-indigo-600",
    bgColor: "from-indigo-50 to-blue-100",
    borderColor: "border-indigo-300",
    accentColor: "bg-indigo-500",
  },
  validation: {
    icon: Shield,
    color: "text-cyan-600",
    bgColor: "from-cyan-50 to-teal-100",
    borderColor: "border-cyan-300",
    accentColor: "bg-cyan-500",
  },
  automation: {
    icon: Bot,
    color: "text-pink-600",
    bgColor: "from-pink-50 to-rose-100",
    borderColor: "border-pink-300",
    accentColor: "bg-pink-500",
  },
}

export default function AdminWorkflowRequestsDashboard() {
  const [requests, setRequests] = useState<CustomWorkflowRequest[]>([])
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<CustomWorkflowRequest | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [isWorkflowDesignerOpen, setIsWorkflowDesignerOpen] = useState(false) // New state for designer view
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set())
  const [activeTab, setActiveTab] = useState("requests")

  const [updateForm, setUpdateForm] = useState({
    status: "",
    developmentNotes: "",
    estimatedDelivery: "",
  })

  const toggleStepExpansion = (stepNumber: number) => {
    setExpandedSteps((prevSteps) => {
      const newSteps = new Set(prevSteps)
      if (newSteps.has(stepNumber)) {
        newSteps.delete(stepNumber)
      } else {
        newSteps.add(stepNumber)
      }
      return newSteps
    })
  }

  useEffect(() => {
    fetchRequests()
    fetchTemplates()
  }, [])

  const fetchRequests = async () => {
    try {
      setRefreshing(true)
      const response = await fetch("/api/admin/workflow-requests")
      const data = await response.json()
      setRequests(data.requests || [])
    } catch (error) {
      console.error("Error fetching requests:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/admin/workflow-templates")
      const data = await response.json()
      setTemplates(data.templates || [])
    } catch (error) {
      console.error("Error fetching templates:", error)
    }
  }

  const handleUpdateRequest = async () => {
    if (!selectedRequest) return

    try {
      const response = await fetch(`/api/admin/workflow-requests/${selectedRequest.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateForm),
      })

      if (response.ok) {
        await fetchRequests()
        setIsUpdateDialogOpen(false)
        setSelectedRequest(null)
        setUpdateForm({ status: "", developmentNotes: "", estimatedDelivery: "" })
      }
    } catch (error) {
      console.error("Error updating request:", error)
    }
  }

  const openUpdateDialog = (request: CustomWorkflowRequest) => {
    setSelectedRequest(request)
    setUpdateForm({
      status: request.status,
      developmentNotes: request.developmentNotes || "",
      estimatedDelivery: request.estimatedDelivery || "",
    })
    setIsUpdateDialogOpen(true)
  }

  const openWorkflowDesignerForRequest = (request: CustomWorkflowRequest) => {
    setSelectedRequest(request)
    setSelectedTemplate(null) // Ensure no template is selected
    setIsWorkflowDesignerOpen(true)
    setExpandedSteps(new Set())
  }

  const openWorkflowDesignerForTemplate = (template: WorkflowTemplate) => {
    setSelectedTemplate(template)
    setSelectedRequest(null) // Ensure no request is selected
    setIsWorkflowDesignerOpen(true)
    setExpandedSteps(new Set())
  }

  const handleBackToDashboard = () => {
    setIsWorkflowDesignerOpen(false)
    setSelectedRequest(null)
    setSelectedTemplate(null)
    fetchRequests() // Refresh data when returning
    fetchTemplates() // Refresh data when returning
  }

  const handleTemplateSaved = () => {
    // This function is called from AdminWorkflowDesigner when a template is saved/published
    // It will trigger a refresh of the templates list in the dashboard
    fetchTemplates()
  }

  const WorkflowStepComponent = ({ step }: { step: WorkflowStep }) => {
    const config = stepTypeConfigs[step.type] || stepTypeConfigs.automation
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
                    {step.type}
                  </Badge>
                  {/* {step.complexity && (
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        step.complexity === "high"
                          ? "bg-red-100 text-red-700"
                          : step.complexity === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {step.complexity} complexity
                    </Badge>
                  )} */}
                  {step.estimatedTime && (
                    <Badge variant="secondary" className="text-xs">
                      <Timer className="h-3 w-3 mr-1" />
                      {step.estimatedTime}
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-3 leading-relaxed">{step.description}</p>

                <div className="flex items-center gap-6 text-sm">
                  {step.inputs && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-700 dark:text-green-300 font-medium">
                        Input: {step.inputs.join(", ")}
                      </span>
                    </div>
                  )}
                  {step.outputs && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-blue-700 dark:text-blue-300 font-medium">
                        Output: {step.outputs.join(", ")}
                      </span>
                    </div>
                  )}
                </div>

                {step.selectedIntegrations && step.selectedIntegrations.length > 0 && (
                  <div className="mt-3 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-purple-500" />
                    <span className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                      Integrations: {step.selectedIntegrations.map((i) => i.name).join(", ")}
                    </span>
                  </div>
                )}
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
              {step.aiReasoning && (
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                  <h6 className="font-semibold mb-2 flex items-center gap-2 text-purple-700 dark:text-purple-300">
                    <Brain className="h-4 w-4" />
                    AI Reasoning
                  </h6>
                  <p className="text-sm text-purple-600 dark:text-purple-400">{step.aiReasoning}</p>
                </div>
              )}

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
                    Performance & Impact
                  </h5>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Execution Time:</span>
                      <Badge variant="secondary">{step.estimatedTime}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Business Impact:</span>
                      <Badge variant="secondary" className="text-green-600">
                        High
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Reliability:</span>
                      <Badge variant="secondary" className="text-blue-600">
                        99.9%
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold mb-3 flex items-center gap-2">
                    <Settings className="h-4 w-4 text-orange-500" />
                    Required Integrations
                  </h5>
                  <div className="space-y-2 text-sm">
                    {step.selectedIntegrations?.map((integration, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                        <Puzzle className="h-3 w-3 text-purple-500" />
                        <span className="font-medium">{integration.name}</span>
                        <Badge variant="outline" className="text-xs ml-auto">
                          {integration.pricing}
                        </Badge>
                      </div>
                    )) || <p className="text-muted-foreground text-xs">No specific integrations required</p>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {step.stepNumber < (selectedRequest?.aiSuggestions?.workflowDesign?.steps?.length || 1) && (
          <div className="flex justify-center my-6">
            <div className="relative">
              <div className="w-px h-12 bg-gradient-to-b from-gray-300 via-blue-300 to-gray-100 dark:from-gray-600 dark:via-blue-600 dark:to-gray-800"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If the designer is open, render it instead of the dashboard
  if (isWorkflowDesignerOpen) {
    return (
      // <AdminWorkflowDesigner
      //   initialRequest={selectedRequest}
      //   initialTemplate={selectedTemplate}
      //   onBackToDashboard={handleBackToDashboard}
      //   onTemplateSaved={handleTemplateSaved}
      // />
       <AdminWorkflowDesigner
        initialRequest={selectedRequest as any}
        initialTemplate={selectedTemplate as any}
        onBackToDashboard={handleBackToDashboard}
        onTemplateSaved={handleTemplateSaved}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Workflow Requests Dashboard</h2>
          <p className="text-muted-foreground">Manage and track custom workflow development requests</p>
        </div>
        <Button variant="outline" onClick={fetchRequests} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Total Requests</span>
            </div>
            <p className="text-2xl font-bold mt-2">{requests.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">In Development</span>
            </div>
            <p className="text-2xl font-bold mt-2">{requests.filter((r) => r.status === "IN_DEVELOPMENT").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Completed</span>
            </div>
            <p className="text-2xl font-bold mt-2">{requests.filter((r) => r.status === "COMPLETED").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Pending Review</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {requests.filter((r) => r.status === "SUBMITTED" || r.status === "UNDER_REVIEW").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="requests">Workflow Requests</TabsTrigger>
          <TabsTrigger value="templates">Created Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          {/* Requests List */}
          {requests.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Workflow Requests</h3>
                <p className="text-muted-foreground">No custom workflow requests have been submitted yet.</p>
              </CardContent>
            </Card>
          ) : (
            requests.map((request) => {
              const config = statusConfig[request.status]
              const urgencyConf = urgencyConfig[request.urgency]
              const StatusIcon = config.icon
              const hasWorkflowDesign = request.aiSuggestions?.workflowDesign

              return (
                <Card key={request.id} className="relative overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{request.title}</CardTitle>
                          <Badge className={config.color}>{config.label}</Badge>
                          <Badge className={urgencyConf.color}>{urgencyConf.label}</Badge>
                          {hasWorkflowDesign && (
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              <Star className="h-3 w-3 mr-1" />
                              AI Generated
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-base">{request.businessObjective}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {hasWorkflowDesign && (
                          <Button variant="outline" size="sm" onClick={() => openWorkflowDesignerForRequest(request)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Design
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => openUpdateDialog(request)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Update Status
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Business Information */}
                    {request.aiSuggestions?.businessInfo && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Business</p>
                            <p className="text-sm font-medium">{request.aiSuggestions.businessInfo.businessName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Industry</p>
                            <p className="text-sm font-medium">{request.aiSuggestions.businessInfo.businessType}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Contact</p>
                            <p className="text-sm font-medium">{request.user.email}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* AI Workflow Design Summary */}
                    {hasWorkflowDesign && request.aiSuggestions?.workflowDesign && (
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                        <h4 className="font-semibold mb-3 flex items-center gap-2 text-blue-800 dark:text-blue-300">
                          <Zap className="h-4 w-4" />
                          AI-Generated Workflow Design
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          {request.aiSuggestions.workflowDesign.metrics && (
                            <>
                              <div className="text-center">
                                <p className="text-lg font-bold text-blue-600">
                                  {request.aiSuggestions.workflowDesign.metrics.automationRate}
                                </p>
                                <p className="text-xs text-muted-foreground">Automation Rate</p>
                              </div>
                              <div className="text-center">
                                <p className="text-lg font-bold text-green-600">
                                  {request.aiSuggestions.workflowDesign.metrics.responseTime}
                                </p>
                                <p className="text-xs text-muted-foreground">Response Time</p>
                              </div>
                              <div className="text-center">
                                <p className="text-lg font-bold text-purple-600">
                                  {request.aiSuggestions.workflowDesign.metrics.accuracy}
                                </p>
                                <p className="text-xs text-muted-foreground">AI Accuracy</p>
                              </div>
                              <div className="text-center">
                                <p className="text-lg font-bold text-orange-600">
                                  {request.aiSuggestions.workflowDesign.complexity}
                                </p>
                                <p className="text-xs text-muted-foreground">Complexity</p>
                              </div>
                            </>
                          )}
                        </div>
                        {request.aiSuggestions.workflowDesign.steps?.length && (
                          <div>
                            <p className="text-sm font-medium mb-2">
                              Workflow Steps ({request.aiSuggestions.workflowDesign.steps.length}):
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {request.aiSuggestions.workflowDesign.steps.slice(0, 3).map((step: any, idx: number) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {step.title}
                                </Badge>
                              ))}
                              {request.aiSuggestions.workflowDesign.steps.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{request.aiSuggestions.workflowDesign.steps.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Custom Request Details */}
                    {request.aiSuggestions?.customRequest && (
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <h4 className="font-semibold mb-2">Custom Requirements</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {request.aiSuggestions.customRequest}
                        </p>
                      </div>
                    )}

                    {/* Platforms and Features */}
                    {(request.aiSuggestions?.selectedChannels?.length ||
                      request.aiSuggestions?.automationFeatures?.length) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {request.aiSuggestions?.selectedChannels?.length && (
                          <div>
                            <h4 className="font-semibold mb-2 text-sm">Selected Platforms</h4>
                            <div className="flex flex-wrap gap-2">
                              {request.aiSuggestions.selectedChannels.map((channel) => (
                                <Badge key={channel} variant="outline" className="text-xs">
                                  {channel}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {request.aiSuggestions?.automationFeatures?.length && (
                          <div>
                            <h4 className="font-semibold mb-2 text-sm">AI Features</h4>
                            <div className="flex flex-wrap gap-2">
                              {request.aiSuggestions.automationFeatures.map((feature) => (
                                <Badge key={feature} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Cost and ROI */}
                    {(request.aiSuggestions?.workflowDesign?.estimatedCost ||
                      request.aiSuggestions?.workflowDesign?.roi) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {request.aiSuggestions.workflowDesign.estimatedCost && (
                          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <TrendingUp className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium">Estimated Cost</span>
                            </div>
                            <p className="text-lg font-bold text-green-700">
                              {request.aiSuggestions.workflowDesign.estimatedCost}
                            </p>
                          </div>
                        )}
                        {request.aiSuggestions.workflowDesign.roi && (
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Star className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium">Expected ROI</span>
                            </div>
                            <p className="text-lg font-bold text-blue-700">
                              {request.aiSuggestions.workflowDesign.roi}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Development Notes */}
                    {request.developmentNotes && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h4 className="text-sm font-medium mb-2 text-blue-800 dark:text-blue-300">Development Notes</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-400">{request.developmentNotes}</p>
                      </div>
                    )}

                    {/* Template Creation */}
                    {hasWorkflowDesign && request.status === "IN_DEVELOPMENT" && !request.completedTemplate && (
                      <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-700">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold mb-1 text-green-800 dark:text-green-300">
                              Ready to Create Template?
                            </h4>
                            <p className="text-sm text-green-700 dark:text-green-400">
                              Convert this AI-generated workflow into a reusable template for users.
                            </p>
                          </div>
                          <Button
                            onClick={() => openWorkflowDesignerForRequest(request)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Create Template
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Completed Template Info */}
                    {request.completedTemplate && (
                      <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-5 w-5 text-emerald-600" />
                          <h4 className="font-semibold text-emerald-800 dark:text-emerald-300">Template Created!</h4>
                        </div>
                        <p className="text-sm text-emerald-700 dark:text-emerald-400 mb-2">
                          Template &ldquo;{request.completedTemplate.name}&rdquo; has been created and is{" "}
                          {request.completedTemplate.isPublic ? "publicly available" : "private to this user"}.
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {request.completedTemplate.isPublic ? (
                              <>
                                <Globe className="h-3 w-3 mr-1" />
                                Public
                              </>
                            ) : (
                              <>
                                <Lock className="h-3 w-3 mr-1" />
                                Private
                              </>
                            )}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {request.completedTemplate.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    )}

                    {/* Request Details */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Requested by</p>
                          <p className="text-sm font-medium">
                            {request.user.firstname} {request.user.lastname}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Submitted</p>
                          <p className="text-sm font-medium">{new Date(request.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {/* {request.budget && (
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Budget</p>
                            <p className="text-sm font-medium">${request.budget.toLocaleString()}</p>
                          </div>
                        </div>
                      )} */}

                      {request.estimatedDelivery && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Est. Delivery</p>
                            <p className="text-sm font-medium">
                              {new Date(request.estimatedDelivery).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.length === 0 ? (
              <div className="col-span-full">
                <Card>
                  <CardContent className="p-8 text-center">
                    <Wand2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Templates Created</h3>
                    <p className="text-muted-foreground">Templates created from workflow requests will appear here.</p>
                    <Button onClick={() => setIsWorkflowDesignerOpen(true)} className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Template
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <>
                <div className="col-span-full flex justify-end">
                  <Button onClick={() => setIsWorkflowDesignerOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Template
                  </Button>
                </div>
                {templates.map((template) => (
                  <Card key={template.id} className="relative">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {template.category} • {template.complexity}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          {template.isPublic ? (
                            <div title="Public">
                              <Globe className="h-4 w-4 text-green-500" />
                            </div>
                          ) : (
                            <div title="Private">
                              <Lock className="h-4 w-4 text-orange-500" />
                            </div>
                          )}
                          {template.createdByAdmin && (
                            <div title="Admin Created">
                              <Star className="h-4 w-4 text-yellow-500" />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{template.description}</p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{template._count.businessConfigs} users</span>
                        </div>
                        <Badge variant={template.isActive ? "default" : "secondary"}>
                          {template.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => openWorkflowDesignerForTemplate(template)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View / Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Toggle template visibility
                            fetch(`/api/admin/workflow-templates/${template.id}/publish`, {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ isPublic: !template.isPublic }),
                            }).then(() => fetchTemplates())
                          }}
                        >
                          {template.isPublic ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Update Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Request Status</DialogTitle>
            <DialogDescription>
              Update the status and add development notes for this workflow request.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={updateForm.status}
                onValueChange={(value) => setUpdateForm({ ...updateForm, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(statusConfig).map((statusKey) => (
                    <SelectItem key={statusKey} value={statusKey}>
                      {statusConfig[statusKey as keyof typeof statusConfig].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="estimatedDelivery">Estimated Delivery Date</Label>
              <Input
                id="estimatedDelivery"
                type="date"
                value={updateForm.estimatedDelivery}
                onChange={(e) => setUpdateForm({ ...updateForm, estimatedDelivery: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="developmentNotes">Development Notes</Label>
              <Textarea
                id="developmentNotes"
                placeholder="Add notes about the development progress..."
                value={updateForm.developmentNotes}
                onChange={(e) => setUpdateForm({ ...updateForm, developmentNotes: e.target.value })}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRequest}>Update Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}



// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { CheckCircle, Clock, AlertCircle, MessageSquare, User, Calendar, RefreshCw, Eye, Edit, Loader2, Star, TrendingUp, Zap, Building, Mail, Instagram, Brain, Target, Users, Database, FileSpreadsheet, FileText, Workflow, Settings, PlayCircle, Filter, MessageCircle } from 'lucide-react'
// import WorkflowDesignerViewer from "./workflow-viewer"

// // TypeScript interfaces
// interface User {
//   firstname: string
//   lastname: string
//   email: string
// }

// interface BusinessInfo {
//   businessName: string
//   businessType: string
//   description: string
//   website: string
//   email: string
// }

// interface Integration {
//   id: string
//   name: string
//   icon: React.ComponentType<{ className?: string }>
//   description: string
//   operations: string[]
// }

// interface WorkflowStep {
//   id: string
//   stepNumber: number
//   title: string
//   description: string
//   type: string
//   inputs?: string[]
//   outputs?: string[]
//   details?: string[]
//   voiceflowAction?: string
//   businessImpact?: string
//   estimatedTime?: string
//   complexity?: "low" | "medium" | "high"
//   needsIntegration?: boolean
//   assignedIntegration?: Integration
// }

// interface SelectedGoal {
//   id: string
//   label: string
//   description: string
// }

// interface WorkflowDesign {
//   title: string
//   description: string
//   platform: string
//   estimatedBuildTime: string
//   complexity: string
//   estimatedCost?: string
//   roi?: string
//   metrics?: {
//     automationRate: string
//     responseTime: string
//     accuracy: string
//     scalability: string
//   }
//   steps: WorkflowStep[]
//   integrations: Integration[]
//   benefits?: string[]
//   selectedGoals?: SelectedGoal[]
//   customRequest?: string
//   exampleScenario?: string
//   voiceflowFeatures?: string[]
//   instagramFocus?: string[]
// }

// // Define status and urgency types
// type WorkflowStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'IN_DEVELOPMENT' | 'READY_FOR_TESTING' | 'COMPLETED' | 'REJECTED' | 'CANCELED' | 'EDIT_REQUESTED'
// type WorkflowUrgency = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL'

// interface WorkflowRequest {
//   id: string
//   title: string
//   businessObjective: string
//   status: WorkflowStatus
//   urgency: WorkflowUrgency
//   createdAt: string
//   estimatedDelivery: string | null
//   developmentNotes: string | null
//   user: User
//   completedTemplate: null
//   businessInfo: BusinessInfo
//   workflowDesign?: WorkflowDesign
// }

// interface UpdateForm {
//   status: string
//   developmentNotes: string
//   estimatedDelivery: string
// }

// const statusConfig: Record<WorkflowStatus, {
//   label: string
//   color: string
//   progress: number
//   icon: React.ComponentType<{ className?: string }>
// }> = {
//   SUBMITTED: {
//     label: "Submitted",
//     color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
//     progress: 10,
//     icon: MessageSquare,
//   },
//   UNDER_REVIEW: {
//     label: "Under Review",
//     color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
//     progress: 25,
//     icon: Eye,
//   },
//   APPROVED: {
//     label: "Approved",
//     color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
//     progress: 40,
//     icon: CheckCircle,
//   },
//   IN_DEVELOPMENT: {
//     label: "In Development",
//     color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
//     progress: 70,
//     icon: Loader2,
//   },
//   READY_FOR_TESTING: {
//     label: "Ready for Testing",
//     color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
//     progress: 90,
//     icon: AlertCircle,
//   },
//   COMPLETED: {
//     label: "Completed",
//     color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
//     progress: 100,
//     icon: CheckCircle,
//   },
//   REJECTED: {
//     label: "Rejected",
//     color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
//     progress: 0,
//     icon: AlertCircle,
//   },
//   CANCELED: {
//     label: "Canceled",
//     color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
//     progress: 0,
//     icon: AlertCircle,
//   },
//   EDIT_REQUESTED: {
//     label: "Edit Requested",
//     color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
//     progress: 80,
//     icon: Edit,
//   },
// }

// const urgencyConfig: Record<WorkflowUrgency, { label: string; color: string }> = {
//   LOW: { label: "Low", color: "bg-gray-100 text-gray-800" },
//   NORMAL: { label: "Normal", color: "bg-blue-100 text-blue-800" },
//   HIGH: { label: "High", color: "bg-orange-100 text-orange-800" },
//   CRITICAL: { label: "Critical", color: "bg-red-100 text-red-800" },
// }

// const AdminWorkflowRequestsDashboard = () => {
//   const [requests, setRequests] = useState<WorkflowRequest[]>([])
//   const [loading, setLoading] = useState(true)
//   const [refreshing, setRefreshing] = useState(false)
//   const [selectedRequest, setSelectedRequest] = useState<WorkflowRequest | null>(null)
//   const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
//   const [isWorkflowViewerOpen, setIsWorkflowViewerOpen] = useState(false)

//   const [updateForm, setUpdateForm] = useState<UpdateForm>({
//     status: "",
//     developmentNotes: "",
//     estimatedDelivery: "",
//   })

//   // Load workflow requests from localStorage on component mount
//   useEffect(() => {
//     loadWorkflowRequests()
//   }, [])

//   const loadWorkflowRequests = () => {
//     setLoading(true)
//     try {
//       // Load submitted workflows from localStorage
//       const submittedWorkflows = []
      
//       // Check for individual workflow submissions
//       for (let i = 0; i < localStorage.length; i++) {
//         const key = localStorage.key(i)
//         if (key && key.startsWith('workflow-submission-')) {
//           const workflowData = localStorage.getItem(key)
//           if (workflowData) {
//             try {
//               const workflow = JSON.parse(workflowData)
//               submittedWorkflows.push({
//                 id: workflow.id || key.replace('workflow-submission-', ''),
//                 title: workflow.title || 'Instagram Automation Workflow',
//                 businessObjective: workflow.businessObjective || 'Instagram DM automation',
//                 status: 'SUBMITTED' as WorkflowStatus,
//                 urgency: workflow.urgency || 'NORMAL' as WorkflowUrgency,
//                 createdAt: workflow.submittedAt || new Date().toISOString(),
//                 estimatedDelivery: null,
//                 developmentNotes: null,
//                 user: workflow.user || {
//                   firstname: 'Unknown',
//                   lastname: 'User',
//                   email: 'user@example.com'
//                 },
//                 completedTemplate: null,
//                 businessInfo: workflow.businessInfo || {
//                   businessName: 'Unknown Business',
//                   businessType: 'Unknown',
//                   description: 'No description provided',
//                   website: '',
//                   email: ''
//                 },
//                 workflowDesign: workflow.workflowDesign
//               })
//             } catch (error) {
//               console.error('Error parsing workflow data:', error)
//             }
//           }
//         }
//       }

//       setRequests(submittedWorkflows)
//     } catch (error) {
//       console.error('Error loading workflow requests:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchRequests = async () => {
//     setRefreshing(true)
//     // Reload from localStorage
//     loadWorkflowRequests()
//     setRefreshing(false)
//   }

//   const handleUpdateRequest = async () => {
//     if (!selectedRequest) return

//     // Update the request in state
//     setRequests(prev => prev.map(req => 
//       req.id === selectedRequest.id 
//         ? { 
//             ...req, 
//             status: updateForm.status as WorkflowStatus,
//             developmentNotes: updateForm.developmentNotes || null,
//             estimatedDelivery: updateForm.estimatedDelivery || null
//           }
//         : req
//     ))

//     // Update in localStorage if it exists
//     const storageKey = `workflow-submission-${selectedRequest.id}`
//     const existingData = localStorage.getItem(storageKey)
//     if (existingData) {
//       try {
//         const workflowData = JSON.parse(existingData)
//         workflowData.status = updateForm.status
//         workflowData.developmentNotes = updateForm.developmentNotes
//         workflowData.estimatedDelivery = updateForm.estimatedDelivery
//         localStorage.setItem(storageKey, JSON.stringify(workflowData))
//       } catch (error) {
//         console.error('Error updating workflow in localStorage:', error)
//       }
//     }

//     setIsUpdateDialogOpen(false)
//     setSelectedRequest(null)
//     setUpdateForm({ status: "", developmentNotes: "", estimatedDelivery: "" })
//   }

//   const openUpdateDialog = (request: WorkflowRequest) => {
//     setSelectedRequest(request)
//     setUpdateForm({
//       status: request.status,
//       developmentNotes: request.developmentNotes || "",
//       estimatedDelivery: request.estimatedDelivery || "",
//     })
//     setIsUpdateDialogOpen(true)
//   }

//   const openWorkflowViewer = (request: WorkflowRequest) => {
//     setSelectedRequest(request)
//     setIsWorkflowViewerOpen(true)
//   }

//   const handleBackToDashboard = () => {
//     setIsWorkflowViewerOpen(false)
//     setSelectedRequest(null)
//   }


//   if (isWorkflowViewerOpen && selectedRequest && selectedRequest.workflowDesign) {
//       return (
//         <WorkflowDesignerViewer
//           request={selectedRequest as WorkflowRequest & { workflowDesign: NonNullable<WorkflowRequest['workflowDesign']> }}
//           onBackToDashboard={handleBackToDashboard}
//         />
//       );
//     }




//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
//           <p className="text-muted-foreground">Loading workflow requests...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-3xl font-bold">Workflow Requests Dashboard</h2>
//           <p className="text-muted-foreground">Manage and track custom Instagram automation workflows</p>
//         </div>
//         <Button variant="outline" onClick={fetchRequests} disabled={refreshing}>
//           <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
//           Refresh
//         </Button>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center gap-2">
//               <Instagram className="h-4 w-4 text-pink-500" />
//               <span className="text-sm font-medium">Total Workflows</span>
//             </div>
//             <p className="text-2xl font-bold mt-2">{requests.length}</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center gap-2">
//               <Clock className="h-4 w-4 text-orange-500" />
//               <span className="text-sm font-medium">In Development</span>
//             </div>
//             <p className="text-2xl font-bold mt-2">{requests.filter((r) => r.status === "IN_DEVELOPMENT").length}</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center gap-2">
//               <CheckCircle className="h-4 w-4 text-green-500" />
//               <span className="text-sm font-medium">Completed</span>
//             </div>
//             <p className="text-2xl font-bold mt-2">{requests.filter((r) => r.status === "COMPLETED").length}</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center gap-2">
//               <Brain className="h-4 w-4 text-purple-500" />
//               <span className="text-sm font-medium">AI Generated</span>
//             </div>
//             <p className="text-2xl font-bold mt-2">{requests.filter((r) => r.workflowDesign).length}</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Empty State */}
//       {requests.length === 0 && (
//         <Card className="text-center py-12">
//           <CardContent>
//             <Instagram className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//             <h3 className="text-lg font-semibold mb-2">No Workflow Requests</h3>
//             <p className="text-muted-foreground mb-4">
//               No Instagram automation workflows have been submitted yet.
//             </p>
//             <p className="text-sm text-muted-foreground">
//               Workflow requests will appear here when customers submit them through the workflow builder.
//             </p>
//           </CardContent>
//         </Card>
//       )}

//       {/* Requests List */}
//       <div className="space-y-6">
//         {requests.map((request) => {
//           const config = statusConfig[request.status]
//           const urgencyConf = urgencyConfig[request.urgency]
//           const hasWorkflowDesign = request.workflowDesign && request.workflowDesign.integrations

//           return (
//             <Card key={request.id} className="relative overflow-hidden">
//               <CardHeader>
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-3 mb-2">
//                       <CardTitle className="text-xl">{request.title}</CardTitle>
//                       <Badge className={config.color}>{config.label}</Badge>
//                       <Badge className={urgencyConf.color}>{urgencyConf.label}</Badge>
//                       {hasWorkflowDesign && (
//                         <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
//                           <Star className="h-3 w-3 mr-1" />
//                           DeepSeek AI Generated
//                         </Badge>
//                       )}
//                     </div>
//                     <CardDescription className="text-base">{request.businessObjective}</CardDescription>
//                   </div>
//                   <div className="flex gap-2">
//                     {hasWorkflowDesign && (
//                       <Button variant="outline" size="sm" onClick={() => openWorkflowViewer(request)}>
//                         <Eye className="h-4 w-4 mr-2" />
//                         View Workflow Design
//                       </Button>
//                     )}
//                     <Button variant="outline" size="sm" onClick={() => openUpdateDialog(request)}>
//                       <Edit className="h-4 w-4 mr-2" />
//                       Update Status
//                     </Button>
//                   </div>
//                 </div>
//               </CardHeader>

//               <CardContent className="space-y-6">
//                 {/* Business Information */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
//                   <div className="flex items-center gap-2">
//                     <Building className="h-4 w-4 text-muted-foreground" />
//                     <div>
//                       <p className="text-xs text-muted-foreground">Business</p>
//                       <p className="text-sm font-medium">{request.businessInfo.businessName}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <User className="h-4 w-4 text-muted-foreground" />
//                     <div>
//                       <p className="text-xs text-muted-foreground">Industry</p>
//                       <p className="text-sm font-medium">{request.businessInfo.businessType}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Mail className="h-4 w-4 text-muted-foreground" />
//                     <div>
//                       <p className="text-xs text-muted-foreground">Contact</p>
//                       <p className="text-sm font-medium">{request.user.email}</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* AI Workflow Design Summary */}
//                 {hasWorkflowDesign && (
//                   <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg border border-pink-200 dark:border-pink-700">
//                     <h4 className="font-semibold mb-3 flex items-center gap-2 text-pink-800 dark:text-pink-300">
//                       <Instagram className="h-4 w-4" />
//                       AI-Generated Instagram Workflow ({request.workflowDesign?.steps?.length} steps)
//                     </h4>
//                     <p className="text-sm text-pink-700 dark:text-pink-400 mb-4">
//                       {request.workflowDesign?.description}
//                     </p>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
//                       {request.workflowDesign?.metrics && (
//                         <>
//                           <div className="text-center">
//                             <p className="text-lg font-bold text-pink-600">
//                               {request.workflowDesign?.metrics.automationRate}
//                             </p>
//                             <p className="text-xs text-muted-foreground">Automation Rate</p>
//                           </div>
//                           <div className="text-center">
//                             <p className="text-lg font-bold text-green-600">
//                               {request.workflowDesign?.metrics.responseTime}
//                             </p>
//                             <p className="text-xs text-muted-foreground">Response Time</p>
//                           </div>
//                           <div className="text-center">
//                             <p className="text-lg font-bold text-purple-600">
//                               {request.workflowDesign?.metrics.accuracy}
//                             </p>
//                             <p className="text-xs text-muted-foreground">AI Accuracy</p>
//                           </div>
//                           <div className="text-center">
//                             <p className="text-lg font-bold text-orange-600">
//                               {request.workflowDesign?.complexity}
//                             </p>
//                             <p className="text-xs text-muted-foreground">Complexity</p>
//                           </div>
//                         </>
//                       )}
//                     </div>

//                     {/* Selected Goals */}
//                     {request.workflowDesign?.selectedGoals && (
//                       <div className="mb-4">
//                         <p className="text-sm font-medium mb-2">Instagram Automation Goals:</p>
//                         <div className="flex flex-wrap gap-2">
//                           {request.workflowDesign.selectedGoals.map((goal) => (
//                             <Badge key={goal.id} variant="secondary" className="text-xs bg-pink-100 text-pink-700">
//                               {goal.label}
//                             </Badge>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {/* Integrations */}
//                     {request.workflowDesign?.integrations && (
//                       <div>
//                         <p className="text-sm font-medium mb-2">Required Integrations:</p>
//                         <div className="flex flex-wrap gap-2">
//                           {request.workflowDesign?.integrations.map((integration) => (
//                             <Badge key={integration.id} variant="outline" className="text-xs">
//                               {integration.name}
//                             </Badge>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Custom Request Details */}
//                 {request.workflowDesign?.customRequest && (
//                   <div className="p-4 bg-muted/30 rounded-lg">
//                     <h4 className="font-semibold mb-2 flex items-center gap-2">
//                       <MessageCircle className="h-4 w-4" />
//                       Original Customer Request
//                     </h4>
//                     <p className="text-sm text-muted-foreground whitespace-pre-wrap">
//                       {request.workflowDesign.customRequest}
//                     </p>
//                   </div>
//                 )}

//                 {/* Cost and ROI */}
//                 {(request.workflowDesign?.estimatedCost || request.workflowDesign?.roi) && (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {request.workflowDesign.estimatedCost && (
//                       <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
//                         <div className="flex items-center gap-2 mb-1">
//                           <TrendingUp className="h-4 w-4 text-green-600" />
//                           <span className="text-sm font-medium">Estimated Cost</span>
//                         </div>
//                         <p className="text-lg font-bold text-green-700">
//                           {request.workflowDesign.estimatedCost}
//                         </p>
//                       </div>
//                     )}
//                     {request.workflowDesign.roi && (
//                       <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
//                         <div className="flex items-center gap-2 mb-1">
//                           <Star className="h-4 w-4 text-blue-600" />
//                           <span className="text-sm font-medium">Expected ROI</span>
//                         </div>
//                         <p className="text-lg font-bold text-blue-700">
//                           {request.workflowDesign.roi}
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Development Notes */}
//                 {request.developmentNotes && (
//                   <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
//                     <h4 className="text-sm font-medium mb-2 text-blue-800 dark:text-blue-300">Development Notes</h4>
//                     <p className="text-sm text-blue-700 dark:text-blue-400">{request.developmentNotes}</p>
//                   </div>
//                 )}

//                 {/* Request Details */}
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
//                   <div className="flex items-center gap-2">
//                     <User className="h-4 w-4 text-muted-foreground" />
//                     <div>
//                       <p className="text-xs text-muted-foreground">Requested by</p>
//                       <p className="text-sm font-medium">
//                         {request.user.firstname} {request.user.lastname}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <Calendar className="h-4 w-4 text-muted-foreground" />
//                     <div>
//                       <p className="text-xs text-muted-foreground">Submitted</p>
//                       <p className="text-sm font-medium">{new Date(request.createdAt).toLocaleDateString()}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <Workflow className="h-4 w-4 text-muted-foreground" />
//                     <div>
//                       <p className="text-xs text-muted-foreground">Build Time</p>
//                       <p className="text-sm font-medium">{request.workflowDesign?.estimatedBuildTime || "TBD"}</p>
//                     </div>
//                   </div>

//                   {request.estimatedDelivery && (
//                     <div className="flex items-center gap-2">
//                       <Clock className="h-4 w-4 text-muted-foreground" />
//                       <div>
//                         <p className="text-xs text-muted-foreground">Est. Delivery</p>
//                         <p className="text-sm font-medium">
//                           {new Date(request.estimatedDelivery).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           )
//         })}
//       </div>

//       {/* Update Dialog */}
//       <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
//         <DialogContent className="max-w-md">
//           <DialogHeader>
//             <DialogTitle>Update Request Status</DialogTitle>
//             <DialogDescription>
//               Update the status and add development notes for this workflow request.
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4">
//             <div>
//               <Label htmlFor="status">Status</Label>
//               <Select
//                 value={updateForm.status}
//                 onValueChange={(value) => setUpdateForm({ ...updateForm, status: value })}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {(Object.keys(statusConfig) as WorkflowStatus[]).map((statusKey) => (
//                     <SelectItem key={statusKey} value={statusKey}>
//                       {statusConfig[statusKey].label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label htmlFor="estimatedDelivery">Estimated Delivery Date</Label>
//               <Input
//                 id="estimatedDelivery"
//                 type="date"
//                 value={updateForm.estimatedDelivery}
//                 onChange={(e) => setUpdateForm({ ...updateForm, estimatedDelivery: e.target.value })}
//               />
//             </div>

//             <div>
//               <Label htmlFor="developmentNotes">Development Notes</Label>
//               <Textarea
//                 id="developmentNotes"
//                 placeholder="Add notes about the development progress..."
//                 value={updateForm.developmentNotes}
//                 onChange={(e) => setUpdateForm({ ...updateForm, developmentNotes: e.target.value })}
//                 rows={4}
//               />
//             </div>
//           </div>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleUpdateRequest}>Update Request</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }

// export default AdminWorkflowRequestsDashboard
