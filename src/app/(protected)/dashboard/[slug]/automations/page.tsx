
// "use client"

// import AutomationList from "@/components/global/automation-list"
// import CreateAutomation from "@/components/global/create-automation"
// import { useQueryAutomations } from "@/hooks/user-queries"
// import { Activity, Plus } from "lucide-react"
// import { Card } from "@/components/ui/card"


// const Page = () => {
//   const { data, isLoading, isFetching } = useQueryAutomations()
//   const automations = data?.data || []
//   const activeCount = automations.filter((auto) => auto.active).length

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="max-w-6xl mx-auto p-6">
//         {/* Main Content - Full Width */}
        

//           {/* Automation List - Clean Focus */}
//           <Card className="border-0 shadow-sm">
//             <AutomationList id={automations.length > 0 ? automations[0]?.id || "" : ""} />
//           </Card>
    
//       </div>
//     </div>
//   )
// }

// export default Page

// "use client"

// import AutomationList from "@/components/global/automation-list"
// import { useQueryAutomations } from "@/hooks/user-queries"
// import { Card } from "@/components/ui/card"

// const Page = () => {
//   const { data, isLoading, isFetching } = useQueryAutomations()
//   const automations = data?.data || []
//   const activeCount = automations.filter((auto) => auto.active).length

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="max-w-6xl mx-auto p-6">
//         {/* Main Content - Full Width */}

//         {/* Automation List - Clean Focus */}
//         <Card className="border-0 shadow-sm">
//           <AutomationList id={automations.length > 0 ? automations[0]?.id || "" : ""} />
//         </Card>
//       </div>
//     </div>
//   )
// }

// export default Page
"use client"

import AutomationList from "@/components/global/automation-list"
import { useQueryAutomations } from "@/hooks/user-queries"
import { Card } from "@/components/ui/card"
import { AutomationListSkeleton } from "./automation-skeleton"

const Page = () => {
  const { data, isLoading, isFetching } = useQueryAutomations()
  const automations = data?.data || []
  const activeCount = automations.filter((auto) => auto.active).length

  if (isLoading) {
    return <AutomationListSkeleton />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        {/* Main Content - Full Width */}

        {/* Automation List - Clean Focus */}
        <Card className="border-0 shadow-sm">
          <AutomationList id={automations.length > 0 ? automations[0]?.id || "" : ""} />
        </Card>
      </div>
    </div>
  )
}

export default Page
