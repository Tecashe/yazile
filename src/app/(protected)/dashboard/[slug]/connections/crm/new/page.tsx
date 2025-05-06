// import { auth } from "@clerk/nextjs/server"
// import { redirect } from "next/navigation"
// import { CrmIntegrationForm } from "@/components/global/lead-qualification/crm-integration-form"
// import { onUserInfor } from "@/actions/user"
// export default async function NewCrmIntegrationPage() {
//     const user = await onUserInfor()
//     const  userId  = user.data?.id


//   if (!userId) {
//     redirect("/sign-in")
//   }

//   return (
//     <div className="max-w-2xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">Connect to CRM</h1>
//       <CrmIntegrationForm />
//     </div>
//   )
// }

"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ErrorBoundary } from "react-error-boundary"
import { CrmIntegrationForm } from "@/components/global/lead-qualification/crm-integration-form"

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
        <Button variant="outline" onClick={() => router.push(`/dashboard/${slug}/connections/crm`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Integrations
        </Button>
        <Button onClick={resetErrorBoundary}>Try Again</Button>
      </div>
    </div>
  )
}

function NewCrmIntegrationContent() {
  const router = useRouter()
  const pathname = usePathname()
  const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
  const slug = slugMatch ? slugMatch[1] : ""
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Add CRM Integration</h1>
        <Button variant="outline" asChild>
          <Link href={`/dashboard/${slug}/connections/crm`}>
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

      <CrmIntegrationForm />
    </div>
  )
}

export default function NewCrmIntegrationPage() {
  const router = useRouter()
  const pathname = usePathname()
  const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
  const slug = slugMatch ? slugMatch[1] : ""

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => router.push(`/dashboard/${slug}/connections/crm/new`)}
    >
      <NewCrmIntegrationContent />
    </ErrorBoundary>
  )
}
