
// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Separator } from "@/components/ui/separator"
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
// import {
//   Search,
//   Filter,
//   Sparkles,
//   Loader2,
//   AlertTriangle,
//   LayoutDashboard,
//   Zap,
//   Clock,
//   CheckCircle,
//   Settings,
//   BarChart3,
//   Eye,
//   EyeOff,
//   RefreshCw,
//   Activity,
//   ExternalLink,
//   Power,
//   PowerOff,
//   Database,
//   SettingsIcon,
//   ListChecks,
//   Users,
//   ArrowLeft,
//   Plus,
//   Globe,
//   Lock,
//   XCircle,
// } from "lucide-react"
// import { toast } from "@/hooks/use-toast"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import WorkflowDashboard from "./workflow-dashboard"
// import CustomWorkflowBuilder from "./custom-workflow-builder"
// import WorkflowPendingPage from "./workflow-pending-page"
// import UserWorkflowProgress from "./user-workflow-progress"
// import PaymentPopup from "@/components/global/stripe/payment-popup"
// import { useSubscription } from "@/contexts/subscription-context"
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

// interface Integration {
//   id: string
//   name: string
//   description: string
//   category: string
//   pricing: string
//   logoUrl?: string
//   credentialFields: CredentialField[]
//   credentialInstructions: string
// }

// interface CredentialField {
//   name: string
//   label: string
//   type: "text" | "password" | "email" | "url"
//   required: boolean
//   placeholder?: string
//   helpText?: string
// }

// interface WorkflowTemplate {
//   id: string
//   name: string
//   category: string
//   description: string
//   complexity: "LOW" | "MEDIUM" | "HIGH" | "SIMPLE" | "COMPLEX"
//   estimatedSetupTime: number
//   operations: string[]
//   features: string[]
//   integrations: Integration[] | any[]
//   commonUseCase?: string
//   isActive: boolean
//   isPublic: boolean
//   workflowDesign?: any
//   createdByAdmin?: boolean
//   voiceflowProjectId?: string
//   voiceflowVersionId?: string
//   createdAt: Date | string
//   updatedAt: Date | string
//   publishedAt?: Date
// }

// interface WorkflowConfig {
//   id: string
//   userId: string
//   businessId: string
//   workflowTemplateId?: string
//   workflowTemplate?: WorkflowTemplate
//   businessInfo: any
//   integrationConfigs: any[]
//   customRequest?: string
//   status: "DRAFT" | "CONFIGURING" | "ACTIVE" | "INACTIVE" | "CUSTOM_REQUEST" | "PENDING_CREATION"
//   isActive: boolean
//   credentials: WorkflowCredential[]
//   createdAt: Date | string
//   updatedAt: Date | string
// }

// interface WorkflowCredential {
//   id: string
//   workflowConfigId: string
//   integrationName: string
//   integrationType: string
//   encryptedCredentials: string
//   isActive: boolean
//   lastVerified?: Date
//   createdAt: Date
//   updatedAt: Date
// }

// interface BusinessDetails {
//   id: string
//   businessName: string
//   businessType: string
//   businessDescription: string
//   industry: string
//   targetAudience: string
//   website: string
//   instagramHandle: string
//   whatsappNumber?: string
//   welcomeMessage: string
//   responseLanguage: string
//   businessHours: string
//   location?: string
//   size?: string
//   logo?: string
// }

// interface EnhancedWorkflowSelectorProps {
//   userId: string
//   businessId: string
//   onWorkflowSelected?: (workflowConfig: BusinessWorkflowConfig) => void
// }

// export default function EnhancedWorkflowSelector({
//   userId,
//   businessId,
//   onWorkflowSelected,
// }: EnhancedWorkflowSelectorProps) {
//   // All state from original component
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

//   // Add default workflow status state
//   const [defaultWorkflowStatus, setDefaultWorkflowStatus] = useState<"active" | "deactivated">("active")

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
//   const currentUserId = userId || "user_clerk_id_placeholder"

//   const [workflowConfigs, setWorkflowConfigs] = useState<BusinessWorkflowConfig[]>([])
//   const [templates, setTemplates] = useState<WorkflowTemplate[]>([])
//   const [loading, setLoading] = useState(true)
//   const [isConfiguring, setIsConfiguring] = useState(false)
//   const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null)
//   const [isCredentialDialogOpen, setIsCredentialDialogOpen] = useState(false)
//   const [credentials, setCredentials] = useState<Record<string, string>>({})
//   const [submittingCredentials, setSubmittingCredentials] = useState(false)

//   // Enhanced workflow selector specific state
//   const [activeTab, setActiveTab] = useState<"browse" | "dashboard">("browse")
//   const [filteredTemplates, setFilteredTemplates] = useState<WorkflowTemplate[]>([])
//   const [businessDetails, setBusinessDetails] = useState<BusinessDetails | null>(null)
//   const [businessLoading, setBusinessLoading] = useState(true)
//   const [searchQuery, setSearchQuery] = useState("")
//   const [selectedCategory, setSelectedCategory] = useState<string>("all")
//   const [activatingTemplate, setActivatingTemplate] = useState<string | null>(null)
//   const [showCredentialsDialog, setShowCredentialsDialog] = useState(false)
//   const [credentialsEnhanced, setCredentialsEnhanced] = useState<Record<string, Record<string, string>>>({})
//   const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
//   const [refreshing, setRefreshing] = useState(false)
//   const [configuredTemplates, setConfiguredTemplates] = useState<Set<string>>(new Set())
//   // const [showDeactivateDialog, setShowDeactivateDialog] = useState<WorkflowConfig | null>(null)
//   const [showDeactivateDialog, setShowDeactivateDialog] = useState<WorkflowConfig | BusinessWorkflowConfig | null>(null)

//   const [testingCredentials, setTestingCredentials] = useState<Record<string, boolean>>({})
//   const [credentialTestResults, setCredentialTestResults] = useState<
//     Record<string, { success: boolean; message: string }>
//   >({})

//   const categories = [
//     { value: "all", label: "All Templates" },
//     { value: "AI_ASSISTANT", label: "AI Assistant" },
//     { value: "SALES", label: "Sales" },
//     { value: "MARKETING", label: "Marketing" },
//     { value: "SUPPORT", label: "Support" },
//     { value: "CUSTOM", label: "Custom" },
//   ]

//   // Fetch active workflow and CRM integrations (from original)
//   useEffect(() => {
//     const fetchWorkflowStatus = async () => {
//       setIsFetchingActiveWorkflow(true)
//       setIsFetchingCRM(true)

//       try {
//         if (!currentUserId) {
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
//             setStep("progress")
//           }
//         } else {
//           console.error("Failed to fetch user workflow requests:", await userRequestsResponse.text())
//         }

//         // Check for pending workflow in localStorage first
//         const storedPending = localStorage.getItem("pendingWorkflow")
//         if (storedPending) {
//           const pendingData: PendingWorkflowData = JSON.parse(storedPending)

//           const statusResponse = await fetch(`/api/workflow-config/${pendingData.id}`)
//           if (statusResponse.ok) {
//             const statusData = await statusResponse.json()

//             if (statusData.status === "ACTIVE") {
//               localStorage.removeItem("pendingWorkflow")
//               setActiveWorkflowExists(true)
//               setActiveWorkflowDetails(statusData)
//               setWorkflowCreationStatus("completed")
//               setStep("dashboard")
//             } else if (statusData.status === "PENDING_CREATION") {
//               setPendingWorkflowData(pendingData)
//               setWorkflowCreationStatus("in-progress")
//               setStep("pending")
//             } else {
//               localStorage.removeItem("pendingWorkflow")
//             }
//           } else {
//             localStorage.removeItem("pendingWorkflow")
//           }
//         }

//         // Fetch active workflows and CRM integrations in parallel
//         const [workflowResponse, crmResponse] = await Promise.all([
//           fetch(`/api/workflow-config?businessId=${currentUserId}&status=ACTIVE`),
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

//             const isCustomWorkflowActive =
//               activeConfig.workflowTemplateId && activeConfig.workflowTemplate?.createdByAdmin

//             if (isCustomWorkflowActive) {
//               setDefaultWorkflowStatus("deactivated")
//             }

//             if (step !== "pending" && step !== "progress") {
//               setStep("dashboard")
//             }
//           } else {
//             setActiveWorkflowExists(false)
//             setActiveWorkflowDetails(null)
//             setDefaultWorkflowStatus("active")
//           }
//         }

//         // Handle CRM response
//         if (crmResponse.ok) {
//           const crmData = await crmResponse.json()
//           setCrmIntegrations(crmData.integrations || [])

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
//                   businessId: currentUserId,
//                   businessInfo: {
//                     businessName: "Auto-activated Business",
//                     businessType: "Service Business",
//                     description: "Auto-activated default workflow",
//                   },
//                   integrations: [],
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
//   }, [currentUserId, activeWorkflowExists, hasPendingCustomWorkflow, step])

//   useEffect(() => {
//     fetchWorkflows()
//     fetchTemplates()
//     fetchBusinessDetails()
//   }, [businessId])

//   useEffect(() => {
//     filterTemplates()
//   }, [templates, searchQuery, selectedCategory])

//   const fetchBusinessDetails = async () => {
//     setBusinessLoading(true)
//     try {
//       const response = await fetch(`/api/business/${businessId}`)
//       if (response.ok) {
//         const data = await response.json()
//         setBusinessDetails(data.business)
//       } else if (response.status === 404) {
//         setBusinessDetails(null)
//       } else {
//         throw new Error("Failed to fetch business details")
//       }
//     } catch (error) {
//       console.error("Error fetching business details:", error)
//       toast({
//         title: "Error",
//         description: "Failed to fetch business details",
//         variant: "destructive",
//       })
//     } finally {
//       setBusinessLoading(false)
//     }
//   }

//   const fetchWorkflows = async () => {
//     try {
//       const response = await fetch(`/api/workflow-configs?businessId=${businessId}`)
//       const data = await response.json()
//       setWorkflowConfigs(data.workflowConfigs || [])
//     } catch (error) {
//       console.error("Error fetching workflow configurations:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchTemplates = async () => {
//     try {
//       setLoading(true)
//       const response = await fetch("/api/workflow-templates?published=true")
//       const data = await response.json()

//       if (response.ok) {
//         const publishedTemplates =
//           data.templates?.filter((template: any) => template.isActive && template.isPublic) || []
//         setTemplates(publishedTemplates)
//       } else {
//         console.error("Failed to fetch templates:", data.error)
//         toast({
//           title: "Error",
//           description: "Failed to load workflow templates",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       console.error("Error fetching templates:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load workflow templates",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const filterTemplates = () => {
//     let filtered = templates

//     if (searchQuery.trim()) {
//       filtered = filtered.filter(
//         (template) =>
//           template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           template.category.toLowerCase().includes(searchQuery.toLowerCase()),
//       )
//     }

//     if (selectedCategory !== "all") {
//       filtered = filtered.filter((template) => template.category === selectedCategory)
//     }

//     setFilteredTemplates(filtered)
//   }

//   // All handler functions from original component
//   const handleDefaultWorkflowSelect = () => {
//     // Default workflow is read-only and managed automatically by CRM integration
//     return
//   }

//   const handleSelectTemplate = (template: WorkflowTemplate) => {
//     setSelectedTemplate(template)
//     setIsDefaultWorkflow(false)
//     setIsCustomWorkflow(false)
//     setStep("configuration")
//   }

//   const handleConfigureTemplate = (template: WorkflowTemplate) => {
//     if (!businessDetails) {
//       toast({
//         title: "Business Details Required",
//         description: "Please complete your business profile first to configure workflows.",
//         variant: "destructive",
//       })
//       return
//     }

//     setSelectedTemplate(template)
//     if (template.integrations && template.integrations.length > 0) {
//       const initialCredentials: Record<string, Record<string, string>> = {}

//       template.integrations.forEach((integration: Integration) => {
//         initialCredentials[integration.name] = {}
//         integration.credentialFields?.forEach((field: CredentialField) => {
//           initialCredentials[integration.name][field.name] = ""
//         })
//       })

//       setCredentialsEnhanced(initialCredentials)
//       setShowCredentialsDialog(true)
//     } else {
//       setConfiguredTemplates((prev) => new Set(prev).add(template.id))
//       toast({
//         title: "Template Configured",
//         description: `${template.name} is ready to activate!`,
//         variant: "default",
//       })
//     }
//   }

//   const handleCreateWorkflowConfig = async () => {
//     if (!selectedTemplate) return

//     setSubmittingCredentials(true)
//     try {
//       const configResponse = await fetch("/api/workflow-configs", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           businessId,
//           workflowTemplateId: selectedTemplate.id,
//         }),
//       })

//       if (!configResponse.ok) {
//         const errorData = await configResponse.json()
//         throw new Error(errorData.message || "Failed to create workflow configuration.")
//       }

//       const newWorkflowConfig = await configResponse.json()
//       const workflowConfigId = newWorkflowConfig.workflowConfig.id

//       const credentialResponse = await fetch(`/api/workflow-configs/${workflowConfigId}/credentials`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ credentials }),
//       })

//       if (!credentialResponse.ok) {
//         const errorData = await credentialResponse.json()
//         throw new Error(errorData.message || "Failed to save credentials.")
//       }

//       setDefaultWorkflowStatus("deactivated")

//       toast({
//         title: "Workflow Activated!",
//         description: `${selectedTemplate.name} is now active. Default workflow has been deactivated.`,
//         variant: "default",
//       })
//       setIsCredentialDialogOpen(false)
//       setIsConfiguring(false)
//       fetchWorkflows()
//       if (onWorkflowSelected) {
//         onWorkflowSelected(newWorkflowConfig.workflowConfig)
//       }
//     } catch (error: any) {
//       console.error("Error creating workflow config or saving credentials:", error)
//       toast({
//         title: "Activation Failed",
//         description: error.message || "An error occurred during workflow activation.",
//         variant: "destructive",
//       })
//     } finally {
//       setSubmittingCredentials(false)
//     }
//   }

//   const activateWorkflow = async (template: WorkflowTemplate, creds: Record<string, Record<string, string>>) => {
//     if (!businessDetails) {
//       toast({
//         title: "Business Details Required",
//         description: "Business details are required to activate workflows.",
//         variant: "destructive",
//       })
//       return
//     }

//     setActivatingTemplate(template.id)

//     try {
//       // First deactivate any existing active workflows
//       const activeConfigs = workflowConfigs.filter((config) => config.isActive)
//       for (const activeConfig of activeConfigs) {
//         await fetch("/api/workflow-configs", {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             id: activeConfig.id,
//             isActive: false,
//             status: "INACTIVE",
//           }),
//         })
//       }

