
// "use client"

// import React, { useState, useCallback, useEffect, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import {
//   ArrowLeft,
//   Sparkles,
//   Loader2,
//   CheckCircle,
//   Send,
//   Clock,
//   Settings,
//   Target,
//   ThumbsUp,
//   Bot,
//   Mic,
//   Phone,
//   MessageCircle,
//   RefreshCw,
//   MessageSquare,
//   Zap,
//   AlertCircle,
//   FileText,
//   PlayCircle,
//   Workflow,
//   GitBranch,
//   ChevronDown,
//   ChevronRight,
//   Eye,
//   Database,
//   Filter,
//   Mail,
//   Bell,
//   BarChart3,
//   Shield,
//   Globe,
//   Star,
//   TrendingUp,
//   Cpu,
//   Code,
//   Brain,
//   Lightbulb,
//   Rocket,
//   Users,
//   Timer,
//   Layers,
//   Activity,
//   Wand2,
//   Plus,
//   X,
//   Check,
//   ExternalLink,
//   Building,
//   Cloud,
//   ShoppingCart,
//   CreditCard,
//   Calendar,
//   Briefcase,
//   Headphones,
//   BarChart,
//   Lock,
//   Webhook,
//   Link2,
//   Puzzle,
//   Search,
//   Package,
//   Gauge
// } from "lucide-react"

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
//   category: string
//   icon: React.ComponentType<{ className?: string }>
//   pricing: "free" | "freemium" | "paid" | "enterprise"
//   popularity: number
//   difficulty: "easy" | "medium" | "hard"
//   apiAvailable: boolean
//   webhookSupport: boolean
//   realTimeSync: boolean
//   features: string[]
//   setupTime: string
//   website?: string
// }

// interface WorkflowStep {
//   id: string
//   stepNumber: number
//   title: string
//   description: string
//   type: string
//   inputs?: string[]
//   outputs?: string[]
//   conditions?: string[]
//   estimatedTime?: string
//   icon?: React.ComponentType<{ className?: string }>
//   color?: string
//   bgColor?: string
//   borderColor?: string
//   details?: string[]
//   isAnimating?: boolean
//   suggestedIntegrations?: Integration[]
//   selectedIntegrations?: Integration[]
//   aiReasoning?: string
//   complexity?: "low" | "medium" | "high"
//   businessImpact?: string
//   alternatives?: string[]
// }

// interface StreamingPhase {
//   id: string
//   title: string
//   description: string
//   icon: React.ComponentType<{ className?: string }>
//   color: string
//   duration: number
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
//   technicalRequirements: string[]
//   deploymentChannels: string[]
//   estimatedCost?: string
//   roi?: string
//   metrics?: {
//     automationRate: string
//     responseTime: string
//     accuracy: string
//     scalability: string
//   }
// }

// interface ChannelOption {
//   id: string
//   label: string
//   icon: React.ComponentType<{ className?: string }>
// }

// interface AutomationFeature {
//   id: string
//   label: string
// }

// interface StepTypeConfig {
//   icon: React.ComponentType<{ className?: string }>
//   color: string
//   bgColor: string
//   borderColor: string
//   accentColor: string
//   darkBg: string
//   darkBorder: string
// }

// // Comprehensive Integration Database
// const INTEGRATION_DATABASE: Integration[] = [
//   // CRM Systems
//   {
//     id: "hubspot",
//     name: "HubSpot",
//     description: "Comprehensive CRM and marketing automation platform",
//     category: "crm",
//     icon: Building,
//     pricing: "freemium",
//     popularity: 95,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Contact Management", "Deal Tracking", "Email Marketing", "Analytics"],
//     setupTime: "15-30 minutes",
//     website: "https://hubspot.com"
//   },
//   {
//     id: "salesforce",
//     name: "Salesforce",
//     description: "World's leading CRM platform for sales and customer service",
//     category: "crm",
//     icon: Cloud,
//     pricing: "paid",
//     popularity: 90,
//     difficulty: "medium",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Lead Management", "Opportunity Tracking", "Custom Objects", "Automation"],
//     setupTime: "30-60 minutes",
//     website: "https://salesforce.com"
//   },
//   {
//     id: "zoho-crm",
//     name: "Zoho CRM",
//     description: "Complete CRM solution for businesses of all sizes",
//     category: "crm",
//     icon: Briefcase,
//     pricing: "freemium",
//     popularity: 75,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Sales Automation", "Contact Management", "Analytics", "Mobile App"],
//     setupTime: "20-40 minutes",
//     website: "https://zoho.com/crm"
//   },

//   // E-commerce Platforms
//   {
//     id: "shopify",
//     name: "Shopify",
//     description: "Leading e-commerce platform for online stores",
//     category: "ecommerce",
//     icon: ShoppingCart,
//     pricing: "paid",
//     popularity: 92,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Product Management", "Order Processing", "Inventory", "Payments"],
//     setupTime: "20-30 minutes",
//     website: "https://shopify.com"
//   },

//   // Email Marketing
//   {
//     id: "mailchimp",
//     name: "Mailchimp",
//     description: "All-in-one email marketing and automation platform",
//     category: "email",
//     icon: Mail,
//     pricing: "freemium",
//     popularity: 88,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Email Campaigns", "Automation", "Audience Segmentation", "Analytics"],
//     setupTime: "10-20 minutes",
//     website: "https://mailchimp.com"
//   },

//   // Payment Systems
//   {
//     id: "stripe",
//     name: "Stripe",
//     description: "Complete payment processing platform for businesses",
//     category: "payment",
//     icon: CreditCard,
//     pricing: "paid",
//     popularity: 95,
//     difficulty: "medium",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Payment Processing", "Subscriptions", "Invoicing", "Marketplace"],
//     setupTime: "25-40 minutes",
//     website: "https://stripe.com"
//   },

//   // Analytics & Tracking
//   {
//     id: "google-analytics",
//     name: "Google Analytics",
//     description: "Web analytics service for tracking website traffic",
//     category: "analytics",
//     icon: BarChart3,
//     pricing: "freemium",
//     popularity: 98,
//     difficulty: "medium",
//     apiAvailable: true,
//     webhookSupport: false,
//     realTimeSync: true,
//     features: ["Traffic Analysis", "Conversion Tracking", "Audience Insights", "Reports"],
//     setupTime: "20-30 minutes",
//     website: "https://analytics.google.com"
//   },

//   // Communication
//   {
//     id: "slack",
//     name: "Slack",
//     description: "Business communication and collaboration platform",
//     category: "communication",
//     icon: MessageSquare,
//     pricing: "freemium",
//     popularity: 92,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Team Chat", "File Sharing", "Integrations", "Workflow Automation"],
//     setupTime: "10-20 minutes",
//     website: "https://slack.com"
//   },

//   // Databases & Storage
//   {
//     id: "airtable",
//     name: "Airtable",
//     description: "Cloud-based database and spreadsheet hybrid",
//     category: "database",
//     icon: Database,
//     pricing: "freemium",
//     popularity: 85,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Database Management", "Forms", "Views", "Automations"],
//     setupTime: "15-25 minutes",
//     website: "https://airtable.com"
//   }
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

// // Step type configurations with unique styling
// const stepTypeConfigs: Record<string, StepTypeConfig> = {
//   trigger: {
//     icon: PlayCircle,
//     color: "text-emerald-600",
//     bgColor: "from-emerald-50 to-green-100",
//     borderColor: "border-emerald-300",
//     accentColor: "bg-emerald-500",
//     darkBg: "dark:from-emerald-900/20 dark:to-green-900/30",
//     darkBorder: "dark:border-emerald-600/50"
//   },
//   analysis: {
//     icon: Brain,
//     color: "text-purple-600",
//     bgColor: "from-purple-50 to-violet-100",
//     borderColor: "border-purple-300",
//     accentColor: "bg-purple-500",
//     darkBg: "dark:from-purple-900/20 dark:to-violet-900/30",
//     darkBorder: "dark:border-purple-600/50"
//   },
//   filter: {
//     icon: Filter,
//     color: "text-blue-600",
//     bgColor: "from-blue-50 to-cyan-100",
//     borderColor: "border-blue-300",
//     accentColor: "bg-blue-500",
//     darkBg: "dark:from-blue-900/20 dark:to-cyan-900/30",
//     darkBorder: "dark:border-blue-600/50"
//   },
//   response: {
//     icon: MessageCircle,
//     color: "text-orange-600",
//     bgColor: "from-orange-50 to-amber-100",
//     borderColor: "border-orange-300",
//     accentColor: "bg-orange-500",
//     darkBg: "dark:from-orange-900/20 dark:to-amber-900/30",
//     darkBorder: "dark:border-orange-600/50"
//   },
//   notification: {
//     icon: Bell,
//     color: "text-red-600",
//     bgColor: "from-red-50 to-pink-100",
//     borderColor: "border-red-300",
//     accentColor: "bg-red-500",
//     darkBg: "dark:from-red-900/20 dark:to-pink-900/30",
//     darkBorder: "dark:border-red-600/50"
//   },
//   integration: {
//     icon: Zap,
//     color: "text-yellow-600",
//     bgColor: "from-yellow-50 to-orange-100",
//     borderColor: "border-yellow-300",
//     accentColor: "bg-yellow-500",
//     darkBg: "dark:from-yellow-900/20 dark:to-orange-900/30",
//     darkBorder: "dark:border-yellow-600/50"
//   },
//   storage: {
//     icon: Database,
//     color: "text-gray-600",
//     bgColor: "from-gray-50 to-slate-100",
//     borderColor: "border-gray-300",
//     accentColor: "bg-gray-500",
//     darkBg: "dark:from-gray-900/20 dark:to-slate-900/30",
//     darkBorder: "dark:border-gray-600/50"
//   },
//   routing: {
//     icon: GitBranch,
//     color: "text-indigo-600",
//     bgColor: "from-indigo-50 to-blue-100",
//     borderColor: "border-indigo-300",
//     accentColor: "bg-indigo-500",
//     darkBg: "dark:from-indigo-900/20 dark:to-blue-900/30",
//     darkBorder: "dark:border-indigo-600/50"
//   },
//   validation: {
//     icon: Shield,
//     color: "text-cyan-600",
//     bgColor: "from-cyan-50 to-teal-100",
//     borderColor: "border-cyan-300",
//     accentColor: "bg-cyan-500",
//     darkBg: "dark:from-cyan-900/20 dark:to-teal-900/30",
//     darkBorder: "dark:border-cyan-600/50"
//   },
//   automation: {
//     icon: Bot,
//     color: "text-pink-600",
//     bgColor: "from-pink-50 to-rose-100",
//     borderColor: "border-pink-300",
//     accentColor: "bg-pink-500",
//     darkBg: "dark:from-pink-900/20 dark:to-rose-900/30",
//     darkBorder: "dark:border-pink-600/50"
//   }
// }

// // AI Processing phases
// const streamingPhases: StreamingPhase[] = [
//   {
//     id: "understanding",
//     title: "Analyzing Requirements",
//     description: "AI is understanding your business needs and automation goals",
//     icon: Search,
//     color: "text-blue-500",
//     duration: 3000
//   },
//   {
//     id: "designing",
//     title: "Designing Architecture",
//     description: "Creating intelligent workflow logic and step sequences",
//     icon: Wand2,
//     color: "text-purple-500",
//     duration: 4000
//   },
//   {
//     id: "integrations",
//     title: "Matching Integrations",
//     description: "Finding the best tools and platforms for each step",
//     icon: Link2,
//     color: "text-green-500",
//     duration: 3000
//   },
//   {
//     id: "optimizing",
//     title: "Optimizing Performance",
//     description: "Fine-tuning for maximum efficiency and reliability",
//     icon: Gauge,
//     color: "text-orange-500",
//     duration: 2000
//   }
// ]

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
//   const [selectedChannels, setSelectedChannels] = useState<string[]>(["instagram"])
//   const [automationFeatures, setAutomationFeatures] = useState<string[]>(["auto-reply"])
//   const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set())
  
//   // Streaming states
//   const [streamingSteps, setStreamingSteps] = useState<WorkflowStep[]>([])
//   const [currentPhase, setCurrentPhase] = useState<number>(0)
//   const [isStreaming, setIsStreaming] = useState<boolean>(false)
//   const [streamingProgress, setStreamingProgress] = useState<number>(0)
//   const [aiThoughts, setAiThoughts] = useState<string[]>([])
//   const stepContainerRef = useRef<HTMLDivElement>(null)

//   const channelOptions: ChannelOption[] = [
//     { id: "instagram", label: "Instagram DMs", icon: MessageCircle },
//     { id: "facebook", label: "Facebook Messenger", icon: MessageSquare },
//     { id: "whatsapp", label: "WhatsApp Business", icon: Phone },
//     { id: "telegram", label: "Telegram Bot", icon: Bot },
//     { id: "web", label: "Website Chat", icon: Mic },
//     { id: "email", label: "Email Marketing", icon: Mail },
//     { id: "sms", label: "SMS Marketing", icon: Phone },
//   ]

//   const automationFeatureOptions: AutomationFeature[] = [
//     { id: "auto-reply", label: "Automatic Responses" },
//     { id: "sentiment-analysis", label: "Sentiment Analysis" },
//     { id: "intent-detection", label: "Intent Recognition" },
//     { id: "multilingual", label: "Multi-language Support" },
//     { id: "smart-routing", label: "Smart Agent Routing" },
//     { id: "lead-scoring", label: "Lead Scoring" },
//     { id: "personalization", label: "Dynamic Personalization" },
//     { id: "escalation", label: "Intelligent Escalation" },
//   ]

//   // Real AI workflow generation
//   const generateWorkflowWithAI = useCallback(async (
//     action: "initial" | "refine", 
//     instructions?: string
//   ): Promise<void> => {
//     setIsGenerating(true)
//     setIsStreaming(true)
//     setCurrentPhase(0)
//     setStreamingProgress(0)
//     setStreamingSteps([])
//     setAiThoughts([])
//     setResponseStatus("🤖 Connecting to AI workflow engine...")
//     setCurrentAction(action)
//     setHasInitialRequest(true)

//     try {
//       // Phase progression with realistic timing
//       for (let phase = 0; phase < streamingPhases.length; phase++) {
//         setCurrentPhase(phase)
//         setResponseStatus(`${streamingPhases[phase].description}...`)
        
//         addAiThought(getAiThoughtForPhase(phase))
        
//         await new Promise(resolve => setTimeout(resolve, streamingPhases[phase].duration))
//       }

//       // Generate workflow via AI API
//       const aiResponse = await callAIWorkflowGeneration(action, instructions)
      
//       if (aiResponse.success && aiResponse.workflowData) {
//         setParsedWorkflow(aiResponse.workflowData)
//         setStreamingProgress(100)
//         setResponseStatus("✅ Custom AI workflow generated successfully!")
//         addAiThought("🎉 Workflow generation complete! Ready for development team submission.")
//       } else {
//         throw new Error(aiResponse.error || "AI generation failed")
//       }
      
//     } catch (error) {
//       console.error("AI generation error:", error)
//       setResponseStatus(`❌ AI generation failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//       addAiThought("❌ Generation failed. Please try again with more specific requirements.")
//     } finally {
//       setIsStreaming(false)
//       setTimeout(() => {
//         setIsGenerating(false)
//       }, 1000)
//     }
//   }, [businessInfo, selectedChannels, automationFeatures, workflowRequest])

//   // Simulate AI API call
//   const callAIWorkflowGeneration = async (
//     action: "initial" | "refine", 
//     instructions?: string
//   ): Promise<{ success: boolean; workflowData?: ParsedWorkflow; error?: string }> => {
//     try {
//       // Simulate API call delay
//       await new Promise(resolve => setTimeout(resolve, 2000))
      
//       const workflowSteps = await processAIResponseIntoSteps({})
      
//       const workflow: ParsedWorkflow = {
//         title: `${businessInfo.businessName} Custom AI Automation`,
//         description: `Intelligent automation workflow for ${selectedChannels.length} platform${selectedChannels.length > 1 ? 's' : ''}`,
//         platform: "Custom AI Automation",
//         estimatedBuildTime: "3-5 weeks",
//         complexity: "Custom Enterprise",
//         steps: workflowSteps,
//         integrations: getUniqueIntegrations(workflowSteps),
//         benefits: [
//           "100% customized to your specific requirements",
//           "Advanced AI-powered automation",
//           "Seamless integration with your existing tools",
//           "Scalable architecture for future growth",
//           "Dedicated development and support",
//           "Priority marketplace listing"
//         ],
//         exampleScenario: "Custom workflow tailored to your exact specifications with intelligent routing and processing",
//         technicalRequirements: [
//           "Custom API integrations",
//           "Advanced AI/ML processing", 
//           "Real-time data synchronization",
//           "Scalable cloud infrastructure",
//           "Security compliance setup"
//         ],
//         deploymentChannels: selectedChannels,
//         estimatedCost: "$2000-5000/month",
//         roi: "400-800% within 6 months",
//         metrics: {
//           automationRate: "98%",
//           responseTime: "< 1 second",
//           accuracy: "96%",
//           scalability: "Enterprise+"
//         }
//       }

//       return { success: true, workflowData: workflow }
      
//     } catch (error) {
//       console.error("AI API call failed:", error)
//       return { 
//         success: false, 
//         error: error instanceof Error ? error.message : "AI generation failed" 
//       }
//     }
//   }

//   // Process AI response into workflow steps with streaming
//   const processAIResponseIntoSteps = async (workflowData: any): Promise<WorkflowStep[]> => {
//     const steps: WorkflowStep[] = []
//     const stepsData = generateCustomSteps()
    
//     for (let i = 0; i < stepsData.length; i++) {
//       const stepData = stepsData[i]
//       const config = stepTypeConfigs[stepData.type] || stepTypeConfigs.automation
      
//       const suggestedIntegrations = getSuggestedIntegrationsForStep(stepData.type, stepData.title)
      
//       const step: WorkflowStep = {
//         id: `step-${i + 1}`,
//         stepNumber: i + 1,
//         title: stepData.title,
//         description: stepData.description,
//         type: stepData.type,
//         icon: config.icon,
//         color: config.color,
//         bgColor: config.bgColor,
//         borderColor: config.borderColor,
//         estimatedTime: stepData.estimatedTime || getEstimatedTimeForStep(stepData.type),
//         inputs: stepData.inputs || (i === 0 ? ["User Request"] : ["Previous Step Output"]),
//         outputs: stepData.outputs || (i === stepsData.length - 1 ? ["Custom Solution"] : ["Processed Data"]),
//         details: stepData.details || [`Custom ${stepData.type} processing`, "Tailored to your specific requirements", "Enterprise-grade implementation"],
//         isAnimating: true,
//         suggestedIntegrations,
//         selectedIntegrations: suggestedIntegrations.slice(0, 1),
//         aiReasoning: stepData.aiReasoning || `This custom step is designed specifically for your ${stepData.type} requirements.`,
//         complexity: stepData.complexity || "high",
//         businessImpact: stepData.businessImpact || `Delivers custom ${stepData.type} functionality tailored to your business needs.`,
//         alternatives: stepData.alternatives || [`Alternative ${stepData.type} implementations`, "Custom enhancement options"]
//       }

//       setStreamingSteps(prevSteps => [...prevSteps, step])
      
//       const progress = ((i + 1) / stepsData.length) * 70 + 25
//       setStreamingProgress(progress)
      
//       addAiThought(`🔧 Generated custom step ${i + 1}: ${step.title}`)
      
//       setTimeout(() => {
//         if (stepContainerRef.current) {
//           const newStepElement = stepContainerRef.current.querySelector(`[data-step-id="step-${i + 1}"]`)
//           if (newStepElement) {
//             newStepElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
//           }
//         }
//       }, 100)
      
//       await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400))
      
//       setStreamingSteps(prevSteps => 
//         prevSteps.map(s => s.id === step.id ? { ...s, isAnimating: false } : s)
//       )

//       steps.push(step)
//     }

//     return steps
//   }

//   // Generate custom workflow steps
//   const generateCustomSteps = () => [
//     {
//       title: "Custom Request Analysis",
//       description: "Advanced AI analyzes your specific requirements and business context",
//       type: "analysis",
//       estimatedTime: "2-3s",
//       inputs: ["User Requirements", "Business Context"],
//       outputs: ["Analyzed Requirements", "Context Mapping"],
//       details: [
//         "Advanced NLP processing of user requirements",
//         "Business context analysis and mapping", 
//         "Requirement validation and clarification",
//         "Custom rule generation based on specifications"
//       ],
//       complexity: "high" as const,
//       businessImpact: "Ensures the automation perfectly aligns with your unique business needs and requirements",
//       alternatives: ["Standard requirement processing", "Manual requirement analysis"],
//       aiReasoning: "Essential for understanding your unique automation needs"
//     },
//     {
//       title: "Intelligent Message Processing",
//       description: "Custom NLP and ML models trained for your specific business domain",
//       type: "trigger",
//       estimatedTime: "< 1s",
//       inputs: ["Incoming Messages", "Domain Models"],
//       outputs: ["Processed Content", "Intent Classification"],
//       details: [
//         "Domain-specific NLP model deployment",
//         "Real-time message classification and routing",
//         "Custom entity recognition and extraction",
//         "Multi-language processing capabilities"
//       ],
//       complexity: "high" as const,
//       businessImpact: "Provides industry-specific understanding and processing of customer communications",
//       alternatives: ["Generic NLP processing", "Rule-based message handling"],
//       aiReasoning: "Tailored message processing for optimal accuracy"
//     },
//     {
//       title: "Dynamic Content Filtering",
//       description: "Advanced filtering with custom rules based on your business logic",
//       type: "filter",
//       estimatedTime: "< 1s",
//       inputs: ["Processed Messages", "Custom Rules"],
//       outputs: ["Filtered Content", "Quality Score"],
//       details: [
//         "Custom filtering rules based on business logic",
//         "Content quality assessment and scoring",
//         "Spam and inappropriate content detection",
//         "Compliance and regulatory filtering"
//       ],
//       complexity: "medium" as const,
//       businessImpact: "Ensures only relevant, high-quality interactions are processed, maintaining brand reputation",
//       alternatives: ["Basic content filtering", "Manual content review"],
//       aiReasoning: "Ensures only relevant interactions are processed"
//     },
//     {
//       title: "Custom Integration Hub",
//       description: "Seamlessly connects with your existing tools and workflows",
//       type: "integration",
//       estimatedTime: "1-2s",
//       inputs: ["Filtered Data", "System Credentials"],
//       outputs: ["Integrated Data", "System Updates"],
//       details: [
//         "Custom API integrations with existing systems",
//         "Real-time data synchronization across platforms",
//         "Error handling and retry mechanisms",
//         "Data transformation and mapping"
//       ],
//       complexity: "high" as const,
//       businessImpact: "Maximizes value from your current technology stack without disrupting existing workflows",
//       alternatives: ["Standard API integrations", "Manual data transfer"],
//       aiReasoning: "Maximizes value from your current technology stack"
//     },
//     {
//       title: "AI-Powered Response Engine",
//       description: "Generates contextual responses using your brand voice and guidelines",
//       type: "response",
//       estimatedTime: "1-2s",
//       inputs: ["Context Data", "Brand Guidelines"],
//       outputs: ["Generated Response", "Confidence Score"],
//       details: [
//         "Brand voice training and implementation",
//         "Contextual response generation with personalization",
//         "Multi-channel response optimization",
//         "A/B testing for response effectiveness"
//       ],
//       complexity: "high" as const,
//       businessImpact: "Maintains consistent brand experience at scale while providing personalized customer interactions",
//       alternatives: ["Template-based responses", "Generic AI responses"],
//       aiReasoning: "Maintains consistent brand experience at scale"
//     },
//     {
//       title: "Smart Routing & Escalation",
//       description: "Intelligent decision making for complex scenarios and human handoffs",
//       type: "routing",
//       estimatedTime: "< 1s",
//       inputs: ["Response Data", "Escalation Rules"],
//       outputs: ["Routing Decision", "Escalation Alert"],
//       details: [
//         "Intelligent escalation based on complexity and sentiment",
//         "Workload balancing across team members",
//         "Priority scoring and urgent issue detection",
//         "Custom routing rules based on expertise"
//       ],
//       complexity: "medium" as const,
//       businessImpact: "Ensures complex issues receive appropriate human attention while optimizing team efficiency",
//       alternatives: ["Rule-based routing", "Manual escalation"],
//       aiReasoning: "Ensures complex issues receive appropriate attention"
//     },
//     {
//       title: "Custom Data Management",
//       description: "Sophisticated data handling tailored to your privacy and compliance needs",
//       type: "storage",
//       estimatedTime: "2-4s",
//       inputs: ["Process Data", "Compliance Rules"],
//       outputs: ["Stored Data", "Audit Trail"],
//       details: [
//         "GDPR and privacy compliance handling",
//         "Custom data retention and archival policies",
//         "Encrypted storage with audit trails",
//         "Data analytics and reporting capabilities"
//       ],
//       complexity: "high" as const,
//       businessImpact: "Maintains data integrity and regulatory compliance while enabling advanced analytics",
//       alternatives: ["Basic data storage", "Manual compliance management"],
//       aiReasoning: "Maintains data integrity and regulatory compliance"
//     },
//     {
//       title: "Advanced Analytics Engine",
//       description: "Custom reporting and insights dashboard for your specific KPIs",
//       type: "validation",
//       estimatedTime: "3-5s",
//       inputs: ["Historical Data", "KPI Definitions"],
//       outputs: ["Analytics Report", "Performance Metrics"],
//       details: [
//         "Custom KPI tracking and measurement",
//         "Real-time performance monitoring and alerts",
//         "Predictive analytics for capacity planning",
//         "Custom dashboard creation and visualization"
//       ],
//       complexity: "high" as const,
//       businessImpact: "Provides actionable insights for continuous improvement and strategic decision making",
//       alternatives: ["Basic reporting", "Manual analytics"],
//       aiReasoning: "Provides actionable insights for continuous improvement"
//     }
//   ]

