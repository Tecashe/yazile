'use client'

import { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console for debugging
    console.error('Error boundary caught:', error)
  }, [error])

  const handleReload = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
          {/* Simple Error Message */}
          <div className="space-y-4 mb-8">
            <h1 className="text-2xl font-semibold text-foreground">
              Something went wrong
            </h1>
            <p className="text-muted-foreground text-sm">
              We&apos;re having trouble loading this page. Please try refreshing.
            </p>
          </div>

          {/* Single Reload Button */}
          <Button
            onClick={handleReload}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reload Page
          </Button>
        </div>
      </div>
    </div>
  )
}