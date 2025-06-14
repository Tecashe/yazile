"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AutomationCardMinimal } from "./automation-card-minimal"
import { AutomationCardCompact } from "./automation-card-compact"
import { AutomationCardModern } from "./automation-card-modern"
import { AutomationCardDashboard } from "./automation-card-dashboard"

// Mock data for demonstration
const mockAutomation = {
  id: "1",
  name: "Instagram Lead Generator",
  active: true,
  keywords: [
    { id: "1", automationId: "1", word: "marketing" },
    { id: "2", automationId: "1", word: "business" },
    { id: "3", automationId: "1", word: "growth" },
    { id: "4", automationId: "1", word: "startup" },
  ],
  createdAt: new Date(Date.now() - 86400000 * 3), // 3 days ago
  listener: {
    id: "1",
    listener: "SMARTAI",
    automationId: "1",
    prompt: "Respond to marketing inquiries",
    commentReply: null,
    dmCount: 24,
    commentCount: 12,
  },
}

const mockOptimisticAutomation = {
  ...mockAutomation,
  id: "2",
  name: "Creating New Automation...",
  _isOptimistic: true,
}

const mockInactiveAutomation = {
  ...mockAutomation,
  id: "3",
  name: "Paused Campaign",
  active: false,
  listener: {
    ...mockAutomation.listener,
    listener: "STANDARD",
    dmCount: 0,
  },
}

export default function AutomationVariationsDemo() {
  const [selectedVariation, setSelectedVariation] = useState("minimal")

  const variations = [
    { id: "minimal", name: "Minimal", component: AutomationCardMinimal },
    { id: "compact", name: "Compact", component: AutomationCardCompact },
    { id: "modern", name: "Modern", component: AutomationCardModern },
    { id: "dashboard", name: "Dashboard", component: AutomationCardDashboard },
  ]

  const handleDelete = () => {
    console.log("Delete automation")
  }

  const SelectedComponent = variations.find((v) => v.id === selectedVariation)?.component || AutomationCardMinimal

  return (
    <div className="space-y-8 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Automation Card Variations</h1>
        <p className="text-muted-foreground">Professional automation interface components with different styles</p>
      </div>

      {/* Variation Selector */}
      <div className="flex justify-center">
        <div className="flex gap-2 p-1 bg-muted rounded-lg">
          {variations.map((variation) => (
            <Button
              key={variation.id}
              variant={selectedVariation === variation.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedVariation(variation.id)}
            >
              {variation.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Demo Cards */}
      <div className="grid gap-6 max-w-4xl mx-auto">
        <div>
          <Badge className="mb-4">Active Automation</Badge>
          <SelectedComponent automation={mockAutomation} onDelete={handleDelete} pathname="/dashboard/automations" />
        </div>

        <div>
          <Badge variant="secondary" className="mb-4">
            Creating Automation
          </Badge>
          <SelectedComponent
            automation={mockOptimisticAutomation}
            onDelete={handleDelete}
            pathname="/dashboard/automations"
          />
        </div>

        <div>
          <Badge variant="outline" className="mb-4">
            Paused Automation
          </Badge>
          <SelectedComponent
            automation={mockInactiveAutomation}
            onDelete={handleDelete}
            pathname="/dashboard/automations"
          />
        </div>
      </div>
    </div>
  )
}
