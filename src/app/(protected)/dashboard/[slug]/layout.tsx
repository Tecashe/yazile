
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
      <div className='p-3'>
        <Sidebar slug={params.slug} />
        <div 
          className="
            lg:ml-[250px] 
            lg:pl-10 
            lg:py-5 
            flex 
            flex-col 
            overflow-auto
          "
        >
          <Navbar slug={params.slug} />
          {children}
          <UserChat userId={user.id} userName={user.fullName} />
        </div>
      </div>
    </HydrationBoundary>
  )
}

export default Layout
