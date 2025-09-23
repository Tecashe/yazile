// 'use client'

// import React, { useState, useEffect, useRef } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Bell, X, Check, AlertTriangle, Info } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { NotificationItem } from '@/components/global/navbar/notifications/notificationitem'
// // import { NotificationBadge } from './NotificationBadge' // Removed import
// import { useNotifications } from '@/hooks/use-notifications'
// import { Notification, NotificationType } from '@/types/notifications'
// import { cn } from '@/lib/utils'

// export const Notifications: React.FC = () => {
//   const [isOpen, setIsOpen] = useState(false)
//   const notificationRef = useRef<HTMLDivElement>(null)
//   const { notifications, markAsRead, clearAll } = useNotifications()
//   const unreadCount = notifications.filter(n => !n.read).length

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
//         setIsOpen(false)
//       }
//     }

//     document.addEventListener('mousedown', handleClickOutside)
//     return () => document.removeEventListener('mousedown', handleClickOutside)
//   }, [])

//   const toggleNotifications = () => setIsOpen(!isOpen)

//   return (
//     <div className="relative" ref={notificationRef}>
//       <Button
//         onClick={toggleNotifications}
//         className={cn(
//           "bg-white rounded-full py-6 transition-all duration-300 ease-in-out relative",
//           isOpen && "ring-2 ring-blue-500 ring-opacity-50"
//         )}
//       >
//         <Bell
//         color="#3352CC"
//         fill="#3352CC"
//           // className="w-6 h-6 text-blue-600"
//           // style={{ 
//           //   filter: isOpen ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))' : 'none'
//           // }}
//         />
//         {unreadCount > 0 && (
//           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
//             {unreadCount > 99 ? '99+' : unreadCount}
//           </span>
//         )}
//       </Button>
      
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95, y: 10 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.95, y: 10 }}
//             transition={{ duration: 0.2 }}
//             className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50"
//           >
//             <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
//               <h3 className="text-lg font-semibold">Notifications</h3>
//               <Button
//                 onClick={clearAll}
//                 variant="ghost"
//                 size="sm"
//                 className="text-white hover:bg-blue-700"
//               >
//                 Clear All
//               </Button>
//             </div>
//             <div className="max-h-96 overflow-y-auto">
//               <AnimatePresence initial={false}>
//                 {notifications.length > 0 ? (
//                   notifications.map((notification, index) => (
//                     <NotificationItem
//                       key={notification.id}
//                       notification={notification}
//                       onMarkAsRead={() => markAsRead(notification.id)}
//                       index={index}
//                     />
//                   ))
//                 ) : (
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     className="p-4 text-center text-gray-500"
//                   >
//                     No notifications
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   )
// }

// 'use client'

// import React, { useState, useEffect, useRef } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Bell, X } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { NotificationItem } from '@/components/global/navbar/notifications/notificationitem'
// import { useNotifications } from '@/hooks/use-notifications'
// import { cn } from '@/lib/utils'

// export const Notifications: React.FC = () => {
//   const [isOpen, setIsOpen] = useState(false)
//   const notificationRef = useRef<HTMLDivElement>(null)
//   const { notifications, markAsRead, clearAll } = useNotifications()
//   const unreadCount = notifications.filter(n => !n.read).length

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
//         setIsOpen(false)
//       }
//     }

//     document.addEventListener('mousedown', handleClickOutside)
//     return () => document.removeEventListener('mousedown', handleClickOutside)
//   }, [])

//   const toggleNotifications = () => setIsOpen(!isOpen)

//   return (
//     <div className="relative" ref={notificationRef}>
//       <Button
//         onClick={toggleNotifications}
//         className={cn(
//           "bg-gray-800 rounded-full py-6 transition-all duration-300 ease-in-out relative",
//           isOpen && "ring-2 ring-blue-500 ring-opacity-50"
//         )}
//       >
//         <Bell className="w-6 h-6 text-blue-500" />
//         {unreadCount > 0 && (
//           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
//             {unreadCount > 99 ? '99+' : unreadCount}
//           </span>
//         )}
//       </Button>
      
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95, y: 10 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.95, y: 10 }}
//             transition={{ duration: 0.2 }}
//             className="absolute right-0 mt-2 w-64 sm:w-72 md:w-80 bg-gray-900 rounded-lg shadow-lg overflow-hidden z-50 border border-blue-500"
//           >
          
