//FOR STRIPE

// "use client"

// import type React from "react"

// import { useState } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
// import { X, CreditCard, MessageSquare, Building, CheckCircle, Loader2, Crown, Zap, Users } from 'lucide-react'
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

// // Available plans with icons
// const PLANS = [
//   {
//     id: "free",
//     name: "Free",
//     price: "$0",
//     period: "forever",
//     icon: CheckCircle,
//     features: ["5 automations", "Basic pre-written reply", "20 DMs automated replies/day"],
//     description: "Perfect for getting started",
//   },
//   {
//     id: "pro",
//     name: "Pro",
//     price: "$49.99",
//     period: "per month",
//     icon: Zap,
//     features: ["AI-powered Intelligent replies", "50 automations", "Detailed Sentiment Analysis","Lead Qualification and CRM intelligent syncing"],
//     description: "For power users and professionals",
//   },
//   {
//     id: "enterprise",
//     name: "Enterprise",
//     price: "Custom",
//     period: "",
//     icon: Crown,
//     features: ["Everything in Pro", "Unlimited automations", "Dedicated support", "Custom integrations"],
//     description: "Enterprise-grade solutions",
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
//     <motion.div
//       initial={{ opacity: 0, x: 20 }}
//       animate={{ opacity: 1, x: 0 }}
//       exit={{ opacity: 0, x: -20 }}
//       className="space-y-8"
//     >
//       {/* Header */}
//       <div className="text-center space-y-3">
//         {/* <div className="w-16 h-16 mx-auto bg-zinc-900 rounded-2xl flex items-center justify-center mb-4">
//           <plan.icon className="w-8 h-8 text-white" />
//         </div> */}
//         {/* <h3 className="text-2xl font-semibold text-white">Complete Your Upgrade</h3> */}
//         <p className="text-zinc-400">
//           You&apos;re upgrading to <span className="text-white font-medium">{plan.name}</span> plan
//         </p>
//         <div className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-900 rounded-full">
//           <span className="text-2xl font-bold text-white">{plan.price}</span>
//           {plan.period && <span className="text-sm text-zinc-400">/{plan.period.replace('per ', '')}</span>}
//         </div>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Form Fields */}
//         <div className="space-y-5">
//           <div className="space-y-2">
//             <label htmlFor="cardholder-name" className="text-sm font-medium text-zinc-300">
//               Cardholder Name
//             </label>
//             <input
//               id="cardholder-name"
//               value={cardholderName}
//               onChange={(e) => setCardholderName(e.target.value)}
//               className="w-full h-12 px-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:border-zinc-600 focus:outline-none transition-colors"
//               placeholder="Enter your full name"
//               required
//             />
//           </div>

//           <div className="space-y-2">
//             <label htmlFor="country" className="text-sm font-medium text-zinc-300">
//               Country
//             </label>
//             <Select value={country} onValueChange={setCountry}>
//               <SelectTrigger id="country" className="w-full h-12 bg-zinc-900 border-zinc-800 text-white rounded-xl focus:border-zinc-600">
//                 <SelectValue placeholder="Select your country" />
//               </SelectTrigger>
//               <SelectContent className="bg-zinc-900 border-zinc-800 text-white rounded-xl">
//                 {COUNTRIES.map((country) => (
//                   <SelectItem 
//                     key={country.code} 
//                     value={country.code} 
//                     className="text-white hover:bg-zinc-800 focus:bg-zinc-800 rounded-lg"
//                   >
//                     {country.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-2">
//             <label htmlFor="card-element" className="text-sm font-medium text-zinc-300">
//               Card Details
//             </label>
//             <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
//               <CardElement
//                 id="card-element"
//                 options={{
//                   style: {
//                     base: {
//                       fontSize: "16px",
//                       color: "#ffffff",
//                       fontFamily: "system-ui, sans-serif",
//                       "::placeholder": {
//                         color: "#71717a",
//                       },
//                       iconColor: "#ffffff",
//                     },
//                     invalid: {
//                       color: "#ef4444",
//                       iconColor: "#ef4444",
//                     },
//                   },
//                   hidePostalCode: true,
//                 }}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="p-4 bg-red-950/50 border border-red-900/50 rounded-xl text-sm text-red-400"
//           >
//             {error}
//           </motion.div>
//         )}

//         {/* Action Buttons */}
//         <div className="flex gap-3 pt-2">
//           <Button
//             type="button"
//             variant="outline"
//             onClick={onBack}
//             disabled={isProcessing}
//             className="flex-1 h-12 bg-transparent text-zinc-300 border-zinc-800 hover:bg-zinc-900 hover:text-white rounded-xl transition-colors"
//           >
//             Back
//           </Button>
//           <Button
//             type="submit"
//             disabled={isProcessing || !stripe || !elements}
//             className="flex-1 h-12 bg-white text-black hover:bg-zinc-200 rounded-xl font-medium transition-colors"
//           >
//             {isProcessing ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Processing...
//               </>
//             ) : (
//               <>
//                 <CreditCard className="mr-2 h-4 w-4" />
//                 Pay {plan.price}
//               </>
//             )}
//           </Button>
//         </div>

//         {/* Security Note */}
//         <p className="text-xs text-zinc-500 text-center">
//           🔒 Payments are secured by Stripe. Cancel anytime from your account settings.
//         </p>
//       </form>
//     </motion.div>
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
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
//           onClick={onClose}
//         >
//           <motion.div
//             initial={{ scale: 0.95, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.95, opacity: 0 }}
//             onClick={(e) => e.stopPropagation()}
//             className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
//           >
//             <div className="p-8 max-h-[90vh] overflow-y-auto">
//               {/* Header */}
//               <div className="flex justify-between items-center mb-8">
//                 <h2 className="text-2xl font-bold text-white">
//                   {isComplete ? "Welcome to Pro!" : showCardForm ? "Payment" : "Choose Your Plan"}
//                 </h2>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={onClose}
//                   className="rounded-full h-10 w-10 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
//                 >
//                   <X className="h-5 w-5" />
//                 </Button>
//               </div>

