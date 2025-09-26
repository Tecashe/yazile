// import { onBoardUser } from '@/actions/user'
// import { redirect } from 'next/navigation'


// type Props = {}

// const Page = async (props: Props) => {
//   const user = await onBoardUser()
//   if (user.status === 200 || user.status === 201) {
//     return redirect(`dashboard/${user.data?.firstname}-${user.data?.lastname}`)
//     // return redirect(`/onboarding`)
//   }

//   return redirect('/setup')
// }

// export default Page
import { onBoardUser } from '@/actions/user'
import { getBusinessProfile } from '@/actions/business' // Import your business profile function
import { redirect } from 'next/navigation'

type Props = {}

const Page = async (props: Props) => {
  const user = await onBoardUser()
  
  // If user is not onboarded, redirect to setup
  if (user.status !== 200 && user.status !== 201) {
    return redirect('/setup')
  }

  // Check if user has a business profile
  const businessProfile = await getBusinessProfile()
  
  // If no business profile exists, redirect to setup
  if (!businessProfile.data) {
    return redirect('/setup')
  }

  // User is onboarded and has a business profile, redirect to dashboard
  return redirect(`dashboard/${user.data?.firstname}-${user.data?.lastname}`)
}

export default Page