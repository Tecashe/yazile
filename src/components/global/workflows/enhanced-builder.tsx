// "use client"

// import { useWorkflowStore } from "@/lib/workflow-store"
// import { EnhancedWorkflowCanvas } from "./enhanced-workflow-canvas"
// import { CollapsibleBlockPalette } from "./collapsible-block-palette"
// import { EnhancedWorkflowHeader } from "./enhanced-workflow-header"
// import { EnhancedRightPanel } from "./enhanced-right-panel"
// import { DragDropContext, type DropResult } from "@hello-pangea/dnd"
// import { useCallback } from "react"

// export function EnhancedWorkflowBuilder() {
//   const {
//     nodes,
//     selectedNode,
//     isRunning,
//     sidebarCollapsed,
//     addNode,
//     updateNode,
//     deleteNode,
//     connectNodes,
//     disconnectNodes,
//     setSelectedNode,
//     setIsRunning,
//     saveWorkflow,
//     loadWorkflow,
//   } = useWorkflowStore()

//   const handleDragEnd = useCallback(
//     (result: DropResult) => {
//       if (!result.destination) return

//       const { source, destination, draggableId } = result

//       // Handle dropping from palette to canvas
//       if (source.droppableId === "block-palette" && destination.droppableId === "workflow-canvas") {
//         const blockType = draggableId as any
//         const position = {
//           x: destination.index * 20 + 200, // Spread out blocks
//           y: Math.random() * 400 + 100,
//         }

//         const newNode = {
//           id: `node-${Date.now()}`,
//           type: blockType,
//           position,
//           data: getDefaultNodeData(blockType),
//           connections: [],
//         }

//         addNode(newNode)
//       }

//       // Handle reordering nodes on canvas
//       if (source.droppableId === "workflow-canvas" && destination.droppableId === "workflow-canvas") {
//         // Update node position based on drop location
//         const nodeId = draggableId
//         const newPosition = {
//           x: destination.index * 20 + 100,
//           y: Math.random() * 400 + 100,
//         }

//         updateNode(nodeId, { position: newPosition })
//       }
//     },
//     [addNode, updateNode],
//   )

//   return (
//     <DragDropContext onDragEnd={handleDragEnd}>
//       <div className="flex h-screen bg-background">
//         {/* Enhanced Header */}
//         <div className="absolute top-0 left-0 right-0 z-50">
//           <EnhancedWorkflowHeader />
//         </div>

//         {/* Collapsible Block Palette Sidebar */}
//         <CollapsibleBlockPalette />

//         {/* Main Canvas */}
//         <div className={`flex-1 pt-16 transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-80"}`}>
//           <EnhancedWorkflowCanvas />
//         </div>

//         {/* Enhanced Right Panel */}
//         <EnhancedRightPanel />
//       </div>
//     </DragDropContext>
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

// import { useWorkflowStore } from "@/lib/workflow-store"
// import { EnhancedWorkflowCanvas } from "./enhanced-workflow-canvas"
// import { CollapsibleBlockPalette } from "./collapsible-block-palette"
// import { EnhancedWorkflowHeader } from "./enhanced-workflow-header"
// import { EnhancedRightPanel } from "./enhanced-right-panel"

// export function EnhancedWorkflowBuilder() {
//   const { sidebarCollapsed } = useWorkflowStore()

//   return (
//     <div className="flex h-screen bg-background">
//       {/* Enhanced Header */}
//       <div className="absolute top-0 left-0 right-0 z-50">
//         <EnhancedWorkflowHeader />
//       </div>

//       {/* Collapsible Block Palette Sidebar */}
//       <CollapsibleBlockPalette />

//       {/* Main Canvas */}
//       <div className={`flex-1 pt-16 transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-80"}`}>
//         <EnhancedWorkflowCanvas />
//       </div>

//       {/* Enhanced Right Panel */}
//       <EnhancedRightPanel />
//     </div>
//   )
// }


// "use client"

