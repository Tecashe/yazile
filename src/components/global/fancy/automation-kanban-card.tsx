"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, MoreVertical, MessageSquare, Settings, Trash2, Loader2, Clock } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"
import { getRelativeTime } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function AutomationKanbanCard({
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
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      className="mb-3 last:mb-0"
    >
      <Card className="group border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300 bg-background">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-base flex items-center gap-2">
              {automation.name}
              {automation._isOptimistic && <Loader2 className="h-3 w-3 animate-spin text-yellow-500" />}
            </CardTitle>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
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
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <Badge variant={automation.active ? "default" : "secondary"} className="flex items-center text-xs">
              <Activity className="h-3 w-3 mr-1" />
              {automation.active ? "Active" : "Paused"}
            </Badge>

            <div className="flex gap-1">
              {automation.listener?.dmCount && automation.listener.dmCount > 0 && (
                <Badge
                  variant="outline"
                  className="flex items-center text-xs bg-blue-500/10 text-blue-500 border-blue-500/30"
                >
                  <MessageSquare className="h-3 w-3 mr-1" />
                  {automation.listener.dmCount}
                </Badge>
              )}
            </div>
          </div>

          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {automation._isOptimistic ? "Creating..." : getRelativeTime(automation.createdAt)}
          </div>

          {/* Keywords */}
          {automation.keywords && automation.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {automation.keywords.slice(0, 2).map((keyword: any, idx: number) => (
                <Badge
                  key={keyword.id}
                  variant="outline"
                  className={`text-xs px-2 py-0.5 ${
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
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  +{automation.keywords.length - 2}
                </Badge>
              )}
            </div>
          )}

          <Button
            asChild
            variant="outline"
            size="sm"
            className="w-full hover:bg-primary/10 hover:border-primary/30"
            disabled={automation._isOptimistic}
          >
            <Link href={`${pathname}/${automation.id}`}>
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Link>
          </Button>

          {/* Delete confirmation */}
          {showDeleteConfirm && (
            <div className="p-3 border border-destructive/30 rounded-lg bg-destructive/5">
              <p className="text-xs text-destructive mb-2">Delete this automation?</p>
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
        </CardContent>
      </Card>
    </motion.div>
  )
}
