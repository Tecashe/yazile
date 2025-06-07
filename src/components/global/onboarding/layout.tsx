"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface OnboardingLayoutProps {
  children: ReactNode
  currentStep: number
  totalSteps: number
  progress: number
  userType: "influencer" | "regular" | null
  onNext: () => void
  onPrevious: () => void
  isSubmitting: boolean
  isCompleting: boolean
}

export default function OnboardingLayout({
  children,
  currentStep,
  totalSteps,
  progress,
  userType,
  onNext,
  onPrevious,
  isSubmitting,
  isCompleting,
}: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Yazzil</h1>
          </motion.div>

          {userType && currentStep > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="text-sm text-muted-foreground">
                  Step {currentStep} of {totalSteps}
                </div>
              </div>

              <div className="max-w-md mx-auto">
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>Getting Started</span>
                  <span>Ready to Go!</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
          <div className="flex-1">{children}</div>

          {/* Navigation */}
          {userType && currentStep > 0 && !isCompleting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between mt-8"
            >
              <Button variant="outline" onClick={onPrevious} disabled={isSubmitting}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <Button onClick={onNext} disabled={isSubmitting} className="min-w-[120px]">
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : currentStep === totalSteps ? (
                  "Complete Setup"
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
