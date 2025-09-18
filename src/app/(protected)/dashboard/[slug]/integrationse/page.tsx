// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Switch } from "@/components/ui/switch"
// import { Input } from "@/components/ui/input"
// import { toast } from "@/hooks/use-toast"
// import {
//   CreditCard,
//   Calendar,
//   Mail,
//   ShoppingCart,
//   Settings,
//   CheckCircle,
//   Plus,
//   ArrowDown,
//   Bot,
//   Sparkles,
//   GitBranch,
//   Save,
//   ChevronRight,
//   WorkflowIcon,
//   Target,
//   Clock,
//   Activity,
//   Trash2,
// } from "lucide-react"

// interface WorkflowStep {
//   id: string
//   stepId: string
//   stepType: "trigger" | "action" | "condition"
//   integrationId: string
//   integrationName: string
//   capabilityId: string
//   capabilityName: string
//   config: Record<string, any>
//   positionX: number
//   positionY: number
//   stepOrder: number
//   parentStepId?: string
// }

// interface WorkflowCondition {
//   id: string
//   conditionId: string
//   field: string
//   operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than"
//   value: string
//   trueStepId?: string
//   falseStepId?: string
// }

// interface WorkflowItem {
//   id: string
//   name: string
//   description: string
//   isActive: boolean
//   aiPrompt?: string
//   aiGenerated: boolean
//   steps: WorkflowStep[]
//   conditions: WorkflowCondition[]
//   createdAt: string
//   updatedAt: string
// }

// interface Integration {
//   id: string
//   name: string
//   type: string
//   isActive: boolean
//   capabilities: Array<{
//     id: string
//     name: string
//     description: string
//   }>
// }

// const getIntegrationIcon = (type: string) => {
//   switch (type.toUpperCase()) {
//     case "STRIPE":
//       return CreditCard
//     case "SHOPIFY":
//       return ShoppingCart
//     case "CALENDLY":
//       return Calendar
//     case "SENDGRID":
//       return Mail
//     default:
//       return Settings
//   }
// }

// export default function WorkflowBuilderPage() {
//   const [activeTab, setActiveTab] = useState("workflows")
//   const [workflows, setWorkflows] = useState<WorkflowItem[]>([])
//   const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowItem | null>(null)
//   const [isCreatingWorkflow, setIsCreatingWorkflow] = useState(false)
//   const [connectedIntegrations, setConnectedIntegrations] = useState<Integration[]>([])
//   const [aiSuggestions, setAiSuggestions] = useState<WorkflowItem[]>([])
//   const [isGeneratingWorkflow, setIsGeneratingWorkflow] = useState(false)
//   const [workflowPrompt, setWorkflowPrompt] = useState("")
//   const [isSaving, setIsSaving] = useState(false)
//   const [isLoading, setIsLoading] = useState(true)
//   const [draggedStep, setDraggedStep] = useState<WorkflowStep | null>(null)

//   useEffect(() => {
//     loadWorkflows()
//     loadIntegrations()
//   }, [])

//   const loadWorkflows = async () => {
//     try {
//       const response = await fetch("/api/workflows")
//       if (response.ok) {
//         const data = await response.json()
//         setWorkflows(data.workflows)
//       }
//     } catch (error) {
//       console.error("Failed to load workflows:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load workflows",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const loadIntegrations = async () => {
//     try {
//       const response = await fetch("/api/integrations")
//       if (response.ok) {
//         const data = await response.json()
//         setConnectedIntegrations(data.integrations)
//       }
//     } catch (error) {
//       console.error("Failed to load integrations:", error)
//     }
//   }

//   const generateWorkflowWithAI = async () => {
//     if (!workflowPrompt.trim()) return

//     setIsGeneratingWorkflow(true)

//     try {
//       const response = await fetch("/api/ai/generate-workflow", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           prompt: workflowPrompt,
//           integrations: connectedIntegrations,
//         }),
//       })

//       if (response.ok) {
//         const data = await response.json()
//         setAiSuggestions(data.suggestions)
//         toast({
//           title: "Workflow Generated",
//           description: "AI has generated workflow suggestions for you",
//         })
//       } else {
//         throw new Error("Failed to generate workflow")
//       }
//     } catch (error) {
//       console.error("Failed to generate workflow:", error)
//       toast({
//         title: "Error",
//         description: "Failed to generate workflow. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsGeneratingWorkflow(false)
//     }
//   }

//   const saveWorkflow = async (workflow: WorkflowItem) => {
//     setIsSaving(true)

//     try {
//       const response = await fetch("/api/workflows", {
//         method: workflow.id.startsWith("temp-") ? "POST" : "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(workflow),
//       })

//       if (response.ok) {
//         const savedWorkflow = await response.json()

//         setWorkflows((prev) => {
//           const index = prev.findIndex((w) => w.id === workflow.id)
//           if (index >= 0) {
//             const updated = [...prev]
//             updated[index] = savedWorkflow
//             return updated
//           } else {
//             return [...prev, savedWorkflow]
//           }
//         })

//         if (selectedWorkflow?.id === workflow.id) {
//           setSelectedWorkflow(savedWorkflow)
//         }

//         toast({
//           title: "Success",
//           description: "Workflow saved successfully",
//         })
//       } else {
//         throw new Error("Failed to save workflow")
//       }
//     } catch (error) {
//       console.error("Failed to save workflow:", error)
//       toast({
//         title: "Error",
//         description: "Failed to save workflow",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   const createNewWorkflow = () => {
//     const newWorkflow: WorkflowItem = {
//       id: `temp-${Date.now()}`,
//       name: "New Workflow",
//       description: "Describe what this workflow does",
//       isActive: false,
//       aiGenerated: false,
//       steps: [],
//       conditions: [],
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     }

