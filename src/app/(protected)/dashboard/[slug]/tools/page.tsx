
// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Separator } from "@/components/ui/separator"
// import { Switch } from "@/components/ui/switch"
// import { Progress } from "@/components/ui/progress"
// import {
//   CreditCard,
//   Users,
//   Calendar,
//   Mail,
//   MessageSquare,
//   ShoppingCart,
//   Settings,
//   CheckCircle,
//   AlertCircle,
//   Plus,
//   Trash2,
//   Eye,
//   EyeOff,
//   Zap,
//   Building2,
//   Phone,
//   Globe,
//   Database,
//   Code,
//   Copy,
//   Check,
//   Loader2,
//   Activity,
//   AlertTriangle,
//   Save,
//   X,
// } from "lucide-react"
// import { toast } from "@/hooks/use-toast"

// const INTEGRATION_CATEGORIES = {
//   ecommerce: {
//     title: "E-commerce & Payments",
//     description: "Process payments, manage orders, and handle customer transactions seamlessly",
//     icon: ShoppingCart,
//     color: "bg-emerald-500/10 text-emerald-400",
//     integrations: [
//       {
//         id: "stripe",
//         name: "Stripe",
//         type: "STRIPE",
//         description:
//           "Accept payments, create payment links, and manage subscriptions with the world's leading payment processor",
//         icon: CreditCard,
//         fields: [
//           { key: "secretKey", label: "Secret Key", type: "password", required: true, placeholder: "sk_test_..." },
//           { key: "publishableKey", label: "Publishable Key", type: "text", required: true, placeholder: "pk_test_..." },
//         ],
//         capabilities: [
//           {
//             id: "create_payment_link",
//             name: "Create Payment Links",
//             description: "Generate secure payment links for products or services",
//           },
//           {
//             id: "verify_payment",
//             name: "Verify Payments",
//             description: "Check payment status and confirm successful transactions",
//           },
//           {
//             id: "manage_subscriptions",
//             name: "Manage Subscriptions",
//             description: "Create, update, and cancel customer subscriptions",
//           },
//           {
//             id: "process_refunds",
//             name: "Process Refunds",
//             description: "Issue full or partial refunds for completed payments",
//           },
//         ],
//         endpoints: [
//           { method: "POST", path: "/api/voiceflow/stripe/create-payment-link", description: "Create payment link" },
//           { method: "GET", path: "/api/voiceflow/stripe/verify-payment", description: "Verify payment status" },
//         ],
//         testable: true,
//       },
//       {
//         id: "paypal",
//         name: "PayPal",
//         type: "PAYPAL",
//         description: "Accept PayPal payments and manage transactions with 400+ million active users worldwide",
//         icon: CreditCard,
//         fields: [
//           { key: "clientId", label: "Client ID", type: "text", required: true, placeholder: "Your PayPal Client ID" },
//           {
//             key: "clientSecret",
//             label: "Client Secret",
//             type: "password",
//             required: true,
//             placeholder: "Your PayPal Client Secret",
//           },
//           { key: "environment", label: "Environment", type: "select", required: true, options: ["sandbox", "live"] },
//         ],
//         capabilities: [
//           {
//             id: "create_payment",
//             name: "Create Payments",
//             description: "Generate PayPal payment requests for customers",
//           },
//           {
//             id: "verify_payment",
//             name: "Verify Payments",
//             description: "Confirm PayPal payment completion and status",
//           },
//         ],
//         endpoints: [
//           { method: "POST", path: "/api/voiceflow/paypal/create-payment", description: "Create PayPal payment" },
//         ],
//         testable: true,
//       },
//       {
//         id: "shopify",
//         name: "Shopify",
//         type: "SHOPIFY",
//         description: "Manage products, orders, and customer data from your Shopify store",
//         icon: ShoppingCart,
//         fields: [
//           {
//             key: "shopDomain",
//             label: "Shop Domain",
//             type: "text",
//             required: true,
//             placeholder: "your-shop.myshopify.com",
//           },
//           { key: "accessToken", label: "Access Token", type: "password", required: true, placeholder: "shpat_..." },
//         ],
//         capabilities: [
//           {
//             id: "get_products",
//             name: "Get Products",
//             description: "Retrieve product information and inventory levels",
//           },
//           { id: "create_order", name: "Create Orders", description: "Generate new orders directly from conversations" },
//           {
//             id: "update_inventory",
//             name: "Update Inventory",
//             description: "Modify product stock levels and availability",
//           },
//         ],
//         endpoints: [{ method: "GET", path: "/api/voiceflow/shopify/get-product", description: "Get product details" }],
//         testable: true,
//       },
//     ],
//   },
//   crm: {
//     title: "CRM & Customer Management",
//     description: "Manage leads, contacts, and customer relationships to grow your business",
//     icon: Users,
//     color: "bg-blue-500/10 text-blue-400",
//     integrations: [
//       {
//         id: "hubspot",
//         name: "HubSpot",
//         type: "HUBSPOT",
//         description: "Manage contacts, deals, and customer interactions with the leading CRM platform",
//         icon: Users,
//         fields: [
//           { key: "accessToken", label: "Access Token", type: "password", required: true, placeholder: "pat-na1-..." },
//         ],
//         capabilities: [
//           {
//             id: "create_contact",
//             name: "Create Contacts",
//             description: "Add new leads and customers to your CRM automatically",
//           },
//           {
//             id: "update_contact",
//             name: "Update Contacts",
//             description: "Modify existing contact information and properties",
//           },
//           {
//             id: "create_deal",
//             name: "Create Deals",
//             description: "Generate new sales opportunities from conversations",
//           },
//           {
//             id: "log_activity",
//             name: "Log Activities",
//             description: "Record customer interactions and engagement history",
//           },
//         ],
//         endpoints: [
//           { method: "POST", path: "/api/voiceflow/hubspot/create-contact", description: "Create new contact" },
//         ],
//         testable: true,
//       },
//       {
//         id: "salesforce",
//         name: "Salesforce",
//         type: "SALESFORCE",
//         description: "Integrate with the world's #1 CRM to manage leads, opportunities, and customer data",
//         icon: Building2,
//         fields: [
//           {
//             key: "instanceUrl",
//             label: "Instance URL",
//             type: "text",
//             required: true,
//             placeholder: "https://yourinstance.salesforce.com",
//           },
//           {
//             key: "accessToken",
//             label: "Access Token",
//             type: "password",
//             required: true,
//             placeholder: "Your access token",
//           },
//         ],
//         capabilities: [
//           {
//             id: "create_lead",
//             name: "Create Leads",
//             description: "Capture new leads directly from Instagram conversations",
//           },
//           {
//             id: "create_opportunity",
//             name: "Create Opportunities",
//             description: "Generate sales opportunities from qualified leads",
//           },
//           { id: "update_records", name: "Update Records", description: "Modify existing Salesforce records and data" },
//         ],
//         endpoints: [],
//         testable: false,
//       },
//     ],
//   },
//   communication: {
//     title: "Communication & Messaging",
//     description: "Send messages, emails, and notifications across multiple platforms",
//     icon: MessageSquare,
//     color: "bg-purple-500/10 text-purple-400",
//     integrations: [
//       {
//         id: "slack",
//         name: "Slack",
//         type: "SLACK",
//         description: "Send messages and notifications to your team channels and direct messages",
//         icon: MessageSquare,
//         fields: [
//           { key: "botToken", label: "Bot Token", type: "password", required: true, placeholder: "xoxb-..." },
//           {
//             key: "signingSecret",
//             label: "Signing Secret",
//             type: "password",
//             required: true,
//             placeholder: "Your signing secret",
//           },
//         ],
//         capabilities: [
//           { id: "send_message", name: "Send Messages", description: "Post messages to channels or direct messages" },
//           {
//             id: "create_channel",
//             name: "Create Channels",
//             description: "Set up new channels for customer discussions",
//           },
//           { id: "invite_users", name: "Invite Users", description: "Add team members to relevant conversations" },
//         ],
//         endpoints: [{ method: "POST", path: "/api/voiceflow/slack/send-message", description: "Send Slack message" }],
//         testable: true,
//       },
//       {
//         id: "discord",
//         name: "Discord",
//         type: "DISCORD",
//         description: "Engage with your community through Discord servers and channels",
//         icon: MessageSquare,
//         fields: [
//           {
//             key: "botToken",
//             label: "Bot Token",
//             type: "password",
//             required: true,
//             placeholder: "Your Discord bot token",
//           },
//           { key: "guildId", label: "Server ID", type: "text", required: true, placeholder: "Your Discord server ID" },
//         ],
//         capabilities: [
//           { id: "send_message", name: "Send Messages", description: "Post messages to Discord channels" },
//           { id: "create_embed", name: "Create Embeds", description: "Send rich embedded messages with formatting" },
//           { id: "manage_roles", name: "Manage Roles", description: "Assign or remove roles from community members" },
//         ],
//         endpoints: [
//           { method: "POST", path: "/api/voiceflow/discord/send-message", description: "Send Discord message" },
//         ],
//         testable: true,
//       },
//       {
//         id: "sendgrid",
//         name: "SendGrid",
//         type: "SENDGRID",
//         description: "Send transactional emails, newsletters, and automated email sequences",
//         icon: Mail,
//         fields: [
//           { key: "apiKey", label: "API Key", type: "password", required: true, placeholder: "SG...." },
//           {
//             key: "fromEmail",
//             label: "From Email",
//             type: "email",
//             required: true,
//             placeholder: "noreply@yourdomain.com",
//           },
//         ],
//         capabilities: [
//           { id: "send_email", name: "Send Emails", description: "Send personalized emails to customers and leads" },
//           {
//             id: "send_template",
//             name: "Send Templates",
//             description: "Use pre-designed email templates for consistency",
//           },
//           { id: "manage_lists", name: "Manage Lists", description: "Add contacts to email marketing lists" },
//         ],
//         endpoints: [{ method: "POST", path: "/api/voiceflow/sendgrid/send-email", description: "Send email" }],
//         testable: true,
//       },
//       {
//         id: "twilio",
//         name: "Twilio",
//         type: "TWILIO",
//         description: "Send SMS messages and make voice calls to customers worldwide",
//         icon: Phone,
//         fields: [
//           { key: "accountSid", label: "Account SID", type: "text", required: true, placeholder: "AC..." },
//           { key: "authToken", label: "Auth Token", type: "password", required: true, placeholder: "Your auth token" },
//           { key: "phoneNumber", label: "Phone Number", type: "tel", required: true, placeholder: "+1234567890" },
//         ],
//         capabilities: [
//           { id: "send_sms", name: "Send SMS", description: "Send text messages to customer phone numbers" },
//           { id: "make_call", name: "Make Calls", description: "Initiate voice calls for important notifications" },
//           {
//             id: "verify_phone",
//             name: "Verify Phone",
//             description: "Send verification codes for phone number validation",
//           },
//         ],
//         endpoints: [{ method: "POST", path: "/api/voiceflow/twilio/send-sms", description: "Send SMS message" }],
//         testable: true,
//       },
//     ],
//   },
//   scheduling: {
//     title: "Scheduling & Meetings",
//     description: "Book appointments, schedule meetings, and manage calendar events",
//     icon: Calendar,
//     color: "bg-orange-500/10 text-orange-400",
//     integrations: [
//       {
//         id: "calendly",
//         name: "Calendly",
//         type: "CALENDLY",
//         description: "Schedule meetings and appointments with automatic calendar integration",
//         icon: Calendar,
//         fields: [
//           {
//             key: "accessToken",
//             label: "Access Token",
//             type: "password",
//             required: true,
//             placeholder: "Your Calendly access token",
//           },
//         ],
//         capabilities: [
//           {
//             id: "create_booking",
//             name: "Create Bookings",
//             description: "Schedule appointments directly from conversations",
//           },
//           {
//             id: "check_availability",
//             name: "Check Availability",
//             description: "View available time slots for scheduling",
//           },
//           { id: "cancel_booking", name: "Cancel Bookings", description: "Cancel or reschedule existing appointments" },
//         ],
//         endpoints: [{ method: "POST", path: "/api/voiceflow/calendly/create-booking", description: "Create booking" }],
//         testable: true,
//       },
//       {
//         id: "zoom",
//         name: "Zoom",
//         type: "ZOOM",
//         description: "Create and manage video meetings for customer consultations and support",
//         icon: Calendar,
//         fields: [
//           {
//             key: "accessToken",
//             label: "Access Token",
//             type: "password",
//             required: true,
//             placeholder: "Your Zoom access token",
//           },
//           {
//             key: "refreshToken",
//             label: "Refresh Token",
//             type: "password",
//             required: true,
//             placeholder: "Your refresh token",
//           },
//         ],
//         capabilities: [
//           { id: "create_meeting", name: "Create Meetings", description: "Generate Zoom meetings with custom settings" },
//           {
//             id: "schedule_webinar",
//             name: "Schedule Webinars",
//             description: "Set up webinars for product demonstrations",
//           },
//           { id: "manage_recordings", name: "Manage Recordings", description: "Access and share meeting recordings" },
//         ],
//         endpoints: [{ method: "POST", path: "/api/voiceflow/zoom/create-meeting", description: "Create Zoom meeting" }],
//         testable: true,
//       },
//     ],
//   },
//   productivity: {
//     title: "Productivity & Automation",
//     description: "Automate workflows, manage tasks, and boost team productivity",
//     icon: Zap,
//     color: "bg-pink-500/10 text-pink-400",
//     integrations: [
//       {
//         id: "notion",
//         name: "Notion",
//         type: "NOTION",
//         description: "Create pages, update databases, and manage your workspace content",
//         icon: Database,
//         fields: [
//           { key: "accessToken", label: "Access Token", type: "password", required: true, placeholder: "secret_..." },
//         ],
//         capabilities: [
//           { id: "create_page", name: "Create Pages", description: "Generate new pages and documents automatically" },
//           {
//             id: "update_database",
//             name: "Update Database",
//             description: "Add and modify database entries from conversations",
//           },
//           {
//             id: "search_content",
//             name: "Search Content",
//             description: "Find and retrieve information from your workspace",
//           },
//         ],
//         endpoints: [{ method: "POST", path: "/api/voiceflow/notion/create-page", description: "Create Notion page" }],
//         testable: true,
//       },
//       {
//         id: "airtable",
//         name: "Airtable",
//         type: "AIRTABLE",
//         description: "Manage databases, track projects, and organize customer information",
//         icon: Database,
//         fields: [
//           { key: "apiKey", label: "API Key", type: "password", required: true, placeholder: "key..." },
//           { key: "baseId", label: "Base ID", type: "text", required: true, placeholder: "app..." },
//         ],
//         capabilities: [
//           { id: "create_record", name: "Create Records", description: "Add new entries to your Airtable bases" },
//           { id: "update_record", name: "Update Records", description: "Modify existing data and information" },
//           { id: "search_records", name: "Search Records", description: "Find and retrieve specific database entries" },
//         ],
//         endpoints: [],
//         testable: false,
//       },
//       {
//         id: "mailchimp",
//         name: "Mailchimp",
//         type: "MAILCHIMP",
//         description: "Manage email lists, create campaigns, and track marketing performance",
//         icon: Mail,
//         fields: [
//           { key: "apiKey", label: "API Key", type: "password", required: true, placeholder: "Your Mailchimp API key" },
//           { key: "serverPrefix", label: "Server Prefix", type: "text", required: true, placeholder: "us1, us2, etc." },
//         ],
//         capabilities: [
//           { id: "add_subscriber", name: "Add Subscribers", description: "Add contacts to email marketing lists" },
//           {
//             id: "create_campaign",
//             name: "Create Campaigns",
//             description: "Set up automated email marketing campaigns",
//           },
//           { id: "track_analytics", name: "Track Analytics", description: "Monitor email performance and engagement" },
//         ],
//         endpoints: [{ method: "POST", path: "/api/voiceflow/mailchimp/add-subscriber", description: "Add subscriber" }],
//         testable: true,
//       },
//     ],
//   },
// }

// interface Integration {
//   id: string
//   name: string
//   type: string
//   isActive: boolean
//   lastSyncAt?: string
//   lastErrorAt?: string
//   lastError?: string
//   syncCount?: number
//   errorCount?: number
//   hasValidToken?: boolean
//   tokenExpiresAt?: string
//   capabilities?: string | Record<string, boolean>
// }

// interface IntegrationField {
//   key: string
//   label: string
//   type: string
//   required: boolean
//   placeholder?: string
//   options?: string[]
// }

// type IntegrationState = "idle" | "connecting" | "connected" | "error" | "testing"

// interface IntegrationStatus {
//   state: IntegrationState
//   progress: number
//   message: string
//   health?: "healthy" | "warning" | "error"
// }

// export default function IntegrationsPage() {
//   const [activeCategory, setActiveCategory] = useState("ecommerce")
//   const [connectedIntegrations, setConnectedIntegrations] = useState<Integration[]>([])
//   const [isLoading, setIsLoading] = useState(false)
//   const [selectedIntegration, setSelectedIntegration] = useState<any>(null)
//   const [configureIntegration, setConfigureIntegration] = useState<{integration: any, connected: Integration} | null>(null)
//   const [showCredentials, setShowCredentials] = useState<Record<string, boolean>>({})
//   const [formData, setFormData] = useState<Record<string, string>>({})
//   const [configFormData, setConfigFormData] = useState<Record<string, string>>({})
//   const [error, setError] = useState<string | null>(null)
//   const [success, setSuccess] = useState<string | null>(null)
//   const [enabledCapabilities, setEnabledCapabilities] = useState<Record<string, boolean>>({})
//   const [updatingCapabilities, setUpdatingCapabilities] = useState<Set<string>>(new Set())
//   const [showApiDocs, setShowApiDocs] = useState<Record<string, boolean>>({})
//   const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null)
//   const [savingConfig, setSavingConfig] = useState(false)

//   const [integrationStatus, setIntegrationStatus] = useState<Record<string, IntegrationStatus>>({})
//   const [testingIntegration, setTestingIntegration] = useState<string | null>(null)

//   useEffect(() => {
//     loadConnectedIntegrations()
//   }, [])

//   const loadConnectedIntegrations = async () => {
//     try {
//       setIsLoading(true)
//       const response = await fetch("/api/dashboard/integrations")
//       if (response.ok) {
//         const data = await response.json()
//         setConnectedIntegrations(data.integrations || [])

//         // Initialize integration status
//         const statusMap: Record<string, IntegrationStatus> = {}
//         data.integrations?.forEach((integration: Integration) => {
//           statusMap[integration.type] = {
//             state: integration.isActive ? "connected" : "error",
//             progress: 100,
//             message: integration.isActive ? "Connected and ready" : integration.lastError || "Connection error",
//             health: integration.errorCount && integration.errorCount > 0 ? "warning" : "healthy",
//           }
//         })
//         setIntegrationStatus(statusMap)
//       }
//     } catch (error) {
//       console.error("Failed to load integrations:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleConnect = async (integration: any) => {
//     try {
//       setError(null)