//             <div className="p-4 bg-gray-800 text-blue-400 flex justify-between items-center">
//               <h3 className="text-lg font-semibold">Notifications</h3>
//               <Button
//                 onClick={clearAll}
//                 variant="ghost"
//                 size="sm"
//                 className="text-blue-400 hover:text-blue-500"
//               >
//                 Clear All
//               </Button>
//             </div>
//             <div className="max-h-96 overflow-y-auto">
//               <AnimatePresence initial={false}>
//                 {notifications.length > 0 ? (
//                   notifications.map((notification, index) => (
//                     <NotificationItem
//                       key={notification.id}
//                       notification={notification}
//                       onMarkAsRead={() => markAsRead(notification.id)}
//                       index={index}
//                     />
//                   ))
//                 ) : (
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     className="p-4 text-center text-gray-500"
//                   >                 
//                     No notifications
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   )
// }

// import React, { useState } from 'react'
// import { Bell, X, Check, CheckCheck, Trash2, ExternalLink } from 'lucide-react'
// import { useNotificationContext } from '@/contexts/notification-context'

// // Notification Badge Component
// export function NotificationBadge() {
//   const { unreadCount } = useNotificationContext()
  
//   if (unreadCount === 0) return null
  
//   return (
//     <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
//       {unreadCount > 99 ? '99+' : unreadCount}
//     </span>
//   )
// }

// // Notification Bell Icon
// export function NotificationBell({ onClick }: { onClick?: () => void }) {
//   const { unreadCount } = useNotificationContext()
  
//   return (
//     <button
//       onClick={onClick}
//       className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
//     >
//       <Bell className="h-6 w-6" />
//       <NotificationBadge />
//     </button>
//   )
// }

// // Individual Notification Item
// function NotificationItem({ notification, onMarkAsRead, onDelete, onNavigate }: {
//   notification: any
//   onMarkAsRead: (id: string) => void
//   onDelete: (id: string) => void
//   onNavigate: (url: string) => void
// }) {
//   const getNotificationIcon = (type: string) => {
//     const iconClass = "h-4 w-4 flex-shrink-0"
    
//     switch (type) {
//       case 'LEAD_GENERATED':
//         return <div className={`${iconClass} bg-green-100 text-green-600 rounded p-1`}>👤</div>
//       case 'LEAD_QUALIFIED':
//         return <div className={`${iconClass} bg-blue-100 text-blue-600 rounded p-1`}>⭐</div>
//       case 'AUTOMATION_COMPLETED':
//         return <div className={`${iconClass} bg-purple-100 text-purple-600 rounded p-1`}>🤖</div>
//       case 'AUTOMATION_ERROR':
//         return <div className={`${iconClass} bg-red-100 text-red-600 rounded p-1`}>⚠️</div>
//       case 'CRM_SYNC_SUCCESS':
//         return <div className={`${iconClass} bg-emerald-100 text-emerald-600 rounded p-1`}>🔄</div>
//       case 'CRM_SYNC_ERROR':
//         return <div className={`${iconClass} bg-orange-100 text-orange-600 rounded p-1`}>❌</div>
//       default:
//         return <div className={`${iconClass} bg-gray-100 text-gray-600 rounded p-1`}>🔔</div>
//     }
//   }

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString)
//     const now = new Date()
//     const diff = now.getTime() - date.getTime()
//     const minutes = Math.floor(diff / 60000)
//     const hours = Math.floor(minutes / 60)
//     const days = Math.floor(hours / 24)

//     if (minutes < 1) return 'Just now'
//     if (minutes < 60) return `${minutes}m ago`
//     if (hours < 24) return `${hours}h ago`
//     if (days < 7) return `${days}d ago`
//     return date.toLocaleDateString()
//   }

//   return (
//     <div className={`flex items-start space-x-3 p-4 hover:bg-gray-50 border-b border-gray-100 ${
//       !notification.isRead ? 'bg-blue-50' : ''
//     }`}>
//       {getNotificationIcon(notification.type)}
      
