"use client"

import { useEffect, useRef, useState } from "react"
import { MessageSquare, ShoppingCart, Calendar, CreditCard, Users, Video } from "lucide-react"

export function IntegrationsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeScenario, setActiveScenario] = useState(0)
  const scenarios = ["ecommerce", "booking", "payment", "crm"]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed")
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = sectionRef.current?.querySelectorAll(".scroll-reveal")
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveScenario((prev) => (prev + 1) % scenarios.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [scenarios.length])

  const currentScenario = scenarios[activeScenario]

  return (
    <section ref={sectionRef} className="py-16 lg:py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-12 lg:mb-20 scroll-reveal">
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 lg:mb-6">
            Connects With <span className="text-orange">Everything</span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
            Watch data flow seamlessly between Instagram DMs and your favorite tools
          </p>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-8">
          {/* Center DM Interface */}
          <div className="max-w-md mx-auto">
            <div className="bg-card border-4 border-border rounded-3xl overflow-hidden shadow-2xl">
              {/* DM Header */}
              <div className="bg-muted px-4 py-3 border-b border-border flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-orange" />
                <div>
                  <p className="font-semibold text-sm">Instagram DM</p>
                  <p className="text-xs text-green flex items-center gap-1">
                    <span className="w-2 h-2 bg-green rounded-full animate-pulse" />
                    Processing...
                  </p>
                </div>
              </div>

              {/* DM Content */}
              <div className="p-4 space-y-3 min-h-[200px]">
                {currentScenario === "ecommerce" && (
                  <>
                    <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                      <p className="text-sm">I want to buy the blue sneakers!</p>
                    </div>
                    <div className="bg-orange rounded-2xl rounded-tr-sm px-4 py-3 ml-auto max-w-[80%]">
                      <p className="text-sm text-black font-medium">Processing order... 🛍️</p>
                    </div>
                  </>
                )}
                {currentScenario === "booking" && (
                  <>
                    <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                      <p className="text-sm">Book me for tomorrow at 2pm</p>
                    </div>
                    <div className="bg-orange rounded-2xl rounded-tr-sm px-4 py-3 ml-auto max-w-[80%]">
                      <p className="text-sm text-black font-medium">Checking calendar... 📅</p>
                    </div>
                  </>
                )}
                {currentScenario === "payment" && (
                  <>
                    <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                      <p className="text-sm">Ready to checkout!</p>
                    </div>
                    <div className="bg-orange rounded-2xl rounded-tr-sm px-4 py-3 ml-auto max-w-[80%]">
                      <p className="text-sm text-black font-medium">Processing payment... 💳</p>
                    </div>
                  </>
                )}
                {currentScenario === "crm" && (
                  <>
                    <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                      <p className="text-sm">Tell me more about your services</p>
                    </div>
                    <div className="bg-orange rounded-2xl rounded-tr-sm px-4 py-3 ml-auto max-w-[80%]">
                      <p className="text-sm text-black font-medium">Updating CRM... 📊</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Integration Icons Grid */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div
              className={`p-4 bg-card border-3 rounded-2xl flex flex-col items-center justify-center shadow-xl transition-all ${
                currentScenario === "ecommerce" ? "border-green shadow-green/20 scale-105" : "border-border"
              }`}
            >
              <ShoppingCart
                className={`w-8 h-8 mb-2 ${currentScenario === "ecommerce" ? "text-green" : "text-muted"}`}
              />
              <p className="text-xs font-medium text-center">Shopify</p>
            </div>

            <div
              className={`p-4 bg-card border-3 rounded-2xl flex flex-col items-center justify-center shadow-xl transition-all ${
                currentScenario === "payment" ? "border-purple shadow-purple/20 scale-105" : "border-border"
              }`}
            >
              <CreditCard className={`w-8 h-8 mb-2 ${currentScenario === "payment" ? "text-purple" : "text-muted"}`} />
              <p className="text-xs font-medium text-center">Stripe</p>
            </div>

            <div
              className={`p-4 bg-card border-3 rounded-2xl flex flex-col items-center justify-center shadow-xl transition-all ${
                currentScenario === "booking" ? "border-yellow shadow-yellow/20 scale-105" : "border-border"
              }`}
            >
              <Calendar className={`w-8 h-8 mb-2 ${currentScenario === "booking" ? "text-yellow" : "text-muted"}`} />
              <p className="text-xs font-medium text-center">Calendly</p>
            </div>

            <div
              className={`p-4 bg-card border-3 rounded-2xl flex flex-col items-center justify-center shadow-xl transition-all ${
                currentScenario === "crm" ? "border-red shadow-red/20 scale-105" : "border-border"
              }`}
            >
              <Users className={`w-8 h-8 mb-2 ${currentScenario === "crm" ? "text-red" : "text-muted"}`} />
              <p className="text-xs font-medium text-center">HubSpot</p>
            </div>

            <div className="p-4 bg-card border-3 border-border rounded-2xl flex flex-col items-center justify-center shadow-xl">
              <Video className="w-8 h-8 mb-2 text-muted" />
              <p className="text-xs font-medium text-center">Zoom</p>
            </div>

            <div className="p-4 bg-card border-3 border-border rounded-2xl flex flex-col items-center justify-center shadow-xl">
              <Users className="w-8 h-8 mb-2 text-muted" />
              <p className="text-xs font-medium text-center">Salesforce</p>
            </div>
          </div>
        </div>

        {/* Desktop Layout with connecting lines */}
        <div className="hidden lg:block relative max-w-6xl mx-auto h-[700px] scroll-reveal">
          {/* Center - DM Interface */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="w-80 bg-card border-4 border-border rounded-3xl overflow-hidden shadow-2xl">
              {/* DM Header */}
              <div className="bg-muted px-4 py-3 border-b border-border flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-orange" />
                <div>
                  <p className="font-semibold text-sm">Instagram DM</p>
                  <p className="text-xs text-green flex items-center gap-1">
                    <span className="w-2 h-2 bg-green rounded-full animate-pulse" />
                    Processing...
                  </p>
                </div>
              </div>

              {/* DM Content */}
              <div className="p-4 space-y-3 min-h-[200px]">
                {currentScenario === "ecommerce" && (
                  <>
                    <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                      <p className="text-sm">I want to buy the blue sneakers!</p>
                    </div>
                    <div className="bg-orange rounded-2xl rounded-tr-sm px-4 py-3 ml-auto max-w-[80%]">
                      <p className="text-sm text-black font-medium">Processing order... 🛍️</p>
                    </div>
                  </>
                )}
                {currentScenario === "booking" && (
                  <>
                    <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                      <p className="text-sm">Book me for tomorrow at 2pm</p>
                    </div>
                    <div className="bg-orange rounded-2xl rounded-tr-sm px-4 py-3 ml-auto max-w-[80%]">
                      <p className="text-sm text-black font-medium">Checking calendar... 📅</p>
                    </div>
                  </>
                )}
                {currentScenario === "payment" && (
                  <>
                    <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                      <p className="text-sm">Ready to checkout!</p>
                    </div>
                    <div className="bg-orange rounded-2xl rounded-tr-sm px-4 py-3 ml-auto max-w-[80%]">
                      <p className="text-sm text-black font-medium">Processing payment... 💳</p>
                    </div>
                  </>
                )}
                {currentScenario === "crm" && (
                  <>
                    <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                      <p className="text-sm">Tell me more about your services</p>
                    </div>
                    <div className="bg-orange rounded-2xl rounded-tr-sm px-4 py-3 ml-auto max-w-[80%]">
                      <p className="text-sm text-black font-medium">Updating CRM... 📊</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* SVG for hand-drawn connectors with animated data flow */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Animated gradient for data flow */}
              <linearGradient id="dataFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="currentColor" stopOpacity="0.8" />
                <stop offset="100%" stopColor="transparent" />
                <animate attributeName="x1" values="-100%;100%" dur="2s" repeatCount="indefinite" />
                <animate attributeName="x2" values="0%;200%" dur="2s" repeatCount="indefinite" />
              </linearGradient>
            </defs>

            {/* Shopify - Top Left */}
            <path
              d="M 480 350 Q 400 280, 200 180"
              stroke={currentScenario === "ecommerce" ? "#00d9a3" : "#262626"}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              className="transition-all duration-500"
            />
            {currentScenario === "ecommerce" && (
              <circle r="6" fill="#00d9a3" className="animate-data-flow">
                <animateMotion dur="2s" repeatCount="indefinite" path="M 480 350 Q 400 280, 200 180" />
              </circle>
            )}

            {/* Stripe - Top Right */}
            <path
              d="M 480 350 Q 560 280, 760 180"
              stroke={currentScenario === "payment" ? "#9d4edd" : "#262626"}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              className="transition-all duration-500"
            />
            {currentScenario === "payment" && (
              <circle r="6" fill="#9d4edd" className="animate-data-flow">
                <animateMotion dur="2s" repeatCount="indefinite" path="M 480 350 Q 560 280, 760 180" />
              </circle>
            )}

            {/* Calendly - Middle Left */}
            <path
              d="M 480 350 Q 300 350, 150 350"
              stroke={currentScenario === "booking" ? "#ffd93d" : "#262626"}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              className="transition-all duration-500"
            />
            {currentScenario === "booking" && (
              <circle r="6" fill="#ffd93d" className="animate-data-flow">
                <animateMotion dur="2s" repeatCount="indefinite" path="M 480 350 Q 300 350, 150 350" />
              </circle>
            )}

            {/* HubSpot - Middle Right */}
            <path
              d="M 480 350 Q 660 350, 810 350"
              stroke={currentScenario === "crm" ? "#ff3366" : "#262626"}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              className="transition-all duration-500"
            />
            {currentScenario === "crm" && (
              <circle r="6" fill="#ff3366" className="animate-data-flow">
                <animateMotion dur="2s" repeatCount="indefinite" path="M 480 350 Q 660 350, 810 350" />
              </circle>
            )}

            {/* Zoom - Bottom Left */}
            <path d="M 480 350 Q 400 420, 200 520" stroke="#262626" strokeWidth="3" fill="none" strokeLinecap="round" />

            {/* Salesforce - Bottom Right */}
            <path d="M 480 350 Q 560 420, 760 520" stroke="#262626" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>

          {/* Integration icons positioned around center */}
          <div className="absolute top-8 left-8 animate-float">
            <div
              className={`w-24 h-24 bg-card border-3 rounded-2xl flex flex-col items-center justify-center shadow-xl hover:scale-110 transition-all ${
                currentScenario === "ecommerce" ? "border-green shadow-green/20" : "border-border"
              }`}
            >
              <ShoppingCart className={`w-10 h-10 ${currentScenario === "ecommerce" ? "text-green" : "text-muted"}`} />
              <p className="text-xs mt-2 font-medium">Shopify</p>
            </div>
          </div>

          <div className="absolute top-8 right-8 animate-float-delayed">
            <div
              className={`w-24 h-24 bg-card border-3 rounded-2xl flex flex-col items-center justify-center shadow-xl hover:scale-110 transition-all ${
                currentScenario === "payment" ? "border-purple shadow-purple/20" : "border-border"
              }`}
            >
              <CreditCard className={`w-10 h-10 ${currentScenario === "payment" ? "text-purple" : "text-muted"}`} />
              <p className="text-xs mt-2 font-medium">Stripe</p>
            </div>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 left-0 animate-float">
            <div
              className={`w-24 h-24 bg-card border-3 rounded-2xl flex flex-col items-center justify-center shadow-xl hover:scale-110 transition-all ${
                currentScenario === "booking" ? "border-yellow shadow-yellow/20" : "border-border"
              }`}
            >
              <Calendar className={`w-10 h-10 ${currentScenario === "booking" ? "text-yellow" : "text-muted"}`} />
              <p className="text-xs mt-2 font-medium">Calendly</p>
            </div>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 right-0 animate-float-delayed">
            <div
              className={`w-24 h-24 bg-card border-3 rounded-2xl flex flex-col items-center justify-center shadow-xl hover:scale-110 transition-all ${
                currentScenario === "crm" ? "border-red shadow-red/20" : "border-border"
              }`}
            >
              <Users className={`w-10 h-10 ${currentScenario === "crm" ? "text-red" : "text-muted"}`} />
              <p className="text-xs mt-2 font-medium">HubSpot</p>
            </div>
          </div>

          <div className="absolute bottom-8 left-8 animate-float">
            <div className="w-24 h-24 bg-card border-3 border-border rounded-2xl flex flex-col items-center justify-center shadow-xl hover:scale-110 transition-all">
              <Video className="w-10 h-10 text-muted" />
              <p className="text-xs mt-2 font-medium">Zoom</p>
            </div>
          </div>

          <div className="absolute bottom-8 right-8 animate-float-delayed">
            <div className="w-24 h-24 bg-card border-3 border-border rounded-2xl flex flex-col items-center justify-center shadow-xl hover:scale-110 transition-all">
              <Users className="w-10 h-10 text-muted" />
              <p className="text-xs mt-2 font-medium">Salesforce</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12 lg:mt-20 scroll-reveal">
          <p className="text-base lg:text-lg text-muted-foreground mb-6">And 50+ more integrations</p>
          <div className="flex flex-wrap justify-center gap-3 lg:gap-4">
            {["Zapier", "Make", "WooCommerce", "Mailchimp", "Slack", "Notion"].map((tool) => (
              <div
                key={tool}
                className="px-3 py-2 lg:px-4 bg-card border border-border rounded-full text-xs lg:text-sm hover:border-orange transition-colors"
              >
                {tool}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes data-flow {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        .animate-data-flow {
          animation: data-flow 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}
