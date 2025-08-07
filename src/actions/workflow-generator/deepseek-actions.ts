// 'use server'

// interface DeepSeekRequest {
//   action: "initial" | "refine"
//   businessInfo: {
//     businessName: string
//     businessType: string
//     description?: string
//     website?: string
//     phone?: string
//     email?: string
//   }
//   selectedIntegrations: string[]
//   selectedOperations: Record<string, string[]>
//   selectedGoals: string[]
//   workflowRequest: string
//   instructions?: string
//   currentWorkflow?: {
//     title?: string
//     description?: string
//     steps?: any[]
//   }
// }

// interface DeepSeekResponse {
//   success: boolean
//   workflowData?: any
//   error?: string
// }

// const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

// const SUPPORTED_INTEGRATIONS = [
//   {
//     id: "airtable",
//     name: "Airtable",
//     description: "Cloud-based database for storing and managing customer data, leads, and interactions",
//   },
//   {
//     id: "google-sheets",
//     name: "Google Sheets",
//     description: "Spreadsheet platform for data tracking, reporting, and team collaboration",
//   },
//   {
//     id: "mailchimp",
//     name: "Mailchimp",
//     description: "Email marketing platform for newsletters, campaigns, and audience management",
//   },
//   {
//     id: "notion",
//     name: "Notion",
//     description: "All-in-one workspace for notes, databases, and team collaboration",
//   },
// ]

// const instagramGoals = [
//   { id: "lead-generation", label: "Lead Generation from DMs", description: "Capture and qualify leads from Instagram conversations" },
//   { id: "customer-support", label: "Customer Support Automation", description: "Provide instant support and resolve common issues" },
//   { id: "product-inquiries", label: "Product Inquiry Handling", description: "Answer product questions and share information" },
//   { id: "appointment-booking", label: "Appointment/Consultation Booking", description: "Schedule meetings and consultations automatically" },
//   { id: "content-engagement", label: "Content Engagement Responses", description: "Respond to comments and engagement on posts" },
//   { id: "influencer-outreach", label: "Influencer/Partnership Outreach", description: "Manage collaboration and partnership requests" },
// ]

// export async function generateWorkflowWithDeepSeek(request: DeepSeekRequest): Promise<DeepSeekResponse> {
//   try {
//     // Check for API key
//     if (!process.env.DEEPSEEK_API_KEY) {
//       return {
//         success: false,
//         error: "DEEPSEEK_API_KEY environment variable is missing. Please add it to your .env.local file."
//       }
//     }

//     // Prepare context for AI
//     const selectedIntegrationDetails = request.selectedIntegrations.map(id => 
//       SUPPORTED_INTEGRATIONS.find(int => int.id === id)
//     ).filter(Boolean)

//     const selectedGoalDetails = request.selectedGoals.map(id => 
//       instagramGoals.find(goal => goal.id === id)
//     ).filter(Boolean)

//     const systemPrompt = `You are an expert Instagram automation workflow designer specializing in Voiceflow implementations. Create practical, actionable workflows that businesses can actually implement.

// Key Requirements:
// - Focus on Instagram DM automation specifically
// - Each step must be implementable in Voiceflow
// - Use only the provided integrations (max 1 per step, no duplicates)
// - Create 4-7 logical workflow steps
// - Ensure steps flow logically from one to the next
// - Make it practical for real business use

// Available Integrations: ${selectedIntegrationDetails.map(int => `${int?.name} - ${int?.description}`).join('; ')}

// Return ONLY valid JSON in this exact format:
// {
//   "title": "specific workflow title",
//   "description": "clear workflow description",
//   "steps": [
//     {
//       "title": "specific step title",
//       "description": "detailed step description",
//       "type": "trigger|analysis|filter|response|integration|storage",
//       "inputs": ["specific input 1", "specific input 2"],
//       "outputs": ["specific output 1", "specific output 2"],
//       "details": ["implementation detail 1", "implementation detail 2", "implementation detail 3"],
//       "voiceflowBlock": "specific Voiceflow block type",
//       "businessImpact": "specific business impact explanation",
//       "estimatedTime": "execution time",
//       "needsIntegration": true/false,
//       "complexity": "low/medium/high"
//     }
//   ],
//   "benefits": ["specific benefit 1", "specific benefit 2", "specific benefit 3"],
//   "exampleScenario": "detailed example scenario"
// }`

//     const userPrompt = request.action === "initial" 
//       ? `Create a custom Instagram DM automation workflow for:

// Business: ${request.businessInfo.businessName} (${request.businessInfo.businessType})
// Description: ${request.businessInfo.description}

// User Requirements: "${request.workflowRequest}"

