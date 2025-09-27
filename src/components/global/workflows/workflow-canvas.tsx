"use client"

import type React from "react"

import { useRef, useCallback, useState, useEffect } from "react"
import { useWorkflowStore, type WorkflowNode } from "@/lib/workflow-store-production"
import { WorkflowNodeComponent } from "./workflow-node"
import { AddBlockButton } from "./floating-block-palette"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge" //kwuduih
import { ZoomIn, ZoomOut, Maximize, RotateCcw, Grid3X3, Map, Move, MousePointer } from "lucide-react"

export function WorkflowCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isPanning, setIsPanning] = useState(false)
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 })
  const [showGrid, setShowGrid] = useState(true)
  const [showMinimap, setShowMinimap] = useState(true)
  const [canvasSize] = useState({ width: 5000, height: 5000 })

  const {
    nodes,
    connections,
    selectedNode,
    setSelectedNode,
    updateNode,
    deleteNode,
    connectNodes,
    addNode,
    connectionMode,
    cancelConnection,
    canvasOffset,
    canvasZoom,
    setCanvasOffset,
    setCanvasZoom,
    resetCanvas,
  } = useWorkflowStore()

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isPanning) {
        const deltaX = e.clientX - lastPanPoint.x
        const deltaY = e.clientY - lastPanPoint.y

        setCanvasOffset({
          x: canvasOffset.x + deltaX,
          y: canvasOffset.y + deltaY,
        })

        setLastPanPoint({ x: e.clientX, y: e.clientY })
      }
    }

    const handleGlobalMouseUp = () => {
      setIsPanning(false)
    }

    if (isPanning) {
      document.addEventListener("mousemove", handleGlobalMouseMove)
      document.addEventListener("mouseup", handleGlobalMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove)
      document.removeEventListener("mouseup", handleGlobalMouseUp)
    }
  }, [isPanning, lastPanPoint, canvasOffset, setCanvasOffset])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && connectionMode.active) {
        cancelConnection()
      }

      // Delete selected node
      if (e.key === "Delete" && selectedNode) {
        deleteNode(selectedNode)
      }

      // Zoom shortcuts
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "0") {
          e.preventDefault()
          resetCanvas()
        }
        if (e.key === "=") {
          e.preventDefault()
          setCanvasZoom(canvasZoom * 1.2)
        }
        if (e.key === "-") {
          e.preventDefault()
          setCanvasZoom(canvasZoom * 0.8)
        }
      }

      // Pan with arrow keys
      if (e.shiftKey) {
        const panAmount = 50
        switch (e.key) {
          case "ArrowUp":
            e.preventDefault()
            setCanvasOffset({ x: canvasOffset.x, y: canvasOffset.y + panAmount })
            break
          case "ArrowDown":
            e.preventDefault()
            setCanvasOffset({ x: canvasOffset.x, y: canvasOffset.y - panAmount })
            break
          case "ArrowLeft":
            e.preventDefault()
            setCanvasOffset({ x: canvasOffset.x + panAmount, y: canvasOffset.y })
            break
          case "ArrowRight":
            e.preventDefault()
            setCanvasOffset({ x: canvasOffset.x - panAmount, y: canvasOffset.y })
            break
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [
    connectionMode.active,
    cancelConnection,
    selectedNode,
    deleteNode,
    canvasZoom,
    canvasOffset,
    setCanvasZoom,
    setCanvasOffset,
    resetCanvas,
  ])

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === canvasRef.current || (e.target as Element).closest(".canvas-background")) {
        setSelectedNode(null)
        if (connectionMode.active) {
          cancelConnection()
        }
      }
    },
    [setSelectedNode, connectionMode.active, cancelConnection],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      try {
        const data = JSON.parse(e.dataTransfer.getData("application/json"))
        const position = {
          x: (e.clientX - rect.left - canvasOffset.x) / canvasZoom - 120,
          y: (e.clientY - rect.top - canvasOffset.y) / canvasZoom - 50,
        }

        const newNode: WorkflowNode = {
          id: `node-${Date.now()}`,
          type: data.type,
          position,
          data: getDefaultNodeData(data.type),
          connections: [],
        }

        addNode(newNode)
      } catch (error) {
        console.error("Failed to parse drop data:", error)
      }
    },
    [canvasOffset, canvasZoom, addNode],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && (e.ctrlKey || e.metaKey))) {
      // Middle mouse or Ctrl/Cmd+click for panning
      setIsPanning(true)
      setLastPanPoint({ x: e.clientX, y: e.clientY })
      e.preventDefault()
    }
  }, [])

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const delta = e.deltaY > 0 ? 0.9 : 1.1
        const newZoom = Math.max(0.1, Math.min(5, canvasZoom * delta))
        setCanvasZoom(newZoom)
      } else {
        // Scroll to pan when not zooming
        const panSpeed = 1
        setCanvasOffset({
          x: canvasOffset.x - e.deltaX * panSpeed,
          y: canvasOffset.y - e.deltaY * panSpeed,
        })
      }
    },
    [canvasZoom, canvasOffset, setCanvasZoom, setCanvasOffset],
  )

  const handleNodeDrag = useCallback(
    (id: string, position: { x: number; y: number }) => {
      updateNode(id, { position })
    },
    [updateNode],
  )

  const getConnectionPath = (from: { x: number; y: number }, to: { x: number; y: number }, fromHandle?: string) => {
    const dx = to.x - from.x
    const dy = to.y - from.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    // Enhanced control point calculation for smoother curves
    const controlPointOffset = Math.min(Math.max(distance * 0.5, 100), 300)

    // Adjust control points based on direction for better flow
    const midX = (from.x + to.x) / 2
    const midY = (from.y + to.y) / 2

    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal flow - use horizontal control points
      return `M ${from.x} ${from.y} C ${from.x + controlPointOffset} ${from.y}, ${to.x - controlPointOffset} ${to.y}, ${to.x} ${to.y}`
    } else {
      // Vertical flow - use vertical control points
      return `M ${from.x} ${from.y} C ${from.x} ${from.y + controlPointOffset * 0.5}, ${to.x} ${to.y - controlPointOffset * 0.5}, ${to.x} ${to.y}`
    }
  }

  const handleZoomIn = () => setCanvasZoom(Math.min(5, canvasZoom * 1.2))
  const handleZoomOut = () => setCanvasZoom(Math.max(0.1, canvasZoom * 0.8))
  const handleFitToScreen = () => {
    if (nodes.length === 0) {
      resetCanvas()
      return
    }

    // Calculate bounds of all nodes
    const bounds = nodes.reduce(
      (acc, node) => ({
        minX: Math.min(acc.minX, node.position.x),
        minY: Math.min(acc.minY, node.position.y),
        maxX: Math.max(acc.maxX, node.position.x + 240),
        maxY: Math.max(acc.maxY, node.position.y + 100),
      }),
      {
        minX: Number.POSITIVE_INFINITY,
        minY: Number.POSITIVE_INFINITY,
        maxX: Number.NEGATIVE_INFINITY,
        maxY: Number.NEGATIVE_INFINITY,
      },
    )

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const padding = 100
    const contentWidth = bounds.maxX - bounds.minX + padding * 2
    const contentHeight = bounds.maxY - bounds.minY + padding * 2

    const scaleX = rect.width / contentWidth
    const scaleY = rect.height / contentHeight
    const scale = Math.min(scaleX, scaleY, 1)

    setCanvasZoom(scale)
    setCanvasOffset({
      x: rect.width / 2 - ((bounds.minX + bounds.maxX) / 2) * scale,
      y: rect.height / 2 - ((bounds.minY + bounds.maxY) / 2) * scale,
    })
  }

  const Minimap = () => {
    if (!showMinimap || nodes.length === 0) return null

    const minimapSize = 200
    const scale = 0.1

    return (
      <div className="absolute top-4 right-4 w-48 h-32 bg-card/90 border border-border rounded-lg p-2 backdrop-blur-sm">
        <div className="text-xs font-medium mb-2 text-muted-foreground">Minimap</div>
        <div className="relative w-full h-full bg-muted/20 rounded overflow-hidden">
          <svg className="absolute inset-0 w-full h-full">
            {/* Nodes in minimap */}
            {nodes.map((node) => (
              <rect
                key={node.id}
                x={node.position.x * scale + 20}
                y={node.position.y * scale + 10}
                width={24}
                height={10}
                fill={selectedNode === node.id ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                rx={2}
                opacity={0.8}
              />
            ))}

            {/* Viewport indicator */}
            <rect
              x={-canvasOffset.x * scale + 20}
              y={-canvasOffset.y * scale + 10}
              width={minimapSize / canvasZoom}
              height={120 / canvasZoom}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth={1}
              rx={2}
              opacity={0.6}
            />
          </svg>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full bg-background overflow-hidden">
      <div
        ref={canvasRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing canvas-background"
        onClick={handleCanvasClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
        style={{
          cursor: isPanning ? "grabbing" : connectionMode.active ? "crosshair" : "grab",
        }}
      >
        <div
          className="absolute"
          style={{
            transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${canvasZoom})`,
            transformOrigin: "0 0",
            width: canvasSize.width,
            height: canvasSize.height,
            left: -canvasSize.width / 2,
            top: -canvasSize.height / 2,
          }}
        >
          {showGrid && (
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                  linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px),
                  linear-gradient(to right, hsl(var(--border)) 2px, transparent 2px),
                  linear-gradient(to bottom, hsl(var(--border)) 2px, transparent 2px)
                `,
                backgroundSize: "20px 20px, 20px 20px, 100px 100px, 100px 100px",
              }}
            />
          )}

          <svg className="absolute inset-0 pointer-events-none" style={{ width: "100%", height: "100%" }}>
            {connections.map((connection) => {
              const fromNode = nodes.find((n) => n.id === connection.fromNodeId)
              const toNode = nodes.find((n) => n.id === connection.toNodeId)
              if (!fromNode || !toNode) return null

              const getConnectionPoint = (node: WorkflowNode, isFrom: boolean, handle?: string) => {
                const baseX = node.position.x + canvasSize.width / 2
                const baseY = node.position.y + canvasSize.height / 2 + 50

                if (handle === "true") {
                  return { x: baseX + 240, y: baseY - 15 }
                } else if (handle === "false") {
                  return { x: baseX + 240, y: baseY + 15 }
                } else if (isFrom) {
                  return { x: baseX + 240, y: baseY }
                } else {
                  return { x: baseX, y: baseY }
                }
              }

              const fromPoint = getConnectionPoint(fromNode, true, connection.fromHandle)
              const toPoint = getConnectionPoint(toNode, false, connection.toHandle)

              return (
                <g key={connection.id}>
                  {/* Enhanced shadow with gradient */}
                  <defs>
                    <linearGradient id={`shadow-${connection.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(var(--background))" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="hsl(var(--background))" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="hsl(var(--background))" stopOpacity="0.8" />
                    </linearGradient>
                    <filter id={`glow-${connection.id}`}>
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Connection shadow */}
                  <path
                    d={getConnectionPath(fromPoint, toPoint, connection.fromHandle)}
                    stroke={`url(#shadow-${connection.id})`}
                    strokeWidth="8"
                    fill="none"
                    opacity="0.6"
                  />

                  {/* Main connection line with enhanced styling */}
                  <path
                    d={getConnectionPath(fromPoint, toPoint, connection.fromHandle)}
                    stroke={
                      connection.fromHandle
                        ? connection.fromHandle === "true"
                          ? "hsl(var(--green-500))"
                          : "hsl(var(--red-500))"
                        : "hsl(var(--primary))"
                    }
                    strokeWidth="3"
                    fill="none"
                    markerEnd="url(#arrowhead)"
                    filter={`url(#glow-${connection.id})`}
                    className="drop-shadow-sm"
                    opacity="0.9"
                  />

                  {/* Interactive hover area */}
                  <path
                    d={getConnectionPath(fromPoint, toPoint, connection.fromHandle)}
                    stroke="transparent"
                    strokeWidth="16"
                    fill="none"
                    className="cursor-pointer hover:stroke-primary/10"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Handle connection click (e.g., delete connection)
                    }}
                  />

                  {/* Connection label for conditional branches */}
                  {connection.fromHandle && (
                    <text
                      x={(fromPoint.x + toPoint.x) / 2}
                      y={(fromPoint.y + toPoint.y) / 2 - 8}
                      textAnchor="middle"
                      className="fill-current text-xs font-medium"
                      style={{ fontSize: "10px" }}
                    >
                      <tspan className="fill-muted-foreground">{connection.fromHandle}</tspan>
                    </text>
                  )}
                </g>
              )
            })}

            {/* Active connection line with enhanced styling */}
            {connectionMode.active && connectionMode.fromNodeId && (
              <g>
                <path
                  d={`M ${nodes.find((n) => n.id === connectionMode.fromNodeId)?.position.x! + canvasSize.width / 2 + 240} ${nodes.find((n) => n.id === connectionMode.fromNodeId)?.position.y! + canvasSize.height / 2 + 50} L ${-canvasOffset.x / canvasZoom} ${-canvasOffset.y / canvasZoom}`}
                  stroke="hsl(var(--primary))"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="12,6"
                  opacity="0.8"
                  filter="url(#activeGlow)"
                />
              </g>
            )}

            <defs>
              {/* Enhanced arrowhead */}
              <marker
                id="arrowhead"
                markerWidth="14"
                markerHeight="10"
                refX="13"
                refY="5"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M0,0 L0,10 L14,5 z" fill="hsl(var(--primary))" opacity="0.9" />
              </marker>

              {/* Glow effect for active connection */}
              <filter id="activeGlow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>

          {/* Workflow nodes */}
          {nodes.map((node) => (
            <div
              key={node.id}
              style={{
                position: "absolute",
                left: node.position.x + canvasSize.width / 2,
                top: node.position.y + canvasSize.height / 2,
              }}
            >
              <WorkflowNodeComponent
                node={node}
                isSelected={selectedNode === node.id}
                onSelect={() => setSelectedNode(node.id)}
                onDrag={handleNodeDrag}
                onDelete={() => deleteNode(node.id)}
                onConnect={connectNodes}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40">
        <AddBlockButton onAddBlock={(position) => {}} />
      </div>

      <div className="absolute bottom-4 left-4 flex flex-col gap-2">
        {/* Zoom controls */}
        <div className="bg-card/90 border border-border rounded-lg p-2 backdrop-blur-sm">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={handleZoomOut} className="h-8 w-8 p-0">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <div className="px-2 text-xs font-mono min-w-[60px] text-center">{Math.round(canvasZoom * 100)}%</div>
            <Button variant="ghost" size="sm" onClick={handleZoomIn} className="h-8 w-8 p-0">
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Canvas controls */}
        <div className="bg-card/90 border border-border rounded-lg p-2 backdrop-blur-sm">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={handleFitToScreen} className="h-8 w-8 p-0" title="Fit to screen">
              <Maximize className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={resetCanvas} className="h-8 w-8 p-0" title="Reset view">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant={showGrid ? "default" : "ghost"}
              size="sm"
              onClick={() => setShowGrid(!showGrid)}
              className="h-8 w-8 p-0"
              title="Toggle grid"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={showMinimap ? "default" : "ghost"}
              size="sm"
              onClick={() => setShowMinimap(!showMinimap)}
              className="h-8 w-8 p-0"
              title="Toggle minimap"
            >
              <Map className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Status indicators */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 items-end">
        {connectionMode.active && (
          <Badge variant="default" className="bg-blue-500 text-white">
            <MousePointer className="h-3 w-3 mr-1" />
            Connection Mode - Click target node or press Escape
          </Badge>
        )}

        {isPanning && (
          <Badge variant="secondary">
            <Move className="h-3 w-3 mr-1" />
            Panning
          </Badge>
        )}

        <div className="bg-card/90 border border-border rounded-lg p-2 text-xs text-muted-foreground backdrop-blur-sm">
          <div>Ctrl+Scroll: Zoom | Ctrl+Drag: Pan</div>
          <div>Shift+Arrows: Pan | Del: Delete | Ctrl+0: Reset</div>
        </div>
      </div>

      {/* Minimap */}
      <Minimap />
    </div>
  )
}

function getDefaultNodeData(type: string) {
  switch (type) {
    case "trigger":
      return {
        title: "New Trigger",
        description: "Configure trigger conditions",
        triggerType: "dm",
        platforms: ["instagram"],
      }
    case "text":
      return {
        message: "Hello! Thanks for your message.",
        buttons: [],
      }
    case "button":
      return {
        buttons: [{ text: "Option 1", action: "continue", id: crypto.randomUUID() }],
      }
    case "image":
      return {
        imageUrl: "",
        caption: "",
        buttons: [],
      }
    case "condition":
      return {
        condition: "contains",
        value: "",
        trueAction: "continue",
        falseAction: "continue",
      }
    case "delay":
      return {
        duration: 5,
        unit: "seconds",
      }
    case "api":
      return {
        endpoint: "",
        method: "POST",
        headers: {},
        body: "",
      }
    case "webhook":
      return {
        url: "",
        method: "POST",
        headers: {},
        payload: "",
      }
    default:
      return {}
  }
}
