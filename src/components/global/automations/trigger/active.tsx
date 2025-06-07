
// "use client"
// import { InstagramBlue, PlaneBlue } from "@/icons"
// import { motion } from "framer-motion"
// import { Badge } from "@/components/ui/badge"
// import { Clock, Calendar, Users } from "lucide-react"

// type Props = {
//   type: string
//   keywords: {
//     id: string
//     word: string
//     automationId: string | null
//   }[]
//   theme?: {
//     id: string
//     name: string
//     primary: string
//     secondary: string
//   }
// }

// const ActiveTrigger = ({
//   keywords,
//   type,
//   theme = { id: "blue", name: "Blue", primary: "light-blue", secondary: "#768BDD" },
// }: Props) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="w-full max-w-5xl px-4 sm:px-0"
//     >
//       <div className="bg-gradient-to-r from-background-80 to-background-90 rounded-xl w-full overflow-hidden shadow-lg border border-background-80/50">
//         {/* Top accent bar */}
//         <div className="h-1.5 bg-gradient-to-r from-[#3352CC] via-[#768BDD] to-[#3352CC] w-full shimmerBorder" />

//         <div className="p-4 sm:p-6">
//           <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
//             {/* Left section - Trigger info */}
//             <div className="md:w-1/3">
//               <div className="flex items-start gap-4">
//                 <div className="p-3 bg-background-90 rounded-xl">
//                   {type === "COMMENT" ? <InstagramBlue/> : <PlaneBlue />}
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-bold">{type === "COMMENT" ? "Instagram Comment" : "Direct Message"}</h3>
//                   <p className="text-text-secondary mt-1">
//                     {type === "COMMENT"
//                       ? "Triggers when someone comments on your post"
//                       : "Triggers when someone sends you a direct message"}
//                   </p>

//                   <div className="flex items-center gap-2 mt-3">
//                     <Badge variant="outline" className="bg-background-90/50 text-xs flex items-center gap-1">
//                       <Clock className="h-3 w-3" />
//                       Response
//                     </Badge>
//                     <Badge variant="outline" className="bg-background-90/50 text-xs flex items-center gap-1">
//                       <Users className="h-3 w-3" />
//                       {type === "COMMENT" ? "Private" : "Private"}
//                     </Badge>
//                   </div>
//                 </div>
//               </div>

//             </div>

//             {/* Right section - Keywords */}
//             <div className="md:w-2/3 md:border-l md:border-background-80/50 md:pl-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h4 className="text-lg font-medium">Trigger Keywords</h4>
//                 <Badge className="bg-[#3352CC]">{keywords.length} Keywords</Badge>
//               </div>

//               <div className="bg-background-90 p-4 rounded-xl staggeredFadeIn">
//                 <div className="flex flex-wrap gap-2 sm:gap-3">
//                   {keywords.map((word) => (
//                     <motion.div
//                       whileHover={{ scale: 1.05 }}
//                       key={word.id}
//                       className="bg-gradient-to-br from-[#3352CC]/20 to-[#1C2D70]/20 border border-[#3352CC]/30 flex items-center gap-x-2 capitalize text-white font-medium py-2 px-4 rounded-full"
//                     >
//                       <p>{word.word}</p>
//                     </motion.div>
//                   ))}
//                 </div>

//                 <div className="mt-4 bg-background-80/50 p-3 rounded-lg">
//                   <div className="flex items-center gap-2">
//                     <Calendar className="h-4 w-4 text-[#768BDD]" />
//                     <p className="text-sm text-text-secondary">
//                       This automation will trigger when someone uses these keywords in a
//                       {type === "COMMENT" ? " comment on your post" : " direct message to you"}.
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Activity timeline */}
//               <div className="mt-4">
//                 <h5 className="text-sm font-medium mb-2">Note</h5>
//                 <div className="space-y-2">
//                   <div className="flex items-center gap-2 text-xs text-text-secondary">
//                     <div className="h-2 w-2 rounded-full bg-green-500"></div>
//                     <span>The messages will be sent to their dms</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-xs text-text-secondary">
//                     <div className="h-2 w-2 rounded-full bg-green-500"></div>
//                     <span>The responses will be in the language of the client</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   )
// }

// export default ActiveTrigger

"use client"
import { InstagramBlue, PlaneBlue } from "@/icons"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, Users, Sparkles, Zap, Brain } from "lucide-react"

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
  triggerMode?: "KEYWORDS" | "ANY_MESSAGE" | "SMART_AI"
}

