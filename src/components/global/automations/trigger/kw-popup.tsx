"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Tag, Lightbulb, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Alert, AlertDescription } from "@/components/ui/alert"

type Props = {
  keywords: string[]
  onAddKeywords: (keywords: string[]) => void
  trigger?: React.ReactNode
}

export const KeywordsPopup = ({ keywords, onAddKeywords, trigger }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [newKeyword, setNewKeyword] = useState("")
  const [tempKeywords, setTempKeywords] = useState<string[]>(keywords)

  const addKeyword = () => {
    if (newKeyword.trim() && !tempKeywords.includes(newKeyword.trim().toLowerCase())) {
      setTempKeywords([...tempKeywords, newKeyword.trim().toLowerCase()])
      setNewKeyword("")
    }
  }

  const removeKeyword = (index: number) => {
    const updated = [...tempKeywords]
    updated.splice(index, 1)
    setTempKeywords(updated)
  }

  const handleSave = () => {
    onAddKeywords(tempKeywords)
    setIsOpen(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addKeyword()
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
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter a keyword..."
                className="flex-1"
              />
              <Button onClick={addKeyword} disabled={!newKeyword.trim()}>
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
            <h4 className="font-medium text-foreground">Your Keywords ({tempKeywords.length})</h4>
            <div className="flex flex-wrap gap-2 min-h-[60px] p-3 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/20">
              <AnimatePresence>
                {tempKeywords.map((keyword, index) => (
                  <motion.div
                    key={keyword}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1"
                  >
                    <Badge variant="secondary" className="gap-1 pr-1">
                      {keyword}
                      <button
                        onClick={() => removeKeyword(index)}
                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  </motion.div>
                ))}
              </AnimatePresence>
              {tempKeywords.length === 0 && <p className="text-muted-foreground text-sm">No keywords added yet</p>}
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
                .filter((keyword) => !tempKeywords.includes(keyword))
                .map((keyword) => (
                  <Button
                    key={keyword}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (!tempKeywords.includes(keyword)) {
                        setTempKeywords([...tempKeywords, keyword])
                      }
                    }}
                    className="text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {keyword}
                  </Button>
                ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setTempKeywords([])}
              disabled={tempKeywords.length === 0}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear All
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Keywords ({tempKeywords.length})</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
