// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import {
//   CheckCircle,
//   Clock,
//   AlertCircle,
//   MessageSquare,
//   User,
//   Calendar,
//   RefreshCw,
//   Eye,
//   Edit,
//   Loader2,
//   Star,
//   TrendingUp,
//   Zap,
//   Building,
//   Mail,
//   ChevronDown,
//   ChevronRight,
//   Brain,
//   Layers,
//   Activity,
//   Settings,
//   Plus,
//   Globe,
//   Lock,
//   Sparkles,
//   GitBranch,
//   Database,
//   Filter,
//   MessageCircle,
//   Bell,
//   Shield,
//   Bot,
//   PlayCircle,
//   Timer,
//   Puzzle,
//   Wand2,
// } from "lucide-react"

// interface WorkflowRequest {
//   id: string
//   title: string
//   businessObjective: string
//   processDescription: string
//   requiredIntegrations: string[]
//   budget?: number
//   urgency: "LOW" | "NORMAL" | "HIGH" | "CRITICAL"
//   status:
//     | "SUBMITTED"
//     | "UNDER_REVIEW"
//     | "APPROVED"
//     | "IN_DEVELOPMENT"
//     | "READY_FOR_TESTING"
//     | "COMPLETED"
//     | "REJECTED"
//     | "CANCELED"
//   developmentNotes?: string
//   estimatedDelivery?: string
//   actualDelivery?: string
//   createdAt: string
//   updatedAt: string
//   user: {
//     id: string
//     firstname: string
//     lastname: string
//     email: string
//   }
//   completedTemplate?: {
//     id: string
//     name: string
//     description: string
//     isPublic: boolean
//     isActive: boolean
//   }
//   // AI-generated workflow design stored in aiSuggestions
//   aiSuggestions?: {
//     workflowDesign?: {
//       title: string
//       description: string
//       platform: string
//       estimatedBuildTime: string
//       complexity: string
//       steps: WorkflowStep[]
//       integrations: Integration[]
//       benefits: string[]
//       exampleScenario: string
//       technicalRequirements: string[]
//       deploymentChannels: string[]
//       estimatedCost?: string
//       roi?: string
//       metrics?: {
//         automationRate: string
//         responseTime: string
//         accuracy: string
//         scalability: string
//       }
//     }
//     businessInfo?: any
//     selectedChannels?: string[]
//     automationFeatures?: string[]
//     customRequest?: string
//     estimatedCost?: string
//     roi?: string
//   }
// }

// interface WorkflowStep {
//   id: string
//   stepNumber: number
//   title: string
//   description: string
//   type: string
//   inputs?: string[]
//   outputs?: string[]
//   estimatedTime?: string
//   details?: string[]
//   complexity?: "low" | "medium" | "high"
//   businessImpact?: string
//   aiReasoning?: string
//   selectedIntegrations?: Integration[]
// }

// interface Integration {
//   id: string
//   name: string
//   description: string
//   category: string
//   pricing: string
//   popularity: number
//   difficulty: string
//   features: string[]
//   setupTime: string
// }

// interface WorkflowTemplate {
//   id: string
//   name: string
//   category: string
//   description: string
//   complexity: string
//   isPublic: boolean
//   isActive: boolean
//   createdByAdmin: boolean
//   originalRequestId?: string
//   _count: {
//     businessConfigs: number
//   }
// }

// const statusConfig = {
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
// }

// const urgencyConfig = {
//   LOW: { label: "Low", color: "bg-gray-100 text-gray-800" },
//   NORMAL: { label: "Normal", color: "bg-blue-100 text-blue-800" },
//   HIGH: { label: "High", color: "bg-orange-100 text-orange-800" },
//   CRITICAL: { label: "Critical", color: "bg-red-100 text-red-800" },
// }

// const stepTypeConfigs: Record<string, any> = {
//   trigger: {
//     icon: PlayCircle,
//     color: "text-emerald-600",
//     bgColor: "from-emerald-50 to-green-100",
//     borderColor: "border-emerald-300",
//     accentColor: "bg-emerald-500",
//   },
//   analysis: {
//     icon: Brain,
//     color: "text-purple-600",
//     bgColor: "from-purple-50 to-violet-100",
//     borderColor: "border-purple-300",
//     accentColor: "bg-purple-500",
//   },
//   filter: {
//     icon: Filter,
//     color: "text-blue-600",
//     bgColor: "from-blue-50 to-cyan-100",
//     borderColor: "border-blue-300",
//     accentColor: "bg-blue-500",
//   },
//   response: {
//     icon: MessageCircle,
//     color: "text-orange-600",
//     bgColor: "from-orange-50 to-amber-100",
//     borderColor: "border-orange-300",
//     accentColor: "bg-orange-500",
//   },
//   notification: {
//     icon: Bell,
//     color: "text-red-600",
//     bgColor: "from-red-50 to-pink-100",
//     borderColor: "border-red-300",
//     accentColor: "bg-red-500",
//   },
//   integration: {
//     icon: Zap,
//     color: "text-yellow-600",
//     bgColor: "from-yellow-50 to-orange-100",
//     borderColor: "border-yellow-300",
//     accentColor: "bg-yellow-500",
//   },
//   storage: {
//     icon: Database,
//     color: "text-gray-600",
//     bgColor: "from-gray-50 to-slate-100",
//     borderColor: "border-gray-300",
//     accentColor: "bg-gray-500",
//   },
//   routing: {
//     icon: GitBranch,
//     color: "text-indigo-600",
//     bgColor: "from-indigo-50 to-blue-100",
//     borderColor: "border-indigo-300",
//     accentColor: "bg-indigo-500",
//   },
//   validation: {
//     icon: Shield,
//     color: "text-cyan-600",
//     bgColor: "from-cyan-50 to-teal-100",
//     borderColor: "border-cyan-300",
//     accentColor: "bg-cyan-500",
//   },
//   automation: {
//     icon: Bot,
//     color: "text-pink-600",
//     bgColor: "from-pink-50 to-rose-100",
//     borderColor: "border-pink-300",
//     accentColor: "bg-pink-500",
//   },
// }

