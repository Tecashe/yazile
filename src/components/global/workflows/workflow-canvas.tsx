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
//     disconnectNodes,
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

//   // Smooth bezier curve for connections
//   const getConnectionPath = (from: { x: number; y: number }, to: { x: number; y: number }) => {
//     const dx = to.x - from.x
//     const dy = to.y - from.y
    
//     // Dynamic control point offset based on distance
//     const controlOffset = Math.max(50, Math.abs(dx) * 0.6)
    
//     // Create smooth S-curve
//     const cp1x = from.x + controlOffset
//     const cp1y = from.y
//     const cp2x = to.x - controlOffset  
//     const cp2y = to.y
    
//     return `M ${from.x} ${from.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${to.x} ${to.y}`
//   }

//   const deleteConnection = (connectionId: string) => {
//     const connection = connections.find(c => c.id === connectionId)
//     if (connection && disconnectNodes) {
//       disconnectNodes(connection.fromNodeId, connection.toNodeId, connection.fromHandle)
//     }
//   }

//   // Calculate canvas bounds for SVG
//   const getCanvasBounds = () => {
//     if (nodes.length === 0) return { minX: 0, minY: 0, width: 2000, height: 2000 }
    
//     const positions = nodes.map(n => n.position)
//     const minX = Math.min(...positions.map(p => p.x)) - 200
//     const minY = Math.min(...positions.map(p => p.y)) - 200
//     const maxX = Math.max(...positions.map(p => p.x)) + 400
//     const maxY = Math.max(...positions.map(p => p.y)) + 300
    
//     return {
//       minX,
//       minY,
//       width: maxX - minX,
//       height: maxY - minY
//     }
//   }

//   const bounds = getCanvasBounds()

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
//           {/* Grid */}
//           {showGrid && (
//             <div
//               className="absolute inset-0 opacity-30"
//               style={{
//                 left: bounds.minX,
//                 top: bounds.minY,
//                 width: bounds.width,
//                 height: bounds.height,
//                 backgroundImage: `
//                   linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
//                   linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
//                 `,
//                 backgroundSize: "20px 20px",
//               }}
//             />
//           )}

//           {/* Connection Lines SVG */}
//           <svg
//             className="absolute pointer-events-none"
//             style={{ 
//               left: bounds.minX,
//               top: bounds.minY,
//               width: bounds.width,
//               height: bounds.height,
//               position: "absolute",
//               zIndex: 1,
//               overflow: "visible"
//             }}
//             viewBox={`0 0 ${bounds.width} ${bounds.height}`}
//           >
//             <defs>
//               <marker 
//                 id="arrowhead" 
//                 markerWidth="10" 
//                 markerHeight="7" 
//                 refX="9" 
//                 refY="3.5" 
//                 orient="auto"
//               >
//                 <polygon 
//                   points="0 0, 10 3.5, 0 7" 
//                   fill="#6b7280" 
//                   className="transition-colors duration-200"
//                 />
//               </marker>
//               <marker 
//                 id="arrowhead-hover" 
//                 markerWidth="10" 
//                 markerHeight="7" 
//                 refX="9" 
//                 refY="3.5" 
//                 orient="auto"
//               >
//                 <polygon 
//                   points="0 0, 10 3.5, 0 7" 
//                   fill="#3b82f6"
//                 />
//               </marker>
//             </defs>

//             {/* Render all connections */}
//             {connections.map((connection) => {
//               const fromNode = nodes.find((n) => n.id === connection.fromNodeId)
//               const toNode = nodes.find((n) => n.id === connection.toNodeId)
              
//               if (!fromNode || !toNode) return null

//               // Calculate connection points relative to SVG viewBox
//               const fromPoint = {
//                 x: fromNode.position.x + 240 - bounds.minX, // Right edge of from node
//                 y: fromNode.position.y + 50 - bounds.minY,   // Middle of from node
//               }
//               const toPoint = {
//                 x: toNode.position.x - bounds.minX,         // Left edge of to node
//                 y: toNode.position.y + 50 - bounds.minY,    // Middle of to node
//               }

