import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { systemPrompt, userPrompt, automationId } = await req.json()

    if (!systemPrompt || !userPrompt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Call DeepSeek API
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('DeepSeek API error:', error)
      throw new Error('Failed to generate keywords')
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || '[]'
    
    // Parse the JSON response
    let keywords: string[] = []
    try {
      // Try to parse as JSON
      keywords = JSON.parse(content)
      
      // Ensure it's an array and clean up
      if (!Array.isArray(keywords)) {
        keywords = []
      }
      
      // Clean and validate keywords
      keywords = keywords
        .filter(k => typeof k === 'string')
        .map(k => k.toLowerCase().trim())
        .filter(k => k.length > 0 && k.length < 30) // Reasonable length
        .slice(0, 10) // Max 10 keywords
    } catch (parseError) {
      console.error('Error parsing keywords:', parseError)
      // Fallback: try to extract words from the response
      const words = content.match(/\b[a-z]+\b/gi) || []
      keywords = words.slice(0, 10).map((w: string) => w.toLowerCase())
    }

    return NextResponse.json({ keywords })
  } catch (error) {
    console.error('Error in generate-keywords API:', error)
    return NextResponse.json(
      { error: 'Failed to generate keywords' },
      { status: 500 }
    )
  }
}