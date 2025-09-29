

// import { GoogleGenerativeAI } from "@google/generative-ai"

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// export interface GeminiResponseOptions {
//   userMessage: string
//   businessProfile: string
//   conversationHistory: Array<{ role: "user" | "assistant"; content: string }>
//   businessContext: {
//     businessName?: string
//     industry?: string
//     welcomeMessage?: string
//     responseLanguage?: string
//     businessDescription?: string
//     targetAudience?: string
//     promotionMessage?: string
//   }
//   isPROUser?: boolean
//   isVoiceflowFallback?: boolean
//   voiceflowAttemptedResponse?: string
// }

// // Human-like fallback responses for when AI services fail
// const HUMAN_LIKE_FALLBACKS = {
//   quota_exceeded: [
//     "Hey! Thanks for reaching out. I'm getting a lot of messages right now, but I definitely want to help you out. Can you give me just a few minutes to get back to you properly? 😊",
//     "Hi there! I'm swamped with messages at the moment, but I saw yours and want to make sure I give you a proper response. Mind if I circle back in a bit?",
//     "Thanks for your message! I'm dealing with quite a few inquiries right now, but I don't want to rush my response to you. Let me get back to you shortly with something helpful! 🙏",
//     "Hey! I appreciate you reaching out. I'm in the middle of helping several people right now, but I want to give you my full attention. Can I get back to you in just a few minutes?",
//     "Hi! Your message came through perfectly. I'm just finishing up with a few other conversations, but I'll be right with you. Thanks for your patience! ✨",
//   ],
//   general_error: [
//     "Hey there! Something seems to be acting up on my end right now. Can you try sending that again? I want to make sure I can help you properly! 😅",
//     "Hi! I'm having a bit of a technical moment here. Could you resend your message? I promise I'll get you a better response! 🤖",
//     "Thanks for your message! I'm experiencing some technical difficulties, but I don't want to leave you hanging. Try me again in just a moment?",
//     "Hey! My system is being a bit glitchy right now. Mind trying that again? I want to make sure I give you the help you're looking for! 💫",
//     "Hi there! I'm having some technical hiccups at the moment. Could you send that message one more time? I'll be ready for you! ⚡",
//   ],
//   pro_user: [
//     "Thank you for your message! As a valued customer, I want to ensure you get the best possible assistance. I'm experiencing some technical difficulties right now, but let me connect you with our team who can provide you with detailed, personalized support. 🌟",
//     "Hi! I appreciate your patience. I'm having some system issues at the moment, but as a premium member, you deserve the best service. Let me get our specialist team to assist you properly. They'll be much more helpful than I can be right now! ✨",
//     "Thanks for reaching out! I'm dealing with some technical challenges right now, but I don't want that to affect your experience. Our premium support team will be able to give you the comprehensive help you need. One moment please! 🚀",
//   ],
//   business_context: (businessName: string) => [
//     `Hi! Thanks for contacting ${businessName}. I'm having some technical difficulties right now, but I don't want to keep you waiting. Let me get someone from our team to help you properly! 😊`,
//     `Hey there! This is ${businessName}, and I appreciate you reaching out. I'm experiencing some system issues, but our team will make sure you get the assistance you need. Just give us a moment! 🙏`,
//     `Hello! Thanks for your interest in ${businessName}. I'm having a bit of a technical moment, but we definitely want to help you out. Our team will be right with you! ✨`,
//   ],
// }

// function getRandomFallback(category: keyof typeof HUMAN_LIKE_FALLBACKS, businessName?: string): string {
//   if (category === "business_context" && businessName) {
//     const responses = HUMAN_LIKE_FALLBACKS.business_context(businessName)
//     return responses[Math.floor(Math.random() * responses.length)]
//   }

//   const responses = HUMAN_LIKE_FALLBACKS[category as keyof Omit<typeof HUMAN_LIKE_FALLBACKS, "business_context">]
//   if (Array.isArray(responses)) {
//     return responses[Math.floor(Math.random() * responses.length)]
//   }

//   return "Thanks for your message! I'm here to help. Let me get back to you with the information you need. 😊"
// }

// export async function generateGeminiResponse(options: GeminiResponseOptions): Promise<string> {
//   const {
//     userMessage,
//     businessProfile,
//     conversationHistory = [],
//     businessContext,
//     isPROUser = false,
//     isVoiceflowFallback = false,
//     voiceflowAttemptedResponse,
//   } = options

