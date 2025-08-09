// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Progress } from "@/components/ui/progress"
// import { ArrowLeft, Instagram, Brain, Zap, Star, Clock, TrendingUp, Users, ChevronDown, ChevronRight, Database, FileSpreadsheet, Mail, FileText, PlayCircle, Filter, MessageCircle, Shield, Bot, GitBranch, Bell, Settings, Layers, Activity, Target, Workflow, CheckCircle, Eye, Download, Share2, Code, Lightbulb } from 'lucide-react'

// const stepTypeConfigs = {
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
// }

// interface WorkflowDesignerViewerProps {
//   request: {
//     id: string
//     title: string
//     businessObjective: string
//     status: string
//     urgency: string
//     createdAt: string
//     estimatedDelivery: string | null
//     developmentNotes: string | null
//     user: {
//       firstname: string
//       lastname: string
//       email: string
//     }
//     businessInfo: {
//       businessName: string
//       businessType: string
//       description: string
//       website: string
//       email: string
//     }
//     workflowDesign: {
//       title: string
//       description: string
//       platform: string
//       estimatedBuildTime: string
//       complexity: string
//       estimatedCost?: string
//       roi?: string
//       metrics?: {
//         automationRate: string
//         responseTime: string
//         accuracy: string
//         scalability: string
//       }
//       steps: Array<{
//         id: string
//         stepNumber: number
//         title: string
//         description: string
//         type: string
//         inputs?: string[]
//         outputs?: string[]
//         details?: string[]
//         voiceflowAction?: string
//         businessImpact?: string
//         estimatedTime?: string
//         complexity?: "low" | "medium" | "high"
//         assignedIntegration?: {
//           id: string
//           name: string
//           icon: React.ComponentType<{ className?: string }>
//           description: string
//         }
//       }>
//       integrations: Array<{
//         id: string
//         name: string
//         icon: React.ComponentType<{ className?: string }>
//         description: string
//         operations?: string[]
//       }>
//       benefits?: string[]
//       selectedGoals?: Array<{
//         id: string
//         label: string
//         description: string
//       }>
//       customRequest?: string
//       voiceflowFeatures?: string[]
//       instagramFocus?: string[]
//     }
//   }
//   onBackToDashboard: () => void
// }

// export default function WorkflowDesignerViewer({ request, onBackToDashboard }: WorkflowDesignerViewerProps) {
//   const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set())
//   const [activeView, setActiveView] = useState<"overview" | "steps" | "integrations" | "implementation">("overview")

//   const toggleStepExpansion = (stepNumber: number) => {
//     setExpandedSteps(prev => {
//       const newSet = new Set(prev)
//       if (newSet.has(stepNumber)) {
//         newSet.delete(stepNumber)
//       } else {
//         newSet.add(stepNumber)
//       }
//       return newSet
//     })
//   }

//   const workflow = request.workflowDesign

//   const WorkflowStepComponent = ({ step }: { 
//   step: {
//     id: string
//     stepNumber: number
//     title: string
//     description: string
//     type: string
//     inputs?: string[]
//     outputs?: string[]
//     details?: string[]
//     voiceflowAction?: string
//     businessImpact?: string
//     estimatedTime?: string
//     complexity?: "low" | "medium" | "high"
//     assignedIntegration?: {
//       id: string
//       name: string
//       icon: React.ComponentType<{ className?: string }>
//       description: string
//     }
//   }
// }) => {
//     // const config = stepTypeConfigs[step.type] || stepTypeConfigs.integration
//     const config = stepTypeConfigs[step.type as keyof typeof stepTypeConfigs] || stepTypeConfigs.integration;
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
//                     {step.voiceflowAction}
//                   </Badge>
//                   {step.assignedIntegration && (
//                     <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
//                       <step.assignedIntegration.icon className="h-3 w-3 mr-1" />
//                       {step.assignedIntegration.name}
//                     </Badge>
//                   )}
//                   <Badge variant="outline" className={`text-xs ${
//                     step.complexity === "high" ? "border-red-300 text-red-600" :
//                     step.complexity === "medium" ? "border-yellow-300 text-yellow-600" :
//                     "border-green-300 text-green-600"
//                   }`}>
//                     {step.complexity}
//                   </Badge>
//                 </div>
//                 <p className="text-muted-foreground mb-3 leading-relaxed">{step.description}</p>

