// import { type WorkflowTemplate, type UserWorkflow, ExecutionStatus, WorkflowStatus } from "@prisma/client"
// import {client} from "@/lib/prisma"
// import type {
//   N8nWorkflowData,
//   N8nExecutionData,
//   WorkflowActivationResult,
//   WorkflowDeactivationResult,
//   N8nWorkflowTemplate,
// } from "@/types/n8n"

// // N8n API configuration
// const N8N_API_URL = process.env.N8N_API_URL || "http://localhost:5678/api/v1"
// const N8N_API_KEY = process.env.N8N_API_KEY

// if (!N8N_API_KEY) {
//   console.warn("N8N_API_KEY is not set. N8n service will not work properly.")
// }

// /**
//  * Core service for interacting with n8n API
//  */
// export class N8nService {
//   private headers: HeadersInit

//   constructor() {
//     this.headers = {
//       "X-N8N-API-KEY": N8N_API_KEY || "",
//       "Content-Type": "application/json",
//     }
//   }

//   /**
//    * Create a workflow in n8n based on a template and user configuration
//    */
//   async createWorkflow(userWorkflow: UserWorkflow, template: WorkflowTemplate): Promise<string> {
//     try {
//       // Get the template from n8n if it exists
//       let workflowData: N8nWorkflowData

//       if (template.n8nTemplateId) {
//         // Clone from existing template
//         const templateData = await this.getWorkflowTemplate(template.n8nTemplateId)
//         workflowData = this.applyUserConfiguration(templateData, userWorkflow.configuration)
//       } else {
//         // Create from scratch based on our template schema
//         workflowData = this.generateWorkflowFromTemplate(template, userWorkflow.configuration)
//       }

//       // Set the name from the user workflow
//       workflowData.name = userWorkflow.name

//       // Create the workflow in n8n
//       const response = await fetch(`${N8N_API_URL}/workflows`, {
//         method: "POST",
//         headers: this.headers,
//         body: JSON.stringify(workflowData),
//       })

//       if (!response.ok) {
//         throw new Error(`Failed to create workflow in n8n: ${response.statusText}`)
//       }

//       const result = await response.json()
//       return result.id
//     } catch (error) {
//       console.error("Error creating workflow in n8n:", error)
//       throw error
//     }
//   }

//   /**
//    * Get a workflow from n8n
//    */
//   async getWorkflow(n8nWorkflowId: string): Promise<N8nWorkflowData> {
//     try {
//       const response = await fetch(`${N8N_API_URL}/workflows/${n8nWorkflowId}`, {
//         headers: this.headers,
//       })

//       if (!response.ok) {
//         throw new Error(`Failed to get workflow from n8n: ${response.statusText}`)
//       }

//       return await response.json()
//     } catch (error) {
//       console.error("Error getting workflow from n8n:", error)
//       throw error
//     }
//   }

//   /**
//    * Update a workflow in n8n
//    */
//   async updateWorkflow(n8nWorkflowId: string, workflowData: Partial<N8nWorkflowData>): Promise<void> {
//     try {
//       // First get the current workflow
//       const currentWorkflow = await this.getWorkflow(n8nWorkflowId)

//       // Merge the updates
//       const updatedWorkflow = { ...currentWorkflow, ...workflowData }

//       const response = await fetch(`${N8N_API_URL}/workflows/${n8nWorkflowId}`, {
//         method: "PUT",
//         headers: this.headers,
//         body: JSON.stringify(updatedWorkflow),
//       })

//       if (!response.ok) {
//         throw new Error(`Failed to update workflow in n8n: ${response.statusText}`)
//       }
//     } catch (error) {
//       console.error("Error updating workflow in n8n:", error)
//       throw error
//     }
//   }

//   /**
//    * Delete a workflow from n8n
//    */
//   async deleteWorkflow(n8nWorkflowId: string): Promise<void> {
//     try {
//       const response = await fetch(`${N8N_API_URL}/workflows/${n8nWorkflowId}`, {
//         method: "DELETE",
//         headers: this.headers,
//       })

//       if (!response.ok) {
//         throw new Error(`Failed to delete workflow from n8n: ${response.statusText}`)
//       }
//     } catch (error) {
//       console.error("Error deleting workflow from n8n:", error)
//       throw error
//     }
//   }

//   /**
//    * Activate a workflow in n8n
//    */
//   async activateWorkflow(userWorkflowId: string): Promise<WorkflowActivationResult> {
//     try {
//       // Get the user workflow
//       const userWorkflow = await client.userWorkflow.findUnique({
//         where: { id: userWorkflowId },
//         include: { credentials: true },
//       })

