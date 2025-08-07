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
//   console.log('Server action called with:', { 
//     action: request.action, 
//     hasApiKey: !!process.env.DEEPSEEK_API_KEY,
//     workflowRequest: request.workflowRequest?.substring(0, 100) + '...'
//   })

//   try {
//     // Check for API key first
//     if (!process.env.DEEPSEEK_API_KEY) {
//       console.error('DEEPSEEK_API_KEY is missing')
//       return {
//         success: false,
//         error: "DEEPSEEK_API_KEY environment variable is missing. Please add it to your .env.local file."
//       }
//     }

//     // Validate request
//     if (!request.workflowRequest?.trim()) {
//       return {
//         success: false,
//         error: "Workflow request is required"
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

//     console.log('Making API call to DeepSeek...')

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

//     console.log('DeepSeek API response status:', response.status)

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}))
//       console.error('DeepSeek API error:', errorData)
//       return {
//         success: false,
//         error: `DeepSeek API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`
//       }
//     }

//     const data = await response.json()
//     console.log('DeepSeek API response received, processing...')
    
//     const aiResponseText = data.choices?.[0]?.message?.content

//     if (!aiResponseText) {
//       console.error('No content in DeepSeek response:', data)
//       return {
//         success: false,
//         error: "No response from DeepSeek AI"
//       }
//     }

//     console.log('AI response text length:', aiResponseText.length)

//     // Parse AI response
//     const cleanedText = aiResponseText.replace(/\`\`\`json\n?|\n?\`\`\`/g, '').trim()
//     let aiResponse
    
//     try {
//       aiResponse = JSON.parse(cleanedText)
//       console.log('Successfully parsed AI response')
//     } catch (parseError) {
//       console.error("JSON parse error:", parseError)
//       console.error("Raw AI response:", aiResponseText.substring(0, 500))
//       return {
//         success: false,
//         error: "AI returned invalid response format. Please try again."
//       }
//     }

//     // Validate the parsed response has required fields
//     if (!aiResponse.title || !aiResponse.steps || !Array.isArray(aiResponse.steps)) {
//       console.error('Invalid AI response structure:', aiResponse)
//       return {
//         success: false,
//         error: "AI response missing required fields. Please try again."
//       }
//     }

//     console.log('Returning successful response with', aiResponse.steps.length, 'steps')

//     return {
//       success: true,
//       workflowData: aiResponse
//     }

//   } catch (error) {
//     console.error("DeepSeek AI generation error:", error)
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "AI generation failed. Please try again."
//     }
//   }
// }



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
// const REQUEST_TIMEOUT = 25000 // 25 seconds timeout

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

// // Create a timeout wrapper for fetch
// async function fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
//   const controller = new AbortController()
//   const timeoutId = setTimeout(() => controller.abort(), timeout)
  
//   try {
//     const response = await fetch(url, {
//       ...options,
//       signal: controller.signal,
//     })
//     clearTimeout(timeoutId)
//     return response
//   } catch (error) {
//     clearTimeout(timeoutId)
//     if (error instanceof Error && error.name === 'AbortError') {
//       throw new Error('Request timeout - DeepSeek API took too long to respond')
//     }
//     throw error
//   }
// }

// export async function generateWorkflowWithDeepSeek(request: DeepSeekRequest): Promise<DeepSeekResponse> {
//   console.log('Server action called with:', { 
//     action: request.action, 
//     hasApiKey: !!process.env.DEEPSEEK_API_KEY,
//     workflowRequest: request.workflowRequest?.substring(0, 100) + '...'
//   })

//   try {
//     // Check for API key first
//     if (!process.env.DEEPSEEK_API_KEY) {
//       console.error('DEEPSEEK_API_KEY is missing')
//       return {
//         success: false,
//         error: "DEEPSEEK_API_KEY environment variable is missing. Please add it to your .env.local file."
//       }
//     }

//     // Validate request
//     if (!request.workflowRequest?.trim()) {
//       return {
//         success: false,
//         error: "Workflow request is required"
//       }
//     }

//     // Prepare context for AI
//     const selectedIntegrationDetails = request.selectedIntegrations.map(id => 
//       SUPPORTED_INTEGRATIONS.find(int => int.id === id)
//     ).filter(Boolean)

//     const selectedGoalDetails = request.selectedGoals.map(id => 
//       instagramGoals.find(goal => goal.id === id)
//     ).filter(Boolean)

//     // Simplified and more focused system prompt
//     const systemPrompt = `You are an Instagram automation expert. Create a practical workflow with 4-6 steps.

// REQUIREMENTS:
// - Focus on Instagram DM automation
// - Each step needs: title, description, type, inputs, outputs, details (3 items), businessImpact, estimatedTime, complexity
// - Step types: trigger, analysis, filter, response, integration, storage
// - Use provided integrations strategically
// - Make it implementable in Voiceflow

// Available Integrations: ${selectedIntegrationDetails.map(int => int?.name).join(', ')}

// Return ONLY this JSON structure:
// {
//   "title": "workflow title",
//   "description": "workflow description", 
//   "steps": [
//     {
//       "title": "step title",
//       "description": "step description",
//       "type": "trigger|analysis|filter|response|integration|storage",
//       "inputs": ["input1", "input2"],
//       "outputs": ["output1", "output2"], 
//       "details": ["detail1", "detail2", "detail3"],
//       "voiceflowBlock": "Voiceflow block type",
//       "businessImpact": "business impact",
//       "estimatedTime": "< 2s",
//       "needsIntegration": true/false,
//       "complexity": "low|medium|high"
//     }
//   ],
//   "benefits": ["benefit1", "benefit2", "benefit3"],
//   "exampleScenario": "example scenario"
// }`

