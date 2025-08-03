// export interface BusinessWorkflowConfig {
//   id: string
//   userId: string
//   businessId: string
//   workflowTemplateId: string | null
//   businessInfo: {
//     businessName: string
//     businessType: string
//     description?: string
//     website?: string
//     phone?: string
//     email?: string
//   }
//   integrations: { name: string; config: any }[]
//   customRequest?: string
//   status:
//     | "DRAFT"
//     | "CONFIGURING"
//     | "SUBMITTED"
//     | "PENDING_CREATION"
//     | "ACTIVE"
//     | "INACTIVE"
//     | "CUSTOM_REQUEST"
//     | "EDIT_REQUESTED" // Include EDIT_REQUESTED here for the overall workflow lifecycle
//   createdAt: Date
//   updatedAt: Date
//   isActive: boolean
//   workflowTemplate?: {
//     id: string
//     name: string
//     category: string
//     description: string
//   }
//   credentials: {
//     id: string
//     integrationName: string
//     integrationType: string
//     encryptedCredentials: string
//     isActive: boolean
//     lastVerified: Date | null
//   }[]
//   submittedAt?: Date
//   estimatedCompletion?: string
// }

// export interface CustomWorkflowRequest {
//   id: string
//   title: string
//   description: string
//   status: "SUBMITTED" | "UNDER_REVIEW" | "IN_DEVELOPMENT" | "COMPLETED" | "CANCELLED" | "EDIT_REQUESTED"
//   createdAt: string
//   updatedAt: string
//   aiSuggestions?: any // Assuming this holds the full workflow design
//   editRequestDetails?: string | null // New field for edit request details
// }

// export interface CRMIntegration {
//   id: string
//   provider: string
//   name: string
//   isActive: boolean
//   createdAt: string
// }

// export interface PendingWorkflowData {
//   id: string
//   submittedAt: string
//   status: string
//   workflowType?: string
//   estimatedCompletion?: string
// }

// export interface WorkflowTemplate {
//   id: string
//   name: string
//   category: string
//   description: string
//   complexity: string
//   isPublic: boolean
//   isActive: boolean
//   createdByAdmin: boolean
//   originalRequestId?: string
//   _count: {
//     businessConfigs: number
//   }
// }

// export interface WorkflowStep {
//   id: string
//   stepNumber: number
//   title: string
//   description: string
//   type: string
//   inputs?: string[]
//   outputs?: string[]
//   estimatedTime?: string
//   details?: string[]
//   complexity?: "low" | "medium" | "high"
//   businessImpact?: string
//   aiReasoning?: string
//   selectedIntegrations?: Integration[]
// }

// export interface Integration {
//   id: string
//   name: string
//   description: string
//   category: string
//   pricing: string
//   popularity: number
//   difficulty: string
//   features: string[]
//   setupTime: string
// }






















export interface IntegrationConfig {
  name: string
  apiKey?: string
  apiSecret?: string
  webhookUrl?: string
  projectId?: string
  versionId?: string
  additionalSettings?: Record<string, string>
}

// export interface BusinessWorkflowConfig {
//   id: string
//   userId: string
//   businessId: string
//   workflowTemplateId: string | null
//   businessInfo: {
//     businessName: string
//     businessType: string
//     description?: string
//     website?: string
//     phone?: string
//     email?: string
//   }
//   integrations: { name: string; config: IntegrationConfig }[]
//   customRequest?: string
//   status:
//     | "DRAFT"
//     | "CONFIGURING"
//     | "SUBMITTED"
//     | "PENDING_CREATION"
//     | "ACTIVE"
//     | "INACTIVE"
//     | "CUSTOM_REQUEST"
//     | "EDIT_REQUESTED"
//   createdAt: Date
//   updatedAt: Date
//   isActive: boolean
//   workflowTemplate?: {
//     id: string
//     name: string
//     category: string
//     description: string
//   }
//   credentials: {
//     id: string
//     integrationName: string
//     integrationType: string
//     encryptedCredentials: string
//     isActive: boolean
//     lastVerified: Date | null
//   }[]
//   activatedAt?: Date
//   performanceMetrics?: {
//     totalMessages: number
//     leadsQualified: number
//     averageResponseTime: string
//     successfulIntegrations: number
//   }
// }

