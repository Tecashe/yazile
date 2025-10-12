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

//       {/* {showConfirmModal && (
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
//       )} */}

//       {showConfirmModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-card border border-border p-6 rounded-lg shadow-lg w-80">
//             <h2 className="text-lg font-semibold mb-4 text-card-foreground">Confirm Delete</h2>
//             <p className="text-sm mb-6 text-muted-foreground">This action cannot be undone!</p>
//             <div className="flex justify-end gap-3">
//               <Button
//                 variant="secondary"
//                 onClick={() => setShowConfirmModal(false)}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 variant="destructive"
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
// import { Card } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Sparkles, Zap, Activity, TrendingUp, Search, LayoutGrid, LayoutList, Bot } from "lucide-react"
// import { motion, AnimatePresence } from "framer-motion"

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
//   const [searchQuery, setSearchQuery] = useState("")
//   const [filterMode, setFilterMode] = useState<"all" | "active" | "inactive">("all")
//   const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

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
//           setAutomations((prev) => prev.filter((a) => a.id !== automationId))
//         },
//       },
//     )
//   }

//   const optimisticUiData = useMemo(() => {
//     if (latestVariable?.variables && data) {
//       const test = [latestVariable.variables, ...automations]
//       return { data: test as Automation[] }
//     }
//     return { data: automations }
//   }, [latestVariable, automations])

//   const filteredAutomations = useMemo(() => {
//     let filtered = optimisticUiData.data

//     // Apply filter mode
//     if (filterMode === "active") {
//       filtered = filtered.filter((a) => a.active)
//     } else if (filterMode === "inactive") {
//       filtered = filtered.filter((a) => !a.active)
//     }

//     // Apply search
//     if (searchQuery) {
//       filtered = filtered.filter(
//         (a) =>
//           a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           a.keywords.some((k) => k.word.toLowerCase().includes(searchQuery.toLowerCase())),
//       )
//     }

//     return filtered
//   }, [optimisticUiData.data, filterMode, searchQuery])

//   const activeAutomations = optimisticUiData.data.filter((automation) => automation.active)
//   const inactiveAutomations = optimisticUiData.data.filter((automation) => !automation.active)
//   const smartAICount = optimisticUiData.data.filter((a) => a.listener?.listener === "SMARTAI").length
//   const totalMessages =
//     optimisticUiData.data.reduce((acc, a) => acc + (a.listener?.dmCount || 0) + (a.listener?.commentCount || 0), 0) || 0

//   if (!automations.length) {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="container mx-auto px-4 py-12">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="h-[70vh] flex justify-center items-center flex-col gap-y-6"
//           >
//             <div className="relative">
//               <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
//               <Bot className="w-24 h-24 text-primary relative z-10" />
//             </div>
//             <div className="text-center space-y-3">
//               <h3 className="text-3xl font-bold text-foreground">No Automations Yet</h3>
//               <p className="text-lg text-muted-foreground max-w-md">
//                 Start automating your workflow by creating your first automation
//               </p>
//             </div>
//             <CreateAutomation />
//           </motion.div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="container mx-auto px-4 py-8 max-w-7xl">
//         <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 staggeredFadeIn">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
//             <div>
//               <h3 className="text-4xl md:text-5xl font-bold mb-3 text-balance">Your Automations</h3>
//               <p className="text-muted-foreground text-lg">Manage and monitor your automated workflows</p>
//             </div>
//             <CreateAutomation />
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//             <Card className="glassEffect border-border/50 glow p-6 float">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground mb-1">Total Automations</p>
//                   <p className="text-3xl font-bold">{optimisticUiData.data.length}</p>
//                 </div>
//                 <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
//                   <Activity className="w-6 h-6 text-blue-400" />
//                 </div>
//               </div>
//             </Card>

//             <Card className="glassEffect border-border/50 glow p-6 float" style={{ animationDelay: "0.1s" }}>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground mb-1">Active</p>
//                   <p className="text-3xl font-bold text-green-400">{activeAutomations.length}</p>
//                 </div>
//                 <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
//                   <TrendingUp className="w-6 h-6 text-green-400" />
//                 </div>
//               </div>
//             </Card>

//             <Card className="glassEffect border-border/50 glow p-6 float" style={{ animationDelay: "0.2s" }}>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground mb-1">Smart AI</p>
//                   <p className="text-3xl font-bold text-purple-400">{smartAICount}</p>
//                 </div>
//                 <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
//                   <Sparkles className="w-6 h-6 text-purple-400" />
//                 </div>
//               </div>
//             </Card>

//             <Card className="glassEffect border-border/50 glow p-6 float" style={{ animationDelay: "0.3s" }}>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground mb-1">Total Messages</p>
//                   <p className="text-3xl font-bold text-yellow-400">{totalMessages}</p>
//                 </div>
//                 <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
//                   <Zap className="w-6 h-6 text-yellow-400" />
//                 </div>
//               </div>
//             </Card>
//           </div>

//           {/* Search and Filter Bar */}
//           <Card className="glassEffect border-border/50 p-4">
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="flex-1 relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search automations by name or keyword..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="pl-10 bg-secondary/50 border-border/50"
//                 />
//               </div>

//               <div className="flex gap-2">
//                 <Button
//                   variant={filterMode === "all" ? "default" : "outline"}
//                   size="sm"
//                   onClick={() => setFilterMode("all")}
//                   className="bg-transparent"
//                 >
//                   All
//                 </Button>
//                 <Button
//                   variant={filterMode === "active" ? "default" : "outline"}
//                   size="sm"
//                   onClick={() => setFilterMode("active")}
//                   className="bg-transparent"
//                 >
//                   Active
//                 </Button>
//                 <Button
//                   variant={filterMode === "inactive" ? "default" : "outline"}
//                   size="sm"
//                   onClick={() => setFilterMode("inactive")}
//                   className="bg-transparent"
//                 >
//                   Inactive
//                 </Button>
//               </div>

//               <div className="flex gap-2 border-l border-border/50 pl-2">
//                 <Button
//                   variant={viewMode === "grid" ? "default" : "outline"}
//                   size="sm"
//                   onClick={() => setViewMode("grid")}
//                   className="bg-transparent"
//                 >
//                   <LayoutGrid className="w-4 h-4" />
//                 </Button>
//                 <Button
//                   variant={viewMode === "list" ? "default" : "outline"}
//                   size="sm"
//                   onClick={() => setViewMode("list")}
//                   className="bg-transparent"
//                 >
//                   <LayoutList className="w-4 h-4" />
//                 </Button>
//               </div>
//             </div>
//           </Card>
//         </motion.div>

