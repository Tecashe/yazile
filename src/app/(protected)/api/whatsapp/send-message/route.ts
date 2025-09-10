import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/prisma';
import { onUserInfor } from '@/actions/user'; 
import { WhatsAppService, sendBulkMessages, sendBulkTemplateMessages } from '@/lib/whatstapp';

export async function POST(request: NextRequest) {
  try {
    const session = await onUserInfor()
    const sessionId = session.data?.id
    
    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const {
      accountId,
      type,
      recipients,
      message,
      templateName,
      templateComponents,
      mediaUrl,
      mediaType,
      caption
    } = await request.json();

    // Validate account ownership
    const account = await client.whatsAppAccount.findFirst({
      where: {
        id: accountId,
        userId: sessionId,
        isActive: true
      }
    });

    if (!account) {
      return NextResponse.json(
        { success: false, error: 'WhatsApp account not found' },
        { status: 404 }
      );
    }

    const whatsApp = await WhatsAppService.fromAccount(accountId);
    if (!whatsApp) {
      return NextResponse.json(
        { success: false, error: 'Failed to initialize WhatsApp service' },
        { status: 500 }
      );
    }

    let result;

    switch (type) {
      case 'text':
        if (Array.isArray(recipients)) {
          // Bulk text messages
          const bulkData = recipients.map(phone => ({ phoneNumber: phone, message }));
          result = await sendBulkMessages(accountId, bulkData);
        } else {
          // Single text message
          result = await whatsApp.sendTextMessage(recipients, message);
        }
        break;

      case 'template':
        if (Array.isArray(recipients)) {
          // Bulk template messages
          result = await sendBulkTemplateMessages(accountId, recipients, templateName, templateComponents);
        } else {
          // Single template message
          result = await whatsApp.sendTemplateMessage(recipients, templateName, templateComponents);
        }
        break;

      case 'media':
        if (Array.isArray(recipients)) {
          return NextResponse.json(
            { success: false, error: 'Bulk media messages not supported yet' },
            { status: 400 }
          );
        } else {
          // Single media message
          result = await whatsApp.sendMediaMessage(recipients, mediaType, mediaUrl, caption);
        }
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid message type' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}