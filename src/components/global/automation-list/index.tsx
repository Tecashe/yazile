// 'use client'
// import React, { useMemo, useEffect, useState } from 'react';
// import { usePaths } from '@/hooks/user-nav';
// import { Button } from '@/components/ui/button';
// import { useQueryAutomations } from '@/hooks/user-queries';
// import CreateAutomation from '../create-automation';
// import { useMutationDataState } from '@/hooks/use-mutation-data';
// import { useAutomationPosts } from '@/hooks/use-automations';
// import { FancyAutomationBox } from '../fancy/fancy-automation-box';

// type Keyword = {
//   id: string;
//   automationId: string | null;
//   word: string;
// };

// type Listener = {
//   id: string;
//   listener: string;
//   automationId: string;
//   prompt: string;
//   commentReply: string | null;
//   dmCount: number;
//   commentCount: number;
// };

// type Automation = {
//   id: string;
//   name: string;
//   active: boolean;
//   keywords: Keyword[];
//   createdAt: Date;
//   listener: Listener | null;
// };

// type Props = {
//   id: string;
// };

// const AutomationList = ({ id }: Props) => {
//   const { data, refetch } = useQueryAutomations();
//   const { deleteMutation } = useAutomationPosts(id);
//   const { latestVariable } = useMutationDataState(['create-automation']);
//   const { pathname } = usePaths();
 
//   const [automations, setAutomations] = useState<Automation[]>(data?.data || []);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [selectedAutomationId, setSelectedAutomationId] = useState<string | null>(null);

//   useEffect(() => {
//     if (data?.data) {
//       setAutomations(data.data);
//     }
//   }, [data]);

//   const handleDelete = (automationId: string) => {
//     deleteMutation(
//       { id: automationId },
//       {
//         onSuccess: () => {
//           console.log('Automation deleted successfully');
//           setAutomations((prev) => prev.filter((a) => a.id !== automationId));
//         },
//         onError: (error) => {
//           console.error('Error deleting automation:', error);
//         },
//       }
//     );
//   };

//   const optimisticUiData = useMemo(() => {
//     if (latestVariable?.variables && data) {
//       const test = [latestVariable.variables, ...automations];
//       return { data: test as Automation[] };
//     }
//     return { data: automations };
//   }, [latestVariable, automations]);

//   const activeAutomations = optimisticUiData.data.filter(automation => automation.active);
//   const inactiveAutomations = optimisticUiData.data.filter(automation => !automation.active);

//   if (!automations.length) {
//     return (
//       <div className="h-[70vh] flex justify-center items-center flex-col gap-y-3">
//         <h3 className="text-lg text-gray-400">No automations yet.</h3>
//         <h3 className="text-lg text-gray-400">Click the button to create one.</h3>
//         <CreateAutomation />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       <div>
//         <h2 className="text-2xl font-semibold mb-4">Your live automations</h2>
//         {activeAutomations.length > 0 ? (
//           <div className="flex flex-col gap-y-6">
//             {activeAutomations.map((automation) => (
//               <FancyAutomationBox
//                 key={automation.id}
//                 automation={automation}
//                 onDelete={() => {
//                   setSelectedAutomationId(automation.id);
//                   setShowConfirmModal(true);
//                 }}
//                 pathname={pathname ||'/'}
//               />
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-400">No active automations. Activate an automation to see it here.</p>
//         )}
//       </div>

//       {inactiveAutomations.length > 0 && (
//         <div>
//           <h2 className="text-2xl font-semibold mb-4">Inactive automations</h2>
//           <div className="flex flex-col gap-y-6">
//             {inactiveAutomations.map((automation) => (
//               <FancyAutomationBox
//                 key={automation.id}
//                 automation={automation}
//                 onDelete={() => {
//                   setSelectedAutomationId(automation.id);
//                   setShowConfirmModal(true);
//                 }}
//                 pathname={pathname ||'/'}
//               />
//             ))}
//           </div>
//         </div>
//       )}

//       {showConfirmModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-primary p-6 rounded-lg text-white shadow-lg w-80">
//             <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
//             <p className="text-sm mb-6">This action cannot be undone!</p>
//             <div className="flex justify-end gap-3">
//               <Button
//                 className="bg-gray-300 text-black hover:bg-gray-400"
//                 onClick={() => setShowConfirmModal(false)}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 className="bg-red-600 hover:bg-red-700"
//                 onClick={() => {
//                   if (selectedAutomationId) {
//                     handleDelete(selectedAutomationId);
//                   }
//                   setShowConfirmModal(false);
//                 }}
//               >
//                 Delete
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AutomationList;


// "use client"
// import { useMemo, useEffect, useState } from "react"
// import { usePaths } from "@/hooks/user-nav"
// import { Button } from "@/components/ui/button"
// import { useQueryAutomations } from "@/hooks/user-queries"
// import CreateAutomation from "../create-automation"
// import { useMutationDataState } from "@/hooks/use-mutation-data"
// import { useAutomationPosts } from "@/hooks/use-automations"
// import { FancyAutomationBox } from "../fancy/fancy-automation-box"
// import { AlertCircle, AlertTriangle, Trash2 } from "lucide-react"
// import { motion } from "framer-motion"

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

// type Automation = {
//   id: string
//   name: string
//   active: boolean
//   keywords: Keyword[]
//   createdAt: Date
//   listener: Listener | null
//   _isOptimistic?: boolean
// }

// type Props = {
//   id: string
// }

