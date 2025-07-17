"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Sparkles, Loader2, CheckCircle, XCircle, Send } from "lucide-react"
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
  selectedWorkflowId?: string | null // If modifying an existing template
  setStep: (step: "selection" | "dashboard") => void // Only allow back to selection or dashboard
  setActiveWorkflowExists: (exists: boolean) => void
  setActiveWorkflowDetails: (details: any) => void
}

export default function CustomWorkflowBuilder({
  businessInfo,
  selectedWorkflowId,
  setStep,
  setActiveWorkflowExists,
  setActiveWorkflowDetails,
}: CustomWorkflowBuilderProps) {
  const [aiGeneratedDesign, setAiGeneratedDesign] = useState<string>("")
  const [refinementInput, setRefinementInput] = useState<string>("")
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false)
  const [n8nResponseStatus, setN8nResponseStatus] = useState<string | null>(null)
  const [requestId, setRequestId] = useState<string | null>(null) // Unique ID for this conversation with n8n
  const [currentAction, setCurrentAction] = useState<"initial" | "refine" | "approve">("initial")

  const n8nWebhookUrl = "https://yaziln8n.onrender.com/webhook/custom-request" // Your n8n webhook URL

  const generateWorkflow = useCallback(
    async (action: "initial" | "refine", instructions?: string, currentDesign?: string) => {
      setIsLoadingAI(true)
      setN8nResponseStatus("Generating workflow design...")
      setCurrentAction(action)

      try {
        const payload: any = {
          action: action,
          userEmail: businessInfo.email || "no-email@example.com", // Fallback email
          businessName: businessInfo.businessName,
          businessType: businessInfo.businessType,
          businessDescription: businessInfo.description,
          website: businessInfo.website,
          phone: businessInfo.phone,
          initialPrompt: selectedWorkflowId
            ? `Modify the workflow for template ID: ${selectedWorkflowId}. Business: ${businessInfo.businessName}, Type: ${businessInfo.businessType}.`
            : `Generate a custom workflow for business: ${businessInfo.businessName}, Type: ${businessInfo.businessType}. Description: ${businessInfo.description}.`,
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
          setN8nResponseStatus("Workflow design generated!")
          if (!requestId) {
            setRequestId(result.requestId) // Capture requestId from n8n for subsequent interactions
          }
          toast({
            title: "Workflow Design Ready!",
            description: "Review the AI-generated workflow below.",
            variant: "default",
          })
        } else {
          setN8nResponseStatus(`Error: ${result.message || "Failed to generate workflow."}`)
          toast({
            title: "Design Generation Failed",
            description: result.message || "An error occurred while generating the workflow.",
            variant: "destructive",
          })
          console.error("n8n response error:", result)
        }
      } catch (error) {
        setN8nResponseStatus("Network error or server issue.")
        toast({
          title: "Network Error",
          description: "Could not connect to the workflow builder. Please try again.",
          variant: "destructive",
        })
        console.error("Error calling n8n webhook:", error)
      } finally {
        setIsLoadingAI(false)
      }
    },
    [businessInfo, selectedWorkflowId, requestId],
  )

  useEffect(() => {
    // Trigger initial generation when component mounts for a new custom request
    if (!aiGeneratedDesign && !isLoadingAI) {
      generateWorkflow("initial")
    }
  }, [aiGeneratedDesign, isLoadingAI, generateWorkflow])

  const handleRefine = () => {
    if (!refinementInput.trim()) {
      toast({
        title: "No Refinement Instructions",
        description: "Please provide instructions on how to refine the workflow.",
        variant: "warning",
      })
      return
    }
    generateWorkflow("refine", refinementInput, aiGeneratedDesign)
    setRefinementInput("") // Clear input after sending
  }

  const handleApprove = async () => {
    setIsLoadingAI(true)
    setN8nResponseStatus("Approving workflow design...")
    setCurrentAction("approve")

    try {
      const payload = {
        action: "approve",
        requestId: requestId,
        userEmail: businessInfo.email || "no-email@example.com",
        currentWorkflowDesign: aiGeneratedDesign,
        businessName: businessInfo.businessName,
        businessType: businessInfo.businessType,
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
        setN8nResponseStatus("Workflow approved! Admin notified.")
        toast({
          title: "Workflow Approved!",
          description: "The final workflow design has been sent to the admin.",
          variant: "success",
        })
        // Simulate deployment and transition to dashboard
        setActiveWorkflowExists(true)
        setActiveWorkflowDetails({
          id: requestId || "custom-workflow", // Use requestId as a placeholder ID
          workflowTemplate: { name: "Custom Workflow" },
          businessInfo: businessInfo,
          customRequest: aiGeneratedDesign, // Store the final design as custom request
          status: "ACTIVE",
          credentials: [], // No specific credentials here, as it's a design
        })
        setStep("dashboard")
      } else {
        setN8nResponseStatus(`Error: ${result.message || "Failed to approve workflow."}`)
        toast({
          title: "Approval Failed",
          description: result.message || "An error occurred while approving the workflow.",
          variant: "destructive",
        })
        console.error("n8n approval error:", result)
      }
    } catch (error) {
      setN8nResponseStatus("Network error during approval.")
      toast({
        title: "Network Error",
        description: "Could not connect to approve the workflow. Please try again.",
        variant: "destructive",
      })
      console.error("Error approving workflow:", error)
    } finally {
      setIsLoadingAI(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="radial--gradient--automations">
        <div className="max-w-5xl mx-auto p-6">
          <div className="mb-8">
            <Button variant="ghost" onClick={() => setStep("selection")} className="mb-6 hover:bg-accent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Selection
            </Button>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                AI-Powered Custom Workflow Builder
              </h1>
              <p className="text-muted-foreground text-lg">
                Describe your needs, and our AI will design a tailored automation workflow for you.
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <Card className="glassEffect border-2 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Your Workflow Design
                </CardTitle>
                <CardDescription>Here&apos;s the AI&apos;s proposal for your custom workflow.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingAI && (
                  <div className="flex flex-col items-center justify-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">{n8nResponseStatus}</p>
                  </div>
                )}
                {!isLoadingAI && aiGeneratedDesign && (
                  <div className="bg-accent/50 p-4 rounded-lg overflow-auto max-h-[600px] text-sm">
                    <pre className="whitespace-pre-wrap font-mono text-foreground">
                      <code>{aiGeneratedDesign}</code>
                    </pre>
                  </div>
                )}
                {!isLoadingAI && !aiGeneratedDesign && n8nResponseStatus && (
                  <div className="flex flex-col items-center justify-center py-10 text-red-500">
                    <XCircle className="h-8 w-8 mb-4" />
                    <p>{n8nResponseStatus}</p>
                  </div>
                )}
                {!isLoadingAI && !aiGeneratedDesign && !n8nResponseStatus && (
                  <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                    <Sparkles className="h-8 w-8 mb-4" />
                    <p>Describe your workflow needs to get started!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-8">
              <Card className="glassEffect border-2 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5 text-primary" />
                    Refine or Approve
                  </CardTitle>
                  <CardDescription>
                    Provide more instructions to refine the design, or approve it to proceed.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="refinementInput" className="text-sm font-medium">
                      Refinement Instructions
                    </Label>
                    <Textarea
                      id="refinementInput"
                      value={refinementInput}
                      onChange={(e) => setRefinementInput(e.target.value)}
                      placeholder="e.g., 'Add integration with Mailchimp for newsletter signups', 'Simplify step 3', 'Make it more concise'"
                      rows={5}
                      className="bg-background/50 border-border/50 focus:border-primary resize-none"
                      disabled={isLoadingAI}
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button
                      onClick={handleRefine}
                      disabled={isLoadingAI || !aiGeneratedDesign}
                      className="flex-1 flex items-center gap-2"
                    >
                      {isLoadingAI && currentAction === "refine" && <Loader2 className="h-4 w-4 animate-spin" />}
                      Refine Workflow
                    </Button>
                    <Button
                      onClick={handleApprove}
                      disabled={isLoadingAI || !aiGeneratedDesign}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                    >
                      {isLoadingAI && currentAction === "approve" && <Loader2 className="h-4 w-4 animate-spin" />}
                      Approve Workflow
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="glassEffect border-2 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Business Information
                  </CardTitle>
                  <CardDescription>This information was used to generate your workflow.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <p>
                    <span className="font-semibold text-primary">Business Name:</span> {businessInfo.businessName}
                  </p>
                  <p>
                    <span className="font-semibold text-primary">Business Type:</span> {businessInfo.businessType}
                  </p>
                  {businessInfo.description && (
                    <p>
                      <span className="font-semibold text-primary">Description:</span> {businessInfo.description}
                    </p>
                  )}
                  {businessInfo.email && (
                    <p>
                      <span className="font-semibold text-primary">Contact Email:</span> {businessInfo.email}
                    </p>
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
