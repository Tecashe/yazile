import type { IntegrationDefinition } from "@/types/integration"

export class CredentialValidator {
  static async validateField(
    field: any,
    value: string,
    integration: IntegrationDefinition,
  ): Promise<{ valid: boolean; error?: string }> {
    if (!value && field.required) {
      return { valid: false, error: `${field.label} is required` }
    }

    if (!value) {
      return { valid: true }
    }

    // Basic validation
    if (field.validation?.minLength && value.length < field.validation.minLength) {
      return { valid: false, error: `${field.label} must be at least ${field.validation.minLength} characters` }
    }

    if (field.validation?.maxLength && value.length > field.validation.maxLength) {
      return { valid: false, error: `${field.label} must be no more than ${field.validation.maxLength} characters` }
    }

    if (field.validation?.pattern) {
      const regex = new RegExp(field.validation.pattern)
      if (!regex.test(value)) {
        return { valid: false, error: `${field.label} format is invalid` }
      }
    }

    // Custom validation
    if (field.validation?.custom) {
      try {
        const isValid = await field.validation.custom(value)
        if (!isValid) {
          return { valid: false, error: `${field.label} validation failed` }
        }
      } catch (error) {
        return { valid: false, error: `${field.label} validation error: ${error}` }
      }
    }

    // Integration-specific validation
    return this.validateIntegrationSpecific(field, value, integration)
  }

  private static async validateIntegrationSpecific(
    field: any,
    value: string,
    integration: IntegrationDefinition,
  ): Promise<{ valid: boolean; error?: string }> {
    switch (integration.type) {
      case "STRIPE":
        return this.validateStripe(field, value)
      case "PAYPAL":
        return this.validatePayPal(field, value)
      case "CALENDLY":
        return this.validateCalendly(field, value)
      case "HUBSPOT":
        return this.validateHubSpot(field, value)
      case "SALESFORCE":
        return this.validateSalesforce(field, value)
      default:
        return { valid: true }
    }
  }

  private static async validateStripe(field: any, value: string): Promise<{ valid: boolean; error?: string }> {
    switch (field.key) {
      case "secretKey":
        if (!value.startsWith("sk_")) {
          return { valid: false, error: 'Stripe secret key must start with "sk_"' }
        }
        // Test the key by making a simple API call
        try {
          const response = await fetch("https://api.stripe.com/v1/account", {
            headers: { Authorization: `Bearer ${value}` },
          })
          if (!response.ok) {
            return { valid: false, error: "Invalid Stripe secret key" }
          }
        } catch {
          return { valid: false, error: "Unable to validate Stripe key - check your connection" }
        }
        break
      case "publishableKey":
        if (!value.startsWith("pk_")) {
          return { valid: false, error: 'Stripe publishable key must start with "pk_"' }
        }
        break
      case "webhookSecret":
        if (!value.startsWith("whsec_")) {
          return { valid: false, error: 'Stripe webhook secret must start with "whsec_"' }
        }
        break
    }
    return { valid: true }
  }

  private static async validatePayPal(field: any, value: string): Promise<{ valid: boolean; error?: string }> {
    // PayPal validation logic
    if (field.key === "environment" && !["sandbox", "live"].includes(value)) {
      return { valid: false, error: 'Environment must be either "sandbox" or "live"' }
    }
    return { valid: true }
  }

  private static async validateCalendly(field: any, value: string): Promise<{ valid: boolean; error?: string }> {
    // Calendly validation - should be OAuth token format
    if (field.key === "accessToken" && !value.includes("eyJ")) {
      return { valid: false, error: "Invalid Calendly access token format" }
    }
    return { valid: true }
  }

  private static async validateHubSpot(field: any, value: string): Promise<{ valid: boolean; error?: string }> {
    // HubSpot validation
    if (field.key === "accessToken" && !value.startsWith("pat-")) {
      return { valid: false, error: 'HubSpot access token should start with "pat-"' }
    }
    return { valid: true }
  }

  private static async validateSalesforce(field: any, value: string): Promise<{ valid: boolean; error?: string }> {
    // Salesforce validation
    if (field.key === "instanceUrl") {
      try {
        const url = new URL(value)
        if (!url.hostname.includes("salesforce.com")) {
          return { valid: false, error: "Instance URL must be a valid Salesforce domain" }
        }
      } catch {
        return { valid: false, error: "Invalid instance URL format" }
      }
    }
    return { valid: true }
  }
}
