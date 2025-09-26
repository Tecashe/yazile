// // still in use - Enhanced enterprise-grade workflow engine
// import type { WorkflowNode } from "@/types/workflow"
// import { prisma } from "./prisma"

// export interface WorkflowExecution {
//   id: string
//   status: "running" | "completed" | "failed" | "paused"
//   currentNodeId: string | null
//   variables: Record<string, any>
//   history: ExecutionStep[]
//   startTime: Date
//   endTime?: Date
//   executionTime?: number
//   executedNodes?: string[]
//   responses?: any[]
//   error?: string
// }

// export interface ExecutionStep {
//   nodeId: string
//   timestamp: Date
//   input?: any
//   output?: any
//   duration: number
//   status: "success" | "error" | "skipped"
//   error?: string
// }

// export interface MessageContext {
//   content: string
//   sender: string
//   platform: "dm" | "comment" | "instagram" | "twitter" | "facebook"
//   metadata?: Record<string, any>
// }

// export class WorkflowEngine {
//   private executions: Map<string, WorkflowExecution> = new Map()

//   async executeWorkflow(
//     nodes: WorkflowNode[],
//     trigger: MessageContext,
//     executionId?: string,
//   ): Promise<WorkflowExecution> {
//     const id = executionId || `exec-${Date.now()}`
//     const startNode = nodes.find((n) => n.type === "trigger")

//     if (!startNode) {
//       throw new Error("No trigger node found in workflow")
//     }

//     const execution: WorkflowExecution = {
//       id,
//       status: "running",
//       currentNodeId: startNode.id,
//       variables: {
//         message: trigger.content,
//         sender: trigger.sender,
//         platform: trigger.platform,
//         timestamp: new Date().toISOString(),
//         ...trigger.metadata,
//       },
//       history: [],
//       startTime: new Date(),
//       executedNodes: [],
//       responses: [],
//     }

//     this.executions.set(id, execution)

//     try {
//       await this.executeNode(nodes, startNode, execution, trigger)
//       execution.status = "completed"
//       execution.endTime = new Date()
//       execution.executionTime = execution.endTime.getTime() - execution.startTime.getTime()
//     } catch (error) {
//       execution.status = "failed"
//       execution.endTime = new Date()
//       execution.executionTime = execution.endTime.getTime() - execution.startTime.getTime()
//       execution.error = error instanceof Error ? error.message : "Unknown error"
//       console.error("Workflow execution failed:", error)
//     }

//     return execution
//   }

//   private async executeNode(
//     nodes: WorkflowNode[],
//     node: WorkflowNode,
//     execution: WorkflowExecution,
//     context: MessageContext,
//   ): Promise<void> {
//     const stepStart = Date.now()
//     execution.currentNodeId = node.id
//     execution.executedNodes?.push(node.id)

//     try {
//       const result = await this.processNode(node, execution, context)

//       const step: ExecutionStep = {
//         nodeId: node.id,
//         timestamp: new Date(),
//         input: context,
//         output: result,
//         duration: Date.now() - stepStart,
//         status: "success",
//       }

//       execution.history.push(step)

//       // Store responses for later retrieval
//       if (result && (result.type === "text" || result.type === "image" || result.type === "buttons")) {
//         execution.responses?.push(result)
//       }

//       // Handle conditional routing
//       if (node.type === "condition" && result.result !== undefined) {
//         const nextNodeId = result.result ? node.data.trueAction : node.data.falseAction
//         if (nextNodeId && nextNodeId !== "continue") {
//           const nextNode = nodes.find((n) => n.id === nextNodeId)
//           if (nextNode) {
//             await this.executeNode(nodes, nextNode, execution, context)
//           }
//         }
//       } else {
//         // Handle normal node connections
//         if (node.connections.length > 0) {
//           for (const connectionId of node.connections) {
//             const nextNode = nodes.find((n) => n.id === connectionId)
//             if (nextNode) {
//               await this.executeNode(nodes, nextNode, execution, context)
//             }
//           }
//         }
//       }
//     } catch (error) {
//       const step: ExecutionStep = {
//         nodeId: node.id,
//         timestamp: new Date(),
//         input: context,
//         output: null,
//         duration: Date.now() - stepStart,
//         status: "error",
//         error: error instanceof Error ? error.message : "Unknown error",
//       }

