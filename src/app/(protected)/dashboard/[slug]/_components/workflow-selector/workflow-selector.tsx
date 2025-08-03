

// "use client"
// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import {
//   Clock,
//   Users,
//   CheckCircle,
//   ArrowLeft,
//   Sparkles,
//   Loader2,
//   AlertTriangle,
//   Database,
//   Settings,
// } from "lucide-react"
// import WorkflowDashboard from "./workflow-dashboard"
// import CustomWorkflowBuilder from "./custom-workflow-builder"
// import WorkflowPendingPage from "./workflow-pending-page"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog"

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
//   integrations: { name: string; config: any }[]
//   customRequest?: string
//   status: "DRAFT" | "CONFIGURING" | "SUBMITTED" | "PENDING_CREATION" | "ACTIVE" | "INACTIVE" | "CUSTOM_REQUEST"
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
//   submittedAt?: Date
//   estimatedCompletion?: string
// }

// interface PendingWorkflowData {
//   id: string
//   submittedAt: string
//   status: string
//   workflowType?: string
//   estimatedCompletion?: string
// }

// interface CRMIntegration {
//   id: string
//   provider: string
//   name: string
//   isActive: boolean
//   createdAt: string
// }

// export default function WorkflowSelector() {
//   const [step, setStep] = useState<
//     "selection" | "configuration" | "review" | "dashboard" | "custom-builder" | "pending"
//   >("selection")
//   const [businessInfo, setBusinessInfo] = useState({
//     businessName: "",
//     businessType: "",
//     description: "",
//     website: "",
//     phone: "",
//     email: "",
//   })
//   const [customRequest, setCustomRequest] = useState("")
//   const [isCustomWorkflow, setIsCustomWorkflow] = useState(false)
//   const [isDefaultWorkflow, setIsDefaultWorkflow] = useState(false)

//   // WORKFLOW STATE MANAGEMENT
//   const [activeWorkflowExists, setActiveWorkflowExists] = useState(false)
//   const [activeWorkflowDetails, setActiveWorkflowDetails] = useState<BusinessWorkflowConfig | null>(null)
//   const [isFetchingActiveWorkflow, setIsFetchingActiveWorkflow] = useState(true)
//   const [isDeactivating, setIsDeactivating] = useState(false)
//   const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false)

//   // CRM Integration state
//   const [crmIntegrations, setCrmIntegrations] = useState<CRMIntegration[]>([])
//   const [isFetchingCRM, setIsFetchingCRM] = useState(true)

//   // Pending workflow states
//   const [pendingWorkflowData, setPendingWorkflowData] = useState<PendingWorkflowData | null>(null)
//   const [workflowCreationStatus, setWorkflowCreationStatus] = useState<
//     "not-started" | "submitted" | "in-progress" | "completed"
//   >("not-started")

//   const currentBusinessId = "b909f187-d423-455b-b9bc-c8f9219e48b8"

//   // Fetch active workflow and CRM integrations
//   useEffect(() => {
//     const fetchWorkflowStatus = async () => {
//       setIsFetchingActiveWorkflow(true)
//       setIsFetchingCRM(true)

//       try {
//         if (!currentBusinessId) {
//           console.warn("No business ID available to fetch workflow status.")
//           setIsFetchingActiveWorkflow(false)
//           setIsFetchingCRM(false)
//           return
//         }

//         // Check for pending workflow in localStorage first
//         const storedPending = localStorage.getItem("pendingWorkflow")
//         if (storedPending) {
//           const pendingData: PendingWorkflowData = JSON.parse(storedPending)

//           // Verify the status with backend
//           const statusResponse = await fetch(`/api/workflow-config/${pendingData.id}`)
//           if (statusResponse.ok) {
//             const statusData = await statusResponse.json()

//             if (statusData.status === "ACTIVE") {
//               // Workflow is now active, remove from localStorage and show dashboard
//               localStorage.removeItem("pendingWorkflow")
//               setActiveWorkflowExists(true)
//               setActiveWorkflowDetails(statusData)
//               setWorkflowCreationStatus("completed")
//               setStep("dashboard")
//             } else if (statusData.status === "PENDING_CREATION") {
//               // Still pending, show pending page
//               setPendingWorkflowData(pendingData)
//               setWorkflowCreationStatus("in-progress")
//               setStep("pending")
//             } else {
//               // Some other status, clean up localStorage
//               localStorage.removeItem("pendingWorkflow")
//             }
//           } else {
//             // Workflow not found, clean up localStorage
//             localStorage.removeItem("pendingWorkflow")
//           }
//         }

//         // Fetch active workflows and CRM integrations in parallel
//         const [workflowResponse, crmResponse] = await Promise.all([
//           fetch(`/api/workflow-config?businessId=${currentBusinessId}&status=ACTIVE`),
//           fetch(`/api/crm/integrations?userId=${currentBusinessId}`), // Assuming userId maps to businessId
//         ])

//         // Handle workflow response
//         if (workflowResponse.ok) {
//           const workflowData = await workflowResponse.json()
//           if (workflowData.workflowConfigs && workflowData.workflowConfigs.length > 0) {
//             const activeConfig = workflowData.workflowConfigs[0]
//             setActiveWorkflowExists(true)
//             setActiveWorkflowDetails(activeConfig)
//             setWorkflowCreationStatus("completed")

//             // Only set to dashboard if we're not already showing pending
//             if (step !== "pending") {
//               setStep("dashboard")
//             }
//           } else {
//             setActiveWorkflowExists(false)
//             setActiveWorkflowDetails(null)
//           }
//         }

//         // Handle CRM response
//         if (crmResponse.ok) {
//           const crmData = await crmResponse.json()
//           setCrmIntegrations(crmData.integrations || [])
//         } else {
//           console.error("Failed to fetch CRM integrations:", await crmResponse.text())
//         }
//       } catch (error) {
//         console.error("Error fetching workflow status:", error)
//       } finally {
//         setIsFetchingActiveWorkflow(false)
//         setIsFetchingCRM(false)
//       }
//     }

//     fetchWorkflowStatus()
//   }, [currentBusinessId])

//   // Periodic status checking when in pending state
//   useEffect(() => {
//     let interval: NodeJS.Timeout | null = null

//     if (step === "pending" && pendingWorkflowData) {
//       interval = setInterval(async () => {
//         try {
//           const response = await fetch(`/api/workflow-config/${pendingWorkflowData.id}`)
//           if (response.ok) {
//             const data = await response.json()
//             if (data.status === "ACTIVE") {
//               localStorage.removeItem("pendingWorkflow")
//               setActiveWorkflowExists(true)
//               setActiveWorkflowDetails(data)
//               setWorkflowCreationStatus("completed")
//               setStep("dashboard")
//               setPendingWorkflowData(null)
//             }
//           }
//         } catch (error) {
//           console.error("Error checking workflow status:", error)
//         }
//       }, 30000) // Check every 30 seconds
//     }

//     return () => {
//       if (interval) clearInterval(interval)
//     }
//   }, [step, pendingWorkflowData])

//   const handleDefaultWorkflowSelect = () => {
//     if (activeWorkflowExists) return
//     setIsDefaultWorkflow(true)
//     setIsCustomWorkflow(false)
//     setCustomRequest("")
//     setStep("configuration")
//   }

//   const handleCustomWorkflowSelect = () => {
//     if (activeWorkflowExists) return
//     setIsCustomWorkflow(true)
//     setIsDefaultWorkflow(false)
//     setCustomRequest("")
//     setStep("custom-builder")
//   }

//   const handleBusinessInfoSubmit = () => {
//     setStep("review")
//   }

//   const handleFinalSubmit = async () => {
//     const businessIdToUse = currentBusinessId

//     if (!businessIdToUse) {
//       alert("Error: Business ID is missing. Cannot deploy workflow.")
//       return
//     }

//     // For default workflow, we don't need integrations array since CRM is handled automatically
//     const workflowData = {
//       workflowTemplateId: isDefaultWorkflow ? "default-crm-workflow" : null,
//       businessId: businessIdToUse,
//       businessInfo,
//       integrations: [], // Empty for default workflow - CRM credentials are fetched automatically
//       customRequest: isCustomWorkflow ? customRequest : undefined,
//       status: isDefaultWorkflow ? "ACTIVE" : "PENDING_CREATION", // Default workflow is immediately active
//       isActive: isDefaultWorkflow, // Default workflow is immediately active
//       submittedAt: new Date().toISOString(),
//       estimatedCompletion: isDefaultWorkflow ? "immediate" : "3-5",
//     }

//     console.log("Submitting workflow configuration:", workflowData)

//     try {
//       const response = await fetch("/api/workflow-config", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(workflowData),
//       })
//       const result = await response.json()

//       if (result.success) {
//         if (isDefaultWorkflow) {
//           // Default workflow is immediately active
//           setActiveWorkflowExists(true)
//           setActiveWorkflowDetails(result.workflowConfig)
//           setWorkflowCreationStatus("completed")
//           setStep("dashboard")
//         } else {
//           // Custom workflow goes to pending
//           const pendingData: PendingWorkflowData = {
//             id: result.workflowConfig.id,
//             submittedAt: new Date().toISOString(),
//             status: "PENDING_CREATION",
//             workflowType: "Custom Workflow",
//             estimatedCompletion: "3-5",
//           }

//           localStorage.setItem("pendingWorkflow", JSON.stringify(pendingData))
//           setPendingWorkflowData(pendingData)
//           setWorkflowCreationStatus("submitted")
//           setStep("pending")
//         }
//       } else {
//         alert(`Failed to submit workflow: ${result.error || "Unknown error"}`)
//       }
//     } catch (error) {
//       console.error("Error submitting workflow configuration:", error)
//       alert("An unexpected error occurred during submission.")
//     }
//   }

//   const handleDeactivateWorkflow = async () => {
//     if (!activeWorkflowDetails?.id) {
//       alert("No active workflow to deactivate.")
//       return
//     }
//     setShowDeactivateConfirm(true)
//   }

//   const confirmDeactivate = async () => {
//     setShowDeactivateConfirm(false)
//     setIsDeactivating(true)
//     try {
//       const response = await fetch("/api/workflow-config", {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           id: activeWorkflowDetails?.id,
//           isActive: false,
//           status: "INACTIVE",
//         }),
//       })

//       if (response.ok) {
//         alert("Workflow deactivated successfully!")
//         setActiveWorkflowExists(false)
//         setActiveWorkflowDetails(null)
//         setStep("selection")
//         setBusinessInfo({ businessName: "", businessType: "", description: "", website: "", phone: "", email: "" })
//         setCustomRequest("")
//         setIsCustomWorkflow(false)
//         setIsDefaultWorkflow(false)
//         setWorkflowCreationStatus("not-started")
//         setPendingWorkflowData(null)
//       } else {
//         const errorData = await response.json()
//         alert(`Failed to deactivate workflow: ${errorData.error || "Unknown error"}`)
//       }
//     } catch (error) {
//       console.error("Error deactivating workflow:", error)
//       alert("An unexpected error occurred during deactivation.")
//     } finally {
//       setIsDeactivating(false)
//     }
//   }

//   // --- CONDITIONAL RENDERING ---

//   if (isFetchingActiveWorkflow || isFetchingCRM) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <Loader2 className="h-10 w-10 animate-spin text-primary" />
//         <span className="ml-4 text-lg text-muted-foreground">Loading your workflows...</span>
//       </div>
//     )
//   }

//   // Render pending page
//   if (step === "pending" && pendingWorkflowData) {
//     return (
//       <WorkflowPendingPage
//         pendingWorkflowData={pendingWorkflowData}
//         businessInfo={businessInfo}
//         onBackToSelection={() => {
//           if (confirm("Are you sure you want to go back? Your pending workflow will remain in queue.")) {
//             setStep("selection")
//           }
//         }}
//       />
//     )
//   }

//   // Render dashboard if active workflow exists
//   if (activeWorkflowExists && activeWorkflowDetails && step === "dashboard") {
//     return (
//       <>
//         <WorkflowDashboard
//           workflowDetails={activeWorkflowDetails}
//           onDeactivate={handleDeactivateWorkflow}
//           isDeactivating={isDeactivating}
//         />
//         <AlertDialog open={showDeactivateConfirm} onOpenChange={setShowDeactivateConfirm}>
//           <AlertDialogContent>
//             <AlertDialogHeader>
//               <AlertDialogTitle className="flex items-center gap-2 text-red-500">
//                 <AlertTriangle className="h-6 w-6" />
//                 Confirm Deactivation
//               </AlertDialogTitle>
//               <AlertDialogDescription>
//                 Are you sure you want to deactivate your current workflow? This will stop all automated responses and
//                 you will need to set up a new one to resume automation.
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogCancel>Cancel</AlertDialogCancel>
//               <AlertDialogAction onClick={confirmDeactivate} className="bg-red-600 hover:bg-red-700">
//                 Deactivate
//               </AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>
//       </>
//     )
//   }

//   // Redirect to dashboard if active workflow exists but not on dashboard
//   if (activeWorkflowExists && activeWorkflowDetails && step !== "dashboard" && step !== "pending") {
//     setStep("dashboard")
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <Loader2 className="h-10 w-10 animate-spin text-primary" />
//         <span className="ml-4 text-lg text-muted-foreground">Redirecting to your active workflow dashboard...</span>
//       </div>
//     )
//   }

//   // Render CustomWorkflowBuilder
//   if (step === "custom-builder") {
//     return (
//       <CustomWorkflowBuilder
//         businessInfo={businessInfo}
//         selectedWorkflowId={null}
//         setStep={(s) => {
//           if (s === "selection" || s === "dashboard") {
//             setStep(s)
//           }
//         }}
//         setActiveWorkflowExists={setActiveWorkflowExists}
//         setActiveWorkflowDetails={setActiveWorkflowDetails}
//       />
//     )
//   }

//   // Main selection page with only 2 cards
//   if (step === "selection") {
//     const activeCRMIntegrations = crmIntegrations.filter((crm) => crm.isActive)

//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radiale--gradient--automations">
//           <div className="max-w-7xl mx-auto p-6">
//             <div className="text-center mb-12">
//               <div className="flex items-center justify-center gap-3 mb-6">
//                 <Sparkles className="h-8 w-8 text-primary" />
//                 <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Choose Your Business Workflow
//                 </h1>
//               </div>
//               <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
//                 Start with our default CRM workflow or request a custom solution tailored to your needs
//               </p>
//             </div>

//             <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
//               {/* Default CRM Workflow Card */}
//               <Card
//                 className={`cursor-pointer transition-all duration-300 border-2 glassEffect card-border-customer-support hover:scale-105 ${activeWorkflowExists ? "opacity-50 cursor-not-allowed" : ""}`}
//                 onClick={() => !activeWorkflowExists && handleDefaultWorkflowSelect()}
//               >
//                 <CardHeader className="pb-4">
//                   <div className="flex items-center gap-4 mb-4">
//                     <div className="p-3 rounded-xl bg-primary/10 template-icon-container">
//                       <Database className="h-6 w-6 text-chart-1" />
//                     </div>
//                     <div className="flex-1">
//                       <CardTitle className="text-xl mb-2">Default CRM Workflow</CardTitle>
//                       <Badge variant="outline" className="text-xs bg-chart-2/10 text-chart-2 border-chart-2/20">
//                         Recommended
//                       </Badge>
//                     </div>
//                   </div>
//                   <CardDescription className="text-sm leading-relaxed">
//                     Perfect for getting started quickly. Automatically qualifies leads through Instagram DMs and sends
//                     them directly to your connected CRM system.
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div>
//                     <h4 className="font-semibold text-sm mb-3 text-primary">Process Flow:</h4>
//                     <div className="space-y-2">
//                       {[
//                         "Receive Instagram DM",
//                         "AI lead qualification",
//                         "Collect contact information",
//                         "Send to your CRM",
//                         "Notify your team",
//                       ].map((operation, idx) => (
//                         <div key={idx} className="flex items-center gap-3">
//                           <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
//                             {idx + 1}
//                           </div>
//                           <span className="text-sm text-muted-foreground">{operation}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   <div>
//                     <h4 className="font-semibold text-sm mb-3 text-primary">Key Features:</h4>
//                     <ul className="space-y-2">
//                       {[
//                         "Instant lead qualification",
//                         "Automatic CRM integration",
//                         "Smart conversation handling",
//                         "Lead scoring & prioritization",
//                       ].map((feature, idx) => (
//                         <li key={idx} className="flex items-center gap-2 text-sm">
//                           <CheckCircle className="h-4 w-4 text-chart-2 flex-shrink-0" />
//                           <span className="text-muted-foreground">{feature}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>

//                   <div>
//                     <h4 className="font-semibold text-sm mb-3 text-primary">CRM Integration Status:</h4>
//                     {activeCRMIntegrations.length > 0 ? (
//                       <div className="space-y-2">
//                         {activeCRMIntegrations.map((crm) => (
//                           <div key={crm.id} className="flex items-center gap-2 text-sm bg-chart-2/10 p-2 rounded-lg">
//                             <CheckCircle className="h-4 w-4 text-chart-2" />
//                             <span className="text-foreground font-medium">{crm.provider}</span>
//                             <Badge variant="outline" className="ml-auto text-xs text-chart-2 border-chart-2/20">
//                               Connected
//                             </Badge>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="bg-destructive/10 p-3 rounded-lg">
//                         <div className="flex items-center gap-2 text-sm text-destructive mb-2">
//                           <AlertTriangle className="h-4 w-4" />
//                           <span className="font-medium">No CRM Connected</span>
//                         </div>
//                         <p className="text-xs text-muted-foreground">
//                           You need to connect a CRM first. Go to the Leads page to connect your CRM via OAuth.
//                         </p>
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex gap-2 mt-4">
//                     <Button
//                       onClick={() => handleDefaultWorkflowSelect()}
//                       className="flex-1"
//                       disabled={activeWorkflowExists || activeCRMIntegrations.length === 0}
//                     >
//                       {activeCRMIntegrations.length === 0 ? "Connect CRM First" : "Activate Default Workflow"}
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Custom Workflow Request Card */}
//               <Card
//                 className={`cursor-pointer transition-all duration-300 border-2 border-dashed border-border/50 glassEffect hover:border-primary/50 hover:shadow-lg flex flex-col ${activeWorkflowExists ? "opacity-50 cursor-not-allowed" : ""}`}
//                 onClick={() => !activeWorkflowExists && handleCustomWorkflowSelect()}
//               >
//                 <CardHeader className="pb-4">
//                   <div className="flex items-center gap-4 mb-4">
//                     <div className="p-3 rounded-xl bg-primary/10 template-icon-container">
//                       <Settings className="h-6 w-6 text-chart-4" />
//                     </div>
//                     <div className="flex-1">
//                       <CardTitle className="text-xl mb-2">Request Custom Workflow</CardTitle>
//                       <Badge variant="outline" className="text-xs bg-chart-4/10 text-chart-4 border-chart-4/20">
//                         Tailored Solution
//                       </Badge>
//                     </div>
//                   </div>
//                   <CardDescription className="text-sm leading-relaxed">
//                     Need something more specific? Describe your unique business requirements and we&apos;ll build a custom
//                     workflow just for you.
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6 flex-1">
//                   <div>
//                     <h4 className="font-semibold text-sm mb-3 text-primary">What You Get:</h4>
//                     <ul className="space-y-2">
//                       {[
//                         "Personalized workflow design",
//                         "Custom integrations",
//                         "Advanced automation logic",
//                         "Dedicated development support",
//                       ].map((feature, idx) => (
//                         <li key={idx} className="flex items-center gap-2 text-sm">
//                           <Sparkles className="h-4 w-4 text-chart-4 flex-shrink-0" />
//                           <span className="text-muted-foreground">{feature}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>

//                   <div>
//                     <h4 className="font-semibold text-sm mb-3 text-primary">Perfect For:</h4>
//                     <p className="text-xs text-muted-foreground leading-relaxed">
//                       Complex business processes, multiple integrations, unique industry requirements, or specialized
//                       automation needs that go beyond standard workflows.
//                     </p>
//                   </div>

//                   <div className="bg-chart-4/10 p-3 rounded-lg">
//                     <div className="flex items-center gap-2 text-sm text-chart-4 mb-1">
//                       <Clock className="h-4 w-4" />
//                       <span className="font-medium">Development Time: 3-5 business days</span>
//                     </div>
//                     <p className="text-xs text-muted-foreground">
//                       Our team will review your requirements and build your custom solution.
//                     </p>
//                   </div>

//                   <div className="flex gap-2 mt-auto">
//                     <Button
//                       onClick={() => handleCustomWorkflowSelect()}
//                       variant="outline"
//                       className="flex-1 bg-transparent hover:bg-accent"
//                       disabled={activeWorkflowExists}
//                     >
//                       Request Custom Workflow
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* CRM Connection Notice */}
//             {activeCRMIntegrations.length === 0 && (
//               <div className="max-w-4xl mx-auto mt-8">
//                 <Card className="border-2 border-destructive/20 bg-destructive/5">
//                   <CardContent className="p-6">
//                     <div className="flex items-start gap-4">
//                       <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-1" />
//                       <div>
//                         <h3 className="font-semibold text-destructive mb-2">CRM Integration Required</h3>
//                         <p className="text-sm text-muted-foreground mb-4">
//                           To use the default workflow, you need to connect a CRM system first. This allows us to
//                           automatically send qualified leads to your CRM.
//                         </p>
//                         <Button
//                           variant="outline"
//                           className="text-destructive border-destructive/20 hover:bg-destructive/10 bg-transparent"
//                         >
//                           Go to Leads Page to Connect CRM
//                         </Button>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // Configuration step for default workflow
//   if (step === "configuration") {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radiale--gradient--automations">
//           <div className="max-w-4xl mx-auto p-6">
//             <div className="mb-8">
//               <Button variant="ghost" onClick={() => setStep("selection")} className="mb-6 hover:bg-accent">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Selection
//               </Button>
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Configure Your {isDefaultWorkflow ? "Default CRM" : "Custom"} Workflow
//                 </h1>
//                 <p className="text-muted-foreground text-lg">
//                   Provide your business information to personalize the workflow
//                 </p>
//               </div>
//             </div>

//             <div className="grid gap-8 lg:grid-cols-2">
//               <Card className="glassEffect border-2 border-border/50">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Users className="h-5 w-5 text-primary" />
//                     Business Information
//                   </CardTitle>
//                   <CardDescription>
//                     This information will be used to personalize your automated responses
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div className="space-y-2">
//                     <Label htmlFor="businessName" className="text-sm font-medium">
//                       Business Name *
//                     </Label>
//                     <Input
//                       id="businessName"
//                       value={businessInfo.businessName}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, businessName: e.target.value }))}
//                       placeholder="Your Business Name"
//                       className="bg-background/50 border-border/50 focus:border-primary"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="businessType" className="text-sm font-medium">
//                       Business Type *
//                     </Label>
//                     <Input
//                       id="businessType"
//                       value={businessInfo.businessType}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, businessType: e.target.value }))}
//                       placeholder="e.g., Hair Salon, Photography Studio"
//                       className="bg-background/50 border-border/50 focus:border-primary"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="description" className="text-sm font-medium">
//                       Business Description
//                     </Label>
//                     <Textarea
//                       id="description"
//                       value={businessInfo.description}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, description: e.target.value }))}
//                       placeholder="Brief description of your services..."
//                       rows={3}
//                       className="bg-background/50 border-border/50 focus:border-primary resize-none"
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="website" className="text-sm font-medium">
//                         Website
//                       </Label>
//                       <Input
//                         id="website"
//                         value={businessInfo.website}
//                         onChange={(e) => setBusinessInfo((prev) => ({ ...prev, website: e.target.value }))}
//                         placeholder="https://yourwebsite.com"
//                         className="bg-background/50 border-border/50 focus:border-primary"
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="phone" className="text-sm font-medium">
//                         Phone Number
//                       </Label>
//                       <Input
//                         id="phone"
//                         value={businessInfo.phone}
//                         onChange={(e) => setBusinessInfo((prev) => ({ ...prev, phone: e.target.value }))}
//                         placeholder="+1 (555) 123-4567"
//                         className="bg-background/50 border-border/50 focus:border-primary"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="email" className="text-sm font-medium">
//                       Email
//                     </Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       value={businessInfo.email}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, email: e.target.value }))}
//                       placeholder="contact@yourbusiness.com"
//                       className="bg-background/50 border-border/50 focus:border-primary"
//                     />
//                   </div>
//                 </CardContent>
//               </Card>

//               <div className="space-y-8">
//                 <Card className="glassEffect border-2 card-border-customer-support">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Database className="h-5 w-5 text-chart-1" />
//                       Default CRM Workflow Overview
//                     </CardTitle>
//                     <CardDescription>Here&apos;s what your default workflow will include</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-6">
//                       <div>
//                         <h4 className="font-semibold mb-4 text-primary flex items-center gap-2">
//                           <Sparkles className="h-4 w-4" />
//                           Process Flow:
//                         </h4>
//                         <div className="space-y-3">
//                           {[
//                             "Receive Instagram DM",
//                             "AI lead qualification",
//                             "Collect contact information",
//                             "Send to your CRM",
//                             "Notify your team",
//                           ].map((operation, idx) => (
//                             <div key={idx} className="flex items-center gap-4">
//                               <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-semibold">
//                                 {idx + 1}
//                               </div>
//                               <span className="text-sm font-medium">{operation}</span>
//                             </div>
//                           ))}
//                         </div>
//                       </div>

//                       <div>
//                         <h4 className="font-semibold mb-4 text-primary">Key Features:</h4>
//                         <ul className="space-y-3">
//                           {[
//                             "Instant lead qualification",
//                             "Automatic CRM integration",
//                             "Smart conversation handling",
//                             "Lead scoring & prioritization",
//                             "Human handoff when needed",
//                             "Real-time notifications",
//                           ].map((feature, idx) => (
//                             <li key={idx} className="flex items-center gap-3 text-sm">
//                               <CheckCircle className="h-4 w-4 text-chart-2 flex-shrink-0" />
//                               <span>{feature}</span>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>

