// still in use - Enhanced enterprise-grade workflow engine
import type { WorkflowNode } from "@/types/workflow"
import { prisma } from "./prisma"

export interface WorkflowExecution {
  id: string
  status: "running" | "completed" | "failed" | "paused"
  currentNodeId: string | null
  variables: Record<string, any>
  history: ExecutionStep[]
  startTime: Date
  endTime?: Date
  executionTime?: number
  executedNodes?: string[]
  responses?: any[]
  error?: string
}

export interface ExecutionStep {
  nodeId: string
  timestamp: Date
  input?: any
  output?: any
  duration: number
  status: "success" | "error" | "skipped"
  error?: string
}

export interface MessageContext {
  content: string
  sender: string
  platform: "dm" | "comment" | "instagram" | "twitter" | "facebook"
  metadata?: Record<string, any>
}

export class WorkflowEngine {
  private executions: Map<string, WorkflowExecution> = new Map()

  async executeWorkflow(
    nodes: WorkflowNode[],
    trigger: MessageContext,
    executionId?: string,
  ): Promise<WorkflowExecution> {
    const id = executionId || `exec-${Date.now()}`
    const startNode = nodes.find((n) => n.type === "trigger")

    if (!startNode) {
      throw new Error("No trigger node found in workflow")
    }

    const execution: WorkflowExecution = {
      id,
      status: "running",
      currentNodeId: startNode.id,
      variables: {
        message: trigger.content,
        sender: trigger.sender,
        platform: trigger.platform,
        timestamp: new Date().toISOString(),
        ...trigger.metadata,
      },
      history: [],
      startTime: new Date(),
      executedNodes: [],
      responses: [],
    }

    this.executions.set(id, execution)

    try {
      await this.executeNode(nodes, startNode, execution, trigger)
      execution.status = "completed"
      execution.endTime = new Date()
      execution.executionTime = execution.endTime.getTime() - execution.startTime.getTime()
    } catch (error) {
      execution.status = "failed"
      execution.endTime = new Date()
      execution.executionTime = execution.endTime.getTime() - execution.startTime.getTime()
      execution.error = error instanceof Error ? error.message : "Unknown error"
      console.error("Workflow execution failed:", error)
    }

    return execution
  }

  private async executeNode(
    nodes: WorkflowNode[],
    node: WorkflowNode,
    execution: WorkflowExecution,
    context: MessageContext,
  ): Promise<void> {
    const stepStart = Date.now()
    execution.currentNodeId = node.id
    execution.executedNodes?.push(node.id)

    try {
      const result = await this.processNode(node, execution, context)

      const step: ExecutionStep = {
        nodeId: node.id,
        timestamp: new Date(),
        input: context,
        output: result,
        duration: Date.now() - stepStart,
        status: "success",
      }

      execution.history.push(step)

      // Store responses for later retrieval
      if (result && (result.type === "text" || result.type === "image" || result.type === "buttons")) {
        execution.responses?.push(result)
      }

      // Handle conditional routing
      if (node.type === "condition" && result.result !== undefined) {
        const nextNodeId = result.result ? node.data.trueAction : node.data.falseAction
        if (nextNodeId && nextNodeId !== "continue") {
          const nextNode = nodes.find((n) => n.id === nextNodeId)
          if (nextNode) {
            await this.executeNode(nodes, nextNode, execution, context)
          }
        }
      } else {
        // Handle normal node connections
        if (node.connections.length > 0) {
          for (const connectionId of node.connections) {
            const nextNode = nodes.find((n) => n.id === connectionId)
            if (nextNode) {
              await this.executeNode(nodes, nextNode, execution, context)
            }
          }
        }
      }
    } catch (error) {
      const step: ExecutionStep = {
        nodeId: node.id,
        timestamp: new Date(),
        input: context,
        output: null,
        duration: Date.now() - stepStart,
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      }

      execution.history.push(step)
      throw error
    }
  }

  private async processNode(node: WorkflowNode, execution: WorkflowExecution, context: MessageContext): Promise<any> {
    switch (node.type) {
      case "trigger":
        return await this.processTriggerNode(node, execution, context)

      case "text":
        return await this.processTextNode(node, execution, context)

      case "button":
        return await this.processButtonNode(node, execution, context)

      case "image":
        return await this.processImageNode(node, execution, context)

      case "condition":
        return await this.processConditionNode(node, execution, context)

      case "delay":
        return await this.processDelayNode(node, execution, context)

      case "api":
        return await this.processApiNode(node, execution, context)

      case "webhook":
        return await this.processWebhookNode(node, execution, context)

      default:
        throw new Error(`Unknown node type: ${node.type}`)
    }
  }

