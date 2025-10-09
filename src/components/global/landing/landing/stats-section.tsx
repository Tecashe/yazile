"use client"

import { ScrollAnimation } from "./scroll-animation"

const stats = [
  {
    value: "10,000+",
    label: "DMs Automated Daily",
    color: "var(--bright-cyan)",
  },
  {
    value: "95%",
    label: "Response Rate",
    color: "var(--bright-orange)",
  },
  {
    value: "3x",
    label: "More Conversions",
    color: "var(--bright-green)",
  },
  {
    value: "24/7",
    label: "Always Active",
    color: "var(--bright-yellow)",
  },
]

export function StatsSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <ScrollAnimation key={index} animation="fadeUp" delay={index * 100}>
              <div className="text-center">
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-muted-foreground font-medium">{stat.label}</div>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  )
}
