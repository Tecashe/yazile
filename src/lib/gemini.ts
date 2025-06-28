import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export interface GeminiResponseOptions {
  userMessage: string
  businessProfile: string
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>
  businessContext: {
    businessName?: string
    industry?: string
    welcomeMessage?: string
    responseLanguage?: string
    businessDescription?: string
    targetAudience?: string
    promotionMessage?: string
  }
  isPROUser?: boolean
  isVoiceflowFallback?: boolean
  voiceflowAttemptedResponse?: string
}

export async function generateGeminiResponse(options: GeminiResponseOptions): Promise<string> {
  const {
    userMessage,
    businessProfile,
    conversationHistory = [],
    businessContext,
    isPROUser = false,
    isVoiceflowFallback = false,
    voiceflowAttemptedResponse,
  } = options

  try {
    const model = genAI.getGenerativeModel({
      model: isPROUser ? "gemini-1.5-pro" : "gemini-1.5-flash",
    })

    // Enhanced system prompt for PRO users vs regular users
    const systemPrompt = isPROUser ? buildPROSystemPrompt(options) : buildStandardSystemPrompt(options)

    const result = await model.generateContent(systemPrompt)
    const response = result.response.text()

    return response.trim()
  } catch (error) {
    console.error("Error generating Gemini response:", error)

    // Intelligent fallback based on user type
    if (isPROUser) {
      return `Thank you for your message! As a valued customer, I want to ensure you get the best possible assistance. Let me connect you with our team who can provide you with detailed, personalized support. 🌟`
    } else {
      return "Thanks for your message! I'm here to help. Let me get back to you with the information you need. 😊"
    }
  }
}

function buildPROSystemPrompt(options: GeminiResponseOptions): string {
  const {
    userMessage,
    businessProfile,
    conversationHistory,
    businessContext,
    isVoiceflowFallback,
    voiceflowAttemptedResponse,
  } = options

  return `You are a PREMIUM customer service representative for ${businessContext.businessName || "this business"}. You provide exceptional, detailed, and personalized service.

🏢 BUSINESS PROFILE (CRITICAL - Follow this exactly):
${businessProfile}

📊 BUSINESS DETAILS:
- Business Name: ${businessContext.businessName || "Our Business"}
- Industry: ${businessContext.industry || "General"}
- Target Audience: ${businessContext.targetAudience || "General customers"}
- Business Description: ${businessContext.businessDescription || "Professional business"}
- Promotion Message: ${businessContext.promotionMessage || ""}
- Response Language: ${businessContext.responseLanguage || "English"}

${
  isVoiceflowFallback
    ? `
🔄 VOICEFLOW FALLBACK CONTEXT:
This is a fallback response because our advanced system encountered an issue. The attempted response was: "${voiceflowAttemptedResponse || "No response generated"}"
You need to provide an EXCEPTIONAL response that exceeds what the advanced system would have provided.
`
    : ""
}

💬 CONVERSATION HISTORY (Use this for context):
${
  conversationHistory.length > 0
    ? conversationHistory
        .slice(-8)
        .map((msg, index) => `${index + 1}. ${msg.role === "user" ? "Customer" : "You"}: ${msg.content}`)
        .join("\n")
    : "This is the start of the conversation."
}

🎯 PREMIUM SERVICE INSTRUCTIONS:
1. **ALWAYS follow the business profile exactly** - this is your primary source of truth
2. **Provide detailed, comprehensive responses** (3-5 sentences when appropriate)
3. **Reference conversation history** to show you remember previous interactions
4. **Use the customer's name** if mentioned in conversation history
5. **Offer additional value** - suggest related services, next steps, or helpful resources
6. **Be proactive** - anticipate customer needs based on their inquiry
7. **Maintain premium tone** - professional yet warm and personable
8. **Include relevant business details** from the profile when helpful
9. **If you can't fully help**, offer to escalate to a specialist with specific expertise
10. **Use appropriate emojis** to enhance communication (but don't overdo it)
11. **Never mention you're an AI** - you're a premium customer service representative

📝 CURRENT CUSTOMER MESSAGE: "${userMessage}"

Provide an exceptional, detailed response that demonstrates premium service quality and strict adherence to the business profile:`
}

function buildStandardSystemPrompt(options: GeminiResponseOptions): string {
  const { userMessage, businessProfile, conversationHistory, businessContext } = options

  return `You are a professional customer service representative for ${businessContext.businessName || "this business"}.

🏢 BUSINESS PROFILE (CRITICAL - Follow this exactly):
${businessProfile}

📊 BUSINESS DETAILS:
- Business Name: ${businessContext.businessName || "Our Business"}
- Industry: ${businessContext.industry || "General"}
- Response Language: ${businessContext.responseLanguage || "English"}

💬 CONVERSATION HISTORY (Use this for context):
${
  conversationHistory.length > 0
    ? conversationHistory
        .slice(-5)
        .map((msg, index) => `${index + 1}. ${msg.role === "user" ? "Customer" : "You"}: ${msg.content}`)
        .join("\n")
    : "This is the start of the conversation."
}

🎯 SERVICE INSTRUCTIONS:
1. **ALWAYS follow the business profile exactly** - this is your primary source of truth
2. **Keep responses concise but helpful** (1-3 sentences)
3. **Reference conversation history** when relevant
4. **Use information from the business profile** to provide accurate answers
5. **If you can't help**, suggest they contact the business directly
6. **Maintain friendly, professional tone**
7. **Use appropriate emojis sparingly**
8. **Never mention you're an AI** - you're a business representative

📝 CURRENT CUSTOMER MESSAGE: "${userMessage}"

Respond naturally and helpfully based on the business profile:`
}

// Enhanced conversation context builder
export async function buildConversationContext(
  pageId: string,
  senderId: string,
  automationId: string,
): Promise<Array<{ role: "user" | "assistant"; content: string }>> {
  try {
    // Get recent conversation messages from database
    const recentMessages = await import("@/lib/prisma").then(({ client }) =>
      client.dms.findMany({
        where: {
          OR: [
            { senderId, reciever: pageId },
            { senderId: pageId, reciever: senderId },
          ],
          automationId,
        },
        orderBy: { createdAt: "asc" },
        take: 20, // Get more history for better context
        select: {
          message: true,
          createdAt: true,
          senderId: true,
        },
      }),
    )

    // Convert to conversation format
    const conversationHistory = recentMessages
      .filter((msg) => msg.message && msg.message.trim().length > 0)
      .map((msg) => ({
        role: (msg.senderId === senderId ? "user" : "assistant") as "user" | "assistant",
        content: msg.message!,
      }))

    return conversationHistory
  } catch (error) {
    console.error("Error building conversation context:", error)
    return []
  }
}
