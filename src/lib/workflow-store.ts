// still in use
"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { toast } from "sonner"
import type { WorkflowNode } from "@/types/workflow"

interface WorkflowStore {
  // Current workflow state
  nodes: WorkflowNode[]
  selectedNode: string | null
  isRunning: boolean
  isDirty: boolean

  // Workflow metadata
  workflowId: string | null
  workflowName: string
  workflowDescription: string
  userId: string | null

  // UI state
  sidebarCollapsed: boolean
  rightPanelTab: "config" | "test" | "api" | "settings"

  // Actions
  setNodes: (nodes: WorkflowNode[]) => void
  addNode: (node: WorkflowNode) => void
  updateNode: (id: string, updates: Partial<WorkflowNode>) => void
  deleteNode: (id: string) => void
  connectNodes: (fromId: string, toId: string) => void
  disconnectNodes: (fromId: string, toId: string) => void

  setSelectedNode: (id: string | null) => void
  setIsRunning: (running: boolean) => void
  setIsDirty: (dirty: boolean) => void

  setWorkflowMetadata: (id: string | null, name: string, description: string) => void
  setUserId: (userId: string) => void

  setSidebarCollapsed: (collapsed: boolean) => void
  setRightPanelTab: (tab: "config" | "test" | "api" | "settings") => void

  saveWorkflow: () => Promise<void>
  loadWorkflow: (id: string) => Promise<void>
  loadWorkflowFromData: (data: any) => void
  createNewWorkflow: () => void
  duplicateWorkflow: () => Promise<void>
  deleteWorkflow: (id: string) => Promise<void>
  exportWorkflow: () => string
  importWorkflow: (data: string) => void

  publishWorkflow: () => Promise<void>
  testWorkflow: (testData?: any) => Promise<any>
  getWorkflowAnalytics: () => Promise<any>
  validateWorkflow: () => { isValid: boolean; errors: string[] }
}

