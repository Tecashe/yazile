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
import { MessageSquare, Zap, Target, BarChart3, Clock, Shield } from "lucide-react"

const features = [
  {
    icon: MessageSquare,
    title: "Smart Conversations",
    description: "AI-powered responses that feel human and convert like magic",
    bgColor: "bg-cyan-500/10",
    iconColor: "text-cyan-500",
    buttonBg: "bg-cyan-500",
    glowColor: "cyan",
    image: "/instagram-dm-conversation-automation-interface.jpg",
  },
  {
    icon: Zap,
    title: "Instant Responses",
    description: "Reply to every DM in milliseconds, never miss an opportunity",
    bgColor: "bg-orange-500/10",
    iconColor: "text-orange-500",
    buttonBg: "bg-orange-500",
    glowColor: "orange",
    image: "/fast-instant-messaging-automation-dashboard.jpg",
  },
  {
    icon: Target,
    title: "Lead Qualification",
    description: "Automatically identify and prioritize your hottest leads",
    bgColor: "bg-green-500/10",
    iconColor: "text-green-500",
    buttonBg: "bg-green-500",
    glowColor: "green",
    image: "/lead-scoring-qualification-dashboard.jpg",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track every conversation, conversion, and revenue metric",
    bgColor: "bg-blue-500/10",
    iconColor: "text-blue-500",
    buttonBg: "bg-blue-500",
    glowColor: "blue",
    image: "/analytics-dashboard.png",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Your sales team that never sleeps, eats, or takes breaks",
    bgColor: "bg-yellow-500/10",
    iconColor: "text-yellow-500",
    buttonBg: "bg-yellow-500",
    glowColor: "yellow",
    image: "/24-7-automation-always-on-interface.jpg",
  },
  {
    icon: Shield,
    title: "Instagram Safe",
    description: "Fully compliant with Instagram policies and best practices",
    bgColor: "bg-purple-500/10",
    iconColor: "text-purple-500",
    buttonBg: "bg-purple-500",
    glowColor: "purple",
    image: "/secure-safe-instagram-automation.jpg",
  },
]

function getGlowColor(color: string, opacity = 0.5): string {
  const colors: Record<string, string> = {
    cyan: `rgba(6, 182, 212, ${opacity})`,
    orange: `rgba(249, 115, 22, ${opacity})`,
    green: `rgba(34, 197, 94, ${opacity})`,
    blue: `rgba(59, 130, 246, ${opacity})`,
    yellow: `rgba(234, 179, 8, ${opacity})`,
    purple: `rgba(168, 85, 247, ${opacity})`,
  }
  return colors[color] || `rgba(59, 130, 246, ${opacity})`
}

function FeatureCard({ feature, index }: { feature: (typeof features)[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "start start"],
  })

  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1, 1])
  const y = useTransform(scrollYProgress, [0, 1], [100, 0])
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [10, 0, 0])

  const totalCards = features.length
  const targetScale = 1 - (totalCards - index) * 0.05

  return (
    <motion.div
      ref={cardRef}
      style={{
        scale,
        opacity,
        y,
        rotateX,
        top: `calc(${index * 40}px + ${index * 2}rem)`,
        zIndex: totalCards - index,
      }}
      className="sticky w-full"
    >
      <motion.div
        className={`relative rounded-3xl overflow-hidden ${feature.bgColor} backdrop-blur-xl border border-white/10 shadow-2xl`}
        style={{
          transformOrigin: "top center",
          boxShadow: `
            0 20px 60px -15px rgba(0, 0, 0, 0.8),
            0 10px 30px -10px rgba(0, 0, 0, 0.6),
            0 0 80px -20px ${getGlowColor(feature.glowColor)},
            inset 0 1px 0 0 rgba(255, 255, 255, 0.1)
          `,
        }}
        whileHover={{ 
          scale: targetScale + 0.02,
          boxShadow: `
            0 30px 80px -15px rgba(0, 0, 0, 0.9),
            0 15px 40px -10px rgba(0, 0, 0, 0.7),
            0 0 120px -20px ${getGlowColor(feature.glowColor)},
            inset 0 1px 0 0 rgba(255, 255, 255, 0.15)
          `,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/20 pointer-events-none" />
        
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        </div>
        
        <div className="grid lg:grid-cols-2 gap-0 relative">
          <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center relative z-10">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm mb-6 md:mb-8 shadow-lg"
              style={{
                boxShadow: `
                  0 10px 30px -5px ${getGlowColor(feature.glowColor, 0.4)},
                  inset 0 1px 0 0 rgba(255, 255, 255, 0.2)
                `,
              }}
              whileHover={{ 
                rotate: [0, -10, 10, -10, 0], 
                scale: 1.1,
                boxShadow: `
                  0 15px 40px -5px ${getGlowColor(feature.glowColor, 0.6)},
                  inset 0 1px 0 0 rgba(255, 255, 255, 0.3)
                `,
              }}
              transition={{ duration: 0.5 }}
            >
              <feature.icon className={`w-8 h-8 md:w-10 md:h-10 ${feature.iconColor}`} />
            </motion.div>

            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 drop-shadow-lg">
              {feature.title}
            </h3>
            
            <p className="text-base md:text-lg lg:text-xl text-neutral-300 leading-relaxed mb-6 md:mb-8">
              {feature.description}
            </p>

            <div className="flex flex-wrap gap-3 md:gap-4">
              <motion.button
                className={`inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 ${feature.buttonBg} text-white rounded-xl font-medium transition-all`}
                style={{
                  boxShadow: `
                    0 10px 25px -5px ${getGlowColor(feature.glowColor, 0.5)},
                    0 5px 10px -5px rgba(0, 0, 0, 0.4)
                  `,
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: `
                    0 15px 35px -5px ${getGlowColor(feature.glowColor, 0.7)},
                    0 8px 15px -5px rgba(0, 0, 0, 0.5)
                  `,
                }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Feature
              </motion.button>
              
              <motion.button
                className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all shadow-lg"
                style={{
                  boxShadow: `
                    0 5px 15px -5px rgba(0, 0, 0, 0.3),
                    inset 0 1px 0 0 rgba(255, 255, 255, 0.1)
                  `,
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: `
                    0 8px 20px -5px rgba(0, 0, 0, 0.4),
                    inset 0 1px 0 0 rgba(255, 255, 255, 0.2)
                  `,
                }}
                whileTap={{ scale: 0.95 }}
              >
                View Demo
              </motion.button>
            </div>
          </div>

          <div className="relative h-64 lg:h-auto min-h-[400px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-transparent z-10" />
            
            <motion.div
              className="absolute inset-0"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6 }}
            >
              <div 
                className="absolute inset-0 opacity-30 mix-blend-overlay"
                style={{
                  background: `radial-gradient(circle at center, ${getGlowColor(feature.glowColor, 0.3)}, transparent 70%)`,
                }}
              />
              
              <img
                src={feature.image || "/placeholder.svg"}
                alt={feature.title}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </motion.div>

            <motion.div
              className={`absolute top-4 right-4 md:top-6 md:right-6 ${feature.buttonBg} text-white text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 rounded-full font-bold backdrop-blur-sm z-20`}
              style={{
                boxShadow: `
                  0 10px 25px -5px ${getGlowColor(feature.glowColor, 0.6)},
                  0 5px 10px -5px rgba(0, 0, 0, 0.5)
                `,
              }}
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              Feature {index + 1}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function ParallaxFeatures() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section ref={containerRef} className="py-20 md:py-32 bg-neutral-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.1)_0%,_transparent_50%)] pointer-events-none" />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16 md:mb-24 lg:mb-32"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block mb-4 md:mb-6"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span 
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm text-blue-400 font-medium shadow-lg"
              style={{
                boxShadow: '0 10px 30px -10px rgba(59, 130, 246, 0.3)',
              }}
            >
              Premium Features
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 text-white leading-tight drop-shadow-2xl">
            Everything You Need to
            <span className="block mt-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 text-transparent bg-clip-text">
              Dominate Instagram DMs
            </span>
          </h2>
          
          <p className="text-base md:text-lg lg:text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed">
            Powerful automation meets intelligent conversations. Built for businesses that want to scale without losing
            the personal touch.
          </p>
        </motion.div>

        <div className="relative" style={{ minHeight: `${features.length * 600}px` }}>
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}