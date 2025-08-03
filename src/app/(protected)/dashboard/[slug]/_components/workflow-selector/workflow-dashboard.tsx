// "use client"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Label } from "@/components/ui/label"
// import {
//   Loader2,
//   PlayCircle,
//   PauseCircle,
//   Sparkles,
//   BarChart,
//   Activity,
//   CheckCircle,
//   Clock,
//   Users,
//   MessageSquare,
//   TrendingUp,
//   Zap,
//   Calendar,
//   Mail,
//   Phone,
// } from "lucide-react"

// interface IntegrationConfig {
//   name: string
//   apiKey?: string
//   apiSecret?: string
//   webhookUrl?: string
//   projectId?: string
//   versionId?: string
//   additionalSettings?: Record<string, string>
// }

// interface BusinessWorkflowConfig {
//   id: string
//   userId: string
//   businessId: string
//   workflowTemplateId: string | null
//   businessInfo: {
//     businessName: string
//     businessType: string
//     description?: string
//     website?: string
//     phone?: string
//     email?: string
//   }
//   integrations: { name: string; config: IntegrationConfig }[]
//   customRequest?: string
//   status: "DRAFT" | "CONFIGURING" | "SUBMITTED" | "PENDING_CREATION" | "ACTIVE" | "INACTIVE" | "CUSTOM_REQUEST" | "EDIT_REQUESTED" 
//   createdAt: Date
//   updatedAt: Date
//   isActive: boolean
//   workflowTemplate?: {
//     id: string
//     name: string
//     category: string
//     description: string
//   }
//   credentials: {
//     id: string
//     integrationName: string
//     integrationType: string
//     encryptedCredentials: string
//     isActive: boolean
//     lastVerified: Date | null
//   }[]
//   activatedAt?: Date
//   performanceMetrics?: {
//     totalMessages: number
//     leadsQualified: number
//     averageResponseTime: string
//     successfulIntegrations: number
//   }
// }

// interface WorkflowDashboardProps {
//   workflowDetails: BusinessWorkflowConfig
//   onDeactivate: () => void
//   isDeactivating: boolean
// }

// export default function WorkflowDashboard({ workflowDetails, onDeactivate, isDeactivating }: WorkflowDashboardProps) {
//   const formatDate = (date: Date | string | undefined) => {
//     if (!date) return "N/A"
//     const dateObj = typeof date === 'string' ? new Date(date) : date
//     return dateObj.toLocaleDateString("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     })
//   }

//   const getDaysSinceActivation = () => {
//     if (!workflowDetails.activatedAt) return 0
//     const activatedDate = new Date(workflowDetails.activatedAt)
//     const now = new Date()
//     const diffTime = Math.abs(now.getTime() - activatedDate.getTime())
//     return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
//   }

//   const getStatusBadge = () => {
//     switch (workflowDetails.status) {
//       case "ACTIVE":
//         return (
//           <Badge className="bg-green-600 text-green-50 font-bold px-3 py-1 rounded-full text-sm flex items-center w-fit">
//             <PlayCircle className="h-4 w-4 mr-2" />
//             ACTIVE & RUNNING
//           </Badge>
//         )
//       case "PENDING_CREATION":
//         return (
//           <Badge className="bg-blue-600 text-blue-50 font-bold px-3 py-1 rounded-full text-sm flex items-center w-fit">
//             <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//             IN DEVELOPMENT
//           </Badge>
//         )
//       case "INACTIVE":
//         return (
//           <Badge className="bg-gray-600 text-gray-50 font-bold px-3 py-1 rounded-full text-sm flex items-center w-fit">
//             <PauseCircle className="h-4 w-4 mr-2" />
//             INACTIVE
//           </Badge>
//         )
//       default:
//         return (
//           <Badge variant="outline" className="font-bold px-3 py-1 rounded-full text-sm">
//             {workflowDetails.status}
//           </Badge>
//         )
//     }
//   }

//   const getPerformanceMetrics = () => {
//     // Return mock data if no real metrics available
//     return workflowDetails.performanceMetrics || {
//       totalMessages: Math.floor(Math.random() * 1000) + 100,
//       leadsQualified: Math.floor(Math.random() * 50) + 10,
//       averageResponseTime: "1.2s",
//       successfulIntegrations: workflowDetails.credentials.length
//     }
//   }

