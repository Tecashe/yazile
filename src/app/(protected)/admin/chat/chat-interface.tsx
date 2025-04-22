
"use client"

import { AdminChat } from "../components/admin-chat"

interface ChatInterfaceProps {
  adminId: string
}

export function ChatInterface({ adminId }: ChatInterfaceProps) {
  return <AdminChat userId={adminId} />
}