//     const userPrompt = request.action === "initial" 
//       ? `Create Instagram DM automation for:
// Business: ${request.businessInfo.businessName} (${request.businessInfo.businessType})
// Requirements: "${request.workflowRequest}"
// Goals: ${selectedGoalDetails.map(g => g?.label).join(', ')}
// Integrations: ${selectedIntegrationDetails.map(int => int?.name).join(', ')}`
//       : `Refine this workflow: ${request.currentWorkflow?.title}
// Feedback: "${request.instructions}"`

//     console.log('Making API call to DeepSeek...')

//     // Make API call with timeout
//     const response = await fetchWithTimeout(DEEPSEEK_API_URL, {
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
//         max_tokens: 1500, // Reduced for faster response
//         stream: false,
//       }),
//     }, REQUEST_TIMEOUT)

//     console.log('DeepSeek API response status:', response.status)

//     if (!response.ok) {
//       const errorText = await response.text().catch(() => 'Unknown error')
//       console.error('DeepSeek API error:', errorText)
//       return {
//         success: false,
//         error: `DeepSeek API error (${response.status}): ${errorText.substring(0, 200)}`
//       }
//     }

//     const data = await response.json()
//     console.log('DeepSeek API response received, processing...')
    
//     const aiResponseText = data.choices?.[0]?.message?.content

//     if (!aiResponseText) {
//       console.error('No content in DeepSeek response:', data)
//       return {
//         success: false,
//         error: "No response content from DeepSeek AI"
//       }
//     }

//     console.log('AI response text length:', aiResponseText.length)

//     // Parse AI response with better error handling
//     let cleanedText = aiResponseText.trim()
    
//     // Remove code block markers if present
//     if (cleanedText.startsWith('```json')) {
//       cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '')
//     } else if (cleanedText.startsWith('```')) {
//       cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '')
//     }
    
//     let aiResponse
    
//     try {
//       aiResponse = JSON.parse(cleanedText)
//       console.log('Successfully parsed AI response')
//     } catch (parseError) {
//       console.error("JSON parse error:", parseError)
//       console.error("Cleaned text:", cleanedText.substring(0, 500))
      
//       // Try to extract JSON from the response
//       const jsonMatch = cleanedText.match(/\{[\s\S]*\}/)
//       if (jsonMatch) {
//         try {
//           aiResponse = JSON.parse(jsonMatch[0])
//           console.log('Successfully extracted and parsed JSON from response')
//         } catch (secondParseError) {
//           return {
//             success: false,
//             error: "AI returned invalid JSON format. Please try again with a simpler request."
//           }
//         }
//       } else {
//         return {
//           success: false,
//           error: "AI response doesn't contain valid JSON. Please try again."
//         }
//       }
//     }

//     // Validate the parsed response has required fields
//     if (!aiResponse.title || !aiResponse.steps || !Array.isArray(aiResponse.steps)) {
//       console.error('Invalid AI response structure:', aiResponse)
//       return {
//         success: false,
//         error: "AI response missing required fields. Please try again with more specific requirements."
//       }
//     }

//     // Ensure we have at least some steps
//     if (aiResponse.steps.length === 0) {
//       return {
//         success: false,
//         error: "AI didn't generate any workflow steps. Please try again with more detailed requirements."
//       }
//     }

//     console.log('Returning successful response with', aiResponse.steps.length, 'steps')

//     return {
//       success: true,
//       workflowData: aiResponse
//     }

//   } catch (error) {
//     console.error("DeepSeek AI generation error:", error)
    
//     // Handle specific error types
//     if (error instanceof Error) {
//       if (error.message.includes('timeout')) {
//         return {
//           success: false,
//           error: "Request timed out. DeepSeek API is taking too long to respond. Please try again."
//         }
//       }
//       if (error.message.includes('fetch')) {
//         return {
//           success: false,
//           error: "Network error connecting to DeepSeek API. Please check your connection and try again."
//         }
//       }
//       return {
//         success: false,
//         error: `AI generation failed: ${error.message}`
//       }
//     }
    
//     return {
//       success: false,
//       error: "AI generation failed due to an unknown error. Please try again."
//     }
//   }
// }


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

// export interface DeepSeekResponse {
//   success: boolean
//   workflowData?: any
//   error?: string
// }

// const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'
// const REQUEST_TIMEOUT = 20000 // Reduced to 20 seconds
// const MAX_RETRIES = 2

// const SUPPORTED_INTEGRATIONS = [
//   {
//     id: "airtable",
//     name: "Airtable",
//     description: "Database for customer data",
//   },
//   {
//     id: "google-sheets",
//     name: "Google Sheets", 
//     description: "Spreadsheet for data tracking",
//   },
//   {
//     id: "mailchimp",
//     name: "Mailchimp",
//     description: "Email marketing platform",
//   },
//   {
//     id: "notion",
//     name: "Notion",
//     description: "Workspace for collaboration",
//   },
// ]

// const instagramGoals = [
//   { id: "lead-generation", label: "Lead Generation" },
//   { id: "customer-support", label: "Customer Support" },
//   { id: "product-inquiries", label: "Product Inquiries" },
//   { id: "appointment-booking", label: "Appointment Booking" },
//   { id: "content-engagement", label: "Content Engagement" },
//   { id: "influencer-outreach", label: "Influencer Outreach" },
// ]

