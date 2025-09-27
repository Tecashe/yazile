"use client"

import { useWorkflowStore } from "@/lib/workflow-store-production"
import { WorkflowHeader } from "./workflow-header"
import { WorkflowCanvas } from "./workflow-canvas"
import { BlockPalette } from "./block-palette"
import { ConfigurationPanel } from "./configuration-panel"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

export function WorkflowBuilder() {
  const { sidebarCollapsed, rightPanelCollapsed } = useWorkflowStore()

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="flex-shrink-0 z-50 border-b border-border">
        <WorkflowHeader />
      </div>

      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {!sidebarCollapsed && (
            <>
              <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                <BlockPalette />
              </ResizablePanel>
              <ResizableHandle />
            </>
          )}

          <ResizablePanel defaultSize={rightPanelCollapsed ? 80 : 60}>
            <WorkflowCanvas />
          </ResizablePanel>

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