//     setWorkflows([...workflows, newWorkflow])
//     setSelectedWorkflow(newWorkflow)
//     setIsCreatingWorkflow(true)
//   }

//   const addStepToWorkflow = (integration: Integration, capability: any) => {
//     if (!selectedWorkflow) return

//     const newStep: WorkflowStep = {
//       id: `temp-step-${Date.now()}`,
//       stepId: `step_${selectedWorkflow.steps.length + 1}`,
//       stepType: selectedWorkflow.steps.length === 0 ? "trigger" : "action",
//       integrationId: integration.id,
//       integrationName: integration.name,
//       capabilityId: capability.id,
//       capabilityName: capability.name,
//       config: {},
//       positionX: 100 + selectedWorkflow.steps.length * 200,
//       positionY: 100,
//       stepOrder: selectedWorkflow.steps.length,
//     }

//     const updatedWorkflow = {
//       ...selectedWorkflow,
//       steps: [...selectedWorkflow.steps, newStep],
//       updatedAt: new Date().toISOString(),
//     }

//     setSelectedWorkflow(updatedWorkflow)
//     setWorkflows((prev) => prev.map((w) => (w.id === updatedWorkflow.id ? updatedWorkflow : w)))
//   }

//   const removeStep = (stepId: string) => {
//     if (!selectedWorkflow) return

//     const updatedWorkflow = {
//       ...selectedWorkflow,
//       steps: selectedWorkflow.steps.filter((s) => s.id !== stepId),
//       updatedAt: new Date().toISOString(),
//     }

//     setSelectedWorkflow(updatedWorkflow)
//     setWorkflows((prev) => prev.map((w) => (w.id === updatedWorkflow.id ? updatedWorkflow : w)))
//   }

//   const toggleWorkflowActive = async (workflow: WorkflowItem) => {
//     const updatedWorkflow = {
//       ...workflow,
//       isActive: !workflow.isActive,
//       updatedAt: new Date().toISOString(),
//     }

//     await saveWorkflow(updatedWorkflow)
//   }

//   const applySuggestion = (suggestion: WorkflowItem) => {
//     const newWorkflow = {
//       ...suggestion,
//       id: `temp-${Date.now()}`,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     }

//     setWorkflows([...workflows, newWorkflow])
//     setSelectedWorkflow(newWorkflow)
//     setAiSuggestions([])
//     setWorkflowPrompt("")
//   }

//   const updateWorkflowDetails = (updates: Partial<WorkflowItem>) => {
//     if (!selectedWorkflow) return

//     const updatedWorkflow = {
//       ...selectedWorkflow,
//       ...updates,
//       updatedAt: new Date().toISOString(),
//     }

//     setSelectedWorkflow(updatedWorkflow)
//     setWorkflows((prev) => prev.map((w) => (w.id === updatedWorkflow.id ? updatedWorkflow : w)))
//   }

//   const WorkflowCard = ({ workflow }: { workflow: WorkflowItem }) => (
//     <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedWorkflow(workflow)}>
//       <CardHeader className="pb-3">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <div className="p-2 rounded-lg bg-primary/10">
//               <WorkflowIcon className="h-4 w-4 text-primary" />
//             </div>
//             <div>
//               <CardTitle className="text-base font-semibold">{workflow.name}</CardTitle>
//               <CardDescription className="text-sm">{workflow.description}</CardDescription>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             {workflow.aiGenerated && (
//               <Badge variant="outline" className="text-xs">
//                 <Sparkles className="h-3 w-3 mr-1" />
//                 AI
//               </Badge>
//             )}
//             <Badge variant={workflow.isActive ? "default" : "secondary"}>
//               {workflow.isActive ? "Active" : "Inactive"}
//             </Badge>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent className="pt-0">
//         <div className="flex items-center justify-between text-sm text-muted-foreground">
//           <div className="flex items-center gap-4">
//             <span className="flex items-center gap-1">
//               <Target className="h-3 w-3" />
//               {workflow.steps.length} steps
//             </span>
//             <span className="flex items-center gap-1">
//               <Clock className="h-3 w-3" />
//               {new Date(workflow.updatedAt).toLocaleDateString()}
//             </span>
//           </div>
//           <ChevronRight className="h-4 w-4" />
//         </div>
//       </CardContent>
//     </Card>
//   )

