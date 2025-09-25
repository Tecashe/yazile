// "use client"

// import type React from "react"

// import { useState } from "react"
// import { useWorkflowStore } from "@/lib/workflow-store"
// import { Button } from "@/components/ui/button"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { Draggable, Droppable } from "@hello-pangea/dnd"
// import {
//   MessageSquare,
//   MousePointer,
//   ImageIcon,
//   GitBranch,
//   Clock,
//   Zap,
//   Webhook,
//   ChevronRight,
//   ChevronLeft,
//   Sparkles,
// } from "lucide-react"

// const blockTypes = [
//   {
//     type: "trigger",
//     label: "Trigger",
//     icon: Sparkles,
//     description: "Start workflow on DM/comment",
//     color: "text-green-400",
//   },
//   {
//     type: "text",
//     label: "Text Message",
//     icon: MessageSquare,
//     description: "Send text response",
//     color: "text-blue-400",
//   },
//   {
//     type: "button",
//     label: "Button Menu",
//     icon: MousePointer,
//     description: "Interactive button options",
//     color: "text-purple-400",
//   },
//   {
//     type: "image",
//     label: "Image",
//     icon: ImageIcon,
//     description: "Send image with caption",
//     color: "text-pink-400",
//   },
//   {
//     type: "condition",
//     label: "Condition",
//     icon: GitBranch,
//     description: "Branch based on conditions",
//     color: "text-yellow-400",
//   },
//   {
//     type: "delay",
//     label: "Delay",
//     icon: Clock,
//     description: "Wait before next action",
//     color: "text-orange-400",
//   },
//   {
//     type: "api",
//     label: "API Call",
//     icon: Zap,
//     description: "Make external API request",
//     color: "text-cyan-400",
//   },
//   {
//     type: "webhook",
//     label: "Webhook",
//     icon: Webhook,
//     description: "Send data to external service",
//     color: "text-red-400",
//   },
// ]

// export function CollapsibleBlockPalette() {
//   const { sidebarCollapsed, setSidebarCollapsed } = useWorkflowStore()
//   const [hoveredBlock, setHoveredBlock] = useState<string | null>(null)

//   const handleDragStart = (e: React.DragEvent, blockType: string) => {
//     e.dataTransfer.setData("application/json", JSON.stringify({ type: blockType }))
//     e.dataTransfer.effectAllowed = "copy"
//   }

//   return (
//     <TooltipProvider>
//       <div
//         className={`fixed left-0 top-16 bottom-0 bg-card border-r border-border transition-all duration-300 z-40 ${
//           sidebarCollapsed ? "w-16" : "w-80"
//         }`}
//         onMouseEnter={() => !sidebarCollapsed && setSidebarCollapsed(false)}
//       >
//         <div className="absolute -right-3 top-4 z-50">
//           <Button
//             variant="outline"
//             size="sm"
//             className="h-6 w-6 p-0 rounded-full bg-background border-border"
//             onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
//           >
//             {sidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
//           </Button>
//         </div>

//         <div className="p-4 h-full overflow-y-auto">
//           {!sidebarCollapsed && (
//             <div className="mb-6">
//               <h2 className="text-lg font-semibold text-foreground mb-2">Workflow Blocks</h2>
//               <p className="text-sm text-muted-foreground">Drag blocks to the canvas to build your automation</p>
//             </div>
//           )}

//           <Droppable droppableId="block-palette" isDropDisabled>
//             {(provided) => (
//               <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
//                 {blockTypes.map((block, index) => (
//                   <Draggable key={block.type} draggableId={block.type} index={index}>
//                     {(provided, snapshot) => (
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <div
//                             ref={provided.innerRef}
//                             {...provided.draggableProps}
//                             {...provided.dragHandleProps}
//                             className={`
//                               group relative cursor-grab active:cursor-grabbing
//                               ${sidebarCollapsed ? "w-12 h-12" : "w-full"}
//                               ${snapshot.isDragging ? "opacity-50" : ""}
//                             `}
//                             onMouseEnter={() => setHoveredBlock(block.type)}
//                             onMouseLeave={() => setHoveredBlock(null)}
//                             onDragStart={(e) => handleDragStart(e, block.type)}
//                             draggable
//                           >
//                             <div
//                               className={`
//                                 flex items-center gap-3 p-3 rounded-lg border border-border
//                                 bg-card hover:bg-accent hover:border-primary/50
//                                 transition-all duration-200 hover:shadow-md
//                                 ${sidebarCollapsed ? "justify-center" : ""}
//                                 ${hoveredBlock === block.type ? "scale-105" : ""}
//                               `}
//                             >
//                               <block.icon className={`h-5 w-5 ${block.color} flex-shrink-0`} />