export interface CustomWorkflowRequest {
  id: string
  title: string
  businessObjective: string
  status:
    | "SUBMITTED"
    | "UNDER_REVIEW"
    | "APPROVED"
    | "IN_DEVELOPMENT"
    | "READY_FOR_TESTING"
    | "COMPLETED"
    | "REJECTED"
    | "CANCELED"
    | "EDIT_REQUESTED" // Added EDIT_REQUESTED
  urgency: "LOW" | "NORMAL" | "HIGH" | "CRITICAL"
  developmentNotes?: string
  estimatedDelivery?: string
  actualDelivery?: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    firstname: string
    lastname: string
    email: string
  }
  completedTemplateId?: string | null // Reference to BusinessWorkflowConfig
  editRequestDetails?: string | null // New field for edit request details
}


export interface CRMIntegration {
  id: string
  provider: string
  name: string
  isActive: boolean
  createdAt: string
}

// export interface PendingWorkflowData {
//   id: string
//   submittedAt: string
//   status: string
//   workflowType?: string
//   estimatedCompletion?: string
// }



































// import type React from "react"
// // Centralized type definitions for consistency across the application.

// /**
//  * Represents the configuration for an integration used within a business workflow.
//  */
// export interface IntegrationConfig {
//   name: string
//   apiKey?: string
//   apiSecret?: string
//   webhookUrl?: string
//   projectId?: string
//   versionId?: string
//   additionalSettings?: Record<string, string>
// }

// /**
//  * Represents the configuration of a deployed or in-progress business workflow.
//  * This is typically what an admin or the system manages after a custom request is fulfilled or a template is activated.
//  */
// export interface BusinessWorkflowConfig {
//   id: string
//   userId: string
//   businessId: string
//   workflowTemplateId: string | null
//   businessInfo: {
//     businessName: string
//     businessType: string
//     description?: string
//     website?: string
//     phone?: string
//     email?: string
//   }
//   integrations: { name: string; config: IntegrationConfig }[]
//   customRequest?: string
//   status:
//     | "DRAFT"
//     | "CONFIGURING"
//     | "SUBMITTED"
//     | "PENDING_CREATION"
//     | "ACTIVE"
//     | "INACTIVE"
//     | "CUSTOM_REQUEST"
//     | "EDIT_REQUESTED"
//   createdAt: Date
//   updatedAt: Date
//   isActive: boolean
//   workflowTemplate?: {
//     id: string
//     name: string
//     category: string
//     description: string
//   }
//   credentials: {
//     id: string
//     integrationName: string
//     integrationType: string
//     encryptedCredentials: string
//     isActive: boolean
//     lastVerified: Date | null
//   }[]
//   activatedAt?: Date
//   performanceMetrics?: {
//     totalMessages: number
//     leadsQualified: number
//     averageResponseTime: string // e.g., "1.2s"
//     successfulIntegrations: number
//   }
// }

// /**
//  * Represents a user's custom workflow request.
//  * This is the initial request submitted by a user for a new workflow.
//  */
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
//     | "EDIT_REQUESTED"
//   urgency: "LOW" | "NORMAL" | "HIGH" | "CRITICAL"
//   developmentNotes?: string
//   estimatedDelivery?: string
//   actualDelivery?: string
//   createdAt: string // ISO string
//   updatedAt: string // ISO string
//   aiSuggestions?: {
//     workflowDesign?: ParsedWorkflow
//     businessInfo?: any
//     selectedChannels?: string[]
//     automationFeatures?: string[]
//     customRequest?: string
//     estimatedCost?: string
//     roi?: string
//   }
//   editRequestDetails?: string | null // New field for edit request details
//   user: {
//     id: string
//     firstname: string
//     lastname: string
//     email: string
//   }
//   completedTemplate?: {
//     id: string
//     name: string
//     description: string
//     isPublic: boolean
//     isActive: boolean
//   } | null
// }

// /**
//  * Represents a single step within a workflow design.
//  */
// export interface WorkflowStep {
//   id: string
//   stepNumber: number
//   title: string
//   description: string
//   type: string
//   inputs?: string[]
//   outputs?: string[]
//   conditions?: string[]
//   estimatedTime?: string
//   icon?: React.ComponentType<{ className?: string }>
//   color?: string
//   bgColor?: string
//   borderColor?: string
//   details?: string[]
//   isAnimating?: boolean
//   suggestedIntegrations?: Integration[]
//   selectedIntegrations?: Integration[]
//   aiReasoning?: string
//   complexity?: "low" | "medium" | "high"
//   businessImpact?: string
//   alternatives?: string[]
// }