export const useWorkflowStore = create<WorkflowStore>()(
  persist(
    (set, get) => ({
      // Initial state
      nodes: [
        {
          id: "start",
          type: "trigger",
          position: { x: 100, y: 100 },
          data: {
            title: "DM Received",
            description: "When someone sends a direct message",
            triggerType: "dm",
            platforms: ["instagram", "twitter"],
          },
          connections: [],
        },
      ],
      selectedNode: null,
      isRunning: false,
      isDirty: false,

      workflowId: null,
      workflowName: "Untitled Workflow",
      workflowDescription: "Automated social media responses",
      userId: null,

      sidebarCollapsed: false,
      rightPanelTab: "config",

      // Actions
      setNodes: (nodes) => set({ nodes, isDirty: true }),

      addNode: (node) =>
        set((state) => ({
          nodes: [...state.nodes, node],
          isDirty: true,
        })),

      updateNode: (id, updates) =>
        set((state) => ({
          nodes: state.nodes.map((node) => (node.id === id ? { ...node, ...updates } : node)),
          isDirty: true,
        })),

      deleteNode: (id) =>
        set((state) => ({
          nodes: state.nodes.filter((node) => node.id !== id),
          selectedNode: state.selectedNode === id ? null : state.selectedNode,
          isDirty: true,
        })),

      connectNodes: (fromId, toId) =>
        set((state) => ({
          nodes: state.nodes.map((node) =>
            node.id === fromId ? { ...node, connections: [...node.connections, toId] } : node,
          ),
          isDirty: true,
        })),

      disconnectNodes: (fromId, toId) =>
        set((state) => ({
          nodes: state.nodes.map((node) =>
            node.id === fromId ? { ...node, connections: node.connections.filter((id) => id !== toId) } : node,
          ),
          isDirty: true,
        })),

      setSelectedNode: (id) => set({ selectedNode: id }),
      setIsRunning: (running) => set({ isRunning: running }),
      setIsDirty: (dirty) => set({ isDirty: dirty }),

      setWorkflowMetadata: (id, name, description) =>
        set({
          workflowId: id,
          workflowName: name,
          workflowDescription: description,
        }),

      setUserId: (userId) => set({ userId }),

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setRightPanelTab: (tab) => set({ rightPanelTab: tab }),

      loadWorkflowFromData: (data) => {
        set({
          workflowId: data.id || null,
          workflowName: data.name || "Imported Workflow",
          workflowDescription: data.description || "Imported workflow",
          nodes: data.nodes || [],
          isDirty: true,
          selectedNode: null,
        })
      },

      saveWorkflow: async () => {
        const state = get()
        if (!state.userId) {
          toast.error("Please log in to save workflows")
          return
        }

        try {
          const workflowData = {
            name: state.workflowName,
            description: state.workflowDescription,
            nodes: state.nodes,
            connections: state.nodes.reduce((acc, node) => {
              node.connections.forEach((connId) => {
                acc.push({ from: node.id, to: connId })
              })
              return acc
            }, [] as any[]),
            isActive: false,
            version: "1.0.0",
          }

          let savedWorkflow
          if (state.workflowId) {
            // Update existing workflow
            savedWorkflow = await fetch(`/api/workflows/${state.workflowId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(workflowData),
            }).then((res) => res.json())
          } else {
            // Create new workflow
            savedWorkflow = await fetch("/api/workflows", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...workflowData, userId: state.userId }),
            }).then((res) => res.json())
          }

          set({
            workflowId: savedWorkflow.id,
            isDirty: false,
          })

          toast.success("Workflow saved successfully!")
        } catch (error) {
          console.error("Failed to save workflow:", error)
          toast.error("Failed to save workflow")
          throw error
        }
      },

      loadWorkflow: async (id) => {
        try {
          const response = await fetch(`/api/workflows/${id}`)
          if (!response.ok) throw new Error("Failed to load workflow")

          const workflow = await response.json()
          set({
            workflowId: workflow.id,
            workflowName: workflow.name,
            workflowDescription: workflow.description,
            nodes: workflow.nodes,
            isDirty: false,
            selectedNode: null,
          })

          toast.success("Workflow loaded successfully!")
        } catch (error) {
          console.error("Failed to load workflow:", error)
          toast.error("Failed to load workflow")
          throw error
        }
      },

      createNewWorkflow: () =>
        set({
          workflowId: null,
          workflowName: "Untitled Workflow",
          workflowDescription: "Automated social media responses",
          nodes: [
            {
              id: "start",
              type: "trigger",
              position: { x: 100, y: 100 },
              data: {
                title: "DM Received",
                description: "When someone sends a direct message",
                triggerType: "dm",
                platforms: ["instagram", "twitter"],
              },
              connections: [],
            },
          ],
          selectedNode: null,
          isDirty: false,
        }),

      duplicateWorkflow: async () => {
        const state = get()
        set({
          workflowId: null,
          workflowName: `${state.workflowName} (Copy)`,
          isDirty: true,
        })
        toast.success("Workflow duplicated!")
      },

      deleteWorkflow: async (id: string) => {
        try {
          await fetch(`/api/workflows/${id}`, { method: "DELETE" })
          toast.success("Workflow deleted successfully!")
        } catch (error) {
          console.error("Failed to delete workflow:", error)
          toast.error("Failed to delete workflow")
          throw error
        }
      },

      exportWorkflow: () => {
        const state = get()
        const exportData = {
          name: state.workflowName,
          description: state.workflowDescription,
          nodes: state.nodes,
          version: "1.0.0",
          exportedAt: new Date().toISOString(),
        }
        return JSON.stringify(exportData, null, 2)
      },

      importWorkflow: (data: string) => {
        try {
          const parsed = JSON.parse(data)
          get().loadWorkflowFromData(parsed)
          toast.success("Workflow imported successfully!")
        } catch (error) {
          console.error("Failed to import workflow:", error)
          toast.error("Invalid workflow data")
        }
      },

      publishWorkflow: async () => {
        const state = get()
        if (!state.workflowId) {
          toast.error("Please save the workflow first")
          return
        }

        try {
          await fetch(`/api/workflows/${state.workflowId}/publish`, {
            method: "POST",
          })
          toast.success("Workflow published successfully!")
        } catch (error) {
          console.error("Failed to publish workflow:", error)
          toast.error("Failed to publish workflow")
          throw error
        }
      },

      testWorkflow: async (testData = {}) => {
        const state = get()
        try {
          const response = await fetch("/api/workflows/test", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nodes: state.nodes,
              testData,
            }),
          })
          const result = await response.json()
          toast.success("Workflow test completed!")
          return result
        } catch (error) {
          console.error("Failed to test workflow:", error)
          toast.error("Failed to test workflow")
          throw error
        }
      },

      getWorkflowAnalytics: async () => {
        const state = get()
        if (!state.workflowId) return null

        try {
          const response = await fetch(`/api/workflows/${state.workflowId}/analytics`)
          return await response.json()
        } catch (error) {
          console.error("Failed to get analytics:", error)
          return null
        }
      },

      validateWorkflow: () => {
        const state = get()
        const errors: string[] = []

        // Check if workflow has at least one trigger
        const triggers = state.nodes.filter((node) => node.type === "trigger")
        if (triggers.length === 0) {
          errors.push("Workflow must have at least one trigger")
        }

        // Check for disconnected nodes
        const connectedNodes = new Set(["start"])
        state.nodes.forEach((node) => {
          node.connections.forEach((connId) => connectedNodes.add(connId))
        })

        const disconnectedNodes = state.nodes.filter((node) => node.id !== "start" && !connectedNodes.has(node.id))
        if (disconnectedNodes.length > 0) {
          errors.push(`${disconnectedNodes.length} nodes are not connected to the workflow`)
        }

        // Check for required fields
        state.nodes.forEach((node) => {
          if (node.type === "text" && !node.data.message) {
            errors.push(`Text node "${node.data.title || node.id}" is missing message content`)
          }
          if (node.type === "condition" && !node.data.condition) {
            errors.push(`Condition node "${node.data.title || node.id}" is missing condition logic`)
          }
        })

        return {
          isValid: errors.length === 0,
          errors,
        }
      },
    }),
    {
      name: "workflow-store",
      partialize: (state) => ({
        nodes: state.nodes,
        workflowName: state.workflowName,
        workflowDescription: state.workflowDescription,
        sidebarCollapsed: state.sidebarCollapsed,
        rightPanelTab: state.rightPanelTab,
        userId: state.userId,
      }),
    },
  ),
)
