"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import {
  Globe,
  Building,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Check,
  Loader2,
  Rocket,
  Target,
  Users,
  TrendingUp,
  CreditCard,
  ShoppingBag,
  Calendar,
  Headphones,
  FileText,
  Star,
  MessageCircle,
  Zap,
} from "lucide-react"
import { createBusinessProfile, getUserAutomations } from "@/actions/business"
import { createAutomationGoals } from "@/actions/business/automationgoals"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

// Type definitions
interface Automation {
  id: string
  name: string
  active: boolean
  platform: string
  createdAt: Date
}

interface FormData {
  businessName: string
  businessType: string
  businessDescription: string
  website: string
  responseLanguage: string
  automationGoals: string[]
}

const BusinessOnboarding = () => {
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    businessType: "",
    businessDescription: "",
    website: "",
    responseLanguage: "English",
    automationGoals: [],
  })
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isComplete, setIsComplete] = useState<boolean>(false)
  const [availableAutomations, setAvailableAutomations] = useState<Automation[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchAutomations = async () => {
      try {
        const result = await getUserAutomations()
        if (result.status === 200) {
          setAvailableAutomations(result.data as Automation[])
        }
      } catch (error) {
        console.error("Error fetching automations:", error)
      }
    }
    fetchAutomations()
  }, [])

  const steps = [
    {
      id: "welcome",
      title: "Welcome to Instagram DM Automation",
      subtitle: "Transform your Instagram DMs into a powerful business tool",
      icon: Sparkles,
      color: "bg-sidebar-primary",
    },
    {
      id: "basics",
      title: "Tell Us About Your Business",
      subtitle: "Basic information to get started",
      icon: Building,
      color: "bg-sidebar-primary",
    },
    {
      id: "details",
      title: "Business Details",
      subtitle: "Help us understand what you do",
      icon: Target,
      color: "bg-sidebar-primary",
    },
    {
      id: "goals",
      title: "Automation Goals",
      subtitle: "What do you want to achieve with Instagram DM automation?",
      icon: Zap,
      color: "bg-sidebar-primary",
    },
    {
      id: "preferences",
      title: "Communication Preferences",
      subtitle: "How should we interact with your customers?",
      icon: MessageSquare,
      color: "bg-sidebar-primary",
    },
  ]

  const businessTypes = [
    "E-commerce",
    "SaaS",
    "Consulting",
    "Healthcare",
    "Education",
    "Real Estate",
    "Finance",
    "Marketing Agency",
    "Restaurant",
    "Retail",
    "Fitness & Wellness",
    "Beauty & Cosmetics",
    "Other",
  ]

  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Chinese",
    "Japanese",
    "Arabic",
    "Other",
  ]

  const automationGoals = [
    {
      id: "payments",
      title: "Payment Processing",
      description: "Generate and send payment links directly in DMs",
      icon: CreditCard,
      color: "bg-chart-1",
      popular: true,
    },
    {
      id: "ecommerce",
      title: "E-commerce Integration",
      description: "Product recommendations, inventory checks, and order management",
      icon: ShoppingBag,
      color: "bg-chart-2",
      popular: true,
    },
    {
      id: "booking",
      title: "Appointment Booking",
      description: "Schedule meetings, consultations, and service appointments",
      icon: Calendar,
      color: "bg-chart-3",
      popular: true,
    },
    {
      id: "support",
      title: "Customer Support",
      description: "24/7 customer service, FAQ responses, and issue resolution",
      icon: Headphones,
      color: "bg-chart-4",
      popular: false,
    },
    {
      id: "lead_qualification",
      title: "Lead Qualification",
      description: "Qualify prospects and collect contact information automatically",
      icon: Users,
      color: "bg-chart-5",
      popular: true,
    },
    {
      id: "content_delivery",
      title: "Content & Resources",
      description: "Share PDFs, guides, catalogs, and educational materials",
      icon: FileText,
      color: "bg-chart-1",
      popular: false,
    },
    {
      id: "reviews_feedback",
      title: "Reviews & Feedback",
      description: "Collect customer reviews and feedback automatically",
      icon: Star,
      color: "bg-chart-2",
      popular: false,
    },
    {
      id: "personalized_messaging",
      title: "Personalized Marketing",
      description: "Send targeted offers and personalized messages based on user behavior",
      icon: MessageCircle,
      color: "bg-chart-3",
      popular: true,
    },
  ]

  const handleInputChange = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const toggleGoal = useCallback((goalId: string) => {
    setFormData((prev) => ({
      ...prev,
      automationGoals: prev.automationGoals.includes(goalId)
        ? prev.automationGoals.filter((id) => id !== goalId)
        : [...prev.automationGoals, goalId],
    }))
  }, [])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const automationId = availableAutomations.length > 0 ? availableAutomations[0].id : undefined

      const businessData = {
        businessName: formData.businessName,
        businessType: formData.businessType,
        businessDescription: formData.businessDescription,
        website: formData.website,
        responseLanguage: formData.responseLanguage,
        automationId, // Pass undefined if no automations exist
      }

      const result = await createBusinessProfile(businessData)

      if (result.status === 201 && result.data) {
        // Create automation goals
        if (formData.automationGoals.length > 0) {
          await createAutomationGoals(result.data.id, formData.automationGoals)
        }

        setIsComplete(true)
        toast({
          title: "Success! 🎉",
          description: "Your business profile has been created successfully.",
          variant: "default",
        })
      } else {
        throw new Error(result.error || "Failed to create business profile")
      }
    } catch (error) {
      console.error("Error creating business profile:", error)
      toast({
        title: "Error",
        description: "Failed to create business profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return true
      case 1:
        return formData.businessName.trim() && formData.businessType
      case 2:
        return formData.businessDescription.trim() && formData.website.trim()
      case 3:
        return formData.automationGoals.length > 0
      case 4:
        return formData.responseLanguage
      default:
        return false
    }
  }

  const WelcomeStep = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-8">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="absolute inset-0 bg-sidebar-primary/20 rounded-full blur-3xl"
        />
        <div className="relative bg-sidebar-primary p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
          <MessageSquare className="h-12 w-12 text-sidebar-primary-foreground" />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-4xl font-bold text-foreground">Transform Your Instagram DMs</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Join thousands of businesses using Voiceflow AI to automate Instagram DMs, increase sales, and provide 24/7
          customer support.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {[
          {
            icon: Users,
            title: "Engage 24/7",
            desc: "Never miss a DM again",
          },
          {
            icon: TrendingUp,
            title: "Increase Sales",
            desc: "Convert more followers",
          },
          {
            icon: Rocket,
            title: "Save Time",
            desc: "Automate repetitive tasks",
          },
        ].map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
            className="bg-card border border-border backdrop-blur-sm p-6 rounded-xl"
          >
            <feature.icon className="h-8 w-8 text-sidebar-primary mb-3" />
            <h3 className="font-semibold text-card-foreground mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )

  const BasicsStep = useMemo(
    () => (
      <div className="space-y-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Business Name *</label>
            <input
              key="businessName" // Add stable key to maintain input identity
              type="text"
              value={formData.businessName}
              onChange={(e) => handleInputChange("businessName", e.target.value)}
              className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder-muted-foreground focus:border-sidebar-primary focus:ring-1 focus:ring-sidebar-primary transition-all"
              placeholder="Enter your business name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Business Type *</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {businessTypes.map((type) => (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleInputChange("businessType", type)}
                  className={`p-3 rounded-lg text-sm font-medium transition-all ${
                    formData.businessType === type
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                      : "bg-secondary border border-border text-secondary-foreground hover:border-sidebar-primary"
                  }`}
                >
                  {type}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    [formData.businessName, formData.businessType, handleInputChange],
  )

  const DetailsStep = useMemo(
    () => (
      <div className="space-y-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Website URL *</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                key="website" // Add stable key to maintain input identity
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder-muted-foreground focus:border-sidebar-primary focus:ring-1 focus:ring-sidebar-primary transition-all"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Business Description *</label>
            <textarea
              key="businessDescription" // Add stable key to maintain textarea identity
              value={formData.businessDescription}
              onChange={(e) => handleInputChange("businessDescription", e.target.value)}
              className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder-muted-foreground focus:border-sidebar-primary focus:ring-1 focus:ring-sidebar-primary transition-all h-48 resize-none"
              placeholder="Provide a comprehensive description of your business including:

• What products or services you offer
• Who your target customers are (demographics, interests, pain points)
• Your unique value proposition and competitive advantages
• Your business model and pricing structure
• Key features or benefits that set you apart
• Common customer questions or concerns you address
• Your brand voice and communication style
• Any specific industry terminology or jargon you use
• Seasonal trends or patterns in your business
• Geographic locations you serve

This detailed information helps our AI provide more accurate, personalized responses to your Instagram DM conversations and better represent your brand."
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-muted-foreground">
                Detailed descriptions help our AI provide better, more personalized responses to your customers.
              </p>
              <span className="text-xs text-muted-foreground">{formData.businessDescription.length}/2000</span>
            </div>
          </div>
        </div>
      </div>
    ),
    [formData.website, formData.businessDescription, handleInputChange],
  )

  const GoalsStep = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      <div className="text-center mb-6">
        <p className="text-muted-foreground">
          Select one or more automation goals for your Instagram DMs. You can always add more later.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {automationGoals.map((goal) => (
          <motion.div
            key={goal.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toggleGoal(goal.id)}
            className={`relative p-4 rounded-xl cursor-pointer transition-all border-2 ${
              formData.automationGoals.includes(goal.id)
                ? `${goal.color} border-transparent text-white shadow-lg`
                : "bg-card border-border text-card-foreground hover:border-sidebar-primary"
            }`}
          >
            {goal.popular && (
              <div className="absolute -top-2 -right-2 bg-chart-3 text-black text-xs px-2 py-1 rounded-full font-semibold">
                Popular
              </div>
            )}

            <div className="flex items-start space-x-3">
              <div
                className={`p-2 rounded-lg ${
                  formData.automationGoals.includes(goal.id) ? "bg-white/20" : "bg-secondary"
                }`}
              >
                <goal.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{goal.title}</h3>
                <p
                  className={`text-sm ${
                    formData.automationGoals.includes(goal.id) ? "text-white/80" : "text-muted-foreground"
                  }`}
                >
                  {goal.description}
                </p>
              </div>
              {formData.automationGoals.includes(goal.id) && <Check className="h-5 w-5 text-white" />}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Selected: {formData.automationGoals.length} goal{formData.automationGoals.length !== 1 ? "s" : ""}
        </p>
      </div>
    </motion.div>
  )

  const PreferencesStep = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">Preferred Response Language *</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {languages.map((language) => (
            <motion.button
              key={language}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleInputChange("responseLanguage", language)}
              className={`p-3 rounded-lg text-sm font-medium transition-all ${
                formData.responseLanguage === language
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                  : "bg-secondary border border-border text-secondary-foreground hover:border-sidebar-primary"
              }`}
            >
              {language}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )

  const SuccessStep = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="relative mx-auto w-24 h-24"
      >
        <div className="absolute inset-0 bg-sidebar-primary rounded-full animate-pulse" />
        <div className="relative bg-sidebar-primary p-6 rounded-full flex items-center justify-center">
          <Check className="h-12 w-12 text-sidebar-primary-foreground" />
        </div>
      </motion.div>

      <div className="space-y-4">
        <h2 className="text-4xl font-bold text-foreground">Welcome Aboard! 🚀</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your business profile has been created successfully. You&apos;re now ready to set up your Instagram DM
          automation with Voiceflow!
        </p>

        <div className="bg-card border border-border rounded-xl p-6 max-w-md mx-auto">
          <h3 className="font-semibold text-card-foreground mb-3">Selected Goals:</h3>
          <div className="space-y-2">
            {formData.automationGoals.map((goalId) => {
              const goal = automationGoals.find((g) => g.id === goalId)
              return (
                <div key={goalId} className="flex items-center space-x-2 text-card-foreground">
                  <span className="text-sm">{goal?.title}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push("/dashboard")}
        className="bg-sidebar-primary text-sidebar-primary-foreground px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
      >
        Continue to Dashboard
      </motion.button>
    </motion.div>
  )

  const renderStepContent = () => {
    if (isComplete) return <SuccessStep />

    switch (currentStep) {
      case 0:
        return <WelcomeStep />
      case 1:
        return BasicsStep
      case 2:
        return DetailsStep
      case 3:
        return <GoalsStep />
      case 4:
        return <PreferencesStep />
      default:
        return <WelcomeStep />
    }
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-4xl mx-auto">
          <SuccessStep />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">Instagram DM Automation Setup</h1>
          <span className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full ${steps[currentStep].color}`}
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-card border border-border backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
          {/* Step Header */}
          <div className="text-center mb-8">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center mb-4"
            >
              {(() => {
                const IconComponent = steps[currentStep].icon
                return (
                  <div className={`p-3 rounded-full ${steps[currentStep].color}`}>
                    <IconComponent className="h-6 w-6 text-sidebar-primary-foreground" />
                  </div>
                )
              })()}
            </motion.div>
            <motion.h2
              key={`title-${currentStep}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-3xl font-bold text-card-foreground mb-2"
            >
              {steps[currentStep].title}
            </motion.h2>
            <motion.p
              key={`subtitle-${currentStep}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-muted-foreground"
            >
              {steps[currentStep].subtitle}
            </motion.p>
          </div>

          {/* Step Content */}
          <div className="min-h-[400px] flex items-center justify-center">
            <div key={currentStep} className="w-full">
              {renderStepContent()}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>

            <motion.button
              whileHover={{ scale: canProceed() ? 1.05 : 1 }}
              whileTap={{ scale: canProceed() ? 0.95 : 1 }}
              onClick={handleNext}
              disabled={!canProceed() || isSubmitting}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                canProceed()
                  ? `${steps[currentStep].color} text-sidebar-primary-foreground shadow-lg hover:shadow-xl`
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Profile...
                </>
              ) : currentStep === steps.length - 1 ? (
                <>
                  Complete Setup
                  <Check className="h-4 w-4" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusinessOnboarding
