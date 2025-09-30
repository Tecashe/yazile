// lib/pesapal-client.ts
import axios from "axios"

const PESAPAL_BASE_URL = process.env.PESAPAL_ENV === "production" 
  ? "https://pay.pesapal.com/v3" 
  : "https://cybqa.pesapal.com/pesapalv3"

// Plan configurations
export const PLAN_CONFIGS = {
  FREE: {
    id: "free",
    name: "Free",
    price: 0,
    currency: "KES",
    interval: "lifetime",
  },
  PRO: {
    id: "pro",
    name: "Pro",
    price: 4999, // 49.99 USD ≈ 4999 KES (adjust as needed)
    currency: "KES",
    interval: "monthly",
  },
  ENTERPRISE: {
    id: "enterprise",
    name: "Enterprise",
    price: 0, // Custom pricing
    currency: "KES",
    interval: "custom",
  },
}

class PesapalClient {
  private consumerKey: string
  private consumerSecret: string
  private token: string | null = null
  private tokenExpiry: number = 0

  constructor() {
    this.consumerKey = process.env.PESAPAL_CONSUMER_KEY || ""
    this.consumerSecret = process.env.PESAPAL_CONSUMER_SECRET || ""
  }

  // Authenticate and get access token
  private async authenticate(): Promise<string> {
    // Return cached token if still valid
    if (this.token && Date.now() < this.tokenExpiry) {
      return this.token
    }

    try {
      const response = await axios.post(
        `${PESAPAL_BASE_URL}/api/Auth/RequestToken`,
        {
          consumer_key: this.consumerKey,
          consumer_secret: this.consumerSecret,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )

      this.token = response.data.token
      // Token typically expires in 5 minutes, cache for 4 minutes
      this.tokenExpiry = Date.now() + 4 * 60 * 1000

      return this.token ||"notoken"
    } catch (error: any) {
      console.error("Pesapal authentication error:", error.response?.data || error.message)
      throw new Error("Failed to authenticate with Pesapal")
    }
  }

  // Register IPN (Instant Payment Notification) URL
  async registerIPN(ipnUrl: string, notificationType: string = "GET"): Promise<string> {
    const token = await this.authenticate()

    try {
      const response = await axios.post(
        `${PESAPAL_BASE_URL}/api/URLSetup/RegisterIPN`,
        {
          url: ipnUrl,
          ipn_notification_type: notificationType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )

      return response.data.ipn_id
    } catch (error: any) {
      console.error("Pesapal IPN registration error:", error.response?.data || error.message)
      throw new Error("Failed to register IPN with Pesapal")
    }
  }

  // Submit order request
  async submitOrderRequest(orderData: {
    id: string
    currency: string
    amount: number
    description: string
    callback_url: string
    notification_id: string
    billing_address: {
      email_address: string
      phone_number?: string
      country_code?: string
      first_name?: string
      middle_name?: string
      last_name?: string
      line_1?: string
      line_2?: string
      city?: string
      state?: string
      postal_code?: string
      zip_code?: string
    }
  }): Promise<{ order_tracking_id: string; merchant_reference: string; redirect_url: string }> {
    const token = await this.authenticate()

    try {
      const response = await axios.post(
        `${PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )

      return {
        order_tracking_id: response.data.order_tracking_id,
        merchant_reference: response.data.merchant_reference,
        redirect_url: response.data.redirect_url,
      }
    } catch (error: any) {
      console.error("Pesapal order submission error:", error.response?.data || error.message)
      throw new Error("Failed to submit order to Pesapal")
    }
  }

  // Get transaction status
  async getTransactionStatus(orderTrackingId: string): Promise<{
    payment_method: string
    amount: number
    created_date: string
    confirmation_code: string
    payment_status_description: string
    description: string
    message: string
    payment_account: string
    call_back_url: string
    status_code: number
    merchant_reference: string
    payment_status_code: string
    currency: string
  }> {
    const token = await this.authenticate()

    try {
      const response = await axios.get(
        `${PESAPAL_BASE_URL}/api/Transactions/GetTransactionStatus`,
        {
          params: { orderTrackingId },
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      )

      return response.data
    } catch (error: any) {
      console.error("Pesapal transaction status error:", error.response?.data || error.message)
      throw new Error("Failed to get transaction status from Pesapal")
    }
  }

  // Create a subscription order
  async createSubscriptionOrder(params: {
    userId: string
    email: string
    firstName: string
    lastName: string
    phone?: string
    plan: keyof typeof PLAN_CONFIGS
    countryCode?: string
  }): Promise<{ order_tracking_id: string; redirect_url: string; merchant_reference: string }> {
    const planConfig = PLAN_CONFIGS[params.plan]
    
    if (!planConfig || planConfig.price === 0) {
      throw new Error("Invalid plan for payment")
    }

    const merchantReference = `SUB-${params.userId}-${Date.now()}`
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/subscriptions/pesapal/callback`
    const notificationId = process.env.PESAPAL_IPN_ID || ""

    const orderData = {
      id: merchantReference,
      currency: planConfig.currency,
      amount: planConfig.price,
      description: `${planConfig.name} Plan Subscription - Monthly`,
      callback_url: callbackUrl,
      notification_id: notificationId,
      billing_address: {
        email_address: params.email,
        phone_number: params.phone,
        country_code: params.countryCode || "KE",
        first_name: params.firstName,
        last_name: params.lastName,
      },
    }

    return await this.submitOrderRequest(orderData)
  }
}

// Export singleton instance
export const pesapal = new PesapalClient()