// "use client"

// import { useState } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { Button } from "@/components/ui/button"
// import PaymentForm from "./payment-form"

// type PaymentPopupProps = {
//   isOpen: boolean
//   onClose: () => void
//   onSuccess: () => void
// }

// const PaymentPopup = ({ isOpen, onClose, onSuccess }: PaymentPopupProps) => {
//   const [paymentComplete, setPaymentComplete] = useState(false)

//   const handlePaymentSuccess = () => {
//     setPaymentComplete(true)
//     onSuccess()
//     // Close the popup after a short delay
//     setTimeout(() => {
//       onClose()
//       // Reset state for next time
//       setPaymentComplete(false)
//     }, 2000)
//   }

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
//           onClick={onClose}
//         >
//           <motion.div
//             initial={{ scale: 0.95, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.95, opacity: 0 }}
//             className="bg-black border border-gray-800 rounded-xl p-6 max-w-md w-full shadow-xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-start mb-4">
//               <h3 className="text-xl font-bold text-white">Upgrade to PRO</h3>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="h-8 w-8 rounded-full"
//                 onClick={onClose}
//                 disabled={paymentComplete}
//               >
//                 <span className="sr-only">Close</span>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="18"
//                   height="18"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   className="lucide lucide-x"
//                 >
//                   <path d="M18 6 6 18" />
//                   <path d="m6 6 12 12" />
//                 </svg>
//               </Button>
//             </div>

//             <PaymentForm onSuccess={handlePaymentSuccess} onCancel={onClose} />
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
import { X, CreditCard, MessageSquare, Building, CheckCircle, Loader2 } from "lucide-react"
import { Elements, CardElement, useStripe, useElements, AddressElement } from "@stripe/react-stripe-js"
import { stripePromise } from "@/lib/stripe-client"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

type PaymentPopupProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  currentPlan?: "free" | "pro" | "team" | "enterprise"
}

// Available plans
const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    features: ["5 templates", "Basic analytics", "1 user"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$9.99",
    period: "per month",
    features: ["Unlimited templates", "AI-powered responses", "Advanced analytics", "1 user"],
  },
  {
    id: "team",
    name: "Team",
    price: "$49.99",
    period: "per month",
    features: ["Everything in Pro", "Team collaboration", "Up to 5 users", "Priority support"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    features: ["Everything in Team", "Unlimited users", "Dedicated support", "Custom integrations"],
  },
]

