// "use client"

// import { useState, useEffect, useCallback } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { ArrowLeft, Sparkles, Loader2, CheckCircle, XCircle, Send, Zap, Clock, Users, Target, Settings, Mail, MessageSquare, RefreshCw, ThumbsUp } from "lucide-react"
// import { toast } from "@/hooks/use-toast"

// interface CustomWorkflowBuilderProps {
//   businessInfo: {
//     businessName: string
//     businessType: string
//     description?: string
//     website?: string
//     phone?: string
//     email?: string
//   }
//   selectedWorkflowId?: string | null
//   setStep: (step: "selection" | "dashboard") => void
//   setActiveWorkflowExists: (exists: boolean) => void
//   setActiveWorkflowDetails: (details: any) => void
// }

// interface WorkflowDesign {
//   title: string
//   description: string
//   steps: string[]
//   integrations: string[]
//   scenario: string
//   estimatedTime: string
//   complexity: string
//   benefits: string[]
// }

// export default function CustomWorkflowBuilder({
//   businessInfo,
//   selectedWorkflowId,
//   setStep,
//   setActiveWorkflowExists,
//   setActiveWorkflowDetails,
// }: CustomWorkflowBuilderProps) {
//   const [workflowRequest, setWorkflowRequest] = useState<string>("")
//   const [aiGeneratedDesign, setAiGeneratedDesign] = useState<string>("")
//   const [parsedDesign, setParsedDesign] = useState<WorkflowDesign | null>(null)
//   const [refinementInput, setRefinementInput] = useState<string>("")
//   const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false)
//   const [n8nResponseStatus, setN8nResponseStatus] = useState<string | null>(null)
//   const [requestId, setRequestId] = useState<string | null>(null)
//   const [currentAction, setCurrentAction] = useState<"initial" | "refine" | "approve">("initial")
//   const [conversationHistory, setConversationHistory] = useState<Array<{
//     type: "user" | "ai"
//     content: string
//     timestamp: Date
//   }>>([])
//   const [hasInitialRequest, setHasInitialRequest] = useState<boolean>(false)

//   const n8nWebhookUrl = "https://yaziln8n.onrender.com/webhook/custom-request"

//   // Parse the markdown response into structured data
//   const parseWorkflowDesign = useCallback((markdown: string): WorkflowDesign | null => {
//     try {
//       const lines = markdown.split('\n').filter(line => line.trim())
//       const design: Partial<WorkflowDesign> = {
//         steps: [],
//         integrations: [],
//         benefits: []
//       }

//       let currentSection = ''
      
//       for (const line of lines) {
//         const trimmed = line.trim()
        
//         if (trimmed.startsWith('# ')) {
//           design.title = trimmed.substring(2)
//         } else if (trimmed.startsWith('## ')) {
//           currentSection = trimmed.substring(3).toLowerCase()
//         } else if (trimmed.startsWith('**Description:**') || trimmed.startsWith('**Purpose:**')) {
//           design.description = trimmed.split('**')[2]?.trim() || ''
//         } else if (currentSection.includes('steps') || currentSection.includes('process')) {
//           if (trimmed.match(/^\d+\./)) {
//             design.steps?.push(trimmed)
//           }
//         } else if (currentSection.includes('integration') || currentSection.includes('tools')) {
//           if (trimmed.startsWith('- ')) {
//             design.integrations?.push(trimmed.substring(2))
//           }
//         } else if (currentSection.includes('scenario') || currentSection.includes('example')) {
//           if (!design.scenario) design.scenario = trimmed
//         } else if (currentSection.includes('benefit') || currentSection.includes('advantage')) {
//           if (trimmed.startsWith('- ')) {
//             design.benefits?.push(trimmed.substring(2))
//           }
//         }
//       }

//       // Extract time and complexity estimates
//       const timeMatch = markdown.match(/time[:\s]*(\d+[^\n]*)/i)
//       const complexityMatch = markdown.match(/complexity[:\s]*([^\n]*)/i)
      
//       design.estimatedTime = timeMatch?.[1] || "Not specified"
//       design.complexity = complexityMatch?.[1] || "Medium"

//       return design as WorkflowDesign
//     } catch (error) {
//       console.error("Error parsing workflow design:", error)
//       return null
//     }
//   }, [])

//   const generateWorkflow = useCallback(
//     async (action: "initial" | "refine", instructions?: string, currentDesign?: string) => {
//       setIsLoadingAI(true)
//       setN8nResponseStatus("🤖 AI is analyzing your request and designing your workflow...")
//       setCurrentAction(action)

