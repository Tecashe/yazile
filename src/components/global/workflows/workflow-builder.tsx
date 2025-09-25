// "use client"

// import { useState, useCallback } from "react"
// import { WorkflowCanvas } from "./workflow-canvas"
// import { BlockPalette } from "./block-palette"
// import { WorkflowHeader } from "./workflow-header"
// import { BlockConfiguration } from "./block-configuration"
// import { WorkflowSimulator } from "./workflow-simulator"
// import { AdvancedBlockSettings } from "./advanced-block-settings"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Button } from "@/components/ui/button"
// import { BarChart3 } from "lucide-react"
// import Link from "next/link"

// export interface WorkflowNode {
//   id: string
//   type: "trigger" | "text" | "button" | "image" | "condition" | "delay"
//   position: { x: number; y: number }
//   data: any
//   connections: string[]
// }

// export function WorkflowBuilder() {
//   const [nodes, setNodes] = useState<WorkflowNode[]>([
//     {
//       id: "start",
//       type: "trigger",
//       position: { x: 100, y: 100 },
//       data: {
//         title: "DM Received",
//         description: "When someone sends a direct message",
//       },
//       connections: [],
//     },
//   ])
//   const [selectedNode, setSelectedNode] = useState<string | null>(null)
//   const [isRunning, setIsRunning] = useState(false)

//   const addNode = useCallback((type: WorkflowNode["type"], position: { x: number; y: number }) => {
//     const newNode: WorkflowNode = {
//       id: `node-${Date.now()}`,
//       type,
//       position,
//       data: getDefaultNodeData(type),
//       connections: [],
//     }
//     setNodes((prev) => [...prev, newNode])
//   }, [])

//   const updateNode = useCallback((id: string, updates: Partial<WorkflowNode>) => {
//     setNodes((prev) => prev.map((node) => (node.id === id ? { ...node, ...updates } : node)))
//   }, [])

//   const deleteNode = useCallback((id: string) => {
//     setNodes((prev) => prev.filter((node) => node.id !== id))
//     setSelectedNode(null)
//   }, [])

//   const connectNodes = useCallback((fromId: string, toId: string) => {
//     setNodes((prev) =>
//       prev.map((node) => (node.id === fromId ? { ...node, connections: [...node.connections, toId] } : node)),
//     )
//   }, [])

//   const selectedNodeData = selectedNode ? nodes.find((n) => n.id === selectedNode) : null

//   const saveWorkflow = useCallback(() => {
//     const workflowData = {
//       nodes,
//       metadata: {
//         name: "Social Media Automation",
//         description: "Automated DM and comment responses",
//         version: "1.0.0",
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//       },
//     }

//     // In a real app, this would save to a database
//     localStorage.setItem("workflow-data", JSON.stringify(workflowData))
//     console.log("Workflow saved:", workflowData)

//     // Show success notification (you could add a toast here)
//     alert("Workflow saved successfully!")
//   }, [nodes])

//   const loadWorkflow = useCallback(() => {
//     try {
//       const saved = localStorage.getItem("workflow-data")
//       if (saved) {
//         const workflowData = JSON.parse(saved)
//         setNodes(workflowData.nodes || [])
//         setSelectedNode(null)
//         console.log("Workflow loaded:", workflowData)
//       }
//     } catch (error) {
//       console.error("Failed to load workflow:", error)
//       alert("Failed to load workflow")
//     }
//   }, [])

//   return (
//     <div className="flex h-screen bg-background">
//       {/* Header */}
//       <div className="absolute top-0 left-0 right-0 z-50">
//         <WorkflowHeader
//           isRunning={isRunning}
//           onRun={() => setIsRunning(!isRunning)}
//           onSave={saveWorkflow}
//           onLoad={loadWorkflow}
//         />
//       </div>

//       {/* Block Palette Sidebar */}
//       <div className="w-80 border-r border-border bg-card pt-16">
//         <div className="p-4 border-b border-border">
//           <Link href="/dashboard">
//             <Button variant="outline" className="w-full bg-transparent">
//               <BarChart3 className="w-4 h-4 mr-2" />
//               View Dashboard
//             </Button>
//           </Link>
//         </div>
//         <BlockPalette onAddBlock={addNode} />
//       </div>

//       {/* Main Canvas */}
//       <div className="flex-1 pt-16">
//         <WorkflowCanvas
//           nodes={nodes}
//           selectedNode={selectedNode}
//           onNodeSelect={setSelectedNode}
//           onNodeUpdate={updateNode}
//           onNodeDelete={deleteNode}
//           onNodeConnect={connectNodes}
//           onAddNode={addNode}
//         />
//       </div>

