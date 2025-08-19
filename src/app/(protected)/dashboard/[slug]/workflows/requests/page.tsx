"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, CheckCircle, AlertTriangle, FileText, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"

interface WorkflowRequest {
  id: string
  title: string
  description: string
  status: "SUBMITTED" | "UNDER_REVIEW" | "IN_DEVELOPMENT" | "COMPLETED" | "REJECTED"
  submittedAt: string
  updatedAt: string
}

export default function WorkflowRequestsPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<WorkflowRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRequests = async () => {
      // Mock data - replace with actual API call
      const mockRequests: WorkflowRequest[] = [
        {
          id: "1",
          title: "Custom E-commerce Integration",
          description: "Need a workflow that integrates with Shopify and automatically processes orders",
          status: "IN_DEVELOPMENT",
          submittedAt: "2024-01-10T09:00:00Z",
          updatedAt: "2024-01-18T15:30:00Z",
        },
        {
          id: "2",
          title: "Advanced Lead Scoring",
          description: "Custom lead scoring algorithm based on multiple data points",
          status: "COMPLETED",
          submittedAt: "2024-01-05T14:20:00Z",
          updatedAt: "2024-01-15T11:45:00Z",
        },
      ]

      setTimeout(() => {
        setRequests(mockRequests)
        setLoading(false)
      }, 1000)
    }

    loadRequests()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return "border-blue-200 text-blue-700 bg-blue-50"
      case "UNDER_REVIEW":
        return "border-yellow-200 text-yellow-700 bg-yellow-50"
      case "IN_DEVELOPMENT":
        return "border-purple-200 text-purple-700 bg-purple-50"
      case "COMPLETED":
        return "border-green-200 text-green-700 bg-green-50"
      case "REJECTED":
        return "border-red-200 text-red-700 bg-red-50"
      default:
        return "border-gray-200 text-gray-700 bg-gray-50"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return <Clock className="h-3 w-3 mr-1" />
      case "UNDER_REVIEW":
        return <AlertTriangle className="h-3 w-3 mr-1" />
      case "IN_DEVELOPMENT":
        return <FileText className="h-3 w-3 mr-1" />
      case "COMPLETED":
        return <CheckCircle className="h-3 w-3 mr-1" />
      case "REJECTED":
        return <AlertTriangle className="h-3 w-3 mr-1" />
      default:
        return <Clock className="h-3 w-3 mr-1" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push("/workflows")} className="mb-6 hover:bg-accent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Workflows
          </Button>

          <h1 className="text-3xl font-bold mb-2">My Workflow Requests</h1>
          <p className="text-muted-foreground">Track the status of your custom workflow requests</p>
        </div>

        {requests.length === 0 ? (
          <Card className="border-2 border-border/50">
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Requests Yet</h3>
              <p className="text-muted-foreground mb-6">You haven't submitted any custom workflow requests yet.</p>
              <Button onClick={() => router.push("/workflows")}>Browse Templates</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {requests.map((request) => (
              <Card key={request.id} className="border-2 border-border/50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{request.title}</CardTitle>
                      <CardDescription className="mt-2">{request.description}</CardDescription>
                    </div>
                    <Badge variant="outline" className={getStatusColor(request.status)}>
                      {getStatusIcon(request.status)}
                      {request.status.replace("_", " ")}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Submitted: {new Date(request.submittedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Updated: {new Date(request.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
