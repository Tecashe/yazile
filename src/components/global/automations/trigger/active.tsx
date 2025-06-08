
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

import { AUTOMATION_TRIGGERS, TRIGGER_MODES } from "@/constants/automation-triggers"
import { Badge } from "@/components/ui/badge"
import { Brain, Target, Zap, Clock, Calendar } from "lucide-react"

type Props = {
  type: string
  keywords?: { id: string; word: string }[]
  triggerMode?: string
}

const ActiveTrigger = ({ type, keywords, triggerMode = "KEYWORDS" }: Props) => {
  const trigger = AUTOMATION_TRIGGERS.find((t) => t.type === type)
  const triggerModeData = TRIGGER_MODES.find((t) => t.type === triggerMode)

  const getTriggerModeIcon = () => {
    switch (triggerMode) {
      case "KEYWORDS":
        return <Target className="h-4 w-4 text-blue-500" />
      case "ANY_MESSAGE":
        return <Zap className="h-4 w-4 text-purple-500" />
      case "SMART_AI":
        return <Brain className="h-4 w-4 text-yellow-500" />
      case "SCHEDULED":
        return <Clock className="h-4 w-4 text-green-500" />
      case "EVENT":
        return <Calendar className="h-4 w-4 text-orange-500" />
      default:
        return <Target className="h-4 w-4 text-blue-500" />
    }
  }

  if (!trigger) return null

  return (
    <div className="w-full md:w-6/12 bg-background-80 rounded-xl p-4">
      <div className="flex flex-col gap-3">
        <div className="flex gap-3 items-center">
          <div className="p-2 bg-black/20 rounded-lg">{trigger.icon}</div>
          <div>
            <p className="font-semibold">{trigger.label}</p>
            <p className="text-sm text-text-secondary">{trigger.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className="flex items-center gap-1 bg-background/50">
            {getTriggerModeIcon()}
            <span>{triggerModeData?.label || "Keyword Triggers"}</span>
          </Badge>
        </div>

        {triggerMode === "KEYWORDS" && keywords && keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {keywords.map((k) => (
              <div key={k.id} className="bg-background-90 rounded-full px-3 py-1 text-sm">
                {k.word}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ActiveTrigger

