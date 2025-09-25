// "use client"

// import React from "react"

// import { useState, useRef } from "react"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import {
//   MessageSquare,
//   MousePointer,
//   ImageIcon,
//   GitBranch,
//   Clock,
//   Zap,
//   Trash2,
//   Plus,
//   Play,
//   Globe,
//   Send,
// } from "lucide-react"
// import type { WorkflowNode } from "@/types/workflow"

// interface WorkflowNodeComponentProps {
//   node: WorkflowNode
//   isSelected: boolean
//   onSelect: () => void
//   onDrag: (id: string, position: { x: number; y: number }) => void
//   onDelete: () => void
//   onConnect: (fromId: string, toId: string) => void
//   connecting: string | null
//   setConnecting: (id: string | null) => void
// }

// const nodeIcons = {
//   trigger: Zap,
//   text: MessageSquare,
//   button: MousePointer,
//   image: ImageIcon,
//   condition: GitBranch,
//   delay: Clock,
//   api: Globe,
//   webhook: Send,
// }

// const nodeColors = {
//   trigger: "bg-primary/10 border-primary/30",
//   text: "bg-blue-500/10 border-blue-500/30",
//   button: "bg-green-500/10 border-green-500/30",
//   image: "bg-purple-500/10 border-purple-500/30",
//   condition: "bg-orange-500/10 border-orange-500/30",
//   delay: "bg-yellow-500/10 border-yellow-500/30",
//   api: "bg-cyan-500/10 border-cyan-500/30",
//   webhook: "bg-pink-500/10 border-pink-500/30",
// }

// export function WorkflowNodeComponent({
//   node,
//   isSelected,
//   onSelect,
//   onDrag,
//   onDelete,
//   onConnect,
//   connecting,
//   setConnecting,
// }: WorkflowNodeComponentProps) {
//   const [isDragging, setIsDragging] = useState(false)
//   const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
//   const nodeRef = useRef<HTMLDivElement>(null)

//   const Icon = nodeIcons[node.type]

//   const handleMouseDown = (e: React.MouseEvent) => {
//     if (e.target !== e.currentTarget && !(e.target as HTMLElement).closest(".node-header")) return

//     setIsDragging(true)
//     setDragStart({
//       x: e.clientX - node.position.x,
//       y: e.clientY - node.position.y,
//     })
//     onSelect()
//   }

//   const handleMouseMove = (e: MouseEvent) => {
//     if (!isDragging) return

//     const newPosition = {
//       x: e.clientX - dragStart.x,
//       y: e.clientY - dragStart.y,
//     }
//     onDrag(node.id, newPosition)
//   }

//   const handleMouseUp = () => {
//     setIsDragging(false)
//   }

//   React.useEffect(() => {
//     if (isDragging) {
//       document.addEventListener("mousemove", handleMouseMove)
//       document.addEventListener("mouseup", handleMouseUp)
//       return () => {
//         document.removeEventListener("mousemove", handleMouseMove)
//         document.removeEventListener("mouseup", handleMouseUp)
//       }
//     }
//   }, [isDragging, dragStart])

//   const handleConnect = () => {
//     if (connecting && connecting !== node.id) {
//       onConnect(connecting, node.id)
//       setConnecting(null)
//     } else {
//       setConnecting(node.id)
//     }
//   }

//   return (
//     <div
//       ref={nodeRef}
//       className={`absolute workflow-node ${isSelected ? "ring-2 ring-primary" : ""}`}
//       style={{
//         left: node.position.x,
//         top: node.position.y,
//         zIndex: isSelected ? 10 : 5,
//       }}
//       onMouseDown={handleMouseDown}
//     >
//       <Card className={`w-48 ${nodeColors[node.type]} ${isDragging ? "shadow-lg" : ""}`}>
//         {/* Node Header */}
//         <div className="node-header p-3 cursor-move">
//           <div className="flex items-center justify-between mb-2">
//             <div className="flex items-center gap-2">
//               <div className="w-6 h-6 rounded bg-background/20 flex items-center justify-center">
//                 <Icon className="w-3 h-3" />
//               </div>
//               <Badge variant="secondary" className="text-xs">
//                 {node.type}
//               </Badge>
//             </div>
//             {node.type !== "trigger" && (
//               <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onDelete}>
//                 <Trash2 className="w-3 h-3" />
//               </Button>
//             )}
//           </div>

//           <div className="space-y-1">
//             <div className="font-medium text-sm">{getNodeTitle(node)}</div>
//             <div className="text-xs text-muted-foreground">{getNodeDescription(node)}</div>
//           </div>
//         </div>

//         {/* Node Content */}
//         <div className="px-3 pb-3">
//           <NodeContent node={node} />
//         </div>

//         {/* Connection Points */}
//         <div className="flex justify-between items-center px-3 pb-2">
//           {node.type !== "trigger" && (
//             <div className="w-3 h-3 rounded-full bg-muted border-2 border-background -ml-1.5" />
//           )}
//           <div className="flex-1" />
//           <Button
//             variant="ghost"
//             size="sm"
//             className="h-6 w-6 p-0 rounded-full"
//             onClick={handleConnect}
//             disabled={node.type === "delay" && !node.connections.length}
//           >
//             <Plus className="w-3 h-3" />
//           </Button>
//         </div>
//       </Card>

