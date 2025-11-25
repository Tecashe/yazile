// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Loader2, Sparkles, RefreshCw, Check, X, Edit2, Trash2 } from "lucide-react"
// import { motion, AnimatePresence } from "framer-motion"
// import { toast } from "@/hooks/use-toast"

// interface ReplyVariationsManagerProps {
//   value?: string[]
//   onChange: (variations: string[]) => void
//   baseReply: string
//   onBaseReplyChange: (reply: string) => void
// }

// export function ReplyVariationsManager({
//   value = [],
//   onChange,
//   baseReply,
//   onBaseReplyChange,
// }: ReplyVariationsManagerProps) {
//   const [variations, setVariations] = useState<string[]>(value)
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [editingIndex, setEditingIndex] = useState<number | null>(null)
//   const [editText, setEditText] = useState("")
//   const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null)

//   const generateVariations = async () => {
//     if (!baseReply.trim()) {
//       toast({
//         title: "Base reply required",
//         description: "Please enter a base comment reply first",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsGenerating(true)
//     try {
//       const response = await fetch("/api/generate-reply-variations", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ baseReply, count: 8 }),
//       })

//       if (!response.ok) throw new Error("Failed to generate variations")

//       const data = await response.json()
//       setVariations(data.variations)
//       onChange(data.variations)

//       toast({
//         title: "Variations generated!",
//         description: `${data.variations.length} unique comment replies created`,
//       })
//     } catch (error) {
//       console.error("Error generating variations:", error)
//       toast({
//         title: "Generation failed",
//         description: "Could not generate variations. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   const regenerateSingle = async (index: number) => {
//     if (!baseReply.trim()) return

//     setRegeneratingIndex(index)
//     try {
//       const response = await fetch("/api/generate-reply-variations", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ baseReply, count: 1 }),
//       })

//       if (!response.ok) throw new Error("Failed to regenerate")

//       const data = await response.json()
//       const newVariations = [...variations]
//       newVariations[index] = data.variations[0]
//       setVariations(newVariations)
//       onChange(newVariations)

//       toast({
//         title: "Variation regenerated!",
//         description: "New reply created successfully",
//       })
//     } catch (error) {
//       console.error("Error regenerating variation:", error)
//       toast({
//         title: "Regeneration failed",
//         description: "Could not regenerate variation. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setRegeneratingIndex(null)
//     }
//   }

//   const startEdit = (index: number) => {
//     setEditingIndex(index)
//     setEditText(variations[index])
//   }

//   const saveEdit = () => {
//     if (editingIndex === null) return

//     const newVariations = [...variations]
//     newVariations[editingIndex] = editText.trim()
//     setVariations(newVariations)
//     onChange(newVariations)
//     setEditingIndex(null)
//     setEditText("")

//     toast({
//       title: "Variation updated",
//       description: "Your changes have been saved",
//     })
//   }

//   const cancelEdit = () => {
//     setEditingIndex(null)
//     setEditText("")
//   }

//   const deleteVariation = (index: number) => {
//     const newVariations = variations.filter((_, i) => i !== index)
//     setVariations(newVariations)
//     onChange(newVariations)

//     toast({
//       title: "Variation deleted",
//       description: "Reply removed from the list",
//     })
//   }

//   return (
//     <div className="space-y-4">
//       {/* Base Reply Input */}
//       <div className="space-y-2">
//         <Label htmlFor="baseReply" className="flex items-center gap-2">
//           Base Comment Reply
//           <Badge variant="secondary" className="text-xs">
//             Required
//           </Badge>
//         </Label>
//         <Textarea
//           id="baseReply"
//           value={baseReply}
//           onChange={(e) => onBaseReplyChange(e.target.value)}
//           placeholder="e.g., Check your DMs for more info!"
//           className="min-h-[80px] resize-none"
//           maxLength={200}
//         />
//         <div className="flex items-center justify-between">
//           <p className="text-xs text-muted-foreground">
//             This is your base message. AI will create natural variations of it.
//           </p>
//           <span className="text-xs text-muted-foreground">{baseReply.length}/200</span>
//         </div>
//       </div>

//       {/* Generate Button */}
//       <Button
//         onClick={generateVariations}
//         disabled={isGenerating || !baseReply.trim()}
//         className="w-full"
//         variant="default"
//       >
//         {isGenerating ? (
//           <>
//             <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//             Generating variations...
//           </>
//         ) : (
//           <>
//             <Sparkles className="h-4 w-4 mr-2" />
//             {variations.length > 0 ? "Regenerate All Variations" : "Generate AI Variations"}
//           </>
//         )}
//       </Button>

