"use client"

import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

interface PersonalitySliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  description?: string
  icon?: string
}

export function PersonalitySlider({ label, value, onChange, description, icon }: PersonalitySliderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium flex items-center gap-2">
          {icon && <span className="text-lg">{icon}</span>}
          {label}
        </Label>
        <span className="text-sm text-muted-foreground font-mono">{value}/10</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        max={10}
        min={1}
        step={1}
        className="w-full"
      />
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
  )
}
