"use client"

import React, { useRef, useEffect, useState } from "react"
import { useWorkflowStore } from "@/lib/workflow-store"

interface MinimapProps {
  canvasOffset: { x: number; y: number }
  zoom: number
  onViewportChange: (offset: { x: number; y: number }) => void
  canvasSize: { width: number; height: number }
  viewportSize: { width: number; height: number }
}

export function WorkflowMinimap({ 
  canvasOffset, 
  zoom, 
  onViewportChange, 
  canvasSize,
  viewportSize 
}: MinimapProps) {
  const { nodes } = useWorkflowStore()
  const minimapRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  
  // Minimap dimensions
  const MINIMAP_WIDTH = 200
  const MINIMAP_HEIGHT = 120
  
  // Calculate the scale factor for the minimap
  const scaleX = MINIMAP_WIDTH / canvasSize.width
  const scaleY = MINIMAP_HEIGHT / canvasSize.height
  const scale = Math.min(scaleX, scaleY)
  
  // Calculate viewport rectangle in minimap coordinates
  const viewportRect = {
    x: (-canvasOffset.x / zoom) * scale,
    y: (-canvasOffset.y / zoom) * scale,
    width: (viewportSize.width / zoom) * scale,
    height: (viewportSize.height / zoom) * scale,
  }
  
  // Calculate bounds for all nodes
  const getNodeBounds = () => {
    if (nodes.length === 0) return { minX: 0, minY: 0, maxX: 1000, maxY: 600 }
    
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    
    nodes.forEach(node => {
      minX = Math.min(minX, node.position.x)
      minY = Math.min(minY, node.position.y)
      maxX = Math.max(maxX, node.position.x + 192) // node width
      maxY = Math.max(maxY, node.position.y + 120) // node height
    })
    
    // Add padding
    const padding = 200
    return {
      minX: minX - padding,
      minY: minY - padding,
      maxX: maxX + padding,
      maxY: maxY + padding,
    }
  }
  
  const bounds = getNodeBounds()
  const contentWidth = bounds.maxX - bounds.minX
  const contentHeight = bounds.maxY - bounds.minY
  
  // Adjust scale based on actual content
  const contentScaleX = MINIMAP_WIDTH / contentWidth
  const contentScaleY = MINIMAP_HEIGHT / contentHeight
  const contentScale = Math.min(contentScaleX, contentScaleY, 0.5) // Max scale of 0.5
  
  const handleMinimapClick = (e: React.MouseEvent) => {
    if (!minimapRef.current) return
    
    const rect = minimapRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top
    
    // Convert minimap coordinates to canvas coordinates
    const canvasX = (clickX / contentScale) + bounds.minX
    const canvasY = (clickY / contentScale) + bounds.minY
    
    // Center the viewport on the clicked position
    const newOffset = {
      x: -(canvasX - viewportSize.width / (2 * zoom)) * zoom,
      y: -(canvasY - viewportSize.height / (2 * zoom)) * zoom,
    }
    
    onViewportChange(newOffset)
  }
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    handleMinimapClick(e)
  }
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    handleMinimapClick(e)
  }
  
  const handleMouseUp = () => {
    setIsDragging(false)
  }
  
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false)
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging || !minimapRef.current) return
      
      const rect = minimapRef.current.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const clickY = e.clientY - rect.top
      
      // Convert and update viewport
      const canvasX = (clickX / contentScale) + bounds.minX
      const canvasY = (clickY / contentScale) + bounds.minY
      
      const newOffset = {
        x: -(canvasX - viewportSize.width / (2 * zoom)) * zoom,
        y: -(canvasY - viewportSize.height / (2 * zoom)) * zoom,
      }
      
      onViewportChange(newOffset)
    }
    
    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('mouseup', handleGlobalMouseUp)
    }
    
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [isDragging, contentScale, bounds, viewportSize, zoom, onViewportChange])
  
  return (
    <div className="absolute bottom-4 left-4 z-20">
      <div className="bg-card/95 backdrop-blur-sm border rounded-lg p-2 shadow-lg">
        <div className="text-xs text-muted-foreground mb-2 font-medium">Overview</div>
        <div
          ref={minimapRef}
          className="relative bg-muted/30 border rounded cursor-pointer select-none"
          style={{ width: MINIMAP_WIDTH, height: MINIMAP_HEIGHT }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Render nodes as small rectangles */}
          {nodes.map(node => {
            const nodeX = (node.position.x - bounds.minX) * contentScale
            const nodeY = (node.position.y - bounds.minY) * contentScale
            const nodeWidth = 192 * contentScale
            const nodeHeight = 120 * contentScale
            
            // Skip nodes that are outside the visible minimap area
            if (nodeX < -nodeWidth || nodeY < -nodeHeight || 
                nodeX > MINIMAP_WIDTH || nodeY > MINIMAP_HEIGHT) {
              return null
            }
            
            return (
              <div
                key={node.id}
                className="absolute bg-primary/60 rounded-sm border border-primary/30"
                style={{
                  left: Math.max(0, nodeX),
                  top: Math.max(0, nodeY),
                  width: Math.min(nodeWidth, MINIMAP_WIDTH - Math.max(0, nodeX)),
                  height: Math.min(nodeHeight, MINIMAP_HEIGHT - Math.max(0, nodeY)),
                  minWidth: 4,
                  minHeight: 3,
                }}
              />
            )
          })}
          
          {/* Render connections as lines */}
          <svg 
            className="absolute inset-0 pointer-events-none"
            style={{ width: MINIMAP_WIDTH, height: MINIMAP_HEIGHT }}
          >
            {nodes.map(node =>
              node.connections.map(targetId => {
                const targetNode = nodes.find(n => n.id === targetId)
                if (!targetNode) return null
                
                const fromX = (node.position.x + 96 - bounds.minX) * contentScale
                const fromY = (node.position.y + 60 - bounds.minY) * contentScale
                const toX = (targetNode.position.x + 96 - bounds.minX) * contentScale
                const toY = (targetNode.position.y + 60 - bounds.minY) * contentScale
                
                return (
                  <line
                    key={`${node.id}-${targetId}`}
                    x1={fromX}
                    y1={fromY}
                    x2={toX}
                    y2={toY}
                    stroke="hsl(var(--primary))"
                    strokeWidth="1"
                    opacity="0.4"
                  />
                )
              })
            )}
          </svg>
          
          {/* Viewport indicator */}
          <div
            className="absolute border-2 border-blue-500 bg-blue-500/10 rounded-sm pointer-events-none"
            style={{
              left: Math.max(0, Math.min(MINIMAP_WIDTH - 10, ((-canvasOffset.x / zoom) - bounds.minX) * contentScale)),
              top: Math.max(0, Math.min(MINIMAP_HEIGHT - 10, ((-canvasOffset.y / zoom) - bounds.minY) * contentScale)),
              width: Math.min(MINIMAP_WIDTH, Math.max(10, (viewportSize.width / zoom) * contentScale)),
              height: Math.min(MINIMAP_HEIGHT, Math.max(10, (viewportSize.height / zoom) * contentScale)),
            }}
          />
        </div>
        
        {/* Info text */}
        <div className="text-xs text-muted-foreground mt-1 text-center">
          {nodes.length} node{nodes.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  )
}