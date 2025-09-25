// "use client"

// import { useWorkflowStore } from "@/lib/workflow-store"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { BlockConfiguration } from "./block-configuration"
// import { WorkflowSimulator } from "./workflow-simulator"
// import { ApiIntegrationPanel } from "./api-integration-panel"
// import { WorkflowSettings } from "./workflow-settings"
// import { Settings, TestTube, Zap, Cog } from "lucide-react"

// export function EnhancedRightPanel() {
//   const { rightPanelTab, setRightPanelTab, selectedNode, nodes } = useWorkflowStore()

//   const selectedNodeData = selectedNode ? nodes.find((n) => n.id === selectedNode) : null

//   return (
//     <div className="w-96 bg-card border-l border-border flex flex-col">
//       <Tabs value={rightPanelTab} onValueChange={(value) => setRightPanelTab(value as any)}>
//         <TabsList className="grid w-full grid-cols-4 m-4 mb-0">
//           <TabsTrigger value="config" className="gap-2">
//             <Cog className="h-4 w-4" />
//             Config
//           </TabsTrigger>
//           <TabsTrigger value="test" className="gap-2">
//             <TestTube className="h-4 w-4" />
//             Test
//           </TabsTrigger>
//           <TabsTrigger value="api" className="gap-2">
//             <Zap className="h-4 w-4" />
//             API
//           </TabsTrigger>
//           <TabsTrigger value="settings" className="gap-2">
//             <Settings className="h-4 w-4" />
//             Settings
//           </TabsTrigger>
//         </TabsList>

//         <div className="flex-1 overflow-auto">
//           <TabsContent value="config" className="h-full m-0">
//             {selectedNodeData ? (
//               <BlockConfiguration
//                 node={selectedNodeData}
//                 onUpdate={(updates) => {
//                   const { updateNode } = useWorkflowStore.getState()
//                   updateNode(selectedNode!, updates)
//                 }}
//               />
//             ) : (
//               <div className="p-4 text-center text-muted-foreground">
//                 <Cog className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                 <p>Select a block to configure its properties</p>
//               </div>
//             )}
//           </TabsContent>

//           <TabsContent value="test" className="h-full m-0">
//             <WorkflowSimulator />
//           </TabsContent>

//           <TabsContent value="api" className="h-full m-0">
//             <ApiIntegrationPanel />
//           </TabsContent>

//           <TabsContent value="settings" className="h-full m-0">
//             <WorkflowSettings />
//           </TabsContent>
//         </div>
//       </Tabs>
//     </div>
//   )
// }
// "use client"

// import { useWorkflowStore } from "@/lib/workflow-store"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { BlockConfiguration } from "./block-configuration"
// import { WorkflowSimulator } from "./workflow-simulator"
// import { ApiIntegrationPanel } from "./api-integration-panel"
// import { WorkflowSettings } from "./workflow-settings"
// import { Settings, TestTube, Zap, Cog } from "lucide-react"

// export function EnhancedRightPanel() {
//   const { rightPanelTab, setRightPanelTab, selectedNode, nodes } = useWorkflowStore()

//   const selectedNodeData = selectedNode ? nodes.find((n) => n.id === selectedNode) : null

//   return (
//     <div className="w-96 bg-card border-l border-border flex flex-col">
//       <Tabs value={rightPanelTab} onValueChange={(value) => setRightPanelTab(value as any)}>
//         <TabsList className="grid w-full grid-cols-4 m-4 mb-0">
//           <TabsTrigger value="config" className="gap-2">
//             <Cog className="h-4 w-4" />
//             Config
//           </TabsTrigger>
//           <TabsTrigger value="test" className="gap-2">
//             <TestTube className="h-4 w-4" />
//             Test
//           </TabsTrigger>
//           <TabsTrigger value="api" className="gap-2">
//             <Zap className="h-4 w-4" />
//             API
//           </TabsTrigger>
//           <TabsTrigger value="settings" className="gap-2">
//             <Settings className="h-4 w-4" />
//             Settings
//           </TabsTrigger>
//         </TabsList>

//         <div className="flex-1 overflow-auto">
//           <TabsContent value="config" className="h-full m-0">
//             {selectedNodeData ? (
//               <BlockConfiguration
//                 node={selectedNodeData}
//                 onUpdate={(updates) => {
//                   const { updateNode } = useWorkflowStore.getState()
//                   updateNode(selectedNode!, updates)
//                 }}
//               />
//             ) : (
//               <div className="p-4 text-center text-muted-foreground">
//                 <Cog className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                 <p>Select a block to configure its properties</p>
//               </div>
//             )}
//           </TabsContent>

//           <TabsContent value="test" className="h-full m-0">
//             <WorkflowSimulator />
//           </TabsContent>

//           <TabsContent value="api" className="h-full m-0">
//             <ApiIntegrationPanel />
//           </TabsContent>

//           <TabsContent value="settings" className="h-full m-0">
//             <WorkflowSettings />
//           </TabsContent>
//         </div>
//       </Tabs>
//     </div>
//   )
// }
"use client"

import { useWorkflowStore } from "@/lib/workflow-store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BlockConfiguration } from "./block-configuration"
import { WorkflowSimulator } from "./workflow-simulator"
import { ApiIntegrationPanel } from "./api-integration-panel"
import { WorkflowSettings } from "./workflow-settings"
import { Settings, TestTube, Zap, Cog, ChevronRight, ChevronLeft } from "lucide-react"

export function EnhancedRightPanel() {
  const { rightPanelTab, setRightPanelTab, selectedNode, nodes, rightPanelCollapsed, setRightPanelCollapsed } =
    useWorkflowStore()

  const selectedNodeData = selectedNode ? nodes.find((n) => n.id === selectedNode) : null

  return (
    <div
      className={`relative bg-card border-l border-border flex flex-col transition-all duration-300 flex-shrink-0 ${
        rightPanelCollapsed ? "w-16" : "w-96"
      }`}
    >
      <div className="absolute -left-3 top-4 z-10">
        <Button
          variant="outline"
          size="sm"
          className="h-6 w-6 p-0 rounded-full bg-background border-border shadow-md"
          onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
        >
          {rightPanelCollapsed ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </Button>
      </div>

      {rightPanelCollapsed ? (
        /* Added collapsed state with vertical icons */
        <div className="flex flex-col items-center py-4 gap-2">
          <Button
            variant={rightPanelTab === "config" ? "default" : "ghost"}
            size="sm"
            className="w-10 h-10 p-0"
            onClick={() => {
              setRightPanelTab("config")
              setRightPanelCollapsed(false)
            }}
          >
            <Cog className="h-4 w-4" />
          </Button>
          <Button
            variant={rightPanelTab === "test" ? "default" : "ghost"}
            size="sm"
            className="w-10 h-10 p-0"
            onClick={() => {
              setRightPanelTab("test")
              setRightPanelCollapsed(false)
            }}
          >
            <TestTube className="h-4 w-4" />
          </Button>
          <Button
            variant={rightPanelTab === "api" ? "default" : "ghost"}
            size="sm"
            className="w-10 h-10 p-0"
            onClick={() => {
              setRightPanelTab("api")
              setRightPanelCollapsed(false)
            }}
          >
            <Zap className="h-4 w-4" />
          </Button>
          <Button
            variant={rightPanelTab === "settings" ? "default" : "ghost"}
            size="sm"
            className="w-10 h-10 p-0"
            onClick={() => {
              setRightPanelTab("settings")
              setRightPanelCollapsed(false)
            }}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      ) : (
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
      )}
    </div>
  )
}
