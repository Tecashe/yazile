"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { OAuthManager } from "@/lib/oauth"

export default function OAuthCallbackPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code")
        const state = searchParams.get("state")
        const error = searchParams.get("error")

        if (error) {
          throw new Error(`OAuth error: ${error}`)
        }

        if (!code || !state) {
          throw new Error("Missing authorization code or state parameter")
        }

        // Notify the parent window (OAuth popup)
        const oauthManager = OAuthManager.getInstance()
        oauthManager.handleOAuthCallback(code, state)

        setStatus("success")
        setMessage("Authorization successful! You can close this window.")

        // Close the popup after a short delay
        setTimeout(() => {
          window.close()
        }, 2000)
      } catch (error) {
        console.error("OAuth callback error:", error)
        setStatus("error")
        setMessage(error instanceof Error ? error.message : "Authorization failed")
      }
    }

    handleCallback()
  }, [searchParams])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {status === "processing" && <Loader2 className="h-5 w-5 animate-spin" />}
            {status === "success" && <CheckCircle className="h-5 w-5 text-emerald-500" />}
            {status === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
            OAuth Authorization
          </CardTitle>
          <CardDescription>
            {status === "processing" && "Processing authorization..."}
            {status === "success" && "Authorization completed successfully"}
            {status === "error" && "Authorization failed"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "success" && (
            <Alert className="border-emerald-500/20 bg-emerald-500/5">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <AlertDescription className="text-emerald-600">{message}</AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <Alert className="border-red-500/20 bg-red-500/5">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-600">{message}</AlertDescription>
            </Alert>
          )}

          {status === "processing" && (
            <div className="text-center text-muted-foreground">
              <p>Please wait while we process your authorization...</p>
            </div>
          )}

          {status !== "processing" && (
            <Button
              onClick={() => window.close()}
              className="w-full"
              variant={status === "error" ? "outline" : "default"}
            >
              Close Window
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
