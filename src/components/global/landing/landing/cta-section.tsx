"use client"

import { ScrollAnimation } from "./scroll-animation"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-16 md:py-24 lg:py-32 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[var(--bright-cyan)] rounded-full opacity-10 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[var(--bright-orange)] rounded-full opacity-10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation animation="scale">
          <div className="max-w-4xl mx-auto text-center bg-card rounded-3xl p-12 md:p-16 shadow-2xl border border-border">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
              Ready to Transform Your Instagram DMs?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty">
              Join thousands of businesses already automating their customer conversations with Yazzil. Start your free
              14-day trial today—no credit card required.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6">
                Start Free Trial
                <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
                Schedule a Demo
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="text-accent" size={16} />
                14-day free trial
              </div>
              <div className="flex items-center gap-2">
                <Check className="text-accent" size={16} />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <Check className="text-accent" size={16} />
                Cancel anytime
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  )
}

function Check({ className, size }: { className?: string; size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
