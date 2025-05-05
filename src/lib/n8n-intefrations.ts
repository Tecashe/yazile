interface TriggerN8nWorkflowParams {
    workflowId: string
    webhookUrl: string
    data: Record<string, any>
  }
  
  /**
   * Triggers an n8n workflow by sending data to its webhook URL
   */
  export async function triggerN8nWorkflow(params: TriggerN8nWorkflowParams): Promise<boolean> {
    try {
      const { webhookUrl, data } = params
  
      // Send data to n8n webhook
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
  
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error triggering n8n workflow: ${response.status} ${errorText}`)
        return false
      }
  
      console.log(`Successfully triggered n8n workflow: ${params.workflowId}`)
      return true
    } catch (error) {
      console.error("Error triggering n8n workflow:", error)
      return false
    }
  }
  
  /**
   * Fetches all available workflows from n8n for a given user's connection
   */
  export async function fetchN8nWorkflows(n8nBaseUrl: string, n8nApiKey: string): Promise<any[]> {
    try {
      const response = await fetch(`${n8nBaseUrl}/api/v1/workflows`, {
        headers: {
          "X-N8N-API-KEY": n8nApiKey,
        },
      })
  
      if (!response.ok) {
        throw new Error(`Failed to fetch workflows: ${response.status}`)
      }
  
      const data = await response.json()
      return data.data || []
    } catch (error) {
      console.error("Error fetching n8n workflows:", error)
      return []
    }
  }
  