//       <div className="flex-1 min-w-0">
//         <div className="flex items-center justify-between">
//           <p className={`text-sm font-medium text-gray-900 ${
//             !notification.isRead ? 'font-semibold' : ''
//           }`}>
//             {notification.title}
//           </p>
//           <div className="flex items-center space-x-1">
//             {!notification.isRead && (
//               <button
//                 onClick={() => onMarkAsRead(notification.id)}
//                 className="p-1 text-blue-600 hover:text-blue-800 rounded"
//                 title="Mark as read"
//               >
//                 <Check className="h-4 w-4" />
//               </button>
//             )}
//             <button
//               onClick={() => onDelete(notification.id)}
//               className="p-1 text-red-600 hover:text-red-800 rounded"
//               title="Delete notification"
//             >
//               <Trash2 className="h-4 w-4" />
//             </button>
//           </div>
//         </div>
        
//         <p className="text-sm text-gray-600 mt-1">
//           {notification.message}
//         </p>
        
//         {notification.business && (
//           <p className="text-xs text-gray-500 mt-1">
//             Business: {notification.business.businessName || notification.business.name}
//           </p>
//         )}
        
//         <div className="flex items-center justify-between mt-2">
//           <span className="text-xs text-gray-500">
//             {formatDate(notification.createdAt)}
//           </span>
          
//           {notification.actionUrl && (
//             <button
//               onClick={() => onNavigate(notification.actionUrl)}
//               className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1"
//             >
//               <span>View</span>
//               <ExternalLink className="h-3 w-3" />
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// // Notification Dropdown Panel
// export function NotificationPanel({ isOpen, onClose }: { 
//   isOpen: boolean
//   onClose: () => void 
// }) {
//   const {
//     notifications,
//     loading,
//     markAsRead,
//     markAllAsRead,
//     deleteNotification,
//     loadMoreNotifications
//   } = useNotificationContext()
  
//   const [page, setPage] = useState(1)
//   const [hasMore, setHasMore] = useState(true)

//   const handleLoadMore = async () => {
//     const nextPage = page + 1
//     const moreAvailable = await loadMoreNotifications(nextPage)
//     setPage(nextPage)
//     setHasMore(moreAvailable)
//   }

//   const handleNavigate = (url: string) => {
//     window.location.href = url
//     onClose()
//   }

//   if (!isOpen) return null

//   return (
//     <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
//       {/* Header */}
//       <div className="flex items-center justify-between p-4 border-b border-gray-100">
//         <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
//         <div className="flex items-center space-x-2">
//           {notifications.some(n => !n.isRead) && (
//             <button
//               onClick={markAllAsRead}
//               className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
//             >
//               <CheckCheck className="h-4 w-4" />
//               <span>Mark all read</span>
//             </button>
//           )}
//           <button
//             onClick={onClose}
//             className="p-1 text-gray-400 hover:text-gray-600 rounded"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="max-h-80 overflow-y-auto">
//         {loading ? (
//           <div className="flex items-center justify-center p-8">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//           </div>
//         ) : notifications.length === 0 ? (
//           <div className="flex flex-col items-center justify-center p-8 text-gray-500">
//             <Bell className="h-12 w-12 text-gray-300 mb-4" />
//             <p className="text-center">No notifications yet</p>
//             <p className="text-sm text-center mt-1">
//               You&apos;ll see notifications here when something important happens.
//             </p>
//           </div>
//         ) : (
//           <>
//             {notifications.map((notification) => (
//               <NotificationItem
//                 key={notification.id}
//                 notification={notification}
//                 onMarkAsRead={markAsRead}
//                 onDelete={deleteNotification}
//                 onNavigate={handleNavigate}
//               />
//             ))}
            
//             {hasMore && (
//               <button
//                 onClick={handleLoadMore}
//                 className="w-full p-4 text-sm text-blue-600 hover:text-blue-800 hover:bg-gray-50 border-t border-gray-100"
//               >
//                 Load more notifications
//               </button>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   )
// }

// // Complete Notification Component
// export function NotificationCenter() {
//   const [isOpen, setIsOpen] = useState(false)

//   return (
//     <div className="relative">
//       <NotificationBell onClick={() => setIsOpen(!isOpen)} />
//       <NotificationPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
//     </div>
//   )
// }

// // In-App Toast Notification Component
// export function NotificationToast({ notification, onClose }: {
//   notification: any
//   onClose: () => void
// }) {
//   const [isVisible, setIsVisible] = useState(true)

//   const handleClose = () => {
//     setIsVisible(false)
//     setTimeout(onClose, 300) // Wait for animation to complete
//   }

