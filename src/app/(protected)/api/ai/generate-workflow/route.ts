// import { NextRequest, NextResponse } from 'next/server'
// import { GoogleGenerativeAI } from '@google/generative-ai'

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_SECOND!)

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json()
//     const { systemPrompt, userRequest, businessInfo, selectedChannels, automationFeatures } = body

//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

//     const prompt = `${systemPrompt}

// INTEGRATION CATEGORIES:
// - CRM: HubSpot, Salesforce, Zoho CRM, Pipedrive
// - E-commerce: Shopify, WooCommerce, Magento  
// - Email: Mailchimp, SendGrid, Klaviyo
// - Payment: Stripe, PayPal, Square
// - Analytics: Google Analytics, Mixpanel
// - Support: Zendesk, Intercom, Freshdesk
// - Communication: Slack, Discord, Microsoft Teams
// - Scheduling: Calendly, Acuity Scheduling
// - Database: Airtable, Notion, Google Sheets
// - Automation: Zapier, Make, n8n

// BUSINESS CONTEXT:
// Company: ${businessInfo.businessName} (${businessInfo.businessType})
// Platforms: ${selectedChannels.join(', ')}
// Features: ${automationFeatures.join(', ')}
// Request: ${userRequest}

// Generate a comprehensive workflow with 8-12 steps. Return ONLY valid JSON in this exact format:

// {
//   "title": "Workflow Title",
//   "description": "Detailed description",
//   "estimatedBuildTime": "2-4 weeks",
//   "complexity": "Enterprise", 
//   "estimatedCost": "$500-2000/month",
//   "roi": "300-500% within 6 months",
//   "benefits": [
//     "95% reduction in response time",
//     "24/7 automated customer engagement", 
//     "Intelligent sentiment analysis",
//     "Seamless human handoff",
//     "Real-time analytics and insights"
//   ],
//   "exampleScenario": "Customer sends message → AI analyzes intent → Provides personalized response → Updates CRM → Schedules follow-up",
//   "technicalRequirements": [
//     "Social media platform API access",
//     "AI/ML processing pipeline",
//     "Customer database integration", 
//     "Real-time webhook handling"
//   ],
//   "steps": [
//     {
//       "title": "Message Reception & Processing",
//       "description": "Capture and process incoming messages from all connected social media platforms with real-time monitoring",
//       "type": "trigger",
//       "estimatedTime": "< 1s",
//       "aiReasoning": "Essential entry point for all customer interactions - must be fast and reliable",
//       "businessImpact": "Ensures no customer message is missed, improving satisfaction and response rates",
//       "complexity": "low",
//       "details": [
//         "Real-time message monitoring across platforms",
//         "Automatic message classification and tagging",
//         "Duplicate detection and filtering",
//         "Initial data validation and sanitization"
//       ]
//     },
//     {
//       "title": "AI Intent Analysis & Classification", 
//       "description": "Advanced AI analyzes message content to understand customer intent, emotion, and urgency level",
//       "type": "analysis",
//       "estimatedTime": "2-3s",
//       "aiReasoning": "Critical for providing relevant and contextual responses that match customer needs",
//       "businessImpact": "Improves response accuracy by 94% and customer satisfaction by understanding true intent",
//       "complexity": "high",
//       "details": [
//         "Natural language processing with sentiment analysis",
//         "Intent classification with confidence scoring", 
//         "Urgency and priority assessment",
//         "Context extraction and keyword identification"
//       ]
//     },
//     {
//       "title": "Content Filtering & Validation",
//       "description": "Intelligent filtering system to block spam, inappropriate content, and validate message authenticity",
//       "type": "filter",
//       "estimatedTime": "1-2s", 
//       "aiReasoning": "Protects brand reputation and ensures quality interactions by filtering unwanted content",
//       "businessImpact": "Reduces manual moderation by 90% and protects brand from negative interactions",
//       "complexity": "medium",
//       "details": [
//         "Advanced spam detection algorithms",
//         "Content moderation with custom rules",
//         "Authenticity verification checks",
//         "Priority scoring and routing logic"
//       ]
//     },
//     {
//       "title": "Customer Data Enrichment",
//       "description": "Enhance customer profile with data from CRM, previous interactions, and external sources",
//       "type": "integration",
//       "estimatedTime": "2-4s",
//       "aiReasoning": "Enables personalized responses by understanding customer history and preferences",
//       "businessImpact": "Increases conversion rates by 40% through personalized customer experiences",
//       "complexity": "medium", 
//       "details": [
//         "CRM data synchronization and lookup",
//         "Purchase history and behavior analysis",
//         "Social profile enrichment",
//         "Preference and interest mapping"
//       ]
//     },
//     {
//       "title": "Intelligent Response Generation",
//       "description": "AI generates personalized, brand-consistent responses based on customer context and business rules",
//       "type": "response",
//       "estimatedTime": "1-2s",
//       "aiReasoning": "Provides immediate value to customers while maintaining consistent brand voice and messaging",
//       "businessImpact": "Reduces response time from hours to seconds, improving customer satisfaction by 85%",
//       "complexity": "high",
//       "details": [
//         "Brand voice consistency engine",
//         "Dynamic personalization based on customer data",
//         "Multi-language support and localization", 
//         "Template optimization and A/B testing"
//       ]
//     },
//     {
//       "title": "Human Escalation Assessment",
//       "description": "Smart routing system determines when human intervention is needed based on complexity and sentiment",
//       "type": "routing",
//       "estimatedTime": "< 1s",
//       "aiReasoning": "Ensures complex issues receive appropriate human attention while maximizing automation efficiency",
//       "businessImpact": "Optimizes agent workload by routing only cases that require human expertise",
//       "complexity": "medium",
//       "details": [
//         "Complexity assessment algorithms",
//         "Sentiment-based escalation triggers",
//         "Agent availability and skill matching",
//         "Queue management and priority routing"
//       ]
//     },
//     {
//       "title": "Payment Processing Integration", 
//       "description": "Seamless payment processing for quick purchases and subscription management",
//       "type": "payment",
//       "estimatedTime": "3-5s",
//       "aiReasoning": "Enables immediate revenue generation by allowing customers to purchase directly through conversation",
//       "businessImpact": "Increases conversion rates by 60% through frictionless payment experiences",
//       "complexity": "high",
//       "details": [
//         "Secure payment gateway integration",
//         "Multiple payment method support",
//         "Subscription and recurring billing",
//         "Fraud detection and prevention"
//       ]
//     },
//     {
//       "title": "CRM Integration & Data Sync",
//       "description": "Comprehensive CRM updates including contact information, interaction history, and task creation",
//       "type": "storage",
//       "estimatedTime": "2-4s", 
//       "aiReasoning": "Maintains comprehensive customer interaction history for sales and support teams",
//       "businessImpact": "Improves sales follow-up effectiveness by 70% through complete interaction tracking",
//       "complexity": "medium",
//       "details": [
//         "Real-time CRM data synchronization",
//         "Automated task and opportunity creation",
//         "Contact timeline and interaction logging",
//         "Sales pipeline and lead scoring updates"
//       ]
//     },
//     {
//       "title": "Follow-up Sequence Automation",
//       "description": "Intelligent follow-up scheduling based on customer journey stage and interaction outcomes",
//       "type": "automation", 
//       "estimatedTime": "1-2s",
//       "aiReasoning": "Maximizes engagement and conversion opportunities through strategic follow-up timing",
//       "businessImpact": "Increases customer lifetime value by 45% through optimized follow-up sequences", 
//       "complexity": "medium",
//       "details": [
//         "Journey-based follow-up scheduling",
//         "Conditional logic and trigger events",
//         "Multi-channel follow-up coordination",
//         "Performance tracking and optimization"
//       ]
//     },
//     {
//       "title": "Analytics & Performance Monitoring",
//       "description": "Comprehensive analytics tracking workflow performance, customer satisfaction, and business metrics",
//       "type": "validation",
//       "estimatedTime": "1-3s",
//       "aiReasoning": "Enables data-driven optimization and continuous improvement of automation workflows",
//       "businessImpact": "Provides actionable insights for 25% continuous improvement in automation performance",
//       "complexity": "medium",
//       "details": [
//         "Real-time performance dashboard",
//         "Customer satisfaction scoring",
//         "Conversion and engagement analytics", 
//         "Automated reporting and alerts"
//       ]
//     }
//   ],
//   "metrics": {
//     "automationRate": "92%",
//     "responseTime": "< 2 seconds",
//     "accuracy": "94%", 
//     "scalability": "Enterprise"
//   }
// }`

