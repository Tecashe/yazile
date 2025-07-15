import type { Metadata } from "next"
import WorkflowSelector from "../_components/workflow-selector/workflow-selector"

export const metadata: Metadata = {
  title: "Workflow Selector | Choose Your Business Automation",
  description:
    "Select the perfect workflow template for your business type and automate your social media responses with AI-powered conversations.",
}

export default function WorkflowSelectorPage() {
  return (
    <div className="min-h-screen">
      <WorkflowSelector />
    </div>
  )
}
