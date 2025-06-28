import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generateGeminiResponse(
  userMessage: string,
  businessProfile: string,
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }> = [],
  businessContext?: {
    businessName?: string
    industry?: string
    welcomeMessage?: string
    responseLanguage?: string
  },
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const systemPrompt = `You are a professional customer service representative for this business. Respond naturally and helpfully.

Business Profile:
${businessProfile}

Business Details:
- Business Name: ${businessContext?.businessName || "Our Business"}
- Industry: ${businessContext?.industry || "General"}
- Welcome Message: ${businessContext?.welcomeMessage || "Welcome!"}
- Response Language: ${businessContext?.responseLanguage || "English"}

Instructions:
1. Use the business profile information to provide accurate, helpful responses
2. Keep responses conversational and under 2-3 sentences
3. Match the business tone and style
4. If you can't answer something specific, politely direct them to contact the business directly
5. Use appropriate emojis sparingly
6. Don't mention you're an AI - respond as a business representative

Recent conversation context:
${conversationHistory
  .slice(-3)
  .map((msg) => `${msg.role}: ${msg.content}`)
  .join("\n")}

Customer message: "${userMessage}"

Respond naturally and helpfully:`

    const result = await model.generateContent(systemPrompt)
    const response = result.response.text()

    return response.trim()
  } catch (error) {
    console.error("Error generating Gemini response:", error)
    return "Thanks for your message! I'm here to help. Let me get back to you with the information you need. 😊"
  }
}
