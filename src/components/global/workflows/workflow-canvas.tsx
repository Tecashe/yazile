// "use client"

// import type React from "react"
// import { useRef, useCallback, useState, useEffect } from "react"
// import { useWorkflowStore, type WorkflowNode } from "@/lib/workflow-store-production"
// import { WorkflowNodeComponent } from "./workflow-node"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { ZoomIn, ZoomOut, Maximize, RotateCcw, Grid3X3, MousePointer, Move } from "lucide-react"

// export function WorkflowCanvas() {
//   const canvasRef = useRef<HTMLDivElement>(null)
//   const [isPanning, setIsPanning] = useState(false)
//   const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 })
//   const [showGrid, setShowGrid] = useState(true)
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

//   const {
//     nodes,
//     connections,
//     selectedNode,
//     setSelectedNode,
//     updateNode,
//     deleteNode,
//     connectNodes,
//     addNode,
//     connectionMode,
//     cancelConnection,
//     canvasOffset,
//     canvasZoom,
//     setCanvasOffset,
//     setCanvasZoom,
//     resetCanvas,
//   } = useWorkflowStore()

//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       if (connectionMode.active) {
//         const rect = canvasRef.current?.getBoundingClientRect()
//         if (rect) {
//           setMousePosition({
//             x: (e.clientX - rect.left - canvasOffset.x) / canvasZoom,
//             y: (e.clientY - rect.top - canvasOffset.y) / canvasZoom,
//           })
//         }
//       }
//     }

//     document.addEventListener("mousemove", handleMouseMove)
//     return () => document.removeEventListener("mousemove", handleMouseMove)
//   }, [connectionMode.active, canvasOffset, canvasZoom])

//   useEffect(() => {
//     const handleGlobalMouseMove = (e: MouseEvent) => {
//       if (isPanning) {
//         const deltaX = e.clientX - lastPanPoint.x
//         const deltaY = e.clientY - lastPanPoint.y
//         setCanvasOffset({
//           x: canvasOffset.x + deltaX,
//           y: canvasOffset.y + deltaY,
//         })
//         setLastPanPoint({ x: e.clientX, y: e.clientY })
//       }
//     }

//     const handleGlobalMouseUp = () => {
//       setIsPanning(false)
//     }

//     if (isPanning) {
//       document.addEventListener("mousemove", handleGlobalMouseMove)
//       document.addEventListener("mouseup", handleGlobalMouseUp)
//     }

//     return () => {
//       document.removeEventListener("mousemove", handleGlobalMouseMove)
//       document.removeEventListener("mouseup", handleGlobalMouseUp)
//     }
//   }, [isPanning, lastPanPoint, canvasOffset, setCanvasOffset])

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Escape" && connectionMode.active) {
//         cancelConnection()
//       }
//       if (e.key === "Delete" && selectedNode) {
//         deleteNode(selectedNode)
//       }
//       if (e.ctrlKey && e.key === "0") {
//         e.preventDefault()
//         resetCanvas()
//       }
//     }

//     document.addEventListener("keydown", handleKeyDown)
//     return () => document.removeEventListener("keydown", handleKeyDown)
//   }, [connectionMode.active, cancelConnection, selectedNode, deleteNode, resetCanvas])

//   const handleCanvasClick = useCallback(
//     (e: React.MouseEvent) => {
//       if (e.target === canvasRef.current || (e.target as Element).classList.contains("canvas-background")) {
//         setSelectedNode(null)
//         if (connectionMode.active) {
//           cancelConnection()
//         }
//       }
//     },
//     [setSelectedNode, connectionMode.active, cancelConnection],
//   )

//   const handleDrop = useCallback(
//     (e: React.DragEvent) => {
//       e.preventDefault()
//       const rect = canvasRef.current?.getBoundingClientRect()
//       if (!rect) return

//       try {
//         const data = JSON.parse(e.dataTransfer.getData("application/json"))
//         const position = {
//           x: (e.clientX - rect.left - canvasOffset.x) / canvasZoom - 120,
//           y: (e.clientY - rect.top - canvasOffset.y) / canvasZoom - 50,
//         }

//         const newNode: WorkflowNode = {
//           id: `node-${Date.now()}`,
//           type: data.type,
//           position,
//           data: getDefaultNodeData(data.type),
//           connections: [],
//         }

