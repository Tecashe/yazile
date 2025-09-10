import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/prisma';
import crypto from 'crypto';

// Webhook verification (GET)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  // Check if mode and token are valid
  if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    console.log('Webhook verified successfully');
    return new Response(challenge, { status: 200 });
  }

  return new Response('Forbidden', { status: 403 });
}

// Webhook payload handler (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log the webhook payload for debugging
    console.log('WhatsApp Webhook received:', JSON.stringify(body, null, 2));

    // Verify webhook signature (recommended for production)
    const signature = request.headers.get('x-hub-signature-256');
    if (signature && process.env.WHATSAPP_APP_SECRET) {
      const expectedSignature = 'sha256=' + crypto
        .createHmac('sha256', process.env.WHATSAPP_APP_SECRET)
        .update(JSON.stringify(body))
        .digest('hex');

      if (signature !== expectedSignature) {
        console.error('Invalid webhook signature');
        return new Response('Unauthorized', { status: 401 });
      }
    }

    // Log webhook payload to database
    await client.whatsAppWebhookLog.create({
      data: {
        eventType: body.object || 'unknown',
        payload: body,
        processed: false
      }
    });

    // Process webhook entries
    if (body.object === 'whatsapp_business_account' && body.entry) {
      for (const entry of body.entry) {
        await processWebhookEntry(entry);
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function processWebhookEntry(entry: any) {
  try {
    const wabaId = entry.id;
    
    // Find the WhatsApp account
    const whatsAppAccount = await client.whatsAppAccount.findUnique({
      where: { wabaId }
    });

    if (!whatsAppAccount) {
      console.error(`WhatsApp account not found for WABA ID: ${wabaId}`);
      return;
    }

    // Process changes
    if (entry.changes) {
      for (const change of entry.changes) {
        await processWebhookChange(change, whatsAppAccount);
      }
    }

  } catch (error) {
    console.error('Error processing webhook entry:', error);
  }
}

async function processWebhookChange(change: any, account: any) {
  try {
    const field = change.field;
    const value = change.value;

    switch (field) {
      case 'messages':
        await processMessages(value, account);
        break;
      
      case 'message_deliveries':
        await processMessageStatus(value, account, 'delivered');
        break;
      
      case 'message_reads':
        await processMessageStatus(value, account, 'read');
        break;
      
      case 'message_reactions':
        await processMessageReactions(value, account);
        break;

      case 'account_alerts':
        console.log('Account alert received:', value);
        break;

      default:
        console.log(`Unhandled webhook field: ${field}`, value);
    }

  } catch (error) {
    console.error('Error processing webhook change:', error);
  }
}

async function processMessages(value: any, account: any) {
  try {
    if (!value.messages) return;

    for (const message of value.messages) {
      // Store incoming message
      const messageRecord = await client.whatsAppMessage.create({
        data: {
          whatsAppAccountId: account.id,
          messageId: message.id,
          waId: message.from,
          phoneNumber: value.contacts?.[0]?.wa_id || message.from,
          contactName: value.contacts?.[0]?.profile?.name || null,
          messageType: message.type,
          content: getMessageContent(message),
          direction: 'inbound',
          status: 'received',
          timestamp: new Date(parseInt(message.timestamp) * 1000)
        }
      });

      // Process automation rules
      await processAutomationRules(message, account, messageRecord);
    }

  } catch (error) {
    console.error('Error processing messages:', error);
  }
}

async function processMessageStatus(value: any, account: any, status: string) {
  try {
    if (!value.statuses) return;

    for (const statusUpdate of value.statuses) {
      await client.whatsAppMessage.updateMany({
        where: {
          whatsAppAccountId: account.id,
          messageId: statusUpdate.id
        },
        data: {
          status: status,
          updatedAt: new Date()
        }
      });
    }

  } catch (error) {
    console.error('Error processing message status:', error);
  }
}

async function processMessageReactions(value: any, account: any) {
  try {
    // Handle message reactions - implement based on your needs
    console.log('Message reactions received:', value);
  } catch (error) {
    console.error('Error processing message reactions:', error);
  }
}

async function processAutomationRules(message: any, account: any, messageRecord: any) {
  try {
    // Get active automation rules for this account
    const automationRules = await client.whatsAppAutomationRule.findMany({
      where: {
        whatsAppAccountId: account.id,
        isActive: true
      }
    });

    for (const rule of automationRules) {
      let shouldTrigger = false;
      const messageContent = getMessageContent(message).toLowerCase();

      switch (rule.trigger) {
        case 'keyword':
          shouldTrigger = messageContent.includes(rule.triggerValue?.toLowerCase() || '');
          break;
        
        case 'welcome':
          // Trigger for first-time contacts
          const existingMessages = await client.whatsAppMessage.count({
            where: {
              whatsAppAccountId: account.id,
              waId: message.from,
              direction: 'inbound'
            }
          });
          shouldTrigger = existingMessages <= 1;
          break;

        case 'business_hours':
          // Check if current time is within business hours
          const now = new Date();
          const hour = now.getHours();
          shouldTrigger = hour >= 9 && hour <= 17; // 9 AM to 5 PM
          break;
      }

      if (shouldTrigger) {
        await executeAutomationRule(rule, message, account, messageRecord);
      }
    }

  } catch (error) {
    console.error('Error processing automation rules:', error);
  }
}

async function executeAutomationRule(rule: any, message: any, account: any, messageRecord: any) {
  try {
    // Add delay if specified
    if (rule.delayMinutes > 0) {
      setTimeout(async () => {
        await sendAutomatedResponse(rule, message, account, messageRecord);
      }, rule.delayMinutes * 60 * 1000);
    } else {
      await sendAutomatedResponse(rule, message, account, messageRecord);
    }

  } catch (error) {
    console.error('Error executing automation rule:', error);
  }
}

async function sendAutomatedResponse(rule: any, message: any, account: any, messageRecord: any) {
  try {
    const accessToken = decryptToken(account.accessToken);
    
    let payload: any = {
      messaging_product: 'whatsapp',
      to: message.from,
      type: rule.responseType
    };

    if (rule.responseType === 'text') {
      payload.text = { body: rule.responseContent };
    } else if (rule.responseType === 'template' && rule.responseTemplateId) {
      // Handle template messages
      payload.template = {
        name: rule.responseTemplateId,
        language: { code: 'en' }
      };
    }

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${account.businessPhoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    );

    if (response.ok) {
      const result = await response.json();
      
      // Log the sent message
      await client.whatsAppMessage.create({
        data: {
          whatsAppAccountId: account.id,
          messageId: result.messages[0].id,
          waId: message.from,
          phoneNumber: message.from,
          messageType: rule.responseType,
          content: rule.responseContent,
          direction: 'outbound',
          status: 'sent',
          automationRuleId: rule.id
        }
      });
    } else {
      console.error('Failed to send automated response:', await response.text());
    }

  } catch (error) {
    console.error('Error sending automated response:', error);
  }
}

function getMessageContent(message: any): string {
  switch (message.type) {
    case 'text':
      return message.text?.body || '';
    case 'image':
      return message.image?.caption || '[Image]';
    case 'document':
      return message.document?.caption || '[Document]';
    case 'audio':
      return '[Audio]';
    case 'video':
      return message.video?.caption || '[Video]';
    case 'location':
      return '[Location]';
    case 'contacts':
      return '[Contact]';
    default:
      return '[Unsupported message type]';
  }
}

// Helper function to decrypt tokens (implement this)
function decryptToken(encryptedToken: string): string {
  // Implement your decryption logic here
  // This is a placeholder - use proper encryption/decryption
  return encryptedToken;
}