// "use server"

// import { executeWorkflow } from "@/lib/workflow-engine"
// import type { WorkflowNode, WorkflowConnection } from "@/lib/workflow-store"
// import { InstagramSender } from "@/lib/instagram-integration"

// export interface TestWorkflowData {
//   nodes: WorkflowNode[]
//   connections: WorkflowConnection[]
//   testMessage: string
//   testSenderId?: string
//   userId: string
// }

// export interface TestResult {
//   success: boolean
//   responses: any[]
//   executionTime: number
//   error?: string
//   executedNodes: any[]
// }

// // Test workflow execution without sending actual messages
// export async function testWorkflow(data: TestWorkflowData): Promise<TestResult> {
//   const startTime = Date.now()

//   try {
//     console.log(`[v0] Testing workflow with message: "${data.testMessage}"`)

//     const triggerData = {
//       message: data.testMessage,
//       senderId: data.testSenderId || "test_user_123",
//       pageId: "test_page_123",
//       messageType: "dm",
//       platform: "instagram",
//       timestamp: new Date().toISOString(),
//     }

//     // Execute workflow in test mode
//     const result = await executeWorkflow(
//       "test_workflow_" + Date.now(),
//       data.nodes,
//       data.connections,
//       triggerData,
//       data.userId,
//       "instagram",
//       triggerData.senderId,
//     )

//     const executionTime = Date.now() - startTime

//     return {
//       success: result.success,
//       responses: result.responses,
//       executionTime,
//       error: result.error,
//       executedNodes: [], // Will be populated by the workflow engine
//     }
//   } catch (error) {
//     const executionTime = Date.now() - startTime
//     console.error("[v0] Workflow test failed:", error)

//     return {
//       success: false,
//       responses: [],
//       executionTime,
//       error: error instanceof Error ? error.message : String(error),
//       executedNodes: [],
//     }
//   }
// }

// // Test Instagram API connection
// export async function testInstagramConnection(
//   accessToken: string,
//   pageId: string,
// ): Promise<{
//   success: boolean
//   error?: string
//   pageInfo?: any
// }> {
//   try {
//     console.log(`[v0] Testing Instagram connection for page: ${pageId}`)

//     // Test API connection by fetching page info
//     const response = await fetch(
//       `https://graph.facebook.com/v18.0/${pageId}?fields=name,username,followers_count&access_token=${accessToken}`,
//     )

//     if (!response.ok) {
//       const error = await response.json()
//       return {
//         success: false,
//         error: error.error?.message || "Failed to connect to Instagram API",
//       }
//     }

//     const pageInfo = await response.json()

//     return {
//       success: true,
//       pageInfo,
//     }
//   } catch (error) {
//     console.error("[v0] Instagram connection test failed:", error)
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : String(error),
//     }
//   }
// }

// // Send a test message via Instagram (for production testing)
// export async function sendTestMessage(
//   accessToken: string,
//   pageId: string,
//   recipientId: string,
//   message: string,
// ): Promise<{ success: boolean; error?: string; messageId?: string }> {
//   try {
//     console.log(`[v0] Sending test message to ${recipientId}: "${message}"`)

//     const sender = new InstagramSender(accessToken, pageId)
//     const success = await sender.sendMessage(recipientId, { text: message })

//     if (success) {
//       return {
//         success: true,
//         messageId: `test_${Date.now()}`,
//       }
//     } else {
//       return {
//         success: false,
//         error: "Failed to send test message",
//       }
//     }
//   } catch (error) {
//     console.error("[v0] Test message failed:", error)
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : String(error),
//     }
//   }
// }

// // Validate workflow structure
// export async function validateWorkflow(
//   nodes: WorkflowNode[],
//   connections: WorkflowConnection[],
// ): Promise<{
//   isValid: boolean
//   errors: string[]
//   warnings: string[]
// }> {
//   const errors: string[] = []
//   const warnings: string[] = []

//   try {
//     // Check for trigger node
//     const triggerNodes = nodes.filter((node) => node.type === "trigger")
//     if (triggerNodes.length === 0) {
//       errors.push("Workflow must have at least one trigger node")
//     } else if (triggerNodes.length > 1) {
//       warnings.push("Multiple trigger nodes found - only the first one will be used")
//     }

//     // Check for orphaned nodes (nodes with no connections)
//     const connectedNodeIds = new Set([
//       ...connections.map((conn) => conn.source),
//       ...connections.map((conn) => conn.target),
//     ])

//     const orphanedNodes = nodes.filter((node) => node.type !== "trigger" && !connectedNodeIds.has(node.id))

