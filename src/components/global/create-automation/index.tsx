// "use client"

// import { Button } from "@/components/ui/button"
// import { useMemo, useState } from "react"
// import Loader from "../loader"
// import { AutomationDuoToneWhite } from "@/icons"
// import { useCreateAutomation } from "@/hooks/use-automations"
// import { v4 } from "uuid"
// import { useRouter, usePathname } from "next/navigation"
// import { motion, AnimatePresence } from "framer-motion"
// import { Check } from "lucide-react"

// const CreateAutomation = () => {
//   const mutationId = useMemo(() => v4(), [])
//   const router = useRouter()
//   const pathname = usePathname()
//   const [showSuccess, setShowSuccess] = useState(false)

//   const { isPending, mutate } = useCreateAutomation(mutationId)

//   const handleCreateAutomation = () => {
//     const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
//     const slug = slugMatch ? slugMatch[1] : ""

//     mutate(
//       {
//         name: "Untitled",
//         id: mutationId,
//         createdAt: new Date(),
//         keywords: [],
//       },
//       {
//         onSuccess: () => {
//           setShowSuccess(true)
//           setTimeout(() => {
//             setShowSuccess(false)
//             router.push(`/dashboard/${slug}/automations`)
//           }, 2000) // Redirect after 2 seconds
//         },
//       },
//     )
//   }

//   const particles = useMemo(() => Array.from({ length: 20 }), [])

//   return (
//     <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//       <Button
//         className="lg:px-10 py-6 bg-gradient-to-br hover:opacity-80 text-white rounded-full from-[#3352CC] font-medium to-[#1C2D70] shadow-lg transition-all duration-300 ease-in-out relative overflow-hidden"
//         onClick={handleCreateAutomation}
//         disabled={isPending || showSuccess}
//       >
//         <AnimatePresence mode="wait">
//           {showSuccess ? (
//             <motion.div
//               key="success"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="absolute inset-0 flex items-center justify-center"
//             >
//               <motion.div
//                 initial={{ scale: 0, rotate: -180 }}
//                 animate={{ scale: 1, rotate: 0 }}
//                 transition={{ type: "spring", damping: 10, stiffness: 100 }}
//                 className="bg-green-500 rounded-full p-2"
//               >
//                 <Check className="text-white" size={24} />
//               </motion.div>
//               {particles.map((_, index) => (
//                 <motion.div
//                   key={index}
//                   className="absolute w-1 h-1 bg-yellow-300 rounded-full"
//                   initial={{
//                     x: 0,
//                     y: 0,
//                     opacity: 1,
//                   }}
//                   animate={{
//                     x: Math.random() * 100 - 50,
//                     y: Math.random() * 100 - 50,
//                     opacity: 0,
//                     scale: Math.random() * 3 + 1,
//                   }}
//                   transition={{ duration: 1, delay: index * 0.02 }}
//                 />
//               ))}
//             </motion.div>
//           ) : (
//             <motion.div
//               key="button-content"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="flex items-center justify-center"
//             >
//               <Loader state={isPending}>
//                 <AutomationDuoToneWhite />
//                 <span className="lg:inline hidden">Create Automation</span>
//               </Loader>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </Button>
//     </motion.div>
//   )
// }

// export default CreateAutomation

// "use client"

// import { Button } from "@/components/ui/button"
// import { useMemo, useState } from "react"
// import Loader from "../loader"
// import { AutomationDuoToneWhite } from "@/icons"
// import { useCreateAutomation } from "@/hooks/use-automations"
// import { v4 } from "uuid"
// import { useRouter, usePathname } from "next/navigation"
// import { motion, AnimatePresence } from "framer-motion"
// import { Check } from "lucide-react"

// const CreateAutomation = () => {
//   const mutationId = useMemo(() => v4(), [])
//   const router = useRouter()
//   const pathname = usePathname()
//   const [showSuccess, setShowSuccess] = useState(false)

//   const { isPending, mutate } = useCreateAutomation(mutationId)

//   const handleCreateAutomation = () => {
//     const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
//     const slug = slugMatch ? slugMatch[1] : ""

//     // Create a unique ID for this automation
//     const newAutomationId = `temp-${Date.now()}`

//     mutate(
//       {
//         name: "Untitled",
//         id: newAutomationId,
//         createdAt: new Date().toISOString(), // Use ISO string for date
//         keywords: [],
//       },
//       {
//         onSuccess: () => {
//           setShowSuccess(true)
//           setTimeout(() => {
//             setShowSuccess(false)
//           }, 2000)
//         },
//       },
//     )
//   }

//   const particles = useMemo(() => Array.from({ length: 20 }), [])

//   return (
//     <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//       <Button
//         className="lg:px-10 py-6 bg-gradient-to-br hover:opacity-80 text-white rounded-full from-[#3352CC] font-medium to-[#1C2D70] shadow-lg transition-all duration-300 ease-in-out relative overflow-hidden"
//         onClick={handleCreateAutomation}
//         disabled={isPending || showSuccess}
//       >
//         <AnimatePresence mode="wait">
//           {showSuccess ? (
//             <motion.div
//               key="success"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="absolute inset-0 flex items-center justify-center"
//             >
//               <motion.div
//                 initial={{ scale: 0, rotate: -180 }}
//                 animate={{ scale: 1, rotate: 0 }}
//                 transition={{ type: "spring", damping: 10, stiffness: 100 }}
//                 className="bg-green-500 rounded-full p-2"
//               >
//                 <Check className="text-white" size={24} />
//               </motion.div>
//               {particles.map((_, index) => (
//                 <motion.div
//                   key={index}
//                   className="absolute w-1 h-1 bg-yellow-300 rounded-full"
//                   initial={{
//                     x: 0,
//                     y: 0,
//                     opacity: 1,
//                   }}
//                   animate={{
//                     x: Math.random() * 100 - 50,
//                     y: Math.random() * 100 - 50,
//                     opacity: 0,
//                     scale: Math.random() * 3 + 1,
//                   }}
//                   transition={{ duration: 1, delay: index * 0.02 }}
//                 />
//               ))}
//             </motion.div>
//           ) : (
//             <motion.div
//               key="button-content"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="flex items-center justify-center"
//             >
//               <Loader state={isPending}>
//                 <AutomationDuoToneWhite />
//                 <span className="lg:inline hidden">Create Automation</span>
//               </Loader>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </Button>
//     </motion.div>
//   )
// }

// export default CreateAutomation


//LATEST AS OF 9TH OCTOBER



// "use client"

// import { Button } from "@/components/ui/button"
// import { useMemo, useState } from "react"
// import Loader from "../loader"
// import { useCreateAutomation } from "@/hooks/use-automations"
// import { v4 } from "uuid"
// import { useRouter, usePathname } from "next/navigation"
// import { motion, AnimatePresence } from "framer-motion"
// import { Check, Zap } from "lucide-react"

// const CreateAutomation = () => {
//   const mutationId = useMemo(() => v4(), [])
//   const router = useRouter()
//   const pathname = usePathname()
//   const [showSuccess, setShowSuccess] = useState(false)

//   const { isPending, mutate } = useCreateAutomation(mutationId)

//   const handleCreateAutomation = () => {
//     const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
//     const slug = slugMatch ? slugMatch[1] : ""

//     // Create a unique ID for this automation
//     const newAutomationId = `temp-${Date.now()}`

//     mutate(
//       {
//         name: "Untitled",
//         id: newAutomationId,
//         // createdAt: new Date().toISOString(),
//         keywords: [],
//         // Add any other required fields for your automation
//         active: false,
//         listener: null,
//       },
//       {
//         onSuccess: (data: any) => {
//           // Show success animation
//           setShowSuccess(true)
//           setTimeout(() => {
//             setShowSuccess(false)
//           }, 2000)

