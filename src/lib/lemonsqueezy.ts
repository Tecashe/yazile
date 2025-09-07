

// lib/lemonsqueezy.ts
import {
  lemonSqueezySetup,
  createCheckout,
  getSubscription,
  cancelSubscription,
  updateSubscription,
} from "@lemonsqueezy/lemonsqueezy.js";

// Setup Lemon Squeezy with API key
lemonSqueezySetup({
  apiKey: process.env.LEMONSQUEEZY_API_KEY!,
  onError: (error) => console.error("Lemon Squeezy Error:", error),
});

// Plan variant IDs - these should be created in your Lemon Squeezy dashboard
export const PLAN_VARIANT_IDS = {
  PRO: process.env.LEMONSQUEEZY_PRO_VARIANT_ID!,
  ENTERPRISE: process.env.LEMONSQUEEZY_ENTERPRISE_VARIANT_ID!,
} as const;

export const STORE_ID = process.env.LEMONSQUEEZY_STORE_ID!;

// Create checkout session
export async function createCheckoutSession({
  variantId,
  customData,
  checkoutOptions = {},
}: {
  variantId: string;
  customData?: Record<string, any>;
  checkoutOptions?: {
    embedButtonText?: string;
    media?: boolean;
    logo?: boolean;
    desc?: boolean;
    discountCode?: string;
    darkMode?: boolean;
    subscriptionPreview?: boolean;
  };
}) {
  try {
    const { data, error } = await createCheckout(STORE_ID, variantId, {
      checkoutOptions: {
        embed: true,
        media: checkoutOptions.media ?? false,
        logo: checkoutOptions.logo ?? false,
        desc: checkoutOptions.desc ?? false,
        discount: checkoutOptions.discountCode ? true : false,
        dark: checkoutOptions.darkMode ?? true,
        subscriptionPreview: checkoutOptions.subscriptionPreview ?? true,
        // Removed buttonText as it's not a valid property in checkoutOptions
      },
      checkoutData: {
        email: customData?.email,
        name: customData?.name,
        billingAddress: customData?.country ? { country: customData.country } : undefined,
        taxNumber: customData?.taxNumber,
        discountCode: checkoutOptions.discountCode,
        custom: customData,
      },
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    });

    if (error) {
      throw new Error(error.message || "Failed to create checkout session");
    }

    return {
      success: true,
      // Access the URL from the data object correctly
      checkoutUrl: data?.data?.attributes?.url,
      checkoutId: data?.data?.id,
    };
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create checkout session",
    };
  }
}

// Get subscription details
export async function getLemonSqueezySubscription(subscriptionId: string) {
  try {
    const { data, error } = await getSubscription(subscriptionId);
    
    if (error) {
      throw new Error(error.message || "Failed to fetch subscription");
    }

    return {
      success: true,
      subscription: data,
    };
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch subscription",
    };
  }
}

// Get customer portal URL
export async function getCustomerPortalUrl(customerId: string) {
  try {
    // Lemon Squeezy doesn't have a built-in customer portal like Stripe
    // You can redirect users to their general billing page or build your own portal
    const customerPortalUrl = `https://app.lemonsqueezy.com/billing`;
    
    return {
      success: true,
      url: customerPortalUrl,
    };
  } catch (error) {
    console.error("Error getting customer portal URL:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get customer portal URL",
    };
  }
}

// Cancel subscription
export async function cancelLemonSqueezySubscription(subscriptionId: string) {
  try {
    const { data, error } = await cancelSubscription(subscriptionId);
    
    if (error) {
      throw new Error(error.message || "Failed to cancel subscription");
    }

    return {
      success: true,
      subscription: data,
    };
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to cancel subscription",
    };
  }
}

// Resume subscription (using updateSubscription instead of resumeSubscription)
export async function resumeLemonSqueezySubscription(subscriptionId: string) {
  try {
    const { data, error } = await updateSubscription(subscriptionId, {
      cancelled: false,
    });
    
    if (error) {
      throw new Error(error.message || "Failed to resume subscription");
    }

    return {
      success: true,
      subscription: data,
    };
  } catch (error) {
    console.error("Error resuming subscription:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to resume subscription",
    };
  }
}

// Pause subscription
export async function pauseLemonSqueezySubscription(
  subscriptionId: string, 
  mode: 'free' | 'void' = 'free',
  resumesAt?: string
) {
  try {
    const { data, error } = await updateSubscription(subscriptionId, {
      pause: {
        mode,
        ...(resumesAt && { resumes_at: resumesAt }),
      },
    });
    
    if (error) {
      throw new Error(error.message || "Failed to pause subscription");
    }

    return {
      success: true,
      subscription: data,
    };
  } catch (error) {
    console.error("Error pausing subscription:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to pause subscription",
    };
  }
}

// Unpause subscription
export async function unpauseLemonSqueezySubscription(subscriptionId: string) {
  try {
    const { data, error } = await updateSubscription(subscriptionId, {
      pause: null,
    });
    
    if (error) {
      throw new Error(error.message || "Failed to unpause subscription");
    }

    return {
      success: true,
      subscription: data,
    };
  } catch (error) {
    console.error("Error unpausing subscription:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to unpause subscription",
    };
  }
}

// Update subscription
export async function updateLemonSqueezySubscription(subscriptionId: string, variantId: string) {
  try {
    const { data, error } = await updateSubscription(subscriptionId, {
      variantId: parseInt(variantId),
    });
    
    if (error) {
      throw new Error(error.message || "Failed to update subscription");
    }

    return {
      success: true,
      subscription: data,
    };
  } catch (error) {
    console.error("Error updating subscription:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update subscription",
    };
  }
}