// const AutomationList = ({ id }: Props) => {
//   const { data, refetch } = useQueryAutomations()
//   const { deleteMutation } = useAutomationPosts(id)
//   const { latestVariable } = useMutationDataState(["create-automation"])
//   const { pathname } = usePaths()

//   const [automations, setAutomations] = useState<Automation[]>(data?.data || [])
//   const [showConfirmModal, setShowConfirmModal] = useState(false)
//   const [selectedAutomationId, setSelectedAutomationId] = useState<string | null>(null)

//   useEffect(() => {
//     if (data?.data) {
//       setAutomations(data.data)
//     }
//   }, [data])

//   const handleDelete = (automationId: string) => {
//     deleteMutation(
//       { id: automationId },
//       {
//         onSuccess: () => {
//           console.log("Automation deleted successfully")
//           // The optimistic UI will handle the UI update, so we don't need to manually update state here
//         },
//         // onError: (error) => {
//         //   console.error("Error deleting automation:", error)
//         // },
//       },
//     )
//   }

//   // Get all automations including optimistic ones
//   const optimisticUiData = useMemo(() => {
//     if (data?.data) {
//       // Make sure we're working with the latest data from the server
//       return { data: data.data as Automation[] }
//     }
//     return { data: [] as Automation[] }
//   }, [data])

//   // Separate optimistic automations for special styling
//   const optimisticAutomations = optimisticUiData.data.filter((automation) => automation._isOptimistic)
//   const regularAutomations = optimisticUiData.data.filter((automation) => !automation._isOptimistic)

//   // And update the activeAutomations and inactiveAutomations:
//   const activeAutomations = regularAutomations.filter((automation) => automation.active)
//   const inactiveAutomations = regularAutomations.filter((automation) => !automation.active)

//   if (!automations.length && !optimisticAutomations.length) {
//     return (
//       <div className="h-[70vh] flex justify-center items-center flex-col gap-y-3">
//         <h3 className="text-lg text-gray-400">No automations yet.</h3>
//         <h3 className="text-lg text-gray-400">Click the button to create one.</h3>
//         <CreateAutomation />
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-8">
//       {/* Optimistic automations section - show these at the top with special styling */}
//       {optimisticAutomations.length > 0 && (
//         <div>
//           <h2 className="text-2xl font-semibold mb-4">Creating automations...</h2>
//           <div className="flex flex-col gap-y-6">
//             {optimisticAutomations.map((automation) => (
//               <div key={automation.id} className="relative">
//                 {/* Overlay to indicate optimistic state */}
//                 <div className="absolute inset-0 bg-primary/5 rounded-lg z-10 pointer-events-none animate-pulse"></div>
//                 <FancyAutomationBox
//                   automation={{
//                     ...automation,
                    
//                   }}
//                   onDelete={() => {}} // Disable delete for optimistic entries
//                   pathname={pathname || "/"}
//                   isOptimistic={true}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       <div>
//         <h2 className="text-2xl font-semibold mb-4">Your live automations</h2>
//         {activeAutomations.length > 0 ? (
//           <div className="flex flex-col gap-y-6">
//             {activeAutomations
//               .filter((a) => !a._isOptimistic)
//               .map((automation) => (
//                 <FancyAutomationBox
//                   key={automation.id}
//                   automation={automation}
//                   onDelete={() => {
//                     setSelectedAutomationId(automation.id)
//                     setShowConfirmModal(true)
//                   }}
//                   pathname={pathname || "/"}
//                 />
//               ))}
//           </div>
//         ) : (
//           <p className="text-gray-400">No active automations. Activate an automation to see it here.</p>
//         )}
//       </div>

//       {inactiveAutomations.filter((a) => !a._isOptimistic).length > 0 && (
//         <div>
//           <h2 className="text-2xl font-semibold mb-4">Inactive automations</h2>
//           <div className="flex flex-col gap-y-6">
//             {inactiveAutomations
//               .filter((a) => !a._isOptimistic)
//               .map((automation) => (
//                 <FancyAutomationBox
//                   key={automation.id}
//                   automation={automation}
//                   onDelete={() => {
//                     setSelectedAutomationId(automation.id)
//                     setShowConfirmModal(true)
//                   }}
//                   pathname={pathname || "/"}
//                 />
//               ))}
//           </div>
//         </div>
//       )}

//       {showConfirmModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95, y: 20 }}
//           animate={{ opacity: 1, scale: 1, y: 0 }}
//           exit={{ opacity: 0, scale: 0.95, y: 20 }}
//           transition={{ duration: 0.2, ease: "easeOut" }}
//           className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-auto"
//         >
//           {/* Header */}
//           <div className="px-6 pt-6 pb-4">
//             <div className="flex items-center gap-3 mb-2">
//               <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
//                 <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
//               </div>
//               <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
//                 Confirm Deletion
//               </h2>
//             </div>
//             <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
//               Are you sure you want to delete this automation? This action cannot be undone and will permanently remove all associated data.
//             </p>
//           </div>

//           {/* Warning Box */}
//           <div className="mx-6 mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg">
//             <div className="flex items-start gap-2">
//               <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
//               <p className="text-sm text-red-800 dark:text-red-300 font-medium">
//                 This will permanently delete all leads, posts, and messages associated with this automation.
//               </p>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="px-6 pb-6 flex gap-3">
//             <Button
//               variant="outline"
//               className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
//               onClick={() => setShowConfirmModal(false)}
//             >
//               Cancel
//             </Button>
//             <Button
//               className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-sm transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
//               onClick={() => {
//                 if (selectedAutomationId) {
//                   handleDelete(selectedAutomationId);
//                 }
//                 setShowConfirmModal(false);
//               }}
//             >
//               <Trash2 className="w-4 h-4 mr-2" />
//               Delete Automation
//             </Button>
//           </div>
//         </motion.div>
//       </div>
//       )}
//     </div>
//   )
// }

