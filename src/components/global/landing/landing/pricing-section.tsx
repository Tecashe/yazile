"use client"

import { ScrollAnimation } from "./scroll-animation"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Starter",
    price: "$49",
    period: "/month",
    description: "Perfect for small businesses getting started",
    features: [
      "Up to 1,000 DMs/month",
      "AI-powered responses",
      "Basic analytics",
      "Email support",
      "1 Instagram account",
    ],
    color: "var(--bright-cyan)",
    popular: false,
  },
  {
    name: "Professional",
    price: "$149",
    period: "/month",
    description: "For growing businesses that need more",
    features: [
      "Up to 10,000 DMs/month",
      "Advanced AI training",
      "Full analytics dashboard",
      "Priority support",
      "3 Instagram accounts",
      "CRM integration",
      "Custom workflows",
    ],
    color: "var(--bright-orange)",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large teams with custom needs",
    features: [
      "Unlimited DMs",
      "Dedicated AI model",
      "White-label solution",
      "24/7 phone support",
      "Unlimited accounts",
      "API access",
      "Custom integrations",
      "Dedicated account manager",
    ],
    color: "var(--bright-green)",
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-16 md:py-24 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation animation="fadeUp">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Choose the plan that fits your business. All plans include a 14-day free trial.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <ScrollAnimation key={index} animation="scale" delay={index * 100}>
              <div
                className={`relative bg-card rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border-2 ${
                  plan.popular ? "scale-105 lg:scale-110 shadow-xl" : "hover:scale-105"
                }`}
                style={{
                  borderColor: plan.popular ? plan.color : "var(--border)",
                }}
              >
                {plan.popular && (
                  <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-bold text-accent-foreground"
                    style={{ backgroundColor: plan.color }}
                  >
                    MOST POPULAR
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-card-foreground mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-5xl font-bold text-card-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>

                <Button
                  className="w-full mb-8 text-accent-foreground"
                  size="lg"
                  style={{
                    backgroundColor: plan.color,
                  }}
                >
                  {plan.name === "Enterprise" ? "Contact Sales" : "Start Free Trial"}
                </Button>

                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check size={20} className="flex-shrink-0 mt-0.5" style={{ color: plan.color }} />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  )
}