// /**
//  * Represents a third-party integration that can be used in a workflow.
//  */
// export interface Integration {
//   id: string
//   name: string
//   description: string
//   category: string
//   icon?: React.ComponentType<{ className?: string }> // Optional icon for display
//   pricing: "free" | "freemium" | "paid" | "enterprise"
//   popularity: number
//   difficulty: "easy" | "medium" | "hard"
//   apiAvailable: boolean
//   webhookSupport: boolean
//   realTimeSync: boolean
//   features: string[]
//   setupTime: string
//   website?: string
// }

// /**
//  * Represents the full AI-generated or manually designed workflow structure.
//  */
// export interface ParsedWorkflow {
//   title: string
//   description: string
//   platform: string
//   estimatedBuildTime: string
//   complexity: string
//   steps: WorkflowStep[]
//   integrations: Integration[]
//   benefits: string[]
//   exampleScenario: string
//   technicalRequirements: string[]
//   deploymentChannels: string[]
//   estimatedCost?: string
//   roi?: string
//   metrics?: {
//     automationRate: string
//     responseTime: string
//     accuracy: string
//     scalability: string
//   }
// }

// /**
//  * Represents a workflow template that can be published and used by users.
//  */
// export interface WorkflowTemplate {
//   id: string
//   name: string
//   category: string
//   description: string
//   complexity: string
//   operations: string[]
//   features: string[]
//   integrations: string[]
//   isPublic: boolean
//   isActive: boolean
//   createdByAdmin: boolean
//   originalRequestId?: string | null
//   voiceflowProjectId?: string | null
//   voiceflowVersionId?: string | null
//   publishedBy?: string | null
//   publishedAt?: Date | null
//   _count: {
//     businessConfigs: number
//   }
//   // Add the full workflow design if it's stored with the template
//   workflowDesign?: ParsedWorkflow | null
// }

// /**
//  * Represents a CRM integration type.
//  */
// export type CRMIntegrations = "Salesforce" | "HubSpot" | "Pipedrive" | "Zoho CRM" | "Microsoft Dynamics 365" | "Custom"

















///////////////////////


// Centralized type definitions for workflow-related entities

export type WorkflowRequestStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "IN_DEVELOPMENT"
  | "READY_FOR_TESTING"
  | "COMPLETED"
  | "REJECTED"
  | "CANCELED"
  | "EDIT_REQUESTED" // Added EDIT_REQUESTED status

export type WorkflowTemplateCategory = "AI_ASSISTANT" | "CUSTOM" | "SALES" | "MARKETING" | "SUPPORT" | "HR"
export type WorkflowComplexity = "LOW" | "MEDIUM" | "HIGH"
export type Urgency = "LOW" | "NORMAL" | "HIGH" | "CRITICAL"

// Define the structure for a credential field
export interface CredentialField {
  name: string // e.g., "apiKey", "clientId", "clientSecret", "domain"
  label: string // e.g., "API Key", "Client ID", "Client Secret", "Domain"
  type: "text" | "password" | "email" | "url" // Input type for the field
  required: boolean
}

// Define the structure for an integration with credential details
export interface Integration {
  id: string
  name: string
  description: string
  pricing: string // e.g., "Free", "Paid", "Per-use"
  category: string // e.g., "CRM", "Communication", "Analytics"
  logoUrl?: string
  credentialFields: CredentialField[] // Specific fields required for this integration
  credentialInstructions: string // Markdown or plain text instructions for the user
}

// Define the structure for a workflow step
export interface WorkflowStep {
  stepNumber: number
  title: string
  description: string
  type: string // e.g., "trigger", "analysis", "response", "integration"
  complexity?: WorkflowComplexity
  estimatedTime?: string
  inputs?: string[]
  outputs?: string[]
  aiReasoning?: string
  details?: string[]
  selectedIntegrations?: Integration[]
}

