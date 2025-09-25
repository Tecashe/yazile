// "use client"

// import type React from "react"

// import { useRef, useCallback, useState, useEffect } from "react"
// import { useWorkflowStore } from "@/lib/workflow-store"
// import { WorkflowNodeComponent } from "./workflow-node"
// import { Droppable } from "@hello-pangea/dnd"
// import { Button } from "@/components/ui/button"
// import { toast } from "@/hooks/use-toast"

// export function EnhancedWorkflowCanvas() {
//   const canvasRef = useRef<HTMLDivElement>(null)
//   const [connecting, setConnecting] = useState<string | null>(null)
//   const [connectionPreview, setConnectionPreview] = useState<{ x: number; y: number } | null>(null)
//   const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 })
//   const [isDragging, setIsDragging] = useState(false)
//   const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
//   const [zoom, setZoom] = useState(1)

//   const { nodes, selectedNode, setSelectedNode, updateNode, deleteNode, connectNodes, addNode } = useWorkflowStore()

//   const handleCanvasMouseDown = useCallback(
//     (e: React.MouseEvent) => {
//       if (e.target === canvasRef.current && e.button === 0) {
//         setIsDragging(true)
//         setDragStart({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y })
//         setSelectedNode(null)
//         setConnecting(null)
//         setConnectionPreview(null)
//       }
//     },
//     [canvasOffset, setSelectedNode],
//   )

//   const handleCanvasMouseMove = useCallback(
//     (e: React.MouseEvent) => {
//       if (isDragging) {
//         setCanvasOffset({
//           x: e.clientX - dragStart.x,
//           y: e.clientY - dragStart.y,
//         })
//       }

//       if (connecting && canvasRef.current) {
//         const rect = canvasRef.current.getBoundingClientRect()
//         setConnectionPreview({
//           x: e.clientX - rect.left - canvasOffset.x,
//           y: e.clientY - rect.top - canvasOffset.y,
//         })
//       }
//     },
//     [isDragging, dragStart, connecting, canvasOffset],
//   )

//   const handleCanvasMouseUp = useCallback(() => {
//     setIsDragging(false)
//   }, [])

//   const handleDrop = useCallback(
//     (e: React.DragEvent) => {
//       e.preventDefault()
//       const rect = canvasRef.current?.getBoundingClientRect()
//       if (!rect) return

//       try {
//         const data = JSON.parse(e.dataTransfer.getData("application/json"))
//         const position = {
//           x: e.clientX - rect.left - canvasOffset.x - 100,
//           y: e.clientY - rect.top - canvasOffset.y - 40,
//         }

//         const newNode = {
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
//     [canvasOffset, addNode],
//   )

//   const handleDragOver = useCallback((e: React.DragEvent) => {
//     e.preventDefault()
//   }, [])

//   const handleNodeDrag = useCallback(
//     (id: string, position: { x: number; y: number }) => {
//       updateNode(id, { position })
//     },
//     [updateNode],
//   )

//   const handleNodeConnect = useCallback(
//     (fromId: string, toId: string) => {
//       if (fromId !== toId) {
//         connectNodes(fromId, toId)
//       }
//       setConnecting(null)
//       setConnectionPreview(null)
//     },
//     [connectNodes],
//   )

//   const getConnectionPath = (from: { x: number; y: number }, to: { x: number; y: number }) => {
//     const dx = to.x - from.x
//     const dy = to.y - from.y
//     const controlPointOffset = Math.abs(dx) * 0.5

//     return `M ${from.x} ${from.y} C ${from.x + controlPointOffset} ${from.y}, ${to.x - controlPointOffset} ${to.y}, ${to.x} ${to.y}`
//   }

//   const handleWheel = useCallback(
//     (e: React.WheelEvent) => {
//       e.preventDefault()

