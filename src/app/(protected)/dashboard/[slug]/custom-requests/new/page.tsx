import type { Metadata } from "next"
import { onUserInfor } from "@/actions/user"
import { redirect } from "next/navigation"

import { CustomRequestForm } from "@/components/global/n8n/custom-requests/custom-request-form"

interface NewCustomRequestPageProps {
  searchParams: {
    templateId?: string
  }
}

export const metadata: Metadata = {
  title: "New Custom Request | n8n Integration Platform",
  description: "Submit a new custom workflow request",
}

export default async function NewCustomRequestPage({ searchParams }: NewCustomRequestPageProps) {
  const session = await onUserInfor()

  if (!session?.data?.id) {
    redirect("/login")
  }

  const { templateId } = searchParams

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Custom Workflow Request</h1>
        <p className="text-muted-foreground">Request a custom workflow tailored to your specific needs</p>
      </div>

      <CustomRequestForm templateId={templateId} />
    </div>
  )
}
