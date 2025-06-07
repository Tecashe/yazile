"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Sparkles, ArrowRight } from "lucide-react"
import confetti from "canvas-confetti"

interface CompletionScreenProps {
  userType: "influencer" | "regular"
}

export default function CompletionScreen({ userType }: CompletionScreenProps) {
  const isInfluencer = userType === "influencer"

  useEffect(() => {
    // Trigger confetti on mount
    const timer = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="border-2 border-primary/20">
        <CardContent className="p-12 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <div className="h-24 w-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h1 className="text-3xl font-bold">Welcome to Yazzil! 🎉</h1>
            <p className="text-lg text-muted-foreground">
              {isInfluencer
                ? "Your creator profile is ready! Start connecting with brands and monetizing your content."
                : "Your business profile is set up! Start discovering influencers and launching campaigns."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 space-y-4"
          >
            <div className="grid gap-3 text-sm">
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Profile created successfully</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>{isInfluencer ? "Social accounts connected" : "Business preferences saved"}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>{isInfluencer ? "Creator dashboard ready" : "Campaign tools activated"}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8"
          >
            <Button size="lg" className="px-8">
              <Sparkles className="mr-2 h-5 w-5" />
              {isInfluencer ? "Go to Creator Dashboard" : "Go to Dashboard"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 text-xs text-muted-foreground"
          >
            Redirecting automatically in 3 seconds...
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
