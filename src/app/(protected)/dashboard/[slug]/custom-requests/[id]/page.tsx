import type { Metadata } from "next"
import { onUserInfor } from "@/actions/user"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { ArrowLeft, Clock, Calendar, AlertCircle, MessageSquare } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

interface CustomRequestDetailPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: CustomRequestDetailPageProps): Promise<Metadata> {
  const session = await onUserInfor()

  if (!session?.data?.id) {
    return {
      title: "Custom Request | n8n Integration Platform",
    }
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/custom-requests/${params.id}`, {
      headers: {
        Cookie: `next-auth.session-token=${session.data.id}`,
      },
    })

    if (!response.ok) {
      return {
        title: "Custom Request | n8n Integration Platform",
      }
    }

    const request = await response.json()

    return {
      title: `${request.title} | Custom Request`,
      description: `Details for custom workflow request: ${request.title}`,
    }
  } catch (error) {
    return {
      title: "Custom Request | n8n Integration Platform",
    }
  }
}

export default async function CustomRequestDetailPage({ params }: CustomRequestDetailPageProps) {
  const session = await onUserInfor()

  if (!session?.data?.id) {
    redirect("/login")
  }

  const { id } = params

  // Fetch the custom request
  let request
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/custom-requests/${id}`, {
      headers: {
        Cookie: `next-auth.session-token=${session.data.id}`,
      },
    })

    if (!response.ok) {
      notFound()
    }

    request = await response.json()
  } catch (error) {
    notFound()
  }

  // Format status for display
  const formatStatus = (status: string) => {
    return status.replace(/_/g, " ")
  }

  // Get status badge variant
//   const getStatusBadgeVariant = (status: string) => {
//     switch (status) {
//       case "SUBMITTED":
//         return "default"
//       case "UNDER_REVIEW":
//         return "secondary"
//       case "APPROVED":
//         return "success"
//       case "IN_DEVELOPMENT":
//         return "secondary"
//       case "READY_FOR_TESTING":
//         return "secondary"
//       case "COMPLETED":
//         return "success"
//       case "REJECTED":
//         return "destructive"
//       case "CANCELED":
//         return "outline"
//       default:
//         return "outline"
//     }
//   }
const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return "default"
      case "UNDER_REVIEW":
        return "secondary"
      case "APPROVED":
        return "default" // Changed from "success" to "default"
      case "IN_DEVELOPMENT":
        return "secondary"
      case "READY_FOR_TESTING":
        return "secondary"
      case "COMPLETED":
        return "default" // Changed from "success" to "default"
      case "REJECTED":
        return "destructive"
      case "CANCELED":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
          <Link href="/custom-requests">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{request.title}</h1>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant={getStatusBadgeVariant(request.status)}>{formatStatus(request.status)}</Badge>
        <Badge variant="outline" className="flex items-center">
          <Clock className="mr-1 h-4 w-4" />
          {request.urgency} Urgency
        </Badge>
        <Badge variant="outline" className="flex items-center">
          <Calendar className="mr-1 h-4 w-4" />
          Submitted on {format(new Date(request.createdAt), "MMM d, yyyy")}
        </Badge>
        {request.estimatedDelivery && (
          <Badge variant="outline" className="flex items-center">
            <Calendar className="mr-1 h-4 w-4" />
            Est. delivery: {format(new Date(request.estimatedDelivery), "MMM d, yyyy")}
          </Badge>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Business Objective</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{request.businessObjective}</p>
            </div>

            <div>
              <h3 className="font-medium mb-1">Process Description</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{request.processDescription}</p>
            </div>

            {request.requiredIntegrations && request.requiredIntegrations.length > 0 && (
              <div>
                <h3 className="font-medium mb-1">Required Integrations</h3>
                <div className="flex flex-wrap gap-1">
                  {request.requiredIntegrations.map((integration: string) => (
                    <Badge key={integration} variant="outline" className="text-xs">
                      {integration}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {request.exampleDataUrl && (
              <div>
                <h3 className="font-medium mb-1">Example Data</h3>
                <a
                  href={request.exampleDataUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  View Example Data
                </a>
              </div>
            )}

            {request.budget && (
              <div>
                <h3 className="font-medium mb-1">Budget</h3>
                <p className="text-sm">${request.budget.toFixed(2)}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Updates</CardTitle>
            <CardDescription>Updates and messages about your request</CardDescription>
          </CardHeader>
          <CardContent>
            {request.adminNotes ? (
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Admin Note</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(request.updatedAt), "MMM d, yyyy h:mm a")}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-line">{request.adminNotes}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <AlertCircle className="mx-auto h-8 w-8 mb-2" />
                <p>No updates yet</p>
                <p className="text-sm">We will notify you when there are updates to your request</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col items-start border-t pt-6">
            <h3 className="font-medium mb-2 flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" />
              Send a Message
            </h3>
            <Textarea placeholder="Type your message here..." className="mb-2 w-full" />
            <Button className="ml-auto">Send Message</Button>
          </CardFooter>
        </Card>
      </div>

      {request.template && (
        <Card>
          <CardHeader>
            <CardTitle>Based on Template</CardTitle>
            <CardDescription>This request is based on an existing template</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{request.template.name}</h3>
                <p className="text-sm text-muted-foreground">{request.template.description}</p>
              </div>
              <Button variant="outline" asChild>
                <Link href={`/templates/${request.template.id}`}>View Template</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {request.status === "COMPLETED" && request.workflow && (
        <Card>
          <CardHeader>
            <CardTitle>Completed Workflow</CardTitle>
            <CardDescription>Your custom workflow has been created</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{request.workflow.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Created on {format(new Date(request.workflow.createdAt), "MMM d, yyyy")}
                </p>
              </div>
              <Button asChild>
                <Link href={`/workflows/${request.workflow.id}`}>View Workflow</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
