
// // components/global/navbar/notifications/SlidingNotificationPanel.tsx
// 'use client'

// import React, { useState, useEffect } from 'react'
// import { X, Check, CheckCheck, Trash2, ExternalLink, Loader2, Bell } from 'lucide-react'
// import { useNotificationContext } from '@/contexts/notification-context'
// import { useNotificationPanel } from '@/contexts/notification-panel-context'
// import { Button } from "@/components/ui/button"

// // Individual Notification Item for Sliding Panel
// function SlidingNotificationItem({ notification, onMarkAsRead, onDelete, onNavigate }: {
//   notification: any
//   onMarkAsRead: (id: string) => void
//   onDelete: (id: string) => void
//   onNavigate: (url: string) => void
// }) {
//   const [isDeleting, setIsDeleting] = useState(false)
//   const [isMarking, setIsMarking] = useState(false)

//   const getNotificationIcon = (type: string) => {
//     const baseClasses = "h-10 w-10 flex items-center justify-center rounded-full text-lg flex-shrink-0"
    
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
//     <div className={`group flex items-start space-x-4 p-5 hover:bg-accent/30 border-b border-border transition-all duration-200 ${
//       !notification.isRead ? 'bg-accent/10 border-l-4 border-l-primary' : ''
//     }`}>
//       {getNotificationIcon(notification.type)}
      
//       <div className="flex-1 min-w-0 space-y-2">
//         <div className="flex items-start justify-between gap-3">
//           <h4 className={`text-base font-medium text-foreground leading-tight ${
//             !notification.isRead ? 'font-semibold' : ''
//           }`}>
//             {notification.title}
//           </h4>
//           <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//             {!notification.isRead && (
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={handleMarkAsRead}
//                 disabled={isMarking}
//                 className="h-8 w-8 p-0 text-primary hover:text-primary/80 hover:bg-primary/10"
//                 title="Mark as read"
//               >
//                 {isMarking ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
//               </Button>
//             )}
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={handleDelete}
//               disabled={isDeleting}
//               className="h-8 w-8 p-0 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
//               title="Delete notification"
//             >
//               {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
//             </Button>
//           </div>
//         </div>
        
//         <p className="text-sm text-muted-foreground leading-relaxed">
//           {notification.message}
//         </p>
        
//         {notification.business && (
//           <div className="inline-flex items-center px-2.5 py-1.5 rounded-md bg-muted/30 text-xs text-muted-foreground">
//             {notification.business.businessName || notification.business.name}
//           </div>
//         )}
        
//         <div className="flex items-center justify-between pt-2">
//           <span className="text-xs text-muted-foreground">
//             {formatDate(notification.createdAt)}
//           </span>
          
//           {notification.actionUrl && (
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => onNavigate(notification.actionUrl)}
//               className="text-xs text-primary hover:text-primary/80 hover:bg-primary/10 h-auto px-2 py-1"
//             >
//               <span>View Details</span>
//               <ExternalLink className="h-3 w-3 ml-1" />
//             </Button>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// // Enhanced Sliding Notification Panel
// export function SlidingNotificationPanel() {
//   const { isOpen, closePanel } = useNotificationPanel()
//   const {
//     notifications,
//     loading,
//     markAsRead,
//     markAllAsRead,
//     deleteNotification,
//     loadMoreNotifications,
//     unreadCount
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
//     closePanel()
//   }

//   // Close panel on Escape key
//   useEffect(() => {
//     const handleEscape = (e: KeyboardEvent) => {
//       if (e.key === 'Escape' && isOpen) {
//         closePanel()
//       }
//     }

//     document.addEventListener('keydown', handleEscape)
//     return () => document.removeEventListener('keydown', handleEscape)
//   }, [isOpen, closePanel])

//   // Prevent body scroll when panel is open
//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = 'hidden'
//     } else {
//       document.body.style.overflow = 'unset'
//     }

//     return () => {
//       document.body.style.overflow = 'unset'
//     }
//   }, [isOpen])

//   return (
//     <>
//       {/* Backdrop */}
//       {isOpen && (
//         <div 
//           className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
//           onClick={closePanel}
//         />
//       )}
      
