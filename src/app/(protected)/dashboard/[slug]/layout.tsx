
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Sidebar with subtle shadow and smooth transition */}
        <Sidebar slug={params.slug} className="fixed inset-y-0 z-30 hidden w-64 border-r border-gray-200 bg-white shadow-sm transition-all duration-300 ease-in-out lg:block" />
        
        {/* Main content area with professional spacing */}
        <div className="lg:pl-64">
          {/* Sticky navbar with glass morphism effect */}
          <Navbar 
            slug={params.slug} 
            className={cn(
              "sticky top-0 z-20 bg-white/80 backdrop-blur-md",
              "border-b border-gray-200 transition-shadow duration-200",
              "shadow-sm hover:shadow-md"
            )}
          />
          
          {/* Content container with elegant padding and max-width */}
          <main className="px-4 py-6 sm:px-6 lg:px-8">
            <div className={cn(
              "mx-auto max-w-7xl rounded-xl bg-white p-6",
              "shadow-xs transition-all duration-300",
              "hover:shadow-sm border border-gray-100"
            )}>
              {children}
            </div>
          </main>
          
          {/* Chat widget with subtle positioning */}
          <div className="fixed bottom-6 right-6 z-40 transition-transform hover:scale-105">
            <UserChat 
              userId={user.id} 
              userName={user.fullName} 
              className="shadow-lg"
            />
          </div>
        </div>
      </div>
    </HydrationBoundary>
  )
}

export default Layout