// export default AutomationList

// "use client"

// import { useMemo, useEffect, useState } from "react"
// import { usePaths } from "@/hooks/user-nav"
// import { Button } from "@/components/ui/button"
// import { useQueryAutomations } from "@/hooks/user-queries"
// import CreateAutomation from "../create-automation"
// import { useMutationDataState } from "@/hooks/use-mutation-data"
// import { useAutomationPosts } from "@/hooks/use-automations"
// import { AlertTriangle, Trash2 } from "lucide-react"
// import { motion, AnimatePresence } from "framer-motion"
// import { LayoutGrid, List, Kanban, GanttChartSquare } from "lucide-react"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { getRelativeTime } from "@/lib/utils"
// import { format } from "date-fns"
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

// type Automation = {
//   id: string
//   name: string
//   active: boolean
//   keywords: Keyword[]
//   createdAt: Date
//   listener: Listener | null
//   _isOptimistic?: boolean
// }

// type Props = {
//   id: string
// }

// type ViewType = "list" | "grid" | "kanban" | "timeline"

// function ViewSelector({
//   currentView,
//   onViewChange
// }: {
//   currentView: ViewType
//   onViewChange: (view: ViewType) => void
// }) {
//   const views = [
//     { id: "list", icon: List, label: "List View" },
//     { id: "grid", icon: LayoutGrid, label: "Grid View" },
//     { id: "kanban", icon: Kanban, label: "Kanban View" },
//     { id: "timeline", icon: GanttChartSquare, label: "Timeline View" }
//   ]

//   return (
//     <div className="flex items-center gap-1 p-1 bg-background rounded-lg border border-border">
//       {views.map((view) => (
//         <Button
//           key={view.id}
//           variant="ghost"
//           size="icon"
//           className={`rounded-lg ${
//             currentView === view.id
//               ? "bg-primary/10 text-primary"
//               : "text-muted-foreground"
//           }`}
//           onClick={() => onViewChange(view.id as ViewType)}
//           title={view.label}
//         >
//           <view.icon className="h-5 w-5" />
//         </Button>
//       ))}
//     </div>
//   )
// }

// function AutomationGridCard({ 
//   automation, 
//   pathname 
// }: { 
//   automation: Automation
//   pathname: string
// }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.9 }}
//       animate={{ opacity: 1, scale: 1 }}
//       whileHover={{ y: -5 }}
//       className="h-full"
//     >
//       <Card className="h-full flex flex-col border-border hover:shadow-md transition-shadow">
//         <CardHeader className="pb-3">
//           <div className="flex justify-between items-start">
//             <CardTitle className="flex items-center gap-2">
//               {automation.name}
//               {automation._isOptimistic && (
//                 <Badge variant="secondary" className="animate-pulse">
//                   Creating
//                 </Badge>
//               )}
//             </CardTitle>
//           </div>
          
//           <div className="flex gap-2 flex-wrap">
//             {automation.keywords?.slice(0, 3).map((keyword, idx) => (
//               <Badge 
//                 key={keyword.id} 
//                 variant="outline"
//                 className={`
//                   ${idx % 3 === 0 ? 'border-green-500/30 text-green-500' : ''}
//                   ${idx % 3 === 1 ? 'border-purple-500/30 text-purple-500' : ''}
//                   ${idx % 3 === 2 ? 'border-yellow-500/30 text-yellow-500' : ''}
//                 `}
//               >
//                 {keyword.word}
//               </Badge>
//             ))}
//             {automation.keywords?.length > 3 && (
//               <Badge variant="outline">
//                 +{automation.keywords.length - 3}
//               </Badge>
//             )}
//           </div>
//         </CardHeader>
        
//         <CardContent className="flex-grow flex flex-col justify-between">
//           <div className="space-y-3">
//             <div className="flex items-center gap-2 text-sm text-muted-foreground">
//               <span>Created {getRelativeTime(automation.createdAt)}</span>
//             </div>
            
//             <div className="flex items-center gap-2">
//               {automation.listener?.listener === "SMARTAI" ? (
//                 <Badge className="bg-purple-500/10 text-purple-500">
//                   Smart AI
//                 </Badge>
//               ) : (
//                 <Badge variant="secondary">
//                   Standard
//                 </Badge>
//               )}
              
//               <Badge 
//                 variant={automation.active ? "default" : "secondary"} 
//                 className="flex items-center"
//               >
//                 {automation.active ? "Active" : "Paused"}
//               </Badge>
//             </div>
//           </div>
          
//           <Button 
//             asChild 
//             variant="outline" 
//             className="mt-4 w-full"
//             disabled={automation._isOptimistic}
//           >
//             <Link href={`${pathname}/${automation.id}`}>
//               Configure
//             </Link>
//           </Button>
//         </CardContent>
//       </Card>
//     </motion.div>
//   )
// }

// function AutomationKanbanCard({ 
//   automation, 
//   pathname 
// }: { 
//   automation: Automation
//   pathname: string
// }) {
//   return (
//     <motion.div
//       layout
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="mb-3 last:mb-0"
//     >
//       <Card className="border-border hover:shadow-sm transition-shadow">
//         <CardHeader className="pb-2">
//           <div className="flex justify-between">
//             <CardTitle className="text-base">{automation.name}</CardTitle>
//           </div>
//         </CardHeader>
        
