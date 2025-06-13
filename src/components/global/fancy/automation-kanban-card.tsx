// components/global/automation-kanban-card.tsx
"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, MoreVertical, GanttChart, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function AutomationKanbanCard({ 
  automation, 
  pathname 
}: { 
  automation: any
  pathname: string
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mb-3 last:mb-0"
    >
      <Card className="border-border hover:shadow-sm transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between">
            <CardTitle className="text-base">{automation.name}</CardTitle>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex justify-between items-center mb-3">
            <Badge 
              variant={automation.active ? "default" : "secondary"} 
              className="flex items-center"
            >
              <Activity className="h-3.5 w-3.5 mr-1" />
              {automation.active ? "Active" : "Paused"}
            </Badge>
            
            <div className="flex gap-1">
              <Badge variant="outline" className="flex items-center">
                <GanttChart className="h-3.5 w-3.5 mr-1" />
                12
              </Badge>
              <Badge variant="outline" className="flex items-center">
                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                8
              </Badge>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {automation.keywords?.slice(0, 2).map((keyword: any) => (
              <Badge 
                key={keyword.id} 
                variant="outline"
                className="text-xs px-2 py-0.5"
              >
                {keyword.word}
              </Badge>
            ))}
            {automation.keywords?.length > 2 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                +{automation.keywords.length - 2}
              </Badge>
            )}
          </div>
          
          <Button 
            asChild 
            variant="outline" 
            size="sm"
            className="w-full"
            disabled={automation._isOptimistic}
          >
            <Link href={`${pathname}/${automation.id}`}>
              Configure
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}