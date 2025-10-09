"use client"

import { useEffect, useRef, type ReactNode } from "react"

interface ScrollAnimationProps {
  children: ReactNode
  className?: string
  animation?: "fadeUp" | "fadeLeft" | "fadeRight" | "scale"
  delay?: number
}

export function ScrollAnimation({ children, className = "", animation = "fadeUp", delay = 0 }: ScrollAnimationProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("visible")
            }, delay)
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [delay])

  const animationClass = {
    fadeUp: "animate-on-scroll",
    fadeLeft: "animate-on-scroll animate-fade-left",
    fadeRight: "animate-on-scroll animate-fade-right",
    scale: "animate-on-scroll animate-scale",
  }[animation]

  return (
    <div ref={ref} className={`${animationClass} ${className}`}>
      {children}
    </div>
  )
}
