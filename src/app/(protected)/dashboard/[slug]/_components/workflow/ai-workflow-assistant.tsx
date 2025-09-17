"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Sparkles, Activity, Target, Bot } from "lucide-react"
import type { Workflow } from "@/hooks/use-workflows"
import type { Integration } from "@/hooks/use-integrations"

interface AIWorkflowAssistantProps {
  workflow: Workflow
  integrations: Integration[]
  onWorkflowUpdate: (updates: Partial<Workflow>) => void
}

interface WorkflowSuggestion {
  name: string
  description: string
  steps: any[]
  reasoning: string
}

export function AIWorkflowAssistant({ workflow, integrations, onWorkflowUpdate }: AIWorkflowAssistantProps) {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [suggestions, setSuggestions] = useState<WorkflowSuggestion[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const generateWorkflow = useCallback(async () => {
    if (!prompt.trim()) {
      toast({
        title: "Input Required",
        description: "Please describe what you want your workflow to do",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setSuggestions([])

    try {
      const response = await fetch("/api/ai/generate-workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          integrations: integrations.filter((i) => i.isActive),
          currentWorkflow: workflow,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions)
        toast({
          title: "Workflow Generated",
          description: `Generated ${data.suggestions.length} workflow suggestion(s)`,
        })
      } else {
        toast({
          title: "No Suggestions",
          description: "AI couldn't generate workflow suggestions. Try being more specific.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to generate workflow:", error)
      toast({
        title: "Generation Failed",
        description: "Failed to generate workflow. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }, [prompt, integrations, workflow])

  const applySuggestion = useCallback(
    (suggestion: WorkflowSuggestion) => {
      onWorkflowUpdate({
        name: suggestion.name,
        description: suggestion.description,
        steps: suggestion.steps,
        aiGenerated: true,
        aiPrompt: prompt,
      })

      setSuggestions([])
      setPrompt("")

      toast({
        title: "Workflow Applied",
        description: `Applied "${suggestion.name}" to your workflow`,
      })
    },
    [onWorkflowUpdate, prompt],
  )

  const handlePromptChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value)
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        generateWorkflow()
      }
    },
    [generateWorkflow],
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4" />
          AI Assistant
        </CardTitle>
        <CardDescription className="text-xs">Describe your automation needs in natural language</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="workflow-prompt" className="text-sm font-medium">
            What should your AI agent do?
          </Label>
          <Textarea
            id="workflow-prompt"
            ref={textareaRef}
            placeholder="e.g., When someone pays via Stripe, book them a meeting in Calendly and send a confirmation email through SendGrid"
            value={prompt}
            onChange={handlePromptChange}
            onKeyDown={handleKeyDown}
            className="min-h-[100px] resize-none"
            disabled={isGenerating}
          />
          <p className="text-xs text-muted-foreground">Press Cmd/Ctrl + Enter to generate</p>
        </div>

        <Button onClick={generateWorkflow} disabled={isGenerating || !prompt.trim()} className="w-full" size="sm">
          {isGenerating ? (
            <>
              <Activity className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Workflow
            </>
          )}
        </Button>

        {suggestions.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">AI Suggestions:</Label>
            {suggestions.map((suggestion, index) => (
              <Card
                key={index}
                className="p-3 cursor-pointer hover:bg-muted/50 transition-colors border-dashed"
                onClick={() => applySuggestion(suggestion)}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Bot className="h-3 w-3 text-primary" />
                    <h4 className="text-sm font-medium">{suggestion.name}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Target className="h-3 w-3" />
                      {suggestion.steps.length} steps
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Click to apply
                    </Badge>
                  </div>
                  {suggestion.reasoning && (
                    <p className="text-xs text-muted-foreground italic">"{suggestion.reasoning}"</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {integrations.filter((i) => i.isActive).length === 0 && (
          <div className="text-center py-4 border border-dashed rounded-lg">
            <p className="text-sm text-muted-foreground">Enable integrations to unlock AI workflow generation</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