//       if (e.ctrlKey || e.metaKey) {
//         // Zoom functionality
//         const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1
//         const newZoom = Math.max(0.1, Math.min(3, zoom * zoomFactor))
//         setZoom(newZoom)
//       } else {
//         // Pan functionality
//         setCanvasOffset((prev) => ({
//           x: prev.x - e.deltaX,
//           y: prev.y - e.deltaY,
//         }))
//       }
//     },
//     [zoom],
//   )

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Delete" && selectedNode) {
//         deleteNode(selectedNode)
//       }
//       if (e.key === "Escape") {
//         setSelectedNode(null)
//         setConnecting(null)
//         setConnectionPreview(null)
//       }
//     }

//     window.addEventListener("keydown", handleKeyDown)
//     return () => window.removeEventListener("keydown", handleKeyDown)
//   }, [selectedNode, deleteNode, setSelectedNode])

//   return (
//     <Droppable droppableId="workflow-canvas">
//       {(provided) => (
//         <div
//           ref={canvasRef}
//           {...provided.droppableProps}
//           className="relative w-full h-full overflow-hidden bg-background cursor-grab active:cursor-grabbing"
//           style={{
//             minHeight: "100vh",
//             minWidth: "100vw",
//             height: "100vh",
//             width: "100vw",
//           }}
//           onMouseDown={handleCanvasMouseDown}
//           onMouseMove={handleCanvasMouseMove}
//           onMouseUp={handleCanvasMouseUp}
//           onDrop={handleDrop}
//           onDragOver={handleDragOver}
//           onWheel={handleWheel}
//         >
//           <div
//             className="absolute pointer-events-none opacity-20"
//             style={{
//               left: canvasOffset.x % (40 * zoom),
//               top: canvasOffset.y % (40 * zoom),
//               width: "calc(200% + 40px)",
//               height: "calc(200% + 40px)",
//               backgroundImage: `
//                 linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
//                 linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
//               `,
//               backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
//               transform: `scale(${zoom})`,
//               transformOrigin: "0 0",
//             }}
//           />

//           <div
//             style={{
//               transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${zoom})`,
//               transformOrigin: "0 0",
//               width: "10000px",
//               height: "10000px",
//               position: "relative",
//             }}
//           >
//             <svg
//               className="absolute inset-0 pointer-events-none"
//               style={{ zIndex: 1, width: "10000px", height: "10000px" }}
//             >
//               {/* Existing connections */}
//               {nodes.map((node) =>
//                 node.connections.map((targetId) => {
//                   const targetNode = nodes.find((n) => n.id === targetId)
//                   if (!targetNode) return null

//                   const fromPoint = { x: node.position.x + 192, y: node.position.y + 60 }
//                   const toPoint = { x: targetNode.position.x, y: targetNode.position.y + 60 }

//                   return (
//                     <g key={`${node.id}-${targetId}`}>
//                       <path
//                         d={getConnectionPath(fromPoint, toPoint)}
//                         stroke="hsl(var(--primary))"
//                         strokeWidth="3"
//                         fill="none"
//                         markerEnd="url(#arrowhead)"
//                         className="drop-shadow-sm hover:stroke-primary/80 cursor-pointer"
//                         onClick={() => {
//                           const updatedNode = { ...node, connections: node.connections.filter((id) => id !== targetId) }
//                           updateNode(node.id, updatedNode)
//                         //   toast.success("Connection removed")
//                         }}
//                       />
//                       <text
//                         x={(fromPoint.x + toPoint.x) / 2}
//                         y={(fromPoint.y + toPoint.y) / 2 - 10}
//                         fill="hsl(var(--muted-foreground))"
//                         fontSize="10"
//                         textAnchor="middle"
//                         className="pointer-events-none"
//                       >
//                         {getConnectionLabel(node, targetNode)}
//                       </text>
//                     </g>
//                   )
//                 }),
//               )}

//               {/* Connection preview */}
//               {connecting && connectionPreview && (
//                 <path
//                   d={getConnectionPath(
//                     {
//                       x: nodes.find((n) => n.id === connecting)?.position.x! + 192,
//                       y: nodes.find((n) => n.id === connecting)?.position.y! + 60,
//                     },
//                     connectionPreview,
//                   )}
//                   stroke="hsl(var(--primary))"
//                   strokeWidth="2"
//                   fill="none"
//                   strokeDasharray="5,5"
//                   className="opacity-50"
//                 />
//               )}