//       // Create workflow configuration
//       const configResponse = await fetch("/api/workflow-configs", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           workflowTemplateId: template.id,
//           businessId,
//           businessInfo: {
//             businessName: businessDetails.businessName,
//             businessType: businessDetails.businessType,
//             description: businessDetails.businessDescription,
//             industry: businessDetails.industry,
//             targetAudience: businessDetails.targetAudience,
//             website: businessDetails.website,
//             instagramHandle: businessDetails.instagramHandle,
//             whatsappNumber: businessDetails.whatsappNumber,
//             welcomeMessage: businessDetails.welcomeMessage,
//             responseLanguage: businessDetails.responseLanguage,
//             businessHours: businessDetails.businessHours,
//             location: businessDetails.location,
//             size: businessDetails.size,
//           },
//           status: "ACTIVE",
//           isActive: true,
//         }),
//       })

//       if (!configResponse.ok) {
//         throw new Error("Failed to create workflow configuration")
//       }

//       const configData = await configResponse.json()
//       const workflowConfigId = configData.workflowConfig.id

//       // Save credentials for each integration
//       for (const [integrationName, integrationCreds] of Object.entries(creds)) {
//         if (Object.keys(integrationCreds).length > 0) {
//           const credResponse = await fetch(`/api/workflow-configs/${workflowConfigId}/credentials`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               integrationName,
//               credentials: integrationCreds,
//             }),
//           })

//           if (!credResponse.ok) {
//             console.warn(`Failed to save credentials for ${integrationName}`)
//           }
//         }
//       }

//       toast({
//         title: "Workflow Activated!",
//         description: `${template.name} is now active. Any previous workflows have been deactivated.`,
//         variant: "default",
//       })

//       setShowCredentialsDialog(false)
//       setConfiguredTemplates((prev) => {
//         const newSet = new Set(prev)
//         newSet.delete(template.id)
//         return newSet
//       })
//       setActiveTab("dashboard")
//       await fetchWorkflows()
//     } catch (error) {
//       console.error("Error activating workflow:", error)
//       toast({
//         title: "Activation Failed",
//         description: "Failed to activate workflow. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setActivatingTemplate(null)
//     }
//   }

//   const handleCredentialChange = (key: string, value: string) => {
//     setCredentials((prev) => ({ ...prev, [key]: value }))
//   }

//   const handleCredentialChangeEnhanced = (integrationName: string, fieldName: string, value: string) => {
//     setCredentialsEnhanced((prev) => ({
//       ...prev,
//       [integrationName]: {
//         ...prev[integrationName],
//         [fieldName]: value,
//       },
//     }))
//   }

//   const togglePasswordVisibility = (key: string) => {
//     setShowPasswords((prev) => ({
//       ...prev,
//       [key]: !prev[key],
//     }))
//   }

//   const testCredentials = async (integrationName: string, credentials: Record<string, string>) => {
//     const testKey = `${integrationName}-test`
//     setTestingCredentials((prev) => ({ ...prev, [testKey]: true }))

//     try {
//       const response = await fetch("/api/test-credentials", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ integrationName, credentials }),
//       })

//       const result = await response.json()
//       setCredentialTestResults((prev) => ({
//         ...prev,
//         [testKey]: { success: result.success, message: result.message },
//       }))

//       toast({
//         title: result.success ? "Credentials Valid" : "Credentials Invalid",
//         description: result.message,
//         variant: result.success ? "default" : "destructive",
//       })
//     } catch (error) {
//       setCredentialTestResults((prev) => ({
//         ...prev,
//         [testKey]: { success: false, message: "Test failed" },
//       }))
//       toast({
//         title: "Test Failed",
//         description: "Unable to test credentials",
//         variant: "destructive",
//       })
//     } finally {
//       setTestingCredentials((prev) => ({ ...prev, [testKey]: false }))
//     }
//   }

//   const validateCredentials = (): boolean => {
//     if (!selectedTemplate) return false

//     for (const integration of selectedTemplate.integrations) {
//       for (const field of integration.credentialFields || []) {
//         if (field.required && !credentialsEnhanced[integration.name]?.[field.name]?.trim()) {
//           toast({
//             title: "Missing Required Field",
//             description: `Please fill in ${field.label} for ${integration.name}`,
//             variant: "destructive",
//           })
//           return false
//         }
//       }

//       const testKey = `${integration.name}-test`
//       const testResult = credentialTestResults[testKey]
//       if (testResult && !testResult.success) {
//         toast({
//           title: "Invalid Credentials",
//           description: `Please fix credentials for ${integration.name}`,
//           variant: "destructive",
//         })
//         return false
//       }
//     }
//     return true
//   }

//   const handleSubmitCredentials = async () => {
//     if (!selectedTemplate) return

//     if (selectedTemplate.integrations.length > 0 && !validateCredentials()) {
//       return
//     }

//     setConfiguredTemplates((prev) => new Set(prev).add(selectedTemplate.id))
//     setShowCredentialsDialog(false)

//     toast({
//       title: "Template Configured!",
//       description: `${selectedTemplate.name} is ready to activate. Click "Activate Now" to make it live.`,
//       variant: "default",
//     })
//   }

//   const handleActivateConfiguredTemplate = async (template: WorkflowTemplate) => {
//     await activateWorkflow(template, credentialsEnhanced)
//   }

//   // All other handler functions from original component
//   const handleCustomWorkflowSelect = () => {
//     if (activeWorkflowExists) return
//     if (subscription?.plan.toUpperCase() !== "PRO") {
//       setShowPaymentPopup(true)
//       return
//     }
//     if (hasPendingCustomWorkflow) {
//       setStep("progress")
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
//     const businessIdToUse = currentUserId

//     if (!businessIdToUse) {
//       alert("Error: Business ID is missing. Cannot deploy workflow.")
//       return
//     }

//     const workflowData = {
//       workflowTemplateId: isDefaultWorkflow ? "default-crm-workflow" : selectedTemplate?.id || null,
//       businessId: businessIdToUse,
//       businessInfo,
//       integrations: [],
//       customRequest: isCustomWorkflow ? customRequest : undefined,
//       status: isDefaultWorkflow ? "ACTIVE" : "PENDING_CREATION",
//       isActive: isDefaultWorkflow,
//       submittedAt: new Date().toISOString(),
//       estimatedCompletion: isDefaultWorkflow ? "immediate" : "3-5",
//     }

//     try {
//       const response = await fetch("/api/workflow-config", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(workflowData),
//       })
//       const result = await response.json()

//       if (result.success) {
//         if (isDefaultWorkflow) {
//           setActiveWorkflowExists(true)
//           setActiveWorkflowDetails(result.workflowConfig)
//           setWorkflowCreationStatus("completed")
//           setStep("dashboard")
//         } else {
//           const pendingData: PendingWorkflowData = {
//             id: result.workflowConfig.id,
//             submittedAt: result.workflowConfig.createdAt,
//             status: "UNDER_REVIEW",
//             // workflowType: selectedTemplate?.category || "Custom Workflow",
//             workflowType: "Custom Workflow",
//             estimatedCompletion: "3-5",
//           }

//           localStorage.setItem("pendingWorkflow", JSON.stringify(pendingData))
//           setPendingWorkflowData(pendingData)
//           setWorkflowCreationStatus("submitted")
//           setHasPendingCustomWorkflow(true)
//           setStep("progress")
//         }
//       } else {
//         alert(`Failed to submit workflow: ${result.error || "Unknown error"}`)
//       }
//     } catch (error) {
//       console.error("Error submitting workflow configuration:", error)
//       alert("An unexpected error occurred during submission.")
//     }
//   }
//   const handleDeactivateWorkflow = async (config?: WorkflowConfig | BusinessWorkflowConfig) => {
//     if (config) {
//       setShowDeactivateDialog(config)
//     } else if (activeWorkflowDetails?.id) {
//       setShowDeactivateConfirm(true)
//     } else {
//       alert("No active workflow to deactivate.")
//     }
//   }
//   //  const handleDeactivateWorkflow = async (config?: WorkflowConfig) => {
//   //   if (config) {
//   //     setShowDeactivateDialog(config)
//   //   } else if (activeWorkflowDetails?.id) {
//   //     setShowDeactivateConfirm(true)
//   //   } else {
//   //     alert("No active workflow to deactivate.")
//   //   }
//   // }

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
//         setDefaultWorkflowStatus("active")
//         alert("Custom workflow deactivated successfully! Default workflow is now active.")
//         setActiveWorkflowExists(false)
//         setActiveWorkflowDetails(null)
//         setStep("selection")
//         setBusinessInfo({ businessName: "", businessType: "", description: "", website: "", phone: "", email: "" })
//         setCustomRequest("")
//         setIsCustomWorkflow(false)
//         setIsDefaultWorkflow(false)
//         setWorkflowCreationStatus("not-started")
//         setPendingWorkflowData(null)
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

//   const confirmDeactivateWorkflow = async () => {
//     if (!showDeactivateDialog) return

//     try {
//       const response = await fetch("/api/workflow-configs", {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           id: showDeactivateDialog.id,
//           isActive: false,
//           status: "INACTIVE",
//         }),
//       })

//       if (response.ok) {
//         toast({
//           title: "Success",
//           description: "Workflow deactivated successfully",
//           variant: "default",
//         })
//         await fetchWorkflows()
//       } else {
//         throw new Error("Failed to deactivate workflow")
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to deactivate workflow",
//         variant: "destructive",
//       })
//     } finally {
//       setShowDeactivateDialog(null)
//     }
//   }

//   const handlePaymentSuccess = () => {
//     setShowPaymentPopup(false)
//     if (subscription?.plan.toUpperCase() === "ENTERPRISE") {
//       handleCustomWorkflowSelect()
//     }
//   }

//   const handleRefresh = async () => {
//     setRefreshing(true)
//     await fetchWorkflows()
//   }

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
//       }, 30000)
//     }

//     return () => {
//       if (interval) clearInterval(interval)
//     }
//   }, [step, pendingWorkflowData])

//   // Utility functions
//   const getComplexityColor = (complexity: string) => {
//     switch (complexity) {
//       case "LOW":
//       case "SIMPLE":
//         return "bg-primary/10 text-primary border-primary/20"
//       case "MEDIUM":
//         return "bg-secondary/10 text-secondary-foreground border-secondary/20"
//       case "HIGH":
//       case "COMPLEX":
//         return "bg-destructive/10 text-destructive border-destructive/20"
//       default:
//         return "bg-muted/10 text-muted-foreground border-muted/20"
//     }
//   }

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "ACTIVE":
//         return "bg-primary/10 text-primary border-primary/20"
//       case "CONFIGURING":
//         return "bg-secondary/10 text-secondary-foreground border-secondary/20"
//       case "INACTIVE":
//         return "bg-muted/10 text-muted-foreground border-muted/20"
//       default:
//         return "bg-muted/10 text-muted-foreground border-muted/20"
//     }
//   }

//   const getCategoryIcon = (category: string) => {
//     switch (category.toLowerCase()) {
//       case "ai_assistant":
//         return <Sparkles className="h-6 w-6 text-primary" />
//       case "sales":
//         return <BarChart3 className="h-6 w-6 text-secondary-foreground" />
//       case "marketing":
//         return <Activity className="h-6 w-6 text-accent-foreground" />
//       case "support":
//         return <Clock className="h-6 w-6 text-muted-foreground" />
//       case "custom":
//         return <Settings className="h-6 w-6 text-primary" />
//       case "hr":
//         return <Users className="h-6 w-6 text-muted-foreground" />
//       default:
//         return <LayoutDashboard className="h-6 w-6 text-muted-foreground" />
//     }
//   }

//   // Loading state
//   if (isFetchingActiveWorkflow || isFetchingCRM || loading || businessLoading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
//           <p className="text-muted-foreground">Loading workflow templates...</p>
//         </div>
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
//           onDeactivate={() => handleDeactivateWorkflow()}
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

//   // Main selection page - EXACT SAME STYLING AS DEFAULT WORKFLOW
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

//             {/* Business Details Check */}
//             {!businessDetails && (
//               <Alert className="mb-8 border-destructive/50 bg-destructive/5">
//                 <AlertTriangle className="h-4 w-4" />
//                 <AlertDescription className="flex items-center justify-between">
//                   <span>
//                     <strong>Business Details Required:</strong> Complete your business profile to configure and activate
//                     workflows.
//                   </span>
//                   <Button variant="outline" size="sm" className="ml-4 bg-transparent">
//                     <ExternalLink className="h-4 w-4 mr-2" />
//                     Complete Business Profile
//                   </Button>
//                 </AlertDescription>
//               </Alert>
//             )}

//             <div className="space-y-8">
//               {/* Default Workflow Section */}
//               <div>
//                 <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
//                   <Database className="h-6 w-6 text-primary" />
//                   Default AI Assistant Workflow
//                 </h2>
//                 <Card
//                   className={`border-2 ${
//                     defaultWorkflowStatus === "active"
//                       ? "border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20"
//                       : "border-gray-300 bg-gray-50 dark:bg-gray-950/20 opacity-75"
//                   } transition-all duration-300`}
//                 >
//                   <CardHeader className="pb-4">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-4">
//                         <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 template-icon-container">
//                           <Database className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
//                         </div>
//                         <div className="flex-1">
//                           <CardTitle className="text-xl mb-2">Smart AI Assistant</CardTitle>
//                           <CardDescription className="text-base">
//                             Ready-to-use AI assistant powered by your CRM integration
//                           </CardDescription>
//                         </div>
//                       </div>
//                       <Badge
//                         variant={defaultWorkflowStatus === "active" ? "default" : "secondary"}
//                         className={
//                           defaultWorkflowStatus === "active"
//                             ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200"
//                             : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
//                         }
//                       >
//                         {defaultWorkflowStatus === "active" ? "Active" : "Deactivated"}
//                       </Badge>
//                     </div>
//                   </CardHeader>
//                   <CardContent className="space-y-6">
//                     <div className="grid md:grid-cols-2 gap-6">
//                       <div>
//                         <h4 className="font-semibold text-sm mb-3 text-primary">Process Flow:</h4>
//                         <div className="space-y-2">
//                           {[
//                             "Receive Instagram DM",
//                             "AI lead qualification",
//                             "Collect contact information",
//                             "Send to your CRM",
//                             "Notify your team",
//                           ].map((operation, idx) => (
//                             <div key={idx} className="flex items-center gap-3">
//                               <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
//                                 {idx + 1}
//                               </div>
//                               <span className="text-sm text-muted-foreground">{operation}</span>
//                             </div>
//                           ))}
//                         </div>
//                       </div>

//                       <div>
//                         <h4 className="font-semibold text-sm mb-3 text-primary">Key Features:</h4>
//                         <ul className="space-y-2">
//                           {[
//                             "Instant lead qualification",
//                             "Automatic CRM integration",
//                             "Smart conversation handling",
//                             "Lead scoring & prioritization",
//                           ].map((feature, idx) => (
//                             <li key={idx} className="flex items-center gap-2 text-sm">
//                               <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
//                               <span className="text-muted-foreground">{feature}</span>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     </div>

