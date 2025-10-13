"use client"

import { useEffect, useState } from "react"
import { ShoppingBag, Check, CreditCard, Package } from "lucide-react"

export function AdvancedDMSimulation() {
  const [step, setStep] = useState(0)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [showCursor, setShowCursor] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null)

  useEffect(() => {
    const sequence = [
      { delay: 500, action: () => setStep(1) },
      { delay: 2000, action: () => setStep(2) },
      { delay: 3500, action: () => setShowCursor(true) },
      { delay: 4000, action: () => setCursorPos({ x: 100, y: 200 }) },
      {
        delay: 5000,
        action: () => {
          setSelectedProduct(0)
          setShowCursor(false)
        },
      },
      { delay: 6000, action: () => setStep(3) },
      { delay: 7500, action: () => setStep(4) },
      { delay: 9000, action: () => setStep(5) },
      { delay: 11000, action: () => setStep(6) },
      {
        delay: 13000,
        action: () => {
          setStep(0)
          setSelectedProduct(null)
          setShowCursor(false)
        },
      },
    ]

    const timers = sequence.map(({ delay, action }) => setTimeout(action, delay))
    return () => timers.forEach(clearTimeout)
  }, [])

  const products = [
    { name: "Designer Handbag", price: "$299", color: "bg-maroon", image: "/ecommerce-shopping-bags-and-products.jpg" },
    { name: "Leather Shoes", price: "$199", color: "bg-brown", image: "/ecommerce-shopping-bags-and-products.jpg" },
    { name: "Sunglasses", price: "$149", color: "bg-yellow", image: "/ecommerce-shopping-bags-and-products.jpg" },
  ]

  return (
    <section className="py-16 lg:py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 lg:mb-6">
            Watch <span className="text-orange">Magic</span> Happen
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
            See how yazzil turns casual browsers into paying customers in seconds
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="relative order-2 lg:order-1">
              <div className="bg-card border-4 border-border rounded-3xl overflow-hidden shadow-2xl">
                <div className="bg-muted px-4 py-4 border-b border-border flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-orange flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-black" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm md:text-base">Luxury Boutique</p>
                    <p className="text-xs text-green flex items-center gap-1">
                      <span className="w-2 h-2 bg-green rounded-full animate-pulse" />
                      Active now
                    </p>
                  </div>
                </div>

                <div className="p-4 md:p-6 space-y-4 min-h-[400px] md:min-h-[500px] lg:min-h-[600px] relative bg-background/50">
                  {step >= 1 && (
                    <div className="flex gap-2 md:gap-3 animate-slide-in-left">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 text-black" />
                      </div>
                      <div className="bg-muted rounded-2xl rounded-tl-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
                        <p className="text-xs md:text-sm leading-relaxed">
                          Hey there! 👋 Welcome to our boutique! Looking for something special today?
                        </p>
                      </div>
                    </div>
                  )}

                  {step >= 2 && (
                    <div className="flex gap-2 md:gap-3 animate-fade-in">
                      <div className="w-8 md:w-10 flex-shrink-0" />
                      <div className="space-y-3 flex-1">
                        <div className="bg-muted rounded-2xl rounded-tl-sm px-3 md:px-5 py-2 md:py-3">
                          <p className="text-xs md:text-sm">Check out our bestsellers! 🔥</p>
                        </div>

                        {products.map((product, index) => (
                          <div
                            key={index}
                            className={`bg-card border-2 ${selectedProduct === index ? "border-green scale-105" : "border-border"} rounded-2xl p-3 md:p-4 transition-all duration-300 cursor-pointer hover:border-green/50`}
                          >
                            <div className="flex items-center gap-3 md:gap-4">
                              <div className="w-14 h-14 md:w-20 md:h-20 rounded-xl relative overflow-hidden flex-shrink-0">
                                <img
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-xs md:text-base truncate">{product.name}</p>
                                <p className="text-xs md:text-sm text-muted-foreground">{product.price}</p>
                                <button className="mt-1 md:mt-2 text-xs bg-green text-black px-2 md:px-4 py-1 md:py-1.5 rounded-full font-medium hover:bg-green/90 transition-colors">
                                  Add to Cart
                                </button>
                              </div>
                              {selectedProduct === index && (
                                <Check className="w-4 h-4 md:w-6 md:h-6 text-green flex-shrink-0" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {step >= 3 && (
                    <div className="flex gap-3 justify-end animate-slide-in-right">
                      <div className="bg-orange rounded-2xl rounded-tr-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
                        <p className="text-xs md:text-sm text-black font-medium">I&apos;ll take the Designer Handbag!</p>
                      </div>
                    </div>
                  )}

                  {step >= 4 && (
                    <div className="flex gap-2 md:gap-3 animate-slide-in-left">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 text-black" />
                      </div>
                      <div className="bg-muted rounded-2xl rounded-tl-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
                        <p className="text-xs md:text-sm mb-3">Excellent choice! ✨ Added to your cart.</p>
                        <div className="bg-card border border-border rounded-xl p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2 md:gap-3">
                            <Package className="w-4 h-4 md:w-5 md:h-5 text-orange" />
                            <div>
                              <p className="text-xs font-semibold">Cart Total</p>
                              <p className="text-sm md:text-base font-bold text-orange">$299</p>
                            </div>
                          </div>
                          <button className="bg-orange text-black px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs font-semibold hover:bg-orange/90 transition-colors flex items-center gap-2">
                            <CreditCard className="w-3 h-3 md:w-4 md:h-4" />
                            Checkout
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {step >= 5 && (
                    <div className="flex gap-3 justify-end animate-slide-in-right">
                      <div className="bg-orange rounded-2xl rounded-tr-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
                        <p className="text-xs md:text-sm text-black font-medium">Yes, let&apos;s checkout!</p>
                      </div>
                    </div>
                  )}

                  {step >= 6 && (
                    <div className="flex gap-2 md:gap-3 animate-slide-in-left">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 md:w-5 md:h-5 text-black" />
                      </div>
                      <div className="bg-green/20 border border-green rounded-2xl rounded-tl-sm px-3 md:px-5 py-2 md:py-3 max-w-[85%]">
                        <p className="text-xs md:text-sm font-medium text-green">
                          🎉 Order confirmed! You&apos;ll receive tracking info shortly. Thanks for shopping with us!
                        </p>
                      </div>
                    </div>
                  )}

                  {showCursor && (
                    <div
                      className="absolute pointer-events-none transition-all duration-1000 ease-out z-50"
                      style={{
                        left: `${cursorPos.x}px`,
                        top: `${cursorPos.y}px`,
                      }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="drop-shadow-2xl md:w-7 md:h-7"
                      >
                        <path
                          d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
                          fill="#ff6b35"
                          stroke="#0a0a0a"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6 lg:space-y-8 order-1 lg:order-2">
              <div className="space-y-4 lg:space-y-6">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-orange/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xl md:text-2xl font-bold text-orange">1</span>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Instant Engagement</h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Respond to customer inquiries in milliseconds, not hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xl md:text-2xl font-bold text-green">2</span>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Visual Product Catalogs</h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Showcase your products with beautiful, interactive cards
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-purple/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xl md:text-2xl font-bold text-purple">3</span>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Seamless Checkout</h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Complete transactions without leaving Instagram
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-red/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xl md:text-2xl font-bold text-red">4</span>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Order Tracking</h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Keep customers updated every step of the way
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card border-2 border-orange/20 rounded-2xl p-4 md:p-6">
                <p className="text-xs md:text-sm text-muted-foreground mb-2">Average conversion rate</p>
                <p className="text-3xl md:text-4xl font-bold text-orange mb-2">34.7%</p>
                <p className="text-xs md:text-sm text-muted-foreground">vs 2.3% industry average</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