//   if (!isVisible) return null

//   return (
//     <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
//       isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
//     }`}>
//       <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
//         <div className="flex items-start space-x-3">
//           <div className="flex-shrink-0">
//             <Bell className="h-5 w-5 text-blue-600" />
//           </div>
//           <div className="flex-1">
//             <p className="font-medium text-gray-900">{notification.title}</p>
//             <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
//             {notification.actionUrl && (
//               <button
//                 onClick={() => window.location.href = notification.actionUrl}
//                 className="text-sm text-blue-600 hover:text-blue-800 mt-2"
//               >
//                 View Details
//               </button>
//             )}
//           </div>
//           <button
//             onClick={handleClose}
//             className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600"
//           >
//             <X className="h-4 w-4" />
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }


// import React, { useState } from 'react'
// import {X, Check, CheckCheck, Trash2, ExternalLink, Loader2, Bell } from 'lucide-react'
// import { useNotificationContext } from '@/contexts/notification-context'
// import { Button } from "@/components/ui/button"

// // Notification Badge Component
// export function NotificationBadge() {
//   const { unreadCount } = useNotificationContext()
  
//   if (unreadCount === 0) return null
  
//   return (
//     <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium min-w-[1.25rem] animate-in zoom-in-50 duration-200">
//       {unreadCount > 99 ? '99+' : unreadCount}
//     </span>
//   )
// }

// // Notification Bell Icon
// export function NotificationBell({ onClick }: { onClick?: () => void }) {
//   const { unreadCount } = useNotificationContext()
  
//   return (

//     <button
//       onClick={onClick}
//       className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200 group"
//       aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
//     >
      
//       <Bell className="h-4 w-4" />
//       <NotificationBadge />
//     </button>
//   )
// }

// // Individual Notification Item
// function NotificationItem({ notification, onMarkAsRead, onDelete, onNavigate }: {
//   notification: any
//   onMarkAsRead: (id: string) => void
//   onDelete: (id: string) => void
//   onNavigate: (url: string) => void
// }) {
//   const [isDeleting, setIsDeleting] = useState(false)
//   const [isMarking, setIsMarking] = useState(false)

//   const getNotificationIcon = (type: string) => {
//     const baseClasses = "h-8 w-8 flex items-center justify-center rounded-full text-sm flex-shrink-0"
    
//     switch (type) {
//       case 'LEAD_GENERATED':
//         return <div className={`${baseClasses} bg-green-500/10 text-green-400 border border-green-500/20`}>👤</div>
//       case 'LEAD_QUALIFIED':
//         return <div className={`${baseClasses} bg-blue-500/10 text-blue-400 border border-blue-500/20`}>⭐</div>
//       case 'AUTOMATION_COMPLETED':
//         return <div className={`${baseClasses} bg-purple-500/10 text-purple-400 border border-purple-500/20`}>🤖</div>
//       case 'AUTOMATION_ERROR':
//         return <div className={`${baseClasses} bg-destructive/10 text-destructive border border-destructive/20`}>⚠️</div>
//       case 'CRM_SYNC_SUCCESS':
//         return <div className={`${baseClasses} bg-emerald-500/10 text-emerald-400 border border-emerald-500/20`}>🔄</div>
//       case 'CRM_SYNC_ERROR':
//         return <div className={`${baseClasses} bg-orange-500/10 text-orange-400 border border-orange-500/20`}>❌</div>
//       case 'CAMPAIGN_STARTED':
//         return <div className={`${baseClasses} bg-cyan-500/10 text-cyan-400 border border-cyan-500/20`}>📢</div>
//       case 'CAMPAIGN_COMPLETED':
//         return <div className={`${baseClasses} bg-teal-500/10 text-teal-400 border border-teal-500/20`}>✅</div>
//       case 'SYSTEM_ALERT':
//         return <div className={`${baseClasses} bg-yellow-500/10 text-yellow-400 border border-yellow-500/20`}>🔔</div>
//       default:
//         return <div className={`${baseClasses} bg-muted text-muted-foreground border border-border`}>🔔</div>
//     }
//   }

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString)
//     const now = new Date()
//     const diff = now.getTime() - date.getTime()
//     const minutes = Math.floor(diff / 60000)
//     const hours = Math.floor(minutes / 60)
//     const days = Math.floor(hours / 24)

