// "use client"

// import { useState } from "react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Switch } from "@/components/ui/switch"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { PersonalitySlider } from "./personality-slider"
// import type { AgentTemplate, PersonalityTraits, LanguageSettings } from "@/types/ai-agents"
// import { getAgentTypeInfo } from "@/lib/agent-templates"
// import { Save, X } from "lucide-react"

// interface AgentCustomizationModalProps {
//   agent: AgentTemplate | null
//   isOpen: boolean
//   onClose: () => void
//   onSave: (customizedAgent: AgentTemplate) => void
// }

// export function AgentCustomizationModal({ agent, isOpen, onClose, onSave }: AgentCustomizationModalProps) {
//   const [customAgent, setCustomAgent] = useState<AgentTemplate | null>(agent)

//   if (!customAgent) return null

//   const updatePersonality = (trait: keyof PersonalityTraits, value: number) => {
//     setCustomAgent((prev) =>
//       prev
//         ? {
//             ...prev,
//             personality: {
//               ...prev.personality,
//               [trait]: value,
//             },
//           }
//         : null,
//     )
//   }

//   const updateLanguageSettings = (key: keyof LanguageSettings, value: any) => {
//     setCustomAgent((prev) =>
//       prev
//         ? {
//             ...prev,
//             languageSettings: {
//               ...prev.languageSettings,
//               [key]: value,
//             },
//           }
//         : null,
//     )
//   }

//   const handleSave = () => {
//     if (customAgent) {
//       onSave(customAgent)
//       onClose()
//     }
//   }

//   const languages = [
//     "English",
//     "Spanish",
//     "French",
//     "German",
//     "Italian",
//     "Portuguese",
//     "Chinese",
//     "Japanese",
//     "Korean",
//     "Arabic",
//   ]

//   const responseStyles = [
//     { value: "casual", label: "Casual & Friendly" },
//     { value: "professional", label: "Professional" },
//     { value: "friendly", label: "Warm & Friendly" },
//     { value: "formal", label: "Formal & Polite" },
//   ]

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-3">
//             <Avatar className="h-10 w-10">
//               <AvatarImage src={customAgent.avatar || "/placeholder.svg"} alt={customAgent.name} />
//               <AvatarFallback>{customAgent.name.slice(0, 2).toUpperCase()}</AvatarFallback>
//             </Avatar>
//             Customize {customAgent.name}
//           </DialogTitle>
//         </DialogHeader>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Basic Information */}
//           <div className="space-y-6">
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold">Basic Information</h3>

