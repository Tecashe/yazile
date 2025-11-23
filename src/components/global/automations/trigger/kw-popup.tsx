// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { Plus, X, Tag, Lightbulb, Trash2 } from "lucide-react"
// import { motion, AnimatePresence } from "framer-motion"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { useKeywords } from "@/hooks/use-automations"
// import { useMutationDataState } from "@/hooks/use-mutation-data"
// import { useQueryAutomation } from "@/hooks/user-queries"

// type Props = {
//   id: string // Add automation ID prop
//   trigger?: React.ReactNode
// }

// export const KeywordsPopup = ({ id, trigger }: Props) => {
//   const [isOpen, setIsOpen] = useState(false)
//   const [newKeyword, setNewKeyword] = useState("")
  
//   // Use the same hooks as the Keywords component
//   const { onValueChange, keyword, onKeyPress, deleteMutation, addKeyword } = useKeywords(id)
//   const { latestVariable } = useMutationDataState(["add-keyword"])
//   const { data } = useQueryAutomation(id)

//   // Update the input value when keyword changes from the hook
//   useEffect(() => {
//     setNewKeyword(keyword)
//   }, [keyword])

//   const handleAddKeyword = () => {
//     if (newKeyword.trim()) {
//       // Use the same addKeyword function from the hook
//       addKeyword(newKeyword.trim().toLowerCase())
//       setNewKeyword("")
//     }
//   }

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") {
//       e.preventDefault()
//       handleAddKeyword()
//     }
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setNewKeyword(e.target.value)
//     // Also call the hook's onChange to keep it in sync
//     onValueChange(e)
//   }

//   const addSuggestedKeyword = (suggestedKeyword: string) => {
//     // Check if keyword already exists
//     const existingKeywords = data?.data?.keywords?.map(k => k.word.toLowerCase()) || []
//     if (!existingKeywords.includes(suggestedKeyword.toLowerCase())) {
//       addKeyword(suggestedKeyword.toLowerCase())
//     }
//   }

//   const clearAllKeywords = () => {
//     // Delete all existing keywords
//     if (data?.data?.keywords) {
//       data.data.keywords.forEach(keyword => {
//         deleteMutation({ id: keyword.id })
//       })
//     }
//   }

//   const suggestedKeywords = [
//     "help",
//     "support",
//     "pricing",
//     "info",
//     "buy",
//     "order",
//     "contact",
//     "demo",
//     "trial",
//     "discount",
//     "sale",
//   ]

//   // Get existing keywords for filtering suggestions
//   const existingKeywords = data?.data?.keywords?.map(k => k.word.toLowerCase()) || []

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>
//         {trigger || (
//           <Button variant="outline" className="gap-2 bg-transparent">
//             <Plus className="h-4 w-4" />
//             Add Keywords
//           </Button>
//         )}
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <Tag className="h-5 w-5 text-blue-500" />
//             Manage Trigger Keywords
//           </DialogTitle>
//         </DialogHeader>

//         <div className="space-y-6">
//           {/* Add new keyword */}
//           <div className="space-y-3">
//             <div className="flex gap-2">
//               <Input
//                 value={newKeyword}
//                 onChange={handleInputChange}
//                 onKeyPress={handleKeyPress}
//                 placeholder="Enter a keyword..."
//                 className="flex-1"
//               />
//               <Button onClick={handleAddKeyword} disabled={!newKeyword.trim()}>
//                 <Plus className="h-4 w-4" />
//               </Button>
//             </div>

//             <Alert className="bg-blue-500/10 border-blue-500/30">
//               <Lightbulb className="h-4 w-4 text-blue-500" />
//               <AlertDescription className="text-blue-400">
//                 Add 3-5 keywords that customers might use. Keep them simple and relevant to your business.
//               </AlertDescription>
//             </Alert>
//           </div>

//           {/* Current keywords */}
//           <div className="space-y-3">
//             <h4 className="font-medium text-foreground">
//               Your Keywords ({data?.data?.keywords?.length || 0})
//             </h4>
//             <div className="flex flex-wrap gap-2 min-h-[60px] p-3 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/20">
//               <AnimatePresence>
//                 {data?.data?.keywords &&
//                   data.data.keywords.map((keywordObj) => (
//                     <motion.div
//                       key={keywordObj.id}
//                       initial={{ opacity: 0, scale: 0.8 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       exit={{ opacity: 0, scale: 0.8 }}
//                       className="flex items-center gap-1"
//                     >
//                       <Badge variant="secondary" className="gap-1 pr-1">
//                         {keywordObj.word}
//                         <button
//                           onClick={() => deleteMutation({ id: keywordObj.id })}
//                           className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
//                         >
//                           <X className="h-3 w-3" />
//                         </button>
//                       </Badge>
//                     </motion.div>
//                   ))}

//                 {/* Show pending keyword */}
//                 {latestVariable && latestVariable.status === "pending" && (
//                   <motion.div
//                     initial={{ opacity: 0, scale: 0.8 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     className="flex items-center gap-1"
//                   >
//                     <Badge variant="secondary" className="gap-1 pr-1 opacity-60">
//                       {latestVariable.variables.keyword}
//                     </Badge>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
              
//               {(!data?.data?.keywords || data.data.keywords.length === 0) && 
//                (!latestVariable || latestVariable.status !== "pending") && (
//                 <p className="text-muted-foreground text-sm">No keywords added yet</p>
//               )}
//             </div>
//           </div>

//           {/* Suggested keywords */}
//           <div className="space-y-3">
//             <h4 className="font-medium text-foreground flex items-center gap-2">
//               <Lightbulb className="h-4 w-4 text-yellow" />
//               Suggested Keywords
//             </h4>
//             <div className="flex flex-wrap gap-2">
//               {suggestedKeywords
//                 .filter((keyword) => !existingKeywords.includes(keyword.toLowerCase()))
//                 .map((keyword) => (
//                   <Button
//                     key={keyword}
//                     variant="outline"
//                     size="sm"
//                     onClick={() => addSuggestedKeyword(keyword)}
//                     className="text-xs"
//                   >
//                     <Plus className="h-3 w-3 mr-1" />
//                     {keyword}
//                   </Button>
//                 ))}
//             </div>
//             {suggestedKeywords.filter((keyword) => !existingKeywords.includes(keyword.toLowerCase())).length === 0 && (
//               <p className="text-muted-foreground text-xs">All suggested keywords have been added</p>
//             )}
//           </div>

//           {/* Actions */}
//           <div className="flex justify-between pt-4 border-t">
//             <Button
//               variant="outline"
//               onClick={clearAllKeywords}
//               disabled={!data?.data?.keywords || data.data.keywords.length === 0}
//               className="text-destructive hover:text-destructive"
//             >
//               <Trash2 className="h-4 w-4 mr-1" />
//               Clear All
//             </Button>
//             <div className="flex gap-2">
//               <Button variant="outline" onClick={() => setIsOpen(false)}>
//                 Close
//               </Button>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }


// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { Plus, X, Tag, Lightbulb, Trash2, Sparkles, Loader2 } from "lucide-react"
// import { motion, AnimatePresence } from "framer-motion"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { useKeywords } from "@/hooks/use-automations"
// import { useMutationDataState } from "@/hooks/use-mutation-data"
// import { useQueryAutomation } from "@/hooks/user-queries"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Textarea } from "@/components/ui/textarea"

// type Props = {
//   id: string
//   trigger?: React.ReactNode
// }

// export const KeywordsPopup = ({ id, trigger }: Props) => {
//   const [isOpen, setIsOpen] = useState(false)
//   const [newKeyword, setNewKeyword] = useState("")
//   const [aiPrompt, setAiPrompt] = useState("")
//   const [exampleWord, setExampleWord] = useState("")
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [generatedKeywords, setGeneratedKeywords] = useState<string[]>([])
//   const [dailyGenerations, setDailyGenerations] = useState(0)
//   const [lastGenerationDate, setLastGenerationDate] = useState("")
  
//   const { onValueChange, keyword, onKeyPress, deleteMutation, addKeyword } = useKeywords(id)
//   const { latestVariable } = useMutationDataState(["add-keyword"])
//   const { data } = useQueryAutomation(id)

//   // Load generation count and last generated keywords from storage
//   useEffect(() => {
//     const loadStorageData = async () => {
//       try {
//         const countResult = await window.storage.get(`ai-gen-count-${id}`)
//         const dateResult = await window.storage.get(`ai-gen-date-${id}`)
//         const keywordsResult = await window.storage.get(`ai-gen-keywords-${id}`)
        
//         const today = new Date().toDateString()
//         const storedDate = dateResult?.value || ""
        
//         if (storedDate === today && countResult?.value) {
//           setDailyGenerations(parseInt(countResult.value))
//         } else {
//           setDailyGenerations(0)
//           setLastGenerationDate(today)
//         }
        
//         if (keywordsResult?.value) {
//           setGeneratedKeywords(JSON.parse(keywordsResult.value))
//         }
//       } catch (error) {
//         console.log('Storage initialization:', error)
//       }
//     }
    
//     if (isOpen) {
//       loadStorageData()
//     }
//   }, [id, isOpen])

//   useEffect(() => {
//     setNewKeyword(keyword)
//   }, [keyword])

//   const handleAddKeyword = () => {
//     if (newKeyword.trim()) {
//       addKeyword(newKeyword.trim().toLowerCase())
//       setNewKeyword("")
//     }
//   }

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") {
//       e.preventDefault()
//       handleAddKeyword()
//     }
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setNewKeyword(e.target.value)
//     onValueChange(e)
//   }

//   const addSuggestedKeyword = (suggestedKeyword: string) => {
//     const existingKeywords = data?.data?.keywords?.map(k => k.word.toLowerCase()) || []
//     if (!existingKeywords.includes(suggestedKeyword.toLowerCase())) {
//       addKeyword(suggestedKeyword.toLowerCase())
//     }
//   }

//   const addGeneratedKeyword = (keyword: string) => {
//     const existingKeywords = data?.data?.keywords?.map(k => k.word.toLowerCase()) || []
//     if (!existingKeywords.includes(keyword.toLowerCase())) {
//       addKeyword(keyword.toLowerCase())
//     }
//   }

//   const clearAllKeywords = () => {
//     if (data?.data?.keywords) {
//       data.data.keywords.forEach(keyword => {
//         deleteMutation({ id: keyword.id })
//       })
//     }
//   }

//   const generateKeywords = async (type: 'topic' | 'example') => {
//     if (dailyGenerations >= 5) {
//       alert('You have reached your daily limit of 5 generations. Please try again tomorrow.')
//       return
//     }

//     const prompt = type === 'topic' ? aiPrompt : exampleWord
//     if (!prompt.trim()) {
//       alert(`Please enter ${type === 'topic' ? 'a topic or description' : 'an example word'}`)
//       return
//     }

//     setIsGenerating(true)
    
//     try {
//       const systemPrompt = type === 'topic' 
//         ? `You are a keyword generation assistant for a DM automation system. Generate 8-10 short, relevant trigger keywords based on the user's topic or description. Keywords should be:
// - Single words or very short phrases (1-2 words max)
// - Lowercase
// - Common words that customers might use in DMs
// - Relevant to the topic
// - Diverse and cover different aspects
// Return ONLY a JSON array of strings, nothing else.`
//         : `You are a keyword generation assistant for a DM automation system. Given an example word, generate 8-10 similar keywords that are:
// - Thematically related to the example
// - Single words or very short phrases (1-2 words max)
// - Lowercase
// - Common words that customers might use in DMs
// - Varied but contextually similar
// Return ONLY a JSON array of strings, nothing else.`

//       const userPrompt = type === 'topic'
//         ? `Generate keywords for: ${prompt}`
//         : `Generate keywords similar to: ${prompt}`

//       const response = await fetch('/api/generate-keywords', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           systemPrompt,
//           userPrompt,
//           automationId: id
//         })
//       })

//       if (!response.ok) {
//         throw new Error('Failed to generate keywords')
//       }

//       const result = await response.json()
//       const keywords = result.keywords || []
      
//       setGeneratedKeywords(keywords)
      
//       // Update generation count
//       const newCount = dailyGenerations + 1
//       const today = new Date().toDateString()
//       setDailyGenerations(newCount)
//       setLastGenerationDate(today)
      
//       // Save to storage
//       try {
//         await window.storage.set(`ai-gen-count-${id}`, newCount.toString())
//         await window.storage.set(`ai-gen-date-${id}`, today)
//         await window.storage.set(`ai-gen-keywords-${id}`, JSON.stringify(keywords))
//       } catch (error) {
//         console.log('Storage save error:', error)
//       }

//     } catch (error) {
//       console.error('Error generating keywords:', error)
//       alert('Failed to generate keywords. Please try again.')
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   const suggestedKeywords = [
//     "help",
//     "support",
//     "pricing",
//     "info",
//     "buy",
//     "order",
//     "contact",
//     "demo",
//     "trial",
//     "discount",
//     "sale",
//   ]

//   const existingKeywords = data?.data?.keywords?.map(k => k.word.toLowerCase()) || []
//   const remainingGenerations = 5 - dailyGenerations

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>
//         {trigger || (
//           <Button variant="outline" className="gap-2 bg-transparent">
//             <Plus className="h-4 w-4" />
//             Add Keywords
//           </Button>
//         )}
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <Tag className="h-5 w-5 text-blue-500" />
//             Manage Trigger Keywords
//           </DialogTitle>
//         </DialogHeader>

//         <Tabs defaultValue="manual" className="w-full">
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="manual">Manual</TabsTrigger>
//             <TabsTrigger value="ai" className="gap-2">
//               <Sparkles className="h-4 w-4" />
//               AI Generate
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="manual" className="space-y-6 mt-4">
//             {/* Add new keyword */}
//             <div className="space-y-3">
//               <div className="flex gap-2">
//                 <Input
//                   value={newKeyword}
//                   onChange={handleInputChange}
//                   onKeyPress={handleKeyPress}
//                   placeholder="Enter a keyword..."
//                   className="flex-1"
//                 />
//                 <Button onClick={handleAddKeyword} disabled={!newKeyword.trim()}>
//                   <Plus className="h-4 w-4" />
//                 </Button>
//               </div>

//               <Alert className="bg-blue-500/10 border-blue-500/30">
//                 <Lightbulb className="h-4 w-4 text-blue-500" />
//                 <AlertDescription className="text-blue-400">
//                   Add 3-5 keywords that customers might use. Keep them simple and relevant to your business.
//                 </AlertDescription>
//               </Alert>
//             </div>

//             {/* Suggested keywords */}
//             <div className="space-y-3">
//               <h4 className="font-medium text-foreground flex items-center gap-2">
//                 <Lightbulb className="h-4 w-4 text-yellow" />
//                 Suggested Keywords
//               </h4>
//               <div className="flex flex-wrap gap-2">
//                 {suggestedKeywords
//                   .filter((keyword) => !existingKeywords.includes(keyword.toLowerCase()))
//                   .map((keyword) => (
//                     <Button
//                       key={keyword}
//                       variant="outline"
//                       size="sm"
//                       onClick={() => addSuggestedKeyword(keyword)}
//                       className="text-xs"
//                     >
//                       <Plus className="h-3 w-3 mr-1" />
//                       {keyword}
//                     </Button>
//                   ))}
//               </div>
//               {suggestedKeywords.filter((keyword) => !existingKeywords.includes(keyword.toLowerCase())).length === 0 && (
//                 <p className="text-muted-foreground text-xs">All suggested keywords have been added</p>
//               )}
//             </div>
//           </TabsContent>

//           <TabsContent value="ai" className="space-y-6 mt-4">
//             <Alert className="bg-purple-500/10 border-purple-500/30">
//               <Sparkles className="h-4 w-4 text-purple-500" />
//               <AlertDescription className="text-purple-400">
//                 You have <strong>{remainingGenerations}</strong> AI generation{remainingGenerations !== 1 ? 's' : ''} remaining today
//               </AlertDescription>
//             </Alert>

//             {/* AI Generation Methods */}
//             <div className="space-y-4">
//               {/* Topic-based generation */}
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">Describe your keywords</label>
//                 <Textarea
//                   value={aiPrompt}
//                   onChange={(e) => setAiPrompt(e.target.value)}
//                   placeholder="e.g., keywords for a fitness coaching business, words customers use when asking about pricing..."
//                   className="min-h-[80px]"
//                   disabled={isGenerating}
//                 />
//                 <Button
//                   onClick={() => generateKeywords('topic')}
//                   disabled={isGenerating || !aiPrompt.trim() || dailyGenerations >= 5}
//                   className="w-full"
//                 >
//                   {isGenerating ? (
//                     <>
//                       <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                       Generating...
//                     </>
//                   ) : (
//                     <>
//                       <Sparkles className="h-4 w-4 mr-2" />
//                       Generate from Description
//                     </>
//                   )}
//                 </Button>
//               </div>

//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <span className="w-full border-t" />
//                 </div>
//                 <div className="relative flex justify-center text-xs uppercase">
//                   <span className="bg-background px-2 text-muted-foreground">Or</span>
//                 </div>
//               </div>

//               {/* Example-based generation */}
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">Give an example word</label>
//                 <Input
//                   value={exampleWord}
//                   onChange={(e) => setExampleWord(e.target.value)}
//                   placeholder="e.g., pricing, support, demo..."
//                   disabled={isGenerating}
//                 />
//                 <Button
//                   onClick={() => generateKeywords('example')}
//                   disabled={isGenerating || !exampleWord.trim() || dailyGenerations >= 5}
//                   className="w-full"
//                   variant="outline"
//                 >
//                   {isGenerating ? (
//                     <>
//                       <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                       Generating...
//                     </>
//                   ) : (
//                     <>
//                       <Sparkles className="h-4 w-4 mr-2" />
//                       Generate Similar Words
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </div>

//             {/* Generated keywords */}
//             {generatedKeywords.length > 0 && (
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between">
//                   <h4 className="font-medium text-foreground">Generated Keywords</h4>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => {
//                       generatedKeywords.forEach(kw => addGeneratedKeyword(kw))
//                     }}
//                     className="text-xs"
//                   >
//                     Add All
//                   </Button>
//                 </div>
//                 <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg border-2 border-dashed border-purple-500/30">
//                   {generatedKeywords.map((keyword, index) => (
//                     <Badge
//                       key={index}
//                       variant="outline"
//                       className="gap-1 cursor-pointer hover:bg-purple-500/20 border-purple-500/50"
//                       onClick={() => addGeneratedKeyword(keyword)}
//                     >
//                       <Plus className="h-3 w-3" />
//                       {keyword}
//                     </Badge>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </TabsContent>
//         </Tabs>

//         {/* Current keywords - shown in both tabs */}
//         <div className="space-y-3 pt-4 border-t">
//           <h4 className="font-medium text-foreground">
//             Your Keywords ({data?.data?.keywords?.length || 0})
//           </h4>
//           <div className="flex flex-wrap gap-2 min-h-[60px] p-3 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/20">
//             <AnimatePresence>
//               {data?.data?.keywords &&
//                 data.data.keywords.map((keywordObj) => (
//                   <motion.div
//                     key={keywordObj.id}
//                     initial={{ opacity: 0, scale: 0.8 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.8 }}
//                     className="flex items-center gap-1"
//                   >
//                     <Badge variant="secondary" className="gap-1 pr-1">
//                       {keywordObj.word}
//                       <button
//                         onClick={() => deleteMutation({ id: keywordObj.id })}
//                         className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
//                       >
//                         <X className="h-3 w-3" />
//                       </button>
//                     </Badge>
//                   </motion.div>
//                 ))}

//               {latestVariable && latestVariable.status === "pending" && (
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   className="flex items-center gap-1"
//                 >
//                   <Badge variant="secondary" className="gap-1 pr-1 opacity-60">
//                     {latestVariable.variables.keyword}
//                   </Badge>
//                 </motion.div>
//               )}
//             </AnimatePresence>
            
//             {(!data?.data?.keywords || data.data.keywords.length === 0) && 
//              (!latestVariable || latestVariable.status !== "pending") && (
//               <p className="text-muted-foreground text-sm">No keywords added yet</p>
//             )}
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex justify-between pt-4 border-t">
//           <Button
//             variant="outline"
//             onClick={clearAllKeywords}
//             disabled={!data?.data?.keywords || data.data.keywords.length === 0}
//             className="text-destructive hover:text-destructive"
//           >
//             <Trash2 className="h-4 w-4 mr-1" />
//             Clear All
//           </Button>
//           <div className="flex gap-2">
//             <Button variant="outline" onClick={() => setIsOpen(false)}>
//               Close
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }

"use client"

import type React from "react"

import { useState, useEffect } from "react"

// Type declaration for storage API
declare global {
  interface Window {
    storage: {
      get: (key: string, shared?: boolean) => Promise<{ key: string; value: string; shared: boolean } | null>
      set: (key: string, value: string, shared?: boolean) => Promise<{ key: string; value: string; shared: boolean } | null>
      delete: (key: string, shared?: boolean) => Promise<{ key: string; deleted: boolean; shared: boolean } | null>
      list: (prefix?: string, shared?: boolean) => Promise<{ keys: string[]; prefix?: string; shared: boolean } | null>
    }
  }
}
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Tag, Lightbulb, Trash2, Sparkles, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useKeywords } from "@/hooks/use-automations"
import { useMutationDataState } from "@/hooks/use-mutation-data"
import { useQueryAutomation } from "@/hooks/user-queries"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

type Props = {
  id: string
  trigger?: React.ReactNode
}

export const KeywordsPopup = ({ id, trigger }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [newKeyword, setNewKeyword] = useState("")
  const [aiPrompt, setAiPrompt] = useState("")
  const [exampleWord, setExampleWord] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedKeywords, setGeneratedKeywords] = useState<string[]>([])
  const [dailyGenerations, setDailyGenerations] = useState(0)
  const [lastGenerationDate, setLastGenerationDate] = useState("")
  
  const { onValueChange, keyword, onKeyPress, deleteMutation, addKeyword } = useKeywords(id)
  const { latestVariable } = useMutationDataState(["add-keyword"])
  const { data } = useQueryAutomation(id)

  // Load generation count and last generated keywords from storage
  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const countResult = await window.storage.get(`ai-gen-count-${id}`)
        const dateResult = await window.storage.get(`ai-gen-date-${id}`)
        const keywordsResult = await window.storage.get(`ai-gen-keywords-${id}`)
        
        const today = new Date().toDateString()
        const storedDate = dateResult?.value || ""
        
        if (storedDate === today && countResult?.value) {
          setDailyGenerations(parseInt(countResult.value))
        } else {
          setDailyGenerations(0)
          setLastGenerationDate(today)
        }
        
        if (keywordsResult?.value) {
          setGeneratedKeywords(JSON.parse(keywordsResult.value))
        }
      } catch (error) {
        console.log('Storage initialization:', error)
      }
    }
    
    if (isOpen) {
      loadStorageData()
    }
  }, [id, isOpen])

  useEffect(() => {
    setNewKeyword(keyword)
  }, [keyword])

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
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
    onValueChange(e)
  }

  const addSuggestedKeyword = (suggestedKeyword: string) => {
    const existingKeywords = data?.data?.keywords?.map(k => k.word.toLowerCase()) || []
    if (!existingKeywords.includes(suggestedKeyword.toLowerCase())) {
      addKeyword(suggestedKeyword.toLowerCase())
    }
  }

  const addGeneratedKeyword = (keyword: string) => {
    const existingKeywords = data?.data?.keywords?.map(k => k.word.toLowerCase()) || []
    if (!existingKeywords.includes(keyword.toLowerCase())) {
      addKeyword(keyword.toLowerCase())
    }
  }

  const clearAllKeywords = () => {
    if (data?.data?.keywords) {
      data.data.keywords.forEach(keyword => {
        deleteMutation({ id: keyword.id })
      })
    }
  }

  const generateKeywords = async (type: 'topic' | 'example') => {
    if (dailyGenerations >= 5) {
      alert('You have reached your daily limit of 5 generations. Please try again tomorrow.')
      return
    }

    const prompt = type === 'topic' ? aiPrompt : exampleWord
    if (!prompt.trim()) {
      alert(`Please enter ${type === 'topic' ? 'a topic or description' : 'an example word'}`)
      return
    }

    setIsGenerating(true)
    
    try {
      const systemPrompt = type === 'topic' 
        ? `You are a keyword generation assistant for a DM automation system. Generate 8-10 short, relevant trigger keywords based on the user's topic or description. Keywords should be:
- Single words or very short phrases (1-2 words max)
- Lowercase
- Common words that customers might use in DMs
- Relevant to the topic
- Diverse and cover different aspects
Return ONLY a JSON array of strings, nothing else.`
        : `You are a keyword generation assistant for a DM automation system. Given an example word, generate 8-10 similar keywords that are:
- Thematically related to the example
- Single words or very short phrases (1-2 words max)
- Lowercase
- Common words that customers might use in DMs
- Varied but contextually similar
Return ONLY a JSON array of strings, nothing else.`

      const userPrompt = type === 'topic'
        ? `Generate keywords for: ${prompt}`
        : `Generate keywords similar to: ${prompt}`

      const response = await fetch('/api/generate-keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt,
          userPrompt,
          automationId: id
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate keywords')
      }

      const result = await response.json()
      const keywords = result.keywords || []
      
      setGeneratedKeywords(keywords)
      
      // Update generation count
      const newCount = dailyGenerations + 1
      const today = new Date().toDateString()
      setDailyGenerations(newCount)
      setLastGenerationDate(today)
      
      // Save to storage
      try {
        await window.storage.set(`ai-gen-count-${id}`, newCount.toString())
        await window.storage.set(`ai-gen-date-${id}`, today)
        await window.storage.set(`ai-gen-keywords-${id}`, JSON.stringify(keywords))
      } catch (error) {
        console.log('Storage save error:', error)
      }

    } catch (error) {
      console.error('Error generating keywords:', error)
      alert('Failed to generate keywords. Please try again.')
    } finally {
      setIsGenerating(false)
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

  const existingKeywords = data?.data?.keywords?.map(k => k.word.toLowerCase()) || []
  const remainingGenerations = 5 - dailyGenerations

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
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-blue-500" />
            Manage Trigger Keywords
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual</TabsTrigger>
            <TabsTrigger value="ai" className="gap-2">
              <Sparkles className="h-4 w-4" />
              AI Generate
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-6 mt-4">
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

            {/* Suggested keywords */}
            <div className="space-y-3">
              <h4 className="font-medium text-foreground flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow" />
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
          </TabsContent>

          <TabsContent value="ai" className="space-y-6 mt-4">
            <Alert className="bg-purple-500/10 border-purple-500/30">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <AlertDescription className="text-purple-400">
                You have <strong>{remainingGenerations}</strong> AI generation{remainingGenerations !== 1 ? 's' : ''} remaining today
              </AlertDescription>
            </Alert>

            {/* AI Generation Methods */}
            <div className="space-y-4">
              {/* Topic-based generation */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Describe your keywords</label>
                <Textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g., keywords for a fitness coaching business, words customers use when asking about pricing..."
                  className="min-h-[80px]"
                  disabled={isGenerating}
                />
                <Button
                  onClick={() => generateKeywords('topic')}
                  disabled={isGenerating || !aiPrompt.trim() || dailyGenerations >= 5}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate from Description
                    </>
                  )}
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              {/* Example-based generation */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Give an example word</label>
                <Input
                  value={exampleWord}
                  onChange={(e) => setExampleWord(e.target.value)}
                  placeholder="e.g., pricing, support, demo..."
                  disabled={isGenerating}
                />
                <Button
                  onClick={() => generateKeywords('example')}
                  disabled={isGenerating || !exampleWord.trim() || dailyGenerations >= 5}
                  className="w-full"
                  variant="outline"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Similar Words
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Generated keywords */}
            {generatedKeywords.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground">Generated Keywords</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      generatedKeywords.forEach(kw => addGeneratedKeyword(kw))
                    }}
                    className="text-xs"
                  >
                    Add All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg border-2 border-dashed border-purple-500/30">
                  {generatedKeywords.map((keyword, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="gap-1 cursor-pointer hover:bg-purple-500/20 border-purple-500/50"
                      onClick={() => addGeneratedKeyword(keyword)}
                    >
                      <Plus className="h-3 w-3" />
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Current keywords - shown in both tabs */}
        <div className="space-y-3 pt-4 border-t">
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
      </DialogContent>
    </Dialog>
  )
}