//     if (minutes < 1) return 'Just now'
//     if (minutes < 60) return `${minutes}m ago`
//     if (hours < 24) return `${hours}h ago`
//     if (days < 7) return `${days}d ago`
//     return date.toLocaleDateString()
//   }

//   const handleDelete = async () => {
//     setIsDeleting(true)
//     await onDelete(notification.id)
//     setIsDeleting(false)
//   }

//   const handleMarkAsRead = async () => {
//     setIsMarking(true)
//     await onMarkAsRead(notification.id)
//     setIsMarking(false)
//   }

//   return (
//     <div className={`group flex items-start space-x-3 p-4 hover:bg-accent/50 border-b border-border transition-all duration-200 ${
//       !notification.isRead ? 'bg-accent/20 border-l-4 border-l-primary' : ''
//     }`}>
//       {getNotificationIcon(notification.type)}
      
//       <div className="flex-1 min-w-0 space-y-1">
//         <div className="flex items-start justify-between gap-2">
//           <p className={`text-sm font-medium text-foreground leading-tight ${
//             !notification.isRead ? 'font-semibold' : ''
//           }`}>
//             {notification.title}
//           </p>
//           <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//             {!notification.isRead && (
//               <button
//                 onClick={handleMarkAsRead}
//                 disabled={isMarking}
//                 className="p-1.5 text-primary hover:text-primary/80 rounded-md hover:bg-primary/10 transition-all duration-200 disabled:opacity-50"
//                 title="Mark as read"
//               >
//                 {isMarking ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
//               </button>
//             )}
//             <button
//               onClick={handleDelete}
//               disabled={isDeleting}
//               className="p-1.5 text-destructive hover:text-destructive/80 rounded-md hover:bg-destructive/10 transition-all duration-200 disabled:opacity-50"
//               title="Delete notification"
//             >
//               {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
//             </button>
//           </div>
//         </div>
        
//         <p className="text-sm text-muted-foreground leading-relaxed">
//           {notification.message}
//         </p>
        
//         {notification.business && (
//           <p className="text-xs text-muted-foreground/80 bg-muted/30 px-2 py-1 rounded-md inline-block">
//             {notification.business.businessName || notification.business.name}
//           </p>
//         )}
        
//         <div className="flex items-center justify-between pt-2">
//           <span className="text-xs text-muted-foreground">
//             {formatDate(notification.createdAt)}
//           </span>
          
//           {notification.actionUrl && (
//             <button
//               onClick={() => onNavigate(notification.actionUrl)}
//               className="text-xs text-primary hover:text-primary/80 flex items-center space-x-1 hover:bg-primary/10 px-2 py-1 rounded-md transition-all duration-200"
//             >
//               <span>View Details</span>
//               <ExternalLink className="h-3 w-3" />
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// // Notification Dropdown Panel
// export function NotificationPanel({ isOpen, onClose }: { 
//   isOpen: boolean
//   onClose: () => void 
// }) {
//   const {
//     notifications,
//     loading,
//     markAsRead,
//     markAllAsRead,
//     deleteNotification,
//     loadMoreNotifications
//   } = useNotificationContext()
  
//   const [page, setPage] = useState(1)
//   const [hasMore, setHasMore] = useState(true)
//   const [loadingMore, setLoadingMore] = useState(false)

//   const handleLoadMore = async () => {
//     setLoadingMore(true)
//     const nextPage = page + 1
//     const moreAvailable = await loadMoreNotifications(nextPage)
//     setPage(nextPage)
//     setHasMore(moreAvailable)
//     setLoadingMore(false)
//   }

//   const handleNavigate = (url: string) => {
//     window.location.href = url
//     onClose()
//   }

//   if (!isOpen) return null

//   return (
//     <>
//       {/* Mobile backdrop */}
//       <div 
//         className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
//         onClick={onClose}
//       />
      
