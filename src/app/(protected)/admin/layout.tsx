// export const dynamic = 'force-dynamic'
// import { Analytics } from '@vercel/analytics/next';
// // import { DashboardHeader } from "./components/dashboard-header"
// import "./components/sidebar-styles.css"
// import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
// import type React from "react"
// import { EnhancedSidebar } from "./components/enhanced-sidebar"
// // import { SidebarProvider } from "@/components/ui/sidebar"
// import { Toaster } from "@/components/ui/toaster"
// import { redirect } from "next/navigation"
// import { requireAdmin } from "./utils"
// import { headers } from "next/headers"
// import { ThemeProvider } from "@/providers/theme-provider"
// import { NotificationListener } from "./components/notification-listener"
// import { onBoardUser } from "@/actions/user"

// export default async function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   // Store the current path in headers for logging purposes
//   // headers().set("x-pathname", headers().get("x-pathname") || "/admin")
//   // Get headers asynchronously
//   const headersList = headers();
//   const pathname = headersList.get("x-pathname") || "/admin";

//   const user = await onBoardUser()
//   // Log the pathname if needed
//   console.log("Current admin path:", pathname);

//   // Check if user is admin using the enhanced security function
//   let admin
//   try {
//     admin = await requireAdmin()
//   } catch (error) {
//     console.error("Admin access denied:", error)
//     return redirect(`/dashboard/${user.data?.firstname}-${user.data?.lastname}`)
//   }

//   return (
//     <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
//       <SidebarProvider>
//         <div className="flex h-screen bg-background">
//           <EnhancedSidebar />
//            <SidebarInset className="bg-background">
//           <div className="flex h-full flex-col">
//             {/* <DashboardHeader adminName="Cashe" /> */}
//             <div className="flex-1 overflow-auto p-4">{children}</div>
//             <Analytics />
//           </div>
//         </SidebarInset>
//         </div>
//         <NotificationListener userId={admin.id} />
//         <Toaster />
//       </SidebarProvider>
//     </ThemeProvider>
//   )
// }






export const dynamic = 'force-dynamic'
import { Analytics } from '@vercel/analytics/next';
// import { DashboardHeader } from "./components/dashboard-header"
import "./components/sidebar-styles.css"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import type React from "react"
import { EnhancedSidebar } from "./components/enhanced-sidebar"
// import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { redirect } from "next/navigation"
import { requireAdmin } from "./utils"
import { headers } from "next/headers"
import { ThemeProvider } from "@/providers/theme-provider"
import { NotificationListener } from "./components/notification-listener"
import { onBoardUser } from "@/actions/user"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Store the current path in headers for logging purposes
  // headers().set("x-pathname", headers().get("x-pathname") || "/admin")
  // Get headers asynchronously
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "/admin";

  const user = await onBoardUser()
  // Log the pathname if needed
  console.log("Current admin path:", pathname);

  // Check if user is admin using the enhanced security function
  let admin
  try {
    admin = await requireAdmin()
  } catch (error) {
    console.error("Admin access denied:", error)
    return redirect(`/dashboard/${user.data?.firstname}-${user.data?.lastname}`)
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SidebarProvider>
        <div className="flex h-screen bg-background">
          <EnhancedSidebar />

          <SidebarInset className="bg-background w-full">
            <div className="flex h-full flex-col w-full">
              {/* <DashboardHeader adminName="Cashe" /> */}
              <div className="flex-1 overflow-auto p-4 w-full">{children}</div>
              <Analytics />
            </div>
          </SidebarInset>
        </div>
        <NotificationListener userId={admin.id} />
        <Toaster />
      </SidebarProvider>
    </ThemeProvider>
  )
}










