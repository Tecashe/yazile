// "use client"

// import type React from "react"

// import { useState, useRef, useEffect } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { useRouter } from "next/navigation"
// import {
//   AlertCircle,
//   AtSign,
//   BookOpen,
//   Camera,
//   Check,
//   ChevronRight,
//   DollarSign,
//   Flag,
//   ImageIcon,
//   Instagram,
//   Loader2,
//   Lock,
//   Mail,
//   MessageCircle,
//   Mic,
//   Palette,
//   Paperclip,
//   Phone,
//   Plus,
//   Save,
//   Share2,
//   Smartphone,
//   Sparkles,
//   Star,
//   TrendingUp,
//   Users,
//   Video,
//   Wand2,
//   UserIcon,
//   LayersIcon,
//   BadgeCheckIcon,
//   TargetIcon,
//   CopyIcon,
//   XIcon,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Progress } from "@/components/ui/progress"
// import { Card, CardContent } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Slider } from "@/components/ui/slider"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
// import { Checkbox } from "@/components/ui/checkbox"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Textarea } from "@/components/ui/textarea"
// import { toast } from "@/hooks/use-toast"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { cn } from "@/lib/utils"
// import confetti from "canvas-confetti"

// // Add these imports at the top of the file
// import { useLocalStorage } from "@/hooks/use-local-storage"

// // Import the correct server actions
// import {
//   initializeOnboarding,
//   updateOnboardingStep,
//   saveOnboardingData,
//   completeOnboarding,
//   setThisUserType,
// } from "@/actions/onboarding"

// // Import the SMS verification server actions
// import { sendVerificationSMS } from "@/actions/sms-service"

// // Add a debounce utility at the top of the file
// function debounce(func: Function, wait: number) {
//   let timeout: NodeJS.Timeout
//   return function executedFunction(...args: any[]) {
//     const later = () => {
//       clearTimeout(timeout)
//       func(...args)
//     }
//     clearTimeout(timeout)
//     timeout = setTimeout(later, wait)
//   }
// }

// // Mock AI analysis
// const mockAiAnalysis = async (handle: string) => {
//   return new Promise<{
//     followers: number
//     engagement: number
//     growthRate: number
//     topContent: string[]
//     audienceDemo: { age: string; gender: string; location: string }
//   }>((resolve) => {
//     setTimeout(() => {
//       resolve({
//         followers: Math.floor(1000 + Math.random() * 100000),
//         engagement: Math.random() * 8 + 1,
//         growthRate: Math.random() * 10,
//         topContent: ["Fashion", "Lifestyle", "Travel"],
//         audienceDemo: {
//           age: "18-34",
//           gender: "65% Female, 35% Male",
//           location: "US, UK, Canada",
//         },
//       })
//     }, 2000)
//   })
// }

// type SocialPlatform = {
//   name: string
//   icon: React.ReactNode
//   placeholder: string
//   color: string
// }

// const socialPlatforms: SocialPlatform[] = [
//   {
//     name: "Instagram",
//     icon: <Instagram className="h-4 w-4" />,
//     placeholder: "@yourusername",
//     color: "bg-gradient-to-r from-purple-500 to-pink-500",
//   },
//   {
//     name: "TikTok",
//     icon: <Video className="h-4 w-4" />,
//     placeholder: "@yourusername",
//     color: "bg-black",
//   },
//   {
//     name: "YouTube",
//     icon: <Play className="h-4 w-4" />,
//     placeholder: "@yourchannel",
//     color: "bg-red-600",
//   },
//   {
//     name: "Twitter",
//     icon: <MessageCircle className="h-4 w-4" />,
//     placeholder: "@yourusername",
//     color: "bg-blue-500",
//   },
// ]

// const contentCategories = [
//   { name: "Fashion", icon: "👗", color: "bg-pink-100 dark:bg-pink-900" },
//   { name: "Beauty", icon: "💄", color: "bg-purple-100 dark:bg-purple-900" },
//   { name: "Fitness", icon: "💪", color: "bg-green-100 dark:bg-green-900" },
//   { name: "Travel", icon: "✈️", color: "bg-blue-100 dark:bg-blue-900" },
//   { name: "Food", icon: "🍕", color: "bg-yellow-100 dark:bg-yellow-900" },
//   { name: "Lifestyle", icon: "🌿", color: "bg-teal-100 dark:bg-teal-900" },
//   { name: "Tech", icon: "📱", color: "bg-gray-100 dark:bg-gray-800" },
//   { name: "Gaming", icon: "🎮", color: "bg-indigo-100 dark:bg-indigo-900" },
//   { name: "Business", icon: "💼", color: "bg-amber-100 dark:bg-amber-900" },
//   { name: "Education", icon: "📚", color: "bg-red-100 dark:bg-red-900" },
//   { name: "Art", icon: "🎨", color: "bg-fuchsia-100 dark:bg-fuchsia-900" },
//   { name: "Music", icon: "🎵", color: "bg-cyan-100 dark:bg-cyan-900" },
// ]

// const incomeRanges = [
//   { min: 0, max: 1000, label: "Up to $1,000/month", level: "Starter" },
//   { min: 1000, max: 5000, label: "$1,000 - $5,000/month", level: "Growing" },
//   { min: 5000, max: 10000, label: "$5,000 - $10,000/month", level: "Established" },
//   { min: 10000, max: 20000, label: "$10,000 - $20,000/month", level: "Professional" },
//   { min: 20000, max: 50000, label: "$20,000 - $50,000/month", level: "Elite" },
//   { min: 50000, max: 100000, label: "$50,000+/month", level: "Celebrity" },
// ]

// const contentFrequencies = ["Daily", "3-5 times per week", "1-2 times per week", "Few times a month"]

// const brandCollabTypes = [
//   "Sponsored Posts",
//   "Brand Ambassador",
//   "Affiliate Marketing",
//   "Product Reviews",
//   "Event Appearances",
//   "Content Creation",
// ]

// const learningTopics = [
//   "Content Creation",
//   "Audience Growth",
//   "Engagement Strategies",
//   "Monetization",
//   "Photography/Videography",
//   "Personal Branding",
// ]

// const growthChallenges = [
//   "Finding My Niche",
//   "Creating Consistent Content",
//   "Growing My Audience",
//   "Engagement Rate",
//   "Monetization",
//   "Work-Life Balance",
// ]

// const contentStyles = [
//   { name: "Minimalist", icon: "✨", description: "Clean, simple aesthetics" },
//   { name: "Vibrant", icon: "🌈", description: "Bold colors and energy" },
//   { name: "Vintage", icon: "📷", description: "Retro and nostalgic vibes" },
//   { name: "Luxury", icon: "💎", description: "High-end and sophisticated" },
//   { name: "Playful", icon: "🎨", description: "Fun and creative expression" },
//   { name: "Nature", icon: "🌿", description: "Organic and earthy elements" },
// ]

// const personalityTypes = [
//   {
//     type: "Creator",
//     description: "You thrive on making original content and expressing yourself",
//     icon: <Palette className="h-5 w-5" />,
//     strengths: ["Original content", "Creative expression", "Unique perspective"],
//     strategies: ["Focus on quality over quantity", "Develop a signature style", "Collaborate with other creators"],
//   },
//   {
//     type: "Connector",
//     description: "You excel at building relationships and engaging with your audience",
//     icon: <Users className="h-5 w-5" />,
//     strengths: ["Community building", "Engagement", "Authenticity"],
//     strategies: ["Prioritize comments and messages", "Host live sessions", "Create interactive content"],
//   },
//   {
//     type: "Educator",
//     description: "You love sharing knowledge and teaching others",
//     icon: <BookOpen className="h-5 w-5" />,
//     strengths: ["Informative content", "Clear communication", "Expertise"],
//     strategies: ["Create how-to content", "Share insights and tips", "Develop series content"],
//   },
//   {
//     type: "Trendsetter",
//     description: "You stay ahead of the curve and influence what's next",
//     icon: <TrendingUp className="h-5 w-5" />,
//     strengths: ["Early adoption", "Trend awareness", "Cultural relevance"],
//     strategies: ["Monitor emerging trends", "Put your unique spin on trends", "Be first to market"],
//   },
// ]

// // Custom hook for saving progress
// const useSaveProgress = (data: any) => {
//   const [isSaving, setIsSaving] = useState(false)
//   const [lastSaved, setLastSaved] = useState<Date | null>(null)

//   const saveProgress = async () => {
//     setIsSaving(true)
//     try {
//       // Save the current step data to the server
//       await saveOnboardingData(data.step, data)
//       setLastSaved(new Date())
//       toast({
//         title: "Progress Saved",
//         description: "Your onboarding progress has been saved.",
//       })
//     } catch (error) {
//       console.error("Error saving progress:", error)
//       toast({
//         title: "Save Failed",
//         description: "Could not save your progress. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   return { saveProgress, isSaving, lastSaved }
// }

// // Custom component for 3D flip card
// const FlipCard = ({
//   front,
//   back,
//   isFlipped,
//   onClick,
// }: {
//   front: React.ReactNode
//   back: React.ReactNode
//   isFlipped: boolean
//   onClick: () => void
// }) => {
//   return (
//     <div className="relative h-[200px] w-full cursor-pointer perspective-1000" onClick={onClick}>
//       <div
//         className={cn(
//           "relative h-full w-full duration-500 preserve-3d transition-all",
//           isFlipped ? "rotate-y-180" : "",
//         )}
//       >
//         <div className="absolute inset-0 backface-hidden">{front}</div>
//         <div className="absolute inset-0 rotate-y-180 backface-hidden">{back}</div>
//       </div>
//     </div>
//   )
// }

// // Custom component for animated mascot
// const Mascot = ({ emotion = "happy" }: { emotion?: "happy" | "thinking" | "excited" | "confused" }) => {
//   const animations = {
//     happy: {
//       y: [0, -10, 0],
//       transition: { repeat: Number.POSITIVE_INFINITY, duration: 2 },
//     },
//     thinking: {
//       rotate: [0, 10, 0, -10, 0],
//       transition: { repeat: Number.POSITIVE_INFINITY, duration: 3 },
//     },
//     excited: {
//       scale: [1, 1.1, 1],
//       transition: { repeat: Number.POSITIVE_INFINITY, duration: 0.5 },
//     },
//     confused: {
//       rotate: [0, 5, 0, -5, 0],
//       transition: { repeat: Number.POSITIVE_INFINITY, duration: 1.5 },
//     },
//   }

//   return (
//     <motion.div className="relative h-16 w-16 rounded-full bg-primary/20 p-2" animate={animations[emotion]}>
//       <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/30">
//         {emotion === "happy" && <span className="text-2xl">😊</span>}
//         {emotion === "thinking" && <span className="text-2xl">🤔</span>}
//         {emotion === "excited" && <span className="text-2xl">🤩</span>}
//         {emotion === "confused" && <span className="text-2xl">😕</span>}
//       </div>
//     </motion.div>
//   )
// }

// // Custom component for interactive calendar
// const ContentCalendar = ({
//   selectedDays,
//   onSelectDay,
// }: {
//   selectedDays: number[]
//   onSelectDay: (day: number) => void
// }) => {
//   const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

//   return (
//     <div className="grid grid-cols-7 gap-1">
//       {days.map((day, index) => (
//         <div key={day} className="flex flex-col items-center">
//           <div className="text-xs font-medium text-muted-foreground">{day}</div>
//           <Button
//             variant={selectedDays.includes(index) ? "default" : "outline"}
//             size="sm"
//             className="mt-1 h-8 w-8 p-0"
//             onClick={() => onSelectDay(index)}
//           >
//             {selectedDays.includes(index) && <Check className="h-3 w-3" />}
//           </Button>
//         </div>
//       ))}
//     </div>
//   )
// }

// // Custom component for voice input simulation
// const VoiceInput = ({
//   onComplete,
// }: {
//   onComplete: (text: string) => void
// }) => {
//   const [isRecording, setIsRecording] = useState(false)
//   const [progress, setProgress] = useState(0)

//   const startRecording = () => {
//     setIsRecording(true)
//     setProgress(0)

