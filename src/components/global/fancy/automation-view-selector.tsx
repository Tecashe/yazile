"use client"

import { LayoutGrid, List, Kanban, GanttChartSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { motion } from "framer-motion"

export type ViewType = "list" | "grid" | "kanban" | "timeline"

export function AutomationViewSelector({
  currentView,
  onViewChange,
}: {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
}) {
  const views = [
    { id: "list", icon: List, label: "List View" },
    { id: "grid", icon: LayoutGrid, label: "Grid View" },
    { id: "kanban", icon: Kanban, label: "Kanban View" },
    { id: "timeline", icon: GanttChartSquare, label: "Timeline View" },
  ]

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg border border-border backdrop-blur-sm">
        {views.map((view) => (
          <Tooltip key={view.id}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`relative rounded-lg transition-all duration-200 ${
                  currentView === view.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background"
                }`}
                onClick={() => onViewChange(view.id as ViewType)}
              >
                <view.icon className="h-4 w-4" />
                {currentView === view.id && (
                  <motion.div
                    layoutId="activeView"
                    className="absolute inset-0 bg-primary rounded-lg -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              {view.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}
