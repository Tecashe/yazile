"use client"

import type { Platform } from "@/lib/constants/platform"
import { getResponseTypesForPlatform } from "@/lib/utils/platform-helpers"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

interface PlatformResponseNodeProps {
  platform: Platform
  responseType?: string
  responseContent?: string
  onResponseTypeSelect: (type: string) => void
  onResponseContentChange: (content: string) => void
  isEditing?: boolean
}

export function PlatformResponseNode({
  platform,
  responseType,
  responseContent,
  onResponseTypeSelect,
  onResponseContentChange,
  isEditing = false,
}: PlatformResponseNodeProps) {
  const responseTypes = getResponseTypesForPlatform(platform)

  return (
    <Card className="p-4 border-2 border-dashed">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Then</h3>
          {responseType && <Badge variant="secondary">{responseType}</Badge>}
        </div>

        {isEditing && (
          <>
            <div className="flex flex-wrap gap-2">
              {responseTypes.map((type) => (
                <Button
                  key={type}
                  variant={responseType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => onResponseTypeSelect(type)}
                >
                  {type}
                </Button>
              ))}
            </div>

            {responseType && (
              <Textarea
                placeholder="Enter your response message..."
                value={responseContent || ""}
                onChange={(e) => onResponseContentChange(e.target.value)}
                className="min-h-24"
              />
            )}
          </>
        )}

        {!isEditing && responseType && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Response type: <span className="font-medium">{responseType}</span>
            </p>
            {responseContent && <p className="text-sm bg-muted p-2 rounded">{responseContent}</p>}
          </div>
        )}
      </div>
    </Card>
  )
}
