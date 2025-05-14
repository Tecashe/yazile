
"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { createEmailTemplate, updateEmailTemplate, sendTestEmail } from "../../actions/email-actions"
import { Editor } from "./email-editor"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Laptop, Smartphone, Tablet, Wand2, AlertTriangle, Palette, Sparkles, Send, Check, Copy, Eye, Loader2, Zap, Layout, ImageIcon, Type, ArrowRight, Minus, Columns, Quote, MessageSquare, Heart, Star, Clock, Calendar, Save, X, ChevronRight, Settings, FileCode, Undo, Redo, Trash2, Info, HelpCircle, Maximize2, Minimize2 } from 'lucide-react'
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
// import confetti from "canvas-confetti"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  subject: z.string().min(2, {
    message: "Subject must be at least 2 characters.",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
  description: z.string().optional(),
  category: z.string(),
  isDefault: z.boolean().default(false),
  enablePersonalization: z.boolean().default(true),
  responsiveDesign: z.boolean().default(true),
  darkModeSupport: z.boolean().default(false),
  accessibilityLevel: z.enum(["basic", "enhanced", "full"]).default("basic"),
})

export function EmailTemplateForm({
  template,
  onSuccess,
}: {
  template?: any
  onSuccess?: () => void
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop" | "tablet">("desktop")
  const [previewMode, setPreviewMode] = useState<"light" | "dark">("light")
  const [spamScore, setSpamScore] = useState(0)
  const [accessibilityScore, setAccessibilityScore] = useState(0)
  const [showTemplateGallery, setShowTemplateGallery] = useState(false)
  const [templateBlocks, setTemplateBlocks] = useState<string[]>([])
  const [colorPalette, setColorPalette] = useState({
    primary: "#007bff",
    secondary: "#6c757d",
    accent: "#28a745",
    background: "#ffffff",
    text: "#333333",
  })
  const [aiGenerating, setAiGenerating] = useState(false)
  const [testEmailAddress, setTestEmailAddress] = useState("")
  const [isSendingTest, setIsSendingTest] = useState(false)
  const [personalizationTokens, setPersonalizationTokens] = useState([
    { name: "First Name", token: "{{user.firstname}}" },
    { name: "Last Name", token: "{{user.lastname}}" },
    { name: "Email", token: "{{user.email}}" },
    { name: "Company", token: "{{user.company}}" },
    { name: "Subscription Plan", token: "{{user.plan}}" },
    { name: "Last Login Date", token: "{{user.lastLogin}}" },
  ])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [activeTab, setActiveTab] = useState("design")
  const [showHelpTips, setShowHelpTips] = useState(false)
  const [currentHelpTip, setCurrentHelpTip] = useState<string | null>(null)
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const [undoStack, setUndoStack] = useState<any[]>([])
  const [redoStack, setRedoStack] = useState<any[]>([])
  const [showBlockPreview, setShowBlockPreview] = useState<string | null>(null)
  const [blockCategories, setBlockCategories] = useState<string>("all")
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showPersonalizationMenu, setShowPersonalizationMenu] = useState(false)
  const [showTestEmailDialog, setShowTestEmailDialog] = useState(false)
  const [previewScale, setPreviewScale] = useState(1)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)
  const [autoSaveInterval, setAutoSaveInterval] = useState<NodeJS.Timeout | null>(null)
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const [showTemplateInfo, setShowTemplateInfo] = useState(false)
  const [showAiSuggestions, setShowAiSuggestions] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([
    "Add a personalized greeting",
    "Include a clear call-to-action button",
    "Optimize your subject line for better open rates",
    "Add social media links in the footer",
    "Include an unsubscribe link for compliance",
  ])
  const formContainerRef = useRef<HTMLDivElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: template?.name || "",
      subject: template?.subject || "",
      content: template?.content || getDefaultTemplate(),
      description: template?.description || "",
      category: template?.category || "general",
      isDefault: template?.isDefault || false,
      enablePersonalization: template?.enablePersonalization || true,
      responsiveDesign: template?.responsiveDesign || true,
      darkModeSupport: template?.darkModeSupport || false,
      accessibilityLevel: template?.accessibilityLevel || "basic",
    },
  })

  // Set up auto-save
  useEffect(() => {
    if (autoSaveEnabled) {
      const interval = setInterval(() => {
        if (hasChanges) {
          handleAutoSave();
        }
      }, 60000); // Auto-save every minute
      
      setAutoSaveInterval(interval);
      
      return () => {
        if (autoSaveInterval) {
          clearInterval(autoSaveInterval);
        }
      };
    }
  }, [autoSaveEnabled, hasChanges]);

  // Track form changes
  useEffect(() => {
    const subscription = form.watch(() => {
      setHasChanges(true);
    });
    
    return () => subscription.unsubscribe();
  }, [form.watch]);

  // Calculate accessibility score based on form values
  useEffect(() => {
    const accessibilityLevel = form.watch("accessibilityLevel")
    const hasPersonalization = form.watch("enablePersonalization")
    const hasResponsiveDesign = form.watch("responsiveDesign")
    const hasDarkMode = form.watch("darkModeSupport")

    let score = 0

    if (accessibilityLevel === "basic") score += 30
    if (accessibilityLevel === "enhanced") score += 60
    if (accessibilityLevel === "full") score += 90

    if (hasResponsiveDesign) score += 5
    if (hasDarkMode) score += 3
    if (hasPersonalization) score += 2

    setAccessibilityScore(Math.min(score, 100))
  }, [
    form.watch("accessibilityLevel"),
    form.watch("enablePersonalization"),
    form.watch("responsiveDesign"),
    form.watch("darkModeSupport"),
  ])

  // Calculate spam score based on content
  useEffect(() => {
    const content = form.watch("content")
    const subject = form.watch("subject")

    if (content && subject) {
      // Simple spam score calculation
      const spamTriggers = ["free", "discount", "cash", "buy", "money", "urgent", "limited", "offer", "!"]
      let score = 0

      const combinedText = content.toLowerCase() + " " + subject.toLowerCase()

      spamTriggers.forEach((trigger) => {
        if (combinedText.includes(trigger)) {
          score += 5
        }
      })

      // Check for excessive capitalization
      const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length
      if (capsRatio > 0.3) {
        score += 20
      }

      // Check for image to text ratio (simplified)
      const imgCount = (content.match(/<img/g) || []).length
      if (imgCount > 5) {
        score += 10
      }

      setSpamScore(Math.min(score, 100))
    }
  }, [form.watch("content"), form.watch("subject")])

  // Generate template blocks for the gallery
  useEffect(() => {
    setTemplateBlocks([
      getHeaderBlock(),
      getHeroBlock(),
      getFeatureBlock(),
      getTestimonialBlock(),
      getCtaBlock(),
      getFooterBlock(),
      getProductBlock(),
      getImageGalleryBlock(),
      getQuoteBlock(),
      getStatsBlock(),
      getTeamBlock(),
      getEventBlock(),
    ])
  }, [])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Save: Ctrl/Cmd + S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        form.handleSubmit(onSubmit)();
      }
      
      // Undo: Ctrl/Cmd + Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
      
      // Redo: Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        handleRedo();
      }
      
      // Toggle fullscreen: F11 or Ctrl/Cmd + Shift + F
      if (e.key === 'F11' || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'f')) {
        e.preventDefault();
        toggleFullscreen();
      }
      
      // Show keyboard shortcuts: Ctrl/Cmd + /
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setShowKeyboardShortcuts(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undoStack, redoStack]);

  // Handle fullscreen changes
  useEffect(() => {
    if (isFullscreen && formContainerRef.current) {
      formContainerRef.current.classList.add('fixed', 'inset-0', 'z-50', 'bg-background', 'p-4', 'overflow-auto');
    } else if (formContainerRef.current) {
      formContainerRef.current.classList.remove('fixed', 'inset-0', 'z-50', 'bg-background', 'p-4', 'overflow-auto');
    }
  }, [isFullscreen]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("name", values.name)
      formData.append("subject", values.subject)
      formData.append("content", values.content)
      formData.append("description", values.description || "")
      formData.append("category", values.category)
      formData.append("isDefault", values.isDefault.toString())
      formData.append("enablePersonalization", values.enablePersonalization.toString())
      formData.append("responsiveDesign", values.responsiveDesign.toString())
      formData.append("darkModeSupport", values.darkModeSupport.toString())
      formData.append("accessibilityLevel", values.accessibilityLevel)

      let result

      if (template?.id) {
        result = await updateEmailTemplate(template.id, formData)
      } else {
        result = await createEmailTemplate(formData)
      }

      if (result.success) {
        setShowSuccessAnimation(true)
        
        // Trigger confetti effect
        // confetti({
        //   particleCount: 100,
        //   spread: 70,
        //   origin: { y: 0.6 }
        // });
        
        setTimeout(() => {
          setShowSuccessAnimation(false)
          
          toast({
            title: template?.id ? "Template updated" : "Template created",
            description: template?.id
              ? "Your email template has been updated successfully."
              : "Your new email template has been created successfully.",
          })
  
          setHasChanges(false)
          setLastSaved(new Date())
          
          if (onSuccess) {
            onSuccess()
          } else {
            router.push("/admin/email/templates")
            router.refresh()
          }
        }, 1500)
      } else {
        toast({
          title: "Error",
          description: "Failed to save the template. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving template:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSendTestEmail() {
    if (!testEmailAddress) {
      toast({
        title: "Error",
        description: "Please enter an email address.",
        variant: "destructive",
      })
      return
    }

    setIsSendingTest(true)

    try {
      const result = await sendTestEmail({
        to: testEmailAddress,
        subject: form.getValues("subject"),
        content: form.getValues("content"),
      });

      if (result.success) {
        setShowTestEmailDialog(false)
        toast({
          title: "Test email sent",
          description: `A test email has been sent to ${testEmailAddress}.`,
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to send test email. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sending test email:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSendingTest(false)
    }
  }

  function insertPersonalizationToken(token: string) {
    const currentContent = form.getValues("content")
    const updatedContent = currentContent + token
    
    // Save current state to undo stack
    pushToUndoStack({
      content: currentContent
    });
    
    form.setValue("content", updatedContent)
    setShowPersonalizationMenu(false)
  }

  function generateAIContent() {
    setAiGenerating(true)

    // Save current state to undo stack
    pushToUndoStack({
      content: form.getValues("content")
    });

    // Simulate AI generation
    setTimeout(() => {
      const category = form.getValues("category")
      const aiGeneratedTemplate = getAIGeneratedTemplate(category)
      form.setValue("content", aiGeneratedTemplate)
      setAiGenerating(false)

      toast({
        title: "AI Content Generated",
        description: "Your template has been generated based on your category and settings.",
      })
    }, 2000)
  }

  function insertTemplateBlock(blockHtml: string) {
    // Save current state to undo stack
    pushToUndoStack({
      content: form.getValues("content")
    });
    
    const currentContent = form.getValues("content")
    const updatedContent = currentContent + blockHtml
    form.setValue("content", updatedContent)
    setShowBlockPreview(null)

    toast({
      title: "Block Added",
      description: "Template block has been added to your email content.",
    })
  }

  function applyColorPalette() {
    // Save current state to undo stack
    pushToUndoStack({
      content: form.getValues("content")
    });
    
    let content = form.getValues("content")

    // Replace color values in the content
    content = content.replace(/#007bff/g, colorPalette.primary)
    content = content.replace(/#6c757d/g, colorPalette.secondary)
    content = content.replace(/#28a745/g, colorPalette.accent)
    content = content.replace(/#ffffff/g, colorPalette.background)
    content = content.replace(/#333333/g, colorPalette.text)

    form.setValue("content", content)
    setShowColorPicker(false)

    toast({
      title: "Colors Applied",
      description: "Your color palette has been applied to the template.",
    })
  }

  function handleAutoSave() {
    if (!hasChanges) return;
    
    // Only auto-save if we have a template ID (updating existing template)
    if (template?.id) {
      const values = form.getValues();
      
      const formData = new FormData()
      formData.append("name", values.name)
      formData.append("subject", values.subject)
      formData.append("content", values.content)
      formData.append("description", values.description || "")
      formData.append("category", values.category)
      formData.append("isDefault", values.isDefault.toString())
      formData.append("enablePersonalization", values.enablePersonalization.toString())
      formData.append("responsiveDesign", values.responsiveDesign.toString())
      formData.append("darkModeSupport", values.darkModeSupport.toString())
      formData.append("accessibilityLevel", values.accessibilityLevel)
      
      updateEmailTemplate(template.id, formData)
        .then(result => {
          if (result.success) {
            setLastSaved(new Date());
            setHasChanges(false);
          }
        })
        .catch(error => {
          console.error("Auto-save failed:", error);
        });
    }
  }

  function pushToUndoStack(state: any) {
    setUndoStack(prev => [...prev, state]);
    setRedoStack([]);
  }

  function handleUndo() {
    if (undoStack.length === 0) return;
    
    const currentState = {
      content: form.getValues("content")
    };
    
    const prevState = undoStack[undoStack.length - 1];
    
    // Apply the previous state
    form.setValue("content", prevState.content);
    
    // Update stacks
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, currentState]);
  }

  function handleRedo() {
    if (redoStack.length === 0) return;
    
    const currentState = {
      content: form.getValues("content")
    };
    
    const nextState = redoStack[redoStack.length - 1];
    
    // Apply the next state
    form.setValue("content", nextState.content);
    
    // Update stacks
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, currentState]);
  }

  function toggleFullscreen() {
    setIsFullscreen(!isFullscreen);
  }

  function handleTabChange(value: string) {
    setActiveTab(value);
  }

  function applyAiSuggestion(suggestion: string) {
    // This is a simplified implementation - in a real app, you'd have more sophisticated logic
    let content = form.getValues("content");
    
    // Save current state to undo stack
    pushToUndoStack({
      content: content
    });
    
    switch(suggestion) {
      case "Add a personalized greeting":
        content = content.replace("<p>Hello,</p>", "<p>Hello {{user.firstname}},</p>");
        break;
      case "Include a clear call-to-action button":
        content += `
          <div style="text-align: center; margin: 20px 0;">
            <a href="#" style="display: inline-block; padding: 12px 24px; background-color: ${colorPalette.primary}; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Take Action Now</a>
          </div>
        `;
        break;
      case "Add social media links in the footer":
        content += `
          <div style="text-align: center; margin-top: 20px;">
            <a href="#" style="display: inline-block; margin: 0 5px;"><img src="https://via.placeholder.com/30" alt="Facebook" style="width: 30px; height: 30px;"></a>
            <a href="#" style="display: inline-block; margin: 0 5px;"><img src="https://via.placeholder.com/30" alt="Twitter" style="width: 30px; height: 30px;"></a>
            <a href="#" style="display: inline-block; margin: 0 5px;"><img src="https://via.placeholder.com/30" alt="Instagram" style="width: 30px; height: 30px;"></a>
            <a href="#" style="display: inline-block; margin: 0 5px;"><img src="https://via.placeholder.com/30" alt="LinkedIn" style="width: 30px; height: 30px;"></a>
          </div>
        `;
        break;
      case "Include an unsubscribe link for compliance":
        content += `
          <div style="text-align: center; font-size: 12px; color: #6c757d; margin-top: 20px;">
            <p>If you no longer wish to receive these emails, you can <a href="#" style="color: #6c757d;">unsubscribe here</a>.</p>
          </div>
        `;
        break;
      case "Optimize your subject line for better open rates":
        // Just show a toast with advice
        toast({
          title: "Subject Line Tip",
          description: "Try adding personalization or a question to increase open rates.",
        });
        return;
    }
    
    form.setValue("content", content);
    setShowAiSuggestions(false);
    
    toast({
      title: "AI Suggestion Applied",
      description: "Your template has been updated with the AI suggestion.",
    });
  }

  return (
    <div ref={formContainerRef} className="relative">
      {/* Fullscreen toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-0 right-0 z-10"
        onClick={toggleFullscreen}
      >
        {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
      </Button>
      
      {/* Help button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-0 right-10 z-10"
        onClick={() => setShowKeyboardShortcuts(true)}
      >
        <HelpCircle className="h-4 w-4" />
      </Button>
      
      {/* Success animation overlay */}
      <AnimatePresence>
        {showSuccessAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="bg-white rounded-full p-8"
            >
              <Check className="h-16 w-16 text-green-500" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Status bar */}
      <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
        <div className="flex items-center space-x-2">
          {hasChanges ? (
            <span className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-amber-500 mr-2"></span>
              Unsaved changes
            </span>
          ) : (
            <span className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              All changes saved
            </span>
          )}
          {lastSaved && (
            <span className="text-xs">Last saved: {lastSaved.toLocaleTimeString()}</span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-xs"
            onClick={handleUndo}
            disabled={undoStack.length === 0}
          >
            <Undo className="h-3 w-3 mr-1" />
            Undo
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-xs"
            onClick={handleRedo}
            disabled={redoStack.length === 0}
          >
            <Redo className="h-3 w-3 mr-1" />
            Redo
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-xs"
            onClick={() => form.handleSubmit(onSubmit)()}
          >
            <Save className="h-3 w-3 mr-1" />
            Save
          </Button>
        </div>
      </div>

      <Tabs defaultValue="design" className="w-full" value={activeTab} onValueChange={handleTabChange}>
        <div className="bg-green sticky top-0 z-10 pb-2">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="design" className="flex-1">
              Design
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex-1">
              Preview
            </TabsTrigger>
            <TabsTrigger value="blocks" className="flex-1">
              Blocks
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1">
              Settings
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="design">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6 overflow-y-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <FileCode className="h-5 w-5 mr-2" />
                    Template Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Template Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Welcome Email" {...field} />
                          </FormControl>
                          <FormDescription className="text-xs">A descriptive name for your email template.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="welcome">Welcome</SelectItem>
                              <SelectItem value="newsletter">Newsletter</SelectItem>
                              <SelectItem value="promotional">Promotional</SelectItem>
                              <SelectItem value="transactional">Transactional</SelectItem>
                              <SelectItem value="general">General</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-xs">
                            Categorize your template for better organization.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="Welcome to our platform!" {...field} />
                        </FormControl>
                        <FormDescription className="text-xs">
                          The subject line of the email. You can use variables like &#123;&#123;user.firstname&#125;&#125;.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="A welcome email sent to new users when they sign up."
                            className="resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          A brief description of when and how this template is used.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1 relative overflow-hidden group"
                  onClick={generateAIContent}
                  disabled={aiGenerating}
                >
                  {aiGenerating && (
                    <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  <Wand2 className="h-3.5 w-3.5 group-hover:text-primary transition-colors" />
                  <span>{aiGenerating ? "Generating..." : "Generate with AI"}</span>
                </Button>

                <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
                  <PopoverTrigger asChild>
                    <Button type="button" variant="outline" size="sm" className="h-8 gap-1 group">
                      <Palette className="h-3.5 w-3.5 group-hover:text-primary transition-colors" />
                      <span>Color Palette</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">Customize Colors</h4>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 px-2 text-xs"
                            onClick={() => setColorPalette({
                              primary: "#007bff",
                              secondary: "#6c757d",
                              accent: "#28a745",
                              background: "#ffffff",
                              text: "#333333",
                            })}
                          >
                            Reset
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="grid grid-cols-5 gap-2 items-center">
                          <Label className="col-span-2 text-xs">Primary</Label>
                          <Input
                            type="color"
                            value={colorPalette.primary}
                            onChange={(e) => setColorPalette({ ...colorPalette, primary: e.target.value })}
                            className="col-span-2 h-8 p-1"
                          />
                          <div className="w-6 h-6 rounded" style={{ backgroundColor: colorPalette.primary }}></div>
                        </div>
                        <div className="grid grid-cols-5 gap-2 items-center">
                          <Label className="col-span-2 text-xs">Secondary</Label>
                          <Input
                            type="color"
                            value={colorPalette.secondary}
                            onChange={(e) => setColorPalette({ ...colorPalette, secondary: e.target.value })}
                            className="col-span-2 h-8 p-1"
                          />
                          <div className="w-6 h-6 rounded" style={{ backgroundColor: colorPalette.secondary }}></div>
                        </div>
                        <div className="grid grid-cols-5 gap-2 items-center">
                          <Label className="col-span-2 text-xs">Accent</Label>
                          <Input
                            type="color"
                            value={colorPalette.accent}
                            onChange={(e) => setColorPalette({ ...colorPalette, accent: e.target.value })}
                            className="col-span-2 h-8 p-1"
                          />
                          <div className="w-6 h-6 rounded" style={{ backgroundColor: colorPalette.accent }}></div>
                        </div>
                        <div className="grid grid-cols-5 gap-2 items-center">
                          <Label className="col-span-2 text-xs">Background</Label>
                          <Input
                            type="color"
                            value={colorPalette.background}
                            onChange={(e) => setColorPalette({ ...colorPalette, background: e.target.value })}
                            className="col-span-2 h-8 p-1"
                          />
                          <div
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: colorPalette.background }}
                          ></div>
                        </div>
                        <div className="grid grid-cols-5 gap-2 items-center">
                          <Label className="col-span-2 text-xs">Text</Label>
                          <Input
                            type="color"
                            value={colorPalette.text}
                            onChange={(e) => setColorPalette({ ...colorPalette, text: e.target.value })}
                            className="col-span-2 h-8 p-1"
                          />
                          <div className="w-6 h-6 rounded" style={{ backgroundColor: colorPalette.text }}></div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div 
                          className="p-2 rounded cursor-pointer hover:bg-gray-100 flex flex-col items-center"
                          onClick={() => setColorPalette({
                            primary: "#3b82f6",
                            secondary: "#64748b",
                            accent: "#10b981",
                            background: "#ffffff",
                            text: "#1e293b",
                          })}
                        >
                          <div className="flex gap-1 mb-1">
                            <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#64748b]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
                          </div>
                          <span className="text-xs">Modern</span>
                        </div>
                        
                        <div 
                          className="p-2 rounded cursor-pointer hover:bg-gray-100 flex flex-col items-center"
                          onClick={() => setColorPalette({
                            primary: "#8b5cf6",
                            secondary: "#6b7280",
                            accent: "#ec4899",
                            background: "#ffffff",
                            text: "#374151",
                          })}
                        >
                          <div className="flex gap-1 mb-1">
                            <div className="w-3 h-3 rounded-full bg-[#8b5cf6]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#6b7280]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#ec4899]"></div>
                          </div>
                          <span className="text-xs">Creative</span>
                        </div>
                        
                        <div 
                          className="p-2 rounded cursor-pointer hover:bg-gray-100 flex flex-col items-center"
                          onClick={() => setColorPalette({
                            primary: "#0ea5e9",
                            secondary: "#475569",
                            accent: "#f59e0b",
                            background: "#f8fafc",
                            text: "#0f172a",
                          })}
                        >
                          <div className="flex gap-1 mb-1">
                            <div className="w-3 h-3 rounded-full bg-[#0ea5e9]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#475569]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
                          </div>
                          <span className="text-xs">Professional</span>
                        </div>
                      </div>
                      
                      <Button type="button" size="sm" className="w-full" onClick={applyColorPalette}>
                        Apply Colors
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                <DropdownMenu open={showPersonalizationMenu} onOpenChange={setShowPersonalizationMenu}>
                  <DropdownMenuTrigger asChild>
                    <Button type="button" variant="outline" size="sm" className="h-8 gap-1 group">
                      <Sparkles className="h-3.5 w-3.5 group-hover:text-primary transition-colors" />
                      <span>Personalization</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {personalizationTokens.map((token, index) => (
                      <DropdownMenuItem key={index} onClick={() => insertPersonalizationToken(token.token)}>
                        <span>{token.name}</span>
                        <span className="ml-2 text-xs text-muted-foreground">{token.token}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Dialog open={showTestEmailDialog} onOpenChange={setShowTestEmailDialog}>
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline" size="sm" className="h-8 gap-1 group">
                      <Send className="h-3.5 w-3.5 group-hover:text-primary transition-colors" />
                      <span>Send Test</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send Test Email</DialogTitle>
                      <DialogDescription>
                        Send a test email to verify how your template looks in an email client.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="test-email">Email Address</Label>
                        <Input
                          id="test-email"
                          type="email"
                          placeholder="your@email.com"
                          value={testEmailAddress}
                          onChange={(e) => setTestEmailAddress(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Template Preview</Label>
                        <div className="border rounded-md p-3 max-h-[200px] overflow-y-auto">
                          <div className="text-sm font-medium mb-1">{form.getValues("subject")}</div>
                          <div
                            className="prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: form.getValues("content").substring(0, 300) + "..." }}
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowTestEmailDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSendTestEmail} disabled={isSendingTest}>
                        {isSendingTest ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Test
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1 group"
                  onClick={() => setShowAiSuggestions(true)}
                >
                  <Zap className="h-3.5 w-3.5 group-hover:text-primary transition-colors" />
                  <span>AI Suggestions</span>
                </Button>
              </div>

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Content</FormLabel>
                    <Tabs defaultValue="editor" className="w-full">
                      <div className="overflow-x-auto -mx-2 px-2">
                        <TabsList className="mb-4 w-full sm:w-auto flex overflow-x-auto no-scrollbar">
                          <TabsTrigger value="editor" className="flex-shrink-0">
                            Visual Editor
                          </TabsTrigger>
                          <TabsTrigger value="html" className="flex-shrink-0">
                            HTML
                          </TabsTrigger>
                          <TabsTrigger value="preview" className="flex-shrink-0">
                            Preview
                          </TabsTrigger>
                        </TabsList>
                      </div>
                      <TabsContent value="editor">
                        <FormControl>
                          <div className="border rounded-md overflow-hidden">
                            <Editor 
                              value={field.value} 
                              onChange={(value) => {
                                // Save current state to undo stack before changing
                                if (value !== field.value) {
                                  pushToUndoStack({
                                    content: field.value
                                  });
                                  field.onChange(value);
                                }
                              }} 
                            />
                          </div>
                        </FormControl>
                      </TabsContent>
                      <TabsContent value="html">
                        <FormControl>
                          <Textarea 
                            className="min-h-[300px] md:min-h-[400px] font-mono text-sm resize-none" 
                            value={field.value}
                            onChange={(e) => {
                              // Save current state to undo stack before changing
                              if (e.target.value !== field.value) {
                                pushToUndoStack({
                                  content: field.value
                                });
                                field.onChange(e.target.value);
                              }
                            }}
                          />
                        </FormControl>
                      </TabsContent>
                      <TabsContent value="preview">
                        <div className="border rounded-md p-2 md:p-4 min-h-[300px] md:min-h-[400px] bg-white overflow-auto">
                          <div
                            className="prose max-w-none text-sm md:text-base"
                            dangerouslySetInnerHTML={{ __html: field.value }}
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                    <FormDescription className="text-xs">The content of your email.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="isDefault"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 md:p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm md:text-base">Set as Default</FormLabel>
                        <FormDescription className="text-xs">
                          Make this the default template for its category.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="enablePersonalization"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 md:p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm md:text-base">Enable Personalization</FormLabel>
                        <FormDescription className="text-xs">Allow dynamic content based on user data.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-4 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto order-2 sm:order-1"
                  onClick={() => {
                    if (hasChanges) {
                      setShowUnsavedChangesDialog(true);
                    } else {
                      if (onSuccess) {
                        onSuccess();
                      } else {
                        router.push("/admin/email/templates");
                      }
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full sm:w-auto order-1 sm:order-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : template?.id ? "Update Template" : "Create Template"}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="preview">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Email Preview</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn("h-8", previewDevice === "mobile" && "bg-secondary")}
                  onClick={() => setPreviewDevice("mobile")}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn("h-8", previewDevice === "tablet" && "bg-secondary")}
                  onClick={() => setPreviewDevice("tablet")}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn("h-8", previewDevice === "desktop" && "bg-secondary")}
                  onClick={() => setPreviewDevice("desktop")}
                >
                  <Laptop className="h-4 w-4" />
                </Button>
                <div className="h-6 border-l mx-1"></div>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn("h-8", previewMode === "light" && "bg-secondary")}
                  onClick={() => setPreviewMode("light")}
                >
                  Light
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn("h-8", previewMode === "dark" && "bg-secondary")}
                  onClick={() => setPreviewMode("dark")}
                >
                  Dark
                </Button>
              </div>
            </div>

            <div className="flex justify-center">
              <div
                className={cn(
                  "border rounded-lg overflow-hidden mx-auto transition-all",
                  previewMode === "dark" ? "bg-gray-900 text-white" : "bg-white",
                  previewDevice === "mobile"
                    ? "w-[320px] h-[568px]"
                    : previewDevice === "tablet"
                      ? "w-[768px] h-[700px]"
                      : "w-full max-w-[1024px] h-[700px]",
                )}
              >
                <div className="border-b p-3 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="ml-4 text-xs text-center flex-1 truncate">{form.watch("subject") || "Email Subject"}</div>
                </div>
                <div className="p-4 overflow-auto h-[calc(100%-40px)]">
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: form.watch("content") }} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-medium mb-2">Spam Score</h4>
                  <Progress
                    value={spamScore}
                    className={cn(
                      "h-2 mb-2",
                      spamScore > 50 ? "bg-red-100" : spamScore > 20 ? "bg-yellow-100" : "bg-green-100"
                    )}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Low Risk</span>
                    <span>Medium Risk</span>
                    <span>High Risk</span>
                  </div>

                  {spamScore > 20 && (
                    <div className="mt-4 text-sm flex items-start gap-2">
                      <AlertTriangle
                        className={cn("h-4 w-4 mt-0.5", spamScore > 50 ? "text-red-500" : "text-yellow-500")}
                      />
                      <div>
                        <p className="font-medium">Potential spam triggers detected</p>
                        <p className="text-xs text-muted-foreground">
                          Your email contains elements that might trigger spam filters. Consider revising your content to
                          improve deliverability.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-medium mb-2">Accessibility Score</h4>
                  <Progress
                    value={accessibilityScore}
                    className={cn(
                      "h-2 mb-2",
                      accessibilityScore > 80 ? "bg-green-100" : accessibilityScore > 40 ? "bg-yellow-100" : "bg-red-100"
                    )}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Poor</span>
                    <span>Good</span>
                    <span>Excellent</span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          form.watch("responsiveDesign") ? "bg-green-500" : "bg-gray-300",
                        )}
                      ></div>
                      <span className="text-xs">Responsive Design</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          form.watch("darkModeSupport") ? "bg-green-500" : "bg-gray-300",
                        )}
                      ></div>
                      <span className="text-xs">Dark Mode Support</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          form.watch("enablePersonalization") ? "bg-green-500" : "bg-gray-300",
                        )}
                      ></div>
                      <span className="text-xs">Personalization</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          form.watch("accessibilityLevel") === "full"
                            ? "bg-green-500"
                            : form.watch("accessibilityLevel") === "enhanced"
                              ? "bg-yellow-500"
                              : "bg-gray-300",
                        )}
                      ></div>
                      <span className="text-xs">Screen Reader Support</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="blocks">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Template Blocks</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn("h-8", blockCategories === "all" && "bg-secondary")}
                  onClick={() => setBlockCategories("all")}
                >
                  All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn("h-8", blockCategories === "layout" && "bg-secondary")}
                  onClick={() => setBlockCategories("layout")}
                >
                  Layout
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn("h-8", blockCategories === "content" && "bg-secondary")}
                  onClick={() => setBlockCategories("content")}
                >
                  Content
                </Button>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Drag and drop these pre-designed blocks into your email template to quickly build professional emails.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templateBlocks.map((block, index) => (
                <Card key={index} className="overflow-hidden group hover:border-primary transition-colors">
                  <div 
                    className="h-40 overflow-hidden border-b cursor-pointer"
                    onClick={() => setShowBlockPreview(block)}
                  >
                    <div
                      className="prose max-w-none scale-[0.6] origin-top p-2"
                      dangerouslySetInnerHTML={{ __html: block }}
                    />
                  </div>
                  <CardContent className="p-3 flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {index === 0
                        ? "Header"
                        : index === 1
                          ? "Hero Section"
                          : index === 2
                            ? "Feature Block"
                            : index === 3
                              ? "Testimonial"
                              : index === 4
                                ? "Call to Action"
                                : index === 5
                                  ? "Footer"
                                  : index === 6
                                    ? "Product"
                                    : index === 7
                                      ? "Image Gallery"
                                      : index === 8
                                        ? "Quote"
                                        : index === 9
                                          ? "Stats"
                                          : index === 10
                                            ? "Team"
                                            : "Event"}
                    </span>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => insertTemplateBlock(block)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Add
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-6">
          <Form {...form}>  
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Advanced Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="responsiveDesign"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 md:p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm md:text-base">Responsive Design</FormLabel>
                          <FormDescription className="text-xs">
                            Optimize email display across all device sizes.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="darkModeSupport"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 md:p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm md:text-base">Dark Mode Support</FormLabel>
                          <FormDescription className="text-xs">
                            Add dark mode compatibility for email clients that support it.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="accessibilityLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Accessibility Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select accessibility level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="basic">Basic (Alt text for images)</SelectItem>
                          <SelectItem value="enhanced">Enhanced (Semantic HTML + Basic)</SelectItem>
                          <SelectItem value="full">Full (WCAG 2.1 AA Compliant)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-xs">
                        Choose the level of accessibility compliance for your email template.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <h4 className="font-medium">Auto-Save Settings</h4>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm md:text-base">Enable Auto-Save</Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically save changes every minute
                      </p>
                    </div>
                    <Switch checked={autoSaveEnabled} onCheckedChange={setAutoSaveEnabled} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h4 className="font-medium mb-4">Email Client Compatibility</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Gmail</span>
                      <span className="text-sm font-medium text-green-500">Excellent</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Outlook</span>
                      <span className="text-sm font-medium text-yellow-500">Good</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Apple Mail</span>
                      <span className="text-sm font-medium text-green-500">Excellent</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Yahoo Mail</span>
                      <span className="text-sm font-medium text-green-500">Excellent</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Mobile Email Apps</span>
                      <span className="text-sm font-medium text-green-500">Excellent</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            </Form>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Unsaved changes dialog */}
      <Dialog open={showUnsavedChangesDialog} onOpenChange={setShowUnsavedChangesDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
            <DialogDescription>
              You have unsaved changes. Are you sure you want to leave this page?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUnsavedChangesDialog(false)}>
              Continue Editing
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                setShowUnsavedChangesDialog(false);
                if (onSuccess) {
                  onSuccess();
                } else {
                  router.push("/admin/email/templates");
                }
              }}
            >
              Discard Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Block preview dialog */}
      <Dialog open={!!showBlockPreview} onOpenChange={(open) => !open && setShowBlockPreview(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Block Preview</DialogTitle>
          </DialogHeader>
          <div className="border rounded-md p-4 overflow-auto max-h-[60vh]">
            {showBlockPreview && (
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: showBlockPreview }}
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBlockPreview(null)}>
              Cancel
            </Button>
            <Button onClick={() => showBlockPreview && insertTemplateBlock(showBlockPreview)}>
              Add to Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* AI suggestions dialog */}
      <Dialog open={showAiSuggestions} onOpenChange={setShowAiSuggestions}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Zap className="h-4 w-4 mr-2 text-amber-500" />
              AI Suggestions
            </DialogTitle>
            <DialogDescription>
              Smart recommendations to improve your email template
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            {aiSuggestions.map((suggestion, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 cursor-pointer"
                onClick={() => applyAiSuggestion(suggestion)}
              >
                <div className="flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-amber-500" />
                  <span>{suggestion}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Keyboard shortcuts dialog */}
      <Dialog open={showKeyboardShortcuts} onOpenChange={setShowKeyboardShortcuts}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium">Save</div>
              <div className="text-sm text-muted-foreground">Ctrl/Cmd + S</div>
              
              <div className="text-sm font-medium">Undo</div>
              <div className="text-sm text-muted-foreground">Ctrl/Cmd + Z</div>
              
              <div className="text-sm font-medium">Redo</div>
              <div className="text-sm text-muted-foreground">Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z</div>
              
              <div className="text-sm font-medium">Toggle Fullscreen</div>
              <div className="text-sm text-muted-foreground">F11 or Ctrl/Cmd + Shift + F</div>
              
              <div className="text-sm font-medium">Show Shortcuts</div>
              <div className="text-sm text-muted-foreground">Ctrl/Cmd + /</div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowKeyboardShortcuts(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function getDefaultTemplate() {
  const user = { firstname: "User" } // Define the user variable
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Email Template</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      border-radius: 5px 5px 0 0;
    }
    .content {
      padding: 20px;
      background-color: #ffffff;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #6c757d;
      border-radius: 0 0 5px 5px;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #007bff;
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Our Platform</h1>
    </div>
    <div class="content">
      <p>Hello ${user.firstname},</p>
      <p>Thank you for signing up! We're excited to have you on board.</p>
      <p>With our platform, you can:</p>
      <ul>
        <li>Automate Insta Dms</li>
        <li>Schedule IG posts</li>
        <li>Create content</li>
      </ul>
      <p>If you have any questions, feel free to reply to this email.</p>
      <a href="#" class="button">Get Started</a>
    </div>
    <div class="footer">
      <p>© 2025 Yazzil. All rights reserved.</p>
      <p>00100 Main St, Nairobae, Kenya</p>
    </div>
  </div>
</body>
</html>
  `
}

// Helper functions for template blocks
function getHeaderBlock() {
  return `
<div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
  <img src="https://via.placeholder.com/150x50" alt="Company Logo" style="max-width: 150px;">
  <div style="margin-top: 10px;">
    <a href="#" style="color: #6c757d; text-decoration: none; margin: 0 10px;">Home</a>
    <a href="#" style="color: #6c757d; text-decoration: none; margin: 0 10px;">Products</a>
    <a href="#" style="color: #6c757d; text-decoration: none; margin: 0 10px;">Blog</a>
    <a href="#" style="color: #6c757d; text-decoration: none; margin: 0 10px;">Contact</a>
  </div>
</div>
  `
}

function getHeroBlock() {
  return `
<div style="background-color: #007bff; color: white; padding: 40px 20px; text-align: center;">
  <h1 style="margin: 0; font-size: 28px;">Welcome to Our Newsletter</h1>
  <p style="margin: 15px 0 25px;">Stay updated with the latest news and offers</p>
  <a href="#" style="display: inline-block; padding: 10px 20px; background-color: white; color: #007bff; text-decoration: none; border-radius: 5px; font-weight: bold;">Learn More</a>
</div>
  `
}

function getFeatureBlock() {
  return `
<div style="padding: 30px 20px; background-color: white;">
  <div style="display: inline-block; width: 30%; vertical-align: top; padding: 0 10px; text-align: center;">
    <img src="https://via.placeholder.com/80" alt="Feature 1" style="width: 80px; height: 80px;">
    <h3 style="margin: 15px 0 10px;">Feature One</h3>
    <p style="margin: 0; color: #6c757d; font-size: 14px;">A brief description of this amazing feature and how it benefits users.</p>
  </div>
  <div style="display: inline-block; width: 30%; vertical-align: top; padding: 0 10px; text-align: center;">
    <img src="https://via.placeholder.com/80" alt="Feature 2" style="width: 80px; height: 80px;">
    <h3 style="margin: 15px 0 10px;">Feature Two</h3>
    <p style="margin: 0; color: #6c757d; font-size: 14px;">A brief description of this amazing feature and how it benefits users.</p>
  </div>
  <div style="display: inline-block; width: 30%; vertical-align: top; padding: 0 10px; text-align: center;">
    <img src="https://via.placeholder.com/80" alt="Feature 3" style="width: 80px; height: 80px;">
    <h3 style="margin: 15px 0 10px;">Feature Three</h3>
    <p style="margin: 0; color: #6c757d; font-size: 14px;">A brief description of this amazing feature and how it benefits users.</p>
  </div>
</div>
  `
}

function getTestimonialBlock() {
  return `
<div style="padding: 30px 20px; background-color: #f8f9fa; text-align: center;">
  <img src="https://via.placeholder.com/100" alt="Customer" style="width: 100px; height: 100px; border-radius: 50%;">
  <p style="font-style: italic; margin: 20px 0; font-size: 16px; color: #333;">"This product has completely transformed how we work. The features are intuitive and the support team is amazing!"</p>
  <p style="margin: 0; font-weight: bold;">Jane Smith</p>
  <p style="margin: 5px 0 0; color: #6c757d; font-size: 14px;">CEO, Company Name</p>
</div>
  `
}

function getCtaBlock() {
  return `
<div style="padding: 40px 20px; background-color: #28a745; color: white; text-align: center;">
  <h2 style="margin: 0 0 15px; font-size: 24px;">Ready to Get Started?</h2>
  <p style="margin: 0 0 25px; font-size: 16px;">Join thousands of satisfied customers today.</p>
  <a href="#" style="display: inline-block; padding: 12px 30px; background-color: white; color: #28a745; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Sign Up Now</a>
</div>
  `
}

function getFooterBlock() {
  return `
<div style="background-color: #343a40; color: white; padding: 30px 20px; text-align: center; border-radius: 0 0 5px 5px;">
  <div style="margin-bottom: 20px;">
    <a href="#" style="color: white; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
    <a href="#" style="color: white; text-decoration: none; margin: 0 10px;">Terms of Service</a>
    <a href="#" style="color: white; text-decoration: none; margin: 0 10px;">Unsubscribe</a>
  </div>
  <div style="margin-bottom: 20px;">
    <a href="#" style="color: white; text-decoration: none; margin: 0 10px;"><img src="https://via.placeholder.com/20" alt="Facebook" style="width: 20px; height: 20px;"></a>
    <a href="#" style="color: white; text-decoration: none; margin: 0 10px;"><img src="https://via.placeholder.com/20" alt="Twitter" style="width: 20px; height: 20px;"></a>
    <a href="#" style="color: white; text-decoration: none; margin: 0 10px;"><img src="https://via.placeholder.com/20" alt="Instagram" style="width: 20px; height: 20px;"></a>
    <a href="#" style="color: white; text-decoration: none; margin: 0 10px;"><img src="https://via.placeholder.com/20" alt="LinkedIn" style="width: 20px; height: 20px;"></a>
  </div>
  <p style="margin: 0; font-size: 12px;">© 2025 Company Name. All rights reserved.</p>
  <p style="margin: 5px 0 0; font-size: 12px;">123 Street Name, City, Country</p>
</div>
  `
}

function getProductBlock() {
  return `
<div style="padding: 20px; background-color: white; border: 1px solid #e5e7eb; border-radius: 5px; margin: 20px 0;">
  <div style="display: flex; flex-wrap: wrap;">
    <div style="flex: 0 0 30%; padding-right: 20px;">
      <img src="https://via.placeholder.com/300" alt="Product" style="width: 100%; border-radius: 5px;">
    </div>
    <div style="flex: 0 0 70%;">
      <h3 style="margin-top: 0; color: #333;">Premium Product</h3>
      <p style="color: #6c757d; margin-bottom: 10px; font-size: 14px;">Category: Electronics</p>
      <p style="margin-bottom: 15px;">This premium product offers exceptional quality and performance. Perfect for professionals and enthusiasts alike.</p>
      <div style="display: flex; align-items: center; margin-bottom: 15px;">
        <span style="font-size: 24px; font-weight: bold; color: #007bff; margin-right: 10px;">$99.99</span>
        <span style="text-decoration: line-through; color: #6c757d;">$129.99</span>
        <span style="background-color: #dc3545; color: white; padding: 2px 8px; border-radius: 10px; font-size: 12px; margin-left: 10px;">SALE</span>
      </div>
      <a href="#" style="display: inline-block; padding: 8px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Buy Now</a>
    </div>
  </div>
</div>
  `
}

function getImageGalleryBlock() {
  return `
<div style="padding: 20px; background-color: white; text-align: center;">
  <h3 style="margin-top: 0; margin-bottom: 20px;">Image Gallery</h3>
  <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
    <div style="flex: 0 0 calc(33.333% - 10px);">
      <img src="https://via.placeholder.com/300" alt="Gallery Image 1" style="width: 100%; border-radius: 5px;">
    </div>
    <div style="flex: 0 0 calc(33.333% - 10px);">
      <img src="https://via.placeholder.com/300" alt="Gallery Image 2" style="width: 100%; border-radius: 5px;">
    </div>
    <div style="flex: 0 0 calc(33.333% - 10px);">
      <img src="https://via.placeholder.com/300" alt="Gallery Image 3" style="width: 100%; border-radius: 5px;">
    </div>
    <div style="flex: 0 0 calc(33.333% - 10px);">
      <img src="https://via.placeholder.com/300" alt="Gallery Image 4" style="width: 100%; border-radius: 5px;">
    </div>
    <div style="flex: 0 0 calc(33.333% - 10px);">
      <img src="https://via.placeholder.com/300" alt="Gallery Image 5" style="width: 100%; border-radius: 5px;">
    </div>
    <div style="flex: 0 0 calc(33.333% - 10px);">
      <img src="https://via.placeholder.com/300" alt="Gallery Image 6" style="width: 100%; border-radius: 5px;">
    </div>
  </div>
  <div style="margin-top: 20px;">
    <a href="#" style="display: inline-block; padding: 8px 20px; background-color: #6c757d; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">View All</a>
  </div>
</div>
  `
}

function getQuoteBlock() {
  return `
<div style="padding: 40px 20px; background-color: #f8f9fa; text-align: center; border-left: 4px solid #007bff;">
  <div style="font-size: 36px; color: #007bff; margin-bottom: 20px;">"</div>
  <p style="font-style: italic; font-size: 18px; color: #333; max-width: 600px; margin: 0 auto 20px;">The best way to predict the future is to create it. Innovation distinguishes between a leader and a follower.</p>
  <p style="font-weight: bold; margin: 0;">Steve Jobs</p>
  <p style="color: #6c757d; font-size: 14px; margin: 5px 0 0;">Co-founder of Apple Inc.</p>
</div>
  `
}

function getStatsBlock() {
  return `
<div style="padding: 30px 20px; background-color: white; text-align: center;">
  <h3 style="margin-top: 0; margin-bottom: 30px;">Our Impact in Numbers</h3>
  <div style="display: flex; flex-wrap: wrap; justify-content: center; text-align: center;">
    <div style="flex: 0 0 33.333%; padding: 0 15px; margin-bottom: 20px;">
      <div style="font-size: 36px; font-weight: bold; color: #007bff; margin-bottom: 5px;">10K+</div>
      <p style="margin: 0; color: #6c757d;">Happy Customers</p>
    </div>
    <div style="flex: 0 0 33.333%; padding: 0 15px; margin-bottom: 20px;">
      <div style="font-size: 36px; font-weight: bold; color: #007bff; margin-bottom: 5px;">50+</div>
      <p style="margin: 0; color: #6c757d;">Countries Served</p>
    </div>
    <div style="flex: 0 0 33.333%; padding: 0 15px; margin-bottom: 20px;">
      <div style="font-size: 36px; font-weight: bold; color: #007bff; margin-bottom: 5px;">99%</div>
      <p style="margin: 0; color: #6c757d;">Satisfaction Rate</p>
    </div>
  </div>
</div>
  `
}

function getTeamBlock() {
  return `
<div style="padding: 30px 20px; background-color: white; text-align: center;">
  <h3 style="margin-top: 0; margin-bottom: 20px;">Meet Our Team</h3>
  <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px;">
    <div style="flex: 0 0 calc(33.333% - 20px); max-width: 200px;">
      <img src="https://via.placeholder.com/200" alt="Team Member 1" style="width: 100%; border-radius: 50%; margin-bottom: 15px;">
      <h4 style="margin: 0 0 5px;">John Doe</h4>
      <p style="margin: 0; color: #6c757d; font-size: 14px;">CEO & Founder</p>
      <div style="margin-top: 10px;">
        <a href="#" style="color: #007bff; text-decoration: none; margin: 0 5px;"><img src="https://via.placeholder.com/15" alt="LinkedIn" style="width: 15px; height: 15px;"></a>
        <a href="#" style="color: #007bff; text-decoration: none; margin: 0 5px;"><img src="https://via.placeholder.com/15" alt="Twitter" style="width: 15px; height: 15px;"></a>
      </div>
    </div>
    <div style="flex: 0 0 calc(33.333% - 20px); max-width: 200px;">
      <img src="https://via.placeholder.com/200" alt="Team Member 2" style="width: 100%; border-radius: 50%; margin-bottom: 15px;">
      <h4 style="margin: 0 0 5px;">Jane Smith</h4>
      <p style="margin: 0; color: #6c757d; font-size: 14px;">CTO</p>
      <div style="margin-top: 10px;">
        <a href="#" style="color: #007bff; text-decoration: none; margin: 0 5px;"><img src="https://via.placeholder.com/15" alt="LinkedIn" style="width: 15px; height: 15px;"></a>
        <a href="#" style="color: #007bff; text-decoration: none; margin: 0 5px;"><img src="https://via.placeholder.com/15" alt="Twitter" style="width: 15px; height: 15px;"></a>
      </div>
    </div>
    <div style="flex: 0 0 calc(33.333% - 20px); max-width: 200px;">
      <img src="https://via.placeholder.com/200" alt="Team Member 3" style="width: 100%; border-radius: 50%; margin-bottom: 15px;">
      <h4 style="margin: 0 0 5px;">Mike Johnson</h4>
      <p style="margin: 0; color: #6c757d; font-size: 14px;">Lead Designer</p>
      <div style="margin-top: 10px;">
        <a href="#" style="color: #007bff; text-decoration: none; margin: 0 5px;"><img src="https://via.placeholder.com/15" alt="LinkedIn" style="width: 15px; height: 15px;"></a>
        <a href="#" style="color: #007bff; text-decoration: none; margin: 0 5px;"><img src="https://via.placeholder.com/15" alt="Twitter" style="width: 15px; height: 15px;"></a>
      </div>
    </div>
  </div>
</div>
  `;
}

function getEventBlock() {
  return `
<div style="padding: 30px 20px; background-color: #f8f9fa; border-radius: 5px;">
  <div style="display: flex; flex-wrap: wrap; align-items: center;">
    <div style="flex: 0 0 25%; text-align: center; padding-right: 20px;">
      <div style="background-color: #007bff; color: white; border-radius: 5px; padding: 15px;">
        <div style="font-size: 36px; font-weight: bold;">15</div>
        <div style="font-size: 18px;">June</div>
        <div style="font-size: 14px;">2025</div>
      </div>
    </div>
    <div style="flex: 0 0 75%;">
      <h3 style="margin-top: 0; color: #333;">Annual Conference 2025</h3>
      <p style="margin-bottom: 15px;">Join us for our biggest event of the year! Network with industry leaders and learn about the latest trends.</p>
      <div style="margin-bottom: 15px;">
        <div style="display: flex; align-items: center; margin-bottom: 5px;">
          <img src="https://via.placeholder.com/15" alt="Location" style="width: 15px; height: 15px; margin-right: 5px;">Venue Name, City</div>
        <div style="display: flex; align-items: center; margin-bottom: 5px;">
          <img src="https://via.placeholder.com/15" alt="Time" style="width: 15px; height: 15px; margin-right: 5px;">9:00 AM - 5:00 PM</div>
      </div>
      <a href="#" style="display: inline-block; padding: 8px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Register Now</a>
    </div>
  </div>
</div>
  `;
}

function getAIGeneratedTemplate(category: string) {
  switch (category) {
    case "welcome":
      return `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
      <h1>Welcome to Our Platform</h1>
    </div>
    <div style="padding: 20px; background-color: #ffffff;">
      <p>Hello {{user.firstname}},</p>
      <p>Thank you for signing up! We're excited to have you on board.</p>
      <p>With our platform, you can:</p>
      <ul>
        <li>Automate Insta Dms</li>
        <li>Schedule IG posts</li>
        <li>Create content</li>
      </ul>
      <p>If you have any questions, feel free to reply to this email.</p>
      <a href="#" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; margin-top: 20px;">Get Started</a>
    </div>
    <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; border-radius: 0 0 5px 5px;">
      <p>© 2025 Yazzil. All rights reserved.</p>
      <p>00100 Main St, Nairobae, Kenya</p>
    </div>
  </div>
</div>
      `;
    case "newsletter":
      return `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #007bff; color: white; padding: 40px 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 28px;">Stay Updated with Our Newsletter</h1>
      <p style="margin: 15px 0 25px;">Get the latest news, articles, and exclusive offers delivered straight to your inbox.</p>
      <a href="#" style="display: inline-block; padding: 10px 20px; background-color: white; color: #007bff; text-decoration: none; border-radius: 5px; font-weight: bold;">Subscribe Now</a>
    </div>
    <div style="padding: 20px; background-color: #ffffff;">
      <h2 style="margin-top: 0;">Featured Article</h2>
      <p>Check out our latest article on the benefits of social media automation. Learn how to save time and boost your online presence.</p>
      <a href="#" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; margin-top: 20px;">Read More</a>
    </div>
    <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; border-radius: 0 0 5px 5px;">
      <p>© 2025 Yazzil. All rights reserved.</p>
      <p>00100 Main St, Nairobae, Kenya</p>
    </div>
  </div>
</div>
      `;
    case "promotional":
      return `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #dc3545; color: white; padding: 40px 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 28px;">Exclusive Offer Just for You!</h1>
      <p style="margin: 15px 0 25px;">Get 20% off all our premium features for a limited time only.</p>
      <a href="#" style="display: inline-block; padding: 10px 20px; background-color: white; color: #dc3545; text-decoration: none; border-radius: 5px; font-weight: bold;">Claim Your Discount</a>
    </div>
    <div style="padding: 20px; background-color: #ffffff;">
      <h2 style="margin-top: 0;">Don't Miss Out</h2>
      <p>Upgrade your account today and unlock powerful tools to grow your business. This offer expires soon, so act fast!</p>
      <a href="#" style="display: inline-block; padding: 10px 20px; background-color: #dc3545; color: #ffffff; text-decoration: none; border-radius: 5px; margin-top: 20px;">Upgrade Now</a>
    </div>
    <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; border-radius: 0 0 5px 5px;">
      <p>© 2025 Yazzil. All rights reserved.</p>
      <p>00100 Main St, Nairobae, Kenya</p>
    </div>
  </div>
</div>
      `;
    case "transactional":
      return `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #28a745; color: white; padding: 40px 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 28px;">Your Payment Was Successful</h1>
    </div>
    <div style="padding: 20px; background-color: #ffffff;">
      <p>Hello {{user.firstname}},</p>
      <p>Thank you for your payment. Here are the details of your transaction:</p>
      <ul>
        <li>Transaction ID: 1234567890</li>
        <li>Amount: $99.99</li>
        <li>Date: June 15, 2025</li>
      </ul>
      <p>If you have any questions, please contact our support team.</p>
    </div>
    <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; border-radius: 0 0 5px 5px;">
      <p>© 2025 Yazzil. All rights reserved.</p>
      <p>00100 Main St, Nairobae, Kenya</p>
    </div>
  </div>
</div>
      `;
    default:
      return `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
      <h1>Welcome to Our Platform</h1>
    </div>
    <div style="padding: 20px; background-color: #ffffff;">
      <p>Hello {{user.firstname}},</p>
      <p>Thank you for signing up! We're excited to have you on board.</p>
      <p>With our platform, you can:</p>
      <ul>
        <li>Automate Insta Dms</li>
        <li>Schedule IG posts</li>
        <li>Create content</li>
      </ul>
      <p>If you have any questions, feel free to reply to this email.</p>
      <a href="#" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; margin-top: 20px;">Get Started</a>
    </div>
    <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; border-radius: 0 0 5px 5px;">
      <p>© 2025 Yazzil. All rights reserved.</p>
      <p>00100 Main St, Nairobae, Kenya</p>
    </div>
  </div>
</div>
      `;
  }
}
