
"use client"
import { InstagramBlue, PlaneBlue } from "@/icons"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, Users } from "lucide-react"

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
}

const ActiveTrigger = ({
  keywords,
  type,
  theme = { id: "blue", name: "Blue", primary: "light-blue", secondary: "#768BDD" },
}: Props) => {
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
                  {type === "COMMENT" ? <InstagramBlue/> : <PlaneBlue />}
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
                      {type === "COMMENT" ? "Private" : "Private"}
                    </Badge>
                  </div>
                </div>
              </div>

            </div>

            {/* Right section - Keywords */}
            <div className="md:w-2/3 md:border-l md:border-background-80/50 md:pl-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium">Trigger Keywords</h4>
                <Badge className="bg-[#3352CC]">{keywords.length} Keywords</Badge>
              </div>

              <div className="bg-background-90 p-4 rounded-xl staggeredFadeIn">
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

                <div className="mt-4 bg-background-80/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#768BDD]" />
                    <p className="text-sm text-text-secondary">
                      This automation will trigger when someone uses these keywords in a
                      {type === "COMMENT" ? " comment on your post" : " direct message to you"}.
                    </p>
                  </div>
                </div>
              </div>

              {/* Activity timeline */}
              <div className="mt-4">
                <h5 className="text-sm font-medium mb-2">Note</h5>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>The messages will be sent to their dms</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>The responses will be in the language of the client</span>
                  </div>
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



// "use client"
// import { AUTOMATION_TRIGGERS, TRIGGER_MODES } from "@/constants/automation-triggers"
// import { motion } from "framer-motion"
// import { Badge } from "@/components/ui/badge"
// import { Brain, Target, Zap, Clock, Calendar, Users } from "lucide-react"

// type Props = {
//   type: string
//   keywords?: { id: string; word: string }[]
//   triggerMode?: string
//   theme?: {
//     id: string
//     name: string
//     primary: string
//     secondary: string
//   }
// }

// const ActiveTrigger = ({ 
//   type, 
//   keywords, 
//   triggerMode = "KEYWORDS",
//   theme = { id: "blue", name: "Blue", primary: "light-blue", secondary: "#768BDD" }
// }: Props) => {
//   const trigger = AUTOMATION_TRIGGERS.find((t) => t.type === type)
//   const triggerModeData = TRIGGER_MODES.find((t) => t.type === triggerMode)

//   const getTriggerModeIcon = () => {
//     switch (triggerMode) {
//       case "KEYWORDS":
//         return <Target className="h-4 w-4 text-blue-500" />
//       case "ANY_MESSAGE":
//         return <Zap className="h-4 w-4 text-purple-500" />
//       case "SMART_AI":
//         return <Brain className="h-4 w-4 text-yellow-500" />
//       case "SCHEDULED":
//         return <Clock className="h-4 w-4 text-green-500" />
//       case "EVENT":
//         return <Calendar className="h-4 w-4 text-orange-500" />
//       default:
//         return <Target className="h-4 w-4 text-blue-500" />
//     }
//   }

//   const getTriggerModeColor = () => {
//     switch (triggerMode) {
//       case "KEYWORDS":
//         return "text-blue-500 bg-blue-500/10 border-blue-500/20"
//       case "ANY_MESSAGE":
//         return "text-purple-500 bg-purple-500/10 border-purple-500/20"
//       case "SMART_AI":
//         return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"
//       case "SCHEDULED":
//         return "text-green-500 bg-green-500/10 border-green-500/20"
//       case "EVENT":
//         return "text-orange-500 bg-orange-500/10 border-orange-500/20"
//       default:
//         return "text-blue-500 bg-blue-500/10 border-blue-500/20"
//     }
//   }

//   if (!trigger) return null

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
//           <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
//             {/* Left section - Trigger info */}
//             <div className="lg:w-1/3">
//               <div className="flex items-start gap-4">
//                 <div className="p-3 bg-background-90 rounded-xl shadow-sm">
//                   {trigger.icon}
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="text-xl font-bold text-white">{trigger.label}</h3>
//                   <p className="text-text-secondary mt-1 text-sm leading-relaxed">
//                     {trigger.description}
//                   </p>

//                   <div className="flex items-center gap-2 mt-4">
//                     <Badge 
//                       variant="outline" 
//                       className={`text-xs flex items-center gap-1.5 px-3 py-1 ${getTriggerModeColor()}`}
//                     >
//                       {getTriggerModeIcon()}
//                       <span>{triggerModeData?.label || "Keyword Triggers"}</span>
//                     </Badge>
//                     <Badge variant="outline" className="bg-background-90/50 text-xs flex items-center gap-1.5 px-3 py-1">
//                       <Users className="h-3 w-3" />
//                       Private
//                     </Badge>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Right section - Keywords and details */}
//             <div className="lg:w-2/3 lg:border-l lg:border-background-80/50 lg:pl-6">
//               {triggerMode === "KEYWORDS" && keywords && keywords.length > 0 && (
//                 <div className="mb-6">
//                   <div className="flex items-center justify-between mb-4">
//                     <h4 className="text-lg font-medium text-white">Trigger Keywords</h4>
//                     <Badge className="bg-[#3352CC] hover:bg-[#3352CC]/90 text-white">
//                       {keywords.length} Keywords
//                     </Badge>
//                   </div>

//                   <div className="bg-background-90 p-4 rounded-xl">
//                     <div className="flex flex-wrap gap-2 sm:gap-3">
//                       {keywords.map((word, index) => (
//                         <motion.div
//                           initial={{ opacity: 0, scale: 0.8 }}
//                           animate={{ opacity: 1, scale: 1 }}
//                           transition={{ delay: index * 0.1 }}
//                           whileHover={{ scale: 1.05 }}
//                           key={word.id}
//                           className="bg-gradient-to-br from-[#3352CC]/20 to-[#1C2D70]/20 border border-[#3352CC]/30 flex items-center gap-x-2 capitalize text-white font-medium py-2 px-4 rounded-full hover:from-[#3352CC]/30 hover:to-[#1C2D70]/30 transition-all duration-200"
//                         >
//                           <p className="text-sm">{word.word}</p>
//                         </motion.div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Trigger mode specific content */}
//               {triggerMode !== "KEYWORDS" && (
//                 <div className="mb-6">
//                   <div className="flex items-center justify-between mb-4">
//                     <h4 className="text-lg font-medium text-white">Trigger Configuration</h4>
//                   </div>
                  
//                   <div className="bg-background-90 p-4 rounded-xl">
//                     <div className="flex items-center gap-3">
//                       <div className={`p-2 rounded-lg ${getTriggerModeColor()}`}>
//                         {getTriggerModeIcon()}
//                       </div>
//                       <div>
//                         <p className="font-medium text-white">{triggerModeData?.label}</p>
//                         <p className="text-sm text-text-secondary mt-1">
//                           {triggerMode === "ANY_MESSAGE" && "Responds to any incoming message"}
//                           {triggerMode === "SMART_AI" && "AI analyzes message context and intent"}
//                           {triggerMode === "SCHEDULED" && "Triggers at specified times"}
//                           {triggerMode === "EVENT" && "Triggers based on specific events"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Information section */}
//               <div className="bg-background-80/50 p-4 rounded-xl">
//                 <div className="flex items-start gap-3">
//                   <Calendar className="h-5 w-5 text-[#768BDD] mt-0.5 flex-shrink-0" />
//                   <div>
//                     <p className="text-sm text-text-secondary leading-relaxed">
//                       This automation will trigger when someone 
//                       {triggerMode === "KEYWORDS" && " uses these keywords in a"}
//                       {triggerMode === "ANY_MESSAGE" && " sends any"}
//                       {triggerMode === "SMART_AI" && " sends a contextually relevant"}
//                       {triggerMode === "SCHEDULED" && " at the scheduled time for a"}
//                       {triggerMode === "EVENT" && " when the specified event occurs for a"}
//                       {type === "COMMENT" ? " comment on your post" : " direct message to you"}.
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Activity notes */}
//               <div className="mt-4">
//                 <h5 className="text-sm font-medium mb-3 text-white">Important Notes</h5>
//                 <div className="space-y-2">
//                   <div className="flex items-center gap-3 text-xs text-text-secondary">
//                     <div className="h-2 w-2 rounded-full bg-green-500 flex-shrink-0"></div>
//                     <span>Messages will be sent to their direct messages</span>
//                   </div>
//                   <div className="flex items-center gap-3 text-xs text-text-secondary">
//                     <div className="h-2 w-2 rounded-full bg-green-500 flex-shrink-0"></div>
//                     <span>Responses will be in the language of the client</span>
//                   </div>
//                   <div className="flex items-center gap-3 text-xs text-text-secondary">
//                     <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0"></div>
//                     <span>All interactions are processed privately and securely</span>
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