//         <AnimatePresence mode="wait">
//           {filteredAutomations.length > 0 ? (
//             <motion.div
//               key={`${viewMode}-${filterMode}-${searchQuery}`}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.3 }}
//               className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : "flex flex-col gap-6"}
//             >
//               {filteredAutomations.map((automation, index) => (
//                 <motion.div
//                   key={automation.id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.05, duration: 0.3 }}
//                 >
//                   <FancyAutomationBox
//                     automation={automation}
//                     onDelete={() => {
//                       setSelectedAutomationId(automation.id)
//                       setShowConfirmModal(true)
//                     }}
//                     pathname={pathname || "/"}
//                   />
//                 </motion.div>
//               ))}
//             </motion.div>
//           ) : (
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
//               <div className="relative inline-block mb-6">
//                 <div className="absolute inset-0 bg-muted/20 blur-2xl rounded-full" />
//                 <Search className="w-16 h-16 text-muted-foreground relative z-10" />
//               </div>
//               <h3 className="text-2xl font-semibold mb-2">No automations found</h3>
//               <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Delete Confirmation Modal */}
//         {showConfirmModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//             onClick={() => setShowConfirmModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               className="bg-card border-2 border-destructive/30 p-6 rounded-xl shadow-2xl w-full max-w-md glow"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <h2 className="text-xl font-semibold mb-3 text-card-foreground">Confirm Delete</h2>
//               <p className="text-sm mb-6 text-muted-foreground">
//                 This action cannot be undone! The automation and all its data will be permanently deleted.
//               </p>
//               <div className="flex justify-end gap-3">
//                 <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
//                   Cancel
//                 </Button>
//                 <Button
//                   variant="destructive"
//                   onClick={() => {
//                     if (selectedAutomationId) {
//                       handleDelete(selectedAutomationId)
//                     }
//                     setShowConfirmModal(false)
//                   }}
//                   className="glowHover"
//                 >
//                   Delete Permanently
//                 </Button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </div>
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
// import { Card } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Sparkles, Zap, Activity, TrendingUp, Search, LayoutGrid, LayoutList, Bot } from "lucide-react"
// import { motion, AnimatePresence } from "framer-motion"
// import PaymentPopup from "../stripe/payment-popup"

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
//   const [searchQuery, setSearchQuery] = useState("")
//   const [filterMode, setFilterMode] = useState<"all" | "active" | "inactive">("all")
//   const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
//   const [showPaymentPopup, setShowPaymentPopup] = useState(false)

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
//           setAutomations((prev) => prev.filter((a) => a.id !== automationId))
//         },
//       },
//     )
//   }

//   const optimisticUiData = useMemo(() => {
//     if (latestVariable?.variables && data) {
//       const test = [latestVariable.variables, ...automations]
//       return { data: test as Automation[] }
//     }
//     return { data: automations }
//   }, [latestVariable, automations])

//   const filteredAutomations = useMemo(() => {
//     let filtered = optimisticUiData.data

//     // Apply filter mode
//     if (filterMode === "active") {
//       filtered = filtered.filter((a) => a.active)
//     } else if (filterMode === "inactive") {
//       filtered = filtered.filter((a) => !a.active)
//     }

//     // Apply search
//     if (searchQuery) {
//       filtered = filtered.filter(
//         (a) =>
//           a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           a.keywords.some((k) => k.word.toLowerCase().includes(searchQuery.toLowerCase())),
//       )
//     }

//     return filtered
//   }, [optimisticUiData.data, filterMode, searchQuery])

//   const activeAutomations = optimisticUiData.data.filter((automation) => automation.active)
//   const inactiveAutomations = optimisticUiData.data.filter((automation) => !automation.active)
//   const smartAICount = optimisticUiData.data.filter((a) => a.listener?.listener === "SMARTAI").length
//   const totalMessages =
//     optimisticUiData.data.reduce((acc, a) => acc + (a.listener?.dmCount || 0) + (a.listener?.commentCount || 0), 0) || 0

//   if (!automations.length) {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="container mx-auto px-4 py-12">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="h-[70vh] flex justify-center items-center flex-col gap-y-6"
//           >
//             <div className="relative">
//               <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
//               <Bot className="w-24 h-24 text-primary relative z-10" />
//             </div>
//             <div className="text-center space-y-3">
//               <h3 className="text-3xl font-bold text-foreground">No Automations Yet</h3>
//               <p className="text-lg text-muted-foreground max-w-md">
//                 Start automating your workflow by creating your first automation
//               </p>
//             </div>
//             <CreateAutomation 
//               currentAutomationCount={0}
//               onUpgradeClick={() => setShowPaymentPopup(true)}
//             />
//           </motion.div>
//         </div>

//         <PaymentPopup
//           isOpen={showPaymentPopup}
//           onClose={() => setShowPaymentPopup(false)}
//           onSuccess={() => {
//             setShowPaymentPopup(false)
//             refetch()
//           }}
//         />
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="container mx-auto px-4 py-8 max-w-7xl">
//         <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 staggeredFadeIn">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
//             <div>
//               <h3 className="text-4xl md:text-5xl font-bold mb-3 text-balance">Your Automations</h3>
//               <p className="text-muted-foreground text-lg">Manage and monitor your automated workflows</p>
//             </div>
//             <CreateAutomation 
//               currentAutomationCount={automations.length}
//               onUpgradeClick={() => setShowPaymentPopup(true)}
//             />
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//             <Card className="glassEffect border-border/50 glow p-6 float">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground mb-1">Total Automations</p>
//                   <p className="text-3xl font-bold">{optimisticUiData.data.length}</p>
//                 </div>
//                 <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
//                   <Activity className="w-6 h-6 text-blue-400" />
//                 </div>
//               </div>
//             </Card>

//             <Card className="glassEffect border-border/50 glow p-6 float" style={{ animationDelay: "0.1s" }}>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground mb-1">Active</p>
//                   <p className="text-3xl font-bold text-green-400">{activeAutomations.length}</p>
//                 </div>
//                 <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
//                   <TrendingUp className="w-6 h-6 text-green-400" />
//                 </div>
//               </div>
//             </Card>

//             <Card className="glassEffect border-border/50 glow p-6 float" style={{ animationDelay: "0.2s" }}>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground mb-1">Smart AI</p>
//                   <p className="text-3xl font-bold text-purple-400">{smartAICount}</p>
//                 </div>
//                 <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
//                   <Sparkles className="w-6 h-6 text-purple-400" />
//                 </div>
//               </div>
//             </Card>

