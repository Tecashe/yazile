
// "use client"

// import type React from "react"

// import { useState } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
// import { X, CreditCard, MessageSquare, Building, CheckCircle, Loader2 } from 'lucide-react'
// import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
// import { stripePromise } from "@/lib/stripe-client"
// import { useToast } from "@/hooks/use-toast"
// import { cn } from "@/lib/utils"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { useSubscription } from "@/contexts/subscription-context"

// type PaymentPopupProps = {
//   isOpen: boolean
//   onClose: () => void
//   onSuccess: () => void
// }

// // Available plans
// const PLANS = [
//   {
//     id: "free",
//     name: "Free",
//     price: "$0",
//     period: "forever",
//     features: ["5 templates", "Basic analytics", "1 user"],
//   },
//   {
//     id: "pro",
//     name: "Pro",
//     price: "$9.99",
//     period: "per month",
//     features: ["Unlimited templates", "AI-powered responses", "Advanced analytics", "1 user"],
//   },
//   {
//     id: "team",
//     name: "Team",
//     price: "$49.99",
//     period: "per month",
//     features: ["Everything in Pro", "Team collaboration", "Up to 5 users", "Priority support"],
//   },
//   {
//     id: "enterprise",
//     name: "Enterprise",
//     price: "Custom",
//     period: "",
//     features: ["Everything in Team", "Unlimited users", "Dedicated support", "Custom integrations"],
//   },
// ]

// // List of countries
// const COUNTRIES = [
//   { code: "US", name: "United States" },
//   { code: "CA", name: "Canada" },
//   { code: "GB", name: "United Kingdom" },
//   { code: "AU", name: "Australia" },
//   { code: "DE", name: "Germany" },
//   { code: "FR", name: "France" },
//   { code: "JP", name: "Japan" },
//   { code: "IN", name: "India" },
//   { code: "BR", name: "Brazil" },
//   { code: "ZA", name: "South Africa" },
// ].sort((a, b) => a.name.localeCompare(b.name))

// // Card form component
// const CardForm = ({
//   onSubmit,
//   onBack,
//   isProcessing,
//   setIsProcessing,
//   plan,
// }: {
//   onSubmit: (paymentData: { paymentMethodId: string; cardholderName: string; country: string }) => void
//   onBack: () => void
//   isProcessing: boolean
//   setIsProcessing: (value: boolean) => void
//   plan: (typeof PLANS)[number]
// }) => {
//   const stripe = useStripe()
//   const elements = useElements()
//   const [cardholderName, setCardholderName] = useState("")
//   const [country, setCountry] = useState("")
//   const [error, setError] = useState<string | null>(null)
//   const { toast } = useToast()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!stripe || !elements) {
//       return
//     }

//     if (!cardholderName.trim()) {
//       setError("Please enter the cardholder name")
//       return
//     }

//     if (!country) {
//       setError("Please select your country")
//       return
//     }

//     const cardElement = elements.getElement(CardElement)
//     if (!cardElement) {
//       setError("Card element not found")
//       return
//     }

//     setError(null)
//     setIsProcessing(true)

//     try {
//       // Create a payment method
//       const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
//         type: "card",
//         card: cardElement,
//         billing_details: {
//           name: cardholderName,
//           address: {
//             country,
//           },
//         },
//       })

//       if (paymentMethodError) {
//         throw new Error(paymentMethodError.message || "Failed to process your card")
//       }

//       if (!paymentMethod) {
//         throw new Error("No payment method returned")
//       }

//       // Pass the payment method ID to the parent component
//       onSubmit({
//         paymentMethodId: paymentMethod.id,
//         cardholderName,
//         country,
//       })
//     } catch (err: any) {
//       setError(err.message || "An unexpected error occurred")
//       setIsProcessing(false)
//       toast({
//         title: "Payment failed",
//         description: err.message || "An error occurred while processing your payment",
//         variant: "destructive",
//       })
//     }
//   }

//   return (
//     <motion.form
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       onSubmit={handleSubmit}
//       className="space-y-4"
//     >
//       <div className="space-y-1.5">
//         <h3 className="text-lg font-semibold text-white">Complete your upgrade</h3>
//         <p className="text-sm text-gray-400">
//           Upgrading to {plan.name} plan ({plan.price} {plan.period})
//         </p>
//       </div>

