"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Tag, Lightbulb, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useKeywords } from "@/hooks/use-automations"
import { useMutationDataState } from "@/hooks/use-mutation-data"
import { useQueryAutomation } from "@/hooks/user-queries"

type Props = {
  id: string // Add automation ID prop
  trigger?: React.ReactNode
}

export const KeywordsPopup = ({ id, trigger }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [newKeyword, setNewKeyword] = useState("")
  
  // Use the same hooks as the Keywords component
  const { onValueChange, keyword, onKeyPress, deleteMutation, addKeyword } = useKeywords(id)
  const { latestVariable } = useMutationDataState(["add-keyword"])
  const { data } = useQueryAutomation(id)

  // Update the input value when keyword changes from the hook
  useEffect(() => {
    setNewKeyword(keyword)
  }, [keyword])

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      // Use the same addKeyword function from the hook
      addKeyword(newKeyword.trim().toLowerCase())
      setNewKeyword("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddKeyword()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewKeyword(e.target.value)
    // Also call the hook's onChange to keep it in sync
    onValueChange(e)
  }

  const addSuggestedKeyword = (suggestedKeyword: string) => {
    // Check if keyword already exists
    const existingKeywords = data?.data?.keywords?.map(k => k.word.toLowerCase()) || []
    if (!existingKeywords.includes(suggestedKeyword.toLowerCase())) {
      addKeyword(suggestedKeyword.toLowerCase())
    }
  }

  const clearAllKeywords = () => {
    // Delete all existing keywords
    if (data?.data?.keywords) {
      data.data.keywords.forEach(keyword => {
        deleteMutation({ id: keyword.id })
      })
    }
  }

  const suggestedKeywords = [
    "help",
    "support",
    "pricing",
    "info",
    "buy",
    "order",
    "contact",
    "demo",
    "trial",
    "discount",
    "sale",
  ]

  // Get existing keywords for filtering suggestions
  const existingKeywords = data?.data?.keywords?.map(k => k.word.toLowerCase()) || []

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2 bg-transparent">
            <Plus className="h-4 w-4" />
            Add Keywords
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-blue-500" />
            Manage Trigger Keywords
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add new keyword */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={newKeyword}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Enter a keyword..."
                className="flex-1"
              />
              <Button onClick={handleAddKeyword} disabled={!newKeyword.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Alert className="bg-blue-500/10 border-blue-500/30">
              <Lightbulb className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-400">
                Add 3-5 keywords that customers might use. Keep them simple and relevant to your business.
              </AlertDescription>
            </Alert>
          </div>

          {/* Current keywords */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">
              Your Keywords ({data?.data?.keywords?.length || 0})
            </h4>
            <div className="flex flex-wrap gap-2 min-h-[60px] p-3 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/20">
              <AnimatePresence>
                {data?.data?.keywords &&
                  data.data.keywords.map((keywordObj) => (
                    <motion.div
                      key={keywordObj.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-1"
                    >
                      <Badge variant="secondary" className="gap-1 pr-1">
                        {keywordObj.word}
                        <button
                          onClick={() => deleteMutation({ id: keywordObj.id })}
                          className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    </motion.div>
                  ))}

                {/* Show pending keyword */}
                {latestVariable && latestVariable.status === "pending" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1"
                  >
                    <Badge variant="secondary" className="gap-1 pr-1 opacity-60">
                      {latestVariable.variables.keyword}
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {(!data?.data?.keywords || data.data.keywords.length === 0) && 
               (!latestVariable || latestVariable.status !== "pending") && (
                <p className="text-muted-foreground text-sm">No keywords added yet</p>
              )}
            </div>
          </div>

          {/* Suggested keywords */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              Suggested Keywords
            </h4>
            <div className="flex flex-wrap gap-2">
              {suggestedKeywords
                .filter((keyword) => !existingKeywords.includes(keyword.toLowerCase()))
                .map((keyword) => (
                  <Button
                    key={keyword}
                    variant="outline"
                    size="sm"
                    onClick={() => addSuggestedKeyword(keyword)}
                    className="text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {keyword}
                  </Button>
                ))}
            </div>
            {suggestedKeywords.filter((keyword) => !existingKeywords.includes(keyword.toLowerCase())).length === 0 && (
              <p className="text-muted-foreground text-xs">All suggested keywords have been added</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={clearAllKeywords}
              disabled={!data?.data?.keywords || data.data.keywords.length === 0}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear All
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}