// import { EnhancedWorkflowBuilder } from "@/components/global/workflows/enhanced-builder"

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-background">
//       <EnhancedWorkflowBuilder />
//     </div>
//   )
// }

import { EnhancedWorkflowBuilder } from "@/components/global/workflows/enhanced-builder"


export default function WorkflowBuilderPage() {
  return (
    <div className="h-[calc(100vh-8rem)] w-full -m-6 overflow-hidden">
      {/* Negative margin to counteract the layout's p-6 padding, overflow-hidden prevents horizontal scroll */}
      <EnhancedWorkflowBuilder />
    </div>
  )
}