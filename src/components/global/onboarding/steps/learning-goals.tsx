"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Check, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

// Learning topics
const LEARNING_TOPICS = [
  { name: "Influencer Marketing Strategy", icon: "📈", description: "Learn how to create effective campaigns" },
  { name: "ROI Measurement", icon: "📊", description: "Track and measure campaign performance" },
  { name: "Content Creation", icon: "🎨", description: "Create engaging brand content" },
  { name: "Social Media Trends", icon: "📱", description: "Stay updated with latest trends" },
  { name: "Brand Partnerships", icon: "🤝", description: "Build lasting influencer relationships" },
  { name: "Budget Management", icon: "💰", description: "Optimize your marketing spend" },
]

interface LearningGoalsProps {
  formData: Record<string, any>
  updateFormData: (key: string, value: any) => void
}

export default function LearningGoals({ formData, updateFormData }: LearningGoalsProps) {
  const selectedLearningTopics = formData.selectedLearningTopics || []

  const toggleLearningTopic = (topic: string) => {
    const isSelected = selectedLearningTopics.includes(topic)
    const newTopics = isSelected
      ? selectedLearningTopics.filter((t: string) => t !== topic)
      : [...selectedLearningTopics, topic]

    updateFormData("selectedLearningTopics", newTopics)
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Learning Goals</h2>
          <p className="text-muted-foreground">What would you like to learn about influencer marketing?</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {LEARNING_TOPICS.map((topic) => {
            const isSelected = selectedLearningTopics.includes(topic.name)

            return (
              <motion.div key={topic.name} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card
                  className={cn(
                    "cursor-pointer border-2 transition-all",
                    isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                  )}
                  onClick={() => toggleLearningTopic(topic.name)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{topic.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{topic.name}</h3>
                        <p className="text-sm text-muted-foreground">{topic.description}</p>
                      </div>
                      {isSelected && <Check className="h-5 w-5 text-primary" />}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {selectedLearningTopics.length} topic{selectedLearningTopics.length !== 1 ? "s" : ""} selected
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