//       <div className="space-y-3">
//         <div className="space-y-1.5">
//           <label htmlFor="cardholder-name" className="text-sm font-medium text-gray-300">
//             Cardholder Name
//           </label>
//           <input
//             id="cardholder-name"
//             value={cardholderName}
//             onChange={(e) => setCardholderName(e.target.value)}
//             className="w-full h-10 px-3 bg-black border border-gray-700 rounded-md text-white"
//             placeholder="John Doe"
//             required
//           />
//         </div>

//         <div className="space-y-1.5">
//           <label htmlFor="country" className="text-sm font-medium text-gray-300">
//             Country
//           </label>
//           <Select value={country} onValueChange={setCountry}>
//             <SelectTrigger id="country" className="w-full h-10 bg-black border-gray-700 text-white">
//               <SelectValue placeholder="Select your country" />
//             </SelectTrigger>
//             <SelectContent className="bg-black border border-gray-700 text-white">
//               {COUNTRIES.map((country) => (
//                 <SelectItem key={country.code} value={country.code} className="text-white hover:bg-gray-900">
//                   {country.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="space-y-1.5">
//           <label htmlFor="card-element" className="text-sm font-medium text-gray-300">
//             Card Details
//           </label>
//           <div className="p-3 bg-black border border-gray-700 rounded-md">
//             <CardElement
//               id="card-element"
//               options={{
//                 style: {
//                   base: {
//                     fontSize: "16px",
//                     color: "#ffffff",
//                     "::placeholder": {
//                       color: "#aaaaaa",
//                     },
//                     iconColor: "#ffffff",
//                   },
//                   invalid: {
//                     color: "#ef4444",
//                     iconColor: "#ef4444",
//                   },
//                 },
//                 hidePostalCode: true,
//               }}
//             />
//           </div>
//         </div>
//       </div>

//       {error && <div className="p-3 bg-red-950 border border-red-900 rounded-md text-sm text-red-400">{error}</div>}

//       <div className="flex items-center justify-between pt-2 space-x-3">
//         <Button
//           type="button"
//           variant="outline"
//           onClick={onBack}
//           disabled={isProcessing}
//           className="flex-1 bg-transparent text-white border-gray-700 hover:bg-gray-900 hover:text-white"
//         >
//           Back
//         </Button>
//         <Button
//           type="submit"
//           disabled={isProcessing || !stripe || !elements}
//           className="flex-1 bg-white text-black hover:bg-gray-200"
//         >
//           {isProcessing ? (
//             <>
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               Processing...
//             </>
//           ) : (
//             <>
//               <CreditCard className="mr-2 h-4 w-4" />
//               Pay {plan.price}
//             </>
//           )}
//         </Button>
//       </div>

//       <div className="flex items-center justify-center">
//         <p className="text-xs text-gray-500">You can cancel your subscription anytime from your account settings.</p>
//       </div>
//     </motion.form>
//   )
// }

// // Main payment popup component
// const PaymentPopup = ({ isOpen, onClose, onSuccess }: PaymentPopupProps) => {
//   const [selectedPlan, setSelectedPlan] = useState<(typeof PLANS)[number] | null>(null)
//   const [showCardForm, setShowCardForm] = useState(false)
//   const [isProcessing, setIsProcessing] = useState(false)
//   const [isComplete, setIsComplete] = useState(false)
//   const { toast } = useToast()
//   const { subscription, refetchSubscription } = useSubscription()

//   // Determine current plan
//   const currentPlan = subscription?.plan.toLowerCase() || "free"

//   const handlePlanSelect = (plan: (typeof PLANS)[number]) => {
//     setSelectedPlan(plan)

//     if (plan.id === "enterprise") {
//       // Contact sales for enterprise plan
//       window.open("mailto:sales@example.com?subject=Enterprise Plan Inquiry", "_blank")
//       return
//     }

//     if (plan.id === currentPlan) {
//       // User is already on this plan
//       toast({
//         title: "You're already on this plan",
//         description: `You are currently on the ${plan.name} plan.`,
//         duration: 3000,
//       })
//       return
//     }

//     if (plan.id === "free") {
//       // For downgrading to free, redirect to billing portal
//       handleManageSubscription()
//       return
//     }

//     // Show card form for paid plans
//     setShowCardForm(true)
//   }

//   const handleManageSubscription = async () => {
//     try {
//       const response = await fetch("/api/subscriptions/manage")
//       const data = await response.json()
      