//           // Optional: Navigate to the new automation if you have the real ID
//           if (data?.data?.id) {
//             //Uncomment if you want to navigate to the new automation
//             setTimeout(() => {
//               router.push(`/dashboard/${slug}/automations/${data.data.id}`)
//             }, 1000)
//           }
//         },
//         // onError: (error) => {
//         //   console.error("Failed to create automation:", error)
//         //   // The error toast is already handled in the hook
//         // },
//       },
//     )
//   }

//   const particles = useMemo(() => Array.from({ length: 20 }), [])

//   return (
//     <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//       <Button
//         className="lg:px-10 py-6 bg-gradient-to-br hover:opacity-80 text-white rounded-full from-[#3352CC] font-medium to-[#1C2D70] shadow-lg transition-all duration-300 ease-in-out relative overflow-hidden"
//         onClick={handleCreateAutomation}
//         disabled={isPending || showSuccess}
//       >
//         <AnimatePresence mode="wait">
//           {showSuccess ? (
//             <motion.div
//               key="success"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="absolute inset-0 flex items-center justify-center"
//             >
//               <motion.div
//                 initial={{ scale: 0, rotate: -180 }}
//                 animate={{ scale: 1, rotate: 0 }}
//                 transition={{ type: "spring", damping: 10, stiffness: 100 }}
//                 className="bg-green-500 rounded-full p-2"
//               >
//                 <Check className="text-white" size={24} />
//               </motion.div>
//               {particles.map((_, index) => (
//                 <motion.div
//                   key={index}
//                   className="absolute w-1 h-1 bg-yellow-300 rounded-full"
//                   initial={{
//                     x: 0,
//                     y: 0,
//                     opacity: 1,
//                   }}
//                   animate={{
//                     x: Math.random() * 100 - 50,
//                     y: Math.random() * 100 - 50,
//                     opacity: 0,
//                     scale: Math.random() * 3 + 1,
//                   }}
//                   transition={{ duration: 1, delay: index * 0.02 }}
//                 />
//               ))}
//             </motion.div>
//           ) : (
//             <motion.div
//               key="button-content"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="flex items-center justify-center"
//             >
//               <Loader state={isPending}>
//                 <Zap />
//                 <span className="lg:inline hidden">Create Automation</span>
//               </Loader>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </Button>
//     </motion.div>
//   )
// }

// export default CreateAutomation


// "use client"

// import { Button } from "@/components/ui/button"
// import { useMemo, useState } from "react"
// import Loader from "../loader"
// import { useCreateAutomation } from "@/hooks/use-automations"
// import { v4 } from "uuid"
// import { useRouter, usePathname } from "next/navigation"
// import { motion, AnimatePresence } from "framer-motion"
// import { Check, Zap, Lock, AlertCircle, Crown, Sparkles } from "lucide-react"
// import { useSubscription } from "@/contexts/subscription-context"

// // Configuration for plan limits
// const PLAN_LIMITS = {
//   FREE: 2,
//   PRO: 50,
//   ENTERPRISE: 999,
// }

// type CreateAutomationProps = {
//   currentAutomationCount?: number
//   onUpgradeClick?: () => void
// }

// const CreateAutomation = ({ currentAutomationCount = 0, onUpgradeClick }: CreateAutomationProps) => {
//   const mutationId = useMemo(() => v4(), [])
//   const router = useRouter()
//   const pathname = usePathname()
//   const [showSuccess, setShowSuccess] = useState(false)
//   const [showLimitWarning, setShowLimitWarning] = useState(false)

//   const { subscription, isLoading: subscriptionLoading } = useSubscription()
//   const { isPending, mutate } = useCreateAutomation(mutationId)

//   const currentPlan = subscription?.plan || "FREE"
//   const automationLimit = PLAN_LIMITS[currentPlan]
//   const remainingAutomations = Math.max(0, automationLimit - currentAutomationCount)
//   const isAtLimit = currentAutomationCount >= automationLimit
//   const isNearLimit = remainingAutomations <= 1 && remainingAutomations > 0

//   const handleCreateAutomation = () => {
//     // If at limit, show warning and trigger upgrade popup
//     if (isAtLimit) {
//       setShowLimitWarning(true)
//       setTimeout(() => setShowLimitWarning(false), 3000)
      
//       // Trigger the upgrade popup if callback provided
//       if (onUpgradeClick) {
//         onUpgradeClick()
//       }
//       return
//     }

//     const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
//     const slug = slugMatch ? slugMatch[1] : ""
//     const newAutomationId = `temp-${Date.now()}`

//     mutate(
//       {
//         name: "Untitled",
//         id: newAutomationId,
//         keywords: [],
//         active: false,
//         listener: null,
//       },
//       {
//         onSuccess: (data: any) => {
//           setShowSuccess(true)
//           setTimeout(() => {
//             setShowSuccess(false)
//           }, 2000)

//           if (data?.data?.id) {
//             setTimeout(() => {
//               router.push(`/dashboard/${slug}/automations/${data.data.id}`)
//             }, 1000)
//           }
//         },
//       },
//     )
//   }

//   const particles = useMemo(() => Array.from({ length: 20 }), [])

//   const getPlanBadge = () => {
//     if (currentPlan === "FREE") {
//       return (
//         <div className="flex items-center gap-1 text-xs text-gray-400">
//           <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400"></span>
//           Free Plan
//         </div>
//       )
//     }
//     if (currentPlan === "PRO") {
//       return (
//         <div className="flex items-center gap-1 text-xs text-purple-400">
//           <Crown size={12} />
//           Pro Plan
//         </div>
//       )
//     }
//     return (
//       <div className="flex items-center gap-1 text-xs text-yellow-400">
//         <Sparkles size={12} />
//         Enterprise
//       </div>
//     )
//   }

//   return (
//     <div className="relative">
//       {/* Main Button Container */}
//       <motion.div 
//         whileHover={{ scale: isAtLimit ? 1 : 1.05 }} 
//         whileTap={{ scale: isAtLimit ? 1 : 0.95 }}
//         className="relative"
//       >
//         <Button
//           className={`lg:px-10 py-6 text-white rounded-full font-medium shadow-lg transition-all duration-300 ease-in-out relative overflow-hidden ${
//             isAtLimit
//               ? "bg-gradient-to-br from-gray-400 to-gray-600 cursor-not-allowed opacity-70"
//               : "bg-gradient-to-br from-[#3352CC] to-[#1C2D70] hover:opacity-80"
//           }`}
//           onClick={handleCreateAutomation}
//           disabled={isPending || showSuccess || isAtLimit || subscriptionLoading}
//         >
//           <AnimatePresence mode="wait">
//             {showLimitWarning ? (
//               <motion.div
//                 key="warning"
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.8 }}
//                 className="absolute inset-0 flex items-center justify-center bg-red-500"
//               >
//                 <Lock className="text-white mr-2" size={20} />
//                 <span className="font-semibold">Limit Reached!</span>
//               </motion.div>
//             ) : showSuccess ? (
//               <motion.div
//                 key="success"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="absolute inset-0 flex items-center justify-center"
//               >
//                 <motion.div
//                   initial={{ scale: 0, rotate: -180 }}
//                   animate={{ scale: 1, rotate: 0 }}
//                   transition={{ type: "spring", damping: 10, stiffness: 100 }}
//                   className="bg-green-500 rounded-full p-2"
//                 >
//                   <Check className="text-white" size={24} />
//                 </motion.div>
//                 {particles.map((_, index) => (
//                   <motion.div
//                     key={index}
//                     className="absolute w-1 h-1 bg-yellow-300 rounded-full"
//                     initial={{ x: 0, y: 0, opacity: 1 }}
//                     animate={{
//                       x: Math.random() * 100 - 50,
//                       y: Math.random() * 100 - 50,
//                       opacity: 0,
//                       scale: Math.random() * 3 + 1,
//                     }}
//                     transition={{ duration: 1, delay: index * 0.02 }}
//                   />
//                 ))}
//               </motion.div>
//             ) : (
//               <motion.div
//                 key="button-content"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="flex items-center justify-center"
//               >
//                 <Loader state={isPending}>
//                   {isAtLimit ? <Lock size={20} /> : <Zap />}
//                   <span className="lg:inline hidden">
//                     {isAtLimit ? "Limit Reached" : "Create Automation"}
//                   </span>
//                 </Loader>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </Button>
//       </motion.div>

