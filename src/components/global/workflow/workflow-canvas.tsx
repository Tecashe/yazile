// "use client"

// import type React from "react"

// import { useRef, useCallback, useState, useEffect } from "react"
// import { useWorkflowStore, type WorkflowNode } from "@/lib/workflow-store"
// import { WorkflowNodeComponent } from "./workflow-node"

// export function WorkflowCanvas() {
//   const canvasRef = useRef<HTMLDivElement>(null)
//   const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 })
//   const [zoom, setZoom] = useState(1)
//   const [isPanning, setIsPanning] = useState(false)
//   const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 })

//   const { nodes, selectedNode, setSelectedNode, updateNode, deleteNode, connectNodes, addNode } = useWorkflowStore()

//   useEffect(() => {
//     const handleGlobalMouseMove = (e: MouseEvent) => {
//       if (isPanning) {
//         const deltaX = e.clientX - lastPanPoint.x
//         const deltaY = e.clientY - lastPanPoint.y

//         setCanvasOffset((prev) => ({
//           x: prev.x + deltaX,
//           y: prev.y + deltaY,
//         }))

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
//   }, [isPanning, lastPanPoint])

//   const handleCanvasClick = useCallback(
//     (e: React.MouseEvent) => {
//       if (e.target === canvasRef.current) {
//         setSelectedNode(null)
//       }
//     },
//     [setSelectedNode],
//   )

//   const handleDrop = useCallback(
//     (e: React.DragEvent) => {
//       e.preventDefault()
//       const rect = canvasRef.current?.getBoundingClientRect()
//       if (!rect) return

//       try {
//         const data = JSON.parse(e.dataTransfer.getData("application/json"))
//         const position = {
//           x: (e.clientX - rect.left - canvasOffset.x) / zoom - 100,
//           y: (e.clientY - rect.top - canvasOffset.y) / zoom - 50,
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
//     [canvasOffset, zoom, addNode],
//   )

//   const handleDragOver = useCallback((e: React.DragEvent) => {
//     e.preventDefault()
//   }, [])

//   const handleMouseDown = useCallback((e: React.MouseEvent) => {
//     if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
//       // Middle mouse or Ctrl+click
//       setIsPanning(true)
//       setLastPanPoint({ x: e.clientX, y: e.clientY })
//       e.preventDefault()
//     }
//   }, [])

//   const handleWheel = useCallback((e: React.WheelEvent) => {
//     if (e.ctrlKey) {
//       e.preventDefault()
//       const delta = e.deltaY > 0 ? 0.9 : 1.1
//       setZoom((prev) => Math.max(0.1, Math.min(3, prev * delta)))
//     }
//   }, [])

//   const handleNodeDrag = useCallback(
//     (id: string, position: { x: number; y: number }) => {
//       updateNode(id, { position })
//     },
//     [updateNode],
//   )

//   const getConnectionPath = (from: { x: number; y: number }, to: { x: number; y: number }) => {
//     const dx = to.x - from.x
//     const controlPointOffset = Math.abs(dx) * 0.5
//     return `M ${from.x} ${from.y} C ${from.x + controlPointOffset} ${from.y}, ${to.x - controlPointOffset} ${to.y}, ${to.x} ${to.y}`
//   }

//   return (
//     <div
//       ref={canvasRef}
//       className="relative w-full h-full bg-muted/20 overflow-hidden cursor-grab active:cursor-grabbing"
//       onClick={handleCanvasClick}
//       onDrop={handleDrop}
//       onDragOver={handleDragOver}
//       onMouseDown={handleMouseDown}
//       onWheel={handleWheel}
//     >
//       {/* Canvas Content */}
//       <div
//         className="absolute inset-0"
//         style={{
//           transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${zoom})`,
//           transformOrigin: "0 0",
//         }}
//       >
//         {/* Grid Background */}
//         <div
//           className="absolute inset-0 opacity-30"
//           style={{
//             backgroundImage: `
//               linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
//               linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
//             `,
//             backgroundSize: "20px 20px",
//             width: "200%",
//             height: "200%",
//             left: "-50%",
//             top: "-50%",
//           }}
//         />

//         {/* Connection Lines */}
//         <svg className="absolute inset-0 pointer-events-none" style={{ width: "200%", height: "200%" }}>
//           {nodes.map((node) =>
//             node.connections.map((targetId) => {
//               const targetNode = nodes.find((n) => n.id === targetId)
//               if (!targetNode) return null

//               const fromPoint = { x: node.position.x + 150, y: node.position.y + 50 }
//               const toPoint = { x: targetNode.position.x, y: targetNode.position.y + 50 }

//               return (
//                 <path
//                   key={`${node.id}-${targetId}`}
//                   d={getConnectionPath(fromPoint, toPoint)}
//                   stroke="hsl(var(--primary))"
//                   strokeWidth="2"
//                   fill="none"
//                   markerEnd="url(#arrowhead)"
//                 />
//               )
//             }),
//           )}

//           <defs>
//             <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
//               <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--primary))" />
//             </marker>
//           </defs>
//         </svg>