//     // Simulate recording progress
//     const interval = setInterval(() => {
//       setProgress((prev) => {
//         if (prev >= 100) {
//           clearInterval(interval)
//           setIsRecording(false)
//           onComplete("I want to grow my Instagram account and connect with more people who share my interests.")
//           return 100
//         }
//         return prev + 5
//       })
//     }, 150)
//   }

//   return (
//     <div className="flex flex-col items-center space-y-4">
//       <Button
//         variant={isRecording ? "destructive" : "outline"}
//         size="lg"
//         className={cn("h-16 w-16 rounded-full", isRecording && "animate-pulse")}
//         onClick={startRecording}
//         disabled={isRecording}
//       >
//         <Mic className="h-6 w-6" />
//       </Button>

//       {isRecording && (
//         <div className="w-full space-y-2">
//           <div className="flex items-center justify-between">
//             <span className="text-xs text-muted-foreground">Recording...</span>
//             <span className="text-xs text-muted-foreground">{progress}%</span>
//           </div>
//           <Progress value={progress} className="h-1" />
//         </div>
//       )}

//       <p className="text-center text-sm text-muted-foreground">
//         {isRecording ? "Listening... speak clearly" : "Tap to record your goals"}
//       </p>
//     </div>
//   )
// }

// // Custom component for AI profile analysis
// const AiProfileAnalysis = ({
//   handle,
//   onComplete,
// }: {
//   handle: string
//   onComplete: (data: any) => void
// }) => {
//   const [isAnalyzing, setIsAnalyzing] = useState(false)
//   const [progress, setProgress] = useState(0)
//   const [result, setResult] = useState<any>(null)

//   const startAnalysis = async () => {
//     setIsAnalyzing(true)
//     setProgress(0)

//     // Simulate analysis progress
//     const interval = setInterval(() => {
//       setProgress((prev) => {
//         if (prev >= 95) {
//           clearInterval(interval)
//           return 95
//         }
//         return prev + Math.random() * 10
//       })
//     }, 300)

//     try {
//       const data = await mockAiAnalysis(handle)
//       clearInterval(interval)
//       setProgress(100)
//       setResult(data)
//       onComplete(data)
//       setTimeout(() => {
//         setIsAnalyzing(false)
//       }, 500)
//     } catch (error) {
//       clearInterval(interval)
//       setIsAnalyzing(false)
//       toast({
//         title: "Analysis Failed",
//         description: "Could not analyze profile",
//         variant: "destructive",
//       })
//     }
//   }

//   useEffect(() => {
//     if (handle && !result) {
//       startAnalysis()
//     }
//   }, [handle])

//   if (!isAnalyzing && result) {
//     return (
//       <div className="space-y-4 rounded-lg border bg-card p-4">
//         <div className="flex items-center justify-between">
//           <h3 className="font-semibold">AI Analysis Results</h3>
//           <Badge variant="outline" className="bg-primary/10">
//             <Sparkles className="mr-1 h-3 w-3" /> AI Generated
//           </Badge>
//         </div>

//         <div className="grid gap-3">
//           <div className="flex items-center justify-between rounded-md bg-muted p-2">
//             <span className="text-sm">Followers</span>
//             <span className="font-medium">{result.followers.toLocaleString()}</span>
//           </div>
//           <div className="flex items-center justify-between rounded-md bg-muted p-2">
//             <span className="text-sm">Engagement Rate</span>
//             <span className="font-medium">{result.engagement.toFixed(1)}%</span>
//           </div>
//           <div className="flex items-center justify-between rounded-md bg-muted p-2">
//             <span className="text-sm">Growth Rate</span>
//             <span className="font-medium">+{result.growthRate.toFixed(1)}%/month</span>
//           </div>
//           <div className="flex items-center justify-between rounded-md bg-muted p-2">
//             <span className="text-sm">Top Performing Content</span>
//             <div className="flex gap-1">
//               {result.topContent.map((category: string) => (
//                 <Badge key={category} variant="outline" className="text-xs">
//                   {category}
//                 </Badge>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <h3 className="font-semibold">Analyzing @{handle}</h3>
//         <Badge variant="outline" className="animate-pulse bg-primary/10">
//           <Wand2 className="mr-1 h-3 w-3" /> AI Working
//         </Badge>
//       </div>

//       <div className="space-y-2">
//         <div className="flex items-center justify-between">
//           <span className="text-xs text-muted-foreground">Analyzing profile data...</span>
//           <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
//         </div>
//         <Progress value={progress} className="h-1" />
//       </div>

//       <div className="space-y-2">
//         {progress > 30 && (
//           <div className="flex items-center gap-2 text-xs text-muted-foreground">
//             <Check className="h-3 w-3 text-green-500" />
//             Fetching profile statistics
//           </div>
//         )}
//         {progress > 50 && (
//           <div className="flex items-center gap-2 text-xs text-muted-foreground">
//             <Check className="h-3 w-3 text-green-500" />
//             Analyzing content performance
//           </div>
//         )}
//         {progress > 70 && (
//           <div className="flex items-center gap-2 text-xs text-muted-foreground">
//             <Check className="h-3 w-3 text-green-500" />
//             Evaluating audience demographics
//           </div>
//         )}
//         {progress > 90 && (
//           <div className="flex items-center gap-2 text-xs text-muted-foreground">
//             <Loader2 className="h-3 w-3 animate-spin" />
//             Generating recommendations
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// // Custom component for income projection visualization
// const IncomeProjection = ({
//   currentIncome = 0,
//   targetIncome = 5000,
//   months = 12,
// }: {
//   currentIncome?: number
//   targetIncome?: number
//   months?: number
// }) => {
//   // Generate projection data
//   const generateProjectionData = () => {
//     const data = []
//     const monthlyGrowth = (targetIncome - currentIncome) / months

//     for (let i = 0; i <= months; i++) {
//       data.push({
//         month: i,
//         value: Math.max(0, currentIncome + monthlyGrowth * i),
//       })
//     }

//     return data
//   }

//   const projectionData = generateProjectionData()
//   const maxValue = Math.max(...projectionData.map((d) => d.value))

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <h3 className="font-semibold">Income Projection</h3>
//         <Badge variant="outline">{months}</Badge>
//       </div>

//       <div className="h-[150px] w-full">
//         <div className="flex h-full items-end gap-1">
//           {projectionData.map((data, index) => (
//             <div key={index} className="group relative flex flex-1 flex-col items-center">
//               <div className="absolute -top-8 z-10 hidden rounded-md bg-black/80 px-2 py-1 text-xs text-white group-hover:block">
//                 ${Math.round(data.value).toLocaleString()}
//               </div>
//               <div
//                 className={cn(
//                   "w-full rounded-t-sm",
//                   index === 0 ? "bg-muted" : index === months ? "bg-green-500" : "bg-primary",
//                 )}
//                 style={{
//                   height: `${(data.value / maxValue) * 100}%`,
//                   opacity: 0.3 + (data.value / maxValue) * 0.7,
//                 }}
//               />
//               {index % 3 === 0 && <div className="mt-1 text-[10px] text-muted-foreground">{index}m</div>}
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="flex items-center justify-between text-sm">
//         <div>
//           <div className="font-medium">${currentIncome.toLocaleString()}</div>
//           <div className="text-xs text-muted-foreground">Current</div>
//         </div>
//         <div className="text-right">
//           <div className="font-medium">${targetIncome.toLocaleString()}</div>
//           <div className="text-xs text-muted-foreground">Target</div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // Custom component for achievement badges
// const AchievementBadge = ({
//   title,
//   icon,
//   isUnlocked = false,
//   onUnlock,
// }: {
//   title: string
//   icon: React.ReactNode
//   isUnlocked?: boolean
//   onUnlock?: () => void
// }) => {
//   return (
//     <div
//       className={cn(
//         "group relative flex flex-col items-center rounded-lg border p-3 transition-all",
//         isUnlocked
//           ? "border-primary bg-primary/5"
//           : "border-dashed border-muted-foreground/30 bg-muted/50 opacity-70 hover:opacity-100",
//       )}
//       onClick={() => !isUnlocked && onUnlock?.()}
//     >
//       <div
//         className={cn(
//           "flex h-12 w-12 items-center justify-center rounded-full",
//           isUnlocked ? "bg-primary/20" : "bg-muted",
//         )}
//       >
//         {icon}
//       </div>
//       <div className="mt-2 text-center">
//         <div className="text-xs font-medium">{title}</div>
//         <div className="text-[10px] text-muted-foreground">{isUnlocked ? "Unlocked" : "Locked"}</div>
//       </div>

//       {!isUnlocked && (
//         <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/5 opacity-0 transition-opacity group-hover:opacity-100">
//           <Button variant="secondary" size="sm" className="text-xs">
//             Unlock
//           </Button>
//         </div>
//       )}
//     </div>
//   )
// }

// // Main component
// export default function OnboardingPage() {
//   const router = useRouter()
//   const [step, setStep] = useState(0)
//   const [userType, setUserType] = useState<"regular" | "influencer" | null>(null)
//   const [progress, setProgress] = useState(0)
//   const [profileImage, setProfileImage] = useState<string | null>(null)
//   const fileInputRef = useRef<HTMLInputElement>(null)
//   const [selectedCategories, setSelectedCategories] = useState<string[]>([])
//   const [socialHandles, setSocialHandles] = useState<Record<string, string>>({})
//   const [phoneNumber, setPhoneNumber] = useState("")
//   const [isVerifying, setIsVerifying] = useState(false)
//   const [verificationCode, setVerificationCode] = useState("")
//   const [expectedCode, setExpectedCode] = useState("")
//   const [isVerified, setIsVerified] = useState(false)
//   const [verificationStep, setVerificationStep] = useState<"input" | "verify">("input")
//   const [email, setEmail] = useState("")
//   const [incomeGoal, setIncomeGoal] = useState(5000)
//   const [selectedIncomeRange, setSelectedIncomeRange] = useState(1)
//   const [acceptedTerms, setAcceptedTerms] = useState(false)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [flippedCards, setFlippedCards] = useState<number[]>([])
//   const [selectedContentFrequency, setSelectedContentFrequency] = useState<string>("")
//   const [selectedBrandCollabs, setSelectedBrandCollabs] = useState<string[]>([])
//   const [selectedContentDays, setSelectedContentDays] = useState<number[]>([])
//   const [selectedLearningTopics, setSelectedLearningTopics] = useState<string[]>([])
//   const [selectedGrowthChallenges, setSelectedGrowthChallenges] = useState<string[]>([])
//   const [selectedContentStyle, setSelectedContentStyle] = useState<string>("")
//   const [personalityResult, setPersonalityResult] = useState<string>("")
//   const [personalityAnswers, setPersonalityAnswers] = useState<Record<string, string>>({})
//   const [goalStatement, setGoalStatement] = useState<string>("")
//   const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null)
//   const [achievements, setAchievements] = useState<Record<string, boolean>>({
//     profile: false,
//     categories: false,
//     social: false,
//     verification: false,
//     goals: false,
//   })
//   const [showMascot, setShowMascot] = useState(true)
//   const [mascotEmotion, setMascotEmotion] = useState<"happy" | "thinking" | "excited" | "confused">("happy")
//   const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null)
//   const [onboardingInitialized, setOnboardingInitialized] = useState(false)
//   // Add a new state for tracking step transition loading
//   const [isStepTransitioning, setIsStepTransitioning] = useState(false)
//   const [uploadProgress, setUploadProgress] = useState(0)
//   const [isUploading, setIsUploading] = useState(false)

//   // Determine total steps based on user type
//   const totalSteps = userType === "influencer" ? 10 : 8

//   // Save progress hook
//   const { saveProgress, isSaving, lastSaved } = useSaveProgress({
//     step,
//     userType,
//     profileImage: profileImageUrl || profileImage,
//     selectedCategories,
//     socialHandles,
//     phoneNumber,
//     email,
//     incomeGoal,
//     selectedContentFrequency,
//     selectedBrandCollabs,
//     selectedContentDays,
//     selectedLearningTopics,
//     selectedGrowthChallenges,
//     selectedContentStyle,
//     personalityResult,
//     goalStatement,
//     aiAnalysisResult,
//   })

//   // Update progress when step changes
//   useEffect(() => {
//     setProgress(((step + 1) / totalSteps) * 100)

