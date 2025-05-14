import type { Metadata } from "next"
import { onUserInfor } from "@/actions/user"
import { redirect } from "next/navigation"

import { CustomRequestList } from "@/components/global/n8n/custom-requests/custom-request-list"

export const metadata: Metadata = {
  title: "Custom Workflow Requests | n8n Integration Platform",
  description: "Manage your custom workflow requests",
}

export default async function CustomRequestsPage() {
  const session = await onUserInfor()

  if (!session?.data?.id) {
    redirect("/sign-in")
  }

  return (
    <div className="space-y-8">
     <CustomRequestList showFilters={true} showSearch={true} showCreate={true} />
    </div>
  )
}
