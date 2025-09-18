// "use client"

// import { useState, useCallback } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Plus, Bot, WorkflowIcon, Target, Clock, ChevronRight } from "lucide-react"
// import { WorkflowBuilder } from "./workflow-builder"
// import { type Workflow, useWorkflows } from "@/hooks/use-workflows"
// import type { Integration } from "@/hooks/use-integrations"

// interface WorkflowManagerProps {
//   workflows: Workflow[]
//   integrations: Integration[]
// }

// export function WorkflowManager({ workflows, integrations }: WorkflowManagerProps) {
//   const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
//   const { addWorkflow } = useWorkflows()

//   const createNewWorkflow = useCallback(() => {
//     const newWorkflow: Workflow = {
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

//     addWorkflow(newWorkflow)
//     setSelectedWorkflow(newWorkflow)
//   }, [addWorkflow])

//   const WorkflowCard = ({ workflow }: { workflow: Workflow }) => (
//     <Card
//       className="hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 border-l-primary/20 hover:border-l-primary"
//       onClick={() => setSelectedWorkflow(workflow)}
//     >
//       <CardHeader className="pb-3">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
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
//               <Badge variant="outline" className="text-xs bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
//                 <Bot className="h-3 w-3 mr-1" />
//                 AI Generated
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

//   if (selectedWorkflow) {
//     return (
//       <div>
//         <Button variant="ghost" onClick={() => setSelectedWorkflow(null)} className="mb-6 hover:bg-muted/50">
//           ← Back to Workflows
//         </Button>
//         <WorkflowBuilder
//           workflow={selectedWorkflow}
//           integrations={integrations}
//           onWorkflowChange={setSelectedWorkflow}
//         />
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-semibold tracking-tight">Your Workflows</h2>
//           <p className="text-muted-foreground">Manage AI agent automation workflows for your connected integrations</p>
//         </div>
//         <Button onClick={createNewWorkflow} className="bg-primary hover:bg-primary/90">
//           <Plus className="h-4 w-4 mr-2" />
//           Create Workflow
//         </Button>
//       </div>

//       {workflows.length === 0 ? (
//         <Card className="border-dashed border-2">
//           <CardContent className="flex flex-col items-center justify-center py-16">
//             <div className="p-4 rounded-full bg-muted/50 mb-4">
//               <Bot className="h-12 w-12 text-muted-foreground" />
//             </div>
//             <h3 className="text-xl font-semibold mb-2">No Workflows Yet</h3>
//             <p className="text-muted-foreground text-center mb-6 max-w-md">
//               Create your first workflow to define intelligent automation sequences for your AI agent using your
//               connected integrations.
//             </p>
//             <Button onClick={createNewWorkflow} size="lg">
//               <Plus className="h-4 w-4 mr-2" />
//               Create Your First Workflow
//             </Button>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="grid gap-4">
//           {workflows.map((workflow) => (
//             <WorkflowCard key={workflow.id} workflow={workflow} />
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Bot, Shield, Target, Clock, ChevronRight, AlertCircle } from "lucide-react"
import { WorkflowBuilder } from "./workflow-builder"
import { type Workflow, useWorkflows } from "@/hooks/use-workflows"
import type { Integration } from "@/hooks/use-integrations"

interface WorkflowManagerProps {
  workflows: Workflow[]
  integrations: Integration[]
}

export function WorkflowManager({ workflows, integrations }: WorkflowManagerProps) {
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
  const { addWorkflow } = useWorkflows()

  const activeIntegrations = integrations.filter((i) => i.isActive)

  const createNewWorkflow = useCallback(() => {
    if (activeIntegrations.length === 0) {
      return
    }

    const newWorkflow: Workflow = {
      id: `temp-${Date.now()}`,
      name: "New Permission Set",
      description: "Define what actions the AI agent can perform",
      isActive: false,
      aiGenerated: false,
      steps: [],
      conditions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    addWorkflow(newWorkflow)
    setSelectedWorkflow(newWorkflow)
  }, [addWorkflow, activeIntegrations.length])

  const WorkflowCard = ({ workflow }: { workflow: Workflow }) => (
    <Card
      className="hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 border-l-primary/20 hover:border-l-primary"
      onClick={() => setSelectedWorkflow(workflow)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">{workflow.name}</CardTitle>
              <CardDescription className="text-sm">{workflow.description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {workflow.aiGenerated && (
              <Badge variant="outline" className="text-xs bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                <Bot className="h-3 w-3 mr-1" />
                AI Generated
              </Badge>
            )}
            <Badge variant={workflow.isActive ? "default" : "secondary"}>
              {workflow.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              {workflow.steps.length} permissions
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(workflow.updatedAt).toLocaleDateString()}
            </span>
          </div>
          <ChevronRight className="h-4 w-4" />
        </div>
      </CardContent>
    </Card>
  )

  if (selectedWorkflow) {
    return (
      <div>
        <Button variant="ghost" onClick={() => setSelectedWorkflow(null)} className="mb-6 hover:bg-muted/50">
          ← Back to Permission Sets
        </Button>
        <WorkflowBuilder
          workflow={selectedWorkflow}
          integrations={integrations}
          onWorkflowChange={setSelectedWorkflow}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">AI Agent Permission Sets</h2>
          <p className="text-muted-foreground">Control what actions your AI agent can perform with each integration</p>
        </div>
        {activeIntegrations.length > 0 ? (
          <Button onClick={createNewWorkflow} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Create Permission Set
          </Button>
        ) : (
          <Button disabled className="bg-muted text-muted-foreground">
            <AlertCircle className="h-4 w-4 mr-2" />
            No Active Integrations
          </Button>
        )}
      </div>

      {activeIntegrations.length === 0 && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <div>
              <p className="font-medium text-amber-800">No Active Integrations</p>
              <p className="text-sm text-amber-700">
                You need to activate at least one integration before creating permission sets.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {workflows.length === 0 && activeIntegrations.length > 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 rounded-full bg-muted/50 mb-4">
              <Shield className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Permission Sets Yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Create your first permission set to define what actions your AI agent can perform with your connected
              integrations like Stripe, Shopify, and Calendly.
            </p>
            <Button onClick={createNewWorkflow} size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Permission Set
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {workflows.map((workflow) => (
            <WorkflowCard key={workflow.id} workflow={workflow} />
          ))}
        </div>
      )}
    </div>
  )
}
