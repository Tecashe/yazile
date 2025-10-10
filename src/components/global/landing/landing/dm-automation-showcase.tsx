// "use client"

// import React from "react"

// import { useState, useEffect } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { ShoppingBag, Headphones, Heart, Send, ImageIcon, Smile, Check, Star, Calendar, Package } from "lucide-react"

// interface Message {
//   id: number
//   type: "bot" | "user"
//   content?: string
//   buttons?: { text: string; payload: string; icon?: any }[]
//   images?: { url: string; title: string; price?: string; badge?: string }[]
//   sticker?: string
//   timestamp: string
// }

// interface Scenario {
//   id: string
//   title: string
//   icon: any
//   description: string
//   color: string
//   messages: Message[]
// }

// const scenarios: Scenario[] = [
//   {
//     id: "shoes",
//     title: "E-Commerce",
//     icon: ShoppingBag,
//     description: "Customer browses products and completes purchase",
//     color: "blue",
//     messages: [
//       {
//         id: 1,
//         type: "bot",
//         content: "👋 Hey! Welcome to SneakerHub. I'm here to help you find the perfect kicks!",
//         timestamp: "2:34 PM",
//       },
//       {
//         id: 2,
//         type: "bot",
//         content: "What are you looking for today?",
//         buttons: [
//           { text: "🛍️ Browse Collection", payload: "browse", icon: ShoppingBag },
//           { text: "📦 Track My Order", payload: "track", icon: Package },
//           { text: "⭐ Best Sellers", payload: "bestsellers", icon: Star },
//         ],
//         timestamp: "2:34 PM",
//       },
//       {
//         id: 3,
//         type: "user",
//         content: "🛍️ Browse Collection",
//         timestamp: "2:34 PM",
//       },
//       {
//         id: 4,
//         type: "bot",
//         content: "Awesome! Here are our trending sneakers right now 🔥",
//         timestamp: "2:34 PM",
//       },
//       {
//         id: 5,
//         type: "bot",
//         images: [
//           {
//             url: "/white-nike-air-max-sneakers.jpg",
//             title: "Air Max Pro",
//             price: "$129",
//             badge: "NEW",
//           },
//           {
//             url: "/black-adidas-ultraboost-sneakers.jpg",
//             title: "Ultra Boost",
//             price: "$149",
//             badge: "POPULAR",
//           },
//           {
//             url: "/red-jordan-basketball-shoes.jpg",
//             title: "Jordan Retro",
//             price: "$189",
//             badge: "LIMITED",
//           },
//         ],
//         timestamp: "2:34 PM",
//       },
//       {
//         id: 6,
//         type: "user",
//         content: "The Air Max Pro looks amazing! 😍",
//         timestamp: "2:35 PM",
//       },
//       {
//         id: 7,
//         type: "bot",
//         content: "Great taste! The Air Max Pro is one of our bestsellers. What size do you need?",
//         buttons: [
//           { text: "US 8", payload: "size_8" },
//           { text: "US 9", payload: "size_9" },
//           { text: "US 10", payload: "size_10" },
//           { text: "US 11", payload: "size_11" },
//         ],
//         timestamp: "2:35 PM",
//       },
//       {
//         id: 8,
//         type: "user",
//         content: "US 10",
//         timestamp: "2:35 PM",
//       },
//       {
//         id: 9,
//         type: "bot",
//         content: "✅ Perfect! Air Max Pro (US 10) - $129",
//         timestamp: "2:35 PM",
//       },
//       {
//         id: 10,
//         type: "bot",
//         sticker: "🎉",
//         timestamp: "2:35 PM",
//       },
//       {
//         id: 11,
//         type: "bot",
//         content: "Ready to checkout?",
//         buttons: [
//           { text: "💳 Checkout Now", payload: "checkout" },
//           { text: "🛍️ Add More Items", payload: "continue" },
//         ],
//         timestamp: "2:35 PM",
//       },
//       {
//         id: 12,
//         type: "user",
//         content: "💳 Checkout Now",
//         timestamp: "2:36 PM",
//       },
//       {
//         id: 13,
//         type: "bot",
//         content: "Awesome! I'll send you a secure payment link. Your order will ship within 24 hours! 📦✨",
//         timestamp: "2:36 PM",
//       },
//     ],
//   },
//   {
//     id: "support",
//     title: "Customer Support",
//     icon: Headphones,
//     description: "Instant help with account and order issues",
//     color: "green",
//     messages: [
//       {
//         id: 1,
//         type: "bot",
//         content: "Hi there! 👋 I'm your support assistant. How can I help you today?",
//         timestamp: "3:12 PM",
//       },
//       {
//         id: 2,
//         type: "bot",
//         buttons: [
//           { text: "🔐 Account Issues", payload: "account" },
//           { text: "💳 Payment Help", payload: "payment" },
//           { text: "📦 Order Status", payload: "shipping" },
//           { text: "💬 Talk to Human", payload: "human" },
//         ],
//         timestamp: "3:12 PM",
//       },
//       {
//         id: 3,
//         type: "user",
//         content: "🔐 Account Issues",
//         timestamp: "3:12 PM",
//       },
//       {
//         id: 4,
//         type: "bot",
//         content: "I can help with that! What's happening with your account?",
//         buttons: [
//           { text: "Can't login", payload: "login" },
//           { text: "Reset password", payload: "password" },
//           { text: "Update email", payload: "email" },
//           { text: "Delete account", payload: "delete" },
//         ],
//         timestamp: "3:12 PM",
//       },
//       {
//         id: 5,
//         type: "user",
//         content: "Reset password",
//         timestamp: "3:13 PM",
//       },
//       {
//         id: 6,
//         type: "bot",
//         content: "No problem! I'll send a password reset link to your registered email right now. 📧",
//         timestamp: "3:13 PM",
//       },
//       {
//         id: 7,
//         type: "bot",
//         content: "✅ Reset link sent to j***@email.com",
//         timestamp: "3:13 PM",
//       },
//       {
//         id: 8,
//         type: "bot",
//         content: "Check your inbox (and spam folder just in case). The link expires in 1 hour.",
//         timestamp: "3:13 PM",
//       },
//       {
//         id: 9,
//         type: "user",
//         sticker: "👍",
//         timestamp: "3:13 PM",
//       },
//       {
//         id: 10,
//         type: "bot",
//         content: "Is there anything else I can help you with?",
//         buttons: [
//           { text: "✅ All set, thanks!", payload: "done" },
//           { text: "💬 Another issue", payload: "more" },
//         ],
//         timestamp: "3:13 PM",
//       },
//     ],
//   },
//   {
//     id: "booking",
//     title: "Appointment Booking",
//     icon: Calendar,
//     description: "Schedule services with visual menus",
//     color: "orange",
//     messages: [
//       {
//         id: 1,
//         type: "bot",
//         content: "✨ Welcome to Luxe Salon! I'm here to help you book the perfect appointment.",
//         timestamp: "11:20 AM",
//       },
//       {
//         id: 2,
//         type: "bot",
//         buttons: [
//           { text: "💇 Book Appointment", payload: "book", icon: Calendar },
//           { text: "📅 View My Bookings", payload: "schedule" },
//           { text: "💰 Pricing", payload: "pricing" },
//         ],
//         timestamp: "11:20 AM",
//       },
//       {
//         id: 3,
//         type: "user",
//         content: "💇 Book Appointment",
//         timestamp: "11:20 AM",
//       },
//       {
//         id: 4,
//         type: "bot",
//         content: "Perfect! What service would you like?",
//         timestamp: "11:20 AM",
//       },
//       {
//         id: 5,
//         type: "bot",
//         images: [
//           {
//             url: "/haircut-salon-styling.jpg",
//             title: "Haircut & Style",
//             price: "$45",
//             badge: "45 min",
//           },
//           {
//             url: "/hair-coloring-salon.png",
//             title: "Hair Coloring",
//             price: "$85",
//             badge: "2 hours",
//           },
//           {
//             url: "/manicure-nails-salon.jpg",
//             title: "Manicure",
//             price: "$35",
//             badge: "30 min",
//           },
//         ],
//         timestamp: "11:20 AM",
//       },
//       {
//         id: 6,
//         type: "user",
//         content: "Haircut & Style please",
//         timestamp: "11:21 AM",
//       },
//       {
//         id: 7,
//         type: "bot",
//         content: "Great choice! 💇 When would you like to come in?",
//         buttons: [
//           { text: "Today 2PM", payload: "today_2pm" },
//           { text: "Today 4PM", payload: "today_4pm" },
//           { text: "Tomorrow 10AM", payload: "tomorrow_10am" },
//           { text: "Tomorrow 3PM", payload: "tomorrow_3pm" },
//           { text: "📅 Pick another time", payload: "custom" },
//         ],
//         timestamp: "11:21 AM",
//       },
//       {
//         id: 8,
//         type: "user",
//         content: "Tomorrow 10AM",
//         timestamp: "11:21 AM",
//       },
//       {
//         id: 9,
//         type: "bot",
//         content: "✅ Booked!",
//         timestamp: "11:21 AM",
//       },
//       {
//         id: 10,
//         type: "bot",
//         content: "📅 Haircut & Style\n⏰ Tomorrow at 10:00 AM\n💰 $45\n📍 123 Main St, Suite 200",
//         timestamp: "11:21 AM",
//       },
//       {
//         id: 11,
//         type: "bot",
//         content: "We'll send you a reminder 1 hour before. See you soon! ✨",
//         timestamp: "11:21 AM",
//       },
//       {
//         id: 12,
//         type: "user",
//         sticker: "❤️",
//         timestamp: "11:22 AM",
//       },
//     ],
//   },
// ]

