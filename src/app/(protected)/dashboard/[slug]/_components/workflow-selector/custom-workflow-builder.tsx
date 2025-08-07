
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

//   // Updated handleApprove to submit to the new API endpoint with complete workflow design
//   const handleApprove = async (): Promise<void> => {
//     setIsGenerating(true)
//     setResponseStatus("📧 Submitting custom workflow to development team...")

//     try {
//       const payload = {
//         title: parsedWorkflow?.title || "Custom AI Workflow",
//         businessObjective: parsedWorkflow?.description || "Custom automation solution",
//         businessInfo: businessInfo,
//         workflowDesign: parsedWorkflow, // Complete AI-generated workflow design
//         selectedChannels: selectedChannels,
//         automationFeatures: automationFeatures,
//         customRequest: workflowRequest,
//         baseWorkflowId: selectedWorkflowId,
//         submittedAt: new Date().toISOString(),
//         urgency: "NORMAL",
//         // Additional data for admin review
//         estimatedCost: parsedWorkflow?.estimatedCost,
//         roi: parsedWorkflow?.roi,
//         complexity: parsedWorkflow?.complexity,
//         steps: streamingSteps,
//         metrics: parsedWorkflow?.metrics,
//         technicalRequirements: parsedWorkflow?.technicalRequirements,
//         deploymentChannels: parsedWorkflow?.deploymentChannels,
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
// import { ArrowLeft, Sparkles, Loader2, CheckCircle, Settings, ThumbsUp, MessageCircle, RefreshCw, Zap, AlertCircle, PlayCircle, Workflow, ChevronDown, ChevronRight, Database, Filter, Mail, Star, Brain, Layers, Wand2, Check, Link2, Instagram, FileSpreadsheet, FileText, Users, Target, MessageSquare, Heart, UserPlus, ShoppingBag, Calendar } from 'lucide-react'

// import { generateText } from 'ai'
// import { openai } from '@ai-sdk/openai'

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

// // AI Processing phases
// const streamingPhases: StreamingPhase[] = [
//   {
//     id: "understanding",
//     title: "Analyzing Instagram Requirements",
//     description: "Understanding your Instagram automation needs and business goals",
//     icon: Instagram,
//     color: "text-pink-500",
//     duration: 2000,
//   },
//   {
//     id: "designing",
//     title: "Designing Voiceflow Architecture",
//     description: "Creating workflow logic compatible with Voiceflow blocks",
//     icon: Workflow,
//     color: "text-blue-500",
//     duration: 3000,
//   },
//   {
//     id: "integrations",
//     title: "Assigning Integrations",
//     description: "Matching your selected tools to workflow steps",
//     icon: Link2,
//     color: "text-green-500",
//     duration: 2000,
//   },
//   {
//     id: "optimizing",
//     title: "Optimizing for Instagram",
//     description: "Fine-tuning for Instagram DM automation",
//     icon: Target,
//     color: "text-purple-500",
//     duration: 1500,
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
//   const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set())

//   // New state for integration selection
//   const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])
//   const [selectedOperations, setSelectedOperations] = useState<Record<string, string[]>>({})

//   // Streaming states
//   const [streamingSteps, setStreamingSteps] = useState<WorkflowStep[]>([])
//   const [currentPhase, setCurrentPhase] = useState<number>(0)
//   const [isStreaming, setIsStreaming] = useState<boolean>(false)
//   const [streamingProgress, setStreamingProgress] = useState<number>(0)
//   const [aiThoughts, setAiThoughts] = useState<string[]>([])
//   const stepContainerRef = useRef<HTMLDivElement>(null)

//   // Instagram-specific automation goals
//   const instagramGoals = [
//     { id: "lead-generation", label: "Lead Generation from DMs", icon: UserPlus },
//     { id: "customer-support", label: "Customer Support Automation", icon: MessageSquare },
//     { id: "product-inquiries", label: "Product Inquiry Handling", icon: ShoppingBag },
//     { id: "appointment-booking", label: "Appointment/Consultation Booking", icon: Calendar },
//     { id: "content-engagement", label: "Content Engagement Responses", icon: Heart },
//     { id: "influencer-outreach", label: "Influencer/Partnership Outreach", icon: Users },
//   ]

//   const [selectedGoals, setSelectedGoals] = useState<string[]>(["customer-support"])

//   // Enhanced workflow generation with integration constraints
//   const generateWorkflowWithAI = useCallback(
//     async (action: "initial" | "refine", instructions?: string): Promise<void> => {
//       setIsGenerating(true)
//       setIsStreaming(true)
//       setCurrentPhase(0)
//       setStreamingProgress(0)
//       setStreamingSteps([])
//       setAiThoughts([])
//       setResponseStatus("🤖 Connecting to Instagram automation AI...")
//       setCurrentAction(action)
//       setHasInitialRequest(true)

//       try {
//         // Phase progression
//         for (let phase = 0; phase < streamingPhases.length; phase++) {
//           setCurrentPhase(phase)
//           setResponseStatus(`${streamingPhases[phase].description}...`)
//           addAiThought(getAiThoughtForPhase(phase))
//           await new Promise((resolve) => setTimeout(resolve, streamingPhases[phase].duration))
//         }

//         // Generate workflow
//         const aiResponse = await callAIWorkflowGeneration(action, instructions)

//         if (aiResponse.success && aiResponse.workflowData) {
//           setParsedWorkflow(aiResponse.workflowData)
//           setStreamingProgress(100)
//           setResponseStatus("✅ Instagram automation workflow generated!")
//           addAiThought("🎉 Workflow ready for Voiceflow implementation!")
//         } else {
//           throw new Error(aiResponse.error || "AI generation failed")
//         }
//       } catch (error) {
//         console.error("AI generation error:", error)
//         setResponseStatus(`❌ Generation failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//         addAiThought("❌ Generation failed. Please try again.")
//       } finally {
//         setIsStreaming(false)
//         setTimeout(() => {
//           setIsGenerating(false)
//         }, 1000)
//       }
//     },
//     [businessInfo, selectedIntegrations, selectedOperations, selectedGoals, workflowRequest],
//   )

//   // Simulate AI API call with integration constraints
//   const callAIWorkflowGeneration = async (
//     action: "initial" | "refine",
//     instructions?: string,
//   ): Promise<{ success: boolean; workflowData?: ParsedWorkflow; error?: string }> => {
//   try {
//     // Prepare context for AI
//     const selectedIntegrationDetails = selectedIntegrations.map(id => 
//       SUPPORTED_INTEGRATIONS.find(int => int.id === id)
//     ).filter(Boolean)

//     const selectedGoalDetails = selectedGoals.map(id => 
//       instagramGoals.find(goal => goal.id === id)
//     ).filter(Boolean)

//     const prompt = action === "initial" 
//       ? `Create a custom Instagram DM automation workflow for ${businessInfo.businessName} (${businessInfo.businessType}).

// User Requirements: "${workflowRequest}"

// Selected Automation Goals: ${selectedGoalDetails.map(g => g?.label).join(', ')}

// Available Integrations: ${selectedIntegrationDetails.map(int => `${int?.name} (${int?.description}) - Operations: ${selectedOperations[int?.id || '']?.join(', ') || 'none selected'}`).join('; ')}

// Business Context: ${businessInfo.description}

// Create 4-7 unique workflow steps that:
// 1. Are specifically designed for Instagram DM automation
// 2. Use the selected integrations strategically (max 1 integration per step, no duplicates)
// 3. Are compatible with Voiceflow blocks
// 4. Address the user's specific requirements
// 5. Follow a logical flow for Instagram customer interactions

