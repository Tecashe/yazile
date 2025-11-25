// "use client"

// import type React from "react"
// import { useState } from "react"
// import { AnimatePresence, motion } from "framer-motion"
// import { X } from "lucide-react"

// type FloatingPanelProps = {
//   trigger: React.ReactNode
//   children: React.ReactNode
//   title?: string
//   className?: string
// }

// const FloatingPanel = ({ trigger, children, title, className = "" }: FloatingPanelProps) => {
//   const [isOpen, setIsOpen] = useState(false)

//   return (
//     <>
//       <div onClick={() => setIsOpen(true)} className="cursor-pointer hoverScale">
//         {trigger}
//       </div>

//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6 floatingPanelBackdrop"
//             onClick={() => setIsOpen(false)}
//           >
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.9, y: 20 }}
//               transition={{
//                 type: "spring",
//                 damping: 25,
//                 stiffness: 300,
//               }}
//               className={`w-[100vw] max-w-[850px] bg-background-90 rounded-xl overflow-hidden shadow-2xl floatingPanelContent ${className}`}
//               onClick={(e) => e.stopPropagation()}
//             >
//               {/* Fancy gradient header */}
//               <div className="relative h-2 bg-gradient-to-r from-light-blue via-keyword-purple to-keyword-red" />

//               <div className="p-4 md:p-5">
//                 {title && (
//                   <div className="flex items-center justify-between mb-4">
//                     <h2 className="text-xl font-bold">{title}</h2>
//                     <button
//                       onClick={() => setIsOpen(false)}
//                       className="p-1 rounded-full hover:bg-background-80 transition-colors"
//                     >
//                       <X className="w-5 h-5" />
//                     </button>
//                   </div>
//                 )}

//                 <div className="max-h-[70vh] overflow-y-auto">{children}</div>
//               </div>

//               {/* Fancy bottom bar with glow */}
//               <div className="relative h-1 bg-background-80">
//                 <div className="absolute inset-0 bg-light-blue opacity-30 blur-sm" />
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   )
// }

// export default FloatingPanel



"use client"

import type React from "react"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"

type FloatingPanelProps = {
  trigger: React.ReactNode
  children: React.ReactNode
  title?: string
  className?: string
}

const FloatingPanel = ({ trigger, children, title, className = "" }: FloatingPanelProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer hoverScale">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6 floatingPanelBackdrop"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
              }}
              className={`w-full max-w-[1100px] bg-background-90 rounded-xl overflow-hidden shadow-2xl floatingPanelContent ${className}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Fancy gradient header */}
              <div className="relative h-2 bg-gradient-to-r from-light-blue via-keyword-purple to-keyword-red" />

              <div className="p-4 md:p-5">
                {title && (
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1 rounded-full hover:bg-background-80 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}

                <div className="max-h-[78vh] overflow-y-auto">{children}</div>
              </div>

              {/* Fancy bottom bar with glow */}
              <div className="relative h-1 bg-background-80">
                <div className="absolute inset-0 bg-light-blue opacity-30 blur-sm" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default FloatingPanel






// "use client"

// import type React from "react"
// import { useState, useRef, useEffect } from "react"
// import { AnimatePresence, motion } from "framer-motion"
// import { useOnClickOutside } from "@/hooks/use-on-click-outside"
// import { X } from "lucide-react"

// type Props = {
//   title?: string
//   trigger: React.ReactNode
//   children: React.ReactNode
//   className?: string
//   open?: boolean
//   onOpenChange?: (open: boolean) => void
// }

// const FloatingPanel = ({ title, trigger, children, className, open, onOpenChange }: Props) => {
//   const [internalIsOpen, setInternalIsOpen] = useState(false)

//   const isControlled = open !== undefined
//   const isOpen = isControlled ? open : internalIsOpen

//   const handleOpenChange = (newOpen: boolean) => {
//     if (isControlled) {
//       onOpenChange?.(newOpen)
//     } else {
//       setInternalIsOpen(newOpen)
//     }
//   }

//   const panelRef = useRef<HTMLDivElement>(null)
//   const [isMobile, setIsMobile] = useState(false)

//   useOnClickOutside(panelRef, () => handleOpenChange(false))

//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth < 768)
//     checkMobile()
//     window.addEventListener("resize", checkMobile)
//     return () => window.removeEventListener("resize", checkMobile)
//   }, [])

//   // Prevent body scroll when panel is open
//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = "hidden"
//     } else {
//       document.body.style.overflow = ""
//     }
//     return () => {
//       document.body.style.overflow = ""
//     }
//   }, [isOpen])

//   return (
//     <>
//       <div onClick={() => handleOpenChange(true)} className="cursor-pointer hoverScale">
//         {trigger}
//       </div>

//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6 lg:p-8 floatingPanelBackdrop"
//             onClick={() => handleOpenChange(false)}
//           >
//             <motion.div
//               ref={panelRef}
//               initial={{ opacity: 0, scale: 0.9, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.9, y: 20 }}
//               transition={{
//                 type: "spring",
//                 damping: 25,
//                 stiffness: 300,
//               }}
//               className={`w-[95vw] md:w-[90vw] lg:w-[85vw] max-w-[1400px] bg-background-90 rounded-xl overflow-hidden shadow-2xl floatingPanelContent ${className}`}
//               onClick={(e) => e.stopPropagation()}
//             >
//               {/* Fancy gradient header */}
//               <div className="relative h-2 bg-gradient-to-r from-light-blue via-keyword-purple to-keyword-red" />

//               <div className="p-6 md:p-8 lg:p-10">
//                 {title && (
//                   <div className="flex items-center justify-between mb-6">
//                     <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">{title}</h2>
//                     <button
//                       onClick={() => handleOpenChange(false)}
//                       className="p-2 rounded-full hover:bg-background-80 transition-colors"
//                     >
//                       <X className="w-6 h-6" />
//                     </button>
//                   </div>
//                 )}

//                 <div className="max-h-[85vh] overflow-y-auto">{children}</div>
//               </div>

//               {/* Fancy bottom bar with glow */}
//               <div className="relative h-1 bg-background-80">
//                 <div className="absolute inset-0 bg-light-blue opacity-30 blur-sm" />
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   )
// }

// export default FloatingPanel