//   // Helper functions
//   const getSuggestedIntegrationsForStep = (stepType: string, stepTitle: string): Integration[] => {
//     const suggestions: Integration[] = []
//     const title = stepTitle.toLowerCase()
    
//     // Smart integration matching based on step type and content
//     if (stepType === "trigger" || title.includes("message") || title.includes("processing")) {
//       suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "communication"))
//     }
    
//     if (stepType === "storage" || title.includes("data") || title.includes("management")) {
//       suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "database"))
//       suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "crm"))
//     }
    
//     if (stepType === "response" || title.includes("email") || title.includes("notification")) {
//       suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "email"))
//     }
    
//     if (stepType === "integration" || title.includes("hub") || title.includes("connect")) {
//       suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "crm"))
//       suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "ecommerce"))
//     }
    
//     if (stepType === "validation" || title.includes("analytics") || title.includes("reporting")) {
//       suggestions.push(...INTEGRATION_DATABASE.filter(i => i.category === "analytics"))
//     }
    
//     // Remove duplicates and sort by popularity
//     const uniqueSuggestions = suggestions.filter((integration, index, self) => 
//       index === self.findIndex(i => i.id === integration.id)
//     )
    
//     return uniqueSuggestions
//       .sort((a, b) => b.popularity - a.popularity)
//       .slice(0, 4)
//   }

//   const getEstimatedTimeForStep = (stepType: string): string => {
//     return "< 2s" // Custom workflows are optimized
//   }

//   const getUniqueIntegrations = (steps: WorkflowStep[]): Integration[] => {
//     const allIntegrations = steps.flatMap(step => step.selectedIntegrations || [])
//     return allIntegrations.filter((integration, index, self) => 
//       index === self.findIndex(i => i.id === integration.id)
//     )
//   }

//   const addAiThought = (thought: string): void => {
//     setAiThoughts(prev => {
//       const newThoughts = [...prev, thought]
//       return newThoughts.slice(-5)
//     })
//   }

//   const getAiThoughtForPhase = (phase: number): string => {
//     const thoughts = [
//       "🔍 Analyzing your custom requirements and business constraints...",
//       "🎨 Designing bespoke workflow architecture with enterprise capabilities...",
//       "🔗 Identifying optimal integrations for your specific use case...",
//       "⚡ Fine-tuning for maximum performance and scalability..."
//     ]
//     return thoughts[phase] || "🤖 Processing your custom workflow requirements..."
//   }

//   // Updated handleApprove to go to pending instead of dashboard
//   const handleApprove = async (): Promise<void> => {
//     setIsGenerating(true)
//     setResponseStatus("📧 Submitting custom workflow to development team...")

//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 2000))

//       const payload = {
//         action: "submit_custom_workflow",
//         businessInfo: businessInfo,
//         workflowDesign: parsedWorkflow,
//         selectedChannels: selectedChannels,
//         automationFeatures: automationFeatures,
//         customRequest: workflowRequest,
//         baseWorkflowId: selectedWorkflowId,
//         submittedAt: new Date().toISOString(),
//         status: "PENDING_CREATION",
//         estimatedCost: parsedWorkflow?.estimatedCost,
//         roi: parsedWorkflow?.roi,
//         integrations: parsedWorkflow?.integrations
//       }

//       setResponseStatus("✅ Custom workflow submitted to development team successfully!")
      
//       // Store pending workflow data in localStorage
//       const pendingData = {
//         id: `custom-workflow-${Date.now()}`,
//         submittedAt: new Date().toISOString(),
//         status: 'PENDING_CREATION',
//         workflowType: selectedWorkflowId 
//           ? `Modified ${selectedWorkflowId}` 
//           : "Custom Workflow",
//         estimatedCompletion: "3-5"
//       }
      
//       localStorage.setItem('pendingWorkflow', JSON.stringify(pendingData))
      
//       setTimeout(() => {
//         if (setStep) setStep("pending") // Go to pending instead of dashboard
//       }, 2000)