//   const WorkflowBuilder = ({ workflow }: { workflow: WorkflowItem }) => (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div className="flex-1 space-y-2">
//           <Input
//             value={workflow.name}
//             onChange={(e) => updateWorkflowDetails({ name: e.target.value })}
//             className="text-2xl font-bold border-none p-0 h-auto bg-transparent"
//             placeholder="Workflow Name"
//           />
//           <Input
//             value={workflow.description}
//             onChange={(e) => updateWorkflowDetails({ description: e.target.value })}
//             className="text-muted-foreground border-none p-0 h-auto bg-transparent"
//             placeholder="Describe what this workflow does"
//           />
//         </div>
//         <div className="flex items-center gap-2">
//           <Switch checked={workflow.isActive} onCheckedChange={() => toggleWorkflowActive(workflow)} />
//           <Button onClick={() => saveWorkflow(workflow)} disabled={isSaving} size="sm">
//             {isSaving ? (
//               <>
//                 <Activity className="h-4 w-4 mr-2 animate-spin" />
//                 Saving...
//               </>
//             ) : (
//               <>
//                 <Save className="h-4 w-4 mr-2" />
//                 Save
//               </>
//             )}
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         {/* Workflow Canvas */}
//         <div className="lg:col-span-3">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <GitBranch className="h-5 w-5" />
//                 Workflow Canvas
//               </CardTitle>
//               <CardDescription>Drag and drop to build your automation workflow</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div
//                 className="min-h-[400px] bg-muted/30 rounded-lg p-6 relative"
//                 onDrop={(e) => {
//                   e.preventDefault()
//                   // Handle drop logic here
//                 }}
//                 onDragOver={(e) => e.preventDefault()}
//               >
//                 {workflow.steps.length === 0 ? (
//                   <div className="flex flex-col items-center justify-center h-full text-center">
//                     <Bot className="h-12 w-12 text-muted-foreground mb-4" />
//                     <h3 className="text-lg font-semibold mb-2">Start Building Your Workflow</h3>
//                     <p className="text-muted-foreground mb-4">
//                       Add steps from the panel on the right to create your automation
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     {workflow.steps
//                       .sort((a, b) => a.stepOrder - b.stepOrder)
//                       .map((step, index) => {
//                         const IntegrationIcon = getIntegrationIcon(step.integrationName)
//                         return (
//                           <div key={step.id} className="flex items-center gap-4">
//                             <Card className="flex-1 p-4 relative group">
//                               <div className="flex items-center gap-3">
//                                 <div className="p-2 rounded-lg bg-primary/10">
//                                   <IntegrationIcon className="h-4 w-4 text-primary" />
//                                 </div>
//                                 <div className="flex-1">
//                                   <h4 className="font-semibold">{step.capabilityName}</h4>
//                                   <p className="text-sm text-muted-foreground">{step.integrationName}</p>
//                                 </div>
//                                 <div className="opacity-0 group-hover:opacity-100 transition-opacity">
//                                   <Button
//                                     variant="ghost"
//                                     size="sm"
//                                     onClick={() => removeStep(step.id)}
//                                     className="h-8 w-8 p-0 text-destructive hover:text-destructive"
//                                   >
//                                     <Trash2 className="h-4 w-4" />
//                                   </Button>
//                                 </div>
//                               </div>
//                             </Card>
//                             {index < workflow.steps.length - 1 && (
//                               <ArrowDown className="h-5 w-5 text-muted-foreground" />
//                             )}
//                           </div>
//                         )
//                       })}
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Step Configuration Panel */}
//         <div className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Plus className="h-5 w-5" />
//                 Add Step
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {connectedIntegrations.map((integration) => {
//                 const IntegrationIcon = getIntegrationIcon(integration.type)
//                 return (
//                   <div key={integration.id} className="space-y-2">
//                     <div className="flex items-center gap-2">
//                       <IntegrationIcon className="h-4 w-4" />
//                       <span className="font-medium text-sm">{integration.name}</span>
//                     </div>
//                     <div className="space-y-1 ml-6">
//                       {integration.capabilities.map((capability) => (
//                         <Button
//                           key={capability.id}
//                           variant="ghost"
//                           size="sm"
//                           className="w-full justify-start text-xs h-8"
//                           onClick={() => addStepToWorkflow(integration, capability)}
//                         >
//                           <Plus className="h-3 w-3 mr-2" />
//                           {capability.name}
//                         </Button>
//                       ))}
//                     </div>
//                   </div>
//                 )
//               })}
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Sparkles className="h-5 w-5" />
//                 AI Assistant
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               <p className="text-sm text-muted-foreground">
//                 Describe what you want your workflow to do, and I&apos;ll help build it.
//               </p>
//               <Textarea
//                 placeholder="e.g., When someone pays, book them a meeting and send confirmation email"
//                 value={workflowPrompt}
//                 onChange={(e) => setWorkflowPrompt(e.target.value)}
//                 className="min-h-[80px]"
//               />
//               <Button
//                 onClick={generateWorkflowWithAI}
//                 disabled={isGeneratingWorkflow || !workflowPrompt.trim()}
//                 className="w-full"
//                 size="sm"
//               >
//                 {isGeneratingWorkflow ? (
//                   <>
//                     <Activity className="h-4 w-4 mr-2 animate-spin" />
//                     Generating...
//                   </>
//                 ) : (
//                   <>
//                     <Sparkles className="h-4 w-4 mr-2" />
//                     Generate Workflow
//                   </>
//                 )}
//               </Button>

//               {aiSuggestions.length > 0 && (
//                 <div className="space-y-2">
//                   <Label className="text-xs font-medium">AI Suggestions:</Label>
//                   {aiSuggestions.map((suggestion, index) => (
//                     <Card
//                       key={index}
//                       className="p-3 cursor-pointer hover:bg-muted/50"
//                       onClick={() => applySuggestion(suggestion)}
//                     >
//                       <div className="space-y-1">
//                         <h4 className="text-sm font-medium">{suggestion.name}</h4>
//                         <p className="text-xs text-muted-foreground">{suggestion.description}</p>
//                         <div className="flex items-center gap-1 text-xs text-muted-foreground">
//                           <Target className="h-3 w-3" />
//                           {suggestion.steps.length} steps
//                         </div>
//                       </div>
//                     </Card>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="text-center">
//           <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
//           <p className="text-muted-foreground">Loading workflows...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="container mx-auto p-6 max-w-7xl">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold mb-2">AI Agent Workflows</h1>
//           <p className="text-muted-foreground">Configure what your AI agent does with your connected integrations</p>
//         </div>

//         <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
//           <TabsList className="grid w-full grid-cols-2 max-w-md">
//             <TabsTrigger value="workflows" className="flex items-center gap-2">
//               <WorkflowIcon className="h-4 w-4" />
//               Workflows
//             </TabsTrigger>
//             <TabsTrigger value="integrations" className="flex items-center gap-2">
//               <Settings className="h-4 w-4" />
//               Integrations
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="workflows" className="space-y-6">
//             {selectedWorkflow ? (
//               <div>
//                 <Button variant="ghost" onClick={() => setSelectedWorkflow(null)} className="mb-4">
//                   ← Back to Workflows
//                 </Button>
//                 <WorkflowBuilder workflow={selectedWorkflow} />
//               </div>
//             ) : (
//               <div className="space-y-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h2 className="text-xl font-semibold">Your Workflows</h2>
//                     <p className="text-muted-foreground">Manage your AI agent automation workflows</p>
//                   </div>
//                   <Button onClick={createNewWorkflow}>
//                     <Plus className="h-4 w-4 mr-2" />
//                     Create Workflow
//                   </Button>
//                 </div>

//                 {workflows.length === 0 ? (
//                   <Card>
//                     <CardContent className="flex flex-col items-center justify-center py-12">
//                       <Bot className="h-16 w-16 text-muted-foreground mb-4" />
//                       <h3 className="text-xl font-semibold mb-2">No Workflows Yet</h3>
//                       <p className="text-muted-foreground text-center mb-6 max-w-md">
//                         Create your first workflow to define what your AI agent should do with your connected
//                         integrations.
//                       </p>
//                       <Button onClick={createNewWorkflow}>
//                         <Plus className="h-4 w-4 mr-2" />
//                         Create Your First Workflow
//                       </Button>
//                     </CardContent>
//                   </Card>
//                 ) : (
//                   <div className="grid gap-4">
//                     {workflows.map((workflow) => (
//                       <WorkflowCard key={workflow.id} workflow={workflow} />
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}
//           </TabsContent>

//           <TabsContent value="integrations" className="space-y-6">
//             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//               {connectedIntegrations.map((integration) => {
//                 const IntegrationIcon = getIntegrationIcon(integration.type)
//                 return (
//                   <Card key={integration.id}>
//                     <CardHeader>
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 rounded-lg bg-primary/10">
//                           <IntegrationIcon className="h-5 w-5 text-primary" />
//                         </div>
//                         <div>
//                           <CardTitle className="text-lg">{integration.name}</CardTitle>
//                           <Badge variant={integration.isActive ? "default" : "secondary"} className="mt-1">
//                             {integration.isActive ? "Connected" : "Disconnected"}
//                           </Badge>
//                         </div>
//                       </div>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-2">
//                         <Label className="text-sm font-medium">Available Actions:</Label>
//                         {integration.capabilities.map((capability) => (
//                           <div key={capability.id} className="flex items-center gap-2 text-sm">
//                             <CheckCircle className="h-3 w-3 text-primary" />
//                             {capability.name}
//                           </div>
//                         ))}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 )
//               })}
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   )
// }

// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Switch } from "@/components/ui/switch"
// import { Input } from "@/components/ui/input"
// import { toast } from "@/hooks/use-toast"
// import {
//   CreditCard,
//   Calendar,
//   Mail,
//   ShoppingCart,
//   Settings,
//   CheckCircle,
//   Plus,
//   ArrowDown,
//   Bot,
//   Sparkles,
//   GitBranch,
//   Save,
//   ChevronRight,
//   WorkflowIcon,
//   Target,
//   Clock,
//   Activity,
//   Trash2,
// } from "lucide-react"

// interface WorkflowStep {
//   id: string
//   stepId: string
//   stepType: "trigger" | "action" | "condition"
//   integrationId: string
//   integrationName: string
//   capabilityId: string
//   capabilityName: string
//   config: Record<string, any>
//   positionX: number
//   positionY: number
//   stepOrder: number
//   parentStepId?: string
// }

// interface WorkflowCondition {
//   id: string
//   conditionId: string
//   field: string
//   operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than"
//   value: string
//   trueStepId?: string
//   falseStepId?: string
// }

// interface WorkflowItem {
//   id: string
//   name: string
//   description: string
//   isActive: boolean
//   aiPrompt?: string
//   aiGenerated: boolean
//   steps: WorkflowStep[]
//   conditions: WorkflowCondition[]
//   createdAt: string
//   updatedAt: string
// }

// interface Integration {
//   id: string
//   name: string
//   type: string
//   isActive: boolean
//   capabilities: Array<{
//     id: string
//     name: string
//     description: string
//   }>
// }

// const getIntegrationIcon = (type: string) => {
//   switch (type.toUpperCase()) {
//     case "STRIPE":
//       return CreditCard
//     case "SHOPIFY":
//       return ShoppingCart
//     case "CALENDLY":
//       return Calendar
//     case "SENDGRID":
//       return Mail
//     default:
//       return Settings
//   }
// }

// export default function WorkflowBuilderPage() {
//   const [activeTab, setActiveTab] = useState("workflows")
//   const [workflows, setWorkflows] = useState<WorkflowItem[]>([])
//   const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowItem | null>(null)
//   const [isCreatingWorkflow, setIsCreatingWorkflow] = useState(false)
//   const [connectedIntegrations, setConnectedIntegrations] = useState<Integration[]>([])
//   const [aiSuggestions, setAiSuggestions] = useState<WorkflowItem[]>([])
//   const [isGeneratingWorkflow, setIsGeneratingWorkflow] = useState(false)
//   const [workflowPrompt, setWorkflowPrompt] = useState("")
//   const [isSaving, setIsSaving] = useState(false)
//   const [isLoading, setIsLoading] = useState(true)
//   const [draggedStep, setDraggedStep] = useState<WorkflowStep | null>(null)

//   useEffect(() => {
//     loadWorkflows()
//     loadIntegrations()
//   }, [])

//   const loadWorkflows = async () => {
//     try {
//       const response = await fetch("/api/workflows")
//       if (response.ok) {
//         const data = await response.json()
//         setWorkflows(data.workflows)
//       }
//     } catch (error) {
//       console.error("Failed to load workflows:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load workflows",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const loadIntegrations = async () => {
//     try {
//       const response = await fetch("/api/integrations")
//       if (response.ok) {
//         const data = await response.json()
//         setConnectedIntegrations(data.integrations)
//       }
//     } catch (error) {
//       console.error("Failed to load integrations:", error)
//     }
//   }

//   const generateWorkflowWithAI = async () => {
//     if (!workflowPrompt.trim()) return

//     setIsGeneratingWorkflow(true)

//     try {
//       const response = await fetch("/api/ai/generate-workflow", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           prompt: workflowPrompt,
//           integrations: connectedIntegrations,
//         }),
//       })

//       if (response.ok) {
//         const data = await response.json()
//         setAiSuggestions(data.suggestions)
//         toast({
//           title: "Workflow Generated",
//           description: "AI has generated workflow suggestions for you",
//         })
//       } else {
//         throw new Error("Failed to generate workflow")
//       }
//     } catch (error) {
//       console.error("Failed to generate workflow:", error)
//       toast({
//         title: "Error",
//         description: "Failed to generate workflow. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsGeneratingWorkflow(false)
//     }
//   }

//   const saveWorkflow = async (workflow: WorkflowItem) => {
//     setIsSaving(true)

//     try {
//       const response = await fetch("/api/workflows", {
//         method: workflow.id.startsWith("temp-") ? "POST" : "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(workflow),
//       })

//       if (response.ok) {
//         const savedWorkflow = await response.json()

//         setWorkflows((prev) => {
//           const index = prev.findIndex((w) => w.id === workflow.id)
//           if (index >= 0) {
//             const updated = [...prev]
//             updated[index] = savedWorkflow
//             return updated
//           } else {
//             return [...prev, savedWorkflow]
//           }
//         })

//         if (selectedWorkflow?.id === workflow.id) {
//           setSelectedWorkflow(savedWorkflow)
//         }

//         toast({
//           title: "Success",
//           description: "Workflow saved successfully",
//         })
//       } else {
//         throw new Error("Failed to save workflow")
//       }
//     } catch (error) {
//       console.error("Failed to save workflow:", error)
//       toast({
//         title: "Error",
//         description: "Failed to save workflow",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   const createNewWorkflow = () => {
//     const newWorkflow: WorkflowItem = {
//       id: `temp-${Date.now()}`,
//       name: "New Workflow",
//       description: "Describe what this workflow does",
//       isActive: false,
//       aiGenerated: false,
//       steps: [],
//       conditions: [],
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     }

