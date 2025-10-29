"use client"

import type { Platform } from "@/lib/constants/platform"
import { getTriggerTypesForPlatform } from "@/lib/utils/platform-helpers"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface PlatformTriggerNodeProps {
  platform: Platform
  triggerType?: string
  onTriggerSelect: (type: string) => void
  isEditing?: boolean
}

export function PlatformTriggerNode({
  platform,
  triggerType,
  onTriggerSelect,
  isEditing = false,
}: PlatformTriggerNodeProps) {
  const triggerTypes = getTriggerTypesForPlatform(platform)

  return (
    <Card className="p-4 border-2 border-dashed">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">When</h3>
          {triggerType && <Badge variant="secondary">{triggerType}</Badge>}
        </div>

        {isEditing && (
          <div className="flex flex-wrap gap-2">
            {triggerTypes.map((type) => (
              <Button
                key={type}
                variant={triggerType === type ? "default" : "outline"}
                size="sm"
                onClick={() => onTriggerSelect(type)}
              >
                {type}
              </Button>
            ))}
          </div>
        )}

        {!isEditing && triggerType && (
          <p className="text-sm text-muted-foreground">
            Trigger on: <span className="font-medium">{triggerType}</span>
          </p>
        )}
      </div>
    </Card>
  )
}