// For each step, provide:
// - Unique title
// - Detailed description 
// - Step type (trigger, analysis, filter, response, integration, storage)
// - Specific inputs and outputs
// - 3-4 implementation details
// - Voiceflow block type
// - Business impact explanation
// - Estimated execution time

// Return as JSON with this structure:
// {
//   "title": "workflow title",
//   "description": "workflow description", 
//   "steps": [
//     {
//       "title": "step title",
//       "description": "step description",
//       "type": "step type",
//       "inputs": ["input1", "input2"],
//       "outputs": ["output1", "output2"], 
//       "details": ["detail1", "detail2", "detail3"],
//       "voiceflowBlock": "Voiceflow block type",
//       "businessImpact": "impact explanation",
//       "estimatedTime": "execution time",
//       "needsIntegration": true/false,
//       "complexity": "low/medium/high"
//     }
//   ],
//   "benefits": ["benefit1", "benefit2", "benefit3"],
//   "exampleScenario": "example scenario text"
// }`
//       : `Refine the existing Instagram automation workflow based on this feedback: "${instructions}"

// Current workflow context: ${parsedWorkflow?.title} - ${parsedWorkflow?.description}

// Existing steps: ${streamingSteps.map(s => s.title).join(', ')}

// Provide the same JSON structure with refined/updated steps that address the feedback while maintaining Instagram focus and Voiceflow compatibility.`

//     addAiThought("🤖 Sending requirements to AI for custom workflow generation...")

//     const { text } = await generateText({
//       model: openai('gpt-4o'),
//       prompt,
//       temperature: 0.7,
//     })

//     addAiThought("🧠 AI analyzing requirements and generating custom steps...")

//     // Parse AI response
//     const cleanedText = text.replace(/\`\`\`json\n?|\n?\`\`\`/g, '').trim()
//     const aiResponse = JSON.parse(cleanedText)

//     addAiThought("✨ AI generated unique workflow structure!")

//     // Process the AI-generated steps
//     const workflowSteps = await processAIGeneratedSteps(aiResponse.steps)

//     const workflow: ParsedWorkflow = {
//       title: aiResponse.title || `${businessInfo.businessName} Instagram Automation`,
//       description: aiResponse.description || `Custom Instagram DM automation workflow`,
//       platform: "Instagram DMs via Voiceflow",
//       estimatedBuildTime: "1-2 weeks",
//       complexity: "Custom",
//       steps: workflowSteps,
//       integrations: getAssignedIntegrations(workflowSteps),
//       benefits: aiResponse.benefits || [
//         "Custom AI-generated automation",
//         "Instagram-optimized workflow",
//         "Voiceflow-compatible implementation"
//       ],
//       exampleScenario: aiResponse.exampleScenario || "Custom workflow tailored to your specific requirements",
//       voiceflowFeatures: [
//         "Custom Intent Recognition",
//         "Dynamic Conditional Logic", 
//         "Tailored API Integrations",
//         "Personalized Response Generation"
//       ],
//       instagramFocus: [
//         "Custom DM automation flow",
//         "Personalized customer interactions",
//         "Business-specific automation logic"
//       ],
//       estimatedCost: "$200-500/month",
//       roi: "300-600% within 3 months",
//       metrics: {
//         automationRate: "90%",
//         responseTime: "< 15 seconds", 
//         accuracy: "94%",
//         scalability: "High",
//       },
//     }

//     return { success: true, workflowData: workflow }
//   } catch (error) {
//     console.error("AI generation error:", error)
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "AI generation failed",
//     }
//   }
// }

//   // Process AI response with integration assignment logic
//   const processAIGeneratedSteps = async (aiSteps: any[]): Promise<WorkflowStep[]> => {
//   const steps: WorkflowStep[] = []
//   const availableIntegrations = [...selectedIntegrations]

//   for (let i = 0; i < aiSteps.length; i++) {
//     const aiStep = aiSteps[i]
//     const config = stepTypeConfigs[aiStep.type] || stepTypeConfigs.trigger

//     // Assign integration based on AI recommendation
//     let assignedIntegration: Integration | null = null
//     if (aiStep.needsIntegration && availableIntegrations.length > 0) {
//       const integrationId = availableIntegrations.shift()!
//       assignedIntegration = SUPPORTED_INTEGRATIONS.find((int) => int.id === integrationId) || null
//     }

//     const step: WorkflowStep = {
//       id: `step-${i + 1}`,
//       stepNumber: i + 1,
//       title: aiStep.title,
//       description: aiStep.description,
//       type: aiStep.type,
//       icon: config.icon,
//       color: config.color,
//       bgColor: config.bgColor,
//       borderColor: config.borderColor,
//       estimatedTime: aiStep.estimatedTime || "< 2s",
//       inputs: aiStep.inputs || [],
//       outputs: aiStep.outputs || [],
//       details: aiStep.details || [],
//       isAnimating: true,
//       assignedIntegration,
//       voiceflowAction: aiStep.voiceflowBlock || config.voiceflowBlock,
//       complexity: aiStep.complexity || "medium",
//       businessImpact: aiStep.businessImpact || "Enhances automation workflow",
//     }

//     setStreamingSteps((prevSteps) => [...prevSteps, step])

//     const progress = ((i + 1) / aiSteps.length) * 70 + 25
//     setStreamingProgress(progress)

//     addAiThought(
//       `🔧 AI created custom step: ${step.title}${assignedIntegration ? ` (${assignedIntegration.name})` : ""}`,
//     )

//     await new Promise((resolve) => setTimeout(resolve, 1000))

//     setStreamingSteps((prevSteps) => prevSteps.map((s) => (s.id === step.id ? { ...s, isAnimating: false } : s)))

//     steps.push(step)
//   }

//   return steps
// }

//   const getAssignedIntegrations = (steps: WorkflowStep[]): Integration[] => {
//     return steps.filter((step) => step.assignedIntegration).map((step) => step.assignedIntegration!)
//   }

//   const generateExampleScenario = (): string => {
//     const goalLabels = selectedGoals.map((g) => instagramGoals.find((goal) => goal.id === g)?.label).filter(Boolean)

//     return `A customer sends a DM on Instagram asking about your services. The workflow automatically analyzes their message, ${goalLabels.length > 0 ? `handles ${goalLabels.join(" and ").toLowerCase()},` : ""} and responds with relevant information while storing the interaction in your selected tools.`
//   }

//   const addAiThought = (thought: string): void => {
//     setAiThoughts((prev) => {
//       const newThoughts = [...prev, thought]
//       return newThoughts.slice(-5)
//     })
//   }

//   const getAiThoughtForPhase = (phase: number): string => {
//   const thoughts = [
//     "🔍 AI analyzing your Instagram automation requirements and business context...",
//     "🎨 AI designing custom Voiceflow-compatible workflow architecture...", 
//     "🔗 AI strategically assigning integrations to optimize workflow efficiency...",
//     "⚡ AI fine-tuning workflow for Instagram DM automation and user experience...",
//   ]
//   return thoughts[phase] || "🤖 AI processing your custom workflow requirements..."
// }

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
//         workflowDesign: parsedWorkflow,
//         selectedIntegrations: selectedIntegrations,
//         selectedOperations: selectedOperations,
//         selectedGoals: selectedGoals,
//         customRequest: workflowRequest,
//         platform: "Instagram",
//         submittedAt: new Date().toISOString(),
//         urgency: "NORMAL",
//       }

//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 2000))

//       setResponseStatus("✅ Instagram workflow submitted successfully!")

//       const pendingData = {
//         id: `instagram-${Date.now()}`,
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