//               {/* Success State */}
//               {isComplete ? (
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="flex flex-col items-center justify-center py-12 text-center space-y-6"
//                 >
//                   <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center">
//                     <CheckCircle className="h-10 w-10 text-white" />
//                   </div>
//                   <div className="space-y-2">
//                     <h3 className="text-2xl font-semibold text-white">Subscription Activated!</h3>
//                     <p className="text-zinc-400 max-w-sm">
//                       Your account has been upgraded to <span className="text-white font-medium">{selectedPlan?.name}</span>. 
//                       All new features are now available.
//                     </p>
//                   </div>
//                 </motion.div>
//               ) : showCardForm ? (
//                 /* Card Form */
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
//                 /* Plan Selection */
//                 <div className="space-y-6">
//                   <Tabs defaultValue="pro" className="w-full">
//                     <TabsList className="w-full bg-zinc-900 rounded-xl p-1 mb-6 grid grid-cols-3">
//                       {PLANS.map((plan) => (
//                         <TabsTrigger
//                           key={plan.id}
//                           value={plan.id}
//                           className={cn(
//                             "rounded-lg data-[state=active]:bg-white data-[state=active]:text-black text-zinc-400 font-medium transition-all",
//                             plan.id === currentPlan && "opacity-50",
//                           )}
//                           disabled={plan.id === currentPlan}
//                         >
//                           {plan.name}
//                         </TabsTrigger>
//                       ))}
//                     </TabsList>

//                     {PLANS.map((plan) => (
//                       <TabsContent key={plan.id} value={plan.id} className="space-y-6">
//                         <motion.div 
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           className="text-center space-y-4"
//                         >
//                           <div className="w-16 h-16 mx-auto bg-zinc-900 rounded-2xl flex items-center justify-center">
//                             <plan.icon className="w-8 h-8 text-white" />
//                           </div>
                          
//                           <div className="space-y-2">
//                             <div className="flex items-center justify-center gap-2">
//                               <span className="text-4xl font-bold text-white">{plan.price}</span>
//                               {plan.period && <span className="text-zinc-400">/{plan.period.replace('per ', '')}</span>}
//                             </div>
//                             <p className="text-zinc-400">{plan.description}</p>
//                           </div>
//                         </motion.div>

//                         <div className="space-y-3">
//                           {plan.features.map((feature, i) => (
//                             <div key={i} className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-xl">
//                               <CheckCircle className="h-5 w-5 text-white flex-shrink-0" />
//                               <span className="text-zinc-300">{feature}</span>
//                             </div>
//                           ))}
//                         </div>

//                         <Button
//                           onClick={() => handlePlanSelect(plan)}
//                           disabled={plan.id === currentPlan}
//                           className={cn(
//                             "w-full h-12 rounded-xl font-medium transition-all",
//                             plan.id === "enterprise"
//                               ? "bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800"
//                               : "bg-white hover:bg-zinc-200 text-black",
//                             plan.id === currentPlan && "bg-zinc-900 opacity-50 cursor-not-allowed border border-zinc-800",
//                           )}
//                         >
//                           {plan.id === currentPlan ? (
//                             <>
//                               <CheckCircle className="mr-2 h-4 w-4" />
//                               Current Plan
//                             </>
//                           ) : plan.id === "free" ? (
//                             "Downgrade to Free"
//                           ) : plan.id === "enterprise" ? (
//                             <>
//                               <MessageSquare className="mr-2 h-4 w-4" />
//                               Contact Sales
//                             </>
//                           ) : (
//                             <>
//                               <Building className="mr-2 h-4 w-4" />
//                               Upgrade to {plan.name}
//                             </>
//                           )}
//                         </Button>
//                       </TabsContent>
//                     ))}
//                   </Tabs>

//                   {/* Manage Subscription */}
//                   {subscription && subscription.plan !== "FREE" && (
//                     <div className="pt-6 border-t border-zinc-800">
//                       <Button
//                         onClick={handleManageSubscription}
//                         variant="outline"
//                         className="w-full h-12 bg-transparent text-zinc-300 border-zinc-800 hover:bg-zinc-900 hover:text-white rounded-xl transition-colors"
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









// //FOR PESAPAL
// import { useState, useEffect } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
// import { X, CreditCard, MessageSquare, CheckCircle, Loader2, Crown, Zap, MapPin } from 'lucide-react'
// import { useToast } from "@/hooks/use-toast"
// import { cn } from "@/lib/utils"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { useSubscription } from "@/contexts/subscription-context"
// import { COUNTRIES, detectUserCountry, getCountryByCode } from "@/lib/countries"

// type PaymentPopupProps = {
//   isOpen: boolean
//   onClose: () => void
//   onSuccess: () => void
// }

// const PLANS = [
//   {
//     id: "free",
//     name: "Free",
//     price: "$0",
//     priceKES: "KES 0",
//     period: "forever",
//     icon: CheckCircle,
//     features: ["5 automations", "Basic pre-written reply", "20 DMs automated replies/day"],
//     description: "Perfect for getting started",
//   },
//   {
//     id: "pro",
//     name: "Pro",
//     price: "$1",
//     priceKES: "KES 100",
//     period: "per month",
//     icon: Zap,
//     features: ["AI-powered Intelligent replies", "50 automations", "Detailed Sentiment Analysis","Lead Qualification and CRM intelligent syncing"],
//     description: "For power users and professionals",
//   },
//   {
//     id: "enterprise",
//     name: "Enterprise",
//     price: "Custom",
//     priceKES: "Custom",
//     period: "",
//     icon: Crown,
//     features: ["Everything in Pro", "Unlimited automations", "Dedicated support", "Custom integrations"],
//     description: "Enterprise-grade solutions",
//   },
// ]

// const COUNTRIES_LIST = COUNTRIES

// const PaymentForm = ({
//   onSubmit,
//   onBack,
//   isProcessing,
//   plan,
// }: {
//   onSubmit: (data: { phone: string; country: string }) => void
//   onBack: () => void
//   isProcessing: boolean
//   plan: (typeof PLANS)[number]
// }) => {
//   const [phone, setPhone] = useState("")
//   const [country, setCountry] = useState("")
//   const [error, setError] = useState<string | null>(null)
//   const [isDetecting, setIsDetecting] = useState(true)

//   // Auto-detect country on mount
//   useEffect(() => {
//     detectCountry()
//   }, [])

//   const detectCountry = async () => {
//     setIsDetecting(true)
//     try {
//       const detectedCountry = await detectUserCountry()
//       setCountry(detectedCountry)
//     } catch (err) {
//       console.log("Could not detect country, using default")
//       setCountry("US")
//     } finally {
//       setIsDetecting(false)
//     }
//   }

//   const selectedCountry = getCountryByCode(country)

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!phone.trim()) {
//       setError("Please enter your phone number")
//       return
//     }

//     if (!country) {
//       setError("Please select your country")
//       return
//     }

//     setError(null)
//     onSubmit({ phone, country })
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, x: 20 }}
//       animate={{ opacity: 1, x: 0 }}
//       exit={{ opacity: 0, x: -20 }}
//       className="space-y-8"
//     >
//       <div className="text-center space-y-3">
//         <p className="text-zinc-400">
//           You&apos;re upgrading to <span className="text-white font-medium">{plan.name}</span> plan
//         </p>
//         <div className="space-y-2">
//           <div className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-900 rounded-full">
//             <span className="text-2xl font-bold text-white">{plan.price}</span>
//             {plan.period && <span className="text-sm text-zinc-400">/{plan.period.replace('per ', '')}</span>}
//           </div>
//           {plan.priceKES !== plan.price && (
//             <p className="text-xs text-zinc-500">
//               Equivalent to {plan.priceKES}
//             </p>
//           )}
//         </div>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="space-y-5">
//           <div className="space-y-2">
//             <label htmlFor="country" className="text-sm font-medium text-zinc-300">
//               Country
//             </label>
//             <Select value={country} onValueChange={setCountry} disabled={isDetecting}>
//               <SelectTrigger id="country" className="w-full h-12 bg-zinc-900 border-zinc-800 text-white rounded-xl">
//                 <SelectValue placeholder={isDetecting ? "🌍 Detecting your location..." : "Select your country"} />
//               </SelectTrigger>
//               <SelectContent className="bg-zinc-900 border-zinc-800 text-white rounded-xl max-h-[300px]">
//                 {COUNTRIES_LIST.map((c) => (
//                   <SelectItem 
//                     key={c.code} 
//                     value={c.code} 
//                     className="text-white hover:bg-zinc-800 focus:bg-zinc-800 rounded-lg"
//                   >
//                     {c.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             {isDetecting && (
//               <p className="text-xs text-zinc-400 flex items-center gap-1">
//                 <MapPin className="h-3 w-3 animate-pulse" />
//                 Auto-detecting your location...
//               </p>
//             )}
//           </div>

//           <div className="space-y-2">
//             <label htmlFor="phone" className="text-sm font-medium text-zinc-300">
//               Phone Number
//             </label>
//             <div className="relative">
//               {selectedCountry?.phoneCode && (
//                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">
//                   {selectedCountry.phoneCode}
//                 </span>
//               )}
//               <input
//                 id="phone"
//                 type="tel"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 className={cn(
//                   "w-full h-12 px-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:border-zinc-600 focus:outline-none transition-colors",
//                   selectedCountry?.phoneCode && "pl-20"
//                 )}
//                 placeholder={selectedCountry?.phoneCode ? "712345678" : "+1234567890"}
//                 required
//               />
//             </div>
//             <p className="text-xs text-zinc-500">
//               {selectedCountry?.phoneCode 
//                 ? `Enter your number without the country code (${selectedCountry.phoneCode})`
//                 : "Include your country code, e.g., +1234567890"
//               }
//             </p>
//           </div>
//         </div>

//         {error && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="p-4 bg-red-950/50 border border-red-900/50 rounded-xl text-sm text-red-400"
//           >
//             {error}
//           </motion.div>
//         )}

//         <div className="flex gap-3 pt-2">
//           <Button
//             type="button"
//             variant="outline"
//             onClick={onBack}
//             disabled={isProcessing}
//             className="flex-1 h-12 bg-transparent text-zinc-300 border-zinc-800 hover:bg-zinc-900 hover:text-white rounded-xl transition-colors"
//           >
//             Back
//           </Button>
//           <Button
//             type="submit"
//             disabled={isProcessing}
//             className="flex-1 h-12 bg-white text-black hover:bg-zinc-200 rounded-xl font-medium transition-colors"
//           >
//             {isProcessing ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Processing...
//               </>
//             ) : (
//               <>
//                 <CreditCard className="mr-2 h-4 w-4" />
//                 Continue to Payment
//               </>
//             )}
//           </Button>
//         </div>

//         <p className="text-xs text-zinc-500 text-center">
//           🔒 Payments are secured by Pesapal. You&apos;ll be redirected to complete payment.
//         </p>
//       </form>
//     </motion.div>
//   )
// }

// const PaymentPopup = ({ isOpen, onClose, onSuccess }: PaymentPopupProps) => {
//   const [selectedPlan, setSelectedPlan] = useState<(typeof PLANS)[number] | null>(null)
//   const [showPaymentForm, setShowPaymentForm] = useState(false)
//   const [isProcessing, setIsProcessing] = useState(false)
//   const { toast } = useToast()
//   const { subscription, refetchSubscription } = useSubscription()

//   const currentPlan = subscription?.plan.toLowerCase() || "free"

//   const handlePlanSelect = (plan: (typeof PLANS)[number]) => {
//     setSelectedPlan(plan)

//     if (plan.id === "enterprise") {
//       window.open("mailto:sales@example.com?subject=Enterprise Plan Inquiry", "_blank")
//       return
//     }

//     if (plan.id === currentPlan) {
//       toast({
//         title: "You're already on this plan",
//         description: `You are currently on the ${plan.name} plan.`,
//         duration: 3000,
//       })
//       return
//     }

//     if (plan.id === "free") {
//       handleCancelSubscription()
//       return
//     }

//     setShowPaymentForm(true)
//   }

//   const handleCancelSubscription = async () => {
//     try {
//       const response = await fetch("/api/subscriptions/cancel", { method: "POST" })
//       const data = await response.json()
      
