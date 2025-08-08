// "use client"

// import type React from "react"
// import { useState, useCallback, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { ArrowLeft, Sparkles, Loader2, CheckCircle, Settings, ThumbsUp, MessageCircle, RefreshCw, Zap, AlertCircle, PlayCircle, Workflow, ChevronDown, ChevronRight, Database, Filter, Mail, Star, Brain, Layers, Wand2, Check, Link2, Instagram, FileSpreadsheet, FileText, Users, Target, MessageSquare, Heart, UserPlus, ShoppingBag, Calendar, Info, Clock, TrendingUp } from 'lucide-react'

// import { generateWorkflowWithDeepSeek } from "@/actions/workflow-generator/deepseek-actions"

// // TypeScript interfaces
// interface BusinessInfo {
//   businessName: string
//   businessType: string
//   description?: string
//   website?: string
//   phone?: string
//   email?: string
// }

// interface VoiceflowWorkflowBuilderProps {
//   businessInfo?: BusinessInfo
//   selectedWorkflowId?: string | null
//   setStep?: (step: "selection" | "dashboard" | "pending") => void
//   setActiveWorkflowExists?: (exists: boolean) => void
//   setActiveWorkflowDetails?: (details: any) => void
// }

// interface Integration {
//   id: string
//   name: string
//   description: string
//   icon: React.ComponentType<{ className?: string }>
//   operations: string[]
//   voiceflowCompatible: boolean
//   setupComplexity: "easy" | "medium" | "hard"
//   commonUseCases: string[]
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
//   icon?: React.ComponentType<{ className?: string }>
//   color?: string
//   bgColor?: string
//   borderColor?: string
//   details?: string[]
//   isAnimating?: boolean
//   assignedIntegration?: Integration | null
//   voiceflowAction?: string
//   complexity?: "low" | "medium" | "high"
//   businessImpact?: string
// }

// interface ParsedWorkflow {
//   title: string
//   description: string
//   platform: string
//   estimatedBuildTime: string
//   complexity: string
//   steps: WorkflowStep[]
//   integrations: Integration[]
//   benefits: string[]
//   exampleScenario: string
//   voiceflowFeatures: string[]
//   instagramFocus: string[]
//   estimatedCost?: string
//   roi?: string
//   metrics?: {
//     automationRate: string
//     responseTime: string
//     accuracy: string
//     scalability: string
//   }
// }

// interface DeepSeekResponse {
//   success: boolean
//   workflowData?: any
//   error?: string
// }

// // Supported Integrations (limited to the 4 specified)
// const SUPPORTED_INTEGRATIONS: Integration[] = [
//   {
//     id: "airtable",
//     name: "Airtable",
//     description: "Cloud-based database for storing and managing customer data, leads, and interactions",
//     icon: Database,
//     operations: [
//       "Create records",
//       "Update records", 
//       "Search records",
//       "Delete records",
//       "List records",
//       "Get record by ID",
//     ],
//     voiceflowCompatible: true,
//     setupComplexity: "easy",
//     commonUseCases: [
//       "Store customer inquiries",
//       "Track lead information",
//       "Manage product catalogs",
//       "Log interaction history",
//     ],
//   },
//   {
//     id: "google-sheets",
//     name: "Google Sheets",
//     description: "Spreadsheet platform for data tracking, reporting, and team collaboration",
//     icon: FileSpreadsheet,
//     operations: ["Add rows", "Update cells", "Read data", "Create sheets", "Format cells", "Calculate formulas"],
//     voiceflowCompatible: true,
//     setupComplexity: "easy",
//     commonUseCases: [
//       "Track engagement metrics",
//       "Generate reports",
//       "Store contact lists",
//       "Monitor campaign performance",
//     ],
//   },
//   {
//     id: "mailchimp",
//     name: "Mailchimp",
//     description: "Email marketing platform for newsletters, campaigns, and audience management",
//     icon: Mail,
//     operations: [
//       "Add subscribers",
//       "Send campaigns",
//       "Create audiences",
//       "Update subscriber info",
//       "Remove subscribers",
//       "Track campaign stats",
//     ],
//     voiceflowCompatible: true,
//     setupComplexity: "medium",
//     commonUseCases: [
//       "Build email lists from Instagram",
//       "Send follow-up campaigns",
//       "Segment audiences",
//       "Automate email sequences",
//     ],
//   },
//   {
//     id: "notion",
//     name: "Notion",
//     description: "All-in-one workspace for notes, databases, and team collaboration",
//     icon: FileText,
//     operations: [
//       "Create pages",
//       "Update databases",
//       "Add database entries",
//       "Search content",
//       "Create templates",
//       "Manage properties",
//     ],
//     voiceflowCompatible: true,
//     setupComplexity: "medium",
//     commonUseCases: [
//       "Document customer interactions",
//       "Create knowledge bases",
//       "Track project progress",
//       "Manage content calendars",
//     ],
//   },
// ]

// // Default business info
// const defaultBusinessInfo: BusinessInfo = {
//   businessName: "Your Business",
//   businessType: "Technology Company",
//   description: "We provide innovative solutions for businesses",
//   website: "https://yourbusiness.com",
//   phone: "+1-555-0123",
//   email: "contact@yourbusiness.com",
// }

// // Step type configurations optimized for Voiceflow
// const stepTypeConfigs: Record<string, any> = {
//   trigger: {
//     icon: PlayCircle,
//     color: "text-emerald-600",
//     bgColor: "from-emerald-50 to-green-100",
//     borderColor: "border-emerald-300",
//     voiceflowBlock: "Intent Block",
//   },
//   analysis: {
//     icon: Brain,
//     color: "text-purple-600",
//     bgColor: "from-purple-50 to-violet-100",
//     borderColor: "border-purple-300",
//     voiceflowBlock: "AI Block",
//   },
//   filter: {
//     icon: Filter,
//     color: "text-blue-600",
//     bgColor: "from-blue-50 to-cyan-100",
//     borderColor: "border-blue-300",
//     voiceflowBlock: "Condition Block",
//   },
//   response: {
//     icon: MessageCircle,
//     color: "text-orange-600",
//     bgColor: "from-orange-50 to-amber-100",
//     borderColor: "border-orange-300",
//     voiceflowBlock: "Text Block",
//   },
//   integration: {
//     icon: Zap,
//     color: "text-yellow-600",
//     bgColor: "from-yellow-50 to-orange-100",
//     borderColor: "border-yellow-300",
//     voiceflowBlock: "API Block",
//   },
//   storage: {
//     icon: Database,
//     color: "text-gray-600",
//     bgColor: "from-gray-50 to-slate-100",
//     borderColor: "border-gray-300",
//     voiceflowBlock: "Set Block",
//   },
// }

// const VoiceflowWorkflowBuilder: React.FC<VoiceflowWorkflowBuilderProps> = ({
//   businessInfo = defaultBusinessInfo,
//   selectedWorkflowId,
//   setStep,
//   setActiveWorkflowExists,
//   setActiveWorkflowDetails,
// }) => {
//   const [workflowRequest, setWorkflowRequest] = useState<string>("")
//   const [parsedWorkflow, setParsedWorkflow] = useState<ParsedWorkflow | null>(null)
//   const [refinementInput, setRefinementInput] = useState<string>("")
//   const [isGenerating, setIsGenerating] = useState<boolean>(false)
//   const [responseStatus, setResponseStatus] = useState<string | null>(null)
//   const [currentAction, setCurrentAction] = useState<"initial" | "refine" | "approve">("initial")
//   const [hasInitialRequest, setHasInitialRequest] = useState<boolean>(false)
//   const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set())
//   const [generationStartTime, setGenerationStartTime] = useState<number>(0)

//   // New state for integration selection
//   const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])
//   const [selectedOperations, setSelectedOperations] = useState<Record<string, string[]>>({})

//   // Streaming states
//   const [streamingSteps, setStreamingSteps] = useState<WorkflowStep[]>([])
//   const [currentPhase, setCurrentPhase] = useState<number>(0)
//   const [isStreaming, setIsStreaming] = useState<boolean>(false)
//   const [streamingProgress, setStreamingProgress] = useState<number>(0)
//   const [aiThoughts, setAiThoughts] = useState<string[]>([])
//   const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number>(0)
//   const stepContainerRef = useRef<HTMLDivElement>(null)

//   // Instagram-specific automation goals
//   const instagramGoals = [
//     { id: "lead-generation", label: "Lead Generation from DMs", icon: UserPlus, description: "Capture and qualify leads from Instagram conversations" },
//     { id: "customer-support", label: "Customer Support Automation", icon: MessageSquare, description: "Provide instant support and resolve common issues" },
//     { id: "product-inquiries", label: "Product Inquiry Handling", icon: ShoppingBag, description: "Answer product questions and share information" },
//     { id: "appointment-booking", label: "Appointment/Consultation Booking", icon: Calendar, description: "Schedule meetings and consultations automatically" },
//     { id: "content-engagement", label: "Content Engagement Responses", icon: Heart, description: "Respond to comments and engagement on posts" },
//     { id: "influencer-outreach", label: "Influencer/Partnership Outreach", icon: Users, description: "Manage collaboration and partnership requests" },
//   ]

//   const [selectedGoals, setSelectedGoals] = useState<string[]>(["customer-support"])

//   // Enhanced workflow generation with timeout handling
//   const generateWorkflowWithAI = useCallback(
//     async (action: "initial" | "refine", instructions?: string): Promise<void> => {
//       setIsGenerating(true)
//       setIsStreaming(true)
//       setCurrentPhase(0)
//       setStreamingProgress(0)
//       setStreamingSteps([])
//       setAiThoughts([])
//       setGenerationStartTime(Date.now())
//       setEstimatedTimeRemaining(20) // Reduced to match server timeout
//       setResponseStatus("🧠 Connecting to DeepSeek AI...")
//       setCurrentAction(action)
//       setHasInitialRequest(true)

//       let progressInterval: NodeJS.Timeout | null = null

//       try {
//         // Real-time progress updates
//         progressInterval = setInterval(() => {
//           setEstimatedTimeRemaining(prev => Math.max(0, prev - 1))
//         }, 1000)

//         // Update progress phases
//         addAiThought("🤖 Sending optimized request to DeepSeek AI...")
//         setCurrentPhase(1)
//         setStreamingProgress(25)

