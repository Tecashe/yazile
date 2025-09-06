// context/notification-context.tsx
'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useNotifications } from '@/hooks/use-notifications'

const NotificationContext = createContext<ReturnType<typeof useNotifications> | null>(null)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const notifications = useNotifications()

  return (
    <NotificationContext.Provider value={notifications}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotificationContext() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider')
  }
  return context
}