//             <Card className="glassEffect border-border/50 glow p-6 float" style={{ animationDelay: "0.3s" }}>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground mb-1">Total Messages</p>
//                   <p className="text-3xl font-bold text-yellow-400">{totalMessages}</p>
//                 </div>
//                 <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
//                   <Zap className="w-6 h-6 text-yellow-400" />
//                 </div>
//               </div>
//             </Card>
//           </div>

//           {/* Search and Filter Bar */}
//           <Card className="glassEffect border-border/50 p-4">
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="flex-1 relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search automations by name or keyword..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="pl-10 bg-secondary/50 border-border/50"
//                 />
//               </div>

//               <div className="flex gap-2">
//                 <Button
//                   variant={filterMode === "all" ? "default" : "outline"}
//                   size="sm"
//                   onClick={() => setFilterMode("all")}
//                   className="bg-transparent"
//                 >
//                   All
//                 </Button>
//                 <Button
//                   variant={filterMode === "active" ? "default" : "outline"}
//                   size="sm"
//                   onClick={() => setFilterMode("active")}
//                   className="bg-transparent"
//                 >
//                   Active
//                 </Button>
//                 <Button
//                   variant={filterMode === "inactive" ? "default" : "outline"}
//                   size="sm"
//                   onClick={() => setFilterMode("inactive")}
//                   className="bg-transparent"
//                 >
//                   Inactive
//                 </Button>
//               </div>

//               <div className="flex gap-2 border-l border-border/50 pl-2">
//                 <Button
//                   variant={viewMode === "grid" ? "default" : "outline"}
//                   size="sm"
//                   onClick={() => setViewMode("grid")}
//                   className="bg-transparent"
//                 >
//                   <LayoutGrid className="w-4 h-4" />
//                 </Button>
//                 <Button
//                   variant={viewMode === "list" ? "default" : "outline"}
//                   size="sm"
//                   onClick={() => setViewMode("list")}
//                   className="bg-transparent"
//                 >
//                   <LayoutList className="w-4 h-4" />
//                 </Button>
//               </div>
//             </div>
//           </Card>
//         </motion.div>

//         <AnimatePresence mode="wait">
//           {filteredAutomations.length > 0 ? (
//             <motion.div
//               key={`${viewMode}-${filterMode}-${searchQuery}`}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.3 }}
//               className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : "flex flex-col gap-6"}
//             >
//               {filteredAutomations.map((automation, index) => (
//                 <motion.div
//                   key={automation.id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.05, duration: 0.3 }}
//                 >
//                   <FancyAutomationBox
//                     automation={automation}
//                     onDelete={() => {
//                       setSelectedAutomationId(automation.id)
//                       setShowConfirmModal(true)
//                     }}
//                     pathname={pathname || "/"}
//                   />
//                 </motion.div>
//               ))}
//             </motion.div>
//           ) : (
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
//               <div className="relative inline-block mb-6">
//                 <div className="absolute inset-0 bg-muted/20 blur-2xl rounded-full" />
//                 <Search className="w-16 h-16 text-muted-foreground relative z-10" />
//               </div>
//               <h3 className="text-2xl font-semibold mb-2">No automations found</h3>
//               <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Delete Confirmation Modal */}
//         {showConfirmModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//             onClick={() => setShowConfirmModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               className="bg-card border-2 border-destructive/30 p-6 rounded-xl shadow-2xl w-full max-w-md glow"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <h2 className="text-xl font-semibold mb-3 text-card-foreground">Confirm Delete</h2>
//               <p className="text-sm mb-6 text-muted-foreground">
//                 This action cannot be undone! The automation and all its data will be permanently deleted.
//               </p>
//               <div className="flex justify-end gap-3">
//                 <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
//                   Cancel
//                 </Button>
//                 <Button
//                   variant="destructive"
//                   onClick={() => {
//                     if (selectedAutomationId) {
//                       handleDelete(selectedAutomationId)
//                     }
//                     setShowConfirmModal(false)
//                   }}
//                   className="glowHover"
//                 >
//                   Delete Permanently
//                 </Button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}

//         {/* Payment Popup */}
//         <PaymentPopup
//           isOpen={showPaymentPopup}
//           onClose={() => setShowPaymentPopup(false)}
//           onSuccess={() => {
//             setShowPaymentPopup(false)
//             refetch()
//           }}
//         />
//       </div>
//     </div>
//   )
// }

// export default AutomationList


// "use client"
// import { useMemo, useEffect, useState } from "react"
// import { usePaths } from "@/hooks/user-nav"
// import { Button } from "@/components/ui/button"
// import { useQueryAutomations } from "@/hooks/user-queries"
// import {
//   useQueryTrashedAutomations,
//   useRestoreAutomation,
//   usePermanentlyDeleteAutomation,
// } from "@/hooks/user-queries-trash"
// import CreateAutomation from "../create-automation"
// import { useMutationDataState } from "@/hooks/use-mutation-data"
// import { useAutomationPosts } from "@/hooks/use-automations"
// import { FancyAutomationBox } from "../fancy/fancy-automation-box"
// import { Card } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import {
//   Sparkles,
//   Zap,
//   Activity,
//   TrendingUp,
//   Search,
//   LayoutGrid,
//   LayoutList,
//   Bot,
//   Trash2,
//   X,
//   RotateCcw,
// } from "lucide-react"
// import { motion, AnimatePresence } from "framer-motion"
// import PaymentPopup from "../stripe/payment-popup"
// import { getRelativeTime } from "@/lib/utils"

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
//   deletedAt?: Date | null
//   listener: Listener | null
// }

// type Props = {
//   id: string
// }

// const getSafeRelativeTime = (date?: Date | string | null): string => {
//   if (!date) return "Recently"
//   try {
//     const dateObj = date instanceof Date ? date : new Date(date)
//     if (isNaN(dateObj.getTime())) return "Recently"
//     return getRelativeTime(dateObj)
//   } catch {
//     return "Recently"
//   }
// }

// const AutomationList = ({ id }: Props) => {
//   const { data, refetch } = useQueryAutomations()
//   const { data: trashedData, refetch: refetchTrashed } = useQueryTrashedAutomations()

//   console.log("[v0] AutomationList: trashedData:", trashedData)

//   const { mutate: restoreAutomation } = useRestoreAutomation()
//   const { mutate: permanentlyDelete } = usePermanentlyDeleteAutomation()