//         // Add progress updates
//         setTimeout(() => {
//           if (isGenerating) {
//             addAiThought("⚡ Processing with optimized settings...")
//             setStreamingProgress(50)
//           }
//         }, 8000)

//         // Call server action with reduced timeout
//         const startTime = Date.now()
//         const aiResponse = await Promise.race([
//           generateWorkflowWithDeepSeek({
//             action,
//             businessInfo,
//             selectedIntegrations,
//             selectedOperations,
//             selectedGoals,
//             workflowRequest,
//             instructions,
//             currentWorkflow: parsedWorkflow ? {
//               title: parsedWorkflow.title,
//               description: parsedWorkflow.description,
//               steps: streamingSteps
//             } : undefined
//         }),
//         // Reduced client-side timeout
//         new Promise<DeepSeekResponse>((_, reject) => 
//           setTimeout(() => reject(new Error('Client timeout - please try with simpler requirements')), 60000)
//         )
//       ])

//       const duration = Date.now() - startTime
//       console.log(`Request completed in ${duration}ms`)

//       if (progressInterval) {
//         clearInterval(progressInterval)
//         progressInterval = null
//       }

//       // Check response
//       if (!aiResponse) {
//         throw new Error("No response received from server")
//       }

//       if (aiResponse.success && aiResponse.workflowData) {
//         addAiThought("🧠 Processing AI-generated workflow...")
//         setCurrentPhase(2)
//         setStreamingProgress(70)

//         addAiThought("✨ Creating workflow steps...")
//         setCurrentPhase(3)
//         setStreamingProgress(85)

//         // Validate workflow data structure
//         if (!aiResponse.workflowData.steps || !Array.isArray(aiResponse.workflowData.steps)) {
//           throw new Error("Invalid workflow data structure received")
//         }

//         // Process the AI-generated steps
//         const workflowSteps = await processAIGeneratedSteps(aiResponse.workflowData.steps)

//         const workflow: ParsedWorkflow = {
//           title: aiResponse.workflowData.title || `${businessInfo.businessName} Instagram Automation`,
//           description: aiResponse.workflowData.description || `Custom Instagram DM automation workflow`,
//           platform: "Instagram DMs via Voiceflow",
//           estimatedBuildTime: "1-2 weeks",
//           complexity: "Custom",
//           steps: workflowSteps,
//           integrations: getAssignedIntegrations(workflowSteps),
//           benefits: aiResponse.workflowData.benefits || [
//             "Custom AI-generated automation",
//             "Instagram-optimized workflow",
//             "Voiceflow-compatible implementation"
//           ],
//           exampleScenario: aiResponse.workflowData.exampleScenario || "Custom workflow tailored to your specific requirements",
//           voiceflowFeatures: [
//             "Custom Intent Recognition",
//             "Dynamic Conditional Logic", 
//             "Tailored API Integrations",
//             "Personalized Response Generation"
//           ],
//           instagramFocus: [
//             "Custom DM automation flow",
//             "Personalized customer interactions",
//             "Business-specific automation logic"
//           ],
//           estimatedCost: "$200-500/month",
//           roi: "300-600% within 3 months",
//           metrics: {
//             automationRate: "90%",
//             responseTime: "< 15 seconds", 
//             accuracy: "94%",
//             scalability: "High",
//           },
//         }

//         setParsedWorkflow(workflow)
//         setStreamingProgress(100)
//         setResponseStatus("✅ Custom Instagram workflow generated successfully!")
//         addAiThought("🎉 Workflow ready for Voiceflow implementation!")
//       } else {
//         // Handle error response with better messaging
//         const errorMessage = aiResponse?.error || "Unknown error occurred"
        
//         // Provide specific guidance based on error type
//         let userGuidance = ""
//         if (errorMessage.includes('timeout') || errorMessage.includes('overloaded')) {
//           userGuidance = " Try using shorter, more specific requirements or wait a moment before retrying."
//         } else if (errorMessage.includes('format') || errorMessage.includes('invalid')) {
//           userGuidance = " Try rephrasing your request with clearer, simpler language."
//         } else if (errorMessage.includes('API') || errorMessage.includes('key')) {
//           userGuidance = " Please contact support if this persists."
//         }
        
//         throw new Error(errorMessage + userGuidance)
//       }
//     } catch (error) {
//       console.error("AI generation error:", error)
//       const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      
//       // Provide more helpful error messages
//       let userFriendlyMessage = errorMessage
//       if (errorMessage.includes('timeout')) {
//         userFriendlyMessage = "⏱️ Request timed out. Try using shorter, more specific requirements, or wait a moment before retrying."
//       } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
//         userFriendlyMessage = "🌐 Network issue. Please check your connection and try again."
//       } else if (errorMessage.includes('API key')) {
//         userFriendlyMessage = "🔑 API configuration issue. Please contact support."
//       }
      
//       setResponseStatus(`❌ Generation failed: ${userFriendlyMessage}`)
//       addAiThought("💡 Try shorter, more specific requirements for faster processing.")
//     } finally {
//       if (progressInterval) {
//         clearInterval(progressInterval)
//       }
//       setIsStreaming(false)
//       setTimeout(() => {
//         setIsGenerating(false)
//       }, 1000)
//     }
//   },
//   [businessInfo, selectedIntegrations, selectedOperations, selectedGoals, workflowRequest, parsedWorkflow, streamingSteps, isGenerating],
// )

//   // Process AI-generated steps with enhanced streaming
//   const processAIGeneratedSteps = async (aiSteps: any[]): Promise<WorkflowStep[]> => {
//     const steps: WorkflowStep[] = []
//     const availableIntegrations = [...selectedIntegrations]

//     for (let i = 0; i < aiSteps.length; i++) {
//       const aiStep = aiSteps[i]
//       const config = stepTypeConfigs[aiStep.type] || stepTypeConfigs.trigger

//       // Assign integration based on AI recommendation
//       let assignedIntegration: Integration | null = null
//       if (aiStep.needsIntegration && availableIntegrations.length > 0) {
//         const integrationId = availableIntegrations.shift()!
//         assignedIntegration = SUPPORTED_INTEGRATIONS.find((int) => int.id === integrationId) || null
//       }

//       const step: WorkflowStep = {
//         id: `step-${i + 1}`,
//         stepNumber: i + 1,
//         title: aiStep.title,
//         description: aiStep.description,
//         type: aiStep.type,
//         icon: config.icon,
//         color: config.color,
//         bgColor: config.bgColor,
//         borderColor: config.borderColor,
//         estimatedTime: aiStep.estimatedTime || "< 2s",
//         inputs: aiStep.inputs || [],
//         outputs: aiStep.outputs || [],
//         details: aiStep.details || [],
//         isAnimating: true,
//         assignedIntegration,
//         voiceflowAction: aiStep.voiceflowBlock || config.voiceflowBlock,
//         complexity: aiStep.complexity || "medium",
//         businessImpact: aiStep.businessImpact || "Enhances automation workflow",
//       }

//       setStreamingSteps((prevSteps) => [...prevSteps, step])

//       const progress = 80 + ((i + 1) / aiSteps.length) * 15
//       setStreamingProgress(progress)

//       addAiThought(
//         `🔧 Generated: ${step.title}${assignedIntegration ? ` (${assignedIntegration.name})` : ""}`,
//       )

//       // Faster animation timing
//       await new Promise((resolve) => setTimeout(resolve, 500))

//       setStreamingSteps((prevSteps) => prevSteps.map((s) => (s.id === step.id ? { ...s, isAnimating: false } : s)))

//       steps.push(step)
//     }

//     return steps
//   }

//   const getAssignedIntegrations = (steps: WorkflowStep[]): Integration[] => {
//     return steps.filter((step) => step.assignedIntegration).map((step) => step.assignedIntegration!)
//   }

//   const addAiThought = (thought: string): void => {
//     setAiThoughts((prev) => {
//       const newThoughts = [...prev, thought]
//       return newThoughts.slice(-4) // Keep last 4 thoughts
//     })
//   }

//   // Handle integration selection
//   const handleIntegrationToggle = (integrationId: string) => {
//     setSelectedIntegrations((prev) => {
//       if (prev.includes(integrationId)) {
//         // Remove integration and its operations
//         const newOperations = { ...selectedOperations }
//         delete newOperations[integrationId]
//         setSelectedOperations(newOperations)
//         return prev.filter((id) => id !== integrationId)
//       } else {
//         return [...prev, integrationId]
//       }
//     })
//   }

//   const handleOperationToggle = (integrationId: string, operation: string) => {
//     setSelectedOperations((prev) => ({
//       ...prev,
//       [integrationId]: prev[integrationId]?.includes(operation)
//         ? prev[integrationId].filter((op) => op !== operation)
//         : [...(prev[integrationId] || []), operation],
//     }))
//   }

//   const handleGoalToggle = (goalId: string) => {
//     setSelectedGoals((prev) => (prev.includes(goalId) ? prev.filter((id) => id !== goalId) : [...prev, goalId]))
//   }

//   const handleInitialSubmit = (): void => {
//     if (!workflowRequest.trim()) {
//       setResponseStatus("❌ Please describe your Instagram automation needs")
//       return
//     }
//     if (selectedGoals.length === 0) {
//       setResponseStatus("❌ Please select at least one automation goal")
//       return
//     }
//     generateWorkflowWithAI("initial")
//   }

//   const handleRefine = (): void => {
//     if (!refinementInput.trim()) {
//       setResponseStatus("❌ Please provide refinement instructions")
//       return
//     }
//     generateWorkflowWithAI("refine", refinementInput)
//     setRefinementInput("")
//   }

//   const handleApprove = async (): Promise<void> => {
//     setIsGenerating(true)
//     setResponseStatus("📧 Submitting Instagram workflow to development team...")