// export function DMAutomationShowcase() {
//   const [activeScenario, setActiveScenario] = useState(0)
//   const [displayedMessages, setDisplayedMessages] = useState<Message[]>([])
//   const [isTyping, setIsTyping] = useState(false)

//   useEffect(() => {
//     setDisplayedMessages([])
//     setIsTyping(false)

//     const scenario = scenarios[activeScenario]
//     let messageIndex = 0

//     const showNextMessage = () => {
//       if (messageIndex < scenario.messages.length) {
//         const message = scenario.messages[messageIndex]

//         if (message.type === "bot") {
//           setIsTyping(true)
//           setTimeout(
//             () => {
//               setIsTyping(false)
//               setDisplayedMessages((prev) => [...prev, message])
//               messageIndex++

//               const delay = message.buttons ? 2000 : message.images ? 2500 : message.sticker ? 800 : 1200
//               setTimeout(showNextMessage, delay)
//             },
//             message.sticker ? 500 : 1200,
//           )
//         } else {
//           setDisplayedMessages((prev) => [...prev, message])
//           messageIndex++
//           setTimeout(showNextMessage, 1000)
//         }
//       } else {
//         setTimeout(() => {
//           setDisplayedMessages([])
//           messageIndex = 0
//           showNextMessage()
//         }, 4000)
//       }
//     }

//     const timer = setTimeout(showNextMessage, 800)
//     return () => clearTimeout(timer)
//   }, [activeScenario])

//   const getColorClasses = (color: string) => {
//     switch (color) {
//       case "blue":
//         return {
//           bg: "bg-blue-500/10",
//           border: "border-blue-500/30",
//           text: "text-blue-400",
//           glow: "shadow-blue-500/20",
//         }
//       case "green":
//         return {
//           bg: "bg-green-500/10",
//           border: "border-green-500/30",
//           text: "text-green-400",
//           glow: "shadow-green-500/20",
//         }
//       case "orange":
//         return {
//           bg: "bg-orange-500/10",
//           border: "border-orange-500/30",
//           text: "text-orange-400",
//           glow: "shadow-orange-500/20",
//         }
//       default:
//         return {
//           bg: "bg-muted",
//           border: "border-border",
//           text: "text-foreground",
//           glow: "shadow-muted/20",
//         }
//     }
//   }

//   const currentColors = getColorClasses(scenarios[activeScenario].color)

//   return (
//     <section className="py-32 px-4 relative overflow-hidden bg-background">
//       {/* Background elements */}
//       <div className="absolute inset-0 opacity-30">
//         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
//         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
//       </div>

//       <div className="max-w-7xl mx-auto relative z-10">
//         {/* Section header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="text-center mb-16"
//         >
//           <h2 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
//             See <span className="text-blue-400">Automation</span> in Action
//           </h2>
//           <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
//             Watch how Yazzil handles real customer conversations with intelligent, context-aware automation that feels
//             human
//           </p>
//         </motion.div>