//     // Update mascot emotion based on step
//     if (step === totalSteps - 1) {
//       setMascotEmotion("excited")
//     } else if (step > totalSteps / 2) {
//       setMascotEmotion("happy")
//     } else if (step === 0) {
//       setMascotEmotion("thinking")
//     } else {
//       setMascotEmotion("confused")
//     }
//   }, [step, totalSteps])

//   //Trigger confetti effect
//   const triggerConfetti = () => {
//     confetti({
//       particleCount: 100,
//       spread: 70,
//       origin: { y: 0.6 },
//     })
//   }

//   // Handle unlocking achievements
//   const unlockAchievement = (achievement: string) => {
//     if (!achievements[achievement]) {
//       setAchievements((prev) => ({
//         ...prev,
//         [achievement]: true,
//       }))

//       toast({
//         title: "Achievement Unlocked!",
//         description: `You've unlocked the ${achievement} achievement!`,
//         variant: "default",
//       })

//       // Small confetti burst
//       confetti({
//         particleCount: 30,
//         spread: 50,
//         origin: { y: 0.7 },
//       })
//     }
//   }

//   // Replace the existing nextStep function with this version
//   const [formData, setFormData] = useLocalStorage("onboarding-form-data", {})
//   const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null)
//   const syncInProgressRef = useRef(false)

//   // Function to trigger background sync with debounce
//   const triggerBackgroundSync = async (stepNumber: number, status: string, stepData: any) => {
//     if (syncInProgressRef.current) return

//     // Clear any pending sync
//     if (syncTimeoutRef.current) {
//       clearTimeout(syncTimeoutRef.current)
//     }

//     // Set a timeout to sync data
//     syncTimeoutRef.current = setTimeout(async () => {
//       syncInProgressRef.current = true
//       try {
//         await updateOnboardingStep(stepNumber, status as any, stepData)
//       } catch (error) {
//         console.error("Background sync failed:", error)
//       } finally {
//         syncInProgressRef.current = false
//       }
//     }, 1000)
//   }

//   // Function to submit all form data at once when completing onboarding
//   const submitAllFormData = async () => {
//     try {
//       // First, save any unsaved steps
//       await Promise.all(
//         Object.entries(formData).map(([stepNumber, data]) =>
//           updateOnboardingStep(Number(stepNumber), "COMPLETED", data),
//         ),
//       )

//       // Then complete onboarding
//       const result = await completeOnboarding()

//       // Clear local storage on successful submission
//       if (result.status === 200) {
//         localStorage.removeItem("onboarding-form-data")
//       }

//       return result
//     } catch (error) {
//       console.error("Error submitting all form data:", error)
//       return { status: 500, data: "Failed to submit onboarding data" }
//     }
//   }

//   const nextStep = async () => {
//     try {
//       // Don't show loading state between steps anymore
//       // setIsStepTransitioning(false) <- Remove this

//       // Just update local state
//       const currentStepData = {
//         profileImage: profileImageUrl || profileImage,
//         selectedCategories,
//         socialHandles,
//         phoneNumber,
//         email,
//         incomeGoal,
//         selectedContentFrequency,
//         selectedBrandCollabs,
//         selectedContentDays,
//         selectedLearningTopics,
//         selectedGrowthChallenges,
//         selectedContentStyle,
//         personalityResult,
//         personalityAnswers,
//         goalStatement,
//         aiAnalysisResult,
//       }

//       // Update our complete form data object
//       setFormData((prev) => ({
//         ...prev,
//         [step]: currentStepData,
//       }))

//       // Trigger background sync without waiting for it
//       if (onboardingInitialized) {
//         triggerBackgroundSync(step, "COMPLETED", currentStepData).catch(console.error)
//       }

//       if (step < totalSteps - 1) {
//         // Immediately advance to next step without waiting for server response
//         setStep(step + 1)

//         // Unlock achievements based on progress
//         if (step === 1 && profileImage) unlockAchievement("profile")
//         if (step === 2 && selectedCategories.length > 0) unlockAchievement("categories")
//         if (step === 3 && Object.keys(socialHandles).length > 0) unlockAchievement("social")
//         if (step === 5 && isVerified) unlockAchievement("verification")
//         if (step === totalSteps - 2) unlockAchievement("goals")
//       } else {
//         // Only on final submission do we show loading state
//         setIsSubmitting(true)

//         // Submit all form data at once
//         const result = await submitAllFormData()

//         if (result.status === 200) {
//           setIsSubmitting(false)
//           triggerConfetti()

//           // Redirect based on user type
//           setTimeout(() => {
//             if (userType === "influencer") {
//               router.push("/influencers")
//             } else {
//               router.push("/dashboard")
//             }
//           }, 2000)
//         } else {
//           toast({
//             title: "Error",
//             description: "Failed to complete onboarding. Please try again.",
//             variant: "destructive",
//           })
//           setIsSubmitting(false)
//         }
//       }
//     } catch (error) {
//       console.error("Error in nextStep:", error)
//       toast({
//         title: "Error",
//         description: "Something went wrong. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   // Also update the prevStep function to avoid loading state
//   const prevStep = () => {
//     if (step > 0) {
//       // Just update the step immediately
//       setStep(step - 1)
//     }
//   }

// //   'use client'
// // import { setUserType } from '@/actions/setUserType'

// // const setUserAndAdvance = async (type: 'influencer' | 'regular') => {
// //   try {
// //     await setUserType(type)
// //     // go to the next step or redirect
// //     setStep((prev) => prev + 1)
// //   } catch (error) {
// //     console.error('Failed to update user type:', error)
// //   }
// // }


//   // Update setUserAndAdvance to minimize loading state
//   const setUserAndAdvance = async (type: "regular" | "influencer") => {
//     try {
//       // Only show loading during the initialization, not between steps
//       setIsStepTransitioning(true)
//       await setUserType(type)
//       await setThisUserType(type)

//       // Initialize onboarding with the selected user type
//       const stepsCount = type === "influencer" ? 10 : 8
//       const result = await initializeOnboarding(type, stepsCount)

//       if (result.status === 200) {
//         setOnboardingInitialized(true)
//         setIsStepTransitioning(false) // Hide loading before advancing
//         setStep(step + 1) // Immediately advance to next step
//       } else {
//         toast({
//           title: "Error",
//           description: "Failed to initialize onboarding. Please try again.",
//           variant: "destructive",
//         })
//         setIsStepTransitioning(false)
//       }
//     } catch (error) {
//       console.error("Error in setUserAndAdvance:", error)
//       toast({
//         title: "Error",
//         description: "Failed to set user type. Please try again.",
//         variant: "destructive",
//       })
//       setIsStepTransitioning(false)
//     }
//   }

//   // File handling functions
//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       // Show preview immediately using FileReader
//       const reader = new FileReader()
//       reader.onload = (e) => {
//         setProfileImage(e.target?.result as string)
//       }
//       reader.readAsDataURL(file)

//       // Add upload progress state

//       // Upload to Vercel Blob
//       try {
//         setIsUploading(true)

//         // Create a FormData object
//         const formData = new FormData()
//         formData.append("file", file)

//         // Simulate upload progress (since fetch doesn't provide progress)
//         const progressInterval = setInterval(() => {
//           setUploadProgress((prev) => {
//             if (prev >= 90) {
//               clearInterval(progressInterval)
//               return 90
//             }
//             return prev + 10
//           })
//         }, 300)

//         // Upload the file
//         const response = await fetch("/api/uploadprofile", {
//           method: "POST",
//           body: formData,
//         })

//         clearInterval(progressInterval)
//         setUploadProgress(100)

//         const result = await response.json()

//         if (result.success) {
//           // Store the URL for database saving
//           setProfileImageUrl(result.url)

//           toast({
//             title: "Image Uploaded",
//             description: "Your profile image has been uploaded successfully.",
//           })

//           // Save this step data
//           await saveOnboardingData(step, {
//             profileImage: result.url,
//           })
//         } else {
//           toast({
//             title: "Upload Failed",
//             description: result.error || "Failed to upload image",
//             variant: "destructive",
//           })
//         }
//       } catch (error) {
//         console.error("Error uploading image:", error)
//         toast({
//           title: "Upload Failed",
//           description: "An error occurred while uploading your image",
//           variant: "destructive",
//         })
//       } finally {
//         setIsUploading(false)
//       }
//     }
//   }

//   // Category selection
//   const handleCategoryToggle = async (category: string) => {
//     // Optimistically update the UI first
//     const newCategories = selectedCategories.includes(category)
//       ? selectedCategories.filter((c) => c !== category)
//       : [...selectedCategories, category]

//     setSelectedCategories(newCategories)

//     // Then save in the background without waiting
//     saveOnboardingData(step, {
//       selectedCategories: newCategories,
//     }).catch((error) => {
//       console.error("Error saving categories:", error)
//       // Revert on error
//       setSelectedCategories(selectedCategories)
//       toast({
//         title: "Save Failed",
//         description: "Failed to save your selection. Please try again.",
//         variant: "destructive",
//       })
//     })
//   }

//   // Social handle management
//   const handleSocialHandleChange = async (platform: string, value: string) => {
//     // Optimistically update the UI first
//     const newHandles = {
//       ...socialHandles,
//       [platform]: value,
//     }

//     setSocialHandles(newHandles)

//     // Debounce the save operation to avoid too many requests
//     const debouncedSave = debounce(() => {
//       saveOnboardingData(step, {
//         socialHandles: newHandles,
//       }).catch((error) => {
//         console.error("Error saving social handles:", error)
//       })
//     }, 500)

//     debouncedSave()
//   }

//   // Phone verification
//   const handleVerifyPhone = async () => {
//     if (!phoneNumber || phoneNumber.length < 10) {
//       toast({
//         title: "Invalid Phone Number",
//         description: "Please enter a valid phone number",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsVerifying(true)
//     try {
//       // Call the server action to send the verification code
//       const result = await sendVerificationSMS(phoneNumber)

//       if (result.status === 200) {
//         setExpectedCode(result.data?.code || "124387")
//         setVerificationStep("verify")

//         // Save this step data
//         await saveOnboardingData(step, {
//           phoneNumber,
//         })

//         toast({
//           title: "Verification Code Sent",
//           description: `We've sent a code to ${phoneNumber}. For demo purposes, the code is: ${result.data?.code}`,
//         })
//       } else {
//         toast({
//           title: "Verification Failed",
//           description: result.error || "Could not send verification code",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       toast({
//         title: "Verification Failed",
//         description: "Could not send verification code",
//         variant: "destructive",
//       })
//     } finally {
//       setIsVerifying(false)
//     }
//   }

//   const handleCheckVerificationCode = async () => {
//     if (!verificationCode) {
//       toast({
//         title: "Missing Code",
//         description: "Please enter the verification code",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsVerifying(true)
//     try {
//       // For demo purposes, we'll check against the expected code directly
//       const isValid = verificationCode === expectedCode

//       if (isValid) {
//         setIsVerified(true)

//         // Save this step data
//         await saveOnboardingData(step, {
//           phoneNumber,
//           verified: true,
//         })

//         toast({
//           title: "Phone Verified",
//           description: "Your phone number has been verified successfully!",
//         })
//         nextStep()
//       } else {
//         toast({
//           title: "Invalid Code",
//           description: "The code you entered is incorrect",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       toast({
//         title: "Verification Failed",
//         description: "Could not verify code",
//         variant: "destructive",
//       })
//     } finally {
//       setIsVerifying(false)
//     }
//   }

//   // Income goal management
//   const handleIncomeRangeSelect = async (index: number) => {
//     setSelectedIncomeRange(index)
//     const newIncomeGoal = incomeRanges[index].min + (incomeRanges[index].max - incomeRanges[index].min) / 2
//     setIncomeGoal(newIncomeGoal)

//     // Save this step data
//     await saveOnboardingData(step, {
//       incomeGoal: newIncomeGoal,
//       selectedIncomeRange: index,
//     })
//   }

//   const handleIncomeSliderChange = async (value: number[]) => {
//     setIncomeGoal(value[0])

//     // Save this step data
//     await saveOnboardingData(step, {
//       incomeGoal: value[0],
//     })
//   }

//   const getCurrentIncomeRange = () => {
//     return incomeRanges.find((range) => incomeGoal >= range.min && incomeGoal <= range.max) || incomeRanges[0]
//   }

