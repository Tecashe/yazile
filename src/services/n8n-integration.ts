/**
 * Service for integrating with n8n
 */

interface N8nWorkflow {
    id: string
    name: string
    active: boolean
    createdAt: string
    updatedAt: string
    nodes: any[]
    connections: any
  }
  
  interface N8nCredential {
    id: string
    name: string
    type: string
    createdAt: string
    updatedAt: string
  }
  
  /**
   * Fetches all workflows from an n8n instance
   */
  export async function fetchWorkflows(baseUrl: string, apiKey: string): Promise<N8nWorkflow[]> {
    try {
      const response = await fetch(`${baseUrl}/api/v1/workflows`, {
        method: "GET",
        headers: {
          "X-N8N-API-KEY": apiKey,
          "Content-Type": "application/json",
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
   * Creates a new workflow in n8n
   */
  export async function createWorkflow(
    baseUrl: string,
    apiKey: string,
    workflowData: any,
  ): Promise<{ id: string; name: string }> {
    try {
      const response = await fetch(`${baseUrl}/api/v1/workflows`, {
        method: "POST",
        headers: {
          "X-N8N-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workflowData),
      })
  
      if (!response.ok) {
        throw new Error(`Failed to create workflow: ${response.status}`)
      }
  
      const data = await response.json()
      return {
        id: data.id,
        name: data.name,
      }
    } catch (error) {
      console.error("Error creating n8n workflow:", error)
      throw error
    }
  }
  
  /**
   * Activates a workflow in n8n
   */
  export async function activateWorkflow(baseUrl: string, apiKey: string, workflowId: string): Promise<boolean> {
    try {
      const response = await fetch(`${baseUrl}/api/v1/workflows/${workflowId}/activate`, {
        method: "POST",
        headers: {
          "X-N8N-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
      })
  
      if (!response.ok) {
        throw new Error(`Failed to activate workflow: ${response.status}`)
      }
  
      return true
    } catch (error) {
      console.error("Error activating n8n workflow:", error)
      return false
    }
  }
  
  /**
   * Gets the webhook URL for a workflow
   */
  export async function getWorkflowWebhookUrl(
    baseUrl: string,
    apiKey: string,
    workflowId: string,
  ): Promise<string | null> {
    try {
      const response = await fetch(`${baseUrl}/api/v1/workflows/${workflowId}`, {
        method: "GET",
        headers: {
          "X-N8N-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
      })
  
      if (!response.ok) {
        throw new Error(`Failed to get workflow: ${response.status}`)
      }
  
      const workflow = await response.json()
  
      // Find webhook node
      const webhookNode = workflow.nodes.find((node: any) => node.type === "n8n-nodes-base.webhook")
      if (webhookNode) {
        // Extract webhook URL from node
        const webhookUrl = webhookNode.parameters?.path ? `${baseUrl}/webhook/${webhookNode.parameters.path}` : null
        return webhookUrl
      }
  
      return null
    } catch (error) {
      console.error("Error getting workflow webhook URL:", error)
      return null
    }
  }
  
  /**
   * Creates a lead qualification workflow template in n8n
   */
  export async function createLeadQualificationWorkflow(
    baseUrl: string,
    apiKey: string,
    name = "Lead Qualification",
  ): Promise<{ id: string; name: string; webhookUrl: string | null }> {
    try {
      // Create a basic lead qualification workflow template
      const workflowData = {
        name,
        nodes: [
          {
            parameters: {
              path: `lead-qualification-${Date.now()}`,
              responseMode: "lastNode",
              options: {},
            },
            name: "Webhook",
            type: "n8n-nodes-base.webhook",
            typeVersion: 1,
            position: [250, 300],
          },
          {
            parameters: {
              functionCode:
                "// Extract lead data from the incoming webhook\nconst lead = items[0].json.lead;\nconst qualificationData = items[0].json.qualificationData;\nconst interactions = items[0].json.recentInteractions || [];\n\n// Calculate final score based on qualification data\nlet finalScore = lead.score;\n\n// Determine if the lead is qualified\nconst isQualified = finalScore >= 75;\n\n// Return processed data\nreturn [\n  {\n    json: {\n      lead,\n      qualificationData,\n      interactions,\n      processed: {\n        finalScore,\n        isQualified,\n        processingDate: new Date().toISOString(),\n      }\n    }\n  }\n];",
            },
            name: "Process Lead Data",
            type: "n8n-nodes-base.function",
            typeVersion: 1,
            position: [500, 300],
          },
          {
            parameters: {
              conditions: {
                boolean: [
                  {
                    value1: "={{ $json.processed.isQualified }}",
                    value2: true,
                  },
                ],
              },
            },
            name: "Is Qualified?",
            type: "n8n-nodes-base.if",
            typeVersion: 1,
            position: [750, 300],
          },
          {
            parameters: {
              url: "={{ $json.webhookCallbackUrl || 'https://example.com/api/webhook/n8n' }}",
              options: {},
              method: "POST",
              sendBody: true,
              bodyParameters: {
                parameters: [
                  {
                    name: "action",
                    value: "update_lead_status",
                  },
                  {
                    name: "leadId",
                    value: "={{ $json.lead.id }}",
                  },
                  {
                    name: "status",
                    value: "QUALIFIED",
                  },
                  {
                    name: "notes",
                    value: "Automatically qualified by n8n workflow",
                  },
                ],
              },
            },
            name: "Notify System - Qualified",
            type: "n8n-nodes-base.httpRequest",
            typeVersion: 1,
            position: [1000, 200],
          },
          {
            parameters: {
              url: "={{ $json.webhookCallbackUrl || 'https://example.com/api/webhook/n8n' }}",
              options: {},
              method: "POST",
              sendBody: true,
              bodyParameters: {
                parameters: [
                  {
                    name: "action",
                    value: "update_lead_status",
                  },
                  {
                    name: "leadId",
                    value: "={{ $json.lead.id }}",
                  },
                  {
                    name: "status",
                    value: "NURTURING",
                  },
                  {
                    name: "notes",
                    value: "Lead requires further nurturing",
                  },
                ],
              },
            },
            name: "Notify System - Not Qualified",
            type: "n8n-nodes-base.httpRequest",
            typeVersion: 1,
            position: [1000, 400],
          },
        ],
        connections: {
          Webhook: {
            main: [
              [
                {
                  node: "Process Lead Data",
                  type: "main",
                  index: 0,
                },
              ],
            ],
          },
          "Process Lead Data": {
            main: [
              [
                {
                  node: "Is Qualified?",
                  type: "main",
                  index: 0,
                },
              ],
            ],
          },
          "Is Qualified?": {
            main: [
              [
                {
                  node: "Notify System - Qualified",
                  type: "main",
                  index: 0,
                },
              ],
              [
                {
                  node: "Notify System - Not Qualified",
                  type: "main",
                  index: 0,
                },
              ],
            ],
          },
        },
      }
  
      // Create the workflow
      const createdWorkflow = await createWorkflow(baseUrl, apiKey, workflowData)
  
      // Activate the workflow
      await activateWorkflow(baseUrl, apiKey, createdWorkflow.id)
  
      // Get the webhook URL
      const webhookUrl = await getWorkflowWebhookUrl(baseUrl, apiKey, createdWorkflow.id)
  
      return {
        id: createdWorkflow.id,
        name: createdWorkflow.name,
        webhookUrl,
      }
    } catch (error) {
      console.error("Error creating lead qualification workflow:", error)
      throw error
    }
  }
  
  /**
   * Executes a workflow in n8n
   */
  export async function executeWorkflow(baseUrl: string, apiKey: string, workflowId: string, data: any): Promise<any> {
    try {
      const response = await fetch(`${baseUrl}/api/v1/workflows/${workflowId}/execute`, {
        method: "POST",
        headers: {
          "X-N8N-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data,
        }),
      })
  
      if (!response.ok) {
        throw new Error(`Failed to execute workflow: ${response.status}`)
      }
  
      return await response.json()
    } catch (error) {
      console.error("Error executing n8n workflow:", error)
      throw error
    }
  }
  
