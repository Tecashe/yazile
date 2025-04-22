
export const dynamic = 'force-dynamic'


import { ChatInterface } from "./chat-interface"
import { getCurrentAdmin } from "../actions"
import { NotificationListener } from "../components/notification-listener"

export default async function ChatPage() {
  const admin = await getCurrentAdmin()

  return (
    <div className="container p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Chat</h1>
        <p className="text-muted-foreground">Communicate with users and team members.</p>
      </div>

      <NotificationListener userId={admin.id} />
      <ChatInterface adminId={admin.id} />
    </div>
  )
}

