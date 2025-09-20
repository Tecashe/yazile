"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type Props = {
  currentStep: number
  totalSteps: number
  onNext: () => void
  onPrevious: () => void
  onStepClick: (step: number) => void
  canProceed: boolean
  isLastStep: boolean
  stepLabels: string[]
}

export const MobileNavigation = ({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onStepClick,
  canProceed,
  isLastStep,
  stepLabels,
}: Props) => {
  return (
    <div className="sticky bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 z-50">
      {/* Progress indicator */}
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <motion.button
              key={i}
              onClick={() => onStepClick(i)}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200",
                i < currentStep
                  ? "bg-green-500 text-white"
                  : i === currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {i < currentStep ? <Check className="h-4 w-4" /> : <span>{i + 1}</span>}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Step label */}
      <div className="text-center mb-4">
        <p className="text-sm text-muted-foreground">
          Step {currentStep + 1} of {totalSteps}
        </p>
        <p className="font-medium text-foreground">{stepLabels[currentStep]}</p>
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentStep === 0}
          className="flex-1 h-12 bg-transparent"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <Button
          onClick={onNext}
          disabled={!canProceed}
          className={cn("flex-1 h-12", isLastStep ? "bg-green-600 hover:bg-green-700" : "")}
        >
          {isLastStep ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Complete
            </>
          ) : (
            <>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