//     try {
//       const payload = {
//         title: parsedWorkflow?.title || "Instagram Automation Workflow",
//         businessObjective: parsedWorkflow?.description || "Instagram DM automation",
//         businessInfo: businessInfo,
//         workflowDesign: {
//           title: parsedWorkflow?.title,
//           description: parsedWorkflow?.description,
//           platform: parsedWorkflow?.platform,
//           estimatedBuildTime: parsedWorkflow?.estimatedBuildTime,
//           complexity: parsedWorkflow?.complexity,
//           steps: streamingSteps.map(step => ({
//             stepNumber: step.stepNumber,
//             title: step.title,
//             description: step.description,
//             type: step.type,
//             inputs: step.inputs,
//             outputs: step.outputs,
//             details: step.details,
//             voiceflowAction: step.voiceflowAction,
//             businessImpact: step.businessImpact,
//             estimatedTime: step.estimatedTime,
//             complexity: step.complexity,
//             assignedIntegration: step.assignedIntegration
//           })),
//           integrations: getAssignedIntegrations(streamingSteps),
//           benefits: parsedWorkflow?.benefits,
//           exampleScenario: parsedWorkflow?.exampleScenario,
//           voiceflowFeatures: parsedWorkflow?.voiceflowFeatures,
//           instagramFocus: parsedWorkflow?.instagramFocus,
//           estimatedCost: parsedWorkflow?.estimatedCost,
//           roi: parsedWorkflow?.roi,
//           metrics: parsedWorkflow?.metrics
//         },
//         selectedIntegrations: selectedIntegrations,
//         selectedOperations: selectedOperations,
//         selectedGoals: selectedGoals,
//         customRequest: workflowRequest,
//         platform: "Instagram",
//         submittedAt: new Date().toISOString(),
//         urgency: "NORMAL",
//       }

//       // Store in localStorage
//       const workflowId = `instagram-${Date.now()}`
//       localStorage.setItem(`workflow-submission-${workflowId}`, JSON.stringify(payload))

//       setResponseStatus("✅ Instagram workflow submitted successfully!")

//       const pendingData = {
//         id: workflowId,
//         submittedAt: new Date().toISOString(),
//         status: "PENDING_CREATION",
//         workflowType: "Instagram Automation",
//         estimatedCompletion: "1-2 weeks",
//       }

//       localStorage.setItem("pendingWorkflow", JSON.stringify(pendingData))

//       setTimeout(() => {
//         if (setStep) setStep("pending")
//       }, 2000)
//     } catch (error) {
//       setResponseStatus("❌ Failed to submit workflow. Please try again.")
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   const toggleStepExpansion = (stepNumber: number): void => {
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

//   // Enhanced components
//   const StreamingProgress: React.FC = () => {
//     if (!isGenerating) return null

//     const phases = [
//       { title: "Analyzing Requirements", icon: Brain, color: "text-blue-500" },
//       { title: "Designing Architecture", icon: Workflow, color: "text-purple-500" },
//       { title: "Assigning Integrations", icon: Link2, color: "text-green-500" },
//       { title: "Finalizing Workflow", icon: CheckCircle, color: "text-pink-500" },
//     ]

//     const currentPhaseData = phases[currentPhase] || phases[0]
//     const IconComponent = currentPhaseData.icon

//     return (
//       <div className="mb-8">
//         <div className="flex items-center justify-center mb-6">
//           <div className="relative">
//             <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 flex items-center justify-center">
//               <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-pink-500 border-r-purple-500 animate-spin"></div>
//               <IconComponent className={`h-10 w-10 ${currentPhaseData.color} animate-pulse`} />
//             </div>
//           </div>
//         </div>

//         <div className="text-center mb-6">
//           <h3 className="text-xl font-semibold mb-2">{currentPhaseData.title}</h3>
//           <p className="text-muted-foreground">
//             DeepSeek AI is creating your custom Instagram automation workflow...
//           </p>
//           {estimatedTimeRemaining > 0 && (
//             <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground">
//               <Clock className="h-4 w-4" />
//               <span>Estimated time remaining: {estimatedTimeRemaining}s</span>
//             </div>
//           )}
//         </div>

//         <div className="mb-6">
//           <div className="flex justify-between text-sm text-muted-foreground mb-2">
//             <span>Progress</span>
//             <span>{Math.round(streamingProgress)}%</span>
//           </div>
//           <Progress value={streamingProgress} className="h-3 mb-4" />
//         </div>

//         <div className="flex justify-center gap-6 mb-6">
//           {phases.map((phase, index) => {
//             const PhaseIcon = phase.icon
//             return (
//               <div key={index} className="flex flex-col items-center">
//                 <div
//                   className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
//                     index < currentPhase
//                       ? "bg-green-500 text-white shadow-lg"
//                       : index === currentPhase
//                         ? "bg-pink-500 text-white animate-pulse shadow-lg"
//                         : "bg-gray-200 text-gray-400"
//                   }`}
//                 >
//                   {index < currentPhase ? <CheckCircle className="h-6 w-6" /> : <PhaseIcon className="h-6 w-6" />}
//                 </div>
//                 <span
//                   className={`text-xs mt-2 text-center font-medium ${
//                     index === currentPhase ? "text-pink-600 dark:text-pink-400" : "text-muted-foreground"
//                   }`}
//                 >
//                   {phase.title.split(" ")[0]}
//                 </span>
//               </div>
//             )
//           })}
//         </div>

//         {/* AI Thoughts */}
//         {aiThoughts.length > 0 && (
//           <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-pink-200 dark:border-pink-700">
//             <div className="flex items-center gap-2 mb-3">
//               <Brain className="h-4 w-4 text-pink-500" />
//               <span className="text-sm font-medium text-pink-700 dark:text-pink-300">DeepSeek AI Progress</span>
//             </div>
//             <div className="space-y-2">
//               {aiThoughts.map((thought, index) => (
//                 <div
//                   key={index}
//                   className={`text-xs text-pink-600 dark:text-pink-400 transition-opacity duration-500 ${
//                     index === aiThoughts.length - 1 ? "opacity-100 font-medium" : "opacity-70"
//                   }`}
//                 >
//                   {thought}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     )
//   }

//   const StepComponent: React.FC<{ step: WorkflowStep }> = ({ step }) => {
//     const config = stepTypeConfigs[step.type] || stepTypeConfigs.trigger
//     const IconComponent = step.icon || config.icon
//     const isExpanded = expandedSteps.has(step.stepNumber)

//     return (
//       <div
//         data-step-id={step.id}
//         className={`relative transition-all duration-500 ${step.isAnimating ? "animate-pulse" : ""}`}
//       >
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
//           {/* Step Header */}
//           <div className="p-6">
//             <div className="flex items-center gap-4">
//               {/* Step Number with Icon */}
//               <div className="relative">
//                 <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-xl">
//                   {step.stepNumber}
//                 </div>
//                 <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
//                   <IconComponent className={`h-4 w-4 ${config.color}`} />
//                 </div>
//               </div>

//               {/* Step Content */}
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

//                 {/* Input/Output Flow */}
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

//               {/* Expand Icon */}
//               <div className="flex items-center">
//                 {isExpanded ? (
//                   <ChevronDown className="h-6 w-6 text-muted-foreground" />
//                 ) : (
//                   <ChevronRight className="h-6 w-6 text-muted-foreground" />
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Expanded Details */}
//           {isExpanded && (
//             <div className="border-t border-white/50 bg-white/30 dark:bg-black/10 p-6">
//               <div className="grid lg:grid-cols-2 gap-6">
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
//                     <Settings className="h-4 w-4 text-purple-500" />
//                     Voiceflow Configuration
//                   </h5>
//                   <div className="space-y-3 text-sm">
//                     <div className="flex justify-between items-center">
//                       <span className="text-muted-foreground">Block Type:</span>
//                       <Badge variant="secondary">{step.voiceflowAction}</Badge>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-muted-foreground">Execution Time:</span>
//                       <Badge variant="secondary">{step.estimatedTime}</Badge>
//                     </div>
//                     {step.assignedIntegration && (
//                       <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
//                         <div className="flex items-center gap-2 mb-2">
//                           <step.assignedIntegration.icon className="h-4 w-4 text-green-600" />
//                           <span className="font-medium text-green-700 dark:text-green-300">
//                             {step.assignedIntegration.name} Integration
//                           </span>
//                         </div>
//                         <p className="text-xs text-green-600 dark:text-green-400">
//                           {step.assignedIntegration.description}
//                         </p>
//                         {selectedOperations[step.assignedIntegration.id] && (
//                           <div className="mt-2">
//                             <span className="text-xs font-medium text-green-700 dark:text-green-300">
//                               Available Operations:
//                             </span>
//                             <div className="flex flex-wrap gap-1 mt-1">
//                               {selectedOperations[step.assignedIntegration.id].map((op) => (
//                                 <Badge key={op} variant="outline" className="text-xs">
//                                   {op}
//                                 </Badge>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                     {step.businessImpact && (
//                       <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
//                         <div className="flex items-center gap-2 mb-1">
//                           <TrendingUp className="h-4 w-4 text-blue-600" />
//                           <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Business Impact</span>
//                         </div>
//                         <p className="text-xs text-blue-600 dark:text-blue-400">{step.businessImpact}</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Connection Line */}
//         {step.stepNumber < (streamingSteps.length || 1) && (
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
//           <Button variant="ghost" className="mb-6 hover:bg-accent" onClick={() => setStep?.("selection")}>
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Selection
//           </Button>
//           <div className="text-center mb-8">
//             <div className="flex items-center justify-center gap-3 mb-4">
//               <Instagram className="h-12 w-12 text-pink-500" />
//               <h1 className="text-5xl font-bold">Instagram Automation Builder</h1>
//             </div>
//             <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
//               Create intelligent Instagram DM automation workflows using DeepSeek AI, Voiceflow, and your preferred integrations.
//             </p>
//             <div className="flex items-center justify-center gap-6 mt-4 text-sm text-muted-foreground">
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
//                 <span>DeepSeek AI Powered</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
//                 <span>Voiceflow-Compatible</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//                 <span>Smart Integrations</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid gap-8 lg:grid-cols-3">
//           {/* Left Column - Configuration */}
//           <div className="lg:col-span-1 space-y-6">
//             {/* Supported Integrations Section */}
//             <Card className="border-2 border-border bg-card/50 backdrop-blur-sm">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Link2 className="h-5 w-5 text-primary" />
//                   Available Integrations
//                 </CardTitle>
//                 <CardDescription>Select the tools you want to integrate with your Instagram automation</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <Alert>
//                   <Info className="h-4 w-4" />
//                   <AlertDescription>
//                     Choose integrations that will help your AI agent provide better customer support on Instagram. Each workflow step can use at most one integration.
//                   </AlertDescription>
//                 </Alert>