//     const result = await model.generateContent(prompt)
//     const response = await result.response
//     const text = response.text()

//     // Parse the JSON response
//     let workflowData
//     try {
//       // Clean the response to extract JSON
//       const jsonMatch = text.match(/\{[\s\S]*\}/)
//       if (jsonMatch) {
//         workflowData = JSON.parse(jsonMatch[0])
//       } else {
//         throw new Error('No JSON found in response')
//       }
//     } catch (error) {
//       console.error('JSON parsing error:', error)
//       // Fallback workflow data
//       workflowData = {
//         title: `${businessInfo.businessName} AI Social Media Automation`,
//         description: `Enterprise-grade automation workflow for ${selectedChannels.join(', ')} platforms`,
//         estimatedBuildTime: "2-4 weeks",
//         complexity: "Enterprise",
//         estimatedCost: "$500-2000/month", 
//         roi: "300-500% within 6 months",
//         benefits: [
//           "95% reduction in response time",
//           "24/7 automated customer engagement",
//           "Intelligent sentiment analysis and routing",
//           "Seamless human handoff when needed", 
//           "Real-time analytics and insights",
//           "Scalable across multiple platforms"
//         ],
//         exampleScenario: "Customer sends message → AI analyzes intent → Provides personalized response → Updates CRM → Schedules follow-up",
//         technicalRequirements: [
//           "Social media platform API access",
//           "AI/ML processing pipeline",
//           "Customer database integration",
//           "Real-time webhook handling",
//           "Analytics dashboard setup"
//         ],
//         steps: [], // Will use fallback steps
//         metrics: {
//           automationRate: "92%",
//           responseTime: "< 2 seconds",
//           accuracy: "94%",
//           scalability: "Enterprise"
//         }
//       }
//     }

//     return NextResponse.json({
//       success: true,
//       workflowData,
//       generatedAt: new Date().toISOString(),
//       aiProvider: "Google Gemini",
//       processingTime: Date.now() - Date.now()
//     })

//   } catch (error) {
//     console.error('Gemini API error:', error)
//     return NextResponse.json(
//       { 
//         success: false, 
//         error: 'AI workflow generation failed',
//         details: error instanceof Error ? error.message : 'Unknown error',
//         aiProvider: "Google Gemini"
//       },
//       { status: 500 }
//     )
//   }
// }



import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import OpenAI from 'openai'

// Initialize both APIs for fallback
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY!,
  baseURL: 'https://api.deepseek.com/v1'
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { systemPrompt, userRequest, businessInfo, selectedChannels, automationFeatures } = body

    // Try Gemini Flash first (lower quota usage)
    try {
      console.log('Attempting Gemini Flash...')
      const result = await generateWithGemini(systemPrompt, userRequest, businessInfo, selectedChannels, automationFeatures)
      return NextResponse.json({
        success: true,
        workflowData: result,
        generatedAt: new Date().toISOString(),
        aiProvider: "Google Gemini Flash"
      })
    } catch (geminiError) {
      console.log('Gemini failed, trying DeepSeek...', geminiError)
      
      // Fallback to DeepSeek
      try {
        const result = await generateWithDeepSeek(systemPrompt, userRequest, businessInfo, selectedChannels, automationFeatures)
        return NextResponse.json({
          success: true,
          workflowData: result,
          generatedAt: new Date().toISOString(),
          aiProvider: "DeepSeek (Fallback)"
        })
      } catch (deepseekError) {
        console.log('DeepSeek failed, using fallback workflow...', deepseekError)
        
        // Ultimate fallback - generate a good default workflow
        const result = generateFallbackWorkflow(businessInfo, selectedChannels, automationFeatures)
        return NextResponse.json({
          success: true,
          workflowData: result,
          generatedAt: new Date().toISOString(),
          aiProvider: "Intelligent Fallback"
        })
      }
    }

  } catch (error) {
    console.error('Complete API failure:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'AI workflow generation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

async function generateWithGemini(systemPrompt: string, userRequest: string, businessInfo: any, selectedChannels: string[], automationFeatures: string[]) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) // Using Flash model for lower quota

  const prompt = `Create a social media automation workflow for ${businessInfo.businessName}.

Business: ${businessInfo.businessName} (${businessInfo.businessType})
Platforms: ${selectedChannels.join(', ')}
Features: ${automationFeatures.join(', ')}
Request: ${userRequest}

Generate 8-10 workflow steps. Return ONLY valid JSON:

{
  "title": "Workflow Title",
  "description": "Detailed description", 
  "estimatedBuildTime": "2-4 weeks",
  "complexity": "Enterprise",
  "estimatedCost": "$500-2000/month",
  "roi": "300-500% within 6 months",
  "benefits": ["benefit1", "benefit2"],
  "exampleScenario": "Detailed scenario",
  "technicalRequirements": ["requirement1", "requirement2"],
  "steps": [
    {
      "title": "Step Title",
      "description": "Detailed description",
      "type": "trigger|analysis|filter|response|routing|storage|automation|payment|communication",
      "estimatedTime": "1-2s",
      "aiReasoning": "Why this step is important",
      "businessImpact": "Business impact",
      "complexity": "low|medium|high",
      "details": ["detail1", "detail2"]
    }
  ],
  "metrics": {
    "automationRate": "92%",
    "responseTime": "< 2 seconds", 
    "accuracy": "94%",
    "scalability": "Enterprise"
  }
}`

  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()

  // Parse JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON in Gemini response')
  
  return JSON.parse(jsonMatch[0])
}