//       {/* Connection indicator */}
//       {connecting === node.id && (
//         <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full animate-pulse" />
//       )}
//     </div>
//   )
// }

// function NodeContent({ node }: { node: WorkflowNode }) {
//   switch (node.type) {
//     case "trigger":
//       return (
//         <div className="space-y-2">
//           <div className="flex items-center gap-2 text-xs">
//             <Play className="w-3 h-3 text-green-500" />
//             <span>Active</span>
//           </div>
//         </div>
//       )

//     case "text":
//       return (
//         <div className="space-y-2">
//           <div className="text-xs bg-background/20 rounded p-2">{node.data.message || "Enter your message..."}</div>
//           {node.data.buttons?.length > 0 && (
//             <div className="flex flex-wrap gap-1">
//               {node.data.buttons.map((button: any, index: number) => (
//                 <Badge key={index} variant="outline" className="text-xs">
//                   {button.text}
//                 </Badge>
//               ))}
//             </div>
//           )}
//         </div>
//       )

//     case "button":
//       return (
//         <div className="space-y-2">
//           <div className="text-xs text-muted-foreground">Button Menu</div>
//           <div className="flex flex-wrap gap-1">
//             {node.data.buttons?.map((button: any, index: number) => (
//               <Badge key={index} variant="outline" className="text-xs">
//                 {button.text}
//               </Badge>
//             )) || (
//               <Badge variant="outline" className="text-xs">
//                 Add buttons...
//               </Badge>
//             )}
//           </div>
//         </div>
//       )

//     case "image":
//       return (
//         <div className="space-y-2">
//           <div className="w-full h-16 bg-background/20 rounded flex items-center justify-center">
//             {node.data.imageUrl ? (
//               <img src={node.data.imageUrl || "/placeholder.svg"} alt="Preview" className="max-h-full rounded" />
//             ) : (
//               <ImageIcon className="w-6 h-6 text-muted-foreground" />
//             )}
//           </div>
//           {node.data.caption && <div className="text-xs">{node.data.caption}</div>}
//         </div>
//       )

//     case "condition":
//       return (
//         <div className="space-y-2">
//           <div className="text-xs">
//             If message <Badge variant="outline">{node.data.condition || "contains"}</Badge>
//           </div>
//           <div className="text-xs bg-background/20 rounded p-1">&ldquo;{node.data.value || "keyword"}&rdquo;</div>
//         </div>
//       )

//     case "delay":
//       return (
//         <div className="space-y-2">
//           <div className="flex items-center gap-2">
//             <Clock className="w-4 h-4" />
//             <span className="text-xs">
//               Wait {node.data.duration || 5} {node.data.unit || "seconds"}
//             </span>
//           </div>
//         </div>
//       )

//     case "api":
//       return (
//         <div className="space-y-2">
//           <div className="flex items-center gap-2">
//             <Badge variant="outline" className="text-xs">
//               {node.data.method || "POST"}
//             </Badge>
//             <Globe className="w-3 h-3 text-cyan-500" />
//           </div>
//           <div className="text-xs bg-background/20 rounded p-2 font-mono">
//             {node.data.endpoint || "https://api.example.com/endpoint"}
//           </div>
//           {node.data.headers && Object.keys(node.data.headers).length > 0 && (
//             <div className="text-xs text-muted-foreground">{Object.keys(node.data.headers).length} headers</div>
//           )}
//         </div>
//       )

//     case "webhook":
//       return (
//         <div className="space-y-2">
//           <div className="flex items-center gap-2">
//             <Badge variant="outline" className="text-xs">
//               {node.data.method || "POST"}
//             </Badge>
//             <Send className="w-3 h-3 text-pink-500" />
//           </div>
//           <div className="text-xs bg-background/20 rounded p-2 font-mono">
//             {node.data.url || "https://webhook.example.com"}
//           </div>
//           <div className="flex items-center gap-2 text-xs">
//             <span>Retries: {node.data.retries || 3}</span>
//             {node.data.timeout && <span>Timeout: {node.data.timeout}s</span>}
//           </div>
//         </div>
//       )

//     default:
//       return null
//   }
// }

// function getNodeTitle(node: WorkflowNode): string {
//   switch (node.type) {
//     case "trigger":
//       return node.data.title || "DM Received"
//     case "text":
//       return "Text Message"
//     case "button":
//       return "Button Menu"
//     case "image":
//       return "Image Response"
//     case "condition":
//       return "Condition Check"
//     case "delay":
//       return "Delay"
//     case "api":
//       return "API Call"
//     case "webhook":
//       return "Webhook"
//     default:
//       return "Unknown"
//   }
// }

