// import Stripe from "stripe"

// // Initialize Stripe with your secret key
// export const stripe = new Stripe(process.env.STRIPE_CLIENT_SECRET || "", {
//   apiVersion: "2024-11-20.acacia", // Use the latest API version
// })

// // Define price IDs for your subscription plans
// export const SUBSCRIPTION_PRICES = {
//   // MONTHLY: process.env.STRIPE_PRICE_MONTHLY || "price_monthly_id",
//   // YEARLY: process.env.STRIPE_PRICE_YEARLY || "price_yearly_id",
//   MONTHLY: process.env.STRIPE_SUBSCRIPTION_PRICE_ID || "price_monthly_id",
//   YEARLY: "$200",
// }  

// // Create a checkout session for subscription
// export async function createCheckoutSession({
//   customerId,
//   priceId,
//   successUrl,
//   cancelUrl,
// }: {
//   customerId?: string
//   priceId: string
//   successUrl: string
//   cancelUrl: string
// }) {
//   try {
//     const session = await stripe.checkout.sessions.create({
//       customer: customerId,
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price: priceId,
//           quantity: 1,
//         },
//       ],
//       mode: "subscription",
//       success_url: successUrl,
//       cancel_url: cancelUrl,
//       allow_promotion_codes: true,
//     })

//     return { sessionId: session.id }
//   } catch (error) {
//     console.error("Error creating checkout session:", error)
//     throw error
//   }
// }

// // Create a Stripe customer
// export async function createCustomer({ email, name }: { email: string; name: string }) {
//   try {
//     const customer = await stripe.customers.create({
//       email,
//       name,
//     })

//     return { customerId: customer.id }
//   } catch (error) {
//     console.error("Error creating customer:", error)
//     throw error
//   }
// }

// // Create a payment intent for direct payment
// export async function createPaymentIntent({
//   amount,
//   currency = "usd",
//   customerId,
// }: {
//   amount: number
//   currency?: string
//   customerId?: string
// }) {
//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency,
//       customer: customerId,
//       automatic_payment_methods: {
//         enabled: true,
//       },
//     })

//     return { clientSecret: paymentIntent.client_secret }
//   } catch (error) {
//     console.error("Error creating payment intent:", error)
//     throw error
//   }
// }


import Stripe from "stripe"

// Initialize Stripe with your secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-11-20.acacia", // Use the latest API version
})

// Define price IDs for your subscription plans
export const SUBSCRIPTION_PRICES = {
  // MONTHLY: process.env.STRIPE_PRICE_MONTHLY || "price_monthly_id",
  // YEARLY: process.env.STRIPE_PRICE_YEARLY || "price_yearly_id",
  MONTHLY: process.env.STRIPE_SUBSCRIPTION_PRICE_ID || "price_monthly_id",
  YEARLY: "$200",
}

// Create a checkout session for subscription
export async function createCheckoutSession({
  customerId,
  priceId,
  successUrl,
  cancelUrl,
}: {
  customerId?: string
  priceId: string
  successUrl: string
  cancelUrl: string
}) {
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
    })

    return { sessionId: session.id }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    throw error
  }
}

// Create a Stripe customer
export async function createCustomer({ email, name }: { email: string; name: string }) {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
    })

    return { customerId: customer.id }
  } catch (error) {
    console.error("Error creating customer:", error)
    throw error
  }
}

// Create a payment intent for direct payment
export async function createPaymentIntent({
  amount,
  currency = "usd",
  customerId,
}: {
  amount: number
  currency?: string
  customerId?: string
}) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: customerId,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return { clientSecret: paymentIntent.client_secret }
  } catch (error) {
    console.error("Error creating payment intent:", error)
    throw error
  }
}





// // Map our the plan names to Stripe price IDs
// export const PLAN_PRICE_IDS = {
//   PRO: process.env.STRIPE_PRICE_PRO || "",
//   TEAM: process.env.STRIPE_PRICE_TEAM || "",
// }

// // Map the Stripe subscription status to our enum
// export const mapStripeStatusToEnum = (status: string): string => {
//   const statusMap: Record<string, string> = {
//     active: "ACTIVE",
//     canceled: "CANCELED",
//     incomplete: "INCOMPLETE",
//     incomplete_expired: "CANCELED",
//     past_due: "PAST_DUE",
//     trialing: "TRIALING",
//     unpaid: "UNPAID",
//   }
  
//   return statusMap[status] || "ACTIVE"
// }




// Map our plan names to Stripe price IDs
export const PLAN_PRICE_IDS = {
  PRO: process.env.STRIPE_PRICE_PRO || "",
  TEAM: process.env.STRIPE_PRICE_TEAM || "",
}

// Map Stripe subscription status to our enum
export const mapStripeStatusToEnum = (status: string): string => {
  const statusMap: Record<string, string> = {
    active: "ACTIVE",
    canceled: "CANCELED",
    incomplete: "INCOMPLETE",
    incomplete_expired: "CANCELED",
    past_due: "PAST_DUE",
    trialing: "TRIALING",
    unpaid: "UNPAID",
  }
  
  return statusMap[status] || "ACTIVE"
}

