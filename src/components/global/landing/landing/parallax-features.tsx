// "use client"

// import { motion, useScroll, useTransform } from "framer-motion"
// import { useRef } from "react"
// import { MessageSquare, Zap, Target, BarChart3, Clock, Shield } from "lucide-react"

// const features = [
//   {
//     icon: MessageSquare,
//     title: "Smart Conversations",
//     description: "AI-powered responses that feel human and convert like magic",
//     bgColor: "bg-cyan-500/10",
//     iconColor: "text-cyan-500",
//     buttonBg: "bg-cyan-500",
//     buttonHover: "hover:shadow-cyan-500/30",
//     gradientFrom: "from-cyan-500/20",
//     image: "/instagram-dm-conversation-automation-interface.jpg",
//   },
//   {
//     icon: Zap,
//     title: "Instant Responses",
//     description: "Reply to every DM in milliseconds, never miss an opportunity",
//     bgColor: "bg-orange-500/10",
//     iconColor: "text-orange-500",
//     buttonBg: "bg-orange-500",
//     buttonHover: "hover:shadow-orange-500/30",
//     gradientFrom: "from-orange-500/20",
//     image: "/fast-instant-messaging-automation-dashboard.jpg",
//   },
//   {
//     icon: Target,
//     title: "Lead Qualification",
//     description: "Automatically identify and prioritize your hottest leads",
//     bgColor: "bg-green-500/10",
//     iconColor: "text-green-500",
//     buttonBg: "bg-green-500",
//     buttonHover: "hover:shadow-green-500/30",
//     gradientFrom: "from-green-500/20",
//     image: "/lead-scoring-qualification-dashboard.jpg",
//   },
//   {
//     icon: BarChart3,
//     title: "Analytics Dashboard",
//     description: "Track every conversation, conversion, and revenue metric",
//     bgColor: "bg-blue-500/10",
//     iconColor: "text-blue-500",
//     buttonBg: "bg-blue-500",
//     buttonHover: "hover:shadow-blue-500/30",
//     gradientFrom: "from-blue-500/20",
//     image: "/analytics-dashboard.png",
//   },
//   {
//     icon: Clock,
//     title: "24/7 Availability",
//     description: "Your sales team that never sleeps, eats, or takes breaks",
//     bgColor: "bg-yellow-500/10",
//     iconColor: "text-yellow-500",
//     buttonBg: "bg-yellow-500",
//     buttonHover: "hover:shadow-yellow-500/30",
//     gradientFrom: "from-yellow-500/20",
//     image: "/24-7-automation-always-on-interface.jpg",
//   },
//   {
//     icon: Shield,
//     title: "Instagram Safe",
//     description: "Fully compliant with Instagram policies and best practices",
//     bgColor: "bg-cyan-500/10",
//     iconColor: "text-cyan-500",
//     buttonBg: "bg-cyan-500",
//     buttonHover: "hover:shadow-cyan-500/30",
//     gradientFrom: "from-cyan-500/20",
//     image: "/secure-safe-instagram-automation.jpg",
//   },
// ]

// function FeatureItem({ feature, index, isEven }: { feature: (typeof features)[0]; index: number; isEven: boolean }) {
//   const featureRef = useRef<HTMLDivElement>(null)
//   const { scrollYProgress } = useScroll({
//     target: featureRef,
//     offset: ["start end", "end start"],
//   })

//   const imageY = useTransform(scrollYProgress, [0, 1], [100, -100])
//   const contentY = useTransform(scrollYProgress, [0, 1], [50, -50])
//   const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [isEven ? -5 : 5, 0, isEven ? 5 : -5])
//   const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])

//   return (
//     <motion.div
//       ref={featureRef}
//       className={`grid md:grid-cols-2 gap-12 items-center ${isEven ? "" : "md:grid-flow-dense"}`}
//     >
//       {/* Content */}
//       <motion.div className={`${isEven ? "" : "md:col-start-2"} space-y-6`} style={{ y: contentY }}>
//         <motion.div
//           className={`w-20 h-20 rounded-3xl ${feature.bgColor} flex items-center justify-center`}
//           whileHover={{ rotate: 360, scale: 1.1 }}
//           transition={{ duration: 0.6 }}
//         >
//           <feature.icon className={`w-10 h-10 ${feature.iconColor}`} />
//         </motion.div>

//         <h3 className="text-4xl md:text-5xl font-bold">{feature.title}</h3>
//         <p className="text-xl text-neutral-600 leading-relaxed">{feature.description}</p>

