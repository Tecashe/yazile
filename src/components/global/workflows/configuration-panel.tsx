// "use client"

// import { useWorkflowStore } from "@/lib/workflow-store"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { BlockConfiguration } from "./block-configuration"
// import { WorkflowTester } from "./workflow-tester"
// import { WorkflowSettings } from "./workflow-settings"
// import { Settings, TestTube, Wrench } from "lucide-react"

// export function ConfigurationPanel() {
//   const { selectedNode, nodes } = useWorkflowStore()
//   const selectedNodeData = selectedNode ? nodes.find((n) => n.id === selectedNode) : null

//   return (
//     <div className="h-full bg-card border-l border-border flex flex-col">
//       <Tabs defaultValue="configure" className="h-full flex flex-col">
//         <div className="p-4 border-b border-border">
//           <TabsList className="grid w-full grid-cols-3">
//             <TabsTrigger value="configure" className="flex items-center gap-2">
//               <Wrench className="h-4 w-4" />
//               Configure
//             </TabsTrigger>
//             <TabsTrigger value="test" className="flex items-center gap-2">
//               <TestTube className="h-4 w-4" />
//               Test
//             </TabsTrigger>
//             <TabsTrigger value="settings" className="flex items-center gap-2">
//               <Settings className="h-4 w-4" />
//               Settings
//             </TabsTrigger>
//           </TabsList>
//         </div>

//         <div className="flex-1 overflow-hidden">
//           <TabsContent value="configure" className="h-full m-0">
//             <ScrollArea className="h-full">
//               {selectedNodeData ? (
//                 <BlockConfiguration node={selectedNodeData} />
//               ) : (
//                 <div className="p-6 text-center">
//                   <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
//                     <Wrench className="h-8 w-8 text-muted-foreground" />
//                   </div>
//                   <h3 className="text-lg font-medium mb-2">No Block Selected</h3>
//                   <p className="text-sm text-muted-foreground leading-relaxed">
//                     Click on a block in the canvas to configure its properties and settings.
//                   </p>
//                 </div>
//               )}
//             </ScrollArea>
//           </TabsContent>

//           <TabsContent value="test" className="h-full m-0">
//             <ScrollArea className="h-full">
//               <div className="p-4">
//                 <WorkflowTester />
//               </div>
//             </ScrollArea>
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

import { useWorkflowStore } from "@/lib/workflow-store-production"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BlockConfiguration } from "./block-configuration"
import { WorkflowTester } from "./workflow-tester"
import { WorkflowSettings } from "./workflow-settings"
import { Settings, TestTube, Wrench } from "lucide-react"

export function ConfigurationPanel() {
  const { selectedNode, nodes } = useWorkflowStore()
  const selectedNodeData = selectedNode ? nodes.find((n) => n.id === selectedNode) : null

  return (
    <div className="h-full bg-card border-l border-border flex flex-col">
      <Tabs defaultValue="configure" className="h-full flex flex-col">
        <div className="p-4 border-b border-border">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="configure" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Configure
            </TabsTrigger>
            <TabsTrigger value="test" className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              Test
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="configure" className="h-full m-0">
            <ScrollArea className="h-full">
              {selectedNodeData ? (
                <BlockConfiguration node={selectedNodeData} />
              ) : (
                <div className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Wrench className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Block Selected</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Click on a block in the canvas to configure its properties and settings.
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="test" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="p-4">
                <WorkflowTester />
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="settings" className="h-full m-0">
            <WorkflowSettings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