//   // Card flipping
//   const toggleCardFlip = (index: number) => {
//     setFlippedCards((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
//   }

//   // Content days selection
//   const toggleContentDay = async (day: number) => {
//     const newSelectedDays = selectedContentDays.includes(day)
//       ? selectedContentDays.filter((d) => d !== day)
//       : [...selectedContentDays, day]

//     setSelectedContentDays(newSelectedDays)

//     // Save this step data
//     await saveOnboardingData(step, {
//       selectedContentDays: newSelectedDays,
//     })
//   }

//   // Learning topics selection
//   const toggleLearningTopic = async (topic: string) => {
//     const newTopics = selectedLearningTopics.includes(topic)
//       ? selectedLearningTopics.filter((t) => t !== topic)
//       : [...selectedLearningTopics, topic]

//     setSelectedLearningTopics(newTopics)

//     // Save this step data
//     await saveOnboardingData(step, {
//       selectedLearningTopics: newTopics,
//     })
//   }

//   // Growth challenges selection
//   const toggleGrowthChallenge = async (challenge: string) => {
//     const newChallenges = selectedGrowthChallenges.includes(challenge)
//       ? selectedGrowthChallenges.filter((c) => c !== challenge)
//       : [...selectedGrowthChallenges, challenge]

//     setSelectedGrowthChallenges(newChallenges)

//     // Save this step data
//     await saveOnboardingData(step, {
//       selectedGrowthChallenges: newChallenges,
//     })
//   }

//   // Brand collab selection
//   const toggleBrandCollab = async (collab: string) => {
//     const newCollabs = selectedBrandCollabs.includes(collab)
//       ? selectedBrandCollabs.filter((c) => c !== collab)
//       : [...selectedBrandCollabs, collab]

//     setSelectedBrandCollabs(newCollabs)

//     // Save this step data
//     await saveOnboardingData(step, {
//       selectedBrandCollabs: newCollabs,
//     })
//   }

//   // Personality quiz
//   const handlePersonalityAnswer = async (question: string, answer: string) => {
//     const newAnswers = {
//       ...personalityAnswers,
//       [question]: answer,
//     }

//     setPersonalityAnswers(newAnswers)

//     // Simple algorithm to determine personality type
//     setTimeout(async () => {
//       const answers = newAnswers
//       const counts: Record<string, number> = {
//         Creator: 0,
//         Connector: 0,
//         Educator: 0,
//         Trendsetter: 0,
//       }

//       Object.values(answers).forEach((a) => {
//         if (a.includes("creative") || a.includes("original")) counts.Creator++
//         if (a.includes("people") || a.includes("community")) counts.Connector++
//         if (a.includes("teach") || a.includes("inform")) counts.Educator++
//         if (a.includes("trend") || a.includes("new")) counts.Trendsetter++
//       })

//       // Find the highest score
//       let maxType = "Creator"
//       let maxCount = 0

//       Object.entries(counts).forEach(([type, count]) => {
//         if (count > maxCount) {
//           maxType = type
//           maxCount = count
//         }
//       })

//       setPersonalityResult(maxType)

//       // Save this step data
//       await saveOnboardingData(step, {
//         personalityAnswers: newAnswers,
//         personalityResult: maxType,
//       })
//     }, 300)
//   }

//   // Helper functions
//   const getProgressColor = () => {
//     if (progress < 30) return "bg-red-500"
//     if (progress < 70) return "bg-yellow-500"
//     return "bg-green-500"
//   }

//   // Add a loading overlay component for the entire form
//   const LoadingOverlay = () => (
//     <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
//       <div className="flex flex-col items-center gap-4">
//         <Loader2 className="h-8 w-8 animate-spin text-primary" />
//         <p className="text-sm font-medium">Please wait...</p>
//       </div>
//     </div>
//   )

//   // Render the questionnaire
//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
//       <Card className="relative w-full max-w-md overflow-hidden border-none bg-card shadow-lg">
//         {(isStepTransitioning || isSubmitting) && <LoadingOverlay />}
//         <CardContent className="p-0">
//           <div className="bg-primary/10 p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h1 className="text-2xl font-bold text-primary">Welcome to Yazzil!</h1>
//                 <p className="text-muted-foreground">Let&apos;s set up your experience</p>
//               </div>

//               {showMascot && (
//                 <div className="relative">
//                   <Mascot emotion={mascotEmotion} />
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-background p-0"
//                     onClick={() => setShowMascot(false)}
//                   >
//                     <XIcon className="h-3 w-3" />
//                   </Button>
//                 </div>
//               )}
//             </div>

//             <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-primary/10">
//               <motion.div
//                 className={cn("h-full rounded-full", getProgressColor())}
//                 initial={{ width: 0 }}
//                 animate={{ width: `${progress}%` }}
//                 transition={{ duration: 0.5 }}
//               />
//             </div>

//             <div className="mt-1 flex justify-between text-xs text-muted-foreground">
//               <span>
//                 Step {step + 1} of {totalSteps}
//               </span>
//               <span>{Math.round(progress)}% Complete</span>
//             </div>

//             {/* Save progress button */}
//             <div className="mt-2 flex items-center justify-end gap-2">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="h-7 gap-1 text-xs"
//                 onClick={saveProgress}
//                 disabled={isSaving || !onboardingInitialized}
//               >
//                 {isSaving ? (
//                   <>
//                     <Loader2 className="h-3 w-3 animate-spin" />
//                     Saving...
//                   </>
//                 ) : (
//                   <>
//                     <Save className="h-3 w-3" />
//                     Save Progress
//                   </>
//                 )}
//               </Button>

//               {lastSaved && (
//                 <span className="text-xs text-muted-foreground">Last saved: {lastSaved.toLocaleTimeString()}</span>
//               )}
//             </div>
//           </div>

//           <div className="min-h-[500px] p-6">
//             <AnimatePresence mode="wait">
//               {/* Add a transition indicator between steps */}
//               {isStepTransitioning && (
//                 <motion.div
//                   key="transition"
//                   className="absolute inset-0 flex items-center justify-center"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   <div className="flex flex-col items-center gap-4">
//                     <Loader2 className="h-8 w-8 animate-spin text-primary" />
//                     <p className="text-sm font-medium">Loading next step...</p>
//                   </div>
//                 </motion.div>
//               )}
//               {/* Step 1: User Type Selection */}
//               {step === 0 && (
//                 <motion.div
//                   key="step0"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   transition={{ duration: 0.3 }}
//                   className="space-y-6"
//                 >
//                   <h2 className="text-xl font-semibold">Tell us about yourself</h2>
//                   <p className="text-muted-foreground">Which option best describes you?</p>

//                   <div className="grid gap-4">
//                     <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
//                       <Button
//                         variant="outline"
//                         className="flex h-auto w-full items-start justify-start gap-4 p-4 text-left"
//                         onClick={() => setUserAndAdvance("regular")}
//                       >
//                         <div className="rounded-full bg-primary/10 p-2">
//                           <Users className="h-6 w-6 text-primary" />
//                         </div>
//                         <div className="flex-1">
//                           <div className="font-medium">Regular User</div>
//                           <div className="text-sm text-muted-foreground">I want to grow my Business</div>
//                         </div>
//                         <ChevronRight className="h-5 w-5 text-muted-foreground" />
//                       </Button>
//                     </motion.div>

//                     <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
//                       <Button
//                         variant="outline"
//                         className="flex h-auto w-full items-start justify-start gap-2 p-2 text-left"
//                         onClick={() => setUserAndAdvance("influencer")}
//                       >
//                         <div className="rounded-full bg-primary/10 p-2">
//                           <Star className="h-6 w-6 text-primary" />
//                         </div>
//                         <div className="flex-1">
//                           <div className="font-medium">Influencer</div>
//                           <div className="text-sm text-muted-foreground">
//                             I am an influencer with  a significant following and brand partnerships
//                           </div>
//                         </div>
//                         <ChevronRight className="h-5 w-5 text-muted-foreground" />
//                       </Button>
//                     </motion.div>
//                   </div>
//                 </motion.div>
//               )}
//               {/* Step 2: Profile Picture */}
//               {step === 1 && (
//                 <motion.div
//                   key="step1"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   transition={{ duration: 0.3 }}
//                   className="space-y-6"
//                 >
//                   <h2 className="text-xl font-semibold">Add a profile picture</h2>
//                   <p className="text-muted-foreground">This will be displayed on your profile and dashboard</p>

//                   <div className="flex flex-col items-center justify-center space-y-4">
//                     <div className="relative">
//                       <Avatar className="h-32 w-32 border-2 border-primary/20">
//                         {profileImage ? (
//                           <AvatarImage src={profileImage} alt="Profile" />
//                         ) : (
//                           <AvatarFallback className="bg-primary/10 text-2xl">
//                             {userType === "influencer" ? "INF" : "USR"}
//                           </AvatarFallback>
//                         )}
//                       </Avatar>
//                       <Button
//                         size="icon"
//                         variant="secondary"
//                         className="absolute bottom-0 right-0 rounded-full"
//                         onClick={() => fileInputRef.current?.click()}
//                       >
//                         <Camera className="h-4 w-4" />
//                       </Button>
//                       <input
//                         type="file"
//                         ref={fileInputRef}
//                         className="hidden"
//                         accept="image/*"
//                         onChange={handleFileChange}
//                       />
//                     </div>

//                     <div className="text-center text-sm text-muted-foreground">
//                       {profileImage ? (
//                         <span className="flex items-center gap-1 text-green-500">
//                           <Check className="h-4 w-4" /> Image uploaded
//                         </span>
//                       ) : (
//                         "Click to upload an image"
//                       )}
//                     </div>

//                     {isUploading && (
//                       <div className="w-full space-y-2 mt-2">
//                         <div className="flex items-center justify-between">
//                           <span className="text-xs text-muted-foreground">Uploading image...</span>
//                           <span className="text-xs text-muted-foreground">{uploadProgress}%</span>
//                         </div>
//                         <Progress value={uploadProgress} className="h-1" />
//                       </div>
//                     )}

//                     <Button onClick={nextStep} className="mt-4 w-full" disabled={isSubmitting || isStepTransitioning}>
//                       {isStepTransitioning ? (
//                         <>
//                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                           {profileImage ? "Saving..." : "Skipping..."}
//                         </>
//                       ) : profileImage ? (
//                         "Continue"
//                       ) : (
//                         "Skip for now"
//                       )}
//                     </Button>
//                   </div>
//                 </motion.div>
//               )}
//               {/* Step 3: Content Categories */}
//               {step === 2 && (
//                 <motion.div
//                   key="step2"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   transition={{ duration: 0.3 }}
//                   className="space-y-6"
//                 >
//                   <h2 className="text-xl font-semibold">Content Categories</h2>
//                   <p className="text-muted-foreground">Select your primary content categories (up to 5)</p>

//                   <div className="grid grid-cols-3 gap-3">
//                     {contentCategories.map((category) => (
//                       <motion.div key={category.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                         <Button
//                           variant={selectedCategories.includes(category.name) ? "default" : "outline"}
//                           className={cn(
//                             "flex h-auto w-full flex-col items-center justify-center gap-2 p-3 text-center",
//                             selectedCategories.includes(category.name) ? "border-primary" : "",
//                           )}
//                           onClick={() => handleCategoryToggle(category.name)}
//                           disabled={!selectedCategories.includes(category.name) && selectedCategories.length >= 5}
//                         >
//                           <div
//                             className={cn("flex h-10 w-10 items-center justify-center rounded-full", category.color)}
//                           >
//                             <span className="text-xl">{category.icon}</span>
//                           </div>
//                           <span className="text-xs font-medium">{category.name}</span>
//                         </Button>
//                       </motion.div>
//                     ))}
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-muted-foreground">{selectedCategories.length}/5 selected</span>
//                     <Button onClick={nextStep} disabled={selectedCategories.length === 0 || isSubmitting}>
//                       Continue
//                     </Button>
//                   </div>
//                 </motion.div>
//               )}
//               {/* Step 4: Social Media Handles */}
//               {step === 3 && (
//                 <motion.div
//                   key="step3"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   transition={{ duration: 0.3 }}
//                   className="space-y-6"
//                 >
//                   <h2 className="text-xl font-semibold">Social Media Profiles</h2>
//                   <p className="text-muted-foreground">Add your social media handles</p>

