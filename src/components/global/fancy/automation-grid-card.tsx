// components/global/automation-grid-card.tsx
"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Zap, 
  Sparkles, 
  Activity, 
  Clock, 
  MoreVertical,
  Loader2
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getRelativeTime } from "@/lib/utils"

export function AutomationGridCard({ 
  automation, 
  pathname 
}: { 
  automation: any
  pathname: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col border-border hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="flex items-center gap-2">
              {automation.name}
              {automation._isOptimistic && (
                <Badge variant="secondary" className="animate-pulse">
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Creating
                </Badge>
              )}
            </CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {automation.keywords?.slice(0, 3).map((keyword: any, idx: number) => (
              <Badge 
                key={keyword.id} 
                variant="outline"
                className={`
                  ${idx % 3 === 0 ? 'border-green-500/30 text-green-500' : ''}
                  ${idx % 3 === 1 ? 'border-purple-500/30 text-purple-500' : ''}
                  ${idx % 3 === 2 ? 'border-yellow-500/30 text-yellow-500' : ''}
                `}
              >
                {keyword.word}
              </Badge>
            ))}
            {automation.keywords?.length > 3 && (
              <Badge variant="outline">
                +{automation.keywords.length - 3}
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="flex-grow flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Created {getRelativeTime(automation.createdAt)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {automation.listener?.listener === "SMARTAI" ? (
                <Badge className="bg-purple-500/10 text-purple-500">
                  <Sparkles className="h-3.5 w-3.5 mr-1" />
                  Smart AI
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <Zap className="h-3.5 w-3.5 mr-1" />
                  Standard
                </Badge>
              )}
              
              <Badge 
                variant={automation.active ? "default" : "secondary"} 
                className="flex items-center"
              >
                <Activity className="h-3.5 w-3.5 mr-1" />
                {automation.active ? "Active" : "Paused"}
              </Badge>
            </div>
          </div>
          
          <Button 
            asChild 
            variant="outline" 
            className="mt-4 w-full"
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