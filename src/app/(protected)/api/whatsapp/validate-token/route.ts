import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { accessToken, appId } = await request.json();

    if (!accessToken || !appId) {
      return NextResponse.json(
        { success: false, error: 'Access token and App ID are required' },
        { status: 400 }
      );
    }

    // First, validate the access token by getting app info
    const appResponse = await fetch(`https://graph.facebook.com/v18.0/${appId}?access_token=${accessToken}`);
    
    if (!appResponse.ok) {
      return NextResponse.json(
        { success: false, error: 'Invalid access token or app ID' },
        { status: 400 }
      );
    }

    // Get WhatsApp Business Account info
    const wabaResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/businesses?access_token=${accessToken}`
    );

    if (!wabaResponse.ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch business accounts' },
        { status: 400 }
      );
    }

    const wabaData = await wabaResponse.json();
    
    if (!wabaData.data || wabaData.data.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No WhatsApp Business Account found' },
        { status: 400 }
      );
    }

    // Get the first business account (you might want to let users choose)
    const business = wabaData.data[0];
    
    // Get WhatsApp Business Account details
    const wabaDetailsResponse = await fetch(
      `https://graph.facebook.com/v18.0/${business.id}/owned_whatsapp_business_accounts?access_token=${accessToken}`
    );

    const wabaDetails = await wabaDetailsResponse.json();
    
    if (!wabaDetails.data || wabaDetails.data.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No WhatsApp Business Account found for this business' },
        { status: 400 }
      );
    }

    const waba = wabaDetails.data[0];

    // Get phone numbers associated with the WABA
    const phoneNumbersResponse = await fetch(
      `https://graph.facebook.com/v18.0/${waba.id}/phone_numbers?access_token=${accessToken}`
    );

    const phoneNumbersData = await phoneNumbersResponse.json();
    
    if (!phoneNumbersData.data || phoneNumbersData.data.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No phone numbers found for this WhatsApp Business Account' },
        { status: 400 }
      );
    }

    const phoneNumber = phoneNumbersData.data[0];

    return NextResponse.json({
      success: true,
      wabaId: waba.id,
      wabaName: waba.name,
      phoneNumberId: phoneNumber.id,
      phoneNumber: phoneNumber.display_phone_number,
      displayName: phoneNumber.verified_name,
      status: phoneNumber.status,
      qualityRating: phoneNumber.quality_rating
    });

  } catch (error) {
    console.error('Error validating WhatsApp token:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}