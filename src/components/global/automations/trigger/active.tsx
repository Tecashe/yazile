
"use client"
import { InstagramBlue, PlaneBlue } from "@/icons"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, Users, MessageSquare, KeySquare, Zap, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

type Props = {
  type: string
  keywords: {
    id: string
    word: string
    automationId: string | null
  }[]
  theme?: {
    id: string
    name: string
    primary: string
    secondary: string
  }
  listenMode?: "KEYWORDS" | "ALL_MESSAGES"
  responseType?: string
  isFallback?: boolean
  fallbackMessage?: string | null
  buttons?: any // JsonValue type - you can replace with proper type if available
}

const ActiveTrigger = ({
  keywords,
  type,
  theme = { id: "blue", name: "Blue", primary: "light-blue", secondary: "#768BDD" },
  listenMode = "KEYWORDS",
  responseType = "MESSAGE",
  isFallback = false,
  fallbackMessage = null,
  buttons = null,
}: Props) => {
  const isKeywordMode = listenMode === "KEYWORDS"
  const isAllMessagesMode = listenMode === "ALL_MESSAGES"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl px-4 sm:px-0"
    >
      <Card className="overflow-hidden shadow-lg border-0 bg-gradient-to-r from-background-80 to-background-90">
        {/* Top accent bar */}
        <div className={cn(
          "h-1.5 w-full shimmerBorder",
          isAllMessagesMode 
            ? "bg-gradient-to-r from-[#7C21D6] via-[#A855F7] to-[#7C21D6]"
            : "bg-gradient-to-r from-[#3352CC] via-[#768BDD] to-[#3352CC]"
        )} />

        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            {/* Left section - Trigger info */}
            <div className="lg:w-1/3">
              <motion.div 
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="p-3 bg-background-90 rounded-xl shadow-sm">
                  {type === "COMMENT" ? <InstagramBlue/> : <PlaneBlue />}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {type === "COMMENT" ? "Instagram Comment" : "Direct Message"}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {type === "COMMENT"
                      ? "Triggers when someone comments on your post"
                      : "Triggers when someone sends you a direct message"}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <Badge variant="outline" className="bg-background-90/50 text-xs flex items-center gap-1 border-[#768BDD]/30">
                      <Clock className="h-3 w-3" />
                      Auto Response
                    </Badge>
                    <Badge variant="outline" className="bg-background-90/50 text-xs flex items-center gap-1 border-[#768BDD]/30">
                      <Users className="h-3 w-3" />
                      Private DM
                    </Badge>
                    {responseType === "SMARTAI" && (
                      <Badge variant="outline" className="bg-green-500/20 text-green-400 text-xs flex items-center gap-1 border-green-500/30">
                        <Zap className="h-3 w-3" />
                        Smart AI
                      </Badge>
                    )}
                    {isFallback && (
                      <Badge variant="outline" className="bg-orange-500/20 text-orange-400 text-xs flex items-center gap-1 border-orange-500/30">
                        <CheckCircle className="h-3 w-3" />
                        Fallback
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right section - Configuration */}
            <div className="lg:w-2/3 lg:border-l lg:border-background-80/50 lg:pl-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-white flex items-center gap-2">
                    {isKeywordMode ? (
                      <>
                        <KeySquare className="h-5 w-5 text-[#768BDD]" />
                        Trigger Keywords
                      </>
                    ) : (
                      <>
                        <MessageSquare className="h-5 w-5 text-purple-400" />
                        Listen Mode
                      </>
                    )}
                  </h4>
                  <Badge className={cn(
                    "font-medium",
                    isAllMessagesMode 
                      ? "bg-gradient-to-r from-[#7C21D6] to-[#4A1480]"
                      : "bg-[#3352CC]"
                  )}>
                    {isKeywordMode ? `${keywords.length} Keywords` : "All Messages"}
                  </Badge>
                </div>

                <Card className="bg-background-90 border-background-80/50">
                  <CardContent className="p-4">
                    {isKeywordMode ? (
                      <>
                        <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
                          {keywords.map((word, index) => (
                            <motion.div
                              key={word.id}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.1 * index }}
                              whileHover={{ scale: 1.05 }}
                              className="bg-gradient-to-br from-[#3352CC]/20 to-[#1C2D70]/20 border border-[#3352CC]/30 flex items-center gap-x-2 capitalize text-white font-medium py-2 px-4 rounded-full hover:from-[#3352CC]/30 hover:to-[#1C2D70]/30 transition-all duration-200"
                            >
                              <p className="text-sm">{word.word}</p>
                            </motion.div>
                          ))}
                        </div>

                        <Alert className="bg-background-80/50 border-[#768BDD]/30">
                          <Calendar className="h-4 w-4 text-[#768BDD]" />
                          <AlertDescription className="text-sm text-text-secondary">
                            This automation will trigger when someone uses these keywords in a
                            {type === "COMMENT" ? " comment on your post" : " direct message to you"}.
                            Responses will be sent via private message.
                          </AlertDescription>
                        </Alert>
                      </>
                    ) : (
                      <Alert className="bg-purple-500/10 border-purple-500/30">
                        <Zap className="h-4 w-4 text-purple-500" />
                        <AlertTitle className="text-purple-500 font-medium">Open Listener Mode</AlertTitle>
                        <AlertDescription className="text-purple-400">
                          Your automation responds to any message from customers, allowing for natural conversation flow.
                          Perfect for AI-powered responses that understand context.
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Fallback Message Display */}
                    {isFallback && fallbackMessage && (
                      <Alert className="bg-orange-500/10 border-orange-500/30 mt-3">
                        <CheckCircle className="h-4 w-4 text-orange-500" />
                        <AlertTitle className="text-orange-500 font-medium">Fallback Message</AlertTitle>
                        <AlertDescription className="text-orange-400">
                          {fallbackMessage}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Buttons Display */}
                    {/* {buttons && Array.isArray(buttons) && buttons.length > 0 && (
                      <div className="mt-3">
                        <h6 className="text-sm font-medium text-white mb-2">Quick Reply Buttons</h6>
                        <div className="flex flex-wrap gap-2">
                          {buttons.map((button: any, index: number) => (
                            <Badge 
                              key={index}
                              variant="outline" 
                              className="bg-blue-500/20 text-blue-400 border-blue-500/30"
                            >
                              {button.text || button.label || button}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )} */}
                    {buttons && Array.isArray(buttons) && buttons.length > 0 && (
                      <div className="mt-3">
                        <h6 className="text-sm font-medium text-white mb-2">Quick Reply Buttons</h6>
                        <div className="flex flex-wrap gap-2">
                          {buttons.map((button: any, index: number) => {
                            // Handle different button structures safely
                            let buttonText = '';
                            
                            if (typeof button === 'string') {
                              buttonText = button;
                            } else if (button && typeof button === 'object') {
                              // Your buttons have {name, payload} structure
                              buttonText = button.name || button.text || button.label || `Button ${index + 1}`;
                            }

                            return (
                              <Badge 
                                key={index}
                                variant="outline" 
                                className="bg-blue-500/20 text-blue-400 border-blue-500/30"
                              >
                                {buttonText}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Status indicators */}
                <div className="mt-4">
                  <h5 className="text-sm font-medium mb-3 text-white">Automation Status</h5>
                  <div className="space-y-2">
                    <motion.div 
                      className="flex items-center gap-3 text-sm text-text-secondary"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span>Messages will be sent to customer DMs</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center gap-3 text-sm text-text-secondary"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span>Responses adapt to customer&apos;s language</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center gap-3 text-sm text-text-secondary"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                      <span>
                        {isKeywordMode 
                          ? "Triggers only on specific keywords" 
                          : "Responds to all incoming messages"
                        }
                      </span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default ActiveTrigger

