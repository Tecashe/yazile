
// app/api/notifications/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { NotificationService } from '@/lib/notifications/notification-service'
import { onUserInfor } from '@/actions/user'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user  =  await onUserInfor()
    const userId = user.data?.id
    
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action } = body

    if (action === 'mark-read') {
      const notification = await NotificationService.markAsRead(params.id, userId)
      return NextResponse.json(notification)
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json(
      { error: 'Failed to update notification' }, 
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user  =  await onUserInfor()
    const userId = user.data?.id
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await NotificationService.deleteNotification(params.id, userId)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting notification:', error)
    return NextResponse.json(
      { error: 'Failed to delete notification' }, 
      { status: 500 }
    )
  }
}