// // Timeout wrapper with retry logic
// async function fetchWithRetry(url: string, options: RequestInit, maxRetries: number = MAX_RETRIES): Promise<Response> {
//   let lastError: Error

//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       const controller = new AbortController()
//       const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)
      
//       const response = await fetch(url, {
//         ...options,
//         signal: controller.signal,
//       })
      
//       clearTimeout(timeoutId)
      
//       if (response.ok) {
//         return response
//       }
      
//       // If it's a rate limit or server error, retry
//       if (response.status === 429 || response.status >= 500) {
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`)
//       }
      
//       // For other errors, don't retry
//       return response
      
//     } catch (error) {
//       lastError = error instanceof Error ? error : new Error('Unknown error')
      
//       if (error instanceof Error && error.name === 'AbortError') {
//         lastError = new Error(`Request timeout (attempt ${attempt}/${maxRetries})`)
//       }
      
//       // Don't retry on the last attempt
//       if (attempt === maxRetries) {
//         break
//       }
      
//       // Exponential backoff: wait 1s, then 2s
//       const delay = Math.pow(2, attempt - 1) * 1000
//       console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`)
//       await new Promise(resolve => setTimeout(resolve, delay))
//     }
//   }
  
//   throw lastError
// }

// export async function generateWorkflowWithDeepSeek(request: DeepSeekRequest): Promise<DeepSeekResponse> {
//   console.log('Server action called:', { 
//     action: request.action, 
//     hasApiKey: !!process.env.DEEPSEEK_API_KEY,
//     requestLength: request.workflowRequest?.length
//   })

//   try {
//     // Validate API key
//     if (!process.env.DEEPSEEK_API_KEY) {
//       return {
//         success: false,
//         error: "API key missing. Please configure DEEPSEEK_API_KEY."
//       }
//     }

//     // Validate request
//     if (!request.workflowRequest?.trim()) {
//       return {
//         success: false,
//         error: "Workflow request is required"
//       }
//     }

//     // Get selected integration names
//     const integrationNames = request.selectedIntegrations
//       .map(id => SUPPORTED_INTEGRATIONS.find(int => int.id === id)?.name)
//       .filter(Boolean)
//       .join(', ')

//     // Get selected goal labels
//     const goalLabels = request.selectedGoals
//       .map(id => instagramGoals.find(goal => goal.id === id)?.label)
//       .filter(Boolean)
//       .join(', ')

//     // Ultra-simplified system prompt for faster processing
//     const systemPrompt = `Create Instagram DM automation workflow. Return ONLY valid JSON:
// {
//   "title": "workflow name",
//   "description": "brief description",
//   "steps": [
//     {
//       "title": "step name",
//       "description": "what it does",
//       "type": "trigger|analysis|filter|response|integration|storage",
//       "inputs": ["input1"],
//       "outputs": ["output1"],
//       "details": ["detail1", "detail2"],
//       "voiceflowBlock": "block type",
//       "businessImpact": "impact",
//       "estimatedTime": "< 2s",
//       "needsIntegration": true,
//       "complexity": "low"
//     }
//   ],
//   "benefits": ["benefit1", "benefit2"],
//   "exampleScenario": "example"
// }`

//     // Simplified user prompt
//     const userPrompt = request.action === "initial" 
//       ? `Business: ${request.businessInfo.businessName}
// Request: "${request.workflowRequest}"
// Goals: ${goalLabels}
// Integrations: ${integrationNames}
// Create 4-5 steps for Instagram DM automation.`
//       : `Modify workflow: ${request.currentWorkflow?.title}
// Changes: "${request.instructions}"`

//     console.log('Making optimized API call...')

//     // Make API call with retry logic
//     const response = await fetchWithRetry(DEEPSEEK_API_URL, {
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
//         temperature: 0.3, // Reduced for more consistent output
//         max_tokens: 1000, // Further reduced for speed
//         stream: false,
//       }),
//     })

//     if (!response.ok) {
//       const errorText = await response.text().catch(() => 'Unknown error')
//       return {
//         success: false,
//         error: `API error (${response.status}): ${errorText.substring(0, 100)}`
//       }
//     }

//     const data = await response.json()
//     const aiResponseText = data.choices?.[0]?.message?.content

//     if (!aiResponseText) {
//       return {
//         success: false,
//         error: "No response from AI. Please try again."
//       }
//     }

//     // Fast JSON parsing
//     let cleanedText = aiResponseText.trim()
    
//     // Remove markdown if present
//     if (cleanedText.includes('\`\`\`')) {
//       const jsonMatch = cleanedText.match(/\`\`\`(?:json)?\s*(\{[\s\S]*?\})\s*\`\`\`/)
//       if (jsonMatch) {
//         cleanedText = jsonMatch[1]
//       }
//     }
    
//     let aiResponse
//     try {
//       aiResponse = JSON.parse(cleanedText)
//     } catch (parseError) {
//       // Try to extract JSON object
//       const jsonMatch = cleanedText.match(/\{[\s\S]*\}/)
//       if (jsonMatch) {
//         try {
//           aiResponse = JSON.parse(jsonMatch[0])
//         } catch {
//           return {
//             success: false,
//             error: "AI returned invalid format. Please try with simpler requirements."
//           }
//         }
//       } else {
//         return {
//           success: false,
//           error: "AI response format error. Please try again."
//         }
//       }
//     }

