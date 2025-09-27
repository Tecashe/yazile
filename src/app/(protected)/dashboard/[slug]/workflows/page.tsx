// import { EnhancedWorkflowBuilder } from "@/components/global/workflows/enhanced-builder"

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-background">
//       <EnhancedWorkflowBuilder />
//     </div>
//   )
// }

// import { WorkflowBuilder } from "@/components/global/workflows/workflow-builder"

// export default function Home() {
//   return (
//     <div className="h-screen bg-background overflow-hidden">
//       <WorkflowBuilder />
//     </div>
//   )
// }

import { WorkflowApp } from  "@/components/global/workflows/workflow-app"

export default function Home() {
  return (
    <main className="h-screen">
      <WorkflowApp />
    </main>
  )
}
