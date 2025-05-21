"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Loader2, CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Elements, useStripe, useElements } from "@stripe/react-stripe-js"
import { stripePromise } from "@/lib/stripe-client"

type PaymentFormProps = {
  onSuccess: () => void
  onCancel: () => void
}

// Geolocation hook
const useGeolocation = () => {
  const [location, setLocation] = useState<{
    latitude: number | null
    longitude: number | null
    error: string | null
  }>({
    latitude: null,
    longitude: null,
    error: null,
  })

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
          })
        },
        (error) => {
          setLocation({
            latitude: null,
            longitude: null,
            error: error.message,
          })
        },
      )
    } else {
      setLocation({
        latitude: null,
        longitude: null,
        error: "Geolocation is not supported by this browser.",
      })
    }
  }, [])

  return location
}

// Checkout form component
const CheckoutForm = ({ onSuccess, onCancel }: PaymentFormProps) => {
  const { toast } = useToast()
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [plan, setPlan] = useState<"monthly" | "yearly">("monthly")
  const [error, setError] = useState<string | null>(null)
  const location = useGeolocation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Create checkout session
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      })

      const { sessionId, error: sessionError } = await response.json()

      if (sessionError) {
        throw new Error(sessionError)
      }

      // Redirect to Stripe Checkout
      const { error: redirectError } = await stripe.redirectToCheckout({
        sessionId,
      })

      if (redirectError) {
        throw new Error(redirectError.message)
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
      toast({
        title: "Payment error",
        description: err.message || "An unexpected error occurred",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-4 rounded-lg border border-purple-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-900/30 rounded-lg">
            <Sparkles className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h4 className="font-medium text-purple-300">Unlock Premium Features</h4>
            <p className="text-sm text-gray-400 mt-1">Get access to AI-powered templates and advanced features</p>
          </div>
        </div>
      </div>

      <RadioGroup value={plan} onValueChange={(value) => setPlan(value as "monthly" | "yearly")} className="space-y-3">
        <div className="flex items-center justify-between bg-gray-900 p-3 rounded-lg">
          <div className="flex items-center gap-3">
            <RadioGroupItem id="monthly" value="monthly" className="text-purple-500" />
            <div>
              <Label htmlFor="monthly" className="font-medium text-white">
                Monthly
              </Label>
              <p className="text-sm text-gray-400">$9.99 per month</p>
            </div>
          </div>
          <Badge className="bg-purple-900 text-purple-300">Popular</Badge>
        </div>

        <div className="flex items-center justify-between bg-gray-900 p-3 rounded-lg">
          <div className="flex items-center gap-3">
            <RadioGroupItem id="yearly" value="yearly" className="text-purple-500" />
            <div>
              <Label htmlFor="yearly" className="font-medium text-white">
                Yearly
              </Label>
              <p className="text-sm text-gray-400">$99.99 per year</p>
            </div>
          </div>
          <Badge className="bg-green-900 text-green-300">Save 17%</Badge>
        </div>
      </RadioGroup>

      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="pt-2">
        <Button
          type="submit"
          disabled={isProcessing || !stripe}
          className="w-full bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-6 flex items-center justify-center"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Proceed to Checkout
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isProcessing}
          className="w-full mt-2 text-gray-400"
        >
          Cancel
        </Button>
        <p className="text-xs text-center text-gray-500 mt-3">Cancel anytime. No questions asked.</p>
      </div>
    </form>
  )
}

// Main payment form component with Stripe Elements
const PaymentForm = (props: PaymentFormProps) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  )
}

export default PaymentForm
