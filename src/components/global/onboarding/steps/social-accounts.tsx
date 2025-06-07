"use client"

import { useState } from "react"
import { AtSign, Check, Instagram, MessageCircle, Video } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

// Social platforms
const SOCIAL_PLATFORMS = [
  {
    name: "Instagram",
    icon: Instagram,
    placeholder: "@yourusername",
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
  {
    name: "TikTok",
    icon: Video,
    placeholder: "@yourusername",
    color: "bg-black",
  },
  {
    name: "YouTube",
    icon: Video,
    placeholder: "@yourchannel",
    color: "bg-red-600",
  },
  {
    name: "Twitter",
    icon: MessageCircle,
    placeholder: "@yourusername",
    color: "bg-blue-500",
  },
]

interface SocialAccountsProps {
  formData: Record<string, any>
  updateFormData: (key: string, value: any) => void
  userType: "influencer" | "regular"
}

export default function SocialAccounts({ formData, updateFormData, userType }: SocialAccountsProps) {
  const isInfluencer = userType === "influencer"
  const [socialHandles, setSocialHandles] = useState<Record<string, string>>(formData.socialHandles || {})
  const [analyzing, setAnalyzing] = useState<string | null>(null)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [analysisComplete, setAnalysisComplete] = useState(false)

  const handleSocialHandleChange = (platform: string, value: string) => {
    const newHandles = {
      ...socialHandles,
      [platform]: value,
    }

    setSocialHandles(newHandles)
    updateFormData("socialHandles", newHandles)
  }

  // Mock AI analysis for influencer profiles
  const analyzeProfile = (platform: string, handle: string) => {
    if (!isInfluencer || !handle) return

    setAnalyzing(platform)
    setAnalysisProgress(0)
    setAnalysisComplete(false)

    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setAnalysisComplete(true)

          // Mock analysis result
          const mockResult = {
            followers: Math.floor(1000 + Math.random() * 100000),
            engagement: Math.random() * 8 + 1,
            growthRate: Math.random() * 10,
            topContent: ["Fashion", "Lifestyle", "Travel"],
            audienceDemo: {
              age: "18-34",
              gender: "65% Female, 35% Male",
              location: "US, UK, Canada",
            },
          }

          updateFormData("aiAnalysisResult", mockResult)
          return 100
        }
        return prev + 5
      })
    }, 150)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold mb-2">Social Media Profiles</h2>
        <p className="text-muted-foreground mb-6">
          {isInfluencer
            ? "Connect your social accounts to showcase your reach"
            : "Add your business social media handles"}
        </p>

        <div className="space-y-6">
          {SOCIAL_PLATFORMS.map((platform) => {
            const IconComponent = platform.icon
            const handle = socialHandles[platform.name] || ""
            const isAnalyzing = analyzing === platform.name

            return (
              <div key={platform.name} className="space-y-2">
                <Label className="flex items-center gap-2">
                  <div className={cn("flex h-5 w-5 items-center justify-center rounded-md", platform.color)}>
                    <IconComponent className="h-3 w-3 text-white" />
                  </div>
                  {platform.name}
                </Label>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                    <AtSign className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    placeholder={platform.placeholder}
                    value={handle}
                    onChange={(e) => handleSocialHandleChange(platform.name, e.target.value)}
                    className="flex-1"
                    onBlur={() => analyzeProfile(platform.name, handle)}
                  />
                </div>

                {isInfluencer && isAnalyzing && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Analyzing profile...</span>
                      <span>{analysisProgress}%</span>
                    </div>
                    <div className="h-1 w-full bg-muted overflow-hidden rounded-full">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${analysisProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {isInfluencer && analysisComplete && analyzing === platform.name && (
                  <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    Profile analyzed successfully
                  </div>
                )}
              </div>
            )
          })}

          {isInfluencer && formData.aiAnalysisResult && (
            <div className="mt-4 p-4 border rounded-lg bg-muted/30">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">AI Analysis Results</h3>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">AI Generated</span>
              </div>

              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Followers:</span>
                  <span className="font-medium">{formData.aiAnalysisResult.followers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Engagement Rate:</span>
                  <span className="font-medium">{formData.aiAnalysisResult.engagement.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Growth Rate:</span>
                  <span className="font-medium">+{formData.aiAnalysisResult.growthRate.toFixed(1)}%/month</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
