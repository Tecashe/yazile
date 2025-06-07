"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DollarSign } from "lucide-react"

// Income ranges
const INCOME_RANGES = [
  { min: 0, max: 1000, label: "Up to $1,000/month", level: "Starter" },
  { min: 1000, max: 5000, label: "$1,000 - $5,000/month", level: "Growing" },
  { min: 5000, max: 10000, label: "$5,000 - $10,000/month", level: "Established" },
  { min: 10000, max: 20000, label: "$10,000 - $20,000/month", level: "Professional" },
  { min: 20000, max: 50000, label: "$20,000 - $50,000/month", level: "Elite" },
  { min: 50000, max: 100000, label: "$50,000+/month", level: "Celebrity" },
]

interface IncomeGoalsProps {
  formData: Record<string, any>
  updateFormData: (key: string, value: any) => void
  userType: "influencer" | "regular"
}

export default function IncomeGoals({ formData, updateFormData, userType }: IncomeGoalsProps) {
  const isInfluencer = userType === "influencer"
  const [incomeGoal, setIncomeGoal] = useState(formData.incomeGoal || 5000)
  const [selectedIncomeRange, setSelectedIncomeRange] = useState(formData.selectedIncomeRange || 1)
  const [acceptedTerms, setAcceptedTerms] = useState(formData.acceptedTerms || false)

  const handleIncomeRangeSelect = (index: number) => {
    setSelectedIncomeRange(index)
    const newIncomeGoal = INCOME_RANGES[index].min + (INCOME_RANGES[index].max - INCOME_RANGES[index].min) / 2
    setIncomeGoal(newIncomeGoal)
    updateFormData("incomeGoal", newIncomeGoal)
    updateFormData("selectedIncomeRange", index)
  }

  const handle = (value: number[]) => {
    setIncomeGoal(value[0])
    updateFormData("incomeGoal", value[0])
  }

  const handleTermsChange = (checked: boolean) => {
    setAcceptedTerms(checked)
    updateFormData("acceptedTerms", checked)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{isInfluencer ? "Income Goals" : "Budget Planning"}</h2>
          <p className="text-muted-foreground">
            {isInfluencer ? "What are your monthly income goals?" : "What's your monthly marketing budget?"}
          </p>
        </div>

        <div className="space-y-8">
          {/* Income Range Selection */}
          <div className="space-y-4">
            <Label className="text-lg">{isInfluencer ? "Target Monthly Income" : "Monthly Marketing Budget"}</Label>
            <RadioGroup
              value={selectedIncomeRange.toString()}
              onValueChange={(value) => handleIncomeRangeSelect(Number.parseInt(value))}
              className="space-y-3"
            >
              {INCOME_RANGES.map((range, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <RadioGroupItem value={index.toString()} id={`range-${index}`} />
                  <Label htmlFor={`range-${index}`} className="flex-1 flex items-center justify-between">
                    <span>{range.label}</span>
                    <Badge variant={selectedIncomeRange === index ? "default" : "secondary"}>{range.level}</Badge>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Fine-tune with slider */}
          <div className="space-y-4">
            <Label className="text-lg">Fine-tune your goal</Label>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">${incomeGoal.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">per month</div>
              </div>

              <Slider value={[incomeGoal]} onValueChange={handle} max={100000} min={0} step={500} className="w-full" />

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>$0</span>
                <span>$100,000+</span>
              </div>
            </div>
          </div>

          {/* Terms and conditions */}
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox id="terms" checked={acceptedTerms} onCheckedChange={handleTermsChange} />
              <Label htmlFor="terms" className="text-sm leading-relaxed">
                I agree to the{" "}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
                . I understand that this platform will help me{" "}
                {isInfluencer ? "connect with brands" : "find influencers"} and manage{" "}
                {isInfluencer ? "collaborations" : "campaigns"}.
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
