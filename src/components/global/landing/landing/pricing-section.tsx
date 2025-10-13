"use client"

import { useEffect, useRef } from "react"
import { Check, Zap, Rocket, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const plans = [
  {
    name: "Starter",
    price: "$29",
    description: "Perfect for small businesses just getting started",
    icon: Zap,
    color: "green",
    features: [
      "1,000 automated conversations/month",
      "DM automation",
      "Story reply automation",
      "Comment automation",
      "Basic analytics",
      "Email support",
      "2 Instagram accounts",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Growth",
    price: "$79",
    description: "For growing businesses ready to scale",
    icon: Rocket,
    color: "orange",
    features: [
      "10,000 automated conversations/month",
      "Everything in Starter",
      "Advanced analytics & reports",
      "A/B testing",
      "Priority support",
      "10 Instagram accounts",
      "Custom integrations",
      "Team collaboration",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$199",
    description: "For agencies and large businesses",
    icon: Crown,
    color: "purple",
    features: [
      "Unlimited conversations",
      "Everything in Growth",
      "Dedicated account manager",
      "24/7 phone support",
      "Unlimited Instagram accounts",
      "White-label options",
      "Custom development",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export function PricingSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed")
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = sectionRef.current?.querySelectorAll(".scroll-reveal")
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 md:py-32 relative overflow-hidden" id="pricing">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-20 scroll-reveal">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Simple, <span className="text-orange">Transparent</span> Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free for 14 days. No credit card required. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            return (
              <div
                key={plan.name}
                className={`scroll-reveal relative bg-card border-2 ${plan.popular ? `border-${plan.color} md:scale-105` : "border-border"} rounded-3xl p-6 md:p-8 hover:border-${plan.color} transition-all duration-300 group`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div
                    className={`absolute -top-4 left-1/2 -translate-x-1/2 bg-${plan.color} text-black px-6 py-2 rounded-full text-sm font-bold`}
                  >
                    Most Popular
                  </div>
                )}

                {/* Icon */}
                <div className={`w-16 h-16 bg-${plan.color}/10 rounded-2xl flex items-center justify-center mb-6`}>
                  <Icon className={`w-8 h-8 text-${plan.color}`} />
                </div>

                {/* Plan name */}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-8">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>

                {/* CTA */}
                {plan.cta === "Contact Sales" ? (
                  <a
                    href="https://calendly.com/your-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mb-8"
                  >
                    <Button
                      className={`w-full ${plan.popular ? `bg-${plan.color} text-black hover:bg-${plan.color}/90` : "bg-card border-2 border-border hover:border-${plan.color} hover:text-${plan.color}"}`}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </a>
                ) : (
                  <Link href="/dashboard" className="block mb-8">
                    <Button
                      className={`w-full ${plan.popular ? `bg-${plan.color} text-black hover:bg-${plan.color}/90` : "bg-card border-2 border-border hover:border-${plan.color} hover:text-${plan.color}"}`}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                )}

                {/* Features */}
                <div className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full bg-${plan.color}/10 flex items-center justify-center flex-shrink-0 mt-0.5`}
                      >
                        <Check className={`w-3 h-3 text-${plan.color}`} />
                      </div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Money-back guarantee */}
        <div className="text-center mt-16 scroll-reveal">
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-card border-2 border-green/20 rounded-2xl">
            <div className="w-12 h-12 bg-green/10 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-green" />
            </div>
            <div className="text-left">
              <p className="font-semibold">30-Day Money-Back Guarantee</p>
              <p className="text-sm text-muted-foreground">Not satisfied? Get a full refund, no questions asked.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