//   const { deleteMutation, permanentDeleteMutation } = useAutomationPosts(id)
//   const { latestVariable } = useMutationDataState(["create-automation"])
//   const { pathname } = usePaths()

//   const [automations, setAutomations] = useState<Automation[]>(data?.data || [])
//   const [trashedAutomations, setTrashedAutomations] = useState<Automation[]>(trashedData?.data || [])
//   const [showConfirmModal, setShowConfirmModal] = useState(false)
//   const [selectedAutomationId, setSelectedAutomationId] = useState<string | null>(null)
//   const [deleteType, setDeleteType] = useState<"trash" | "permanent">("trash")
//   const [searchQuery, setSearchQuery] = useState("")
//   const [filterMode, setFilterMode] = useState<"all" | "active" | "inactive">("all")
//   const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
//   const [showPaymentPopup, setShowPaymentPopup] = useState(false)
//   const [showTrashSidebar, setShowTrashSidebar] = useState(false)

//   useEffect(() => {
//     if (data?.data) {
//       setAutomations(data.data)
//     }
//   }, [data])

//   useEffect(() => {
//     if (trashedData?.data) {
//       console.log("[v0] Setting trashed automations:", trashedData.data)
//       setTrashedAutomations(trashedData.data)
//     }
//   }, [trashedData])

//   const handleDelete = (automationId: string, type: "trash" | "permanent") => {
//     if (type === "trash") {
//       deleteMutation(
//         { id: automationId },
//         {
//           onSuccess: () => {
//             console.log("Automation moved to trash")
//             setAutomations((prev) => prev.filter((a) => a.id !== automationId))
//             refetchTrashed()
//           },
//         },
//       )
//     } else {
//       permanentDeleteMutation(
//         { id: automationId },
//         {
//           onSuccess: () => {
//             console.log("Automation permanently deleted")
//             setAutomations((prev) => prev.filter((a) => a.id !== automationId))
//           },
//         },
//       )
//     }
//   }

//   const handleRestore = (automationId: string) => {
//     restoreAutomation(
//       { id: automationId },
//       {
//         onSuccess: () => {
//           console.log("Automation restored successfully")
//           setTrashedAutomations((prev) => prev.filter((a) => a.id !== automationId))
//           refetch()
//         },
//       },
//     )
//   }

//   const handlePermanentDeleteFromTrash = (automationId: string) => {
//     permanentlyDelete(
//       { id: automationId },
//       {
//         onSuccess: () => {
//           console.log("Automation permanently deleted")
//           setTrashedAutomations((prev) => prev.filter((a) => a.id !== automationId))
//         },
//       },
//     )
//   }

//   const optimisticUiData = useMemo(() => {
//     if (latestVariable?.variables && data) {
//       const test = [latestVariable.variables, ...automations]
//       return { data: test as Automation[] }
//     }
//     return { data: automations }
//   }, [latestVariable, automations])

//   const filteredAutomations = useMemo(() => {
//     let filtered = optimisticUiData.data

//     // Apply filter mode
//     if (filterMode === "active") {
//       filtered = filtered.filter((a) => a.active)
//     } else if (filterMode === "inactive") {
//       filtered = filtered.filter((a) => !a.active)
//     }

//     // Apply search
//     if (searchQuery) {
//       filtered = filtered.filter(
//         (a) =>
//           a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           a.keywords.some((k) => k.word.toLowerCase().includes(searchQuery.toLowerCase())),
//       )
//     }

//     return filtered
//   }, [optimisticUiData.data, filterMode, searchQuery])

//   const activeAutomations = optimisticUiData.data.filter((automation) => automation.active)
//   const inactiveAutomations = optimisticUiData.data.filter((automation) => !automation.active)
//   const smartAICount = optimisticUiData.data.filter((a) => a.listener?.listener === "SMARTAI").length
//   const totalMessages =
//     optimisticUiData.data.reduce((acc, a) => acc + (a.listener?.dmCount || 0) + (a.listener?.commentCount || 0), 0) || 0

//   // if (!automations.length) {
//   //   return (
//   //     <div className="min-h-screen bg-background">
//   //       <div className="container mx-auto px-4 py-12">
//   //         <motion.div
//   //           initial={{ opacity: 0, y: 20 }}
//   //           animate={{ opacity: 1, y: 0 }}
//   //           className="h-[70vh] flex justify-center items-center flex-col gap-y-6"
//   //         >
//   //           <div className="relative">
//   //             <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
//   //             <Bot className="w-24 h-24 text-primary relative z-10" />
//   //           </div>
//   //           <div className="text-center space-y-3">
//   //             <h3 className="text-3xl font-bold text-foreground">No Automations Yet</h3>
//   //             <p className="text-lg text-muted-foreground max-w-md">
//   //               Start automating your workflow by creating your first automation
//   //             </p>
//   //           </div>
//   //           <CreateAutomation currentAutomationCount={0} onUpgradeClick={() => setShowPaymentPopup(true)} />
//   //         </motion.div>
//   //       </div>

//   //       <PaymentPopup
//   //         isOpen={showPaymentPopup}
//   //         onClose={() => setShowPaymentPopup(false)}
//   //         onSuccess={() => {
//   //           setShowPaymentPopup(false)
//   //           refetch()
//   //         }}
//   //       />
//   //     </div>
//   //   )
//   // }

//   if (!data?.data || data.data.length === 0) {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="container mx-auto px-4 py-12">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="h-[70vh] flex justify-center items-center flex-col gap-y-6"
//           >
//             <div className="relative">
//               <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
//               <Bot className="w-24 h-24 text-primary relative z-10" />
//             </div>
//             <div className="text-center space-y-3">
//               <h3 className="text-3xl font-bold text-foreground">No Automations Yet</h3>
//               <p className="text-lg text-muted-foreground max-w-md">
//                 Start automating your workflow by creating your first automation
//               </p>
//             </div>
//             <CreateAutomation currentAutomationCount={0} onUpgradeClick={() => setShowPaymentPopup(true)} />
//           </motion.div>
//         </div>