//       {/* Variations List */}
//       {variations.length > 0 && (
//         <div className="space-y-3">
//           <div className="flex items-center justify-between">
//             <Label className="text-sm font-medium">Generated Variations ({variations.length})</Label>
//             <Badge variant="outline" className="text-xs">
//               These will be used randomly
//             </Badge>
//           </div>

//           <AnimatePresence mode="popLayout">
//             {variations.map((variation, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, x: -100 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 <Card className="bg-background-90 border-border/50">
//                   <CardContent className="p-3">
//                     {editingIndex === index ? (
//                       <div className="space-y-2">
//                         <Textarea
//                           value={editText}
//                           onChange={(e) => setEditText(e.target.value)}
//                           className="min-h-[60px] text-sm"
//                           maxLength={500}
//                         />
//                         <div className="flex gap-2">
//                           <Button size="sm" onClick={saveEdit} className="flex-1">
//                             <Check className="h-3 w-3 mr-1" />
//                             Save
//                           </Button>
//                           <Button size="sm" variant="outline" onClick={cancelEdit} className="flex-1 bg-transparent">
//                             <X className="h-3 w-3 mr-1" />
//                             Cancel
//                           </Button>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="space-y-2">
//                         <div className="flex items-start justify-between gap-3">
//                           <p className="text-sm flex-1 leading-relaxed">{variation}</p>
//                           <Badge variant="secondary" className="text-xs shrink-0">
//                             #{index + 1}
//                           </Badge>
//                         </div>
//                         <div className="flex gap-1.5">
//                           <Button
//                             size="sm"
//                             variant="ghost"
//                             onClick={() => regenerateSingle(index)}
//                             disabled={regeneratingIndex === index}
//                             className="flex-1 h-8 text-xs"
//                           >
//                             {regeneratingIndex === index ? (
//                               <Loader2 className="h-3 w-3 mr-1 animate-spin" />
//                             ) : (
//                               <RefreshCw className="h-3 w-3 mr-1" />
//                             )}
//                             Regenerate
//                           </Button>
//                           <Button
//                             size="sm"
//                             variant="ghost"
//                             onClick={() => startEdit(index)}
//                             className="flex-1 h-8 text-xs"
//                           >
//                             <Edit2 className="h-3 w-3 mr-1" />
//                             Edit
//                           </Button>
//                           <Button
//                             size="sm"
//                             variant="ghost"
//                             onClick={() => deleteVariation(index)}
//                             className="h-8 text-xs text-destructive hover:text-destructive"
//                           >
//                             <Trash2 className="h-3 w-3" />
//                           </Button>
//                         </div>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             ))}
//           </AnimatePresence>

//           <div className="bg-muted/30 border border-border/50 rounded-lg p-3">
//             <p className="text-xs text-muted-foreground">
//               💡 <strong>How it works:</strong> When someone comments, the system will randomly select one of these
//               variations and sometimes personalize it with their @username for a natural, human feel.
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, RefreshCw, Check, X, Edit2, Trash2, MessageSquare, Info } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "@/hooks/use-toast"

interface ReplyVariationsManagerProps {
  value?: string[]
  onChange: (variations: string[]) => void
  baseReply: string
  onBaseReplyChange: (reply: string) => void
}