  private async processTriggerNode(node: WorkflowNode, execution: WorkflowExecution, context: MessageContext) {
    // Validate trigger conditions
    const triggerType = node.data.triggerType || "dm"
    const platforms = node.data.platforms || ["instagram"]

    if (!platforms.includes(context.platform)) {
      throw new Error(`Platform ${context.platform} not supported by this trigger`)
    }

    return {
      triggered: true,
      message: context.content,
      platform: context.platform,
      triggerType,
      timestamp: new Date().toISOString(),
    }
  }

  private async processTextNode(node: WorkflowNode, execution: WorkflowExecution, context: MessageContext) {
    const message = this.interpolateVariables(node.data.message || "", execution.variables)

    // Validate message content
    if (!message.trim()) {
      throw new Error("Text node has empty message content")
    }

    // Simulate API call delay
    await this.simulateDelay(100)

    const response = {
      type: "text",
      content: message,
      buttons: node.data.buttons || [],
      timestamp: new Date().toISOString(),
      platform: context.platform,
    }

    execution.variables.lastResponse = response
    return response
  }

  private async processButtonNode(node: WorkflowNode, execution: WorkflowExecution, context: MessageContext) {
    const buttons = node.data.buttons || []

    if (buttons.length === 0) {
      throw new Error("Button node has no buttons configured")
    }

    await this.simulateDelay(50)

    const response = {
      type: "buttons",
      buttons: buttons.map((btn: any) => ({
        text: btn.text,
        action: btn.action,
        id: btn.id,
      })),
      timestamp: new Date().toISOString(),
      platform: context.platform,
    }

    execution.variables.lastResponse = response
    return response
  }

  private async processImageNode(node: WorkflowNode, execution: WorkflowExecution, context: MessageContext) {
    const imageUrl = node.data.imageUrl
    const caption = this.interpolateVariables(node.data.caption || "", execution.variables)

    if (!imageUrl) {
      throw new Error("Image node has no image URL configured")
    }

    await this.simulateDelay(200)

    const response = {
      type: "image",
      imageUrl,
      caption,
      buttons: node.data.buttons || [],
      timestamp: new Date().toISOString(),
      platform: context.platform,
    }

    execution.variables.lastResponse = response
    return response
  }

  private async processConditionNode(node: WorkflowNode, execution: WorkflowExecution, context: MessageContext) {
    const condition = node.data.condition || "contains"
    const value = node.data.value || ""
    const caseSensitive = node.data.caseSensitive || false

    if (!value.trim()) {
      throw new Error("Condition node has no value to check against")
    }

    const message = caseSensitive ? context.content : context.content.toLowerCase()
    const checkValue = caseSensitive ? value : value.toLowerCase()

    let result = false

    switch (condition) {
      case "contains":
        result = message.includes(checkValue)
        break
      case "equals":
        result = message === checkValue
        break
      case "starts_with":
        result = message.startsWith(checkValue)
        break
      case "ends_with":
        result = message.endsWith(checkValue)
        break
      case "regex":
        try {
          const flags = caseSensitive ? "g" : "gi"
          const regex = new RegExp(value, flags)
          result = regex.test(message)
        } catch (error) {
          throw new Error(`Invalid regex pattern: ${value}`)
        }
        break
      case "length_greater":
        result = message.length > Number.parseInt(checkValue)
        break
      case "length_less":
        result = message.length < Number.parseInt(checkValue)
        break
      default:
        throw new Error(`Unknown condition type: ${condition}`)
    }

    execution.variables.conditionResult = result
    execution.variables.lastCondition = {
      condition,
      value,
      result,
      message,
      caseSensitive,
    }

    return {
      condition,
      value,
      result,
      action: result ? node.data.trueAction : node.data.falseAction,
      timestamp: new Date().toISOString(),
    }
  }

  private async processDelayNode(node: WorkflowNode, execution: WorkflowExecution, context: MessageContext) {
    const duration = node.data.duration || 5
    const unit = node.data.unit || "seconds"
    const randomize = node.data.randomize || false

    let delayMs = duration * 1000 // Default to seconds

    switch (unit) {
      case "minutes":
        delayMs = duration * 60 * 1000
        break
      case "hours":
        delayMs = duration * 60 * 60 * 1000
        break
    }

    // Add randomization if enabled
    if (randomize) {
      const variance = delayMs * 0.2 // ±20% variance
      delayMs += (Math.random() - 0.5) * variance
    }

    // In production, this would schedule the delay properly
    // For demo purposes, we'll simulate it with a shorter delay
    const actualDelay = Math.min(delayMs, 2000) // Cap at 2 seconds for demo
    await this.simulateDelay(actualDelay)

    return {
      delayed: true,
      duration,
      unit,
      randomize,
      actualDelayMs: delayMs,
      demoDelayMs: actualDelay,
      timestamp: new Date().toISOString(),
    }
  }