//         <PaymentPopup
//           isOpen={showPaymentPopup}
//           onClose={() => setShowPaymentPopup(false)}
//           onSuccess={() => {
//             setShowPaymentPopup(false)
//             refetch()
//           }}
//         />
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="container mx-auto px-4 py-8 max-w-7xl">
//         <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 staggeredFadeIn">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
//             <div>
//               <h3 className="text-4xl md:text-5xl font-bold mb-3 text-balance">Your Automations</h3>
//               <p className="text-muted-foreground text-lg">Manage and monitor your automated workflows</p>
//             </div>
//             <CreateAutomation
//               currentAutomationCount={automations.length}
//               onUpgradeClick={() => setShowPaymentPopup(true)}
//             />
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//             <Card className="glassEffect border-border/50 glow p-6 float">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground mb-1">Total Automations</p>
//                   <p className="text-3xl font-bold">{optimisticUiData.data.length}</p>
//                 </div>
//                 <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
//                   <Activity className="w-6 h-6 text-blue-400" />
//                 </div>
//               </div>
//             </Card>

//             <Card className="glassEffect border-border/50 glow p-6 float" style={{ animationDelay: "0.1s" }}>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground mb-1">Active</p>
//                   <p className="text-3xl font-bold text-green-400">{activeAutomations.length}</p>
//                 </div>
//                 <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
//                   <TrendingUp className="w-6 h-6 text-green-400" />
//                 </div>
//               </div>
//             </Card>

//             <Card className="glassEffect border-border/50 glow p-6 float" style={{ animationDelay: "0.2s" }}>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground mb-1">Smart AI</p>
//                   <p className="text-3xl font-bold text-purple-400">{smartAICount}</p>
//                 </div>
//                 <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
//                   <Sparkles className="w-6 h-6 text-purple-400" />
//                 </div>
//               </div>
//             </Card>

//             <Card className="glassEffect border-border/50 glow p-6 float" style={{ animationDelay: "0.3s" }}>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground mb-1">Total Messages</p>
//                   <p className="text-3xl font-bold text-yellow-400">{totalMessages}</p>
//                 </div>
//                 <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
//                   <Zap className="w-6 h-6 text-yellow-400" />
//                 </div>
//               </div>
//             </Card>
//           </div>

//           {/* Search and Filter Bar */}
//           <Card className="glassEffect border-border/50 p-4">
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="flex-1 relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search automations by name or keyword..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="pl-10 bg-secondary/50 border-border/50"
//                 />
//               </div>

//               <div className="flex gap-2">
//                 <Button
//                   variant={filterMode === "all" ? "default" : "outline"}
//                   size="sm"
//                   onClick={() => setFilterMode("all")}
//                   className="bg-transparent"
//                 >
//                   All
//                 </Button>
//                 <Button
//                   variant={filterMode === "active" ? "default" : "outline"}
//                   size="sm"
//                   onClick={() => setFilterMode("active")}
//                   className="bg-transparent"
//                 >
//                   Active
//                 </Button>
//                 <Button
//                   variant={filterMode === "inactive" ? "default" : "outline"}
//                   size="sm"
//                   onClick={() => setFilterMode("inactive")}
//                   className="bg-transparent"
//                 >
//                   Inactive
//                 </Button>
//               </div>

//               <div className="flex gap-2 border-l border-border/50 pl-2">
//                 <Button
//                   variant={viewMode === "grid" ? "default" : "outline"}
//                   size="sm"
//                   onClick={() => setViewMode("grid")}
//                   className="bg-transparent"
//                 >
//                   <LayoutGrid className="w-4 h-4" />
//                 </Button>
//                 <Button
//                   variant={viewMode === "list" ? "default" : "outline"}
//                   size="sm"
//                   onClick={() => setViewMode("list")}
//                   className="bg-transparent"
//                 >
//                   <LayoutList className="w-4 h-4" />
//                 </Button>
//               </div>
//             </div>
//           </Card>
//         </motion.div>

//         <AnimatePresence mode="wait">
//           {filteredAutomations.length > 0 ? (
//             <motion.div
//               key={`${viewMode}-${filterMode}-${searchQuery}`}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.3 }}
//               className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : "flex flex-col gap-6"}
//             >
//               {filteredAutomations.map((automation, index) => (
//                 <motion.div
//                   key={automation.id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.05, duration: 0.3 }}
//                 >
//                   <FancyAutomationBox
//                     automation={automation}
//                     onDelete={() => {
//                       setSelectedAutomationId(automation.id)
//                       setDeleteType("trash")
//                       setShowConfirmModal(true)
//                     }}
//                     onPermanentDelete={() => {
//                       setSelectedAutomationId(automation.id)
//                       setDeleteType("permanent")
//                       setShowConfirmModal(true)
//                     }}
//                     pathname={pathname || "/"}
//                   />
//                 </motion.div>
//               ))}
//             </motion.div>
//           ) : (
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
//               <div className="relative inline-block mb-6">
//                 <div className="absolute inset-0 bg-muted/20 blur-2xl rounded-full" />
//                 <Search className="w-16 h-16 text-muted-foreground relative z-10" />
//               </div>
//               <h3 className="text-2xl font-semibold mb-2">No automations found</h3>
//               <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {showConfirmModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//             onClick={() => setShowConfirmModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               className={`bg-card border-2 ${deleteType === "permanent" ? "border-destructive/30" : "border-orange-500/30"} p-6 rounded-xl shadow-2xl w-full max-w-md glow`}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <h2 className="text-xl font-semibold mb-3 text-card-foreground">
//                 {deleteType === "trash" ? "Move to Trash?" : "Permanently Delete?"}
//               </h2>
//               <p className="text-sm mb-6 text-muted-foreground">
//                 {deleteType === "trash"
//                   ? "This automation will be moved to trash. You can restore it later from the trash sidebar."
//                   : "This action cannot be undone! The automation and all its data will be permanently deleted."}
//               </p>
//               <div className="flex justify-end gap-3">
//                 <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
//                   Cancel
//                 </Button>
//                 <Button
//                   variant={deleteType === "permanent" ? "destructive" : "default"}
//                   onClick={() => {
//                     if (selectedAutomationId) {
//                       handleDelete(selectedAutomationId, deleteType)
//                     }
//                     setShowConfirmModal(false)
//                   }}
//                   className={deleteType === "trash" ? "bg-orange-600 hover:bg-orange-700" : "glowHover"}
//                 >
//                   {deleteType === "trash" ? "Move to Trash" : "Delete Permanently"}
//                 </Button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}

//         <Button
//           onClick={() => setShowTrashSidebar(!showTrashSidebar)}
//           className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-40"
//           variant="outline"
//         >
//           <Trash2 className="w-5 h-5" />
//           {trashedAutomations.length > 0 && (
//             <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-6 h-6 text-xs flex items-center justify-center">
//               {trashedAutomations.length}
//             </span>
//           )}
//         </Button>

