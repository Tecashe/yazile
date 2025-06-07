
// "use client"

// import { Input } from "@/components/ui/input"
// import { useKeywords } from "@/hooks/use-automations"
// import { useMutationDataState } from "@/hooks/use-mutation-data"
// import { useQueryAutomation } from "@/hooks/user-queries"
// import { X, Tag } from "lucide-react"
// import { motion } from "framer-motion"
// import { KeywordSuggestions } from "../suggestions"
// import { useState } from "react"
// import { ContextCard } from "../context"

// type Props = {
//   id: string
//   theme?: {
//     id: string
//     name: string
//     primary: string
//     secondary: string
//   }
//   animationSpeed?: number
// }

// export const Keywords = ({
//   id,
//   theme = { id: "blue", name: "Blue", primary: "light-blue", secondary: "#768BDD" },
//   animationSpeed = 1,
// }: Props) => {
//   const { onValueChange, keyword, onKeyPress, deleteMutation, addKeyword } = useKeywords(id)
//   const { latestVariable } = useMutationDataState(["add-keyword"])
//   const { data } = useQueryAutomation(id)
//   const [showTip, setShowTip] = useState(true)

//   // Function to handle adding a keyword from suggestions
//   const handleAddKeyword = (newKeyword: string) => {
//     // Call the addKeyword function directly
//     addKeyword(newKeyword)
//   }

//   // Get the first keyword for suggestions, or use a default
//   const getFirstKeyword = () => {
//     if (data?.data?.keywords && data.data.keywords.length > 0) {
//       return data.data.keywords[0].word
//     }
//     return "help" // Default keyword if none exists
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       style={{ transition: `all ${0.3 / animationSpeed}s ease-in-out` }}
//       className="bg-background-80 flex flex-col gap-y-3 p-3 rounded-xl"
//     >
//       <div className="flex items-center justify-between">
//         <div className="flex items-center">
//           <Tag className="h-4 w-4 mr-2 text-light-blue" />
//           <p className="text-sm font-medium">Trigger Keywords</p>
//         </div>
//         {data?.data?.keywords && data?.data?.keywords.length > 0 && (
//           <KeywordSuggestions keyword={getFirstKeyword()} onAddKeyword={handleAddKeyword} />
//         )}
//       </div>

//       {showTip && <ContextCard context="keywords" onClose={() => setShowTip(false)} />}

//       <div className="flex flex-wrap justify-start gap-2 items-center p-2 bg-background-90 rounded-lg min-h-[50px]">
//         {data?.data?.keywords &&
//           data?.data?.keywords.length > 0 &&
//           data?.data?.keywords.map(
//             (word) =>
//               word.id !== latestVariable?.variables?.id && (
//                 <motion.div
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   key={word.id}
//                   style={{ transition: `all ${0.2 / animationSpeed}s ease-in-out` }}
//                   className={`bg-${theme.primary}/20 text-${theme.primary} flex items-center gap-x-2 capitalize py-1 px-4 rounded-full group`}
//                 >
//                   <p>{word.word}</p>
//                   <X className="cursor-pointer hover:text-red-500" onClick={() => deleteMutation({ id: word.id })} />
//                 </motion.div>
//               ),
//           )}

//         {latestVariable && latestVariable.status === "pending" && (
//           <div
//             className={`bg-${theme.primary}/20 text-${theme.primary} flex items-center gap-x-2 capitalize py-1 px-4 rounded-full`}
//           >
//             {latestVariable.variables.keyword}
//           </div>
//         )}

//         <Input
//           placeholder="Add a keyword..."
//           style={{
//             width: Math.min(Math.max(keyword.length || 10, 2), 50) + "ch",
//           }}
//           value={keyword}
//           className="p-0 bg-transparent ring-0 border-none outline-none"
//           onChange={onValueChange}
//           onKeyUp={onKeyPress}
//         />
//       </div>

//       <div className="text-xs text-text-secondary flex items-center">
//         <span className="bg-light-blue/20 text-light-blue rounded-full w-4 h-4 inline-flex items-center justify-center mr-1 text-[10px]">
//           i
//         </span>
//         Press Enter to add each keyword. Add 3-5 keywords for best results.
//       </div>
//     </motion.div>
//   )
// }

// export default Keywords

"use client"

