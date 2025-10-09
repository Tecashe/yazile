"use client"

import { ScrollAnimation } from "./scroll-animation"
import { MessageSquare, Zap, Users, BarChart3, Clock, Shield } from "lucide-react"

const features = [
  {
    icon: MessageSquare,
    title: "AI-Powered Responses",
    description: "Smart automation that understands context and responds naturally to your customers.",
    color: "var(--bright-cyan)",
  },
  {
    icon: Zap,
    title: "Instant Replies",
    description: "Never keep a customer waiting. Respond to DMs in milliseconds, not hours.",
    color: "var(--bright-orange)",
  },
  {
    icon: Users,
    title: "Lead Qualification",
    description: "Automatically qualify leads and route them to the right team member.",
    color: "var(--bright-green)",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track performance, conversion rates, and customer insights in real-time.",
    color: "var(--bright-yellow)",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Your automation works around the clock, even when you sleep.",
    color: "var(--bright-blue)",
  },
  {
    icon: Shield,
    title: "Secure & Compliant",
    description: "Enterprise-grade security with full Instagram API compliance.",
    color: "var(--bright-cyan)",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation animation="fadeUp">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
              Everything You Need to Scale
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Powerful features designed to transform your Instagram DMs into a revenue-generating machine.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <ScrollAnimation key={index} animation="scale" delay={index * 100}>
                <div className="group relative bg-card rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-border hover:border-transparent overflow-hidden">
                  {/* Background color on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                    style={{ backgroundColor: feature.color }}
                  />

                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${feature.color}20` }}
                  >
                    <Icon size={28} style={{ color: feature.color }} />
                  </div>

                  <h3 className="text-xl font-bold text-card-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </ScrollAnimation>
            )
          })}
        </div>
      </div>
    </section>
  )
}
