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
      // setPaymentError("Failed to initialize payment. Please try again.")

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


  // const processApplePayPayments = async (): Promise<PaymentResult> => {
  //   try {
  //     const response = await fetch("/api/apple-pay/session", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         amount: Math.round(total * 100),
  //         currency: "usd",
  //         items,
  //       }),
  //     })

  //     if (!response.ok) {
  //       throw new Error("Failed to create Apple Pay session")
  //     }

  //     const data = await response.json()

  //     // In a real implementation, you would use the Apple Pay JS API
  //     // with the session data returned from the server

  //     return { success: true, transactionId: `AP-${Date.now()}` }
  //   } catch (error) {
  //     console.error("Apple Pay error:", error)
  //     return { success: false, error: "Failed to process Apple Pay payment" }
  //   }
  // }



  // Process Apple Pay payment tbd
  const processApplePayPayment = async (): Promise<PaymentResult> => {
    try {
      if (
        (typeof window !== "undefined" && !("ApplePaySession" in window)) ||
        !(window as any).ApplePaySession?.canMakePayments()
      ) {
        throw new Error("Apple Pay is not available on this device")
      }
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

  // Fix the getWalletBalance function with proper fetch syntax
  const getWalletBalance = async () => {
    try {
      const response = await fetch("/api/payments/wallet/balance", {
        headers: {
          "X-User-Id": user?.id || "",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get wallet balance")
      }

      const data = await response.json()
      setWalletBalance(data.balance)
      return data.balance
    } catch (error) {
      console.error("Wallet error:", error)
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
                        src={CARD_TYPES[cardType].icon || "/placeholdera.svg?height=40&width=56"}
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