//         addNode(newNode)
//       } catch (error) {
//         console.error("Failed to parse drop data:", error)
//       }
//     },
//     [canvasOffset, canvasZoom, addNode],
//   )

//   const handleDragOver = useCallback((e: React.DragEvent) => {
//     e.preventDefault()
//   }, [])

//   const handleMouseDown = useCallback((e: React.MouseEvent) => {
//     if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
//       setIsPanning(true)
//       setLastPanPoint({ x: e.clientX, y: e.clientY })
//       e.preventDefault()
//     }
//   }, [])

//   const handleWheel = useCallback(
//     (e: React.WheelEvent) => {
//       if (e.ctrlKey) {
//         e.preventDefault()
//         const delta = e.deltaY > 0 ? 0.9 : 1.1
//         const newZoom = Math.max(0.1, Math.min(3, canvasZoom * delta))
//         setCanvasZoom(newZoom)
//       } else {
//         setCanvasOffset({
//           x: canvasOffset.x - e.deltaX,
//           y: canvasOffset.y - e.deltaY,
//         })
//       }
//     },
//     [canvasZoom, canvasOffset, setCanvasZoom, setCanvasOffset],
//   )

//   const handleNodeDrag = useCallback(
//     (id: string, position: { x: number; y: number }) => {
//       updateNode(id, { position })
//     },
//     [updateNode],
//   )

//   const getConnectionPath = (from: { x: number; y: number }, to: { x: number; y: number }) => {
//     const dx = to.x - from.x
//     const controlOffset = Math.abs(dx) * 0.5
//     return `M ${from.x} ${from.y} C ${from.x + controlOffset} ${from.y}, ${to.x - controlOffset} ${to.y}, ${to.x} ${to.y}`
//   }

//   const handleZoomIn = () => setCanvasZoom(Math.min(3, canvasZoom * 1.2))
//   const handleZoomOut = () => setCanvasZoom(Math.max(0.1, canvasZoom * 0.8))

//   const handleFitToScreen = () => {
//     if (nodes.length === 0) {
//       resetCanvas()
//       return
//     }

//     const bounds = nodes.reduce(
//       (acc, node) => ({
//         minX: Math.min(acc.minX, node.position.x),
//         minY: Math.min(acc.minY, node.position.y),
//         maxX: Math.max(acc.maxX, node.position.x + 240),
//         maxY: Math.max(acc.maxY, node.position.y + 100),
//       }),
//       {
//         minX: Number.POSITIVE_INFINITY,
//         minY: Number.POSITIVE_INFINITY,
//         maxX: Number.NEGATIVE_INFINITY,
//         maxY: Number.NEGATIVE_INFINITY,
//       },
//     )

//     const rect = canvasRef.current?.getBoundingClientRect()
//     if (!rect) return

//     const padding = 100
//     const contentWidth = bounds.maxX - bounds.minX + padding * 2
//     const contentHeight = bounds.maxY - bounds.minY + padding * 2
//     const scale = Math.min(rect.width / contentWidth, rect.height / contentHeight, 1)

//     setCanvasZoom(scale)
//     setCanvasOffset({
//       x: rect.width / 2 - ((bounds.minX + bounds.maxX) / 2) * scale,
//       y: rect.height / 2 - ((bounds.minY + bounds.maxY) / 2) * scale,
//     })
//   }

//   return (
//     <div className="relative w-full h-full bg-background overflow-hidden">
//       <div
//         ref={canvasRef}
//         className="absolute inset-0 canvas-background"
//         onClick={handleCanvasClick}
//         onDrop={handleDrop}
//         onDragOver={handleDragOver}
//         onMouseDown={handleMouseDown}
//         onWheel={handleWheel}
//         style={{
//           cursor: isPanning ? "grabbing" : connectionMode.active ? "crosshair" : "grab",
//         }}
//       >
//         <div
//           className="absolute"
//           style={{
//             transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${canvasZoom})`,
//             transformOrigin: "0 0",
//           }}
//         >
//           {showGrid && (
//             <div
//               className="absolute inset-0 opacity-30"
//               style={{
//                 left: -5000,
//                 top: -5000,
//                 width: 10000,
//                 height: 10000,
//                 backgroundImage: `
//                   linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
//                   linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
//                 `,
//                 backgroundSize: "20px 20px",
//               }}
//             />
//           )}