// export default function AdminWorkflowRequestsDashboard() {
//   const [requests, setRequests] = useState<WorkflowRequest[]>([])
//   const [templates, setTemplates] = useState<WorkflowTemplate[]>([])
//   const [loading, setLoading] = useState(true)
//   const [refreshing, setRefreshing] = useState(false)
//   const [selectedRequest, setSelectedRequest] = useState<WorkflowRequest | null>(null)
//   const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
//   const [isWorkflowViewOpen, setIsWorkflowViewOpen] = useState(false)
//   const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
//   const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set())
//   const [activeTab, setActiveTab] = useState("requests")

//   const [updateForm, setUpdateForm] = useState({
//     status: "",
//     developmentNotes: "",
//     estimatedDelivery: "",
//   })

//   const [templateForm, setTemplateForm] = useState({
//     name: "",
//     category: "CUSTOM",
//     description: "",
//     complexity: "MEDIUM",
//     isPublic: false,
//     operations: [] as string[],
//     features: [] as string[],
//     integrations: [] as string[],
//     voiceflowProjectId: "",
//     voiceflowVersionId: "",
//   })

//   useEffect(() => {
//     fetchRequests()
//     fetchTemplates()
//   }, [])

//   const fetchRequests = async () => {
//     try {
//       setRefreshing(true)
//       const response = await fetch("/api/admin/workflow-requests")
//       const data = await response.json()
//       setRequests(data.requests || [])
//     } catch (error) {
//       console.error("Error fetching requests:", error)
//     } finally {
//       setLoading(false)
//       setRefreshing(false)
//     }
//   }

//   const fetchTemplates = async () => {
//     try {
//       const response = await fetch("/api/admin/workflow-templates")
//       const data = await response.json()
//       setTemplates(data.templates || [])
//     } catch (error) {
//       console.error("Error fetching templates:", error)
//     }
//   }

//   const handleUpdateRequest = async () => {
//     if (!selectedRequest) return

//     try {
//       const response = await fetch(`/api/admin/workflow-requests/${selectedRequest.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updateForm),
//       })

//       if (response.ok) {
//         await fetchRequests()
//         setIsUpdateDialogOpen(false)
//         setSelectedRequest(null)
//         setUpdateForm({ status: "", developmentNotes: "", estimatedDelivery: "" })
//       }
//     } catch (error) {
//       console.error("Error updating request:", error)
//     }
//   }

//   const handleCreateTemplate = async () => {
//     if (!selectedRequest?.aiSuggestions?.workflowDesign) return

//     try {
//       const workflowDesign = selectedRequest.aiSuggestions.workflowDesign

//       const templateData = {
//         ...templateForm,
//         originalRequestId: selectedRequest.id,
//         operations: workflowDesign.steps?.map((step) => step.title) || [],
//         features: workflowDesign.benefits || [],
//         integrations: workflowDesign.integrations?.map((int) => int.name) || [],
//         createdByAdmin: true,
//       }

//       const response = await fetch("/api/admin/workflow-templates", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(templateData),
//       })

//       if (response.ok) {
//         await fetchRequests()
//         await fetchTemplates()
//         setIsTemplateDialogOpen(false)
//         setSelectedRequest(null)
//         setTemplateForm({
//           name: "",
//           category: "CUSTOM",
//           description: "",
//           complexity: "MEDIUM",
//           isPublic: false,
//           operations: [],
//           features: [],
//           integrations: [],
//           voiceflowProjectId: "",
//           voiceflowVersionId: "",
//         })
//       }
//     } catch (error) {
//       console.error("Error creating template:", error)
//     }
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

//   const openWorkflowView = (request: WorkflowRequest) => {
//     setSelectedRequest(request)
//     setIsWorkflowViewOpen(true)
//     setExpandedSteps(new Set())
//   }

//   const openTemplateDialog = (request: WorkflowRequest) => {
//     setSelectedRequest(request)
//     const workflowDesign = request.aiSuggestions?.workflowDesign
//     setTemplateForm({
//       name: workflowDesign?.title || request.title,
//       category: "CUSTOM",
//       description: workflowDesign?.description || request.businessObjective,
//       complexity: workflowDesign?.complexity || "MEDIUM",
//       isPublic: false,
//       operations: workflowDesign?.steps?.map((step) => step.title) || [],
//       features: workflowDesign?.benefits || [],
//       integrations: workflowDesign?.integrations?.map((int) => int.name) || [],
//       voiceflowProjectId: "",
//       voiceflowVersionId: "",
//     })
//     setIsTemplateDialogOpen(true)
//   }

//   const toggleStepExpansion = (stepNumber: number) => {
//     setExpandedSteps((prev) => {
//       const newSet = new Set(prev)
//       if (newSet.has(stepNumber)) {
//         newSet.delete(stepNumber)
//       } else {
//         newSet.add(stepNumber)
//       }
//       return newSet
//     })
//   }

