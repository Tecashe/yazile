"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { LeadCard } from "./lead-card"
import { Loader, PlusCircle } from "lucide-react"
import { WorkflowModal } from "./workflow-modal"
import type { Lead, N8nWorkflowConfig } from "@prisma/client"

interface LeadStats {
  total: number
  qualified: number
  nurturing: number
  new: number
  qualifying: number
  converted: number
  disqualified: number
  lost: number
  averageScore: number
}

interface LeadDashboardProps {
  leads: (Lead & {
    qualificationData?: any
    interactions?: any[]
  })[]
  stats: LeadStats
  workflows: N8nWorkflowConfig[]
}

export function LeadDashboard({ leads, stats, workflows }: LeadDashboardProps) {
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false)

  // Filter leads based on selection
  const filteredLeads = leads.filter((lead) => {
    if (filter === "all") return true
    return lead.status.toLowerCase() === filter.toLowerCase()
  })

  // Chart data
  const statusChartData = [
    { name: "Qualified", value: stats.qualified },
    { name: "Nurturing", value: stats.nurturing },
    { name: "Qualifying", value: stats.qualifying },
    { name: "New", value: stats.new },
    { name: "Converted", value: stats.converted },
  ]

  const scoreDistribution = [
    { name: "0-25", value: leads.filter((l) => l.score < 25).length },
    { name: "25-50", value: leads.filter((l) => l.score >= 25 && l.score < 50).length },
    { name: "50-75", value: leads.filter((l) => l.score >= 50 && l.score < 75).length },
    { name: "75-100", value: leads.filter((l) => l.score >= 75).length },
  ]

  // Handle sending lead to n8n
  const handleSendToN8n = async (leadId: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/leads/${leadId}/send-to-n8n`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      })

      if (!response.ok) {
        throw new Error("Failed to send lead to n8n")
      }

      // Update local state to mark the lead as sent
      // This is a simplified approach; in a real app you might want to refetch the data
      window.location.reload()
    } catch (error) {
      console.error("Error sending lead to n8n:", error)
      setError("Failed to send lead to n8n. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Lead Management</h1>
        <Button onClick={() => setIsWorkflowModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add n8n Workflow
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Average score: {stats.averageScore.toFixed(1)}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.qualified}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total ? `${((stats.qualified / stats.total) * 100).toFixed(1)}%` : "0%"} of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Nurturing Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.nurturing}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total ? `${((stats.nurturing / stats.total) * 100).toFixed(1)}%` : "0%"} of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.new}</div>
            <p className="text-xs text-muted-foreground">Require qualification</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="leads">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="leads">Lead List</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Leads</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="nurturing">Nurturing</SelectItem>
                <SelectItem value="qualifying">Qualifying</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="leads" className="mt-4">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredLeads.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredLeads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} onSendToN8n={handleSendToN8n} />
              ))}
            </div>
          ) : (
            <div className="text-center p-8">
              <h3 className="font-medium text-lg">No leads found</h3>
              <p className="text-muted-foreground mt-1">No leads match the current filter criteria.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Lead Status Distribution</CardTitle>
                <CardDescription>Breakdown of leads by qualification status</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusChartData}>
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
                <CardDescription>Number of leads by score range</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoreDistribution}>
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <WorkflowModal isOpen={isWorkflowModalOpen} onClose={() => setIsWorkflowModalOpen(false)} workflows={workflows} />
    </div>
  )
}