import { Input } from "@/components/ui/input"
import { useKeywords } from "@/hooks/use-automations"
import { useMutationDataState } from "@/hooks/use-mutation-data"
import { useQueryAutomation } from "@/hooks/user-queries"
import { X, Tag, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { KeywordSuggestions } from "../suggestions"
import { useState } from "react"
import { ContextCard } from "../context"
import { Badge } from "@/components/ui/badge"

type Props = {
  id: string
  theme?: {
    id: string
    name: string
    primary: string
    secondary: string
  }
  animationSpeed?: number
  triggerType?: "KEYWORDS" | "ANY_MESSAGE" | "SMART_AI"
}

export const Keywords = ({
  id,
  theme = { id: "blue", name: "Blue", primary: "light-blue", secondary: "#768BDD" },
  animationSpeed = 1,
  triggerType = "KEYWORDS",
}: Props) => {
  const { onValueChange, keyword, onKeyPress, deleteMutation, addKeyword } = useKeywords(id)
  const { latestVariable } = useMutationDataState(["add-keyword"])
  const { data } = useQueryAutomation(id)
  const [showTip, setShowTip] = useState(true)

  const handleAddKeyword = (newKeyword: string) => {
    addKeyword(newKeyword)
  }

  const getFirstKeyword = () => {
    if (data?.data?.keywords && data.data.keywords.length > 0) {
      return data.data.keywords[0].word
    }
    return "help"
  }

  // Render different UI based on trigger type
  if (triggerType === "ANY_MESSAGE") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ transition: `all ${0.3 / animationSpeed}s ease-in-out` }}
        className="bg-background-80 flex flex-col gap-y-3 p-3 rounded-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Sparkles className="h-4 w-4 mr-2 text-purple-400" />
            <p className="text-sm font-medium">Any Message Trigger</p>
          </div>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Universal</Badge>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse"></div>
            <p className="text-sm font-medium text-green-400">Active - Responds to ALL messages</p>
          </div>

          <p className="text-sm text-text-secondary mb-3">
            This automation will trigger for any message or comment received, regardless of content.
          </p>

          <div className="bg-background-90/50 p-3 rounded-lg">
            <h4 className="text-xs font-medium text-purple-400 mb-2">TRIGGER CONDITIONS:</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>
                <span>Any direct message</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>
                <span>Any comment on posts</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>
                <span>Any story mention</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-text-secondary flex items-center">
          <span className="bg-purple-400/20 text-purple-400 rounded-full w-4 h-4 inline-flex items-center justify-center mr-1 text-[10px]">
            ⚡
          </span>
          Perfect for customer service or general inquiries. High response volume expected.
        </div>
      </motion.div>
    )
  }

  if (triggerType === "SMART_AI") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ transition: `all ${0.3 / animationSpeed}s ease-in-out` }}
        className="bg-background-80 flex flex-col gap-y-3 p-3 rounded-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Sparkles className="h-4 w-4 mr-2 text-yellow-400" />
            <p className="text-sm font-medium">Smart AI Trigger</p>
          </div>
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">AI Powered</Badge>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-3 w-3 rounded-full bg-yellow-400 animate-pulse"></div>
            <p className="text-sm font-medium text-yellow-400">AI analyzes message intent</p>
          </div>

          <p className="text-sm text-text-secondary mb-3">
            AI determines if the message requires a response based on context, sentiment, and intent.
          </p>

          <div className="bg-background-90/50 p-3 rounded-lg">
            <h4 className="text-xs font-medium text-yellow-400 mb-2">AI ANALYSIS:</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>
                <span>Questions & inquiries</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>
                <span>Support requests</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="h-1.5 w-1.5 rounded-full bg-red-400"></div>
                <span>Spam & irrelevant messages</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-text-secondary flex items-center">
          <span className="bg-yellow-400/20 text-yellow-400 rounded-full w-4 h-4 inline-flex items-center justify-center mr-1 text-[10px]">
            🤖
          </span>
          Intelligent filtering reduces noise while capturing genuine inquiries.
        </div>
      </motion.div>
    )
  }

  // Default KEYWORDS trigger type
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ transition: `all ${0.3 / animationSpeed}s ease-in-out` }}
      className="bg-background-80 flex flex-col gap-y-3 p-3 rounded-xl"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Tag className="h-4 w-4 mr-2 text-light-blue" />
          <p className="text-sm font-medium">Trigger Keywords</p>
        </div>
        {data?.data?.keywords && data?.data?.keywords.length > 0 && (
          <KeywordSuggestions keyword={getFirstKeyword()} onAddKeyword={handleAddKeyword} />
        )}
      </div>

      {showTip && <ContextCard context="keywords" onClose={() => setShowTip(false)} />}

      <div className="flex flex-wrap justify-start gap-2 items-center p-2 bg-background-90 rounded-lg min-h-[50px]">
        {data?.data?.keywords &&
          data?.data?.keywords.length > 0 &&
          data?.data?.keywords.map(
            (word) =>
              word.id !== latestVariable?.variables?.id && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={word.id}
                  style={{ transition: `all ${0.2 / animationSpeed}s ease-in-out` }}
                  className={`bg-${theme.primary}/20 text-${theme.primary} flex items-center gap-x-2 capitalize py-1 px-4 rounded-full group`}
                >
                  <p>{word.word}</p>
                  <X className="cursor-pointer hover:text-red-500" onClick={() => deleteMutation({ id: word.id })} />
                </motion.div>
              ),
          )}

        {latestVariable && latestVariable.status === "pending" && (
          <div
            className={`bg-${theme.primary}/20 text-${theme.primary} flex items-center gap-x-2 capitalize py-1 px-4 rounded-full`}
          >
            {latestVariable.variables.keyword}
          </div>
        )}

        <Input
          placeholder="Add a keyword..."
          style={{
            width: Math.min(Math.max(keyword.length || 10, 2), 50) + "ch",
          }}
          value={keyword}
          className="p-0 bg-transparent ring-0 border-none outline-none"
          onChange={onValueChange}
          onKeyUp={onKeyPress}
        />
      </div>

      <div className="text-xs text-text-secondary flex items-center">
        <span className="bg-light-blue/20 text-light-blue rounded-full w-4 h-4 inline-flex items-center justify-center mr-1 text-[10px]">
          i
        </span>
        Press Enter to add each keyword. Add 3-5 keywords for best results.
      </div>
    </motion.div>
  )
}

export default Keywords