//                   <div className="space-y-4">
//                     {socialPlatforms.map((platform) => (
//                       <div key={platform.name} className="space-y-2">
//                         <Label className="flex items-center gap-2">
//                           <div className={cn("flex h-5 w-5 items-center justify-center rounded-md", platform.color)}>
//                             {platform.icon}
//                           </div>
//                           {platform.name}
//                         </Label>
//                         <div className="flex items-center gap-2">
//                           <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
//                             <AtSign className="h-4 w-4 text-muted-foreground" />
//                           </div>
//                           <Input
//                             placeholder={platform.placeholder}
//                             value={socialHandles[platform.name] || ""}
//                             onChange={(e) => handleSocialHandleChange(platform.name, e.target.value)}
//                             className="flex-1"
//                           />
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {/* AI Analysis for Influencers */}
//                   {userType === "influencer" && socialHandles.Instagram && (
//                     <div className="mt-4">
//                       <AiProfileAnalysis handle={socialHandles.Instagram} onComplete={setAiAnalysisResult} />
//                     </div>
//                   )}

//                   <Button
//                     onClick={nextStep}
//                     className="w-full"
//                     disabled={Object.keys(socialHandles).length === 0 || isSubmitting}
//                   >
//                     {Object.keys(socialHandles).length > 0 ? "Continue" : "Skip for now"}
//                   </Button>
//                 </motion.div>
//               )}
//               {/* Step 5: Email */}
//               {step === 4 && (
//                 <motion.div
//                   key="step4"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   transition={{ duration: 0.3 }}
//                   className="space-y-6"
//                 >
//                   <h2 className="text-xl font-semibold">Contact Information</h2>
//                   <p className="text-muted-foreground">Add your email address</p>

//                   <div className="space-y-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="email" className="flex items-center gap-2">
//                         <Mail className="h-4 w-4 text-primary" />
//                         Email Address
//                       </Label>
//                       <Input
//                         id="email"
//                         type="email"
//                         placeholder="your@email.com"
//                         value={email}
//                         onChange={(e) => {
//                           setEmail(e.target.value)
//                           saveOnboardingData(step, { email: e.target.value })
//                         }}
//                       />
//                     </div>
//                   </div>

//                   <Button
//                     onClick={nextStep}
//                     className="w-full"
//                     disabled={!email || !email.includes("@") || isSubmitting}
//                   >
//                     Continue
//                   </Button>
//                 </motion.div>
//               )}
//               {/* Step 6: Phone Verification */}
//               {step === 5 && (
//                 <motion.div
//                   key="step5"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   transition={{ duration: 0.3 }}
//                   className="space-y-6"
//                 >
//                   <h2 className="text-xl font-semibold">Phone Verification</h2>
//                   <p className="text-muted-foreground">
//                     {verificationStep === "input"
//                       ? "Add and verify your phone number"
//                       : "Enter the verification code sent to your phone"}
//                   </p>

//                   <div className="space-y-6">
//                     {verificationStep === "input" ? (
//                       <div className="space-y-4">
//                         <div className="space-y-2">
//                           <Label htmlFor="phone" className="flex items-center gap-2">
//                             <Phone className="h-4 w-4 text-primary" />
//                             Phone Number
//                           </Label>
//                           <div className="flex items-center gap-2">
//                             <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
//                               <Smartphone className="h-4 w-4 text-muted-foreground" />
//                             </div>
//                             <Input
//                               id="phone"
//                               type="tel"
//                               placeholder="+1 (555) 123-4567"
//                               value={phoneNumber}
//                               onChange={(e) => setPhoneNumber(e.target.value)}
//                               className="flex-1"
//                             />
//                           </div>
//                         </div>

//                         <Button onClick={handleVerifyPhone} className="w-full" disabled={!phoneNumber || isVerifying}>
//                           {isVerifying ? (
//                             <>
//                               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                               Sending Code...
//                             </>
//                           ) : (
//                             "Send Verification Code"
//                           )}
//                         </Button>
//                       </div>
//                     ) : (
//                       <div className="space-y-4">
//                         <div className="space-y-2">
//                           <Label htmlFor="code" className="flex items-center gap-2">
//                             <Lock className="h-4 w-4 text-primary" />
//                             Verification Code
//                           </Label>
//                           <div className="flex items-center gap-2">
//                             <Input
//                               id="code"
//                               type="text"
//                               placeholder="Enter 6-digit code"
//                               value={verificationCode}
//                               onChange={(e) => setVerificationCode(e.target.value)}
//                               className="flex-1 text-center text-xl tracking-widest"
//                               maxLength={6}
//                             />
//                           </div>
//                           <p className="text-xs text-muted-foreground">
//                             For demo purposes, the code is: <span className="font-mono font-bold">{expectedCode}</span>
//                           </p>
//                         </div>

//                         <div className="flex gap-2">
//                           <Button
//                             variant="outline"
//                             onClick={() => setVerificationStep("input")}
//                             className="flex-1"
//                             disabled={isVerifying}
//                           >
//                             Back
//                           </Button>
//                           <Button
//                             onClick={handleCheckVerificationCode}
//                             className="flex-1"
//                             disabled={!verificationCode || verificationCode.length < 6 || isVerifying}
//                           >
//                             {isVerifying ? (
//                               <>
//                                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                                 Verifying...
//                               </>
//                             ) : (
//                               "Verify Code"
//                             )}
//                           </Button>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </motion.div>
//               )}
//               {/* Step 7: Content Strategy (Influencer) or Learning Goals (Regular) */}
//               {step === 6 && (
//                 <motion.div
//                   key="step6"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   transition={{ duration: 0.3 }}
//                   className="space-y-6"
//                 >
//                   {userType === "influencer" ? (
//                     <>
//                       <h2 className="text-xl font-semibold">Content Strategy</h2>
//                       <p className="text-muted-foreground">Tell us about your content creation approach</p>

//                       <div className="space-y-6">
//                         <div className="space-y-2">
//                           <Label>How often do you post content?</Label>
//                           <RadioGroup
//                             value={selectedContentFrequency}
//                             onValueChange={(value) => {
//                               setSelectedContentFrequency(value)
//                               saveOnboardingData(step, { selectedContentFrequency: value })
//                             }}
//                           >
//                             <div className="grid grid-cols-2 gap-2">
//                               {contentFrequencies.map((frequency) => (
//                                 <div key={frequency} className="flex items-center space-x-2">
//                                   <RadioGroupItem value={frequency} id={`frequency-${frequency}`} />
//                                   <Label htmlFor={`frequency-${frequency}`} className="text-sm">
//                                     {frequency}
//                                   </Label>
//                                 </div>
//                               ))}
//                             </div>
//                           </RadioGroup>
//                         </div>

//                         <div className="space-y-2">
//                           <Label>Which days do you typically post?</Label>
//                           <ContentCalendar selectedDays={selectedContentDays} onSelectDay={toggleContentDay} />
//                         </div>

//                         <div className="space-y-2">
//                           <Label>What types of brand collaborations do you prefer?</Label>
//                           <div className="grid grid-cols-2 gap-2">
//                             {brandCollabTypes.map((collab) => (
//                               <div key={collab} className="flex items-center space-x-2">
//                                 <Checkbox
//                                   id={`collab-${collab}`}
//                                   checked={selectedBrandCollabs.includes(collab)}
//                                   onCheckedChange={() => toggleBrandCollab(collab)}
//                                 />
//                                 <Label htmlFor={`collab-${collab}`} className="text-sm">
//                                   {collab}
//                                 </Label>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     </>
//                   ) : (
//                     <>
//                       <h2 className="text-xl font-semibold">Learning Goals</h2>
//                       <p className="text-muted-foreground">What would you like to learn about?</p>

//                       <div className="space-y-6">
//                         <div className="space-y-2">
//                           <Label>Select topics you&apos;re interested in learning:</Label>
//                           <div className="grid grid-cols-2 gap-2">
//                             {learningTopics.map((topic) => (
//                               <div key={topic} className="flex items-center space-x-2">
//                                 <Checkbox
//                                   id={`topic-${topic}`}
//                                   checked={selectedLearningTopics.includes(topic)}
//                                   onCheckedChange={() => toggleLearningTopic(topic)}
//                                 />
//                                 <Label htmlFor={`topic-${topic}`} className="text-sm">
//                                   {topic}
//                                 </Label>
//                               </div>
//                             ))}
//                           </div>
//                         </div>

//                         <div className="space-y-2">
//                           <Label>What are your biggest growth challenges?</Label>
//                           <div className="grid grid-cols-2 gap-2">
//                             {growthChallenges.map((challenge) => (
//                               <div key={challenge} className="flex items-center space-x-2">
//                                 <Checkbox
//                                   id={`challenge-${challenge}`}
//                                   checked={selectedGrowthChallenges.includes(challenge)}
//                                   onCheckedChange={() => toggleGrowthChallenge(challenge)}
//                                 />
//                                 <Label htmlFor={`challenge-${challenge}`} className="text-sm">
//                                   {challenge}
//                                 </Label>
//                               </div>
//                             ))}
//                           </div>
//                         </div>

//                         <div className="space-y-2">
//                           <Label>Tell us your goals in your own words:</Label>
//                           <div className="flex items-center gap-2">
//                             <Textarea
//                               placeholder="I want to grow my account and..."
//                               value={goalStatement}
//                               onChange={(e) => {
//                                 setGoalStatement(e.target.value)
//                                 saveOnboardingData(step, { goalStatement: e.target.value })
//                               }}
//                               className="min-h-[80px] flex-1"
//                             />
//                             <TooltipProvider>
//                               <Tooltip>
//                                 <TooltipTrigger asChild>
//                                   <Button
//                                     variant="outline"
//                                     size="icon"
//                                     className="h-10 w-10 shrink-0"
//                                     onClick={() => {
//                                       setGoalStatement("")
//                                       toast({
//                                         title: "Voice Input Ready",
//                                         description: "Click the microphone to start recording",
//                                       })
//                                     }}
//                                   >
//                                     <Mic className="h-4 w-4" />
//                                   </Button>
//                                 </TooltipTrigger>
//                                 <TooltipContent>
//                                   <p>Use voice input</p>
//                                 </TooltipContent>
//                               </Tooltip>
//                             </TooltipProvider>
//                           </div>
//                         </div>
//                       </div>
//                     </>
//                   )}

//                   <Button onClick={nextStep} className="w-full" disabled={isSubmitting}>
//                     Continue
//                   </Button>
//                 </motion.div>
//               )}
             
//               {step === 7 && (
//                 <motion.div
//                   key="step7"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   transition={{ duration: 0.3 }}
//                   className="space-y-6"
//                 >
//                   {userType === "influencer" ? (
//                     <>
//                       <h2 className="text-xl font-semibold">Content Style</h2>
//                       <p className="text-muted-foreground">Select your preferred aesthetic</p>

//                       <div className="grid grid-cols-2 gap-4">
//                         {contentStyles.map((style, index) => (
//                           <motion.div key={style.name} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
//                             <Button
//                               variant={selectedContentStyle === style.name ? "default" : "outline"}
//                               className={cn(
//                                 "flex h-auto w-full flex-col items-center justify-center gap-2 p-4 text-center",
//                                 selectedContentStyle === style.name ? "border-primary" : "",
//                               )}
//                               onClick={() => {
//                                 setSelectedContentStyle(style.name)
//                                 saveOnboardingData(step, { selectedContentStyle: style.name })
//                               }}
//                             >
//                               <span className="text-2xl">{style.icon}</span>
//                               <div>
//                                 <div className="font-medium">{style.name}</div>
//                                 <div className="text-xs text-muted-foreground">{style.description}</div>
//                               </div>
//                             </Button>
//                           </motion.div>
//                         ))}
//                       </div>

