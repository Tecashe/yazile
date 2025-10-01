// import { useState, useEffect } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { Button } from "@/components/ui/button"
// import { X, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
// import { cn } from "@/lib/utils"

// type PesapalIframeModalProps = {
//   isOpen: boolean
//   paymentUrl: string
//   onClose: () => void
//   onSuccess: () => void
//   onCancel: () => void
// }

// const PesapalIframeModal = ({
//   isOpen,
//   paymentUrl,
//   onClose,
//   onSuccess,
//   onCancel,
// }: PesapalIframeModalProps) => {
//   const [isLoading, setIsLoading] = useState(true)
//   const [showWarning, setShowWarning] = useState(false)

//   useEffect(() => {
//     if (isOpen && paymentUrl) {
//       setIsLoading(true)
//       // Listen for messages from iframe (if Pesapal supports it)
//       const handleMessage = (event: MessageEvent) => {
//         // Handle payment completion messages
//         if (event.data.type === "PAYMENT_COMPLETE") {
//           onSuccess()
//         }
//       }
//       window.addEventListener("message", handleMessage)
//       return () => window.removeEventListener("message", handleMessage)
//     }
//   }, [isOpen, paymentUrl, onSuccess])

//   const handleClose = () => {
//     setShowWarning(true)
//   }

//   const confirmClose = () => {
//     setShowWarning(false)
//     onCancel()
//     onClose()
//   }

//   const cancelClose = () => {
//     setShowWarning(false)
//   }

//   const handleIframeLoad = () => {
//     setIsLoading(false)
//   }

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
//           onClick={handleClose}
//         >
//           <motion.div
//             initial={{ scale: 0.95, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.95, opacity: 0 }}
//             onClick={(e) => e.stopPropagation()}
//             className="relative bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] overflow-hidden flex flex-col"
//           >
//             {/* Header */}
//             <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
//                   <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <h2 className="text-lg font-semibold text-white">Complete Your Payment</h2>
//                   <p className="text-sm text-zinc-400">Secure payment powered by Pesapal</p>
//                 </div>
//               </div>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={handleClose}
//                 className="rounded-full h-10 w-10 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
//               >
//                 <X className="h-5 w-5" />
//               </Button>
//             </div>

//             {/* Loading State */}
//             {isLoading && (
//               <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/90 z-10">
//                 <div className="text-center space-y-4">
//                   <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto" />
//                   <div className="space-y-2">
//                     <p className="text-white font-medium">Loading payment page...</p>
//                     <p className="text-sm text-zinc-400">Please wait while we prepare your secure checkout</p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Iframe */}
//             <div className="flex-1 relative">
//               <iframe
//                 src={paymentUrl}
//                 className="absolute inset-0 w-full h-full border-0"
//                 title="Pesapal Payment"
//                 onLoad={handleIframeLoad}
//                 sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
//               />
//             </div>

//             {/* Footer */}
//             <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900/50">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2 text-xs text-zinc-500">
//                   <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
//                   </svg>
//                   <span>Secured by 256-bit SSL encryption</span>
//                 </div>
//                 <div className="text-xs text-zinc-500">
//                   Powered by <span className="text-white font-medium">Pesapal</span>
//                 </div>
//               </div>
//             </div>

//             {/* Warning Modal */}
//             <AnimatePresence>
//               {showWarning && (
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20"
//                   onClick={cancelClose}
//                 >
//                   <motion.div
//                     initial={{ scale: 0.9, opacity: 0 }}
//                     animate={{ scale: 1, opacity: 1 }}
//                     exit={{ scale: 0.9, opacity: 0 }}
//                     onClick={(e) => e.stopPropagation()}
//                     className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md mx-4 shadow-2xl"
//                   >
//                     <div className="flex items-start gap-4">
//                       <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
//                         <AlertCircle className="w-6 h-6 text-amber-500" />
//                       </div>
//                       <div className="flex-1 space-y-3">
//                         <h3 className="text-lg font-semibold text-white">Cancel Payment?</h3>
//                         <p className="text-sm text-zinc-400">
//                           Your payment is still in progress. If you close this now, your payment may not be completed and you&apos;ll need to start over.
//                         </p>
//                         <div className="flex gap-3 pt-2">
//                           <Button
//                             onClick={cancelClose}
//                             className="flex-1 bg-white text-black hover:bg-zinc-200 rounded-xl"
//                           >
//                             Continue Payment
//                           </Button>
//                           <Button
//                             onClick={confirmClose}
//                             variant="outline"
//                             className="flex-1 bg-transparent text-zinc-300 border-zinc-700 hover:bg-zinc-800 rounded-xl"
//                           >
//                             Cancel Anyway
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                   </motion.div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   )
// }