//     // Quick validation
//     if (!aiResponse.title || !aiResponse.steps || !Array.isArray(aiResponse.steps) || aiResponse.steps.length === 0) {
//       return {
//         success: false,
//         error: "AI generated incomplete workflow. Please try again with more specific requirements."
//       }
//     }

//     console.log('Successfully generated workflow with', aiResponse.steps.length, 'steps')

//     return {
//       success: true,
//       workflowData: aiResponse
//     }

//   } catch (error) {
//     console.error("Generation error:", error)
    
//     if (error instanceof Error) {
//       if (error.message.includes('timeout')) {
//         return {
//           success: false,
//           error: "Request timed out. The AI service is overloaded. Please try again in a moment."
//         }
//       }
//       if (error.message.includes('fetch') || error.message.includes('network')) {
//         return {
//           success: false,
//           error: "Network error. Please check your connection and try again."
//         }
//       }
//       return {
//         success: false,
//         error: `Generation failed: ${error.message.substring(0, 100)}`
//       }
//     }
    
//     return {
//       success: false,
//       error: "Unknown error occurred. Please try again."
//     }
//   }
// }









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

// export interface DeepSeekResponse {
//   success: boolean
//   workflowData?: any
//   error?: string
// }

// const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'
// const REQUEST_TIMEOUT = 30000 // Increased to 30 seconds
// const MAX_RETRIES = 3 // Increased retries
// const BASE_DELAY = 1000 // Base delay for exponential backoff

// const SUPPORTED_INTEGRATIONS = [
//   {
//     id: "airtable",
//     name: "Airtable",
//     description: "Database for customer data",
//   },
//   {
//     id: "google-sheets",
//     name: "Google Sheets", 
//     description: "Spreadsheet for data tracking",
//   },
//   {
//     id: "mailchimp",
//     name: "Mailchimp",
//     description: "Email marketing platform",
//   },
//   {
//     id: "notion",
//     name: "Notion",
//     description: "Workspace for collaboration",
//   },
// ]

// const instagramGoals = [
//   { id: "lead-generation", label: "Lead Generation" },
//   { id: "customer-support", label: "Customer Support" },
//   { id: "product-inquiries", label: "Product Inquiries" },
//   { id: "appointment-booking", label: "Appointment Booking" },
//   { id: "content-engagement", label: "Content Engagement" },
//   { id: "influencer-outreach", label: "Influencer Outreach" },
// ]

// // Improved timeout wrapper with better error handling and retry logic
// async function fetchWithRetry(url: string, options: RequestInit, maxRetries: number = MAX_RETRIES): Promise<Response> {
//   let lastError: Error = new Error('Request failed') // Initialize to fix TypeScript error

//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       console.log(`Making API request (attempt ${attempt}/${maxRetries})...`)
      
//       const controller = new AbortController()
//       const timeoutId = setTimeout(() => {
//         controller.abort()
//         console.log(`Request timeout after ${REQUEST_TIMEOUT}ms`)
//       }, REQUEST_TIMEOUT)
      
//       const response = await fetch(url, {
//         ...options,
//         signal: controller.signal,
//       })
      
//       clearTimeout(timeoutId)
      
//       console.log(`API response status: ${response.status}`)
      
//       if (response.ok) {
//         return response
//       }
      
//       // If it's a rate limit, server error, or gateway timeout, retry
//       if (response.status === 429 || response.status >= 500 || response.status === 408) {
//         const errorMessage = await response.text().catch(() => 'Unknown error')
//         lastError = new Error(`HTTP ${response.status}: ${errorMessage.substring(0, 200)}`)
//         console.log(`Retryable error on attempt ${attempt}: ${lastError.message}`)
        
//         // Don't retry on the last attempt
//         if (attempt < maxRetries) {
//           const delay = BASE_DELAY * Math.pow(2, attempt - 1) // Exponential backoff: 1s, 2s, 4s
//           console.log(`Waiting ${delay}ms before retry...`)
//           await new Promise(resolve => setTimeout(resolve, delay))
//           continue
//         }
//       }
      
//       // For other errors (4xx client errors), don't retry but return the response
//       return response
      
//     } catch (error) {
//       const currentError = error instanceof Error ? error : new Error('Unknown error')
      
//       if (currentError.name === 'AbortError') {
//         lastError = new Error(`Request timeout after ${REQUEST_TIMEOUT / 1000} seconds (attempt ${attempt}/${maxRetries})`)
//         console.log(`Timeout on attempt ${attempt}`)
//       } else if (currentError.message.includes('fetch') || currentError.message.includes('network')) {
//         lastError = new Error(`Network error: ${currentError.message} (attempt ${attempt}/${maxRetries})`)
//         console.log(`Network error on attempt ${attempt}: ${currentError.message}`)
//       } else {
//         lastError = currentError
//         console.log(`Error on attempt ${attempt}: ${currentError.message}`)
//       }
      
//       // Don't retry on the last attempt
//       if (attempt < maxRetries) {
//         const delay = BASE_DELAY * Math.pow(2, attempt - 1)
//         console.log(`Waiting ${delay}ms before retry...`)
//         await new Promise(resolve => setTimeout(resolve, delay))
//       }
//     }
//   }
  
//   throw lastError
// }

// // Optimized JSON parsing with better error handling
// function parseAIResponse(responseText: string): any {
//   if (!responseText?.trim()) {
//     throw new Error('Empty response from AI')
//   }

//   let cleanedText = responseText.trim()
  
