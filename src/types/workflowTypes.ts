export interface BusinessWorkflowType {
  id: string
  name: string
  category: BusinessCategory
  description: string
  complexity: "Simple" | "Medium" | "Complex"
  estimatedSetupTime: number
  operations: string[]
  features: string[]
  integrations: string[]
  voiceflowTemplate?: string
  commonUseCase: string
}

export enum BusinessCategory {
  APPOINTMENT_BASED = "GROUP_1",
  QUOTE_BASED = "GROUP_2",
  PRODUCT_SALES_HIGH_TOUCH = "GROUP_3",
  COURSE_PROGRAM_SALES = "GROUP_4",
  QUICK_TRANSACTION = "GROUP_5",
}

export interface BusinessWorkflowConfig {
  id: string
  userId: string
  businessId: string
  workflowTemplateId: string
  businessInfo: {
    businessName: string
    businessType: string
    description?: string
    website?: string
    phone?: string
    email?: string
  }
  integrationConfigs: IntegrationConfig[]
  voiceflowWorkflowId?: string
  status: "DRAFT" | "CONFIGURING" | "ACTIVE" | "INACTIVE"
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
