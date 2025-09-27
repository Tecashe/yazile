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
import { WorkflowNodeComponent } from "./workflow-node"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ZoomIn, ZoomOut, Maximize, RotateCcw, Grid3X3, MousePointer, Move } from "lucide-react"

export function WorkflowCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isPanning, setIsPanning] = useState(false)
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 })
  const [showGrid, setShowGrid] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

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
      if (e.key === "Escape" && connectionMode.active) {
        cancelConnection()
      }
      if (e.key === "Delete" && selectedNode) {
        deleteNode(selectedNode)
      }
      if (e.ctrlKey && e.key === "0") {
        e.preventDefault()
        resetCanvas()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [connectionMode.active, cancelConnection, selectedNode, deleteNode, resetCanvas])

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === canvasRef.current || (e.target as Element).classList.contains("canvas-background")) {
        setSelectedNode(null)
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

  // Simple bezier path
  const getConnectionPath = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const dx = to.x - from.x
    const controlOffset = Math.abs(dx) * 0.5
    return `M ${from.x} ${from.y} C ${from.x + controlOffset} ${from.y}, ${to.x - controlOffset} ${to.y}, ${to.x} ${to.y}`
  }

  const deleteConnection = (connectionId: string) => {
    const connection = connections.find(c => c.id === connectionId)
    if (connection && disconnectNodes) {
      disconnectNodes(connection.fromNodeId, connection.toNodeId, connection.fromHandle)
    }
  }

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
          {/* Grid */}
          {showGrid && (
            <div
              className="absolute inset-0 opacity-30"
              style={{
                left: -5000,
                top: -5000,
                width: 10000,
                height: 10000,
                backgroundImage: `
                  linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                  linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px",
              }}
            />
          )}

          {/* Connection Lines - Fixed positioning */}
          <svg
            className="absolute pointer-events-auto"
            style={{ 
              left: 0, 
              top: 0, 
              width: "100%", 
              height: "100%",
              position: "absolute",
              zIndex: 1
            }}
            viewBox="0 0 3000 3000"
          >
            <defs>
              <marker 
                id="arrowhead" 
                markerWidth="10" 
                markerHeight="7" 
                refX="9" 
                refY="3.5" 
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
              </marker>
            </defs>

            {/* Render all connections */}
            {connections.map((connection) => {
              const fromNode = nodes.find((n) => n.id === connection.fromNodeId)
              const toNode = nodes.find((n) => n.id === connection.toNodeId)
              
              if (!fromNode || !toNode) return null

              const fromPoint = {
                x: fromNode.position.x + 240, // Right edge of from node
                y: fromNode.position.y + 50,  // Middle of from node
              }
              const toPoint = {
                x: toNode.position.x,         // Left edge of to node
                y: toNode.position.y + 50,    // Middle of to node
              }

              const pathD = getConnectionPath(fromPoint, toPoint)

              return (
                <g key={connection.id}>
                  {/* Wider invisible path for easier clicking */}
                  <path
                    d={pathD}
                    stroke="transparent"
                    strokeWidth="15"
                    fill="none"
                    className="cursor-pointer"
                    onClick={() => deleteConnection(connection.id)}
                  />
                  {/* Visible connection line */}
                  <path
                    d={pathD}
                    stroke="#6b7280"
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#arrowhead)"
                    className="pointer-events-none hover:stroke-blue-500 transition-colors"
                  />
                </g>
              )
            })}

            {/* Live connection preview */}
            {connectionMode.active && connectionMode.fromNodeId && (
              <path
                d={`M ${nodes.find((n) => n.id === connectionMode.fromNodeId)?.position.x! + 240} ${
                  nodes.find((n) => n.id === connectionMode.fromNodeId)?.position.y! + 50
                } L ${mousePosition.x} ${mousePosition.y}`}
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="5,5"
                fill="none"
                opacity="0.7"
                className="pointer-events-none"
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

      {/* Controls */}
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

      {/* Status badges */}
      {connectionMode.active && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <Badge variant="default" className="bg-primary text-primary-foreground">
            <MousePointer className="h-3 w-3 mr-1" />
            Click target node to connect
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

      {/* Debug info */}
      <div className="absolute top-4 left-4">
        <Badge variant="outline">
          Connections: {connections.length} | Nodes: {nodes.length}
        </Badge>
      </div>
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