//     setWorkflows([...workflows, newWorkflow])
//     setSelectedWorkflow(newWorkflow)
//     setIsCreatingWorkflow(true)
//   }

//   const addStepToWorkflow = (integration: Integration, capability: any) => {
//     if (!selectedWorkflow) return

//     const newStep: WorkflowStep = {
//       id: `temp-step-${Date.now()}`,
//       stepId: `step_${selectedWorkflow.steps.length + 1}`,
//       stepType: selectedWorkflow.steps.length === 0 ? "trigger" : "action",
//       integrationId: integration.id,
//       integrationName: integration.name,
//       capabilityId: capability.id,
//       capabilityName: capability.name,
//       config: {},
//       positionX: 100 + selectedWorkflow.steps.length * 200,
//       positionY: 100,
//       stepOrder: selectedWorkflow.steps.length,
//     }

//     const updatedWorkflow = {
//       ...selectedWorkflow,
//       steps: [...selectedWorkflow.steps, newStep],
//       updatedAt: new Date().toISOString(),
//     }

//     setSelectedWorkflow(updatedWorkflow)
//     setWorkflows((prev) => prev.map((w) => (w.id === updatedWorkflow.id ? updatedWorkflow : w)))
//   }

//   const removeStep = (stepId: string) => {
//     if (!selectedWorkflow) return

