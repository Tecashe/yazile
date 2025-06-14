"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, Sparkles, Activity, Clock, MoreVertical, Loader2, Settings, Trash2, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { getRelativeTime } from "@/lib/utils"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function AutomationGridCard({
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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="group h-full flex flex-col bg-background border border-border hover:border-primary/40 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
        {/* Status indicator line */}
        <div
          className={`h-1 w-full ${
            automation._isOptimistic
              ? "bg-gradient-to-r from-yellow-500 to-orange-500 animate-pulse"
              : automation.active
                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                : "bg-gradient-to-r from-muted-foreground/50 to-muted-foreground/50"
          }`}
        />

        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="flex items-center gap-2 text-lg">
              {automation.name}
              {automation._isOptimistic && (
                <Badge variant="secondary" className="animate-pulse">
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Creating
                </Badge>
              )}
            </CardTitle>

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

          {/* Keywords */}
          {automation.keywords && automation.keywords.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {automation.keywords.slice(0, 3).map((keyword: any, idx: number) => (
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
              {automation.keywords.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{automation.keywords.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardHeader>

        <CardContent className="flex-grow flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {automation._isOptimistic ? "Creating..." : `Created ${getRelativeTime(automation.createdAt)}`}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {automation.listener?.listener === "SMARTAI" ? (
                <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/30">
                  <Sparkles className="h-3.5 w-3.5 mr-1" />
                  Smart AI
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <Zap className="h-3.5 w-3.5 mr-1" />
                  Standard
                </Badge>
              )}

              <Badge variant={automation.active ? "default" : "secondary"} className="flex items-center">
                <Activity className="h-3.5 w-3.5 mr-1" />
                {automation.active ? "Active" : "Paused"}
              </Badge>

              {/* Show message count if available */}
              {automation.listener?.dmCount && automation.listener.dmCount > 0 && (
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">
                  <MessageSquare className="h-3.5 w-3.5 mr-1" />
                  {automation.listener.dmCount}
                </Badge>
              )}
            </div>
          </div>

          <Button
            asChild
            variant="outline"
            className="mt-4 w-full hover:bg-primary/10 hover:border-primary/30"
            disabled={automation._isOptimistic}
          >
            <Link href={`${pathname}/${automation.id}`}>
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Link>
          </Button>
        </CardContent>

        {/* Delete confirmation */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border border-destructive/30 rounded-lg p-4 shadow-lg">
              <p className="text-sm text-destructive mb-3">Delete this automation?</p>
              <div className="flex gap-2">
                <Button variant="destructive" size="sm" onClick={onDelete}>
                  Delete
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Decorative gradient */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Card>
    </motion.div>
  )
}
