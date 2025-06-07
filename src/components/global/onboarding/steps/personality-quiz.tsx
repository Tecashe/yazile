"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Brain, ArrowRight } from "lucide-react"

// Quiz questions
const QUIZ_QUESTIONS = [
  {
    question: "How do you prefer to approach marketing campaigns?",
    options: [
      { value: "data-driven", label: "Data-driven and analytical" },
      { value: "creative", label: "Creative and intuitive" },
      { value: "balanced", label: "Balanced approach" },
      { value: "experimental", label: "Experimental and testing-focused" },
    ],
  },
  {
    question: "What's your primary business goal?",
    options: [
      { value: "growth", label: "Rapid growth and expansion" },
      { value: "stability", label: "Steady, sustainable growth" },
      { value: "innovation", label: "Innovation and market leadership" },
      { value: "community", label: "Building strong community" },
    ],
  },
  {
    question: "How do you handle marketing budgets?",
    options: [
      { value: "conservative", label: "Conservative and careful" },
      { value: "aggressive", label: "Aggressive investment" },
      { value: "strategic", label: "Strategic allocation" },
      { value: "flexible", label: "Flexible and adaptive" },
    ],
  },
]

// Personality types
const PERSONALITY_TYPES = {
  "data-driven-growth-conservative": {
    type: "Strategic Analyst",
    description: "You prefer data-driven decisions with careful budget management",
    traits: ["Analytical", "Risk-aware", "Growth-focused"],
  },
  "creative-community-flexible": {
    type: "Creative Connector",
    description: "You value creativity and community building with flexible approaches",
    traits: ["Creative", "Community-focused", "Adaptable"],
  },
  "balanced-stability-strategic": {
    type: "Balanced Builder",
    description: "You take a balanced approach to sustainable business growth",
    traits: ["Balanced", "Sustainable", "Strategic"],
  },
  default: {
    type: "Adaptive Entrepreneur",
    description: "You're flexible and adapt your approach based on circumstances",
    traits: ["Adaptive", "Flexible", "Opportunistic"],
  },
}

interface PersonalityQuizProps {
  formData: Record<string, any>
  updateFormData: (key: string, value: any) => void
}

export default function PersonalityQuiz({ formData, updateFormData }: PersonalityQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>(formData.quizAnswers || [])
  const [personalityResult, setPersonalityResult] = useState(formData.personalityResult || null)

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
    setAnswers(newAnswers)
    updateFormData("quizAnswers", newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Calculate personality type
      const personalityKey = answers.join("-")
      const personality =
        PERSONALITY_TYPES[personalityKey as keyof typeof PERSONALITY_TYPES] || PERSONALITY_TYPES.default

      setPersonalityResult(personality)
      updateFormData("personalityResult", personality)
    }
  }

  const canProceed = answers[currentQuestion] !== undefined

  if (personalityResult) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="h-16 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your Business Personality</h2>
            <p className="text-muted-foreground">Here&apos;s what we learned about your approach</p>
          </div>

          <div className="text-center space-y-4">
            <div className="text-3xl font-bold text-primary">{personalityResult.type}</div>
            <p className="text-lg text-muted-foreground">{personalityResult.description}</p>

            <div className="flex justify-center gap-2 mt-4">
              {personalityResult.traits.map((trait: string) => (
                <span key={trait} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {trait}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Business Personality Quiz</h2>
          <p className="text-muted-foreground">Help us understand your business approach</p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
            </span>
            <span>{Math.round(((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100)}% complete</span>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{QUIZ_QUESTIONS[currentQuestion].question}</h3>

            <RadioGroup value={answers[currentQuestion] || ""} onValueChange={handleAnswerSelect} className="space-y-3">
              {QUIZ_QUESTIONS[currentQuestion].options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="flex-1">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Button onClick={handleNext} disabled={!canProceed} className="w-full">
            {currentQuestion === QUIZ_QUESTIONS.length - 1 ? "Get My Results" : "Next Question"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
