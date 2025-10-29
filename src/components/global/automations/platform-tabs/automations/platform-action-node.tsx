"use client"

import type { Platform } from "@/lib/constants/platform"
import { canPlatformHandlePosts, canPlatformHandlePages } from "@/lib/utils/platform-helpers"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

interface PlatformActionNodeProps {
  platform: Platform
  selectedActions?: string[]
  onActionToggle: (action: string) => void
  isEditing?: boolean
}

export function PlatformActionNode({
  platform,
  selectedActions = [],
  onActionToggle,
  isEditing = false,
}: PlatformActionNodeProps) {
  const availableActions: { id: string; label: string; description: string }[] = []

  if (canPlatformHandlePosts(platform)) {
    availableActions.push({
      id: "monitor_posts",
      label: "Monitor Posts",
      description: "Monitor comments on selected posts",
    })
  }

  if (canPlatformHandlePages(platform)) {
    availableActions.push({
      id: "monitor_pages",
      label: "Monitor Pages",
      description: "Monitor messages on page",
    })
  }

  availableActions.push({
    id: "log_conversation",
    label: "Log Conversation",
    description: "Store conversation history",
  })

  return (
    <Card className="p-4 border-2 border-dashed">
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Actions</h3>

        {isEditing ? (
          <div className="space-y-2">
            {availableActions.map((action) => (
              <div key={action.id} className="flex items-start gap-2">
                <Checkbox
                  id={action.id}
                  checked={selectedActions.includes(action.id)}
                  onCheckedChange={() => onActionToggle(action.id)}
                />
                <label htmlFor={action.id} className="flex-1 cursor-pointer">
                  <p className="text-sm font-medium">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </label>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedActions.map((action) => (
              <Badge key={action} variant="outline">
                {action}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