//                       <div>
//                         <h4 className="font-semibold mb-4 text-primary">Connected CRM:</h4>
//                         <div className="space-y-2">
//                           {crmIntegrations
//                             .filter((crm) => crm.isActive)
//                             .map((crm) => (
//                               <div key={crm.id} className="flex items-center gap-3 p-3 bg-chart-2/10 rounded-lg">
//                                 <CheckCircle className="h-4 w-4 text-chart-2" />
//                                 <span className="text-sm font-medium">{crm.provider}</span>
//                                 <Badge variant="outline" className="ml-auto text-xs text-chart-2 border-chart-2/20">
//                                   Active
//                                 </Badge>
//                               </div>
//                             ))}
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>

//             <div className="mt-10 flex justify-end">
//               <Button
//                 onClick={handleBusinessInfoSubmit}
//                 disabled={!businessInfo.businessName || !businessInfo.businessType}
//                 size="lg"
//                 className="px-8 py-3 text-base font-semibold"
//               >
//                 Continue to Review
//                 <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // Review step
//   if (step === "review") {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radiale--gradient--automations">
//           <div className="max-w-5xl mx-auto p-6">
//             <div className="mb-8">
//               <Button variant="ghost" onClick={() => setStep("configuration")} className="mb-6 hover:bg-accent">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Configuration
//               </Button>
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Review &amp; Deploy
//                 </h1>
//                 <p className="text-muted-foreground text-lg">
//                   Review your configuration before deploying your workflow
//                 </p>
//               </div>
//             </div>

//             <div className="grid gap-8 lg:grid-cols-2 mb-10">
//               <Card className="glassEffect border-2 border-border/50">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <CheckCircle className="h-5 w-5 text-green-500" />
//                     Workflow Summary
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Workflow Type:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg">
//                       {isDefaultWorkflow ? "Default CRM Workflow" : "Custom Workflow Request"}
//                     </p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Business Name:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg">{businessInfo.businessName}</p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Business Type:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg">{businessInfo.businessType}</p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Setup Time:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg flex items-center gap-2">
//                       <Clock className="h-4 w-4" />
//                       {isDefaultWorkflow ? "Immediate activation" : "3-5 business days"}
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="glassEffect border-2 border-border/50">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Database className="h-5 w-5 text-primary" />
//                     CRM Integration
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-3">
//                     {crmIntegrations
//                       .filter((crm) => crm.isActive)
//                       .map((crm) => (
//                         <div key={crm.id} className="flex items-center gap-3 p-3 bg-chart-2/10 rounded-lg">
//                           <CheckCircle className="h-4 w-4 text-chart-2" />
//                           <div className="flex-1">
//                             <span className="text-sm font-medium">{crm.provider}</span>
//                             <p className="text-xs text-muted-foreground">
//                               Connected on {new Date(crm.createdAt).toLocaleDateString()}
//                             </p>
//                           </div>
//                           <Badge variant="outline" className="text-xs text-chart-2 border-chart-2/20">
//                             Active
//                           </Badge>
//                         </div>
//                       ))}
//                   </div>
//                   <div className="mt-4 text-sm text-muted-foreground">
//                     {isDefaultWorkflow
//                       ? "Your CRM credentials will be automatically used by the workflow to send qualified leads."
//                       : "CRM integration will be configured as part of your custom workflow development."}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             <Card className="glassEffect border-2 border-primary/30 mb-10">
//               <CardContent className="p-6">
//                 <h3 className="font-semibold mb-4 flex items-center gap-2 text-primary">
//                   <Sparkles className="h-5 w-5" />
//                   What happens next?
//                 </h3>
//                 <ul className="space-y-3 text-sm text-muted-foreground">
//                   {isDefaultWorkflow ? (
//                     <>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Your default workflow will be activated immediately upon submission.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Instagram DMs will start being processed automatically using your CRM credentials.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Qualified leads will be sent directly to your connected{" "}
//                         {crmIntegrations.find((crm) => crm.isActive)?.provider || "CRM"}.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         You can monitor performance and leads from your dashboard.
//                       </li>
//                     </>
//                   ) : (
//                     <>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Your custom workflow request will be sent to our development team.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         We will email you at <strong>{businessInfo.email}</strong> when development begins.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         You can return to this page anytime to check the status of your workflow.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Once complete, your custom automation will be available in your dashboard.
//                       </li>
//                     </>
//                   )}
//                 </ul>
//               </CardContent>
//             </Card>

//             <div className="flex justify-between">
//               <Button variant="outline" onClick={() => setStep("configuration")} size="lg">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back
//               </Button>
//               <Button
//                 onClick={handleFinalSubmit}
//                 size="lg"
//                 className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8 py-3 text-base font-semibold glow"
//               >
//                 <Sparkles className="h-4 w-4 mr-2" />
//                 {isDefaultWorkflow ? "Activate Workflow 🚀" : "Submit for Development 🚀"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return null
// }


// "use client"
// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import {
//   Clock,
//   Users,
//   CheckCircle,
//   ArrowLeft,
//   Sparkles,
//   Loader2,
//   AlertTriangle,
//   Database,
//   Settings,
// } from "lucide-react"
// import WorkflowDashboard from "./workflow-dashboard"
// import CustomWorkflowBuilder from "./custom-workflow-builder"
// import WorkflowPendingPage from "./workflow-pending-page"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog"

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
//   integrations: { name: string; config: any }[]
//   customRequest?: string
//   status: "DRAFT" | "CONFIGURING" | "SUBMITTED" | "PENDING_CREATION" | "ACTIVE" | "INACTIVE" | "CUSTOM_REQUEST"
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
//   submittedAt?: Date
//   estimatedCompletion?: string
// }

// interface PendingWorkflowData {
//   id: string
//   submittedAt: string
//   status: string
//   workflowType?: string
//   estimatedCompletion?: string
// }

// interface CRMIntegration {
//   id: string
//   provider: string
//   name: string
//   isActive: boolean
//   createdAt: string
// }

// const Logger = {
//   info: (message: string, ...args: any[]) => {
//     console.log(`%cINFO: ${message}`, "color: blue;", ...args)
//   },
//   success: (message: string, ...args: any[]) => {
//     console.log(`%cSUCCESS: ${message}`, "color: green;", ...args)
//   },
//   warn: (message: string, ...args: any[]) => {
//     console.warn(`%cWARN: ${message}`, "color: orange;", ...args)
//   },
//   error: (message: string, ...args: any[]) => {
//     console.error(`%cERROR: ${message}`, "color: red;", ...args)
//   },
// }

// export default function WorkflowSelector() {
//   const [step, setStep] = useState<
//     "selection" | "configuration" | "review" | "dashboard" | "custom-builder" | "pending"
//   >("selection")
//   const [businessInfo, setBusinessInfo] = useState({
//     businessName: "",
//     businessType: "",
//     description: "",
//     website: "",
//     phone: "",
//     email: "",
//   })
//   const [customRequest, setCustomRequest] = useState("")
//   const [isCustomWorkflow, setIsCustomWorkflow] = useState(false)
//   const [isDefaultWorkflow, setIsDefaultWorkflow] = useState(false)

//   // WORKFLOW STATE MANAGEMENT
//   const [activeWorkflowExists, setActiveWorkflowExists] = useState(false)
//   const [activeWorkflowDetails, setActiveWorkflowDetails] = useState<BusinessWorkflowConfig | null>(null)
//   const [isFetchingActiveWorkflow, setIsFetchingActiveWorkflow] = useState(true)
//   const [isDeactivating, setIsDeactivating] = useState(false)
//   const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false)

//   // CRM Integration state
//   const [crmIntegrations, setCrmIntegrations] = useState<CRMIntegration[]>([])
//   const [isFetchingCRM, setIsFetchingCRM] = useState(true)

//   // Pending workflow states
//   const [pendingWorkflowData, setPendingWorkflowData] = useState<PendingWorkflowData | null>(null)
//   const [workflowCreationStatus, setWorkflowCreationStatus] = useState<
//     "not-started" | "submitted" | "in-progress" | "completed"
//   >("not-started")

//   const currentBusinessId = "b909f187-d423-455b-b9bc-c8f9219e48b8"

//   // Fetch active workflow and CRM integrations
//   useEffect(() => {
//     const fetchWorkflowStatus = async () => {
//       setIsFetchingActiveWorkflow(true)
//       setIsFetchingCRM(true)

//       try {
//         if (!currentBusinessId) {
//           console.warn("No business ID available to fetch workflow status.")
//           setIsFetchingActiveWorkflow(false)
//           setIsFetchingCRM(false)
//           return
//         }

//         // Check for pending workflow in localStorage first
//         const storedPending = localStorage.getItem("pendingWorkflow")
//         if (storedPending) {
//           const pendingData: PendingWorkflowData = JSON.parse(storedPending)

//           // Verify the status with backend
//           const statusResponse = await fetch(`/api/workflow-config/${pendingData.id}`)
//           if (statusResponse.ok) {
//             const statusData = await statusResponse.json()

//             if (statusData.status === "ACTIVE") {
//               // Workflow is now active, remove from localStorage and show dashboard
//               localStorage.removeItem("pendingWorkflow")
//               setActiveWorkflowExists(true)
//               setActiveWorkflowDetails(statusData)
//               setWorkflowCreationStatus("completed")
//               setStep("dashboard")
//             } else if (statusData.status === "PENDING_CREATION") {
//               // Still pending, show pending page
//               setPendingWorkflowData(pendingData)
//               setWorkflowCreationStatus("in-progress")
//               setStep("pending")
//             } else {
//               // Some other status, clean up localStorage
//               localStorage.removeItem("pendingWorkflow")
//             }
//           } else {
//             // Workflow not found, clean up localStorage
//             localStorage.removeItem("pendingWorkflow")
//           }
//         }

//         // Fetch active workflows and CRM integrations in parallel
//         const [workflowResponse, crmResponse] = await Promise.all([
//           fetch(`/api/workflow-config?businessId=${currentBusinessId}&status=ACTIVE`),
//           fetch(`/api/crm/integrations?userId=${currentBusinessId}`), // Assuming userId maps to businessId
//         ])

//         // Handle workflow response
//         if (workflowResponse.ok) {
//           const workflowData = await workflowResponse.json()
//           if (workflowData.workflowConfigs && workflowData.workflowConfigs.length > 0) {
//             const activeConfig = workflowData.workflowConfigs[0]
//             setActiveWorkflowExists(true)
//             setActiveWorkflowDetails(activeConfig)
//             setWorkflowCreationStatus("completed")

//             // Only set to dashboard if we're not already showing pending
//             if (step !== "pending") {
//               setStep("dashboard")
//             }
//           } else {
//             setActiveWorkflowExists(false)
//             setActiveWorkflowDetails(null)
//           }
//         }

//         // After the existing workflow and CRM fetching logic, add this auto-activation logic:
//         if (crmResponse.ok) {
//           const crmData = await crmResponse.json()
//           setCrmIntegrations(crmData.integrations || [])

//           // Auto-activate default workflow if CRM is connected but no active workflow exists
//           const activeCRMIntegrations = (crmData.integrations || []).filter((crm: any) => crm.isActive)

//           if (activeCRMIntegrations.length > 0 && !activeWorkflowExists && !storedPending) {
//             Logger.info("🚀 Auto-activating default workflow - CRM connected but no active workflow")

//             try {
//               const autoActivateResponse = await fetch("/api/workflow-config", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                   workflowTemplateId: "default-crm-workflow",
//                   businessId: currentBusinessId,
//                   businessInfo: {
//                     businessName: "Auto-activated Business",
//                     businessType: "Service Business",
//                     description: "Auto-activated default workflow",
//                   },
//                   integrations: [], // Empty for default workflow
//                   status: "ACTIVE",
//                   isActive: true,
//                   submittedAt: new Date().toISOString(),
//                   estimatedCompletion: "immediate",
//                 }),
//               })

//               if (autoActivateResponse.ok) {
//                 const result = await autoActivateResponse.json()
//                 if (result.success) {
//                   setActiveWorkflowExists(true)
//                   setActiveWorkflowDetails(result.workflowConfig)
//                   setWorkflowCreationStatus("completed")
//                   setStep("dashboard")
//                   Logger.success("✅ Default workflow auto-activated successfully")
//                 }
//               }
//             } catch (error) {
//               Logger.error("Failed to auto-activate default workflow:", error)
//             }
//           }
//         } else {
//           console.error("Failed to fetch CRM integrations:", await crmResponse.text())
//         }
//       } catch (error) {
//         console.error("Error fetching workflow status:", error)
//       } finally {
//         setIsFetchingActiveWorkflow(false)
//         setIsFetchingCRM(false)
//       }
//     }

//     fetchWorkflowStatus()
//   }, [currentBusinessId])

//   // Periodic status checking when in pending state
//   useEffect(() => {
//     let interval: NodeJS.Timeout | null = null

//     if (step === "pending" && pendingWorkflowData) {
//       interval = setInterval(async () => {
//         try {
//           const response = await fetch(`/api/workflow-config/${pendingWorkflowData.id}`)
//           if (response.ok) {
//             const data = await response.json()
//             if (data.status === "ACTIVE") {
//               localStorage.removeItem("pendingWorkflow")
//               setActiveWorkflowExists(true)
//               setActiveWorkflowDetails(data)
//               setWorkflowCreationStatus("completed")
//               setStep("dashboard")
//               setPendingWorkflowData(null)
//             }
//           }
//         } catch (error) {
//           console.error("Error checking workflow status:", error)
//         }
//       }, 30000) // Check every 30 seconds
//     }

//     return () => {
//       if (interval) clearInterval(interval)
//     }
//   }, [step, pendingWorkflowData])

//   const handleDefaultWorkflowSelect = () => {
//     if (activeWorkflowExists) return
//     setIsDefaultWorkflow(true)
//     setIsCustomWorkflow(false)
//     setCustomRequest("")
//     setStep("configuration")
//   }

//   const handleCustomWorkflowSelect = () => {
//     if (activeWorkflowExists) return
//     setIsCustomWorkflow(true)
//     setIsDefaultWorkflow(false)
//     setCustomRequest("")
//     setStep("custom-builder")
//   }

//   const handleBusinessInfoSubmit = () => {
//     setStep("review")
//   }

//   const handleFinalSubmit = async () => {
//     const businessIdToUse = currentBusinessId

//     if (!businessIdToUse) {
//       alert("Error: Business ID is missing. Cannot deploy workflow.")
//       return
//     }

//     // For default workflow, we don't need integrations array since CRM is handled automatically
//     const workflowData = {
//       workflowTemplateId: isDefaultWorkflow ? "default-crm-workflow" : null,
//       businessId: businessIdToUse,
//       businessInfo,
//       integrations: [], // Empty for default workflow - CRM credentials are fetched automatically
//       customRequest: isCustomWorkflow ? customRequest : undefined,
//       status: isDefaultWorkflow ? "ACTIVE" : "PENDING_CREATION", // Default workflow is immediately active
//       isActive: isDefaultWorkflow, // Default workflow is immediately active
//       submittedAt: new Date().toISOString(),
//       estimatedCompletion: isDefaultWorkflow ? "immediate" : "3-5",
//     }

//     console.log("Submitting workflow configuration:", workflowData)

//     try {
//       const response = await fetch("/api/workflow-config", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(workflowData),
//       })
//       const result = await response.json()

//       if (result.success) {
//         if (isDefaultWorkflow) {
//           // Default workflow is immediately active
//           setActiveWorkflowExists(true)
//           setActiveWorkflowDetails(result.workflowConfig)
//           setWorkflowCreationStatus("completed")
//           setStep("dashboard")
//         } else {
//           // Custom workflow goes to pending
//           const pendingData: PendingWorkflowData = {
//             id: result.workflowConfig.id,
//             submittedAt: new Date().toISOString(),
//             status: "PENDING_CREATION",
//             workflowType: "Custom Workflow",
//             estimatedCompletion: "3-5",
//           }

//           localStorage.setItem("pendingWorkflow", JSON.stringify(pendingData))
//           setPendingWorkflowData(pendingData)
//           setWorkflowCreationStatus("submitted")
//           setStep("pending")
//         }
//       } else {
//         alert(`Failed to submit workflow: ${result.error || "Unknown error"}`)
//       }
//     } catch (error) {
//       console.error("Error submitting workflow configuration:", error)
//       alert("An unexpected error occurred during submission.")
//     }
//   }

//   const handleDeactivateWorkflow = async () => {
//     if (!activeWorkflowDetails?.id) {
//       alert("No active workflow to deactivate.")
//       return
//     }
//     setShowDeactivateConfirm(true)
//   }

//   const confirmDeactivate = async () => {
//     setShowDeactivateConfirm(false)
//     setIsDeactivating(true)
//     try {
//       const response = await fetch("/api/workflow-config", {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           id: activeWorkflowDetails?.id,
//           isActive: false,
//           status: "INACTIVE",
//         }),
//       })

//       if (response.ok) {
//         alert("Workflow deactivated successfully!")
//         setActiveWorkflowExists(false)
//         setActiveWorkflowDetails(null)
//         setStep("selection")
//         setBusinessInfo({ businessName: "", businessType: "", description: "", website: "", phone: "", email: "" })
//         setCustomRequest("")
//         setIsCustomWorkflow(false)
//         setIsDefaultWorkflow(false)
//         setWorkflowCreationStatus("not-started")
//         setPendingWorkflowData(null)
//       } else {
//         const errorData = await response.json()
//         alert(`Failed to deactivate workflow: ${errorData.error || "Unknown error"}`)
//       }
//     } catch (error) {
//       console.error("Error deactivating workflow:", error)
//       alert("An unexpected error occurred during deactivation.")
//     } finally {
//       setIsDeactivating(false)
//     }
//   }

//   // --- CONDITIONAL RENDERING ---

//   if (isFetchingActiveWorkflow || isFetchingCRM) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <Loader2 className="h-10 w-10 animate-spin text-primary" />
//         <span className="ml-4 text-lg text-muted-foreground">Loading your workflows...</span>
//       </div>
//     )
//   }

//   // Render pending page
//   if (step === "pending" && pendingWorkflowData) {
//     return (
//       <WorkflowPendingPage
//         pendingWorkflowData={pendingWorkflowData}
//         businessInfo={businessInfo}
//         onBackToSelection={() => {
//           if (confirm("Are you sure you want to go back? Your pending workflow will remain in queue.")) {
//             setStep("selection")
//           }
//         }}
//       />
//     )
//   }

//   // Render dashboard if active workflow exists
//   if (activeWorkflowExists && activeWorkflowDetails && step === "dashboard") {
//     return (
//       <>
//         <WorkflowDashboard
//           workflowDetails={activeWorkflowDetails}
//           onDeactivate={handleDeactivateWorkflow}
//           isDeactivating={isDeactivating}
//         />
//         <AlertDialog open={showDeactivateConfirm} onOpenChange={setShowDeactivateConfirm}>
//           <AlertDialogContent>
//             <AlertDialogHeader>
//               <AlertDialogTitle className="flex items-center gap-2 text-red-500">
//                 <AlertTriangle className="h-6 w-6" />
//                 Confirm Deactivation
//               </AlertDialogTitle>
//               <AlertDialogDescription>
//                 Are you sure you want to deactivate your current workflow? This will stop all automated responses and
//                 you will need to set up a new one to resume automation.
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogCancel>Cancel</AlertDialogCancel>
//               <AlertDialogAction onClick={confirmDeactivate} className="bg-red-600 hover:bg-red-700">
//                 Deactivate
//               </AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>
//       </>
//     )
//   }

//   // Redirect to dashboard if active workflow exists but not on dashboard
//   if (activeWorkflowExists && activeWorkflowDetails && step !== "dashboard" && step !== "pending") {
//     setStep("dashboard")
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <Loader2 className="h-10 w-10 animate-spin text-primary" />
//         <span className="ml-4 text-lg text-muted-foreground">Redirecting to your active workflow dashboard...</span>
//       </div>
//     )
//   }

//   // Render CustomWorkflowBuilder
//   if (step === "custom-builder") {
//     return (
//       <CustomWorkflowBuilder
//         businessInfo={businessInfo}
//         selectedWorkflowId={null}
//         setStep={(s) => {
//           if (s === "selection" || s === "dashboard") {
//             setStep(s)
//           }
//         }}
//         setActiveWorkflowExists={setActiveWorkflowExists}
//         setActiveWorkflowDetails={setActiveWorkflowDetails}
//       />
//     )
//   }

//   // Main selection page with only 2 cards
//   if (step === "selection") {
//     const activeCRMIntegrations = crmIntegrations.filter((crm) => crm.isActive)

//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radiale--gradient--automations">
//           <div className="max-w-7xl mx-auto p-6">
//             <div className="text-center mb-12">
//               <div className="flex items-center justify-center gap-3 mb-6">
//                 <Sparkles className="h-8 w-8 text-primary" />
//                 <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Choose Your Business Workflow
//                 </h1>
//               </div>
//               <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
//                 Start with our default CRM workflow or request a custom solution tailored to your needs
//               </p>
//             </div>

//             <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
//               {/* Default CRM Workflow Card */}
//               <Card
//                 className={`cursor-pointer transition-all duration-300 border-2 glassEffect card-border-customer-support hover:scale-105 ${activeWorkflowExists ? "opacity-50 cursor-not-allowed" : ""}`}
//                 onClick={() => !activeWorkflowExists && handleDefaultWorkflowSelect()}
//               >
//                 <CardHeader className="pb-4">
//                   <div className="flex items-center gap-4 mb-4">
//                     <div className="p-3 rounded-xl bg-primary/10 template-icon-container">
//                       <Database className="h-6 w-6 text-chart-1" />
//                     </div>
//                     <div className="flex-1">
//                       <CardTitle className="text-xl mb-2">Default CRM Workflow</CardTitle>
//                       <Badge variant="outline" className="text-xs bg-chart-2/10 text-chart-2 border-chart-2/20">
//                         Recommended
//                       </Badge>
//                     </div>
//                   </div>
//                   <CardDescription className="text-sm leading-relaxed">
//                     Perfect for getting started quickly. Automatically qualifies leads through Instagram DMs and sends
//                     them directly to your connected CRM system.
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div>
//                     <h4 className="font-semibold text-sm mb-3 text-primary">Process Flow:</h4>
//                     <div className="space-y-2">
//                       {[
//                         "Receive Instagram DM",
//                         "AI lead qualification",
//                         "Collect contact information",
//                         "Send to your CRM",
//                         "Notify your team",
//                       ].map((operation, idx) => (
//                         <div key={idx} className="flex items-center gap-3">
//                           <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
//                             {idx + 1}
//                           </div>
//                           <span className="text-sm text-muted-foreground">{operation}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   <div>
//                     <h4 className="font-semibold text-sm mb-3 text-primary">Key Features:</h4>
//                     <ul className="space-y-2">
//                       {[
//                         "Instant lead qualification",
//                         "Automatic CRM integration",
//                         "Smart conversation handling",
//                         "Lead scoring & prioritization",
//                       ].map((feature, idx) => (
//                         <li key={idx} className="flex items-center gap-2 text-sm">
//                           <CheckCircle className="h-4 w-4 text-chart-2 flex-shrink-0" />
//                           <span className="text-muted-foreground">{feature}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>

//                   <div>
//                     <h4 className="font-semibold text-sm mb-3 text-primary">CRM Integration Status:</h4>
//                     {activeCRMIntegrations.length > 0 ? (
//                       <div className="space-y-2">
//                         {activeCRMIntegrations.map((crm) => (
//                           <div key={crm.id} className="flex items-center gap-2 text-sm bg-chart-2/10 p-2 rounded-lg">
//                             <CheckCircle className="h-4 w-4 text-chart-2" />
//                             <span className="text-foreground font-medium">{crm.provider}</span>
//                             <Badge variant="outline" className="ml-auto text-xs text-chart-2 border-chart-2/20">
//                               Auto-Active
//                             </Badge>
//                           </div>
//                         ))}
//                         <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
//                           <p className="text-xs text-blue-600 dark:text-blue-400">
//                             🎉 Your default workflow is automatically active and processing Instagram DMs!
//                           </p>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="bg-destructive/10 p-3 rounded-lg">
//                         <div className="flex items-center gap-2 text-sm text-destructive mb-2">
//                           <AlertTriangle className="h-4 w-4" />
//                           <span className="font-medium">No CRM Connected</span>
//                         </div>
//                         <p className="text-xs text-muted-foreground">
//                           Connect a CRM first to automatically activate the default workflow. Go to the Leads page to
//                           connect your CRM via OAuth.
//                         </p>
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex gap-2 mt-4">
//                     <Button
//                       onClick={() => handleDefaultWorkflowSelect()}
//                       className="flex-1"
//                       disabled={activeWorkflowExists || activeCRMIntegrations.length === 0}
//                     >
//                       {activeCRMIntegrations.length === 0 ? "Connect CRM First" : "Configure Default Workflow"}
//                     </Button>
//                   </div>

//                   {activeCRMIntegrations.length > 0 && (
//                     <div className="mt-3 p-2 bg-chart-2/10 rounded-lg">
//                       <p className="text-xs text-chart-2 font-medium">
//                         ✨ Default workflow activates automatically when you have a connected CRM
//                       </p>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>

