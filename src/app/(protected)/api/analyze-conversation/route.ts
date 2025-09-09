// app/api/analyze-conversation/route.ts

import { NextRequest, NextResponse } from 'next/server'

interface AnalysisRequest {
  prompt: string
  conversationId: string
}

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalysisRequest = await request.json()
    const { prompt, conversationId } = body

    if (!prompt || !conversationId) {
      return NextResponse.json(
        { error: 'Missing required fields: prompt and conversationId' },
        { status: 400 }
      )
    }

    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      console.error('DEEPSEEK_API_KEY not found in environment variables')
      return NextResponse.json(
        { error: 'DeepSeek API key not configured' },
        { status: 500 }
      )
    }

    console.log('🧠 Analyzing conversation:', conversationId)

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are an expert conversation analyst specializing in customer service interactions. Analyze conversations and provide actionable insights in valid JSON format only. Do not include any text outside the JSON structure.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: 'json_object' }
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('DeepSeek API Error:', response.status, errorText)
      return NextResponse.json(
        { error: `DeepSeek API error: ${response.status} ${response.statusText}` },
        { status: response.status }
      )
    }

    const data: DeepSeekResponse = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      console.error('Invalid DeepSeek API response structure:', data)
      return NextResponse.json(
        { error: 'Invalid response from DeepSeek API' },
        { status: 500 }
      )
    }

    const analysisContent = data.choices[0].message.content.trim()
    
    try {
      const analysis = JSON.parse(analysisContent)
      
      // Validate required fields
      const requiredFields = [
        'overallSentiment', 'sentimentScore', 'customerSatisfaction', 
        'responseTime', 'keyTopics', 'urgencyLevel', 'customerIntent',
        'recommendedActions', 'conversationHealth', 'engagementLevel',
        'summary', 'insights', 'risks', 'opportunities'
      ]
      
      const missingFields = requiredFields.filter(field => !(field in analysis))
      if (missingFields.length > 0) {
        console.warn('Analysis missing fields:', missingFields)
        // Fill in missing fields with defaults
        if (!analysis.overallSentiment) analysis.overallSentiment = 'neutral'
        if (!analysis.sentimentScore) analysis.sentimentScore = 5
        if (!analysis.customerSatisfaction) analysis.customerSatisfaction = 50
        if (!analysis.responseTime) analysis.responseTime = { average: 5, trend: 'stable' }
        if (!analysis.keyTopics) analysis.keyTopics = ['general inquiry']
        if (!analysis.urgencyLevel) analysis.urgencyLevel = 'medium'
        if (!analysis.customerIntent) analysis.customerIntent = 'Seeking information or assistance'
        if (!analysis.recommendedActions) analysis.recommendedActions = ['Follow up with customer']
        if (!analysis.conversationHealth) analysis.conversationHealth = 70
        if (!analysis.engagementLevel) analysis.engagementLevel = 'medium'
        if (!analysis.summary) analysis.summary = 'Customer conversation analyzed successfully'
        if (!analysis.insights) analysis.insights = ['Conversation shows standard customer interaction patterns']
        if (!analysis.risks) analysis.risks = ['No significant risks identified']
        if (!analysis.opportunities) analysis.opportunities = ['Opportunity to improve customer experience']
      }

      console.log('✅ Analysis completed successfully for conversation:', conversationId)
      
      return NextResponse.json({
        success: true,
        analysis,
        conversationId,
        timestamp: new Date().toISOString()
      })
      
    } catch (parseError) {
      console.error('Failed to parse DeepSeek response as JSON:', parseError)
      console.error('Raw response content:', analysisContent)
      
      // Fallback analysis if JSON parsing fails
      const fallbackAnalysis = {
        overallSentiment: 'neutral' as const,
        sentimentScore: 5,
        customerSatisfaction: 50,
        responseTime: { average: 5, trend: 'stable' as const },
        keyTopics: ['conversation analysis'],
        urgencyLevel: 'medium' as const,
        customerIntent: 'Customer interaction requiring attention',
        recommendedActions: ['Review conversation manually', 'Follow up with customer'],
        conversationHealth: 70,
        engagementLevel: 'medium' as const,
        summary: 'Conversation analysis completed with limited insights due to processing constraints.',
        insights: ['Analysis processed but detailed insights unavailable', 'Manual review recommended'],
        risks: ['Limited analysis depth', 'May require human oversight'],
        opportunities: ['Implement more detailed conversation tracking', 'Improve AI analysis capabilities']
      }
      
      return NextResponse.json({
        success: true,
        analysis: fallbackAnalysis,
        conversationId,
        timestamp: new Date().toISOString(),
        note: 'Fallback analysis provided due to parsing issues'
      })
    }

  } catch (error) {
    console.error('Conversation analysis error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error during conversation analysis',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Optional: Add GET method for health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'DeepSeek Conversation Analysis API is running',
    timestamp: new Date().toISOString()
  })
}