//         <CardContent>
//           <div className="flex justify-between items-center mb-3">
//             <Badge 
//               variant={automation.active ? "default" : "secondary"} 
//               className="flex items-center"
//             >
//               {automation.active ? "Active" : "Paused"}
//             </Badge>
//           </div>
          
//           <div className="flex flex-wrap gap-1 mb-3">
//             {automation.keywords?.slice(0, 2).map((keyword) => (
//               <Badge 
//                 key={keyword.id} 
//                 variant="outline"
//                 className="text-xs px-2 py-0.5"
//               >
//                 {keyword.word}
//               </Badge>
//             ))}
//             {automation.keywords?.length > 2 && (
//               <Badge variant="outline" className="text-xs px-2 py-0.5">
//                 +{automation.keywords.length - 2}
//               </Badge>
//             )}
//           </div>
          
//           <Button 
//             asChild 
//             variant="outline" 
//             size="sm"
//             className="w-full"
//             disabled={automation._isOptimistic}
//           >
//             <Link href={`${pathname}/${automation.id}`}>
//               Configure
//             </Link>
//           </Button>
//         </CardContent>
//       </Card>
//     </motion.div>
//   )
// }

// function AutomationListItem({ 
//   automation, 
//   pathname 
// }: { 
//   automation: Automation
//   pathname: string
// }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="border-b border-border last:border-0 py-4"
//     >
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <div className="flex flex-col">
//             <div className="flex items-center gap-2">
//               <h3 className="font-medium">{automation.name}</h3>
//               {automation._isOptimistic && (
//                 <Badge variant="secondary" className="animate-pulse">
//                   Creating
//                 </Badge>
//               )}
//             </div>
            
//             <div className="flex items-center gap-2 mt-1">
//               <Badge 
//                 variant={automation.active ? "default" : "secondary"} 
//                 className="flex items-center text-xs"
//               >
//                 {automation.active ? "Active" : "Paused"}
//               </Badge>
              
//               <div className="flex items-center text-muted-foreground text-sm">
//                 {getRelativeTime(automation.createdAt)}
//               </div>
              
//               {automation.listener?.listener === "SMARTAI" ? (
//                 <Badge className="bg-purple-500/10 text-purple-500 text-xs">
//                   Smart AI
//                 </Badge>
//               ) : (
//                 <Badge variant="secondary" className="text-xs">
//                   Standard
//                 </Badge>
//               )}
//             </div>
//           </div>
//         </div>
        
//         <div className="flex items-center gap-2">
//           <div className="flex gap-1">
//             {automation.keywords?.slice(0, 2).map((keyword) => (
//               <Badge 
//                 key={keyword.id} 
//                 variant="outline"
//                 className="text-xs"
//               >
//                 {keyword.word}
//               </Badge>
//             ))}
//             {automation.keywords?.length > 2 && (
//               <Badge variant="outline" className="text-xs">
//                 +{automation.keywords.length - 2}
//               </Badge>
//             )}
//           </div>
          
//           <Button 
//             asChild 
//             variant="outline" 
//             size="sm"
//             disabled={automation._isOptimistic}
//           >
//             <Link href={`${pathname}/${automation.id}`}>
//               Configure
//             </Link>
//           </Button>
//         </div>
//       </div>
//     </motion.div>
//   )
// }

// function AutomationTimelineItem({ 
//   automation, 
//   pathname 
// }: { 
//   automation: Automation
//   pathname: string
// }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="relative pl-8 pb-8 border-l-2 border-border last:border-0 last:pb-0"
//     >
//       <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-background"></div>
      
//       <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
//         <div>
//           <div className="flex items-center gap-2 mb-1">
//             <h3 className="font-medium">{automation.name}</h3>
//             {automation._isOptimistic && (
//               <Badge variant="secondary" className="animate-pulse">
//                 Creating
//               </Badge>
//             )}
//           </div>
          
//           <div className="text-sm text-muted-foreground mb-2">
//             Created on {format(new Date(automation.createdAt), "MMM d, yyyy")}
//           </div>
          
//           <div className="flex flex-wrap gap-1 mb-3">
//             {automation.keywords?.slice(0, 3).map((keyword) => (
//               <Badge 
//                 key={keyword.id} 
//                 variant="outline"
//                 className="text-xs"
//               >
//                 {keyword.word}
//               </Badge>
//             ))}
//             {automation.keywords?.length > 3 && (
//               <Badge variant="outline" className="text-xs">
//                 +{automation.keywords.length - 3}
//               </Badge>
//             )}
//           </div>
          
//           <div className="flex items-center gap-2">
//             <Badge 
//               variant={automation.active ? "default" : "secondary"} 
//               className="flex items-center text-xs"
//             >
//               {automation.active ? "Active" : "Paused"}
//             </Badge>
            
//             {automation.listener?.listener === "SMARTAI" ? (
//               <Badge className="bg-purple-500/10 text-purple-500 text-xs">
//                 Smart AI
//               </Badge>
//             ) : (
//               <Badge variant="secondary" className="text-xs">
//                 Standard
//               </Badge>
//             )}
//           </div>
//         </div>
        
//         <div className="flex gap-2">
//           <Button 
//             asChild 
//             variant="outline" 
//             size="sm"
//             disabled={automation._isOptimistic}
//           >
//             <Link href={`${pathname}/${automation.id}`}>
//               Configure
//             </Link>
//           </Button>
//         </div>
//       </div>
//     </motion.div>
//   )
// }