//     if (orphanedNodes.length > 0) {
//       warnings.push(`${orphanedNodes.length} orphaned nodes found (not connected to workflow)`)
//     }

//     // Check for infinite loops (basic check)
//     const visited = new Set<string>()
//     const recursionStack = new Set<string>()

//     function hasLoop(nodeId: string): boolean {
//       if (recursionStack.has(nodeId)) return true
//       if (visited.has(nodeId)) return false

//       visited.add(nodeId)
//       recursionStack.add(nodeId)

//       const outgoingConnections = connections.filter((conn) => conn.source === nodeId)
//       for (const conn of outgoingConnections) {
//         if (hasLoop(conn.target)) return true
//       }

//       recursionStack.delete(nodeId)
//       return false
//     }

//     if (triggerNodes.length > 0 && hasLoop(triggerNodes[0].id)) {
//       errors.push("Workflow contains infinite loops")
//     }

//     // Validate node configurations
//     for (const node of nodes) {
//       switch (node.type) {
//         case "text":
//           if (!node.data.message || node.data.message.trim() === "") {
//             errors.push(`Text node "${node.id}" is missing message content`)
//           }
//           break

//         case "button":
//           if (!node.data.message || node.data.message.trim() === "") {
//             errors.push(`Button node "${node.id}" is missing message content`)
//           }
//           if (!node.data.buttons || node.data.buttons.length === 0) {
//             errors.push(`Button node "${node.id}" has no buttons configured`)
//           }
//           break

//         case "condition":
//           if (!node.data.variable || !node.data.condition || !node.data.value) {
//             errors.push(`Condition node "${node.id}" is missing required configuration`)
//           }
//           break

//         case "api":
//           if (!node.data.url || !node.data.method) {
//             errors.push(`API node "${node.id}" is missing URL or method`)
//           }
//           break

//         case "webhook":
//           if (!node.data.url) {
//             errors.push(`Webhook node "${node.id}" is missing URL`)
//           }
//           break
//       }
//     }

//     return {
//       isValid: errors.length === 0,
//       errors,
//       warnings,
//     }
//   } catch (error) {
//     console.error("[v0] Workflow validation failed:", error)
//     return {
//       isValid: false,
//       errors: ["Workflow validation failed: " + (error instanceof Error ? error.message : String(error))],
//       warnings,
//     }
//   }
// }

"use server"

import { executeWorkflow } from "@/lib/workflow-engine"
import type { WorkflowNode, WorkflowConnection } from "@/lib/workflow-store"
import { sendDMs } from "@/lib/instagram-messaging"

export interface TestWorkflowData {
  nodes: WorkflowNode[]
  connections: WorkflowConnection[]
  testMessage: string
  testSenderId?: string
  userId: string
}

export interface TestResult {
  success: boolean
  responses: any[]
  executionTime: number
  error?: string
  executedNodes: any[]
}

// Test workflow execution without sending actual messages
export async function testWorkflow(data: TestWorkflowData): Promise<TestResult> {
  const startTime = Date.now()

  try {
    console.log(`[v0] Testing workflow with message: "${data.testMessage}"`)

    const triggerData = {
      message: data.testMessage,
      senderId: data.testSenderId || "test_user_123",
      pageId: "test_page_123",
      messageType: "dm",
      platform: "instagram",
      timestamp: new Date().toISOString(),
    }

    // Execute workflow in test mode
    const result = await executeWorkflow(
      "test_workflow_" + Date.now(),
      data.nodes,
      data.connections,
      triggerData,
      data.userId,
      "instagram",
      triggerData.senderId,
    )

    const executionTime = Date.now() - startTime

    return {
      success: result.success,
      responses: result.responses,
      executionTime,
      error: result.error,
      executedNodes: [], // Will be populated by the workflow engine
    }
  } catch (error) {
    const executionTime = Date.now() - startTime
    console.error("[v0] Workflow test failed:", error)

    return {
      success: false,
      responses: [],
      executionTime,
      error: error instanceof Error ? error.message : String(error),
      executedNodes: [],
    }
  }
}

