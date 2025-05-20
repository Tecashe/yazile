// "use client"

// import { useEffect, useState } from "react"
// import { useRouter, usePathname, useSearchParams } from "next/navigation"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { PlusCircle, Settings, Workflow, ExternalLink, Loader, AlertTriangle, RefreshCw } from "lucide-react"
// import { onUserInfor } from "@/actions/user"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { useToast } from "@/hooks/use-toast"
// import { ErrorBoundary } from "react-error-boundary"

// // Define types for our data
// interface N8nWorkflow {
//   id: string
//   name: string
//   workflowType: string
//   isActive: boolean
// }

// interface N8nConnection {
//   id: string
//   name: string
//   n8nUrl: string
//   isActive: boolean
//   createdAt: string
//   workflows: N8nWorkflow[]
// }

// function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
//   return (
//     <div className="p-6 text-center">
//       <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
//       <h2 className="text-xl font-bold text-red-500">Something went wrong</h2>
//       <p className="text-muted-foreground mt-2 mb-4">
//         {error.message || "We encountered an error while loading your n8n connections."}
//       </p>
//       <Button onClick={resetErrorBoundary}>
//         <RefreshCw className="mr-2 h-4 w-4" />
//         Try Again
//       </Button>
//     </div>
//   )
// }

// function N8nIntegrationsContent() {
//   const router = useRouter()
//   const pathname = usePathname()
//   const searchParams = useSearchParams()
//   const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
//   const slug = slugMatch ? slugMatch[1] : ""
//   const { toast } = useToast()

//   const [connections, setConnections] = useState<N8nConnection[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   // Check for error or success messages in URL params
//   const errorMessage = searchParams.get("error")
//   const successMessage = searchParams.get("success")

//   useEffect(() => {
//     // Show toast for error or success messages from URL
//     if (errorMessage) {
//       toast({
//         title: "Error",
//         description: decodeURIComponent(errorMessage),
//         variant: "destructive",
//       })

//       // Clear the error from the URL
//       const params = new URLSearchParams(searchParams.toString())
//       params.delete("error")
//       router.replace(`${pathname}?${params.toString()}`)
//     }

//     if (successMessage) {
//       toast({
//         title: "Success",
//         description: decodeURIComponent(successMessage),
//       })

//       // Clear the success message from the URL
//       const params = new URLSearchParams(searchParams.toString())
//       params.delete("success")
//       router.replace(`${pathname}?${params.toString()}`)
//     }
//   }, [errorMessage, successMessage, toast, router, pathname, searchParams])

//   useEffect(() => {
//     // Fetch user info and connections
//     const fetchData = async () => {
//       try {
//         setLoading(true)
//         setError(null)

//         // Get user info
//         const userResponse = await onUserInfor()
//         const userId = userResponse.data?.id

//         if (!userId) {
//           router.push("/sign-in")
//           return
//         }

//         // Fetch connections
//         const response = await fetch(`/api/n8n/connections`)

//         if (!response.ok) {
//           const errorData = await response.json().catch(() => ({}))
//           throw new Error(errorData.error || "Failed to fetch n8n connections")
//         }

//         const data = await response.json()
//         setConnections(data.connections || [])
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "An error occurred")
//         console.error("Error fetching data:", err)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [router])

//   const handleRefresh = () => {
//     setLoading(true)
//     setError(null)
//     window.location.reload()
//   }

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-64">
//         <Loader className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
//         <p className="text-muted-foreground">Loading your n8n connections...</p>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <Alert variant="destructive" className="mb-6">
//         <AlertTriangle className="h-4 w-4" />
//         <AlertTitle>Error</AlertTitle>
//         <AlertDescription className="flex flex-col gap-2">
//           <p>{error}</p>
//           <Button variant="outline" size="sm" className="w-fit" onClick={handleRefresh}>
//             <RefreshCw className="mr-2 h-4 w-4" />
//             Try Again
//           </Button>
//         </AlertDescription>
//       </Alert>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold">n8n Integrations</h1>
//         <div className="flex gap-2">
//           <Button variant="outline" onClick={handleRefresh}>
//             <RefreshCw className="mr-2 h-4 w-4" />
//             Refresh
//           </Button>
//           <Button asChild>
//             <Link href={`/dashboard/${slug}/connections/new`}>
//               <PlusCircle className="mr-2 h-4 w-4" />
//               Add Connection
//             </Link>
//           </Button>
//         </div>
//       </div>