// const AutomationList = ({ id }: Props) => {
//   const { data, refetch } = useQueryAutomations()
//   const { deleteMutation } = useAutomationPosts(id)
//   const { latestVariable } = useMutationDataState(["create-automation"])
//   const { pathname } = usePaths()

//   const [automations, setAutomations] = useState<Automation[]>(data?.data || [])
//   const [showConfirmModal, setShowConfirmModal] = useState(false)
//   const [selectedAutomationId, setSelectedAutomationId] = useState<string | null>(null)
//   const [view, setView] = useState<ViewType>("list")

//   useEffect(() => {
//     if (data?.data) {
//       setAutomations(data.data)
//     }
//   }, [data])

//   const handleDelete = (automationId: string) => {
//     deleteMutation(
//       { id: automationId },
//       {
//         onSuccess: () => {
//           console.log("Automation deleted successfully")
//         }
//       }
//     )
//   }

//   const optimisticUiData = useMemo(() => {
//     if (data?.data) {
//       return { data: data.data as Automation[] }
//     }
//     return { data: [] as Automation[] }
//   }, [data])

//   const optimisticAutomations = optimisticUiData.data.filter((automation) => automation._isOptimistic)
//   const regularAutomations = optimisticUiData.data.filter((automation) => !automation._isOptimistic)
//   const activeAutomations = regularAutomations.filter((automation) => automation.active)
//   const inactiveAutomations = regularAutomations.filter((automation) => !automation.active)

//   if (!automations.length && !optimisticAutomations.length) {
//     return (
//       <div className="h-[70vh] flex justify-center items-center flex-col gap-y-3">
//         <h3 className="text-lg text-gray-400">No automations yet.</h3>
//         <h3 className="text-lg text-gray-400">Click the button to create one.</h3>
//         <CreateAutomation />
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-semibold">Automations</h2>
//         <div className="flex items-center gap-3">
//           <ViewSelector currentView={view} onViewChange={setView} />
//           <CreateAutomation />
//         </div>
//       </div>

//       {view === "list" && (
//         <div className="bg-background rounded-xl border border-border p-4">
//           {optimisticAutomations.length > 0 && (
//             <div className="mb-6">
//               <h3 className="text-lg font-medium mb-3 text-muted-foreground">
//                 Creating automations...
//               </h3>
//               <div className="space-y-4">
//                 {optimisticAutomations.map((automation) => (
//                   <AutomationListItem
//                     key={automation.id}
//                     automation={automation}
//                     pathname={pathname || "/"}
//                   />
//                 ))}
//               </div>
//             </div>
//           )}

//           {activeAutomations.length > 0 && (
//             <div className="mb-6">
//               <h3 className="text-lg font-medium mb-3">Active Automations</h3>
//               <div className="space-y-4">
//                 {activeAutomations.map((automation) => (
//                   <AutomationListItem
//                     key={automation.id}
//                     automation={automation}
//                     pathname={pathname || "/"}
//                   />
//                 ))}
//               </div>
//             </div>
//           )}