//               const pathD = getConnectionPath(fromPoint, toPoint)

//               return (
//                 <g key={connection.id}>
//                   {/* Wider invisible path for easier clicking */}
//                   <path
//                     d={pathD}
//                     stroke="transparent"
//                     strokeWidth="20"
//                     fill="none"
//                     className="cursor-pointer pointer-events-auto"
//                     onClick={() => deleteConnection(connection.id)}
//                   />
//                   {/* Visible connection line */}
//                   <path
//                     d={pathD}
//                     stroke="#6b7280"
//                     strokeWidth="2"
//                     fill="none"
//                     markerEnd="url(#arrowhead)"
//                     className="pointer-events-none hover:stroke-blue-500 transition-colors duration-200"
//                     style={{
//                       filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
//                     }}
//                   />
//                 </g>
//               )
//             })}

//             {/* Live connection preview */}
//             {connectionMode.active && connectionMode.fromNodeId && (
//               <path
//                 d={getConnectionPath(
//                   {
//                     x: nodes.find((n) => n.id === connectionMode.fromNodeId)?.position.x! + 240 - bounds.minX,
//                     y: nodes.find((n) => n.id === connectionMode.fromNodeId)?.position.y! + 50 - bounds.minY
//                   },
//                   {
//                     x: mousePosition.x - bounds.minX,
//                     y: mousePosition.y - bounds.minY
//                   }
//                 )}
//                 stroke="#3b82f6"
//                 strokeWidth="3"
//                 strokeDasharray="8,4"
//                 fill="none"
//                 opacity="0.8"
//                 className="pointer-events-none"
//                 style={{
//                   filter: 'drop-shadow(0 2px 8px rgba(59,130,246,0.3))',
//                   animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
//                 }}
//               />
//             )}
//           </svg>

//           {/* Nodes */}
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

//       {/* Controls */}
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

//       {/* Status badges */}
//       {connectionMode.active && (
//         <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
//           <Badge variant="default" className="bg-primary text-primary-foreground animate-pulse">
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

//       {/* Debug info */}
//       <div className="absolute top-4 left-4">
//         <Badge variant="outline">
//           Connections: {connections.length} | Nodes: {nodes.length}
//         </Badge>
//       </div>

//       <style jsx>{`
//         @keyframes pulse {
//           0%, 100% {
//             opacity: 0.8;
//           }
//           50% {
//             opacity: 0.4;
//           }
//         }
//       `}</style>
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

"use client"

import type React from "react"
import { useRef, useCallback, useState, useEffect } from "react"
import { useWorkflowStore, type WorkflowNode } from "@/lib/workflow-store-production"
import { WorkflowNodeComponent } from "./workflow-node"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  RotateCcw, 
  Grid3X3, 
  MousePointer, 
  Move, 
  Trash2,
  Palette,
  Settings,
  Spline,
  Route,
  Zap,
  Eye,
  EyeOff
} from "lucide-react"

interface ControlPoint {
  x: number
  y: number
}

interface ConnectionStyle {
  color: string
  width: number
  style: 'solid' | 'dashed' | 'dotted'
  animated: boolean
}

interface EnhancedConnection {
  id: string
  fromNodeId: string
  toNodeId: string
  fromHandle?: string
  toHandle?: string
  controlPoints?: ControlPoint[]
  style: ConnectionStyle
  label?: string
  hidden?: boolean
}

