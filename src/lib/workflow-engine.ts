import type { WorkflowNode, WorkflowConnection } from "./workflow-store-production"
import { createWorkflowExecution, updateWorkflowExecution } from "@/actions/workflow/execution-actions"
import { recordWorkflowAnalytics } from "@/actions/workflow/analytics-actions"

export interface WorkflowContext {
  variables: Record<string, any>
  triggerData: any
  userId: string
  workflowId: string
  executionId: string
  platform: string
  senderId: string
  senderUsername?: string
}

export interface NodeExecutionResult {
  success: boolean
  output?: any
  nextNodeId?: string
  error?: string
  shouldStop?: boolean
  responses?: any[]
}

export class WorkflowEngine {
  private nodes: WorkflowNode[]
  private connections: WorkflowConnection[]
  private context: WorkflowContext

  constructor(nodes: WorkflowNode[], connections: WorkflowConnection[], context: WorkflowContext) {
    this.nodes = nodes
    this.connections = connections
    this.context = context
  }

  // Execute the entire workflow
  async execute(): Promise<{ success: boolean; responses: any[]; error?: string; variables?: Record<string, any> }> {
    const startTime = Date.now()
    const responses: any[] = []
    const executedNodes: any[] = []

    try {
      // Find the trigger node (start of workflow)
      const triggerNode = this.nodes.find((node) => node.type === "trigger")
      if (!triggerNode) {
        throw new Error("No trigger node found in workflow")
      }

      let currentNodeId: string = triggerNode.id
      let iterationCount = 0
      const maxIterations = 100 // Prevent infinite loops

      while (currentNodeId && iterationCount < maxIterations) {
        const currentNode = this.nodes.find((node) => node.id === currentNodeId)
        if (!currentNode) {
          throw new Error(`Node not found: ${currentNodeId}`)
        }

        console.log(`[v0] Executing node: ${currentNode.type} (${currentNode.id})`)

        // Update execution progress
        await updateWorkflowExecution(this.context.executionId, {
          currentNode: currentNodeId,
          executedNodes: [
            ...executedNodes,
            {
              nodeId: currentNodeId,
              nodeType: currentNode.type,
              timestamp: new Date(),
              data: currentNode.data,
            },
          ],
        })

        // Execute the current node
        const result = await this.executeNode(currentNode)

        if (!result.success) {
          throw new Error(result.error || `Node execution failed: ${currentNode.type}`)
        }

        // Collect responses
        if (result.responses) {
          responses.push(...result.responses)
        }

        // Update context variables with node output
        if (result.output) {
          this.context.variables = { ...this.context.variables, ...result.output }
        }

        // Check if workflow should stop
        if (result.shouldStop) {
          break
        }

        // Find next node
        const nextNodeId = result.nextNodeId || this.getNextNodeId(currentNodeId)
        if (!nextNodeId) {
          console.log(`[v0] No next node found, ending workflow`)
          break
        }
        currentNodeId = nextNodeId
        iterationCount++

        executedNodes.push({
          nodeId: currentNode.id,
          nodeType: currentNode.type,
          timestamp: new Date(),
          success: true,
          output: result.output,
        })
      }

      // Mark execution as completed
      await updateWorkflowExecution(this.context.executionId, {
        status: "completed",
        executedNodes,
        responses: responses.length > 0 ? responses : undefined,
      })

      // Record analytics
      const duration = (Date.now() - startTime) / 1000
      await recordWorkflowAnalytics(this.context.userId, this.context.workflowId, {
        executions: 1,
        completions: 1,
        avgDuration: duration,
        responses: responses.length,
      })

      console.log(`[v0] Workflow execution completed successfully`)
      return { success: true, responses, variables: this.context.variables }
    } catch (error) {
      console.error(`[v0] Workflow execution failed:`, error)

      // Mark execution as failed
      await updateWorkflowExecution(this.context.executionId, {
        status: "failed",
        errorMessage: error instanceof Error ? error.message : String(error),
        executedNodes,
      })

      // Record failure analytics
      await recordWorkflowAnalytics(this.context.userId, this.context.workflowId, {
        executions: 1,
        failures: 1,
      })

      return {
        success: false,
        responses: [],
        error: error instanceof Error ? error.message : String(error),
        variables: this.context.variables,
      }
    }
  }

