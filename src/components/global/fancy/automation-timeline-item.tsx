// components/global/automation-timeline-item.tsx
"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, Clock, Zap, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { format } from "date-fns"

export function AutomationTimelineItem({ 
  automation, 
  pathname 
}: { 
  automation: any
  pathname: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative pl-8 pb-8 border-l-2 border-border last:border-0 last:pb-0"
    >
      {/* Timeline dot */}
      <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-background"></div>
      
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium">{automation.name}</h3>
            {automation._isOptimistic && (
              <Badge variant="secondary" className="animate-pulse">
                Creating
              </Badge>
            )}
          </div>
          
          <div className="text-sm text-muted-foreground mb-2">
            Created on {format(new Date(automation.createdAt), "MMM d, yyyy")}
          </div>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {automation.keywords?.slice(0, 3).map((keyword: any) => (
              <Badge 
                key={keyword.id} 
                variant="outline"
                className="text-xs"
              >
                {keyword.word}
              </Badge>
            ))}
            {automation.keywords?.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{automation.keywords.length - 3}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Badge 
              variant={automation.active ? "default" : "secondary"} 
              className="flex items-center text-xs"
            >
              <Activity className="h-3.5 w-3.5 mr-1" />
              {automation.active ? "Active" : "Paused"}
            </Badge>
            
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
        
        <div className="flex gap-2">
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
        </div>
      </div>
    </motion.div>
  )
}