//       {/* Usage Info Below Button */}
//       <motion.div
//         initial={{ opacity: 0, y: -10 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="mt-3 flex items-center justify-between gap-3"
//       >
//         <div className="flex-1">
//           {/* Progress Bar */}
//           <div className="relative h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
//             <motion.div
//               initial={{ width: 0 }}
//               animate={{ 
//                 width: `${(currentAutomationCount / automationLimit) * 100}%` 
//               }}
//               transition={{ duration: 0.5, ease: "easeOut" }}
//               className={`h-full rounded-full ${
//                 isAtLimit
//                   ? "bg-red-500"
//                   : isNearLimit
//                   ? "bg-yellow-500"
//                   : "bg-gradient-to-r from-[#3352CC] to-[#1C2D70]"
//               }`}
//             />
//           </div>
          
//           {/* Usage Text */}
//           <div className="flex items-center justify-between mt-1.5">
//             <span className={`text-xs font-medium ${
//               isAtLimit ? "text-red-600" : isNearLimit ? "text-yellow-600" : "text-gray-600 dark:text-gray-400"
//             }`}>
//               {currentAutomationCount} / {automationLimit} automations
//             </span>
//             {getPlanBadge()}
//           </div>
//         </div>
//       </motion.div>

//       {/* Upgrade Prompt - Shows when at or near limit on FREE plan */}
//       <AnimatePresence>
//         {(isAtLimit || isNearLimit) && currentPlan === "FREE" && (
//           <motion.div
//             initial={{ opacity: 0, y: -10, scale: 0.95 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: -10, scale: 0.95 }}
//             className={`mt-3 p-3 rounded-lg border ${
//               isAtLimit
//                 ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50"
//                 : "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900/50"
//             }`}
//           >
//             <div className="flex items-start gap-2">
//               <AlertCircle 
//                 size={16} 
//                 className={isAtLimit ? "text-red-600 dark:text-red-400 mt-0.5" : "text-yellow-600 dark:text-yellow-400 mt-0.5"} 
//               />
//               <div className="flex-1">
//                 <p className={`text-sm font-medium ${
//                   isAtLimit ? "text-red-900 dark:text-red-300" : "text-yellow-900 dark:text-yellow-300"
//                 }`}>
//                   {isAtLimit 
//                     ? "You've reached your automation limit" 
//                     : `Only ${remainingAutomations} automation${remainingAutomations === 1 ? '' : 's'} left!`}
//                 </p>
//                 <p className={`text-xs mt-1 ${
//                   isAtLimit ? "text-red-700 dark:text-red-400" : "text-yellow-700 dark:text-yellow-400"
//                 }`}>
//                   Upgrade to Pro for 50 automations and unlock advanced features.
//                 </p>
//                 <Button
//                   size="sm"
//                   className="mt-2 h-7 text-xs bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
//                   onClick={onUpgradeClick || (() => router.push("/dashboard/billing"))}
//                 >
//                   <Crown size={12} className="mr-1" />
//                   Upgrade Now
//                 </Button>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   )
// }

// export default CreateAutomation



// "use client"

// import { Button } from "@/components/ui/button"
// import { useMemo, useState } from "react"
// import Loader from "../loader"
// import { useCreateAutomation } from "@/hooks/use-automations"
// import { v4 } from "uuid"
// import { useRouter, usePathname } from "next/navigation"
// import { motion, AnimatePresence } from "framer-motion"
// import { Check, Zap, Lock, AlertCircle, Crown, Sparkles } from "lucide-react"
// import { useSubscription } from "@/contexts/subscription-context"

// // Configuration for plan limits
// const PLAN_LIMITS = {
//   FREE: 2,
//   PRO: 50,
//   ENTERPRISE: 999,
// }

// type CreateAutomationProps = {
//   currentAutomationCount?: number
//   onUpgradeClick?: () => void
// }

// const CreateAutomation = ({ currentAutomationCount = 0, onUpgradeClick }: CreateAutomationProps) => {
//   const mutationId = useMemo(() => v4(), [])
//   const router = useRouter()
//   const pathname = usePathname()
//   const [showSuccess, setShowSuccess] = useState(false)
//   const [showLimitWarning, setShowLimitWarning] = useState(false)

//   const { subscription, isLoading: subscriptionLoading } = useSubscription()
//   const { isPending, mutate } = useCreateAutomation(mutationId)

//   const currentPlan = subscription?.plan || "FREE"
//   const automationLimit = PLAN_LIMITS[currentPlan]
//   const remainingAutomations = Math.max(0, automationLimit - currentAutomationCount)
//   const isAtLimit = currentAutomationCount >= automationLimit
//   const isNearLimit = remainingAutomations <= 1 && remainingAutomations > 0

//   const handleCreateAutomation = () => {
//     // If at limit, show warning and trigger upgrade popup
//     if (isAtLimit) {
//       setShowLimitWarning(true)
//       setTimeout(() => setShowLimitWarning(false), 3000)
      
//       // Trigger the upgrade popup if callback provided
//       if (onUpgradeClick) {
//         onUpgradeClick()
//       }
//       return
//     }

//     const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
//     const slug = slugMatch ? slugMatch[1] : ""
//     const newAutomationId = `temp-${Date.now()}`

//     mutate(
//       {
//         name: "Untitled",
//         id: newAutomationId,
//         keywords: [],
//         active: false,
//         listener: null,
//       },
//       {
//         onSuccess: (data: any) => {
//           setShowSuccess(true)
          
//           // ✅ Navigate after a short delay to ensure the UI updates
//           if (data?.data?.id || data?.res?.id) {
//             const automationId = data?.data?.id || data?.res?.id
            
//             setTimeout(() => {
//               setShowSuccess(false)
//               router.push(`/dashboard/${slug}/automations/${automationId}`)
//             }, 1500) // Reduced delay since we're now waiting for refetch
//           } else {
//             // If no ID is returned, just close the success state
//             setTimeout(() => {
//               setShowSuccess(false)
//             }, 2000)
//           }
//         },
//       },
//     )
//   }

//   const particles = useMemo(() => Array.from({ length: 20 }), [])

//   const getPlanBadge = () => {
//     if (currentPlan === "FREE") {
//       return (
//         <div className="flex items-center gap-1 text-xs text-gray-400">
//           <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400"></span>
//           Free Plan
//         </div>
//       )
//     }
//     if (currentPlan === "PRO") {
//       return (
//         <div className="flex items-center gap-1 text-xs text-purple-400">
//           <Crown size={12} />
//           Pro Plan
//         </div>
//       )
//     }
//     return (
//       <div className="flex items-center gap-1 text-xs text-yellow-400">
//         <Sparkles size={12} />
//         Enterprise
//       </div>
//     )
//   }