// Define the structure for a parsed workflow design
export interface ParsedWorkflow {
  title: string
  description: string
  steps: WorkflowStep[]
  benefits: string[]
  integrations: Integration[] // Detailed integrations used in the design
  metrics: {
    automationRate: string
    responseTime: string
    accuracy: string
  }
  complexity: WorkflowComplexity
  estimatedCost?: string
  roi?: string
}

// Define the structure for a custom workflow request
export interface CustomWorkflowRequest {
  id: string
  userId: string
  title: string
  businessObjective: string
  status: WorkflowRequestStatus
  urgency: Urgency
  budget?: number // Added budget property
  developmentNotes?: string
  estimatedDelivery?: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    email: string
    firstname: string
    lastname: string
  }
  aiSuggestions?: {
    workflowDesign?: ParsedWorkflow
    businessInfo?: {
      businessName: string
      businessType: string
      businessSize: string
    }
    selectedChannels?: string[]
    automationFeatures?: string[]
    customRequest?: string
    estimatedCost?: string
    roi?: string
  }
  completedTemplate?: WorkflowTemplate // Link to the template created from this request
  editRequests?: {
    id: string
    status: "PENDING" | "APPROVED" | "REJECTED"
    requestedChanges: string
    createdAt: string
  }[]
}

// Define the structure for a workflow template
export interface WorkflowTemplate {
  id: string
  name: string
  category: WorkflowTemplateCategory
  description: string
  complexity: WorkflowComplexity
  isPublic: boolean
  isActive: boolean
  operations: string[] // List of main operations/steps
  features: string[] // Key features provided
  integrations: Integration[] // Array of detailed Integration objects
  voiceflowProjectId?: string
  voiceflowVersionId?: string
  originalRequestId?: string // Link back to the request it was created from
  createdByAdmin: boolean
  createdAt: string
  updatedAt: string
  _count: {
    businessConfigs: number // Number of times this template has been used by businesses
  }
  workflowDesign?: ParsedWorkflow // The actual design of the workflow
}

// Define the structure for a business workflow configuration
export interface BusinessWorkflowConfig {
  id: string
  businessId: string
  templateId: string
  name: string
  description?: string // Added optional description for custom configs
  status: "ACTIVE" | "INACTIVE" | "DRAFT" | "PENDING_CREATION" // Added PENDING_CREATION
  isActive: boolean // Added isActive
  createdAt: string
  updatedAt: string
  template?: WorkflowTemplate // The associated template (optional if custom)
  customizations: any // JSON field for specific business customizations
  credentials: IntegrationCredential[] // Array of credentials stored for this config
  customRequest?: string // If this config was from a custom request
}

// Define the structure for stored integration credentials
export interface IntegrationCredential {
  id: string
  integrationName: string // e.g., "Salesforce"
  integrationType: string // e.g., "CRM"
  apiKey: string // Encrypted JSON string of actual credential values { "apiKey": "...", "domain": "..." }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Define the structure for a CRM integration (separate from general integrations)
export interface CRMIntegration {
  id: string
  userId: string
  provider: string // e.g., "Salesforce", "HubSpot"
  apiKey: string // Encrypted API key or OAuth token
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Define the structure for pending workflow data (for user-side tracking)
export interface PendingWorkflowData {
  id: string
  submittedAt: string
  status: WorkflowRequestStatus // Use WorkflowRequestStatus for consistency
  workflowType: "Default CRM Workflow" | "Custom Workflow"
  estimatedCompletion: string
}

// Define the structure for a custom workflow request from the user's perspective
export interface CustomWorkflowRequestUserView {
  id: string
  title: string
  businessObjective: string
  status: WorkflowRequestStatus
  urgency: Urgency
  budget?: number
  developmentNotes?: string
  estimatedDelivery?: string
  createdAt: string
  updatedAt: string
  aiSuggestions?: {
    workflowDesign?: ParsedWorkflow
    businessInfo?: {
      businessName: string
      businessType: string
      businessSize: string
    }
    selectedChannels?: string[]
    automationFeatures?: string[]
    customRequest?: string
    estimatedCost?: string
    roi?: string
  }
  completedTemplate?: {
    id: string
    name: string
    isPublic: boolean
  }
  editRequests?: {
    id: string
    status: "PENDING" | "APPROVED" | "REJECTED"
    requestedChanges: string
    createdAt: string
  }[]
}
