
// import { UserChat } from "./_components/chats/chats"
// import { verifyDashboardAccess } from "@/lib/auth"
// import {
//   dehydrate,
//   HydrationBoundary,
//   QueryClient,
// } from '@tanstack/react-query'
// import Sidebar from '@/components/global/sidebar'
// import React from 'react'
// import Navbar from '@/components/global/navbar'
// import {
//   PrefetchUserAutnomations,
//   PrefetchUserProfile,
// } from '@/react-query/prefetch'

// type Props = {
//     children: React.ReactNode
//     params: { slug: string }
// }

// const Layout = async ({ children, params }: Props) => {
//   const query = new QueryClient()
//   const user = await verifyDashboardAccess(params.slug)

//   await PrefetchUserProfile(query)
//   await PrefetchUserAutnomations(query)

//   return (
//     <HydrationBoundary state={dehydrate(query)}>
//       <div className='p-3'>
//         <Sidebar slug={params.slug} />
//         <div 
//           className="
//             lg:ml-[250px] 
//             lg:pl-10 
//             lg:py-5 
//             flex 
//             flex-col 
//             overflow-auto
//           "
//         >
//           <Navbar slug={params.slug} />
//           {children}
//           <UserChat userId={user.id} userName={user.fullName} />
//         </div>
//       </div>
//     </HydrationBoundary>
//   )
// }

// export default Layout

// import { UserChat } from "./_components/chats/chats"
// import { verifyDashboardAccess } from "@/lib/auth"
// import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
// import { AppSidebar } from "@/components/global/sidebar/new/app-sidebar"
// import type React from "react"
// import Navbar from "@/components/global/navbar"
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
//             <main className="flex-1 p-6">{children}</main>
//             <UserChat userId={user.id} userName={user.fullName} />
//           </div>
//         </SidebarInset>
//       </SidebarProvider>
//     </HydrationBoundary>
//   )
// }

// export default Layout

import { UserChat } from "./_components/chats/chats"
import { verifyDashboardAccess } from "@/lib/auth"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { AppSidebar } from "@/components/global/sidebar/new/app-sidebar"
import type React from "react"
import Navbar from "@/components/global/navbar"
import { PrefetchUserAutnomations, PrefetchUserProfile } from "@/react-query/prefetch"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Suspense } from "react"

type Props = {
  children: React.ReactNode
  params: { slug: string }
}

function SidebarFallback() {
  return (
    <div className="flex h-screen">
      <div className="w-64 bg-sidebar border-r border-border animate-pulse">
        <div className="p-4 space-y-4">
          <div className="h-12 bg-muted rounded"></div>
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-8 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="h-16 bg-background border-b border-border animate-pulse"></div>
        <div className="flex-1 p-6">
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Layout = async ({ children, params }: Props) => {
  const query = new QueryClient()

  try {
    const user = await verifyDashboardAccess(params.slug)

    await PrefetchUserProfile(query)
    await PrefetchUserAutnomations(query)

    return (
      <HydrationBoundary state={dehydrate(query)}>
        <Suspense fallback={<SidebarFallback />}>
          <SidebarProvider defaultOpen={true}>
            <AppSidebar slug={params.slug} />
            <SidebarInset>
              <div className="flex flex-col min-h-screen">
                <Navbar slug={params.slug} />
                <main className="flex-1 p-6">{children}</main>
                <UserChat userId={user.id} userName={user.fullName} />
              </div>
            </SidebarInset>
          </SidebarProvider>
        </Suspense>
      </HydrationBoundary>
    )
  } catch (error) {
    console.error("Layout error:", error)
    return <SidebarFallback />
  }
}

export default Layout