//               {/* Custom Workflow Request Card */}
//               <Card
//                 className={`cursor-pointer transition-all duration-300 border-2 border-dashed border-border/50 glassEffect hover:border-primary/50 hover:shadow-lg flex flex-col ${activeWorkflowExists ? "opacity-50 cursor-not-allowed" : ""}`}
//                 onClick={() => !activeWorkflowExists && handleCustomWorkflowSelect()}
//               >
//                 <CardHeader className="pb-4">
//                   <div className="flex items-center gap-4 mb-4">
//                     <div className="p-3 rounded-xl bg-primary/10 template-icon-container">
//                       <Settings className="h-6 w-6 text-chart-4" />
//                     </div>
//                     <div className="flex-1">
//                       <CardTitle className="text-xl mb-2">Request Custom Workflow</CardTitle>
//                       <Badge variant="outline" className="text-xs bg-chart-4/10 text-chart-4 border-chart-4/20">
//                         Tailored Solution
//                       </Badge>
//                     </div>
//                   </div>
//                   <CardDescription className="text-sm leading-relaxed">
//                     Need something more specific? Describe your unique business requirements and we&apos;ll build a
//                     custom workflow just for you.
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6 flex-1">
//                   <div>
//                     <h4 className="font-semibold text-sm mb-3 text-primary">What You Get:</h4>
//                     <ul className="space-y-2">
//                       {[
//                         "Personalized workflow design",
//                         "Custom integrations",
//                         "Advanced automation logic",
//                         "Dedicated development support",
//                       ].map((feature, idx) => (
//                         <li key={idx} className="flex items-center gap-2 text-sm">
//                           <Sparkles className="h-4 w-4 text-chart-4 flex-shrink-0" />
//                           <span className="text-muted-foreground">{feature}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>

//                   <div>
//                     <h4 className="font-semibold text-sm mb-3 text-primary">Perfect For:</h4>
//                     <p className="text-xs text-muted-foreground leading-relaxed">
//                       Complex business processes, multiple integrations, unique industry requirements, or specialized
//                       automation needs that go beyond standard workflows.
//                     </p>
//                   </div>

//                   <div className="bg-chart-4/10 p-3 rounded-lg">
//                     <div className="flex items-center gap-2 text-sm text-chart-4 mb-1">
//                       <Clock className="h-4 w-4" />
//                       <span className="font-medium">Development Time: 3-5 business days</span>
//                     </div>
//                     <p className="text-xs text-muted-foreground">
//                       Our team will review your requirements and build your custom solution.
//                     </p>
//                   </div>

//                   <div className="flex gap-2 mt-auto">
//                     <Button
//                       onClick={() => handleCustomWorkflowSelect()}
//                       variant="outline"
//                       className="flex-1 bg-transparent hover:bg-accent"
//                       disabled={activeWorkflowExists}
//                     >
//                       Request Custom Workflow
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* CRM Connection Notice */}
//             {activeCRMIntegrations.length === 0 && (
//               <div className="max-w-4xl mx-auto mt-8">
//                 <Card className="border-2 border-destructive/20 bg-destructive/5">
//                   <CardContent className="p-6">
//                     <div className="flex items-start gap-4">
//                       <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-1" />
//                       <div>
//                         <h3 className="font-semibold text-destructive mb-2">CRM Integration Required</h3>
//                         <p className="text-sm text-muted-foreground mb-4">
//                           To use the default workflow, you need to connect a CRM system first. This allows us to
//                           automatically send qualified leads to your CRM.
//                         </p>
//                         <Button
//                           variant="outline"
//                           className="text-destructive border-destructive/20 hover:bg-destructive/10 bg-transparent"
//                         >
//                           Go to Leads Page to Connect CRM
//                         </Button>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // Configuration step for default workflow
//   if (step === "configuration") {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radiale--gradient--automations">
//           <div className="max-w-4xl mx-auto p-6">
//             <div className="mb-8">
//               <Button variant="ghost" onClick={() => setStep("selection")} className="mb-6 hover:bg-accent">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Selection
//               </Button>
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Configure Your {isDefaultWorkflow ? "Default CRM" : "Custom"} Workflow
//                 </h1>
//                 <p className="text-muted-foreground text-lg">
//                   Provide your business information to personalize the workflow
//                 </p>
//               </div>
//             </div>

//             <div className="grid gap-8 lg:grid-cols-2">
//               <Card className="glassEffect border-2 border-border/50">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Users className="h-5 w-5 text-primary" />
//                     Business Information
//                   </CardTitle>
//                   <CardDescription>
//                     This information will be used to personalize your automated responses
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div className="space-y-2">
//                     <Label htmlFor="businessName" className="text-sm font-medium">
//                       Business Name *
//                     </Label>
//                     <Input
//                       id="businessName"
//                       value={businessInfo.businessName}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, businessName: e.target.value }))}
//                       placeholder="Your Business Name"
//                       className="bg-background/50 border-border/50 focus:border-primary"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="businessType" className="text-sm font-medium">
//                       Business Type *
//                     </Label>
//                     <Input
//                       id="businessType"
//                       value={businessInfo.businessType}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, businessType: e.target.value }))}
//                       placeholder="e.g., Hair Salon, Photography Studio"
//                       className="bg-background/50 border-border/50 focus:border-primary"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="description" className="text-sm font-medium">
//                       Business Description
//                     </Label>
//                     <Textarea
//                       id="description"
//                       value={businessInfo.description}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, description: e.target.value }))}
//                       placeholder="Brief description of your services..."
//                       rows={3}
//                       className="bg-background/50 border-border/50 focus:border-primary resize-none"
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="website" className="text-sm font-medium">
//                         Website
//                       </Label>
//                       <Input
//                         id="website"
//                         value={businessInfo.website}
//                         onChange={(e) => setBusinessInfo((prev) => ({ ...prev, website: e.target.value }))}
//                         placeholder="https://yourwebsite.com"
//                         className="bg-background/50 border-border/50 focus:border-primary"
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="phone" className="text-sm font-medium">
//                         Phone Number
//                       </Label>
//                       <Input
//                         id="phone"
//                         value={businessInfo.phone}
//                         onChange={(e) => setBusinessInfo((prev) => ({ ...prev, phone: e.target.value }))}
//                         placeholder="+1 (555) 123-4567"
//                         className="bg-background/50 border-border/50 focus:border-primary"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="email" className="text-sm font-medium">
//                       Email
//                     </Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       value={businessInfo.email}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, email: e.target.value }))}
//                       placeholder="contact@yourbusiness.com"
//                       className="bg-background/50 border-border/50 focus:border-primary"
//                     />
//                   </div>
//                 </CardContent>
//               </Card>

//               <div className="space-y-8">
//                 <Card className="glassEffect border-2 card-border-customer-support">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Database className="h-5 w-5 text-chart-1" />
//                       Default CRM Workflow Overview
//                     </CardTitle>
//                     <CardDescription>Here&apos;s what your default workflow will include</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-6">
//                       <div>
//                         <h4 className="font-semibold mb-4 text-primary flex items-center gap-2">
//                           <Sparkles className="h-4 w-4" />
//                           Process Flow:
//                         </h4>
//                         <div className="space-y-3">
//                           {[
//                             "Receive Instagram DM",
//                             "AI lead qualification",
//                             "Collect contact information",
//                             "Send to your CRM",
//                             "Notify your team",
//                           ].map((operation, idx) => (
//                             <div key={idx} className="flex items-center gap-4">
//                               <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-semibold">
//                                 {idx + 1}
//                               </div>
//                               <span className="text-sm font-medium">{operation}</span>
//                             </div>
//                           ))}
//                         </div>
//                       </div>

//                       <div>
//                         <h4 className="font-semibold mb-4 text-primary">Key Features:</h4>
//                         <ul className="space-y-3">
//                           {[
//                             "Instant lead qualification",
//                             "Automatic CRM integration",
//                             "Smart conversation handling",
//                             "Lead scoring & prioritization",
//                             "Human handoff when needed",
//                             "Real-time notifications",
//                           ].map((feature, idx) => (
//                             <li key={idx} className="flex items-center gap-3 text-sm">
//                               <CheckCircle className="h-4 w-4 text-chart-2 flex-shrink-0" />
//                               <span>{feature}</span>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>

//                       <div>
//                         <h4 className="font-semibold mb-4 text-primary">Connected CRM:</h4>
//                         <div className="space-y-2">
//                           {crmIntegrations
//                             .filter((crm) => crm.isActive)
//                             .map((crm) => (
//                               <div key={crm.id} className="flex items-center gap-3 p-3 bg-chart-2/10 rounded-lg">
//                                 <CheckCircle className="h-4 w-4 text-chart-2" />
//                                 <span className="text-sm font-medium">{crm.provider}</span>
//                                 <Badge variant="outline" className="ml-auto text-xs text-chart-2 border-chart-2/20">
//                                   Active
//                                 </Badge>
//                               </div>
//                             ))}
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>

//             <div className="mt-10 flex justify-end">
//               <Button
//                 onClick={handleBusinessInfoSubmit}
//                 disabled={!businessInfo.businessName || !businessInfo.businessType}
//                 size="lg"
//                 className="px-8 py-3 text-base font-semibold"
//               >
//                 Continue to Review
//                 <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // Review step
//   if (step === "review") {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radiale--gradient--automations">
//           <div className="max-w-5xl mx-auto p-6">
//             <div className="mb-8">
//               <Button variant="ghost" onClick={() => setStep("configuration")} className="mb-6 hover:bg-accent">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Configuration
//               </Button>
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Review &amp; Deploy
//                 </h1>
//                 <p className="text-muted-foreground text-lg">
//                   Review your configuration before deploying your workflow
//                 </p>
//               </div>
//             </div>

//             <div className="grid gap-8 lg:grid-cols-2 mb-10">
//               <Card className="glassEffect border-2 border-border/50">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <CheckCircle className="h-5 w-5 text-green-500" />
//                     Workflow Summary
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Workflow Type:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg">
//                       {isDefaultWorkflow ? "Default CRM Workflow" : "Custom Workflow Request"}
//                     </p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Business Name:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg">{businessInfo.businessName}</p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Business Type:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg">{businessInfo.businessType}</p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Setup Time:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg flex items-center gap-2">
//                       <Clock className="h-4 w-4" />
//                       {isDefaultWorkflow ? "Immediate activation" : "3-5 business days"}
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="glassEffect border-2 border-border/50">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Database className="h-5 w-5 text-primary" />
//                     CRM Integration
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-3">
//                     {crmIntegrations
//                       .filter((crm) => crm.isActive)
//                       .map((crm) => (
//                         <div key={crm.id} className="flex items-center gap-3 p-3 bg-chart-2/10 rounded-lg">
//                           <CheckCircle className="h-4 w-4 text-chart-2" />
//                           <div className="flex-1">
//                             <span className="text-sm font-medium">{crm.provider}</span>
//                             <p className="text-xs text-muted-foreground">
//                               Connected on {new Date(crm.createdAt).toLocaleDateString()}
//                             </p>
//                           </div>
//                           <Badge variant="outline" className="text-xs text-chart-2 border-chart-2/20">
//                             Active
//                           </Badge>
//                         </div>
//                       ))}
//                   </div>
//                   <div className="mt-4 text-sm text-muted-foreground">
//                     {isDefaultWorkflow
//                       ? "Your CRM credentials will be automatically used by the workflow to send qualified leads."
//                       : "CRM integration will be configured as part of your custom workflow development."}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             <Card className="glassEffect border-2 border-primary/30 mb-10">
//               <CardContent className="p-6">
//                 <h3 className="font-semibold mb-4 flex items-center gap-2 text-primary">
//                   <Sparkles className="h-5 w-5" />
//                   What happens next?
//                 </h3>
//                 <ul className="space-y-3 text-sm text-muted-foreground">
//                   {isDefaultWorkflow ? (
//                     <>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Your default workflow will be activated immediately upon submission.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Instagram DMs will start being processed automatically using your CRM credentials.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Qualified leads will be sent directly to your connected{" "}
//                         {crmIntegrations.find((crm) => crm.isActive)?.provider || "CRM"}.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         You can monitor performance and leads from your dashboard.
//                       </li>
//                     </>
//                   ) : (
//                     <>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Your custom workflow request will be sent to our development team.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         We will email you at <strong>{businessInfo.email}</strong> when development begins.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         You can return to this page anytime to check the status of your workflow.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Once complete, your custom automation will be available in your dashboard.
//                       </li>
//                     </>
//                   )}
//                 </ul>
//               </CardContent>
//             </Card>

//             <div className="flex justify-between">
//               <Button variant="outline" onClick={() => setStep("configuration")} size="lg">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back
//               </Button>
//               <Button
//                 onClick={handleFinalSubmit}
//                 size="lg"
//                 className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8 py-3 text-base font-semibold glow"
//               >
//                 <Sparkles className="h-4 w-4 mr-2" />
//                 {isDefaultWorkflow ? "Activate Workflow 🚀" : "Submit for Development 🚀"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return null
// }



// "use client"
// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import {
//   Clock,
//   Users,
//   CheckCircle,
//   ArrowLeft,
//   Sparkles,
//   Loader2,
//   AlertTriangle,
//   Database,
//   Settings,
// } from "lucide-react"
// import WorkflowDashboard from "./workflow-dashboard"
// import CustomWorkflowBuilder from "./custom-workflow-builder"
// import WorkflowPendingPage from "./workflow-pending-page"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog"

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
//   integrations: { name: string; config: any }[]
//   customRequest?: string
//   status: "DRAFT" | "CONFIGURING" | "SUBMITTED" | "PENDING_CREATION" | "ACTIVE" | "INACTIVE" | "CUSTOM_REQUEST"
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
//   submittedAt?: Date
//   estimatedCompletion?: string
// }

// interface PendingWorkflowData {
//   id: string
//   submittedAt: string
//   status: string
//   workflowType?: string
//   estimatedCompletion?: string
// }

// interface CRMIntegration {
//   id: string
//   provider: string
//   name: string
//   isActive: boolean
//   createdAt: string
// }

// const Logger = {
//   info: (message: string, ...args: any[]) => {
//     console.log(`%cINFO: ${message}`, "color: blue;", ...args)
//   },
//   success: (message: string, ...args: any[]) => {
//     console.log(`%cSUCCESS: ${message}`, "color: green;", ...args)
//   },
//   warn: (message: string, ...args: any[]) => {
//     console.warn(`%cWARN: ${message}`, "color: orange;", ...args)
//   },
//   error: (message: string, ...args: any[]) => {
//     console.error(`%cERROR: ${message}`, "color: red;", ...args)
//   },
// }

// export default function WorkflowSelector() {
//   const [step, setStep] = useState<
//     "selection" | "configuration" | "review" | "dashboard" | "custom-builder" | "pending"
//   >("selection")
//   const [businessInfo, setBusinessInfo] = useState({
//     businessName: "",
//     businessType: "",
//     description: "",
//     website: "",
//     phone: "",
//     email: "",
//   })
//   const [customRequest, setCustomRequest] = useState("")
//   const [isCustomWorkflow, setIsCustomWorkflow] = useState(false)
//   const [isDefaultWorkflow, setIsDefaultWorkflow] = useState(false)

//   // WORKFLOW STATE MANAGEMENT
//   const [activeWorkflowExists, setActiveWorkflowExists] = useState(false)
//   const [activeWorkflowDetails, setActiveWorkflowDetails] = useState<BusinessWorkflowConfig | null>(null)
//   const [isFetchingActiveWorkflow, setIsFetchingActiveWorkflow] = useState(true)
//   const [isDeactivating, setIsDeactivating] = useState(false)
//   const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false)

//   // CRM Integration state
//   const [crmIntegrations, setCrmIntegrations] = useState<CRMIntegration[]>([])
//   const [isFetchingCRM, setIsFetchingCRM] = useState(true)

//   // Pending workflow states
//   const [pendingWorkflowData, setPendingWorkflowData] = useState<PendingWorkflowData | null>(null)
//   const [workflowCreationStatus, setWorkflowCreationStatus] = useState<
//     "not-started" | "submitted" | "in-progress" | "completed"
//   >("not-started")

//   const currentBusinessId = "b909f187-d423-455b-b9bc-c8f9219e48b8"

//   // Fetch active workflow and CRM integrations
//   useEffect(() => {
//     const fetchWorkflowStatus = async () => {
//       setIsFetchingActiveWorkflow(true)
//       setIsFetchingCRM(true)

//       try {
//         if (!currentBusinessId) {
//           console.warn("No business ID available to fetch workflow status.")
//           setIsFetchingActiveWorkflow(false)
//           setIsFetchingCRM(false)
//           return
//         }

//         // Check for pending workflow in localStorage first
//         const storedPending = localStorage.getItem("pendingWorkflow")
//         if (storedPending) {
//           const pendingData: PendingWorkflowData = JSON.parse(storedPending)

//           // Verify the status with backend
//           const statusResponse = await fetch(`/api/workflow-config/${pendingData.id}`)
//           if (statusResponse.ok) {
//             const statusData = await statusResponse.json()

//             if (statusData.status === "ACTIVE") {
//               // Workflow is now active, remove from localStorage and show dashboard
//               localStorage.removeItem("pendingWorkflow")
//               setActiveWorkflowExists(true)
//               setActiveWorkflowDetails(statusData)
//               setWorkflowCreationStatus("completed")
//               setStep("dashboard")
//             } else if (statusData.status === "PENDING_CREATION") {
//               // Still pending, show pending page
//               setPendingWorkflowData(pendingData)
//               setWorkflowCreationStatus("in-progress")
//               setStep("pending")
//             } else {
//               // Some other status, clean up localStorage
//               localStorage.removeItem("pendingWorkflow")
//             }
//           } else {
//             // Workflow not found, clean up localStorage
//             localStorage.removeItem("pendingWorkflow")
//           }
//         }

//         // Fetch active workflows and CRM integrations in parallel
//         const [workflowResponse, crmResponse] = await Promise.all([
//           fetch(`/api/workflow-config?businessId=${currentBusinessId}&status=ACTIVE`),
//           fetch(`/api/crm/integrations?userId=${currentBusinessId}`), // Assuming userId maps to businessId
//         ])

//         // Handle workflow response
//         if (workflowResponse.ok) {
//           const workflowData = await workflowResponse.json()
//           if (workflowData.workflowConfigs && workflowData.workflowConfigs.length > 0) {
//             const activeConfig = workflowData.workflowConfigs[0]
//             setActiveWorkflowExists(true)
//             setActiveWorkflowDetails(activeConfig)
//             setWorkflowCreationStatus("completed")

//             // Only set to dashboard if we're not already showing pending
//             if (step !== "pending") {
//               setStep("dashboard")
//             }
//           } else {
//             setActiveWorkflowExists(false)
//             setActiveWorkflowDetails(null)
//           }
//         }

//         // After the existing workflow and CRM fetching logic, add this auto-activation logic:
//         if (crmResponse.ok) {
//           const crmData = await crmResponse.json()
//           setCrmIntegrations(crmData.integrations || [])

//           // Auto-activate default workflow if CRM is connected but no active workflow exists
//           const activeCRMIntegrations = (crmData.integrations || []).filter((crm: any) => crm.isActive)

//           if (activeCRMIntegrations.length > 0 && !activeWorkflowExists && !storedPending) {
//             Logger.info("🚀 Auto-activating default workflow - CRM connected but no active workflow")

//             try {
//               const autoActivateResponse = await fetch("/api/workflow-config", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                   workflowTemplateId: "default-crm-workflow",
//                   businessId: currentBusinessId,
//                   businessInfo: {
//                     businessName: "Auto-activated Business",
//                     businessType: "Service Business",
//                     description: "Auto-activated default workflow",
//                   },
//                   integrations: [], // Empty for default workflow
//                   status: "ACTIVE",
//                   isActive: true,
//                   submittedAt: new Date().toISOString(),
//                   estimatedCompletion: "immediate",
//                 }),
//               })

//               if (autoActivateResponse.ok) {
//                 const result = await autoActivateResponse.json()
//                 if (result.success) {
//                   setActiveWorkflowExists(true)
//                   setActiveWorkflowDetails(result.workflowConfig)
//                   setWorkflowCreationStatus("completed")
//                   setStep("dashboard")
//                   Logger.success("✅ Default workflow auto-activated successfully")
//                 }
//               }
//             } catch (error) {
//               Logger.error("Failed to auto-activate default workflow:", error)
//             }
//           }
//         } else {
//           console.error("Failed to fetch CRM integrations:", await crmResponse.text())
//         }
//       } catch (error) {
//         console.error("Error fetching workflow status:", error)
//       } finally {
//         setIsFetchingActiveWorkflow(false)
//         setIsFetchingCRM(false)
//       }
//     }

//     fetchWorkflowStatus()
//   }, [currentBusinessId])

//   // Periodic status checking when in pending state
//   useEffect(() => {
//     let interval: NodeJS.Timeout | null = null

//     if (step === "pending" && pendingWorkflowData) {
//       interval = setInterval(async () => {
//         try {
//           const response = await fetch(`/api/workflow-config/${pendingWorkflowData.id}`)
//           if (response.ok) {
//             const data = await response.json()
//             if (data.status === "ACTIVE") {
//               localStorage.removeItem("pendingWorkflow")
//               setActiveWorkflowExists(true)
//               setActiveWorkflowDetails(data)
//               setWorkflowCreationStatus("completed")
//               setStep("dashboard")
//               setPendingWorkflowData(null)
//             }
//           }
//         } catch (error) {
//           console.error("Error checking workflow status:", error)
//         }
//       }, 30000) // Check every 30 seconds
//     }

//     return () => {
//       if (interval) clearInterval(interval)
//     }
//   }, [step, pendingWorkflowData])

//   const handleDefaultWorkflowSelect = () => {
//     if (activeWorkflowExists) return
//     setIsDefaultWorkflow(true)
//     setIsCustomWorkflow(false)
//     setCustomRequest("")
//     setStep("configuration")
//   }

//   const handleCustomWorkflowSelect = () => {
//     if (activeWorkflowExists) return
//     setIsCustomWorkflow(true)
//     setIsDefaultWorkflow(false)
//     setCustomRequest("")
//     setStep("custom-builder")
//   }

//   const handleBusinessInfoSubmit = () => {
//     setStep("review")
//   }

//   const handleFinalSubmit = async () => {
//     const businessIdToUse = currentBusinessId

//     if (!businessIdToUse) {
//       alert("Error: Business ID is missing. Cannot deploy workflow.")
//       return
//     }

//     // For default workflow, we don't need integrations array since CRM is handled automatically
//     const workflowData = {
//       workflowTemplateId: isDefaultWorkflow ? "default-crm-workflow" : null,
//       businessId: businessIdToUse,
//       businessInfo,
//       integrations: [], // Empty for default workflow - CRM credentials are fetched automatically
//       customRequest: isCustomWorkflow ? customRequest : undefined,
//       status: isDefaultWorkflow ? "ACTIVE" : "PENDING_CREATION", // Default workflow is immediately active
//       isActive: isDefaultWorkflow, // Default workflow is immediately active
//       submittedAt: new Date().toISOString(),
//       estimatedCompletion: isDefaultWorkflow ? "immediate" : "3-5",
//     }

//     console.log("Submitting workflow configuration:", workflowData)

//     try {
//       const response = await fetch("/api/workflow-config", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(workflowData),
//       })
//       const result = await response.json()

//       if (result.success) {
//         if (isDefaultWorkflow) {
//           // Default workflow is immediately active
//           setActiveWorkflowExists(true)
//           setActiveWorkflowDetails(result.workflowConfig)
//           setWorkflowCreationStatus("completed")
//           setStep("dashboard")
//         } else {
//           // Custom workflow goes to pending
//           const pendingData: PendingWorkflowData = {
//             id: result.workflowConfig.id,
//             submittedAt: new Date().toISOString(),
//             status: "PENDING_CREATION",
//             workflowType: "Custom Workflow",
//             estimatedCompletion: "3-5",
//           }

//           localStorage.setItem("pendingWorkflow", JSON.stringify(pendingData))
//           setPendingWorkflowData(pendingData)
//           setWorkflowCreationStatus("submitted")
//           setStep("pending")
//         }
//       } else {
//         alert(`Failed to submit workflow: ${result.error || "Unknown error"}`)
//       }
//     } catch (error) {
//       console.error("Error submitting workflow configuration:", error)
//       alert("An unexpected error occurred during submission.")
//     }
//   }

//   const handleDeactivateWorkflow = async () => {
//     if (!activeWorkflowDetails?.id) {
//       alert("No active workflow to deactivate.")
//       return
//     }
//     setShowDeactivateConfirm(true)
//   }

//   const confirmDeactivate = async () => {
//     setShowDeactivateConfirm(false)
//     setIsDeactivating(true)
//     try {
//       const response = await fetch("/api/workflow-config", {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           id: activeWorkflowDetails?.id,
//           isActive: false,
//           status: "INACTIVE",
//         }),
//       })

//       if (response.ok) {
//         alert("Workflow deactivated successfully!")
//         setActiveWorkflowExists(false)
//         setActiveWorkflowDetails(null)
//         setStep("selection")
//         setBusinessInfo({ businessName: "", businessType: "", description: "", website: "", phone: "", email: "" })
//         setCustomRequest("")
//         setIsCustomWorkflow(false)
//         setIsDefaultWorkflow(false)
//         setWorkflowCreationStatus("not-started")
//         setPendingWorkflowData(null)
//       } else {
//         const errorData = await response.json()
//         alert(`Failed to deactivate workflow: ${errorData.error || "Unknown error"}`)
//       }
//     } catch (error) {
//       console.error("Error deactivating workflow:", error)
//       alert("An unexpected error occurred during deactivation.")
//     } finally {
//       setIsDeactivating(false)
//     }
//   }

//   // --- CONDITIONAL RENDERING ---

//   if (isFetchingActiveWorkflow || isFetchingCRM) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <Loader2 className="h-10 w-10 animate-spin text-primary" />
//         <span className="ml-4 text-lg text-muted-foreground">Loading your workflows...</span>
//       </div>
//     )
//   }

//   // Render pending page
//   if (step === "pending" && pendingWorkflowData) {
//     return (
//       <WorkflowPendingPage
//         pendingWorkflowData={pendingWorkflowData}
//         businessInfo={businessInfo}
//         onBackToSelection={() => {
//           if (confirm("Are you sure you want to go back? Your pending workflow will remain in queue.")) {
//             setStep("selection")
//           }
//         }}
//       />
//     )
//   }

