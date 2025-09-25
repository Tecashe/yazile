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
