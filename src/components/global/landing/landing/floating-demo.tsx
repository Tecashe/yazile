"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Play } from "lucide-react"

export function FloatingDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [-10, 0, 10])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])

  return (
    <section ref={containerRef} className="py-32 bg-gradient-to-b from-neutral-50 to-white relative overflow-hidden">
      {/* Floating orbs */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"
        animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"
        animate={{ x: [0, -100, 0], y: [0, -50, 0], scale: [1, 1.3, 1] }}
        transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            See Yazzil in
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-orange-500">
              Action
            </span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Watch how businesses are transforming their Instagram DMs into revenue-generating machines
          </p>
        </motion.div>

        {/* Main video container with 3D effect */}
        <motion.div className="max-w-6xl mx-auto relative" style={{ y, rotate, scale }}>
          <motion.div className="relative group" whileHover={{ scale: 1.02 }} transition={{ duration: 0.4 }}>
            {/* Glow effect */}
            <div className="absolute -inset-8 bg-gradient-to-r from-cyan-500/30 via-orange-500/30 to-green-500/30 rounded-[4rem] blur-3xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />

            {/* Video container */}
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl bg-neutral-900">
              {/* Placeholder for video */}
              <div className="aspect-video bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
                <img src="/yazzil-instagram-dm-automation-demo-dashboard-inte.jpg" alt="Yazzil Demo" className="w-full h-full object-cover" />

                {/* Play button overlay */}
                <motion.button
                  className="absolute inset-0 flex items-center justify-center group/play"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.div
                    className="w-24 h-24 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl"
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
                  >
                    <Play className="w-10 h-10 text-cyan-500 ml-1" fill="currentColor" />
                  </motion.div>
                </motion.button>
              </div>

              {/* Decorative border */}
              <div className="absolute inset-0 rounded-[3rem] border-2 border-white/10 pointer-events-none" />
            </div>

            {/* Floating stats */}
            <motion.div
              className="absolute -left-8 top-1/4 bg-white rounded-2xl p-6 shadow-xl border-2 border-cyan-500/20"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.1, rotate: -5 }}
            >
              <div className="text-3xl font-bold text-cyan-500">10K+</div>
              <div className="text-sm text-neutral-600">Happy Users</div>
            </motion.div>

            <motion.div
              className="absolute -right-8 bottom-1/4 bg-white rounded-2xl p-6 shadow-xl border-2 border-orange-500/20"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <div className="text-3xl font-bold text-orange-500">300%</div>
              <div className="text-sm text-neutral-600">ROI Average</div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Feature highlights */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          {[
            { title: "Setup in Minutes", desc: "No coding required", color: "cyan" },
            { title: "AI-Powered", desc: "Smart conversations", color: "orange" },
            { title: "24/7 Support", desc: "Always here to help", color: "green" },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className={`bg-white rounded-2xl p-6 shadow-lg border-2 border-${feature.color}-500/20 text-center`}
              whileHover={{ y: -10, borderColor: `var(--${feature.color}-500)` }}
            >
              <div className="text-2xl font-bold mb-2">{feature.title}</div>
              <div className="text-neutral-600">{feature.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