  private async processApiNode(node: WorkflowNode, execution: WorkflowExecution, context: MessageContext) {
    const endpoint = node.data.endpoint
    const method = node.data.method || "POST"
    const headers = node.data.headers || {}
    const body = this.interpolateVariables(node.data.body || "", execution.variables)

    if (!endpoint) {
      throw new Error("API node has no endpoint configured")
    }

    try {
      // In production, this would make a real API call
      await this.simulateDelay(300)

      const response = {
        type: "api_call",
        endpoint,
        method,
        status: 200,
        data: { success: true, message: "API call simulated" },
        timestamp: new Date().toISOString(),
      }

      execution.variables.lastApiResponse = response
      return response
    } catch (error) {
      throw new Error(`API call failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  private async processWebhookNode(node: WorkflowNode, execution: WorkflowExecution, context: MessageContext) {
    const url = node.data.url
    const method = node.data.method || "POST"
    const headers = node.data.headers || {}
    const payload = this.interpolateVariables(node.data.payload || "", execution.variables)
    const retries = node.data.retries || 3

    if (!url) {
      throw new Error("Webhook node has no URL configured")
    }

    try {
      // In production, this would make a real webhook call with retries
      await this.simulateDelay(200)

      const response = {
        type: "webhook",
        url,
        method,
        status: 200,
        retries,
        timestamp: new Date().toISOString(),
      }

      execution.variables.lastWebhookResponse = response
      return response
    } catch (error) {
      throw new Error(`Webhook call failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  private interpolateVariables(text: string, variables: Record<string, any>): string {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables[key] !== undefined ? String(variables[key]) : match
    })
  }

  private async simulateDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async saveExecution(execution: WorkflowExecution, workflowId: string): Promise<void> {
    try {
      await prisma.workflowExecutions.create({
        data: {
          id: execution.id,
          workflowId,
          triggerData: {
            message: execution.variables.message,
            sender: execution.variables.sender,
            platform: execution.variables.platform,
          },
          platform: execution.variables.platform,
          senderId: execution.variables.sender,
          status: execution.status,
          startedAt: execution.startTime,
          completedAt: execution.endTime,
          errorMessage: execution.error,
          executedNodes: execution.executedNodes || [],
          responses: execution.responses || [],
        },
      })
    } catch (error) {
      console.error("Failed to save execution:", error)
    }
  }

  getExecution(id: string): WorkflowExecution | undefined {
    return this.executions.get(id)
  }

  getAllExecutions(): WorkflowExecution[] {
    return Array.from(this.executions.values())
  }

  clearExecutions(): void {
    this.executions.clear()
  }

  validateWorkflow(nodes: WorkflowNode[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Check for trigger nodes
    const triggers = nodes.filter((node) => node.type === "trigger")
    if (triggers.length === 0) {
      errors.push("Workflow must have at least one trigger node")
    }

    // Check for disconnected nodes
    const connectedNodes = new Set<string>()
    const startNodes = triggers.map((t) => t.id)

    const traverse = (nodeId: string) => {
      if (connectedNodes.has(nodeId)) return
      connectedNodes.add(nodeId)

      const node = nodes.find((n) => n.id === nodeId)
      if (node) {
        node.connections.forEach((connId) => traverse(connId))
      }
    }

    startNodes.forEach(traverse)

    const disconnectedNodes = nodes.filter((node) => !connectedNodes.has(node.id))
    if (disconnectedNodes.length > 0) {
      errors.push(`${disconnectedNodes.length} nodes are not connected to the workflow`)
    }

    // Validate individual nodes
    nodes.forEach((node) => {
      switch (node.type) {
        case "text":
          if (!node.data.message?.trim()) {
            errors.push(`Text node "${node.data.title || node.id}" has no message content`)
          }
          break
        case "condition":
          if (!node.data.condition || !node.data.value?.trim()) {
            errors.push(`Condition node "${node.data.title || node.id}" is missing condition or value`)
          }
          break
        case "image":
          if (!node.data.imageUrl?.trim()) {
            errors.push(`Image node "${node.data.title || node.id}" has no image URL`)
          }
          break
        case "api":
          if (!node.data.endpoint?.trim()) {
            errors.push(`API node "${node.data.title || node.id}" has no endpoint configured`)
          }
          break
        case "webhook":
          if (!node.data.url?.trim()) {
            errors.push(`Webhook node "${node.data.title || node.id}" has no URL configured`)
          }
          break
      }
    })

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}

// Singleton instance
export const workflowEngine = new WorkflowEngine()