//       if (!userWorkflow) {
//         throw new Error(`User workflow not found: ${userWorkflowId}`)
//       }

//       if (!userWorkflow.n8nWorkflowId) {
//         throw new Error(`Workflow has not been created in n8n yet: ${userWorkflowId}`)
//       }

//       // Check if all required credentials are set
//       const missingCredentials = await this.checkRequiredCredentials(userWorkflow)
//       if (missingCredentials.length > 0) {
//         return {
//           success: false,
//           message: `Missing required credentials: ${missingCredentials.join(", ")}`,
//           webhookUrl: null,
//         }
//       }

//       // Activate the workflow in n8n
//       const response = await fetch(`${N8N_API_URL}/workflows/${userWorkflow.n8nWorkflowId}/activate`, {
//         method: "POST",
//         headers: this.headers,
//       })

//       if (!response.ok) {
//         throw new Error(`Failed to activate workflow in n8n: ${response.statusText}`)
//       }

//       const result = await response.json()

//       // Update the user workflow status
//       await db.userWorkflow.update({
//         where: { id: userWorkflowId },
//         data: {
//           status: WorkflowStatus.ACTIVE,
//           isActive: true,
//           lastActivated: new Date(),
//           webhookUrl: result.webhookUrl || null,
//         },
//       })

//       return {
//         success: true,
//         message: "Workflow activated successfully",
//         webhookUrl: result.webhookUrl || null,
//       }
//     } catch (error) {
//       console.error("Error activating workflow:", error)

//       // Update the workflow status to ERROR
//       await db.userWorkflow.update({
//         where: { id: userWorkflowId },
//         data: {
//           status: WorkflowStatus.ERROR,
//           isActive: false,
//         },
//       })

//       return {
//         success: false,
//         message: `Error activating workflow: ${error instanceof Error ? error.message : String(error)}`,
//         webhookUrl: null,
//       }
//     }
//   }

//   /**
//    * Deactivate a workflow in n8n
//    */
//   async deactivateWorkflow(userWorkflowId: string): Promise<WorkflowDeactivationResult> {
//     try {
//       // Get the user workflow
//       const userWorkflow = await db.userWorkflow.findUnique({
//         where: { id: userWorkflowId },
//       })

//       if (!userWorkflow) {
//         throw new Error(`User workflow not found: ${userWorkflowId}`)
//       }

//       if (!userWorkflow.n8nWorkflowId) {
//         throw new Error(`Workflow has not been created in n8n yet: ${userWorkflowId}`)
//       }

//       // Deactivate the workflow in n8n
//       const response = await fetch(`${N8N_API_URL}/workflows/${userWorkflow.n8nWorkflowId}/deactivate`, {
//         method: "POST",
//         headers: this.headers,
//       })

//       if (!response.ok) {
//         throw new Error(`Failed to deactivate workflow in n8n: ${response.statusText}`)
//       }

//       // Update the user workflow status
//       await db.userWorkflow.update({
//         where: { id: userWorkflowId },
//         data: {
//           status: WorkflowStatus.INACTIVE,
//           isActive: false,
//           lastDeactivated: new Date(),
//         },
//       })

//       return {
//         success: true,
//         message: "Workflow deactivated successfully",
//       }
//     } catch (error) {
//       console.error("Error deactivating workflow:", error)

//       return {
//         success: false,
//         message: `Error deactivating workflow: ${error instanceof Error ? error.message : String(error)}`,
//       }
//     }
//   }

//   /**
//    * Execute a workflow in n8n
//    */
//   async executeWorkflow(userWorkflowId: string, inputData: Record<string, any>): Promise<string> {
//     try {
//       // Get the user workflow
//       const userWorkflow = await db.userWorkflow.findUnique({
//         where: { id: userWorkflowId },
//       })

//       if (!userWorkflow) {
//         throw new Error(`User workflow not found: ${userWorkflowId}`)
//       }

//       if (!userWorkflow.n8nWorkflowId) {
//         throw new Error(`Workflow has not been created in n8n yet: ${userWorkflowId}`)
//       }

//       // Create an execution record
//       const execution = await db.workflowExecution.create({
//         data: {
//           workflowId: userWorkflowId,
//           status: ExecutionStatus.PENDING,
//           inputData: inputData,
//         },
//       })

//       // Execute the workflow in n8n
//       const response = await fetch(`${N8N_API_URL}/workflows/${userWorkflow.n8nWorkflowId}/execute`, {
//         method: "POST",
//         headers: this.headers,
//         body: JSON.stringify({ data: inputData }),
//       })

