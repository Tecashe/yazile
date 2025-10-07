"use client"

import { DialogFooter } from "@/components/ui/dialog"

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
  Search,
  FileText,
  Shield,
  Cloud,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
// Import from updates
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { SuccessPopup } from "@/components/success-popup"

// Data structure from updates
const integrationsData = [
  {
    id: "stripe",
    name: "Stripe",
    type: "STRIPE",
    description:
      "Accept payments, create payment links, and manage subscriptions with the world's leading payment processor",
    icon: CreditCard,
    color: "bg-emerald-500/10 text-emerald-400",
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
    popular: true, // Added from updates
    category: "E-commerce", // Added from updates
    popularBgColor: "bg-purple-100", // Added from updates
    popularColor: "text-purple-600", // Added from updates
  },
  {
    id: "paypal",
    name: "PayPal",
    type: "PAYPAL",
    description: "Accept PayPal payments and manage transactions with 400+ million active users worldwide",
    icon: CreditCard,
    color: "bg-emerald-500/10 text-emerald-400",
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
    endpoints: [{ method: "POST", path: "/api/voiceflow/paypal/create-payment", description: "Create PayPal payment" }],
    testable: true,
    category: "E-commerce", // Added from updates
  },
  {
    id: "shopify",
    name: "Shopify",
    type: "SHOPIFY",
    description: "Manage products, orders, and customer data from your Shopify store",
    icon: ShoppingCart,
    color: "bg-emerald-500/10 text-emerald-400",
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
    category: "E-commerce", // Added from updates
  },
  {
    id: "hubspot",
    name: "HubSpot",
    type: "HUBSPOT",
    description: "Manage contacts, deals, and customer interactions with the leading CRM platform",
    icon: Users,
    color: "bg-blue-500/10 text-blue-400",
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
    endpoints: [{ method: "POST", path: "/api/voiceflow/hubspot/create-contact", description: "Create new contact" }],
    testable: true,
    category: "CRM", // Added from updates
  },
  {
    id: "salesforce",
    name: "Salesforce",
    type: "SALESFORCE",
    description: "Integrate with the world's #1 CRM to manage leads, opportunities, and customer data",
    icon: Building2,
    color: "bg-blue-500/10 text-blue-400",
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
    category: "CRM", // Added from updates
  },
  {
    id: "slack",
    name: "Slack",
    type: "SLACK",
    description: "Send messages and notifications to your team channels and direct messages",
    icon: MessageSquare,
    color: "bg-purple-500/10 text-purple-400",
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
    popular: true, // Added from updates
    category: "Communication", // Added from updates
    popularBgColor: "bg-pink-100", // Added from updates
    popularColor: "text-pink-600", // Added from updates
  },
  {
    id: "discord",
    name: "Discord",
    type: "DISCORD",
    description: "Engage with your community through Discord servers and channels",
    icon: MessageSquare,
    color: "bg-purple-500/10 text-purple-400",
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
    endpoints: [{ method: "POST", path: "/api/voiceflow/discord/send-message", description: "Send Discord message" }],
    testable: true,
    category: "Communication", // Added from updates
  },
  {
    id: "sendgrid",
    name: "SendGrid",
    type: "SENDGRID",
    description: "Send transactional emails, newsletters, and automated email sequences",
    icon: Mail,
    color: "bg-purple-500/10 text-purple-400",
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
    category: "Communication", // Added from updates
  },
  {
    id: "twilio",
    name: "Twilio",
    type: "TWILIO",
    description: "Send SMS messages and make voice calls to customers worldwide",
    icon: Phone,
    color: "bg-purple-500/10 text-purple-400",
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
    category: "Communication", // Added from updates
  },
  {
    id: "calendly",
    name: "Calendly",
    type: "CALENDLY",
    description: "Schedule meetings and appointments with automatic calendar integration",
    icon: Calendar,
    color: "bg-orange-500/10 text-orange-400",
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
    category: "Scheduling", // Added from updates
  },
  {
    id: "zoom",
    name: "Zoom",
    type: "ZOOM",
    description: "Create and manage video meetings for customer consultations and support",
    icon: Calendar,
    color: "bg-orange-500/10 text-orange-400",
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
    category: "Scheduling", // Added from updates
  },
  {
    id: "notion",
    name: "Notion",
    type: "NOTION",
    description: "Create pages, update databases, and manage your workspace content",
    icon: Database,
    color: "bg-pink-500/10 text-pink-400",
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
    category: "Productivity", // Added from updates
    popular: false, // Added from updates
    popularBgColor: "bg-gray-100", // Added from updates
    popularColor: "text-gray-600", // Added from updates
  },
  {
    id: "airtable",
    name: "Airtable",
    type: "AIRTABLE",
    description: "Manage databases, track projects, and organize customer information",
    icon: Database,
    color: "bg-pink-500/10 text-pink-400",
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
    category: "Productivity", // Added from updates
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    type: "MAILCHIMP",
    description: "Manage email lists, create campaigns, and track marketing performance",
    icon: Mail,
    color: "bg-pink-500/10 text-pink-400",
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
    category: "Productivity", // Added from updates
  },
  // Added from updates
  {
    id: "postgresql",
    name: "PostgreSQL",
    description: "Powerful relational database",
    category: "Database",
    icon: Database,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    popular: true,
    fields: [
      // Assuming these are the fields needed for PostgreSQL connection
      { key: "host", label: "Host", type: "text", required: true, placeholder: "localhost" },
      { key: "port", label: "Port", type: "number", required: true, placeholder: "5432" },
      { key: "user", label: "User", type: "text", required: true, placeholder: "postgres" },
      { key: "password", label: "Password", type: "password", required: true, placeholder: "your password" },
      { key: "database", label: "Database", type: "text", required: true, placeholder: "mydatabase" },
    ],
    capabilities: [
      // Example capabilities
      { id: "query_data", name: "Query Data", description: "Execute SQL queries to retrieve data" },
      { id: "insert_data", name: "Insert Data", description: "Insert new records into tables" },
      { id: "update_data", name: "Update Data", description: "Update existing records" },
      { id: "delete_data", name: "Delete Data", description: "Delete records from tables" },
    ],
    endpoints: [], // Example, actual endpoints would be needed
    testable: true,
  },
  {
    id: "auth0",
    name: "Auth0",
    description: "Authentication and authorization platform",
    category: "Security",
    icon: Shield,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    popular: true,
    fields: [
      // Assuming these are the fields needed for Auth0
      { key: "domain", label: "Domain", type: "text", required: true, placeholder: "your-tenant.auth0.com" },
      { key: "clientId", label: "Client ID", type: "text", required: true, placeholder: "Your Auth0 Client ID" },
      {
        key: "clientSecret",
        label: "Client Secret",
        type: "password",
        required: true,
        placeholder: "Your Auth0 Client Secret",
      },
    ],
    capabilities: [
      // Example capabilities
      { id: "create_user", name: "Create User", description: "Create new user accounts" },
      { id: "get_user", name: "Get User", description: "Retrieve user information" },
      { id: "update_user", name: "Update User", description: "Update user profiles" },
      { id: "delete_user", name: "Delete User", description: "Delete user accounts" },
    ],
    endpoints: [], // Example, actual endpoints would be needed
    testable: true,
  },
  {
    id: "aws_s3",
    name: "AWS S3",
    description: "Cloud object storage",
    category: "Storage",
    icon: Cloud,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    popular: false,
    fields: [
      // Assuming these are the fields needed for AWS S3
      { key: "accessKeyId", label: "Access Key ID", type: "text", required: true, placeholder: "AKIA..." },
      {
        key: "secretAccessKey",
        label: "Secret Access Key",
        type: "password",
        required: true,
        placeholder: "Your AWS Secret Key",
      },
      { key: "region", label: "Region", type: "text", required: true, placeholder: "us-east-1" },
      { key: "bucketName", label: "Bucket Name", type: "text", required: true, placeholder: "my-s3-bucket" },
    ],
    capabilities: [
      // Example capabilities
      { id: "upload_file", name: "Upload File", description: "Upload files to an S3 bucket" },
      { id: "download_file", name: "Download File", description: "Download files from an S3 bucket" },
      { id: "list_objects", name: "List Objects", description: "List objects within a bucket" },
      { id: "delete_object", name: "Delete Object", description: "Delete objects from a bucket" },
    ],
    endpoints: [], // Example, actual endpoints would be needed
    testable: true,
  },
]