//       {/* Right Panel - Configuration & Simulator */}
//       <div className="w-96 border-l border-border bg-card pt-16">
//         <Tabs defaultValue="config" className="h-full flex flex-col">
//           <TabsList className="grid w-full grid-cols-2 mx-4 mt-4">
//             <TabsTrigger value="config">Configure</TabsTrigger>
//             <TabsTrigger value="test">Test</TabsTrigger>
//           </TabsList>

//           <TabsContent value="config" className="flex-1 mt-0 overflow-auto">
//             {selectedNodeData ? (
//               <div className="space-y-4">
//                 <BlockConfiguration
//                   node={selectedNodeData}
//                   onUpdate={(updates) => updateNode(selectedNode!, updates)}
//                 />
//                 <AdvancedBlockSettings
//                   node={selectedNodeData}
//                   onUpdate={(updates) => updateNode(selectedNode!, updates)}
//                 />
//               </div>
//             ) : (
//               <div className="p-4 text-center text-muted-foreground">
//                 <div className="py-8">
//                   <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
//                     <span className="text-2xl">⚙️</span>
//                   </div>
//                   <h3 className="text-lg font-medium mb-2">No Block Selected</h3>
//                   <p className="text-sm">Click on a block in the canvas to configure its properties</p>
//                 </div>
//               </div>
//             )}
//           </TabsContent>

//           {/* <TabsContent value="test" className="flex-1 mt-0">
//             <WorkflowSimulator nodes={nodes} isRunning={isRunning} onToggleRun={() => setIsRunning(!isRunning)} />
//           </TabsContent> */}
//         </Tabs>
//       </div>
//     </div>
//   )
// }

// function getDefaultNodeData(type: WorkflowNode["type"]) {
//   switch (type) {
//     case "trigger":
//       return { title: "Trigger", description: "Workflow starts here" }
//     case "text":
//       return { message: "Hello! Thanks for your message.", buttons: [] }
//     case "button":
//       return { buttons: [{ text: "Option 1", action: "continue", id: "1" }] }
//     case "image":
//       return { imageUrl: "", caption: "", buttons: [] }
//     case "condition":
//       return { condition: "contains", value: "", trueAction: "continue", falseAction: "continue" }
//     case "delay":
//       return { duration: 5, unit: "seconds" }
//     default:
//       return {}
//   }
// }

"use client"

import { useWorkflowStore } from "@/lib/workflow-store"
import { EnhancedWorkflowCanvas } from "./enhanced-workflow-canvas"
import { CollapsibleBlockPalette } from "./collapsible-block-palette"
import { EnhancedWorkflowHeader } from "./enhanced-workflow-header"
import { EnhancedRightPanel } from "./enhanced-right-panel"
import { DragDropContext, type DropResult } from "@hello-pangea/dnd"
import { useCallback } from "react"

export function EnhancedWorkflowBuilder() {
  const {
    nodes,
    selectedNode,
    isRunning,
    sidebarCollapsed,
    addNode,
    updateNode,
    deleteNode,
    connectNodes,
    disconnectNodes,
    setSelectedNode,
    setIsRunning,
    saveWorkflow,
    loadWorkflow,
  } = useWorkflowStore()

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return

      const { source, destination, draggableId } = result

      // Handle dropping from palette to canvas
      if (source.droppableId === "block-palette" && destination.droppableId === "workflow-canvas") {
        const blockType = draggableId as any
        const position = {
          x: destination.index * 20 + 200, // Spread out blocks
          y: Math.random() * 400 + 100,
        }

        const newNode = {
          id: `node-${Date.now()}`,
          type: blockType,
          position,
          data: getDefaultNodeData(blockType),
          connections: [],
        }

        addNode(newNode)
      }

      // Handle reordering nodes on canvas
      if (source.droppableId === "workflow-canvas" && destination.droppableId === "workflow-canvas") {
        // Update node position based on drop location
        const nodeId = draggableId
        const newPosition = {
          x: destination.index * 20 + 100,
          y: Math.random() * 400 + 100,
        }

        updateNode(nodeId, { position: newPosition })
      }
    },
    [addNode, updateNode],
  )

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex h-screen bg-background">
        {/* Enhanced Header */}
        <div className="absolute top-0 left-0 right-0 z-50">
          <EnhancedWorkflowHeader />
        </div>

        {/* Collapsible Block Palette Sidebar */}
        <CollapsibleBlockPalette />

        {/* Main Canvas */}
        <div className={`flex-1 pt-16 transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-80"}`}>
          <EnhancedWorkflowCanvas />
        </div>

        {/* Enhanced Right Panel */}
        <EnhancedRightPanel />
      </div>
    </DragDropContext>
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

