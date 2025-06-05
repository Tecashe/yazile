// "use client"

// import { Button } from "@/components/ui/button"
// import { AlertCircle } from "lucide-react"

// export default function Error({
//   error,
//   reset,
// }: {
//   error: Error & { digest?: string }
//   reset: () => void
// }) {
//   return (
//     <div className="container mx-auto py-8">
//       <div className="flex flex-col items-center justify-center space-y-4">
//         <AlertCircle className="h-12 w-12 text-destructive" />
//         <div className="text-center space-y-2">
//           <h2 className="text-2xl font-bold">Something went wrong!</h2>
//           <p className="text-muted-foreground">{error.message || "An error occurred while loading the page."}</p>
//         </div>
//         <Button onClick={() => reset()}>Try again</Button>
//       </div>
//     </div>
//   )
// }

"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, RefreshCw, Home, Bug } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  const [autoRetryCount, setAutoRetryCount] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const router = useRouter()

  const MAX_AUTO_RETRIES = 2
  const RETRY_DELAY = 3000 // 3 seconds

  // Auto-retry functionality
  useEffect(() => {
    if (autoRetryCount < MAX_AUTO_RETRIES) {
      const timer = setTimeout(() => {
        setAutoRetryCount(prev => prev + 1)
        setIsRetrying(true)
        reset()
        setTimeout(() => setIsRetrying(false), 1000)
      }, RETRY_DELAY)

      // Countdown timer
      setTimeLeft(RETRY_DELAY / 1000)
      const countdownTimer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(countdownTimer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => {
        clearTimeout(timer)
        clearInterval(countdownTimer)
      }
    }
  }, [autoRetryCount, reset])

  const handleManualRetry = () => {
    setIsRetrying(true)
    reset()
    setTimeout(() => setIsRetrying(false), 1000)
  }

  const handleGoHome = () => {
    router.push('/dashboard')
  }

  const getErrorTitle = () => {
    if (autoRetryCount < MAX_AUTO_RETRIES) {
      return "Oops! Something went wrong"
    }
    return "Unable to load page"
  }

  const getErrorDescription = () => {
    if (autoRetryCount < MAX_AUTO_RETRIES) {
      return `Automatically retrying in ${timeLeft} seconds... (Attempt ${autoRetryCount + 1}/${MAX_AUTO_RETRIES})`
    }
    return "We've tried loading this page multiple times but encountered an error."
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <AlertCircle className={`h-16 w-16 text-destructive transition-all duration-300 ${
                isRetrying ? 'animate-pulse' : ''
              }`} />
              {isRetrying && (
                <RefreshCw className="h-6 w-6 text-muted-foreground absolute -bottom-1 -right-1 animate-spin" />
              )}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            {getErrorTitle()}
          </CardTitle>
          <CardDescription className="text-base mt-2">
            {autoRetryCount < MAX_AUTO_RETRIES ? (
              <div className="space-y-2">
                <p>{getErrorDescription()}</p>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div 
                    className="bg-primary h-1.5 rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${((RETRY_DELAY / 1000 - timeLeft) / (RETRY_DELAY / 1000)) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              getErrorDescription()
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Error details - collapsible */}
          <details className="group">
            <summary className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Bug className="h-4 w-4" />
              <span>Error Details</span>
              <span className="ml-auto group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-3 p-3 bg-muted/50 rounded-md border">
              <p className="text-sm font-mono break-all text-muted-foreground">
                {error.message || "An unexpected error occurred while loading the page."}
              </p>
              {error.digest && (
                <p className="text-xs text-muted-foreground mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          </details>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button 
              onClick={handleManualRetry}
              disabled={isRetrying}
              className="flex-1"
              variant="default"
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleGoHome}
              variant="outline"
              className="flex-1"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </div>

          {/* Status message */}
          {autoRetryCount >= MAX_AUTO_RETRIES && (
            <div className="text-center pt-2">
              <p className="text-sm text-muted-foreground">
                If the problem persists, please try refreshing your browser or contact support.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}