//       {/* Notification panel */}
//       <div className="absolute right-0 mt-2 w-full max-w-sm md:w-96 bg-card/95 backdrop-blur-md rounded-lg shadow-lg border border-border z-50 max-h-[85vh] md:max-h-96 overflow-hidden animate-in slide-in-from-top-2 duration-200">
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-sm">
//           <div>
//             <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
//             {notifications.length > 0 && (
//               <p className="text-xs text-muted-foreground">
//                 {notifications.filter(n => !n.isRead).length} unread of {notifications.length}
//               </p>
//             )}
//           </div>
//           <div className="flex items-center space-x-2">
//             {notifications.some(n => !n.isRead) && (
//               <button
//                 onClick={markAllAsRead}
//                 className="text-sm text-primary hover:text-primary/80 flex items-center space-x-1 hover:bg-primary/10 px-2 py-1 rounded-md transition-all duration-200"
//               >
//                 <CheckCheck className="h-3 w-3" />
//                 <span className="hidden sm:inline">Mark all read</span>
//               </button>
//             )}
//             <button
//               onClick={onClose}
//               className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-all duration-200"
//             >
//               <X className="h-4 w-4" />
//             </button>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="max-h-80 overflow-y-auto no-scrollbar">
//           {loading ? (
//             <div className="flex items-center justify-center p-8">
//               <div className="flex flex-col items-center space-y-3">
//                 <Loader2 className="h-8 w-8 animate-spin text-primary" />
//                 <p className="text-sm text-muted-foreground">Loading notifications...</p>
//               </div>
//             </div>
//           ) : notifications.length === 0 ? (
//             <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
//               <div className="bg-muted/30 rounded-full p-4 mb-4">
//                 <Bell className="h-8 w-8" />
//               </div>
//               <p className="text-center font-medium mb-1">No notifications yet</p>
//               <p className="text-sm text-center text-muted-foreground/70">
//                 You&apos;ll see notifications here when something important happens.
//               </p>
//             </div>
//           ) : (
//             <>
//               {notifications.map((notification) => (
//                 <NotificationItem
//                   key={notification.id}
//                   notification={notification}
//                   onMarkAsRead={markAsRead}
//                   onDelete={deleteNotification}
//                   onNavigate={handleNavigate}
//                 />
//               ))}
              
//               {hasMore && (
//                 <button
//                   onClick={handleLoadMore}
//                   disabled={loadingMore}
//                   className="w-full p-4 text-sm text-primary hover:text-primary/80 hover:bg-accent/50 border-t border-border transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
//                 >
//                   {loadingMore ? (
//                     <>
//                       <Loader2 className="h-4 w-4 animate-spin" />
//                       <span>Loading...</span>
//                     </>
//                   ) : (
//                     <span>Load more notifications</span>
//                   )}
//                 </button>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </>
//   )
// }

// // Complete Notification Component
// export function NotificationCenter() {
//   const [isOpen, setIsOpen] = useState(false)

//   return (
//     <div className="relative">
//       <NotificationBell onClick={() => setIsOpen(!isOpen)} />
//       <NotificationPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
//     </div>
//   )
// }

// // In-App Toast Notification Component (using your dark theme)
// export function NotificationToast({ notification, onClose }: {
//   notification: any
//   onClose: () => void
// }) {
//   const [isVisible, setIsVisible] = useState(true)

//   const handleClose = () => {
//     setIsVisible(false)
//     setTimeout(onClose, 300) // Wait for animation to complete
//   }

//   if (!isVisible) return null

//   return (
//     <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
//       isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
//     }`}>
//       <div className="bg-card/95 backdrop-blur-md rounded-lg shadow-lg border border-border p-4 max-w-sm glassEffect">
//         <div className="flex items-start space-x-3">
//           <div className="flex-shrink-0 bg-primary/10 rounded-full p-2">
//             <Bell className="h-4 w-4 text-primary" />
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="font-medium text-foreground text-sm">{notification.title}</p>
//             <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{notification.message}</p>
//             {notification.actionUrl && (
//               <button
//                 onClick={() => window.location.href = notification.actionUrl}
//                 className="text-sm text-primary hover:text-primary/80 mt-2 flex items-center space-x-1 hover:bg-primary/10 px-2 py-1 rounded-md transition-all duration-200"
//               >
//                 <span>View Details</span>
//                 <ExternalLink className="h-3 w-3" />
//               </button>
//             )}
//           </div>
//           <button
//             onClick={handleClose}
//             className="flex-shrink-0 p-1 text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-all duration-200"
//           >
//             <X className="h-3 w-3" />
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }


// Updated components/global/navbar/notifications/notifications.tsx
import React, { useState } from 'react'
import {X, Check, CheckCheck, Trash2, ExternalLink, Loader2, Bell } from 'lucide-react'
import { useNotificationContext } from '@/contexts/notification-context'
import { useNotificationPanel } from '@/contexts/notification-panel-context'
import { Button } from "@/components/ui/button"