// export default PesapalIframeModal

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X, Loader2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type PesapalIframeModalProps = {
  isOpen: boolean
  paymentUrl: string
  onClose: () => void
  onSuccess: () => void
  onCancel: () => void
}

const PesapalIframeModal = ({
  isOpen,
  paymentUrl,
  onClose,
  onSuccess,
  onCancel,
}: PesapalIframeModalProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    if (isOpen && paymentUrl) {
      setIsLoading(true)
      
      // Set a timeout to hide loading state if iframe doesn't fire onLoad
      const loadingTimeout = setTimeout(() => {
        setIsLoading(false)
      }, 3000)

      // Listen for messages from iframe
      const handleMessage = (event: MessageEvent) => {
        // Pesapal might send payment completion messages
        if (event.data.type === "PAYMENT_COMPLETE" || event.data === "PAYMENT_COMPLETE") {
          onSuccess()
        }
      }
      
      window.addEventListener("message", handleMessage)
      
      return () => {
        window.removeEventListener("message", handleMessage)
        clearTimeout(loadingTimeout)
      }
    } else {
      setIsLoading(true)
    }
  }, [isOpen, paymentUrl, onSuccess])

  const handleClose = () => {
    setShowWarning(true)
  }

  const confirmClose = () => {
    setShowWarning(false)
    onCancel()
    onClose()
  }

  const cancelClose = () => {
    setShowWarning(false)
  }

  const handleIframeLoad = () => {
    // Clear loading state when iframe loads
    setIsLoading(false)
  }

  const handleIframeError = () => {
    // Clear loading state even on error
    setIsLoading(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Complete Your Payment</h2>
                  <p className="text-sm text-zinc-400">Secure payment powered by Pesapal</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="rounded-full h-10 w-10 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Loading State - Only show if isLoading is true */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-zinc-950/90 z-10"
                >
                  <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto" />
                    <div className="space-y-2">
                      <p className="text-white font-medium">Loading payment page...</p>
                      <p className="text-sm text-zinc-400">Please wait while we prepare your secure checkout</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Iframe */}
            <div className="flex-1 relative">
              {paymentUrl && (
                <iframe
                  src={paymentUrl}
                  className="absolute inset-0 w-full h-full border-0"
                  title="Pesapal Payment"
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation allow-popups-to-escape-sandbox"
                  allow="payment"
                />
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Secured by 256-bit SSL encryption</span>
                </div>
                <div className="text-xs text-zinc-500">
                  Powered by <span className="text-white font-medium">Pesapal</span>
                </div>
              </div>
            </div>

            {/* Warning Modal */}
            <AnimatePresence>
              {showWarning && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20"
                  onClick={cancelClose}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md mx-4 shadow-2xl"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-6 h-6 text-amber-500" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <h3 className="text-lg font-semibold text-white">Cancel Payment?</h3>
                        <p className="text-sm text-zinc-400">
                          Your payment is still in progress. If you close this now, your payment may not be completed and you&apos;ll need to start over.
                        </p>
                        <div className="flex gap-3 pt-2">
                          <Button
                            onClick={cancelClose}
                            className="flex-1 bg-white text-black hover:bg-zinc-200 rounded-xl"
                          >
                            Continue Payment
                          </Button>
                          <Button
                            onClick={confirmClose}
                            variant="outline"
                            className="flex-1 bg-transparent text-zinc-300 border-zinc-700 hover:bg-zinc-800 rounded-xl"
                          >
                            Cancel Anyway
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PesapalIframeModal