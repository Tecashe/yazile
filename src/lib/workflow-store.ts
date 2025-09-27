"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface WorkflowNode {
  id: string
  type: string
  position: { x: number; y: number }
  data: any
  connections: string[]
}

export interface WorkflowConnection {
  id: string
  fromNodeId: string
  toNodeId: string
}

interface ConnectionMode {
  active: boolean
  fromNodeId: string | null
}

interface WorkflowStore {
  // Workflow metadata
  workflowId: string | null
  workflowName: string
  workflowDescription: string

  // Canvas state
  nodes: WorkflowNode[]
  connections: WorkflowConnection[]
  selectedNode: string | null

  // UI state
  sidebarCollapsed: boolean
  rightPanelCollapsed: boolean
  isRunning: boolean
  connectionMode: ConnectionMode

  // Canvas viewport
  canvasOffset: { x: number; y: number }
  canvasZoom: number

  // Actions
  setWorkflowMetadata: (id: string | null, name?: string, description?: string) => void
  addNode: (node: WorkflowNode) => void
  updateNode: (id: string, updates: Partial<WorkflowNode>) => void
  deleteNode: (id: string) => void
  setSelectedNode: (id: string | null) => void

  // Connection actions
  connectNodes: (fromId: string, toId: string) => void
  disconnectNodes: (fromId: string, toId: string) => void
  startConnection: (fromId: string) => void
  cancelConnection: () => void

  // UI actions
  setSidebarCollapsed: (collapsed: boolean) => void
  setRightPanelCollapsed: (collapsed: boolean) => void
  setIsRunning: (running: boolean) => void

  // Canvas actions
  setCanvasOffset: (offset: { x: number; y: number }) => void
  setCanvasZoom: (zoom: number) => void
  resetCanvas: () => void

  // Workflow actions
  saveWorkflow: () => void
  exportWorkflow: () => string
  importWorkflow: (data: string) => void
  clearWorkflow: () => void
}

export const useWorkflowStore = create<WorkflowStore>()(
  persist(
    (set, get) => ({
      // Initial state
      workflowId: null,
      workflowName: "Untitled Workflow",
      workflowDescription: "",

      nodes: [],
      connections: [],
      selectedNode: null,

      sidebarCollapsed: false,
      rightPanelCollapsed: false,
      isRunning: false,
      connectionMode: { active: false, fromNodeId: null },

      canvasOffset: { x: 0, y: 0 },
      canvasZoom: 1,

      // Workflow metadata actions
      setWorkflowMetadata: (id, name, description) =>
        set((state) => ({
          workflowId: id ?? state.workflowId,
          workflowName: name ?? state.workflowName,
          workflowDescription: description ?? state.workflowDescription,
        })),

      // Node actions
      addNode: (node) =>
        set((state) => ({
          nodes: [...state.nodes, node],
          selectedNode: node.id,
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

      setSelectedNode: (id) => set({ selectedNode: id }),

      // Connection actions
      connectNodes: (fromId, toId) =>
        set((state) => {
          // Check if connection already exists
          const exists = state.connections.some((conn) => conn.fromNodeId === fromId && conn.toNodeId === toId)

          if (exists) return state

          const newConnection: WorkflowConnection = {
            id: `conn-${Date.now()}`,
            fromNodeId: fromId,
            toNodeId: toId,
          }

          return {
            connections: [...state.connections, newConnection],
            connectionMode: { active: false, fromNodeId: null },
          }
        }),

      disconnectNodes: (fromId, toId) =>
        set((state) => ({
          connections: state.connections.filter((conn) => !(conn.fromNodeId === fromId && conn.toNodeId === toId)),
        })),

      startConnection: (fromId) =>
        set({
          connectionMode: { active: true, fromNodeId: fromId },
        }),

      cancelConnection: () =>
        set({
          connectionMode: { active: false, fromNodeId: null },
        }),

      // UI actions
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setRightPanelCollapsed: (collapsed) => set({ rightPanelCollapsed: collapsed }),
      setIsRunning: (running) => set({ isRunning: running }),

      // Canvas actions
      setCanvasOffset: (offset) => set({ canvasOffset: offset }),
      setCanvasZoom: (zoom) => set({ canvasZoom: Math.max(0.1, Math.min(3, zoom)) }),
      resetCanvas: () => set({ canvasOffset: { x: 0, y: 0 }, canvasZoom: 1 }),

      // Workflow actions
      saveWorkflow: () => {
        // In a real app, this would save to a backend
        console.log("Workflow saved:", get())
      },

      exportWorkflow: () => {
        const state = get()
        return JSON.stringify(
          {
            workflowId: state.workflowId,
            workflowName: state.workflowName,
            workflowDescription: state.workflowDescription,
            nodes: state.nodes,
            connections: state.connections,
            version: "1.0",
            exportedAt: new Date().toISOString(),
          },
          null,
          2,
        )
      },

      importWorkflow: (data) => {
        try {
          const parsed = JSON.parse(data)
          set({
            workflowId: parsed.workflowId,
            workflowName: parsed.workflowName || "Imported Workflow",
            workflowDescription: parsed.workflowDescription || "",
            nodes: parsed.nodes || [],
            connections: parsed.connections || [],
            selectedNode: null,
          })
        } catch (error) {
          console.error("Failed to import workflow:", error)
        }
      },

      clearWorkflow: () =>
        set({
          nodes: [],
          connections: [],
          selectedNode: null,
          workflowName: "Untitled Workflow",
          workflowDescription: "",
        }),
    }),
    {
      name: "workflow-store",
      partialize: (state) => ({
        workflowId: state.workflowId,
        workflowName: state.workflowName,
        workflowDescription: state.workflowDescription,
        nodes: state.nodes,
        connections: state.connections,
        canvasOffset: state.canvasOffset,
        canvasZoom: state.canvasZoom,
      }),
    },
  ),
)
