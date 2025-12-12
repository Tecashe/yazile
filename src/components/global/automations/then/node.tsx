
// "use client"
// import { useQueryAutomation } from "@/hooks/user-queries"
// import { PlaneBlue, SmartAi } from "@/icons"
// import PostButton from "../post"
// import { motion } from "framer-motion"
// import { FancyConnector } from "../connector"
// import { Badge } from "@/components/ui/badge"
// import {
//   MessageSquare,
//   Zap,
//   Clock,
//   Settings,  
//   Copy,
//   CheckCircle,
//   Edit,
//   FileText,
//   ExternalLink,
//   Info,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { useState } from "react"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { getBusinessProfileDescription } from "@/actions/business"
// import { useEffect } from "react"

// type Props = {
//   id: string
//   theme?: {
//     id: string
//     name: string
//     primary: string
//     secondary: string
//   }
// }

// const ThenNode = ({ id, theme = { id: "blue", name: "Blue", primary: "light-blue", secondary: "#768BDD" } }: Props) => {
//   const { data } = useQueryAutomation(id)
//   const commentTrigger = data?.data?.trigger.find((t) => t.type === "COMMENT")
//   const [copied, setCopied] = useState(false)
//   const [businessProfile, setBusinessProfile] = useState<string | null>(null)
//   const [showBusinessProfile, setShowBusinessProfile] = useState(false)
//   const [isLoadingProfile, setIsLoadingProfile] = useState(false)

//   const isAiResponse = data?.data?.listener?.listener === "SMARTAI"
//   const responseText = data?.data?.listener?.prompt || "No response configured"

//   useEffect(() => {
//     const loadBusinessProfile = async () => {
//       if (isAiResponse && id) {
//         setIsLoadingProfile(true)
//         try {
//           const result = await getBusinessProfileDescription(id)
//           if (result.success && result.profile ) {
//             setBusinessProfile(result.profile.content)
//           }
//         } catch (error) {
//           console.error("Error loading business profile:", error)
//         } finally {
//           setIsLoadingProfile(false)
//         }
//       }
//     }

//     loadBusinessProfile()
//   }, [id, isAiResponse])

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(responseText)
//     setCopied(true)
//     setTimeout(() => setCopied(false), 2000)
//   }

//   if (!data?.data?.listener) {
//     return null
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="w-full max-w-5xl relative px-4 sm:px-0"
//     >
//       <div className="absolute h-20 left-1/2 -top-20 flex flex-col items-center z-10">
//         <FancyConnector direction="vertical" style="gradient" length={55} color={theme.secondary} />
//       </div>

//       <div className="bg-gradient-to-r from-background-80 to-background-90 rounded-xl w-full overflow-hidden shadow-lg border border-background-80/50">
//         {/* Top accent bar */}
//         <div className="h-1.5 bg-gradient-to-r from-[#3352CC] via-[#768BDD] to-[#3352CC] w-full shimmerBorder" />

//         <div className="p-4 sm:p-6">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="p-3 bg-background-90 rounded-xl">{isAiResponse ? <SmartAi /> : <PlaneBlue />}</div>
//             <div>
//               <div className="flex items-center gap-2">
//                 <h3 className="text-xl font-bold">{isAiResponse ? "AI-Powered Response" : "Automated Message"}</h3>
//                 <Badge className={isAiResponse ? "bg-purple-600" : "bg-[#3352CC]"}>
//                   {isAiResponse ? "AI" : "Auto"}
//                 </Badge>
//               </div>
//               <p className="text-text-secondary">
//                 {isAiResponse
//                   ? "Using dynamic intelligent replies powered by AI"
//                   : "Sending a pre-configured message to your customers"}
//               </p>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
//             {/* Left section - Response preview */}
//             <div className="lg:col-span-2">
//               <div className="bg-background-90 rounded-xl p-5">
//                 <div className="flex items-center justify-between mb-4">
//                   <h4 className="text-lg font-medium flex items-center gap-2">
//                     <MessageSquare className="h-4 w-4 text-[#768BDD]" />
//                     Response Preview
//                   </h4>
//                   <div className="flex items-center gap-2">
//                     <Button variant="outline" size="sm" className="h-8 text-xs" onClick={copyToClipboard}>
//                       {copied ? (
//                         <>
//                           <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-green-500" />
//                           Copied
//                         </>
//                       ) : (
//                         <>
//                           <Copy className="h-3.5 w-3.5 mr-1.5" />
//                           Copy
//                         </>
//                       )}
//                     </Button>
//                     <Button variant="outline" size="sm" className="h-8 text-xs">
//                       <Edit className="h-3.5 w-3.5 mr-1.5" />
//                       Edit
//                     </Button>
//                   </div>
//                 </div>

