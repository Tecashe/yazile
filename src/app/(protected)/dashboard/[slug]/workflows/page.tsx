// import { EnhancedWorkflowBuilder } from "@/components/global/workflows/enhanced-builder"

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-background">
//       <EnhancedWorkflowBuilder />
//     </div>
//   )
// }

"use client"

import { WorkflowBuilder } from "@/components/global/workflows/enhanced-builder"

export default function WorkflowBuilderPage() {
  return (
    <div className="flex flex-col h-full -m-6">
      <WorkflowBuilder />
    </div>
  )
}