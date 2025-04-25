// "use client"

// import type React from "react"

// import { motion, AnimatePresence } from "framer-motion"
// import { cn } from "@/lib/utils"
// import {
//   CreditCard,
//   DollarSignIcon as PaypalLogo,
//   Bitcoin,
//   Apple,
//   BanknoteIcon as BankTransfer,
//   Gift,
//   Check,
//   ChevronRight,
//   ChevronLeft,
//   Lock,
//   X,
//   ChevronsUpDown,
//   Shield,
//   Sparkles,
//   Landmark,
//   Wallet,
//   AlertCircle,
//   Info,
//   Star,
//   CreditCardIcon as GooglePay,
//   CheckCircle2,
//   ThumbsUp,
//   Timer,
//   RefreshCcw,
//   ArrowRight,
//   Copy,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Separator } from "@/components/ui/separator"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Checkbox } from "@/components/ui/checkbox"
// import { useToast } from "@/hooks/use-toast"

// // Import payment processing libraries
// import { loadStripe } from "@stripe/stripe-js"
// import { Elements, CardElement, useStripe, useElements, PaymentRequestButtonElement } from "@stripe/react-stripe-js"
// // Replace the import for useUser from Clerk with your server actions
// // Replace this:
// //import { useUser } from "@clerk/nextjs";

// // With this:
// import { onSubscribe, onCurrentUser, onUserInfo } from "@/actions/user/index"
// import { useState, useEffect, useRef, type FormEvent } from "react"
// // Replace NextAuth imports with Clerk imports
// //import { useUser } from "@clerk/nextjs"

// // Initialize Stripe with your publishable key
// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

// // Card types for validation and display
// const CARD_TYPES = {
//   visa: {
//     pattern: /^4/,
//     icon: "/assets/payment/visa.svg",
//   },
//   mastercard: {
//     pattern: /^5[1-5]/,
//     icon: "/assets/payment/mastercard.svg",
//   },
//   amex: {
//     pattern: /^3[47]/,
//     icon: "/assets/payment/amex.svg",
//   },
//   discover: {
//     pattern: /^(6011|65|64[4-9]|622)/,
//     icon: "/assets/payment/discover.svg",
//   },
// }

// interface PaymentMethod {
//   id: string
//   name: string
//   icon: React.ReactNode
//   description: string
//   popular?: boolean
//   processingTime: string
//   fees: string
//   color: string
// }

// // Add this interface near the top of the file, after the other interfaces
// interface PaymentResult {
//   success: boolean
//   transactionId?: string
//   sessionId?: string
//   error?: string
//   last4?: string
//   paymentAddress?: string
//   expiresAt?: string
//   redemptionId?: string
// }

// const PaymentMethodIcon = ({
//   method,
//   selected,
//   size = "default",
// }: {
//   method: string
//   selected: boolean
//   size?: "default" | "large"
// }) => {
//   const icons: Record<string, React.ReactNode> = {
//     card: <CreditCard className={size === "large" ? "h-8 w-8" : "h-5 w-5"} />,
//     paypal: <PaypalLogo className={size === "large" ? "h-8 w-8" : "h-5 w-5"} />,
//     crypto: <Bitcoin className={size === "large" ? "h-8 w-8" : "h-5 w-5"} />,
//     applepay: <Apple className={size === "large" ? "h-8 w-8" : "h-5 w-5"} />,
//     googlepay: <GooglePay className={size === "large" ? "h-8 w-8" : "h-5 w-5"} />,
//     bank: <BankTransfer className={size === "large" ? "h-8 w-8" : "h-5 w-5"} />,
//     giftcard: <Gift className={size === "large" ? "h-8 w-8" : "h-5 w-5"} />,
//     wallet: <Wallet className={size === "large" ? "h-8 w-8" : "h-5 w-5"} />,
//   }

//   return (
//     <div
//       className={cn(
//         "flex items-center justify-center rounded-full transition-all",
//         size === "large" ? "h-16 w-16 p-3" : "h-10 w-10 p-2",
//         selected
//           ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/20"
//           : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400",
//       )}
//     >
//       {icons[method]}
//     </div>
//   )
// }

// // Main payment component
// const PaymentPage = () => {
//   // Replace this line:
//   // const { data: session } = useSession()
//   // With this:
//   //const { user, isSignedIn } = useUser()
//   const [user, setUser] = useState<any>(null)
//   const [isSignedIn, setIsSignedIn] = useState(false)
//   const [userProfile, setUserProfile] = useState<any>(null)
//   const { toast } = useToast()

//   // State variables
//   const [paymentMethod, setPaymentMethod] = useState<string>("card")
//   const [formStep, setFormStep] = useState<number>(0)
//   const [flipCard, setFlipCard] = useState(false)
//   const [cardName, setCardName] = useState("")
//   const [cardNumber, setCardNumber] = useState("")
//   const [expiryDate, setExpiryDate] = useState("")
//   const [cvv, setCvv] = useState("")
//   const [saveCard, setSaveCard] = useState(false)
//   const [useSpecialOffer, setUseSpecialOffer] = useState(false)
//   const [showOrderSummary, setShowOrderSummary] = useState(false)
//   const [animationComplete, setAnimationComplete] = useState(false)
//   const [cardType, setCardType] = useState<keyof typeof CARD_TYPES | null>(null)
//   const [sidebarVisible, setSidebarVisible] = useState(true)
//   const [mobileView, setMobileView] = useState(false)
//   const [paymentProcessing, setPaymentProcessing] = useState(false)
//   const [paymentComplete, setPaymentComplete] = useState(false)
//   const [paymentError, setPaymentError] = useState<string | null>(null)
//   const [clientSecret, setClientSecret] = useState<string | null>(null)
//   const [paymentIntent, setPaymentIntent] = useState<string | null>(null)
//   const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "succeeded" | "failed">("idle")
//   const [transactionId, setTransactionId] = useState<string | null>(null)
//   const [walletBalance, setWalletBalance] = useState<number | null>(null)
//   const [paymentRequest, setPaymentRequest] = useState<any>(null)
//   const [giftCardCode, setGiftCardCode] = useState("")
//   const [giftCardPin, setGiftCardPin] = useState("")
//   const [giftCardBalance, setGiftCardBalance] = useState<number | null>(null)
//   const [cryptoCurrency, setCryptoCurrency] = useState("bitcoin")
//   const [cryptoAddress, setCryptoAddress] = useState<string | null>(null)

//   // Refs for form elements
//   const cardNumberRef = useRef<HTMLInputElement>(null)
//   const expiryRef = useRef<HTMLInputElement>(null)
//   const cvvRef = useRef<HTMLInputElement>(null)

//   // Order items and pricing
//   const items = [
//     { name: "Premium Plan (Annual)", price: 199.99, saving: "20%" },
//     { name: "Setup Fee", price: 0, waived: true },
//     { name: "Priority Support", price: 49.99 },
//   ]

//   const subtotal = items.reduce((acc, item) => acc + item.price, 0)
//   const discount = useSpecialOffer ? 25 : 0
//   const tax = (subtotal - discount) * 0.08
//   const total = subtotal - discount + tax

//   // Create payment intent when component loads or discount changes
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       createPaymentIntent()
//     }
//   }, [useSpecialOffer])

//   // Create payment intent
//   const createPaymentIntent = async () => {
//     try {
//       setPaymentError(null)

//       const response = await fetch("/api/create-payment-intent", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           amount: Math.round(total * 100), // Convert to cents for Stripe
//           currency: "usd",
//           payment_method_types: ["card"],
//           metadata: {
//             order_items: JSON.stringify(items),
//             discount_applied: useSpecialOffer,
//             // Replace all instances of session?.user?.id with user?.id
//             userId: user?.id || "guest",
//           },
//         }),
//       })

//       if (!response.ok) {
//         throw new Error("Failed to create payment intent")
//       }

//       const data = await response.json()
//       setClientSecret(data.clientSecret)
//       setPaymentIntent(data.id)
//     } catch (error) {
//       console.error("Error creating payment intent:", error)
//       setPaymentError("Failed to initialize payment. Please try again.")

//       toast({
//         title: "Payment Error",
//         description: "Failed to initialize payment. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   // Handle form submission
//   const handleSubmit = async (event: FormEvent) => {
//     event.preventDefault()

//     if (formStep === 1 && paymentMethod === "card") {
//       // Move to review step
//       continueTo(2)
//     } else if (formStep === 2) {
//       // Process the payment
//       await processPayment()
//     }
//   }

//   // Then update the processPayment function to use this type
//   const processPayment = async () => {
//     setPaymentProcessing(true)
//     setPaymentStatus("processing")
//     setPaymentError(null)

//     try {
//       let paymentResult: PaymentResult

//       switch (paymentMethod) {
//         case "card":
//           paymentResult = await processCardPayment()
//           break
//         case "paypal":
//           paymentResult = await processPayPalPayment()
//           break
//         case "crypto":
//           paymentResult = await processCryptoPayment()
//           break
//         case "applepay":
//           paymentResult = await processApplePayPayment()
//           break
//         case "googlepay":
//           paymentResult = await processGooglePayPayment()
//           break
//         case "bank":
//           paymentResult = await processBankTransferPayment()
//           break
//         case "giftcard":
//           paymentResult = await processGiftCardPayment()
//           break
//         case "wallet":
//           paymentResult = await processWalletPayment()
//           break
//         default:
//           throw new Error("Invalid payment method")
//       }

//       if (paymentResult.success) {
//         setTransactionId(paymentResult.transactionId || null)
//         setPaymentStatus("succeeded")
//         setPaymentComplete(true)
//         setFormStep(2)

//         // If we have a session ID (from Stripe), update the user's subscription
//         if (paymentResult.sessionId) {
//           try {
//             const subscriptionResult = await onSubscribe(paymentResult.sessionId)
//             if (subscriptionResult.status === 200) {
//               console.log("Subscription updated successfully")
//             } else {
//               console.warn("Subscription update failed:", subscriptionResult)
//             }
//           } catch (error) {
//             console.error("Error updating subscription:", error)
//           }
//         }

//         toast({
//           title: "Payment Successful",
//           description: "Your payment has been processed successfully.",
//           variant: "default",
//           className:
//             "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300",
//         })
//       } else {
//         throw new Error(paymentResult.error || "Payment failed")
//       }
//     } catch (error) {
//       console.error("Payment processing error:", error)
//       setPaymentStatus("failed")
//       const errorMessage = error instanceof Error ? error.message : "Payment processing failed. Please try again."
//       setPaymentError(errorMessage)

//       toast({
//         title: "Payment Failed",
//         description: errorMessage,
//         variant: "destructive",
//       })
//     } finally {
//       setPaymentProcessing(false)
//     }
//   }

//   // Update the return type of processCardPayment
//   const processCardPayment = async (): Promise<PaymentResult> => {
//     // This will be implemented in the CardPaymentForm component
//     return { success: true, transactionId: "card-" + Date.now() }
//   }

//   // Update the return type of processPayPalPayment
//   const processPayPalPayment = async (): Promise<PaymentResult> => {
//     // Redirect to PayPal for payment
//     window.location.href = `/api/paypal/create-order?amount=${total}&currency=USD`
//     return { success: true }
//   }

//   // Update the remaining payment processing functions to use the PaymentResult type

//   // Process cryptocurrency payment
//   const processCryptoPayment = async (): Promise<PaymentResult> => {
//     try {
//       const response = await fetch("/api/crypto/create-charge", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           amount: total,
//           currency: "USD",
//           name: "Premium Plan Purchase",
//           customerId: user?.id || "guest",
//         }),
//       })

//       if (!response.ok) {
//         throw new Error("Failed to create crypto payment")
//       }

//       const data = await response.json()

//       setCryptoAddress(data.addresses[cryptoCurrency])

//       return {
//         success: true,
//         transactionId: data.id,
//         paymentAddress: data.addresses[cryptoCurrency],
//         expiresAt: data.expires_at,
//       }
//     } catch (error) {
//       console.error("Crypto payment error:", error)
//       return { success: false, error: "Failed to process cryptocurrency payment" }
//     }
//   }

//   // Process Apple Pay payment
//   const processApplePayPayment = async (): Promise<PaymentResult> => {
//     try {
//       const response = await fetch("/api/apple-pay/session", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           amount: Math.round(total * 100),
//           currency: "usd",
//           items,
//         }),
//       })

//       if (!response.ok) {
//         throw new Error("Failed to create Apple Pay session")
//       }

//       const data = await response.json()

//       // In a real implementation, you would use the Apple Pay JS API
//       // with the session data returned from the server

//       return { success: true, transactionId: `AP-${Date.now()}` }
//     } catch (error) {
//       console.error("Apple Pay error:", error)
//       return { success: false, error: "Failed to process Apple Pay payment" }
//     }
//   }

//   // Process Google Pay payment
//   const processGooglePayPayment = async (): Promise<PaymentResult> => {
//     try {
//       const response = await fetch("/api/google-pay/session", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           amount: Math.round(total * 100),
//           currency: "usd",
//           items,
//         }),
//       })

//       if (!response.ok) {
//         throw new Error("Failed to create Google Pay session")
//       }

//       const data = await response.json()

//       // In a real implementation, you would use the Google Pay API
//       // with the session data returned from the server

//       return { success: true, transactionId: `GP-${Date.now()}` }
//     } catch (error) {
//       console.error("Google Pay error:", error)
//       return { success: false, error: "Failed to process Google Pay payment" }
//     }
//   }

//   // Process bank transfer payment
//   const processBankTransferPayment = async (): Promise<PaymentResult> => {
//     try {
//       const response = await fetch("/api/bank-transfer/initiate", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           amount: total,
//           currency: "USD",
//           description: "Premium Plan Purchase",
//           userId: user?.id || "guest",
//           email: user?.emailAddresses?.[0]?.emailAddress || userProfile?.email || "",
//         }),
//       })

//       if (!response.ok) {
//         throw new Error("Failed to initiate bank transfer")
//       }

//       const data = await response.json()
//       return { success: true, transactionId: data.reference }
//     } catch (error) {
//       console.error("Bank transfer error:", error)
//       return { success: false, error: "Failed to initiate bank transfer" }
//     }
//   }

//   // Process gift card payment
//   const processGiftCardPayment = async (): Promise<PaymentResult> => {
//     try {
//       const response = await fetch("/api/gift-card/redeem", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           code: giftCardCode,
//           amount: total,
//           userId: user?.id || "guest",
//         }),
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.error || "Failed to redeem gift card")
//       }

//       const data = await response.json()
//       return { success: true, transactionId: data.redemptionId }
//     } catch (error) {
//       console.error("Gift card error:", error)
//       return { success: false, error: error instanceof Error ? error.message : "Failed to process gift card payment" }
//     }
//   }

//   // Process wallet payment
//   const processWalletPayment = async (): Promise<PaymentResult> => {
//     try {
//       const response = await fetch("/api/wallet/charge", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-Clerk-User-Id": user?.id || "",
//         },
//         body: JSON.stringify({
//           amount: total,
//           currency: "USD",
//           description: "Premium Plan Purchase",
//         }),
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.error || "Failed to process wallet payment")
//       }

//       const data = await response.json()
//       setWalletBalance(data.new_balance)
//       return { success: true, transactionId: data.transactionId }
//     } catch (error) {
//       console.error("Wallet payment error:", error)
//       return { success: false, error: error instanceof Error ? error.message : "Failed to process wallet payment" }
//     }
//   }

//   // Check gift card balance
//   const checkGiftCardBalance = async () => {
//     try {
//       const response = await fetch(`/api/gift-card/redeem?code=${giftCardCode}`)

//       if (!response.ok) {
//         throw new Error("Invalid gift card")
//       }

//       const data = await response.json()

//       if (!data.is_valid) {
//         throw new Error(`Gift card is ${data.status}`)
//       }

//       setGiftCardBalance(data.balance)

//       toast({
//         title: "Gift Card Valid",
//         description: `Available balance: $${data.balance.toFixed(2)}`,
//         variant: "default",
//         className:
//           "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300",
//       })

//       return data.balance
//     } catch (error) {
//       console.error("Gift card error:", error)

//       toast({
//         title: "Gift Card Error",
//         description: error instanceof Error ? error.message : "Invalid gift card",
//         variant: "destructive",
//       })

//       return null
//     }
//   }

//   // Get wallet balance
//   const getWalletBalance = async () => {
//     try {
//       const response = await fetch("/api/wallet/charge", {
//         headers: {
//           "X-Clerk-User-Id": user?.id || "",
//         },
//       })

//       if (!response.ok) {
//         throw new Error("Failed to get wallet balance")
//       }

//       const data = await response.json()
//       setWalletBalance(data.balance)
//       return data.balance
//     } catch (error) {
//       console.error("Wallet error:", error)
//       return null
//     }
//   }

//   // Format credit card number with spaces
//   const formatCardNumber = (value: string) => {
//     const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
//     const matches = v.match(/\d{4,16}/g)
//     const match = (matches && matches[0]) || ""
//     const parts = []

//     for (let i = 0; i < match.length; i += 4) {
//       parts.push(match.substring(i, i + 4))
//     }

//     if (parts.length) {
//       return parts.join(" ")
//     } else {
//       return value
//     }
//   }

//   // Format expiry date
//   const formatExpiryDate = (value: string) => {
//     const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
//     if (v.length > 2) {
//       return `${v.substring(0, 2)}/${v.substring(2, 4)}`
//     }
//     return value
//   }

//   // Handle card number input
//   const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const formattedValue = formatCardNumber(e.target.value)
//     setCardNumber(formattedValue)

//     // Detect card type
//     const cardNumberWithoutSpaces = formattedValue.replace(/\s/g, "")
//     for (const [type, { pattern }] of Object.entries(CARD_TYPES)) {
//       if (pattern.test(cardNumberWithoutSpaces)) {
//         setCardType(type as keyof typeof CARD_TYPES)
//         break
//       } else {
//         setCardType(null)
//       }
//     }

//     // Auto-advance to expiry when full card number entered
//     if (cardNumberWithoutSpaces.length === 16 && expiryRef.current) {
//       expiryRef.current.focus()
//     }
//   }

//   // Handle expiry date input
//   const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const formattedValue = formatExpiryDate(e.target.value)
//     setExpiryDate(formattedValue)

//     // Auto-advance to CVV when full expiry entered
//     if (formattedValue.length === 5 && cvvRef.current) {
//       cvvRef.current.focus()
//       setFlipCard(true)
//     }
//   }

//   // Handle CVV input
//   const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value.replace(/\D/g, "")
//     if (value.length <= 4) {
//       setCvv(value)
//     }
//   }

//   const handleCvvFocus = () => {
//     setFlipCard(true)
//   }

//   const handleCvvBlur = () => {
//     setFlipCard(false)
//   }

//   // Check form validity based on payment method
//   const isFormValid = () => {
//     switch (paymentMethod) {
//       case "card":
//         return (
//           cardName.length > 0 &&
//           cardNumber.replace(/\s/g, "").length >= 15 &&
//           expiryDate.length === 5 &&
//           cvv.length >= 3
//         )
//       case "paypal":
//         return true
//       case "crypto":
//         return true
//       case "applepay":
//         return true
//       case "googlepay":
//         return true
//       case "bank":
//         return true
//       case "giftcard":
//         return giftCardCode.length > 0 && giftCardBalance !== null && giftCardBalance >= total
//       case "wallet":
//         return walletBalance !== null && walletBalance >= total
//       default:
//         return false
//     }
//   }

//   // Handle window resize for responsive layout
//   useEffect(() => {
//     const handleResize = () => {
//       setMobileView(window.innerWidth < 768)
//       setSidebarVisible(window.innerWidth >= 1024)
//     }

//     handleResize()
//     window.addEventListener("resize", handleResize)
//     return () => window.removeEventListener("resize", handleResize)
//   }, [])

//   // Load wallet balance when wallet payment method is selected
//   useEffect(() => {
//     if (paymentMethod === "wallet" && isSignedIn && user) {
//       getWalletBalance()
//     }
//   }, [paymentMethod, isSignedIn, user])

//   // Stripe Card Payment Form component
//   const CardPaymentForm = () => {
//     const stripe = useStripe()
//     const elements = useElements()
//     const [cardError, setCardError] = useState<string | null>(null)
//     const [cardComplete, setCardComplete] = useState(false)

//     useEffect(() => {
//       if (!stripe || !elements) {
//         return
//       }

