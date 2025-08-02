export interface BusinessWorkflowConfig {
  id: string
  userId: string
  businessId: string
  workflowTemplateId: string | null
  businessInfo: {
    businessName: string
    businessType: string
    description?: string
    website?: string
    phone?: string
    email?: string
  }
  integrations: { name: string; config: any }[]
  customRequest?: string
  status:
    | "DRAFT"
    | "CONFIGURING"
    | "SUBMITTED"
    | "PENDING_CREATION"
    | "ACTIVE"
    | "INACTIVE"
    | "CUSTOM_REQUEST"
    | "EDIT_REQUESTED" // Include EDIT_REQUESTED here for the overall workflow lifecycle
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  workflowTemplate?: {
    id: string
    name: string
    category: string
    description: string
  }
  credentials: {
    id: string
    integrationName: string
    integrationType: string
    encryptedCredentials: string
    isActive: boolean
    lastVerified: Date | null
  }[]
  submittedAt?: Date
  estimatedCompletion?: string
}

export interface CustomWorkflowRequest {
  id: string
  title: string
  description: string
  status: "SUBMITTED" | "UNDER_REVIEW" | "IN_DEVELOPMENT" | "COMPLETED" | "CANCELLED" | "EDIT_REQUESTED"
  createdAt: string
  updatedAt: string
  aiSuggestions?: any // Assuming this holds the full workflow design
  editRequestDetails?: string | null // New field for edit request details
}

export interface CRMIntegration {
  id: string
  provider: string
  name: string
  isActive: boolean
  createdAt: string
}

export interface PendingWorkflowData {
  id: string
  submittedAt: string
  status: string
  workflowType?: string
  estimatedCompletion?: string
}

export interface WorkflowTemplate {
  id: string
  name: string
  category: string
  description: string
  complexity: string
  isPublic: boolean
  isActive: boolean
  createdByAdmin: boolean
  originalRequestId?: string
  _count: {
    businessConfigs: number
  }
}

export interface WorkflowStep {
  id: string
  stepNumber: number
  title: string
  description: string
  type: string
  inputs?: string[]
  outputs?: string[]
  estimatedTime?: string
  details?: string[]
  complexity?: "low" | "medium" | "high"
  businessImpact?: string
  aiReasoning?: string
  selectedIntegrations?: Integration[]
}

export interface Integration {
  id: string
  name: string
  description: string
  category: string
  pricing: string
  popularity: number
  difficulty: string
  features: string[]
  setupTime: string
}
