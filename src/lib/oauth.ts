import type { OAuthConfig } from "@/types/integration"

export class OAuthManager {
  private static instance: OAuthManager
  private pendingAuths = new Map<string, { resolve: Function; reject: Function }>()

  static getInstance(): OAuthManager {
    if (!OAuthManager.instance) {
      OAuthManager.instance = new OAuthManager()
    }
    return OAuthManager.instance
  }

  generateAuthUrl(config: OAuthConfig, state: string): string {
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      scope: config.scopes.join(" "),
      response_type: "code",
      state,
    })

    if (config.pkce) {
      // Generate PKCE challenge
      const codeVerifier = this.generateCodeVerifier()
      const codeChallenge = this.generateCodeChallenge(codeVerifier)
      params.append("code_challenge", codeChallenge)
      params.append("code_challenge_method", "S256")

      // Store code verifier for later use
      sessionStorage.setItem(`pkce_${state}`, codeVerifier)
    }

    return `${config.authUrl}?${params.toString()}`
  }

  async exchangeCodeForToken(
    config: OAuthConfig,
    code: string,
    state: string,
  ): Promise<{ access_token: string; refresh_token?: string; expires_in?: number }> {
    const body: Record<string, string> = {
      grant_type: "authorization_code",
      client_id: config.clientId,
      code,
      redirect_uri: config.redirectUri,
    }

    if (config.clientSecret) {
      body.client_secret = config.clientSecret
    }

    if (config.pkce) {
      const codeVerifier = sessionStorage.getItem(`pkce_${state}`)
      if (codeVerifier) {
        body.code_verifier = codeVerifier
        sessionStorage.removeItem(`pkce_${state}`)
      }
    }

    const response = await fetch(config.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: new URLSearchParams(body),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`OAuth token exchange failed: ${error}`)
    }

    return response.json()
  }

  async refreshToken(
    config: OAuthConfig,
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token?: string; expires_in?: number }> {
    const body: Record<string, string> = {
      grant_type: "refresh_token",
      client_id: config.clientId,
      refresh_token: refreshToken,
    }

    if (config.clientSecret) {
      body.client_secret = config.clientSecret
    }

    const response = await fetch(config.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: new URLSearchParams(body),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Token refresh failed: ${error}`)
    }

    return response.json()
  }

  startOAuthFlow(config: OAuthConfig): Promise<{ code: string; state: string }> {
    return new Promise((resolve, reject) => {
      const state = this.generateState()
      const authUrl = this.generateAuthUrl(config, state)

      // Store promise resolvers
      this.pendingAuths.set(state, { resolve, reject })

      // Open OAuth popup
      const popup = window.open(authUrl, "oauth", "width=600,height=700,scrollbars=yes,resizable=yes")

      // Monitor popup
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed)
          this.pendingAuths.delete(state)
          reject(new Error("OAuth flow cancelled by user"))
        }
      }, 1000)

      // Timeout after 10 minutes
      setTimeout(() => {
        clearInterval(checkClosed)
        if (popup && !popup.closed) {
          popup.close()
        }
        this.pendingAuths.delete(state)
        reject(new Error("OAuth flow timed out"))
      }, 600000)
    })
  }

  handleOAuthCallback(code: string, state: string): void {
    const pending = this.pendingAuths.get(state)
    if (pending) {
      pending.resolve({ code, state })
      this.pendingAuths.delete(state)
    }
  }

  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  private generateCodeVerifier(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return btoa(String.fromCharCode.apply(null, Array.from(array)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "")
  }

  private generateCodeChallenge(verifier: string): string {
    const encoder = new TextEncoder()
    const data = encoder.encode(verifier)
    return crypto.subtle.digest("SHA-256", data).then((hash) => {
      return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(hash))))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "")
    }) as any
  }
}
