"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Content categories
const CONTENT_CATEGORIES = [
  { name: "Fashion", icon: "👗", color: "bg-pink-100 dark:bg-pink-900" },
  { name: "Beauty", icon: "💄", color: "bg-purple-100 dark:bg-purple-900" },
  { name: "Fitness", icon: "💪", color: "bg-green-100 dark:bg-green-900" },
  { name: "Travel", icon: "✈️", color: "bg-blue-100 dark:bg-blue-900" },
  { name: "Food", icon: "🍕", color: "bg-yellow-100 dark:bg-yellow-900" },
  { name: "Lifestyle", icon: "🌿", color: "bg-teal-100 dark:bg-teal-900" },
  { name: "Tech", icon: "📱", color: "bg-gray-100 dark:bg-gray-800" },
  { name: "Gaming", icon: "🎮", color: "bg-indigo-100 dark:bg-indigo-900" },
  { name: "Business", icon: "💼", color: "bg-amber-100 dark:bg-amber-900" },
  { name: "Education", icon: "📚", color: "bg-red-100 dark:bg-red-900" },
  { name: "Art", icon: "🎨", color: "bg-fuchsia-100 dark:bg-fuchsia-900" },
  { name: "Music", icon: "🎵", color: "bg-cyan-100 dark:bg-cyan-900" },
]

// Business industries
const BUSINESS_INDUSTRIES = [
  { name: "Fashion & Beauty", icon: "👗", growth: "+23%" },
  { name: "Food & Beverage", icon: "🍕", growth: "+18%" },
  { name: "Technology", icon: "📱", growth: "+31%" },
  { name: "Health & Fitness", icon: "💪", growth: "+27%" },
  { name: "Travel & Tourism", icon: "✈️", growth: "+15%" },
  { name: "Home & Lifestyle", icon: "🏠", growth: "+22%" },
  { name: "Gaming & Entertainment", icon: "🎮", growth: "+35%" },
  { name: "Finance & Business", icon: "💼", growth: "+19%" },
]

interface ContentCategoriesProps {
  formData: Record<string, any>
  updateFormData: (key: string, value: any) => void
  userType: "influencer" | "regular"
}

export default function ContentCategories({ formData, updateFormData, userType }: ContentCategoriesProps) {
  const isInfluencer = userType === "influencer"
  const categories = isInfluencer ? CONTENT_CATEGORIES : BUSINESS_INDUSTRIES
  const selectedCategories = formData.selectedCategories || []
  const maxCategories = 5

  const handleCategoryToggle = (category: string) => {
    const isSelected = selectedCategories.includes(category)

    if (isSelected) {
      updateFormData(
        "selectedCategories",
        selectedCategories.filter((c: string) => c !== category),
      )
    } else if (selectedCategories.length < maxCategories) {
      updateFormData("selectedCategories", [...selectedCategories, category])
    }
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold mb-2">
          {isInfluencer ? "What's your content niche?" : "What industry are you in?"}
        </h2>
        <p className="text-muted-foreground mb-6">
          {isInfluencer
            ? "Select your primary content categories (up to 5)"
            : "This helps us show you relevant influencers and benchmarks"}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => {
            const isSelected = selectedCategories.includes(category.name)

            return (
              <motion.div key={category.name} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card
                  className={cn(
                    "cursor-pointer border-2 transition-all",
                    isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                  )}
                  onClick={() => handleCategoryToggle(category.name)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <div className="font-medium text-sm mb-1">{category.name}</div>
                    {isInfluencer ? (
                      isSelected && <Check className="h-4 w-4 text-primary mx-auto mt-2" />
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        {category.icon} growth
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {selectedCategories.length}/{maxCategories} selected
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