//       // Update status to connecting
//       setIntegrationStatus((prev) => ({
//         ...prev,
//         [integration.type]: {
//           state: "connecting",
//           progress: 0,
//           message: "Validating credentials...",
//         },
//       }))

//       const missingFields = integration.fields
//         .filter((field: IntegrationField) => field.required && !formData[field.key])
//         .map((field: IntegrationField) => field.label)

//       if (missingFields.length > 0) {
//         setError(`Please fill in required fields: ${missingFields.join(", ")}`)
//         setIntegrationStatus((prev) => ({
//           ...prev,
//           [integration.type]: {
//             state: "error",
//             progress: 0,
//             message: "Missing required fields",
//           },
//         }))
//         return
//       }

//       // Progress: Preparing credentials
//       setIntegrationStatus((prev) => ({
//         ...prev,
//         [integration.type]: {
//           state: "connecting",
//           progress: 25,
//           message: "Preparing credentials...",
//         },
//       }))

//       const credentials: Record<string, string> = {}
//       integration.fields.forEach((field: IntegrationField) => {
//         if (formData[field.key]) {
//           credentials[field.key] = formData[field.key]
//         }
//       })

//       // Progress: Connecting to service
//       setIntegrationStatus((prev) => ({
//         ...prev,
//         [integration.type]: {
//           state: "connecting",
//           progress: 50,
//           message: "Connecting to service...",
//         },
//       }))

//       const response = await fetch("/api/dashboard/integrations", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           type: integration.type,
//           name: integration.name,
//           credentials,
//         }),
//       })

//       if (response.ok) {
//         // Progress: Finalizing
//         setIntegrationStatus((prev) => ({
//           ...prev,
//           [integration.type]: {
//             state: "connecting",
//             progress: 90,
//             message: "Finalizing connection...",
//           },
//         }))

//         setTimeout(() => {
//           setIntegrationStatus((prev) => ({
//             ...prev,
//             [integration.type]: {
//               state: "connected",
//               progress: 100,
//               message: "Connected successfully",
//               health: "healthy",
//             },
//           }))
//           setSuccess(`${integration.name} connected successfully!`)
//           setFormData({})
//           setSelectedIntegration(null)
//           loadConnectedIntegrations()
//         }, 500)
//       } else {
//         const errorData = await response.json()
//         setError(errorData.error || "Failed to connect integration")
//         setIntegrationStatus((prev) => ({
//           ...prev,
//           [integration.type]: {
//             state: "error",
//             progress: 0,
//             message: errorData.error || "Connection failed",
//           },
//         }))
//       }
//     } catch (error) {
//       setError("An unexpected error occurred")
//       setIntegrationStatus((prev) => ({
//         ...prev,
//         [integration.type]: {
//           state: "error",
//           progress: 0,
//           message: "Unexpected error occurred",
//         },
//       }))
//       console.error("Integration connection error:", error)
//     }
//   }

//   const handleConfigure = (integration: any, connectedIntegration: Integration) => {
//     setConfigureIntegration({ integration, connected: connectedIntegration })
    
//     // Pre-populate form with existing credentials (masked for security)
//     const configData: Record<string, string> = {}
//     integration.fields.forEach((field: IntegrationField) => {
//       if (field.type === 'password') {
//         configData[field.key] = '••••••••••••••••••••••••••••••••••••' // Masked password
//       } else {
//         // For non-password fields, we might have the data available
//         configData[field.key] = ''
//       }
//     })
//     setConfigFormData(configData)
//     setError(null)
//     setSuccess(null)
//   }

//   const handleUpdateConfiguration = async () => {
//     if (!configureIntegration) return

//     try {
//       setSavingConfig(true)
//       setError(null)

//       const { integration, connected } = configureIntegration

//       // Only send fields that have been modified (not masked passwords)
//       const updatedCredentials: Record<string, string> = {}
//       integration.fields.forEach((field: IntegrationField) => {
//         const value = configFormData[field.key]
//         if (value && value !== '••••••••••••••••••••••••••••••••••••') {
//           updatedCredentials[field.key] = value
//         }
//       })

//       const response = await fetch(`/api/dashboard/integrations/${connected.id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           credentials: updatedCredentials,
//         }),
//       })

//       if (response.ok) {
//         setSuccess(`${integration.name} configuration updated successfully!`)
//         setConfigureIntegration(null)
//         setConfigFormData({})
//         loadConnectedIntegrations()
//       } else {
//         const errorData = await response.json()
//         setError(errorData.error || "Failed to update configuration")
//       }
//     } catch (error) {
//       setError("An unexpected error occurred")
//       console.error("Configuration update error:", error)
//     } finally {
//       setSavingConfig(false)
//     }
//   }

//   const handleDisconnect = async (integrationId: string, integrationType: string) => {
//     try {
//       setIsLoading(true)
//       const response = await fetch(`/api/dashboard/integrations/${integrationId}`, {
//         method: "DELETE",
//       })

//       if (response.ok) {
//         setSuccess("Integration disconnected successfully")
//         setIntegrationStatus((prev) => ({
//           ...prev,
//           [integrationType]: {
//             state: "idle",
//             progress: 0,
//             message: "Not connected",
//           },
//         }))
//         loadConnectedIntegrations()
//       } else {
//         setError("Failed to disconnect integration")
//       }
//     } catch (error) {
//       setError("An unexpected error occurred")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const testIntegrationHealth = async (integration: any, connectedIntegration: Integration) => {
//     try {
//       setTestingIntegration(integration.type)
//       setIntegrationStatus((prev) => ({
//         ...prev,
//         [integration.type]: {
//           ...prev[integration.type],
//           state: "testing",
//           message: "Testing connection...",
//         },
//       }))

//       // Simulate health check - in production, this would call actual test endpoints
//       await new Promise((resolve) => setTimeout(resolve, 2000))

//       const isHealthy = Math.random() > 0.2 // 80% success rate for demo

//       setIntegrationStatus((prev) => ({
//         ...prev,
//         [integration.type]: {
//           state: "connected",
//           progress: 100,
//           message: isHealthy ? "Connection healthy" : "Connection issues detected",
//           health: isHealthy ? "healthy" : "warning",
//         },
//       }))
//     } catch (error) {
//       setIntegrationStatus((prev) => ({
//         ...prev,
//         [integration.type]: {
//           state: "connected",
//           progress: 100,
//           message: "Health check failed",
//           health: "error",
//         },
//       }))
//     } finally {
//       setTestingIntegration(null)
//     }
//   }

//   const handleCapabilityToggle = async (integrationId: string, capabilityId: string, enabled: boolean) => {
//     const capabilityKey = `${integrationId}_${capabilityId}`
    
//     // Add to updating set
//     setUpdatingCapabilities(prev => new Set(prev).add(capabilityKey))

//     // Optimistically update UI
//     setEnabledCapabilities((prev) => ({
//       ...prev,
//       [capabilityKey]: enabled,
//     }))

//     // Update integration capabilities in backend
//     try {
//       const response = await fetch(`/api/dashboard/integrations/${integrationId}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           capabilities: {
//             [capabilityId]: enabled,
//           },
//         }),
//       })

//       if (!response.ok) {
//         throw new Error("Failed to update setting")
//       }

//       // Show success feedback
//       toast({
//         title: "Capability Updated",
//         description: `${capabilityId.replace(/_/g, ' ')} has been ${enabled ? "enabled" : "disabled"} for your AI agent.`,
//       })
//     } catch (error) {
//       console.error("Failed to update setting:", error)
//       // Revert the UI change on error
//       setEnabledCapabilities((prev) => ({
//         ...prev,
//         [capabilityKey]: !enabled,
//       }))

//       toast({
//         title: "Update Failed",
//         description: "Failed to update setting. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       // Remove from updating set
//       setUpdatingCapabilities(prev => {
//         const newSet = new Set(prev)
//         newSet.delete(capabilityKey)
//         return newSet
//       })
//     }
//   }

//   const handleBulkCapabilityToggle = async (integrationId: string, capabilities: any[], enable: boolean) => {
//     const updates = capabilities.map(cap => 
//       handleCapabilityToggle(integrationId, cap.id, enable)
//     )
    
//     await Promise.all(updates)
//   }

//   const copyToClipboard = async (text: string, endpointId: string) => {
//     try {
//       await navigator.clipboard.writeText(text)
//       setCopiedEndpoint(endpointId)
//       setTimeout(() => setCopiedEndpoint(null), 2000)
//     } catch (err) {
//       console.error("Failed to copy:", err)
//     }
//   }

//   const isConnected = (integrationType: string) => {
//     return connectedIntegrations.some((integration) => integration.type === integrationType && integration.isActive)
//   }

//   const getConnectedIntegration = (integrationType: string) => {
//     return connectedIntegrations.find((integration) => integration.type === integrationType && integration.isActive)
//   }

//   const getIntegrationStatus = (integrationType: string): IntegrationStatus => {
//     return (
//       integrationStatus[integrationType] || {
//         state: "idle",
//         progress: 0,
//         message: "Not connected",
//       }
//     )
//   }

//   const getHealthBadge = (health?: string) => {
//     switch (health) {
//       case "healthy":
//         return (
//           <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
//             <CheckCircle className="h-3 w-3 mr-1" />
//             Healthy
//           </Badge>
//         )
//       case "warning":
//         return (
//           <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
//             <AlertTriangle className="h-3 w-3 mr-1" />
//             Warning
//           </Badge>
//         )
//       case "error":
//         return (
//           <Badge variant="secondary" className="bg-red-500/10 text-red-400 border-red-500/20">
//             <AlertCircle className="h-3 w-3 mr-1" />
//             Error
//           </Badge>
//         )
//       default:
//         return null
//     }
//   }

//   useEffect(() => {
//     const loadCapabilities = () => {
//       const capabilities: Record<string, boolean> = {}

//       connectedIntegrations.forEach((integration) => {
//         if (integration.capabilities) {
//           try {
//             const parsedCapabilities =
//               typeof integration.capabilities === "string"
//                 ? JSON.parse(integration.capabilities)
//                 : integration.capabilities

//             Object.entries(parsedCapabilities).forEach(([capId, enabled]) => {
//               capabilities[`${integration.id}_${capId}`] = enabled as boolean
//             })
//           } catch (error) {
//             console.error("Failed to parse capabilities for integration:", integration.id, error)
//           }
//         }
//       })

//       setEnabledCapabilities(capabilities)
//     }

//     if (connectedIntegrations.length > 0) {
//       loadCapabilities()
//     }
//   }, [connectedIntegrations])

//   const renderCapabilities = (integration: any, connectedIntegration: Integration) => {
//     if (!integration.capabilities) return null

//     const enabledCount = integration.capabilities.filter(
//       (cap: any) => enabledCapabilities[`${connectedIntegration?.id}_${cap.id}`] !== false,
//     ).length

//     return (
//       <div className="space-y-3">
//         <div className="flex items-center justify-between">
//           <p className="text-sm font-medium">AI Agent Capabilities:</p>
//           <Badge variant="outline" className="text-xs">
//             {enabledCount} enabled
//           </Badge>
//         </div>
//         <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
//           {integration.capabilities.map((capability: any) => {
//             const capabilityKey = `${connectedIntegration?.id}_${capability.id}`
//             const isEnabled = enabledCapabilities[capabilityKey] !== false
//             const isUpdating = updatingCapabilities.has(capabilityKey)
            
//             return (
//               <div
//                 key={capability.id}
//                 className={`group relative flex items-start gap-3 p-3 rounded-lg transition-all duration-200 ${
//                   isEnabled 
//                     ? 'bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/15 hover:border-emerald-500/30' 
//                     : 'bg-muted/30 border border-transparent hover:bg-muted/50 hover:border-border'
//                 } ${isUpdating ? 'opacity-70' : ''}`}
//               >
//                 <div className="relative">
//                   <Switch
//                     checked={isEnabled}
//                     onCheckedChange={(enabled) =>
//                       handleCapabilityToggle(connectedIntegration?.id || "", capability.id, enabled)
//                     }
//                     disabled={isUpdating}
//                     className="mt-0.5"
//                   />
                  
//                   {/* Hover tooltip */}
//                   <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
//                     <div className="bg-popover text-popover-foreground px-3 py-2 rounded-md shadow-lg border text-xs whitespace-nowrap">
//                       {isEnabled ? 'Disable' : 'Enable'}
//                       <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover"></div>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-2 mb-1">
//                     <p className={`text-sm font-medium transition-colors duration-200 ${
//                       isEnabled ? 'text-foreground' : 'text-muted-foreground'
//                     }`}>
//                       {capability.name}
//                     </p>
//                     {isEnabled && !isUpdating && (
//                       <Badge variant="secondary" className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
//                         Active
//                       </Badge>
//                     )}
//                     {isUpdating && (
//                       <div className="flex items-center gap-1">
//                         <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
//                         <span className="text-xs text-muted-foreground">Updating...</span>
//                       </div>
//                     )}
//                   </div>
//                   <p className={`text-xs transition-colors duration-200 ${
//                     isEnabled ? 'text-muted-foreground' : 'text-muted-foreground/70'
//                   }`}>
//                     {capability.description}
//                   </p>
                  
//                   {/* Additional context on hover */}
//                   <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-1">
//                     <p className="text-xs text-primary/70">
//                       {isEnabled 
//                         ? 'This capability is available to your AI agent in conversations'
//                         : 'Enable this to allow your AI agent to perform this action'
//                       }
//                     </p>
//                   </div>
//                 </div>
                
//                 {/* Visual indicator */}
//                 <div className={`w-2 h-2 rounded-full transition-all duration-200 mt-2 ${
//                   isEnabled 
//                     ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' 
//                     : 'bg-muted-foreground/30'
//                 }`} />
//               </div>
//             );
//           })}
//         </div>
        
//         {/* Bulk actions */}
//         <div className="flex gap-2 pt-2 border-t border-border/50">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => handleBulkCapabilityToggle(connectedIntegration?.id || "", integration.capabilities, true)}
//             className="flex-1 text-xs hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400"
//             disabled={enabledCount === integration.capabilities.length}
//           >
//             <CheckCircle className="h-3 w-3 mr-1" />
//             Enable All
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => handleBulkCapabilityToggle(connectedIntegration?.id || "", integration.capabilities, false)}
//             className="flex-1 text-xs hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
//             disabled={enabledCount === 0}
//           >
//             <AlertCircle className="h-3 w-3 mr-1" />
//             Disable All
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="container mx-auto px-4 py-8 max-w-7xl">
//         <div className="space-y-8">
//           <div className="space-y-4">
//             <div className="flex items-center gap-3">
//               <div className="p-3 rounded-xl bg-primary/10">
//                 <Zap className="h-6 w-6 text-primary" />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold text-balance">My tools</h1>
//                 <p className="text-muted-foreground text-pretty">
//                   Connect your favorite tools to automate processes on your DMs.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {error && (
//             <Alert className="border-destructive/20 bg-destructive/5">
//               <AlertCircle className="h-4 w-4" />
//               <AlertDescription className="text-destructive">{error}</AlertDescription>
//             </Alert>
//           )}

//           {success && (
//             <Alert className="border-emerald-500/20 bg-emerald-500/5">
//               <CheckCircle className="h-4 w-4 text-emerald-500" />
//               <AlertDescription className="text-emerald-600">{success}</AlertDescription>
//             </Alert>
//           )}

//           {/* Configuration Dialog */}
//           {configureIntegration && (
//             <Dialog open={!!configureIntegration} onOpenChange={() => setConfigureIntegration(null)}>
//               <DialogContent className="max-w-md bg-card border-border">
//                 <DialogHeader>
//                   <DialogTitle className="flex items-center gap-2">
//                     <configureIntegration.integration.icon className="h-5 w-5" />
//                     Configure {configureIntegration.integration.name}
//                   </DialogTitle>
//                   <DialogDescription>
//                     Update your {configureIntegration.integration.name} credentials and settings
//                   </DialogDescription>
//                 </DialogHeader>

//                 <div className="space-y-4">
//                   {configureIntegration.integration.fields.map((field: IntegrationField) => (
//                     <div key={field.key} className="space-y-2">
//                       <Label htmlFor={field.key} className="flex items-center gap-2">
//                         {field.label}
//                         {field.required && <span className="text-destructive">*</span>}
//                       </Label>
//                       {field.type === "textarea" ? (
//                         <Textarea
//                           id={field.key}
//                           placeholder={field.placeholder}
//                           value={configFormData[field.key] || ""}
//                           onChange={(e) =>
//                             setConfigFormData({ ...configFormData, [field.key]: e.target.value })
//                           }
//                           className="bg-background border-border"
//                         />
//                       ) : field.type === "select" ? (
//                         <select
//                           id={field.key}
//                           value={configFormData[field.key] || ""}
//                           onChange={(e) =>
//                             setConfigFormData({ ...configFormData, [field.key]: e.target.value })
//                           }
//                           className="w-full px-3 py-2 bg-background border border-border rounded-md"
//                         >
//                           <option value="">Select {field.label}</option>
//                           {field.options?.map((option) => (
//                             <option key={option} value={option}>
//                               {option}
//                             </option>
//                           ))}
//                         </select>
//                       ) : (
//                         <div className="relative">
//                           <Input
//                             id={field.key}
//                             type={
//                               field.type === "password" && !showCredentials[field.key]
//                                 ? "password"
//                                 : field.type === "email"
//                                   ? "email"
//                                   : field.type === "tel"
//                                     ? "tel"
//                                     : "text"
//                             }
//                             placeholder={field.type === "password" ? "Enter new value to update" : field.placeholder}
//                             value={configFormData[field.key] || ""}
//                             onChange={(e) =>
//                               setConfigFormData({ ...configFormData, [field.key]: e.target.value })
//                             }
//                             className="bg-background border-border pr-10"
//                           />
//                           {field.type === "password" && (
//                             <Button
//                               type="button"
//                               variant="ghost"
//                               size="sm"
//                               className="absolute right-0 top-0 h-full px-3"
//                               onClick={() =>
//                                 setShowCredentials({
//                                   ...showCredentials,
//                                   [field.key]: !showCredentials[field.key],
//                                 })
//                               }
//                             >
//                               {showCredentials[field.key] ? (
//                                 <EyeOff className="h-4 w-4" />
//                               ) : (
//                                 <Eye className="h-4 w-4" />
//                               )}
//                             </Button>
//                           )}
//                         </div>
//                       )}
//                       {field.type === "password" && (
//                         <p className="text-xs text-muted-foreground">
//                           Leave blank to keep existing credentials
//                         </p>
//                       )}
//                     </div>
//                   ))}

//                   <div className="flex gap-2 pt-4">
//                     <Button
//                       variant="outline"
//                       className="flex-1 bg-transparent"
//                       onClick={() => setConfigureIntegration(null)}
//                       disabled={savingConfig}
//                     >
//                       <X className="h-4 w-4 mr-2" />
//                       Cancel
//                     </Button>
//                     <Button
//                       className="flex-1"
//                       onClick={handleUpdateConfiguration}
//                       disabled={savingConfig}
//                     >
//                       {savingConfig ? (
//                         <>
//                           <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                           Saving...
//                         </>
//                       ) : (
//                         <>
//                           <Save className="h-4 w-4 mr-2" />
//                           Save Changes
//                         </>
//                       )}
//                     </Button>
//                   </div>
//                 </div>
//               </DialogContent>
//             </Dialog>
//           )}

