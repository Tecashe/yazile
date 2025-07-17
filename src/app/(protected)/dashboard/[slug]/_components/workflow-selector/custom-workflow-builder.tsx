// "use client"

// import { useState, useEffect, useCallback } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { ArrowLeft, Sparkles, Loader2, CheckCircle, XCircle, Send } from "lucide-react"
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
//   selectedWorkflowId?: string | null // If modifying an existing template
//   setStep: (step: "selection" | "dashboard") => void // Only allow back to selection or dashboard
//   setActiveWorkflowExists: (exists: boolean) => void
//   setActiveWorkflowDetails: (details: any) => void
// }

// export default function CustomWorkflowBuilder({
//   businessInfo,
//   selectedWorkflowId,
//   setStep,
//   setActiveWorkflowExists,
//   setActiveWorkflowDetails,
// }: CustomWorkflowBuilderProps) {
//   const [aiGeneratedDesign, setAiGeneratedDesign] = useState<string>("")
//   const [refinementInput, setRefinementInput] = useState<string>("")
//   const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false)
//   const [n8nResponseStatus, setN8nResponseStatus] = useState<string | null>(null)
//   const [requestId, setRequestId] = useState<string | null>(null) // Unique ID for this conversation with n8n
//   const [currentAction, setCurrentAction] = useState<"initial" | "refine" | "approve">("initial")

//   const n8nWebhookUrl = "https://yaziln8n.onrender.com/webhook/custom-request" // Your n8n webhook URL

//   const generateWorkflow = useCallback(
//     async (action: "initial" | "refine", instructions?: string, currentDesign?: string) => {
//       setIsLoadingAI(true)
//       setN8nResponseStatus("Generating workflow design...")
//       setCurrentAction(action)

//       try {
//         const payload: any = {
//           action: action,
//           userEmail: businessInfo.email || "no-email@example.com", // Fallback email
//           businessName: businessInfo.businessName,
//           businessType: businessInfo.businessType,
//           businessDescription: businessInfo.description,
//           website: businessInfo.website,
//           phone: businessInfo.phone,
//           initialPrompt: selectedWorkflowId
//             ? `Modify the workflow for template ID: ${selectedWorkflowId}. Business: ${businessInfo.businessName}, Type: ${businessInfo.businessType}.`
//             : `Generate a custom workflow for business: ${businessInfo.businessName}, Type: ${businessInfo.businessType}. Description: ${businessInfo.description}.`,
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
//           setN8nResponseStatus("Workflow design generated!")
//           if (!requestId) {
//             setRequestId(result.requestId) // Capture requestId from n8n for subsequent interactions
//           }
//           toast({
//             title: "Workflow Design Ready!",
//             description: "Review the AI-generated workflow below.",
//             variant: "default",
//           })
//         } else {
//           setN8nResponseStatus(`Error: ${result.message || "Failed to generate workflow."}`)
//           toast({
//             title: "Design Generation Failed",
//             description: result.message || "An error occurred while generating the workflow.",
//             variant: "destructive",
//           })
//           console.error("n8n response error:", result)
//         }
//       } catch (error) {
//         setN8nResponseStatus("Network error or server issue.")
//         toast({
//           title: "Network Error",
//           description: "Could not connect to the workflow builder. Please try again.",
//           variant: "destructive",
//         })
//         console.error("Error calling n8n webhook:", error)
//       } finally {
//         setIsLoadingAI(false)
//       }
//     },
//     [businessInfo, selectedWorkflowId, requestId],
//   )

//   useEffect(() => {
//     // Trigger initial generation when component mounts for a new custom request
//     if (!aiGeneratedDesign && !isLoadingAI) {
//       generateWorkflow("initial")
//     }
//   }, [aiGeneratedDesign, isLoadingAI, generateWorkflow])

//   const handleRefine = () => {
//     if (!refinementInput.trim()) {
//       toast({
//         title: "No Refinement Instructions",
//         description: "Please provide instructions on how to refine the workflow.",
//         variant: "warning",
//       })
//       return
//     }
//     generateWorkflow("refine", refinementInput, aiGeneratedDesign)
//     setRefinementInput("") // Clear input after sending
//   }

