"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  CheckCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  User,
  Calendar,
  RefreshCw,
  Eye,
  Edit,
  Loader2,
  Star,
  TrendingUp,
  Zap,
  Building,
  Mail,
} from "lucide-react"

interface WorkflowRequest {
  id: string
  title: string
  businessObjective: string
  processDescription: string
  requiredIntegrations: string[]
  budget?: number
  urgency: "LOW" | "NORMAL" | "HIGH" | "CRITICAL"
  status:
    | "SUBMITTED"
    | "UNDER_REVIEW"
    | "APPROVED"
    | "IN_DEVELOPMENT"
    | "READY_FOR_TESTING"
    | "COMPLETED"
    | "REJECTED"
    | "CANCELED"
  developmentNotes?: string
  estimatedDelivery?: string
  actualDelivery?: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    firstname: string
    lastname: string
    email: string
  }
  // Enhanced fields from workflow builder
  businessInfo?: {
    businessName: string
    businessType: string
  }
  workflowDesign?: any
  selectedChannels?: string[]
  automationFeatures?: string[]
  customRequest?: string
  estimatedCost?: string
  roi?: string
  complexity?: string
  steps?: any[]
  metrics?: any
  technicalRequirements?: string[]
  deploymentChannels?: string[]
}

const statusConfig = {
  SUBMITTED: {
    label: "Submitted",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    progress: 10,
    icon: MessageSquare,
  },
  UNDER_REVIEW: {
    label: "Under Review",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    progress: 25,
    icon: Eye,
  },
  APPROVED: {
    label: "Approved",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    progress: 40,
    icon: CheckCircle,
  },
  IN_DEVELOPMENT: {
    label: "In Development",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    progress: 70,
    icon: Loader2,
  },
  READY_FOR_TESTING: {
    label: "Ready for Testing",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    progress: 90,
    icon: AlertCircle,
  },
  COMPLETED: {
    label: "Completed",
    color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
    progress: 100,
    icon: CheckCircle,
  },
  REJECTED: {
    label: "Rejected",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    progress: 0,
    icon: AlertCircle,
  },
  CANCELED: {
    label: "Canceled",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    progress: 0,
    icon: AlertCircle,
  },
}

const urgencyConfig = {
  LOW: { label: "Low", color: "bg-gray-100 text-gray-800" },
  NORMAL: { label: "Normal", color: "bg-blue-100 text-blue-800" },
  HIGH: { label: "High", color: "bg-orange-100 text-orange-800" },
  CRITICAL: { label: "Critical", color: "bg-red-100 text-red-800" },
}

