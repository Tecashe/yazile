"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle } from "lucide-react"
import { onSubscribe } from "@/actions/user"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")

  useEffect(() => {
    if (sessionId) {
      const updateSubscription = async () => {
        try {
          const result = await onSubscribe(sessionId)
          if (result.status === 200) {
            setStatus("success")
          } else {
            setStatus("error")
          }
        } catch (error) {
          console.error("Error updating subscription:", error)
          setStatus("error")
        }
      }

      updateSubscription()
    }
  }, [sessionId])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-xl border border-gray-800 shadow-xl">
        {status === "loading" && (
          <div className="flex flex-col items-center text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
            <h1 className="text-2xl font-bold mb-2">Processing your subscription...</h1>
            <p className="text-gray-400">Please wait while we confirm your payment.</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center text-center">
            <div className="bg-green-900/30 p-4 rounded-full mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Subscription Activated!</h1>
            <p className="text-gray-400 mb-6">
              Thank you for your purchase. You now have access to all premium features.
            </p>
            <a
              href="/"
              className="w-full py-3 px-4 bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-lg font-medium text-center"
            >
              Return to Dashboard
            </a>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center text-center">
            <div className="bg-red-900/30 p-4 rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-gray-400 mb-6">
              We couldnt process your subscription. Please try again or contact support.
            </p>
            <a
              href="/"
              className="w-full py-3 px-4 bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-lg font-medium text-center"
            >
              Return to Dashboard
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
