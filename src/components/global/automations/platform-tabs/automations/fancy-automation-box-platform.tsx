"use client"

import type { Platform } from "@/lib/constants/platform"
import { PLATFORM_CONFIG } from "@/lib/constants/platform"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreVertical, Edit2, Trash2, Power } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface FancyAutomationBoxPlatformProps {
  id: string
  name: string
  platform: Platform
  active: boolean
  triggerType?: string
  responseType?: string
  keywordCount: number
  onToggleActive: (id: string, active: boolean) => void
  onDelete: (id: string) => void
}

export function FancyAutomationBoxPlatform({
  id,
  name,
  platform,
  active,
  triggerType,
  responseType,
  keywordCount,
  onToggleActive,
  onDelete,
}: FancyAutomationBoxPlatformProps) {
  const config = PLATFORM_CONFIG[platform]

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{config.icon}</span>
            <div>
              <h3 className="font-semibold text-sm">{name}</h3>
              <p className="text-xs text-muted-foreground">{config.name}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {triggerType && <Badge variant="secondary">{triggerType}</Badge>}
            {responseType && <Badge variant="outline">{responseType}</Badge>}
            {keywordCount > 0 && <Badge variant="default">{keywordCount} keywords</Badge>}
          </div>

          <p className="text-xs text-muted-foreground">{active ? "Active" : "Inactive"}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleActive(id, !active)}
            className={active ? "text-green-600" : "text-gray-400"}
          >
            <Power className="w-4 h-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/automations/${id}`} className="flex items-center gap-2">
                  <Edit2 className="w-4 h-4" />
                  Configure
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(id)} className="text-destructive">
                <Trash2 className="w-4 h-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  )
}