//       execution.history.push(step)
//       throw error
//     }
//   }

//   private async processNode(node: WorkflowNode, execution: WorkflowExecution, context: MessageContext): Promise<any> {
//     switch (node.type) {
//       case "trigger":
//         return await this.processTriggerNode(node, execution, context)

//       case "text":
//         return await this.processTextNode(node, execution, context)

//       case "button":
//         return await this.processButtonNode(node, execution, context)

//       case "image":
//         return await this.processImageNode(node, execution, context)

//       case "condition":
//         return await this.processConditionNode(node, execution, context)

//       case "delay":
//         return await this.processDelayNode(node, execution, context)

//       case "api":
//         return await this.processApiNode(node, execution, context)

//       case "webhook":
//         return await this.processWebhookNode(node, execution, context)

//       default:
//         throw new Error(`Unknown node type: ${node.type}`)
//     }
//   }

//   private async processTriggerNode(node: WorkflowNode, execution: WorkflowExecution, context: MessageContext) {
//     // Validate trigger conditions
//     const triggerType = node.data.triggerType || "dm"
//     const platforms = node.data.platforms || ["instagram"]

//     if (!platforms.includes(context.platform)) {
//       throw new Error(`Platform ${context.platform} not supported by this trigger`)
//     }

//     return {
//       triggered: true,
//       message: context.content,
//       platform: context.platform,
//       triggerType,
//       timestamp: new Date().toISOString(),
//     }
//   }

//   private async processTextNode(node: WorkflowNode, execution: WorkflowExecution, context: MessageContext) {
//     const message = this.interpolateVariables(node.data.message || "", execution.variables)

//     // Validate message content
//     if (!message.trim()) {
//       throw new Error("Text node has empty message content")
//     }

//     // Simulate API call delay
//     await this.simulateDelay(100)

//     const response = {
//       type: "text",
//       content: message,
//       buttons: node.data.buttons || [],
//       timestamp: new Date().toISOString(),
//       platform: context.platform,
//     }

//     execution.variables.lastResponse = response
//     return response
//   }

//   private async processButtonNode(node: WorkflowNode, execution: WorkflowExecution, context: MessageContext) {
//     const buttons = node.data.buttons || []

//     if (buttons.length === 0) {
//       throw new Error("Button node has no buttons configured")
//     }

//     await this.simulateDelay(50)

//     const response = {
//       type: "buttons",
//       buttons: buttons.map((btn: any) => ({
//         text: btn.text,
//         action: btn.action,
//         id: btn.id,
//       })),
//       timestamp: new Date().toISOString(),
//       platform: context.platform,
//     }

//     execution.variables.lastResponse = response
//     return response
//   }

//   private async processImageNode(node: WorkflowNode, execution: WorkflowExecution, context: MessageContext) {
//     const imageUrl = node.data.imageUrl
//     const caption = this.interpolateVariables(node.data.caption || "", execution.variables)

//     if (!imageUrl) {
//       throw new Error("Image node has no image URL configured")
//     }

//     await this.simulateDelay(200)

//     const response = {
//       type: "image",
//       imageUrl,
//       caption,
//       buttons: node.data.buttons || [],
//       timestamp: new Date().toISOString(),
//       platform: context.platform,
//     }

//     execution.variables.lastResponse = response
//     return response
//   }

//   private async processConditionNode(node: WorkflowNode, execution: WorkflowExecution, context: MessageContext) {
//     const condition = node.data.condition || "contains"
//     const value = node.data.value || ""
//     const caseSensitive = node.data.caseSensitive || false

//     if (!value.trim()) {
//       throw new Error("Condition node has no value to check against")
//     }

//     const message = caseSensitive ? context.content : context.content.toLowerCase()
//     const checkValue = caseSensitive ? value : value.toLowerCase()

//     let result = false