//   const handleApprove = async () => {
//     setIsLoadingAI(true)
//     setN8nResponseStatus("Approving workflow design...")
//     setCurrentAction("approve")

//     try {
//       const payload = {
//         action: "approve",
//         requestId: requestId,
//         userEmail: businessInfo.email || "no-email@example.com",
//         currentWorkflowDesign: aiGeneratedDesign,
//         businessName: businessInfo.businessName,
//         businessType: businessInfo.businessType,
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
//         setN8nResponseStatus("Workflow approved! Admin notified.")
//         toast({
//           title: "Workflow Approved!",
//           description: "The final workflow design has been sent to the admin.",
//           variant: "success",
//         })
//         // Simulate deployment and transition to dashboard
//         setActiveWorkflowExists(true)
//         setActiveWorkflowDetails({
//           id: requestId || "custom-workflow", // Use requestId as a placeholder ID
//           workflowTemplate: { name: "Custom Workflow" },
//           businessInfo: businessInfo,
//           customRequest: aiGeneratedDesign, // Store the final design as custom request
//           status: "ACTIVE",
//           credentials: [], // No specific credentials here, as it's a design
//         })
//         setStep("dashboard")
//       } else {
//         setN8nResponseStatus(`Error: ${result.message || "Failed to approve workflow."}`)
//         toast({
//           title: "Approval Failed",
//           description: result.message || "An error occurred while approving the workflow.",
//           variant: "destructive",
//         })
//         console.error("n8n approval error:", result)
//       }
//     } catch (error) {
//       setN8nResponseStatus("Network error during approval.")
//       toast({
//         title: "Network Error",
//         description: "Could not connect to approve the workflow. Please try again.",
//         variant: "destructive",
//       })
//       console.error("Error approving workflow:", error)
//     } finally {
//       setIsLoadingAI(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="radial--gradient--automations">
//         <div className="max-w-5xl mx-auto p-6">
//           <div className="mb-8">
//             <Button variant="ghost" onClick={() => setStep("selection")} className="mb-6 hover:bg-accent">
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Back to Selection
//             </Button>
//             <div className="text-center mb-8">
//               <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
//                 AI-Powered Custom Workflow Builder
//               </h1>
//               <p className="text-muted-foreground text-lg">
//                 Describe your needs, and our AI will design a tailored automation workflow for you.
//               </p>
//             </div>
//           </div>

//           <div className="grid gap-8 lg:grid-cols-2">
//             <Card className="glassEffect border-2 border-border/50">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Sparkles className="h-5 w-5 text-primary" />
//                   Your Workflow Design
//                 </CardTitle>
//                 <CardDescription>Here&apos;s the AI&apos;s proposal for your custom workflow.</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {isLoadingAI && (
//                   <div className="flex flex-col items-center justify-center py-10">
//                     <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
//                     <p className="text-muted-foreground">{n8nResponseStatus}</p>
//                   </div>
//                 )}
//                 {!isLoadingAI && aiGeneratedDesign && (
//                   <div className="bg-accent/50 p-4 rounded-lg overflow-auto max-h-[600px] text-sm">
//                     <pre className="whitespace-pre-wrap font-mono text-foreground">
//                       <code>{aiGeneratedDesign}</code>
//                     </pre>
//                   </div>
//                 )}
//                 {!isLoadingAI && !aiGeneratedDesign && n8nResponseStatus && (
//                   <div className="flex flex-col items-center justify-center py-10 text-red-500">
//                     <XCircle className="h-8 w-8 mb-4" />
//                     <p>{n8nResponseStatus}</p>
//                   </div>
//                 )}
//                 {!isLoadingAI && !aiGeneratedDesign && !n8nResponseStatus && (
//                   <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
//                     <Sparkles className="h-8 w-8 mb-4" />
//                     <p>Describe your workflow needs to get started!</p>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>

