// app/api/notifications/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { NotificationService } from '@/lib/notifications/notification-service'
import { onUserInfor } from '@/actions/user'

export async function GET(request: NextRequest) {
  try {
    const user  =  await onUserInfor()
    const userId = user.data?.id
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const businessId = searchParams.get('businessId') || undefined

    const result = await NotificationService.getNotifications(
      userId, 
      page, 
      limit, 
      businessId
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user  =  await onUserInfor()
    const userId = user.data?.id
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    const notification = await NotificationService.createNotification({
      userId,
      ...body
    })

    return NextResponse.json(notification)
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { error: 'Failed to create notification' }, 
      { status: 500 }
    )
  }
}



