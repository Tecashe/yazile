"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { AgentTemplate } from "@/types/ai-agents"
import { getAgentTypeInfo } from "@/lib/agent-templates"
import { Edit, Star } from "lucide-react"

interface AgentCardProps {
  agent: AgentTemplate
  isSelected?: boolean
  onSelect: () => void
  onCustomize: () => void
}

export function AgentCard({ agent, isSelected, onSelect, onCustomize }: AgentCardProps) {
  const typeInfo = getAgentTypeInfo(agent.agentType)

  return (
    <Card
      className={`group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
        isSelected ? "ring-2 ring-primary shadow-lg" : ""
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-20 w-20 border-2 border-border">
              <AvatarImage src={agent.avatar || "/placeholder.svg"} alt={agent.name} />
              <AvatarFallback className="text-lg font-semibold">{agent.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            {isSelected && (
              <div className="absolute -top-1 -right-1 bg-primary rounded-full p-1">
                <Star className="h-3 w-3 text-primary-foreground fill-current" />
              </div>
            )}
          </div>

          {/* Name and Type */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{agent.name}</h3>
            <Badge variant="secondary" className="text-xs">
              {typeInfo.icon} {typeInfo.title}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">{agent.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 justify-center">
            {agent.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Personality Preview */}
          <div className="w-full space-y-2">
            <div className="text-xs text-muted-foreground">Personality Traits</div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex flex-col items-center">
                <div className="text-primary font-medium">{agent.personality.friendliness}/10</div>
                <div className="text-muted-foreground">Friendly</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-primary font-medium">{agent.personality.empathy}/10</div>
                <div className="text-muted-foreground">Empathy</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-primary font-medium">{agent.personality.expertise}/10</div>
                <div className="text-muted-foreground">Expert</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 w-full">
            <Button
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation()
                onSelect()
              }}
            >
              {isSelected ? "Selected" : "Select"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onCustomize()
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