//         {/* Scenario tabs */}
//         <div className="flex flex-wrap justify-center gap-4 mb-16">
//           {scenarios.map((scenario, index) => {
//             const colors = getColorClasses(scenario.color)
//             const Icon = scenario.icon
//             return (
//               <motion.button
//                 key={scenario.id}
//                 onClick={() => setActiveScenario(index)}
//                 className={`px-6 py-4 rounded-2xl font-medium transition-all flex items-center gap-3 ${
//                   activeScenario === index
//                     ? `${colors.bg} ${colors.text} border-2 ${colors.border} shadow-lg ${colors.glow}`
//                     : "bg-card text-muted-foreground hover:bg-card/80 border-2 border-border"
//                 }`}
//                 whileHover={{ scale: 1.05, y: -2 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <Icon className="w-5 h-5" />
//                 {scenario.title}
//               </motion.button>
//             )
//           })}
//         </div>

//         {/* DM Interface */}
//         <motion.div
//           key={activeScenario}
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.4 }}
//           className="max-w-3xl mx-auto"
//         >
//           {/* Phone mockup */}
//           <div
//             className={`bg-card border-2 ${currentColors.border} rounded-3xl overflow-hidden shadow-2xl ${currentColors.glow}`}
//           >
//             {/* Instagram DM header */}
//             <div className="bg-secondary/50 backdrop-blur-sm border-b border-border px-6 py-5 flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div
//                   className={`w-12 h-12 rounded-full ${currentColors.bg} flex items-center justify-center ring-2 ${currentColors.border}`}
//                 >
//                   {React.createElement(scenarios[activeScenario].icon, {
//                     className: `w-6 h-6 ${currentColors.text}`,
//                   })}
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-lg">{scenarios[activeScenario].title}</h3>
//                   <div className="flex items-center gap-2">
//                     <div className={`w-2 h-2 rounded-full ${currentColors.bg} animate-pulse`} />
//                     <p className="text-xs text-muted-foreground">Active now</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex gap-2">
//                 <button className="p-2 hover:bg-muted rounded-full transition-colors">
//                   <Headphones className="w-5 h-5 text-muted-foreground" />
//                 </button>
//               </div>
//             </div>

//             {/* Messages area */}
//             <div className="bg-background/30 backdrop-blur-sm p-6 h-[650px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
//               <AnimatePresence mode="popLayout">
//                 {displayedMessages.map((message) => (
//                   <motion.div
//                     key={message.id}
//                     initial={{ opacity: 0, y: 20, scale: 0.9 }}
//                     animate={{ opacity: 1, y: 0, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.9 }}
//                     transition={{ type: "spring", stiffness: 500, damping: 35 }}
//                     className={`mb-6 flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
//                   >
//                     <div className={`max-w-[85%] ${message.type === "user" ? "order-2" : "order-1"}`}>
//                       {/* Sticker */}
//                       {message.sticker && (
//                         <motion.div
//                           initial={{ scale: 0 }}
//                           animate={{ scale: 1 }}
//                           transition={{ type: "spring", stiffness: 400, damping: 15 }}
//                           className="text-6xl"
//                         >
//                           {message.sticker}
//                         </motion.div>
//                       )}

//                       {/* Message bubble */}
//                       {message.content && (
//                         <div
//                           className={`px-5 py-3 rounded-2xl ${
//                             message.type === "bot"
//                               ? "bg-secondary/80 backdrop-blur-sm text-foreground rounded-tl-sm border border-border"
//                               : `${currentColors.bg} ${currentColors.text} rounded-tr-sm border ${currentColors.border}`
//                           }`}
//                         >
//                           <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
//                         </div>
//                       )}

//                       {/* Button options */}
//                       {message.buttons && (
//                         <motion.div
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ delay: 0.3 }}
//                           className="flex flex-wrap gap-2 mt-3"
//                         >
//                           {message.buttons.map((button, idx) => (
//                             <motion.button
//                               key={idx}
//                               initial={{ opacity: 0, scale: 0.8 }}
//                               animate={{ opacity: 1, scale: 1 }}
//                               transition={{ delay: 0.4 + idx * 0.1 }}
//                               whileHover={{ scale: 1.05, y: -2 }}
//                               whileTap={{ scale: 0.95 }}
//                               className="px-4 py-2.5 bg-muted hover:bg-muted/80 rounded-full text-sm font-medium border border-border transition-all shadow-sm hover:shadow-md"
//                             >
//                               {button.text}
//                             </motion.button>
//                           ))}
//                         </motion.div>
//                       )}

//                       {/* Image carousel */}
//                       {message.images && (
//                         <motion.div
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ delay: 0.3 }}
//                           className="flex gap-3 mt-3 overflow-x-auto pb-2"
//                         >
//                           {message.images.map((image, idx) => (
//                             <motion.div
//                               key={idx}
//                               initial={{ opacity: 0, x: 20 }}
//                               animate={{ opacity: 1, x: 0 }}
//                               transition={{ delay: 0.4 + idx * 0.15 }}
//                               whileHover={{ scale: 1.05, y: -5 }}
//                               className="flex-shrink-0 bg-card border-2 border-border rounded-2xl overflow-hidden cursor-pointer w-48 shadow-lg hover:shadow-xl transition-all"
//                             >
//                               <div className="relative">
//                                 <img
//                                   src={image.url || "/placeholder.svg"}
//                                   alt={image.title}
//                                   className="w-full h-40 object-cover"
//                                 />
//                                 {image.badge && (
//                                   <div
//                                     className={`absolute top-2 right-2 px-2 py-1 ${currentColors.bg} ${currentColors.text} text-xs font-bold rounded-full border ${currentColors.border}`}
//                                   >
//                                     {image.badge}
//                                   </div>
//                                 )}
//                               </div>
//                               <div className="p-4">
//                                 <p className="text-sm font-semibold mb-1">{image.title}</p>
//                                 {image.price && (
//                                   <p className={`text-lg font-bold ${currentColors.text}`}>{image.price}</p>
//                                 )}
//                               </div>
//                             </motion.div>
//                           ))}
//                         </motion.div>
//                       )}

