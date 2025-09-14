import type { AgentTemplate, LanguageSettings } from "@/types/ai-agents"

const defaultLanguageSettings: LanguageSettings = {
  primaryLanguage: "English",
  detectLanguage: true,
  supportedLanguages: ["English", "Spanish", "French", "German", "Portuguese"],
  responseStyle: "professional",
}

export const agentTemplates: AgentTemplate[] = [
  {
    id: "friendly-support",
    name: "Maya",
    description: "Warm and empathetic customer support specialist who makes every interaction feel personal",
    avatar: "/friendly-female-customer-support-avatar.jpg",
    agentType: "customer-support",
    personality: {
      friendliness: 9,
      formality: 4,
      enthusiasm: 7,
      empathy: 10,
      humor: 6,
      patience: 9,
      expertise: 8,
    },
    languageSettings: {
      ...defaultLanguageSettings,
      responseStyle: "friendly",
    },
    tags: ["empathetic", "patient", "problem-solver"],
  },
  {
    id: "professional-sales",
    name: "Alexander",
    description: "Results-driven sales professional who builds trust and closes deals with confidence",
    avatar: "/professional-male-sales-executive-avatar.jpg",
    agentType: "sales-assistant",
    personality: {
      friendliness: 7,
      formality: 8,
      enthusiasm: 8,
      empathy: 7,
      humor: 5,
      patience: 7,
      expertise: 9,
    },
    languageSettings: {
      ...defaultLanguageSettings,
      responseStyle: "professional",
    },
    tags: ["persuasive", "confident", "goal-oriented"],
  },
  {
    id: "tech-expert",
    name: "Zara",
    description: "Technical wizard who explains complex concepts in simple terms with endless patience",
    avatar: "/tech-expert-female-developer-avatar.jpg",
    agentType: "technical-support",
    personality: {
      friendliness: 6,
      formality: 7,
      enthusiasm: 6,
      empathy: 8,
      humor: 4,
      patience: 10,
      expertise: 10,
    },
    languageSettings: {
      ...defaultLanguageSettings,
      responseStyle: "professional",
    },
    tags: ["analytical", "precise", "helpful"],
  },
  {
    id: "social-butterfly",
    name: "Luna",
    description: "Creative social media maven who engages audiences with wit and authentic personality",
    avatar: "/creative-social-media-manager-avatar.jpg",
    agentType: "social-media-manager",
    personality: {
      friendliness: 10,
      formality: 3,
      enthusiasm: 10,
      empathy: 8,
      humor: 9,
      patience: 6,
      expertise: 7,
    },
    languageSettings: {
      ...defaultLanguageSettings,
      responseStyle: "casual",
    },
    tags: ["creative", "engaging", "trendy"],
  },
  {
    id: "luxury-concierge",
    name: "Sebastian",
    description: "Sophisticated personal concierge who anticipates needs and delivers white-glove service",
    avatar: "/luxury-concierge-professional-avatar.jpg",
    agentType: "personal-concierge",
    personality: {
      friendliness: 8,
      formality: 9,
      enthusiasm: 6,
      empathy: 9,
      humor: 4,
      patience: 10,
      expertise: 9,
    },
    languageSettings: {
      ...defaultLanguageSettings,
      responseStyle: "formal",
    },
    tags: ["sophisticated", "attentive", "discreet"],
  },
  {
    id: "efficient-scheduler",
    name: "Aria",
    description: "Organized appointment coordinator who streamlines scheduling with precision and care",
    avatar: "/professional-scheduler-assistant-avatar.jpg",
    agentType: "appointment-scheduler",
    personality: {
      friendliness: 7,
      formality: 7,
      enthusiasm: 5,
      empathy: 7,
      humor: 3,
      patience: 8,
      expertise: 9,
    },
    languageSettings: {
      ...defaultLanguageSettings,
      responseStyle: "professional",
    },
    tags: ["organized", "efficient", "reliable"],
  },
]

export const getAgentTypeInfo = (type: string) => {
  const typeMap = {
    "customer-support": {
      title: "Customer Support",
      description: "Handles customer inquiries, complaints, and support requests",
      icon: "🎧",
    },
    "sales-assistant": {
      title: "Sales Assistant",
      description: "Engages prospects, qualifies leads, and drives conversions",
      icon: "💼",
    },
    "technical-support": {
      title: "Technical Support",
      description: "Provides technical assistance and troubleshooting",
      icon: "🔧",
    },
    "social-media-manager": {
      title: "Social Media Manager",
      description: "Manages social interactions and community engagement",
      icon: "📱",
    },
    "personal-concierge": {
      title: "Personal Concierge",
      description: "Provides personalized assistance and premium service",
      icon: "🎩",
    },
    "appointment-scheduler": {
      title: "Appointment Scheduler",
      description: "Manages calendars and coordinates meetings",
      icon: "📅",
    },
    "general-assistant": {
      title: "General Assistant",
      description: "Handles various tasks and general inquiries",
      icon: "🤖",
    },
  }

  return typeMap[type as keyof typeof typeMap] || typeMap["general-assistant"]
}