  // Execute a single node
  private async executeNode(node: WorkflowNode): Promise<NodeExecutionResult> {
    console.log(`[v0] Executing ${node.type} node with data:`, node.data)

    switch (node.type) {
      case "trigger":
        return this.executeTriggerNode(node)

      case "text":
        return this.executeTextNode(node)

      case "button":
        return this.executeButtonNode(node)

      case "image":
        return this.executeImageNode(node)

      case "condition":
        return this.executeConditionNode(node)

      case "delay":
        return this.executeDelayNode(node)

      case "api":
        return this.executeApiNode(node)

      case "webhook":
        return this.executeWebhookNode(node)

      default:
        return {
          success: false,
          error: `Unknown node type: ${node.type}`,
        }
    }
  }

  // Node execution implementations
  private async executeTriggerNode(node: WorkflowNode): Promise<NodeExecutionResult> {
    // Trigger node just passes through - it's the entry point
    return {
      success: true,
      output: {
        triggerMessage: this.context.triggerData.message || "",
        senderId: this.context.senderId,
        platform: this.context.platform,
      },
    }
  }

  private async executeTextNode(node: WorkflowNode): Promise<NodeExecutionResult> {
    const message = this.replaceVariables(node.data.message || "")

    return {
      success: true,
      responses: [
        {
          type: "text",
          text: message,
        },
      ],
      output: { lastMessage: message },
    }
  }

  private async executeButtonNode(node: WorkflowNode): Promise<NodeExecutionResult> {
    const message = this.replaceVariables(node.data.message || "")
    const buttons = (node.data.buttons || []).map((btn: any) => ({
      title: this.replaceVariables(btn.title || ""),
      payload: btn.payload || btn.title || "",
      url: btn.url,
    }))

    return {
      success: true,
      responses: [
        {
          type: "buttons",
          text: message,
          buttons,
        },
      ],
      output: { lastMessage: message, buttonCount: buttons.length },
    }
  }

  private async executeImageNode(node: WorkflowNode): Promise<NodeExecutionResult> {
    const caption = this.replaceVariables(node.data.caption || "")
    const imageUrl = node.data.imageUrl || ""

    return {
      success: true,
      responses: [
        {
          type: "image",
          attachment: {
            type: "image",
            url: imageUrl,
            caption,
          },
        },
      ],
      output: { lastImageUrl: imageUrl },
    }
  }

  private async executeConditionNode(node: WorkflowNode): Promise<NodeExecutionResult> {
    const condition = node.data.condition || ""
    const variable = node.data.variable || ""
    const value = node.data.value || ""

    // Get the actual variable value
    const actualValue = this.context.variables[variable] || ""

    let conditionMet = false

    switch (condition) {
      case "equals":
        conditionMet = actualValue === value
        break
      case "contains":
        conditionMet = String(actualValue).toLowerCase().includes(String(value).toLowerCase())
        break
      case "starts_with":
        conditionMet = String(actualValue).toLowerCase().startsWith(String(value).toLowerCase())
        break
      case "ends_with":
        conditionMet = String(actualValue).toLowerCase().endsWith(String(value).toLowerCase())
        break
      case "greater_than":
        conditionMet = Number(actualValue) > Number(value)
        break
      case "less_than":
        conditionMet = Number(actualValue) < Number(value)
        break
      default:
        conditionMet = false
    }

    // Find the appropriate next node based on condition result
    // Use the correct property names from WorkflowConnection
    const trueConnection = this.connections.find((conn) => conn.fromNodeId === node.id && conn.fromHandle === "true")
    const falseConnection = this.connections.find((conn) => conn.fromNodeId === node.id && conn.fromHandle === "false")

    const nextNodeId = conditionMet ? trueConnection?.toNodeId : falseConnection?.toNodeId

    return {
      success: true,
      nextNodeId,
      output: {
        conditionResult: conditionMet,
        checkedVariable: variable,
        checkedValue: actualValue,
      },
    }
  }

