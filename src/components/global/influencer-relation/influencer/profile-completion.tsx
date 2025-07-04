// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { Check, ChevronRight, Edit, User, Instagram, Youtube, TwitterIcon as TikTok, AlertCircle } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Progress } from "@/components/ui/progress"
// import { getInfluencerProfile } from "@/actions/influencer-relations/influencer"
// import { onBoardUser } from "@/actions/user"

// type ProfileCompletionProps = {
//   className?: string
// }

// export function ProfileCompletion({ className }: ProfileCompletionProps) {
//   const router = useRouter()
//   const [profile, setProfile] = useState<any>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [completionPercentage, setCompletionPercentage] = useState(0)
//   const [missingFields, setMissingFields] = useState<string[]>([])

//   useEffect(() => {
//     async function fetchProfile() {
//       try {
//         setLoading(true)
//         const response = await getInfluencerProfile()

//         if (response.status === 404) {
//           // Profile doesn't exist
//           setProfile(null)
//           setMissingFields(["all"])
//           setCompletionPercentage(0)
//         } else if (response.status === 200) {
//           // Profile exists, check for completeness
//           setProfile(response.data)
//           const missing = getMissingFields(response.data)
//           setMissingFields(missing)
//           setCompletionPercentage(calculateCompletionPercentage(response.data))
//         } else {
//           throw new Error("Failed to fetch profile")
//         }
//       } catch (err) {
//         console.error("Error fetching profile:", err)
//         setError("Failed to load your profile. Please try again.")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchProfile()
//   }, [])

//   // Calculate which fields are missing
//   const getMissingFields = (profile: any): string[] => {
//     const missing: string[] = []

//     if (!profile) return ["all"]

//     if (!profile.profilePicture) missing.push("profilePicture")
//     if (!profile.bio || profile.bio.length < 10) missing.push("bio")
//     if (!profile.niche) missing.push("niche")
//     if (!profile.location) missing.push("location")
//     if (!profile.email) missing.push("email")
//     if (!profile.socialAccounts || profile.socialAccounts.length === 0) missing.push("socialAccounts")
//     if (!profile.rates) missing.push("rates")
//     if (!profile.contentStyle) missing.push("contentStyle")
//     if (!profile.personalityType) missing.push("personalityType")
//     if (!profile.selectedContentDays || profile.selectedContentDays.length === 0) missing.push("contentSchedule")
//     if (!profile.incomeGoal) missing.push("incomeGoal")

//     return missing
//   }

//   // Calculate completion percentage
//   const calculateCompletionPercentage = (profile: any): number => {
//     if (!profile) return 0

//     const totalFields = 11 // Total number of important profile fields
//     const missingCount = getMissingFields(profile).length
//     const completedCount = totalFields - missingCount

//     return Math.round((completedCount / totalFields) * 100)
//   }

//   // Handle continue to onboarding
//   const handleContinueToOnboarding = async () => {
//     try {
//       // If we need to initialize onboarding
//       await onBoardUser()

//       router.push("/onboarding")
//     } catch (err) {
//       console.error("Error starting onboarding:", err)
//       setError("Failed to start onboarding. Please try again.")
//     }
//   }

//   // Handle continue to profile edit
//   const handleEditProfile = () => {
//     router.push("/settings/profile")
//   }

//   if (loading) {
//     return (
//       <Card className={className}>
//         <CardContent className="p-6">
//           <div className="flex items-center justify-center py-8">
//             <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
//           </div>
//         </CardContent>
//       </Card>
//     )
//   }

