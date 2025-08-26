

// /api/dashboard/logs/route.ts - Get API and webhook logs
import { NextRequest, NextResponse } from 'next/server'
import { onCurrentUser } from '@/actions/user'
import { getTenantByUserId } from '@/lib/tenant-service'
import { client } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const user = await onCurrentUser()
    const tenant = await getTenantByUserId(user.id)
    
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'api' or 'webhook'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '100')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (type === 'webhook') {
      const where: any = { tenantId: tenant.id }
      
      if (startDate || endDate) {
        where.timestamp = {}
        if (startDate) where.timestamp.gte = new Date(startDate)
        if (endDate) where.timestamp.lte = new Date(endDate)
      }

      const [logs, total] = await Promise.all([
        client.webhookLog.findMany({
          where,
          orderBy: { timestamp: 'desc' },
          skip: (page - 1) * limit,
          take: limit
        }),
        client.webhookLog.count({ where })
      ])

      return NextResponse.json({
        success: true,
        logs,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) }
      })
    } else {
      // API logs
      const where: any = { tenantId: tenant.id }
      
      if (startDate || endDate) {
        where.timestamp = {}
        if (startDate) where.timestamp.gte = new Date(startDate)
        if (endDate) where.timestamp.lte = new Date(endDate)
      }

      const [logs, total] = await Promise.all([
        client.apiLog.findMany({
          where,
          orderBy: { timestamp: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            integration: {
              select: { name: true, type: true }
            }
          }
        }),
        client.apiLog.count({ where })
      ])

      return NextResponse.json({
        success: true,
        logs,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) }
      })
    }
  } catch (error) {
    console.error('Get logs error:', error)
    return NextResponse.json({ error: 'Failed to get logs' }, { status: 500 })
  }
}