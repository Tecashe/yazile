
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




import { UserChat } from "./_components/chats/chats"
import { verifyDashboardAccess } from "@/lib/auth"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import Sidebar from '@/components/global/sidebar'
import React from 'react'
import Navbar from '@/components/global/navbar'
import {
  PrefetchUserAutnomations,
  PrefetchUserProfile,
} from '@/react-query/prefetch'
import { cn } from "@/lib/utils"

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
      <div className={cn(
        "min-h-screen bg-background text-foreground radial--gradient--automations",
        "transition-colors duration-300 ease-in-out"
      )}>
        {/* Sidebar with dark theme variables */}
        <Sidebar 
          slug={params.slug} 
          className={cn(
            "fixed inset-y-0 z-30 hidden w-64 border-r border-sidebar-border",
            "bg-sidebar text-sidebar-foreground shadow-sm transition-all duration-300",
            "ease-in-out hover:shadow-md"
          )} 
        />
        
        {/* Main content area */}
        <div className="lg:pl-64">
          {/* Glass morphism navbar */}
          <Navbar 
            slug={params.slug}
            className={cn(
              "sticky top-0 z-20 bg-background/80 backdrop-blur-md",
              "border-b border-border transition-shadow duration-200",
              "shadow-sm hover:shadow-md glassEffect"
            )}
          />
          
          {/* Content container with subtle gradient */}
          <main className="px-4 py-6 sm:px-6 lg:px-8">
            <div className={cn(
              "mx-auto max-w-7xl rounded-lg bg-card p-6",
              "shadow-xs transition-all duration-300 border border-border",
              "hover:shadow-sm radial--double--gradient--cards--top",
              "radial--double--gradient--cards--bottom"
            )}>
              {children}
            </div>
          </main>
          
          {/* Floating chat widget */}
          <UserChat 
            userId={user.id} 
            userName={user.fullName}
            className={cn(
              "fixed bottom-6 right-6 z-40 shadow-lg glow",
              "transition-transform hover:scale-105 hover:glowHover",
              "bg-card border border-border"
            )}
          />
        </div>
      </div>
    </HydrationBoundary>
  )
}

export default Layout