//   // Remove markdown code blocks if present
//   if (cleanedText.includes('```')) {
//     const jsonMatch = cleanedText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/)
//     if (jsonMatch) {
//       cleanedText = jsonMatch[1].trim()
//     }
//   }
  
//   // Try direct parsing first
//   try {
//     return JSON.parse(cleanedText)
//   } catch (parseError) {
//     console.log('Direct JSON parse failed, trying to extract JSON object...')
    
//     // Try to find and extract JSON object
//     const jsonMatch = cleanedText.match(/\{[\s\S]*\}/)
//     if (jsonMatch) {
//       try {
//         return JSON.parse(jsonMatch[0])
//       } catch (extractError) {
//         console.log('JSON extraction also failed')
//         throw new Error(`Invalid JSON format. Parse error: ${parseError instanceof Error ? parseError.message : 'Unknown'}`)
//       }
//     }
    
//     throw new Error('No valid JSON found in response')
//   }
// }

// // Validate workflow structure
// function validateWorkflow(workflow: any): string | null {
//   if (!workflow || typeof workflow !== 'object') {
//     return 'Workflow must be an object'
//   }
  
//   if (!workflow.title || typeof workflow.title !== 'string') {
//     return 'Workflow must have a title'
//   }
  
//   if (!workflow.steps || !Array.isArray(workflow.steps)) {
//     return 'Workflow must have steps array'
//   }
  
//   if (workflow.steps.length === 0) {
//     return 'Workflow must have at least one step'
//   }
  
//   // Validate each step has minimum required fields
//   for (let i = 0; i < workflow.steps.length; i++) {
//     const step = workflow.steps[i]
//     if (!step.title || typeof step.title !== 'string') {
//       return `Step ${i + 1} must have a title`
//     }
//     if (!step.type || typeof step.type !== 'string') {
//       return `Step ${i + 1} must have a type`
//     }
//   }
  
//   return null // Valid
// }

// export async function generateWorkflowWithDeepSeek(request: DeepSeekRequest): Promise<DeepSeekResponse> {
//   const startTime = Date.now()
//   console.log('Server action called:', { 
//     action: request.action, 
//     hasApiKey: !!process.env.DEEPSEEK_API_KEY,
//     requestLength: request.workflowRequest?.length,
//     timestamp: new Date().toISOString()
//   })

//   try {
//     // Validate API key
//     if (!process.env.DEEPSEEK_API_KEY) {
//       console.error('DEEPSEEK_API_KEY environment variable is missing')
//       return {
//         success: false,
//         error: "API configuration missing. Please contact support."
//       }
//     }

//     // Validate request
//     if (!request.workflowRequest?.trim()) {
//       return {
//         success: false,
//         error: "Workflow request description is required"
//       }
//     }

//     if (request.workflowRequest.length > 2000) {
//       return {
//         success: false,
//         error: "Workflow request is too long. Please keep it under 2000 characters."
//       }
//     }

//     // Get selected integration names
//     const integrationNames = request.selectedIntegrations
//       .map(id => SUPPORTED_INTEGRATIONS.find(int => int.id === id)?.name)
//       .filter(Boolean)
//       .join(', ') || 'None selected'

//     // Get selected goal labels
//     const goalLabels = request.selectedGoals
//       .map(id => instagramGoals.find(goal => goal.id === id)?.label)
//       .filter(Boolean)
//       .join(', ') || 'General automation'

//     // Optimized system prompt - more concise but still comprehensive
//     const systemPrompt = `You are a workflow automation expert. Create Instagram DM automation workflows for Voiceflow.

// CRITICAL: Respond with ONLY valid JSON in this exact format:
// {
//   "title": "Clear workflow name",
//   "description": "Brief description (1-2 sentences)",
//   "steps": [
//     {
//       "title": "Step name",
//       "description": "What this step does",
//       "type": "trigger|analysis|filter|response|integration|storage",
//       "inputs": ["required_input"],
//       "outputs": ["produced_output"],
//       "details": ["implementation_detail"],
//       "voiceflowBlock": "block_type",
//       "businessImpact": "business_benefit",
//       "estimatedTime": "< 2s",
//       "needsIntegration": false,
//       "complexity": "low|medium|high"
//     }
//   ],
//   "benefits": ["benefit1", "benefit2", "benefit3"],
//   "exampleScenario": "Real example of workflow in action"
// }

// Requirements:
// - Create 3-6 logical steps
// - Focus on Instagram DM automation
// - Make steps actionable in Voiceflow
// - Keep JSON structure exact`

//     // Build user prompt based on action type
//     let userPrompt: string
    
//     if (request.action === "initial") {
//       userPrompt = `Create Instagram DM automation workflow:

// Business: ${request.businessInfo.businessName} (${request.businessInfo.businessType})
// Request: "${request.workflowRequest}"
// Goals: ${goalLabels}
// Available Integrations: ${integrationNames}

// Create a practical workflow with 3-6 steps that automates Instagram DM handling for this business.`
//     } else {
//       userPrompt = `Modify existing workflow: "${request.currentWorkflow?.title || 'Current Workflow'}"

// Current Description: ${request.currentWorkflow?.description || 'No description'}
// Current Steps: ${request.currentWorkflow?.steps?.length || 0}

// Modification Request: "${request.instructions}"

// Update the workflow JSON with the requested changes while maintaining the same structure.`
//     }

//     console.log('Making API call with optimized parameters...')