//           <svg
//             className="absolute inset-0 pointer-events-none"
//             style={{ left: -5000, top: -5000, width: 10000, height: 10000 }}
//           >
//             <defs>
//               <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
//                 <path d="M0,0 L0,6 L8,3 z" fill="hsl(var(--muted-foreground))" />
//               </marker>
//             </defs>

//             {connections.map((connection) => {
//               const fromNode = nodes.find((n) => n.id === connection.fromNodeId)
//               const toNode = nodes.find((n) => n.id === connection.toNodeId)
//               if (!fromNode || !toNode) return null

//               const fromPoint = {
//                 x: fromNode.position.x + 240,
//                 y: fromNode.position.y + 50,
//               }
//               const toPoint = {
//                 x: toNode.position.x,
//                 y: toNode.position.y + 50,
//               }

//               return (
//                 <path
//                   key={connection.id}
//                   d={getConnectionPath(fromPoint, toPoint)}
//                   stroke="hsl(var(--muted-foreground))"
//                   strokeWidth="2"
//                   fill="none"
//                   markerEnd="url(#arrowhead)"
//                   className="hover:stroke-primary transition-colors"
//                 />
//               )
//             })}

//             {connectionMode.active && connectionMode.fromNodeId && (
//               <path
//                 d={`M ${nodes.find((n) => n.id === connectionMode.fromNodeId)?.position.x! + 240} ${
//                   nodes.find((n) => n.id === connectionMode.fromNodeId)?.position.y! + 50
//                 } L ${mousePosition.x} ${mousePosition.y}`}
//                 stroke="hsl(var(--primary))"
//                 strokeWidth="2"
//                 strokeDasharray="5,5"
//                 fill="none"
//                 opacity="0.7"
//               />
//             )}
//           </svg>

//           {/* Workflow nodes */}
//           {nodes.map((node) => (
//             <WorkflowNodeComponent
//               key={node.id}
//               node={node}
//               isSelected={selectedNode === node.id}
//               onSelect={() => setSelectedNode(node.id)}
//               onDrag={handleNodeDrag}
//               onDelete={() => deleteNode(node.id)}
//               onConnect={connectNodes}
//             />
//           ))}
//         </div>
//       </div>

//       <div className="absolute bottom-4 left-4 flex flex-col gap-2">
//         <div className="bg-card/95 border border-border rounded-lg p-2 backdrop-blur-sm shadow-sm">
//           <div className="flex items-center gap-1">
//             <Button variant="ghost" size="sm" onClick={handleZoomOut} className="h-8 w-8 p-0">
//               <ZoomOut className="h-4 w-4" />
//             </Button>
//             <div className="px-2 text-xs font-mono min-w-[50px] text-center">{Math.round(canvasZoom * 100)}%</div>
//             <Button variant="ghost" size="sm" onClick={handleZoomIn} className="h-8 w-8 p-0">
//               <ZoomIn className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>

//         <div className="bg-card/95 border border-border rounded-lg p-2 backdrop-blur-sm shadow-sm">
//           <div className="flex items-center gap-1">
//             <Button variant="ghost" size="sm" onClick={handleFitToScreen} className="h-8 w-8 p-0">
//               <Maximize className="h-4 w-4" />
//             </Button>
//             <Button variant="ghost" size="sm" onClick={resetCanvas} className="h-8 w-8 p-0">
//               <RotateCcw className="h-4 w-4" />
//             </Button>
//             <Button
//               variant={showGrid ? "default" : "ghost"}
//               size="sm"
//               onClick={() => setShowGrid(!showGrid)}
//               className="h-8 w-8 p-0"
//             >
//               <Grid3X3 className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>
//       </div>

//       {connectionMode.active && (
//         <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
//           <Badge variant="default" className="bg-primary text-primary-foreground">
//             <MousePointer className="h-3 w-3 mr-1" />
//             Click target node to connect
//           </Badge>
//         </div>
//       )}

//       {isPanning && (
//         <div className="absolute top-4 right-4">
//           <Badge variant="secondary">
//             <Move className="h-3 w-3 mr-1" />
//             Panning
//           </Badge>
//         </div>
//       )}
//     </div>
//   )
// }

