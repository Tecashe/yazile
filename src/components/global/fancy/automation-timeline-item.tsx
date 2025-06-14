"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, Clock, Zap, Sparkles, Settings, Trash2, Loader2, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { format } from "date-fns"
import { useState } from "react"

export function AutomationTimelineItem({
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
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="group relative pl-8 pb-8 border-l-2 border-border last:border-0 last:pb-0 hover:border-primary/30 transition-colors"
    >
      {/* Timeline dot */}
      <div
        className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full border-4 border-background ${
          automation._isOptimistic
            ? "bg-yellow-500 animate-pulse"
            : automation.active
              ? "bg-green-500"
              : "bg-muted-foreground"
        }`}
      />

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-4 rounded-lg hover:bg-muted/30 transition-colors">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-foreground">{automation.name}</h3>
            {automation._isOptimistic && (
              <Badge variant="secondary" className="animate-pulse text-xs">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Creating
              </Badge>
            )}
          </div>

          <div className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {automation._isOptimistic
              ? "Creating automation..."
              : `Created on ${format(new Date(automation.createdAt), "MMM d, yyyy 'at' h:mm a")}`}
          </div>

          {/* Keywords */}
          {automation.keywords && automation.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {automation.keywords.slice(0, 4).map((keyword: any, idx: number) => (
                <Badge
                  key={keyword.id}
                  variant="outline"
                  className={`text-xs ${
                    idx % 4 === 0
                      ? "border-green-500/30 text-green-500 bg-green-500/5"
                      : idx % 4 === 1
                        ? "border-purple-500/30 text-purple-500 bg-purple-500/5"
                        : idx % 4 === 2
                          ? "border-yellow-500/30 text-yellow-500 bg-yellow-500/5"
                          : "border-red-500/30 text-red-500 bg-red-500/5"
                  }`}
                >
                  {keyword.word}
                </Badge>
              ))}
              {automation.keywords.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{automation.keywords.length - 4}
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={automation.active ? "default" : "secondary"} className="flex items-center text-xs">
              <Activity className="h-3 w-3 mr-1" />
              {automation.active ? "Active" : "Paused"}
            </Badge>

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
                {automation.listener.dmCount} messages
              </Badge>
            )}
          </div>
        </div>

        <div className="flex gap-2">
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

          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={automation._isOptimistic}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="mt-4 p-3 border border-destructive/30 rounded-lg bg-destructive/5 ml-4">
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