//     // Make API call with retry logic
//     const response = await fetchWithRetry(DEEPSEEK_API_URL, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
//         'Accept': 'application/json',
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
//         temperature: 0.2, // Low temperature for consistent JSON output
//         max_tokens: 1500, // Reasonable limit for workflow data
//         top_p: 0.9,
//         frequency_penalty: 0.1,
//         presence_penalty: 0.1,
//         stream: false,
//       }),
//     })

//     const responseTime = Date.now() - startTime
//     console.log(`API response received in ${responseTime}ms`)

//     if (!response.ok) {
//       const errorText = await response.text().catch(() => 'Failed to read error response')
//       console.error(`API error ${response.status}:`, errorText.substring(0, 200))
//       return {
//         success: false,
//         error: `AI service error (${response.status}). ${response.status === 429 ? 'Service is busy, please try again.' : 'Please try again.'}`
//       }
//     }

//     const data = await response.json()
//     const aiResponseText = data.choices?.[0]?.message?.content

//     if (!aiResponseText) {
//       console.error('Empty AI response:', data)
//       return {
//         success: false,
//         error: "AI service returned empty response. Please try again."
//       }
//     }

//     console.log(`AI response length: ${aiResponseText.length} characters`)

//     // Parse AI response
//     let aiResponse
//     try {
//       aiResponse = parseAIResponse(aiResponseText)
//     } catch (parseError) {
//       console.error('JSON parsing failed:', parseError)
//       return {
//         success: false,
//         error: `AI response format error: ${parseError instanceof Error ? parseError.message : 'Invalid format'}. Please try with a simpler request.`
//       }
//     }

//     // Validate workflow structure
//     const validationError = validateWorkflow(aiResponse)
//     if (validationError) {
//       console.error('Workflow validation failed:', validationError)
//       return {
//         success: false,
//         error: `Invalid workflow structure: ${validationError}. Please try again.`
//       }
//     }

//     const totalTime = Date.now() - startTime
//     console.log(`Successfully generated workflow with ${aiResponse.steps.length} steps in ${totalTime}ms`)

//     return {
//       success: true,
//       workflowData: aiResponse
//     }

//   } catch (error) {
//     const totalTime = Date.now() - startTime
//     console.error(`Generation error after ${totalTime}ms:`, error)
    
//     if (error instanceof Error) {
//       if (error.message.includes('timeout')) {
//         return {
//           success: false,
//           error: "Request timed out. The AI service is experiencing high load. Please try again in a moment."
//         }
//       }
//       if (error.message.includes('network') || error.message.includes('fetch')) {
//         return {
//           success: false,
//           error: "Network connectivity issue. Please check your internet connection and try again."
//         }
//       }
//       if (error.message.includes('429')) {
//         return {
//           success: false,
//           error: "AI service is busy. Please wait a moment and try again."
//         }
//       }
      
//       return {
//         success: false,
//         error: `Generation failed: ${error.message.substring(0, 150)}${error.message.length > 150 ? '...' : ''}`
//       }
//     }
    
//     return {
//       success: false,
//       error: "An unexpected error occurred. Please try again."
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

export interface DeepSeekResponse {
  success: boolean
  workflowData?: any
  error?: string
  processingTime?: number
}

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'
const REQUEST_TIMEOUT = 60000 // Increased to 60 seconds
const MAX_RETRIES = 3
const BASE_DELAY = 1000

const SUPPORTED_INTEGRATIONS = [
  {
    id: "airtable",
    name: "Airtable",
    description: "Database for customer data",
  },
  {
    id: "google-sheets",
    name: "Google Sheets", 
    description: "Spreadsheet for data tracking",
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    description: "Email marketing platform",
  },
  {
    id: "notion",
    name: "Notion",
    description: "Workspace for collaboration",
  },
]

const instagramGoals = [
  { id: "lead-generation", label: "Lead Generation" },
  { id: "customer-support", label: "Customer Support" },
  { id: "product-inquiries", label: "Product Inquiries" },
  { id: "appointment-booking", label: "Appointment Booking" },
  { id: "content-engagement", label: "Content Engagement" },
  { id: "influencer-outreach", label: "Influencer Outreach" },
]