//       if (!data.success) {
//         throw new Error(data.error || "Failed to create billing portal session")
//       }
      
//       // Redirect to Stripe Billing Portal
//       window.location.href = data.url
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "An error occurred",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleSubmitPayment = async (paymentData: { paymentMethodId: string; cardholderName: string; country: string }) => {
//     if (!selectedPlan) return

//     try {
//       // Call API to create subscription
//       const response = await fetch("/api/subscriptions/create", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           plan: selectedPlan.id,
//           ...paymentData,
//         }),
//       })

//       const data = await response.json()

//       if (!data.success) {
//         throw new Error(data.error || "Failed to create subscription")
//       }

//       // Show success state
//       setIsComplete(true)

//       // Refetch subscription data
//       await refetchSubscription()

//       // Wait a moment to show success state
//       setTimeout(() => {
//         onSuccess()
//         // Reset state
//         setShowCardForm(false)
//         setSelectedPlan(null)
//         setIsComplete(false)
//         onClose()
//       }, 2000)
//     } catch (error: any) {
//       toast({
//         title: "Subscription failed",
//         description: error.message || "An error occurred while creating your subscription",
//         variant: "destructive",
//         duration: 5000,
//       })
//       setIsProcessing(false)
//     }
//   }

//   const handleReset = () => {
//     setShowCardForm(false)
//     setSelectedPlan(null)
//     setIsComplete(false)
//     setIsProcessing(false)
//   }

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
//           onClick={onClose}
//         >
//           <motion.div
//             initial={{ scale: 0.95, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.95, opacity: 0 }}
//             onClick={(e) => e.stopPropagation()}
//             className="bg-black border border-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4"
//           >
//             <div className="p-5 max-h-[90vh] overflow-y-auto">
//               <div className="flex justify-between items-center mb-4 sticky top-0 bg-black z-10 pb-2">
//                 <h2 className="text-xl font-bold text-white">
//                   {isComplete ? "Subscription Activated" : showCardForm ? "Payment Details" : "Choose a Plan"}
//                 </h2>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={onClose}
//                   className="rounded-full h-8 w-8 text-gray-400 hover:text-white"
//                 >
//                   <X className="h-4 w-4" />
//                   <span className="sr-only">Close</span>
//                 </Button>
//               </div>

//               {isComplete ? (
//                 <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
//                   <div className="bg-gray-900 p-3 rounded-full">
//                     <CheckCircle className="h-8 w-8 text-white" />
//                   </div>
//                   <h3 className="text-lg font-medium text-white">Subscription Activated!</h3>
//                   <p className="text-sm text-gray-400 max-w-xs">
//                     Your account has been upgraded to the {selectedPlan?.name} plan. Enjoy the new features!
//                   </p>
//                 </div>
//               ) : showCardForm ? (
//                 <Elements stripe={stripePromise}>
//                   <CardForm
//                     onSubmit={handleSubmitPayment}
//                     onBack={handleReset}
//                     isProcessing={isProcessing}
//                     setIsProcessing={setIsProcessing}
//                     plan={selectedPlan!}
//                   />
//                 </Elements>
//               ) : (
//                 <div>
//                   <Tabs defaultValue="pro" className="w-full">
//                     <TabsList className="w-full bg-gray-900 border-b border-gray-800 rounded-none p-0 h-auto sticky top-[60px] z-10">
//                       {PLANS.map((plan) => (
//                         <TabsTrigger
//                           key={plan.id}
//                           value={plan.id}
//                           className={cn(
//                             "flex-1 rounded-none border-b-2 border-transparent px-3 py-2 data-[state=active]:border-white data-[state=active]:text-white data-[state=active]:bg-transparent text-sm",
//                             plan.id === currentPlan && "text-gray-500",
//                           )}
//                           disabled={plan.id === currentPlan}
//                         >
//                           {plan.name}
//                         </TabsTrigger>
//                       ))}
//                     </TabsList>

//                     {PLANS.map((plan) => (
//                       <TabsContent key={plan.id} value={plan.id} className="pt-4">
//                         <div className="space-y-4">
//                           <div className="space-y-1">
//                             <div className="flex items-baseline">
//                               <span className="text-2xl font-bold text-white">{plan.price}</span>
//                               {plan.period && <span className="ml-1 text-sm text-gray-400">{plan.period}</span>}
//                             </div>
//                             <p className="text-sm text-gray-400">
//                               {plan.id === "free"
//                                 ? "Basic features for personal use"
//                                 : plan.id === "pro"
//                                   ? "Advanced features for power users"
//                                   : plan.id === "team"
//                                     ? "Perfect for small teams"
//                                     : "Custom solutions for large organizations"}
//                             </p>
//                           </div>

//                           <div className="space-y-2">
//                             {plan.features.map((feature, i) => (
//                               <div key={i} className="flex items-center text-sm">
//                                 <CheckCircle className="h-4 w-4 text-white mr-2 flex-shrink-0" />
//                                 <span className="text-gray-300">{feature}</span>
//                               </div>
//                             ))}
//                           </div>

//                           <Button
//                             onClick={() => handlePlanSelect(plan)}
//                             disabled={plan.id === currentPlan}
//                             className={cn(
//                               "w-full",
//                               plan.id === "enterprise"
//                                 ? "bg-gray-900 hover:bg-gray-800 text-white"
//                                 : "bg-white hover:bg-gray-200 text-black",
//                               plan.id === currentPlan && "bg-gray-900 opacity-50 cursor-not-allowed",
//                             )}
//                           >
//                             {plan.id === currentPlan ? (
//                               "Current Plan"
//                             ) : plan.id === "free" ? (
//                               "Downgrade"
//                             ) : plan.id === "enterprise" ? (
//                               <>
//                                 <MessageSquare className="mr-2 h-4 w-4" />
//                                 Contact Sales
//                               </>
//                             ) : (
//                               <>
//                                 <Building className="mr-2 h-4 w-4" />
//                                 Upgrade to {plan.name}
//                               </>
//                             )}
//                           </Button>
//                         </div>
//                       </TabsContent>
//                     ))}
//                   </Tabs>

//                   {subscription && subscription.plan !== "FREE" && (
//                     <div className="mt-6 pt-4 border-t border-gray-800">
//                       <Button
//                         onClick={handleManageSubscription}
//                         variant="outline"
//                         className="w-full bg-transparent text-white border-gray-700 hover:bg-gray-900"
//                       >
//                         Manage Current Subscription
//                       </Button>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   )
// }

// export default PaymentPopup


"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { X, CreditCard, MessageSquare, Building, CheckCircle, Loader2, Crown, Zap, Users } from 'lucide-react'
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { stripePromise } from "@/lib/stripe-client"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSubscription } from "@/contexts/subscription-context"

type PaymentPopupProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

// Available plans with icons
const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    icon: CheckCircle,
    features: ["5 templates", "Basic analytics", "1 user"],
    description: "Perfect for getting started",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$9.99",
    period: "per month",
    icon: Zap,
    features: ["Unlimited templates", "AI-powered responses", "Advanced analytics", "1 user"],
    description: "For power users and professionals",
  },
  {
    id: "team",
    name: "Team",
    price: "$49.99",
    period: "per month",
    icon: Users,
    features: ["Everything in Pro", "Team collaboration", "Up to 5 users", "Priority support"],
    description: "Built for growing teams",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    icon: Crown,
    features: ["Everything in Team", "Unlimited users", "Dedicated support", "Custom integrations"],
    description: "Enterprise-grade solutions",
  },
]

// List of countries
const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" },
  { code: "ZA", name: "South Africa" },
].sort((a, b) => a.name.localeCompare(b.name))

// Card form component
const CardForm = ({
  onSubmit,
  onBack,
  isProcessing,
  setIsProcessing,
  plan,
}: {
  onSubmit: (paymentData: { paymentMethodId: string; cardholderName: string; country: string }) => void
  onBack: () => void
  isProcessing: boolean
  setIsProcessing: (value: boolean) => void
  plan: (typeof PLANS)[number]
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [cardholderName, setCardholderName] = useState("")
  const [country, setCountry] = useState("")
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    if (!cardholderName.trim()) {
      setError("Please enter the cardholder name")
      return
    }

    if (!country) {
      setError("Please select your country")
      return
    }

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setError("Card element not found")
      return
    }

    setError(null)
    setIsProcessing(true)

    try {
      // Create a payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: cardholderName,
          address: {
            country,
          },
        },
      })

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message || "Failed to process your card")
      }

      if (!paymentMethod) {
        throw new Error("No payment method returned")
      }

      // Pass the payment method ID to the parent component
      onSubmit({
        paymentMethodId: paymentMethod.id,
        cardholderName,
        country,
      })
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
      setIsProcessing(false)
      toast({
        title: "Payment failed",
        description: err.message || "An error occurred while processing your payment",
        variant: "destructive",
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto bg-zinc-900 rounded-2xl flex items-center justify-center mb-4">
          <plan.icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-semibold text-white">Complete Your Upgrade</h3>
        <p className="text-zinc-400">
          You&apos;re upgrading to <span className="text-white font-medium">{plan.name}</span> plan
        </p>
        <div className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-900 rounded-full">
          <span className="text-2xl font-bold text-white">{plan.price}</span>
          {plan.period && <span className="text-sm text-zinc-400">/{plan.period.replace('per ', '')}</span>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Fields */}
        <div className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="cardholder-name" className="text-sm font-medium text-zinc-300">
              Cardholder Name
            </label>
            <input
              id="cardholder-name"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              className="w-full h-12 px-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:border-zinc-600 focus:outline-none transition-colors"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="country" className="text-sm font-medium text-zinc-300">
              Country
            </label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger id="country" className="w-full h-12 bg-zinc-900 border-zinc-800 text-white rounded-xl focus:border-zinc-600">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-white rounded-xl">
                {COUNTRIES.map((country) => (
                  <SelectItem 
                    key={country.code} 
                    value={country.code} 
                    className="text-white hover:bg-zinc-800 focus:bg-zinc-800 rounded-lg"
                  >
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="card-element" className="text-sm font-medium text-zinc-300">
              Card Details
            </label>
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
              <CardElement
                id="card-element"
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#ffffff",
                      fontFamily: "system-ui, sans-serif",
                      "::placeholder": {
                        color: "#71717a",
                      },
                      iconColor: "#ffffff",
                    },
                    invalid: {
                      color: "#ef4444",
                      iconColor: "#ef4444",
                    },
                  },
                  hidePostalCode: true,
                }}
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-950/50 border border-red-900/50 rounded-xl text-sm text-red-400"
          >
            {error}
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isProcessing}
            className="flex-1 h-12 bg-transparent text-zinc-300 border-zinc-800 hover:bg-zinc-900 hover:text-white rounded-xl transition-colors"
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={isProcessing || !stripe || !elements}
            className="flex-1 h-12 bg-white text-black hover:bg-zinc-200 rounded-xl font-medium transition-colors"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pay {plan.price}
              </>
            )}
          </Button>
        </div>

        {/* Security Note */}
        <p className="text-xs text-zinc-500 text-center">
          🔒 Payments are secured by Stripe. Cancel anytime from your account settings.
        </p>
      </form>
    </motion.div>
  )
}

