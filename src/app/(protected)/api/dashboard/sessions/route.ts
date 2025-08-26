

// // /api/dashboard/sessions/route.ts - Get Voiceflow sessions and analytics
// import { NextRequest, NextResponse } from 'next/server'
// import { onCurrentUser } from '@/actions/user'
// import { getTenantByUserId } from '@/lib/tenant-service'
// import { client } from '@/lib/prisma'

// export async function GET(request: NextRequest) {
//   try {
//     const user = await onCurrentUser()
//     const tenant = await getTenantByUserId(user.id)
    
//     if (!tenant) {
//       return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
//     }

//     const { searchParams } = new URL(request.url)
//     const page = parseInt(searchParams.get('page') || '1')
//     const limit = parseInt(searchParams.get('limit') || '50')
//     const status = searchParams.get('status')
//     const platform = searchParams.get('platform')
//     const startDate = searchParams.get('startDate') || undefined
//     const endDate = searchParams.get('endDate') || undefined

//     const where: any = { tenantId: tenant.id }
    
//     if (status) where.status = status
//     if (platform) where.platform = platform
//     if (startDate || endDate) {
//       where.startedAt = {}
//       if (startDate) where.startedAt.gte = new Date(startDate)
//       if (endDate) where.startedAt.lte = new Date(endDate)
//     }

//     const [sessions, total] = await Promise.all([
//       client.voiceflowSession.findMany({
//         where,
//         orderBy: { startedAt: 'desc' },
//         skip: (page - 1) * limit,
//         take: limit,
//         select: {
//           id: true,
//           sessionId: true,
//           userId: true,
//           platform: true,
//           status: true,
//           startedAt: true,
//           lastActiveAt: true,
//           endedAt: true,
//           lastStep: true
//         }
//       }),
//       client.voiceflowSession.count({ where })
//     ])

//     // Get analytics
//     const analytics = await getSessionAnalytics(tenant.id, startDate, endDate)

//     return NextResponse.json({
//       success: true,
//       sessions,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit)
//       },
//       analytics
//     })
//   } catch (error) {
//     console.error('Get sessions error:', error)
//     return NextResponse.json({ error: 'Failed to get sessions' }, { status: 500 })
//   }
// }

// async function getSessionAnalytics(tenantId: string, startDate?: string, endDate?: string) {
//   const where: any = { tenantId }
  
//   if (startDate || endDate) {
//     where.startedAt = {}
//     if (startDate) where.startedAt.gte = new Date(startDate)
//     if (endDate) where.startedAt.lte = new Date(endDate)
//   }

//   const [
//     totalSessions,
//     activeSessions,
//     completedSessions,
//     averageSessionDuration,
//     sessionsByPlatform
//   ] = await Promise.all([
//     client.voiceflowSession.count({ where }),
//     client.voiceflowSession.count({ where: { ...where, status: 'ACTIVE' } }),
//     client.voiceflowSession.count({ where: { ...where, status: 'COMPLETED' } }),
//     client.voiceflowSession.aggregate({
//       where: { ...where, status: 'COMPLETED' },
//       _avg: {
//         // This is a simplified calculation - you might want to add a duration field
//         id: true
//       }
//     }),
//     client.voiceflowSession.groupBy({
//       by: ['platform'],
//       where,
//       _count: true
//     })
//   ])

//   return {
//     totalSessions,
//     activeSessions,
//     completedSessions,
//     completionRate: totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0,
//     sessionsByPlatform: sessionsByPlatform.map(item => ({
//       platform: item.platform,
//       count: item._count
//     }))
//   }
// }

// /api/dashboard/sessions/route.ts - Get Voiceflow sessions and analytics
import { NextRequest, NextResponse } from 'next/server'
import {  onUserInfor } from '@/actions/user'
import { getTenantByUserId } from '@/lib/tenant-service'
import { client } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const user = await onUserInfor()
    const tenant = await getTenantByUserId(user.data?.id||"")
    
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status')
    const platform = searchParams.get('platform')
    const startDate = searchParams.get('startDate') || undefined
    const endDate = searchParams.get('endDate') || undefined

    const where: any = { tenantId: tenant.id }
    
    if (status) where.status = status
    if (platform) where.platform = platform
    if (startDate || endDate) {
      where.startedAt = {}
      if (startDate) where.startedAt.gte = new Date(startDate)
      if (endDate) where.startedAt.lte = new Date(endDate)
    }

    const [sessions, total] = await Promise.all([
      client.voiceflowSession.findMany({
        where,
        orderBy: { startedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          sessionId: true,
          userId: true,
          platform: true,
          status: true,
          startedAt: true,
          lastActiveAt: true,
          endedAt: true,
          lastStep: true
        }
      }),
      client.voiceflowSession.count({ where })
    ])

    // Get analytics
    const analytics = await getSessionAnalytics(tenant.id, startDate, endDate)

    return NextResponse.json({
      success: true,
      sessions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      analytics
    })
  } catch (error) {
    console.error('Get sessions error:', error)
    return NextResponse.json({ error: 'Failed to get sessions' }, { status: 500 })
  }
}

async function getSessionAnalytics(tenantId: string, startDate?: string, endDate?: string) {
  const where: any = { tenantId }
  
  if (startDate || endDate) {
    where.startedAt = {}
    if (startDate) where.startedAt.gte = new Date(startDate)
    if (endDate) where.startedAt.lte = new Date(endDate)
  }

  const [
    totalSessions,
    activeSessions,
    completedSessions,
    sessionsByPlatform
  ] = await Promise.all([
    client.voiceflowSession.count({ where }),
    client.voiceflowSession.count({ where: { ...where, status: 'ACTIVE' } }),
    client.voiceflowSession.count({ where: { ...where, status: 'COMPLETED' } }),
    client.voiceflowSession.groupBy({
      by: ['platform'],
      where,
      _count: true
    })
  ])

  // Calculate average session duration for completed sessions
  const completedSessionsWithDuration = await client.voiceflowSession.findMany({
    where: { 
      ...where, 
      status: 'COMPLETED',
      startedAt: { not: null },
      endedAt: { not: null }
    },
    select: {
      startedAt: true,
      endedAt: true
    }
  })

  let averageSessionDuration = 0
  if (completedSessionsWithDuration.length > 0) {
    const totalDuration = completedSessionsWithDuration.reduce((sum, session) => {
      if (session.startedAt && session.endedAt) {
        return sum + (session.endedAt.getTime() - session.startedAt.getTime())
      }
      return sum
    }, 0)
    
    // Convert to minutes and round to 2 decimal places
    averageSessionDuration = Math.round((totalDuration / completedSessionsWithDuration.length / (1000 * 60)) * 100) / 100
  }

  return {
    totalSessions,
    activeSessions,
    completedSessions,
    completionRate: totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100 * 100) / 100 : 0,
    averageSessionDuration, // in minutes
    sessionsByPlatform: sessionsByPlatform.map(item => ({
      platform: item.platform,
      count: item._count
    }))
  }
}