//   return (
//     <div className="relative">
//       {/* Main Button Container */}
//       <motion.div 
//         whileHover={{ scale: isAtLimit ? 1 : 1.05 }} 
//         whileTap={{ scale: isAtLimit ? 1 : 0.95 }}
//         className="relative"
//       >
//         <Button
//           className={`lg:px-10 py-6 text-white rounded-full font-medium shadow-lg transition-all duration-300 ease-in-out relative overflow-hidden ${
//             isAtLimit
//               ? "bg-gradient-to-br from-gray-400 to-gray-600 cursor-not-allowed opacity-70"
//               : "bg-gradient-to-br from-[#3352CC] to-[#1C2D70] hover:opacity-80"
//           }`}
//           onClick={handleCreateAutomation}
//           disabled={isPending || showSuccess || isAtLimit || subscriptionLoading}
//         >
//           <AnimatePresence mode="wait">
//             {showLimitWarning ? (
//               <motion.div
//                 key="warning"
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.8 }}
//                 className="absolute inset-0 flex items-center justify-center bg-red-500"
//               >
//                 <Lock className="text-white mr-2" size={20} />
//                 <span className="font-semibold">Limit Reached!</span>
//               </motion.div>
//             ) : showSuccess ? (
//               <motion.div
//                 key="success"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="absolute inset-0 flex items-center justify-center"
//               >
//                 <motion.div
//                   initial={{ scale: 0, rotate: -180 }}
//                   animate={{ scale: 1, rotate: 0 }}
//                   transition={{ type: "spring", damping: 10, stiffness: 100 }}
//                   className="bg-green-500 rounded-full p-2"
//                 >
//                   <Check className="text-white" size={24} />
//                 </motion.div>
//                 {particles.map((_, index) => (
//                   <motion.div
//                     key={index}
//                     className="absolute w-1 h-1 bg-yellow-300 rounded-full"
//                     initial={{ x: 0, y: 0, opacity: 1 }}
//                     animate={{
//                       x: Math.random() * 100 - 50,
//                       y: Math.random() * 100 - 50,
//                       opacity: 0,
//                       scale: Math.random() * 3 + 1,
//                     }}
//                     transition={{ duration: 1, delay: index * 0.02 }}
//                   />
//                 ))}
//               </motion.div>
//             ) : (
//               <motion.div
//                 key="button-content"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="flex items-center justify-center"
//               >
//                 <Loader state={isPending}>
//                   {isAtLimit ? <Lock size={20} /> : <Zap />}
//                   <span className="lg:inline hidden">
//                     {isAtLimit ? "Limit Reached" : "Create Automation"}
//                   </span>
//                 </Loader>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </Button>
//       </motion.div>

//       {/* Usage Info Below Button */}
//       <motion.div
//         initial={{ opacity: 0, y: -10 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="mt-3 flex items-center justify-between gap-3"
//       >
//         <div className="flex-1">
//           {/* Progress Bar */}
//           <div className="relative h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
//             <motion.div
//               initial={{ width: 0 }}
//               animate={{ 
//                 width: `${(currentAutomationCount / automationLimit) * 100}%` 
//               }}
//               transition={{ duration: 0.5, ease: "easeOut" }}
//               className={`h-full rounded-full ${
//                 isAtLimit
//                   ? "bg-red-500"
//                   : isNearLimit
//                   ? "bg-yellow-500"
//                   : "bg-gradient-to-r from-[#3352CC] to-[#1C2D70]"
//               }`}
//             />
//           </div>
          
//           {/* Usage Text */}
//           <div className="flex items-center justify-between mt-1.5">
//             <span className={`text-xs font-medium ${
//               isAtLimit ? "text-red-600" : isNearLimit ? "text-yellow-600" : "text-gray-600 dark:text-gray-400"
//             }`}>
//               {currentAutomationCount} / {automationLimit} automations
//             </span>
//             {getPlanBadge()}
//           </div>
//         </div>
//       </motion.div>

//       {/* Upgrade Prompt - Shows when at or near limit on FREE plan */}
//       <AnimatePresence>
//         {(isAtLimit || isNearLimit) && currentPlan === "FREE" && (
//           <motion.div
//             initial={{ opacity: 0, y: -10, scale: 0.95 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: -10, scale: 0.95 }}
//             className={`mt-3 p-3 rounded-lg border ${
//               isAtLimit
//                 ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50"
//                 : "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900/50"
//             }`}
//           >
//             <div className="flex items-start gap-2">
//               <AlertCircle 
//                 size={16} 
//                 className={isAtLimit ? "text-red-600 dark:text-red-400 mt-0.5" : "text-yellow-600 dark:text-yellow-400 mt-0.5"} 
//               />
//               <div className="flex-1">
//                 <p className={`text-sm font-medium ${
//                   isAtLimit ? "text-red-900 dark:text-red-300" : "text-yellow-900 dark:text-yellow-300"
//                 }`}>
//                   {isAtLimit 
//                     ? "You've reached your automation limit" 
//                     : `Only ${remainingAutomations} automation${remainingAutomations === 1 ? '' : 's'} left!`}
//                 </p>
//                 <p className={`text-xs mt-1 ${
//                   isAtLimit ? "text-red-700 dark:text-red-400" : "text-yellow-700 dark:text-yellow-400"
//                 }`}>
//                   Upgrade to Pro for 50 automations and unlock advanced features.
//                 </p>
//                 <Button
//                   size="sm"
//                   className="mt-2 h-7 text-xs bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
//                   onClick={onUpgradeClick || (() => router.push("/dashboard/billing"))}
//                 >
//                   <Crown size={12} className="mr-1" />
//                   Upgrade Now
//                 </Button>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   )
// }

// export default CreateAutomation

// "use client"

// import { Button } from "@/components/ui/button"
// import { useMemo, useState } from "react"
// import Loader from "../loader"
// import { useCreateAutomation } from "@/hooks/use-automations"
// import { v4 } from "uuid"
// import { useRouter, usePathname } from "next/navigation"
// import { motion, AnimatePresence } from "framer-motion"
// import { Check, Zap, Lock, AlertCircle, Crown, Sparkles } from "lucide-react"
// import { useSubscription } from "@/contexts/subscription-context"

// // Configuration for plan limits
// const PLAN_LIMITS = {
//   FREE: 2,
//   PRO: 50,
//   ENTERPRISE: 999,
// }

// type CreateAutomationProps = {
//   currentAutomationCount?: number
//   onUpgradeClick?: () => void
// }

// const CreateAutomation = ({ currentAutomationCount = 0, onUpgradeClick }: CreateAutomationProps) => {
//   const mutationId = useMemo(() => v4(), [])
//   const router = useRouter()
//   const pathname = usePathname()
//   const [showSuccess, setShowSuccess] = useState(false)
//   const [showLimitWarning, setShowLimitWarning] = useState(false)

//   const { subscription, isLoading: subscriptionLoading } = useSubscription()
//   const { isPending, mutate } = useCreateAutomation(mutationId)

//   const currentPlan = subscription?.plan || "FREE"
//   const automationLimit = PLAN_LIMITS[currentPlan]
//   const remainingAutomations = Math.max(0, automationLimit - currentAutomationCount)
//   const isAtLimit = currentAutomationCount >= automationLimit
//   const isNearLimit = remainingAutomations <= 1 && remainingAutomations > 0

//   const handleCreateAutomation = () => {
//     // If at limit, show warning and trigger upgrade popup
//     if (isAtLimit) {
//       setShowLimitWarning(true)
//       setTimeout(() => setShowLimitWarning(false), 3000)

//       // Trigger the upgrade popup if callback provided
//       if (onUpgradeClick) {
//         onUpgradeClick()
//       }
//       return
//     }

//     const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
//     const slug = slugMatch ? slugMatch[1] : ""

