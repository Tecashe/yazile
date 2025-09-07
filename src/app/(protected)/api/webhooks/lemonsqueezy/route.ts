// app/api/webhooks/lemonsqueezy/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { upsertSubscription, mapLemonSqueezyStatusToEnum, getPlanFromVariantId } from "@/lib/subscription-lemonsqueezy";

const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;

function verifySignature(payload: string, signature: string): boolean {
  const hmac = crypto.createHmac("sha256", webhookSecret);
  hmac.update(payload);
  const expectedSignature = hmac.digest("hex");
  
  return crypto.timingSafeEqual(
    Buffer.from(signature, "hex"),
    Buffer.from(expectedSignature, "hex")
  );
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text();
    const signature = req.headers.get("x-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Verify webhook signature
    if (!verifySignature(payload, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(payload);
    const { meta, data } = event;

    console.log("Received Lemon Squeezy webhook:", meta.event_name);

    switch (meta.event_name) {
      case "subscription_created":
      case "subscription_updated":
        await handleSubscriptionUpdated(data);
        break;

      case "subscription_cancelled":
        await handleSubscriptionCancelled(data);
        break;

      case "subscription_resumed":
        await handleSubscriptionResumed(data);
        break;

      case "subscription_expired":
        await handleSubscriptionExpired(data);
        break;

      case "subscription_paused":
        await handleSubscriptionPaused(data);
        break;

      case "subscription_unpaused":
        await handleSubscriptionUnpaused(data);
        break;

      default:
        console.log(`Unhandled event: ${meta.event_name}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleSubscriptionUpdated(data: any) {
  const subscription = data.attributes;
  const userId = subscription.custom_data?.userId;

  if (!userId) {
    console.error("No userId found in subscription data");
    return;
  }

  await upsertSubscription(userId, {
    customerId: subscription.customer_id.toString(),
    subscriptionId: data.id,
    variantId: subscription.variant_id.toString(),
    status: mapLemonSqueezyStatusToEnum(subscription.status),
    currentPeriodStart: Math.floor(new Date(subscription.current_period_start).getTime() / 1000),
    currentPeriodEnd: Math.floor(new Date(subscription.current_period_end).getTime() / 1000),
    cancelAtPeriodEnd: subscription.cancelled,
    canceledAt: subscription.cancelled ? Math.floor(new Date(subscription.updated_at).getTime() / 1000) : null,
    productName: subscription.product_name,
    variantName: subscription.variant_name,
    price: `$${(subscription.price / 100).toFixed(2)}`,
    interval: subscription.billing_anchor === 1 ? "month" : "year",
    intervalCount: 1,
  });
}

async function handleSubscriptionCancelled(data: any) {
  const subscription = data.attributes;
  const userId = subscription.custom_data?.userId;

  if (!userId) {
    console.error("No userId found in subscription data");
    return;
  }

  await upsertSubscription(userId, {
    customerId: subscription.customer_id.toString(),
    subscriptionId: data.id,
    variantId: subscription.variant_id.toString(),
    status: "canceled",
    currentPeriodStart: Math.floor(new Date(subscription.current_period_start).getTime() / 1000),
    currentPeriodEnd: Math.floor(new Date(subscription.current_period_end).getTime() / 1000),
    cancelAtPeriodEnd: true,
    canceledAt: Math.floor(new Date(subscription.updated_at).getTime() / 1000),
    productName: subscription.product_name,
    variantName: subscription.variant_name,
    price: `$${(subscription.price / 100).toFixed(2)}`,
    interval: subscription.billing_anchor === 1 ? "month" : "year",
    intervalCount: 1,
  });
}

async function handleSubscriptionResumed(data: any) {
  const subscription = data.attributes;
  const userId = subscription.custom_data?.userId;

  if (!userId) {
    console.error("No userId found in subscription data");
    return;
  }

  await upsertSubscription(userId, {
    customerId: subscription.customer_id.toString(),
    subscriptionId: data.id,
    variantId: subscription.variant_id.toString(),
    status: "active",
    currentPeriodStart: Math.floor(new Date(subscription.current_period_start).getTime() / 1000),
    currentPeriodEnd: Math.floor(new Date(subscription.current_period_end).getTime() / 1000),
    cancelAtPeriodEnd: false,
    canceledAt: null,
    productName: subscription.product_name,
    variantName: subscription.variant_name,
    price: `$${(subscription.price / 100).toFixed(2)}`,
    interval: subscription.billing_anchor === 1 ? "month" : "year",
    intervalCount: 1,
  });
}

async function handleSubscriptionExpired(data: any) {
  const subscription = data.attributes;
  const userId = subscription.custom_data?.userId;

  if (!userId) {
    console.error("No userId found in subscription data");
    return;
  }

  await upsertSubscription(userId, {
    customerId: subscription.customer_id.toString(),
    subscriptionId: data.id,
    variantId: subscription.variant_id.toString(),
    status: "expired",
    currentPeriodStart: Math.floor(new Date(subscription.current_period_start).getTime() / 1000),
    currentPeriodEnd: Math.floor(new Date(subscription.current_period_end).getTime() / 1000),
    cancelAtPeriodEnd: true,
    canceledAt: Math.floor(new Date(subscription.updated_at).getTime() / 1000),
    productName: subscription.product_name,
    variantName: subscription.variant_name,
    price: `$${(subscription.price / 100).toFixed(2)}`,
    interval: subscription.billing_anchor === 1 ? "month" : "year",
    intervalCount: 1,
  });
}

async function handleSubscriptionPaused(data: any) {
  const subscription = data.attributes;
  const userId = subscription.custom_data?.userId;

  if (!userId) {
    console.error("No userId found in subscription data");
    return;
  }

  await upsertSubscription(userId, {
    customerId: subscription.customer_id.toString(),
    subscriptionId: data.id,
    variantId: subscription.variant_id.toString(),
    status: "paused",
    currentPeriodStart: Math.floor(new Date(subscription.current_period_start).getTime() / 1000),
    currentPeriodEnd: Math.floor(new Date(subscription.current_period_end).getTime() / 1000),
    cancelAtPeriodEnd: false,
    canceledAt: null,
    productName: subscription.product_name,
    variantName: subscription.variant_name,
    price: `$${(subscription.price / 100).toFixed(2)}`,
    interval: subscription.billing_anchor === 1 ? "month" : "year",
    intervalCount: 1,
  });
}

async function handleSubscriptionUnpaused(data: any) {
  const subscription = data.attributes;
  const userId = subscription.custom_data?.userId;

  if (!userId) {
    console.error("No userId found in subscription data");
    return;
  }

  await upsertSubscription(userId, {
    customerId: subscription.customer_id.toString(),
    subscriptionId: data.id,
    variantId: subscription.variant_id.toString(),
    status: "active",
    currentPeriodStart: Math.floor(new Date(subscription.current_period_start).getTime() / 1000),
    currentPeriodEnd: Math.floor(new Date(subscription.current_period_end).getTime() / 1000),
    cancelAtPeriodEnd: false,
    canceledAt: null,
    productName: subscription.product_name,
    variantName: subscription.variant_name,
    price: `$${(subscription.price / 100).toFixed(2)}`,
    interval: subscription.billing_anchor === 1 ? "month" : "year",
    intervalCount: 1,
  });
}