// Merged categories from existing and updates
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
  // New categories from updates
  database: {
    title: "Database",
    description: "Connect and manage your data sources",
    icon: Database,
    color: "bg-blue-500/10 text-blue-400",
    integrations: [
      {
        id: "postgresql",
        name: "PostgreSQL",
        type: "POSTGRESQL",
        description: "Powerful relational database",
        icon: Database,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        popular: true,
        fields: [
          { key: "host", label: "Host", type: "text", required: true, placeholder: "localhost" },
          { key: "port", label: "Port", type: "number", required: true, placeholder: "5432" },
          { key: "user", label: "User", type: "text", required: true, placeholder: "postgres" },
          { key: "password", label: "Password", type: "password", required: true, placeholder: "your password" },
          { key: "database", label: "Database", type: "text", required: true, placeholder: "mydatabase" },
        ],
        capabilities: [
          { id: "query_data", name: "Query Data", description: "Execute SQL queries to retrieve data" },
          { id: "insert_data", name: "Insert Data", description: "Insert new records into tables" },
          { id: "update_data", name: "Update Data", description: "Update existing records" },
          { id: "delete_data", name: "Delete Data", description: "Delete records from tables" },
        ],
        endpoints: [],
        testable: true,
      },
    ],
  },
  security: {
    title: "Security",
    description: "Protect your applications and data",
    icon: Shield,
    color: "bg-orange-500/10 text-orange-400",
    integrations: [
      {
        id: "auth0",
        name: "Auth0",
        type: "AUTH0",
        description: "Authentication and authorization platform",
        icon: Shield,
        color: "text-orange-600",
        bgColor: "bg-orange-100",
        popular: true,
        fields: [
          { key: "domain", label: "Domain", type: "text", required: true, placeholder: "your-tenant.auth0.com" },
          { key: "clientId", label: "Client ID", type: "text", required: true, placeholder: "Your Auth0 Client ID" },
          {
            key: "clientSecret",
            label: "Client Secret",
            type: "password",
            required: true,
            placeholder: "Your Auth0 Client Secret",
          },
        ],
        capabilities: [
          { id: "create_user", name: "Create User", description: "Create new user accounts" },
          { id: "get_user", name: "Get User", description: "Retrieve user information" },
          { id: "update_user", name: "Update User", description: "Update user profiles" },
          { id: "delete_user", name: "Delete User", description: "Delete user accounts" },
        ],
        endpoints: [],
        testable: true,
      },
    ],
  },
  storage: {
    title: "Storage",
    description: "Store and manage your files and data",
    icon: Cloud,
    color: "bg-yellow-500/10 text-yellow-400",
    integrations: [
      {
        id: "aws_s3",
        name: "AWS S3",
        type: "AWS_S3",
        description: "Cloud object storage",
        icon: Cloud,
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
        popular: false,
        fields: [
          { key: "accessKeyId", label: "Access Key ID", type: "text", required: true, placeholder: "AKIA..." },
          {
            key: "secretAccessKey",
            label: "Secret Access Key",
            type: "password",
            required: true,
            placeholder: "Your AWS Secret Key",
          },
          { key: "region", label: "Region", type: "text", required: true, placeholder: "us-east-1" },
          { key: "bucketName", label: "Bucket Name", type: "text", required: true, placeholder: "my-s3-bucket" },
        ],
        capabilities: [
          { id: "upload_file", name: "Upload File", description: "Upload files to an S3 bucket" },
          { id: "download_file", name: "Download File", description: "Download files from an S3 bucket" },
          { id: "list_objects", name: "List Objects", description: "List objects within a bucket" },
          { id: "delete_object", name: "Delete Object", description: "Delete objects from a bucket" },
        ],
        endpoints: [],
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

// Merged integrations data from existing and updates
const integrations = [
  // E-commerce
  {
    id: "stripe",
    name: "Stripe",
    description: "Accept payments and manage subscriptions",
    category: "E-commerce",
    icon: CreditCard,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    popular: true,
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "Accept PayPal payments globally",
    category: "E-commerce",
    icon: CreditCard,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    popular: false,
  },
  {
    id: "shopify",
    name: "Shopify",
    description: "Manage your Shopify store",
    category: "E-commerce",
    icon: ShoppingCart,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
    popular: false,
  },
  // CRM
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Manage contacts and deals",
    category: "CRM",
    icon: Users,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    popular: true,
  },
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Leading CRM platform",
    category: "CRM",
    icon: Building2,
    color: "text-red-600",
    bgColor: "bg-red-100",
    popular: false,
  },
  // Communication
  {
    id: "slack",
    name: "Slack",
    description: "Team communication and collaboration",
    category: "Communication",
    icon: MessageSquare,
    color: "text-pink-600",
    bgColor: "bg-pink-100",
    popular: true,
  },
  {
    id: "discord",
    name: "Discord",
    description: "Engage with your community",
    category: "Communication",
    icon: MessageSquare,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
    popular: false,
  },
  {
    id: "sendgrid",
    name: "SendGrid",
    description: "Email delivery and marketing platform",
    category: "Communication",
    icon: Mail,
    color: "text-cyan-600",
    bgColor: "bg-cyan-100",
    popular: false,
  },
  {
    id: "twilio",
    name: "Twilio",
    description: "SMS and voice communication",
    category: "Communication",
    icon: Phone,
    color: "text-green-600",
    bgColor: "bg-green-100",
    popular: false,
  },
  // Scheduling
  {
    id: "calendly",
    name: "Calendly",
    description: "Schedule meetings and appointments",
    category: "Scheduling",
    icon: Calendar,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    popular: true,
  },
  {
    id: "zoom",
    name: "Zoom",
    description: "Video conferencing and webinars",
    category: "Scheduling",
    icon: Calendar,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    popular: false,
  },
  // Productivity
  {
    id: "notion",
    name: "Notion",
    description: "All-in-one workspace",
    category: "Productivity",
    icon: FileText,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    popular: false,
  },
  {
    id: "airtable",
    name: "Airtable",
    description: "Manage databases and projects",
    category: "Productivity",
    icon: Database,
    color: "text-red-600",
    bgColor: "bg-red-100",
    popular: false,
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    description: "Email marketing and automation",
    category: "Productivity",
    icon: Mail,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    popular: false,
  },
  // New integrations from updates
  {
    id: "postgresql",
    name: "PostgreSQL",
    description: "Powerful relational database",
    category: "Database",
    icon: Database,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    popular: true,
  },
  {
    id: "auth0",
    name: "Auth0",
    description: "Authentication and authorization platform",
    category: "Security",
    icon: Shield,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    popular: true,
  },
  {
    id: "aws_s3",
    name: "AWS S3",
    description: "Cloud object storage",
    category: "Storage",
    icon: Cloud,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    popular: false,
  },
]

// Automation types from updates
const automationTypes = [
  { value: "sync", label: "Data Sync", description: "Automatically sync data between systems" },
  { value: "backup", label: "Backup", description: "Schedule regular backups" },
  { value: "notification", label: "Notifications", description: "Get notified of important events" },
  { value: "workflow", label: "Workflow", description: "Automate complex workflows" },
]

export default function IntegrationsPage() {
  // State variables from existing code
  const [activeCategory, setActiveCategory] = useState("ecommerce")
  const [connectedIntegrations, setConnectedIntegrations] = useState<Integration[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIntegrationForConfig, setSelectedIntegrationForConfig] = useState<any>(null) // Renamed to avoid conflict
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

  // State variables from updates
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [automationDialogOpen, setAutomationDialogOpen] = useState(false)
  const [selectedIntegrationForAutomation, setSelectedIntegrationForAutomation] = useState<
    (typeof integrations)[0] | null
  >(null) // Renamed to avoid conflict
  const [email, setEmail] = useState("")
  const [selectedAutomationType, setSelectedAutomationType] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false) // Renamed to avoid conflict

  // Derived state from updates
  const categories = ["all", ...Array.from(new Set(integrations.map((i) => i.category)))]

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || integration.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  useEffect(() => {
    loadConnectedIntegrations()
  }, [])

  const loadConnectedIntegrations = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/dashboard/integrations")
      if (response.ok) {
        const data = await response.json()
        setConnectedIntegrations(data.integrations || [])

        // Initialize integration status
        const statusMap: Record<string, IntegrationStatus> = {}
        data.integrations?.forEach((integration: Integration) => {
          statusMap[integration.type] = {
            state: integration.isActive ? "connected" : "error",
            progress: 100,
            message: integration.isActive ? "Connected and ready" : integration.lastError || "Connection error",
            health: integration.errorCount && integration.errorCount > 0 ? "warning" : "healthy",
          }
        })
        setIntegrationStatus(statusMap)
      }
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

      const response = await fetch("/api/dashboard/integrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: integration.type,
          name: integration.name,
          credentials,
        }),
      })

      if (response.ok) {
        // Progress: Finalizing
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
          setSelectedIntegrationForConfig(null) // Use renamed state
          loadConnectedIntegrations()
        }, 500)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to connect integration")
        setIntegrationStatus((prev) => ({
          ...prev,
          [integration.type]: {
            state: "error",
            progress: 0,
            message: errorData.error || "Connection failed",
          },
        }))
      }
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

      const response = await fetch(`/api/dashboard/integrations/${connected.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credentials: updatedCredentials,
        }),
      })

      if (response.ok) {
        setSuccess(`${integration.name} configuration updated successfully!`)
        setConfigureIntegration(null)
        setConfigFormData({})
        loadConnectedIntegrations()
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to update configuration")
      }
    } catch (error) {
      setError("An unexpected error occurred")
      console.error("Configuration update error:", error)
    } finally {
      setSavingConfig(false)
    }
  }

  const handleDisconnect = async (integrationId: string, integrationType: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/dashboard/integrations/${integrationId}`, {
        method: "DELETE",
      })

      if (response.ok) {
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
      } else {
        setError("Failed to disconnect integration")
      }
    } catch (error) {
      setError("An unexpected error occurred")
    } finally {
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

      // Simulate health check - in production, this would call actual test endpoints
      await new Promise((resolve) => setTimeout(resolve, 2000))

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
    } finally {
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

    // Update integration capabilities in backend
    try {
      const response = await fetch(`/api/dashboard/integrations/${integrationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Changed from JSON.stringify to JSON.JSON.stringify, corrected to JSON.stringify
          capabilities: {
            [capabilityId]: enabled,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update setting")
      }

      // Show success feedback
      toast({
        title: "Capability Updated",
        description: `${capabilityId.replace(/_/g, " ")} has been ${enabled ? "enabled" : "disabled"} for your AI agent.`,
      })
    } catch (error) {
      console.error("Failed to update setting:", error)
      // Revert the UI change on error
      setEnabledCapabilities((prev) => ({
        ...prev,
        [capabilityKey]: !enabled,
      }))

      toast({
        title: "Update Failed",
        description: "Failed to update setting. Please try again.",
        variant: "destructive",
      })
    } finally {
      // Remove from updating set
      setUpdatingCapabilities((prev) => {
        const newSet = new Set(prev)
        newSet.delete(capabilityKey)
        return newSet
      })
    }
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

                  {/* Hover tooltip */}
                  <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                    <div className="bg-popover text-popover-foreground px-3 py-2 rounded-md shadow-lg border text-xs whitespace-nowrap">
                      {isEnabled ? "Disable" : "Enable"}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover"></div>
                    </div>
                  </div>
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

                  {/* Additional context on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-1">
                    <p className="text-xs text-primary/70">
                      {isEnabled
                        ? "This capability is available to your AI agent in conversations"
                        : "Enable this to allow your AI agent to perform this action"}
                    </p>
                  </div>
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

  // --- START: Merged code from updates ---

  const handleAutomateClick = (integration: (typeof integrations)[0]) => {
    setSelectedIntegrationForAutomation(integration) // Use renamed state
    setAutomationDialogOpen(true)
  }

  const handleSubmitAutomation = async () => {
    if (!email || !selectedAutomationType || !selectedIntegrationForAutomation) return // Use renamed state

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/send-automation-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          integrationName: selectedIntegrationForAutomation.name, // Use renamed state
          automationType: selectedAutomationType,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send automation request")
      }

      // Close dialog and show success
      setAutomationDialogOpen(false)
      setShowSuccessPopup(true) // Use renamed state

      // Reset form
      setEmail("")
      setSelectedAutomationType("")
      setSelectedIntegrationForAutomation(null) // Use renamed state
    } catch (error) {
      console.error("[v0] Error submitting automation:", error)
      alert("Failed to submit automation request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // --- END: Merged code from updates ---

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header section (modified from original to match updates) */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">Integrations</h1>
          <p className="text-lg text-muted-foreground">Connect your favorite tools and automate your workflow</p>
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

        {/* Search and Filter section (from updates) */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full sm:w-auto">
            <TabsList>
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="capitalize">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Configuration Dialog */}
        {configureIntegration && (
          <Dialog open={!!configureIntegration} onOpenChange={() => setConfigureIntegration(null)}>
            <DialogContent className="max-w-md bg-card border-border">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <configureIntegration.integration.icon className="h-5 w-5" />
                  Configure {configureIntegration.integration.name}
                </DialogTitle>
                <DialogDescription>
                  Update your {configureIntegration.integration.name} credentials and settings
                </DialogDescription>
              </DialogHeader>

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
                          placeholder={field.type === "password" ? "Enter new value to update" : field.placeholder}
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
                            {showCredentials[field.key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        )}
                      </div>
                    )}
                    {field.type === "password" && (
                      <p className="text-xs text-muted-foreground">Leave blank to keep existing credentials</p>
                    )}
                  </div>
                ))}

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

        {/* Tabs for Categories (modified to use merged INTEGRATION_CATEGORIES) */}
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
                                <CardTitle className="text-lg">{integration.name}</CardTitle>
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
                            <CardDescription className="text-sm">{integration.description}</CardDescription>
                          </div>
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

                          {connected && renderCapabilities(integration, connectedIntegration!)}

                          {/* Removed API Docs section */}

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
                              // Connect Dialog (modified for updates)
                              <Dialog
                                open={selectedIntegrationForAutomation?.id === integration.id}
                                onOpenChange={(isOpen) => {
                                  if (!isOpen) {
                                    setSelectedIntegrationForAutomation(null)
                                    setEmail("")
                                    setSelectedAutomationType("")
                                  }
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    className="w-full"
                                    onClick={() => {
                                      setSelectedIntegrationForConfig(integration) // Use renamed state
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
                                      Enter your {integration.name} credentials to enable automation
                                    </DialogDescription>
                                  </DialogHeader>

                                  <div className="space-y-4">
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
                                            onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                                            className="bg-background border-border"
                                          />
                                        ) : field.type === "select" ? (
                                          <select
                                            id={field.key}
                                            value={formData[field.key] || ""}
                                            onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
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
                                        onClick={() => setSelectedIntegrationForConfig(null)} // Use renamed state
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

      {/* Automation Dialog (from updates) */}
      <Dialog open={automationDialogOpen} onOpenChange={setAutomationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Automate {selectedIntegrationForAutomation?.name}</DialogTitle>
            <DialogDescription>
              Set up automation for this integration. We'll send you setup instructions via email.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email Address</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
              <FieldDescription>We'll send automation setup instructions to this email</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="automation-type">Automation Type</FieldLabel>
              <div className="grid gap-2">
                {automationTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setSelectedAutomationType(type.value)}
                    disabled={isSubmitting}
                    className={`rounded-lg border p-3 text-left transition-colors hover:bg-accent ${
                      selectedAutomationType === type.value ? "border-primary bg-accent" : "border-input"
                    }`}
                  >
                    <div className="font-medium">{type.label}</div>
                    <div className="text-sm text-muted-foreground">{type.description}</div>
                  </button>
                ))}
              </div>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAutomationDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmitAutomation} disabled={!email || !selectedAutomationType || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Sending...
                </>
              ) : (
                "Send Instructions"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Popup (from updates) */}
      <SuccessPopup
        show={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        message="Automation instructions sent to your email!"
      />
    </div>
  )
}
