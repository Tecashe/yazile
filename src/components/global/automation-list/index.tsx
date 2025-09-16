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
//         // onError: (error) => {
//         //   console.error('Error deleting automation:', error);
//         // },
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

"use client"
import { useMemo, useState } from "react"
import { usePaths } from "@/hooks/user-nav"
import { Button } from "@/components/ui/button"
import { useQueryAutomations } from "@/hooks/user-queries"
import CreateAutomation from "../create-automation"
import { useMutationDataState } from "@/hooks/use-mutation-data"
import { useAutomationPosts } from "@/hooks/use-automations"
import { FancyAutomationBox } from "../fancy/fancy-automation-box"
import { AlertCircle, AlertTriangle, Trash2, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

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
  const { data, refetch, isLoading } = useQueryAutomations()
  const { deleteMutation, isDeleting } = useAutomationPosts(id)
  const { latestVariable } = useMutationDataState(["create-automation"])
  const { pathname } = usePaths()

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    automationId: string | null
  }>({
    isOpen: false,
    automationId: null
  })

  // Professional optimistic UI management
  const enrichedAutomations = useMemo((): Automation[] => {
    const serverAutomations: Automation[] = data?.data || []
    const result: Automation[] = [...serverAutomations]

    // Add optimistic creation if mutation is pending
    if (latestVariable?.status === 'pending' && latestVariable?.variables) {
      const variables = latestVariable.variables
      const optimisticAutomation: Automation = {
        id: `optimistic-${Date.now()}`,
        name: variables.name || "New Automation",
        active: false,
        keywords: Array.isArray(variables.keywords) 
          ? variables.keywords.map((word: string, index: number) => ({
              id: `temp-keyword-${index}`,
              automationId: null,
              word
            }))
          : [],
        createdAt: new Date(),
        listener: variables.listener ? {
          id: `temp-listener`,
          listener: variables.listener,
          automationId: `optimistic-${Date.now()}`,
          prompt: variables.prompt || "",
          commentReply: null,
          dmCount: 0,
          commentCount: 0
        } : null,
        _isOptimistic: true
      }

      // Add to beginning of array
      result.unshift(optimisticAutomation)
    }

    return result
  }, [data?.data, latestVariable])

  // Improved delete handler
  const handleDelete = (automationId: string) => {
    deleteMutation(
      { id: automationId },
      {
        onSuccess: () => {
          console.log("Automation deleted successfully")
        },
        onError: (error: any) => {
          console.error("Error deleting automation:", error)
        },
      }
    )
    setConfirmModal({ isOpen: false, automationId: null })
  }

  const openDeleteModal = (automationId: string) => {
    setConfirmModal({ isOpen: true, automationId })
  }

  const closeDeleteModal = () => {
    setConfirmModal({ isOpen: false, automationId: null })
  }

  // Categorize automations
  const { optimisticAutomations, activeAutomations, inactiveAutomations } = useMemo(() => {
    const optimistic = enrichedAutomations.filter(a => a._isOptimistic)
    const regular = enrichedAutomations.filter(a => !a._isOptimistic)
    
    return {
      optimisticAutomations: optimistic,
      activeAutomations: regular.filter(a => a.active),
      inactiveAutomations: regular.filter(a => !a.active)
    }
  }, [enrichedAutomations])

  // Loading state
  if (isLoading) {
    return (
      <div className="h-[70vh] flex justify-center items-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-lg text-muted-foreground">Loading automations...</span>
        </div>
      </div>
    )
  }

  // Empty state
  if (enrichedAutomations.length === 0) {
    return (
      <div className="h-[70vh] flex justify-center items-center flex-col gap-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-foreground">No automations yet</h3>
          <p className="text-muted-foreground">Create your first automation to get started</p>
        </div>
        <CreateAutomation />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Optimistic Creations */}
      <AnimatePresence>
        {optimisticAutomations.length > 0 && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 overflow-hidden"
          >
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Creating automation...</h2>
            </div>
            
            <div className="space-y-4">
              {optimisticAutomations.map((automation) => (
                <motion.div
                  key={automation.id}
                  initial={{ opacity: 0, scale: 0.98, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="relative"
                >
                  {/* Subtle optimistic overlay */}
                  <div className="absolute inset-0 bg-primary/5 border border-primary/20 rounded-lg pointer-events-none z-10" />
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite] rounded-lg pointer-events-none z-20" />
                  
                  <FancyAutomationBox
                    automation={automation}
                    onDelete={() => {}} // Disabled during creation
                    pathname={pathname || "/"}
                    isOptimistic={true}
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Active Automations */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">
          Active Automations
          {activeAutomations.length > 0 && (
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({activeAutomations.length})
            </span>
          )}
        </h2>
        
        {activeAutomations.length > 0 ? (
          <div className="space-y-4">
            <AnimatePresence>
              {activeAutomations.map((automation) => (
                <AutomationItem
                  key={automation.id}
                  automation={automation}
                  onDelete={openDeleteModal}
                  pathname={pathname || "/"}
                  isDeleting={isDeleting}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <EmptyState message="No active automations. Activate an automation to see it here." />
        )}
      </section>

      {/* Inactive Automations */}
      {inactiveAutomations.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Inactive Automations
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({inactiveAutomations.length})
            </span>
          </h2>
          
          <div className="space-y-4">
            <AnimatePresence>
              {inactiveAutomations.map((automation) => (
                <AutomationItem
                  key={automation.id}
                  automation={automation}
                  onDelete={openDeleteModal}
                  pathname={pathname || "/"}
                  isDeleting={isDeleting}
                />
              ))}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={() => {
          if (confirmModal.automationId) {
            handleDelete(confirmModal.automationId)
          }
        }}
        isLoading={isDeleting}
      />
    </div>
  )
}

// Extracted components for better organization
const AutomationItem = ({ 
  automation, 
  onDelete, 
  pathname, 
  isDeleting 
}: {
  automation: Automation
  onDelete: (id: string) => void
  pathname: string
  isDeleting: boolean
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, x: -20 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`relative ${isDeleting ? 'pointer-events-none' : ''}`}
    >
      {isDeleting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center justify-center z-10"
        >
          <div className="flex items-center gap-2 text-sm text-destructive bg-background/80 backdrop-blur-sm px-3 py-2 rounded-md">
            <Loader2 className="w-4 h-4 animate-spin" />
            Deleting automation...
          </div>
        </motion.div>
      )}
      
      <FancyAutomationBox
        automation={automation}
        onDelete={() => onDelete(automation.id)}
        pathname={pathname}
      />
    </motion.div>
  )
}

const EmptyState = ({ message }: { message: string }) => (
  <div className="py-12 px-6 text-center border-2 border-dashed border-muted rounded-lg bg-muted/20">
    <p className="text-muted-foreground">{message}</p>
  </div>
)

// Confirmation Modal Component
const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isLoading = false 
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading?: boolean
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-background border rounded-xl shadow-2xl w-full max-w-md mx-auto"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0 w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold">Confirm Deletion</h2>
          </div>
          
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            Are you sure you want to delete this automation? This action cannot be undone and will permanently remove all associated data.
          </p>

          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg mb-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-sm text-destructive font-medium">
                This will permanently delete all leads, posts, and messages associated with this automation.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
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



















