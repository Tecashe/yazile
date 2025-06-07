"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageIcon, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

// Content styles
const CONTENT_STYLES = [
  { name: "Minimalist", icon: "✨", description: "Clean, simple aesthetics" },
  { name: "Vibrant", icon: "🌈", description: "Bold colors and energy" },
  { name: "Vintage", icon: "📷", description: "Retro and nostalgic vibes" },
  { name: "Luxury", icon: "💎", description: "High-end and sophisticated" },
  { name: "Playful", icon: "🎨", description: "Fun and creative expression" },
  { name: "Nature", icon: "🌿", description: "Organic and earthy elements" },
]

interface ContentStyleProps {
  formData: Record<string, any>
  updateFormData: (key: string, value: any) => void
}

export default function ContentStyle({ formData, updateFormData }: ContentStyleProps) {
  const selectedContentStyle = formData.selectedContentStyle || ""

  const handleStyleSelect = (style: string) => {
    updateFormData("selectedContentStyle", style)
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold mb-2">Content Style</h2>
        <p className="text-muted-foreground mb-6">Select your preferred aesthetic</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {CONTENT_STYLES.map((style) => (
            <motion.div key={style.name} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Card
                className={cn(
                  "cursor-pointer border-2 transition-all",
                  selectedContentStyle === style.name
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50",
                )}
                onClick={() => handleStyleSelect(style.name)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{style.icon}</div>
                  <div className="font-medium mb-1">{style.name}</div>
                  <div className="text-xs text-muted-foreground">{style.description}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Visual Mood Board</h3>
          <p className="text-sm text-muted-foreground mb-4">Add images that represent your content style (optional)</p>

          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="group relative aspect-square overflow-hidden rounded-md bg-muted">
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                  <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