//       {connections.length === 0 ? (
//         <Card>
//           <CardHeader>
//             <CardTitle>No n8n Connections</CardTitle>
//             <CardDescription>Connect your n8n instance to automate lead qualification and nurturing.</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <p className="text-muted-foreground">
//               n8n is a powerful workflow automation tool that can help you automate your lead qualification process.
//               Connect your n8n instance to get started.
//             </p>
//           </CardContent>
//           <CardFooter>
//             <Button asChild>
//               <Link href={`/dashboard/${slug}/connections/new`}>
//                 <PlusCircle className="mr-2 h-4 w-4" />
//                 Add Connection
//               </Link>
//             </Button>
//           </CardFooter>
//         </Card>
//       ) : (
//         <div className="grid gap-6">
//           {connections.map((connection) => (
//             <Card key={connection.id}>
//               <CardHeader>
//                 <div className="flex items-center justify-between">
//                   <CardTitle>{connection.name}</CardTitle>
//                   <Badge variant={connection.isActive ? "default" : "outline"}>
//                     {connection.isActive ? "Active" : "Inactive"}
//                   </Badge>
//                 </div>
//                 <CardDescription>Connected {new Date(connection.createdAt).toLocaleDateString()}</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div>
//                     <h3 className="text-sm font-medium">n8n URL</h3>
//                     <p className="text-sm text-muted-foreground">{connection.n8nUrl}</p>
//                   </div>
//                   <div>
//                     <h3 className="text-sm font-medium">Workflows</h3>
//                     {connection.workflows.length === 0 ? (
//                       <p className="text-sm text-muted-foreground">No workflows configured</p>
//                     ) : (
//                       <ul className="mt-2 space-y-2">
//                         {connection.workflows.map((workflow) => (
//                           <li key={workflow.id} className="flex items-center justify-between rounded-md border p-3">
//                             <div className="flex items-center">
//                               <Workflow className="mr-2 h-4 w-4 text-muted-foreground" />
//                               <div>
//                                 <p className="text-sm font-medium">{workflow.name}</p>
//                                 <p className="text-xs text-muted-foreground">
//                                   {workflow.workflowType.replace("_", " ")}
//                                 </p>
//                               </div>
//                             </div>
//                             <Badge variant={workflow.isActive ? "default" : "outline"}>
//                               {workflow.isActive ? "Active" : "Inactive"}
//                             </Badge>
//                           </li>
//                         ))}
//                       </ul>
//                     )}
//                   </div>
//                 </div>
//               </CardContent>
//               <CardFooter className="flex justify-between">
//                 <Button variant="outline" asChild>
//                   <Link href={connection.n8nUrl} target="_blank">
//                     <ExternalLink className="mr-2 h-4 w-4" />
//                     Open n8n
//                   </Link>
//                 </Button>
//                 <div className="flex space-x-2">
//                   <Button variant="outline" asChild>
//                     <Link href={`/dashboard/${slug}/connections/${connection.id}`}>
//                       <Settings className="mr-2 h-4 w-4" />
//                       Manage
//                     </Link>
//                   </Button>
//                   <Button asChild>
//                     <Link href={`/dashboard/${slug}/connections/${connection.id}/workflow/new`}>
//                       <PlusCircle className="mr-2 h-4 w-4" />
//                       Add Workflow
//                     </Link>
//                   </Button>
//                 </div>
//               </CardFooter>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// export default function N8nIntegrationsPage() {
//   return (
//     <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
//       <N8nIntegrationsContent />
//     </ErrorBoundary>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Settings, Workflow, ExternalLink, Loader, AlertTriangle, RefreshCw } from "lucide-react"
import { onUserInfor } from "@/actions/user"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { ErrorBoundary } from "react-error-boundary"

// Define types for our data
interface N8nWorkflow {
  id: string
  name: string
  workflowType: string
  isActive: boolean
}

