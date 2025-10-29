
"use client"
import { useQueryAutomation } from "@/hooks/user-queries"
import { PlaneBlue, SmartAi } from "@/icons"
import PostButton from "../post"
import { motion } from "framer-motion"
import { FancyConnector } from "../connector"
import { Badge } from "@/components/ui/badge"
import {
  MessageSquare,
  Zap,
  Clock,
  Settings,  
  Copy,
  CheckCircle,
  Edit,
  FileText,
  ExternalLink,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getBusinessProfileDescription } from "@/actions/business"
import { useEffect } from "react"

type Props = {
  id: string
  theme?: {
    id: string
    name: string
    primary: string
    secondary: string
  }
}

const ThenNode = ({ id, theme = { id: "blue", name: "Blue", primary: "light-blue", secondary: "#768BDD" } }: Props) => {
  const { data } = useQueryAutomation(id)
  const commentTrigger = data?.data?.trigger.find((t) => t.type === "COMMENT")
  const [copied, setCopied] = useState(false)
  const [businessProfile, setBusinessProfile] = useState<string | null>(null)
  const [showBusinessProfile, setShowBusinessProfile] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)

  const isAiResponse = data?.data?.listener?.listener === "SMARTAI"
  const responseText = data?.data?.listener?.prompt || "No response configured"

  useEffect(() => {
    const loadBusinessProfile = async () => {
      if (isAiResponse && id) {
        setIsLoadingProfile(true)
        try {
          const result = await getBusinessProfileDescription(id)
          if (result.success && result.profile ) {
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
  }, [id, isAiResponse])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(responseText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!data?.data?.listener) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-5xl relative px-4 sm:px-0"
    >
      <div className="absolute h-20 left-1/2 -top-20 flex flex-col items-center z-10">
        <FancyConnector direction="vertical" style="gradient" length={55} color={theme.secondary} />
      </div>

      <div className="bg-gradient-to-r from-background-80 to-background-90 rounded-xl w-full overflow-hidden shadow-lg border border-background-80/50">
        {/* Top accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-[#3352CC] via-[#768BDD] to-[#3352CC] w-full shimmerBorder" />

        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-background-90 rounded-xl">{isAiResponse ? <SmartAi /> : <PlaneBlue />}</div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">{isAiResponse ? "AI-Powered Response" : "Automated Message"}</h3>
                <Badge className={isAiResponse ? "bg-purple-600" : "bg-[#3352CC]"}>
                  {isAiResponse ? "AI" : "Auto"}
                </Badge>
              </div>
              <p className="text-text-secondary">
                {isAiResponse
                  ? "Using dynamic intelligent replies powered by AI"
                  : "Sending a pre-configured message to your customers"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left section - Response preview */}
            <div className="lg:col-span-2">
              <div className="bg-background-90 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-[#768BDD]" />
                    Response Preview
                  </h4>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs" onClick={copyToClipboard}>
                      {copied ? (
                        <>
                          <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 mr-1.5" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      <Edit className="h-3.5 w-3.5 mr-1.5" />
                      Edit
                    </Button>
                  </div>
                </div>

                <div className="bg-background-80 rounded-lg p-4 min-h-[150px] sm:min-h-[200px]">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#3352CC] flex items-center justify-center text-white font-bold text-sm">
                      YB
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Your Business</span>
                        <Badge variant="outline" className="bg-background-90/50 text-xs">
                          Author
                        </Badge>
                      </div>
                      <div className="mt-2 text-sm whitespace-pre-line">{responseText}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-background-80/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#768BDD]" />
                    <p className="text-sm text-text-secondary">
                      Average response time: <span className="text-white font-medium">1.2 seconds</span>
                    </p>
                  </div>
                </div>

                {isAiResponse && businessProfile && (
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setShowBusinessProfile(!showBusinessProfile)}
                    >
                      <FileText className="h-3.5 w-3.5 mr-1.5" />
                      {showBusinessProfile ? "Hide Business Knowledge" : "View Business Knowledge"}
                    </Button>

                    {showBusinessProfile && (
                      <div className="mt-3 bg-background-80/50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-sm font-medium flex items-center gap-2">
                            <Info className="h-3.5 w-3.5 text-[#768BDD]" />
                            Business Knowledge Base
                          </h5>
                          <Badge variant="outline" className="text-xs">
                            AI Reference
                          </Badge>
                        </div>
                        <ScrollArea className="h-[200px]">
                          <div className="text-xs whitespace-pre-line">{businessProfile}</div>
                        </ScrollArea>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right section - Settings & Stats */}
            <div className="lg:col-span-1">
              <div className="bg-background-90 rounded-xl p-5 staggeredFadeIn">
                <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Settings className="h-4 w-4 text-[#768BDD]" />
                  Response Settings
                </h4>

                <div className="space-y-4">
                  <div className="bg-background-80 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-[#768BDD]" />
                        <span>Response Type</span>
                      </div>
                      <Badge className={isAiResponse ? "bg-purple-600" : "bg-[#3352CC]"}>
                        {isAiResponse ? "AI-Powered" : "Template"}
                      </Badge>
                    </div>
                  </div>

                  <div className="bg-background-80 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[#768BDD]" />
                        <span>Delay</span>
                      </div>
                      <span className="font-medium">5 seconds</span>
                    </div>
                  </div>

                  <div className="bg-background-80 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-[#768BDD]" />
                        <span>Character Count</span>
                      </div>
                      <span className="font-medium">{responseText.length}</span>
                    </div>
                  </div>
                </div>

                {isAiResponse && businessProfile && (
                  <div className="mt-4 bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                    <h5 className="text-sm font-medium text-purple-300 flex items-center mb-2">
                      <Info className="h-4 w-4 mr-2 text-purple-400" />
                      AI Knowledge Base
                    </h5>
                    <p className="text-xs text-purple-200">
                      Your AI has access to detailed business information to provide accurate and consistent responses
                      to customer inquiries.
                    </p>
                    <div className="mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                        onClick={() => setShowBusinessProfile(!showBusinessProfile)}
                      >
                        <ExternalLink className="h-3 w-3 mr-1.5" />
                        {showBusinessProfile ? "Hide Details" : "View Details"}
                      </Button>
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <h5 className="text-sm font-medium mb-3">Response Performance</h5>
                  <div className="bg-background-80 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-text-secondary">Engagement Rate</span>
                      <span className="font-medium">76%</span>
                    </div>
                    <div className="w-full bg-background-90 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#3352CC] to-[#768BDD] h-2 rounded-full"
                        style={{ width: "76%" }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    Configure Response
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {data.data.posts.length > 0 ? <></> : commentTrigger ? <PostButton id={id} theme={theme} /> : <></>}
        </div>
      </div>
    </motion.div>
  )
}

export default ThenNode