//     switch (condition) {
//       case "contains":
//         result = message.includes(checkValue)
//         break
//       case "equals":
//         result = message === checkValue
//         break
//       case "starts_with":
//         result = message.startsWith(checkValue)
//         break
//       case "ends_with":
//         result = message.endsWith(checkValue)
//         break
//       case "regex":
//         try {
//           const flags = caseSensitive ? "g" : "gi"
//           const regex = new RegExp(value, flags)
//           result = regex.test(message)
//         } catch (error) {
//           throw new Error(`Invalid regex pattern: ${value}`)
//         }
//         break
//       case "length_greater":
//         result = message.length > Number.parseInt(checkValue)
//         break
//       case "length_less":
//         result = message.length < Number.parseInt(checkValue)
//         break
//       default:
//         throw new Error(`Unknown condition type: ${condition}`)
//     }

//     execution.variables.conditionResult = result
//     execution.variables.lastCondition = {
//       condition,
//       value,
//       result,
//       message,
//       caseSensitive,
//     }

//     return {
//       condition,
//       value,
//       result,
//       action: result ? node.data.trueAction : node.data.falseAction,
//       timestamp: new Date().toISOString(),
//     }
//   }

//   private async processDelayNode(node: WorkflowNode, execution: WorkflowExecution, context: MessageContext) {
//     const duration = node.data.duration || 5
//     const unit = node.data.unit || "seconds"
//     const randomize = node.data.randomize || false

//     let delayMs = duration * 1000 // Default to seconds

//     switch (unit) {
//       case "minutes":
//         delayMs = duration * 60 * 1000
//         break
//       case "hours":
//         delayMs = duration * 60 * 60 * 1000
//         break
//     }

//     // Add randomization if enabled
//     if (randomize) {
//       const variance = delayMs * 0.2 // ±20% variance
//       delayMs += (Math.random() - 0.5) * variance
//     }

//     // In production, this would schedule the delay properly
//     // For demo purposes, we'll simulate it with a shorter delay
//     const actualDelay = Math.min(delayMs, 2000) // Cap at 2 seconds for demo
//     await this.simulateDelay(actualDelay)

//     return {
//       delayed: true,
//       duration,
//       unit,
//       randomize,
//       actualDelayMs: delayMs,
//       demoDelayMs: actualDelay,
//       timestamp: new Date().toISOString(),
//     }
//   }

//   private async processApiNode(node: WorkflowNode, execution: WorkflowExecution, context: MessageContext) {
//     const endpoint = node.data.endpoint
//     const method = node.data.method || "POST"
//     const headers = node.data.headers || {}
//     const body = this.interpolateVariables(node.data.body || "", execution.variables)

//     if (!endpoint) {
//       throw new Error("API node has no endpoint configured")
//     }

//     try {
//       // In production, this would make a real API call
//       await this.simulateDelay(300)

//       const response = {
//         type: "api_call",
//         endpoint,
//         method,
//         status: 200,
//         data: { success: true, message: "API call simulated" },
//         timestamp: new Date().toISOString(),
//       }

//       execution.variables.lastApiResponse = response
//       return response
//     } catch (error) {
//       throw new Error(`API call failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//     }
//   }

//   private async processWebhookNode(node: WorkflowNode, execution: WorkflowExecution, context: MessageContext) {
//     const url = node.data.url
//     const method = node.data.method || "POST"
//     const headers = node.data.headers || {}
//     const payload = this.interpolateVariables(node.data.payload || "", execution.variables)
//     const retries = node.data.retries || 3

//     if (!url) {
//       throw new Error("Webhook node has no URL configured")
//     }

//     try {
//       // In production, this would make a real webhook call with retries
//       await this.simulateDelay(200)

//       const response = {
//         type: "webhook",
//         url,
//         method,
//         status: 200,
//         retries,
//         timestamp: new Date().toISOString(),
//       }

//       execution.variables.lastWebhookResponse = response
//       return response
//     } catch (error) {
//       throw new Error(`Webhook call failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//     }
//   }

//   private interpolateVariables(text: string, variables: Record<string, any>): string {
//     return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
//       return variables[key] !== undefined ? String(variables[key]) : match
//     })
//   }

//   private async simulateDelay(ms: number): Promise<void> {
//     return new Promise((resolve) => setTimeout(resolve, ms))
//   }