export default function AdminWorkflowRequestsDashboard() {
  const [requests, setRequests] = useState<WorkflowRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<WorkflowRequest | null>(null)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [updateForm, setUpdateForm] = useState({
    status: "",
    developmentNotes: "",
    estimatedDelivery: "",
  })

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      setRefreshing(true)
      const response = await fetch("/api/admin/workflow-requests")
      const data = await response.json()
      setRequests(data.requests || [])
    } catch (error) {
      console.error("Error fetching requests:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleUpdateRequest = async () => {
    if (!selectedRequest) return

    try {
      const response = await fetch(`/api/admin/workflow-requests/${selectedRequest.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateForm),
      })

      if (response.ok) {
        await fetchRequests()
        setIsUpdateDialogOpen(false)
        setSelectedRequest(null)
        setUpdateForm({ status: "", developmentNotes: "", estimatedDelivery: "" })
      }
    } catch (error) {
      console.error("Error updating request:", error)
    }
  }

  const openUpdateDialog = (request: WorkflowRequest) => {
    setSelectedRequest(request)
    setUpdateForm({
      status: request.status,
      developmentNotes: request.developmentNotes || "",
      estimatedDelivery: request.estimatedDelivery || "",
    })
    setIsUpdateDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Workflow Requests Dashboard</h2>
          <p className="text-muted-foreground">Manage and track custom workflow development requests</p>
        </div>
        <Button variant="outline" onClick={fetchRequests} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Total Requests</span>
            </div>
            <p className="text-2xl font-bold mt-2">{requests.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">In Development</span>
            </div>
            <p className="text-2xl font-bold mt-2">{requests.filter((r) => r.status === "IN_DEVELOPMENT").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Completed</span>
            </div>
            <p className="text-2xl font-bold mt-2">{requests.filter((r) => r.status === "COMPLETED").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Pending Review</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {requests.filter((r) => r.status === "SUBMITTED" || r.status === "UNDER_REVIEW").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {requests.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Workflow Requests</h3>
              <p className="text-muted-foreground">No custom workflow requests have been submitted yet.</p>
            </CardContent>
          </Card>
        ) : (
          requests.map((request) => {
            const config = statusConfig[request.status]
            const urgencyConf = urgencyConfig[request.urgency]
            const StatusIcon = config.icon

            return (
              <Card key={request.id} className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{request.title}</CardTitle>
                        <Badge className={config.color}>{config.label}</Badge>
                        <Badge className={urgencyConf.color}>{urgencyConf.label}</Badge>
                        {request.workflowDesign && (
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            <Star className="h-3 w-3 mr-1" />
                            AI Generated
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-base">{request.businessObjective}</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => openUpdateDialog(request)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Update
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Business Information */}
                  {request.businessInfo && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Business</p>
                          <p className="text-sm font-medium">{request.businessInfo.businessName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Industry</p>
                          <p className="text-sm font-medium">{request.businessInfo.businessType}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Contact</p>
                          <p className="text-sm font-medium">{request.user.email}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Workflow Design Summary */}
                  {request.workflowDesign && (
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                      <h4 className="font-semibold mb-3 flex items-center gap-2 text-blue-800 dark:text-blue-300">
                        <Zap className="h-4 w-4" />
                        AI-Generated Workflow Design
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {request.metrics && (
                          <>
                            <div className="text-center">
                              <p className="text-lg font-bold text-blue-600">{request.metrics.automationRate}</p>
                              <p className="text-xs text-muted-foreground">Automation Rate</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-bold text-green-600">{request.metrics.responseTime}</p>
                              <p className="text-xs text-muted-foreground">Response Time</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-bold text-purple-600">{request.metrics.accuracy}</p>
                              <p className="text-xs text-muted-foreground">AI Accuracy</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-bold text-orange-600">{request.complexity}</p>
                              <p className="text-xs text-muted-foreground">Complexity</p>
                            </div>
                          </>
                        )}
                      </div>
                      {request.steps && request.steps.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Workflow Steps ({request.steps.length}):</p>
                          <div className="flex flex-wrap gap-2">
                            {request.steps.slice(0, 3).map((step: any, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {step.title}
                              </Badge>
                            ))}
                            {request.steps.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{request.steps.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Custom Request Details */}
                  {request.customRequest && (
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-semibold mb-2">Custom Requirements</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{request.customRequest}</p>
                    </div>
                  )}

                  {/* Platforms and Features */}
                  {((request.selectedChannels && request.selectedChannels.length > 0) || 
                    (request.automationFeatures && request.automationFeatures.length > 0)) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {request.selectedChannels && request.selectedChannels.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2 text-sm">Selected Platforms</h4>
                          <div className="flex flex-wrap gap-2">
                            {request.selectedChannels.map((channel) => (
                              <Badge key={channel} variant="outline" className="text-xs">
                                {channel}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {request.automationFeatures && request.automationFeatures.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2 text-sm">AI Features</h4>
                          <div className="flex flex-wrap gap-2">
                            {request.automationFeatures.map((feature) => (
                              <Badge key={feature} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Cost and ROI */}
                  {(request.estimatedCost || request.roi) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {request.estimatedCost && (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium">Estimated Cost</span>
                          </div>
                          <p className="text-lg font-bold text-green-700">{request.estimatedCost}</p>
                        </div>
                      )}
                      {request.roi && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Star className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium">Expected ROI</span>
                          </div>
                          <p className="text-lg font-bold text-blue-700">{request.roi}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Development Notes */}
                  {request.developmentNotes && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h4 className="text-sm font-medium mb-2 text-blue-800 dark:text-blue-300">Development Notes</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-400">{request.developmentNotes}</p>
                    </div>
                  )}

                  {/* Request Details */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Requested by</p>
                        <p className="text-sm font-medium">
                          {request.user.firstname} {request.user.lastname}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Submitted</p>
                        <p className="text-sm font-medium">{new Date(request.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {request.budget && (
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Budget</p>
                          <p className="text-sm font-medium">${request.budget.toLocaleString()}</p>
                        </div>
                      </div>
                    )}

                    {request.estimatedDelivery && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Est. Delivery</p>
                          <p className="text-sm font-medium">
                            {new Date(request.estimatedDelivery).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Update Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Request Status</DialogTitle>
            <DialogDescription>
              Update the status and add development notes for this workflow request.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={updateForm.status}
                onValueChange={(value) => setUpdateForm({ ...updateForm, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUBMITTED">Submitted</SelectItem>
                  <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="IN_DEVELOPMENT">In Development</SelectItem>
                  <SelectItem value="READY_FOR_TESTING">Ready for Testing</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="CANCELED">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="estimatedDelivery">Estimated Delivery Date</Label>
              <Input
                id="estimatedDelivery"
                type="date"
                value={updateForm.estimatedDelivery}
                onChange={(e) => setUpdateForm({ ...updateForm, estimatedDelivery: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="developmentNotes">Development Notes</Label>
              <Textarea
                id="developmentNotes"
                placeholder="Add notes about the development progress..."
                value={updateForm.developmentNotes}
                onChange={(e) => setUpdateForm({ ...updateForm, developmentNotes: e.target.value })}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRequest}>Update Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