//   const WorkflowStepComponent = ({ step }: { step: WorkflowStep }) => {
//     const config = stepTypeConfigs[step.type] || stepTypeConfigs.automation
//     const IconComponent = config.icon
//     const isExpanded = expandedSteps.has(step.stepNumber)

//     return (
//       <div className="relative">
//         <div
//           className={`rounded-xl border-2 transition-all duration-300 cursor-pointer bg-gradient-to-br ${
//             config.bgColor
//           } ${config.borderColor} ${
//             isExpanded
//               ? "shadow-xl scale-[1.02] border-opacity-100"
//               : "hover:shadow-lg hover:scale-[1.01] border-opacity-60"
//           }`}
//           onClick={() => toggleStepExpansion(step.stepNumber)}
//         >
//           <div className="p-6">
//             <div className="flex items-center gap-4">
//               <div className="relative">
//                 <div
//                   className={`w-16 h-16 ${config.accentColor} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-xl`}
//                 >
//                   {step.stepNumber}
//                 </div>
//                 <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
//                   <IconComponent className={`h-4 w-4 ${config.color}`} />
//                 </div>
//               </div>

//               <div className="flex-grow">
//                 <div className="flex items-center gap-3 mb-3">
//                   <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">{step.title}</h4>
//                   <Badge variant="outline" className="text-xs font-medium">
//                     {step.type}
//                   </Badge>
//                   {step.complexity && (
//                     <Badge
//                       variant="secondary"
//                       className={`text-xs ${
//                         step.complexity === "high"
//                           ? "bg-red-100 text-red-700"
//                           : step.complexity === "medium"
//                             ? "bg-yellow-100 text-yellow-700"
//                             : "bg-green-100 text-green-700"
//                       }`}
//                     >
//                       {step.complexity} complexity
//                     </Badge>
//                   )}
//                   {step.estimatedTime && (
//                     <Badge variant="secondary" className="text-xs">
//                       <Timer className="h-3 w-3 mr-1" />
//                       {step.estimatedTime}
//                     </Badge>
//                   )}
//                 </div>
//                 <p className="text-muted-foreground mb-3 leading-relaxed">{step.description}</p>

//                 <div className="flex items-center gap-6 text-sm">
//                   {step.inputs && (
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
//                       <span className="text-green-700 dark:text-green-300 font-medium">
//                         Input: {step.inputs.join(", ")}
//                       </span>
//                     </div>
//                   )}
//                   {step.outputs && (
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
//                       <span className="text-blue-700 dark:text-blue-300 font-medium">
//                         Output: {step.outputs.join(", ")}
//                       </span>
//                     </div>
//                   )}
//                 </div>

//                 {step.selectedIntegrations && step.selectedIntegrations.length > 0 && (
//                   <div className="mt-3 flex items-center gap-2">
//                     <Zap className="h-4 w-4 text-purple-500" />
//                     <span className="text-sm text-purple-700 dark:text-purple-300 font-medium">
//                       Integrations: {step.selectedIntegrations.map((i) => i.name).join(", ")}
//                     </span>
//                   </div>
//                 )}
//               </div>

//               <div className="flex items-center">
//                 {isExpanded ? (
//                   <ChevronDown className="h-6 w-6 text-muted-foreground" />
//                 ) : (
//                   <ChevronRight className="h-6 w-6 text-muted-foreground" />
//                 )}
//               </div>
//             </div>
//           </div>

//           {isExpanded && (
//             <div className="border-t border-white/50 bg-white/30 dark:bg-black/10 p-6">
//               {step.aiReasoning && (
//                 <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
//                   <h6 className="font-semibold mb-2 flex items-center gap-2 text-purple-700 dark:text-purple-300">
//                     <Brain className="h-4 w-4" />
//                     AI Reasoning
//                   </h6>
//                   <p className="text-sm text-purple-600 dark:text-purple-400">{step.aiReasoning}</p>
//                 </div>
//               )}

//               <div className="grid lg:grid-cols-3 gap-6">
//                 <div>
//                   <h5 className="font-semibold mb-3 flex items-center gap-2">
//                     <Layers className="h-4 w-4 text-blue-500" />
//                     Implementation Details
//                   </h5>
//                   <ul className="space-y-2 text-sm text-muted-foreground">
//                     {step.details?.map((detail, idx) => (
//                       <li key={idx} className="flex items-start gap-2">
//                         <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
//                         <span>{detail}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>

