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
// import { AlertCircle, AlertTriangle, Trash2, Plus } from "lucide-react"
// import { motion } from "framer-motion"
// import { AutomationViewSelector, type ViewType } from "../fancy/automation-view-selector"
// import { AutomationGridCard } from "../fancy/automation-grid-card"
// import { AutomationKanbanCard } from "../fancy/automation-kanban-card"
// import { AutomationListItem } from "../fancy/automation-list-item"
// import { AutomationTimelineItem } from "../fancy/automation-timeline-item"

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
//   const [view, setView] = useState<ViewType>("grid")
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
//         },
//       },
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
//       <div className="flex flex-col items-center justify-center py-20">
//         <div className="text-center max-w-md">
//           <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
//             <Plus className="w-8 h-8 text-muted-foreground" />
//           </div>
//           <h3 className="text-xl font-semibold text-foreground mb-2">No automations yet</h3>
//           <p className="text-muted-foreground mb-6">
//             Get started by creating your first automation to streamline your workflow.
//           </p>
//           <CreateAutomation />
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-foreground">Automations</h2>
//           <p className="text-muted-foreground">
//             Manage your {optimisticUiData.data.length} automation{optimisticUiData.data.length !== 1 ? "s" : ""}
//           </p>
//         </div>
//         <div className="flex items-center gap-3">
//           <AutomationViewSelector currentView={view} onViewChange={setView} />
//           <CreateAutomation />
//         </div>
//       </div>

//       {/* View-specific rendering */}
//       {view === "list" && (
//         <div className="space-y-6">
//           {optimisticAutomations.length > 0 && (
//             <div>
//               <h3 className="text-lg font-medium mb-4 text-muted-foreground flex items-center gap-2">
//                 <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
//                 Creating automations...
//               </h3>
//               <div className="space-y-2">
//                 {optimisticAutomations.map((automation) => (
//                   <AutomationListItem key={automation.id} automation={automation} pathname={pathname || "/"} />
//                 ))}
//               </div>
//             </div>
//           )}

//           {activeAutomations.length > 0 && (
//             <div>
//               <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
//                 <div className="w-2 h-2 bg-green-500 rounded-full" />
//                 Active Automations ({activeAutomations.length})
//               </h3>
//               <div className="space-y-2">
//                 {activeAutomations.map((automation) => (
//                   <AutomationListItem
//                     key={automation.id}
//                     automation={automation}
//                     pathname={pathname || "/"}
//                     onDelete={() => {
//                       setSelectedAutomationId(automation.id)
//                       setShowConfirmModal(true)
//                     }}
//                   />
//                 ))}
//               </div>
//             </div>
//           )}

