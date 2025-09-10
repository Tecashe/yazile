import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/prisma';
import { onUserInfor } from '@/actions/user'; 
import { decryptToken } from '@/lib/encrypt-whatsapp';

export async function POST(
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

    // Get account details
    const account = await client.whatsAppAccount.findFirst({
      where: {
        id: accountId,
        userId: sessionId,
        isActive: true
      }
    });

    if (!account) {
      return NextResponse.json(
        { success: false, error: 'Account not found' },
        { status: 404 }
      );
    }

    // Decrypt access token
    const accessToken = decryptToken(account.accessToken);

    // Test the connection by fetching phone number info
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${account.businessPhoneNumberId}?access_token=${accessToken}`
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('WhatsApp API test failed:', error);
      
      // Update account status
      await client.whatsAppAccount.update({
        where: { id: accountId },
        data: { status: 'error' }
      });

      return NextResponse.json(
        { success: false, error: 'Connection test failed. Please check your access token.' },
        { status: 400 }
      );
    }

    const data = await response.json();

    // Update account status
    await client.whatsAppAccount.update({
      where: { id: accountId },
      data: { 
        status: 'verified',
        displayName: data.verified_name || account.displayName
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        phoneNumber: data.display_phone_number,
        verifiedName: data.verified_name,
        status: data.status,
        qualityRating: data.quality_rating
      }
    });

  } catch (error) {
    console.error('Error testing WhatsApp connection:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}