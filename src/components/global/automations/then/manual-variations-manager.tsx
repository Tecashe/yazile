// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Plus, Edit2, Trash2, Check, X } from "lucide-react"
// import { motion, AnimatePresence } from "framer-motion"
// import { toast } from "@/hooks/use-toast"

// interface ManualVariationsManagerProps {
//   variations: string[]
//   onChange: (variations: string[]) => void
//   isEditMode: boolean
// }

// export function ManualVariationsManager({ variations, onChange, isEditMode }: ManualVariationsManagerProps) {
//   const [isAdding, setIsAdding] = useState(false)
//   const [newVariation, setNewVariation] = useState("")
//   const [editingIndex, setEditingIndex] = useState<number | null>(null)
//   const [editText, setEditText] = useState("")

//   const handleAdd = () => {
//     if (!newVariation.trim()) {
//       toast({
//         title: "Error",
//         description: "Please enter a variation before adding",
//         variant: "destructive",
//       })
//       return
//     }

//     onChange([...variations, newVariation.trim()])
//     setNewVariation("")
//     setIsAdding(false)

//     toast({
//       title: "Variation added",
//       description: "Your comment reply variation has been added",
//     })
//   }

//   const handleEdit = (index: number) => {
//     setEditingIndex(index)
//     setEditText(variations[index])
//   }

//   const handleSaveEdit = () => {
//     if (editingIndex === null) return

//     const newVariations = [...variations]
//     newVariations[editingIndex] = editText.trim()
//     onChange(newVariations)
//     setEditingIndex(null)
//     setEditText("")

//     toast({
//       title: "Variation updated",
//       description: "Your changes have been saved",
//     })
//   }

//   const handleDelete = (index: number) => {
//     onChange(variations.filter((_, i) => i !== index))

//     toast({
//       title: "Variation deleted",
//       description: "Reply removed from the list",
//     })
//   }

//   return (
//     <div className="space-y-3">
//       <div className="flex items-center justify-between">
//         <Label className="text-sm font-medium">
//           Reply Variations {variations.length > 0 && `(${variations.length})`}
//         </Label>
//         {!isAdding && (
//           <Button
//             type="button"
//             variant="outline"
//             size="sm"
//             onClick={() => {
//               if (!isEditMode) {
//                 toast({
//                   title: "Edit mode required",
//                   description: "Please enable edit mode to add variations",
//                   variant: "default",
//                 })
//                 return
//               }
//               setIsAdding(true)
//             }}
//             disabled={!isEditMode}
//             className="h-7 text-xs"
//           >
//             <Plus className="h-3 w-3 mr-1" />
//             Add Variation
//           </Button>
//         )}
//       </div>

//       <p className="text-xs text-muted-foreground">
//         Add multiple variations to make your replies look more natural and human-like
//       </p>

//       {/* Add New Variation */}
//       {isAdding && (
//         <Card className="bg-background-90 border-border/50">
//           <CardContent className="p-3 space-y-2">
//             <Textarea
//               value={newVariation}
//               onChange={(e) => setNewVariation(e.target.value)}
//               placeholder="Enter a variation of your comment reply..."
//               className="min-h-[60px] text-sm"
//               maxLength={200}
//               autoFocus
//             />
//             <div className="flex gap-2">
//               <Button type="button" size="sm" onClick={handleAdd} className="flex-1">
//                 <Check className="h-3 w-3 mr-1" />
//                 Add
//               </Button>
//               <Button
//                 type="button"
//                 size="sm"
//                 variant="outline"
//                 onClick={() => {
//                   setIsAdding(false)
//                   setNewVariation("")
//                 }}
//                 className="flex-1 bg-transparent"
//               >
//                 <X className="h-3 w-3 mr-1" />
//                 Cancel
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Variations List */}
//       {variations.length > 0 && (
//         <div className="space-y-2">
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
//                           maxLength={200}
//                         />
//                         <div className="flex gap-2">
//                           <Button type="button" size="sm" onClick={handleSaveEdit} className="flex-1">
//                             <Check className="h-3 w-3 mr-1" />
//                             Save
//                           </Button>
//                           <Button
//                             type="button"
//                             size="sm"
//                             variant="outline"
//                             onClick={() => {
//                               setEditingIndex(null)
//                               setEditText("")
//                             }}
//                             className="flex-1 bg-transparent"
//                           >
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
//                             type="button"
//                             size="sm"
//                             variant="ghost"
//                             onClick={() => {
//                               if (!isEditMode) {
//                                 toast({
//                                   title: "Edit mode required",
//                                   description: "Please enable edit mode to edit variations",
//                                   variant: "default",
//                                 })
//                                 return
//                               }
//                               handleEdit(index)
//                             }}
//                             disabled={!isEditMode}
//                             className="flex-1 h-8 text-xs"
//                           >
//                             <Edit2 className="h-3 w-3 mr-1" />
//                             Edit
//                           </Button>
//                           <Button
//                             type="button"
//                             size="sm"
//                             variant="ghost"
//                             onClick={() => {
//                               if (!isEditMode) {
//                                 toast({
//                                   title: "Edit mode required",
//                                   description: "Please enable edit mode to delete variations",
//                                   variant: "default",
//                                 })
//                                 return
//                               }
//                               handleDelete(index)
//                             }}
//                             disabled={!isEditMode}
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
//         </div>
//       )}

