// "use client"

// import { useState, useEffect, useCallback } from "react"
// import { ChevronLeft, ChevronRight } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import Image from "next/image"
// import { cn } from "@/lib/utils"
// import { motion, AnimatePresence } from "framer-motion"

// interface AutoCarouselProps {
//   images: string[]
//   interval?: number
//   className?: string
// }

// export function AutoCarousel({ images, interval = 3000, className }: AutoCarouselProps) {
//   const [currentIndex, setCurrentIndex] = useState(0)
//   const [isPaused, setIsPaused] = useState(false)

//   const next = useCallback(() => {
//     setCurrentIndex((current) => (current + 1) % images.length)
//   }, [images.length])

//   const previous = useCallback(() => {
//     setCurrentIndex((current) => (current - 1 + images.length) % images.length)
//   }, [images.length])

//   useEffect(() => {
//     if (isPaused || images.length <= 1) return

//     const timer = setInterval(next, interval)
//     return () => clearInterval(timer)
//   }, [next, interval, isPaused, images.length])

//   if (images.length === 0) return null

//   return (
//     <div
//       className={cn("relative aspect-square rounded-lg overflow-hidden", className)}
//       onMouseEnter={() => setIsPaused(true)}
//       onMouseLeave={() => setIsPaused(false)}
//     >
//       <AnimatePresence mode="wait">
//         <motion.div
//           key={currentIndex}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 0.3 }}
//           className="relative aspect-square"
//         >
//           <Image
//             src={images[currentIndex] || "/placeholder.svg"}
//             alt={`Slide ${currentIndex + 1}`}
//             fill
//             className="object-cover"
//             priority
//           />
//         </motion.div>
//       </AnimatePresence>

//       {images.length > 1 && (
//         <>
//           <Button
//             variant="ghost"
//             size="icon"
//             className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/20 hover:bg-background/40 backdrop-blur-sm"
//             onClick={(e) => {
//               e.preventDefault()
//               previous()
//             }}
//           >
//             <ChevronLeft className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="ghost"
//             size="icon"
//             className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/20 hover:bg-background/40 backdrop-blur-sm"
//             onClick={(e) => {
//               e.preventDefault()
//               next()
//             }}
//           >
//             <ChevronRight className="h-4 w-4" />
//           </Button>
//           <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
//             {images.map((_, index) => (
//               <button
//                 key={index}
//                 className={cn(
//                   "w-1.5 h-1.5 rounded-full transition-colors",
//                   index === currentIndex ? "bg-primary" : "bg-primary/50",
//                 )}
//                 onClick={(e) => {
//                   e.preventDefault()
//                   setCurrentIndex(index)
//                 }}
//               />
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   )
// }

"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence, PanInfo } from "framer-motion"

interface AutoCarouselProps {
  images: string[]
  interval?: number
  className?: string
}

export function AutoCarousel({ images, interval = 3000, className }: AutoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [direction, setDirection] = useState<"left" | "right">("right")
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  // Create an infinite loop by duplicating the first and last items
  const extendedImages = [images[images.length - 1], ...images, images[0]]

  const next = useCallback(() => {
    setDirection("right")
    setCurrentIndex((prev) => {
      if (prev >= extendedImages.length - 1) return 1 // Skip to real first image
      return prev + 1
    })
  }, [extendedImages.length])

  const previous = useCallback(() => {
    setDirection("left")
    setCurrentIndex((prev) => {
      if (prev <= 0) return extendedImages.length - 2 // Skip to real last image
      return prev - 1
    })
  }, [extendedImages.length])

  const goToIndex = (index: number) => {
    if (index > currentIndex) setDirection("right")
    else if (index < currentIndex) setDirection("left")
    setCurrentIndex(index)
  }

  useEffect(() => {
    if (isPaused || images.length <= 1) return

    const timer = setInterval(next, interval)
    return () => clearInterval(timer)
  }, [next, interval, isPaused, images.length])

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 50) {
      previous()
    } else if (info.offset.x < -50) {
      next()
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX
    const diff = touchStartX.current - touchEndX.current

    if (diff > 50) {
      next()
    } else if (diff < -50) {
      previous()
    }
  }

  if (images.length === 0) return null

  return (
    <div
      className={cn("relative aspect-square rounded-lg overflow-hidden", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          key={currentIndex}
          custom={direction}
          initial={{ x: direction === "right" ? "100%" : "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction === "right" ? "-100%" : "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          className="absolute inset-0"
        >
          <Image
            src={extendedImages[currentIndex] || "/placeholder.svg"}
            alt={`Slide ${currentIndex}`}
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/20 hover:bg-background/40 backdrop-blur-sm z-10"
            onClick={(e) => {
              e.preventDefault()
              previous()
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/20 hover:bg-background/40 backdrop-blur-sm z-10"
            onClick={(e) => {
              e.preventDefault()
              next()
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  (currentIndex === 0 && index === images.length - 1) || 
                  (currentIndex === extendedImages.length - 1 && index === 0) ||
                  (currentIndex === index + 1)
                    ? "bg-primary w-3"
                    : "bg-primary/50",
                )}
                onClick={(e) => {
                  e.preventDefault()
                  goToIndex(index + 1) // +1 because of our extended array
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}