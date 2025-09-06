
// app/api/notifications/unread-count/route.ts
import { NextRequest, NextResponse } from 'next/server'
import auth  from '@clerk/nextjs'
import { NotificationService } from '@/lib/notifications/notification-service'
import { onUserInfor } from '@/actions/user'

export async function GET(request: NextRequest) {
  try {
    const user  =  await onUserInfor()
    const userId = user.data?.id
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const count = await NotificationService.getUnreadCount(userId)
    
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error getting unread count:', error)
    return NextResponse.json(
      { error: 'Failed to get unread count' }, 
      { status: 500 }
    )
  }
}