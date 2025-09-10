import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/prisma';
import { onUserInfor } from '@/actions/user'; 
import crypto from 'crypto';

// GET - Fetch user's WhatsApp accounts
export async function GET(request: NextRequest) {
  try {
    const session = await onUserInfor()
    const sessionId = session.data?.id
    
    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const accounts = await client.whatsAppAccount.findMany({
      where: {
        userId: sessionId,
        isActive: true
      },
      select: {
        id: true,
        wabaId: true,
        businessPhoneNumberId: true,
        phoneNumber: true,
        displayName: true,
        status: true,
        businessVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({ success: true, accounts });

  } catch (error) {
    console.error('Error fetching WhatsApp accounts:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new WhatsApp account
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
      appId,
      appSecret,
      wabaId,
      businessPhoneNumberId,
      phoneNumber,
      displayName,
      accessToken
    } = await request.json();

    // Validate required fields
    if (!appId || !appSecret || !wabaId || !businessPhoneNumberId || !accessToken) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if account already exists
    const existingAccount = await client.whatsAppAccount.findUnique({
      where: { wabaId }
    });

    if (existingAccount) {
      return NextResponse.json(
        { success: false, error: 'WhatsApp Business Account already connected' },
        { status: 400 }
      );
    }

    // Encrypt sensitive data
    const encryptedAppSecret = crypto.createHash('sha256').update(appSecret + process.env.ENCRYPTION_KEY).digest('hex');
    const encryptedAccessToken = crypto.createHash('sha256').update(accessToken + process.env.ENCRYPTION_KEY).digest('hex');

    // Create WhatsApp account record
    const whatsAppAccount = await client.whatsAppAccount.create({
      data: {
        userId: sessionId,
        wabaId,
        businessPhoneNumberId,
        phoneNumber,
        displayName: displayName || phoneNumber,
        accessToken: encryptedAccessToken,
        appId,
        appSecret: encryptedAppSecret,
        status: 'verified',
        businessVerified: true
      }
    });

    return NextResponse.json({
      success: true,
      account: {
        id: whatsAppAccount.id,
        wabaId: whatsAppAccount.wabaId,
        phoneNumber: whatsAppAccount.phoneNumber,
        displayName: whatsAppAccount.displayName,
        status: whatsAppAccount.status
      }
    });

  } catch (error) {
    console.error('Error creating WhatsApp account:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}