//                     <div>
//                       <h4 className="font-semibold text-sm mb-3 text-primary">CRM Integration Status:</h4>
//                       {activeCRMIntegrations.length > 0 ? (
//                         <div className="space-y-2">
//                           {activeCRMIntegrations.map((crm) => (
//                             <div key={crm.id} className="flex items-center gap-2 text-sm bg-chart-2/10 p-2 rounded-lg">
//                               <CheckCircle className="h-4 w-4 text-chart-2" />
//                               <span className="text-foreground font-medium">{crm.provider}</span>
//                               <Badge variant="outline" className="ml-auto text-xs text-chart-2 border-chart-2/20">
//                                 Connected
//                               </Badge>
//                             </div>
//                           ))}
//                           {defaultWorkflowStatus === "active" && activeCRMIntegrations.length > 0 && (
//                             <div className="pt-4 border-t">
//                               <p className="text-sm text-muted-foreground mb-3">
//                                 This workflow is automatically managed by your CRM integration and cannot be configured
//                                 manually.
//                               </p>
//                               <Button disabled className="bg-emerald-600 dark:bg-emerald-700">
//                                 <CheckCircle className="h-4 w-4 mr-2" />
//                                 Auto-Active (Read Only)
//                               </Button>
//                             </div>
//                           )}
//                         </div>
//                       ) : (
//                         <div className="bg-destructive/10 p-3 rounded-lg">
//                           <div className="flex items-center gap-2 text-sm text-destructive mb-2">
//                             <AlertTriangle className="h-4 w-4" />
//                             <span className="font-medium">No CRM Connected</span>
//                           </div>
//                           <p className="text-xs text-muted-foreground">
//                             Connect a CRM first to automatically activate the default workflow.
//                           </p>
//                         </div>
//                       )}
//                     </div>

//                     {defaultWorkflowStatus === "active" && activeCRMIntegrations.length > 0 && (
//                       <div className="pt-4 border-t">
//                         <p className="text-sm text-muted-foreground mb-3">
//                           This workflow is automatically active when your CRM integration is configured.
//                         </p>
//                         <Button disabled className="bg-emerald-600 dark:bg-emerald-700">
//                           <CheckCircle className="h-4 w-4 mr-2" />
//                           Active (CRM Required)
//                         </Button>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>
//               </div>

//               {/* Custom Workflows Section */}
//               <div>
//                 <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
//                   <SettingsIcon className="h-6 w-6 text-primary" />
//                   Custom Workflow Request
//                 </h2>
//                 <Card
//                   className={`cursor-pointer transition-all duration-300 border-2 border-dashed border-border/50 glassEffect hover:border-primary/50 hover:shadow-lg flex flex-col ${activeWorkflowExists || hasPendingCustomWorkflow ? "opacity-50 cursor-not-allowed" : ""}`}
//                   onClick={() => !activeWorkflowExists && handleCustomWorkflowSelect()}
//                 >
//                   <CardHeader className="pb-4">
//                     <div className="flex items-center gap-4 mb-4">
//                       <div className="p-3 rounded-xl bg-primary/10 template-icon-container">
//                         <SettingsIcon className="h-6 w-6 text-chart-4" />
//                       </div>
//                       <div className="flex-1">
//                         <CardTitle className="text-xl mb-2">Request Custom Workflow</CardTitle>
//                         <Badge variant="outline" className="text-xs bg-chart-4/10 text-chart-4 border-chart-4/20">
//                           Tailored Solution
//                         </Badge>
//                       </div>
//                     </div>
//                     <CardDescription className="text-sm leading-relaxed">
//                       Need something more specific? Describe your unique business requirements and we&apos;ll build a
//                       custom workflow just for you.
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent className="space-y-6 flex-1">
//                     <div>
//                       <h4 className="font-semibold text-sm mb-3 text-primary">What You Get:</h4>
//                       <ul className="space-y-2">
//                         {[
//                           "Personalized workflow design",
//                           "Custom integrations",
//                           "Advanced automation logic",
//                           "Dedicated development support",
//                         ].map((feature, idx) => (
//                           <li key={idx} className="flex items-center gap-2 text-sm">
//                             <Sparkles className="h-4 w-4 text-chart-4 flex-shrink-0" />
//                             <span className="text-muted-foreground">{feature}</span>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>

//                     <div>
//                       <h4 className="font-semibold text-sm mb-3 text-primary">Perfect For:</h4>
//                       <p className="text-xs text-muted-foreground leading-relaxed">
//                         Complex business processes, multiple integrations, unique industry requirements, or specialized
//                         automation needs that go beyond standard workflows.
//                       </p>
//                     </div>

//                     <div className="bg-chart-4/10 p-3 rounded-lg">
//                       <div className="flex items-center gap-2 text-sm text-chart-4 mb-1">
//                         <Clock className="h-4 w-4" />
//                         <span className="font-medium">Development Time: 3-5 business days</span>
//                       </div>
//                       <p className="text-xs text-muted-foreground">
//                         Our team will review your requirements and build your custom solution.
//                       </p>
//                     </div>

//                     <div className="flex gap-2 mt-auto">
//                       <Button
//                         onClick={() => handleCustomWorkflowSelect()}
//                         variant="outline"
//                         className="flex-1 bg-transparent hover:bg-accent"
//                         disabled={activeWorkflowExists || hasPendingCustomWorkflow}
//                       >
//                         {hasPendingCustomWorkflow ? "Custom Workflow Pending" : "Request Custom Workflow"}
//                       </Button>
//                     </div>
//                     {hasPendingCustomWorkflow && (
//                       <p className="text-xs text-muted-foreground mt-2">
//                         You have a pending custom workflow. Please check &ldquo;My Workflow Requests&rdquo;.
//                       </p>
//                     )}
//                   </CardContent>
//                 </Card>
//               </div>

//               {/* Published Templates Section - EXACT SAME STYLING AS DEFAULT WORKFLOW */}
//               {templates.length > 0 && (
//                 <div>
//                   <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
//                     <Globe className="h-6 w-6 text-primary" />
//                     Available Workflow Templates
//                   </h2>
//                   <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
//                     {templates.map((template) => {
//                       const isConfigured = configuredTemplates.has(template.id)
//                       const isActive = workflowConfigs.some(
//                         (config) => config.templateId === template.id && config.isActive,
//                       )
//                       const isActivating = activatingTemplate === template.id
//                       const isLocked = activeWorkflowExists && !isActive

//                       return (
//                         <Card
//                           key={template.id}
//                           className={`border-2 transition-all duration-300 ${
//                             isActive
//                               ? "border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20"
//                               : isLocked
//                                 ? "border-gray-300 bg-gray-100 dark:bg-gray-900 opacity-60 cursor-not-allowed"
//                                 : isConfigured
//                                   ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-950/20"
//                                   : "border-emerald-300 bg-emerald-50 dark:bg-emerald-950/20 hover:border-emerald-500/50 hover:shadow-lg cursor-pointer"
//                           }`}
//                           onClick={() => !isLocked && !isActive && handleConfigureTemplate(template)}
//                         >
//                           <CardHeader className="pb-4">
//                             <div className="flex items-center justify-between">
//                               <div className="flex items-center gap-4">
//                                 <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/50">
//                                   {getCategoryIcon(template.category)}
//                                 </div>
//                                 <div className="flex-1">
//                                   <CardTitle className="text-xl mb-2">{template.name}</CardTitle>
//                                   <CardDescription className="text-base">{template.description}</CardDescription>
//                                 </div>
//                               </div>
//                               <div className="flex flex-col gap-2">
//                                 <Badge variant="outline" className={getComplexityColor(template.complexity)}>
//                                   {template.complexity}
//                                 </Badge>
//                                 {isActive && (
//                                   <Badge
//                                     variant="default"
//                                     className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200"
//                                   >
//                                     <Power className="h-3 w-3 mr-1" />
//                                     Active
//                                   </Badge>
//                                 )}
//                                 {isConfigured && !isActive && (
//                                   <Badge
//                                     variant="secondary"
//                                     className="bg-emerald-100 text-emerald-600 dark:bg-emerald-800 dark:text-emerald-400"
//                                   >
//                                     <CheckCircle className="h-3 w-3 mr-1" />
//                                     Configured
//                                   </Badge>
//                                 )}
//                                 {isLocked && (
//                                   <Badge
//                                     variant="secondary"
//                                     className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
//                                   >
//                                     <Lock className="h-3 w-3 mr-1" />
//                                     Locked
//                                   </Badge>
//                                 )}
//                                 <Badge
//                                   variant="outline"
//                                   className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-300 dark:border-blue-800"
//                                 >
//                                   <Globe className="h-3 w-3 mr-1" />
//                                   Published
//                                 </Badge>
//                               </div>
//                             </div>
//                           </CardHeader>

//                           <CardContent className="space-y-6">
//                             <div className="grid md:grid-cols-2 gap-6">
//                               {/* Process Flow - EXACT SAME AS DEFAULT */}
//                               <div>
//                                 <h4 className="font-semibold text-sm mb-3 text-emerald-600 flex items-center gap-2">
//                                   <Sparkles className="h-4 w-4" />
//                                   Process Flow:
//                                 </h4>
//                                 <div className="space-y-2">
//                                   {template.operations && template.operations.length > 0 ? (
//                                     template.operations.slice(0, 4).map((operation, idx) => (
//                                       <div key={idx} className="flex items-center gap-3">
//                                         <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-medium">
//                                           {idx + 1}
//                                         </div>
//                                         <span className="text-sm text-muted-foreground">{operation}</span>
//                                       </div>
//                                     ))
//                                   ) : (
//                                     <div className="flex items-center gap-3">
//                                       <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-medium">
//                                         1
//                                       </div>
//                                       <span className="text-sm text-muted-foreground">Custom workflow process</span>
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>

//                               <div>
//                                 <h4 className="font-semibold text-sm mb-3 text-emerald-600">Key Features:</h4>
//                                 <ul className="space-y-2">
//                                   {template.features && template.features.length > 0 ? (
//                                     template.features.slice(0, 4).map((feature, idx) => (
//                                       <li key={idx} className="flex items-center gap-2 text-sm">
//                                         <CheckCircle className="h-3 w-3 text-emerald-600 flex-shrink-0" />
//                                         <span className="text-muted-foreground">{feature}</span>
//                                       </li>
//                                     ))
//                                   ) : (
//                                     <li className="flex items-center gap-2 text-sm">
//                                       <CheckCircle className="h-3 w-3 text-emerald-600 flex-shrink-0" />
//                                       <span className="text-muted-foreground">Advanced automation features</span>
//                                     </li>
//                                   )}
//                                   {template.features && template.features.length > 4 && (
//                                     <li className="text-xs text-muted-foreground ml-5">
//                                       +{template.features.length - 4} more features
//                                     </li>
//                                   )}
//                                 </ul>
//                               </div>
//                             </div>