//                       <div className="space-y-4">
//                         <h3 className="font-medium">Visual Mood Board</h3>
//                         <div className="grid grid-cols-3 gap-2">
//                           {[1, 2, 3, 4, 5, 6].map((i) => (
//                             <div key={i} className="group relative aspect-square overflow-hidden rounded-md bg-muted">
//                               <div className="absolute inset-0 flex items-center justify-center">
//                                 <ImageIcon className="h-6 w-6 text-muted-foreground" />
//                               </div>
//                               <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
//                                 <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
//                                   <Plus className="h-4 w-4" />
//                                 </Button>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     </>
//                   ) : (
//                     <>
//                       <h2 className="text-xl font-semibold">Content Creator Personality</h2>
//                       <p className="text-muted-foreground">Let&apos;s discover your content creator type</p>

//                       <div className="space-y-6">
//                         {personalityResult ? (
//                           <div className="space-y-4">
//                             <div className="rounded-lg border bg-card p-4">
//                               <div className="flex items-center gap-3">
//                                 <div className="rounded-full bg-primary/10 p-2">
//                                   {personalityTypes.find((p) => p.type === personalityResult)?.icon || (
//                                     <Star className="h-5 w-5 text-primary" />
//                                   )}
//                                 </div>
//                                 <div>
//                                   <h3 className="font-semibold">You&apos;re a {personalityResult}!</h3>
//                                   <p className="text-sm text-muted-foreground">
//                                     {personalityTypes.find((p) => p.type === personalityResult)?.description}
//                                   </p>
//                                 </div>
//                               </div>

//                               <div className="mt-4 space-y-3">
//                                 <div>
//                                   <h4 className="text-sm font-medium">Your Strengths:</h4>
//                                   <ul className="mt-1 list-inside list-disc text-sm text-muted-foreground">
//                                     {personalityTypes
//                                       .find((p) => p.type === personalityResult)
//                                       ?.strengths.map((strength, i) => (
//                                         <li key={i}>{strength}</li>
//                                       ))}
//                                   </ul>
//                                 </div>

//                                 <div>
//                                   <h4 className="text-sm font-medium">Recommended Strategies:</h4>
//                                   <ul className="mt-1 list-inside list-disc text-sm text-muted-foreground">
//                                     {personalityTypes
//                                       .find((p) => p.type === personalityResult)
//                                       ?.strategies.map((strategy, i) => (
//                                         <li key={i}>{strategy}</li>
//                                       ))}
//                                   </ul>
//                                 </div>
//                               </div>
//                             </div>

//                             <div className="flex justify-center">
//                               <Button variant="outline" size="sm" onClick={() => setPersonalityResult("")}>
//                                 Retake Quiz
//                               </Button>
//                             </div>
//                           </div>
//                         ) : (
//                           <div className="space-y-4">
//                             <div className="space-y-3">
//                               <div className="space-y-2">
//                                 <Label>When creating content, I prefer to:</Label>
//                                 <RadioGroup
//                                   value={personalityAnswers["q1"] || ""}
//                                   onValueChange={(value) => handlePersonalityAnswer("q1", value)}
//                                 >
//                                   <div className="space-y-2">
//                                     <div className="flex items-center space-x-2">
//                                       <RadioGroupItem value="express my creative ideas" id="q1-a" />
//                                       <Label htmlFor="q1-a">Express my creative ideas</Label>
//                                     </div>
//                                     <div className="flex items-center space-x-2">
//                                       <RadioGroupItem value="connect with my community" id="q1-b" />
//                                       <Label htmlFor="q1-b">Connect with my community</Label>
//                                     </div>
//                                     <div className="flex items-center space-x-2">
//                                       <RadioGroupItem value="teach others something new" id="q1-c" />
//                                       <Label htmlFor="q1-c">Teach others something new</Label>
//                                     </div>
//                                     <div className="flex items-center space-x-2">
//                                       <RadioGroupItem value="try the latest trends" id="q1-d" />
//                                       <Label htmlFor="q1-d">Try the latest trends</Label>
//                                     </div>
//                                   </div>
//                                 </RadioGroup>
//                               </div>

//                               <div className="space-y-2">
//                                 <Label>I get the most satisfaction from:</Label>
//                                 <RadioGroup
//                                   value={personalityAnswers["q2"] || ""}
//                                   onValueChange={(value) => handlePersonalityAnswer("q2", value)}
//                                 >
//                                   <div className="space-y-2">
//                                     <div className="flex items-center space-x-2">
//                                       <RadioGroupItem value="creating original content" id="q2-a" />
//                                       <Label htmlFor="q2-a">Creating original content</Label>
//                                     </div>
//                                     <div className="flex items-center space-x-2">
//                                       <RadioGroupItem value="building a community of people" id="q2-b" />
//                                       <Label htmlFor="q2-b">Building a community of people</Label>
//                                     </div>
//                                     <div className="flex items-center space-x-2">
//                                       <RadioGroupItem value="informing and educating others" id="q2-c" />
//                                       <Label htmlFor="q2-c">Informing and educating others</Label>
//                                     </div>
//                                     <div className="flex items-center space-x-2">
//                                       <RadioGroupItem value="discovering new trends" id="q2-d" />
//                                       <Label htmlFor="q2-d">Discovering new trends</Label>
//                                     </div>
//                                   </div>
//                                 </RadioGroup>
//                               </div>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </>
//                   )}

//                   <Button
//                     onClick={nextStep}
//                     className="w-full"
//                     disabled={isSubmitting || (userType === "influencer" && !selectedContentStyle)}
//                   >
//                     Continue
//                   </Button>
//                 </motion.div>
//               )}
//               {/* Step 8: Income Goals */}
//               {step === 8 && (
//                 <motion.div
//                   key="step8"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   transition={{ duration: 0.3 }}
//                   className="space-y-6"
//                 >
//                   <h2 className="text-xl font-semibold">Income Goals</h2>
//                   <p className="text-muted-foreground">What are your monthly income goals?</p>

//                   <div className="space-y-6">
//                     <Tabs defaultValue="slider" className="w-full">
//                       <TabsList className="grid w-full grid-cols-2">
//                         <TabsTrigger value="slider">Slider</TabsTrigger>
//                         <TabsTrigger value="preset">Preset Ranges</TabsTrigger>
//                       </TabsList>
//                       <TabsContent value="slider" className="space-y-4 pt-4">
//                         <div className="space-y-6">
//                           <div className="flex flex-col items-center justify-center">
//                             <div className="text-3xl font-bold text-primary">${incomeGoal.toLocaleString()}</div>
//                             <div className="text-sm text-muted-foreground">per month</div>
//                           </div>

//                           <div className="px-2">
//                             <Slider
//                               defaultValue={[incomeGoal]}
//                               max={userType === "influencer" ? 100000 : 20000}
//                               step={100}
//                               onValueChange={handleIncomeSliderChange}
//                             />

//                             <div className="flex justify-between text-xs text-muted-foreground">
//                               <span>$0</span>
//                               <span>${userType === "influencer" ? "100,000" : "20,000"}+</span>
//                             </div>
//                           </div>

//                           <div className="rounded-lg border bg-card p-4 shadow-sm">
//                             <div className="flex items-center gap-2">
//                               <Badge variant="outline" className="bg-primary/10 text-primary">
//                                 {getCurrentIncomeRange().level}
//                               </Badge>
//                               <span className="text-sm font-medium">{getCurrentIncomeRange().label}</span>
//                             </div>
//                           </div>
//                         </div>
//                       </TabsContent>

//                       <TabsContent value="preset" className="space-y-4 pt-4">
//                         <RadioGroup
//                           value={selectedIncomeRange.toString()}
//                           onValueChange={(value) => handleIncomeRangeSelect(Number.parseInt(value))}
//                           className="space-y-3"
//                         >
//                           {incomeRanges.map((range, index) => (
//                             <div key={index} className="flex items-center space-x-2">
//                               <RadioGroupItem value={index.toString()} id={`range-${index}`} />
//                               <Label
//                                 htmlFor={`range-${index}`}
//                                 className="flex flex-1 cursor-pointer items-center justify-between rounded-md border p-3 hover:bg-accent"
//                               >
//                                 <div className="flex items-center gap-2">
//                                   <DollarSign className="h-4 w-4 text-primary" />
//                                   <span>{range.label}</span>
//                                 </div>
//                                 <Badge variant="outline">{range.level}</Badge>
//                               </Label>
//                             </div>
//                           ))}
//                         </RadioGroup>
//                       </TabsContent>
//                     </Tabs>

//                     {/* Income Projection */}
//                     <IncomeProjection
//                       currentIncome={userType === "influencer" ? 2000 : 500}
//                       targetIncome={incomeGoal}
//                       months={12}
//                     />

//                     <div className="flex items-center space-x-2">
//                       <Checkbox
//                         id="terms"
//                         checked={acceptedTerms}
//                         onCheckedChange={(checked) => {
//                           const isChecked = checked as boolean
//                           setAcceptedTerms(isChecked)
//                           saveOnboardingData(step, { acceptedTerms: isChecked })
//                         }}
//                       />
//                       <Label htmlFor="terms" className="text-sm">
//                         I understand this is my target goal and actual results may vary
//                       </Label>
//                     </div>

//                     <Button onClick={nextStep} className="w-full" disabled={!acceptedTerms || isSubmitting}>
//                       {userType === "influencer" && step < 9 ? "Continue" : "Complete Setup"}
//                     </Button>
//                   </div>
//                 </motion.div>
//               )}
//               {/* Step 9: Achievements (Influencer only) */}
//               {userType === "influencer" && step === 9 && (
//                 <motion.div
//                   key="step9"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   transition={{ duration: 0.3 }}
//                   className="space-y-6"
//                 >
//                   <h2 className="text-xl font-semibold">Your Achievements</h2>
//                   <p className="text-muted-foreground">Unlock achievements as you grow</p>

//                   <div className="grid grid-cols-3 gap-3">
//                     <AchievementBadge
//                       title="Profile Setup"
//                       icon={<UserIcon className="h-5 w-5 text-primary" />}
//                       isUnlocked={achievements.profile}
//                       onUnlock={() => unlockAchievement("profile")}
//                     />
//                     <AchievementBadge
//                       title="Categories"
//                       icon={<LayersIcon className="h-5 w-5 text-primary" />}
//                       isUnlocked={achievements.categories}
//                       onUnlock={() => unlockAchievement("categories")}
//                     />
//                     <AchievementBadge
//                       title="Social Connect"
//                       icon={<Share2 className="h-5 w-5 text-primary" />}
//                       isUnlocked={achievements.social}
//                       onUnlock={() => unlockAchievement("social")}
//                     />
//                     <AchievementBadge
//                       title="Verified"
//                       icon={<BadgeCheckIcon className="h-5 w-5 text-primary" />}
//                       isUnlocked={achievements.verification}
//                       onUnlock={() => unlockAchievement("verification")}
//                     />
//                     <AchievementBadge
//                       title="Goal Setter"
//                       icon={<TargetIcon className="h-5 w-5 text-primary" />}
//                       isUnlocked={achievements.goals}
//                       onUnlock={() => unlockAchievement("goals")}
//                     />
//                     <AchievementBadge
//                       title="First Post"
//                       icon={<ImageIcon className="h-5 w-5 text-primary" />}
//                       isUnlocked={false}
//                     />
//                   </div>

//                   <div className="rounded-lg border bg-card p-4">
//                     <h3 className="font-medium">Referral Program</h3>
//                     <p className="mt-1 text-sm text-muted-foreground">Invite other influencers and earn rewards</p>

//                     <div className="mt-3 flex items-center gap-2">
//                       <Input value="https://yazil.com/ref/yourname" readOnly className="flex-1 bg-muted" />
//                       <Button variant="outline" size="sm" className="shrink-0">
//                         <CopyIcon className="mr-1 h-3 w-3" />
//                         Copy
//                       </Button>
//                     </div>
//                   </div>

