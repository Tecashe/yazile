"use client"

import { PLATFORMS, type Platform } from "@/lib/constants/platform"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AutomationListPlatform } from "./automation-list-platform"
import type { Automation } from "@/types/automation"

interface PlatformTabsProps {
  automations: Automation[]
  isLoading?: boolean
  onCreateNew: (platform: Platform) => void
  onToggleActive: (id: string, active: boolean) => void
  onDelete: (id: string) => void
}

export function PlatformTabs({
  automations,
  isLoading = false,
  onCreateNew,
  onToggleActive,
  onDelete,
}: PlatformTabsProps) {
  const platformList = Object.values(PLATFORMS) as Platform[]

  return (
    <Tabs defaultValue={PLATFORMS.INSTAGRAM} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        {platformList.map((platform) => (
          <TabsTrigger key={platform} value={platform}>
            {platform}
          </TabsTrigger>
        ))}
      </TabsList>

      {platformList.map((platform) => {
        const platformAutomations = automations.filter((a) => a.platform === platform)
        return (
          <TabsContent key={platform} value={platform} className="space-y-4">
            <AutomationListPlatform
              platform={platform}
              automations={platformAutomations}
              isLoading={isLoading}
              onCreateNew={onCreateNew}
              onToggleActive={onToggleActive}
              onDelete={onDelete}
            />
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
