"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Plus, X } from "lucide-react"

interface AchievementsProps {
  formData: Record<string, any>
  updateFormData: (key: string, value: any) => void
}

export default function Achievements({ formData, updateFormData }: AchievementsProps) {
  const [achievements, setAchievements] = useState<string[]>(formData.achievements || [])
  const [newAchievement, setNewAchievement] = useState("")

  const addAchievement = () => {
    if (newAchievement.trim() && achievements.length < 5) {
      const newAchievements = [...achievements, newAchievement.trim()]
      setAchievements(newAchievements)
      updateFormData("achievements", newAchievements)
      setNewAchievement("")
    }
  }

  const removeAchievement = (index: number) => {
    const newAchievements = achievements.filter((_, i) => i !== index)
    setAchievements(newAchievements)
    updateFormData("achievements", newAchievements)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Achievements & Milestones</h2>
          <p className="text-muted-foreground">Share your proudest moments as a creator</p>
        </div>

        <div className="space-y-6">
          {/* Add Achievement */}
          <div className="space-y-2">
            <Label htmlFor="achievement">Add an achievement (up to 5)</Label>
            <div className="flex gap-2">
              <Input
                id="achievement"
                placeholder="e.g., Reached 100K followers, Featured in major publication..."
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addAchievement()}
                disabled={achievements.length >= 5}
              />
              <Button
                onClick={addAchievement}
                disabled={!newAchievement.trim() || achievements.length >= 5}
                size="icon"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{achievements.length}/5 achievements added</p>
          </div>

          {/* Achievement List */}
          {achievements.length > 0 && (
            <div className="space-y-3">
              <Label>Your Achievements</Label>
              <div className="space-y-2">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <Trophy className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                    <span className="flex-1 text-sm">{achievement}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeAchievement(index)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Achievements */}
          <div className="space-y-3">
            <Label>Suggested Achievement Categories</Label>
            <div className="flex flex-wrap gap-2">
              {[
                "Follower Milestones",
                "Brand Partnerships",
                "Media Features",
                "Awards & Recognition",
                "Viral Content",
                "Community Impact",
              ].map((category) => (
                <Badge key={category} variant="outline" className="cursor-pointer hover:bg-primary/10">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