//                 <div className="flex items-center gap-6 text-sm">
//                   {step.inputs && step.inputs.length > 0 && (
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
//                       <span className="text-green-700 dark:text-green-300 font-medium">
//                         Input: {step.inputs.slice(0, 2).join(", ")}
//                         {step.inputs.length > 2 && `... (+${step.inputs.length - 2})`}
//                       </span>
//                     </div>
//                   )}
//                   {step.outputs && step.outputs.length > 0 && (
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
//                       <span className="text-blue-700 dark:text-blue-300 font-medium">
//                         Output: {step.outputs.slice(0, 2).join(", ")}
//                         {step.outputs.length > 2 && `... (+${step.outputs.length - 2})`}
//                       </span>
//                     </div>
//                   )}
//                 </div>
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
//                     Business Impact
//                   </h5>
//                   <div className="space-y-3 text-sm">
//                     <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
//                       <p className="text-green-600 dark:text-green-400 text-xs leading-relaxed">
//                         {step.businessImpact}
//                       </p>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-muted-foreground">Execution Time:</span>
//                       <Badge variant="secondary">{step.estimatedTime}</Badge>
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <h5 className="font-semibold mb-3 flex items-center gap-2">
//                     <Settings className="h-4 w-4 text-purple-500" />
//                     Voiceflow Configuration
//                   </h5>
//                   <div className="space-y-2 text-sm">
//                     <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
//                       <div className="flex items-center gap-2 mb-2">
//                         <Workflow className="h-4 w-4 text-purple-600" />
//                         <span className="font-medium text-purple-700 dark:text-purple-300">
//                           {step.voiceflowAction}
//                         </span>
//                       </div>
//                       {step.assignedIntegration && (
//                         <div className="mt-2">
//                           <div className="flex items-center gap-2">
//                             <step.assignedIntegration.icon className="h-4 w-4 text-green-600" />
//                             <span className="text-xs font-medium text-green-700 dark:text-green-300">
//                               {step.assignedIntegration.name}
//                             </span>
//                           </div>
//                           <p className="text-xs text-green-600 dark:text-green-400 mt-1">
//                             {step.assignedIntegration.description}
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Complete Input/Output Details */}
//               <div className="grid lg:grid-cols-2 gap-6 mt-6 pt-6 border-t border-white/30">
//                 <div>
//                   <h6 className="font-medium mb-3 text-green-700 dark:text-green-300">Complete Inputs:</h6>
//                   <div className="space-y-1">
//                     {step.inputs?.map((input, idx) => (
//                       <div key={idx} className="text-xs p-2 bg-green-50 dark:bg-green-900/20 rounded flex items-center gap-2">
//                         <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                         <span>{input}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//                 <div>
//                   <h6 className="font-medium mb-3 text-blue-700 dark:text-blue-300">Expected Outputs:</h6>
//                   <div className="space-y-1">
//                     {step.outputs?.map((output, idx) => (
//                       <div key={idx} className="text-xs p-2 bg-blue-50 dark:bg-blue-900/20 rounded flex items-center gap-2">
//                         <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                         <span>{output}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {step.stepNumber < (workflow.steps?.length || 1) && (
//           <div className="flex justify-center my-6">
//             <div className="relative">
//               <div className="w-px h-12 bg-gradient-to-b from-gray-300 via-pink-300 to-gray-100 dark:from-gray-600 dark:via-pink-600 dark:to-gray-800"></div>
//               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
//             </div>
//           </div>
//         )}
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-background p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <Button variant="ghost" className="mb-6 hover:bg-accent" onClick={onBackToDashboard}>
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Dashboard
//           </Button>
          
//           <div className="flex items-start justify-between mb-6">
//             <div>
//               <div className="flex items-center gap-3 mb-2">
//                 <Instagram className="h-8 w-8 text-pink-500" />
//                 <h1 className="text-4xl font-bold">{workflow.title}</h1>
//                 <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
//                   <Brain className="h-3 w-3 mr-1" />
//                   DeepSeek AI Generated
//                 </Badge>
//               </div>
//               <p className="text-muted-foreground text-lg max-w-3xl">{workflow.description}</p>
//             </div>
            
//             <div className="flex gap-2">
//               <Button variant="outline">
//                 <Download className="h-4 w-4 mr-2" />
//                 Export
//               </Button>
//               <Button variant="outline">
//                 <Share2 className="h-4 w-4 mr-2" />
//                 Share
//               </Button>
//               <Button variant="outline">
//                 <Code className="h-4 w-4 mr-2" />
//                 Generate Code
//               </Button>
//             </div>
//           </div>

//           {/* Business Context */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//             <Card className="border-2 border-blue-200 bg-blue-50 dark:bg-blue-900/20">
//               <CardContent className="p-4">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Target className="h-4 w-4 text-blue-600" />
//                   <span className="font-medium text-blue-800 dark:text-blue-300">Business</span>
//                 </div>
//                 <p className="text-sm text-blue-700 dark:text-blue-400">{request.businessInfo.businessName}</p>
//                 <p className="text-xs text-blue-600 dark:text-blue-500">{request.businessInfo.businessType}</p>
//               </CardContent>
//             </Card>
            
//             <Card className="border-2 border-green-200 bg-green-50 dark:bg-green-900/20">
//               <CardContent className="p-4">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Users className="h-4 w-4 text-green-600" />
//                   <span className="font-medium text-green-800 dark:text-green-300">Requested by</span>
//                 </div>
//                 <p className="text-sm text-green-700 dark:text-green-400">
//                   {request.user.firstname} {request.user.lastname}
//                 </p>
//                 <p className="text-xs text-green-600 dark:text-green-500">{request.user.email}</p>
//               </CardContent>
//             </Card>
            
//             <Card className="border-2 border-purple-200 bg-purple-50 dark:bg-purple-900/20">
//               <CardContent className="p-4">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Clock className="h-4 w-4 text-purple-600" />
//                   <span className="font-medium text-purple-800 dark:text-purple-300">Timeline</span>
//                 </div>
//                 <p className="text-sm text-purple-700 dark:text-purple-400">{workflow.estimatedBuildTime}</p>
//                 <p className="text-xs text-purple-600 dark:text-purple-500">Build Time</p>
//               </CardContent>
//             </Card>
//           </div>
//         </div>