//                 <div>
//                   <h5 className="font-semibold mb-3 flex items-center gap-2">
//                     <Activity className="h-4 w-4 text-green-500" />
//                     Performance & Impact
//                   </h5>
//                   <div className="space-y-3 text-sm">
//                     <div className="flex justify-between items-center">
//                       <span className="text-muted-foreground">Execution Time:</span>
//                       <Badge variant="secondary">{step.estimatedTime}</Badge>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-muted-foreground">Business Impact:</span>
//                       <Badge variant="secondary" className="text-green-600">
//                         High
//                       </Badge>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-muted-foreground">Reliability:</span>
//                       <Badge variant="secondary" className="text-blue-600">
//                         99.9%
//                       </Badge>
//                     </div>
//                     {step.businessImpact && (
//                       <p className="text-xs text-muted-foreground mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
//                         {step.businessImpact}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <h5 className="font-semibold mb-3 flex items-center gap-2">
//                     <Settings className="h-4 w-4 text-orange-500" />
//                     Required Integrations
//                   </h5>
//                   <div className="space-y-2 text-sm">
//                     {step.selectedIntegrations?.map((integration, idx) => (
//                       <div key={idx} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
//                         <Puzzle className="h-3 w-3 text-purple-500" />
//                         <span className="font-medium">{integration.name}</span>
//                         <Badge variant="outline" className="text-xs ml-auto">
//                           {integration.pricing}
//                         </Badge>
//                       </div>
//                     )) || <p className="text-muted-foreground text-xs">No specific integrations required</p>}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {step.stepNumber < (selectedRequest?.aiSuggestions?.workflowDesign?.steps?.length || 1) && (
//           <div className="flex justify-center my-6">
//             <div className="relative">
//               <div className="w-px h-12 bg-gradient-to-b from-gray-300 via-blue-300 to-gray-100 dark:from-gray-600 dark:via-blue-600 dark:to-gray-800"></div>
//               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
//             </div>
//           </div>
//         )}
//       </div>
//     )
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center p-8">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-3xl font-bold">Workflow Requests Dashboard</h2>
//           <p className="text-muted-foreground">Manage and track custom workflow development requests</p>
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
//               <MessageSquare className="h-4 w-4 text-blue-500" />
//               <span className="text-sm font-medium">Total Requests</span>
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
//               <AlertCircle className="h-4 w-4 text-red-500" />
//               <span className="text-sm font-medium">Pending Review</span>
//             </div>
//             <p className="text-2xl font-bold mt-2">
//               {requests.filter((r) => r.status === "SUBMITTED" || r.status === "UNDER_REVIEW").length}
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Main Content Tabs */}
//       <Tabs value={activeTab} onValueChange={setActiveTab}>
//         <TabsList className="grid w-full grid-cols-2">
//           <TabsTrigger value="requests">Workflow Requests</TabsTrigger>
//           <TabsTrigger value="templates">Created Templates</TabsTrigger>
//         </TabsList>

//         <TabsContent value="requests" className="space-y-4">
//           {/* Requests List */}
//           {requests.length === 0 ? (
//             <Card>
//               <CardContent className="p-8 text-center">
//                 <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                 <h3 className="text-lg font-semibold mb-2">No Workflow Requests</h3>
//                 <p className="text-muted-foreground">No custom workflow requests have been submitted yet.</p>
//               </CardContent>
//             </Card>
//           ) : (
//             requests.map((request) => {
//               const config = statusConfig[request.status]
//               const urgencyConf = urgencyConfig[request.urgency]
//               const StatusIcon = config.icon
//               const hasWorkflowDesign = request.aiSuggestions?.workflowDesign

//               return (
//                 <Card key={request.id} className="relative overflow-hidden">
//                   <CardHeader>
//                     <div className="flex items-start justify-between">
//                       <div className="flex-1">
//                         <div className="flex items-center gap-3 mb-2">
//                           <CardTitle className="text-xl">{request.title}</CardTitle>
//                           <Badge className={config.color}>{config.label}</Badge>
//                           <Badge className={urgencyConf.color}>{urgencyConf.label}</Badge>
//                           {hasWorkflowDesign && (
//                             <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
//                               <Star className="h-3 w-3 mr-1" />
//                               AI Generated
//                             </Badge>
//                           )}
//                         </div>
//                         <CardDescription className="text-base">{request.businessObjective}</CardDescription>
//                       </div>
//                       <div className="flex gap-2">
//                         {hasWorkflowDesign && (
//                           <Button variant="outline" size="sm" onClick={() => openWorkflowView(request)}>
//                             <Eye className="h-4 w-4 mr-2" />
//                             View Design
//                           </Button>
//                         )}
//                         <Button variant="outline" size="sm" onClick={() => openUpdateDialog(request)}>
//                           <Edit className="h-4 w-4 mr-2" />
//                           Update
//                         </Button>
//                       </div>
//                     </div>
//                   </CardHeader>

