import type { IntegrationDefinition } from "@/types/integration"
import { CreditCard, Users, Calendar, Building2 } from "lucide-react"

export const INTEGRATION_DEFINITIONS: Record<string, IntegrationDefinition> = {
  STRIPE: {
    id: "stripe",
    name: "Stripe",
    type: "STRIPE",
    description:
      "Accept payments, create payment links, and manage subscriptions with the world's leading payment processor",
    icon: CreditCard,
    authType: "api_key",
    environments: [
      {
        name: "test",
        label: "Test Mode",
        baseUrl: "https://api.stripe.com",
        description: "Safe environment for testing with fake payment methods",
      },
      {
        name: "live",
        label: "Live Mode",
        baseUrl: "https://api.stripe.com",
        description: "Production environment with real payments and charges",
      },
    ],
    fields: [
      {
        key: "secretKey",
        label: "Secret Key",
        type: "password",
        required: true,
        placeholder: "sk_test_... or sk_live_...",
        validation: {
          pattern: "^sk_(test|live)_[a-zA-Z0-9]+$",
          minLength: 20,
        },
      },
      {
        key: "publishableKey",
        label: "Publishable Key",
        type: "text",
        required: true,
        placeholder: "pk_test_... or pk_live_...",
        validation: {
          pattern: "^pk_(test|live)_[a-zA-Z0-9]+$",
          minLength: 20,
        },
      },
      {
        key: "webhookSecret",
        label: "Webhook Endpoint Secret",
        type: "password",
        required: false,
        placeholder: "whsec_...",
        validation: {
          pattern: "^whsec_[a-zA-Z0-9]+$",
        },
      },
    ],
    capabilities: [
      {
        id: "create_payment_link",
        name: "Create Payment Links",
        description: "Generate secure payment links for products or services",
      },
      {
        id: "verify_payment",
        name: "Verify Payments",
        description: "Check payment status and confirm successful transactions",
      },
      {
        id: "manage_subscriptions",
        name: "Manage Subscriptions",
        description: "Create, update, and cancel customer subscriptions",
      },
      {
        id: "process_refunds",
        name: "Process Refunds",
        description: "Issue full or partial refunds for completed payments",
      },
    ],
    endpoints: [
      { method: "POST", path: "/api/voiceflow/stripe/create-payment-link", description: "Create payment link" },
      { method: "GET", path: "/api/voiceflow/stripe/verify-payment", description: "Verify payment status" },
    ],
    testable: true,
    webhookSupport: true,
    rateLimit: {
      requests: 100,
      window: "1s",
    },
  },

  PAYPAL: {
    id: "paypal",
    name: "PayPal",
    type: "PAYPAL",
    description: "Accept PayPal payments and manage transactions with 400+ million active users worldwide",
    icon: CreditCard,
    authType: "api_key",
    environments: [
      {
        name: "sandbox",
        label: "Sandbox",
        baseUrl: "https://api.sandbox.paypal.com",
        description: "PayPal sandbox environment for testing",
      },
      {
        name: "live",
        label: "Live",
        baseUrl: "https://api.paypal.com",
        description: "PayPal production environment with real transactions",
      },
    ],
    fields: [
      { key: "clientId", label: "Client ID", type: "text", required: true, placeholder: "Your PayPal Client ID" },
      {
        key: "clientSecret",
        label: "Client Secret",
        type: "password",
        required: true,
        placeholder: "Your PayPal Client Secret",
      },
      {
        key: "webhookId",
        label: "Webhook ID",
        type: "text",
        required: false,
        placeholder: "Your PayPal Webhook ID",
      },
    ],
    capabilities: [
      {
        id: "create_payment",
        name: "Create Payments",
        description: "Generate PayPal payment requests for customers",
      },
      {
        id: "verify_payment",
        name: "Verify Payments",
        description: "Confirm PayPal payment completion and status",
      },
    ],
    endpoints: [{ method: "POST", path: "/api/voiceflow/paypal/create-payment", description: "Create PayPal payment" }],
    testable: true,
    webhookSupport: true,
    rateLimit: {
      requests: 50,
      window: "1s",
    },
  },

  CALENDLY: {
    id: "calendly",
    name: "Calendly",
    type: "CALENDLY",
    description: "Schedule meetings and appointments with automatic calendar integration",
    icon: Calendar,
    authType: "oauth2",
    oauthConfig: {
      authUrl: "https://auth.calendly.com/oauth/authorize",
      tokenUrl: "https://auth.calendly.com/oauth/token",
      clientId: process.env.NEXT_PUBLIC_CALENDLY_CLIENT_ID || "",
      scopes: ["read", "write"],
      redirectUri: "",
      pkce: true,
    },
    fields: [],
    capabilities: [
      {
        id: "create_booking",
        name: "Create Bookings",
        description: "Schedule appointments directly from conversations",
      },
      {
        id: "check_availability",
        name: "Check Availability",
        description: "View available time slots for scheduling",
      },
      {
        id: "cancel_booking",
        name: "Cancel Bookings",
        description: "Cancel or reschedule existing appointments",
      },
    ],
    endpoints: [{ method: "POST", path: "/api/voiceflow/calendly/create-booking", description: "Create booking" }],
    testable: true,
    webhookSupport: true,
    rateLimit: {
      requests: 1000,
      window: "1h",
    },
  },

  HUBSPOT: {
    id: "hubspot",
    name: "HubSpot",
    type: "HUBSPOT",
    description: "Manage contacts, deals, and customer interactions with the leading CRM platform",
    icon: Users,
    authType: "oauth2",
    oauthConfig: {
      authUrl: "https://app.hubspot.com/oauth/authorize",
      tokenUrl: "https://api.hubapi.com/oauth/v1/token",
      clientId: process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_ID || "",
      scopes: ["contacts", "content", "reports", "automation"],
      redirectUri: "",
    },
    fields: [],
    capabilities: [
      {
        id: "create_contact",
        name: "Create Contacts",
        description: "Add new leads and customers to your CRM automatically",
      },
      {
        id: "update_contact",
        name: "Update Contacts",
        description: "Modify existing contact information and properties",
      },
      {
        id: "create_deal",
        name: "Create Deals",
        description: "Generate new sales opportunities from conversations",
      },
      {
        id: "log_activity",
        name: "Log Activities",
        description: "Record customer interactions and engagement history",
      },
    ],
    endpoints: [{ method: "POST", path: "/api/voiceflow/hubspot/create-contact", description: "Create new contact" }],
    testable: true,
    webhookSupport: false,
    rateLimit: {
      requests: 100,
      window: "10s",
    },
  },

  SALESFORCE: {
    id: "salesforce",
    name: "Salesforce",
    type: "SALESFORCE",
    description: "Integrate with the world's #1 CRM to manage leads, opportunities, and customer data",
    icon: Building2,
    authType: "oauth2",
    oauthConfig: {
      authUrl: "https://login.salesforce.com/services/oauth2/authorize",
      tokenUrl: "https://login.salesforce.com/services/oauth2/token",
      clientId: process.env.NEXT_PUBLIC_SALESFORCE_CLIENT_ID || "",
      scopes: ["api", "web", "refresh_token", "openid"],
      redirectUri: "",
    },
    fields: [],
    capabilities: [
      {
        id: "create_lead",
        name: "Create Leads",
        description: "Capture new leads directly from conversations",
      },
      {
        id: "create_opportunity",
        name: "Create Opportunities",
        description: "Generate sales opportunities from qualified leads",
      },
      {
        id: "update_records",
        name: "Update Records",
        description: "Modify existing Salesforce records and data",
      },
    ],
    endpoints: [],
    testable: false,
    webhookSupport: false,
    rateLimit: {
      requests: 15000,
      window: "24h",
    },
  },

  ZOOM: {
    id: "zoom",
    name: "Zoom",
    type: "ZOOM",
    description: "Create and manage video meetings for customer consultations and support",
    icon: Calendar,
    authType: "oauth2",
    oauthConfig: {
      authUrl: "https://zoom.us/oauth/authorize",
      tokenUrl: "https://zoom.us/oauth/token",
      clientId: process.env.NEXT_PUBLIC_ZOOM_CLIENT_ID || "",
      scopes: ["meeting:write", "meeting:read", "user:read", "webinar:write"],
      redirectUri: "",
    },
    fields: [],
    capabilities: [
      {
        id: "create_meeting",
        name: "Create Meetings",
        description: "Generate Zoom meetings with custom settings",
      },
      {
        id: "schedule_webinar",
        name: "Schedule Webinars",
        description: "Set up webinars for product demonstrations",
      },
      {
        id: "manage_recordings",
        name: "Manage Recordings",
        description: "Access and share meeting recordings",
      },
    ],
    endpoints: [{ method: "POST", path: "/api/voiceflow/zoom/create-meeting", description: "Create Zoom meeting" }],
    testable: true,
    webhookSupport: true,
    rateLimit: {
      requests: 80,
      window: "1s",
    },
  },
}
