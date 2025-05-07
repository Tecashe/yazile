/**
 * N8n Workflow Data structure
 */
export interface N8nWorkflowData {
    id?: string
    name: string
    active: boolean
    nodes: N8nNode[]
    connections: Record<string, N8nConnection[]>
    settings?: N8nWorkflowSettings
    tags?: string[]
    pinData?: Record<string, any>
    staticData?: Record<string, any>
    versionId?: string
  }
  
  /**
   * N8n Node structure
   */
  export interface N8nNode {
    id: string
    name: string
    type: string
    position: [number, number]
    parameters?: Record<string, any>
    typeVersion?: number
    credentials?: Record<string, N8nCredentialUsage>
    disabled?: boolean
    notes?: string
    continueOnFail?: boolean
    alwaysOutputData?: boolean
    retryOnFail?: boolean
    maxTries?: number
    waitBetweenTries?: number
  }
  
  /**
   * N8n Connection structure
   */
  export interface N8nConnection {
    node: string
    type: string
    index: number
  }
  
  /**
   * N8n Workflow Settings
   */
  export interface N8nWorkflowSettings {
    executionOrder?: "v1" | "v2"
    saveManualExecutions?: boolean
    callerPolicy?: "workflowsFromSameOwner" | "none" | "any"
    errorWorkflow?: string
    saveDataErrorExecution?: "all" | "none"
    saveExecutionProgress?: boolean
    saveDataSuccessExecution?: "all" | "none"
    timezone?: string
  }
  
  /**
   * N8n Credential Usage
   */
  export interface N8nCredentialUsage {
    id: string
    name: string
  }
  
  /**
   * N8n Execution Data structure
   */
  export interface N8nExecutionData {
    id: string
    finished: boolean
    mode: "manual" | "trigger" | "webhook"
    startedAt: string
    stoppedAt?: string
    status: "success" | "error" | "running" | "waiting"
    data?: {
      resultData?: {
        runData?: Record<string, any[]>
        error?: {
          message: string
          stack?: string
        }
      }
      executionData?: {
        contextData?: Record<string, any>
        nodeExecutionStack?: N8nNodeExecution[]
        waitingExecution?: Record<string, any>
        waitingExecutionSource?: Record<string, any>
      }
      executionMetadata?: {
        resourceUsage?: {
          cpu?: number
          memory?: number
        }
      }
    }
    workflowId: string
    workflowData: N8nWorkflowData
  }
  
  /**
   * N8n Node Execution
   */
  export interface N8nNodeExecution {
    node?: {
      id: string
      name: string
      type: string
      typeVersion: number
      position: [number, number]
    }
    data?: {
      main?: any[][]
    }
    error?: {
      message: string
      stack?: string
    }
  }
  
  /**
   * N8n Credential Data structure
   */
  export interface N8nCredentialData {
    id: string
    name: string
    type: string
    data: Record<string, any>
    nodesAccess: {
      nodeType: string
      date: string
    }[]
  }
  
  /**
   * N8n Workflow Template
   */
  export interface N8nWorkflowTemplate {
    id: string
    name: string
    description: string
    workflow: N8nWorkflowData
    categories: string[]
    createdAt: string
    updatedAt: string
  }
  
  /**
   * Result of workflow activation
   */
  export interface WorkflowActivationResult {
    success: boolean
    message: string
    webhookUrl: string | null
  }
  
  /**
   * Result of workflow deactivation
   */
  export interface WorkflowDeactivationResult {
    success: boolean
    message: string
  }
  
  /**
   * Workflow configuration form field
   */
  export interface WorkflowConfigField {
    name: string
    label: string
    type: "text" | "number" | "boolean" | "select" | "multiselect" | "textarea" | "json" | "code" | "credential"
    description?: string
    placeholder?: string
    default?: any
    required?: boolean
    options?: { label: string; value: string }[]
    validation?: {
      min?: number
      max?: number
      pattern?: string
      message?: string
    }
    dependsOn?: {
      field: string
      value: any
    }
    nodeId?: string // Reference to the n8n node this field configures
    advanced?: boolean // Whether this is an advanced option
  }
  
  /**
   * Workflow configuration section
   */
  export interface WorkflowConfigSection {
    id: string
    title: string
    description?: string
    fields: WorkflowConfigField[]
  }
  
  /**
   * Complete workflow configuration schema
   */
  export interface WorkflowConfigSchema {
    sections: WorkflowConfigSection[]
  }
  
  /**
   * Workflow execution input schema
   */
  export interface WorkflowExecutionInputSchema {
    fields: WorkflowConfigField[]
  }
  
  /**
   * Workflow execution output schema
   */
  export interface WorkflowExecutionOutputSchema {
    fields: {
      name: string
      type: string
      description?: string
    }[]
  }
  
  /**
   * Workflow resource usage metrics
   */
  export interface WorkflowResourceUsage {
    cpu: number // CPU usage in milliseconds
    memory: number // Memory usage in MB
    executionTime: number // Total execution time in milliseconds
    apiCalls: number // Number of API calls made
    dataProcessed: number // Amount of data processed in KB
  }
  
  /**
   * Workflow business impact metrics
   */
  export interface WorkflowBusinessImpact {
    emailsSent?: number
    recordsCreated?: number
    recordsUpdated?: number
    filesProcessed?: number
    revenue?: number
    costSavings?: number
    timeSpared?: number // Time saved in minutes
    customMetrics?: Record<string, number>
  }
  