//                   <CardContent className="space-y-6">
//                     {/* Business Information */}
//                     {request.aiSuggestions?.businessInfo && (
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
//                         <div className="flex items-center gap-2">
//                           <Building className="h-4 w-4 text-muted-foreground" />
//                           <div>
//                             <p className="text-xs text-muted-foreground">Business</p>
//                             <p className="text-sm font-medium">{request.aiSuggestions.businessInfo.businessName}</p>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <User className="h-4 w-4 text-muted-foreground" />
//                           <div>
//                             <p className="text-xs text-muted-foreground">Industry</p>
//                             <p className="text-sm font-medium">{request.aiSuggestions.businessInfo.businessType}</p>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Mail className="h-4 w-4 text-muted-foreground" />
//                           <div>
//                             <p className="text-xs text-muted-foreground">Contact</p>
//                             <p className="text-sm font-medium">{request.user.email}</p>
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                    {/* AI Workflow Design Summary */}
//                       {hasWorkflowDesign && request.aiSuggestions?.workflowDesign && (
//                         <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
//                           <h4 className="font-semibold mb-3 flex items-center gap-2 text-blue-800 dark:text-blue-300">
//                             <Zap className="h-4 w-4" />
//                             AI-Generated Workflow Design
//                           </h4>
//                           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
//                             {request.aiSuggestions.workflowDesign.metrics && (
//                               <>
//                                 <div className="text-center">
//                                   <p className="text-lg font-bold text-blue-600">
//                                     {request.aiSuggestions.workflowDesign.metrics.automationRate}
//                                   </p>
//                                   <p className="text-xs text-muted-foreground">Automation Rate</p>
//                                 </div>
//                                 <div className="text-center">
//                                   <p className="text-lg font-bold text-green-600">
//                                     {request.aiSuggestions.workflowDesign.metrics.responseTime}
//                                   </p>
//                                   <p className="text-xs text-muted-foreground">Response Time</p>
//                                 </div>
//                                 <div className="text-center">
//                                   <p className="text-lg font-bold text-purple-600">
//                                     {request.aiSuggestions.workflowDesign.metrics.accuracy}
//                                   </p>
//                                   <p className="text-xs text-muted-foreground">AI Accuracy</p>
//                                 </div>
//                                 <div className="text-center">
//                                   <p className="text-lg font-bold text-orange-600">
//                                     {request.aiSuggestions.workflowDesign.complexity}
//                                   </p>
//                                   <p className="text-xs text-muted-foreground">Complexity</p>
//                                 </div>
//                               </>
//                             )}
//                           </div>
//                           {request.aiSuggestions.workflowDesign.steps &&
//                             request.aiSuggestions.workflowDesign.steps.length > 0 && (
//                               <div>
//                                 <p className="text-sm font-medium mb-2">
//                                   Workflow Steps ({request.aiSuggestions.workflowDesign.steps.length}):
//                                 </p>
//                                 <div className="flex flex-wrap gap-2">
//                                   {request.aiSuggestions.workflowDesign.steps
//                                     .slice(0, 3)
//                                     .map((step: any, idx: number) => (
//                                       <Badge key={idx} variant="secondary" className="text-xs">
//                                         {step.title}
//                                       </Badge>
//                                     ))}
//                                   {request.aiSuggestions.workflowDesign.steps.length > 3 && (
//                                     <Badge variant="outline" className="text-xs">
//                                       +{request.aiSuggestions.workflowDesign.steps.length - 3} more
//                                     </Badge>
//                                   )}
//                                 </div>
//                               </div>
//                             )}
//                         </div>
//                       )}

//                       {/* Custom Request Details */}
//                       {request.aiSuggestions?.customRequest && (
//                         <div className="p-4 bg-muted/30 rounded-lg">
//                           <h4 className="font-semibold mb-2">Custom Requirements</h4>
//                           <p className="text-sm text-muted-foreground whitespace-pre-wrap">
//                             {request.aiSuggestions.customRequest}
//                           </p>
//                         </div>
//                       )}

//                       {/* Platforms and Features */}
//                       {(request.aiSuggestions?.selectedChannels?.length ||
//                         request.aiSuggestions?.automationFeatures?.length) && (
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           {request.aiSuggestions?.selectedChannels?.length && (
//                             <div>
//                               <h4 className="font-semibold mb-2 text-sm">Selected Platforms</h4>
//                               <div className="flex flex-wrap gap-2">
//                                 {request.aiSuggestions.selectedChannels.map((channel) => (
//                                   <Badge key={channel} variant="outline" className="text-xs">
//                                     {channel}
//                                   </Badge>
//                                 ))}
//                               </div>
//                             </div>
//                           )}
//                           {request.aiSuggestions?.automationFeatures?.length && (
//                             <div>
//                               <h4 className="font-semibold mb-2 text-sm">AI Features</h4>
//                               <div className="flex flex-wrap gap-2">
//                                 {request.aiSuggestions.automationFeatures.map((feature) => (
//                                   <Badge key={feature} variant="outline" className="text-xs">
//                                     {feature}
//                                   </Badge>
//                                 ))}
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       )}