//     const currentPhaseData = streamingPhases[currentPhase]
//     const IconComponent = currentPhaseData?.icon || Instagram

//     return (
//       <div className="mb-8">
//         <div className="flex items-center justify-center mb-6">
//           <div className="relative">
//             <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 flex items-center justify-center">
//               <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-pink-500 border-r-purple-500 animate-spin"></div>
//               <IconComponent className={`h-10 w-10 ${currentPhaseData?.color || "text-pink-500"} animate-pulse`} />
//             </div>
//           </div>
//         </div>

//         <div className="text-center mb-6">
//           <h3 className="text-xl font-semibold mb-2">{currentPhaseData?.title || "Processing..."}</h3>
//           <p className="text-muted-foreground">
//             {currentPhaseData?.description || "Working on your Instagram automation..."}
//           </p>
//         </div>

//         <div className="mb-6">
//           <div className="flex justify-between text-sm text-muted-foreground mb-2">
//             <span>Progress</span>
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
//               <span className="text-sm font-medium text-pink-700 dark:text-pink-300">AI Insights</span>
//             </div>
//             <div className="space-y-2 max-h-24 overflow-hidden">
//               {aiThoughts.slice(-3).map((thought, index) => (
//                 <div
//                   key={index}
//                   className={`text-xs text-pink-600 dark:text-pink-400 transition-opacity duration-500 ${
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
//                 </div>
//                 <p className="text-muted-foreground mb-3 leading-relaxed">{step.description}</p>

//                 {/* Input/Output Flow */}
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
//               Create intelligent Instagram DM automation workflows using Voiceflow and your preferred integrations.
//             </p>
//             <div className="flex items-center justify-center gap-6 mt-4 text-sm text-muted-foreground">
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
//                 <span>Instagram-Optimized</span>
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
//                 <div className="text-sm text-muted-foreground mb-4">
//                   Choose the integrations that will help your AI agent provide better customer support on Instagram:
//                 </div>

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
//                       <div className="flex items-center gap-3">
//                         <IconComponent className="h-4 w-4 text-primary" />
//                         <span className="text-sm font-medium">{goal.label}</span>
//                         {isSelected && <Check className="h-4 w-4 text-primary ml-auto" />}
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
//                       Generate Instagram Workflow
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
//                       Voiceflow Ready
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
//                         <p className="text-muted-foreground">Voiceflow-compatible automation steps</p>
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
//                           <span className="font-medium">Generating Instagram automation steps...</span>
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
//                       Our AI will create a Voiceflow-compatible workflow tailored to your requirements.
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
//                         <span className="font-medium">AI Powered</span>
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
// import { Checkbox } from "@/components/ui/checkbox"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { ArrowLeft, Sparkles, Loader2, CheckCircle, Settings, ThumbsUp, MessageCircle, RefreshCw, Zap, AlertCircle, PlayCircle, Workflow, ChevronDown, ChevronRight, Database, Filter, Mail, Star, Brain, Layers, Wand2, Check, Link2, Instagram, FileSpreadsheet, FileText, Users, Target, MessageSquare, Heart, UserPlus, ShoppingBag, Calendar, Info, Clock, TrendingUp } from 'lucide-react'

// import { generateText } from 'ai'
// import { createOpenAI } from '@ai-sdk/openai'

// // Configure DeepSeek directly
// const deepseek = createOpenAI({
//   apiKey: process.env.DEEPSEEK_API_KEY,
//   baseURL: 'https://api.deepseek.com',
// })

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

//   // Enhanced workflow generation with real DeepSeek AI
//   const generateWorkflowWithAI = useCallback(
//     async (action: "initial" | "refine", instructions?: string): Promise<void> => {
//       setIsGenerating(true)
//       setIsStreaming(true)
//       setCurrentPhase(0)
//       setStreamingProgress(0)
//       setStreamingSteps([])
//       setAiThoughts([])
//       setGenerationStartTime(Date.now())
//       setEstimatedTimeRemaining(45) // 45 seconds estimated
//       setResponseStatus("🧠 Connecting to DeepSeek AI...")
//       setCurrentAction(action)
//       setHasInitialRequest(true)

//       try {
//         // Real-time progress updates
//         const progressInterval = setInterval(() => {
//           setEstimatedTimeRemaining(prev => Math.max(0, prev - 1))
//         }, 1000)

//         // Generate workflow with DeepSeek
//         const aiResponse = await callDeepSeekAI(action, instructions)

//         clearInterval(progressInterval)

//         if (aiResponse.success && aiResponse.workflowData) {
//           setParsedWorkflow(aiResponse.workflowData)
//           setStreamingProgress(100)
//           setResponseStatus("✅ Custom Instagram workflow generated successfully!")
//           addAiThought("🎉 Workflow ready for Voiceflow implementation!")
//         } else {
//           throw new Error(aiResponse.error || "AI generation failed")
//         }
//       } catch (error) {
//         console.error("AI generation error:", error)
//         setResponseStatus(`❌ Generation failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//         addAiThought("❌ Generation failed. Please try again with more specific requirements.")
//       } finally {
//         setIsStreaming(false)
//         setTimeout(() => {
//           setIsGenerating(false)
//         }, 1000)
//       }
//     },
//     [businessInfo, selectedIntegrations, selectedOperations, selectedGoals, workflowRequest],
//   )

//   // Real DeepSeek AI workflow generation
//   const callDeepSeekAI = async (
//     action: "initial" | "refine",
//     instructions?: string,
//   ): Promise<{ success: boolean; workflowData?: ParsedWorkflow; error?: string }> => {
//     try {
//       // Prepare context for AI
//       const selectedIntegrationDetails = selectedIntegrations.map(id => 
//         SUPPORTED_INTEGRATIONS.find(int => int.id === id)
//       ).filter(Boolean)

//       const selectedGoalDetails = selectedGoals.map(id => 
//         instagramGoals.find(goal => goal.id === id)
//       ).filter(Boolean)

//       const systemPrompt = `You are an expert Instagram automation workflow designer specializing in Voiceflow implementations. Create practical, actionable workflows that businesses can actually implement.

// Key Requirements:
// - Focus on Instagram DM automation specifically
// - Each step must be implementable in Voiceflow
// - Use only the provided integrations (max 1 per step, no duplicates)
// - Create 4-7 logical workflow steps
// - Ensure steps flow logically from one to the next
// - Make it practical for real business use

// Available Integrations: ${selectedIntegrationDetails.map(int => `${int?.name} - ${int?.description}`).join('; ')}

// Return ONLY valid JSON in this exact format:
// {
//   "title": "specific workflow title",
//   "description": "clear workflow description",
//   "steps": [
//     {
//       "title": "specific step title",
//       "description": "detailed step description",
//       "type": "trigger|analysis|filter|response|integration|storage",
//       "inputs": ["specific input 1", "specific input 2"],
//       "outputs": ["specific output 1", "specific output 2"],
//       "details": ["implementation detail 1", "implementation detail 2", "implementation detail 3"],
//       "voiceflowBlock": "specific Voiceflow block type",
//       "businessImpact": "specific business impact explanation",
//       "estimatedTime": "execution time",
//       "needsIntegration": true/false,
//       "complexity": "low/medium/high"
//     }
//   ],
//   "benefits": ["specific benefit 1", "specific benefit 2", "specific benefit 3"],
//   "exampleScenario": "detailed example scenario"
// }`

//       const userPrompt = action === "initial" 
//         ? `Create a custom Instagram DM automation workflow for:

// Business: ${businessInfo.businessName} (${businessInfo.businessType})
// Description: ${businessInfo.description}