//                 <div className="bg-background-80 rounded-lg p-4 min-h-[150px] sm:min-h-[200px]">
//                   <div className="flex items-start gap-3">
//                     <div className="h-8 w-8 rounded-full bg-[#3352CC] flex items-center justify-center text-white font-bold text-sm">
//                       YB
//                     </div>
//                     <div>
//                       <div className="flex items-center gap-2">
//                         <span className="font-medium">Your Business</span>
//                         <Badge variant="outline" className="bg-background-90/50 text-xs">
//                           Author
//                         </Badge>
//                       </div>
//                       <div className="mt-2 text-sm whitespace-pre-line">{responseText}</div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-4 bg-background-80/50 p-3 rounded-lg">
//                   <div className="flex items-center gap-2">
//                     <Clock className="h-4 w-4 text-[#768BDD]" />
//                     <p className="text-sm text-text-secondary">
//                       Average response time: <span className="text-white font-medium">1.2 seconds</span>
//                     </p>
//                   </div>
//                 </div>

//                 {isAiResponse && businessProfile && (
//                   <div className="mt-4">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="w-full"
//                       onClick={() => setShowBusinessProfile(!showBusinessProfile)}
//                     >
//                       <FileText className="h-3.5 w-3.5 mr-1.5" />
//                       {showBusinessProfile ? "Hide Business Knowledge" : "View Business Knowledge"}
//                     </Button>

//                     {showBusinessProfile && (
//                       <div className="mt-3 bg-background-80/50 p-3 rounded-lg">
//                         <div className="flex items-center justify-between mb-2">
//                           <h5 className="text-sm font-medium flex items-center gap-2">
//                             <Info className="h-3.5 w-3.5 text-[#768BDD]" />
//                             Business Knowledge Base
//                           </h5>
//                           <Badge variant="outline" className="text-xs">
//                             AI Reference
//                           </Badge>
//                         </div>
//                         <ScrollArea className="h-[200px]">
//                           <div className="text-xs whitespace-pre-line">{businessProfile}</div>
//                         </ScrollArea>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Right section - Settings & Stats */}
//             <div className="lg:col-span-1">
//               <div className="bg-background-90 rounded-xl p-5 staggeredFadeIn">
//                 <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
//                   <Settings className="h-4 w-4 text-[#768BDD]" />
//                   Response Settings
//                 </h4>

//                 <div className="space-y-4">
//                   <div className="bg-background-80 p-3 rounded-lg">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         <Zap className="h-4 w-4 text-[#768BDD]" />
//                         <span>Response Type</span>
//                       </div>
//                       <Badge className={isAiResponse ? "bg-purple-600" : "bg-[#3352CC]"}>
//                         {isAiResponse ? "AI-Powered" : "Template"}
//                       </Badge>
//                     </div>
//                   </div>

//                   <div className="bg-background-80 p-3 rounded-lg">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         <Clock className="h-4 w-4 text-[#768BDD]" />
//                         <span>Delay</span>
//                       </div>
//                       <span className="font-medium">5 seconds</span>
//                     </div>
//                   </div>

//                   <div className="bg-background-80 p-3 rounded-lg">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         <MessageSquare className="h-4 w-4 text-[#768BDD]" />
//                         <span>Character Count</span>
//                       </div>
//                       <span className="font-medium">{responseText.length}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {isAiResponse && businessProfile && (
//                   <div className="mt-4 bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
//                     <h5 className="text-sm font-medium text-purple-300 flex items-center mb-2">
//                       <Info className="h-4 w-4 mr-2 text-purple-400" />
//                       AI Knowledge Base
//                     </h5>
//                     <p className="text-xs text-purple-200">
//                       Your AI has access to detailed business information to provide accurate and consistent responses
//                       to customer inquiries.
//                     </p>
//                     <div className="mt-2">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="w-full text-xs border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
//                         onClick={() => setShowBusinessProfile(!showBusinessProfile)}
//                       >
//                         <ExternalLink className="h-3 w-3 mr-1.5" />
//                         {showBusinessProfile ? "Hide Details" : "View Details"}
//                       </Button>
//                     </div>
//                   </div>
//                 )}

