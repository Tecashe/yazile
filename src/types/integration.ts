export interface OAuthConfig {
  authUrl: string
  tokenUrl: string
  clientId: string
  clientSecret?: string
  scopes: string[]
  redirectUri: string
  pkce?: boolean
}

export interface WebhookConfig {
  url: string
  secret: string
  events: string[]
}

export interface EnvironmentConfig {
  name: string
  label: string
  baseUrl?: string
  description: string
}

export interface RateLimitInfo {
  requests: number
  window: string
  remaining?: number
  resetAt?: string
}

export interface UsageQuota {
  used: number
  limit: number
  period: string
  resetAt?: string
}

export interface IntegrationField {
  key: string
  label: string
  type: "text" | "password" | "email" | "tel" | "textarea" | "select" | "oauth" | "webhook"
  required: boolean
  placeholder?: string
  options?: string[]
  validation?: {
    pattern?: string
    minLength?: number
    maxLength?: number
    custom?: (value: string) => Promise<boolean>
  }
}

export interface Integration {
  id: string
  name: string
  type: string
  isActive: boolean
  authType: "api_key" | "oauth2" | "basic_auth"
  lastSyncAt?: string
  lastErrorAt?: string
  lastError?: string
  syncCount?: number
  errorCount?: number
  hasValidToken?: boolean
  tokenExpiresAt?: string
  capabilities?: string | Record<string, boolean>
  oauthConfig?: OAuthConfig
  webhookConfig?: WebhookConfig
  environments?: EnvironmentConfig[]
  currentEnvironment?: string
  rateLimit?: RateLimitInfo
  usageQuota?: UsageQuota
  healthStatus?: "healthy" | "warning" | "error" | "unknown"
  lastHealthCheck?: string
}

export interface IntegrationDefinition {
  id: string
  name: string
  type: string
  description: string
  icon: any
  authType: "api_key" | "oauth2" | "basic_auth"
  fields: IntegrationField[]
  capabilities: Array<{
    id: string
    name: string
    description: string
  }>
  endpoints?: Array<{
    method: string
    path: string
    description: string
  }>
  testable: boolean
  oauthConfig?: Partial<OAuthConfig>
  environments?: EnvironmentConfig[]
  webhookSupport?: boolean
  rateLimit?: RateLimitInfo
  documentation?: string
}

export type IntegrationState = "idle" | "connecting" | "connected" | "error" | "testing" | "validating" | "refreshing"

export interface IntegrationStatus {
  state: IntegrationState
  progress: number
  message: string
  health?: "healthy" | "warning" | "error"
  validationErrors?: string[]
  lastValidated?: string
}