// Optimized fetch with comprehensive retry logic
async function makeAPIRequest(url: string, options: RequestInit, maxRetries: number = MAX_RETRIES): Promise<Response> {
  let lastError: Error = new Error('All API attempts failed')

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`API attempt ${attempt}/${maxRetries} started at ${new Date().toISOString()}`)
      
      const controller = new AbortController()
      
      // Slightly increase timeout per attempt
      const currentTimeout = REQUEST_TIMEOUT + ((attempt - 1) * 15000) // 60s, 75s, 90s
      
      const timeoutId = setTimeout(() => {
        console.log(`Request timeout after ${currentTimeout}ms on attempt ${attempt}`)
        controller.abort()
      }, currentTimeout)
      
      const requestStart = Date.now()
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)
      
      const requestDuration = Date.now() - requestStart
      console.log(`API response received: ${response.status} in ${requestDuration}ms`)
      
      // Success case
      if (response.ok) {
        return response
      }
      
      // Determine if we should retry based on status code
      const isRetryableError = (
        response.status === 429 ||  // Rate limit
        response.status === 502 ||  // Bad gateway
        response.status === 503 ||  // Service unavailable
        response.status === 504 ||  // Gateway timeout
        response.status >= 500      // Other server errors
      )
      
      if (isRetryableError && attempt < maxRetries) {
        const errorBody = await response.text().catch(() => 'No error details')
        lastError = new Error(`HTTP ${response.status}: ${errorBody.substring(0, 100)}`)
        console.log(`Retryable error on attempt ${attempt}: ${lastError.message}`)
        
        // Exponential backoff with some randomization
        const baseDelay = BASE_DELAY * Math.pow(2, attempt - 1)
        const jitter = Math.random() * 1000
        const delay = Math.min(baseDelay + jitter, 10000) // Cap at 10 seconds
        
        console.log(`Waiting ${Math.round(delay)}ms before retry...`)
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }
      
      // Non-retryable error or last attempt - return response to handle upstream
      return response
      
    } catch (error) {
      const currentError = error instanceof Error ? error : new Error('Unknown network error')
      
      if (currentError.name === 'AbortError') {
        lastError = new Error(`Request timed out after ${Math.round(REQUEST_TIMEOUT / 1000)} seconds`)
        console.log(`Timeout error on attempt ${attempt}`)
      } else {
        lastError = currentError
        console.log(`Network error on attempt ${attempt}: ${currentError.message}`)
      }
      
      // Retry network errors and timeouts
      if (attempt < maxRetries) {
        const delay = BASE_DELAY * Math.pow(1.5, attempt - 1) + Math.random() * 500
        console.log(`Retrying after network error in ${Math.round(delay)}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  throw lastError
}

// Robust JSON parsing with multiple strategies
function parseAIResponse(responseText: string): any {
  if (!responseText?.trim()) {
    throw new Error('AI service returned empty response')
  }

  let cleanedText = responseText.trim()
  
  // Remove markdown code blocks
  if (cleanedText.includes('```')) {
    const jsonMatch = cleanedText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/)
    if (jsonMatch) {
      cleanedText = jsonMatch[1].trim()
    }
  }
  
  // Find JSON boundaries if text contains extra content
  const firstBrace = cleanedText.indexOf('{')
  const lastBrace = cleanedText.lastIndexOf('}')
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleanedText = cleanedText.substring(firstBrace, lastBrace + 1)
  }
  
  // Try parsing with different strategies
  const strategies = [
    // Direct parse
    () => JSON.parse(cleanedText),
    
    // Remove trailing commas
    () => JSON.parse(cleanedText.replace(/,(\s*[}\]])/g, '$1')),
    
    // Fix common formatting issues
    () => {
      let fixed = cleanedText
        // Quote unquoted keys
        .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
        // Fix single quotes to double quotes
        .replace(/'/g, '"')
        // Remove trailing commas in objects and arrays
        .replace(/,(\s*[}\]])/g, '$1')
      return JSON.parse(fixed)
    }
  ]
  
  for (let i = 0; i < strategies.length; i++) {
    try {
      return strategies[i]()
    } catch (error) {
      if (i === strategies.length - 1) {
        throw new Error(`Failed to parse AI response: ${error instanceof Error ? error.message : 'Invalid JSON format'}`)
      }
    }
  }
}

// Validate workflow structure
function validateWorkflow(workflow: any): string | null {
  if (!workflow || typeof workflow !== 'object') {
    return 'Workflow must be a valid object'
  }
  
  if (!workflow.title || typeof workflow.title !== 'string' || workflow.title.trim().length < 3) {
    return 'Workflow must have a meaningful title'
  }
  
  if (!workflow.steps || !Array.isArray(workflow.steps)) {
    return 'Workflow must contain a steps array'
  }
  
  if (workflow.steps.length === 0) {
    return 'Workflow must have at least one step'
  }
  
  if (workflow.steps.length > 12) {
    return 'Workflow has too many steps (maximum 12)'
  }
  
  // Validate each step
  for (let i = 0; i < workflow.steps.length; i++) {
    const step = workflow.steps[i]
    
    if (!step || typeof step !== 'object') {
      return `Step ${i + 1} is not a valid object`
    }
    
    if (!step.title || typeof step.title !== 'string') {
      return `Step ${i + 1} must have a title`
    }
    
    if (!step.type || typeof step.type !== 'string') {
      return `Step ${i + 1} must have a type`
    }
    
    if (!step.description || typeof step.description !== 'string') {
      return `Step ${i + 1} must have a description`
    }
  }
  
  return null // Validation passed
}

