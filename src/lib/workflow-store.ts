

// import { create } from "zustand"
// import { persist } from "zustand/middleware"

// export interface WorkflowNode {
//   id: string
//   type: "trigger" | "text" | "button" | "image" | "condition" | "delay" | "api" | "webhook"
//   position: { x: number; y: number }
//   data: any
//   connections: string[]
// }

// interface WorkflowStore {
//   // State
//   nodes: WorkflowNode[]
//   selectedNode: string | null
//   isRunning: boolean
//   workflowName: string
//   workflowDescription: string
//   sidebarCollapsed: boolean
//   rightPanelCollapsed: boolean

//   // Actions
//   addNode: (node: WorkflowNode) => void
//   updateNode: (id: string, updates: Partial<WorkflowNode>) => void
//   deleteNode: (id: string) => void
//   connectNodes: (fromId: string, toId: string) => void
//   disconnectNodes: (fromId: string, toId: string) => void
//   setSelectedNode: (id: string | null) => void
//   setIsRunning: (running: boolean) => void
//   setSidebarCollapsed: (collapsed: boolean) => void
//   setRightPanelCollapsed: (collapsed: boolean) => void
//   setWorkflowMetadata: (id: string | null, name: string, description: string) => void
//   saveWorkflow: () => void
//   loadWorkflow: () => void
//   exportWorkflow: () => string
//   importWorkflow: (data: string) => void
//   createNewWorkflow: () => void
//   validateWorkflow: () => { isValid: boolean; errors: string[] }
//   testWorkflow: (context: any) => Promise<any>
// }

// export const useWorkflowStore = create<WorkflowStore>()(
//   persist(
//     (set, get) => ({
//       // Initial state
//       nodes: [
//         {
//           id: "start-trigger",
//           type: "trigger",
//           position: { x: 100, y: 100 },
//           data: {
//             title: "DM Received",
//             description: "When someone sends a direct message",
//             triggerType: "dm",
//             platforms: ["instagram"],
//           },
//           connections: [],
//         },
//       ],
//       selectedNode: null,
//       isRunning: false,
//       workflowName: "Social Media Automation",
//       workflowDescription: "Automated responses for Instagram DMs and comments",
//       sidebarCollapsed: false,
//       rightPanelCollapsed: false,

//       // Actions
//       addNode: (node) =>
//         set((state) => ({
//           nodes: [...state.nodes, node],
//         })),

//       updateNode: (id, updates) =>
//         set((state) => ({
//           nodes: state.nodes.map((node) => (node.id === id ? { ...node, ...updates } : node)),
//         })),

//       deleteNode: (id) =>
//         set((state) => ({
//           nodes: state.nodes.filter((node) => node.id !== id),
//           selectedNode: state.selectedNode === id ? null : state.selectedNode,
//         })),

//       connectNodes: (fromId, toId) =>
//         set((state) => ({
//           nodes: state.nodes.map((node) =>
//             node.id === fromId ? { ...node, connections: [...node.connections, toId] } : node,
//           ),
//         })),

//       disconnectNodes: (fromId, toId) =>
//         set((state) => ({
//           nodes: state.nodes.map((node) =>
//             node.id === fromId ? { ...node, connections: node.connections.filter((id) => id !== toId) } : node,
//           ),
//         })),

//       setSelectedNode: (id) => set({ selectedNode: id }),
//       setIsRunning: (running) => set({ isRunning: running }),
//       setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
//       setRightPanelCollapsed: (collapsed) => set({ rightPanelCollapsed: collapsed }),

//       setWorkflowMetadata: (id, name, description) =>
//         set({
//           workflowName: name,
//           workflowDescription: description,
//         }),

//       saveWorkflow: () => {
//         const state = get()
//         const workflowData = {
//           nodes: state.nodes,
//           metadata: {
//             name: state.workflowName,
//             description: state.workflowDescription,
//             version: "1.0.0",
//             updatedAt: new Date().toISOString(),
//           },
//         }
//         localStorage.setItem("workflow-backup", JSON.stringify(workflowData))
//       },

