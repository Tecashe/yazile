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

// import { redirect } from 'next/navigation'
// import { client } from '@/lib/prisma'
// import { onCurrentUser } from '@/actions/user'
// import { onUserInfor } from '@/actions/user'

// const Page = async () => {
//   const user = await onCurrentUser()
//   const thisuser =  await onUserInfor()
//   const userid = thisuser.data?.id

//   if (!user) {
//     return redirect('/sign-in')
//   }

//   const [userBusiness, userInfluencer] = await Promise.all([
//     client.business.findFirst({ where: { userId: userid } }),
//     client.influencer.findFirst({ where: { userId: userid } }),
//   ])

//   if (userBusiness) {
//     return redirect('/dashboard')
//   }

//   if (userInfluencer) {
//     return redirect('/influencer')
//   }

//   return redirect('/onboarding/new')
// }

// export default Page

// import { redirect } from 'next/navigation'
// import { client } from '@/lib/prisma'
// import { onCurrentUser } from '@/actions/user'
// import { onUserInfor } from '@/actions/user'


// const Page = async () => {
//   const user = await onCurrentUser()
//   const thisuser =  await onUserInfor()
//   const userId = thisuser.data?.clerkId


//   if (!user) {
//     return redirect('/sign-in')
//   }

//   const userInfo = await client.user.findUnique({
//     where: { clerkId: userId },
//     select: {
//       isABusiness: true,
//       isInfluencer: true,
//     },
//   })

//   if (userInfo?.isABusiness) {
//     return redirect('/dashboard')
//   }

//   if (userInfo?.isInfluencer) {
//     return redirect('/influencers')
//   }

//   return redirect('/onboarding/new')
// }
import { redirect } from 'next/navigation'
import { client } from '@/lib/prisma'
import { onCurrentUser } from '@/actions/user'
import { onUserInfor } from '@/actions/user'

const Page = async () => {
  // Step 1: Get the currently signed-in user from Clerk
  const user = await onCurrentUser()

  if (!user) {
    // Step 2: If no user, force them to sign in
    return redirect('/sign-in')
  }

  // Step 3: Fetch user info from your Prisma database
  const thisuser =  await onUserInfor()
  const userId = thisuser.data?.clerkId

  const userInfo = await client.user.findUnique({
    where: { clerkId: userId }, // clerkId matches Clerk's user.id
    select: {
      isABusiness: true,
      isInfluencer: true,
    },
  })

  // Step 4: If they already have a role, send them where they belong
  if (userInfo?.isABusiness) {
    return redirect('/dashboard')
  }

  if (userInfo?.isInfluencer) {
    return redirect('/influencer')
  }

  // Step 5: If no role yet (completely fresh), send to onboarding
  return redirect('/onboarding/new')
}

export default Page
