"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { PersonalitySlider } from "./personality-slider"
import { agentTemplates } from "@/lib/agent-templates"
import { updateAIAgent, generateAIAgent, getAvailableIntegrations } from "@/actions/ai-agents"
import { Bot, Sparkles, X, Save, Loader2, Settings } from "lucide-react"

interface AgentEditModalProps {
  agent: any
  isOpen: boolean
  onClose: () => void
  onSave: (updatedAgent: any) => void
  businessName: string
}

export function AgentEditModal({ agent, isOpen, onClose, onSave, businessName }: AgentEditModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [integrations, setIntegrations] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    avatar: "",
    agentType: "",
    tone: "professional",
    introductoryStatement: "",
    primaryLanguage: "English",
    detectLanguage: true,
    supportedLanguages: ["English"],
    responseStyle: "professional",
    friendliness: 7,
    formality: 5,
    enthusiasm: 6,
    empathy: 7,
    humor: 4,
    patience: 8,
    expertise: 6,
  })

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Chinese",
    "Japanese",
    "Korean",
    "Arabic",
  ]

  const tones = [
    { value: "professional", label: "Professional" },
    { value: "friendly", label: "Friendly" },
    { value: "casual", label: "Casual" },
    { value: "formal", label: "Formal" },
    { value: "enthusiastic", label: "Enthusiastic" },
    { value: "empathetic", label: "Empathetic" },
  ]

  const introTemplates = [
    `Hi, I'm {agentName} from ${businessName}. How can I help you today?`,
    `Hello! I'm {agentName}, your assistant at ${businessName}. What can I do for you?`,
    `Welcome! I'm {agentName} from ${businessName}. I'm here to help with any questions you have.`,
    `Hi there! {agentName} here from ${businessName}. How may I assist you today?`,
    `Greetings! I'm {agentName}, representing ${businessName}. What brings you here today?`,
  ]

  useEffect(() => {
    if (agent && isOpen) {
      setFormData({
        name: agent.name || "",
        description: agent.description || "",
        avatar: agent.avatar || "",
        agentType: agent.agentType || agent.agent_type || "",
        tone: agent.tone || "professional",
        introductoryStatement:
          agent.introductoryStatement || `Hi, I'm ${agent.name} from ${businessName}. How can I help you today?`,
        primaryLanguage: agent.primaryLanguage || "English",
        detectLanguage: agent.detectLanguage ?? true,
        supportedLanguages: agent.supportedLanguages || ["English"],
        responseStyle: agent.responseStyle || "professional",
        friendliness: agent.friendliness || 7,
        formality: agent.formality || 5,
        enthusiasm: agent.enthusiasm || 6,
        empathy: agent.empathy || 7,
        humor: agent.humor || 4,
        patience: agent.patience || 8,
        expertise: agent.expertise || 6,
      })

      // Load integrations
      const loadIntegrations = async () => {
        try {
          const result = await getAvailableIntegrations()
          if (result.status === 200) {
            setIntegrations(result.data)
          }
        } catch (error) {
          console.error("Error loading integrations:", error)
        }
      }
      loadIntegrations()
    }
  }, [agent, isOpen, businessName])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePersonalityChange = (trait: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [trait]: value,
    }))
  }

  const handleTemplateSelect = (template: string) => {
    const updatedTemplate = template.replace("{agentName}", formData.name)
    setFormData((prev) => ({
      ...prev,
      introductoryStatement: updatedTemplate,
    }))
  }

  const handleTemplateChange = (templateId: string) => {
    const template = agentTemplates.find((t) => t.id === templateId)
    if (template) {
      setSelectedTemplate(templateId)
      setFormData((prev) => ({
        ...prev,
        name: template.name,
        description: template.description,
        avatar: template.avatar,
        agentType: template.agentType,
        tone: template.tone || "professional",
        introductoryStatement:
          template.introductoryStatement?.replace("{businessName}", businessName) ||
          `Hi, I'm ${template.name} from ${businessName}. How can I help you today?`,
        primaryLanguage: template.languageSettings.primaryLanguage,
        detectLanguage: template.languageSettings.detectLanguage,
        supportedLanguages: template.languageSettings.supportedLanguages,
        responseStyle: template.languageSettings.responseStyle,
        friendliness: template.personality.friendliness,
        formality: template.personality.formality,
        enthusiasm: template.personality.enthusiasm,
        empathy: template.personality.empathy,
        humor: template.personality.humor,
        patience: template.personality.patience,
        expertise: template.personality.expertise,
      }))
    }
  }

  const handleGenerateWithAI = async () => {
    if (integrations.length === 0) {
      toast({
        title: "No Integrations",
        description: "Connect some integrations first to generate AI-powered agents.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const result = await generateAIAgent(businessName, integrations)
      if (result.status === 200 && "data" in result && result.data) {
        const generated = result.data
        setFormData((prev) => ({
          ...prev,
          name: generated.name,
          description: generated.description,
          agentType: generated.agentType,
          tone: generated.tone,
          introductoryStatement: generated.introductoryStatement,
          friendliness: generated.personality.friendliness,
          formality: generated.personality.formality,
          enthusiasm: generated.personality.enthusiasm,
          empathy: generated.personality.empathy,
          humor: generated.personality.humor,
          patience: generated.personality.patience,
          expertise: generated.personality.expertise,
        }))
        toast({
          title: "AI Generated!",
          description: "Your agent has been generated based on your integrations.",
        })
      } else {
        const errorMessage = "error" in result ? result.error : "Failed to generate AI agent"
        toast({
          title: "Generation Failed",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error generating agent:", error)
      toast({
        title: "Generation Failed",
        description: "Failed to generate AI agent. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide an agent name.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await updateAIAgent(agent.id, {
        name: formData.name,
        description: formData.description,
        avatar: formData.avatar,
        agentType: formData.agentType,
        tone: formData.tone,
        introductoryStatement: formData.introductoryStatement,
        primaryLanguage: formData.primaryLanguage,
        detectLanguage: formData.detectLanguage,
        supportedLanguages: formData.supportedLanguages,
        responseStyle: formData.responseStyle,
        friendliness: formData.friendliness,
        formality: formData.formality,
        enthusiasm: formData.enthusiasm,
        empathy: formData.empathy,
        humor: formData.humor,
        patience: formData.patience,
        expertise: formData.expertise,
      })

      if (result.status === 200) {
        toast({
          title: "Success!",
          description: "Your AI agent has been updated successfully.",
        })
        onSave(result.data)
        onClose()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update AI agent",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating agent:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Edit AI Agent
          </DialogTitle>
          <DialogDescription>Update your AI agent&apos;s personality, settings, and capabilities</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agent Templates */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Choose Template</h3>
              <Button variant="outline" size="sm" onClick={handleGenerateWithAI} disabled={isGenerating}>
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                AI Generate
              </Button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {agentTemplates.slice(0, 6).map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-colors ${
                    selectedTemplate === template.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                  }`}
                  onClick={() => handleTemplateChange(template.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary">
                          {template.name.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{template.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{template.description}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            <div className="space-y-2">
              <Label htmlFor="name">Agent Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter agent name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe your agent's role and capabilities"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={formData.tone} onValueChange={(value) => handleInputChange("tone", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tones.map((tone) => (
                    <SelectItem key={tone.value} value={tone.value}>
                      {tone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="primaryLanguage">Primary Language</Label>
              <Select
                value={formData.primaryLanguage}
                onValueChange={(value) => handleInputChange("primaryLanguage", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="introductoryStatement">Introductory Message</Label>
              <Textarea
                id="introductoryStatement"
                value={formData.introductoryStatement}
                onChange={(e) => handleInputChange("introductoryStatement", e.target.value)}
                placeholder="What should your agent say when greeting customers?"
                rows={3}
              />
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Quick Templates:</Label>
                <div className="flex flex-wrap gap-1">
                  {introTemplates.slice(0, 3).map((template, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-6 bg-transparent"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      Template {index + 1}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Personality Traits */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personality Traits</h3>

            <div className="space-y-4">
              <PersonalitySlider
                label="Friendliness"
                value={formData.friendliness}
                onChange={(value) => handlePersonalityChange("friendliness", value)}
                description="How warm and approachable"
              />
              <PersonalitySlider
                label="Formality"
                value={formData.formality}
                onChange={(value) => handlePersonalityChange("formality", value)}
                description="Professional vs casual tone"
              />
              <PersonalitySlider
                label="Enthusiasm"
                value={formData.enthusiasm}
                onChange={(value) => handlePersonalityChange("enthusiasm", value)}
                description="Energy and excitement level"
              />
              <PersonalitySlider
                label="Empathy"
                value={formData.empathy}
                onChange={(value) => handlePersonalityChange("empathy", value)}
                description="Understanding and compassion"
              />
              <PersonalitySlider
                label="Patience"
                value={formData.patience}
                onChange={(value) => handlePersonalityChange("patience", value)}
                description="Tolerance for difficult situations"
              />
              <PersonalitySlider
                label="Expertise"
                value={formData.expertise}
                onChange={(value) => handlePersonalityChange("expertise", value)}
                description="Technical knowledge confidence"
              />
            </div>
          </div>
        </div>

        {/* Integration Capabilities */}
        {integrations.length > 0 && (
          <div className="mt-6">
            <Separator className="mb-4" />
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Available Integrations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {integrations.map((integration) => (
                <Card key={integration.id} className="border-muted">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{integration.type}</Badge>
                      <span className="text-sm font-medium">{integration.name || integration.type}</span>
                    </div>
                    {integration.parsedCapabilities && Object.keys(integration.parsedCapabilities).length > 0 && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        {Object.entries(integration.parsedCapabilities).filter(([_, enabled]) => enabled).length}{" "}
                        capabilities enabled
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Update Agent
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
