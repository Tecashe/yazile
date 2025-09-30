
// import { client } from "@/lib/prisma"
// import { stripe, PLAN_PRICE_IDS, mapStripeStatusToEnum } from "@/lib/stripe"
// import { SUBSCRIPTION_PLAN, SUBSCRIPTION_STATUS } from "@/contexts/subscription-context"

// // Create or update a subscription
// export async function upsertSubscription(userId: string, stripeData: any) {
//   const {
//     customerId,
//     subscriptionId,
//     priceId,
//     status,
//     currentPeriodStart,
//     currentPeriodEnd,
//     cancelAtPeriodEnd,
//     canceledAt,
//     paymentMethodId,
//     paymentMethodType,
//     paymentMethodLast4,
//   } = stripeData

//   // Determine plan from priceId
//   let plan: SUBSCRIPTION_PLAN = "FREE"
//   if (priceId === PLAN_PRICE_IDS.PRO) plan = "PRO"
//   if (priceId === PLAN_PRICE_IDS.TEAM) plan = "ENTERPRISE"

//   // Convert string status to enum
//   const subscriptionStatus = mapStripeStatusToEnum(status) as SUBSCRIPTION_STATUS

//   return client.subscription.upsert({
//     where: { userId },
//     update: {
//       plan,
//       status: subscriptionStatus,
//       customerId,
//       stripeSubscriptionId: subscriptionId,
//       stripePriceId: priceId,
//       stripeCurrentPeriodStart: currentPeriodStart ? new Date(currentPeriodStart * 1000) : undefined,
//       stripeCurrentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : undefined,
//       cancelAtPeriodEnd: cancelAtPeriodEnd || false,
//       canceledAt: canceledAt ? new Date(canceledAt * 1000) : null,
//       paymentMethodId,
//       paymentMethodType,
//       paymentMethodLast4,
//     },
//     create: {
//       userId,
//       plan,
//       status: subscriptionStatus,
//       customerId,
//       stripeSubscriptionId: subscriptionId,
//       stripePriceId: priceId,
//       stripeCurrentPeriodStart: currentPeriodStart ? new Date(currentPeriodStart * 1000) : undefined,
//       stripeCurrentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : undefined,
//       cancelAtPeriodEnd: cancelAtPeriodEnd || false,
//       canceledAt: canceledAt ? new Date(canceledAt * 1000) : null,
//       paymentMethodId,
//       paymentMethodType,
//       paymentMethodLast4,
//     },
//   })
// }

// // Get user subscription
// export async function getUserSubscription(userId: string) {
//   return client.subscription.findUnique({
//     where: { userId },
//   })
// }

// // Check if user has access to a feature
// export async function hasAccess(userId: string, requiredPlan: "PRO" | "ENTERPRISE") {
//   const subscription = await getUserSubscription(userId)
  
//   if (!subscription) return false
  
//   // If subscription is not active, user doesn't have access
//   if (subscription.status !== "ACTIVE" && subscription.status !== "TRIALING") {
//     return false
//   }
  
//   // Check if user's plan meets the required level
//   if (requiredPlan === "PRO") {
//     return ["PRO", "ENTERPRISE"].includes(subscription.plan as string)
//   }
  
//   if (requiredPlan === "ENTERPRISE") {
//     return subscription.plan === "ENTERPRISE"
//   }
  
//   return false
// }

// // Create a Stripe customer portal session
// export async function createBillingPortalSession(customerId: string) {
//   const session = await stripe.billingPortal.sessions.create({
//     customer: customerId,
//     return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
//   })
  
//   return session.url
// }


import { client } from "@/lib/prisma"
import { SUBSCRIPTION_PLAN, SUBSCRIPTION_STATUS } from "@/contexts/subscription-context"

export type PaymentProvider = "stripe" | "pesapal"

export interface SubscriptionData {
  customerId?: string | null
  subscriptionId?: string | null
  orderTrackingId?: string | null // Pesapal specific
  priceId?: string | null
  status: SUBSCRIPTION_STATUS
  currentPeriodStart?: number | null
  currentPeriodEnd?: number | null
  cancelAtPeriodEnd?: boolean
  canceledAt?: number | null
  paymentMethodId?: string | null
  paymentMethodType?: string | null
  paymentMethodLast4?: string | null
  paymentProvider: PaymentProvider
  plan: SUBSCRIPTION_PLAN
}

// Pesapal price IDs mapping (adjust these to match your actual Pesapal plan IDs)
export const PESAPAL_PLAN_IDS = {
  PRO: "pesapal_pro_plan",
  ENTERPRISE: "pesapal_enterprise_plan",
}

// Upsert subscription in database
export async function upsertSubscription(userId: string, data: SubscriptionData) {
  try {
    const subscription = await client.subscription.upsert({
      where: { userId },
      update: {
        plan: data.plan,
        status: data.status,
        customerId: data.customerId,
        stripeSubscriptionId: data.subscriptionId,
        orderTrackingId: data.orderTrackingId,
        stripePriceId: data.priceId,
        stripeCurrentPeriodStart: data.currentPeriodStart 
          ? new Date(data.currentPeriodStart * 1000) 
          : null,
        stripeCurrentPeriodEnd: data.currentPeriodEnd 
          ? new Date(data.currentPeriodEnd * 1000) 
          : null,
        cancelAtPeriodEnd: data.cancelAtPeriodEnd ?? false,
        canceledAt: data.canceledAt 
          ? new Date(data.canceledAt * 1000) 
          : null,
        paymentMethodId: data.paymentMethodId,
        paymentMethodType: data.paymentMethodType,
        paymentMethodLast4: data.paymentMethodLast4,
        paymentProvider: data.paymentProvider,
      },
      create: {
        userId,
        plan: data.plan,
        status: data.status,
        customerId: data.customerId,
        stripeSubscriptionId: data.subscriptionId,
        orderTrackingId: data.orderTrackingId,
        stripePriceId: data.priceId,
        stripeCurrentPeriodStart: data.currentPeriodStart 
          ? new Date(data.currentPeriodStart * 1000) 
          : null,
        stripeCurrentPeriodEnd: data.currentPeriodEnd 
          ? new Date(data.currentPeriodEnd * 1000) 
          : null,
        cancelAtPeriodEnd: data.cancelAtPeriodEnd ?? false,
        canceledAt: data.canceledAt 
          ? new Date(data.canceledAt * 1000) 
          : null,
        paymentMethodId: data.paymentMethodId,
        paymentMethodType: data.paymentMethodType,
        paymentMethodLast4: data.paymentMethodLast4,
        paymentProvider: data.paymentProvider,
      },
    })

    return subscription
  } catch (error) {
    console.error("Error upserting subscription:", error)
    throw error
  }
}