//       {/* Sliding Panel */}
//       <div className={`
//         fixed top-0 left-0 h-full w-full max-w-md bg-background/95 backdrop-blur-md border-r border-border z-50 
//         transform transition-transform duration-300 ease-in-out shadow-2xl
//         ${isOpen ? 'translate-x-0' : '-translate-x-full'}
//       `}>
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-primary/10 rounded-lg">
//               <Bell className="w-5 h-5 text-primary" />
//             </div>
//             <div>
//               <h2 className="text-xl font-semibold text-foreground">Notifications</h2>
//               {notifications.length > 0 && (
//                 <p className="text-sm text-muted-foreground">
//                   {unreadCount} unread of {notifications.length} total
//                 </p>
//               )}
//             </div>
//           </div>
//           <Button 
//             variant="ghost" 
//             size="sm" 
//             onClick={closePanel}
//             className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
//           >
//             <X className="w-4 h-4" />
//           </Button>
//         </div>

//         {/* Actions Bar */}
//         {notifications.length > 0 && notifications.some(n => !n.isRead) && (
//           <div className="p-4 border-b border-border bg-muted/20">
//             <Button 
//               variant="outline" 
//               size="sm" 
//               onClick={markAllAsRead}
//               className="w-full text-sm"
//             >
//               <CheckCheck className="w-4 h-4 mr-2" />
//               Mark all as read ({unreadCount})
//             </Button>
//           </div>
//         )}

//         {/* Notifications Content */}
//         <div className="flex-1 overflow-y-auto h-[calc(100vh-140px)]">
//           {loading ? (
//             <div className="flex items-center justify-center p-12">
//               <div className="flex flex-col items-center space-y-4">
//                 <Loader2 className="h-8 w-8 animate-spin text-primary" />
//                 <p className="text-sm text-muted-foreground">Loading notifications...</p>
//               </div>
//             </div>
//           ) : notifications.length === 0 ? (
//             <div className="flex flex-col items-center justify-center p-12 text-center">
//               <div className="bg-muted/30 rounded-full p-6 mb-6">
//                 <Bell className="h-12 w-12 text-muted-foreground" />
//               </div>
//               <h3 className="text-lg font-medium text-foreground mb-2">No notifications yet</h3>
//               <p className="text-sm text-muted-foreground max-w-sm">
//                 You'll see notifications here when something important happens with your automations and campaigns.
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-0">
//               {notifications.map((notification) => (
//                 <SlidingNotificationItem
//                   key={notification.id}
//                   notification={notification}
//                   onMarkAsRead={markAsRead}
//                   onDelete={deleteNotification}
//                   onNavigate={handleNavigate}
//                 />
//               ))}
              
//               {hasMore && (
//                 <div className="p-4 border-t border-border">
//                   <Button
//                     variant="outline"
//                     onClick={handleLoadMore}
//                     disabled={loadingMore}
//                     className="w-full"
//                   >
//                     {loadingMore ? (
//                       <>
//                         <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                         Loading more...
//                       </>
//                     ) : (
//                       'Load more notifications'
//                     )}
//                   </Button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   )
// }

// // Enhanced Notification Bell with Panel Toggle
// export function EnhancedNotificationBell() {
//   const { unreadCount } = useNotificationContext()
//   const { togglePanel } = useNotificationPanel()
  
//   return (
//     <Button
//       variant="ghost"
//       size="sm"
//       onClick={togglePanel}
//       className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
//       aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
//     >
//       <Bell className="h-4 w-4" />
//       {unreadCount > 0 && (
//         <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium min-w-[1.25rem] animate-in zoom-in-50 duration-200">
//           {unreadCount > 99 ? '99+' : unreadCount}
//         </span>
//       )}
//     </Button>
//   )
// }

// // Updated Notification Center Component
// export function NotificationCenter() {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false)
//   const { togglePanel } = useNotificationPanel()
  
//   // You can choose between dropdown or sliding panel
//   // For sliding panel, use EnhancedNotificationBell
//   // For dropdown, use the existing NotificationBell with dropdown logic
  
