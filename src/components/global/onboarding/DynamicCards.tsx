"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface DynamicCardShowcaseProps {
  slides: Array<{
    title: string
    description: string
    icon: React.ReactNode
    color: string
    stats: string
  }>
  autoplaySpeed?: number
  className?: string
}

export function DynamicCardShowcase({ slides, autoplaySpeed = 6000, className }: DynamicCardShowcaseProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [previousIndex, setPreviousIndex] = useState<number | null>(null)
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number } | null>(null)
  const [targetCardIndex, setTargetCardIndex] = useState<number | null>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>(Array(slides.length).fill(null))
  const containerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Card shapes - we'll rotate through these for variety
  const cardShapes = [
    "rounded-xl", // Standard rounded rectangle
    "rounded-[2rem]", // More rounded corners
    "rounded-lg rounded-tr-[2rem] rounded-bl-[2rem]", // Diagonal rounded corners
    "rounded-lg rounded-tl-[2rem] rounded-br-[2rem]", // Opposite diagonal rounded corners
    "rounded-t-xl rounded-b-[2rem]", // Top square, bottom rounded
    "rounded-l-xl rounded-r-[2rem]", // Left square, right rounded
  ]

  // Handle autoplay
  useEffect(() => {
    const expandRandomCard = () => {
      // Don't select the same card twice in a row
      let newIndex
      do {
        newIndex = Math.floor(Math.random() * slides.length)
      } while (newIndex === expandedIndex && slides.length > 1)

      // First, move the cursor to the target card
      const targetCard = cardRefs.current[newIndex]
      if (targetCard) {
        const rect = targetCard.getBoundingClientRect()
        const containerRect = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0 }

        // Calculate position relative to container
        setCursorPosition({
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2,
        })
        setTargetCardIndex(newIndex)
      }

      // Then, after a delay, expand the card
      timeoutRef.current = setTimeout(() => {
        setPreviousIndex(expandedIndex)
        setExpandedIndex(newIndex)
        setTargetCardIndex(null)
      }, 1000)
    }

    // Initial expansion after a delay
    if (expandedIndex === null) {
      timeoutRef.current = setTimeout(() => {
        expandRandomCard()
      }, 1000)
    } else {
      // Set timeout for next card
      timeoutRef.current = setTimeout(() => {
        // First collapse current card
        setExpandedIndex(null)

        // Then expand a new random card after a delay
        timeoutRef.current = setTimeout(() => {
          expandRandomCard()
        }, 1000)
      }, autoplaySpeed)
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [expandedIndex, slides.length, autoplaySpeed])

  // Handle manual card click
  const handleCardClick = (index: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    if (expandedIndex === index) {
      // Collapse if clicking the expanded card
      setExpandedIndex(null)
    } else {
      // Expand the clicked card
      setPreviousIndex(expandedIndex)
      setExpandedIndex(index)
    }
  }

  return (
    <div className={cn("relative w-full h-[500px]", className)} ref={containerRef}>
      {/* Background grid pattern */}
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-10 pointer-events-none">
        {Array.from({ length: 36 }).map((_, i) => (
          <div key={i} className="border border-white/10" />
        ))}
      </div>

      {/* Animated cursor */}
      <AnimatePresence>
        {cursorPosition && (
          <motion.div
            className="absolute w-8 h-8 rounded-full border-2 border-white pointer-events-none z-30"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: cursorPosition.x - 16, // Center the cursor (half of width)
              y: cursorPosition.y - 16, // Center the cursor (half of height)
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 rounded-full bg-white/30"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded card overlay - removed backdrop-blur */}
      <AnimatePresence>
        {expandedIndex !== null && (
          <motion.div
            className="absolute inset-0 bg-black/40 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Two-part layout: Expanded card at top, thumbnails at bottom */}
      <div className="relative w-full h-full flex flex-col">
        {/* Expanded card area - takes 70% of the height when a card is expanded */}
        <div
          className={cn(
            "relative w-full transition-all duration-500 ease-in-out overflow-hidden",
            expandedIndex !== null ? "h-[70%]" : "h-0",
          )}
        >
          <AnimatePresence>
            {expandedIndex !== null && (
              <motion.div
                className="absolute inset-0 p-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ExpandedCard
                  slide={slides[expandedIndex]}
                  index={expandedIndex}
                  onClose={() => setExpandedIndex(null)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Thumbnails area - takes 100% when no expanded card, 30% when there is one */}
        <div
          className={cn(
            "relative w-full transition-all duration-500 ease-in-out",
            expandedIndex !== null ? "h-[30%]" : "h-full",
          )}
        >
          <div className="w-full h-full p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {slides.map((slide, index) => {
              // Determine if this card is expanded, was previously expanded, or is being targeted
              const isExpanded = expandedIndex === index
              const wasPreviouslyExpanded = previousIndex === index
              const isTargeted = targetCardIndex === index

              // Get a consistent shape for this card based on its index
              const shapeClass = cardShapes[index % cardShapes.length]

              return (
                <motion.div
                  key={index}
                  ref={(el) => {
                    cardRefs.current[index] = el
                  }}
                  className={cn(
                    "relative cursor-pointer overflow-hidden",
                    shapeClass,
                    isTargeted ? "ring-2 ring-white/50 ring-offset-1 ring-offset-black/50" : "",
                    isExpanded ? "opacity-0" : "opacity-100", // Hide the thumbnail when it's expanded
                  )}
                  initial={false}
                  animate={{
                    scale: wasPreviouslyExpanded ? [0.95, 1] : isTargeted ? 1.05 : 1,
                  }}
                  onClick={() => handleCardClick(index)}
                  whileHover={!isExpanded && !isTargeted ? { scale: 1.05, zIndex: 5 } : {}}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  {/* Thumbnail Card */}
                  <motion.div
                    className={cn(
                      "w-full h-full bg-gradient-to-br border border-white/20",
                      slide.color,
                      shapeClass,
                      isTargeted ? "shadow-lg shadow-white/20" : "",
                    )}
                    initial={{ opacity: wasPreviouslyExpanded ? 0 : 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="w-full h-full p-2 sm:p-3 flex flex-col items-center justify-center">
                      <div className="text-white/90 mb-1">{slide.icon}</div>
                      <h3 className="text-xs sm:text-sm font-bold text-white text-center line-clamp-1">
                        {slide.title}
                      </h3>
                    </div>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// Separate component for the expanded card
function ExpandedCard({
  slide,
  index,
  onClose,
}: {
  slide: {
    title: string
    description: string
    icon: React.ReactNode
    color: string
    stats: string
  }
  index: number
  onClose: () => void
}) {
  return (
    <motion.div
      className={cn("w-full h-full bg-gradient-to-br border border-white/20 shadow-2xl rounded-xl", slide.color)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      style={{ filter: "none" }} // Explicitly ensure no filter is applied
    >
      {/* Corner decorations */}
      <CornerDecoration slideIndex={index} />

      {/* Close button */}
      <button
        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-30"
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
      >
        ✕
      </button>

      {/* Card content */}
      <div className="relative p-6 h-full flex flex-col">
        <div className="flex items-start">
          <div className="bg-white/10 rounded-lg p-4 mb-4 flex items-center justify-center w-16 h-16 mr-4">
            <motion.div
              animate={{
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            >
              {slide.icon}
            </motion.div>
          </div>

          <div className="flex-1">
            <motion.h3
              className="text-2xl font-bold text-white mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {slide.title}
            </motion.h3>

            <motion.p
              className="text-gray-200 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {slide.description}
            </motion.p>
          </div>
        </div>

        <motion.div
          className="mt-auto bg-white/10 rounded-lg p-3 border border-white/10 max-w-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-white font-semibold">{slide.stats}</p>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Corner decoration component
function CornerDecoration({ slideIndex }: { slideIndex: number }) {
  // Different corner designs based on the slide index
  switch (slideIndex % 5) {
    case 0: // Workflow Automation - Circuit pattern
      return (
        <>
          <div className="absolute top-3 left-3 w-12 h-12 opacity-30">
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <circle cx="20" cy="20" r="15" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
              <circle cx="20" cy="20" r="10" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
              <circle cx="20" cy="20" r="5" fill="rgba(255,255,255,0.2)" />
              <path
                d="M 20 5 L 20 15 M 5 20 L 15 20 M 20 35 L 20 25 M 35 20 L 25 20"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="1"
              />
            </svg>
          </div>
          <div className="absolute bottom-3 right-3 w-12 h-12 opacity-30">
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <circle cx="20" cy="20" r="15" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
              <circle cx="20" cy="20" r="10" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
              <circle cx="20" cy="20" r="5" fill="rgba(255,255,255,0.2)" />
              <path
                d="M 20 5 L 20 15 M 5 20 L 15 20 M 20 35 L 20 25 M 35 20 L 25 20"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="1"
              />
            </svg>
          </div>
        </>
      )
    case 1: // Smart Integrations - Connection nodes
      return (
        <>
          <div className="absolute top-3 left-3 w-12 h-12 opacity-30">
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <circle cx="10" cy="10" r="4" fill="rgba(255,255,255,0.3)" />
              <circle cx="30" cy="30" r="4" fill="rgba(255,255,255,0.3)" />
              <circle cx="30" cy="10" r="4" fill="rgba(255,255,255,0.3)" />
              <circle cx="10" cy="30" r="4" fill="rgba(255,255,255,0.3)" />
              <path
                d="M 10 10 L 30 30 M 30 10 L 10 30"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            </svg>
          </div>
          <div className="absolute bottom-3 right-3 w-12 h-12 opacity-30">
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <circle cx="10" cy="10" r="4" fill="rgba(255,255,255,0.3)" />
              <circle cx="30" cy="30" r="4" fill="rgba(255,255,255,0.3)" />
              <circle cx="30" cy="10" r="4" fill="rgba(255,255,255,0.3)" />
              <circle cx="10" cy="30" r="4" fill="rgba(255,255,255,0.3)" />
              <path
                d="M 10 10 L 30 30 M 30 10 L 10 30"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            </svg>
          </div>
        </>
      )
    case 2: // AI-Powered - Neural network
      return (
        <>
          <div className="absolute top-3 left-3 w-12 h-12 opacity-30">
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <circle cx="20" cy="10" r="3" fill="rgba(255,255,255,0.3)" />
              <circle cx="10" cy="25" r="3" fill="rgba(255,255,255,0.3)" />
              <circle cx="30" cy="25" r="3" fill="rgba(255,255,255,0.3)" />
              <path
                d="M 20 10 L 10 25 M 20 10 L 30 25 M 10 25 L 30 25"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1"
              />
            </svg>
          </div>
          <div className="absolute bottom-3 right-3 w-12 h-12 opacity-30">
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <circle cx="20" cy="10" r="3" fill="rgba(255,255,255,0.3)" />
              <circle cx="10" cy="25" r="3" fill="rgba(255,255,255,0.3)" />
              <circle cx="30" cy="25" r="3" fill="rgba(255,255,255,0.3)" />
              <path
                d="M 20 10 L 10 25 M 20 10 L 30 25 M 10 25 L 30 25"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1"
              />
            </svg>
          </div>
        </>
      )
    case 3: // Scalable Architecture - Building blocks
      return (
        <>
          <div className="absolute top-3 left-3 w-12 h-12 opacity-30">
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <rect
                x="8"
                y="8"
                width="10"
                height="10"
                fill="rgba(255,255,255,0.2)"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1"
              />
              <rect
                x="22"
                y="8"
                width="10"
                height="10"
                fill="rgba(255,255,255,0.2)"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1"
              />
              <rect
                x="15"
                y="22"
                width="10"
                height="10"
                fill="rgba(255,255,255,0.2)"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1"
              />
            </svg>
          </div>
          <div className="absolute bottom-3 right-3 w-12 h-12 opacity-30">
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <rect
                x="8"
                y="8"
                width="10"
                height="10"
                fill="rgba(255,255,255,0.2)"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1"
              />
              <rect
                x="22"
                y="8"
                width="10"
                height="10"
                fill="rgba(255,255,255,0.2)"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1"
              />
              <rect
                x="15"
                y="22"
                width="10"
                height="10"
                fill="rgba(255,255,255,0.2)"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1"
              />
            </svg>
          </div>
        </>
      )
    case 4: // Performance Analytics - Chart
      return (
        <>
          <div className="absolute top-3 left-3 w-12 h-12 opacity-30">
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <path
                d="M 5 30 L 35 30 M 5 30 L 5 10 M 5 25 L 15 15 L 25 20 L 35 10"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="15" cy="15" r="2" fill="rgba(255,255,255,0.4)" />
              <circle cx="25" cy="20" r="2" fill="rgba(255,255,255,0.4)" />
              <circle cx="35" cy="10" r="2" fill="rgba(255,255,255,0.4)" />
            </svg>
          </div>
          <div className="absolute bottom-3 right-3 w-12 h-12 opacity-30">
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <path
                d="M 5 30 L 35 30 M 5 30 L 5 10 M 5 25 L 15 15 L 25 20 L 35 10"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="15" cy="15" r="2" fill="rgba(255,255,255,0.4)" />
              <circle cx="25" cy="20" r="2" fill="rgba(255,255,255,0.4)" />
              <circle cx="35" cy="10" r="2" fill="rgba(255,255,255,0.4)" />
            </svg>
          </div>
        </>
      )
    default:
      return null
  }
}