//           {inactiveAutomations.length > 0 && (
//             <div>
//               <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
//                 <div className="w-2 h-2 bg-muted-foreground rounded-full" />
//                 Paused Automations ({inactiveAutomations.length})
//               </h3>
//               <div className="space-y-2">
//                 {inactiveAutomations.map((automation) => (
//                   <AutomationListItem
//                     key={automation.id}
//                     automation={automation}
//                     pathname={pathname || "/"}
//                     onDelete={() => {
//                       setSelectedAutomationId(automation.id)
//                       setShowConfirmModal(true)
//                     }}
//                   />
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {view === "grid" && (
//         <div className="space-y-8">
//           {optimisticAutomations.length > 0 && (
//             <div>
//               <h3 className="text-lg font-medium mb-4 text-muted-foreground flex items-center gap-2">
//                 <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
//                 Creating automations...
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {optimisticAutomations.map((automation) => (
//                   <AutomationGridCard key={automation.id} automation={automation} pathname={pathname || "/"} />
//                 ))}
//               </div>
//             </div>
//           )}

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {activeAutomations.map((automation) => (
//               <AutomationGridCard
//                 key={automation.id}
//                 automation={automation}
//                 pathname={pathname || "/"}
//                 onDelete={() => {
//                   setSelectedAutomationId(automation.id)
//                   setShowConfirmModal(true)
//                 }}
//               />
//             ))}
//             {inactiveAutomations.map((automation) => (
//               <AutomationGridCard
//                 key={automation.id}
//                 automation={automation}
//                 pathname={pathname || "/"}
//                 onDelete={() => {
//                   setSelectedAutomationId(automation.id)
//                   setShowConfirmModal(true)
//                 }}
//               />
//             ))}
//           </div>
//         </div>
//       )}

//       {view === "kanban" && (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="space-y-4">
//             <div className="flex items-center gap-2 p-4 bg-muted/30 rounded-lg">
//               <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
//               <h3 className="font-medium">Draft ({optimisticAutomations.length})</h3>
//             </div>
//             <div className="space-y-3">
//               {optimisticAutomations.map((automation) => (
//                 <AutomationKanbanCard key={automation.id} automation={automation} pathname={pathname || "/"} />
//               ))}
//             </div>
//           </div>

//           <div className="space-y-4">
//             <div className="flex items-center gap-2 p-4 bg-muted/30 rounded-lg">
//               <div className="w-3 h-3 bg-green-500 rounded-full" />
//               <h3 className="font-medium">Active ({activeAutomations.length})</h3>
//             </div>
//             <div className="space-y-3">
//               {activeAutomations.map((automation) => (
//                 <AutomationKanbanCard
//                   key={automation.id}
//                   automation={automation}
//                   pathname={pathname || "/"}
//                   onDelete={() => {
//                     setSelectedAutomationId(automation.id)
//                     setShowConfirmModal(true)
//                   }}
//                 />
//               ))}
//             </div>
//           </div>

//           <div className="space-y-4">
//             <div className="flex items-center gap-2 p-4 bg-muted/30 rounded-lg">
//               <div className="w-3 h-3 bg-muted-foreground rounded-full" />
//               <h3 className="font-medium">Paused ({inactiveAutomations.length})</h3>
//             </div>
//             <div className="space-y-3">
//               {inactiveAutomations.map((automation) => (
//                 <AutomationKanbanCard
//                   key={automation.id}
//                   automation={automation}
//                   pathname={pathname || "/"}
//                   onDelete={() => {
//                     setSelectedAutomationId(automation.id)
//                     setShowConfirmModal(true)
//                   }}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {view === "timeline" && (
//         <div className="relative max-w-4xl">
//           {optimisticAutomations.length > 0 && (
//             <div className="mb-8">
//               <h3 className="text-lg font-medium mb-4 text-muted-foreground flex items-center gap-2">
//                 <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
//                 Creating automations...
//               </h3>
//               {optimisticAutomations.map((automation) => (
//                 <AutomationTimelineItem key={automation.id} automation={automation} pathname={pathname || "/"} />
//               ))}
//             </div>
//           )}

//           {activeAutomations.length > 0 && (
//             <div className="mb-8">
//               <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
//                 <div className="w-2 h-2 bg-green-500 rounded-full" />
//                 Active Automations
//               </h3>
//               {activeAutomations.map((automation) => (
//                 <AutomationTimelineItem
//                   key={automation.id}
//                   automation={automation}
//                   pathname={pathname || "/"}
//                   onDelete={() => {
//                     setSelectedAutomationId(automation.id)
//                     setShowConfirmModal(true)
//                   }}
//                 />
//               ))}
//             </div>
//           )}

//           {inactiveAutomations.length > 0 && (
//             <div>
//               <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
//                 <div className="w-2 h-2 bg-muted-foreground rounded-full" />
//                 Paused Automations
//               </h3>
//               {inactiveAutomations.map((automation) => (
//                 <AutomationTimelineItem
//                   key={automation.id}
//                   automation={automation}
//                   pathname={pathname || "/"}
//                   onDelete={() => {
//                     setSelectedAutomationId(automation.id)
//                     setShowConfirmModal(true)
//                   }}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {showConfirmModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95, y: 20 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.95, y: 20 }}
//             transition={{ duration: 0.2, ease: "easeOut" }}
//             className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-md mx-auto"
//           >
//             <div className="px-6 pt-6 pb-4">
//               <div className="flex items-center gap-3 mb-2">
//                 <div className="flex-shrink-0 w-10 h-10 bg-destructive/20 rounded-full flex items-center justify-center">
//                   <AlertTriangle className="w-5 h-5 text-destructive" />
//                 </div>
//                 <h2 className="text-xl font-semibold text-foreground">Confirm Deletion</h2>
//               </div>
//               <p className="text-muted-foreground text-sm leading-relaxed">
//                 Are you sure you want to delete this automation? This action cannot be undone and will permanently
//                 remove all associated data.
//               </p>
//             </div>

//             <div className="mx-6 mb-6 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
//               <div className="flex items-start gap-2">
//                 <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
//                 <p className="text-sm text-destructive font-medium">
//                   This will permanently delete all leads, posts, and messages associated with this automation.
//                 </p>
//               </div>
//             </div>

//             <div className="px-6 pb-6 flex gap-3">
//               <Button variant="outline" className="flex-1" onClick={() => setShowConfirmModal(false)}>
//                 Cancel
//               </Button>
//               <Button
//                 variant="destructive"
//                 className="flex-1"
//                 onClick={() => {
//                   if (selectedAutomationId) {
//                     handleDelete(selectedAutomationId)
//                   }
//                   setShowConfirmModal(false)
//                 }}
//               >
//                 <Trash2 className="w-4 h-4 mr-2" />
//                 Delete
//               </Button>
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default AutomationList


"use client"

import { useMemo, useEffect, useState } from "react"
import { usePaths } from "@/hooks/user-nav"
import { Button } from "@/components/ui/button"
import { useQueryAutomations } from "@/hooks/user-queries"
import CreateAutomation from "../create-automation"
import { useMutationDataState } from "@/hooks/use-mutation-data"
import { useAutomationPosts } from "@/hooks/use-automations"
import { AlertCircle, AlertTriangle, Trash2, Plus } from "lucide-react"
import { motion } from "framer-motion"
import { AutomationViewSelector, type ViewType } from "../fancy/automation-view-selector"
import { AutomationGridCard } from "../fancy/automation-grid-card"
import { AutomationKanbanCard } from "../fancy/automation-kanban-card"
import { AutomationListItem } from "../fancy/automation-list-item"
import { AutomationTimelineItem } from "../fancy/automation-timeline-item"
import { AutomationCardMinimal } from "../fancy/automation-card-minimal"
import { AutomationCardCompact } from "../fancy/automation-card-compact"
import { AutomationCardModern } from "../fancy/automation-card-modern"
import { AutomationCardDashboard } from "../fancy/automation-card-dashboard"
import { AutomationCardStyleSelector, type CardStyleType } from "../fancy/automation-card-style-selector"

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
  const [view, setView] = useState<ViewType>("grid")
  const [cardStyle, setCardStyle] = useState<CardStyleType>("default")
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
        },
      },
    )
  }

  const optimisticUiData = useMemo(() => {
    if (data?.data) {
      return { data: data.data as Automation[] }
    }
    return { data: [] as Automation[] }
  }, [data])

  const optimisticAutomations = optimisticUiData.data.filter((automation) => automation._isOptimistic)
  const regularAutomations = optimisticUiData.data.filter((automation) => !automation._isOptimistic)
  const activeAutomations = regularAutomations.filter((automation) => automation.active)
  const inactiveAutomations = regularAutomations.filter((automation) => !automation.active)

  const renderAutomationCard = (automation: Automation, onDelete?: () => void) => {
    const commonProps = {
      automation,
      pathname: pathname || "/",
      onDelete,
    }

    switch (cardStyle) {
      case "minimal":
        return <AutomationCardMinimal {...commonProps} />
      case "compact":
        return <AutomationCardCompact {...commonProps} />
      case "modern":
        return <AutomationCardModern {...commonProps} />
      case "dashboard":
        return <AutomationCardDashboard {...commonProps} />
      default:
        return <AutomationGridCard {...commonProps} />
    }
  }

  if (!automations.length && !optimisticAutomations.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No automations yet</h3>
          <p className="text-muted-foreground mb-6">
            Get started by creating your first automation to streamline your workflow.
          </p>
          <CreateAutomation />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Automations</h2>
          <p className="text-muted-foreground">
            Manage your {optimisticUiData.data.length} automation{optimisticUiData.data.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <AutomationViewSelector currentView={view} onViewChange={setView} />
          {view === "grid" && <AutomationCardStyleSelector currentStyle={cardStyle} onStyleChange={setCardStyle} />}
          <CreateAutomation />
        </div>
      </div>

      {/* View-specific rendering */}
      {view === "list" && (
        <div className="space-y-6">
          {optimisticAutomations.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-4 text-muted-foreground flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                Creating automations...
              </h3>
              <div className="space-y-2">
                {optimisticAutomations.map((automation) => (
                  <AutomationListItem key={automation.id} automation={automation} pathname={pathname || "/"} />
                ))}
              </div>
            </div>
          )}

          {activeAutomations.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Active Automations ({activeAutomations.length})
              </h3>
              <div className="space-y-2">
                {activeAutomations.map((automation) => (
                  <AutomationListItem
                    key={automation.id}
                    automation={automation}
                    pathname={pathname || "/"}
                    onDelete={() => {
                      setSelectedAutomationId(automation.id)
                      setShowConfirmModal(true)
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {inactiveAutomations.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                Paused Automations ({inactiveAutomations.length})
              </h3>
              <div className="space-y-2">
                {inactiveAutomations.map((automation) => (
                  <AutomationListItem
                    key={automation.id}
                    automation={automation}
                    pathname={pathname || "/"}
                    onDelete={() => {
                      setSelectedAutomationId(automation.id)
                      setShowConfirmModal(true)
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {view === "grid" && (
        <div className="space-y-8">
          {optimisticAutomations.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-4 text-muted-foreground flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                Creating automations...
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {optimisticAutomations.map((automation) => (
                  <div key={automation.id}>{renderAutomationCard(automation)}</div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeAutomations.map((automation) => (
              <div key={automation.id}>
                {renderAutomationCard(automation, () => {
                  setSelectedAutomationId(automation.id)
                  setShowConfirmModal(true)
                })}
              </div>
            ))}
            {inactiveAutomations.map((automation) => (
              <div key={automation.id}>
                {renderAutomationCard(automation, () => {
                  setSelectedAutomationId(automation.id)
                  setShowConfirmModal(true)
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-4 bg-muted/30 rounded-lg">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
              <h3 className="font-medium">Draft ({optimisticAutomations.length})</h3>
            </div>
            <div className="space-y-3">
              {optimisticAutomations.map((automation) => (
                <AutomationKanbanCard key={automation.id} automation={automation} pathname={pathname || "/"} />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 p-4 bg-muted/30 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <h3 className="font-medium">Active ({activeAutomations.length})</h3>
            </div>
            <div className="space-y-3">
              {activeAutomations.map((automation) => (
                <AutomationKanbanCard
                  key={automation.id}
                  automation={automation}
                  pathname={pathname || "/"}
                  onDelete={() => {
                    setSelectedAutomationId(automation.id)
                    setShowConfirmModal(true)
                  }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 p-4 bg-muted/30 rounded-lg">
              <div className="w-3 h-3 bg-muted-foreground rounded-full" />
              <h3 className="font-medium">Paused ({inactiveAutomations.length})</h3>
            </div>
            <div className="space-y-3">
              {inactiveAutomations.map((automation) => (
                <AutomationKanbanCard
                  key={automation.id}
                  automation={automation}
                  pathname={pathname || "/"}
                  onDelete={() => {
                    setSelectedAutomationId(automation.id)
                    setShowConfirmModal(true)
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {view === "timeline" && (
        <div className="relative max-w-4xl">
          {optimisticAutomations.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 text-muted-foreground flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                Creating automations...
              </h3>
              {optimisticAutomations.map((automation) => (
                <AutomationTimelineItem key={automation.id} automation={automation} pathname={pathname || "/"} />
              ))}
            </div>
          )}

          {activeAutomations.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Active Automations
              </h3>
              {activeAutomations.map((automation) => (
                <AutomationTimelineItem
                  key={automation.id}
                  automation={automation}
                  pathname={pathname || "/"}
                  onDelete={() => {
                    setSelectedAutomationId(automation.id)
                    setShowConfirmModal(true)
                  }}
                />
              ))}
            </div>
          )}

          {inactiveAutomations.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                Paused Automations
              </h3>
              {inactiveAutomations.map((automation) => (
                <AutomationTimelineItem
                  key={automation.id}
                  automation={automation}
                  pathname={pathname || "/"}
                  onDelete={() => {
                    setSelectedAutomationId(automation.id)
                    setShowConfirmModal(true)
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-md mx-auto"
          >
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-shrink-0 w-10 h-10 bg-destructive/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Confirm Deletion</h2>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Are you sure you want to delete this automation? This action cannot be undone and will permanently
                remove all associated data.
              </p>
            </div>

            <div className="mx-6 mb-6 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-sm text-destructive font-medium">
                  This will permanently delete all leads, posts, and messages associated with this automation.
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowConfirmModal(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => {
                  if (selectedAutomationId) {
                    handleDelete(selectedAutomationId)
                  }
                  setShowConfirmModal(false)
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AutomationList
