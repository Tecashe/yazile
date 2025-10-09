"use client"

import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion"
import { useState, useRef } from "react"
import { Clock, Zap, TrendingUp, Users, MessageSquare, DollarSign } from "lucide-react"

const comparisons = [
  {
    title: "Response Time",
    before: { value: "4-6 hours", label: "Manual replies", icon: Clock, color: "red" },
    after: { value: "< 1 second", label: "Automated replies", icon: Zap, color: "green" },
  },
  {
    title: "Conversion Rate",
    before: { value: "2-5%", label: "Without automation", icon: TrendingUp, color: "red" },
    after: { value: "15-25%", label: "With Yazzil", icon: TrendingUp, color: "green" },
  },
  {
    title: "Daily Conversations",
    before: { value: "20-30", label: "Manual capacity", icon: MessageSquare, color: "red" },
    after: { value: "500+", label: "Automated capacity", icon: MessageSquare, color: "green" },
  },
  {
    title: "Team Size Needed",
    before: { value: "5-10 people", label: "Manual team", icon: Users, color: "red" },
    after: { value: "1 person", label: "With automation", icon: Users, color: "green" },
  },
  {
    title: "Monthly Revenue",
    before: { value: "$10K", label: "Before Yazzil", icon: DollarSign, color: "red" },
    after: { value: "$40K+", label: "After Yazzil", icon: DollarSign, color: "green" },
  },
]

export function AdvancedBeforeAfter() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [dragProgress, setDragProgress] = useState(50)
  const constraintsRef = useRef(null)

  const x = useMotionValue(0)
  const clipPath = useTransform(x, [-200, 200], ["inset(0 100% 0 0)", "inset(0 0 0 0)"])

  const BeforeIcon = comparisons[selectedIndex].before.icon
  const AfterIcon = comparisons[selectedIndex].after.icon

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-500/5 to-transparent"
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-green-500/5 to-transparent"
          animate={{ opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
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
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            The Yazzil
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-orange-500 to-green-500">
              Transformation
            </span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            See the dramatic difference automation makes. Real metrics from real businesses.
          </p>
        </motion.div>

        {/* Comparison selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {comparisons.map((comp, index) => (
            <motion.button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                selectedIndex === index
                  ? "bg-gradient-to-r from-cyan-500 to-orange-500 text-white shadow-lg"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {comp.title}
            </motion.button>
          ))}
        </div>

        {/* Main comparison display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto"
          >
            {/* Interactive slider comparison */}
            <div
              className="relative bg-neutral-100 rounded-[3rem] overflow-hidden shadow-2xl mb-12"
              style={{ height: "500px" }}
            >
              {/* Before side (left) */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
                <motion.div
                  className="text-center p-12"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-red-500/20 flex items-center justify-center">
                    {BeforeIcon && <BeforeIcon className="w-12 h-12 text-red-600" />}
                  </div>
                  <div className="text-6xl font-bold text-red-600 mb-4">{comparisons[selectedIndex].before.value}</div>
                  <div className="text-2xl text-red-700 font-medium">{comparisons[selectedIndex].before.label}</div>
                  <div className="mt-6 text-neutral-600 text-lg">BEFORE</div>
                </motion.div>
              </div>

              {/* After side (right) with clip-path */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100"
                style={{ clipPath: `inset(0 ${100 - dragProgress}% 0 0)` }}
              >
                <motion.div
                  className="text-center p-12"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-green-500/20 flex items-center justify-center">
                    {AfterIcon && <AfterIcon className="w-12 h-12 text-green-600" />}
                  </div>
                  <div className="text-6xl font-bold text-green-600 mb-4">{comparisons[selectedIndex].after.value}</div>
                  <div className="text-2xl text-green-700 font-medium">{comparisons[selectedIndex].after.label}</div>
                  <div className="mt-6 text-neutral-600 text-lg">AFTER</div>
                </motion.div>
              </motion.div>

              {/* Draggable divider */}
              <motion.div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl cursor-ew-resize z-10"
                style={{ left: `${dragProgress}%` }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0}
                dragMomentum={false}
                onDrag={(_, info) => {
                  const container = info.point.x
                  const percentage = (container / window.innerWidth) * 100
                  setDragProgress(Math.max(0, Math.min(100, percentage)))
                }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center">
                  <div className="flex gap-1">
                    <div className="w-1 h-6 bg-neutral-400 rounded-full" />
                    <div className="w-1 h-6 bg-neutral-400 rounded-full" />
                  </div>
                </div>
              </motion.div>

              {/* Labels */}
              <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full font-bold text-red-600 shadow-lg">
                WITHOUT YAZZIL
              </div>
              <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full font-bold text-green-600 shadow-lg">
                WITH YAZZIL
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                className="bg-gradient-to-br from-red-50 to-red-100 rounded-3xl p-8 border-2 border-red-200"
                whileHover={{ scale: 1.02, rotate: -1 }}
              >
                <div className="text-sm font-bold text-red-600 mb-2">BEFORE AUTOMATION</div>
                <div className="text-4xl font-bold text-red-700 mb-2">{comparisons[selectedIndex].before.value}</div>
                <div className="text-neutral-600">{comparisons[selectedIndex].before.label}</div>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 border-2 border-green-200"
                whileHover={{ scale: 1.02, rotate: 1 }}
              >
                <div className="text-sm font-bold text-green-600 mb-2">AFTER AUTOMATION</div>
                <div className="text-4xl font-bold text-green-700 mb-2">{comparisons[selectedIndex].after.value}</div>
                <div className="text-neutral-600">{comparisons[selectedIndex].after.label}</div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.button
            className="px-12 py-6 bg-gradient-to-r from-cyan-500 to-orange-500 text-white text-xl font-bold rounded-full shadow-2xl"
            whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(6, 182, 212, 0.4)" }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Transformation Today
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