//       if (!response.ok) {
//         // Update execution status to FAILED
//         await db.workflowExecution.update({
//           where: { id: execution.id },
//           data: {
//             status: ExecutionStatus.FAILED,
//             completedAt: new Date(),
//             success: false,
//             errorMessage: `Failed to execute workflow in n8n: ${response.statusText}`,
//           },
//         })

//         throw new Error(`Failed to execute workflow in n8n: ${response.statusText}`)
//       }

//       const result = await response.json()

//       // Update the execution with the n8n execution ID
//       await db.workflowExecution.update({
//         where: { id: execution.id },
//         data: {
//           n8nExecutionId: result.executionId,
//           status: ExecutionStatus.RUNNING,
//         },
//       })

//       return execution.id
//     } catch (error) {
//       console.error("Error executing workflow:", error)
//       throw error
//     }
//   }

//   /**
//    * Get execution details from n8n
//    */
//   async getExecutionDetails(n8nExecutionId: string): Promise<N8nExecutionData> {
//     try {
//       const response = await fetch(`${N8N_API_URL}/executions/${n8nExecutionId}`, {
//         headers: this.headers,
//       })

//       if (!response.ok) {
//         throw new Error(`Failed to get execution details from n8n: ${response.statusText}`)
//       }

//       return await response.json()
//     } catch (error) {
//       console.error("Error getting execution details from n8n:", error)
//       throw error
//     }
//   }

//   /**
//    * Process execution completion
//    */
//   async processExecutionCompletion(executionId: string, n8nExecutionData: N8nExecutionData): Promise<void> {
//     try {
//       const execution = await db.workflowExecution.findUnique({
//         where: { id: executionId },
//       })

//       if (!execution) {
//         throw new Error(`Execution not found: ${executionId}`)
//       }

//       // Calculate duration
//       const startTime = execution.startedAt
//       const endTime = new Date()
//       const duration = endTime.getTime() - startTime.getTime()

//       // Extract sanitized output data
//       const outputData = this.sanitizeExecutionData(n8nExecutionData.data?.resultData)

//       // Extract resource usage if available
//       const resourceUsage = n8nExecutionData.data?.executionMetadata?.resourceUsage || null

//       // Determine success status
//       const success = n8nExecutionData.status === "success"

//       // Update the execution record
//       await db.workflowExecution.update({
//         where: { id: executionId },
//         data: {
//           status: success ? ExecutionStatus.COMPLETED : ExecutionStatus.FAILED,
//           completedAt: endTime,
//           duration,
//           success,
//           errorMessage: success ? null : n8nExecutionData.data?.resultData?.error?.message,
//           outputData,
//           resourceUsage,
//         },
//       })

//       // Create execution events for each node execution
//       if (n8nExecutionData.data?.executionData?.nodeExecutionStack) {
//         for (const nodeExecution of n8nExecutionData.data.executionData.nodeExecutionStack) {
//           await db.executionEvent.create({
//             data: {
//               executionId,
//               eventType: "node_execution",
//               nodeId: nodeExecution.node?.id,
//               nodeName: nodeExecution.node?.name,
//               message: `Node ${nodeExecution.node?.name} executed`,
//               data: nodeExecution,
//             },
//           })
//         }
//       }

//       // Create notification for the workflow owner
//       const workflow = await db.userWorkflow.findUnique({
//         where: { id: execution.workflowId },
//         select: { userId: true },
//       })

//       if (workflow) {
//         await db.workflowNotification.create({
//           data: {
//             userId: workflow.userId,
//             workflowId: execution.workflowId,
//             executionId: executionId,
//             type: success ? "EXECUTION_COMPLETED" : "EXECUTION_FAILED",
//             title: success ? "Workflow execution completed" : "Workflow execution failed",
//             message: success
//               ? `Your workflow executed successfully in ${Math.round(duration / 1000)} seconds.`
//               : `Your workflow execution failed: ${n8nExecutionData.data?.resultData?.error?.message || "Unknown error"}`,
//           },
//         })
//       }

//       // Update analytics
//       await this.updateAnalytics(execution.workflowId, success, duration)
//     } catch (error) {
//       console.error("Error processing execution completion:", error)
//       throw error
//     }
//   }

//   /**
//    * Get workflow templates from n8n
//    */
//   async getWorkflowTemplates(): Promise<N8nWorkflowTemplate[]> {
//     try {
//       const response = await fetch(`${N8N_API_URL}/workflows/templates`, {
//         headers: this.headers,
//       })

//       if (!response.ok) {
//         throw new Error(`Failed to get workflow templates from n8n: ${response.statusText}`)
//       }

