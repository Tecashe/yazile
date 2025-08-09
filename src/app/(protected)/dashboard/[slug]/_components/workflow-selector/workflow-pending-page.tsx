
"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  CheckCircle,
  Loader2,
  PlayCircle,
  ArrowLeft,
  RefreshCw,
  Clock,
  Mail,
  Phone,
  MessageSquare,
  Building,
  ExternalLink,
} from "lucide-react"

interface PendingWorkflowData {
  id: string
  submittedAt: string
  status: string
  workflowType?: string
  estimatedCompletion?: string
}

interface BusinessInfo {
  businessName: string
  businessType: string
  description?: string
  website?: string
  phone?: string
  email?: string
}

interface WorkflowPendingPageProps {
  pendingWorkflowData: PendingWorkflowData
  businessInfo: BusinessInfo
  onBackToSelection: () => void
}

const WorkflowPendingPage: React.FC<WorkflowPendingPageProps> = ({
  pendingWorkflowData,
  businessInfo,
  onBackToSelection,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getProgressPercentage = () => {
    const now = new Date()
    const submitted = new Date(pendingWorkflowData.submittedAt)
    const estimatedDays = Number.parseInt(pendingWorkflowData.estimatedCompletion || "2")
    const expectedCompletion = new Date(submitted.getTime() + estimatedDays * 24 * 60 * 60 * 1000)

    const totalTime = expectedCompletion.getTime() - submitted.getTime()
    const elapsed = now.getTime() - submitted.getTime()

    return Math.min(Math.max((elapsed / totalTime) * 70, 10), 70) // Cap at 70% until actually complete
  }

  const handleRefreshStatus = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="radial--gradient--automations">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" onClick={onBackToSelection} className="mb-6 hover:bg-accent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Selection
            </Button>
          </div>

          {/* Main Status Section */}
          <div className="text-center mb-8">
            <div className="relative mb-6">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin"></div>
                <Sparkles className="h-12 w-12 text-blue-500 animate-pulse" />
              </div>
            </div>

            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Your Workflow is Being Created! 🚀
            </h1>

            <p className="text-xl text-muted-foreground mb-2">Our development team is building your custom workflow</p>

            {pendingWorkflowData.workflowType && (
              <Badge variant="outline" className="text-lg px-4 py-2 mt-2">
                {pendingWorkflowData.workflowType}
              </Badge>
            )}
          </div>

          {/* Progress Section */}
          <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-green-700 dark:text-green-400">Submitted</h3>
                  <p className="text-sm text-muted-foreground">Request received</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-500 flex items-center justify-center shadow-lg">
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                  </div>
                  <h3 className="font-semibold text-blue-700 dark:text-blue-400">In Development</h3>
                  <p className="text-sm text-muted-foreground">Team is working</p>
                </div>

                <div className="text-center opacity-50">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                    <PlayCircle className="h-6 w-6 text-gray-500" />
                  </div>
                  <h3 className="font-semibold text-gray-500">Ready</h3>
                  <p className="text-sm text-muted-foreground">Workflow deployed</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Development Progress</span>
                  <span>{Math.round(getProgressPercentage())}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>

              {/* Email Notification Notice */}
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-semibold text-blue-800 dark:text-blue-300">
                    You&apos;ll be notified when ready!
                  </h3>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  We&apos;ll send an email to <strong>{businessInfo.email}</strong> when your workflow is complete and
                  available in the marketplace.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Details Grid */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Timeline Card */}
            <Card className="border-2 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  Development Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">
                      {pendingWorkflowData.estimatedCompletion || "2-3"}
                    </p>
                    <p className="text-sm text-muted-foreground">business days</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-lg font-semibold">{formatDate(pendingWorkflowData.submittedAt).split(",")[0]}</p>
                    <p className="text-sm text-muted-foreground">submitted</p>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="font-medium mb-2 text-primary">What&apos;s happening now:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      Analyzing your requirements and integrations
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                      Designing custom workflow logic
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Setting up integrations and testing
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Business Details Card */}
            <Card className="border-2 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-500" />
                  Workflow Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">Business:</span>
                    <span className="text-sm font-semibold">{businessInfo.businessName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">Type:</span>
                    <span className="text-sm font-semibold">{businessInfo.businessType}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">Status:</span>
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    >
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      In Development
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">Submitted:</span>
                    <span className="text-sm">{formatDate(pendingWorkflowData.submittedAt).split(" at ")[1]}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Support Information */}
          <Card className="mb-8 border-2 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                    Need help or have questions?
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-400 mb-3">
                    Our development team is here to help! If you have any questions about your workflow or need to make
                    changes, don&apos;t hesitate to reach out.
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>support@yourcompany.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>Live chat available</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button onClick={handleRefreshStatus} variant="outline" className="flex items-center gap-2 bg-transparent">
              <RefreshCw className="h-4 w-4" />
              Check Status
            </Button>

            <Button
              onClick={() => window.open("https://docs.yourcompany.com/workflows", "_blank")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              View Documentation
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkflowPendingPage
