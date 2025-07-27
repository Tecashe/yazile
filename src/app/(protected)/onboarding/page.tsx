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




// import { onBoardUser } from '@/actions/user'


// type Props = {}

// const Page = async (props: Props) => {
//   const user = await onBoardUser()
//   if (user.status === 200 || user.status === 201) {
//     return redirect(`dashboard/${user.data?.firstname}-${user.data?.lastname}`)
//     // return redirect(`/onboarding`)
//   }

//   return redirect('/sign-in')
// }

// export default Page


// import { redirect } from 'next/navigation'
// import { client } from '@/lib/prisma'
// import { onBoardUser } from '@/actions/user'
// import { onCurrentUser } from '@/actions/user'
// import { onUserInfor } from '@/actions/user'

// const Page = async () => {
//   // Step 1: Get the currently signed-in user from Clerk
//   const user = await onBoardUser()

//   if (user.status === 200 || user.status === 201) {
//     // Step 2: If no user, force them to sign in
//     return redirect('/sign-in')
//   }

//   // Step 3: Fetch user info from your Prisma database
//   const thisuser =  await onUserInfor()
//   const userId = thisuser.data?.id

//   const userInfo = await client.user.findUnique({
//     where: { id: userId }, // clerkId matches Clerk's user.id
//     select: {
//       isABusiness: true,
//       isInfluencer: true,
//     },
//   })

//   // Step 4: If they already have a role, send them where they belong
//   if (userInfo?.isABusiness) {
//     return redirect('/dashboard')
//   }

//   if (userInfo?.isInfluencer) {
//     return redirect('/influencer')
//   }

//   // Step 5: If no role yet (completely fresh), send to onboarding
//   return redirect('/onboarding/new')
// }

// export default Page







import { redirect } from 'next/navigation'
import { client } from '@/lib/prisma'
import { onBoardUser, onUserInfor } from '@/actions/user'

const Page = async () => {
  // Step 1: Make sure user is onboarded (or created if new)
  const onboardingResult = await onBoardUser()

  if (onboardingResult.status === 500) {
    console.error("Failed to onboard or create user.")
    return redirect('/sign-in') // fallback if onboarding fails
  }

  // Step 2: Get the user's database profile
  const userInfoResult = await onUserInfor()

  if (userInfoResult.status !== 200 || !userInfoResult.data) {
    console.error("User info missing after onboarding.")
    return redirect('/sign-in') // fallback if somehow user still missing
  }

  const userId = userInfoResult.data.id

  // Step 3: Check role (isABusiness or isInfluencer)
  const userStatus = await client.user.findUnique({
    where: { id: userId },
    select: {
      isABusiness: true,
      isInfluencer: true,
    },
  })

  if (userStatus?.isABusiness) {
    return redirect('/dashboard')
  }

  if (userStatus?.isInfluencer) {
    return redirect('/influencer')
  }

  // Step 4: If no roles are assigned, go to onboarding flow
  return redirect('/onboarding/new')
}

export default Page




