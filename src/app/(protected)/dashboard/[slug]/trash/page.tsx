// "use client"

// import { useQueryTrashedAutomations } from "@/hooks/user-queries-trash"
// import { useRestoreAutomation, usePermanentlyDelete, useEmptyTrash } from "@/hooks/use-trash"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { motion, AnimatePresence } from "framer-motion"
// import { Trash2, RotateCcw, AlertTriangle, Clock, Sparkles, Zap, Loader2, AlertCircle } from "lucide-react"
// import { useState } from "react"
// import Link from "next/link"

// type Keyword = {
//   id: string
//   automationId: string | null
//   word: string
// }

// type Listener = {
//   id: string
//   listener: string
//   automationId: string
//   prompt: string
//   commentReply: string | null
//   dmCount: number
//   commentCount: number
// }

// type TrashedAutomation = {
//   id: string
//   name: string
//   active: boolean
//   keywords: Keyword[]
//   createdAt: Date
//   deletedAt: Date | null
//   listener: Listener | null
// }

// const TrashPage = () => {
//   const { data, isLoading, isFetching } = useQueryTrashedAutomations()
//   const { mutate: restore, isPending: isRestoring } = useRestoreAutomation()
//   const { mutate: permanentlyDelete, isPending: isDeleting } = usePermanentlyDelete()
//   const { mutate: emptyTrash, isPending: isEmptying } = useEmptyTrash()

//   const [showEmptyConfirm, setShowEmptyConfirm] = useState(false)
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

//   const trashedAutomations = (data?.data || []) as TrashedAutomation[]

//   const getRelativeTime = (date: Date) => {
//     const now = new Date()
//     const diff = now.getTime() - new Date(date).getTime()
//     const days = Math.floor(diff / (1000 * 60 * 60 * 24))

//     if (days === 0) return "Today"
//     if (days === 1) return "Yesterday"
//     if (days < 7) return `${days} days ago`
//     if (days < 30) return `${Math.floor(days / 7)} weeks ago`
//     return `${Math.floor(days / 30)} months ago`
//   }

//   if (isLoading || isFetching) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
//           <p className="text-muted-foreground">Loading trash...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="container mx-auto px-4 py-8 max-w-6xl">
//         {/* Header */}
//         <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//             <div>
//               <div className="flex items-center gap-3 mb-2">
//                 <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
//                   <Trash2 className="w-6 h-6 text-destructive" />
//                 </div>
//                 <h1 className="text-4xl font-bold">Trash</h1>
//               </div>
//               <p className="text-muted-foreground">Automations in trash will be permanently deleted after 30 days</p>
//             </div>

//             <div className="flex gap-3">
//               <Button variant="outline" asChild>
//                 <Link href="/automations">Back to Automations</Link>
//               </Button>
//               {trashedAutomations.length > 0 && (
//                 <Button variant="destructive" onClick={() => setShowEmptyConfirm(true)} disabled={isEmptying}>
//                   {isEmptying ? (
//                     <>
//                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                       Emptying...
//                     </>
//                   ) : (
//                     <>
//                       <Trash2 className="w-4 h-4 mr-2" />
//                       Empty Trash
//                     </>
//                   )}
//                 </Button>
//               )}
//             </div>
//           </div>

//           {/* Stats */}
//           {trashedAutomations.length > 0 && (
//             <Card className="p-4 bg-muted/50 border-border/50">
//               <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                 <AlertCircle className="w-4 h-4" />
//                 <span>
//                   {trashedAutomations.length} automation{trashedAutomations.length !== 1 ? "s" : ""} in trash
//                 </span>
//               </div>
//             </Card>
//           )}
//         </motion.div>

//         {/* Empty State */}
//         {trashedAutomations.length === 0 ? (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="text-center py-20"
//           >
//             <div className="relative inline-block mb-6">
//               <div className="absolute inset-0 bg-muted/20 blur-3xl rounded-full" />
//               <Trash2 className="w-24 h-24 text-muted-foreground relative z-10" />
//             </div>
//             <h3 className="text-2xl font-semibold mb-2">Trash is empty</h3>
//             <p className="text-muted-foreground mb-6">Deleted automations will appear here</p>
//             <Button variant="outline" asChild>
//               <Link href="/automations">Go to Automations</Link>
//             </Button>
//           </motion.div>
//         ) : (
//           <div className="space-y-4">
//             <AnimatePresence mode="popLayout">
//               {trashedAutomations.map((automation, index) => (
//                 <motion.div
//                   key={automation.id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, x: -100 }}
//                   transition={{ delay: index * 0.05 }}
//                 >
//                   <Card className="p-6 border-2 border-destructive/20 bg-destructive/5 hover:border-destructive/30 transition-colors">
//                     <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                       <div className="flex-1">
//                         <div className="flex items-start gap-3 mb-3">
//                           <div className="flex-1">
//                             <h3 className="text-xl font-semibold mb-2">{automation.name}</h3>

//                             {/* Keywords */}
//                             {automation.keywords && automation.keywords.length > 0 && (
//                               <div className="flex flex-wrap gap-2 mb-3">
//                                 {automation.keywords.map((keyword, key) => (
//                                   <Badge key={keyword.id} variant="outline" className="opacity-60">
//                                     {keyword.word}
//                                   </Badge>
//                                 ))}
//                               </div>
//                             )}

//                             {/* Metadata */}
//                             <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
//                               {automation.listener?.listener === "SMARTAI" ? (
//                                 <div className="flex items-center gap-1">
//                                   <Sparkles className="w-4 h-4" />
//                                   <span>Smart AI</span>
//                                 </div>
//                               ) : (
//                                 <div className="flex items-center gap-1">
//                                   <Zap className="w-4 h-4" />
//                                   <span>Message</span>
//                                 </div>
//                               )}

//                               <div className="flex items-center gap-1">
//                                 <Clock className="w-4 h-4" />
//                                 <span>Deleted {getRelativeTime(automation.deletedAt!)}</span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Actions */}
//                       <div className="flex gap-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => restore({ id: automation.id })}
//                           disabled={isRestoring}
//                           className="border-primary/30 text-primary hover:bg-primary/10"
//                         >
//                           {isRestoring ? (
//                             <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                           ) : (
//                             <RotateCcw className="w-4 h-4 mr-2" />
//                           )}
//                           Restore
//                         </Button>

//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => setShowDeleteConfirm(automation.id)}
//                           disabled={isDeleting}
//                           className="border-destructive/30 text-destructive hover:bg-destructive/10"
//                         >
//                           <Trash2 className="w-4 h-4 mr-2" />
//                           Delete Forever
//                         </Button>
//                       </div>
//                     </div>

//                     {/* Delete Confirmation */}
//                     {showDeleteConfirm === automation.id && (
//                       <motion.div
//                         initial={{ opacity: 0, height: 0 }}
//                         animate={{ opacity: 1, height: "auto" }}
//                         className="mt-4 p-4 border-2 border-destructive/30 rounded-lg bg-destructive/10"
//                       >
//                         <div className="flex items-start gap-3 mb-3">
//                           <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
//                           <div>
//                             <p className="font-semibold text-destructive mb-1">Permanently delete this automation?</p>
//                             <p className="text-sm text-muted-foreground">
//                               This action cannot be undone. All data will be lost forever.
//                             </p>
//                           </div>
//                         </div>
//                         <div className="flex gap-2">
//                           <Button
//                             variant="destructive"
//                             size="sm"
//                             onClick={() => {
//                               permanentlyDelete({ id: automation.id })
//                               setShowDeleteConfirm(null)
//                             }}
//                           >
//                             Delete Forever
//                           </Button>
//                           <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(null)}>
//                             Cancel
//                           </Button>
//                         </div>
//                       </motion.div>
//                     )}
//                   </Card>
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//           </div>
//         )}

//         {/* Empty Trash Confirmation Modal */}
//         {showEmptyConfirm && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//             onClick={() => setShowEmptyConfirm(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               className="bg-card border-2 border-destructive/30 p-6 rounded-xl shadow-2xl w-full max-w-md"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex items-start gap-4 mb-4">
//                 <div className="p-3 rounded-full bg-destructive/10">
//                   <AlertTriangle className="w-6 h-6 text-destructive" />
//                 </div>
//                 <div>
//                   <h2 className="text-xl font-semibold mb-2">Empty Trash?</h2>
//                   <p className="text-sm text-muted-foreground">
//                     This will permanently delete all {trashedAutomations.length} automation
//                     {trashedAutomations.length !== 1 ? "s" : ""} in trash. This action cannot be undone.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex justify-end gap-3">
//                 <Button variant="outline" onClick={() => setShowEmptyConfirm(false)}>
//                   Cancel
//                 </Button>
//                 <Button
//                   variant="destructive"
//                   onClick={() => {
//                     emptyTrash({})
//                     setShowEmptyConfirm(false)
//                   }}
//                   disabled={isEmptying}
//                 >
//                   {isEmptying ? (
//                     <>
//                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                       Emptying...
//                     </>
//                   ) : (
//                     "Empty Trash"
//                   )}
//                 </Button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default TrashPage
"use client"

import { useQueryTrashedAutomations } from "@/hooks/user-queries-trash"
import { useRestoreAutomation, usePermanentlyDelete, useEmptyTrash } from "@/hooks/use-trash"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, RotateCcw, AlertTriangle, Clock, Sparkles, Zap, Loader2, AlertCircle } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

type Keyword = {
  id: string
  automationId: string | null
  word: string
}

