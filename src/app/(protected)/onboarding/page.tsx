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

// export default Page
import { redirect } from 'next/navigation'
import { client } from '@/lib/prisma'
import { onCurrentUser } from '@/actions/user'
import { onUserInfor } from '@/actions/user'

const Page = async () => {
  // Get the authenticated user
  const user = await onCurrentUser()
  
  if (!user) {
    return redirect('/sign-in')
  }
  
  try {
    // Get user info
    const thisuser = await onUserInfor()
    const userId = thisuser?.data?.clerkId
    
    // Check if userId exists before querying
    if (!userId) {
      console.error("No clerkId found in user data:", thisuser)
      return redirect('/onboarding/new') // Redirect to onboarding if no ID
    }
    
    // Now query with a valid userId
    const userInfo = await client.user.findUnique({
      where: { clerkId: userId },
      select: {
        isABusiness: true,
        isInfluencer: true,
      },
    })
    
    if (userInfo?.isABusiness) {
      return redirect('/dashboard')
    }
    
    if (userInfo?.isInfluencer) {
      return redirect('/influencers')
    }
    
    return redirect('/onboarding/new')
  } catch (error) {
    console.error("Error in onboarding page:", error)
    return redirect('/onboarding/new') // Fallback redirect
  }
}

export default Page