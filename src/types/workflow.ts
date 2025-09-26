
// export interface IntegrationConfig {
//   name: string
//   apiKey?: string
//   apiSecret?: string
//   webhookUrl?: string
//   projectId?: string
//   versionId?: string
//   additionalSettings?: Record<string, string>
// }



// export interface CustomWorkflowRequest {
//   id: string
//   title: string
//   businessObjective: string
//   status:
//     | "SUBMITTED"
//     | "UNDER_REVIEW"
//     | "APPROVED"
//     | "IN_DEVELOPMENT"
//     | "READY_FOR_TESTING"
//     | "COMPLETED"
//     | "REJECTED"
//     | "CANCELED"
//     | "EDIT_REQUESTED" // Added EDIT_REQUESTED
//   urgency: "LOW" | "NORMAL" | "HIGH" | "CRITICAL"
//   developmentNotes?: string
//   estimatedDelivery?: string
//   actualDelivery?: string
//   createdAt: string
//   updatedAt: string
//   user: {
//     id: string
//     firstname: string
//     lastname: string
//     email: string
//   }
//   completedTemplateId?: string | null // Reference to BusinessWorkflowConfig
//   editRequestDetails?: string | null // New field for edit request details
// }


// export interface CRMIntegration {
//   id: string
//   provider: string
//   name: string
//   isActive: boolean
//   createdAt: string
// }



// export type WorkflowRequestStatus =
//   | "SUBMITTED"
//   | "UNDER_REVIEW"
//   | "APPROVED"
//   | "IN_DEVELOPMENT"
//   | "READY_FOR_TESTING"
//   | "COMPLETED"
//   | "REJECTED"
//   | "CANCELED"
//   | "EDIT_REQUESTED" // Added EDIT_REQUESTED status

// export type WorkflowTemplateCategory = "AI_ASSISTANT" | "CUSTOM" | "SALES" | "MARKETING" | "SUPPORT" | "HR"
// export type WorkflowComplexity = "LOW" | "MEDIUM" | "HIGH"
// export type Urgency = "LOW" | "NORMAL" | "HIGH" | "CRITICAL"

// // Define the structure for a credential field
// export interface CredentialField {
//   name: string // e.g., "apiKey", "clientId", "clientSecret", "domain"
//   label: string // e.g., "API Key", "Client ID", "Client Secret", "Domain"
//   type: "text" | "password" | "email" | "url" // Input type for the field
//   required: boolean
// }

// // Define the structure for an integration with credential details
// export interface Integration {
//   id: string
//   name: string
//   description: string
//   pricing: string // e.g., "Free", "Paid", "Per-use"
//   category: string // e.g., "CRM", "Communication", "Analytics"
//   logoUrl?: string
//   credentialFields: CredentialField[] // Specific fields required for this integration
//   credentialInstructions: string // Markdown or plain text instructions for the user
// }

// // Define the structure for a workflow step
// export interface WorkflowStep {
//   stepNumber: number
//   title: string
//   description: string
//   type: string // e.g., "trigger", "analysis", "response", "integration"
//   complexity?: WorkflowComplexity
//   estimatedTime?: string
//   inputs?: string[]
//   outputs?: string[]
//   aiReasoning?: string
//   details?: string[]
//   selectedIntegrations?: Integration[]
// }

// // Define the structure for a parsed workflow design
// export interface ParsedWorkflow {
//   title: string
//   description: string
//   steps: WorkflowStep[]
//   benefits: string[]
//   integrations: Integration[] // Detailed integrations used in the design
//   metrics: {
//     automationRate: string
//     responseTime: string
//     accuracy: string
//   }
//   complexity: WorkflowComplexity
//   estimatedCost?: string
//   roi?: string
// }