//         {/* Nodes */}
//         {nodes.map((node) => (
//           <WorkflowNodeComponent
//             key={node.id}
//             node={node}
//             isSelected={selectedNode === node.id}
//             onSelect={() => setSelectedNode(node.id)}
//             onDrag={handleNodeDrag}
//             onDelete={() => deleteNode(node.id)}
//             onConnect={connectNodes}
//           />
//         ))}
//       </div>

//       {/* Canvas Controls */}
//       <div className="absolute bottom-4 right-4 flex flex-col gap-2">
//         <div className="bg-card border rounded-lg p-2 text-sm">Zoom: {Math.round(zoom * 100)}%</div>
//         <div className="bg-card border rounded-lg p-2 text-xs text-muted-foreground">
//           Ctrl+Scroll: Zoom | Ctrl+Drag: Pan
//         </div>
//       </div>
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
import { useWorkflowStore, type WorkflowNode } from "@/lib/workflow-store"
import { WorkflowNodeComponent } from "./workflow-node"

export function WorkflowCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [isPanning, setIsPanning] = useState(false)
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 })

  const {
    nodes,
    connections, // Use connections from store
    selectedNode,
    setSelectedNode,
    updateNode,
    deleteNode,
    connectNodes,
    addNode,
    connectionMode,
    cancelConnection,
  } = useWorkflowStore()

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isPanning) {
        const deltaX = e.clientX - lastPanPoint.x
        const deltaY = e.clientY - lastPanPoint.y

        setCanvasOffset((prev) => ({
          x: prev.x + deltaX,
          y: prev.y + deltaY,
        }))

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
  }, [isPanning, lastPanPoint])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && connectionMode.active) {
        cancelConnection()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [connectionMode.active, cancelConnection])

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === canvasRef.current) {
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
          x: (e.clientX - rect.left - canvasOffset.x) / zoom - 100,
          y: (e.clientY - rect.top - canvasOffset.y) / zoom - 50,
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
    [canvasOffset, zoom, addNode],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      // Middle mouse or Ctrl+click
      setIsPanning(true)
      setLastPanPoint({ x: e.clientX, y: e.clientY })
      e.preventDefault()
    }
  }, [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      setZoom((prev) => Math.max(0.1, Math.min(3, prev * delta)))
    }
  }, [])

  const handleNodeDrag = useCallback(
    (id: string, position: { x: number; y: number }) => {
      updateNode(id, { position })
    },
    [updateNode],
  )

  const getConnectionPath = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const dx = to.x - from.x
    const dy = to.y - from.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    const controlPointOffset = Math.min(Math.max(distance * 0.3, 50), 150)

    return `M ${from.x} ${from.y} C ${from.x + controlPointOffset} ${from.y}, ${to.x - controlPointOffset} ${to.y}, ${to.x} ${to.y}`
  }

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full bg-muted/20 overflow-hidden cursor-grab active:cursor-grabbing"
      onClick={handleCanvasClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
    >
      {/* Canvas Content */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
        }}
      >
        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
            width: "200%",
            height: "200%",
            left: "-50%",
            top: "-50%",
          }}
        />

        {/* Connection Lines */}
        <svg className="absolute inset-0 pointer-events-none" style={{ width: "200%", height: "200%" }}>
          {connections.map((connection) => {
            const fromNode = nodes.find((n) => n.id === connection.fromNodeId)
            const toNode = nodes.find((n) => n.id === connection.toNodeId)
            if (!fromNode || !toNode) return null

            const fromPoint = { x: fromNode.position.x + 240, y: fromNode.position.y + 50 }
            const toPoint = { x: toNode.position.x, y: toNode.position.y + 50 }

            return (
              <g key={connection.id}>
                <path
                  d={getConnectionPath(fromPoint, toPoint)}
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                  className="drop-shadow-sm"
                  opacity="0.8"
                />
                <path
                  d={getConnectionPath(fromPoint, toPoint)}
                  stroke="hsl(var(--primary))"
                  strokeWidth="6"
                  fill="none"
                  opacity="0.1"
                />
              </g>
            )
          })}

          {connectionMode.active && connectionMode.fromNodeId && (
            <g>
              <path
                d={`M ${nodes.find((n) => n.id === connectionMode.fromNodeId)?.position.x! + 240} ${nodes.find((n) => n.id === connectionMode.fromNodeId)?.position.y! + 50} L ${canvasOffset.x} ${canvasOffset.y}`}
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                fill="none"
                strokeDasharray="5,5"
                opacity="0.5"
              />
            </g>
          )}

          <defs>
            <marker id="arrowhead" markerWidth="12" markerHeight="8" refX="11" refY="4" orient="auto">
              <polygon points="0 0, 12 4, 0 8" fill="hsl(var(--primary))" opacity="0.8" />
            </marker>
          </defs>
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

      {/* Canvas Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <div className="bg-card border rounded-lg p-2 text-sm">Zoom: {Math.round(zoom * 100)}%</div>
        {connectionMode.active && (
          <div className="bg-blue-500 text-white border rounded-lg p-2 text-xs">
            Connection Mode: Click target node or press Escape to cancel
          </div>
        )}
        <div className="bg-card border rounded-lg p-2 text-xs text-muted-foreground">
          Ctrl+Scroll: Zoom | Ctrl+Drag: Pan
        </div>
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