// import { useWorkflowStore } from "@/lib/workflow-store"
// import { EnhancedWorkflowCanvas } from "./enhanced-workflow-canvas"
// import { CollapsibleBlockPalette } from "./collapsible-block-palette"
// import { EnhancedWorkflowHeader } from "./enhanced-workflow-header"
// import { EnhancedRightPanel } from "./enhanced-right-panel"

// export function EnhancedWorkflowBuilder() {
//   const { sidebarCollapsed, rightPanelCollapsed } = useWorkflowStore()

//   return (
//     <div className="flex flex-col h-full min-h-[calc(100vh-8rem)] bg-background border rounded-lg overflow-hidden">
//       {/* Workflow Header - Compact and integrated */}
//       <EnhancedWorkflowHeader />

//       {/* Main Workflow Area */}
//       <div className="flex flex-1 relative">
//         {/* Collapsible Block Palette - Left Side */}
//         <CollapsibleBlockPalette />

//         {/* Canvas Area - Takes remaining space */}
//         <div
//           className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "ml-0" : "ml-0"} ${
//             rightPanelCollapsed ? "mr-0" : "mr-0"
//           }`}
//         >
//           <EnhancedWorkflowCanvas />
//         </div>

//         {/* Enhanced Right Panel - Right Side */}
//         <EnhancedRightPanel />
//       </div>
//     </div>
//   )
// }
"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import { useWorkflowStore } from "@/lib/workflow-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Play,
  Square,
  Save,
  Settings,
  MoreHorizontal,
  Plus,
  Zap,
  MessageSquare,
  MousePointer,
  ImageIcon,
  GitBranch,
  Clock,
  Webhook,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Home,
  Trash2,
  Copy,
  Move,
} from "lucide-react"
import type { WorkflowNode } from "@/types/workflow"

const BLOCK_TYPES = [
  { type: "trigger", icon: Sparkles, label: "Trigger", color: "text-green-500" },
  { type: "text", icon: MessageSquare, label: "Text Message", color: "text-blue-500" },
  { type: "button", icon: MousePointer, label: "Button Menu", color: "text-purple-500" },
  { type: "image", icon: ImageIcon, label: "Send Image", color: "text-pink-500" },
  { type: "condition", icon: GitBranch, label: "Condition", color: "text-yellow-500" },
  { type: "delay", icon: Clock, label: "Delay", color: "text-orange-500" },
  { type: "api", icon: Zap, label: "API Call", color: "text-cyan-500" },
  { type: "webhook", icon: Webhook, label: "Webhook", color: "text-red-500" },
]

interface NodeComponentProps {
  node: WorkflowNode
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
  onMove: (position: { x: number; y: number }) => void
  scale: number
}