//     mutate(
//       {
//         name: "Untitled",
//       },
//       {
//         onSuccess: (data: any) => {
//           console.log("[v0] Automation created successfully:", data)

//           const automationId = data?.res?.automations?.[0]?.id || data?.data?.id || data?.res?.id

//           if (automationId) {
//             setShowSuccess(true)

//             setTimeout(() => {
//               router.push(`/dashboard/${slug}/automations/${automationId}`)
//             }, 800)
//           } else {
//             console.error("[v0] No automation ID returned from server:", data)
//             setShowSuccess(false)
//           }
//         },
//         onError: (error: any) => {
//           console.error("[v0] Error creating automation:", error)
//         },
//       },
//     )
//   }

//   const particles = useMemo(() => Array.from({ length: 20 }), [])

//   const getPlanBadge = () => {
//     if (currentPlan === "FREE") {
//       return (
//         <div className="flex items-center gap-1 text-xs text-gray-400">
//           <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400"></span>
//           Free Plan
//         </div>
//       )
//     }
//     if (currentPlan === "PRO") {
//       return (
//         <div className="flex items-center gap-1 text-xs text-purple-400">
//           <Crown size={12} />
//           Pro Plan
//         </div>
//       )
//     }
//     return (
//       <div className="flex items-center gap-1 text-xs text-yellow-400">
//         <Sparkles size={12} />
//         Enterprise
//       </div>
//     )
//   }

//   return (
//     <div className="relative">
//       {/* Main Button Container */}
//       <motion.div
//         whileHover={{ scale: isAtLimit ? 1 : 1.05 }}
//         whileTap={{ scale: isAtLimit ? 1 : 0.95 }}
//         className="relative"
//       >
//         <Button
//           className={`lg:px-10 py-6 text-white rounded-full font-medium shadow-lg transition-all duration-300 ease-in-out relative overflow-hidden ${
//             isAtLimit
//               ? "bg-gradient-to-br from-gray-400 to-gray-600 cursor-not-allowed opacity-70"
//               : "bg-gradient-to-br from-[#3352CC] to-[#1C2D70] hover:opacity-80"
//           }`}
//           onClick={handleCreateAutomation}
//           disabled={isPending || showSuccess || isAtLimit || subscriptionLoading}
//         >
//           <AnimatePresence mode="wait">
//             {showLimitWarning ? (
//               <motion.div
//                 key="warning"
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.8 }}
//                 className="absolute inset-0 flex items-center justify-center bg-red-500"
//               >
//                 <Lock className="text-white mr-2" size={20} />
//                 <span className="font-semibold">Limit Reached!</span>
//               </motion.div>
//             ) : showSuccess ? (
//               <motion.div
//                 key="success"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="absolute inset-0 flex items-center justify-center"
//               >
//                 <motion.div
//                   initial={{ scale: 0, rotate: -180 }}
//                   animate={{ scale: 1, rotate: 0 }}
//                   transition={{ type: "spring", damping: 10, stiffness: 100 }}
//                   className="bg-green-500 rounded-full p-2"
//                 >
//                   <Check className="text-white" size={24} />
//                 </motion.div>
//                 {particles.map((_, index) => (
//                   <motion.div
//                     key={index}
//                     className="absolute w-1 h-1 bg-yellow-300 rounded-full"
//                     initial={{ x: 0, y: 0, opacity: 1 }}
//                     animate={{
//                       x: Math.random() * 100 - 50,
//                       y: Math.random() * 100 - 50,
//                       opacity: 0,
//                       scale: Math.random() * 3 + 1,
//                     }}
//                     transition={{ duration: 1, delay: index * 0.02 }}
//                   />
//                 ))}
//               </motion.div>
//             ) : (
//               <motion.div
//                 key="button-content"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="flex items-center justify-center"
//               >
//                 <Loader state={isPending}>
//                   {isAtLimit ? <Lock size={20} /> : <Zap />}
//                   <span className="lg:inline hidden">{isAtLimit ? "Limit Reached" : "Create Automation"}</span>
//                 </Loader>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </Button>
//       </motion.div>

//       {/* Usage Info Below Button */}
//       <motion.div
//         initial={{ opacity: 0, y: -10 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="mt-3 flex items-center justify-between gap-3"
//       >
//         <div className="flex-1">
//           {/* Progress Bar */}
//           <div className="relative h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
//             <motion.div
//               initial={{ width: 0 }}
//               animate={{
//                 width: `${(currentAutomationCount / automationLimit) * 100}%`,
//               }}
//               transition={{ duration: 0.5, ease: "easeOut" }}
//               className={`h-full rounded-full ${
//                 isAtLimit
//                   ? "bg-red-500"
//                   : isNearLimit
//                     ? "bg-yellow-500"
//                     : "bg-gradient-to-r from-[#3352CC] to-[#1C2D70]"
//               }`}
//             />
//           </div>

//           {/* Usage Text */}
//           <div className="flex items-center justify-between mt-1.5">
//             <span
//               className={`text-xs font-medium ${
//                 isAtLimit ? "text-red-600" : isNearLimit ? "text-yellow-600" : "text-gray-600 dark:text-gray-400"
//               }`}
//             >
//               {currentAutomationCount} / {automationLimit} automations
//             </span>
//             {getPlanBadge()}
//           </div>
//         </div>
//       </motion.div>

//       {/* Upgrade Prompt - Shows when at or near limit on FREE plan */}
//       <AnimatePresence>
//         {(isAtLimit || isNearLimit) && currentPlan === "FREE" && (
//           <motion.div
//             initial={{ opacity: 0, y: -10, scale: 0.95 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: -10, scale: 0.95 }}
//             className={`mt-3 p-3 rounded-lg border ${
//               isAtLimit
//                 ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50"
//                 : "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900/50"
//             }`}
//           >
//             <div className="flex items-start gap-2">
//               <AlertCircle
//                 size={16}
//                 className={
//                   isAtLimit ? "text-red-600 dark:text-red-400 mt-0.5" : "text-yellow-600 dark:text-yellow-400 mt-0.5"
//                 }
//               />
//               <div className="flex-1">
//                 <p
//                   className={`text-sm font-medium ${
//                     isAtLimit ? "text-red-900 dark:text-red-300" : "text-yellow-900 dark:text-yellow-300"
//                   }`}
//                 >
//                   {isAtLimit
//                     ? "You've reached your automation limit"
//                     : `Only ${remainingAutomations} automation${remainingAutomations === 1 ? "" : "s"} left!`}
//                 </p>
//                 <p
//                   className={`text-xs mt-1 ${
//                     isAtLimit ? "text-red-700 dark:text-red-400" : "text-yellow-700 dark:text-yellow-400"
//                   }`}
//                 >
//                   Upgrade to Pro for 50 automations and unlock advanced features.
//                 </p>
//                 <Button
//                   size="sm"
//                   className="mt-2 h-7 text-xs bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
//                   onClick={onUpgradeClick || (() => router.push("/dashboard/billing"))}
//                 >
//                   <Crown size={12} className="mr-1" />
//                   Upgrade Now
//                 </Button>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   )
// }

// export default CreateAutomation


// "use client"

// import { Button } from "@/components/ui/button"
// import { useMemo, useState } from "react"
// import Loader from "../loader"
// import { useCreateAutomation } from "@/hooks/use-automations"
// import { v4 } from "uuid"
// import { usePathname } from "next/navigation"
// import { motion, AnimatePresence } from "framer-motion"
// import { Check, Zap, Lock, AlertCircle, Crown, Sparkles } from "lucide-react"
// import { useSubscription } from "@/contexts/subscription-context"

