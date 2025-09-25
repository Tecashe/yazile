"use client"

import React from "react"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MessageSquare,
  MousePointer,
  ImageIcon,
  GitBranch,
  Clock,
  Zap,
  Trash2,
  Plus,
  Play,
  Globe,
  Send,
} from "lucide-react"
import type { WorkflowNode } from "@/types/workflow"

interface WorkflowNodeComponentProps {
  node: WorkflowNode
  isSelected: boolean
  onSelect: () => void
  onDrag: (id: string, position: { x: number; y: number }) => void
  onDelete: () => void
  onConnect: (fromId: string, toId: string) => void
  connecting: string | null
  setConnecting: (id: string | null) => void
}

const nodeIcons = {
  trigger: Zap,
  text: MessageSquare,
  button: MousePointer,
  image: ImageIcon,
  condition: GitBranch,
  delay: Clock,
  api: Globe,
  webhook: Send,
}

const nodeColors = {
  trigger: "bg-primary/10 border-primary/30",
  text: "bg-blue-500/10 border-blue-500/30",
  button: "bg-green-500/10 border-green-500/30",
  image: "bg-purple-500/10 border-purple-500/30",
  condition: "bg-orange-500/10 border-orange-500/30",
  delay: "bg-yellow-500/10 border-yellow-500/30",
  api: "bg-cyan-500/10 border-cyan-500/30",
  webhook: "bg-pink-500/10 border-pink-500/30",
}

export function WorkflowNodeComponent({
  node,
  isSelected,
  onSelect,
  onDrag,
  onDelete,
  onConnect,
  connecting,
  setConnecting,
}: WorkflowNodeComponentProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const nodeRef = useRef<HTMLDivElement>(null)

  const Icon = nodeIcons[node.type]

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget && !(e.target as HTMLElement).closest(".node-header")) return

    setIsDragging(true)
    setDragStart({
      x: e.clientX - node.position.x,
      y: e.clientY - node.position.y,
    })
    onSelect()
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    const newPosition = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    }
    onDrag(node.id, newPosition)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, dragStart])

  const handleConnect = () => {
    if (connecting && connecting !== node.id) {
      onConnect(connecting, node.id)
      setConnecting(null)
    } else {
      setConnecting(node.id)
    }
  }

  return (
    <div
      ref={nodeRef}
      className={`absolute workflow-node ${isSelected ? "ring-2 ring-primary" : ""}`}
      style={{
        left: node.position.x,
        top: node.position.y,
        zIndex: isSelected ? 10 : 5,
      }}
      onMouseDown={handleMouseDown}
    >
      <Card className={`w-48 ${nodeColors[node.type]} ${isDragging ? "shadow-lg" : ""}`}>
        {/* Node Header */}
        <div className="node-header p-3 cursor-move">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-background/20 flex items-center justify-center">
                <Icon className="w-3 h-3" />
              </div>
              <Badge variant="secondary" className="text-xs">
                {node.type}
              </Badge>
            </div>
            {node.type !== "trigger" && (
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onDelete}>
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>

          <div className="space-y-1">
            <div className="font-medium text-sm">{getNodeTitle(node)}</div>
            <div className="text-xs text-muted-foreground">{getNodeDescription(node)}</div>
          </div>
        </div>

        {/* Node Content */}
        <div className="px-3 pb-3">
          <NodeContent node={node} />
        </div>

        {/* Connection Points */}
        <div className="flex justify-between items-center px-3 pb-2">
          {node.type !== "trigger" && (
            <div className="w-3 h-3 rounded-full bg-muted border-2 border-background -ml-1.5" />
          )}
          <div className="flex-1" />
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 rounded-full"
            onClick={handleConnect}
            disabled={node.type === "delay" && !node.connections.length}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </Card>

      {/* Connection indicator */}
      {connecting === node.id && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full animate-pulse" />
      )}
    </div>
  )
}

