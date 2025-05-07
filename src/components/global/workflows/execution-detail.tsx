"use client"

import { AlertDescription } from "@/components/ui/alert"

import { AlertTitle } from "@/components/ui/alert"

import { Alert } from "@/components/ui/alert"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import type { ExecutionStatus } from "@prisma/client"
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  PauseCircle,
  Play,
  Timer,
  RotateCcw,
  FileJson,
  Terminal,
  TriangleAlert,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ExecutionDetailProps {
  workflowId: string
  executionId: string
}

export function ExecutionDetail({ workflowId, executionId }: ExecutionDetailProps) {
  const router = useRouter()

  // State
  const [isLoading, setIsLoading] = useState(true)
  const [execution, setExecution] = useState<any>(null)
  const [workflow, setWorkflow] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("overview")

  // Fetch execution data
  useEffect(() => {
    const fetchExecution = async () => {
      setIsLoading(true)
      try {
        // Fetch execution data
        const executionResponse = await fetch(`/api/workflows/${workflowId}/executions/${executionId}`)
        if (!executionResponse.ok) {
          throw new Error("Failed to fetch execution")
        }

        const executionData = await executionResponse.json()
        setExecution(executionData)

        // Fetch workflow data
        const workflowResponse = await fetch(`/api/workflows/${workflowId}`)
        if (!workflowResponse.ok) {
          throw new Error("Failed to fetch workflow")
        }

        const workflowData = await workflowResponse.json()
        setWorkflow(workflowData)
      } catch (error) {
        console.error("Error fetching execution details:", error)
        toast({
          title: "Error",
          description: "Failed to load execution details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchExecution()
  }, [workflowId, executionId])

  // Get status icon
  const getStatusIcon = (status: ExecutionStatus, success: boolean | null) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-5 w-5 text-muted-foreground" />
      case "RUNNING":
        return <Play className="h-5 w-5 text-blue-500" />
      case "COMPLETED":
        return success ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-amber-500" />
        )
      case "FAILED":
        return <XCircle className="h-5 w-5 text-destructive" />
      case "CANCELED":
        return <PauseCircle className="h-5 w-5 text-muted-foreground" />
      case "TIMEOUT":
        return <Timer className="h-5 w-5 text-orange-500" />
      default:
        return null
    }
  }

  // Format duration
  const formatDuration = (duration: number) => {
    if (duration < 1000) {
      return `${duration}ms`
    } else if (duration < 60000) {
      return `${(duration / 1000).toFixed(2)}s`
    } else {
      const minutes = Math.floor(duration / 60000)
      const seconds = ((duration % 60000) / 1000).toFixed(0)
      return `${minutes}m ${seconds}s`
    }
  }

  // Handle retrying the execution
  const handleRetry = async () => {
    try {
      const response = await fetch(`/api/workflows/${workflowId}/executions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputData: execution.inputData || {},
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to retry execution")
      }

      const newExecution = await response.json()

      toast({
        title: "Execution started",
        description: "Your workflow is now running",
      })

      // Redirect to the new execution
      router.push(`/workflows/${workflowId}/executions/${newExecution.id}`)
    } catch (error) {
      console.error("Error retrying execution:", error)
      toast({
        title: "Error",
        description: "Failed to retry execution. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Render loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>

        <Skeleton className="h-40 w-full rounded-md" />

        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-28 w-full rounded-md" />
        </div>
      </div>
    )
  }

  if (!execution || !workflow) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Execution Not Found</CardTitle>
          <CardDescription>
            The requested execution could not be found or you dont have permission to view it.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => router.push(`/workflows/${workflowId}/executions`)}>Return to Executions</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with title and actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => router.push(`/workflows/${workflowId}/executions`)}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="text-2xl font-bold">Execution Details</h1>
          </div>
          <p className="text-muted-foreground">
            <span className="font-medium">{workflow.name}</span> workflow execution
          </p>
        </div>

        <div className="flex gap-2">
          {(execution.status === "COMPLETED" && !execution.success) || execution.status === "FAILED" ? (
            <Button onClick={handleRetry}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Retry Execution
            </Button>
          ) : null}
        </div>
      </div>

      {/* Main content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="data">Input/Output Data</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(execution.status, execution.success)}
                Execution Status: {execution.status}
              </CardTitle>
              <CardDescription>
                {execution.status === "COMPLETED" && execution.success && "Workflow executed successfully"}
                {execution.status === "COMPLETED" && !execution.success && "Workflow execution completed with errors"}
                {execution.status === "FAILED" && "Workflow execution failed"}
                {execution.status === "RUNNING" && "Workflow is currently running"}
                {execution.status === "PENDING" && "Workflow execution is pending"}
                {execution.status === "CANCELED" && "Workflow execution was canceled"}
                {execution.status === "TIMEOUT" && "Workflow execution timed out"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Start Time</span>
                  <p>{format(new Date(execution.startedAt), "PPpp")}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Completion Time</span>
                  <p>{execution.completedAt ? format(new Date(execution.completedAt), "PPpp") : "-"}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <p>{execution.duration ? formatDuration(execution.duration) : "-"}</p>
                </div>
              </div>

              {execution.errorMessage && (
                <div className="mt-4">
                  <Alert variant="destructive">
                    <TriangleAlert className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{execution.errorMessage}</AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                Execution Events
              </CardTitle>
              <CardDescription>Timeline of events during this execution</CardDescription>
            </CardHeader>
            <CardContent>
              {execution.events && execution.events.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {execution.events.map((event: any, index: number) => (
                    <AccordionItem key={event.id} value={event.id}>
                      <AccordionTrigger className="hover:bg-muted/50 px-4 py-2 rounded-md">
                        <div className="flex items-center gap-2 text-left">
                          <span className="text-muted-foreground text-sm">
                            {format(new Date(event.timestamp), "HH:mm:ss.SSS")}
                          </span>
                          <Badge variant="outline">{event.eventType}</Badge>
                          <span className="font-medium ml-1">{event.nodeName || "System"}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="space-y-2">
                          {event.message && <div className="text-sm">{event.message}</div>}
                          {event.data && (
                            <pre className="bg-muted p-2 rounded-md text-xs overflow-x-auto">
                              {JSON.stringify(event.data, null, 2)}
                            </pre>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-6 text-muted-foreground">No events recorded for this execution</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Input/Output Data Tab */}
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileJson className="h-5 w-5" />
                Execution Data
              </CardTitle>
              <CardDescription>Input and output data for this execution</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="input">
                <TabsList>
                  <TabsTrigger value="input">Input Data</TabsTrigger>
                  <TabsTrigger value="output">Output Data</TabsTrigger>
                  {execution.resourceUsage && <TabsTrigger value="resources">Resource Usage</TabsTrigger>}
                </TabsList>
                <TabsContent value="input" className="mt-4">
                  {execution.inputData ? (
                    <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto max-h-80 overflow-y-auto">
                      {JSON.stringify(execution.inputData, null, 2)}
                    </pre>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">No input data available</div>
                  )}
                </TabsContent>
                <TabsContent value="output" className="mt-4">
                  {execution.outputData ? (
                    <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto max-h-80 overflow-y-auto">
                      {JSON.stringify(execution.outputData, null, 2)}
                    </pre>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      {execution.status === "COMPLETED" || execution.status === "FAILED"
                        ? "No output data available"
                        : "Output data will be available when execution completes"}
                    </div>
                  )}
                </TabsContent>
                {execution.resourceUsage && (
                  <TabsContent value="resources" className="mt-4">
                    <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto max-h-80 overflow-y-auto">
                      {JSON.stringify(execution.resourceUsage, null, 2)}
                    </pre>
                  </TabsContent>
                )}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