// // Configuration for plan limits
// const PLAN_LIMITS = {
//   FREE: 2,
//   PRO: 50,
//   ENTERPRISE: 999,
// }

// type CreateAutomationProps = {
//   currentAutomationCount?: number
//   onUpgradeClick?: () => void
//   onAutomationCreated?: (automation: any) => void
//   onCreating?: () => void
// }

// const CreateAutomation = ({
//   currentAutomationCount = 0,
//   onUpgradeClick,
//   onAutomationCreated,
//   onCreating,
// }: CreateAutomationProps) => {
//   const mutationId = useMemo(() => v4(), [])
//   const pathname = usePathname()
//   const [showSuccess, setShowSuccess] = useState(false)
//   const [showLimitWarning, setShowLimitWarning] = useState(false)

//   const { subscription, isLoading: subscriptionLoading } = useSubscription()
//   const { isPending, mutate } = useCreateAutomation(mutationId)

//   const currentPlan = subscription?.plan || "FREE"
//   const automationLimit = PLAN_LIMITS[currentPlan]
//   const remainingAutomations = Math.max(0, automationLimit - currentAutomationCount)
//   const isAtLimit = currentAutomationCount >= automationLimit
//   const isNearLimit = remainingAutomations <= 1 && remainingAutomations > 0

//   const handleCreateAutomation = () => {
//     // If at limit, show warning and trigger upgrade popup
//     if (isAtLimit) {
//       setShowLimitWarning(true)
//       setTimeout(() => setShowLimitWarning(false), 3000)

//       // Trigger the upgrade popup if callback provided
//       if (onUpgradeClick) {
//         onUpgradeClick()
//       }
//       return
//     }

//     if (onCreating) {
//       onCreating()
//     }

//     mutate(
//       {
//         name: "Untitled",
//       },
//       {
//         onSuccess: (data: any) => {
//           console.log("[v0] Automation created successfully, storing flag and showing success animation")
//           sessionStorage.setItem("automationJustCreated", "true")
//           setShowSuccess(true)

//           setTimeout(() => {
//             setShowSuccess(false)
//             console.log("[v0] Storing loading flag and reloading page")
//             sessionStorage.setItem("showCreationLoading", "true")
//             window.location.reload()
//           }, 800)
//         },
//         onError: (error: any) => {
//           console.error("[v0] Error creating automation:", error)
//         },
//       },
//     )
//   }

//   const particles = useMemo(() => Array.from({ length: 20 }), [])

//   const getPlanBadge = () => {
//     if (currentPlan === "FREE") {
//       return (
//         <div className="flex items-center gap-1 text-xs text-gray-400">
//           <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400"></span>
//           Free Plan
//         </div>
//       )
//     }
//     if (currentPlan === "PRO") {
//       return (
//         <div className="flex items-center gap-1 text-xs text-purple-400">
//           <Crown size={12} />
//           Pro Plan
//         </div>
//       )
//     }
//     return (
//       <div className="flex items-center gap-1 text-xs text-yellow-400">
//         <Sparkles size={12} />
//         Enterprise
//       </div>
//     )
//   }

//   return (
//     <div className="relative">
//       {/* Main Button Container */}
//       <motion.div
//         whileHover={{ scale: isAtLimit ? 1 : 1.05 }}
//         whileTap={{ scale: isAtLimit ? 1 : 0.95 }}
//         className="relative"
//       >
//         <Button
//           className={`lg:px-10 py-6 text-white rounded-full font-medium shadow-lg transition-all duration-300 ease-in-out relative overflow-hidden ${
//             isAtLimit
//               ? "bg-gradient-to-br from-gray-400 to-gray-600 cursor-not-allowed opacity-70"
//               : "bg-gradient-to-br from-[#3352CC] to-[#1C2D70] hover:opacity-80"
//           }`}
//           onClick={handleCreateAutomation}
//           disabled={isPending || showSuccess || isAtLimit || subscriptionLoading}
//         >
//           <AnimatePresence mode="wait">
//             {showLimitWarning ? (
//               <motion.div
//                 key="warning"
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.8 }}
//                 className="absolute inset-0 flex items-center justify-center bg-red-500"
//               >
//                 <Lock className="text-white mr-2" size={20} />
//                 <span className="font-semibold">Limit Reached!</span>
//               </motion.div>
//             ) : showSuccess ? (
//               <motion.div
//                 key="success"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="absolute inset-0 flex items-center justify-center"
//               >
//                 <motion.div
//                   initial={{ scale: 0, rotate: -180 }}
//                   animate={{ scale: 1, rotate: 0 }}
//                   transition={{ type: "spring", damping: 10, stiffness: 100 }}
//                   className="bg-green-500 rounded-full p-2"
//                 >
//                   <Check className="text-white" size={24} />
//                 </motion.div>
//                 {particles.map((_, index) => (
//                   <motion.div
//                     key={index}
//                     className="absolute w-1 h-1 bg-yellow-300 rounded-full"
//                     initial={{ x: 0, y: 0, opacity: 1 }}
//                     animate={{
//                       x: Math.random() * 100 - 50,
//                       y: Math.random() * 100 - 50,
//                       opacity: 0,
//                       scale: Math.random() * 3 + 1,
//                     }}
//                     transition={{ duration: 1, delay: index * 0.02 }}
//                   />
//                 ))}
//               </motion.div>
//             ) : (
//               <motion.div
//                 key="button-content"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="flex items-center justify-center"
//               >
//                 <Loader state={isPending}>
//                   {isAtLimit ? <Lock size={20} /> : <Zap />}
//                   <span className="lg:inline hidden">{isAtLimit ? "Limit Reached" : "Create Automation"}</span>
//                 </Loader>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </Button>
//       </motion.div>

//       {/* Usage Info Below Button */}
//       <motion.div
//         initial={{ opacity: 0, y: -10 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="mt-3 flex items-center justify-between gap-3"
//       >
//         <div className="flex-1">
//           {/* Progress Bar */}
//           <div className="relative h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
//             <motion.div
//               initial={{ width: 0 }}
//               animate={{
//                 width: `${(currentAutomationCount / automationLimit) * 100}%`,
//               }}
//               transition={{ duration: 0.5, ease: "easeOut" }}
//               className={`h-full rounded-full ${
//                 isAtLimit
//                   ? "bg-red-500"
//                   : isNearLimit
//                     ? "bg-yellow-500"
//                     : "bg-gradient-to-r from-[#3352CC] to-[#1C2D70]"
//               }`}
//             />
//           </div>

//           {/* Usage Text */}
//           <div className="flex items-center justify-between mt-1.5">
//             <span
//               className={`text-xs font-medium ${
//                 isAtLimit ? "text-red-600" : isNearLimit ? "text-yellow-600" : "text-gray-600 dark:text-gray-400"
//               }`}
//             >
//               {currentAutomationCount} / {automationLimit} automations
//             </span>
//             {getPlanBadge()}
//           </div>
//         </div>
//       </motion.div>

