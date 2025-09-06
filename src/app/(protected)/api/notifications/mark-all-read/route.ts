// app/api/notifications/mark-all-read/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { NotificationService } from '@/lib/notifications/notification-service'
import { onUserInfor } from '@/actions/user'

export async function POST(request: NextRequest) {
  try {
    const user  =  await onUserInfor()
    const userId = user.data?.id
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await NotificationService.markAllAsRead(userId)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    return NextResponse.json(
      { error: 'Failed to mark all notifications as read' }, 
      { status: 500 }
    )
  }
}