//                     {/* Cost and ROI */}
//                     {(request.aiSuggestions?.workflowDesign?.estimatedCost ||
//                       request.aiSuggestions?.workflowDesign?.roi) && (
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {request.aiSuggestions.workflowDesign.estimatedCost && (
//                           <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
//                             <div className="flex items-center gap-2 mb-1">
//                               <TrendingUp className="h-4 w-4 text-green-600" />
//                               <span className="text-sm font-medium">Estimated Cost</span>
//                             </div>
//                             <p className="text-lg font-bold text-green-700">
//                               {request.aiSuggestions.workflowDesign.estimatedCost}
//                             </p>
//                           </div>
//                         )}
//                         {request.aiSuggestions.workflowDesign.roi && (
//                           <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
//                             <div className="flex items-center gap-2 mb-1">
//                               <Star className="h-4 w-4 text-blue-600" />
//                               <span className="text-sm font-medium">Expected ROI</span>
//                             </div>
//                             <p className="text-lg font-bold text-blue-700">
//                               {request.aiSuggestions.workflowDesign.roi}
//                             </p>
//                           </div>
//                         )}
//                       </div>
//                     )}

//                     {/* Development Notes */}
//                     {request.developmentNotes && (
//                       <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
//                         <h4 className="text-sm font-medium mb-2 text-blue-800 dark:text-blue-300">Development Notes</h4>
//                         <p className="text-sm text-blue-700 dark:text-blue-400">{request.developmentNotes}</p>
//                       </div>
//                     )}

//                     {/* Template Creation */}
//                     {hasWorkflowDesign && request.status === "IN_DEVELOPMENT" && !request.completedTemplate && (
//                       <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-700">
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <h4 className="font-semibold mb-1 text-green-800 dark:text-green-300">
//                               Ready to Create Template?
//                             </h4>
//                             <p className="text-sm text-green-700 dark:text-green-400">
//                               Convert this AI-generated workflow into a reusable template for users.
//                             </p>
//                           </div>
//                           <Button
//                             onClick={() => openTemplateDialog(request)}
//                             className="bg-green-600 hover:bg-green-700"
//                           >
//                             <Plus className="h-4 w-4 mr-2" />
//                             Create Template
//                           </Button>
//                         </div>
//                       </div>
//                     )}

//                     {/* Completed Template Info */}
//                     {request.completedTemplate && (
//                       <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700">
//                         <div className="flex items-center gap-2 mb-2">
//                           <CheckCircle className="h-5 w-5 text-emerald-600" />
//                           <h4 className="font-semibold text-emerald-800 dark:text-emerald-300">Template Created!</h4>
//                         </div>
//                         <p className="text-sm text-emerald-700 dark:text-emerald-400 mb-2">
//                           Template &ldquo;{request.completedTemplate.name}&rdquo; has been created and is{" "}
//                           {request.completedTemplate.isPublic ? "publicly available" : "private to this user"}.
//                         </p>
//                         <div className="flex items-center gap-2">
//                           <Badge variant="outline" className="text-xs">
//                             {request.completedTemplate.isPublic ? (
//                               <>
//                                 <Globe className="h-3 w-3 mr-1" />
//                                 Public
//                               </>
//                             ) : (
//                               <>
//                                 <Lock className="h-3 w-3 mr-1" />
//                                 Private
//                               </>
//                             )}
//                           </Badge>
//                           <Badge variant="outline" className="text-xs">
//                             {request.completedTemplate.isActive ? "Active" : "Inactive"}
//                           </Badge>
//                         </div>
//                       </div>
//                     )}

//                     {/* Request Details */}
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
//                       <div className="flex items-center gap-2">
//                         <User className="h-4 w-4 text-muted-foreground" />
//                         <div>
//                           <p className="text-xs text-muted-foreground">Requested by</p>
//                           <p className="text-sm font-medium">
//                             {request.user.firstname} {request.user.lastname}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="flex items-center gap-2">
//                         <Calendar className="h-4 w-4 text-muted-foreground" />
//                         <div>
//                           <p className="text-xs text-muted-foreground">Submitted</p>
//                           <p className="text-sm font-medium">{new Date(request.createdAt).toLocaleDateString()}</p>
//                         </div>
//                       </div>

//                       {request.budget && (
//                         <div className="flex items-center gap-2">
//                           <TrendingUp className="h-4 w-4 text-muted-foreground" />
//                           <div>
//                             <p className="text-xs text-muted-foreground">Budget</p>
//                             <p className="text-sm font-medium">${request.budget.toLocaleString()}</p>
//                           </div>
//                         </div>
//                       )}

//                       {request.estimatedDelivery && (
//                         <div className="flex items-center gap-2">
//                           <Clock className="h-4 w-4 text-muted-foreground" />
//                           <div>
//                             <p className="text-xs text-muted-foreground">Est. Delivery</p>
//                             <p className="text-sm font-medium">
//                               {new Date(request.estimatedDelivery).toLocaleDateString()}
//                             </p>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </CardContent>
//                 </Card>
//               )
//             })
//           )}
//         </TabsContent>

//         <TabsContent value="templates" className="space-y-4">
//           {/* Templates Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {templates.length === 0 ? (
//               <div className="col-span-full">
//                 <Card>
//                   <CardContent className="p-8 text-center">
//                     <Wand2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                     <h3 className="text-lg font-semibold mb-2">No Templates Created</h3>
//                     <p className="text-muted-foreground">Templates created from workflow requests will appear here.</p>
//                   </CardContent>
//                 </Card>
//               </div>
//             ) : (
//               templates.map((template) => (
//                 <Card key={template.id} className="relative">
//                   <CardHeader>
//                     <div className="flex items-start justify-between">
//                       <div>
//                         <CardTitle className="text-lg">{template.name}</CardTitle>
//                         <CardDescription className="mt-1">
//                           {template.category} • {template.complexity}
//                         </CardDescription>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         {template.isPublic ? (
//                           <div title="Public">
//                             <Globe className="h-4 w-4 text-green-500" />
//                           </div>
//                         ) : (
//                           <div title="Private">
//                             <Lock className="h-4 w-4 text-orange-500" />
//                           </div>
//                         )}
//                         {template.createdByAdmin && (
//                           <div title="Admin Created">
//                             <Star className="h-4 w-4 text-yellow-500" />
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </CardHeader>
//                   <CardContent>
//                     <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{template.description}</p>

//                     <div className="flex items-center justify-between mb-4">
//                       <div className="flex items-center gap-2">
//                         <User className="h-4 w-4 text-muted-foreground" />
//                         <span className="text-sm text-muted-foreground">{template._count.businessConfigs} users</span>
//                       </div>
//                       <Badge variant={template.isActive ? "default" : "secondary"}>
//                         {template.isActive ? "Active" : "Inactive"}
//                       </Badge>
//                     </div>

//                     <div className="flex gap-2">
//                       <Button variant="outline" size="sm" className="flex-1 bg-transparent">
//                         <Eye className="h-4 w-4 mr-2" />
//                         View
//                       </Button>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => {
//                           // Toggle template visibility
//                           fetch(`/api/admin/workflow-templates/${template.id}/publish`, {
//                             method: "PATCH",
//                             headers: { "Content-Type": "application/json" },
//                             body: JSON.stringify({ isPublic: !template.isPublic }),
//                           }).then(() => fetchTemplates())
//                         }}
//                       >
//                         {template.isPublic ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))
//             )}
//           </div>
//         </TabsContent>
//       </Tabs>

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
//                   <SelectItem value="SUBMITTED">Submitted</SelectItem>
//                   <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
//                   <SelectItem value="APPROVED">Approved</SelectItem>
//                   <SelectItem value="IN_DEVELOPMENT">In Development</SelectItem>
//                   <SelectItem value="READY_FOR_TESTING">Ready for Testing</SelectItem>
//                   <SelectItem value="COMPLETED">Completed</SelectItem>
//                   <SelectItem value="REJECTED">Rejected</SelectItem>
//                   <SelectItem value="CANCELED">Canceled</SelectItem>
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

//       {/* Workflow Design View Dialog */}
//       <Dialog open={isWorkflowViewOpen} onOpenChange={setIsWorkflowViewOpen}>
//         <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <Brain className="h-6 w-6 text-primary" />
//               AI-Generated Workflow Design
//             </DialogTitle>
//             <DialogDescription>Complete workflow design generated by AI for this custom request</DialogDescription>
//           </DialogHeader>

//           {selectedRequest?.aiSuggestions?.workflowDesign && (
//             <div className="space-y-6">
//               {/* Workflow Header */}
//               <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700">
//                 <div className="text-center mb-6">
//                   <h3 className="text-2xl font-bold mb-2 text-foreground">
//                     {selectedRequest.aiSuggestions.workflowDesign.title}
//                   </h3>
//                   <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
//                     {selectedRequest.aiSuggestions.workflowDesign.description}
//                   </p>
//                 </div>

//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//                   {selectedRequest.aiSuggestions.workflowDesign.metrics && (
//                     <>
//                       <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
//                         <div className="text-xl font-bold text-primary mb-1">
//                           {selectedRequest.aiSuggestions.workflowDesign.metrics.automationRate}
//                         </div>
//                         <div className="text-xs text-muted-foreground font-medium">Automation Rate</div>
//                       </div>
//                       <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
//                         <div className="text-xl font-bold text-primary mb-1">
//                           {selectedRequest.aiSuggestions.workflowDesign.metrics.responseTime}
//                         </div>
//                         <div className="text-xs text-muted-foreground font-medium">Response Time</div>
//                       </div>
//                       <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
//                         <div className="text-xl font-bold text-primary mb-1">
//                           {selectedRequest.aiSuggestions.workflowDesign.metrics.accuracy}
//                         </div>
//                         <div className="text-xs text-muted-foreground font-medium">AI Accuracy</div>
//                       </div>
//                       <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
//                         <div className="text-xl font-bold text-primary mb-1">
//                           {selectedRequest.aiSuggestions.workflowDesign.estimatedBuildTime}
//                         </div>
//                         <div className="text-xs text-muted-foreground font-medium">Build Time</div>
//                       </div>
//                     </>
//                   )}
//                 </div>

//                 {/* ROI and Cost Information */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
//                     <div className="flex items-center gap-2 mb-1">
//                       <TrendingUp className="h-4 w-4 text-green-600" />
//                       <span className="font-semibold text-green-800 dark:text-green-300">Expected ROI</span>
//                     </div>
//                     <div className="text-lg font-bold text-green-700">
//                       {selectedRequest.aiSuggestions.workflowDesign.roi}
//                     </div>
//                   </div>
//                   <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
//                     <div className="flex items-center gap-2 mb-1">
//                       <Star className="h-4 w-4 text-blue-600" />
//                       <span className="font-semibold text-blue-800 dark:text-blue-300">Monthly Cost</span>
//                     </div>
//                     <div className="text-lg font-bold text-blue-700">
//                       {selectedRequest.aiSuggestions.workflowDesign.estimatedCost}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Workflow Steps */}
//               {selectedRequest.aiSuggestions.workflowDesign.steps && (
//                 <div className="space-y-6">
//                   <div className="flex items-center gap-4 mb-6">
//                     <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
//                       <Sparkles className="h-6 w-6 text-white" />
//                     </div>
//                     <div>
//                       <h3 className="text-xl font-bold">Workflow Steps</h3>
//                       <p className="text-muted-foreground">AI-designed automation steps for this workflow</p>
//                     </div>
//                     <Badge variant="outline" className="ml-auto text-base px-3 py-1">
//                       {selectedRequest.aiSuggestions.workflowDesign.steps.length} total steps
//                     </Badge>
//                   </div>

//                   {selectedRequest.aiSuggestions.workflowDesign.steps.map((step: WorkflowStep) => (
//                     <WorkflowStepComponent key={step.id} step={step} />
//                   ))}
//                 </div>
//               )}

//               {/* Technical Requirements */}
//               {selectedRequest.aiSuggestions.workflowDesign.technicalRequirements && (
//                 <div className="p-4 bg-muted/30 rounded-lg">
//                   <h4 className="font-semibold mb-3 flex items-center gap-2">
//                     <Settings className="h-4 w-4 text-primary" />
//                     Technical Requirements
//                   </h4>
//                   <ul className="space-y-2">
//                     {selectedRequest.aiSuggestions.workflowDesign.technicalRequirements.map((req, idx) => (
//                       <li key={idx} className="flex items-start gap-2 text-sm">
//                         <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
//                         <span>{req}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}

//               {/* Benefits */}
//               {selectedRequest.aiSuggestions.workflowDesign.benefits && (
//                 <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
//                   <h4 className="font-semibold mb-3 flex items-center gap-2 text-green-800 dark:text-green-300">
//                     <CheckCircle className="h-4 w-4" />
//                     Expected Benefits
//                   </h4>
//                   <ul className="space-y-2">
//                     {selectedRequest.aiSuggestions.workflowDesign.benefits.map((benefit, idx) => (
//                       <li key={idx} className="flex items-start gap-2 text-sm text-green-700 dark:text-green-400">
//                         <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
//                         <span>{benefit}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>
//           )}

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsWorkflowViewOpen(false)}>
//               Close
//             </Button>
//             {selectedRequest && !selectedRequest.completedTemplate && (
//               <Button
//                 onClick={() => {
//                   setIsWorkflowViewOpen(false)
//                   openTemplateDialog(selectedRequest)
//                 }}
//                 className="bg-green-600 hover:bg-green-700"
//               >
//                 <Plus className="h-4 w-4 mr-2" />
//                 Create Template
//               </Button>
//             )}
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Template Creation Dialog */}
//       <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <Wand2 className="h-5 w-5 text-primary" />
//               Create Workflow Template
//             </DialogTitle>
//             <DialogDescription>
//               Convert this AI-generated workflow into a reusable template that users can configure with their own
//               integrations.
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="templateName">Template Name</Label>
//                 <Input
//                   id="templateName"
//                   value={templateForm.name}
//                   onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
//                   placeholder="Enter template name"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="templateCategory">Category</Label>
//                 <Select
//                   value={templateForm.category}
//                   onValueChange={(value) => setTemplateForm({ ...templateForm, category: value })}
//                 >
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="MARKETING">Marketing</SelectItem>
//                     <SelectItem value="SALES">Sales</SelectItem>
//                     <SelectItem value="CUSTOMER_SUPPORT">Customer Support</SelectItem>
//                     <SelectItem value="CUSTOM">Custom</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             <div>
//               <Label htmlFor="templateDescription">Description</Label>
//               <Textarea
//                 id="templateDescription"
//                 value={templateForm.description}
//                 onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
//                 placeholder="Describe what this template does and its benefits"
//                 rows={3}
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="templateComplexity">Complexity</Label>
//                 <Select
//                   value={templateForm.complexity}
//                   onValueChange={(value) => setTemplateForm({ ...templateForm, complexity: value })}
//                 >
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="SIMPLE">Simple</SelectItem>
//                     <SelectItem value="MEDIUM">Medium</SelectItem>
//                     <SelectItem value="COMPLEX">Complex</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="flex items-center space-x-2 pt-6">
//                 <input
//                   type="checkbox"
//                   id="isPublic"
//                   checked={templateForm.isPublic}
//                   onChange={(e) => setTemplateForm({ ...templateForm, isPublic: e.target.checked })}
//                   className="w-4 h-4 rounded border-border"
//                 />
//                 <Label htmlFor="isPublic" className="text-sm">
//                   Make template publicly available to all users
//                 </Label>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="voiceflowProject">Voiceflow Project ID (Optional)</Label>
//                 <Input
//                   id="voiceflowProject"
//                   value={templateForm.voiceflowProjectId}
//                   onChange={(e) => setTemplateForm({ ...templateForm, voiceflowProjectId: e.target.value })}
//                   placeholder="Enter Voiceflow project ID"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="voiceflowVersion">Voiceflow Version ID (Optional)</Label>
//                 <Input
//                   id="voiceflowVersion"
//                   value={templateForm.voiceflowVersionId}
//                   onChange={(e) => setTemplateForm({ ...templateForm, voiceflowVersionId: e.target.value })}
//                   placeholder="Enter Voiceflow version ID"
//                 />
//               </div>
//             </div>