const ActiveTrigger = ({
  keywords,
  type,
  theme = { id: "blue", name: "Blue", primary: "light-blue", secondary: "#768BDD" },
  triggerMode = "KEYWORDS",
}: Props) => {
  const getTriggerConfig = () => {
    switch (triggerMode) {
      case "ANY_MESSAGE":
        return {
          title: "Universal Trigger",
          description: "Responds to any message or comment",
          icon: <Zap className="h-5 w-5" />,
          color: "purple",
          gradient: "from-purple-500/20 to-blue-500/20",
          border: "border-purple-500/30",
        }
      case "SMART_AI":
        return {
          title: "AI Smart Trigger",
          description: "AI analyzes message intent and relevance",
          icon: <Brain className="h-5 w-5" />,
          color: "yellow",
          gradient: "from-yellow-500/20 to-orange-500/20",
          border: "border-yellow-500/30",
        }
      default:
        return {
          title: "Keyword Trigger",
          description: "Responds to specific keywords",
          icon: <Sparkles className="h-5 w-5" />,
          color: "blue",
          gradient: "from-[#3352CC]/20 to-[#1C2D70]/20",
          border: "border-[#3352CC]/30",
        }
    }
  }

  const triggerConfig = getTriggerConfig()

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
          <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
            {/* Left section - Trigger info */}
            <div className="md:w-1/3">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-background-90 rounded-xl">
                  {type === "COMMENT" ? <InstagramBlue /> : <PlaneBlue />}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{type === "COMMENT" ? "Instagram Comment" : "Direct Message"}</h3>
                  <p className="text-text-secondary mt-1">
                    {type === "COMMENT"
                      ? "Triggers when someone comments on your post"
                      : "Triggers when someone sends you a direct message"}
                  </p>

                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="outline" className="bg-background-90/50 text-xs flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Response
                    </Badge>
                    <Badge variant="outline" className="bg-background-90/50 text-xs flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Private
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`bg-${triggerConfig.color}-500/20 text-${triggerConfig.color}-400 border-${triggerConfig.color}-500/30 text-xs flex items-center gap-1`}
                    >
                      {triggerConfig.icon}
                      {triggerConfig.title}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Right section - Trigger Configuration */}
            <div className="md:w-2/3 md:border-l md:border-background-80/50 md:pl-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium">Trigger Configuration</h4>
                <Badge className="bg-[#3352CC]">
                  {triggerMode === "KEYWORDS" ? `${keywords.length} Keywords` : triggerConfig.title}
                </Badge>
              </div>

              <div className="bg-background-90 p-4 rounded-xl staggeredFadeIn">
                {triggerMode === "KEYWORDS" && (
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {keywords.map((word) => (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        key={word.id}
                        className="bg-gradient-to-br from-[#3352CC]/20 to-[#1C2D70]/20 border border-[#3352CC]/30 flex items-center gap-x-2 capitalize text-white font-medium py-2 px-4 rounded-full"
                      >
                        <p>{word.word}</p>
                      </motion.div>
                    ))}
                  </div>
                )}

                {triggerMode === "ANY_MESSAGE" && (
                  <div
                    className={`bg-gradient-to-br ${triggerConfig.gradient} ${triggerConfig.border} border rounded-lg p-4`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse"></div>
                      <p className="text-sm font-medium text-green-400">Universal Response Active</p>
                    </div>
                    <p className="text-sm text-text-secondary">
                      This automation responds to ALL incoming messages and comments automatically.
                    </p>
                  </div>
                )}

                {triggerMode === "SMART_AI" && (
                  <div
                    className={`bg-gradient-to-br ${triggerConfig.gradient} ${triggerConfig.border} border rounded-lg p-4`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-3 w-3 rounded-full bg-yellow-400 animate-pulse"></div>
                      <p className="text-sm font-medium text-yellow-400">AI Analysis Active</p>
                    </div>
                    <p className="text-sm text-text-secondary">
                      AI analyzes message intent, sentiment, and context to determine appropriate responses.
                    </p>
                  </div>
                )}

                <div className="mt-4 bg-background-80/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#768BDD]" />
                    <p className="text-sm text-text-secondary">
                      {triggerMode === "KEYWORDS" &&
                        `This automation will trigger when someone uses these keywords in a ${type === "COMMENT" ? "comment on your post" : "direct message to you"}.`}
                      {triggerMode === "ANY_MESSAGE" &&
                        `This automation will trigger for every ${type === "COMMENT" ? "comment on your posts" : "direct message you receive"}.`}
                      {triggerMode === "SMART_AI" &&
                        `AI will analyze each ${type === "COMMENT" ? "comment" : "message"} and respond only when it detects genuine inquiries or relevant content.`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Activity timeline */}
              <div className="mt-4">
                <h5 className="text-sm font-medium mb-2">Response Behavior</h5>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>Messages sent to recipient&apos;s DMs</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>Responses in recipient&apos;s language</span>
                  </div>
                  {triggerMode === "SMART_AI" && (
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                      <span>AI filters spam and irrelevant messages</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ActiveTrigger