// Test Instagram API connection
export async function testInstagramConnection(
  accessToken: string,
  pageId: string,
): Promise<{
  success: boolean
  error?: string
  pageInfo?: any
}> {
  try {
    console.log(`[v0] Testing Instagram connection for page: ${pageId}`)

    // Test API connection by fetching page info
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}?fields=name,username,followers_count&access_token=${accessToken}`,
    )

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        error: error.error?.message || "Failed to connect to Instagram API",
      }
    }

    const pageInfo = await response.json()

    return {
      success: true,
      pageInfo,
    }
  } catch (error) {
    console.error("[v0] Instagram connection test failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

// Send a test message via Instagram (for production testing)
export async function sendTestMessage(
  accessToken: string,
  pageId: string,
  recipientId: string,
  message: string,
): Promise<{ success: boolean; error?: string; messageId?: string }> {
  try {
    console.log(`[v0] Sending test message to ${recipientId}: "${message}"`)

    const response = await sendDMs(pageId, recipientId, message, accessToken)

    if (response.status === 200) {
      return {
        success: true,
        messageId: `test_${Date.now()}`,
      }
    } else {
      return {
        success: false,
        error: "Failed to send test message",
      }
    }
  } catch (error) {
    console.error("[v0] Test message failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

// Validate workflow structure
export async function validateWorkflow(
  nodes: WorkflowNode[],
  connections: WorkflowConnection[],
): Promise<{
  isValid: boolean
  errors: string[]
  warnings: string[]
}> {
  const errors: string[] = []
  const warnings: string[] = []

  try {
    // Check for trigger node
    const triggerNodes = nodes.filter((node) => node.type === "trigger")
    if (triggerNodes.length === 0) {
      errors.push("Workflow must have at least one trigger node")
    } else if (triggerNodes.length > 1) {
      warnings.push("Multiple trigger nodes found - only the first one will be used")
    }

    // Check for orphaned nodes (nodes with no connections)
    // Use the correct property names from WorkflowConnection
    const connectedNodeIds = new Set([
      ...connections.map((conn) => conn.fromNodeId),
      ...connections.map((conn) => conn.toNodeId),
    ])

    const orphanedNodes = nodes.filter((node) => node.type !== "trigger" && !connectedNodeIds.has(node.id))

    if (orphanedNodes.length > 0) {
      warnings.push(`${orphanedNodes.length} orphaned nodes found (not connected to workflow)`)
    }

    // Check for infinite loops (basic check)
    const visited = new Set<string>()
    const recursionStack = new Set<string>()

    function hasLoop(nodeId: string): boolean {
      if (recursionStack.has(nodeId)) return true
      if (visited.has(nodeId)) return false

      visited.add(nodeId)
      recursionStack.add(nodeId)

      // Use the correct property names from WorkflowConnection
      const outgoingConnections = connections.filter((conn) => conn.fromNodeId === nodeId)
      for (const conn of outgoingConnections) {
        if (hasLoop(conn.toNodeId)) return true
      }

      recursionStack.delete(nodeId)
      return false
    }

    if (triggerNodes.length > 0 && hasLoop(triggerNodes[0].id)) {
      errors.push("Workflow contains infinite loops")
    }

    // Validate node configurations
    for (const node of nodes) {
      switch (node.type) {
        case "text":
          if (!node.data.message || node.data.message.trim() === "") {
            errors.push(`Text node "${node.id}" is missing message content`)
          }
          break

        case "button":
          if (!node.data.message || node.data.message.trim() === "") {
            errors.push(`Button node "${node.id}" is missing message content`)
          }
          if (!node.data.buttons || node.data.buttons.length === 0) {
            errors.push(`Button node "${node.id}" has no buttons configured`)
          }
          break

        case "condition":
          if (!node.data.variable || !node.data.condition || !node.data.value) {
            errors.push(`Condition node "${node.id}" is missing required configuration`)
          }
          // Additional validation for condition nodes - check if they have both true and false connections
          const trueConnection = connections.find((conn) => conn.fromNodeId === node.id && conn.fromHandle === "true")
          const falseConnection = connections.find((conn) => conn.fromNodeId === node.id && conn.fromHandle === "false")

          if (!trueConnection) {
            errors.push(`Condition node "${node.id}" is missing "true" path connection`)
          }
          if (!falseConnection) {
            errors.push(`Condition node "${node.id}" is missing "false" path connection`)
          }
          break

        case "api":
          if (!node.data.url || !node.data.method) {
            errors.push(`API node "${node.id}" is missing URL or method`)
          }
          break

        case "webhook":
          if (!node.data.url) {
            errors.push(`Webhook node "${node.id}" is missing URL`)
          }
          break

        case "delay":
          if (!node.data.delay || node.data.delay <= 0) {
            warnings.push(`Delay node "${node.id}" has invalid delay value`)
          }
          break

        case "image":
          if (!node.data.imageUrl) {
            errors.push(`Image node "${node.id}" is missing image URL`)
          }
          break
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  } catch (error) {
    console.error("[v0] Workflow validation failed:", error)
    return {
      isValid: false,
      errors: ["Workflow validation failed: " + (error instanceof Error ? error.message : String(error))],
      warnings,
    }
  }
}