//   // Render dashboard if active workflow exists
//   if (activeWorkflowExists && activeWorkflowDetails && step === "dashboard") {
//     return (
//       <>
//         <WorkflowDashboard
//           workflowDetails={activeWorkflowDetails}
//           onDeactivate={handleDeactivateWorkflow}
//           isDeactivating={isDeactivating}
//         />
//         <AlertDialog open={showDeactivateConfirm} onOpenChange={setShowDeactivateConfirm}>
//           <AlertDialogContent>
//             <AlertDialogHeader>
//               <AlertDialogTitle className="flex items-center gap-2 text-red-500">
//                 <AlertTriangle className="h-6 w-6" />
//                 Confirm Deactivation
//               </AlertDialogTitle>
//               <AlertDialogDescription>
//                 Are you sure you want to deactivate your current workflow? This will stop all automated responses and
//                 you will need to set up a new one to resume automation.
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogCancel>Cancel</AlertDialogCancel>
//               <AlertDialogAction onClick={confirmDeactivate} className="bg-red-600 hover:bg-red-700">
//                 Deactivate
//               </AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>
//       </>
//     )
//   }

//   // Redirect to dashboard if active workflow exists but not on dashboard
//   if (activeWorkflowExists && activeWorkflowDetails && step !== "dashboard" && step !== "pending") {
//     setStep("dashboard")
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <Loader2 className="h-10 w-10 animate-spin text-primary" />
//         <span className="ml-4 text-lg text-muted-foreground">Redirecting to your active workflow dashboard...</span>
//       </div>
//     )
//   }

//   // Render CustomWorkflowBuilder
//   if (step === "custom-builder") {
//     return (
//       <CustomWorkflowBuilder
//         businessInfo={businessInfo}
//         selectedWorkflowId={null}
//         setStep={(s) => {
//           if (s === "selection" || s === "dashboard") {
//             setStep(s)
//           }
//         }}
//         setActiveWorkflowExists={setActiveWorkflowExists}
//         setActiveWorkflowDetails={setActiveWorkflowDetails}
//       />
//     )
//   }

//   // Main selection page with only 2 cards
//   if (step === "selection") {
//     const activeCRMIntegrations = crmIntegrations.filter((crm) => crm.isActive)

//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radiale--gradient--automations">
//           <div className="max-w-7xl mx-auto p-6">
//             <div className="text-center mb-12">
//               <div className="flex items-center justify-center gap-3 mb-6">
//                 <Sparkles className="h-8 w-8 text-primary" />
//                 <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Choose Your Business Workflow
//                 </h1>
//               </div>
//               <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
//                 Start with our default CRM workflow or request a custom solution tailored to your needs
//               </p>
//             </div>

//             <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
//               {/* Default CRM Workflow Card */}
//               <Card
//                 className={`cursor-pointer transition-all duration-300 border-2 glassEffect card-border-customer-support hover:scale-105 ${activeWorkflowExists ? "opacity-50 cursor-not-allowed" : ""}`}
//                 onClick={() => !activeWorkflowExists && handleDefaultWorkflowSelect()}
//               >
//                 <CardHeader className="pb-4">
//                   <div className="flex items-center gap-4 mb-4">
//                     <div className="p-3 rounded-xl bg-primary/10 template-icon-container">
//                       <Database className="h-6 w-6 text-chart-1" />
//                     </div>
//                     <div className="flex-1">
//                       <CardTitle className="text-xl mb-2">Default CRM Workflow</CardTitle>
//                       <Badge variant="outline" className="text-xs bg-chart-2/10 text-chart-2 border-chart-2/20">
//                         Recommended
//                       </Badge>
//                     </div>
//                   </div>
//                   <CardDescription className="text-sm leading-relaxed">
//                     Perfect for getting started quickly. Automatically qualifies leads through Instagram DMs and sends
//                     them directly to your connected CRM system.
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div>
//                     <h4 className="font-semibold text-sm mb-3 text-primary">Process Flow:</h4>
//                     <div className="space-y-2">
//                       {[
//                         "Receive Instagram DM",
//                         "AI lead qualification",
//                         "Collect contact information",
//                         "Send to your CRM",
//                         "Notify your team",
//                       ].map((operation, idx) => (
//                         <div key={idx} className="flex items-center gap-3">
//                           <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
//                             {idx + 1}
//                           </div>
//                           <span className="text-sm text-muted-foreground">{operation}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   <div>
//                     <h4 className="font-semibold text-sm mb-3 text-primary">Key Features:</h4>
//                     <ul className="space-y-2">
//                       {[
//                         "Instant lead qualification",
//                         "Automatic CRM integration",
//                         "Smart conversation handling",
//                         "Lead scoring & prioritization",
//                       ].map((feature, idx) => (
//                         <li key={idx} className="flex items-center gap-2 text-sm">
//                           <CheckCircle className="h-4 w-4 text-chart-2 flex-shrink-0" />
//                           <span className="text-muted-foreground">{feature}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>

//                   <div>
//                     <h4 className="font-semibold text-sm mb-3 text-primary">CRM Integration Status:</h4>
//                     {activeCRMIntegrations.length > 0 ? (
//                       <div className="space-y-2">
//                         {activeCRMIntegrations.map((crm) => (
//                           <div key={crm.id} className="flex items-center gap-2 text-sm bg-chart-2/10 p-2 rounded-lg">
//                             <CheckCircle className="h-4 w-4 text-chart-2" />
//                             <span className="text-foreground font-medium">{crm.provider}</span>
//                             <Badge variant="outline" className="ml-auto text-xs text-chart-2 border-chart-2/20">
//                               Auto-Active
//                             </Badge>
//                           </div>
//                         ))}
//                         <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
//                           <p className="text-xs text-blue-600 dark:text-blue-400">
//                             🎉 Your default workflow is automatically active and processing Instagram DMs!
//                           </p>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="bg-destructive/10 p-3 rounded-lg">
//                         <div className="flex items-center gap-2 text-sm text-destructive mb-2">
//                           <AlertTriangle className="h-4 w-4" />
//                           <span className="font-medium">No CRM Connected</span>
//                         </div>
//                         <p className="text-xs text-muted-foreground">
//                           Connect a CRM first to automatically activate the default workflow. Go to the Leads page to
//                           connect your CRM via OAuth.
//                         </p>
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex gap-2 mt-4">
//                     <Button
//                       onClick={() => handleDefaultWorkflowSelect()}
//                       className="flex-1"
//                       disabled={activeWorkflowExists || activeCRMIntegrations.length === 0}
//                     >
//                       {activeCRMIntegrations.length === 0 ? "Connect CRM First" : "Configure Default Workflow"}
//                     </Button>
//                   </div>

//                   {activeCRMIntegrations.length > 0 && (
//                     <div className="mt-3 p-2 bg-chart-2/10 rounded-lg">
//                       <p className="text-xs text-chart-2 font-medium">
//                         ✨ Default workflow activates automatically when you have a connected CRM
//                       </p>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>

//               {/* Custom Workflow Request Card */}
//               <Card
//                 className={`cursor-pointer transition-all duration-300 border-2 border-dashed border-border/50 glassEffect hover:border-primary/50 hover:shadow-lg flex flex-col ${activeWorkflowExists ? "opacity-50 cursor-not-allowed" : ""}`}
//                 onClick={() => !activeWorkflowExists && handleCustomWorkflowSelect()}
//               >
//                 <CardHeader className="pb-4">
//                   <div className="flex items-center gap-4 mb-4">
//                     <div className="p-3 rounded-xl bg-primary/10 template-icon-container">
//                       <Settings className="h-6 w-6 text-chart-4" />
//                     </div>
//                     <div className="flex-1">
//                       <CardTitle className="text-xl mb-2">Request Custom Workflow</CardTitle>
//                       <Badge variant="outline" className="text-xs bg-chart-4/10 text-chart-4 border-chart-4/20">
//                         Tailored Solution
//                       </Badge>
//                     </div>
//                   </div>
//                   <CardDescription className="text-sm leading-relaxed">
//                     Need something more specific? Describe your unique business requirements and we&apos;ll build a
//                     custom workflow just for you.
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6 flex-1">
//                   <div>
//                     <h4 className="font-semibold text-sm mb-3 text-primary">What You Get:</h4>
//                     <ul className="space-y-2">
//                       {[
//                         "Personalized workflow design",
//                         "Custom integrations",
//                         "Advanced automation logic",
//                         "Dedicated development support",
//                       ].map((feature, idx) => (
//                         <li key={idx} className="flex items-center gap-2 text-sm">
//                           <Sparkles className="h-4 w-4 text-chart-4 flex-shrink-0" />
//                           <span className="text-muted-foreground">{feature}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>

//                   <div>
//                     <h4 className="font-semibold text-sm mb-3 text-primary">Perfect For:</h4>
//                     <p className="text-xs text-muted-foreground leading-relaxed">
//                       Complex business processes, multiple integrations, unique industry requirements, or specialized
//                       automation needs that go beyond standard workflows.
//                     </p>
//                   </div>

//                   <div className="bg-chart-4/10 p-3 rounded-lg">
//                     <div className="flex items-center gap-2 text-sm text-chart-4 mb-1">
//                       <Clock className="h-4 w-4" />
//                       <span className="font-medium">Development Time: 3-5 business days</span>
//                     </div>
//                     <p className="text-xs text-muted-foreground">
//                       Our team will review your requirements and build your custom solution.
//                     </p>
//                   </div>

//                   <div className="flex gap-2 mt-auto">
//                     <Button
//                       onClick={() => handleCustomWorkflowSelect()}
//                       variant="outline"
//                       className="flex-1 bg-transparent hover:bg-accent"
//                       disabled={activeWorkflowExists}
//                     >
//                       Request Custom Workflow
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* CRM Connection Notice */}
//             {activeCRMIntegrations.length === 0 && (
//               <div className="max-w-4xl mx-auto mt-8">
//                 <Card className="border-2 border-destructive/20 bg-destructive/5">
//                   <CardContent className="p-6">
//                     <div className="flex items-start gap-4">
//                       <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-1" />
//                       <div>
//                         <h3 className="font-semibold text-destructive mb-2">CRM Integration Required</h3>
//                         <p className="text-sm text-muted-foreground mb-4">
//                           To use the default workflow, you need to connect a CRM system first. This allows us to
//                           automatically send qualified leads to your CRM.
//                         </p>
//                         <Button
//                           variant="outline"
//                           className="text-destructive border-destructive/20 hover:bg-destructive/10 bg-transparent"
//                         >
//                           Go to Leads Page to Connect CRM
//                         </Button>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // Configuration step for default workflow
//   if (step === "configuration") {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radiale--gradient--automations">
//           <div className="max-w-4xl mx-auto p-6">
//             <div className="mb-8">
//               <Button variant="ghost" onClick={() => setStep("selection")} className="mb-6 hover:bg-accent">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Selection
//               </Button>
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Configure Your {isDefaultWorkflow ? "Default CRM" : "Custom"} Workflow
//                 </h1>
//                 <p className="text-muted-foreground text-lg">
//                   Provide your business information to personalize the workflow
//                 </p>
//               </div>
//             </div>

//             <div className="grid gap-8 lg:grid-cols-2">
//               <Card className="glassEffect border-2 border-border/50">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Users className="h-5 w-5 text-primary" />
//                     Business Information
//                   </CardTitle>
//                   <CardDescription>
//                     This information will be used to personalize your automated responses
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div className="space-y-2">
//                     <Label htmlFor="businessName" className="text-sm font-medium">
//                       Business Name *
//                     </Label>
//                     <Input
//                       id="businessName"
//                       value={businessInfo.businessName}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, businessName: e.target.value }))}
//                       placeholder="Your Business Name"
//                       className="bg-background/50 border-border/50 focus:border-primary"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="businessType" className="text-sm font-medium">
//                       Business Type *
//                     </Label>
//                     <Input
//                       id="businessType"
//                       value={businessInfo.businessType}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, businessType: e.target.value }))}
//                       placeholder="e.g., Hair Salon, Photography Studio"
//                       className="bg-background/50 border-border/50 focus:border-primary"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="description" className="text-sm font-medium">
//                       Business Description
//                     </Label>
//                     <Textarea
//                       id="description"
//                       value={businessInfo.description}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, description: e.target.value }))}
//                       placeholder="Brief description of your services..."
//                       rows={3}
//                       className="bg-background/50 border-border/50 focus:border-primary resize-none"
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="website" className="text-sm font-medium">
//                         Website
//                       </Label>
//                       <Input
//                         id="website"
//                         value={businessInfo.website}
//                         onChange={(e) => setBusinessInfo((prev) => ({ ...prev, website: e.target.value }))}
//                         placeholder="https://yourwebsite.com"
//                         className="bg-background/50 border-border/50 focus:border-primary"
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="phone" className="text-sm font-medium">
//                         Phone Number
//                       </Label>
//                       <Input
//                         id="phone"
//                         value={businessInfo.phone}
//                         onChange={(e) => setBusinessInfo((prev) => ({ ...prev, phone: e.target.value }))}
//                         placeholder="+1 (555) 123-4567"
//                         className="bg-background/50 border-border/50 focus:border-primary"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="email" className="text-sm font-medium">
//                       Email
//                     </Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       value={businessInfo.email}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, email: e.target.value }))}
//                       placeholder="contact@yourbusiness.com"
//                       className="bg-background/50 border-border/50 focus:border-primary"
//                     />
//                   </div>
//                 </CardContent>
//               </Card>

//               <div className="space-y-8">
//                 <Card className="glassEffect border-2 card-border-customer-support">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Database className="h-5 w-5 text-chart-1" />
//                       Default CRM Workflow Overview
//                     </CardTitle>
//                     <CardDescription>Here&apos;s what your default workflow will include</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-6">
//                       <div>
//                         <h4 className="font-semibold mb-4 text-primary flex items-center gap-2">
//                           <Sparkles className="h-4 w-4" />
//                           Process Flow:
//                         </h4>
//                         <div className="space-y-3">
//                           {[
//                             "Receive Instagram DM",
//                             "AI lead qualification",
//                             "Collect contact information",
//                             "Send to your CRM",
//                             "Notify your team",
//                           ].map((operation, idx) => (
//                             <div key={idx} className="flex items-center gap-4">
//                               <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-semibold">
//                                 {idx + 1}
//                               </div>
//                               <span className="text-sm font-medium">{operation}</span>
//                             </div>
//                           ))}
//                         </div>
//                       </div>

//                       <div>
//                         <h4 className="font-semibold mb-4 text-primary">Key Features:</h4>
//                         <ul className="space-y-3">
//                           {[
//                             "Instant lead qualification",
//                             "Automatic CRM integration",
//                             "Smart conversation handling",
//                             "Lead scoring & prioritization",
//                             "Human handoff when needed",
//                             "Real-time notifications",
//                           ].map((feature, idx) => (
//                             <li key={idx} className="flex items-center gap-3 text-sm">
//                               <CheckCircle className="h-4 w-4 text-chart-2 flex-shrink-0" />
//                               <span>{feature}</span>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>

//                       <div>
//                         <h4 className="font-semibold mb-4 text-primary">Connected CRM:</h4>
//                         <div className="space-y-2">
//                           {crmIntegrations
//                             .filter((crm) => crm.isActive)
//                             .map((crm) => (
//                               <div key={crm.id} className="flex items-center gap-3 p-3 bg-chart-2/10 rounded-lg">
//                                 <CheckCircle className="h-4 w-4 text-chart-2" />
//                                 <span className="text-sm font-medium">{crm.provider}</span>
//                                 <Badge variant="outline" className="ml-auto text-xs text-chart-2 border-chart-2/20">
//                                   Active
//                                 </Badge>
//                               </div>
//                             ))}
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>

//             <div className="mt-10 flex justify-end">
//               <Button
//                 onClick={handleBusinessInfoSubmit}
//                 disabled={!businessInfo.businessName || !businessInfo.businessType}
//                 size="lg"
//                 className="px-8 py-3 text-base font-semibold"
//               >
//                 Continue to Review
//                 <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // Review step
//   if (step === "review") {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radiale--gradient--automations">
//           <div className="max-w-5xl mx-auto p-6">
//             <div className="mb-8">
//               <Button variant="ghost" onClick={() => setStep("configuration")} className="mb-6 hover:bg-accent">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Configuration
//               </Button>
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Review &amp; Deploy
//                 </h1>
//                 <p className="text-muted-foreground text-lg">
//                   Review your configuration before deploying your workflow
//                 </p>
//               </div>
//             </div>

//             <div className="grid gap-8 lg:grid-cols-2 mb-10">
//               <Card className="glassEffect border-2 border-border/50">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <CheckCircle className="h-5 w-5 text-green-500" />
//                     Workflow Summary
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Workflow Type:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg">
//                       {isDefaultWorkflow ? "Default CRM Workflow" : "Custom Workflow Request"}
//                     </p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Business Name:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg">{businessInfo.businessName}</p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Business Type:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg">{businessInfo.businessType}</p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Setup Time:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg flex items-center gap-2">
//                       <Clock className="h-4 w-4" />
//                       {isDefaultWorkflow ? "Immediate activation" : "3-5 business days"}
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="glassEffect border-2 border-border/50">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Database className="h-5 w-5 text-primary" />
//                     CRM Integration
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-3">
//                     {crmIntegrations
//                       .filter((crm) => crm.isActive)
//                       .map((crm) => (
//                         <div key={crm.id} className="flex items-center gap-3 p-3 bg-chart-2/10 rounded-lg">
//                           <CheckCircle className="h-4 w-4 text-chart-2" />
//                           <div className="flex-1">
//                             <span className="text-sm font-medium">{crm.provider}</span>
//                             <p className="text-xs text-muted-foreground">
//                               Connected on {new Date(crm.createdAt).toLocaleDateString()}
//                             </p>
//                           </div>
//                           <Badge variant="outline" className="text-xs text-chart-2 border-chart-2/20">
//                             Active
//                           </Badge>
//                         </div>
//                       ))}
//                   </div>
//                   <div className="mt-4 text-sm text-muted-foreground">
//                     {isDefaultWorkflow
//                       ? "Your CRM credentials will be automatically used by the workflow to send qualified leads."
//                       : "CRM integration will be configured as part of your custom workflow development."}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             <Card className="glassEffect border-2 border-primary/30 mb-10">
//               <CardContent className="p-6">
//                 <h3 className="font-semibold mb-4 flex items-center gap-2 text-primary">
//                   <Sparkles className="h-5 w-5" />
//                   What happens next?
//                 </h3>
//                 <ul className="space-y-3 text-sm text-muted-foreground">
//                   {isDefaultWorkflow ? (
//                     <>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Your default workflow will be activated immediately upon submission.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Instagram DMs will start being processed automatically using your CRM credentials.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Qualified leads will be sent directly to your connected{" "}
//                         {crmIntegrations.find((crm) => crm.isActive)?.provider || "CRM"}.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         You can monitor performance and leads from your dashboard.
//                       </li>
//                     </>
//                   ) : (
//                     <>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Your custom workflow request will be sent to our development team.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         We will email you at <strong>{businessInfo.email}</strong> when development begins.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         You can return to this page anytime to check the status of your workflow.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Once complete, your custom automation will be available in your dashboard.
//                       </li>
//                     </>
//                   )}
//                 </ul>
//               </CardContent>
//             </Card>

//             <div className="flex justify-between">
//               <Button variant="outline" onClick={() => setStep("configuration")} size="lg">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back
//               </Button>
//               <Button
//                 onClick={handleFinalSubmit}
//                 size="lg"
//                 className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8 py-3 text-base font-semibold glow"
//               >
//                 <Sparkles className="h-4 w-4 mr-2" />
//                 {isDefaultWorkflow ? "Activate Workflow 🚀" : "Submit for Development 🚀"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return null
// }



// "use client"
// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import {
//   Clock,
//   Users,
//   CheckCircle,
//   ArrowLeft,
//   Sparkles,
//   Loader2,
//   AlertTriangle,
//   Database,
//   Settings,
//   LayoutDashboard,
//   ListChecks,
// } from "lucide-react"
// import WorkflowDashboard from "./workflow-dashboard"
// import CustomWorkflowBuilder from "./custom-workflow-builder"
// import WorkflowPendingPage from "./workflow-pending-page"
// import UserWorkflowProgress from "./user-workflow-progress" // Import the user workflow progress component
// import PaymentPopup from "@/components/payment-popup" // Import the PaymentPopup
// import { useSubscription } from "@/contexts/subscription-context" // Assuming you have a subscription context
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog"

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
//   integrations: { name: string; config: any }[]
//   customRequest?: string
//   status:
//     | "DRAFT"
//     | "CONFIGURING"
//     | "SUBMITTED"
//     | "PENDING_CREATION"
//     | "ACTIVE"
//     | "INACTIVE"
//     | "CUSTOM_REQUEST"
//     | "EDIT_REQUESTED"
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
//   submittedAt?: Date
//   estimatedCompletion?: string
// }

// interface PendingWorkflowData {
//   id: string
//   submittedAt: string
//   status: string
//   workflowType?: string
//   estimatedCompletion?: string
// }

// interface CRMIntegration {
//   id: string
//   provider: string
//   name: string
//   isActive: boolean
//   createdAt: string
// }

// interface CustomWorkflowRequest {
//   id: string
//   title: string
//   status: string
//   createdAt: string
// }

// const Logger = {
//   info: (message: string, ...args: any[]) => {
//     console.log(`%cINFO: ${message}`, "color: blue;", ...args)
//   },
//   success: (message: string, ...args: any[]) => {
//     console.log(`%cSUCCESS: ${message}`, "color: green;", ...args)
//   },
//   warn: (message: string, ...args: any[]) => {
//     console.warn(`%cWARN: ${message}`, "color: orange;", ...args)
//   },
//   error: (message: string, ...args: any[]) => {
//     console.error(`%cERROR: ${message}`, "color: red;", ...args)
//   },
// }

// export default function WorkflowSelector() {
//   const [step, setStep] = useState<
//     "selection" | "configuration" | "review" | "dashboard" | "custom-builder" | "pending" | "progress"
//   >("selection")
//   const [businessInfo, setBusinessInfo] = useState({
//     businessName: "",
//     businessType: "",
//     description: "",
//     website: "",
//     phone: "",
//     email: "",
//   })
//   const [customRequest, setCustomRequest] = useState("")
//   const [isCustomWorkflow, setIsCustomWorkflow] = useState(false)
//   const [isDefaultWorkflow, setIsDefaultWorkflow] = useState(false)

//   // WORKFLOW STATE MANAGEMENT
//   const [activeWorkflowExists, setActiveWorkflowExists] = useState(false)
//   const [activeWorkflowDetails, setActiveWorkflowDetails] = useState<BusinessWorkflowConfig | null>(null)
//   const [isFetchingActiveWorkflow, setIsFetchingActiveWorkflow] = useState(true)
//   const [isDeactivating, setIsDeactivating] = useState(false)
//   const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false)

//   // CRM Integration state
//   const [crmIntegrations, setCrmIntegrations] = useState<CRMIntegration[]>([])
//   const [isFetchingCRM, setIsFetchingCRM] = useState(true)

//   // Pending workflow states
//   const [pendingWorkflowData, setPendingWorkflowData] = useState<PendingWorkflowData | null>(null)
//   const [workflowCreationStatus, setWorkflowCreationStatus] = useState<
//     "not-started" | "submitted" | "in-progress" | "completed"
//   >("not-started")

//   // Custom workflow request state for enterprise plan and pending checks
//   const [userWorkflowRequests, setUserWorkflowRequests] = useState<CustomWorkflowRequest[]>([])
//   const [hasPendingCustomWorkflow, setHasPendingCustomWorkflow] = useState(false)
//   const [showPaymentPopup, setShowPaymentPopup] = useState(false)

//   const { subscription } = useSubscription()
//   const currentUserId = "user_clerk_id_placeholder" // Replace with actual user ID from Clerk

//   // Fetch active workflow and CRM integrations
//   useEffect(() => {
//     const fetchWorkflowStatus = async () => {
//       setIsFetchingActiveWorkflow(true)
//       setIsFetchingCRM(true)

//       try {
//         if (!currentUserId) {
//           // Use currentUserId for fetching user-specific data
//           console.warn("No user ID available to fetch workflow status.")
//           setIsFetchingActiveWorkflow(false)
//           setIsFetchingCRM(false)
//           return
//         }

//         // Fetch user's custom workflow requests
//         const userRequestsResponse = await fetch(`/api/user/workflow-requests?userId=${currentUserId}`)
//         if (userRequestsResponse.ok) {
//           const userRequestsData = await userRequestsResponse.json()
//           setUserWorkflowRequests(userRequestsData.requests || [])
//           const pendingOrSubmitted = (userRequestsData.requests || []).some(
//             (req: CustomWorkflowRequest) =>
//               req.status === "SUBMITTED" || req.status === "UNDER_REVIEW" || req.status === "IN_DEVELOPMENT",
//           )
//           setHasPendingCustomWorkflow(pendingOrSubmitted)
//           if (pendingOrSubmitted) {
//             // If there's a pending custom workflow, redirect to progress page
//             setStep("progress")
//           }
//         } else {
//           console.error("Failed to fetch user workflow requests:", await userRequestsResponse.text())
//         }

//         // Check for pending workflow in localStorage first (for template-based workflows)
//         const storedPending = localStorage.getItem("pendingWorkflow")
//         if (storedPending) {
//           const pendingData: PendingWorkflowData = JSON.parse(storedPending)

//           // Verify the status with backend
//           const statusResponse = await fetch(`/api/workflow-config/${pendingData.id}`)
//           if (statusResponse.ok) {
//             const statusData = await statusResponse.json()