// User Requirements: "${workflowRequest}"

// Selected Goals: ${selectedGoalDetails.map(g => `${g?.label} - ${g?.description}`).join('; ')}

// Selected Integrations: ${selectedIntegrationDetails.map(int => `${int?.name} (Operations: ${selectedOperations[int?.id || '']?.join(', ') || 'all available'})`).join('; ')}

// Create a workflow that specifically addresses these requirements and uses the selected integrations strategically.`
//         : `Refine this existing Instagram automation workflow based on feedback:

// Current Workflow: ${parsedWorkflow?.title} - ${parsedWorkflow?.description}
// Current Steps: ${streamingSteps.map(s => s.title).join(', ')}

// Refinement Request: "${instructions}"

// Update the workflow to address this feedback while maintaining Instagram focus and Voiceflow compatibility.`

//       addAiThought("🤖 Sending detailed requirements to DeepSeek AI...")
//       setCurrentPhase(1)
//       setStreamingProgress(20)

//       const { text } = await generateText({
//         model: deepseek('deepseek-chat'),
//         system: systemPrompt,
//         prompt: userPrompt,
//         temperature: 0.7,
//         maxTokens: 2000,
//       })

//       addAiThought("🧠 DeepSeek AI analyzing and creating custom workflow...")
//       setCurrentPhase(2)
//       setStreamingProgress(60)

//       // Parse AI response
//       const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim()
//       let aiResponse
      
//       try {
//         aiResponse = JSON.parse(cleanedText)
//       } catch (parseError) {
//         console.error("JSON parse error:", parseError)
//         throw new Error("AI returned invalid response format")
//       }

//       addAiThought("✨ Processing AI-generated workflow steps...")
//       setCurrentPhase(3)
//       setStreamingProgress(80)

//       // Process the AI-generated steps
//       const workflowSteps = await processAIGeneratedSteps(aiResponse.steps)

//       const workflow: ParsedWorkflow = {
//         title: aiResponse.title || `${businessInfo.businessName} Instagram Automation`,
//         description: aiResponse.description || `Custom Instagram DM automation workflow`,
//         platform: "Instagram DMs via Voiceflow",
//         estimatedBuildTime: "1-2 weeks",
//         complexity: "Custom",
//         steps: workflowSteps,
//         integrations: getAssignedIntegrations(workflowSteps),
//         benefits: aiResponse.benefits || [
//           "Custom AI-generated automation",
//           "Instagram-optimized workflow",
//           "Voiceflow-compatible implementation"
//         ],
//         exampleScenario: aiResponse.exampleScenario || "Custom workflow tailored to your specific requirements",
//         voiceflowFeatures: [
//           "Custom Intent Recognition",
//           "Dynamic Conditional Logic", 
//           "Tailored API Integrations",
//           "Personalized Response Generation"
//         ],
//         instagramFocus: [
//           "Custom DM automation flow",
//           "Personalized customer interactions",
//           "Business-specific automation logic"
//         ],
//         estimatedCost: "$200-500/month",
//         roi: "300-600% within 3 months",
//         metrics: {
//           automationRate: "90%",
//           responseTime: "< 15 seconds", 
//           accuracy: "94%",
//           scalability: "High",
//         },
//       }

//       return { success: true, workflowData: workflow }
//     } catch (error) {
//       console.error("DeepSeek AI generation error:", error)
//       return {
//         success: false,
//         error: error instanceof Error ? error.message : "AI generation failed",
//       }
//     }
//   }

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

//       // Smooth animation timing
//       await new Promise((resolve) => setTimeout(resolve, 800))

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
//         workflowDesign: parsedWorkflow,
//         selectedIntegrations: selectedIntegrations,
//         selectedOperations: selectedOperations,
//         selectedGoals: selectedGoals,
//         customRequest: workflowRequest,
//         platform: "Instagram",
//         submittedAt: new Date().toISOString(),
//         urgency: "NORMAL",
//       }

//       // Real API call would go here
//       await new Promise((resolve) => setTimeout(resolve, 2000))

//       setResponseStatus("✅ Instagram workflow submitted successfully!")

//       const pendingData = {
//         id: `instagram-${Date.now()}`,
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
//                         Input: {step.inputs.join(", ")}
//                       </span>
//                     </div>
//                   )}
//                   {step.outputs && step.outputs.length > 0 && (
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
//                       <span className="text-blue-700 dark:text-blue-300 font-medium">
//                         Output: {step.outputs.join(", ")}
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

// import { generateText } from 'ai'
// import { createOpenAI } from '@ai-sdk/openai'

// // Configure DeepSeek directly
// const deepseek = createOpenAI({
//   apiKey: process.env.DEEPSEEK_API_KEY,
//   baseURL: 'https://api.deepseek.com',
// })

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

//   // Enhanced workflow generation with real DeepSeek AI
//   const generateWorkflowWithAI = useCallback(
//     async (action: "initial" | "refine", instructions?: string): Promise<void> => {
//       setIsGenerating(true)
//       setIsStreaming(true)
//       setCurrentPhase(0)
//       setStreamingProgress(0)
//       setStreamingSteps([])
//       setAiThoughts([])
//       setGenerationStartTime(Date.now())
//       setEstimatedTimeRemaining(45) // 45 seconds estimated
//       setResponseStatus("🧠 Connecting to DeepSeek AI...")
//       setCurrentAction(action)
//       setHasInitialRequest(true)

//       try {
//         // Real-time progress updates
//         const progressInterval = setInterval(() => {
//           setEstimatedTimeRemaining(prev => Math.max(0, prev - 1))
//         }, 1000)

//         // Generate workflow with DeepSeek
//         const aiResponse = await callDeepSeekAI(action, instructions)

//         clearInterval(progressInterval)

//         if (aiResponse.success && aiResponse.workflowData) {
//           setParsedWorkflow(aiResponse.workflowData)
//           setStreamingProgress(100)
//           setResponseStatus("✅ Custom Instagram workflow generated successfully!")
//           addAiThought("🎉 Workflow ready for Voiceflow implementation!")
//         } else {
//           throw new Error(aiResponse.error || "AI generation failed")
//         }
//       } catch (error) {
//         console.error("AI generation error:", error)
//         setResponseStatus(`❌ Generation failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//         addAiThought("❌ Generation failed. Please try again with more specific requirements.")
//       } finally {
//         setIsStreaming(false)
//         setTimeout(() => {
//           setIsGenerating(false)
//         }, 1000)
//       }
//     },
//     [businessInfo, selectedIntegrations, selectedOperations, selectedGoals, workflowRequest],
//   )

//   // Real DeepSeek AI workflow generation
//   const callDeepSeekAI = async (
//     action: "initial" | "refine",
//     instructions?: string,
//   ): Promise<{ success: boolean; workflowData?: ParsedWorkflow; error?: string }> => {
//     try {
//       // Prepare context for AI
//       const selectedIntegrationDetails = selectedIntegrations.map(id => 
//         SUPPORTED_INTEGRATIONS.find(int => int.id === id)
//       ).filter(Boolean)

//       const selectedGoalDetails = selectedGoals.map(id => 
//         instagramGoals.find(goal => goal.id === id)
//       ).filter(Boolean)

//       const systemPrompt = `You are an expert Instagram automation workflow designer specializing in Voiceflow implementations. Create practical, actionable workflows that businesses can actually implement.

// Key Requirements:
// - Focus on Instagram DM automation specifically
// - Each step must be implementable in Voiceflow
// - Use only the provided integrations (max 1 per step, no duplicates)
// - Create 4-7 logical workflow steps
// - Ensure steps flow logically from one to the next
// - Make it practical for real business use

