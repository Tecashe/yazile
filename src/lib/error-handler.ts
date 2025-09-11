interface IntegrationError {
  type: "auth" | "rate_limit" | "network" | "validation" | "server"
  message: string
  details: string
  integrationId: string
  integrationName: string
  originalError?: Error
  context?: Record<string, any>
}

interface RetryConfig {
  maxAttempts: number
  baseDelay: number
  maxDelay: number
  backoffMultiplier: number
}

class IntegrationErrorHandler {
  private errorLog: Map<string, IntegrationError[]> = new Map()
  private retryConfigs: Map<string, RetryConfig> = new Map()

  constructor() {
    this.initializeRetryConfigs()
  }

  private initializeRetryConfigs() {
    const defaultConfig: RetryConfig = {
      maxAttempts: 3,
      baseDelay: 1000,
      maxDelay: 30000,
      backoffMultiplier: 2,
    }

    // Specific configs for different error types
    this.retryConfigs.set("network", { ...defaultConfig, maxAttempts: 5 })
    this.retryConfigs.set("rate_limit", {
      ...defaultConfig,
      maxAttempts: 1,
      baseDelay: 60000, // Wait 1 minute for rate limits
    })
    this.retryConfigs.set("auth", { ...defaultConfig, maxAttempts: 2 })
    this.retryConfigs.set("server", { ...defaultConfig, maxAttempts: 3 })
    this.retryConfigs.set("validation", { ...defaultConfig, maxAttempts: 1 })
  }

  async handleError(error: IntegrationError): Promise<boolean> {
    // Log the error
    this.logError(error)

    // Determine if we should retry
    const shouldRetry = this.shouldRetry(error)
    if (!shouldRetry) {
      return false
    }

    // Attempt recovery based on error type
    return await this.attemptRecovery(error)
  }

  private logError(error: IntegrationError) {
    const integrationErrors = this.errorLog.get(error.integrationId) || []
    integrationErrors.push({
      ...error,
      timestamp: new Date().toISOString(),
    } as any)

    // Keep only last 100 errors per integration
    if (integrationErrors.length > 100) {
      integrationErrors.splice(0, integrationErrors.length - 100)
    }

    this.errorLog.set(error.integrationId, integrationErrors)
  }

  private shouldRetry(error: IntegrationError): boolean {
    const recentErrors = this.getRecentErrors(error.integrationId, error.type)
    const config = this.retryConfigs.get(error.type) || this.retryConfigs.get("network")!

    return recentErrors.length < config.maxAttempts
  }

  private async attemptRecovery(error: IntegrationError): Promise<boolean> {
    switch (error.type) {
      case "auth":
        return await this.handleAuthError(error)
      case "rate_limit":
        return await this.handleRateLimitError(error)
      case "network":
        return await this.handleNetworkError(error)
      case "server":
        return await this.handleServerError(error)
      case "validation":
        return await this.handleValidationError(error)
      default:
        return false
    }
  }

  private async handleAuthError(error: IntegrationError): Promise<boolean> {
    try {
      // Attempt to refresh token
      const response = await fetch(`/api/integrations/${error.integrationId}/refresh-token`, {
        method: "POST",
      })

      if (response.ok) {
        console.log(`[v0] Successfully refreshed token for ${error.integrationName}`)
        return true
      }

      // If refresh fails, mark for manual reconnection
      await this.notifyManualIntervention(error, "Token refresh failed. Manual reconnection required.")
      return false
    } catch (refreshError) {
      console.error(`[v0] Token refresh failed for ${error.integrationName}:`, refreshError)
      return false
    }
  }

  private async handleRateLimitError(error: IntegrationError): Promise<boolean> {
    // Extract retry-after header or use default delay
    const retryAfter = error.context?.retryAfter || 60000

    console.log(`[v0] Rate limit hit for ${error.integrationName}. Waiting ${retryAfter}ms`)

    // Schedule retry after the specified delay
    setTimeout(async () => {
      try {
        await this.retryOriginalRequest(error)
      } catch (retryError) {
        console.error(`[v0] Retry after rate limit failed:`, retryError)
      }
    }, retryAfter)

    return true // Indicate that recovery is in progress
  }

