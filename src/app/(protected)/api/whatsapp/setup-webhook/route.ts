import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { accessToken, wabaId } = await request.json();

    if (!accessToken || !wabaId) {
      return NextResponse.json(
        { success: false, error: 'Access token and WABA ID are required' },
        { status: 400 }
      );
    }

    // Generate a random webhook verify token
    const webhookVerifyToken = crypto.randomBytes(32).toString('hex');
    
    // Your webhook URL - update this to your actual domain
    const webhookUrl = `${process.env.NEXTAUTH_URL || 'https://your-domain.com'}/api/whatsapp/webhook`;

    // Configure webhook for the WhatsApp Business Account
    const webhookResponse = await fetch(
      `https://graph.facebook.com/v18.0/${wabaId}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          object: 'whatsapp_business_account',
          callback_url: webhookUrl,
          verify_token: webhookVerifyToken,
          fields: [
            'messages',
            'message_deliveries',
            'message_reads',
            'message_reactions',
            'message_template_status_update',
            'account_alerts',
            'account_update',
            'business_capability_update',
            'phone_number_name_update',
            'phone_number_quality_update',
            'template_category_update',
            'template_language_update'
          ],
          access_token: accessToken
        })
      }
    );

    if (!webhookResponse.ok) {
      const error = await webhookResponse.text();
      console.error('Webhook setup error:', error);
      
      return NextResponse.json(
        { success: false, error: 'Failed to configure webhook' },
        { status: 400 }
      );
    }

    const result = await webhookResponse.json();

    // Store the webhook verify token in environment or database
    // For now, we'll return it so you can set it in your environment
    return NextResponse.json({
      success: true,
      webhookVerifyToken,
      subscriptionId: result.id,
      message: 'Webhook configured successfully. Please set WHATSAPP_WEBHOOK_VERIFY_TOKEN in your environment variables.'
    });

  } catch (error) {
    console.error('Error setting up webhook:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}