//       if (!data.success) {
//         throw new Error(data.error || "Failed to cancel subscription")
//       }
      
//       toast({
//         title: "Subscription Canceled",
//         description: "Your subscription has been downgraded to Free plan.",
//       })
      
//       await refetchSubscription()
//       onClose()
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to cancel subscription",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleSubmitPayment = async (paymentData: { phone: string; country: string }) => {
//     if (!selectedPlan) return

//     setIsProcessing(true)

//     try {
//       const response = await fetch("/api/subscriptions/pesapal/create", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           plan: selectedPlan.id,
//           phone: paymentData.phone,
//           countryCode: paymentData.country,
//         }),
//       })

//       const data = await response.json()

//       // Log the response for debugging
//       console.log("Pesapal API response:", data)

//       if (!data.success) {
//         throw new Error(data.error || "Failed to create payment")
//       }

//       // Validate redirect URL exists
//       if (!data.redirectUrl) {
//         console.error("No redirect URL in response:", data)
//         throw new Error("Payment redirect URL not received. Please try again.")
//       }

//       // Redirect to Pesapal payment page
//       console.log("Redirecting to:", data.redirectUrl)
//       window.location.href = data.redirectUrl
//     } catch (error: any) {
//       console.error("Payment error:", error)
//       toast({
//         title: "Payment failed",
//         description: error.message || "An error occurred while processing your payment",
//         variant: "destructive",
//         duration: 5000,
//       })
//       setIsProcessing(false)
//     }
//   }

//   const handleReset = () => {
//     setShowPaymentForm(false)
//     setSelectedPlan(null)
//     setIsProcessing(false)
//   }

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
//           onClick={onClose}
//         >
//           <motion.div
//             initial={{ scale: 0.95, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.95, opacity: 0 }}
//             onClick={(e) => e.stopPropagation()}
//             className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
//           >
//             <div className="p-8 max-h-[90vh] overflow-y-auto">
//               <div className="flex justify-between items-center mb-8">
//                 <h2 className="text-2xl font-bold text-white">
//                   {showPaymentForm ? "Payment Details" : "Choose Your Plan"}
//                 </h2>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={onClose}
//                   className="rounded-full h-10 w-10 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
//                 >
//                   <X className="h-5 w-5" />
//                 </Button>
//               </div>

//               {showPaymentForm ? (
//                 <PaymentForm
//                   onSubmit={handleSubmitPayment}
//                   onBack={handleReset}
//                   isProcessing={isProcessing}
//                   plan={selectedPlan!}
//                 />
//               ) : (
//                 <div className="space-y-6">
//                   <Tabs defaultValue="pro" className="w-full">
//                     <TabsList className="w-full bg-zinc-900 rounded-xl p-1 mb-6 grid grid-cols-3">
//                       {PLANS.map((plan) => (
//                         <TabsTrigger
//                           key={plan.id}
//                           value={plan.id}
//                           className={cn(
//                             "rounded-lg data-[state=active]:bg-white data-[state=active]:text-black text-zinc-400 font-medium transition-all",
//                             plan.id === currentPlan && "opacity-50",
//                           )}
//                           disabled={plan.id === currentPlan}
//                         >
//                           {plan.name}
//                         </TabsTrigger>
//                       ))}
//                     </TabsList>

//                     {PLANS.map((plan) => (
//                       <TabsContent key={plan.id} value={plan.id} className="space-y-6">
//                         <motion.div 
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           className="text-center space-y-4"
//                         >
//                           <div className="w-16 h-16 mx-auto bg-zinc-900 rounded-2xl flex items-center justify-center">
//                             <plan.icon className="w-8 h-8 text-white" />
//                           </div>
                          
//                           <div className="space-y-2">
//                             <div className="flex items-center justify-center gap-2">
//                               <span className="text-4xl font-bold text-white">{plan.price}</span>
//                               {plan.period && <span className="text-zinc-400">/{plan.period.replace('per ', '')}</span>}
//                             </div>
//                             <p className="text-zinc-400">{plan.description}</p>
//                           </div>
//                         </motion.div>

//                         <div className="space-y-3">
//                           {plan.features.map((feature, i) => (
//                             <div key={i} className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-xl">
//                               <CheckCircle className="h-5 w-5 text-white flex-shrink-0" />
//                               <span className="text-zinc-300">{feature}</span>
//                             </div>
//                           ))}
//                         </div>

//                         <Button
//                           onClick={() => handlePlanSelect(plan)}
//                           disabled={plan.id === currentPlan}
//                           className={cn(
//                             "w-full h-12 rounded-xl font-medium transition-all",
//                             plan.id === "enterprise"
//                               ? "bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800"
//                               : "bg-white hover:bg-zinc-200 text-black",
//                             plan.id === currentPlan && "bg-zinc-900 opacity-50 cursor-not-allowed border border-zinc-800",
//                           )}
//                         >
//                           {plan.id === currentPlan ? (
//                             <>
//                               <CheckCircle className="mr-2 h-4 w-4" />
//                               Current Plan
//                             </>
//                           ) : plan.id === "free" ? (
//                             "Downgrade to Free"
//                           ) : plan.id === "enterprise" ? (
//                             <>
//                               <MessageSquare className="mr-2 h-4 w-4" />
//                               Contact Sales
//                             </>
//                           ) : (
//                             <>
//                               <Zap className="mr-2 h-4 w-4" />
//                               Upgrade to {plan.name}
//                             </>
//                           )}
//                         </Button>
//                       </TabsContent>
//                     ))}
//                   </Tabs>

//                   {subscription && subscription.plan !== "FREE" && (
//                     <div className="pt-6 border-t border-zinc-800">
//                       <Button
//                         onClick={handleCancelSubscription}
//                         variant="outline"
//                         className="w-full h-12 bg-transparent text-zinc-300 border-zinc-800 hover:bg-zinc-900 hover:text-white rounded-xl transition-colors"
//                       >
//                         Cancel Current Subscription
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

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { X, CreditCard, MessageSquare, CheckCircle, Loader2, Crown, Zap, MapPin } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSubscription } from "@/contexts/subscription-context"
import { COUNTRIES, detectUserCountry, getCountryByCode } from "@/lib/countries"
import PesapalIframeModal from "./iframe"

type PaymentPopupProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    priceKES: "KES 0",
    period: "forever",
    icon: CheckCircle,
    features: ["5 automations", "Basic pre-written reply", "20 DMs automated replies/day"],
    description: "Perfect for getting started",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$49.99",
    priceKES: "KES 4,999",
    period: "per month",
    icon: Zap,
    features: ["AI-powered Intelligent replies", "50 automations", "Detailed Sentiment Analysis","Lead Qualification and CRM intelligent syncing"],
    description: "For power users and professionals",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    priceKES: "Custom",
    period: "",
    icon: Crown,
    features: ["Everything in Pro", "Unlimited automations", "Dedicated support", "Custom integrations"],
    description: "Enterprise-grade solutions",
  },
]

const PaymentForm = ({
  onSubmit,
  onBack,
  isProcessing,
  plan,
}: {
  onSubmit: (data: { phone: string; country: string }) => void
  onBack: () => void
  isProcessing: boolean
  plan: (typeof PLANS)[number]
}) => {
  const [phone, setPhone] = useState("")
  const [country, setCountry] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isDetecting, setIsDetecting] = useState(true)

  useEffect(() => {
    detectCountry()
  }, [])

  const detectCountry = async () => {
    setIsDetecting(true)
    try {
      const detectedCountry = await detectUserCountry()
      setCountry(detectedCountry)
    } catch (err) {
      console.log("Could not detect country, using default")
      setCountry("US")
    } finally {
      setIsDetecting(false)
    }
  }

  const selectedCountry = getCountryByCode(country)

  const handleSubmit = () => {
    if (!phone.trim()) {
      setError("Please enter your phone number")
      return
    }

    if (!country) {
      setError("Please select your country")
      return
    }

    setError(null)
    onSubmit({ phone, country })
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="text-center space-y-3">
        <p className="text-zinc-400">
          You&apos;re upgrading to <span className="text-white font-medium">{plan.name}</span> plan
        </p>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-900 rounded-full">
            <span className="text-2xl font-bold text-white">{plan.price}</span>
            {plan.period && <span className="text-sm text-zinc-400">/{plan.period.replace('per ', '')}</span>}
          </div>
          {plan.priceKES !== plan.price && (
            <p className="text-xs text-zinc-500">
              Equivalent to {plan.priceKES}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="country" className="text-sm font-medium text-zinc-300">
              Country
            </label>
            <Select value={country} onValueChange={setCountry} disabled={isDetecting}>
              <SelectTrigger id="country" className="w-full h-12 bg-zinc-900 border-zinc-800 text-white rounded-xl">
                <SelectValue placeholder={isDetecting ? "Geolocating..." : "Select your country"} />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-white rounded-xl max-h-[300px]">
                {COUNTRIES.map((c) => (
                  <SelectItem 
                    key={c.code} 
                    value={c.code} 
                    className="text-white hover:bg-zinc-800 focus:bg-zinc-800 rounded-lg"
                  >
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isDetecting && (
              <p className="text-xs text-zinc-400 flex items-center gap-1">
                <MapPin className="h-3 w-3 animate-pulse" />
                Auto-detecting your location...
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-zinc-300">
              Phone Number
            </label>
            <div className="relative">
              {selectedCountry?.phoneCode && (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">
                  {selectedCountry.phoneCode}
                </span>
              )}
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={cn(
                  "w-full h-12 px-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:border-zinc-600 focus:outline-none transition-colors",
                  selectedCountry?.phoneCode && "pl-20"
                )}
                placeholder={selectedCountry?.phoneCode ? "712345678" : "+1234567890"}
              />
            </div>
            <p className="text-xs text-zinc-500">
              {selectedCountry?.phoneCode 
                ? `Enter your number without the country code (${selectedCountry.phoneCode})`
                : "Include your country code, e.g., +1234567890"
              }
            </p>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-950/50 border border-red-900/50 rounded-xl text-sm text-red-400"
          >
            {error}
          </motion.div>
        )}

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
            type="button"
            onClick={handleSubmit}
            disabled={isProcessing}
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
                Continue to Payment
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-zinc-500 text-center">
          🔒 Payments are secured by Pesapal. Complete payment in the secure window.
        </p>
      </div>
    </motion.div>
  )
}

const PaymentPopup = ({ isOpen, onClose, onSuccess }: PaymentPopupProps) => {
  const [selectedPlan, setSelectedPlan] = useState<(typeof PLANS)[number] | null>(null)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [pesapalUrl, setPesapalUrl] = useState("")
  const [showPesapalIframe, setShowPesapalIframe] = useState(false)
  const [orderTrackingId, setOrderTrackingId] = useState("")
  const [isPollingStatus, setIsPollingStatus] = useState(false)
  const { toast } = useToast()
  const { subscription, refetchSubscription } = useSubscription()

  const currentPlan = subscription?.plan.toLowerCase() || "free"

  // Poll payment status after user interacts with Pesapal iframe
  useEffect(() => {
    if (!orderTrackingId || !isPollingStatus) return

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/subscriptions/pesapal/status?orderTrackingId=${orderTrackingId}`)
        const data = await response.json()

        if (data.success && data.status) {
          const status = data.status.payment_status_description?.toLowerCase()
          
          if (status === 'completed' || status === 'success') {
            clearInterval(pollInterval)
            setIsPollingStatus(false)
            handlePaymentSuccess()
          } else if (status === 'failed' || status === 'cancelled') {
            clearInterval(pollInterval)
            setIsPollingStatus(false)
            handlePaymentFailure(data.status.payment_status_description)
          }
        }
      } catch (error) {
        console.error('Error polling payment status:', error)
      }
    }, 3000)

    const timeout = setTimeout(() => {
      clearInterval(pollInterval)
      setIsPollingStatus(false)
      toast({
        title: "Payment status check timeout",
        description: "Please check your subscription status or contact support if payment was completed.",
        variant: "destructive",
      })
    }, 300000)

    return () => {
      clearInterval(pollInterval)
      clearTimeout(timeout)
    }
  }, [orderTrackingId, isPollingStatus])

  const handlePlanSelect = (plan: (typeof PLANS)[number]) => {
    setSelectedPlan(plan)

    if (plan.id === "enterprise") {
      window.open("mailto:sales@example.com?subject=Enterprise Plan Inquiry", "_blank")
      return
    }

    if (plan.id === currentPlan) {
      toast({
        title: "You're already on this plan",
        description: `You are currently on the ${plan.name} plan.`,
        duration: 3000,
      })
      return
    }

    if (plan.id === "free") {
      handleCancelSubscription()
      return
    }

    setShowPaymentForm(true)
  }

  const handleCancelSubscription = async () => {
    try {
      const response = await fetch("/api/subscriptions/cancel", { method: "POST" })
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || "Failed to cancel subscription")
      }
      
      toast({
        title: "Subscription Canceled",
        description: "Your subscription has been downgraded to Free plan.",
      })
      
      await refetchSubscription()
      onClose()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel subscription",
        variant: "destructive",
      })
    }
  }

  const handleSubmitPayment = async (paymentData: { phone: string; country: string }) => {
    if (!selectedPlan) return

    setIsProcessing(true)

    try {
      const response = await fetch("/api/subscriptions/pesapal/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: selectedPlan.id,
          phone: paymentData.phone,
          countryCode: paymentData.country,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to create payment")
      }

      if (!data.redirectUrl) {
        throw new Error("Payment redirect URL not received. Please try again.")
      }

      if (data.orderTrackingId) {
        setOrderTrackingId(data.orderTrackingId)
      }

      setPesapalUrl(data.redirectUrl)
      setShowPesapalIframe(true)
      setIsProcessing(false)
      setIsPollingStatus(true)

      toast({
        title: "Payment window opened",
        description: "Complete your payment in the secure window",
      })
    } catch (error: any) {
      console.error("Payment error:", error)
      toast({
        title: "Payment failed",
        description: error.message || "An error occurred while processing your payment",
        variant: "destructive",
        duration: 5000,
      })
      setIsProcessing(false)
    }
  }

  const handlePaymentSuccess = async () => {
    setShowPesapalIframe(false)
    setPesapalUrl("")
    setOrderTrackingId("")
    
    toast({
      title: "Payment Successful!",
      description: "Your subscription has been activated.",
      duration: 5000,
    })
    
    await refetchSubscription()
    onSuccess()
    handleReset()
    onClose()
  }

  const handlePaymentFailure = (reason?: string) => {
    setShowPesapalIframe(false)
    setPesapalUrl("")
    setOrderTrackingId("")
    
    toast({
      title: "Payment Failed",
      description: reason || "Your payment could not be completed. Please try again.",
      variant: "destructive",
      duration: 5000,
    })
    
    handleReset()
  }

  const handlePaymentCancel = () => {
    setShowPesapalIframe(false)
    setPesapalUrl("")
    setIsPollingStatus(false)
    setOrderTrackingId("")
    
    toast({
      title: "Payment Cancelled",
      description: "You can try again when ready.",
      duration: 3000,
    })
    
    handleReset()
  }

  const handleClosePesapalModal = () => {
    setShowPesapalIframe(false)
  }

  const handleReset = () => {
    setShowPaymentForm(false)
    setSelectedPlan(null)
    setIsProcessing(false)
  }

  const handleCloseMain = () => {
    if (showPesapalIframe || isPollingStatus) {
      toast({
        title: "Payment in progress",
        description: "Please complete or cancel the payment first.",
        duration: 3000,
      })
      return
    }
    onClose()
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={handleCloseMain}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
            >
              <div className="p-8 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-white">
                    {showPaymentForm ? "Payment Details" : "Choose Your Plan"}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCloseMain}
                    className="rounded-full h-10 w-10 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {showPaymentForm ? (
                  <PaymentForm
                    onSubmit={handleSubmitPayment}
                    onBack={handleReset}
                    isProcessing={isProcessing}
                    plan={selectedPlan!}
                  />
                ) : (
                  <div className="space-y-6">
                    <Tabs defaultValue="pro" className="w-full">
                      <TabsList className="w-full bg-zinc-900 rounded-xl p-1 mb-6 grid grid-cols-3">
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
                                <Zap className="mr-2 h-4 w-4" />
                                Upgrade to {plan.name}
                              </>
                            )}
                          </Button>
                        </TabsContent>
                      ))}
                    </Tabs>

                    {subscription && subscription.plan !== "FREE" && (
                      <div className="pt-6 border-t border-zinc-800">
                        <Button
                          onClick={handleCancelSubscription}
                          variant="outline"
                          className="w-full h-12 bg-transparent text-zinc-300 border-zinc-800 hover:bg-zinc-900 hover:text-white rounded-xl transition-colors"
                        >
                          Cancel Current Subscription
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

      <PesapalIframeModal
        isOpen={showPesapalIframe}
        paymentUrl={pesapalUrl}
        onClose={handleClosePesapalModal}
        onSuccess={handlePaymentSuccess}
        onCancel={handlePaymentCancel}
      />
    </>
  )
}

export default PaymentPopup



// "use client"

// import type React from "react"
// import { useState } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
// import { X, CreditCard, MessageSquare, Building, CheckCircle, Loader2, Crown, Zap, Users, ExternalLink } from 'lucide-react'
// import { useToast } from "@/hooks/use-toast"
// import { cn } from "@/lib/utils"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { useSubscription } from "@/contexts/subscription-context"

// type PaymentPopupProps = {
//   isOpen: boolean
//   onClose: () => void
//   onSuccess: () => void
// }

// // Available plans with icons
// const PLANS = [
//   {
//     id: "free",
//     name: "Free",
//     price: "$0",
//     period: "forever",
//     icon: CheckCircle,
//     features: ["5 automations", "Basic pre-written reply", "20 DMs automated replies/day"],
//     description: "Perfect for getting started",
//   },
//   {
//     id: "pro",
//     name: "Pro",
//     price: "$29.99",
//     period: "per month",
//     icon: Zap,
//     features: ["AI-powered Intelligent replies", "50 automations", "Detailed Sentiment Analysis","Lead Qualification and CRM intelligent syncing"],
//     description: "For power users and professionals",
//   },
//   {
//     id: "enterprise",
//     name: "Enterprise",
//     price: "Custom",
//     period: "",
//     icon: Crown,
//     features: ["Everything in Pro", "Unlimited automations", "Dedicated support", "Custom integrations"],
//     description: "Enterprise-grade solutions",
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

// // Payment form component (simplified for Lemon Squeezy)
// const PaymentForm = ({
//   onSubmit,
//   onBack,
//   isProcessing,
//   setIsProcessing,
//   plan,
// }: {
//   onSubmit: (paymentData: { cardholderName: string; country: string }) => void
//   onBack: () => void
//   isProcessing: boolean
//   setIsProcessing: (value: boolean) => void
//   plan: (typeof PLANS)[number]
// }) => {
//   const [cardholderName, setCardholderName] = useState("")
//   const [country, setCountry] = useState("")
//   const [error, setError] = useState<string | null>(null)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!cardholderName.trim()) {
//       setError("Please enter your full name")
//       return
//     }

//     if (!country) {
//       setError("Please select your country")
//       return
//     }

//     setError(null)
//     setIsProcessing(true)

//     try {
//       // Pass the payment data to the parent component
//       onSubmit({
//         cardholderName,
//         country,
//       })
//     } catch (err: any) {
//       setError(err.message || "An unexpected error occurred")
//       setIsProcessing(false)
//     }
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, x: 20 }}
//       animate={{ opacity: 1, x: 0 }}
//       exit={{ opacity: 0, x: -20 }}
//       className="space-y-8"
//     >
//       {/* Header */}
//       <div className="text-center space-y-3">
//         <div className="w-16 h-16 mx-auto bg-zinc-900 rounded-2xl flex items-center justify-center mb-4">
//           <plan.icon className="w-8 h-8 text-white" />
//         </div>
//         <h3 className="text-2xl font-semibold text-white">Complete Your Upgrade</h3>
//         <p className="text-zinc-400">
//           You&apos;re upgrading to <span className="text-white font-medium">{plan.name}</span> plan
//         </p>
//         <div className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-900 rounded-full">
//           <span className="text-2xl font-bold text-white">{plan.price}</span>
//           {plan.period && <span className="text-sm text-zinc-400">/{plan.period.replace('per ', '')}</span>}
//         </div>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Form Fields */}
//         <div className="space-y-5">
//           <div className="space-y-2">
//             <label htmlFor="cardholder-name" className="text-sm font-medium text-zinc-300">
//               Full Name
//             </label>
//             <input
//               id="cardholder-name"
//               value={cardholderName}
//               onChange={(e) => setCardholderName(e.target.value)}
//               className="w-full h-12 px-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:border-zinc-600 focus:outline-none transition-colors"
//               placeholder="Enter your full name"
//               required
//             />
//           </div>

//           <div className="space-y-2">
//             <label htmlFor="country" className="text-sm font-medium text-zinc-300">
//               Country
//             </label>
//             <Select value={country} onValueChange={setCountry}>
//               <SelectTrigger id="country" className="w-full h-12 bg-zinc-900 border-zinc-800 text-white rounded-xl focus:border-zinc-600">
//                 <SelectValue placeholder="Select your country" />
//               </SelectTrigger>
//               <SelectContent className="bg-zinc-900 border-zinc-800 text-white rounded-xl">
//                 {COUNTRIES.map((country) => (
//                   <SelectItem 
//                     key={country.code} 
//                     value={country.code} 
//                     className="text-white hover:bg-zinc-800 focus:bg-zinc-800 rounded-lg"
//                   >
//                     {country.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
//             <div className="flex items-center gap-2 text-sm text-zinc-400">
//               <CreditCard className="w-4 h-4" />
//               <span>Payment details will be handled securely by Lemon Squeezy</span>
//             </div>
//           </div>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="p-4 bg-red-950/50 border border-red-900/50 rounded-xl text-sm text-red-400"
//           >
//             {error}
//           </motion.div>
//         )}

//         {/* Action Buttons */}
//         <div className="flex gap-3 pt-2">
//           <Button
//             type="button"
//             variant="outline"
//             onClick={onBack}
//             disabled={isProcessing}
//             className="flex-1 h-12 bg-transparent text-zinc-300 border-zinc-800 hover:bg-zinc-900 hover:text-white rounded-xl transition-colors"
//           >
//             Back
//           </Button>
//           <Button
//             type="submit"
//             disabled={isProcessing}
//             className="flex-1 h-12 bg-white text-black hover:bg-zinc-200 rounded-xl font-medium transition-colors"
//           >
//             {isProcessing ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Processing...
//               </>
//             ) : (
//               <>
//                 <ExternalLink className="mr-2 h-4 w-4" />
//                 Continue to Payment
//               </>
//             )}
//           </Button>
//         </div>

//         {/* Security Note */}
//         <p className="text-xs text-zinc-500 text-center">
//           Payments are secured by Lemon Squeezy. Cancel anytime from your account settings.
//         </p>
//       </form>
//     </motion.div>
//   )
// }

// // Main payment popup component
// const PaymentPopup = ({ isOpen, onClose, onSuccess }: PaymentPopupProps) => {
//   const [selectedPlan, setSelectedPlan] = useState<(typeof PLANS)[number] | null>(null)
//   const [showPaymentForm, setShowPaymentForm] = useState(false)
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

//     // Show payment form for paid plans
//     setShowPaymentForm(true)
//   }

//   const handleManageSubscription = async () => {
//     try {
//       const response = await fetch("/api/subscriptions/manage")
//       const data = await response.json()
      
//       if (!data.success) {
//         throw new Error(data.error || "Failed to create billing portal session")
//       }
      
//       // Redirect to Lemon Squeezy Billing Portal
//       window.open(data.url, '_blank')
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "An error occurred",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleSubmitPayment = async (paymentData: { cardholderName: string; country: string }) => {
//     if (!selectedPlan) return

//     try {
//       // Call API to create checkout session
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
//         throw new Error(data.error || "Failed to create checkout session")
//       }

//       // Redirect to Lemon Squeezy checkout
//       window.open(data.checkoutUrl, '_blank')

//       // Show success state
//       setIsComplete(true)

//       // Refetch subscription data (user will complete payment in new tab)
//       setTimeout(async () => {
//         await refetchSubscription()
//       }, 5000) // Give some time for the user to complete payment

//       // Wait a moment to show success state
//       setTimeout(() => {
//         onSuccess()
//         // Reset state
//         setShowPaymentForm(false)
//         setSelectedPlan(null)
//         setIsComplete(false)
//         setIsProcessing(false)
//         onClose()
//       }, 3000)
//     } catch (error: any) {
//       toast({
//         title: "Checkout failed",
//         description: error.message || "An error occurred while creating checkout session",
//         variant: "destructive",
//         duration: 5000,
//       })
//       setIsProcessing(false)
//     }
//   }

//   const handleReset = () => {
//     setShowPaymentForm(false)
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
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
//           onClick={onClose}
//         >
//           <motion.div
//             initial={{ scale: 0.95, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.95, opacity: 0 }}
//             onClick={(e) => e.stopPropagation()}
//             className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
//           >
//             <div className="p-8 max-h-[90vh] overflow-y-auto">
//               {/* Header */}
//               <div className="flex justify-between items-center mb-8">
//                 <h2 className="text-2xl font-bold text-white">
//                   {isComplete ? "Redirecting to Payment!" : showPaymentForm ? "Payment Details" : "Choose Your Plan"}
//                 </h2>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={onClose}
//                   className="rounded-full h-10 w-10 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
//                 >
//                   <X className="h-5 w-5" />
//                 </Button>
//               </div>

//               {/* Success State */}
//               {isComplete ? (
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="flex flex-col items-center justify-center py-12 text-center space-y-6"
//                 >
//                   <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center">
//                     <ExternalLink className="h-10 w-10 text-white" />
//                   </div>
//                   <div className="space-y-2">
//                     <h3 className="text-2xl font-semibold text-white">Redirecting to Checkout!</h3>
//                     <p className="text-zinc-400 max-w-sm">
//                       We&apos;ve opened the secure checkout page for your <span className="text-white font-medium">{selectedPlan?.name}</span> plan. 
//                       Complete your payment there to activate your subscription.
//                     </p>
//                   </div>
//                 </motion.div>
//               ) : showPaymentForm ? (
//                 /* Payment Form */
//                 <PaymentForm
//                   onSubmit={handleSubmitPayment}
//                   onBack={handleReset}
//                   isProcessing={isProcessing}
//                   setIsProcessing={setIsProcessing}
//                   plan={selectedPlan!}
//                 />
//               ) : (
//                 /* Plan Selection */
//                 <div className="space-y-6">
//                   <Tabs defaultValue="pro" className="w-full">
//                     <TabsList className="w-full bg-zinc-900 rounded-xl p-1 mb-6 grid grid-cols-3">
//                       {PLANS.map((plan) => (
//                         <TabsTrigger
//                           key={plan.id}
//                           value={plan.id}
//                           className={cn(
//                             "rounded-lg data-[state=active]:bg-white data-[state=active]:text-black text-zinc-400 font-medium transition-all",
//                             plan.id === currentPlan && "opacity-50",
//                           )}
//                           disabled={plan.id === currentPlan}
//                         >
//                           {plan.name}
//                         </TabsTrigger>
//                       ))}
//                     </TabsList>

//                     {PLANS.map((plan) => (
//                       <TabsContent key={plan.id} value={plan.id} className="space-y-6">
//                         <motion.div 
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           className="text-center space-y-4"
//                         >
//                           <div className="w-16 h-16 mx-auto bg-zinc-900 rounded-2xl flex items-center justify-center">
//                             <plan.icon className="w-8 h-8 text-white" />
//                           </div>
                          
//                           <div className="space-y-2">
//                             <div className="flex items-center justify-center gap-2">
//                               <span className="text-4xl font-bold text-white">{plan.price}</span>
//                               {plan.period && <span className="text-zinc-400">/{plan.period.replace('per ', '')}</span>}
//                             </div>
//                             <p className="text-zinc-400">{plan.description}</p>
//                           </div>
//                         </motion.div>

//                         <div className="space-y-3">
//                           {plan.features.map((feature, i) => (
//                             <div key={i} className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-xl">
//                               <CheckCircle className="h-5 w-5 text-white flex-shrink-0" />
//                               <span className="text-zinc-300">{feature}</span>
//                             </div>
//                           ))}
//                         </div>

//                         <Button
//                           onClick={() => handlePlanSelect(plan)}
//                           disabled={plan.id === currentPlan}
//                           className={cn(
//                             "w-full h-12 rounded-xl font-medium transition-all",
//                             plan.id === "enterprise"
//                               ? "bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800"
//                               : "bg-white hover:bg-zinc-200 text-black",
//                             plan.id === currentPlan && "bg-zinc-900 opacity-50 cursor-not-allowed border border-zinc-800",
//                           )}
//                         >
//                           {plan.id === currentPlan ? (
//                             <>
//                               <CheckCircle className="mr-2 h-4 w-4" />
//                               Current Plan
//                             </>
//                           ) : plan.id === "free" ? (
//                             "Downgrade to Free"
//                           ) : plan.id === "enterprise" ? (
//                             <>
//                               <MessageSquare className="mr-2 h-4 w-4" />
//                               Contact Sales
//                             </>
//                           ) : (
//                             <>
//                               <Building className="mr-2 h-4 w-4" />
//                               Upgrade to {plan.name}
//                             </>
//                           )}
//                         </Button>
//                       </TabsContent>
//                     ))}
//                   </Tabs>

//                   {/* Manage Subscriptn */}
//                   {subscription && subscription.plan !== "FREE" && (
//                     <div className="pt-6 border-t border-zinc-800">
//                       <Button
//                         onClick={handleManageSubscription}
//                         variant="outline"
//                         className="w-full h-12 bg-transparent text-zinc-300 border-zinc-800 hover:bg-zinc-900 hover:text-white rounded-xl transition-colors"
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