//       return await response.json()
//     } catch (error) {
//       console.error("Error getting workflow templates from n8n:", error)
//       throw error
//     }
//   }

//   /**
//    * Get a specific workflow template from n8n
//    */
//   async getWorkflowTemplate(templateId: string): Promise<N8nWorkflowData> {
//     try {
//       const response = await fetch(`${N8N_API_URL}/workflows/templates/${templateId}`, {
//         headers: this.headers,
//       })

//       if (!response.ok) {
//         throw new Error(`Failed to get workflow template from n8n: ${response.statusText}`)
//       }

//       return await response.json()
//     } catch (error) {
//       console.error("Error getting workflow template from n8n:", error)
//       throw error
//     }
//   }

//   /**
//    * Apply user configuration to a workflow template
//    */
//   private applyUserConfiguration(templateData: N8nWorkflowData, configuration: Record<string, any>): N8nWorkflowData {
//     // Deep clone the template
//     const workflowData = JSON.parse(JSON.stringify(templateData))

//     // Apply configuration to nodes
//     if (workflowData.nodes && configuration) {
//       for (const node of workflowData.nodes) {
//         // Check if there's configuration for this node
//         if (configuration[node.name]) {
//           // Apply node-specific configuration
//           node.parameters = {
//             ...node.parameters,
//             ...configuration[node.name],
//           }
//         }
//       }
//     }

//     return workflowData
//   }

//   /**
//    * Generate a workflow from a template schema
//    */
//   private generateWorkflowFromTemplate(
//     template: WorkflowTemplate,
//     configuration: Record<string, any>,
//   ): N8nWorkflowData {
//     // This would be a complex function to generate n8n workflow JSON from our template schema
//     // For now, we'll return a basic structure that would need to be expanded based on the template
//     return {
//       name: template.name,
//       nodes: [],
//       connections: {},
//       active: false,
//       settings: {
//         saveManualExecutions: true,
//         callerPolicy: "workflowsFromSameOwner",
//       },
//     }
//   }

//   /**
//    * Check if all required credentials are set for a workflow
//    */
//   private async checkRequiredCredentials(userWorkflow: UserWorkflow & { credentials: any[] }): Promise<string[]> {
//     // This would check the workflow nodes against the provided credentials
//     // For now, we'll return an empty array indicating no missing credentials
//     return []
//   }

//   /**
//    * Sanitize execution data to remove sensitive information
//    */
//   private sanitizeExecutionData(data: any): any {
//     if (!data) return null

//     // Deep clone the data
//     const sanitized = JSON.parse(JSON.stringify(data))

//     // Remove sensitive fields (this would be expanded based on your needs)
//     const sensitiveFields = ["password", "token", "secret", "key", "apiKey", "api_key"]

//     const sanitizeObject = (obj: any) => {
//       if (!obj || typeof obj !== "object") return

//       for (const key in obj) {
//         if (sensitiveFields.some((field) => key.toLowerCase().includes(field))) {
//           obj[key] = "[REDACTED]"
//         } else if (typeof obj[key] === "object") {
//           sanitizeObject(obj[key])
//         }
//       }
//     }

//     sanitizeObject(sanitized)
//     return sanitized
//   }

//   /**
//    * Update analytics for a workflow
//    */
//   private async updateAnalytics(workflowId: string, success: boolean, duration: number): Promise<void> {
//     try {
//       const workflow = await db.userWorkflow.findUnique({
//         where: { id: workflowId },
//         select: { userId: true },
//       })

//       if (!workflow) return

//       const today = new Date()
//       today.setHours(0, 0, 0, 0)

//       // Find or create analytics record for today
//       const analytics = await db.workflowAnalytics.findUnique({
//         where: {
//           userId_date: {
//             userId: workflow.userId,
//             date: today,
//           },
//         },
//       })

//       if (analytics) {
//         // Update existing record
//         await db.workflowAnalytics.update({
//           where: {
//             userId_date: {
//               userId: workflow.userId,
//               date: today,
//             },
//           },
//           data: {
//             totalExecutions: { increment: 1 },
//             successfulExecutions: success ? { increment: 1 } : undefined,
//             failedExecutions: !success ? { increment: 1 } : undefined,
//             averageDuration: {
//               set:
//                 ((analytics.averageDuration || 0) * analytics.totalExecutions) / (analytics.totalExecutions + 1) +
//                 duration / (analytics.totalExecutions + 1),
//             },
//           },
//         })
//       } else {
//         // Create new record
//         await db.workflowAnalytics.create({
//           data: {
//             userId: workflow.userId,
//             date: today,
//             totalExecutions: 1,
//             successfulExecutions: success ? 1 : 0,
//             failedExecutions: !success ? 1 : 0,
//             averageDuration: duration,
//           },
//         })
//       }
//     } catch (error) {
//       console.error("Error updating analytics:", error)
//       // Don't throw here to avoid failing the main operation
//     }
//   }
// }