interface N8nConnection {
  id: string
  name: string
  n8nUrl: string
  isActive: boolean
  createdAt: string
  workflows: N8nWorkflow[] | null
}

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="p-6 text-center">
      <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-red-500">Something went wrong</h2>
      <p className="text-muted-foreground mt-2 mb-4">
        {error.message || "We encountered an error while loading your n8n connections."}
      </p>
      <Button onClick={resetErrorBoundary}>
        <RefreshCw className="mr-2 h-4 w-4" />
        Try Again
      </Button>
    </div>
  )
}

function N8nIntegrationsContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
  const slug = slugMatch ? slugMatch[1] : ""
  const { toast } = useToast()

  const [connections, setConnections] = useState<N8nConnection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check for error or success messages in URL params
  const errorMessage = searchParams.get("error")
  const successMessage = searchParams.get("success")

  useEffect(() => {
    // Show toast for error or success messages from URL
    if (errorMessage) {
      toast({
        title: "Error",
        description: decodeURIComponent(errorMessage),
        variant: "destructive",
      })

      // Clear the error from the URL
      const params = new URLSearchParams(searchParams.toString())
      params.delete("error")
      router.replace(`${pathname}?${params.toString()}`)
    }

    if (successMessage) {
      toast({
        title: "Success",
        description: decodeURIComponent(successMessage),
      })

      // Clear the success message from the URL
      const params = new URLSearchParams(searchParams.toString())
      params.delete("success")
      router.replace(`${pathname}?${params.toString()}`)
    }
  }, [errorMessage, successMessage, toast, router, pathname, searchParams])

  useEffect(() => {
    // Fetch user info and connections
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get user info
        const userResponse = await onUserInfor()
        const userId = userResponse.data?.id

        if (!userId) {
          router.push("/sign-in")
          return
        }

        // Fetch connections
        const response = await fetch(`/api/n8n/connections`)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || "Failed to fetch n8n connections")
        }

        const data = await response.json()
        
        // Ensure each connection has a workflows array
        const processedConnections = (data.connections || []).map((conn: N8nConnection) => ({
          ...conn,
          workflows: conn.workflows || []
        }))
        
        setConnections(processedConnections)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleRefresh = () => {
    setLoading(true)
    setError(null)
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Loading your n8n connections...</p>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <p>{error}</p>
          <Button variant="outline" size="sm" className="w-fit" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">n8n Integrations</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button asChild>
            <Link href={`/dashboard/${slug}/connections/new`}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Connection
            </Link>
          </Button>
        </div>
      </div>

      {connections.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No n8n Connections</CardTitle>
            <CardDescription>Connect your n8n instance to automate lead qualification and nurturing.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              n8n is a powerful workflow automation tool that can help you automate your lead qualification process.
              Connect your n8n instance to get started.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href={`/dashboard/${slug}/connections/new`}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Connection
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid gap-6">
          {connections.map((connection) => (
            <Card key={connection.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{connection.name}</CardTitle>
                  <Badge variant={connection.isActive ? "default" : "outline"}>
                    {connection.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <CardDescription>Connected {new Date(connection.createdAt).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium">n8n URL</h3>
                    <p className="text-sm text-muted-foreground">{connection.n8nUrl}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Workflows</h3>
                    {!connection.workflows || connection.workflows.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No workflows configured</p>
                    ) : (
                      <ul className="mt-2 space-y-2">
                        {connection.workflows.map((workflow) => (
                          <li key={workflow.id} className="flex items-center justify-between rounded-md border p-3">
                            <div className="flex items-center">
                              <Workflow className="mr-2 h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">{workflow.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {workflow.workflowType.replace("_", " ")}
                                </p>
                              </div>
                            </div>
                            <Badge variant={workflow.isActive ? "default" : "outline"}>
                              {workflow.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href={connection.n8nUrl} target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open n8n
                  </Link>
                </Button>
                <div className="flex space-x-2">
                  <Button variant="outline" asChild>
                    <Link href={`/dashboard/${slug}/connections/${connection.id}`}>
                      <Settings className="mr-2 h-4 w-4" />
                      Manage
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href={`/dashboard/${slug}/connections/${connection.id}/workflow/new`}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Workflow
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default function N8nIntegrationsPage() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      <N8nIntegrationsContent />
    </ErrorBoundary>
  )
}