// Card form component
const CardForm = ({
  onSubmit,
  onBack,
  isProcessing,
  plan,
}: {
  onSubmit: () => void
  onBack: () => void
  isProcessing: boolean
  plan: (typeof PLANS)[number]
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [cardholderName, setCardholderName] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setError(null)

    // In a real implementation, you would process the payment here
    onSubmit()
  }

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold text-white">Complete your upgrade</h3>
        <p className="text-sm text-gray-400">
          Upgrading to {plan.name} plan ({plan.price} {plan.period})
        </p>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <label htmlFor="cardholder-name" className="text-sm font-medium text-gray-300">
            Cardholder Name
          </label>
          <input
            id="cardholder-name"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            className="w-full h-10 px-3 bg-gray-900 border border-gray-800 rounded-md text-white"
            placeholder="John Doe"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="card-element" className="text-sm font-medium text-gray-300">
            Card Details
          </label>
          <div className="p-3 bg-gray-900 border border-gray-800 rounded-md">
            <CardElement
              id="card-element"
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#ffffff",
                    "::placeholder": {
                      color: "#aaaaaa",
                    },
                  },
                  invalid: {
                    color: "#ef4444",
                    iconColor: "#ef4444",
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="address-element" className="text-sm font-medium text-gray-300">
            Billing Address
          </label>
          <div className="p-3 bg-gray-900 border border-gray-800 rounded-md">
            <AddressElement
              id="address-element"
              options={{
                mode: "billing",
                defaultValues: {
                  name: cardholderName,
                },
                fields: {
                  phone: "never",
                },
                validation: {
                  phone: {
                    required: "never",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {error && <div className="p-3 bg-red-950 border border-red-900 rounded-md text-sm text-red-400">{error}</div>}

      <div className="flex items-center justify-between pt-2 space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isProcessing}
          className="flex-1 bg-transparent text-white border-gray-700 hover:bg-gray-900 hover:text-white"
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={isProcessing || !stripe || !elements}
          className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
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

      <div className="flex items-center justify-center">
        <p className="text-xs text-gray-500">You can cancel your subscription anytime from your account settings.</p>
      </div>
    </motion.form>
  )
}

// Main payment popup component
const PaymentPopup = ({ isOpen, onClose, onSuccess, currentPlan = "free" }: PaymentPopupProps) => {
  const [selectedPlan, setSelectedPlan] = useState<(typeof PLANS)[number] | null>(null)
  const [showCardForm, setShowCardForm] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const { toast } = useToast()

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
      // Downgrade to free
      toast({
        title: "Downgrade to Free",
        description: "Please contact support to downgrade your plan.",
        duration: 3000,
      })
      return
    }

    // Show card form for paid plans
    setShowCardForm(true)
  }

  const handleSubmitPayment = async () => {
    if (!selectedPlan) return

    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setIsComplete(true)

      // Wait a moment to show success state
      setTimeout(() => {
        onSuccess()
        // Reset state
        setShowCardForm(false)
        setSelectedPlan(null)
        setIsComplete(false)
        onClose()
      }, 2000)
    }, 2000)
  }

  const handleReset = () => {
    setShowCardForm(false)
    setSelectedPlan(null)
    setIsComplete(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-black border border-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4"
          >
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">
                  {isComplete ? "Subscription Activated" : showCardForm ? "Payment Details" : "Choose a Plan"}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-full h-8 w-8 text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>

              {isComplete ? (
                <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                  <div className="bg-blue-900/20 p-3 rounded-full">
                    <CheckCircle className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-medium text-white">Subscription Activated!</h3>
                  <p className="text-sm text-gray-400 max-w-xs">
                    Your account has been upgraded to the {selectedPlan?.name} plan. Enjoy the new features!
                  </p>
                </div>
              ) : showCardForm ? (
                <Elements stripe={stripePromise}>
                  <CardForm
                    onSubmit={handleSubmitPayment}
                    onBack={handleReset}
                    isProcessing={isProcessing}
                    plan={selectedPlan!}
                  />
                </Elements>
              ) : (
                <div>
                  <Tabs defaultValue="pro" className="w-full">
                    <TabsList className="w-full bg-gray-900 border-b border-gray-800 rounded-none p-0 h-auto">
                      {PLANS.map((plan) => (
                        <TabsTrigger
                          key={plan.id}
                          value={plan.id}
                          className={cn(
                            "flex-1 rounded-none border-b-2 border-transparent px-3 py-2 data-[state=active]:border-blue-500 data-[state=active]:text-white data-[state=active]:bg-transparent text-sm",
                            plan.id === currentPlan && "text-gray-500",
                          )}
                          disabled={plan.id === currentPlan}
                        >
                          {plan.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {PLANS.map((plan) => (
                      <TabsContent key={plan.id} value={plan.id} className="pt-4">
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <div className="flex items-baseline">
                              <span className="text-2xl font-bold text-white">{plan.price}</span>
                              {plan.period && <span className="ml-1 text-sm text-gray-400">{plan.period}</span>}
                            </div>
                            <p className="text-sm text-gray-400">
                              {plan.id === "free"
                                ? "Basic features for personal use"
                                : plan.id === "pro"
                                  ? "Advanced features for power users"
                                  : plan.id === "team"
                                    ? "Perfect for small teams"
                                    : "Custom solutions for large organizations"}
                            </p>
                          </div>

                          <div className="space-y-2">
                            {plan.features.map((feature, i) => (
                              <div key={i} className="flex items-center text-sm">
                                <CheckCircle className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                                <span className="text-gray-300">{feature}</span>
                              </div>
                            ))}
                          </div>

                          <Button
                            onClick={() => handlePlanSelect(plan)}
                            disabled={plan.id === currentPlan}
                            className={cn(
                              "w-full",
                              plan.id === "enterprise"
                                ? "bg-gray-800 hover:bg-gray-700 text-white"
                                : "bg-blue-600 hover:bg-blue-700 text-white",
                              plan.id === currentPlan && "bg-gray-800 opacity-50 cursor-not-allowed",
                            )}
                          >
                            {plan.id === currentPlan ? (
                              "Current Plan"
                            ) : plan.id === "free" ? (
                              "Downgrade"
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
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
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