//                             <div className="pt-4 border-t">
//                               {isActive ? (
//                                 <div className="space-y-3">
//                                   <Button disabled className="w-full bg-emerald-600 dark:bg-emerald-700">
//                                     <CheckCircle className="h-4 w-4 mr-2" />
//                                     Currently Active
//                                   </Button>
//                                   <Button
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={(e) => {
//                                       e.stopPropagation()
//                                       handleDeactivateWorkflow()
//                                     }}
//                                     className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20"
//                                   >
//                                     <XCircle className="h-4 w-4 mr-2" />
//                                     Deactivate Workflow
//                                   </Button>
//                                 </div>
//                               ) : isLocked ? (
//                                 <div className="space-y-2">
//                                   <Button disabled className="w-full">
//                                     <Lock className="h-4 w-4 mr-2" />
//                                     Locked (Another Workflow Active)
//                                   </Button>
//                                   <p className="text-xs text-muted-foreground text-center">
//                                     Deactivate your current workflow to configure this template
//                                   </p>
//                                 </div>
//                               ) : (
//                                 <Button className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800">
//                                   <Settings className="h-4 w-4 mr-2" />
//                                   Configure & Activate
//                                 </Button>
//                               )}
//                             </div>
//                           </CardContent>
//                         </Card>
//                       )
//                     })}
//                   </div>
//                   {activeWorkflowExists && (
//                     <Alert className="mt-4">
//                       <Lock className="h-4 w-4" />
//                       <AlertDescription>
//                         You have an active workflow. Deactivate it first to configure a different workflow template.
//                       </AlertDescription>
//                     </Alert>
//                   )}
//                 </div>
//               )}
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

//   // Enhanced workflow selector tabs view
//   if (activeTab === "browse" || activeTab === "dashboard") {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="max-w-7xl mx-auto p-6">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <div className="flex items-center justify-center gap-3 mb-4">
//               <Sparkles className="h-8 w-8 text-primary" />
//               <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                 Workflow Automation Hub
//               </h1>
//             </div>
//             <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
//               Discover, configure, and deploy powerful automation workflows to streamline your business operations
//             </p>
//           </div>

//           {/* Business Details Check */}
//           {!businessDetails && (
//             <Alert className="mb-8 border-destructive/50 bg-destructive/5">
//               <AlertTriangle className="h-4 w-4" />
//               <AlertDescription className="flex items-center justify-between">
//                 <span>
//                   <strong>Business Details Required:</strong> Complete your business profile to configure and activate
//                   workflows.
//                 </span>
//                 <Button variant="outline" size="sm" className="ml-4 bg-transparent">
//                   <ExternalLink className="h-4 w-4 mr-2" />
//                   Complete Business Profile
//                 </Button>
//               </AlertDescription>
//             </Alert>
//           )}

//           {/* Navigation Tabs */}
//           <Tabs
//             value={activeTab}
//             onValueChange={(value) => setActiveTab(value as "browse" | "dashboard")}
//             className="w-full"
//           >
//             <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
//               <TabsTrigger value="browse" className="flex items-center gap-2">
//                 <Search className="h-4 w-4" />
//                 Browse Templates
//               </TabsTrigger>
//               <TabsTrigger value="dashboard" className="flex items-center gap-2">
//                 <LayoutDashboard className="h-4 w-4" />
//                 My Workflows
//               </TabsTrigger>
//             </TabsList>

//             {/* Browse Templates Tab */}
//             <TabsContent value="browse" className="space-y-6">
//               {/* Search and Filter */}
//               <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
//                 <div className="relative flex-1 max-w-md">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     placeholder="Search workflows..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="pl-10 bg-background border-input"
//                   />
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <Filter className="h-4 w-4 text-muted-foreground" />
//                   <div className="flex flex-wrap gap-2">
//                     {categories.map((category) => (
//                       <Button
//                         key={category.value}
//                         variant={selectedCategory === category.value ? "default" : "outline"}
//                         size="sm"
//                         onClick={() => setSelectedCategory(category.value)}
//                         className="text-xs"
//                       >
//                         {category.label}
//                       </Button>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Templates Grid */}
//               {filteredTemplates.length === 0 ? (
//                 <Card className="border-2 border-border/50">
//                   <CardContent className="p-12 text-center">
//                     <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                     <h3 className="text-xl font-semibold text-card-foreground mb-2">No Templates Found</h3>
//                     <p className="text-muted-foreground">
//                       {searchQuery || selectedCategory !== "all"
//                         ? "Try adjusting your search or filter criteria."
//                         : "No workflow templates are currently available."}
//                     </p>
//                   </CardContent>
//                 </Card>
//               ) : (
//                 <>
//                   <div className="flex items-center justify-between">
//                     <h2 className="text-2xl font-semibold text-card-foreground">
//                       Available Templates ({filteredTemplates.length})
//                     </h2>
//                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                       <CheckCircle className="h-4 w-4 text-primary" />
//                       <span>Ready to configure</span>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {filteredTemplates.map((template) => {
//                       const isConfigured = configuredTemplates.has(template.id)
//                       const isActive = workflowConfigs.some(
//                         (config) => config.templateId === template.id && config.isActive,
//                       )
//                       const isActivating = activatingTemplate === template.id

//                       return (
//                         <Card
//                           key={template.id}
//                           className={`transition-all duration-300 border-2 flex flex-col ${
//                             isActive
//                               ? "border-primary/50 bg-primary/5"
//                               : isConfigured
//                                 ? "border-secondary/50 bg-secondary/5"
//                                 : "border-border/50 hover:border-primary/50 hover:shadow-lg"
//                           }`}
//                         >
//                           <CardHeader className="pb-4">
//                             <div className="flex items-center justify-between">
//                               <div className="flex items-center gap-4">
//                                 <div className="p-3 rounded-xl bg-primary/10 template-icon-container">
//                                   {getCategoryIcon(template.category)}
//                                 </div>
//                                 <div className="flex-1">
//                                   <CardTitle className="text-xl mb-1">{template.name}</CardTitle>
//                                   <CardDescription className="text-sm">{template.category}</CardDescription>
//                                 </div>
//                               </div>
//                               <div className="flex flex-col items-end gap-2">
//                                 <Badge variant="outline" className={getComplexityColor(template.complexity)}>
//                                   {template.complexity}
//                                 </Badge>
//                                 {isActive && (
//                                   <Badge variant="default" className="bg-primary/90 text-primary-foreground">
//                                     <Power className="h-3 w-3 mr-1" />
//                                     Active
//                                   </Badge>
//                                 )}
//                                 {isConfigured && !isActive && (
//                                   <Badge variant="secondary" className="bg-secondary/90 text-secondary-foreground">
//                                     <CheckCircle className="h-3 w-3 mr-1" />
//                                     Configured
//                                   </Badge>
//                                 )}
//                               </div>
//                             </div>
//                           </CardHeader>

//                           <CardContent className="space-y-6 flex-1">
//                             {/* Description */}
//                             <div>
//                               <p className="text-sm text-muted-foreground leading-relaxed">{template.description}</p>
//                             </div>

//                             {/* Key Features */}
//                             {template.features && template.features.length > 0 && (
//                               <div>
//                                 <h4 className="font-semibold text-sm mb-3 text-primary">Key Features:</h4>
//                                 <ul className="space-y-2">
//                                   {template.features.slice(0, 4).map((feature, idx) => (
//                                     <li key={idx} className="flex items-center gap-2 text-sm">
//                                       <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
//                                       <span className="text-muted-foreground">{feature}</span>
//                                     </li>
//                                   ))}
//                                   {template.features.length > 4 && (
//                                     <li className="text-xs text-muted-foreground">
//                                       +{template.features.length - 4} more features
//                                     </li>
//                                   )}
//                                 </ul>
//                               </div>
//                             )}

//                             {/* Required Integrations */}
//                             {template.integrations &&
//                               Array.isArray(template.integrations) &&
//                               template.integrations.length > 0 && (
//                                 <div>
//                                   <h4 className="font-semibold text-sm mb-3 text-primary">Required Integrations:</h4>
//                                   <div className="flex flex-wrap gap-2">
//                                     {template.integrations.slice(0, 4).map((integration: any, idx: number) => (
//                                       <Badge key={idx} variant="secondary" className="text-xs">
//                                         <Zap className="h-3 w-3 mr-1" />
//                                         {typeof integration === "string"
//                                           ? integration
//                                           : integration.name || "Integration"}
//                                       </Badge>
//                                     ))}
//                                     {template.integrations.length > 4 && (
//                                       <Badge variant="secondary" className="text-xs">
//                                         +{template.integrations.length - 4} more
//                                       </Badge>
//                                     )}
//                                   </div>
//                                 </div>
//                               )}

//                             {/* Bottom CTA row */}
//                             <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
//                               <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                                 <Clock className="h-4 w-4" />
//                                 <span>{template.estimatedSetupTime} min setup</span>
//                               </div>

//                               {/* Action Buttons */}
//                               <div className="flex gap-2">
//                                 {isActive ? (
//                                   <Button
//                                     size="sm"
//                                     variant="outline"
//                                     className="text-primary border-primary/50 bg-transparent"
//                                   >
//                                     <Power className="h-3 w-3 mr-1" />
//                                     Active
//                                   </Button>
//                                 ) : isConfigured ? (
//                                   <Button
//                                     size="sm"
//                                     onClick={() => handleActivateConfiguredTemplate(template)}
//                                     disabled={isActivating || !businessDetails}
//                                     className="bg-primary hover:bg-primary/90"
//                                   >
//                                     {isActivating ? (
//                                       <Loader2 className="h-3 w-3 mr-1 animate-spin" />
//                                     ) : (
//                                       <Power className="h-3 w-3 mr-1" />
//                                     )}
//                                     Activate Now
//                                   </Button>
//                                 ) : (
//                                   <Button
//                                     size="sm"
//                                     variant="outline"
//                                     onClick={() => handleConfigureTemplate(template)}
//                                     disabled={!businessDetails}
//                                   >
//                                     <Settings className="h-3 w-3 mr-1" />
//                                     Configure
//                                   </Button>
//                                 )}
//                               </div>
//                             </div>
//                           </CardContent>
//                         </Card>
//                       )
//                     })}
//                   </div>
//                 </>
//               )}
//             </TabsContent>

//             {/* Dashboard Tab */}
//             <TabsContent value="dashboard" className="space-y-6">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-2xl font-semibold text-card-foreground">My Active Workflows</h2>
//                 <Button onClick={handleRefresh} disabled={refreshing} variant="outline">
//                   <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
//                   Refresh
//                 </Button>
//               </div>

//               {/* Stats Overview */}
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//                 <Card className="border-2 border-border/50">
//                   <CardContent className="p-6">
//                     <div className="flex items-center gap-4">
//                       <div className="p-3 bg-primary/10 rounded-lg">
//                         <Activity className="h-6 w-6 text-primary" />
//                       </div>
//                       <div>
//                         <p className="text-2xl font-bold text-card-foreground">
//                           {workflowConfigs.filter((w) => w.isActive).length}
//                         </p>
//                         <p className="text-sm text-muted-foreground">Active Workflows</p>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card className="border-2 border-border/50">
//                   <CardContent className="p-6">
//                     <div className="flex items-center gap-4">
//                       <div className="p-3 bg-secondary/10 rounded-lg">
//                         <Zap className="h-6 w-6 text-secondary-foreground" />
//                       </div>
//                       <div>
//                         <p className="text-2xl font-bold text-card-foreground">
//                           {workflowConfigs.reduce((acc, w) => acc + (w.credentials?.length || 0), 0)}
//                         </p>
//                         <p className="text-sm text-muted-foreground">Integrations</p>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card className="border-2 border-border/50">
//                   <CardContent className="p-6">
//                     <div className="flex items-center gap-4">
//                       <div className="p-3 bg-accent/10 rounded-lg">
//                         <BarChart3 className="h-6 w-6 text-accent-foreground" />
//                       </div>
//                       <div>
//                         <p className="text-2xl font-bold text-card-foreground">98%</p>
//                         <p className="text-sm text-muted-foreground">Success Rate</p>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card className="border-2 border-border/50">
//                   <CardContent className="p-6">
//                     <div className="flex items-center gap-4">
//                       <div className="p-3 bg-muted/10 rounded-lg">
//                         <Clock className="h-6 w-6 text-muted-foreground" />
//                       </div>
//                       <div>
//                         <p className="text-2xl font-bold text-card-foreground">2.3s</p>
//                         <p className="text-sm text-muted-foreground">Avg Response</p>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>

//               {/* Workflows List */}
//               {workflowConfigs.length === 0 ? (
//                 <Card className="border-2 border-border/50">
//                   <CardContent className="p-12 text-center">
//                     <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                     <h3 className="text-xl font-semibold text-card-foreground mb-2">No Active Workflows</h3>
//                     <p className="text-muted-foreground mb-6">
//                       You haven&apos;t activated any workflows yet. Browse our template library to get started.
//                     </p>
//                     <Button onClick={() => setActiveTab("browse")}>
//                       <Zap className="h-4 w-4 mr-2" />
//                       Browse Templates
//                     </Button>
//                   </CardContent>
//                 </Card>
//               ) : (
//                 <div className="space-y-6">
//                   {workflowConfigs.map((config) => (
//                     <Card
//                       key={config.id}
//                       className="border-2 border-border/50 hover:shadow-lg transition-all duration-300"
//                     >
//                       <CardHeader>
//                         <div className="flex items-start justify-between">
//                           <div className="flex-1">
//                             <CardTitle className="text-xl text-card-foreground">
//                               {config.workflowTemplate?.name || "Custom Workflow"}
//                             </CardTitle>
//                             <CardDescription className="mt-2 text-muted-foreground">
//                               {config.workflowTemplate?.description ||
//                                 config.customRequest ||
//                                 "No description available"}
//                             </CardDescription>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <Badge variant="outline" className={getStatusColor(config.status)}>
//                               {config.isActive ? (
//                                 <>
//                                   <CheckCircle className="h-3 w-3 mr-1" />
//                                   Active
//                                 </>
//                               ) : (
//                                 <>
//                                   <AlertTriangle className="h-3 w-3 mr-1" />
//                                   {config.status}
//                                 </>
//                               )}
//                             </Badge>
//                           </div>
//                         </div>
//                       </CardHeader>

//                       <CardContent className="space-y-6">
//                         {/* Workflow Details */}
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                           <div>
//                             <h4 className="font-semibold text-sm mb-2 text-card-foreground">Category</h4>
//                             <p className="text-sm text-muted-foreground">
//                               {config.workflowTemplate?.category || "Custom"}
//                             </p>
//                           </div>
//                           <div>
//                             <h4 className="font-semibold text-sm mb-2 text-card-foreground">Complexity</h4>
//                             <p className="text-sm text-muted-foreground">
//                               {config.workflowTemplate?.complexity || "Medium"}
//                             </p>
//                           </div>
//                           <div>
//                             <h4 className="font-semibold text-sm mb-2 text-card-foreground">Created</h4>
//                             <p className="text-sm text-muted-foreground">
//                               {new Date(config.createdAt).toLocaleDateString()}
//                             </p>
//                           </div>
//                         </div>

//                         <Separator />

//                         {/* Integrations */}
//                         {config.credentials && config.credentials.length > 0 && (
//                           <div>
//                             <h4 className="font-semibold text-sm mb-3 text-card-foreground">Connected Integrations</h4>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                               {config.credentials.map((credential) => (
//                                 <div key={credential.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
//                                   <div className="p-2 bg-primary/10 rounded">
//                                     <Zap className="h-4 w-4 text-primary" />
//                                   </div>
//                                   <div className="flex-1">
//                                     <p className="font-medium text-sm text-card-foreground">
//                                       {credential.integrationName}
//                                     </p>
//                                     <p className="text-xs text-muted-foreground">
//                                       {credential.isActive ? "Connected" : "Disconnected"} • Last verified:{" "}
//                                       {credential.createdAt
//                                         ? new Date(credential.createdAt).toLocaleDateString()
//                                         : "Never"}
//                                     </p>
//                                   </div>
//                                   <div className="flex items-center">
//                                     {credential.isActive ? (
//                                       <CheckCircle className="h-4 w-4 text-primary" />
//                                     ) : (
//                                       <AlertTriangle className="h-4 w-4 text-destructive" />
//                                     )}
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         )}

//                         {/* Actions */}
//                         <div className="flex items-center gap-3 pt-4 border-t border-border">
//                           <Button variant="outline" size="sm">
//                             <Settings className="h-4 w-4 mr-2" />
//                             Configure
//                           </Button>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => handleDeactivateWorkflow(config)}
//                             className="text-destructive hover:text-destructive"
//                           >
//                             <PowerOff className="h-4 w-4 mr-2" />
//                             Deactivate
//                           </Button>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               )}
//             </TabsContent>
//           </Tabs>

//           {/* Credentials Dialog */}
//           <Dialog open={showCredentialsDialog} onOpenChange={setShowCredentialsDialog}>
//             <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
//               <DialogHeader>
//                 <DialogTitle className="text-card-foreground">Configure {selectedTemplate?.name}</DialogTitle>
//                 <DialogDescription className="text-muted-foreground">
//                   Please provide the required credentials for the integrations used by this workflow.
//                 </DialogDescription>
//               </DialogHeader>

//               <div className="space-y-6 py-4">
//                 {selectedTemplate?.integrations.map((integration: Integration, integrationIdx: number) => (
//                   <div key={integrationIdx} className="space-y-4">
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 bg-primary/10 rounded-lg">
//                         <Zap className="h-5 w-5 text-primary" />
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-card-foreground">{integration.name}</h3>
//                         <p className="text-sm text-muted-foreground">{integration.description}</p>
//                       </div>
//                     </div>

//                     {integration.credentialInstructions && (
//                       <div className="bg-muted/50 p-3 rounded-lg">
//                         <h4 className="font-medium text-sm mb-2 text-card-foreground">Setup Instructions:</h4>
//                         <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
//                           {integration.credentialInstructions}
//                         </p>
//                       </div>
//                     )}

//                     <div className="grid gap-4">
//                       {integration.credentialFields?.map((field: CredentialField, fieldIdx: number) => {
//                         const fieldKey = `${integration.name}-${field.name}`
//                         const isPassword = field.type === "password"
//                         const showPassword = showPasswords[fieldKey]
//                         const fieldValue = credentialsEnhanced[integration.name]?.[field.name] || ""
//                         const inputType = isPassword && !showPassword ? "password" : field.type
//                         const placeholder = field.placeholder || `Enter ${field.label.toLowerCase()}`

//                         return (
//                           <div key={fieldIdx} className="space-y-2">
//                             <Label htmlFor={fieldKey} className="text-sm font-medium text-card-foreground">
//                               {field.label}
//                               {field.required && <span className="text-destructive ml-1">*</span>}
//                             </Label>

