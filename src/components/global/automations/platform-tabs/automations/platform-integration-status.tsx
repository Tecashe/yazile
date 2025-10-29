"use client"

import type { Platform } from "@/lib/constants/platform"
import { PLATFORM_CONFIG } from "@/lib/constants/platform"
import { usePlatformIntegration } from "@/hooks/use-platform-specific"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { useEffect } from "react"

interface PlatformIntegrationStatusProps {
  platform: Platform
  onConnect?: () => void
}

export function PlatformIntegrationStatus({ platform, onConnect }: PlatformIntegrationStatusProps) {
  const { isConnected, isLoading, checkIntegration } = usePlatformIntegration(platform)
  const config = PLATFORM_CONFIG[platform]

  useEffect(() => {
    checkIntegration()
  }, [platform, checkIntegration])

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{config.icon}</span>
          <div>
            <h3 className="font-semibold">{config.name}</h3>
            <p className="text-sm text-muted-foreground">{config.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          ) : isConnected ? (
            <Badge variant="default" className="gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Connected
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1">
              <AlertCircle className="w-4 h-4" />
              Not Connected
            </Badge>
          )}

          {!isConnected && onConnect && (
            <Button size="sm" onClick={onConnect}>
              Connect
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