type Listener = {
  id: string
  listener: string
  automationId: string
  prompt: string
  commentReply: string | null
  dmCount: number
  commentCount: number
}

type TrashedAutomation = {
  id: string
  name: string
  active: boolean
  keywords: Keyword[]
  createdAt: Date
  deletedAt: Date | null
  listener: Listener | null
}

const TrashPage = () => {
  const { data, isLoading, isFetching } = useQueryTrashedAutomations()
  const { mutate: restore, isPending: isRestoring } = useRestoreAutomation()
  const { mutate: permanentlyDelete, isPending: isDeleting } = usePermanentlyDelete()
  const { mutate: emptyTrash, isPending: isEmptying } = useEmptyTrash()

  const [showEmptyConfirm, setShowEmptyConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const trashedAutomations = (data?.data || []) as TrashedAutomation[]

  const getRelativeTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return "Today"
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    return `${Math.floor(days / 30)} months ago`
  }

  if (isLoading || isFetching) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading trash...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                  <Trash2 className="w-6 h-6 text-destructive" />
                </div>
                <h1 className="text-4xl font-bold">Trash</h1>
              </div>
              <p className="text-muted-foreground">Automations in trash will be permanently deleted after 30 days</p>
            </div>

            <div className="flex gap-3">
              {/* <Button variant="outline" asChild>
                <Link href="/automations">Back to Automations</Link>
              </Button> */}
              {trashedAutomations.length > 0 && (
                <Button variant="destructive" onClick={() => setShowEmptyConfirm(true)} disabled={isEmptying}>
                  {isEmptying ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Emptying...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Empty Trash
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Stats */}
          {trashedAutomations.length > 0 && (
            <Card className="p-4 bg-muted/50 border-border/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="w-4 h-4" />
                <span>
                  {trashedAutomations.length} automation{trashedAutomations.length !== 1 ? "s" : ""} in trash
                </span>
              </div>
            </Card>
          )}
        </motion.div>

        {/* Empty State */}
        {trashedAutomations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-muted/20 blur-3xl rounded-full" />
              <Trash2 className="w-24 h-24 text-muted-foreground relative z-10" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">Trash is empty</h3>
            <p className="text-muted-foreground mb-6">Deleted automations will appear here</p>
            <Button variant="outline" asChild>
              <Link href="/automations">Go to Automations</Link>
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {trashedAutomations.map((automation, index) => (
                <motion.div
                  key={automation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6 border-2 border-destructive/20 bg-destructive/5 hover:border-destructive/30 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-2">{automation.name}</h3>

                            {/* Keywords */}
                            {automation.keywords && automation.keywords.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-3">
                                {automation.keywords.map((keyword, key) => (
                                  <Badge key={keyword.id} variant="outline" className="opacity-60">
                                    {keyword.word}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {/* Metadata */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              {automation.listener?.listener === "SMARTAI" ? (
                                <div className="flex items-center gap-1">
                                  <Sparkles className="w-4 h-4" />
                                  <span>Smart AI</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <Zap className="w-4 h-4" />
                                  <span>Message</span>
                                </div>
                              )}

                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>Deleted {getRelativeTime(automation.deletedAt!)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => restore({ id: automation.id })}
                          disabled={isRestoring}
                          className="border-primary/30 text-primary hover:bg-primary/10"
                        >
                          {isRestoring ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <RotateCcw className="w-4 h-4 mr-2" />
                          )}
                          Restore
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowDeleteConfirm(automation.id)}
                          disabled={isDeleting}
                          className="border-destructive/30 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Forever
                        </Button>
                      </div>
                    </div>

                    {/* Delete Confirmation */}
                    {showDeleteConfirm === automation.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-4 p-4 border-2 border-destructive/30 rounded-lg bg-destructive/10"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-destructive mb-1">Permanently delete this automation?</p>
                            <p className="text-sm text-muted-foreground">
                              This action cannot be undone. All data will be lost forever.
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              permanentlyDelete({ id: automation.id })
                              setShowDeleteConfirm(null)
                            }}
                          >
                            Delete Forever
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(null)}>
                            Cancel
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Empty Trash Confirmation Modal */}
        {showEmptyConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowEmptyConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border-2 border-destructive/30 p-6 rounded-xl shadow-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-full bg-destructive/10">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Empty Trash?</h2>
                  <p className="text-sm text-muted-foreground">
                    This will permanently delete all {trashedAutomations.length} automation
                    {trashedAutomations.length !== 1 ? "s" : ""} in trash. This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowEmptyConfirm(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    emptyTrash({})
                    setShowEmptyConfirm(false)
                  }}
                  disabled={isEmptying}
                >
                  {isEmptying ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Emptying...
                    </>
                  ) : (
                    "Empty Trash"
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default TrashPage