//                             <div className="relative">
//                               <Input
//                                 id={fieldKey}
//                                 type={inputType}
//                                 value={fieldValue}
//                                 onChange={(e) =>
//                                   handleCredentialChangeEnhanced(integration.name, field.name, e.target.value)
//                                 }
//                                 placeholder={placeholder}
//                                 required={field.required}
//                                 className="bg-background border-input text-foreground pr-10"
//                               />

//                               {isPassword && (
//                                 <Button
//                                   type="button"
//                                   variant="ghost"
//                                   size="icon"
//                                   className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-muted"
//                                   onClick={() => togglePasswordVisibility(fieldKey)}
//                                   aria-label={showPassword ? "Hide password" : "Show password"}
//                                 >
//                                   {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                                 </Button>
//                               )}
//                             </div>

//                             {field.helpText && <p className="text-xs text-muted-foreground">{field.helpText}</p>}

//                             <div className="flex items-center gap-2">
//                               <Button
//                                 type="button"
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() =>
//                                   testCredentials(integration.name, credentialsEnhanced[integration.name] || {})
//                                 }
//                                 disabled={testingCredentials[`${integration.name}-test`] || !fieldValue}
//                                 className="text-xs"
//                               >
//                                 {testingCredentials[`${integration.name}-test`] ? (
//                                   <Loader2 className="h-3 w-3 mr-1 animate-spin" />
//                                 ) : (
//                                   <CheckCircle className="h-3 w-3 mr-1" />
//                                 )}
//                                 Test Connection
//                               </Button>

//                               {credentialTestResults[`${integration.name}-test`] && (
//                                 <Badge
//                                   variant={
//                                     credentialTestResults[`${integration.name}-test`].success
//                                       ? "default"
//                                       : "destructive"
//                                   }
//                                   className="text-xs"
//                                 >
//                                   {credentialTestResults[`${integration.name}-test`].success ? "Valid" : "Invalid"}
//                                 </Badge>
//                               )}
//                             </div>
//                           </div>
//                         )
//                       })}
//                     </div>

//                     {integrationIdx < (selectedTemplate?.integrations.length || 0) - 1 && (
//                       <Separator className="my-6" />
//                     )}
//                   </div>
//                 ))}
//               </div>

//               <DialogFooter>
//                 <Button variant="outline" onClick={() => setShowCredentialsDialog(false)}>
//                   Cancel
//                 </Button>
//                 <Button onClick={handleSubmitCredentials}>
//                   <Settings className="h-4 w-4 mr-2" />
//                   Configure Template
//                 </Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>

//           {/* Deactivate Confirmation Dialog */}
//           <Dialog open={!!showDeactivateDialog} onOpenChange={() => setShowDeactivateDialog(null)}>
//             <DialogContent>
//               <DialogHeader>
//                 <DialogTitle className="flex items-center gap-2 text-destructive">
//                   <AlertTriangle className="h-6 w-6" />
//                   Confirm Deactivation
//                 </DialogTitle>
//                 <DialogDescription>
//                   Are you sure you want to deactivate &ldquo;
//                   {showDeactivateDialog?.workflowTemplate?.name || "this workflow"}
//                   &rdquo;? This will stop all automated responses. You can reconfigure and reactivate it later.
//                 </DialogDescription>
//               </DialogHeader>
//               <DialogFooter>
//                 <Button variant="outline" onClick={() => setShowDeactivateDialog(null)}>
//                   Cancel
//                 </Button>
//                 <Button variant="destructive" onClick={confirmDeactivateWorkflow}>
//                   <PowerOff className="h-4 w-4 mr-2" />
//                   Deactivate Workflow
//                 </Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>
//         </div>
//       </div>
//     )
//   }

//   // Configuration step for template workflows
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
//                   Configure Your{" "}
//                   {isDefaultWorkflow ? "Default CRM" : selectedTemplate ? selectedTemplate.name : "Custom"} Workflow
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

//               <Card className="glassEffect border-2 card-border-customer-support">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     {isDefaultWorkflow ? (
//                       <Database className="h-5 w-5 text-chart-1" />
//                     ) : (
//                       getCategoryIcon(selectedTemplate?.category || "")
//                     )}
//                     {isDefaultWorkflow ? "Default CRM Workflow Overview" : `${selectedTemplate?.name} Overview`}
//                   </CardTitle>
//                   <CardDescription>
//                     {isDefaultWorkflow
//                       ? "Here's what your default workflow will include"
//                       : `Here's what your ${selectedTemplate?.name} workflow will include`}
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-6">
//                     <div>
//                       <h4 className="font-semibold mb-4 text-primary flex items-center gap-2">
//                         <Sparkles className="h-4 w-4" />
//                         Process Flow:
//                       </h4>
//                       <div className="space-y-3">
//                         {(isDefaultWorkflow
//                           ? [
//                               "Receive Instagram DM",
//                               "AI lead qualification",
//                               "Collect contact information",
//                               "Send to your CRM",
//                               "Notify your team",
//                             ]
//                           : selectedTemplate?.operations || ["Automated workflow execution"]
//                         ).map((operation, idx) => (
//                           <div key={idx} className="flex items-center gap-4">
//                             <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-semibold">
//                               {idx + 1}
//                             </div>
//                             <span className="text-sm font-medium">{operation}</span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     <div>
//                       <h4 className="font-semibold mb-4 text-primary">Key Features:</h4>
//                       <ul className="space-y-3">
//                         {(isDefaultWorkflow
//                           ? [
//                               "Instant lead qualification",
//                               "Automatic CRM integration",
//                               "Smart conversation handling",
//                               "Lead scoring & prioritization",
//                               "Human handoff when needed",
//                               "Real-time notifications",
//                             ]
//                           : selectedTemplate?.features || ["Advanced automation capabilities"]
//                         ).map((feature, idx) => (
//                           <li key={idx} className="flex items-center gap-3 text-sm">
//                             <CheckCircle className="h-4 w-4 text-chart-2 flex-shrink-0" />
//                             <span>{feature}</span>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>

//                     {/* Show integrations for template workflows */}
//                     {!isDefaultWorkflow &&
//                       selectedTemplate?.integrations &&
//                       Array.isArray(selectedTemplate.integrations) &&
//                       selectedTemplate.integrations.length > 0 && (
//                         <div>
//                           <h4 className="font-semibold mb-4 text-primary">Required Integrations:</h4>
//                           <div className="space-y-2">
//                             {selectedTemplate.integrations.map((integration: any, idx: number) => (
//                               <div key={idx} className="flex items-center gap-3 p-3 bg-chart-2/10 rounded-lg">
//                                 <Zap className="h-4 w-4 text-chart-2" />
//                                 <span className="text-sm font-medium">
//                                   {typeof integration === "string" ? integration : integration.name || "Integration"}
//                                 </span>
//                                 <Badge variant="outline" className="ml-auto text-xs text-chart-2 border-chart-2/20">
//                                   Required
//                                 </Badge>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}

//                     {/* Show CRM integrations for default workflow */}
//                     {isDefaultWorkflow && (
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
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
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
//                       {isDefaultWorkflow ? "Default CRM Workflow" : selectedTemplate?.name || "Custom Workflow Request"}
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
//                       {isDefaultWorkflow
//                         ? "Immediate activation"
//                         : selectedTemplate?.estimatedSetupTime
//                           ? `${selectedTemplate.estimatedSetupTime} minutes`
//                           : "3-5 business days"}
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="glassEffect border-2 border-border/50">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Database className="h-5 w-5 text-primary" />
//                     {isDefaultWorkflow ? "CRM Integration" : "Template Integration"}
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-3">
//                     {isDefaultWorkflow
//                       ? crmIntegrations
//                           .filter((crm) => crm.isActive)
//                           .map((crm) => (
//                             <div key={crm.id} className="flex items-center gap-3 p-3 bg-chart-2/10 rounded-lg">
//                               <CheckCircle className="h-4 w-4 text-chart-2" />
//                               <div className="flex-1">
//                                 <span className="text-sm font-medium">{crm.provider}</span>
//                                 <p className="text-xs text-muted-foreground">
//                                   Connected on {new Date(crm.createdAt).toLocaleDateString()}
//                                 </p>
//                               </div>
//                               <Badge variant="outline" className="text-xs text-chart-2 border-chart-2/20">
//                                 Active
//                               </Badge>
//                             </div>
//                           ))
//                       : selectedTemplate?.integrations?.map((integration: any, idx: number) => (
//                           <div key={idx} className="flex items-center gap-3 p-3 bg-chart-2/10 rounded-lg">
//                             <Zap className="h-4 w-4 text-chart-2" />
//                             <div className="flex-1">
//                               <span className="text-sm font-medium">
//                                 {typeof integration === "string" ? integration : integration.name || "Integration"}
//                               </span>
//                               <p className="text-xs text-muted-foreground">Ready to configure</p>
//                             </div>
//                             <Badge variant="outline" className="text-xs text-chart-2 border-chart-2/20">
//                               Required
//                             </Badge>
//                           </div>
//                         ))}
//                   </div>
//                   <div className="mt-4 text-sm text-muted-foreground">
//                     {isDefaultWorkflow
//                       ? "Your CRM credentials will be automatically used by the workflow to send qualified leads."
//                       : "Template integrations will be configured during the setup process."}
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
//                         Your template workflow will be configured and activated.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Integration credentials will be set up during the process.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         You can return to this page anytime to check the status of your workflow.
//                       </li>
//                       <li className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-primary"></div>
//                         Once complete, your automation will be available in your dashboard.
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
//                 {isDefaultWorkflow
//                   ? "Activate Workflow 🚀"
//                   : selectedTemplate
//                     ? "Configure & Activate 🚀"
//                     : "Submit for Development 🚀"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // Legacy workflow configuration view
//   if (isConfiguring) {
//     return (
//       <>
//         <Card className="w-full max-w-3xl mx-auto">
//           <CardHeader>
//             <CardTitle>Select a Workflow Template</CardTitle>
//             <CardDescription>Choose from our pre-built templates or custom solutions.</CardDescription>
//           </CardHeader>
//           <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {templates.length === 0 ? (
//               <div className="col-span-full text-center py-8 text-muted-foreground">No templates available yet.</div>
//             ) : (
//               templates.map((template) => (
//                 <Card
//                   key={template.id}
//                   className="cursor-pointer hover:shadow-lg transition-shadow"
//                   onClick={() => handleSelectTemplate(template)}
//                 >
//                   <CardHeader>
//                     <CardTitle className="text-lg">{template.name}</CardTitle>
//                     <CardDescription>{template.category}</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
//                     <div className="mt-3 flex flex-wrap gap-2">
//                       <Badge variant="secondary">{template.complexity}</Badge>
//                       {template.isPublic ? (
//                         <Badge
//                           variant="outline"
//                           className="bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-300"
//                         >
//                           <Globe className="h-3 w-3 mr-1" /> Public
//                         </Badge>
//                       ) : (
//                         <Badge
//                           variant="outline"
//                           className="bg-orange-50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-300"
//                         >
//                           <Lock className="h-3 w-3 mr-1" /> Private
//                         </Badge>
//                       )}
//                       {template.integrations && template.integrations.length > 0 && (
//                         <Badge variant="outline">
//                           <Zap className="h-3 w-3 mr-1" /> {template.integrations.length} Integrations
//                         </Badge>
//                       )}
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))
//             )}
//           </CardContent>
//         </Card>

//         <Dialog open={isCredentialDialogOpen} onOpenChange={setIsCredentialDialogOpen}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Enter Credentials for {selectedTemplate?.name}</DialogTitle>
//               <DialogDescription>
//                 Please provide the necessary API keys or tokens for this workflow&apos;s integrations.
//               </DialogDescription>
//             </DialogHeader>
//             <div className="space-y-4 py-4">
//               {selectedTemplate?.integrations && Array.isArray(selectedTemplate.integrations) ? (
//                 selectedTemplate.integrations.map((integration, index) => (
//                   <div key={index}>
//                     <Label htmlFor={`integration-${index}`}>
//                       {typeof integration === "string" ? integration : integration.name || `Integration ${index + 1}`}{" "}
//                       API Key
//                     </Label>
//                     <Input
//                       id={`integration-${index}`}
//                       type="password"
//                       value={credentials[typeof integration === "string" ? integration : integration.name] || ""}
//                       onChange={(e) =>
//                         handleCredentialChange(
//                           typeof integration === "string" ? integration : integration.name,
//                           e.target.value,
//                         )
//                       }
//                       placeholder={`Enter ${typeof integration === "string" ? integration : integration.name} API Key`}
//                     />
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-sm text-muted-foreground">No integrations configured for this template.</p>
//               )}
//             </div>
//             <DialogFooter>
//               <Button variant="outline" onClick={() => setIsCredentialDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button onClick={handleCreateWorkflowConfig} disabled={submittingCredentials}>
//                 {submittingCredentials ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Activating...
//                   </>
//                 ) : (
//                   "Activate Workflow"
//                 )}
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </>
//     )
//   }

//   // Default workflow list view
//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h2 className="text-3xl font-bold">Your Active Workflows</h2>
//         <Button onClick={() => setIsConfiguring(true)}>
//           <Plus className="mr-2 h-4 w-4" />
//           Add New Workflow
//         </Button>
//       </div>

