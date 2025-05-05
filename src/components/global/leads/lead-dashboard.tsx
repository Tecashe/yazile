// "use client"

// import { useState } from "react"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { ArrowUpRight, BarChart, Plus, RefreshCw, Send } from "lucide-react"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { Progress } from "@/components/ui/progress"
// import LeadDetailModal from "./lead-detail-modal"
// import WorkflowModal from "./workflow-modal"

// export default function LeadDashboard({ leads, leadStats, workflows }) {
//   const [selectedLead, setSelectedLead] = useState(null)
//   const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)
//   const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false)

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "NEW":
//         return "bg-blue-500"
//       case "QUALIFYING":
//         return "bg-yellow-500"
//       case "QUALIFIED":
//         return "bg-green-500"
//       case "DISQUALIFIED":
//         return "bg-red-500"
//       case "CONVERTED":
//         return "bg-purple-500"
//       case "NURTURING":
//         return "bg-indigo-500"
//       case "LOST":
//         return "bg-gray-500"
//       default:
//         return "bg-gray-500"
//     }
//   }

//   const handleSendToN8n = async (leadId, workflowId) => {
//     try {
//       const response = await fetch("/api/n8n/send-lead", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ leadId, workflowId }),
//       })

//       if (!response.ok) {
//         throw new Error("Failed to send lead to n8n")
//       }

//       // Refresh the page to show updated data
//       window.location.reload()
//     } catch (error) {
//       console.error("Error sending lead to n8n:", error)
//       alert("Error sending lead to n8n: " + error.message)
//     }
//   }

//   return (
//     <div className="container mx-auto py-6">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-3xl font-bold">Lead Qualification Dashboard</h1>
//         <div className="flex gap-2">
//           <Button variant="outline" onClick={() => setIsWorkflowModalOpen(true)}>
//             <Plus className="mr-2 h-4 w-4" />
//             Add Workflow
//           </Button>
//           <Button>
//             <RefreshCw className="mr-2 h-4 w-4" />
//             Refresh
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
//         <Card>
//           <CardContent className="p-4 flex flex-col items-center justify-center">
//             <p className="text-sm text-muted-foreground">Total Leads</p>
//             <h2 className="text-3xl font-bold">{leadStats.total}</h2>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4 flex flex-col items-center justify-center">
//             <p className="text-sm text-muted-foreground">New</p>
//             <h2 className="text-3xl font-bold">{leadStats.new}</h2>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4 flex flex-col items-center justify-center">
//             <p className="text-sm text-muted-foreground">Qualifying</p>
//             <h2 className="text-3xl font-bold">{leadStats.qualifying}</h2>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4 flex flex-col items-center justify-center">
//             <p className="text-sm text-muted-foreground">Qualified</p>
//             <h2 className="text-3xl font-bold">{leadStats.qualified}</h2>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4 flex flex-col items-center justify-center">
//             <p className="text-sm text-muted-foreground">Converted</p>
//             <h2 className="text-3xl font-bold">{leadStats.converted}</h2>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4 flex flex-col items-center justify-center">
//             <p className="text-sm text-muted-foreground">Disqualified</p>
//             <h2 className="text-3xl font-bold">{leadStats.disqualified}</h2>
//           </CardContent>
//         </Card>
//       </div>

//       <Tabs defaultValue="leads">
//         <TabsList className="mb-4">
//           <TabsTrigger value="leads">Leads</TabsTrigger>
//           <TabsTrigger value="workflows">n8n Workflows</TabsTrigger>
//           <TabsTrigger value="analytics">Analytics</TabsTrigger>
//         </TabsList>