//   try {
//     const model = genAI.getGenerativeModel({
//       model: isPROUser ? "gemini-1.5-pro" : "gemini-1.5-flash",
//     })

//     // Enhanced system prompt for PRO users vs regular users
//     const systemPrompt = isPROUser ? buildPROSystemPrompt(options) : buildStandardSystemPrompt(options)

//     const result = await model.generateContent(systemPrompt)
//     const response = result.response.text()

//     return response.trim()
//   } catch (error: any) {
//     console.error("Error generating Gemini response:", error)

//     // Enhanced error handling with specific responses
//     if (error?.status === 429 || error?.message?.includes("quota") || error?.message?.includes("rate limit")) {
//       console.log("🚫 Gemini quota exceeded, using human-like fallback")

//       if (isPROUser) {
//         return getRandomFallback("pro_user")
//       } else if (businessContext.businessName) {
//         return getRandomFallback("business_context", businessContext.businessName)
//       } else {
//         return getRandomFallback("quota_exceeded")
//       }
//     }

//     // For other errors, use general fallbacks
//     if (isPROUser) {
//       return getRandomFallback("pro_user")
//     } else if (businessContext.businessName) {
//       return getRandomFallback("business_context", businessContext.businessName)
//     } else {
//       return getRandomFallback("general_error")
//     }
//   }
// }

// function buildPROSystemPrompt(options: GeminiResponseOptions): string {
//   const {
//     userMessage,
//     businessProfile,
//     conversationHistory,
//     businessContext,
//     isVoiceflowFallback,
//     voiceflowAttemptedResponse,
//   } = options

//   return `You are a PREMIUM customer service representative for ${businessContext.businessName || "this business"}. You provide exceptional, detailed, and personalized service.

// 🏢 BUSINESS PROFILE (CRITICAL - Follow this exactly):
// ${businessProfile}

// 📊 BUSINESS DETAILS:
// - Business Name: ${businessContext.businessName || "Our Business"}
// - Industry: ${businessContext.industry || "General"}
// - Target Audience: ${businessContext.targetAudience || "General customers"}
// - Business Description: ${businessContext.businessDescription || "Professional business"}
// - Promotion Message: ${businessContext.promotionMessage || ""}
// - Response Language: ${businessContext.responseLanguage || "English"}

// ${
//   isVoiceflowFallback
//     ? `
// 🔄 VOICEFLOW FALLBACK CONTEXT:
// This is a fallback response because our advanced system encountered an issue. The attempted response was: "${voiceflowAttemptedResponse || "No response generated"}"
// You need to provide an EXCEPTIONAL response that exceeds what the advanced system would have provided.
// `
//     : ""
// }

// 💬 CONVERSATION HISTORY (Use this for context):
// ${
//   conversationHistory.length > 0
//     ? conversationHistory
//         .slice(-8)
//         .map((msg, index) => `${index + 1}. ${msg.role === "user" ? "Customer" : "You"}: ${msg.content}`)
//         .join("\n")
//     : "This is the start of the conversation."
// }

// 🎯 PREMIUM SERVICE INSTRUCTIONS:
// 1. **ALWAYS follow the business profile exactly** - this is your primary source of truth
// 2. **Provide detailed, comprehensive responses** (3-5 sentences when appropriate)
// 3. **Reference conversation history** to show you remember previous interactions
// 4. **Use the customer's name** if mentioned in conversation history
// 5. **Offer additional value** - suggest related services, next steps, or helpful resources
// 6. **Be proactive** - anticipate customer needs based on their inquiry
// 7. **Maintain premium tone** - professional yet warm and personable
// 8. **Include relevant business details** from the profile when helpful
// 9. **If you can't fully help**, offer to escalate to a specialist with specific expertise
// 10. **Use appropriate emojis** to enhance communication (but don't overdo it)
// 11. **Never mention you're an AI** - you're a premium customer service representative

// 📝 CURRENT CUSTOMER MESSAGE: "${userMessage}"

// Provide an exceptional, detailed response that demonstrates premium service quality and strict adherence to the business profile:`
// }

// function buildStandardSystemPrompt(options: GeminiResponseOptions): string {
//   const { userMessage, businessProfile, conversationHistory, businessContext } = options

//   return `You are a professional customer service representative for ${businessContext.businessName || "this business"}.

