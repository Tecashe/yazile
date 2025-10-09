"use client"

import { ScrollAnimation } from "./scroll-animation"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "E-commerce Owner",
    company: "StyleHub",
    content: "Yazzil increased our response rate by 300% and converted 2x more leads. The ROI is incredible!",
    image: "/professional-woman-headshot.png",
    rating: 5,
    color: "var(--bright-cyan)",
  },
  {
    name: "Michael Chen",
    role: "Marketing Director",
    company: "FitLife",
    content: "We went from manually responding to 50 DMs a day to automating 500+. Game changer for our team.",
    image: "/professional-man-headshot.png",
    rating: 5,
    color: "var(--bright-orange)",
  },
  {
    name: "Emma Rodriguez",
    role: "Social Media Manager",
    company: "BeautyBox",
    content: "The AI understands context so well, our customers can't tell it's automated. Absolutely brilliant!",
    image: "/avatar-1.png",
    rating: 5,
    color: "var(--bright-green)",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation animation="fadeUp">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
              Loved by Thousands of Businesses
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              See what our customers have to say about their results
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <ScrollAnimation key={index} animation="scale" delay={index * 100}>
              <div
                className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border-2 hover:scale-105"
                style={{ borderColor: `${testimonial.color}40` }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} fill={testimonial.color} style={{ color: testimonial.color }} />
                  ))}
                </div>

                <p className="text-card-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>

                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-bold text-card-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  )
}
