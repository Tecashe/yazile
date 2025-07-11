'use client'

import { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console for debugging
    console.error('Error boundary caught:', error)
  }, [error])

  const handleReset = () => {
    try {
      reset()
    } catch (err) {
      console.error('Reset failed:', err)
      // Fallback: reload the page
      window.location.reload()
    }
  }

  const handleGoHome = () => {
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-3 mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              We encountered an unexpected error while loading this page. 
              This issue has been logged and our team will investigate.
            </p>
            
            {/* Show error details in development */}
            {process.env.NODE_ENV === 'development' && error.message && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-left">
                <p className="text-xs text-red-700 font-mono break-all">
                  {error.message}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleReset}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            
            <Button 
              onClick={handleGoHome}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Homepage
            </Button>
          </div>

          {/* Additional Help */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              If the problem persists, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}