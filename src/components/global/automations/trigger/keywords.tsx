
"use client"

import { Input } from "@/components/ui/input"
import { useKeywords } from "@/hooks/use-automations"
import { useMutationDataState } from "@/hooks/use-mutation-data"
import { useQueryAutomation } from "@/hooks/user-queries"
import { X, Tag } from "lucide-react"
import { motion } from "framer-motion"
import { KeywordSuggestions } from "../suggestions"
import { useState } from "react"
import { ContextCard } from "../context"

type Props = {
  id: string
  theme?: {
    id: string
    name: string
    primary: string
    secondary: string
  }
  animationSpeed?: number
}

export const Keywords = ({
  id,
  theme = { id: "blue", name: "Blue", primary: "light-blue", secondary: "#768BDD" },
  animationSpeed = 1,
}: Props) => {
  const { onValueChange, keyword, onKeyPress, deleteMutation, addKeyword } = useKeywords(id)
  const { latestVariable } = useMutationDataState(["add-keyword"])
  const { data } = useQueryAutomation(id)
  const [showTip, setShowTip] = useState(true)

  // Function to handle adding a keyword from suggestions
  const handleAddKeyword = (newKeyword: string) => {
    // Call the addKeyword function directly
    addKeyword(newKeyword)
  }

  // Get the first keyword for suggestions, or use a default
  const getFirstKeyword = () => {
    if (data?.data?.keywords && data.data.keywords.length > 0) {
      return data.data.keywords[0].word
    }
    return "help" // Default keyword if none exists
  }

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
