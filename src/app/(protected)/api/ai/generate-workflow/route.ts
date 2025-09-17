

// import { NextRequest, NextResponse } from 'next/server'
// import { GoogleGenerativeAI } from '@google/generative-ai'
// import OpenAI from 'openai'

// // Initialize both APIs for fallback
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
// const deepseek = new OpenAI({
//   apiKey: process.env.DEEPSEEK_API_KEY!,
//   baseURL: 'https://api.deepseek.com/v1'
// })

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json()
//     const { systemPrompt, userRequest, businessInfo, selectedChannels, automationFeatures } = body

//     // Try Gemini Flash first (lower quota usage)
//     try {
//       console.log('Attempting Gemini Flash...')
//       const result = await generateWithGemini(systemPrompt, userRequest, businessInfo, selectedChannels, automationFeatures)
//       return NextResponse.json({
//         success: true,
//         workflowData: result,
//         generatedAt: new Date().toISOString(),
//         aiProvider: "Google Gemini Flash"
//       })
//     } catch (geminiError) {
//       console.log('Gemini failed, trying DeepSeek...', geminiError)
      
//       // Fallback to DeepSeek
//       try {
//         const result = await generateWithDeepSeek(systemPrompt, userRequest, businessInfo, selectedChannels, automationFeatures)
//         return NextResponse.json({
//           success: true,
//           workflowData: result,
//           generatedAt: new Date().toISOString(),
//           aiProvider: "DeepSeek (Fallback)"
//         })
//       } catch (deepseekError) {
//         console.log('DeepSeek failed, using fallback workflow...', deepseekError)
        
//         // Ultimate fallback - generate a good default workflow
//         const result = generateFallbackWorkflow(businessInfo, selectedChannels, automationFeatures)
//         return NextResponse.json({
//           success: true,
//           workflowData: result,
//           generatedAt: new Date().toISOString(),
//           aiProvider: "Intelligent Fallback"
//         })
//       }
//     }

//   } catch (error) {
//     console.error('Complete API failure:', error)
//     return NextResponse.json(
//       { 
//         success: false, 
//         error: 'AI workflow generation failed',
//         details: error instanceof Error ? error.message : 'Unknown error'
//       },
//       { status: 500 }
//     )
//   }
// }

// async function generateWithGemini(systemPrompt: string, userRequest: string, businessInfo: any, selectedChannels: string[], automationFeatures: string[]) {
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) // Using Flash model for lower quota

//   const prompt = `Create a social media automation workflow for ${businessInfo.businessName}.

// Business: ${businessInfo.businessName} (${businessInfo.businessType})
// Platforms: ${selectedChannels.join(', ')}
// Features: ${automationFeatures.join(', ')}
// Request: ${userRequest}

// Generate 8-10 workflow steps. Return ONLY valid JSON:

// {
//   "title": "Workflow Title",
//   "description": "Detailed description", 
//   "estimatedBuildTime": "2-4 weeks",
//   "complexity": "Enterprise",
//   "estimatedCost": "$500-2000/month",
//   "roi": "300-500% within 6 months",
//   "benefits": ["benefit1", "benefit2"],
//   "exampleScenario": "Detailed scenario",
//   "technicalRequirements": ["requirement1", "requirement2"],
//   "steps": [
//     {
//       "title": "Step Title",
//       "description": "Detailed description",
//       "type": "trigger|analysis|filter|response|routing|storage|automation|payment|communication",
//       "estimatedTime": "1-2s",
//       "aiReasoning": "Why this step is important",
//       "businessImpact": "Business impact",
//       "complexity": "low|medium|high",
//       "details": ["detail1", "detail2"]
//     }
//   ],
//   "metrics": {
//     "automationRate": "92%",
//     "responseTime": "< 2 seconds", 
//     "accuracy": "94%",
//     "scalability": "Enterprise"
//   }
// }`

//   const result = await model.generateContent(prompt)
//   const response = await result.response
//   const text = response.text()

//   // Parse JSON from response
//   const jsonMatch = text.match(/\{[\s\S]*\}/)
//   if (!jsonMatch) throw new Error('No JSON in Gemini response')
  
//   return JSON.parse(jsonMatch[0])
// }

// async function generateWithDeepSeek(systemPrompt: string, userRequest: string, businessInfo: any, selectedChannels: string[], automationFeatures: string[]) {
//   const completion = await deepseek.chat.completions.create({
//     model: "deepseek-chat",
//     messages: [
//       {
//         role: "system",
//         content: "You are a workflow automation expert. Create detailed social media automation workflows. Return only valid JSON."
//       },
//       {
//         role: "user", 
//         content: `Create workflow for ${businessInfo.businessName} (${businessInfo.businessType}) on ${selectedChannels.join(', ')} with ${automationFeatures.join(', ')}. Request: ${userRequest}`
//       }
//     ],
//     temperature: 0.7,
//     max_tokens: 3000,
//     response_format: { type: "json_object" }
//   })

//   const aiResponse = completion.choices[0]?.message?.content
//   if (!aiResponse) throw new Error('No DeepSeek response')
  
//   return JSON.parse(aiResponse)
// }