//         <motion.button
//           className={`inline-flex items-center gap-2 px-6 py-3 ${feature.buttonBg} text-white rounded-full font-medium hover:shadow-lg ${feature.buttonHover} transition-shadow`}
//           whileHover={{ scale: 1.05, x: 10 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           Learn More
//           <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
//             →
//           </motion.span>
//         </motion.button>
//       </motion.div>

//       {/* Image with 3D effect */}
//       <motion.div className={`${isEven ? "" : "md:col-start-1 md:row-start-1"} relative`} style={{ y: imageY }}>
//         <motion.div
//           className="relative group"
//           style={{ rotate, scale }}
//           whileHover={{ scale: 1.05, rotate: 0 }}
//           transition={{ duration: 0.4 }}
//         >
//           {/* Decorative background */}
//           <div
//             className={`absolute -inset-4 bg-gradient-to-br ${feature.gradientFrom} to-transparent rounded-[3rem] blur-2xl group-hover:blur-3xl transition-all duration-500`}
//           />

//           {/* Image container with clip-path */}
//           <div
//             className="relative rounded-[2.5rem] overflow-hidden shadow-2xl"
//             style={{
//               clipPath: "polygon(0% 0%, 100% 0%, 100% 85%, 85% 100%, 0% 100%)",
//             }}
//           >
//             <img
//               src={feature.image || "/placeholder.svg"}
//               alt={feature.title}
//               className="w-full h-auto transform group-hover:scale-110 transition-transform duration-700"
//             />

//             {/* Overlay gradient */}
//             <div
//               className={`absolute inset-0 bg-gradient-to-tr ${feature.gradientFrom} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
//             />
//           </div>

//           {/* Floating badge */}
//           <motion.div
//             className={`absolute -top-4 -right-4 ${feature.buttonBg} text-white px-6 py-3 rounded-full font-bold shadow-xl`}
//             initial={{ scale: 0, rotate: -180 }}
//             whileInView={{ scale: 1, rotate: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.3, type: "spring" }}
//           >
//             New
//           </motion.div>
//         </motion.div>
//       </motion.div>
//     </motion.div>
//   )
// }

// export function ParallaxFeatures() {
//   const containerRef = useRef<HTMLDivElement>(null)

//   return (
//     <section ref={containerRef} className="py-32 bg-white relative overflow-hidden">
//       <div className="container mx-auto px-4">
//         <motion.div
//           className="text-center mb-20"
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.8 }}
//         >
//           <h2 className="text-5xl md:text-7xl font-bold mb-6">
//             Everything You Need to
//             <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-orange-500">
//               Dominate Instagram DMs
//             </span>
//           </h2>
//           <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
//             Powerful automation meets intelligent conversations. Built for businesses that want to scale without losing
//             the personal touch.
//           </p>
//         </motion.div>

//         <div className="space-y-32">
//           {features.map((feature, index) => (
//             <FeatureItem key={index} feature={feature} index={index} isEven={index % 2 === 0} />
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

// "use client"

// import { motion, useScroll, useTransform } from "framer-motion"
// import { useRef } from "react"
// import { MessageSquare, Zap, Target, BarChart3, Clock, Shield } from "lucide-react"

