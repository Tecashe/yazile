
import { client } from "@/lib/prisma"
import { stripe, PLAN_PRICE_IDS, mapStripeStatusToEnum } from "@/lib/stripe"
import { SUBSCRIPTION_PLAN, SUBSCRIPTION_STATUS } from "@/contexts/subscription-context"

// Create or update a subscription
export async function upsertSubscription(userId: string, stripeData: any) {
  const {
    customerId,
    subscriptionId,
    priceId,
    status,
    currentPeriodStart,
    currentPeriodEnd,
    cancelAtPeriodEnd,
    canceledAt,
    paymentMethodId,
    paymentMethodType,
    paymentMethodLast4,
  } = stripeData

  // Determine plan from priceId
  let plan: SUBSCRIPTION_PLAN = "FREE"
  if (priceId === PLAN_PRICE_IDS.PRO) plan = "PRO"
  if (priceId === PLAN_PRICE_IDS.TEAM) plan = "ENTERPRISE"

  // Convert string status to enum
  const subscriptionStatus = mapStripeStatusToEnum(status) as SUBSCRIPTION_STATUS

  return client.subscription.upsert({
    where: { userId },
    update: {
      plan,
      status: subscriptionStatus,
      customerId,
      stripeSubscriptionId: subscriptionId,
      stripePriceId: priceId,
      stripeCurrentPeriodStart: currentPeriodStart ? new Date(currentPeriodStart * 1000) : undefined,
      stripeCurrentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : undefined,
      cancelAtPeriodEnd: cancelAtPeriodEnd || false,
      canceledAt: canceledAt ? new Date(canceledAt * 1000) : null,
      paymentMethodId,
      paymentMethodType,
      paymentMethodLast4,
    },
    create: {
      userId,
      plan,
      status: subscriptionStatus,
      customerId,
      stripeSubscriptionId: subscriptionId,
      stripePriceId: priceId,
      stripeCurrentPeriodStart: currentPeriodStart ? new Date(currentPeriodStart * 1000) : undefined,
      stripeCurrentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : undefined,
      cancelAtPeriodEnd: cancelAtPeriodEnd || false,
      canceledAt: canceledAt ? new Date(canceledAt * 1000) : null,
      paymentMethodId,
      paymentMethodType,
      paymentMethodLast4,
    },
  })
}

// Get user subscription
export async function getUserSubscription(userId: string) {
  return client.subscription.findUnique({
    where: { userId },
  })
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

// Create a Stripe customer portal session
export async function createBillingPortalSession(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
  })
  
  return session.url
}