//             {/* Template Preview */}
//             {selectedRequest?.aiSuggestions?.workflowDesign && (
//               <div className="p-4 bg-muted/30 rounded-lg border">
//                 <h4 className="font-semibold mb-2 text-sm">Template Preview</h4>
//                 <div className="text-xs text-muted-foreground space-y-1">
//                   <p>
//                     <strong>Operations:</strong> {templateForm.operations.join(", ")}
//                   </p>
//                   <p>
//                     <strong>Features:</strong> {templateForm.features.join(", ")}
//                   </p>
//                   <p>
//                     <strong>Integrations:</strong> {templateForm.integrations.join(", ")}
//                   </p>
//                   <p>
//                     <strong>Visibility:</strong>{" "}
//                     {templateForm.isPublic ? "Public (all users)" : "Private (requesting user only)"}
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleCreateTemplate} className="bg-green-600 hover:bg-green-700">
//               <Sparkles className="h-4 w-4 mr-2" />
//               Create Template
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }


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
                  {step.complexity && (
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
                  )}
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
                    {step.businessImpact && (
                      <p className="text-xs text-muted-foreground mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                        {step.businessImpact}
                      </p>
                    )}
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
      <AdminWorkflowDesigner
        initialRequest={selectedRequest}
        initialTemplate={selectedTemplate}
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
                        {request.aiSuggestions.workflowDesign.steps
                          .slice(0, 3)
                          .map((step: any, idx: number) => (
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