//   async saveExecution(execution: WorkflowExecution, workflowId: string): Promise<void> {
//     try {
//       await prisma.workflowExecutions.create({
//         data: {
//           id: execution.id,
//           workflowId,
//           triggerData: {
//             message: execution.variables.message,
//             sender: execution.variables.sender,
//             platform: execution.variables.platform,
//           },
//           platform: execution.variables.platform,
//           senderId: execution.variables.sender,
//           status: execution.status,
//           startedAt: execution.startTime,
//           completedAt: execution.endTime,
//           errorMessage: execution.error,
//           executedNodes: execution.executedNodes || [],
//           responses: execution.responses || [],
//         },
//       })
//     } catch (error) {
//       console.error("Failed to save execution:", error)
//     }
//   }

//   getExecution(id: string): WorkflowExecution | undefined {
//     return this.executions.get(id)
//   }

//   getAllExecutions(): WorkflowExecution[] {
//     return Array.from(this.executions.values())
//   }

//   clearExecutions(): void {
//     this.executions.clear()
//   }

//   validateWorkflow(nodes: WorkflowNode[]): { isValid: boolean; errors: string[] } {
//     const errors: string[] = []

//     // Check for trigger nodes
//     const triggers = nodes.filter((node) => node.type === "trigger")
//     if (triggers.length === 0) {
//       errors.push("Workflow must have at least one trigger node")
//     }

//     // Check for disconnected nodes
//     const connectedNodes = new Set<string>()
//     const startNodes = triggers.map((t) => t.id)

//     const traverse = (nodeId: string) => {
//       if (connectedNodes.has(nodeId)) return
//       connectedNodes.add(nodeId)

//       const node = nodes.find((n) => n.id === nodeId)
//       if (node) {
//         node.connections.forEach((connId) => traverse(connId))
//       }
//     }

//     startNodes.forEach(traverse)

//     const disconnectedNodes = nodes.filter((node) => !connectedNodes.has(node.id))
//     if (disconnectedNodes.length > 0) {
//       errors.push(`${disconnectedNodes.length} nodes are not connected to the workflow`)
//     }

//     // Validate individual nodes
//     nodes.forEach((node) => {
//       switch (node.type) {
//         case "text":
//           if (!node.data.message?.trim()) {
//             errors.push(`Text node "${node.data.title || node.id}" has no message content`)
//           }
//           break
//         case "condition":
//           if (!node.data.condition || !node.data.value?.trim()) {
//             errors.push(`Condition node "${node.data.title || node.id}" is missing condition or value`)
//           }
//           break
//         case "image":
//           if (!node.data.imageUrl?.trim()) {
//             errors.push(`Image node "${node.data.title || node.id}" has no image URL`)
//           }
//           break
//         case "api":
//           if (!node.data.endpoint?.trim()) {
//             errors.push(`API node "${node.data.title || node.id}" has no endpoint configured`)
//           }
//           break
//         case "webhook":
//           if (!node.data.url?.trim()) {
//             errors.push(`Webhook node "${node.data.title || node.id}" has no URL configured`)
//           }
//           break
//       }
//     })

//     return {
//       isValid: errors.length === 0,
//       errors,
//     }
//   }
// }

// // Singleton instance
// export const workflowEngine = new WorkflowEngine()

// import type { WorkflowNode, WorkflowConnection } from "./workflow-store"
// import { createWorkflowExecution, updateWorkflowExecution } from "@/actions/workflows/execution-actions"
// import { recordWorkflowAnalytics } from "@/actions/workflows/analytics-actions"

// export interface WorkflowContext {
//   variables: Record<string, any>
//   triggerData: any
//   userId: string
//   workflowId: string
//   executionId: string
//   platform: string
//   senderId: string
//   senderUsername?: string
// }

// export interface NodeExecutionResult {
//   success: boolean
//   output?: any
//   nextNodeId?: string
//   error?: string
//   shouldStop?: boolean
//   responses?: any[]
// }

// export class WorkflowEngine {
//   private nodes: WorkflowNode[]
//   private connections: WorkflowConnection[]
//   private context: WorkflowContext