//       loadWorkflow: () => {
//         try {
//           const saved = localStorage.getItem("workflow-backup")
//           if (saved) {
//             const data = JSON.parse(saved)
//             set({
//               nodes: data.nodes || [],
//               workflowName: data.metadata?.name || "Untitled Workflow",
//               workflowDescription: data.metadata?.description || "",
//             })
//           }
//         } catch (error) {
//           console.error("Failed to load workflow:", error)
//         }
//       },

//       exportWorkflow: () => {
//         const state = get()
//         return JSON.stringify(
//           {
//             nodes: state.nodes,
//             metadata: {
//               name: state.workflowName,
//               description: state.workflowDescription,
//               exportedAt: new Date().toISOString(),
//             },
//           },
//           null,
//           2,
//         )
//       },

//       importWorkflow: (data) => {
//         try {
//           const parsed = JSON.parse(data)
//           set({
//             nodes: parsed.nodes || [],
//             workflowName: parsed.metadata?.name || "Imported Workflow",
//             workflowDescription: parsed.metadata?.description || "",
//           })
//         } catch (error) {
//           console.error("Failed to import workflow:", error)
//         }
//       },

//       createNewWorkflow: () =>
//         set({
//           nodes: [
//             {
//               id: "start-trigger",
//               type: "trigger",
//               position: { x: 100, y: 100 },
//               data: {
//                 title: "New Trigger",
//                 description: "Configure trigger conditions",
//               },
//               connections: [],
//             },
//           ],
//           selectedNode: null,
//           workflowName: "New Workflow",
//           workflowDescription: "",
//         }),

//       validateWorkflow: () => {
//         const state = get()
//         const errors: string[] = []

//         if (state.nodes.length === 0) {
//           errors.push("Workflow must have at least one node")
//         }

//         const triggerNodes = state.nodes.filter((n) => n.type === "trigger")
//         if (triggerNodes.length === 0) {
//           errors.push("Workflow must have at least one trigger")
//         }

//         return {
//           isValid: errors.length === 0,
//           errors,
//         }
//       },

//       testWorkflow: async (context) => {
//         // Mock test implementation
//         return new Promise((resolve) => {
//           setTimeout(() => {
//             resolve({ success: true, context })
//           }, 1000)
//         })
//       },
//     }),
//     {
//       name: "workflow-store",
//       partialize: (state) => ({
//         nodes: state.nodes,
//         workflowName: state.workflowName,
//         workflowDescription: state.workflowDescription,
//       }),
//     },
//   ),
// )


// import { create } from "zustand"
// import { persist } from "zustand/middleware"

// export interface WorkflowNode {
//   id: string
//   type: "trigger" | "text" | "button" | "image" | "condition" | "delay" | "api" | "webhook"
//   position: { x: number; y: number }
//   data: any
//   connections: string[]
// }

// export interface WorkflowConnection {
//   id: string
//   fromNodeId: string
//   toNodeId: string
//   fromHandle?: string
//   toHandle?: string
// }

// interface WorkflowStore {
//   // State
//   nodes: WorkflowNode[]
//   connections: WorkflowConnection[] // Added connections array to store
//   selectedNode: string | null
//   isRunning: boolean
//   workflowName: string
//   workflowDescription: string
//   sidebarCollapsed: boolean
//   rightPanelCollapsed: boolean
//   connectionMode: { active: boolean; fromNodeId: string | null }

