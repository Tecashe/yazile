// export interface BusinessWorkflowType {
//   id: string
//   name: string
//   category: BusinessCategory
//   description: string
//   complexity: "Simple" | "Medium" | "Complex"
//   estimatedSetupTime: number
//   operations: string[]
//   features: string[]
//   integrations: string[]
//   voiceflowTemplate?: string
//   commonUseCase: string
// }

// export enum BusinessCategory {
//   APPOINTMENT_BASED = "GROUP_1",
//   QUOTE_BASED = "GROUP_2",
//   PRODUCT_SALES_HIGH_TOUCH = "GROUP_3",
//   COURSE_PROGRAM_SALES = "GROUP_4",
//   QUICK_TRANSACTION = "GROUP_5",
// }

// export interface BusinessWorkflowConfig {
//   id: string
//   userId: string
//   businessId: string
//   workflowTemplateId: string
//   businessInfo: {
//     businessName: string
//     businessType: string
//     description?: string
//     website?: string
//     phone?: string
//     email?: string
//   }
//   integrationConfigs: IntegrationConfig[]
//   voiceflowWorkflowId?: string
//   status: "DRAFT" | "CONFIGURING" | "ACTIVE" | "INACTIVE"
//   createdAt: Date
//   updatedAt: Date
// }

// export interface IntegrationConfig {
//   name: string
//   type: string
//   credentials: {
//     apiKey?: string
//     apiSecret?: string
//     webhookUrl?: string
//     additionalSettings?: Record<string, string>
//   }
//   isActive: boolean
// }

// export interface BusinessWorkflowType {
//   id: string
//   name: string
//   category: BusinessCategory
//   description: string
//   complexity: "Simple" | "Medium" | "Complex"
//   estimatedSetupTime: number
//   operations: string[]
//   features: string[]
//   integrations: string[]
//   voiceflowProjectId: string // Renamed from voiceflowTemplateId
//   voiceflowVersionId: string // New field
//   commonUseCase: string
// }

// export enum BusinessCategory {
//   APPOINTMENT_BASED = "GROUP_1",
//   QUOTE_BASED = "GROUP_2",
//   PRODUCT_SALES_HIGH_TOUCH = "GROUP_3",
//   COURSE_PROGRAM_SALES = "GROUP_4",
//   QUICK_TRANSACTION = "GROUP_5",
//   EDUCATION_TRAINING = "GROUP_6", // New category
//   COMMUNITY_MANAGEMENT = "GROUP_7", // New category
//   CUSTOMER_SUPPORT_ADVANCED = "GROUP_8", // New category
// }

// export interface BusinessWorkflowConfig {
//   id: string
//   userId: string
//   businessId: string
//   workflowTemplateId: string | null // Can be NULL for custom requests
//   businessInfo: {
//     businessName: string
//     businessType: string
//     description?: string
//     website?: string
//     phone?: string
//     email?: string
//   }
//   integrationConfigs: IntegrationConfig[]
//   voiceflowProjectId?: string // New: Store the active Voiceflow Project ID
//   voiceflowVersionId?: string // New: Store the active Voiceflow Version ID
//   customRequest?: string // New: For custom workflow requests
//   status: "DRAFT" | "CONFIGURING" | "ACTIVE" | "INACTIVE" | "CUSTOM_REQUEST"
//   createdAt: Date
//   updatedAt: Date
// }

// export interface IntegrationConfig {
//   name: string
//   type: string
//   credentials: {
//     apiKey?: string
//     apiSecret?: string
//     webhookUrl?: string
//     additionalSettings?: Record<string, string>
//   }
//   isActive: boolean
// }



// export interface BusinessWorkflowType {
//   id: string
//   name: string
//   category: BusinessCategory
//   description: string
//   complexity: "Simple" | "Medium" | "Complex"
//   estimatedSetupTime: number
//   operations: string[]
//   features: string[]
//   integrations: string[]
//   // Removed voiceflowProjectId and voiceflowVersionId as they are now global environment variables
//   commonUseCase: string
// }

// export enum BusinessCategory {
//   APPOINTMENT_BASED = "GROUP_1",
//   QUOTE_BASED = "GROUP_2",
//   PRODUCT_SALES_HIGH_TOUCH = "GROUP_3",
//   COURSE_PROGRAM_SALES = "GROUP_4",
//   QUICK_TRANSACTION = "GROUP_5",
//   EDUCATION_TRAINING = "GROUP_6", // New category
//   COMMUNITY_MANAGEMENT = "GROUP_7", // New category
//   CUSTOMER_SUPPORT_ADVANCED = "GROUP_8", // New category
// }

// export interface BusinessWorkflowConfig {
//   id: string
//   userId: string
//   businessId: string
//   workflowTemplateId: string | null // Can be NULL for custom requests
//   businessInfo: {
//     businessName: string
//     businessType: string
//     description?: string
//     website?: string
//     phone?: string
//     email?: string
//   }
//   integrationConfigs: IntegrationConfig[]
//   // Removed voiceflowProjectId and voiceflowVersionId as they are now global environment variables
//   customRequest?: string // New: For custom workflow requests
//   status: "DRAFT" | "CONFIGURING" | "ACTIVE" | "INACTIVE" | "CUSTOM_REQUEST"
//   createdAt: Date
//   updatedAt: Date
// }

// export interface IntegrationConfig {
//   name: string
//   type: string
//   credentials: {
//     apiKey?: string
//     apiSecret?: string
//     webhookUrl?: string
//     additionalSettings?: Record<string, string>
//   }
//   isActive: boolean
// }


export interface BusinessWorkflowType {
  id: string
  name: string
  category: BusinessCategory
  description: string
  operations: string[]
  features: string[]
  integrations: string[]
  commonUseCase: string
  howItWorks: string
  scenarioExample: string
  integrationDetails: {
    [key: string]: {
      purpose: string
      setupInstructions: string
      usageInWorkflow: string
    }
  }
}

export enum BusinessCategory {
  APPOINTMENT_BASED = "GROUP_1",
  QUOTE_BASED = "GROUP_2",
  PRODUCT_SALES_HIGH_TOUCH = "GROUP_3",
  COURSE_PROGRAM_SALES = "GROUP_4",
  QUICK_TRANSACTION = "GROUP_5",
  EDUCATION_TRAINING = "GROUP_6", // New category
  COMMUNITY_MANAGEMENT = "GROUP_7", // New category
  CUSTOMER_SUPPORT_ADVANCED = "GROUP_8", // New category
}

export interface BusinessWorkflowConfig {
  id: string
  userId: string
  businessId: string
  workflowTemplateId: string | null // Can be NULL for custom requests
  businessInfo: {
    businessName: string
    businessType: string
    description?: string
    website?: string
    phone?: string
    email?: string
  }
  integrationConfigs: IntegrationConfig[]
  customRequest?: string // For custom workflow requests
  status: "DRAFT" | "CONFIGURING" | "ACTIVE" | "INACTIVE" | "CUSTOM_REQUEST"
  createdAt: Date
  updatedAt: Date
}

export interface IntegrationConfig {
  name: string
  type: string
  credentials: {
    apiKey?: string
    apiSecret?: string
    webhookUrl?: string
    additionalSettings?: Record<string, string>
  }
  isActive: boolean
}
