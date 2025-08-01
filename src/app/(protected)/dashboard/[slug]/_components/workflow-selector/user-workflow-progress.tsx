"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, AlertCircle, MessageSquare, User, Calendar, RefreshCw, Eye, Loader2 } from "lucide-react"

interface WorkflowRequest {
  id: string
  title: string
  businessObjective: string
  status:
    | "SUBMITTED"
    | "UNDER_REVIEW"
    | "APPROVED"
    | "IN_DEVELOPMENT"
    | "READY_FOR_TESTING"
    | "COMPLETED"
    | "REJECTED"
    | "CANCELED"
  urgency: "LOW" | "NORMAL" | "HIGH" | "CRITICAL"
  developmentNotes?: string
  estimatedDelivery?: string
  actualDelivery?: string
  createdAt: string
  updatedAt: string
  assignedAdmin?: {
    firstname: string
    lastname: string
  }
}

const statusConfig = {
  SUBMITTED: {
    label: "Submitted",
    color: "bg-blue-100 text-blue-800",
    progress: 10,
    icon: MessageSquare,
    description: "Your request has been submitted and is awaiting review",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    color: "bg-yellow-100 text-yellow-800",
    progress: 25,
    icon: Eye,
    description: "Our team is reviewing your requirements",
  },
  APPROVED: {
    label: "Approved",
    color: "bg-green-100 text-green-800",
    progress: 40,
    icon: CheckCircle,
    description: "Your request has been approved and assigned to a developer",
  },
  IN_DEVELOPMENT: {
    label: "In Development",
    color: "bg-purple-100 text-purple-800",
    progress: 70,
    icon: Loader2,
    description: "Your custom workflow is being built",
  },
  READY_FOR_TESTING: {
    label: "Ready for Testing",
    color: "bg-orange-100 text-orange-800",
    progress: 90,
    icon: AlertCircle,
    description: "Your workflow is ready for final testing",
  },
  COMPLETED: {
    label: "Completed",
    color: "bg-emerald-100 text-emerald-800",
    progress: 100,
    icon: CheckCircle,
    description: "Your custom workflow is ready to use!",
  },
  REJECTED: {
    label: "Rejected",
    color: "bg-red-100 text-red-800",
    progress: 0,
    icon: AlertCircle,
    description: "Your request was rejected. Please see notes below.",
  },
  CANCELED: {
    label: "Canceled",
    color: "bg-gray-100 text-gray-800",
    progress: 0,
    icon: AlertCircle,
    description: "This request has been canceled",
  },
}

interface UserWorkflowProgressProps {
  userId: string
}

export default function UserWorkflowProgress({ userId }: UserWorkflowProgressProps) {
  const [requests, setRequests] = useState<WorkflowRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchUserRequests()
  }, [userId])

  const fetchUserRequests = async () => {
    try {
      setRefreshing(true)
      const response = await fetch(`/api/user/workflow-requests?userId=${userId}`)
      const data = await response.json()
      setRequests(data.requests || [])
    } catch (error) {
      console.error("Error fetching user requests:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    fetchUserRequests()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Workflow Requests</h3>
          <p className="text-muted-foreground">You haven't submitted any custom workflow requests yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Workflow Requests</h2>
          <p className="text-muted-foreground">Track the progress of your custom workflow requests</p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {requests.map((request) => {
          const config = statusConfig[request.status]
          const StatusIcon = config.icon

          return (
            <Card key={request.id} className="relative overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{request.title}</CardTitle>
                    <CardDescription className="mt-1">{request.businessObjective}</CardDescription>
                  </div>
                  <Badge className={config.color}>{config.label}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">{config.progress}%</span>
                  </div>
                  <Progress value={config.progress} className="h-2" />
                </div>

                {/* Status Description */}
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <StatusIcon
                    className={`h-5 w-5 mt-0.5 ${
                      request.status === "IN_DEVELOPMENT" ? "animate-spin" : ""
                    } text-primary`}
                  />
                  <div>
                    <p className="text-sm font-medium mb-1">Current Status</p>
                    <p className="text-sm text-muted-foreground">{config.description}</p>
                  </div>
                </div>

                {/* Development Notes */}
                {request.developmentNotes && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="text-sm font-medium mb-2 text-blue-800 dark:text-blue-300">Development Update</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400">{request.developmentNotes}</p>
                  </div>
                )}

                {/* Request Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Submitted</p>
                      <p className="text-sm font-medium">{new Date(request.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {request.assignedAdmin && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Assigned to</p>
                        <p className="text-sm font-medium">
                          {request.assignedAdmin.firstname} {request.assignedAdmin.lastname}
                        </p>
                      </div>
                    </div>
                  )}

                  {request.estimatedDelivery && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Estimated Delivery</p>
                        <p className="text-sm font-medium">
                          {new Date(request.estimatedDelivery).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Completed Message */}
                {request.status === "COMPLETED" && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h4 className="text-sm font-medium text-green-800 dark:text-green-300">Workflow Ready!</h4>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-400 mb-3">
                      Your custom workflow has been completed and is now available in your workflow selection.
                    </p>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      View Workflow
                    </Button>
                  </div>
                )}

                {/* Rejected Message */}
                {request.status === "REJECTED" && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <h4 className="text-sm font-medium text-red-800 dark:text-red-300">Request Rejected</h4>
                    </div>
                    <p className="text-sm text-red-700 dark:text-red-400">
                      Unfortunately, your request couldn't be fulfilled. Please check the development notes above for
                      more details.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
