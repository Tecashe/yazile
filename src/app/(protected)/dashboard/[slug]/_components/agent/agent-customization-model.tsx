"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PersonalitySlider } from "./personality-slider"
import type { AgentTemplate, PersonalityTraits, LanguageSettings } from "@/types/ai-agents"
import { getAgentTypeInfo } from "@/lib/agent-templates"
import { Save, X } from "lucide-react"

interface AgentCustomizationModalProps {
  agent: AgentTemplate | null
  isOpen: boolean
  onClose: () => void
  onSave: (customizedAgent: AgentTemplate) => void
}

export function AgentCustomizationModal({ agent, isOpen, onClose, onSave }: AgentCustomizationModalProps) {
  const [customAgent, setCustomAgent] = useState<AgentTemplate | null>(agent)

  if (!customAgent) return null

  const updatePersonality = (trait: keyof PersonalityTraits, value: number) => {
    setCustomAgent((prev) =>
      prev
        ? {
            ...prev,
            personality: {
              ...prev.personality,
              [trait]: value,
            },
          }
        : null,
    )
  }

  const updateLanguageSettings = (key: keyof LanguageSettings, value: any) => {
    setCustomAgent((prev) =>
      prev
        ? {
            ...prev,
            languageSettings: {
              ...prev.languageSettings,
              [key]: value,
            },
          }
        : null,
    )
  }

  const handleSave = () => {
    if (customAgent) {
      onSave(customAgent)
      onClose()
    }
  }

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

  const responseStyles = [
    { value: "casual", label: "Casual & Friendly" },
    { value: "professional", label: "Professional" },
    { value: "friendly", label: "Warm & Friendly" },
    { value: "formal", label: "Formal & Polite" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={customAgent.avatar || "/placeholder.svg"} alt={customAgent.name} />
              <AvatarFallback>{customAgent.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            Customize {customAgent.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>

              <div className="space-y-2">
                <Label htmlFor="name">Agent Name</Label>
                <Input
                  id="name"
                  value={customAgent.name}
                  onChange={(e) => setCustomAgent((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={customAgent.description}
                  onChange={(e) => setCustomAgent((prev) => (prev ? { ...prev, description: e.target.value } : null))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Agent Type</Label>
                <Select
                  value={customAgent.agentType}
                  onValueChange={(value) =>
                    setCustomAgent((prev) => (prev ? { ...prev, agentType: value as any } : null))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "customer-support",
                      "sales-assistant",
                      "technical-support",
                      "social-media-manager",
                      "personal-concierge",
                      "appointment-scheduler",
                      "general-assistant",
                    ].map((type) => {
                      const info = getAgentTypeInfo(type)
                      return (
                        <SelectItem key={type} value={type}>
                          {info.icon} {info.title}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Language Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Language Settings</h3>

              <div className="space-y-2">
                <Label>Primary Language</Label>
                <Select
                  value={customAgent.languageSettings.primaryLanguage}
                  onValueChange={(value) => updateLanguageSettings("primaryLanguage", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auto-detect Language</Label>
                  <p className="text-sm text-muted-foreground">Automatically respond in the customer's language</p>
                </div>
                <Switch
                  checked={customAgent.languageSettings.detectLanguage}
                  onCheckedChange={(checked) => updateLanguageSettings("detectLanguage", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Response Style</Label>
                <Select
                  value={customAgent.languageSettings.responseStyle}
                  onValueChange={(value) => updateLanguageSettings("responseStyle", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {responseStyles.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Personality Traits */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Personality Traits</h3>

            <div className="space-y-6">
              <PersonalitySlider
                label="Friendliness"
                value={customAgent.personality.friendliness}
                onChange={(value) => updatePersonality("friendliness", value)}
                description="How warm and approachable the agent sounds"
                icon="😊"
              />

              <PersonalitySlider
                label="Formality"
                value={customAgent.personality.formality}
                onChange={(value) => updatePersonality("formality", value)}
                description="How professional vs casual the communication style is"
                icon="👔"
              />

              <PersonalitySlider
                label="Enthusiasm"
                value={customAgent.personality.enthusiasm}
                onChange={(value) => updatePersonality("enthusiasm", value)}
                description="How energetic and excited the agent sounds"
                icon="🎉"
              />

              <PersonalitySlider
                label="Empathy"
                value={customAgent.personality.empathy}
                onChange={(value) => updatePersonality("empathy", value)}
                description="How understanding and compassionate responses are"
                icon="❤️"
              />

              <PersonalitySlider
                label="Humor"
                value={customAgent.personality.humor}
                onChange={(value) => updatePersonality("humor", value)}
                description="How often the agent uses jokes or light-hearted comments"
                icon="😄"
              />

              <PersonalitySlider
                label="Patience"
                value={customAgent.personality.patience}
                onChange={(value) => updatePersonality("patience", value)}
                description="How well the agent handles difficult or repetitive questions"
                icon="🧘"
              />

              <PersonalitySlider
                label="Expertise"
                value={customAgent.personality.expertise}
                onChange={(value) => updatePersonality("expertise", value)}
                description="How knowledgeable and authoritative the agent sounds"
                icon="🎓"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Agent
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
