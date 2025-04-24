"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"

interface CardCarouselProps {
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

export function CardCarousel({ slides, autoplaySpeed = 5000, className }: CardCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoplay, setIsAutoplay] = useState(true)
  const [direction, setDirection] = useState(0) // -1 for left, 1 for right, 0 for initial
  const containerRef = useRef<HTMLDivElement>(null)

  // Responsive breakpoints
  const isMobile = useMediaQuery("(max-width: 640px)")
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)")

  // Calculate previous and next indices
  const prevIndex = (currentIndex - 1 + slides.length) % slides.length
  const nextIndex = (currentIndex + 1) % slides.length

  // Handle autoplay
  useEffect(() => {
    if (!isAutoplay) return

    const interval = setInterval(() => {
      setDirection(1) // Moving right
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, autoplaySpeed)

    return () => clearInterval(interval)
  }, [isAutoplay, autoplaySpeed, slides.length])

  // Handle manual navigation
  const handleCardClick = (index: number) => {
    if (index === nextIndex) {
      setDirection(1) // Moving right
      setCurrentIndex(nextIndex)
    } else if (index === prevIndex) {
      setDirection(-1) // Moving left
      setCurrentIndex(prevIndex)
    }

    // Pause autoplay when user interacts
    setIsAutoplay(false)

    // Resume autoplay after 15 seconds of inactivity
    const timeout = setTimeout(() => setIsAutoplay(true), 15000)
    return () => clearTimeout(timeout)
  }

  // Get position values based on screen size
  const getPositionValues = () => {
    if (isMobile) {
      return {
        leftX: "-15%",
        rightX: "15%",
        scale: 0.9,
        rotateY: 15, // Less rotation on mobile
        rotateZ: 3, // Less z-rotation on mobile
        yOffset: "5%",
      }
    } else if (isTablet) {
      return {
        leftX: "-20%",
        rightX: "20%",
        scale: 0.85,
        rotateY: 20,
        rotateZ: 4,
        yOffset: "7%",
      }
    } else {
      return {
        leftX: "-25%",
        rightX: "25%",
        scale: 0.85,
        rotateY: 25,
        rotateZ: 5,
        yOffset: "10%",
      }
    }
  }

  const positions = getPositionValues()

  return (
    <div
      className={cn("relative w-full overflow-hidden", isMobile ? "h-[450px]" : "h-[500px]", className)}
      ref={containerRef}
    >
      {/* Curved path visualization (subtle) */}
      <svg
        className="absolute w-full h-full top-0 left-0 z-0 opacity-20 pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M 10,50 Q 50,75 90,50"
          stroke="url(#cardPathGradient)"
          strokeWidth="0.5"
          fill="none"
          strokeDasharray="1,2"
        />
        <defs>
          <linearGradient id="cardPathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>

      {/* Spotlight effect for center card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[200px] bg-white/5 rounded-full blur-[80px] z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[120px] bg-indigo-500/20 rounded-full blur-[50px] z-0" />

      {/* Card positions */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Left (previous) card */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`left-${prevIndex}`}
            className="absolute left-1/2 top-1/2 -translate-y-1/2 w-full max-w-sm cursor-pointer z-10"
            onClick={() => handleCardClick(prevIndex)}
            initial={{ x: "-100%", opacity: 0 }}
            animate={{
              x: positions.leftX,
              opacity: 0.8,
              translateX: "-50%",
            }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          >
            <Card
              position="left"
              slide={slides[prevIndex]}
              isActive={false}
              slideIndex={prevIndex}
              totalSlides={slides.length}
              isMobile={isMobile}
              rotateY={-positions.rotateY}
              rotateZ={-positions.rotateZ}
              yOffset={positions.yOffset}
              scale={positions.scale}
            />
          </motion.div>
        </AnimatePresence>

        {/* Center (current) card */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`center-${currentIndex}`}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm z-20"
            initial={{
              scale: direction === 1 ? positions.scale : positions.scale,
              x: direction === 1 ? positions.rightX : positions.leftX,
              translateX: "-50%",
              rotateY: direction === 1 ? `${positions.rotateY}deg` : `-${positions.rotateY}deg`,
              opacity: 0.8,
            }}
            animate={{
              scale: 1,
              x: "0%",
              translateX: "-50%",
              rotateY: "0deg",
              opacity: 1,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          >
            <Card
              position="center"
              slide={slides[currentIndex]}
              isActive={true}
              slideIndex={currentIndex}
              totalSlides={slides.length}
              isMobile={isMobile}
              rotateY={0}
              rotateZ={0}
              yOffset="0%"
              scale={1}
            />
          </motion.div>
        </AnimatePresence>

        {/* Right (next) card */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`right-${nextIndex}`}
            className="absolute left-1/2 top-1/2 -translate-y-1/2 w-full max-w-sm cursor-pointer z-10"
            onClick={() => handleCardClick(nextIndex)}
            initial={{ x: "100%", opacity: 0 }}
            animate={{
              x: positions.rightX,
              opacity: 0.8,
              translateX: "-50%",
            }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          >
            <Card
              position="right"
              slide={slides[nextIndex]}
              isActive={false}
              slideIndex={nextIndex}
              totalSlides={slides.length}
              isMobile={isMobile}
              rotateY={positions.rotateY}
              rotateZ={positions.rotateZ}
              yOffset={positions.yOffset}
              scale={positions.scale}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation indicators */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              currentIndex === index
                ? "w-8 bg-gradient-to-r from-indigo-500 to-purple-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                : "bg-white/30",
            )}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1)
              setCurrentIndex(index)
              setIsAutoplay(false)
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

interface CardProps {
  position: "left" | "center" | "right"
  slide: {
    title: string
    description: string
    icon: React.ReactNode
    color: string
    stats: string
  }
  isActive: boolean
  slideIndex: number
  totalSlides: number
  isMobile: boolean
  rotateY: number
  rotateZ: number
  yOffset: string
  scale: number
}

function Card({
  position,
  slide,
  isActive,
  slideIndex,
  totalSlides,
  isMobile,
  rotateY,
  rotateZ,
  yOffset,
  scale,
}: CardProps) {
  // Generate unique decorative elements for each card
  const getCornerDecoration = (isTop: boolean, slideIndex: number) => {
    // Different corner designs based on the slide index
    switch (slideIndex % 5) {
      case 0: // Workflow Automation - Circuit pattern
        return (
          <div className={`absolute ${isTop ? "top-2 left-2" : "bottom-2 right-2"} w-8 h-8`}>
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <circle cx="20" cy="20" r="15" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <circle cx="20" cy="20" r="10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <circle cx="20" cy="20" r="5" fill="rgba(255,255,255,0.1)" />
              <path
                d="M 20 5 L 20 15 M 5 20 L 15 20 M 20 35 L 20 25 M 35 20 L 25 20"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1"
              />
            </svg>
          </div>
        )
      case 1: // Smart Integrations - Connection nodes
        return (
          <div className={`absolute ${isTop ? "top-2 left-2" : "bottom-2 right-2"} w-8 h-8`}>
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <circle cx="10" cy="10" r="4" fill="rgba(255,255,255,0.2)" />
              <circle cx="30" cy="30" r="4" fill="rgba(255,255,255,0.2)" />
              <circle cx="30" cy="10" r="4" fill="rgba(255,255,255,0.2)" />
              <circle cx="10" cy="30" r="4" fill="rgba(255,255,255,0.2)" />
              <path
                d="M 10 10 L 30 30 M 30 10 L 10 30"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            </svg>
          </div>
        )
      case 2: // AI-Powered - Neural network
        return (
          <div className={`absolute ${isTop ? "top-2 left-2" : "bottom-2 right-2"} w-8 h-8`}>
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <circle cx="20" cy="10" r="3" fill="rgba(255,255,255,0.2)" />
              <circle cx="10" cy="25" r="3" fill="rgba(255,255,255,0.2)" />
              <circle cx="30" cy="25" r="3" fill="rgba(255,255,255,0.2)" />
              <path
                d="M 20 10 L 10 25 M 20 10 L 30 25 M 10 25 L 30 25"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1"
              />
            </svg>
          </div>
        )
      case 3: // Scalable Architecture - Building blocks
        return (
          <div className={`absolute ${isTop ? "top-2 left-2" : "bottom-2 right-2"} w-8 h-8`}>
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <rect
                x="8"
                y="8"
                width="10"
                height="10"
                fill="rgba(255,255,255,0.1)"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1"
              />
              <rect
                x="22"
                y="8"
                width="10"
                height="10"
                fill="rgba(255,255,255,0.1)"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1"
              />
              <rect
                x="15"
                y="22"
                width="10"
                height="10"
                fill="rgba(255,255,255,0.1)"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1"
              />
            </svg>
          </div>
        )
      case 4: // Performance Analytics - Chart
        return (
          <div className={`absolute ${isTop ? "top-2 left-2" : "bottom-2 right-2"} w-8 h-8`}>
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <path
                d="M 5 30 L 35 30 M 5 30 L 5 10 M 5 25 L 15 15 L 25 20 L 35 10"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="15" cy="15" r="2" fill="rgba(255,255,255,0.3)" />
              <circle cx="25" cy="20" r="2" fill="rgba(255,255,255,0.3)" />
              <circle cx="35" cy="10" r="2" fill="rgba(255,255,255,0.3)" />
            </svg>
          </div>
        )
      default:
        return (
          <div className={`absolute ${isTop ? "top-2 left-2" : "bottom-2 right-2"} w-8 h-8 rounded-md bg-white/10`}>
            <div className="text-white/80 text-xs font-bold">Y</div>
          </div>
        )
    }
  }

  return (
    <motion.div
      className="w-full perspective-[1200px]"
      initial={false}
      animate={{
        rotateY: `${rotateY}deg`,
        rotateZ: `${rotateZ}deg`,
        y: yOffset,
        scale: scale,
        filter: isActive ? "brightness(1) blur(0px)" : "brightness(0.8) blur(1px)",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.5,
      }}
      style={{
        transformStyle: "preserve-3d",
        transformOrigin: "center center",
        width: "100%",
        maxWidth: isMobile ? "280px" : "320px",
        margin: "0 auto",
      }}
    >
      <div
        className={`relative bg-gradient-to-br ${slide.color} p-4 sm:p-6 rounded-xl border border-white/20 shadow-xl overflow-hidden`}
        style={{
          boxShadow: isActive ? "0 0 30px rgba(79, 70, 229, 0.3)" : "none",
        }}
      >
        {/* Creative corner decorations */}
        {getCornerDecoration(true, slideIndex)}
        {getCornerDecoration(false, slideIndex)}

        {/* Card content */}
        <div className="relative">
          {/* Glowing effect for active card */}
          {isActive && (
            <motion.div
              className="absolute inset-0 bg-white/5 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0.1, 0.2, 0.1],
                transition: {
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                },
              }}
            />
          )}

          <div className="bg-white/10 rounded-lg p-3 sm:p-4 backdrop-blur-sm mb-3 sm:mb-4 flex items-center justify-center">
            <motion.div
              initial={{ rotate: 0 }}
              animate={
                isActive
                  ? {
                      rotate: [0, 5, 0, -5, 0],
                      transition: {
                        duration: 5,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      },
                    }
                  : { rotate: 0 }
              }
            >
              {slide.icon}
            </motion.div>
          </div>

          <motion.h3
            className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: isActive ? 1 : 0.7,
              y: isActive ? 0 : 5,
            }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            {slide.title}
          </motion.h3>

          <motion.p
            className="text-sm sm:text-base text-gray-200 mb-3 sm:mb-4 line-clamp-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: isActive ? 1 : 0.6,
              y: isActive ? 0 : 5,
            }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {slide.description}
          </motion.p>

          <motion.div
            className="mt-2 sm:mt-4 bg-white/10 rounded-lg p-2 sm:p-3 backdrop-blur-sm border border-white/10"
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: isActive ? 1 : 0.5,
              y: isActive ? 0 : 5,
              boxShadow: isActive ? "0 0 15px rgba(255, 255, 255, 0.1)" : "none",
            }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <p className="text-sm sm:text-base text-white font-semibold">{slide.stats}</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