//           <Tabs value={activeCategory} onValueChange={setActiveCategory} className="space-y-6">
//             <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-muted/50">
//               {Object.entries(INTEGRATION_CATEGORIES).map(([key, category]) => {
//                 const Icon = category.icon
//                 return (
//                   <TabsTrigger
//                     key={key}
//                     value={key}
//                     className="flex items-center gap-2 data-[state=active]:bg-background"
//                   >
//                     <Icon className="h-4 w-4" />
//                     <span className="hidden sm:inline">{category.title.split(" ")[0]}</span>
//                   </TabsTrigger>
//                 )
//               })}
//             </TabsList>

//             {Object.entries(INTEGRATION_CATEGORIES).map(([categoryKey, category]) => (
//               <TabsContent key={categoryKey} value={categoryKey} className="space-y-6">
//                 <div className="space-y-4">
//                   <div className="flex items-center gap-3">
//                     <div className={`p-2 rounded-lg ${category.color}`}>
//                       <category.icon className="h-5 w-5" />
//                     </div>
//                     <div>
//                       <h2 className="text-xl font-semibold">{category.title}</h2>
//                       <p className="text-sm text-muted-foreground">{category.description}</p>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                     {category.integrations.map((integration) => {
//                       const connected = isConnected(integration.type)
//                       const connectedIntegration = getConnectedIntegration(integration.type)
//                       const status = getIntegrationStatus(integration.type)
//                       const Icon = integration.icon

//                       return (
//                         <Card
//                           key={integration.id}
//                           className={`relative transition-all duration-200 hover:shadow-lg ${
//                             connected
//                               ? "bg-emerald-500/5 border-emerald-500/20"
//                               : "bg-card/50 border-border hover:border-primary/30"
//                           }`}
//                         >
//                           <CardHeader className="pb-3">
//                             <div className="flex items-start justify-between">
//                               <div className="flex items-center gap-3">
//                                 <div className={`p-2 rounded-lg ${category.color}`}>
//                                   <Icon className="h-5 w-5" />
//                                 </div>
//                                 <div>
//                                   <CardTitle className="text-lg">{integration.name}</CardTitle>
//                                   <div className="flex items-center gap-2 mt-1">
//                                     {connected && (
//                                       <Badge
//                                         variant="secondary"
//                                         className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
//                                       >
//                                         <CheckCircle className="h-3 w-3 mr-1" />
//                                         Connected
//                                       </Badge>
//                                     )}
//                                     {connected && getHealthBadge(status.health)}
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                             <CardDescription className="text-sm">{integration.description}</CardDescription>
//                           </CardHeader>

//                           <CardContent className="space-y-4">
//                             {status.state !== "idle" && (
//                               <div className="space-y-2">
//                                 <div className="flex items-center justify-between text-sm">
//                                   <span className="text-muted-foreground">Status</span>
//                                   <span
//                                     className={`font-medium ${
//                                       status.state === "connected"
//                                         ? "text-emerald-400"
//                                         : status.state === "error"
//                                           ? "text-red-400"
//                                           : "text-blue-400"
//                                     }`}
//                                   >
//                                     {status.message}
//                                   </span>
//                                 </div>
//                                 {status.state === "connecting" && <Progress value={status.progress} className="h-2" />}
//                               </div>
//                             )}

//                             {connected && renderCapabilities(integration, connectedIntegration!)}

//                             {/* {connected && integration.endpoints && integration.endpoints.length > 0 && (
//                               <div className="space-y-3">
//                                 <Button
//                                   variant="outline"
//                                   size="sm"
//                                   onClick={() =>
//                                     setShowApiDocs({
//                                       ...showApiDocs,
//                                       [integration.id]: !showApiDocs[integration.id],
//                                     })
//                                   }
//                                   className="w-full"
//                                 >
//                                   <Code className="h-4 w-4 mr-2" />
//                                   {showApiDocs[integration.id] ? "Hide" : "Show"} API Documentation
//                                 </Button>

//                                 {showApiDocs[integration.id] && (
//                                   <div className="space-y-3 p-3 rounded-lg bg-muted/20 border">
//                                     <p className="text-sm font-medium text-primary">Voiceflow API Endpoints:</p>
//                                     {integration.endpoints.map((endpoint, idx) => (
//                                       <div key={idx} className="space-y-2 p-3 rounded bg-background/50 border">
//                                         <div className="flex items-center justify-between">
//                                           <div className="flex items-center gap-2">
//                                             <Badge variant="outline" className="text-xs font-mono">
//                                               {endpoint.method}
//                                             </Badge>
//                                             <code className="text-xs">{endpoint.path}</code>
//                                           </div>
//                                           <Button
//                                             variant="ghost"
//                                             size="sm"
//                                             onClick={() => copyToClipboard(endpoint.path, `${integration.id}_${idx}`)}
//                                           >
//                                             {copiedEndpoint === `${integration.id}_${idx}` ? (
//                                               <Check className="h-3 w-3" />
//                                             ) : (
//                                               <Copy className="h-3 w-3" />
//                                             )}
//                                           </Button>
//                                         </div>
//                                         <p className="text-xs text-muted-foreground">{endpoint.description}</p>
//                                       </div>
//                                     ))}
//                                   </div>
//                                 )}
//                               </div>
//                             )} */}

//                             <Separator />

//                             <div className="flex gap-2">
//                               {connected ? (
//                                 <>
//                                   <Button
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={() => handleDisconnect(connectedIntegration!.id, integration.type)}
//                                     disabled={isLoading}
//                                     className="flex-1"
//                                   >
//                                     <Trash2 className="h-4 w-4 mr-2" />
//                                     Disconnect
//                                   </Button>
//                                   {integration.testable && (
//                                     <Button
//                                       variant="outline"
//                                       size="sm"
//                                       onClick={() => testIntegrationHealth(integration, connectedIntegration!)}
//                                       disabled={testingIntegration === integration.type}
//                                       className="flex-1"
//                                     >
//                                       {testingIntegration === integration.type ? (
//                                         <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                                       ) : (
//                                         <Activity className="h-4 w-4 mr-2" />
//                                       )}
//                                       Test Health
//                                     </Button>
//                                   )}
//                                   <Button
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={() => handleConfigure(integration, connectedIntegration!)}
//                                     className="flex-1"
//                                   >
//                                     <Settings className="h-4 w-4 mr-2" />
//                                     Configure
//                                   </Button>
//                                 </>
//                               ) : (
//                                 <Dialog>
//                                   <DialogTrigger asChild>
//                                     <Button
//                                       className="w-full"
//                                       onClick={() => {
//                                         setSelectedIntegration(integration)
//                                         setFormData({})
//                                         setError(null)
//                                         setSuccess(null)
//                                       }}
//                                       disabled={status.state === "connecting"}
//                                     >
//                                       {status.state === "connecting" ? (
//                                         <>
//                                           <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                                           Connecting...
//                                         </>
//                                       ) : (
//                                         <>
//                                           <Plus className="h-4 w-4 mr-2" />
//                                           Connect
//                                         </>
//                                       )}
//                                     </Button>
//                                   </DialogTrigger>
//                                   <DialogContent className="max-w-md bg-card border-border">
//                                     <DialogHeader>
//                                       <DialogTitle className="flex items-center gap-2">
//                                         <Icon className="h-5 w-5" />
//                                         Connect {integration.name}
//                                       </DialogTitle>
//                                       <DialogDescription>
//                                         Enter your {integration.name} credentials to enable automation
//                                       </DialogDescription>
//                                     </DialogHeader>

//                                     <div className="space-y-4">
//                                       {integration.fields.map((field: IntegrationField) => (
//                                         <div key={field.key} className="space-y-2">
//                                           <Label htmlFor={field.key} className="flex items-center gap-2">
//                                             {field.label}
//                                             {field.required && <span className="text-destructive">*</span>}
//                                           </Label>
//                                           {field.type === "textarea" ? (
//                                             <Textarea
//                                               id={field.key}
//                                               placeholder={field.placeholder}
//                                               value={formData[field.key] || ""}
//                                               onChange={(e) =>
//                                                 setFormData({ ...formData, [field.key]: e.target.value })
//                                               }
//                                               className="bg-background border-border"
//                                             />
//                                           ) : field.type === "select" ? (
//                                             <select
//                                               id={field.key}
//                                               value={formData[field.key] || ""}
//                                               onChange={(e) =>
//                                                 setFormData({ ...formData, [field.key]: e.target.value })
//                                               }
//                                               className="w-full px-3 py-2 bg-background border border-border rounded-md"
//                                             >
//                                               <option value="">Select {field.label}</option>
//                                               {field.options?.map((option) => (
//                                                 <option key={option} value={option}>
//                                                   {option}
//                                                 </option>
//                                               ))}
//                                             </select>
//                                           ) : (
//                                             <div className="relative">
//                                               <Input
//                                                 id={field.key}
//                                                 type={
//                                                   field.type === "password" && !showCredentials[field.key]
//                                                     ? "password"
//                                                     : field.type === "email"
//                                                       ? "email"
//                                                       : field.type === "tel"
//                                                         ? "tel"
//                                                         : "text"
//                                                 }
//                                                 placeholder={field.placeholder}
//                                                 value={formData[field.key] || ""}
//                                                 onChange={(e) =>
//                                                   setFormData({ ...formData, [field.key]: e.target.value })
//                                                 }
//                                                 className="bg-background border-border pr-10"
//                                               />
//                                               {field.type === "password" && (
//                                                 <Button
//                                                   type="button"
//                                                   variant="ghost"
//                                                   size="sm"
//                                                   className="absolute right-0 top-0 h-full px-3"
//                                                   onClick={() =>
//                                                     setShowCredentials({
//                                                       ...showCredentials,
//                                                       [field.key]: !showCredentials[field.key],
//                                                     })
//                                                   }
//                                                 >
//                                                   {showCredentials[field.key] ? (
//                                                     <EyeOff className="h-4 w-4" />
//                                                   ) : (
//                                                     <Eye className="h-4 w-4" />
//                                                   )}
//                                                 </Button>
//                                               )}
//                                             </div>
//                                           )}
//                                         </div>
//                                       ))}

//                                       <div className="flex gap-2 pt-4">
//                                         <Button
//                                           variant="outline"
//                                           className="flex-1 bg-transparent"
//                                           onClick={() => setSelectedIntegration(null)}
//                                         >
//                                           Cancel
//                                         </Button>
//                                         <Button
//                                           className="flex-1"
//                                           onClick={() => handleConnect(integration)}
//                                           disabled={status.state === "connecting"}
//                                         >
//                                           {status.state === "connecting" ? (
//                                             <>
//                                               <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                                               Connecting...
//                                             </>
//                                           ) : (
//                                             "Connect"
//                                           )}
//                                         </Button>
//                                       </div>
//                                     </div>
//                                   </DialogContent>
//                                 </Dialog>
//                               )}
//                             </div>
//                           </CardContent>
//                         </Card>
//                       )
//                     })}
//                   </div>
//                 </div>
//               </TabsContent>
//             ))}
//           </Tabs>
//         </div>
//       </div>
//     </div>
//   )
// }

// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Separator } from "@/components/ui/separator"
// import { Switch } from "@/components/ui/switch"
// import { Progress } from "@/components/ui/progress"
// import {
//   CreditCard,
//   Users,
//   Calendar,
//   Mail,
//   MessageSquare,
//   ShoppingCart,
//   Settings,
//   CheckCircle,
//   AlertCircle,
//   Plus,
//   Trash2,
//   Eye,
//   EyeOff,
//   Zap,
//   Building2,
//   Phone,
//   Database,
//   Loader2,
//   Activity,
//   AlertTriangle,
//   Save,
//   X,
//   Shield,
//   Clock,
//   TrendingUp,
// } from "lucide-react"
// import { toast } from "@/hooks/use-toast"

// import { OAuthFlow } from "../_components/tools/oauth-flow"
// import { EnvironmentSelector } from "../_components/tools/environment-selector"
// import { WebhookConfiguration } from "../_components/tools/webhook-configuration"
// import { CredentialValidator } from "../_components/tools/credential-validator"
// import { HealthMonitoringDashboard } from "../_components/tools/health-monitoring-dashboard"
// import { RateLimitMonitor } from "../_components/tools/rate-limit-monitor"
// import { UsageAnalytics } from "../_components/tools/usage-analytics"
// import { ErrorRecoverySystem } from "../_components/tools/error-recovery-system"
// import { IntegrationSetupWizard } from "../_components/tools/integration-setup-wizard"

