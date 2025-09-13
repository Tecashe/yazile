// // /lib/stripe-service.ts
// import Stripe from 'stripe'
// import { getDecryptedCredentials } from '@/lib/integration-service'

// export async function createStripePaymentLink(
//   integration: any,
//   data: {
//     amount: number
//     currency: string
//     productName: string
//     userEmail?: string
//     metadata?: Record<string, string>
//   }
// ) {
//   const credentials = await getDecryptedCredentials(integration)
//   const stripe = new Stripe(credentials.secretKey, {
//     apiVersion: '2024-11-20.acacia'
//   })

//   // Create a price for the payment link
//   const price = await stripe.prices.create({
//     unit_amount: data.amount,
//     currency: data.currency,
//     product_data: {
//       name: data.productName
//     }
//   })

//   // Create the payment link
//   const paymentLink = await stripe.paymentLinks.create({
//     line_items: [{
//       price: price.id,
//       quantity: 1
//     }],
//     metadata: data.metadata || {},
//     customer_creation: 'always',
//     allow_promotion_codes: true,
//     billing_address_collection: 'auto'
//   })

//   return paymentLink
// }

// export async function verifyStripePayment(integration: any, paymentIntentId: string) {
//   const credentials = await getDecryptedCredentials(integration)
//   const stripe = new Stripe(credentials.secretKey, {
//     apiVersion: '2024-11-20.acacia'
//   })

//   const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
  
//   return {
//     success: paymentIntent.status === 'succeeded',
//     status: paymentIntent.status,
//     amount: paymentIntent.amount,
//     currency: paymentIntent.currency,
//     paymentMethod: paymentIntent.payment_method,
//     customer: paymentIntent.customer,
//     metadata: paymentIntent.metadata
//   }
// }





// export async function verifyStripePaymentLink(
//   integration: any, 
//   paymentLinkId: string, 
//   voiceflowSessionId: string
// ) {
//   const stripe = new Stripe(integration.credentials.secretKey, {
//     apiVersion: "2024-11-20.acacia",
//   })

//   try {
//     // Method 1: Check checkout sessions for this payment link
//     const sessions = await stripe.checkout.sessions.list({
//       payment_link: paymentLinkId,
//       limit: 100 // Adjust as needed
//     })

//     // Filter sessions that match our voiceflow session (if stored in metadata)
//     const relevantSessions = sessions.data.filter(session => {
//       return session.metadata?.sessionId === voiceflowSessionId ||
//              session.metadata?.tenantId || // Fallback if no sessionId match
//              session.client_reference_id === voiceflowSessionId
//     })

//     if (relevantSessions.length === 0) {
//       return {
//         success: false,
//         status: 'no_payment_found',
//         message: 'No payment found for this session',
//         paymentLink: paymentLinkId
//       }
//     }

//     // Get the most recent relevant session
//     const latestSession = relevantSessions[0] // Sessions are ordered by creation date desc
    
//     // Check if payment was successful
//     if (latestSession.payment_status === 'paid') {
//       return {
//         success: true,
//         status: 'paid',
//         message: 'Payment completed successfully',
//         paymentLink: paymentLinkId,
//         sessionId: latestSession.id,
//         amountTotal: latestSession.amount_total,
//         currency: latestSession.currency,
//         customerEmail: latestSession.customer_details?.email,
//         paymentDate: new Date(latestSession.created * 1000).toISOString()
//       }
//     } else {
//       return {
//         success: false,
//         status: latestSession.payment_status,
//         message: `Payment status: ${latestSession.payment_status}`,
//         paymentLink: paymentLinkId,
//         sessionId: latestSession.id
//       }
//     }

//   } catch (error) {
//     console.error('Stripe verification error:', error)
    
//     // Handle specific Stripe errors
//     if (error instanceof Stripe.errors.StripeError) {
//       if (error.code === 'resource_missing') {
//         return {
//           success: false,
//           status: 'invalid_payment_link',
//           message: 'Payment link not found or invalid',
//           error: error.message
//         }
//       }
//     }

//     throw error // Re-throw for route handler to catch
//   }
// }