//         <AnimatePresence>
//           {showTrashSidebar && (
//             <>
//               {/* Backdrop */}
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
//                 onClick={() => setShowTrashSidebar(false)}
//               />

//               {/* Sidebar */}
//               <motion.div
//                 initial={{ x: "100%" }}
//                 animate={{ x: 0 }}
//                 exit={{ x: "100%" }}
//                 transition={{ type: "spring", damping: 25, stiffness: 200 }}
//                 className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-background border-l border-border z-50 overflow-y-auto"
//               >
//                 <div className="p-6">
//                   <div className="flex items-center justify-between mb-6">
//                     <div>
//                       <h2 className="text-2xl font-bold">Trash</h2>
//                       <p className="text-sm text-muted-foreground">
//                         {trashedAutomations.length} {trashedAutomations.length === 1 ? "item" : "items"}
//                       </p>
//                     </div>
//                     <Button variant="ghost" size="icon" onClick={() => setShowTrashSidebar(false)}>
//                       <X className="w-5 h-5" />
//                     </Button>
//                   </div>

//                   {trashedAutomations.length === 0 ? (
//                     <div className="flex flex-col items-center justify-center py-20 text-center">
//                       <Trash2 className="w-16 h-16 text-muted-foreground mb-4" />
//                       <h3 className="text-lg font-semibold mb-2">Trash is empty</h3>
//                       <p className="text-sm text-muted-foreground">Deleted automations will appear here</p>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       {trashedAutomations.map((automation) => (
//                         <Card key={automation.id} className="p-4 border-destructive/20">
//                           <div className="flex items-start justify-between mb-3">
//                             <div className="flex-1">
//                               <h3 className="font-semibold text-lg mb-1">{automation.name}</h3>
//                               <p className="text-xs text-muted-foreground">
//                                 Deleted {getSafeRelativeTime(automation.deletedAt)}
//                               </p>
//                             </div>
//                             <Badge
//                               variant="outline"
//                               className="bg-destructive/10 text-destructive border-destructive/30"
//                             >
//                               Trashed
//                             </Badge>
//                           </div>

//                           <div className="flex flex-wrap gap-2 mb-4">
//                             {automation.keywords?.slice(0, 3).map((keyword) => (
//                               <Badge key={keyword.id} variant="outline" className="text-xs">
//                                 {keyword.word}
//                               </Badge>
//                             ))}
//                             {automation.keywords && automation.keywords.length > 3 && (
//                               <Badge variant="outline" className="text-xs">
//                                 +{automation.keywords.length - 3} more
//                               </Badge>
//                             )}
//                           </div>

//                           <div className="flex gap-2">
//                             <Button
//                               size="sm"
//                               variant="outline"
//                               className="flex-1 border-green-500/30 text-green-600 hover:bg-green-500/10 bg-transparent"
//                               onClick={() => handleRestore(automation.id)}
//                             >
//                               <RotateCcw className="w-4 h-4 mr-2" />
//                               Restore
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant="destructive"
//                               onClick={() => {
//                                 if (confirm("Permanently delete this automation? This cannot be undone.")) {
//                                   handlePermanentDeleteFromTrash(automation.id)
//                                 }
//                               }}
//                             >
//                               <Trash2 className="w-4 h-4 mr-2" />
//                               Delete Forever
//                             </Button>
//                           </div>
//                         </Card>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </motion.div>
//             </>
//           )}
//         </AnimatePresence>

//         {/* Payment Popup */}
//         <PaymentPopup
//           isOpen={showPaymentPopup}
//           onClose={() => setShowPaymentPopup(false)}
//           onSuccess={() => {
//             setShowPaymentPopup(false)
//             refetch()
//           }}
//         />
//       </div>
//     </div>
//   )
// }

// export default AutomationList

"use client"
import { useMemo, useEffect, useState } from "react"
import { usePaths } from "@/hooks/user-nav"
import { Button } from "@/components/ui/button"
import { useQueryAutomations } from "@/hooks/user-queries"
import {
  useQueryTrashedAutomations,
  useRestoreAutomation,
  usePermanentlyDeleteAutomation,
} from "@/hooks/user-queries-trash"
import CreateAutomation from "../create-automation"
import { useMutationDataState } from "@/hooks/use-mutation-data"
import { useAutomationPosts } from "@/hooks/use-automations"
import { FancyAutomationBox } from "../fancy/fancy-automation-box"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  Zap,
  Activity,
  TrendingUp,
  Search,
  LayoutGrid,
  LayoutList,
  Bot,
  Trash2,
  X,
  RotateCcw,
  AlertTriangle,
  Archive,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import PaymentPopup from "../stripe/payment-popup"
import { getRelativeTime } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AutomationListSkeleton } from "./automation-skeleton"

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
  deletedAt?: Date | null
  listener: Listener | null
}

type Props = {
  id: string
}

const getSafeRelativeTime = (date?: Date | string | null): string => {
  if (!date) return "Recently"
  try {
    const dateObj = date instanceof Date ? date : new Date(date)
    if (isNaN(dateObj.getTime())) return "Recently"
    return getRelativeTime(dateObj)
  } catch {
    return "Recently"
  }
}

