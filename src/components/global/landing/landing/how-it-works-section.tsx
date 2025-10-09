"use client"

import { ScrollAnimation } from "./scroll-animation"

const steps = [
  {
    number: "01",
    title: "Connect Your Instagram",
    description: "Link your Instagram account securely in just 2 clicks. No technical setup required.",
    image: "/instagram-account-connection-interface.jpg",
    color: "var(--bright-cyan)",
  },
  {
    number: "02",
    title: "Train Your AI Assistant",
    description: "Customize responses, set up workflows, and define your brand voice in minutes.",
    image: "/ai-training-dashboard-with-conversation-flows.jpg",
    color: "var(--bright-orange)",
  },
  {
    number: "03",
    title: "Automate & Scale",
    description: "Watch as Yazzil handles conversations, qualifies leads, and drives conversions automatically.",
    image: "/automated-dm-conversations-dashboard-with-analytic.jpg",
    color: "var(--bright-green)",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation animation="fadeUp">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              From setup to automation in under 10 minutes
            </p>
          </div>
        </ScrollAnimation>

        <div className="space-y-24 md:space-y-32">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                index % 2 === 1 ? "lg:grid-flow-dense" : ""
              }`}
            >
              <ScrollAnimation
                animation={index % 2 === 0 ? "fadeLeft" : "fadeRight"}
                delay={100}
                className={index % 2 === 1 ? "lg:col-start-2" : ""}
              >
                <div>
                  <div className="text-6xl md:text-7xl font-bold mb-4 opacity-20" style={{ color: step.color }}>
                    {step.number}
                  </div>
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">{step.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </ScrollAnimation>

              <ScrollAnimation
                animation={index % 2 === 0 ? "fadeRight" : "fadeLeft"}
                delay={200}
                className={index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}
              >
                <div className="relative">
                  {/* Creative image container with offset border */}
                  <div className="absolute -inset-4 rounded-3xl opacity-20" style={{ backgroundColor: step.color }} />
                  <div className="relative aspect-[3/2] rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={step.image || "/placeholder.svg"}
                      alt={step.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Decorative corner element */}
                  <div
                    className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-40 blur-2xl"
                    style={{ backgroundColor: step.color }}
                  />
                </div>
              </ScrollAnimation>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
