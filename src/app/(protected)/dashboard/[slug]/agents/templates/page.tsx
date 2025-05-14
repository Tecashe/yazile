import type { Metadata } from "next"
import { onUserInfor } from "@/actions/user"
import { redirect } from "next/navigation"

import { TemplateList } from "@/components/global/n8n/n8n/template-list"

export const metadata: Metadata = {
  title: "Templates | n8n Integration Platform",
  description: "Browse workflow templates",
}

export default async function TemplatesPage() {
  const session = await onUserInfor()

  if (!session?.data?.id) {
    redirect("/login")
  }

  return (
    <div className="space-y-8">
     <TemplateList showFilters={true} showSearch={true} limit={50} />
    </div>
  )
}