// Available Integrations: ${selectedIntegrationDetails.map(int => `${int?.name} - ${int?.description}`).join('; ')}

// Return ONLY valid JSON in this exact format:
// {
//   "title": "specific workflow title",
//   "description": "clear workflow description",
//   "steps": [
//     {
//       "title": "specific step title",
//       "description": "detailed step description",
//       "type": "trigger|analysis|filter|response|integration|storage",
//       "inputs": ["specific input 1", "specific input 2"],
//       "outputs": ["specific output 1", "specific output 2"],
//       "details": ["implementation detail 1", "implementation detail 2", "implementation detail 3"],
//       "voiceflowBlock": "specific Voiceflow block type",
//       "businessImpact": "specific business impact explanation",
//       "estimatedTime": "execution time",
//       "needsIntegration": true/false,
//       "complexity": "low/medium/high"
//     }
//   ],
//   "benefits": ["specific benefit 1", "specific benefit 2", "specific benefit 3"],
//   "exampleScenario": "detailed example scenario"
// }`

//       const userPrompt = action === "initial" 
//         ? `Create a custom Instagram DM automation workflow for:

// Business: ${businessInfo.businessName} (${businessInfo.businessType})
// Description: ${businessInfo.description}

// User Requirements: "${workflowRequest}"

// Selected Goals: ${selectedGoalDetails.map(g => `${g?.label} - ${g?.description}`).join('; ')}

// Selected Integrations: ${selectedIntegrationDetails.map(int => `${int?.name} (Operations: ${selectedOperations[int?.id || '']?.join(', ') || 'all available'})`).join('; ')}

// Create a workflow that specifically addresses these requirements and uses the selected integrations strategically.`
//         : `Refine this existing Instagram automation workflow based on feedback:

// Current Workflow: ${parsedWorkflow?.title} - ${parsedWorkflow?.description}
// Current Steps: ${streamingSteps.map(s => s.title).join(', ')}

// Refinement Request: "${instructions}"

// Update the workflow to address this feedback while maintaining Instagram focus and Voiceflow compatibility.`

//       addAiThought("🤖 Sending detailed requirements to DeepSeek AI...")
//       setCurrentPhase(1)
//       setStreamingProgress(20)

//       const { text } = await generateText({
//         model: deepseek('deepseek-chat'),
//         system: systemPrompt,
//         prompt: userPrompt,
//         temperature: 0.7,
//         maxTokens: 2000,
//       })

//       addAiThought("🧠 DeepSeek AI analyzing and creating custom workflow...")
//       setCurrentPhase(2)
//       setStreamingProgress(60)

//       // Parse AI response
//       const cleanedText = text.replace(/\`\`\`json\n?|\n?\`\`\`/g, '').trim()
//       let aiResponse
      
//       try {
//         aiResponse = JSON.parse(cleanedText)
//       } catch (parseError) {
//         console.error("JSON parse error:", parseError)
//         throw new Error("AI returned invalid response format")
//       }

//       addAiThought("✨ Processing AI-generated workflow steps...")
//       setCurrentPhase(3)
//       setStreamingProgress(80)

//       // Process the AI-generated steps
//       const workflowSteps = await processAIGeneratedSteps(aiResponse.steps)

//       const workflow: ParsedWorkflow = {
//         title: aiResponse.title || `${businessInfo.businessName} Instagram Automation`,
//         description: aiResponse.description || `Custom Instagram DM automation workflow`,
//         platform: "Instagram DMs via Voiceflow",
//         estimatedBuildTime: "1-2 weeks",
//         complexity: "Custom",
//         steps: workflowSteps,
//         integrations: getAssignedIntegrations(workflowSteps),
//         benefits: aiResponse.benefits || [
//           "Custom AI-generated automation",
//           "Instagram-optimized workflow",
//           "Voiceflow-compatible implementation"
//         ],
//         exampleScenario: aiResponse.exampleScenario || "Custom workflow tailored to your specific requirements",
//         voiceflowFeatures: [
//           "Custom Intent Recognition",
//           "Dynamic Conditional Logic", 
//           "Tailored API Integrations",
//           "Personalized Response Generation"
//         ],
//         instagramFocus: [
//           "Custom DM automation flow",
//           "Personalized customer interactions",
//           "Business-specific automation logic"
//         ],
//         estimatedCost: "$200-500/month",
//         roi: "300-600% within 3 months",
//         metrics: {
//           automationRate: "90%",
//           responseTime: "< 15 seconds", 
//           accuracy: "94%",
//           scalability: "High",
//         },
//       }

//       return { success: true, workflowData: workflow }
//     } catch (error) {
//       console.error("DeepSeek AI generation error:", error)
//       return {
//         success: false,
//         error: error instanceof Error ? error.message : "AI generation failed",
//       }
//     }
//   }

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

//       // Smooth animation timing
//       await new Promise((resolve) => setTimeout(resolve, 800))

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

//       // Real API call would go here
//       await new Promise((resolve) => setTimeout(resolve, 2000))

//       setResponseStatus("✅ Instagram workflow submitted successfully!")

//       const pendingData = {
//         id: `instagram-${Date.now()}`,
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
//                         Input: {step.inputs.join(", ")}
//                       </span>
//                     </div>
//                   )}
//                   {step.outputs && step.outputs.length > 0 && (
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
//                       <span className="text-blue-700 dark:text-blue-300 font-medium">
//                         Output: {step.outputs.join(", ")}
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

//   // Enhanced workflow generation with real DeepSeek AI via server action
//   const generateWorkflowWithAI = useCallback(
//     async (action: "initial" | "refine", instructions?: string): Promise<void> => {
//       setIsGenerating(true)
//       setIsStreaming(true)
//       setCurrentPhase(0)
//       setStreamingProgress(0)
//       setStreamingSteps([])
//       setAiThoughts([])
//       setGenerationStartTime(Date.now())
//       setEstimatedTimeRemaining(45) // 45 seconds estimated
//       setResponseStatus("🧠 Connecting to DeepSeek AI...")
//       setCurrentAction(action)
//       setHasInitialRequest(true)

//       try {
//         // Real-time progress updates
//         const progressInterval = setInterval(() => {
//           setEstimatedTimeRemaining(prev => Math.max(0, prev - 1))
//         }, 1000)

//         // Update progress phases
//         addAiThought("🤖 Sending detailed requirements to DeepSeek AI...")
//         setCurrentPhase(1)
//         setStreamingProgress(20)

//         // Call server action
//         const aiResponse = await generateWorkflowWithDeepSeek({
//           action,
//           businessInfo,
//           selectedIntegrations,
//           selectedOperations,
//           selectedGoals,
//           workflowRequest,
//           instructions,
//           currentWorkflow: parsedWorkflow ? {
//             title: parsedWorkflow.title,
//             description: parsedWorkflow.description,
//             steps: streamingSteps
//           } : undefined
//         })

//         clearInterval(progressInterval)

//         if (aiResponse.success && aiResponse.workflowData) {
//           addAiThought("🧠 DeepSeek AI analyzing and creating custom workflow...")
//           setCurrentPhase(2)
//           setStreamingProgress(60)

//           addAiThought("✨ Processing AI-generated workflow steps...")
//           setCurrentPhase(3)
//           setStreamingProgress(80)

//           // Process the AI-generated steps
//           const workflowSteps = await processAIGeneratedSteps(aiResponse.workflowData.steps)