//       try {
//         const payload: any = {
//           action: action,
//           userEmail: businessInfo.email || "no-email@example.com",
//           businessName: businessInfo.businessName,
//           businessType: businessInfo.businessType,
//           businessDescription: businessInfo.description,
//           website: businessInfo.website,
//           phone: businessInfo.phone,
//           initialPrompt: action === "initial" ? workflowRequest : 
//             `Previous request: ${workflowRequest}. ${instructions || ""}`,
//         }

//         if (requestId) {
//           payload.requestId = requestId
//         }
//         if (instructions) {
//           payload.refinementInstructions = instructions
//         }
//         if (currentDesign) {
//           payload.currentWorkflowDesign = currentDesign
//         }

//         const response = await fetch(n8nWebhookUrl, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//         })

//         const result = await response.json()

//         if (response.ok && result.status === "success" && result.workflowDesign) {
//           setAiGeneratedDesign(result.workflowDesign)
//           const parsed = parseWorkflowDesign(result.workflowDesign)
//           setParsedDesign(parsed)
//           setN8nResponseStatus("✅ Workflow design generated successfully!")
          
//           if (!requestId) {
//             setRequestId(result.requestId)
//           }

//           // Add to conversation history
//           const newHistory = [...conversationHistory]
//           if (action === "initial") {
//             newHistory.push({
//               type: "user",
//               content: workflowRequest,
//               timestamp: new Date()
//             })
//           } else {
//             newHistory.push({
//               type: "user", 
//               content: instructions || "",
//               timestamp: new Date()
//             })
//           }
//           newHistory.push({
//             type: "ai",
//             content: result.workflowDesign,
//             timestamp: new Date()
//           })
//           setConversationHistory(newHistory)

//           toast({
//             title: "🎉 Workflow Design Ready!",
//             description: "Your custom workflow has been generated. Review it below!",
//             variant: "default",
//           })
//         } else {
//           setN8nResponseStatus(`❌ Error: ${result.message || "Failed to generate workflow."}`)
//           toast({
//             title: "Design Generation Failed",
//             description: result.message || "An error occurred while generating the workflow.",
//             variant: "destructive",
//           })
//         }
//       } catch (error) {
//         setN8nResponseStatus("🔌 Network error - please check your connection and try again.")
//         toast({
//           title: "Network Error",
//           description: "Could not connect to the workflow builder. Please try again.",
//           variant: "destructive",
//         })
//       } finally {
//         setIsLoadingAI(false)
//       }
//     },
//     [businessInfo, workflowRequest, requestId, conversationHistory, parseWorkflowDesign],
//   )

//   const handleInitialSubmit = () => {
//     if (!workflowRequest.trim()) {
//       toast({
//         title: "Please describe your workflow needs",
//         description: "Tell us what kind of automation you want to build.",
//         variant: "destructive",
//       })
//       return
//     }
//     setHasInitialRequest(true)
//     generateWorkflow("initial")
//   }

//   const handleRefine = () => {
//     if (!refinementInput.trim()) {
//       toast({
//         title: "Please provide refinement instructions",
//         description: "Tell us how you'd like to improve the workflow design.",
//         variant: "destructive",
//       })
//       return
//     }
//     generateWorkflow("refine", refinementInput, aiGeneratedDesign)
//     setRefinementInput("")
//   }

//   const handleApprove = async () => {
//     setIsLoadingAI(true)
//     setN8nResponseStatus("📧 Sending final design to our team...")
//     setCurrentAction("approve")

//     try {
//       const payload = {
//         action: "approve",
//         requestId: requestId,
//         userEmail: businessInfo.email || "no-email@example.com",
//         currentWorkflowDesign: aiGeneratedDesign,
//         businessName: businessInfo.businessName,
//         businessType: businessInfo.businessType,
//         businessDescription: businessInfo.description,
//         website: businessInfo.website,
//         phone: businessInfo.phone,
//       }

//       const response = await fetch(n8nWebhookUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       })

//       const result = await response.json()

//       if (response.ok && result.status === "success") {
//         setN8nResponseStatus("✅ Workflow approved! Our team will implement it for you.")
//         toast({
//           title: "🎉 Workflow Approved!",
//           description: "Your final workflow design has been sent to our development team.",
//           variant: "default",
//         })
        
//         setActiveWorkflowExists(true)
//         setActiveWorkflowDetails({
//           id: requestId || "custom-workflow",
//           workflowTemplate: { name: parsedDesign?.title || "Custom Workflow" },
//           businessInfo: businessInfo,
//           customRequest: aiGeneratedDesign,
//           parsedDesign: parsedDesign,
//           status: "PENDING_IMPLEMENTATION",
//           credentials: [],
//         })
        
