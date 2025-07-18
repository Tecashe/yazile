import { NextRequest, NextResponse } from 'next/server'

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400',
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('🚀 Proxying request to N8N:', body)

    const response = await fetch('https://yaziln8n.onrender.com/webhook/voiceflow-workflow-builder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Yazzil-Proxy/1.0',
      },
      body: JSON.stringify(body),
    })

    console.log('📡 N8N Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ N8N Error:', errorText)
      
      return NextResponse.json({
        status: 'error',
        message: `N8N server error: ${response.status}`,
        details: errorText
      }, { 
        status: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      })
    }

    const data = await response.json()
    console.log('✅ N8N Response data:', data)
    
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    })
  } catch (error) {
    console.error('❌ Proxy request failed:', error)
    
    return NextResponse.json({ 
      status: 'error',
      message: 'Proxy request failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    })
  }
}
