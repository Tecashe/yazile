"use client"

import { PLATFORMS, PLATFORM_CONFIG, type Platform } from "@/lib/constants/platform"
import { Button } from "@/components/ui/button"

interface PlatformSelectorProps {
  selectedPlatform?: Platform
  onSelect: (platform: Platform) => void
}

export function PlatformSelector({ selectedPlatform, onSelect }: PlatformSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {Object.entries(PLATFORMS).map(([key, platform]) => {
        const config = PLATFORM_CONFIG[platform as Platform]
        const isSelected = selectedPlatform === platform

        return (
          <Button
            key={platform}
            variant={isSelected ? "default" : "outline"}
            className="h-auto flex-col gap-2 p-4"
            onClick={() => onSelect(platform as Platform)}
          >
            <span className="text-2xl">{config.icon}</span>
            <span className="text-sm font-medium">{config.name}</span>
          </Button>
        )
      })}
    </div>
  )
}
