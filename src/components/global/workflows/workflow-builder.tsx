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
      <div className="flex-shrink-0 z-50">
        <WorkflowHeader />
      </div>

      <div className="flex-1 overflow-hidden relative">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {!sidebarCollapsed && (
            <>
              <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="relative z-40">
                <div className="h-full overflow-hidden">
                  <BlockPalette />
                </div>
              </ResizablePanel>
              <ResizableHandle className="z-30" />
            </>
          )}

          <ResizablePanel defaultSize={rightPanelCollapsed ? 80 : 60} className="relative">
            <div className="h-full w-full overflow-hidden">
              <WorkflowCanvas />
            </div>
          </ResizablePanel>

          {!rightPanelCollapsed && (
            <>
              <ResizableHandle className="z-30" />
              <ResizablePanel defaultSize={20} minSize={15} maxSize={35} className="relative z-40">
                <div className="h-full overflow-hidden">
                  <ConfigurationPanel />
                </div>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