//           const workflow: ParsedWorkflow = {
//             title: aiResponse.workflowData.title || `${businessInfo.businessName} Instagram Automation`,
//             description: aiResponse.workflowData.description || `Custom Instagram DM automation workflow`,
//             platform: "Instagram DMs via Voiceflow",
//             estimatedBuildTime: "1-2 weeks",
//             complexity: "Custom",
//             steps: workflowSteps,
//             integrations: getAssignedIntegrations(workflowSteps),
//             benefits: aiResponse.workflowData.benefits || [
//               "Custom AI-generated automation",
//               "Instagram-optimized workflow",
//               "Voiceflow-compatible implementation"
//             ],
//             exampleScenario: aiResponse.workflowData.exampleScenario || "Custom workflow tailored to your specific requirements",
//             voiceflowFeatures: [
//               "Custom Intent Recognition",
//               "Dynamic Conditional Logic", 
//               "Tailored API Integrations",
//               "Personalized Response Generation"
//             ],
//             instagramFocus: [
//               "Custom DM automation flow",
//               "Personalized customer interactions",
//               "Business-specific automation logic"
//             ],
//             estimatedCost: "$200-500/month",
//             roi: "300-600% within 3 months",
//             metrics: {
//               automationRate: "90%",
//               responseTime: "< 15 seconds", 
//               accuracy: "94%",
//               scalability: "High",
//             },
//           }

//           setParsedWorkflow(workflow)
//           setStreamingProgress(100)
//           setResponseStatus("✅ Custom Instagram workflow generated successfully!")
//           addAiThought("🎉 Workflow ready for Voiceflow implementation!")
//         } else {
//           throw new Error(aiResponse.error || "AI generation failed")
//         }
//       } catch (error) {
//         console.error("AI generation error:", error)
//         setResponseStatus(`❌ Generation failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//         addAiThought("❌ Generation failed. Please try again with more specific requirements.")
//       } finally {
//         setIsStreaming(false)
//         setTimeout(() => {
//           setIsGenerating(false)
//         }, 1000)
//       }
//     },
//     [businessInfo, selectedIntegrations, selectedOperations, selectedGoals, workflowRequest, parsedWorkflow, streamingSteps],
//   )

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

//       // Smooth animation timing
//       await new Promise((resolve) => setTimeout(resolve, 800))

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
//                         Input: {step.inputs.join(", ")}
//                       </span>
//                     </div>
//                   )}
//                   {step.outputs && step.outputs.length > 0 && (
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
//                       <span className="text-blue-700 dark:text-blue-300 font-medium">
//                         Output: {step.outputs.join(", ")}
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

//   // Enhanced workflow generation with real DeepSeek AI via server action
//   const generateWorkflowWithAI = useCallback(
//     async (action: "initial" | "refine", instructions?: string): Promise<void> => {
//       setIsGenerating(true)
//       setIsStreaming(true)
//       setCurrentPhase(0)
//       setStreamingProgress(0)
//       setStreamingSteps([])
//       setAiThoughts([])
//       setGenerationStartTime(Date.now())
//       setEstimatedTimeRemaining(45) // 45 seconds estimated
//       setResponseStatus("🧠 Connecting to DeepSeek AI...")
//       setCurrentAction(action)
//       setHasInitialRequest(true)

//       try {
//         // Real-time progress updates
//         const progressInterval = setInterval(() => {
//           setEstimatedTimeRemaining(prev => Math.max(0, prev - 1))
//         }, 1000)

//         // Update progress phases
//         addAiThought("🤖 Sending detailed requirements to DeepSeek AI...")
//         setCurrentPhase(1)
//         setStreamingProgress(20)

//         // Call server action with proper error handling
//         const aiResponse = await generateWorkflowWithDeepSeek({
//           action,
//           businessInfo,
//           selectedIntegrations,
//           selectedOperations,
//           selectedGoals,
//           workflowRequest,
//           instructions,
//           currentWorkflow: parsedWorkflow ? {
//             title: parsedWorkflow.title,
//             description: parsedWorkflow.description,
//             steps: streamingSteps
//           } : undefined
//         })

//         clearInterval(progressInterval)

//         // Check if response exists and has expected structure
//         if (!aiResponse) {
//           throw new Error("No response received from server")
//         }

//         if (aiResponse.success && aiResponse.workflowData) {
//           addAiThought("🧠 DeepSeek AI analyzing and creating custom workflow...")
//           setCurrentPhase(2)
//           setStreamingProgress(60)

//           addAiThought("✨ Processing AI-generated workflow steps...")
//           setCurrentPhase(3)
//           setStreamingProgress(80)

//           // Validate workflow data structure
//           if (!aiResponse.workflowData.steps || !Array.isArray(aiResponse.workflowData.steps)) {
//             throw new Error("Invalid workflow data structure received")
//           }

//           // Process the AI-generated steps
//           const workflowSteps = await processAIGeneratedSteps(aiResponse.workflowData.steps)

//           const workflow: ParsedWorkflow = {
//             title: aiResponse.workflowData.title || `${businessInfo.businessName} Instagram Automation`,
//             description: aiResponse.workflowData.description || `Custom Instagram DM automation workflow`,
//             platform: "Instagram DMs via Voiceflow",
//             estimatedBuildTime: "1-2 weeks",
//             complexity: "Custom",
//             steps: workflowSteps,
//             integrations: getAssignedIntegrations(workflowSteps),
//             benefits: aiResponse.workflowData.benefits || [
//               "Custom AI-generated automation",
//               "Instagram-optimized workflow",
//               "Voiceflow-compatible implementation"
//             ],
//             exampleScenario: aiResponse.workflowData.exampleScenario || "Custom workflow tailored to your specific requirements",
//             voiceflowFeatures: [
//               "Custom Intent Recognition",
//               "Dynamic Conditional Logic", 
//               "Tailored API Integrations",
//               "Personalized Response Generation"
//             ],
//             instagramFocus: [
//               "Custom DM automation flow",
//               "Personalized customer interactions",
//               "Business-specific automation logic"
//             ],
//             estimatedCost: "$200-500/month",
//             roi: "300-600% within 3 months",
//             metrics: {
//               automationRate: "90%",
//               responseTime: "< 15 seconds", 
//               accuracy: "94%",
//               scalability: "High",
//             },
//           }

//           setParsedWorkflow(workflow)
//           setStreamingProgress(100)
//           setResponseStatus("✅ Custom Instagram workflow generated successfully!")
//           addAiThought("🎉 Workflow ready for Voiceflow implementation!")
//         } else {
//           // Handle error response
//           const errorMessage = aiResponse?.error || "Unknown error occurred"
//           throw new Error(errorMessage)
//         }
//       } catch (error) {
//         console.error("AI generation error:", error)
//         const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
//         setResponseStatus(`❌ Generation failed: ${errorMessage}`)
//         addAiThought("❌ Generation failed. Please try again with more specific requirements.")
//       } finally {
//         setIsStreaming(false)
//         setTimeout(() => {
//           setIsGenerating(false)
//         }, 1000)
//       }
//     },
//     [businessInfo, selectedIntegrations, selectedOperations, selectedGoals, workflowRequest, parsedWorkflow, streamingSteps],
//   )

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

//       // Smooth animation timing
//       await new Promise((resolve) => setTimeout(resolve, 800))

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
//                         Input: {step.inputs.join(", ")}
//                       </span>
//                     </div>
//                   )}
//                   {step.outputs && step.outputs.length > 0 && (
//                     <div className="flex items-center gap-2">
//                       <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
//                       <span className="text-blue-700 dark:text-blue-300 font-medium">
//                         Output: {step.outputs.join(", ")}
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
//   // setActiveWorkflowExists?: (exists: boolean) => setActiveWorkflowExists(exists: boolean) => void
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
//       setEstimatedTimeRemaining(30) // Reduced to 30 seconds
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
//         addAiThought("🤖 Sending requirements to DeepSeek AI...")
//         setCurrentPhase(1)
//         setStreamingProgress(20)

