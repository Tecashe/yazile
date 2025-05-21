// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Badge } from "@/components/ui/badge"
// import { Sparkles, Loader2, CreditCard } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"
// import { Elements, useStripe, useElements } from "@stripe/react-stripe-js"
// import { stripePromise } from "@/lib/stripe-client"

// type PaymentFormProps = {
//   onSuccess: () => void
//   onCancel: () => void
// }

// // Geolocation hook
// const useGeolocation = () => {
//   const [location, setLocation] = useState<{
//     latitude: number | null
//     longitude: number | null
//     error: string | null
//   }>({
//     latitude: null,
//     longitude: null,
//     error: null,
//   })

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setLocation({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//             error: null,
//           })
//         },
//         (error) => {
//           setLocation({
//             latitude: null,
//             longitude: null,
//             error: error.message,
//           })
//         },
//       )
//     } else {
//       setLocation({
//         latitude: null,
//         longitude: null,
//         error: "Geolocation is not supported by this browser.",
//       })
//     }
//   }, [])

//   return location
// }

// // Checkout form component
// const CheckoutForm = ({ onSuccess, onCancel }: PaymentFormProps) => {
//   const { toast } = useToast()
//   const stripe = useStripe()
//   const elements = useElements()
//   const [isProcessing, setIsProcessing] = useState(false)
//   const [isComplete, setIsComplete] = useState(false)
//   const [plan, setPlan] = useState<"monthly" | "yearly">("monthly")
//   const [error, setError] = useState<string | null>(null)
//   const location = useGeolocation()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!stripe || !elements) {
//       // Stripe.js hasn't loaded yet
//       return
//     }

//     setIsProcessing(true)
//     setError(null)

//     try {
//       // Create checkout session
//       const response = await fetch("/api/stripe/create-checkout", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ plan }),
//       })

//       const { sessionId, error: sessionError } = await response.json()

//       if (sessionError) {
//         throw new Error(sessionError)
//       }

//       // Redirect to Stripe Checkout
//       const { error: redirectError } = await stripe.redirectToCheckout({
//         sessionId,
//       })

//       if (redirectError) {
//         throw new Error(redirectError.message)
//       }
//     } catch (err: any) {
//       setError(err.message || "An unexpected error occurred")
//       toast({
//         title: "Payment error",
//         description: err.message || "An unexpected error occurred",
//         variant: "destructive",
//         duration: 5000,
//       })
//     } finally {
//       setIsProcessing(false)
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-4 rounded-lg border border-purple-500/20">
//         <div className="flex items-center gap-3">
//           <div className="p-2 bg-purple-900/30 rounded-lg">
//             <Sparkles className="h-5 w-5 text-purple-400" />
//           </div>
//           <div>
//             <h4 className="font-medium text-purple-300">Unlock Premium Features</h4>
//             <p className="text-sm text-gray-400 mt-1">Get access to AI-powered templates and advanced features</p>
//           </div>
//         </div>
//       </div>

//       <RadioGroup value={plan} onValueChange={(value) => setPlan(value as "monthly" | "yearly")} className="space-y-3">
//         <div className="flex items-center justify-between bg-gray-900 p-3 rounded-lg">
//           <div className="flex items-center gap-3">
//             <RadioGroupItem id="monthly" value="monthly" className="text-purple-500" />
//             <div>
//               <Label htmlFor="monthly" className="font-medium text-white">
//                 Monthly
//               </Label>
//               <p className="text-sm text-gray-400">$9.99 per month</p>
//             </div>
//           </div>
//           <Badge className="bg-purple-900 text-purple-300">Popular</Badge>
//         </div>

//         <div className="flex items-center justify-between bg-gray-900 p-3 rounded-lg">
//           <div className="flex items-center gap-3">
//             <RadioGroupItem id="yearly" value="yearly" className="text-purple-500" />
//             <div>
//               <Label htmlFor="yearly" className="font-medium text-white">
//                 Yearly
//               </Label>
//               <p className="text-sm text-gray-400">$99.99 per year</p>
//             </div>
//           </div>
//           <Badge className="bg-green-900 text-green-300">Save 17%</Badge>
//         </div>
//       </RadioGroup>

//       {error && (
//         <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
//           <p className="text-sm text-red-400">{error}</p>
//         </div>
//       )}

//       <div className="pt-2">
//         <Button
//           type="submit"
//           disabled={isProcessing || !stripe}
//           className="w-full bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-6 flex items-center justify-center"
//         >
//           {isProcessing ? (
//             <>
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               Processing...
//             </>
//           ) : (
//             <>
//               <CreditCard className="mr-2 h-4 w-4" />
//               Proceed to Checkout
//             </>
//           )}
//         </Button>

//         <Button
//           type="button"
//           variant="ghost"
//           onClick={onCancel}
//           disabled={isProcessing}
//           className="w-full mt-2 text-gray-400"
//         >
//           Cancel
//         </Button>
//         <p className="text-xs text-center text-gray-500 mt-3">Cancel anytime. No questions asked.</p>
//       </div>
//     </form>
//   )
// }

// // Main payment form component with Stripe Elements
// const PaymentForm = (props: PaymentFormProps) => {
//   return (
//     <Elements stripe={stripePromise}>
//       <CheckoutForm {...props} />
//     </Elements>
//   )
// }

// export default PaymentForm

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Loader2, CheckCircle, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Elements, useStripe, useElements, CardElement, AddressElement } from "@stripe/react-stripe-js"
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
    country: string | null
    error: string | null
  }>({
    latitude: null,
    longitude: null,
    country: null,
    error: null,
  })

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Get country from coordinates using reverse geocoding
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`,
            )
            const data = await response.json()

            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              country: data.countryCode || null,
              error: null,
            })
          } catch (error) {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              country: null,
              error: "Could not determine country",
            })
          }
        },
        (error) => {
          setLocation({
            latitude: null,
            longitude: null,
            country: null,
            error: error.message,
          })
        },
      )
    } else {
      setLocation({
        latitude: null,
        longitude: null,
        country: null,
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
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const location = useGeolocation()
  const [cardholderName, setCardholderName] = useState("")

  // Create payment intent when component mounts
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plan,
          }),
        })

        const data = await response.json()

        if (data.error) {
          setError(data.error)
          return
        }

        setClientSecret(data.clientSecret)
      } catch (err: any) {
        setError("Failed to initialize payment. Please try again.")
        console.error("Error creating payment intent:", err)
      }
    }

    createPaymentIntent()
  }, [plan])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements || !clientSecret) {
      // Stripe.js hasn't loaded yet or client secret is missing
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Confirm the payment
      const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
        redirect: "if_required",
      })

      if (paymentError) {
        throw new Error(paymentError.message || "Payment failed")
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        // Payment succeeded
        setIsComplete(true)

        // Update subscription status via API
        await fetch("/api/stripe/update-subscription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            plan,
          }),
        })

        toast({
          title: "Payment successful",
          description: "Your account has been upgraded to PRO!",
          duration: 5000,
        })

        // Wait a moment to show success state before closing
        setTimeout(() => {
          onSuccess()
        }, 2000)
      } else {
        // Payment requires additional action or failed
        throw new Error("Payment processing failed. Please try again.")
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.")
      toast({
        title: "Payment failed",
        description: err.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Update payment intent when plan changes
  useEffect(() => {
    if (clientSecret) {
      const updatePaymentIntent = async () => {
        try {
          await fetch("/api/stripe/update-payment-intent", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              clientSecret,
              plan,
            }),
          })
        } catch (err) {
          console.error("Error updating payment intent:", err)
        }
      }

      updatePaymentIntent()
    }
  }, [plan, clientSecret])

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

      {/* Card Details Section */}
      {!isComplete && (
        <div className="space-y-3 pt-2">
          <h4 className="text-sm font-medium text-gray-300">Payment Details</h4>

          <div className="space-y-2">
            <div>
              <Label htmlFor="cardholderName" className="text-xs text-gray-400">
                Cardholder Name
              </Label>
              <input
                id="cardholderName"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-gray-900 border border-gray-800 rounded-md p-2 text-white text-sm"
                required
              />
            </div>

            <div>
              <Label htmlFor="card-element" className="text-xs text-gray-400">
                Card Details
              </Label>
              <div className="bg-gray-900 border border-gray-800 rounded-md p-3">
                {clientSecret ? (
                  <CardElement
                    id="card-element"
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#ffffff",
                          "::placeholder": {
                            color: "#aab7c4",
                          },
                        },
                        invalid: {
                          color: "#fa755a",
                          iconColor: "#fa755a",
                        },
                      },
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="address-element" className="text-xs text-gray-400">
                Billing Address
              </Label>
              <div className="bg-gray-900 border border-gray-800 rounded-md p-3">
                {clientSecret ? (
                  <AddressElement
                    id="address-element"
                    options={{
                      mode: "billing",
                      defaultValues: {
                        name: cardholderName,
                        address: {
                          country: location.country || "United States",
                        },
                      },
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="pt-2">
        {isComplete ? (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="bg-green-900/30 p-3 rounded-full mb-3">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <h4 className="font-medium text-green-300 text-lg">Payment Successful!</h4>
            <p className="text-sm text-gray-400 text-center mt-1">Your account has been upgraded to PRO</p>
          </div>
        ) : (
          <Button
            type="submit"
            disabled={isProcessing || !stripe || !elements || !clientSecret}
            className="w-full bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-6 flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Pay {plan === "monthly" ? "$9.99" : "$99.99"}
              </>
            )}
          </Button>
        )}

        {!isComplete && (
          <>
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={isProcessing}
              className="w-full mt-2 text-gray-400"
            >
              Cancel
            </Button>
            <div className="flex items-center justify-center mt-3">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Lock className="h-3 w-3" />
                <span>Secure payment powered by Stripe</span>
              </div>
            </div>
            <p className="text-xs text-center text-gray-500 mt-1">Cancel anytime. No questions asked.</p>
          </>
        )}
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
