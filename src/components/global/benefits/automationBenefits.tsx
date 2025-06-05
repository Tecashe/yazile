"use client"

import { useState, useEffect } from "react"
import { Users, BarChart3, Clock, CheckCircle, ArrowRight, Sparkles } from "lucide-react"

const benefits = [
  {
    icon: Users,
    title: "Enhanced Customer Journey",
    description: "Let AI deal with the task of converting potential customers into loyal clients",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    stats: "85% conversion rate",
  },
  {
    icon: BarChart3,
    title: "Real-time Analysis",
    description: "Get sentiment analysis and customer insights in real time with advanced AI",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
    stats: "99.9% accuracy",
  },
  {
    icon: Clock,
    title: "Save Valuable Time",
    description: "Handle repetitive tasks automatically, freeing up your time for strategic work",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
    stats: "40+ hours/week saved",
  },
  {
    icon: CheckCircle,
    title: "Ensure Consistency",
    description: "Perform tasks consistently every time, reducing human error and variability",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-500/10",
    stats: "100% reliability",
  },
]

export default function AutomationBenefitsV1() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % benefits.length)
    }, 6000)

    return () => clearInterval(timer)
  }, [])

  const currentBenefit = benefits[currentIndex]
  const IconComponent = currentBenefit.icon

  return (
    <div className="w-full max-w-5xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          {/* Content Section */}
          <div className="w-3/5 pr-8">
            <div className="flex items-center mb-4">
              <div className={`p-3 rounded-xl ${currentBenefit.bgColor} mr-4`}>
                <IconComponent
                  className={`w-8 h-8 bg-gradient-to-r ${currentBenefit.color} bg-clip-text text-transparent`}
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{currentBenefit.title}</h3>
                <div className="flex items-center text-sm text-gray-400">
                  <Sparkles className="w-4 h-4 mr-1" />
                  {currentBenefit.stats}
                </div>
              </div>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">{currentBenefit.description}</p>
            <button className="flex items-center text-blue-400 hover:text-blue-300 transition-colors group">
              Learn more
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Visual Section */}
          <div className="w-2/5 relative">
            <div className={`relative h-64 rounded-2xl bg-gradient-to-br ${currentBenefit.color} p-1`}>
              <div className="h-full w-full bg-gray-900 rounded-xl flex items-center justify-center relative overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-pulse" />
                </div>

                {/* Large icon */}
                <IconComponent
                  className={`w-24 h-24 bg-gradient-to-br ${currentBenefit.color} bg-clip-text text-transparent`}
                />

                {/* Floating elements */}
                <div className="absolute top-4 right-4 w-3 h-3 bg-blue-400 rounded-full animate-ping" />
                <div className="absolute bottom-6 left-6 w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                <div className="absolute top-1/2 left-4 w-1 h-1 bg-green-400 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        </div>

        {/* Progress indicators */}
        <div className="flex justify-center mt-8 space-x-3">
          {benefits.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-gradient-to-r from-blue-500 to-purple-500"
                  : "w-2 bg-gray-600 hover:bg-gray-500"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