// Get user subscription
export async function getUserSubscription(userId: string) {
  try {
    const subscription = await client.subscription.findUnique({
      where: { userId },
    })

    return subscription
  } catch (error) {
    console.error("Error fetching subscription:", error)
    return null
  }
}

// Update subscription status
export async function updateSubscriptionStatus(
  userId: string,
  status: SUBSCRIPTION_STATUS,
  additionalData?: Partial<SubscriptionData>
) {
  try {
    const updateData: any = {
      status,
    }

    if (additionalData) {
      if (additionalData.currentPeriodStart) {
        updateData.stripeCurrentPeriodStart = new Date(additionalData.currentPeriodStart * 1000)
      }
      if (additionalData.currentPeriodEnd) {
        updateData.stripeCurrentPeriodEnd = new Date(additionalData.currentPeriodEnd * 1000)
      }
      if (additionalData.canceledAt) {
        updateData.canceledAt = new Date(additionalData.canceledAt * 1000)
      }
      if (additionalData.cancelAtPeriodEnd !== undefined) {
        updateData.cancelAtPeriodEnd = additionalData.cancelAtPeriodEnd
      }
      if (additionalData.orderTrackingId) {
        updateData.orderTrackingId = additionalData.orderTrackingId
      }
      if (additionalData.plan) {
        updateData.plan = additionalData.plan
      }
    }

    const subscription = await client.subscription.update({
      where: { userId },
      data: updateData,
    })

    return subscription
  } catch (error) {
    console.error("Error updating subscription status:", error)
    throw error
  }
}

// Cancel subscription
export async function cancelSubscription(userId: string) {
  try {
    const subscription = await client.subscription.update({
      where: { userId },
      data: {
        status: "CANCELED",
        canceledAt: new Date(),
        cancelAtPeriodEnd: true,
      },
    })

    return subscription
  } catch (error) {
    console.error("Error canceling subscription:", error)
    throw error
  }
}

// Check if user has access to a feature
export async function hasAccess(userId: string, requiredPlan: "PRO" | "ENTERPRISE") {
  const subscription = await getUserSubscription(userId)
  
  if (!subscription) return false
  
  // If subscription is not active, user doesn't have access
  if (subscription.status !== "ACTIVE" && subscription.status !== "TRIALING") {
    return false
  }
  
  // Check if user's plan meets the required level
  if (requiredPlan === "PRO") {
    return ["PRO", "ENTERPRISE"].includes(subscription.plan as string)
  }
  
  if (requiredPlan === "ENTERPRISE") {
    return subscription.plan === "ENTERPRISE"
  }
  
  return false
}

// Get subscription plan details
export function getSubscriptionPlan(subscription: any): SUBSCRIPTION_PLAN {
  if (!subscription || subscription.status !== "ACTIVE") {
    return "FREE"
  }

  return subscription.plan as SUBSCRIPTION_PLAN
}

// Check if subscription is active
export function isSubscriptionActive(subscription: any): boolean {
  if (!subscription) return false
  
  const now = Date.now()
  const periodEnd = subscription.stripeCurrentPeriodEnd 
    ? new Date(subscription.stripeCurrentPeriodEnd).getTime() 
    : 0

  return (
    subscription.status === "ACTIVE" &&
    periodEnd > now &&
    !subscription.cancelAtPeriodEnd
  )
}

// Calculate next billing date
export function getNextBillingDate(subscription: any): Date | null {
  if (!subscription || !isSubscriptionActive(subscription)) {
    return null
  }

  return subscription.stripeCurrentPeriodEnd 
    ? new Date(subscription.stripeCurrentPeriodEnd) 
    : null
}

// Helper function to create Pesapal subscription data
export function createPesapalSubscriptionData(
  merchantReference: string,
  orderTrackingId: string,
  planId: string,
  status: SUBSCRIPTION_STATUS,
  durationMonths: number = 1
): SubscriptionData {
  const now = Math.floor(Date.now() / 1000)
  const periodEnd = now + (durationMonths * 30 * 24 * 60 * 60) // Approximate months

  let plan: SUBSCRIPTION_PLAN = "FREE"
  if (planId === PESAPAL_PLAN_IDS.PRO) plan = "PRO"
  if (planId === PESAPAL_PLAN_IDS.ENTERPRISE) plan = "ENTERPRISE"

  return {
    subscriptionId: merchantReference,
    orderTrackingId,
    priceId: planId,
    status,
    currentPeriodStart: now,
    currentPeriodEnd: periodEnd,
    cancelAtPeriodEnd: false,
    canceledAt: null,
    paymentProvider: "pesapal",
    plan,
  }
}