// Main payment popup component
const PaymentPopup = ({ isOpen, onClose, onSuccess }: PaymentPopupProps) => {
  const [selectedPlan, setSelectedPlan] = useState<(typeof PLANS)[number] | null>(null)
  const [showCardForm, setShowCardForm] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const { toast } = useToast()
  const { subscription, refetchSubscription } = useSubscription()

  // Determine current plan
  const currentPlan = subscription?.plan.toLowerCase() || "free"

  const handlePlanSelect = (plan: (typeof PLANS)[number]) => {
    setSelectedPlan(plan)

    if (plan.id === "enterprise") {
      // Contact sales for enterprise plan
      window.open("mailto:sales@example.com?subject=Enterprise Plan Inquiry", "_blank")
      return
    }

    if (plan.id === currentPlan) {
      // User is already on this plan
      toast({
        title: "You're already on this plan",
        description: `You are currently on the ${plan.name} plan.`,
        duration: 3000,
      })
      return
    }

    if (plan.id === "free") {
      // For downgrading to free, redirect to billing portal
      handleManageSubscription()
      return
    }

    // Show card form for paid plans
    setShowCardForm(true)
  }

  const handleManageSubscription = async () => {
    try {
      const response = await fetch("/api/subscriptions/manage")
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || "Failed to create billing portal session")
      }
      
      // Redirect to Stripe Billing Portal
      window.location.href = data.url
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      })
    }
  }

  const handleSubmitPayment = async (paymentData: { paymentMethodId: string; cardholderName: string; country: string }) => {
    if (!selectedPlan) return

    try {
      // Call API to create subscription
      const response = await fetch("/api/subscriptions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: selectedPlan.id,
          ...paymentData,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to create subscription")
      }

      // Show success state
      setIsComplete(true)

      // Refetch subscription data
      await refetchSubscription()

      // Wait a moment to show success state
      setTimeout(() => {
        onSuccess()
        // Reset state
        setShowCardForm(false)
        setSelectedPlan(null)
        setIsComplete(false)
        onClose()
      }, 2000)
    } catch (error: any) {
      toast({
        title: "Subscription failed",
        description: error.message || "An error occurred while creating your subscription",
        variant: "destructive",
        duration: 5000,
      })
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setShowCardForm(false)
    setSelectedPlan(null)
    setIsComplete(false)
    setIsProcessing(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
          >
            <div className="p-8 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white">
                  {isComplete ? "Welcome to Pro!" : showCardForm ? "Payment" : "Choose Your Plan"}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-full h-10 w-10 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Success State */}
              {isComplete ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-12 text-center space-y-6"
                >
                  <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold text-white">Subscription Activated!</h3>
                    <p className="text-zinc-400 max-w-sm">
                      Your account has been upgraded to <span className="text-white font-medium">{selectedPlan?.name}</span>. 
                      All new features are now available.
                    </p>
                  </div>
                </motion.div>
              ) : showCardForm ? (
                /* Card Form */
                <Elements stripe={stripePromise}>
                  <CardForm
                    onSubmit={handleSubmitPayment}
                    onBack={handleReset}
                    isProcessing={isProcessing}
                    setIsProcessing={setIsProcessing}
                    plan={selectedPlan!}
                  />
                </Elements>
              ) : (
                /* Plan Selection */
                <div className="space-y-6">
                  <Tabs defaultValue="pro" className="w-full">
                    <TabsList className="w-full bg-zinc-900 rounded-xl p-1 mb-6 grid grid-cols-4">
                      {PLANS.map((plan) => (
                        <TabsTrigger
                          key={plan.id}
                          value={plan.id}
                          className={cn(
                            "rounded-lg data-[state=active]:bg-white data-[state=active]:text-black text-zinc-400 font-medium transition-all",
                            plan.id === currentPlan && "opacity-50",
                          )}
                          disabled={plan.id === currentPlan}
                        >
                          {plan.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {PLANS.map((plan) => (
                      <TabsContent key={plan.id} value={plan.id} className="space-y-6">
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-center space-y-4"
                        >
                          <div className="w-16 h-16 mx-auto bg-zinc-900 rounded-2xl flex items-center justify-center">
                            <plan.icon className="w-8 h-8 text-white" />
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-4xl font-bold text-white">{plan.price}</span>
                              {plan.period && <span className="text-zinc-400">/{plan.period.replace('per ', '')}</span>}
                            </div>
                            <p className="text-zinc-400">{plan.description}</p>
                          </div>
                        </motion.div>

                        <div className="space-y-3">
                          {plan.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-xl">
                              <CheckCircle className="h-5 w-5 text-white flex-shrink-0" />
                              <span className="text-zinc-300">{feature}</span>
                            </div>
                          ))}
                        </div>

                        <Button
                          onClick={() => handlePlanSelect(plan)}
                          disabled={plan.id === currentPlan}
                          className={cn(
                            "w-full h-12 rounded-xl font-medium transition-all",
                            plan.id === "enterprise"
                              ? "bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800"
                              : "bg-white hover:bg-zinc-200 text-black",
                            plan.id === currentPlan && "bg-zinc-900 opacity-50 cursor-not-allowed border border-zinc-800",
                          )}
                        >
                          {plan.id === currentPlan ? (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Current Plan
                            </>
                          ) : plan.id === "free" ? (
                            "Downgrade to Free"
                          ) : plan.id === "enterprise" ? (
                            <>
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Contact Sales
                            </>
                          ) : (
                            <>
                              <Building className="mr-2 h-4 w-4" />
                              Upgrade to {plan.name}
                            </>
                          )}
                        </Button>
                      </TabsContent>
                    ))}
                  </Tabs>

                  {/* Manage Subscription */}
                  {subscription && subscription.plan !== "FREE" && (
                    <div className="pt-6 border-t border-zinc-800">
                      <Button
                        onClick={handleManageSubscription}
                        variant="outline"
                        className="w-full h-12 bg-transparent text-zinc-300 border-zinc-800 hover:bg-zinc-900 hover:text-white rounded-xl transition-colors"
                      >
                        Manage Current Subscription
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PaymentPopup