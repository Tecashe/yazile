// import PaymentPage from "@/components/global/billing/payment-page"

// export default function PaymentPageRoute() {
//   return <PaymentPage />
// }

"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import PaymentPage from "@/components/global/billing/payment-page"
import { Skeleton } from "@/components/ui/skeleton"

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

export default function PaymentRoute() {
  const searchParams = useSearchParams()
  const [planDetails, setPlanDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get plan details from URL parameters
    const planId = searchParams.get("plan")
    const billingCycle = searchParams.get("billing")

    // Try to get detailed plan info from session storage (set by pricing page)
    const storedPlanDetails = sessionStorage.getItem("selectedPlan")

    if (storedPlanDetails) {
      setPlanDetails(JSON.parse(storedPlanDetails))
      setLoading(false)
      return
    }

    // If no stored details, fetch plan details from API
    if (planId) {
      fetchPlanDetails(planId, billingCycle || "monthly")
    } else {
      // No plan selected, redirect to pricing page
      window.location.href = "/pricing"
    }
  }, [searchParams])

  const fetchPlanDetails = async (planId: string, billingCycle: string) => {
    try {
      const response = await fetch(`/api/plans/${planId}?billing=${billingCycle}`)

      if (!response.ok) {
        throw new Error("Failed to fetch plan details")
      }

      const data = await response.json()
      setPlanDetails(data)
    } catch (error) {
      console.error("Error fetching plan details:", error)
      // Handle error - maybe redirect to pricing page
      window.location.href = "/pricing?error=invalid-plan"
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-1/3 mb-6" />
          <Skeleton className="h-6 w-1/2 mb-12" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-8 w-full mb-4" />
              <Skeleton className="h-64 w-full mb-8" />
              <Skeleton className="h-12 w-full" />
            </div>
            <div>
              <Skeleton className="h-80 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise}>
      <PaymentPage selectedPlan={planDetails} />
    </Elements>
  )
}