export async function generateWorkflowWithDeepSeek(request: DeepSeekRequest): Promise<DeepSeekResponse> {
  const startTime = Date.now()
  
  console.log('Starting workflow generation:', {
    action: request.action,
    businessName: request.businessInfo.businessName,
    requestLength: request.workflowRequest?.length,
    timestamp: new Date().toISOString()
  })

  try {
    // Validate environment
    if (!process.env.DEEPSEEK_API_KEY) {
      console.error('DEEPSEEK_API_KEY environment variable not found')
      return {
        success: false,
        error: "AI service configuration is missing. Please contact support.",
        processingTime: Date.now() - startTime
      }
    }

    // Validate input
    if (!request.workflowRequest?.trim()) {
      return {
        success: false,
        error: "Please describe what you want the workflow to accomplish.",
        processingTime: Date.now() - startTime
      }
    }

    // Check request length for performance
    if (request.workflowRequest.length > 2500) {
      return {
        success: false,
        error: "Request description is too long. Please summarize in fewer than 2500 characters.",
        processingTime: Date.now() - startTime
      }
    }

    // Prepare integration and goal context
    const selectedIntegrations = request.selectedIntegrations
      .map(id => SUPPORTED_INTEGRATIONS.find(int => int.id === id)?.name)
      .filter(Boolean)
      .join(', ')

    const selectedGoals = request.selectedGoals
      .map(id => instagramGoals.find(goal => goal.id === id)?.label)
      .filter(Boolean)
      .join(', ')

    // Optimized system prompt for consistent JSON output
    const systemPrompt = `You are an expert at creating Instagram DM automation workflows for Voiceflow. 

CRITICAL: Respond with ONLY valid JSON in this exact structure:

{
  "title": "Clear, descriptive workflow name",
  "description": "Brief explanation of what this workflow does",
  "steps": [
    {
      "title": "Step name",
      "description": "What this step accomplishes",
      "type": "trigger|analysis|filter|response|integration|storage",
      "inputs": ["required input"],
      "outputs": ["produced output"],
      "details": ["implementation detail"],
      "voiceflowBlock": "voiceflow block type",
      "businessImpact": "how this helps the business",
      "estimatedTime": "processing time estimate",
      "needsIntegration": true/false,
      "complexity": "low|medium|high"
    }
  ],
  "benefits": ["key benefit 1", "key benefit 2", "key benefit 3"],
  "exampleScenario": "Realistic example of the workflow in action"
}

Requirements:
- Create 4-7 logical, sequential steps
- Focus specifically on Instagram DM automation
- Make steps implementable in Voiceflow
- Ensure JSON is perfectly formatted
- Be specific and actionable`

    // Build context-aware user prompt
    let userPrompt: string
    
    if (request.action === "initial") {
      userPrompt = `Create an Instagram DM automation workflow for this business:

Business Name: ${request.businessInfo.businessName}
Business Type: ${request.businessInfo.businessType}
${request.businessInfo.description ? `Business Description: ${request.businessInfo.description}` : ''}

Workflow Requirements: ${request.workflowRequest}

${selectedGoals ? `Primary Goals: ${selectedGoals}` : ''}
${selectedIntegrations ? `Available Integrations: ${selectedIntegrations}` : ''}

Create a specific workflow that automates Instagram DM handling for this business based on their requirements.`
    } else {
      userPrompt = `Modify this existing Instagram DM automation workflow:

Current Workflow: "${request.currentWorkflow?.title || 'Untitled Workflow'}"
${request.currentWorkflow?.description ? `Description: ${request.currentWorkflow.description}` : ''}
${request.currentWorkflow?.steps ? `Current Steps: ${request.currentWorkflow.steps.length}` : ''}

Modification Instructions: ${request.instructions}

Update the workflow JSON with the requested changes while maintaining the same structure.`
    }

    console.log('Making API request to DeepSeek...')

    // Make the API call
    const response = await makeAPIRequest(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Accept': 'application/json',
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
        temperature: 0.2,
        max_tokens: 2000,
        top_p: 0.9,
        stream: false,
      }),
    })

    const apiResponseTime = Date.now() - startTime
    console.log(`API call completed in ${apiResponseTime}ms with status: ${response.status}`)

    // Handle API errors
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unable to read error response')
      console.error(`API error ${response.status}:`, errorText.substring(0, 200))
      
      let userErrorMessage = "AI service is currently unavailable."
      
      if (response.status === 429) {
        userErrorMessage = "AI service is busy. Please wait a moment and try again."
      } else if (response.status === 401) {
        userErrorMessage = "Authentication failed. Please contact support."
      } else if (response.status >= 500) {
        userErrorMessage = "AI service is experiencing issues. Please try again in a few minutes."
      } else if (response.status === 400) {
        userErrorMessage = "Request format error. Please try rephrasing your requirements."
      }
      
      return {
        success: false,
        error: userErrorMessage,
        processingTime: apiResponseTime
      }
    }

    // Parse API response
    const responseData = await response.json()
    const aiContent = responseData.choices?.[0]?.message?.content

    if (!aiContent?.trim()) {
      console.error('Empty response from AI service')
      return {
        success: false,
        error: "AI service returned empty response. Please try again.",
        processingTime: Date.now() - startTime
      }
    }

    console.log(`Received AI response (${aiContent.length} characters)`)

    // Parse and validate the AI response
    let workflowData
    try {
      workflowData = parseAIResponse(aiContent)
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      return {
        success: false,
        error: "AI response was malformed. Please try again with simpler requirements.",
        processingTime: Date.now() - startTime
      }
    }

    // Validate workflow structure
    const validationError = validateWorkflow(workflowData)
    if (validationError) {
      console.error('Workflow validation failed:', validationError)
      return {
        success: false,
        error: `Generated workflow was incomplete: ${validationError}. Please try again.`,
        processingTime: Date.now() - startTime
      }
    }

    const totalTime = Date.now() - startTime
    console.log(`Successfully generated workflow with ${workflowData.steps.length} steps in ${totalTime}ms`)

    return {
      success: true,
      workflowData: workflowData,
      processingTime: totalTime
    }

  } catch (error) {
    const totalTime = Date.now() - startTime
    console.error(`Workflow generation failed after ${totalTime}ms:`, error)
    
    let errorMessage = "An unexpected error occurred while generating the workflow."
    
    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.message.includes('timed out')) {
        errorMessage = "Request timed out. The AI service is overloaded. Please try again with a shorter, more focused request."
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = "Network connection issue. Please check your internet connection and try again."
      } else if (error.message.includes('abort')) {
        errorMessage = "Request was cancelled due to timeout. Please try again with a simpler request."
      }
    }
    
    return {
      success: false,
      error: errorMessage,
      processingTime: totalTime
    }
  }
}