//                       {/* Timestamp */}
//                       <p className="text-xs text-muted-foreground mt-2 px-1">{message.timestamp}</p>
//                     </div>
//                   </motion.div>
//                 ))}

//                 {/* Typing indicator */}
//                 {isTyping && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0 }}
//                     className="flex justify-start mb-4"
//                   >
//                     <div className="bg-secondary/80 backdrop-blur-sm px-5 py-4 rounded-2xl rounded-tl-sm border border-border">
//                       <div className="flex gap-1.5">
//                         <motion.div
//                           animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
//                           transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8, delay: 0 }}
//                           className="w-2.5 h-2.5 bg-muted-foreground rounded-full"
//                         />
//                         <motion.div
//                           animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
//                           transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8, delay: 0.2 }}
//                           className="w-2.5 h-2.5 bg-muted-foreground rounded-full"
//                         />
//                         <motion.div
//                           animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
//                           transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8, delay: 0.4 }}
//                           className="w-2.5 h-2.5 bg-muted-foreground rounded-full"
//                         />
//                       </div>
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>

//             {/* Input area */}
//             <div className="bg-secondary/50 backdrop-blur-sm border-t border-border px-6 py-4 flex items-center gap-3">
//               <button className="p-2 hover:bg-muted rounded-full transition-colors">
//                 <ImageIcon className="w-5 h-5 text-muted-foreground" />
//               </button>
//               <button className="p-2 hover:bg-muted rounded-full transition-colors">
//                 <Smile className="w-5 h-5 text-muted-foreground" />
//               </button>
//               <div className="flex-1 bg-muted/50 rounded-full px-5 py-3 border border-border">
//                 <input
//                   type="text"
//                   placeholder="Message..."
//                   className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground"
//                   disabled
//                 />
//               </div>
//               <button className="p-2 hover:bg-muted rounded-full transition-colors">
//                 <Heart className="w-5 h-5 text-muted-foreground" />
//               </button>
//               <button className={`p-2 hover:${currentColors.bg} rounded-full transition-colors`}>
//                 <Send className={`w-5 h-5 ${currentColors.text}`} />
//               </button>
//             </div>
//           </div>

//           {/* Description */}
//           <motion.div
//             key={`desc-${activeScenario}`}
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-center mt-8 space-y-2"
//           >
//             <p className="text-lg text-muted-foreground">{scenarios[activeScenario].description}</p>
//             <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
//               <Check className="w-4 h-4 text-green-400" />
//               <span>Fully automated • No coding required • Works 24/7</span>
//             </div>
//           </motion.div>
//         </motion.div>
//       </div>
//     </section>
//   )
// }


// "use client"

// import React from "react"
// import { useState, useEffect, useRef } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { ShoppingBag, Heart, Send, ImageIcon, Smile, Check, Star, Zap, TrendingUp, Sparkles, Play } from "lucide-react"

// interface Message {
//   id: number
//   type: "bot" | "user" | "story-reply"
//   content?: string
//   buttons?: { text: string; payload: string }[]
//   images?: { url: string; title: string; price?: string; badge?: string }[]
//   sticker?: string
//   storyImage?: string
//   timestamp: string
// }

// interface Scenario {
//   id: string
//   title: string
//   icon: any
//   color: string
//   messages: Message[]
// }

// const scenarios: Scenario[] = [
//   {
//     id: "story-reply",
//     title: "Story Reply Automation",
//     icon: Play,
//     color: "blue",
//     messages: [
//       {
//         id: 1,
//         type: "story-reply",
//         storyImage: "/white-nike-air-max-sneakers.jpg",
//         content: "🔥 These are fire!",
//         timestamp: "2:34 PM",
//       },
//       {
//         id: 2,
//         type: "bot",
//         content: "Thanks for the love! 😊 Want to grab these Air Max Pros?",
//         timestamp: "2:34 PM",
//       },
//       {
//         id: 3,
//         type: "bot",
//         buttons: [
//           { text: "🛍️ Shop Now", payload: "shop" },
//           { text: "💰 See Price", payload: "price" },
//         ],
//         timestamp: "2:34 PM",
//       },
//       {
//         id: 4,
//         type: "user",
//         content: "💰 See Price",
//         timestamp: "2:35 PM",
//       },
//       {
//         id: 5,
//         type: "bot",
//         content: "Air Max Pro - Only $129! 🎉",
//         timestamp: "2:35 PM",
//       },
//       {
//         id: 6,
//         type: "user",
//         sticker: "😍",
//         timestamp: "2:35 PM",
//       },
//     ],
//   },
//   {
//     id: "shoes",
//     title: "Product Shopping",
//     icon: ShoppingBag,
//     color: "green",
//     messages: [
//       {
//         id: 1,
//         type: "user",
//         content: "Hey! Looking for running shoes",
//         timestamp: "3:12 PM",
//       },
//       {
//         id: 2,
//         type: "bot",
//         content: "Perfect timing! Check these out 👟",
//         timestamp: "3:12 PM",
//       },
//       {
//         id: 3,
//         type: "bot",
//         images: [
//           {
//             url: "/white-nike-air-max-sneakers.jpg",
//             title: "Air Max Pro",
//             price: "$129",
//             badge: "NEW",
//           },
//           {
//             url: "/black-adidas-ultraboost-sneakers.jpg",
//             title: "Ultra Boost",
//             price: "$149",
//             badge: "HOT",
//           },
//         ],
//         timestamp: "3:12 PM",
//       },
//       {
//         id: 4,
//         type: "user",
//         content: "Love the Air Max! What sizes?",
//         timestamp: "3:13 PM",
//       },
//       {
//         id: 5,
//         type: "bot",
//         content: "We have 8-12 in stock!",
//         buttons: [
//           { text: "US 9", payload: "size_9" },
//           { text: "US 10", payload: "size_10" },
//           { text: "US 11", payload: "size_11" },
//         ],
//         timestamp: "3:13 PM",
//       },
//       {
//         id: 6,
//         type: "user",
//         content: "US 10",
//         timestamp: "3:13 PM",
//       },
//       {
//         id: 7,
//         type: "bot",
//         content: "✅ Added to cart! Ready to checkout?",
//         timestamp: "3:13 PM",
//       },
//     ],
//   },
//   {
//     id: "support",
//     title: "Customer Support",
//     icon: Star,
//     color: "orange",
//     messages: [
//       {
//         id: 1,
//         type: "user",
//         content: "Need help with my order",
//         timestamp: "4:20 PM",
//       },
//       {
//         id: 2,
//         type: "bot",
//         content: "I'm here to help! What's your order number?",
//         timestamp: "4:20 PM",
//       },
//       {
//         id: 3,
//         type: "user",
//         content: "#12345",
//         timestamp: "4:20 PM",
//       },
//       {
//         id: 4,
//         type: "bot",
//         content: "Found it! Your order shipped yesterday 📦",
//         timestamp: "4:20 PM",
//       },
//       {
//         id: 5,
//         type: "bot",
//         buttons: [
//           { text: "📍 Track Package", payload: "track" },
//           { text: "📅 Delivery Date", payload: "date" },
//         ],
//         timestamp: "4:20 PM",
//       },
//       {
//         id: 6,
//         type: "user",
//         content: "📍 Track Package",
//         timestamp: "4:21 PM",
//       },
//       {
//         id: 7,
//         type: "bot",
//         content: "Your package arrives tomorrow by 5 PM! 🎉",
//         timestamp: "4:21 PM",
//       },
//       {
//         id: 8,
//         type: "user",
//         sticker: "🙏",
//         timestamp: "4:21 PM",
//       },
//     ],
//   },
// ]