//     const updatedWorkflow = {
//       ...selectedWorkflow,
//       steps: selectedWorkflow.steps.filter((s) => s.id !== stepId),
//       updatedAt: new Date().toISOString(),
//     }

//     setSelectedWorkflow(updatedWorkflow)
//     setWorkflows((prev) => prev.map((w) => (w.id === updatedWorkflow.id ? updatedWorkflow : w)))
//   }

//   const toggleWorkflowActive = async (workflow: WorkflowItem) => {
//     const updatedWorkflow = {
//       ...workflow,
//       isActive: !workflow.isActive,
//       updatedAt: new Date().toISOString(),
//     }

//     await saveWorkflow(updatedWorkflow)
//   }

//   const applySuggestion = (suggestion: WorkflowItem) => {
//     const newWorkflow = {
//       ...suggestion,
//       id: `temp-${Date.now()}`,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     }

//     setWorkflows([...workflows, newWorkflow])
//     setSelectedWorkflow(newWorkflow)
//     setAiSuggestions([])
//     setWorkflowPrompt("")
//   }

//   const updateWorkflowDetails = (updates: Partial<WorkflowItem>) => {
//     if (!selectedWorkflow) return

//     const updatedWorkflow = {
//       ...selectedWorkflow,
//       ...updates,
//       updatedAt: new Date().toISOString(),
//     }

//     setSelectedWorkflow(updatedWorkflow)
//     setWorkflows((prev) => prev.map((w) => (w.id === updatedWorkflow.id ? updatedWorkflow : w)))
//   }

