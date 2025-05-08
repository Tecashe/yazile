"use client"

import { useState, useEffect } from "react"
import { useRouter,usePathname } from "next/navigation"
import { format, formatDistanceToNow } from "date-fns"
import { Search, SlidersHorizontal, PlusCircle, ChevronRight } from "lucide-react"
import type { CustomRequestStatus, RequestUrgency } from "@prisma/client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"

interface CustomRequestListProps {
  title?: string
  description?: string
  limit?: number
  showFilters?: boolean
  showSearch?: boolean
  showCreate?: boolean
  statusFilter?: CustomRequestStatus | "ALL"
  urgencyFilter?: RequestUrgency | "ALL"
}

interface CustomRequest {
  id: string
  title: string
  status: CustomRequestStatus
  urgency: RequestUrgency
  createdAt: string
  updatedAt: string
  estimatedDelivery: string | null
  actualDelivery: string | null
  template: {
    id: string
    name: string
  } | null
}

interface CustomRequestListResponse {
  requests: CustomRequest[]
  pagination: {
    total: number
    limit: number
    offset: number
  }
}

export function CustomRequestList({
  title = "Custom Workflow Requests",
  description = "View and manage your custom workflow requests",
  limit = 10,
  showFilters = true,
  showSearch = true,
  showCreate = true,
  statusFilter = "ALL",
  urgencyFilter = "ALL",
}: CustomRequestListProps) {
  const router = useRouter()
  const pathname = usePathname()
  const slug = pathname.match(/^\/dashboard\/([^/]+)/)

  // State
  const [isLoading, setIsLoading] = useState(true)
  const [requests, setRequests] = useState<CustomRequest[]>([])
  const [totalRequests, setTotalRequests] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [status, setStatus] = useState<CustomRequestStatus | "ALL">(statusFilter)
  const [urgency, setUrgency] = useState<RequestUrgency | "ALL">(urgencyFilter)

  // Fetch requests
  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true)
      try {
        // Build query parameters
        const queryParams = new URLSearchParams()
        if (status !== "ALL") {
          queryParams.append("status", status)
        }
        if (urgency !== "ALL") {
          queryParams.append("urgency", urgency)
        }
        queryParams.append("limit", limit.toString())

        // Fetch requests from API
        const response = await fetch(`/api/custom-requests?${queryParams.toString()}`)
        if (!response.ok) {
          throw new Error("Failed to fetch custom requests")
        }

        const data: CustomRequestListResponse = await response.json()
        setRequests(data.requests)
        setTotalRequests(data.pagination.total)
      } catch (error) {
        console.error("Error fetching custom requests:", error)
        toast({
          title: "Error fetching requests",
          description: "Failed to load custom workflow requests. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequests()
  }, [limit, status, urgency])

  // Handle creating a new request
  const handleCreateRequest = () => {
    router.push("/custom-requests/new")
    //router.push(`/dashboard/${slug}/agents/custom-requests/new`)
  }

  // Filter requests based on search query
  const filteredRequests = requests.filter((request) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      request.title.toLowerCase().includes(query) ||
      (request.template?.name && request.template.name.toLowerCase().includes(query))
    )
  })

  // Get status badge variant
  const getStatusBadgeVariant = (status: CustomRequestStatus) => {
    switch (status) {
      case "SUBMITTED":
        return "default"
      case "UNDER_REVIEW":
        return "secondary"
      case "APPROVED":
        return "success"
      case "IN_DEVELOPMENT":
        return "secondary"
      case "READY_FOR_TESTING":
        return "secondary"
      case "COMPLETED":
        return "success"
      case "REJECTED":
        return "destructive"
      case "CANCELED":
        return "outline"
      default:
        return "outline"
    }
  }

  // Get urgency badge variant
  const getUrgencyBadgeVariant = (urgency: RequestUrgency) => {
    switch (urgency) {
      case "LOW":
        return "outline"
      case "NORMAL":
        return "secondary"
      case "HIGH":
        return "warning"
      case "CRITICAL":
        return "destructive"
      default:
        return "outline"
    }
  }

  // Format status for display
  const formatStatus = (status: CustomRequestStatus) => {
    return status.replace(/_/g, " ")
  }

  // Render loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          {showCreate && <Skeleton className="h-10 w-32" />}
        </div>

        {showFilters && (
          <div className="flex items-center justify-between my-4">
            {showSearch && <Skeleton className="h-10 w-64" />}
            <Skeleton className="h-10 w-32" />
          </div>
        )}

        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {showCreate && (
          <Button onClick={handleCreateRequest}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Request
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="flex items-center justify-between my-4">
          {showSearch && (
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search requests..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter Requests</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs">Status</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={status}
                  onValueChange={(value) => setStatus(value as CustomRequestStatus | "ALL")}
                >
                  <DropdownMenuRadioItem value="ALL">All Statuses</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="SUBMITTED">Submitted</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="UNDER_REVIEW">Under Review</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="APPROVED">Approved</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="IN_DEVELOPMENT">In Development</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="READY_FOR_TESTING">Ready for Testing</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="COMPLETED">Completed</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="REJECTED">Rejected</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="CANCELED">Canceled</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs">Urgency</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={urgency}
                  onValueChange={(value) => setUrgency(value as RequestUrgency | "ALL")}
                >
                  <DropdownMenuRadioItem value="ALL">All Urgencies</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="LOW">Low</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="NORMAL">Normal</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="HIGH">High</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="CRITICAL">Critical</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            {searchQuery ? (
              <div className="space-y-2">
                <p>No requests match your search</p>
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <p>You haven&apos;t created any custom workflow requests yet</p>
                <Button onClick={handleCreateRequest}>Create Your First Request</Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <Card
              key={request.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/custom-requests/${request.id}`)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant={getStatusBadgeVariant(request.status)}>{formatStatus(request.status)}</Badge>
                      <Badge variant={getUrgencyBadgeVariant(request.urgency)}>{request.urgency} Urgency</Badge>
                    </div>
                    <h3 className="text-lg font-medium">{request.title}</h3>
                    {request.template && (
                      <p className="text-sm text-muted-foreground">Based on: {request.template.name}</p>
                    )}
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>Requested {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}</span>
                      {request.estimatedDelivery && (
                        <span className="ml-4">
                          Est. delivery: {format(new Date(request.estimatedDelivery), "MMM d, yyyy")}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Button variant="ghost" size="sm" className="ml-auto">
                      View Details
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {totalRequests > filteredRequests.length && !searchQuery && (
        <div className="flex justify-center mt-4">
          <Button variant="outline" onClick={() => router.push(`/dashboard/${slug}/agents/custom-requests`)}>
            View All Requests
          </Button>
        </div>
      )}
    </div>
  )
}