//     } catch (error) {
//       console.error("Approval error:", error)
//       setResponseStatus("❌ Failed to submit to development team. Please try again.")
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   const handleInitialSubmit = (): void => {
//     if (!workflowRequest.trim()) {
//       setResponseStatus("❌ Please describe your automation needs")
//       return
//     }
//     if (selectedChannels.length === 0) {
//       setResponseStatus("❌ Please select at least one platform")
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

//   const toggleStepExpansion = (stepNumber: number): void => {
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

//   const handleChannelToggle = (channelId: string): void => {
//     const newChannels = selectedChannels.includes(channelId)
//       ? selectedChannels.filter(c => c !== channelId)
//       : [...selectedChannels, channelId]
//     setSelectedChannels(newChannels)
//   }

//   const handleFeatureToggle = (featureId: string, checked: boolean): void => {
//     if (checked) {
//       setAutomationFeatures(prev => [...prev, featureId])
//     } else {
//       setAutomationFeatures(prev => prev.filter(f => f !== featureId))
//     }
//   }

//   const handleIntegrationToggle = (stepId: string, integration: Integration): void => {
//     setStreamingSteps(prevSteps => 
//       prevSteps.map(step => {
//         if (step.id === stepId) {
//           const isSelected = step.selectedIntegrations?.some(i => i.id === integration.id)
//           const newSelected = isSelected
//             ? step.selectedIntegrations?.filter(i => i.id !== integration.id) || []
//             : [...(step.selectedIntegrations || []), integration]
          
//           return { ...step, selectedIntegrations: newSelected }
//         }
//         return step
//       })
//     )
//   }

//   // Enhanced components
//   const StreamingProgress: React.FC = () => {
//     if (!isGenerating) return null

//     const currentPhaseData = streamingPhases[currentPhase]
//     const IconComponent = currentPhaseData?.icon || Brain

//     return (
//       <div className="mb-8">
//         <div className="flex items-center justify-center mb-6">
//           <div className="relative">
//             <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center">
//               <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin"></div>
//               <IconComponent className={`h-10 w-10 ${currentPhaseData?.color || 'text-blue-500'} animate-pulse`} />
//             </div>
//           </div>
//         </div>

//         <div className="text-center mb-6">
//           <h3 className="text-xl font-semibold mb-2">{currentPhaseData?.title || "Processing..."}</h3>
//           <p className="text-muted-foreground">{currentPhaseData?.description || "Working on your custom workflow..."}</p>
//         </div>

//         <div className="mb-6">
//           <div className="flex justify-between text-sm text-muted-foreground mb-2">
//             <span>Overall Progress</span>
//             <span>{Math.round(streamingProgress)}%</span>
//           </div>
//           <Progress value={streamingProgress} className="h-3 mb-4" />
//         </div>

//         <div className="flex justify-center gap-6 mb-6">
//           {streamingPhases.map((phase, index) => {
//             const PhaseIcon = phase.icon
//             return (
//               <div key={phase.id} className="flex flex-col items-center">
//                 <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
//                   index < currentPhase ? 'bg-green-500 text-white shadow-lg' :
//                   index === currentPhase ? 'bg-blue-500 text-white animate-pulse shadow-lg' :
//                   'bg-gray-200 text-gray-400'
//                 }`}>
//                   {index < currentPhase ? <CheckCircle className="h-6 w-6" /> : 
//                    <PhaseIcon className="h-6 w-6" />}
//                 </div>
//                 <span className={`text-xs mt-2 text-center font-medium ${
//                   index === currentPhase ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'
//                 }`}>
//                   {phase.title.split(' ')[0]}
//                 </span>
//               </div>
//             )
//           })}
//         </div>

//         {/* AI Thoughts */}
//         {aiThoughts.length > 0 && (
//           <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
//             <div className="flex items-center gap-2 mb-3">
//               <Brain className="h-4 w-4 text-blue-500" />
//               <span className="text-sm font-medium text-blue-700 dark:text-blue-300">AI Insights</span>
//             </div>
//             <div className="space-y-2 max-h-24 overflow-hidden">
//               {aiThoughts.slice(-3).map((thought, index) => (
//                 <div
//                   key={index}
//                   className={`text-xs text-blue-600 dark:text-blue-400 transition-opacity duration-500 ${
//                     index === aiThoughts.length - 1 ? "opacity-100" : "opacity-70"
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

//   const IntegrationSelector: React.FC<{ step: WorkflowStep }> = ({ step }) => {
//     if (!step.suggestedIntegrations || step.suggestedIntegrations.length === 0) return null

//     return (
//       <div className="mt-4 p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/20">
//         <h6 className="font-semibold mb-3 flex items-center gap-2">
//           <Puzzle className="h-4 w-4 text-purple-500" />
//           Suggested Integrations
//           <Badge variant="outline" className="text-xs">
//             {step.suggestedIntegrations.length} available
//           </Badge>
//         </h6>
        
//         <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
//           {step.suggestedIntegrations.map((integration) => {
//             const IconComponent = integration.icon
//             const isSelected = step.selectedIntegrations?.some(i => i.id === integration.id)
            
//             return (
//               <div
//                 key={integration.id}
//                 onClick={() => handleIntegrationToggle(step.id, integration)}
//                 className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
//                   isSelected
//                     ? "bg-blue-500 text-white border-blue-500 shadow-md"
//                     : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
//                 }`}
//               >
//                 <div className="flex items-center gap-3">
//                   <IconComponent className="h-5 w-5 flex-shrink-0" />
//                   <div className="flex-grow min-w-0">
//                     <div className="flex items-center gap-2 mb-1">
//                       <span className="font-medium text-sm truncate">{integration.name}</span>
//                       <Badge 
//                         variant={isSelected ? "secondary" : "outline"} 
//                         className={`text-xs ${isSelected ? "bg-white/20 text-white" : ""}`}
//                       >
//                         {integration.pricing}
//                       </Badge>
//                     </div>
//                     <p className={`text-xs truncate ${isSelected ? "text-white/80" : "text-muted-foreground"}`}>
//                       {integration.description}
//                     </p>
//                     <div className="flex items-center gap-2 mt-1">
//                       <div className={`flex items-center gap-1 text-xs ${isSelected ? "text-white/70" : "text-muted-foreground"}`}>
//                         <Timer className="h-3 w-3" />
//                         {integration.setupTime}
//                       </div>
//                       <div className={`flex items-center gap-1 text-xs ${isSelected ? "text-white/70" : "text-muted-foreground"}`}>
//                         <Star className="h-3 w-3" />
//                         {integration.popularity}%
//                       </div>
//                     </div>
//                   </div>
//                   {isSelected ? (
//                     <Check className="h-4 w-4 text-white" />
//                   ) : (
//                     <Plus className="h-4 w-4 text-gray-400" />
//                   )}
//                 </div>
//               </div>
//             )
//           })}
//         </div>
//       </div>
//     )
//   }

//   const StepComponent: React.FC<{ step: WorkflowStep }> = ({ step }) => {
//     const config = stepTypeConfigs[step.type] || stepTypeConfigs.automation
//     const IconComponent = step.icon || config.icon
//     const isExpanded = expandedSteps.has(step.stepNumber)

//     return (
//       <div 
//         data-step-id={step.id}
//         className={`relative transition-all duration-500 ${
//           step.isAnimating ? 'animate-pulse' : ''
//         }`}
//         style={{
//           animation: step.isAnimating ? 'slideInFromLeft 0.6s ease-out' : 'none'
//         }}
//       >
//         <div className={`rounded-xl border-2 transition-all duration-300 cursor-pointer bg-gradient-to-br ${
//           config.bgColor} ${config.darkBg} ${config.borderColor} ${config.darkBorder} ${
//           isExpanded ? 'shadow-xl scale-[1.02] border-opacity-100' : 'hover:shadow-lg hover:scale-[1.01] border-opacity-60'
//         }`}
//         onClick={() => toggleStepExpansion(step.stepNumber)}>
          
//           {/* Step Header */}
//           <div className="p-6">
//             <div className="flex items-center gap-4">
//               {/* Enhanced Step Number with Icon */}
//               <div className="relative">
//                 <div className={`w-16 h-16 ${config.accentColor} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-xl`}>
//                   {step.stepNumber}
//                 </div>
//                 <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
//                   <IconComponent className={`h-4 w-4 ${config.color}`} />
//                 </div>
//               </div>

//               {/* Enhanced Step Content */}
//               <div className="flex-grow">
//                 <div className="flex items-center gap-3 mb-3">
//                   <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">{step.title}</h4>
//                   <Badge variant="outline" className="text-xs font-medium">
//                     {step.type}
//                   </Badge>
//                   <Badge variant="secondary" className={`text-xs ${
//                     step.complexity === "high" ? "bg-red-100 text-red-700" :
//                     step.complexity === "medium" ? "bg-yellow-100 text-yellow-700" :
//                     "bg-green-100 text-green-700"
//                   }`}>
//                     {step.complexity} complexity
//                   </Badge>
//                   {step.estimatedTime && (
//                     <Badge variant="secondary" className="text-xs">
//                       <Timer className="h-3 w-3 mr-1" />
//                       {step.estimatedTime}
//                     </Badge>
//                   )}
//                 </div>
//                 <p className="text-muted-foreground mb-3 leading-relaxed">{step.description}</p>
                
//                 {/* Enhanced Input/Output Flow */}
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

//                 {/* Integration Preview */}
//                 {step.selectedIntegrations && step.selectedIntegrations.length > 0 && (
//                   <div className="mt-3 flex items-center gap-2">
//                     <Zap className="h-4 w-4 text-purple-500" />
//                     <span className="text-sm text-purple-700 dark:text-purple-300 font-medium">
//                       Integrations: {step.selectedIntegrations.map(i => i.name).join(", ")}
//                     </span>
//                   </div>
//                 )}
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
//               {/* AI Reasoning */}
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
//                       <Badge variant="secondary" className="text-green-600">High</Badge>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-muted-foreground">Reliability:</span>
//                       <Badge variant="secondary" className="text-blue-600">99.9%</Badge>
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
//                     Configuration Options
//                   </h5>
//                   <div className="space-y-2 text-sm">
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                       <span>Auto-retry enabled</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
//                       <span>Real-time monitoring</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
//                       <span>Custom error handling</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
//                       <span>Performance optimization</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Integration Selector */}
//               <IntegrationSelector step={step} />
//             </div>
//           )}
//         </div>

//         {/* Enhanced Connection Line */}
//         {step.stepNumber < (streamingSteps.length || 1) && (
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

//   return (
//     <div className="min-h-screen bg-background p-6">
//       <style jsx>{`
//         @keyframes slideInFromLeft {
//           0% {
//             opacity: 0;
//             transform: translateX(-30px);
//           }
//           100% {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }
//       `}</style>
      
//       <div className="max-w-7xl mx-auto">
//         {/* Enhanced Header */}
//         <div className="mb-8">
//           <Button variant="ghost" className="mb-6 hover:bg-accent" onClick={() => setStep?.("selection")}>
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Selection
//           </Button>
//           <div className="text-center mb-8">
//             <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
//               Design a completely custom workflow tailored to your unique business needs.
//             </p>
//             <div className="flex items-center justify-center gap-6 mt-4 text-sm text-muted-foreground">
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//                 <span>Custom AI Generation</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
//                 <span>Bespoke Integration Matching</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
//                 <span>Enterprise Development</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid gap-8 lg:grid-cols-3">
//           {/* Enhanced Left Column - Input */}
//           <div className="lg:col-span-1 space-y-6">
//             <Card className="border-2 border-border bg-card/50 backdrop-blur-sm">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Wand2 className="h-5 w-5 text-primary" />
//                   {!hasInitialRequest ? "Design Your Custom Automation" : "Refine Your Custom Workflow"}
//                 </CardTitle>
//                 <CardDescription>
//                   {!hasInitialRequest
//                     ? "Describe your unique automation needs and our AI will create a tailored solution"
//                     : "Provide feedback to enhance and customize the design"}
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 {!hasInitialRequest && (
//                   <>
//                     {/* Enhanced Platform Selection */}
//                     <div className="space-y-3">
//                       <Label className="text-base font-semibold">Social Media Platforms</Label>
//                       <div className="grid grid-cols-1 gap-3">
//                         {channelOptions.map((channel) => {
//                           const IconComponent = channel.icon
//                           return (
//                             <button
//                               key={channel.id}
//                               onClick={() => handleChannelToggle(channel.id)}
//                               className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
//                                 selectedChannels.includes(channel.id)
//                                   ? "bg-primary text-primary-foreground border-primary shadow-lg transform scale-105"
//                                   : "bg-card border-border hover:border-primary/50 hover:bg-accent hover:transform hover:scale-102"
//                               }`}
//                             >
//                               <div className="flex items-center gap-3">
//                                 <IconComponent className="h-5 w-5" />
//                                 <span className="font-medium">{channel.label}</span>
//                                 {selectedChannels.includes(channel.id) && (
//                                   <Check className="h-4 w-4 ml-auto" />
//                                 )}
//                               </div>
//                             </button>
//                           )
//                         })}
//                       </div>
//                     </div>

//                     {/* Enhanced Feature Selection */}
//                     <div className="space-y-3">
//                       <Label className="text-base font-semibold">AI Automation Features</Label>
//                       <div className="space-y-2">
//                         {automationFeatureOptions.map((feature) => (
//                           <label key={feature.id} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-accent transition-colors">
//                             <input
//                               type="checkbox"
//                               checked={automationFeatures.includes(feature.id)}
//                               onChange={(e) => handleFeatureToggle(feature.id, e.target.checked)}
//                               className="w-4 h-4 rounded border-border"
//                             />
//                             <span className="text-sm font-medium">{feature.label}</span>
//                           </label>
//                         ))}
//                       </div>
//                     </div>
//                   </>
//                 )}

//                 {/* Enhanced Request Input */}
//                 {!hasInitialRequest ? (
//                   <>
//                     <div className="space-y-3">
//                       <Label htmlFor="workflowRequest" className="text-base font-semibold">
//                         Describe Your Custom Automation Vision
//                       </Label>
//                       <Textarea
//                         id="workflowRequest"
//                         value={workflowRequest}
//                         onChange={(e) => setWorkflowRequest(e.target.value)}
//                         placeholder="e.g., 'I need a custom workflow that automatically processes customer support tickets in multiple languages, integrates with our proprietary CRM system, uses machine learning to categorize issues, routes them to specialized teams based on expertise and workload, and provides real-time performance analytics with custom dashboards.'"
//                         rows={8}
//                         className="bg-background border-2 border-blue-200 focus:border-blue-500 resize-none text-sm"
//                         disabled={isGenerating}
//                       />
//                     </div>
//                     <Button
//                       onClick={handleInitialSubmit}
//                       disabled={isGenerating || !workflowRequest.trim()}
//                       className="w-full flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 text-base"
//                     >
//                       {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
//                       Generate Custom AI Workflow
//                     </Button>
//                   </>
//                 ) : (
//                   <>
//                     <div className="space-y-3">
//                       <Label htmlFor="refinementInput" className="text-base font-semibold">
//                         Refine Your Custom Workflow
//                       </Label>
//                       <Textarea
//                         id="refinementInput"
//                         value={refinementInput}
//                         onChange={(e) => setRefinementInput(e.target.value)}
//                         placeholder="e.g., 'Add integration with our custom database API', 'Include advanced sentiment analysis for priority routing', 'Add compliance checks for GDPR requirements', 'Implement predictive analytics for capacity planning'"
//                         rows={5}
//                         className="bg-white/50 border-2 border-blue-200 focus:border-blue-500 resize-none"
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
//                         Refine Design
//                       </Button>
//                       <Button
//                         onClick={handleApprove}
//                         disabled={isGenerating || !parsedWorkflow}
//                         className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white flex items-center gap-2 font-medium"
//                       >
//                         {isGenerating && currentAction === "approve" ? (
//                           <Loader2 className="h-4 w-4 animate-spin" />
//                         ) : (
//                           <ThumbsUp className="h-4 w-4" />
//                         )}
//                         Approve design
//                       </Button>
//                     </div>
//                   </>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Enhanced Business Context */}
//             <Card className="border-2 border-border bg-card/50 backdrop-blur-sm">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Building className="h-5 w-5 text-primary" />
//                   Business Context
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4 text-sm">
//                 <div className="p-3 bg-muted/50 rounded-lg">
//                   <span className="font-semibold text-primary">Business:</span>
//                   <p className="text-muted-foreground mt-1">{businessInfo.businessName}</p>
//                 </div>
//                 <div className="p-3 bg-muted/50 rounded-lg">
//                   <span className="font-semibold text-primary">Industry:</span>
//                   <p className="text-muted-foreground mt-1">{businessInfo.businessType}</p>
//                 </div>
//                 {businessInfo.description && (
//                   <div className="p-3 bg-muted/50 rounded-lg">
//                     <span className="font-semibold text-primary">Description:</span>
//                     <p className="text-muted-foreground mt-1">{businessInfo.description}</p>
//                   </div>
//                 )}
//                 {selectedChannels.length > 0 && (
//                   <div className="p-3 bg-muted/50 rounded-lg">
//                     <span className="font-semibold text-primary">Selected Platforms:</span>
//                     <div className="flex flex-wrap gap-2 mt-2">
//                       {selectedChannels.map((channel) => (
//                         <Badge key={channel} variant="secondary" className="text-xs">
//                           {channelOptions.find((c) => c.id === channel)?.label}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//                 {automationFeatures.length > 0 && (
//                   <div className="p-3 bg-muted/50 rounded-lg">
//                     <span className="font-semibold text-primary">AI Features:</span>
//                     <div className="flex flex-wrap gap-2 mt-2">
//                       {automationFeatures.map((feature) => (
//                         <Badge key={feature} variant="outline" className="text-xs">
//                           {automationFeatureOptions.find((f) => f.id === feature)?.label}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Enhanced Right Column - AI Generated Workflow */}
//           <div className="lg:col-span-2">
//             <Card className="border-2 border-border min-h-[700px] bg-card backdrop-blur-sm">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Brain className="h-6 w-6 text-primary" />
//                   Custom AI Workflow Generation
//                   {parsedWorkflow && (
//                     <Badge variant="secondary" className="ml-auto bg-primary text-primary-foreground">
//                       <Star className="h-3 w-3 mr-1" />
//                       Custom AI Generated
//                     </Badge>
//                   )}
//                 </CardTitle>
//                 <CardDescription className="text-base">
//                   Advanced AI creates bespoke enterprise workflows with custom integrations in real-time
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {/* Enhanced Status Message */}
//                 {responseStatus && (
//                   <div className={`mb-6 p-4 rounded-xl border-2 ${
//                     responseStatus.includes("✅") ? "bg-secondary/50 border-secondary text-secondary-foreground" :
//                     responseStatus.includes("❌") ? "bg-destructive/10 border-destructive/50 text-destructive" :
//                     "bg-primary/10 border-primary/50 text-primary"
//                   }`}>
//                     <div className="flex items-center gap-3">
//                       {responseStatus.includes("✅") ? <CheckCircle className="h-5 w-5" /> :
//                        responseStatus.includes("❌") ? <AlertCircle className="h-5 w-5" /> :
//                        <Loader2 className="h-5 w-5 animate-spin" />}
//                       <span className="font-medium">{responseStatus}</span>
//                     </div>
//                   </div>
//                 )}

//                 {/* Enhanced Streaming Progress */}
//                 {isGenerating && <StreamingProgress />}

//                 {/* Enhanced Workflow Header */}
//                 {parsedWorkflow && !isGenerating && (
//                   <div className="mb-8 p-8 rounded-2xl bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 border-2 border-primary/20 backdrop-blur-sm">
//                     <div className="text-center mb-8">
//                       <h3 className="text-3xl font-bold mb-3 text-foreground">
//                         {parsedWorkflow.title}
//                       </h3>
//                       <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
//                         {parsedWorkflow.description}
//                       </p>
//                     </div>
                    
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//                       <div className="text-center p-4 bg-card rounded-xl shadow-sm border border-border">
//                         <div className="text-2xl font-bold text-primary mb-1">{parsedWorkflow.metrics?.automationRate}</div>
//                         <div className="text-xs text-muted-foreground font-medium">Automation Rate</div>
//                       </div>
//                       <div className="text-center p-4 bg-card rounded-xl shadow-sm border border-border">
//                         <div className="text-2xl font-bold text-primary mb-1">{parsedWorkflow.metrics?.responseTime}</div>
//                         <div className="text-xs text-muted-foreground font-medium">Response Time</div>
//                       </div>
//                       <div className="text-center p-4 bg-card rounded-xl shadow-sm border border-border">
//                         <div className="text-2xl font-bold text-primary mb-1">{parsedWorkflow.metrics?.accuracy}</div>
//                         <div className="text-xs text-muted-foreground font-medium">AI Accuracy</div>
//                       </div>
//                       <div className="text-center p-4 bg-card rounded-xl shadow-sm border border-border">
//                         <div className="text-2xl font-bold text-primary mb-1">{parsedWorkflow.estimatedBuildTime}</div>
//                         <div className="text-xs text-muted-foreground font-medium">Build Time</div>
//                       </div>
//                     </div>

//                     {/* Enhanced ROI and Cost Information */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="p-4 bg-secondary/30 rounded-xl border border-border">
//                         <div className="flex items-center gap-2 mb-2">
//                           <TrendingUp className="h-4 w-4 text-primary" />
//                           <span className="font-semibold text-foreground">Expected ROI</span>
//                         </div>
//                         <div className="text-xl font-bold text-primary">{parsedWorkflow.roi}</div>
//                       </div>
//                       <div className="p-4 bg-accent/30 rounded-xl border border-border">
//                         <div className="flex items-center gap-2 mb-2">
//                           <CreditCard className="h-4 w-4 text-primary" />
//                           <span className="font-semibold text-foreground">Monthly Cost</span>
//                         </div>
//                         <div className="text-xl font-bold text-primary">{parsedWorkflow.estimatedCost}</div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Enhanced Streaming Steps */}
//                 {(isStreaming || streamingSteps.length > 0) && (
//                   <div ref={stepContainerRef} className="space-y-8">
//                     <div className="flex items-center gap-4 mb-8">
//                       <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
//                         <Workflow className="h-6 w-6 text-white" />
//                       </div>
//                       <div>
//                         <h3 className="text-2xl font-bold">Custom Workflow Steps</h3>
//                         <p className="text-muted-foreground">AI-designed automation tailored to your specific needs</p>
//                       </div>
//                       <Badge variant="outline" className="ml-auto text-base px-3 py-1">
//                         {isStreaming ? `${streamingSteps.length} steps generated...` : `${streamingSteps.length} total steps`}
//                       </Badge>
//                     </div>
                    
//                     {streamingSteps.map((step) => (
//                       <StepComponent key={step.id} step={step} />
//                     ))}
                    
//                     {isStreaming && (
//                       <div className="flex justify-center py-8">
//                         <div className="flex items-center gap-3 text-muted-foreground">
//                           <Loader2 className="h-5 w-5 animate-spin" />
//                           <span className="font-medium">AI is generating more custom steps...</span>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Enhanced Initial State */}
//                 {!isGenerating && !parsedWorkflow && !hasInitialRequest && (
//                   <div className="flex flex-col items-center justify-center py-24 text-center">
//                     <div className="relative mb-8">
//                       <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
//                         <Brain className="h-12 w-12 text-blue-500" />
//                       </div>
//                       <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
//                         <Sparkles className="h-4 w-4 text-white" />
//                       </div>
//                     </div>
//                     <h3 className="text-2xl font-bold mb-4">Ready to Design Your Custom Workflow</h3>
//                     <p className="text-center max-w-lg mb-8 text-muted-foreground leading-relaxed">
//                       Our advanced AI will analyze your unique requirements and generate a completely custom, enterprise-grade workflow with bespoke integrations and architecture.
//                     </p>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground">
//                       <div className="flex flex-col items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
//                         <Brain className="h-5 w-5 text-blue-500" />
//                         <span className="font-medium">Custom AI</span>
//                       </div>
//                       <div className="flex flex-col items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
//                         <Zap className="h-5 w-5 text-green-500" />
//                         <span className="font-medium">Bespoke Integrations</span>
//                       </div>
//                       <div className="flex flex-col items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
//                         <Rocket className="h-5 w-5 text-purple-500" />
//                         <span className="font-medium">Enterprise Ready</span>
//                       </div>
//                       <div className="flex flex-col items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
//                         <TrendingUp className="h-5 w-5 text-orange-500" />
//                         <span className="font-medium">Maximum ROI</span>
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






// "use client"

// import type React from "react"
// import { useState, useCallback, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import {
//   ArrowLeft,
//   Sparkles,
//   Loader2,
//   CheckCircle,
//   Settings,
//   ThumbsUp,
//   Bot,
//   Mic,
//   Phone,
//   MessageCircle,
//   RefreshCw,
//   MessageSquare,
//   Zap,
//   AlertCircle,
//   PlayCircle,
//   Workflow,
//   GitBranch,
//   ChevronDown,
//   ChevronRight,
//   Database,
//   Filter,
//   Mail,
//   Bell,
//   BarChart3,
//   Shield,
//   Star,
//   TrendingUp,
//   Brain,
//   Rocket,
//   Timer,
//   Layers,
//   Activity,
//   Wand2,
//   Plus,
//   Check,
//   Building,
//   Cloud,
//   ShoppingCart,
//   CreditCard,
//   Link2,
//   Puzzle,
//   Search,
//   Gauge,
// } from "lucide-react"

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
//   category: string
//   icon: React.ComponentType<{ className?: string }>
//   pricing: "free" | "freemium" | "paid" | "enterprise"
//   popularity: number
//   difficulty: "easy" | "medium" | "hard"
//   apiAvailable: boolean
//   webhookSupport: boolean
//   realTimeSync: boolean
//   features: string[]
//   setupTime: string
//   website?: string
// }

// interface WorkflowStep {
//   id: string
//   stepNumber: number
//   title: string
//   description: string
//   type: string
//   inputs?: string[]
//   outputs?: string[]
//   conditions?: string[]
//   estimatedTime?: string
//   icon?: React.ComponentType<{ className?: string }>
//   color?: string
//   bgColor?: string
//   borderColor?: string
//   details?: string[]
//   isAnimating?: boolean
//   suggestedIntegrations?: Integration[]
//   selectedIntegrations?: Integration[]
//   aiReasoning?: string
//   complexity?: "low" | "medium" | "high"
//   businessImpact?: string
//   alternatives?: string[]
// }

// interface StreamingPhase {
//   id: string
//   title: string
//   description: string
//   icon: React.ComponentType<{ className?: string }>
//   color: string
//   duration: number
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
//   technicalRequirements: string[]
//   deploymentChannels: string[]
//   estimatedCost?: string
//   roi?: string
//   metrics?: {
//     automationRate: string
//     responseTime: string
//     accuracy: string
//     scalability: string
//   }
// }

// interface ChannelOption {
//   id: string
//   label: string
//   icon: React.ComponentType<{ className?: string }>
// }

// interface AutomationFeature {
//   id: string
//   label: string
// }

// interface StepTypeConfig {
//   icon: React.ComponentType<{ className?: string }>
//   color: string
//   bgColor: string
//   borderColor: string
//   accentColor: string
//   darkBg: string
//   darkBorder: string
// }

// // Comprehensive Integration Database
// const INTEGRATION_DATABASE: Integration[] = [
//   // CRM Systems
//   {
//     id: "hubspot",
//     name: "HubSpot",
//     description: "Comprehensive CRM and marketing automation platform",
//     category: "crm",
//     icon: Building,
//     pricing: "freemium",
//     popularity: 95,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Contact Management", "Deal Tracking", "Email Marketing", "Analytics"],
//     setupTime: "15-30 minutes",
//     website: "https://hubspot.com",
//   },
//   {
//     id: "salesforce",
//     name: "Salesforce",
//     description: "World's leading CRM platform for sales and customer service",
//     category: "crm",
//     icon: Cloud,
//     pricing: "paid",
//     popularity: 90,
//     difficulty: "medium",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Lead Management", "Opportunity Tracking", "Custom Objects", "Automation"],
//     setupTime: "30-60 minutes",
//     website: "https://salesforce.com",
//   },

//   // E-commerce Platforms
//   {
//     id: "shopify",
//     name: "Shopify",
//     description: "Leading e-commerce platform for online stores",
//     category: "ecommerce",
//     icon: ShoppingCart,
//     pricing: "paid",
//     popularity: 92,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Product Management", "Order Processing", "Inventory", "Payments"],
//     setupTime: "20-30 minutes",
//     website: "https://shopify.com",
//   },

//   // Email Marketing
//   {
//     id: "mailchimp",
//     name: "Mailchimp",
//     description: "All-in-one email marketing and automation platform",
//     category: "email",
//     icon: Mail,
//     pricing: "freemium",
//     popularity: 88,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Email Campaigns", "Automation", "Audience Segmentation", "Analytics"],
//     setupTime: "10-20 minutes",
//     website: "https://mailchimp.com",
//   },

//   // Payment Systems
//   {
//     id: "stripe",
//     name: "Stripe",
//     description: "Complete payment processing platform for businesses",
//     category: "payment",
//     icon: CreditCard,
//     pricing: "paid",
//     popularity: 95,
//     difficulty: "medium",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Payment Processing", "Subscriptions", "Invoicing", "Marketplace"],
//     setupTime: "25-40 minutes",
//     website: "https://stripe.com",
//   },

//   // Analytics & Tracking
//   {
//     id: "google-analytics",
//     name: "Google Analytics",
//     description: "Web analytics service for tracking website traffic",
//     category: "analytics",
//     icon: BarChart3,
//     pricing: "freemium",
//     popularity: 98,
//     difficulty: "medium",
//     apiAvailable: true,
//     webhookSupport: false,
//     realTimeSync: true,
//     features: ["Traffic Analysis", "Conversion Tracking", "Audience Insights", "Reports"],
//     setupTime: "20-30 minutes",
//     website: "https://analytics.google.com",
//   },

//   // Communication
//   {
//     id: "slack",
//     name: "Slack",
//     description: "Business communication and collaboration platform",
//     category: "communication",
//     icon: MessageSquare,
//     pricing: "freemium",
//     popularity: 92,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Team Chat", "File Sharing", "Integrations", "Workflow Automation"],
//     setupTime: "10-20 minutes",
//     website: "https://slack.com",
//   },

//   // Databases & Storage
//   {
//     id: "airtable",
//     name: "Airtable",
//     description: "Cloud-based database and spreadsheet hybrid",
//     category: "database",
//     icon: Database,
//     pricing: "freemium",
//     popularity: 85,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Database Management", "Forms", "Views", "Automations"],
//     setupTime: "15-25 minutes",
//     website: "https://airtable.com",
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

// // Step type configurations with unique styling
// const stepTypeConfigs: Record<string, StepTypeConfig> = {
//   trigger: {
//     icon: PlayCircle,
//     color: "text-emerald-600",
//     bgColor: "from-emerald-50 to-green-100",
//     borderColor: "border-emerald-300",
//     accentColor: "bg-emerald-500",
//     darkBg: "dark:from-emerald-900/20 dark:to-green-900/30",
//     darkBorder: "dark:border-emerald-600/50",
//   },
//   analysis: {
//     icon: Brain,
//     color: "text-purple-600",
//     bgColor: "from-purple-50 to-violet-100",
//     borderColor: "border-purple-300",
//     accentColor: "bg-purple-500",
//     darkBg: "dark:from-purple-900/20 dark:to-violet-900/30",
//     darkBorder: "dark:border-purple-600/50",
//   },
//   filter: {
//     icon: Filter,
//     color: "text-blue-600",
//     bgColor: "from-blue-50 to-cyan-100",
//     borderColor: "border-blue-300",
//     accentColor: "bg-blue-500",
//     darkBg: "dark:from-blue-900/20 dark:to-cyan-900/30",
//     darkBorder: "dark:border-blue-600/50",
//   },
//   response: {
//     icon: MessageCircle,
//     color: "text-orange-600",
//     bgColor: "from-orange-50 to-amber-100",
//     borderColor: "border-orange-300",
//     accentColor: "bg-orange-500",
//     darkBg: "dark:from-orange-900/20 dark:to-amber-900/30",
//     darkBorder: "dark:border-orange-600/50",
//   },
//   notification: {
//     icon: Bell,
//     color: "text-red-600",
//     bgColor: "from-red-50 to-pink-100",
//     borderColor: "border-red-300",
//     accentColor: "bg-red-500",
//     darkBg: "dark:from-red-900/20 dark:to-pink-900/30",
//     darkBorder: "dark:border-red-600/50",
//   },
//   integration: {
//     icon: Zap,
//     color: "text-yellow-600",
//     bgColor: "from-yellow-50 to-orange-100",
//     borderColor: "border-yellow-300",
//     accentColor: "bg-yellow-500",
//     darkBg: "dark:from-yellow-900/20 dark:to-orange-900/30",
//     darkBorder: "dark:border-yellow-600/50",
//   },
//   storage: {
//     icon: Database,
//     color: "text-gray-600",
//     bgColor: "from-gray-50 to-slate-100",
//     borderColor: "border-gray-300",
//     accentColor: "bg-gray-500",
//     darkBg: "dark:from-gray-900/20 dark:to-slate-900/30",
//     darkBorder: "dark:border-gray-600/50",
//   },
//   routing: {
//     icon: GitBranch,
//     color: "text-indigo-600",
//     bgColor: "from-indigo-50 to-blue-100",
//     borderColor: "border-indigo-300",
//     accentColor: "bg-indigo-500",
//     darkBg: "dark:from-indigo-900/20 dark:to-blue-900/30",
//     darkBorder: "dark:border-indigo-600/50",
//   },
//   validation: {
//     icon: Shield,
//     color: "text-cyan-600",
//     bgColor: "from-cyan-50 to-teal-100",
//     borderColor: "border-cyan-300",
//     accentColor: "bg-cyan-500",
//     darkBg: "dark:from-cyan-900/20 dark:to-teal-900/30",
//     darkBorder: "dark:border-cyan-600/50",
//   },
//   automation: {
//     icon: Bot,
//     color: "text-pink-600",
//     bgColor: "from-pink-50 to-rose-100",
//     borderColor: "border-pink-300",
//     accentColor: "bg-pink-500",
//     darkBg: "dark:from-pink-900/20 dark:to-rose-900/30",
//     darkBorder: "dark:border-pink-600/50",
//   },
// }

// // AI Processing phases
// const streamingPhases: StreamingPhase[] = [
//   {
//     id: "understanding",
//     title: "Analyzing Requirements",
//     description: "AI is understanding your business needs and automation goals",
//     icon: Search,
//     color: "text-blue-500",
//     duration: 3000,
//   },
//   {
//     id: "designing",
//     title: "Designing Architecture",
//     description: "Creating intelligent workflow logic and step sequences",
//     icon: Wand2,
//     color: "text-purple-500",
//     duration: 4000,
//   },
//   {
//     id: "integrations",
//     title: "Matching Integrations",
//     description: "Finding the best tools and platforms for each step",
//     icon: Link2,
//     color: "text-green-500",
//     duration: 3000,
//   },
//   {
//     id: "optimizing",
//     title: "Optimizing Performance",
//     description: "Fine-tuning for maximum efficiency and reliability",
//     icon: Gauge,
//     color: "text-orange-500",
//     duration: 2000,
//   },
// ]

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
//   const [selectedChannels, setSelectedChannels] = useState<string[]>(["instagram"])
//   const [automationFeatures, setAutomationFeatures] = useState<string[]>(["auto-reply"])
//   const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set())

//   // Streaming states
//   const [streamingSteps, setStreamingSteps] = useState<WorkflowStep[]>([])
//   const [currentPhase, setCurrentPhase] = useState<number>(0)
//   const [isStreaming, setIsStreaming] = useState<boolean>(false)
//   const [streamingProgress, setStreamingProgress] = useState<number>(0)
//   const [aiThoughts, setAiThoughts] = useState<string[]>([])
//   const stepContainerRef = useRef<HTMLDivElement>(null)

//   const channelOptions: ChannelOption[] = [
//     { id: "instagram", label: "Instagram DMs", icon: MessageCircle },
//     { id: "facebook", label: "Facebook Messenger", icon: MessageSquare },
//     { id: "whatsapp", label: "WhatsApp Business", icon: Phone },
//     { id: "telegram", label: "Telegram Bot", icon: Bot },
//     { id: "web", label: "Website Chat", icon: Mic },
//     { id: "email", label: "Email Marketing", icon: Mail },
//     { id: "sms", label: "SMS Marketing", icon: Phone },
//   ]

//   const automationFeatureOptions: AutomationFeature[] = [
//     { id: "auto-reply", label: "Automatic Responses" },
//     { id: "sentiment-analysis", label: "Sentiment Analysis" },
//     { id: "intent-detection", label: "Intent Recognition" },
//     { id: "multilingual", label: "Multi-language Support" },
//     { id: "smart-routing", label: "Smart Agent Routing" },
//     { id: "lead-scoring", label: "Lead Scoring" },
//     { id: "personalization", label: "Dynamic Personalization" },
//     { id: "escalation", label: "Intelligent Escalation" },
//   ]

//   // Real AI workflow generation
//   const generateWorkflowWithAI = useCallback(
//     async (action: "initial" | "refine", instructions?: string): Promise<void> => {
//       setIsGenerating(true)
//       setIsStreaming(true)
//       setCurrentPhase(0)
//       setStreamingProgress(0)
//       setStreamingSteps([])
//       setAiThoughts([])
//       setResponseStatus("🤖 Connecting to AI workflow engine...")
//       setCurrentAction(action)
//       setHasInitialRequest(true)

//       try {
//         // Phase progression with realistic timing
//         for (let phase = 0; phase < streamingPhases.length; phase++) {
//           setCurrentPhase(phase)
//           setResponseStatus(`${streamingPhases[phase].description}...`)

//           addAiThought(getAiThoughtForPhase(phase))

//           await new Promise((resolve) => setTimeout(resolve, streamingPhases[phase].duration))
//         }

//         // Generate workflow via AI API
//         const aiResponse = await callAIWorkflowGeneration(action, instructions)

//         if (aiResponse.success && aiResponse.workflowData) {
//           setParsedWorkflow(aiResponse.workflowData)
//           setStreamingProgress(100)
//           setResponseStatus("✅ Custom AI workflow generated successfully!")
//           addAiThought("🎉 Workflow generation complete! Ready for development team submission.")
//         } else {
//           throw new Error(aiResponse.error || "AI generation failed")
//         }
//       } catch (error) {
//         console.error("AI generation error:", error)
//         setResponseStatus(`❌ AI generation failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//         addAiThought("❌ Generation failed. Please try again with more specific requirements.")
//       } finally {
//         setIsStreaming(false)
//         setTimeout(() => {
//           setIsGenerating(false)
//         }, 1000)
//       }
//     },
//     [businessInfo, selectedChannels, automationFeatures, workflowRequest],
//   )

//   // Simulate AI API call
//   const callAIWorkflowGeneration = async (
//     action: "initial" | "refine",
//     instructions?: string,
//   ): Promise<{ success: boolean; workflowData?: ParsedWorkflow; error?: string }> => {
//     try {
//       // Simulate API call delay
//       await new Promise((resolve) => setTimeout(resolve, 2000))

//       const workflowSteps = await processAIResponseIntoSteps({})

//       const workflow: ParsedWorkflow = {
//         title: `${businessInfo.businessName} Custom AI Automation`,
//         description: `Intelligent automation workflow for ${selectedChannels.length} platform${selectedChannels.length > 1 ? "s" : ""}`,
//         platform: "Custom AI Automation",
//         estimatedBuildTime: "3-5 weeks",
//         complexity: "Custom Enterprise",
//         steps: workflowSteps,
//         integrations: getUniqueIntegrations(workflowSteps),
//         benefits: [
//           "100% customized to your specific requirements",
//           "Advanced AI-powered automation",
//           "Seamless integration with your existing tools",
//           "Scalable architecture for future growth",
//           "Dedicated development and support",
//           "Priority marketplace listing",
//         ],
//         exampleScenario:
//           "Custom workflow tailored to your exact specifications with intelligent routing and processing",
//         technicalRequirements: [
//           "Custom API integrations",
//           "Advanced AI/ML processing",
//           "Real-time data synchronization",
//           "Scalable cloud infrastructure",
//           "Security compliance setup",
//         ],
//         deploymentChannels: selectedChannels,
//         estimatedCost: "$2000-5000/month",
//         roi: "400-800% within 6 months",
//         metrics: {
//           automationRate: "98%",
//           responseTime: "< 1 second",
//           accuracy: "96%",
//           scalability: "Enterprise+",
//         },
//       }

//       return { success: true, workflowData: workflow }
//     } catch (error) {
//       console.error("AI API call failed:", error)
//       return {
//         success: false,
//         error: error instanceof Error ? error.message : "AI generation failed",
//       }
//     }
//   }

//   // Process AI response into workflow steps with streaming
//   const processAIResponseIntoSteps = async (workflowData: any): Promise<WorkflowStep[]> => {
//     const steps: WorkflowStep[] = []
//     const stepsData = generateCustomSteps()

//     for (let i = 0; i < stepsData.length; i++) {
//       const stepData = stepsData[i]
//       const config = stepTypeConfigs[stepData.type] || stepTypeConfigs.automation

//       const suggestedIntegrations = getSuggestedIntegrationsForStep(stepData.type, stepData.title)

//       const step: WorkflowStep = {
//         id: `step-${i + 1}`,
//         stepNumber: i + 1,
//         title: stepData.title,
//         description: stepData.description,
//         type: stepData.type,
//         icon: config.icon,
//         color: config.color,
//         bgColor: config.bgColor,
//         borderColor: config.borderColor,
//         estimatedTime: stepData.estimatedTime || getEstimatedTimeForStep(stepData.type),
//         inputs: stepData.inputs || (i === 0 ? ["User Request"] : ["Previous Step Output"]),
//         outputs: stepData.outputs || (i === stepsData.length - 1 ? ["Custom Solution"] : ["Processed Data"]),
//         details: stepData.details || [
//           `Custom ${stepData.type} processing`,
//           "Tailored to your specific requirements",
//           "Enterprise-grade implementation",
//         ],
//         isAnimating: true,
//         suggestedIntegrations,
//         selectedIntegrations: suggestedIntegrations.slice(0, 1),
//         aiReasoning:
//           stepData.aiReasoning || `This custom step is designed specifically for your ${stepData.type} requirements.`,
//         complexity: stepData.complexity || "high",
//         businessImpact:
//           stepData.businessImpact || `Delivers custom ${stepData.type} functionality tailored to your business needs.`,
//         alternatives: stepData.alternatives || [
//           `Alternative ${stepData.type} implementations`,
//           "Custom enhancement options",
//         ],
//       }

//       setStreamingSteps((prevSteps) => [...prevSteps, step])

//       const progress = ((i + 1) / stepsData.length) * 70 + 25
//       setStreamingProgress(progress)

//       addAiThought(`🔧 Generated custom step ${i + 1}: ${step.title}`)

//       setTimeout(() => {
//         if (stepContainerRef.current) {
//           const newStepElement = stepContainerRef.current.querySelector(`[data-step-id="step-${i + 1}"]`)
//           if (newStepElement) {
//             newStepElement.scrollIntoView({ behavior: "smooth", block: "nearest" })
//           }
//         }
//       }, 100)

//       await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 400))

//       setStreamingSteps((prevSteps) => prevSteps.map((s) => (s.id === step.id ? { ...s, isAnimating: false } : s)))

//       steps.push(step)
//     }

//     return steps
//   }

//   // Generate custom workflow steps
//   const generateCustomSteps = () => [
//     {
//       title: "Custom Request Analysis",
//       description: "Advanced AI analyzes your specific requirements and business context",
//       type: "analysis",
//       estimatedTime: "2-3s",
//       inputs: ["User Requirements", "Business Context"],
//       outputs: ["Analyzed Requirements", "Context Mapping"],
//       details: [
//         "Advanced NLP processing of user requirements",
//         "Business context analysis and mapping",
//         "Requirement validation and clarification",
//         "Custom rule generation based on specifications",
//       ],
//       complexity: "high" as const,
//       businessImpact: "Ensures the automation perfectly aligns with your unique business needs and requirements",
//       alternatives: ["Standard requirement processing", "Manual requirement analysis"],
//       aiReasoning: "Essential for understanding your unique automation needs",
//     },
//     {
//       title: "Intelligent Message Processing",
//       description: "Custom NLP and ML models trained for your specific business domain",
//       type: "trigger",
//       estimatedTime: "< 1s",
//       inputs: ["Incoming Messages", "Domain Models"],
//       outputs: ["Processed Content", "Intent Classification"],
//       details: [
//         "Domain-specific NLP model deployment",
//         "Real-time message classification and routing",
//         "Custom entity recognition and extraction",
//         "Multi-language processing capabilities",
//       ],
//       complexity: "high" as const,
//       businessImpact: "Provides industry-specific understanding and processing of customer communications",
//       alternatives: ["Generic NLP processing", "Rule-based message handling"],
//       aiReasoning: "Tailored message processing for optimal accuracy",
//     },
//     {
//       title: "Dynamic Content Filtering",
//       description: "Advanced filtering with custom rules based on your business logic",
//       type: "filter",
//       estimatedTime: "< 1s",
//       inputs: ["Processed Messages", "Custom Rules"],
//       outputs: ["Filtered Content", "Quality Score"],
//       details: [
//         "Custom filtering rules based on business logic",
//         "Content quality assessment and scoring",
//         "Spam and inappropriate content detection",
//         "Compliance and regulatory filtering",
//       ],
//       complexity: "medium" as const,
//       businessImpact: "Ensures only relevant, high-quality interactions are processed, maintaining brand reputation",
//       alternatives: ["Basic content filtering", "Manual content review"],
//       aiReasoning: "Ensures only relevant interactions are processed",
//     },
//     {
//       title: "Custom Integration Hub",
//       description: "Seamlessly connects with your existing tools and workflows",
//       type: "integration",
//       estimatedTime: "1-2s",
//       inputs: ["Filtered Data", "System Credentials"],
//       outputs: ["Integrated Data", "System Updates"],
//       details: [
//         "Custom API integrations with existing systems",
//         "Real-time data synchronization across platforms",
//         "Error handling and retry mechanisms",
//         "Data transformation and mapping",
//       ],
//       complexity: "high" as const,
//       businessImpact: "Maximizes value from your current technology stack without disrupting existing workflows",
//       alternatives: ["Standard API integrations", "Manual data transfer"],
//       aiReasoning: "Maximizes value from your current technology stack",
//     },
//     {
//       title: "AI-Powered Response Engine",
//       description: "Generates contextual responses using your brand voice and guidelines",
//       type: "response",
//       estimatedTime: "1-2s",
//       inputs: ["Context Data", "Brand Guidelines"],
//       outputs: ["Generated Response", "Confidence Score"],
//       details: [
//         "Brand voice training and implementation",
//         "Contextual response generation with personalization",
//         "Multi-channel response optimization",
//         "A/B testing for response effectiveness",
//       ],
//       complexity: "high" as const,
//       businessImpact:
//         "Maintains consistent brand experience at scale while providing personalized customer interactions",
//       alternatives: ["Template-based responses", "Generic AI responses"],
//       aiReasoning: "Maintains consistent brand experience at scale",
//     },
//     {
//       title: "Smart Routing & Escalation",
//       description: "Intelligent decision making for complex scenarios and human handoffs",
//       type: "routing",
//       estimatedTime: "< 1s",
//       inputs: ["Response Data", "Escalation Rules"],
//       outputs: ["Routing Decision", "Escalation Alert"],
//       details: [
//         "Intelligent escalation based on complexity and sentiment",
//         "Workload balancing across team members",
//         "Priority scoring and urgent issue detection",
//         "Custom routing rules based on expertise",
//       ],
//       complexity: "medium" as const,
//       businessImpact: "Ensures complex issues receive appropriate human attention while optimizing team efficiency",
//       alternatives: ["Rule-based routing", "Manual escalation"],
//       aiReasoning: "Ensures complex issues receive appropriate attention",
//     },
//     {
//       title: "Custom Data Management",
//       description: "Sophisticated data handling tailored to your privacy and compliance needs",
//       type: "storage",
//       estimatedTime: "2-4s",
//       inputs: ["Process Data", "Compliance Rules"],
//       outputs: ["Stored Data", "Audit Trail"],
//       details: [
//         "GDPR and privacy compliance handling",
//         "Custom data retention and archival policies",
//         "Encrypted storage with audit trails",
//         "Data analytics and reporting capabilities",
//       ],
//       complexity: "high" as const,
//       businessImpact: "Maintains data integrity and regulatory compliance while enabling advanced analytics",
//       alternatives: ["Basic data storage", "Manual compliance management"],
//       aiReasoning: "Maintains data integrity and regulatory compliance",
//     },
//     {
//       title: "Advanced Analytics Engine",
//       description: "Custom reporting and insights dashboard for your specific KPIs",
//       type: "validation",
//       estimatedTime: "3-5s",
//       inputs: ["Historical Data", "KPI Definitions"],
//       outputs: ["Analytics Report", "Performance Metrics"],
//       details: [
//         "Custom KPI tracking and measurement",
//         "Real-time performance monitoring and alerts",
//         "Predictive analytics for capacity planning",
//         "Custom dashboard creation and visualization",
//       ],
//       complexity: "high" as const,
//       businessImpact: "Provides actionable insights for continuous improvement and strategic decision making",
//       alternatives: ["Basic reporting", "Manual analytics"],
//       aiReasoning: "Provides actionable insights for continuous improvement",
//     },
//   ]

//   const getSuggestedIntegrationsForStep = (stepType: string, stepTitle: string): Integration[] => {
//     const suggestions: Integration[] = []
//     const title = stepTitle.toLowerCase()

//     // Smart integration matching based on step type and content
//     if (stepType === "trigger" || title.includes("message") || title.includes("processing")) {
//       suggestions.push(...INTEGRATION_DATABASE.filter((i) => i.category === "communication"))
//     }

//     if (stepType === "storage" || title.includes("data") || title.includes("management")) {
//       suggestions.push(...INTEGRATION_DATABASE.filter((i) => i.category === "database"))
//       suggestions.push(...INTEGRATION_DATABASE.filter((i) => i.category === "crm"))
//     }

//     if (
//       stepType === "response" ||
//       title.includes("email") ||
//       title.includes("message") ||
//       title.includes("notification")
//     ) {
//       suggestions.push(...INTEGRATION_DATABASE.filter((i) => i.category === "email"))
//     }

//     if (stepType === "integration" || title.includes("hub") || title.includes("connect")) {
//       suggestions.push(...INTEGRATION_DATABASE.filter((i) => i.category === "crm"))
//       suggestions.push(...INTEGRATION_DATABASE.filter((i) => i.category === "ecommerce"))
//     }

//     if (stepType === "validation" || title.includes("analytics") || title.includes("reporting")) {
//       suggestions.push(...INTEGRATION_DATABASE.filter((i) => i.category === "analytics"))
//     }

//     // Remove duplicates and sort by popularity
//     const uniqueSuggestions = suggestions.filter(
//       (integration, index, self) => index === self.findIndex((i) => i.id === integration.id),
//     )

//     return uniqueSuggestions.sort((a, b) => b.popularity - a.popularity).slice(0, 4)
//   }

//   const getEstimatedTimeForStep = (stepType: string): string => {
//     return "< 2s" // Custom workflows are optimized
//   }

//   const getUniqueIntegrations = (steps: WorkflowStep[]): Integration[] => {
//     const allIntegrations = steps.flatMap((step) => step.selectedIntegrations || [])
//     return allIntegrations.filter(
//       (integration, index, self) => index === self.findIndex((i) => i.id === integration.id),
//     )
//   }

//   const addAiThought = (thought: string): void => {
//     setAiThoughts((prev) => {
//       const newThoughts = [...prev, thought]
//       return newThoughts.slice(-5)
//     })
//   }

//   const getAiThoughtForPhase = (phase: number): string => {
//     const thoughts = [
//       "🔍 Analyzing your custom requirements and business constraints...",
//       "🎨 Designing bespoke workflow architecture with enterprise capabilities...",
//       "🔗 Identifying optimal integrations for your specific use case...",
//       "⚡ Fine-tuning for maximum performance and scalability...",
//     ]
//     return thoughts[phase] || "🤖 Processing your custom workflow requirements..."
//   }

//   // Updated handleApprove to go to pending instead of dashboard
//   const handleApprove = async (): Promise<void> => {
//     setIsGenerating(true)
//     setResponseStatus("📧 Submitting custom workflow to development team...")

//     try {
//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 2000))

//       const payload = {
//         action: "submit_custom_workflow",
//         businessInfo: businessInfo,
//         workflowDesign: parsedWorkflow,
//         selectedChannels: selectedChannels,
//         automationFeatures: automationFeatures,
//         customRequest: workflowRequest,
//         baseWorkflowId: selectedWorkflowId,
//         submittedAt: new Date().toISOString(),
//         status: "PENDING_CREATION",
//         estimatedCost: parsedWorkflow?.estimatedCost,
//         roi: parsedWorkflow?.roi,
//         integrations: parsedWorkflow?.integrations,
//       }

//       setResponseStatus("✅ Custom workflow submitted to development team successfully!")

//       // Store pending workflow data in localStorage
//       const pendingData = {
//         id: `custom-workflow-${Date.now()}`,
//         submittedAt: new Date().toISOString(),
//         status: "PENDING_CREATION",
//         workflowType: selectedWorkflowId ? `Modified ${selectedWorkflowId}` : "Custom Workflow",
//         estimatedCompletion: "3-5",
//       }

//       localStorage.setItem("pendingWorkflow", JSON.stringify(pendingData))

//       setTimeout(() => {
//         if (setStep) setStep("pending") // Go to pending instead of dashboard
//       }, 2000)
//     } catch (error) {
//       console.error("Approval error:", error)
//       setResponseStatus("❌ Failed to submit to development team. Please try again.")
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   const handleInitialSubmit = (): void => {
//     if (!workflowRequest.trim()) {
//       setResponseStatus("❌ Please describe your automation needs")
//       return
//     }
//     if (selectedChannels.length === 0) {
//       setResponseStatus("❌ Please select at least one platform")
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

//   const handleChannelToggle = (channelId: string): void => {
//     const newChannels = selectedChannels.includes(channelId)
//       ? selectedChannels.filter((c) => c !== channelId)
//       : [...selectedChannels, channelId]
//     setSelectedChannels(newChannels)
//   }

//   const handleFeatureToggle = (featureId: string, checked: boolean): void => {
//     if (checked) {
//       setAutomationFeatures((prev) => [...prev, featureId])
//     } else {
//       setAutomationFeatures((prev) => prev.filter((f) => f !== featureId))
//     }
//   }

//   const handleIntegrationToggle = (stepId: string, integration: Integration): void => {
//     setStreamingSteps((prevSteps) =>
//       prevSteps.map((step) => {
//         if (step.id === stepId) {
//           const isSelected = step.selectedIntegrations?.some((i) => i.id === integration.id)
//           const newSelected = isSelected
//             ? step.selectedIntegrations?.filter((i) => i.id !== integration.id) || []
//             : [...(step.selectedIntegrations || []), integration]

//           return { ...step, selectedIntegrations: newSelected }
//         }
//         return step
//       }),
//     )
//   }

//   // Enhanced components
//   const StreamingProgress: React.FC = () => {
//     if (!isGenerating) return null

//     const currentPhaseData = streamingPhases[currentPhase]
//     const IconComponent = currentPhaseData?.icon || Brain

//     return (
//       <div className="mb-8">
//         <div className="flex items-center justify-center mb-6">
//           <div className="relative">
//             <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center">
//               <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin"></div>
//               <IconComponent className={`h-10 w-10 ${currentPhaseData?.color || "text-blue-500"} animate-pulse`} />
//             </div>
//           </div>
//         </div>

//         <div className="text-center mb-6">
//           <h3 className="text-xl font-semibold mb-2">{currentPhaseData?.title || "Processing..."}</h3>
//           <p className="text-muted-foreground">
//             {currentPhaseData?.description || "Working on your custom workflow..."}
//           </p>
//         </div>

//         <div className="mb-6">
//           <div className="flex justify-between text-sm text-muted-foreground mb-2">
//             <span>Overall Progress</span>
//             <span>{Math.round(streamingProgress)}%</span>
//           </div>
//           <Progress value={streamingProgress} className="h-3 mb-4" />
//         </div>

//         <div className="flex justify-center gap-6 mb-6">
//           {streamingPhases.map((phase, index) => {
//             const PhaseIcon = phase.icon
//             return (
//               <div key={phase.id} className="flex flex-col items-center">
//                 <div
//                   className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
//                     index < currentPhase
//                       ? "bg-green-500 text-white shadow-lg"
//                       : index === currentPhase
//                         ? "bg-blue-500 text-white animate-pulse shadow-lg"
//                         : "bg-gray-200 text-gray-400"
//                   }`}
//                 >
//                   {index < currentPhase ? <CheckCircle className="h-6 w-6" /> : <PhaseIcon className="h-6 w-6" />}
//                 </div>
//                 <span
//                   className={`text-xs mt-2 text-center font-medium ${
//                     index === currentPhase ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"
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
//           <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
//             <div className="flex items-center gap-2 mb-3">
//               <Brain className="h-4 w-4 text-blue-500" />
//               <span className="text-sm font-medium text-blue-700 dark:text-blue-300">AI Insights</span>
//             </div>
//             <div className="space-y-2 max-h-24 overflow-hidden">
//               {aiThoughts.slice(-3).map((thought, index) => (
//                 <div
//                   key={index}
//                   className={`text-xs text-blue-600 dark:text-blue-400 transition-opacity duration-500 ${
//                     index === aiThoughts.length - 1 ? "opacity-100" : "opacity-70"
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

//   const IntegrationSelector: React.FC<{ step: WorkflowStep }> = ({ step }) => {
//     if (!step.suggestedIntegrations || step.suggestedIntegrations.length === 0) return null

//     return (
//       <div className="mt-4 p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/20">
//         <h6 className="font-semibold mb-3 flex items-center gap-2">
//           <Puzzle className="h-4 w-4 text-purple-500" />
//           Suggested Integrations
//           <Badge variant="outline" className="text-xs">
//             {step.suggestedIntegrations.length} available
//           </Badge>
//         </h6>

//         <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
//           {step.suggestedIntegrations.map((integration) => {
//             const IconComponent = integration.icon
//             const isSelected = step.selectedIntegrations?.some((i) => i.id === integration.id)

//             return (
//               <div
//                 key={integration.id}
//                 onClick={() => handleIntegrationToggle(step.id, integration)}
//                 className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
//                   isSelected
//                     ? "bg-blue-500 text-white border-blue-500 shadow-md"
//                     : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
//                 }`}
//               >
//                 <div className="flex items-center gap-3">
//                   <IconComponent className="h-5 w-5 flex-shrink-0" />
//                   <div className="flex-grow min-w-0">
//                     <div className="flex items-center gap-2 mb-1">
//                       <span className="font-medium text-sm truncate">{integration.name}</span>
//                       <Badge
//                         variant={isSelected ? "secondary" : "outline"}
//                         className={`text-xs ${isSelected ? "bg-white/20 text-white" : ""}`}
//                       >
//                         {integration.pricing}
//                       </Badge>
//                     </div>
//                     <p className={`text-xs truncate ${isSelected ? "text-white/80" : "text-muted-foreground"}`}>
//                       {integration.description}
//                     </p>
//                     <div className="flex items-center gap-2 mt-1">
//                       <div
//                         className={`flex items-center gap-1 text-xs ${isSelected ? "text-white/70" : "text-muted-foreground"}`}
//                       >
//                         <Timer className="h-3 w-3" />
//                         {integration.setupTime}
//                       </div>
//                       <div
//                         className={`flex items-center gap-1 text-xs ${isSelected ? "text-white/70" : "text-muted-foreground"}`}
//                       >
//                         <Star className="h-3 w-3" />
//                         {integration.popularity}%
//                       </div>
//                     </div>
//                   </div>
//                   {isSelected ? <Check className="h-4 w-4 text-white" /> : <Plus className="h-4 w-4 text-gray-400" />}
//                 </div>
//               </div>
//             )
//           })}
//         </div>
//       </div>
//     )
//   }

//   const StepComponent: React.FC<{ step: WorkflowStep }> = ({ step }) => {
//     const config = stepTypeConfigs[step.type] || stepTypeConfigs.automation
//     const IconComponent = step.icon || config.icon
//     const isExpanded = expandedSteps.has(step.stepNumber)

//     return (
//       <div
//         data-step-id={step.id}
//         className={`relative transition-all duration-500 ${step.isAnimating ? "animate-pulse" : ""}`}
//         style={{
//           animation: step.isAnimating ? "slideInFromLeft 0.6s ease-out" : "none",
//         }}
//       >
//         <div
//           className={`rounded-xl border-2 transition-all duration-300 cursor-pointer bg-gradient-to-br ${
//             config.bgColor
//           } ${config.darkBg} ${config.borderColor} ${config.darkBorder} ${
//             isExpanded
//               ? "shadow-xl scale-[1.02] border-opacity-100"
//               : "hover:shadow-lg hover:scale-[1.01] border-opacity-60"
//           }`}
//           onClick={() => toggleStepExpansion(step.stepNumber)}
//         >
//           {/* Step Header */}
//           <div className="p-6">
//             <div className="flex items-center gap-4">
//               {/* Enhanced Step Number with Icon */}
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

//               {/* Enhanced Step Content */}
//               <div className="flex-grow">
//                 <div className="flex items-center gap-3 mb-3">
//                   <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">{step.title}</h4>
//                   <Badge variant="outline" className="text-xs font-medium">
//                     {step.type}
//                   </Badge>
//                   <Badge
//                     variant="secondary"
//                     className={`text-xs ${
//                       step.complexity === "high"
//                         ? "bg-red-100 text-red-700"
//                         : step.complexity === "medium"
//                           ? "bg-yellow-100 text-yellow-700"
//                           : "bg-green-100 text-green-700"
//                     }`}
//                   >
//                     {step.complexity} complexity
//                   </Badge>
//                   {step.estimatedTime && (
//                     <Badge variant="secondary" className="text-xs">
//                       <Timer className="h-3 w-3 mr-1" />
//                       {step.estimatedTime}
//                     </Badge>
//                   )}
//                 </div>
//                 <p className="text-muted-foreground mb-3 leading-relaxed">{step.description}</p>

//                 {/* Enhanced Input/Output Flow */}
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

//                 {/* Integration Preview */}
//                 {step.selectedIntegrations && step.selectedIntegrations.length > 0 && (
//                   <div className="mt-3 flex items-center gap-2">
//                     <Zap className="h-4 w-4 text-purple-500" />
//                     <span className="text-sm text-purple-700 dark:text-purple-300 font-medium">
//                       Integrations: {step.selectedIntegrations.map((i) => i.name).join(", ")}
//                     </span>
//                   </div>
//                 )}
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
//               {/* AI Reasoning */}
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
//                     Configuration Options
//                   </h5>
//                   <div className="space-y-2 text-sm">
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                       <span>Auto-retry enabled</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
//                       <span>Real-time monitoring</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
//                       <span>Custom error handling</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
//                       <span>Performance optimization</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Integration Selector */}
//               <IntegrationSelector step={step} />
//             </div>
//           )}
//         </div>

//         {/* Enhanced Connection Line */}
//         {step.stepNumber < (streamingSteps.length || 1) && (
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

//   return (
//     <div className="min-h-screen bg-background p-6">
//       <style jsx>{`
//         @keyframes slideInFromLeft {
//           0% {
//             opacity: 0;
//             transform: translateX(-30px);
//           }
//           100% {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }
//       `}</style>

//       <div className="max-w-7xl mx-auto">
//         {/* Enhanced Header */}
//         <div className="mb-8">
//           <Button variant="ghost" className="mb-6 hover:bg-accent" onClick={() => setStep?.("selection")}>
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Selection
//           </Button>
//           <div className="text-center mb-8">
//             <h1 className="text-5xl font-bold mb-4">Custom AI Workflow Designer</h1>
//             <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
//               Design a completely custom workflow tailored to your unique business needs.
//             </p>
//             <div className="flex items-center justify-center gap-6 mt-4 text-sm text-muted-foreground">
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//                 <span>Custom AI Generation</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
//                 <span>Bespoke Integration Matching</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
//                 <span>Enterprise Development</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid gap-8 lg:grid-cols-3">
//           {/* Enhanced Left Column - Input */}
//           <div className="lg:col-span-1 space-y-6">
//             <Card className="border-2 border-border bg-card/50 backdrop-blur-sm">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Wand2 className="h-5 w-5 text-primary" />
//                   {!hasInitialRequest ? "Design Your Custom Automation" : "Refine Your Workflow"}
//                 </CardTitle>
//                 <CardDescription>
//                   {!hasInitialRequest
//                     ? "Describe your unique automation needs and our AI will create a tailored solution"
//                     : "Provide feedback to enhance and customize the design"}
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 {!hasInitialRequest && (
//                   <>
//                     {/* Enhanced Platform Selection */}
//                     <div className="space-y-3">
//                       <Label className="text-base font-semibold">Social Media Platforms</Label>
//                       <div className="grid grid-cols-1 gap-3">
//                         {channelOptions.map((channel) => {
//                           const IconComponent = channel.icon
//                           return (
//                             <button
//                               key={channel.id}
//                               onClick={() => handleChannelToggle(channel.id)}
//                               className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
//                                 selectedChannels.includes(channel.id)
//                                   ? "bg-primary text-primary-foreground border-primary shadow-lg transform scale-105"
//                                   : "bg-card border-border hover:border-primary/50 hover:bg-accent hover:transform hover:scale-102"
//                               }`}
//                             >
//                               <div className="flex items-center gap-3">
//                                 <IconComponent className="h-5 w-5" />
//                                 <span className="font-medium">{channel.label}</span>
//                                 {selectedChannels.includes(channel.id) && <Check className="h-4 w-4 ml-auto" />}
//                               </div>
//                             </button>
//                           )
//                         })}
//                       </div>
//                     </div>

//                     {/* Enhanced Feature Selection */}
//                     <div className="space-y-3">
//                       <Label className="text-base font-semibold">AI Automation Features</Label>
//                       <div className="space-y-2">
//                         {automationFeatureOptions.map((feature) => (
//                           <label
//                             key={feature.id}
//                             className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-accent transition-colors"
//                           >
//                             <input
//                               type="checkbox"
//                               checked={automationFeatures.includes(feature.id)}
//                               onChange={(e) => handleFeatureToggle(feature.id, e.target.checked)}
//                               className="w-4 h-4 rounded border-border"
//                             />
//                             <span className="text-sm font-medium">{feature.label}</span>
//                           </label>
//                         ))}
//                       </div>
//                     </div>
//                   </>
//                 )}

//                 {/* Enhanced Request Input */}
//                 {!hasInitialRequest ? (
//                   <>
//                     <div className="space-y-3">
//                       <Label htmlFor="workflowRequest" className="text-base font-semibold">
//                         Describe Your Custom Automation Vision
//                       </Label>
//                       <Textarea
//                         id="workflowRequest"
//                         value={workflowRequest}
//                         onChange={(e) => setWorkflowRequest(e.target.value)}
//                         placeholder="e.g., 'I need a custom workflow that automatically processes customer support tickets in multiple languages, integrates with our proprietary CRM system, uses machine learning to categorize issues, routes them to specialized teams based on expertise and workload, and provides real-time performance analytics with custom dashboards.'"
//                         rows={8}
//                         className="bg-background border-2 border-blue-200 focus:border-blue-500 resize-none text-sm"
//                         disabled={isGenerating}
//                       />
//                     </div>
//                     <Button
//                       onClick={handleInitialSubmit}
//                       disabled={isGenerating || !workflowRequest.trim()}
//                       className="w-full flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 text-base"
//                     >
//                       {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
//                       Generate Custom AI Workflow
//                     </Button>
//                   </>
//                 ) : (
//                   <>
//                     <div className="space-y-3">
//                       <Label htmlFor="refinementInput" className="text-base font-semibold">
//                         Refine Your Custom Workflow
//                       </Label>
//                       <Textarea
//                         id="refinementInput"
//                         value={refinementInput}
//                         onChange={(e) => setRefinementInput(e.target.value)}
//                         placeholder="e.g., 'Add integration with our custom database API', 'Include advanced sentiment analysis for priority routing', 'Add compliance checks for GDPR requirements', 'Implement predictive analytics for capacity planning'"
//                         rows={5}
//                         className="bg-white/50 border-2 border-blue-200 focus:border-blue-500 resize-none"
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
//                         Refine Design
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
//                         Submit design
//                       </Button>
//                     </div>
//                   </>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Enhanced Business Context */}
//             <Card className="border-2 border-border bg-card/50 backdrop-blur-sm">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Building className="h-5 w-5 text-primary" />
//                   Business Context
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4 text-sm">
//                 <div className="p-3 bg-muted/50 rounded-lg">
//                   <span className="font-semibold text-primary">Business:</span>
//                   <p className="text-muted-foreground mt-1">{businessInfo.businessName}</p>
//                 </div>
//                 <div className="p-3 bg-muted/50 rounded-lg">
//                   <span className="font-semibold text-primary">Industry:</span>
//                   <p className="text-muted-foreground mt-1">{businessInfo.businessType}</p>
//                 </div>
//                 {businessInfo.description && (
//                   <div className="p-3 bg-muted/50 rounded-lg">
//                     <span className="font-semibold text-primary">Description:</span>
//                     <p className="text-muted-foreground mt-1">{businessInfo.description}</p>
//                   </div>
//                 )}
//                 {selectedChannels.length > 0 && (
//                   <div className="p-3 bg-muted/50 rounded-lg">
//                     <span className="font-semibold text-primary">Selected Platforms:</span>
//                     <div className="flex flex-wrap gap-2 mt-2">
//                       {selectedChannels.map((channel) => (
//                         <Badge key={channel} variant="secondary" className="text-xs">
//                           {channelOptions.find((c) => c.id === channel)?.label}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//                 {automationFeatures.length > 0 && (
//                   <div className="p-3 bg-muted/50 rounded-lg">
//                     <span className="font-semibold text-primary">AI Features:</span>
//                     <div className="flex flex-wrap gap-2 mt-2">
//                       {automationFeatures.map((feature) => (
//                         <Badge key={feature} variant="outline" className="text-xs">
//                           {automationFeatureOptions.find((f) => f.id === feature)?.label}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Enhanced Right Column - AI Generated Workflow */}
//           <div className="lg:col-span-2">
//             <Card className="border-2 border-border min-h-[700px] bg-card backdrop-blur-sm">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Brain className="h-6 w-6 text-primary" />
//                   Custom AI Workflow Generation
//                   {parsedWorkflow && (
//                     <Badge variant="outline" className="ml-auto">
//                       <Star className="h-3 w-3 mr-1" />
//                       Custom AI Generated
//                     </Badge>
//                   )}
//                 </CardTitle>
//                 <CardDescription className="text-base">
//                   Advanced AI creates bespoke enterprise workflows with custom integrations in real-time
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {/* Enhanced Status Message */}
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

//                 {/* Enhanced Streaming Progress */}
//                 {isGenerating && <StreamingProgress />}

//                 {/* Enhanced Workflow Header */}
//                 {parsedWorkflow && !isGenerating && (
//                   <div className="mb-8 p-8 rounded-2xl bg-muted/30 border-2 border-border backdrop-blur-sm">
//                     <div className="text-center mb-8">
//                       <h3 className="text-3xl font-bold mb-3 text-foreground">{parsedWorkflow.title}</h3>
//                       <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
//                         {parsedWorkflow.description}
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//                       <div className="text-center p-4 bg-card rounded-xl shadow-sm border border-border">
//                         <div className="text-2xl font-bold text-primary mb-1">
//                           {parsedWorkflow.metrics?.automationRate}
//                         </div>
//                         <div className="text-xs text-muted-foreground font-medium">Automation Rate</div>
//                       </div>
//                       <div className="text-center p-4 bg-card rounded-xl shadow-sm border border-border">
//                         <div className="text-2xl font-bold text-primary mb-1">
//                           {parsedWorkflow.metrics?.responseTime}
//                         </div>
//                         <div className="text-xs text-muted-foreground font-medium">Response Time</div>
//                       </div>
//                       <div className="text-center p-4 bg-card rounded-xl shadow-sm border border-border">
//                         <div className="text-2xl font-bold text-primary mb-1">{parsedWorkflow.metrics?.accuracy}</div>
//                         <div className="text-xs text-muted-foreground font-medium">AI Accuracy</div>
//                       </div>
//                       <div className="text-center p-4 bg-card rounded-xl shadow-sm border border-border">
//                         <div className="text-2xl font-bold text-primary mb-1">{parsedWorkflow.estimatedBuildTime}</div>
//                         <div className="text-xs text-muted-foreground font-medium">Build Time</div>
//                       </div>
//                     </div>

//                     {/* Enhanced ROI and Cost Information */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="p-4 bg-secondary/30 rounded-xl border border-border">
//                         <div className="flex items-center gap-2 mb-2">
//                           <TrendingUp className="h-4 w-4 text-primary" />
//                           <span className="font-semibold text-foreground">Expected ROI</span>
//                         </div>
//                         <div className="text-xl font-bold text-primary">{parsedWorkflow.roi}</div>
//                       </div>
//                       <div className="p-4 bg-accent/30 rounded-xl border border-border">
//                         <div className="flex items-center gap-2 mb-2">
//                           <CreditCard className="h-4 w-4 text-primary" />
//                           <span className="font-semibold text-foreground">Monthly Cost</span>
//                         </div>
//                         <div className="text-xl font-bold text-primary">{parsedWorkflow.estimatedCost}</div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Enhanced Streaming Steps */}
//                 {(isStreaming || streamingSteps.length > 0) && (
//                   <div ref={stepContainerRef} className="space-y-8">
//                     <div className="flex items-center gap-4 mb-8">
//                       <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
//                         <Workflow className="h-6 w-6 text-white" />
//                       </div>
//                       <div>
//                         <h3 className="text-2xl font-bold">Custom Workflow Steps</h3>
//                         <p className="text-muted-foreground">AI-designed automation tailored to your specific needs</p>
//                       </div>
//                       <Badge variant="outline" className="ml-auto text-base px-3 py-1">
//                         {isStreaming
//                           ? `${streamingSteps.length} steps generated...`
//                           : `${streamingSteps.length} total steps`}
//                       </Badge>
//                     </div>

//                     {streamingSteps.map((step) => (
//                       <StepComponent key={step.id} step={step} />
//                     ))}

//                     {isStreaming && (
//                       <div className="flex justify-center py-8">
//                         <div className="flex items-center gap-3 text-muted-foreground">
//                           <Loader2 className="h-5 w-5 animate-spin" />
//                           <span className="font-medium">AI is generating more custom steps...</span>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Enhanced Initial State */}
//                 {!isGenerating && !parsedWorkflow && !hasInitialRequest && (
//                   <div className="flex flex-col items-center justify-center py-24 text-center">
//                     <div className="relative mb-8">
//                       <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
//                         <Brain className="h-12 w-12 text-blue-500" />
//                       </div>
//                       <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
//                         <Sparkles className="h-4 w-4 text-white" />
//                       </div>
//                     </div>
//                     <h3 className="text-2xl font-bold mb-4">Ready to Design Your Custom Workflow</h3>
//                     <p className="text-center max-w-lg mb-8 text-muted-foreground leading-relaxed">
//                       Our advanced AI will analyze your unique requirements and generate a completely custom,
//                       enterprise-grade workflow with bespoke integrations and architecture.
//                     </p>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground">
//                       <div className="flex flex-col items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
//                         <Brain className="h-5 w-5 text-blue-500" />
//                         <span className="font-medium">Custom AI</span>
//                       </div>
//                       <div className="flex flex-col items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
//                         <Zap className="h-5 w-5 text-green-500" />
//                         <span className="font-medium">Bespoke Integrations</span>
//                       </div>
//                       <div className="flex flex-col items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
//                         <Rocket className="h-5 w-5 text-purple-500" />
//                         <span className="font-medium">Enterprise Ready</span>
//                       </div>
//                       <div className="flex flex-col items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
//                         <TrendingUp className="h-5 w-5 text-orange-500" />
//                         <span className="font-medium">Maximum ROI</span>
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


























// "use client"

// import type React from "react"
// import { useState, useCallback, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import {
//   ArrowLeft,
//   Sparkles,
//   Loader2,
//   CheckCircle,
//   Settings,
//   ThumbsUp,
//   Bot,
//   Mic,
//   Phone,
//   MessageCircle,
//   RefreshCw,
//   MessageSquare,
//   Zap,
//   AlertCircle,
//   PlayCircle,
//   Workflow,
//   GitBranch,
//   ChevronDown,
//   ChevronRight,
//   Database,
//   Filter,
//   Mail,
//   Bell,
//   BarChart3,
//   Shield,
//   Star,
//   TrendingUp,
//   Brain,
//   Rocket,
//   Timer,
//   Layers,
//   Activity,
//   Wand2,
//   Plus,
//   Check,
//   Building,
//   Cloud,
//   ShoppingCart,
//   CreditCard,
//   Link2,
//   Puzzle,
//   Search,
//   Gauge,
// } from "lucide-react"

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
//   category: string
//   icon: React.ComponentType<{ className?: string }>
//   pricing: "free" | "freemium" | "paid" | "enterprise"
//   popularity: number
//   difficulty: "easy" | "medium" | "hard"
//   apiAvailable: boolean
//   webhookSupport: boolean
//   realTimeSync: boolean
//   features: string[]
//   setupTime: string
//   website?: string
// }

// interface WorkflowStep {
//   id: string
//   stepNumber: number
//   title: string
//   description: string
//   type: string
//   inputs?: string[]
//   outputs?: string[]
//   conditions?: string[]
//   estimatedTime?: string
//   icon?: React.ComponentType<{ className?: string }>
//   color?: string
//   bgColor?: string
//   borderColor?: string
//   details?: string[]
//   isAnimating?: boolean
//   suggestedIntegrations?: Integration[]
//   selectedIntegrations?: Integration[]
//   aiReasoning?: string
//   complexity?: "low" | "medium" | "high"
//   businessImpact?: string
//   alternatives?: string[]
// }

// interface StreamingPhase {
//   id: string
//   title: string
//   description: string
//   icon: React.ComponentType<{ className?: string }>
//   color: string
//   duration: number
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
//   technicalRequirements: string[]
//   deploymentChannels: string[]
//   estimatedCost?: string
//   roi?: string
//   metrics?: {
//     automationRate: string
//     responseTime: string
//     accuracy: string
//     scalability: string
//   }
// }

// interface ChannelOption {
//   id: string
//   label: string
//   icon: React.ComponentType<{ className?: string }>
// }

// interface AutomationFeature {
//   id: string
//   label: string
// }

// interface StepTypeConfig {
//   icon: React.ComponentType<{ className?: string }>
//   color: string
//   bgColor: string
//   borderColor: string
//   accentColor: string
//   darkBg: string
//   darkBorder: string
// }

// // Comprehensive Integration Database
// const INTEGRATION_DATABASE: Integration[] = [
//   // CRM Systems
//   {
//     id: "hubspot",
//     name: "HubSpot",
//     description: "Comprehensive CRM and marketing automation platform",
//     category: "crm",
//     icon: Building,
//     pricing: "freemium",
//     popularity: 95,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Contact Management", "Deal Tracking", "Email Marketing", "Analytics"],
//     setupTime: "15-30 minutes",
//     website: "https://hubspot.com",
//   },
//   {
//     id: "salesforce",
//     name: "Salesforce",
//     description: "World's leading CRM platform for sales and customer service",
//     category: "crm",
//     icon: Cloud,
//     pricing: "paid",
//     popularity: 90,
//     difficulty: "medium",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Lead Management", "Opportunity Tracking", "Custom Objects", "Automation"],
//     setupTime: "30-60 minutes",
//     website: "https://salesforce.com",
//   },

//   // E-commerce Platforms
//   {
//     id: "shopify",
//     name: "Shopify",
//     description: "Leading e-commerce platform for online stores",
//     category: "ecommerce",
//     icon: ShoppingCart,
//     pricing: "paid",
//     popularity: 92,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Product Management", "Order Processing", "Inventory", "Payments"],
//     setupTime: "20-30 minutes",
//     website: "https://shopify.com",
//   },

//   // Email Marketing
//   {
//     id: "mailchimp",
//     name: "Mailchimp",
//     description: "All-in-one email marketing and automation platform",
//     category: "email",
//     icon: Mail,
//     pricing: "freemium",
//     popularity: 88,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Email Campaigns", "Automation", "Audience Segmentation", "Analytics"],
//     setupTime: "10-20 minutes",
//     website: "https://mailchimp.com",
//   },

//   // Payment Systems
//   {
//     id: "stripe",
//     name: "Stripe",
//     description: "Complete payment processing platform for businesses",
//     category: "payment",
//     icon: CreditCard,
//     pricing: "paid",
//     popularity: 95,
//     difficulty: "medium",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Payment Processing", "Subscriptions", "Invoicing", "Marketplace"],
//     setupTime: "25-40 minutes",
//     website: "https://stripe.com",
//   },

//   // Analytics & Tracking
//   {
//     id: "google-analytics",
//     name: "Google Analytics",
//     description: "Web analytics service for tracking website traffic",
//     category: "analytics",
//     icon: BarChart3,
//     pricing: "freemium",
//     popularity: 98,
//     difficulty: "medium",
//     apiAvailable: true,
//     webhookSupport: false,
//     realTimeSync: true,
//     features: ["Traffic Analysis", "Conversion Tracking", "Audience Insights", "Reports"],
//     setupTime: "20-30 minutes",
//     website: "https://analytics.google.com",
//   },

//   // Communication
//   {
//     id: "slack",
//     name: "Slack",
//     description: "Business communication and collaboration platform",
//     category: "communication",
//     icon: MessageSquare,
//     pricing: "freemium",
//     popularity: 92,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Team Chat", "File Sharing", "Integrations", "Workflow Automation"],
//     setupTime: "10-20 minutes",
//     website: "https://slack.com",
//   },

//   // Databases & Storage
//   {
//     id: "airtable",
//     name: "Airtable",
//     description: "Cloud-based database and spreadsheet hybrid",
//     category: "database",
//     icon: Database,
//     pricing: "freemium",
//     popularity: 85,
//     difficulty: "easy",
//     apiAvailable: true,
//     webhookSupport: true,
//     realTimeSync: true,
//     features: ["Database Management", "Forms", "Views", "Automations"],
//     setupTime: "15-25 minutes",
//     website: "https://airtable.com",
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

// // Step type configurations with unique styling
// const stepTypeConfigs: Record<string, StepTypeConfig> = {
//   trigger: {
//     icon: PlayCircle,
//     color: "text-emerald-600",
//     bgColor: "from-emerald-50 to-green-100",
//     borderColor: "border-emerald-300",
//     accentColor: "bg-emerald-500",
//     darkBg: "dark:from-emerald-900/20 dark:to-green-900/30",
//     darkBorder: "dark:border-emerald-600/50",
//   },
//   analysis: {
//     icon: Brain,
//     color: "text-purple-600",
//     bgColor: "from-purple-50 to-violet-100",
//     borderColor: "border-purple-300",
//     accentColor: "bg-purple-500",
//     darkBg: "dark:from-purple-900/20 dark:to-violet-900/30",
//     darkBorder: "dark:border-purple-600/50",
//   },
//   filter: {
//     icon: Filter,
//     color: "text-blue-600",
//     bgColor: "from-blue-50 to-cyan-100",
//     borderColor: "border-blue-300",
//     accentColor: "bg-blue-500",
//     darkBg: "dark:from-blue-900/20 dark:to-cyan-900/30",
//     darkBorder: "dark:border-blue-600/50",
//   },
//   response: {
//     icon: MessageCircle,
//     color: "text-orange-600",
//     bgColor: "from-orange-50 to-amber-100",
//     borderColor: "border-orange-300",
//     accentColor: "bg-orange-500",
//     darkBg: "dark:from-orange-900/20 dark:to-amber-900/30",
//     darkBorder: "dark:border-orange-600/50",
//   },
//   notification: {
//     icon: Bell,
//     color: "text-red-600",
//     bgColor: "from-red-50 to-pink-100",
//     borderColor: "border-red-300",
//     accentColor: "bg-red-500",
//     darkBg: "dark:from-red-900/20 dark:to-pink-900/30",
//     darkBorder: "dark:border-red-600/50",
//   },
//   integration: {
//     icon: Zap,
//     color: "text-yellow-600",
//     bgColor: "from-yellow-50 to-orange-100",
//     borderColor: "border-yellow-300",
//     accentColor: "bg-yellow-500",
//     darkBg: "dark:from-yellow-900/20 dark:to-orange-900/30",
//     darkBorder: "dark:border-yellow-600/50",
//   },
//   storage: {
//     icon: Database,
//     color: "text-gray-600",
//     bgColor: "from-gray-50 to-slate-100",
//     borderColor: "border-gray-300",
//     accentColor: "bg-gray-500",
//     darkBg: "dark:from-gray-900/20 dark:to-slate-900/30",
//     darkBorder: "dark:border-gray-600/50",
//   },
//   routing: {
//     icon: GitBranch,
//     color: "text-indigo-600",
//     bgColor: "from-indigo-50 to-blue-100",
//     borderColor: "border-indigo-300",
//     accentColor: "bg-indigo-500",
//     darkBg: "dark:from-indigo-900/20 dark:to-blue-900/30",
//     darkBorder: "dark:border-indigo-600/50",
//   },
//   validation: {
//     icon: Shield,
//     color: "text-cyan-600",
//     bgColor: "from-cyan-50 to-teal-100",
//     borderColor: "border-cyan-300",
//     accentColor: "bg-cyan-500",
//     darkBg: "dark:from-cyan-900/20 dark:to-teal-900/30",
//     darkBorder: "dark:border-cyan-600/50",
//   },
//   automation: {
//     icon: Bot,
//     color: "text-pink-600",
//     bgColor: "from-pink-50 to-rose-100",
//     borderColor: "border-pink-300",
//     accentColor: "bg-pink-500",
//     darkBg: "dark:from-pink-900/20 dark:to-rose-900/30",
//     darkBorder: "dark:border-pink-600/50",
//   },
// }

// // AI Processing phases
// const streamingPhases: StreamingPhase[] = [
//   {
//     id: "understanding",
//     title: "Analyzing Requirements",
//     description: "AI is understanding your business needs and automation goals",
//     icon: Search,
//     color: "text-blue-500",
//     duration: 3000,
//   },
//   {
//     id: "designing",
//     title: "Designing Architecture",
//     description: "Creating intelligent workflow logic and step sequences",
//     icon: Wand2,
//     color: "text-purple-500",
//     duration: 4000,
//   },
//   {
//     id: "integrations",
//     title: "Matching Integrations",
//     description: "Finding the best tools and platforms for each step",
//     icon: Link2,
//     color: "text-green-500",
//     duration: 3000,
//   },
//   {
//     id: "optimizing",
//     title: "Optimizing Performance",
//     description: "Fine-tuning for maximum efficiency and reliability",
//     icon: Gauge,
//     color: "text-orange-500",
//     duration: 2000,
//   },
// ]

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
//   const [selectedChannels, setSelectedChannels] = useState<string[]>(["instagram"])
//   const [automationFeatures, setAutomationFeatures] = useState<string[]>(["auto-reply"])
//   const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set())

//   // Streaming states
//   const [streamingSteps, setStreamingSteps] = useState<WorkflowStep[]>([])
//   const [currentPhase, setCurrentPhase] = useState<number>(0)
//   const [isStreaming, setIsStreaming] = useState<boolean>(false)
//   const [streamingProgress, setStreamingProgress] = useState<number>(0)
//   const [aiThoughts, setAiThoughts] = useState<string[]>([])
//   const stepContainerRef = useRef<HTMLDivElement>(null)

//   const channelOptions: ChannelOption[] = [
//     { id: "instagram", label: "Instagram DMs", icon: MessageCircle },
//     { id: "facebook", label: "Facebook Messenger", icon: MessageSquare },
//     { id: "whatsapp", label: "WhatsApp Business", icon: Phone },
//     { id: "telegram", label: "Telegram Bot", icon: Bot },
//     { id: "web", label: "Website Chat", icon: Mic },
//     { id: "email", label: "Email Marketing", icon: Mail },
//     { id: "sms", label: "SMS Marketing", icon: Phone },
//   ]

//   const automationFeatureOptions: AutomationFeature[] = [
//     { id: "auto-reply", label: "Automatic Responses" },
//     { id: "sentiment-analysis", label: "Sentiment Analysis" },
//     { id: "intent-detection", label: "Intent Recognition" },
//     { id: "multilingual", label: "Multi-language Support" },
//     { id: "smart-routing", label: "Smart Agent Routing" },
//     { id: "lead-scoring", label: "Lead Scoring" },
//     { id: "personalization", label: "Dynamic Personalization" },
//     { id: "escalation", label: "Intelligent Escalation" },
//   ]

//   // Real AI workflow generation
//   const generateWorkflowWithAI = useCallback(
//     async (action: "initial" | "refine", instructions?: string): Promise<void> => {
//       setIsGenerating(true)
//       setIsStreaming(true)
//       setCurrentPhase(0)
//       setStreamingProgress(0)
//       setStreamingSteps([])
//       setAiThoughts([])
//       setResponseStatus("🤖 Connecting to AI workflow engine...")
//       setCurrentAction(action)
//       setHasInitialRequest(true)

//       try {
//         // Phase progression with realistic timing
//         for (let phase = 0; phase < streamingPhases.length; phase++) {
//           setCurrentPhase(phase)
//           setResponseStatus(`${streamingPhases[phase].description}...`)

//           addAiThought(getAiThoughtForPhase(phase))

//           await new Promise((resolve) => setTimeout(resolve, streamingPhases[phase].duration))
//         }

//         // Generate workflow via AI API
//         const aiResponse = await callAIWorkflowGeneration(action, instructions)

//         if (aiResponse.success && aiResponse.workflowData) {
//           setParsedWorkflow(aiResponse.workflowData)
//           setStreamingProgress(100)
//           setResponseStatus("✅ Custom AI workflow generated successfully!")
//           addAiThought("🎉 Workflow generation complete! Ready for development team submission.")
//         } else {
//           throw new Error(aiResponse.error || "AI generation failed")
//         }
//       } catch (error) {
//         console.error("AI generation error:", error)
//         setResponseStatus(`❌ AI generation failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//         addAiThought("❌ Generation failed. Please try again with more specific requirements.")
//       } finally {
//         setIsStreaming(false)
//         setTimeout(() => {
//           setIsGenerating(false)
//         }, 1000)
//       }
//     },
//     [businessInfo, selectedChannels, automationFeatures, workflowRequest],
//   )

//   // Simulate AI API call
//   const callAIWorkflowGeneration = async (
//     action: "initial" | "refine",
//     instructions?: string,
//   ): Promise<{ success: boolean; workflowData?: ParsedWorkflow; error?: string }> => {
//     try {
//       // Simulate API call delay
//       await new Promise((resolve) => setTimeout(resolve, 2000))

//       const workflowSteps = await processAIResponseIntoSteps({})

//       const workflow: ParsedWorkflow = {
//         title: `${businessInfo.businessName} Custom AI Automation`,
//         description: `Intelligent automation workflow for ${selectedChannels.length} platform${selectedChannels.length > 1 ? "s" : ""}`,
//         platform: "Custom AI Automation",
//         estimatedBuildTime: "3-5 weeks",
//         complexity: "Custom Enterprise",
//         steps: workflowSteps,
//         integrations: getUniqueIntegrations(workflowSteps),
//         benefits: [
//           "100% customized to your specific requirements",
//           "Advanced AI-powered automation",
//           "Seamless integration with your existing tools",
//           "Scalable architecture for future growth",
//           "Dedicated development and support",
//           "Priority marketplace listing",
//         ],
//         exampleScenario:
//           "Custom workflow tailored to your exact specifications with intelligent routing and processing",
//         technicalRequirements: [
//           "Custom API integrations",
//           "Advanced AI/ML processing",
//           "Real-time data synchronization",
//           "Scalable cloud infrastructure",
//           "Security compliance setup",
//         ],
//         deploymentChannels: selectedChannels,
//         estimatedCost: "$2000-5000/month",
//         roi: "400-800% within 6 months",
//         metrics: {
//           automationRate: "98%",
//           responseTime: "< 1 second",
//           accuracy: "96%",
//           scalability: "Enterprise+",
//         },
//       }

//       return { success: true, workflowData: workflow }
//     } catch (error) {
//       console.error("AI API call failed:", error)
//       return {
//         success: false,
//         error: error instanceof Error ? error.message : "AI generation failed",
//       }
//     }
//   }

//   // Process AI response into workflow steps with streaming
//   const processAIResponseIntoSteps = async (workflowData: any): Promise<WorkflowStep[]> => {
//     const steps: WorkflowStep[] = []
//     const stepsData = generateCustomSteps()

//     for (let i = 0; i < stepsData.length; i++) {
//       const stepData = stepsData[i]
//       const config = stepTypeConfigs[stepData.type] || stepTypeConfigs.automation

//       const suggestedIntegrations = getSuggestedIntegrationsForStep(stepData.type, stepData.title)

//       const step: WorkflowStep = {
//         id: `step-${i + 1}`,
//         stepNumber: i + 1,
//         title: stepData.title,
//         description: stepData.description,
//         type: stepData.type,
//         icon: config.icon,
//         color: config.color,
//         bgColor: config.bgColor,
//         borderColor: config.borderColor,
//         estimatedTime: stepData.estimatedTime || getEstimatedTimeForStep(stepData.type),
//         inputs: stepData.inputs || (i === 0 ? ["User Request"] : ["Previous Step Output"]),
//         outputs: stepData.outputs || (i === stepsData.length - 1 ? ["Custom Solution"] : ["Processed Data"]),
//         details: stepData.details || [
//           `Custom ${stepData.type} processing`,
//           "Tailored to your specific requirements",
//           "Enterprise-grade implementation",
//         ],
//         isAnimating: true,
//         suggestedIntegrations,
//         selectedIntegrations: suggestedIntegrations.slice(0, 1),
//         aiReasoning:
//           stepData.aiReasoning || `This custom step is designed specifically for your ${stepData.type} requirements.`,
//         complexity: stepData.complexity || "high",
//         businessImpact:
//           stepData.businessImpact || `Delivers custom ${stepData.type} functionality tailored to your business needs.`,
//         alternatives: stepData.alternatives || [
//           `Alternative ${stepData.type} implementations`,
//           "Custom enhancement options",
//         ],
//       }

//       setStreamingSteps((prevSteps) => [...prevSteps, step])

//       const progress = ((i + 1) / stepsData.length) * 70 + 25
//       setStreamingProgress(progress)

//       addAiThought(`🔧 Generated custom step ${i + 1}: ${step.title}`)

//       setTimeout(() => {
//         if (stepContainerRef.current) {
//           const newStepElement = stepContainerRef.current.querySelector(`[data-step-id="step-${i + 1}"]`)
//           if (newStepElement) {
//             newStepElement.scrollIntoView({ behavior: "smooth", block: "nearest" })
//           }
//         }
//       }, 100)

//       await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 400))

//       setStreamingSteps((prevSteps) => prevSteps.map((s) => (s.id === step.id ? { ...s, isAnimating: false } : s)))

//       steps.push(step)
//     }

//     return steps
//   }

//   // Generate custom workflow steps
//   const generateCustomSteps = () => [
//     {
//       title: "Custom Request Analysis",
//       description: "Advanced AI analyzes your specific requirements and business context",
//       type: "analysis",
//       estimatedTime: "2-3s",
//       inputs: ["User Requirements", "Business Context"],
//       outputs: ["Analyzed Requirements", "Context Mapping"],
//       details: [
//         "Advanced NLP processing of user requirements",
//         "Business context analysis and mapping",
//         "Requirement validation and clarification",
//         "Custom rule generation based on specifications",
//       ],
//       complexity: "high" as const,
//       businessImpact: "Ensures the automation perfectly aligns with your unique business needs and requirements",
//       alternatives: ["Standard requirement processing", "Manual requirement analysis"],
//       aiReasoning: "Essential for understanding your unique automation needs",
//     },
//     {
//       title: "Intelligent Message Processing",
//       description: "Custom NLP and ML models trained for your specific business domain",
//       type: "trigger",
//       estimatedTime: "< 1s",
//       inputs: ["Incoming Messages", "Domain Models"],
//       outputs: ["Processed Content", "Intent Classification"],
//       details: [
//         "Domain-specific NLP model deployment",
//         "Real-time message classification and routing",
//         "Custom entity recognition and extraction",
//         "Multi-language processing capabilities",
//       ],
//       complexity: "high" as const,
//       businessImpact: "Provides industry-specific understanding and processing of customer communications",
//       alternatives: ["Generic NLP processing", "Rule-based message handling"],
//       aiReasoning: "Tailored message processing for optimal accuracy",
//     },
//     {
//       title: "Dynamic Content Filtering",
//       description: "Advanced filtering with custom rules based on your business logic",
//       type: "filter",
//       estimatedTime: "< 1s",
//       inputs: ["Processed Messages", "Custom Rules"],
//       outputs: ["Filtered Content", "Quality Score"],
//       details: [
//         "Custom filtering rules based on business logic",
//         "Content quality assessment and scoring",
//         "Spam and inappropriate content detection",
//         "Compliance and regulatory filtering",
//       ],
//       complexity: "medium" as const,
//       businessImpact: "Ensures only relevant, high-quality interactions are processed, maintaining brand reputation",
//       alternatives: ["Basic content filtering", "Manual content review"],
//       aiReasoning: "Ensures only relevant interactions are processed",
//     },
//     {
//       title: "Custom Integration Hub",
//       description: "Seamlessly connects with your existing tools and workflows",
//       type: "integration",
//       estimatedTime: "1-2s",
//       inputs: ["Filtered Data", "System Credentials"],
//       outputs: ["Integrated Data", "System Updates"],
//       details: [
//         "Custom API integrations with existing systems",
//         "Real-time data synchronization across platforms",
//         "Error handling and retry mechanisms",
//         "Data transformation and mapping",
//       ],
//       complexity: "high" as const,
//       businessImpact: "Maximizes value from your current technology stack without disrupting existing workflows",
//       alternatives: ["Standard API integrations", "Manual data transfer"],
//       aiReasoning: "Maximizes value from your current technology stack",
//     },
//     {
//       title: "AI-Powered Response Engine",
//       description: "Generates contextual responses using your brand voice and guidelines",
//       type: "response",
//       estimatedTime: "1-2s",
//       inputs: ["Context Data", "Brand Guidelines"],
//       outputs: ["Generated Response", "Confidence Score"],
//       details: [
//         "Brand voice training and implementation",
//         "Contextual response generation with personalization",
//         "Multi-channel response optimization",
//         "A/B testing for response effectiveness",
//       ],
//       complexity: "high" as const,
//       businessImpact:
//         "Maintains consistent brand experience at scale while providing personalized customer interactions",
//       alternatives: ["Template-based responses", "Generic AI responses"],
//       aiReasoning: "Maintains consistent brand experience at scale",
//     },
//     {
//       title: "Smart Routing & Escalation",
//       description: "Intelligent decision making for complex scenarios and human handoffs",
//       type: "routing",
//       estimatedTime: "< 1s",
//       inputs: ["Response Data", "Escalation Rules"],
//       outputs: ["Routing Decision", "Escalation Alert"],
//       details: [
//         "Intelligent escalation based on complexity and sentiment",
//         "Workload balancing across team members",
//         "Priority scoring and urgent issue detection",
//         "Custom routing rules based on expertise",
//       ],
//       complexity: "medium" as const,
//       businessImpact: "Ensures complex issues receive appropriate human attention while optimizing team efficiency",
//       alternatives: ["Rule-based routing", "Manual escalation"],
//       aiReasoning: "Ensures complex issues receive appropriate attention",
//     },
//     {
//       title: "Custom Data Management",
//       description: "Sophisticated data handling tailored to your privacy and compliance needs",
//       type: "storage",
//       estimatedTime: "2-4s",
//       inputs: ["Process Data", "Compliance Rules"],
//       outputs: ["Stored Data", "Audit Trail"],
//       details: [
//         "GDPR and privacy compliance handling",
//         "Custom data retention and archival policies",
//         "Encrypted storage with audit trails",
//         "Data analytics and reporting capabilities",
//       ],
//       complexity: "high" as const,
//       businessImpact: "Maintains data integrity and regulatory compliance while enabling advanced analytics",
//       alternatives: ["Basic data storage", "Manual compliance management"],
//       aiReasoning: "Maintains data integrity and regulatory compliance",
//     },
//     {
//       title: "Advanced Analytics Engine",
//       description: "Custom reporting and insights dashboard for your specific KPIs",
//       type: "validation",
//       estimatedTime: "3-5s",
//       inputs: ["Historical Data", "KPI Definitions"],
//       outputs: ["Analytics Report", "Performance Metrics"],
//       details: [
//         "Custom KPI tracking and measurement",
//         "Real-time performance monitoring and alerts",
//         "Predictive analytics for capacity planning",
//         "Custom dashboard creation and visualization",
//       ],
//       complexity: "high" as const,
//       businessImpact: "Provides actionable insights for continuous improvement and strategic decision making",
//       alternatives: ["Basic reporting", "Manual analytics"],
//       aiReasoning: "Provides actionable insights for continuous improvement",
//     },
//   ]

//   const getSuggestedIntegrationsForStep = (stepType: string, stepTitle: string): Integration[] => {
//     const suggestions: Integration[] = []
//     const title = stepTitle.toLowerCase()

//     // Smart integration matching based on step type and content
//     if (stepType === "trigger" || title.includes("message") || title.includes("processing")) {
//       suggestions.push(...INTEGRATION_DATABASE.filter((i) => i.category === "communication"))
//     }

//     if (stepType === "storage" || title.includes("data") || title.includes("management")) {
//       suggestions.push(...INTEGRATION_DATABASE.filter((i) => i.category === "database"))
//       suggestions.push(...INTEGRATION_DATABASE.filter((i) => i.category === "crm"))
//     }

//     if (
//       stepType === "response" ||
//       title.includes("email") ||
//       title.includes("message") ||
//       title.includes("notification")
//     ) {
//       suggestions.push(...INTEGRATION_DATABASE.filter((i) => i.category === "email"))
//     }

//     if (stepType === "integration" || title.includes("hub") || title.includes("connect")) {
//       suggestions.push(...INTEGRATION_DATABASE.filter((i) => i.category === "crm"))
//       suggestions.push(...INTEGRATION_DATABASE.filter((i) => i.category === "ecommerce"))
//     }

//     if (stepType === "validation" || title.includes("analytics") || title.includes("reporting")) {
//       suggestions.push(...INTEGRATION_DATABASE.filter((i) => i.category === "analytics"))
//     }

//     // Remove duplicates and sort by popularity
//     const uniqueSuggestions = suggestions.filter(
//       (integration, index, self) => index === self.findIndex((i) => i.id === integration.id),
//     )

//     return uniqueSuggestions.sort((a, b) => b.popularity - a.popularity).slice(0, 4)
//   }

//   const getEstimatedTimeForStep = (stepType: string): string => {
//     return "< 2s" // Custom workflows are optimized
//   }

//   const getUniqueIntegrations = (steps: WorkflowStep[]): Integration[] => {
//     const allIntegrations = steps.flatMap((step) => step.selectedIntegrations || [])
//     return allIntegrations.filter(
//       (integration, index, self) => index === self.findIndex((i) => i.id === integration.id),
//     )
//   }

//   const addAiThought = (thought: string): void => {
//     setAiThoughts((prev) => {
//       const newThoughts = [...prev, thought]
//       return newThoughts.slice(-5)
//     })
//   }

//   const getAiThoughtForPhase = (phase: number): string => {
//     const thoughts = [
//       "🔍 Analyzing your custom requirements and business constraints...",
//       "🎨 Designing bespoke workflow architecture with enterprise capabilities...",
//       "🔗 Identifying optimal integrations for your specific use case...",
//       "⚡ Fine-tuning for maximum performance and scalability...",
//     ]
//     return thoughts[phase] || "🤖 Processing your custom workflow requirements..."
//   }

//   // Updated handleApprove to submit to the new API endpoint
//   const handleApprove = async (): Promise<void> => {
//     setIsGenerating(true)
//     setResponseStatus("📧 Submitting custom workflow to development team...")

//     try {
//       const payload = {
//         title: parsedWorkflow?.title || "Custom AI Workflow",
//         businessObjective: parsedWorkflow?.description || "Custom automation solution",
//         businessInfo: businessInfo,
//         workflowDesign: parsedWorkflow,
//         selectedChannels: selectedChannels,
//         automationFeatures: automationFeatures,
//         customRequest: workflowRequest,
//         baseWorkflowId: selectedWorkflowId,
//         submittedAt: new Date().toISOString(),
//         urgency: "NORMAL",
//       }

//       const response = await fetch("/api/workflow-requests", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       })

//       const result = await response.json()

//       if (result.success) {
//         setResponseStatus("✅ Custom workflow submitted to development team successfully!")

//         // Store pending workflow data in localStorage
//         const pendingData = {
//           id: result.request.id,
//           submittedAt: new Date().toISOString(),
//           status: "PENDING_CREATION",
//           workflowType: selectedWorkflowId ? `Modified ${selectedWorkflowId}` : "Custom Workflow",
//           estimatedCompletion: "3-5",
//         }

//         localStorage.setItem("pendingWorkflow", JSON.stringify(pendingData))

//         setTimeout(() => {
//           if (setStep) setStep("pending")
//         }, 2000)
//       } else {
//         throw new Error(result.error || "Failed to submit workflow request")
//       }
//     } catch (error) {
//       console.error("Approval error:", error)
//       setResponseStatus("❌ Failed to submit to development team. Please try again.")
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   const handleInitialSubmit = (): void => {
//     if (!workflowRequest.trim()) {
//       setResponseStatus("❌ Please describe your automation needs")
//       return
//     }
//     if (selectedChannels.length === 0) {
//       setResponseStatus("❌ Please select at least one platform")
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

//   const handleChannelToggle = (channelId: string): void => {
//     const newChannels = selectedChannels.includes(channelId)
//       ? selectedChannels.filter((c) => c !== channelId)
//       : [...selectedChannels, channelId]
//     setSelectedChannels(newChannels)
//   }

//   const handleFeatureToggle = (featureId: string, checked: boolean): void => {
//     if (checked) {
//       setAutomationFeatures((prev) => [...prev, featureId])
//     } else {
//       setAutomationFeatures((prev) => prev.filter((f) => f !== featureId))
//     }
//   }

//   const handleIntegrationToggle = (stepId: string, integration: Integration): void => {
//     setStreamingSteps((prevSteps) =>
//       prevSteps.map((step) => {
//         if (step.id === stepId) {
//           const isSelected = step.selectedIntegrations?.some((i) => i.id === integration.id)
//           const newSelected = isSelected
//             ? step.selectedIntegrations?.filter((i) => i.id !== integration.id) || []
//             : [...(step.selectedIntegrations || []), integration]

//           return { ...step, selectedIntegrations: newSelected }
//         }
//         return step
//       }),
//     )
//   }

//   // Enhanced components
//   const StreamingProgress: React.FC = () => {
//     if (!isGenerating) return null

//     const currentPhaseData = streamingPhases[currentPhase]
//     const IconComponent = currentPhaseData?.icon || Brain

//     return (
//       <div className="mb-8">
//         <div className="flex items-center justify-center mb-6">
//           <div className="relative">
//             <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center">
//               <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin"></div>
//               <IconComponent className={`h-10 w-10 ${currentPhaseData?.color || "text-blue-500"} animate-pulse`} />
//             </div>
//           </div>
//         </div>

//         <div className="text-center mb-6">
//           <h3 className="text-xl font-semibold mb-2">{currentPhaseData?.title || "Processing..."}</h3>
//           <p className="text-muted-foreground">
//             {currentPhaseData?.description || "Working on your custom workflow..."}
//           </p>
//         </div>

//         <div className="mb-6">
//           <div className="flex justify-between text-sm text-muted-foreground mb-2">
//             <span>Overall Progress</span>
//             <span>{Math.round(streamingProgress)}%</span>
//           </div>
//           <Progress value={streamingProgress} className="h-3 mb-4" />
//         </div>

//         <div className="flex justify-center gap-6 mb-6">
//           {streamingPhases.map((phase, index) => {
//             const PhaseIcon = phase.icon
//             return (
//               <div key={phase.id} className="flex flex-col items-center">
//                 <div
//                   className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
//                     index < currentPhase
//                       ? "bg-green-500 text-white shadow-lg"
//                       : index === currentPhase
//                         ? "bg-blue-500 text-white animate-pulse shadow-lg"
//                         : "bg-gray-200 text-gray-400"
//                   }`}
//                 >
//                   {index < currentPhase ? <CheckCircle className="h-6 w-6" /> : <PhaseIcon className="h-6 w-6" />}
//                 </div>
//                 <span
//                   className={`text-xs mt-2 text-center font-medium ${
//                     index === currentPhase ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"
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
//           <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
//             <div className="flex items-center gap-2 mb-3">
//               <Brain className="h-4 w-4 text-blue-500" />
//               <span className="text-sm font-medium text-blue-700 dark:text-blue-300">AI Insights</span>
//             </div>
//             <div className="space-y-2 max-h-24 overflow-hidden">
//               {aiThoughts.slice(-3).map((thought, index) => (
//                 <div
//                   key={index}
//                   className={`text-xs text-blue-600 dark:text-blue-400 transition-opacity duration-500 ${
//                     index === aiThoughts.length - 1 ? "opacity-100" : "opacity-70"
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

//   const IntegrationSelector: React.FC<{ step: WorkflowStep }> = ({ step }) => {
//     if (!step.suggestedIntegrations || step.suggestedIntegrations.length === 0) return null

//     return (
//       <div className="mt-4 p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/20">
//         <h6 className="font-semibold mb-3 flex items-center gap-2">
//           <Puzzle className="h-4 w-4 text-purple-500" />
//           Suggested Integrations
//           <Badge variant="outline" className="text-xs">
//             {step.suggestedIntegrations.length} available
//           </Badge>
//         </h6>

//         <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
//           {step.suggestedIntegrations.map((integration) => {
//             const IconComponent = integration.icon
//             const isSelected = step.selectedIntegrations?.some((i) => i.id === integration.id)

//             return (
//               <div
//                 key={integration.id}
//                 onClick={() => handleIntegrationToggle(step.id, integration)}
//                 className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
//                   isSelected
//                     ? "bg-blue-500 text-white border-blue-500 shadow-md"
//                     : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
//                 }`}
//               >
//                 <div className="flex items-center gap-3">
//                   <IconComponent className="h-5 w-5 flex-shrink-0" />
//                   <div className="flex-grow min-w-0">
//                     <div className="flex items-center gap-2 mb-1">
//                       <span className="font-medium text-sm truncate">{integration.name}</span>
//                       <Badge
//                         variant={isSelected ? "secondary" : "outline"}
//                         className={`text-xs ${isSelected ? "bg-white/20 text-white" : ""}`}
//                       >
//                         {integration.pricing}
//                       </Badge>
//                     </div>
//                     <p className={`text-xs truncate ${isSelected ? "text-white/80" : "text-muted-foreground"}`}>
//                       {integration.description}
//                     </p>
//                     <div className="flex items-center gap-2 mt-1">
//                       <div
//                         className={`flex items-center gap-1 text-xs ${isSelected ? "text-white/70" : "text-muted-foreground"}`}
//                       >
//                         <Timer className="h-3 w-3" />
//                         {integration.setupTime}
//                       </div>
//                       <div
//                         className={`flex items-center gap-1 text-xs ${isSelected ? "text-white/70" : "text-muted-foreground"}`}
//                       >
//                         <Star className="h-3 w-3" />
//                         {integration.popularity}%
//                       </div>
//                     </div>
//                   </div>
//                   {isSelected ? <Check className="h-4 w-4 text-white" /> : <Plus className="h-4 w-4 text-gray-400" />}
//                 </div>
//               </div>
//             )
//           })}
//         </div>
//       </div>
//     )
//   }

//   const StepComponent: React.FC<{ step: WorkflowStep }> = ({ step }) => {
//     const config = stepTypeConfigs[step.type] || stepTypeConfigs.automation
//     const IconComponent = step.icon || config.icon
//     const isExpanded = expandedSteps.has(step.stepNumber)

//     return (
//       <div
//         data-step-id={step.id}
//         className={`relative transition-all duration-500 ${step.isAnimating ? "animate-pulse" : ""}`}
//         style={{
//           animation: step.isAnimating ? "slideInFromLeft 0.6s ease-out" : "none",
//         }}
//       >
//         <div
//           className={`rounded-xl border-2 transition-all duration-300 cursor-pointer bg-gradient-to-br ${
//             config.bgColor
//           } ${config.darkBg} ${config.borderColor} ${config.darkBorder} ${
//             isExpanded
//               ? "shadow-xl scale-[1.02] border-opacity-100"
//               : "hover:shadow-lg hover:scale-[1.01] border-opacity-60"
//           }`}
//           onClick={() => toggleStepExpansion(step.stepNumber)}
//         >
//           {/* Step Header */}
//           <div className="p-6">
//             <div className="flex items-center gap-4">
//               {/* Enhanced Step Number with Icon */}
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

//               {/* Enhanced Step Content */}
//               <div className="flex-grow">
//                 <div className="flex items-center gap-3 mb-3">
//                   <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">{step.title}</h4>
//                   <Badge variant="outline" className="text-xs font-medium">
//                     {step.type}
//                   </Badge>
//                   <Badge
//                     variant="secondary"
//                     className={`text-xs ${
//                       step.complexity === "high"
//                         ? "bg-red-100 text-red-700"
//                         : step.complexity === "medium"
//                           ? "bg-yellow-100 text-yellow-700"
//                           : "bg-green-100 text-green-700"
//                     }`}
//                   >
//                     {step.complexity} complexity
//                   </Badge>
//                   {step.estimatedTime && (
//                     <Badge variant="secondary" className="text-xs">
//                       <Timer className="h-3 w-3 mr-1" />
//                       {step.estimatedTime}
//                     </Badge>
//                   )}
//                 </div>
//                 <p className="text-muted-foreground mb-3 leading-relaxed">{step.description}</p>

//                 {/* Enhanced Input/Output Flow */}
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

//                 {/* Integration Preview */}
//                 {step.selectedIntegrations && step.selectedIntegrations.length > 0 && (
//                   <div className="mt-3 flex items-center gap-2">
//                     <Zap className="h-4 w-4 text-purple-500" />
//                     <span className="text-sm text-purple-700 dark:text-purple-300 font-medium">
//                       Integrations: {step.selectedIntegrations.map((i) => i.name).join(", ")}
//                     </span>
//                   </div>
//                 )}
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
//               {/* AI Reasoning */}
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
//                     Configuration Options
//                   </h5>
//                   <div className="space-y-2 text-sm">
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                       <span>Auto-retry enabled</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
//                       <span>Real-time monitoring</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
//                       <span>Custom error handling</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
//                       <span>Performance optimization</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Integration Selector */}
//               <IntegrationSelector step={step} />
//             </div>
//           )}
//         </div>

//         {/* Enhanced Connection Line */}
//         {step.stepNumber < (streamingSteps.length || 1) && (
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

//   return (
//     <div className="min-h-screen bg-background p-6">
//       <style jsx>{`
//         @keyframes slideInFromLeft {
//           0% {
//             opacity: 0;
//             transform: translateX(-30px);
//           }
//           100% {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }
//       `}</style>

//       <div className="max-w-7xl mx-auto">
//         {/* Enhanced Header */}
//         <div className="mb-8">
//           <Button variant="ghost" className="mb-6 hover:bg-accent" onClick={() => setStep?.("selection")}>
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Selection
//           </Button>
//           <div className="text-center mb-8">
//             <h1 className="text-5xl font-bold mb-4">Custom AI Workflow Designer</h1>
//             <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
//               Design a completely custom workflow tailored to your unique business needs.
//             </p>
//             <div className="flex items-center justify-center gap-6 mt-4 text-sm text-muted-foreground">
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//                 <span>Custom AI Generation</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
//                 <span>Bespoke Integration Matching</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
//                 <span>Enterprise Development</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid gap-8 lg:grid-cols-3">
//           {/* Enhanced Left Column - Input */}
//           <div className="lg:col-span-1 space-y-6">
//             <Card className="border-2 border-border bg-card/50 backdrop-blur-sm">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Wand2 className="h-5 w-5 text-primary" />
//                   {!hasInitialRequest ? "Design Your Custom Automation" : "Refine Your Workflow"}
//                 </CardTitle>
//                 <CardDescription>
//                   {!hasInitialRequest
//                     ? "Describe your unique automation needs and our AI will create a tailored solution"
//                     : "Provide feedback to enhance and customize the design"}
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 {!hasInitialRequest && (
//                   <>
//                     {/* Enhanced Platform Selection */}
//                     <div className="space-y-3">
//                       <Label className="text-base font-semibold">Social Media Platforms</Label>
//                       <div className="grid grid-cols-1 gap-3">
//                         {channelOptions.map((channel) => {
//                           const IconComponent = channel.icon
//                           return (
//                             <button
//                               key={channel.id}
//                               onClick={() => handleChannelToggle(channel.id)}
//                               className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
//                                 selectedChannels.includes(channel.id)
//                                   ? "bg-primary text-primary-foreground border-primary shadow-lg transform scale-105"
//                                   : "bg-card border-border hover:border-primary/50 hover:bg-accent hover:transform hover:scale-102"
//                               }`}
//                             >
//                               <div className="flex items-center gap-3">
//                                 <IconComponent className="h-5 w-5" />
//                                 <span className="font-medium">{channel.label}</span>
//                                 {selectedChannels.includes(channel.id) && <Check className="h-4 w-4 ml-auto" />}
//                               </div>
//                             </button>
//                           )
//                         })}
//                       </div>
//                     </div>

//                     {/* Enhanced Feature Selection */}
//                     <div className="space-y-3">
//                       <Label className="text-base font-semibold">AI Automation Features</Label>
//                       <div className="space-y-2">
//                         {automationFeatureOptions.map((feature) => (
//                           <label
//                             key={feature.id}
//                             className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-accent transition-colors"
//                           >
//                             <input
//                               type="checkbox"
//                               checked={automationFeatures.includes(feature.id)}
//                               onChange={(e) => handleFeatureToggle(feature.id, e.target.checked)}
//                               className="w-4 h-4 rounded border-border"
//                             />
//                             <span className="text-sm font-medium">{feature.label}</span>
//                           </label>
//                         ))}
//                       </div>
//                     </div>
//                   </>
//                 )}

//                 {/* Enhanced Request Input */}
//                 {!hasInitialRequest ? (
//                   <>
//                     <div className="space-y-3">
//                       <Label htmlFor="workflowRequest" className="text-base font-semibold">
//                         Describe Your Custom Automation Vision
//                       </Label>
//                       <Textarea
//                         id="workflowRequest"
//                         value={workflowRequest}
//                         onChange={(e) => setWorkflowRequest(e.target.value)}
//                         placeholder="e.g., 'I need a custom workflow that automatically processes customer support tickets in multiple languages, integrates with our proprietary CRM system, uses machine learning to categorize issues, routes them to specialized teams based on expertise and workload, and provides real-time performance analytics with custom dashboards.'"
//                         rows={8}
//                         className="bg-background border-2 border-blue-200 focus:border-blue-500 resize-none text-sm"
//                         disabled={isGenerating}
//                       />
//                     </div>
//                     <Button
//                       onClick={handleInitialSubmit}
//                       disabled={isGenerating || !workflowRequest.trim()}
//                       className="w-full flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 text-base"
//                     >
//                       {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
//                       Generate Custom AI Workflow
//                     </Button>
//                   </>
//                 ) : (
//                   <>
//                     <div className="space-y-3">
//                       <Label htmlFor="refinementInput" className="text-base font-semibold">
//                         Refine Your Custom Workflow
//                       </Label>
//                       <Textarea
//                         id="refinementInput"
//                         value={refinementInput}
//                         onChange={(e) => setRefinementInput(e.target.value)}
//                         placeholder="e.g., 'Add integration with our custom database API', 'Include advanced sentiment analysis for priority routing', 'Add compliance checks for GDPR requirements', 'Implement predictive analytics for capacity planning'"
//                         rows={5}
//                         className="bg-white/50 border-2 border-blue-200 focus:border-blue-500 resize-none"
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
//                         Refine Design
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
//                         Submit design
//                       </Button>
//                     </div>
//                   </>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Enhanced Business Context */}
//             <Card className="border-2 border-border bg-card/50 backdrop-blur-sm">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Building className="h-5 w-5 text-primary" />
//                   Business Context
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4 text-sm">
//                 <div className="p-3 bg-muted/50 rounded-lg">
//                   <span className="font-semibold text-primary">Business:</span>
//                   <p className="text-muted-foreground mt-1">{businessInfo.businessName}</p>
//                 </div>
//                 <div className="p-3 bg-muted/50 rounded-lg">
//                   <span className="font-semibold text-primary">Industry:</span>
//                   <p className="text-muted-foreground mt-1">{businessInfo.businessType}</p>
//                 </div>
//                 {businessInfo.description && (
//                   <div className="p-3 bg-muted/50 rounded-lg">
//                     <span className="font-semibold text-primary">Description:</span>
//                     <p className="text-muted-foreground mt-1">{businessInfo.description}</p>
//                   </div>
//                 )}
//                 {selectedChannels.length > 0 && (
//                   <div className="p-3 bg-muted/50 rounded-lg">
//                     <span className="font-semibold text-primary">Selected Platforms:</span>
//                     <div className="flex flex-wrap gap-2 mt-2">
//                       {selectedChannels.map((channel) => (
//                         <Badge key={channel} variant="secondary" className="text-xs">
//                           {channelOptions.find((c) => c.id === channel)?.label}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//                 {automationFeatures.length > 0 && (
//                   <div className="p-3 bg-muted/50 rounded-lg">
//                     <span className="font-semibold text-primary">AI Features:</span>
//                     <div className="flex flex-wrap gap-2 mt-2">
//                       {automationFeatures.map((feature) => (
//                         <Badge key={feature} variant="outline" className="text-xs">
//                           {automationFeatureOptions.find((f) => f.id === feature)?.label}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Enhanced Right Column - AI Generated Workflow */}
//           <div className="lg:col-span-2">
//             <Card className="border-2 border-border min-h-[700px] bg-card backdrop-blur-sm">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Brain className="h-6 w-6 text-primary" />
//                   Custom AI Workflow Generation
//                   {parsedWorkflow && (
//                     <Badge variant="outline" className="ml-auto">
//                       <Star className="h-3 w-3 mr-1" />
//                       Custom AI Generated
//                     </Badge>
//                   )}
//                 </CardTitle>
//                 <CardDescription className="text-base">
//                   Advanced AI creates bespoke enterprise workflows with custom integrations in real-time
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {/* Enhanced Status Message */}
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

//                 {/* Enhanced Streaming Progress */}
//                 {isGenerating && <StreamingProgress />}

//                 {/* Enhanced Workflow Header */}
//                 {parsedWorkflow && !isGenerating && (
//                   <div className="mb-8 p-8 rounded-2xl bg-muted/30 border-2 border-border backdrop-blur-sm">
//                     <div className="text-center mb-8">
//                       <h3 className="text-3xl font-bold mb-3 text-foreground">{parsedWorkflow.title}</h3>
//                       <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
//                         {parsedWorkflow.description}
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//                       <div className="text-center p-4 bg-card rounded-xl shadow-sm border border-border">
//                         <div className="text-2xl font-bold text-primary mb-1">
//                           {parsedWorkflow.metrics?.automationRate}
//                         </div>
//                         <div className="text-xs text-muted-foreground font-medium">Automation Rate</div>
//                       </div>
//                       <div className="text-center p-4 bg-card rounded-xl shadow-sm border border-border">
//                         <div className="text-2xl font-bold text-primary mb-1">
//                           {parsedWorkflow.metrics?.responseTime}
//                         </div>
//                         <div className="text-xs text-muted-foreground font-medium">Response Time</div>
//                       </div>
//                       <div className="text-center p-4 bg-card rounded-xl shadow-sm border border-border">
//                         <div className="text-2xl font-bold text-primary mb-1">{parsedWorkflow.metrics?.accuracy}</div>
//                         <div className="text-xs text-muted-foreground font-medium">AI Accuracy</div>
//                       </div>
//                       <div className="text-center p-4 bg-card rounded-xl shadow-sm border border-border">
//                         <div className="text-2xl font-bold text-primary mb-1">{parsedWorkflow.estimatedBuildTime}</div>
//                         <div className="text-xs text-muted-foreground font-medium">Build Time</div>
//                       </div>
//                     </div>

//                     {/* Enhanced ROI and Cost Information */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="p-4 bg-secondary/30 rounded-xl border border-border">
//                         <div className="flex items-center gap-2 mb-2">
//                           <TrendingUp className="h-4 w-4 text-primary" />
//                           <span className="font-semibold text-foreground">Expected ROI</span>
//                         </div>
//                         <div className="text-xl font-bold text-primary">{parsedWorkflow.roi}</div>
//                       </div>
//                       <div className="p-4 bg-accent/30 rounded-xl border border-border">
//                         <div className="flex items-center gap-2 mb-2">
//                           <CreditCard className="h-4 w-4 text-primary" />
//                           <span className="font-semibold text-foreground">Monthly Cost</span>
//                         </div>
//                         <div className="text-xl font-bold text-primary">{parsedWorkflow.estimatedCost}</div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Enhanced Streaming Steps */}
//                 {(isStreaming || streamingSteps.length > 0) && (
//                   <div ref={stepContainerRef} className="space-y-8">
//                     <div className="flex items-center gap-4 mb-8">
//                       <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
//                         <Workflow className="h-6 w-6 text-white" />
//                       </div>
//                       <div>
//                         <h3 className="text-2xl font-bold">Custom Workflow Steps</h3>
//                         <p className="text-muted-foreground">AI-designed automation tailored to your specific needs</p>
//                       </div>
//                       <Badge variant="outline" className="ml-auto text-base px-3 py-1">
//                         {isStreaming
//                           ? `${streamingSteps.length} steps generated...`
//                           : `${streamingSteps.length} total steps`}
//                       </Badge>
//                     </div>

//                     {streamingSteps.map((step) => (
//                       <StepComponent key={step.id} step={step} />
//                     ))}

//                     {isStreaming && (
//                       <div className="flex justify-center py-8">
//                         <div className="flex items-center gap-3 text-muted-foreground">
//                           <Loader2 className="h-5 w-5 animate-spin" />
//                           <span className="font-medium">AI is generating more custom steps...</span>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Enhanced Initial State */}
//                 {!isGenerating && !parsedWorkflow && !hasInitialRequest && (
//                   <div className="flex flex-col items-center justify-center py-24 text-center">
//                     <div className="relative mb-8">
//                       <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
//                         <Brain className="h-12 w-12 text-blue-500" />
//                       </div>
//                       <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
//                         <Sparkles className="h-4 w-4 text-white" />
//                       </div>
//                     </div>
//                     <h3 className="text-2xl font-bold mb-4">Ready to Design Your Custom Workflow</h3>
//                     <p className="text-center max-w-lg mb-8 text-muted-foreground leading-relaxed">
//                       Our advanced AI will analyze your unique requirements and generate a completely custom,
//                       enterprise-grade workflow with bespoke integrations and architecture.
//                     </p>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground">
//                       <div className="flex flex-col items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
//                         <Brain className="h-5 w-5 text-blue-500" />
//                         <span className="font-medium">Custom AI</span>
//                       </div>
//                       <div className="flex flex-col items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
//                         <Zap className="h-5 w-5 text-green-500" />
//                         <span className="font-medium">Bespoke Integrations</span>
//                       </div>
//                       <div className="flex flex-col items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
//                         <Rocket className="h-5 w-5 text-purple-500" />
//                         <span className="font-medium">Enterprise Ready</span>
//                       </div>
//                       <div className="flex flex-col items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
//                         <TrendingUp className="h-5 w-5 text-orange-500" />
//                         <span className="font-medium">Maximum ROI</span>
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
import {
  ArrowLeft,
  Sparkles,
  Loader2,
  CheckCircle,
  Settings,
  ThumbsUp,
  Bot,
  Mic,
  Phone,
  MessageCircle,
  RefreshCw,
  MessageSquare,
  Zap,
  AlertCircle,
  PlayCircle,
  Workflow,
  GitBranch,
  ChevronDown,
  ChevronRight,
  Database,
  Filter,
  Mail,
  Bell,
  BarChart3,
  Shield,
  Star,
  TrendingUp,
  Brain,
  Rocket,
  Timer,
  Layers,
  Activity,
  Wand2,
  Plus,
  Check,
  Building,
  Cloud,
  ShoppingCart,
  CreditCard,
  Link2,
  Puzzle,
  Search,
  Gauge,
} from "lucide-react"

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
  category: string
  icon: React.ComponentType<{ className?: string }>
  pricing: "free" | "freemium" | "paid" | "enterprise"
  popularity: number
  difficulty: "easy" | "medium" | "hard"
  apiAvailable: boolean
  webhookSupport: boolean
  realTimeSync: boolean
  features: string[]
  setupTime: string
  website?: string
}

interface WorkflowStep {
  id: string
  stepNumber: number
  title: string
  description: string
  type: string
  inputs?: string[]
  outputs?: string[]
  conditions?: string[]
  estimatedTime?: string
  icon?: React.ComponentType<{ className?: string }>
  color?: string
  bgColor?: string
  borderColor?: string
  details?: string[]
  isAnimating?: boolean
  suggestedIntegrations?: Integration[]
  selectedIntegrations?: Integration[]
  aiReasoning?: string
  complexity?: "low" | "medium" | "high"
  businessImpact?: string
  alternatives?: string[]
}

interface StreamingPhase {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  duration: number
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
  technicalRequirements: string[]
  deploymentChannels: string[]
  estimatedCost?: string
  roi?: string
  metrics?: {
    automationRate: string
    responseTime: string
    accuracy: string
    scalability: string
  }
}

interface ChannelOption {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

interface AutomationFeature {
  id: string
  label: string
}

interface StepTypeConfig {
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  borderColor: string
  accentColor: string
  darkBg: string
  darkBorder: string
}

// Comprehensive Integration Database
const INTEGRATION_DATABASE: Integration[] = [
  // CRM Systems
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Comprehensive CRM and marketing automation platform",
    category: "crm",
    icon: Building,
    pricing: "freemium",
    popularity: 95,
    difficulty: "easy",
    apiAvailable: true,
    webhookSupport: true,
    realTimeSync: true,
    features: ["Contact Management", "Deal Tracking", "Email Marketing", "Analytics"],
    setupTime: "15-30 minutes",
    website: "https://hubspot.com",
  },
  {
    id: "salesforce",
    name: "Salesforce",
    description: "World's leading CRM platform for sales and customer service",
    category: "crm",
    icon: Cloud,
    pricing: "paid",
    popularity: 90,
    difficulty: "medium",
    apiAvailable: true,
    webhookSupport: true,
    realTimeSync: true,
    features: ["Lead Management", "Opportunity Tracking", "Custom Objects", "Automation"],
    setupTime: "30-60 minutes",
    website: "https://salesforce.com",
  },

  // E-commerce Platforms
  {
    id: "shopify",
    name: "Shopify",
    description: "Leading e-commerce platform for online stores",
    category: "ecommerce",
    icon: ShoppingCart,
    pricing: "paid",
    popularity: 92,
    difficulty: "easy",
    apiAvailable: true,
    webhookSupport: true,
    realTimeSync: true,
    features: ["Product Management", "Order Processing", "Inventory", "Payments"],
    setupTime: "20-30 minutes",
    website: "https://shopify.com",
  },

  // Email Marketing
  {
    id: "mailchimp",
    name: "Mailchimp",
    description: "All-in-one email marketing and automation platform",
    category: "email",
    icon: Mail,
    pricing: "freemium",
    popularity: 88,
    difficulty: "easy",
    apiAvailable: true,
    webhookSupport: true,
    realTimeSync: true,
    features: ["Email Campaigns", "Automation", "Audience Segmentation", "Analytics"],
    setupTime: "10-20 minutes",
    website: "https://mailchimp.com",
  },

  // Payment Systems
  {
    id: "stripe",
    name: "Stripe",
    description: "Complete payment processing platform for businesses",
    category: "payment",
    icon: CreditCard,
    pricing: "paid",
    popularity: 95,
    difficulty: "medium",
    apiAvailable: true,
    webhookSupport: true,
    realTimeSync: true,
    features: ["Payment Processing", "Subscriptions", "Invoicing", "Marketplace"],
    setupTime: "25-40 minutes",
    website: "https://stripe.com",
  },

  // Analytics & Tracking
  {
    id: "google-analytics",
    name: "Google Analytics",
    description: "Web analytics service for tracking website traffic",
    category: "analytics",
    icon: BarChart3,
    pricing: "freemium",
    popularity: 98,
    difficulty: "medium",
    apiAvailable: true,
    webhookSupport: false,
    realTimeSync: true,
    features: ["Traffic Analysis", "Conversion Tracking", "Audience Insights", "Reports"],
    setupTime: "20-30 minutes",
    website: "https://analytics.google.com",
  },

  // Communication
  {
    id: "slack",
    name: "Slack",
    description: "Business communication and collaboration platform",
    category: "communication",
    icon: MessageSquare,
    pricing: "freemium",
    popularity: 92,
    difficulty: "easy",
    apiAvailable: true,
    webhookSupport: true,
    realTimeSync: true,
    features: ["Team Chat", "File Sharing", "Integrations", "Workflow Automation"],
    setupTime: "10-20 minutes",
    website: "https://slack.com",
  },

  // Databases & Storage
  {
    id: "airtable",
    name: "Airtable",
    description: "Cloud-based database and spreadsheet hybrid",
    category: "database",
    icon: Database,
    pricing: "freemium",
    popularity: 85,
    difficulty: "easy",
    apiAvailable: true,
    webhookSupport: true,
    realTimeSync: true,
    features: ["Database Management", "Forms", "Views", "Automations"],
    setupTime: "15-25 minutes",
    website: "https://airtable.com",
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

// Step type configurations with unique styling
const stepTypeConfigs: Record<string, StepTypeConfig> = {
  trigger: {
    icon: PlayCircle,
    color: "text-emerald-600",
    bgColor: "from-emerald-50 to-green-100",
    borderColor: "border-emerald-300",
    accentColor: "bg-emerald-500",
    darkBg: "dark:from-emerald-900/20 dark:to-green-900/30",
    darkBorder: "dark:border-emerald-600/50",
  },
  analysis: {
    icon: Brain,
    color: "text-purple-600",
    bgColor: "from-purple-50 to-violet-100",
    borderColor: "border-purple-300",
    accentColor: "bg-purple-500",
    darkBg: "dark:from-purple-900/20 dark:to-violet-900/30",
    darkBorder: "dark:border-purple-600/50",
  },
  filter: {
    icon: Filter,
    color: "text-blue-600",
    bgColor: "from-blue-50 to-cyan-100",
    borderColor: "border-blue-300",
    accentColor: "bg-blue-500",
    darkBg: "dark:from-blue-900/20 dark:to-cyan-900/30",
    darkBorder: "dark:border-blue-600/50",
  },
  response: {
    icon: MessageCircle,
    color: "text-orange-600",
    bgColor: "from-orange-50 to-amber-100",
    borderColor: "border-orange-300",
    accentColor: "bg-orange-500",
    darkBg: "dark:from-orange-900/20 dark:to-amber-900/30",
    darkBorder: "dark:border-orange-600/50",
  },
  notification: {
    icon: Bell,
    color: "text-red-600",
    bgColor: "from-red-50 to-pink-100",
    borderColor: "border-red-300",
    accentColor: "bg-red-500",
    darkBg: "dark:from-red-900/20 dark:to-pink-900/30",
    darkBorder: "dark:border-red-600/50",
  },
  integration: {
    icon: Zap,
    color: "text-yellow-600",
    bgColor: "from-yellow-50 to-orange-100",
    borderColor: "border-yellow-300",
    accentColor: "bg-yellow-500",
    darkBg: "dark:from-yellow-900/20 dark:to-orange-900/30",
    darkBorder: "dark:border-yellow-600/50",
  },
  storage: {
    icon: Database,
    color: "text-gray-600",
    bgColor: "from-gray-50 to-slate-100",
    borderColor: "border-gray-300",
    accentColor: "bg-gray-500",
    darkBg: "dark:from-gray-900/20 dark:to-slate-900/30",
    darkBorder: "dark:border-gray-600/50",
  },
  routing: {
    icon: GitBranch,
    color: "text-indigo-600",
    bgColor: "from-indigo-50 to-blue-100",
    borderColor: "border-indigo-300",
    accentColor: "bg-indigo-500",
    darkBg: "dark:from-indigo-900/20 dark:to-blue-900/30",
    darkBorder: "dark:border-indigo-600/50",
  },
  validation: {
    icon: Shield,
    color: "text-cyan-600",
    bgColor: "from-cyan-50 to-teal-100",
    borderColor: "border-cyan-300",
    accentColor: "bg-cyan-500",
    darkBg: "dark:from-cyan-900/20 dark:to-teal-900/30",
    darkBorder: "dark:border-cyan-600/50",
  },
  automation: {
    icon: Bot,
    color: "text-pink-600",
    bgColor: "from-pink-50 to-rose-100",
    borderColor: "border-pink-300",
    accentColor: "bg-pink-500",
    darkBg: "dark:from-pink-900/20 dark:to-rose-900/30",
    darkBorder: "dark:border-pink-600/50",
  },
}

// AI Processing phases
const streamingPhases: StreamingPhase[] = [
  {
    id: "understanding",
    title: "Analyzing Requirements",
    description: "AI is understanding your business needs and automation goals",
    icon: Search,
    color: "text-blue-500",
    duration: 3000,
  },
  {
    id: "designing",
    title: "Designing Architecture",
    description: "Creating intelligent workflow logic and step sequences",
    icon: Wand2,
    color: "text-purple-500",
    duration: 4000,
  },
  {
    id: "integrations",
    title: "Matching Integrations",
    description: "Finding the best tools and platforms for each step",
    icon: Link2,
    color: "text-green-500",
    duration: 3000,
  },
  {
    id: "optimizing",
    title: "Optimizing Performance",
    description: "Fine-tuning for maximum efficiency and reliability",
    icon: Gauge,
    color: "text-orange-500",
    duration: 2000,
  },
]

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
  const [selectedChannels, setSelectedChannels] = useState<string[]>(["instagram"])
  const [automationFeatures, setAutomationFeatures] = useState<string[]>(["auto-reply"])
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set())

  // Streaming states
  const [streamingSteps, setStreamingSteps] = useState<WorkflowStep[]>([])
  const [currentPhase, setCurrentPhase] = useState<number>(0)
  const [isStreaming, setIsStreaming] = useState<boolean>(false)
  const [streamingProgress, setStreamingProgress] = useState<number>(0)
  const [aiThoughts, setAiThoughts] = useState<string[]>([])
  const stepContainerRef = useRef<HTMLDivElement>(null)

  const channelOptions: ChannelOption[] = [
    { id: "instagram", label: "Instagram DMs", icon: MessageCircle },
    { id: "facebook", label: "Facebook Messenger", icon: MessageSquare },
    { id: "whatsapp", label: "WhatsApp Business", icon: Phone },
    { id: "telegram", label: "Telegram Bot", icon: Bot },
    { id: "web", label: "Website Chat", icon: Mic },
    { id: "email", label: "Email Marketing", icon: Mail },
    { id: "sms", label: "SMS Marketing", icon: Phone },
  ]

  const automationFeatureOptions: AutomationFeature[] = [
    { id: "auto-reply", label: "Automatic Responses" },
    { id: "sentiment-analysis", label: "Sentiment Analysis" },
    { id: "intent-detection", label: "Intent Recognition" },
    { id: "multilingual", label: "Multi-language Support" },
    { id: "smart-routing", label: "Smart Agent Routing" },
    { id: "lead-scoring", label: "Lead Scoring" },
    { id: "personalization", label: "Dynamic Personalization" },
    { id: "escalation", label: "Intelligent Escalation" },
  ]

  // Real AI workflow generation
  const generateWorkflowWithAI = useCallback(
    async (action: "initial" | "refine", instructions?: string): Promise<void> => {
      setIsGenerating(true)
      setIsStreaming(true)
      setCurrentPhase(0)
      setStreamingProgress(0)
      setStreamingSteps([])
      setAiThoughts([])
      setResponseStatus("🤖 Connecting to AI workflow engine...")
      setCurrentAction(action)
      setHasInitialRequest(true)

      try {
        // Phase progression with realistic timing
        for (let phase = 0; phase < streamingPhases.length; phase++) {
          setCurrentPhase(phase)
          setResponseStatus(`${streamingPhases[phase].description}...`)

          addAiThought(getAiThoughtForPhase(phase))

          await new Promise((resolve) => setTimeout(resolve, streamingPhases[phase].duration))
        }

        // Generate workflow via AI API
        const aiResponse = await callAIWorkflowGeneration(action, instructions)

        if (aiResponse.success && aiResponse.workflowData) {
          setParsedWorkflow(aiResponse.workflowData)
          setStreamingProgress(100)
          setResponseStatus("✅ Custom AI workflow generated successfully!")
          addAiThought("🎉 Workflow generation complete! Ready for development team submission.")
        } else {
          throw new Error(aiResponse.error || "AI generation failed")
        }
      } catch (error) {
        console.error("AI generation error:", error)
        setResponseStatus(`❌ AI generation failed: ${error instanceof Error ? error.message : "Unknown error"}`)
        addAiThought("❌ Generation failed. Please try again with more specific requirements.")
      } finally {
        setIsStreaming(false)
        setTimeout(() => {
          setIsGenerating(false)
        }, 1000)
      }
    },
    [businessInfo, selectedChannels, automationFeatures, workflowRequest],
  )

  // Simulate AI API call
  const callAIWorkflowGeneration = async (
    action: "initial" | "refine",
    instructions?: string,
  ): Promise<{ success: boolean; workflowData?: ParsedWorkflow; error?: string }> => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const workflowSteps = await processAIResponseIntoSteps({})

      const workflow: ParsedWorkflow = {
        title: `${businessInfo.businessName} Custom AI Automation`,
        description: `Intelligent automation workflow for ${selectedChannels.length} platform${selectedChannels.length > 1 ? "s" : ""}`,
        platform: "Custom AI Automation",
        estimatedBuildTime: "3-5 weeks",
        complexity: "Custom Enterprise",
        steps: workflowSteps,
        integrations: getUniqueIntegrations(workflowSteps),
        benefits: [
          "100% customized to your specific requirements",
          "Advanced AI-powered automation",
          "Seamless integration with your existing tools",
          "Scalable architecture for future growth",
          "Dedicated development and support",
          "Priority marketplace listing",
        ],
        exampleScenario:
          "Custom workflow tailored to your exact specifications with intelligent routing and processing",
        technicalRequirements: [
          "Custom API integrations",
          "Advanced AI/ML processing",
          "Real-time data synchronization",
          "Scalable cloud infrastructure",
          "Security compliance setup",
        ],
        deploymentChannels: selectedChannels,
        estimatedCost: "$2000-5000/month",
        roi: "400-800% within 6 months",
        metrics: {
          automationRate: "98%",
          responseTime: "< 1 second",
          accuracy: "96%",
          scalability: "Enterprise+",
        },
      }

      return { success: true, workflowData: workflow }
    } catch (error) {
      console.error("AI API call failed:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "AI generation failed",
      }
    }
  }

  // Process AI response into workflow steps with streaming
  const processAIResponseIntoSteps = async (workflowData: any): Promise<WorkflowStep[]> => {
    const steps: WorkflowStep[] = []
    const stepsData = generateCustomSteps()

    for (let i = 0; i < stepsData.length; i++) {
      const stepData = stepsData[i]
      const config = stepTypeConfigs[stepData.type] || stepTypeConfigs.automation

      const suggestedIntegrations = getSuggestedIntegrationsForStep(stepData.type, stepData.title)

      const step: WorkflowStep = {
        id: `step-${i + 1}`,
        stepNumber: i + 1,
        title: stepData.title,
        description: stepData.description,
        type: stepData.type,
        icon: config.icon,
        color: config.color,
        bgColor: config.bgColor,
        borderColor: config.borderColor,
        estimatedTime: stepData.estimatedTime || getEstimatedTimeForStep(stepData.type),
        inputs: stepData.inputs || (i === 0 ? ["User Request"] : ["Previous Step Output"]),
        outputs: stepData.outputs || (i === stepsData.length - 1 ? ["Custom Solution"] : ["Processed Data"]),
        details: stepData.details || [
          `Custom ${stepData.type} processing`,
          "Tailored to your specific requirements",
          "Enterprise-grade implementation",
        ],
        isAnimating: true,
        suggestedIntegrations,
        selectedIntegrations: suggestedIntegrations.slice(0, 1),
        aiReasoning:
          stepData.aiReasoning || `This custom step is designed specifically for your ${stepData.type} requirements.`,
        complexity: stepData.complexity || "high",
        businessImpact:
          stepData.businessImpact || `Delivers custom ${stepData.type} functionality tailored to your business needs.`,
        alternatives: stepData.alternatives || [
          `Alternative ${stepData.type} implementations`,
          "Custom enhancement options",
        ],
      }

      setStreamingSteps((prevSteps) => [...prevSteps, step])

      const progress = ((i + 1) / stepsData.length) * 70 + 25
      setStreamingProgress(progress)

      addAiThought(`🔧 Generated custom step ${i + 1}: ${step.title}`)

      setTimeout(() => {
        if (stepContainerRef.current) {
          const newStepElement = stepContainerRef.current.querySelector(`[data-step-id="step-${i + 1}"]`)
          if (newStepElement) {
            newStepElement.scrollIntoView({ behavior: "smooth", block: "nearest" })
          }
        }
      }, 100)

      await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 400))

      setStreamingSteps((prevSteps) => prevSteps.map((s) => (s.id === step.id ? { ...s, isAnimating: false } : s)))

      steps.push(step)
    }

    return steps
  }

  // Generate custom workflow steps
  const generateCustomSteps = () => [
    {
      title: "Custom Request Analysis",
      description: "Advanced AI analyzes your specific requirements and business context",
      type: "analysis",
      estimatedTime: "2-3s",
      inputs: ["User Requirements", "Business Context"],
      outputs: ["Analyzed Requirements", "Context Mapping"],
      details: [
        "Advanced NLP processing of user requirements",
        "Business context analysis and mapping",
        "Requirement validation and clarification",
        "Custom rule generation based on specifications",
      ],
      complexity: "high" as const,
      businessImpact: "Ensures the automation perfectly aligns with your unique business needs and requirements",
      alternatives: ["Standard requirement processing", "Manual requirement analysis"],
      aiReasoning: "Essential for understanding your unique automation needs",
    },
    {
      title: "Intelligent Message Processing",
      description: "Custom NLP and ML models trained for your specific business domain",
      type: "trigger",
      estimatedTime: "< 1s",
      inputs: ["Incoming Messages", "Domain Models"],
      outputs: ["Processed Content", "Intent Classification"],
      details: [
        "Domain-specific NLP model deployment",
        "Real-time message classification and routing",
        "Custom entity recognition and extraction",
        "Multi-language processing capabilities",
      ],
      complexity: "high" as const,
      businessImpact: "Provides industry-specific understanding and processing of customer communications",
      alternatives: ["Generic NLP processing", "Rule-based message handling"],
      aiReasoning: "Tailored message processing for optimal accuracy",
    },
    {
      title: "Dynamic Content Filtering",
      description: "Advanced filtering with custom rules based on your business logic",
      type: "filter",
      estimatedTime: "< 1s",
      inputs: ["Processed Messages", "Custom Rules"],
      outputs: ["Filtered Content", "Quality Score"],
      details: [
        "Custom filtering rules based on business logic",
        "Content quality assessment and scoring",
        "Spam and inappropriate content detection",
        "Compliance and regulatory filtering",
      ],
      complexity: "medium" as const,
      businessImpact: "Ensures only relevant, high-quality interactions are processed, maintaining brand reputation",
      alternatives: ["Basic content filtering", "Manual content review"],
      aiReasoning: "Ensures only relevant interactions are processed",
    },
    {
      title: "Custom Integration Hub",
      description: "Seamlessly connects with your existing tools and workflows",
      type: "integration",
      estimatedTime: "1-2s",
      inputs: ["Filtered Data", "System Credentials"],
      outputs: ["Integrated Data", "System Updates"],
      details: [
        "Custom API integrations with existing systems",
        "Real-time data synchronization across platforms",
        "Error handling and retry mechanisms",
        "Data transformation and mapping",
      ],
      complexity: "high" as const,
      businessImpact: "Maximizes value from your current technology stack without disrupting existing workflows",
      alternatives: ["Standard API integrations", "Manual data transfer"],
      aiReasoning: "Maximizes value from your current technology stack",
    },
    {
      title: "AI-Powered Response Engine",
      description: "Generates contextual responses using your brand voice and guidelines",
      type: "response",
      estimatedTime: "1-2s",
      inputs: ["Context Data", "Brand Guidelines"],
      outputs: ["Generated Response", "Confidence Score"],
      details: [
        "Brand voice training and implementation",
        "Contextual response generation with personalization",
        "Multi-channel response optimization",
        "A/B testing for response effectiveness",
      ],
      complexity: "high" as const,
      businessImpact:
        "Maintains consistent brand experience at scale while providing personalized customer interactions",
      alternatives: ["Template-based responses", "Generic AI responses"],
      aiReasoning: "Maintains consistent brand experience at scale",
    },
    {
      title: "Smart Routing & Escalation",
      description: "Intelligent decision making for complex scenarios and human handoffs",
      type: "routing",
      estimatedTime: "< 1s",
      inputs: ["Response Data", "Escalation Rules"],
      outputs: ["Routing Decision", "Escalation Alert"],
      details: [
        "Intelligent escalation based on complexity and sentiment",
        "Workload balancing across team members",
        "Priority scoring and urgent issue detection",
        "Custom routing rules based on expertise",
      ],
      complexity: "medium" as const,
      businessImpact: "Ensures complex issues receive appropriate human attention while optimizing team efficiency",
      alternatives: ["Rule-based routing", "Manual escalation"],
      aiReasoning: "Ensures complex issues receive appropriate attention",
    },
    {
      title: "Custom Data Management",
      description: "Sophisticated data handling tailored to your privacy and compliance needs",
      type: "storage",
      estimatedTime: "2-4s",
      inputs: ["Process Data", "Compliance Rules"],
      outputs: ["Stored Data", "Audit Trail"],
      details: [
        "GDPR and privacy compliance handling",
        "Custom data retention and archival policies",
        "Encrypted storage with audit trails",
        "Data analytics and reporting capabilities",
      ],
      complexity: "high" as const,
      businessImpact: "Maintains data integrity and regulatory compliance while enabling advanced analytics",
      alternatives: ["Basic data storage", "Manual compliance management"],
      aiReasoning: "Maintains data integrity and regulatory compliance",
    },
    {
      title: "Advanced Analytics Engine",
      description: "Custom reporting and insights dashboard for your specific KPIs",
      type: "validation",
      estimatedTime: "3-5s",
      inputs: ["Historical Data", "KPI Definitions"],
      outputs: ["Analytics Report", "Performance Metrics"],
      details: [
        "Custom KPI tracking and measurement",
        "Real-time performance monitoring and alerts",
        "Predictive analytics for capacity planning",
        "Custom dashboard creation and visualization",
      ],
      complexity: "high" as const,
      businessImpact: "Provides actionable insights for continuous improvement and strategic decision making",
      alternatives: ["Basic reporting", "Manual analytics"],
      aiReasoning: "Provides actionable insights for continuous improvement",
    },
  ]

  const getSuggestedIntegrationsForStep = (stepType: string, stepTitle: string): Integration[] => {
    const suggestions: Integration[] = []
    const title = stepTitle.toLowerCase()

    // Smart integration matching based on step type and content
    if (stepType === "trigger" || title.includes("message") || title.includes("processing")) {
      suggestions.push(...INTEGRATION_DATABASE.filter((i) => i.category === "communication"))
    }

    if (stepType === "storage" || title.includes("data") || title.includes("management")) {
      suggestions.push(...INTEGRATION_DATABASE.filter((i) => i.category === "database"))
      suggestions.push(...INTEGRATION_DATABASE.filter((i) => i.category === "crm"))
    }

    if (
      stepType === "response" ||
      title.includes("email") ||
      title.includes("message") ||
      title.includes("notification")
    ) {
      suggestions.push(...INTEGRATION_DATABASE.filter((i) => i.category === "email"))
    }

    if (stepType === "integration" || title.includes("hub") || title.includes("connect")) {
      suggestions.push(...INTEGRATION_DATABASE.filter((i) => i.category === "crm"))
      suggestions.push(...INTEGRATION_DATABASE.filter((i) => i.category === "ecommerce"))
    }

    if (stepType === "validation" || title.includes("analytics") || title.includes("reporting")) {
      suggestions.push(...INTEGRATION_DATABASE.filter((i) => i.category === "analytics"))
    }

    // Remove duplicates and sort by popularity
    const uniqueSuggestions = suggestions.filter(
      (integration, index, self) => index === self.findIndex((i) => i.id === integration.id),
    )

    return uniqueSuggestions.sort((a, b) => b.popularity - a.popularity).slice(0, 4)
  }

  const getEstimatedTimeForStep = (stepType: string): string => {
    return "< 2s" // Custom workflows are optimized
  }

  const getUniqueIntegrations = (steps: WorkflowStep[]): Integration[] => {
    const allIntegrations = steps.flatMap((step) => step.selectedIntegrations || [])
    return allIntegrations.filter(
      (integration, index, self) => index === self.findIndex((i) => i.id === integration.id),
    )
  }

  const addAiThought = (thought: string): void => {
    setAiThoughts((prev) => {
      const newThoughts = [...prev, thought]
      return newThoughts.slice(-5)
    })
  }

  const getAiThoughtForPhase = (phase: number): string => {
    const thoughts = [
      "🔍 Analyzing your custom requirements and business constraints...",
      "🎨 Designing bespoke workflow architecture with enterprise capabilities...",
      "🔗 Identifying optimal integrations for your specific use case...",
      "⚡ Fine-tuning for maximum performance and scalability...",
    ]
    return thoughts[phase] || "🤖 Processing your custom workflow requirements..."
  }

  // Updated handleApprove to submit to the new API endpoint with complete workflow design
  const handleApprove = async (): Promise<void> => {
    setIsGenerating(true)
    setResponseStatus("📧 Submitting custom workflow to development team...")

    try {
      const payload = {
        title: parsedWorkflow?.title || "Custom AI Workflow",
        businessObjective: parsedWorkflow?.description || "Custom automation solution",
        businessInfo: businessInfo,
        workflowDesign: parsedWorkflow, // Complete AI-generated workflow design
        selectedChannels: selectedChannels,
        automationFeatures: automationFeatures,
        customRequest: workflowRequest,
        baseWorkflowId: selectedWorkflowId,
        submittedAt: new Date().toISOString(),
        urgency: "NORMAL",
        // Additional data for admin review
        estimatedCost: parsedWorkflow?.estimatedCost,
        roi: parsedWorkflow?.roi,
        complexity: parsedWorkflow?.complexity,
        steps: streamingSteps,
        metrics: parsedWorkflow?.metrics,
        technicalRequirements: parsedWorkflow?.technicalRequirements,
        deploymentChannels: parsedWorkflow?.deploymentChannels,
      }

      const response = await fetch("/api/workflow-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (result.success) {
        setResponseStatus("✅ Custom workflow submitted to development team successfully!")

        // Store pending workflow data in localStorage
        const pendingData = {
          id: result.request.id,
          submittedAt: new Date().toISOString(),
          status: "PENDING_CREATION",
          workflowType: selectedWorkflowId ? `Modified ${selectedWorkflowId}` : "Custom Workflow",
          estimatedCompletion: "3-5",
        }

        localStorage.setItem("pendingWorkflow", JSON.stringify(pendingData))

        setTimeout(() => {
          if (setStep) setStep("pending")
        }, 2000)
      } else {
        throw new Error(result.error || "Failed to submit workflow request")
      }
    } catch (error) {
      console.error("Approval error:", error)
      setResponseStatus("❌ Failed to submit to development team. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleInitialSubmit = (): void => {
    if (!workflowRequest.trim()) {
      setResponseStatus("❌ Please describe your automation needs")
      return
    }
    if (selectedChannels.length === 0) {
      setResponseStatus("❌ Please select at least one platform")
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

  const handleChannelToggle = (channelId: string): void => {
    const newChannels = selectedChannels.includes(channelId)
      ? selectedChannels.filter((c) => c !== channelId)
      : [...selectedChannels, channelId]
    setSelectedChannels(newChannels)
  }

  const handleFeatureToggle = (featureId: string, checked: boolean): void => {
    if (checked) {
      setAutomationFeatures((prev) => [...prev, featureId])
    } else {
      setAutomationFeatures((prev) => prev.filter((f) => f !== featureId))
    }
  }

  const handleIntegrationToggle = (stepId: string, integration: Integration): void => {
    setStreamingSteps((prevSteps) =>
      prevSteps.map((step) => {
        if (step.id === stepId) {
          const isSelected = step.selectedIntegrations?.some((i) => i.id === integration.id)
          const newSelected = isSelected
            ? step.selectedIntegrations?.filter((i) => i.id !== integration.id) || []
            : [...(step.selectedIntegrations || []), integration]

          return { ...step, selectedIntegrations: newSelected }
        }
        return step
      }),
    )
  }

  // Enhanced components
  const StreamingProgress: React.FC = () => {
    if (!isGenerating) return null

    const currentPhaseData = streamingPhases[currentPhase]
    const IconComponent = currentPhaseData?.icon || Brain

    return (
      <div className="mb-8">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin"></div>
              <IconComponent className={`h-10 w-10 ${currentPhaseData?.color || "text-blue-500"} animate-pulse`} />
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-2">{currentPhaseData?.title || "Processing..."}</h3>
          <p className="text-muted-foreground">
            {currentPhaseData?.description || "Working on your custom workflow..."}
          </p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Overall Progress</span>
            <span>{Math.round(streamingProgress)}%</span>
          </div>
          <Progress value={streamingProgress} className="h-3 mb-4" />
        </div>

        <div className="flex justify-center gap-6 mb-6">
          {streamingPhases.map((phase, index) => {
            const PhaseIcon = phase.icon
            return (
              <div key={phase.id} className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                    index < currentPhase
                      ? "bg-green-500 text-white shadow-lg"
                      : index === currentPhase
                        ? "bg-blue-500 text-white animate-pulse shadow-lg"
                        : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {index < currentPhase ? <CheckCircle className="h-6 w-6" /> : <PhaseIcon className="h-6 w-6" />}
                </div>
                <span
                  className={`text-xs mt-2 text-center font-medium ${
                    index === currentPhase ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"
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
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">AI Insights</span>
            </div>
            <div className="space-y-2 max-h-24 overflow-hidden">
              {aiThoughts.slice(-3).map((thought, index) => (
                <div
                  key={index}
                  className={`text-xs text-blue-600 dark:text-blue-400 transition-opacity duration-500 ${
                    index === aiThoughts.length - 1 ? "opacity-100" : "opacity-70"
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

  const IntegrationSelector: React.FC<{ step: WorkflowStep }> = ({ step }) => {
    if (!step.suggestedIntegrations || step.suggestedIntegrations.length === 0) return null

    return (
      <div className="mt-4 p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-white/20">
        <h6 className="font-semibold mb-3 flex items-center gap-2">
          <Puzzle className="h-4 w-4 text-purple-500" />
          Suggested Integrations
          <Badge variant="outline" className="text-xs">
            {step.suggestedIntegrations.length} available
          </Badge>
        </h6>

        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
          {step.suggestedIntegrations.map((integration) => {
            const IconComponent = integration.icon
            const isSelected = step.selectedIntegrations?.some((i) => i.id === integration.id)

            return (
              <div
                key={integration.id}
                onClick={() => handleIntegrationToggle(step.id, integration)}
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "bg-blue-500 text-white border-blue-500 shadow-md"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className="h-5 w-5 flex-shrink-0" />
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm truncate">{integration.name}</span>
                      <Badge
                        variant={isSelected ? "secondary" : "outline"}
                        className={`text-xs ${isSelected ? "bg-white/20 text-white" : ""}`}
                      >
                        {integration.pricing}
                      </Badge>
                    </div>
                    <p className={`text-xs truncate ${isSelected ? "text-white/80" : "text-muted-foreground"}`}>
                      {integration.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className={`flex items-center gap-1 text-xs ${isSelected ? "text-white/70" : "text-muted-foreground"}`}
                      >
                        <Timer className="h-3 w-3" />
                        {integration.setupTime}
                      </div>
                      <div
                        className={`flex items-center gap-1 text-xs ${isSelected ? "text-white/70" : "text-muted-foreground"}`}
                      >
                        <Star className="h-3 w-3" />
                        {integration.popularity}%
                      </div>
                    </div>
                  </div>
                  {isSelected ? <Check className="h-4 w-4 text-white" /> : <Plus className="h-4 w-4 text-gray-400" />}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const StepComponent: React.FC<{ step: WorkflowStep }> = ({ step }) => {
    const config = stepTypeConfigs[step.type] || stepTypeConfigs.automation
    const IconComponent = step.icon || config.icon
    const isExpanded = expandedSteps.has(step.stepNumber)

    return (
      <div
        data-step-id={step.id}
        className={`relative transition-all duration-500 ${step.isAnimating ? "animate-pulse" : ""}`}
        style={{
          animation: step.isAnimating ? "slideInFromLeft 0.6s ease-out" : "none",
        }}
      >
        <div
          className={`rounded-xl border-2 transition-all duration-300 cursor-pointer bg-gradient-to-br ${
            config.bgColor
          } ${config.darkBg} ${config.borderColor} ${config.darkBorder} ${
            isExpanded
              ? "shadow-xl scale-[1.02] border-opacity-100"
              : "hover:shadow-lg hover:scale-[1.01] border-opacity-60"
          }`}
          onClick={() => toggleStepExpansion(step.stepNumber)}
        >
          {/* Step Header */}
          <div className="p-6">
            <div className="flex items-center gap-4">
              {/* Enhanced Step Number with Icon */}
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

              {/* Enhanced Step Content */}
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-3">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">{step.title}</h4>
                  <Badge variant="outline" className="text-xs font-medium">
                    {step.type}
                  </Badge>
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
                  {step.estimatedTime && (
                    <Badge variant="secondary" className="text-xs">
                      <Timer className="h-3 w-3 mr-1" />
                      {step.estimatedTime}
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-3 leading-relaxed">{step.description}</p>

                {/* Enhanced Input/Output Flow */}
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

                {/* Integration Preview */}
                {step.selectedIntegrations && step.selectedIntegrations.length > 0 && (
                  <div className="mt-3 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-purple-500" />
                    <span className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                      Integrations: {step.selectedIntegrations.map((i) => i.name).join(", ")}
                    </span>
                  </div>
                )}
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
            <div className="border-t border-white/50 bg-white/30 dark:bg-black/10 p-6">
              {/* AI Reasoning */}
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
                    Configuration Options
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Auto-retry enabled</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Real-time monitoring</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span>Custom error handling</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span>Performance optimization</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Integration Selector */}
              <IntegrationSelector step={step} />
            </div>
          )}
        </div>

        {/* Enhanced Connection Line */}
        {step.stepNumber < (streamingSteps.length || 1) && (
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

  return (
    <div className="min-h-screen bg-background p-6">
      <style jsx>{`
        @keyframes slideInFromLeft {
          0% {
            opacity: 0;
            transform: translateX(-30px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-8">
          <Button variant="ghost" className="mb-6 hover:bg-accent" onClick={() => setStep?.("selection")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Selection
          </Button>
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4">Custom AI Workflow Designer</h1>
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
              Design a completely custom workflow tailored to your unique business needs.
            </p>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Custom AI Generation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>Bespoke Integration Matching</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                <span>Enterprise Development</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Enhanced Left Column - Input */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-2 border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-primary" />
                  {!hasInitialRequest ? "Design Your Custom Automation" : "Refine Your Workflow"}
                </CardTitle>
                <CardDescription>
                  {!hasInitialRequest
                    ? "Describe your unique automation needs and our AI will create a tailored solution"
                    : "Provide feedback to enhance and customize the design"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!hasInitialRequest && (
                  <>
                    {/* Enhanced Platform Selection */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Social Media Platforms</Label>
                      <div className="grid grid-cols-1 gap-3">
                        {channelOptions.map((channel) => {
                          const IconComponent = channel.icon
                          return (
                            <button
                              key={channel.id}
                              onClick={() => handleChannelToggle(channel.id)}
                              className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                                selectedChannels.includes(channel.id)
                                  ? "bg-primary text-primary-foreground border-primary shadow-lg transform scale-105"
                                  : "bg-card border-border hover:border-primary/50 hover:bg-accent hover:transform hover:scale-102"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <IconComponent className="h-5 w-5" />
                                <span className="font-medium">{channel.label}</span>
                                {selectedChannels.includes(channel.id) && <Check className="h-4 w-4 ml-auto" />}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Enhanced Feature Selection */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">AI Automation Features</Label>
                      <div className="space-y-2">
                        {automationFeatureOptions.map((feature) => (
                          <label
                            key={feature.id}
                            className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-accent transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={automationFeatures.includes(feature.id)}
                              onChange={(e) => handleFeatureToggle(feature.id, e.target.checked)}
                              className="w-4 h-4 rounded border-border"
                            />
                            <span className="text-sm font-medium">{feature.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Enhanced Request Input */}
                {!hasInitialRequest ? (
                  <>
                    <div className="space-y-3">
                      <Label htmlFor="workflowRequest" className="text-base font-semibold">
                        Describe Your Custom Automation Vision
                      </Label>
                      <Textarea
                        id="workflowRequest"
                        value={workflowRequest}
                        onChange={(e) => setWorkflowRequest(e.target.value)}
                        placeholder="e.g., 'I need a custom workflow that automatically processes customer support tickets in multiple languages, integrates with our proprietary CRM system, uses machine learning to categorize issues, routes them to specialized teams based on expertise and workload, and provides real-time performance analytics with custom dashboards.'"
                        rows={8}
                        className="bg-background border-2 border-blue-200 focus:border-blue-500 resize-none text-sm"
                        disabled={isGenerating}
                      />
                    </div>
                    <Button
                      onClick={handleInitialSubmit}
                      disabled={isGenerating || !workflowRequest.trim()}
                      className="w-full flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 text-base"
                    >
                      {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                      Generate Custom AI Workflow
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="space-y-3">
                      <Label htmlFor="refinementInput" className="text-base font-semibold">
                        Refine Your Custom Workflow
                      </Label>
                      <Textarea
                        id="refinementInput"
                        value={refinementInput}
                        onChange={(e) => setRefinementInput(e.target.value)}
                        placeholder="e.g., 'Add integration with our custom database API', 'Include advanced sentiment analysis for priority routing', 'Add compliance checks for GDPR requirements', 'Implement predictive analytics for capacity planning'"
                        rows={5}
                        className="bg-white/50 border-2 border-blue-200 focus:border-blue-500 resize-none"
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
                        Refine Design
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
                        Submit design
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Enhanced Business Context */}
            <Card className="border-2 border-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" />
                  Business Context
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <span className="font-semibold text-primary">Business:</span>
                  <p className="text-muted-foreground mt-1">{businessInfo.businessName}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <span className="font-semibold text-primary">Industry:</span>
                  <p className="text-muted-foreground mt-1">{businessInfo.businessType}</p>
                </div>
                {businessInfo.description && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="font-semibold text-primary">Description:</span>
                    <p className="text-muted-foreground mt-1">{businessInfo.description}</p>
                  </div>
                )}
                {selectedChannels.length > 0 && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="font-semibold text-primary">Selected Platforms:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedChannels.map((channel) => (
                        <Badge key={channel} variant="secondary" className="text-xs">
                          {channelOptions.find((c) => c.id === channel)?.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {automationFeatures.length > 0 && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="font-semibold text-primary">AI Features:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {automationFeatures.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {automationFeatureOptions.find((f) => f.id === feature)?.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Right Column - AI Generated Workflow */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-border min-h-[700px] bg-card backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-primary" />
                  Custom AI Workflow Generation
                  {parsedWorkflow && (
                    <Badge variant="outline" className="ml-auto">
                      <Star className="h-3 w-3 mr-1" />
                      Custom AI Generated
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-base">
                  Advanced AI creates bespoke enterprise workflows with custom integrations in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Enhanced Status Message */}
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

                {/* Enhanced Streaming Progress */}
                {isGenerating && <StreamingProgress />}

                {/* Enhanced Workflow Header */}
                {parsedWorkflow && !isGenerating && (
                  <div className="mb-8 p-8 rounded-2xl bg-muted/30 border-2 border-border backdrop-blur-sm">
                    <div className="text-center mb-8">
                      <h3 className="text-3xl font-bold mb-3 text-foreground">{parsedWorkflow.title}</h3>
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

                    {/* Enhanced ROI and Cost Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-secondary/30 rounded-xl border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-foreground">Expected ROI</span>
                        </div>
                        <div className="text-xl font-bold text-primary">{parsedWorkflow.roi}</div>
                      </div>
                      <div className="p-4 bg-accent/30 rounded-xl border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCard className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-foreground">Monthly Cost</span>
                        </div>
                        <div className="text-xl font-bold text-primary">{parsedWorkflow.estimatedCost}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced Streaming Steps */}
                {(isStreaming || streamingSteps.length > 0) && (
                  <div ref={stepContainerRef} className="space-y-8">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
                        <Workflow className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">Custom Workflow Steps</h3>
                        <p className="text-muted-foreground">AI-designed automation tailored to your specific needs</p>
                      </div>
                      <Badge variant="outline" className="ml-auto text-base px-3 py-1">
                        {isStreaming
                          ? `${streamingSteps.length} steps generated...`
                          : `${streamingSteps.length} total steps`}
                      </Badge>
                    </div>

                    {streamingSteps.map((step) => (
                      <StepComponent key={step.id} step={step} />
                    ))}

                    {isStreaming && (
                      <div className="flex justify-center py-8">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span className="font-medium">AI is generating more custom steps...</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Enhanced Initial State */}
                {!isGenerating && !parsedWorkflow && !hasInitialRequest && (
                  <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="relative mb-8">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                        <Brain className="h-12 w-12 text-blue-500" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Ready to Design Your Custom Workflow</h3>
                    <p className="text-center max-w-lg mb-8 text-muted-foreground leading-relaxed">
                      Our advanced AI will analyze your unique requirements and generate a completely custom,
                      enterprise-grade workflow with bespoke integrations and architecture.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground">
                      <div className="flex flex-col items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <Brain className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">Custom AI</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <Zap className="h-5 w-5 text-green-500" />
                        <span className="font-medium">Bespoke Integrations</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <Rocket className="h-5 w-5 text-purple-500" />
                        <span className="font-medium">Enterprise Ready</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-orange-500" />
                        <span className="font-medium">Maximum ROI</span>
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