//   const handlePromptChange = (value: string) => {
//     setWorkflowPrompt(value)
//   }

//   const WorkflowCard = ({ workflow }: { workflow: WorkflowItem }) => (
//     <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedWorkflow(workflow)}>
//       <CardHeader className="pb-3">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <div className="p-2 rounded-lg bg-primary/10">
//               <WorkflowIcon className="h-4 w-4 text-primary" />
//             </div>
//             <div>
//               <CardTitle className="text-base font-semibold">{workflow.name}</CardTitle>
//               <CardDescription className="text-sm">{workflow.description}</CardDescription>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             {workflow.aiGenerated && (
//               <Badge variant="outline" className="text-xs">
//                 <Sparkles className="h-3 w-3 mr-1" />
//                 AI
//               </Badge>
//             )}
//             <Badge variant={workflow.isActive ? "default" : "secondary"}>
//               {workflow.isActive ? "Active" : "Inactive"}
//             </Badge>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent className="pt-0">
//         <div className="flex items-center justify-between text-sm text-muted-foreground">
//           <div className="flex items-center gap-4">
//             <span className="flex items-center gap-1">
//               <Target className="h-3 w-3" />
//               {workflow.steps.length} steps
//             </span>
//             <span className="flex items-center gap-1">
//               <Clock className="h-3 w-3" />
//               {new Date(workflow.updatedAt).toLocaleDateString()}
//             </span>
//           </div>
//           <ChevronRight className="h-4 w-4" />
//         </div>
//       </CardContent>
//     </Card>
//   )

//   const WorkflowBuilder = ({ workflow }: { workflow: WorkflowItem }) => (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div className="flex-1 space-y-2">
//           <Input
//             value={workflow.name}
//             onChange={(e) => updateWorkflowDetails({ name: e.target.value })}
//             className="text-2xl font-bold border-none p-0 h-auto bg-transparent"
//             placeholder="Workflow Name"
//           />
//           <Input
//             value={workflow.description}
//             onChange={(e) => updateWorkflowDetails({ description: e.target.value })}
//             className="text-muted-foreground border-none p-0 h-auto bg-transparent"
//             placeholder="Describe what this workflow does"
//           />
//         </div>
//         <div className="flex items-center gap-2">
//           <Switch checked={workflow.isActive} onCheckedChange={() => toggleWorkflowActive(workflow)} />
//           <Button onClick={() => saveWorkflow(workflow)} disabled={isSaving} size="sm">
//             {isSaving ? (
//               <>
//                 <Activity className="h-4 w-4 mr-2 animate-spin" />
//                 Saving...
//               </>
//             ) : (
//               <>
//                 <Save className="h-4 w-4 mr-2" />
//                 Save
//               </>
//             )}
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         {/* Workflow Canvas */}
//         <div className="lg:col-span-3">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <GitBranch className="h-5 w-5" />
//                 Workflow Canvas
//               </CardTitle>
//               <CardDescription>Drag and drop to build your automation workflow</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div
//                 className="min-h-[400px] bg-muted/30 rounded-lg p-6 relative border-2 border-dashed border-muted-foreground/20"
//                 onDrop={(e) => {
//                   e.preventDefault()
//                   if (draggedStep) {
//                     const rect = e.currentTarget.getBoundingClientRect()
//                     const x = e.clientX - rect.left
//                     const y = e.clientY - rect.top

//                     const updatedStep = {
//                       ...draggedStep,
//                       positionX: x,
//                       positionY: y,
//                     }

//                     const updatedWorkflow = {
//                       ...workflow,
//                       steps: [...workflow.steps, updatedStep],
//                       updatedAt: new Date().toISOString(),
//                     }

//                     setSelectedWorkflow(updatedWorkflow)
//                     setWorkflows((prev) => prev.map((w) => (w.id === updatedWorkflow.id ? updatedWorkflow : w)))
//                     setDraggedStep(null)

