

// "use client"

// import React, { useState, useEffect } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { cn } from "@/lib/utils"

// const loadingMessages = [
//   "Powering up Yazzil...",
//   "Almost there...",
// ]

// const encouragingMessages = [
//   "Hang tight! Great things take time.",
// ]

// const troubleshootingMessages = [
//   "Taking longer than usual?",
//   "Check your internet connection.",
//   "Try refreshing the page.",
//   "Still stuck? Contact our support team.",
// ]

// interface ChatalMindBlowingLoaderProps {
//   state: boolean
//   className?: string
//   color?: string
// }

// export default function ChatalMindBlowingLoader({ state, className, color = "blue" }: ChatalMindBlowingLoaderProps) {
//   const [message, setMessage] = useState(loadingMessages[0])
//   const [messageType, setMessageType] = useState("loading")
//   const [loadTime, setLoadTime] = useState(0)
//   const [showText, setShowText] = useState(false)

//   useEffect(() => {
//     if (state) {
//       const spinDelay = 4000 // 4 seconds minimum spin
//       const textDelay = setTimeout(() => {
//         setShowText(true)
//       }, spinDelay)

//       return () => clearTimeout(textDelay)
//     } else {
//       setShowText(false)
//       setLoadTime(0)
//     }
//   }, [state])

//   useEffect(() => {
//     if (!showText || !state) return

//     const interval = setInterval(() => {
//       setLoadTime((prev) => prev + 1)
//     }, 4000)

//     return () => clearInterval(interval)
//   }, [showText, state])

//   useEffect(() => {
//     if (!showText || !state) return

//     if (loadTime < 50) {
//       setMessage(loadingMessages[loadTime % loadingMessages.length])
//       setMessageType("loading")
//     } else if (loadTime < 100) {
//       setMessage(encouragingMessages[(loadTime - 10) % encouragingMessages.length])
//       setMessageType("encouraging")
//     } else {
//       setMessage(troubleshootingMessages[(loadTime - 20) % troubleshootingMessages.length])
//       setMessageType("troubleshooting")
//     }
//   }, [loadTime, showText, state])

//   if (!state) {
//     return null
//   }

//   return (
//     <div className={cn("flex flex-col items-center justify-center w-full max-w-md px-4 py-8 md:py-12", className)}>
//       {/* Simple Orbital Spinner */}
//       <div className="relative w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64">
//         {/* Center dot */}
//         <div className={`absolute top-1/2 left-1/2 w-3 h-3 bg-${color}-500 rounded-full transform -translate-x-1/2 -translate-y-1/2`} />
        
//         {/* Orbiting dots */}
//         {[0, 1, 2].map((i) => (
//           <motion.div
//             key={i}
//             className="absolute inset-0"
//             animate={{ rotate: 360 }}
//             transition={{
//               duration: 2,
//               repeat: Infinity,
//               ease: "linear",
//               delay: i * 0.2
//             }}
//           >
//             <div 
//               className={`absolute w-2 h-2 bg-${color}-400 rounded-full`}
//               style={{
//                 top: '10%',
//                 left: '50%',
//                 transform: 'translateX(-50%)'
//               }}
//             />
//           </motion.div>
//         ))}
        
//         {/* Outer ring */}
//         <div className={`absolute inset-4 border border-${color}-300 rounded-full opacity-30`} />
//       </div>

//       <AnimatePresence>
//         {showText && (
//           <motion.div
//             className="mt-4 sm:mt-6 md:mt-8 text-center"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             transition={{ duration: 0.5 }}
//           >
//             <motion.h2
//               className={`text-xl sm:text-2xl font-bold text-${color}-600 mb-1 sm:mb-2`}
//               initial={{ y: -20 }}
//               animate={{ y: 0 }}
//               transition={{ type: "spring", stiffness: 300, damping: 10 }}
//             >
//               Yazzil
//             </motion.h2>
//             <motion.p
//               key={message}
//               className={`text-sm sm:text-base md:text-lg ${
//                 messageType === "loading"
//                   ? "text-gray-700"
//                   : messageType === "encouraging"
//                     ? `text-${color}-600`
//                     : "text-yellow-600"
//               }`}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ type: "spring", stiffness: 100, damping: 10 }}
//             >
//               {message}
//             </motion.p>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   )
// }

// "use client"

// import React from "react"
// import { motion } from "framer-motion"
// import { cn } from "@/lib/utils"

// interface YazzilWordLoaderProps {
//   state: boolean
//   className?: string
//   color?: string
// }

// export default function YazzilWordLoader({ 
//   state, 
//   className, 
//   color = "gray" 
// }: YazzilWordLoaderProps) {
//   if (!state) {
//     return null
//   }

//   const letters = ["Y", "A", "Z", "Z", "I", "L"]

//   return (
//     <div className={cn("flex items-center justify-center", className)}>
//       <div className="flex">
//         {letters.map((letter, index) => (
//           <motion.span
//             key={index}
//             className={`text-2xl font-bold text-${color}-700`}
//             animate={{
//               y: [0, -10, 0],
//               opacity: [0.5, 1, 0.5]
//             }}
//             transition={{
//               duration: 1.2,
//               repeat: Infinity,
//               delay: index * 0.1,
//               ease: "easeInOut"
//             }}
//           >
//             {letter}
//           </motion.span>
//         ))}
//       </div>
//     </div>
//   )
// }

"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface YazzilWordLoaderProps {
  state: boolean
  className?: string
  color?: string
}

export default function YazzilWordLoader({ 
  state, 
  className, 
  color = "gray" 
}: YazzilWordLoaderProps) {
  if (!state) {
    return null
  }

  const letters = ["Y", "A", "Z", "Z", "I", "L"]

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="flex">
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            className={`text-2xl font-bold text-${color}-700`}
            animate={{
              y: [0, -10, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: index * 0.1,
              ease: "easeInOut"
            }}
          >
            {letter}
          </motion.span>
        ))}
      </div>
    </div>
  )
}