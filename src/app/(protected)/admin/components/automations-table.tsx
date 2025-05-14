"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Automation {
  id: string
  name: string
  type: string
  active: boolean
  createdAt: string
  lastTriggered: string | null
  keywords: string[]
}

interface AutomationsTableClientProps {
  automations: Automation[]
  userId: string
}

export function AutomationsTableClient({ automations, userId }: AutomationsTableClientProps) {
  const [automationStates, setAutomationStates] = useState(
    automations.map((automation) => ({
      id: automation.id,
      active: automation.active,
    })),
  )

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Never"
    return new Date(dateString).toLocaleDateString()
  }

  const handleToggleActive = (id: string) => {
    setAutomationStates((prev) => prev.map((state) => (state.id === id ? { ...state, active: !state.active } : state)))
    // In a real implementation, you would call an API to update the automation status
    // For example: updateAutomationStatus(id, !automationStates.find(s => s.id === id)?.active)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Keywords</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Last Triggered</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {automations.map((automation) => {
          const state = automationStates.find((s) => s.id === automation.id)
          const isActive = state ? state.active : automation.active

          return (
            <TableRow key={automation.id}>
              <TableCell className="font-medium">{automation.name}</TableCell>
              <TableCell>{automation.type}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {automation.keywords.map((keyword, i) => (
                    <Badge key={i} variant="outline">
                      {keyword}
                    </Badge>
                  ))}
                  {automation.keywords.length === 0 && <span className="text-muted-foreground text-sm">None</span>}
                </div>
              </TableCell>
              <TableCell>{formatDate(automation.createdAt)}</TableCell>
              <TableCell>{formatDate(automation.lastTriggered)}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`status-${automation.id}`}
                    checked={isActive}
                    onCheckedChange={() => handleToggleActive(automation.id)}
                  />
                  <label htmlFor={`status-${automation.id}`} className="text-sm">
                    {isActive ? "Active" : "Inactive"}
                  </label>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/users/${userId}/automations/${automation.id}`}>View Details</Link>
                </Button>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