// export function DMAutomationShowcase() {
//   const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0)
//   const [displayedMessages, setDisplayedMessages] = useState<Message[]>([])
//   const [isTyping, setIsTyping] = useState(false)
//   const messagesContainerRef = useRef<HTMLDivElement>(null)
//   const messageIndexRef = useRef(0)

//   useEffect(() => {
//     if (messagesContainerRef.current) {
//       messagesContainerRef.current.scrollTo({
//         top: messagesContainerRef.current.scrollHeight,
//         behavior: "smooth",
//       })
//     }
//   }, [displayedMessages, isTyping])

//   useEffect(() => {
//     setDisplayedMessages([])
//     setIsTyping(false)
//     messageIndexRef.current = 0

//     const scenario = scenarios[currentScenarioIndex]

//     const showNextMessage = () => {
//       if (messageIndexRef.current < scenario.messages.length) {
//         const message = scenario.messages[messageIndexRef.current]

//         if (message.type === "bot" && !message.sticker) {
//           setIsTyping(true)
//           setTimeout(() => {
//             setIsTyping(false)
//             setDisplayedMessages((prev) => [...prev, message])
//             messageIndexRef.current++
//             setTimeout(showNextMessage, message.buttons ? 1500 : message.images ? 2000 : 800)
//           }, 1200)
//         } else {
//           // User messages and stickers appear immediately
//           setDisplayedMessages((prev) => [...prev, message])
//           messageIndexRef.current++
//           setTimeout(showNextMessage, message.sticker ? 600 : 1000)
//         }
//       } else {
//         setTimeout(() => {
//           setCurrentScenarioIndex((prev) => (prev + 1) % scenarios.length)
//         }, 3000)
//       }
//     }

//     const timer = setTimeout(showNextMessage, 500)
//     return () => clearTimeout(timer)
//   }, [currentScenarioIndex])

//   const getColorClasses = (color: string) => {
//     switch (color) {
//       case "blue":
//         return { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" }
//       case "green":
//         return { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30" }
//       case "orange":
//         return { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/30" }
//       default:
//         return { bg: "bg-neutral-800", text: "text-neutral-300", border: "border-neutral-700" }
//     }
//   }

//   const currentColors = getColorClasses(scenarios[currentScenarioIndex].color)

//   return (
//     <section className="py-32 px-4 relative overflow-hidden bg-neutral-950">
//       <div className="absolute inset-0 opacity-30">
//         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
//         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl" />
//       </div>

//       <div className="max-w-5xl mx-auto relative z-10">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="text-center mb-16"
//         >
//           <motion.div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-500/10 border border-blue-500/30 rounded-full mb-6">
//             <Sparkles className="w-5 h-5 text-blue-400" />
//             <span className="text-blue-400 font-semibold">Live Automation Demo</span>
//           </motion.div>

//           <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white">
//             Watch <span className="text-blue-400">Yazzil</span> in Action
//           </h2>
//           <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
//             Real Instagram DM automation handling customers, support, and story replies
//           </p>
//         </motion.div>

//         <motion.div
//           key={currentScenarioIndex}
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl"
//         >
//           {/* Header */}
//           <div className="bg-neutral-900 border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className={`w-12 h-12 rounded-full ${currentColors.bg} flex items-center justify-center`}>
//                 {React.createElement(scenarios[currentScenarioIndex].icon, {
//                   className: `w-6 h-6 ${currentColors.text}`,
//                 })}
//               </div>
//               <div>
//                 <h3 className="font-semibold text-white">{scenarios[currentScenarioIndex].title}</h3>
//                 <div className="flex items-center gap-2">
//                   <div className="w-2 h-2 rounded-full bg-green-400" />
//                   <p className="text-xs text-green-400">Active</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Messages */}
//           <div
//             ref={messagesContainerRef}
//             className="bg-neutral-950 p-6 h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent"
//           >
//             <AnimatePresence mode="popLayout">
//               {displayedMessages.map((message) => (
//                 <motion.div
//                   key={message.id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className={`mb-4 flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
//                 >
//                   <div className="max-w-[80%]">
//                     {message.type === "story-reply" && message.storyImage && (
//                       <div className="mb-2">
//                         <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
//                           <Play className="w-3 h-3" />
//                           <span>Replied to your story</span>
//                         </div>
//                         <img
//                           src={message.storyImage || "/placeholder.svg"}
//                           alt="Story"
//                           className="w-20 h-32 object-cover rounded-lg border-2 border-neutral-700 mb-2"
//                         />
//                       </div>
//                     )}

//                     {message.sticker && (
//                       <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-6xl">
//                         {message.sticker}
//                       </motion.div>
//                     )}