//                 <div className="mt-6">
//                   <h5 className="text-sm font-medium mb-3">Response Performance</h5>
//                   <div className="bg-background-80 rounded-lg p-3">
//                     <div className="flex items-center justify-between mb-2">
//                       <span className="text-sm text-text-secondary">Engagement Rate</span>
//                       <span className="font-medium">76%</span>
//                     </div>
//                     <div className="w-full bg-background-90 rounded-full h-2">
//                       <div
//                         className="bg-gradient-to-r from-[#3352CC] to-[#768BDD] h-2 rounded-full"
//                         style={{ width: "76%" }}
//                       ></div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-4">
//                   <Button variant="outline" className="w-full">
//                     <Settings className="mr-2 h-4 w-4" />
//                     Configure Response
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {data.data.posts.length > 0 ? <></> : commentTrigger ? <PostButton id={id} theme={theme} /> : <></>}
//         </div>
//       </div>
//     </motion.div>
//   )
// }

// export default ThenNode


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
  ChevronDown,
  ChevronUp,
  Sparkles,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getBusinessProfileDescription } from "@/actions/business"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

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
  const [showAdvanced, setShowAdvanced] = useState(false)

  const isAiResponse = data?.data?.listener?.listener === "SMARTAI"
  const responseText = data?.data?.listener?.prompt || "No response configured"
  const commentReply = data?.data?.listener?.commentReply || null
  const replyVariations = data?.data?.listener?.commentReplyVariations || []

  useEffect(() => {
    const loadBusinessProfile = async () => {
      if (isAiResponse && id) {
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
      className="w-full max-w-7xl relative px-4 sm:px-6 lg:px-8"
    >
      {/* Connector */}
      <div className="absolute h-20 left-1/2 -top-20 flex flex-col items-center z-10">
        <FancyConnector direction="vertical" style="gradient" length={55} color={theme.secondary} />
      </div>

      <div className="bg-gradient-to-r from-background-80 to-background-90 rounded-2xl w-full overflow-hidden shadow-xl border border-background-80/50">
        {/* Top accent bar */}
        <div className="h-2 bg-gradient-to-r from-[#3352CC] via-[#768BDD] to-[#3352CC] w-full shimmerBorder" />

        <div className="p-6 sm:p-8 lg:p-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-8">
            <div className="p-4 bg-background-90 rounded-2xl shrink-0">
              {isAiResponse ? <SmartAi /> : <PlaneBlue />}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h3 className="text-2xl sm:text-3xl font-bold">
                  {isAiResponse ? "AI-Powered Response" : "Automated Message"}
                </h3>
                <Badge className={`text-sm px-3 py-1 ${isAiResponse ? "bg-purple-600" : "bg-[#3352CC]"}`}>
                  {isAiResponse ? "AI" : "Auto"}
                </Badge>
              </div>
              <p className="text-text-secondary text-base sm:text-lg">
                {isAiResponse
                  ? "Using dynamic intelligent replies powered by AI"
                  : "Sending a pre-configured message to your customers"}
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Left section - Response preview */}
            <div className="xl:col-span-2 space-y-6">
              {/* Response Preview Card */}
              <Card className="bg-background-90 border-background-80/50">
                <CardContent className="p-6 lg:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h4 className="text-xl font-semibold flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 text-[#768BDD]" />
                      Response Preview
                    </h4>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="default"
                        onClick={copyToClipboard}
                        className="h-10 bg-transparent"
                      >
                        {copied ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="default" className="h-10 bg-transparent">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>

                  {/* Message Preview */}
                  <div className="bg-background-80 rounded-xl p-6 min-h-[200px]">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-[#3352CC] flex items-center justify-center text-white font-bold text-lg shrink-0">
                        YB
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className="font-semibold text-lg">Your Business</span>
                          <Badge variant="outline" className="bg-background-90/50">
                            Author
                          </Badge>
                        </div>
                        <div className="text-base leading-relaxed whitespace-pre-line">{responseText}</div>
                      </div>
                    </div>
                  </div>

                  {/* Response Stats */}
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-background-80/50 p-4 rounded-xl flex items-center gap-3">
                      <Clock className="h-5 w-5 text-[#768BDD]" />
                      <div>
                        <p className="text-sm text-text-secondary">Response Time</p>
                        <p className="font-semibold">~1.2 seconds</p>
                      </div>
                    </div>
                    <div className="bg-background-80/50 p-4 rounded-xl flex items-center gap-3">
                      <BarChart3 className="h-5 w-5 text-[#768BDD]" />
                      <div>
                        <p className="text-sm text-text-secondary">Character Count</p>
                        <p className="font-semibold">{responseText.length} characters</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Comment Reply Section */}
              {commentReply && (
                <Card className="bg-background-90 border-background-80/50">
                  <CardContent className="p-6 lg:p-8">
                    <h4 className="text-xl font-semibold flex items-center gap-3 mb-4">
                      <MessageSquare className="h-5 w-5 text-green-500" />
                      Public Comment Reply
                    </h4>
                    <div className="bg-background-80 rounded-xl p-5">
                      <p className="text-base leading-relaxed">{commentReply}</p>
                    </div>
                    {replyVariations.length > 0 && (
                      <div className="mt-4">
                        <Badge variant="outline" className="bg-green-500/10 border-green-500/30 text-green-400">
                          <Sparkles className="h-3 w-3 mr-1" />
                          {replyVariations.length} variations available
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Business Profile Section (AI only) */}
              {isAiResponse && businessProfile && (
                <Collapsible open={showBusinessProfile} onOpenChange={setShowBusinessProfile}>
                  <Card className="bg-purple-500/10 border-purple-500/30">
                    <CardContent className="p-6 lg:p-8">
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-900/30 rounded-lg">
                              <FileText className="h-5 w-5 text-purple-400" />
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-purple-300">Business Knowledge Base</h4>
                              <p className="text-sm text-purple-200/70">AI reference for accurate responses</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="bg-purple-900/30 border-purple-500/30 text-purple-300">
                              Active
                            </Badge>
                            {showBusinessProfile ? (
                              <ChevronUp className="h-5 w-5 text-purple-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-purple-400" />
                            )}
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="mt-6 bg-background-90/50 p-5 rounded-xl border border-purple-500/20">
                          <ScrollArea className="h-[250px]">
                            <div className="text-sm whitespace-pre-line text-purple-100/80 leading-relaxed">
                              {businessProfile}
                            </div>
                          </ScrollArea>
                        </div>
                      </CollapsibleContent>
                    </CardContent>
                  </Card>
                </Collapsible>
              )}
            </div>

            {/* Right section - Settings & Stats */}
            <div className="xl:col-span-1">
              <Card className="bg-background-90 border-background-80/50 sticky top-6">
                <CardContent className="p-6 lg:p-8">
                  <h4 className="text-xl font-semibold flex items-center gap-3 mb-6">
                    <Settings className="h-5 w-5 text-[#768BDD]" />
                    Response Settings
                  </h4>

                  <div className="space-y-4">
                    {/* Response Type */}
                    <div className="bg-background-80 p-4 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Zap className="h-5 w-5 text-[#768BDD]" />
                          <span className="font-medium">Response Type</span>
                        </div>
                        <Badge className={isAiResponse ? "bg-purple-600" : "bg-[#3352CC]"}>
                          {isAiResponse ? "AI-Powered" : "Template"}
                        </Badge>
                      </div>
                    </div>

                    {/* Delay */}
                    <div className="bg-background-80 p-4 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-[#768BDD]" />
                          <span className="font-medium">Delay</span>
                        </div>
                        <span className="font-semibold">5 seconds</span>
                      </div>
                    </div>

                    {/* Reply Variations */}
                    {replyVariations.length > 0 && (
                      <div className="bg-background-80 p-4 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Sparkles className="h-5 w-5 text-[#768BDD]" />
                            <span className="font-medium">Reply Variations</span>
                          </div>
                          <span className="font-semibold">{replyVariations.length}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* AI Knowledge Base Card */}
                  {isAiResponse && businessProfile && (
                    <div className="mt-6 bg-purple-500/10 border border-purple-500/30 rounded-xl p-5">
                      <h5 className="font-semibold text-purple-300 flex items-center gap-2 mb-3">
                        <Info className="h-4 w-4 text-purple-400" />
                        AI Knowledge Base
                      </h5>
                      <p className="text-sm text-purple-200/80 mb-4">
                        Your AI has access to detailed business information for accurate responses.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10 bg-transparent"
                        onClick={() => setShowBusinessProfile(!showBusinessProfile)}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {showBusinessProfile ? "Hide Details" : "View Details"}
                      </Button>
                    </div>
                  )}

                  {/* Performance Stats */}
                  <div className="mt-6">
                    <h5 className="font-semibold mb-4">Response Performance</h5>
                    <div className="bg-background-80 rounded-xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-text-secondary">Engagement Rate</span>
                        <span className="font-semibold text-lg">76%</span>
                      </div>
                      <div className="w-full bg-background-90 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-[#3352CC] to-[#768BDD] h-3 rounded-full transition-all duration-500"
                          style={{ width: "76%" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Configure Button */}
                  <div className="mt-6">
                    <Button variant="outline" className="w-full h-12 text-base bg-transparent">
                      <Settings className="mr-2 h-5 w-5" />
                      Configure Response
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Post Button */}
          {data.data.posts.length > 0 ? <></> : commentTrigger ? <PostButton id={id} theme={theme} /> : <></>}
        </div>
      </div>
    </motion.div>
  )
}

export default ThenNode