//   constructor(nodes: WorkflowNode[], connections: WorkflowConnection[], context: WorkflowContext) {
//     this.nodes = nodes
//     this.connections = connections
//     this.context = context
//   }

//   // Execute the entire workflow
//   async execute(): Promise<{ success: boolean; responses: any[]; error?: string; variables?: Record<string, any> }> {
//     const startTime = Date.now()
//     const responses: any[] = []
//     const executedNodes: any[] = []

//     try {
//       // Find the trigger node (start of workflow)
//       const triggerNode = this.nodes.find((node) => node.type === "trigger")
//       if (!triggerNode) {
//         throw new Error("No trigger node found in workflow")
//       }

//       let currentNodeId: string = triggerNode.id
//       let iterationCount = 0
//       const maxIterations = 100 // Prevent infinite loops

//       while (currentNodeId && iterationCount < maxIterations) {
//         const currentNode = this.nodes.find((node) => node.id === currentNodeId)
//         if (!currentNode) {
//           throw new Error(`Node not found: ${currentNodeId}`)
//         }

//         console.log(`[v0] Executing node: ${currentNode.type} (${currentNode.id})`)

//         // Update execution progress
//         await updateWorkflowExecution(this.context.executionId, {
//           currentNode: currentNodeId,
//           executedNodes: [
//             ...executedNodes,
//             {
//               nodeId: currentNodeId,
//               nodeType: currentNode.type,
//               timestamp: new Date(),
//               data: currentNode.data,
//             },
//           ],
//         })

//         // Execute the current node
//         const result = await this.executeNode(currentNode)

//         if (!result.success) {
//           throw new Error(result.error || `Node execution failed: ${currentNode.type}`)
//         }

//         // Collect responses
//         if (result.responses) {
//           responses.push(...result.responses)
//         }

//         // Update context variables with node output
//         if (result.output) {
//           this.context.variables = { ...this.context.variables, ...result.output }
//         }

//         // Check if workflow should stop
//         if (result.shouldStop) {
//           break
//         }

//         // Find next node
//         const nextNodeId = result.nextNodeId || this.getNextNodeId(currentNodeId)
//         if (!nextNodeId) {
//           console.log(`[v0] No next node found, ending workflow`)
//           break
//         }
//         currentNodeId = nextNodeId
//         iterationCount++

//         executedNodes.push({
//           nodeId: currentNode.id,
//           nodeType: currentNode.type,
//           timestamp: new Date(),
//           success: true,
//           output: result.output,
//         })
//       }

//       // Mark execution as completed
//       await updateWorkflowExecution(this.context.executionId, {
//         status: "completed",
//         executedNodes,
//         responses: responses.length > 0 ? responses : undefined,
//       })

//       // Record analytics
//       const duration = (Date.now() - startTime) / 1000
//       await recordWorkflowAnalytics(this.context.userId, this.context.workflowId, {
//         executions: 1,
//         completions: 1,
//         avgDuration: duration,
//         responses: responses.length,
//       })

//       console.log(`[v0] Workflow execution completed successfully`)
//       return { success: true, responses, variables: this.context.variables }
//     } catch (error) {
//       console.error(`[v0] Workflow execution failed:`, error)

//       // Mark execution as failed
//       await updateWorkflowExecution(this.context.executionId, {
//         status: "failed",
//         errorMessage: error instanceof Error ? error.message : String(error),
//         executedNodes,
//       })

//       // Record failure analytics
//       await recordWorkflowAnalytics(this.context.userId, this.context.workflowId, {
//         executions: 1,
//         failures: 1,
//       })

//       return {
//         success: false,
//         responses: [],
//         error: error instanceof Error ? error.message : String(error),
//         variables: this.context.variables,
//       }
//     }
//   }

//   // Execute a single node
//   private async executeNode(node: WorkflowNode): Promise<NodeExecutionResult> {
//     console.log(`[v0] Executing ${node.type} node with data:`, node.data)

//     switch (node.type) {
//       case "trigger":
//         return this.executeTriggerNode(node)

//       case "text":
//         return this.executeTextNode(node)

//       case "button":
//         return this.executeButtonNode(node)

//       case "image":
//         return this.executeImageNode(node)

//       case "condition":
//         return this.executeConditionNode(node)