//           {inactiveAutomations.length > 0 && (
//             <div>
//               <h3 className="text-lg font-medium mb-3">Inactive Automations</h3>
//               <div className="space-y-4">
//                 {inactiveAutomations.map((automation) => (
//                   <AutomationListItem
//                     key={automation.id}
//                     automation={automation}
//                     pathname={pathname || "/"}
//                   />
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {view === "grid" && (
//         <div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//             {optimisticAutomations.map((automation) => (
//               <AutomationGridCard
//                 key={automation.id}
//                 automation={automation}
//                 pathname={pathname || "/"}
//               />
//             ))}
//             {activeAutomations.map((automation) => (
//               <AutomationGridCard
//                 key={automation.id}
//                 automation={automation}
//                 pathname={pathname || "/"}
//               />
//             ))}
//             {inactiveAutomations.map((automation) => (
//               <AutomationGridCard
//                 key={automation.id}
//                 automation={automation}
//                 pathname={pathname || "/"}
//               />
//             ))}
//           </div>
//         </div>
//       )}

//       {view === "kanban" && (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//           <div className="bg-background rounded-xl border border-border p-4">
//             <h3 className="font-medium mb-3">Creating</h3>
//             <div>
//               {optimisticAutomations.map((automation) => (
//                 <AutomationKanbanCard
//                   key={automation.id}
//                   automation={automation}
//                   pathname={pathname || "/"}
//                 />
//               ))}
//             </div>
//           </div>
          
//           <div className="bg-background rounded-xl border border-border p-4">
//             <h3 className="font-medium mb-3">Active ({activeAutomations.length})</h3>
//             <div>
//               {activeAutomations.map((automation) => (
//                 <AutomationKanbanCard
//                   key={automation.id}
//                   automation={automation}
//                   pathname={pathname || "/"}
//                 />
//               ))}
//             </div>
//           </div>
          
//           <div className="bg-background rounded-xl border border-border p-4">
//             <h3 className="font-medium mb-3">Paused ({inactiveAutomations.length})</h3>
//             <div>
//               {inactiveAutomations.map((automation) => (
//                 <AutomationKanbanCard
//                   key={automation.id}
//                   automation={automation}
//                   pathname={pathname || "/"}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {view === "timeline" && (
//         <div className="relative">
//           <div className="pl-8">
//             {optimisticAutomations.length > 0 && (
//               <div className="mb-8">
//                 <h3 className="text-lg font-medium mb-4 text-muted-foreground">
//                   Creating automations...
//                 </h3>
//                 {optimisticAutomations.map((automation) => (
//                   <AutomationTimelineItem
//                     key={automation.id}
//                     automation={automation}
//                     pathname={pathname || "/"}
//                   />
//                 ))}
//               </div>
//             )}

//             {activeAutomations.length > 0 && (
//               <div className="mb-8">
//                 <h3 className="text-lg font-medium mb-4">Active Automations</h3>
//                 {activeAutomations.map((automation) => (
//                   <AutomationTimelineItem
//                     key={automation.id}
//                     automation={automation}
//                     pathname={pathname || "/"}
//                   />
//                 ))}
//               </div>
//             )}

//             {inactiveAutomations.length > 0 && (
//               <div>
//                 <h3 className="text-lg font-medium mb-4">Inactive Automations</h3>
//                 {inactiveAutomations.map((automation) => (
//                   <AutomationTimelineItem
//                     key={automation.id}
//                     automation={automation}
//                     pathname={pathname || "/"}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {showConfirmModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95, y: 20 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.95, y: 20 }}
//             transition={{ duration: 0.2, ease: "easeOut" }}
//             className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-auto"
//           >
//             <div className="px-6 pt-6 pb-4">
//               <div className="flex items-center gap-3 mb-2">
//                 <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
//                   <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
//                 </div>
//                 <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
//                   Confirm Deletion
//                 </h2>
//               </div>
//               <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
//                 Are you sure you want to delete this automation? This action cannot be undone and will permanently remove all associated data.
//               </p>
//             </div>

//             <div className="mx-6 mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg">
//               <div className="flex items-start gap-2">
//                 <p className="text-sm text-red-800 dark:text-red-300 font-medium">
//                   This will permanently delete all leads, posts, and messages associated with this automation.
//                 </p>
//               </div>
//             </div>

//             <div className="px-6 pb-6 flex gap-3">
//               <Button
//                 variant="outline"
//                 className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
//                 onClick={() => setShowConfirmModal(false)}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-sm transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
//                 onClick={() => {
//                   if (selectedAutomationId) {
//                     handleDelete(selectedAutomationId);
//                   }
//                   setShowConfirmModal(false);
//                 }}
//               >
//                 <Trash2 className="w-4 h-4 mr-2" />
//                 Delete Automation
//               </Button>
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default AutomationList

// components/global/automation-list.tsx (updated)
"use client"

import { useMemo, useEffect, useState } from "react"
import { usePaths } from "@/hooks/user-nav"
import { Button } from "@/components/ui/button"
import { useQueryAutomations } from "@/hooks/user-queries"
import CreateAutomation from "../create-automation"
import { useMutationDataState } from "@/hooks/use-mutation-data"
import { useAutomationPosts } from "@/hooks/use-automations"
import { AlertCircle, AlertTriangle, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { AutomationViewSelector, ViewType } from "../fancy/automation-view-selector"
import { AutomationGridCard } from "../fancy/automation-grid-card"
import { AutomationKanbanCard } from "../fancy/automation-kanban-card"
import { AutomationListItem } from "../fancy/automation-list-item"
import { AutomationTimelineItem } from "../fancy/automation-timeline-item"

// ... (existing type definitions remain the same)
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

type Automation = {
  id: string
  name: string
  active: boolean
  keywords: Keyword[]
  createdAt: Date
  listener: Listener | null
  _isOptimistic?: boolean
}

type Props = {
  id: string
}

const AutomationList = ({ id }: Props) => {
  const [view, setView] = useState<ViewType>("list")
  const { data, refetch } = useQueryAutomations()
  const { deleteMutation } = useAutomationPosts(id)
  const { latestVariable } = useMutationDataState(["create-automation"])
  const { pathname } = usePaths()
  const [automations, setAutomations] = useState<Automation[]>(data?.data || [])
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedAutomationId, setSelectedAutomationId] = useState<string | null>(null)

  useEffect(() => {
    if (data?.data) {
      setAutomations(data.data)
    }
  }, [data])

  const handleDelete = (automationId: string) => {
    deleteMutation(
      { id: automationId },
      {
        onSuccess: () => {
          console.log("Automation deleted successfully")
          // The optimistic UI will handle the UI update, so we don't need to manually update state here
        },
        // onError: (error) => {
        //   console.error("Error deleting automation:", error)
        // },
      },
    )
  }

  // Get all automations including optimistic ones
  const optimisticUiData = useMemo(() => {
    if (data?.data) {
      // Make sure we're working with the latest data from the server
      return { data: data.data as Automation[] }
    }
    return { data: [] as Automation[] }
  }, [data])

  // Separate optimistic automations for special styling
  const optimisticAutomations = optimisticUiData.data.filter((automation) => automation._isOptimistic)
  const regularAutomations = optimisticUiData.data.filter((automation) => !automation._isOptimistic)

  // And update the activeAutomations and inactiveAutomations:
  const activeAutomations = regularAutomations.filter((automation) => automation.active)
  const inactiveAutomations = regularAutomations.filter((automation) => !automation.active)

  if (!automations.length && !optimisticAutomations.length) {
    return (
      <div className="h-[70vh] flex justify-center items-center flex-col gap-y-3">
        <h3 className="text-lg text-gray-400">No automations yet.</h3>
        <h3 className="text-lg text-gray-400">Click the button to create one.</h3>
        <CreateAutomation />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Automations</h2>
        <div className="flex items-center gap-3">
          <AutomationViewSelector currentView={view} onViewChange={setView} />
          <CreateAutomation />
        </div>
      </div>

      {/* View-specific rendering */}
      {view === "list" && (
        <div className="bg-background rounded-xl border border-border p-4">
          {optimisticAutomations.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3 text-muted-foreground">
                Creating automations...
              </h3>
              <div className="space-y-4">
                {optimisticAutomations.map((automation) => (
                  <AutomationListItem
                    key={automation.id}
                    automation={automation}
                    pathname={pathname || "/"}
                  />
                ))}
              </div>
            </div>
          )}

          {activeAutomations.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Active Automations</h3>
              <div className="space-y-4">
                {activeAutomations.map((automation) => (
                  <AutomationListItem
                    key={automation.id}
                    automation={automation}
                    pathname={pathname || "/"}
                  />
                ))}
              </div>
            </div>
          )}

          {inactiveAutomations.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3">Inactive Automations</h3>
              <div className="space-y-4">
                {inactiveAutomations.map((automation) => (
                  <AutomationListItem
                    key={automation.id}
                    automation={automation}
                    pathname={pathname || "/"}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {view === "grid" && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {optimisticAutomations.map((automation) => (
              <AutomationGridCard
                key={automation.id}
                automation={automation}
                pathname={pathname || "/"}
              />
            ))}
            {activeAutomations.map((automation) => (
              <AutomationGridCard
                key={automation.id}
                automation={automation}
                pathname={pathname || "/"}
              />
            ))}
            {inactiveAutomations.map((automation) => (
              <AutomationGridCard
                key={automation.id}
                automation={automation}
                pathname={pathname || "/"}
              />
            ))}
          </div>
        </div>
      )}

      {view === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-background rounded-xl border border-border p-4">
            <h3 className="font-medium mb-3">Draft</h3>
            <div>
              {optimisticAutomations.map((automation) => (
                <AutomationKanbanCard
                  key={automation.id}
                  automation={automation}
                  pathname={pathname || "/"}
                />
              ))}
            </div>
          </div>
          
          <div className="bg-background rounded-xl border border-border p-4">
            <h3 className="font-medium mb-3">Active ({activeAutomations.length})</h3>
            <div>
              {activeAutomations.map((automation) => (
                <AutomationKanbanCard
                  key={automation.id}
                  automation={automation}
                  pathname={pathname || "/"}
                />
              ))}
            </div>
          </div>
          
          <div className="bg-background rounded-xl border border-border p-4">
            <h3 className="font-medium mb-3">Paused ({inactiveAutomations.length})</h3>
            <div>
              {inactiveAutomations.map((automation) => (
                <AutomationKanbanCard
                  key={automation.id}
                  automation={automation}
                  pathname={pathname || "/"}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {view === "timeline" && (
        <div className="relative">
          <div className="pl-8">
            {optimisticAutomations.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4 text-muted-foreground">
                  Creating automations...
                </h3>
                {optimisticAutomations.map((automation) => (
                  <AutomationTimelineItem
                    key={automation.id}
                    automation={automation}
                    pathname={pathname || "/"}
                  />
                ))}
              </div>
            )}

            {activeAutomations.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Active Automations</h3>
                {activeAutomations.map((automation) => (
                  <AutomationTimelineItem
                    key={automation.id}
                    automation={automation}
                    pathname={pathname || "/"}
                  />
                ))}
              </div>
            )}

            {inactiveAutomations.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4">Inactive Automations</h3>
                {inactiveAutomations.map((automation) => (
                  <AutomationTimelineItem
                    key={automation.id}
                    automation={automation}
                    pathname={pathname || "/"}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

     {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-auto"
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Confirm Deletion
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Are you sure you want to delete this automation? This action cannot be undone and will permanently remove all associated data.
            </p>
          </div>

          {/* Warning Box */}
          <div className="mx-6 mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-800 dark:text-red-300 font-medium">
                This will permanently delete all leads, posts, and messages associated with this automation.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setShowConfirmModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-sm transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              onClick={() => {
                if (selectedAutomationId) {
                  handleDelete(selectedAutomationId);
                }
                setShowConfirmModal(false);
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Automation
            </Button>
          </div>
        </motion.div>
      </div>
      )}
    </div>
  )
}

export default AutomationList





















// "use client"
// import { useMemo, useEffect, useState } from "react"
// import { usePaths } from "@/hooks/user-nav"
// import { Button } from "@/components/ui/button"
// import { useQueryAutomations } from "@/hooks/user-queries"
// import CreateAutomation from "../create-automation"
// import { useMutationDataState } from "@/hooks/use-mutation-data"
// import { useAutomationPosts } from "@/hooks/use-automations"
// import { FancyAutomationBox } from "../fancy/fancy-automation-box"
// import { AlertCircle, AlertTriangle, Trash2 } from "lucide-react"
// import { motion } from "framer-motion"

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

// type Automation = {
//   id: string
//   name: string
//   active: boolean
//   keywords: Keyword[]
//   createdAt: Date
//   listener: Listener | null
//   _isOptimistic?: boolean
// }

// type Props = {
//   id: string
// }

// const AutomationList = ({ id }: Props) => {
//   const { data, refetch } = useQueryAutomations()
//   const { deleteMutation } = useAutomationPosts(id)
//   const { latestVariable } = useMutationDataState(["create-automation"])
//   const { pathname } = usePaths()

//   const [automations, setAutomations] = useState<Automation[]>(data?.data || [])
//   const [showConfirmModal, setShowConfirmModal] = useState(false)
//   const [selectedAutomationId, setSelectedAutomationId] = useState<string | null>(null)

//   useEffect(() => {
//     if (data?.data) {
//       setAutomations(data.data)
//     }
//   }, [data])

//   const handleDelete = (automationId: string) => {
//     deleteMutation(
//       { id: automationId },
//       {
//         onSuccess: () => {
//           console.log("Automation deleted successfully")
//           // The optimistic UI will handle the UI update, so we don't need to manually update state here
//         },
//         // onError: (error) => {
//         //   console.error("Error deleting automation:", error)
//         // },
//       },
//     )
//   }

//   // Get all automations including optimistic ones
//   const optimisticUiData = useMemo(() => {
//     if (data?.data) {
//       // Make sure we're working with the latest data from the server
//       return { data: data.data as Automation[] }
//     }
//     return { data: [] as Automation[] }
//   }, [data])

//   // Separate optimistic automations for special styling
//   const optimisticAutomations = optimisticUiData.data.filter((automation) => automation._isOptimistic)
//   const regularAutomations = optimisticUiData.data.filter((automation) => !automation._isOptimistic)

//   // And update the activeAutomations and inactiveAutomations:
//   const activeAutomations = regularAutomations.filter((automation) => automation.active)
//   const inactiveAutomations = regularAutomations.filter((automation) => !automation.active)

//   if (!automations.length && !optimisticAutomations.length) {
//     return (
//       <div className="h-[70vh] flex justify-center items-center flex-col gap-y-3">
//         <h3 className="text-lg text-gray-400">No automations yet.</h3>
//         <h3 className="text-lg text-gray-400">Click the button to create one.</h3>
//         <CreateAutomation />
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-8">
//       {/* Optimistic automations section - show these at the top with special styling */}
//       {optimisticAutomations.length > 0 && (
//         <div>
//           <h2 className="text-2xl font-semibold mb-4">Creating automations...</h2>
//           <div className="flex flex-col gap-y-6">
//             {optimisticAutomations.map((automation) => (
//               <div key={automation.id} className="relative">
//                 {/* Overlay to indicate optimistic state */}
//                 <div className="absolute inset-0 bg-primary/5 rounded-lg z-10 pointer-events-none animate-pulse"></div>
//                 <FancyAutomationBox
//                   automation={{
//                     ...automation,
                    
//                   }}
//                   onDelete={() => {}} // Disable delete for optimistic entries
//                   pathname={pathname || "/"}
//                   isOptimistic={true}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       <div>
//         <h2 className="text-2xl font-semibold mb-4">Your live automations</h2>
//         {activeAutomations.length > 0 ? (
//           <div className="flex flex-col gap-y-6">
//             {activeAutomations
//               .filter((a) => !a._isOptimistic)
//               .map((automation) => (
//                 <FancyAutomationBox
//                   key={automation.id}
//                   automation={automation}
//                   onDelete={() => {
//                     setSelectedAutomationId(automation.id)
//                     setShowConfirmModal(true)
//                   }}
//                   pathname={pathname || "/"}
//                 />
//               ))}
//           </div>
//         ) : (
//           <p className="text-gray-400">No active automations. Activate an automation to see it here.</p>
//         )}
//       </div>

//       {inactiveAutomations.filter((a) => !a._isOptimistic).length > 0 && (
//         <div>
//           <h2 className="text-2xl font-semibold mb-4">Inactive automations</h2>
//           <div className="flex flex-col gap-y-6">
//             {inactiveAutomations
//               .filter((a) => !a._isOptimistic)
//               .map((automation) => (
//                 <FancyAutomationBox
//                   key={automation.id}
//                   automation={automation}
//                   onDelete={() => {
//                     setSelectedAutomationId(automation.id)
//                     setShowConfirmModal(true)
//                   }}
//                   pathname={pathname || "/"}
//                 />
//               ))}
//           </div>
//         </div>
//       )}

//       {showConfirmModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95, y: 20 }}
//           animate={{ opacity: 1, scale: 1, y: 0 }}
//           exit={{ opacity: 0, scale: 0.95, y: 20 }}
//           transition={{ duration: 0.2, ease: "easeOut" }}
//           className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-auto"
//         >
//           {/* Header */}
//           <div className="px-6 pt-6 pb-4">
//             <div className="flex items-center gap-3 mb-2">
//               <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
//                 <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
//               </div>
//               <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
//                 Confirm Deletion
//               </h2>
//             </div>
//             <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
//               Are you sure you want to delete this automation? This action cannot be undone and will permanently remove all associated data.
//             </p>
//           </div>

//           {/* Warning Box */}
//           <div className="mx-6 mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg">
//             <div className="flex items-start gap-2">
//               <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
//               <p className="text-sm text-red-800 dark:text-red-300 font-medium">
//                 This will permanently delete all leads, posts, and messages associated with this automation.
//               </p>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="px-6 pb-6 flex gap-3">
//             <Button
//               variant="outline"
//               className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
//               onClick={() => setShowConfirmModal(false)}
//             >
//               Cancel
//             </Button>
//             <Button
//               className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-sm transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
//               onClick={() => {
//                 if (selectedAutomationId) {
//                   handleDelete(selectedAutomationId);
//                 }
//                 setShowConfirmModal(false);
//               }}
//             >
//               <Trash2 className="w-4 h-4 mr-2" />
//               Delete Automation
//             </Button>
//           </div>
//         </motion.div>
//       </div>
//       )}
//     </div>
//   )
// }

// export default AutomationList