//             <div className="space-y-8">
//               <Card className="glassEffect border-2 border-border/50">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Send className="h-5 w-5 text-primary" />
//                     Refine or Approve
//                   </CardTitle>
//                   <CardDescription>
//                     Provide more instructions to refine the design, or approve it to proceed.
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div className="space-y-2">
//                     <Label htmlFor="refinementInput" className="text-sm font-medium">
//                       Refinement Instructions
//                     </Label>
//                     <Textarea
//                       id="refinementInput"
//                       value={refinementInput}
//                       onChange={(e) => setRefinementInput(e.target.value)}
//                       placeholder="e.g., 'Add integration with Mailchimp for newsletter signups', 'Simplify step 3', 'Make it more concise'"
//                       rows={5}
//                       className="bg-background/50 border-border/50 focus:border-primary resize-none"
//                       disabled={isLoadingAI}
//                     />
//                   </div>
//                   <div className="flex gap-4">
//                     <Button
//                       onClick={handleRefine}
//                       disabled={isLoadingAI || !aiGeneratedDesign}
//                       className="flex-1 flex items-center gap-2"
//                     >
//                       {isLoadingAI && currentAction === "refine" && <Loader2 className="h-4 w-4 animate-spin" />}
//                       Refine Workflow
//                     </Button>
//                     <Button
//                       onClick={handleApprove}
//                       disabled={isLoadingAI || !aiGeneratedDesign}
//                       className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
//                     >
//                       {isLoadingAI && currentAction === "approve" && <Loader2 className="h-4 w-4 animate-spin" />}
//                       Approve Workflow
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="glassEffect border-2 border-border/50">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <CheckCircle className="h-5 w-5 text-primary" />
//                     Business Information
//                   </CardTitle>
//                   <CardDescription>This information was used to generate your workflow.</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4 text-sm text-muted-foreground">
//                   <p>
//                     <span className="font-semibold text-primary">Business Name:</span> {businessInfo.businessName}
//                   </p>
//                   <p>
//                     <span className="font-semibold text-primary">Business Type:</span> {businessInfo.businessType}
//                   </p>
//                   {businessInfo.description && (
//                     <p>
//                       <span className="font-semibold text-primary">Description:</span> {businessInfo.description}
//                     </p>
//                   )}
//                   {businessInfo.email && (
//                     <p>
//                       <span className="font-semibold text-primary">Contact Email:</span> {businessInfo.email}
//                     </p>
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


"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Sparkles, Loader2, CheckCircle, XCircle, Send, Zap, Clock, Users, Target, Settings, Mail, MessageSquare, RefreshCw, ThumbsUp } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface CustomWorkflowBuilderProps {
  businessInfo: {
    businessName: string
    businessType: string
    description?: string
    website?: string
    phone?: string
    email?: string
  }
  selectedWorkflowId?: string | null
  setStep: (step: "selection" | "dashboard") => void
  setActiveWorkflowExists: (exists: boolean) => void
  setActiveWorkflowDetails: (details: any) => void
}

interface WorkflowDesign {
  title: string
  description: string
  steps: string[]
  integrations: string[]
  scenario: string
  estimatedTime: string
  complexity: string
  benefits: string[]
}