//   const metrics = getPerformanceMetrics()

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="max-w-6xl mx-auto p-6">
//         {/* Enhanced Header */}
//         <div className="text-center mb-8">
//           <div className="flex items-center justify-center gap-3 mb-6">
//             <div className="relative">
//               {workflowDetails.status === "ACTIVE" ? (
//                 <PlayCircle className="h-10 w-10 text-green-500" />
//               ) : (
//                 <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
//               )}
//             </div>
//             <h1 className="text-4xl font-bold">
//               {workflowDetails.status === "ACTIVE" ? "Your Workflow is Live!" : "Workflow Dashboard"}
//             </h1>
//           </div>
//           <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
//             {workflowDetails.status === "ACTIVE" 
//               ? `Your "${workflowDetails.workflowTemplate?.name || "Custom Workflow"}" is actively automating responses for your business.`
//               : `Managing your "${workflowDetails.workflowTemplate?.name || "Custom Workflow"}" workflow.`
//             }
//           </p>
//           <div className="flex justify-center">
//             {getStatusBadge()}
//           </div>
//         </div>

//         {/* Workflow Overview Card */}
//         <Card className="border-2 border-primary/50 mb-8 p-2">
//           <CardHeader className="pb-4">
//             <CardTitle className="text-2xl flex items-center justify-center gap-2 text-primary">
//               <Sparkles className="h-6 w-6" />
//               Workflow Details
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="grid md:grid-cols-2 gap-6">
//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <Label className="text-sm font-semibold text-primary">Workflow Type:</Label>
//                   <p className="text-base bg-accent/50 p-3 rounded-lg font-medium">
//                     {workflowDetails.workflowTemplate?.name || "Custom Workflow"}
//                   </p>
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label className="text-sm font-semibold text-primary">Business Name:</Label>
//                   <p className="text-base bg-accent/50 p-3 rounded-lg">
//                     {workflowDetails.businessInfo.businessName}
//                   </p>
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label className="text-sm font-semibold text-primary">Business Type:</Label>
//                   <p className="text-base bg-accent/50 p-3 rounded-lg">
//                     {workflowDetails.businessInfo.businessType}
//                   </p>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <Label className="text-sm font-semibold text-primary">Status:</Label>
//                   <div className="bg-accent/50 p-3 rounded-lg">
//                     {getStatusBadge()}
//                   </div>
//                 </div>
                
//                 {workflowDetails.status === "ACTIVE" && workflowDetails.activatedAt && (
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Active Since:</Label>
//                     <p className="text-base bg-accent/50 p-3 rounded-lg flex items-center gap-2">
//                       <Calendar className="h-4 w-4 text-green-500" />
//                       {formatDate(workflowDetails.activatedAt)}
//                     </p>
//                     <p className="text-sm text-muted-foreground text-center">
//                       Running for {getDaysSinceActivation()} days
//                     </p>
//                   </div>
//                 )}

//                 {workflowDetails.customRequest && (
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Custom Requirements:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg whitespace-pre-wrap max-h-32 overflow-y-auto">
//                       {workflowDetails.customRequest}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
            
//             {workflowDetails.credentials && workflowDetails.credentials.length > 0 && (
//               <div className="space-y-2">
//                 <Label className="text-sm font-semibold text-primary">Active Integrations:</Label>
//                 <div className="flex flex-wrap gap-2">
//                   {workflowDetails.credentials.map((cred, idx) => (
//                     <Badge 
//                       key={idx} 
//                       variant="secondary" 
//                       className={`text-sm flex items-center gap-1 ${
//                         cred.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-700'
//                       }`}
//                     >
//                       <CheckCircle className="h-3 w-3" />
//                       {cred.integrationName}
//                     </Badge>
//                   ))}
//                 </div>
//                 </div>
//               )}
//           </CardContent>
//         </Card>

//         {/* Performance Metrics - Only show if workflow is active */}
//         {workflowDetails.status === "ACTIVE" && (
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             <Card className="border-2 border-border/50">
//               <CardContent className="p-6">
//                 <div className="flex items-center gap-3 mb-2">
//                   <MessageSquare className="h-5 w-5 text-blue-500" />
//                   <span className="text-sm font-medium text-muted-foreground">Messages Handled</span>
//                 </div>
//                 <p className="text-3xl font-bold text-foreground">{metrics.totalMessages.toLocaleString()}</p>
//                 <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
//                   <TrendingUp className="h-3 w-3" />
//                   +12% this week
//                 </p>
//               </CardContent>
//             </Card>