//               <defs>
//                 <marker
//                   id="arrowhead"
//                   markerWidth="12"
//                   markerHeight="8"
//                   refX="11"
//                   refY="4"
//                   orient="auto"
//                   fill="hsl(var(--primary))"
//                 >
//                   <polygon points="0 0, 12 4, 0 8" />
//                 </marker>
//               </defs>
//             </svg>

//             {/* Nodes */}
//             {nodes.map((node, index) => (
//               <div key={node.id} style={{ position: "absolute", left: 0, top: 0 }}>
//                 <WorkflowNodeComponent
//                   node={node}
//                   isSelected={selectedNode === node.id}
//                   onSelect={() => setSelectedNode(node.id)}
//                   onDrag={handleNodeDrag}
//                   onDelete={() => deleteNode(node.id)}
//                   onConnect={handleNodeConnect}
//                   connecting={connecting}
//                   setConnecting={setConnecting}
//                 />
//               </div>
//             ))}
//           </div>

//           <div className="absolute bottom-4 right-4 flex flex-col gap-2 bg-card border rounded-lg p-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setZoom((prev) => Math.min(3, prev * 1.2))}
//               className="h-8 w-8 p-0"
//             >
//               +
//             </Button>
//             <div className="text-xs text-center text-muted-foreground px-1">{Math.round(zoom * 100)}%</div>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setZoom((prev) => Math.max(0.1, prev / 1.2))}
//               className="h-8 w-8 p-0"
//             >
//               -
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => {
//                 setZoom(1)
//                 setCanvasOffset({ x: 0, y: 0 })
//               }}
//               className="h-8 w-8 p-0"
//             >
//               ⌂
//             </Button>
//           </div>

//           {provided.placeholder}
//         </div>
//       )}
//     </Droppable>
//   )
// }

// function getConnectionLabel(fromNode: any, toNode: any): string {
//   if (fromNode.type === "condition") {
//     return fromNode.connections.indexOf(toNode.id) === 0 ? "Yes" : "No"
//   }
//   if (fromNode.type === "button") {
//     const buttonIndex = fromNode.connections.indexOf(toNode.id)
//     return fromNode.data.buttons?.[buttonIndex]?.text || `Button ${buttonIndex + 1}`
//   }
//   return ""
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
//         variables: [],
//       }
//     case "button":
//       return {
//         buttons: [
//           {
//             text: "Option 1",
//             action: "continue",
//             id: crypto.randomUUID(),
//           },
//         ],
//       }
//     case "image":
//       return {
//         imageUrl: "",
//         caption: "",
//         buttons: [],
//         uploadMethod: "url",
//       }
//     case "condition":
//       return {
//         condition: "contains",
//         value: "",
//         trueAction: "continue",
//         falseAction: "continue",
//         caseSensitive: false,
//       }
//     case "delay":
//       return {
//         duration: 5,
//         unit: "seconds",
//         randomize: false,
//       }
//     case "api":
//       return {
//         endpoint: "",
//         method: "POST",
//         headers: {},
//         body: "",
//         responseMapping: {},
//       }
//     case "webhook":
//       return {
//         url: "",
//         method: "POST",
//         headers: {},
//         payload: "",
//         retries: 3,
//       }
//     default:
//       return {}
//   }
// }


// "use client"

// import type React from "react"

// import { useRef, useCallback, useState, useEffect } from "react"
// import { useWorkflowStore } from "@/lib/workflow-store"
// import { WorkflowNodeComponent } from "./workflow-node"
// import { Button } from "@/components/ui/button"

// export function EnhancedWorkflowCanvas() {
//   const canvasRef = useRef<HTMLDivElement>(null)
//   const [connecting, setConnecting] = useState<string | null>(null)
//   const [connectionPreview, setConnectionPreview] = useState<{ x: number; y: number } | null>(null)
//   const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 })
//   const [isDragging, setIsDragging] = useState(false)
//   const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
//   const [zoom, setZoom] = useState(1)

//   const { nodes, selectedNode, setSelectedNode, updateNode, deleteNode, connectNodes, addNode } = useWorkflowStore()

//   const handleCanvasMouseDown = useCallback(
//     (e: React.MouseEvent) => {
//       if (e.target === canvasRef.current && e.button === 0) {
//         setIsDragging(true)
//         setDragStart({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y })
//         setSelectedNode(null)
//         setConnecting(null)
//         setConnectionPreview(null)
//       }
//     },
//     [canvasOffset, setSelectedNode],
//   )

//   const handleCanvasMouseMove = useCallback(
//     (e: React.MouseEvent) => {
//       if (isDragging) {
//         setCanvasOffset({
//           x: e.clientX - dragStart.x,
//           y: e.clientY - dragStart.y,
//         })
//       }

//       if (connecting && canvasRef.current) {
//         const rect = canvasRef.current.getBoundingClientRect()
//         setConnectionPreview({
//           x: e.clientX - rect.left - canvasOffset.x,
//           y: e.clientY - rect.top - canvasOffset.y,
//         })
//       }
//     },
//     [isDragging, dragStart, connecting, canvasOffset],
//   )

//   const handleCanvasMouseUp = useCallback(() => {
//     setIsDragging(false)
//   }, [])

//   const handleDrop = useCallback(
//     (e: React.DragEvent) => {
//       e.preventDefault()
//       console.log("[v0] Drop event triggered")

//       const rect = canvasRef.current?.getBoundingClientRect()
//       if (!rect) {
//         console.log("[v0] No canvas rect found")
//         return
//       }

//       try {
//         const dataString = e.dataTransfer.getData("application/json")
//         console.log("[v0] Drop data:", dataString)

//         if (!dataString) {
//           console.log("[v0] No data found in drop event")
//           return
//         }

//         const data = JSON.parse(dataString)
//         console.log("[v0] Parsed drop data:", data)

//         const position = {
//           x: (e.clientX - rect.left - canvasOffset.x) / zoom - 100,
//           y: (e.clientY - rect.top - canvasOffset.y) / zoom - 40,
//         }

//         console.log("[v0] Calculated position:", position)

//         const newNode = {
//           id: `node-${Date.now()}`,
//           type: data.type,
//           position,
//           data: getDefaultNodeData(data.type),
//           connections: [],
//         }

//         console.log("[v0] Creating new node:", newNode)
//         addNode(newNode)
//       } catch (error) {
//         console.error("[v0] Failed to parse drop data:", error)
//       }
//     },
//     [canvasOffset, addNode, zoom],
//   )

//   const handleDragOver = useCallback((e: React.DragEvent) => {
//     e.preventDefault()
//     e.dataTransfer.dropEffect = "copy"
//   }, [])

//   const handleNodeDrag = useCallback(
//     (id: string, position: { x: number; y: number }) => {
//       updateNode(id, { position })
//     },
//     [updateNode],
//   )

//   const handleNodeConnect = useCallback(
//     (fromId: string, toId: string) => {
//       if (fromId !== toId) {
//         connectNodes(fromId, toId)
//       }
//       setConnecting(null)
//       setConnectionPreview(null)
//     },
//     [connectNodes],
//   )

//   const getConnectionPath = (from: { x: number; y: number }, to: { x: number; y: number }) => {
//     const dx = to.x - from.x
//     const dy = to.y - from.y
//     const controlPointOffset = Math.abs(dx) * 0.5

//     return `M ${from.x} ${from.y} C ${from.x + controlPointOffset} ${from.y}, ${to.x - controlPointOffset} ${to.y}, ${to.x} ${to.y}`
//   }

//   const handleWheel = useCallback(
//     (e: React.WheelEvent) => {
//       e.preventDefault()

//       if (e.ctrlKey || e.metaKey) {
//         // Zoom functionality
//         const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1
//         const newZoom = Math.max(0.1, Math.min(3, zoom * zoomFactor))
//         setZoom(newZoom)
//       } else {
//         // Pan functionality
//         setCanvasOffset((prev) => ({
//           x: prev.x - e.deltaX,
//           y: prev.y - e.deltaY,
//         }))
//       }
//     },
//     [zoom],
//   )

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Delete" && selectedNode) {
//         deleteNode(selectedNode)
//       }
//       if (e.key === "Escape") {
//         setSelectedNode(null)
//         setConnecting(null)
//         setConnectionPreview(null)
//       }
//     }

//     window.addEventListener("keydown", handleKeyDown)
//     return () => window.removeEventListener("keydown", handleKeyDown)
//   }, [selectedNode, deleteNode, setSelectedNode])

//   return (
//     <div
//       ref={canvasRef}
//       className="relative w-full h-full overflow-hidden bg-background cursor-grab active:cursor-grabbing"
//       style={{
//         minHeight: "100vh",
//         minWidth: "100vw",
//         height: "100vh",
//         width: "100vw",
//       }}
//       onMouseDown={handleCanvasMouseDown}
//       onMouseMove={handleCanvasMouseMove}
//       onMouseUp={handleCanvasMouseUp}
//       onDrop={handleDrop}
//       onDragOver={handleDragOver}
//       onWheel={handleWheel}
//     >
//       {/* Grid background */}
//       <div
//         className="absolute pointer-events-none opacity-20"
//         style={{
//           left: canvasOffset.x % (40 * zoom),
//           top: canvasOffset.y % (40 * zoom),
//           width: "calc(200% + 40px)",
//           height: "calc(200% + 40px)",
//           backgroundImage: `
//             linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
//             linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
//           `,
//           backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
//           transform: `scale(${zoom})`,
//           transformOrigin: "0 0",
//         }}
//       />

//       {/* Canvas content */}
//       <div
//         style={{
//           transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${zoom})`,
//           transformOrigin: "0 0",
//           width: "10000px",
//           height: "10000px",
//           position: "relative",
//         }}
//       >
//         {/* Connection lines */}
//         <svg
//           className="absolute inset-0 pointer-events-none"
//           style={{ zIndex: 1, width: "10000px", height: "10000px" }}
//         >
//           {/* Existing connections */}
//           {nodes.map((node) =>
//             node.connections.map((targetId) => {
//               const targetNode = nodes.find((n) => n.id === targetId)
//               if (!targetNode) return null

//               const fromPoint = { x: node.position.x + 192, y: node.position.y + 60 }
//               const toPoint = { x: targetNode.position.x, y: targetNode.position.y + 60 }

//               return (
//                 <g key={`${node.id}-${targetId}`}>
//                   <path
//                     d={getConnectionPath(fromPoint, toPoint)}
//                     stroke="hsl(var(--primary))"
//                     strokeWidth="3"
//                     fill="none"
//                     markerEnd="url(#arrowhead)"
//                     className="drop-shadow-sm hover:stroke-primary/80 cursor-pointer"
//                     onClick={() => {
//                       const updatedNode = { ...node, connections: node.connections.filter((id) => id !== targetId) }
//                       updateNode(node.id, updatedNode)
//                     }}
//                   />
//                   <text
//                     x={(fromPoint.x + toPoint.x) / 2}
//                     y={(fromPoint.y + toPoint.y) / 2 - 10}
//                     fill="hsl(var(--muted-foreground))"
//                     fontSize="10"
//                     textAnchor="middle"
//                     className="pointer-events-none"
//                   >
//                     {getConnectionLabel(node, targetNode)}
//                   </text>
//                 </g>
//               )
//             }),
//           )}

//           {/* Connection preview */}
//           {connecting && connectionPreview && (
//             <path
//               d={getConnectionPath(
//                 {
//                   x: nodes.find((n) => n.id === connecting)?.position.x! + 192,
//                   y: nodes.find((n) => n.id === connecting)?.position.y! + 60,
//                 },
//                 connectionPreview,
//               )}
//               stroke="hsl(var(--primary))"
//               strokeWidth="2"
//               fill="none"
//               strokeDasharray="5,5"
//               className="opacity-50"
//             />
//           )}

//           <defs>
//             <marker
//               id="arrowhead"
//               markerWidth="12"
//               markerHeight="8"
//               refX="11"
//               refY="4"
//               orient="auto"
//               fill="hsl(var(--primary))"
//             >
//               <polygon points="0 0, 12 4, 0 8" />
//             </marker>
//           </defs>
//         </svg>

//         {/* Nodes */}
//         {nodes.map((node, index) => (
//           <div key={node.id} style={{ position: "absolute", left: 0, top: 0 }}>
//             <WorkflowNodeComponent
//               node={node}
//               isSelected={selectedNode === node.id}
//               onSelect={() => setSelectedNode(node.id)}
//               onDrag={handleNodeDrag}
//               onDelete={() => deleteNode(node.id)}
//               onConnect={handleNodeConnect}
//               connecting={connecting}
//               setConnecting={setConnecting}
//             />
//           </div>
//         ))}
//       </div>

//       {/* Zoom controls */}
//       <div className="absolute bottom-4 right-4 flex flex-col gap-2 bg-card border rounded-lg p-2">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => setZoom((prev) => Math.min(3, prev * 1.2))}
//           className="h-8 w-8 p-0"
//         >
//           +
//         </Button>
//         <div className="text-xs text-center text-muted-foreground px-1">{Math.round(zoom * 100)}%</div>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => setZoom((prev) => Math.max(0.1, prev / 1.2))}
//           className="h-8 w-8 p-0"
//         >
//           -
//         </Button>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => {
//             setZoom(1)
//             setCanvasOffset({ x: 0, y: 0 })
//           }}
//           className="h-8 w-8 p-0"
//         >
//           ⌂
//         </Button>
//       </div>

//       {/* Drop zone indicator */}
//       <div className="absolute top-4 left-4 text-sm text-muted-foreground bg-card/80 backdrop-blur-sm rounded-lg px-3 py-2 border">
//         Drag blocks from the sidebar to add them to your workflow
//       </div>
//     </div>
//   )
// }

// function getConnectionLabel(fromNode: any, toNode: any): string {
//   if (fromNode.type === "condition") {
//     return fromNode.connections.indexOf(toNode.id) === 0 ? "Yes" : "No"
//   }
//   if (fromNode.type === "button") {
//     const buttonIndex = fromNode.connections.indexOf(toNode.id)
//     return fromNode.data.buttons?.[buttonIndex]?.text || `Button ${buttonIndex + 1}`
//   }
//   return ""
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
//         variables: [],
//       }
//     case "button":
//       return {
//         buttons: [
//           {
//             text: "Option 1",
//             action: "continue",
//             id: crypto.randomUUID(),
//           },
//         ],
//       }
//     case "image":
//       return {
//         imageUrl: "",
//         caption: "",
//         buttons: [],
//         uploadMethod: "url",
//       }
//     case "condition":
//       return {
//         condition: "contains",
//         value: "",
//         trueAction: "continue",
//         falseAction: "continue",
//         caseSensitive: false,
//       }
//     case "delay":
//       return {
//         duration: 5,
//         unit: "seconds",
//         randomize: false,
//       }
//     case "api":
//       return {
//         endpoint: "",
//         method: "POST",
//         headers: {},
//         body: "",
//         responseMapping: {},
//       }
//     case "webhook":
//       return {
//         url: "",
//         method: "POST",
//         headers: {},
//         payload: "",
//         retries: 3,
//       }
//     default:
//       return {}
//   }
// }
"use client"

import type React from "react"
import { useRef, useCallback, useState, useEffect } from "react"
import { useWorkflowStore } from "@/lib/workflow-store"
import { WorkflowNodeComponent } from "./workflow-node"
import { Button } from "@/components/ui/button"

export function EnhancedWorkflowCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [connecting, setConnecting] = useState<string | null>(null)
  const [connectionPreview, setConnectionPreview] = useState<{ x: number; y: number } | null>(null)
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  const { nodes, selectedNode, setSelectedNode, updateNode, deleteNode, connectNodes, addNode } = useWorkflowStore()

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === canvasRef.current && e.button === 0) {
        setIsDragging(true)
        setDragStart({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y })
        setSelectedNode(null)
        setConnecting(null)
        setConnectionPreview(null)
      }
    },
    [canvasOffset, setSelectedNode],
  )

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        setCanvasOffset({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        })
      }

      if (connecting && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        setConnectionPreview({
          x: e.clientX - rect.left - canvasOffset.x,
          y: e.clientY - rect.top - canvasOffset.y,
        })
      }
    },
    [isDragging, dragStart, connecting, canvasOffset],
  )

  const handleCanvasMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      console.log("[v0] Drop event triggered")

      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) {
        console.log("[v0] No canvas rect found")
        return
      }

      try {
        const dataString = e.dataTransfer.getData("application/json")
        console.log("[v0] Drop data:", dataString)

        if (!dataString) {
          console.log("[v0] No data found in drop event")
          return
        }

        const data = JSON.parse(dataString)
        console.log("[v0] Parsed drop data:", data)

        const position = {
          x: (e.clientX - rect.left - canvasOffset.x) / zoom - 100,
          y: (e.clientY - rect.top - canvasOffset.y) / zoom - 40,
        }

        console.log("[v0] Calculated position:", position)

        const newNode = {
          id: `node-${Date.now()}`,
          type: data.type,
          position,
          data: getDefaultNodeData(data.type),
          connections: [],
        }

        console.log("[v0] Creating new node:", newNode)
        addNode(newNode)
      } catch (error) {
        console.error("[v0] Failed to parse drop data:", error)
      }
    },
    [canvasOffset, addNode, zoom],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
  }, [])

  const handleNodeDrag = useCallback(
    (id: string, position: { x: number; y: number }) => {
      updateNode(id, { position })
    },
    [updateNode],
  )

  const handleNodeConnect = useCallback(
    (fromId: string, toId: string) => {
      if (fromId !== toId) {
        connectNodes(fromId, toId)
      }
      setConnecting(null)
      setConnectionPreview(null)
    },
    [connectNodes],
  )

  const getConnectionPath = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const dx = to.x - from.x
    const dy = to.y - from.y
    const controlPointOffset = Math.abs(dx) * 0.5

    return `M ${from.x} ${from.y} C ${from.x + controlPointOffset} ${from.y}, ${to.x - controlPointOffset} ${to.y}, ${to.x} ${to.y}`
  }

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()

      if (e.ctrlKey || e.metaKey) {
        // Zoom functionality
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1
        const newZoom = Math.max(0.1, Math.min(3, zoom * zoomFactor))
        setZoom(newZoom)
      } else {
        // Pan functionality
        setCanvasOffset((prev) => ({
          x: prev.x - e.deltaX,
          y: prev.y - e.deltaY,
        }))
      }
    },
    [zoom],
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" && selectedNode) {
        deleteNode(selectedNode)
      }
      if (e.key === "Escape") {
        setSelectedNode(null)
        setConnecting(null)
        setConnectionPreview(null)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedNode, deleteNode, setSelectedNode])

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full overflow-hidden bg-background cursor-grab active:cursor-grabbing"
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onWheel={handleWheel}
    >
      {/* Grid background */}
      <div
        className="absolute pointer-events-none opacity-20"
        style={{
          left: canvasOffset.x % (40 * zoom),
          top: canvasOffset.y % (40 * zoom),
          width: "calc(200% + 40px)",
          height: "calc(200% + 40px)",
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
          transform: `scale(${zoom})`,
          transformOrigin: "0 0",
        }}
      />

      {/* Canvas content */}
      <div
        style={{
          transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
          width: "5000px", // Reduced from 10000px for better performance
          height: "3000px", // Reduced from 10000px for better performance  
          position: "relative",
        }}
      >
        {/* Connection lines */}
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1, width: "5000px", height: "3000px" }}
        >
          {/* Existing connections */}
          {nodes.map((node) =>
            node.connections.map((targetId) => {
              const targetNode = nodes.find((n) => n.id === targetId)
              if (!targetNode) return null

              const fromPoint = { x: node.position.x + 192, y: node.position.y + 60 }
              const toPoint = { x: targetNode.position.x, y: targetNode.position.y + 60 }

              return (
                <g key={`${node.id}-${targetId}`}>
                  <path
                    d={getConnectionPath(fromPoint, toPoint)}
                    stroke="hsl(var(--primary))"
                    strokeWidth="3"
                    fill="none"
                    markerEnd="url(#arrowhead)"
                    className="drop-shadow-sm hover:stroke-primary/80 cursor-pointer"
                    onClick={() => {
                      const updatedNode = { ...node, connections: node.connections.filter((id) => id !== targetId) }
                      updateNode(node.id, updatedNode)
                    }}
                  />
                  <text
                    x={(fromPoint.x + toPoint.x) / 2}
                    y={(fromPoint.y + toPoint.y) / 2 - 10}
                    fill="hsl(var(--muted-foreground))"
                    fontSize="10"
                    textAnchor="middle"
                    className="pointer-events-none"
                  >
                    {getConnectionLabel(node, targetNode)}
                  </text>
                </g>
              )
            }),
          )}

          {/* Connection preview */}
          {connecting && connectionPreview && (
            <path
              d={getConnectionPath(
                {
                  x: nodes.find((n) => n.id === connecting)?.position.x! + 192,
                  y: nodes.find((n) => n.id === connecting)?.position.y! + 60,
                },
                connectionPreview,
              )}
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
              className="opacity-50"
            />
          )}

          <defs>
            <marker
              id="arrowhead"
              markerWidth="12"
              markerHeight="8"
              refX="11"
              refY="4"
              orient="auto"
              fill="hsl(var(--primary))"
            >
              <polygon points="0 0, 12 4, 0 8" />
            </marker>
          </defs>
        </svg>

        {/* Nodes */}
        {nodes.map((node) => (
          <div key={node.id} style={{ position: "absolute", left: 0, top: 0 }}>
            <WorkflowNodeComponent
              node={node}
              isSelected={selectedNode === node.id}
              onSelect={() => setSelectedNode(node.id)}
              onDrag={handleNodeDrag}
              onDelete={() => deleteNode(node.id)}
              onConnect={handleNodeConnect}
              connecting={connecting}
              setConnecting={setConnecting}
            />
          </div>
        ))}
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 bg-card border rounded-lg p-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setZoom((prev) => Math.min(3, prev * 1.2))}
          className="h-8 w-8 p-0"
        >
          +
        </Button>
        <div className="text-xs text-center text-muted-foreground px-1">{Math.round(zoom * 100)}%</div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setZoom((prev) => Math.max(0.1, prev / 1.2))}
          className="h-8 w-8 p-0"
        >
          -
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setZoom(1)
            setCanvasOffset({ x: 0, y: 0 })
          }}
          className="h-8 w-8 p-0"
        >
          ⌂
        </Button>
      </div>

      {/* Drop zone indicator */}
      <div className="absolute top-4 left-4 text-sm text-muted-foreground bg-card/80 backdrop-blur-sm rounded-lg px-3 py-2 border">
        Drag blocks from the sidebar to add them to your workflow
      </div>
    </div>
  )
}

