"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { PlusCircle, Search, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
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
import { WorkflowCard } from "./workflow-card"
import type { WorkflowStatus } from "@prisma/client"

// Types for our component
interface WorkflowListProps {
  title?: string
  description?: string
  limit?: number
  showFilters?: boolean
  showSearch?: boolean
  showCreate?: boolean
  statusFilter?: WorkflowStatus | "ALL"
  activeFilter?: boolean | "ALL"
}

// Types for our API response
interface WorkflowListResponse {
  workflows: Array<{
    id: string
    name: string
    status: WorkflowStatus
    isActive: boolean
    n8nWorkflowId: string | null
    webhookUrl: string | null
    createdAt: string
    updatedAt: string
    template: {
      name: string
      description: string
      category: string
      icon: string | null
    }
    _count: {
      executions: number
    }
  }>
  pagination: {
    total: number
    limit: number
    offset: number
  }
}

export function WorkflowList({
  title = "My Workflows",
  description = "View and manage your configured workflows",
  limit = 10,
  showFilters = true,
  showSearch = true,
  showCreate = true,
  statusFilter = "ALL",
  activeFilter = "ALL",
}: WorkflowListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // States
  const [isLoading, setIsLoading] = useState(true)
  const [workflows, setWorkflows] = useState<WorkflowListResponse["workflows"]>([])
  const [totalWorkflows, setTotalWorkflows] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [status, setStatus] = useState<WorkflowStatus | "ALL">(
    (searchParams.get("status") as WorkflowStatus | "ALL") || statusFilter,
  )
  const [active, setActive] = useState<"true" | "false" | "ALL">(
    (searchParams.get("isActive") as "true" | "false" | "ALL") ||
      (activeFilter === true ? "true" : activeFilter === false ? "false" : "ALL"),
  )

  // Load workflows
  useEffect(() => {
    const fetchWorkflows = async () => {
      setIsLoading(true)
      try {
        // Build query parameters
        const queryParams = new URLSearchParams()
        if (status !== "ALL") {
          queryParams.append("status", status)
        }
        if (active !== "ALL") {
          queryParams.append("isActive", active)
        }
        queryParams.append("limit", limit.toString())

        // Fetch workflows from API
        const response = await fetch(`/api/workflows?${queryParams.toString()}`)
        if (!response.ok) {
          throw new Error("Failed to fetch workflows")
        }

        const data: WorkflowListResponse = await response.json()
        setWorkflows(data.workflows)
        setTotalWorkflows(data.pagination.total)
      } catch (error) {
        console.error("Error fetching workflows:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWorkflows()
  }, [limit, status, active])

  // Handle creating a new workflow
  const handleCreateWorkflow = () => {
    router.push("/workflows/new")
  }

  // Filter workflows based on search query
  const filteredWorkflows = workflows.filter((workflow) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      workflow.name.toLowerCase().includes(query) ||
      workflow.template.name.toLowerCase().includes(query) ||
      workflow.template.description.toLowerCase().includes(query)
    )
  })

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-40 w-full rounded-lg" />
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
          <Button onClick={handleCreateWorkflow}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Workflow
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
                placeholder="Search workflows..."
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
              <DropdownMenuLabel>Filter Workflows</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs">Status</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={status}
                  onValueChange={(value) => setStatus(value as WorkflowStatus | "ALL")}
                >
                  <DropdownMenuRadioItem value="ALL">All Statuses</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="DRAFT">Draft</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="CONFIGURING">Configuring</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="READY">Ready</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="ACTIVE">Active</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="INACTIVE">Inactive</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="ERROR">Error</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs">Active Status</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={active}
                  onValueChange={(value) => setActive(value as "true" | "false" | "ALL")}
                >
                  <DropdownMenuRadioItem value="ALL">All</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="true">Active</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="false">Inactive</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {filteredWorkflows.length === 0 ? (
        <div className="text-center py-12 bg-background rounded-lg border border-dashed">
          {searchQuery ? (
            <div className="space-y-2">
              <p>No workflows match your search</p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <p>You haven&apos;t created any workflows yet</p>
              <Button onClick={handleCreateWorkflow}>Create Your First Workflow</Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWorkflows.map((workflow) => (
            <WorkflowCard key={workflow.id} workflow={workflow} />
          ))}
        </div>
      )}

      {totalWorkflows > filteredWorkflows.length && !searchQuery && (
        <div className="flex justify-center mt-4">
          <Button variant="outline" onClick={() => router.push("/workflows")}>
            View All Workflows
          </Button>
        </div>
      )}
    </div>
  )
}
