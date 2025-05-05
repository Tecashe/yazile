import type { Prisma } from "@prisma/client"

// Updated Lead interface to align with your Prisma schema
export interface Lead {
  id: string
  createdAt: Date
  updatedAt: Date

  // User identifiers (either one can exist)
  customerId?: string // Used in some contexts
  instagramUserId?: string // Used for Instagram leads

  // Platform details
  platformId?: string // In some contexts
  pageId?: string // For Instagram page ID

  // Core lead properties
  status: string
  score: number
  totalInteractions: number

  // Contact dates - different naming conventions in different contexts
  lastInteractionAt?: Date | null
  lastContactDate?: Date | null
  firstContactDate?: Date | null
  qualifiedDate?: Date | null
  convertedDate?: Date | null

  // Association fields
  userId: string
  automationId: string | null

  // n8n integration fields
  sentToN8n: boolean
  sentToN8nAt?: Date | null
  n8nWorkflowId?: string | null
  n8nExecutionId?: string | null

  // Additional lead info fields
  name?: string | null
  email?: string | null
  phone?: string | null
  source?: string | null
  notes?: string | null
  tags?: Prisma.JsonValue | null
  metadata?: Prisma.JsonValue | null

  // Related data
  qualificationData?: LeadQualificationData | null
  interactions?: LeadInteraction[]
}

export interface LeadQualificationData {
  id: string
  createdAt: Date
  updatedAt: Date
  qualificationData: Prisma.JsonValue | null
  leadId: string
  engagementScore: number
  intentScore: number
  sentimentScore: number
  demographicScore: number
  frequencyScore: number
  recencyScore: number
  aiAnalysis: Prisma.JsonValue | null
}

// Update the LeadInteraction interface to make createdAt and updatedAt optional
export interface LeadInteraction {
  id: string
  createdAt?: Date // Make optional
  updatedAt?: Date // Make optional
  leadId: string
  type: string
  content: string | null
  direction: string
  timestamp: Date
  sentiment?: number | null
  intent?: Prisma.JsonValue | null
  metadata?: Prisma.JsonValue | null
}

export interface LeadAnalysisInput {
  userId: string
  automationId: string
  platformId: string
  customerId: string
  message: string
  messageType: string
  timestamp: Date
}

export interface LeadStats {
  total: number
  new: number
  qualifying: number
  qualified: number
  converted: number
  disqualified: number
}

export interface LeadDashboardProps {
  leads: Lead[]
  leadStats: LeadStats
  workflows: any[]
}