//                 {SUPPORTED_INTEGRATIONS.map((integration) => {
//                   const IconComponent = integration.icon
//                   const isSelected = selectedIntegrations.includes(integration.id)

//                   return (
//                     <div key={integration.id} className="space-y-3">
//                       <div
//                         className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
//                           isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
//                         }`}
//                         onClick={() => handleIntegrationToggle(integration.id)}
//                       >
//                         <div className="flex items-center gap-3">
//                           <IconComponent className="h-5 w-5 text-primary" />
//                           <div className="flex-grow">
//                             <div className="flex items-center gap-2">
//                               <span className="font-medium">{integration.name}</span>
//                               <Badge variant="outline" className="text-xs">
//                                 {integration.setupComplexity}
//                               </Badge>
//                             </div>
//                             <p className="text-sm text-muted-foreground mt-1">{integration.description}</p>
//                           </div>
//                           {isSelected && <Check className="h-4 w-4 text-primary" />}
//                         </div>
//                       </div>

//                       {/* Operations Selection */}
//                       {isSelected && (
//                         <div className="ml-4 p-3 bg-muted/50 rounded-lg">
//                           <Label className="text-sm font-medium mb-2 block">Select operations to allow:</Label>
//                           <div className="space-y-2">
//                             {integration.operations.map((operation) => (
//                               <div key={operation} className="flex items-center space-x-2">
//                                 <Checkbox
//                                   id={`${integration.id}-${operation}`}
//                                   checked={selectedOperations[integration.id]?.includes(operation) || false}
//                                   onCheckedChange={(checked) => handleOperationToggle(integration.id, operation)}
//                                 />
//                                 <Label htmlFor={`${integration.id}-${operation}`} className="text-sm cursor-pointer">
//                                   {operation}
//                                 </Label>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   )
//                 })}
//               </CardContent>
//             </Card>

//             {/* Instagram Goals Selection */}
//             <Card className="border-2 border-border bg-card/50 backdrop-blur-sm">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Target className="h-5 w-5 text-primary" />
//                   Automation Goals
//                 </CardTitle>
//                 <CardDescription>What do you want to achieve with Instagram automation?</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 {instagramGoals.map((goal) => {
//                   const IconComponent = goal.icon
//                   const isSelected = selectedGoals.includes(goal.id)

//                   return (
//                     <div
//                       key={goal.id}
//                       className={`p-3 rounded-lg border cursor-pointer transition-all ${
//                         isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
//                       }`}
//                       onClick={() => handleGoalToggle(goal.id)}
//                     >
//                       <div className="flex items-start gap-3">
//                         <IconComponent className="h-4 w-4 text-primary mt-1" />
//                         <div className="flex-grow">
//                           <span className="text-sm font-medium block">{goal.label}</span>
//                           <span className="text-xs text-muted-foreground">{goal.description}</span>
//                         </div>
//                         {isSelected && <Check className="h-4 w-4 text-primary" />}
//                       </div>
//                     </div>
//                   )
//                 })}
//               </CardContent>
//             </Card>