//         <TabsContent value="leads">
//           <Card>
//             <CardHeader>
//               <CardTitle>Lead Management</CardTitle>
//               <CardDescription>View and manage your leads from Instagram conversations</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Lead</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Score</TableHead>
//                     <TableHead>Last Contact</TableHead>
//                     <TableHead>Sentiment</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {leads.map((lead) => (
//                     <TableRow key={lead.id}>
//                       <TableCell>
//                         <div className="flex items-center gap-2">
//                           <Avatar>
//                             <AvatarFallback>{lead.name ? lead.name.charAt(0) : "U"}</AvatarFallback>
//                           </Avatar>
//                           <div>
//                             <p className="font-medium">{lead.name || "Unknown User"}</p>
//                             <p className="text-sm text-muted-foreground">{lead.email || lead.instagramUserId}</p>
//                           </div>
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex items-center gap-2">
//                           <Progress value={lead.score * 10} className="w-20" />
//                           <span>{lead.score}/10</span>
//                         </div>
//                       </TableCell>
//                       <TableCell>{new Date(lead.lastContactDate).toLocaleDateString()}</TableCell>
//                       <TableCell>
//                         {lead.qualificationData?.sentimentScore > 0 ? (
//                           <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
//                             Positive
//                           </Badge>
//                         ) : lead.qualificationData?.sentimentScore < 0 ? (
//                           <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
//                             Negative
//                           </Badge>
//                         ) : (
//                           <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
//                             Neutral
//                           </Badge>
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex items-center gap-2">
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             onClick={() => {
//                               setSelectedLead(lead)
//                               setIsLeadModalOpen(true)
//                             }}
//                           >
//                             <ArrowUpRight className="h-4 w-4" />
//                           </Button>
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             onClick={() => handleSendToN8n(lead.id, workflows[0]?.workflowId)}
//                             disabled={!workflows.length || lead.sentToN8n}
//                           >
//                             <Send className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="workflows">
//           <Card>
//             <CardHeader>
//               <CardTitle>n8n Workflows</CardTitle>
//               <CardDescription>Manage your n8n workflows for lead processing</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Name</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Executions</TableHead>
//                     <TableHead>Success Rate</TableHead>
//                     <TableHead>Last Executed</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {workflows.map((workflow) => (
//                     <TableRow key={workflow.id}>
//                       <TableCell>
//                         <div className="font-medium">{workflow.name}</div>
//                         <div className="text-sm text-muted-foreground">{workflow.description}</div>
//                       </TableCell>
//                       <TableCell>
//                         {workflow.isActive ? (
//                           <Badge className="bg-green-500">Active</Badge>
//                         ) : (
//                           <Badge className="bg-gray-500">Inactive</Badge>
//                         )}
//                       </TableCell>
//                       <TableCell>{workflow.executionCount}</TableCell>
//                       <TableCell>
//                         {workflow.executionCount > 0
//                           ? `${Math.round((workflow.successCount / workflow.executionCount) * 100)}%`
//                           : "N/A"}
//                       </TableCell>
//                       <TableCell>
//                         {workflow.lastExecuted ? new Date(workflow.lastExecuted).toLocaleDateString() : "Never"}
//                       </TableCell>
//                       <TableCell>
//                         <Button variant="ghost" size="icon">
//                           <ArrowUpRight className="h-4 w-4" />
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="analytics">
//           <Card>
//             <CardHeader>
//               <CardTitle>Lead Analytics</CardTitle>
//               <CardDescription>Analyze your lead qualification performance</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="h-80 flex items-center justify-center">
//                 <BarChart className="h-16 w-16 text-muted-foreground" />
//                 <p className="ml-4 text-muted-foreground">Analytics dashboard coming soon</p>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>

//       {isLeadModalOpen && selectedLead && (
//         <LeadDetailModal
//           lead={selectedLead}
//           isOpen={isLeadModalOpen}
//           onClose={() => setIsLeadModalOpen(false)}
//           workflows={workflows}
//           onSendToN8n={handleSendToN8n}
//         />
//       )}

//       {isWorkflowModalOpen && (
//         <WorkflowModal isOpen={isWorkflowModalOpen} onClose={() => setIsWorkflowModalOpen(false)} />
//       )}
//     </div>
//   )
// }

// "use client"

// import { useState, useEffect } from "react"
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { LeadCard } from "./lead-card"
// import { Loader } from "lucide-react"

// interface Lead {
//   id: string
//   customerId: string
//   status: string
//   score: number
//   totalInteractions: number
//   lastInteractionAt: Date
//   createdAt: Date
//   sentToN8n: boolean
//   qualificationData?: {
//     engagementScore: number
//     intentScore: number
//     sentimentScore: number
//     aiAnalysis: any
//   } | null
//   interactions?: Array<{
//     id: string
//     content: string
//     timestamp: Date
//   }>
// }

// interface LeadSummary {
//   total: number
//   qualified: number
//   nurturing: number
//   engaged: number
//   new: number
//   averageScore: number
// }

// interface LeadDashboardProps {
//   userId: string
//   onSendToN8n?: (leadId: string) => Promise<void>
// }

// export function LeadDashboard({ userId, onSendToN8n }: LeadDashboardProps) {
//   const [leads, setLeads] = useState<Lead[]>([])
//   const [summary, setSummary] = useState<LeadSummary>({
//     total: 0,
//     qualified: 0,
//     nurturing: 0,
//     engaged: 0,
//     new: 0,
//     averageScore: 0,
//   })
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [filter, setFilter] = useState("all")

//   // Fetch leads data
//   useEffect(() => {
//     const fetchLeads = async () => {
//       try {
//         setLoading(true)
//         setError(null)

//         const response = await fetch(`/api/leads?userId=${userId}`)

//         if (!response.ok) {
//           throw new Error(`Error fetching leads: ${response.status}`)
//         }

//         const data = await response.json()

//         setLeads(data.leads)
//         setSummary(data.summary)
//       } catch (error) {
//         console.error("Error fetching leads:", error)
//         setError("Failed to load leads. Please try again later.")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchLeads()
//   }, [userId])

//   // Filter leads based on selection
//   const filteredLeads = leads.filter((lead) => {
//     if (filter === "all") return true
//     if (filter === "qualified") return lead.status === "QUALIFIED"
//     if (filter === "nurturing") return lead.status === "NURTURING"
//     if (filter === "engaged") return lead.status === "ENGAGED"
//     if (filter === "new") return lead.status === "NEW"
//     return true
//   })

//   // Chart data
//   const statusChartData = [
//     { name: "Qualified", value: summary.qualified },
//     { name: "Nurturing", value: summary.nurturing },
//     { name: "Engaged", value: summary.engaged },
//     { name: "New", value: summary.new },
//   ]

//   const scoreDistribution = [
//     { name: "0-25", value: leads.filter((l) => l.score < 25).length },
//     { name: "25-50", value: leads.filter((l) => l.score >= 25 && l.score < 50).length },
//     { name: "50-75", value: leads.filter((l) => l.score >= 50 && l.score < 75).length },
//     { name: "75-100", value: leads.filter((l) => l.score >= 75).length },
//   ]

//   // Handle sending lead to n8n
//   const handleSendToN8n = async (leadId: string) => {
//     if (!onSendToN8n) return

//     try {
//       await onSendToN8n(leadId)

//       // Update local state to mark the lead as sent
//       setLeads(leads.map((lead) => (lead.id === leadId ? { ...lead, sentToN8n: true } : lead)))
//     } catch (error) {
//       console.error("Error sending lead to n8n:", error)
//     }
//   }

//   return (
//     <div className="space-y-4">
//       {error && (
//         <Alert variant="destructive">
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{summary.total}</div>
//             <p className="text-xs text-muted-foreground">Average score: {summary.averageScore.toFixed(1)}%</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{summary.qualified}</div>
//             <p className="text-xs text-muted-foreground">
//               {summary.total ? `${((summary.qualified / summary.total) * 100).toFixed(1)}%` : "0%"} of total
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium">Nurturing Leads</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{summary.nurturing}</div>
//             <p className="text-xs text-muted-foreground">
//               {summary.total ? `${((summary.nurturing / summary.total) * 100).toFixed(1)}%` : "0%"} of total
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium">New Leads</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{summary.new + summary.engaged}</div>
//             <p className="text-xs text-muted-foreground">Require nurturing</p>
//           </CardContent>
//         </Card>
//       </div>

//       <Tabs defaultValue="leads">
//         <div className="flex items-center justify-between">
//           <TabsList>
//             <TabsTrigger value="leads">Lead List</TabsTrigger>
//             <TabsTrigger value="analytics">Analytics</TabsTrigger>
//           </TabsList>

//           <div className="flex items-center gap-2">
//             <Select value={filter} onValueChange={setFilter}>
//               <SelectTrigger className="w-[180px]">
//                 <SelectValue placeholder="Filter by status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Leads</SelectItem>
//                 <SelectItem value="qualified">Qualified</SelectItem>
//                 <SelectItem value="nurturing">Nurturing</SelectItem>
//                 <SelectItem value="engaged">Engaged</SelectItem>
//                 <SelectItem value="new">New</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         <TabsContent value="leads" className="mt-4">
//           {loading ? (
//             <div className="flex justify-center items-center h-48">
//               <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
//             </div>
//           ) : filteredLeads.length > 0 ? (
//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//               {filteredLeads.map((lead) => (
//                 <LeadCard key={lead.id} lead={lead} onSendToN8n={handleSendToN8n} />
//               ))}
//             </div>
//           ) : (
//             <div className="text-center p-8">
//               <h3 className="font-medium text-lg">No leads found</h3>
//               <p className="text-muted-foreground mt-1">No leads match the current filter criteria.</p>
//             </div>
//           )}
//         </TabsContent>

//         <TabsContent value="analytics" className="mt-4">
//           <div className="grid gap-4 md:grid-cols-2">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Lead Status Distribution</CardTitle>
//                 <CardDescription>Breakdown of leads by qualification status</CardDescription>
//               </CardHeader>
//               <CardContent className="h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={statusChartData}>
//                     <XAxis dataKey="name" />
//                     <YAxis allowDecimals={false} />
//                     <Tooltip />
//                     <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Score Distribution</CardTitle>
//                 <CardDescription>Number of leads by score range</CardDescription>
//               </CardHeader>
//               <CardContent className="h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={scoreDistribution}>
//                     <XAxis dataKey="name" />
//                     <YAxis allowDecimals={false} />
//                     <Tooltip />
//                     <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }



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
import type { Lead, LeadStats } from "@/types/lead"
import WorkflowModal from "./workflow-modal"

interface LeadDashboardProps {
  leads: Lead[]
  leadStats: LeadStats
  workflows: any[]
}

export default function LeadDashboard({ leads, leadStats, workflows }: LeadDashboardProps) {
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false)

  // Filter leads based on selection
  const filteredLeads = leads.filter((lead) => {
    if (filter === "all") return true
    if (filter === "qualified") return lead.status === "QUALIFIED"
    if (filter === "nurturing") return lead.status === "NURTURING"
    if (filter === "engaged") return lead.status === "ENGAGED"
    if (filter === "new") return lead.status === "NEW"
    return true
  })

  // Chart data
  const statusChartData = [
    { name: "Qualified", value: leadStats.qualified },
    { name: "Nurturing", value: leadStats.qualifying },
    { name: "New", value: leadStats.new },
    { name: "Converted", value: leadStats.converted },
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

      const response = await fetch("/api/n8n/send-lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leadId,
          workflowId: workflows[0]?.workflowId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send lead to n8n")
      }

      // Update local state to mark the lead as sent
      // This is a simplified approach; in a real app you might want to refetch the data
      const updatedLeads = leads.map((lead) => (lead.id === leadId ? { ...lead, sentToN8n: true } : lead))
      // Would need to update the leads state here if we were managing it in this component
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
            <div className="text-2xl font-bold">{leadStats.total}</div>
            <p className="text-xs text-muted-foreground">
              Average score:{" "}
              {leads.length > 0 ? (leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length).toFixed(1) : 0}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadStats.qualified}</div>
            <p className="text-xs text-muted-foreground">
              {leadStats.total ? `${((leadStats.qualified / leadStats.total) * 100).toFixed(1)}%` : "0%"} of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Nurturing Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadStats.qualifying}</div>
            <p className="text-xs text-muted-foreground">
              {leadStats.total ? `${((leadStats.qualifying / leadStats.total) * 100).toFixed(1)}%` : "0%"} of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadStats.new}</div>
            <p className="text-xs text-muted-foreground">Require nurturing</p>
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
                <SelectItem value="engaged">Engaged</SelectItem>
                <SelectItem value="new">New</SelectItem>
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

      <WorkflowModal isOpen={isWorkflowModalOpen} onClose={() => setIsWorkflowModalOpen(false)} />
    </div>
  )
}
