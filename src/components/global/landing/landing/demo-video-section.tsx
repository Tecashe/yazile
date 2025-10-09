"use client"

import { ScrollAnimation } from "./scroll-animation"
import { Play } from "lucide-react"

export function DemoVideoSection() {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation animation="fadeUp">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
              See Yazzil in Action
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Watch how easy it is to automate your Instagram DMs
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation animation="scale" delay={200}>
          <div className="max-w-5xl mx-auto">
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl group cursor-pointer">
              {/* Video thumbnail */}
              <img src="/yazzil-demo-video-thumbnail-with-play-button.jpg" alt="Demo Video" className="w-full h-full object-cover" />

              {/* Play button overlay */}
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-accent rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <Play size={40} className="text-accent-foreground ml-1" fill="currentColor" />
                </div>
              </div>

              {/* Duration badge */}
              <div className="absolute bottom-6 right-6 bg-primary/90 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
                2:30
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  )
}
