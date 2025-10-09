"use client"

import React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag, Headphones, Heart, Send, ImageIcon, Smile, Check, Star, Calendar, Package } from "lucide-react"

interface Message {
  id: number
  type: "bot" | "user"
  content?: string
  buttons?: { text: string; payload: string; icon?: any }[]
  images?: { url: string; title: string; price?: string; badge?: string }[]
  sticker?: string
  timestamp: string
}

interface Scenario {
  id: string
  title: string
  icon: any
  description: string
  color: string
  messages: Message[]
}

const scenarios: Scenario[] = [
  {
    id: "shoes",
    title: "E-Commerce",
    icon: ShoppingBag,
    description: "Customer browses products and completes purchase",
    color: "blue",
    messages: [
      {
        id: 1,
        type: "bot",
        content: "👋 Hey! Welcome to SneakerHub. I'm here to help you find the perfect kicks!",
        timestamp: "2:34 PM",
      },
      {
        id: 2,
        type: "bot",
        content: "What are you looking for today?",
        buttons: [
          { text: "🛍️ Browse Collection", payload: "browse", icon: ShoppingBag },
          { text: "📦 Track My Order", payload: "track", icon: Package },
          { text: "⭐ Best Sellers", payload: "bestsellers", icon: Star },
        ],
        timestamp: "2:34 PM",
      },
      {
        id: 3,
        type: "user",
        content: "🛍️ Browse Collection",
        timestamp: "2:34 PM",
      },
      {
        id: 4,
        type: "bot",
        content: "Awesome! Here are our trending sneakers right now 🔥",
        timestamp: "2:34 PM",
      },
      {
        id: 5,
        type: "bot",
        images: [
          {
            url: "/white-nike-air-max-sneakers.jpg",
            title: "Air Max Pro",
            price: "$129",
            badge: "NEW",
          },
          {
            url: "/black-adidas-ultraboost-sneakers.jpg",
            title: "Ultra Boost",
            price: "$149",
            badge: "POPULAR",
          },
          {
            url: "/red-jordan-basketball-shoes.jpg",
            title: "Jordan Retro",
            price: "$189",
            badge: "LIMITED",
          },
        ],
        timestamp: "2:34 PM",
      },
      {
        id: 6,
        type: "user",
        content: "The Air Max Pro looks amazing! 😍",
        timestamp: "2:35 PM",
      },
      {
        id: 7,
        type: "bot",
        content: "Great taste! The Air Max Pro is one of our bestsellers. What size do you need?",
        buttons: [
          { text: "US 8", payload: "size_8" },
          { text: "US 9", payload: "size_9" },
          { text: "US 10", payload: "size_10" },
          { text: "US 11", payload: "size_11" },
        ],
        timestamp: "2:35 PM",
      },
      {
        id: 8,
        type: "user",
        content: "US 10",
        timestamp: "2:35 PM",
      },
      {
        id: 9,
        type: "bot",
        content: "✅ Perfect! Air Max Pro (US 10) - $129",
        timestamp: "2:35 PM",
      },
      {
        id: 10,
        type: "bot",
        sticker: "🎉",
        timestamp: "2:35 PM",
      },
      {
        id: 11,
        type: "bot",
        content: "Ready to checkout?",
        buttons: [
          { text: "💳 Checkout Now", payload: "checkout" },
          { text: "🛍️ Add More Items", payload: "continue" },
        ],
        timestamp: "2:35 PM",
      },
      {
        id: 12,
        type: "user",
        content: "💳 Checkout Now",
        timestamp: "2:36 PM",
      },
      {
        id: 13,
        type: "bot",
        content: "Awesome! I'll send you a secure payment link. Your order will ship within 24 hours! 📦✨",
        timestamp: "2:36 PM",
      },
    ],
  },
  {
    id: "support",
    title: "Customer Support",
    icon: Headphones,
    description: "Instant help with account and order issues",
    color: "green",
    messages: [
      {
        id: 1,
        type: "bot",
        content: "Hi there! 👋 I'm your support assistant. How can I help you today?",
        timestamp: "3:12 PM",
      },
      {
        id: 2,
        type: "bot",
        buttons: [
          { text: "🔐 Account Issues", payload: "account" },
          { text: "💳 Payment Help", payload: "payment" },
          { text: "📦 Order Status", payload: "shipping" },
          { text: "💬 Talk to Human", payload: "human" },
        ],
        timestamp: "3:12 PM",
      },
      {
        id: 3,
        type: "user",
        content: "🔐 Account Issues",
        timestamp: "3:12 PM",
      },
      {
        id: 4,
        type: "bot",
        content: "I can help with that! What's happening with your account?",
        buttons: [
          { text: "Can't login", payload: "login" },
          { text: "Reset password", payload: "password" },
          { text: "Update email", payload: "email" },
          { text: "Delete account", payload: "delete" },
        ],
        timestamp: "3:12 PM",
      },
      {
        id: 5,
        type: "user",
        content: "Reset password",
        timestamp: "3:13 PM",
      },
      {
        id: 6,
        type: "bot",
        content: "No problem! I'll send a password reset link to your registered email right now. 📧",
        timestamp: "3:13 PM",
      },
      {
        id: 7,
        type: "bot",
        content: "✅ Reset link sent to j***@email.com",
        timestamp: "3:13 PM",
      },
      {
        id: 8,
        type: "bot",
        content: "Check your inbox (and spam folder just in case). The link expires in 1 hour.",
        timestamp: "3:13 PM",
      },
      {
        id: 9,
        type: "user",
        sticker: "👍",
        timestamp: "3:13 PM",
      },
      {
        id: 10,
        type: "bot",
        content: "Is there anything else I can help you with?",
        buttons: [
          { text: "✅ All set, thanks!", payload: "done" },
          { text: "💬 Another issue", payload: "more" },
        ],
        timestamp: "3:13 PM",
      },
    ],
  },
  {
    id: "booking",
    title: "Appointment Booking",
    icon: Calendar,
    description: "Schedule services with visual menus",
    color: "orange",
    messages: [
      {
        id: 1,
        type: "bot",
        content: "✨ Welcome to Luxe Salon! I'm here to help you book the perfect appointment.",
        timestamp: "11:20 AM",
      },
      {
        id: 2,
        type: "bot",
        buttons: [
          { text: "💇 Book Appointment", payload: "book", icon: Calendar },
          { text: "📅 View My Bookings", payload: "schedule" },
          { text: "💰 Pricing", payload: "pricing" },
        ],
        timestamp: "11:20 AM",
      },
      {
        id: 3,
        type: "user",
        content: "💇 Book Appointment",
        timestamp: "11:20 AM",
      },
      {
        id: 4,
        type: "bot",
        content: "Perfect! What service would you like?",
        timestamp: "11:20 AM",
      },
      {
        id: 5,
        type: "bot",
        images: [
          {
            url: "/haircut-salon-styling.jpg",
            title: "Haircut & Style",
            price: "$45",
            badge: "45 min",
          },
          {
            url: "/hair-coloring-salon.png",
            title: "Hair Coloring",
            price: "$85",
            badge: "2 hours",
          },
          {
            url: "/manicure-nails-salon.jpg",
            title: "Manicure",
            price: "$35",
            badge: "30 min",
          },
        ],
        timestamp: "11:20 AM",
      },
      {
        id: 6,
        type: "user",
        content: "Haircut & Style please",
        timestamp: "11:21 AM",
      },
      {
        id: 7,
        type: "bot",
        content: "Great choice! 💇 When would you like to come in?",
        buttons: [
          { text: "Today 2PM", payload: "today_2pm" },
          { text: "Today 4PM", payload: "today_4pm" },
          { text: "Tomorrow 10AM", payload: "tomorrow_10am" },
          { text: "Tomorrow 3PM", payload: "tomorrow_3pm" },
          { text: "📅 Pick another time", payload: "custom" },
        ],
        timestamp: "11:21 AM",
      },
      {
        id: 8,
        type: "user",
        content: "Tomorrow 10AM",
        timestamp: "11:21 AM",
      },
      {
        id: 9,
        type: "bot",
        content: "✅ Booked!",
        timestamp: "11:21 AM",
      },
      {
        id: 10,
        type: "bot",
        content: "📅 Haircut & Style\n⏰ Tomorrow at 10:00 AM\n💰 $45\n📍 123 Main St, Suite 200",
        timestamp: "11:21 AM",
      },
      {
        id: 11,
        type: "bot",
        content: "We'll send you a reminder 1 hour before. See you soon! ✨",
        timestamp: "11:21 AM",
      },
      {
        id: 12,
        type: "user",
        sticker: "❤️",
        timestamp: "11:22 AM",
      },
    ],
  },
]

