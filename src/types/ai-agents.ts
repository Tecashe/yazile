export interface AIAgent {
  id: string
  name: string
  description: string
  avatar: string
  agentType: AgentType
  personality: PersonalityTraits
  languageSettings: LanguageSettings
  isCustom: boolean
  businessId: string
  createdAt: Date
  updatedAt: Date
}

export interface PersonalityTraits {
  friendliness: number // 1-10 scale
  formality: number // 1-10 scale
  enthusiasm: number // 1-10 scale
  empathy: number // 1-10 scale
  humor: number // 1-10 scale
  patience: number // 1-10 scale
  expertise: number // 1-10 scale
}

export interface LanguageSettings {
  primaryLanguage: string
  detectLanguage: boolean // Auto-detect from DMs
  supportedLanguages: string[]
  responseStyle: "casual" | "professional" | "friendly" | "formal"
}

export type AgentType =
  | "customer-support"
  | "sales-assistant"
  | "personal-concierge"
  | "technical-support"
  | "social-media-manager"
  | "appointment-scheduler"
  | "general-assistant"

export interface AgentTemplate {
  id: string
  name: string
  description: string
  avatar: string
  agentType: AgentType
  personality: PersonalityTraits
  languageSettings: LanguageSettings
  tags: string[]
  introductoryStatement?: string
  tone?: string
}