//             {/* Workflow Request */}
//             <Card className="border-2 border-border bg-card/50 backdrop-blur-sm">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Wand2 className="h-5 w-5 text-primary" />
//                   {!hasInitialRequest ? "Describe Your Instagram Automation" : "Refine Your Workflow"}
//                 </CardTitle>
//                 <CardDescription>
//                   {!hasInitialRequest
//                     ? "Tell us about your specific Instagram automation needs"
//                     : "Provide feedback to improve the workflow"}
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 {!hasInitialRequest ? (
//                   <>
//                     <div className="space-y-3">
//                       <Label htmlFor="workflowRequest" className="text-base font-semibold">
//                         Instagram Automation Requirements
//                       </Label>
//                       <Textarea
//                         id="workflowRequest"
//                         value={workflowRequest}
//                         onChange={(e) => setWorkflowRequest(e.target.value)}
//                         placeholder="e.g., 'I want to automatically respond to Instagram DMs asking about product pricing, capture lead information, and follow up with email campaigns. When someone asks about appointments, I want to integrate with my booking system and send calendar links.'"
//                         rows={6}
//                         className="bg-background border-2 border-pink-200 focus:border-pink-500 resize-none text-sm"
//                         disabled={isGenerating}
//                       />
//                     </div>
//                     <Button
//                       onClick={handleInitialSubmit}
//                       disabled={isGenerating || !workflowRequest.trim()}
//                       className="w-full flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 text-base"
//                     >
//                       {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Instagram className="h-5 w-5" />}
//                       Generate with DeepSeek AI
//                     </Button>
//                   </>
//                 ) : (
//                   <>
//                     <div className="space-y-3">
//                       <Label htmlFor="refinementInput" className="text-base font-semibold">
//                         Refinement Instructions
//                       </Label>
//                       <Textarea
//                         id="refinementInput"
//                         value={refinementInput}
//                         onChange={(e) => setRefinementInput(e.target.value)}
//                         placeholder="e.g., 'Add a step to check business hours before responding', 'Include product availability checking', 'Add sentiment analysis for priority routing'"
//                         rows={4}
//                         className="bg-white/50 border-2 border-pink-200 focus:border-pink-500 resize-none"
//                         disabled={isGenerating}
//                       />
//                     </div>
//                     <div className="flex gap-3">
//                       <Button
//                         onClick={handleRefine}
//                         disabled={isGenerating || !refinementInput.trim()}
//                         className="flex-1 flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
//                       >
//                         {isGenerating && currentAction === "refine" ? (
//                           <Loader2 className="h-4 w-4 animate-spin" />
//                         ) : (
//                           <RefreshCw className="h-4 w-4" />
//                         )}
//                         Refine
//                       </Button>
//                       <Button
//                         onClick={handleApprove}
//                         disabled={isGenerating || !parsedWorkflow}
//                         variant="secondary"
//                         className="flex-1 flex items-center gap-2 font-medium"
//                       >
//                         {isGenerating && currentAction === "approve" ? (
//                           <Loader2 className="h-4 w-4 animate-spin" />
//                         ) : (
//                           <ThumbsUp className="h-4 w-4" />
//                         )}
//                         Submit
//                       </Button>
//                     </div>
//                   </>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Right Column - Generated Workflow */}
//           <div className="lg:col-span-2">
//             <Card className="border-2 border-border min-h-[700px] bg-card backdrop-blur-sm">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Instagram className="h-6 w-6 text-pink-500" />
//                   Instagram Automation Workflow
//                   {parsedWorkflow && (
//                     <Badge variant="outline" className="ml-auto">
//                       <Star className="h-3 w-3 mr-1" />
//                       DeepSeek AI Generated
//                     </Badge>
//                   )}
//                 </CardTitle>
//                 <CardDescription className="text-base">
//                   AI-generated Instagram DM automation workflow optimized for Voiceflow implementation
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {/* Status Message */}
//                 {responseStatus && (
//                   <div
//                     className={`mb-6 p-4 rounded-xl border-2 ${
//                       responseStatus.includes("✅")
//                         ? "bg-secondary/50 border-secondary text-secondary-foreground"
//                         : responseStatus.includes("❌")
//                           ? "bg-destructive/10 border-destructive/50 text-destructive"
//                           : "bg-primary/10 border-primary/50 text-primary"
//                     }`}
//                   >
//                     <div className="flex items-center gap-3">
//                       {responseStatus.includes("✅") ? (
//                         <CheckCircle className="h-5 w-5" />
//                       ) : responseStatus.includes("❌") ? (
//                         <AlertCircle className="h-5 w-5" />
//                       ) : (
//                         <Loader2 className="h-5 w-5 animate-spin" />
//                       )}
//                       <span className="font-medium">{responseStatus}</span>
//                     </div>
//                   </div>
//                 )}

//                 {/* Streaming Progress */}
//                 {isGenerating && <StreamingProgress />}

//                 {/* Workflow Header */}
//                 {parsedWorkflow && !isGenerating && (
//                   <div className="mb-8 p-8 rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border-2 border-pink-200 dark:border-pink-700">
//                     <div className="text-center mb-8">
//                       <h3 className="text-3xl font-bold mb-3 text-foreground">{parsedWorkflow.title}</h3>
//                       <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
//                         {parsedWorkflow.description}
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//                       <div className="text-center p-4 bg-card rounded-xl shadow-sm border border-border">
//                         <div className="text-2xl font-bold text-pink-500 mb-1">
//                           {parsedWorkflow.metrics?.automationRate}
//                         </div>
//                         <div className="text-xs text-muted-foreground font-medium">Automation Rate</div>
//                       </div>
//                       <div className="text-center p-4 bg-card rounded-xl shadow-sm border border-border">
//                         <div className="text-2xl font-bold text-pink-500 mb-1">
//                           {parsedWorkflow.metrics?.responseTime}
//                         </div>
//                         <div className="text-xs text-muted-foreground font-medium">Response Time</div>
//                       </div>
//                       <div className="text-center p-4 bg-card rounded-xl shadow-sm border border-border">
//                         <div className="text-2xl font-bold text-pink-500 mb-1">{parsedWorkflow.metrics?.accuracy}</div>
//                         <div className="text-xs text-muted-foreground font-medium">AI Accuracy</div>
//                       </div>
//                       <div className="text-center p-4 bg-card rounded-xl shadow-sm border border-border">
//                         <div className="text-2xl font-bold text-pink-500 mb-1">{parsedWorkflow.estimatedBuildTime}</div>
//                         <div className="text-xs text-muted-foreground font-medium">Build Time</div>
//                       </div>
//                     </div>

//                     {/* Integration Summary */}
//                     {parsedWorkflow.integrations.length > 0 && (
//                       <div className="mb-4">
//                         <h4 className="font-semibold mb-3 flex items-center gap-2">
//                           <Zap className="h-4 w-4 text-primary" />
//                           Assigned Integrations
//                         </h4>
//                         <div className="flex flex-wrap gap-2">
//                           {parsedWorkflow.integrations.map((integration) => (
//                             <Badge key={integration.id} variant="secondary" className="flex items-center gap-1">
//                               <integration.icon className="h-3 w-3" />
//                               {integration.name}
//                             </Badge>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Streaming Steps */}
//                 {(isStreaming || streamingSteps.length > 0) && (
//                   <div ref={stepContainerRef} className="space-y-8">
//                     <div className="flex items-center gap-4 mb-8">
//                       <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl shadow-lg">
//                         <Workflow className="h-6 w-6 text-white" />
//                       </div>
//                       <div>
//                         <h3 className="text-2xl font-bold">Instagram Workflow Steps</h3>
//                         <p className="text-muted-foreground">DeepSeek AI generated, Voiceflow-compatible automation steps</p>
//                       </div>
//                       <Badge variant="outline" className="ml-auto text-base px-3 py-1">
//                         {streamingSteps.length} steps
//                       </Badge>
//                     </div>

//                     {streamingSteps.map((step) => (
//                       <StepComponent key={step.id} step={step} />
//                     ))}

//                     {isStreaming && (
//                       <div className="flex justify-center py-8">
//                         <div className="flex items-center gap-3 text-muted-foreground">
//                           <Loader2 className="h-5 w-5 animate-spin" />
//                           <span className="font-medium">DeepSeek AI is generating more steps...</span>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Initial State */}
//                 {!isGenerating && !parsedWorkflow && !hasInitialRequest && (
//                   <div className="flex flex-col items-center justify-center py-24 text-center">
//                     <div className="relative mb-8">
//                       <div className="w-24 h-24 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
//                         <Instagram className="h-12 w-12 text-pink-500" />
//                       </div>
//                       <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
//                         <Sparkles className="h-4 w-4 text-white" />
//                       </div>
//                     </div>
//                     <h3 className="text-2xl font-bold mb-4">Ready to Build Your Instagram Automation</h3>
//                     <p className="text-center max-w-lg mb-8 text-muted-foreground leading-relaxed">
//                       Configure your integrations and automation goals, then describe your Instagram automation needs.
//                       DeepSeek AI will create a Voiceflow-compatible workflow tailored to your requirements.
//                     </p>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground">
//                       <div className="flex flex-col items-center gap-2 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
//                         <Instagram className="h-5 w-5 text-pink-500" />
//                         <span className="font-medium">Instagram DMs</span>
//                       </div>
//                       <div className="flex flex-col items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
//                         <Workflow className="h-5 w-5 text-blue-500" />
//                         <span className="font-medium">Voiceflow Ready</span>
//                       </div>
//                       <div className="flex flex-col items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
//                         <Zap className="h-5 w-5 text-green-500" />
//                         <span className="font-medium">Smart Integrations</span>
//                       </div>
//                       <div className="flex flex-col items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
//                         <Brain className="h-5 w-5 text-purple-500" />
//                         <span className="font-medium">DeepSeek AI</span>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default VoiceflowWorkflowBuilder

"use client"

import type React from "react"
import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Sparkles, Loader2, CheckCircle, Settings, ThumbsUp, MessageCircle, RefreshCw, Zap, AlertCircle, PlayCircle, Workflow, ChevronDown, ChevronRight, Database, Filter, Mail, Star, Brain, Layers, Wand2, Check, Link2, Instagram, FileSpreadsheet, FileText, Users, Target, MessageSquare, Heart, UserPlus, ShoppingBag, Calendar, Info, Clock, TrendingUp } from 'lucide-react'

import { generateWorkflowWithDeepSeek } from "@/actions/workflow-generator/deepseek-actions"

// TypeScript interfaces
interface BusinessInfo {
  businessName: string
  businessType: string
  description?: string
  website?: string
  phone?: string
  email?: string
}

interface VoiceflowWorkflowBuilderProps {
  businessInfo?: BusinessInfo
  selectedWorkflowId?: string | null
  setStep?: (step: "selection" | "dashboard" | "pending") => void
  setActiveWorkflowExists?: (exists: boolean) => void
  setActiveWorkflowDetails?: (details: any) => void
}

interface Integration {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  operations: string[]
  voiceflowCompatible: boolean
  setupComplexity: "easy" | "medium" | "hard"
  commonUseCases: string[]
}

interface WorkflowStep {
  id: string
  stepNumber: number
  title: string
  description: string
  type: string
  inputs?: string[]
  outputs?: string[]
  estimatedTime?: string
  icon?: React.ComponentType<{ className?: string }>
  color?: string
  bgColor?: string
  borderColor?: string
  details?: string[]
  isAnimating?: boolean
  assignedIntegration?: Integration | null
  voiceflowAction?: string
  complexity?: "low" | "medium" | "high"
  businessImpact?: string
}

interface ParsedWorkflow {
  title: string
  description: string
  platform: string
  estimatedBuildTime: string
  complexity: string
  steps: WorkflowStep[]
  integrations: Integration[]
  benefits: string[]
  exampleScenario: string
  voiceflowFeatures: string[]
  instagramFocus: string[]
  estimatedCost?: string
  roi?: string
  metrics?: {
    automationRate: string
    responseTime: string
    accuracy: string
    scalability: string
  }
}

interface DeepSeekResponse {
  success: boolean
  workflowData?: any
  error?: string
}

// Supported Integrations (limited to the 4 specified)
const SUPPORTED_INTEGRATIONS: Integration[] = [
  {
    id: "airtable",
    name: "Airtable",
    description: "Cloud-based database for storing and managing customer data, leads, and interactions",
    icon: Database,
    operations: [
      "Create records",
      "Update records", 
      "Search records",
      "Delete records",
      "List records",
      "Get record by ID",
    ],
    voiceflowCompatible: true,
    setupComplexity: "easy",
    commonUseCases: [
      "Store customer inquiries",
      "Track lead information",
      "Manage product catalogs",
      "Log interaction history",
    ],
  },
  {
    id: "google-sheets",
    name: "Google Sheets",
    description: "Spreadsheet platform for data tracking, reporting, and team collaboration",
    icon: FileSpreadsheet,
    operations: ["Add rows", "Update cells", "Read data", "Create sheets", "Format cells", "Calculate formulas"],
    voiceflowCompatible: true,
    setupComplexity: "easy",
    commonUseCases: [
      "Track engagement metrics",
      "Generate reports",
      "Store contact lists",
      "Monitor campaign performance",
    ],
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    description: "Email marketing platform for newsletters, campaigns, and audience management",
    icon: Mail,
    operations: [
      "Add subscribers",
      "Send campaigns",
      "Create audiences",
      "Update subscriber info",
      "Remove subscribers",
      "Track campaign stats",
    ],
    voiceflowCompatible: true,
    setupComplexity: "medium",
    commonUseCases: [
      "Build email lists from Instagram",
      "Send follow-up campaigns",
      "Segment audiences",
      "Automate email sequences",
    ],
  },
  {
    id: "notion",
    name: "Notion",
    description: "All-in-one workspace for notes, databases, and team collaboration",
    icon: FileText,
    operations: [
      "Create pages",
      "Update databases",
      "Add database entries",
      "Search content",
      "Create templates",
      "Manage properties",
    ],
    voiceflowCompatible: true,
    setupComplexity: "medium",
    commonUseCases: [
      "Document customer interactions",
      "Create knowledge bases",
      "Track project progress",
      "Manage content calendars",
    ],
  },
]

// Default business info
const defaultBusinessInfo: BusinessInfo = {
  businessName: "Your Business",
  businessType: "Technology Company",
  description: "We provide innovative solutions for businesses",
  website: "https://yourbusiness.com",
  phone: "+1-555-0123",
  email: "contact@yourbusiness.com",
}

// Step type configurations optimized for Voiceflow
const stepTypeConfigs: Record<string, any> = {
  trigger: {
    icon: PlayCircle,
    color: "text-primary",
    bgColor: "from-primary/10 to-primary/20",
    borderColor: "border-primary/30",
    voiceflowBlock: "Intent Block",
  },
  analysis: {
    icon: Brain,
    color: "text-secondary-foreground",
    bgColor: "from-secondary/10 to-secondary/20",
    borderColor: "border-secondary/30",
    voiceflowBlock: "AI Block",
  },
  filter: {
    icon: Filter,
    color: "text-accent-foreground",
    bgColor: "from-accent/10 to-accent/20",
    borderColor: "border-accent/30",
    voiceflowBlock: "Condition Block",
  },
  response: {
    icon: MessageCircle,
    color: "text-muted-foreground",
    bgColor: "from-muted/10 to-muted/20",
    borderColor: "border-muted/30",
    voiceflowBlock: "Text Block",
  },
  integration: {
    icon: Zap,
    color: "text-primary",
    bgColor: "from-primary/10 to-primary/20",
    borderColor: "border-primary/30",
    voiceflowBlock: "API Block",
  },
  storage: {
    icon: Database,
    color: "text-muted-foreground",
    bgColor: "from-muted/10 to-muted/20",
    borderColor: "border-muted/30",
    voiceflowBlock: "Set Block",
  },
}

const VoiceflowWorkflowBuilder: React.FC<VoiceflowWorkflowBuilderProps> = ({
  businessInfo = defaultBusinessInfo,
  selectedWorkflowId,
  setStep,
  setActiveWorkflowExists,
  setActiveWorkflowDetails,
}) => {
  const [workflowRequest, setWorkflowRequest] = useState<string>("")
  const [parsedWorkflow, setParsedWorkflow] = useState<ParsedWorkflow | null>(null)
  const [refinementInput, setRefinementInput] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [responseStatus, setResponseStatus] = useState<string | null>(null)
  const [currentAction, setCurrentAction] = useState<"initial" | "refine" | "approve">("initial")
  const [hasInitialRequest, setHasInitialRequest] = useState<boolean>(false)
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set())
  const [generationStartTime, setGenerationStartTime] = useState<number>(0)

  // New state for integration selection
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])
  const [selectedOperations, setSelectedOperations] = useState<Record<string, string[]>>({})

  // Streaming states
  const [streamingSteps, setStreamingSteps] = useState<WorkflowStep[]>([])
  const [currentPhase, setCurrentPhase] = useState<number>(0)
  const [isStreaming, setIsStreaming] = useState<boolean>(false)
  const [streamingProgress, setStreamingProgress] = useState<number>(0)
  const [aiThoughts, setAiThoughts] = useState<string[]>([])
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number>(0)
  const stepContainerRef = useRef<HTMLDivElement>(null)

  // Instagram-specific automation goals
  const instagramGoals = [
    { id: "lead-generation", label: "Lead Generation from DMs", icon: UserPlus, description: "Capture and qualify leads from Instagram conversations" },
    { id: "customer-support", label: "Customer Support Automation", icon: MessageSquare, description: "Provide instant support and resolve common issues" },
    { id: "product-inquiries", label: "Product Inquiry Handling", icon: ShoppingBag, description: "Answer product questions and share information" },
    { id: "appointment-booking", label: "Appointment/Consultation Booking", icon: Calendar, description: "Schedule meetings and consultations automatically" },
    { id: "content-engagement", label: "Content Engagement Responses", icon: Heart, description: "Respond to comments and engagement on posts" },
    { id: "influencer-outreach", label: "Influencer/Partnership Outreach", icon: Users, description: "Manage collaboration and partnership requests" },
  ]

  const [selectedGoals, setSelectedGoals] = useState<string[]>(["customer-support"])

  // Enhanced workflow generation with timeout handling
  const generateWorkflowWithAI = useCallback(
    async (action: "initial" | "refine", instructions?: string): Promise<void> => {
      setIsGenerating(true)
      setIsStreaming(true)
      setCurrentPhase(0)
      setStreamingProgress(0)
      setStreamingSteps([])
      setAiThoughts([])
      setGenerationStartTime(Date.now())
      setEstimatedTimeRemaining(20) // Reduced to match server timeout
      setResponseStatus("🧠 Connecting to DeepSeek AI...")
      setCurrentAction(action)
      setHasInitialRequest(true)

      let progressInterval: NodeJS.Timeout | null = null

      try {
        // Real-time progress updates
        progressInterval = setInterval(() => {
          setEstimatedTimeRemaining(prev => Math.max(0, prev - 1))
        }, 1000)

        // Update progress phases
        addAiThought("🤖 Sending optimized request to DeepSeek AI...")
        setCurrentPhase(1)
        setStreamingProgress(25)

        // Add progress updates
        setTimeout(() => {
          if (isGenerating) {
            addAiThought("⚡ Processing with optimized settings...")
            setStreamingProgress(50)
          }
        }, 8000)

        // Call server action with reduced timeout
        const startTime = Date.now()
        const aiResponse = await Promise.race([
          generateWorkflowWithDeepSeek({
            action,
            businessInfo,
            selectedIntegrations,
            selectedOperations,
            selectedGoals,
            workflowRequest,
            instructions,
            currentWorkflow: parsedWorkflow ? {
              title: parsedWorkflow.title,
              description: parsedWorkflow.description,
              steps: streamingSteps
            } : undefined
        }),
        // Reduced client-side timeout
        new Promise<DeepSeekResponse>((_, reject) => 
          setTimeout(() => reject(new Error('Client timeout - please try with simpler requirements')), 60000)
        )
      ])

      const duration = Date.now() - startTime
      console.log(`Request completed in ${duration}ms`)

      if (progressInterval) {
        clearInterval(progressInterval)
        progressInterval = null
      }

      // Check response
      if (!aiResponse) {
        throw new Error("No response received from server")
      }

      if (aiResponse.success && aiResponse.workflowData) {
        addAiThought("🧠 Processing AI-generated workflow...")
        setCurrentPhase(2)
        setStreamingProgress(70)

        addAiThought("✨ Creating workflow steps...")
        setCurrentPhase(3)
        setStreamingProgress(85)

        // Validate workflow data structure
        if (!aiResponse.workflowData.steps || !Array.isArray(aiResponse.workflowData.steps)) {
          throw new Error("Invalid workflow data structure received")
        }

        // Process the AI-generated steps
        const workflowSteps = await processAIGeneratedSteps(aiResponse.workflowData.steps)

        const workflow: ParsedWorkflow = {
          title: aiResponse.workflowData.title || `${businessInfo.businessName} Instagram Automation`,
          description: aiResponse.workflowData.description || `Custom Instagram DM automation workflow`,
          platform: "Instagram DMs via Voiceflow",
          estimatedBuildTime: "1-2 weeks",
          complexity: "Custom",
          steps: workflowSteps,
          integrations: getAssignedIntegrations(workflowSteps),
          benefits: aiResponse.workflowData.benefits || [
            "Custom AI-generated automation",
            "Instagram-optimized workflow",
            "Voiceflow-compatible implementation"
          ],
          exampleScenario: aiResponse.workflowData.exampleScenario || "Custom workflow tailored to your specific requirements",
          voiceflowFeatures: [
            "Custom Intent Recognition",
            "Dynamic Conditional Logic", 
            "Tailored API Integrations",
            "Personalized Response Generation"
          ],
          instagramFocus: [
            "Custom DM automation flow",
            "Personalized customer interactions",
            "Business-specific automation logic"
          ],
          estimatedCost: "$200-500/month",
          roi: "300-600% within 3 months",
          metrics: {
            automationRate: "90%",
            responseTime: "< 15 seconds", 
            accuracy: "94%",
            scalability: "High",
          },
        }

        setParsedWorkflow(workflow)
        setStreamingProgress(100)
        setResponseStatus("✅ Custom Instagram workflow generated successfully!")
        addAiThought("🎉 Workflow ready for Voiceflow implementation!")
      } else {
        // Handle error response with better messaging
        const errorMessage = aiResponse?.error || "Unknown error occurred"
        
        // Provide specific guidance based on error type
        let userGuidance = ""
        if (errorMessage.includes('timeout') || errorMessage.includes('overloaded')) {
          userGuidance = " Try using shorter, more specific requirements or wait a moment before retrying."
        } else if (errorMessage.includes('format') || errorMessage.includes('invalid')) {
          userGuidance = " Try rephrasing your request with clearer, simpler language."
        } else if (errorMessage.includes('API') || errorMessage.includes('key')) {
          userGuidance = " Please contact support if this persists."
        }
        
        throw new Error(errorMessage + userGuidance)
      }
    } catch (error) {
      console.error("AI generation error:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      
      // Provide more helpful error messages
      let userFriendlyMessage = errorMessage
      if (errorMessage.includes('timeout')) {
        userFriendlyMessage = "⏱️ Request timed out. Try using shorter, more specific requirements, or wait a moment before retrying."
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        userFriendlyMessage = "🌐 Network issue. Please check your connection and try again."
      } else if (errorMessage.includes('API key')) {
        userFriendlyMessage = "🔑 API configuration issue. Please contact support."
      }
      
      setResponseStatus(`❌ Generation failed: ${userFriendlyMessage}`)
      addAiThought("💡 Try shorter, more specific requirements for faster processing.")
    } finally {
      if (progressInterval) {
        clearInterval(progressInterval)
      }
      setIsStreaming(false)
      setTimeout(() => {
        setIsGenerating(false)
      }, 1000)
    }
  },
  [businessInfo, selectedIntegrations, selectedOperations, selectedGoals, workflowRequest, parsedWorkflow, streamingSteps, isGenerating],
)

  // Process AI-generated steps with enhanced streaming
  const processAIGeneratedSteps = async (aiSteps: any[]): Promise<WorkflowStep[]> => {
    const steps: WorkflowStep[] = []
    const availableIntegrations = [...selectedIntegrations]

    for (let i = 0; i < aiSteps.length; i++) {
      const aiStep = aiSteps[i]
      const config = stepTypeConfigs[aiStep.type] || stepTypeConfigs.trigger

      // Assign integration based on AI recommendation
      let assignedIntegration: Integration | null = null
      if (aiStep.needsIntegration && availableIntegrations.length > 0) {
        const integrationId = availableIntegrations.shift()!
        assignedIntegration = SUPPORTED_INTEGRATIONS.find((int) => int.id === integrationId) || null
      }

      const step: WorkflowStep = {
        id: `step-${i + 1}`,
        stepNumber: i + 1,
        title: aiStep.title,
        description: aiStep.description,
        type: aiStep.type,
        icon: config.icon,
        color: config.color,
        bgColor: config.bgColor,
        borderColor: config.borderColor,
        estimatedTime: aiStep.estimatedTime || "< 2s",
        inputs: aiStep.inputs || [],
        outputs: aiStep.outputs || [],
        details: aiStep.details || [],
        isAnimating: true,
        assignedIntegration,
        voiceflowAction: aiStep.voiceflowBlock || config.voiceflowBlock,
        complexity: aiStep.complexity || "medium",
        businessImpact: aiStep.businessImpact || "Enhances automation workflow",
      }

      setStreamingSteps((prevSteps) => [...prevSteps, step])

      const progress = 80 + ((i + 1) / aiSteps.length) * 15
      setStreamingProgress(progress)

      addAiThought(
        `🔧 Generated: ${step.title}${assignedIntegration ? ` (${assignedIntegration.name})` : ""}`,
      )

      // Faster animation timing
      await new Promise((resolve) => setTimeout(resolve, 500))

      setStreamingSteps((prevSteps) => prevSteps.map((s) => (s.id === step.id ? { ...s, isAnimating: false } : s)))

      steps.push(step)
    }

    return steps
  }

  const getAssignedIntegrations = (steps: WorkflowStep[]): Integration[] => {
    return steps.filter((step) => step.assignedIntegration).map((step) => step.assignedIntegration!)
  }

  const addAiThought = (thought: string): void => {
    setAiThoughts((prev) => {
      const newThoughts = [...prev, thought]
      return newThoughts.slice(-4) // Keep last 4 thoughts
    })
  }

  // Handle integration selection
  const handleIntegrationToggle = (integrationId: string) => {
    setSelectedIntegrations((prev) => {
      if (prev.includes(integrationId)) {
        // Remove integration and its operations
        const newOperations = { ...selectedOperations }
        delete newOperations[integrationId]
        setSelectedOperations(newOperations)
        return prev.filter((id) => id !== integrationId)
      } else {
        return [...prev, integrationId]
      }
    })
  }

  const handleOperationToggle = (integrationId: string, operation: string) => {
    setSelectedOperations((prev) => ({
      ...prev,
      [integrationId]: prev[integrationId]?.includes(operation)
        ? prev[integrationId].filter((op) => op !== operation)
        : [...(prev[integrationId] || []), operation],
    }))
  }

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals((prev) => (prev.includes(goalId) ? prev.filter((id) => id !== goalId) : [...prev, goalId]))
  }

  const handleInitialSubmit = (): void => {
    if (!workflowRequest.trim()) {
      setResponseStatus("❌ Please describe your Instagram automation needs")
      return
    }
    if (selectedGoals.length === 0) {
      setResponseStatus("❌ Please select at least one automation goal")
      return
    }
    generateWorkflowWithAI("initial")
  }

  const handleRefine = (): void => {
    if (!refinementInput.trim()) {
      setResponseStatus("❌ Please provide refinement instructions")
      return
    }
    generateWorkflowWithAI("refine", refinementInput)
    setRefinementInput("")
  }

  const handleApprove = async (): Promise<void> => {
    setIsGenerating(true)
    setResponseStatus("📧 Submitting Instagram workflow to development team...")

    try {
      const payload = {
        title: parsedWorkflow?.title || "Instagram Automation Workflow",
        businessObjective: parsedWorkflow?.description || "Instagram DM automation",
        businessInfo: businessInfo,
        workflowDesign: {
          title: parsedWorkflow?.title,
          description: parsedWorkflow?.description,
          platform: parsedWorkflow?.platform,
          estimatedBuildTime: parsedWorkflow?.estimatedBuildTime,
          complexity: parsedWorkflow?.complexity,
          steps: streamingSteps.map(step => ({
            stepNumber: step.stepNumber,
            title: step.title,
            description: step.description,
            type: step.type,
            inputs: step.inputs,
            outputs: step.outputs,
            details: step.details,
            voiceflowAction: step.voiceflowAction,
            businessImpact: step.businessImpact,
            estimatedTime: step.estimatedTime,
            complexity: step.complexity,
            assignedIntegration: step.assignedIntegration
          })),
          integrations: getAssignedIntegrations(streamingSteps),
          benefits: parsedWorkflow?.benefits,
          exampleScenario: parsedWorkflow?.exampleScenario,
          voiceflowFeatures: parsedWorkflow?.voiceflowFeatures,
          instagramFocus: parsedWorkflow?.instagramFocus,
          estimatedCost: parsedWorkflow?.estimatedCost,
          roi: parsedWorkflow?.roi,
          metrics: parsedWorkflow?.metrics
        },
        selectedIntegrations: selectedIntegrations,
        selectedOperations: selectedOperations,
        selectedGoals: selectedGoals,
        customRequest: workflowRequest,
        platform: "Instagram",
        submittedAt: new Date().toISOString(),
        urgency: "NORMAL",
      }

      // Store in localStorage
      const workflowId = `instagram-${Date.now()}`
      localStorage.setItem(`workflow-submission-${workflowId}`, JSON.stringify(payload))

      setResponseStatus("✅ Instagram workflow submitted successfully!")

      const pendingData = {
        id: workflowId,
        submittedAt: new Date().toISOString(),
        status: "PENDING_CREATION",
        workflowType: "Instagram Automation",
        estimatedCompletion: "1-2 weeks",
      }

      localStorage.setItem("pendingWorkflow", JSON.stringify(pendingData))

      setTimeout(() => {
        if (setStep) setStep("pending")
      }, 2000)
    } catch (error) {
      setResponseStatus("❌ Failed to submit workflow. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleStepExpansion = (stepNumber: number): void => {
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

  // Enhanced components
  const StreamingProgress: React.FC = () => {
    if (!isGenerating) return null

    const phases = [
      { title: "Analyzing Requirements", icon: Brain, color: "text-primary" },
      { title: "Designing Architecture", icon: Workflow, color: "text-secondary-foreground" },
      { title: "Assigning Integrations", icon: Link2, color: "text-accent-foreground" },
      { title: "Finalizing Workflow", icon: CheckCircle, color: "text-primary" },
    ]

    const currentPhaseData = phases[currentPhase] || phases[0]
    const IconComponent = currentPhaseData.icon

    return (
      <div className="mb-8">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-secondary animate-spin"></div>
              <IconComponent className={`h-10 w-10 ${currentPhaseData.color} animate-pulse`} />
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-2 text-card-foreground">{currentPhaseData.title}</h3>
          <p className="text-muted-foreground">
            DeepSeek AI is creating your custom Instagram automation workflow...
          </p>
          {estimatedTimeRemaining > 0 && (
            <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Estimated time remaining: {estimatedTimeRemaining}s</span>
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{Math.round(streamingProgress)}%</span>
          </div>
          <Progress value={streamingProgress} className="h-3 mb-4" />
        </div>

        <div className="flex justify-center gap-6 mb-6">
          {phases.map((phase, index) => {
            const PhaseIcon = phase.icon
            return (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                    index < currentPhase
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : index === currentPhase
                        ? "bg-primary text-primary-foreground animate-pulse shadow-lg"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index < currentPhase ? <CheckCircle className="h-6 w-6" /> : <PhaseIcon className="h-6 w-6" />}
                </div>
                <span
                  className={`text-xs mt-2 text-center font-medium ${
                    index === currentPhase ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {phase.title.split(" ")[0]}
                </span>
              </div>
            )
          })}
        </div>

        {/* AI Thoughts */}
        {aiThoughts.length > 0 && (
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-card-foreground">DeepSeek AI Progress</span>
            </div>
            <div className="space-y-2">
              {aiThoughts.map((thought, index) => (
                <div
                  key={index}
                  className={`text-xs text-muted-foreground transition-opacity duration-500 ${
                    index === aiThoughts.length - 1 ? "opacity-100 font-medium text-card-foreground" : "opacity-70"
                  }`}
                >
                  {thought}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const StepComponent: React.FC<{ step: WorkflowStep }> = ({ step }) => {
    const config = stepTypeConfigs[step.type] || stepTypeConfigs.trigger
    const IconComponent = step.icon || config.icon
    const isExpanded = expandedSteps.has(step.stepNumber)

    return (
      <div
        data-step-id={step.id}
        className={`relative transition-all duration-500 ${step.isAnimating ? "animate-pulse" : ""}`}
      >
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
          {/* Step Header */}
          <div className="p-6">
            <div className="flex items-center gap-4">
              {/* Step Number with Icon */}
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-lg shadow-xl">
                  {step.stepNumber}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-card rounded-full flex items-center justify-center shadow-lg ring-2 ring-card">
                  <IconComponent className={`h-4 w-4 ${config.color}`} />
                </div>
              </div>

              {/* Step Content */}
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-3">
                  <h4 className="text-xl font-bold text-card-foreground">{step.title}</h4>
                  <Badge variant="outline" className="text-xs font-medium border-border">
                    {step.voiceflowAction}
                  </Badge>
                  {step.assignedIntegration && (
                    <Badge variant="secondary" className="text-xs bg-secondary text-secondary-foreground">
                      <step.assignedIntegration.icon className="h-3 w-3 mr-1" />
                      {step.assignedIntegration.name}
                    </Badge>
                  )}
                  <Badge variant="outline" className={`text-xs border-border ${
                    step.complexity === "high" ? "text-destructive" :
                    step.complexity === "medium" ? "text-muted-foreground" :
                    "text-primary"
                  }`}>
                    {step.complexity}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-3 leading-relaxed">{step.description}</p>

                {/* Input/Output Flow */}
                <div className="flex items-center gap-6 text-sm">
                  {step.inputs && step.inputs.length > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                      <span className="text-primary font-medium">
                        Input: {step.inputs.slice(0, 2).join(", ")}
                        {step.inputs.length > 2 && `... (+${step.inputs.length - 2})`}
                      </span>
                    </div>
                  )}
                  {step.outputs && step.outputs.length > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-secondary rounded-full animate-pulse"></div>
                      <span className="text-secondary-foreground font-medium">
                        Output: {step.outputs.slice(0, 2).join(", ")}
                        {step.outputs.length > 2 && `... (+${step.outputs.length - 2})`}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Expand Icon */}
              <div className="flex items-center">
                {isExpanded ? (
                  <ChevronDown className="h-6 w-6 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
            </div>
          </div>

          {/* Expanded Details */}
          {isExpanded && (
            <div className="border-t border-border bg-muted/30 p-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold mb-3 flex items-center gap-2 text-card-foreground">
                    <Layers className="h-4 w-4 text-primary" />
                    Implementation Details
                  </h5>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {step.details?.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-semibold mb-3 flex items-center gap-2 text-card-foreground">
                    <Settings className="h-4 w-4 text-secondary-foreground" />
                    Voiceflow Configuration
                  </h5>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Block Type:</span>
                      <Badge variant="secondary">{step.voiceflowAction}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Execution Time:</span>
                      <Badge variant="secondary">{step.estimatedTime}</Badge>
                    </div>
                    {step.assignedIntegration && (
                      <div className="p-3 bg-secondary/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <step.assignedIntegration.icon className="h-4 w-4 text-primary" />
                          <span className="font-medium text-card-foreground">
                            {step.assignedIntegration.name} Integration
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {step.assignedIntegration.description}
                        </p>
                        {selectedOperations[step.assignedIntegration.id] && (
                          <div className="mt-2">
                            <span className="text-xs font-medium text-card-foreground">
                              Available Operations:
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedOperations[step.assignedIntegration.id].map((op) => (
                                <Badge key={op} variant="outline" className="text-xs border-border">
                                  {op}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {step.businessImpact && (
                      <div className="p-3 bg-accent/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="h-4 w-4 text-accent-foreground" />
                          <span className="text-xs font-medium text-card-foreground">Business Impact</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{step.businessImpact}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Connection Line */}
        {step.stepNumber < (streamingSteps.length || 1) && (
          <div className="flex justify-center my-6">
            <div className="relative">
              <div className="w-px h-12 bg-gradient-to-b from-border via-primary to-border"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
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
          <Button variant="ghost" className="mb-6 hover:bg-accent" onClick={() => setStep?.("selection")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Selection
          </Button>
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Instagram className="h-12 w-12 text-primary" />
              <h1 className="text-5xl font-bold text-card-foreground">Instagram Automation Builder</h1>
            </div>
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
              Create intelligent Instagram DM automation workflows using DeepSeek AI, Voiceflow, and your preferred integrations.
            </p>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span>DeepSeek AI Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                <span>Voiceflow-Compatible</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <span>Smart Integrations</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Configuration */}
          <div className="lg:col-span-1 space-y-6">
            {/* Supported Integrations Section */}
            <Card className="border-2 border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <Link2 className="h-5 w-5 text-primary" />
                  Available Integrations
                </CardTitle>
                <CardDescription className="text-muted-foreground">Select the tools you want to integrate with your Instagram automation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-border bg-muted/50">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-muted-foreground">
                    Choose integrations that will help your AI agent provide better customer support on Instagram. Each workflow step can use at most one integration.
                  </AlertDescription>
                </Alert>

                {SUPPORTED_INTEGRATIONS.map((integration) => {
                  const IconComponent = integration.icon
                  const isSelected = selectedIntegrations.includes(integration.id)

                  return (
                    <div key={integration.id} className="space-y-3">
                      <div
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => handleIntegrationToggle(integration.id)}
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-5 w-5 text-primary" />
                          <div className="flex-grow">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-card-foreground">{integration.name}</span>
                              <Badge variant="outline" className="text-xs border-border">
                                {integration.setupComplexity}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{integration.description}</p>
                          </div>
                          {isSelected && <Check className="h-4 w-4 text-primary" />}
                        </div>
                      </div>

                      {/* Operations Selection */}
                      {isSelected && (
                        <div className="ml-4 p-3 bg-muted/50 rounded-lg">
                          <Label className="text-sm font-medium mb-2 block text-card-foreground">Select operations to allow:</Label>
                          <div className="space-y-2">
                            {integration.operations.map((operation) => (
                              <div key={operation} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${integration.id}-${operation}`}
                                  checked={selectedOperations[integration.id]?.includes(operation) || false}
                                  onCheckedChange={(checked) => handleOperationToggle(integration.id, operation)}
                                />
                                <Label htmlFor={`${integration.id}-${operation}`} className="text-sm cursor-pointer text-card-foreground">
                                  {operation}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Instagram Goals Selection */}
            <Card className="border-2 border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <Target className="h-5 w-5 text-primary" />
                  Automation Goals
                </CardTitle>
                <CardDescription className="text-muted-foreground">What do you want to achieve with Instagram automation?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {instagramGoals.map((goal) => {
                  const IconComponent = goal.icon
                  const isSelected = selectedGoals.includes(goal.id)

                  return (
                    <div
                      key={goal.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => handleGoalToggle(goal.id)}
                    >
                      <div className="flex items-start gap-3">
                        <IconComponent className="h-4 w-4 text-primary mt-1" />
                        <div className="flex-grow">
                          <span className="text-sm font-medium block text-card-foreground">{goal.label}</span>
                          <span className="text-xs text-muted-foreground">{goal.description}</span>
                        </div>
                        {isSelected && <Check className="h-4 w-4 text-primary" />}
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Workflow Request */}
            <Card className="border-2 border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <Wand2 className="h-5 w-5 text-primary" />
                  {!hasInitialRequest ? "Describe Your Instagram Automation" : "Refine Your Workflow"}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {!hasInitialRequest
                    ? "Tell us about your specific Instagram automation needs"
                    : "Provide feedback to improve the workflow"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!hasInitialRequest ? (
                  <>
                    <div className="space-y-3">
                      <Label htmlFor="workflowRequest" className="text-base font-semibold text-card-foreground">
                        Instagram Automation Requirements
                      </Label>
                      <Textarea
                        id="workflowRequest"
                        value={workflowRequest}
                        onChange={(e) => setWorkflowRequest(e.target.value)}
                        placeholder="e.g., 'I want to automatically respond to Instagram DMs asking about product pricing, capture lead information, and follow up with email campaigns. When someone asks about appointments, I want to integrate with my booking system and send calendar links.'"
                        rows={6}
                        className="bg-background border-2 border-input focus:border-ring resize-none text-sm text-foreground placeholder:text-muted-foreground"
                        disabled={isGenerating}
                      />
                    </div>
                    <Button
                      onClick={handleInitialSubmit}
                      disabled={isGenerating || !workflowRequest.trim()}
                      className="w-full flex items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold py-3 text-base"
                    >
                      {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Instagram className="h-5 w-5" />}
                      Generate with DeepSeek AI
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="space-y-3">
                      <Label htmlFor="refinementInput" className="text-base font-semibold text-card-foreground">
                        Refinement Instructions
                      </Label>
                      <Textarea
                        id="refinementInput"
                        value={refinementInput}
                        onChange={(e) => setRefinementInput(e.target.value)}
                        placeholder="e.g., 'Add a step to check business hours before responding', 'Include product availability checking', 'Add sentiment analysis for priority routing'"
                        rows={4}
                        className="bg-background border-2 border-input focus:border-ring resize-none text-foreground placeholder:text-muted-foreground"
                        disabled={isGenerating}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={handleRefine}
                        disabled={isGenerating || !refinementInput.trim()}
                        className="flex-1 flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                      >
                        {isGenerating && currentAction === "refine" ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                        Refine
                      </Button>
                      <Button
                        onClick={handleApprove}
                        disabled={isGenerating || !parsedWorkflow}
                        variant="secondary"
                        className="flex-1 flex items-center gap-2 font-medium"
                      >
                        {isGenerating && currentAction === "approve" ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ThumbsUp className="h-4 w-4" />
                        )}
                        Submit
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Generated Workflow */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-border min-h-[700px] bg-card backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <Instagram className="h-6 w-6 text-primary" />
                  Instagram Automation Workflow
                  {parsedWorkflow && (
                    <Badge variant="outline" className="ml-auto border-border">
                      <Star className="h-3 w-3 mr-1" />
                      DeepSeek AI Generated
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  AI-generated Instagram DM automation workflow optimized for Voiceflow implementation
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Status Message */}
                {responseStatus && (
                  <div
                    className={`mb-6 p-4 rounded-xl border-2 ${
                      responseStatus.includes("✅")
                        ? "bg-secondary/50 border-secondary text-secondary-foreground"
                        : responseStatus.includes("❌")
                          ? "bg-destructive/10 border-destructive/50 text-destructive"
                          : "bg-primary/10 border-primary/50 text-primary"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {responseStatus.includes("✅") ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : responseStatus.includes("❌") ? (
                        <AlertCircle className="h-5 w-5" />
                      ) : (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      )}
                      <span className="font-medium">{responseStatus}</span>
                    </div>
                  </div>
                )}

                {/* Streaming Progres */}
                {isGenerating && <StreamingProgress />}

                {/* Workflow Header */}
                {parsedWorkflow && !isGenerating && (
                  <div className="mb-8 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-border">
                    <div className="text-center mb-8">
                      <h3 className="text-3xl font-bold mb-3 text-card-foreground">{parsedWorkflow.title}</h3>
                      <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
                        {parsedWorkflow.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 bg-card rounded-xl shadow-sm border border-border">
                        <div className="text-2xl font-bold text-primary mb-1">
                          {parsedWorkflow.metrics?.automationRate}
                        </div>
                        <div className="text-xs text-muted-foreground font-medium">Automation Rate</div>
                      </div>
                      <div className="text-center p-4 bg-card rounded-xl shadow-sm border border-border">
                        <div className="text-2xl font-bold text-primary mb-1">
                          {parsedWorkflow.metrics?.responseTime}
                        </div>
                        <div className="text-xs text-muted-foreground font-medium">Response Time</div>
                      </div>
                      <div className="text-center p-4 bg-card rounded-xl shadow-sm border border-border">
                        <div className="text-2xl font-bold text-primary mb-1">{parsedWorkflow.metrics?.accuracy}</div>
                        <div className="text-xs text-muted-foreground font-medium">AI Accuracy</div>
                      </div>
                      <div className="text-center p-4 bg-card rounded-xl shadow-sm border border-border">
                        <div className="text-2xl font-bold text-primary mb-1">{parsedWorkflow.estimatedBuildTime}</div>
                        <div className="text-xs text-muted-foreground font-medium">Build Time</div>
                      </div>
                    </div>

                    {/* Integration Summary */}
                    {parsedWorkflow.integrations.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-3 flex items-center gap-2 text-card-foreground">
                          <Zap className="h-4 w-4 text-primary" />
                          Assigned Integrations
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {parsedWorkflow.integrations.map((integration) => (
                            <Badge key={integration.id} variant="secondary" className="flex items-center gap-1">
                              <integration.icon className="h-3 w-3" />
                              {integration.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Streaming Steps */}
                {(isStreaming || streamingSteps.length > 0) && (
                  <div ref={stepContainerRef} className="space-y-8">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="p-3 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-lg">
                        <Workflow className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-card-foreground">Instagram Workflow Steps</h3>
                        <p className="text-muted-foreground">DeepSeek AI generated, Voiceflow-compatible automation steps</p>
                      </div>
                      <Badge variant="outline" className="ml-auto text-base px-3 py-1 border-border">
                        {streamingSteps.length} steps
                      </Badge>
                    </div>

                    {streamingSteps.map((step) => (
                      <StepComponent key={step.id} step={step} />
                    ))}

                    {isStreaming && (
                      <div className="flex justify-center py-8">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span className="font-medium">DeepSeek AI is generating more steps...</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Initial State */}
                {!isGenerating && !parsedWorkflow && !hasInitialRequest && (
                  <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="relative mb-8">
                      <div className="w-24 h-24 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-full flex items-center justify-center">
                        <Instagram className="h-12 w-12 text-primary" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-primary-foreground" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-card-foreground">Ready to Build Your Instagram Automation</h3>
                    <p className="text-center max-w-lg mb-8 text-muted-foreground leading-relaxed">
                      Configure your integrations and automation goals, then describe your Instagram automation needs.
                      DeepSeek AI will create a Voiceflow-compatible workflow tailored to your requirements.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground">
                      <div className="flex flex-col items-center gap-2 p-3 bg-primary/10 rounded-lg">
                        <Instagram className="h-5 w-5 text-primary" />
                        <span className="font-medium">Instagram DMs</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 p-3 bg-secondary/10 rounded-lg">
                        <Workflow className="h-5 w-5 text-secondary-foreground" />
                        <span className="font-medium">Voiceflow Ready</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 p-3 bg-accent/10 rounded-lg">
                        <Zap className="h-5 w-5 text-accent-foreground" />
                        <span className="font-medium">Smart Integrations</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 p-3 bg-muted/50 rounded-lg">
                        <Brain className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">DeepSeek AI</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VoiceflowWorkflowBuilder
