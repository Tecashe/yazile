
"use client"

import { useQuery } from "@tanstack/react-query"
import { onUserInfo } from "@/actions/user"

import InstagramDashboard from "@/components/global/integrations/my-info"
import { Loader2 } from "lucide-react"

export default function InstagramDashboardPage() {
  // Fetch user data
  const { data: userData, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: onUserInfo,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const userId = userData?.data?.clerkId || "237462617"

  return <InstagramDashboard userId={userId} />
}