// function getDefaultNodeData(type: string) {
//   switch (type) {
//     case "trigger":
//       return {
//         title: "New Trigger",
//         description: "Configure trigger conditions",
//         triggerType: "dm",
//         platforms: ["instagram"],
//       }
//     case "text":
//       return {
//         message: "Hello! Thanks for your message.",
//         buttons: [],
//       }
//     case "button":
//       return {
//         buttons: [{ text: "Option 1", action: "continue", id: crypto.randomUUID() }],
//       }
//     case "image":
//       return {
//         imageUrl: "",
//         caption: "",
//         buttons: [],
//       }
//     case "condition":
//       return {
//         condition: "contains",
//         value: "",
//         trueAction: "continue",
//         falseAction: "continue",
//       }
//     case "delay":
//       return {
//         duration: 5,
//         unit: "seconds",
//       }
//     case "api":
//       return {
//         endpoint: "",
//         method: "POST",
//         headers: {},
//         body: "",
//       }
//     case "webhook":
//       return {
//         url: "",
//         method: "POST",
//         headers: {},
//         payload: "",
//       }
//     default:
//       return {}
//   }
// }
// Enhanced Canvas Component

"use client"

import type React from "react"
import { useRef, useCallback, useState, useEffect } from "react"
import { useWorkflowStore, type WorkflowNode } from "@/lib/workflow-store-production"
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
  Webhook,
  Play,
  Trash2,
  Plus,
  Link,
  ZoomIn,
  ZoomOut,
  Maximize,
  RotateCcw,
  Grid3X3,
  Move,
  X,
  Target,
  Sparkles
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
  trigger: "bg-gradient-to-br from-emerald-500 to-emerald-600",
  text: "bg-gradient-to-br from-blue-500 to-blue-600",
  button: "bg-gradient-to-br from-orange-500 to-orange-600",
  image: "bg-gradient-to-br from-purple-500 to-purple-600",
  condition: "bg-gradient-to-br from-amber-500 to-amber-600",
  delay: "bg-gradient-to-br from-rose-500 to-rose-600",
  api: "bg-gradient-to-br from-cyan-500 to-cyan-600",
  webhook: "bg-gradient-to-br from-indigo-500 to-indigo-600",
}

function WorkflowNodeComponent({ node, isSelected, onSelect, onDrag, onDelete }: WorkflowNodeProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
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
    if (e.button !== 0) return
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
        return node.data.message?.substring(0, 40) + (node.data.message?.length > 40 ? "..." : "") || "Text message"
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
      className="absolute group"
      style={{
        left: node.position.x,
        top: node.position.y,
        zIndex: isSelected ? 20 : isDragging ? 15 : 1,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className={`w-64 cursor-pointer transition-all duration-300 transform ${
          isSelected 
            ? "ring-2 ring-blue-500 shadow-2xl scale-105" 
            : isHovered 
              ? "shadow-xl scale-102" 
              : "hover:shadow-lg"
        } ${isDragging ? "shadow-2xl scale-110 rotate-1" : ""} ${
          connectionMode.active && connectionMode.fromNodeId === node.id 
            ? "ring-2 ring-cyan-400 shadow-cyan-200/50" 
            : ""
        }`}
        onClick={onSelect}
      >
        <div
          className={`${colorClass} p-4 rounded-t-lg text-white cursor-grab active:cursor-grabbing relative overflow-hidden`}
          onMouseDown={handleMouseDown}
        >
          {/* Subtle shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                <IconComponent className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{getNodeTitle()}</h3>
                <p className="text-xs text-white/80">{node.type.toUpperCase()}</p>
              </div>
            </div>
            {isSelected && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-white hover:bg-red-500/20 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="p-4">
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            {getNodeDescription()}
          </p>
          
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs capitalize font-medium">
              {node.type}
            </Badge>
            {node.connections.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                <Link className="h-3 w-3 mr-1" />
                {node.connections.length}
              </Badge>
            )}
          </div>
        </div>

        {/* Enhanced Connection Points */}
        <div className="absolute -right-3 top-1/2 transform -translate-y-1/2">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className={`w-6 h-6 p-0 rounded-full border-2 border-background shadow-lg transition-all duration-200 ${
                connectionMode.active && connectionMode.fromNodeId === node.id
                  ? "bg-cyan-500 text-white scale-110 animate-pulse"
                  : "bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:scale-110 hover:shadow-xl"
              }`}
              onClick={handleConnectionStart}
            >
              {connectionMode.active && connectionMode.fromNodeId === node.id ? (
                <X className="h-3 w-3" />
              ) : (
                <Plus className="h-3 w-3" />
              )}
            </Button>
            {(isHovered || connectionMode.active) && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap z-50">
                {connectionMode.active && connectionMode.fromNodeId === node.id ? "Cancel" : "Connect"}
              </div>
            )}
          </div>
        </div>

        <div className="absolute -left-3 top-1/2 transform -translate-y-1/2">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className={`w-6 h-6 p-0 rounded-full border-2 border-background shadow-lg transition-all duration-200 ${
                connectionMode.active && connectionMode.fromNodeId !== node.id
                  ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white hover:scale-110 animate-bounce"
                  : "bg-muted hover:bg-muted/80"
              }`}
              onClick={handleConnectionEnd}
              disabled={!connectionMode.active || connectionMode.fromNodeId === node.id}
            >
              {connectionMode.active && connectionMode.fromNodeId !== node.id ? (
                <Target className="h-3 w-3" />
              ) : (
                <div className="w-2 h-2 bg-current rounded-full" />
              )}
            </Button>
            {connectionMode.active && connectionMode.fromNodeId !== node.id && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-50">
                Click to connect
              </div>
            )}
          </div>
        </div>

        {/* Selection glow effect */}
        {isSelected && (
          <div className="absolute inset-0 rounded-lg bg-blue-500/10 pointer-events-none animate-pulse" />
        )}
      </Card>
    </div>
  )
}