// const INTEGRATION_CATEGORIES = {
//   ecommerce: {
//     title: "E-commerce & Payments",
//     description: "Process payments, manage orders, and handle customer transactions seamlessly",
//     icon: ShoppingCart,
//     color: "bg-emerald-500/10 text-emerald-400",
//     integrations: [
//       {
//         id: "stripe",
//         name: "Stripe",
//         type: "STRIPE",
//         description:
//           "Accept payments, create payment links, and manage subscriptions with the world's leading payment processor",
//         icon: CreditCard,
//         fields: [
//           { key: "secretKey", label: "Secret Key", type: "password", required: true, placeholder: "sk_test_..." },
//           { key: "publishableKey", label: "Publishable Key", type: "text", required: true, placeholder: "pk_test_..." },
//         ],
//         capabilities: [
//           {
//             id: "create_payment_link",
//             name: "Create Payment Links",
//             description: "Generate secure payment links for products or services",
//           },
//           {
//             id: "verify_payment",
//             name: "Verify Payments",
//             description: "Check payment status and confirm successful transactions",
//           },
//           {
//             id: "manage_subscriptions",
//             name: "Manage Subscriptions",
//             description: "Create, update, and cancel customer subscriptions",
//           },
//           {
//             id: "process_refunds",
//             name: "Process Refunds",
//             description: "Issue full or partial refunds for completed payments",
//           },
//         ],
//         endpoints: [
//           { method: "POST", path: "/api/voiceflow/stripe/create-payment-link", description: "Create payment link" },
//           { method: "GET", path: "/api/voiceflow/stripe/verify-payment", description: "Verify payment status" },
//         ],
//         testable: true,
//       },
//       {
//         id: "paypal",
//         name: "PayPal",
//         type: "PAYPAL",
//         description: "Accept PayPal payments and manage transactions with 400+ million active users worldwide",
//         icon: CreditCard,
//         fields: [
//           { key: "clientId", label: "Client ID", type: "text", required: true, placeholder: "Your PayPal Client ID" },
//           {
//             key: "clientSecret",
//             label: "Client Secret",
//             type: "password",
//             required: true,
//             placeholder: "Your PayPal Client Secret",
//           },
//           { key: "environment", label: "Environment", type: "select", required: true, options: ["sandbox", "live"] },
//         ],
//         capabilities: [
//           {
//             id: "create_payment",
//             name: "Create Payments",
//             description: "Generate PayPal payment requests for customers",
//           },
//           {
//             id: "verify_payment",
//             name: "Verify Payments",
//             description: "Confirm PayPal payment completion and status",
//           },
//         ],
//         endpoints: [
//           { method: "POST", path: "/api/voiceflow/paypal/create-payment", description: "Create PayPal payment" },
//         ],
//         testable: true,
//       },
//       {
//         id: "shopify",
//         name: "Shopify",
//         type: "SHOPIFY",
//         description: "Manage products, orders, and customer data from your Shopify store",
//         icon: ShoppingCart,
//         fields: [
//           {
//             key: "shopDomain",
//             label: "Shop Domain",
//             type: "text",
//             required: true,
//             placeholder: "your-shop.myshopify.com",
//           },
//           { key: "accessToken", label: "Access Token", type: "password", required: true, placeholder: "shpat_..." },
//         ],
//         capabilities: [
//           {
//             id: "get_products",
//             name: "Get Products",
//             description: "Retrieve product information and inventory levels",
//           },
//           { id: "create_order", name: "Create Orders", description: "Generate new orders directly from conversations" },
//           {
//             id: "update_inventory",
//             name: "Update Inventory",
//             description: "Modify product stock levels and availability",
//           },
//         ],
//         endpoints: [{ method: "GET", path: "/api/voiceflow/shopify/get-product", description: "Get product details" }],
//         testable: true,
//       },
//     ],
//   },
//   crm: {
//     title: "CRM & Customer Management",
//     description: "Manage leads, contacts, and customer relationships to grow your business",
//     icon: Users,
//     color: "bg-blue-500/10 text-blue-400",
//     integrations: [
//       {
//         id: "hubspot",
//         name: "HubSpot",
//         type: "HUBSPOT",
//         description: "Manage contacts, deals, and customer interactions with the leading CRM platform",
//         icon: Users,
//         fields: [
//           { key: "accessToken", label: "Access Token", type: "password", required: true, placeholder: "pat-na1-..." },
//         ],
//         capabilities: [
//           {
//             id: "create_contact",
//             name: "Create Contacts",
//             description: "Add new leads and customers to your CRM automatically",
//           },
//           {
//             id: "update_contact",
//             name: "Update Contacts",
//             description: "Modify existing contact information and properties",
//           },
//           {
//             id: "create_deal",
//             name: "Create Deals",
//             description: "Generate new sales opportunities from conversations",
//           },
//           {
//             id: "log_activity",
//             name: "Log Activities",
//             description: "Record customer interactions and engagement history",
//           },
//         ],
//         endpoints: [
//           { method: "POST", path: "/api/voiceflow/hubspot/create-contact", description: "Create new contact" },
//         ],
//         testable: true,
//       },
//       {
//         id: "salesforce",
//         name: "Salesforce",
//         type: "SALESFORCE",
//         description: "Integrate with the world's #1 CRM to manage leads, opportunities, and customer data",
//         icon: Building2,
//         fields: [
//           {
//             key: "instanceUrl",
//             label: "Instance URL",
//             type: "text",
//             required: true,
//             placeholder: "https://yourinstance.salesforce.com",
//           },
//           {
//             key: "accessToken",
//             label: "Access Token",
//             type: "password",
//             required: true,
//             placeholder: "Your access token",
//           },
//         ],
//         capabilities: [
//           {
//             id: "create_lead",
//             name: "Create Leads",
//             description: "Capture new leads directly from Instagram conversations",
//           },
//           {
//             id: "create_opportunity",
//             name: "Create Opportunities",
//             description: "Generate sales opportunities from qualified leads",
//           },
//           { id: "update_records", name: "Update Records", description: "Modify existing Salesforce records and data" },
//         ],
//         endpoints: [],
//         testable: false,
//       },
//     ],
//   },
//   communication: {
//     title: "Communication & Messaging",
//     description: "Send messages, emails, and notifications across multiple platforms",
//     icon: MessageSquare,
//     color: "bg-purple-500/10 text-purple-400",
//     integrations: [
//       {
//         id: "slack",
//         name: "Slack",
//         type: "SLACK",
//         description: "Send messages and notifications to your team channels and direct messages",
//         icon: MessageSquare,
//         fields: [
//           { key: "botToken", label: "Bot Token", type: "password", required: true, placeholder: "xoxb-..." },
//           {
//             key: "signingSecret",
//             label: "Signing Secret",
//             type: "password",
//             required: true,
//             placeholder: "Your signing secret",
//           },
//         ],
//         capabilities: [
//           { id: "send_message", name: "Send Messages", description: "Post messages to channels or direct messages" },
//           {
//             id: "create_channel",
//             name: "Create Channels",
//             description: "Set up new channels for customer discussions",
//           },
//           { id: "invite_users", name: "Invite Users", description: "Add team members to relevant conversations" },
//         ],
//         endpoints: [{ method: "POST", path: "/api/voiceflow/slack/send-message", description: "Send Slack message" }],
//         testable: true,
//       },
//       {
//         id: "discord",
//         name: "Discord",
//         type: "DISCORD",
//         description: "Engage with your community through Discord servers and channels",
//         icon: MessageSquare,
//         fields: [
//           {
//             key: "botToken",
//             label: "Bot Token",
//             type: "password",
//             required: true,
//             placeholder: "Your Discord bot token",
//           },
//           { key: "guildId", label: "Server ID", type: "text", required: true, placeholder: "Your Discord server ID" },
//         ],
//         capabilities: [
//           { id: "send_message", name: "Send Messages", description: "Post messages to Discord channels" },
//           { id: "create_embed", name: "Create Embeds", description: "Send rich embedded messages with formatting" },
//           { id: "manage_roles", name: "Manage Roles", description: "Assign or remove roles from community members" },
//         ],
//         endpoints: [
//           { method: "POST", path: "/api/voiceflow/discord/send-message", description: "Send Discord message" },
//         ],
//         testable: true,
//       },
//       {
//         id: "sendgrid",
//         name: "SendGrid",
//         type: "SENDGRID",
//         description: "Send transactional emails, newsletters, and automated email sequences",
//         icon: Mail,
//         fields: [
//           { key: "apiKey", label: "API Key", type: "password", required: true, placeholder: "SG...." },
//           {
//             key: "fromEmail",
//             label: "From Email",
//             type: "email",
//             required: true,
//             placeholder: "noreply@yourdomain.com",
//           },
//         ],
//         capabilities: [
//           { id: "send_email", name: "Send Emails", description: "Send personalized emails to customers and leads" },
//           {
//             id: "send_template",
//             name: "Send Templates",
//             description: "Use pre-designed email templates for consistency",
//           },
//           { id: "manage_lists", name: "Manage Lists", description: "Add contacts to email marketing lists" },
//         ],
//         endpoints: [{ method: "POST", path: "/api/voiceflow/sendgrid/send-email", description: "Send email" }],
//         testable: true,
//       },
//       {
//         id: "twilio",
//         name: "Twilio",
//         type: "TWILIO",
//         description: "Send SMS messages and make voice calls to customers worldwide",
//         icon: Phone,
//         fields: [
//           { key: "accountSid", label: "Account SID", type: "text", required: true, placeholder: "AC..." },
//           { key: "authToken", label: "Auth Token", type: "password", required: true, placeholder: "Your auth token" },
//           { key: "phoneNumber", label: "Phone Number", type: "tel", required: true, placeholder: "+1234567890" },
//         ],
//         capabilities: [
//           { id: "send_sms", name: "Send SMS", description: "Send text messages to customer phone numbers" },
//           { id: "make_call", name: "Make Calls", description: "Initiate voice calls for important notifications" },
//           {
//             id: "verify_phone",
//             name: "Verify Phone",
//             description: "Send verification codes for phone number validation",
//           },
//         ],
//         endpoints: [{ method: "POST", path: "/api/voiceflow/twilio/send-sms", description: "Send SMS message" }],
//         testable: true,
//       },
//     ],
//   },
//   scheduling: {
//     title: "Scheduling & Meetings",
//     description: "Book appointments, schedule meetings, and manage calendar events",
//     icon: Calendar,
//     color: "bg-orange-500/10 text-orange-400",
//     integrations: [
//       {
//         id: "calendly",
//         name: "Calendly",
//         type: "CALENDLY",
//         description: "Schedule meetings and appointments with automatic calendar integration",
//         icon: Calendar,
//         fields: [
//           {
//             key: "accessToken",
//             label: "Access Token",
//             type: "password",
//             required: true,
//             placeholder: "Your Calendly access token",
//           },
//         ],
//         capabilities: [
//           {
//             id: "create_booking",
//             name: "Create Bookings",
//             description: "Schedule appointments directly from conversations",
//           },
//           {
//             id: "check_availability",
//             name: "Check Availability",
//             description: "View available time slots for scheduling",
//           },
//           { id: "cancel_booking", name: "Cancel Bookings", description: "Cancel or reschedule existing appointments" },
//         ],
//         endpoints: [{ method: "POST", path: "/api/voiceflow/calendly/create-booking", description: "Create booking" }],
//         testable: true,
//       },
//       {
//         id: "zoom",
//         name: "Zoom",
//         type: "ZOOM",
//         description: "Create and manage video meetings for customer consultations and support",
//         icon: Calendar,
//         fields: [
//           {
//             key: "accessToken",
//             label: "Access Token",
//             type: "password",
//             required: true,
//             placeholder: "Your Zoom access token",
//           },
//           {
//             key: "refreshToken",
//             label: "Refresh Token",
//             type: "password",
//             required: true,
//             placeholder: "Your refresh token",
//           },
//         ],
//         capabilities: [
//           { id: "create_meeting", name: "Create Meetings", description: "Generate Zoom meetings with custom settings" },
//           {
//             id: "schedule_webinar",
//             name: "Schedule Webinars",
//             description: "Set up webinars for product demonstrations",
//           },
//           { id: "manage_recordings", name: "Manage Recordings", description: "Access and share meeting recordings" },
//         ],
//         endpoints: [{ method: "POST", path: "/api/voiceflow/zoom/create-meeting", description: "Create Zoom meeting" }],
//         testable: true,
//       },
//     ],
//   },
//   productivity: {
//     title: "Productivity & Automation",
//     description: "Automate workflows, manage tasks, and boost team productivity",
//     icon: Zap,
//     color: "bg-pink-500/10 text-pink-400",
//     integrations: [
//       {
//         id: "notion",
//         name: "Notion",
//         type: "NOTION",
//         description: "Create pages, update databases, and manage your workspace content",
//         icon: Database,
//         fields: [
//           { key: "accessToken", label: "Access Token", type: "password", required: true, placeholder: "secret_..." },
//         ],
//         capabilities: [
//           { id: "create_page", name: "Create Pages", description: "Generate new pages and documents automatically" },
//           {
//             id: "update_database",
//             name: "Update Database",
//             description: "Add and modify database entries from conversations",
//           },
//           {
//             id: "search_content",
//             name: "Search Content",
//             description: "Find and retrieve information from your workspace",
//           },
//         ],
//         endpoints: [{ method: "POST", path: "/api/voiceflow/notion/create-page", description: "Create Notion page" }],
//         testable: true,
//       },
//       {
//         id: "airtable",
//         name: "Airtable",
//         type: "AIRTABLE",
//         description: "Manage databases, track projects, and organize customer information",
//         icon: Database,
//         fields: [
//           { key: "apiKey", label: "API Key", type: "password", required: true, placeholder: "key..." },
//           { key: "baseId", label: "Base ID", type: "text", required: true, placeholder: "app..." },
//         ],
//         capabilities: [
//           { id: "create_record", name: "Create Records", description: "Add new entries to your Airtable bases" },
//           { id: "update_record", name: "Update Records", description: "Modify existing data and information" },
//           { id: "search_records", name: "Search Records", description: "Find and retrieve specific database entries" },
//         ],
//         endpoints: [],
//         testable: false,
//       },
//       {
//         id: "mailchimp",
//         name: "Mailchimp",
//         type: "MAILCHIMP",
//         description: "Manage email lists, create campaigns, and track marketing performance",
//         icon: Mail,
//         fields: [
//           { key: "apiKey", label: "API Key", type: "password", required: true, placeholder: "Your Mailchimp API key" },
//           { key: "serverPrefix", label: "Server Prefix", type: "text", required: true, placeholder: "us1, us2, etc." },
//         ],
//         capabilities: [
//           { id: "add_subscriber", name: "Add Subscribers", description: "Add contacts to email marketing lists" },
//           {
//             id: "create_campaign",
//             name: "Create Campaigns",
//             description: "Set up automated email marketing campaigns",
//           },
//           { id: "track_analytics", name: "Track Analytics", description: "Monitor email performance and engagement" },
//         ],
//         endpoints: [{ method: "POST", path: "/api/voiceflow/mailchimp/add-subscriber", description: "Add subscriber" }],
//         testable: true,
//       },
//     ],
//   },
// }

// interface Integration {
//   id: string
//   name: string
//   type: string
//   isActive: boolean
//   lastSyncAt?: string
//   lastErrorAt?: string
//   lastError?: string
//   syncCount?: number
//   errorCount?: number
//   hasValidToken?: boolean
//   tokenExpiresAt?: string
//   capabilities?: string | Record<string, boolean>
// }

// interface IntegrationField {
//   key: string
//   label: string
//   type: string
//   required: boolean
//   placeholder?: string
//   options?: string[]
// }

// type IntegrationState = "idle" | "connecting" | "connected" | "error" | "testing"

// interface IntegrationStatus {
//   state: IntegrationState
//   progress: number
//   message: string
//   health?: "healthy" | "warning" | "error"
// }

// export default function IntegrationsPage() {
//   const [activeCategory, setActiveCategory] = useState("ecommerce")
//   const [connectedIntegrations, setConnectedIntegrations] = useState<Integration[]>([])
//   const [isLoading, setIsLoading] = useState(false)
//   const [selectedIntegration, setSelectedIntegration] = useState<any>(null)
//   const [configureIntegration, setConfigureIntegration] = useState<{ integration: any; connected: Integration } | null>(
//     null,
//   )
//   const [showCredentials, setShowCredentials] = useState<Record<string, boolean>>({})
//   const [formData, setFormData] = useState<Record<string, string>>({})
//   const [configFormData, setConfigFormData] = useState<Record<string, string>>({})
//   const [error, setError] = useState<string | null>(null)
//   const [success, setSuccess] = useState<string | null>(null)
//   const [enabledCapabilities, setEnabledCapabilities] = useState<Record<string, boolean>>({})
//   const [updatingCapabilities, setUpdatingCapabilities] = useState<Set<string>>(new Set())
//   const [showApiDocs, setShowApiDocs] = useState<Record<string, boolean>>({})
//   const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null)
//   const [savingConfig, setSavingConfig] = useState(false)

//   const [integrationStatus, setIntegrationStatus] = useState<Record<string, IntegrationStatus>>({})
//   const [testingIntegration, setTestingIntegration] = useState<string | null>(null)

//   const [showAdvancedView, setShowAdvancedView] = useState(false)
//   const [selectedEnvironment, setSelectedEnvironment] = useState<Record<string, string>>({})
//   const [webhookConfigs, setWebhookConfigs] = useState<Record<string, any>>({})
//   const [oauthStates, setOauthStates] = useState<Record<string, any>>({})

//   useEffect(() => {
//     loadConnectedIntegrations()
//   }, [])

//   const loadConnectedIntegrations = async () => {
//     try {
//       setIsLoading(true)
//       const response = await fetch("/api/dashboard/integrations")
//       if (response.ok) {
//         const data = await response.json()
//         setConnectedIntegrations(data.integrations || [])

//         // Initialize integration status
//         const statusMap: Record<string, IntegrationStatus> = {}
//         data.integrations?.forEach((integration: Integration) => {
//           statusMap[integration.type] = {
//             state: integration.isActive ? "connected" : "error",
//             progress: 100,
//             message: integration.isActive ? "Connected and ready" : integration.lastError || "Connection error",
//             health: integration.errorCount && integration.errorCount > 0 ? "warning" : "healthy",
//           }
//         })
//         setIntegrationStatus(statusMap)
//       }
//     } catch (error) {
//       console.error("Failed to load integrations:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleConnect = async (integration: any) => {
//     try {
//       setError(null)

//       // Update status to connecting
//       setIntegrationStatus((prev) => ({
//         ...prev,
//         [integration.type]: {
//           state: "connecting",
//           progress: 0,
//           message: "Validating credentials...",
//         },
//       }))

//       const missingFields = integration.fields
//         .filter((field: IntegrationField) => field.required && !formData[field.key])
//         .map((field: IntegrationField) => field.label)

//       if (missingFields.length > 0) {
//         setError(`Please fill in required fields: ${missingFields.join(", ")}`)
//         setIntegrationStatus((prev) => ({
//           ...prev,
//           [integration.type]: {
//             state: "error",
//             progress: 0,
//             message: "Missing required fields",
//           },
//         }))
//         return
//       }

//       // Progress: Preparing credentials
//       setIntegrationStatus((prev) => ({
//         ...prev,
//         [integration.type]: {
//           state: "connecting",
//           progress: 25,
//           message: "Preparing credentials...",
//         },
//       }))

//       const credentials: Record<string, string> = {}
//       integration.fields.forEach((field: IntegrationField) => {
//         if (formData[field.key]) {
//           credentials[field.key] = formData[field.key]
//         }
//       })

//       // Progress: Connecting to service
//       setIntegrationStatus((prev) => ({
//         ...prev,
//         [integration.type]: {
//           state: "connecting",
//           progress: 50,
//           message: "Connecting to service...",
//         },
//       }))

//       const response = await fetch("/api/dashboard/integrations", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           type: integration.type,
//           name: integration.name,
//           credentials,
//         }),
//       })

//       if (response.ok) {
//         // Progress: Finalizing
//         setIntegrationStatus((prev) => ({
//           ...prev,
//           [integration.type]: {
//             state: "connecting",
//             progress: 90,
//             message: "Finalizing connection...",
//           },
//         }))

//         setTimeout(() => {
//           setIntegrationStatus((prev) => ({
//             ...prev,
//             [integration.type]: {
//               state: "connected",
//               progress: 100,
//               message: "Connected successfully",
//               health: "healthy",
//             },
//           }))
//           setSuccess(`${integration.name} connected successfully!`)
//           setFormData({})
//           setSelectedIntegration(null)
//           loadConnectedIntegrations()
//         }, 500)
//       } else {
//         const errorData = await response.json()
//         setError(errorData.error || "Failed to connect integration")
//         setIntegrationStatus((prev) => ({
//           ...prev,
//           [integration.type]: {
//             state: "error",
//             progress: 0,
//             message: errorData.error || "Connection failed",
//           },
//         }))
//       }
//     } catch (error) {
//       setError("An unexpected error occurred")
//       setIntegrationStatus((prev) => ({
//         ...prev,
//         [integration.type]: {
//           state: "error",
//           progress: 0,
//           message: "Unexpected error occurred",
//         },
//       }))
//       console.error("Integration connection error:", error)
//     }
//   }

//   const handleConfigure = (integration: any, connectedIntegration: Integration) => {
//     setConfigureIntegration({ integration, connected: connectedIntegration })

//     // Pre-populate form with existing credentials (masked for security)
//     const configData: Record<string, string> = {}
//     integration.fields.forEach((field: IntegrationField) => {
//       if (field.type === "password") {
//         configData[field.key] = "••••••••••••••••••••••••••••••••••••" // Masked password
//       } else {
//         // For non-password fields, we might have the data available
//         configData[field.key] = ""
//       }
//     })
//     setConfigFormData(configData)
//     setError(null)
//     setSuccess(null)
//   }

//   const handleUpdateConfiguration = async () => {
//     if (!configureIntegration) return

//     try {
//       setSavingConfig(true)
//       setError(null)

//       const { integration, connected } = configureIntegration

//       // Only send fields that have been modified (not masked passwords)
//       const updatedCredentials: Record<string, string> = {}
//       integration.fields.forEach((field: IntegrationField) => {
//         const value = configFormData[field.key]
//         if (value && value !== "••••••••••••••••••••••••••••••••••••") {
//           updatedCredentials[field.key] = value
//         }
//       })

//       const response = await fetch(`/api/dashboard/integrations/${connected.id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           credentials: updatedCredentials,
//         }),
//       })

//       if (response.ok) {
//         setSuccess(`${integration.name} configuration updated successfully!`)
//         setConfigureIntegration(null)
//         setConfigFormData({})
//         loadConnectedIntegrations()
//       } else {
//         const errorData = await response.json()
//         setError(errorData.error || "Failed to update configuration")
//       }
//     } catch (error) {
//       setError("An unexpected error occurred")
//       console.error("Configuration update error:", error)
//     } finally {
//       setSavingConfig(false)
//     }
//   }

//   const handleDisconnect = async (integrationId: string, integrationType: string) => {
//     try {
//       setIsLoading(true)
//       const response = await fetch(`/api/dashboard/integrations/${integrationId}`, {
//         method: "DELETE",
//       })

//       if (response.ok) {
//         setSuccess("Integration disconnected successfully")
//         setIntegrationStatus((prev) => ({
//           ...prev,
//           [integrationType]: {
//             state: "idle",
//             progress: 0,
//             message: "Not connected",
//           },
//         }))
//         loadConnectedIntegrations()
//       } else {
//         setError("Failed to disconnect integration")
//       }
//     } catch (error) {
//       setError("An unexpected error occurred")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const testIntegrationHealth = async (integration: any, connectedIntegration: Integration) => {
//     try {
//       setTestingIntegration(integration.type)
//       setIntegrationStatus((prev) => ({
//         ...prev,
//         [integration.type]: {
//           ...prev[integration.type],
//           state: "testing",
//           message: "Testing connection...",
//         },
//       }))

//       // Simulate health check - in production, this would call actual test endpoints
//       await new Promise((resolve) => setTimeout(resolve, 2000))

//       const isHealthy = Math.random() > 0.2 // 80% success rate for demo

//       setIntegrationStatus((prev) => ({
//         ...prev,
//         [integration.type]: {
//           state: "connected",
//           progress: 100,
//           message: isHealthy ? "Connection healthy" : "Connection issues detected",
//           health: isHealthy ? "healthy" : "warning",
//         },
//       }))
//     } catch (error) {
//       setIntegrationStatus((prev) => ({
//         ...prev,
//         [integration.type]: {
//           state: "connected",
//           progress: 100,
//           message: "Health check failed",
//           health: "error",
//         },
//       }))
//     } finally {
//       setTestingIntegration(null)
//     }
//   }

//   const handleCapabilityToggle = async (integrationId: string, capabilityId: string, enabled: boolean) => {
//     const capabilityKey = `${integrationId}_${capabilityId}`

//     // Add to updating set
//     setUpdatingCapabilities((prev) => new Set(prev).add(capabilityKey))

//     // Optimistically update UI
//     setEnabledCapabilities((prev) => ({
//       ...prev,
//       [capabilityKey]: enabled,
//     }))

//     // Update integration capabilities in backend
//     try {
//       const response = await fetch(`/api/dashboard/integrations/${integrationId}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           capabilities: {
//             [capabilityId]: enabled,
//           },
//         }),
//       })

