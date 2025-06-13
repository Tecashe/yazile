// components/global/automation-list-item.tsx
"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, MoreVertical, Clock, Zap, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { getRelativeTime } from "@/lib/utils"

export function AutomationListItem({ 
  automation, 
  pathname 
}: { 
  automation: any
  pathname: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-border last:border-0 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{automation.name}</h3>
              {automation._isOptimistic && (
                <Badge variant="secondary" className="animate-pulse">
                  Creating
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                variant={automation.active ? "default" : "secondary"} 
                className="flex items-center text-xs"
              >
                <Activity className="h-3.5 w-3.5 mr-1" />
                {automation.active ? "Active" : "Paused"}
              </Badge>
              
              <div className="flex items-center text-muted-foreground text-sm">
                <Clock className="h-3.5 w-3.5 mr-1" />
                {getRelativeTime(automation.createdAt)}
              </div>
              
              {automation.listener?.listener === "SMARTAI" ? (
                <Badge className="bg-purple-500/10 text-purple-500 text-xs">
                  <Sparkles className="h-3.5 w-3.5 mr-1" />
                  Smart AI
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  <Zap className="h-3.5 w-3.5 mr-1" />
                  Standard
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {automation.keywords?.slice(0, 2).map((keyword: any) => (
              <Badge 
                key={keyword.id} 
                variant="outline"
                className="text-xs"
              >
                {keyword.word}
              </Badge>
            ))}
            {automation.keywords?.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{automation.keywords.length - 2}
              </Badge>
            )}
          </div>
          
          <Button 
            asChild 
            variant="outline" 
            size="sm"
            disabled={automation._isOptimistic}
          >
            <Link href={`${pathname}/${automation.id}`}>
              Configure
            </Link>
          </Button>
          
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}