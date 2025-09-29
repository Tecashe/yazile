import { onBoardUser } from '@/actions/user'
import { redirect } from 'next/navigation'

type Props = {}

const Page = async (props: Props) => {
  const user = await onBoardUser()
  
  return redirect(`dashboard/${user.data?.firstname}-${user.data?.lastname}/socials`)
}

export default Page