//         // Add timeout warning
//         setTimeout(() => {
//           if (isGenerating) {
//             addAiThought("⏳ DeepSeek AI is processing your complex request...")
//             setStreamingProgress(40)
//           }
//         }, 10000)

//         // Call server action with timeout handling
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
//           }),
//           // Client-side timeout as backup
//           new Promise<DeepSeekResponse>((_, reject) => 
//             setTimeout(() => reject(new Error('Client timeout - request took too long')), 35000)
//           )
//         ])

//         const duration = Date.now() - startTime
//         console.log(`Request completed in ${duration}ms`)

//         if (progressInterval) {
//           clearInterval(progressInterval)
//           progressInterval = null
//         }

//         // Check if response exists and has expected structure
//         if (!aiResponse) {
//           throw new Error("No response received from server")
//         }

//         if (aiResponse.success && aiResponse.workflowData) {
//           addAiThought("🧠 Processing AI-generated workflow...")
//           setCurrentPhase(2)
//           setStreamingProgress(60)

//           addAiThought("✨ Creating workflow steps...")
//           setCurrentPhase(3)
//           setStreamingProgress(80)

//           // Validate workflow data structure
//           if (!aiResponse.workflowData.steps || !Array.isArray(aiResponse.workflowData.steps)) {
//             throw new Error("Invalid workflow data structure received")
//           }

//           // Process the AI-generated steps
//           const workflowSteps = await processAIGeneratedSteps(aiResponse.workflowData.steps)

//           const workflow: ParsedWorkflow = {
//             title: aiResponse.workflowData.title || `${businessInfo.businessName} Instagram Automation`,
//             description: aiResponse.workflowData.description || `Custom Instagram DM automation workflow`,
//             platform: "Instagram DMs via Voiceflow",
//             estimatedBuildTime: "1-2 weeks",
//             complexity: "Custom",
//             steps: workflowSteps,
//             integrations: getAssignedIntegrations(workflowSteps),
//             benefits: aiResponse.workflowData.benefits || [
//               "Custom AI-generated automation",
//               "Instagram-optimized workflow",
//               "Voiceflow-compatible implementation"
//             ],
//             exampleScenario: aiResponse.workflowData.exampleScenario || "Custom workflow tailored to your specific requirements",
//             voiceflowFeatures: [
//               "Custom Intent Recognition",
//               "Dynamic Conditional Logic", 
//               "Tailored API Integrations",
//               "Personalized Response Generation"
//             ],
//             instagramFocus: [
//               "Custom DM automation flow",
//               "Personalized customer interactions",
//               "Business-specific automation logic"
//             ],
//             estimatedCost: "$200-500/month",
//             roi: "300-600% within 3 months",
//             metrics: {
//               automationRate: "90%",
//               responseTime: "< 15 seconds", 
//               accuracy: "94%",
//               scalability: "High",
//             },
//           }

//           setParsedWorkflow(workflow)
//           setStreamingProgress(100)
//           setResponseStatus("✅ Custom Instagram workflow generated successfully!")
//           addAiThought("🎉 Workflow ready for Voiceflow implementation!")
//         } else {
//           // Handle error response
//           const errorMessage = aiResponse?.error || "Unknown error occurred"
//           throw new Error(errorMessage)
//         }
//       } catch (error) {
//         console.error("AI generation error:", error)
//         const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
        
//         // Provide more helpful error messages
//         let userFriendlyMessage = errorMessage
//         if (errorMessage.includes('timeout')) {
//           userFriendlyMessage = "The AI is taking longer than expected. Please try again with a simpler request or check your connection."
//         } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
//           userFriendlyMessage = "Network connection issue. Please check your internet connection and try again."
//         } else if (errorMessage.includes('API key')) {
//           userFriendlyMessage = "API configuration issue. Please contact support."
//         }
        