async function generateWithDeepSeek(systemPrompt: string, userRequest: string, businessInfo: any, selectedChannels: string[], automationFeatures: string[]) {
  const completion = await deepseek.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      {
        role: "system",
        content: "You are a workflow automation expert. Create detailed social media automation workflows. Return only valid JSON."
      },
      {
        role: "user", 
        content: `Create workflow for ${businessInfo.businessName} (${businessInfo.businessType}) on ${selectedChannels.join(', ')} with ${automationFeatures.join(', ')}. Request: ${userRequest}`
      }
    ],
    temperature: 0.7,
    max_tokens: 3000,
    response_format: { type: "json_object" }
  })

  const aiResponse = completion.choices[0]?.message?.content
  if (!aiResponse) throw new Error('No DeepSeek response')
  
  return JSON.parse(aiResponse)
}

function generateFallbackWorkflow(businessInfo: any, selectedChannels: string[], automationFeatures: string[]) {
  return {
    title: `${businessInfo.businessName} Social Media Automation`,
    description: `Enterprise automation workflow for ${selectedChannels.join(', ')} platforms`,
    estimatedBuildTime: "2-3 weeks",
    complexity: "Enterprise",
    estimatedCost: "$600-1800/month",
    roi: "350-450% within 6 months",
    benefits: [
      "95% reduction in response time",
      "24/7 automated customer engagement",
      "Intelligent sentiment analysis",
      "Seamless human handoff", 
      "Real-time analytics and insights"
    ],
    exampleScenario: "Customer sends message → AI analyzes intent → Provides personalized response → Updates CRM → Schedules follow-up",
    technicalRequirements: [
      "Social media platform API access",
      "AI/ML processing pipeline",
      "Customer database integration",
      "Real-time webhook handling"
    ],
    steps: [
      {
        title: "Multi-Platform Message Reception",
        description: "Centralized capture of messages from all connected social media platforms",
        type: "trigger",
        estimatedTime: "< 1s",
        aiReasoning: "Critical entry point that must handle all incoming customer communications reliably",
        businessImpact: "Ensures no customer message is missed, improving satisfaction rates",
        complexity: "medium",
        details: [
          "Real-time webhook integration",
          "Message deduplication and normalization", 
          "Platform-specific formatting handling",
          "High-volume queue management"
        ]
      },
      {
        title: "AI Intent & Sentiment Analysis",
        description: "Advanced AI processing to understand customer intent, emotion, and urgency",
        type: "analysis",
        estimatedTime: "2-3s", 
        aiReasoning: "Understanding customer intent enables contextually appropriate responses",
        businessImpact: "Improves response relevance by 94% and customer satisfaction",
        complexity: "high",
        details: [
          "Natural language processing",
          "Intent classification with confidence scoring",
          "Sentiment analysis (positive/negative/neutral)",
          "Urgency and priority assessment"
        ]
      },
      {
        title: "Smart Content Filtering",
        description: "Intelligent filtering for spam detection and content moderation",
        type: "filter",
        estimatedTime: "1-2s",
        aiReasoning: "Protects brand reputation while ensuring legitimate messages are processed",
        businessImpact: "Reduces manual moderation by 90% and maintains brand safety",
        complexity: "medium",
        details: [
          "Machine learning spam detection",
          "Content appropriateness scoring", 
          "Security threat identification",
          "Brand safety rule enforcement"
        ]
      },
      {
        title: "Customer Profile Enhancement", 
        description: "Enrich customer data by syncing with CRM and external data sources",
        type: "integration",
        estimatedTime: "2-4s",
        aiReasoning: "Complete customer context enables personalized responses and better service",
        businessImpact: "Increases personalization effectiveness by 70%",
        complexity: "high",
        details: [
          "Real-time CRM data synchronization",
          "Social profile enrichment",
          "Purchase history integration",
          "Customer segmentation updates"
        ]
      },
      {
        title: "Dynamic Response Generation",
        description: "AI-powered response generation with brand voice consistency",
        type: "response", 
        estimatedTime: "1-2s",
        aiReasoning: "Provides immediate, personalized value while maintaining brand consistency",
        businessImpact: "Reduces response time from hours to seconds", 
        complexity: "high",
        details: [
          "Brand voice consistency engine",
          "Dynamic content personalization",
          "Multi-language support",
          "Response optimization and testing"
        ]
      },
      {
        title: "Intelligent Human Escalation",
        description: "Smart routing to determine when human intervention is needed",
        type: "routing",
        estimatedTime: "< 1s",
        aiReasoning: "Optimizes resource allocation by escalating only complex cases",
        businessImpact: "Improves agent efficiency by 60% while ensuring quality service",
        complexity: "medium", 
        details: [
          "Complexity scoring algorithms",
          "Customer value assessment",
          "Agent skill matching",
          "SLA and queue management"
        ]
      },
      {
        title: "Payment Processing Integration",
        description: "Seamless payment handling for direct purchases and subscriptions", 
        type: "payment",
        estimatedTime: "3-5s",
        aiReasoning: "Enables immediate revenue capture through conversational commerce",
        businessImpact: "Increases conversion rates by 65% through frictionless payments",
        complexity: "high",
        details: [
          "Multi-gateway payment processing",
          "Subscription management",
          "Fraud prevention and security",
          "Payment tracking and reconciliation"
        ]
      },
      {
        title: "Comprehensive Data Synchronization",
        description: "Complete sync of interaction data across all business systems",
        type: "storage",
        estimatedTime: "2-4s",
        aiReasoning: "Maintains complete audit trail and enables sales team effectiveness",
        businessImpact: "Improves follow-up effectiveness by 75%",
        complexity: "medium",
        details: [
          "Multi-system data synchronization", 
          "Automated task and opportunity creation",
          "Interaction timeline maintenance",
          "Custom workflow triggers"
        ]
      },
      {
        title: "Smart Follow-up Automation",
        description: "Intelligent scheduling of follow-up communications based on customer behavior",
        type: "automation",
        estimatedTime: "1-2s",
        aiReasoning: "Maximizes customer lifetime value through strategic engagement timing",
        businessImpact: "Increases retention by 50% and upsell opportunities by 40%",
        complexity: "medium",
        details: [
          "Behavioral trigger-based scheduling",
          "Multi-channel coordination",
          "Personalized content delivery", 
          "Performance tracking and optimization"
        ]
      },
      {
        title: "Real-time Analytics & Reporting",
        description: "Comprehensive monitoring and analytics for continuous optimization",
        type: "validation",
        estimatedTime: "1-3s", 
        aiReasoning: "Enables data-driven optimization and business growth insights",
        businessImpact: "Provides insights that improve performance by 30% monthly",
        complexity: "medium",
        details: [
          "Real-time performance dashboards",
          "Customer satisfaction tracking",
          "ROI and conversion analytics",
          "Automated reporting systems"
        ]
      }
    ],
    metrics: {
      automationRate: "93%",
      responseTime: "< 2 seconds",
      accuracy: "94%", 
      scalability: "Enterprise"
    }
  }
}