//       // Create a payment request for Apple Pay / Google Pay
//       const pr = stripe.paymentRequest({
//         country: "US",
//         currency: "usd",
//         total: {
//           label: "Premium Plan",
//           amount: Math.round(total * 100),
//         },
//         requestPayerName: true,
//         requestPayerEmail: true,
//       })

//       // Check if the Payment Request is available
//       pr.canMakePayment().then((result) => {
//         if (result) {
//           setPaymentRequest(pr)
//         }
//       })
//     }, [stripe, elements])

//     const handleCardChange = (event: any) => {
//       setCardError(event.error ? event.error.message : null)
//       setCardComplete(event.complete)

//       // Try to determine card type from the brand
//       if (event.brand) {
//         const brand = event.brand.toLowerCase()
//         if (Object.keys(CARD_TYPES).includes(brand)) {
//           setCardType(brand as keyof typeof CARD_TYPES)
//         }
//       }
//     }

//     // Update the CardPaymentForm component's handleCardPayment function
//     const handleCardPayment = async (): Promise<PaymentResult> => {
//       if (!stripe || !elements || !clientSecret) {
//         return { success: false, error: "Payment system not initialized" }
//       }

//       const cardElement = elements.getElement(CardElement)

//       if (!cardElement) {
//         return { success: false, error: "Card element not found" }
//       }

//       const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: {
//           card: cardElement,
//           billing_details: {
//             name: cardName,
//             email: user?.emailAddresses[0]?.emailAddress || userProfile?.email || undefined,
//           },
//         },
//         save_payment_method: saveCard,
//       })

//       if (error) {
//         return { success: false, error: error.message }
//       }

//       if (paymentIntent?.status === "succeeded") {
//         // Use type assertion to access payment_method_details
//         const paymentIntentWithDetails = paymentIntent as any
//         const last4 = paymentIntentWithDetails.payment_method_details?.card?.last4

//         // Call the server action to update the subscription
//         try {
//           const subscriptionResult = await onSubscribe(paymentIntent.id)
//           if (subscriptionResult.status !== 200) {
//             console.warn("Subscription update warning:", subscriptionResult)
//           }
//         } catch (subscriptionError) {
//           console.error("Error updating subscription:", subscriptionError)
//           // Payment succeeded but subscription update failed
//           // You might want to log this or handle it differently
//         }

//         return {
//           success: true,
//           transactionId: paymentIntent.id,
//           sessionId: paymentIntent.id,
//           last4: last4,
//         }
//       }

//       return { success: false, error: "Payment failed" }
//     }

//     // Add this useEffect to fetch user data when the component loads
//     useEffect(() => {
//       const fetchUser = async () => {
//         try {
//           // Use the server action to get the current user
//           const userData = await onCurrentUser()
//           if (userData && !("redirect" in userData)) {
//             setUser(userData)
//             setIsSignedIn(true)

//             // Fetch user profile information
//             const userInfoResponse = await onUserInfo()
//             if (userInfoResponse.status === 200 && userInfoResponse.data) {
//               setUserProfile({
//                 email: userData.emailAddresses[0].emailAddress,
//                 name: `${userInfoResponse.data.firstname || ""} ${userInfoResponse.data.lastname || ""}`.trim(),
//               })
//             }
//           } else {
//             // User is not authenticated, redirect to sign-in
//             window.location.href = "/sign-in"
//           }
//         } catch (error) {
//           console.error("Error fetching user:", error)
//           toast({
//             title: "Authentication Error",
//             description: "Please sign in to continue.",
//             variant: "destructive",
//           })
//         }
//       }

//       fetchUser()
//     }, [])

//     return (
//       <div className="space-y-6">
//         <div className="relative perspective-1000">
//           <motion.div
//             className="relative w-full h-56 transition-all duration-500 preserve-3d"
//             animate={{ rotateY: flipCard ? 180 : 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             {/* Front of card - keep the same beautiful design */}
//             <div className="absolute inset-0 backface-hidden rounded-xl overflow-hidden">
//               <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-900 p-5 flex flex-col justify-between">
//                 <div className="flex justify-between items-start">
//                   <div className="flex flex-col">
//                     <div className="text-white/70 text-xs uppercase tracking-wider">Credit Card</div>
//                     <div className="text-white/90 text-xs mt-1">
//                       {cardType ? <span className="uppercase">{cardType}</span> : <span>Visa / Mastercard / Amex</span>}
//                     </div>
//                   </div>
//                   {cardType && (
//                     <div className="h-10 w-14 bg-white/20 rounded-md grid place-items-center p-1">
//                       <img
//                         src={CARD_TYPES[cardType].icon || "/placeholder.svg"}
//                         alt={cardType}
//                         className="max-h-full"
//                       />
//                     </div>
//                   )}
//                 </div>

//                 <div className="my-6">
//                   <div className="text-xl text-white font-mono tracking-wider">•••• •••• •••• ••••</div>
//                 </div>

//                 <div className="flex justify-between items-end">
//                   <div>
//                     <div className="text-white/60 text-xs uppercase tracking-wider mb-1">Card Holder</div>
//                     <div className="text-white font-medium truncate max-w-[180px]">{cardName || "YOUR NAME"}</div>
//                   </div>
//                   <div>
//                     <div className="text-white/60 text-xs uppercase tracking-wider mb-1">Expires</div>
//                     <div className="text-white font-medium">MM/YY</div>
//                   </div>
//                 </div>

//                 {/* Circuit design elements */}
//                 <div className="absolute top-[40%] left-0 w-12 h-8 border-t-2 border-l-2 border-white/20 rounded-tl-lg"></div>
//                 <div className="absolute top-[30%] right-5 w-8 h-8 border-r-2 border-b-2 border-white/10 rounded-br-lg"></div>
//                 <div className="absolute bottom-6 left-[40%] w-12 h-3 border-b border-white/10 rounded"></div>
//                 <div className="absolute top-10 right-10 w-4 h-4 bg-white/10 rounded-full"></div>
//                 <div className="absolute top-5 left-[30%] w-3 h-3 bg-white/20 rounded-full"></div>
//                 <div className="absolute bottom-10 right-[20%] w-6 h-1 bg-white/20 rounded"></div>
//               </div>
//             </div>

//             {/* Back of card - keep the same beautiful design */}
//             <div className="absolute inset-0 backface-hidden rounded-xl overflow-hidden rotateY-180">
//               <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-violet-600 p-5 flex flex-col">
//                 <div className="w-full h-12 bg-black/30 mt-4"></div>

//                 <div className="mt-6 flex justify-end">
//                   <div className="bg-white/90 h-10 w-full max-w-[80%] rounded relative flex items-center px-3">
//                     <div className="absolute text-right w-full pr-12 font-mono text-gray-600 tracking-widest">•••</div>
//                   </div>
//                 </div>

//                 <div className="mt-auto text-xs text-white/70 max-w-[80%]">
//                   This card is property of your bank. Unauthorized use is prohibited. If found, please return to your
//                   bank.
//                 </div>

//                 {/* Circuit design elements */}
//                 <div className="absolute top-[40%] right-0 w-12 h-8 border-t-2 border-r-2 border-white/20 rounded-tr-lg"></div>
//                 <div className="absolute bottom-10 left-5 w-8 h-8 border-l-2 border-b-2 border-white/10 rounded-bl-lg"></div>
//                 <div className="absolute bottom-6 right-[40%] w-12 h-3 border-b border-white/10 rounded"></div>
//               </div>
//             </div>
//           </motion.div>
//         </div>

//         <div className="space-y-4">
//           {/* Apple Pay / Google Pay button if available */}
//           {paymentRequest && (
//             <div className="mb-6">
//               <h3 className="text-base font-medium mb-3">Express Checkout</h3>
//               <PaymentRequestButtonElement
//                 options={{
//                   paymentRequest,
//                   style: {
//                     paymentRequestButton: {
//                       theme: "dark",
//                       height: "44px",
//                     },
//                   },
//                 }}
//               />
//               <Separator className="my-6" />
//               <h3 className="text-base font-medium mb-3">Or Pay with Card</h3>
//             </div>
//           )}

//           <div className="grid grid-cols-1 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="cardName">Cardholder Name</Label>
//               <Input
//                 id="cardName"
//                 placeholder="Name on card"
//                 value={cardName}
//                 onChange={(e) => setCardName(e.target.value)}
//                 required
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="cardNumber">Card Details</Label>
//               <div className="card-element p-3 border rounded-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
//                 <CardElement
//                   options={{
//                     style: {
//                       base: {
//                         fontSize: "16px",
//                         color: "#424770",
//                         "::placeholder": {
//                           color: "#aab7c4",
//                         },
//                       },
//                       invalid: {
//                         color: "#9e2146",
//                       },
//                     },
//                   }}
//                   onChange={handleCardChange}
//                 />
//               </div>
//               {cardError && <div className="text-sm text-red-500 mt-1">{cardError}</div>}
//             </div>

//             <div className="flex items-center space-x-2 mt-2">
//               <Checkbox id="saveCard" checked={saveCard} onCheckedChange={(checked) => setSaveCard(!!checked)} />
//               <label
//                 htmlFor="saveCard"
//                 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//               >
//                 Save card for future payments
//               </label>
//             </div>
//           </div>

