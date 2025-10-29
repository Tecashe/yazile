// "use client"

// import type { Platform } from "@/lib/constants/platform"
// import { PLATFORM_CONFIG } from "@/lib/constants/platform"
// import { FancyAutomationBoxPlatform } from "./fancy-automation-box-platform"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Plus } from "lucide-react"

// interface Automation {
//   id: string
//   name: string
//   active: boolean
//   platform: Platform
//   trigger?: { type: string }
//   listener?: { listener: string }
//   keywords?: { word: string }[]
// }

// interface AutomationListPlatformProps {
//   platform: Platform
//   automations: Automation[]
//   isLoading?: boolean
//   onCreateNew: (platform: Platform) => void
//   onToggleActive: (id: string, active: boolean) => void
//   onDelete: (id: string) => void
// }

// export function AutomationListPlatform({
//   platform,
//   automations,
//   isLoading = false,
//   onCreateNew,
//   onToggleActive,
//   onDelete,
// }: AutomationListPlatformProps) {
//   const config = PLATFORM_CONFIG[platform]
//   const platformAutomations = automations.filter((a) => a.platform === platform)

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <span className="text-2xl">{config.icon}</span>
//           <div>
//             <h2 className="font-semibold">{config.name}</h2>
//             <p className="text-sm text-muted-foreground">{config.description}</p>
//           </div>
//         </div>
//         <Button onClick={() => onCreateNew(platform)} size="sm" className="gap-2">
//           <Plus className="w-4 h-4" />
//           New
//         </Button>
//       </div>

//       {isLoading ? (
//         <Card className="p-8 text-center text-muted-foreground">Loading automations...</Card>
//       ) : platformAutomations.length === 0 ? (
//         <Card className="p-8 text-center text-muted-foreground">
//           <p>No automations yet. Create one to get started.</p>
//         </Card>
//       ) : (
//         <div className="grid gap-3">
//           {platformAutomations.map((automation) => (
//             <FancyAutomationBoxPlatform
//               key={automation.id}
//               id={automation.id}
//               name={automation.name}
//               platform={platform}
//               active={automation.active}
//               triggerType={automation.trigger?.type}
//               responseType={automation.listener?.listener}
//               keywordCount={automation.keywords?.length || 0}
//               onToggleActive={onToggleActive}
//               onDelete={onDelete}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }
"use client"

import type { Platform } from "@/lib/constants/platform"
import { PLATFORM_CONFIG } from "@/lib/constants/platform"
import { FancyAutomationBoxPlatform } from "./fancy-automation-box-platform"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { Automation } from "@/types/automation"

interface AutomationListPlatformProps {
  platform: Platform
  automations: Automation[]
  isLoading?: boolean
  onCreateNew: (platform: Platform) => void
  onToggleActive: (id: string, active: boolean) => void
  onDelete: (id: string) => void
}

export function AutomationListPlatform({
  platform,
  automations,
  isLoading = false,
  onCreateNew,
  onToggleActive,
  onDelete,
}: AutomationListPlatformProps) {
  const config = PLATFORM_CONFIG[platform]
  const platformAutomations = automations.filter((a) => a.platform === platform)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{config.icon}</span>
          <div>
            <h2 className="font-semibold">{config.name}</h2>
            <p className="text-sm text-muted-foreground">{config.description}</p>
          </div>
        </div>
        <Button onClick={() => onCreateNew(platform)} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          New
        </Button>
      </div>

      {isLoading ? (
        <Card className="p-8 text-center text-muted-foreground">Loading automations...</Card>
      ) : platformAutomations.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          <p>No automations yet. Create one to get started.</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {platformAutomations.map((automation) => (
            <FancyAutomationBoxPlatform
              key={automation.id}
              id={automation.id}
              name={automation.name}
              platform={platform}
              active={automation.active}
              triggerType={automation.trigger?.[0]?.type}
              responseType={automation.listener?.listener}
              keywordCount={automation.keywords?.length || 0}
              onToggleActive={onToggleActive}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
