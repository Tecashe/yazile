// import type { Metadata } from "next"
// import { onUserInfor } from "@/actions/user"
// import { redirect } from "next/navigation"

// import { TemplateList } from "@/components/global/n8n/n8n/template-list"

// export const metadata: Metadata = {
//   title: "Templates | n8n Integration Platform",
//   description: "Browse workflow templates",
// }

// export default async function TemplatesPage() {
//   const session = await onUserInfor()

//   if (!session?.data?.id) {
//     redirect("/login")
//   }

//   return (
//     <div className="space-y-8">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Workflow Templates</h1>
//         <p className="text-muted-foreground">Browse and select from our library of pre-built workflow templates</p>
//       </div>

//       <TemplateList showFilters={true} showSearch={true} limit={50} />
//     </div>
//   )
// }


import type { Metadata } from "next"
import TemplatesPageClient from "@/components/global/workflows/templates-page-client"

export const metadata: Metadata = {
  title: "Templates | n8n Integration Platform",
  description: "Browse workflow templates",
}

export default async function TemplatesPage() {
  return <TemplatesPageClient />
}
