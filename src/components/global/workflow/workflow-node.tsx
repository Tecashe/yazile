// "use client"

// import type React from "react"

// import { useState, useRef, useEffect } from "react"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import type { WorkflowNode } from "@/lib/workflow-store"
// import {
//   MessageSquare,
//   MousePointer,
//   ImageIcon,
//   GitBranch,
//   Clock,
//   Zap,
//   Webhook,
//   Play,
//   Trash2,
//   Plus,
//   Grip,
// } from "lucide-react"

// interface WorkflowNodeProps {
//   node: WorkflowNode
//   isSelected: boolean
//   onSelect: () => void
//   onDrag: (id: string, position: { x: number; y: number }) => void
//   onDelete: () => void
//   onConnect: (fromId: string, toId: string) => void
// }

// const nodeIcons = {
//   trigger: Play,
//   text: MessageSquare,
//   button: MousePointer,
//   image: ImageIcon,
//   condition: GitBranch,
//   delay: Clock,
//   api: Zap,
//   webhook: Webhook,
// }

// const nodeColors = {
//   trigger: "bg-green-500",
//   text: "bg-blue-500",
//   button: "bg-orange-500",
//   image: "bg-purple-500",
//   condition: "bg-yellow-500",
//   delay: "bg-red-500",
//   api: "bg-cyan-500",
//   webhook: "bg-indigo-500",
// }

// export function WorkflowNodeComponent({ node, isSelected, onSelect, onDrag, onDelete, onConnect }: WorkflowNodeProps) {
//   const [isDragging, setIsDragging] = useState(false)
//   const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
//   const nodeRef = useRef<HTMLDivElement>(null)

//   const IconComponent = nodeIcons[node.type]
//   const colorClass = nodeColors[node.type]

//   useEffect(() => {
//     const handleGlobalMouseMove = (e: MouseEvent) => {
//       if (!isDragging) return

//       const newPosition = {
//         x: e.clientX - dragStart.x,
//         y: e.clientY - dragStart.y,
//       }

//       onDrag(node.id, newPosition)
//     }

//     const handleGlobalMouseUp = () => {
//       setIsDragging(false)
//     }

//     if (isDragging) {
//       document.addEventListener("mousemove", handleGlobalMouseMove)
//       document.addEventListener("mouseup", handleGlobalMouseUp)
//     }

//     return () => {
//       document.removeEventListener("mousemove", handleGlobalMouseMove)
//       document.removeEventListener("mouseup", handleGlobalMouseUp)
//     }
//   }, [isDragging, dragStart, node.id, onDrag])

//   const handleMouseDown = (e: React.MouseEvent) => {
//     if (e.button !== 0) return // Only left click

//     setIsDragging(true)
//     setDragStart({
//       x: e.clientX - node.position.x,
//       y: e.clientY - node.position.y,
//     })
//     onSelect()
//     e.preventDefault()
//     e.stopPropagation()
//   }

//   const getNodeTitle = () => {
//     switch (node.type) {
//       case "trigger":
//         return node.data.title || "Trigger"
//       case "text":
//         return "Text Message"
//       case "button":
//         return "Button Options"
//       case "image":
//         return "Image"
//       case "condition":
//         return "Condition"
//       case "delay":
//         return "Delay"
//       case "api":
//         return "API Call"
//       case "webhook":
//         return "Webhook"
//       default:
//         return "Node"
//     }
//   }

//   const getNodeDescription = () => {
//     switch (node.type) {
//       case "trigger":
//         return node.data.description || "Workflow trigger"
//       case "text":
//         return node.data.message?.substring(0, 50) + (node.data.message?.length > 50 ? "..." : "") || "Text message"
//       case "button":
//         return `${node.data.buttons?.length || 0} button(s)`
//       case "image":
//         return node.data.caption || "Image with caption"
//       case "condition":
//         return `If message ${node.data.condition} "${node.data.value}"`
//       case "delay":
//         return `Wait ${node.data.duration} ${node.data.unit}`
//       case "api":
//         return node.data.endpoint || "API endpoint"
//       case "webhook":
//         return node.data.url || "Webhook URL"
//       default:
//         return "Workflow node"
//     }
//   }

