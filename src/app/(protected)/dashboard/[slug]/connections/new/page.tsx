// import { redirect } from "next/navigation"
// import { N8nConnectionForm } from "@/components/global/lead-qualification/n8n-connection-form"
// import { onUserInfor } from "@/actions/user"

// export default async function NewN8nConnectionPage() {
//   const user  = await onUserInfor()
//   const userId = user.data?.id

//   if (!userId) {
//     redirect("/sign-in")
//   }

//   return (
//     <div className="max-w-2xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">Connect to n8n</h1>
//       <N8nConnectionForm />
//     </div>
//   )
// }

"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ErrorBoundary } from "react-error-boundary"

// Form schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  n8nUrl: z.string().url("Please enter a valid n8n URL"),
  apiKey: z.string().min(1, "API key is required"),
})

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  const router = useRouter()
  const pathname = usePathname()
  const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
  const slug = slugMatch ? slugMatch[1] : ""

  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold text-red-500">Something went wrong</h2>
      <p className="text-muted-foreground mt-2 mb-4">
        {error.message || "We encountered an error while loading the form."}
      </p>
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={() => router.push(`/dashboard/${slug}/connections/`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Connections
        </Button>
        <Button onClick={resetErrorBoundary}>Try Again</Button>
      </div>
    </div>
  )
}

function NewN8nConnectionContent() {
  const router = useRouter()
  const pathname = usePathname()
  const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
  const slug = slugMatch ? slugMatch[1] : ""

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle")
  const [testMessage, setTestMessage] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      n8nUrl: "",
      apiKey: "",
    },
  })

  async function testConnection() {
    const values = form.getValues()

    if (!values.n8nUrl || !values.apiKey) {
      form.trigger(["n8nUrl", "apiKey"])
      return
    }

    try {
      setTestStatus("testing")
      setTestMessage(null)

      const response = await fetch("/api/n8n/test-connection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          n8nUrl: values.n8nUrl,
          apiKey: values.apiKey,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || "Connection test failed")
      }

      setTestStatus("success")
      setTestMessage("Connection successful! Your n8n instance is reachable.")
    } catch (err) {
      console.error("Error testing connection:", err)
      setTestStatus("error")
      setTestMessage(err instanceof Error ? err.message : "Failed to connect to n8n instance")
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      setError(null)

      const response = await fetch("/api/n8n/connections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to create n8n connection")
      }

      // Redirect with success message
      router.push(
        `/dashboard/${slug}/connections/?success=${encodeURIComponent("n8n connection created successfully")}`,
      )
    } catch (err) {
      console.error("Error creating n8n connection:", err)
      setError(err instanceof Error ? err.message : "An error occurred while creating the connection")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Add n8n Connection</h1>
        <Button variant="outline" asChild>
          <Link href={`/dashboard/${slug}/connections`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Connect to n8n</CardTitle>
          <CardDescription>
            Enter your n8n instance details to connect it to your lead qualification system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Connection Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My n8n Connection" {...field} />
                    </FormControl>
                    <FormDescription>A friendly name to identify this connection</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="n8nUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>n8n URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://n8n.example.com" {...field} />
                    </FormControl>
                    <FormDescription>The URL of your n8n instance</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Key</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Your n8n API key" {...field} />
                    </FormControl>
                    <FormDescription>Your n8n API key or access token</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {testStatus === "success" && (
                <Alert className="bg-green-50 text-green-800 border-green-200">
                  <AlertTitle>Connection Successful</AlertTitle>
                  <AlertDescription>{testMessage}</AlertDescription>
                </Alert>
              )}

              {testStatus === "error" && (
                <Alert variant="destructive">
                  <AlertTitle>Connection Failed</AlertTitle>
                  <AlertDescription>{testMessage}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={testConnection}
                  disabled={isSubmitting || testStatus === "testing"}
                >
                  {testStatus === "testing" && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                  {testStatus === "testing" ? "Testing..." : "Test Connection"}
                </Button>

                <div className="flex gap-4">
                  <Button type="button" variant="outline" asChild>
                    <Link href={`/dashboard/${slug}/connections`}>Cancel</Link>
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? "Creating..." : "Create Connection"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function NewN8nConnectionPage() {
  const router = useRouter()
  const pathname = usePathname()
  const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
  const slug = slugMatch ? slugMatch[1] : ""

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => router.push(`/dashboard/${slug}/connections/new`)}
    >
      <NewN8nConnectionContent />
    </ErrorBoundary>
  )
}