//       case "delay":
//         return this.executeDelayNode(node)

//       case "api":
//         return this.executeApiNode(node)

//       case "webhook":
//         return this.executeWebhookNode(node)

//       default:
//         return {
//           success: false,
//           error: `Unknown node type: ${node.type}`,
//         }
//     }
//   }

//   // Node execution implementations
//   private async executeTriggerNode(node: WorkflowNode): Promise<NodeExecutionResult> {
//     // Trigger node just passes through - it's the entry point
//     return {
//       success: true,
//       output: {
//         triggerMessage: this.context.triggerData.message || "",
//         senderId: this.context.senderId,
//         platform: this.context.platform,
//       },
//     }
//   }

//   private async executeTextNode(node: WorkflowNode): Promise<NodeExecutionResult> {
//     const message = this.replaceVariables(node.data.message || "")

//     return {
//       success: true,
//       responses: [
//         {
//           type: "text",
//           text: message,
//         },
//       ],
//       output: { lastMessage: message },
//     }
//   }

//   private async executeButtonNode(node: WorkflowNode): Promise<NodeExecutionResult> {
//     const message = this.replaceVariables(node.data.message || "")
//     const buttons = (node.data.buttons || []).map((btn: any) => ({
//       title: this.replaceVariables(btn.title || ""),
//       payload: btn.payload || btn.title || "",
//       url: btn.url,
//     }))

//     return {
//       success: true,
//       responses: [
//         {
//           type: "buttons",
//           text: message,
//           buttons,
//         },
//       ],
//       output: { lastMessage: message, buttonCount: buttons.length },
//     }
//   }

//   private async executeImageNode(node: WorkflowNode): Promise<NodeExecutionResult> {
//     const caption = this.replaceVariables(node.data.caption || "")
//     const imageUrl = node.data.imageUrl || ""

//     return {
//       success: true,
//       responses: [
//         {
//           type: "image",
//           attachment: {
//             type: "image",
//             url: imageUrl,
//             caption,
//           },
//         },
//       ],
//       output: { lastImageUrl: imageUrl },
//     }
//   }

//   private async executeConditionNode(node: WorkflowNode): Promise<NodeExecutionResult> {
//     const condition = node.data.condition || ""
//     const variable = node.data.variable || ""
//     const value = node.data.value || ""

//     // Get the actual variable value
//     const actualValue = this.context.variables[variable] || ""

//     let conditionMet = false

//     switch (condition) {
//       case "equals":
//         conditionMet = actualValue === value
//         break
//       case "contains":
//         conditionMet = String(actualValue).toLowerCase().includes(String(value).toLowerCase())
//         break
//       case "starts_with":
//         conditionMet = String(actualValue).toLowerCase().startsWith(String(value).toLowerCase())
//         break
//       case "ends_with":
//         conditionMet = String(actualValue).toLowerCase().endsWith(String(value).toLowerCase())
//         break
//       case "greater_than":
//         conditionMet = Number(actualValue) > Number(value)
//         break
//       case "less_than":
//         conditionMet = Number(actualValue) < Number(value)
//         break
//       default:
//         conditionMet = false
//     }

//     // Find the appropriate next node based on condition result
//     const trueConnection = this.connections.find((conn) => conn.source === node.id && conn.sourceHandle === "true")
//     const falseConnection = this.connections.find((conn) => conn.source === node.id && conn.sourceHandle === "false")

//     const nextNodeId = conditionMet ? trueConnection?.target : falseConnection?.target

//     return {
//       success: true,
//       nextNodeId,
//       output: {
//         conditionResult: conditionMet,
//         checkedVariable: variable,
//         checkedValue: actualValue,
//       },
//     }
//   }

//   private async executeDelayNode(node: WorkflowNode): Promise<NodeExecutionResult> {
//     const delayMs = (node.data.delay || 1) * 1000 // Convert seconds to milliseconds

//     console.log(`[v0] Delaying execution for ${delayMs}ms`)
//     await new Promise((resolve) => setTimeout(resolve, delayMs))

//     return {
//       success: true,
//       output: { delayExecuted: delayMs },
//     }
//   }

