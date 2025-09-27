"use client"

import type React from "react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MessageSquare, MousePointer, GitBranch, Clock, Zap, Webhook, Play, Palette, ImageIcon } from "lucide-react"

const blockTypes = [
  {
    category: "Triggers",
    blocks: [
      {
        type: "trigger",
        title: "DM Received",
        description: "When someone sends a direct message",
        icon: Play,
        color: "bg-green-500",
      },
    ],
  },
  {
    category: "Responses",
    blocks: [
      {
        type: "text",
        title: "Text Message",
        description: "Send a text response",
        icon: MessageSquare,
        color: "bg-blue-500",
      },
      {
        type: "image",
        title: "Image",
        description: "Send an image with optional caption",
        icon: ImageIcon,
        color: "bg-purple-500",
      },
      {
        type: "button",
        title: "Buttons",
        description: "Show interactive buttons",
        icon: MousePointer,
        color: "bg-orange-500",
      },
    ],
  },
  {
    category: "Logic",
    blocks: [
      {
        type: "condition",
        title: "Condition",
        description: "Branch based on message content",
        icon: GitBranch,
        color: "bg-yellow-500",
      },
      {
        type: "delay",
        title: "Delay",
        description: "Wait before continuing",
        icon: Clock,
        color: "bg-red-500",
      },
    ],
  },
  {
    category: "Integrations",
    blocks: [
      {
        type: "api",
        title: "API Call",
        description: "Make HTTP request to external service",
        icon: Zap,
        color: "bg-cyan-500",
      },
      {
        type: "webhook",
        title: "Webhook",
        description: "Send data to external webhook",
        icon: Webhook,
        color: "bg-indigo-500",
      },
    ],
  },
]

export function BlockPalette() {
  const handleDragStart = (e: React.DragEvent, blockType: string) => {
    e.dataTransfer.setData("application/json", JSON.stringify({ type: blockType }))
    e.dataTransfer.effectAllowed = "copy"
  }

  return (
    <div className="h-full bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <Palette className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Block Palette</h3>
        </div>
        <p className="text-sm text-muted-foreground">Drag blocks to the canvas to build your workflow</p>
      </div>

      {/* Block Categories */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {blockTypes.map((category) => (
            <div key={category.category}>
              <div className="flex items-center gap-2 mb-3">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  {category.category}
                </h4>
                <Badge variant="secondary" className="text-xs">
                  {category.blocks.length}
                </Badge>
              </div>

              <div className="space-y-2">
                {category.blocks.map((block) => {
                  const IconComponent = block.icon
                  return (
                    <div
                      key={block.type}
                      draggable
                      onDragStart={(e) => handleDragStart(e, block.type)}
                      className="group relative p-3 rounded-lg border border-border bg-background hover:bg-accent hover:border-accent-foreground/20 cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-md ${block.color} flex items-center justify-center flex-shrink-0`}
                        >
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-sm text-foreground group-hover:text-accent-foreground">
                            {block.title}
                          </h5>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{block.description}</p>
                        </div>
                      </div>

                      {/* Drag indicator */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {category !== blockTypes[blockTypes.length - 1] && <Separator className="mt-4" />}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          Drag any block to the canvas to add it to your workflow
        </div>
      </div>
    </div>
  )
}