//       {variations.length === 0 && !isAdding && (
//         <Card className="bg-background-90/50 border-dashed border-border/50">
//           <CardContent className="p-4 text-center">
//             <p className="text-sm text-muted-foreground">
//               No variations added yet. Click &ldquo;Add Variation&rdquo; to create different versions of your comment reply.
//             </p>
//           </CardContent>
//         </Card>
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
import { Plus, Edit2, Trash2, Check, X, MessageSquare } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "@/hooks/use-toast"

interface ManualVariationsManagerProps {
  variations: string[]
  onChange: (variations: string[]) => void
  isEditMode: boolean
}

export function ManualVariationsManager({ variations, onChange, isEditMode }: ManualVariationsManagerProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newVariation, setNewVariation] = useState("")
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editText, setEditText] = useState("")

  const handleAdd = () => {
    if (!newVariation.trim()) {
      toast({
        title: "Error",
        description: "Please enter a variation before adding",
        variant: "destructive",
      })
      return
    }

    onChange([...variations, newVariation.trim()])
    setNewVariation("")
    setIsAdding(false)

    toast({
      title: "Variation added",
      description: "Your comment reply variation has been added",
    })
  }

  const handleEdit = (index: number) => {
    setEditingIndex(index)
    setEditText(variations[index])
  }

  const handleSaveEdit = () => {
    if (editingIndex === null) return

    const newVariations = [...variations]
    newVariations[editingIndex] = editText.trim()
    onChange(newVariations)
    setEditingIndex(null)
    setEditText("")

    toast({
      title: "Variation updated",
      description: "Your changes have been saved",
    })
  }

  const handleDelete = (index: number) => {
    onChange(variations.filter((_, i) => i !== index))

    toast({
      title: "Variation deleted",
      description: "Reply removed from the list",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Label className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-[#768BDD]" />
            Reply Variations
            {variations.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {variations.length}
              </Badge>
            )}
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            Add multiple variations to make your replies look more natural and human-like
          </p>
        </div>
        {!isAdding && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (!isEditMode) {
                toast({
                  title: "Edit mode required",
                  description: "Please enable edit mode to add variations",
                  variant: "default",
                })
                return
              }
              setIsAdding(true)
            }}
            disabled={!isEditMode}
            className="h-11 px-5"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Variation
          </Button>
        )}
      </div>

      {/* Add New Variation Form */}
      {isAdding && (
        <Card className="bg-background-90 border-border/50">
          <CardContent className="p-6">
            <Textarea
              value={newVariation}
              onChange={(e) => setNewVariation(e.target.value)}
              placeholder="Enter a variation of your comment reply..."
              className="min-h-[100px] text-base mb-4"
              maxLength={200}
              autoFocus
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{newVariation.length}/200 characters</span>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false)
                    setNewVariation("")
                  }}
                  className="h-11 px-5 bg-transparent"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button type="button" onClick={handleAdd} className="h-11 px-5">
                  <Check className="h-4 w-4 mr-2" />
                  Add Variation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Variations List */}
      {variations.length > 0 && (
        <div className="space-y-4">
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
                          maxLength={200}
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{editText.length}/200 characters</span>
                          <div className="flex gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setEditingIndex(null)
                                setEditText("")
                              }}
                              className="h-10 px-4 bg-transparent"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                            <Button type="button" onClick={handleSaveEdit} className="h-10 px-4">
                              <Check className="h-4 w-4 mr-2" />
                              Save
                            </Button>
                          </div>
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
                        <div className="flex gap-3">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              if (!isEditMode) {
                                toast({
                                  title: "Edit mode required",
                                  description: "Please enable edit mode to edit variations",
                                  variant: "default",
                                })
                                return
                              }
                              handleEdit(index)
                            }}
                            disabled={!isEditMode}
                            className="flex-1 h-11"
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              if (!isEditMode) {
                                toast({
                                  title: "Edit mode required",
                                  description: "Please enable edit mode to delete variations",
                                  variant: "default",
                                })
                                return
                              }
                              handleDelete(index)
                            }}
                            disabled={!isEditMode}
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
        </div>
      )}

      {/* Empty State */}
      {variations.length === 0 && !isAdding && (
        <Card className="bg-background-90/50 border-dashed border-border/50">
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-base text-muted-foreground">
              No variations added yet. Click &ldquo;Add Variation&rdquo; to create different versions of your comment
              reply.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
