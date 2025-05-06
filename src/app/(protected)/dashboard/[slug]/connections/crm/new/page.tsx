import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { CrmIntegrationForm } from "@/components/global/lead-qualification/crm-integration-form"
import { onUserInfor } from "@/actions/user"
export default async function NewCrmIntegrationPage() {
    const user = await onUserInfor()
    const  userId  = user.data?.id


  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Connect to CRM</h1>
      <CrmIntegrationForm />
    </div>
  )
}