//                     {message.content && (
//                       <div
//                         className={`px-4 py-2.5 rounded-2xl ${
//                           message.type === "bot"
//                             ? "bg-neutral-800 text-white rounded-tl-sm"
//                             : `${currentColors.bg} ${currentColors.text} rounded-tr-sm border ${currentColors.border}`
//                         }`}
//                       >
//                         <p className="text-sm">{message.content}</p>
//                       </div>
//                     )}

//                     {message.buttons && (
//                       <div className="flex flex-wrap gap-2 mt-2">
//                         {message.buttons.map((button, idx) => (
//                           <motion.button
//                             key={idx}
//                             initial={{ opacity: 0, scale: 0.8 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             transition={{ delay: idx * 0.1 }}
//                             className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-full text-sm text-white border border-neutral-700"
//                           >
//                             {button.text}
//                           </motion.button>
//                         ))}
//                       </div>
//                     )}

//                     {message.images && (
//                       <div className="flex gap-3 mt-2 overflow-x-auto">
//                         {message.images.map((image, idx) => (
//                           <motion.div
//                             key={idx}
//                             initial={{ opacity: 0, x: 20 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ delay: idx * 0.15 }}
//                             className="flex-shrink-0 bg-neutral-800 rounded-xl overflow-hidden w-44 border border-neutral-700"
//                           >
//                             <div className="relative">
//                               <img
//                                 src={image.url || "/placeholder.svg"}
//                                 alt={image.title}
//                                 className="w-full h-36 object-cover"
//                               />
//                               {image.badge && (
//                                 <div
//                                   className={`absolute top-2 right-2 px-2 py-1 ${currentColors.bg} ${currentColors.text} text-xs font-bold rounded-full`}
//                                 >
//                                   {image.badge}
//                                 </div>
//                               )}
//                             </div>
//                             <div className="p-3">
//                               <p className="text-xs font-semibold text-white">{image.title}</p>
//                               {image.price && (
//                                 <p className={`text-sm font-bold ${currentColors.text}`}>{image.price}</p>
//                               )}
//                             </div>
//                           </motion.div>
//                         ))}
//                       </div>
//                     )}

//                     <p className="text-xs text-neutral-600 mt-1">{message.timestamp}</p>
//                   </div>
//                 </motion.div>
//               ))}

//               {isTyping && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0 }}
//                   className="flex justify-start mb-4"
//                 >
//                   <div className="bg-neutral-800 px-5 py-3 rounded-2xl rounded-tl-sm">
//                     <div className="flex gap-1.5">
//                       {[0, 1, 2].map((i) => (
//                         <motion.div
//                           key={i}
//                           animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
//                           transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: i * 0.2 }}
//                           className="w-2 h-2 bg-neutral-600 rounded-full"
//                         />
//                       ))}
//                     </div>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* Input bar */}
//           <div className="bg-neutral-900 border-t border-neutral-800 px-6 py-3 flex items-center gap-3">
//             <ImageIcon className="w-5 h-5 text-neutral-600" />
//             <Smile className="w-5 h-5 text-neutral-600" />
//             <div className="flex-1 bg-neutral-800 rounded-full px-4 py-2">
//               <input
//                 type="text"
//                 placeholder="Message..."
//                 className="w-full bg-transparent outline-none text-sm text-white placeholder:text-neutral-600"
//                 disabled
//               />
//             </div>
//             <Heart className="w-5 h-5 text-neutral-600" />
//             <Send className={`w-5 h-5 ${currentColors.text}`} />
//           </div>
//         </motion.div>

//         {/* Stats */}
//         <motion.div className="grid grid-cols-3 gap-4 mt-8">
//           {[
//             { icon: Zap, label: "Response Time", value: "< 1s" },
//             { icon: TrendingUp, label: "Conversion", value: "+300%" },
//             { icon: Check, label: "Accuracy", value: "99.9%" },
//           ].map((stat, i) => (
//             <motion.div
//               key={i}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 + i * 0.1 }}
//               className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-center"
//             >
//               <stat.icon className={`w-6 h-6 ${currentColors.text} mx-auto mb-2`} />
//               <div className={`text-xl font-bold ${currentColors.text}`}>{stat.value}</div>
//               <div className="text-xs text-neutral-500">{stat.label}</div>
//             </motion.div>
//           ))}
//         </motion.div>
//       </div>
//     </section>
//   )
// }

"use client"

import React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShoppingBag,
  Heart,
  Send,
  ImageIcon,
  Smile,
  Check,
  Star,
  Zap,
  TrendingUp,
  Sparkles,
  Play,
  MousePointer2,
} from "lucide-react"

interface Message {
  id: number
  type: "bot" | "user" | "story-reply"
  content?: string
  buttons?: { text: string; payload: string }[]
  images?: { url: string; title: string; price?: string; badge?: string }[]
  sticker?: string
  storyImage?: string
  timestamp: string
}

interface Scenario {
  id: string
  title: string
  icon: any
  color: string
  messages: Message[]
}