//                     toast({
//                       title: "Step Added",
//                       description: `${updatedStep.capabilityName} added to workflow`,
//                     })
//                   }
//                 }}
//                 onDragOver={(e) => {
//                   e.preventDefault()
//                   e.dataTransfer.dropEffect = "copy"
//                 }}
//               >
//                 {workflow.steps.length === 0 ? (
//                   <div className="flex flex-col items-center justify-center h-full text-center">
//                     <Bot className="h-12 w-12 text-muted-foreground mb-4" />
//                     <h3 className="text-lg font-semibold mb-2">Start Building Your Workflow</h3>
//                     <p className="text-muted-foreground mb-4">
//                       Drag steps from the panel on the right or use the AI assistant to create your automation
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     {workflow.steps
//                       .sort((a, b) => a.stepOrder - b.stepOrder)
//                       .map((step, index) => {
//                         const IntegrationIcon = getIntegrationIcon(step.integrationName)
//                         return (
//                           <div key={step.id} className="flex items-center gap-4">
//                             <Card
//                               className="flex-1 p-4 relative group cursor-move hover:shadow-md transition-shadow"
//                               draggable
//                               onDragStart={(e) => {
//                                 setDraggedStep(step)
//                                 e.dataTransfer.effectAllowed = "move"
//                               }}
//                             >
//                               <div className="flex items-center gap-3">
//                                 <div className="p-2 rounded-lg bg-primary/10">
//                                   <IntegrationIcon className="h-4 w-4 text-primary" />
//                                 </div>
//                                 <div className="flex-1">
//                                   <h4 className="font-semibold">{step.capabilityName}</h4>
//                                   <p className="text-sm text-muted-foreground">{step.integrationName}</p>
//                                   <Badge variant="outline" className="text-xs mt-1">
//                                     {step.stepType}
//                                   </Badge>
//                                 </div>
//                                 <div className="opacity-0 group-hover:opacity-100 transition-opacity">
//                                   <Button
//                                     variant="ghost"
//                                     size="sm"
//                                     onClick={() => removeStep(step.id)}
//                                     className="h-8 w-8 p-0 text-destructive hover:text-destructive"
//                                   >
//                                     <Trash2 className="h-4 w-4" />
//                                   </Button>
//                                 </div>
//                               </div>
//                             </Card>
//                             {index < workflow.steps.length - 1 && (
//                               <ArrowDown className="h-5 w-5 text-muted-foreground" />
//                             )}
//                           </div>
//                         )
//                       })}
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Step Configuration Panel */}
//         <div className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Plus className="h-5 w-5" />
//                 Add Step
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {connectedIntegrations.map((integration) => {
//                 const IntegrationIcon = getIntegrationIcon(integration.type)
//                 return (
//                   <div key={integration.id} className="space-y-2">
//                     <div className="flex items-center gap-2">
//                       <IntegrationIcon className="h-4 w-4" />
//                       <span className="font-medium text-sm">{integration.name}</span>
//                     </div>
//                     <div className="space-y-1 ml-6">
//                       {integration.capabilities.map((capability) => (
//                         <Button
//                           key={capability.id}
//                           variant="ghost"
//                           size="sm"
//                           className="w-full justify-start text-xs h-8"
//                           draggable
//                           onDragStart={(e) => {
//                             const newStep: WorkflowStep = {
//                               id: `temp-step-${Date.now()}`,
//                               stepId: `step_${workflow.steps.length + 1}`,
//                               stepType: workflow.steps.length === 0 ? "trigger" : "action",
//                               integrationId: integration.id,
//                               integrationName: integration.name,
//                               capabilityId: capability.id,
//                               capabilityName: capability.name,
//                               config: {},
//                               positionX: 100 + workflow.steps.length * 200,
//                               positionY: 100,
//                               stepOrder: workflow.steps.length,
//                             }
//                             setDraggedStep(newStep)
//                             e.dataTransfer.effectAllowed = "copy"
//                           }}
//                           onClick={() => addStepToWorkflow(integration, capability)}
//                         >
//                           <Plus className="h-3 w-3 mr-2" />
//                           {capability.name}
//                         </Button>
//                       ))}
//                     </div>
//                   </div>
//                 )
//               })}
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Sparkles className="h-5 w-5" />
//                 AI Assistant
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               <p className="text-sm text-muted-foreground">
//                 Describe what you want your workflow to do, and I'll help build it.
//               </p>
//               <Textarea
//                 key="workflow-prompt-textarea"
//                 placeholder="e.g., When someone pays, book them a meeting and send confirmation email"
//                 value={workflowPrompt}
//                 onChange={(e) => handlePromptChange(e.target.value)}
//                 className="min-h-[80px]"
//               />
//               <Button
//                 onClick={generateWorkflowWithAI}
//                 disabled={isGeneratingWorkflow || !workflowPrompt.trim()}
//                 className="w-full"
//                 size="sm"
//               >
//                 {isGeneratingWorkflow ? (
//                   <>
//                     <Activity className="h-4 w-4 mr-2 animate-spin" />
//                     Generating...
//                   </>
//                 ) : (
//                   <>
//                     <Sparkles className="h-4 w-4 mr-2" />
//                     Generate Workflow
//                   </>
//                 )}
//               </Button>

//               {aiSuggestions.length > 0 && (
//                 <div className="space-y-2">
//                   <Label className="text-xs font-medium">AI Suggestions:</Label>
//                   {aiSuggestions.map((suggestion, index) => (
//                     <Card
//                       key={index}
//                       className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
//                       onClick={() => applySuggestion(suggestion)}
//                     >
//                       <div className="space-y-1">
//                         <h4 className="text-sm font-medium">{suggestion.name}</h4>
//                         <p className="text-xs text-muted-foreground">{suggestion.description}</p>
//                         <div className="flex items-center gap-1 text-xs text-muted-foreground">
//                           <Target className="h-3 w-3" />
//                           {suggestion.steps.length} steps
//                         </div>
//                       </div>
//                     </Card>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="text-center">
//           <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
//           <p className="text-muted-foreground">Loading workflows...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="container mx-auto p-6 max-w-7xl">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold mb-2">AI Agent Workflows</h1>
//           <p className="text-muted-foreground">Configure what your AI agent does with your connected integrations</p>
//         </div>

//         <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
//           <TabsList className="grid w-full grid-cols-2 max-w-md">
//             <TabsTrigger value="workflows" className="flex items-center gap-2">
//               <WorkflowIcon className="h-4 w-4" />
//               Workflows
//             </TabsTrigger>
//             <TabsTrigger value="integrations" className="flex items-center gap-2">
//               <Settings className="h-4 w-4" />
//               Integrations
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="workflows" className="space-y-6">
//             {selectedWorkflow ? (
//               <div>
//                 <Button variant="ghost" onClick={() => setSelectedWorkflow(null)} className="mb-4">
//                   ← Back to Workflows
//                 </Button>
//                 <WorkflowBuilder workflow={selectedWorkflow} />
//               </div>
//             ) : (
//               <div className="space-y-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h2 className="text-xl font-semibold">Your Workflows</h2>
//                     <p className="text-muted-foreground">Manage your AI agent automation workflows</p>
//                   </div>
//                   <Button onClick={createNewWorkflow}>
//                     <Plus className="h-4 w-4 mr-2" />
//                     Create Workflow
//                   </Button>
//                 </div>

//                 {workflows.length === 0 ? (
//                   <Card>
//                     <CardContent className="flex flex-col items-center justify-center py-12">
//                       <Bot className="h-16 w-16 text-muted-foreground mb-4" />
//                       <h3 className="text-xl font-semibold mb-2">No Workflows Yet</h3>
//                       <p className="text-muted-foreground text-center mb-6 max-w-md">
//                         Create your first workflow to define what your AI agent should do with your connected
//                         integrations.
//                       </p>
//                       <Button onClick={createNewWorkflow}>
//                         <Plus className="h-4 w-4 mr-2" />
//                         Create Your First Workflow
//                       </Button>
//                     </CardContent>
//                   </Card>
//                 ) : (
//                   <div className="grid gap-4">
//                     {workflows.map((workflow) => (
//                       <WorkflowCard key={workflow.id} workflow={workflow} />
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}
//           </TabsContent>

//           <TabsContent value="integrations" className="space-y-6">
//             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//               {connectedIntegrations.map((integration) => {
//                 const IntegrationIcon = getIntegrationIcon(integration.type)
//                 return (
//                   <Card key={integration.id}>
//                     <CardHeader>
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 rounded-lg bg-primary/10">
//                           <IntegrationIcon className="h-5 w-5 text-primary" />
//                         </div>
//                         <div>
//                           <CardTitle className="text-lg">{integration.name}</CardTitle>
//                           <Badge variant={integration.isActive ? "default" : "secondary"} className="mt-1">
//                             {integration.isActive ? "Connected" : "Disconnected"}
//                           </Badge>
//                         </div>
//                       </div>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-2">
//                         <Label className="text-sm font-medium">Available Actions:</Label>
//                         {integration.capabilities.map((capability) => (
//                           <div key={capability.id} className="flex items-center gap-2 text-sm">
//                             <CheckCircle className="h-3 w-3 text-primary" />
//                             {capability.name}
//                           </div>
//                         ))}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 )
//               })}
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   )
// }
// "use client"

// import { useState, useEffect } from "react"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { toast } from "@/hooks/use-toast"
// import { WorkflowIcon, Settings, Activity } from "lucide-react"
// import { WorkflowManager } from "../_components/workflow/workflow-manager"
// import { IntegrationsManager } from "../_components/workflow/integrations-manager"
// import { useWorkflows } from "@/hooks/use-workflows"
// import { useIntegrations } from "@/hooks/use-integrations"

// export default function AIAgentDashboard() {
//   const [activeTab, setActiveTab] = useState("workflows")
//   const { workflows, isLoading: workflowsLoading, error: workflowsError } = useWorkflows()
//   const { integrations, isLoading: integrationsLoading, error: integrationsError } = useIntegrations()

//   const isLoading = workflowsLoading || integrationsLoading
//   const hasError = workflowsError || integrationsError

//   useEffect(() => {
//     if (hasError) {
//       toast({
//         title: "Error",
//         description: "Failed to load data. Please refresh the page.",
//         variant: "destructive",
//       })
//     }
//   }, [hasError])

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="text-center space-y-4">
//           <Activity className="h-8 w-8 animate-spin mx-auto text-primary" />
//           <p className="text-muted-foreground">Loading AI Agent Dashboard...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="container mx-auto p-6 max-w-7xl">
//         <header className="mb-8">
//           <h1 className="text-3xl font-bold tracking-tight mb-2">AI Agent Control Center</h1>
//           <p className="text-muted-foreground text-lg">
//             Configure intelligent workflows for your AI assistant using connected integrations
//           </p>
//         </header>

//         <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
//           <TabsList className="grid w-full grid-cols-2 max-w-md">
//             <TabsTrigger value="workflows" className="flex items-center gap-2">
//               <WorkflowIcon className="h-4 w-4" />
//               Workflows
//             </TabsTrigger>
//             <TabsTrigger value="integrations" className="flex items-center gap-2">
//               <Settings className="h-4 w-4" />
//               Integrations
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="workflows">
//             <WorkflowManager workflows={workflows} integrations={integrations} />
//           </TabsContent>

//           <TabsContent value="integrations">
//             <IntegrationsManager integrations={integrations} />
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { Bot, Settings, Activity, Shield } from "lucide-react"
import { WorkflowManager } from "../_components/workflow/workflow-manager"
import { IntegrationsManager } from "../_components/workflow/integrations-manager"
import { useWorkflows } from "@/hooks/use-workflows"
import { useIntegrations } from "@/hooks/use-integrations"

export default function AIAgentDashboard() {
  const [activeTab, setActiveTab] = useState("workflows")
  const { workflows, isLoading: workflowsLoading, error: workflowsError } = useWorkflows()
  const { integrations, isLoading: integrationsLoading, error: integrationsError } = useIntegrations()

  const isLoading = workflowsLoading || integrationsLoading
  const hasError = workflowsError || integrationsError

  useEffect(() => {
    if (hasError) {
      toast({
        title: "Error",
        description: "Failed to load data. Please refresh the page.",
        variant: "destructive",
      })
    }
  }, [hasError])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Activity className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading AI Agent Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">AI Agent Permissions</h1>
              <p className="text-muted-foreground text-lg">
                Define what actions your AI agent can perform with your integrations
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <Shield className="h-4 w-4" />
            <span>
              Configure precise permissions to control what your AI agent can do with Stripe, Shopify, Calendly, and
              other connected services.
            </span>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="workflows" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Permissions
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Integrations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workflows">
            <WorkflowManager workflows={workflows} integrations={integrations} />
          </TabsContent>

          <TabsContent value="integrations">
            <IntegrationsManager integrations={integrations} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