// Notification Badge Component (unchanged)
export function NotificationBadge() {
  const { unreadCount } = useNotificationContext()
  
  if (unreadCount === 0) return null
  
  return (
    <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium min-w-[1.25rem] animate-in zoom-in-50 duration-200">
      {unreadCount > 99 ? '99+' : unreadCount}
    </span>
  )
}

// Updated Notification Bell with sliding panel toggle
export function NotificationBell({ onClick }: { onClick?: () => void }) {
  const { unreadCount } = useNotificationContext()
  const { togglePanel } = useNotificationPanel()
  
  const handleClick = () => {
    if (onClick) {
      onClick() // For dropdown functionality
    } else {
      togglePanel() // For sliding panel functionality
    }
  }
  
  return (
    <button
      onClick={handleClick}
      className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200 group"
      aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
    >
      <Bell className="h-4 w-4" />
      <NotificationBadge />
    </button>
  )
}

// Individual Notification Item (unchanged from your original)
function NotificationItem({ notification, onMarkAsRead, onDelete, onNavigate }: {
  notification: any
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
  onNavigate: (url: string) => void
}) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isMarking, setIsMarking] = useState(false)

  const getNotificationIcon = (type: string) => {
    const baseClasses = "h-8 w-8 flex items-center justify-center rounded-full text-sm flex-shrink-0"
    
    switch (type) {
      case 'LEAD_GENERATED':
        return <div className={`${baseClasses} bg-green-500/10 text-green-400 border border-green-500/20`}>👤</div>
      case 'LEAD_QUALIFIED':
        return <div className={`${baseClasses} bg-blue-500/10 text-blue-400 border border-blue-500/20`}>⭐</div>
      case 'AUTOMATION_COMPLETED':
        return <div className={`${baseClasses} bg-purple-500/10 text-purple-400 border border-purple-500/20`}>🤖</div>
      case 'AUTOMATION_ERROR':
        return <div className={`${baseClasses} bg-destructive/10 text-destructive border border-destructive/20`}>⚠️</div>
      case 'CRM_SYNC_SUCCESS':
        return <div className={`${baseClasses} bg-emerald-500/10 text-emerald-400 border border-emerald-500/20`}>🔄</div>
      case 'CRM_SYNC_ERROR':
        return <div className={`${baseClasses} bg-orange-500/10 text-orange-400 border border-orange-500/20`}>❌</div>
      case 'CAMPAIGN_STARTED':
        return <div className={`${baseClasses} bg-cyan-500/10 text-cyan-400 border border-cyan-500/20`}>📢</div>
      case 'CAMPAIGN_COMPLETED':
        return <div className={`${baseClasses} bg-teal-500/10 text-teal-400 border border-teal-500/20`}>✅</div>
      case 'SYSTEM_ALERT':
        return <div className={`${baseClasses} bg-yellow-500/10 text-yellow-400 border border-yellow-500/20`}>🔔</div>
      default:
        return <div className={`${baseClasses} bg-muted text-muted-foreground border border-border`}>🔔</div>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    await onDelete(notification.id)
    setIsDeleting(false)
  }

  const handleMarkAsRead = async () => {
    setIsMarking(true)
    await onMarkAsRead(notification.id)
    setIsMarking(false)
  }

  return (
    <div className={`group flex items-start space-x-3 p-4 hover:bg-accent/50 border-b border-border transition-all duration-200 ${
      !notification.isRead ? 'bg-accent/20 border-l-4 border-l-primary' : ''
    }`}>
      {getNotificationIcon(notification.type)}
      
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm font-medium text-foreground leading-tight ${
            !notification.isRead ? 'font-semibold' : ''
          }`}>
            {notification.title}
          </p>
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {!notification.isRead && (
              <button
                onClick={handleMarkAsRead}
                disabled={isMarking}
                className="p-1.5 text-primary hover:text-primary/80 rounded-md hover:bg-primary/10 transition-all duration-200 disabled:opacity-50"
                title="Mark as read"
              >
                {isMarking ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
              </button>
            )}
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-1.5 text-destructive hover:text-destructive/80 rounded-md hover:bg-destructive/10 transition-all duration-200 disabled:opacity-50"
              title="Delete notification"
            >
              {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
            </button>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground leading-relaxed">
          {notification.message}
        </p>
        
        {notification.business && (
          <p className="text-xs text-muted-foreground/80 bg-muted/30 px-2 py-1 rounded-md inline-block">
            {notification.business.businessName || notification.business.name}
          </p>
        )}
        
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">
            {formatDate(notification.createdAt)}
          </span>
          
          {notification.actionUrl && (
            <button
              onClick={() => onNavigate(notification.actionUrl)}
              className="text-xs text-primary hover:text-primary/80 flex items-center space-x-1 hover:bg-primary/10 px-2 py-1 rounded-md transition-all duration-200"
            >
              <span>View Details</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Notification Dropdown Panel (kept for optional quick view)
export function NotificationPanel({ isOpen, onClose }: { 
  isOpen: boolean
  onClose: () => void 
}) {
  const {
    notifications,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loadMoreNotifications
  } = useNotificationContext()
  
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const handleLoadMore = async () => {
    setLoadingMore(true)
    const nextPage = page + 1
    const moreAvailable = await loadMoreNotifications(nextPage)
    setPage(nextPage)
    setHasMore(moreAvailable)
    setLoadingMore(false)
  }

  const handleNavigate = (url: string) => {
    window.location.href = url
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Mobile backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
        onClick={onClose}
      />
      
      {/* Notification panel */}
      <div className="absolute right-0 mt-2 w-full max-w-sm md:w-96 bg-card/95 backdrop-blur-md rounded-lg shadow-lg border border-border z-50 max-h-[85vh] md:max-h-96 overflow-hidden animate-in slide-in-from-top-2 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-sm">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
            {notifications.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {notifications.filter(n => !n.isRead).length} unread of {notifications.length}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {notifications.some(n => !n.isRead) && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-primary hover:text-primary/80 flex items-center space-x-1 hover:bg-primary/10 px-2 py-1 rounded-md transition-all duration-200"
              >
                <CheckCheck className="h-3 w-3" />
                <span className="hidden sm:inline">Mark all read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-all duration-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-80 overflow-y-auto no-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="flex flex-col items-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading notifications...</p>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
              <div className="bg-muted/30 rounded-full p-4 mb-4">
                <Bell className="h-8 w-8" />
              </div>
              <p className="text-center font-medium mb-1">No notifications yet</p>
              <p className="text-sm text-center text-muted-foreground/70">
                You&apos;ll see notifications here when something important happens.
              </p>
            </div>
          ) : (
            <>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                  onNavigate={handleNavigate}
                />
              ))}
              
              {hasMore && (
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="w-full p-4 text-sm text-primary hover:text-primary/80 hover:bg-accent/50 border-t border-border transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <span>Load more notifications</span>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

// Updated Complete Notification Component with both dropdown and sliding panel options
export function NotificationCenter() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // You have two options:
  // 1. Use sliding panel by default (recommended for better UX)
  // 2. Keep dropdown for quick view and add sliding panel as secondary option

  return (
    <div className="relative">
      {/* Option 1: Use sliding panel by default */}
      <NotificationBell />
      
      {/* Option 2: Use dropdown (uncomment if you want to keep dropdown instead) */}
      {/* <NotificationBell onClick={() => setIsDropdownOpen(!isDropdownOpen)} />
      <NotificationPanel isOpen={isDropdownOpen} onClose={() => setIsDropdownOpen(false)} /> */}
    </div>
  )
}

// In-App Toast Notification Component (unchanged)
export function NotificationToast({ notification, onClose }: {
  notification: any
  onClose: () => void
}) {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) // Wait for animation to complete
  }

  if (!isVisible) return null

  return (
    <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="bg-card/95 backdrop-blur-md rounded-lg shadow-lg border border-border p-4 max-w-sm glassEffect">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 bg-primary/10 rounded-full p-2">
            <Bell className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground text-sm">{notification.title}</p>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{notification.message}</p>
            {notification.actionUrl && (
              <button
                onClick={() => window.location.href = notification.actionUrl}
                className="text-sm text-primary hover:text-primary/80 mt-2 flex items-center space-x-1 hover:bg-primary/10 px-2 py-1 rounded-md transition-all duration-200"
              >
                <span>View Details</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            )}
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-all duration-200"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  )
}