//   // Profile doesn't exist at all
//   if (!profile) {
//     return (
//       <Card className={`${className} border-amber-200 bg-amber-50`}>
//         <CardHeader className="pb-2">
//           <CardTitle className="text-lg font-semibold text-amber-800">Complete Your Profile</CardTitle>
//           <CardDescription className="text-amber-700">
//             You haven&apos;t set up your influencer profile yet. Complete the onboarding process to get started.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="rounded-lg border border-amber-200 bg-white p-4">
//             <div className="flex items-start gap-3">
//               <div className="mt-1 rounded-full bg-amber-100 p-1.5 text-amber-600">
//                 <AlertCircle className="h-5 w-5" />
//               </div>
//               <div>
//                 <h4 className="font-medium text-amber-800">Why complete your profile?</h4>
//                 <ul className="mt-2 space-y-1 text-sm text-amber-700">
//                   <li className="flex items-center gap-1.5">
//                     <Check className="h-4 w-4 text-green-500" />
//                     <span>Get discovered by brands looking for influencers</span>
//                   </li>
//                   <li className="flex items-center gap-1.5">
//                     <Check className="h-4 w-4 text-green-500" />
//                     <span>Receive personalized campaign opportunities</span>
//                   </li>
//                   <li className="flex items-center gap-1.5">
//                     <Check className="h-4 w-4 text-green-500" />
//                     <span>Track your performance and earnings</span>
//                   </li>
//                   <li className="flex items-center gap-1.5">
//                     <Check className="h-4 w-4 text-green-500" />
//                     <span>Access exclusive brand partnerships</span>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//         <CardFooter>
//           <Button onClick={handleContinueToOnboarding} className="w-full">
//             Start Onboarding <ChevronRight className="ml-1 h-4 w-4" />
//           </Button>
//         </CardFooter>
//       </Card>
//     )
//   }

//   // Profile exists but is incomplete
//   if (completionPercentage < 100) {
//     return (
//       <Card className={`${className} border-amber-200 bg-amber-50`}>
//         <CardHeader className="pb-2">
//           <div className="flex items-center justify-between">
//             <CardTitle className="text-lg font-semibold text-amber-800">Complete Your Profile</CardTitle>
//             <span className="text-sm font-medium text-amber-700">{completionPercentage}% Complete</span>
//           </div>
//           <CardDescription className="text-amber-700">
//             Your profile is incomplete. Add missing information to increase visibility to brands.
//           </CardDescription>
//           <Progress value={completionPercentage} className="mt-2 h-2 bg-amber-200" />
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-3">
//             <h4 className="text-sm font-medium text-amber-800">Missing information:</h4>
//             <div className="grid gap-2 sm:grid-cols-2">
//               {missingFields.includes("profilePicture") && (
//                 <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-white p-2 text-sm">
//                   <User className="h-4 w-4 text-amber-500" />
//                   <span className="text-amber-700">Profile Picture</span>
//                 </div>
//               )}
//               {missingFields.includes("bio") && (
//                 <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-white p-2 text-sm">
//                   <Edit className="h-4 w-4 text-amber-500" />
//                   <span className="text-amber-700">Bio Description</span>
//                 </div>
//               )}
//               {missingFields.includes("niche") && (
//                 <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-white p-2 text-sm">
//                   <Edit className="h-4 w-4 text-amber-500" />
//                   <span className="text-amber-700">Content Niche</span>
//                 </div>
//               )}
//               {missingFields.includes("socialAccounts") && (
//                 <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-white p-2 text-sm">
//                   <Instagram className="h-4 w-4 text-amber-500" />
//                   <span className="text-amber-700">Social Accounts</span>
//                 </div>
//               )}
//               {missingFields.includes("rates") && (
//                 <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-white p-2 text-sm">
//                   <TikTok className="h-4 w-4 text-amber-500" />
//                   <span className="text-amber-700">Content Rates</span>
//                 </div>
//               )}
//               {missingFields.includes("contentStyle") && (
//                 <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-white p-2 text-sm">
//                   <Youtube className="h-4 w-4 text-amber-500" />
//                   <span className="text-amber-700">Content Style</span>
//                 </div>
//               )}
//               {missingFields.length > 6 && (
//                 <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-white p-2 text-sm">
//                   <AlertCircle className="h-4 w-4 text-amber-500" />
//                   <span className="text-amber-700">And {missingFields.length - 6} more...</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </CardContent>
//         <CardFooter className="flex gap-3">
//           <Button onClick={handleEditProfile} className="flex-1">
//             Complete Profile <ChevronRight className="ml-1 h-4 w-4" />
//           </Button>
//           {completionPercentage < 50 && (
//             <Button onClick={handleContinueToOnboarding} variant="outline" className="flex-1">
//               Resume Onboarding
//             </Button>
//           )}
//         </CardFooter>
//       </Card>
//     )
//   }