function NodeContent({ node }: { node: WorkflowNode }) {
  switch (node.type) {
    case "trigger":
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <Play className="w-3 h-3 text-green-500" />
            <span>Active</span>
          </div>
        </div>
      )

    case "text":
      return (
        <div className="space-y-2">
          <div className="text-xs bg-background/20 rounded p-2">{node.data.message || "Enter your message..."}</div>
          {node.data.buttons?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {node.data.buttons.map((button: any, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {button.text}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )

    case "button":
      return (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Button Menu</div>
          <div className="flex flex-wrap gap-1">
            {node.data.buttons?.map((button: any, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {button.text}
              </Badge>
            )) || (
              <Badge variant="outline" className="text-xs">
                Add buttons...
              </Badge>
            )}
          </div>
        </div>
      )

    case "image":
      return (
        <div className="space-y-2">
          <div className="w-full h-16 bg-background/20 rounded flex items-center justify-center">
            {node.data.imageUrl ? (
              <img src={node.data.imageUrl || "/placeholder.svg"} alt="Preview" className="max-h-full rounded" />
            ) : (
              <ImageIcon className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          {node.data.caption && <div className="text-xs">{node.data.caption}</div>}
        </div>
      )

    case "condition":
      return (
        <div className="space-y-2">
          <div className="text-xs">
            If message <Badge variant="outline">{node.data.condition || "contains"}</Badge>
          </div>
          <div className="text-xs bg-background/20 rounded p-1">"{node.data.value || "keyword"}"</div>
        </div>
      )

    case "delay":
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="text-xs">
              Wait {node.data.duration || 5} {node.data.unit || "seconds"}
            </span>
          </div>
        </div>
      )

    case "api":
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {node.data.method || "POST"}
            </Badge>
            <Globe className="w-3 h-3 text-cyan-500" />
          </div>
          <div className="text-xs bg-background/20 rounded p-2 font-mono">
            {node.data.endpoint || "https://api.example.com/endpoint"}
          </div>
          {node.data.headers && Object.keys(node.data.headers).length > 0 && (
            <div className="text-xs text-muted-foreground">{Object.keys(node.data.headers).length} headers</div>
          )}
        </div>
      )

    case "webhook":
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {node.data.method || "POST"}
            </Badge>
            <Send className="w-3 h-3 text-pink-500" />
          </div>
          <div className="text-xs bg-background/20 rounded p-2 font-mono">
            {node.data.url || "https://webhook.example.com"}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span>Retries: {node.data.retries || 3}</span>
            {node.data.timeout && <span>Timeout: {node.data.timeout}s</span>}
          </div>
        </div>
      )

    default:
      return null
  }
}

function getNodeTitle(node: WorkflowNode): string {
  switch (node.type) {
    case "trigger":
      return node.data.title || "DM Received"
    case "text":
      return "Text Message"
    case "button":
      return "Button Menu"
    case "image":
      return "Image Response"
    case "condition":
      return "Condition Check"
    case "delay":
      return "Delay"
    case "api":
      return "API Call"
    case "webhook":
      return "Webhook"
    default:
      return "Unknown"
  }
}

function getNodeDescription(node: WorkflowNode): string {
  switch (node.type) {
    case "trigger":
      return node.data.description || "Workflow starts here"
    case "text":
      return `${node.data.message?.length || 0} characters`
    case "button":
      return `${node.data.buttons?.length || 0} buttons`
    case "image":
      return node.data.imageUrl ? "Image uploaded" : "No image"
    case "condition":
      return `Check: ${node.data.condition || "contains"}`
    case "delay":
      return `${node.data.duration || 5} ${node.data.unit || "seconds"}`
    case "api":
      return node.data.endpoint
        ? `${node.data.method || "POST"} ${new URL(node.data.endpoint).pathname}`
        : "Configure API endpoint"
    case "webhook":
      return node.data.url ? `${node.data.method || "POST"} webhook` : "Configure webhook URL"
    default:
      return ""
  }
}