const AutomationList = ({ id }: Props) => {
  const { data, refetch, isLoading } = useQueryAutomations()
  const { data: trashedData, refetch: refetchTrashed } = useQueryTrashedAutomations()

  console.log("[v0] AutomationList: data:", data)
  console.log("[v0] AutomationList: isLoading:", isLoading)
  console.log("[v0] AutomationList: trashedData:", trashedData)

  const { mutate: restoreAutomation } = useRestoreAutomation()
  const { mutate: permanentlyDelete } = usePermanentlyDeleteAutomation()

  const { deleteMutation, permanentDeleteMutation } = useAutomationPosts(id)
  const { latestVariable } = useMutationDataState(["create-automation"])
  const { pathname } = usePaths()

  const [automations, setAutomations] = useState<Automation[]>(data?.data || [])
  const [trashedAutomations, setTrashedAutomations] = useState<Automation[]>(trashedData?.data || [])
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedAutomationId, setSelectedAutomationId] = useState<string | null>(null)
  const [deleteType, setDeleteType] = useState<"trash" | "permanent">("trash")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterMode, setFilterMode] = useState<"all" | "active" | "inactive">("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showPaymentPopup, setShowPaymentPopup] = useState(false)
  const [showTrashSidebar, setShowTrashSidebar] = useState(false)
  const [trashSearchQuery, setTrashSearchQuery] = useState("")

  useEffect(() => {
    if (data?.data) {
      setAutomations(data.data)
    }
  }, [data])

  useEffect(() => {
    if (trashedData?.data) {
      console.log("[v0] Setting trashed automations:", trashedData.data)
      setTrashedAutomations(trashedData.data)
    }
  }, [trashedData])

  const handleDelete = (automationId: string, type: "trash" | "permanent") => {
    if (type === "trash") {
      deleteMutation(
        { id: automationId },
        {
          onSuccess: () => {
            console.log("Automation moved to trash")
            setAutomations((prev) => prev.filter((a) => a.id !== automationId))
            refetchTrashed()
          },
        },
      )
    } else {
      permanentDeleteMutation(
        { id: automationId },
        {
          onSuccess: () => {
            console.log("Automation permanently deleted")
            setAutomations((prev) => prev.filter((a) => a.id !== automationId))
          },
        },
      )
    }
  }

  const handleRestore = (automationId: string) => {
    restoreAutomation(
      { id: automationId },
      {
        onSuccess: () => {
          console.log("Automation restored successfully")
          setTrashedAutomations((prev) => prev.filter((a) => a.id !== automationId))
          refetch()
        },
      },
    )
  }

  const handlePermanentDeleteFromTrash = (automationId: string) => {
    permanentlyDelete(
      { id: automationId },
      {
        onSuccess: () => {
          console.log("Automation permanently deleted")
          setTrashedAutomations((prev) => prev.filter((a) => a.id !== automationId))
        },
      },
    )
  }

  const optimisticUiData = useMemo(() => {
    if (latestVariable?.variables && data) {
      const test = [latestVariable.variables, ...automations]
      return { data: test as Automation[] }
    }
    return { data: automations }
  }, [latestVariable, automations])

  const filteredAutomations = useMemo(() => {
    let filtered = optimisticUiData.data

    // Apply filter mode
    if (filterMode === "active") {
      filtered = filtered.filter((a) => a.active)
    } else if (filterMode === "inactive") {
      filtered = filtered.filter((a) => !a.active)
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(
        (a) =>
          a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.keywords.some((k) => k.word.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    return filtered
  }, [optimisticUiData.data, filterMode, searchQuery])

  const activeAutomations = optimisticUiData.data.filter((automation) => automation.active)
  const inactiveAutomations = optimisticUiData.data.filter((automation) => !automation.active)
  const smartAICount = optimisticUiData.data.filter((a) => a.listener?.listener === "SMARTAI").length
  const totalMessages =
    optimisticUiData.data.reduce((acc, a) => acc + (a.listener?.dmCount || 0) + (a.listener?.commentCount || 0), 0) || 0

  const filteredTrashAutomations = useMemo(() => {
    if (!trashSearchQuery) return trashedAutomations

    return trashedAutomations.filter(
      (a) =>
        a.name.toLowerCase().includes(trashSearchQuery.toLowerCase()) ||
        a.keywords?.some((k) => k.word.toLowerCase().includes(trashSearchQuery.toLowerCase())),
    )
  }, [trashedAutomations, trashSearchQuery])

  if (isLoading) {
    return <AutomationListSkeleton />
  }

  if (!automations.length) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-[70vh] flex justify-center items-center flex-col gap-y-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
              <Bot className="w-24 h-24 text-primary relative z-10" />
            </div>
            <div className="text-center space-y-3">
              <h3 className="text-3xl md:text-5xl font-bold mb-3 text-balance">No Automations Yet</h3>
              <p className="text-lg text-muted-foreground max-w-md">
                Start automating your workflow by creating your first automation
              </p>
            </div>
            <CreateAutomation currentAutomationCount={0} onUpgradeClick={() => setShowPaymentPopup(true)} />
          </motion.div>
        </div>

        <PaymentPopup
          isOpen={showPaymentPopup}
          onClose={() => setShowPaymentPopup(false)}
          onSuccess={() => {
            setShowPaymentPopup(false)
            refetch()
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 staggeredFadeIn">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <h3 className="text-4xl md:text-5xl font-bold mb-3 text-balance">Your Automations</h3>
              <p className="text-muted-foreground text-lg">Manage and monitor your automated workflows</p>
            </div>
            <CreateAutomation
              currentAutomationCount={automations.length}
              onUpgradeClick={() => setShowPaymentPopup(true)}
            />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="glassEffect border-border/50 glow p-6 float">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Automations</p>
                  <p className="text-3xl font-bold">{optimisticUiData.data.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <Activity className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </Card>

            <Card className="glassEffect border-border/50 glow p-6 float" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Active</p>
                  <p className="text-3xl font-bold text-green-400">{activeAutomations.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </Card>

            <Card className="glassEffect border-border/50 glow p-6 float" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Smart AI</p>
                  <p className="text-3xl font-bold text-purple-400">{smartAICount}</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </Card>

            <Card className="glassEffect border-border/50 glow p-6 float" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Messages</p>
                  <p className="text-3xl font-bold text-yellow-400">{totalMessages}</p>
                </div>
                <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                  <Zap className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </Card>
          </div>

          {/* Search and Filter Bar */}
          <Card className="glassEffect border-border/50 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search automations by name or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary/50 border-border/50"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant={filterMode === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterMode("all")}
                  className="bg-transparent"
                >
                  All
                </Button>
                <Button
                  variant={filterMode === "active" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterMode("active")}
                  className="bg-transparent"
                >
                  Active
                </Button>
                <Button
                  variant={filterMode === "inactive" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterMode("inactive")}
                  className="bg-transparent"
                >
                  Inactive
                </Button>
              </div>

              <div className="flex gap-2 border-l border-border/50 pl-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="bg-transparent"
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="bg-transparent"
                >
                  <LayoutList className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        <AnimatePresence mode="wait">
          {filteredAutomations.length > 0 ? (
            <motion.div
              key={`${viewMode}-${filterMode}-${searchQuery}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : "flex flex-col gap-6"}
            >
              {filteredAutomations.map((automation, index) => (
                <motion.div
                  key={automation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <FancyAutomationBox
                    automation={automation}
                    onDelete={() => {
                      setSelectedAutomationId(automation.id)
                      setDeleteType("trash")
                      setShowConfirmModal(true)
                    }}
                    onPermanentDelete={() => {
                      setSelectedAutomationId(automation.id)
                      setDeleteType("permanent")
                      setShowConfirmModal(true)
                    }}
                    pathname={pathname || "/"}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-muted/20 blur-2xl rounded-full" />
                <Search className="w-16 h-16 text-muted-foreground relative z-10" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">No automations found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </motion.div>
          )}
        </AnimatePresence>

        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowConfirmModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`bg-card border-2 ${deleteType === "permanent" ? "border-destructive/30" : "border-orange-500/30"} p-6 rounded-xl shadow-2xl w-full max-w-md glow`}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold mb-3 text-card-foreground">
                {deleteType === "trash" ? "Move to Trash?" : "Permanently Delete?"}
              </h2>
              <p className="text-sm mb-6 text-muted-foreground">
                {deleteType === "trash"
                  ? "This automation will be moved to trash. You can restore it later from the trash sidebar."
                  : "This action cannot be undone! The automation and all its data will be permanently deleted."}
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                  Cancel
                </Button>
                <Button
                  variant={deleteType === "permanent" ? "destructive" : "default"}
                  onClick={() => {
                    if (selectedAutomationId) {
                      handleDelete(selectedAutomationId, deleteType)
                    }
                    setShowConfirmModal(false)
                  }}
                  className={deleteType === "trash" ? "bg-orange-600 hover:bg-orange-700" : "glowHover"}
                >
                  {deleteType === "trash" ? "Move to Trash" : "Delete Permanently"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}

        <Button
          onClick={() => setShowTrashSidebar(!showTrashSidebar)}
          className="fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-2xl z-40 border-2 border-border/50 hover:scale-110 transition-transform"
          variant="outline"
        >
          <Trash2 className="w-6 h-6" />
          {trashedAutomations.length > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-7 h-7 text-xs font-bold flex items-center justify-center border-2 border-background shadow-lg"
            >
              {trashedAutomations.length}
            </motion.span>
          )}
        </Button>

        <AnimatePresence>
          {showTrashSidebar && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                onClick={() => setShowTrashSidebar(false)}
              />

              {/* Professional Sidebar */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-background border-l-2 border-border/50 z-50 flex flex-col shadow-2xl"
              >
                {/* Header */}
                <div className="border-b border-border/50 bg-muted/30 backdrop-blur-sm">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                          <Trash2 className="w-6 h-6 text-destructive" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-foreground">Trash</h2>
                          <p className="text-sm text-muted-foreground mt-1">
                            {trashedAutomations.length} {trashedAutomations.length === 1 ? "automation" : "automations"}{" "}
                            in trash
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowTrashSidebar(false)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>

                    {/* Search Bar */}
                    {trashedAutomations.length > 0 && (
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search trashed automations..."
                          value={trashSearchQuery}
                          onChange={(e) => setTrashSearchQuery(e.target.value)}
                          className="pl-10 bg-background/50 border-border/50"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <ScrollArea className="flex-1">
                  <div className="p-6">
                    {trashedAutomations.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                      >
                        <div className="relative mb-6">
                          <div className="absolute inset-0 bg-muted/20 blur-3xl rounded-full" />
                          <div className="relative p-6 rounded-2xl bg-muted/30 border border-border/50">
                            <Archive className="w-16 h-16 text-muted-foreground" />
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-foreground">Trash is empty</h3>
                        <p className="text-sm text-muted-foreground max-w-xs">
                          Deleted automations will appear here and can be restored within 30 days
                        </p>
                      </motion.div>
                    ) : filteredTrashAutomations.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                      >
                        <Search className="w-12 h-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No results found</h3>
                        <p className="text-sm text-muted-foreground">Try a different search term</p>
                      </motion.div>
                    ) : (
                      <div className="space-y-4">
                        {filteredTrashAutomations.map((automation, index) => (
                          <motion.div
                            key={automation.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Card className="p-5 border-destructive/20 bg-card/50 backdrop-blur-sm hover:border-destructive/40 transition-all group">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-lg mb-2 text-foreground truncate group-hover:text-primary transition-colors">
                                    {automation.name}
                                  </h3>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Trash2 className="w-3 h-3" />
                                      Deleted {getSafeRelativeTime(automation.deletedAt)}
                                    </span>
                                    <Separator orientation="vertical" className="h-3" />
                                    <span>
                                      {automation.keywords?.length || 0}{" "}
                                      {automation.keywords?.length === 1 ? "keyword" : "keywords"}
                                    </span>
                                  </div>
                                </div>
                                <Badge
                                  variant="outline"
                                  className="bg-destructive/10 text-destructive border-destructive/30 shrink-0"
                                >
                                  Trashed
                                </Badge>
                              </div>

                              {automation.keywords && automation.keywords.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {automation.keywords.slice(0, 4).map((keyword) => (
                                    <Badge key={keyword.id} variant="secondary" className="text-xs font-normal">
                                      {keyword.word}
                                    </Badge>
                                  ))}
                                  {automation.keywords.length > 4 && (
                                    <Badge variant="secondary" className="text-xs font-normal">
                                      +{automation.keywords.length - 4} more
                                    </Badge>
                                  )}
                                </div>
                              )}

                              <Separator className="my-4" />

                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 border-green-500/30 text-green-600 hover:bg-green-500/10 hover:border-green-500/50 bg-transparent"
                                  onClick={() => handleRestore(automation.id)}
                                >
                                  <RotateCcw className="w-4 h-4 mr-2" />
                                  Restore
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="hover:bg-destructive/90"
                                  onClick={() => {
                                    if (
                                      confirm(
                                        "Permanently delete this automation? This action cannot be undone and all data will be lost forever.",
                                      )
                                    ) {
                                      handlePermanentDeleteFromTrash(automation.id)
                                    }
                                  }}
                                >
                                  <AlertTriangle className="w-4 h-4 mr-2" />
                                  Delete Forever
                                </Button>
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Footer */}
                {trashedAutomations.length > 0 && (
                  <div className="border-t border-border/50 bg-muted/30 backdrop-blur-sm p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 px-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Items in trash are automatically deleted after 30 days</span>
                    </div>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => {
                        if (
                          confirm(
                            `Permanently delete all ${trashedAutomations.length} automations? This action cannot be undone.`,
                          )
                        ) {
                          trashedAutomations.forEach((automation) => {
                            handlePermanentDeleteFromTrash(automation.id)
                          })
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Empty Trash ({trashedAutomations.length})
                    </Button>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Payment Popup */}
        <PaymentPopup
          isOpen={showPaymentPopup}
          onClose={() => setShowPaymentPopup(false)}
          onSuccess={() => {
            setShowPaymentPopup(false)
            refetch()
          }}
        />
      </div>
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



















