"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import { ScrollAnimation } from "./scroll-animation"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--bright-cyan)] rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--bright-orange)] rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <ScrollAnimation animation="fadeUp">
              <div className="inline-block mb-6 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium">
                🚀 Automate Your Instagram DMs
              </div>
            </ScrollAnimation>

            <ScrollAnimation animation="fadeUp" delay={100}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight text-balance">
                Turn Instagram DMs into <span className="text-accent">Sales Machines</span>
              </h1>
            </ScrollAnimation>

            <ScrollAnimation animation="fadeUp" delay={200}>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed text-pretty">
                Yazzil automates your Instagram conversations with AI-powered responses, lead qualification, and
                seamless CRM integration. Never miss a potential customer again.
              </p>
            </ScrollAnimation>

            <ScrollAnimation animation="fadeUp" delay={300}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6">
                  Start Free Trial
                  <ArrowRight className="ml-2" size={20} />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
                  <Play className="mr-2" size={20} />
                  Watch Demo
                </Button>
              </div>
            </ScrollAnimation>

            <ScrollAnimation animation="fadeUp" delay={400}>
              <div className="mt-8 flex items-center gap-6 justify-center lg:justify-start text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  14-day free trial
                </div>
              </div>
            </ScrollAnimation>
          </div>

          {/* Right Content - Hero Image */}
          <ScrollAnimation animation="scale" delay={200}>
            <div className="relative">
              {/* Creative container with diagonal cut */}
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-[var(--bright-cyan)] opacity-10" />
                <img src="/instagram-dm-automation-dashboard-mockup.jpg" alt="Yazzil Dashboard" className="w-full h-full object-cover" />
                {/* Floating stat card */}
                <div className="absolute bottom-6 left-6 bg-card/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <div className="text-2xl font-bold text-accent">+247%</div>
                  <div className="text-sm text-muted-foreground">Response Rate</div>
                </div>
                {/* Floating stat card */}
                <div className="absolute top-6 right-6 bg-card/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <div className="text-2xl font-bold text-accent">10k+</div>
                  <div className="text-sm text-muted-foreground">DMs Automated</div>
                </div>
              </div>

              {/* Decorative element */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[var(--bright-orange)] rounded-full opacity-30 blur-2xl -z-10" />
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  )
}
