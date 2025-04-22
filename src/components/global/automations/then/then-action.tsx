"use client"

import { useListener } from "@/hooks/use-automations"
import { AUTOMATION_LISTENERS } from "@/constants/automation"
import { SubscriptionPlan } from "../../subscription-plan"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Loader from "../../loader"
import { motion } from "framer-motion"
import { Lightbulb, PlusCircle, MessageSquare } from "lucide-react"
import FloatingPanel from "../../panel"
import ResponseLibrary from "../response"
import { ContextCard } from "../context"
import { useState } from "react"

type Props = {
  id: string
  theme?: {
    id: string
    name: string
    primary: string
    secondary: string
  }
}

const ThenAction = ({
  id,
  theme = { id: "blue", name: "Blue", primary: "light-blue", secondary: "#768BDD" },
}: Props) => {
  const { onSetListener, listener: Listener, onFormSubmit, register, isPending } = useListener(id)
  const [showTip, setShowTip] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")

  // AI suggestion examples
  const aiSuggestions = [
    "Thank them for their comment and ask a follow-up question about their experience",
    "Offer a personalized discount code based on their comment",
    "Provide more information about the product they're interested in",
    "Ask them to share their experience on social media",
  ]

  // Message templates
  const messageTemplates = [
    "Thanks for your comment! We appreciate your feedback.",
    "Hello! Thanks for reaching out. How can I help you today?",
    "We're glad you're interested in our products! Would you like more information?",
    "Thank you for your support! We'd love to hear more about your experience.",
  ]

  const handleSelectTemplate = (content: string) => {
    setSelectedTemplate(content)
    const textarea = document.querySelector('textarea[name="prompt"]') as HTMLTextAreaElement
    if (textarea) {
      textarea.value = content
      textarea.focus()
    }
  }

  return (
    <FloatingPanel
      title="Then"
      trigger={
        <motion.div
          className="group relative overflow-hidden rounded-xl mt-4 w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Border with animation */}
          <div className="absolute inset-0 bg-light-blue opacity-20 rounded-xl"></div>
          <div className="absolute inset-0 rounded-xl shimmerBorder"></div>

          {/* Inner content */}
          <div className="relative m-[2px] bg-background-90 rounded-lg p-5">
            <div className="flex items-center justify-center gap-3">
              <PlusCircle className="h-5 w-5 text-[#768BDD]" />
              <p className="text-[#768BDD] font-bold">Then</p>
            </div>
          </div>
        </motion.div>
      }
    >
      <div className="flex flex-col gap-4">
        {showTip && <ContextCard context="response" onClose={() => setShowTip(false)} />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {AUTOMATION_LISTENERS.map((listener) =>
            listener.type === "SMARTAI" ? (
              <SubscriptionPlan key={listener.type} type="PRO">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSetListener(listener.type)}
                  className={cn(
                    Listener === listener.type ? "bg-gradient-to-br from-[#7C21D6] to-[#4A1480]" : "bg-background-80",
                    "p-3 rounded-xl flex flex-col gap-y-2 cursor-pointer hover:opacity-80 transition duration-100 h-full",
                  )}
                >
                  <div className="flex gap-x-2 items-center">
                    {listener.icon}
                    <p>{listener.label}</p>
                  </div>
                  <p className="text-sm">{listener.description}</p>
                </motion.div>
              </SubscriptionPlan>
            ) : (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSetListener(listener.type)}
                key={listener.id}
                className={cn(
                  Listener === listener.type ? "bg-gradient-to-br from-[#3352CC] to-[#1C2D70]" : "bg-background-80",
                  "p-3 rounded-xl flex flex-col gap-y-2 cursor-pointer hover:opacity-80 transition duration-100 h-full",
                )}
              >
                <div className="flex gap-x-2 items-center">
                  {listener.icon}
                  <p>{listener.label}</p>
                </div>
                <p className="text-sm">{listener.description}</p>
              </motion.div>
            ),
          )}
        </div>

        <form onSubmit={onFormSubmit} className="flex flex-col gap-4 mt-2">
          {Listener && (
            <div className={`bg-background-80 p-4 rounded-xl mb-2`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium flex items-center">
                  {Listener === "SMARTAI" ? (
                    <>
                      {/* <Lightbulb className="h-5 w-5 mr-2 text-keyword-purple" />
                      AI Suggestions */}
                    </>
                  ) : (
                    <>
                      {/* <MessageSquare className="h-5 w-5 mr-2 text-light-blue" />
                      Quick Responses */}
                    </>
                  )}
                </h3>
                <ResponseLibrary
                  isAI={Listener === "SMARTAI"}
                  onSelectTemplate={handleSelectTemplate}
                  selectedTemplate={selectedTemplate}
                  userSubscription={Listener}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {(Listener === "SMARTAI" ? aiSuggestions : messageTemplates).map((suggestion, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className={`bg-background-90 p-2 rounded-lg text-sm cursor-pointer ${Listener === "SMARTAI" ? "text-keyword-purple" : "text-light-blue"}`}
                    onClick={() => {
                      const textarea = document.querySelector('textarea[name="prompt"]') as HTMLTextAreaElement
                      if (textarea) {
                        textarea.value = suggestion
                        textarea.focus()
                      }
                    }}
                  >
                    {suggestion}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm text-text-secondary">
              {Listener === "SMARTAI"
                ? "Add a prompt that your smart AI can use..."
                : "Add a message you want to send to your customers"}
            </label>
            <Textarea
              placeholder={
                Listener === "SMARTAI"
                  ? "Add a prompt that your smart AI can use..."
                  : "Add a message you want to send to your customers"
              }
              {...register("prompt")}
              className="bg-background-80 outline-none border-none ring-0 focus:ring-0 min-h-[120px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-text-secondary">Add a reply for comments (Optional)</label>
            <Input
              {...register("reply")}
              placeholder="Add a reply for comments (Optional)"
              className="bg-background-80 outline-none border-none ring-0 focus:ring-0"
            />
          </div>

          <Button
            className={cn(
              "bg-gradient-to-br w-full from-[#3352CC] font-medium text-white to-[#1C2D70]",
              Listener === "SMARTAI" && "from-[#7C21D6] to-[#4A1480]",
            )}
          >
            <Loader state={isPending}>Add a listener</Loader>
          </Button>
        </form>
      </div>
    </FloatingPanel>
  )
}

export default ThenAction