//             if (statusData.status === "ACTIVE") {
//               // Workflow is now active, remove from localStorage and show dashboard
//               localStorage.removeItem("pendingWorkflow")
//               setActiveWorkflowExists(true)
//               setActiveWorkflowDetails(statusData)
//               setWorkflowCreationStatus("completed")
//               setStep("dashboard")
//             } else if (statusData.status === "PENDING_CREATION") {
//               // Still pending, show pending page
//               setPendingWorkflowData(pendingData)
//               setWorkflowCreationStatus("in-progress")
//               setStep("pending")
//             } else {
//               // Some other status, clean up localStorage
//               localStorage.removeItem("pendingWorkflow")
//             }
//           } else {
//             // Workflow not found, clean up localStorage
//             localStorage.removeItem("pendingWorkflow")
//           }
//         }

//         // Fetch active workflows and CRM integrations in parallel
//         const [workflowResponse, crmResponse] = await Promise.all([
//           fetch(`/api/workflow-config?businessId=${currentUserId}&status=ACTIVE`), // Assuming businessId maps to userId
//           fetch(`/api/crm/integrations?userId=${currentUserId}`),
//         ])

//         // Handle workflow response
//         if (workflowResponse.ok) {
//           const workflowData = await workflowResponse.json()
//           if (workflowData.workflowConfigs && workflowData.workflowConfigs.length > 0) {
//             const activeConfig = workflowData.workflowConfigs[0]
//             setActiveWorkflowExists(true)
//             setActiveWorkflowDetails(activeConfig)
//             setWorkflowCreationStatus("completed")

//             // Only set to dashboard if we're not already showing pending or progress
//             if (step !== "pending" && step !== "progress") {
//               setStep("dashboard")
//             }
//           } else {
//             setActiveWorkflowExists(false)
//             setActiveWorkflowDetails(null)
//           }
//         }

//         // Handle CRM response
//         if (crmResponse.ok) {
//           const crmData = await crmResponse.json()
//           setCrmIntegrations(crmData.integrations || [])

//           // Auto-activate default workflow if CRM is connected but no active workflow exists
//           const activeCRMIntegrations = (crmData.integrations || []).filter((crm: any) => crm.isActive)

//           if (
//             activeCRMIntegrations.length > 0 &&
//             !activeWorkflowExists &&
//             !storedPending &&
//             !hasPendingCustomWorkflow
//           ) {
//             Logger.info("🚀 Auto-activating default workflow - CRM connected but no active workflow")

//             try {
//               const autoActivateResponse = await fetch("/api/workflow-config", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                   workflowTemplateId: "default-crm-workflow",
//                   businessId: currentUserId, // Use currentUserId as businessId
//                   businessInfo: {
//                     businessName: "Auto-activated Business",
//                     businessType: "Service Business",
//                     description: "Auto-activated default workflow",
//                   },
//                   integrations: [], // Empty for default workflow
//                   status: "ACTIVE",
//                   isActive: true,
//                   submittedAt: new Date().toISOString(),
//                   estimatedCompletion: "immediate",
//                 }),
//               })

//               if (autoActivateResponse.ok) {
//                 const result = await autoActivateResponse.json()
//                 if (result.success) {
//                   setActiveWorkflowExists(true)
//                   setActiveWorkflowDetails(result.workflowConfig)
//                   setWorkflowCreationStatus("completed")
//                   setStep("dashboard")
//                   Logger.success("✅ Default workflow auto-activated successfully")
//                 }
//               }
//             } catch (error) {
//               Logger.error("Failed to auto-activate default workflow:", error)
//             }
//           }
//         } else {
//           console.error("Failed to fetch CRM integrations:", await crmResponse.text())
//         }
//       } catch (error) {
//         console.error("Error fetching workflow status:", error)
//       } finally {
//         setIsFetchingActiveWorkflow(false)
//         setIsFetchingCRM(false)
//       }
//     }

//     fetchWorkflowStatus()
//   }, [currentUserId, activeWorkflowExists, hasPendingCustomWorkflow, step]) // Added dependencies

//   // Periodic status checking when in pending state
//   useEffect(() => {
//     let interval: NodeJS.Timeout | null = null

//     if (step === "pending" && pendingWorkflowData) {
//       interval = setInterval(async () => {
//         try {
//           const response = await fetch(`/api/workflow-config/${pendingWorkflowData.id}`)
//           if (response.ok) {
//             const data = await response.json()
//             if (data.status === "ACTIVE") {
//               localStorage.removeItem("pendingWorkflow")
//               setActiveWorkflowExists(true)
//               setActiveWorkflowDetails(data)
//               setWorkflowCreationStatus("completed")
//               setStep("dashboard")
//               setPendingWorkflowData(null)
//             }
//           }
//         } catch (error) {
//           console.error("Error checking workflow status:", error)
//         }
//       }, 30000) // Check every 30 seconds
//     }

//     return () => {
//       if (interval) clearInterval(interval)
//     }
//   }, [step, pendingWorkflowData])

//   const handleDefaultWorkflowSelect = () => {
//     if (activeWorkflowExists) return
//     setIsDefaultWorkflow(true)
//     setIsCustomWorkflow(false)
//     setCustomRequest("")
//     setStep("configuration")
//   }

//   const handleCustomWorkflowSelect = () => {
//     if (activeWorkflowExists) return
//     if (subscription?.plan.toUpperCase() !== "ENTERPRISE") {
//       setShowPaymentPopup(true)
//       return
//     }
//     if (hasPendingCustomWorkflow) {
//       setStep("progress") // Redirect to progress if already has a pending custom workflow
//       return
//     }
//     setIsCustomWorkflow(true)
//     setIsDefaultWorkflow(false)
//     setCustomRequest("")
//     setStep("custom-builder")
//   }

//   const handleBusinessInfoSubmit = () => {
//     setStep("review")
//   }

//   const handleFinalSubmit = async () => {
//     const businessIdToUse = currentUserId // Use currentUserId as businessId

//     if (!businessIdToUse) {
//       alert("Error: Business ID is missing. Cannot deploy workflow.")
//       return
//     }

//     const workflowData = {
//       workflowTemplateId: isDefaultWorkflow ? "default-crm-workflow" : null,
//       businessId: businessIdToUse,
//       businessInfo,
//       integrations: [], // Empty for default workflow - CRM credentials are fetched automatically
//       customRequest: isCustomWorkflow ? customRequest : undefined,
//       status: isDefaultWorkflow ? "ACTIVE" : "PENDING_CREATION", // Default workflow is immediately active
//       isActive: isDefaultWorkflow, // Default workflow is immediately active
//       submittedAt: new Date().toISOString(),
//       estimatedCompletion: isDefaultWorkflow ? "immediate" : "3-5",
//     }

//     console.log("Submitting workflow configuration:", workflowData)

//     try {
//       const response = await fetch("/api/workflow-config", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(workflowData),
//       })
//       const result = await response.json()

//       if (result.success) {
//         if (isDefaultWorkflow) {
//           // Default workflow is immediately active
//           setActiveWorkflowExists(true)
//           setActiveWorkflowDetails(result.workflowConfig)
//           setWorkflowCreationStatus("completed")
//           setStep("dashboard")
//         } else {
//           // Custom workflow goes to pending
//           const pendingData: PendingWorkflowData = {
//             id: result.workflowConfig.id,
//             submittedAt: result.workflowConfig.createdAt, // Use createdAt from response
//             status: "PENDING_CREATION",
//             workflowType: "Custom Workflow",
//             estimatedCompletion: "3-5",
//           }

//           localStorage.setItem("pendingWorkflow", JSON.stringify(pendingData))
//           setPendingWorkflowData(pendingData)
//           setWorkflowCreationStatus("submitted")
//           setHasPendingCustomWorkflow(true) // Mark as having a pending custom workflow
//           setStep("progress") // Redirect to progress page
//         }
//       } else {
//         alert(`Failed to submit workflow: ${result.error || "Unknown error"}`)
//       }
//     } catch (error) {
//       console.error("Error submitting workflow configuration:", error)
//       alert("An unexpected error occurred during submission.")
//     }
//   }

//   const handleDeactivateWorkflow = async () => {
//     if (!activeWorkflowDetails?.id) {
//       alert("No active workflow to deactivate.")
//       return
//     }
//     setShowDeactivateConfirm(true)
//   }

//   const confirmDeactivate = async () => {
//     setShowDeactivateConfirm(false)
//     setIsDeactivating(true)
//     try {
//       const response = await fetch("/api/workflow-config", {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           id: activeWorkflowDetails?.id,
//           isActive: false,
//           status: "INACTIVE",
//         }),
//       })

//       if (response.ok) {
//         alert("Workflow deactivated successfully!")
//         setActiveWorkflowExists(false)
//         setActiveWorkflowDetails(null)
//         setStep("selection")
//         setBusinessInfo({ businessName: "", businessType: "", description: "", website: "", phone: "", email: "" })
//         setCustomRequest("")
//         setIsCustomWorkflow(false)
//         setIsDefaultWorkflow(false)
//         setWorkflowCreationStatus("not-started")
//         setPendingWorkflowData(null)
//         // Also clear any pending custom workflow state if it was related to this deactivation
//         setHasPendingCustomWorkflow(false)
//         setUserWorkflowRequests([])
//       } else {
//         const errorData = await response.json()
//         alert(`Failed to deactivate workflow: ${errorData.error || "Unknown error"}`)
//       }
//     } catch (error) {
//       console.error("Error deactivating workflow:", error)
//       alert("An unexpected error occurred during deactivation.")
//     } finally {
//       setIsDeactivating(false)
//     }
//   }

//   const handlePaymentSuccess = () => {
//     // After successful payment, assume subscription context updates and re-evaluate
//     setShowPaymentPopup(false)
//     // Re-check subscription status and if enterprise, allow to proceed
//     if (subscription?.plan.toUpperCase() === "ENTERPRISE") {
//       handleCustomWorkflowSelect() // Try to proceed with custom workflow selection again
//     }
//   }

//   // --- CONDITIONAL RENDERING ---

//   if (isFetchingActiveWorkflow || isFetchingCRM) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <Loader2 className="h-10 w-10 animate-spin text-primary" />
//         <span className="ml-4 text-lg text-muted-foreground">Loading your workflows...</span>
//       </div>
//     )
//   }

//   // Render pending page (for template-based workflows)
//   if (step === "pending" && pendingWorkflowData) {
//     return (
//       <WorkflowPendingPage
//         pendingWorkflowData={pendingWorkflowData}
//         businessInfo={businessInfo}
//         onBackToSelection={() => {
//           if (confirm("Are you sure you want to go back? Your pending workflow will remain in queue.")) {
//             setStep("selection")
//           }
//         }}
//       />
//     )
//   }

//   // Render dashboard if active workflow exists
//   if (activeWorkflowExists && activeWorkflowDetails && step === "dashboard") {
//     return (
//       <>
//         <WorkflowDashboard
//           workflowDetails={activeWorkflowDetails}
//           onDeactivate={handleDeactivateWorkflow}
//           isDeactivating={isDeactivating}
//         />
//         <AlertDialog open={showDeactivateConfirm} onOpenChange={setShowDeactivateConfirm}>
//           <AlertDialogContent>
//             <AlertDialogHeader>
//               <AlertDialogTitle className="flex items-center gap-2 text-red-500">
//                 <AlertTriangle className="h-6 w-6" />
//                 Confirm Deactivation
//               </AlertDialogTitle>
//               <AlertDialogDescription>
//                 Are you sure you want to deactivate your current workflow? This will stop all automated responses and
//                 you will need to set up a new one to resume automation.
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogCancel>Cancel</AlertDialogCancel>
//               <AlertDialogAction onClick={confirmDeactivate} className="bg-red-600 hover:bg-red-700">
//                 Deactivate
//               </AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>
//       </>
//     )
//   }

//   // Render CustomWorkflowBuilder
//   if (step === "custom-builder") {
//     return (
//       <CustomWorkflowBuilder
//         businessInfo={businessInfo}
//         selectedWorkflowId={null}
//         setStep={(s) => {
//           if (s === "selection" || s === "dashboard" || s === "progress") {
//             // Allow redirect to progress
//             setStep(s)
//           }
//         }}
//         setActiveWorkflowExists={setActiveWorkflowExists}
//         setActiveWorkflowDetails={setActiveWorkflowDetails}
//       />
//     )
//   }

//   // Render UserWorkflowProgress
//   if (step === "progress") {
//     return (
//       <UserWorkflowProgress
//         userId={currentUserId}
//         onRequestsUpdated={async () => {
//           // Re-fetch user requests to update state
//           const userRequestsResponse = await fetch(`/api/user/workflow-requests?userId=${currentUserId}`)
//           if (userRequestsResponse.ok) {
//             const userRequestsData = await userRequestsResponse.json()
//             setUserWorkflowRequests(userRequestsData.requests || [])
//             const pendingOrSubmitted = (userRequestsData.requests || []).some(
//               (req: CustomWorkflowRequest) =>
//                 req.status === "SUBMITTED" || req.status === "UNDER_REVIEW" || req.status === "IN_DEVELOPMENT",
//             )
//             setHasPendingCustomWorkflow(pendingOrSubmitted)
//           }
//         }}
//         onBackToSelection={() => setStep("selection")}
//       />
//     )
//   }

//   // Main selection page with only 2 cards
//   if (step === "selection") {
//     const activeCRMIntegrations = crmIntegrations.filter((crm) => crm.isActive)

//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radiale--gradient--automations">
//           <div className="max-w-7xl mx-auto p-6">
//             {/* Navigation Buttons */}
//             <div className="flex justify-end gap-4 mb-8">
//               {activeWorkflowExists && (
//                 <Button variant="outline" onClick={() => setStep("dashboard")}>
//                   <LayoutDashboard className="h-4 w-4 mr-2" />
//                   My Workflow Dashboard
//                 </Button>
//               )}
//               <Button variant="outline" onClick={() => setStep("progress")}>
//                 <ListChecks className="h-4 w-4 mr-2" />
//                 My Workflow Requests
//                 {hasPendingCustomWorkflow && <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
//               </Button>
//             </div>

//             <div className="text-center mb-12">
//               <div className="flex items-center justify-center gap-3 mb-6">
//                 <Sparkles className="h-8 w-8 text-primary" />
//                 <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Choose Your Business Workflow
//                 </h1>
//               </div>
//               <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
//                 Start with our default CRM workflow or request a custom solution tailored to your needs
//               </p>
//             </div>

//             <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
//               {/* Default CRM Workflow Card */}
//               <Card
//                 className={`cursor-pointer transition-all duration-300 border-2 glassEffect card-border-customer-support hover:scale-105 ${activeWorkflowExists ? "opacity-50 cursor-not-allowed" : ""}`}
//                 onClick={() => !activeWorkflowExists && handleDefaultWorkflowSelect()}
//               >
//                 <CardHeader className="pb-4">
//                   <div className="flex items-center gap-4 mb-4">
//                     <div className="p-3 rounded-xl bg-primary/10 template-icon-container">
//                       <Database className="h-6 w-6 text-chart-1" />
//                     </div>
//                     <div className="flex-1">
//                       <CardTitle className="text-xl mb-2">Default CRM Workflow</CardTitle>
//                       <Badge variant="outline" className="text-xs bg-chart-2/10 text-chart-2 border-chart-2/20">
//                         Recommended
//                       </Badge>
//                     </div>
//                   </div>
//                   <CardDescription className="text-sm leading-relaxed">
//                     Perfect for getting started quickly. Automatically qualifies leads through Instagram DMs and sends
//                     them directly to your connected CRM system.
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div>
//                     <h4 className="font-semibold text-sm mb-3 text-primary">Process Flow:</h4>
//                     <div className="space-y-2">
//                       {[
//                         "Receive Instagram DM",
//                         "AI lead qualification",
//                         "Collect contact information",
//                         "Send to your CRM",
//                         "Notify your team",
//                       ].map((operation, idx) => (
//                         <div key={idx} className="flex items-center gap-3">
//                           <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
//                             {idx + 1}
//                           </div>
//                           <span className="text-sm text-muted-foreground">{operation}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   <div>
//                     <h4 className="font-semibold text-sm mb-3 text-primary">Key Features:</h4>
//                     <ul className="space-y-2">
//                       {[
//                         "Instant lead qualification",
//                         "Automatic CRM integration",
//                         "Smart conversation handling",
//                         "Lead scoring & prioritization",
//                       ].map((feature, idx) => (
//                         <li key={idx} className="flex items-center gap-2 text-sm">
//                           <CheckCircle className="h-4 w-4 text-chart-2 flex-shrink-0" />
//                           <span className="text-muted-foreground">{feature}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>

//                   <div>
//                     <h4 className="font-semibold text-sm mb-3 text-primary">CRM Integration Status:</h4>
//                     {activeCRMIntegrations.length > 0 ? (
//                       <div className="space-y-2">
//                         {activeCRMIntegrations.map((crm) => (
//                           <div key={crm.id} className="flex items-center gap-2 text-sm bg-chart-2/10 p-2 rounded-lg">
//                             <CheckCircle className="h-4 w-4 text-chart-2" />
//                             <span className="text-foreground font-medium">{crm.provider}</span>
//                             <Badge variant="outline" className="ml-auto text-xs text-chart-2 border-chart-2/20">
//                               Auto-Active
//                             </Badge>
//                           </div>
//                         ))}
//                         <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
//                           <p className="text-xs text-blue-600 dark:text-blue-400">
//                             🎉 Your default workflow is automatically active and processing Instagram DMs!
//                           </p>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="bg-destructive/10 p-3 rounded-lg">
//                         <div className="flex items-center gap-2 text-sm text-destructive mb-2">
//                           <AlertTriangle className="h-4 w-4" />
//                           <span className="font-medium">No CRM Connected</span>
//                         </div>
//                         <p className="text-xs text-muted-foreground">
//                           Connect a CRM first to automatically activate the default workflow. Go to the Leads page to
//                           connect your CRM via OAuth.
//                         </p>
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex gap-2 mt-4">
//                     <Button
//                       onClick={() => handleDefaultWorkflowSelect()}
//                       className="flex-1"
//                       disabled={activeWorkflowExists || activeCRMIntegrations.length === 0}
//                     >
//                       {activeCRMIntegrations.length === 0 ? "Connect CRM First" : "Configure Default Workflow"}
//                     </Button>
//                   </div>

//                   {activeCRMIntegrations.length > 0 && (
//                     <div className="mt-3 p-2 bg-chart-2/10 rounded-lg">
//                       <p className="text-xs text-chart-2 font-medium">
//                         ✨ Default workflow activates automatically when you have a connected CRM
//                       </p>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>

//               {/* Custom Workflow Request Card */}
//               <Card
//                 className={`cursor-pointer transition-all duration-300 border-2 border-dashed border-border/50 glassEffect hover:border-primary/50 hover:shadow-lg flex flex-col ${activeWorkflowExists || hasPendingCustomWorkflow ? "opacity-50 cursor-not-allowed" : ""}`}
//                 onClick={() => !activeWorkflowExists && handleCustomWorkflowSelect()}
//               >
//                 <CardHeader className="pb-4">
//                   <div className="flex items-center gap-4 mb-4">
//                     <div className="p-3 rounded-xl bg-primary/10 template-icon-container">
//                       <Settings className="h-6 w-6 text-chart-4" />
//                     </div>
//                     <div className="flex-1">
//                       <CardTitle className="text-xl mb-2">Request Custom Workflow</CardTitle>
//                       <Badge variant="outline" className="text-xs bg-chart-4/10 text-chart-4 border-chart-4/20">
//                         Tailored Solution
//                       </Badge>
//                     </div>
//                   </div>
//                   <CardDescription className="text-sm leading-relaxed">
//                     Need something more specific? Describe your unique business requirements and we&apos;ll build a
//                     custom workflow just for you.
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6 flex-1">
//                   <div>
//                     <h4 className="font-semibold text-sm mb-3 text-primary">What You Get:</h4>
//                     <ul className="space-y-2">
//                       {[
//                         "Personalized workflow design",
//                         "Custom integrations",
//                         "Advanced automation logic",
//                         "Dedicated development support",
//                       ].map((feature, idx) => (
//                         <li key={idx} className="flex items-center gap-2 text-sm">
//                           <Sparkles className="h-4 w-4 text-chart-4 flex-shrink-0" />
//                           <span className="text-muted-foreground">{feature}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>

//                   <div>
//                     <h4 className="font-semibold text-sm mb-3 text-primary">Perfect For:</h4>
//                     <p className="text-xs text-muted-foreground leading-relaxed">
//                       Complex business processes, multiple integrations, unique industry requirements, or specialized
//                       automation needs that go beyond standard workflows.
//                     </p>
//                   </div>

//                   <div className="bg-chart-4/10 p-3 rounded-lg">
//                     <div className="flex items-center gap-2 text-sm text-chart-4 mb-1">
//                       <Clock className="h-4 w-4" />
//                       <span className="font-medium">Development Time: 3-5 business days</span>
//                     </div>
//                     <p className="text-xs text-muted-foreground">
//                       Our team will review your requirements and build your custom solution.
//                     </p>
//                   </div>

//                   <div className="flex gap-2 mt-auto">
//                     <Button
//                       onClick={() => handleCustomWorkflowSelect()}
//                       variant="outline"
//                       className="flex-1 bg-transparent hover:bg-accent"
//                       disabled={activeWorkflowExists || hasPendingCustomWorkflow}
//                     >
//                       {hasPendingCustomWorkflow ? "Custom Workflow Pending" : "Request Custom Workflow"}
//                     </Button>
//                   </div>
//                   {hasPendingCustomWorkflow && (
//                     <p className="text-xs text-muted-foreground mt-2">
//                       You have a pending custom workflow. Please check "My Workflow Requests".
//                     </p>
//                   )}
//                 </CardContent>
//               </Card>
//             </div>

//             {/* CRM Connection Notice */}
//             {activeCRMIntegrations.length === 0 && (
//               <div className="max-w-4xl mx-auto mt-8">
//                 <Card className="border-2 border-destructive/20 bg-destructive/5">
//                   <CardContent className="p-6">
//                     <div className="flex items-start gap-4">
//                       <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-1" />
//                       <div>
//                         <h3 className="font-semibold text-destructive mb-2">CRM Integration Required</h3>
//                         <p className="text-sm text-muted-foreground mb-4">
//                           To use the default workflow, you need to connect a CRM system first. This allows us to
//                           automatically send qualified leads to your CRM.
//                         </p>
//                         <Button
//                           variant="outline"
//                           className="text-destructive border-destructive/20 hover:bg-destructive/10 bg-transparent"
//                         >
//                           Go to Leads Page to Connect CRM
//                         </Button>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             )}
//           </div>
//         </div>
//         <PaymentPopup
//           isOpen={showPaymentPopup}
//           onClose={() => setShowPaymentPopup(false)}
//           onSuccess={handlePaymentSuccess}
//         />
//       </div>
//     )
//   }

//   // Configuration step for default workflow
//   if (step === "configuration") {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radiale--gradient--automations">
//           <div className="max-w-4xl mx-auto p-6">
//             <div className="mb-8">
//               <Button variant="ghost" onClick={() => setStep("selection")} className="mb-6 hover:bg-accent">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Selection
//               </Button>
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Configure Your {isDefaultWorkflow ? "Default CRM" : "Custom"} Workflow
//                 </h1>
//                 <p className="text-muted-foreground text-lg">
//                   Provide your business information to personalize the workflow
//                 </p>
//               </div>
//             </div>

//             <div className="grid gap-8 lg:grid-cols-2">
//               <Card className="glassEffect border-2 border-border/50">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Users className="h-5 w-5 text-primary" />
//                     Business Information
//                   </CardTitle>
//                   <CardDescription>
//                     This information will be used to personalize your automated responses
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div className="space-y-2">
//                     <Label htmlFor="businessName" className="text-sm font-medium">
//                       Business Name *
//                     </Label>
//                     <Input
//                       id="businessName"
//                       value={businessInfo.businessName}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, businessName: e.target.value }))}
//                       placeholder="Your Business Name"
//                       className="bg-background/50 border-border/50 focus:border-primary"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="businessType" className="text-sm font-medium">
//                       Business Type *
//                     </Label>
//                     <Input
//                       id="businessType"
//                       value={businessInfo.businessType}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, businessType: e.target.value }))}
//                       placeholder="e.g., Hair Salon, Photography Studio"
//                       className="bg-background/50 border-border/50 focus:border-primary"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="description" className="text-sm font-medium">
//                       Business Description
//                     </Label>
//                     <Textarea
//                       id="description"
//                       value={businessInfo.description}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, description: e.target.value }))}
//                       placeholder="Brief description of your services..."
//                       rows={3}
//                       className="bg-background/50 border-border/50 focus:border-primary resize-none"
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="website" className="text-sm font-medium">
//                         Website
//                       </Label>
//                       <Input
//                         id="website"
//                         value={businessInfo.website}
//                         onChange={(e) => setBusinessInfo((prev) => ({ ...prev, website: e.target.value }))}
//                         placeholder="https://yourwebsite.com"
//                         className="bg-background/50 border-border/50 focus:border-primary"
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="phone" className="text-sm font-medium">
//                         Phone Number
//                       </Label>
//                       <Input
//                         id="phone"
//                         value={businessInfo.phone}
//                         onChange={(e) => setBusinessInfo((prev) => ({ ...prev, phone: e.target.value }))}
//                         placeholder="+1 (555) 123-4567"
//                         className="bg-background/50 border-border/50 focus:border-primary"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="email" className="text-sm font-medium">
//                       Email
//                     </Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       value={businessInfo.email}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, email: e.target.value }))}
//                       placeholder="contact@yourbusiness.com"
//                       className="bg-background/50 border-border/50 focus:border-primary"
//                     />
//                   </div>
//                 </CardContent>
//               </Card>