const scenarios: Scenario[] = [
  {
    id: "story-reply",
    title: "Story Reply Automation",
    icon: Play,
    color: "blue",
    messages: [
      {
        id: 1,
        type: "story-reply",
        storyImage: "/white-nike-air-max-sneakers.jpg",
        content: "🔥 These are fire!",
        timestamp: "2:34 PM",
      },
      {
        id: 2,
        type: "bot",
        content: "Thanks for the love! 😊 Want to grab these Air Max Pros?",
        timestamp: "2:34 PM",
      },
      {
        id: 3,
        type: "bot",
        buttons: [
          { text: "🛍️ Shop Now", payload: "shop" },
          { text: "💰 See Price", payload: "price" },
        ],
        timestamp: "2:34 PM",
      },
      {
        id: 4,
        type: "user",
        content: "💰 See Price",
        timestamp: "2:35 PM",
      },
      {
        id: 5,
        type: "bot",
        content: "Air Max Pro - Only $129! 🎉 Free shipping on orders over $100 ✨",
        timestamp: "2:35 PM",
      },
      {
        id: 6,
        type: "user",
        sticker: "😍",
        timestamp: "2:35 PM",
      },
    ],
  },
  {
    id: "shoes",
    title: "Product Shopping",
    icon: ShoppingBag,
    color: "green",
    messages: [
      {
        id: 1,
        type: "user",
        content: "Hey! Looking for running shoes 👟",
        timestamp: "3:12 PM",
      },
      {
        id: 2,
        type: "bot",
        content: "Perfect timing! Check out our bestsellers 🔥",
        timestamp: "3:12 PM",
      },
      {
        id: 3,
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
            badge: "HOT",
          },
          {
            url: "/red-jordan-basketball-shoes.jpg",
            title: "Jordan Retro",
            price: "$189",
            badge: "⭐",
          },
        ],
        timestamp: "3:12 PM",
      },
      {
        id: 4,
        type: "user",
        content: "Love the Air Max! 😍 What sizes?",
        timestamp: "3:13 PM",
      },
      {
        id: 5,
        type: "bot",
        content: "We have sizes 8-12 in stock! 📦",
        buttons: [
          { text: "US 9", payload: "size_9" },
          { text: "US 10", payload: "size_10" },
          { text: "US 11", payload: "size_11" },
        ],
        timestamp: "3:13 PM",
      },
      {
        id: 6,
        type: "user",
        content: "US 10",
        timestamp: "3:13 PM",
      },
      {
        id: 7,
        type: "bot",
        content: "✅ Added to cart! Ready to checkout? 🛒",
        timestamp: "3:13 PM",
      },
    ],
  },
  {
    id: "support",
    title: "Customer Support",
    icon: Star,
    color: "orange",
    messages: [
      {
        id: 1,
        type: "user",
        content: "Need help with my order 📦",
        timestamp: "4:20 PM",
      },
      {
        id: 2,
        type: "bot",
        content: "I'm here to help! 👋 What's your order number?",
        timestamp: "4:20 PM",
      },
      {
        id: 3,
        type: "user",
        content: "#12345",
        timestamp: "4:20 PM",
      },
      {
        id: 4,
        type: "bot",
        content: "Found it! 🎉 Your order shipped yesterday",
        timestamp: "4:20 PM",
      },
      {
        id: 5,
        type: "bot",
        buttons: [
          { text: "📍 Track Package", payload: "track" },
          { text: "📅 Delivery Date", payload: "date" },
        ],
        timestamp: "4:20 PM",
      },
      {
        id: 6,
        type: "user",
        content: "📍 Track Package",
        timestamp: "4:21 PM",
      },
      {
        id: 7,
        type: "bot",
        content: "Your package arrives tomorrow by 5 PM! 🚚💨",
        timestamp: "4:21 PM",
      },
      {
        id: 8,
        type: "user",
        sticker: "🙏",
        timestamp: "4:21 PM",
      },
    ],
  },
]