//                   <Button onClick={nextStep} className="w-full" disabled={isSubmitting}>
//                     Complete Setup
//                   </Button>
//                 </motion.div>
//               )}
//               {/* Final Step: Completion */}
//               {((userType === "regular" && step === 9) || (userType === "influencer" && step === 10)) && (
//                 <motion.div
//                   key="stepFinal"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   transition={{ duration: 0.3 }}
//                   className="space-y-6"
//                 >
//                   <div className="flex flex-col items-center justify-center py-6 text-center">
//                     {isSubmitting ? (
//                       <div className="flex flex-col items-center justify-center space-y-4">
//                         <Loader2 className="h-12 w-12 animate-spin text-primary" />
//                         <h2 className="text-xl font-semibold">Setting up your account...</h2>
//                         <p className="text-muted-foreground">This will only take a moment</p>
//                       </div>
//                     ) : (
//                       <>
//                         <motion.div
//                           initial={{ scale: 0 }}
//                           animate={{ scale: 1 }}
//                           transition={{
//                             type: "spring",
//                             stiffness: 260,
//                             damping: 20,
//                             delay: 0.1,
//                           }}
//                           className="mb-6 rounded-full bg-green-500/10 p-4"
//                         >
//                           <Check className="h-12 w-12 text-green-500" />
//                         </motion.div>
//                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
//                           <h2 className="text-2xl font-bold">You&apos;re all set!</h2>
//                           <p className="mt-2 text-muted-foreground">
//                             {userType === "influencer"
//                               ? "Your influencer dashboard is ready."
//                               : "Your dashboard is ready."}
//                           </p>

//                           <div className="mt-6 space-y-4">
//                             <div className="rounded-lg border bg-card p-4">
//                               <h3 className="font-medium">Account Summary</h3>
//                               <div className="mt-2 space-y-2 text-sm">
//                                 <div className="flex justify-between">
//                                   <span className="text-muted-foreground">Account Type:</span>
//                                   <span className="font-medium">
//                                     {userType === "influencer" ? "Influencer" : "Regular User"}
//                                   </span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                   <span className="text-muted-foreground">Categories:</span>
//                                   <span className="font-medium">{selectedCategories.length} selected</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                   <span className="text-muted-foreground">Monthly Goal:</span>
//                                   <span className="font-medium">${incomeGoal.toLocaleString()}</span>
//                                 </div>
//                                 {userType === "influencer" && (
//                                   <div className="flex justify-between">
//                                     <span className="text-muted-foreground">Content Style:</span>
//                                     <span className="font-medium">{selectedContentStyle}</span>
//                                   </div>
//                                 )}
//                                 {userType === "regular" && personalityResult && (
//                                   <div className="flex justify-between">
//                                     <span className="text-muted-foreground">Creator Type:</span>
//                                     <span className="font-medium">{personalityResult}</span>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>

//                             <Button
//                               onClick={() => {
//                                 if (userType === "influencer") {
//                                   router.push("/influencers")
//                                 } else {
//                                   router.push("/dashboard")
//                                 }
//                               }}
//                               className="w-full"
//                             >
//                               Go to Dashboard
//                               <ChevronRight className="ml-2 h-4 w-4" />
//                             </Button>
//                           </div>
//                         </motion.div>
//                       </>
//                     )}
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           {step > 0 && step < (userType === "influencer" ? 10 : 9) && (
//             <div className="flex items-center justify-between border-t p-4">
//               <Button variant="ghost" size="sm" onClick={prevStep} disabled={isSubmitting || isStepTransitioning}>
//                 {isStepTransitioning ? (
//                   <>
//                     <Loader2 className="mr-2 h-3 w-3 animate-spin" />
//                     Going back...
//                   </>
//                 ) : (
//                   "Back"
//                 )}
//               </Button>
//               {step !== 5 && (
//                 <Button size="sm" onClick={nextStep} disabled={isSubmitting || isStepTransitioning}>
//                   {isStepTransitioning ? (
//                     <>
//                       <Loader2 className="mr-2 h-3 w-3 animate-spin" />
//                       Skipping...
//                     </>
//                   ) : (
//                     "Skip"
//                   )}
//                 </Button>
//               )}
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// // Missing components that were used in the code
// function Play(props: any) {
//   return <Video {...props} />
// }

// function User(props: any) {
//   return <Users {...props} />
// }

// function Layers(props: any) {
//   return <Palette {...props} />
// }

// function BadgeCheck(props: any) {
//   return <Check {...props} />
// }

// function Target(props: any) {
//   return <Flag {...props} />
// }

// function Copy(props: any) {
//   return <Paperclip {...props} />
// }

// function X(props: any) {
//   return <AlertCircle {...props} />
// }

"use client"

import { useState, useEffect } from "react"
import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  Building2,
  Camera,
  Check,
  DollarSign,
  Instagram,
  Star,
  TrendingUp,
  Users,
  MessageCircle,
  Video,
  ImageIcon,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import confetti from "canvas-confetti"

// Components
import OnboardingLayout from "@/components/global/onboarding/layout"
import UserTypeSelection from "@/components/global/onboarding/steps/user-type-selection"
import ProfileSetup from "@/components/global/onboarding/steps/profile-setup"
import ContentCategories from "@/components/global/onboarding/steps/content-categories"
import SocialAccounts from "@/components/global/onboarding/steps/social-accounts"
import ContactInfo from "@/components/global/onboarding/steps/contact-info"
import PhoneVerification from "@/components/global/onboarding/steps/phone-verification"
import ContentStrategy from "@/components/global/onboarding/steps/content-strategy"
import ContentStyle from "@/components/global/onboarding/steps/content-style"
import IncomeGoals from "@/components/global/onboarding/steps/income-goals"
import Achievements from "@/components/global/onboarding/steps/achievements"
import LearningGoals from "@/components/global/onboarding/steps/learning-goals"
import PersonalityQuiz from "@/components/global/onboarding/steps/personality-quiz"
import CompletionScreen from "@/components/global/onboarding/steps/completion-screen"

// Server actions
import {
  initializeOnboarding,
  updateOnboardingStep,
  saveOnboardingData,
  completeOnboarding,
  setThisUserType,
} from "@/actions/onboarding"

// Mock server actions - replace with your actual implementations
const setUserType = async (type: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return { success: true }
}

const saveOnboardingDataOld = async (step: number, data: any) => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return { success: true }
}

const completeOnboardingOld = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return { success: true }
}

// Enhanced user type definitions
const USER_TYPES = {
  business: {
    title: "Business Owner",
    subtitle: "Scale your business with influencer marketing",
    icon: Building2,
    color: "from-blue-500 to-cyan-500",
    benefits: [
      "Find perfect influencers for your brand",
      "Manage campaigns efficiently",
      "Track ROI and performance",
      "Automate outreach and negotiations",
    ],
    steps: ["Business Profile", "Industry & Goals", "Budget & Preferences", "Team Setup", "Integration Setup"],
  },
  influencer: {
    title: "Content Creator",
    subtitle: "Monetize your influence and grow your brand",
    icon: Star,
    color: "from-purple-500 to-pink-500",
    benefits: [
      "Get discovered by top brands",
      "Negotiate better rates",
      "Manage collaborations seamlessly",
      "Track your earnings and growth",
    ],
    steps: ["Creator Profile", "Content & Niche", "Social Accounts", "Rates & Availability", "Portfolio Setup"],
  },
}

// Business-specific data
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

const BUSINESS_GOALS = [
  {
    id: "brand-awareness",
    title: "Brand Awareness",
    description: "Increase visibility and reach new audiences",
    icon: TrendingUp,
    metrics: ["Reach", "Impressions", "Brand Mentions"],
  },
  {
    id: "sales",
    title: "Drive Sales",
    description: "Convert followers into customers",
    icon: DollarSign,
    metrics: ["Conversions", "Revenue", "ROAS"],
  },
  {
    id: "engagement",
    title: "Community Building",
    description: "Build engaged communities around your brand",
    icon: Users,
    metrics: ["Engagement Rate", "Comments", "Shares"],
  },
  {
    id: "content",
    title: "Content Creation",
    description: "Generate authentic content for your brand",
    icon: Camera,
    metrics: ["Content Volume", "Quality Score", "Usage Rights"],
  },
]

// Influencer-specific data
const CONTENT_NICHES = [
  { name: "Fashion", icon: "👗", earning: "$2.5K avg", demand: "High" },
  { name: "Beauty", icon: "💄", earning: "$3.2K avg", demand: "Very High" },
  { name: "Fitness", icon: "💪", earning: "$2.1K avg", demand: "High" },
  { name: "Food", icon: "🍕", earning: "$1.8K avg", demand: "Medium" },
  { name: "Travel", icon: "✈️", earning: "$4.1K avg", demand: "High" },
  { name: "Tech", icon: "📱", earning: "$3.8K avg", demand: "Very High" },
  { name: "Lifestyle", icon: "🌿", earning: "$2.3K avg", demand: "Medium" },
  { name: "Gaming", icon: "🎮", earning: "$3.5K avg", demand: "High" },
]

