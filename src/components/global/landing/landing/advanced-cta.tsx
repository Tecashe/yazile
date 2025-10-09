"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { ArrowRight, Sparkles, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AdvancedCTA() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [-5, 0, 5])

  return (
    <section ref={containerRef} className="py-32 bg-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/10 via-orange-500/10 to-green-500/10"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        />
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.5, 1], x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.5, 1], x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div className="max-w-5xl mx-auto" style={{ y, scale, rotate }}>
          <motion.div
            className="relative bg-gradient-to-br from-cyan-500 via-orange-500 to-green-500 rounded-[3rem] p-1 shadow-2xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {/* Inner content */}
            <div className="bg-white rounded-[2.8rem] p-12 md:p-16 relative overflow-hidden">
              {/* Decorative elements */}
              <motion.div
                className="absolute top-10 right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
              />
              <motion.div
                className="absolute bottom-10 left-10 w-40 h-40 bg-orange-500/10 rounded-full blur-2xl"
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
              />

              <div className="relative text-center">
                {/* Badge */}
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-orange-500/10 rounded-full mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Sparkles className="w-4 h-4 text-cyan-500" />
                  <span className="font-medium">Limited Time Offer</span>
                  <Sparkles className="w-4 h-4 text-orange-500" />
                </motion.div>

                {/* Heading */}
                <motion.h2
                  className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  Ready to Transform Your
                  <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-orange-500 to-green-500">
                    Instagram DMs?
                  </span>
                </motion.h2>

                <motion.p
                  className="text-xl md:text-2xl text-neutral-600 mb-12 max-w-3xl mx-auto"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  Join 10,000+ businesses already using Yazzil to automate conversations and generate revenue 24/7
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-cyan-500 to-orange-500 hover:from-cyan-600 hover:to-orange-600 text-white px-12 py-8 text-xl rounded-full shadow-2xl shadow-cyan-500/30"
                    >
                      Start Free Trial
                      <ArrowRight className="ml-2 w-6 h-6" />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="px-12 py-8 text-xl rounded-full border-2 border-neutral-300 hover:border-neutral-400 bg-transparent"
                    >
                      Schedule Demo
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Trust indicators */}
                <motion.div
                  className="flex flex-wrap justify-center items-center gap-8 text-sm text-neutral-600"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-green-500" />
                    <span>14-day free trial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-green-500" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-green-500" />
                    <span>Cancel anytime</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Floating stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              { value: "10K+", label: "Active Users", color: "cyan" },
              { value: "2M+", label: "DMs Automated", color: "orange" },
              { value: "$50M+", label: "Revenue Generated", color: "green" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className={`bg-white rounded-2xl p-6 shadow-lg border-2 border-${stat.color}-500/20 text-center`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.1 }}
                whileHover={{ y: -5, borderColor: `var(--${stat.color}-500)` }}
              >
                <div className={`text-4xl font-bold text-${stat.color}-500 mb-2`}>{stat.value}</div>
                <div className="text-neutral-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