export function WorkflowCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isPanning, setIsPanning] = useState(false)
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 })
  const [showGrid, setShowGrid] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  // Connection editing states
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null)
  const [isEditingPath, setIsEditingPath] = useState(false)
  const [draggedControlPoint, setDraggedControlPoint] = useState<{ connectionId: string, index: number } | null>(null)
  const [showConnectionPanel, setShowConnectionPanel] = useState(false)
  const [tempControlPoint, setTempControlPoint] = useState<{ x: number, y: number } | null>(null)

  // Enhanced connections with styling
  const [enhancedConnections, setEnhancedConnections] = useState<EnhancedConnection[]>([])

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

  // Sync enhanced connections with store connections
  useEffect(() => {
    const newEnhanced = connections.map(conn => {
      const existing = enhancedConnections.find(ec => ec.id === conn.id)
      return existing || {
        ...conn,
        style: {
          color: '#6b7280',
          width: 2,
          style: 'solid' as const,
          animated: false
        },
        controlPoints: []
      }
    })
    setEnhancedConnections(newEnhanced)
  }, [connections])

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

      // Handle control point dragging
      if (draggedControlPoint) {
        const rect = canvasRef.current?.getBoundingClientRect()
        if (rect) {
          const newPos = {
            x: (e.clientX - rect.left - canvasOffset.x) / canvasZoom,
            y: (e.clientY - rect.top - canvasOffset.y) / canvasZoom,
          }
          
          setEnhancedConnections(prev => 
            prev.map(conn => {
              if (conn.id === draggedControlPoint.connectionId) {
                const newControlPoints = [...(conn.controlPoints || [])]
                newControlPoints[draggedControlPoint.index] = newPos
                return { ...conn, controlPoints: newControlPoints }
              }
              return conn
            })
          )
        }
      }
    }

    document.addEventListener("mousemove", handleMouseMove)
    return () => document.removeEventListener("mousemove", handleMouseMove)
  }, [connectionMode.active, canvasOffset, canvasZoom, draggedControlPoint])

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
      setDraggedControlPoint(null)
    }

    if (isPanning || draggedControlPoint) {
      document.addEventListener("mousemove", handleGlobalMouseMove)
      document.addEventListener("mouseup", handleGlobalMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove)
      document.removeEventListener("mouseup", handleGlobalMouseUp)
    }
  }, [isPanning, lastPanPoint, canvasOffset, setCanvasOffset, draggedControlPoint])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (connectionMode.active) {
          cancelConnection()
        }
        if (isEditingPath) {
          setIsEditingPath(false)
          setSelectedConnection(null)
        }
      }
      if (e.key === "Delete") {
        if (selectedConnection) {
          deleteConnection(selectedConnection)
        } else if (selectedNode) {
          deleteNode(selectedNode)
        }
      }
      if (e.ctrlKey && e.key === "0") {
        e.preventDefault()
        resetCanvas()
      }
      if (e.key === "e" && selectedConnection) {
        setIsEditingPath(!isEditingPath)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [connectionMode.active, cancelConnection, selectedNode, deleteNode, resetCanvas, selectedConnection, isEditingPath])

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === canvasRef.current || (e.target as Element).classList.contains("canvas-background")) {
        setSelectedNode(null)
        setSelectedConnection(null)
        setShowConnectionPanel(false)
        if (connectionMode.active) {
          cancelConnection()
        }
        if (isEditingPath) {
          setIsEditingPath(false)
        }
      }
    },
    [setSelectedNode, connectionMode.active, cancelConnection, isEditingPath],
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
        maxX: Math.max(acc.maxX, node.position.x + 240),
        maxY: Math.max(acc.maxY, node.position.y + 100),
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

  // Enhanced bezier path with custom control points
  const getConnectionPath = (
    from: { x: number; y: number }, 
    to: { x: number; y: number },
    controlPoints?: ControlPoint[]
  ) => {
    if (!controlPoints || controlPoints.length === 0) {
      // Default smooth curve
      const dx = to.x - from.x
      const controlOffset = Math.max(50, Math.abs(dx) * 0.6)
      
      const cp1x = from.x + controlOffset
      const cp1y = from.y
      const cp2x = to.x - controlOffset  
      const cp2y = to.y
      
      return `M ${from.x} ${from.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${to.x} ${to.y}`
    } else {
      // Custom path with control points
      let path = `M ${from.x} ${from.y}`
      
      if (controlPoints.length === 1) {
        const cp = controlPoints[0]
        path += ` Q ${cp.x} ${cp.y}, ${to.x} ${to.y}`
      } else if (controlPoints.length === 2) {
        const cp1 = controlPoints[0]
        const cp2 = controlPoints[1]
        path += ` C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${to.x} ${to.y}`
      } else {
        // Multiple control points - create smooth curve through all
        path += ` Q ${controlPoints[0].x} ${controlPoints[0].y}, ${controlPoints[0].x} ${controlPoints[0].y}`
        for (let i = 1; i < controlPoints.length; i++) {
          const cp = controlPoints[i]
          path += ` T ${cp.x} ${cp.y}`
        }
        path += ` T ${to.x} ${to.y}`
      }
      
      return path
    }
  }

  const deleteConnection = (connectionId: string) => {
    const connection = connections.find(c => c.id === connectionId)
    if (connection && disconnectNodes) {
      disconnectNodes(connection.fromNodeId, connection.toNodeId, connection.fromHandle)
    }
    setEnhancedConnections(prev => prev.filter(c => c.id !== connectionId))
    setSelectedConnection(null)
    setShowConnectionPanel(false)
  }

  const updateConnectionStyle = (connectionId: string, updates: Partial<ConnectionStyle>) => {
    setEnhancedConnections(prev => 
      prev.map(conn => 
        conn.id === connectionId 
          ? { ...conn, style: { ...conn.style, ...updates } }
          : conn
      )
    )
  }

  const addControlPoint = (connectionId: string, x: number, y: number) => {
    setEnhancedConnections(prev => 
      prev.map(conn => 
        conn.id === connectionId 
          ? { ...conn, controlPoints: [...(conn.controlPoints || []), { x, y }] }
          : conn
      )
    )
  }

  const toggleConnectionVisibility = (connectionId: string) => {
    setEnhancedConnections(prev => 
      prev.map(conn => 
        conn.id === connectionId 
          ? { ...conn, hidden: !conn.hidden }
          : conn
      )
    )
  }

  // Calculate canvas bounds for SVG
  const getCanvasBounds = () => {
    if (nodes.length === 0) return { minX: 0, minY: 0, width: 2000, height: 2000 }
    
    const positions = nodes.map(n => n.position)
    const minX = Math.min(...positions.map(p => p.x)) - 200
    const minY = Math.min(...positions.map(p => p.y)) - 200
    const maxX = Math.max(...positions.map(p => p.x)) + 400
    const maxY = Math.max(...positions.map(p => p.y)) + 300
    
    return {
      minX,
      minY,
      width: maxX - minX,
      height: maxY - minY
    }
  }

  const bounds = getCanvasBounds()
  const selectedConnectionData = enhancedConnections.find(c => c.id === selectedConnection)

  return (
    <div className="relative w-full h-full bg-background overflow-hidden">
      <div
        ref={canvasRef}
        className="absolute inset-0 canvas-background"
        onClick={handleCanvasClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
        style={{
          cursor: isPanning ? "grabbing" : 
                  connectionMode.active ? "crosshair" : 
                  isEditingPath ? "crosshair" : "grab",
        }}
      >
        <div
          className="absolute"
          style={{
            transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${canvasZoom})`,
            transformOrigin: "0 0",
          }}
        >
          {/* Grid */}
          {showGrid && (
            <div
              className="absolute inset-0 opacity-30"
              style={{
                left: bounds.minX,
                top: bounds.minY,
                width: bounds.width,
                height: bounds.height,
                backgroundImage: `
                  linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                  linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px",
              }}
            />
          )}

          {/* Connection Lines SVG */}
          <svg
            className="absolute"
            style={{ 
              left: bounds.minX,
              top: bounds.minY,
              width: bounds.width,
              height: bounds.height,
              position: "absolute",
              zIndex: 1,
              overflow: "visible"
            }}
            viewBox={`0 0 ${bounds.width} ${bounds.height}`}
          >
            <defs>
              {/* Standard markers */}
              <marker 
                id="arrowhead" 
                markerWidth="10" 
                markerHeight="7" 
                refX="9" 
                refY="3.5" 
                orient="auto"
              >
                <polygon 
                  points="0 0, 10 3.5, 0 7" 
                  fill="#6b7280" 
                />
              </marker>
              
              {/* Colored markers for different connection colors */}
              {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'].map(color => (
                <marker 
                  key={color}
                  id={`arrowhead-${color.replace('#', '')}`}
                  markerWidth="10" 
                  markerHeight="7" 
                  refX="9" 
                  refY="3.5" 
                  orient="auto"
                >
                  <polygon 
                    points="0 0, 10 3.5, 0 7" 
                    fill={color}
                  />
                </marker>
              ))}

              {/* Animated flow patterns */}
              <pattern id="flowPattern" patternUnits="userSpaceOnUse" width="20" height="20">
                <circle cx="5" cy="10" r="2" fill="#3b82f6" opacity="0.6">
                  <animate attributeName="cx" values="5;15;5" dur="2s" repeatCount="indefinite" />
                </circle>
              </pattern>
            </defs>

            {/* Render all connections */}
            {enhancedConnections.map((connection) => {
              if (connection.hidden) return null
              
              const fromNode = nodes.find((n) => n.id === connection.fromNodeId)
              const toNode = nodes.find((n) => n.id === connection.toNodeId)
              
              if (!fromNode || !toNode) return null

              // Calculate connection points relative to SVG viewBox
              const fromPoint = {
                x: fromNode.position.x + 240 - bounds.minX,
                y: fromNode.position.y + 50 - bounds.minY,
              }
              const toPoint = {
                x: toNode.position.x - bounds.minX,
                y: toNode.position.y + 50 - bounds.minY,
              }

              const pathD = getConnectionPath(fromPoint, toPoint, connection.controlPoints)
              const isSelected = selectedConnection === connection.id
              const strokeColor = connection.style.color
              const strokeWidth = connection.style.width + (isSelected ? 1 : 0)
              const strokeDasharray = connection.style.style === 'dashed' ? '8,4' : 
                                     connection.style.style === 'dotted' ? '2,3' : 'none'

              return (
                <g key={connection.id}>
                  {/* Wider invisible path for easier clicking */}
                  <path
                    d={pathD}
                    stroke="transparent"
                    strokeWidth="20"
                    fill="none"
                    className="cursor-pointer pointer-events-auto"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedConnection(connection.id)
                      setShowConnectionPanel(true)
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation()
                      const rect = canvasRef.current?.getBoundingClientRect()
                      if (rect && isEditingPath) {
                        const clickX = (e.clientX - rect.left - canvasOffset.x) / canvasZoom - bounds.minX
                        const clickY = (e.clientY - rect.top - canvasOffset.y) / canvasZoom - bounds.minY
                        addControlPoint(connection.id, clickX, clickY)
                      }
                    }}
                  />
                  
                  {/* Selection highlight */}
                  {isSelected && (
                    <path
                      d={pathD}
                      stroke="#3b82f6"
                      strokeWidth={strokeWidth + 4}
                      fill="none"
                      opacity="0.3"
                      className="pointer-events-none"
                    />
                  )}

                  {/* Animated background for flowing connections */}
                  {connection.style.animated && (
                    <path
                      d={pathD}
                      stroke="url(#flowPattern)"
                      strokeWidth={strokeWidth + 2}
                      fill="none"
                      opacity="0.6"
                      className="pointer-events-none"
                    />
                  )}
                  
                  {/* Main connection line */}
                  <path
                    d={pathD}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    fill="none"
                    markerEnd={`url(#arrowhead-${strokeColor.replace('#', '')})`}
                    className="pointer-events-none transition-all duration-200"
                    style={{
                      filter: isSelected ? 'drop-shadow(0 4px 12px rgba(59,130,246,0.4))' : 
                              'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                    }}
                  />

                  {/* Control points for editing */}
                  {isEditingPath && isSelected && connection.controlPoints?.map((cp, index) => (
                    <g key={index}>
                      <circle
                        cx={cp.x}
                        cy={cp.y}
                        r="6"
                        fill="#3b82f6"
                        stroke="white"
                        strokeWidth="2"
                        className="cursor-move pointer-events-auto"
                        onMouseDown={(e) => {
                          e.stopPropagation()
                          setDraggedControlPoint({ connectionId: connection.id, index })
                        }}
                      />
                      <circle
                        cx={cp.x}
                        cy={cp.y}
                        r="3"
                        fill="white"
                        className="pointer-events-none"
                      />
                    </g>
                  ))}

                  {/* Connection label */}
                  {connection.label && (
                    <text
                      x={(fromPoint.x + toPoint.x) / 2}
                      y={(fromPoint.y + toPoint.y) / 2 - 10}
                      fill={strokeColor}
                      fontSize="12"
                      textAnchor="middle"
                      className="pointer-events-none select-none"
                      style={{ textShadow: '0 0 3px white' }}
                    >
                      {connection.label}
                    </text>
                  )}
                </g>
              )
            })}

            {/* Live connection preview */}
            {connectionMode.active && connectionMode.fromNodeId && (
              <path
                d={getConnectionPath(
                  {
                    x: nodes.find((n) => n.id === connectionMode.fromNodeId)?.position.x! + 240 - bounds.minX,
                    y: nodes.find((n) => n.id === connectionMode.fromNodeId)?.position.y! + 50 - bounds.minY
                  },
                  {
                    x: mousePosition.x - bounds.minX,
                    y: mousePosition.y - bounds.minY
                  }
                )}
                stroke="#3b82f6"
                strokeWidth="3"
                strokeDasharray="8,4"
                fill="none"
                opacity="0.8"
                className="pointer-events-none"
                style={{
                  filter: 'drop-shadow(0 2px 8px rgba(59,130,246,0.3))',
                }}
              />
            )}
          </svg>

          {/* Nodes */}
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

      {/* Connection Properties Panel */}
      {showConnectionPanel && selectedConnectionData && (
        <div className="absolute top-4 right-4 w-80">
          <Card className="p-4 backdrop-blur-sm bg-card/95 border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="font-medium">Connection Properties</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => toggleConnectionVisibility(selectedConnectionData.id)}
                >
                  {selectedConnectionData.hidden ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setIsEditingPath(!isEditingPath)}
                >
                  <Spline className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-destructive"
                  onClick={() => deleteConnection(selectedConnectionData.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Color Picker */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {['#6b7280', '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'].map(color => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedConnectionData.style.color === color ? 'border-foreground scale-110' : 'border-border'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => updateConnectionStyle(selectedConnectionData.id, { color })}
                    />
                  ))}
                </div>
              </div>

              {/* Width Slider */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Width ({selectedConnectionData.style.width}px)
                </Label>
                <Slider
                  value={[selectedConnectionData.style.width]}
                  onValueChange={([width]) => updateConnectionStyle(selectedConnectionData.id, { width })}
                  min={1}
                  max={8}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Style Options */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Style</Label>
                <div className="flex gap-2">
                  {[
                    { value: 'solid', label: 'Solid' },
                    { value: 'dashed', label: 'Dashed' },
                    { value: 'dotted', label: 'Dotted' }
                  ].map(({ value, label }) => (
                    <Button
                      key={value}
                      variant={selectedConnectionData.style.style === value ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateConnectionStyle(selectedConnectionData.id, { style: value as any })}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Animation Toggle */}
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Animated Flow</Label>
                <Button
                  variant={selectedConnectionData.style.animated ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateConnectionStyle(selectedConnectionData.id, { 
                    animated: !selectedConnectionData.style.animated 
                  })}
                >
                  <Zap className="h-3 w-3 mr-1" />
                  {selectedConnectionData.style.animated ? 'On' : 'Off'}
                </Button>
              </div>

              <Separator />

              {/* Path Editing */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Path Control</Label>
                  <Badge variant={isEditingPath ? "default" : "outline"}>
                    <Route className="h-3 w-3 mr-1" />
                    {isEditingPath ? 'Editing' : 'View Only'}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  {isEditingPath 
                    ? 'Double-click on the line to add control points. Drag existing points to reshape the path.'
                    : 'Click "Edit Path" to modify the connection route.'
                  }
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={isEditingPath ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsEditingPath(!isEditingPath)}
                  >
                    <Spline className="h-3 w-3 mr-1" />
                    {isEditingPath ? 'Done' : 'Edit Path'}
                  </Button>
                  {selectedConnectionData.controlPoints && selectedConnectionData.controlPoints.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEnhancedConnections(prev => 
                          prev.map(conn => 
                            conn.id === selectedConnectionData.id 
                              ? { ...conn, controlPoints: [] }
                              : conn
                          )
                        )
                      }}
                    >
                      Reset Path
                    </Button>
                  )}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Control Points: {selectedConnectionData.controlPoints?.length || 0}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Main Controls */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-2">
        <div className="bg-card/95 border border-border rounded-lg p-2 backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={handleZoomOut} className="h-8 w-8 p-0">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <div className="px-2 text-xs font-mono min-w-[50px] text-center">{Math.round(canvasZoom * 100)}%</div>
            <Button variant="ghost" size="sm" onClick={handleZoomIn} className="h-8 w-8 p-0">
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="bg-card/95 border border-border rounded-lg p-2 backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={handleFitToScreen} className="h-8 w-8 p-0">
              <Maximize className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={resetCanvas} className="h-8 w-8 p-0">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant={showGrid ? "default" : "ghost"}
              size="sm"
              onClick={() => setShowGrid(!showGrid)}
              className="h-8 w-8 p-0"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Connection Tools */}
      {selectedConnection && (
        <div className="absolute bottom-4 right-4">
          <Card className="p-2 backdrop-blur-sm bg-card/95 border">
            <div className="flex items-center gap-2">
              <Button
                variant={isEditingPath ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsEditingPath(!isEditingPath)}
                className="h-8"
              >
                <Spline className="h-3 w-3 mr-1" />
                {isEditingPath ? 'Done' : 'Edit'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConnectionPanel(!showConnectionPanel)}
                className="h-8"
              >
                <Palette className="h-3 w-3 mr-1" />
                Style
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteConnection(selectedConnection)}
                className="h-8 text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Status badges */}
      {connectionMode.active && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <Badge variant="default" className="bg-primary text-primary-foreground animate-pulse">
            <MousePointer className="h-3 w-3 mr-1" />
            Click target node to connect
          </Badge>
        </div>
      )}

      {isEditingPath && selectedConnection && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
          <Badge variant="secondary" className="animate-pulse">
            <Spline className="h-3 w-3 mr-1" />
            Double-click line to add control points • Drag points to reshape • Press E to toggle
          </Badge>
        </div>
      )}

      {isPanning && (
        <div className="absolute top-4 right-4">
          <Badge variant="secondary">
            <Move className="h-3 w-3 mr-1" />
            Panning
          </Badge>
        </div>
      )}

      {/* Info Panel */}
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        <Badge variant="outline">
          Connections: {connections.filter(c => !enhancedConnections.find(ec => ec.id === c.id)?.hidden).length} / {connections.length} | Nodes: {nodes.length}
        </Badge>
        {selectedConnection && (
          <Badge variant="secondary">
            <Settings className="h-3 w-3 mr-1" />
            Connection Selected
          </Badge>
        )}
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="absolute bottom-4 right-4">
        <Card className="p-3 backdrop-blur-sm bg-card/95 border max-w-xs">
          <div className="text-xs space-y-1">
            <div className="font-medium mb-2">Shortcuts:</div>
            <div><kbd className="px-1 py-0.5 bg-muted rounded text-xs">E</kbd> - Toggle path editing</div>
            <div><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Del</kbd> - Delete selected</div>
            <div><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Esc</kbd> - Cancel/Exit modes</div>
            <div><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+0</kbd> - Reset view</div>
            <div><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Double-click</kbd> - Add control point</div>
          </div>
        </Card>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.8;
          }
          50% {
            opacity: 0.4;
          }
        }
        
        @keyframes flow {
          0% {
            stroke-dashoffset: 100;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        
        .connection-flow {
          animation: flow 2s linear infinite;
        }
      `}</style>
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