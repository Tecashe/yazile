import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/prisma';
import { onUserInfor } from '@/actions/user';


export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await onUserInfor()
    const sessionId = session.data?.id
        
    
    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const accountId = params.id;

    // Verify account belongs to user
    const account = await client.whatsAppAccount.findFirst({
      where: {
        id: accountId,
        userId: sessionId
      }
    });

    if (!account) {
      return NextResponse.json(
        { success: false, error: 'Account not found' },
        { status: 404 }
      );
    }

    // Get message statistics
    const [
      totalSent,
      totalReceived,
      deliveredMessages,
      readMessages
    ] = await Promise.all([
      client.whatsAppMessage.count({
        where: {
          whatsAppAccountId: accountId,
          direction: 'outbound'
        }
      }),
      client.whatsAppMessage.count({
        where: {
          whatsAppAccountId: accountId,
          direction: 'inbound'
        }
      }),
      client.whatsAppMessage.count({
        where: {
          whatsAppAccountId: accountId,
          direction: 'outbound',
          status: 'delivered'
        }
      }),
      client.whatsAppMessage.count({
        where: {
          whatsAppAccountId: accountId,
          direction: 'outbound',
          status: 'read'
        }
      })
    ]);

    // Calculate rates
    const deliveredRate = totalSent > 0 ? (deliveredMessages / totalSent) * 100 : 0;
    const readRate = totalSent > 0 ? (readMessages / totalSent) * 100 : 0;

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentMessages = await client.whatsAppMessage.findMany({
      where: {
        whatsAppAccountId: accountId,
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      select: {
        createdAt: true,
        direction: true,
        status: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Group messages by date for chart data
    const activityByDate = recentMessages.reduce((acc: any, message) => {
      const date = message.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { sent: 0, received: 0 };
      }
      if (message.direction === 'outbound') {
        acc[date].sent++;
      } else {
        acc[date].received++;
      }
      return acc;
    }, {});

    const chartData = Object.entries(activityByDate).map(([date, data]: [string, any]) => ({
      date,
      sent: data.sent,
      received: data.received
    }));

    const stats = {
      totalSent,
      totalReceived,
      deliveredRate: Math.round(deliveredRate * 10) / 10,
      readRate: Math.round(readRate * 10) / 10,
      chartData
    };

    return NextResponse.json({ success: true, stats });

  } catch (error) {
    console.error('Error fetching WhatsApp stats:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}