//               <div className="space-y-2">
//                 <Label htmlFor="name">Agent Name</Label>
//                 <Input
//                   id="name"
//                   value={customAgent.name}
//                   onChange={(e) => setCustomAgent((prev) => (prev ? { ...prev, name: e.target.value } : null))}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="description">Description</Label>
//                 <Textarea
//                   id="description"
//                   value={customAgent.description}
//                   onChange={(e) => setCustomAgent((prev) => (prev ? { ...prev, description: e.target.value } : null))}
//                   rows={3}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label>Agent Type</Label>
//                 <Select
//                   value={customAgent.agentType}
//                   onValueChange={(value) =>
//                     setCustomAgent((prev) => (prev ? { ...prev, agentType: value as any } : null))
//                   }
//                 >
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {[
//                       "customer-support",
//                       "sales-assistant",
//                       "technical-support",
//                       "social-media-manager",
//                       "personal-concierge",
//                       "appointment-scheduler",
//                       "general-assistant",
//                     ].map((type) => {
//                       const info = getAgentTypeInfo(type)
//                       return (
//                         <SelectItem key={type} value={type}>
//                           {info.icon} {info.title}
//                         </SelectItem>
//                       )
//                     })}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             {/* Language Settings */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold">Language Settings</h3>

//               <div className="space-y-2">
//                 <Label>Primary Language</Label>
//                 <Select
//                   value={customAgent.languageSettings.primaryLanguage}
//                   onValueChange={(value) => updateLanguageSettings("primaryLanguage", value)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {languages.map((lang) => (
//                       <SelectItem key={lang} value={lang}>
//                         {lang}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="flex items-center justify-between">
//                 <div className="space-y-1">
//                   <Label>Auto-detect Language</Label>
//                   <p className="text-sm text-muted-foreground">Automatically respond in the customer&apos;s language</p>
//                 </div>
//                 <Switch
//                   checked={customAgent.languageSettings.detectLanguage}
//                   onCheckedChange={(checked) => updateLanguageSettings("detectLanguage", checked)}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label>Response Style</Label>
//                 <Select
//                   value={customAgent.languageSettings.responseStyle}
//                   onValueChange={(value) => updateLanguageSettings("responseStyle", value)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {responseStyles.map((style) => (
//                       <SelectItem key={style.value} value={style.value}>
//                         {style.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </div>

//           {/* Personality Traits */}
//           <div className="space-y-6">
//             <h3 className="text-lg font-semibold">Personality Traits</h3>

//             <div className="space-y-6">
//               <PersonalitySlider
//                 label="Friendliness"
//                 value={customAgent.personality.friendliness}
//                 onChange={(value) => updatePersonality("friendliness", value)}
//                 description="How warm and approachable the agent sounds"
//                 icon="😊"
//               />

//               <PersonalitySlider
//                 label="Formality"
//                 value={customAgent.personality.formality}
//                 onChange={(value) => updatePersonality("formality", value)}
//                 description="How professional vs casual the communication style is"
//                 icon="👔"
//               />

//               <PersonalitySlider
//                 label="Enthusiasm"
//                 value={customAgent.personality.enthusiasm}
//                 onChange={(value) => updatePersonality("enthusiasm", value)}
//                 description="How energetic and excited the agent sounds"
//                 icon="🎉"
//               />

//               <PersonalitySlider
//                 label="Empathy"
//                 value={customAgent.personality.empathy}
//                 onChange={(value) => updatePersonality("empathy", value)}
//                 description="How understanding and compassionate responses are"
//                 icon="❤️"
//               />

//               <PersonalitySlider
//                 label="Humor"
//                 value={customAgent.personality.humor}
//                 onChange={(value) => updatePersonality("humor", value)}
//                 description="How often the agent uses jokes or light-hearted comments"
//                 icon="😄"
//               />

//               <PersonalitySlider
//                 label="Patience"
//                 value={customAgent.personality.patience}
//                 onChange={(value) => updatePersonality("patience", value)}
//                 description="How well the agent handles difficult or repetitive questions"
//                 icon="🧘"
//               />

//               <PersonalitySlider
//                 label="Expertise"
//                 value={customAgent.personality.expertise}
//                 onChange={(value) => updatePersonality("expertise", value)}
//                 description="How knowledgeable and authoritative the agent sounds"
//                 icon="🎓"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex justify-end gap-3 pt-6 border-t">
//           <Button variant="outline" onClick={onClose}>
//             <X className="h-4 w-4 mr-2" />
//             Cancel
//           </Button>
//           <Button onClick={handleSave}>
//             <Save className="h-4 w-4 mr-2" />
//             Save Agent
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PersonalitySlider } from "./personality-slider"
import { useToast } from "@/hooks/use-toast"
import type { AgentTemplate, PersonalityTraits, LanguageSettings } from "@/types/ai-agents"
import { getAgentTypeInfo } from "@/lib/agent-templates"
import { getAvailableIntegrations, generateAgentWithAI } from "@/actions/ai-agents"
import { Save, X, Loader2, Sparkles } from "lucide-react"

interface AgentCustomizationModalProps {
  agent: AgentTemplate | null
  isOpen: boolean
  onClose: () => void
  onSave: (customizedAgent: AgentTemplate) => void
  businessName?: string
  businessType?: string
  businessDescription?: string
}

export function AgentCustomizationModal({
  agent,
  isOpen,
  onClose,
  onSave,
  businessName,
  businessType,
  businessDescription,
}: AgentCustomizationModalProps) {
  const [customAgent, setCustomAgent] = useState<AgentTemplate | null>(agent)
  const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false)
  const [availableIntegrations, setAvailableIntegrations] = useState<any[]>([])
  const { toast } = useToast()

  useEffect(() => {
    setCustomAgent(agent)
  }, [agent])

  useEffect(() => {
    if (isOpen) {
      loadIntegrations()
    }
  }, [isOpen])

  const loadIntegrations = async () => {
    try {
      const result = await getAvailableIntegrations()
      if (result.status === 200) {
        setAvailableIntegrations(result.data)
      }
    } catch (error) {
      console.error("Error loading integrations:", error)
    }
  }

  if (!customAgent) return null

  const introTemplates = [
    `Hi, I'm ${customAgent.name} from ${businessName || "our company"}. How can I help you today?`,
    `Hello! I'm ${customAgent.name}, your AI assistant at ${businessName || "our company"}. What can I do for you?`,
    `Welcome! I'm ${customAgent.name} and I'm here to help you with anything related to ${businessName || "our services"}. How may I assist you?`,
    `Hi there! ${customAgent.name} here from ${businessName || "our team"}. I'm ready to help with your questions!`,
    `Greetings! I'm ${customAgent.name}, your dedicated AI assistant. How can I make your experience with ${businessName || "us"} better today?`,
  ]

  const toneOptions = [
    { value: "professional", label: "Professional" },
    { value: "friendly", label: "Friendly" },
    { value: "casual", label: "Casual" },
    { value: "formal", label: "Formal" },
    { value: "enthusiastic", label: "Enthusiastic" },
    { value: "empathetic", label: "Empathetic" },
  ]

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

  const handleGenerateWithAI = async () => {
    if (!businessName || !businessType || !businessDescription) {
      toast({
        title: "Missing Information",
        description: "Business information is required for AI generation.",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingWithAI(true)

    try {
      const result = await generateAgentWithAI({
        businessName,
        businessType,
        businessDescription,
        integrations: availableIntegrations,
      })

      if (result.status === 200) {
        const generatedAgent = result.data

        // Update the current agent with AI-generated data
        setCustomAgent((prev) =>
          prev
            ? {
                ...prev,
                name: generatedAgent.name,
                description: generatedAgent.description,
                agentType: generatedAgent.agentType,
                tone: generatedAgent.tone,
                introductoryStatement: generatedAgent.introductoryStatement,
                personality: generatedAgent.personality,
                languageSettings: generatedAgent.languageSettings,
              }
            : null,
        )

        toast({
          title: "AI Generation Complete!",
          description: "Your agent has been customized based on your business profile.",
        })
      } else {
        toast({
          title: "AI Generation Failed",
          description: result.error || "Failed to generate agent with AI",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error generating with AI:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred during AI generation.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingWithAI(false)
    }
  }

  const handleSave = () => {
    if (customAgent) {
      onSave(customAgent)
      onClose()
    }
  }

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
                <Label>Tone</Label>
                <Select
                  value={customAgent.tone || "professional"}
                  onValueChange={(value) => setCustomAgent((prev) => (prev ? { ...prev, tone: value } : null))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {toneOptions.map((tone) => (
                      <SelectItem key={tone.value} value={tone.value}>
                        {tone.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Introductory Statement</h3>

              <div className="space-y-2">
                <Label htmlFor="introStatement">Custom Introduction</Label>
                <Textarea
                  id="introStatement"
                  value={customAgent.introductoryStatement || introTemplates[0]}
                  onChange={(e) =>
                    setCustomAgent((prev) => (prev ? { ...prev, introductoryStatement: e.target.value } : null))
                  }
                  rows={3}
                  placeholder="How should your agent introduce itself?"
                />
              </div>

              <div className="space-y-2">
                <Label>Quick Templates</Label>
                <div className="grid gap-2">
                  {introTemplates.slice(0, 3).map((template, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-left justify-start h-auto p-3 bg-transparent"
                      onClick={() =>
                        setCustomAgent((prev) => (prev ? { ...prev, introductoryStatement: template } : null))
                      }
                    >
                      <div className="text-xs text-muted-foreground truncate">{template}</div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {availableIntegrations.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Available Integrations</h3>
                <div className="grid gap-2">
                  {availableIntegrations.map((integration) => (
                    <div key={integration.id} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">{integration.name}</span>
                      <span className="text-xs text-muted-foreground">({integration.type})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                  <p className="text-sm text-muted-foreground">Automatically respond in the customer&apos;s language</p>
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
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Personality Traits</h3>
              <Button variant="outline" size="sm" disabled={isGeneratingWithAI} onClick={handleGenerateWithAI}>
                {isGeneratingWithAI ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI Generate
                  </>
                )}
              </Button>
            </div>

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