// Selected Goals: ${selectedGoalDetails.map(g => `${g?.label} - ${g?.description}`).join('; ')}

// Selected Integrations: ${selectedIntegrationDetails.map(int => `${int?.name} (Operations: ${request.selectedOperations[int?.id || '']?.join(', ') || 'all available'})`).join('; ')}

// Create a workflow that specifically addresses these requirements and uses the selected integrations strategically.`
//       : `Refine this existing Instagram automation workflow based on feedback:

// Current Workflow: ${request.currentWorkflow?.title} - ${request.currentWorkflow?.description}
// Current Steps: ${request.currentWorkflow?.steps?.map((s: any) => s.title).join(', ')}

// Refinement Request: "${request.instructions}"

// Update the workflow to address this feedback while maintaining Instagram focus and Voiceflow compatibility.`

//     // Direct API call to DeepSeek
//     const response = await fetch(DEEPSEEK_API_URL, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: 'deepseek-chat',
//         messages: [
//           {
//             role: 'system',
//             content: systemPrompt
//           },
//           {
//             role: 'user',
//             content: userPrompt
//           }
//         ],
//         temperature: 0.7,
//         max_tokens: 2000,
//       }),
//     })

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}))
//       return {
//         success: false,
//         error: `DeepSeek API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`
//       }
//     }

//     const data = await response.json()
//     const aiResponseText = data.choices?.[0]?.message?.content

//     if (!aiResponseText) {
//       return {
//         success: false,
//         error: "No response from DeepSeek AI"
//       }
//     }

//     // Parse AI response
//     const cleanedText = aiResponseText.replace(/\`\`\`json\n?|\n?\`\`\`/g, '').trim()
//     let aiResponse
    
//     try {
//       aiResponse = JSON.parse(cleanedText)
//     } catch (parseError) {
//       console.error("JSON parse error:", parseError)
//       console.error("Raw AI response:", aiResponseText)
//       return {
//         success: false,
//         error: "AI returned invalid response format"
//       }
//     }

//     return {
//       success: true,
//       workflowData: aiResponse
//     }

//   } catch (error) {
//     console.error("DeepSeek AI generation error:", error)
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "AI generation failed"
//     }
//   }
// }

'use server'

interface DeepSeekRequest {
  action: "initial" | "refine"
  businessInfo: {
    businessName: string
    businessType: string
    description?: string
    website?: string
    phone?: string
    email?: string
  }
  selectedIntegrations: string[]
  selectedOperations: Record<string, string[]>
  selectedGoals: string[]
  workflowRequest: string
  instructions?: string
  currentWorkflow?: {
    title?: string
    description?: string
    steps?: any[]
  }
}

interface DeepSeekResponse {
  success: boolean
  workflowData?: any
  error?: string
}

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

const SUPPORTED_INTEGRATIONS = [
  {
    id: "airtable",
    name: "Airtable",
    description: "Cloud-based database for storing and managing customer data, leads, and interactions",
  },
  {
    id: "google-sheets",
    name: "Google Sheets",
    description: "Spreadsheet platform for data tracking, reporting, and team collaboration",
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    description: "Email marketing platform for newsletters, campaigns, and audience management",
  },
  {
    id: "notion",
    name: "Notion",
    description: "All-in-one workspace for notes, databases, and team collaboration",
  },
]

const instagramGoals = [
  { id: "lead-generation", label: "Lead Generation from DMs", description: "Capture and qualify leads from Instagram conversations" },
  { id: "customer-support", label: "Customer Support Automation", description: "Provide instant support and resolve common issues" },
  { id: "product-inquiries", label: "Product Inquiry Handling", description: "Answer product questions and share information" },
  { id: "appointment-booking", label: "Appointment/Consultation Booking", description: "Schedule meetings and consultations automatically" },
  { id: "content-engagement", label: "Content Engagement Responses", description: "Respond to comments and engagement on posts" },
  { id: "influencer-outreach", label: "Influencer/Partnership Outreach", description: "Manage collaboration and partnership requests" },
]