//       {/* Upgrade Prompt - Shows when at or near limit on FREE plan */}
//       <AnimatePresence>
//         {(isAtLimit || isNearLimit) && currentPlan === "FREE" && (
//           <motion.div
//             initial={{ opacity: 0, y: -10, scale: 0.95 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: -10, scale: 0.95 }}
//             className={`mt-3 p-3 rounded-lg border ${
//               isAtLimit
//                 ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50"
//                 : "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900/50"
//             }`}
//           >
//             <div className="flex items-start gap-2">
//               <AlertCircle
//                 size={16}
//                 className={
//                   isAtLimit ? "text-red-600 dark:text-red-400 mt-0.5" : "text-yellow-600 dark:text-yellow-400 mt-0.5"
//                 }
//               />
//               <div className="flex-1">
//                 <p
//                   className={`text-sm font-medium ${
//                     isAtLimit ? "text-red-900 dark:text-red-300" : "text-yellow-900 dark:text-yellow-300"
//                   }`}
//                 >
//                   {isAtLimit
//                     ? "You've reached your automation limit"
//                     : `Only ${remainingAutomations} automation${remainingAutomations === 1 ? "" : "s"} left!`}
//                 </p>
//                 <p
//                   className={`text-xs mt-1 ${
//                     isAtLimit ? "text-red-700 dark:text-red-400" : "text-yellow-700 dark:text-yellow-400"
//                   }`}
//                 >
//                   Upgrade to Pro for 50 automations and unlock advanced features.
//                 </p>
//                 <Button
//                   size="sm"
//                   className="mt-2 h-7 text-xs bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
//                   onClick={onUpgradeClick || (() => (window.location.href = "/dashboard/billing"))}
//                 >
//                   <Crown size={12} className="mr-1" />
//                   Upgrade Now
//                 </Button>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   )
// }

// export default CreateAutomation

"use client"

import { Button } from "@/components/ui/button"
import { useMemo, useState } from "react"
import Loader from "../loader"
import { useCreateAutomation } from "@/hooks/use-automations"
import { v4 } from "uuid"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Zap, Lock, AlertCircle, Crown, Sparkles } from "lucide-react"
import { useSubscription } from "@/contexts/subscription-context"

// Configuration for plan limits
const PLAN_LIMITS = {
  FREE: 2,
  PRO: 50,
  ENTERPRISE: 999,
}

type CreateAutomationProps = {
  currentAutomationCount?: number
  onUpgradeClick?: () => void
  onAutomationCreated?: (automation: any) => void
  onCreating?: () => void
}