// 🏢 BUSINESS PROFILE (CRITICAL - Follow this exactly):
// ${businessProfile}

// 📊 BUSINESS DETAILS:
// - Business Name: ${businessContext.businessName || "Our Business"}
// - Industry: ${businessContext.industry || "General"}
// - Response Language: ${businessContext.responseLanguage || "English"}

// 💬 CONVERSATION HISTORY (Use this for context):
// ${
//   conversationHistory.length > 0
//     ? conversationHistory
//         .slice(-5)
//         .map((msg, index) => `${index + 1}. ${msg.role === "user" ? "Customer" : "You"}: ${msg.content}`)
//         .join("\n")
//     : "This is the start of the conversation."
// }

// 🎯 SERVICE INSTRUCTIONS:
// 1. **ALWAYS follow the business profile exactly** - this is your primary source of truth
// 2. **Keep responses concise but helpful** (1-3 sentences)
// 3. **Reference conversation history** when relevant
// 4. **Use information from the business profile** to provide accurate answers
// 5. **If you can't help**, suggest they contact the business directly
// 6. **Maintain friendly, professional tone**
// 7. **Use appropriate emojis sparingly**
// 8. **Never mention you're an AI** - you're a business representative

// 📝 CURRENT CUSTOMER MESSAGE: "${userMessage}"

// Respond naturally and helpfully based on the business profile:`
// }

// // Enhanced conversation context builder
// export async function buildConversationContext(
//   pageId: string,
//   senderId: string,
//   automationId: string,
// ): Promise<Array<{ role: "user" | "assistant"; content: string }>> {
//   try {
//     // Get recent conversation messages from database
//     const recentMessages = await import("@/lib/prisma").then(({ client }) =>
//       client.dms.findMany({
//         where: {
//           OR: [
//             { senderId, reciever: pageId },
//             { senderId: pageId, reciever: senderId },
//           ],
//           automationId,
//         },
//         orderBy: { createdAt: "asc" },
//         take: 20, // Get more history for better context
//         select: {
//           message: true,
//           createdAt: true,
//           senderId: true,
//         },
//       }),
//     )

//     // Convert to conversation format
//     const conversationHistory = recentMessages
//       .filter((msg) => msg.message && msg.message.trim().length > 0)
//       .map((msg) => ({
//         role: (msg.senderId === senderId ? "user" : "assistant") as "user" | "assistant",
//         content: msg.message!,
//       }))

//     return conversationHistory
//   } catch (error) {
//     console.error("Error building conversation context:", error)
//     return []
//   }
// }

import { GoogleGenerativeAI } from "@google/generative-ai"
import { findAutomation } from "@/actions/automations/queries"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export interface GeminiResponseOptions {
  automationId: string // Add this to fetch the listener prompt
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
}

export async function generateGeminiResponse(options: GeminiResponseOptions): Promise<string> {
  const {
    automationId,
    userMessage,
    businessProfile,
    conversationHistory = [],
    businessContext,
    isPROUser = false,
  } = options

  // Fetch the automation to get the listener prompt as fallback
  let fallbackPrompt = "Thanks for your message! We'll get back to you soon."
  
  try {
    const automation = await findAutomation(automationId)
    if (automation?.listener?.prompt) {
      fallbackPrompt = automation.listener.prompt
    }
  } catch (error) {
    console.error("Error fetching automation listener:", error)
  }

  try {
    const model = genAI.getGenerativeModel({
      model: isPROUser ? "gemini-1.5-pro" : "gemini-1.5-flash",
    })

    const systemPrompt = isPROUser ? buildPROSystemPrompt(options) : buildStandardSystemPrompt(options)

    const result = await model.generateContent(systemPrompt)
    const response = result.response.text()

    return response.trim()
  } catch (error: any) {
    console.error("Error generating Gemini response:", error)

    // Log the error type for monitoring
    if (error?.status === 429 || error?.message?.includes("quota") || error?.message?.includes("rate limit")) {
      console.log("⚠️ Gemini quota exceeded, using configured fallback message")
    } else {
      console.log("⚠️ Gemini error occurred, using configured fallback message")
    }

    // Always return the user-configured prompt as fallback
    return fallbackPrompt
  }
}

function buildPROSystemPrompt(options: GeminiResponseOptions): string {
  const {
    userMessage,
    businessProfile,
    conversationHistory,
    businessContext,
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