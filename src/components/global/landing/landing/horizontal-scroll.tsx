"use client"

import { useEffect, useRef } from "react"
import { Zap, TrendingUp, Users, MessageSquare, ShoppingCart, BarChart } from "lucide-react"

const features = [
  { icon: Zap, text: "Instant Automation", color: "orange" },
  { icon: TrendingUp, text: "10x Response Speed", color: "green" },
  { icon: Users, text: "Unlimited Contacts", color: "purple" },
  { icon: MessageSquare, text: "Smart AI Replies", color: "red" },
  { icon: ShoppingCart, text: "Built-in Checkout", color: "yellow" },
  { icon: BarChart, text: "Real-time Analytics", color: "maroon" },
]

export function HorizontalScroll() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return

      const scrollY = window.scrollY
      const elementTop = scrollRef.current.offsetTop
      const elementHeight = scrollRef.current.offsetHeight
      const windowHeight = window.innerHeight

      // Calculate scroll progress through this section
      const scrollProgress = (scrollY - elementTop + windowHeight) / (elementHeight + windowHeight)

      const translateX = (scrollProgress - 0.5) * 200

      scrollRef.current.style.transform = `translateX(${-translateX}px)`
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="py-16 overflow-hidden">
      <div className="mb-12 text-center">
        <h3 className="text-3xl md:text-4xl font-bold">Everything You Need</h3>
        <p className="text-muted-foreground mt-2">All-in-one Instagram automation platform</p>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 px-4 transition-transform duration-100 ease-out will-change-transform"
        style={{ width: "max-content" }}
      >
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <div
              key={index}
              className={`flex-shrink-0 w-72 bg-card border-2 border-${feature.color} rounded-2xl p-6 shadow-lg hover:scale-105 transition-transform`}
            >
              <div className={`w-14 h-14 bg-${feature.color}/10 rounded-xl flex items-center justify-center mb-4`}>
                <Icon className={`w-7 h-7 text-${feature.color}`} />
              </div>
              <h4 className="text-xl font-bold">{feature.text}</h4>
              <p className="text-sm text-muted-foreground mt-2">Powerful features designed to help you grow faster</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
