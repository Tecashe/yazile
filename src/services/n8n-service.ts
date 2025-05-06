import { client } from "@/lib/prisma"
import type { N8nConnection, N8nWorkflowConfig, WorkflowType } from "@prisma/client"

interface CreateConnectionParams {
  userId: string
  name: string
  n8nUrl: string
  apiKey: string
}

interface CreateWorkflowParams {
  connectionId: string
  name: string
  description?: string
  workflowId: string
  workflowType: WorkflowType
  triggerUrl: string
  webhookUrl?: string
  configuration?: any
}

interface ExecuteWorkflowParams {
  workflowId: string
  data: any
}

/**
 * Service for managing n8n connections and workflows
 */
export class N8nService {
  /**
   * Create a new n8n connection
   */
  async createConnection(params: CreateConnectionParams): Promise<N8nConnection> {
    const { userId, name, n8nUrl, apiKey } = params

    // Validate the connection by testing the API
    const isValid = await this.testConnection(n8nUrl, apiKey)
    if (!isValid) {
      throw new Error("Could not connect to n8n instance with the provided credentials")
    }

    // Create the connection in the database
    const connection = await client.n8nConnection.create({
      data: {
        userId,
        name,
        n8nUrl,
        apiKey,
        lastConnected: new Date(),
      },
    })

    return connection
  }

  /**
   * Test an n8n connection
   */
  async testConnection(n8nUrl: string, apiKey: string): Promise<boolean> {
    try {
      // Remove trailing slash if present
      const baseUrl = n8nUrl.endsWith("/") ? n8nUrl.slice(0, -1) : n8nUrl

      // Test the connection by fetching workflows
      const response = await fetch(`${baseUrl}/api/v1/workflows`, {
        headers: {
          "X-N8N-API-KEY": apiKey,
        },
      })

      return response.ok
    } catch (error) {
      console.error("Error testing n8n connection:", error)
      return false
    }
  }

  /**
   * Get all workflows from an n8n instance
   */
  async getWorkflows(connectionId: string): Promise<any[]> {
    const connection = await client.n8nConnection.findUnique({
      where: { id: connectionId },
    })

    if (!connection) {
      throw new Error("Connection not found")
    }

    try {
      const baseUrl = connection.n8nUrl.endsWith("/") ? connection.n8nUrl.slice(0, -1) : connection.n8nUrl
      const response = await fetch(`${baseUrl}/api/v1/workflows`, {
        headers: {
          "X-N8N-API-KEY": connection.apiKey,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch workflows: ${response.status}`)
      }

      const data = await response.json()
      return data.data || []
    } catch (error) {
      console.error("Error fetching n8n workflows:", error)
      throw error
    }
  }

  /**
   * Create a new workflow configuration
   */
  async createWorkflow(params: CreateWorkflowParams): Promise<N8nWorkflowConfig> {
    const { connectionId, name, description, workflowId, workflowType, triggerUrl, webhookUrl, configuration } = params

    // Create the workflow in the database
    const workflow = await client.n8nWorkflowConfig.create({
      data: {
        connectionId,
        name,
        description,
        workflowId,
        workflowType,
        triggerUrl,
        webhookUrl,
        configuration: configuration || undefined,
      },
    })

    return workflow
  }

  /**
   * Execute a workflow by sending data to its trigger URL
   */
  async executeWorkflow(params: ExecuteWorkflowParams): Promise<{ success: boolean; executionId?: string }> {
    const { workflowId, data } = params

    // Get the workflow configuration
    const workflow = await client.n8nWorkflowConfig.findFirst({
      where: { workflowId },
      include: { connection: true },
    })

    if (!workflow) {
      throw new Error("Workflow not found")
    }

    try {
      // Send data to the workflow's trigger URL
      const response = await fetch(workflow.triggerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        // Update failure count
        await client.n8nWorkflowConfig.update({
          where: { id: workflow.id },
          data: {
            lastExecuted: new Date(),
            executionCount: { increment: 1 },
            failureCount: { increment: 1 },
          },
        })

        throw new Error(`Failed to execute workflow: ${response.status}`)
      }

      // Parse the response
      const responseData = await response.json()

      // Update success count
      await client.n8nWorkflowConfig.update({
        where: { id: workflow.id },
        data: {
          lastExecuted: new Date(),
          executionCount: { increment: 1 },
          successCount: { increment: 1 },
        },
      })

      return {
        success: true,
        executionId: responseData.executionId,
      }
    } catch (error) {
      console.error("Error executing n8n workflow:", error)
      throw error
    }
  }

  /**
   * Get all connections for a user
   */
  async getConnections(userId: string): Promise<N8nConnection[]> {
    return client.n8nConnection.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })
  }

  /**
   * Get all workflows for a connection
   */
  async getWorkflowConfigs(connectionId: string): Promise<N8nWorkflowConfig[]> {
    return client.n8nWorkflowConfig.findMany({
      where: { connectionId },
      orderBy: { createdAt: "desc" },
    })
  }

  /**
   * Delete a connection and all its workflows
   */
  async deleteConnection(connectionId: string): Promise<boolean> {
    await client.n8nConnection.delete({
      where: { id: connectionId },
    })

    return true
  }

  /**
   * Delete a workflow configuration
   */
  async deleteWorkflow(workflowId: string): Promise<boolean> {
    await client.n8nWorkflowConfig.delete({
      where: { id: workflowId },
    })

    return true
  }
}

// Export a singleton instance
export const n8nService = new N8nService()