//               <div className="space-y-8">
//                 <Card className="glassEffect border-2 card-border-customer-support">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Database className="h-5 w-5 text-chart-1" />
//                       Default CRM Workflow Overview
//                     </CardTitle>
//                     <CardDescription>Here&apos;s what your default workflow will include</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-6">
//                       <div>
//                         <h4 className="font-semibold mb-4 text-primary flex items-center gap-2">
//                           <Sparkles className="h-4 w-4" />
//                           Process Flow:
//                         </h4>
//                         <div className="space-y-3">
//                           {[
//                             "Receive Instagram DM",
//                             "AI lead qualification",
//                             "Collect contact information",
//                             "Send to your CRM",
//                             "Notify your team",
//                           ].map((operation, idx) => (
//                             <div key={idx} className="flex items-center gap-4">
//                               <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-semibold">
//                                 {idx + 1}
//                               </div>
//                               <span className="text-sm font-medium">{operation}</span>
//                             </div>
//                           ))}
//                         </div>
//                       </div>

//                       <div>
//                         <h4 className="font-semibold mb-4 text-primary">Key Features:</h4>
//                         <ul className="space-y-3">
//                           {[
//                             "Instant lead qualification",
//                             "Automatic CRM integration",
//                             "Smart conversation handling",
//                             "Lead scoring & prioritization",
//                             "Human handoff when needed",
//                             "Real-time notifications",
//                           ].map((feature, idx) => (
//                             <li key={idx} className="flex items-center gap-3 text-sm">
//                               <CheckCircle className="h-4 w-4 text-chart-2 flex-shrink-0" />
//                               <span>{feature}</span>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>

//                       <div>
//                         <h4 className="font-semibold mb-4 text-primary">Connected CRM:</h4>
//                         <div className="space-y-2">
//                           {crmIntegrations
//                             .filter((crm) => crm.isActive)
//                             .map((crm) => (
//                               <div key={crm.id} className="flex items-center gap-3 p-3 bg-chart-2/10 rounded-lg">
//                                 <CheckCircle className="h-4 w-4 text-chart-2" />
//                                 <span className="text-sm font-medium">{crm.provider}</span>
//                                 <Badge variant="outline" className="ml-auto text-xs text-chart-2 border-chart-2/20">
//                                   Active
//                                 </Badge>
//                               </div>
//                             ))}
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>

//             <div className="mt-10 flex justify-end">
//               <Button
//                 onClick={handleBusinessInfoSubmit}
//                 disabled={!businessInfo.businessName || !businessInfo.businessType}
//                 size="lg"
//                 className="px-8 py-3 text-base font-semibold"
//               >
//                 Continue to Review
//                 <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // Review step
//   if (step === "review") {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radiale--gradient--automations">
//           <div className="max-w-5xl mx-auto p-6">
//             <div className="mb-8">
//               <Button variant="ghost" onClick={() => setStep("configuration")} className="mb-6 hover:bg-accent">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Configuration
//               </Button>
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Review &amp; Deploy
//                 </h1>
//                 <p className="text-muted-foreground text-lg">
//                   Review your configuration before deploying your workflow
//                 </p>
//               </div>
//             </div>

//             <div className="grid gap-8 lg:grid-cols-2 mb-10">
//               <Card className="glassEffect border-2 border-border/50">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <CheckCircle className="h-5 w-5 text-green-500" />
//                     Workflow Summary
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Workflow Type:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg">
//                       {isDefaultWorkflow ? "Default CRM Workflow" : "Custom Workflow Request"}
//                     </p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Business Name:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg">{businessInfo.businessName}</p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Business Type:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg">{businessInfo.businessType}</p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Setup Time:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg flex items-center gap-2">
//                       <Clock className="h-4 w-4" />
//                       {isDefaultWorkflow ? "Immediate activation" : "3-5 business days"}
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="glassEffect border-2 border-border/50">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Database className="h-5 w-5 text-primary" />
//                     CRM Integration
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-3">
//                     {crmIntegrations
//                       .filter((crm) => crm.isActive)
//                       .map((crm) => (
//                         <div key={crm.id} className="flex items-center gap-3 p-3 bg-chart-2/10 rounded-lg">
//                           <CheckCircle className="h-4 w-4 text-chart-2" />
//                           <div className="flex-1">
//                             <span className="text-sm font-medium">{crm.provider}</span>
//                             <p className="text-xs text-muted-foreground">
//                               Connected on {new Date(crm.createdAt).toLocaleDateString()}
//                             </p>
//                           </div>
//                           <Badge variant="outline" className="text-xs text-chart-2 border-chart-2/20">
//                             Active
//                           </Badge>
//                         </div>
//                       ))}
//                   </div>
//                   <div className="mt-4 text-sm text-muted-foreground">
//                     {isDefaultWorkflow
//                       ? "Your CRM credentials will be automatically used by the workflow to send qualified leads."
//                       : "CRM integration will be configured as part of your custom workflow development."}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             <Card className="glassEffect border-2 border-primary/30 mb-10">
//               <CardContent className="p-6">
//                 <h3 className="font-semibold mb-4 flex items-center gap-2 text-primary">
//                   <Sparkles className="h-5 w-5" />
//                   What happens next?
//                 </h3>
//                 <ul className="space-y-3 text-sm text-muted-foreground">
//                   {isDefaultWorkflow ? (
//                     <>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Your default workflow will be activated immediately upon submission.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Instagram DMs will start being processed automatically using your CRM credentials.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Qualified leads will be sent directly to your connected{" "}
//                         {crmIntegrations.find((crm) => crm.isActive)?.provider || "CRM"}.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         You can monitor performance and leads from your dashboard.
//                       </li>
//                     </>
//                   ) : (
//                     <>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Your custom workflow request will be sent to our development team.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         We will email you at <strong>{businessInfo.email}</strong> when development begins.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         You can return to this page anytime to check the status of your workflow.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Once complete, your custom automation will be available in your dashboard.
//                       </li>
//                     </>
//                   )}
//                 </ul>
//               </CardContent>
//             </Card>

//             <div className="flex justify-between">
//               <Button variant="outline" onClick={() => setStep("configuration")} size="lg">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back
//               </Button>
//               <Button
//                 onClick={handleFinalSubmit}
//                 size="lg"
//                 className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8 py-3 text-base font-semibold glow"
//               >
//                 <Sparkles className="h-4 w-4 mr-2" />
//                 {isDefaultWorkflow ? "Activate Workflow 🚀" : "Submit for Development 🚀"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return null
// }


// "use client"
// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import {
//   Clock,
//   Users,
//   CheckCircle,
//   ArrowLeft,
//   Sparkles,
//   Loader2,
//   AlertTriangle,
//   Database,
//   Settings,
//   LayoutDashboard,
//   ListChecks,
// } from "lucide-react"
// import WorkflowDashboard from "./workflow-dashboard"
// import CustomWorkflowBuilder from "./custom-workflow-builder"
// import WorkflowPendingPage from "./workflow-pending-page"
// import UserWorkflowProgress from "./user-workflow-progress" // Import the user workflow progress component
// import PaymentPopup from "@/components/global/stripe/payment-popup" // Import the PaymentPopup
// import { useSubscription } from "@/contexts/subscription-context" // Assuming you have a subscription context
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog"
// import type {
//   BusinessWorkflowConfig,
//   PendingWorkflowData,
//   CRMIntegration,
//   CustomWorkflowRequest,
// } from "@/types/workflow" 

// const Logger = {
//   info: (message: string, ...args: any[]) => {
//     console.log(`%cINFO: ${message}`, "color: blue;", ...args)
//   },
//   success: (message: string, ...args: any[]) => {
//     console.log(`%cSUCCESS: ${message}`, "color: green;", ...args)
//   },
//   warn: (message: string, ...args: any[]) => {
//     console.warn(`%cWARN: ${message}`, "color: orange;", ...args)
//   },
//   error: (message: string, ...args: any[]) => {
//     console.error(`%cERROR: ${message}`, "color: red;", ...args)
//   },
// }

// export default function WorkflowSelector() {
//   const [step, setStep] = useState<
//     "selection" | "configuration" | "review" | "dashboard" | "custom-builder" | "pending" | "progress"
//   >("selection")
//   const [businessInfo, setBusinessInfo] = useState({
//     businessName: "",
//     businessType: "",
//     description: "",
//     website: "",
//     phone: "",
//     email: "",
//   })
//   const [customRequest, setCustomRequest] = useState("")
//   const [isCustomWorkflow, setIsCustomWorkflow] = useState(false)
//   const [isDefaultWorkflow, setIsDefaultWorkflow] = useState(false)

//   // WORKFLOW STATE MANAGEMENT
//   const [activeWorkflowExists, setActiveWorkflowExists] = useState(false)
//   const [activeWorkflowDetails, setActiveWorkflowDetails] = useState<BusinessWorkflowConfig | null>(null)
//   const [isFetchingActiveWorkflow, setIsFetchingActiveWorkflow] = useState(true)
//   const [isDeactivating, setIsDeactivating] = useState(false)
//   const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false)

//   // CRM Integration state
//   const [crmIntegrations, setCrmIntegrations] = useState<CRMIntegration[]>([])
//   const [isFetchingCRM, setIsFetchingCRM] = useState(true)

//   // Pending workflow states
//   const [pendingWorkflowData, setPendingWorkflowData] = useState<PendingWorkflowData | null>(null)
//   const [workflowCreationStatus, setWorkflowCreationStatus] = useState<
//     "not-started" | "submitted" | "in-progress" | "completed"
//   >("not-started")

//   // Custom workflow request state for enterprise plan and pending checks
//   const [userWorkflowRequests, setUserWorkflowRequests] = useState<CustomWorkflowRequest[]>([])
//   const [hasPendingCustomWorkflow, setHasPendingCustomWorkflow] = useState(false)
//   const [showPaymentPopup, setShowPaymentPopup] = useState(false)

//   const { subscription } = useSubscription()
//   const currentUserId = "user_clerk_id_placeholder" // Replace with actual user ID from Clerk

//   // Fetch active workflow and CRM integrations
//   useEffect(() => {
//     const fetchWorkflowStatus = async () => {
//       setIsFetchingActiveWorkflow(true)
//       setIsFetchingCRM(true)

//       try {
//         if (!currentUserId) {
//           // Use currentUserId for fetching user-specific data
//           console.warn("No user ID available to fetch workflow status.")
//           setIsFetchingActiveWorkflow(false)
//           setIsFetchingCRM(false)
//           return
//         }

//         // Fetch user's custom workflow requests
//         const userRequestsResponse = await fetch(`/api/user/workflow-requests?userId=${currentUserId}`)
//         if (userRequestsResponse.ok) {
//           const userRequestsData = await userRequestsResponse.json()
//           setUserWorkflowRequests(userRequestsData.requests || [])
//           const pendingOrSubmitted = (userRequestsData.requests || []).some(
//             (req: CustomWorkflowRequest) =>
//               req.status === "SUBMITTED" || req.status === "UNDER_REVIEW" || req.status === "IN_DEVELOPMENT",
//           )
//           setHasPendingCustomWorkflow(pendingOrSubmitted)
//           if (pendingOrSubmitted) {
//             // If there's a pending custom workflow, redirect to progress page
//             setStep("progress")
//           }
//         } else {
//           console.error("Failed to fetch user workflow requests:", await userRequestsResponse.text())
//         }

//         // Check for pending workflow in localStorage first (for template-based workflows)
//         const storedPending = localStorage.getItem("pendingWorkflow")
//         if (storedPending) {
//           const pendingData: PendingWorkflowData = JSON.parse(storedPending)

//           // Verify the status with backend
//           const statusResponse = await fetch(`/api/workflow-config/${pendingData.id}`)
//           if (statusResponse.ok) {
//             const statusData = await statusResponse.json()

//             if (statusData.status === "ACTIVE") {
//               // Workflow is now active, remove from localStorage and show dashboard
//               localStorage.removeItem("pendingWorkflow")
//               setActiveWorkflowExists(true)
//               setActiveWorkflowDetails(statusData)
//               setWorkflowCreationStatus("completed")
//               setStep("dashboard")
//             } else if (statusData.status === "PENDING_CREATION") {
//               // Still pending, show pending page
//               setPendingWorkflowData(pendingData)
//               setWorkflowCreationStatus("in-progress")
//               setStep("pending")
//             } else {
//               // Some other status, clean up localStorage
//               localStorage.removeItem("pendingWorkflow")
//             }
//           } else {
//             // Workflow not found, clean up localStorage
//             localStorage.removeItem("pendingWorkflow")
//           }
//         }

//         // Fetch active workflows and CRM integrations in parallel
//         const [workflowResponse, crmResponse] = await Promise.all([
//           fetch(`/api/workflow-config?businessId=${currentUserId}&status=ACTIVE`), // Assuming businessId maps to userId
//           fetch(`/api/crm/integrations?userId=${currentUserId}`),
//         ])

//         // Handle workflow response
//         if (workflowResponse.ok) {
//           const workflowData = await workflowResponse.json()
//           if (workflowData.workflowConfigs && workflowData.workflowConfigs.length > 0) {
//             const activeConfig = workflowData.workflowConfigs[0]
//             setActiveWorkflowExists(true)
//             setActiveWorkflowDetails(activeConfig)
//             setWorkflowCreationStatus("completed")

//             // Only set to dashboard if we're not already showing pending or progress
//             if (step !== "pending" && step !== "progress") {
//               setStep("dashboard")
//             }
//           } else {
//             setActiveWorkflowExists(false)
//             setActiveWorkflowDetails(null)
//           }
//         }

//         // Handle CRM response
//         if (crmResponse.ok) {
//           const crmData = await crmResponse.json()
//           setCrmIntegrations(crmData.integrations || [])

//           // Auto-activate default workflow if CRM is connected but no active workflow exists
//           const activeCRMIntegrations = (crmData.integrations || []).filter((crm: any) => crm.isActive)

//           if (
//             activeCRMIntegrations.length > 0 &&
//             !activeWorkflowExists &&
//             !storedPending &&
//             !hasPendingCustomWorkflow
//           ) {
//             Logger.info("🚀 Auto-activating default workflow - CRM connected but no active workflow")

//             try {
//               const autoActivateResponse = await fetch("/api/workflow-config", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                   workflowTemplateId: "default-crm-workflow",
//                   businessId: currentUserId, // Use currentUserId as businessId
//                   businessInfo: {
//                     businessName: "Auto-activated Business",
//                     businessType: "Service Business",
//                     description: "Auto-activated default workflow",
//                   },
//                   integrations: [], // Empty for default workflow
//                   status: "ACTIVE",
//                   isActive: true,
//                   submittedAt: new Date().toISOString(),
//                   estimatedCompletion: "immediate",
//                 }),
//               })

//               if (autoActivateResponse.ok) {
//                 const result = await autoActivateResponse.json()
//                 if (result.success) {
//                   setActiveWorkflowExists(true)
//                   setActiveWorkflowDetails(result.workflowConfig)
//                   setWorkflowCreationStatus("completed")
//                   setStep("dashboard")
//                   Logger.success("✅ Default workflow auto-activated successfully")
//                 }
//               }
//             } catch (error) {
//               Logger.error("Failed to auto-activate default workflow:", error)
//             }
//           }
//         } else {
//           console.error("Failed to fetch CRM integrations:", await crmResponse.text())
//         }
//       } catch (error) {
//         console.error("Error fetching workflow status:", error)
//       } finally {
//         setIsFetchingActiveWorkflow(false)
//         setIsFetchingCRM(false)
//       }
//     }

//     fetchWorkflowStatus()
//   }, [currentUserId, activeWorkflowExists, hasPendingCustomWorkflow, step]) // Added dependencies

//   // Periodic status checking when in pending state
//   useEffect(() => {
//     let interval: NodeJS.Timeout | null = null

//     if (step === "pending" && pendingWorkflowData) {
//       interval = setInterval(async () => {
//         try {
//           const response = await fetch(`/api/workflow-config/${pendingWorkflowData.id}`)
//           if (response.ok) {
//             const data = await response.json()
//             if (data.status === "ACTIVE") {
//               localStorage.removeItem("pendingWorkflow")
//               setActiveWorkflowExists(true)
//               setActiveWorkflowDetails(data)
//               setWorkflowCreationStatus("completed")
//               setStep("dashboard")
//               setPendingWorkflowData(null)
//             }
//           }
//         } catch (error) {
//           console.error("Error checking workflow status:", error)
//         }
//       }, 30000) // Check every 30 seconds
//     }

//     return () => {
//       if (interval) clearInterval(interval)
//     }
//   }, [step, pendingWorkflowData])

//   const handleDefaultWorkflowSelect = () => {
//     if (activeWorkflowExists) return
//     setIsDefaultWorkflow(true)
//     setIsCustomWorkflow(false)
//     setCustomRequest("")
//     setStep("configuration")
//   }

//   const handleCustomWorkflowSelect = () => {
//     if (activeWorkflowExists) return
//     if (subscription?.plan.toUpperCase() !== "ENTERPRISE") {
//       setShowPaymentPopup(true)
//       return
//     }
//     if (hasPendingCustomWorkflow) {
//       setStep("progress") // Redirect to progress if already has a pending custom workflow
//       return
//     }
//     setIsCustomWorkflow(true)
//     setIsDefaultWorkflow(false)
//     setCustomRequest("")
//     setStep("custom-builder")
//   }

//   const handleBusinessInfoSubmit = () => {
//     setStep("review")
//   }

//   const handleFinalSubmit = async () => {
//     const businessIdToUse = currentUserId // Use currentUserId as businessId

//     if (!businessIdToUse) {
//       alert("Error: Business ID is missing. Cannot deploy workflow.")
//       return
//     }

//     const workflowData = {
//       workflowTemplateId: isDefaultWorkflow ? "default-crm-workflow" : null,
//       businessId: businessIdToUse,
//       businessInfo,
//       integrations: [], // Empty for default workflow - CRM credentials are fetched automatically
//       customRequest: isCustomWorkflow ? customRequest : undefined,
//       status: isDefaultWorkflow ? "ACTIVE" : "PENDING_CREATION", // Default workflow is immediately active
//       isActive: isDefaultWorkflow, // Default workflow is immediately active
//       submittedAt: new Date().toISOString(),
//       estimatedCompletion: isDefaultWorkflow ? "immediate" : "3-5",
//     }

//     console.log("Submitting workflow configuration:", workflowData)

//     try {
//       const response = await fetch("/api/workflow-config", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(workflowData),
//       })
//       const result = await response.json()

//       if (result.success) {
//         if (isDefaultWorkflow) {
//           // Default workflow is immediately active
//           setActiveWorkflowExists(true)
//           setActiveWorkflowDetails(result.workflowConfig)
//           setWorkflowCreationStatus("completed")
//           setStep("dashboard")
//         } else {
//           // Custom workflow goes to pending
//           const pendingData: PendingWorkflowData = {
//             id: result.workflowConfig.id,
//             submittedAt: result.workflowConfig.createdAt, // Use createdAt from response
//             status: "UNDER_REVIEW",
//             workflowType: "Custom Workflow",
//             estimatedCompletion: "3-5",
//           }

//           localStorage.setItem("pendingWorkflow", JSON.stringify(pendingData))
//           setPendingWorkflowData(pendingData)
//           setWorkflowCreationStatus("submitted")
//           setHasPendingCustomWorkflow(true) // Mark as having a pending custom workflow
//           setStep("progress") // Redirect to progress page
//         }
//       } else {
//         alert(`Failed to submit workflow: ${result.error || "Unknown error"}`)
//       }
//     } catch (error) {
//       console.error("Error submitting workflow configuration:", error)
//       alert("An unexpected error occurred during submission.")
//     }
//   }

//   const handleDeactivateWorkflow = async () => {
//     if (!activeWorkflowDetails?.id) {
//       alert("No active workflow to deactivate.")
//       return
//     }
//     setShowDeactivateConfirm(true)
//   }

//   const confirmDeactivate = async () => {
//     setShowDeactivateConfirm(false)
//     setIsDeactivating(true)
//     try {
//       const response = await fetch("/api/workflow-config", {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           id: activeWorkflowDetails?.id,
//           isActive: false,
//           status: "INACTIVE",
//         }),
//       })

//       if (response.ok) {
//         alert("Workflow deactivated successfully!")
//         setActiveWorkflowExists(false)
//         setActiveWorkflowDetails(null)
//         setStep("selection")
//         setBusinessInfo({ businessName: "", businessType: "", description: "", website: "", phone: "", email: "" })
//         setCustomRequest("")
//         setIsCustomWorkflow(false)
//         setIsDefaultWorkflow(false)
//         setWorkflowCreationStatus("not-started")
//         setPendingWorkflowData(null)
//         // Also clear any pending custom workflow state if it was related to this deactivation
//         setHasPendingCustomWorkflow(false)
//         setUserWorkflowRequests([])
//       } else {
//         const errorData = await response.json()
//         alert(`Failed to deactivate workflow: ${errorData.error || "Unknown error"}`)
//       }
//     } catch (error) {
//       console.error("Error deactivating workflow:", error)
//       alert("An unexpected error occurred during deactivation.")
//     } finally {
//       setIsDeactivating(false)
//     }
//   }

//   const handlePaymentSuccess = () => {
//     // After successful payment, assume subscription context updates and re-evaluate
//     setShowPaymentPopup(false)
//     // Re-check subscription status and if enterprise, allow to proceed
//     if (subscription?.plan.toUpperCase() === "ENTERPRISE") {
//       handleCustomWorkflowSelect() // Try to proceed with custom workflow selection again
//     }
//   }

//   // --- CONDITIONAL RENDERING ---

//   if (isFetchingActiveWorkflow || isFetchingCRM) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <Loader2 className="h-10 w-10 animate-spin text-primary" />
//         <span className="ml-4 text-lg text-muted-foreground">Loading your workflows...</span>
//       </div>
//     )
//   }

//   // Render pending page (for template-based workflows)
//   if (step === "pending" && pendingWorkflowData) {
//     return (
//       <WorkflowPendingPage
//         pendingWorkflowData={pendingWorkflowData}
//         businessInfo={businessInfo}
//         onBackToSelection={() => {
//           if (confirm("Are you sure you want to go back? Your pending workflow will remain in queue.")) {
//             setStep("selection")
//           }
//         }}
//       />
//     )
//   }

//   // Render dashboard if active workflow exists
//   if (activeWorkflowExists && activeWorkflowDetails && step === "dashboard") {
//     return (
//       <>
//         <WorkflowDashboard
//           workflowDetails={activeWorkflowDetails}
//           onDeactivate={handleDeactivateWorkflow}
//           isDeactivating={isDeactivating}
//         />
//         <AlertDialog open={showDeactivateConfirm} onOpenChange={setShowDeactivateConfirm}>
//           <AlertDialogContent>
//             <AlertDialogHeader>
//               <AlertDialogTitle className="flex items-center gap-2 text-red-500">
//                 <AlertTriangle className="h-6 w-6" />
//                 Confirm Deactivation
//               </AlertDialogTitle>
//               <AlertDialogDescription>
//                 Are you sure you want to deactivate your current workflow? This will stop all automated responses and
//                 you will need to set up a new one to resume automation.
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogCancel>Cancel</AlertDialogCancel>
//               <AlertDialogAction onClick={confirmDeactivate} className="bg-red-600 hover:bg-red-700">
//                 Deactivate
//               </AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>
//       </>
//     )
//   }

//   // Render CustomWorkflowBuilder
//   if (step === "custom-builder") {
//     return (
//       <CustomWorkflowBuilder
//         businessInfo={businessInfo}
//         selectedWorkflowId={null}
//         setStep={(s: "selection" | "configuration" | "review" | "dashboard" | "pending" | "progress") => {
//           if (s === "selection" || s === "dashboard" || s === "progress") {
//             // Allow redirect to progress
//             setStep(s)
//           }
//         }}
//         setActiveWorkflowExists={setActiveWorkflowExists}
//         setActiveWorkflowDetails={setActiveWorkflowDetails}
//       />
//     )
//   }

//   // Render UserWorkflowProgress
//   if (step === "progress") {
//     return (
//       <UserWorkflowProgress
//         userId={currentUserId}
//         onRequestsUpdated={async () => {
//           // Re-fetch user requests to update state
//           const userRequestsResponse = await fetch(`/api/user/workflow-requests?userId=${currentUserId}`)
//           if (userRequestsResponse.ok) {
//             const userRequestsData = await userRequestsResponse.json()
//             setUserWorkflowRequests(userRequestsData.requests || [])
//             const pendingOrSubmitted = (userRequestsData.requests || []).some(
//               (req: CustomWorkflowRequest) =>
//                 req.status === "SUBMITTED" || req.status === "UNDER_REVIEW" || req.status === "IN_DEVELOPMENT",
//             )
//             setHasPendingCustomWorkflow(pendingOrSubmitted)
//           }
//         }}
//         onBackToSelection={() => setStep("selection")}
//       />
//     )
//   }

//   // Main selection page with only 2 cards
//   if (step === "selection") {
//     const activeCRMIntegrations = crmIntegrations.filter((crm) => crm.isActive)

//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radiale--gradient--automations">
//           <div className="max-w-7xl mx-auto p-6">
//             {/* Navigation Buttons */}
//             <div className="flex justify-end gap-4 mb-8">
//               {activeWorkflowExists && (
//                 <Button variant="outline" onClick={() => setStep("dashboard")}>
//                   <LayoutDashboard className="h-4 w-4 mr-2" />
//                   My Workflow Dashboard
//                 </Button>
//               )}
//               <Button variant="outline" onClick={() => setStep("progress")}>
//                 <ListChecks className="h-4 w-4 mr-2" />
//                 My Workflow Requests
//                 {hasPendingCustomWorkflow && <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
//               </Button>
//             </div>

//             <div className="text-center mb-12">
//               <div className="flex items-center justify-center gap-3 mb-6">
//                 <Sparkles className="h-8 w-8 text-primary" />
//                 <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Choose Your Business Workflow
//                 </h1>
//               </div>
//               <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
//                 Start with our default CRM workflow or request a custom solution tailored to your needs
//               </p>
//             </div>