export async function generateWorkflowWithDeepSeek(request: DeepSeekRequest): Promise<DeepSeekResponse> {
  console.log('Server action called with:', { 
    action: request.action, 
    hasApiKey: !!process.env.DEEPSEEK_API_KEY,
    workflowRequest: request.workflowRequest?.substring(0, 100) + '...'
  })

  try {
    // Check for API key first
    if (!process.env.DEEPSEEK_API_KEY) {
      console.error('DEEPSEEK_API_KEY is missing')
      return {
        success: false,
        error: "DEEPSEEK_API_KEY environment variable is missing. Please add it to your .env.local file."
      }
    }

    // Validate request
    if (!request.workflowRequest?.trim()) {
      return {
        success: false,
        error: "Workflow request is required"
      }
    }

    // Prepare context for AI
    const selectedIntegrationDetails = request.selectedIntegrations.map(id => 
      SUPPORTED_INTEGRATIONS.find(int => int.id === id)
    ).filter(Boolean)

    const selectedGoalDetails = request.selectedGoals.map(id => 
      instagramGoals.find(goal => goal.id === id)
    ).filter(Boolean)

    const systemPrompt = `You are an expert Instagram automation workflow designer specializing in Voiceflow implementations. Create practical, actionable workflows that businesses can actually implement.

Key Requirements:
- Focus on Instagram DM automation specifically
- Each step must be implementable in Voiceflow
- Use only the provided integrations (max 1 per step, no duplicates)
- Create 4-7 logical workflow steps
- Ensure steps flow logically from one to the next
- Make it practical for real business use

Available Integrations: ${selectedIntegrationDetails.map(int => `${int?.name} - ${int?.description}`).join('; ')}

Return ONLY valid JSON in this exact format:
{
  "title": "specific workflow title",
  "description": "clear workflow description",
  "steps": [
    {
      "title": "specific step title",
      "description": "detailed step description",
      "type": "trigger|analysis|filter|response|integration|storage",
      "inputs": ["specific input 1", "specific input 2"],
      "outputs": ["specific output 1", "specific output 2"],
      "details": ["implementation detail 1", "implementation detail 2", "implementation detail 3"],
      "voiceflowBlock": "specific Voiceflow block type",
      "businessImpact": "specific business impact explanation",
      "estimatedTime": "execution time",
      "needsIntegration": true/false,
      "complexity": "low/medium/high"
    }
  ],
  "benefits": ["specific benefit 1", "specific benefit 2", "specific benefit 3"],
  "exampleScenario": "detailed example scenario"
}`

    const userPrompt = request.action === "initial" 
      ? `Create a custom Instagram DM automation workflow for:

Business: ${request.businessInfo.businessName} (${request.businessInfo.businessType})
Description: ${request.businessInfo.description}

User Requirements: "${request.workflowRequest}"

Selected Goals: ${selectedGoalDetails.map(g => `${g?.label} - ${g?.description}`).join('; ')}

Selected Integrations: ${selectedIntegrationDetails.map(int => `${int?.name} (Operations: ${request.selectedOperations[int?.id || '']?.join(', ') || 'all available'})`).join('; ')}

Create a workflow that specifically addresses these requirements and uses the selected integrations strategically.`
      : `Refine this existing Instagram automation workflow based on feedback:

Current Workflow: ${request.currentWorkflow?.title} - ${request.currentWorkflow?.description}
Current Steps: ${request.currentWorkflow?.steps?.map((s: any) => s.title).join(', ')}

Refinement Request: "${request.instructions}"

Update the workflow to address this feedback while maintaining Instagram focus and Voiceflow compatibility.`

    console.log('Making API call to DeepSeek...')

    // Direct API call to DeepSeek
    const response = await fetch(DEEPSEEK_API_URL, {
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
        max_tokens: 2000,
      }),
    })

    console.log('DeepSeek API response status:', response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('DeepSeek API error:', errorData)
      return {
        success: false,
        error: `DeepSeek API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`
      }
    }

    const data = await response.json()
    console.log('DeepSeek API response received, processing...')
    
    const aiResponseText = data.choices?.[0]?.message?.content

    if (!aiResponseText) {
      console.error('No content in DeepSeek response:', data)
      return {
        success: false,
        error: "No response from DeepSeek AI"
      }
    }

    console.log('AI response text length:', aiResponseText.length)

    // Parse AI response
    const cleanedText = aiResponseText.replace(/\`\`\`json\n?|\n?\`\`\`/g, '').trim()
    let aiResponse
    
    try {
      aiResponse = JSON.parse(cleanedText)
      console.log('Successfully parsed AI response')
    } catch (parseError) {
      console.error("JSON parse error:", parseError)
      console.error("Raw AI response:", aiResponseText.substring(0, 500))
      return {
        success: false,
        error: "AI returned invalid response format. Please try again."
      }
    }

    // Validate the parsed response has required fields
    if (!aiResponse.title || !aiResponse.steps || !Array.isArray(aiResponse.steps)) {
      console.error('Invalid AI response structure:', aiResponse)
      return {
        success: false,
        error: "AI response missing required fields. Please try again."
      }
    }

    console.log('Returning successful response with', aiResponse.steps.length, 'steps')

    return {
      success: true,
      workflowData: aiResponse
    }

  } catch (error) {
    console.error("DeepSeek AI generation error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "AI generation failed. Please try again."
    }
  }
}