// // Define the structure for a custom workflow request
// export interface CustomWorkflowRequest {
//   id: string
//   userId: string
//   title: string
//   businessObjective: string
//   status: WorkflowRequestStatus
//   urgency: Urgency
//   budget?: number // Added budget property
//   developmentNotes?: string
//   estimatedDelivery?: string
//   createdAt: string
//   updatedAt: string
//   user: {
//     id: string
//     email: string
//     firstname: string
//     lastname: string
//   }
//   aiSuggestions?: {
//     workflowDesign?: ParsedWorkflow
//     businessInfo?: {
//       businessName: string
//       businessType: string
//       businessSize: string
//     }
//     selectedChannels?: string[]
//     automationFeatures?: string[]
//     customRequest?: string
//     estimatedCost?: string
//     roi?: string
//   }
//   completedTemplate?: WorkflowTemplate // Link to the template created from this request
//   editRequests?: {
//     id: string
//     status: "PENDING" | "APPROVED" | "REJECTED"
//     requestedChanges: string
//     createdAt: string
//   }[]
// }

// // Define the structure for a workflow template
// export interface WorkflowTemplate {
//   id: string
//   name: string
//   category: WorkflowTemplateCategory
//   description: string
//   complexity: WorkflowComplexity
//   isPublic: boolean
//   isActive: boolean
//   operations: string[] // List of main operations/steps
//   features: string[] // Key features provided
//   integrations: Integration[] // Array of detailed Integration objects
//   voiceflowProjectId?: string
//   voiceflowVersionId?: string
//   originalRequestId?: string // Link back to the request it was created from
//   createdByAdmin: boolean
//   createdAt: string
//   updatedAt: string
//   _count: {
//     businessConfigs: number // Number of times this template has been used by businesses
//   }
//   workflowDesign?: ParsedWorkflow // The actual design of the workflow
// }

// // Define the structure for a business workflow configuration
// export interface BusinessWorkflowConfig {
//   id: string
//   businessId: string
//   templateId: string
//   name: string
//   description?: string // Added optional description for custom configs
//   status: "ACTIVE" | "INACTIVE" | "DRAFT" | "PENDING_CREATION" // Added PENDING_CREATION
//   isActive: boolean // Added isActive
//   createdAt: string
//   updatedAt: string
//   workflowTemplate?:WorkflowTemplate
//   template?: WorkflowTemplate // The associated template (optional if custom)
//   customizations: any // JSON field for specific business customizations
//   credentials: IntegrationCredential[] // Array of credentials stored for this config
//   customRequest?: string // If this config was from a custom request
// }

// // Define the structure for stored integration credentials
// export interface IntegrationCredential {
//   id: string
//   integrationName: string // e.g., "Salesforce"
//   integrationType: string // e.g., "CRM"
//   apiKey: string // Encrypted JSON string of actual credential values { "apiKey": "...", "domain": "..." }
//   isActive: boolean
//   createdAt: string
//   updatedAt: string
// }

// // Define the structure for a CRM integration (separate from general integrations)
// export interface CRMIntegration {
//   id: string
//   userId: string
//   provider: string // e.g., "Salesforce", "HubSpot"
//   apiKey: string // Encrypted API key or OAuth token
//   isActive: boolean
//   createdAt: string
//   updatedAt: string
// }

// // Define the structure for pending workflow data (for user-side tracking)
// export interface PendingWorkflowData {
//   id: string
//   submittedAt: string
//   status: WorkflowRequestStatus // Use WorkflowRequestStatus for consistency
//   workflowType: "Default CRM Workflow" | "Custom Workflow"
//   estimatedCompletion: string
// }

// // Define the structure for a custom workflow request from the user's perspective
// export interface CustomWorkflowRequestUserView {
//   id: string
//   title: string
//   businessObjective: string
//   status: WorkflowRequestStatus
//   urgency: Urgency
//   budget?: number
//   developmentNotes?: string
//   estimatedDelivery?: string
//   createdAt: string
//   updatedAt: string
//   aiSuggestions?: {
//     workflowDesign?: ParsedWorkflow
//     businessInfo?: {
//       businessName: string
//       businessType: string
//       businessSize: string
//     }
//     selectedChannels?: string[]
//     automationFeatures?: string[]
//     customRequest?: string
//     estimatedCost?: string
//     roi?: string
//   }
//   completedTemplate?: {
//     id: string
//     name: string
//     isPublic: boolean
//   }
//   editRequests?: {
//     id: string
//     status: "PENDING" | "APPROVED" | "REJECTED"
//     requestedChanges: string
//     createdAt: string
//   }[]
// }
// still in use - Central type definitions for the workflow builder