//   // Actions
//   addNode: (node: WorkflowNode) => void
//   updateNode: (id: string, updates: Partial<WorkflowNode>) => void
//   deleteNode: (id: string) => void
//   connectNodes: (fromId: string, toId: string) => void
//   disconnectNodes: (fromId: string, toId: string) => void
//   setSelectedNode: (id: string | null) => void
//   setIsRunning: (running: boolean) => void
//   setSidebarCollapsed: (collapsed: boolean) => void
//   setRightPanelCollapsed: (collapsed: boolean) => void
//   setWorkflowMetadata: (id: string | null, name: string, description: string) => void
//   startConnection: (fromNodeId: string) => void
//   cancelConnection: () => void
//   saveWorkflow: () => void
//   loadWorkflow: () => void
//   exportWorkflow: () => string
//   importWorkflow: (data: string) => void
//   createNewWorkflow: () => void
//   validateWorkflow: () => { isValid: boolean; errors: string[] }
//   testWorkflow: (context: any) => Promise<any>
// }

// export const useWorkflowStore = create<WorkflowStore>()(
//   persist(
//     (set, get) => ({
//       // Initial state
//       nodes: [
//         {
//           id: "start-trigger",
//           type: "trigger",
//           position: { x: 100, y: 100 },
//           data: {
//             title: "DM Received",
//             description: "When someone sends a direct message",
//             triggerType: "dm",
//             platforms: ["instagram"],
//           },
//           connections: [],
//         },
//       ],
//       connections: [], // Initialize connections array
//       selectedNode: null,
//       isRunning: false,
//       workflowName: "Social Media Automation",
//       workflowDescription: "Automated responses for Instagram DMs and comments",
//       sidebarCollapsed: false,
//       rightPanelCollapsed: false,
//       connectionMode: { active: false, fromNodeId: null }, // Initialize connection mode

//       // Actions
//       addNode: (node) =>
//         set((state) => ({
//           nodes: [...state.nodes, node],
//         })),

//       updateNode: (id, updates) =>
//         set((state) => ({
//           nodes: state.nodes.map((node) => (node.id === id ? { ...node, ...updates } : node)),
//         })),

//       deleteNode: (id) =>
//         set((state) => ({
//           nodes: state.nodes.filter((node) => node.id !== id),
//           connections: state.connections.filter((conn) => conn.fromNodeId !== id && conn.toNodeId !== id),
//           selectedNode: state.selectedNode === id ? null : state.selectedNode,
//         })),

//       connectNodes: (fromId, toId) =>
//         set((state) => {
//           // Prevent duplicate connections
//           const existingConnection = state.connections.find(
//             (conn) => conn.fromNodeId === fromId && conn.toNodeId === toId,
//           )
//           if (existingConnection) return state

//           const newConnection: WorkflowConnection = {
//             id: `${fromId}-${toId}`,
//             fromNodeId: fromId,
//             toNodeId: toId,
//           }

//           return {
//             nodes: state.nodes.map((node) =>
//               node.id === fromId ? { ...node, connections: [...node.connections, toId] } : node,
//             ),
//             connections: [...state.connections, newConnection],
//             connectionMode: { active: false, fromNodeId: null },
//           }
//         }),

//       disconnectNodes: (fromId, toId) =>
//         set((state) => ({
//           nodes: state.nodes.map((node) =>
//             node.id === fromId ? { ...node, connections: node.connections.filter((id) => id !== toId) } : node,
//           ),
//           connections: state.connections.filter((conn) => !(conn.fromNodeId === fromId && conn.toNodeId === toId)),
//         })),

//       setSelectedNode: (id) => set({ selectedNode: id }),
//       setIsRunning: (running) => set({ isRunning: running }),
//       setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
//       setRightPanelCollapsed: (collapsed) => set({ rightPanelCollapsed: collapsed }),

//       setWorkflowMetadata: (id, name, description) =>
//         set({
//           workflowName: name,
//           workflowDescription: description,
//         }),

//       startConnection: (fromNodeId) =>
//         set({
//           connectionMode: { active: true, fromNodeId },
//         }),

//       cancelConnection: () =>
//         set({
//           connectionMode: { active: false, fromNodeId: null },
//         }),

//       saveWorkflow: () => {
//         const state = get()
//         const workflowData = {
//           nodes: state.nodes,
//           connections: state.connections, // Include connections in save
//           metadata: {
//             name: state.workflowName,
//             description: state.workflowDescription,
//             version: "1.0.0",
//             updatedAt: new Date().toISOString(),
//           },
//         }
//         localStorage.setItem("workflow-backup", JSON.stringify(workflowData))
//       },