//       if (!response.ok) {
//         throw new Error("Failed to update setting")
//       }

//       // Show success feedback
//       toast({
//         title: "Capability Updated",
//         description: `${capabilityId.replace(/_/g, " ")} has been ${enabled ? "enabled" : "disabled"} for your AI agent.`,
//       })
//     } catch (error) {
//       console.error("Failed to update setting:", error)
//       // Revert the UI change on error
//       setEnabledCapabilities((prev) => ({
//         ...prev,
//         [capabilityKey]: !enabled,
//       }))

//       toast({
//         title: "Update Failed",
//         description: "Failed to update setting. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       // Remove from updating set
//       setUpdatingCapabilities((prev) => {
//         const newSet = new Set(prev)
//         newSet.delete(capabilityKey)
//         return newSet
//       })
//     }
//   }

//   const handleBulkCapabilityToggle = async (integrationId: string, capabilities: any[], enable: boolean) => {
//     const updates = capabilities.map((cap) => handleCapabilityToggle(integrationId, cap.id, enable))

//     await Promise.all(updates)
//   }

//   const copyToClipboard = async (text: string, endpointId: string) => {
//     try {
//       await navigator.clipboard.writeText(text)
//       setCopiedEndpoint(endpointId)
//       setTimeout(() => setCopiedEndpoint(null), 2000)
//     } catch (err) {
//       console.error("Failed to copy:", err)
//     }
//   }

//   const isConnected = (integrationType: string) => {
//     return connectedIntegrations.some((integration) => integration.type === integrationType && integration.isActive)
//   }

//   const getConnectedIntegration = (integrationType: string) => {
//     return connectedIntegrations.find((integration) => integration.type === integrationType && integration.isActive)
//   }

//   const getIntegrationStatus = (integrationType: string): IntegrationStatus => {
//     return (
//       integrationStatus[integrationType] || {
//         state: "idle",
//         progress: 0,
//         message: "Not connected",
//       }
//     )
//   }

//   const getHealthBadge = (health?: string) => {
//     switch (health) {
//       case "healthy":
//         return (
//           <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
//             <CheckCircle className="h-3 w-3 mr-1" />
//             Healthy
//           </Badge>
//         )
//       case "warning":
//         return (
//           <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
//             <AlertTriangle className="h-3 w-3 mr-1" />
//             Warning
//           </Badge>
//         )
//       case "error":
//         return (
//           <Badge variant="secondary" className="bg-red-500/10 text-red-400 border-red-500/20">
//             <AlertCircle className="h-3 w-3 mr-1" />
//             Error
//           </Badge>
//         )
//       default:
//         return null
//     }
//   }

//   useEffect(() => {
//     const loadCapabilities = () => {
//       const capabilities: Record<string, boolean> = {}

//       connectedIntegrations.forEach((integration) => {
//         if (integration.capabilities) {
//           try {
//             const parsedCapabilities =
//               typeof integration.capabilities === "string"
//                 ? JSON.parse(integration.capabilities)
//                 : integration.capabilities

//             Object.entries(parsedCapabilities).forEach(([capId, enabled]) => {
//               capabilities[`${integration.id}_${capId}`] = enabled as boolean
//             })
//           } catch (error) {
//             console.error("Failed to parse capabilities for integration:", integration.id, error)
//           }
//         }
//       })

//       setEnabledCapabilities(capabilities)
//     }

//     if (connectedIntegrations.length > 0) {
//       loadCapabilities()
//     }
//   }, [connectedIntegrations])

//   const renderCapabilities = (integration: any, connectedIntegration: Integration) => {
//     if (!integration.capabilities) return null

//     const enabledCount = integration.capabilities.filter(
//       (cap: any) => enabledCapabilities[`${connectedIntegration?.id}_${cap.id}`] !== false,
//     ).length

//     return (
//       <div className="space-y-3">
//         <div className="flex items-center justify-between">
//           <p className="text-sm font-medium">AI Agent Capabilities:</p>
//           <Badge variant="outline" className="text-xs">
//             {enabledCount} enabled
//           </Badge>
//         </div>
//         <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
//           {integration.capabilities.map((capability: any) => {
//             const capabilityKey = `${connectedIntegration?.id}_${capability.id}`
//             const isEnabled = enabledCapabilities[capabilityKey] !== false
//             const isUpdating = updatingCapabilities.has(capabilityKey)

//             return (
//               <div
//                 key={capability.id}
//                 className={`group relative flex items-start gap-3 p-3 rounded-lg transition-all duration-200 ${
//                   isEnabled
//                     ? "bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/15 hover:border-emerald-500/30"
//                     : "bg-muted/30 border border-transparent hover:bg-muted/50 hover:border-border"
//                 } ${isUpdating ? "opacity-70" : ""}`}
//               >
//                 <div className="relative">
//                   <Switch
//                     checked={isEnabled}
//                     onCheckedChange={(enabled) =>
//                       handleCapabilityToggle(connectedIntegration?.id || "", capability.id, enabled)
//                     }
//                     disabled={isUpdating}
//                     className="mt-0.5"
//                   />

//                   {/* Hover tooltip */}
//                   <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
//                     <div className="bg-popover text-popover-foreground px-3 py-2 rounded-md shadow-lg border text-xs whitespace-nowrap">
//                       {isEnabled ? "Disable" : "Enable"}
//                       <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover"></div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-2 mb-1">
//                     <p
//                       className={`text-sm font-medium transition-colors duration-200 ${
//                         isEnabled ? "text-foreground" : "text-muted-foreground"
//                       }`}
//                     >
//                       {capability.name}
//                     </p>
//                     {isEnabled && !isUpdating && (
//                       <Badge
//                         variant="secondary"
//                         className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
//                       >
//                         Active
//                       </Badge>
//                     )}
//                     {isUpdating && (
//                       <div className="flex items-center gap-1">
//                         <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
//                         <span className="text-xs text-muted-foreground">Updating...</span>
//                       </div>
//                     )}
//                   </div>
//                   <p
//                     className={`text-xs transition-colors duration-200 ${
//                       isEnabled ? "text-muted-foreground" : "text-muted-foreground/70"
//                     }`}
//                   >
//                     {capability.description}
//                   </p>

//                   {/* Additional context on hover */}
//                   <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-1">
//                     <p className="text-xs text-primary/70">
//                       {isEnabled
//                         ? "This capability is available to your AI agent in conversations"
//                         : "Enable this to allow your AI agent to perform this action"}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Visual indicator */}
//                 <div
//                   className={`w-2 h-2 rounded-full transition-all duration-200 mt-2 ${
//                     isEnabled ? "bg-emerald-400 shadow-sm shadow-emerald-400/50" : "bg-muted-foreground/30"
//                   }`}
//                 />
//               </div>
//             )
//           })}
//         </div>

//         {/* Bulk actions */}
//         <div className="flex gap-2 pt-2 border-t border-border/50">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => handleBulkCapabilityToggle(connectedIntegration?.id || "", integration.capabilities, true)}
//             className="flex-1 text-xs hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400"
//             disabled={enabledCount === integration.capabilities.length}
//           >
//             <CheckCircle className="h-3 w-3 mr-1" />
//             Enable All
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => handleBulkCapabilityToggle(connectedIntegration?.id || "", integration.capabilities, false)}
//             className="flex-1 text-xs hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
//             disabled={enabledCount === 0}
//           >
//             <AlertCircle className="h-3 w-3 mr-1" />
//             Disable All
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="container mx-auto px-4 py-8 max-w-7xl">
//         <div className="space-y-8">
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="p-3 rounded-xl bg-primary/10">
//                   <Zap className="h-6 w-6 text-primary" />
//                 </div>
//                 <div>
//                   <h1 className="text-3xl font-bold text-balance">Advanced Integration Hub</h1>
//                   <p className="text-muted-foreground text-pretty">
//                     Connect your tools with OAuth 2.0, real-time monitoring, and intelligent error recovery.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-4">
//                 <div className="flex items-center gap-2">
//                   <Shield className="h-4 w-4 text-muted-foreground" />
//                   <span className="text-sm text-muted-foreground">Advanced Mode</span>
//                   <Switch checked={showAdvancedView} onCheckedChange={setShowAdvancedView} />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {error && (
//             <Alert className="border-destructive/20 bg-destructive/5">
//               <AlertCircle className="h-4 w-4" />
//               <AlertDescription className="text-destructive">{error}</AlertDescription>
//             </Alert>
//           )}

//           {success && (
//             <Alert className="border-emerald-500/20 bg-emerald-500/5">
//               <CheckCircle className="h-4 w-4 text-emerald-500" />
//               <AlertDescription className="text-emerald-600">{success}</AlertDescription>
//             </Alert>
//           )}

//           {showAdvancedView && (
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <HealthMonitoringDashboard />
//               <ErrorRecoverySystem />
//             </div>
//           )}

//           {/* Configuration Dialog */}
//           {configureIntegration && (
//             <Dialog open={!!configureIntegration} onOpenChange={() => setConfigureIntegration(null)}>
//               <DialogContent className="max-w-4xl bg-card border-border max-h-[90vh] overflow-y-auto">
//                 <DialogHeader>
//                   <DialogTitle className="flex items-center gap-2">
//                     <configureIntegration.integration.icon className="h-5 w-5" />
//                     Configure {configureIntegration.integration.name}
//                   </DialogTitle>
//                   <DialogDescription>
//                     {showAdvancedView
//                       ? "Advanced configuration with OAuth, webhooks, and environment settings"
//                       : `Update your ${configureIntegration.integration.name} credentials and settings`}
//                   </DialogDescription>
//                 </DialogHeader>

//                 <div className="space-y-6">
//                   {showAdvancedView ? (
//                     <Tabs defaultValue="credentials" className="space-y-4">
//                       <TabsList className="grid w-full grid-cols-4">
//                         <TabsTrigger value="credentials">Credentials</TabsTrigger>
//                         <TabsTrigger value="environment">Environment</TabsTrigger>
//                         <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
//                         <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
//                       </TabsList>

//                       <TabsContent value="credentials" className="space-y-4">
//                         {/* OAuth Flow for supported integrations */}
//                         {["calendly", "hubspot", "salesforce", "zoom"].includes(configureIntegration.integration.id) ? (
//                           <OAuthFlow
//                             integrationId={configureIntegration.integration.id}
//                             integrationName={configureIntegration.integration.name}
//                             onSuccess={(tokens) => {
//                               setOauthStates((prev) => ({
//                                 ...prev,
//                                 [configureIntegration.integration.id]: tokens,
//                               }))
//                               toast({
//                                 title: "OAuth Connected",
//                                 description: `${configureIntegration.integration.name} has been connected via OAuth 2.0`,
//                               })
//                             }}
//                           />
//                         ) : (
//                           // Regular credential form for non-OAuth integrations
//                           <div className="space-y-4">
//                             {configureIntegration.integration.fields.map((field: IntegrationField) => (
//                               <div key={field.key} className="space-y-2">
//                                 <Label htmlFor={field.key} className="flex items-center gap-2">
//                                   {field.label}
//                                   {field.required && <span className="text-destructive">*</span>}
//                                 </Label>
//                                 <div className="relative">
//                                   <Input
//                                     id={field.key}
//                                     type={
//                                       field.type === "password" && !showCredentials[field.key] ? "password" : "text"
//                                     }
//                                     placeholder={
//                                       field.type === "password" ? "Enter new value to update" : field.placeholder
//                                     }
//                                     value={configFormData[field.key] || ""}
//                                     onChange={(e) =>
//                                       setConfigFormData({ ...configFormData, [field.key]: e.target.value })
//                                     }
//                                     className="bg-background border-border pr-10"
//                                   />
//                                   {field.type === "password" && (
//                                     <Button
//                                       type="button"
//                                       variant="ghost"
//                                       size="sm"
//                                       className="absolute right-0 top-0 h-full px-3"
//                                       onClick={() =>
//                                         setShowCredentials({
//                                           ...showCredentials,
//                                           [field.key]: !showCredentials[field.key],
//                                         })
//                                       }
//                                     >
//                                       {showCredentials[field.key] ? (
//                                         <EyeOff className="h-4 w-4" />
//                                       ) : (
//                                         <Eye className="h-4 w-4" />
//                                       )}
//                                     </Button>
//                                   )}
//                                 </div>
//                                 {field.type === "password" && (
//                                   <p className="text-xs text-muted-foreground">
//                                     Leave blank to keep existing credentials
//                                   </p>
//                                 )}
//                               </div>
//                             ))}

//                             {/* Real-time credential validation */}
//                             <CredentialValidator
//                               integrationId={configureIntegration.integration.id}
//                               credentials={configFormData}
//                               onValidationResult={(isValid, message) => {
//                                 if (isValid) {
//                                   toast({
//                                     title: "Credentials Valid",
//                                     description: message,
//                                   })
//                                 } else {
//                                   toast({
//                                     title: "Validation Failed",
//                                     description: message,
//                                     variant: "destructive",
//                                   })
//                                 }
//                               }}
//                             />
//                           </div>
//                         )}
//                       </TabsContent>

//                       <TabsContent value="environment" className="space-y-4">
//                         <EnvironmentSelector
//                           integrationId={configureIntegration.integration.id}
//                           currentEnvironment={selectedEnvironment[configureIntegration.integration.id] || "production"}
//                           onEnvironmentChange={(env) => {
//                             setSelectedEnvironment((prev) => ({
//                               ...prev,
//                               [configureIntegration.integration.id]: env,
//                             }))
//                           }}
//                         />
//                       </TabsContent>

//                       <TabsContent value="webhooks" className="space-y-4">
//                         <WebhookConfiguration
//                           integrationId={configureIntegration.integration.id}
//                           integrationName={configureIntegration.integration.name}
//                           currentConfig={webhookConfigs[configureIntegration.integration.id]}
//                           onConfigChange={(config) => {
//                             setWebhookConfigs((prev) => ({
//                               ...prev,
//                               [configureIntegration.integration.id]: config,
//                             }))
//                           }}
//                         />
//                       </TabsContent>

//                       <TabsContent value="monitoring" className="space-y-4">
//                         <div className="grid grid-cols-1 gap-6">
//                           <RateLimitMonitor
//                             integrationId={configureIntegration.integration.id}
//                             integrationName={configureIntegration.integration.name}
//                           />
//                           <UsageAnalytics
//                             integrationId={configureIntegration.integration.id}
//                             integrationName={configureIntegration.integration.name}
//                           />
//                         </div>
//                       </TabsContent>
//                     </Tabs>
//                   ) : (
//                     // Simple configuration for basic mode
//                     <div className="space-y-4">
//                       {configureIntegration.integration.fields.map((field: IntegrationField) => (
//                         <div key={field.key} className="space-y-2">
//                           <Label htmlFor={field.key} className="flex items-center gap-2">
//                             {field.label}
//                             {field.required && <span className="text-destructive">*</span>}
//                           </Label>
//                           {field.type === "textarea" ? (
//                             <Textarea
//                               id={field.key}
//                               placeholder={field.placeholder}
//                               value={configFormData[field.key] || ""}
//                               onChange={(e) => setConfigFormData({ ...configFormData, [field.key]: e.target.value })}
//                               className="bg-background border-border"
//                             />
//                           ) : field.type === "select" ? (
//                             <select
//                               id={field.key}
//                               value={configFormData[field.key] || ""}
//                               onChange={(e) => setConfigFormData({ ...configFormData, [field.key]: e.target.value })}
//                               className="w-full px-3 py-2 bg-background border border-border rounded-md"
//                             >
//                               <option value="">Select {field.label}</option>
//                               {field.options?.map((option) => (
//                                 <option key={option} value={option}>
//                                   {option}
//                                 </option>
//                               ))}
//                             </select>
//                           ) : (
//                             <div className="relative">
//                               <Input
//                                 id={field.key}
//                                 type={
//                                   field.type === "password" && !showCredentials[field.key]
//                                     ? "password"
//                                     : field.type === "email"
//                                       ? "email"
//                                       : field.type === "tel"
//                                         ? "tel"
//                                         : "text"
//                                 }
//                                 placeholder={field.placeholder}
//                                 value={configFormData[field.key] || ""}
//                                 onChange={(e) => setConfigFormData({ ...configFormData, [field.key]: e.target.value })}
//                                 className="bg-background border-border pr-10"
//                               />
//                               {field.type === "password" && (
//                                 <Button
//                                   type="button"
//                                   variant="ghost"
//                                   size="sm"
//                                   className="absolute right-0 top-0 h-full px-3"
//                                   onClick={() =>
//                                     setShowCredentials({
//                                       ...showCredentials,
//                                       [field.key]: !showCredentials[field.key],
//                                     })
//                                   }
//                                 >
//                                   {showCredentials[field.key] ? (
//                                     <EyeOff className="h-4 w-4" />
//                                   ) : (
//                                     <Eye className="h-4 w-4" />
//                                   )}
//                                 </Button>
//                               )}
//                             </div>
//                           )}
//                           {field.type === "password" && (
//                             <p className="text-xs text-muted-foreground">Leave blank to keep existing credentials</p>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   )}

//                   <div className="flex gap-2 pt-4">
//                     <Button
//                       variant="outline"
//                       className="flex-1 bg-transparent"
//                       onClick={() => setConfigureIntegration(null)}
//                       disabled={savingConfig}
//                     >
//                       <X className="h-4 w-4 mr-2" />
//                       Cancel
//                     </Button>
//                     <Button className="flex-1" onClick={handleUpdateConfiguration} disabled={savingConfig}>
//                       {savingConfig ? (
//                         <>
//                           <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                           Saving...
//                         </>
//                       ) : (
//                         <>
//                           <Save className="h-4 w-4 mr-2" />
//                           Save Changes
//                         </>
//                       )}
//                     </Button>
//                   </div>
//                 </div>
//               </DialogContent>
//             </Dialog>
//           )}

//           <Tabs value={activeCategory} onValueChange={setActiveCategory} className="space-y-6">
//             <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-muted/50">
//               {Object.entries(INTEGRATION_CATEGORIES).map(([key, category]) => {
//                 const Icon = category.icon
//                 return (
//                   <TabsTrigger
//                     key={key}
//                     value={key}
//                     className="flex items-center gap-2 data-[state=active]:bg-background"
//                   >
//                     <Icon className="h-4 w-4" />
//                     <span className="hidden sm:inline">{category.title.split(" ")[0]}</span>
//                   </TabsTrigger>
//                 )
//               })}
//             </TabsList>

//             {Object.entries(INTEGRATION_CATEGORIES).map(([categoryKey, category]) => (
//               <TabsContent key={categoryKey} value={categoryKey} className="space-y-6">
//                 <div className="space-y-4">
//                   <div className="flex items-center gap-3">
//                     <div className={`p-2 rounded-lg ${category.color}`}>
//                       <category.icon className="h-5 w-5" />
//                     </div>
//                     <div>
//                       <h2 className="text-xl font-semibold">{category.title}</h2>
//                       <p className="text-sm text-muted-foreground">{category.description}</p>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                     {category.integrations.map((integration) => {
//                       const connected = isConnected(integration.type)
//                       const connectedIntegration = getConnectedIntegration(integration.type)
//                       const status = getIntegrationStatus(integration.type)
//                       const Icon = integration.icon