// export interface WorkflowNode {   
//   id: string
//   type: "trigger" | "text" | "button" | "image" | "condition" | "delay" | "api" | "webhook"
//   position: { x: number; y: number }
//   data: any
//   connections: string[]
// }

// export interface WorkflowConnection {
//   from: string
//   to: string
// }

// export interface WorkflowMetadata {
//   id?: string
//   name: string
//   description: string
//   version: string
//   createdAt?: string
//   updatedAt?: string
//   userId?: string
//   isActive?: boolean
// }

// export interface Workflow {
//   id: string
//   name: string
//   description: string
//   nodes: WorkflowNode[]
//   connections: WorkflowConnection[]
//   metadata: WorkflowMetadata
//   isActive: boolean
//   version: string
//   createdAt: string
//   updatedAt: string
//   userId: string
// }

// export interface WorkflowExecution {
//   id: string
//   workflowId: string
//   status: "pending" | "running" | "completed" | "failed"
//   startedAt: string
//   completedAt?: string
//   input: any
//   output?: any
//   error?: string
// }

// export interface WorkflowAnalytics {
//   workflowId: string
//   totalExecutions: number
//   successfulExecutions: number
//   failedExecutions: number
//   averageExecutionTime: number
//   lastExecuted?: string
// }

// export interface BlockType {
//   id: string
//   name: string
//   description: string
//   icon: string
//   category: "trigger" | "action" | "condition" | "integration"
//   defaultData: any
// }

// export interface TestData {
//   message?: string
//   sender?: string
//   platform?: string
//   timestamp?: string
//   metadata?: Record<string, any>
// }

// export interface ValidationError {
//   nodeId: string
//   field: string
//   message: string
// }

// export interface WorkflowValidation {
//   isValid: boolean
//   errors: ValidationError[]
//   warnings: string[]
// }
export interface WorkflowNode {
  id: string
  type: "trigger" | "text" | "button" | "image" | "condition" | "delay" | "api" | "webhook"
  position: { x: number; y: number }
  data: any
  connections: string[]
}

export interface WorkflowConnection {
  id?: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
  // Legacy support for existing code
  from?: string
  to?: string
}

export interface WorkflowMetadata {
  id?: string
  name: string
  description: string
  version: string
  createdAt?: string
  updatedAt?: string
  userId?: string
  isActive?: boolean
}

export interface Workflow {
  id: string
  name: string
  description: string
  nodes: WorkflowNode[]
  connections: WorkflowConnection[]
  metadata: WorkflowMetadata
  isActive: boolean
  version: string
  createdAt: string
  updatedAt: string
  userId: string
}

export interface WorkflowExecution {
  id: string
  workflowId: string
  status: "pending" | "running" | "completed" | "failed"
  startedAt: string
  completedAt?: string
  input: any
  output?: any
  error?: string
}

export interface WorkflowAnalytics {
  workflowId: string
  totalExecutions: number
  successfulExecutions: number
  failedExecutions: number
  averageExecutionTime: number
  lastExecuted?: string
}

export interface BlockType {
  id: string
  name: string
  description: string
  icon: string
  category: "trigger" | "action" | "condition" | "integration"
  defaultData: any
}

export interface TestData {
  message?: string
  sender?: string
  platform?: string
  timestamp?: string
  metadata?: Record<string, any>
}

export interface ValidationError {
  nodeId: string
  field: string
  message: string
}

export interface WorkflowValidation {
  isValid: boolean
  errors: ValidationError[]
  warnings: string[]
}

// Additional types for workflow execution context
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
  responses?: WorkflowResponse[]
}

export interface WorkflowResponse {
  type: "text" | "button" | "image" | "carousel"
  text?: string
  buttons?: WorkflowButton[]
  quickReplies?: WorkflowQuickReply[]
  carousel?: WorkflowCarouselElement[]
  attachment?: WorkflowAttachment
}

export interface WorkflowButton {
  title: string
  payload: string
  url?: string
}

export interface WorkflowQuickReply {
  title: string
  payload: string
}

export interface WorkflowCarouselElement {
  title: string
  subtitle?: string
  image_url?: string
  buttons?: WorkflowButton[]
}

export interface WorkflowAttachment {
  type: "image" | "video" | "audio" | "file"
  url: string
  caption?: string
}
