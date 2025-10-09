"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Check, Zap, Crown, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"

const plans = [
  {
    name: "Starter",
    icon: Zap,
    price: { monthly: 49, annual: 39 },
    description: "Perfect for solopreneurs and small businesses",
    color: "cyan",
    features: [
      "500 automated conversations/month",
      "Basic AI responses",
      "Instagram integration",
      "Email support",
      "Analytics dashboard",
      "1 team member",
    ],
  },
  {
    name: "Professional",
    icon: Crown,
    price: { monthly: 99, annual: 79 },
    description: "For growing businesses that need more power",
    color: "orange",
    popular: true,
    features: [
      "2,000 automated conversations/month",
      "Advanced AI with custom training",
      "Instagram + Facebook integration",
      "Priority support",
      "Advanced analytics & reporting",
      "5 team members",
      "Custom workflows",
      "A/B testing",
    ],
  },
  {
    name: "Enterprise",
    icon: Rocket,
    price: { monthly: 299, annual: 249 },
    description: "For agencies and large businesses",
    color: "green",
    features: [
      "Unlimited conversations",
      "White-label solution",
      "Multi-platform integration",
      "Dedicated account manager",
      "Custom AI training",
      "Unlimited team members",
      "API access",
      "Custom integrations",
      "SLA guarantee",
    ],
  },
]

export function InteractivePricing() {
  const [isAnnual, setIsAnnual] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="py-32 bg-gradient-to-b from-white to-neutral-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"
          animate={{ x: [0, 100, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute bottom-1/4 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"
          animate={{ x: [0, -100, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            Simple, Transparent
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-orange-500 to-green-500">
              Pricing
            </span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your business. All plans include a 14-day free trial.
          </p>

          {/* Billing toggle */}
          <motion.div
            className="inline-flex items-center gap-4 bg-white rounded-full p-2 shadow-lg border border-neutral-200"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                !isAnnual ? "bg-cyan-500 text-white" : "text-neutral-600"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                isAnnual ? "bg-cyan-500 text-white" : "text-neutral-600"
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">Save 20%</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            const price = isAnnual ? plan.price.annual : plan.price.monthly

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                className="relative"
              >
                {plan.popular && (
                  <motion.div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg z-10"
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    MOST POPULAR
                  </motion.div>
                )}

                <motion.div
                  className={`relative bg-white rounded-[2.5rem] p-8 shadow-xl border-2 h-full ${
                    plan.popular ? `border-${plan.color}-500 scale-105` : `border-${plan.color}-500/20`
                  }`}
                  whileHover={{
                    y: -10,
                    scale: plan.popular ? 1.05 : 1.02,
                    borderColor: `var(--${plan.color}-500)`,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Glow effect on hover */}
                  <motion.div
                    className={`absolute -inset-1 bg-gradient-to-br from-${plan.color}-500/20 to-transparent rounded-[2.5rem] blur-xl opacity-0`}
                    animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />

                  <div className="relative">
                    {/* Icon */}
                    <motion.div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-${plan.color}-500 to-${plan.color}-600 flex items-center justify-center mb-6`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>

                    {/* Plan name */}
                    <h3 className="text-3xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-neutral-600 mb-6">{plan.description}</p>

                    {/* Price */}
                    <div className="mb-8">
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold">${price}</span>
                        <span className="text-neutral-600">/{isAnnual ? "month" : "month"}</span>
                      </div>
                      {isAnnual && (
                        <div className="text-sm text-green-600 font-medium mt-2">
                          Billed annually (${price * 12}/year)
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        className={`w-full py-6 text-lg rounded-full ${
                          plan.popular
                            ? `bg-gradient-to-r from-${plan.color}-500 to-${plan.color}-600 text-white shadow-lg shadow-${plan.color}-500/30`
                            : `bg-${plan.color}-500/10 text-${plan.color}-600 hover:bg-${plan.color}-500/20`
                        }`}
                      >
                        Start Free Trial
                      </Button>
                    </motion.div>

                    {/* Features */}
                    <div className="mt-8 space-y-4">
                      {plan.features.map((feature, i) => (
                        <motion.div
                          key={i}
                          className="flex items-start gap-3"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.6 + i * 0.05 }}
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-${plan.color}-500/10 flex items-center justify-center flex-shrink-0 mt-0.5`}
                          >
                            <Check className={`w-3 h-3 text-${plan.color}-500`} />
                          </div>
                          <span className="text-neutral-700">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        {/* Money-back guarantee */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          <div className="inline-flex items-center gap-3 bg-white rounded-full px-8 py-4 shadow-lg border border-neutral-200">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <Check className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-left">
              <div className="font-bold">30-Day Money-Back Guarantee</div>
              <div className="text-sm text-neutral-600">Not satisfied? Get a full refund, no questions asked.</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
