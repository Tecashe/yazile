"use server"

import type { WorkflowNode, WorkflowConnection } from "@/lib/workflow-store"

export interface TestResult {
  success: boolean
  error?: string
  responses: any[]
  executionTime: number
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export async function testWorkflow(params: {
  nodes: WorkflowNode[]
  connections: WorkflowConnection[]
  testMessage: string
  userId: string
}): Promise<TestResult> {
  const startTime = Date.now()

  try {
    // Find trigger nodes
    const triggerNodes = params.nodes.filter((node) => node.type === "trigger")

    if (triggerNodes.length === 0) {
      return {
        success: false,
        error: "No trigger nodes found in workflow",
        responses: [],
        executionTime: Date.now() - startTime,
      }
    }

    // Simulate workflow execution
    const responses = await executeWorkflow(params.nodes, params.connections, params.testMessage)

    return {
      success: true,
      responses,
      executionTime: Date.now() - startTime,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      responses: [],
      executionTime: Date.now() - startTime,
    }
  }
}

export async function validateWorkflow(
  nodes: WorkflowNode[],
  connections: WorkflowConnection[],
): Promise<ValidationResult> {
  const errors: string[] = []
  const warnings: string[] = []

  // Check for trigger nodes
  const triggerNodes = nodes.filter((node) => node.type === "trigger")
  if (triggerNodes.length === 0) {
    errors.push("Workflow must have at least one trigger node")
  }

  // Check for orphaned nodes
  const connectedNodeIds = new Set([...connections.map((c) => c.fromNodeId), ...connections.map((c) => c.toNodeId)])

  const orphanedNodes = nodes.filter((node) => node.type !== "trigger" && !connectedNodeIds.has(node.id))

  if (orphanedNodes.length > 0) {
    warnings.push(`${orphanedNodes.length} node(s) are not connected to the workflow`)
  }

  // Validate node configurations
  for (const node of nodes) {
    switch (node.type) {
      case "text":
        if (!node.data.message?.trim()) {
          errors.push(`Text node "${node.id}" is missing a message`)
        }
        break
      case "condition":
        if (!node.data.value?.trim()) {
          errors.push(`Condition node "${node.id}" is missing a condition value`)
        }
        break
      case "api":
        if (!node.data.endpoint?.trim()) {
          errors.push(`API node "${node.id}" is missing an endpoint URL`)
        }
        break
      case "webhook":
        if (!node.data.url?.trim()) {
          errors.push(`Webhook node "${node.id}" is missing a URL`)
        }
        break
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

async function executeWorkflow(
  nodes: WorkflowNode[],
  connections: WorkflowConnection[],
  message: string,
): Promise<any[]> {
  const responses: any[] = []

  // Find trigger and start execution
  const triggerNode = nodes.find((node) => node.type === "trigger")
  if (!triggerNode) return responses

  await processNode(triggerNode, nodes, connections, message, responses)

  return responses
}

async function processNode(
  node: WorkflowNode,
  allNodes: WorkflowNode[],
  connections: WorkflowConnection[],
  context: string,
  responses: any[],
): Promise<void> {
  // Process current node
  switch (node.type) {
    case "text":
      responses.push({
        type: "text",
        text: node.data.message || "Hello!",
        nodeId: node.id,
      })
      break

    case "button":
      responses.push({
        type: "button",
        text: "Choose an option:",
        buttons: node.data.buttons || [],
        nodeId: node.id,
      })
      break

    case "image":
      responses.push({
        type: "image",
        text: node.data.caption,
        attachment: {
          type: "image",
          url: node.data.imageUrl || "/placeholder.svg",
        },
        nodeId: node.id,
      })
      break
  }

  // Find connected nodes and continue execution
  const outgoingConnections = connections.filter((conn) => conn.fromNodeId === node.id)

  for (const connection of outgoingConnections) {
    const nextNode = allNodes.find((n) => n.id === connection.toNodeId)
    if (nextNode) {
      // Add small delay to simulate processing
      await new Promise((resolve) => setTimeout(resolve, 100))
      await processNode(nextNode, allNodes, connections, context, responses)
    }
  }
}