//                       const supportsOAuth = ["calendly", "hubspot", "salesforce", "zoom"].includes(integration.id)
//                       const supportsWebhooks = ["stripe", "paypal", "hubspot", "salesforce"].includes(integration.id)

//                       return (
//                         <Card
//                           key={integration.id}
//                           className={`relative transition-all duration-200 hover:shadow-lg ${
//                             connected
//                               ? "bg-emerald-500/5 border-emerald-500/20"
//                               : "bg-card/50 border-border hover:border-primary/30"
//                           }`}
//                         >
//                           <CardHeader className="pb-3">
//                             <div className="flex items-start justify-between">
//                               <div className="flex items-center gap-3">
//                                 <div className={`p-2 rounded-lg ${category.color}`}>
//                                   <Icon className="h-5 w-5" />
//                                 </div>
//                                 <div>
//                                   <CardTitle className="text-lg flex items-center gap-2">
//                                     {integration.name}
//                                     {showAdvancedView && (
//                                       <div className="flex gap-1">
//                                         {supportsOAuth && (
//                                           <Badge
//                                             variant="outline"
//                                             className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/20"
//                                           >
//                                             OAuth 2.0
//                                           </Badge>
//                                         )}
//                                         {supportsWebhooks && (
//                                           <Badge
//                                             variant="outline"
//                                             className="text-xs bg-purple-500/10 text-purple-400 border-purple-500/20"
//                                           >
//                                             Webhooks
//                                           </Badge>
//                                         )}
//                                       </div>
//                                     )}
//                                   </CardTitle>
//                                   <div className="flex items-center gap-2 mt-1">
//                                     {connected && (
//                                       <Badge
//                                         variant="secondary"
//                                         className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
//                                       >
//                                         <CheckCircle className="h-3 w-3 mr-1" />
//                                         Connected
//                                       </Badge>
//                                     )}
//                                     {connected && getHealthBadge(status.health)}
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                             <CardDescription className="text-sm">{integration.description}</CardDescription>
//                           </CardHeader>

//                           <CardContent className="space-y-4">
//                             {status.state !== "idle" && (
//                               <div className="space-y-2">
//                                 <div className="flex items-center justify-between text-sm">
//                                   <span className="text-muted-foreground">Status</span>
//                                   <span
//                                     className={`font-medium ${
//                                       status.state === "connected"
//                                         ? "text-emerald-400"
//                                         : status.state === "error"
//                                           ? "text-red-400"
//                                           : "text-blue-400"
//                                     }`}
//                                   >
//                                     {status.message}
//                                   </span>
//                                 </div>
//                                 {status.state === "connecting" && <Progress value={status.progress} className="h-2" />}
//                               </div>
//                             )}

//                             {showAdvancedView && connected && (
//                               <div className="p-3 rounded-lg bg-muted/20 border">
//                                 <div className="flex items-center justify-between text-sm">
//                                   <div className="flex items-center gap-2">
//                                     <Clock className="h-4 w-4 text-muted-foreground" />
//                                     <span className="text-muted-foreground">Rate Limits</span>
//                                   </div>
//                                   <Button
//                                     variant="ghost"
//                                     size="sm"
//                                     onClick={() => handleConfigure(integration, connectedIntegration!)}
//                                     className="text-xs"
//                                   >
//                                     <TrendingUp className="h-3 w-3 mr-1" />
//                                     View Details
//                                   </Button>
//                                 </div>
//                               </div>
//                             )}

//                             {connected && renderCapabilities(integration, connectedIntegration!)}

//                             <Separator />

//                             <div className="flex gap-2">
//                               {connected ? (
//                                 <>
//                                   <Button
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={() => handleDisconnect(connectedIntegration!.id, integration.type)}
//                                     disabled={isLoading}
//                                     className="flex-1"
//                                   >
//                                     <Trash2 className="h-4 w-4 mr-2" />
//                                     Disconnect
//                                   </Button>
//                                   {integration.testable && (
//                                     <Button
//                                       variant="outline"
//                                       size="sm"
//                                       onClick={() => testIntegrationHealth(integration, connectedIntegration!)}
//                                       disabled={testingIntegration === integration.type}
//                                       className="flex-1"
//                                     >
//                                       {testingIntegration === integration.type ? (
//                                         <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                                       ) : (
//                                         <Activity className="h-4 w-4 mr-2" />
//                                       )}
//                                       Test Health
//                                     </Button>
//                                   )}
//                                   <Button
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={() => handleConfigure(integration, connectedIntegration!)}
//                                     className="flex-1"
//                                   >
//                                     <Settings className="h-4 w-4 mr-2" />
//                                     Configure
//                                   </Button>
//                                 </>
//                               ) : (
//                                 <Dialog>
//                                   <DialogTrigger asChild>
//                                     <Button
//                                       className="w-full"
//                                       onClick={() => {
//                                         setSelectedIntegration(integration)
//                                         setFormData({})
//                                         setError(null)
//                                         setSuccess(null)
//                                       }}
//                                       disabled={status.state === "connecting"}
//                                     >
//                                       {status.state === "connecting" ? (
//                                         <>
//                                           <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                                           Connecting...
//                                         </>
//                                       ) : (
//                                         <>
//                                           <Plus className="h-4 w-4 mr-2" />
//                                           Connect
//                                         </>
//                                       )}
//                                     </Button>
//                                   </DialogTrigger>
//                                   <DialogContent className="max-w-md bg-card border-border">
//                                     <DialogHeader>
//                                       <DialogTitle className="flex items-center gap-2">
//                                         <Icon className="h-5 w-5" />
//                                         Connect {integration.name}
//                                       </DialogTitle>
//                                       <DialogDescription>
//                                         {showAdvancedView && supportsOAuth
//                                           ? "Connect securely using OAuth 2.0 authentication"
//                                           : `Enter your ${integration.name} credentials to enable automation`}
//                                       </DialogDescription>
//                                     </DialogHeader>

//                                     <div className="space-y-4">
//                                       {showAdvancedView ? (
//                                         <IntegrationSetupWizard
//                                           integration={integration}
//                                           onComplete={(config) => {
//                                             toast({
//                                               title: "Integration Connected",
//                                               description: `${integration.name} has been successfully configured`,
//                                             })
//                                             setSelectedIntegration(null)
//                                             loadConnectedIntegrations()
//                                           }}
//                                         />
//                                       ) : (
//                                         // Simple setup for basic mode
//                                         <>
//                                           {integration.fields.map((field: IntegrationField) => (
//                                             <div key={field.key} className="space-y-2">
//                                               <Label htmlFor={field.key} className="flex items-center gap-2">
//                                                 {field.label}
//                                                 {field.required && <span className="text-destructive">*</span>}
//                                               </Label>
//                                               {field.type === "textarea" ? (
//                                                 <Textarea
//                                                   id={field.key}
//                                                   placeholder={field.placeholder}
//                                                   value={formData[field.key] || ""}
//                                                   onChange={(e) =>
//                                                     setFormData({ ...formData, [field.key]: e.target.value })
//                                                   }
//                                                   className="bg-background border-border"
//                                                 />
//                                               ) : field.type === "select" ? (
//                                                 <select
//                                                   id={field.key}
//                                                   value={formData[field.key] || ""}
//                                                   onChange={(e) =>
//                                                     setFormData({ ...formData, [field.key]: e.target.value })
//                                                   }
//                                                   className="w-full px-3 py-2 bg-background border border-border rounded-md"
//                                                 >
//                                                   <option value="">Select {field.label}</option>
//                                                   {field.options?.map((option) => (
//                                                     <option key={option} value={option}>
//                                                       {option}
//                                                     </option>
//                                                   ))}
//                                                 </select>
//                                               ) : (
//                                                 <div className="relative">
//                                                   <Input
//                                                     id={field.key}
//                                                     type={
//                                                       field.type === "password" && !showCredentials[field.key]
//                                                         ? "password"
//                                                         : field.type === "email"
//                                                           ? "email"
//                                                           : field.type === "tel"
//                                                             ? "tel"
//                                                             : "text"
//                                                     }
//                                                     placeholder={field.placeholder}
//                                                     value={formData[field.key] || ""}
//                                                     onChange={(e) =>
//                                                       setFormData({ ...formData, [field.key]: e.target.value })
//                                                     }
//                                                     className="bg-background border-border pr-10"
//                                                   />
//                                                   {field.type === "password" && (
//                                                     <Button
//                                                       type="button"
//                                                       variant="ghost"
//                                                       size="sm"
//                                                       className="absolute right-0 top-0 h-full px-3"
//                                                       onClick={() =>
//                                                         setShowCredentials({
//                                                           ...showCredentials,
//                                                           [field.key]: !showCredentials[field.key],
//                                                         })
//                                                       }
//                                                     >
//                                                       {showCredentials[field.key] ? (
//                                                         <EyeOff className="h-4 w-4" />
//                                                       ) : (
//                                                         <Eye className="h-4 w-4" />
//                                                       )}
//                                                     </Button>
//                                                   )}
//                                                 </div>
//                                               )}
//                                             </div>
//                                           ))}

//                                           <div className="flex gap-2 pt-4">
//                                             <Button
//                                               variant="outline"
//                                               className="flex-1 bg-transparent"
//                                               onClick={() => setSelectedIntegration(null)}
//                                             >
//                                               Cancel
//                                             </Button>
//                                             <Button
//                                               className="flex-1"
//                                               onClick={() => handleConnect(integration)}
//                                               disabled={status.state === "connecting"}
//                                             >
//                                               {status.state === "connecting" ? (
//                                                 <>
//                                                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                                                   Connecting...
//                                                 </>
//                                               ) : (
//                                                 "Connect"
//                                               )}
//                                             </Button>
//                                           </div>
//                                         </>
//                                       )}
//                                     </div>
//                                   </DialogContent>
//                                 </Dialog>
//                               )}
//                             </div>
//                           </CardContent>
//                         </Card>
//                       )
//                     })}
//                   </div>
//                 </div>
//               </TabsContent>
//             ))}
//           </Tabs>
//         </div>
//       </div>
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import {
  CreditCard,
  Users,
  Calendar,
  Mail,
  MessageSquare,
  ShoppingCart,
  Settings,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Zap,
  Building2,
  Phone,
  Database,
  Loader2,
  Activity,
  AlertTriangle,
  Save,
  X,
  Shield,
  Clock,
  TrendingUp,
} from "lucide-react"

// Mock components with proper props handling
const HealthMonitoringDashboard = ({ integrations, onRefreshHealth }: { 
  integrations: Integration[], 
  onRefreshHealth: () => void 
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Activity className="h-5 w-5" />
        Health Monitoring
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-emerald-500/10 rounded-lg">
            <div className="text-2xl font-bold text-emerald-400">{integrations.filter(i => i.isActive).length}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </div>
          <div className="p-3 bg-yellow-500/10 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">{integrations.filter(i => i.errorCount && i.errorCount > 0).length}</div>
            <div className="text-xs text-muted-foreground">Warning</div>
          </div>
          <div className="p-3 bg-red-500/10 rounded-lg">
            <div className="text-2xl font-bold text-red-400">{integrations.filter(i => !i.isActive).length}</div>
            <div className="text-xs text-muted-foreground">Offline</div>
          </div>
        </div>
        <Button variant="outline" onClick={onRefreshHealth} className="w-full">
          Refresh Health Status
        </Button>
      </div>
    </CardContent>
  </Card>
)

const ErrorRecoverySystem = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Shield className="h-5 w-5" />
        Error Recovery
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm">Auto-retry failed requests</span>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Circuit breaker protection</span>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Fallback mechanisms</span>
          <Switch defaultChecked />
        </div>
      </div>
    </CardContent>
  </Card>
)

const OAuthFlow = ({ 
  integration, 
  onSuccess 
}: { 
  integration: string, 
  onSuccess: (tokens: { access_token: string; refresh_token?: string; expires_in?: number }) => void 
}) => (
  <div className="p-4 border rounded-lg">
    <h4 className="font-medium mb-2">OAuth 2.0 Authentication</h4>
    <p className="text-sm text-muted-foreground mb-4">
      Connect securely using OAuth 2.0 for {integration}
    </p>
    <Button onClick={() => onSuccess({ access_token: 'mock_token' })}>
      Connect with OAuth
    </Button>
  </div>
)

const EnvironmentSelector = ({ 
  integration, 
  currentEnvironment, 
  onEnvironmentChange 
}: { 
  integration: string, 
  currentEnvironment: string, 
  onEnvironmentChange: (env: string) => void 
}) => (
  <div className="space-y-4">
    <h4 className="font-medium">Environment Configuration</h4>
    <select 
      value={currentEnvironment} 
      onChange={(e) => onEnvironmentChange(e.target.value)}
      className="w-full p-2 border rounded"
    >
      <option value="production">Production</option>
      <option value="sandbox">Sandbox</option>
      <option value="development">Development</option>
    </select>
  </div>
)

const WebhookConfiguration = ({ 
  integration, 
  currentConfig, 
  onConfigChange 
}: { 
  integration: string, 
  currentConfig: any, 
  onConfigChange: (config: any) => void 
}) => (
  <div className="space-y-4">
    <h4 className="font-medium">Webhook Configuration</h4>
    <Input 
      placeholder="Webhook URL" 
      onChange={(e) => onConfigChange({ url: e.target.value })}
    />
  </div>
)

const CredentialValidator = ({ 
  integration, 
  credentials, 
  onValidationResult 
}: { 
  integration: string, 
  credentials: Record<string, string>, 
  onValidationResult: (isValid: boolean, message: string) => void 
}) => (
  <div className="p-3 bg-muted/20 rounded-lg">
    <div className="flex items-center gap-2">
      <CheckCircle className="h-4 w-4 text-emerald-400" />
      <span className="text-sm">Credentials validated</span>
    </div>
  </div>
)

const RateLimitMonitor = ({ integration }: { integration: string }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">Rate Limits</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>API Calls</span>
          <span>450/1000</span>
        </div>
        <Progress value={45} />
      </div>
    </CardContent>
  </Card>
)

const UsageAnalytics = ({ integration }: { integration: string }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">Usage Analytics</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-center">
        <div className="text-2xl font-bold">1,247</div>
        <div className="text-sm text-muted-foreground">Total requests today</div>
      </div>
    </CardContent>
  </Card>
)

const IntegrationSetupWizard = ({ 
  integration, 
  onComplete 
}: { 
  integration: IntegrationDefinition, 
  onComplete: (config: any) => void 
}) => (
  <div className="space-y-4">
    <h4 className="font-medium">Setup Wizard</h4>
    <Button onClick={() => onComplete({})}>Complete Setup</Button>
  </div>
)

// Add proper type definitions
interface IntegrationDefinition {
  id: string
  name: string
  type: string
  description: string
  icon: any
  fields: IntegrationField[]
  capabilities: any[]
  endpoints: any[]
  testable: boolean
  authType: 'oauth' | 'api_key' | 'basic'  // Add missing authType property
}