  private async executeDelayNode(node: WorkflowNode): Promise<NodeExecutionResult> {
    const delayMs = (node.data.delay || 1) * 1000 // Convert seconds to milliseconds

    console.log(`[v0] Delaying execution for ${delayMs}ms`)
    await new Promise((resolve) => setTimeout(resolve, delayMs))

    return {
      success: true,
      output: { delayExecuted: delayMs },
    }
  }

  private async executeApiNode(node: WorkflowNode): Promise<NodeExecutionResult> {
    try {
      const url = this.replaceVariables(node.data.url || "")
      const method = node.data.method || "GET"
      const headers = node.data.headers || {}
      const body = node.data.body ? this.replaceVariables(JSON.stringify(node.data.body)) : undefined

      console.log(`[v0] Making API call: ${method} ${url}`)

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        ...(body && { body }),
      })

      const responseData = await response.json()

      return {
        success: true,
        output: {
          apiResponse: responseData,
          apiStatus: response.status,
          apiUrl: url,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: `API call failed: ${error instanceof Error ? error.message : String(error)}`,
      }
    }
  }

  private async executeWebhookNode(node: WorkflowNode): Promise<NodeExecutionResult> {
    try {
      const url = this.replaceVariables(node.data.url || "")
      const payload = {
        workflowId: this.context.workflowId,
        executionId: this.context.executionId,
        triggerData: this.context.triggerData,
        variables: this.context.variables,
        timestamp: new Date().toISOString(),
      }

      console.log(`[v0] Sending webhook to: ${url}`)

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      return {
        success: true,
        output: {
          webhookSent: true,
          webhookUrl: url,
          webhookStatus: response.status,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: `Webhook failed: ${error instanceof Error ? error.message : String(error)}`,
      }
    }
  }

  // Helper methods
  private getNextNodeId(currentNodeId: string): string | undefined {
    const connection = this.connections.find((conn) => conn.fromNodeId === currentNodeId)
    return connection?.toNodeId
  }

  private replaceVariables(text: string): string {
    let result = text

    // Replace workflow variables
    Object.entries(this.context.variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, "g")
      result = result.replace(regex, String(value))
    })

    // Replace system variables
    result = result.replace(/{{sender_id}}/g, this.context.senderId)
    result = result.replace(/{{platform}}/g, this.context.platform)
    result = result.replace(/{{trigger_message}}/g, this.context.triggerData.message || "")

    return result
  }
}

// Factory function to create and execute workflows
export async function executeWorkflow(
  workflowId: string,
  nodes: WorkflowNode[],
  connections: WorkflowConnection[],
  triggerData: any,
  userId: string,
  platform: string,
  senderId: string,
  senderUsername?: string,
): Promise<{ success: boolean; responses: any[]; error?: string }> {
  // Create execution record
  const executionResult = await createWorkflowExecution({
    workflowId,
    triggerData,
    platform,
    senderId,
    senderUsername,
  })

  if (!executionResult.success) {
    return { success: false, responses: [], error: "Failed to create execution record" }
  }

  // Create workflow context
  const context: WorkflowContext = {
    variables: {},
    triggerData,
    userId,
    workflowId,
    executionId: executionResult.execution!.id,
    platform,
    senderId,
    senderUsername,
  }

  // Create and execute workflow
  const engine = new WorkflowEngine(nodes, connections, context)
  return await engine.execute()
}
