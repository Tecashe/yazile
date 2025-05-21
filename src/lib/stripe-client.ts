"use client"

import { loadStripe } from "@stripe/stripe-js"

// Load the Stripe.js library with your publishable key
// Replace with your actual publishable key from Stripe Dashboard
export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")