//           <div className="mt-2 text-sm text-muted-foreground flex items-center">
//             <Lock className="h-4 w-4 mr-1" />
//             <span>Your payment information is encrypted and secure.</span>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // Particles for the success animation
//   const Particles = ({ count = 50 }: { count?: number }) => {
//     return (
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         {Array.from({ length: count }).map((_, i) => (
//           <motion.div
//             key={i}
//             className="absolute w-2 h-2 rounded-full bg-primary"
//             initial={{
//               scale: 0,
//               x: "50%",
//               y: "50%",
//               opacity: 1,
//             }}
//             animate={{
//               scale: Math.random() * 1 + 0.5,
//               x: `${Math.random() * 100}%`,
//               y: `${Math.random() * 100}%`,
//               opacity: 0,
//             }}
//             transition={{
//               duration: Math.random() * 1 + 0.5,
//               delay: Math.random() * 0.2,
//             }}
//             onAnimationComplete={() => {
//               if (i === count - 1) setAnimationComplete(true)
//             }}
//             style={{
//               backgroundColor: `hsl(${Math.random() * 60 + 230}, ${Math.random() * 50 + 50}%, ${Math.random() * 30 + 50}%)`,
//             }}
//           />
//         ))}
//       </div>
//     )
//   }

//   // Render payment method form based on selected method
//   const renderPaymentMethodForm = () => {
//     switch (paymentMethod) {
//       case "card":
//         return <CardPaymentForm />

//       case "paypal":
//         return (
//           <div className="space-y-6">
//             <div className="text-center py-10">
//               <div className="bg-[#003087] text-white w-16 h-16 rounded-full mx-auto grid place-items-center mb-4">
//                 <PaypalLogo className="h-8 w-8" />
//               </div>
//               <h3 className="text-xl font-semibold">Pay with PayPal</h3>
//               <p className="text-muted-foreground mt-2 max-w-md mx-auto">
//                 You will be redirected to PayPal to complete your payment securely. You will have a chance to review your
//                 order before the payment is finalized.
//               </p>
//             </div>

//             <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-950/30 text-sm">
//               <div className="flex">
//                 <Info className="h-5 w-5 text-blue-500 mr-2 shrink-0" />
//                 <span>
//                   PayPal protects your payment information with industry-leading security and fraud prevention systems.
//                   You are always protected if the item doesnt arrive or is significantly different than described.
//                 </span>
//               </div>
//             </div>

//             <Button
//               type="button"
//               className="w-full bg-[#0070ba] hover:bg-[#003087] text-white"
//               onClick={() => processPayPalPayment()}
//             >
//               <PaypalLogo className="h-5 w-5 mr-2" />
//               Proceed to PayPal
//             </Button>
//           </div>
//         )

//       case "crypto":
//         return (
//           <div className="space-y-6">
//             <div className="text-center py-6">
//               <div className="bg-[#F7931A] text-white w-16 h-16 rounded-full mx-auto grid place-items-center mb-4">
//                 <Bitcoin className="h-8 w-8" />
//               </div>
//               <h3 className="text-xl font-semibold">Pay with Cryptocurrency</h3>
//               <p className="text-muted-foreground mt-2 max-w-md mx-auto">
//                 Pay with your favorite cryptocurrency. We accept Bitcoin, Ethereum, and many other digital currencies.
//               </p>
//             </div>

//             <div className="border rounded-lg p-5 bg-amber-50 dark:bg-amber-950/30">
//               <Tabs defaultValue="bitcoin" className="w-full" onValueChange={(value) => setCryptoCurrency(value)}>
//                 <TabsList className="grid grid-cols-3 mb-4">
//                   <TabsTrigger value="bitcoin">Bitcoin</TabsTrigger>
//                   <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
//                   <TabsTrigger value="other">Others</TabsTrigger>
//                 </TabsList>
//                 <TabsContent value="bitcoin" className="space-y-4">
//                   <div className="flex flex-col items-center">
//                     {cryptoAddress ? (
//                       <>
//                         <div className="bg-white p-2 rounded-lg mb-3">
//                           <img
//                             src={`https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${cryptoAddress}&choe=UTF-8`}
//                             alt="Bitcoin QR Code"
//                             className="h-40 w-40"
//                           />
//                         </div>
//                         <div className="text-sm text-center">
//                           <p className="font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded-md text-xs break-all mb-2">
//                             {cryptoAddress}
//                           </p>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             className="mt-1"
//                             onClick={() => {
//                               navigator.clipboard.writeText(cryptoAddress || "")
//                               toast({
//                                 title: "Address Copied",
//                                 description: "Bitcoin address copied to clipboard",
//                                 variant: "default",
//                               })
//                             }}
//                           >
//                             <Copy className="h-4 w-4 mr-2" />
//                             Copy Address
//                           </Button>
//                         </div>
//                       </>
//                     ) : (
//                       <Button
//                         className="w-full bg-[#F7931A] hover:bg-[#E77F18] text-white"
//                         onClick={() => processCryptoPayment()}
//                       >
//                         <Bitcoin className="h-5 w-5 mr-2" />
//                         Generate Bitcoin Address
//                       </Button>
//                     )}
//                   </div>
//                   <div className="text-xs text-muted-foreground mt-4">
//                     <p className="flex items-start">
//                       <Info className="h-4 w-4 mr-1 shrink-0 mt-0.5" />
//                       Send exactly <span className="font-bold mx-1">{total.toFixed(2)} USD</span>
//                       worth of Bitcoin to this address. Current exchange rate: 1 BTC ≈ $59,783.21 USD
//                     </p>
//                   </div>
//                 </TabsContent>
//                 <TabsContent value="ethereum" className="space-y-4">
//                   <div className="flex flex-col items-center">
//                     {cryptoAddress ? (
//                       <>
//                         <div className="bg-white p-2 rounded-lg mb-3">
//                           <img
//                             src={`https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${cryptoAddress}&choe=UTF-8`}
//                             alt="Ethereum QR Code"
//                             className="h-40 w-40"
//                           />
//                         </div>
//                         <div className="text-sm text-center">
//                           <p className="font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded-md text-xs break-all mb-2">
//                             {cryptoAddress}
//                           </p>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             className="mt-1"
//                             onClick={() => {
//                               navigator.clipboard.writeText(cryptoAddress || "")
//                               toast({
//                                 title: "Address Copied",
//                                 description: "Ethereum address copied to clipboard",
//                                 variant: "default",
//                               })
//                             }}
//                           >
//                             <Copy className="h-4 w-4 mr-2" />
//                             Copy Address
//                           </Button>
//                         </div>
//                       </>
//                     ) : (
//                       <Button
//                         className="w-full bg-[#627EEA] hover:bg-[#4C63BB] text-white"
//                         onClick={() => processCryptoPayment()}
//                       >
//                         <Bitcoin className="h-5 w-5 mr-2" />
//                         Generate Ethereum Address
//                       </Button>
//                     )}
//                   </div>
//                   <div className="text-xs text-muted-foreground mt-4">
//                     <p className="flex items-start">
//                       <Info className="h-4 w-4 mr-1 shrink-0 mt-0.5" />
//                       Send exactly <span className="font-bold mx-1">{total.toFixed(2)} USD</span>
//                       worth of Ethereum to this address. Current exchange rate: 1 ETH ≈ $3,124.45 USD
//                     </p>
//                   </div>
//                 </TabsContent>
//                 <TabsContent value="other" className="py-3">
//                   <Select onValueChange={(value) => setCryptoCurrency(value)}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select cryptocurrency" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="solana">Solana (SOL)</SelectItem>
//                       <SelectItem value="cardano">Cardano (ADA)</SelectItem>
//                       <SelectItem value="ripple">Ripple (XRP)</SelectItem>
//                       <SelectItem value="polkadot">Polkadot (DOT)</SelectItem>
//                       <SelectItem value="dogecoin">Dogecoin (DOGE)</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <p className="text-sm text-muted-foreground mt-4">
//                     Select your preferred cryptocurrency to view payment instructions.
//                   </p>

//                   {cryptoCurrency && cryptoCurrency !== "bitcoin" && cryptoCurrency !== "ethereum" && (
//                     <Button
//                       className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white"
//                       onClick={() => processCryptoPayment()}
//                     >
//                       <Bitcoin className="h-5 w-5 mr-2" />
//                       Generate {cryptoCurrency.charAt(0).toUpperCase() + cryptoCurrency.slice(1)} Address
//                     </Button>
//                   )}
//                 </TabsContent>
//               </Tabs>
//             </div>

//             <div className="border rounded-lg p-4 bg-amber-50 dark:bg-amber-950/30 text-sm">
//               <div className="flex">
//                 <AlertCircle className="h-5 w-5 text-amber-600 mr-2 shrink-0" />
//                 <span>
//                   Please ensure you are sending the exact amount required. Cryptocurrency transactions cannot be
//                   reversed. Payment will be confirmed after 1-3 network confirmations.
//                 </span>
//               </div>
//             </div>
//           </div>
//         )

//       case "applepay":
//         return (
//           <div className="space-y-6">
//             <div className="text-center py-8">
//               <div className="bg-black text-white w-16 h-16 rounded-full mx-auto grid place-items-center mb-4">
//                 <Apple className="h-8 w-8" />
//               </div>
//               <h3 className="text-xl font-semibold">Pay with Apple Pay</h3>
//               <p className="text-muted-foreground mt-2 max-w-md mx-auto">
//                 Simple, secure payment with Face ID or Touch ID.
//               </p>
//             </div>

//             <div className="flex justify-center py-6">
//               <Button
//                 className="bg-black hover:bg-black/90 text-white rounded-full h-12 px-6"
//                 onClick={() => processApplePayPayment()}
//               >
//                 <Apple className="h-5 w-5 mr-2" />
//                 <span className="font-medium">Pay with Apple Pay</span>
//               </Button>
//             </div>

//             <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50 text-sm">
//               <div className="flex">
//                 <Info className="h-5 w-5 text-gray-500 mr-2 shrink-0" />
//                 <span>
//                   Apple Pay uses device-specific numbers and unique transaction codes, so your card number is never
//                   stored on your device or shared with merchants.
//                 </span>
//               </div>
//             </div>
//           </div>
//         )

//       case "googlepay":
//         return (
//           <div className="space-y-6">
//             <div className="text-center py-8">
//               <div className="bg-white border shadow-sm w-16 h-16 rounded-full mx-auto grid place-items-center mb-4">
//                 <GooglePay className="h-8 w-8" />
//               </div>
//               <h3 className="text-xl font-semibold">Pay with Google Pay</h3>
//               <p className="text-muted-foreground mt-2 max-w-md mx-auto">Fast, simple checkout with Google Pay.</p>
//             </div>

//             <div className="flex justify-center py-6">
//               <Button
//                 className="bg-white text-black hover:bg-gray-100 border shadow-sm h-12 px-6"
//                 onClick={() => processGooglePayPayment()}
//               >
//                 <GooglePay className="h-5 w-5 mr-2" />
//                 <span className="font-medium">Pay with Google Pay</span>
//               </Button>
//             </div>

//             <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-950/30 text-sm">
//               <div className="flex">
//                 <Info className="h-5 w-5 text-blue-500 mr-2 shrink-0" />
//                 <span>
//                   Google Pay encrypts your payment info with multiple layers of security using industry-standard methods
//                   like tokenization.
//                 </span>
//               </div>
//             </div>
//           </div>
//         )

//       case "bank":
//         return (
//           <div className="space-y-6">
//             <div className="text-center py-6">
//               <div className="bg-emerald-600 text-white w-16 h-16 rounded-full mx-auto grid place-items-center mb-4">
//                 <Landmark className="h-8 w-8" />
//               </div>
//               <h3 className="text-xl font-semibold">Bank Transfer</h3>
//               <p className="text-muted-foreground mt-2 max-w-md mx-auto">Transfer directly from your bank account.</p>
//             </div>

//             <div className="border rounded-lg p-5 bg-emerald-50 dark:bg-emerald-950/30 space-y-4">
//               <p className="font-medium">Payment details</p>
//               <div className="space-y-3">
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Account name:</span>
//                   <span className="font-medium">{process.env.BANK_ACCOUNT_NAME || "ACME Corporation"}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Account number:</span>
//                   <span className="font-mono font-medium">{process.env.BANK_ACCOUNT_NUMBER || "12345678"}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Routing number:</span>
//                   <span className="font-mono font-medium">{process.env.BANK_ROUTING_NUMBER || "987654321"}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">SWIFT/BIC:</span>
//                   <span className="font-mono font-medium">{process.env.BANK_SWIFT_CODE || "ABCDUS33"}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Reference:</span>
//                   <span className="font-mono font-medium">INV-{Date.now().toString().slice(-8)}</span>
//                 </div>
//               </div>

//               <div className="pt-2">
//                 <Button
//                   variant="outline"
//                   className="w-full"
//                   onClick={() => {
//                     const details = `
//                       Account name: ${process.env.BANK_ACCOUNT_NAME || "ACME Corporation"}
//                       Account number: ${process.env.BANK_ACCOUNT_NUMBER || "12345678"}
//                       Routing number: ${process.env.BANK_ROUTING_NUMBER || "987654321"}
//                       SWIFT/BIC: ${process.env.BANK_SWIFT_CODE || "ABCDUS33"}
//                       Reference: INV-${Date.now().toString().slice(-8)}
//                     `
//                     navigator.clipboard.writeText(details)
//                     toast({
//                       title: "Details Copied",
//                       description: "Bank details copied to clipboard",
//                       variant: "default",
//                     })
//                   }}
//                 >
//                   <Copy className="h-4 w-4 mr-2" />
//                   Copy Details
//                 </Button>
//               </div>
//             </div>

//             <div className="border rounded-lg p-4 bg-amber-50 dark:bg-amber-950/30 text-sm">
//               <div className="flex">
//                 <AlertCircle className="h-5 w-5 text-amber-600 mr-2 shrink-0" />
//                 <span>
//                   Please include the reference number in your transfer. Processing may take 1-3 business days. Your
//                   order will be confirmed once payment is received.
//                 </span>
//               </div>
//             </div>

//             <Button
//               className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
//               onClick={() => processBankTransferPayment()}
//             >
//               <Landmark className="h-5 w-5 mr-2" />
//               Generate Transfer Instructions
//             </Button>
//           </div>
//         )

//       case "giftcard":
//         return (
//           <div className="space-y-6">
//             <div className="text-center py-6">
//               <div className="bg-rose-600 text-white w-16 h-16 rounded-full mx-auto grid place-items-center mb-4">
//                 <Gift className="h-8 w-8" />
//               </div>
//               <h3 className="text-xl font-semibold">Gift Card</h3>
//               <p className="text-muted-foreground mt-2 max-w-md mx-auto">Redeem a gift card or promotional code.</p>
//             </div>

//             <div className="border rounded-lg p-5 space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="giftcard">Gift Card Number</Label>
//                 <Input
//                   id="giftcard"
//                   placeholder="XXXX-XXXX-XXXX-XXXX"
//                   value={giftCardCode}
//                   onChange={(e) => setGiftCardCode(e.target.value)}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="pin">PIN (if applicable)</Label>
//                 <Input
//                   id="pin"
//                   placeholder="1234"
//                   maxLength={4}
//                   value={giftCardPin}
//                   onChange={(e) => setGiftCardPin(e.target.value)}
//                 />
//               </div>

//               <Button className="w-full mt-2" onClick={() => checkGiftCardBalance()} disabled={!giftCardCode}>
//                 Check Balance
//               </Button>

//               {giftCardBalance !== null && (
//                 <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm font-medium">Available Balance:</span>
//                     <span className="font-bold">${giftCardBalance.toFixed(2)}</span>
//                   </div>

//                   {giftCardBalance < total && (
//                     <div className="mt-2 text-xs text-red-600 dark:text-red-400">
//                       Insufficient balance for this purchase. You need ${(total - giftCardBalance).toFixed(2)} more.
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50 text-sm">
//               <div className="flex">
//                 <Info className="h-5 w-5 text-gray-500 mr-2 shrink-0" />
//                 <span>
//                   Gift cards cannot be replaced if lost or stolen. Gift card balance will be applied to your purchase,
//                   and any remaining amount can be paid with another payment method.
//                 </span>
//               </div>
//             </div>
//           </div>
//         )

//       case "wallet":
//         return (
//           <div className="space-y-6">
//             <div className="text-center py-6">
//               <div className="bg-violet-600 text-white w-16 h-16 rounded-full mx-auto grid place-items-center mb-4">
//                 <Wallet className="h-8 w-8" />
//               </div>
//               <h3 className="text-xl font-semibold">Digital Wallet</h3>
//               <p className="text-muted-foreground mt-2 max-w-md mx-auto">
//                 Use your stored balance to complete this payment.
//               </p>
//             </div>

//             <div className="border rounded-lg p-5 bg-violet-50 dark:bg-violet-950/30 space-y-4">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Current Balance</p>
//                   <p className="text-2xl font-bold">${walletBalance?.toFixed(2) || "0.00"}</p>
//                 </div>
//                 <Button variant="outline" size="sm" onClick={() => getWalletBalance()}>
//                   <RefreshCcw className="h-4 w-4 mr-1" />
//                   Refresh
//                 </Button>
//               </div>

//               <Separator />

//               <div className="flex justify-between items-center">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Order Total</p>
//                   <p className="text-xl font-semibold">${total.toFixed(2)}</p>
//                 </div>
//                 {walletBalance !== null && (
//                   <Badge
//                     variant="outline"
//                     className={cn(
//                       walletBalance >= total
//                         ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
//                         : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
//                     )}
//                   >
//                     {walletBalance >= total ? "Sufficient Funds" : "Insufficient Funds"}
//                   </Badge>
//                 )}
//               </div>

//               <div className="pt-2">
//                 <Button
//                   className="w-full bg-violet-600 hover:bg-violet-700"
//                   disabled={!walletBalance || walletBalance < total}
//                   onClick={() => processWalletPayment()}
//                 >
//                   Pay from Wallet
//                 </Button>
//               </div>
//             </div>

//             <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50 text-sm">
//               <div className="flex">
//                 <Info className="h-5 w-5 text-gray-500 mr-2 shrink-0" />
//                 <span>
//                   Your digital wallet is protected with our secure encryption technologies. All transactions are instant
//                   and fee-free.
//                 </span>
//               </div>
//             </div>
//           </div>
//         )

//       default:
//         return null
//     }
//   }

//   // Payment methods array
//   const paymentMethods: PaymentMethod[] = [
//     {
//       id: "card",
//       name: "Credit Card",
//       icon: <CreditCard />,
//       description: "Pay with Visa, Mastercard, American Express, and more.",
//       popular: true,
//       processingTime: "Instant",
//       fees: "None",
//       color: "from-violet-600 to-indigo-600",
//     },
//     {
//       id: "paypal",
//       name: "PayPal",
//       icon: <PaypalLogo />,
//       description: "Pay with your PayPal account.",
//       popular: true,
//       processingTime: "Instant",
//       fees: "None",
//       color: "from-blue-500 to-blue-600",
//     },
//     {
//       id: "crypto",
//       name: "Crypto",
//       icon: <Bitcoin />,
//       description: "Pay with Bitcoin, Ethereum, and other cryptocurrencies.",
//       processingTime: "1-3 Confirmations",
//       fees: "Network fees apply",
//       color: "from-amber-500 to-amber-600",
//     },
//     {
//       id: "applepay",
//       name: "Apple Pay",
//       icon: <Apple />,
//       description: "Pay quickly and securely with Apple Pay.",
//       popular: true,
//       processingTime: "Instant",
//       fees: "None",
//       color: "from-gray-800 to-gray-900",
//     },
//     {
//       id: "googlepay",
//       name: "Google Pay",
//       icon: <GooglePay />,
//       description: "Fast, simple checkout with Google Pay.",
//       processingTime: "Instant",
//       fees: "None",
//       color: "from-blue-400 to-blue-500",
//     },
//     {
//       id: "bank",
//       name: "Bank Transfer",
//       icon: <BankTransfer />,
//       description: "Transfer directly from your bank account.",
//       processingTime: "1-3 Business Days",
//       fees: "None",
//       color: "from-emerald-500 to-emerald-600",
//     },
//     {
//       id: "giftcard",
//       name: "Gift Card",
//       icon: <Gift />,
//       description: "Redeem a gift card or promotional code.",
//       processingTime: "Instant",
//       fees: "None",
//       color: "from-rose-500 to-rose-600",
//     },
//     {
//       id: "wallet",
//       name: "Wallet",
//       icon: <Wallet />,
//       description: "Pay using your digital wallet balance.",
//       processingTime: "Instant",
//       fees: "None",
//       color: "from-violet-500 to-violet-600",
//     },
//   ]

//   // Function to move to the next form step
//   const continueTo = (step: number) => {
//     setFormStep(step)
//   }

//   // Wrap the entire payment page in Stripe Elements provider
//   return (
//     <Elements stripe={stripePromise}>
//       <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex flex-col">
//         {/* Header */}
//         <header className="border-b bg-white dark:bg-gray-950 dark:border-gray-800 sticky top-0 z-10">
//           <div className="container mx-auto px-4 py-4 flex justify-between items-center">
//             <div className="flex items-center">
//               <div className="flex items-center">
//                 <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 grid place-items-center text-white mr-2">
//                   <Sparkles className="h-4 w-4" />
//                 </div>
//                 <span className="font-bold text-lg">PayFlow</span>
//               </div>
//               <div className="hidden md:flex ml-8">
//                 <Badge variant="outline" className="font-normal">
//                   <Lock className="h-3 w-3 mr-1" />
//                   Secure Checkout
//                 </Badge>
//               </div>
//             </div>

//             <div className="flex items-center">
//               <div className="mr-4 text-sm">
//                 <TooltipProvider>
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <div className="flex items-center cursor-help">
//                         <Shield className="h-4 w-4 mr-1 text-green-600 dark:text-green-500" />
//                         <span className="hidden sm:inline">256-bit SSL Encrypted</span>
//                       </div>
//                     </TooltipTrigger>
//                     <TooltipContent className="max-w-sm">
//                       <p>This checkout is secured with industry-standard encryption to keep your information safe.</p>
//                     </TooltipContent>
//                   </Tooltip>
//                 </TooltipProvider>
//               </div>

//               <div>
//                 <Button variant="ghost" size="sm" className="hidden md:flex">
//                   <ThumbsUp className="h-4 w-4 mr-1" />
//                   Need Help?
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </header>

//         <div className="flex-1 container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-8">
//             <div className="space-y-1">
//               <h1 className="text-2xl font-bold">Complete Your Purchase</h1>
//               <p className="text-muted-foreground">
//                 Select your preferred payment method and complete the details below.
//               </p>
//             </div>

//             {/* Form Steps */}
//             <form onSubmit={handleSubmit} className="space-y-8">
//               {/* Progress indicator */}
//               <div className="flex items-center justify-between relative">
//                 <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200 dark:bg-gray-800"></div>
//                 {["Payment Method", "Details", "Confirmation"].map((step, index) => (
//                   <div key={index} className="relative z-10 flex flex-col items-center">
//                     <div
//                       className={cn(
//                         "w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm mb-1",
//                         formStep > index
//                           ? "bg-green-600 text-white"
//                           : formStep === index
//                             ? "bg-primary text-white"
//                             : "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400",
//                       )}
//                     >
//                       {formStep > index ? <Check className="h-4 w-4" /> : index + 1}
//                     </div>
//                     <span
//                       className={cn(
//                         "text-xs",
//                         formStep === index ? "font-medium text-primary" : "text-muted-foreground",
//                       )}
//                     >
//                       {step}
//                     </span>
//                   </div>
//                 ))}
//               </div>

//               {/* Step 1: Payment Method Selection */}
//               <AnimatePresence mode="wait">
//                 {formStep === 0 && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -10 }}
//                     transition={{ duration: 0.2 }}
//                     className="space-y-6"
//                   >
//                     {/* Payment method selection */}
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                       {paymentMethods.slice(0, 4).map((method) => (
//                         <div
//                           key={method.id}
//                           className={cn(
//                             "relative rounded-lg border overflow-hidden cursor-pointer transition-all hover:border-primary/60 hover:shadow-md",
//                             paymentMethod === method.id
//                               ? "border-primary shadow-sm shadow-primary/20 bg-gray-50 dark:bg-gray-900"
//                               : "border-gray-200 dark:border-gray-800",
//                           )}
//                           onClick={() => setPaymentMethod(method.id)}
//                         >
//                           {method.popular && (
//                             <div className="absolute top-0 right-0">
//                               <Badge className="rounded-bl-lg rounded-tr-lg rounded-br-none rounded-tl-none bg-gradient-to-r from-violet-600 to-indigo-600 border-0 text-[10px] font-medium">
//                                 POPULAR
//                               </Badge>
//                             </div>
//                           )}
//                           <div
//                             className={cn(
//                               "flex flex-col items-center p-4 h-full",
//                               paymentMethod === method.id && "bg-primary/5",
//                             )}
//                           >
//                             <PaymentMethodIcon method={method.id} selected={paymentMethod === method.id} />
//                             <span className="mt-3 text-center text-sm font-medium">{method.name}</span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>

//                     <div>
//                       <div className="flex items-center justify-between mb-4">
//                         <h3 className="text-sm font-medium text-muted-foreground">More Payment Options</h3>
//                         <Separator className="flex-1 mx-4" />
//                       </div>

//                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                         {paymentMethods.slice(4).map((method) => (
//                           <div
//                             key={method.id}
//                             className={cn(
//                               "rounded-lg border overflow-hidden cursor-pointer transition-all hover:border-primary/60 hover:shadow-md",
//                               paymentMethod === method.id
//                                 ? "border-primary shadow-sm shadow-primary/20 bg-gray-50 dark:bg-gray-900"
//                                 : "border-gray-200 dark:border-gray-800",
//                             )}
//                             onClick={() => setPaymentMethod(method.id)}
//                           >
//                             <div
//                               className={cn(
//                                 "flex flex-col items-center p-4",
//                                 paymentMethod === method.id && "bg-primary/5",
//                               )}
//                             >
//                               <PaymentMethodIcon method={method.id} selected={paymentMethod === method.id} />
//                               <span className="mt-3 text-center text-sm font-medium">{method.name}</span>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border p-4 mt-6">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center">
//                           {paymentMethod && <PaymentMethodIcon method={paymentMethod} selected={true} size="large" />}
//                           <div className="ml-4">
//                             <h3 className="font-medium">
//                               {paymentMethods.find((m) => m.id === paymentMethod)?.name || "Select a payment method"}
//                             </h3>
//                             <p className="text-sm text-muted-foreground">
//                               {paymentMethods.find((m) => m.id === paymentMethod)?.description}
//                             </p>
//                           </div>
//                         </div>
//                         <Button
//                           type="button"
//                           onClick={() => continueTo(1)}
//                           disabled={!paymentMethod}
//                           className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
//                         >
//                           Continue
//                           <ChevronRight className="h-4 w-4 ml-1" />
//                         </Button>
//                       </div>
//                     </div>

//                     {/* Payment Method Comparison Table */}
//                     <Drawer>
//                       <DrawerTrigger asChild>
//                         <Button variant="outline" className="w-full">
//                           Compare Payment Methods
//                           <ChevronsUpDown className="h-4 w-4 ml-1" />
//                         </Button>
//                       </DrawerTrigger>
//                       <DrawerContent>
//                         <div className="mx-auto w-full max-w-4xl">
//                           <DrawerHeader>
//                             <DrawerTitle>Payment Method Comparison</DrawerTitle>
//                             <DrawerDescription>
//                               Compare the features and benefits of each payment method
//                             </DrawerDescription>
//                           </DrawerHeader>
//                           <div className="p-4 overflow-auto">
//                             <table className="w-full border-collapse">
//                               <thead>
//                                 <tr className="border-b">
//                                   <th className="text-left p-3">Payment Method</th>
//                                   <th className="text-left p-3">Processing Time</th>
//                                   <th className="text-left p-3">Fees</th>
//                                   <th className="text-left p-3">Security</th>
//                                   <th className="text-left p-3">Benefits</th>
//                                 </tr>
//                               </thead>
//                               <tbody>
//                                 {paymentMethods.map((method) => (
//                                   <tr key={method.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-900">
//                                     <td className="p-3">
//                                       <div className="flex items-center">
//                                         <div
//                                           className={`p-1.5 rounded-full bg-gradient-to-r ${method.color} text-white mr-2`}
//                                         >
//                                           {method.icon}
//                                         </div>
//                                         <span className="font-medium">{method.name}</span>
//                                       </div>
//                                     </td>
//                                     <td className="p-3">{method.processingTime}</td>
//                                     <td className="p-3">{method.fees}</td>
//                                     <td className="p-3">
//                                       <div className="flex items-center">
//                                         <div className="flex space-x-0.5">
//                                           {Array.from({ length: 5 }).map((_, i) => (
//                                             <Star
//                                               key={i}
//                                               className={cn(
//                                                 "h-4 w-4",
//                                                 i < (method.id === "crypto" ? 4 : 5)
//                                                   ? "text-amber-500 fill-amber-500"
//                                                   : "text-gray-300 dark:text-gray-600",
//                                               )}
//                                             />
//                                           ))}
//                                         </div>
//                                       </div>
//                                     </td>
//                                     <td className="p-3">
//                                       <span>
//                                         {method.id === "card" && "Widely accepted, rewards programs"}
//                                         {method.id === "paypal" && "Buyer protection, no need to share card details"}
//                                         {method.id === "crypto" && "Privacy, no chargebacks, global payments"}
//                                         {method.id === "applepay" && "Fast checkout, biometric security"}
//                                         {method.id === "googlepay" && "Fast checkout, stored payment methods"}
//                                         {method.id === "bank" && "No card needed, good for large payments"}
//                                         {method.id === "giftcard" && "Great for gifts, budgeting control"}
//                                         {method.id === "wallet" && "No additional payment method needed"}
//                                       </span>
//                                     </td>
//                                   </tr>
//                                 ))}
//                               </tbody>
//                             </table>
//                           </div>
//                           <DrawerFooter>
//                             <DrawerClose asChild>
//                               <Button variant="outline">Close</Button>
//                             </DrawerClose>
//                           </DrawerFooter>
//                         </div>
//                       </DrawerContent>
//                     </Drawer>
//                   </motion.div>
//                 )}

//                 {/* Step 2: Payment Details */}
//                 {formStep === 1 && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -10 }}
//                     transition={{ duration: 0.2 }}
//                     className="space-y-6"
//                   >
//                     <div className="flex items-center justify-between">
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         onClick={() => setFormStep(0)}
//                         className="text-muted-foreground"
//                       >
//                         <ChevronLeft className="h-4 w-4 mr-1" />
//                         Back to Payment Methods
//                       </Button>
//                       <div className="flex items-center">
//                         <PaymentMethodIcon method={paymentMethod} selected={true} />
//                         <span className="ml-2 font-medium">
//                           {paymentMethods.find((m) => m.id === paymentMethod)?.name}
//                         </span>
//                       </div>
//                     </div>

//                     <Card>
//                       <CardContent className="pt-6">
//                         {/* Render the appropriate payment form based on method */}
//                         {renderPaymentMethodForm()}
//                       </CardContent>
//                     </Card>

//                     {paymentError && (
//                       <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
//                         <div className="flex items-start">
//                           <AlertCircle className="h-5 w-5 mr-2 shrink-0" />
//                           <span>{paymentError}</span>
//                         </div>
//                       </div>
//                     )}

//                     <div className="pt-4 flex items-center justify-between">
//                       <Button type="button" variant="outline" onClick={() => setFormStep(0)}>
//                         <ChevronLeft className="h-4 w-4 mr-1" />
//                         Back
//                       </Button>
//                       <Button
//                         type="submit"
//                         disabled={!isFormValid() || paymentProcessing}
//                         className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
//                       >
//                         {paymentProcessing ? (
//                           <>
//                             <Timer className="h-4 w-4 mr-2 animate-spin" />
//                             Processing...
//                           </>
//                         ) : (
//                           <>
//                             Continue to Review
//                             <ChevronRight className="h-4 w-4 ml-1" />
//                           </>
//                         )}
//                       </Button>
//                     </div>
//                   </motion.div>
//                 )}

//                 {/* Step 3: Confirmation */}
//                 {formStep === 2 && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -10 }}
//                     transition={{ duration: 0.2 }}
//                     className="space-y-6"
//                   >
//                     {paymentComplete ? (
//                       <div className="text-center py-10 relative">
//                         {!animationComplete && <Particles count={100} />}
//                         <motion.div
//                           initial={{ scale: 0 }}
//                           animate={{ scale: 1 }}
//                           transition={{ type: "spring", duration: 0.5 }}
//                           className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mx-auto grid place-items-center mb-4"
//                         >
//                           <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
//                         </motion.div>
//                         <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
//                         <p className="text-muted-foreground max-w-md mx-auto mb-6">
//                           Your payment has been processed successfully. You will receive a confirmation email shortly.
//                         </p>
//                         <div className="border rounded-lg p-4 max-w-md mx-auto bg-gray-50 dark:bg-gray-900">
//                           <div className="flex justify-between mb-2">
//                             <span className="text-muted-foreground">Transaction ID:</span>
//                             <span className="font-medium">
//                               {transactionId || "TRX-" + Math.random().toString(36).substring(2, 10).toUpperCase()}
//                             </span>
//                           </div>
//                           <div className="flex justify-between mb-2">
//                             <span className="text-muted-foreground">Payment Method:</span>
//                             <span className="font-medium">
//                               {paymentMethods.find((m) => m.id === paymentMethod)?.name}
//                             </span>
//                           </div>
//                           <div className="flex justify-between mb-2">
//                             <span className="text-muted-foreground">Amount:</span>
//                             <span className="font-bold">${total.toFixed(2)}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-muted-foreground">Date:</span>
//                             <span className="font-medium">{new Date().toLocaleDateString()}</span>
//                           </div>
//                         </div>
//                         <div className="mt-8">
//                           <Button
//                             type="button"
//                             className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
//                             onClick={() => (window.location.href = "/dashboard")}
//                           >
//                             Continue to Your Account
//                             <ArrowRight className="h-4 w-4 ml-2" />
//                           </Button>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="space-y-6">
//                         <div className="flex items-center justify-between">
//                           <Button
//                             type="button"
//                             variant="ghost"
//                             onClick={() => setFormStep(1)}
//                             className="text-muted-foreground"
//                           >
//                             <ChevronLeft className="h-4 w-4 mr-1" />
//                             Back to Payment
//                           </Button>
//                           <div className="flex items-center">
//                             <PaymentMethodIcon method={paymentMethod} selected={true} />
//                             <span className="ml-2 font-medium">
//                               {paymentMethods.find((m) => m.id === paymentMethod)?.name}
//                             </span>
//                           </div>
//                         </div>

//                         <Card>
//                           <CardHeader>
//                             <CardTitle>Review & Confirm</CardTitle>
//                             <CardDescription>Please review your payment details before confirming</CardDescription>
//                           </CardHeader>
//                           <CardContent className="space-y-6">
//                             <div className="space-y-4">
//                               <div className="flex justify-between pb-2 border-b">
//                                 <h3 className="font-medium">Payment Details</h3>
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   onClick={() => setFormStep(1)}
//                                   className="h-auto p-0 text-primary hover:text-primary/80"
//                                 >
//                                   Edit
//                                 </Button>
//                               </div>

//                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <div>
//                                   <h4 className="text-sm text-muted-foreground mb-1">Payment Method</h4>
//                                   <div className="flex items-center">
//                                     <PaymentMethodIcon method={paymentMethod} selected={true} />
//                                     <span className="ml-2 font-medium">
//                                       {paymentMethods.find((m) => m.id === paymentMethod)?.name}
//                                     </span>
//                                   </div>
//                                 </div>

//                                 {paymentMethod === "card" && (
//                                   <>
//                                     <div>
//                                       <h4 className="text-sm text-muted-foreground mb-1">Card Number</h4>
//                                       <div className="font-medium">•••• •••• •••• {cardNumber.slice(-4)}</div>
//                                     </div>
//                                     <div>
//                                       <h4 className="text-sm text-muted-foreground mb-1">Card Holder</h4>
//                                       <div className="font-medium">{cardName}</div>
//                                     </div>
//                                     <div>
//                                       <h4 className="text-sm text-muted-foreground mb-1">Expiry Date</h4>
//                                       <div className="font-medium">{expiryDate}</div>
//                                     </div>
//                                   </>
//                                 )}
//                               </div>
//                             </div>

//                             <Separator />

//                             <div className="space-y-4">
//                               <div className="flex justify-between pb-2 border-b">
//                                 <h3 className="font-medium">Billing Summary</h3>
//                               </div>

//                               <div className="space-y-2">
//                                 {items.map((item, index) => (
//                                   <div key={index} className="flex justify-between items-center">
//                                     <div className="flex items-center">
//                                       <span>{item.name}</span>
//                                       {item.waived && (
//                                         <Badge
//                                           variant="outline"
//                                           className="ml-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
//                                         >
//                                           Waived
//                                         </Badge>
//                                       )}
//                                       {item.saving && (
//                                         <Badge
//                                           variant="outline"
//                                           className="ml-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
//                                         >
//                                           Save {item.saving}
//                                         </Badge>
//                                       )}
//                                     </div>
//                                     <span className="font-medium">
//                                       ${item.price === 0 ? "0.00" : item.price.toFixed(2)}
//                                     </span>
//                                   </div>
//                                 ))}

//                                 <Separator className="my-2" />

//                                 <div className="flex justify-between">
//                                   <span className="text-muted-foreground">Subtotal</span>
//                                   <span className="font-medium">${subtotal.toFixed(2)}</span>
//                                 </div>

//                                 {useSpecialOffer && (
//                                   <div className="flex justify-between text-green-600 dark:text-green-400">
//                                     <span>Special Offer Discount</span>
//                                     <span>-$25.00</span>
//                                   </div>
//                                 )}

//                                 <div className="flex justify-between">
//                                   <span className="text-muted-foreground">Tax (8%)</span>
//                                   <span className="font-medium">${tax.toFixed(2)}</span>
//                                 </div>

//                                 <Separator className="my-2" />

//                                 <div className="flex justify-between text-lg">
//                                   <span className="font-bold">Total</span>
//                                   <span className="font-bold">${total.toFixed(2)}</span>
//                                 </div>
//                               </div>
//                             </div>

//                             {paymentError && (
//                               <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
//                                 <div className="flex items-start">
//                                   <AlertCircle className="h-5 w-5 mr-2 shrink-0" />
//                                   <span>{paymentError}</span>
//                                 </div>
//                               </div>
//                             )}

//                             <div className="pt-4 space-y-4">
//                               <div className="flex items-center space-x-2">
//                                 <Checkbox id="terms" required />
//                                 <label
//                                   htmlFor="terms"
//                                   className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                                 >
//                                   I agree to the{" "}
//                                   <a href="/terms" className="text-primary underline hover:text-primary/90">
//                                     Terms and Conditions
//                                   </a>{" "}
//                                   and{" "}
//                                   <a href="/privacy" className="text-primary underline hover:text-primary/90">
//                                     Privacy Policy
//                                   </a>
//                                 </label>
//                               </div>

//                               <div className="flex items-center space-x-2">
//                                 <Checkbox
//                                   id="subscribe"
//                                   checked={useSpecialOffer}
//                                   onCheckedChange={(checked) => setUseSpecialOffer(!!checked)}
//                                 />
//                                 <div className="grid gap-1.5 leading-none">
//                                   <label
//                                     htmlFor="subscribe"
//                                     className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
//                                   >
//                                     Apply Special Offer Code
//                                     <Badge className="ml-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
//                                       $25 OFF
//                                     </Badge>
//                                   </label>
//                                   <p className="text-sm text-muted-foreground">
//                                     Special discount for first-time customers
//                                   </p>
//                                 </div>
//                               </div>
//                             </div>
//                           </CardContent>
//                           <CardFooter className="flex justify-between">
//                             <Button type="button" variant="outline" onClick={() => setFormStep(1)}>
//                               <ChevronLeft className="h-4 w-4 mr-1" />
//                               Back
//                             </Button>
//                             <Button
//                               type="submit"
//                               disabled={paymentProcessing}
//                               className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
//                             >
//                               {paymentProcessing ? (
//                                 <>
//                                   <Timer className="h-4 w-4 mr-2 animate-spin" />
//                                   Processing Payment...
//                                 </>
//                               ) : (
//                                 <>
//                                   Confirm Payment
//                                   <Lock className="h-4 w-4 ml-1" />
//                                 </>
//                               )}
//                             </Button>
//                           </CardFooter>
//                         </Card>
//                       </div>
//                     )}
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </form>
//           </div>

//           {/* Order Summary Sidebar */}
//           <AnimatePresence>
//             {(sidebarVisible || showOrderSummary) && (
//               <motion.div
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: 20 }}
//                 transition={{ duration: 0.2 }}
//                 className="lg:block bg-gray-50 dark:bg-gray-900 rounded-xl border p-6 h-fit sticky top-24"
//               >
//                 <div className="flex justify-between items-center mb-6">
//                   <h2 className="font-bold text-lg">Order Summary</h2>
//                   {mobileView && (
//                     <Button variant="ghost" size="sm" onClick={() => setShowOrderSummary(false)} className="lg:hidden">
//                       <X className="h-4 w-4" />
//                     </Button>
//                   )}
//                 </div>

//                 <div className="space-y-4">
//                   {items.map((item, index) => (
//                     <div key={index} className="flex justify-between">
//                       <div>
//                         <div className="font-medium">{item.name}</div>
//                         <div className="flex mt-1">
//                           {item.waived && (
//                             <Badge
//                               variant="outline"
//                               className="text-[10px] text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
//                             >
//                               Waived
//                             </Badge>
//                           )}
//                           {item.saving && (
//                             <Badge
//                               variant="outline"
//                               className="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
//                             >
//                               Save {item.saving}
//                             </Badge>
//                           )}
//                         </div>
//                       </div>
//                       <span className="font-medium">${item.price === 0 ? "0.00" : item.price.toFixed(2)}</span>
//                     </div>
//                   ))}

//                   <Separator />

//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Subtotal</span>
//                     <span className="font-medium">${subtotal.toFixed(2)}</span>
//                   </div>

//                   {useSpecialOffer && (
//                     <div className="flex justify-between text-green-600 dark:text-green-400">
//                       <span>Special Offer Discount</span>
//                       <span>-$25.00</span>
//                     </div>
//                   )}

//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Tax (8%)</span>
//                     <span className="font-medium">${tax.toFixed(2)}</span>
//                   </div>

//                   <Separator />

//                   <div className="flex justify-between text-lg">
//                     <span className="font-bold">Total</span>
//                     <span className="font-bold">${total.toFixed(2)}</span>
//                   </div>

//                   <div className="pt-2 text-sm text-muted-foreground space-y-2">
//                     <div className="flex items-center">
//                       <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mr-1 shrink-0" />
//                       <span>Secure 256-bit SSL encryption</span>
//                     </div>
//                     <div className="flex items-center">
//                       <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mr-1 shrink-0" />
//                       <span>Data protection & privacy</span>
//                     </div>
//                     <div className="flex items-center">
//                       <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mr-1 shrink-0" />
//                       <span>Money-back guarantee</span>
//                     </div>
//                   </div>

//                   {mobileView && (
//                     <Button
//                       className="w-full mt-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
//                       onClick={() => setShowOrderSummary(false)}
//                     >
//                       Continue
//                       <ChevronRight className="h-4 w-4 ml-1" />
//                     </Button>
//                   )}
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>

//         {mobileView && !showOrderSummary && (
//           <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-950 border-t dark:border-gray-800 flex items-center justify-between z-10">
//             <div>
//               <div className="text-sm text-muted-foreground">Total</div>
//               <div className="font-bold text-lg">${total.toFixed(2)}</div>
//             </div>
//             <Button
//               onClick={() => setShowOrderSummary(true)}
//               className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
//             >
//               View Summary
//               <ChevronRight className="h-4 w-4 ml-1" />
//             </Button>
//           </div>
//         )}
//       </div>
//     </Elements>
//   )
// }

// export default PaymentPage

// "use client"

// import type React from "react"

// import { useState, useEffect, useRef, type FormEvent } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { useRouter } from "next/navigation"
// import { cn } from "@/lib/utils"
// import {
//   CreditCard,
//   DollarSignIcon as PaypalLogo,
//   Bitcoin,
//   Apple,
//   BanknoteIcon as BankTransfer,
//   Gift,
//   ChevronsUpDown,
//   Wallet,
//   AlertCircle,
//   CreditCardIcon as GooglePay,
//   CheckCircle2,
//   RefreshCcw,
//   Copy,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Separator } from "@/components/ui/separator"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Checkbox } from "@/components/ui/checkbox"
// import { useToast } from "@/hooks/use-toast"

// // Import server actions
// import { onSubscribe, onCurrentUser, onUserInfo } from "@/actions/user/index"

// // Card types for validation and display
// const CARD_TYPES = {
//   visa: {
//     pattern: /^4/,
//     icon: "/assets/payment/visa.svg",
//   },
//   mastercard: {
//     pattern: /^5[1-5]/,
//     icon: "/assets/payment/mastercard.svg",
//   },
//   amex: {
//     pattern: /^3[47]/,
//     icon: "/assets/payment/amex.svg",
//   },
//   discover: {
//     pattern: /^(6011|65|64[4-9]|622)/,
//     icon: "/assets/payment/discover.svg",
//   },
// }

// interface PaymentMethod {
//   id: string
//   name: string
//   icon: React.ReactNode
//   description: string
//   popular?: boolean
//   processingTime: string
//   fees: string
//   color: string
// }

// interface PaymentResult {
//   success: boolean
//   transactionId?: string
//   sessionId?: string
//   error?: string
//   last4?: string
//   paymentAddress?: string
//   expiresAt?: string
//   redemptionId?: string
// }

// interface OrderItem {
//   name: string
//   price: number
//   saving?: string
//   waived?: boolean
//   included?: boolean
// }

// interface PaymentPageProps {
//   selectedPlan: {
//     id: string
//     name: string
//     price: number
//     billingCycle: "monthly" | "annually"
//     description: string
//   }
// }

// const PaymentMethodIcon = ({
//   method,
//   selected,
//   size = "default",
// }: {
//   method: string
//   selected: boolean
//   size?: "default" | "large"
// }) => {
//   const icons: Record<string, React.ReactNode> = {
//     card: <CreditCard className={size === "large" ? "h-8 w-8" : "h-5 w-5"} />,
//     paypal: <PaypalLogo className={size === "large" ? "h-8 w-8" : "h-5 w-5"} />,
//     crypto: <Bitcoin className={size === "large" ? "h-8 w-8" : "h-5 w-5"} />,
//     applepay: <Apple className={size === "large" ? "h-8 w-8" : "h-5 w-5"} />,
//     googlepay: <GooglePay className={size === "large" ? "h-8 w-8" : "h-5 w-5"} />,
//     bank: <BankTransfer className={size === "large" ? "h-8 w-8" : "h-5 w-5"} />,
//     giftcard: <Gift className={size === "large" ? "h-8 w-8" : "h-5 w-5"} />,
//     wallet: <Wallet className={size === "large" ? "h-8 w-8" : "h-5 w-5"} />,
//   }

//   return (
//     <div
//       className={cn(
//         "flex items-center justify-center rounded-full transition-all",
//         size === "large" ? "h-16 w-16 p-3" : "h-10 w-10 p-2",
//         selected
//           ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/20"
//           : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400",
//       )}
//     >
//       {icons[method]}
//     </div>
//   )
// }

// // Main payment component
// const PaymentPage = ({ selectedPlan }: PaymentPageProps) => {
//   const router = useRouter()
//   const [user, setUser] = useState<any>(null)
//   const [isSignedIn, setIsSignedIn] = useState(false)
//   const [userProfile, setUserProfile] = useState<any>(null)
//   const { toast } = useToast()

//   // State variables
//   const [paymentMethod, setPaymentMethod] = useState<string>("card")
//   const [formStep, setFormStep] = useState<number>(0)
//   const [flipCard, setFlipCard] = useState(false)
//   const [cardName, setCardName] = useState("")
//   const [cardNumber, setCardNumber] = useState("")
//   const [expiryDate, setExpiryDate] = useState("")
//   const [cvv, setCvv] = useState("")
//   const [saveCard, setSaveCard] = useState(false)
//   const [useSpecialOffer, setUseSpecialOffer] = useState(false)
//   const [showOrderSummary, setShowOrderSummary] = useState(false)
//   const [animationComplete, setAnimationComplete] = useState(false)
//   const [cardType, setCardType] = useState<keyof typeof CARD_TYPES | null>(null)
//   const [sidebarVisible, setSidebarVisible] = useState(true)
//   const [mobileView, setMobileView] = useState(false)
//   const [paymentProcessing, setPaymentProcessing] = useState(false)
//   const [paymentComplete, setPaymentComplete] = useState(false)
//   const [paymentError, setPaymentError] = useState<string | null>(null)
//   const [clientSecret, setClientSecret] = useState<string | null>(null)
//   const [paymentIntent, setPaymentIntent] = useState<string | null>(null)
//   const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "succeeded" | "failed">("idle")
//   const [transactionId, setTransactionId] = useState<string | null>(null)
//   const [walletBalance, setWalletBalance] = useState<number | null>(null)
//   const [paymentRequest, setPaymentRequest] = useState<any>(null)
//   const [giftCardCode, setGiftCardCode] = useState("")
//   const [giftCardPin, setGiftCardPin] = useState("")
//   const [giftCardBalance, setGiftCardBalance] = useState<number | null>(null)
//   const [cryptoCurrency, setCryptoCurrency] = useState("bitcoin")
//   const [cryptoAddress, setCryptoAddress] = useState<string | null>(null)

//   // Refs for form elements
//   const cardNumberRef = useRef<HTMLInputElement>(null)
//   const expiryRef = useRef<HTMLInputElement>(null)
//   const cvvRef = useRef<HTMLInputElement>(null)

//   // Order items and pricing based on selected plan
//   const items: OrderItem[] = [
//     { 
//       name: `${selectedPlan.name} Plan (${selectedPlan.billingCycle === "annually" ? "Annual" : "Monthly"})`, 
//       price: selectedPlan.price, 
//       saving: selectedPlan.billingCycle === "annually" ? "15%" : undefined 
//     },
//     { name: "Setup Fee", price: 0, waived: true },
//   ]

//   // Add priority support for Pro and Enterprise plans
//   if (selectedPlan.id === "PRO" || selectedPlan.id === "enterprise") {
//     items.push({ name: "Priority Support", price: 0, included: true })
//   }

//   const subtotal = items.reduce((acc, item) => acc + item.price, 0)
//   const discount = useSpecialOffer ? 25 : 0
//   const tax = (subtotal - discount) * 0.08
//   const total = subtotal - discount + tax

//   // Create payment intent when component loads or discount changes
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       createPaymentIntent()
//     }
//   }, [useSpecialOffer])

//   // Create payment intent
//   const createPaymentIntent = async () => {
//     try {
//       setPaymentError(null)

//       const response = await fetch("/api/create-payment-intent", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           amount: Math.round(total * 100), // Convert to cents for Stripe
//           currency: "usd",
//           payment_method_types: ["card"],
//           metadata: {
//             order_items: JSON.stringify(items),
//             discount_applied: useSpecialOffer,
//             planId: selectedPlan.id,
//             billingCycle: selectedPlan.billingCycle,
//             userId: user?.id || "guest",
//           },
//         }),
//       })

//       if (!response.ok) {
//         throw new Error("Failed to create payment intent")
//       }

//       const data = await response.json()
//       setClientSecret(data.clientSecret)
//       setPaymentIntent(data.id)
//     } catch (error) {
//       console.error("Error creating payment intent:", error)
//       setPaymentError("Failed to initialize payment. Please try again.")

//       toast({
//         title: "Payment Error",
//         description: "Failed to initialize payment. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   // Handle form submission
//   const handleSubmit = async (event: FormEvent) => {
//     event.preventDefault()

//     if (formStep === 1 && paymentMethod === "card") {
//       // Move to review step
//       continueTo(2)
//     } else if (formStep === 2) {
//       // Process the payment
//       await processPayment()
//     }
//   }

//   // Process payment based on selected method
//   const processPayment = async () => {
//     setPaymentProcessing(true)
//     setPaymentStatus("processing")
//     setPaymentError(null)

//     try {
//       let paymentResult: PaymentResult

//       switch (paymentMethod) {
//         case "card":
//           paymentResult = await processCardPayment()
//           break
//         case "paypal":
//           paymentResult = await processPayPalPayment()
//           break
//         case "crypto":
//           paymentResult = await processCryptoPayment()
//           break
//         case "applepay":
//           paymentResult = await processApplePayPayment()
//           break
//         case "googlepay":
//           paymentResult = await processGooglePayPayment()
//           break
//         case "bank":
//           paymentResult = await processBankTransferPayment()
//           break
//         case "giftcard":
//           paymentResult = await processGiftCardPayment()
//           break
//         case "wallet":
//           paymentResult = await processWalletPayment()
//           break
//         default:
//           throw new Error("Invalid payment method")
//       }

//       if (paymentResult.success) {
//         setTransactionId(paymentResult.transactionId || null)
//         setPaymentStatus("succeeded")
//         setPaymentComplete(true)
//         setFormStep(2)

//         // If we have a session ID (from Stripe), update the user's subscription
//         if (paymentResult.sessionId) {
//           try {
//             const subscriptionResult = await onSubscribe(paymentResult.sessionId)
//             if (subscriptionResult.status === 200) {
//               console.log("Subscription updated successfully")
//             } else {
//               console.warn("Subscription update failed:", subscriptionResult)
//             }
//           } catch (error) {
//             console.error("Error updating subscription:", error)
//           }
//         }

//         toast({
//           title: "Payment Successful",
//           description: "Your payment has been processed successfully.",
//           variant: "default",
//           className:
//             "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300",
//         })
//       } else {
//         throw new Error(paymentResult.error || "Payment failed")
//       }
//     } catch (error) {
//       console.error("Payment processing error:", error)
//       setPaymentStatus("failed")
//       const errorMessage = error instanceof Error ? error.message : "Payment processing failed. Please try again."
//       setPaymentError(errorMessage)

//       toast({
//         title: "Payment Failed",
//         description: errorMessage,
//         variant: "destructive",
//       })
//     } finally {
//       setPaymentProcessing(false)
//     }
//   }

//   // Process card payment
//   const processCardPayment = async (): Promise<PaymentResult> => {
//     // This will be implemented in the CardPaymentForm component
//     return { success: true, transactionId: "card-" + Date.now() }
//   }

//   // Process PayPal payment
//   const processPayPalPayment = async (): Promise<PaymentResult> => {
//     // Redirect to PayPal for payment
//     window.location.href = `/api/paypal/create-order?amount=${total}&currency=USD&planId=${selectedPlan.id}&billingCycle=${selectedPlan.billingCycle}`
//     return { success: true }
//   }

//   // Process cryptocurrency payment
//   const processCryptoPayment = async (): Promise<PaymentResult> => {
//     try {
//       const response = await fetch("/api/crypto/create-charge", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           amount: total,
//           currency: "USD",
//           name: `${selectedPlan.name} Plan Purchase`,
//           customerId: user?.id || "guest",
//           planId: selectedPlan.id,
//           billingCycle: selectedPlan.billingCycle
//         }),
//       })

//       if (!response.ok) {
//         throw new Error("Failed to create crypto payment")
//       }

//       const data = await response.json()

//       setCryptoAddress(data.addresses[cryptoCurrency])

//       return {
//         success: true,
//         transactionId: data.id,
//         paymentAddress: data.addresses[cryptoCurrency],
//         expiresAt: data.expires_at,
//       }
//     } catch (error) {
//       console.error("Crypto payment error:", error)
//       return { success: false, error: "Failed to process cryptocurrency payment" }
//     }
//   }

//   // Process Apple Pay payment
//   const processApplePayPayment = async (): Promise<PaymentResult> => {
//     try {
//       const response = await fetch("/api/apple-pay/session", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           amount: Math.round(total * 100),
//           currency: "usd",
//           items,
//           planId: selectedPlan.id,
//           billingCycle: selectedPlan.billingCycle
//         }),
//       })

//       if (!response.ok) {
//         throw new Error("Failed to create Apple Pay session")
//       }

//       const data = await response.json()

//       // In a real implementation, you would use the Apple Pay JS API
//       // with the session data returned from the server

//       return { success: true, transactionId: `AP-${Date.now()}` }
//     } catch (error) {
//       console.error("Apple Pay error:", error)
//       return { success: false, error: "Failed to process Apple Pay payment" }
//     }
//   }

//   // Process Google Pay payment
//   const processGooglePayPayment = async (): Promise<PaymentResult> => {
//     try {
//       const response = await fetch("/api/google-pay/session", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           amount: Math.round(total * 100),
//           currency: "usd",
//           items,
//           planId: selectedPlan.id,
//           billingCycle: selectedPlan.billingCycle
//         }),
//       })

//       if (!response.ok) {
//         throw new Error("Failed to create Google Pay session")
//       }

//       const data = await response.json()

//       // In a real implementation, you would use the Google Pay API
//       // with the session data returned from the server

//       return { success: true, transactionId: `GP-${Date.now()}` }
//     } catch (error) {
//       console.error("Google Pay error:", error)
//       return { success: false, error: "Failed to process Google Pay payment" }
//     }
//   }

//   // Process bank transfer payment
//   const processBankTransferPayment = async (): Promise<PaymentResult> => {
//     try {
//       const response = await fetch("/api/bank-transfer/initiate", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           amount: total,
//           currency: "USD",
//           description: `${selectedPlan.name} Plan Purchase`,
//           userId: user?.id || "guest",
//           email: user?.emailAddresses?.[0]?.emailAddress || userProfile?.email || "",
//           planId: selectedPlan.id,
//           billingCycle: selectedPlan.billingCycle
//         }),
//       })

//       if (!response.ok) {
//         throw new Error("Failed to initiate bank transfer")
//       }

//       const data = await response.json()
//       return { success: true, transactionId: data.reference }
//     } catch (error) {
//       console.error("Bank transfer error:", error)
//       return { success: false, error: "Failed to initiate bank transfer" }
//     }
//   }

//   // Process gift card payment
//   const processGiftCardPayment = async (): Promise<PaymentResult> => {
//     try {
//       const response = await fetch("/api/gift-card/redeem", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           code: giftCardCode,
//           amount: total,
//           userId: user?.id || "guest",
//           planId: selectedPlan.id,
//           billingCycle: selectedPlan.billingCycle
//         }),
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.error || "Failed to redeem gift card")
//       }

//       const data = await response.json()
//       return { success: true, transactionId: data.redemptionId }
//     } catch (error) {
//       console.error("Gift card error:", error)
//       return { success: false, error: error instanceof Error ? error.message : "Failed to process gift card payment" }
//     }
//   }

//   // Process wallet payment
//   const processWalletPayment = async (): Promise<PaymentResult> => {
//     try {
//       const response = await fetch("/api/wallet/charge", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-Clerk-User-Id": user?.id || "",
//         },
//         body: JSON.stringify({
//           amount: total,
//           currency: "USD",
//           description: `${selectedPlan.name} Plan Purchase`,
//           planId: selectedPlan.id,
//           billingCycle: selectedPlan.billingCycle
//         }),
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.error || "Failed to process wallet payment")
//       }

//       const data = await response.json()
//       setWalletBalance(data.new_balance)
//       return { success: true, transactionId: data.transactionId }
//     } catch (error) {
//       console.error("Wallet payment error:", error)
//       return { success: false, error: error instanceof Error ? error.message : "Failed to process wallet payment" }
//     }
//   }

//   // Check gift card balance
//   const checkGiftCardBalance = async () => {
//     try {
//       const response = await fetch(`/api/gift-card/redeem?code=${giftCardCode}`)

//       if (!response.ok) {
//         throw new Error("Invalid gift card")
//       }

//       const data = await response.json()

//       if (!data.is_valid) {
//         throw new Error(`Gift card is ${data.status}`)
//       }

//       setGiftCardBalance(data.balance)

//       toast({
//         title: "Gift Card Valid",
//         description: `Available balance: $${data.balance.toFixed(2)}`,
//         variant: "default",
//         className:
//           "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300",
//       })

//       return data.balance
//     } catch (error) {
//       console.error("Gift card error:", error)

//       toast({
//         title: "Gift Card Error",
//         description: error instanceof Error ? error.message : "Invalid gift card",
//         variant: "destructive",
//       })

//       return null
//     }
//   }

//   // Get wallet balance
//   const getWalletBalance = async () => {
//     try {
//       const response = await fetch("/api/wallet/charge", {
//         headers: {
//           "X-Clerk-User-Id": user?.id || "",
//         },
//       })

//       if (!response.ok) {
//         throw new Error("Failed to get wallet balance")
//       }

//       const data = await response.json()
//       setWalletBalance(data.balance)
//       return data.balance
//     } catch (error) {
//       console.error("Wallet error:", error)
//       return null
//     }
//   }

//   // Format credit card number with spaces
//   const formatCardNumber = (value: string) => {
//     const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
//     const matches = v.match(/\d{4,16}/g)
//     const match = (matches && matches[0]) || ""
//     const parts = []

//     for (let i = 0; i < match.length; i += 4) {
//       parts.push(match.substring(i, i + 4))
//     }

//     if (parts.length) {
//       return parts.join(" ")
//     } else {
//       return value
//     }
//   }

//   // Format expiry date
//   const formatExpiryDate = (value: string) => {
//     const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
//     if (v.length > 2) {
//       return `${v.substring(0, 2)}/${v.substring(2, 4)}`
//     }
//     return value
//   }

//   // Handle card number input
//   const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const formattedValue = formatCardNumber(e.target.value)
//     setCardNumber(formattedValue)

//     // Detect card type
//     const cardNumberWithoutSpaces = formattedValue.replace(/\s/g, "")
//     for (const [type, { pattern }] of Object.entries(CARD_TYPES)) {
//       if (pattern.test(cardNumberWithoutSpaces)) {
//         setCardType(type as keyof typeof CARD_TYPES)
//         return
//       }
//     }
//     setCardType(null)
//   }

//   // Handle expiry date input
//   const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const formattedValue = formatExpiryDate(e.target.value)
//     setExpiryDate(formattedValue)
//   }

//   // Handle CVV input
//   const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setCvv(e.target.value)
//   }

//   // Handle save card checkbox
//   const handleSaveCardChange = (checked: boolean | string) => {
//     setSaveCard(checked === true)
//   }

//   // Handle special offer checkbox
//   const handleUseSpecialOfferChange = (checked: boolean | string) => {
//     setUseSpecialOffer(checked === true)
//   }

//   // Handle gift card code input
//   const handleGiftCardCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setGiftCardCode(e.target.value)
//   }

//   // Handle gift card pin input
//   const handleGiftCardPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setGiftCardPin(e.target.value)
//   }

//   // Handle crypto currency selection
//   const handleCryptoCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setCryptoCurrency(e.target.value)
//   }

//   // Handle next form step
//   const continueTo = (step: number) => {
//     setFormStep(step)
//   }

//   // Handle previous form step
//   const returnTo = (step: number) => {
//     setFormStep(step)
//   }

//   // Add this function to handle free subscription activation
//   const activateFreeSubscription = async () => {
//     try {
//       // Since the API route doesn't exist, we'll use the server action directly
//       const result = await onSubscribe("free-subscription");
//       if (result.status === 200) {
//         toast({
//           title: "Subscription Activated",
//           description: "Your free subscription has been activated successfully.",
//           variant: "default",
//           className:
//             "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300",
//         });
//         return true;
//       } else {
//         throw new Error("Failed to activate subscription");
//       }
//     } catch (error) {
//       console.error("Error activating free subscription:", error);
//       toast({
//         title: "Activation Failed",
//         description: "Failed to activate your free subscription. Please try again.",
//         variant: "destructive",
//       });
//       return false;
//     }
//   };

//   // Payment methods
//   const paymentMethods: PaymentMethod[] = [
//     {
//       id: "card",
//       name: "Credit Card",
//       icon: <PaymentMethodIcon method="card" selected={paymentMethod === "card"} />,
//       description: "Pay with Visa, Mastercard, American Express, and more.",
//       popular: true,
//       processingTime: "Instant",
//       fees: "None",
//       color: "bg-blue-500",
//     },
//     {
//       id: "paypal",
//       name: "PayPal",
//       icon: <PaymentMethodIcon method="paypal" selected={paymentMethod === "paypal"} />,
//       description: "Pay with your PayPal account.",
//       processingTime: "Instant",
//       fees: "None",
//       color: "bg-yellow-500",
//     },
//     {
//       id: "crypto",
//       name: "Cryptocurrency",
//       icon: <PaymentMethodIcon method="crypto" selected={paymentMethod === "crypto"} />,
//       description: "Pay with Bitcoin, Ethereum, and other cryptocurrencies.",
//       processingTime: "Varies",
//       fees: "Varies",
//       color: "bg-orange-500",
//     },
//     {
//       id: "applepay",
//       name: "Apple Pay",
//       icon: <PaymentMethodIcon method="applepay" selected={paymentMethod === "applepay"} />,
//       description: "Pay quickly and securely with Apple Pay.",
//       processingTime: "Instant",
//       fees: "None",
//       color: "bg-gray-800",
//     },
//     {
//       id: "googlepay",
//       name: "Google Pay",
//       icon: <PaymentMethodIcon method="googlepay" selected={paymentMethod === "googlepay"} />,
//       description: "Pay quickly and securely with Google Pay.",
//       processingTime: "Instant",
//       fees: "None",
//       color: "bg-gray-800",
//     },
//     {
//       id: "bank",
//       name: "Bank Transfer",
//       icon: <PaymentMethodIcon method="bank" selected={paymentMethod === "bank"} />,
//       description: "Pay directly from your bank account.",
//       processingTime: "1-3 business days",
//       fees: "None",
//       color: "bg-green-500",
//     },
//     {
//       id: "giftcard",
//       name: "Gift Card",
//       icon: <PaymentMethodIcon method="giftcard" selected={paymentMethod === "giftcard"} />,
//       description: "Redeem a gift card for your purchase.",
//       processingTime: "Instant",
//       fees: "None",
//       color: "bg-purple-500",
//     },
//     {
//       id: "wallet",
//       name: "Wallet",
//       icon: <PaymentMethodIcon method="wallet" selected={paymentMethod === "wallet"} />,
//       description: "Pay using funds from your wallet.",
//       processingTime: "Instant",
//       fees: "None",
//       color: "bg-teal-500",
//     },
//   ]

//   // Mobile view
//   useEffect(() => {
//     const handleResize = () => {
//       setMobileView(window.innerWidth < 768)
//       setSidebarVisible(window.innerWidth >= 768)
//     }

//     handleResize()

//     window.addEventListener("resize", handleResize)

//     return () => {
//       window.removeEventListener("resize", handleResize)
//     }
//   }, [])

//   // User authentication and profile
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const user = await onCurrentUser()
//         setUser(user)
//         setIsSignedIn(!!user)

//         if (user) {
//           const userProfile = await onUserInfo()
//           setUserProfile(userProfile)
//         }
//       } catch (error) {
//         console.error("Error fetching user:", error)
//       }
//     }

//     fetchUser()
//   }, [])

//   return (
//     <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
//       {/* Sidebar (hidden on mobile) */}
//       <AnimatePresence>
//         {sidebarVisible && (
//           <motion.aside
//             initial={{ x: -300, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             exit={{ x: -300, opacity: 0 }}
//             transition={{ duration: 0.3, ease: "easeInOut" }}
//             className="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6"
//           >
//             <div className="mb-8">
//               <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Order Summary</h2>
//               <p className="text-sm text-gray-500 dark:text-gray-400">Review your order details.</p>
//             </div>

//             {/* Order items */}
//             <div className="space-y-3">
//               {items.map((item, index) => (
//                 <div key={index} className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{item.name}</p>
//                     {item.waived && (
//                       <Badge variant="outline" className="mt-1 text-[.70rem]">
//                         Waived
//                       </Badge>
//                     )}
//                     {item.included && (
//                       <Badge variant="outline" className="mt-1 text-[.70rem]">
//                         Included
//                       </Badge>
//                     )}
//                   </div>
//                   <p className="text-sm text-gray-600 dark:text-gray-300">${item.price.toFixed(2)}</p>
//                 </div>
//               ))}
//             </div>

//             <Separator className="my-4" />

//             {/* Subtotal */}
//             <div className="flex items-center justify-between">
//               <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Subtotal</p>
//               <p className="text-sm text-gray-600 dark:text-gray-300">${subtotal.toFixed(2)}</p>
//             </div>

//             {/* Discount */}
//             <div className="flex items-center justify-between">
//               <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Discount</p>
//               <p className="text-sm text-green-500">-${discount.toFixed(2)}</p>
//             </div>

//             {/* Tax */}
//             <div className="flex items-center justify-between">
//               <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Tax</p>
//               <p className="text-sm text-gray-600 dark:text-gray-300">${tax.toFixed(2)}</p>
//             </div>

//             <Separator className="my-4" />

//             {/* Total */}
//             <div className="flex items-center justify-between">
//               <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">Total</p>
//               <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">${total.toFixed(2)}</p>
//             </div>

//             {/* Special offer toggle */}
//             <div className="mt-6">
//               <div className="flex items-center space-x-2">
//                 <Checkbox id="special-offer" checked={useSpecialOffer} onCheckedChange={handleUseSpecialOfferChange} />
//                 <Label htmlFor="special-offer" className="text-sm font-medium text-gray-700 dark:text-gray-200">
//                   Use Special Offer
//                 </Label>
//               </div>
//               <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get 25% off your first month.</p>
//             </div>
//           </motion.aside>
//         )}
//       </AnimatePresence>

//       {/* Main content */}
//       <div className="flex-1 p-6">
//         {/* Mobile sidebar toggle */}
//         {mobileView && (
//           <div className="mb-4">
//             <Drawer>
//               <DrawerTrigger asChild>
//                 <Button variant="outline">
//                   <ChevronsUpDown className="mr-2 h-4 w-4" />
//                   Order Summary
//                 </Button>
//               </DrawerTrigger>
//               <DrawerContent>
//                 <DrawerHeader>
//                   <DrawerTitle>Order Summary</DrawerTitle>
//                   <DrawerDescription>Review your order details.</DrawerDescription>
//                 </DrawerHeader>

//                 {/* Order items */}
//                 <div className="space-y-3">
//                   {items.map((item, index) => (
//                     <div key={index} className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{item.name}</p>
//                         {item.waived && (
//                           <Badge variant="outline" className="mt-1 text-[.70rem]">
//                             Waived
//                           </Badge>
//                         )}
//                         {item.included && (
//                           <Badge variant="outline" className="mt-1 text-[.70rem]">
//                             Included
//                           </Badge>
//                         )}
//                       </div>
//                       <p className="text-sm text-gray-600 dark:text-gray-300">${item.price.toFixed(2)}</p>
//                     </div>
//                   ))}
//                 </div>

//                 <Separator className="my-4" />

//                 {/* Subtotal */}
//                 <div className="flex items-center justify-between">
//                   <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Subtotal</p>
//                   <p className="text-sm text-gray-600 dark:text-gray-300">${subtotal.toFixed(2)}</p>
//                 </div>

//                 {/* Discount */}
//                 <div className="flex items-center justify-between">
//                   <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Discount</p>
//                   <p className="text-sm text-green-500">-${discount.toFixed(2)}</p>
//                 </div>

//                 {/* Tax */}
//                 <div className="flex items-center justify-between">
//                   <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Tax</p>
//                   <p className="text-sm text-gray-600 dark:text-gray-300">${tax.toFixed(2)}</p>
//                 </div>

//                 <Separator className="my-4" />

//                 {/* Total */}
//                 <div className="flex items-center justify-between">
//                   <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">Total</p>
//                   <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">${total.toFixed(2)}</p>
//                 </div>

//                 {/* Special offer toggle */}
//                 <div className="mt-6">
//                   <div className="flex items-center space-x-2">
//                     <Checkbox id="special-offer" checked={useSpecialOffer} onCheckedChange={handleUseSpecialOfferChange} />
//                     <Label htmlFor="special-offer" className="text-sm font-medium text-gray-700 dark:text-gray-200">
//                       Use Special Offer
//                     </Label>
//                   </div>
//                   <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get 25% off your first month.</p>
//                 </div>

//                 <DrawerFooter>
//                   <DrawerClose>Close</DrawerClose>
//                 </DrawerFooter>
//               </DrawerContent>
//             </Drawer>
//           </div>
//         )}

//         {/* Payment form */}
//         <Card className="max-w-2xl mx-auto">
//           <CardHeader>
//             <CardTitle className="text-2xl font-semibold">Payment Information</CardTitle>
//             <CardDescription>Choose your payment method and enter your details.</CardDescription>
//           </CardHeader>
//           <CardContent>
//             {paymentComplete ? (
//               <div className="text-center">
//                 <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
//                 <h3 className="mt-4 text-xl font-semibold">Payment Successful!</h3>
//                 <p className="text-gray-500 dark:text-gray-400">
//                   Thank you for your purchase. Your transaction ID is {transactionId}.
//                 </p>
//                 <Button onClick={() => router.push("/")} className="mt-6">
//                   Go to Dashboard
//                 </Button>
//               </div>
//             ) : (
//               <form onSubmit={handleSubmit}>
//                 {/* Payment method selection */}
//                 {formStep === 0 && (
//                   <div>
//                     <h3 className="mb-4 text-lg font-semibold">Select Payment Method</h3>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                       {paymentMethods.map((method) => (
//                         <Button
//                           key={method.id}
//                           variant="outline"
//                           className={cn(
//                             "flex flex-col items-center justify-center p-4 rounded-md border-2 transition-colors",
//                             paymentMethod === method.id
//                               ? "border-violet-500 dark:border-violet-400 bg-violet-50 dark:bg-violet-900/20"
//                               : "border-gray-200 dark:border-gray-700 hover:border-violet-500 dark:hover:border-violet-400",
//                           )}
//                           onClick={() => setPaymentMethod(method.id)}
//                         >
//                           {method.icon}
//                           <span className="mt-2 text-sm font-medium">{method.name}</span>
//                         </Button>
//                       ))}
//                     </div>
//                     <Button onClick={() => continueTo(1)} className="mt-6 w-full">
//                       Continue to Payment Details
//                     </Button>
//                   </div>
//                 )}

//                 {/* Payment details form */}
//                 {formStep === 1 && (
//                   <div>
//                     <h3 className="mb-4 text-lg font-semibold">Enter Payment Details</h3>

//                     {paymentMethod === "card" && (
//                       <div>
//                         <div className="mb-4">
//                           <Label htmlFor="card-name">Cardholder Name</Label>
//                           <Input
//                             type="text"
//                             id="card-name"
//                             placeholder="John Doe"
//                             value={cardName}
//                             onChange={(e) => setCardName(e.target.value)}
//                           />
//                         </div>
//                         <div className="mb-4">
//                           <Label htmlFor="card-number">Card Number</Label>
//                           <Input
//                             type="text"
//                             id="card-number"
//                             placeholder="XXXX XXXX XXXX XXXX"
//                             value={cardNumber}
//                             onChange={handleCardNumberChange}
//                             maxLength={19}
//                             ref={cardNumberRef}
//                           />
//                         </div>
//                         <div className="grid grid-cols-2 gap-4 mb-4">
//                           <div>
//                             <Label htmlFor="expiry-date">Expiry Date</Label>
//                             <Input
//                               type="text"
//                               id="expiry-date"
//                               placeholder="MM/YY"
//                               value={expiryDate}
//                               onChange={handleExpiryDateChange}
//                               maxLength={5}
//                               ref={expiryRef}
//                             />
//                           </div>
//                           <div>
//                             <Label htmlFor="cvv">CVV</Label>
//                             <Input
//                               type="text"
//                               id="cvv"
//                               placeholder="XXX"
//                               value={cvv}
//                               onChange={handleCvvChange}
//                               maxLength={4}
//                               ref={cvvRef}
//                             />
//                           </div>
//                         </div>
//                         <div className="flex items-center space-x-2 mb-4">
//                           <Checkbox id="saveCard" checked={saveCard} onCheckedChange={(checked) => setSaveCard(!!checked)} />
//                           <Label htmlFor="save-card" className="text-sm font-medium text-gray-700 dark:text-gray-200">
//                             Save this card for future payments
//                           </Label>
//                         </div>
//                       </div>
//                     )}

//                     {paymentMethod === "giftcard" && (
//                       <div>
//                         <div className="mb-4">
//                           <Label htmlFor="gift-card-code">Gift Card Code</Label>
//                           <Input
//                             type="text"
//                             id="gift-card-code"
//                             placeholder="Enter gift card code"
//                             value={giftCardCode}
//                             onChange={handleGiftCardCodeChange}
//                           />
//                         </div>
//                         <div className="mb-4">
//                           <Label htmlFor="gift-card-pin">Gift Card PIN (Optional)</Label>
//                           <Input
//                             type="text"
//                             id="gift-card-pin"
//                             placeholder="Enter gift card PIN"
//                             value={giftCardPin}
//                             onChange={handleGiftCardPinChange}
//                           />
//                         </div>
//                         <Button type="button" variant="secondary" onClick={checkGiftCardBalance} className="mb-4">
//                           Check Gift Card Balance
//                         </Button>
//                       </div>
//                     )}

//                     {paymentMethod === "crypto" && (
//                       <div>
//                         <div className="mb-4">
//                           <Label htmlFor="crypto-currency">Select Cryptocurrency</Label>
//                           <Select onValueChange={setCryptoCurrency}>
//                             <SelectTrigger className="w-[180px]">
//                               <SelectValue placeholder="Bitcoin" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="bitcoin">Bitcoin</SelectItem>
//                               <SelectItem value="ethereum">Ethereum</SelectItem>
//                               <SelectItem value="litecoin">Litecoin</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>
//                         {cryptoAddress && (
//                           <div className="mb-4">
//                             <Label htmlFor="crypto-address">Payment Address</Label>
//                             <div className="relative">
//                               <Input
//                                 type="text"
//                                 id="crypto-address"
//                                 value={cryptoAddress}
//                                 readOnly
//                               />
//                               <TooltipProvider>
//                                 <Tooltip>
//                                   <TooltipTrigger asChild>
//                                     <Button
//                                       variant="ghost"
//                                       size="sm"
//                                       className="absolute right-2 top-2"
//                                       onClick={() => navigator.clipboard.writeText(cryptoAddress)}
//                                     >
//                                       <Copy className="h-4 w-4 mr-2" />
//                                       Copy
//                                     </Button>
//                                   </TooltipTrigger>
//                                   <TooltipContent>
//                                     Copied!
//                                   </TooltipContent>
//                                   </Tooltip>
//                                 </TooltipProvider>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     )}

//                     {paymentMethod === "wallet" && (
//                       <div>
//                         <p className="mb-4">Your current wallet balance isalance is ${walletBalance?.toFixed(2) || "0.00"}.
//                         </p>
//                         <Button type="button" variant="secondary" onClick={getWalletBalance} className="mb-4">
//                           Refresh Wallet Balance
//                         </Button>
//                       </div>
//                     )}

//                     <div className="flex justify-between">
//                       <Button variant="secondary" onClick={() => returnTo(0)}>
//                         Back to Payment Methods
//                       </Button>
//                       <Button type="submit">Continue to Review</Button>
//                     </div>
//                   </div>
//                 )}

//                 {/* Review and confirm */}
//                 {formStep === 2 && (
//                   <div>
//                     <h3 className="mb-4 text-lg font-semibold">Review and Confirm</h3>
//                     <p className="mb-4">Please review your order details and payment information before confirming.</p>

//                     {paymentMethod === "card" && (
//                       <div>
//                         <p className="mb-2">
//                           <strong>Payment Method:</strong> Credit Card
//                         </p>
//                         <p className="mb-2">
//                           <strong>Cardholder Name:</strong> {cardName}
//                         </p>
//                         <p className="mb-2">
//                           <strong>Card Number:</strong> {cardNumber}
//                         </p>
//                         <p className="mb-2">
//                           <strong>Expiry Date:</strong> {expiryDate}
//                         </p>
//                       </div>
//                     )}

//                     {paymentMethod === "giftcard" && (
//                       <div>
//                         <p className="mb-2">
//                           <strong>Payment Method:</strong> Gift Card
//                         </p>
//                         <p className="mb-2">
//                           <strong>Gift Card Code:</strong> {giftCardCode}
//                         </p>
//                       </div>
//                     )}

//                     {paymentMethod === "crypto" && (
//                       <div>
//                         <p className="mb-2">
//                           <strong>Payment Method:</strong> Cryptocurrency
//                         </p>
//                         <p className="mb-2">
//                           <strong>Cryptocurrency:</strong> {cryptoCurrency}
//                         </p>
//                         <p className="mb-2">
//                           <strong>Payment Address:</strong> {cryptoAddress}
//                         </p>
//                       </div>
//                     )}

//                     {paymentMethod === "wallet" && (
//                       <div>
//                         <p className="mb-2">
//                           <strong>Payment Method:</strong> Wallet
//                         </p>
//                         <p className="mb-2">
//                           <strong>Wallet Balance:</strong> ${walletBalance?.toFixed(2) || "0.00"}
//                         </p>
//                       </div>
//                     )}

//                     <div className="flex justify-between">
//                       <Button variant="secondary" onClick={() => returnTo(1)}>
//                         Back to Payment Details
//                       </Button>
//                       <Button type="submit" disabled={paymentProcessing}>
//                         {paymentProcessing ? (
//                           <>
//                             Processing Payment...
//                             <RefreshCcw className="ml-2 h-4 w-4 animate-spin" />
//                           </>
//                         ) : (
//                           "Confirm Payment"
//                         )}
//                       </Button>
//                     </div>
//                   </div>
//                 )}

//                 {paymentError && (
//                   <div className="mt-4 text-red-500">
//                     <AlertCircle className="mr-2 inline-block h-4 w-4 align-middle" />
//                     {paymentError}
//                   </div>
//                 )}
//               </form>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

// export default PaymentPage


"use client"

import type React from "react"
import { useState, useEffect, useRef, type FormEvent } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { CreditCard, DollarSignIcon as PaypalLogo, Bitcoin, Apple, BanknoteIcon as BankTransfer, Gift, ChevronsUpDown, Wallet, AlertCircle, CreditCardIcon as GooglePay, CheckCircle2, RefreshCcw, Copy, Lock, ChevronRight, ChevronLeft, Shield, Info, X, Check, Sparkles, ArrowRight, Landmark, Timer, ThumbsUp, Star } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements, PaymentRequestButtonElement } from "@stripe/react-stripe-js"

// Import server actions
import { onSubscribe, onCurrentUser, onUserInfo } from "@/actions/user/index"

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

// Card types for validation and display
const CARD_TYPES = {
  visa: {
    pattern: /^4/,
    icon: "/assets/payment/visa.svg",
  },
  mastercard: {
    pattern: /^5[1-5]/,
    icon: "/assets/payment/mastercard.svg",
  },
  amex: {
    pattern: /^3[47]/,
    icon: "/assets/payment/amex.svg",
  },
  discover: {
    pattern: /^(6011|65|64[4-9]|622)/,
    icon: "/assets/payment/discover.svg",
  },
}

interface PaymentMethod {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  popular?: boolean
  processingTime: string
  fees: string
  color: string
  gradientFrom: string
  gradientTo: string
}

interface PaymentResult {
  success: boolean
  transactionId?: string
  sessionId?: string
  error?: string
  last4?: string
  paymentAddress?: string
  expiresAt?: string
  redemptionId?: string
}

interface OrderItem {
  name: string
  price: number
  saving?: string
  waived?: boolean
  included?: boolean
}

interface PaymentPageProps {
  selectedPlan: {
    id: string
    name: string
    price: number
    billingCycle: "monthly" | "annually"
    description: string
  }
}

const PaymentMethodIcon = ({
  method,
  selected,
  size = "default",
}: {
  method: string
  selected: boolean
  size?: "default" | "large"
}) => {
  const icons: Record<string, React.ReactNode> = {
    card: <CreditCard className={size === "large" ? "h-8 w-8" : "h-5 w-5"} />,
    paypal: <PaypalLogo className={size === "large" ? "h-8 w-8" : "h-5 w-5"} />,
    crypto: <Bitcoin className={size === "large" ? "h-8 w-8" : "h-5 w-5"} />,
    applepay: <Apple className={size === "large" ? "h-8 w-8" : "h-5 w-5"} />,
    googlepay: <GooglePay className={size === "large" ? "h-8 w-8" : "h-5 w-5"} />,
    bank: <BankTransfer className={size === "large" ? "h-8 w-8" : "h-5 w-5"} />,
    giftcard: <Gift className={size === "large" ? "h-8 w-8" : "h-5 w-5"} />,
    wallet: <Wallet className={size === "large" ? "h-8 w-8" : "h-5 w-5"} />,
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full transition-all",
        size === "large" ? "h-16 w-16 p-3" : "h-10 w-10 p-2",
        selected
          ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/20"
          : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400",
      )}
    >
      {icons[method]}
    </div>
  )
}

