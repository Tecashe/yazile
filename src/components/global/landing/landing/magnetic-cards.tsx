// "use client"

// import type React from "react"

// import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
// import { useRef, useState } from "react"
// import { Rocket, Users, DollarSign, TrendingUp, Star, Award } from "lucide-react"

// const stats = [
//   { icon: Rocket, value: "10K+", label: "Active Users", color: "cyan", gradient: "from-cyan-500 to-blue-500" },
//   { icon: Users, value: "2M+", label: "DMs Automated", color: "orange", gradient: "from-orange-500 to-red-500" },
//   {
//     icon: DollarSign,
//     value: "$50M+",
//     label: "Revenue Generated",
//     color: "green",
//     gradient: "from-green-500 to-emerald-500",
//   },
//   { icon: TrendingUp, value: "300%", label: "Avg. Growth", color: "blue", gradient: "from-blue-500 to-indigo-500" },
//   { icon: Star, value: "4.9/5", label: "User Rating", color: "yellow", gradient: "from-yellow-500 to-orange-500" },
//   { icon: Award, value: "#1", label: "DM Automation", color: "cyan", gradient: "from-cyan-500 to-teal-500" },
// ]

// function MagneticCard({ stat, index }: { stat: (typeof stats)[0]; index: number }) {
//   const ref = useRef<HTMLDivElement>(null)
//   const [isHovered, setIsHovered] = useState(false)

//   const x = useMotionValue(0)
//   const y = useMotionValue(0)

//   const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
//   const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })

//   const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"])
//   const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"])

//   const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (!ref.current) return

//     const rect = ref.current.getBoundingClientRect()
//     const width = rect.width
//     const height = rect.height
//     const mouseX = e.clientX - rect.left
//     const mouseY = e.clientY - rect.top
//     const xPct = mouseX / width - 0.5
//     const yPct = mouseY / height - 0.5

//     x.set(xPct)
//     y.set(yPct)
//   }

//   const handleMouseLeave = () => {
//     x.set(0)
//     y.set(0)
//     setIsHovered(false)
//   }

//   return (
//     <motion.div
//       ref={ref}
//       initial={{ opacity: 0, y: 50 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true }}
//       transition={{ duration: 0.5, delay: index * 0.1 }}
//       onMouseMove={handleMouseMove}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={handleMouseLeave}
//       style={{
//         rotateX,
//         rotateY,
//         transformStyle: "preserve-3d",
//       }}
//       className="relative group cursor-pointer"
//     >
//       <motion.div
//         className={`relative bg-white rounded-3xl p-8 shadow-xl border-2 border-${stat.color}-500/20 overflow-hidden`}
//         whileHover={{ scale: 1.05 }}
//         transition={{ duration: 0.3 }}
//       >
//         {/* Animated background gradient */}
//         <motion.div
//           className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
//           animate={isHovered ? { scale: [1, 1.2, 1] } : {}}
//           transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
//         />

//         {/* Icon with 3D effect */}
//         <motion.div
//           className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-6 relative`}
//           style={{ transformStyle: "preserve-3d", translateZ: 50 }}
//           animate={isHovered ? { rotate: 360 } : {}}
//           transition={{ duration: 0.8 }}
//         >
//           <stat.icon className="w-8 h-8 text-white" />
//         </motion.div>

//         {/* Value */}
//         <motion.div className="text-5xl font-bold mb-2" style={{ transformStyle: "preserve-3d", translateZ: 30 }}>
//           {stat.value}
//         </motion.div>

//         {/* Label */}
//         <motion.div className="text-neutral-600 text-lg" style={{ transformStyle: "preserve-3d", translateZ: 20 }}>
//           {stat.label}
//         </motion.div>

//         {/* Shine effect */}
//         <motion.div
//           className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
//           animate={isHovered ? { x: ["-100%", "100%"] } : {}}
//           transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
//         />
//       </motion.div>
//     </motion.div>
//   )
// }

// export function MagneticCards() {
//   return (
//     <section className="py-32 bg-gradient-to-b from-white to-neutral-50 relative overflow-hidden">
//       {/* Background decoration */}
//       <div className="absolute inset-0 overflow-hidden">
//         <motion.div
//           className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"
//           animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
//           transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY }}
//         />
//         <motion.div
//           className="absolute bottom-1/4 -right-20 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"
//           animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
//           transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY }}
//         />
//       </div>

//       <div className="container mx-auto px-4 relative z-10">
//         <motion.div
//           className="text-center mb-20"
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.8 }}
//         >
//           <h2 className="text-5xl md:text-7xl font-bold mb-6">
//             Trusted by Thousands
//             <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-orange-500 to-green-500">
//               Loved by Everyone
//             </span>
//           </h2>
//           <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
//             Join the fastest-growing community of businesses automating their Instagram DMs
//           </p>
//         </motion.div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ perspective: "1000px" }}>
//           {stats.map((stat, index) => (
//             <MagneticCard key={index} stat={stat} index={index} />
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

"use client"

import type React from "react"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import { Rocket, Users, DollarSign, TrendingUp, Star, Award } from "lucide-react"

const stats = [
  { icon: Rocket, value: "10K+", label: "Active Users", color: "cyan", gradient: "from-cyan-500 to-blue-500" },
  { icon: Users, value: "2M+", label: "DMs Automated", color: "orange", gradient: "from-orange-500 to-red-500" },
  {
    icon: DollarSign,
    value: "$50M+",
    label: "Revenue Generated",
    color: "green",
    gradient: "from-green-500 to-emerald-500",
  },
  { icon: TrendingUp, value: "300%", label: "Avg. Growth", color: "blue", gradient: "from-blue-500 to-indigo-500" },
  { icon: Star, value: "4.9/5", label: "User Rating", color: "yellow", gradient: "from-yellow-500 to-orange-500" },
  { icon: Award, value: "#1", label: "DM Automation", color: "cyan", gradient: "from-cyan-500 to-teal-500" },
]

function MagneticCard({ stat, index }: { stat: (typeof stats)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative group cursor-pointer"
    >
      <motion.div
        className={`relative bg-white rounded-3xl p-8 shadow-xl border-2 border-${stat.color}-500/20 overflow-hidden`}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        {/* Animated background gradient */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
          animate={isHovered ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />

        {/* Icon with 3D effect */}
        <motion.div
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-6 relative`}
          style={{ transformStyle: "preserve-3d", translateZ: 50 }}
          animate={isHovered ? { rotate: 360 } : {}}
          transition={{ duration: 0.8 }}
        >
          <stat.icon className="w-8 h-8 text-white" />
        </motion.div>

        {/* Value */}
        <motion.div className="text-5xl font-bold mb-2" style={{ transformStyle: "preserve-3d", translateZ: 30 }}>
          {stat.value}
        </motion.div>

        {/* Label */}
        <motion.div className="text-neutral-600 text-lg" style={{ transformStyle: "preserve-3d", translateZ: 20 }}>
          {stat.label}
        </motion.div>

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
          animate={isHovered ? { x: ["-100%", "100%"] } : {}}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
        />
      </motion.div>
    </motion.div>
  )
}

export function MagneticCards() {
  return (
    <section className="py-32 bg-neutral-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            Trusted by Thousands
            <span className="block mt-2 text-blue-400">Loved by Everyone</span>
          </h2>
          <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
            Join the fastest-growing community of businesses automating their Instagram DMs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ perspective: "1000px" }}>
          {stats.map((stat, index) => (
            <MagneticCard key={index} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