//       {workflowConfigs.length === 0 ? (
//         <Card className="text-center py-12">
//           <CardContent>
//             <p className="text-lg text-muted-foreground mb-4">You don&apos;t have any active workflows yet.</p>
//             <Button onClick={() => setIsConfiguring(true)}>
//               <Plus className="mr-2 h-4 w-4" />
//               Start Your First Workflow
//             </Button>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {workflowConfigs.map((config) => (
//             <Card
//               key={config.id}
//               className="cursor-pointer hover:shadow-lg transition-shadow"
//               onClick={() => onWorkflowSelected && onWorkflowSelected(config)}
//             >
//               <CardHeader>
//                 <CardTitle className="text-xl">{config.workflowTemplate?.name || "Custom Workflow"}</CardTitle>
//                 <CardDescription>
//                   {config.workflowTemplate?.description || config.customRequest || "No description provided."}
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center justify-between text-sm text-muted-foreground">
//                   <div className="flex items-center gap-2">
//                     {config.isActive ? (
//                       <CheckCircle className="h-4 w-4 text-green-500" />
//                     ) : (
//                       <XCircle className="h-4 w-4 text-red-500" />
//                     )}
//                     <span>{config.isActive ? "Active" : "Inactive"}</span>
//                   </div>
//                   <Badge variant="outline">{config.status}</Badge>
//                 </div>
//                 <div className="mt-4 space-y-2">
//                   {config.credentials && config.credentials.length > 0 ? (
//                     config.credentials.map((cred) => (
//                       <div key={cred.id} className="flex items-center gap-2 text-xs text-muted-foreground">
//                         <SettingsIcon className="h-3 w-3" />
//                         <span>
//                           {cred.integrationName} ({cred.integrationType}) -{" "}
//                           {cred.isActive ? "Connected" : "Disconnected"}
//                         </span>
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-xs text-muted-foreground">No credentials configured.</p>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
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
import {
  Search,
  Filter,
  Sparkles,
  Loader2,
  AlertTriangle,
  LayoutDashboard,
  Zap,
  Clock,
  CheckCircle,
  Settings,
  BarChart3,
  Eye,
  EyeOff,
  RefreshCw,
  Activity,
  ExternalLink,
  Power,
  PowerOff,
  Database,
  SettingsIcon,
  ListChecks,
  Users,
  ArrowLeft,
  Plus,
  Globe,
  Lock,
  XCircle,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import WorkflowDashboard from "./workflow-dashboard"
import CustomWorkflowBuilder from "./custom-workflow-builder"
import WorkflowPendingPage from "./workflow-pending-page"
import UserWorkflowProgress from "./user-workflow-progress"
import PaymentPopup from "@/components/global/stripe/payment-popup"
import { useSubscription } from "@/contexts/subscription-context"
import type {
  BusinessWorkflowConfig,
  PendingWorkflowData,
  CRMIntegration,
  CustomWorkflowRequest,
} from "@/types/workflow"

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

interface Integration {
  id: string
  name: string
  description: string
  category: string
  pricing: string
  logoUrl?: string
  credentialFields: CredentialField[]
  credentialInstructions: string
}

interface CredentialField {
  name: string
  label: string
  type: "text" | "password" | "email" | "url"
  required: boolean
  placeholder?: string
  helpText?: string
}

interface WorkflowTemplate {
  id: string
  name: string
  category: string
  description: string
  complexity: "LOW" | "MEDIUM" | "HIGH" | "SIMPLE" | "COMPLEX"
  estimatedSetupTime: number
  operations: string[]
  features: string[]
  integrations: Integration[] | any[]
  commonUseCase?: string
  isActive: boolean
  isPublic: boolean
  workflowDesign?: any
  createdByAdmin?: boolean
  voiceflowProjectId?: string
  voiceflowVersionId?: string
  createdAt: Date | string
  updatedAt: Date | string
  publishedAt?: Date
}

interface WorkflowConfig {
  id: string
  userId: string
  businessId: string
  workflowTemplateId?: string
  workflowTemplate?: WorkflowTemplate
  businessInfo: any
  integrationConfigs: any[]
  customRequest?: string
  status: "DRAFT" | "CONFIGURING" | "ACTIVE" | "INACTIVE" | "CUSTOM_REQUEST" | "PENDING_CREATION"
  isActive: boolean
  credentials: WorkflowCredential[]
  createdAt: Date | string
  updatedAt: Date | string
}

interface WorkflowCredential {
  id: string
  workflowConfigId: string
  integrationName: string
  integrationType: string
  encryptedCredentials: string
  isActive: boolean
  lastVerified?: Date
  createdAt: Date
  updatedAt: Date
}

interface BusinessDetails {
  id: string
  businessName: string
  businessType: string
  businessDescription: string
  industry: string
  targetAudience: string
  website: string
  instagramHandle: string
  whatsappNumber?: string
  welcomeMessage: string
  responseLanguage: string
  businessHours: string
  location?: string
  size?: string
  logo?: string
}

interface EnhancedWorkflowSelectorProps {
  userId: string
  businessId: string
  onWorkflowSelected?: (workflowConfig: BusinessWorkflowConfig) => void
}

export default function EnhancedWorkflowSelector({
  userId,
  businessId,
  onWorkflowSelected,
}: EnhancedWorkflowSelectorProps) {
  // All state from original component
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

  // Add default workflow status state
  const [defaultWorkflowStatus, setDefaultWorkflowStatus] = useState<"active" | "deactivated">("active")

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
  const currentUserId = userId || "user_clerk_id_placeholder"

  const [workflowConfigs, setWorkflowConfigs] = useState<BusinessWorkflowConfig[]>([])
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [isConfiguring, setIsConfiguring] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null)
  const [isCredentialDialogOpen, setIsCredentialDialogOpen] = useState(false)
  const [credentials, setCredentials] = useState<Record<string, string>>({})
  const [submittingCredentials, setSubmittingCredentials] = useState(false)

  // Enhanced workflow selector specific state
  const [activeTab, setActiveTab] = useState<"browse" | "dashboard">("browse")
  const [filteredTemplates, setFilteredTemplates] = useState<WorkflowTemplate[]>([])
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails | null>(null)
  const [businessLoading, setBusinessLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [activatingTemplate, setActivatingTemplate] = useState<string | null>(null)
  const [showCredentialsDialog, setShowCredentialsDialog] = useState(false)
  const [credentialsEnhanced, setCredentialsEnhanced] = useState<Record<string, Record<string, string>>>({})
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
  const [refreshing, setRefreshing] = useState(false)
  const [configuredTemplates, setConfiguredTemplates] = useState<Set<string>>(new Set())
  // const [showDeactivateDialog, setShowDeactivateDialog] = useState<WorkflowConfig | null>(null)
  const [showDeactivateDialog, setShowDeactivateDialog] = useState<WorkflowConfig | BusinessWorkflowConfig | null>(null)

  const categories = [
    { value: "all", label: "All Templates" },
    { value: "AI_ASSISTANT", label: "AI Assistant" },
    { value: "SALES", label: "Sales" },
    { value: "MARKETING", label: "Marketing" },
    { value: "SUPPORT", label: "Support" },
    { value: "CUSTOM", label: "Custom" },
  ]

  // Fetch active workflow and CRM integrations (from original)
  useEffect(() => {
    const fetchWorkflowStatus = async () => {
      setIsFetchingActiveWorkflow(true)
      setIsFetchingCRM(true)

      try {
        if (!currentUserId) {
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
            setStep("progress")
          }
        } else {
          console.error("Failed to fetch user workflow requests:", await userRequestsResponse.text())
        }

        // Check for pending workflow in localStorage first
        const storedPending = localStorage.getItem("pendingWorkflow")
        if (storedPending) {
          const pendingData: PendingWorkflowData = JSON.parse(storedPending)

          const statusResponse = await fetch(`/api/workflow-config/${pendingData.id}`)
          if (statusResponse.ok) {
            const statusData = await statusResponse.json()

            if (statusData.status === "ACTIVE") {
              localStorage.removeItem("pendingWorkflow")
              setActiveWorkflowExists(true)
              setActiveWorkflowDetails(statusData)
              setWorkflowCreationStatus("completed")
              setStep("dashboard")
            } else if (statusData.status === "PENDING_CREATION") {
              setPendingWorkflowData(pendingData)
              setWorkflowCreationStatus("in-progress")
              setStep("pending")
            } else {
              localStorage.removeItem("pendingWorkflow")
            }
          } else {
            localStorage.removeItem("pendingWorkflow")
          }
        }

        // Fetch active workflows and CRM integrations in parallel
        const [workflowResponse, crmResponse] = await Promise.all([
          fetch(`/api/workflow-config?businessId=${currentUserId}&status=ACTIVE`),
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

            const isCustomWorkflowActive =
              activeConfig.workflowTemplateId && activeConfig.workflowTemplate?.createdByAdmin

            if (isCustomWorkflowActive) {
              setDefaultWorkflowStatus("deactivated")
            }

            if (step !== "pending" && step !== "progress") {
              setStep("dashboard")
            }
          } else {
            setActiveWorkflowExists(false)
            setActiveWorkflowDetails(null)
            setDefaultWorkflowStatus("active")
          }
        }

        // Handle CRM response
        if (crmResponse.ok) {
          const crmData = await crmResponse.json()
          setCrmIntegrations(crmData.integrations || [])

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
                  businessId: currentUserId,
                  businessInfo: {
                    businessName: "Auto-activated Business",
                    businessType: "Service Business",
                    description: "Auto-activated default workflow",
                  },
                  integrations: [],
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
  }, [currentUserId, activeWorkflowExists, hasPendingCustomWorkflow, step])

  useEffect(() => {
    fetchWorkflows()
    fetchTemplates()
    fetchBusinessDetails()
  }, [businessId])

  useEffect(() => {
    filterTemplates()
  }, [templates, searchQuery, selectedCategory])

  const fetchBusinessDetails = async () => {
    setBusinessLoading(true)
    try {
      const response = await fetch(`/api/business/${businessId}`)
      if (response.ok) {
        const data = await response.json()
        setBusinessDetails(data.business)
      } else if (response.status === 404) {
        setBusinessDetails(null)
      } else {
        throw new Error("Failed to fetch business details")
      }
    } catch (error) {
      console.error("Error fetching business details:", error)
      toast({
        title: "Error",
        description: "Failed to fetch business details",
        variant: "destructive",
      })
    } finally {
      setBusinessLoading(false)
    }
  }

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
      setLoading(true)
      const response = await fetch("/api/workflow-templates?published=true")
      const data = await response.json()

      if (response.ok) {
        const publishedTemplates =
          data.templates?.filter((template: any) => template.isActive && template.isPublic) || []
        setTemplates(publishedTemplates)
      } else {
        console.error("Failed to fetch templates:", data.error)
        toast({
          title: "Error",
          description: "Failed to load workflow templates",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching templates:", error)
      toast({
        title: "Error",
        description: "Failed to load workflow templates",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterTemplates = () => {
    let filtered = templates

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (template) =>
          template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((template) => template.category === selectedCategory)
    }

    setFilteredTemplates(filtered)
  }

  // All handler functions from original component
  const handleSelectTemplate = (template: WorkflowTemplate) => {
    setSelectedTemplate(template)
    setIsDefaultWorkflow(false)
    setIsCustomWorkflow(false)
    setStep("configuration")
  }

  const handleConfigureTemplate = (template: WorkflowTemplate) => {
    if (!businessDetails) {
      toast({
        title: "Business Details Required",
        description: "Please complete your business profile first to configure workflows.",
        variant: "destructive",
      })
      return
    }

    const hasActiveWorkflow = workflowConfigs.some((config) => config.isActive)
    if (hasActiveWorkflow) {
      toast({
        title: "Active Workflow Exists",
        description: "Please deactivate your current workflow before configuring a new one.",
        variant: "destructive",
      })
      return
    }

    setSelectedTemplate(template)
    if (template.integrations && template.integrations.length > 0) {
      const initialCredentials: Record<string, Record<string, string>> = {}

      template.integrations.forEach((integration: Integration) => {
        initialCredentials[integration.name] = {}
        integration.credentialFields?.forEach((field: CredentialField) => {
          initialCredentials[integration.name][field.name] = ""
        })
      })

      setCredentialsEnhanced(initialCredentials)
      setShowCredentialsDialog(true)
    } else {
      activateWorkflow(template, {})
    }
  }

  const handleCreateWorkflowConfig = async () => {
    if (!selectedTemplate) return

    setSubmittingCredentials(true)
    try {
      const configResponse = await fetch("/api/workflow-configs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId,
          workflowTemplateId: selectedTemplate.id,
        }),
      })

      if (!configResponse.ok) {
        const errorData = await configResponse.json()
        throw new Error(errorData.message || "Failed to create workflow configuration.")
      }

      const newWorkflowConfig = await configResponse.json()
      const workflowConfigId = newWorkflowConfig.workflowConfig.id

      const credentialResponse = await fetch(`/api/workflow-configs/${workflowConfigId}/credentials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credentials }),
      })

      if (!credentialResponse.ok) {
        const errorData = await credentialResponse.json()
        throw new Error(errorData.message || "Failed to save credentials.")
      }

      setDefaultWorkflowStatus("deactivated")

      toast({
        title: "Workflow Activated!",
        description: `${selectedTemplate.name} is now active. Default workflow has been deactivated.`,
        variant: "default",
      })
      setIsCredentialDialogOpen(false)
      setIsConfiguring(false)
      fetchWorkflows()
      if (onWorkflowSelected) {
        onWorkflowSelected(newWorkflowConfig.workflowConfig)
      }
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

  const activateWorkflow = async (template: WorkflowTemplate, creds: Record<string, Record<string, string>>) => {
    if (!businessDetails) {
      toast({
        title: "Business Details Required",
        description: "Business details are required to activate workflows.",
        variant: "destructive",
      })
      return
    }

    setActivatingTemplate(template.id)

    try {
      // First deactivate any existing active workflows
      const activeConfigs = workflowConfigs.filter((config) => config.isActive)
      for (const activeConfig of activeConfigs) {
        await fetch("/api/workflow-configs", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: activeConfig.id,
            isActive: false,
            status: "INACTIVE",
          }),
        })
      }

      // Create workflow configuration
      const configResponse = await fetch("/api/workflow-configs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowTemplateId: template.id,
          businessId,
          businessInfo: {
            businessName: businessDetails.businessName,
            businessType: businessDetails.businessType,
            description: businessDetails.businessDescription,
            industry: businessDetails.industry,
            targetAudience: businessDetails.targetAudience,
            website: businessDetails.website,
            instagramHandle: businessDetails.instagramHandle,
            whatsappNumber: businessDetails.whatsappNumber,
            welcomeMessage: businessDetails.welcomeMessage,
            responseLanguage: businessDetails.responseLanguage,
            businessHours: businessDetails.businessHours,
            location: businessDetails.location,
            size: businessDetails.size,
          },
          status: "ACTIVE",
          isActive: true,
        }),
      })

      if (!configResponse.ok) {
        throw new Error("Failed to create workflow configuration")
      }

      const configData = await configResponse.json()
      const workflowConfigId = configData.workflowConfig.id

      // Save credentials for each integration
      for (const [integrationName, integrationCreds] of Object.entries(creds)) {
        if (Object.keys(integrationCreds).length > 0) {
          const credResponse = await fetch(`/api/workflow-configs/${workflowConfigId}/credentials`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              integrationName,
              credentials: integrationCreds,
            }),
          })

          if (!credResponse.ok) {
            console.warn(`Failed to save credentials for ${integrationName}`)
          }
        }
      }

      toast({
        title: "Workflow Activated!",
        description: `${template.name} is now active. Any previous workflows have been deactivated.`,
        variant: "default",
      })

      setShowCredentialsDialog(false)
      setConfiguredTemplates((prev) => {
        const newSet = new Set(prev)
        newSet.delete(template.id)
        return newSet
      })
      setActiveTab("dashboard")
      await fetchWorkflows()
    } catch (error) {
      console.error("Error activating workflow:", error)
      toast({
        title: "Activation Failed",
        description: "Failed to activate workflow. Please try again.",
        variant: "destructive",
      })
    } finally {
      setActivatingTemplate(null)
    }
  }

  const handleCredentialChange = (key: string, value: string) => {
    setCredentials((prev) => ({ ...prev, [key]: value }))
  }

  const handleCredentialChangeEnhanced = (integrationName: string, fieldName: string, value: string) => {
    setCredentialsEnhanced((prev) => ({
      ...prev,
      [integrationName]: {
        ...prev[integrationName],
        [fieldName]: value,
      },
    }))
  }

  const togglePasswordVisibility = (key: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const validateCredentials = (): boolean => {
    if (!selectedTemplate) return false

    for (const integration of selectedTemplate.integrations) {
      for (const field of integration.credentialFields || []) {
        if (field.required && !credentialsEnhanced[integration.name]?.[field.name]?.trim()) {
          toast({
            title: "Missing Required Field",
            description: `Please fill in ${field.label} for ${integration.name}`,
            variant: "destructive",
          })
          return false
        }
      }
    }
    return true
  }

  const handleSubmitCredentials = async () => {
    if (!selectedTemplate) return

    if (selectedTemplate.integrations.length > 0 && !validateCredentials()) {
      return
    }

    setSubmittingCredentials(true)
    try {
      await activateWorkflow(selectedTemplate, credentialsEnhanced)
      setShowCredentialsDialog(false)
    } catch (error) {
      console.error("Error activating workflow:", error)
      toast({
        title: "Activation Failed",
        description: "Failed to activate workflow. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmittingCredentials(false)
    }
  }

  const handleActivateConfiguredTemplate = async (template: WorkflowTemplate) => {
    await activateWorkflow(template, credentialsEnhanced)
  }

  // All other handler functions from original component
  const handleDefaultWorkflowSelect = () => {
    // Default workflow is read-only and uses auto-fetched CRM integration
    return
  }

  const handleCustomWorkflowSelect = () => {
    if (activeWorkflowExists) return
    if (subscription?.plan.toUpperCase() !== "PRO") {
      setShowPaymentPopup(true)
      return
    }
    if (hasPendingCustomWorkflow) {
      setStep("progress")
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
    const businessIdToUse = currentUserId

    if (!businessIdToUse) {
      alert("Error: Business ID is missing. Cannot deploy workflow.")
      return
    }

    const workflowData = {
      workflowTemplateId: isDefaultWorkflow ? "default-crm-workflow" : selectedTemplate?.id || null,
      businessId: businessIdToUse,
      businessInfo,
      integrations: [],
      customRequest: isCustomWorkflow ? customRequest : undefined,
      status: isDefaultWorkflow ? "ACTIVE" : "PENDING_CREATION",
      isActive: isDefaultWorkflow,
      submittedAt: new Date().toISOString(),
      estimatedCompletion: isDefaultWorkflow ? "immediate" : "3-5",
    }

    try {
      const response = await fetch("/api/workflow-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workflowData),
      })
      const result = await response.json()

      if (result.success) {
        if (isDefaultWorkflow) {
          setActiveWorkflowExists(true)
          setActiveWorkflowDetails(result.workflowConfig)
          setWorkflowCreationStatus("completed")
          setStep("dashboard")
        } else {
          const pendingData: PendingWorkflowData = {
            id: result.workflowConfig.id,
            submittedAt: result.workflowConfig.createdAt,
            status: "UNDER_REVIEW",
            // workflowType: selectedTemplate?.category || "Custom Workflow",
            workflowType: "Custom Workflow",
            estimatedCompletion: "3-5",
          }

          localStorage.setItem("pendingWorkflow", JSON.stringify(pendingData))
          setPendingWorkflowData(pendingData)
          setWorkflowCreationStatus("submitted")
          setHasPendingCustomWorkflow(true)
          setStep("progress")
        }
      } else {
        alert(`Failed to submit workflow: ${result.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error submitting workflow configuration:", error)
      alert("An unexpected error occurred during submission.")
    }
  }
  const handleDeactivateWorkflow = async (config?: WorkflowConfig | BusinessWorkflowConfig) => {
    if (config) {
      setShowDeactivateDialog(config)
    } else if (activeWorkflowDetails?.id) {
      setShowDeactivateConfirm(true)
    } else {
      alert("No active workflow to deactivate.")
    }
  }
  //  const handleDeactivateWorkflow = async (config?: WorkflowConfig) => {
  //   if (config) {
  //     setShowDeactivateDialog(config)
  //   } else if (activeWorkflowDetails?.id) {
  //     setShowDeactivateConfirm(true)
  //   } else {
  //     alert("No active workflow to deactivate.")
  //   }
  // }

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
        setDefaultWorkflowStatus("active")
        alert("Custom workflow deactivated successfully! Default workflow is now active.")
        setActiveWorkflowExists(false)
        setActiveWorkflowDetails(null)
        setStep("selection")
        setBusinessInfo({ businessName: "", businessType: "", description: "", website: "", phone: "", email: "" })
        setCustomRequest("")
        setIsCustomWorkflow(false)
        setIsDefaultWorkflow(false)
        setWorkflowCreationStatus("not-started")
        setPendingWorkflowData(null)
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

  const confirmDeactivateWorkflow = async () => {
    if (!showDeactivateDialog) return

    try {
      const response = await fetch("/api/workflow-configs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: showDeactivateDialog.id,
          isActive: false,
          status: "INACTIVE",
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Workflow deactivated successfully",
          variant: "default",
        })
        await fetchWorkflows()
      } else {
        throw new Error("Failed to deactivate workflow")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to deactivate workflow",
        variant: "destructive",
      })
    } finally {
      setShowDeactivateDialog(null)
    }
  }

  const handlePaymentSuccess = () => {
    setShowPaymentPopup(false)
    if (subscription?.plan.toUpperCase() === "ENTERPRISE") {
      handleCustomWorkflowSelect()
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchWorkflows()
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
      }, 30000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [step, pendingWorkflowData])

  // Utility functions
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "LOW":
      case "SIMPLE":
        return "bg-primary/10 text-primary border-primary/20"
      case "MEDIUM":
        return "bg-secondary/10 text-secondary-foreground border-secondary/20"
      case "HIGH":
      case "COMPLEX":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-primary/10 text-primary border-primary/20"
      case "CONFIGURING":
        return "bg-secondary/10 text-secondary-foreground border-secondary/20"
      case "INACTIVE":
        return "bg-muted/10 text-muted-foreground border-muted/20"
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "ai_assistant":
        return <Sparkles className="h-6 w-6 text-primary" />
      case "sales":
        return <BarChart3 className="h-6 w-6 text-secondary-foreground" />
      case "marketing":
        return <Activity className="h-6 w-6 text-accent-foreground" />
      case "support":
        return <Clock className="h-6 w-6 text-muted-foreground" />
      case "custom":
        return <Settings className="h-6 w-6 text-primary" />
      case "hr":
        return <Users className="h-6 w-6 text-muted-foreground" />
      default:
        return <LayoutDashboard className="h-6 w-6 text-muted-foreground" />
    }
  }

  // Loading state
  if (isFetchingActiveWorkflow || isFetchingCRM || loading || businessLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading workflow templates...</p>
        </div>
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
          onDeactivate={() => handleDeactivateWorkflow()}
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

  // Main selection page - EXACT SAME STYLING AS DEFAULT WORKFLOW
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

            <div className="space-y-8">
              {/* Default Workflow Section */}
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Database className="h-6 w-6 text-primary" />
                  Default AI Assistant Workflow
                </h2>
                <Card
                  className={`relative overflow-hidden ${
                    defaultWorkflowStatus === "active"
                      ? "border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20"
                      : "border-gray-300 bg-gray-50 dark:bg-gray-950/20 opacity-75"
                  } transition-all duration-300`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 template-icon-container">
                          <Database className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">Smart AI Assistant</CardTitle>
                          <CardDescription className="text-base">
                            Ready-to-use AI assistant powered by your CRM integration
                          </CardDescription>
                        </div>
                      </div>
                      <Badge
                        variant={defaultWorkflowStatus === "active" ? "default" : "secondary"}
                        className={
                          defaultWorkflowStatus === "active" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-500"
                        }
                      >
                        {defaultWorkflowStatus === "active" ? "Active" : "Auto-Managed"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
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
                              <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                              <span className="text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
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
                                Connected
                              </Badge>
                            </div>
                          ))}
                          {defaultWorkflowStatus === "active" && (
                            <div className="mt-2 p-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
                              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                                🎉 Your default workflow is automatically active and processing Instagram DMs!
                              </p>
                            </div>
                          )}
                          {defaultWorkflowStatus === "deactivated" && (
                            <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                <AlertTriangle className="h-4 w-4 inline mr-1" />
                                Deactivated due to active custom workflow
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-destructive/10 p-3 rounded-lg">
                          <div className="flex items-center gap-2 text-sm text-destructive mb-2">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="font-medium">No CRM Connected</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Connect a CRM first to automatically activate the default workflow.
                          </p>
                        </div>
                      )}
                    </div>

                    {defaultWorkflowStatus === "active" && activeCRMIntegrations.length > 0 && (
                      <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground mb-3">
                          This workflow is automatically active when your CRM integration is configured.
                        </p>
                        <Button disabled className="bg-emerald-600 dark:bg-emerald-700">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Active (CRM Required)
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Custom Workflows Section */}
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <SettingsIcon className="h-6 w-6 text-primary" />
                  Custom Workflow Request
                </h2>
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

              {/* Published Templates Section - EXACT SAME STYLING AS DEFAULT WORKFLOW */}
              {templates.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Globe className="h-6 w-6 text-primary" />
                    Available Workflow Templates
                  </h2>
                  <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                    {templates.map((template) => {
                      const isConfigured = configuredTemplates.has(template.id)
                      const isActive = workflowConfigs.some(
                        (config) => config.templateId === template.id && config.isActive,
                      )
                      const isActivating = activatingTemplate === template.id

                      return (
                        <Card
                          key={template.id}
                          className={`relative overflow-hidden ${
                            isActive
                              ? "border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20"
                              : isConfigured
                                ? "border-gray-300 bg-gray-50 dark:bg-gray-950/20"
                                : "border-gray-300 bg-gray-50 dark:bg-gray-950/20 hover:border-primary/50 hover:shadow-lg"
                          } ${activeWorkflowExists && !isActive ? "opacity-75 cursor-not-allowed" : "cursor-pointer"}`}
                          onClick={() => {
                            if (activeWorkflowExists && !isActive) {
                              toast({
                                title: "Active Workflow Exists",
                                description: "Please deactivate your current workflow before configuring a new one.",
                                variant: "destructive",
                              })
                              return
                            }
                            if (!isActive) {
                              handleConfigureTemplate(template)
                            }
                          }}
                        >
                          <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 template-icon-container">
                                  {getCategoryIcon(template.category)}
                                </div>
                                <div className="flex-1">
                                  <CardTitle className="text-xl mb-2">{template.name}</CardTitle>
                                  <CardDescription className="text-base">{template.description}</CardDescription>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Badge variant="outline" className={getComplexityColor(template.complexity)}>
                                  {template.complexity}
                                </Badge>
                                {isActive && (
                                  <Badge
                                    variant="default"
                                    className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200"
                                  >
                                    <Power className="h-3 w-3 mr-1" />
                                    Active
                                  </Badge>
                                )}
                                {isConfigured && !isActive && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Configured
                                  </Badge>
                                )}
                                <Badge
                                  variant="outline"
                                  className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-300 dark:border-blue-800"
                                >
                                  <Globe className="h-3 w-3 mr-1" />
                                  Published
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>

                          <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                              {/* Process Flow - EXACT SAME AS DEFAULT */}
                              <div>
                                <h4 className="font-semibold text-sm mb-3 text-primary">Process Flow:</h4>
                                <div className="space-y-2">
                                  {template.operations && template.operations.length > 0 ? (
                                    template.operations.slice(0, 5).map((operation, idx) => (
                                      <div key={idx} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                                          {idx + 1}
                                        </div>
                                        <span className="text-sm text-muted-foreground">{operation}</span>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="flex items-center gap-3">
                                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                                        1
                                      </div>
                                      <span className="text-sm text-muted-foreground">Custom workflow process</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold text-sm mb-3 text-primary">Key Features:</h4>
                                <ul className="space-y-2">
                                  {template.features && template.features.length > 0 ? (
                                    template.features.slice(0, 4).map((feature, idx) => (
                                      <li key={idx} className="flex items-center gap-2 text-sm">
                                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                        <span className="text-muted-foreground">{feature}</span>
                                      </li>
                                    ))
                                  ) : (
                                    <li className="flex items-center gap-2 text-sm">
                                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                      <span className="text-muted-foreground">Advanced automation features</span>
                                    </li>
                                  )}
                                  {template.features && template.features.length > 4 && (
                                    <li className="text-xs text-muted-foreground ml-6">
                                      +{template.features.length - 4} more features
                                    </li>
                                  )}
                                </ul>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-border/50">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {template.category}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {workflowConfigs.some(
                                    (config) => config.isActive && config.templateId !== template.id,
                                  )
                                    ? "Locked - Deactivate current workflow first"
                                    : "Ready to configure"}
                                </span>
                              </div>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleConfigureTemplate(template)
                                }}
                                variant="outline"
                                size="sm"
                                disabled={workflowConfigs.some(
                                  (config) => config.isActive && config.templateId !== template.id,
                                )}
                                className="ml-auto"
                              >
                                {isActivating ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Activating...
                                  </>
                                ) : isActive ? (
                                  <>
                                    <Settings className="h-4 w-4 mr-2" />
                                    Manage
                                  </>
                                ) : (
                                  <>
                                    <Settings className="h-4 w-4 mr-2" />
                                    Configure & Activate
                                  </>
                                )}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )}
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

  // Enhanced workflow selector tabs view
  if (activeTab === "browse" || activeTab === "dashboard") {
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

          {/* Navigation Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "browse" | "dashboard")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
              <TabsTrigger value="browse" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Browse Templates
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                My Workflows
              </TabsTrigger>
            </TabsList>

            {/* Browse Templates Tab */}
            <TabsContent value="browse" className="space-y-6">
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
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
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-card-foreground">
                      Available Templates ({filteredTemplates.length})
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Ready to configure</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.map((template) => {
                      const isConfigured = configuredTemplates.has(template.id)
                      const isActive = workflowConfigs.some(
                        (config) => config.templateId === template.id && config.isActive,
                      )
                      const isActivating = activatingTemplate === template.id

                      return (
                        <Card
                          key={template.id}
                          className={`transition-all duration-300 border-2 flex flex-col ${
                            isActive
                              ? "border-primary/50 bg-primary/5"
                              : isConfigured
                                ? "border-secondary/50 bg-secondary/5"
                                : "border-border/50 hover:border-primary/50 hover:shadow-lg"
                          }`}
                        >
                          <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-primary/10 template-icon-container">
                                  {getCategoryIcon(template.category)}
                                </div>
                                <div className="flex-1">
                                  <CardTitle className="text-xl mb-1">{template.name}</CardTitle>
                                  <CardDescription className="text-sm">{template.category}</CardDescription>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Badge variant="outline" className={getComplexityColor(template.complexity)}>
                                  {template.complexity}
                                </Badge>
                                {isActive && (
                                  <Badge variant="default" className="bg-primary/90 text-primary-foreground">
                                    <Power className="h-3 w-3 mr-1" />
                                    Active
                                  </Badge>
                                )}
                                {isConfigured && !isActive && (
                                  <Badge variant="secondary" className="bg-secondary/90 text-secondary-foreground">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Configured
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardHeader>

                          <CardContent className="space-y-6 flex-1">
                            {/* Description */}
                            <div>
                              <p className="text-sm text-muted-foreground leading-relaxed">{template.description}</p>
                            </div>

                            {/* Key Features */}
                            {template.features && template.features.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-sm mb-3 text-primary">Key Features:</h4>
                                <ul className="space-y-2">
                                  {template.features.slice(0, 4).map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-sm">
                                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                      <span className="text-muted-foreground">{feature}</span>
                                    </li>
                                  ))}
                                  {template.features.length > 4 && (
                                    <li className="text-xs text-muted-foreground">
                                      +{template.features.length - 4} more features
                                    </li>
                                  )}
                                </ul>
                              </div>
                            )}

                            {/* Required Integrations */}
                            {template.integrations &&
                              Array.isArray(template.integrations) &&
                              template.integrations.length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-sm mb-3 text-primary">Required Integrations:</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {template.integrations.slice(0, 4).map((integration: any, idx: number) => (
                                      <Badge key={idx} variant="secondary" className="text-xs">
                                        <Zap className="h-3 w-3 mr-1" />
                                        {typeof integration === "string"
                                          ? integration
                                          : integration.name || "Integration"}
                                      </Badge>
                                    ))}
                                    {template.integrations.length > 4 && (
                                      <Badge variant="secondary" className="text-xs">
                                        +{template.integrations.length - 4} more
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              )}

                            {/* Bottom CTA row */}
                            <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{template.estimatedSetupTime} min setup</span>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-2">
                                {isActive ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-primary border-primary/50 bg-transparent"
                                  >
                                    <Power className="h-3 w-3 mr-1" />
                                    Active
                                  </Button>
                                ) : isConfigured ? (
                                  <Button
                                    size="sm"
                                    onClick={() => handleActivateConfiguredTemplate(template)}
                                    disabled={isActivating || !businessDetails}
                                    className="bg-primary hover:bg-primary/90"
                                  >
                                    {isActivating ? (
                                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                    ) : (
                                      <Power className="h-3 w-3 mr-1" />
                                    )}
                                    Activate Now
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleConfigureTemplate(template)}
                                    disabled={!businessDetails}
                                  >
                                    <Settings className="h-3 w-3 mr-1" />
                                    Configure
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </>
              )}
            </TabsContent>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-card-foreground">My Active Workflows</h2>
                <Button onClick={handleRefresh} disabled={refreshing} variant="outline">
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-2 border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Activity className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-card-foreground">
                          {workflowConfigs.filter((w) => w.isActive).length}
                        </p>
                        <p className="text-sm text-muted-foreground">Active Workflows</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-secondary/10 rounded-lg">
                        <Zap className="h-6 w-6 text-secondary-foreground" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-card-foreground">
                          {workflowConfigs.reduce((acc, w) => acc + (w.credentials?.length || 0), 0)}
                        </p>
                        <p className="text-sm text-muted-foreground">Integrations</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-accent/10 rounded-lg">
                        <BarChart3 className="h-6 w-6 text-accent-foreground" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-card-foreground">98%</p>
                        <p className="text-sm text-muted-foreground">Success Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-muted/10 rounded-lg">
                        <Clock className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-card-foreground">2.3s</p>
                        <p className="text-sm text-muted-foreground">Avg Response</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Workflows List */}
              {workflowConfigs.length === 0 ? (
                <Card className="border-2 border-border/50">
                  <CardContent className="p-12 text-center">
                    <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-card-foreground mb-2">No Active Workflows</h3>
                    <p className="text-muted-foreground mb-6">
                      You haven&apos;t activated any workflows yet. Browse our template library to get started.
                    </p>
                    <Button onClick={() => setActiveTab("browse")}>
                      <Zap className="h-4 w-4 mr-2" />
                      Browse Templates
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {workflowConfigs.map((config) => (
                    <Card
                      key={config.id}
                      className="border-2 border-border/50 hover:shadow-lg transition-all duration-300"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl text-card-foreground">
                              {config.workflowTemplate?.name || "Custom Workflow"}
                            </CardTitle>
                            <CardDescription className="mt-2 text-muted-foreground">
                              {config.workflowTemplate?.description ||
                                config.customRequest ||
                                "No description available"}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getStatusColor(config.status)}>
                              {config.isActive ? (
                                <>
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Active
                                </>
                              ) : (
                                <>
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  {config.status}
                                </>
                              )}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-6">
                        {/* Workflow Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="font-semibold text-sm mb-2 text-card-foreground">Category</h4>
                            <p className="text-sm text-muted-foreground">
                              {config.workflowTemplate?.category || "Custom"}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm mb-2 text-card-foreground">Complexity</h4>
                            <p className="text-sm text-muted-foreground">
                              {config.workflowTemplate?.complexity || "Medium"}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm mb-2 text-card-foreground">Created</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(config.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <Separator />

                        {/* Integrations */}
                        {config.credentials && config.credentials.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm mb-3 text-card-foreground">Connected Integrations</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {config.credentials.map((credential) => (
                                <div key={credential.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                  <div className="p-2 bg-primary/10 rounded">
                                    <Zap className="h-4 w-4 text-primary" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-sm text-card-foreground">
                                      {credential.integrationName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {credential.isActive ? "Connected" : "Disconnected"} • Last verified:{" "}
                                      {credential.createdAt
                                        ? new Date(credential.createdAt).toLocaleDateString()
                                        : "Never"}
                                    </p>
                                  </div>
                                  <div className="flex items-center">
                                    {credential.isActive ? (
                                      <CheckCircle className="h-4 w-4 text-primary" />
                                    ) : (
                                      <AlertTriangle className="h-4 w-4 text-destructive" />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-4 border-t border-border">
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4 mr-2" />
                            Configure
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeactivateWorkflow(config)}
                            className="text-destructive hover:text-destructive"
                          >
                            <PowerOff className="h-4 w-4 mr-2" />
                            Deactivate
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Credentials Dialog */}
          <Dialog open={showCredentialsDialog} onOpenChange={setShowCredentialsDialog}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-card-foreground">Configure {selectedTemplate?.name}</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Please provide the required credentials for the integrations used by this workflow.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {selectedTemplate?.integrations.map((integration: Integration, integrationIdx: number) => (
                  <div key={integrationIdx} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Zap className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-card-foreground">{integration.name}</h3>
                        <p className="text-sm text-muted-foreground">{integration.description}</p>
                      </div>
                    </div>

                    {integration.credentialInstructions && (
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <h4 className="font-medium text-sm mb-2 text-card-foreground">Setup Instructions:</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {integration.credentialInstructions}
                        </p>
                      </div>
                    )}

                    <div className="grid gap-4">
                      {integration.credentialFields?.map((field: CredentialField, fieldIdx: number) => {
                        const fieldKey = `${integration.name}-${field.name}`
                        const isPassword = field.type === "password"
                        const showPassword = showPasswords[fieldKey]
                        const fieldValue = credentialsEnhanced[integration.name]?.[field.name] || ""
                        const inputType = isPassword && !showPassword ? "password" : field.type
                        const placeholder = field.placeholder || `Enter ${field.label.toLowerCase()}`

                        return (
                          <div key={fieldIdx} className="space-y-2">
                            <Label htmlFor={fieldKey} className="text-sm font-medium text-card-foreground">
                              {field.label}
                              {field.required && <span className="text-destructive ml-1">*</span>}
                            </Label>

                            <div className="relative">
                              <Input
                                id={fieldKey}
                                type={inputType}
                                value={fieldValue}
                                onChange={(e) =>
                                  handleCredentialChangeEnhanced(integration.name, field.name, e.target.value)
                                }
                                placeholder={placeholder}
                                required={field.required}
                                className="bg-background border-input text-foreground pr-10"
                              />

                              {isPassword && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-muted"
                                  onClick={() => togglePasswordVisibility(fieldKey)}
                                  aria-label={showPassword ? "Hide password" : "Show password"}
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

                    {integrationIdx < (selectedTemplate?.integrations.length || 0) - 1 && (
                      <Separator className="my-6" />
                    )}
                  </div>
                ))}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCredentialsDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitCredentials} disabled={submittingCredentials}>
                  {submittingCredentials ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Activating...
                    </>
                  ) : (
                    <>
                      <Settings className="h-4 w-4 mr-2" />
                      Activate Workflow
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Deactivate Confirmation Dialog */}
          <Dialog open={!!showDeactivateDialog} onOpenChange={() => setShowDeactivateDialog(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-6 w-6" />
                  Confirm Deactivation
                </DialogTitle>
                <DialogDescription>
                  Are you sure you want to deactivate &ldquo;
                  {showDeactivateDialog?.workflowTemplate?.name || "this workflow"}
                  &rdquo;? This will stop all automated responses. You can reconfigure and reactivate it later.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDeactivateDialog(null)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDeactivateWorkflow}>
                  <PowerOff className="h-4 w-4 mr-2" />
                  Deactivate Workflow
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    )
  }

  // Configuration step for template workflows
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
                  Configure Your{" "}
                  {isDefaultWorkflow ? "Default CRM" : selectedTemplate ? selectedTemplate.name : "Custom"} Workflow
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

              <Card className="glassEffect border-2 card-border-customer-support">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {isDefaultWorkflow ? (
                      <Database className="h-5 w-5 text-chart-1" />
                    ) : (
                      getCategoryIcon(selectedTemplate?.category || "")
                    )}
                    {isDefaultWorkflow ? "Default CRM Workflow Overview" : `${selectedTemplate?.name} Overview`}
                  </CardTitle>
                  <CardDescription>
                    {isDefaultWorkflow
                      ? "Here's what your default workflow will include"
                      : `Here's what your ${selectedTemplate?.name} workflow will include`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-4 text-primary flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Process Flow:
                      </h4>
                      <div className="space-y-3">
                        {(isDefaultWorkflow
                          ? [
                              "Receive Instagram DM",
                              "AI lead qualification",
                              "Collect contact information",
                              "Send to your CRM",
                              "Notify your team",
                            ]
                          : selectedTemplate?.operations || ["Automated workflow execution"]
                        ).map((operation, idx) => (
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
                        {(isDefaultWorkflow
                          ? [
                              "Instant lead qualification",
                              "Automatic CRM integration",
                              "Smart conversation handling",
                              "Lead scoring & prioritization",
                              "Human handoff when needed",
                              "Real-time notifications",
                            ]
                          : selectedTemplate?.features || ["Advanced automation capabilities"]
                        ).map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-sm">
                            <CheckCircle className="h-4 w-4 text-chart-2 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Show integrations for template workflows */}
                    {!isDefaultWorkflow &&
                      selectedTemplate?.integrations &&
                      Array.isArray(selectedTemplate.integrations) &&
                      selectedTemplate.integrations.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-4 text-primary">Required Integrations:</h4>
                          <div className="space-y-2">
                            {selectedTemplate.integrations.map((integration: any, idx: number) => (
                              <div key={idx} className="flex items-center gap-3 p-3 bg-chart-2/10 rounded-lg">
                                <Zap className="h-4 w-4 text-chart-2" />
                                <span className="text-sm font-medium">
                                  {typeof integration === "string" ? integration : integration.name || "Integration"}
                                </span>
                                <Badge variant="outline" className="ml-auto text-xs text-chart-2 border-chart-2/20">
                                  Required
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Show CRM integrations for default workflow */}
                    {isDefaultWorkflow && (
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
                    )}
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
                      {isDefaultWorkflow ? "Default CRM Workflow" : selectedTemplate?.name || "Custom Workflow Request"}
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
                      {isDefaultWorkflow
                        ? "Immediate activation"
                        : selectedTemplate?.estimatedSetupTime
                          ? `${selectedTemplate.estimatedSetupTime} minutes`
                          : "3-5 business days"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="glassEffect border-2 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    {isDefaultWorkflow ? "CRM Integration" : "Template Integration"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {isDefaultWorkflow
                      ? crmIntegrations
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
                          ))
                      : selectedTemplate?.integrations?.map((integration: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-chart-2/10 rounded-lg">
                            <Zap className="h-4 w-4 text-chart-2" />
                            <div className="flex-1">
                              <span className="text-sm font-medium">
                                {typeof integration === "string" ? integration : integration.name || "Integration"}
                              </span>
                              <p className="text-xs text-muted-foreground">Ready to configure</p>
                            </div>
                            <Badge variant="outline" className="text-xs text-chart-2 border-chart-2/20">
                              Required
                            </Badge>
                          </div>
                        ))}
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    {isDefaultWorkflow
                      ? "Your CRM credentials will be automatically used by the workflow to send qualified leads."
                      : "Template integrations will be configured during the setup process."}
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
                        Your template workflow will be configured and activated.
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        Integration credentials will be set up during the process.
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        You can return to this page anytime to check the status of your workflow.
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        Once complete, your automation will be available in your dashboard.
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
                {isDefaultWorkflow
                  ? "Activate Workflow 🚀"
                  : selectedTemplate
                    ? "Configure & Activate 🚀"
                    : "Submit for Development 🚀"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Legacy workflow configuration view
  if (isConfiguring) {
    return (
      <>
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
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-300"
                        >
                          <Globe className="h-3 w-3 mr-1" /> Public
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-orange-50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-300"
                        >
                          <Lock className="h-3 w-3 mr-1" /> Private
                        </Badge>
                      )}
                      {template.integrations && template.integrations.length > 0 && (
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
        </Card>

        <Dialog open={isCredentialDialogOpen} onOpenChange={setIsCredentialDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enter Credentials for {selectedTemplate?.name}</DialogTitle>
              <DialogDescription>
                Please provide the necessary API keys or tokens for this workflow&apos;s integrations.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {selectedTemplate?.integrations && Array.isArray(selectedTemplate.integrations) ? (
                selectedTemplate.integrations.map((integration, index) => (
                  <div key={index}>
                    <Label htmlFor={`integration-${index}`}>
                      {typeof integration === "string" ? integration : integration.name || `Integration ${index + 1}`}{" "}
                      API Key
                    </Label>
                    <Input
                      id={`integration-${index}`}
                      type="password"
                      value={credentials[typeof integration === "string" ? integration : integration.name] || ""}
                      onChange={(e) =>
                        handleCredentialChange(
                          typeof integration === "string" ? integration : integration.name,
                          e.target.value,
                        )
                      }
                      placeholder={`Enter ${typeof integration === "string" ? integration : integration.name} API Key`}
                    />
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No integrations configured for this template.</p>
              )}
            </div>
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
      </>
    )
  }

  // Default workflow list view
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
              onClick={() => onWorkflowSelected && onWorkflowSelected(config)}
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
                  {config.credentials && config.credentials.length > 0 ? (
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