const CONTENT_TYPES = [
  { name: "Instagram Posts", icon: ImageIcon, rate: "$500-2K" },
  { name: "Instagram Stories", icon: Clock, rate: "$200-800" },
  { name: "Instagram Reels", icon: Video, rate: "$800-3K" },
  { name: "YouTube Videos", icon: Video, rate: "$1K-5K" },
  { name: "TikTok Videos", icon: Video, rate: "$300-1.5K" },
  { name: "Blog Posts", icon: MessageCircle, rate: "$400-2K" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [userType, setUserType] = useState<"influencer" | "regular" | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [progress, setProgress] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [totalSteps, setTotalSteps] = useState(0)
  const [isVerified, setIsVerified] = useState(false)

  // Get total steps based on user type
  useEffect(() => {
    if (userType === "influencer") {
      setTotalSteps(10)
    } else if (userType === "regular") {
      setTotalSteps(9)
    } else {
      setTotalSteps(1)
    }
  }, [userType])

  // Calculate progress
  useEffect(() => {
    if (totalSteps > 0) {
      setProgress(((currentStep + 1) / totalSteps) * 100)
    }
  }, [currentStep, totalSteps])

  // Handle user type selection
  const handleUserTypeSelect = async (type: "influencer" | "regular") => {
    setIsLoading(true)
    try {
      // Set user type in database
      await setThisUserType(type)

      // Initialize onboarding
      const stepsCount = type === "influencer" ? 10 : 9
      const result = await initializeOnboarding(type, stepsCount)

      if (result.status === 200) {
        setUserType(type)
        setCurrentStep(1)
        setIsInitialized(true)

        toast({
          title: `Welcome ${type === "influencer" ? "Creator" : "Business Owner"}!`,
          description: "Let's set up your profile",
        })
      } else {
        throw new Error(result.data || "Failed to initialize onboarding")
      }
    } catch (error) {
      console.error("Error selecting user type:", error)
      toast({
        title: "Error",
        description: "Failed to set user type. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Update form data
  const updateFormData = (key: string, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev, [key]: value }

      // Auto-save data after a short delay
      if (isInitialized && currentStep > 0) {
        saveOnboardingData(currentStep, { [key]: value }).catch(console.error)
      }

      return newData
    })
  }

  // Handle next step
  const handleNext = async () => {
    if (currentStep === 5 && !isVerified) {
      toast({
        title: "Verification Required",
        description: "Please verify your phone number before continuing",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      if (currentStep < totalSteps - 1) {
        // Save current step data
        await updateOnboardingStep(currentStep, "COMPLETED", formData)

        // Move to next step
        setCurrentStep(currentStep + 1)
      } else {
        // Complete onboarding
        setIsCompleting(true)
        const result = await completeOnboarding()

        if (result.status === 200) {
          // Show completion screen with confetti
          triggerConfetti()

          // Redirect after a delay
          setTimeout(() => {
            router.push(userType === "influencer" ? "/creator-dashboard" : "/dashboard")
          }, 3000)
        } else {
          throw new Error(result.data || "Failed to complete onboarding")
        }
      }
    } catch (error) {
      console.error("Error proceeding to next step:", error)
      toast({
        title: "Error",
        description: "Failed to save progress. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle previous step
  const handlePrevious = async () => {
    if (currentStep > 1) {
      try {
        // Mark current step as in progress
        await updateOnboardingStep(currentStep, "IN_PROGRESS")

        // Move to previous step
        setCurrentStep(currentStep - 1)
      } catch (error) {
        console.error("Error going back:", error)
      }
    } else if (currentStep === 1) {
      // Go back to user type selection
      setUserType(null)
      setCurrentStep(0)
    }
  }

  // Handle phone verification
  const handleVerification = (verified: boolean) => {
    setIsVerified(verified)
    if (verified) {
      // Auto-advance after verification
      handleNext()
    }
  }

  // Trigger confetti effect
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })
  }

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <UserTypeSelection onSelect={handleUserTypeSelect} isLoading={isLoading} />
      case 1:
        return <ProfileSetup formData={formData} updateFormData={updateFormData} userType={userType!} />
      case 2:
        return <ContentCategories formData={formData} updateFormData={updateFormData} userType={userType!} />
      case 3:
        return <SocialAccounts formData={formData} updateFormData={updateFormData} userType={userType!} />
      case 4:
        return <ContactInfo formData={formData} updateFormData={updateFormData} />
      case 5:
        return <PhoneVerification formData={formData} updateFormData={updateFormData} onVerified={handleVerification} />
      case 6:
        return userType === "influencer" ? (
          <ContentStrategy formData={formData} updateFormData={updateFormData} />
        ) : (
          <LearningGoals formData={formData} updateFormData={updateFormData} />
        )
      case 7:
        return userType === "influencer" ? (
          <ContentStyle formData={formData} updateFormData={updateFormData} />
        ) : (
          <PersonalityQuiz formData={formData} updateFormData={updateFormData} />
        )
      case 8:
        return <IncomeGoals formData={formData} updateFormData={updateFormData} userType={userType!} />
      case 9:
        return userType === "influencer" ? (
          <Achievements formData={formData} updateFormData={updateFormData} />
        ) : (
          <CompletionScreen userType={userType!} />
        )
      case 10:
        return <CompletionScreen userType={userType!} />
      default:
        return null
    }
  }

  return (
    <OnboardingLayout
      currentStep={currentStep}
      totalSteps={totalSteps}
      progress={progress}
      userType={userType}
      onNext={handleNext}
      onPrevious={handlePrevious}
      isSubmitting={isSubmitting}
      isCompleting={isCompleting}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </OnboardingLayout>
  )
}

// Business Onboarding Component
function BusinessOnboardingSteps({
  step,
  formData,
  updateFormData,
  onFileUpload,
  fileInputRef,
}: {
  step: number
  formData: any
  updateFormData: (key: string, value: any) => void
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  fileInputRef: React.RefObject<HTMLInputElement>
}) {
  return (
    <AnimatePresence mode="wait">
      {/* Step 1: Business Profile */}
      {step === 0 && (
        <motion.div
          key="business-profile"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Tell us about your business</h2>
                <p className="text-muted-foreground">This helps us personalize your experience</p>
              </div>

              <div className="space-y-6">
                {/* Company Logo */}
                <div className="text-center">
                  <div className="relative inline-block">
                    <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                      {formData.profileImage ? (
                        <AvatarImage src={formData.profileImage || "/placeholder.svg"} />
                      ) : (
                        <AvatarFallback className="bg-muted">
                          <Building2 className="h-8 w-8 text-muted-foreground" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute -bottom-2 -right-2 rounded-full shadow-lg"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={onFileUpload} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Upload your company logo</p>
                </div>

                {/* Company Details */}
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      placeholder="Enter your company name"
                      value={formData.companyName || ""}
                      onChange={(e) => updateFormData("companyName", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      placeholder="https://yourcompany.com"
                      value={formData.website || ""}
                      onChange={(e) => updateFormData("website", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="City, Country"
                        value={formData.location || ""}
                        onChange={(e) => updateFormData("location", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="companySize">Company Size</Label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={formData.companySize || ""}
                        onChange={(e) => updateFormData("companySize", e.target.value)}
                      >
                        <option value="">Select size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-1000">201-1000 employees</option>
                        <option value="1000+">1000+ employees</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Company Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Tell us what your company does..."
                      value={formData.description || ""}
                      onChange={(e) => updateFormData("description", e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 2: Industry & Goals */}
      {step === 1 && (
        <motion.div
          key="industry-goals"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Industry Selection */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-2">What industry are you in?</h2>
                <p className="text-muted-foreground mb-6">This helps us show you relevant influencers and benchmarks</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {BUSINESS_INDUSTRIES.map((industry) => (
                    <motion.div key={industry.name} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Card
                        className={cn(
                          "cursor-pointer border-2 transition-all",
                          formData.industry === industry.name
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50",
                        )}
                        onClick={() => updateFormData("industry", industry.name)}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl mb-2">{industry.icon}</div>
                          <div className="font-medium text-sm mb-1">{industry.name}</div>
                          <Badge variant="secondary" className="text-xs">
                            {industry.growth} growth
                          </Badge>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Goals Selection */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-2">What are your main goals?</h2>
                <p className="text-muted-foreground mb-6">
                  Select all that apply - we&apos;ll customize your dashboard accordingly
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  {BUSINESS_GOALS.map((goal) => {
                    const IconComponent = goal.icon
                    const isSelected = formData.goals?.includes(goal.id)

                    return (
                      <motion.div key={goal.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Card
                          className={cn(
                            "cursor-pointer border-2 transition-all",
                            isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                          )}
                          onClick={() => {
                            const currentGoals = formData.goals || []
                            const newGoals = isSelected
                              ? currentGoals.filter((g: string) => g !== goal.id)
                              : [...currentGoals, goal.id]
                            updateFormData("goals", newGoals)
                          }}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                <IconComponent className="h-6 w-6 text-primary" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold mb-1">{goal.title}</h3>
                                <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>
                                <div className="flex flex-wrap gap-1">
                                  {goal.metrics.map((metric) => (
                                    <Badge key={metric} variant="outline" className="text-xs">
                                      {metric}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              {isSelected && <Check className="h-5 w-5 text-primary" />}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Step 3: Budget & Preferences */}
      {step === 2 && (
        <motion.div
          key="budget-preferences"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="h-16 w-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Budget & Campaign Preferences</h2>
                <p className="text-muted-foreground">Help us recommend the right influencers for your budget</p>
              </div>

              <div className="space-y-8">
                {/* Monthly Budget */}
                <div>
                  <Label className="text-base font-medium">Monthly Influencer Marketing Budget</Label>
                  <p className="text-sm text-muted-foreground mb-4">This helps us show you suitable influencers</p>

                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">
                        ${(formData.monthlyBudget || 5000).toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">per month</div>
                    </div>

                    <Slider
                      value={[formData.monthlyBudget || 5000]}
                      onValueChange={(value) => updateFormData("monthlyBudget", value[0])}
                      max={50000}
                      min={500}
                      step={500}
                      className="w-full"
                    />

                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>$500</span>
                      <span>$50,000+</span>
                    </div>
                  </div>
                </div>

                {/* Campaign Frequency */}
                <div>
                  <Label className="text-base font-medium">How often do you run campaigns?</Label>
                  <RadioGroup
                    value={formData.campaignFrequency || ""}
                    onValueChange={(value) => updateFormData("campaignFrequency", value)}
                    className="mt-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="weekly" id="weekly" />
                      <Label htmlFor="weekly">Weekly campaigns</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="monthly" id="monthly" />
                      <Label htmlFor="monthly">Monthly campaigns</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="quarterly" id="quarterly" />
                      <Label htmlFor="quarterly">Quarterly campaigns</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="as-needed" id="as-needed" />
                      <Label htmlFor="as-needed">As needed</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Preferred Platforms */}
                <div>
                  <Label className="text-base font-medium">Preferred Platforms</Label>
                  <p className="text-sm text-muted-foreground mb-3">Select all platforms you want to focus on</p>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: "Instagram", icon: Instagram },
                      { name: "TikTok", icon: Video },
                      { name: "YouTube", icon: Video },
                      { name: "Twitter", icon: MessageCircle },
                    ].map((platform) => {
                      const IconComponent = platform.icon
                      const isSelected = formData.platforms?.includes(platform.name)

                      return (
                        <div
                          key={platform.name}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all",
                            isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                          )}
                          onClick={() => {
                            const currentPlatforms = formData.platforms || []
                            const newPlatforms = isSelected
                              ? currentPlatforms.filter((p: string) => p !== platform.name)
                              : [...currentPlatforms, platform.name]
                            updateFormData("platforms", newPlatforms)
                          }}
                        >
                          <IconComponent className="h-5 w-5" />
                          <span className="font-medium">{platform.name}</span>
                          {isSelected && <Check className="h-4 w-4 text-primary ml-auto" />}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Additional steps would go here... */}
    </AnimatePresence>
  )
}

// Influencer Onboarding Component
function InfluencerOnboardingSteps({
  step,
  formData,
  updateFormData,
  onFileUpload,
  fileInputRef,
}: {
  step: number
  formData: any
  updateFormData: (key: string, value: any) => void
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  fileInputRef: React.RefObject<HTMLInputElement>
}) {
  return (
    <AnimatePresence mode="wait">
      {/* Step 1: Creator Profile */}
      {step === 0 && (
        <motion.div
          key="creator-profile"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="h-16 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Create your creator profile</h2>
                <p className="text-muted-foreground">This is how brands will discover you</p>
              </div>

              <div className="space-y-6">
                {/* Profile Photo */}
                <div className="text-center">
                  <div className="relative inline-block">
                    <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                      {formData.profileImage ? (
                        <AvatarImage src={formData.profileImage || "/placeholder.svg"} />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          <Star className="h-8 w-8" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute -bottom-2 -right-2 rounded-full shadow-lg"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={onFileUpload} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Upload your profile photo</p>
                </div>

                {/* Creator Details */}
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        placeholder="Your first name"
                        value={formData.firstName || ""}
                        onChange={(e) => updateFormData("firstName", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        placeholder="Your last name"
                        value={formData.lastName || ""}
                        onChange={(e) => updateFormData("lastName", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email || ""}
                      onChange={(e) => updateFormData("email", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="City, Country"
                      value={formData.location || ""}
                      onChange={(e) => updateFormData("location", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell brands about yourself and what makes you unique..."
                      value={formData.bio || ""}
                      onChange={(e) => updateFormData("bio", e.target.value)}
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground mt-1">{(formData.bio || "").length}/500 characters</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 2: Content & Niche */}
      {step === 1 && (
        <motion.div
          key="content-niche"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Niche Selection */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-2">What&apos;s your content niche?</h2>
                <p className="text-muted-foreground mb-6">
                  Select your primary content categories to help brands find you
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {CONTENT_NICHES.map((niche) => {
                    const isSelected = formData.niches?.includes(niche.name)

                    return (
                      <motion.div key={niche.name} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Card
                          className={cn(
                            "cursor-pointer border-2 transition-all",
                            isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                          )}
                          onClick={() => {
                            const currentNiches = formData.niches || []
                            const newNiches = isSelected
                              ? currentNiches.filter((n: string) => n !== niche.name)
                              : [...currentNiches, niche.name]
                            updateFormData("niches", newNiches)
                          }}
                        >
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl mb-2">{niche.icon}</div>
                            <div className="font-medium text-sm mb-1">{niche.name}</div>
                            <div className="text-xs text-muted-foreground mb-1">{niche.earning}</div>
                            <Badge variant={niche.demand === "Very High" ? "default" : "secondary"} className="text-xs">
                              {niche.demand} demand
                            </Badge>
                            {isSelected && <Check className="h-4 w-4 text-primary mx-auto mt-2" />}
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Content Types */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-2">What content do you create?</h2>
                <p className="text-muted-foreground mb-6">Select all content types you&apos;re comfortable creating</p>

                <div className="grid md:grid-cols-2 gap-4">
                  {CONTENT_TYPES.map((contentType) => {
                    const IconComponent = contentType.icon
                    const isSelected = formData.contentTypes?.includes(contentType.name)

                    return (
                      <motion.div key={contentType.name} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Card
                          className={cn(
                            "cursor-pointer border-2 transition-all",
                            isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                          )}
                          onClick={() => {
                            const currentTypes = formData.contentTypes || []
                            const newTypes = isSelected
                              ? currentTypes.filter((t: string) => t !== contentType.name)
                              : [...currentTypes, contentType.name]
                            updateFormData("contentTypes", newTypes)
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                <IconComponent className="h-6 w-6 text-primary" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold">{contentType.name}</h3>
                                <p className="text-sm text-muted-foreground">{contentType.rate}</p>
                              </div>
                              {isSelected && <Check className="h-5 w-5 text-primary" />}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Additional influencer steps would go here... */}
    </AnimatePresence>
  )
}