//   return (
//     <div
//       ref={nodeRef}
//       className="absolute"
//       style={{
//         left: node.position.x,
//         top: node.position.y,
//         zIndex: isSelected ? 10 : 1,
//       }}
//     >
//       <Card
//         className={`w-60 cursor-pointer transition-all duration-200 hover:shadow-md ${
//           isSelected ? "ring-2 ring-primary ring-offset-2 shadow-lg" : "hover:shadow-md"
//         } ${isDragging ? "shadow-xl scale-105" : ""}`}
//         onClick={onSelect}
//       >
//         {/* Node Header */}
//         <div
//           className={`${colorClass} p-3 rounded-t-lg text-white cursor-grab active:cursor-grabbing`}
//           onMouseDown={handleMouseDown}
//         >
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <IconComponent className="h-4 w-4" />
//               <span className="font-medium text-sm">{getNodeTitle()}</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <Grip className="h-3 w-3 opacity-70" />
//               {isSelected && (
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="h-6 w-6 p-0 text-white hover:bg-white/20"
//                   onClick={(e) => {
//                     e.stopPropagation()
//                     onDelete()
//                   }}
//                 >
//                   <Trash2 className="h-3 w-3" />
//                 </Button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Node Content */}
//         <div className="p-3">
//           <p className="text-sm text-muted-foreground leading-relaxed">{getNodeDescription()}</p>

//           {/* Node Status/Info */}
//           <div className="flex items-center justify-between mt-3">
//             <Badge variant="outline" className="text-xs capitalize">
//               {node.type}
//             </Badge>

//             {node.connections.length > 0 && (
//               <Badge variant="secondary" className="text-xs">
//                 {node.connections.length} connection(s)
//               </Badge>
//             )}
//           </div>
//         </div>

//         {/* Connection Points */}
//         <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
//           <div className="w-4 h-4 bg-primary rounded-full border-2 border-background shadow-sm flex items-center justify-center">
//             <Plus className="h-2 w-2 text-primary-foreground" />
//           </div>
//         </div>

//         <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
//           <div className="w-4 h-4 bg-muted rounded-full border-2 border-background shadow-sm"></div>
//         </div>
//       </Card>
//     </div>
//   )
// }

"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWorkflowStore, type WorkflowNode } from "@/lib/workflow-store"
import {
  MessageSquare,
  MousePointer,
  ImageIcon,
  GitBranch,
  Clock,
  Zap,
  Webhook,
  Play,
  Trash2,
  Plus,
  Grip,
  Link,
} from "lucide-react"

interface WorkflowNodeProps {
  node: WorkflowNode
  isSelected: boolean
  onSelect: () => void
  onDrag: (id: string, position: { x: number; y: number }) => void
  onDelete: () => void
  onConnect: (fromId: string, toId: string) => void
}

const nodeIcons = {
  trigger: Play,
  text: MessageSquare,
  button: MousePointer,
  image: ImageIcon,
  condition: GitBranch,
  delay: Clock,
  api: Zap,
  webhook: Webhook,
}

const nodeColors = {
  trigger: "bg-green-500",
  text: "bg-blue-500",
  button: "bg-orange-500",
  image: "bg-purple-500",
  condition: "bg-yellow-500",
  delay: "bg-red-500",
  api: "bg-cyan-500",
  webhook: "bg-indigo-500",
}

