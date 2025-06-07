"use client"

import { motion } from "framer-motion"
import { Building2, Star, ArrowRight, Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// User type definitions
const USER_TYPES = {
  business: {
    title: "Business Owner",
    subtitle: "Scale your business with influencer marketing",
    icon: Building2,
    color: "from-blue-500 to-cyan-500",
    benefits: [
      "Find perfect influencers for your brand",
      "Manage campaigns efficiently",
      "Track ROI and performance",
      "Automate outreach and negotiations",
    ],
  },
  influencer: {
    title: "Content Creator",
    subtitle: "Monetize your influence and grow your brand",
    icon: Star,
    color: "from-purple-500 to-pink-500",
    benefits: [
      "Get discovered by top brands",
      "Negotiate better rates",
      "Manage collaborations seamlessly",
      "Track your earnings and growth",
    ],
  },
}

interface UserTypeSelectionProps {
  onSelect: (type: "influencer" | "regular") => void
  isLoading: boolean
}

export default function UserTypeSelection({ onSelect, isLoading }: UserTypeSelectionProps) {
  return (
    <motion.div
      key="user-type"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center"
    >
      <h2 className="text-3xl font-bold mb-4">Welcome to the Future of Influencer Marketing</h2>
      <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
        Join thousands of businesses and creators who are already transforming their marketing strategy
      </p>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {Object.entries(USER_TYPES).map(([type, config]) => {
          const IconComponent = config.icon
          const userType = type === "business" ? "regular" : "influencer"

          return (
            <motion.div key={type} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card
                className="cursor-pointer border-2 hover:border-primary/50 transition-all duration-300 overflow-hidden group"
                onClick={() => !isLoading && onSelect(userType as "influencer" | "regular")}
              >
                <CardContent className="p-0">
                  <div className={`h-32 bg-gradient-to-r ${config.color} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute top-4 right-4">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-xl font-bold text-white">{config.title}</h3>
                      <p className="text-white/90 text-sm">{config.subtitle}</p>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="space-y-3 mb-6">
                      {config.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                          </div>
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>

                    <Button className="w-full group-hover:bg-primary/90 transition-colors" disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <>
                          Get Started
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Social Proof */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 text-center"
      >
        <p className="text-sm text-muted-foreground mb-6">Trusted by 10,000+ businesses and creators</p>
        <div className="flex items-center justify-center gap-8 opacity-60">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-20 bg-muted rounded" />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