const INTEGRATION_CATEGORIES = {
  ecommerce: {
    title: "E-commerce & Payments",
    description: "Process payments, manage orders, and handle customer transactions seamlessly",
    icon: ShoppingCart,
    color: "bg-emerald-500/10 text-emerald-400",
    integrations: [
      {
        id: "stripe",
        name: "Stripe",
        type: "STRIPE",
        description:
          "Accept payments, create payment links, and manage subscriptions with the world's leading payment processor",
        icon: CreditCard,
        authType: 'api_key' as const,
        fields: [
          { key: "secretKey", label: "Secret Key", type: "password", required: true, placeholder: "sk_test_..." },
          { key: "publishableKey", label: "Publishable Key", type: "text", required: true, placeholder: "pk_test_..." },
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
      },
      {
        id: "paypal",
        name: "PayPal",
        type: "PAYPAL",
        description: "Accept PayPal payments and manage transactions with 400+ million active users worldwide",
        icon: CreditCard,
        authType: 'api_key' as const,
        fields: [
          { key: "clientId", label: "Client ID", type: "text", required: true, placeholder: "Your PayPal Client ID" },
          {
            key: "clientSecret",
            label: "Client Secret",
            type: "password",
            required: true,
            placeholder: "Your PayPal Client Secret",
          },
          { key: "environment", label: "Environment", type: "select", required: true, options: ["sandbox", "live"] },
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
        endpoints: [
          { method: "POST", path: "/api/voiceflow/paypal/create-payment", description: "Create PayPal payment" },
        ],
        testable: true,
      },
      {
        id: "shopify",
        name: "Shopify",
        type: "SHOPIFY",
        description: "Manage products, orders, and customer data from your Shopify store",
        icon: ShoppingCart,
        authType: 'api_key' as const,
        fields: [
          {
            key: "shopDomain",
            label: "Shop Domain",
            type: "text",
            required: true,
            placeholder: "your-shop.myshopify.com",
          },
          { key: "accessToken", label: "Access Token", type: "password", required: true, placeholder: "shpat_..." },
        ],
        capabilities: [
          {
            id: "get_products",
            name: "Get Products",
            description: "Retrieve product information and inventory levels",
          },
          { id: "create_order", name: "Create Orders", description: "Generate new orders directly from conversations" },
          {
            id: "update_inventory",
            name: "Update Inventory",
            description: "Modify product stock levels and availability",
          },
        ],
        endpoints: [{ method: "GET", path: "/api/voiceflow/shopify/get-product", description: "Get product details" }],
        testable: true,
      },
    ],
  },
  crm: {
    title: "CRM & Customer Management",
    description: "Manage leads, contacts, and customer relationships to grow your business",
    icon: Users,
    color: "bg-blue-500/10 text-blue-400",
    integrations: [
      {
        id: "hubspot",
        name: "HubSpot",
        type: "HUBSPOT",
        description: "Manage contacts, deals, and customer interactions with the leading CRM platform",
        icon: Users,
        authType: 'oauth' as const,
        fields: [
          { key: "accessToken", label: "Access Token", type: "password", required: true, placeholder: "pat-na1-..." },
        ],
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
        endpoints: [
          { method: "POST", path: "/api/voiceflow/hubspot/create-contact", description: "Create new contact" },
        ],
        testable: true,
      },
      {
        id: "salesforce",
        name: "Salesforce",
        type: "SALESFORCE",
        description: "Integrate with the world's #1 CRM to manage leads, opportunities, and customer data",
        icon: Building2,
        authType: 'oauth' as const,
        fields: [
          {
            key: "instanceUrl",
            label: "Instance URL",
            type: "text",
            required: true,
            placeholder: "https://yourinstance.salesforce.com",
          },
          {
            key: "accessToken",
            label: "Access Token",
            type: "password",
            required: true,
            placeholder: "Your access token",
          },
        ],
        capabilities: [
          {
            id: "create_lead",
            name: "Create Leads",
            description: "Capture new leads directly from Instagram conversations",
          },
          {
            id: "create_opportunity",
            name: "Create Opportunities",
            description: "Generate sales opportunities from qualified leads",
          },
          { id: "update_records", name: "Update Records", description: "Modify existing Salesforce records and data" },
        ],
        endpoints: [],
        testable: false,
      },
    ],
  },
  communication: {
    title: "Communication & Messaging",
    description: "Send messages, emails, and notifications across multiple platforms",
    icon: MessageSquare,
    color: "bg-purple-500/10 text-purple-400",
    integrations: [
      {
        id: "slack",
        name: "Slack",
        type: "SLACK",
        description: "Send messages and notifications to your team channels and direct messages",
        icon: MessageSquare,
        authType: 'api_key' as const,
        fields: [
          { key: "botToken", label: "Bot Token", type: "password", required: true, placeholder: "xoxb-..." },
          {
            key: "signingSecret",
            label: "Signing Secret",
            type: "password",
            required: true,
            placeholder: "Your signing secret",
          },
        ],
        capabilities: [
          { id: "send_message", name: "Send Messages", description: "Post messages to channels or direct messages" },
          {
            id: "create_channel",
            name: "Create Channels",
            description: "Set up new channels for customer discussions",
          },
          { id: "invite_users", name: "Invite Users", description: "Add team members to relevant conversations" },
        ],
        endpoints: [{ method: "POST", path: "/api/voiceflow/slack/send-message", description: "Send Slack message" }],
        testable: true,
      },
      {
        id: "discord",
        name: "Discord",
        type: "DISCORD",
        description: "Engage with your community through Discord servers and channels",
        icon: MessageSquare,
        authType: 'api_key' as const,
        fields: [
          {
            key: "botToken",
            label: "Bot Token",
            type: "password",
            required: true,
            placeholder: "Your Discord bot token",
          },
          { key: "guildId", label: "Server ID", type: "text", required: true, placeholder: "Your Discord server ID" },
        ],
        capabilities: [
          { id: "send_message", name: "Send Messages", description: "Post messages to Discord channels" },
          { id: "create_embed", name: "Create Embeds", description: "Send rich embedded messages with formatting" },
          { id: "manage_roles", name: "Manage Roles", description: "Assign or remove roles from community members" },
        ],
        endpoints: [
          { method: "POST", path: "/api/voiceflow/discord/send-message", description: "Send Discord message" },
        ],
        testable: true,
      },
      {
        id: "sendgrid",
        name: "SendGrid",
        type: "SENDGRID",
        description: "Send transactional emails, newsletters, and automated email sequences",
        icon: Mail,
        authType: 'api_key' as const,
        fields: [
          { key: "apiKey", label: "API Key", type: "password", required: true, placeholder: "SG...." },
          {
            key: "fromEmail",
            label: "From Email",
            type: "email",
            required: true,
            placeholder: "noreply@yourdomain.com",
          },
        ],
        capabilities: [
          { id: "send_email", name: "Send Emails", description: "Send personalized emails to customers and leads" },
          {
            id: "send_template",
            name: "Send Templates",
            description: "Use pre-designed email templates for consistency",
          },
          { id: "manage_lists", name: "Manage Lists", description: "Add contacts to email marketing lists" },
        ],
        endpoints: [{ method: "POST", path: "/api/voiceflow/sendgrid/send-email", description: "Send email" }],
        testable: true,
      },
      {
        id: "twilio",
        name: "Twilio",
        type: "TWILIO",
        description: "Send SMS messages and make voice calls to customers worldwide",
        icon: Phone,
        authType: 'api_key' as const,
        fields: [
          { key: "accountSid", label: "Account SID", type: "text", required: true, placeholder: "AC..." },
          { key: "authToken", label: "Auth Token", type: "password", required: true, placeholder: "Your auth token" },
          { key: "phoneNumber", label: "Phone Number", type: "tel", required: true, placeholder: "+1234567890" },
        ],
        capabilities: [
          { id: "send_sms", name: "Send SMS", description: "Send text messages to customer phone numbers" },
          { id: "make_call", name: "Make Calls", description: "Initiate voice calls for important notifications" },
          {
            id: "verify_phone",
            name: "Verify Phone",
            description: "Send verification codes for phone number validation",
          },
        ],
        endpoints: [{ method: "POST", path: "/api/voiceflow/twilio/send-sms", description: "Send SMS message" }],
        testable: true,
      },
    ],
  },
  scheduling: {
    title: "Scheduling & Meetings",
    description: "Book appointments, schedule meetings, and manage calendar events",
    icon: Calendar,
    color: "bg-orange-500/10 text-orange-400",
    integrations: [
      {
        id: "calendly",
        name: "Calendly",
        type: "CALENDLY",
        description: "Schedule meetings and appointments with automatic calendar integration",
        icon: Calendar,
        authType: 'oauth' as const,
        fields: [
          {
            key: "accessToken",
            label: "Access Token",
            type: "password",
            required: true,
            placeholder: "Your Calendly access token",
          },
        ],
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
          { id: "cancel_booking", name: "Cancel Bookings", description: "Cancel or reschedule existing appointments" },
        ],
        endpoints: [{ method: "POST", path: "/api/voiceflow/calendly/create-booking", description: "Create booking" }],
        testable: true,
      },
      {
        id: "zoom",
        name: "Zoom",
        type: "ZOOM",
        description: "Create and manage video meetings for customer consultations and support",
        icon: Calendar,
        authType: 'oauth' as const,
        fields: [
          {
            key: "accessToken",
            label: "Access Token",
            type: "password",
            required: true,
            placeholder: "Your Zoom access token",
          },
          {
            key: "refreshToken",
            label: "Refresh Token",
            type: "password",
            required: true,
            placeholder: "Your refresh token",
          },
        ],
        capabilities: [
          { id: "create_meeting", name: "Create Meetings", description: "Generate Zoom meetings with custom settings" },
          {
            id: "schedule_webinar",
            name: "Schedule Webinars",
            description: "Set up webinars for product demonstrations",
          },
          { id: "manage_recordings", name: "Manage Recordings", description: "Access and share meeting recordings" },
        ],
        endpoints: [{ method: "POST", path: "/api/voiceflow/zoom/create-meeting", description: "Create Zoom meeting" }],
        testable: true,
      },
    ],
  },
  productivity: {
    title: "Productivity & Automation",
    description: "Automate workflows, manage tasks, and boost team productivity",
    icon: Zap,
    color: "bg-pink-500/10 text-pink-400",
    integrations: [
      {
        id: "notion",
        name: "Notion",
        type: "NOTION",
        description: "Create pages, update databases, and manage your workspace content",
        icon: Database,
        authType: 'api_key' as const,
        fields: [
          { key: "accessToken", label: "Access Token", type: "password", required: true, placeholder: "secret_..." },
        ],
        capabilities: [
          { id: "create_page", name: "Create Pages", description: "Generate new pages and documents automatically" },
          {
            id: "update_database",
            name: "Update Database",
            description: "Add and modify database entries from conversations",
          },
          {
            id: "search_content",
            name: "Search Content",
            description: "Find and retrieve information from your workspace",
          },
        ],
        endpoints: [{ method: "POST", path: "/api/voiceflow/notion/create-page", description: "Create Notion page" }],
        testable: true,
      },
      {
        id: "airtable",
        name: "Airtable",
        type: "AIRTABLE",
        description: "Manage databases, track projects, and organize customer information",
        icon: Database,
        authType: 'api_key' as const,
        fields: [
          { key: "apiKey", label: "API Key", type: "password", required: true, placeholder: "key..." },
          { key: "baseId", label: "Base ID", type: "text", required: true, placeholder: "app..." },
        ],
        capabilities: [
          { id: "create_record", name: "Create Records", description: "Add new entries to your Airtable bases" },
          { id: "update_record", name: "Update Records", description: "Modify existing data and information" },
          { id: "search_records", name: "Search Records", description: "Find and retrieve specific database entries" },
        ],
        endpoints: [],
        testable: false,
      },
      {
        id: "mailchimp",
        name: "Mailchimp",
        type: "MAILCHIMP",
        description: "Manage email lists, create campaigns, and track marketing performance",
        icon: Mail,
        authType: 'api_key' as const,
        fields: [
          { key: "apiKey", label: "API Key", type: "password", required: true, placeholder: "Your Mailchimp API key" },
          { key: "serverPrefix", label: "Server Prefix", type: "text", required: true, placeholder: "us1, us2, etc." },
        ],
        capabilities: [
          { id: "add_subscriber", name: "Add Subscribers", description: "Add contacts to email marketing lists" },
          {
            id: "create_campaign",
            name: "Create Campaigns",
            description: "Set up automated email marketing campaigns",
          },
          { id: "track_analytics", name: "Track Analytics", description: "Monitor email performance and engagement" },
        ],
        endpoints: [{ method: "POST", path: "/api/voiceflow/mailchimp/add-subscriber", description: "Add subscriber" }],
        testable: true,
      },
    ],
  },
}

interface Integration {
  id: string
  name: string
  type: string
  isActive: boolean
  lastSyncAt?: string
  lastErrorAt?: string
  lastError?: string
  syncCount?: number
  errorCount?: number
  hasValidToken?: boolean
  tokenExpiresAt?: string
  capabilities?: string | Record<string, boolean>
}

interface IntegrationField {
  key: string
  label: string
  type: string
  required: boolean
  placeholder?: string
  options?: string[]
}

type IntegrationState = "idle" | "connecting" | "connected" | "error" | "testing"

interface IntegrationStatus {
  state: IntegrationState
  progress: number
  message: string
  health?: "healthy" | "warning" | "error"
}

export default function IntegrationsPage() {
  const [activeCategory, setActiveCategory] = useState("ecommerce")
  const [connectedIntegrations, setConnectedIntegrations] = useState<Integration[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null)
  const [configureIntegration, setConfigureIntegration] = useState<{ integration: any; connected: Integration } | null>(
    null,
  )
  const [showCredentials, setShowCredentials] = useState<Record<string, boolean>>({})
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [configFormData, setConfigFormData] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [enabledCapabilities, setEnabledCapabilities] = useState<Record<string, boolean>>({})
  const [updatingCapabilities, setUpdatingCapabilities] = useState<Set<string>>(new Set())
  const [showApiDocs, setShowApiDocs] = useState<Record<string, boolean>>({})
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null)
  const [savingConfig, setSavingConfig] = useState(false)

  const [integrationStatus, setIntegrationStatus] = useState<Record<string, IntegrationStatus>>({})
  const [testingIntegration, setTestingIntegration] = useState<string | null>(null)

  const [showAdvancedView, setShowAdvancedView] = useState(false)
  const [selectedEnvironment, setSelectedEnvironment] = useState<Record<string, string>>({})
  const [webhookConfigs, setWebhookConfigs] = useState<Record<string, any>>({})
  const [oauthStates, setOauthStates] = useState<Record<string, any>>({})

  useEffect(() => {
    loadConnectedIntegrations()
  }, [])

  const loadConnectedIntegrations = async () => {
    try {
      setIsLoading(true)
      // Mock API response
      const mockIntegrations: Integration[] = [
        {
          id: "1",
          name: "Stripe",
          type: "STRIPE",
          isActive: true,
          syncCount: 145,
          errorCount: 2,
          capabilities: JSON.stringify({
            create_payment_link: true,
            verify_payment: true,
            manage_subscriptions: false,
            process_refunds: true
          })
        },
        {
          id: "2", 
          name: "HubSpot",
          type: "HUBSPOT",
          isActive: true,
          syncCount: 89,
          errorCount: 0,
          capabilities: JSON.stringify({
            create_contact: true,
            update_contact: true,
            create_deal: false,
            log_activity: true
          })
        }
      ]
      setConnectedIntegrations(mockIntegrations)

      // Initialize integration status
      const statusMap: Record<string, IntegrationStatus> = {}
      mockIntegrations.forEach((integration) => {
        statusMap[integration.type] = {
          state: integration.isActive ? "connected" : "error",
          progress: 100,
          message: integration.isActive ? "Connected and ready" : integration.lastError || "Connection error",
          health: integration.errorCount && integration.errorCount > 0 ? "warning" : "healthy",
        }
      })
      setIntegrationStatus(statusMap)
    } catch (error) {
      console.error("Failed to load integrations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnect = async (integration: any) => {
    try {
      setError(null)

      // Update status to connecting
      setIntegrationStatus((prev) => ({
        ...prev,
        [integration.type]: {
          state: "connecting",
          progress: 0,
          message: "Validating credentials...",
        },
      }))

      const missingFields = integration.fields
        .filter((field: IntegrationField) => field.required && !formData[field.key])
        .map((field: IntegrationField) => field.label)

      if (missingFields.length > 0) {
        setError(`Please fill in required fields: ${missingFields.join(", ")}`)
        setIntegrationStatus((prev) => ({
          ...prev,
          [integration.type]: {
            state: "error",
            progress: 0,
            message: "Missing required fields",
          },
        }))
        return
      }

      // Progress: Preparing credentials
      setIntegrationStatus((prev) => ({
        ...prev,
        [integration.type]: {
          state: "connecting",
          progress: 25,
          message: "Preparing credentials...",
        },
      }))

      const credentials: Record<string, string> = {}
      integration.fields.forEach((field: IntegrationField) => {
        if (formData[field.key]) {
          credentials[field.key] = formData[field.key]
        }
      })

      // Progress: Connecting to service
      setIntegrationStatus((prev) => ({
        ...prev,
        [integration.type]: {
          state: "connecting",
          progress: 50,
          message: "Connecting to service...",
        },
      }))

      // Mock successful connection
      setTimeout(() => {
        setIntegrationStatus((prev) => ({
          ...prev,
          [integration.type]: {
            state: "connecting",
            progress: 90,
            message: "Finalizing connection...",
          },
        }))

        setTimeout(() => {
          setIntegrationStatus((prev) => ({
            ...prev,
            [integration.type]: {
              state: "connected",
              progress: 100,
              message: "Connected successfully",
              health: "healthy",
            },
          }))
          setSuccess(`${integration.name} connected successfully!`)
          setFormData({})
          setSelectedIntegration(null)
          loadConnectedIntegrations()
        }, 500)
      }, 1000)
    } catch (error) {
      setError("An unexpected error occurred")
      setIntegrationStatus((prev) => ({
        ...prev,
        [integration.type]: {
          state: "error",
          progress: 0,
          message: "Unexpected error occurred",
        },
      }))
      console.error("Integration connection error:", error)
    }
  }

  const handleConfigure = (integration: any, connectedIntegration: Integration) => {
    setConfigureIntegration({ integration, connected: connectedIntegration })

    // Pre-populate form with existing credentials (masked for security)
    const configData: Record<string, string> = {}
    integration.fields.forEach((field: IntegrationField) => {
      if (field.type === "password") {
        configData[field.key] = "••••••••••••••••••••••••••••••••••••" // Masked password
      } else {
        // For non-password fields, we might have the data available
        configData[field.key] = ""
      }
    })
    setConfigFormData(configData)
    setError(null)
    setSuccess(null)
  }

  const handleUpdateConfiguration = async () => {
    if (!configureIntegration) return

    try {
      setSavingConfig(true)
      setError(null)

      const { integration, connected } = configureIntegration

      // Only send fields that have been modified (not masked passwords)
      const updatedCredentials: Record<string, string> = {}
      integration.fields.forEach((field: IntegrationField) => {
        const value = configFormData[field.key]
        if (value && value !== "••••••••••••••••••••••••••••••••••••") {
          updatedCredentials[field.key] = value
        }
      })

      // Mock successful update
      setTimeout(() => {
        setSuccess(`${integration.name} configuration updated successfully!`)
        setConfigureIntegration(null)
        setConfigFormData({})
        loadConnectedIntegrations()
        setSavingConfig(false)
      }, 1000)
    } catch (error) {
      setError("An unexpected error occurred")
      console.error("Configuration update error:", error)
      setSavingConfig(false)
    }
  }

  const handleDisconnect = async (integrationId: string, integrationType: string) => {
    try {
      setIsLoading(true)
      
      // Mock successful disconnect
      setTimeout(() => {
        setSuccess("Integration disconnected successfully")
        setIntegrationStatus((prev) => ({
          ...prev,
          [integrationType]: {
            state: "idle",
            progress: 0,
            message: "Not connected",
          },
        }))
        loadConnectedIntegrations()
        setIsLoading(false)
      }, 500)
    } catch (error) {
      setError("An unexpected error occurred")
      setIsLoading(false)
    }
  }

  const testIntegrationHealth = async (integration: any, connectedIntegration: Integration) => {
    try {
      setTestingIntegration(integration.type)
      setIntegrationStatus((prev) => ({
        ...prev,
        [integration.type]: {
          ...prev[integration.type],
          state: "testing",
          message: "Testing connection...",
        },
      }))

      // Simulate health check
      setTimeout(() => {
        const isHealthy = Math.random() > 0.2 // 80% success rate for demo

        setIntegrationStatus((prev) => ({
          ...prev,
          [integration.type]: {
            state: "connected",
            progress: 100,
            message: isHealthy ? "Connection healthy" : "Connection issues detected",
            health: isHealthy ? "healthy" : "warning",
          },
        }))
        setTestingIntegration(null)
      }, 2000)
    } catch (error) {
      setIntegrationStatus((prev) => ({
        ...prev,
        [integration.type]: {
          state: "connected",
          progress: 100,
          message: "Health check failed",
          health: "error",
        },
      }))
      setTestingIntegration(null)
    }
  }

  const handleCapabilityToggle = async (integrationId: string, capabilityId: string, enabled: boolean) => {
    const capabilityKey = `${integrationId}_${capabilityId}`

    // Add to updating set
    setUpdatingCapabilities((prev) => new Set(prev).add(capabilityKey))

    // Optimistically update UI
    setEnabledCapabilities((prev) => ({
      ...prev,
      [capabilityKey]: enabled,
    }))

    // Mock API update
    setTimeout(() => {
      // Remove from updating set
      setUpdatingCapabilities((prev) => {
        const newSet = new Set(prev)
        newSet.delete(capabilityKey)
        return newSet
      })
    }, 1000)
  }

  const handleBulkCapabilityToggle = async (integrationId: string, capabilities: any[], enable: boolean) => {
    const updates = capabilities.map((cap) => handleCapabilityToggle(integrationId, cap.id, enable))
    await Promise.all(updates)
  }

  const copyToClipboard = async (text: string, endpointId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedEndpoint(endpointId)
      setTimeout(() => setCopiedEndpoint(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const isConnected = (integrationType: string) => {
    return connectedIntegrations.some((integration) => integration.type === integrationType && integration.isActive)
  }

  const getConnectedIntegration = (integrationType: string) => {
    return connectedIntegrations.find((integration) => integration.type === integrationType && integration.isActive)
  }

  const getIntegrationStatus = (integrationType: string): IntegrationStatus => {
    return (
      integrationStatus[integrationType] || {
        state: "idle",
        progress: 0,
        message: "Not connected",
      }
    )
  }

  const getHealthBadge = (health?: string) => {
    switch (health) {
      case "healthy":
        return (
          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Healthy
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Warning
          </Badge>
        )
      case "error":
        return (
          <Badge variant="secondary" className="bg-red-500/10 text-red-400 border-red-500/20">
            <AlertCircle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        )
      default:
        return null
    }
  }

  useEffect(() => {
    const loadCapabilities = () => {
      const capabilities: Record<string, boolean> = {}

      connectedIntegrations.forEach((integration) => {
        if (integration.capabilities) {
          try {
            const parsedCapabilities =
              typeof integration.capabilities === "string"
                ? JSON.parse(integration.capabilities)
                : integration.capabilities

            Object.entries(parsedCapabilities).forEach(([capId, enabled]) => {
              capabilities[`${integration.id}_${capId}`] = enabled as boolean
            })
          } catch (error) {
            console.error("Failed to parse capabilities for integration:", integration.id, error)
          }
        }
      })

      setEnabledCapabilities(capabilities)
    }

    if (connectedIntegrations.length > 0) {
      loadCapabilities()
    }
  }, [connectedIntegrations])

  const renderCapabilities = (integration: any, connectedIntegration: Integration) => {
    if (!integration.capabilities) return null

    const enabledCount = integration.capabilities.filter(
      (cap: any) => enabledCapabilities[`${connectedIntegration?.id}_${cap.id}`] !== false,
    ).length

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">AI Agent Capabilities:</p>
          <Badge variant="outline" className="text-xs">
            {enabledCount} enabled
          </Badge>
        </div>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
          {integration.capabilities.map((capability: any) => {
            const capabilityKey = `${connectedIntegration?.id}_${capability.id}`
            const isEnabled = enabledCapabilities[capabilityKey] !== false
            const isUpdating = updatingCapabilities.has(capabilityKey)

            return (
              <div
                key={capability.id}
                className={`group relative flex items-start gap-3 p-3 rounded-lg transition-all duration-200 ${
                  isEnabled
                    ? "bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/15 hover:border-emerald-500/30"
                    : "bg-muted/30 border border-transparent hover:bg-muted/50 hover:border-border"
                } ${isUpdating ? "opacity-70" : ""}`}
              >
                <div className="relative">
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={(enabled) =>
                      handleCapabilityToggle(connectedIntegration?.id || "", capability.id, enabled)
                    }
                    disabled={isUpdating}
                    className="mt-0.5"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p
                      className={`text-sm font-medium transition-colors duration-200 ${
                        isEnabled ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {capability.name}
                    </p>
                    {isEnabled && !isUpdating && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      >
                        Active
                      </Badge>
                    )}
                    {isUpdating && (
                      <div className="flex items-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Updating...</span>
                      </div>
                    )}
                  </div>
                  <p
                    className={`text-xs transition-colors duration-200 ${
                      isEnabled ? "text-muted-foreground" : "text-muted-foreground/70"
                    }`}
                  >
                    {capability.description}
                  </p>
                </div>

                {/* Visual indicator */}
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-200 mt-2 ${
                    isEnabled ? "bg-emerald-400 shadow-sm shadow-emerald-400/50" : "bg-muted-foreground/30"
                  }`}
                />
              </div>
            )
          })}
        </div>

        {/* Bulk actions */}
        <div className="flex gap-2 pt-2 border-t border-border/50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkCapabilityToggle(connectedIntegration?.id || "", integration.capabilities, true)}
            className="flex-1 text-xs hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400"
            disabled={enabledCount === integration.capabilities.length}
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Enable All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkCapabilityToggle(connectedIntegration?.id || "", integration.capabilities, false)}
            className="flex-1 text-xs hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
            disabled={enabledCount === 0}
          >
            <AlertCircle className="h-3 w-3 mr-1" />
            Disable All
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-balance">Advanced Integration Hub</h1>
                  <p className="text-muted-foreground text-pretty">
                    Connect your tools with OAuth 2.0, real-time monitoring, and intelligent error recovery.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Advanced Mode</span>
                  <Switch checked={showAdvancedView} onCheckedChange={setShowAdvancedView} />
                </div>
              </div>
            </div>
          </div>

          {error && (
            <Alert className="border-destructive/20 bg-destructive/5">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-destructive">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-emerald-500/20 bg-emerald-500/5">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <AlertDescription className="text-emerald-600">{success}</AlertDescription>
            </Alert>
          )}

          {showAdvancedView && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <HealthMonitoringDashboard 
                integrations={connectedIntegrations} 
                onRefreshHealth={() => loadConnectedIntegrations()} 
              />
              <ErrorRecoverySystem />
            </div>
          )}

          {/* Configuration Dialog */}
          {configureIntegration && (
            <Dialog open={!!configureIntegration} onOpenChange={() => setConfigureIntegration(null)}>
              <DialogContent className="max-w-4xl bg-card border-border max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <configureIntegration.integration.icon className="h-5 w-5" />
                    Configure {configureIntegration.integration.name}
                  </DialogTitle>
                  <DialogDescription>
                    {showAdvancedView
                      ? "Advanced configuration with OAuth, webhooks, and environment settings"
                      : `Update your ${configureIntegration.integration.name} credentials and settings`}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  {showAdvancedView ? (
                    <Tabs defaultValue="credentials" className="space-y-4">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="credentials">Credentials</TabsTrigger>
                        <TabsTrigger value="environment">Environment</TabsTrigger>
                        <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
                        <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
                      </TabsList>

                      <TabsContent value="credentials" className="space-y-4">
                        {/* OAuth Flow for supported integrations */}
                        {["calendly", "hubspot", "salesforce", "zoom"].includes(configureIntegration.integration.id) ? (
                          <OAuthFlow
                            integration={configureIntegration.integration.id}
                            onSuccess={(tokens) => {
                              setOauthStates((prev) => ({
                                ...prev,
                                [configureIntegration.integration.id]: tokens,
                              }))
                              setSuccess(`${configureIntegration.integration.name} connected via OAuth 2.0`)
                            }}
                          />
                        ) : (
                          // Regular credential form for non-OAuth integrations
                          <div className="space-y-4">
                            {configureIntegration.integration.fields.map((field: IntegrationField) => (
                              <div key={field.key} className="space-y-2">
                                <Label htmlFor={field.key} className="flex items-center gap-2">
                                  {field.label}
                                  {field.required && <span className="text-destructive">*</span>}
                                </Label>
                                <div className="relative">
                                  <Input
                                    id={field.key}
                                    type={
                                      field.type === "password" && !showCredentials[field.key] ? "password" : "text"
                                    }
                                    placeholder={
                                      field.type === "password" ? "Enter new value to update" : field.placeholder
                                    }
                                    value={configFormData[field.key] || ""}
                                    onChange={(e) =>
                                      setConfigFormData({ ...configFormData, [field.key]: e.target.value })
                                    }
                                    className="bg-background border-border pr-10"
                                  />
                                  {field.type === "password" && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="absolute right-0 top-0 h-full px-3"
                                      onClick={() =>
                                        setShowCredentials({
                                          ...showCredentials,
                                          [field.key]: !showCredentials[field.key],
                                        })
                                      }
                                    >
                                      {showCredentials[field.key] ? (
                                        <EyeOff className="h-4 w-4" />
                                      ) : (
                                        <Eye className="h-4 w-4" />
                                      )}
                                    </Button>
                                  )}
                                </div>
                                {field.type === "password" && (
                                  <p className="text-xs text-muted-foreground">
                                    Leave blank to keep existing credentials
                                  </p>
                                )}
                              </div>
                            ))}

                            {/* Real-time credential validation */}
                            <CredentialValidator
                              integration={configureIntegration.integration.id}
                              credentials={configFormData}
                              onValidationResult={(isValid: boolean, message: string) => {
                                if (isValid) {
                                  setSuccess(message)
                                } else {
                                  setError(message)
                                }
                              }}
                            />
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="environment" className="space-y-4">
                        <EnvironmentSelector
                          integration={configureIntegration.integration.id}
                          currentEnvironment={selectedEnvironment[configureIntegration.integration.id] || "production"}
                          onEnvironmentChange={(env) => {
                            setSelectedEnvironment((prev) => ({
                              ...prev,
                              [configureIntegration.integration.id]: env,
                            }))
                          }}
                        />
                      </TabsContent>

                      <TabsContent value="webhooks" className="space-y-4">
                        <WebhookConfiguration
                          integration={configureIntegration.integration.id}
                          currentConfig={webhookConfigs[configureIntegration.integration.id]}
                          onConfigChange={(config: any) => {
                            setWebhookConfigs((prev) => ({
                              ...prev,
                              [configureIntegration.integration.id]: config,
                            }))
                          }}
                        />
                      </TabsContent>

                      <TabsContent value="monitoring" className="space-y-4">
                        <div className="grid grid-cols-1 gap-6">
                          <RateLimitMonitor integration={configureIntegration.integration.id} />
                          <UsageAnalytics integration={configureIntegration.integration.id} />
                        </div>
                      </TabsContent>
                    </Tabs>
                  ) : (
                    // Simple configuration for basic mode
                    <div className="space-y-4">
                      {configureIntegration.integration.fields.map((field: IntegrationField) => (
                        <div key={field.key} className="space-y-2">
                          <Label htmlFor={field.key} className="flex items-center gap-2">
                            {field.label}
                            {field.required && <span className="text-destructive">*</span>}
                          </Label>
                          {field.type === "textarea" ? (
                            <Textarea
                              id={field.key}
                              placeholder={field.placeholder}
                              value={configFormData[field.key] || ""}
                              onChange={(e) => setConfigFormData({ ...configFormData, [field.key]: e.target.value })}
                              className="bg-background border-border"
                            />
                          ) : field.type === "select" ? (
                            <select
                              id={field.key}
                              value={configFormData[field.key] || ""}
                              onChange={(e) => setConfigFormData({ ...configFormData, [field.key]: e.target.value })}
                              className="w-full px-3 py-2 bg-background border border-border rounded-md"
                            >
                              <option value="">Select {field.label}</option>
                              {field.options?.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <div className="relative">
                              <Input
                                id={field.key}
                                type={
                                  field.type === "password" && !showCredentials[field.key]
                                    ? "password"
                                    : field.type === "email"
                                      ? "email"
                                      : field.type === "tel"
                                        ? "tel"
                                        : "text"
                                }
                                placeholder={field.placeholder}
                                value={configFormData[field.key] || ""}
                                onChange={(e) => setConfigFormData({ ...configFormData, [field.key]: e.target.value })}
                                className="bg-background border-border pr-10"
                              />
                              {field.type === "password" && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3"
                                  onClick={() =>
                                    setShowCredentials({
                                      ...showCredentials,
                                      [field.key]: !showCredentials[field.key],
                                    })
                                  }
                                >
                                  {showCredentials[field.key] ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              )}
                            </div>
                          )}
                          {field.type === "password" && (
                            <p className="text-xs text-muted-foreground">Leave blank to keep existing credentials</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => setConfigureIntegration(null)}
                      disabled={savingConfig}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button className="flex-1" onClick={handleUpdateConfiguration} disabled={savingConfig}>
                      {savingConfig ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}

          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-muted/50">
              {Object.entries(INTEGRATION_CATEGORIES).map(([key, category]) => {
                const Icon = category.icon
                return (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="flex items-center gap-2 data-[state=active]:bg-background"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{category.title.split(" ")[0]}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {Object.entries(INTEGRATION_CATEGORIES).map(([categoryKey, category]) => (
              <TabsContent key={categoryKey} value={categoryKey} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${category.color}`}>
                      <category.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{category.title}</h2>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {category.integrations.map((integration) => {
                      const connected = isConnected(integration.type)
                      const connectedIntegration = getConnectedIntegration(integration.type)
                      const status = getIntegrationStatus(integration.type)
                      const Icon = integration.icon

                      const supportsOAuth = ["calendly", "hubspot", "salesforce", "zoom"].includes(integration.id)
                      const supportsWebhooks = ["stripe", "paypal", "hubspot", "salesforce"].includes(integration.id)

                      return (
                        <Card
                          key={integration.id}
                          className={`relative transition-all duration-200 hover:shadow-lg ${
                            connected
                              ? "bg-emerald-500/5 border-emerald-500/20"
                              : "bg-card/50 border-border hover:border-primary/30"
                          }`}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${category.color}`}>
                                  <Icon className="h-5 w-5" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg flex items-center gap-2">
                                    {integration.name}
                                    {showAdvancedView && (
                                      <div className="flex gap-1">
                                        {supportsOAuth && (
                                          <Badge
                                            variant="outline"
                                            className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/20"
                                          >
                                            OAuth 2.0
                                          </Badge>
                                        )}
                                        {supportsWebhooks && (
                                          <Badge
                                            variant="outline"
                                            className="text-xs bg-purple-500/10 text-purple-400 border-purple-500/20"
                                          >
                                            Webhooks
                                          </Badge>
                                        )}
                                      </div>
                                    )}
                                  </CardTitle>
                                  <div className="flex items-center gap-2 mt-1">
                                    {connected && (
                                      <Badge
                                        variant="secondary"
                                        className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                      >
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Connected
                                      </Badge>
                                    )}
                                    {connected && getHealthBadge(status.health)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <CardDescription className="text-sm">{integration.description}</CardDescription>
                          </CardHeader>

                          <CardContent className="space-y-4">
                            {status.state !== "idle" && (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">Status</span>
                                  <span
                                    className={`font-medium ${
                                      status.state === "connected"
                                        ? "text-emerald-400"
                                        : status.state === "error"
                                          ? "text-red-400"
                                          : "text-blue-400"
                                    }`}
                                  >
                                    {status.message}
                                  </span>
                                </div>
                                {status.state === "connecting" && <Progress value={status.progress} className="h-2" />}
                              </div>
                            )}

                            {showAdvancedView && connected && (
                              <div className="p-3 rounded-lg bg-muted/20 border">
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Rate Limits</span>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleConfigure(integration, connectedIntegration!)}
                                    className="text-xs"
                                  >
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            )}

                            {connected && renderCapabilities(integration, connectedIntegration!)}

                            <Separator />

                            <div className="flex gap-2">
                              {connected ? (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDisconnect(connectedIntegration!.id, integration.type)}
                                    disabled={isLoading}
                                    className="flex-1"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Disconnect
                                  </Button>
                                  {integration.testable && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => testIntegrationHealth(integration, connectedIntegration!)}
                                      disabled={testingIntegration === integration.type}
                                      className="flex-1"
                                    >
                                      {testingIntegration === integration.type ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                      ) : (
                                        <Activity className="h-4 w-4 mr-2" />
                                      )}
                                      Test Health
                                    </Button>
                                  )}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleConfigure(integration, connectedIntegration!)}
                                    className="flex-1"
                                  >
                                    <Settings className="h-4 w-4 mr-2" />
                                    Configure
                                  </Button>
                                </>
                              ) : (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      className="w-full"
                                      onClick={() => {
                                        setSelectedIntegration(integration)
                                        setFormData({})
                                        setError(null)
                                        setSuccess(null)
                                      }}
                                      disabled={status.state === "connecting"}
                                    >
                                      {status.state === "connecting" ? (
                                        <>
                                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                          Connecting...
                                        </>
                                      ) : (
                                        <>
                                          <Plus className="h-4 w-4 mr-2" />
                                          Connect
                                        </>
                                      )}
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-md bg-card border-border">
                                    <DialogHeader>
                                      <DialogTitle className="flex items-center gap-2">
                                        <Icon className="h-5 w-5" />
                                        Connect {integration.name}
                                      </DialogTitle>
                                      <DialogDescription>
                                        {showAdvancedView && supportsOAuth
                                          ? "Connect securely using OAuth 2.0 authentication"
                                          : `Enter your ${integration.name} credentials to enable automation`}
                                      </DialogDescription>
                                    </DialogHeader>

                                    <div className="space-y-4">
                                      {showAdvancedView ? (
                                        <IntegrationSetupWizard
                                          integration={integration}
                                          onComplete={(config) => {
                                            setSuccess(`${integration.name} has been successfully configured`)
                                            setSelectedIntegration(null)
                                            loadConnectedIntegrations()
                                          }}
                                        />
                                      ) : (
                                        // Simple setup for basic mode
                                        <>
                                          {integration.fields.map((field: IntegrationField) => (
                                            <div key={field.key} className="space-y-2">
                                              <Label htmlFor={field.key} className="flex items-center gap-2">
                                                {field.label}
                                                {field.required && <span className="text-destructive">*</span>}
                                              </Label>
                                              {field.type === "textarea" ? (
                                                <Textarea
                                                  id={field.key}
                                                  placeholder={field.placeholder}
                                                  value={formData[field.key] || ""}
                                                  onChange={(e) =>
                                                    setFormData({ ...formData, [field.key]: e.target.value })
                                                  }
                                                  className="bg-background border-border"
                                                />
                                              ) : field.type === "select" ? (
                                                <select
                                                  id={field.key}
                                                  value={formData[field.key] || ""}
                                                  onChange={(e) =>
                                                    setFormData({ ...formData, [field.key]: e.target.value })
                                                  }
                                                  className="w-full px-3 py-2 bg-background border border-border rounded-md"
                                                >
                                                  <option value="">Select {field.label}</option>
                                                  {field.options?.map((option) => (
                                                    <option key={option} value={option}>
                                                      {option}
                                                    </option>
                                                  ))}
                                                </select>
                                              ) : (
                                                <div className="relative">
                                                  <Input
                                                    id={field.key}
                                                    type={
                                                      field.type === "password" && !showCredentials[field.key]
                                                        ? "password"
                                                        : field.type === "email"
                                                          ? "email"
                                                          : field.type === "tel"
                                                            ? "tel"
                                                            : "text"
                                                    }
                                                    placeholder={field.placeholder}
                                                    value={formData[field.key] || ""}
                                                    onChange={(e) =>
                                                      setFormData({ ...formData, [field.key]: e.target.value })
                                                    }
                                                    className="bg-background border-border pr-10"
                                                  />
                                                  {field.type === "password" && (
                                                    <Button
                                                      type="button"
                                                      variant="ghost"
                                                      size="sm"
                                                      className="absolute right-0 top-0 h-full px-3"
                                                      onClick={() =>
                                                        setShowCredentials({
                                                          ...showCredentials,
                                                          [field.key]: !showCredentials[field.key],
                                                        })
                                                      }
                                                    >
                                                      {showCredentials[field.key] ? (
                                                        <EyeOff className="h-4 w-4" />
                                                      ) : (
                                                        <Eye className="h-4 w-4" />
                                                      )}
                                                    </Button>
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          ))}

                                          <div className="flex gap-2 pt-4">
                                            <Button
                                              variant="outline"
                                              className="flex-1 bg-transparent"
                                              onClick={() => setSelectedIntegration(null)}
                                            >
                                              Cancel
                                            </Button>
                                            <Button
                                              className="flex-1"
                                              onClick={() => handleConnect(integration)}
                                              disabled={status.state === "connecting"}
                                            >
                                              {status.state === "connecting" ? (
                                                <>
                                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                  Connecting...
                                                </>
                                              ) : (
                                                "Connect"
                                              )}
                                            </Button>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  )
}