//         setTimeout(() => {
//           setStep("dashboard")
//         }, 2000)
//       } else {
//         setN8nResponseStatus(`❌ Error: ${result.message || "Failed to approve workflow."}`)
//         toast({
//           title: "Approval Failed",
//           description: result.message || "An error occurred while approving the workflow.",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       setN8nResponseStatus("🔌 Network error during approval.")
//       toast({
//         title: "Network Error",
//         description: "Could not connect to approve the workflow. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoadingAI(false)
//     }
//   }

//   const WorkflowDisplay = ({ design }: { design: WorkflowDesign }) => (
//     <div className="space-y-6">
//       <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
//         <h3 className="text-2xl font-bold mb-2 text-primary">{design.title}</h3>
//         <p className="text-muted-foreground">{design.description}</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Card className="p-4">
//           <div className="flex items-center gap-2 mb-2">
//             <Clock className="h-4 w-4 text-primary" />
//             <span className="font-semibold">Estimated Time</span>
//           </div>
//           <p className="text-sm text-muted-foreground">{design.estimatedTime}</p>
//         </Card>
//         <Card className="p-4">
//           <div className="flex items-center gap-2 mb-2">
//             <Settings className="h-4 w-4 text-primary" />
//             <span className="font-semibold">Complexity</span>
//           </div>
//           <p className="text-sm text-muted-foreground">{design.complexity}</p>
//         </Card>
//         <Card className="p-4">
//           <div className="flex items-center gap-2 mb-2">
//             <Target className="h-4 w-4 text-primary" />
//             <span className="font-semibold">Steps</span>
//           </div>
//           <p className="text-sm text-muted-foreground">{design.steps.length} steps</p>
//         </Card>
//       </div>

//       <Card className="p-6">
//         <h4 className="font-semibold mb-4 flex items-center gap-2">
//           <Zap className="h-5 w-5 text-primary" />
//           Workflow Steps
//         </h4>
//         <div className="space-y-3">
//           {design.steps.map((step, index) => (
//             <div key={index} className="flex items-start gap-3 p-3 bg-accent/30 rounded-lg">
//               <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
//                 {index + 1}
//               </div>
//               <p className="text-sm flex-grow">{step.replace(/^\d+\.\s*/, '')}</p>
//             </div>
//           ))}
//         </div>
//       </Card>

//       {design.integrations && design.integrations.length > 0 && (
//         <Card className="p-6">
//           <h4 className="font-semibold mb-4 flex items-center gap-2">
//             <Users className="h-5 w-5 text-primary" />
//             Required Integrations
//           </h4>
//           <div className="flex flex-wrap gap-2">
//             {design.integrations.map((integration, index) => (
//               <Badge key={index} variant="secondary" className="text-xs">
//                 {integration}
//               </Badge>
//             ))}
//           </div>
//         </Card>
//       )}

//       {design.benefits && design.benefits.length > 0 && (
//         <Card className="p-6">
//           <h4 className="font-semibold mb-4 flex items-center gap-2">
//             <ThumbsUp className="h-5 w-5 text-primary" />
//             Key Benefits
//           </h4>
//           <ul className="space-y-2">
//             {design.benefits.map((benefit, index) => (
//               <li key={index} className="flex items-start gap-2 text-sm">
//                 <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
//                 {benefit}
//               </li>
//             ))}
//           </ul>
//         </Card>
//       )}

//       {design.scenario && (
//         <Card className="p-6">
//           <h4 className="font-semibold mb-4 flex items-center gap-2">
//             <MessageSquare className="h-5 w-5 text-primary" />
//             Example Scenario
//           </h4>
//           <p className="text-sm text-muted-foreground italic bg-accent/30 p-4 rounded-lg">
//             {design.scenario}
//           </p>
//         </Card>
//       )}
//     </div>
//   )

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="radial--gradient--automations">
//         <div className="max-w-7xl mx-auto p-6">
//           <div className="mb-8">
//             <Button variant="ghost" onClick={() => setStep("selection")} className="mb-6 hover:bg-accent">
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Back to Selection
//             </Button>
//             <div className="text-center mb-8">
//               <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                 🤖 AI-Powered Workflow Designer
//               </h1>
//               <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
//                 Describe your automation needs and our AI will create a detailed, actionable workflow design tailored specifically for your business.
//               </p>
//             </div>
//           </div>

