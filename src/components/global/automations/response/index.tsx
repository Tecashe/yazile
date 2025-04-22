"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MessageSquare,
  Sparkles,
  Star,
  StarOff,
  Copy,
  CheckCircle,
  Search,
  Tag,
  Clock,
  TrendingUp,
  Heart,
  Zap,
  Edit,
  Plus,
  Lock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"

type Template = {
  id: string
  content: string
  category: string
  isAI: boolean
  popularity: number
  isNew?: boolean
  isFavorite?: boolean
}

type Props = {
  isAI: boolean
  onSelectTemplate: (template: string) => void
  selectedTemplate?: string
  userSubscription?: "SMARTAI" | "MESSAGE" // Add subscription prop
}

const ResponseLibrary = ({ isAI, onSelectTemplate, selectedTemplate, userSubscription = "MESSAGE" }: Props) => {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [favorites, setFavorites] = useState<string[]>([])
  const [copied, setCopied] = useState<string | null>(null)
  const [customTemplate, setCustomTemplate] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [activeTab, setActiveTab] = useState<string>(isAI && userSubscription === "SMARTAI" ? "ai" : "standard")
  const [showUpgradeMessage, setShowUpgradeMessage] = useState(false)

  // Standard templates
  const standardTemplates: Template[] = [
    {
      id: "s1",
      content: "Thank you for your comment! We appreciate your feedback.",
      category: "general",
      isAI: false,
      popularity: 95,
    },
    {
      id: "s2",
      content: "Thanks for reaching out! We'll get back to you shortly.",
      category: "general",
      isAI: false,
      popularity: 87,
    },
    {
      id: "s3",
      content: "Great question! The answer is...",
      category: "questions",
      isAI: false,
      popularity: 76,
      isNew: true,
    },
    {
      id: "s4",
      content: "We're sorry to hear about your experience. Please DM us so we can resolve this issue.",
      category: "support",
      isAI: false,
      popularity: 92,
    },
    {
      id: "s5",
      content: "Thanks for your interest! Our product is available at [link].",
      category: "sales",
      isAI: false,
      popularity: 84,
    },
    {
      id: "s6",
      content: "We're excited to announce that we'll be launching soon! Stay tuned for updates.",
      category: "announcements",
      isAI: false,
      popularity: 79,
    },
    {
      id: "s7",
      content: "Congratulations on your purchase! Here's what happens next...",
      category: "sales",
      isAI: false,
      popularity: 88,
    },
    {
      id: "s8",
      content: "We value your feedback! Please let us know if you have any other suggestions.",
      category: "general",
      isAI: false,
      popularity: 81,
    },
  ]

  // AI templates
  const aiTemplates: Template[] = [
    {
      id: "a1",
      content: "{AI will analyze the comment sentiment and respond appropriately}",
      category: "smart",
      isAI: true,
      popularity: 98,
      isNew: true,
    },
    {
      id: "a2",
      content: "{AI will answer product questions based on your product catalog}",
      category: "product",
      isAI: true,
      popularity: 94,
    },
    {
      id: "a3",
      content: "{AI will provide personalized recommendations based on user history}",
      category: "recommendations",
      isAI: true,
      popularity: 91,
    },
    {
      id: "a4",
      content: "{AI will handle support inquiries and suggest solutions}",
      category: "support",
      isAI: true,
      popularity: 89,
    },
    {
      id: "a5",
      content: "{AI will engage with user comments using your brand voice}",
      category: "engagement",
      isAI: true,
      popularity: 86,
      isNew: true,
    },
    {
      id: "a6",
      content: "{AI will detect and respond to frequently asked questions}",
      category: "smart",
      isAI: true,
      popularity: 93,
    },
  ]

  // Combined templates based on active tab
  const templates = activeTab === "ai" ? aiTemplates : standardTemplates

  // Filter templates based on search and category
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === "all" || template.category === activeCategory
    const matchesFavorites = activeCategory === "favorites" ? favorites.includes(template.id) : true
    return matchesSearch && matchesCategory && matchesFavorites
  })

  // Get unique categories
  const categories = ["all", "favorites", ...Array.from(new Set(templates.map((t) => t.category)))]

  // Toggle favorite status
  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))

    toast({
      title: favorites.includes(id) ? "Removed from favorites" : "Added to favorites",
      description: favorites.includes(id)
        ? "Template removed from your favorites"
        : "Template added to your favorites for quick access",
      duration: 2000,
    })
  }

  // Copy template to clipboard
  const copyToClipboard = (id: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)

    toast({
      title: "Copied to clipboard",
      description: "Template copied to clipboard",
      duration: 2000,
    })
  }

  // Handle template selection
  const handleSelectTemplate = (template: Template) => {
    // Check subscription for AI templates
    if (template.isAI && userSubscription !== "SMARTAI") {
      setShowUpgradeMessage(true)
      setTimeout(() => setShowUpgradeMessage(false), 3000)

      toast({
        title: "Pro Feature",
        description: "Upgrade to PRO to use AI-powered templates",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    onSelectTemplate(template.content)

    toast({
      title: "Template selected",
      description: template.isAI
        ? "AI template will be used to generate responses"
        : "Template will be used for all responses",
      duration: 2000,
    })
  }

  // Handle custom template submission
  const handleCustomTemplateSubmit = () => {
    if (customTemplate.trim()) {
      if (editingTemplate) {
        // Update existing template logic would go here
        // For now, just select the custom template
        onSelectTemplate(customTemplate)
        setIsEditing(false)
        setEditingTemplate(null)

        toast({
          title: "Template updated",
          description: "Your custom template has been updated",
          duration: 2000,
        })
      } else {
        // Add new template logic would go here
        // For now, just select the custom template
        onSelectTemplate(customTemplate)

        toast({
          title: "Custom template created",
          description: "Your custom template is now ready to use",
          duration: 2000,
        })
      }
      setCustomTemplate("")
    }
  }

  // Start editing a template
  const startEditing = (template: Template) => {
    // Check subscription for AI templates
    if (template.isAI && userSubscription !== "SMARTAI") {
      setShowUpgradeMessage(true)
      setTimeout(() => setShowUpgradeMessage(false), 3000)

      toast({
        title: "Pro Feature",
        description: "Upgrade to PRO to edit AI-powered templates",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    setIsEditing(true)
    setEditingTemplate(template)
    setCustomTemplate(template.content)
  }

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false)
    setEditingTemplate(null)
    setCustomTemplate("")
  }

  // Handle tab change with subscription check
  const handleTabChange = (value: string) => {
    if (value === "ai" && userSubscription !== "SMARTAI") {
      setShowUpgradeMessage(true)
      setTimeout(() => setShowUpgradeMessage(false), 3000)

      toast({
        title: "Pro Feature",
        description: "Upgrade to PRO to access AI-powered templates",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    setActiveTab(value)
  }

  // Update active tab when isAI prop changes
  useEffect(() => {
    if (isAI && userSubscription === "SMARTAI") {
      setActiveTab("ai")
    } else {
      setActiveTab("standard")
    }
  }, [isAI, userSubscription])

  return (
    <div className="bg-background-80 rounded-xl p-4 w-full">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-[#768BDD]" />
            Response Templates
          </h3>
          <TabsList>
            <TabsTrigger value="standard" className="text-sm">
              Standard
            </TabsTrigger>

            {userSubscription === "SMARTAI" ? (
              <TabsTrigger value="ai" className="text-sm">
                <Sparkles className="h-3.5 w-3.5 mr-1.5 text-purple-400" />
                AI-Powered
              </TabsTrigger>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative inline-flex">
                      <TabsTrigger value="ai" className="text-sm opacity-70 cursor-not-allowed" disabled>
                        <Sparkles className="h-3.5 w-3.5 mr-1.5 text-purple-400" />
                        AI-Powered
                      </TabsTrigger>
                      <div className="absolute -top-1 -right-1">
                        <Lock className="h-3 w-3 text-purple-400" />
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-purple-900/90 border-purple-700 text-white">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-purple-400" />
                      <span>Upgrade to PRO to access AI-powered templates</span>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </TabsList>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-background-90 border-none"
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              size="sm"
              onClick={() => setActiveCategory(category)}
              className={cn(
                "border-background-90 bg-background-90 capitalize whitespace-nowrap",
                activeCategory === category && "border-[#768BDD] text-[#768BDD]",
              )}
            >
              {category === "all" ? (
                <>All</>
              ) : category === "favorites" ? (
                <>
                  <Star className="h-3.5 w-3.5 mr-1.5 text-yellow-400" />
                  Favorites
                </>
              ) : (
                <>
                  <Tag className="h-3.5 w-3.5 mr-1.5" />
                  {category}
                </>
              )}
            </Button>
          ))}
        </div>

        <TabsContent value="standard" className="mt-0">
          <div className="space-y-3 staggeredFadeIn">
            {filteredTemplates.length > 0 ? (
              filteredTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                  className={cn(
                    "bg-background-90 p-3 rounded-lg border border-transparent transition-all cursor-pointer group",
                    selectedTemplate === template.content && "border-[#768BDD] shadow-md",
                  )}
                  onClick={() => handleSelectTemplate(template)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      {template.isNew && <Badge className="bg-green-600 text-xs">New</Badge>}
                      {template.popularity > 90 && (
                        <Badge className="bg-[#768BDD] text-xs flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Popular
                        </Badge>
                      )}
                      <Badge variant="outline" className="bg-background-80/50 text-xs capitalize">
                        {template.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleFavorite(template.id)
                              }}
                            >
                              {favorites.includes(template.id) ? (
                                <Star className="h-4 w-4 text-yellow-400" />
                              ) : (
                                <StarOff className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {favorites.includes(template.id) ? "Remove from favorites" : "Add to favorites"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={(e) => {
                                e.stopPropagation()
                                copyToClipboard(template.id, template.content)
                              }}
                            >
                              {copied === template.id ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{copied === template.id ? "Copied!" : "Copy to clipboard"}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={(e) => {
                                e.stopPropagation()
                                startEditing(template)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit template</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <p className="text-sm">{template.content}</p>
                  <div className="flex items-center justify-between mt-2 text-xs text-text-secondary">
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      <span>{template.popularity}% effective</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>~2s response time</span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="p-4 rounded-full bg-background-80 mb-4">
                  <Search className="h-6 w-6 text-text-secondary" />
                </div>
                <p className="text-white font-medium">No templates found</p>
                <p className="text-sm text-text-secondary mt-1 max-w-xs">
                  Try adjusting your search or category filters
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="ai" className="mt-0">
          {userSubscription === "SMARTAI" ? (
            <>
              <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-4 rounded-lg mb-4 border border-purple-500/20">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-900/30 rounded-lg">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-purple-300 flex items-center gap-2">
                      AI-Powered Templates
                      <Badge className="bg-purple-600 text-xs">Premium</Badge>
                    </h4>
                    <p className="text-sm text-text-secondary mt-1">
                      These templates use AI to generate dynamic, personalized responses based on the context of each
                      interaction.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 staggeredFadeIn">
                {filteredTemplates.length > 0 ? (
                  filteredTemplates.map((template) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.01 }}
                      className={cn(
                        "bg-background-90 p-3 rounded-lg border border-transparent transition-all cursor-pointer group",
                        selectedTemplate === template.content && "border-purple-500 shadow-md",
                      )}
                      onClick={() => handleSelectTemplate(template)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {template.isNew && <Badge className="bg-green-600 text-xs">New</Badge>}
                          <Badge className="bg-purple-600 text-xs flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            AI
                          </Badge>
                          <Badge variant="outline" className="bg-background-80/50 text-xs capitalize">
                            {template.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleFavorite(template.id)
                                  }}
                                >
                                  {favorites.includes(template.id) ? (
                                    <Star className="h-4 w-4 text-yellow-400" />
                                  ) : (
                                    <StarOff className="h-4 w-4" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {favorites.includes(template.id) ? "Remove from favorites" : "Add to favorites"}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    copyToClipboard(template.id, template.content)
                                  }}
                                >
                                  {copied === template.id ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {copied === template.id ? "Copied!" : "Copy to clipboard"}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                      <p className="text-sm">{template.content}</p>
                      <div className="flex items-center justify-between mt-2 text-xs text-text-secondary">
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-purple-400" />
                          <span>Dynamic response</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-purple-400" />
                          <span>{template.popularity}% satisfaction</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="p-4 rounded-full bg-background-80 mb-4">
                      <Search className="h-6 w-6 text-text-secondary" />
                    </div>
                    <p className="text-white font-medium">No AI templates found</p>
                    <p className="text-sm text-text-secondary mt-1 max-w-xs">
                      Try adjusting your search or category filters
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-6 rounded-lg border border-purple-500/20 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="p-3 bg-purple-900/30 rounded-full mb-4">
                  <Lock className="h-6 w-6 text-purple-400" />
                </div>
                <h4 className="font-medium text-purple-300 text-lg mb-2">Pro Feature</h4>
                <p className="text-sm text-text-secondary mb-4 max-w-md">
                  Upgrade to PRO to access AI-powered templates and create dynamic, personalized responses.
                </p>
                <Button className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white">Upgrade to PRO</Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Custom template creator */}
      <AnimatePresence>
        {isEditing ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 bg-background-90 p-4 rounded-lg border border-[#768BDD]/30"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium flex items-center gap-2">
                <Edit className="h-4 w-4 text-[#768BDD]" />
                {editingTemplate ? "Edit Template" : "Create Custom Template"}
              </h4>
              <Badge variant="outline" className="bg-background-80/50 text-xs">
                {activeTab === "ai" ? "AI Template" : "Standard Template"}
              </Badge>
            </div>
            <div className="space-y-3">
              <textarea
                value={customTemplate}
                onChange={(e) => setCustomTemplate(e.target.value)}
                placeholder="Enter your custom template text..."
                className="w-full h-24 bg-background-80 border-none rounded-lg p-3 text-sm focus:ring-1 focus:ring-[#768BDD] resize-none"
              />
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleCustomTemplateSubmit}
                  disabled={!customTemplate.trim()}
                  className="bg-gradient-to-br from-[#3352CC] to-[#1C2D70] text-white"
                >
                  {editingTemplate ? "Update Template" : "Create Template"}
                </Button>
                <Button variant="outline" onClick={cancelEditing}>
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="w-full flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Custom Template
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upgrade Modal Overlay */}
      <AnimatePresence>
        {showUpgradeMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-purple-900/90 text-white px-6 py-4 rounded-lg shadow-lg border border-purple-700 pointer-events-auto">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-800 rounded-full">
                  <Lock className="h-5 w-5 text-purple-300" />
                </div>
                <div>
                  <h4 className="font-medium">Pro Feature</h4>
                  <p className="text-sm text-purple-200">Upgrade to PRO to use AI-powered templates</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ResponseLibrary