//   // Profile is complete - return null or a minimal success message
//   return null
// }

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronRight, Edit, User, Instagram, Youtube, TwitterIcon as TikTok, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getInfluencerProfile } from "@/actions/influencer-relations/influencer"
import { onBoardUser } from "@/actions/user"

type ProfileCompletionProps = {
  className?: string
}

export function ProfileCompletion({ className }: ProfileCompletionProps) {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [completionPercentage, setCompletionPercentage] = useState(0)
  const [missingFields, setMissingFields] = useState<string[]>([])

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true)
        const response = await getInfluencerProfile()
        if (response.status === 404) {
          // Profile doesn't exist
          setProfile(null)
          setMissingFields(["all"])
          setCompletionPercentage(0)
        } else if (response.status === 200) {
          // Profile exists, check for completeness
          setProfile(response.data)
          const missing = getMissingFields(response.data)
          setMissingFields(missing)
          setCompletionPercentage(calculateCompletionPercentage(response.data))
        } else {
          throw new Error("Failed to fetch profile")
        }
      } catch (err) {
        console.error("Error fetching profile:", err)
        setError("Failed to load your profile. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  // Calculate which fields are missing
  const getMissingFields = (profile: any): string[] => {
    const missing: string[] = []
    if (!profile) return ["all"]

    if (!profile.profilePicture) missing.push("profilePicture")
    if (!profile.bio || profile.bio.length < 10) missing.push("bio")
    if (!profile.niche) missing.push("niche")
    if (!profile.location) missing.push("location")
    if (!profile.email) missing.push("email")
    if (!profile.socialAccounts || profile.socialAccounts.length === 0) missing.push("socialAccounts")
    if (!profile.rates) missing.push("rates")
    if (!profile.contentStyle) missing.push("contentStyle")
    if (!profile.personalityType) missing.push("personalityType")
    if (!profile.selectedContentDays || profile.selectedContentDays.length === 0) missing.push("contentSchedule")
    if (!profile.incomeGoal) missing.push("incomeGoal")

    return missing
  }

  // Calculate completion percentage
  const calculateCompletionPercentage = (profile: any): number => {
    if (!profile) return 0
    const totalFields = 11 // Total number of important profile fields
    const missingCount = getMissingFields(profile).length
    const completedCount = totalFields - missingCount
    return Math.round((completedCount / totalFields) * 100)
  }

  // Handle continue to onboarding
  const handleContinueToOnboarding = async () => {
    try {
      // If we need to initialize onboarding
      await onBoardUser()
      router.push("/onboarding")
    } catch (err) {
      console.error("Error starting onboarding:", err)
      setError("Failed to start onboarding. Please try again.")
    }
  }

  // Handle continue to profile edit
  const handleEditProfile = () => {
    router.push("/settings/profile")
  }

  if (loading) {
    return (
      <Card className={`${className} glassEffect border-border/50 bg-card/50`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Profile doesn't exist at all
  if (!profile) {
    return (
      <Card className={`${className} border-yellow-500/30 bg-yellow-500/5 glassEffect backdrop-blur-sm`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            Complete Your Profile
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            You haven&apos;t set up your influencer profile yet. Complete the onboarding process to get started.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border border-yellow-500/20 bg-card/30 p-4 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-yellow-500/20 p-1.5 text-yellow-500">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">Why complete your profile?</h4>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Get discovered by brands looking for influencers</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Receive personalized campaign opportunities</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Track your performance and earnings</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Access exclusive brand partnerships</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            onClick={handleContinueToOnboarding}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:scale-105"
          >
            Start Onboarding <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // Profile exists but is incomplete
  if (completionPercentage < 100) {
    return (
      <Card className={`${className} border-orange-500/30 bg-orange-500/5 glassEffect backdrop-blur-sm`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Edit className="h-5 w-5 text-orange-500" />
              Complete Your Profile
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">{completionPercentage}% Complete</span>
              <div className="w-8 h-8 rounded-full border-2 border-orange-500/30 flex items-center justify-center bg-orange-500/10">
                <span className="text-xs font-bold text-orange-500">{completionPercentage}</span>
              </div>
            </div>
          </div>
          <CardDescription className="text-muted-foreground">
            Your profile is incomplete. Add missing information to increase visibility to brands.
          </CardDescription>
          <Progress value={completionPercentage} className="mt-2 h-3 bg-muted/50 border border-border/50" />
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Missing information:</h4>
            <div className="grid gap-2 sm:grid-cols-2">
              {missingFields.includes("profilePicture") && (
                <div className="flex items-center gap-2 rounded-md border border-border/50 bg-card/30 p-2 text-sm backdrop-blur-sm">
                  <User className="h-4 w-4 text-orange-500" />
                  <span className="text-muted-foreground">Profile Picture</span>
                </div>
              )}
              {missingFields.includes("bio") && (
                <div className="flex items-center gap-2 rounded-md border border-border/50 bg-card/30 p-2 text-sm backdrop-blur-sm">
                  <Edit className="h-4 w-4 text-orange-500" />
                  <span className="text-muted-foreground">Bio Description</span>
                </div>
              )}
              {missingFields.includes("niche") && (
                <div className="flex items-center gap-2 rounded-md border border-border/50 bg-card/30 p-2 text-sm backdrop-blur-sm">
                  <Edit className="h-4 w-4 text-orange-500" />
                  <span className="text-muted-foreground">Content Niche</span>
                </div>
              )}
              {missingFields.includes("socialAccounts") && (
                <div className="flex items-center gap-2 rounded-md border border-border/50 bg-card/30 p-2 text-sm backdrop-blur-sm">
                  <Instagram className="h-4 w-4 text-orange-500" />
                  <span className="text-muted-foreground">Social Accounts</span>
                </div>
              )}
              {missingFields.includes("rates") && (
                <div className="flex items-center gap-2 rounded-md border border-border/50 bg-card/30 p-2 text-sm backdrop-blur-sm">
                  <TikTok className="h-4 w-4 text-orange-500" />
                  <span className="text-muted-foreground">Content Rates</span>
                </div>
              )}
              {missingFields.includes("contentStyle") && (
                <div className="flex items-center gap-2 rounded-md border border-border/50 bg-card/30 p-2 text-sm backdrop-blur-sm">
                  <Youtube className="h-4 w-4 text-orange-500" />
                  <span className="text-muted-foreground">Content Style</span>
                </div>
              )}
              {missingFields.length > 6 && (
                <div className="flex items-center gap-2 rounded-md border border-border/50 bg-card/30 p-2 text-sm backdrop-blur-sm">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <span className="text-muted-foreground">And {missingFields.length - 6} more...</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex gap-3">
          <Button
            onClick={handleEditProfile}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:scale-105"
          >
            Complete Profile <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
          {completionPercentage < 50 && (
            <Button
              onClick={handleContinueToOnboarding}
              variant="outline"
              className="flex-1 border-border/50 hover:bg-muted/50 transition-all duration-300 bg-transparent"
            >
              Resume Onboarding
            </Button>
          )}
        </CardFooter>
      </Card>
    )
  }

  // Profile is complete - show success state
  return (
    <Card className={`${className} border-green-500/30 bg-green-500/5 glassEffect backdrop-blur-sm`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-center py-4">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
              <Check className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Profile Complete!</h3>
            <p className="text-sm text-muted-foreground">
              Your influencer profile is fully set up and ready to attract brands.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