//             <Card className="border-2 border-border/50">
//               <CardContent className="p-6">
//                 <div className="flex items-center gap-3 mb-2">
//                   <Users className="h-5 w-5 text-purple-500" />
//                   <span className="text-sm font-medium text-muted-foreground">Leads Qualified</span>
//                 </div>
//                 <p className="text-3xl font-bold text-foreground">{metrics.leadsQualified}</p>
//                 <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
//                   <TrendingUp className="h-3 w-3" />
//                   +8% this week
//                 </p>
//               </CardContent>
//             </Card>

//             <Card className="border-2 border-border/50">
//               <CardContent className="p-6">
//                 <div className="flex items-center gap-3 mb-2">
//                   <Clock className="h-5 w-5 text-orange-500" />
//                   <span className="text-sm font-medium text-muted-foreground">Avg Response Time</span>
//                 </div>
//                 <p className="text-3xl font-bold text-foreground">{metrics.averageResponseTime}</p>
//                 <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
//                   <TrendingUp className="h-3 w-3" />
//                   15% faster
//                 </p>
//               </CardContent>
//             </Card>

//             <Card className="border-2 border-border/50">
//               <CardContent className="p-6">
//                 <div className="flex items-center gap-3 mb-2">
//                   <Zap className="h-5 w-5 text-green-500" />
//                   <span className="text-sm font-medium text-muted-foreground">Active Integrations</span>
//                 </div>
//                 <p className="text-3xl font-bold text-foreground">{metrics.successfulIntegrations}</p>
//                 <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
//                   <CheckCircle className="h-3 w-3" />
//                   All working
//                 </p>
//               </CardContent>
//             </Card>
//           </div>
//         )}

