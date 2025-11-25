// "use client"

// import type React from "react"
// import { useState, useRef, useEffect } from "react"
// import { AnimatePresence, motion } from "framer-motion"
// import { useOnClickOutside } from "@/hooks/use-on-click-outside"
// import { cn } from "@/lib/utils"
// import styles from "../automation-styles.module.css"

// type Props = {
//   trigger: React.ReactNode
//   children: React.ReactNode
//   className?: string
// }

// const PopOver = ({ trigger, children, className }: Props) => {
//   const [isOpen, setIsOpen] = useState(false)
//   const popoverRef = useRef<HTMLDivElement>(null)
//   const triggerRef = useRef<HTMLDivElement>(null)
//   const [position, setPosition] = useState({ top: 0, left: 0 })
//   const [placement, setPlacement] = useState<"top" | "bottom">("bottom")

//   useOnClickOutside(popoverRef, () => setIsOpen(false))

//   const calculatePosition = () => {
//     if (!triggerRef.current) return

//     const triggerRect = triggerRef.current.getBoundingClientRect()
//     const screenHeight = window.innerHeight
//     const screenWidth = window.innerWidth

//     // Determine if we should place the popover above or below the trigger
//     const spaceBelow = screenHeight - triggerRect.bottom
//     const spaceAbove = triggerRect.top
//     const popoverHeight = popoverRef.current?.offsetHeight || 400

//     let newPlacement: "top" | "bottom" = "bottom"
//     let top = 0

//     if (spaceBelow < popoverHeight && spaceAbove > popoverHeight) {
//       // Place above if there's not enough space below but enough above
//       newPlacement = "top"
//       top = triggerRect.top - popoverHeight - 10
//     } else {
//       // Default to below
//       newPlacement = "bottom"
//       top = triggerRect.bottom + 10
//     }

//     // Calculate horizontal position, centered on trigger
//     let left = triggerRect.left + triggerRect.width / 2 - (popoverRef.current?.offsetWidth || 400) / 2

//     // Ensure popover doesn't go off screen horizontally
//     const popoverWidth = popoverRef.current?.offsetWidth || 400
//     if (left < 20) left = 20
//     if (left + popoverWidth > screenWidth - 20) left = screenWidth - popoverWidth - 20

//     setPosition({ top, left })
//     setPlacement(newPlacement)
//   }

//   useEffect(() => {
//     if (isOpen) {
//       calculatePosition()
//       // Recalculate on resize
//       window.addEventListener("resize", calculatePosition)
//       // Recalculate after a short delay to ensure content is rendered
//       const timer = setTimeout(calculatePosition, 50)
//       return () => {
//         window.removeEventListener("resize", calculatePosition)
//         clearTimeout(timer)
//       }
//     }
//   }, [isOpen]) // Removed calculatePosition from dependencies

//   return (
//     <>
//       <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)} className={`cursor-pointer ${styles.hoverScale}`}>
//         {trigger}
//       </div>

//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             ref={popoverRef}
//             initial={{ opacity: 0, y: placement === "top" ? 10 : -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: placement === "top" ? 10 : -10 }}
//             transition={{ duration: 0.2 }}
//             style={{
//               position: "fixed",
//               top: `${position.top}px`,
//               left: `${position.left}px`,
//               zIndex: 50,
//               transformOrigin: placement === "top" ? "bottom center" : "top center",
//             }}
//             className={cn("shadow-2xl", styles.glassEffect, className)}
//           >
//             {children}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   )
// }

// export default PopOver

"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useOnClickOutside } from "@/hooks/use-on-click-outside"
import { cn } from "@/lib/utils"
import styles from "../automation-styles.module.css"

type Props = {
  trigger: React.ReactNode
  children: React.ReactNode
  className?: string
}

const PopOver = ({ trigger, children, className }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [placement, setPlacement] = useState<"top" | "bottom">("bottom")
  const [isMobile, setIsMobile] = useState(false)

  useOnClickOutside(popoverRef, () => setIsOpen(false))

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const calculatePosition = () => {
    if (!triggerRef.current || isMobile) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const screenHeight = window.innerHeight
    const screenWidth = window.innerWidth

    // Determine if we should place the popover above or below the trigger
    const spaceBelow = screenHeight - triggerRect.bottom
    const spaceAbove = triggerRect.top
    const popoverHeight = popoverRef.current?.offsetHeight || 600

    let newPlacement: "top" | "bottom" = "bottom"
    let top = 0

    if (spaceBelow < popoverHeight && spaceAbove > popoverHeight) {
      // Place above if there's not enough space below but enough above
      newPlacement = "top"
      top = triggerRect.top - popoverHeight - 16
    } else {
      // Default to below
      newPlacement = "bottom"
      top = triggerRect.bottom + 16
    }

    // Calculate horizontal position, centered on trigger
    const popoverWidth = popoverRef.current?.offsetWidth || 600
    let left = triggerRect.left + triggerRect.width / 2 - popoverWidth / 2

    if (left < 24) left = 24
    if (left + popoverWidth > screenWidth - 24) left = screenWidth - popoverWidth - 24

    setPosition({ top, left })
    setPlacement(newPlacement)
  }

  useEffect(() => {
    if (isOpen && !isMobile) {
      calculatePosition()
      window.addEventListener("resize", calculatePosition)
      const timer = setTimeout(calculatePosition, 50)
      return () => {
        window.removeEventListener("resize", calculatePosition)
        clearTimeout(timer)
      }
    }
  }, [isOpen, isMobile])

  return (
    <>
      <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)} className={`cursor-pointer ${styles.hoverScale}`}>
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                onClick={() => setIsOpen(false)}
              />
            )}

            <motion.div
              ref={popoverRef}
              initial={{ opacity: 0, y: placement === "top" ? 10 : -10, scale: isMobile ? 0.95 : 1 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: placement === "top" ? 10 : -10, scale: isMobile ? 0.95 : 1 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={
                isMobile
                  ? {
                      position: "fixed",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      zIndex: 50,
                      width: "calc(100vw - 32px)",
                      maxWidth: "600px",
                      maxHeight: "calc(100vh - 64px)",
                    }
                  : {
                      position: "fixed",
                      top: `${position.top}px`,
                      left: `${position.left}px`,
                      zIndex: 50,
                      minWidth: "500px",
                      maxWidth: "700px",
                      maxHeight: "calc(100vh - 100px)",
                      transformOrigin: placement === "top" ? "bottom center" : "top center",
                    }
              }
              className={cn("shadow-2xl rounded-2xl overflow-hidden", styles.glassEffect, className)}
            >
              <div className="overflow-y-auto max-h-[calc(100vh-100px)] p-6 sm:p-8">{children}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default PopOver