//                               {!sidebarCollapsed && (
//                                 <div className="flex-1 min-w-0">
//                                   <div className="font-medium text-foreground text-sm">{block.label}</div>
//                                   <div className="text-xs text-muted-foreground truncate">{block.description}</div>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </TooltipTrigger>
//                         {sidebarCollapsed && (
//                           <TooltipContent side="right" className="ml-2">
//                             <div>
//                               <div className="font-medium">{block.label}</div>
//                               <div className="text-xs text-muted-foreground">{block.description}</div>
//                             </div>
//                           </TooltipContent>
//                         )}
//                       </Tooltip>
//                     )}
//                   </Draggable>
//                 ))}
//                 {provided.placeholder}
//               </div>
//             )}
//           </Droppable>
//         </div>
//       </div>
//     </TooltipProvider>
//   )
// }

"use client"

import type React from "react"

import { useState } from "react"
import { useWorkflowStore } from "@/lib/workflow-store"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Draggable, Droppable } from "@hello-pangea/dnd"
import {
  MessageSquare,
  MousePointer,
  ImageIcon,
  GitBranch,
  Clock,
  Zap,
  Webhook,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from "lucide-react"

const blockTypes = [
  {
    type: "trigger",
    label: "Trigger",
    icon: Sparkles,
    description: "Start workflow on DM/comment",
    color: "text-green-400",
  },
  {
    type: "text",
    label: "Text Message",
    icon: MessageSquare,
    description: "Send text response",
    color: "text-blue-400",
  },
  {
    type: "button",
    label: "Button Menu",
    icon: MousePointer,
    description: "Interactive button options",
    color: "text-purple-400",
  },
  {
    type: "image",
    label: "Image",
    icon: ImageIcon,
    description: "Send image with caption",
    color: "text-pink-400",
  },
  {
    type: "condition",
    label: "Condition",
    icon: GitBranch,
    description: "Branch based on conditions",
    color: "text-yellow-400",
  },
  {
    type: "delay",
    label: "Delay",
    icon: Clock,
    description: "Wait before next action",
    color: "text-orange-400",
  },
  {
    type: "api",
    label: "API Call",
    icon: Zap,
    description: "Make external API request",
    color: "text-cyan-400",
  },
  {
    type: "webhook",
    label: "Webhook",
    icon: Webhook,
    description: "Send data to external service",
    color: "text-red-400",
  },
]

export function CollapsibleBlockPalette() {
  const { sidebarCollapsed, setSidebarCollapsed } = useWorkflowStore()
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, blockType: string) => {
    e.dataTransfer.setData("application/json", JSON.stringify({ type: blockType }))
    e.dataTransfer.effectAllowed = "copy"
  }

  return (
    <TooltipProvider>
      <div
        className={`fixed left-0 top-16 bottom-0 bg-card border-r border-border transition-all duration-300 z-40 ${
          sidebarCollapsed ? "w-16" : "w-80"
        }`}
        onMouseEnter={() => !sidebarCollapsed && setSidebarCollapsed(false)}
      >
        <div className="absolute -right-3 top-4 z-50">
          <Button
            variant="outline"
            size="sm"
            className="h-6 w-6 p-0 rounded-full bg-background border-border"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          </Button>
        </div>

        <div className="p-4 h-full overflow-y-auto">
          {!sidebarCollapsed && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-2">Workflow Blocks</h2>
              <p className="text-sm text-muted-foreground">Drag blocks to the canvas to build your automation</p>
            </div>
          )}

          <Droppable droppableId="block-palette" isDropDisabled>
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                {blockTypes.map((block, index) => (
                  <Draggable key={block.type} draggableId={block.type} index={index}>
                    {(provided, snapshot) => (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`
                              group relative cursor-grab active:cursor-grabbing
                              ${sidebarCollapsed ? "w-12 h-12" : "w-full"}
                              ${snapshot.isDragging ? "opacity-50" : ""}
                            `}
                            onMouseEnter={() => setHoveredBlock(block.type)}
                            onMouseLeave={() => setHoveredBlock(null)}
                            onDragStart={(e) => handleDragStart(e, block.type)}
                            draggable
                          >
                            <div
                              className={`
                                flex items-center gap-3 p-3 rounded-lg border border-border
                                bg-card hover:bg-accent hover:border-primary/50
                                transition-all duration-200 hover:shadow-md
                                ${sidebarCollapsed ? "justify-center" : ""}
                                ${hoveredBlock === block.type ? "scale-105" : ""}
                              `}
                            >
                              <block.icon className={`h-5 w-5 ${block.color} flex-shrink-0`} />

                              {!sidebarCollapsed && (
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-foreground text-sm">{block.label}</div>
                                  <div className="text-xs text-muted-foreground truncate">{block.description}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </TooltipTrigger>
                        {sidebarCollapsed && (
                          <TooltipContent side="right" className="ml-2">
                            <div>
                              <div className="font-medium">{block.label}</div>
                              <div className="text-xs text-muted-foreground">{block.description}</div>
                            </div>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>
    </TooltipProvider>
  )
}