// // Export singleton instance
// export const n8nService = new N8nService()

import { type WorkflowTemplate, type UserWorkflow, ExecutionStatus, WorkflowStatus } from "@prisma/client"
import { client } from "@/lib/prisma"
import { Prisma } from '@prisma/client';

import type {
  N8nWorkflowData,
  N8nExecutionData,
  WorkflowActivationResult,
  WorkflowDeactivationResult,
  N8nWorkflowTemplate,
} from "@/types/n8n"

// N8n API configuration
const N8N_API_URL = process.env.N8N_API_URL || "http://localhost:5678/api/v1"
const N8N_API_KEY = process.env.N8N_API_KEY

if (!N8N_API_KEY) {
  console.warn("N8N_API_KEY is not set. N8n service will not work properly.")
}

/**
 * Core service for interacting with n8n API
 */
export class N8nService {
  private headers: HeadersInit

  constructor() {
    this.headers = {
      "X-N8N-API-KEY": N8N_API_KEY || "",
      "Content-Type": "application/json",
    }
  }

  /**
   * Create a workflow in n8n based on a template and user configuration
   */
  async createWorkflow(userWorkflow: UserWorkflow, template: WorkflowTemplate): Promise<string> {
    try {
      // Get the template from n8n if it exists
      let workflowData: N8nWorkflowData

      if (template.n8nTemplateId) {
        // Clone from existing template
        const templateData = await this.getWorkflowTemplate(template.n8nTemplateId)
        const config = (userWorkflow.configuration as Record<string, any>) || {}
        workflowData = this.applyUserConfiguration(templateData, config)
      } else {
        // Create from scratch based on our template schema
        const config = (userWorkflow.configuration as Record<string, any>) || {}
        workflowData = this.generateWorkflowFromTemplate(template, config)
      }

      // Set the name from the user workflow
      workflowData.name = userWorkflow.name

      // Create the workflow in n8n
      const response = await fetch(`${N8N_API_URL}/workflows`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(workflowData),
      })

      if (!response.ok) {
        throw new Error(`Failed to create workflow in n8n: ${response.statusText}`)
      }

      const result = await response.json()
      return result.id
    } catch (error) {
      console.error("Error creating workflow in n8n:", error)
      throw error
    }
  }

  /**
   * Get a workflow from n8n
   */
  async getWorkflow(n8nWorkflowId: string): Promise<N8nWorkflowData> {
    try {
      const response = await fetch(`${N8N_API_URL}/workflows/${n8nWorkflowId}`, {
        headers: this.headers,
      })

      if (!response.ok) {
        throw new Error(`Failed to get workflow from n8n: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error getting workflow from n8n:", error)
      throw error
    }
  }

  /**
   * Update a workflow in n8n
   */
  async updateWorkflow(n8nWorkflowId: string, workflowData: Partial<N8nWorkflowData>): Promise<void> {
    try {
      // First get the current workflow
      const currentWorkflow = await this.getWorkflow(n8nWorkflowId)

      // Merge the updates
      const updatedWorkflow = { ...currentWorkflow, ...workflowData }

      const response = await fetch(`${N8N_API_URL}/workflows/${n8nWorkflowId}`, {
        method: "PUT",
        headers: this.headers,
        body: JSON.stringify(updatedWorkflow),
      })

      if (!response.ok) {
        throw new Error(`Failed to update workflow in n8n: ${response.statusText}`)
      }
    } catch (error) {
      console.error("Error updating workflow in n8n:", error)
      throw error
    }
  }

  /**
   * Delete a workflow from n8n
   */
  async deleteWorkflow(n8nWorkflowId: string): Promise<void> {
    try {
      const response = await fetch(`${N8N_API_URL}/workflows/${n8nWorkflowId}`, {
        method: "DELETE",
        headers: this.headers,
      })

      if (!response.ok) {
        throw new Error(`Failed to delete workflow from n8n: ${response.statusText}`)
      }
    } catch (error) {
      console.error("Error deleting workflow from n8n:", error)
      throw error
    }
  }

  /**
   * Activate a workflow in n8n
   */
  async activateWorkflow(userWorkflowId: string): Promise<WorkflowActivationResult> {
    try {
      // Get the user workflow
      const userWorkflow = await client.userWorkflow.findUnique({
        where: { id: userWorkflowId },
        include: { credentials: true },
      })

      if (!userWorkflow) {
        throw new Error(`User workflow not found: ${userWorkflowId}`)
      }

      if (!userWorkflow.n8nWorkflowId) {
        throw new Error(`Workflow has not been created in n8n yet: ${userWorkflowId}`)
      }

      // Check if all required credentials are set
      const missingCredentials = await this.checkRequiredCredentials(userWorkflow)
      if (missingCredentials.length > 0) {
        return {
          success: false,
          message: `Missing required credentials: ${missingCredentials.join(", ")}`,
          webhookUrl: null,
        }
      }

      // Activate the workflow in n8n
      const response = await fetch(`${N8N_API_URL}/workflows/${userWorkflow.n8nWorkflowId}/activate`, {
        method: "POST",
        headers: this.headers,
      })

      if (!response.ok) {
        throw new Error(`Failed to activate workflow in n8n: ${response.statusText}`)
      }

      const result = await response.json()

      // Update the user workflow status
      await client.userWorkflow.update({
        where: { id: userWorkflowId },
        data: {
          status: WorkflowStatus.ACTIVE,
          isActive: true,
          lastActivated: new Date(),
          webhookUrl: result.webhookUrl || null,
        },
      })

      return {
        success: true,
        message: "Workflow activated successfully",
        webhookUrl: result.webhookUrl || null,
      }
    } catch (error) {
      console.error("Error activating workflow:", error)

      // Update the workflow status to ERROR
      await client.userWorkflow.update({
        where: { id: userWorkflowId },
        data: {
          status: WorkflowStatus.ERROR,
          isActive: false,
        },
      })

      return {
        success: false,
        message: `Error activating workflow: ${error instanceof Error ? error.message : String(error)}`,
        webhookUrl: null,
      }
    }
  }

  /**
   * Deactivate a workflow in n8n
   */
  async deactivateWorkflow(userWorkflowId: string): Promise<WorkflowDeactivationResult> {
    try {
      // Get the user workflow
      const userWorkflow = await client.userWorkflow.findUnique({
        where: { id: userWorkflowId },
      })

      if (!userWorkflow) {
        throw new Error(`User workflow not found: ${userWorkflowId}`)
      }

      if (!userWorkflow.n8nWorkflowId) {
        throw new Error(`Workflow has not been created in n8n yet: ${userWorkflowId}`)
      }

      // Deactivate the workflow in n8n
      const response = await fetch(`${N8N_API_URL}/workflows/${userWorkflow.n8nWorkflowId}/deactivate`, {
        method: "POST",
        headers: this.headers,
      })

      if (!response.ok) {
        throw new Error(`Failed to deactivate workflow in n8n: ${response.statusText}`)
      }

      // Update the user workflow status
      await client.userWorkflow.update({
        where: { id: userWorkflowId },
        data: {
          status: WorkflowStatus.INACTIVE,
          isActive: false,
          lastDeactivated: new Date(),
        },
      })

      return {
        success: true,
        message: "Workflow deactivated successfully",
      }
    } catch (error) {
      console.error("Error deactivating workflow:", error)

      return {
        success: false,
        message: `Error deactivating workflow: ${error instanceof Error ? error.message : String(error)}`,
      }
    }
  }

  /**
   * Execute a workflow in n8n
   */
  async executeWorkflow(userWorkflowId: string, inputData: Record<string, any>): Promise<string> {
    try {
      // Get the user workflow
      const userWorkflow = await client.userWorkflow.findUnique({
        where: { id: userWorkflowId },
      })

      if (!userWorkflow) {
        throw new Error(`User workflow not found: ${userWorkflowId}`)
      }

      if (!userWorkflow.n8nWorkflowId) {
        throw new Error(`Workflow has not been created in n8n yet: ${userWorkflowId}`)
      }

      // Create an execution record
      const execution = await client.workflowExecution.create({
        data: {
          workflowId: userWorkflowId,
          status: ExecutionStatus.PENDING,
          inputData: inputData,
        },
      })

      // Execute the workflow in n8n
      const response = await fetch(`${N8N_API_URL}/workflows/${userWorkflow.n8nWorkflowId}/execute`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({ data: inputData }),
      })

      if (!response.ok) {
        // Update execution status to FAILED
        await client.workflowExecution.update({
          where: { id: execution.id },
          data: {
            status: ExecutionStatus.FAILED,
            completedAt: new Date(),
            success: false,
            errorMessage: `Failed to execute workflow in n8n: ${response.statusText}`,
          },
        })

        throw new Error(`Failed to execute workflow in n8n: ${response.statusText}`)
      }

      const result = await response.json()

      // Update the execution with the n8n execution ID
      await client.workflowExecution.update({
        where: { id: execution.id },
        data: {
          n8nExecutionId: result.executionId,
          status: ExecutionStatus.RUNNING,
        },
      })

      return execution.id
    } catch (error) {
      console.error("Error executing workflow:", error)
      throw error
    }
  }

  /**
   * Get execution details from n8n
   */
  async getExecutionDetails(n8nExecutionId: string): Promise<N8nExecutionData> {
    try {
      const response = await fetch(`${N8N_API_URL}/executions/${n8nExecutionId}`, {
        headers: this.headers,
      })

      if (!response.ok) {
        throw new Error(`Failed to get execution details from n8n: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error getting execution details from n8n:", error)
      throw error
    }
  }

  /**
   * Process execution completion
   */
  async processExecutionCompletion(executionId: string, n8nExecutionData: N8nExecutionData): Promise<void> {
    try {
      const execution = await client.workflowExecution.findUnique({
        where: { id: executionId },
      })

      if (!execution) {
        throw new Error(`Execution not found: ${executionId}`)
      }

      // Calculate duration
      const startTime = execution.startedAt
      const endTime = new Date()
      const duration = endTime.getTime() - startTime.getTime()

      // Extract sanitized output data
      const outputData = this.sanitizeExecutionData(n8nExecutionData.data?.resultData)

      // Extract resource usage if available
      const resourceUsage = n8nExecutionData.data?.executionMetadata?.resourceUsage || null

      // Determine success status
      const success = n8nExecutionData.status === "success"

      // Update the execution record
    //   await client.workflowExecution.update({
    //     where: { id: executionId },
    //     data: {
    //       status: success ? ExecutionStatus.COMPLETED : ExecutionStatus.FAILED,
    //       completedAt: endTime,
    //       duration,
    //       success,
    //       errorMessage: success ? null : n8nExecutionData.data?.resultData?.error?.message,
    //       outputData,
    //       resourceUsage,
    //     },
    //   })

    await client.workflowExecution.update({ 
        where: { id: executionId },
        data: {
          status: success ? ExecutionStatus.COMPLETED : ExecutionStatus.FAILED,
          completedAt: endTime,
          duration,
          success,
          errorMessage: success ? null : n8nExecutionData.data?.resultData?.error?.message,
          outputData,
          resourceUsage: resourceUsage ?? Prisma.JsonNull,
        },
      });
      

      // Create execution events for each node execution
    //   if (n8nExecutionData.data?.executionData?.nodeExecutionStack) {
    //     for (const nodeExecution of n8nExecutionData.data.executionData.nodeExecutionStack) {
    //       await client.executionEvent.create({
    //         data: {
    //           executionId,
    //           eventType: "node_execution",
    //           nodeId: nodeExecution.node?.id,
    //           nodeName: nodeExecution.node?.name,
    //           message: `Node ${nodeExecution.node?.name} executed`,
    //           data: nodeExecution,
    //         },
    //       })
    //     }
    //   }
    if (n8nExecutionData.data?.executionData?.nodeExecutionStack) {
        for (const nodeExecution of n8nExecutionData.data.executionData.nodeExecutionStack) {
          await client.executionEvent.create({
            data: {
              executionId,
              eventType: "node_execution",
              nodeId: nodeExecution.node?.id,
              nodeName: nodeExecution.node?.name,
              message: `Node ${nodeExecution.node?.name} executed`,
              data: JSON.parse(JSON.stringify(nodeExecution)), // ensure it's valid JSON
            },
          })
        }
      }
      

      // Create notification for the workflow owner
      const workflow = await client.userWorkflow.findUnique({
        where: { id: execution.workflowId },
        select: { userId: true },
      })

      if (workflow) {
        await client.workflowNotification.create({
          data: {
            userId: workflow.userId,
            workflowId: execution.workflowId,
            executionId: executionId,
            type: success ? "EXECUTION_COMPLETED" : "EXECUTION_FAILED",
            title: success ? "Workflow execution completed" : "Workflow execution failed",
            message: success
              ? `Your workflow executed successfully in ${Math.round(duration / 1000)} seconds.`
              : `Your workflow execution failed: ${n8nExecutionData.data?.resultData?.error?.message || "Unknown error"}`,
          },
        })
      }

      // Update analytics
      await this.updateAnalytics(execution.workflowId, success, duration)
    } catch (error) {
      console.error("Error processing execution completion:", error)
      throw error
    }
  }

  /**
   * Get workflow templates from n8n
   */
  async getWorkflowTemplates(): Promise<N8nWorkflowTemplate[]> {
    try {
      const response = await fetch(`${N8N_API_URL}/workflows/templates`, {
        headers: this.headers,
      })

      if (!response.ok) {
        throw new Error(`Failed to get workflow templates from n8n: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error getting workflow templates from n8n:", error)
      throw error
    }
  }

  /**
   * Get a specific workflow template from n8n
   */
  async getWorkflowTemplate(templateId: string): Promise<N8nWorkflowData> {
    try {
      const response = await fetch(`${N8N_API_URL}/workflows/templates/${templateId}`, {
        headers: this.headers,
      })

      if (!response.ok) {
        throw new Error(`Failed to get workflow template from n8n: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error getting workflow template from n8n:", error)
      throw error
    }
  }

  /**
   * Apply user configuration to a workflow template
   */

  private applyUserConfiguration(
    templateData: N8nWorkflowData,
    configuration: Record<string, any> | null,
  ): N8nWorkflowData {
    // Deep clone the template
    const workflowData = JSON.parse(JSON.stringify(templateData))

    // Apply configuration to nodes
    if (workflowData.nodes && configuration) {
      for (const node of workflowData.nodes) {
        // Check if there's configuration for this node
        if (configuration[node.name]) {
          // Apply node-specific configuration
          node.parameters = {
            ...node.parameters,
            ...configuration[node.name],
          }
        }
      }
    }

    return workflowData
  }

  /**
   * Generate a workflow from a template schema
   */

  
  private generateWorkflowFromTemplate(
    template: WorkflowTemplate,
    configuration: Record<string, any> | null,
  ): N8nWorkflowData {
    // This would be a complex function to generate n8n workflow JSON from our template schema
    // For now, we'll return a basic structure that would need to be expanded based on the template
    return {
      name: template.name,
      nodes: [],
      connections: {},
      active: false,
      settings: {
        saveManualExecutions: true,
        callerPolicy: "workflowsFromSameOwner",
      },
    }
  }

  /**
   * Check if all required credentials are set for a workflow
   */
  private async checkRequiredCredentials(userWorkflow: UserWorkflow & { credentials: any[] }): Promise<string[]> {
    // This would check the workflow nodes against the provided credentials
    // For now, we'll return an empty array indicating no missing credentials
    return []
  }

  /**
   * Sanitize execution data to remove sensitive information
   */
  private sanitizeExecutionData(data: any): any {
    if (!data) return null

    // Deep clone the data
    const sanitized = JSON.parse(JSON.stringify(data))

    // Remove sensitive fields (this would be expanded based on your needs)
    const sensitiveFields = ["password", "token", "secret", "key", "apiKey", "api_key"]

    const sanitizeObject = (obj: any) => {
      if (!obj || typeof obj !== "object") return

      for (const key in obj) {
        if (sensitiveFields.some((field) => key.toLowerCase().includes(field))) {
          obj[key] = "[REDACTED]"
        } else if (typeof obj[key] === "object") {
          sanitizeObject(obj[key])
        }
      }
    }

    sanitizeObject(sanitized)
    return sanitized
  }

  /**
   * Update analytics for a workflow
   */
  private async updateAnalytics(workflowId: string, success: boolean, duration: number): Promise<void> {
    try {
      const workflow = await client.userWorkflow.findUnique({
        where: { id: workflowId },
        select: { userId: true },
      })

      if (!workflow) return

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // Find or create analytics record for today
      const analytics = await client.workflowAnalytics.findUnique({
        where: {
          userId_date: {
            userId: workflow.userId,
            date: today,
          },
        },
      })

      if (analytics) {
        // Update existing record
        await client.workflowAnalytics.update({
          where: {
            userId_date: {
              userId: workflow.userId,
              date: today,
            },
          },
          data: {
            totalExecutions: { increment: 1 },
            successfulExecutions: success ? { increment: 1 } : undefined,
            failedExecutions: !success ? { increment: 1 } : undefined,
            averageDuration: {
              set:
                ((analytics.averageDuration || 0) * analytics.totalExecutions) / (analytics.totalExecutions + 1) +
                duration / (analytics.totalExecutions + 1),
            },
          },
        })
      } else {
        // Create new record
        await client.workflowAnalytics.create({
          data: {
            userId: workflow.userId,
            date: today,
            totalExecutions: 1,
            successfulExecutions: success ? 1 : 0,
            failedExecutions: !success ? 1 : 0,
            averageDuration: duration,
          },
        })
      }
    } catch (error) {
      console.error("Error updating analytics:", error)
      // Don't throw here to avoid failing the main operation
    }
  }
}

// Export singleton instance
export const n8nService = new N8nService()
