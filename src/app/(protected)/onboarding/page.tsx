// import { onBoardUser } from '@/actions/user'
// import { redirect } from 'next/navigation'
// import {client} from '@/lib/prisma'
// import {onCurrentUser} from '@/actions/user'
// import React from 'react'

// type Props = {}

// const Page = async (props: Props) => {
//   const user = await onCurrentUser()
//   if (!user) {
//     return redirect('/sign-in')
//   }
//   if (user && client.business) {
//     return redirect('/dashboard')
//   }

//   if (user && client.influencer) {
//     return redirect('/influencer')
//   }

//   return redirect('/onboarding/new')
// }

// export default Page

import { redirect } from 'next/navigation'
import { client } from '@/lib/prisma'
import { onCurrentUser } from '@/actions/user'

const Page = async () => {
  const user = await onCurrentUser()

  if (!user) {
    return redirect('/sign-in')
  }

  const [userBusiness, userInfluencer] = await Promise.all([
    client.business.findFirst({ where: { userId: user.id } }),
    client.influencer.findFirst({ where: { userId: user.id } }),
  ])

  if (userBusiness) {
    return redirect('/dashboard')
  }

  if (userInfluencer) {
    return redirect('/influencer')
  }

  return redirect('/onboarding/new')
}

export default Page