// Enhanced Connection Component
function ConnectionLine({ connection, fromNode, toNode, onDelete, isSelected, onSelect }: {
  connection: any
  fromNode: WorkflowNode | undefined
  toNode: WorkflowNode | undefined
  onDelete: (id: string) => void
  isSelected: boolean
  onSelect: (id: string) => void
}) {
  const [isHovered, setIsHovered] = useState(false)
  
  if (!fromNode || !toNode) return null

  const fromPoint = {
    x: fromNode.position.x + 256, // Right edge of source node
    y: fromNode.position.y + 60,  // Middle height of node
  }
  
  const toPoint = {
    x: toNode.position.x,         // Left edge of target node
    y: toNode.position.y + 60,    // Middle height of node
  }

  // Enhanced bezier curve calculation
  const dx = toPoint.x - fromPoint.x
  const dy = toPoint.y - fromPoint.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  const controlOffset = Math.max(Math.abs(dx) * 0.4, 60)
  
  const path = `M ${fromPoint.x} ${fromPoint.y} C ${fromPoint.x + controlOffset} ${fromPoint.y}, ${toPoint.x - controlOffset} ${toPoint.y}, ${toPoint.x} ${toPoint.y}`
  
  // Calculate midpoint for delete button
  const t = 0.5
  const midX = Math.pow(1-t, 3) * fromPoint.x + 
               3 * Math.pow(1-t, 2) * t * (fromPoint.x + controlOffset) +
               3 * (1-t) * Math.pow(t, 2) * (toPoint.x - controlOffset) +
               Math.pow(t, 3) * toPoint.x
  const midY = Math.pow(1-t, 3) * fromPoint.y + 
               3 * Math.pow(1-t, 2) * t * fromPoint.y +
               3 * (1-t) * Math.pow(t, 2) * toPoint.y +
               Math.pow(t, 3) * toPoint.y

  return (
    <g
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(connection.id)}
      className="cursor-pointer"
    >
      {/* Invisible wider path for easier hovering */}
      <path
        d={path}
        stroke="transparent"
        strokeWidth="20"
        fill="none"
        className="pointer-events-stroke"
      />
      
      {/* Main connection line */}
      <path
        d={path}
        stroke={isSelected ? "#3b82f6" : isHovered ? "#6366f1" : "#64748b"}
        strokeWidth={isSelected ? "3" : isHovered ? "2.5" : "2"}
        fill="none"
        markerEnd="url(#arrowhead)"
        className={`transition-all duration-200 ${
          isHovered ? "filter drop-shadow-lg" : ""
        }`}
        style={{
          strokeDasharray: isHovered ? "none" : "none",
          animation: isSelected ? "dash 1s linear infinite" : "none"
        }}
      />
      
      {/* Animated flow particles */}
      {(isHovered || isSelected) && (
        <>
          <circle r="3" fill="#3b82f6" opacity="0.8">
            <animateMotion dur="2s" repeatCount="indefinite" path={path} />
          </circle>
          <circle r="2" fill="#8b5cf6" opacity="0.6">
            <animateMotion dur="2s" repeatCount="indefinite" path={path} begin="0.5s" />
          </circle>
        </>
      )}
      
      {/* Delete button on hover */}
      {isHovered && (
        <g>
          <circle
            cx={midX}
            cy={midY}
            r="12"
            fill="#ef4444"
            className="cursor-pointer hover:fill-red-600 transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(connection.id)
            }}
          />
          <path
            d={`M ${midX - 4} ${midY - 4} L ${midX + 4} ${midY + 4} M ${midX + 4} ${midY - 4} L ${midX - 4} ${midY + 4}`}
            stroke="white"
            strokeWidth="2"
            className="pointer-events-none"
          />
        </g>
      )}
    </g>
  )
}