export function WorkflowNodeComponent({ node, isSelected, onSelect, onDrag, onDelete, onConnect }: WorkflowNodeProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const nodeRef = useRef<HTMLDivElement>(null)

  const { connectionMode, startConnection, cancelConnection, connectNodes } = useWorkflowStore()

  const IconComponent = nodeIcons[node.type]
  const colorClass = nodeColors[node.type]

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      const newPosition = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      }

      onDrag(node.id, newPosition)
    }

    const handleGlobalMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove)
      document.addEventListener("mouseup", handleGlobalMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove)
      document.removeEventListener("mouseup", handleGlobalMouseUp)
    }
  }, [isDragging, dragStart, node.id, onDrag])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return // Only left click

    setIsDragging(true)
    setDragStart({
      x: e.clientX - node.position.x,
      y: e.clientY - node.position.y,
    })
    onSelect()
    e.preventDefault()
    e.stopPropagation()
  }

  const handleConnectionStart = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (connectionMode.active) {
      cancelConnection()
    } else {
      startConnection(node.id)
    }
  }

  const handleConnectionEnd = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (connectionMode.active && connectionMode.fromNodeId && connectionMode.fromNodeId !== node.id) {
      connectNodes(connectionMode.fromNodeId, node.id)
    }
  }

  const getNodeTitle = () => {
    switch (node.type) {
      case "trigger":
        return node.data.title || "Trigger"
      case "text":
        return "Text Message"
      case "button":
        return "Button Options"
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
        return "Node"
    }
  }

  const getNodeDescription = () => {
    switch (node.type) {
      case "trigger":
        return node.data.description || "Workflow trigger"
      case "text":
        return node.data.message?.substring(0, 50) + (node.data.message?.length > 50 ? "..." : "") || "Text message"
      case "button":
        return `${node.data.buttons?.length || 0} button(s)`
      case "image":
        return node.data.caption || "Image with caption"
      case "condition":
        return `If message ${node.data.condition} "${node.data.value}"`
      case "delay":
        return `Wait ${node.data.duration} ${node.data.unit}`
      case "api":
        return node.data.endpoint || "API endpoint"
      case "webhook":
        return node.data.url || "Webhook URL"
      default:
        return "Workflow node"
    }
  }

  return (
    <div
      ref={nodeRef}
      className="absolute"
      style={{
        left: node.position.x,
        top: node.position.y,
        zIndex: isSelected ? 10 : 1,
      }}
    >
      <Card
        className={`w-60 cursor-pointer transition-all duration-200 hover:shadow-md ${
          isSelected ? "ring-2 ring-primary ring-offset-2 shadow-lg" : "hover:shadow-md"
        } ${isDragging ? "shadow-xl scale-105" : ""} ${
          connectionMode.active && connectionMode.fromNodeId === node.id ? "ring-2 ring-blue-500" : ""
        }`}
        onClick={onSelect}
      >
        {/* Node Header */}
        <div
          className={`${colorClass} p-3 rounded-t-lg text-white cursor-grab active:cursor-grabbing`}
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconComponent className="h-4 w-4" />
              <span className="font-medium text-sm">{getNodeTitle()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Grip className="h-3 w-3 opacity-70" />
              {isSelected && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete()
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Node Content */}
        <div className="p-3">
          <p className="text-sm text-muted-foreground leading-relaxed">{getNodeDescription()}</p>

          {/* Node Status/Info */}
          <div className="flex items-center justify-between mt-3">
            <Badge variant="outline" className="text-xs capitalize">
              {node.type}
            </Badge>

            {node.connections.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {node.connections.length} connection(s)
              </Badge>
            )}
          </div>
        </div>

        {/* Connection Points */}
        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
          <Button
            variant="ghost"
            size="sm"
            className={`w-4 h-4 p-0 rounded-full border-2 border-background shadow-sm transition-all hover:scale-110 ${
              connectionMode.active && connectionMode.fromNodeId === node.id
                ? "bg-blue-500 text-white"
                : "bg-primary text-primary-foreground hover:bg-primary/80"
            }`}
            onClick={handleConnectionStart}
            title={connectionMode.active ? "Cancel connection" : "Start connection"}
          >
            {connectionMode.active && connectionMode.fromNodeId === node.id ? (
              <Link className="h-2 w-2" />
            ) : (
              <Plus className="h-2 w-2" />
            )}
          </Button>
        </div>

        <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
          <Button
            variant="ghost"
            size="sm"
            className={`w-4 h-4 p-0 rounded-full border-2 border-background shadow-sm transition-all hover:scale-110 ${
              connectionMode.active && connectionMode.fromNodeId !== node.id
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-muted hover:bg-muted/80"
            }`}
            onClick={handleConnectionEnd}
            title={connectionMode.active ? "Connect here" : "Connection input"}
            disabled={!connectionMode.active || connectionMode.fromNodeId === node.id}
          >
            {connectionMode.active && connectionMode.fromNodeId !== node.id ? (
              <Link className="h-2 w-2" />
            ) : (
              <div className="w-1 h-1 bg-current rounded-full" />
            )}
          </Button>
        </div>
      </Card>
    </div>
  )
}