//           <div className="grid gap-8 lg:grid-cols-3">
//             {/* Left Column - Input */}
//             <div className="lg:col-span-1 space-y-6">
//               <Card className="glassEffect border-2 border-border/50">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Send className="h-5 w-5 text-primary" />
//                     {!hasInitialRequest ? "Describe Your Workflow" : "Refine Your Workflow"}
//                   </CardTitle>
//                   <CardDescription>
//                     {!hasInitialRequest 
//                       ? "Tell us what kind of automation you want to build"
//                       : "Provide feedback to improve the design"
//                     }
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   {!hasInitialRequest ? (
//                     <>
//                       <div className="space-y-2">
//                         <Label htmlFor="workflowRequest">What do you want to automate?</Label>
//                         <Textarea
//                           id="workflowRequest"
//                           value={workflowRequest}
//                           onChange={(e) => setWorkflowRequest(e.target.value)}
//                           placeholder="e.g., 'I want to automatically respond to customer inquiries on social media and route them to the right team member based on the topic'"
//                           rows={6}
//                           className="bg-background/50 border-border/50 focus:border-primary resize-none"
//                           disabled={isLoadingAI}
//                         />
//                       </div>
//                       <Button
//                         onClick={handleInitialSubmit}
//                         disabled={isLoadingAI || !workflowRequest.trim()}
//                         className="w-full flex items-center gap-2"
//                       >
//                         {isLoadingAI ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
//                         Generate Workflow Design
//                       </Button>
//                     </>
//                   ) : (
//                     <>
//                       <div className="space-y-2">
//                         <Label htmlFor="refinementInput">How should we improve it?</Label>
//                         <Textarea
//                           id="refinementInput"
//                           value={refinementInput}
//                           onChange={(e) => setRefinementInput(e.target.value)}
//                           placeholder="e.g., 'Add integration with Slack for team notifications', 'Make it work with Instagram too', 'Simplify the approval process'"
//                           rows={4}
//                           className="bg-background/50 border-border/50 focus:border-primary resize-none"
//                           disabled={isLoadingAI}
//                         />
//                       </div>
//                       <div className="flex gap-2">
//                         <Button
//                           onClick={handleRefine}
//                           disabled={isLoadingAI || !refinementInput.trim()}
//                           className="flex-1 flex items-center gap-2"
//                         >
//                           {isLoadingAI && currentAction === "refine" ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
//                           Refine
//                         </Button>
//                         <Button
//                           onClick={handleApprove}
//                           disabled={isLoadingAI || !aiGeneratedDesign}
//                           className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
//                         >
//                           {isLoadingAI && currentAction === "approve" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ThumbsUp className="h-4 w-4" />}
//                           Approve
//                         </Button>
//                       </div>
//                     </>
//                   )}
//                 </CardContent>
//               </Card>

//               <Card className="glassEffect border-2 border-border/50">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <CheckCircle className="h-5 w-5 text-primary" />
//                     Business Context
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-3 text-sm">
//                   <div>
//                     <span className="font-semibold text-primary">Business:</span>
//                     <p className="text-muted-foreground">{businessInfo.businessName}</p>
//                   </div>
//                   <div>
//                     <span className="font-semibold text-primary">Type:</span>
//                     <p className="text-muted-foreground">{businessInfo.businessType}</p>
//                   </div>
//                   {businessInfo.description && (
//                     <div>
//                       <span className="font-semibold text-primary">Description:</span>
//                       <p className="text-muted-foreground">{businessInfo.description}</p>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Right Column - Output */}
//             <div className="lg:col-span-2">
//               <Card className="glassEffect border-2 border-border/50 min-h-[600px]">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Sparkles className="h-5 w-5 text-primary" />
//                     Your Custom Workflow Design
//                   </CardTitle>
//                   <CardDescription>
//                     AI-generated workflow tailored to your specific business needs
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   {isLoadingAI && (
//                     <div className="flex flex-col items-center justify-center py-20">
//                       <div className="relative">
//                         <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
//                         <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary" />
//                       </div>
//                       <p className="mt-6 text-lg font-medium text-primary">{n8nResponseStatus}</p>
//                       <p className="text-sm text-muted-foreground mt-2">This usually takes 10-30 seconds</p>
//                     </div>
//                   )}
                  
//                   {!isLoadingAI && parsedDesign && (
//                     <WorkflowDisplay design={parsedDesign} />
//                   )}
                  
//                   {!isLoadingAI && aiGeneratedDesign && !parsedDesign && (
//                     <div className="bg-accent/30 p-6 rounded-lg">
//                       <h3 className="font-semibold mb-4">Raw AI Response:</h3>
//                       <pre className="whitespace-pre-wrap text-sm text-muted-foreground overflow-auto">
//                         {aiGeneratedDesign}
//                       </pre>
//                     </div>
//                   )}
                  
//                   {!isLoadingAI && !aiGeneratedDesign && n8nResponseStatus && (
//                     <div className="flex flex-col items-center justify-center py-20 text-red-500">
//                       <XCircle className="h-12 w-12 mb-4" />
//                       <p className="text-lg font-medium">{n8nResponseStatus}</p>
//                       <Button 
//                         variant="outline" 
//                         onClick={() => window.location.reload()} 
//                         className="mt-4"
//                       >
//                         Try Again
//                       </Button>
//                     </div>
//                   )}
                  
//                   {!isLoadingAI && !aiGeneratedDesign && !n8nResponseStatus && !hasInitialRequest && (
//                     <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
//                       <div className="relative mb-6">
//                         <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
//                           <Sparkles className="h-10 w-10 text-primary" />
//                         </div>
//                       </div>
//                       <h3 className="text-xl font-semibold mb-2">Ready to Design Your Workflow</h3>
//                       <p className="text-center max-w-md">
//                         Describe what you want to automate and our AI will create a detailed workflow design for your business.
//                       </p>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }



import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Sparkles, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Send, 
  Clock, 
  Settings, 
  Target, 
  ThumbsUp, 
  Bot, 
  Mic, 
  Phone, 
  MessageCircle,
  RefreshCw,
  Users,
  MessageSquare,
  Zap
} from 'lucide-react';

// TypeScript interfaces
interface VoiceflowWorkflowBuilderProps {
  businessInfo?: {
    businessName: string;
    businessType: string;
    description?: string;
    website?: string;
    phone?: string;
    email?: string;
  };
  selectedWorkflowId?: string | null;
  setStep?: (step: "selection" | "dashboard") => void;
  setActiveWorkflowExists?: (exists: boolean) => void;
  setActiveWorkflowDetails?: (details: any) => void;
}

interface ConversationStep {
  id: string;
  type: "greeting" | "question" | "response" | "action" | "condition" | "integration";
  content: string;
  nextSteps?: string[];
  voiceflowBlockType: string;
}

interface Intent {
  name: string;
  description: string;
  examples: string[];
  confidence: number;
}

interface Entity {
  name: string;
  type: "system" | "custom";
  values: string[];
  description: string;
}

interface VoiceflowBlock {
  type: "speak" | "listen" | "condition" | "api" | "set" | "card" | "carousel" | "integration";
  name: string;
  description: string;
  configuration: Record<string, any>;
}

interface VoiceflowWorkflowDesign {
  title: string;
  description: string;
  conversationFlow: ConversationStep[];
  intents: Intent[];
  entities: Entity[];
  integrations: string[];
  voiceflowBlocks: VoiceflowBlock[];
  scenario: string;
  estimatedTime: string;
  complexity: string;
  benefits: string[];
  voiceCapabilities: string[];
  channels: string[];
}

interface ChannelOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface VoiceCapabilityOption {
  id: string;
  label: string;
}

// Mock business info for demo
const mockBusinessInfo = {
  businessName: "TechCorp Solutions",
  businessType: "Technology Company",
  description: "We provide innovative tech solutions for businesses",
  website: "https://techcorp.com",
  phone: "+1-555-0123",
  email: "contact@techcorp.com"
};

const VoiceflowWorkflowBuilder: React.FC<VoiceflowWorkflowBuilderProps> = ({
  businessInfo = mockBusinessInfo,
  selectedWorkflowId,
  setStep,
  setActiveWorkflowExists,
  setActiveWorkflowDetails,
}) => {
  const [workflowRequest, setWorkflowRequest] = useState<string>("");
  const [aiGeneratedDesign, setAiGeneratedDesign] = useState<string>("");
  const [parsedDesign, setParsedDesign] = useState<VoiceflowWorkflowDesign | null>(null);
  const [refinementInput, setRefinementInput] = useState<string>("");
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);
  const [responseStatus, setResponseStatus] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [currentAction, setCurrentAction] = useState<"initial" | "refine" | "approve">("initial");
  const [hasInitialRequest, setHasInitialRequest] = useState<boolean>(false);
  const [selectedChannels, setSelectedChannels] = useState<string[]>(["instagram"]);
  const [voiceCapabilities, setVoiceCapabilities] = useState<string[]>(["auto-reply"]);

  const n8nWebhookUrl = "https://yaziln8n.onrender.com/webhook/voiceflow-workflow-builder";

  const channelOptions: ChannelOption[] = [
    { id: "voice", label: "Voice Assistant", icon: Mic },
    { id: "chat", label: "Text Chat", icon: MessageCircle },
    { id: "phone", label: "Phone System", icon: Phone },
    { id: "web", label: "Web Widget", icon: Bot }
  ];

  const voiceCapabilityOptions: VoiceCapabilityOption[] = [
    { id: "speech-to-text", label: "Speech Recognition" },
    { id: "text-to-speech", label: "Voice Synthesis" },
    { id: "voice-biometrics", label: "Voice Authentication" },
    { id: "sentiment-analysis", label: "Emotion Detection" },
    { id: "multilingual", label: "Multi-language Support" }
  ];

  // Sample parsed design for demonstration
  const sampleDesign: VoiceflowWorkflowDesign = {
    title: "Customer Support Voice Assistant",
    description: "An intelligent voice assistant to handle customer inquiries, process orders, and provide support",
    conversationFlow: [
      {
        id: "step_1",
        type: "greeting",
        content: "Welcome to TechCorp! I'm your virtual assistant. How can I help you today?",
        voiceflowBlockType: "speak"
      },
      {
        id: "step_2", 
        type: "question",
        content: "Listen for user intent (order status, technical support, billing inquiry)",
        voiceflowBlockType: "listen"
      },
      {
        id: "step_3",
        type: "condition",
        content: "Route based on detected intent to appropriate workflow",
        voiceflowBlockType: "condition"
      },
      {
        id: "step_4",
        type: "response",
        content: "Provide personalized response based on customer data and request",
        voiceflowBlockType: "api"
      }
    ],
    intents: [
      {
        name: "check_order_status",
        description: "User wants to check their order status",
        examples: ["Where is my order?", "Order status", "Track my package"],
        confidence: 0.95
      },
      {
        name: "technical_support",
        description: "User needs technical help",
        examples: ["I need help", "Technical issue", "Something is broken"],
        confidence: 0.90
      },
      {
        name: "billing_inquiry",
        description: "User has billing questions",
        examples: ["Billing question", "Payment issue", "Refund request"],
        confidence: 0.88
      }
    ],
    entities: [
      {
        name: "order_number",
        type: "custom",
        values: ["ORD-12345", "ORDER-67890"],
        description: "Customer order reference numbers"
      },
      {
        name: "product_type",
        type: "custom", 
        values: ["software", "hardware", "service"],
        description: "Types of products offered"
      }
    ],
    voiceflowBlocks: [
      {
        type: "speak",
        name: "Welcome Message",
        description: "Initial greeting and introduction",
        configuration: {}
      },
      {
        type: "listen",
        name: "Intent Capture",
        description: "Capture and classify user intent",
        configuration: {}
      },
      {
        type: "condition",
        name: "Intent Router",
        description: "Route conversation based on intent",
        configuration: {}
      },
      {
        type: "api",
        name: "Data Integration",
        description: "Fetch customer data and order information",
        configuration: {}
      }
    ],
    integrations: ["CRM System", "Order Management", "Knowledge Base"],
    voiceCapabilities: ["Speech Recognition", "Natural Language Processing", "Voice Synthesis"],
    channels: ["Voice Assistant", "Phone System"],
    benefits: [
      "24/7 automated customer support",
      "Reduced wait times for customers",
      "Consistent service quality",
      "Cost reduction in support operations",
      "Scalable customer service solution"
    ],
    scenario: "Customer calls and says: 'Hi, I'd like to check on my order.' Assistant responds: 'I'd be happy to help you check your order status. Could you please provide your order number?' Customer: 'It's ORD-12345.' Assistant: 'Let me look that up for you... I found your order! It was shipped yesterday and should arrive by Friday.'",
    estimatedTime: "2-3 weeks",
    complexity: "Medium"
  };

  const generateWorkflow = useCallback(async (
    action: "initial" | "refine" | "approve", 
    instructions?: string, 
    currentDesign?: string
  ): Promise<void> => {
    setIsLoadingAI(true);
    setResponseStatus("🤖 AI is designing your Voiceflow conversation workflow...");
    setCurrentAction(action);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate successful response
      setAiGeneratedDesign("Generated workflow design");
      setParsedDesign(sampleDesign);
      setResponseStatus("✅ Voiceflow workflow design generated successfully!");
      setHasInitialRequest(true);
      
      if (!requestId) {
        setRequestId("vf-" + Date.now());
      }
      
    } catch (error) {
      setResponseStatus("❌ Error generating workflow. Please try again.");
    } finally {
      setIsLoadingAI(false);
    }
  }, [requestId]);

  const handleInitialSubmit = (): void => {
    if (!workflowRequest.trim()) {
      setResponseStatus("❌ Please describe your social media automation needs");
      return;
    }
    if (selectedChannels.length === 0) {
      setResponseStatus("❌ Please select at least one social media platform");
      return;
    }
    generateWorkflow("initial");
  };

  const handleRefine = (): void => {
    if (!refinementInput.trim()) {
      setResponseStatus("❌ Please provide refinement instructions");
      return;
    }
    generateWorkflow("refine", refinementInput, aiGeneratedDesign);
    setRefinementInput("");
  };

  const handleApprove = async (): Promise<void> => {
    setIsLoadingAI(true);
    setResponseStatus("📧 Sending final Voiceflow design to the development team...");
    setCurrentAction("approve");

    try {
      // Simulate approval process
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResponseStatus("✅ Voiceflow workflow approved! Development team will implement it.");
      
      // Simulate navigation to dashboard after approval
      setTimeout(() => {
        alert("Workflow approved! Redirecting to dashboard...");
      }, 1500);
      
    } catch (error) {
      setResponseStatus("❌ Error approving workflow. Please try again.");
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleChannelToggle = (channelId: string): void => {
    setSelectedChannels(prev => 
      prev.includes(channelId) 
        ? prev.filter(c => c !== channelId)
        : [...prev, channelId]
    );
  };

  const handleVoiceCapabilityToggle = (capabilityId: string, checked: boolean): void => {
    if (checked) {
      setVoiceCapabilities(prev => [...prev, capabilityId]);
    } else {
      setVoiceCapabilities(prev => prev.filter(c => c !== capabilityId));
    }
  };

  const VoiceflowWorkflowDisplay: React.FC<{ design: VoiceflowWorkflowDesign }> = ({ design }) => (
    <div className="space-y-6">
      <div className="text-center p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg">
        <h3 className="text-2xl font-bold mb-2 text-primary flex items-center justify-center gap-2">
          <Bot className="h-6 w-6" />
          {design.title}
        </h3>
        <p className="text-muted-foreground">{design.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="font-semibold">Build Time</span>
          </div>
          <p className="text-sm text-muted-foreground">{design.estimatedTime}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-4 w-4 text-blue-500" />
            <span className="font-semibold">Complexity</span>
          </div>
          <p className="text-sm text-muted-foreground">{design.complexity}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="h-4 w-4 text-blue-500" />
            <span className="font-semibold">Flow Steps</span>
          </div>
          <p className="text-sm text-muted-foreground">{design.conversationFlow?.length || 0} steps</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-blue-500" />
            <span className="font-semibold">Intents</span>
          </div>
          <p className="text-sm text-muted-foreground">{design.intents?.length || 0} intents</p>
        </Card>
      </div>

      <Card className="p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-blue-500" />
          Conversation Flow
        </h4>
        <div className="space-y-3">
          {design.conversationFlow?.map((step, index) => (
            <div key={step.id} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">{step.type}</Badge>
                  <Badge variant="secondary" className="text-xs">{step.voiceflowBlockType}</Badge>
                </div>
                <p className="text-sm">{step.content}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {design.intents && design.intents.length > 0 && (
        <Card className="p-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Conversation Intents
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {design.intents.map((intent, index) => (
              <div key={index} className="p-3 bg-accent/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs font-bold">{intent.name}</Badge>
                  <Badge variant="secondary" className="text-xs">{Math.round(intent.confidence * 100)}%</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{intent.description}</p>
                <div className="mt-2">
                  <p className="text-xs font-medium">Examples:</p>
                  <p className="text-xs text-muted-foreground">{intent.examples.join(", ")}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {design.voiceflowBlocks && design.voiceflowBlocks.length > 0 && (
        <Card className="p-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-500" />
            Voiceflow Blocks
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {design.voiceflowBlocks.map((block, index) => (
              <div key={index} className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs font-bold">{block.type}</Badge>
                </div>
                <p className="text-sm font-medium">{block.name}</p>
                <p className="text-xs text-muted-foreground">{block.description}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {design.benefits && design.benefits.length > 0 && (
        <Card className="p-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <ThumbsUp className="h-5 w-5 text-blue-500" />
            Key Benefits
          </h4>
          <ul className="space-y-2">
            {design.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {design.scenario && (
        <Card className="p-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            Example Conversation
          </h4>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground italic whitespace-pre-wrap">
              {design.scenario}
            </p>
          </div>
        </Card>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" className="mb-6 hover:bg-accent" onClick={() => setStep?.("selection")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Selection
          </Button>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              🤖 AI Social Media Automation Designer
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Create intelligent automation workflows for social media platforms. Design smart response systems for Instagram, Facebook, and other platforms to handle customer inquiries automatically.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Input */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-500" />
                  {!hasInitialRequest ? "Design Your Conversation" : "Refine Your Workflow"}
                </CardTitle>
                <CardDescription>
                  {!hasInitialRequest 
                    ? "Describe the conversational experience you want to create"
                    : "Provide feedback to improve the conversation design"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!hasInitialRequest && (
                  <>
                    <div className="space-y-2">
                      <Label>Social Media Platforms</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {channelOptions.map((channel) => (
                          <button
                            key={channel.id}
                            onClick={() => handleChannelToggle(channel.id)}
                            className={`p-2 rounded-lg border text-left transition-all ${
                              selectedChannels.includes(channel.id)
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'bg-background border-border hover:border-blue-300'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <channel.icon className="h-4 w-4" />
                              <span className="text-sm font-medium">{channel.label}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Automation Features</Label>
                      <div className="space-y-2">
                        {voiceCapabilityOptions.map((capability) => (
                          <label
                            key={capability.id}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={voiceCapabilities.includes(capability.id)}
                              onChange={(e) => handleVoiceCapabilityToggle(capability.id, e.target.checked)}
                              className="rounded border-border"
                            />
                            <span className="text-sm">{capability.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {!hasInitialRequest ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="workflowRequest">What social media automation do you want to create?</Label>
                      <Textarea
                        id="workflowRequest"
                        value={workflowRequest}
                        onChange={(e) => setWorkflowRequest(e.target.value)}
                        placeholder="e.g., 'I want to automatically respond to Instagram DMs about product inquiries, route support requests to human agents, and send automated follow-ups for abandoned cart messages on Facebook Messenger'"
                        rows={6}
                        className="bg-background/50 border-border/50 focus:border-blue-500 resize-none"
                        disabled={isLoadingAI}
                      />
                    </div>
                    <Button
                      onClick={handleInitialSubmit}
                      disabled={isLoadingAI || !workflowRequest.trim()}
                      className="w-full flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
                    >
                      {isLoadingAI ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />}
                      Generate Social Media Automation
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="refinementInput">How should we improve the automation?</Label>
                      <Textarea
                        id="refinementInput"
                        value={refinementInput}
                        onChange={(e) => setRefinementInput(e.target.value)}
                        placeholder="e.g., 'Add integration with Shopify for order status', 'Include sentiment analysis for angry customers', 'Add automatic escalation to human agents'"
                        rows={4}
                        className="bg-background/50 border-border/50 focus:border-blue-500 resize-none"
                        disabled={isLoadingAI}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleRefine}
                        disabled={isLoadingAI || !refinementInput.trim()}
                        className="flex-1 flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
                      >
                        {isLoadingAI && currentAction === "refine" ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                        Refine
                      </Button>
                      <Button
                        onClick={handleApprove}
                        disabled={isLoadingAI || !aiGeneratedDesign}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                      >
                        {isLoadingAI && currentAction === "approve" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ThumbsUp className="h-4 w-4" />}
                        Approve
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="border-2 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                  Business Context
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <span className="font-semibold text-blue-500">Business:</span>
                  <p className="text-muted-foreground">{businessInfo.businessName}</p>
                </div>
                <div>
                  <span className="font-semibold text-blue-500">Type:</span>
                  <p className="text-muted-foreground">{businessInfo.businessType}</p>
                </div>
                {businessInfo.description && (
                  <div>
                    <span className="font-semibold text-blue-500">Description:</span>
                    <p className="text-muted-foreground">{businessInfo.description}</p>
                  </div>
                )}
                {selectedChannels.length > 0 && (
                  <div>
                    <span className="font-semibold text-blue-500">Channels:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedChannels.map(channel => (
                        <Badge key={channel} variant="secondary" className="text-xs">
                          {channelOptions.find(c => c.id === channel)?.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Output */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-blue-200 dark:border-blue-800 min-h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-500" />
                  Your Social Media Automation Design
                </CardTitle>
                <CardDescription>
                  AI-generated automation workflow ready for social media implementation
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingAI && (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                      <Bot className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-500" />
                    </div>
                    <p className="mt-6 text-lg font-medium text-blue-500">{responseStatus}</p>
                    <p className="text-sm text-muted-foreground mt-2">Designing your conversational experience...</p>
                  </div>
                )}
                
                {!isLoadingAI && parsedDesign && (
                  <VoiceflowWorkflowDisplay design={parsedDesign} />
                )}
                
                {!isLoadingAI && !parsedDesign && responseStatus && (
                  <div className="flex flex-col items-center justify-center py-20 text-red-500">
                    <XCircle className="h-12 w-12 mb-4" />
                    <p className="text-lg font-medium">{responseStatus}</p>
                    <Button 
                      variant="outline" 
                      onClick={() => window.location.reload()} 
                      className="mt-4"
                    >
                      Try Again
                    </Button>
                  </div>
                )}
                
                {!isLoadingAI && !parsedDesign && !responseStatus && !hasInitialRequest && (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                        <Bot className="h-10 w-10 text-blue-500" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Ready to Design Your Social Media Automation</h3>
                    <p className="text-center max-w-md">
                      Describe your social media automation needs and our AI will create a detailed workflow for Instagram, Facebook, and other platforms.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceflowWorkflowBuilder;