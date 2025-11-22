import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { baseReply, count = 8 } = await req.json()

    if (!baseReply || typeof baseReply !== "string") {
      return NextResponse.json({ error: "Base reply is required" }, { status: 400 })
    }

    console.log("[v0] Generating variations for base reply:", baseReply)

    const systemPrompt = `You are an expert at creating natural, human-like Instagram comment replies. Generate variations that feel genuinely conversational and human.`

    const userPrompt = `Generate ${count} unique variations of this comment reply: "${baseReply}"

REQUIREMENTS:
- Each variation MUST convey the same core message as the original
- Make them feel genuinely human and conversational
- Use different greetings: "Hey!", "Hi!", "Hi there!", "Thanks!", etc.
- Vary the structure and word order naturally
- Include friendly emojis (💙, ✨, 😊, 🙌, 🔥, 💫, 👋, ⭐) but don't overuse them
- Keep each variation under 150 characters
- Make them sound casual and approachable, NOT robotic or formal
- Some can be enthusiastic, some casual, some brief
- NEVER use placeholder text like [Your Brand] or [Product Name]

IMPORTANT: 
- These will be posted publicly on Instagram comments
- They should look like a real person typed them quickly
- Each one should feel slightly different in tone and energy
- Return ONLY the variations as a JSON array of strings
- NO explanations, NO labels, NO markdown formatting

Example format: ["Hey! Just DMd you with the link 💙", "Thanks for reaching out! Check your DMs 🙌", "Hi there! Sent you a DM with all the details ✨"]

Return ONLY a valid JSON array of ${count} variations.`

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature: 0.9,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("DeepSeek API error:", error)
      throw new Error("Failed to generate variations")
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || "[]"

    console.log("[v0] DeepSeek response content:", content)

    // Parse the variations from the response
    let variations: string[] = []
    try {
      // Try to parse as JSON array
      variations = JSON.parse(content)

      // Ensure it's an array and clean up
      if (!Array.isArray(variations)) {
        variations = []
      }

      // Clean and validate variations
      variations = variations
        .filter((v) => typeof v === "string")
        .map((v) => v.trim())
        .filter((v) => v.length > 0 && v.length <= 500) // Instagram comment limit
        .slice(0, count)
    } catch (parseError) {
      console.error("Error parsing variations:", parseError)
      // Fallback: try to extract lines from the response
      variations = content
        .split("\n")
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0 && line.length <= 500)
        .slice(0, count)
    }

    console.log("[v0] Generated variations:", variations)

    if (variations.length === 0) {
      return NextResponse.json({ error: "Failed to generate valid variations" }, { status: 500 })
    }

    return NextResponse.json({ variations })
  } catch (error: any) {
    console.error("[v0] Error generating reply variations:", error)
    return NextResponse.json({ error: error.message || "Failed to generate variations" }, { status: 500 })
  }
}