// function getNodeDescription(node: WorkflowNode): string {
//   switch (node.type) {
//     case "trigger":
//       return node.data.description || "Workflow starts here"
//     case "text":
//       return `${node.data.message?.length || 0} characters`
//     case "button":
//       return `${node.data.buttons?.length || 0} buttons`
//     case "image":
//       return node.data.imageUrl ? "Image uploaded" : "No image"
//     case "condition":
//       return `Check: ${node.data.condition || "contains"}`
//     case "delay":
//       return `${node.data.duration || 5} ${node.data.unit || "seconds"}`
//     case "api":
//       return node.data.endpoint
//         ? `${node.data.method || "POST"} ${new URL(node.data.endpoint).pathname}`
//         : "Configure API endpoint"
//     case "webhook":
//       return node.data.url ? `${node.data.method || "POST"} webhook` : "Configure webhook URL"
//     default:
//       return ""
//   }
// }
"use client"

import React, { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { WorkflowNode } from "@/types/workflow"
import {
  MessageSquare,
  MousePointer,
  ImageIcon,
  GitBranch,
  Clock,
  Zap,
  Webhook,
  Sparkles,
  Trash2,
  Link,
  MoreHorizontal,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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
  trigger: Sparkles,
  text: MessageSquare,
  button: MousePointer,
  image: ImageIcon,
  condition: GitBranch,
  delay: Clock,
  api: Zap,
  webhook: Webhook,
}

const nodeColors = {
  trigger: "text-green-400 border-green-400/50 bg-green-400/10",
  text: "text-blue-400 border-blue-400/50 bg-blue-400/10",
  button: "text-purple-400 border-purple-400/50 bg-purple-400/10",
  image: "text-pink-400 border-pink-400/50 bg-pink-400/10",
  condition: "text-yellow-400 border-yellow-400/50 bg-yellow-400/10",
  delay: "text-orange-400 border-orange-400/50 bg-orange-400/10",
  api: "text-cyan-400 border-cyan-400/50 bg-cyan-400/10",
  webhook: "text-red-400 border-red-400/50 bg-red-400/10",
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
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const nodeRef = useRef<HTMLDivElement>(null)

  const Icon = nodeIcons[node.type]
  const colorClass = nodeColors[node.type]

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return // Only left click

    e.stopPropagation()
    onSelect()

    const rect = nodeRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
      setIsDragging(true)
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    const newPosition = {
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
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
  }, [isDragging, dragOffset])

  const handleConnectClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (connecting === node.id) {
      setConnecting(null)
    } else if (connecting) {
      onConnect(connecting, node.id)
    } else {
      setConnecting(node.id)
    }
  }

  const getNodeTitle = () => {
    switch (node.type) {
      case "trigger":
        return node.data.title || "Trigger"
      case "text":
        return "Text Message"
      case "button":
        return "Button Menu"
      case "image":
        return "Image"
      case "condition":
        return "Condition"
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

  const getNodeDescription = () => {
    switch (node.type) {
      case "trigger":
        return node.data.description || "Workflow trigger"
      case "text":
        return node.data.message?.substring(0, 50) + (node.data.message?.length > 50 ? "..." : "") || "Text message"
      case "button":
        return `${node.data.buttons?.length || 0} buttons`
      case "image":
        return node.data.caption || "Image response"
      case "condition":
        return `If message ${node.data.condition} "${node.data.value}"`
      case "delay":
        return `Wait ${node.data.duration} ${node.data.unit}`
      case "api":
        return node.data.endpoint || "API endpoint"
      case "webhook":
        return node.data.url || "Webhook URL"
      default:
        return "Node description"
    }
  }

  return (
    <div
      ref={nodeRef}
      className={`absolute cursor-move select-none ${isDragging ? "z-50" : "z-10"}`}
      style={{
        left: node.position.x,
        top: node.position.y,
        transform: isDragging ? "scale(1.05)" : "scale(1)",
        transition: isDragging ? "none" : "transform 0.2s ease",
      }}
      onMouseDown={handleMouseDown}
    >
      <Card
        className={`w-48 p-4 border-2 transition-all duration-200 hover:shadow-lg ${
          isSelected
            ? "border-primary shadow-lg ring-2 ring-primary/20"
            : connecting === node.id
              ? "border-blue-400 shadow-lg ring-2 ring-blue-400/20"
              : "border-border hover:border-primary/50"
        } ${colorClass}`}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 flex-shrink-0" />
            <h3 className="font-semibold text-sm text-foreground truncate">{getNodeTitle()}</h3>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-accent"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleConnectClick}>
                <Link className="h-4 w-4 mr-2" />
                {connecting === node.id ? "Cancel Connect" : "Connect"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{getNodeDescription()}</p>

        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {node.connections.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {node.connections.length} connected
              </Badge>
            )}
          </div>

          <div className="flex gap-1">
            {/* Connection point */}
            <Button
              variant="outline"
              size="sm"
              className={`h-6 w-6 p-0 rounded-full border-2 transition-all ${
                connecting === node.id
                  ? "border-blue-400 bg-blue-400/20"
                  : connecting
                    ? "border-green-400 bg-green-400/20 hover:border-green-500"
                    : "border-muted-foreground/30 hover:border-primary"
              }`}
              onClick={handleConnectClick}
            >
              <div className="h-2 w-2 rounded-full bg-current" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
