
// import { UserChat } from "./_components/chats/chats"
// import { verifyDashboardAccess } from "@/lib/auth"
// import { NotificationProvider } from '@/contexts/notification-context'
// import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
// import { AppSidebar } from "@/components/global/sidebar/new/app-sidebar"
// import type React from "react"
// import Navbar from "@/components/global/navbar"
// import { SubscriptionProvider } from "@/contexts/subscription-context"
// import { PrefetchUserAutnomations, PrefetchUserProfile } from "@/react-query/prefetch"
// import { SidebarProvider, SidebarInset } from "@/components/ui/sidebars"

// type Props = {
//   children: React.ReactNode
//   params: { slug: string }
// }

// const Layout = async ({ children, params }: Props) => {
//   const query = new QueryClient()
//   const user = await verifyDashboardAccess(params.slug)

//   await PrefetchUserProfile(query)
//   await PrefetchUserAutnomations(query)

//   return (
//     <HydrationBoundary state={dehydrate(query)}>
//       <SidebarProvider defaultOpen={true}>
//         <AppSidebar slug={params.slug} />
//         <SidebarInset>
//           <div className="flex flex-col min-h-screen">
//             <Navbar slug={params.slug} />
//             <SubscriptionProvider>
//             <main className="flex-1 p-6">
//               {children}
//             </main>
//             </SubscriptionProvider>
            
//             <UserChat userId={user.id} userName={user.fullName} />
//           </div>
//         </SidebarInset>
//       </SidebarProvider>
//     </HydrationBoundary>
//   )
// }

// export default Layout


// Updated layout.tsx
import { UserChat } from "./_components/chats/chats"
import { verifyDashboardAccess } from "@/lib/auth"
import { NotificationProvider } from '@/contexts/notification-context'
import { NotificationPanelProvider } from '@/contexts/notification-panel-context'
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { AppSidebar } from "@/components/global/sidebar/new/app-sidebar"
import type React from "react"
import Navbar from "@/components/global/navbar"
import { SubscriptionProvider } from "@/contexts/subscription-context"
import { PrefetchUserAutnomations, PrefetchUserProfile } from "@/react-query/prefetch"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebars"
import { SlidingNotificationPanel } from "@/components/global/navbar/notifications/SlidingNotificationPanel"

type Props = {
  children: React.ReactNode
  params: { slug: string }
}

const Layout = async ({ children, params }: Props) => {
  const query = new QueryClient()
  const user = await verifyDashboardAccess(params.slug)

  await PrefetchUserProfile(query)
  await PrefetchUserAutnomations(query)

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <NotificationProvider>
        <NotificationPanelProvider>
          <SidebarProvider defaultOpen={true}>
            <AppSidebar slug={params.slug} />
            <SidebarInset>
              <div className="flex flex-col min-h-screen">
                <Navbar slug={params.slug} />
                <SubscriptionProvider>
                  <main className="flex-1 p-6">
                    {children}
                  </main>
                </SubscriptionProvider>
                
                <UserChat userId={user.id} userName={user.fullName} />
              </div>
            </SidebarInset>
            
            {/* Sliding Notification Panel - positioned outside SidebarInset to avoid conflicts */}
            <SlidingNotificationPanel />
          </SidebarProvider>
        </NotificationPanelProvider>
      </NotificationProvider>
    </HydrationBoundary>
  )
}

export default Layout