//             <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
//               {/* Default CRM Workflow Card */}
//               <Card
//                 className={`cursor-pointer transition-all duration-300 border-2 glassEffect card-border-customer-support hover:scale-105 ${activeWorkflowExists ? "opacity-50 cursor-not-allowed" : ""}`}
//                 onClick={() => !activeWorkflowExists && handleDefaultWorkflowSelect()}
//               >
//                 <CardHeader className="pb-4">
//                   <div className="flex items-center gap-4 mb-4">
//                     <div className="p-3 rounded-xl bg-primary/10 template-icon-container">
//                       <Database className="h-6 w-6 text-chart-1" />
//                     </div>
//                     <div className="flex-1">
//                       <CardTitle className="text-xl mb-2">Default CRM Workflow</CardTitle>
//                       <Badge variant="outline" className="text-xs bg-chart-2/10 text-chart-2 border-chart-2/20">
//                         Recommended
//                       </Badge>
//                     </div>
//                   </div>
//                   <CardDescription className="text-sm leading-relaxed">
//                     Perfect for getting started quickly. Automatically qualifies leads through Instagram DMs and sends
//                     them directly to your connected CRM system.
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div>
//                     <h4 className="font-semibold text-sm mb-3 text-primary">Process Flow:</h4>
//                     <div className="space-y-2">
//                       {[
//                         "Receive Instagram DM",
//                         "AI lead qualification",
//                         "Collect contact information",
//                         "Send to your CRM",
//                         "Notify your team",
//                       ].map((operation, idx) => (
//                         <div key={idx} className="flex items-center gap-3">
//                           <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
//                             {idx + 1}
//                           </div>
//                           <span className="text-sm text-muted-foreground">{operation}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   <div>
//                     <h4 className="font-semibold text-sm mb-3 text-primary">Key Features:</h4>
//                     <ul className="space-y-2">
//                       {[
//                         "Instant lead qualification",
//                         "Automatic CRM integration",
//                         "Smart conversation handling",
//                         "Lead scoring & prioritization",
//                       ].map((feature, idx) => (
//                         <li key={idx} className="flex items-center gap-2 text-sm">
//                           <CheckCircle className="h-4 w-4 text-chart-2 flex-shrink-0" />
//                           <span className="text-muted-foreground">{feature}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>

//                   <div>
//                     <h4 className="font-semibold text-sm mb-3 text-primary">CRM Integration Status:</h4>
//                     {activeCRMIntegrations.length > 0 ? (
//                       <div className="space-y-2">
//                         {activeCRMIntegrations.map((crm) => (
//                           <div key={crm.id} className="flex items-center gap-2 text-sm bg-chart-2/10 p-2 rounded-lg">
//                             <CheckCircle className="h-4 w-4 text-chart-2" />
//                             <span className="text-foreground font-medium">{crm.provider}</span>
//                             <Badge variant="outline" className="ml-auto text-xs text-chart-2 border-chart-2/20">
//                               Auto-Active
//                             </Badge>
//                           </div>
//                         ))}
//                         <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
//                           <p className="text-xs text-blue-600 dark:text-blue-400">
//                             🎉 Your default workflow is automatically active and processing Instagram DMs!
//                           </p>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="bg-destructive/10 p-3 rounded-lg">
//                         <div className="flex items-center gap-2 text-sm text-destructive mb-2">
//                           <AlertTriangle className="h-4 w-4" />
//                           <span className="font-medium">No CRM Connected</span>
//                         </div>
//                         <p className="text-xs text-muted-foreground">
//                           Connect a CRM first to automatically activate the default workflow. Go to the Leads page to
//                           connect your CRM via OAuth.
//                         </p>
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex gap-2 mt-4">
//                     <Button
//                       onClick={() => handleDefaultWorkflowSelect()}
//                       className="flex-1"
//                       disabled={activeWorkflowExists || activeCRMIntegrations.length === 0}
//                     >
//                       {activeCRMIntegrations.length === 0 ? "Connect CRM First" : "Configure Default Workflow"}
//                     </Button>
//                   </div>

//                   {activeCRMIntegrations.length > 0 && (
//                     <div className="mt-3 p-2 bg-chart-2/10 rounded-lg">
//                       <p className="text-xs text-chart-2 font-medium">
//                         ✨ Default workflow activates automatically when you have a connected CRM
//                       </p>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>

//               {/* Custom Workflow Request Card */}
//               <Card
//                 className={`cursor-pointer transition-all duration-300 border-2 border-dashed border-border/50 glassEffect hover:border-primary/50 hover:shadow-lg flex flex-col ${activeWorkflowExists || hasPendingCustomWorkflow ? "opacity-50 cursor-not-allowed" : ""}`}
//                 onClick={() => !activeWorkflowExists && handleCustomWorkflowSelect()}
//               >
//                 <CardHeader className="pb-4">
//                   <div className="flex items-center gap-4 mb-4">
//                     <div className="p-3 rounded-xl bg-primary/10 template-icon-container">
//                       <Settings className="h-6 w-6 text-chart-4" />
//                     </div>
//                     <div className="flex-1">
//                       <CardTitle className="text-xl mb-2">Request Custom Workflow</CardTitle>
//                       <Badge variant="outline" className="text-xs bg-chart-4/10 text-chart-4 border-chart-4/20">
//                         Tailored Solution
//                       </Badge>
//                     </div>
//                   </div>
//                   <CardDescription className="text-sm leading-relaxed">
//                     Need something more specific? Describe your unique business requirements and we&apos;ll build a
//                     custom workflow just for you.
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6 flex-1">
//                   <div>
//                     <h4 className="font-semibold text-sm mb-3 text-primary">What You Get:</h4>
//                     <ul className="space-y-2">
//                       {[
//                         "Personalized workflow design",
//                         "Custom integrations",
//                         "Advanced automation logic",
//                         "Dedicated development support",
//                       ].map((feature, idx) => (
//                         <li key={idx} className="flex items-center gap-2 text-sm">
//                           <Sparkles className="h-4 w-4 text-chart-4 flex-shrink-0" />
//                           <span className="text-muted-foreground">{feature}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>

//                   <div>
//                     <h4 className="font-semibold text-sm mb-3 text-primary">Perfect For:</h4>
//                     <p className="text-xs text-muted-foreground leading-relaxed">
//                       Complex business processes, multiple integrations, unique industry requirements, or specialized
//                       automation needs that go beyond standard workflows.
//                     </p>
//                   </div>

//                   <div className="bg-chart-4/10 p-3 rounded-lg">
//                     <div className="flex items-center gap-2 text-sm text-chart-4 mb-1">
//                       <Clock className="h-4 w-4" />
//                       <span className="font-medium">Development Time: 3-5 business days</span>
//                     </div>
//                     <p className="text-xs text-muted-foreground">
//                       Our team will review your requirements and build your custom solution.
//                     </p>
//                   </div>

//                   <div className="flex gap-2 mt-auto">
//                     <Button
//                       onClick={() => handleCustomWorkflowSelect()}
//                       variant="outline"
//                       className="flex-1 bg-transparent hover:bg-accent"
//                       disabled={activeWorkflowExists || hasPendingCustomWorkflow}
//                     >
//                       {hasPendingCustomWorkflow ? "Custom Workflow Pending" : "Request Custom Workflow"}
//                     </Button>
//                   </div>
//                   {hasPendingCustomWorkflow && (
//                     <p className="text-xs text-muted-foreground mt-2">
//                       You have a pending custom workflow. Please check &ldquo;My Workflow Requests&rdquo;.
//                     </p>
//                   )}
//                 </CardContent>
//               </Card>
//             </div>

//             {/* CRM Connection Notice */}
//             {activeCRMIntegrations.length === 0 && (
//               <div className="max-w-4xl mx-auto mt-8">
//                 <Card className="border-2 border-destructive/20 bg-destructive/5">
//                   <CardContent className="p-6">
//                     <div className="flex items-start gap-4">
//                       <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-1" />
//                       <div>
//                         <h3 className="font-semibold text-destructive mb-2">CRM Integration Required</h3>
//                         <p className="text-sm text-muted-foreground mb-4">
//                           To use the default workflow, you need to connect a CRM system first. This allows us to
//                           automatically send qualified leads to your CRM.
//                         </p>
//                         <Button
//                           variant="outline"
//                           className="text-destructive border-destructive/20 hover:bg-destructive/10 bg-transparent"
//                         >
//                           Go to Leads Page to Connect CRM
//                         </Button>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             )}
//           </div>
//         </div>
//         <PaymentPopup
//           isOpen={showPaymentPopup}
//           onClose={() => setShowPaymentPopup(false)}
//           onSuccess={handlePaymentSuccess}
//         />
//       </div>
//     )
//   }

//   // Configuration step for default workflow
//   if (step === "configuration") {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radiale--gradient--automations">
//           <div className="max-w-4xl mx-auto p-6">
//             <div className="mb-8">
//               <Button variant="ghost" onClick={() => setStep("selection")} className="mb-6 hover:bg-accent">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Selection
//               </Button>
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Configure Your {isDefaultWorkflow ? "Default CRM" : "Custom"} Workflow
//                 </h1>
//                 <p className="text-muted-foreground text-lg">
//                   Provide your business information to personalize the workflow
//                 </p>
//               </div>
//             </div>

//             <div className="grid gap-8 lg:grid-cols-2">
//               <Card className="glassEffect border-2 border-border/50">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Users className="h-5 w-5 text-primary" />
//                     Business Information
//                   </CardTitle>
//                   <CardDescription>
//                     This information will be used to personalize your automated responses
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div className="space-y-2">
//                     <Label htmlFor="businessName" className="text-sm font-medium">
//                       Business Name *
//                     </Label>
//                     <Input
//                       id="businessName"
//                       value={businessInfo.businessName}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, businessName: e.target.value }))}
//                       placeholder="Your Business Name"
//                       className="bg-background/50 border-border/50 focus:border-primary"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="businessType" className="text-sm font-medium">
//                       Business Type *
//                     </Label>
//                     <Input
//                       id="businessType"
//                       value={businessInfo.businessType}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, businessType: e.target.value }))}
//                       placeholder="e.g., Hair Salon, Photography Studio"
//                       className="bg-background/50 border-border/50 focus:border-primary"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="description" className="text-sm font-medium">
//                       Business Description
//                     </Label>
//                     <Textarea
//                       id="description"
//                       value={businessInfo.description}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, description: e.target.value }))}
//                       placeholder="Brief description of your services..."
//                       rows={3}
//                       className="bg-background/50 border-border/50 focus:border-primary resize-none"
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="website" className="text-sm font-medium">
//                         Website
//                       </Label>
//                       <Input
//                         id="website"
//                         value={businessInfo.website}
//                         onChange={(e) => setBusinessInfo((prev) => ({ ...prev, website: e.target.value }))}
//                         placeholder="https://yourwebsite.com"
//                         className="bg-background/50 border-border/50 focus:border-primary"
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="phone" className="text-sm font-medium">
//                         Phone Number
//                       </Label>
//                       <Input
//                         id="phone"
//                         value={businessInfo.phone}
//                         onChange={(e) => setBusinessInfo((prev) => ({ ...prev, phone: e.target.value }))}
//                         placeholder="+1 (555) 123-4567"
//                         className="bg-background/50 border-border/50 focus:border-primary"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="email" className="text-sm font-medium">
//                       Email
//                     </Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       value={businessInfo.email}
//                       onChange={(e) => setBusinessInfo((prev) => ({ ...prev, email: e.target.value }))}
//                       placeholder="contact@yourbusiness.com"
//                       className="bg-background/50 border-border/50 focus:border-primary"
//                     />
//                   </div>
//                 </CardContent>
//               </Card>

//               <div className="space-y-8">
//                 <Card className="glassEffect border-2 card-border-customer-support">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Database className="h-5 w-5 text-chart-1" />
//                       Default CRM Workflow Overview
//                     </CardTitle>
//                     <CardDescription>Here&apos;s what your default workflow will include</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-6">
//                       <div>
//                         <h4 className="font-semibold mb-4 text-primary flex items-center gap-2">
//                           <Sparkles className="h-4 w-4" />
//                           Process Flow:
//                         </h4>
//                         <div className="space-y-3">
//                           {[
//                             "Receive Instagram DM",
//                             "AI lead qualification",
//                             "Collect contact information",
//                             "Send to your CRM",
//                             "Notify your team",
//                           ].map((operation, idx) => (
//                             <div key={idx} className="flex items-center gap-4">
//                               <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-semibold">
//                                 {idx + 1}
//                               </div>
//                               <span className="text-sm font-medium">{operation}</span>
//                             </div>
//                           ))}
//                         </div>
//                       </div>

//                       <div>
//                         <h4 className="font-semibold mb-4 text-primary">Key Features:</h4>
//                         <ul className="space-y-3">
//                           {[
//                             "Instant lead qualification",
//                             "Automatic CRM integration",
//                             "Smart conversation handling",
//                             "Lead scoring & prioritization",
//                             "Human handoff when needed",
//                             "Real-time notifications",
//                           ].map((feature, idx) => (
//                             <li key={idx} className="flex items-center gap-3 text-sm">
//                               <CheckCircle className="h-4 w-4 text-chart-2 flex-shrink-0" />
//                               <span>{feature}</span>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>

//                       <div>
//                         <h4 className="font-semibold mb-4 text-primary">Connected CRM:</h4>
//                         <div className="space-y-2">
//                           {crmIntegrations
//                             .filter((crm) => crm.isActive)
//                             .map((crm) => (
//                               <div key={crm.id} className="flex items-center gap-3 p-3 bg-chart-2/10 rounded-lg">
//                                 <CheckCircle className="h-4 w-4 text-chart-2" />
//                                 <span className="text-sm font-medium">{crm.provider}</span>
//                                 <Badge variant="outline" className="ml-auto text-xs text-chart-2 border-chart-2/20">
//                                   Active
//                                 </Badge>
//                               </div>
//                             ))}
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>

//             <div className="mt-10 flex justify-end">
//               <Button
//                 onClick={handleBusinessInfoSubmit}
//                 disabled={!businessInfo.businessName || !businessInfo.businessType}
//                 size="lg"
//                 className="px-8 py-3 text-base font-semibold"
//               >
//                 Continue to Review
//                 <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // Review step
//   if (step === "review") {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="radiale--gradient--automations">
//           <div className="max-w-5xl mx-auto p-6">
//             <div className="mb-8">
//               <Button variant="ghost" onClick={() => setStep("configuration")} className="mb-6 hover:bg-accent">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Configuration
//               </Button>
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                   Review &amp; Deploy
//                 </h1>
//                 <p className="text-muted-foreground text-lg">
//                   Review your configuration before deploying your workflow
//                 </p>
//               </div>
//             </div>

//             <div className="grid gap-8 lg:grid-cols-2 mb-10">
//               <Card className="glassEffect border-2 border-border/50">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <CheckCircle className="h-5 w-5 text-green-500" />
//                     Workflow Summary
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Workflow Type:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg">
//                       {isDefaultWorkflow ? "Default CRM Workflow" : "Custom Workflow Request"}
//                     </p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Business Name:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg">{businessInfo.businessName}</p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Business Type:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg">{businessInfo.businessType}</p>
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold text-primary">Setup Time:</Label>
//                     <p className="text-sm bg-accent/50 p-3 rounded-lg flex items-center gap-2">
//                       <Clock className="h-4 w-4" />
//                       {isDefaultWorkflow ? "Immediate activation" : "3-5 business days"}
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="glassEffect border-2 border-border/50">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Database className="h-5 w-5 text-primary" />
//                     CRM Integration
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-3">
//                     {crmIntegrations
//                       .filter((crm) => crm.isActive)
//                       .map((crm) => (
//                         <div key={crm.id} className="flex items-center gap-3 p-3 bg-chart-2/10 rounded-lg">
//                           <CheckCircle className="h-4 w-4 text-chart-2" />
//                           <div className="flex-1">
//                             <span className="text-sm font-medium">{crm.provider}</span>
//                             <p className="text-xs text-muted-foreground">
//                               Connected on {new Date(crm.createdAt).toLocaleDateString()}
//                             </p>
//                           </div>
//                           <Badge variant="outline" className="text-xs text-chart-2 border-chart-2/20">
//                             Active
//                           </Badge>
//                         </div>
//                       ))}
//                   </div>
//                   <div className="mt-4 text-sm text-muted-foreground">
//                     {isDefaultWorkflow
//                       ? "Your CRM credentials will be automatically used by the workflow to send qualified leads."
//                       : "CRM integration will be configured as part of your custom workflow development."}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             <Card className="glassEffect border-2 border-primary/30 mb-10">
//               <CardContent className="p-6">
//                 <h3 className="font-semibold mb-4 flex items-center gap-2 text-primary">
//                   <Sparkles className="h-5 w-5" />
//                   What happens next?
//                 </h3>
//                 <ul className="space-y-3 text-sm text-muted-foreground">
//                   {isDefaultWorkflow ? (
//                     <>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Your default workflow will be activated immediately upon submission.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Instagram DMs will start being processed automatically using your CRM credentials.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Qualified leads will be sent directly to your connected{" "}
//                         {crmIntegrations.find((crm) => crm.isActive)?.provider || "CRM"}.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         You can monitor performance and leads from your dashboard.
//                       </li>
//                     </>
//                   ) : (
//                     <>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Your custom workflow request will be sent to our development team.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         We will email you at <strong>{businessInfo.email}</strong> when development begins.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         You can return to this page anytime to check the status of your workflow.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Once complete, your custom automation will be available in your dashboard.
//                       </li>
//                     </>
//                   )}
//                 </ul>
//               </CardContent>
//             </Card>

//             <div className="flex justify-between">
//               <Button variant="outline" onClick={() => setStep("configuration")} size="lg">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back
//               </Button>
//               <Button
//                 onClick={handleFinalSubmit}
//                 size="lg"
//                 className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8 py-3 text-base font-semibold glow"
//               >
//                 <Sparkles className="h-4 w-4 mr-2" />
//                 {isDefaultWorkflow ? "Activate Workflow 🚀" : "Submit for Development 🚀"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return null
// }



"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Clock,
  Users,
  CheckCircle,
  ArrowLeft,
  Sparkles,
  Loader2,
  AlertTriangle,
  Database,
  SettingsIcon,
  LayoutDashboard,
  ListChecks,
  XCircle,
  Plus,
  Zap,
  Globe,
  Lock,
} from "lucide-react"
import WorkflowDashboard from "./workflow-dashboard"
import CustomWorkflowBuilder from "./custom-workflow-builder"
import WorkflowPendingPage from "./workflow-pending-page"
import UserWorkflowProgress from "./user-workflow-progress" // Import the user workflow progress component
import PaymentPopup from "@/components/global/stripe/payment-popup" // Import the PaymentPopup
import { useSubscription } from "@/contexts/subscription-context" // Assuming you have a subscription context
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type {
  BusinessWorkflowConfig,
  PendingWorkflowData,
  CRMIntegration,
  CustomWorkflowRequest,
  WorkflowTemplate,
} from "@/types/workflow" // Add this import
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"

const Logger = {
  info: (message: string, ...args: any[]) => {
    console.log(`%cINFO: ${message}`, "color: blue;", ...args)
  },
  success: (message: string, ...args: any[]) => {
    console.log(`%cSUCCESS: ${message}`, "color: green;", ...args)
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`%cWARN: ${message}`, "color: orange;", ...args)
  },
  error: (message: string, ...args: any[]) => {
    console.error(`%cERROR: ${message}`, "color: red;", ...args)
  },
}

interface WorkflowSelectorProps {
  businessId: string
  onWorkflowSelected: (workflowConfig: BusinessWorkflowConfig) => void
}

