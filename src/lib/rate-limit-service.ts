interface RateLimitConfig {
  integrationId: string
  limits: {
    requests: number
    window: string // e.g., '1h', '1d', '1m'
  }
  quota: {
    monthly: number
    daily?: number
  }
}

interface RateLimitState {
  requests: number
  windowStart: number
  quotaUsed: number
  quotaPeriodStart: number
}

class RateLimitService {
  private limits = new Map<string, RateLimitConfig>()
  private state = new Map<string, RateLimitState>()

  constructor() {
    this.initializeDefaults()
  }

  private initializeDefaults() {
    // Default rate limits for common integrations
    const defaults: RateLimitConfig[] = [
      {
        integrationId: "stripe",
        limits: { requests: 100, window: "1s" },
        quota: { monthly: 1000000, daily: 50000 },
      },
      {
        integrationId: "paypal",
        limits: { requests: 50, window: "1s" },
        quota: { monthly: 500000, daily: 25000 },
      },
      {
        integrationId: "calendly",
        limits: { requests: 1000, window: "1h" },
        quota: { monthly: 100000 },
      },
      {
        integrationId: "hubspot",
        limits: { requests: 100, window: "10s" },
        quota: { monthly: 1000000, daily: 40000 },
      },
      {
        integrationId: "salesforce",
        limits: { requests: 20, window: "20s" },
        quota: { monthly: 5000000 },
      },
      {
        integrationId: "zoom",
        limits: { requests: 80, window: "1s" },
        quota: { monthly: 100000, daily: 5000 },
      },
    ]

    defaults.forEach((config) => {
      this.limits.set(config.integrationId, config)
    })
  }

  checkRateLimit(integrationId: string): { allowed: boolean; remaining: number; resetTime: number } {
    const config = this.limits.get(integrationId)
    if (!config) {
      return { allowed: true, remaining: Number.POSITIVE_INFINITY, resetTime: 0 }
    }

    const now = Date.now()
    const windowMs = this.parseWindow(config.limits.window)

    let state = this.state.get(integrationId)
    if (!state || now - state.windowStart >= windowMs) {
      // Reset window
      state = {
        requests: 0,
        windowStart: now,
        quotaUsed: state?.quotaUsed || 0,
        quotaPeriodStart: state?.quotaPeriodStart || now,
      }
      this.state.set(integrationId, state)
    }

    const remaining = Math.max(0, config.limits.requests - state.requests)
    const resetTime = state.windowStart + windowMs

    return {
      allowed: state.requests < config.limits.requests,
      remaining,
      resetTime,
    }
  }

  recordRequest(integrationId: string): void {
    const state = this.state.get(integrationId)
    if (state) {
      state.requests++
      state.quotaUsed++
    }
  }

  getUsageStats(integrationId: string) {
    const config = this.limits.get(integrationId)
    const state = this.state.get(integrationId)

    if (!config || !state) {
      return null
    }

    const now = Date.now()
    const windowMs = this.parseWindow(config.limits.window)
    const monthMs = 30 * 24 * 60 * 60 * 1000 // Approximate month

    // Check if we need to reset quota
    if (now - state.quotaPeriodStart >= monthMs) {
      state.quotaUsed = 0
      state.quotaPeriodStart = now
    }

    return {
      rateLimit: {
        limit: config.limits.requests,
        remaining: Math.max(0, config.limits.requests - state.requests),
        reset: Math.floor((state.windowStart + windowMs) / 1000),
        window: config.limits.window,
      },
      quota: {
        used: state.quotaUsed,
        limit: config.quota.monthly,
        period: "monthly",
        resetDate: new Date(state.quotaPeriodStart + monthMs).toISOString(),
      },
      status: this.getHealthStatus(integrationId),
    }
  }

  private getHealthStatus(integrationId: string): "healthy" | "warning" | "critical" {
    const stats = this.getUsageStats(integrationId)
    if (!stats) return "healthy"

    const rateLimitUsage = ((stats.rateLimit.limit - stats.rateLimit.remaining) / stats.rateLimit.limit) * 100
    const quotaUsage = (stats.quota.used / stats.quota.limit) * 100

    if (rateLimitUsage > 90 || quotaUsage > 90) return "critical"
    if (rateLimitUsage > 75 || quotaUsage > 75) return "warning"
    return "healthy"
  }

  private parseWindow(window: string): number {
    const match = window.match(/^(\d+)([smhd])$/)
    if (!match) return 60000 // Default 1 minute

    const [, amount, unit] = match
    const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 }
    return Number.parseInt(amount) * multipliers[unit as keyof typeof multipliers]
  }

  // Predict when rate limits will be available
  predictAvailability(integrationId: string, requestsNeeded: number): Date | null {
    const config = this.limits.get(integrationId)
    const state = this.state.get(integrationId)

    if (!config || !state) return null

    const windowMs = this.parseWindow(config.limits.window)
    const available = config.limits.requests - state.requests

    if (available >= requestsNeeded) {
      return new Date() // Available now
    }

    // Calculate when enough capacity will be available
    return new Date(state.windowStart + windowMs)
  }
}

export const rateLimitService = new RateLimitService()