function getConnectionLabel(fromNode: any, toNode: any): string {
  if (fromNode.type === "condition") {
    return fromNode.connections.indexOf(toNode.id) === 0 ? "Yes" : "No"
  }
  if (fromNode.type === "button") {
    const buttonIndex = fromNode.connections.indexOf(toNode.id)
    return fromNode.data.buttons?.[buttonIndex]?.text || `Button ${buttonIndex + 1}`
  }
  return ""
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
        variables: [],
      }
    case "button":
      return {
        buttons: [
          {
            text: "Option 1",
            action: "continue",
            id: crypto.randomUUID(),
          },
        ],
      }
    case "image":
      return {
        imageUrl: "",
        caption: "",
        buttons: [],
        uploadMethod: "url",
      }
    case "condition":
      return {
        condition: "contains",
        value: "",
        trueAction: "continue",
        falseAction: "continue",
        caseSensitive: false,
      }
    case "delay":
      return {
        duration: 5,
        unit: "seconds",
        randomize: false,
      }
    case "api":
      return {
        endpoint: "",
        method: "POST",
        headers: {},
        body: "",
        responseMapping: {},
      }
    case "webhook":
      return {
        url: "",
        method: "POST",
        headers: {},
        payload: "",
        retries: 3,
      }
    default:
      return {}
  }
}