function NodeComponent({ node, isSelected, onSelect, onDelete, onMove, scale }: NodeComponentProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const nodeRef = useRef<HTMLDivElement>(null)

  const blockType = BLOCK_TYPES.find(b => b.type === node.type)
  const Icon = blockType?.icon || MessageSquare

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return
    e.preventDefault()
    onSelect()
    
    const rect = nodeRef.current?.getBoundingClientRect()
    if (rect) {
      setDragStart({
        x: (e.clientX - rect.left) / scale,
        y: (e.clientY - rect.top) / scale
      })
      setIsDragging(true)
    }
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!nodeRef.current?.parentElement) return
      
      const containerRect = nodeRef.current.parentElement.getBoundingClientRect()
      const newX = (e.clientX - containerRect.left) / scale - dragStart.x
      const newY = (e.clientY - containerRect.top) / scale - dragStart.y
      
      // Keep nodes within reasonable bounds
      const clampedX = Math.max(0, Math.min(2000, newX))
      const clampedY = Math.max(0, Math.min(1200, newY))
      
      onMove({ x: clampedX, y: clampedY })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragStart, onMove, scale])

  const getNodeTitle = () => {
    switch (node.type) {
      case "trigger": return node.data.title || "Trigger"
      case "text": return "Text Message"
      case "button": return "Button Menu"
      case "image": return "Send Image"
      case "condition": return "Condition"
      case "delay": return `Delay ${node.data.duration || 5}${node.data.unit || 's'}`
      case "api": return "API Call"
      case "webhook": return "Webhook"
      default: return "Unknown"
    }
  }

  const getNodeDescription = () => {
    switch (node.type) {
      case "text": return node.data.message?.substring(0, 40) + "..." || "Enter message"
      case "button": return `${node.data.buttons?.length || 0} buttons`
      case "condition": return `If ${node.data.condition || 'condition'}`
      default: return ""
    }
  }

  return (
    <div
      ref={nodeRef}
      className={`absolute cursor-move select-none transition-all duration-200 ${
        isDragging ? 'z-50 scale-105' : 'z-10'
      }`}
      style={{
        left: node.position.x,
        top: node.position.y,
        transform: `scale(${scale})`
      }}
      onMouseDown={handleMouseDown}
    >
      <Card className={`w-48 p-3 transition-all ${
        isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <Icon className={`h-4 w-4 flex-shrink-0 ${blockType?.color || 'text-gray-500'}`} />
            <span className="font-medium text-sm truncate">{getNodeTitle()}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {getNodeDescription() && (
          <p className="text-xs text-muted-foreground truncate">{getNodeDescription()}</p>
        )}
      </Card>
    </div>
  )
}

export function WorkflowBuilder() {
  const {
    nodes,
    selectedNode,
    workflowName,
    isDirty,
    isRunning,
    rightPanelCollapsed,
    setSelectedNode,
    updateNode,
    deleteNode,
    addNode,
    saveWorkflow,
    setIsRunning,
    setRightPanelCollapsed,
  } = useWorkflowStore()

  const canvasRef = useRef<HTMLDivElement>(null)
  const [canvasOffset, setCanvasOffset] = useState({ x: 50, y: 50 })
  const [scale, setScale] = useState(1)
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false)
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setSelectedNode(null)
      if (e.button === 0) {
        setIsPanning(true)
        setPanStart({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y })
      }
    }
  }

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setCanvasOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      })
    }
  }, [isPanning, panStart])

  const handleCanvasMouseUp = useCallback(() => {
    setIsPanning(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!canvasRef.current) return

    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"))
      const rect = canvasRef.current.getBoundingClientRect()
      
      const position = {
        x: Math.max(20, (e.clientX - rect.left - canvasOffset.x) / scale - 96),
        y: Math.max(20, (e.clientY - rect.top - canvasOffset.y) / scale - 60),
      }

      const newNode: WorkflowNode = {
        id: `node-${Date.now()}`,
        type: data.type,
        position,
        data: getDefaultNodeData(data.type),
        connections: [],
      }

      addNode(newNode)
      setSelectedNode(newNode.id)
    } catch (error) {
      console.error("Failed to add node:", error)
    }
  }, [canvasOffset, scale, addNode, setSelectedNode])

  const handleZoom = (delta: number) => {
    setScale(prev => Math.max(0.5, Math.min(2, prev + delta)))
  }

  const centerView = () => {
    if (nodes.length === 0) {
      setCanvasOffset({ x: 50, y: 50 })
      setScale(1)
      return
    }

    const bounds = nodes.reduce((acc, node) => {
      return {
        minX: Math.min(acc.minX, node.position.x),
        minY: Math.min(acc.minY, node.position.y),
        maxX: Math.max(acc.maxX, node.position.x + 192),
        maxY: Math.max(acc.maxY, node.position.y + 120),
      }
    }, { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity })

    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const centerX = rect.width / 2 - (bounds.minX + bounds.maxX) / 2 * scale
      const centerY = rect.height / 2 - (bounds.minY + bounds.maxY) / 2 * scale
      setCanvasOffset({ x: centerX, y: centerY })
    }
  }

  const leftPanelWidth = leftPanelCollapsed ? "w-12" : "w-64"
  const rightPanelWidth = rightPanelCollapsed ? "w-12" : "w-80"

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="h-14 bg-card border-b flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <h1 className="font-semibold">{workflowName}</h1>
          {isDirty && <Badge variant="secondary" className="text-xs">Unsaved</Badge>}
          {isRunning && <Badge className="text-xs bg-green-600">Running</Badge>}
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant={isRunning ? "destructive" : "default"} 
            size="sm"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? <Square className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isRunning ? "Stop" : "Run"}
          </Button>
          
          <Button variant="outline" size="sm" onClick={saveWorkflow} disabled={!isDirty}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={centerView}>
                <Home className="h-4 w-4 mr-2" />
                Center View
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}>
                <Settings className="h-4 w-4 mr-2" />
                Toggle Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Block Palette */}
        <div className={`${leftPanelWidth} bg-card border-r transition-all duration-200 flex-shrink-0`}>
          <div className="p-3 border-b">
            <div className="flex items-center justify-between">
              {!leftPanelCollapsed && <span className="font-medium text-sm">Blocks</span>}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
              >
                {leftPanelCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
              </Button>
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {BLOCK_TYPES.map((block) => {
                const Icon = block.icon
                return (
                  <div
                    key={block.type}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-grab active:cursor-grabbing transition-colors"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("application/json", JSON.stringify({ type: block.type }))
                    }}
                  >
                    <Icon className={`h-4 w-4 ${block.color}`} />
                    {!leftPanelCollapsed && <span className="text-sm">{block.label}</span>}
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden bg-muted/30">
          <div
            ref={canvasRef}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault() }}
          >
            {/* Canvas content */}
            <div
              className="relative"
              style={{
                transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px)`,
                width: '2400px',
                height: '1400px',
              }}
            >
              {nodes.map(node => (
                <NodeComponent
                  key={node.id}
                  node={node}
                  isSelected={selectedNode === node.id}
                  onSelect={() => setSelectedNode(node.id)}
                  onDelete={() => deleteNode(node.id)}
                  onMove={(position) => updateNode(node.id, { position })}
                  scale={scale}
                />
              ))}
            </div>
          </div>

          {/* Canvas Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2 bg-card rounded-lg border p-2">
            <Button variant="outline" size="sm" onClick={() => handleZoom(0.1)} className="h-8 w-8 p-0">+</Button>
            <div className="text-xs text-center px-1">{Math.round(scale * 100)}%</div>
            <Button variant="outline" size="sm" onClick={() => handleZoom(-0.1)} className="h-8 w-8 p-0">-</Button>
            <Button variant="outline" size="sm" onClick={centerView} className="h-8 w-8 p-0">
              <Home className="h-3 w-3" />
            </Button>
          </div>

          {/* Help Text */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-muted-foreground">
                <div className="text-lg mb-2">Start building your workflow</div>
                <div className="text-sm">Drag blocks from the left panel to begin</div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Properties */}
        <div className={`${rightPanelWidth} bg-card border-l transition-all duration-200 flex-shrink-0`}>
          <div className="p-3 border-b">
            <div className="flex items-center justify-between">
              {!rightPanelCollapsed && <span className="font-medium text-sm">Properties</span>}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
              >
                {rightPanelCollapsed ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </Button>
            </div>
          </div>
          
          {!rightPanelCollapsed && (
            <ScrollArea className="flex-1 p-4">
              {selectedNode ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Node Configuration</h3>
                    <div className="text-sm text-muted-foreground">
                      Configure the selected node properties here.
                    </div>
                  </div>
                  
                  {/* Placeholder for node configuration */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <Input className="mt-1" placeholder="Enter title" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Input className="mt-1" placeholder="Enter description" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <div className="text-sm">Select a node to configure its properties</div>
                </div>
              )}
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  )
}

function getDefaultNodeData(type: string): any {
  switch (type) {
    case "trigger":
      return { title: "New Trigger", triggerType: "dm", platforms: ["instagram"] }
    case "text":
      return { message: "Hello! Thanks for your message." }
    case "button":
      return { buttons: [{ text: "Option 1", id: crypto.randomUUID() }] }
    case "image":
      return { imageUrl: "", caption: "" }
    case "condition":
      return { condition: "contains", value: "" }
    case "delay":
      return { duration: 5, unit: "seconds" }
    case "api":
      return { endpoint: "", method: "POST" }
    case "webhook":
      return { url: "", method: "POST" }
    default:
      return {}
  }
}