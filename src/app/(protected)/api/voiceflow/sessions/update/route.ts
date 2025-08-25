
// /api/voiceflow/session/update/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { validateVoiceflowRequest } from '@/lib/voiceflow-auth'
import { updateVoiceflowSession } from '@/lib/session-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tenantId, sessionId, variables, context, status, lastStep } = body

    // Validate request
    const isValid = await validateVoiceflowRequest(request, body)
    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Update session
    const session = await updateVoiceflowSession(sessionId, {
      variables: variables ? JSON.stringify(variables) : undefined,
      context: context ? JSON.stringify(context) : undefined,
      status,
      lastStep,
      lastActiveAt: new Date()
    })

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        sessionId: session.sessionId,
        status: session.status,
        lastActiveAt: session.lastActiveAt
      }
    })

  } catch (error) {
    console.error('Session update error:', error)
    return NextResponse.json({ 
      error: 'Failed to update session' 
    }, { status: 500 })
  }
}