//       loadWorkflow: () => {
//         try {
//           const saved = localStorage.getItem("workflow-backup")
//           if (saved) {
//             const data = JSON.parse(saved)
//             set({
//               nodes: data.nodes || [],
//               connections: data.connections || [], // Load connections
//               workflowName: data.metadata?.name || "Untitled Workflow",
//               workflowDescription: data.metadata?.description || "",
//             })
//           }
//         } catch (error) {
//           console.error("Failed to load workflow:", error)
//         }
//       },

//       exportWorkflow: () => {
//         const state = get()
//         return JSON.stringify(
//           {
//             nodes: state.nodes,
//             connections: state.connections, // Include connections in export
//             metadata: {
//               name: state.workflowName,
//               description: state.workflowDescription,
//               exportedAt: new Date().toISOString(),
//             },
//           },
//           null,
//           2,
//         )
//       },

//       importWorkflow: (data) => {
//         try {
//           const parsed = JSON.parse(data)
//           set({
//             nodes: parsed.nodes || [],
//             connections: parsed.connections || [], // Import connections
//             workflowName: parsed.metadata?.name || "Imported Workflow",
//             workflowDescription: parsed.metadata?.description || "",
//           })
//         } catch (error) {
//           console.error("Failed to import workflow:", error)
//         }
//       },

//       createNewWorkflow: () =>
//         set({
//           nodes: [
//             {
//               id: "start-trigger",
//               type: "trigger",
//               position: { x: 100, y: 100 },
//               data: {
//                 title: "New Trigger",
//                 description: "Configure trigger conditions",
//               },
//               connections: [],
//             },
//           ],
//           connections: [], // Reset connections
//           selectedNode: null,
//           workflowName: "New Workflow",
//           workflowDescription: "",
//           connectionMode: { active: false, fromNodeId: null }, // Reset connection mode
//         }),

//       validateWorkflow: () => {
//         const state = get()
//         const errors: string[] = []

//         if (state.nodes.length === 0) {
//           errors.push("Workflow must have at least one node")
//         }

//         const triggerNodes = state.nodes.filter((n) => n.type === "trigger")
//         if (triggerNodes.length === 0) {
//           errors.push("Workflow must have at least one trigger")
//         }

//         return {
//           isValid: errors.length === 0,
//           errors,
//         }
//       },

//       testWorkflow: async (context) => {
//         // Mock test implementation
//         return new Promise((resolve) => {
//           setTimeout(() => {
//             resolve({ success: true, context })
//           }, 1000)
//         })
//       },
//     }),
//     {
//       name: "workflow-store",
//       partialize: (state) => ({
//         nodes: state.nodes,
//         connections: state.connections, // Persist connections
//         workflowName: state.workflowName,
//         workflowDescription: state.workflowDescription,
//       }),
//     },
//   ),
// )

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface WorkflowNode {
  id: string
  type: "trigger" | "text" | "button" | "image" | "condition" | "delay" | "api" | "webhook"
  position: { x: number; y: number }
  data: any
  connections: string[]
}

export interface WorkflowConnection {
  id: string
  fromNodeId: string
  toNodeId: string
  fromHandle?: string
  toHandle?: string
}

interface WorkflowStore {
  // State
  nodes: WorkflowNode[]
  connections: WorkflowConnection[]
  selectedNode: string | null
  isRunning: boolean
  workflowName: string
  workflowDescription: string
  sidebarCollapsed: boolean
  rightPanelCollapsed: boolean
  connectionMode: { active: boolean; fromNodeId: string | null; fromHandle?: string }