export function DMAutomationShowcase() {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0)
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0, visible: false })
  const [clickingButton, setClickingButton] = useState<number | null>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const messageIndexRef = useRef(0)
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [displayedMessages, isTyping])

  useEffect(() => {
    setDisplayedMessages([])
    setIsTyping(false)
    messageIndexRef.current = 0
    buttonRefs.current = []

    const scenario = scenarios[currentScenarioIndex]

    const showNextMessage = () => {
      if (messageIndexRef.current < scenario.messages.length) {
        const message = scenario.messages[messageIndexRef.current]

        if (message.type === "bot" && !message.sticker) {
          setIsTyping(true)
          setTimeout(() => {
            setIsTyping(false)
            setDisplayedMessages((prev) => [...prev, message])
            messageIndexRef.current++
            setTimeout(showNextMessage, message.buttons ? 1800 : message.images ? 2200 : 1000)
          }, 1500)
        } else if (message.type === "user" && !message.sticker) {
          const prevMessage = scenario.messages[messageIndexRef.current - 1]
          if (prevMessage?.buttons) {
            const buttonIndex = prevMessage.buttons.findIndex((btn) => btn.text === message.content)
            if (buttonIndex !== -1 && buttonRefs.current[buttonIndex]) {
              const button = buttonRefs.current[buttonIndex]
              const rect = button?.getBoundingClientRect()
              if (rect) {
                setCursorPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, visible: true })
                setTimeout(() => {
                  setClickingButton(buttonIndex)
                  setTimeout(() => {
                    setClickingButton(null)
                    setCursorPosition((prev) => ({ ...prev, visible: false }))
                    setDisplayedMessages((prev) => [...prev, message])
                    messageIndexRef.current++
                    setTimeout(showNextMessage, 800)
                  }, 300)
                }, 600)
                return
              }
            }
          }
          setDisplayedMessages((prev) => [...prev, message])
          messageIndexRef.current++
          setTimeout(showNextMessage, 1000)
        } else {
          setDisplayedMessages((prev) => [...prev, message])
          messageIndexRef.current++
          setTimeout(showNextMessage, message.sticker ? 700 : 1000)
        }
      } else {
        setTimeout(() => {
          setCurrentScenarioIndex((prev) => (prev + 1) % scenarios.length)
        }, 3000)
      }
    }

    const timer = setTimeout(showNextMessage, 800)
    return () => clearTimeout(timer)
  }, [currentScenarioIndex])

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return {
          bg: "bg-blue-500/10",
          text: "text-blue-400",
          border: "border-blue-500/30",
          gradient: "from-blue-500 to-cyan-500",
        }
      case "green":
        return {
          bg: "bg-green-500/10",
          text: "text-green-400",
          border: "border-green-500/30",
          gradient: "from-green-500 to-emerald-500",
        }
      case "orange":
        return {
          bg: "bg-orange-500/10",
          text: "text-orange-400",
          border: "border-orange-500/30",
          gradient: "from-orange-500 to-amber-500",
        }
      default:
        return {
          bg: "bg-neutral-800",
          text: "text-neutral-300",
          border: "border-neutral-700",
          gradient: "from-neutral-500 to-neutral-600",
        }
    }
  }

  const currentColors = getColorClasses(scenarios[currentScenarioIndex].color)

  return (
    <section className="py-32 px-4 relative overflow-hidden bg-neutral-950">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-green-500/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            className={`inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r ${currentColors.gradient} bg-opacity-10 border ${currentColors.border} rounded-full mb-6`}
          >
            <Sparkles className={`w-5 h-5 ${currentColors.text}`} />
            <span className={`${currentColors.text} font-semibold`}>Live Automation Demo</span>
          </motion.div>

          <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            Watch{" "}
            <span className={`bg-gradient-to-r ${currentColors.gradient} bg-clip-text text-transparent`}>Yazzil</span>{" "}
            in Action
          </h2>
          <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
            Real Instagram DM automation handling customers, support, and story replies
          </p>
        </motion.div>

        <motion.div
          key={currentScenarioIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl relative"
        >
          <AnimatePresence>
            {cursorPosition.visible && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, x: cursorPosition.x - 12, y: cursorPosition.y - 12 }}
                exit={{ scale: 0, opacity: 0 }}
                className="fixed pointer-events-none z-50"
              >
                <MousePointer2 className={`w-6 h-6 ${currentColors.text} drop-shadow-lg`} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <div className="bg-neutral-900 border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full bg-gradient-to-br ${currentColors.gradient} flex items-center justify-center`}
              >
                {React.createElement(scenarios[currentScenarioIndex].icon, {
                  className: "w-6 h-6 text-white",
                })}
              </div>
              <div>
                <h3 className="font-semibold text-white">{scenarios[currentScenarioIndex].title}</h3>
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                    className="w-2 h-2 rounded-full bg-green-400"
                  />
                  <p className="text-xs text-green-400">Active now</p>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={messagesContainerRef}
            className="bg-neutral-950 p-6 h-[650px] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent"
          >
            <AnimatePresence mode="popLayout">
              {displayedMessages.map((message, msgIndex) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={`mb-6 flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className="max-w-[85%]">
                    {message.type === "story-reply" && message.storyImage && (
                      <div className="mb-3">
                        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
                          <Play className="w-3 h-3" />
                          <span>Replied to your story</span>
                        </div>
                        <motion.img
                          whileHover={{ scale: 1.05 }}
                          src={message.storyImage || "/placeholder.svg"}
                          alt="Story"
                          className="w-32 h-48 object-cover rounded-xl border-2 border-neutral-700 mb-2 shadow-lg"
                        />
                      </div>
                    )}

                    {message.sticker && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="text-7xl"
                      >
                        {message.sticker}
                      </motion.div>
                    )}

                    {message.content && (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`px-5 py-3 rounded-2xl ${
                          message.type === "bot"
                            ? "bg-neutral-800 text-white rounded-tl-sm shadow-lg"
                            : `bg-gradient-to-r ${currentColors.gradient} text-white rounded-tr-sm shadow-lg`
                        }`}
                      >
                        <p className="text-base leading-relaxed">{message.content}</p>
                      </motion.div>
                    )}

                    {message.buttons && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {message.buttons.map((button, idx) => (
                          <motion.button
                            key={idx}
                            ref={(el) => {
                              if (el) buttonRefs.current[idx] = el
                            }}
                            initial={{ opacity: 0, scale: 0.8, y: 10 }}
                            animate={{
                              opacity: 1,
                              scale: clickingButton === idx ? 0.95 : 1,
                              y: 0,
                            }}
                            transition={{ delay: idx * 0.1, type: "spring" }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            className={`px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 rounded-full text-sm text-white border ${currentColors.border} shadow-lg font-medium`}
                          >
                            {button.text}
                          </motion.button>
                        ))}
                      </div>
                    )}

                    {message.images && (
                      <div className="flex gap-3 mt-3 overflow-x-auto pb-2">
                        {message.images.map((image, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: 20, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ delay: idx * 0.15, type: "spring" }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="flex-shrink-0 bg-neutral-800 rounded-2xl overflow-hidden w-56 border border-neutral-700 shadow-xl"
                          >
                            <div className="relative">
                              <img
                                src={image.url || "/placeholder.svg"}
                                alt={image.title}
                                className="w-full h-56 object-cover"
                              />
                              {image.badge && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: idx * 0.15 + 0.3 }}
                                  className={`absolute top-3 right-3 px-3 py-1 bg-gradient-to-r ${currentColors.gradient} text-white text-xs font-bold rounded-full shadow-lg`}
                                >
                                  {image.badge}
                                </motion.div>
                              )}
                            </div>
                            <div className="p-4">
                              <p className="text-sm font-semibold text-white mb-1">{image.title}</p>
                              {image.price && (
                                <p
                                  className={`text-lg font-bold bg-gradient-to-r ${currentColors.gradient} bg-clip-text text-transparent`}
                                >
                                  {image.price}
                                </p>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-neutral-600 mt-2">{message.timestamp}</p>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex justify-start mb-6"
                >
                  <div className="bg-neutral-800 px-6 py-4 rounded-2xl rounded-tl-sm shadow-lg">
                    <div className="flex gap-2">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            repeat: Number.POSITIVE_INFINITY,
                            duration: 1,
                            delay: i * 0.2,
                          }}
                          className="w-2.5 h-2.5 bg-neutral-500 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input bar */}
          <div className="bg-neutral-900 border-t border-neutral-800 px-6 py-4 flex items-center gap-4">
            <ImageIcon className="w-6 h-6 text-neutral-600 hover:text-neutral-400 cursor-pointer transition-colors" />
            <Smile className="w-6 h-6 text-neutral-600 hover:text-neutral-400 cursor-pointer transition-colors" />
            <div className="flex-1 bg-neutral-800 rounded-full px-5 py-3 border border-neutral-700">
              <input
                type="text"
                placeholder="Message..."
                className="w-full bg-transparent outline-none text-sm text-white placeholder:text-neutral-600"
                disabled
              />
            </div>
            <Heart className="w-6 h-6 text-neutral-600 hover:text-red-400 cursor-pointer transition-colors" />
            <Send className={`w-6 h-6 ${currentColors.text} cursor-pointer hover:scale-110 transition-transform`} />
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div className="grid grid-cols-3 gap-6 mt-10">
          {[
            { icon: Zap, label: "Response Time", value: "< 1s" },
            { icon: TrendingUp, label: "Conversion", value: "+300%" },
            { icon: Check, label: "Accuracy", value: "99.9%" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`bg-gradient-to-br ${currentColors.gradient} bg-opacity-10 border ${currentColors.border} rounded-2xl p-6 text-center shadow-lg`}
            >
              <stat.icon className={`w-8 h-8 ${currentColors.text} mx-auto mb-3`} />
              <div className={`text-3xl font-bold ${currentColors.text} mb-1`}>{stat.value}</div>
              <div className="text-sm text-neutral-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