export function WorkflowCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isPanning, setIsPanning] = useState(false)
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 })
  const [showGrid, setShowGrid] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null)

  const {
    nodes,
    connections,
    selectedNode,
    setSelectedNode,
    updateNode,
    deleteNode,
    connectNodes,
    addNode,
    connectionMode,
    cancelConnection,
    canvasOffset,
    canvasZoom,
    setCanvasOffset,
    setCanvasZoom,
    resetCanvas,
    disconnectNodes,
  } = useWorkflowStore()

  // Enhanced deleteConnection function
  const deleteConnection = useCallback((connectionId: string) => {
    const connection = connections.find(c => c.id === connectionId)
    if (connection && disconnectNodes) {
      disconnectNodes(connection.fromNodeId, connection.toNodeId, connection.fromHandle)
    }
  }, [connections, disconnectNodes])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (connectionMode.active) {
        const rect = canvasRef.current?.getBoundingClientRect()
        if (rect) {
          setMousePosition({
            x: (e.clientX - rect.left - canvasOffset.x) / canvasZoom,
            y: (e.clientY - rect.top - canvasOffset.y) / canvasZoom,
          })
        }
      }
    }

    document.addEventListener("mousemove", handleMouseMove)
    return () => document.removeEventListener("mousemove", handleMouseMove)
  }, [connectionMode.active, canvasOffset, canvasZoom])

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isPanning) {
        const deltaX = e.clientX - lastPanPoint.x
        const deltaY = e.clientY - lastPanPoint.y
        setCanvasOffset({
          x: canvasOffset.x + deltaX,
          y: canvasOffset.y + deltaY,
        })
        setLastPanPoint({ x: e.clientX, y: e.clientY })
      }
    }

    const handleGlobalMouseUp = () => {
      setIsPanning(false)
    }

    if (isPanning) {
      document.addEventListener("mousemove", handleGlobalMouseMove)
      document.addEventListener("mouseup", handleGlobalMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove)
      document.removeEventListener("mouseup", handleGlobalMouseUp)
    }
  }, [isPanning, lastPanPoint, canvasOffset, setCanvasOffset])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (connectionMode.active) {
          cancelConnection()
        }
        if (selectedConnection) {
          setSelectedConnection(null)
        }
      }
      if (e.key === "Delete") {
        if (selectedNode) {
          deleteNode(selectedNode)
        }
        if (selectedConnection) {
          deleteConnection(selectedConnection)
          setSelectedConnection(null)
        }
      }
      if (e.ctrlKey && e.key === "0") {
        e.preventDefault()
        resetCanvas()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [connectionMode.active, selectedNode, selectedConnection, cancelConnection, deleteNode, deleteConnection, resetCanvas])

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === canvasRef.current || (e.target as Element).classList.contains("canvas-background")) {
        setSelectedNode(null)
        setSelectedConnection(null)
        if (connectionMode.active) {
          cancelConnection()
        }
      }
    },
    [setSelectedNode, connectionMode.active, cancelConnection],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      try {
        const data = JSON.parse(e.dataTransfer.getData("application/json"))
        const position = {
          x: (e.clientX - rect.left - canvasOffset.x) / canvasZoom - 120,
          y: (e.clientY - rect.top - canvasOffset.y) / canvasZoom - 50,
        }

        const newNode: WorkflowNode = {
          id: `node-${Date.now()}`,
          type: data.type,
          position,
          data: getDefaultNodeData(data.type),
          connections: [],
        }

        addNode(newNode)
      } catch (error) {
        console.error("Failed to parse drop data:", error)
      }
    },
    [canvasOffset, canvasZoom, addNode],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      setIsPanning(true)
      setLastPanPoint({ x: e.clientX, y: e.clientY })
      e.preventDefault()
    }
  }, [])

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault()
        const delta = e.deltaY > 0 ? 0.9 : 1.1
        const newZoom = Math.max(0.1, Math.min(3, canvasZoom * delta))
        setCanvasZoom(newZoom)
      } else {
        setCanvasOffset({
          x: canvasOffset.x - e.deltaX,
          y: canvasOffset.y - e.deltaY,
        })
      }
    },
    [canvasZoom, canvasOffset, setCanvasZoom, setCanvasOffset],
  )

  const handleNodeDrag = useCallback(
    (id: string, position: { x: number; y: number }) => {
      updateNode(id, { position })
    },
    [updateNode],
  )

  const handleZoomIn = () => setCanvasZoom(Math.min(3, canvasZoom * 1.2))
  const handleZoomOut = () => setCanvasZoom(Math.max(0.1, canvasZoom * 0.8))

  const handleFitToScreen = () => {
    if (nodes.length === 0) {
      resetCanvas()
      return
    }

    const bounds = nodes.reduce(
      (acc, node) => ({
        minX: Math.min(acc.minX, node.position.x),
        minY: Math.min(acc.minY, node.position.y),
        maxX: Math.max(acc.maxX, node.position.x + 256),
        maxY: Math.max(acc.maxY, node.position.y + 120),
      }),
      {
        minX: Number.POSITIVE_INFINITY,
        minY: Number.POSITIVE_INFINITY,
        maxX: Number.NEGATIVE_INFINITY,
        maxY: Number.NEGATIVE_INFINITY,
      },
    )

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const padding = 100
    const contentWidth = bounds.maxX - bounds.minX + padding * 2
    const contentHeight = bounds.maxY - bounds.minY + padding * 2
    const scale = Math.min(rect.width / contentWidth, rect.height / contentHeight, 1)

    setCanvasZoom(scale)
    setCanvasOffset({
      x: rect.width / 2 - ((bounds.minX + bounds.maxX) / 2) * scale,
      y: rect.height / 2 - ((bounds.minY + bounds.maxY) / 2) * scale,
    })
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      <div
        ref={canvasRef}
        className="absolute inset-0 canvas-background"
        onClick={handleCanvasClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
        style={{
          cursor: isPanning ? "grabbing" : connectionMode.active ? "crosshair" : "grab",
        }}
      >
        <div
          className="absolute"
          style={{
            transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${canvasZoom})`,
            transformOrigin: "0 0",
          }}
        >
          {/* Enhanced Grid */}
          {showGrid && (
            <div
              className="absolute inset-0 opacity-40"
              style={{
                left: -10000,
                top: -10000,
                width: 20000,
                height: 20000,
                backgroundImage: `
                  radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0),
                  linear-gradient(to right, rgba(148, 163, 184, 0.1) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(148, 163, 184, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px, 40px 40px, 40px 40px",
              }}
            />
          )}

          {/* Enhanced SVG with Connections */}
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{ left: -10000, top: -10000, width: 20000, height: 20000 }}
          >
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,8 L10,4 z" fill="#64748b" />
              </marker>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
              <style>
                {`
                  @keyframes dash {
                    to {
                      stroke-dashoffset: -20;
                    }
                  }
                `}
              </style>
            </defs>

            {/* Static connections */}
            {connections.map((connection) => {
              const fromNode = nodes.find((n) => n.id === connection.fromNodeId)
              const toNode = nodes.find((n) => n.id === connection.toNodeId)
              return (
                <ConnectionLine
                  key={connection.id}
                  connection={connection}
                  fromNode={fromNode}
                  toNode={toNode}
                  onDelete={deleteConnection}
                  isSelected={selectedConnection === connection.id}
                  onSelect={setSelectedConnection}
                />
              )
            })}

            {/* Dynamic connection line while connecting */}
            {connectionMode.active && connectionMode.fromNodeId && (
              <g>
                <path
                  d={`M ${nodes.find((n) => n.id === connectionMode.fromNodeId)?.position.x! + 256} ${
                    nodes.find((n) => n.id === connectionMode.fromNodeId)?.position.y! + 60
                  } L ${mousePosition.x} ${mousePosition.y}`}
                  stroke="url(#connectionGradient)"
                  strokeWidth="3"
                  strokeDasharray="8,4"
                  fill="none"
                  opacity="0.8"
                  filter="url(#glow)"
                  style={{
                    animation: "dash 0.5s linear infinite"
                  }}
                />
                <circle
                  cx={mousePosition.x}
                  cy={mousePosition.y}
                  r="6"
                  fill="#3b82f6"
                  opacity="0.8"
                  className="animate-pulse"
                />
              </g>
            )}
          </svg>

          {/* Workflow nodes */}
          {nodes.map((node) => (
            <WorkflowNodeComponent
              key={node.id}
              node={node}
              isSelected={selectedNode === node.id}
              onSelect={() => setSelectedNode(node.id)}
              onDrag={handleNodeDrag}
              onDelete={() => deleteNode(node.id)}
              onConnect={connectNodes}
            />
          ))}
        </div>
      </div>

      {/* Enhanced Control Panel */}
      <div className="absolute bottom-6 left-6 flex flex-col gap-3">
        <div className="bg-white/95 border border-slate-200 rounded-xl p-3 backdrop-blur-sm shadow-lg">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleZoomOut} 
              className="h-9 w-9 p-0 hover:bg-slate-100 transition-all duration-200"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <div className="px-3 py-1 text-sm font-mono min-w-[60px] text-center bg-slate-50 rounded-lg border">
              {Math.round(canvasZoom * 100)}%
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleZoomIn} 
              className="h-9 w-9 p-0 hover:bg-slate-100 transition-all duration-200"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="bg-white/95 border border-slate-200 rounded-xl p-3 backdrop-blur-sm shadow-lg">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleFitToScreen} 
              className="h-9 w-9 p-0 hover:bg-slate-100 transition-all duration-200"
              title="Fit to screen"
            >
              <Maximize className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetCanvas} 
              className="h-9 w-9 p-0 hover:bg-slate-100 transition-all duration-200"
              title="Reset view"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant={showGrid ? "default" : "ghost"}
              size="sm"
              onClick={() => setShowGrid(!showGrid)}
              className="h-9 w-9 p-0 transition-all duration-200"
              title="Toggle grid"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Node Stats */}
        <div className="bg-white/95 border border-slate-200 rounded-xl p-3 backdrop-blur-sm shadow-lg">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              {nodes.length} Nodes
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              {connections.length} Connections
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Status Indicators */}
      {connectionMode.active && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-xl backdrop-blur-sm animate-pulse">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 animate-spin" />
              <span className="font-semibold">Connection Mode Active</span>
              <span className="text-blue-100 text-sm">Click target node to connect</span>
            </div>
          </div>
        </div>
      )}

      {isPanning && (
        <div className="absolute top-6 right-6">
          <Badge variant="secondary" className="px-4 py-2 bg-white/90 backdrop-blur-sm shadow-lg">
            <Move className="h-4 w-4 mr-2" />
            Panning Canvas
          </Badge>
        </div>
      )}

      {selectedConnection && (
        <div className="absolute top-6 right-6">
          <Badge variant="outline" className="px-4 py-2 bg-white/90 backdrop-blur-sm shadow-lg border-blue-200">
            <Link className="h-4 w-4 mr-2 text-blue-500" />
            Connection Selected
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                deleteConnection(selectedConnection)
                setSelectedConnection(null)
              }}
              className="ml-2 h-5 w-5 p-0 text-red-500 hover:bg-red-50"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        </div>
      )}

      {/* Keyboard Shortcuts Helper */}
      <div className="absolute bottom-6 right-6">
        <div className="bg-white/95 border border-slate-200 rounded-xl p-4 backdrop-blur-sm shadow-lg max-w-xs">
          <h3 className="font-semibold text-sm text-slate-700 mb-2 flex items-center gap-2">
            <span>Quick Actions</span>
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          </h3>
          <div className="space-y-1 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Escape</span>
              <span>Cancel action</span>
            </div>
            <div className="flex justify-between">
              <span>Delete</span>
              <span>Remove selected</span>
            </div>
            <div className="flex justify-between">
              <span>Ctrl + 0</span>
              <span>Reset view</span>
            </div>
            <div className="flex justify-between">
              <span>Ctrl + Wheel</span>
              <span>Zoom</span>
            </div>
            <div className="flex justify-between">
              <span>Middle Click</span>
              <span>Pan canvas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Animation Overlay */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-slate-700 mb-2">Ready to Build</h2>
            <p className="text-slate-500">Drag nodes from the sidebar to start creating your workflow</p>
          </div>
        </div>
      )}

      {/* Subtle Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
    </div>
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