// function generateFallbackWorkflow(businessInfo: any, selectedChannels: string[], automationFeatures: string[]) {
//   return {
//     title: `${businessInfo.businessName} Social Media Automation`,
//     description: `Enterprise automation workflow for ${selectedChannels.join(', ')} platforms`,
//     estimatedBuildTime: "2-3 weeks",
//     complexity: "Enterprise",
//     estimatedCost: "$600-1800/month",
//     roi: "350-450% within 6 months",
//     benefits: [
//       "95% reduction in response time",
//       "24/7 automated customer engagement",
//       "Intelligent sentiment analysis",
//       "Seamless human handoff", 
//       "Real-time analytics and insights"
//     ],
//     exampleScenario: "Customer sends message → AI analyzes intent → Provides personalized response → Updates CRM → Schedules follow-up",
//     technicalRequirements: [
//       "Social media platform API access",
//       "AI/ML processing pipeline",
//       "Customer database integration",
//       "Real-time webhook handling"
//     ],
//     steps: [
//       {
//         title: "Multi-Platform Message Reception",
//         description: "Centralized capture of messages from all connected social media platforms",
//         type: "trigger",
//         estimatedTime: "< 1s",
//         aiReasoning: "Critical entry point that must handle all incoming customer communications reliably",
//         businessImpact: "Ensures no customer message is missed, improving satisfaction rates",
//         complexity: "medium",
//         details: [
//           "Real-time webhook integration",
//           "Message deduplication and normalization", 
//           "Platform-specific formatting handling",
//           "High-volume queue management"
//         ]
//       },
//       {
//         title: "AI Intent & Sentiment Analysis",
//         description: "Advanced AI processing to understand customer intent, emotion, and urgency",
//         type: "analysis",
//         estimatedTime: "2-3s", 
//         aiReasoning: "Understanding customer intent enables contextually appropriate responses",
//         businessImpact: "Improves response relevance by 94% and customer satisfaction",
//         complexity: "high",
//         details: [
//           "Natural language processing",
//           "Intent classification with confidence scoring",
//           "Sentiment analysis (positive/negative/neutral)",
//           "Urgency and priority assessment"
//         ]
//       },
//       {
//         title: "Smart Content Filtering",
//         description: "Intelligent filtering for spam detection and content moderation",
//         type: "filter",
//         estimatedTime: "1-2s",
//         aiReasoning: "Protects brand reputation while ensuring legitimate messages are processed",
//         businessImpact: "Reduces manual moderation by 90% and maintains brand safety",
//         complexity: "medium",
//         details: [
//           "Machine learning spam detection",
//           "Content appropriateness scoring", 
//           "Security threat identification",
//           "Brand safety rule enforcement"
//         ]
//       },
//       {
//         title: "Customer Profile Enhancement", 
//         description: "Enrich customer data by syncing with CRM and external data sources",
//         type: "integration",
//         estimatedTime: "2-4s",
//         aiReasoning: "Complete customer context enables personalized responses and better service",
//         businessImpact: "Increases personalization effectiveness by 70%",
//         complexity: "high",
//         details: [
//           "Real-time CRM data synchronization",
//           "Social profile enrichment",
//           "Purchase history integration",
//           "Customer segmentation updates"
//         ]
//       },
//       {
//         title: "Dynamic Response Generation",
//         description: "AI-powered response generation with brand voice consistency",
//         type: "response", 
//         estimatedTime: "1-2s",
//         aiReasoning: "Provides immediate, personalized value while maintaining brand consistency",
//         businessImpact: "Reduces response time from hours to seconds", 
//         complexity: "high",
//         details: [
//           "Brand voice consistency engine",
//           "Dynamic content personalization",
//           "Multi-language support",
//           "Response optimization and testing"
//         ]
//       },
//       {
//         title: "Intelligent Human Escalation",
//         description: "Smart routing to determine when human intervention is needed",
//         type: "routing",
//         estimatedTime: "< 1s",
//         aiReasoning: "Optimizes resource allocation by escalating only complex cases",
//         businessImpact: "Improves agent efficiency by 60% while ensuring quality service",
//         complexity: "medium", 
//         details: [
//           "Complexity scoring algorithms",
//           "Customer value assessment",
//           "Agent skill matching",
//           "SLA and queue management"
//         ]
//       },
//       {
//         title: "Payment Processing Integration",
//         description: "Seamless payment handling for direct purchases and subscriptions", 
//         type: "payment",
//         estimatedTime: "3-5s",
//         aiReasoning: "Enables immediate revenue capture through conversational commerce",
//         businessImpact: "Increases conversion rates by 65% through frictionless payments",
//         complexity: "high",
//         details: [
//           "Multi-gateway payment processing",
//           "Subscription management",
//           "Fraud prevention and security",
//           "Payment tracking and reconciliation"
//         ]
//       },
//       {
//         title: "Comprehensive Data Synchronization",
//         description: "Complete sync of interaction data across all business systems",
//         type: "storage",
//         estimatedTime: "2-4s",
//         aiReasoning: "Maintains complete audit trail and enables sales team effectiveness",
//         businessImpact: "Improves follow-up effectiveness by 75%",
//         complexity: "medium",
//         details: [
//           "Multi-system data synchronization", 
//           "Automated task and opportunity creation",
//           "Interaction timeline maintenance",
//           "Custom workflow triggers"
//         ]
//       },
//       {
//         title: "Smart Follow-up Automation",
//         description: "Intelligent scheduling of follow-up communications based on customer behavior",
//         type: "automation",
//         estimatedTime: "1-2s",
//         aiReasoning: "Maximizes customer lifetime value through strategic engagement timing",
//         businessImpact: "Increases retention by 50% and upsell opportunities by 40%",
//         complexity: "medium",
//         details: [
//           "Behavioral trigger-based scheduling",
//           "Multi-channel coordination",
//           "Personalized content delivery", 
//           "Performance tracking and optimization"
//         ]
//       },
//       {
//         title: "Real-time Analytics & Reporting",
//         description: "Comprehensive monitoring and analytics for continuous optimization",
//         type: "validation",
//         estimatedTime: "1-3s", 
//         aiReasoning: "Enables data-driven optimization and business growth insights",
//         businessImpact: "Provides insights that improve performance by 30% monthly",
//         complexity: "medium",
//         details: [
//           "Real-time performance dashboards",
//           "Customer satisfaction tracking",
//           "ROI and conversion analytics",
//           "Automated reporting systems"
//         ]
//       }
//     ],
//     metrics: {
//       automationRate: "93%",
//       responseTime: "< 2 seconds",
//       accuracy: "94%", 
//       scalability: "Enterprise"
//     }
//   }
// }


