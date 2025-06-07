"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Check } from "lucide-react"

// Content frequencies
const CONTENT_FREQUENCIES = ["Daily", "3-5 times per week", "1-2 times per week", "Few times a month"]

// Brand collab types
const BRAND_COLLAB_TYPES = [
  "Sponsored Posts",
  "Brand Ambassador",
  "Affiliate Marketing",
  "Product Reviews",
  "Event Appearances",
  "Content Creation",
]

interface ContentStrategyProps {
  formData: Record<string, any>
  updateFormData: (key: string, value: any) => void
}

export default function ContentStrategy({ formData, updateFormData }: ContentStrategyProps) {
  const [selectedContentFrequency, setSelectedContentFrequency] = useState(formData.selectedContentFrequency || "")
  const [selectedBrandCollabs, setSelectedBrandCollabs] = useState<string[]>(formData.selectedBrandCollabs || [])
  const [selectedContentDays, setSelectedContentDays] = useState<number[]>(formData.selectedContentDays || [])

  const handleContentFrequencyChange = (value: string) => {
    setSelectedContentFrequency(value)
    updateFormData("selectedContentFrequency", value)
  }

  const toggleBrandCollab = (collab: string) => {
    const newCollabs = selectedBrandCollabs.includes(collab)
      ? selectedBrandCollabs.filter((c) => c !== collab)
      : [...selectedBrandCollabs, collab]

    setSelectedBrandCollabs(newCollabs)
    updateFormData("selectedBrandCollabs", newCollabs)
  }

  const toggleContentDay = (day: number) => {
    const newSelectedDays = selectedContentDays.includes(day)
      ? selectedContentDays.filter((d) => d !== day)
      : [...selectedContentDays, day]

    setSelectedContentDays(newSelectedDays)
    updateFormData("selectedContentDays", newSelectedDays)
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold mb-2">Content Strategy</h2>
        <p className="text-muted-foreground mb-6">Tell us about your content creation approach</p>

        <div className="space-y-8">
          {/* Content Frequency */}
          <div className="space-y-4">
            <Label className="text-lg">How often do you post content?</Label>
            <RadioGroup
              value={selectedContentFrequency}
              onValueChange={handleContentFrequencyChange}
              className="grid grid-cols-2 gap-4"
            >
              {CONTENT_FREQUENCIES.map((frequency) => (
                <div key={frequency} className="flex items-center space-x-2">
                  <RadioGroupItem value={frequency} id={`frequency-${frequency}`} />
                  <Label htmlFor={`frequency-${frequency}`}>{frequency}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Content Days */}
          <div className="space-y-4">
            <Label className="text-lg">Which days do you typically post?</Label>
            <div className="grid grid-cols-7 gap-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                <div key={day} className="flex flex-col items-center">
                  <div className="text-xs font-medium text-muted-foreground mb-1">{day}</div>
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                      selectedContentDays.includes(index)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                    onClick={() => toggleContentDay(index)}
                  >
                    {selectedContentDays.includes(index) && <Check className="h-4 w-4" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Brand Collabs */}
          <div className="space-y-4">
            <Label className="text-lg">What types of brand collaborations do you prefer?</Label>
            <div className="grid grid-cols-2 gap-3">
              {BRAND_COLLAB_TYPES.map((collab) => (
                <div key={collab} className="flex items-center space-x-2">
                  <Checkbox
                    id={`collab-${collab}`}
                    checked={selectedBrandCollabs.includes(collab)}
                    onCheckedChange={() => toggleBrandCollab(collab)}
                  />
                  <Label htmlFor={`collab-${collab}`}>{collab}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