//         {/* Analytics Placeholder */}
//         <Card className="border-2 border-border/50 mb-8">
//           <CardHeader>
//             <CardTitle className="text-2xl flex items-center justify-center gap-2 text-primary">
//               <BarChart className="h-6 w-6" />
//               {workflowDetails.status === "ACTIVE" ? "Analytics & Insights" : "Analytics (Coming Soon)"}
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {workflowDetails.status === "ACTIVE" ? (
//               <div>
//                 <p className="text-muted-foreground text-center mb-6">
//                   Advanced analytics and performance insights will be available here once your workflow 
//                   has processed more data.
//                 </p>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   <div className="space-y-2 bg-accent/50 p-4 rounded-lg text-center">
//                     <Label className="text-sm font-semibold text-primary">Automation Rate:</Label>
//                     <p className="text-2xl font-bold text-foreground">94%</p>
//                   </div>
//                   <div className="space-y-2 bg-accent/50 p-4 rounded-lg text-center">
//                     <Label className="text-sm font-semibold text-primary">Customer Satisfaction:</Label>
//                     <p className="text-2xl font-bold text-foreground">4.8/5</p>
//                   </div>
//                   <div className="space-y-2 bg-accent/50 p-4 rounded-lg text-center">
//                     <Label className="text-sm font-semibold text-primary">Cost Savings:</Label>
//                     <p className="text-2xl font-bold text-foreground">$2,400</p>
//                   </div>
//                   <div className="space-y-2 bg-accent/50 p-4 rounded-lg text-center">
//                     <Label className="text-sm font-semibold text-primary">Time Saved:</Label>
//                     <p className="text-2xl font-bold text-foreground">18h/week</p>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <p className="text-muted-foreground text-center">
//                 Detailed insights into your workflow&apos;s performance, message volume, and lead qualification 
//                 will appear here once your workflow is active.
//               </p>
//             )}
//           </CardContent>
//         </Card>

//         {/* Recent Activity Placeholder */}
//         <Card className="border-2 border-border/50 mb-8">
//           <CardHeader>
//             <CardTitle className="text-2xl flex items-center justify-center gap-2 text-primary">
//               <Activity className="h-6 w-6" />
//               Recent Activity {workflowDetails.status !== "ACTIVE" && "(Coming Soon)"}
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {workflowDetails.status === "ACTIVE" ? (
//               <div>
//                 <p className="text-muted-foreground text-center mb-4">
//                   Live activity feed will show real-time interactions, integration calls, and workflow events.
//                 </p>
//                 <ul className="space-y-3 text-sm">
//                   <li className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
//                     <div className="w-2 h-2 rounded-full bg-green-500"></div>
//                     <span className="flex-1">Customer inquiry processed successfully</span>
//                     <span className="text-muted-foreground">2 minutes ago</span>
//                   </li>
//                   <li className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
//                     <div className="w-2 h-2 rounded-full bg-blue-500"></div>
//                     <span className="flex-1">Lead qualified and added to CRM</span>
//                     <span className="text-muted-foreground">5 minutes ago</span>
//                   </li>
//                   <li className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
//                     <div className="w-2 h-2 rounded-full bg-purple-500"></div>
//                     <span className="flex-1">Automated follow-up email sent</span>
//                     <span className="text-muted-foreground">12 minutes ago</span>
//                   </li>
//                 </ul>
//               </div>
//             ) : (
//               <p className="text-muted-foreground text-center">
//                 Activity log will show interactions, integration calls, and workflow events once your workflow is active.
//               </p>
//             )}
//           </CardContent>
//         </Card>

//         {/* Support & Contact */}
//         <Card className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10 mb-8">
//           <CardContent className="p-6">
//             <div className="text-center">
//               <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 text-lg">
//                 Need Help or Want to Upgrade?
//               </h3>
//               <p className="text-blue-700 dark:text-blue-400 mb-4">
//                 Our team is here to help optimize your workflow or add new features.
//               </p>
//               <div className="flex flex-wrap justify-center gap-4 text-sm text-blue-600 dark:text-blue-400">
//                 <div className="flex items-center gap-2">
//                   <Mail className="h-4 w-4" />
//                   <span>support@yourcompany.com</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Phone className="h-4 w-4" />
//                   <span>+1 (555) 123-4567</span>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Action Buttons */}
//         <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//           {workflowDetails.status === "ACTIVE" && (
//             <Button
//               onClick={onDeactivate}
//               disabled={isDeactivating}
//               size="lg"
//               variant="secondary"
//               className="px-8 py-3 text-base font-semibold"
//             >
//               {isDeactivating ? (
//                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//               ) : (
//                 <PauseCircle className="h-4 w-4 mr-2" />
//               )}
//               {isDeactivating ? "Deactivating..." : "Deactivate Workflow"}
//             </Button>
//           )}
          
//           <Button
//             variant="outline"
//             size="lg"
//             onClick={() => window.location.reload()}
//             className="px-8 py-3 text-base font-semibold"
//           >
//             <Activity className="h-4 w-4 mr-2" />
//             Refresh Status
//           </Button>
//         </div>

//         <div className="text-center mt-6">
//           <p className="text-xs text-muted-foreground">
//             {workflowDetails.status === "ACTIVE" 
//               ? "To create a different workflow, please deactivate the current one first."
//               : "Your workflow will appear here once development is complete."
//             }
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }







// "use client"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Label } from "@/components/ui/label"
// import {
//   Loader2,
//   PlayCircle,
//   PauseCircle,
//   Sparkles,
//   BarChart,
//   Activity,
//   CheckCircle,
//   Clock,
//   Users,
//   MessageSquare,
//   TrendingUp,
//   Zap,
//   Calendar,
//   Mail,
//   Phone,
//   Edit,
// } from "lucide-react"
// import type { BusinessWorkflowConfig } from "@/types/workflow" // Import centralized type

// interface WorkflowDashboardProps {
//   workflowDetails: BusinessWorkflowConfig
//   onDeactivate: () => void
//   isDeactivating: boolean
// }

// export default function WorkflowDashboard({ workflowDetails, onDeactivate, isDeactivating }: WorkflowDashboardProps) {
//   const formatDate = (date: Date | string | undefined) => {
//     if (!date) return "N/A"
//     const dateObj = typeof date === "string" ? new Date(date) : date
//     return dateObj.toLocaleDateString("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     })
//   }

//   const getDaysSinceActivation = () => {
//     if (!workflowDetails.activatedAt) return 0
//     const activatedDate = new Date(workflowDetails.activatedAt)
//     const now = new Date()
//     const diffTime = Math.abs(now.getTime() - activatedDate.getTime())
//     return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
//   }

//   const getStatusBadge = () => {
//     switch (workflowDetails.status) {
//       case "ACTIVE":
//         return (
//           <Badge className="bg-green-600 text-green-50 font-bold px-3 py-1 rounded-full text-sm flex items-center w-fit">
//             <PlayCircle className="h-4 w-4 mr-2" />
//             ACTIVE & RUNNING
//           </Badge>
//         )
//       case "PENDING_CREATION":
//         return (
//           <Badge className="bg-blue-600 text-blue-50 font-bold px-3 py-1 rounded-full text-sm flex items-center w-fit">
//             <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//             IN DEVELOPMENT
//           </Badge>
//         )
//       case "INACTIVE":
//         return (
//           <Badge className="bg-gray-600 text-gray-50 font-bold px-3 py-1 rounded-full text-sm flex items-center w-fit">
//             <PauseCircle className="h-4 w-4 mr-2" />
//             INACTIVE
//           </Badge>
//         )
//       case "EDIT_REQUESTED":
//         return (
//           <Badge className="bg-orange-600 text-orange-50 font-bold px-3 py-1 rounded-full text-sm flex items-center w-fit">
//             <Edit className="h-4 w-4 mr-2" />
//             EDIT REQUESTED
//           </Badge>
//         )
//       default:
//         return (
//           <Badge variant="outline" className="font-bold px-3 py-1 rounded-full text-sm">
//             {workflowDetails.status.replace(/_/g, " ")}
//           </Badge>
//         )
//     }
//   }

//   // Directly use performanceMetrics from workflowDetails, no mock data
//   const metrics = workflowDetails.performanceMetrics

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="max-w-6xl mx-auto p-6">
//         {/* Enhanced Header */}
//         <div className="text-center mb-8">
//           <div className="flex items-center justify-center gap-3 mb-6">
//             <div className="relative">
//               {workflowDetails.status === "ACTIVE" ? (
//                 <PlayCircle className="h-10 w-10 text-green-500" />
//               ) : (
//                 <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
//               )}
//             </div>
//             <h1 className="text-4xl font-bold">
//               {workflowDetails.status === "ACTIVE" ? "Your Workflow is Live!" : "Workflow Dashboard"}
//             </h1>
//           </div>
//           <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
//             {workflowDetails.status === "ACTIVE"
//               ? `Your "${workflowDetails.workflowTemplate?.name || "Custom Workflow"}" is actively automating responses for your business.`
//               : `Managing your "${workflowDetails.workflowTemplate?.name || "Custom Workflow"}" workflow.`}
//           </p>
//           <div className="flex justify-center">{getStatusBadge()}</div>
//         </div>

//         {/* Workflow Overview Card */}
//         <Card className="border-2 border-primary/50 mb-8 p-2">
//           <CardHeader className="pb-4">
//             <CardTitle className="text-2xl flex items-center justify-center gap-2 text-primary">
//               <Sparkles className="h-6 w-6" />
//               Workflow Details
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="grid md:grid-cols-2 gap-6">
//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <Label className="text-sm font-semibold text-primary">Workflow Type:</Label>
//                   <p className="text-base bg-accent/50 p-3 rounded-lg font-medium">
//                     {workflowDetails.workflowTemplate?.name || "Custom Workflow"}
//                   </p>
//                 </div>

//                 <div className="space-y-2">
//                   <Label className="text-sm font-semibold text-primary">Business Name:</Label>
//                   <p className="text-base bg-accent/50 p-3 rounded-lg">{workflowDetails.businessInfo.businessName}</p>
//                 </div>

//                 <div className="space-y-2">
//                   <Label className="text-sm font-semibold text-primary">Business Type:</Label>
//                   <p className="text-base bg-accent/50 p-3 rounded-lg">{workflowDetails.businessInfo.businessType}</p>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <Label className="text-sm font-semibold text-primary">Status:</Label>
//                   <div className="bg-accent/50 p-3 rounded-lg">{getStatusBadge()}</div>
//                 </div>

//                 {workflowDetails.status === "ACTIVE" && workflowDetails.activatedAt && (
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Active Since:</Label>
//                     <p className="text-base bg-accent/50 p-3 rounded-lg flex items-center gap-2">
//                       <Calendar className="h-4 w-4 text-green-500" />
//                       {formatDate(workflowDetails.activatedAt)}
//                     </p>
//                     <p className="text-sm text-muted-foreground text-center">
//                       Running for {getDaysSinceActivation()} days
//                     </p>
//                   </div>
//                 )}

//                 {workflowDetails.customRequest && (
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Custom Requirements:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg whitespace-pre-wrap max-h-32 overflow-y-auto">
//                       {workflowDetails.customRequest}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {workflowDetails.credentials && workflowDetails.credentials.length > 0 && (
//               <div className="space-y-2">
//                 <Label className="text-sm font-semibold text-primary">Active Integrations:</Label>
//                 <div className="flex flex-wrap gap-2">
//                   {workflowDetails.credentials.map((cred, idx) => (
//                     <Badge
//                       key={idx}
//                       variant="secondary"
//                       className={`text-sm flex items-center gap-1 ${
//                         cred.isActive
//                           ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
//                           : "bg-gray-100 text-gray-700"
//                       }`}
//                     >
//                       <CheckCircle className="h-3 w-3" />
//                       {cred.integrationName}
//                     </Badge>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Performance Metrics - Only show if workflow is active and metrics exist */}
//         {workflowDetails.status === "ACTIVE" && metrics ? (
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             <Card className="border-2 border-border/50">
//               <CardContent className="p-6">
//                 <div className="flex items-center gap-3 mb-2">
//                   <MessageSquare className="h-5 w-5 text-blue-500" />
//                   <span className="text-sm font-medium text-muted-foreground">Messages Handled</span>
//                 </div>
//                 <p className="text-3xl font-bold text-foreground">{metrics.totalMessages.toLocaleString()}</p>
//                 <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
//                   <TrendingUp className="h-3 w-3 text-green-600" />
//                   {"Data from last 7 days"}
//                 </p>
//               </CardContent>
//             </Card>

//             <Card className="border-2 border-border/50">
//               <CardContent className="p-6">
//                 <div className="flex items-center gap-3 mb-2">
//                   <Users className="h-5 w-5 text-purple-500" />
//                   <span className="text-sm font-medium text-muted-foreground">Leads Qualified</span>
//                 </div>
//                 <p className="text-3xl font-bold text-foreground">{metrics.leadsQualified}</p>
//                 <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
//                   <TrendingUp className="h-3 w-3 text-green-600" />
//                   {"Data from last 7 days"}
//                 </p>
//               </CardContent>
//             </Card>

//             <Card className="border-2 border-border/50">
//               <CardContent className="p-6">
//                 <div className="flex items-center gap-3 mb-2">
//                   <Clock className="h-5 w-5 text-orange-500" />
//                   <span className="text-sm font-medium text-muted-foreground">Avg Response Time</span>
//                 </div>
//                 <p className="text-3xl font-bold text-foreground">{metrics.averageResponseTime}</p>
//                 <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
//                   <TrendingUp className="h-3 w-3 text-green-600" />
//                   {"Based on recent interactions"}
//                 </p>
//               </CardContent>
//             </Card>

//             <Card className="border-2 border-border/50">
//               <CardContent className="p-6">
//                 <div className="flex items-center gap-3 mb-2">
//                   <Zap className="h-5 w-5 text-green-500" />
//                   <span className="text-sm font-medium text-muted-foreground">Active Integrations</span>
//                 </div>
//                 <p className="text-3xl font-bold text-foreground">{metrics.successfulIntegrations}</p>
//                 <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
//                   <CheckCircle className="h-3 w-3 text-green-600" />
//                   {"All connected"}
//                 </p>
//               </CardContent>
//             </Card>
//           </div>
//         ) : (
//           <Card className="border-2 border-border/50 mb-8">
//             <CardHeader>
//               <CardTitle className="text-2xl flex items-center justify-center gap-2 text-primary">
//                 <BarChart className="h-6 w-6" />
//                 Performance Metrics
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4 text-center">
//               <p className="text-muted-foreground">
//                 Performance metrics will appear here once your workflow is active and has processed data.
//               </p>
//             </CardContent>
//           </Card>
//         )}

//         {/* Analytics Placeholder */}
//         <Card className="border-2 border-border/50 mb-8">
//           <CardHeader>
//             <CardTitle className="text-2xl flex items-center justify-center gap-2 text-primary">
//               <BarChart className="h-6 w-6" />
//               Analytics & Insights
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4 text-center">
//             <p className="text-muted-foreground">
//               Advanced analytics and performance insights will be available here once your workflow has processed more
//               data.
//             </p>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               <div className="space-y-2 bg-accent/50 p-4 rounded-lg text-center">
//                 <Label className="text-sm font-semibold text-primary">Automation Rate:</Label>
//                 <p className="text-2xl font-bold text-foreground">N/A</p>
//               </div>
//               <div className="space-y-2 bg-accent/50 p-4 rounded-lg text-center">
//                 <Label className="text-sm font-semibold text-primary">Customer Satisfaction:</Label>
//                 <p className="text-2xl font-bold text-foreground">N/A</p>
//               </div>
//               <div className="space-y-2 bg-accent/50 p-4 rounded-lg text-center">
//                 <Label className="text-sm font-semibold text-primary">Cost Savings:</Label>
//                 <p className="text-2xl font-bold text-foreground">N/A</p>
//               </div>
//               <div className="space-y-2 bg-accent/50 p-4 rounded-lg text-center">
//                 <Label className="text-sm font-semibold text-primary">Time Saved:</Label>
//                 <p className="text-2xl font-bold text-foreground">N/A</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Recent Activity Placeholder */}
//         <Card className="border-2 border-border/50 mb-8">
//           <CardHeader>
//             <CardTitle className="text-2xl flex items-center justify-center gap-2 text-primary">
//               <Activity className="h-6 w-6" />
//               Recent Activity
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4 text-center">
//             <p className="text-muted-foreground">
//               Live activity feed will show real-time interactions, integration calls, and workflow events once your
//               workflow is active.
//             </p>
//             <ul className="space-y-3 text-sm text-muted-foreground">
//               <li className="p-3 bg-muted/50 rounded-lg">No recent activity to display.</li>
//             </ul>
//           </CardContent>
//         </Card>

//         {/* Support & Contact */}
//         <Card className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10 mb-8">
//           <CardContent className="p-6">
//             <div className="text-center">
//               <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 text-lg">
//                 Need Help or Want to Upgrade?
//               </h3>
//               <p className="text-blue-700 dark:text-blue-400 mb-4">
//                 Our team is here to help optimize your workflow or add new features.
//               </p>
//               <div className="flex flex-wrap justify-center gap-4 text-sm text-blue-600 dark:text-blue-400">
//                 <div className="flex items-center gap-2">
//                   <Mail className="h-4 w-4" />
//                   <span>support@yourcompany.com</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Phone className="h-4 w-4" />
//                   <span>+1 (555) 123-4567</span>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Action Buttons */}
//         <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//           {workflowDetails.status === "ACTIVE" && (
//             <Button
//               onClick={onDeactivate}
//               disabled={isDeactivating}
//               size="lg"
//               variant="secondary"
//               className="px-8 py-3 text-base font-semibold"
//             >
//               {isDeactivating ? (
//                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//               ) : (
//                 <PauseCircle className="h-4 w-4 mr-2" />
//               )}
//               {isDeactivating ? "Deactivating..." : "Deactivate Workflow"}
//             </Button>
//           )}

//           <Button
//             variant="outline"
//             size="lg"
//             onClick={() => window.location.reload()}
//             className="px-8 py-3 text-base font-semibold"
//           >
//             <Activity className="h-4 w-4 mr-2" />
//             Refresh Status
//           </Button>
//         </div>

//         <div className="text-center mt-6">
//           <p className="text-xs text-muted-foreground">
//             {workflowDetails.status === "ACTIVE"
//               ? "To create a different workflow, please deactivate the current one first."
//               : "Your workflow will appear here once development is complete."}
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  XCircle,
  Zap,
  Clock,
  Users,
  MessageSquare,
  LayoutDashboard,
  Loader2,
  AlertTriangle,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import type { BusinessWorkflowConfig } from "@/types/workflow"

interface WorkflowDashboardProps {
  workflowDetails: BusinessWorkflowConfig
  onDeactivate: () => void
  isDeactivating: boolean
}

export default function WorkflowDashboard({ workflowDetails, onDeactivate, isDeactivating }: WorkflowDashboardProps) {
  const [loadingAnalytics, setLoadingAnalytics] = useState(true)
  const [analyticsData, setAnalyticsData] = useState<any>(null) // Replace 'any' with actual analytics type

  useEffect(() => {
    fetchAnalytics()
  }, [workflowDetails.id])

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true)
    try {
      // This is a placeholder. In a real app, you'd fetch analytics specific to this workflow config.
      const response = await fetch(`/api/workflow-analytics?workflowConfigId=${workflowDetails.id}`)
      const data = await response.json()
      setAnalyticsData(data)
    } catch (error) {
      console.error("Error fetching workflow analytics:", error)
      toast({
        title: "Analytics Error",
        description: "Failed to load workflow analytics.",
        variant: "destructive",
      })
    } finally {
      setLoadingAnalytics(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800"
      case "INACTIVE":
        return "bg-red-100 text-red-800"
      case "DRAFT":
        return "bg-blue-100 text-blue-800"
      case "PENDING_CREATION":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Workflow Dashboard</h2>
        <Button onClick={onDeactivate} variant="destructive" disabled={isDeactivating}>
          {isDeactivating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deactivating...
            </>
          ) : (
            <>
              <XCircle className="mr-2 h-4 w-4" />
              Deactivate Workflow
            </>
          )}
        </Button>
      </div>

      <Card className="border-l-4 border-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-blue-500" />
            {workflowDetails.template?.name || "Custom Workflow"}
          </CardTitle>
          <CardDescription>{workflowDetails.template?.description || workflowDetails.description}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Status:</p>
            <Badge className={getStatusColor(workflowDetails.status)}>
              {workflowDetails.isActive ? "Active" : "Inactive"} ({workflowDetails.status.replace(/_/g, " ")})
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium">Created On:</p>
            <p className="text-base">
              {new Date(workflowDetails.createdAt).toLocaleDateString()} at{" "}
              {new Date(workflowDetails.createdAt).toLocaleTimeString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Last Updated:</p>
            <p className="text-base">
              {new Date(workflowDetails.updatedAt).toLocaleDateString()} at{" "}
              {new Date(workflowDetails.updatedAt).toLocaleTimeString()}
            </p>
          </div>
          {workflowDetails.template?.category && (
            <div>
              <p className="text-sm font-medium">Category:</p>
              <p className="text-base">{workflowDetails.template.category}</p>
            </div>
          )}
          {workflowDetails.template?.complexity && (
            <div>
              <p className="text-sm font-medium">Complexity:</p>
              <p className="text-base">{workflowDetails.template.complexity}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {(workflowDetails.template?.features || []).map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  {feature}
                </li>
              ))}
              {(workflowDetails.template?.features || []).length === 0 && (
                <p className="text-sm text-muted-foreground">No specific features listed for this workflow.</p>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {(workflowDetails.template?.integrations || []).map((integration: any, index: number) => (
                <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="h-4 w-4 text-purple-500" />
                  {integration.name}
                  {/* You might want to show connection status here based on workflowDetails.credentials */}
                  {workflowDetails.credentials.some(
                    (cred) => cred.integrationName === integration.name && cred.isActive,
                  ) ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700">
                      Not Connected
                    </Badge>
                  )}
                </li>
              ))}
              {(workflowDetails.template?.integrations || []).length === 0 && (
                <p className="text-sm text-muted-foreground">No external integrations required.</p>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workflow Performance (Last 30 Days)</CardTitle>
          <CardDescription>Overview of your workflow's operational metrics.</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingAnalytics ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading analytics...</span>
            </div>
          ) : analyticsData ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                <Users className="h-8 w-8 text-blue-500 mb-2" />
                <p className="text-2xl font-bold">{analyticsData.totalInteractions || 0}</p>
                <p className="text-sm text-muted-foreground">Total Interactions</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                <MessageSquare className="h-8 w-8 text-green-500 mb-2" />
                <p className="text-2xl font-bold">{analyticsData.automatedConversations || 0}</p>
                <p className="text-sm text-muted-foreground">Automated Conversations</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                <Clock className="h-8 w-8 text-purple-500 mb-2" />
                <p className="text-2xl font-bold">{analyticsData.avgResponseTime || "N/A"}</p>
                <p className="text-sm text-muted-foreground">Avg. Response Time</p>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
              <p>No analytics available for this workflow yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