//         {/* Navigation Tabs */}
//         <div className="mb-8">
//           <div className="flex space-x-1 bg-muted p-1 rounded-lg">
//             {[
//               { id: "overview", label: "Overview", icon: Eye },
//               { id: "steps", label: "Workflow Steps", icon: Workflow },
//               { id: "integrations", label: "Integrations", icon: Zap },
//               { id: "implementation", label: "Implementation", icon: Code },
//             ].map(({ id, label, icon: Icon }) => (
//               <button
//                 key={id}
//                 onClick={() => setActiveView(id as any)}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
//                   activeView === id
//                     ? "bg-background text-foreground shadow-sm"
//                     : "text-muted-foreground hover:text-foreground"
//                 }`}
//               >
//                 <Icon className="h-4 w-4" />
//                 {label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Content based on active view */}
//         {activeView === "overview" && (
//           <div className="space-y-6">
//             {/* Metrics Dashboard */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               <Card className="text-center">
//                 <CardContent className="p-6">
//                   <div className="text-3xl font-bold text-pink-500 mb-2">{workflow.metrics?.automationRate}</div>
//                   <div className="text-sm text-muted-foreground">Automation Rate</div>
//                 </CardContent>
//               </Card>
//               <Card className="text-center">
//                 <CardContent className="p-6">
//                   <div className="text-3xl font-bold text-green-500 mb-2">{workflow.metrics?.responseTime}</div>
//                   <div className="text-sm text-muted-foreground">Response Time</div>
//                 </CardContent>
//               </Card>
//               <Card className="text-center">
//                 <CardContent className="p-6">
//                   <div className="text-3xl font-bold text-purple-500 mb-2">{workflow.metrics?.accuracy}</div>
//                   <div className="text-sm text-muted-foreground">AI Accuracy</div>
//                 </CardContent>
//               </Card>
//               <Card className="text-center">
//                 <CardContent className="p-6">
//                   <div className="text-3xl font-bold text-orange-500 mb-2">{workflow.complexity}</div>
//                   <div className="text-sm text-muted-foreground">Complexity</div>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Original Customer Request */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <MessageCircle className="h-5 w-5 text-blue-500" />
//                   Original Customer Request
//                 </CardTitle>
//                 <CardDescription>The specific automation requirements provided by the customer</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="p-4 bg-muted/50 rounded-lg">
//                   <p className="text-sm leading-relaxed whitespace-pre-wrap">{workflow.customRequest}</p>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Selected Goals */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Target className="h-5 w-5 text-green-500" />
//                   Instagram Automation Goals
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {workflow.selectedGoals?.map((goal) => (
//                     <div key={goal.id} className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
//                       <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">{goal.label}</h4>
//                       <p className="text-sm text-green-600 dark:text-green-400">{goal.description}</p>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Benefits */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Star className="h-5 w-5 text-yellow-500" />
//                   Expected Benefits
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                   {workflow.benefits?.map((benefit, idx) => (
//                     <div key={idx} className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
//                       <CheckCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
//                       <span className="text-sm text-yellow-800 dark:text-yellow-300">{benefit}</span>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Cost & ROI */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <Card className="border-2 border-green-200">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2 text-green-700">
//                     <TrendingUp className="h-5 w-5" />
//                     Estimated Cost
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-3xl font-bold text-green-600 mb-2">{workflow.estimatedCost}</div>
//                   <p className="text-sm text-green-600">Monthly operational cost including integrations and hosting</p>
//                 </CardContent>
//               </Card>
              
//               <Card className="border-2 border-blue-200">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2 text-blue-700">
//                     <Star className="h-5 w-5" />
//                     Expected ROI
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-3xl font-bold text-blue-600 mb-2">{workflow.roi}</div>
//                   <p className="text-sm text-blue-600">Return on investment through automation and efficiency gains</p>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         )}

//         {activeView === "steps" && (
//           <div className="space-y-8">
//             <div className="flex items-center gap-4 mb-8">
//               <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl shadow-lg">
//                 <Workflow className="h-6 w-6 text-white" />
//               </div>
//               <div>
//                 <h3 className="text-2xl font-bold">Workflow Steps ({workflow.steps?.length})</h3>
//                 <p className="text-muted-foreground">Detailed breakdown of the AI-generated Instagram automation workflow</p>
//               </div>
//             </div>

//             {workflow.steps?.map((step) => (
//               <WorkflowStepComponent key={step.id} step={step} />
//             ))}
//           </div>
//         )}

//         {activeView === "integrations" && (
//           <div className="space-y-6">
//             <div className="flex items-center gap-4 mb-8">
//               <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl shadow-lg">
//                 <Zap className="h-6 w-6 text-white" />
//               </div>
//               <div>
//                 <h3 className="text-2xl font-bold">Required Integrations ({workflow.integrations?.length})</h3>
//                 <p className="text-muted-foreground">External services and APIs needed for this workflow</p>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {workflow.integrations?.map((integration) => {
//                 const IconComponent = integration.icon
//                 return (
//                   <Card key={integration.id} className="border-2 border-blue-200">
//                     <CardHeader>
//                       <CardTitle className="flex items-center gap-3">
//                         <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
//                           <IconComponent className="h-6 w-6 text-blue-600" />
//                         </div>
//                         <div>
//                           <span className="text-lg">{integration.name}</span>
//                           <Badge variant="outline" className="ml-2 text-xs">Required</Badge>
//                         </div>
//                       </CardTitle>
//                       <CardDescription>{integration.description}</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                       <div>
//                         <h5 className="font-medium mb-3">Available Operations:</h5>
//                         <div className="flex flex-wrap gap-2">
//                           {integration.operations?.map((operation) => (
//                             <Badge key={operation} variant="secondary" className="text-xs">
//                               {operation}
//                             </Badge>
//                           ))}
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 )
//               })}
//             </div>
//           </div>
//         )}

//         {activeView === "implementation" && (
//           <div className="space-y-6">
//             <div className="flex items-center gap-4 mb-8">
//               <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-lg">
//                 <Code className="h-6 w-6 text-white" />
//               </div>
//               <div>
//                 <h3 className="text-2xl font-bold">Implementation Guide</h3>
//                 <p className="text-muted-foreground">Step-by-step implementation instructions for developers</p>
//               </div>
//             </div>

//             {/* Voiceflow Features */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Workflow className="h-5 w-5 text-purple-500" />
//                   Voiceflow Features Required
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                   {workflow.voiceflowFeatures?.map((feature, idx) => (
//                     <div key={idx} className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
//                       <Settings className="h-4 w-4 text-purple-600" />
//                       <span className="text-sm font-medium">{feature}</span>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Instagram-Specific Implementation */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Instagram className="h-5 w-5 text-pink-500" />
//                   Instagram-Specific Features
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-3">
//                   {workflow.instagramFocus?.map((focus, idx) => (
//                     <div key={idx} className="flex items-center gap-3 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
//                       <Instagram className="h-4 w-4 text-pink-600" />
//                       <span className="text-sm font-medium">{focus}</span>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Implementation Timeline */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Clock className="h-5 w-5 text-orange-500" />
//                   Development Timeline
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
//                     <div>
//                       <h4 className="font-medium">Phase 1: Setup & Integration</h4>
//                       <p className="text-sm text-muted-foreground">Configure Voiceflow and integrate APIs</p>
//                     </div>
//                     <Badge variant="secondary">3-5 days</Badge>
//                   </div>
//                   <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
//                     <div>
//                       <h4 className="font-medium">Phase 2: AI Training & Logic</h4>
//                       <p className="text-sm text-muted-foreground">Implement DeepSeek AI and workflow logic</p>
//                     </div>
//                     <Badge variant="secondary">5-7 days</Badge>
//                   </div>
//                   <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
//                     <div>
//                       <h4 className="font-medium">Phase 3: Testing & Optimization</h4>
//                       <p className="text-sm text-muted-foreground">Test workflows and optimize performance</p>
//                     </div>
//                     <Badge variant="secondary">3-4 days</Badge>
//                   </div>
//                   <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
//                     <div>
//                       <h4 className="font-medium">Phase 4: Deployment & Monitoring</h4>
//                       <p className="text-sm text-muted-foreground">Deploy to production and set up monitoring</p>
//                     </div>
//                     <Badge variant="secondary">1-2 days</Badge>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Technical Requirements */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Settings className="h-5 w-5 text-gray-500" />
//                   Technical Requirements
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <h5 className="font-medium mb-3">Environment Variables Needed:</h5>
//                     <div className="space-y-2">
//                       <code className="block p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">DEEPSEEK_API_KEY</code>
//                       <code className="block p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">INSTAGRAM_ACCESS_TOKEN</code>
//                       <code className="block p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">VOICEFLOW_API_KEY</code>
//                       {workflow.integrations?.map((integration) => (
//                         <code key={integration.id} className="block p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
//                           {integration.name.toUpperCase().replace(/\s+/g, '_')}_API_KEY
//                         </code>
//                       ))}
//                     </div>
//                   </div>
//                   <div>
//                     <h5 className="font-medium mb-3">Setup Instructions:</h5>
//                     <div className="space-y-2 text-sm">
//                       <div className="flex items-start gap-2">
//                         <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
//                         <span>Set up Instagram Business API access</span>
//                       </div>
//                       <div className="flex items-start gap-2">
//                         <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
//                         <span>Configure Voiceflow project with Instagram channel</span>
//                       </div>
//                       <div className="flex items-start gap-2">
//                         <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
//                         <span>Set up DeepSeek AI API access</span>
//                       </div>
//                       <div className="flex items-start gap-2">
//                         <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
//                         <span>Configure integration API keys and webhooks</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }



"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  Instagram,
  Brain,
  Zap,
  Star,
  Clock,
  TrendingUp,
  Users,
  ChevronDown,
  ChevronRight,
  Database,
  FileText,
  PlayCircle,
  Filter,
  MessageCircle,
  Shield,
  Bot,
  GitBranch,
  Bell,
  Settings,
  Layers,
  Activity,
  Target,
  Workflow,
  CheckCircle,
  Eye,
  Download,
  Share2,
  Code,
  Lightbulb,
  Building,
  AlertTriangle,
  Copy,
  ExternalLink,
  FileCode,
  Gauge,
  BarChart3,
  DollarSign,
  Timer,
  Rocket,
  Sparkles,
  Monitor,
  Server,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

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
  notification: {
    icon: Bell,
    color: "text-red-600",
    bgColor: "from-red-50 to-pink-100",
    borderColor: "border-red-300",
    accentColor: "bg-red-500",
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
  const [activeView, setActiveView] = useState<
    "overview" | "steps" | "integrations" | "implementation" | "analytics" | "deployment"
  >("overview")
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [isDeploymentDialogOpen, setIsDeploymentDialogOpen] = useState(false)
  const [deploymentConfig, setDeploymentConfig] = useState({
    environment: "staging",
    autoScale: true,
    monitoring: true,
    backups: true,
    ssl: true,
    cdn: false,
    loadBalancer: false,
  })

  const toggleStepExpansion = (stepNumber: number) => {
    setExpandedSteps((prev) => {
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

  const handleExport = (format: string) => {
    // Mock export functionality
    toast({
      title: "Export Started",
      description: `Exporting workflow in ${format} format...`,
    })
    setIsExportDialogOpen(false)
  }

  const handleDeploy = () => {
    // Mock deployment functionality
    toast({
      title: "Deployment Initiated",
      description: "Workflow deployment has been started. You'll receive updates via email.",
    })
    setIsDeploymentDialogOpen(false)
  }

  const WorkflowStepComponent = ({
    step,
  }: {
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
    const config = stepTypeConfigs[step.type as keyof typeof stepTypeConfigs] || stepTypeConfigs.integration
    const IconComponent = config.icon
    const isExpanded = expandedSteps.has(step.stepNumber)

    return (
      <div className="relative group">
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
                  className={`w-16 h-16 ${config.accentColor} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-xl transition-transform group-hover:scale-105`}
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
                    <Badge
                      variant="secondary"
                      className="text-xs bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                    >
                      <step.assignedIntegration.icon className="h-3 w-3 mr-1" />
                      {step.assignedIntegration.name}
                    </Badge>
                  )}
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      step.complexity === "high"
                        ? "border-red-300 text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-300"
                        : step.complexity === "medium"
                          ? "border-yellow-300 text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-300"
                          : "border-green-300 text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-300"
                    }`}
                  >
                    {step.complexity} complexity
                  </Badge>
                  {step.estimatedTime && (
                    <Badge variant="secondary" className="text-xs">
                      <Timer className="h-3 w-3 mr-1" />
                      {step.estimatedTime}
                    </Badge>
                  )}
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

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigator.clipboard.writeText(`Step ${step.stepNumber}: ${step.title}\n${step.description}`)
                    toast({ title: "Copied to clipboard", description: "Step details copied successfully" })
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Copy className="h-4 w-4" />
                </Button>
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
                    Performance Metrics
                  </h5>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Execution Time:</span>
                      <Badge variant="secondary">{step.estimatedTime}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Success Rate:</span>
                      <Badge variant="secondary" className="text-green-600">
                        99.2%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Avg. Response:</span>
                      <Badge variant="secondary" className="text-blue-600">
                        1.2s
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Error Rate:</span>
                      <Badge variant="secondary" className="text-orange-600">
                        0.8%
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold mb-3 flex items-center gap-2">
                    <Settings className="h-4 w-4 text-purple-500" />
                    Configuration
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Workflow className="h-4 w-4 text-purple-600" />
                        <span className="font-medium text-purple-700 dark:text-purple-300">{step.voiceflowAction}</span>
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
                    {step.businessImpact && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                          <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Business Impact</span>
                        </div>
                        <p className="text-xs text-blue-600 dark:text-blue-400">{step.businessImpact}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Complete Input/Output Details */}
              <div className="grid lg:grid-cols-2 gap-6 mt-6 pt-6 border-t border-white/30">
                <div>
                  <h6 className="font-medium mb-3 text-green-700 dark:text-green-300 flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                    Complete Inputs
                  </h6>
                  <div className="space-y-1">
                    {step.inputs?.map((input, idx) => (
                      <div
                        key={idx}
                        className="text-xs p-2 bg-green-50 dark:bg-green-900/20 rounded flex items-center gap-2"
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>{input}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h6 className="font-medium mb-3 text-blue-700 dark:text-blue-300 flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Expected Outputs
                  </h6>
                  <div className="space-y-1">
                    {step.outputs?.map((output, idx) => (
                      <div
                        key={idx}
                        className="text-xs p-2 bg-blue-50 dark:bg-blue-900/20 rounded flex items-center gap-2"
                      >
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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Enhanced Header */}
        <div className="mb-8">
          <Button variant="ghost" className="mb-6 hover:bg-accent" onClick={onBackToDashboard}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl shadow-lg">
                  <Instagram className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-foreground">{workflow.title}</h1>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      variant="outline"
                      className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300"
                    >
                      <Brain className="h-3 w-3 mr-1" />
                      DeepSeek AI Generated
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300"
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      {workflow.complexity}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {workflow.estimatedBuildTime}
                    </Badge>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed">{workflow.description}</p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsExportDialogOpen(true)}>
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
              <Button
                onClick={() => setIsDeploymentDialogOpen(true)}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                <Rocket className="h-4 w-4 mr-2" />
                Deploy
              </Button>
            </div>
          </div>

          {/* Enhanced Business Context */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Building className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800 dark:text-blue-300">Business</span>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-400 font-semibold">
                  {request.businessInfo.businessName}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-500">{request.businessInfo.businessType}</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800 dark:text-green-300">Requested by</span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-400 font-semibold">
                  {request.user.firstname} {request.user.lastname}
                </p>
                <p className="text-xs text-green-600 dark:text-green-500">{request.user.email}</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-purple-800 dark:text-purple-300">Timeline</span>
                </div>
                <p className="text-sm text-purple-700 dark:text-purple-400 font-semibold">
                  {workflow.estimatedBuildTime}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-500">Build Time</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-orange-600" />
                  <span className="font-medium text-orange-800 dark:text-orange-300">Investment</span>
                </div>
                <p className="text-sm text-orange-700 dark:text-orange-400 font-semibold">
                  {workflow.estimatedCost || "TBD"}
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-500">Est. Cost</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            {[
              { id: "overview", label: "Overview", icon: Eye, description: "Project summary and metrics" },
              { id: "steps", label: "Workflow Steps", icon: Workflow, description: "Detailed step breakdown" },
              { id: "integrations", label: "Integrations", icon: Zap, description: "Required services" },
              { id: "implementation", label: "Implementation", icon: Code, description: "Technical details" },
              { id: "analytics", label: "Analytics", icon: BarChart3, description: "Performance insights" },
              { id: "deployment", label: "Deployment", icon: Rocket, description: "Deploy configuration" },
            ].map(({ id, label, icon: Icon, description }) => (
              <button
                key={id}
                onClick={() => setActiveView(id as any)}
                className={`flex items-center gap-2 px-4 py-3 rounded-md text-sm font-medium transition-all group relative ${
                  activeView === id
                    ? "bg-background text-foreground shadow-sm scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
                title={description}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
                {activeView === id && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content based on active view */}
        {activeView === "overview" && (
          <div className="space-y-8">
            {/* Enhanced Metrics Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card className="text-center border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-2">
                    <Gauge className="h-6 w-6 text-pink-500 mr-2" />
                    <div className="text-3xl font-bold text-pink-600">{workflow.metrics?.automationRate}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">Automation Rate</div>
                  <Progress value={90} className="mt-2 h-2" />
                </CardContent>
              </Card>
              <Card className="text-center border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-2">
                    <Timer className="h-6 w-6 text-green-500 mr-2" />
                    <div className="text-3xl font-bold text-green-600">{workflow.metrics?.responseTime}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">Response Time</div>
                  <Progress value={95} className="mt-2 h-2" />
                </CardContent>
              </Card>
              <Card className="text-center border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-2">
                    <Brain className="h-6 w-6 text-purple-500 mr-2" />
                    <div className="text-3xl font-bold text-purple-600">{workflow.metrics?.accuracy}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">AI Accuracy</div>
                  <Progress value={94} className="mt-2 h-2" />
                </CardContent>
              </Card>
              <Card className="text-center border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="h-6 w-6 text-orange-500 mr-2" />
                    <div className="text-3xl font-bold text-orange-600">{workflow.complexity}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">Complexity</div>
                  <Progress value={75} className="mt-2 h-2" />
                </CardContent>
              </Card>
            </div>

            {/* Original Customer Request */}
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-500" />
                  Original Customer Request
                </CardTitle>
                <CardDescription>The specific automation requirements provided by the customer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{workflow.customRequest}</p>
                </div>
              </CardContent>
            </Card>

            {/* Selected Goals */}
            <Card className="border-2 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-500" />
                  Instagram Automation Goals
                </CardTitle>
                <CardDescription>Primary objectives for this automation workflow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {workflow.selectedGoals?.map((goal) => (
                    <div
                      key={goal.id}
                      className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800"
                    >
                      <h4 className="font-medium text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        {goal.label}
                      </h4>
                      <p className="text-sm text-green-600 dark:text-green-400">{goal.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="border-2 border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Expected Benefits
                </CardTitle>
                <CardDescription>Key advantages and improvements this workflow will deliver</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {workflow.benefits?.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
                    >
                      <CheckCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-yellow-800 dark:text-yellow-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Cost & ROI */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <DollarSign className="h-5 w-5" />
                    Investment Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">{workflow.estimatedCost}</div>
                      <p className="text-sm text-green-600">Monthly operational cost</p>
                    </div>
                    <Separator />
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Platform hosting</span>
                        <span className="font-medium">$50-100</span>
                      </div>
                      <div className="flex justify-between">
                        <span>API integrations</span>
                        <span className="font-medium">$100-200</span>
                      </div>
                      <div className="flex justify-between">
                        <span>AI processing</span>
                        <span className="font-medium">$50-200</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <TrendingUp className="h-5 w-5" />
                    ROI Projection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">{workflow.roi}</div>
                      <p className="text-sm text-blue-600">Expected return on investment</p>
                    </div>
                    <Separator />
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Time savings</span>
                        <span className="font-medium text-green-600">40 hrs/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Lead conversion</span>
                        <span className="font-medium text-green-600">+25%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Response speed</span>
                        <span className="font-medium text-green-600">10x faster</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeView === "steps" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl shadow-lg">
                  <Workflow className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Workflow Steps ({workflow.steps?.length})</h3>
                  <p className="text-muted-foreground">
                    Detailed breakdown of the AI-generated Instagram automation workflow
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExpandedSteps(new Set(workflow.steps?.map((s) => s.stepNumber) || []))}
                >
                  Expand All
                </Button>
                <Button variant="outline" size="sm" onClick={() => setExpandedSteps(new Set())}>
                  Collapse All
                </Button>
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
                  <Card key={integration.id} className="border-2 border-blue-200 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                          <IconComponent className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <span className="text-lg">{integration.name}</span>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              Required
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              API v2.0
                            </Badge>
                          </div>
                        </div>
                      </CardTitle>
                      <CardDescription>{integration.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-medium mb-3 flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            Available Operations:
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {integration.operations?.map((operation) => (
                              <Badge key={operation} variant="secondary" className="text-xs">
                                {operation}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Setup Complexity:</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              Medium
                            </Badge>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Est. Cost:</span>
                            <span className="ml-2 font-medium">$20-50/mo</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Documentation
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                            <Settings className="h-4 w-4 mr-2" />
                            Configure
                          </Button>
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
            <Card className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="h-5 w-5 text-purple-500" />
                  Voiceflow Features Required
                </CardTitle>
                <CardDescription>Essential Voiceflow components and blocks needed for this workflow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {workflow.voiceflowFeatures?.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
                    >
                      <Settings className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Instagram-Specific Implementation */}
            <Card className="border-2 border-pink-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Instagram className="h-5 w-5 text-pink-500" />
                  Instagram-Specific Features
                </CardTitle>
                <CardDescription>Platform-specific implementation requirements and features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {workflow.instagramFocus?.map((focus, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-lg border border-pink-200 dark:border-pink-800"
                    >
                      <Instagram className="h-4 w-4 text-pink-600" />
                      <span className="text-sm font-medium">{focus}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Implementation Timeline */}
            <Card className="border-2 border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  Development Timeline
                </CardTitle>
                <CardDescription>Detailed project phases and milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      phase: "Phase 1: Setup & Integration",
                      description: "Configure Voiceflow and integrate APIs",
                      duration: "3-5 days",
                      color: "blue",
                    },
                    {
                      phase: "Phase 2: AI Training & Logic",
                      description: "Implement DeepSeek AI and workflow logic",
                      duration: "5-7 days",
                      color: "purple",
                    },
                    {
                      phase: "Phase 3: Testing & Optimization",
                      description: "Test workflows and optimize performance",
                      duration: "3-4 days",
                      color: "green",
                    },
                    {
                      phase: "Phase 4: Deployment & Monitoring",
                      description: "Deploy to production and set up monitoring",
                      duration: "1-2 days",
                      color: "yellow",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-4 bg-${item.color}-50 dark:bg-${item.color}-900/20 rounded-lg border border-${item.color}-200 dark:border-${item.color}-800`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 bg-${item.color}-500 rounded-full flex items-center justify-center text-white font-bold text-sm`}
                        >
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="font-medium">{item.phase}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{item.duration}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Technical Requirements */}
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-500" />
                  Technical Requirements
                </CardTitle>
                <CardDescription>Environment setup and configuration requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium mb-3 flex items-center gap-2">
                      <Server className="h-4 w-4" />
                      Environment Variables:
                    </h5>
                    <div className="space-y-2">
                      <code className="block p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono border">
                        DEEPSEEK_API_KEY
                      </code>
                      <code className="block p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono border">
                        INSTAGRAM_ACCESS_TOKEN
                      </code>
                      <code className="block p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono border">
                        VOICEFLOW_API_KEY
                      </code>
                      {workflow.integrations?.map((integration) => (
                        <code
                          key={integration.id}
                          className="block p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono border"
                        >
                          {integration.name.toUpperCase().replace(/\s+/g, "_")}_API_KEY
                        </code>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium mb-3 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Setup Instructions:
                    </h5>
                    <div className="space-y-3 text-sm">
                      {[
                        "Set up Instagram Business API access",
                        "Configure Voiceflow project with Instagram channel",
                        "Set up DeepSeek AI API access",
                        "Configure integration API keys and webhooks",
                        "Set up monitoring and logging",
                        "Configure SSL certificates",
                      ].map((instruction, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{instruction}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeView === "analytics" && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl shadow-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Performance Analytics</h3>
                <p className="text-muted-foreground">Projected performance metrics and monitoring insights</p>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <TrendingUp className="h-5 w-5" />
                    Success Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Message Processing</span>
                      <div className="flex items-center gap-2">
                        <Progress value={95} className="w-16 h-2" />
                        <span className="text-sm font-medium">95%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Lead Qualification</span>
                      <div className="flex items-center gap-2">
                        <Progress value={88} className="w-16 h-2" />
                        <span className="text-sm font-medium">88%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Response Accuracy</span>
                      <div className="flex items-center gap-2">
                        <Progress value={92} className="w-16 h-2" />
                        <span className="text-sm font-medium">92%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Clock className="h-5 w-5" />
                    Response Times
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">1.2s</div>
                      <p className="text-xs text-muted-foreground">Average Response</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">0.8s</div>
                      <p className="text-xs text-muted-foreground">Fastest Response</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">3.1s</div>
                      <p className="text-xs text-muted-foreground">Complex Queries</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-700">
                    <Users className="h-5 w-5" />
                    User Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Conversation Rate</span>
                      <span className="text-sm font-medium text-green-600">+34%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">User Satisfaction</span>
                      <span className="text-sm font-medium text-green-600">4.7/5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Retention Rate</span>
                      <span className="text-sm font-medium text-green-600">78%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monitoring Dashboard */}
            <Card className="border-2 border-indigo-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-indigo-500" />
                  Monitoring & Alerts
                </CardTitle>
                <CardDescription>Real-time monitoring configuration and alert thresholds</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium mb-3">Alert Thresholds:</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
                        <span className="text-sm">Response Time &gt; 5s</span>
                        <Badge variant="destructive" className="text-xs">
                          Critical
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                        <span className="text-sm">Error Rate &gt; 5%</span>
                        <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                          Warning
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <span className="text-sm">CPU Usage &gt; 80%</span>
                        <Badge variant="outline" className="text-xs">
                          Info
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium mb-3">Monitoring Tools:</h5>
                    <div className="space-y-2">
                      {[
                        { name: "Application Performance", status: "Active" },
                        { name: "Error Tracking", status: "Active" },
                        { name: "User Analytics", status: "Pending" },
                        { name: "Infrastructure Monitoring", status: "Active" },
                      ].map((tool, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                          <span className="text-sm">{tool.name}</span>
                          <Badge variant={tool.status === "Active" ? "default" : "secondary"} className="text-xs">
                            {tool.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeView === "deployment" && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Deployment Configuration</h3>
                <p className="text-muted-foreground">Production deployment settings and infrastructure requirements</p>
              </div>
            </div>

            {/* Deployment Status */}
            <Card className="border-2 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Deployment Readiness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <h4 className="font-medium">Code Review</h4>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <h4 className="font-medium">Testing</h4>
                    <p className="text-sm text-muted-foreground">Passed</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <h4 className="font-medium">Security Scan</h4>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Infrastructure Requirements */}
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-blue-500" />
                  Infrastructure Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium mb-3">Compute Resources:</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                        <span className="text-sm">CPU</span>
                        <span className="text-sm font-medium">2 vCPUs</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                        <span className="text-sm">Memory</span>
                        <span className="text-sm font-medium">4 GB RAM</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                        <span className="text-sm">Storage</span>
                        <span className="text-sm font-medium">50 GB SSD</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                        <span className="text-sm">Bandwidth</span>
                        <span className="text-sm font-medium">1 TB/month</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium mb-3">Services:</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                        <span className="text-sm">Load Balancer</span>
                        <Badge variant="secondary" className="text-xs">
                          Optional
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                        <span className="text-sm">CDN</span>
                        <Badge variant="secondary" className="text-xs">
                          Recommended
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                        <span className="text-sm">SSL Certificate</span>
                        <Badge variant="default" className="text-xs">
                          Required
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                        <span className="text-sm">Backup Service</span>
                        <Badge variant="default" className="text-xs">
                          Required
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Deployment Actions */}
            <div className="flex gap-4">
              <Button
                onClick={() => setIsDeploymentDialogOpen(true)}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                <Rocket className="h-4 w-4 mr-2" />
                Deploy to Production
              </Button>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview Staging
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Configure Environment
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Export Workflow</DialogTitle>
            <DialogDescription>Choose the format for exporting this workflow design.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" onClick={() => handleExport("PDF")} className="h-20 flex-col">
                <FileCode className="h-6 w-6 mb-2" />
                PDF Report
              </Button>
              <Button variant="outline" onClick={() => handleExport("JSON")} className="h-20 flex-col">
                <Code className="h-6 w-6 mb-2" />
                JSON Data
              </Button>
              <Button variant="outline" onClick={() => handleExport("Markdown")} className="h-20 flex-col">
                <FileText className="h-6 w-6 mb-2" />
                Markdown
              </Button>
              <Button variant="outline" onClick={() => handleExport("Voiceflow")} className="h-20 flex-col">
                <Workflow className="h-6 w-6 mb-2" />
                Voiceflow
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Deployment Dialog */}
      <Dialog open={isDeploymentDialogOpen} onOpenChange={setIsDeploymentDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Deploy Workflow</DialogTitle>
            <DialogDescription>Configure deployment settings for this workflow.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="environment">Environment</Label>
                <Select
                  value={deploymentConfig.environment}
                  onValueChange={(value) => setDeploymentConfig({ ...deploymentConfig, environment: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="autoScale"
                    checked={deploymentConfig.autoScale}
                    onChange={(e) => setDeploymentConfig({ ...deploymentConfig, autoScale: e.target.checked })}
                  />
                  <Label htmlFor="autoScale">Auto-scaling</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="monitoring"
                    checked={deploymentConfig.monitoring}
                    onChange={(e) => setDeploymentConfig({ ...deploymentConfig, monitoring: e.target.checked })}
                  />
                  <Label htmlFor="monitoring">Monitoring</Label>
                </div>
              </div>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This will deploy the workflow to {deploymentConfig.environment}. Make sure all configurations are
                correct.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeploymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDeploy} className="bg-gradient-to-r from-green-500 to-blue-500">
              <Rocket className="h-4 w-4 mr-2" />
              Deploy Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