//         setResponseStatus(`❌ Generation failed: ${userFriendlyMessage}`)
//         addAiThought("❌ Generation failed. Please try again with more specific requirements.")
//       } finally {
//         if (progressInterval) {
//           clearInterval(progressInterval)
//         }
//         setIsStreaming(false)
//         setTimeout(() => {
//           setIsGenerating(false)
//         }, 1000)
//       }
//     },
//     [businessInfo, selectedIntegrations, selectedOperations, selectedGoals, workflowRequest, parsedWorkflow, streamingSteps, isGenerating],
//   )

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
    color: "text-emerald-600",
    bgColor: "from-emerald-50 to-green-100",
    borderColor: "border-emerald-300",
    voiceflowBlock: "Intent Block",
  },
  analysis: {
    icon: Brain,
    color: "text-purple-600",
    bgColor: "from-purple-50 to-violet-100",
    borderColor: "border-purple-300",
    voiceflowBlock: "AI Block",
  },
  filter: {
    icon: Filter,
    color: "text-blue-600",
    bgColor: "from-blue-50 to-cyan-100",
    borderColor: "border-blue-300",
    voiceflowBlock: "Condition Block",
  },
  response: {
    icon: MessageCircle,
    color: "text-orange-600",
    bgColor: "from-orange-50 to-amber-100",
    borderColor: "border-orange-300",
    voiceflowBlock: "Text Block",
  },
  integration: {
    icon: Zap,
    color: "text-yellow-600",
    bgColor: "from-yellow-50 to-orange-100",
    borderColor: "border-yellow-300",
    voiceflowBlock: "API Block",
  },
  storage: {
    icon: Database,
    color: "text-gray-600",
    bgColor: "from-gray-50 to-slate-100",
    borderColor: "border-gray-300",
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
          setTimeout(() => reject(new Error('Client timeout - please try with simpler requirements')), 25000)
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
      { title: "Analyzing Requirements", icon: Brain, color: "text-blue-500" },
      { title: "Designing Architecture", icon: Workflow, color: "text-purple-500" },
      { title: "Assigning Integrations", icon: Link2, color: "text-green-500" },
      { title: "Finalizing Workflow", icon: CheckCircle, color: "text-pink-500" },
    ]

    const currentPhaseData = phases[currentPhase] || phases[0]
    const IconComponent = currentPhaseData.icon

    return (
      <div className="mb-8">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-pink-500 border-r-purple-500 animate-spin"></div>
              <IconComponent className={`h-10 w-10 ${currentPhaseData.color} animate-pulse`} />
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-2">{currentPhaseData.title}</h3>
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
                      ? "bg-green-500 text-white shadow-lg"
                      : index === currentPhase
                        ? "bg-pink-500 text-white animate-pulse shadow-lg"
                        : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {index < currentPhase ? <CheckCircle className="h-6 w-6" /> : <PhaseIcon className="h-6 w-6" />}
                </div>
                <span
                  className={`text-xs mt-2 text-center font-medium ${
                    index === currentPhase ? "text-pink-600 dark:text-pink-400" : "text-muted-foreground"
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
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-pink-200 dark:border-pink-700">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-4 w-4 text-pink-500" />
              <span className="text-sm font-medium text-pink-700 dark:text-pink-300">DeepSeek AI Progress</span>
            </div>
            <div className="space-y-2">
              {aiThoughts.map((thought, index) => (
                <div
                  key={index}
                  className={`text-xs text-pink-600 dark:text-pink-400 transition-opacity duration-500 ${
                    index === aiThoughts.length - 1 ? "opacity-100 font-medium" : "opacity-70"
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
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-xl">
                  {step.stepNumber}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
                  <IconComponent className={`h-4 w-4 ${config.color}`} />
                </div>
              </div>

              {/* Step Content */}
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

                {/* Input/Output Flow */}
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
              <div className="grid lg:grid-cols-2 gap-6">
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
                    <Settings className="h-4 w-4 text-purple-500" />
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
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <step.assignedIntegration.icon className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-700 dark:text-green-300">
                            {step.assignedIntegration.name} Integration
                          </span>
                        </div>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          {step.assignedIntegration.description}
                        </p>
                        {selectedOperations[step.assignedIntegration.id] && (
                          <div className="mt-2">
                            <span className="text-xs font-medium text-green-700 dark:text-green-300">
                              Available Operations:
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedOperations[step.assignedIntegration.id].map((op) => (
                                <Badge key={op} variant="outline" className="text-xs">
                                  {op}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
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
            </div>
          )}
        </div>

        {/* Connection Line */}
        {step.stepNumber < (streamingSteps.length || 1) && (
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
          <Button variant="ghost" className="mb-6 hover:bg-accent" onClick={() => setStep?.("selection")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Selection
          </Button>
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Instagram className="h-12 w-12 text-pink-500" />
              <h1 className="text-5xl font-bold">Instagram Automation Builder</h1>
            </div>
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
              Create intelligent Instagram DM automation workflows using DeepSeek AI, Voiceflow, and your preferred integrations.
            </p>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                <span>DeepSeek AI Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>Voiceflow-Compatible</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
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
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="h-5 w-5 text-primary" />
                  Available Integrations
                </CardTitle>
                <CardDescription>Select the tools you want to integrate with your Instagram automation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
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
                              <span className="font-medium">{integration.name}</span>
                              <Badge variant="outline" className="text-xs">
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
                          <Label className="text-sm font-medium mb-2 block">Select operations to allow:</Label>
                          <div className="space-y-2">
                            {integration.operations.map((operation) => (
                              <div key={operation} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${integration.id}-${operation}`}
                                  checked={selectedOperations[integration.id]?.includes(operation) || false}
                                  onCheckedChange={(checked) => handleOperationToggle(integration.id, operation)}
                                />
                                <Label htmlFor={`${integration.id}-${operation}`} className="text-sm cursor-pointer">
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
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Automation Goals
                </CardTitle>
                <CardDescription>What do you want to achieve with Instagram automation?</CardDescription>
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
                          <span className="text-sm font-medium block">{goal.label}</span>
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
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-primary" />
                  {!hasInitialRequest ? "Describe Your Instagram Automation" : "Refine Your Workflow"}
                </CardTitle>
                <CardDescription>
                  {!hasInitialRequest
                    ? "Tell us about your specific Instagram automation needs"
                    : "Provide feedback to improve the workflow"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!hasInitialRequest ? (
                  <>
                    <div className="space-y-3">
                      <Label htmlFor="workflowRequest" className="text-base font-semibold">
                        Instagram Automation Requirements
                      </Label>
                      <Textarea
                        id="workflowRequest"
                        value={workflowRequest}
                        onChange={(e) => setWorkflowRequest(e.target.value)}
                        placeholder="e.g., 'I want to automatically respond to Instagram DMs asking about product pricing, capture lead information, and follow up with email campaigns. When someone asks about appointments, I want to integrate with my booking system and send calendar links.'"
                        rows={6}
                        className="bg-background border-2 border-pink-200 focus:border-pink-500 resize-none text-sm"
                        disabled={isGenerating}
                      />
                    </div>
                    <Button
                      onClick={handleInitialSubmit}
                      disabled={isGenerating || !workflowRequest.trim()}
                      className="w-full flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 text-base"
                    >
                      {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Instagram className="h-5 w-5" />}
                      Generate with DeepSeek AI
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="space-y-3">
                      <Label htmlFor="refinementInput" className="text-base font-semibold">
                        Refinement Instructions
                      </Label>
                      <Textarea
                        id="refinementInput"
                        value={refinementInput}
                        onChange={(e) => setRefinementInput(e.target.value)}
                        placeholder="e.g., 'Add a step to check business hours before responding', 'Include product availability checking', 'Add sentiment analysis for priority routing'"
                        rows={4}
                        className="bg-white/50 border-2 border-pink-200 focus:border-pink-500 resize-none"
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
                <CardTitle className="flex items-center gap-2">
                  <Instagram className="h-6 w-6 text-pink-500" />
                  Instagram Automation Workflow
                  {parsedWorkflow && (
                    <Badge variant="outline" className="ml-auto">
                      <Star className="h-3 w-3 mr-1" />
                      DeepSeek AI Generated
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-base">
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

                {/* Streaming Progress */}
                {isGenerating && <StreamingProgress />}

                {/* Workflow Header */}
                {parsedWorkflow && !isGenerating && (
                  <div className="mb-8 p-8 rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border-2 border-pink-200 dark:border-pink-700">
                    <div className="text-center mb-8">
                      <h3 className="text-3xl font-bold mb-3 text-foreground">{parsedWorkflow.title}</h3>
                      <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
                        {parsedWorkflow.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 bg-card rounded-xl shadow-sm border border-border">
                        <div className="text-2xl font-bold text-pink-500 mb-1">
                          {parsedWorkflow.metrics?.automationRate}
                        </div>
                        <div className="text-xs text-muted-foreground font-medium">Automation Rate</div>
                      </div>
                      <div className="text-center p-4 bg-card rounded-xl shadow-sm border border-border">
                        <div className="text-2xl font-bold text-pink-500 mb-1">
                          {parsedWorkflow.metrics?.responseTime}
                        </div>
                        <div className="text-xs text-muted-foreground font-medium">Response Time</div>
                      </div>
                      <div className="text-center p-4 bg-card rounded-xl shadow-sm border border-border">
                        <div className="text-2xl font-bold text-pink-500 mb-1">{parsedWorkflow.metrics?.accuracy}</div>
                        <div className="text-xs text-muted-foreground font-medium">AI Accuracy</div>
                      </div>
                      <div className="text-center p-4 bg-card rounded-xl shadow-sm border border-border">
                        <div className="text-2xl font-bold text-pink-500 mb-1">{parsedWorkflow.estimatedBuildTime}</div>
                        <div className="text-xs text-muted-foreground font-medium">Build Time</div>
                      </div>
                    </div>

                    {/* Integration Summary */}
                    {parsedWorkflow.integrations.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
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
                      <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl shadow-lg">
                        <Workflow className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">Instagram Workflow Steps</h3>
                        <p className="text-muted-foreground">DeepSeek AI generated, Voiceflow-compatible automation steps</p>
                      </div>
                      <Badge variant="outline" className="ml-auto text-base px-3 py-1">
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
                      <div className="w-24 h-24 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
                        <Instagram className="h-12 w-12 text-pink-500" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Ready to Build Your Instagram Automation</h3>
                    <p className="text-center max-w-lg mb-8 text-muted-foreground leading-relaxed">
                      Configure your integrations and automation goals, then describe your Instagram automation needs.
                      DeepSeek AI will create a Voiceflow-compatible workflow tailored to your requirements.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground">
                      <div className="flex flex-col items-center gap-2 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                        <Instagram className="h-5 w-5 text-pink-500" />
                        <span className="font-medium">Instagram DMs</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <Workflow className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">Voiceflow Ready</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <Zap className="h-5 w-5 text-green-500" />
                        <span className="font-medium">Smart Integrations</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <Brain className="h-5 w-5 text-purple-500" />
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
