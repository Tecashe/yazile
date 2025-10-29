
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

"use client"

import AutomationList from "@/components/global/automation-list"
import { useQueryAutomations } from "@/hooks/user-queries"
import { Card } from "@/components/ui/card"

const Page = () => {
  const { data, isLoading, isFetching } = useQueryAutomations()
  const automations = data?.data || []
  const activeCount = automations.filter((auto) => auto.active).length

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





//FOR MULTIPLATFORMS
// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { PlatformTabs } from "@/components/global/automations/platform-tabs/automations/platform-tabs"
// import { usePlatformAutomations } from "@/hooks/use-platform-automations"
// import { createNewPlatformAutomation } from "@/actions/automations/platform-actions"
// import type { Platform } from "@/lib/constants/platform"

// const SUPPORTED_PLATFORMS = ["INSTAGRAM", "FACEBOOK", "LINKEDIN", "WHATSAPP"] as const

// export default function AutomationsPage() {
//   const router = useRouter()
//   const { automations, isLoading, toggleAutomationActive, deleteAutomationById } = usePlatformAutomations()
//   const [isCreating, setIsCreating] = useState(false)

//   // Filter to only supported platforms
//   const supportedAutomations = automations.filter(automation => 
//     SUPPORTED_PLATFORMS.includes(automation.platform as any)
//   )

//   const handleCreateNew = async (platform: Platform) => {
//     setIsCreating(true)
//     try {
//       const result = await createNewPlatformAutomation(platform)
//       if (result.status === 200 && result.res?.id) {
//         router.push(`/automations/${result.res.id}`)
//       }
//     } catch (error) {
//       console.error("Failed to create automation:", error)
//     } finally {
//       setIsCreating(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="container mx-auto py-8 px-4">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold mb-2">Automations</h1>
//           <p className="text-muted-foreground">Manage automations across all your social media platforms</p>
//         </div>

//         <PlatformTabs
//           automations={supportedAutomations as any}
//           isLoading={isLoading}
//           onCreateNew={handleCreateNew}
//           onToggleActive={toggleAutomationActive}
//           onDelete={deleteAutomationById}
//         />
//       </div>
//     </div>
//   )
// }