import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { z } from "zod"

const deepseek = createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
})

const workflowSchema = z.object({
  suggestions: z
    .array(
      z.object({
        name: z.string().describe("Name of the workflow"),
        description: z.string().describe("Description of what the workflow does"),
        aiGenerated: z.boolean().default(true),
        steps: z.array(
          z.object({
            stepId: z.string().describe("Unique step identifier"),
            stepType: z.enum(["trigger", "action", "condition"]).describe("Type of step"),
            integrationId: z.string().describe("Integration ID from available integrations"),
            integrationName: z.string().describe("Human readable integration name"),
            capabilityId: z.string().describe("Capability ID from integration"),
            capabilityName: z.string().describe("Human readable capability name"),
            config: z.record(z.any()).describe("Configuration object for this step"),
            positionX: z.number().describe("X position for visual layout"),
            positionY: z.number().describe("Y position for visual layout"),
            stepOrder: z.number().describe("Order of execution"),
          }),
        ),
        conditions: z
          .array(
            z.object({
              conditionId: z.string().describe("Unique condition identifier"),
              field: z.string().describe("Field to check"),
              operator: z
                .enum(["equals", "not_equals", "contains", "greater_than", "less_than"])
                .describe("Comparison operator"),
              value: z.string().describe("Value to compare against"),
              trueStepId: z.string().optional().describe("Step to execute if condition is true"),
              falseStepId: z.string().optional().describe("Step to execute if condition is false"),
            }),
          )
          .optional(),
      }),
    )
    .max(3)
    .describe("Maximum 3 workflow suggestions"),
})

export async function POST(request: NextRequest) {
  try {
    const { prompt, integrations } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json({ error: "DeepSeek API key not configured" }, { status: 500 })
    }

    const { object } = await generateObject({
      model: deepseek("deepseek-chat"),
      schema: workflowSchema,
      prompt: `
        You are an AI workflow builder assistant. Based on the user's prompt, create 1-3 workflow suggestions that use the available integrations.

        User prompt: "${prompt}"

        Available integrations and their capabilities:
        ${JSON.stringify(integrations, null, 2)}

        Guidelines:
        1. Create practical, actionable workflows that solve real business problems
        2. Use only the integrations and capabilities provided
        3. Start with a trigger step, add conditions if needed, then action steps
        4. Position steps visually (x: 100, 200, 300... y: 100 for linear flow)
        5. Include realistic configuration objects for each step
        6. Make step IDs unique within each workflow (step_1, step_2, etc.)
        7. Order steps logically (0, 1, 2, etc.)
        8. Create workflows that make business sense for the user's request

        Example workflow structure:
        - Trigger: Something happens (payment received, form submitted, etc.)
        - Condition: Check if criteria is met (payment amount, customer type, etc.)
        - Action: Do something (send email, create booking, update inventory, etc.)
      `,
      maxTokens: 2000,
      temperature: 0.7,
    })

    return NextResponse.json(object)
  } catch (error) {
    console.error("AI workflow generation error:", error)

    const fallbackResponse = {
      suggestions: [
        {
          name: "Basic Automation Workflow",
          description: "A simple workflow based on your request",
          aiGenerated: true,
          steps: [
            {
              stepId: "step_1",
              stepType: "trigger" as const,
              integrationId: "default",
              integrationName: "Default",
              capabilityId: "default_action",
              capabilityName: "Default Action",
              config: {},
              positionX: 100,
              positionY: 100,
              stepOrder: 0,
            },
          ],
          conditions: [],
        },
      ],
    }

    return NextResponse.json(fallbackResponse)
  }
}