export default function CustomWorkflowBuilder({
  businessInfo,
  selectedWorkflowId,
  setStep,
  setActiveWorkflowExists,
  setActiveWorkflowDetails,
}: CustomWorkflowBuilderProps) {
  const [workflowRequest, setWorkflowRequest] = useState<string>("")
  const [aiGeneratedDesign, setAiGeneratedDesign] = useState<string>("")
  const [parsedDesign, setParsedDesign] = useState<WorkflowDesign | null>(null)
  const [refinementInput, setRefinementInput] = useState<string>("")
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false)
  const [n8nResponseStatus, setN8nResponseStatus] = useState<string | null>(null)
  const [requestId, setRequestId] = useState<string | null>(null)
  const [currentAction, setCurrentAction] = useState<"initial" | "refine" | "approve">("initial")
  const [conversationHistory, setConversationHistory] = useState<Array<{
    type: "user" | "ai"
    content: string
    timestamp: Date
  }>>([])
  const [hasInitialRequest, setHasInitialRequest] = useState<boolean>(false)

  const n8nWebhookUrl = "https://yaziln8n.onrender.com/webhook/custom-request"

  // Parse the markdown response into structured data
  const parseWorkflowDesign = useCallback((markdown: string): WorkflowDesign | null => {
    try {
      const lines = markdown.split('\n').filter(line => line.trim())
      const design: Partial<WorkflowDesign> = {
        steps: [],
        integrations: [],
        benefits: []
      }

      let currentSection = ''
      
      for (const line of lines) {
        const trimmed = line.trim()
        
        if (trimmed.startsWith('# ')) {
          design.title = trimmed.substring(2)
        } else if (trimmed.startsWith('## ')) {
          currentSection = trimmed.substring(3).toLowerCase()
        } else if (trimmed.startsWith('**Description:**') || trimmed.startsWith('**Purpose:**')) {
          design.description = trimmed.split('**')[2]?.trim() || ''
        } else if (currentSection.includes('steps') || currentSection.includes('process')) {
          if (trimmed.match(/^\d+\./)) {
            design.steps?.push(trimmed)
          }
        } else if (currentSection.includes('integration') || currentSection.includes('tools')) {
          if (trimmed.startsWith('- ')) {
            design.integrations?.push(trimmed.substring(2))
          }
        } else if (currentSection.includes('scenario') || currentSection.includes('example')) {
          if (!design.scenario) design.scenario = trimmed
        } else if (currentSection.includes('benefit') || currentSection.includes('advantage')) {
          if (trimmed.startsWith('- ')) {
            design.benefits?.push(trimmed.substring(2))
          }
        }
      }

      // Extract time and complexity estimates
      const timeMatch = markdown.match(/time[:\s]*(\d+[^\n]*)/i)
      const complexityMatch = markdown.match(/complexity[:\s]*([^\n]*)/i)
      
      design.estimatedTime = timeMatch?.[1] || "Not specified"
      design.complexity = complexityMatch?.[1] || "Medium"

      return design as WorkflowDesign
    } catch (error) {
      console.error("Error parsing workflow design:", error)
      return null
    }
  }, [])

  const generateWorkflow = useCallback(
    async (action: "initial" | "refine", instructions?: string, currentDesign?: string) => {
      setIsLoadingAI(true)
      setN8nResponseStatus("🤖 AI is analyzing your request and designing your workflow...")
      setCurrentAction(action)

      try {
        const payload: any = {
          action: action,
          userEmail: businessInfo.email || "no-email@example.com",
          businessName: businessInfo.businessName,
          businessType: businessInfo.businessType,
          businessDescription: businessInfo.description,
          website: businessInfo.website,
          phone: businessInfo.phone,
          initialPrompt: action === "initial" ? workflowRequest : 
            `Previous request: ${workflowRequest}. ${instructions || ""}`,
        }

        if (requestId) {
          payload.requestId = requestId
        }
        if (instructions) {
          payload.refinementInstructions = instructions
        }
        if (currentDesign) {
          payload.currentWorkflowDesign = currentDesign
        }

        const response = await fetch(n8nWebhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })

        const result = await response.json()

        if (response.ok && result.status === "success" && result.workflowDesign) {
          setAiGeneratedDesign(result.workflowDesign)
          const parsed = parseWorkflowDesign(result.workflowDesign)
          setParsedDesign(parsed)
          setN8nResponseStatus("✅ Workflow design generated successfully!")
          
          if (!requestId) {
            setRequestId(result.requestId)
          }

          // Add to conversation history
          const newHistory = [...conversationHistory]
          if (action === "initial") {
            newHistory.push({
              type: "user",
              content: workflowRequest,
              timestamp: new Date()
            })
          } else {
            newHistory.push({
              type: "user", 
              content: instructions || "",
              timestamp: new Date()
            })
          }
          newHistory.push({
            type: "ai",
            content: result.workflowDesign,
            timestamp: new Date()
          })
          setConversationHistory(newHistory)

          toast({
            title: "🎉 Workflow Design Ready!",
            description: "Your custom workflow has been generated. Review it below!",
            variant: "default",
          })
        } else {
          setN8nResponseStatus(`❌ Error: ${result.message || "Failed to generate workflow."}`)
          toast({
            title: "Design Generation Failed",
            description: result.message || "An error occurred while generating the workflow.",
            variant: "destructive",
          })
        }
      } catch (error) {
        setN8nResponseStatus("🔌 Network error - please check your connection and try again.")
        toast({
          title: "Network Error",
          description: "Could not connect to the workflow builder. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingAI(false)
      }
    },
    [businessInfo, workflowRequest, requestId, conversationHistory, parseWorkflowDesign],
  )

  const handleInitialSubmit = () => {
    if (!workflowRequest.trim()) {
      toast({
        title: "Please describe your workflow needs",
        description: "Tell us what kind of automation you want to build.",
        variant: "destructive",
      })
      return
    }
    setHasInitialRequest(true)
    generateWorkflow("initial")
  }

  const handleRefine = () => {
    if (!refinementInput.trim()) {
      toast({
        title: "Please provide refinement instructions",
        description: "Tell us how you'd like to improve the workflow design.",
        variant: "destructive",
      })
      return
    }
    generateWorkflow("refine", refinementInput, aiGeneratedDesign)
    setRefinementInput("")
  }

  const handleApprove = async () => {
    setIsLoadingAI(true)
    setN8nResponseStatus("📧 Sending final design to our team...")
    setCurrentAction("approve")

    try {
      const payload = {
        action: "approve",
        requestId: requestId,
        userEmail: businessInfo.email || "no-email@example.com",
        currentWorkflowDesign: aiGeneratedDesign,
        businessName: businessInfo.businessName,
        businessType: businessInfo.businessType,
        businessDescription: businessInfo.description,
        website: businessInfo.website,
        phone: businessInfo.phone,
      }

      const response = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (response.ok && result.status === "success") {
        setN8nResponseStatus("✅ Workflow approved! Our team will implement it for you.")
        toast({
          title: "🎉 Workflow Approved!",
          description: "Your final workflow design has been sent to our development team.",
          variant: "default",
        })
        
        setActiveWorkflowExists(true)
        setActiveWorkflowDetails({
          id: requestId || "custom-workflow",
          workflowTemplate: { name: parsedDesign?.title || "Custom Workflow" },
          businessInfo: businessInfo,
          customRequest: aiGeneratedDesign,
          parsedDesign: parsedDesign,
          status: "PENDING_IMPLEMENTATION",
          credentials: [],
        })
        
        setTimeout(() => {
          setStep("dashboard")
        }, 2000)
      } else {
        setN8nResponseStatus(`❌ Error: ${result.message || "Failed to approve workflow."}`)
        toast({
          title: "Approval Failed",
          description: result.message || "An error occurred while approving the workflow.",
          variant: "destructive",
        })
      }
    } catch (error) {
      setN8nResponseStatus("🔌 Network error during approval.")
      toast({
        title: "Network Error",
        description: "Could not connect to approve the workflow. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingAI(false)
    }
  }

  const WorkflowDisplay = ({ design }: { design: WorkflowDesign }) => (
    <div className="space-y-6">
      <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
        <h3 className="text-2xl font-bold mb-2 text-primary">{design.title}</h3>
        <p className="text-muted-foreground">{design.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="font-semibold">Estimated Time</span>
          </div>
          <p className="text-sm text-muted-foreground">{design.estimatedTime}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-4 w-4 text-primary" />
            <span className="font-semibold">Complexity</span>
          </div>
          <p className="text-sm text-muted-foreground">{design.complexity}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-primary" />
            <span className="font-semibold">Steps</span>
          </div>
          <p className="text-sm text-muted-foreground">{design.steps.length} steps</p>
        </Card>
      </div>

      <Card className="p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Workflow Steps
        </h4>
        <div className="space-y-3">
          {design.steps.map((step, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-accent/30 rounded-lg">
              <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              <p className="text-sm flex-grow">{step.replace(/^\d+\.\s*/, '')}</p>
            </div>
          ))}
        </div>
      </Card>

      {design.integrations && design.integrations.length > 0 && (
        <Card className="p-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Required Integrations
          </h4>
          <div className="flex flex-wrap gap-2">
            {design.integrations.map((integration, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {integration}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {design.benefits && design.benefits.length > 0 && (
        <Card className="p-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <ThumbsUp className="h-5 w-5 text-primary" />
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
            <MessageSquare className="h-5 w-5 text-primary" />
            Example Scenario
          </h4>
          <p className="text-sm text-muted-foreground italic bg-accent/30 p-4 rounded-lg">
            {design.scenario}
          </p>
        </Card>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="radial--gradient--automations">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-8">
            <Button variant="ghost" onClick={() => setStep("selection")} className="mb-6 hover:bg-accent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Selection
            </Button>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                🤖 AI-Powered Workflow Designer
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Describe your automation needs and our AI will create a detailed, actionable workflow design tailored specifically for your business.
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Input */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="glassEffect border-2 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5 text-primary" />
                    {!hasInitialRequest ? "Describe Your Workflow" : "Refine Your Workflow"}
                  </CardTitle>
                  <CardDescription>
                    {!hasInitialRequest 
                      ? "Tell us what kind of automation you want to build"
                      : "Provide feedback to improve the design"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!hasInitialRequest ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="workflowRequest">What do you want to automate?</Label>
                        <Textarea
                          id="workflowRequest"
                          value={workflowRequest}
                          onChange={(e) => setWorkflowRequest(e.target.value)}
                          placeholder="e.g., 'I want to automatically respond to customer inquiries on social media and route them to the right team member based on the topic'"
                          rows={6}
                          className="bg-background/50 border-border/50 focus:border-primary resize-none"
                          disabled={isLoadingAI}
                        />
                      </div>
                      <Button
                        onClick={handleInitialSubmit}
                        disabled={isLoadingAI || !workflowRequest.trim()}
                        className="w-full flex items-center gap-2"
                      >
                        {isLoadingAI ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                        Generate Workflow Design
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
                          placeholder="e.g., 'Add integration with Slack for team notifications', 'Make it work with Instagram too', 'Simplify the approval process'"
                          rows={4}
                          className="bg-background/50 border-border/50 focus:border-primary resize-none"
                          disabled={isLoadingAI}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleRefine}
                          disabled={isLoadingAI || !refinementInput.trim()}
                          className="flex-1 flex items-center gap-2"
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

              <Card className="glassEffect border-2 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Business Context
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <span className="font-semibold text-primary">Business:</span>
                    <p className="text-muted-foreground">{businessInfo.businessName}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-primary">Type:</span>
                    <p className="text-muted-foreground">{businessInfo.businessType}</p>
                  </div>
                  {businessInfo.description && (
                    <div>
                      <span className="font-semibold text-primary">Description:</span>
                      <p className="text-muted-foreground">{businessInfo.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Output */}
            <div className="lg:col-span-2">
              <Card className="glassEffect border-2 border-border/50 min-h-[600px]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Your Custom Workflow Design
                  </CardTitle>
                  <CardDescription>
                    AI-generated workflow tailored to your specific business needs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingAI && (
                    <div className="flex flex-col items-center justify-center py-20">
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                        <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary" />
                      </div>
                      <p className="mt-6 text-lg font-medium text-primary">{n8nResponseStatus}</p>
                      <p className="text-sm text-muted-foreground mt-2">This usually takes 10-30 seconds</p>
                    </div>
                  )}
                  
                  {!isLoadingAI && parsedDesign && (
                    <WorkflowDisplay design={parsedDesign} />
                  )}
                  
                  {!isLoadingAI && aiGeneratedDesign && !parsedDesign && (
                    <div className="bg-accent/30 p-6 rounded-lg">
                      <h3 className="font-semibold mb-4">Raw AI Response:</h3>
                      <pre className="whitespace-pre-wrap text-sm text-muted-foreground overflow-auto">
                        {aiGeneratedDesign}
                      </pre>
                    </div>
                  )}
                  
                  {!isLoadingAI && !aiGeneratedDesign && n8nResponseStatus && (
                    <div className="flex flex-col items-center justify-center py-20 text-red-500">
                      <XCircle className="h-12 w-12 mb-4" />
                      <p className="text-lg font-medium">{n8nResponseStatus}</p>
                      <Button 
                        variant="outline" 
                        onClick={() => window.location.reload()} 
                        className="mt-4"
                      >
                        Try Again
                      </Button>
                    </div>
                  )}
                  
                  {!isLoadingAI && !aiGeneratedDesign && !n8nResponseStatus && !hasInitialRequest && (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                      <div className="relative mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                          <Sparkles className="h-10 w-10 text-primary" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Ready to Design Your Workflow</h3>
                      <p className="text-center max-w-md">
                        Describe what you want to automate and our AI will create a detailed workflow design for your business.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}