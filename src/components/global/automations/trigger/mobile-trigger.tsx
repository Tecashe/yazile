"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Info,
  KeySquare,
  MessageSquare,
  Zap,
  LifeBuoy,
  Plus,
  Trash2,
  ArrowRight,
  Clock,
  Users,
  CheckCircle,
  Tag,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { MobileNavigation } from "./mobile-nav"

// Mock data types - replace with your actual types
type TriggerType = "COMMENT" | "DM"
type ListenMode = "KEYWORDS" | "ALL_MESSAGES"

type Props = {
  id: string
  onSave?: (data: any) => void
  initialData?: any
}

export const MobileTrigger = ({ id, onSave, initialData }: Props) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [triggerType, setTriggerType] = useState<TriggerType | null>(null)
  const [listenMode, setListenMode] = useState<ListenMode>("KEYWORDS")
  const [keywords, setKeywords] = useState<string[]>([])
  const [newKeyword, setNewKeyword] = useState("")
  const [isFallback, setIsFallback] = useState(false)
  const [fallbackMessage, setFallbackMessage] = useState("How can I help you today?")
  const [buttons, setButtons] = useState([
    { name: "Product Info", payload: "product info" },
    { name: "Pricing", payload: "pricing" },
    { name: "Support", payload: "support" },
  ])

  const stepLabels = ["Setup Guide", "Choose Trigger", "Configure Settings", "Review & Test"]

  const totalSteps = stepLabels.length

  // Check if user can proceed to next step
  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return true // Setup guide
      case 1:
        return triggerType !== null // Must select trigger type
      case 2:
        return isFallback || (listenMode === "KEYWORDS" ? keywords.length > 0 : true)
      case 3:
        return true // Review step
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep < totalSteps - 1 && canProceed()) {
      setCurrentStep(currentStep + 1)
    } else if (currentStep === totalSteps - 1) {
      // Complete the setup
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (step: number) => {
    // Only allow going to previous steps or current step
    if (step <= currentStep) {
      setCurrentStep(step)
    }
  }

  const handleComplete = () => {
    const data = {
      triggerType,
      listenMode,
      keywords,
      isFallback,
      fallbackMessage,
      buttons,
    }
    onSave?.(data)
  }

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()])
      setNewKeyword("")
    }
  }

  const removeKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index))
  }

  const addButton = () => {
    setButtons([...buttons, { name: "", payload: "" }])
  }

  const updateButton = (index: number, field: string, value: string) => {
    const newButtons = [...buttons]
    newButtons[index] = { ...newButtons[index], [field]: value }
    setButtons(newButtons)
  }

  const removeButton = (index: number) => {
    setButtons(buttons.filter((_, i) => i !== index))
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-32">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-500" />
                  Welcome to Automation Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Let's create your first automation in just a few simple steps. This guide will help you set up
                  triggers that respond to your customers automatically.
                </p>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Choose Your Trigger</h4>
                      <p className="text-sm text-muted-foreground">Select when your automation should activate</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Configure Settings</h4>
                      <p className="text-sm text-muted-foreground">Set up keywords and response options</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Review & Test</h4>
                      <p className="text-sm text-muted-foreground">Preview your automation before going live</p>
                    </div>
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Pro Tip</AlertTitle>
                  <AlertDescription>
                    Start with keyword triggers for better control, then upgrade to AI-powered responses as you get
                    comfortable.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </motion.div>
        )

      case 1:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-32">
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Trigger Type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setTriggerType("COMMENT")}
                    className={cn(
                      "p-4 rounded-lg border-2 cursor-pointer transition-all",
                      triggerType === "COMMENT"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                        : "border-border hover:border-blue-300",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Instagram Comments</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Respond when someone comments on your posts
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            Auto Response
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            <Users className="h-3 w-3 mr-1" />
                            Private DM
                          </Badge>
                        </div>
                      </div>
                      {triggerType === "COMMENT" && <CheckCircle className="h-5 w-5 text-blue-500" />}
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setTriggerType("DM")}
                    className={cn(
                      "p-4 rounded-lg border-2 cursor-pointer transition-all",
                      triggerType === "DM"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                        : "border-border hover:border-blue-300",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                        <MessageSquare className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Direct Messages</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Respond when someone sends you a direct message
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            Auto Response
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            <Users className="h-3 w-3 mr-1" />
                            Private DM
                          </Badge>
                        </div>
                      </div>
                      {triggerType === "DM" && <CheckCircle className="h-5 w-5 text-blue-500" />}
                    </div>
                  </motion.div>
                </div>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="fallback"
                      checked={isFallback}
                      onChange={(e) => setIsFallback(e.target.checked)}
                      className="mt-1 h-4 w-4 accent-blue-500"
                    />
                    <div>
                      <label htmlFor="fallback" className="font-medium flex items-center gap-2">
                        <LifeBuoy className="h-4 w-4 text-blue-500" />
                        Set as default fallback automation
                      </label>
                      <p className="text-sm text-muted-foreground mt-1">
                        This automation will respond to messages that don't match any keywords. Perfect for starting
                        conversations with new customers.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )

      case 2:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-32">
            {isFallback ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LifeBuoy className="h-5 w-5 text-blue-500" />
                    Fallback Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <LifeBuoy className="h-4 w-4" />
                    <AlertTitle>Fallback Automation</AlertTitle>
                    <AlertDescription>
                      This automation will be triggered when a message doesn't match any keywords. It's a great way to
                      start conversations with new customers.
                    </AlertDescription>
                  </Alert>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Fallback Message</label>
                    <Textarea
                      value={fallbackMessage}
                      onChange={(e) => setFallbackMessage(e.target.value)}
                      placeholder="Enter your fallback message here..."
                      className="min-h-[100px]"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      This message will be shown when no keywords match. Include a friendly greeting and options.
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-sm font-medium">Quick Reply Buttons</label>
                      <Button onClick={addButton} size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {buttons.map((button, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <Input
                            value={button.name}
                            onChange={(e) => updateButton(index, "name", e.target.value)}
                            placeholder="Button text"
                            className="flex-1"
                          />
                          <Input
                            value={button.payload}
                            onChange={(e) => updateButton(index, "payload", e.target.value)}
                            placeholder="Keyword"
                            className="flex-1"
                          />
                          <Button variant="destructive" size="icon" onClick={() => removeButton(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Preview</h4>
                      <div className="bg-background p-4 rounded-lg border">
                        <p className="mb-3">{fallbackMessage}</p>
                        <div className="flex flex-wrap gap-2">
                          {buttons.map((button, index) => (
                            <Button key={index} variant="outline" size="sm">
                              {button.name || "Button"} <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Configure Automation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Choose Listening Mode</h3>

                    <div className="space-y-3">
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setListenMode("KEYWORDS")}
                        className={cn(
                          "p-4 rounded-lg border-2 cursor-pointer transition-all",
                          listenMode === "KEYWORDS"
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                            : "border-border hover:border-blue-300",
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <KeySquare className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">Keyword Triggers</h4>
                              <Badge variant="secondary" className="text-xs">
                                Recommended
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Only respond when customers use specific keywords you define
                            </p>
                            <div className="space-y-1 text-xs text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                                <span>More targeted responses</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                                <span>Better control over triggers</span>
                              </div>
                            </div>
                          </div>
                          {listenMode === "KEYWORDS" && <CheckCircle className="h-5 w-5 text-blue-500" />}
                        </div>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setListenMode("ALL_MESSAGES")}
                        className={cn(
                          "p-4 rounded-lg border-2 cursor-pointer transition-all",
                          listenMode === "ALL_MESSAGES"
                            ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20"
                            : "border-border hover:border-purple-300",
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                            <MessageSquare className="h-5 w-5 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">Listen to Everything</h4>
                              <Badge variant="secondary" className="text-xs">
                                Advanced
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Respond to any message, continuing conversations naturally
                            </p>
                            <div className="space-y-1 text-xs text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                                <span>Natural conversation flow</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                                <span>More human-like interaction</span>
                              </div>
                            </div>
                          </div>
                          {listenMode === "ALL_MESSAGES" && <CheckCircle className="h-5 w-5 text-purple-500" />}
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {listenMode === "KEYWORDS" && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Tag className="h-4 w-4 text-blue-500" />
                        <label className="font-medium">Trigger Keywords</label>
                      </div>

                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            placeholder="Add a keyword..."
                            onKeyPress={(e) => e.key === "Enter" && addKeyword()}
                            className="flex-1"
                          />
                          <Button onClick={addKeyword} disabled={!newKeyword.trim()}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-2 min-h-[60px] p-3 bg-muted/50 rounded-lg">
                          {keywords.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                              No keywords added yet. Add some keywords to get started.
                            </p>
                          ) : (
                            keywords.map((keyword, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.05 }}
                                className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                              >
                                <span>{keyword}</span>
                                <button
                                  onClick={() => removeKeyword(index)}
                                  className="hover:text-red-500 transition-colors"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </motion.div>
                            ))
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground">
                          Press Enter or click the + button to add keywords. Add 3-5 keywords for best results.
                        </p>
                      </div>
                    </div>
                  )}

                  {listenMode === "ALL_MESSAGES" && (
                    <Alert>
                      <Zap className="h-4 w-4" />
                      <AlertTitle>Open Listener Mode</AlertTitle>
                      <AlertDescription>
                        Your automation will respond to any message from customers, allowing for natural conversation
                        flow. This works great with AI-powered responses.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}
          </motion.div>
        )

      case 3:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-32">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Review Your Automation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Trigger Type</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {triggerType === "COMMENT" ? "Instagram Comments" : "Direct Messages"}
                      </Badge>
                      {isFallback && (
                        <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950 text-blue-600">
                          Fallback Automation
                        </Badge>
                      )}
                    </div>
                  </div>

                  {!isFallback && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Listening Mode</h4>
                      <Badge variant="secondary">
                        {listenMode === "KEYWORDS" ? "Keyword Triggers" : "Listen to Everything"}
                      </Badge>

                      {listenMode === "KEYWORDS" && keywords.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm text-muted-foreground mb-2">Keywords ({keywords.length}):</p>
                          <div className="flex flex-wrap gap-2">
                            {keywords.map((keyword, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {isFallback && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Fallback Message</h4>
                      <p className="text-sm text-muted-foreground mb-3">{fallbackMessage}</p>

                      {buttons.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Quick Reply Buttons:</p>
                          <div className="flex flex-wrap gap-2">
                            {buttons.map((button, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {button.name} → {button.payload}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Ready to Go Live!</AlertTitle>
                  <AlertDescription>
                    Your automation is configured and ready to start responding to customers. You can always come back
                    and modify these settings later.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>
      </div>

      <MobileNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onStepClick={handleStepClick}
        canProceed={canProceed()}
        isLastStep={currentStep === totalSteps - 1}
        stepLabels={stepLabels}
      />
    </div>
  )
}