// // Alternative method if you want to check by customer email or other criteria
// export async function verifyStripePaymentByCustomer(
//   integration: any,
//   customerEmail: string,
//   paymentLinkId: string,
//   timeWindow: number = 24 * 60 * 60 // 24 hours in seconds
// ) {
//   const stripe = new Stripe(integration.credentials.secretKey, {
//     apiVersion: "2024-11-20.acacia",
//   })

//   try {
//     const sessions = await stripe.checkout.sessions.list({
//       payment_link: paymentLinkId,
//       limit: 100,
//       created: {
//         gte: Math.floor(Date.now() / 1000) - timeWindow // Within time window
//       }
//     })

//     const customerSession = sessions.data.find(session => 
//       session.customer_details?.email === customerEmail
//     )

//     if (!customerSession) {
//       return {
//         success: false,
//         status: 'no_payment_found',
//         message: 'No payment found for this customer'
//       }
//     }

//     return {
//       success: customerSession.payment_status === 'paid',
//       status: customerSession.payment_status,
//       message: `Payment status: ${customerSession.payment_status}`,
//       sessionId: customerSession.id,
//       amountTotal: customerSession.amount_total,
//       currency: customerSession.currency,
//       customerEmail: customerSession.customer_details?.email
//     }

//   } catch (error) {
//     console.error('Customer payment verification error:', error)
//     throw error
//   }
// }

import Stripe from 'stripe'
import { getDecryptedCredentials } from '@/lib/integration-service'

export async function createStripePaymentLink(
  integration: any,
  data: {
    amount: number
    currency: string
    productName: string
    userEmail?: string
    metadata?: Record<string, string>
  }
) {
  const credentials = await getDecryptedCredentials(integration)
  const stripe = new Stripe(credentials.secretKey, {
    apiVersion: '2024-11-20.acacia'
  })

  // Create a price for the payment link
  const price = await stripe.prices.create({
    unit_amount: data.amount,
    currency: data.currency,
    product_data: {
      name: data.productName
    }
  })

  // Create the payment link
  const paymentLink = await stripe.paymentLinks.create({
    line_items: [{
      price: price.id,
      quantity: 1
    }],
    metadata: data.metadata || {},
    customer_creation: 'always',
    allow_promotion_codes: true,
    billing_address_collection: 'auto'
  })

  return paymentLink
}

export async function verifyStripePayment(integration: any, paymentIntentId: string) {
  const credentials = await getDecryptedCredentials(integration)
  const stripe = new Stripe(credentials.secretKey, {
    apiVersion: '2024-11-20.acacia'
  })

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
  
  return {
    success: paymentIntent.status === 'succeeded',
    status: paymentIntent.status,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    paymentMethod: paymentIntent.payment_method,
    customer: paymentIntent.customer,
    metadata: paymentIntent.metadata
  }
}

