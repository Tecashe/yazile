// lib/subscription-lemonsqueezy.ts
import { client } from "@/lib/prisma";
import { getCustomerPortalUrl, PLAN_VARIANT_IDS } from "@/lib/lemonsqueezy";
import { SUBSCRIPTION_PLAN, SUBSCRIPTION_STATUS } from "@/contexts/subscription-context";

export interface LemonSqueezySubscriptionData {
  customerId: string;
  subscriptionId: string;
  variantId: string;
  status: string;
  currentPeriodStart: number;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
  canceledAt?: number | null;
  productName: string;
  variantName: string;
  price: string;
  interval: string;
  intervalCount: number;
}

// Create or update a subscription with Lemon Squeezy data
export async function upsertSubscription(userId: string, lemonSqueezyData: LemonSqueezySubscriptionData) {
  const {
    customerId,
    subscriptionId,
    variantId,
    status,
    currentPeriodStart,
    currentPeriodEnd,
    cancelAtPeriodEnd,
    canceledAt,
    productName,
    variantName,
    price,
    interval,
    intervalCount,
  } = lemonSqueezyData;

  // Determine plan from variantId
  let plan: SUBSCRIPTION_PLAN = "FREE";
  if (variantId === PLAN_VARIANT_IDS.PRO) plan = "PRO";
  if (variantId === PLAN_VARIANT_IDS.ENTERPRISE) plan = "ENTERPRISE";

  // Convert Lemon Squeezy status to your app's status enum
  const subscriptionStatus = mapLemonSqueezyStatusToEnum(status) as SUBSCRIPTION_STATUS;

  return client.subscription.upsert({
    where: { userId },
    update: {
      plan,
      status: subscriptionStatus,
      customerId,
      // Update these field names to match Lemon Squeezy instead of Stripe
      lemonSqueezySubscriptionId: subscriptionId,
      lemonSqueezyVariantId: variantId,
      lemonSqueezyCurrentPeriodStart: currentPeriodStart ? new Date(currentPeriodStart * 1000) : undefined,
      lemonSqueezyCurrentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : undefined,
      cancelAtPeriodEnd: cancelAtPeriodEnd || false,
      canceledAt: canceledAt ? new Date(canceledAt * 1000) : null,
      // Store additional Lemon Squeezy specific data
      productName,
      variantName,
      price,
      interval,
      intervalCount,
    },
    create: {
      userId,
      plan,
      status: subscriptionStatus,
      customerId,
      lemonSqueezySubscriptionId: subscriptionId,
      lemonSqueezyVariantId: variantId,
      lemonSqueezyCurrentPeriodStart: currentPeriodStart ? new Date(currentPeriodStart * 1000) : undefined,
      lemonSqueezyCurrentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : undefined,
      cancelAtPeriodEnd: cancelAtPeriodEnd || false,
      canceledAt: canceledAt ? new Date(canceledAt * 1000) : null,
      productName,
      variantName,
      price,
      interval,
      intervalCount,
    },
  });
}

// Get user subscription
export async function getUserSubscription(userId: string) {
  return client.subscription.findUnique({
    where: { userId },
  });
}

// Check if user has access to a feature
export async function hasAccess(userId: string, requiredPlan: "PRO" | "ENTERPRISE") {
  const subscription = await getUserSubscription(userId);
     
  if (!subscription) return false;
     
  // If subscription is not active, user doesn't have access
  if (subscription.status !== "ACTIVE" && subscription.status !== "TRIALING") {
    return false;
  }
     
  // Check if user's plan meets the required level
  if (requiredPlan === "PRO") {
    return ["PRO", "ENTERPRISE"].includes(subscription.plan as string);
  }
     
  if (requiredPlan === "ENTERPRISE") {
    return subscription.plan === "ENTERPRISE";
  }
     
  return false;
}

// Create a billing portal session (Lemon Squeezy version)
export async function createBillingPortalSession(customerId: string): Promise<string> {
  try {
    const result = await getCustomerPortalUrl(customerId);
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    return result.url||"";
  } catch (error) {
    console.error("Error creating billing portal session:", error);
    throw error;
  }
}

// Helper function to map Lemon Squeezy subscription status to your app's status
export function mapLemonSqueezyStatusToEnum(lemonSqueezyStatus: string): string {
  const statusMap: Record<string, string> = {
    on_trial: "TRIALING",
    active: "ACTIVE",
    paused: "PAUSED", 
    past_due: "PAST_DUE",
    unpaid: "UNPAID",
    cancelled: "CANCELED",
    expired: "CANCELED", // Map expired to canceled in your system
  };

  return statusMap[lemonSqueezyStatus] || "CANCELED";
}

// Helper function to determine plan name from variant ID
export function getPlanFromVariantId(variantId: string): string {
  const variantMap: Record<string, string> = {
    [PLAN_VARIANT_IDS.PRO]: "pro",
    [PLAN_VARIANT_IDS.ENTERPRISE]: "enterprise",
  };

  return variantMap[variantId] || "free";
}

// Helper function to get variant ID from plan name
export function getVariantIdFromPlan(planName: string): string {
  const planMap: Record<string, string> = {
    pro: PLAN_VARIANT_IDS.PRO,
    enterprise: PLAN_VARIANT_IDS.ENTERPRISE,
  };

  return planMap[planName.toLowerCase()] || "";
}