  // Actions
  addNode: (node: WorkflowNode) => void
  updateNode: (id: string, updates: Partial<WorkflowNode>) => void
  deleteNode: (id: string) => void
  connectNodes: (fromId: string, toId: string, fromHandle?: string, toHandle?: string) => void
  disconnectNodes: (fromId: string, toId: string, fromHandle?: string) => void
  setSelectedNode: (id: string | null) => void
  setIsRunning: (running: boolean) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setRightPanelCollapsed: (collapsed: boolean) => void
  setWorkflowMetadata: (id: string | null, name: string, description: string) => void
  startConnection: (fromNodeId: string, fromHandle?: string) => void
  cancelConnection: () => void
  saveWorkflow: () => void
  loadWorkflow: () => void
  exportWorkflow: () => string
  importWorkflow: (data: string) => void
  createNewWorkflow: () => void
  validateWorkflow: () => { isValid: boolean; errors: string[] }
  testWorkflow: (context: any) => Promise<any>
}

export const useWorkflowStore = create<WorkflowStore>()(
  persist(
    (set, get) => ({
      // Initial state
      nodes: [
        {
          id: "start-trigger",
          type: "trigger",
          position: { x: 100, y: 100 },
          data: {
            title: "DM Received",
            description: "When someone sends a direct message",
            triggerType: "dm",
            platforms: ["instagram"],
          },
          connections: [],
        },
      ],
      connections: [],
      selectedNode: null,
      isRunning: false,
      workflowName: "Social Media Automation",
      workflowDescription: "Automated responses for Instagram DMs and comments",
      sidebarCollapsed: false,
      rightPanelCollapsed: false,
      connectionMode: { active: false, fromNodeId: null },

      // Actions
      addNode: (node) =>
        set((state) => ({
          nodes: [...state.nodes, node],
        })),

      updateNode: (id, updates) =>
        set((state) => ({
          nodes: state.nodes.map((node) => (node.id === id ? { ...node, ...updates } : node)),
        })),

      deleteNode: (id) =>
        set((state) => ({
          nodes: state.nodes.filter((node) => node.id !== id),
          connections: state.connections.filter((conn) => conn.fromNodeId !== id && conn.toNodeId !== id),
          selectedNode: state.selectedNode === id ? null : state.selectedNode,
        })),

      connectNodes: (fromId, toId, fromHandle?, toHandle?) =>
        set((state) => {
          // Prevent duplicate connections with the same handle
          const existingConnection = state.connections.find(
            (conn) => 
              conn.fromNodeId === fromId && 
              conn.toNodeId === toId &&
              conn.fromHandle === fromHandle
          )
          if (existingConnection) return state

          // Generate unique connection ID that includes handle info
          const handleSuffix = fromHandle ? `-${fromHandle}` : ''
          const newConnection: WorkflowConnection = {
            id: `${fromId}-${toId}${handleSuffix}`,
            fromNodeId: fromId,
            toNodeId: toId,
            fromHandle,
            toHandle,
          }

          return {
            nodes: state.nodes.map((node) =>
              node.id === fromId ? { ...node, connections: [...node.connections, toId] } : node,
            ),
            connections: [...state.connections, newConnection],
            connectionMode: { active: false, fromNodeId: null },
          }
        }),

      disconnectNodes: (fromId, toId, fromHandle?) =>
        set((state) => ({
          nodes: state.nodes.map((node) =>
            node.id === fromId ? { ...node, connections: node.connections.filter((id) => id !== toId) } : node,
          ),
          connections: state.connections.filter((conn) => 
            !(conn.fromNodeId === fromId && conn.toNodeId === toId && conn.fromHandle === fromHandle)
          ),
        })),

      setSelectedNode: (id) => set({ selectedNode: id }),
      setIsRunning: (running) => set({ isRunning: running }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setRightPanelCollapsed: (collapsed) => set({ rightPanelCollapsed: collapsed }),

      setWorkflowMetadata: (id, name, description) =>
        set({
          workflowName: name,
          workflowDescription: description,
        }),

      startConnection: (fromNodeId, fromHandle?) =>
        set({
          connectionMode: { active: true, fromNodeId, fromHandle },
        }),

      cancelConnection: () =>
        set({
          connectionMode: { active: false, fromNodeId: null, fromHandle: undefined },
        }),

      saveWorkflow: () => {
        const state = get()
        const workflowData = {
          nodes: state.nodes,
          connections: state.connections,
          metadata: {
            name: state.workflowName,
            description: state.workflowDescription,
            version: "1.0.0",
            updatedAt: new Date().toISOString(),
          },
        }
        localStorage.setItem("workflow-backup", JSON.stringify(workflowData))
      },

      loadWorkflow: () => {
        try {
          const saved = localStorage.getItem("workflow-backup")
          if (saved) {
            const data = JSON.parse(saved)
            set({
              nodes: data.nodes || [],
              connections: data.connections || [],
              workflowName: data.metadata?.name || "Untitled Workflow",
              workflowDescription: data.metadata?.description || "",
            })
          }
        } catch (error) {
          console.error("Failed to load workflow:", error)
        }
      },

      exportWorkflow: () => {
        const state = get()
        return JSON.stringify(
          {
            nodes: state.nodes,
            connections: state.connections,
            metadata: {
              name: state.workflowName,
              description: state.workflowDescription,
              exportedAt: new Date().toISOString(),
            },
          },
          null,
          2,
        )
      },

      importWorkflow: (data) => {
        try {
          const parsed = JSON.parse(data)
          set({
            nodes: parsed.nodes || [],
            connections: parsed.connections || [],
            workflowName: parsed.metadata?.name || "Imported Workflow",
            workflowDescription: parsed.metadata?.description || "",
          })
        } catch (error) {
          console.error("Failed to import workflow:", error)
        }
      },

      createNewWorkflow: () =>
        set({
          nodes: [
            {
              id: "start-trigger",
              type: "trigger",
              position: { x: 100, y: 100 },
              data: {
                title: "New Trigger",
                description: "Configure trigger conditions",
              },
              connections: [],
            },
          ],
          connections: [],
          selectedNode: null,
          workflowName: "New Workflow",
          workflowDescription: "",
          connectionMode: { active: false, fromNodeId: null },
        }),

      validateWorkflow: () => {
        const state = get()
        const errors: string[] = []

        if (state.nodes.length === 0) {
          errors.push("Workflow must have at least one node")
        }

        const triggerNodes = state.nodes.filter((n) => n.type === "trigger")
        if (triggerNodes.length === 0) {
          errors.push("Workflow must have at least one trigger")
        }

        // Validate condition nodes have proper connections
        const conditionNodes = state.nodes.filter((n) => n.type === "condition")
        conditionNodes.forEach((node) => {
          const trueConnection = state.connections.find(
            (conn) => conn.fromNodeId === node.id && conn.fromHandle === "true"
          )
          const falseConnection = state.connections.find(
            (conn) => conn.fromNodeId === node.id && conn.fromHandle === "false"
          )
          
          if (!trueConnection) {
            errors.push(`Condition node "${node.data.title || node.id}" missing "true" path`)
          }
          if (!falseConnection) {
            errors.push(`Condition node "${node.data.title || node.id}" missing "false" path`)
          }
        })

        // Check for orphaned nodes (except trigger nodes)
        const connectedNodeIds = new Set(state.connections.map(conn => conn.toNodeId))
        const triggerNodeIds = new Set(triggerNodes.map(n => n.id))
        
        state.nodes.forEach((node) => {
          if (!triggerNodeIds.has(node.id) && !connectedNodeIds.has(node.id)) {
            errors.push(`Node "${node.data.title || node.id}" is not connected to the workflow`)
          }
        })

        return {
          isValid: errors.length === 0,
          errors,
        }
      },

      testWorkflow: async (context) => {
        // Mock test implementation
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ success: true, context })
          }, 1000)
        })
      },
    }),
    {
      name: "workflow-store",
      partialize: (state) => ({
        nodes: state.nodes,
        connections: state.connections,
        workflowName: state.workflowName,
        workflowDescription: state.workflowDescription,
      }),
    },
  ),
)