export async function verifyStripePaymentLink(
  integration: any, 
  verificationData: {
    paymentLinkId: string
    customerEmail: string
    expectedAmount: number // in cents
    voiceflowSessionId: string
    timeWindow?: number // hours to look back, default 2
  }
) {
  const credentials = await getDecryptedCredentials(integration)
  const stripe = new Stripe(credentials.secretKey, {
    apiVersion: "2024-11-20.acacia",
  })

  try {
    const timeWindow = verificationData.timeWindow || 2 // 2 hours default
    const cutoffTime = Math.floor(Date.now() / 1000) - (timeWindow * 60 * 60)
    
    // Get recent sessions for this payment link
    const sessions = await stripe.checkout.sessions.list({
      payment_link: verificationData.paymentLinkId,
      limit: 50,
      created: { gte: cutoffTime }
    })

    // Find matching session with exact email and amount match
    const matchingSession = sessions.data.find(session => {
      const emailMatch = session.customer_details?.email?.toLowerCase() === 
                        verificationData.customerEmail.toLowerCase()
      const amountMatch = session.amount_total === verificationData.expectedAmount
      
      return emailMatch && amountMatch && session.payment_status === 'paid'
    })

    if (matchingSession) {
      return {
        success: true,
        status: 'verified_paid',
        message: 'Payment verified successfully',
        paymentLinkId: verificationData.paymentLinkId,
        sessionId: matchingSession.id,
        amountTotal: matchingSession.amount_total,
        currency: matchingSession.currency,
        customerEmail: matchingSession.customer_details?.email,
        paymentDate: new Date(matchingSession.created * 1000).toISOString(),
        paymentIntent: matchingSession.payment_intent
      }
    }

    // Check if there's a pending/unpaid session with matching criteria
    const pendingSession = sessions.data.find(session => {
      const emailMatch = session.customer_details?.email?.toLowerCase() === 
                        verificationData.customerEmail.toLowerCase()
      const amountMatch = session.amount_total === verificationData.expectedAmount
      
      return emailMatch && amountMatch
    })

    if (pendingSession) {
      return {
        success: false,
        status: pendingSession.payment_status,
        message: `Payment found but status is: ${pendingSession.payment_status}. Please complete the payment.`,
        paymentLinkId: verificationData.paymentLinkId,
        sessionId: pendingSession.id,
        amountTotal: pendingSession.amount_total,
        currency: pendingSession.currency,
        customerEmail: pendingSession.customer_details?.email
      }
    }

    // Check for email match only (different amount)
    const emailOnlyMatch = sessions.data.find(session => 
      session.customer_details?.email?.toLowerCase() === verificationData.customerEmail.toLowerCase()
    )

    if (emailOnlyMatch) {
      const foundAmount = emailOnlyMatch.amount_total || 0
      const currency = emailOnlyMatch.currency?.toUpperCase() || 'USD'
      
      return {
        success: false,
        status: 'amount_mismatch',
        message: `Found payment with email but different amount. Expected: ${verificationData.expectedAmount/100} ${currency}, Found: ${foundAmount/100} ${currency}`,
        paymentLinkId: verificationData.paymentLinkId,
        sessionId: emailOnlyMatch.id,
        amountTotal: foundAmount,
        expectedAmount: verificationData.expectedAmount
      }
    }

    return {
      success: false,
      status: 'no_payment_found',
      message: `No payment found with email "${verificationData.customerEmail}" and amount ${verificationData.expectedAmount/100} in the last ${timeWindow} hours. Please check your details or try again.`,
      paymentLinkId: verificationData.paymentLinkId,
      searchedEmail: verificationData.customerEmail,
      searchedAmount: verificationData.expectedAmount,
      timeWindow: timeWindow
    }

  } catch (error) {
    console.error('Payment verification error:', error)
    
    // Handle specific Stripe errors
    if (error instanceof Stripe.errors.StripeError) {
      if (error.code === 'resource_missing') {
        return {
          success: false,
          status: 'invalid_payment_link',
          message: 'Payment link not found or invalid',
          error: error.message,
          paymentLinkId: verificationData.paymentLinkId
        }
      }
      
      return {
        success: false,
        status: 'stripe_error',
        message: `Stripe API error: ${error.message}`,
        error: error.code,
        paymentLinkId: verificationData.paymentLinkId
      }
    }

    throw error // Re-throw for route handler to catch
  }
}

// Keep the alternative method for backward compatibility
export async function verifyStripePaymentByCustomer(
  integration: any,
  customerEmail: string,
  paymentLinkId: string,
  timeWindow: number = 24 * 60 * 60 // 24 hours in seconds
) {
  const credentials = await getDecryptedCredentials(integration)
  const stripe = new Stripe(credentials.secretKey, {
    apiVersion: "2024-11-20.acacia",
  })

  try {
    const sessions = await stripe.checkout.sessions.list({
      payment_link: paymentLinkId,
      limit: 100,
      created: {
        gte: Math.floor(Date.now() / 1000) - timeWindow // Within time window
      }
    })

    const customerSession = sessions.data.find(session => 
      session.customer_details?.email?.toLowerCase() === customerEmail.toLowerCase()
    )

    if (!customerSession) {
      return {
        success: false,
        status: 'no_payment_found',
        message: 'No payment found for this customer'
      }
    }

    return {
      success: customerSession.payment_status === 'paid',
      status: customerSession.payment_status,
      message: `Payment status: ${customerSession.payment_status}`,
      sessionId: customerSession.id,
      amountTotal: customerSession.amount_total,
      currency: customerSession.currency,
      customerEmail: customerSession.customer_details?.email
    }

  } catch (error) {
    console.error('Customer payment verification error:', error)
    throw error
  }
}