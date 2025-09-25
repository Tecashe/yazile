"use client"

import { useWorkflowStore } from "@/lib/workflow-store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BlockConfiguration } from "./block-configuration"
import { WorkflowSimulator } from "./workflow-simulator"
import { ApiIntegrationPanel } from "./api-integration-panel"
import { WorkflowSettings } from "./workflow-settings"
import { Settings, TestTube, Zap, Cog } from "lucide-react"

export function EnhancedRightPanel() {
  const { rightPanelTab, setRightPanelTab, selectedNode, nodes } = useWorkflowStore()

  const selectedNodeData = selectedNode ? nodes.find((n) => n.id === selectedNode) : null

  return (
    <div className="w-96 bg-card border-l border-border flex flex-col">
      <Tabs value={rightPanelTab} onValueChange={(value) => setRightPanelTab(value as any)}>
        <TabsList className="grid w-full grid-cols-4 m-4 mb-0">
          <TabsTrigger value="config" className="gap-2">
            <Cog className="h-4 w-4" />
            Config
          </TabsTrigger>
          <TabsTrigger value="test" className="gap-2">
            <TestTube className="h-4 w-4" />
            Test
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-2">
            <Zap className="h-4 w-4" />
            API
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto">
          <TabsContent value="config" className="h-full m-0">
            {selectedNodeData ? (
              <BlockConfiguration
                node={selectedNodeData}
                onUpdate={(updates) => {
                  const { updateNode } = useWorkflowStore.getState()
                  updateNode(selectedNode!, updates)
                }}
              />
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                <Cog className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a block to configure its properties</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="test" className="h-full m-0">
            <WorkflowSimulator />
          </TabsContent>

          <TabsContent value="api" className="h-full m-0">
            <ApiIntegrationPanel />
          </TabsContent>

          <TabsContent value="settings" className="h-full m-0">
            <WorkflowSettings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