// const features = [
//   {
//     icon: MessageSquare,
//     title: "Smart Conversations",
//     description: "AI-powered responses that feel human and convert like magic",
//     bgColor: "bg-cyan-500/10",
//     iconColor: "text-cyan-500",
//     buttonBg: "bg-cyan-500",
//     buttonHover: "hover:shadow-cyan-500/30",
//     gradientFrom: "from-cyan-500/20",
//     image: "/instagram-dm-conversation-automation-interface.jpg",
//   },
//   {
//     icon: Zap,
//     title: "Instant Responses",
//     description: "Reply to every DM in milliseconds, never miss an opportunity",
//     bgColor: "bg-orange-500/10",
//     iconColor: "text-orange-500",
//     buttonBg: "bg-orange-500",
//     buttonHover: "hover:shadow-orange-500/30",
//     gradientFrom: "from-orange-500/20",
//     image: "/fast-instant-messaging-automation-dashboard.jpg",
//   },
//   {
//     icon: Target,
//     title: "Lead Qualification",
//     description: "Automatically identify and prioritize your hottest leads",
//     bgColor: "bg-green-500/10",
//     iconColor: "text-green-500",
//     buttonBg: "bg-green-500",
//     buttonHover: "hover:shadow-green-500/30",
//     gradientFrom: "from-green-500/20",
//     image: "/lead-scoring-qualification-dashboard.jpg",
//   },
//   {
//     icon: BarChart3,
//     title: "Analytics Dashboard",
//     description: "Track every conversation, conversion, and revenue metric",
//     bgColor: "bg-blue-500/10",
//     iconColor: "text-blue-500",
//     buttonBg: "bg-blue-500",
//     buttonHover: "hover:shadow-blue-500/30",
//     gradientFrom: "from-blue-500/20",
//     image: "/analytics-dashboard.png",
//   },
//   {
//     icon: Clock,
//     title: "24/7 Availability",
//     description: "Your sales team that never sleeps, eats, or takes breaks",
//     bgColor: "bg-yellow-500/10",
//     iconColor: "text-yellow-500",
//     buttonBg: "bg-yellow-500",
//     buttonHover: "hover:shadow-yellow-500/30",
//     gradientFrom: "from-yellow-500/20",
//     image: "/24-7-automation-always-on-interface.jpg",
//   },
//   {
//     icon: Shield,
//     title: "Instagram Safe",
//     description: "Fully compliant with Instagram policies and best practices",
//     bgColor: "bg-cyan-500/10",
//     iconColor: "text-cyan-500",
//     buttonBg: "bg-cyan-500",
//     buttonHover: "hover:shadow-cyan-500/30",
//     gradientFrom: "from-cyan-500/20",
//     image: "/secure-safe-instagram-automation.jpg",
//   },
// ]

// function FeatureItem({ feature, index, isEven }: { feature: (typeof features)[0]; index: number; isEven: boolean }) {
//   const featureRef = useRef<HTMLDivElement>(null)
//   const { scrollYProgress } = useScroll({
//     target: featureRef,
//     offset: ["start end", "end start"],
//   })

//   const imageY = useTransform(scrollYProgress, [0, 1], [100, -100])
//   const contentY = useTransform(scrollYProgress, [0, 1], [50, -50])
//   const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [isEven ? -5 : 5, 0, isEven ? 5 : -5])
//   const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])

//   return (
//     <motion.div
//       ref={featureRef}
//       className={`grid md:grid-cols-2 gap-12 items-center ${isEven ? "" : "md:grid-flow-dense"}`}
//     >
//       {/* Content */}
//       <motion.div className={`${isEven ? "" : "md:col-start-2"} space-y-6`} style={{ y: contentY }}>
//         <motion.div
//           className={`w-20 h-20 rounded-3xl ${feature.bgColor} flex items-center justify-center`}
//           whileHover={{ rotate: 360, scale: 1.1 }}
//           transition={{ duration: 0.6 }}
//         >
//           <feature.icon className={`w-10 h-10 ${feature.iconColor}`} />
//         </motion.div>

//         <h3 className="text-4xl md:text-5xl font-bold">{feature.title}</h3>
//         <p className="text-xl text-neutral-600 leading-relaxed">{feature.description}</p>

//         <motion.button
//           className={`inline-flex items-center gap-2 px-6 py-3 ${feature.buttonBg} text-white rounded-full font-medium hover:shadow-lg ${feature.buttonHover} transition-shadow`}
//           whileHover={{ scale: 1.05, x: 10 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           Learn More
//           <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
//             →
//           </motion.span>
//         </motion.button>
//       </motion.div>

//       {/* Image with 3D effect */}
//       <motion.div className={`${isEven ? "" : "md:col-start-1 md:row-start-1"} relative`} style={{ y: imageY }}>
//         <motion.div
//           className="relative group"
//           style={{ rotate, scale }}
//           whileHover={{ scale: 1.05, rotate: 0 }}
//           transition={{ duration: 0.4 }}
//         >
//           {/* Decorative background */}
//           <div
//             className={`absolute -inset-4 bg-gradient-to-br ${feature.gradientFrom} to-transparent rounded-[3rem] blur-2xl group-hover:blur-3xl transition-all duration-500`}
//           />

//           {/* Image container with clip-path */}
//           <div
//             className="relative rounded-[2.5rem] overflow-hidden shadow-2xl"
//             style={{
//               clipPath: "polygon(0% 0%, 100% 0%, 100% 85%, 85% 100%, 0% 100%)",
//             }}
//           >
//             <img
//               src={feature.image || "/placeholder.svg"}
//               alt={feature.title}
//               className="w-full h-auto transform group-hover:scale-110 transition-transform duration-700"
//             />

//             {/* Overlay gradient */}
//             <div
//               className={`absolute inset-0 bg-gradient-to-tr ${feature.gradientFrom} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
//             />
//           </div>

//           {/* Floating badge */}
//           <motion.div
//             className={`absolute -top-4 -right-4 ${feature.buttonBg} text-white px-6 py-3 rounded-full font-bold shadow-xl`}
//             initial={{ scale: 0, rotate: -180 }}
//             whileInView={{ scale: 1, rotate: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.3, type: "spring" }}
//           >
//             New
//           </motion.div>
//         </motion.div>
//       </motion.div>
//     </motion.div>
//   )
// }

// export function ParallaxFeatures() {
//   const containerRef = useRef<HTMLDivElement>(null)

//   return (
//     <section ref={containerRef} className="py-32 bg-neutral-950 relative overflow-hidden">
//       <div className="container mx-auto px-4">
//         <motion.div
//           className="text-center mb-20"
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.8 }}
//         >
//           <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white">
//             Everything You Need to
//             <span className="block mt-2 text-blue-400">Dominate Instagram DMs</span>
//           </h2>
//           <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
//             Powerful automation meets intelligent conversations. Built for businesses that want to scale without losing
//             the personal touch.
//           </p>
//         </motion.div>

//         <div className="space-y-32">
//           {features.map((feature, index) => (
//             <FeatureItem key={index} feature={feature} index={index} isEven={index % 2 === 0} />
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"

const features = [
  {
    title: "Instant Response",
    description: "Reply to every DM in under 1 second",
    image: "/instagram-dm-automation-chat-interface.jpg",
    color: "from-blue-500 to-cyan-500",
    stat: "< 1s",
    statLabel: "Response Time",
  },
  {
    title: "Smart Conversations",
    description: "AI that understands context and intent",
    image: "/ai-chatbot-conversation-flow.jpg",
    color: "from-green-500 to-emerald-500",
    stat: "99.9%",
    statLabel: "Accuracy",
  },
  {
    title: "Lead Qualification",
    description: "Automatically identify hot leads",
    image: "/sales-dashboard-analytics.png",
    color: "from-orange-500 to-amber-500",
    stat: "+300%",
    statLabel: "Conversions",
  },
  {
    title: "24/7 Automation",
    description: "Never miss a customer again",
    image: "/24-7-customer-support-automation.jpg",
    color: "from-purple-500 to-pink-500",
    stat: "24/7",
    statLabel: "Always On",
  },
]

function StackingCard({ feature, index, total }: { feature: (typeof features)[0]; index: number; total: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "start center"],
  })

  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])

  const topOffset = index * 60 // Each card is 60px lower than the previous
  const zIndex = total - index // Higher cards have higher z-index

  return (
    <motion.div
      ref={cardRef}
      style={{
        scale,
        opacity,
        top: `${topOffset}px`,
        zIndex,
      }}
      className="sticky"
    >
      <motion.div
        whileHover={{ y: -20, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl"
      >
        <div className={`h-3 bg-gradient-to-r ${feature.color}`} />

        <div className="p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Content */}
            <div className="space-y-6">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="inline-block"
                >
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${feature.color} bg-opacity-10 mb-4`}
                  >
                    <span className="text-sm font-semibold text-white">{feature.statLabel}</span>
                    <span className="text-2xl font-bold text-white">{feature.stat}</span>
                  </div>
                </motion.div>

                <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-xl text-neutral-400 leading-relaxed">{feature.description}</p>
              </div>
            </div>

            {/* Image */}
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative h-80 rounded-2xl overflow-hidden border border-neutral-800 shadow-xl"
            >
              <Image src={feature.image || "/placeholder.svg"} alt={feature.title} fill className="object-cover" />
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10`} />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function ParallaxFeatures() {
  return (
    <section className="py-32 bg-neutral-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/30 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <motion.div
          className="text-center mb-32"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            Everything You Need
            <span className="block mt-2 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              In One Platform
            </span>
          </h2>
          <p className="text-xl text-neutral-400 max-w-3xl mx-auto">Powerful automation that feels human</p>
        </motion.div>

        <div className="relative" style={{ paddingBottom: `${features.length * 60}px` }}>
          {features.map((feature, index) => (
            <StackingCard key={index} feature={feature} index={index} total={features.length} />
          ))}
        </div>
      </div>
    </section>
  )
}
