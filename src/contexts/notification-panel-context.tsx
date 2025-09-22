// // contexts/notification-panel-context.tsx
// 'use client'

// import { createContext, useContext, useState, ReactNode } from 'react'

// interface NotificationPanelContextType {
//   isOpen: boolean
//   openPanel: () => void
//   closePanel: () => void
//   togglePanel: () => void
// }

// const NotificationPanelContext = createContext<NotificationPanelContextType | undefined>(undefined)

// export function NotificationPanelProvider({ children }: { children: ReactNode }) {
//   const [isOpen, setIsOpen] = useState(false)

//   const openPanel = () => setIsOpen(true)
//   const closePanel = () => setIsOpen(false)
//   const togglePanel = () => setIsOpen(!isOpen)

//   return (
//     <NotificationPanelContext.Provider value={{
//       isOpen,
//       openPanel,
//       closePanel,
//       togglePanel
//     }}>
//       {children}
//     </NotificationPanelContext.Provider>
//   )
// }

// export function useNotificationPanel() {
//   const context = useContext(NotificationPanelContext)
//   if (context === undefined) {
//     throw new Error('useNotificationPanel must be used within a NotificationPanelProvider')
//   }
//   return context
// }


// File: contexts/notification-panel-context.tsx
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface NotificationPanelContextType {
  isOpen: boolean
  openPanel: () => void
  closePanel: () => void
  togglePanel: () => void
}

const NotificationPanelContext = createContext<NotificationPanelContextType | undefined>(undefined)

export function NotificationPanelProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openPanel = () => setIsOpen(true)
  const closePanel = () => setIsOpen(false)
  const togglePanel = () => setIsOpen(!isOpen)

  return (
    <NotificationPanelContext.Provider value={{
      isOpen,
      openPanel,
      closePanel,
      togglePanel
    }}>
      {children}
    </NotificationPanelContext.Provider>
  )
}

export function useNotificationPanel() {
  const context = useContext(NotificationPanelContext)
  if (context === undefined) {
    throw new Error('useNotificationPanel must be used within a NotificationPanelProvider')
  }
  return context
}

