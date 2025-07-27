// import type { Metadata } from "next"
// import WorkflowSelector from "../_components/workflow-selector/workflow-selector"

// export const metadata: Metadata = {
//   title: "Workflow Selector | Choose Your Business Automation",
//   description:
//     "Select the perfect workflow template for your business type and automate your social media responses with AI-powered conversations.",
// }

// export default function WorkflowSelectorPage() {
//   return (
//     <div className="min-h-screen">
//       <WorkflowSelector />
//     </div>
//   )
// }

"use client"
import { useState } from "react"
import WorkflowSelector from "../_components/workflow-selector/workflow-selector"

interface PendingWorkflowData {
  id: string
  submittedAt: string
  status: string
  workflowType: string
  estimatedCompletion: string
}

export default function WorkflowSelectorPage() {
  const [step, setStep] = useState("selection")
  const [workflowCreationStatus, setWorkflowCreationStatus] = useState("")
  const [pendingWorkflowData, setPendingWorkflowData] = useState<PendingWorkflowData | null>(null)

  return (
    <div className="min-h-screen bg-background">
      <WorkflowSelector
        currentBusinessId="b909f187-d423-455b-b9bc-c8f9219e48b8"
        businessInfo={{
          businessName: "Sample Business",
          businessType: "Service",
          description: "Sample business description",
          website: "",
          phone: "",
          email: "",
        }}
        selectedWorkflow={undefined}
        isCustomWorkflow={false}
        customRequest=""
        selectedIntegrations={[]}
        integrationConfigs={{}}
        setStep={setStep}
        modifyingWorkflowId={null}
        setWorkflowCreationStatus={setWorkflowCreationStatus}
        setPendingWorkflowData={setPendingWorkflowData}
      />
    </div>
  )
}
