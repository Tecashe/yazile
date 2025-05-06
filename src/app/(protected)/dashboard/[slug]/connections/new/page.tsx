import { redirect } from "next/navigation"
import { N8nConnectionForm } from "@/components/global/lead-qualification/n8n-connection-form"
import { onUserInfor } from "@/actions/user"

export default async function NewN8nConnectionPage() {
  const user  = await onUserInfor()
  const userId = user.data?.id

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Connect to n8n</h1>
      <N8nConnectionForm />
    </div>
  )
}