  private async handleNetworkError(error: IntegrationError): Promise<boolean> {
    const config = this.retryConfigs.get("network")!
    const attemptCount = this.getRecentErrors(error.integrationId, "network").length

    if (attemptCount >= config.maxAttempts) {
      return false
    }

    const delay = Math.min(config.baseDelay * Math.pow(config.backoffMultiplier, attemptCount), config.maxDelay)

    console.log(`[v0] Network error for ${error.integrationName}. Retrying in ${delay}ms (attempt ${attemptCount + 1})`)

    setTimeout(async () => {
      try {
        await this.retryOriginalRequest(error)
      } catch (retryError) {
        console.error(`[v0] Network retry failed:`, retryError)
      }
    }, delay)

    return true
  }

  private async handleServerError(error: IntegrationError): Promise<boolean> {
    // For 5xx errors, wait and retry with exponential backoff
    const config = this.retryConfigs.get("server")!
    const attemptCount = this.getRecentErrors(error.integrationId, "server").length

    if (attemptCount >= config.maxAttempts) {
      await this.notifyManualIntervention(error, "Server errors persist. Manual investigation required.")
      return false
    }

    const delay = Math.min(config.baseDelay * Math.pow(config.backoffMultiplier, attemptCount), config.maxDelay)

    setTimeout(async () => {
      try {
        await this.retryOriginalRequest(error)
      } catch (retryError) {
        console.error(`[v0] Server error retry failed:`, retryError)
      }
    }, delay)

    return true
  }

  private async handleValidationError(error: IntegrationError): Promise<boolean> {
    // Validation errors usually require manual intervention
    await this.notifyManualIntervention(error, "Configuration validation failed. Please check your settings.")
    return false
  }

  private async retryOriginalRequest(error: IntegrationError): Promise<void> {
    // This would contain the logic to retry the original request
    // Implementation depends on how requests are structured in your app
    console.log(`[v0] Retrying original request for ${error.integrationName}`)

    // Example: Re-execute the failed operation
    if (error.context?.originalRequest) {
      const { method, url, body, headers } = error.context.originalRequest

      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      })

      if (!response.ok) {
        throw new Error(`Retry failed: ${response.status} ${response.statusText}`)
      }
    }
  }

  private async notifyManualIntervention(error: IntegrationError, message: string): Promise<void> {
    // Send notification to user/admin about manual intervention needed
    console.log(`[v0] Manual intervention required for ${error.integrationName}: ${message}`)

    // This could trigger email notifications, dashboard alerts, etc.
    await fetch("/api/notifications/manual-intervention", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        integrationId: error.integrationId,
        integrationName: error.integrationName,
        error: error.message,
        message,
        timestamp: new Date().toISOString(),
      }),
    })
  }

  private getRecentErrors(integrationId: string, type: string, timeWindow = 3600000): any[] {
    const errors = this.errorLog.get(integrationId) || []
    const cutoff = Date.now() - timeWindow

    return errors.filter((error) => error.type === type && new Date(error.details).getTime() > cutoff)
  }

  // Public methods for UI integration
  getErrorsForIntegration(integrationId: string): any[] {
    return this.errorLog.get(integrationId) || []
  }

  getAllErrors(): any[] {
    const allErrors: any[] = []
    this.errorLog.forEach((errors) => allErrors.push(...errors))
    return allErrors.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  clearResolvedErrors(integrationId: string): void {
    const errors = this.errorLog.get(integrationId) || []
    const activeErrors = errors.filter((error) => !error.details)
    this.errorLog.set(integrationId, activeErrors)
  }
}

export const errorHandler = new IntegrationErrorHandler()

// Utility function to create standardized errors
export function createIntegrationError(
  type: IntegrationError["type"],
  message: string,
  integrationId: string,
  integrationName: string,
  details?: string,
  context?: Record<string, any>,
): IntegrationError {
  return {
    type,
    message,
    details: details || message,
    integrationId,
    integrationName,
    context,
  }
}
