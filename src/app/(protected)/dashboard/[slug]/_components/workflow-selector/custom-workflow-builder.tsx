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
  Zap,
  AlertCircle,
  FileText,
  PlayCircle
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

interface WorkflowStep {
  stepNumber: number;
  title: string;
  description: string;
  type: string;
  inputs?: string[];
  outputs?: string[];
  conditions?: string[];
  integrations?: string[];
}

interface Integration {
  name: string;
  type: string;
  description: string;
  required: boolean;
  setupInstructions: string;
}

interface ParsedWorkflow {
  title: string;
  description: string;
  platform: string;
  estimatedBuildTime: string;
  complexity: string;
  steps: WorkflowStep[];
  integrations: Integration[];
  benefits: string[];
  exampleScenario: string;
  technicalRequirements: string[];
  deploymentChannels: string[];
}

interface ChannelOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface AutomationFeature {
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
  const [aiRawResponse, setAiRawResponse] = useState<string>("");
  const [parsedWorkflow, setParsedWorkflow] = useState<ParsedWorkflow | null>(null);
  const [refinementInput, setRefinementInput] = useState<string>("");
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);
  const [responseStatus, setResponseStatus] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [currentAction, setCurrentAction] = useState<"initial" | "refine" | "approve">("initial");
  const [hasInitialRequest, setHasInitialRequest] = useState<boolean>(false);
  const [selectedChannels, setSelectedChannels] = useState<string[]>(["instagram"]);
  const [automationFeatures, setAutomationFeatures] = useState<string[]>(["auto-reply"]);
  const [showRawResponse, setShowRawResponse] = useState<boolean>(false);

  const n8nWebhookUrl = "https://yaziln8n.onrender.com/webhook/voiceflow-workflow-builder";

  const channelOptions: ChannelOption[] = [
    { id: "instagram", label: "Instagram DMs", icon: MessageCircle },
    { id: "facebook", label: "Facebook Messenger", icon: MessageSquare },
    { id: "whatsapp", label: "WhatsApp Business", icon: Phone },
    { id: "telegram", label: "Telegram Bot", icon: Bot },
    { id: "web", label: "Website Chat", icon: Mic }
  ];

  const automationFeatureOptions: AutomationFeature[] = [
    { id: "auto-reply", label: "Automatic Responses" },
    { id: "sentiment-analysis", label: "Sentiment Analysis" },
    { id: "intent-detection", label: "Intent Recognition" },
    { id: "multilingual", label: "Multi-language Support" },
    { id: "smart-routing", label: "Smart Agent Routing" }
  ];

  // Function to parse AI markdown response into structured workflow
  const parseAIResponse = (markdownText: string): ParsedWorkflow | null => {
    try {
      if (!markdownText || markdownText.trim().length === 0) {
        return null;
      }

      const lines = markdownText.split('\n');
      let workflow: Partial<ParsedWorkflow> = {
        steps: [],
        integrations: [],
        benefits: [],
        technicalRequirements: [],
        deploymentChannels: selectedChannels
      };

      let currentSection = '';
      let stepCounter = 1;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line.startsWith('# ')) {
          workflow.title = line.substring(2).trim();
        } else if (line.startsWith('## ')) {
          currentSection = line.substring(3).toLowerCase().trim();
        } else if (line.includes('**Description:**')) {
          workflow.description = line.replace(/.*\*\*Description:\*\*\s*/, '').trim();
        } else if (line.includes('**Platform:**')) {
          workflow.platform = line.replace(/.*\*\*Platform:\*\*\s*/, '').trim();
        } else if (line.includes('**Estimated Build Time:**')) {
          workflow.estimatedBuildTime = line.replace(/.*\*\*Estimated Build Time:\*\*\s*/, '').trim();
        } else if (line.includes('**Complexity:**')) {
          workflow.complexity = line.replace(/.*\*\*Complexity:\*\*\s*/, '').trim();
        } else if (currentSection.includes('workflow') || currentSection.includes('steps') || currentSection.includes('process')) {
          if (line.match(/^\d+\./)) {
            const stepText = line.replace(/^\d+\.\s*/, '');
            const [title, ...descParts] = stepText.split(':');
            workflow.steps?.push({
              stepNumber: stepCounter++,
              title: title.trim(),
              description: descParts.join(':').trim() || title.trim(),
              type: "automation",
              inputs: [],
              outputs: []
            });
          }
        } else if (currentSection.includes('integration')) {
          if (line.startsWith('- ') || line.startsWith('* ')) {
            const integrationText = line.substring(2);
            const [name, ...descParts] = integrationText.split(':');
            workflow.integrations?.push({
              name: name.trim(),
              type: "api",
              description: descParts.join(':').trim() || "Integration required for workflow",
              required: true,
              setupInstructions: "Configuration required during implementation"
            });
          }
        } else if (currentSection.includes('benefit')) {
          if (line.startsWith('- ') || line.startsWith('* ')) {
            workflow.benefits?.push(line.substring(2).trim());
          }
        } else if (currentSection.includes('scenario') || currentSection.includes('example')) {
          if (line.length > 0 && !line.startsWith('#') && !line.startsWith('*')) {
            workflow.exampleScenario = (workflow.exampleScenario || '') + line + ' ';
          }
        } else if (currentSection.includes('technical') || currentSection.includes('requirement')) {
          if (line.startsWith('- ') || line.startsWith('* ')) {
            workflow.technicalRequirements?.push(line.substring(2).trim());
          }
        }
      }

      // Set defaults if not found
      workflow.title = workflow.title || "AI-Generated Social Media Automation";
      workflow.description = workflow.description || "Custom automation workflow for social media platforms";
      workflow.platform = workflow.platform || "Multi-Platform";
      workflow.estimatedBuildTime = workflow.estimatedBuildTime || "2-3 weeks";
      workflow.complexity = workflow.complexity || "Medium";
      workflow.exampleScenario = workflow.exampleScenario?.trim() || "Automated customer interaction workflow";

      return workflow as ParsedWorkflow;
    } catch (error) {
      console.error("Error parsing AI response:", error);
      return null;
    }
  };

  const generateWorkflow = useCallback(async (
    action: "initial" | "refine", 
    instructions?: string, 
    currentDesign?: string
  ): Promise<void> => {
    setIsLoadingAI(true);
    setResponseStatus("🤖 AI is designing your social media automation workflow...");
    setCurrentAction(action);
    setHasInitialRequest(true);

    try {
      const payload = {
        action: action,
        platform: "social-media-automation",
        userEmail: businessInfo.email || "no-email@example.com",
        businessName: businessInfo.businessName,
        businessType: businessInfo.businessType,
        businessDescription: businessInfo.description,
        website: businessInfo.website,
        phone: businessInfo.phone,
        selectedChannels: selectedChannels,
        automationFeatures: automationFeatures,
        workflowRequest: workflowRequest,
        initialPrompt: action === "initial" ? workflowRequest : 
          `Previous request: ${workflowRequest}. Refinement: ${instructions || ""}`,
        ...(requestId && { requestId }),
        ...(instructions && { refinementInstructions: instructions }),
        ...(currentDesign && { currentWorkflowDesign: currentDesign })
      };

      console.log("🚀 Sending request to N8N:", payload);

      const response = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("📡 N8N Response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("📋 N8N Response data:", result);

      if (result.status === "success" && result.workflowDesign) {
        // Store the raw AI response
        setAiRawResponse(result.workflowDesign);
        
        // Parse the AI response into structured data
        const parsed = parseAIResponse(result.workflowDesign);
        
        if (parsed) {
          setParsedWorkflow(parsed);
          setResponseStatus("✅ Social media automation workflow generated successfully!");
        } else {
          setResponseStatus("⚠️ Generated workflow but had parsing issues. Check raw response.");
        }
        
        if (!requestId && result.requestId) {
          setRequestId(result.requestId);
        }
      } else {
        throw new Error(result.message || "AI did not return a valid workflow design");
      }
    } catch (error) {
      console.error("❌ Workflow generation error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      if (errorMessage.includes("fetch")) {
        setResponseStatus("🔌 Cannot connect to N8N. Please ensure N8N is running and accessible.");
      } else if (errorMessage.includes("HTTP 404")) {
        setResponseStatus("📍 N8N webhook endpoint not found. Check the webhook URL configuration.");
      } else if (errorMessage.includes("HTTP 500")) {
        setResponseStatus("⚙️ N8N server error. Check N8N logs and configuration.");
      } else {
        setResponseStatus(`❌ Error: ${errorMessage}`);
      }
    } finally {
      setIsLoadingAI(false);
    }
  }, [n8nWebhookUrl, businessInfo, selectedChannels, automationFeatures, workflowRequest, requestId]);

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
    generateWorkflow("refine", refinementInput, aiRawResponse);
    setRefinementInput("");
  };

  const handleApprove = async (): Promise<void> => {
    setIsLoadingAI(true);
    setResponseStatus("📧 Sending final automation design to the development team...");
    setCurrentAction("approve");

    try {
      const payload = {
        action: "approve",
        platform: "social-media-automation",
        requestId: requestId,
        userEmail: businessInfo.email || "no-email@example.com",
        aiRawResponse: aiRawResponse,
        parsedWorkflow: parsedWorkflow,
        businessName: businessInfo.businessName,
        businessType: businessInfo.businessType,
        businessDescription: businessInfo.description,
        website: businessInfo.website,
        phone: businessInfo.phone,
        selectedChannels: selectedChannels,
        automationFeatures: automationFeatures,
      };

      console.log("📤 Sending approval to N8N:", payload);

      const response = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("✅ Approval response:", result);

      if (result.status === "success") {
        setResponseStatus("✅ Automation approved! Development team has been notified.");
        
        // Update parent component state
        if (setActiveWorkflowExists) {
          setActiveWorkflowExists(true);
        }
        
        if (setActiveWorkflowDetails) {
          setActiveWorkflowDetails({
            id: requestId || "social-automation-" + Date.now(),
            workflowTemplate: { name: parsedWorkflow?.title || "Social Media Automation" },
            businessInfo: businessInfo,
            aiResponse: aiRawResponse,
            parsedWorkflow: parsedWorkflow,
            status: "APPROVED_PENDING_DEVELOPMENT",
            platform: "social-media-automation",
            channels: selectedChannels,
            features: automationFeatures,
            approvedAt: new Date().toISOString(),
          });
        }
        
        // Navigate after successful approval
        setTimeout(() => {
          if (setStep) {
            setStep("dashboard");
          }
        }, 2000);
      } else {
        throw new Error(result.message || "Approval failed");
      }
    } catch (error) {
      console.error("❌ Approval error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setResponseStatus(`❌ Approval failed: ${errorMessage}`);
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

  const handleFeatureToggle = (featureId: string, checked: boolean): void => {
    if (checked) {
      setAutomationFeatures(prev => [...prev, featureId]);
    } else {
      setAutomationFeatures(prev => prev.filter(f => f !== featureId));
    }
  };

  // Component to display the parsed workflow
  const WorkflowDisplay: React.FC = () => {
    if (!parsedWorkflow) return null;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border">
          <h3 className="text-2xl font-bold mb-2 text-primary flex items-center justify-center gap-2">
            <Bot className="h-6 w-6" />
            {parsedWorkflow.title}
          </h3>
          <p className="text-muted-foreground">{parsedWorkflow.description}</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge variant="outline" className="font-medium">
              <Settings className="h-3 w-3 mr-1" />
              {parsedWorkflow.platform}
            </Badge>
            <Badge variant="secondary" className="font-medium">
              <Clock className="h-3 w-3 mr-1" />
              {parsedWorkflow.estimatedBuildTime}
            </Badge>
            <Badge variant="secondary" className="font-medium">
              <Target className="h-3 w-3 mr-1" />
              {parsedWorkflow.complexity}
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">{parsedWorkflow.steps.length}</div>
            <div className="text-sm text-muted-foreground">Workflow Steps</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">{parsedWorkflow.integrations.length}</div>
            <div className="text-sm text-muted-foreground">Integrations</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">{selectedChannels.length}</div>
            <div className="text-sm text-muted-foreground">Platforms</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-500">{parsedWorkflow.benefits.length}</div>
            <div className="text-sm text-muted-foreground">Benefits</div>
          </Card>
        </div>

        {/* Workflow Steps */}
        <Card className="p-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <PlayCircle className="h-5 w-5 text-blue-500" />
            Automation Workflow Steps
          </h4>
          <div className="space-y-4">
            {parsedWorkflow.steps.map((step, index) => (
              <div key={index} className="flex gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                    {step.stepNumber}
                  </div>
                </div>
                <div className="flex-grow">
                  <h5 className="font-semibold text-lg mb-1">{step.title}</h5>
                  <p className="text-muted-foreground text-sm mb-2">{step.description}</p>
                  <Badge variant="outline" className="text-xs">
                    {step.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Required Integrations */}
        {parsedWorkflow.integrations.length > 0 && (
          <Card className="p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-500" />
              Required Integrations
            </h4>
            <div className="grid gap-4 md:grid-cols-2">
              {parsedWorkflow.integrations.map((integration, index) => (
                <div key={index} className="p-4 border rounded-lg bg-orange-50 dark:bg-orange-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <h5 className="font-semibold">{integration.name}</h5>
                    {integration.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{integration.description}</p>
                  <p className="text-xs text-muted-foreground italic">{integration.setupInstructions}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Key Benefits */}
        {parsedWorkflow.benefits.length > 0 && (
          <Card className="p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <ThumbsUp className="h-5 w-5 text-green-500" />
              Key Benefits
            </h4>
            <div className="grid gap-2 md:grid-cols-2">
              {parsedWorkflow.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Example Scenario */}
        {parsedWorkflow.exampleScenario && (
          <Card className="p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-500" />
              How It Works - Example Scenario
            </h4>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg border">
              <p className="text-sm leading-relaxed italic">
                {parsedWorkflow.exampleScenario}
              </p>
            </div>
          </Card>
        )}

        {/* Raw AI Response Toggle */}
        <Card className="p-6">
          <Button
            variant="outline"
            onClick={() => setShowRawResponse(!showRawResponse)}
            className="mb-4 flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            {showRawResponse ? "Hide" : "Show"} Raw AI Response
          </Button>
          {showRawResponse && (
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border">
              <pre className="text-xs overflow-auto whitespace-pre-wrap">
                {aiRawResponse}
              </pre>
            </div>
          )}
        </Card>
      </div>
    );
  };

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
              Describe your automation needs and our AI will design a complete workflow for Instagram, Facebook, and other social platforms.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Input */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-blue-500" />
                  {!hasInitialRequest ? "Design Your Automation" : "Refine Your Workflow"}
                </CardTitle>
                <CardDescription>
                  {!hasInitialRequest 
                    ? "Tell us what social media automation you need"
                    : "Provide feedback to improve the automation design"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!hasInitialRequest && (
                  <>
                    <div className="space-y-2">
                      <Label>Social Media Platforms</Label>
                      <div className="grid grid-cols-1 gap-2">
                        {channelOptions.map((channel) => (
                          <button
                            key={channel.id}
                            onClick={() => handleChannelToggle(channel.id)}
                            className={`p-3 rounded-lg border text-left transition-all ${
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
                        {automationFeatureOptions.map((feature) => (
                          <label
                            key={feature.id}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={automationFeatures.includes(feature.id)}
                              onChange={(e) => handleFeatureToggle(feature.id, e.target.checked)}
                              className="rounded border-border"
                            />
                            <span className="text-sm">{feature.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {!hasInitialRequest ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="workflowRequest">Describe your automation needs</Label>
                      <Textarea
                        id="workflowRequest"
                        value={workflowRequest}
                        onChange={(e) => setWorkflowRequest(e.target.value)}
                        placeholder="e.g., 'I want to automatically respond to Instagram DMs about product inquiries, analyze sentiment, and escalate angry customers to human agents. Also send follow-up messages for abandoned carts.'"
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
                      {isLoadingAI ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                      Generate Automation Workflow
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="refinementInput">How should we improve it?</Label>
                      <Textarea
                        id="refinementInput"
                        value={refinementInput}
                        onChange={(e) => setRefinementInput(e.target.value)}
                        placeholder="e.g., 'Add Shopify integration for order status', 'Include more personalized responses', 'Add scheduling for follow-ups'"
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
                        disabled={isLoadingAI || !parsedWorkflow}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                      >
                        {isLoadingAI && currentAction === "approve" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ThumbsUp className="h-4 w-4" />}
                        Approve & Send to Dev Team
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
                    <span className="font-semibold text-blue-500">Platforms:</span>
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
                  AI-Generated Automation Workflow
                </CardTitle>
                <CardDescription>
                  Real-time AI-designed automation workflow for your social media platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Loading State */}
                {isLoadingAI && (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                      <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-500 animate-pulse" />
                    </div>
                    <p className="mt-6 text-lg font-medium text-blue-500">{responseStatus}</p>
                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <span className="ml-2">AI is analyzing your requirements...</span>
                    </div>
                  </div>
                )}
                
                {/* Success State - Show Workflow */}
                {!isLoadingAI && parsedWorkflow && (
                  <WorkflowDisplay />
                )}
                
                {/* Error State */}
                {!isLoadingAI && !parsedWorkflow && responseStatus && responseStatus.includes("❌") && (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                      <AlertCircle className="h-8 w-8 text-red-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-red-600 mb-2">Generation Failed</h3>
                    <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
                      {responseStatus}
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setResponseStatus(null);
                          setHasInitialRequest(false);
                        }}
                        className="flex items-center gap-2"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowRawResponse(true)}
                        className="flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        Debug Info
                      </Button>
                    </div>
                  </div>
                )}

                {/* Warning State - Partial Success */}
                {!isLoadingAI && !parsedWorkflow && responseStatus && responseStatus.includes("⚠️") && (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-4">
                      <AlertCircle className="h-8 w-8 text-yellow-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-yellow-600 mb-2">Partial Success</h3>
                    <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
                      {responseStatus}
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowRawResponse(true)}
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      View Raw Response
                    </Button>
                    {showRawResponse && aiRawResponse && (
                      <div className="mt-4 w-full bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border">
                        <pre className="text-xs overflow-auto whitespace-pre-wrap max-h-64">
                          {aiRawResponse}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Initial State */}
                {!isLoadingAI && !parsedWorkflow && !responseStatus && !hasInitialRequest && (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                        <Bot className="h-10 w-10 text-blue-500" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Sparkles className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Ready to Create Your Automation</h3>
                    <p className="text-center max-w-md mb-6">
                      Describe your social media automation needs and our AI will generate a complete, production-ready workflow design.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Real AI Generation</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Production Ready</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Team Notifications</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Success Status */}
                {!isLoadingAI && responseStatus && responseStatus.includes("✅") && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">{responseStatus}</span>
                    </div>
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