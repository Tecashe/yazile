
import { redirect } from "next/navigation"
import { N8nWorkflowForm } from "@/components/global/lead-qualification/n8n-workflow-form"
import { onUserInfor } from "@/actions/user"

export default async function NewN8nWorkflowPage({ params }: { params: { id: string } }) {
    const user = await onUserInfor()
    const  userId  = user.data?.id


  if (!userId) {
    redirect("/sign-in")
  }

  const connectionId = params.id

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add n8n Workflow</h1>
      <N8nWorkflowForm connectionId={connectionId} />
    </div>
  )
}
