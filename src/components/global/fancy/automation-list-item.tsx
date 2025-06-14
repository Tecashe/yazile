"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, MoreVertical, Clock, Zap, Sparkles, Settings, Trash2, Loader2, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { getRelativeTime } from "@/lib/utils"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function AutomationListItem({
  automation,
  pathname,
  onDelete,
}: {
  automation: any
  pathname: string
  onDelete?: () => void
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ x: 4 }}
      className="group border-b border-border last:border-0 py-4 hover:bg-muted/30 transition-all duration-200 rounded-lg px-4 -mx-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Status indicator */}
          <div
            className={`w-3 h-3 rounded-full flex-shrink-0 ${
              automation._isOptimistic
                ? "bg-yellow-500 animate-pulse"
                : automation.active
                  ? "bg-green-500"
                  : "bg-muted-foreground"
            }`}
          />

          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-foreground truncate">{automation.name}</h3>
              {automation._isOptimistic && (
                <Badge variant="secondary" className="animate-pulse text-xs">
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Creating
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3 text-sm">
              <Badge variant={automation.active ? "default" : "secondary"} className="flex items-center text-xs">
                <Activity className="h-3 w-3 mr-1" />
                {automation.active ? "Active" : "Paused"}
              </Badge>

              <div className="flex items-center text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {automation._isOptimistic ? "Creating..." : getRelativeTime(automation.createdAt)}
              </div>

              {automation.listener?.listener === "SMARTAI" ? (
                <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/30 text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Smart AI
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  Standard
                </Badge>
              )}

              {automation.listener?.dmCount && automation.listener.dmCount > 0 && (
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30 text-xs">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  {automation.listener.dmCount}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Keywords */}
          {automation.keywords && automation.keywords.length > 0 && (
            <div className="flex gap-1">
              {automation.keywords.slice(0, 2).map((keyword: any, idx: number) => (
                <Badge
                  key={keyword.id}
                  variant="outline"
                  className={`text-xs ${
                    idx % 4 === 0
                      ? "border-green-500/30 text-green-500"
                      : idx % 4 === 1
                        ? "border-purple-500/30 text-purple-500"
                        : idx % 4 === 2
                          ? "border-yellow-500/30 text-yellow-500"
                          : "border-red-500/30 text-red-500"
                  }`}
                >
                  {keyword.word}
                </Badge>
              ))}
              {automation.keywords.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{automation.keywords.length - 2}
                </Badge>
              )}
            </div>
          )}

          <Button
            asChild
            variant="outline"
            size="sm"
            disabled={automation._isOptimistic}
            className="hover:bg-primary/10 hover:border-primary/30"
          >
            <Link href={`${pathname}/${automation.id}`}>
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild disabled={automation._isOptimistic}>
                <Link href={`${pathname}/${automation.id}`} className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Link>
              </DropdownMenuItem>
              {onDelete && (
                <DropdownMenuItem
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-destructive focus:text-destructive"
                  disabled={automation._isOptimistic}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="mt-4 p-3 border border-destructive/30 rounded-lg bg-destructive/5">
          <p className="text-sm text-destructive mb-2">Delete this automation?</p>
          <div className="flex gap-2">
            <Button variant="destructive" size="sm" onClick={onDelete}>
              Delete
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  )
}