export function ReplyVariationsManager({
  value = [],
  onChange,
  baseReply,
  onBaseReplyChange,
}: ReplyVariationsManagerProps) {
  const [variations, setVariations] = useState<string[]>(value)
  const [isGenerating, setIsGenerating] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editText, setEditText] = useState("")
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null)

  const generateVariations = async () => {
    if (!baseReply.trim()) {
      toast({
        title: "Base reply required",
        description: "Please enter a base comment reply first",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-reply-variations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseReply, count: 8 }),
      })

      if (!response.ok) throw new Error("Failed to generate variations")

      const data = await response.json()
      setVariations(data.variations)
      onChange(data.variations)

      toast({
        title: "Variations generated!",
        description: `${data.variations.length} unique comment replies created`,
      })
    } catch (error) {
      console.error("Error generating variations:", error)
      toast({
        title: "Generation failed",
        description: "Could not generate variations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const regenerateSingle = async (index: number) => {
    if (!baseReply.trim()) return

    setRegeneratingIndex(index)
    try {
      const response = await fetch("/api/generate-reply-variations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseReply, count: 1 }),
      })

      if (!response.ok) throw new Error("Failed to regenerate")

      const data = await response.json()
      const newVariations = [...variations]
      newVariations[index] = data.variations[0]
      setVariations(newVariations)
      onChange(newVariations)

      toast({
        title: "Variation regenerated!",
        description: "New reply created successfully",
      })
    } catch (error) {
      console.error("Error regenerating variation:", error)
      toast({
        title: "Regeneration failed",
        description: "Could not regenerate variation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setRegeneratingIndex(null)
    }
  }

  const startEdit = (index: number) => {
    setEditingIndex(index)
    setEditText(variations[index])
  }

  const saveEdit = () => {
    if (editingIndex === null) return

    const newVariations = [...variations]
    newVariations[editingIndex] = editText.trim()
    setVariations(newVariations)
    onChange(newVariations)
    setEditingIndex(null)
    setEditText("")

    toast({
      title: "Variation updated",
      description: "Your changes have been saved",
    })
  }

  const cancelEdit = () => {
    setEditingIndex(null)
    setEditText("")
  }

  const deleteVariation = (index: number) => {
    const newVariations = variations.filter((_, i) => i !== index)
    setVariations(newVariations)
    onChange(newVariations)

    toast({
      title: "Variation deleted",
      description: "Reply removed from the list",
    })
  }

  return (
    <div className="space-y-8">
      {/* Base Reply Input */}
      <Card className="bg-background-90 border-background-80/50">
        <CardContent className="p-6 lg:p-8">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <Label htmlFor="baseReply" className="text-lg font-semibold flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[#768BDD]" />
                Base Comment Reply
              </Label>
              <Badge variant="secondary" className="w-fit">
                Required
              </Badge>
            </div>
            <Textarea
              id="baseReply"
              value={baseReply}
              onChange={(e) => onBaseReplyChange(e.target.value)}
              placeholder="e.g., Check your DMs for more info!"
              className="min-h-[120px] resize-none text-base bg-background-80 border-background-70"
              maxLength={200}
            />
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                This is your base message. AI will create natural variations of it.
              </p>
              <span className="text-sm text-muted-foreground font-medium">{baseReply.length}/200</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <Button
        onClick={generateVariations}
        disabled={isGenerating || !baseReply.trim()}
        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-5 w-5 mr-3 animate-spin" />
            Generating variations...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5 mr-3" />
            {variations.length > 0 ? "Regenerate All Variations" : "Generate AI Variations"}
          </>
        )}
      </Button>

      {/* Variations List */}
      {variations.length > 0 && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Label className="text-lg font-semibold">Generated Variations ({variations.length})</Label>
            <Badge variant="outline" className="w-fit">
              These will be used randomly
            </Badge>
          </div>

          <AnimatePresence mode="popLayout">
            {variations.map((variation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="bg-background-90 border-border/50">
                  <CardContent className="p-6">
                    {editingIndex === index ? (
                      <div className="space-y-4">
                        <Textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="min-h-[100px] text-base"
                          maxLength={500}
                        />
                        <div className="flex gap-3 justify-end">
                          <Button variant="outline" onClick={cancelEdit} className="h-11 px-5 bg-transparent">
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                          <Button onClick={saveEdit} className="h-11 px-5">
                            <Check className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <p className="text-base flex-1 leading-relaxed">{variation}</p>
                          <Badge variant="secondary" className="text-sm shrink-0">
                            #{index + 1}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <Button
                            variant="ghost"
                            onClick={() => regenerateSingle(index)}
                            disabled={regeneratingIndex === index}
                            className="flex-1 sm:flex-none h-11"
                          >
                            {regeneratingIndex === index ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <RefreshCw className="h-4 w-4 mr-2" />
                            )}
                            Regenerate
                          </Button>
                          <Button variant="ghost" onClick={() => startEdit(index)} className="flex-1 sm:flex-none h-11">
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => deleteVariation(index)}
                            className="h-11 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Info Card */}
          <Card className="bg-muted/30 border-border/50">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  <strong>How it works:</strong> When someone comments, the system will randomly select one of these
                  variations and sometimes personalize it with their @username for a natural, human feel.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