export default function WorkflowSelector({ businessId, onWorkflowSelected }: WorkflowSelectorProps) {
  const [step, setStep] = useState<
    "selection" | "configuration" | "review" | "dashboard" | "custom-builder" | "pending" | "progress"
  >("selection")
  const [businessInfo, setBusinessInfo] = useState({
    businessName: "",
    businessType: "",
    description: "",
    website: "",
    phone: "",
    email: "",
  })
  const [customRequest, setCustomRequest] = useState("")
  const [isCustomWorkflow, setIsCustomWorkflow] = useState(false)
  const [isDefaultWorkflow, setIsDefaultWorkflow] = useState(false)

  // WORKFLOW STATE MANAGEMENT
  const [activeWorkflowExists, setActiveWorkflowExists] = useState(false)
  const [activeWorkflowDetails, setActiveWorkflowDetails] = useState<BusinessWorkflowConfig | null>(null)
  const [isFetchingActiveWorkflow, setIsFetchingActiveWorkflow] = useState(true)
  const [isDeactivating, setIsDeactivating] = useState(false)
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false)

  // CRM Integration state
  const [crmIntegrations, setCrmIntegrations] = useState<CRMIntegration[]>([])
  const [isFetchingCRM, setIsFetchingCRM] = useState(true)

  // Pending workflow states
  const [pendingWorkflowData, setPendingWorkflowData] = useState<PendingWorkflowData | null>(null)
  const [workflowCreationStatus, setWorkflowCreationStatus] = useState<
    "not-started" | "submitted" | "in-progress" | "completed"
  >("not-started")

  // Custom workflow request state for enterprise plan and pending checks
  const [userWorkflowRequests, setUserWorkflowRequests] = useState<CustomWorkflowRequest[]>([])
  const [hasPendingCustomWorkflow, setHasPendingCustomWorkflow] = useState(false)
  const [showPaymentPopup, setShowPaymentPopup] = useState(false)

  const { subscription } = useSubscription()
  const currentUserId = "user_clerk_id_placeholder" // Replace with actual user ID from Clerk

  const [workflowConfigs, setWorkflowConfigs] = useState<BusinessWorkflowConfig[]>([])
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [isConfiguring, setIsConfiguring] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null)
  const [isCredentialDialogOpen, setIsCredentialDialogOpen] = useState(false)
  const [credentials, setCredentials] = useState<Record<string, string>>({})
  const [submittingCredentials, setSubmittingCredentials] = useState(false)

  // Fetch active workflow and CRM integrations
  useEffect(() => {
    const fetchWorkflowStatus = async () => {
      setIsFetchingActiveWorkflow(true)
      setIsFetchingCRM(true)

      try {
        if (!currentUserId) {
          // Use currentUserId for fetching user-specific data
          console.warn("No user ID available to fetch workflow status.")
          setIsFetchingActiveWorkflow(false)
          setIsFetchingCRM(false)
          return
        }

        // Fetch user's custom workflow requests
        const userRequestsResponse = await fetch(`/api/user/workflow-requests?userId=${currentUserId}`)
        if (userRequestsResponse.ok) {
          const userRequestsData = await userRequestsResponse.json()
          setUserWorkflowRequests(userRequestsData.requests || [])
          const pendingOrSubmitted = (userRequestsData.requests || []).some(
            (req: CustomWorkflowRequest) =>
              req.status === "SUBMITTED" || req.status === "UNDER_REVIEW" || req.status === "IN_DEVELOPMENT",
          )
          setHasPendingCustomWorkflow(pendingOrSubmitted)
          if (pendingOrSubmitted) {
            // If there's a pending custom workflow, redirect to progress page
            setStep("progress")
          }
        } else {
          console.error("Failed to fetch user workflow requests:", await userRequestsResponse.text())
        }

        // Check for pending workflow in localStorage first (for template-based workflows)
        const storedPending = localStorage.getItem("pendingWorkflow")
        if (storedPending) {
          const pendingData: PendingWorkflowData = JSON.parse(storedPending)

          // Verify the status with backend
          const statusResponse = await fetch(`/api/workflow-config/${pendingData.id}`)
          if (statusResponse.ok) {
            const statusData = await statusResponse.json()

            if (statusData.status === "ACTIVE") {
              // Workflow is now active, remove from localStorage and show dashboard
              localStorage.removeItem("pendingWorkflow")
              setActiveWorkflowExists(true)
              setActiveWorkflowDetails(statusData)
              setWorkflowCreationStatus("completed")
              setStep("dashboard")
            } else if (statusData.status === "PENDING_CREATION") {
              // Still pending, show pending page
              setPendingWorkflowData(pendingData)
              setWorkflowCreationStatus("in-progress")
              setStep("pending")
            } else {
              // Some other status, clean up localStorage
              localStorage.removeItem("pendingWorkflow")
            }
          } else {
            // Workflow not found, clean up localStorage
            localStorage.removeItem("pendingWorkflow")
          }
        }

        // Fetch active workflows and CRM integrations in parallel
        const [workflowResponse, crmResponse] = await Promise.all([
          fetch(`/api/workflow-config?businessId=${currentUserId}&status=ACTIVE`), // Assuming businessId maps to userId
          fetch(`/api/crm/integrations?userId=${currentUserId}`),
        ])

        // Handle workflow response
        if (workflowResponse.ok) {
          const workflowData = await workflowResponse.json()
          if (workflowData.workflowConfigs && workflowData.workflowConfigs.length > 0) {
            const activeConfig = workflowData.workflowConfigs[0]
            setActiveWorkflowExists(true)
            setActiveWorkflowDetails(activeConfig)
            setWorkflowCreationStatus("completed")

            // Only set to dashboard if we're not already showing pending or progress
            if (step !== "pending" && step !== "progress") {
              setStep("dashboard")
            }
          } else {
            setActiveWorkflowExists(false)
            setActiveWorkflowDetails(null)
          }
        }

        // Handle CRM response
        if (crmResponse.ok) {
          const crmData = await crmResponse.json()
          setCrmIntegrations(crmData.integrations || [])

          // Auto-activate default workflow if CRM is connected but no active workflow exists
          const activeCRMIntegrations = (crmData.integrations || []).filter((crm: any) => crm.isActive)

          if (
            activeCRMIntegrations.length > 0 &&
            !activeWorkflowExists &&
            !storedPending &&
            !hasPendingCustomWorkflow
          ) {
            Logger.info("🚀 Auto-activating default workflow - CRM connected but no active workflow")

            try {
              const autoActivateResponse = await fetch("/api/workflow-config", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  workflowTemplateId: "default-crm-workflow",
                  businessId: currentUserId, // Use currentUserId as businessId
                  businessInfo: {
                    businessName: "Auto-activated Business",
                    businessType: "Service Business",
                    description: "Auto-activated default workflow",
                  },
                  integrations: [], // Empty for default workflow
                  status: "ACTIVE",
                  isActive: true,
                  submittedAt: new Date().toISOString(),
                  estimatedCompletion: "immediate",
                }),
              })

              if (autoActivateResponse.ok) {
                const result = await autoActivateResponse.json()
                if (result.success) {
                  setActiveWorkflowExists(true)
                  setActiveWorkflowDetails(result.workflowConfig)
                  setWorkflowCreationStatus("completed")
                  setStep("dashboard")
                  Logger.success("✅ Default workflow auto-activated successfully")
                }
              }
            } catch (error) {
              Logger.error("Failed to auto-activate default workflow:", error)
            }
          }
        } else {
          console.error("Failed to fetch CRM integrations:", await crmResponse.text())
        }
      } catch (error) {
        console.error("Error fetching workflow status:", error)
      } finally {
        setIsFetchingActiveWorkflow(false)
        setIsFetchingCRM(false)
      }
    }

    fetchWorkflowStatus()
  }, [currentUserId, activeWorkflowExists, hasPendingCustomWorkflow, step]) // Added dependencies

  useEffect(() => {
    fetchWorkflows()
    fetchTemplates()
  }, [businessId])

  const fetchWorkflows = async () => {
    try {
      const response = await fetch(`/api/workflow-configs?businessId=${businessId}`)
      const data = await response.json()
      setWorkflowConfigs(data.workflowConfigs || [])
    } catch (error) {
      console.error("Error fetching workflow configurations:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/workflow-templates")
      const data = await response.json()
      // Filter for public and active templates
      setTemplates(data.templates?.filter((t: WorkflowTemplate) => t.isPublic && t.isActive) || [])
    } catch (error) {
      console.error("Error fetching templates:", error)
    }
  }

  const handleSelectTemplate = (template: WorkflowTemplate) => {
    setSelectedTemplate(template)
    // Check if the template requires credentials
    // For now, assume all templates might require credentials for integrations
    setIsCredentialDialogOpen(true)
    setCredentials({}) // Reset credentials form
  }

  const handleCreateWorkflowConfig = async () => {
    if (!selectedTemplate) return

    setSubmittingCredentials(true)
    try {
      // First, create the workflow config
      const configResponse = await fetch("/api/workflow-configs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId,
          workflowTemplateId: selectedTemplate.id,
          // Potentially pass initial custom request details if applicable
        }),
      })

      if (!configResponse.ok) {
        const errorData = await configResponse.json()
        throw new Error(errorData.message || "Failed to create workflow configuration.")
      }

      const newWorkflowConfig = await configResponse.json()
      const workflowConfigId = newWorkflowConfig.workflowConfig.id

      // Then, submit credentials for this new config
      const credentialResponse = await fetch(`/api/workflow-configs/${workflowConfigId}/credentials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credentials }),
      })

      if (!credentialResponse.ok) {
        const errorData = await credentialResponse.json()
        throw new Error(errorData.message || "Failed to save credentials.")
      }

      toast({
        title: "Workflow Activated!",
        description: `${selectedTemplate.name} is now active with your credentials.`,
        variant: "default",
      })
      setIsCredentialDialogOpen(false)
      setIsConfiguring(false)
      fetchWorkflows() // Refresh the list of active workflows
      onWorkflowSelected(newWorkflowConfig.workflowConfig) // Pass the newly created config
    } catch (error: any) {
      console.error("Error creating workflow config or saving credentials:", error)
      toast({
        title: "Activation Failed",
        description: error.message || "An error occurred during workflow activation.",
        variant: "destructive",
      })
    } finally {
      setSubmittingCredentials(false)
    }
  }

  const handleCredentialChange = (key: string, value: string) => {
    setCredentials((prev) => ({ ...prev, [key]: value }))
  }

  // Periodic status checking when in pending state
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (step === "pending" && pendingWorkflowData) {
      interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/workflow-config/${pendingWorkflowData.id}`)
          if (response.ok) {
            const data = await response.json()
            if (data.status === "ACTIVE") {
              localStorage.removeItem("pendingWorkflow")
              setActiveWorkflowExists(true)
              setActiveWorkflowDetails(data)
              setWorkflowCreationStatus("completed")
              setStep("dashboard")
              setPendingWorkflowData(null)
            }
          }
        } catch (error) {
          console.error("Error checking workflow status:", error)
        }
      }, 30000) // Check every 30 seconds
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [step, pendingWorkflowData])

  const handleDefaultWorkflowSelect = () => {
    if (activeWorkflowExists) return
    setIsDefaultWorkflow(true)
    setIsCustomWorkflow(false)
    setCustomRequest("")
    setStep("configuration")
  }

  const handleCustomWorkflowSelect = () => {
    if (activeWorkflowExists) return
    if (subscription?.plan.toUpperCase() !== "ENTERPRISE") {
      setShowPaymentPopup(true)
      return
    }
    if (hasPendingCustomWorkflow) {
      setStep("progress") // Redirect to progress if already has a pending custom workflow
      return
    }
    setIsCustomWorkflow(true)
    setIsDefaultWorkflow(false)
    setCustomRequest("")
    setStep("custom-builder")
  }

  const handleBusinessInfoSubmit = () => {
    setStep("review")
  }

  const handleFinalSubmit = async () => {
    const businessIdToUse = currentUserId // Use currentUserId as businessId

    if (!businessIdToUse) {
      alert("Error: Business ID is missing. Cannot deploy workflow.")
      return
    }

    const workflowData = {
      workflowTemplateId: isDefaultWorkflow ? "default-crm-workflow" : null,
      businessId: businessIdToUse,
      businessInfo,
      integrations: [], // Empty for default workflow - CRM credentials are fetched automatically
      customRequest: isCustomWorkflow ? customRequest : undefined,
      status: isDefaultWorkflow ? "ACTIVE" : "PENDING_CREATION", // Default workflow is immediately active
      isActive: isDefaultWorkflow, // Default workflow is immediately active
      submittedAt: new Date().toISOString(),
      estimatedCompletion: isDefaultWorkflow ? "immediate" : "3-5",
    }

    console.log("Submitting workflow configuration:", workflowData)

    try {
      const response = await fetch("/api/workflow-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workflowData),
      })
      const result = await response.json()

      if (result.success) {
        if (isDefaultWorkflow) {
          // Default workflow is immediately active
          setActiveWorkflowExists(true)
          setActiveWorkflowDetails(result.workflowConfig)
          setWorkflowCreationStatus("completed")
          setStep("dashboard")
        } else {
          // Custom workflow goes to pending
          const pendingData: PendingWorkflowData = {
            id: result.workflowConfig.id,
            submittedAt: result.workflowConfig.createdAt, // Use createdAt from response
            status: "UNDER_REVIEW",
            workflowType: "Custom Workflow",
            estimatedCompletion: "3-5",
          }

          localStorage.setItem("pendingWorkflow", JSON.stringify(pendingData))
          setPendingWorkflowData(pendingData)
          setWorkflowCreationStatus("submitted")
          setHasPendingCustomWorkflow(true) // Mark as having a pending custom workflow
          setStep("progress") // Redirect to progress page
        }
      } else {
        alert(`Failed to submit workflow: ${result.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error submitting workflow configuration:", error)
      alert("An unexpected error occurred during submission.")
    }
  }

  const handleDeactivateWorkflow = async () => {
    if (!activeWorkflowDetails?.id) {
      alert("No active workflow to deactivate.")
      return
    }
    setShowDeactivateConfirm(true)
  }

  const confirmDeactivate = async () => {
    setShowDeactivateConfirm(false)
    setIsDeactivating(true)
    try {
      const response = await fetch("/api/workflow-config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: activeWorkflowDetails?.id,
          isActive: false,
          status: "INACTIVE",
        }),
      })

      if (response.ok) {
        alert("Workflow deactivated successfully!")
        setActiveWorkflowExists(false)
        setActiveWorkflowDetails(null)
        setStep("selection")
        setBusinessInfo({ businessName: "", businessType: "", description: "", website: "", phone: "", email: "" })
        setCustomRequest("")
        setIsCustomWorkflow(false)
        setIsDefaultWorkflow(false)
        setWorkflowCreationStatus("not-started")
        setPendingWorkflowData(null)
        // Also clear any pending custom workflow state if it was related to this deactivation
        setHasPendingCustomWorkflow(false)
        setUserWorkflowRequests([])
      } else {
        const errorData = await response.json()
        alert(`Failed to deactivate workflow: ${errorData.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error deactivating workflow:", error)
      alert("An unexpected error occurred during deactivation.")
    } finally {
      setIsDeactivating(false)
    }
  }

  const handlePaymentSuccess = () => {
    // After successful payment, assume subscription context updates and re-evaluate
    setShowPaymentPopup(false)
    // Re-check subscription status and if enterprise, allow to proceed
    if (subscription?.plan.toUpperCase() === "ENTERPRISE") {
      handleCustomWorkflowSelect() // Try to proceed with custom workflow selection again
    }
  }

  // --- CONDITIONAL RENDERING ---

  if (isFetchingActiveWorkflow || isFetchingCRM || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <span className="ml-4 text-lg text-muted-foreground">Loading your workflows...</span>
      </div>
    )
  }

  // Render pending page (for template-based workflows)
  if (step === "pending" && pendingWorkflowData) {
    return (
      <WorkflowPendingPage
        pendingWorkflowData={pendingWorkflowData}
        businessInfo={businessInfo}
        onBackToSelection={() => {
          if (confirm("Are you sure you want to go back? Your pending workflow will remain in queue.")) {
            setStep("selection")
          }
        }}
      />
    )
  }

  // Render dashboard if active workflow exists
  if (activeWorkflowExists && activeWorkflowDetails && step === "dashboard") {
    return (
      <>
        <WorkflowDashboard
          workflowDetails={activeWorkflowDetails}
          onDeactivate={handleDeactivateWorkflow}
          isDeactivating={isDeactivating}
        />
        <AlertDialog open={showDeactivateConfirm} onOpenChange={setShowDeactivateConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-red-500">
                <AlertTriangle className="h-6 w-6" />
                Confirm Deactivation
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to deactivate your current workflow? This will stop all automated responses and
                you will need to set up a new one to resume automation.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeactivate} className="bg-red-600 hover:bg-red-700">
                Deactivate
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }

  // Render CustomWorkflowBuilder
  if (step === "custom-builder") {
    return (
      <CustomWorkflowBuilder
        businessInfo={businessInfo}
        selectedWorkflowId={null}
        setStep={(s: "selection" | "configuration" | "review" | "dashboard" | "pending" | "progress") => {
          if (s === "selection" || s === "dashboard" || s === "progress") {
            // Allow redirect to progress
            setStep(s)
          }
        }}
        setActiveWorkflowExists={setActiveWorkflowExists}
        setActiveWorkflowDetails={setActiveWorkflowDetails}
      />
    )
  }

  // Render UserWorkflowProgress
  if (step === "progress") {
    return (
      <UserWorkflowProgress
        userId={currentUserId}
        onRequestsUpdated={async () => {
          // Re-fetch user requests to update state
          const userRequestsResponse = await fetch(`/api/user/workflow-requests?userId=${currentUserId}`)
          if (userRequestsResponse.ok) {
            const userRequestsData = await userRequestsResponse.json()
            setUserWorkflowRequests(userRequestsData.requests || [])
            const pendingOrSubmitted = (userRequestsData.requests || []).some(
              (req: CustomWorkflowRequest) =>
                req.status === "SUBMITTED" || req.status === "UNDER_REVIEW" || req.status === "IN_DEVELOPMENT",
            )
            setHasPendingCustomWorkflow(pendingOrSubmitted)
          }
        }}
        onBackToSelection={() => setStep("selection")}
      />
    )
  }

  // Main selection page with only 2 cards
  if (step === "selection") {
    const activeCRMIntegrations = crmIntegrations.filter((crm) => crm.isActive)

    return (
      <div className="min-h-screen bg-background">
        <div className="radiale--gradient--automations">
          <div className="max-w-7xl mx-auto p-6">
            {/* Navigation Buttons */}
            <div className="flex justify-end gap-4 mb-8">
              {activeWorkflowExists && (
                <Button variant="outline" onClick={() => setStep("dashboard")}>
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  My Workflow Dashboard
                </Button>
              )}
              <Button variant="outline" onClick={() => setStep("progress")}>
                <ListChecks className="h-4 w-4 mr-2" />
                My Workflow Requests
                {hasPendingCustomWorkflow && <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
              </Button>
            </div>

            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Sparkles className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Choose Your Business Workflow
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Start with our default CRM workflow or request a custom solution tailored to your needs
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
              {/* Default CRM Workflow Card */}
              <Card
                className={`cursor-pointer transition-all duration-300 border-2 glassEffect card-border-customer-support hover:scale-105 ${activeWorkflowExists ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => !activeWorkflowExists && handleDefaultWorkflowSelect()}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-primary/10 template-icon-container">
                      <Database className="h-6 w-6 text-chart-1" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">Default CRM Workflow</CardTitle>
                      <Badge variant="outline" className="text-xs bg-chart-2/10 text-chart-2 border-chart-2/20">
                        Recommended
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">
                    Perfect for getting started quickly. Automatically qualifies leads through Instagram DMs and sends
                    them directly to your connected CRM system.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-sm mb-3 text-primary">Process Flow:</h4>
                    <div className="space-y-2">
                      {[
                        "Receive Instagram DM",
                        "AI lead qualification",
                        "Collect contact information",
                        "Send to your CRM",
                        "Notify your team",
                      ].map((operation, idx) => (
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
                      {[
                        "Instant lead qualification",
                        "Automatic CRM integration",
                        "Smart conversation handling",
                        "Lead scoring & prioritization",
                      ].map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-chart-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-3 text-primary">CRM Integration Status:</h4>
                    {activeCRMIntegrations.length > 0 ? (
                      <div className="space-y-2">
                        {activeCRMIntegrations.map((crm) => (
                          <div key={crm.id} className="flex items-center gap-2 text-sm bg-chart-2/10 p-2 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-chart-2" />
                            <span className="text-foreground font-medium">{crm.provider}</span>
                            <Badge variant="outline" className="ml-auto text-xs text-chart-2 border-chart-2/20">
                              Auto-Active
                            </Badge>
                          </div>
                        ))}
                        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                          <p className="text-xs text-blue-600 dark:text-blue-400">
                            🎉 Your default workflow is automatically active and processing Instagram DMs!
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-destructive/10 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-destructive mb-2">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="font-medium">No CRM Connected</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Connect a CRM first to automatically activate the default workflow. Go to the Leads page to
                          connect your CRM via OAuth.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => handleDefaultWorkflowSelect()}
                      className="flex-1"
                      disabled={activeWorkflowExists || activeCRMIntegrations.length === 0}
                    >
                      {activeCRMIntegrations.length === 0 ? "Connect CRM First" : "Configure Default Workflow"}
                    </Button>
                  </div>

                  {activeCRMIntegrations.length > 0 && (
                    <div className="mt-3 p-2 bg-chart-2/10 rounded-lg">
                      <p className="text-xs text-chart-2 font-medium">
                        ✨ Default workflow activates automatically when you have a connected CRM
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Custom Workflow Request Card */}
              <Card
                className={`cursor-pointer transition-all duration-300 border-2 border-dashed border-border/50 glassEffect hover:border-primary/50 hover:shadow-lg flex flex-col ${activeWorkflowExists || hasPendingCustomWorkflow ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => !activeWorkflowExists && handleCustomWorkflowSelect()}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-primary/10 template-icon-container">
                      <SettingsIcon className="h-6 w-6 text-chart-4" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">Request Custom Workflow</CardTitle>
                      <Badge variant="outline" className="text-xs bg-chart-4/10 text-chart-4 border-chart-4/20">
                        Tailored Solution
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">
                    Need something more specific? Describe your unique business requirements and we&apos;ll build a
                    custom workflow just for you.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 flex-1">
                  <div>
                    <h4 className="font-semibold text-sm mb-3 text-primary">What You Get:</h4>
                    <ul className="space-y-2">
                      {[
                        "Personalized workflow design",
                        "Custom integrations",
                        "Advanced automation logic",
                        "Dedicated development support",
                      ].map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <Sparkles className="h-4 w-4 text-chart-4 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-3 text-primary">Perfect For:</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Complex business processes, multiple integrations, unique industry requirements, or specialized
                      automation needs that go beyond standard workflows.
                    </p>
                  </div>

                  <div className="bg-chart-4/10 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-chart-4 mb-1">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">Development Time: 3-5 business days</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Our team will review your requirements and build your custom solution.
                    </p>
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <Button
                      onClick={() => handleCustomWorkflowSelect()}
                      variant="outline"
                      className="flex-1 bg-transparent hover:bg-accent"
                      disabled={activeWorkflowExists || hasPendingCustomWorkflow}
                    >
                      {hasPendingCustomWorkflow ? "Custom Workflow Pending" : "Request Custom Workflow"}
                    </Button>
                  </div>
                  {hasPendingCustomWorkflow && (
                    <p className="text-xs text-muted-foreground mt-2">
                      You have a pending custom workflow. Please check &ldquo;My Workflow Requests&rdquo;.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* CRM Connection Notice */}
            {activeCRMIntegrations.length === 0 && (
              <div className="max-w-4xl mx-auto mt-8">
                <Card className="border-2 border-destructive/20 bg-destructive/5">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-destructive mb-2">CRM Integration Required</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          To use the default workflow, you need to connect a CRM system first. This allows us to
                          automatically send qualified leads to your CRM.
                        </p>
                        <Button
                          variant="outline"
                          className="text-destructive border-destructive/20 hover:bg-destructive/10 bg-transparent"
                        >
                          Go to Leads Page to Connect CRM
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
        <PaymentPopup
          isOpen={showPaymentPopup}
          onClose={() => setShowPaymentPopup(false)}
          onSuccess={handlePaymentSuccess}
        />
      </div>
    )
  }

  // Configuration step for default workflow
  if (step === "configuration") {
    return (
      <div className="min-h-screen bg-background">
        <div className="radiale--gradient--automations">
          <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
              <Button variant="ghost" onClick={() => setStep("selection")} className="mb-6 hover:bg-accent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Selection
              </Button>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Configure Your {isDefaultWorkflow ? "Default CRM" : "Custom"} Workflow
                </h1>
                <p className="text-muted-foreground text-lg">
                  Provide your business information to personalize the workflow
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

              <div className="space-y-8">
                <Card className="glassEffect border-2 card-border-customer-support">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-chart-1" />
                      Default CRM Workflow Overview
                    </CardTitle>
                    <CardDescription>Here&apos;s what your default workflow will include</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-4 text-primary flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          Process Flow:
                        </h4>
                        <div className="space-y-3">
                          {[
                            "Receive Instagram DM",
                            "AI lead qualification",
                            "Collect contact information",
                            "Send to your CRM",
                            "Notify your team",
                          ].map((operation, idx) => (
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
                          {[
                            "Instant lead qualification",
                            "Automatic CRM integration",
                            "Smart conversation handling",
                            "Lead scoring & prioritization",
                            "Human handoff when needed",
                            "Real-time notifications",
                          ].map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-3 text-sm">
                              <CheckCircle className="h-4 w-4 text-chart-2 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-4 text-primary">Connected CRM:</h4>
                        <div className="space-y-2">
                          {crmIntegrations
                            .filter((crm) => crm.isActive)
                            .map((crm) => (
                              <div key={crm.id} className="flex items-center gap-3 p-3 bg-chart-2/10 rounded-lg">
                                <CheckCircle className="h-4 w-4 text-chart-2" />
                                <span className="text-sm font-medium">{crm.provider}</span>
                                <Badge variant="outline" className="ml-auto text-xs text-chart-2 border-chart-2/20">
                                  Active
                                </Badge>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="mt-10 flex justify-end">
              <Button
                onClick={handleBusinessInfoSubmit}
                disabled={!businessInfo.businessName || !businessInfo.businessType}
                size="lg"
                className="px-8 py-3 text-base font-semibold"
              >
                Continue to Review
                <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Review step
  if (step === "review") {
    return (
      <div className="min-h-screen bg-background">
        <div className="radiale--gradient--automations">
          <div className="max-w-5xl mx-auto p-6">
            <div className="mb-8">
              <Button variant="ghost" onClick={() => setStep("configuration")} className="mb-6 hover:bg-accent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Configuration
              </Button>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Review &amp; Deploy
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
                    <Label className="text-sm font-semibold text-primary">Workflow Type:</Label>
                    <p className="text-sm bg-accent/50 p-3 rounded-lg">
                      {isDefaultWorkflow ? "Default CRM Workflow" : "Custom Workflow Request"}
                    </p>
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
                    <Label className="text-sm font-semibold text-primary">Setup Time:</Label>
                    <p className="text-sm bg-accent/50 p-3 rounded-lg flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {isDefaultWorkflow ? "Immediate activation" : "3-5 business days"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="glassEffect border-2 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    CRM Integration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {crmIntegrations
                      .filter((crm) => crm.isActive)
                      .map((crm) => (
                        <div key={crm.id} className="flex items-center gap-3 p-3 bg-chart-2/10 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-chart-2" />
                          <div className="flex-1">
                            <span className="text-sm font-medium">{crm.provider}</span>
                            <p className="text-xs text-muted-foreground">
                              Connected on {new Date(crm.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs text-chart-2 border-chart-2/20">
                            Active
                          </Badge>
                        </div>
                      ))}
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    {isDefaultWorkflow
                      ? "Your CRM credentials will be automatically used by the workflow to send qualified leads."
                      : "CRM integration will be configured as part of your custom workflow development."}
                  </div>
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
                  {isDefaultWorkflow ? (
                    <>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        Your default workflow will be activated immediately upon submission.
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        Instagram DMs will start being processed automatically using your CRM credentials.
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        Qualified leads will be sent directly to your connected{" "}
                        {crmIntegrations.find((crm) => crm.isActive)?.provider || "CRM"}.
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        You can monitor performance and leads from your dashboard.
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        Your custom workflow request will be sent to our development team.
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        We will email you at <strong>{businessInfo.email}</strong> when development begins.
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        You can return to this page anytime to check the status of your workflow.
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        Once complete, your custom automation will be available in your dashboard.
                      </li>
                    </>
                  )}
                </ul>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep("configuration")} size="lg">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleFinalSubmit}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8 py-3 text-base font-semibold glow"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isDefaultWorkflow ? "Activate Workflow 🚀" : "Submit for Development 🚀"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isConfiguring) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Select a Workflow Template</CardTitle>
          <CardDescription>Choose from our pre-built templates or custom solutions.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.length === 0 ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">No templates available yet.</div>
          ) : (
            templates.map((template) => (
              <Card
                key={template.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleSelectTemplate(template)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="secondary">{template.complexity}</Badge>
                    {template.isPublic ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        <Globe className="h-3 w-3 mr-1" /> Public
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-orange-50 text-orange-700">
                        <Lock className="h-3 w-3 mr-1" /> Private
                      </Badge>
                    )}
                    {template.integrations.length > 0 && (
                      <Badge variant="outline">
                        <Zap className="h-3 w-3 mr-1" /> {template.integrations.length} Integrations
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
        <Dialog open={isCredentialDialogOpen} onOpenChange={setIsCredentialDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enter Credentials for {selectedTemplate?.name}</DialogTitle>
              <DialogDescription>
                Please provide the necessary API keys or tokens for this workflow&apos;s integrations.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {selectedTemplate?.integrations.map((integration) => (
                <div key={integration.name}> {/* or integration.id */}
                  <Label htmlFor={integration.name}>{integration.name} API Key</Label>
                  <Input
                    id={integration.name}
                    type="password"
                    value={credentials[integration.name] || ""}
                    onChange={(e) => handleCredentialChange(integration.name, e.target.value)}
                    placeholder={`Enter ${integration.name} API Key`}
                  />
                </div>
              ))}
            </div>
            {/* <div className="space-y-4 py-4">
              {selectedTemplate?.integrations.map((integrationName) => (
                <div key={integrationName}>
                  <Label htmlFor={integrationName}>{integrationName} API Key</Label>
                  <Input
                    id={integrationName}
                    type="password"
                    value={credentials[integrationName] || ""}
                    onChange={(e) => handleCredentialChange(integrationName, e.target.value)}
                    placeholder={`Enter ${integrationName} API Key`}
                  />
                </div>
              ))}
            </div> */}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCredentialDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateWorkflowConfig} disabled={submittingCredentials}>
                {submittingCredentials ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Activating...
                  </>
                ) : (
                  "Activate Workflow"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Your Active Workflows</h2>
        <Button onClick={() => setIsConfiguring(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Workflow
        </Button>
      </div>

      {workflowConfigs.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-lg text-muted-foreground mb-4">You don&apos;t have any active workflows yet.</p>
            <Button onClick={() => setIsConfiguring(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Start Your First Workflow
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflowConfigs.map((config) => (
            <Card
              key={config.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onWorkflowSelected(config)}
            >
              <CardHeader>
                <CardTitle className="text-xl">{config.workflowTemplate?.name || "Custom Workflow"}</CardTitle>
                <CardDescription>
                  {config.workflowTemplate?.description || config.customRequest || "No description provided."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    {config.isActive ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span>{config.isActive ? "Active" : "Inactive"}</span>
                  </div>
                  <Badge variant="outline">{config.status}</Badge>
                </div>
                <div className="mt-4 space-y-2">
                  {config.credentials.length > 0 ? (
                    config.credentials.map((cred) => (
                      <div key={cred.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <SettingsIcon className="h-3 w-3" />
                        <span>
                          {cred.integrationName} ({cred.integrationType}) -{" "}
                          {cred.isActive ? "Connected" : "Disconnected"}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">No credentials configured.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
