
// import { NextRequest, NextResponse } from "next/server"
// import { stripe, PLAN_PRICE_IDS } from "@/lib/stripe"
// import { onCurrentUser, onUserInfor } from "@/actions/user"
// import { upsertSubscription } from "@/lib/subscription"

// export async function POST(req: NextRequest) {
//   try {
//     // Get the current user
//     const details = await onCurrentUser()
//     const user = await onUserInfor()
//     const userid = user.data?.id
//     if (!user) {
//       return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
//     }

//     // Get request data
//     const { plan, paymentMethodId, cardholderName, country } = await req.json()

//     // Determine price ID based on plan
//     let priceId
//     switch (plan) {
//       case "pro":
//         priceId = PLAN_PRICE_IDS.PRO
//         break
//       case "team":
//         priceId = PLAN_PRICE_IDS.TEAM
//         break
//       default:
//         return NextResponse.json({ success: false, error: "Invalid plan" }, { status: 400 })
//     }

//     // Check if customer already exists
//     let customerId
//     const existingCustomers = await stripe.customers.list({
//       email: details.emailAddresses[0].emailAddress,
//       limit: 1,
//     })

//     if (existingCustomers.data.length > 0) {
//       customerId = existingCustomers.data[0].id
      
//       // Update the payment method
//       await stripe.paymentMethods.attach(paymentMethodId, {
//         customer: customerId,
//       })
      
//       // Set as default payment method
//       await stripe.customers.update(customerId, {
//         invoice_settings: {
//           default_payment_method: paymentMethodId,
//         },
//       })
//     } else {
//       // Create a new customer
//       const customer = await stripe.customers.create({
//         email: details.emailAddresses[0].emailAddress,
//         name: cardholderName || `${details.firstName} ${details.lastName}`,
//         payment_method: paymentMethodId,
//         invoice_settings: {
//           default_payment_method: paymentMethodId,
//         },
//         address: {
//           country,
//         },
//         metadata: {
//           userId: userid || "65478754542",
//         },
//       })
//       customerId = customer.id
//     }

//     // Create the subscription
//     const subscription = await stripe.subscriptions.create({
//       customer: customerId,
//       items: [{ price: priceId }],
//       payment_behavior: "default_incomplete",
//       payment_settings: {
//         payment_method_types: ["card"],
//         save_default_payment_method: "on_subscription",
//       },
//       expand: ["latest_invoice.payment_intent"],
//       metadata: {
//         userId: userid || "65478754542",
//       },
//     })

//     // Get the client secret for the subscription
//     const invoice = subscription.latest_invoice as any
//     const clientSecret = invoice?.payment_intent?.client_secret

//     // Get payment method details
//     const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)

//     // Update user subscription in database
//     await upsertSubscription(userid || "65478754542", {
//       customerId,
//       subscriptionId: subscription.id,
//       priceId,
//       status: subscription.status,
//       currentPeriodStart: subscription.current_period_start,
//       currentPeriodEnd: subscription.current_period_end,
//       cancelAtPeriodEnd: subscription.cancel_at_period_end,
//       canceledAt: subscription.canceled_at,
//       paymentMethodId: paymentMethod.id,
//       paymentMethodType: paymentMethod.type,
//       paymentMethodLast4: paymentMethod.card?.last4,
//     })

//     return NextResponse.json({
//       success: true,
//       subscriptionId: subscription.id,
//       clientSecret,
//     })
//   } catch (error: any) {
//     console.error("Error creating subscription:", error)
//     return NextResponse.json(
//       { success: false, error: error.message || "Failed to create subscription" },
//       { status: 500 },
//     )
//   }
// }

// app/api/subscriptions/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession, PLAN_VARIANT_IDS } from "@/lib/lemonsqueezy";
import { onCurrentUser, onUserInfor } from "@/actions/user";

export async function POST(req: NextRequest) {
  try {
    // Get the current user
    const details = await onCurrentUser();
    const user = await onUserInfor();
    const userid = user.data?.id;
    
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Get request data
    const { plan, cardholderName, country } = await req.json();

    // Determine variant ID based on plan
    let variantId: string;
    switch (plan) {
      case "pro":
        variantId = PLAN_VARIANT_IDS.PRO;
        break;
      case "enterprise":
        variantId = PLAN_VARIANT_IDS.ENTERPRISE;
        break;
      default:
        return NextResponse.json({ success: false, error: "Invalid plan" }, { status: 400 });
    }

    // Create checkout session with Lemon Squeezy
    const checkoutResult = await createCheckoutSession({
      variantId,
      customData: {
        userId: userid || "65478754542",
        email: details.emailAddresses[0].emailAddress,
        name: cardholderName || `${details.firstName} ${details.lastName}`,
        country,
      },
      checkoutOptions: {
        darkMode: true,
        subscriptionPreview: true,
        embedButtonText: `Subscribe to ${plan.charAt(0).toUpperCase() + plan.slice(1)}`,
      },
    });

    if (!checkoutResult.success) {
      throw new Error(checkoutResult.error || "Failed to create checkout session");
    }

    return NextResponse.json({
      success: true,
      checkoutUrl: checkoutResult.checkoutUrl,
      checkoutId: checkoutResult.checkoutId,
    });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}