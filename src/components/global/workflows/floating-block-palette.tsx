"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare, MousePointer, GitBranch, Clock, Zap, Webhook, Play, ImageIcon, Plus, X } from "lucide-react"
import { useWorkflowStore, type WorkflowNode } from "@/lib/workflow-store"

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

interface FloatingBlockPaletteProps {
  position: { x: number; y: number }
  onClose: () => void
  onAddBlock: (type: string, position: { x: number; y: number }) => void
}

export function FloatingBlockPalette({ position, onClose, onAddBlock }: FloatingBlockPaletteProps) {
  const paletteRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (paletteRef.current && !paletteRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [onClose])

  const handleBlockClick = (blockType: string) => {
    onAddBlock(blockType, { x: position.x - 120, y: position.y - 50 })
    onClose()
  }

  return (
    <div
      ref={paletteRef}
      className="fixed z-50 w-80 max-h-96 bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200"
      style={{
        left: Math.min(position.x, window.innerWidth - 320),
        top: Math.min(position.y, window.innerHeight - 400),
      }}
    >
      {/* Header */}
      <div className="p-4 border-b border-border bg-card/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">Add Block</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Block Grid */}
      <div className="p-4 max-h-80 overflow-y-auto">
        <div className="grid grid-cols-2 gap-2">
          {blockTypes.flatMap((category) =>
            category.blocks.map((block) => {
              const IconComponent = block.icon
              return (
                <button
                  key={block.type}
                  onClick={() => handleBlockClick(block.type)}
                  className="group p-3 rounded-lg border border-border bg-background hover:bg-accent hover:border-accent-foreground/20 transition-all duration-200 hover:shadow-sm text-left"
                >
                  <div className="flex items-start gap-2">
                    <div className={`w-6 h-6 rounded-md ${block.color} flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="h-3 w-3 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-xs text-foreground group-hover:text-accent-foreground">
                        {block.title}
                      </h5>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-tight line-clamp-2">
                        {block.description}
                      </p>
                    </div>
                  </div>
                </button>
              )
            }),
          )}
        </div>
      </div>
    </div>
  )
}

interface AddBlockButtonProps {
  onAddBlock: (position: { x: number; y: number }) => void
}

export function AddBlockButton({ onAddBlock }: AddBlockButtonProps) {
  const [showPalette, setShowPalette] = useState(false)
  const [palettePosition, setPalettePosition] = useState({ x: 0, y: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { addNode } = useWorkflowStore()

  const handleClick = (e: React.MouseEvent) => {
    const rect = buttonRef.current?.getBoundingClientRect()
    if (rect) {
      setPalettePosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height + 8,
      })
      setShowPalette(true)
    }
  }

  const handleAddBlock = (type: string, position: { x: number; y: number }) => {
    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type: type as any,
      position,
      data: getDefaultNodeData(type),
      connections: [],
    }
    addNode(newNode)
    onAddBlock(position)
  }

  return (
    <>
      <Button
        ref={buttonRef}
        variant="default"
        size="sm"
        onClick={handleClick}
        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Block
      </Button>

      {showPalette && (
        <FloatingBlockPalette
          position={palettePosition}
          onClose={() => setShowPalette(false)}
          onAddBlock={handleAddBlock}
        />
      )}
    </>
  )
}

function getDefaultNodeData(type: string) {
  switch (type) {
    case "trigger":
      return {
        title: "New Trigger",
        description: "Configure trigger conditions",
        triggerType: "dm",
        platforms: ["instagram"],
      }
    case "text":
      return {
        message: "Hello! Thanks for your message.",
        buttons: [],
      }
    case "button":
      return {
        buttons: [{ text: "Option 1", action: "continue", id: crypto.randomUUID() }],
      }
    case "image":
      return {
        imageUrl: "",
        caption: "",
        buttons: [],
      }
    case "condition":
      return {
        condition: "contains",
        value: "",
        trueAction: "continue",
        falseAction: "continue",
      }
    case "delay":
      return {
        duration: 5,
        unit: "seconds",
      }
    case "api":
      return {
        endpoint: "",
        method: "POST",
        headers: {},
        body: "",
      }
    case "webhook":
      return {
        url: "",
        method: "POST",
        headers: {},
        payload: "",
      }
    default:
      return {}
  }
}
