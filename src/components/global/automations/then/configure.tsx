"use client"

import { useQueryAutomation } from "@/hooks/user-queries"
import { useListener } from "@/hooks/use-automations"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SmartAi, PlaneBlue } from "@/icons"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, MessageSquare, ArrowRight, FileText, Info, Briefcase, ExternalLink, Loader2 } from "lucide-react"
import ResponseLibrary from "../response"
import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getBusinessProfileDescription } from "@/actions/business"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

type Props = {
  id: string
  theme?: {
    id: string
    name: string
    primary: string
    secondary: string
  }
}

const Configure = ({
  id,
  theme = { id: "blue", name: "Blue", primary: "light-blue", secondary: "#768BDD" },
}: Props) => {
  const { data } = useQueryAutomation(id)
  const { onSetListener, register, onFormSubmit, listener, isPending } = useListener(id)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [activeTab, setActiveTab] = useState<"message" | "smartai">("message")
  const [businessProfile, setBusinessProfile] = useState<string | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [showBusinessProfile, setShowBusinessProfile] = useState(false)

  useEffect(() => {
    const loadBusinessProfile = async () => {
      if (id) {
        setIsLoadingProfile(true)
        try {
          const result = await getBusinessProfileDescription(id)
          if (result.success && result.profile) {
            setBusinessProfile(result.profile.content)
          }
        } catch (error) {
          console.error("Error loading business profile:", error)
        } finally {
          setIsLoadingProfile(false)
        }
      }
    }

    loadBusinessProfile()
  }, [id])

  const handleSelectTemplate = (template: string) => {
    setSelectedTemplate(template)

    // Auto-fill the textarea with the selected template
    const textareaElement = document.querySelector('textarea[name="prompt"]') as HTMLTextAreaElement
    if (textareaElement) {
      textareaElement.value = template

      // Trigger a change event to update the form state
      const event = new Event("input", { bubbles: true })
      textareaElement.dispatchEvent(event)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value as "message" | "smartai")
    onSetListener(value === "smartai" ? "SMARTAI" : "MESSAGE")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-5xl px-4 sm:px-0"
    >
      <div className="bg-gradient-to-r from-background-80 to-background-90 rounded-xl w-full overflow-hidden shadow-lg border border-background-80/50">
        {/* Top accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-[#3352CC] via-[#768BDD] to-[#3352CC] w-full shimmerBorder" />

        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-background-90 rounded-xl">
              {activeTab === "smartai" ? <SmartAi /> : <PlaneBlue />}
            </div>
            <div>
              <h3 className="text-xl font-bold">Configure Response</h3>
              <p className="text-text-secondary">Set up how your automation will respond to triggers</p>
            </div>
          </div>

          <form onSubmit={onFormSubmit}>
            <Tabs defaultValue="message" value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="mb-6">
                <TabsTrigger value="message" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Standard Message
                </TabsTrigger>
                <TabsTrigger value="smartai" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  AI-Powered
                </TabsTrigger>
              </TabsList>

              <TabsContent value="message">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="prompt" className="block text-sm font-medium mb-2">
                        Your Response Message
                      </label>
                      <Textarea
                        {...register("prompt")}
                        placeholder="Enter the message you want to send when someone triggers your automation..."
                        className="min-h-[200px] bg-background-90 border-none"
                        defaultValue={data?.data?.listener?.prompt || selectedTemplate}
                      />
                      <p className="text-xs text-text-secondary mt-2">
                        This message will be sent automatically when someone uses one of your trigger keywords.
                      </p>
                    </div>

                    <div>
                      <label htmlFor="reply" className="block text-sm font-medium mb-2">
                        Comment Reply (Optional)
                      </label>
                      <Textarea
                        {...register("reply")}
                        placeholder="Enter a public reply to show on the comment..."
                        className="min-h-[100px] bg-background-90 border-none"
                        defaultValue={data?.data?.listener?.commentReply || ""}
                      />
                      <p className="text-xs text-text-secondary mt-2">
                        This will be shown as a public reply to the comment. Leave empty to only send a private message.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      disabled={isPending}
                      className="bg-gradient-to-br from-[#3352CC] to-[#1C2D70] text-white w-full mt-4"
                    >
                      {isPending ? "Saving..." : "Save Response"}
                    </Button>
                  </div>

                  <div>
                    <ResponseLibrary
                      isAI={false}
                      onSelectTemplate={handleSelectTemplate}
                      selectedTemplate={selectedTemplate}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="smartai">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-4 rounded-lg border border-purple-500/20">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-900/30 rounded-lg">
                          <Sparkles className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-purple-300">AI-Powered Responses</h4>
                          <p className="text-sm text-text-secondary mt-1">
                            Our AI will analyze each comment or message and generate a personalized response based on
                            your brand voice and the context of the interaction.
                          </p>
                        </div>
                      </div>
                    </div>

                    {businessProfile ? (
                      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-purple-900/30 rounded-lg">
                            <Briefcase className="h-5 w-5 text-purple-400" />
                          </div>
                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-purple-300">Business Knowledge Base</h4>
                              <Badge
                                variant="outline"
                                className="bg-purple-900/30 border-purple-500/30 text-purple-300"
                              >
                                Active
                              </Badge>
                            </div>
                            <p className="text-sm text-purple-200/70 mt-1">
                              Your AI has access to detailed information about your business to provide accurate and
                              consistent responses.
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2 text-xs border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                              onClick={() => setShowBusinessProfile(!showBusinessProfile)}
                            >
                              {showBusinessProfile ? "Hide Details" : "View Business Knowledge"}
                              <ExternalLink className="h-3 w-3 ml-1.5" />
                            </Button>

                            {showBusinessProfile && (
                              <div className="mt-3 bg-background-90/50 p-3 rounded-lg border border-purple-500/20">
                                <ScrollArea className="h-[200px]">
                                  <div className="text-xs whitespace-pre-line text-purple-100/80">
                                    {businessProfile}
                                  </div>
                                </ScrollArea>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Alert className="bg-yellow-500/10 border-yellow-500/30">
                        <Info className="h-4 w-4 text-yellow-500" />
                        <AlertTitle className="text-yellow-500 font-medium">Business Knowledge Required</AlertTitle>
                        <AlertDescription className="text-yellow-400">
                          For best results, add detailed information about your business in the Business Knowledge Hub.
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 w-full text-xs border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                          >
                            Set Up Business Knowledge
                            <ArrowRight className="h-3 w-3 ml-1.5" />
                          </Button>
                        </AlertDescription>
                      </Alert>
                    )}

                    <div>
                      <label htmlFor="prompt" className="block text-sm font-medium mb-2">
                        AI Instructions (Optional)
                      </label>
                      <Textarea
                        {...register("prompt")}
                        placeholder="Give the AI specific instructions about how to respond..."
                        className="min-h-[200px] bg-background-90 border-none"
                        defaultValue={
                          data?.data?.listener?.prompt ||
                          "Please respond in a friendly, helpful tone. Make sure to address the customer's concerns directly and offer solutions when possible."
                        }
                      />
                      <p className="text-xs text-text-secondary mt-2">
                        These instructions help guide the AI on how to respond. You can specify your brand voice, tone,
                        and any specific information to include or avoid.
                      </p>
                    </div>

                    <div className="bg-background-90 p-4 rounded-lg">
                      <h5 className="font-medium mb-2 flex items-center gap-2">
                        <ArrowRight className="h-4 w-4 text-purple-400" />
                        AI Capabilities
                      </h5>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 flex-shrink-0 rounded-full bg-purple-900/30 flex items-center justify-center mt-0.5">
                            <Sparkles className="h-3 w-3 text-purple-400" />
                          </div>
                          <span>Analyzes sentiment and context of each message</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 flex-shrink-0 rounded-full bg-purple-900/30 flex items-center justify-center mt-0.5">
                            <Sparkles className="h-3 w-3 text-purple-400" />
                          </div>
                          <span>Personalizes responses based on user history</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 flex-shrink-0 rounded-full bg-purple-900/30 flex items-center justify-center mt-0.5">
                            <Sparkles className="h-3 w-3 text-purple-400" />
                          </div>
                          <span>Maintains consistent brand voice across all interactions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 flex-shrink-0 rounded-full bg-purple-900/30 flex items-center justify-center mt-0.5">
                            <Sparkles className="h-3 w-3 text-purple-400" />
                          </div>
                          <span>Handles complex questions with accurate information</span>
                        </li>
                      </ul>
                    </div>

                    <Button
                      type="submit"
                      disabled={isPending}
                      className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white w-full mt-4"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Enable AI Responses"
                      )}
                    </Button>
                  </div>

                  <div>
                    <div className="bg-background-90 p-4 rounded-lg mb-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-purple-400" />
                        AI Response Examples
                      </h4>

                      <div className="space-y-3">
                        <div className="bg-background-80 p-3 rounded-lg">
                          <div className="flex items-start gap-2 mb-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-sm text-muted-foreground">Customer Message:</p>
                              <p className="text-sm">Do you have any appointments available this weekend?</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 mt-3 pl-6">
                            <Sparkles className="h-4 w-4 text-purple-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-purple-400">AI Response:</p>
                              <p className="text-sm">
                                Hi there! Yes, we do have some openings this weekend. We currently have slots available
                                on Saturday at 10am, 2pm, and 4pm, and on Sunday at 11am and 3pm. Would any of those
                                times work for you? You can also book directly through our website at
                                scissorsandstyle.com/book or give us a call at (555) 123-4567.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-background-80 p-3 rounded-lg">
                          <div className="flex items-start gap-2 mb-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-sm text-muted-foreground">Customer Message:</p>
                              <p className="text-sm">What products do you recommend for frizzy hair?</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 mt-3 pl-6">
                            <Sparkles className="h-4 w-4 text-purple-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-purple-400">AI Response:</p>
                              <p className="text-sm">
                                For frizzy hair, we recommend our anti-frizz serum from the Smooth Collection, which
                                helps tame flyaways while adding shine. Our hydrating mask is also excellent for weekly
                                deep conditioning. These products work best when paired with our sulfate-free
                                moisturizing shampoo. Feel free to stop by for a personalized consultation with one of
                                our stylists who can recommend products specifically for your hair type!
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <ResponseLibrary
                      isAI={true}
                      onSelectTemplate={handleSelectTemplate}
                      selectedTemplate={selectedTemplate}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </div>
      </div>
    </motion.div>
  )
}

export default Configure
