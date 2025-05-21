"use client"

import { ArrowLeft } from "lucide-react"

export default function CancelPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-xl border border-gray-800 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <div className="bg-gray-800 p-4 rounded-full mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Payment Cancelled</h1>
          <p className="text-gray-400 mb-6">Your subscription payment was cancelled. No charges were made.</p>
          <a
            href="/"
            className="flex items-center justify-center w-full py-3 px-4 bg-gray-800 text-white rounded-lg font-medium text-center hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
