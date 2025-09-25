"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { MessageSquare, MousePointer, ImageIcon, GitBranch, Clock, Zap, Hash, Link } from "lucide-react"
import type { WorkflowNode } from "@/types/workflow"

interface BlockPaletteProps {
  onAddBlock: (type: WorkflowNode["type"], position: { x: number; y: number }) => void
}

const blockTypes = [
  {
    type: "text" as const,
    icon: MessageSquare,
    title: "Text Message",
    description: "Send a text response with optional buttons",
  },
  {
    type: "button" as const,
    icon: MousePointer,
    title: "Button Menu",
    description: "Present multiple choice buttons",
  },
  {
    type: "image" as const,
    icon: ImageIcon,
    title: "Image Response",
    description: "Send an image with optional caption and buttons",
  },
  {
    type: "condition" as const,
    icon: GitBranch,
    title: "Condition",
    description: "Branch workflow based on message content",
  },
  {
    type: "delay" as const,
    icon: Clock,
    title: "Delay",
    description: "Wait before sending next response",
  },
]

export function BlockPalette({ onAddBlock }: BlockPaletteProps) {
  const handleDragStart = (e: React.DragEvent, type: WorkflowNode["type"]) => {
    e.dataTransfer.setData("application/json", JSON.stringify({ type }))
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-2">Triggers</h2>
        <Card className="p-3 border-primary/20 bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="font-medium text-sm">DM Received</div>
              <div className="text-xs text-muted-foreground">Auto-added to workflow</div>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Response Blocks</h2>
        <div className="space-y-2">
          {blockTypes.map((block) => (
            <Card
              key={block.type}
              className="p-3 cursor-grab hover:bg-accent/50 transition-colors"
              draggable
              onDragStart={(e) => handleDragStart(e, block.type)}
              onClick={() => onAddBlock(block.type, { x: 300, y: 200 })}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <block.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{block.title}</div>
                  <div className="text-xs text-muted-foreground">{block.description}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Advanced</h2>
        <div className="space-y-2">
          <Card className="p-3 opacity-50 cursor-not-allowed">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Hash className="w-4 h-4" />
              </div>
              <div>
                <div className="font-medium text-sm">Webhook</div>
                <div className="text-xs text-muted-foreground">Coming soon</div>
              </div>
            </div>
          </Card>
          <Card className="p-3 opacity-50 cursor-not-allowed">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Link className="w-4 h-4" />
              </div>
              <div>
                <div className="font-medium text-sm">API Call</div>
                <div className="text-xs text-muted-foreground">Coming soon</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
