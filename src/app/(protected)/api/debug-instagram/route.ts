// Create this as /app/api/debug-instagram/route.ts
import { NextResponse } from "next/server";
import { client } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    
    console.log('=== Instagram Debug Started ===');
    console.log('User ID:', userId);
    
    // Fetch user and integration
    const user = await client.user.findUnique({
      where: { clerkId: userId },
      include: { 
        integrations: { 
          where: { name: "INSTAGRAM" }
        } 
      },
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    if (!user.integrations || user.integrations.length === 0) {
      return NextResponse.json({ error: "No Instagram integration found" }, { status: 400 });
    }
    
    const integration = user.integrations[0];
    console.log('Integration found:', {
      id: integration.id,
      instagramId: integration.instagramId,
      username: integration.username,
      tokenExists: !!integration.token,
      tokenLength: integration.token?.length,
      expiresAt: integration.expiresAt?.toISOString()
    });
    
    // Test 1: Check if we can get Instagram account info
    const accountInfoUrl = `https://graph.instagram.com/v22.0/${integration.instagramId}?fields=id,username,account_type&access_token=${integration.token}`;
    
    console.log('Testing account info API call...');
    console.log('URL:', accountInfoUrl.replace(integration.token, '[TOKEN_HIDDEN]'));
    
    const accountResponse = await fetch(accountInfoUrl);
    const accountText = await accountResponse.text();
    
    console.log('Account API Response:', {
      status: accountResponse.status,
      statusText: accountResponse.statusText,
      headers: Object.fromEntries(accountResponse.headers.entries()),
      body: accountText
    });
    
    let accountData;
    try {
      accountData = JSON.parse(accountText);
    } catch (e) {
      console.log('Failed to parse account response as JSON');
      accountData = { raw: accountText };
    }
    
    // Test 2: Try to create a simple media container (without publishing)
    const testImageUrl = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4"; // Free test image
    const mediaUrl = `https://graph.instagram.com/v22.0/${integration.instagramId}/media`;
    
    console.log('Testing media container creation...');
    
    const mediaParams = new URLSearchParams();
    mediaParams.set('image_url', testImageUrl);
    mediaParams.set('media_type', 'IMAGE');
    mediaParams.set('caption', 'Test post - this will not be published');
    mediaParams.set('access_token', integration.token);
    
    const mediaResponse = await fetch(`${mediaUrl}?${mediaParams.toString()}`, {
      method: 'POST'
    });
    
    const mediaText = await mediaResponse.text();
    
    console.log('Media Container API Response:', {
      status: mediaResponse.status,
      statusText: mediaResponse.statusText,
      headers: Object.fromEntries(mediaResponse.headers.entries()),
      body: mediaText
    });
    
    let mediaData;
    try {
      mediaData = JSON.parse(mediaText);
    } catch (e) {
      console.log('Failed to parse media response as JSON');
      mediaData = { raw: mediaText };
    }
    
    // Test 3: Check Instagram API permissions
    const permissionsUrl = `https://graph.instagram.com/v22.0/${integration.instagramId}?fields=id,username,account_type,media_count&access_token=${integration.token}`;
    
    const permissionsResponse = await fetch(permissionsUrl);
    const permissionsText = await permissionsResponse.text();
    
    console.log('Permissions API Response:', {
      status: permissionsResponse.status,
      body: permissionsText
    });
    
    return NextResponse.json({
      success: true,
      debug: {
        user: {
          id: user.id,
          clerkId: user.clerkId
        },
        integration: {
          id: integration.id,
          instagramId: integration.instagramId,
          username: integration.username,
          tokenExists: !!integration.token,
          tokenPrefix: integration.token?.substring(0, 10) + '...',
          expiresAt: integration.expiresAt?.toISOString()
        },
        tests: {
          accountInfo: {
            status: accountResponse.status,
            success: accountResponse.ok,
            data: accountData
          },
          mediaContainer: {
            status: mediaResponse.status,
            success: mediaResponse.ok,
            data: mediaData
          },
          permissions: {
            status: permissionsResponse.status,
            success: permissionsResponse.ok,
            data: permissionsText
          }
        }
      }
    });
    
  } catch (error) {
    console.error('Debug API Error:', error);
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
      stack: (error as Error).stack
    }, { status: 500 });
  }
}