"use client"

import type React from "react"

import { useRef, useCallback, useState } from "react"
import type { WorkflowNode } from "@/types/workflow"
import { WorkflowNodeComponent } from "./workflow-node"

interface WorkflowCanvasProps {
  nodes: WorkflowNode[]
  selectedNode: string | null
  onNodeSelect: (id: string | null) => void
  onNodeUpdate: (id: string, updates: Partial<WorkflowNode>) => void
  onNodeDelete: (id: string) => void
  onNodeConnect: (fromId: string, toId: string) => void
  onAddNode: (type: WorkflowNode["type"], position: { x: number; y: number }) => void
}

export function WorkflowCanvas({
  nodes,
  selectedNode,
  onNodeSelect,
  onNodeUpdate,
  onNodeDelete,
  onNodeConnect,
  onAddNode,
}: WorkflowCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [connecting, setConnecting] = useState<string | null>(null)
  const [connectionPreview, setConnectionPreview] = useState<{ x: number; y: number } | null>(null)

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === canvasRef.current) {
        onNodeSelect(null)
        setConnecting(null)
        setConnectionPreview(null)
      }
    },
    [onNodeSelect],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (connecting && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        setConnectionPreview({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    },
    [connecting],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      try {
        const data = JSON.parse(e.dataTransfer.getData("application/json"))
        const position = {
          x: e.clientX - rect.left - 100, // Center the node
          y: e.clientY - rect.top - 40,
        }
        onAddNode(data.type, position)
      } catch (error) {
        console.error("Failed to parse drop data:", error)
      }
    },
    [onAddNode],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleNodeDrag = useCallback(
    (id: string, position: { x: number; y: number }) => {
      onNodeUpdate(id, { position })
    },
    [onNodeUpdate],
  )

  const handleNodeConnect = useCallback(
    (fromId: string, toId: string) => {
      if (fromId !== toId) {
        onNodeConnect(fromId, toId)
      }
      setConnecting(null)
      setConnectionPreview(null)
    },
    [onNodeConnect],
  )

  const getConnectionPath = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const dx = to.x - from.x
    const dy = to.y - from.y
    const controlPointOffset = Math.abs(dx) * 0.5

    return `M ${from.x} ${from.y} C ${from.x + controlPointOffset} ${from.y}, ${to.x - controlPointOffset} ${to.y}, ${to.x} ${to.y}`
  }

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full workflow-canvas overflow-hidden"
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {/* Connection Lines */}
      <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {/* Existing connections */}
        {nodes.map((node) =>
          node.connections.map((targetId) => {
            const targetNode = nodes.find((n) => n.id === targetId)
            if (!targetNode) return null

            const fromPoint = { x: node.position.x + 192, y: node.position.y + 60 }
            const toPoint = { x: targetNode.position.x, y: targetNode.position.y + 60 }

            return (
              <path
                key={`${node.id}-${targetId}`}
                d={getConnectionPath(fromPoint, toPoint)}
                className="workflow-connection"
                markerEnd="url(#arrowhead)"
              />
            )
          }),
        )}

        {/* Connection preview */}
        {connecting && connectionPreview && (
          <path
            d={getConnectionPath(
              {
                x: nodes.find((n) => n.id === connecting)?.position.x! + 192,
                y: nodes.find((n) => n.id === connecting)?.position.y! + 60,
              },
              connectionPreview,
            )}
            className="workflow-connection opacity-50"
            strokeDasharray="5,5"
          />
        )}

        {/* Arrow marker definition */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
            className="fill-primary"
          >
            <polygon points="0 0, 10 3.5, 0 7" />
          </marker>
        </defs>
      </svg>

      {/* Nodes */}
      {nodes.map((node) => (
        <WorkflowNodeComponent
          key={node.id}
          node={node}
          isSelected={selectedNode === node.id}
          onSelect={() => onNodeSelect(node.id)}
          onDrag={handleNodeDrag}
          onDelete={() => onNodeDelete(node.id)}
          onConnect={handleNodeConnect}
          connecting={connecting}
          setConnecting={setConnecting}
        />
      ))}

      {/* Grid overlay for better visual alignment */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />
    </div>
  )
}
