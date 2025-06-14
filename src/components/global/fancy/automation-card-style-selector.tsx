"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { motion } from "framer-motion"
import { LayoutGrid, Minimize2, Layers, BarChart3, Sparkles } from "lucide-react"

export type CardStyleType = "default" | "minimal" | "compact" | "modern" | "dashboard"

export function AutomationCardStyleSelector({
  currentStyle,
  onStyleChange,
}: {
  currentStyle: CardStyleType
  onStyleChange: (style: CardStyleType) => void
}) {
  const styles = [
    { id: "default", icon: LayoutGrid, label: "Default Cards", description: "Standard card layout" },
    { id: "minimal", icon: Minimize2, label: "Minimal Cards", description: "Clean, minimal design" },
    { id: "compact", icon: Layers, label: "Compact Cards", description: "Space-efficient layout" },
    { id: "modern", icon: Sparkles, label: "Modern Cards", description: "Contemporary design" },
    { id: "dashboard", icon: BarChart3, label: "Dashboard Cards", description: "Metrics-focused layout" },
  ]

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg border border-border backdrop-blur-sm">
        {styles.map((style) => (
          <Tooltip key={style.id}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`relative rounded-lg transition-all duration-200 text-xs ${
                  currentStyle === style.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background"
                }`}
                onClick={() => onStyleChange(style.id as CardStyleType)}
              >
                <style.icon className="h-3.5 w-3.5 mr-1.5" />
                {style.label.split(" ")[0]}
                {currentStyle === style.id && (
                  <motion.div
                    layoutId="activeCardStyle"
                    className="absolute inset-0 bg-primary rounded-lg -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              <div className="text-center">
                <div className="font-medium">{style.label}</div>
                <div className="text-muted-foreground">{style.description}</div>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}
