// components/global/automation-view-selector.tsx
"use client"

import { LayoutGrid, List, Kanban, GanttChartSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export type ViewType = "list" | "grid" | "kanban" | "timeline"

export function AutomationViewSelector({
  currentView,
  onViewChange
}: {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
}) {
  const views = [
    { id: "list", icon: List, label: "List View" },
    { id: "grid", icon: LayoutGrid, label: "Grid View" },
    { id: "kanban", icon: Kanban, label: "Kanban View" },
    { id: "timeline", icon: GanttChartSquare, label: "Timeline View" }
  ]

  return (
    <div className="flex items-center gap-1 p-1 bg-background rounded-lg border border-border">
      {views.map((view) => (
        <Tooltip key={view.id}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-lg ${
                currentView === view.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground"
              }`}
              onClick={() => onViewChange(view.id as ViewType)}
            >
              <view.icon className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">{view.label}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}