export function DMAutomationShowcase() {
  const [activeScenario, setActiveScenario] = useState(0)
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    setDisplayedMessages([])
    setIsTyping(false)

    const scenario = scenarios[activeScenario]
    let messageIndex = 0

    const showNextMessage = () => {
      if (messageIndex < scenario.messages.length) {
        const message = scenario.messages[messageIndex]

        if (message.type === "bot") {
          setIsTyping(true)
          setTimeout(
            () => {
              setIsTyping(false)
              setDisplayedMessages((prev) => [...prev, message])
              messageIndex++

              const delay = message.buttons ? 2000 : message.images ? 2500 : message.sticker ? 800 : 1200
              setTimeout(showNextMessage, delay)
            },
            message.sticker ? 500 : 1200,
          )
        } else {
          setDisplayedMessages((prev) => [...prev, message])
          messageIndex++
          setTimeout(showNextMessage, 1000)
        }
      } else {
        setTimeout(() => {
          setDisplayedMessages([])
          messageIndex = 0
          showNextMessage()
        }, 4000)
      }
    }

    const timer = setTimeout(showNextMessage, 800)
    return () => clearTimeout(timer)
  }, [activeScenario])

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return {
          bg: "bg-blue-500/10",
          border: "border-blue-500/30",
          text: "text-blue-400",
          glow: "shadow-blue-500/20",
        }
      case "green":
        return {
          bg: "bg-green-500/10",
          border: "border-green-500/30",
          text: "text-green-400",
          glow: "shadow-green-500/20",
        }
      case "orange":
        return {
          bg: "bg-orange-500/10",
          border: "border-orange-500/30",
          text: "text-orange-400",
          glow: "shadow-orange-500/20",
        }
      default:
        return {
          bg: "bg-muted",
          border: "border-border",
          text: "text-foreground",
          glow: "shadow-muted/20",
        }
    }
  }

  const currentColors = getColorClasses(scenarios[activeScenario].color)

  return (
    <section className="py-32 px-4 relative overflow-hidden bg-background">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
            See <span className="text-blue-400">Automation</span> in Action
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Watch how Yazzil handles real customer conversations with intelligent, context-aware automation that feels
            human
          </p>
        </motion.div>

        {/* Scenario tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {scenarios.map((scenario, index) => {
            const colors = getColorClasses(scenario.color)
            const Icon = scenario.icon
            return (
              <motion.button
                key={scenario.id}
                onClick={() => setActiveScenario(index)}
                className={`px-6 py-4 rounded-2xl font-medium transition-all flex items-center gap-3 ${
                  activeScenario === index
                    ? `${colors.bg} ${colors.text} border-2 ${colors.border} shadow-lg ${colors.glow}`
                    : "bg-card text-muted-foreground hover:bg-card/80 border-2 border-border"
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-5 h-5" />
                {scenario.title}
              </motion.button>
            )
          })}
        </div>

        {/* DM Interface */}
        <motion.div
          key={activeScenario}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          {/* Phone mockup */}
          <div
            className={`bg-card border-2 ${currentColors.border} rounded-3xl overflow-hidden shadow-2xl ${currentColors.glow}`}
          >
            {/* Instagram DM header */}
            <div className="bg-secondary/50 backdrop-blur-sm border-b border-border px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full ${currentColors.bg} flex items-center justify-center ring-2 ${currentColors.border}`}
                >
                  {React.createElement(scenarios[activeScenario].icon, {
                    className: `w-6 h-6 ${currentColors.text}`,
                  })}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{scenarios[activeScenario].title}</h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${currentColors.bg} animate-pulse`} />
                    <p className="text-xs text-muted-foreground">Active now</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-muted rounded-full transition-colors">
                  <Headphones className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Messages area */}
            <div className="bg-background/30 backdrop-blur-sm p-6 h-[650px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
              <AnimatePresence mode="popLayout">
                {displayedMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    className={`mb-6 flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[85%] ${message.type === "user" ? "order-2" : "order-1"}`}>
                      {/* Sticker */}
                      {message.sticker && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          className="text-6xl"
                        >
                          {message.sticker}
                        </motion.div>
                      )}

                      {/* Message bubble */}
                      {message.content && (
                        <div
                          className={`px-5 py-3 rounded-2xl ${
                            message.type === "bot"
                              ? "bg-secondary/80 backdrop-blur-sm text-foreground rounded-tl-sm border border-border"
                              : `${currentColors.bg} ${currentColors.text} rounded-tr-sm border ${currentColors.border}`
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                        </div>
                      )}

                      {/* Button options */}
                      {message.buttons && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="flex flex-wrap gap-2 mt-3"
                        >
                          {message.buttons.map((button, idx) => (
                            <motion.button
                              key={idx}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.4 + idx * 0.1 }}
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-4 py-2.5 bg-muted hover:bg-muted/80 rounded-full text-sm font-medium border border-border transition-all shadow-sm hover:shadow-md"
                            >
                              {button.text}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}

                      {/* Image carousel */}
                      {message.images && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="flex gap-3 mt-3 overflow-x-auto pb-2"
                        >
                          {message.images.map((image, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 + idx * 0.15 }}
                              whileHover={{ scale: 1.05, y: -5 }}
                              className="flex-shrink-0 bg-card border-2 border-border rounded-2xl overflow-hidden cursor-pointer w-48 shadow-lg hover:shadow-xl transition-all"
                            >
                              <div className="relative">
                                <img
                                  src={image.url || "/placeholder.svg"}
                                  alt={image.title}
                                  className="w-full h-40 object-cover"
                                />
                                {image.badge && (
                                  <div
                                    className={`absolute top-2 right-2 px-2 py-1 ${currentColors.bg} ${currentColors.text} text-xs font-bold rounded-full border ${currentColors.border}`}
                                  >
                                    {image.badge}
                                  </div>
                                )}
                              </div>
                              <div className="p-4">
                                <p className="text-sm font-semibold mb-1">{image.title}</p>
                                {image.price && (
                                  <p className={`text-lg font-bold ${currentColors.text}`}>{image.price}</p>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}

                      {/* Timestamp */}
                      <p className="text-xs text-muted-foreground mt-2 px-1">{message.timestamp}</p>
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-start mb-4"
                  >
                    <div className="bg-secondary/80 backdrop-blur-sm px-5 py-4 rounded-2xl rounded-tl-sm border border-border">
                      <div className="flex gap-1.5">
                        <motion.div
                          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8, delay: 0 }}
                          className="w-2.5 h-2.5 bg-muted-foreground rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8, delay: 0.2 }}
                          className="w-2.5 h-2.5 bg-muted-foreground rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8, delay: 0.4 }}
                          className="w-2.5 h-2.5 bg-muted-foreground rounded-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input area */}
            <div className="bg-secondary/50 backdrop-blur-sm border-t border-border px-6 py-4 flex items-center gap-3">
              <button className="p-2 hover:bg-muted rounded-full transition-colors">
                <ImageIcon className="w-5 h-5 text-muted-foreground" />
              </button>
              <button className="p-2 hover:bg-muted rounded-full transition-colors">
                <Smile className="w-5 h-5 text-muted-foreground" />
              </button>
              <div className="flex-1 bg-muted/50 rounded-full px-5 py-3 border border-border">
                <input
                  type="text"
                  placeholder="Message..."
                  className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                  disabled
                />
              </div>
              <button className="p-2 hover:bg-muted rounded-full transition-colors">
                <Heart className="w-5 h-5 text-muted-foreground" />
              </button>
              <button className={`p-2 hover:${currentColors.bg} rounded-full transition-colors`}>
                <Send className={`w-5 h-5 ${currentColors.text}`} />
              </button>
            </div>
          </div>

          {/* Description */}
          <motion.div
            key={`desc-${activeScenario}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-8 space-y-2"
          >
            <p className="text-lg text-muted-foreground">{scenarios[activeScenario].description}</p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-green-400" />
              <span>Fully automated • No coding required • Works 24/7</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