//   return (
//     <div className="flex items-center space-x-2">
//       {/* Sliding Panel Button */}
//       <EnhancedNotificationBell />
      
//       {/* Optional: Keep dropdown for quick view */}
//       {/* <div className="relative">
//         <NotificationBell onClick={() => setIsDropdownOpen(!isDropdownOpen)} />
//         <NotificationPanel isOpen={isDropdownOpen} onClose={() => setIsDropdownOpen(false)} />
//       </div> */}
//     </div>
//   )
// }



// File: components/global/navbar/notifications/SlidingNotificationPanel.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { X, Check, CheckCheck, Trash2, ExternalLink, Loader2, Bell } from 'lucide-react'
import { useNotificationContext } from '@/contexts/notification-context'
import { useNotificationPanel } from '@/contexts/notification-panel-context'
import { Button } from "@/components/ui/button"

// Individual Notification Item for Sliding Panel
function SlidingNotificationItem({ notification, onMarkAsRead, onDelete, onNavigate }: {
  notification: any
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
  onNavigate: (url: string) => void
}) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isMarking, setIsMarking] = useState(false)

  const getNotificationIcon = (type: string) => {
    const baseClasses = "h-10 w-10 flex items-center justify-center rounded-full text-lg flex-shrink-0"
    
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
    <div className={`group flex items-start space-x-4 p-5 hover:bg-accent/30 border-b border-border transition-all duration-200 ${
      !notification.isRead ? 'bg-accent/10 border-l-4 border-l-primary' : ''
    }`}>
      {getNotificationIcon(notification.type)}
      
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h4 className={`text-base font-medium text-foreground leading-tight ${
            !notification.isRead ? 'font-semibold' : ''
          }`}>
            {notification.title}
          </h4>
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {!notification.isRead && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAsRead}
                disabled={isMarking}
                className="h-8 w-8 p-0 text-primary hover:text-primary/80 hover:bg-primary/10"
                title="Mark as read"
              >
                {isMarking ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
              title="Delete notification"
            >
              {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
            </Button>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground leading-relaxed">
          {notification.message}
        </p>
        
        {notification.business && (
          <div className="inline-flex items-center px-2.5 py-1.5 rounded-md bg-muted/30 text-xs text-muted-foreground">
            {notification.business.businessName || notification.business.name}
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">
            {formatDate(notification.createdAt)}
          </span>
          
          {notification.actionUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate(notification.actionUrl)}
              className="text-xs text-primary hover:text-primary/80 hover:bg-primary/10 h-auto px-2 py-1"
            >
              <span>View Details</span>
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// Main Sliding Notification Panel Component
export function SlidingNotificationPanel() {
  const { isOpen, closePanel } = useNotificationPanel()
  const {
    notifications,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loadMoreNotifications,
    unreadCount
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
    closePanel()
  }

  // Close panel on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closePanel()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closePanel])

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={closePanel}
        />
      )}
      
      {/* Sliding Panel */}
      <div className={`
        fixed top-0 right-0 h-full w-full max-w-md bg-background/95 backdrop-blur-md border-r border-border z-50 
        transform transition-transform duration-300 ease-in-out shadow-2xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Notifications</h2>
              {notifications.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {unreadCount} unread of {notifications.length} total
                </p>
              )}
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={closePanel}
            className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Actions Bar */}
        {notifications.length > 0 && notifications.some(n => !n.isRead) && (
          <div className="p-4 border-b border-border bg-muted/20">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={markAllAsRead}
              className="w-full text-sm"
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark all as read ({unreadCount})
            </Button>
          </div>
        )}

        {/* Notifications Content */}
        <div className="flex-1 overflow-y-auto h-[calc(100vh-140px)]">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading notifications...</p>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="bg-muted/30 rounded-full p-6 mb-6">
                <Bell className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No notifications yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                You&apos;ll see notifications here when something important happens with your automations and campaigns.
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {notifications.map((notification) => (
                <SlidingNotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                  onNavigate={handleNavigate}
                />
              ))}
              
              {hasMore && (
                <div className="p-4 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="w-full"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Loading more...
                      </>
                    ) : (
                      'Load more notifications'
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}