//   private async executeApiNode(node: WorkflowNode): Promise<NodeExecutionResult> {
//     try {
//       const url = this.replaceVariables(node.data.url || "")
//       const method = node.data.method || "GET"
//       const headers = node.data.headers || {}
//       const body = node.data.body ? this.replaceVariables(JSON.stringify(node.data.body)) : undefined

//       console.log(`[v0] Making API call: ${method} ${url}`)

//       const response = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           ...headers,
//         },
//         ...(body && { body }),
//       })

//       const responseData = await response.json()

//       return {
//         success: true,
//         output: {
//           apiResponse: responseData,
//           apiStatus: response.status,
//           apiUrl: url,
//         },
//       }
//     } catch (error) {
//       return {
//         success: false,
//         error: `API call failed: ${error instanceof Error ? error.message : String(error)}`,
//       }
//     }
//   }

//   private async executeWebhookNode(node: WorkflowNode): Promise<NodeExecutionResult> {
//     try {
//       const url = this.replaceVariables(node.data.url || "")
//       const payload = {
//         workflowId: this.context.workflowId,
//         executionId: this.context.executionId,
//         triggerData: this.context.triggerData,
//         variables: this.context.variables,
//         timestamp: new Date().toISOString(),
//       }

//       console.log(`[v0] Sending webhook to: ${url}`)

//       const response = await fetch(url, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       })

//       return {
//         success: true,
//         output: {
//           webhookSent: true,
//           webhookUrl: url,
//           webhookStatus: response.status,
//         },
//       }
//     } catch (error) {
//       return {
//         success: false,
//         error: `Webhook failed: ${error instanceof Error ? error.message : String(error)}`,
//       }
//     }
//   }

//   // Helper methods
//   private getNextNodeId(currentNodeId: string): string | undefined {
//     const connection = this.connections.find((conn) => conn.source === currentNodeId)
//     return connection?.target
//   }

//   private replaceVariables(text: string): string {
//     let result = text

//     // Replace workflow variables
//     Object.entries(this.context.variables).forEach(([key, value]) => {
//       const regex = new RegExp(`{{${key}}}`, "g")
//       result = result.replace(regex, String(value))
//     })

//     // Replace system variables
//     result = result.replace(/{{sender_id}}/g, this.context.senderId)
//     result = result.replace(/{{platform}}/g, this.context.platform)
//     result = result.replace(/{{trigger_message}}/g, this.context.triggerData.message || "")

//     return result
//   }
// }

// // Factory function to create and execute workflows
// export async function executeWorkflow(
//   workflowId: string,
//   nodes: WorkflowNode[],
//   connections: WorkflowConnection[],
//   triggerData: any,
//   userId: string,
//   platform: string,
//   senderId: string,
//   senderUsername?: string,
// ): Promise<{ success: boolean; responses: any[]; error?: string }> {
//   // Create execution record
//   const executionResult = await createWorkflowExecution({
//     workflowId,
//     triggerData,
//     platform,
//     senderId,
//     senderUsername,
//   })

//   if (!executionResult.success) {
//     return { success: false, responses: [], error: "Failed to create execution record" }
//   }

//   // Create workflow context
//   const context: WorkflowContext = {
//     variables: {},
//     triggerData,
//     userId,
//     workflowId,
//     executionId: executionResult.execution!.id,
//     platform,
//     senderId,
//     senderUsername,
//   }

//   // Create and execute workflow
//   const engine = new WorkflowEngine(nodes, connections, context)
//   return await engine.execute()
// }

import type { WorkflowNode, WorkflowConnection } from "./workflow-store"
import { createWorkflowExecution, updateWorkflowExecution } from "@/actions/workflows/execution-actions"
import { recordWorkflowAnalytics } from "@/actions/workflows/analytics-actions"

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
    const trueConnection = this.connections.find((conn) => 
      conn.fromNodeId === node.id && conn.fromHandle === "true"
    )
    const falseConnection = this.connections.find((conn) => 
      conn.fromNodeId === node.id && conn.fromHandle === "false"
    )

    const nextNodeId = conditionMet 
      ? trueConnection?.toNodeId 
      : falseConnection?.toNodeId

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