const CreateAutomation = ({
  currentAutomationCount = 0,
  onUpgradeClick,
  onAutomationCreated,
  onCreating,
}: CreateAutomationProps) => {
  const mutationId = useMemo(() => v4(), [])
  const pathname = usePathname()
  const [showSuccess, setShowSuccess] = useState(false)
  const [showLimitWarning, setShowLimitWarning] = useState(false)

  const { subscription, isLoading: subscriptionLoading } = useSubscription()
  const { isPending, mutate } = useCreateAutomation(mutationId)

  const currentPlan = subscription?.plan || "FREE"
  const automationLimit = PLAN_LIMITS[currentPlan]
  const remainingAutomations = Math.max(0, automationLimit - currentAutomationCount)
  const isAtLimit = currentAutomationCount >= automationLimit
  const isNearLimit = remainingAutomations <= 1 && remainingAutomations > 0

  const handleCreateAutomation = () => {
    // If at limit, show warning and trigger upgrade popup
    if (isAtLimit) {
      setShowLimitWarning(true)
      setTimeout(() => setShowLimitWarning(false), 3000)

      // Trigger the upgrade popup if callback provided
      if (onUpgradeClick) {
        onUpgradeClick()
      }
      return
    }

    if (onCreating) {
      onCreating()
    }

    mutate(
      {
        name: "Untitled",
      },
      {
        onSuccess: (data: any) => {
          console.log("[v0] Automation created successfully")

          setShowSuccess(true)
          setTimeout(() => {
            setShowSuccess(false)
            // Store flag to show popup after reload
            sessionStorage.setItem("automationJustCreated", "true")
            // Reload to get fresh data
            window.location.reload()
          }, 200)
        },
        onError: (error: any) => {
          console.error("Error creating automation:", error)
        },
      },
    )
  }

  const particles = useMemo(() => Array.from({ length: 20 }), [])

  const getPlanBadge = () => {
    if (currentPlan === "FREE") {
      return (
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400"></span>
          Free Plan
        </div>
      )
    }
    if (currentPlan === "PRO") {
      return (
        <div className="flex items-center gap-1 text-xs text-purple-400">
          <Crown size={12} />
          Pro Plan
        </div>
      )
    }
    return (
      <div className="flex items-center gap-1 text-xs text-yellow-400">
        <Sparkles size={12} />
        Enterprise
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Main Button Container */}
      <motion.div
        whileHover={{ scale: isAtLimit ? 1 : 1.05 }}
        whileTap={{ scale: isAtLimit ? 1 : 0.95 }}
        className="relative"
      >
        <Button
          className={`lg:px-10 py-6 text-white rounded-full font-medium shadow-lg transition-all duration-300 ease-in-out relative overflow-hidden ${
            isAtLimit
              ? "bg-gradient-to-br from-gray-400 to-gray-600 cursor-not-allowed opacity-70"
              : "bg-gradient-to-br from-[#3352CC] to-[#1C2D70] hover:opacity-80"
          }`}
          onClick={handleCreateAutomation}
          disabled={isPending || showSuccess || isAtLimit || subscriptionLoading}
        >
          <AnimatePresence mode="wait">
            {showLimitWarning ? (
              <motion.div
                key="warning"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 flex items-center justify-center bg-red-500"
              >
                <Lock className="text-white mr-2" size={20} />
                <span className="font-semibold">Limit Reached!</span>
              </motion.div>
            ) : showSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 10, stiffness: 100 }}
                  className="bg-green-500 rounded-full p-2"
                >
                  <Check className="text-white" size={24} />
                </motion.div>
                {particles.map((_, index) => (
                  <motion.div
                    key={index}
                    className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                    initial={{ x: 0, y: 0, opacity: 1 }}
                    animate={{
                      x: Math.random() * 100 - 50,
                      y: Math.random() * 100 - 50,
                      opacity: 0,
                      scale: Math.random() * 3 + 1,
                    }}
                    transition={{ duration: 1, delay: index * 0.02 }}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="button-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center"
              >
                <Loader state={isPending}>
                  {isAtLimit ? <Lock size={20} /> : <Zap />}
                  <span className="lg:inline hidden">{isAtLimit ? "Limit Reached" : "Create Automation"}</span>
                </Loader>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Usage Info Below Button */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 flex items-center justify-between gap-3"
      >
        <div className="flex-1">
          {/* Progress Bar */}
          <div className="relative h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${(currentAutomationCount / automationLimit) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`h-full rounded-full ${
                isAtLimit
                  ? "bg-red-500"
                  : isNearLimit
                    ? "bg-yellow-500"
                    : "bg-gradient-to-r from-[#3352CC] to-[#1C2D70]"
              }`}
            />
          </div>

          {/* Usage Text */}
          <div className="flex items-center justify-between mt-1.5">
            <span
              className={`text-xs font-medium ${
                isAtLimit ? "text-red-600" : isNearLimit ? "text-yellow-600" : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {currentAutomationCount} / {automationLimit} automations
            </span>
            {getPlanBadge()}
          </div>
        </div>
      </motion.div>

      {/* Upgrade Prompt - Shows when at or near limit on FREE plan */}
      <AnimatePresence>
        {(isAtLimit || isNearLimit) && currentPlan === "FREE" && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`mt-3 p-3 rounded-lg border ${
              isAtLimit
                ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50"
                : "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900/50"
            }`}
          >
            <div className="flex items-start gap-2">
              <AlertCircle
                size={16}
                className={
                  isAtLimit ? "text-red-600 dark:text-red-400 mt-0.5" : "text-yellow-600 dark:text-yellow-400 mt-0.5"
                }
              />
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    isAtLimit ? "text-red-900 dark:text-red-300" : "text-yellow-900 dark:text-yellow-300"
                  }`}
                >
                  {isAtLimit
                    ? "You've reached your automation limit"
                    : `Only ${remainingAutomations} automation${remainingAutomations === 1 ? "" : "s"} left!`}
                </p>
                <p
                  className={`text-xs mt-1 ${
                    isAtLimit ? "text-red-700 dark:text-red-400" : "text-yellow-700 dark:text-yellow-400"
                  }`}
                >
                  Upgrade to Pro for 50 automations and unlock advanced features.
                </p>
                <Button
                  size="sm"
                  className="mt-2 h-7 text-xs bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  onClick={onUpgradeClick || (() => (window.location.href = "/dashboard/billing"))}
                >
                  <Crown size={12} className="mr-1" />
                  Upgrade Now
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CreateAutomation




// "use client"

// import { Button } from "@/components/ui/button"
// import { useMemo, useState } from "react"
// import Loader from "../loader"
// import { useCreateAutomation } from "@/hooks/use-automations"
// import { v4 } from "uuid"
// import { useRouter, usePathname } from "next/navigation"
// import { motion, AnimatePresence } from "framer-motion"
// import { Check, Zap } from "lucide-react"

// const CreateAutomation = () => {
//   const mutationId = useMemo(() => v4(), [])
//   const router = useRouter()
//   const pathname = usePathname()
//   const [showSuccess, setShowSuccess] = useState(false)

//   const { isPending, mutate } = useCreateAutomation(mutationId)

//   const handleCreateAutomation = () => {
//     const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
//     const slug = slugMatch ? slugMatch[1] : ""
    
//     // Debug: Log the current pathname and extracted slug
//     console.log("Current pathname:", pathname)
//     console.log("Extracted slug:", slug)

//     // Create a unique ID for this automation
//     const newAutomationId = `temp-${Date.now()}`

//     mutate(
//       {
//         name: "Untitled",
//         id: newAutomationId,
//         createdAt: new Date().toISOString(),
//         keywords: [],
//         active: false,
//         listener: null,
//       },
//       {
//         onSuccess: (data: any) => {
//           // Debug: Log the response data structure
//           console.log("Success! Response data:", data)
//           console.log("Looking for ID at data?.data?.id:", data?.data?.id)
//           console.log("Alternative: data?.id:", data?.id)
          
//           // Show success animation
//           setShowSuccess(true)
//           setTimeout(() => {
//             setShowSuccess(false)
//           }, 2000)

//           // Try multiple possible data structures for the ID
//           const automationId = data?.data?.id || data?.id || data?.automationId
          
//           if (automationId && slug) {
//             const redirectUrl = `/dashboard/${slug}/automations/${automationId}`
//             console.log("Redirecting to:", redirectUrl)
            
//             setTimeout(() => {
//               router.push(redirectUrl)
//             }, 1000)
//           } else {
//             console.warn("Cannot redirect - missing data:", {
//               automationId,
//               slug,
//               fullData: data
//             })
//           }
//         },
//         // onError: (error) => {
//         //   console.error("Failed to create automation:", error)
//         //   // Re-enable this to see if mutations are failing
//         // },
//       },
//     )
//   }

//   const particles = useMemo(() => Array.from({ length: 20 }), [])

//   return (
//     <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//       <Button
//         className="lg:px-10 py-6 bg-gradient-to-br hover:opacity-80 text-white rounded-full from-[#3352CC] font-medium to-[#1C2D70] shadow-lg transition-all duration-300 ease-in-out relative overflow-hidden"
//         onClick={handleCreateAutomation}
//         disabled={isPending || showSuccess}
//       >
//         <AnimatePresence mode="wait">
//           {showSuccess ? (
//             <motion.div
//               key="success"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="absolute inset-0 flex items-center justify-center"
//             >
//               <motion.div
//                 initial={{ scale: 0, rotate: -180 }}
//                 animate={{ scale: 1, rotate: 0 }}
//                 transition={{ type: "spring", damping: 10, stiffness: 100 }}
//                 className="bg-green-500 rounded-full p-2"
//               >
//                 <Check className="text-white" size={24} />
//               </motion.div>
//               {particles.map((_, index) => (
//                 <motion.div
//                   key={index}
//                   className="absolute w-1 h-1 bg-yellow-300 rounded-full"
//                   initial={{
//                     x: 0,
//                     y: 0,
//                     opacity: 1,
//                   }}
//                   animate={{
//                     x: Math.random() * 100 - 50,
//                     y: Math.random() * 100 - 50,
//                     opacity: 0,
//                     scale: Math.random() * 3 + 1,
//                   }}
//                   transition={{ duration: 1, delay: index * 0.02 }}
//                 />
//               ))}
//             </motion.div>
//           ) : (
//             <motion.div
//               key="button-content"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="flex items-center justify-center"
//             >
//               <Loader state={isPending}>
//                 <Zap />
//                 <span className="lg:inline hidden">Create Automation</span>
//               </Loader>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </Button>
//     </motion.div>
//   )
// }

// export default CreateAutomation

// "use client"

// import { Button } from "@/components/ui/button"
// import { useState } from "react"
// import Loader from "../loader"
// import { useCreateAutomation } from "@/hooks/use-automations"
// import { useRouter, usePathname } from "next/navigation"
// import { motion, AnimatePresence } from "framer-motion"
// import { Check, Zap } from "lucide-react"

// const CreateAutomation = () => {
//   const router = useRouter()
//   const pathname = usePathname()
//   const [showSuccess, setShowSuccess] = useState(false)

//   // Use the hook without passing any mutation ID - let it handle its own state
//   const { isPending, mutate } = useCreateAutomation()

//   const handleCreateAutomation = () => {
//     const slugMatch = pathname.match(/^\/dashboard\/([^/]+)/)
//     const slug = slugMatch ? slugMatch[1] : ""

//     // Just call mutate without any data - let the backend handle defaults
//     mutate(undefined, {
//       onSuccess: (data: { res: { id: any } }) => {
//         // Show success animation
//         setShowSuccess(true)
        
//         // Get the automation ID from response
//         const automationId = data?.res?.id
        
//         if (automationId && slug) {
//           // Short success animation, then redirect
//           setTimeout(() => {
//             router.push(`/dashboard/${slug}/automations/${automationId}`)
//           }, 1500) // Reduced time for better UX
//         }
        
//         // Hide success animation after redirect
//         setTimeout(() => {
//           setShowSuccess(false)
//         }, 2000)
//       },
//       onError: (error: any) => {
//         console.error("Failed to create automation:", error)
//         setShowSuccess(false)
//       },
//     })
//   }

//   return (
//     <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//       <Button
//         className="lg:px-10 py-6 bg-gradient-to-br hover:opacity-80 text-white rounded-full from-[#3352CC] font-medium to-[#1C2D70] shadow-lg transition-all duration-300 ease-in-out relative overflow-hidden"
//         onClick={handleCreateAutomation}
//         disabled={isPending || showSuccess}
//       >
//         <AnimatePresence mode="wait">
//           {showSuccess ? (
//             <motion.div
//               key="success"
//               initial={{ opacity: 0, scale: 0 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0 }}
//               className="flex items-center justify-center"
//             >
//               <motion.div
//                 initial={{ scale: 0, rotate: -180 }}
//                 animate={{ scale: 1, rotate: 0 }}
//                 transition={{ type: "spring", damping: 10, stiffness: 100 }}
//                 className="bg-green-500 rounded-full p-2"
//               >
//                 <Check className="text-white" size={24} />
//               </motion.div>
//             </motion.div>
//           ) : (
//             <motion.div
//               key="button-content"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="flex items-center justify-center"
//             >
//               <Loader state={isPending}>
//                 <Zap />
//                 <span className="lg:inline hidden">Create Automation</span>
//               </Loader>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </Button>
//     </motion.div>
//   )
// }

// export default CreateAutomation