// Particles animation for success state
const Particles = ({ count = 50 }: { count?: number }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary"
          initial={{
            scale: 0,
            x: "50%",
            y: "50%",
            opacity: 1,
          }}
          animate={{
            scale: Math.random() * 1 + 0.5,
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            opacity: 0,
          }}
          transition={{
            duration: Math.random() * 1 + 0.5,
            delay: Math.random() * 0.2,
            ease: "easeOut",
          }}
          style={{
            backgroundColor: `hsl(${Math.random() * 60 + 230}, ${Math.random() * 50 + 50}%, ${Math.random() * 30 + 50}%)`,
          }}
        />
      ))}
    </div>
  )
}

// Floating elements animation
const FloatingElement = ({ children, delay = 0, duration = 3, className = "" }: { 
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}) => {
  return (
    <motion.div
      className={className}
      initial={{ y: 0 }}
      animate={{ 
        y: [0, -10, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}

// Main payment component
const PaymentPage = ({ selectedPlan }: PaymentPageProps) => {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const { toast } = useToast()
  const controls = useAnimation()

  // State variables
  const [paymentMethod, setPaymentMethod] = useState<string>("card")
  const [formStep, setFormStep] = useState<number>(0)
  const [flipCard, setFlipCard] = useState(false)
  const [cardName, setCardName] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [saveCard, setSaveCard] = useState(false)
  const [useSpecialOffer, setUseSpecialOffer] = useState(false)
  const [showOrderSummary, setShowOrderSummary] = useState(false)
  const [animationComplete, setAnimationComplete] = useState(false)
  const [cardType, setCardType] = useState<keyof typeof CARD_TYPES | null>(null)
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [mobileView, setMobileView] = useState(false)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentIntent, setPaymentIntent] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "succeeded" | "failed">("idle")
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [walletBalance, setWalletBalance] = useState<number | null>(null)
  const [paymentRequest, setPaymentRequest] = useState<any>(null)
  const [giftCardCode, setGiftCardCode] = useState("")
  const [giftCardPin, setGiftCardPin] = useState("")
  const [giftCardBalance, setGiftCardBalance] = useState<number | null>(null)
  const [cryptoCurrency, setCryptoCurrency] = useState("bitcoin")
  const [cryptoAddress, setCryptoAddress] = useState<string | null>(null)
  const [cryptoQRCode, setCryptoQRCode] = useState<string | null>(null)
  const [bankDetails, setBankDetails] = useState<any>(null)
  const [applePaySession, setApplePaySession] = useState<any>(null)
  const [googlePaySession, setGooglePaySession] = useState<any>(null)
  const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null)

  // Refs for form elements
  const cardNumberRef = useRef<HTMLInputElement>(null)
  const expiryRef = useRef<HTMLInputElement>(null)
  const cvvRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  // Order items and pricing based on selected plan
  const items: OrderItem[] = [
    { 
      name: `${selectedPlan.name} Plan (${selectedPlan.billingCycle === "annually" ? "Annual" : "Monthly"})`, 
      price: selectedPlan.price, 
      saving: selectedPlan.billingCycle === "annually" ? "15%" : undefined 
    },
    { name: "Setup Fee", price: 0, waived: true },
  ]

  // Add priority support for Pro and Enterprise plans
  if (selectedPlan.id === "PRO" || selectedPlan.id === "enterprise") {
    items.push({ name: "Priority Support", price: 0, included: true })
  }

  const subtotal = items.reduce((acc, item) => acc + item.price, 0)
  const discount = useSpecialOffer ? 25 : 0
  const tax = (subtotal - discount) * 0.08
  const total = subtotal - discount + tax

  // Create payment intent when component loads or discount changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      createPaymentIntent()
    }
  }, [useSpecialOffer])

  // Animate the form step transition
  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    })
  }, [formStep, controls])

  // Create payment intent
  const createPaymentIntent = async () => {
    try {
      setPaymentError(null)

      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(total * 100), // Convert to cents for Stripe
          currency: "usd",
          payment_method_types: ["card"],
          metadata: {
            order_items: JSON.stringify(items),
            discount_applied: useSpecialOffer,
            planId: selectedPlan.id,
            billingCycle: selectedPlan.billingCycle,
            userId: user?.id || "guest",
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create payment intent")
      }

      const data = await response.json()
      setClientSecret(data.clientSecret)
      setPaymentIntent(data.id)
    } catch (error) {
      console.error("Error creating payment intent:", error)
      setPaymentError("Failed to initialize payment. Please try again.")

      toast({
        title: "Payment Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle form submission
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (formStep === 1 && paymentMethod === "card") {
      // Move to review step
      continueTo(2)
    } else if (formStep === 2) {
      // Process the payment
      await processPayment()
    }
  }

  // Process payment based on selected method
  const processPayment = async () => {
    setPaymentProcessing(true)
    setPaymentStatus("processing")
    setPaymentError(null)

    try {
      let paymentResult: PaymentResult

      switch (paymentMethod) {
        case "card":
          paymentResult = await processCardPayment()
          break
        case "paypal":
          paymentResult = await processPayPalPayment()
          break
        case "crypto":
          paymentResult = await processCryptoPayment()
          break
        case "applepay":
          paymentResult = await processApplePayPayment()
          break
        case "googlepay":
          paymentResult = await processGooglePayPayment()
          break
        case "bank":
          paymentResult = await processBankTransferPayment()
          break
        case "giftcard":
          paymentResult = await processGiftCardPayment()
          break
        case "wallet":
          paymentResult = await processWalletPayment()
          break
        default:
          throw new Error("Invalid payment method")
      }

      if (paymentResult.success) {
        setTransactionId(paymentResult.transactionId || null)
        setPaymentStatus("succeeded")
        setPaymentComplete(true)
        setFormStep(3)

        // If we have a session ID (from Stripe), update the user's subscription
        if (paymentResult.sessionId) {
          try {
            const subscriptionResult = await onSubscribe(paymentResult.sessionId)
            if (subscriptionResult.status === 200) {
              console.log("Subscription updated successfully")
            } else {
              console.warn("Subscription update failed:", subscriptionResult)
            }
          } catch (error) {
            console.error("Error updating subscription:", error)
          }
        }

        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully.",
          variant: "default",
          className:
            "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300",
        })
      } else {
        throw new Error(paymentResult.error || "Payment failed")
      }
    } catch (error) {
      console.error("Payment processing error:", error)
      setPaymentStatus("failed")
      const errorMessage = error instanceof Error ? error.message : "Payment processing failed. Please try again."
      setPaymentError(errorMessage)

      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setPaymentProcessing(false)
    }
  }

  // Process card payment
  const processCardPayment = async (): Promise<PaymentResult> => {
    if (!clientSecret) {
      return { success: false, error: "Payment not initialized" }
    }

    const cardElement = document.querySelector('.card-element') as HTMLElement
    if (!cardElement) {
      return { success: false, error: "Card element not found" }
    }

    try {
      // In a real implementation, we would use Stripe.js to confirm the payment
      const response = await fetch("/api/payments/process-card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentIntentId: paymentIntent,
          paymentMethodId: "pm_card_visa", // This would come from Stripe Elements in production
          billingDetails: {
            name: cardName,
            email: user?.emailAddresses?.[0]?.emailAddress || userProfile?.email,
          },
          savePaymentMethod: saveCard,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to process card payment")
      }

      const data = await response.json()
      return {
        success: true,
        transactionId: data.paymentIntentId,
        sessionId: data.paymentIntentId,
        last4: data.last4 || "1234",
      }
    } catch (error) {
      console.error("Card payment error:", error)
      return { success: false, error: error instanceof Error ? error.message : "Failed to process card payment" }
    }
  }

  // Process PayPal payment
  const processPayPalPayment = async (): Promise<PaymentResult> => {
    try {
      // Create PayPal order
      const response = await fetch("/api/payments/paypal/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: total,
          currency: "USD",
          planId: selectedPlan.id,
          billingCycle: selectedPlan.billingCycle,
          userId: user?.id || "guest",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create PayPal order")
      }

      const data = await response.json()
      setPaypalOrderId(data.id)

      // In a real implementation, we would redirect to PayPal for payment
      // For now, we'll simulate a successful payment
      const captureResponse = await fetch(`/api/payments/paypal/capture-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: data.id,
        }),
      })

      if (!captureResponse.ok) {
        const errorData = await captureResponse.json()
        throw new Error(errorData.error || "Failed to capture PayPal payment")
      }

      const captureData = await captureResponse.json()
      return {
        success: true,
        transactionId: captureData.id,
        sessionId: captureData.id,
      }
    } catch (error) {
      console.error("PayPal payment error:", error)
      return { success: false, error: error instanceof Error ? error.message : "Failed to process PayPal payment" }
    }
  }

  // Process cryptocurrency payment
  const processCryptoPayment = async (): Promise<PaymentResult> => {
    try {
      const response = await fetch("/api/payments/crypto/create-charge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: total,
          currency: "USD",
          name: `${selectedPlan.name} Plan Purchase`,
          customerId: user?.id || "guest",
          planId: selectedPlan.id,
          billingCycle: selectedPlan.billingCycle,
          cryptoCurrency: cryptoCurrency,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create crypto payment")
      }

      const data = await response.json()
      setCryptoAddress(data.address)
      setCryptoQRCode(data.qrCode)

      // In a real implementation, we would wait for blockchain confirmation
      // For now, we'll simulate a successful payment
      return {
        success: true,
        transactionId: data.id,
        paymentAddress: data.address,
        expiresAt: data.expiresAt,
      }
    } catch (error) {
      console.error("Crypto payment error:", error)
      return { success: false, error: error instanceof Error ? error.message : "Failed to process cryptocurrency payment" }
    }
  }


  const processApplePayPayments = async (): Promise<PaymentResult> => {
    try {
      const response = await fetch("/api/apple-pay/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(total * 100),
          currency: "usd",
          items,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create Apple Pay session")
      }

      const data = await response.json()

      // In a real implementation, you would use the Apple Pay JS API
      // with the session data returned from the server

      return { success: true, transactionId: `AP-${Date.now()}` }
    } catch (error) {
      console.error("Apple Pay error:", error)
      return { success: false, error: "Failed to process Apple Pay payment" }
    }
  }


  // Process Apple Pay payment
  const processApplePayPayment = async (): Promise<PaymentResult> => {
    try {
      // Check if Apple Pay is available
      // if (typeof window !== 'undefined' && window.ApplePaySession && ApplePaySession.canMakePayments()) {
      //   throw new Error("Apple Pay is not available on this device")
      // }

      // Create Apple Pay session
      const response = await fetch("/api/payments/apple-pay/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: total,
          currency: "USD",
          planId: selectedPlan.id,
          billingCycle: selectedPlan.billingCycle,
          items: items.map(item => ({ label: item.name, amount: item.price })),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create Apple Pay session")
      }

      const sessionData = await response.json()
      setApplePaySession(sessionData)

      // In a real implementation, we would use the Apple Pay JS API
      // For now, we'll simulate a successful payment
      const processResponse = await fetch("/api/payments/apple-pay/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: sessionData.id,
          token: "simulated_apple_pay_token",
        }),
      })

      if (!processResponse.ok) {
        const errorData = await processResponse.json()
        throw new Error(errorData.error || "Failed to process Apple Pay payment")
      }

      const processData = await processResponse.json()
      return {
        success: true,
        transactionId: processData.id,
        sessionId: processData.id,
      }
    } catch (error) {
      console.error("Apple Pay error:", error)
      return { success: false, error: error instanceof Error ? error.message : "Failed to process Apple Pay payment" }
    }
  }

  // Process Google Pay payment
  const processGooglePayPayment = async (): Promise<PaymentResult> => {
    try {
      // Create Google Pay session
      const response = await fetch("/api/payments/google-pay/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: total,
          currency: "USD",
          planId: selectedPlan.id,
          billingCycle: selectedPlan.billingCycle,
          items: items.map(item => ({ label: item.name, amount: item.price })),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create Google Pay session")
      }

      const sessionData = await response.json()
      setGooglePaySession(sessionData)

      // In a real implementation, we would use the Google Pay API
      // For now, we'll simulate a successful payment
      const processResponse = await fetch("/api/payments/google-pay/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: sessionData.id,
          token: "simulated_google_pay_token",
        }),
      })

      if (!processResponse.ok) {
        const errorData = await processResponse.json()
        throw new Error(errorData.error || "Failed to process Google Pay payment")
      }

      const processData = await processResponse.json()
      return {
        success: true,
        transactionId: processData.id,
        sessionId: processData.id,
      }
    } catch (error) {
      console.error("Google Pay error:", error)
      return { success: false, error: error instanceof Error ? error.message : "Failed to process Google Pay payment" }
    }
  }

  // Process bank transfer payment
  const processBankTransferPayment = async (): Promise<PaymentResult> => {
    try {
      const response = await fetch("/api/payments/bank-transfer/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: total,
          currency: "USD",
          description: `${selectedPlan.name} Plan Purchase`,
          userId: user?.id || "guest",
          email: user?.emailAddresses?.[0]?.emailAddress || userProfile?.email || "",
          planId: selectedPlan.id,
          billingCycle: selectedPlan.billingCycle,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to initiate bank transfer")
      }

      const data = await response.json()
      setBankDetails(data)

      return {
        success: true,
        transactionId: data.reference,
        sessionId: data.reference,
      }
    } catch (error) {
      console.error("Bank transfer error:", error)
      return { success: false, error: error instanceof Error ? error.message : "Failed to initiate bank transfer" }
    }
  }

  // Process gift card payment
  const processGiftCardPayment = async (): Promise<PaymentResult> => {
    try {
      const response = await fetch("/api/payments/gift-card/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: giftCardCode,
          pin: giftCardPin,
          amount: total,
          userId: user?.id || "guest",
          planId: selectedPlan.id,
          billingCycle: selectedPlan.billingCycle,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to redeem gift card")
      }

      const data = await response.json()
      return {
        success: true,
        transactionId: data.redemptionId,
        sessionId: data.redemptionId,
      }
    } catch (error) {
      console.error("Gift card error:", error)
      return { success: false, error: error instanceof Error ? error.message : "Failed to process gift card payment" }
    }
  }

  // Process wallet payment
  const processWalletPayment = async (): Promise<PaymentResult> => {
    try {
      const response = await fetch("/api/payments/wallet/charge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": user?.id || "",
        },
        body: JSON.stringify({
          amount: total,
          currency: "USD",
          description: `${selectedPlan.name} Plan Purchase`,
          planId: selectedPlan.id,
          billingCycle: selectedPlan.billingCycle,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to process wallet payment")
      }

      const data = await response.json()
      setWalletBalance(data.newBalance)
      
      return {
        success: true,
        transactionId: data.transactionId,
        sessionId: data.transactionId,
      }
    } catch (error) {
      console.error("Wallet payment error:", error)
      return { success: false, error: error instanceof Error ? error.message : "Failed to process wallet payment" }
    }
  }

  // Check gift card balance
  const checkGiftCardBalance = async () => {
    try {
      const response = await fetch(`/api/payments/gift-card/check?code=${giftCardCode}&pin=${giftCardPin}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Invalid gift card")
      }

      const data = await response.json()

      if (!data.isValid) {
        throw new Error(`Gift card is ${data.status}`)
      }

      setGiftCardBalance(data.balance)

      toast({
        title: "Gift Card Valid",
        description: `Available balance: $${data.balance.toFixed(2)}`,
        variant: "default",
        className:
          "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300",
      })

      return data.balance
    } catch (error) {
      console.error("Gift card error:", error)

      toast({
        title: "Gift Card Error",
        description: error instanceof Error ? error.message : "Invalid gift card",
        variant: "destructive",
      })

      return null
    }
  }

  // Get wallet balance
  // const getWalletBalance = async () => {
  //   try {
  //     const response = await fetch("/api/payments/wallet/balance", {
  //       headers: {
  //         "X-User-Id": user?.id || "",
  //       },  {
  //       headers: {
  //         "X-User-Id": user?.id || "",
  //       },
  //     })

  //     if (!response.ok) {
  //       const errorData = await response.json()
  //       throw new Error(errorData.error || "Failed to get wallet balance")
  //     }

  //     const data = await response.json()
  //     setWalletBalance(data.balance)
  //     return data.balance
  //   } catch (error) {
  //     console.error("Wallet error:", error)
  //     return null
  //   }
  // }

  // Format credit card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }
    return value
  }

  // Handle card number input
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value)
    setCardNumber(formattedValue)

    // Detect card type
    const cardNumberWithoutSpaces = formattedValue.replace(/\s/g, "")
    for (const [type, { pattern }] of Object.entries(CARD_TYPES)) {
      if (pattern.test(cardNumberWithoutSpaces)) {
        setCardType(type as keyof typeof CARD_TYPES)
        return
      }
    }
    setCardType(null)
    
    // Auto-advance to expiry when full card number entered
    if (cardNumberWithoutSpaces.length === 16 && expiryRef.current) {
      expiryRef.current.focus()
    }
  }

  // Handle expiry date input
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatExpiryDate(e.target.value)
    setExpiryDate(formattedValue)
    
    // Auto-advance to CVV when full expiry entered
    if (formattedValue.length === 5 && cvvRef.current) {
      cvvRef.current.focus()
      setFlipCard(true)
    }
  }

  // Handle CVV input
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= 4) {
      setCvv(value)
    }
  }

  // Handle CVV focus/blur
  const handleCvvFocus = () => {
    setFlipCard(true)
  }

  const handleCvvBlur = () => {
    setFlipCard(false)
  }

  // Handle save card checkbox
  const handleSaveCardChange = (checked: boolean | string) => {
    setSaveCard(checked === true)
  }

  // Handle special offer checkbox
  const handleUseSpecialOfferChange = (checked: boolean | string) => {
    setUseSpecialOffer(checked === true)
  }

  // Handle gift card code input
  const handleGiftCardCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGiftCardCode(e.target.value)
  }

  // Handle gift card pin input
  const handleGiftCardPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGiftCardPin(e.target.value)
  }

  // Handle crypto currency selection
  const handleCryptoCurrencyChange = (value: string) => {
    setCryptoCurrency(value)
  }

  // Handle next form step
  const continueTo = (step: number) => {
    controls.start({
      opacity: 0,
      y: -20,
      transition: { duration: 0.2, ease: "easeIn" }
    }).then(() => {
      setFormStep(step)
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: "easeOut" }
      })
    })
  }

  // Handle previous form step
  const returnTo = (step: number) => {
    controls.start({
      opacity: 0,
      y: 20,
      transition: { duration: 0.2, ease: "easeIn" }
    }).then(() => {
      setFormStep(step)
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: "easeOut" }
      })
    })
  }

  // Check form validity based on payment method
  const isFormValid = () => {
    switch (paymentMethod) {
      case "card":
        return (
          cardName.length > 0 &&
          cardNumber.replace(/\s/g, "").length >= 15 &&
          expiryDate.length === 5 &&
          cvv.length >= 3
        )
      case "paypal":
        return true
      case "crypto":
        return true
      case "applepay":
        return true
      case "googlepay":
        return true
      case "bank":
        return true
      case "giftcard":
        return giftCardCode.length > 0 && giftCardBalance !== null && giftCardBalance >= total
      case "wallet":
        return walletBalance !== null && walletBalance >= total
      default:
        return false
    }
  }

  // Payment methods
  const paymentMethods: PaymentMethod[] = [
    {
      id: "card",
      name: "Credit Card",
      icon: <PaymentMethodIcon method="card" selected={paymentMethod === "card"} />,
      description: "Pay with Visa, Mastercard, American Express, and more.",
      popular: true,
      processingTime: "Instant",
      fees: "None",
      color: "bg-blue-500",
      gradientFrom: "from-blue-500",
      gradientTo: "to-indigo-600",
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: <PaymentMethodIcon method="paypal" selected={paymentMethod === "paypal"} />,
      description: "Pay with your PayPal account.",
      processingTime: "Instant",
      fees: "None",
      color: "bg-blue-600",
      gradientFrom: "from-blue-600",
      gradientTo: "to-blue-700",
    },
    {
      id: "crypto",
      name: "Cryptocurrency",
      icon: <PaymentMethodIcon method="crypto" selected={paymentMethod === "crypto"} />,
      description: "Pay with Bitcoin, Ethereum, and other cryptocurrencies.",
      processingTime: "Varies",
      fees: "Varies",
      color: "bg-orange-500",
      gradientFrom: "from-orange-500",
      gradientTo: "to-amber-600",
    },
    {
      id: "applepay",
      name: "Apple Pay",
      icon: <PaymentMethodIcon method="applepay" selected={paymentMethod === "applepay"} />,
      description: "Pay quickly and securely with Apple Pay.",
      processingTime: "Instant",
      fees: "None",
      color: "bg-gray-800",
      gradientFrom: "from-gray-800",
      gradientTo: "to-gray-900",
    },
    {
      id: "googlepay",
      name: "Google Pay",
      icon: <PaymentMethodIcon method="googlepay" selected={paymentMethod === "googlepay"} />,
      description: "Pay quickly and securely with Google Pay.",
      processingTime: "Instant",
      fees: "None",
      color: "bg-gray-800",
      gradientFrom: "from-blue-500",
      gradientTo: "to-blue-600",
    },
    {
      id: "bank",
      name: "Bank Transfer",
      icon: <PaymentMethodIcon method="bank" selected={paymentMethod === "bank"} />,
      description: "Pay directly from your bank account.",
      processingTime: "1-3 business days",
      fees: "None",
      color: "bg-green-500",
      gradientFrom: "from-green-500",
      gradientTo: "to-emerald-600",
    },
    {
      id: "giftcard",
      name: "Gift Card",
      icon: <PaymentMethodIcon method="giftcard" selected={paymentMethod === "giftcard"} />,
      description: "Redeem a gift card for your purchase.",
      processingTime: "Instant",
      fees: "None",
      color: "bg-purple-500",
      gradientFrom: "from-purple-500",
      gradientTo: "to-fuchsia-600",
    },
    {
      id: "wallet",
      name: "Wallet",
      icon: <PaymentMethodIcon method="wallet" selected={paymentMethod === "wallet"} />,
      description: "Pay using funds from your wallet.",
      processingTime: "Instant",
      fees: "None",
      color: "bg-teal-500",
      gradientFrom: "from-teal-500",
      gradientTo: "to-cyan-600",
    },
  ]

  // Mobile view
  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 768)
      setSidebarVisible(window.innerWidth >= 1024)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // User authentication and profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await onCurrentUser()
        setUser(user)
        setIsSignedIn(!!user)

        if (user) {
          const userProfile = await onUserInfo()
          if (userProfile.status === 200) {
            setUserProfile(userProfile.data)
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      }
    }

    fetchUser()
  }, [])

  // Stripe Card Payment Form component
  const CardPaymentForm = () => {
    const stripe = useStripe()
    const elements = useElements()
    const [cardError, setCardError] = useState<string | null>(null)
    const [cardComplete, setCardComplete] = useState(false)

    useEffect(() => {
      if (!stripe || !elements) {
        return
      }

      // Create a payment request for Apple Pay / Google Pay
      const pr = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: `${selectedPlan.name} Plan`,
          amount: Math.round(total * 100),
        },
        requestPayerName: true,
        requestPayerEmail: true,
      })

      // Check if the Payment Request is available
      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr)
        }
      })
    }, [stripe, elements])

    const handleCardChange = (event: any) => {
      setCardError(event.error ? event.error.message : null)
      setCardComplete(event.complete)

      // Try to determine card type from the brand
      if (event.brand) {
        const brand = event.brand.toLowerCase()
        if (Object.keys(CARD_TYPES).includes(brand)) {
          setCardType(brand as keyof typeof CARD_TYPES)
        }
      }
    }

    return (
      <div className="space-y-6">
        <div className="relative perspective-1000">
          <motion.div
            className="relative w-full h-56 transition-all duration-500 preserve-3d"
            animate={{ rotateY: flipCard ? 180 : 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Front of card */}
            <div className="absolute inset-0 backface-hidden rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-900 p-5 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <div className="text-white/70 text-xs uppercase tracking-wider">Credit Card</div>
                    <div className="text-white/90 text-xs mt-1">
                      {cardType ? <span className="uppercase">{cardType}</span> : <span>Visa / Mastercard / Amex</span>}
                    </div>
                  </div>
                  {cardType && (
                    <div className="h-10 w-14 bg-white/20 rounded-md grid place-items-center p-1">
                      <img
                        src={CARD_TYPES[cardType].icon || "/placeholder.svg?height=40&width=56"}
                        alt={cardType}
                        className="max-h-full"
                      />
                    </div>
                  )}
                </div>

                <div className="my-6">
                  <div className="text-xl text-white font-mono tracking-wider">
                    {cardNumber || "•••• •••• •••• ••••"}
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-white/60 text-xs uppercase tracking-wider mb-1">Card Holder</div>
                    <div className="text-white font-medium truncate max-w-[180px]">{cardName || "YOUR NAME"}</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs uppercase tracking-wider mb-1">Expires</div>
                    <div className="text-white font-medium">{expiryDate || "MM/YY"}</div>
                  </div>
                </div>

                {/* Circuit design elements */}
                <div className="absolute top-[40%] left-0 w-12 h-8 border-t-2 border-l-2 border-white/20 rounded-tl-lg"></div>
                <div className="absolute top-[30%] right-5 w-8 h-8 border-r-2 border-b-2 border-white/10 rounded-br-lg"></div>
                <div className="absolute bottom-6 left-[40%] w-12 h-3 border-b border-white/10 rounded"></div>
                <div className="absolute top-10 right-10 w-4 h-4 bg-white/10 rounded-full"></div>
                <div className="absolute top-5 left-[30%] w-3 h-3 bg-white/20 rounded-full"></div>
                <div className="absolute bottom-10 right-[20%] w-6 h-1 bg-white/20 rounded"></div>
              </div>
            </div>

            {/* Back of card */}
            <div className="absolute inset-0 backface-hidden rounded-xl overflow-hidden rotateY-180">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-violet-600 p-5 flex flex-col">
                <div className="w-full h-12 bg-black/30 mt-4"></div>

                <div className="mt-6 flex justify-end">
                  <div className="bg-white/90 h-10 w-full max-w-[80%] rounded relative flex items-center px-3">
                    <div className="absolute text-right w-full pr-12 font-mono text-gray-600 tracking-widest">
                      {cvv || "•••"}
                    </div>
                  </div>
                </div>

                <div className="mt-auto text-xs text-white/70 max-w-[80%]">
                  This card is property of your bank. Unauthorized use is prohibited. If found, please return to your
                  bank.
                </div>

                {/* Circuit design elements */}
                <div className="absolute top-[40%] right-0 w-12 h-8 border-t-2 border-r-2 border-white/20 rounded-tr-lg"></div>
                <div className="absolute bottom-10 left-5 w-8 h-8 border-l-2 border-b-2 border-white/10 rounded-bl-lg"></div>
                <div className="absolute bottom-6 right-[40%] w-12 h-3 border-b border-white/10 rounded"></div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-4">
          {/* Apple Pay / Google Pay button if available */}
          {paymentRequest && (
            <div className="mb-6">
              <h3 className="text-base font-medium mb-3">Express Checkout</h3>
              <PaymentRequestButtonElement
                options={{
                  paymentRequest,
                  style: {
                    paymentRequestButton: {
                      theme: "dark",
                      height: "44px",
                    },
                  },
                }}
              />
              <Separator className="my-6" />
              <h3 className="text-base font-medium mb-3">Or Pay with Card</h3>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="card-name">Cardholder Name</Label>
              <Input
                id="card-name"
                placeholder="Name on card"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="card-number">Card Details</Label>
              <div className="card-element p-3 border rounded-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-all duration-200 focus-within:ring-2 focus:ring-violet-500 focus-within:border-violet-500">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": {
                          color: "#aab7c4",
                        },
                      },
                      invalid: {
                        color: "#9e2146",
                      },
                    },
                  }}
                  onChange={handleCardChange}
                />
              </div>
              {cardError && <div className="text-sm text-red-500 mt-1">{cardError}</div>}
            </div>

            <div className="flex items-center space-x-2 mt-2">
              <Checkbox id="saveCard" checked={saveCard} onCheckedChange={handleSaveCardChange} />
              <label
                htmlFor="saveCard"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Save card for future payments
              </label>
            </div>
          </div>

          <div className="mt-2 text-sm text-muted-foreground flex items-center">
            <Lock className="h-4 w-4 mr-1" />
            <span>Your payment information is encrypted and secure.</span>
          </div>
        </div>
      </div>
    )
  }

  // Render payment method form based on selected method
  const renderPaymentMethodForm = () => {
    switch (paymentMethod) {
      case "card":
        return <CardPaymentForm />

      case "paypal":
        return (
          <div className="space-y-6">
            <div className="text-center py-10">
              <motion.div 
                className="bg-[#003087] text-white w-16 h-16 rounded-full mx-auto grid place-items-center mb-4"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <PaypalLogo className="h-8 w-8" />
              </motion.div>
              <h3 className="text-xl font-semibold">Pay with PayPal</h3>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                You will be redirected to PayPal to complete your payment securely. You will have a chance to review your
                order before the payment is finalized.
              </p>
            </div>

            <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-950/30 text-sm">
              <div className="flex">
                <Info className="h-5 w-5 text-blue-500 mr-2 shrink-0" />
                <span>
                  PayPal protects your payment information with industry-leading security and fraud prevention systems.
                  You are always protected if the item doesn&apos;t arrive or is significantly different than described.
                </span>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="button"
                className="w-full bg-[#0070ba] hover:bg-[#003087] text-white"
                onClick={() => processPayPalPayment()}
              >
                <PaypalLogo className="h-5 w-5 mr-2" />
                Proceed to PayPal
              </Button>
            </motion.div>
          </div>
        )

      case "crypto":
        return (
          <div className="space-y-6">
            <div className="text-center py-6">
              <motion.div 
                className="bg-[#F7931A] text-white w-16 h-16 rounded-full mx-auto grid place-items-center mb-4"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Bitcoin className="h-8 w-8" />
              </motion.div>
              <h3 className="text-xl font-semibold">Pay with Cryptocurrency</h3>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                Pay with your favorite cryptocurrency. We accept Bitcoin, Ethereum, and many other digital currencies.
              </p>
            </div>

            <div className="border rounded-lg p-5 bg-amber-50 dark:bg-amber-950/30">
              <Tabs defaultValue="bitcoin" className="w-full" onValueChange={handleCryptoCurrencyChange}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="bitcoin">Bitcoin</TabsTrigger>
                  <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
                  <TabsTrigger value="other">Others</TabsTrigger>
                </TabsList>
                <TabsContent value="bitcoin" className="space-y-4">
                  <div className="flex flex-col items-center">
                    {cryptoAddress ? (
                      <>
                        <motion.div 
                          className="bg-white p-2 rounded-lg mb-3"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <img
                            src={cryptoQRCode || `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${cryptoAddress}&choe=UTF-8`}
                            alt="Bitcoin QR Code"
                            className="h-40 w-40"
                          />
                        </motion.div>
                        <div className="text-sm text-center">
                          <p className="font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded-md text-xs break-all mb-2">
                            {cryptoAddress}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-1"
                            onClick={() => {
                              navigator.clipboard.writeText(cryptoAddress || "")
                              toast({
                                title: "Address Copied",
                                description: "Bitcoin address copied to clipboard",
                                variant: "default",
                              })
                            }}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Address
                          </Button>
                        </div>
                      </>
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          className="w-full bg-[#F7931A] hover:bg-[#E77F18] text-white"
                          onClick={() => processCryptoPayment()}
                        >
                          <Bitcoin className="h-5 w-5 mr-2" />
                          Generate Bitcoin Address
                        </Button>
                      </motion.div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-4">
                    <p className="flex items-start">
                      <Info className="h-4 w-4 mr-1 shrink-0 mt-0.5" />
                      Send exactly <span className="font-bold mx-1">{total.toFixed(2)} USD</span>
                      worth of Bitcoin to this address. Current exchange rate: 1 BTC ≈ $59,783.21 USD
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="ethereum" className="space-y-4">
                  <div className="flex flex-col items-center">
                    {cryptoAddress ? (
                      <>
                        <motion.div 
                          className="bg-white p-2 rounded-lg mb-3"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <img
                            src={cryptoQRCode || `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${cryptoAddress}&choe=UTF-8`}
                            alt="Ethereum QR Code"
                            className="h-40 w-40"
                          />
                        </motion.div>
                        <div className="text-sm text-center">
                          <p className="font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded-md text-xs break-all mb-2">
                            {cryptoAddress}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-1"
                            onClick={() => {
                              navigator.clipboard.writeText(cryptoAddress || "")
                              toast({
                                title: "Address Copied",
                                description: "Ethereum address copied to clipboard",
                                variant: "default",
                              })
                            }}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Address
                          </Button>
                        </div>
                      </>
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          className="w-full bg-[#627EEA] hover:bg-[#4C63BB] text-white"
                          onClick={() => processCryptoPayment()}
                        >
                          <Bitcoin className="h-5 w-5 mr-2" />
                          Generate Ethereum Address
                        </Button>
                      </motion.div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-4">
                    <p className="flex items-start">
                      <Info className="h-4 w-4 mr-1 shrink-0 mt-0.5" />
                      Send exactly <span className="font-bold mx-1">{total.toFixed(2)} USD</span>
                      worth of Ethereum to this address. Current exchange rate: 1 ETH ≈ $3,124.45 USD
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="other" className="py-3">
                  <Select onValueChange={handleCryptoCurrencyChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cryptocurrency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solana">Solana (SOL)</SelectItem>
                      <SelectItem value="cardano">Cardano (ADA)</SelectItem>
                      <SelectItem value="ripple">Ripple (XRP)</SelectItem>
                      <SelectItem value="polkadot">Polkadot (DOT)</SelectItem>
                      <SelectItem value="dogecoin">Dogecoin (DOGE)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-4">
                    Select your preferred cryptocurrency to view payment instructions.
                  </p>

                  {cryptoCurrency && cryptoCurrency !== "bitcoin" && cryptoCurrency !== "ethereum" && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-4"
                    >
                      <Button
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                        onClick={() => processCryptoPayment()}
                      >
                        <Bitcoin className="h-5 w-5 mr-2" />
                        Generate {cryptoCurrency.charAt(0).toUpperCase() + cryptoCurrency.slice(1)} Address
                      </Button>
                    </motion.div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            <div className="border rounded-lg p-4 bg-amber-50 dark:bg-amber-950/30 text-sm">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-amber-600 mr-2 shrink-0" />
                <span>
                  Please ensure you are sending the exact amount required. Cryptocurrency transactions cannot be
                  reversed. Payment will be confirmed after 1-3 network confirmations.
                </span>
              </div>
            </div>
          </div>
        )

      case "applepay":
        return (
          <div className="space-y-6">
            <div className="text-center py-10">
              <motion.div
                className="bg-black text-white w-16 h-16 rounded-full mx-auto grid place-items-center mb-4"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Apple className="h-8 w-8" />
              </motion.div>
              <h3 className="text-xl font-semibold">Pay with Apple Pay</h3>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                Pay quickly and securely with Apple Pay.
              </p>
            </div>

            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-950/30 text-sm">
              <div className="flex">
                <Info className="h-5 w-5 text-gray-500 mr-2 shrink-0" />
                <span>
                  Apple Pay is a mobile payment and digital wallet service by Apple Inc. that allows users to make
                  payments in person, in iOS apps, and on the web using Safari.
                </span>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="button"
                className="w-full bg-black hover:bg-gray-800 text-white"
                onClick={() => processApplePayPayment()}
              >
                <Apple className="h-5 w-5 mr-2" />
                Pay with Apple Pay
              </Button>
            </motion.div>
          </div>
        )

      case "googlepay":
        return (
          <div className="space-y-6">
            <div className="text-center py-10">
              <motion.div
                className="bg-[#3c82f6] text-white w-16 h-16 rounded-full mx-auto grid place-items-center mb-4"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <GooglePay className="h-8 w-8" />
              </motion.div>
              <h3 className="text-xl font-semibold">Pay with Google Pay</h3>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                Pay quickly and securely with Google Pay.
              </p>
            </div>

            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-950/30 text-sm">
              <div className="flex">
                <Info className="h-5 w-5 text-gray-500 mr-2 shrink-0" />
                <span>
                  Google Pay is a mobile payment service by Google that allows users to make payments in person, in
                  Android apps, and on the web.
                </span>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="button"
                className="w-full bg-[#3c82f6] hover:bg-[#3072de] text-white"
                onClick={() => processGooglePayPayment()}
              >
                <GooglePay className="h-5 w-5 mr-2" />
                Pay with Google Pay
              </Button>
            </motion.div>
          </div>
        )

      case "bank":
        return (
          <div className="space-y-6">
            <div className="text-center py-10">
              <motion.div
                className="bg-[#22c55e] text-white w-16 h-16 rounded-full mx-auto grid place-items-center mb-4"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <BankTransfer className="h-8 w-8" />
              </motion.div>
              <h3 className="text-xl font-semibold">Pay with Bank Transfer</h3>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                Make a direct bank transfer to our account. Please use the order ID as the payment reference.
              </p>
            </div>

            {bankDetails ? (
              <div className="border rounded-lg p-5 bg-green-50 dark:bg-green-950/30">
                <h4 className="text-lg font-semibold mb-3">Bank Details</h4>
                <div className="space-y-2">
                  <p className="flex items-center">
                    <Landmark className="h-4 w-4 mr-2 text-green-500 shrink-0" />
                    Bank Name: <span className="font-medium ml-1">{bankDetails.bankName}</span>
                  </p>
                  <p className="flex items-center">
                    <Timer className="h-4 w-4 mr-2 text-green-500 shrink-0" />
                    Account Name: <span className="font-medium ml-1">{bankDetails.accountName}</span>
                  </p>
                  <p className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-green-500 shrink-0" />
                    Account Number: <span className="font-medium ml-1">{bankDetails.accountNumber}</span>
                  </p>
                  <p className="flex items-center">
                    <Info className="h-4 w-4 mr-2 text-green-500 shrink-0" />
                    Reference Code: <span className="font-mono font-medium ml-1">{bankDetails.reference}</span>
                  </p>
                </div>
                <div className="text-xs text-muted-foreground mt-4">
                  <p className="flex items-start">
                    <AlertCircle className="h-4 w-4 mr-1 shrink-0 mt-0.5" />
                    Please allow 1-3 business days for the transfer to be processed.
                  </p>
                </div>
              </div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white"
                  onClick={() => processBankTransferPayment()}
                >
                  <BankTransfer className="h-5 w-5 mr-2" />
                  Initiate Bank Transfer
                </Button>
              </motion.div>
            )}
          </div>
        )

      case "giftcard":
        return (
          <div className="space-y-6">
            <div className="text-center py-10">
              <motion.div
                className="bg-[#a855f7] text-white w-16 h-16 rounded-full mx-auto grid place-items-center mb-4"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Gift className="h-8 w-8" />
              </motion.div>
              <h3 className="text-xl font-semibold">Pay with Gift Card</h3>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                Redeem a gift card for your purchase.
              </p>
            </div>

            <div className="border rounded-lg p-5 bg-purple-50 dark:bg-purple-950/30">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="gift-card-code">Gift Card Code</Label>
                  <Input
                    id="gift-card-code"
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    value={giftCardCode}
                    onChange={handleGiftCardCodeChange}
                    required
                    className="transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <Label htmlFor="gift-card-pin">Gift Card PIN</Label>
                  <Input
                    id="gift-card-pin"
                    type="password"
                    placeholder="PIN"
                    value={giftCardPin}
                    onChange={handleGiftCardPinChange}
                    required
                    className="transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              {giftCardBalance === null ? (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-4"
                >
                  <Button
                    className="w-full bg-[#a855f7] hover:bg-[#9333ea] text-white"
                    onClick={checkGiftCardBalance}
                  >
                    Check Gift Card Balance
                  </Button>
                </motion.div>
              ) : (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    Gift card balance: ${giftCardBalance.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )

      case "wallet":
        return (
          <div className="space-y-6">
            <div className="text-center py-10">
              <motion.div
                className="bg-[#14b8a6] text-white w-16 h-16 rounded-full mx-auto grid place-items-center mb-4"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Wallet className="h-8 w-8" />
              </motion.div>
              <h3 className="text-xl font-semibold">Pay with Wallet</h3>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                Pay using funds from your wallet.
              </p>
            </div>

            {walletBalance === null ? (
              <div className="border rounded-lg p-5 bg-teal-50 dark:bg-teal-950/30">
                <p className="text-sm text-muted-foreground">
                  Loading wallet balance...
                </p>
              </div>
            ) : (
              <div className="border rounded-lg p-5 bg-teal-50 dark:bg-teal-950/30">
                <p className="text-sm text-muted-foreground">
                  Wallet balance: ${walletBalance.toFixed(2)}
                </p>
              </div>
            )}

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="button"
                className="w-full bg-[#14b8a6] hover:bg-[#0e766a] text-white"
                onClick={() => processWalletPayment()}
                disabled={walletBalance === null || walletBalance < total}
              >
                Pay with Wallet
              </Button>
            </motion.div>
          </div>
        )

      default:
        return <div className="text-red-500">Invalid payment method</div>
    }
  }

  // Render form steps
  const renderFormSteps = () => {
    switch (formStep) {
      case 0:
        return (
          <motion.div
            key="payment-method"
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold">Select Payment Method</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {paymentMethods.map((method) => (
                <motion.div
                  key={method.id}
                  className="relative rounded-xl overflow-hidden transition-all duration-300 hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-full flex flex-col items-start p-4 text-left rounded-xl border-gray-200 dark:border-gray-700",
                      paymentMethod === method.id
                        ? "border-2 border-violet-500 dark:border-violet-400 shadow-sm"
                        : "hover:shadow-md",
                    )}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <div className="flex items-center mb-3">
                      {method.icon}
                      {method.popular && (
                        <Badge className="ml-2 bg-violet-500 text-white text-[0.7rem]">Popular</Badge>
                      )}
                    </div>
                    <h4 className="text-sm font-medium">{method.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{method.description}</p>
                    <div className="mt-3 text-xs text-muted-foreground">
                      Processing Time: {method.processingTime}
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
            <Button onClick={() => continueTo(1)} disabled={!paymentMethod}>
              Continue to Payment Details <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </motion.div>
        )

      case 1:
        return (
          <motion.div
            key="payment-details"
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Button variant="ghost" className="text-sm" onClick={() => returnTo(0)}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Payment Method
            </Button>
            <h3 className="text-lg font-semibold">Enter Payment Details</h3>
            {renderPaymentMethodForm()}
            <Button onClick={() => continueTo(2)} disabled={!isFormValid()}>
              Continue to Review <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            key="review-order"
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Button variant="ghost" className="text-sm" onClick={() => returnTo(1)}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Payment Details
            </Button>
            <h3 className="text-lg font-semibold">Review Order</h3>
            <Card className="shadow-none border dark:border-gray-700">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Please review your order before submitting.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div>
                      {item.included && <CheckCircle2 className="h-4 w-4 text-green-500 mr-1 inline-block" />}
                      <span className={cn({ "line-through text-gray-500": item.waived })}>{item.name}</span>
                    </div>
                    <div>
                      {item.waived && <Badge variant="secondary">Waived</Badge>}
                      {item.saving && <Badge variant="destructive">Save {item.saving}</Badge>}
                      ${item.price.toFixed(2)}
                    </div>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between font-medium">
                    <span>Discount</span>
                    <span className="text-green-500">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the terms and conditions
              </label>
            </div>
            <Button onClick={handleSubmit} disabled={paymentProcessing}>
              {paymentProcessing ? (
                <>
                  Processing Payment...
                  <RefreshCcw className="h-4 w-4 ml-2 animate-spin" />
                </>
              ) : (
                <>
                  Confirm and Pay
                  <Lock className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            key="payment-success"
            className="space-y-6 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            onAnimationComplete={() => setAnimationComplete(true)}
          >
            <Particles />
            <div className="text-center py-12">
              <motion.div
                className="bg-green-500 text-white w-20 h-20 rounded-full mx-auto grid place-items-center mb-4 relative"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 150, damping: 10 }}
              >
                <Check className="h-10 w-10" />
                <motion.div
                  className="absolute inset-0 rounded-full bg-green-500 animate-ping"
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                />
              </motion.div>
              <h3 className="text-2xl font-semibold">Payment Successful!</h3>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                Thank you for your purchase. Your payment has been processed successfully.
              </p>
              {transactionId && (
                <p className="text-sm text-muted-foreground mt-2">
                  Transaction ID: <span className="font-mono">{transactionId}</span>
                </p>
              )}
            </div>

            <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-950/30 text-sm">
              <div className="flex">
                <ThumbsUp className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span>
                  You now have access to all the features of your selected plan. Start exploring and enjoy the benefits!
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button className="w-full" onClick={() => router.push("/dashboard")}>
                  Go to Dashboard <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button variant="secondary" className="w-full" onClick={() => router.push("/account/billing")}>
                  View Billing Details <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )

      default:
        return <div className="text-red-500">Invalid form step</div>
    }
  }

  return (
    <div className="container relative py-10">
      <AnimatePresence mode="wait">
        {paymentError && (
          <motion.div
            className="absolute top-0 left-0 w-full p-4 bg-red-100 border border-red-400 text-red-700 rounded-md z-50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <p className="font-bold">Payment Error</p>
            <p>{paymentError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {sidebarVisible && (
          <motion.aside
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-none border dark:border-gray-700">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Review your order details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div>
                      {item.included && <CheckCircle2 className="h-4 w-4 text-green-500 mr-1 inline-block" />}
                      <span className={cn({ "line-through text-gray-500": item.waived })}>{item.name}</span>
                    </div>
                    <div>
                      {item.waived && <Badge variant="secondary">Waived</Badge>}
                      {item.saving && <Badge variant="destructive">Save {item.saving}</Badge>}
                      ${item.price.toFixed(2)}
                    </div>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {useSpecialOffer && (
                  <div className="flex justify-between items-center">
                    <span>Special Offer</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>You are using a special offer that gives you a 25% discount.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <span className="text-green-500">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox id="specialOffer" checked={useSpecialOffer} onCheckedChange={handleUseSpecialOfferChange} />
                  <label
                    htmlFor="specialOffer"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Use special offer
                  </label>
                </div>
              </CardFooter>
            </Card>
          </motion.aside>
        )}

        <div className={cn("lg:col-span-3", mobileView && !sidebarVisible ? "w-full" : "")}>
          {mobileView && (
            <div className="mb-6">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline">
                    Show Order Summary <ChevronsUpDown className="h-4 w-4 ml-2" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Order Summary</DrawerTitle>
                    <DrawerDescription>Review your order details.</DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4">
                    <Card className="shadow-none border dark:border-gray-700">
                      <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                        <CardDescription>Review your order details.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {items.map((item, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <div>
                              {item.included && <CheckCircle2 className="h-4 w-4 text-green-500 mr-1 inline-block" />}
                              <span className={cn({ "line-through text-gray-500": item.waived })}>{item.name}</span>
                            </div>
                            <div>
                              {item.waived && <Badge variant="secondary">Waived</Badge>}
                              {item.saving && <Badge variant="destructive">Save {item.saving}</Badge>}
                              ${item.price.toFixed(2)}
                            </div>
                          </div>
                        ))}
                        <Separator />
                        <div className="flex justify-between font-medium">
                          <span>Subtotal</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        {useSpecialOffer && (
                          <div className="flex justify-between items-center">
                            <span>Special Offer</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>You are using a special offer that gives you a 25% discount.</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <span className="text-green-500">-${discount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-medium">
                          <span>Tax (8%)</span>
                          <span>${tax.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Total</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="flex items-center space-x-2 mt-2">
                          <Checkbox id="specialOffer" checked={useSpecialOffer} onCheckedChange={handleUseSpecialOfferChange} />
                          <label
                            htmlFor="specialOffer"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Use special offer
                          </label>
                        </div>
                      </CardFooter>
                    </Card>
                  </div>
                  <DrawerFooter>
                    <Button variant="outline" onClick={() => setSidebarVisible(false)}>
                      Close
                    </Button>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">{renderFormSteps()}</AnimatePresence>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage
