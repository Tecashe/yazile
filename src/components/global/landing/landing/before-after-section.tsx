"use client"

import type React from "react"

import { useState } from "react"
import { ScrollAnimation } from "./scroll-animation"
import { X, Check } from "lucide-react"

export function BeforeAfterSection() {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)

  const handleMove = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, percentage)))
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const rect = e.currentTarget.getBoundingClientRect()
    handleMove(e.clientX, rect)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const rect = e.currentTarget.getBoundingClientRect()
    handleMove(e.touches[0].clientX, rect)
  }

  const beforePoints = [
    "Manual responses taking hours",
    "Missing potential customers",
    "Inconsistent messaging",
    "No lead tracking",
    "Limited to business hours",
  ]

  const afterPoints = [
    "Instant AI-powered responses",
    "Never miss a conversation",
    "Consistent brand voice",
    "Automatic lead qualification",
    "Available 24/7/365",
  ]

  return (
    <section id="results" className="py-16 md:py-24 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation animation="fadeUp">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
              The Transformation is Real
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              See how Yazzil revolutionizes your Instagram DM workflow
            </p>
          </div>
        </ScrollAnimation>

        <div className="max-w-6xl mx-auto">
          {/* Interactive Before/After Slider */}
          <ScrollAnimation animation="scale" delay={200}>
            <div
              className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl mb-12 cursor-ew-resize"
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onMouseMove={handleMouseMove}
              onTouchStart={() => setIsDragging(true)}
              onTouchEnd={() => setIsDragging(false)}
              onTouchMove={handleTouchMove}
            >
              {/* Before Image */}
              <div className="absolute inset-0">
                <img src="/cluttered-instagram-dm-inbox-before-automation.jpg" alt="Before Yazzil" className="w-full h-full object-cover" />
                <div className="absolute top-6 left-6 bg-destructive text-destructive-foreground px-4 py-2 rounded-full font-bold">
                  BEFORE
                </div>
              </div>

              {/* After Image */}
              <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
                <img src="/organized-automated-instagram-dm-dashboard-after-a.jpg" alt="After Yazzil" className="w-full h-full object-cover" />
                <div className="absolute top-6 right-6 bg-accent text-accent-foreground px-4 py-2 rounded-full font-bold">
                  AFTER
                </div>
              </div>

              {/* Slider Handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-background cursor-ew-resize"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-background rounded-full shadow-lg flex items-center justify-center">
                  <div className="flex gap-1">
                    <div className="w-1 h-6 bg-foreground rounded-full" />
                    <div className="w-1 h-6 bg-foreground rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </ScrollAnimation>

          {/* Before/After Comparison List */}
          <div className="grid md:grid-cols-2 gap-8">
            <ScrollAnimation animation="fadeLeft" delay={300}>
              <div className="bg-card rounded-2xl p-8 border-2 border-destructive/20">
                <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                    <X size={24} className="text-destructive" />
                  </div>
                  Without Yazzil
                </h3>
                <ul className="space-y-4">
                  {beforePoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <X size={20} className="text-destructive mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollAnimation>

            <ScrollAnimation animation="fadeRight" delay={300}>
              <div className="bg-card rounded-2xl p-8 border-2 border-accent/20">
                <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Check size={24} className="text-accent" />
                  </div>
                  With Yazzil
                </h3>
                <ul className="space-y-4">
                  {afterPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check size={20} className="text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </section>
  )
}
