"use client"

import { useWorkflowStore } from "@/lib/workflow-store"
import { WorkflowHeader } from "./workflow-header"
import { WorkflowCanvas } from "./workflow-canvas"
import { BlockPalette } from "./block-palette"
import { ConfigurationPanel } from "./configuration-panel"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

export function WorkflowBuilder() {
  const { sidebarCollapsed, rightPanelCollapsed } = useWorkflowStore()

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <WorkflowHeader />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Sidebar - Block Palette */}
          {!sidebarCollapsed && (
            <>
              <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                <BlockPalette />
              </ResizablePanel>
              <ResizableHandle />
            </>
          )}

          {/* Main Canvas */}
          <ResizablePanel defaultSize={rightPanelCollapsed ? 80 : 60}>
            <WorkflowCanvas />
          </ResizablePanel>

          {/* Right Panel - Configuration */}
          {!rightPanelCollapsed && (
            <>
              <ResizableHandle />
              <ResizablePanel defaultSize={20} minSize={15} maxSize={35}>
                <ConfigurationPanel />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
