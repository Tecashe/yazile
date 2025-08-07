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