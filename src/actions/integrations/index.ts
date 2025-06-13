// 'use server'

// import { redirect } from 'next/navigation'
// import { onCurrentUser } from '../user'
// import { createIntegration, getIntegration, updateIntegrationData } from './queries'
// import { generateTokens } from '@/lib/fetch'
// import axios from 'axios'

// export const onOAuthInstagram = (strategy: 'INSTAGRAM' | 'CRM') => {
//   if (strategy === 'INSTAGRAM') {
//     return redirect(process.env.INSTAGRAM_EMBEDDED_OAUTH_URL as string)
//   }
// }

// export const onIntegrate = async (code: string) => {
//   const user = await onCurrentUser()

//   try {
//     const integration = await getIntegration(user.id)

//     if (integration && integration.integrations.length < 5) {
//       const token = await generateTokens(code)
//       console.log('Token:', {token})

//       if (token) {
//         const instaData = await fetchInstagramData(token.access_token)

//         const today = new Date()
//         const expire_date = today.setDate(today.getDate() + 60)
//         const create = await createIntegration(
//           user.id,
//           token.access_token,
//           new Date(expire_date),
//           instaData
//         )
//         return { status: 200, data: create }
//       }
//       console.log('🔴 401')
//       return { status: 401 }
//     }
//     console.log('🔴 404')
//     return { status: 404 }
//   } catch (error) {
//     console.log('🔴 500', error)
//     return { status: 500 }
//   }
// }

// export const fetchInstagramData = async (accessToken: string) => {
//   try {
//     const fields = 'id,username,account_type,media_count,followers_count,follows_count,profile_picture_url'
//     const response = await axios.get(
//       `${process.env.INSTAGRAM_BASE_URL}/me?fields=${fields}&access_token=${accessToken}`
//     )

//     return {
//       instagramId: response.data.id,
//       username: response.data.username,
//       fullName: response.data.name,
//       profilePicture: response.data.profile_picture_url,
//       followersCount: response.data.followers_count,
//       followingCount: response.data.follows_count,
//       postsCount: response.data.media_count,
//     }
//   } catch (error) {
//     console.error('Error fetching Instagram data:', error)
//     throw error
//   }
// }

// export const refreshInstagramData = async (userId: string) => {
//   try {
//     const integration = await getIntegration(userId)
//     if (integration && integration.integrations.length > 0) {
//       const latestIntegration = integration.integrations[0]
//       const instaData = await fetchInstagramData(latestIntegration.token)
//       await updateIntegrationData(latestIntegration.id, instaData)
//       return { status: 200, data: instaData }
//     }
//     return { status: 404, message: 'No Instagram integration found' }
//   } catch (error) {
//     console.error('Error refreshing Instagram data:', error)
//     return { status: 500, message: 'Error refreshing Instagram data' }
//   }
// }



// 'use server'

// import { redirect } from 'next/navigation'
// import { onCurrentUser } from '../user'
// import { createIntegration, getIntegration, updateIntegrationData } from './queries'
// import { generateTokens } from '@/lib/fetch'
// import axios from 'axios'

// export const onOAuthInstagram = (strategy: 'INSTAGRAM' | 'CRM') => {
//   if (strategy === 'INSTAGRAM') {
//     return redirect(process.env.INSTAGRAM_EMBEDDED_OAUTH_URL as string)
//   }
// }

// export const onIntegrate = async (code: string) => {
//   const user = await onCurrentUser()

//   try {
//     const integration = await getIntegration(user.id)

//     if (integration && integration.integrations.length < 5) {
//       const token = await generateTokens(code)
//       console.log('Token:', {token})

//       if (token) {
//         const instaData = await fetchInstagramData(token.access_token)

//         const today = new Date()
//         const expire_date = today.setDate(today.getDate() + 60)
//         const create = await createIntegration(
//           user.id,
//           token.access_token,
//           new Date(expire_date),
//           instaData
//         )
//         return { status: 200, data: create }
//       }
//       console.log('🔴 401')
//       return { status: 401 }
//     }
//     console.log('🔴 404')
//     return { status: 404 }
//   } catch (error) {
//     console.log('🔴 500', error)
//     return { status: 500 }
//   }
// }

// export const fetchInstagramData = async (accessToken: string) => {
//   try {
//     const fields = 'id,username,account_type,media_count,followers_count,follows_count,profile_picture_url'
//     const response = await axios.get(
//       `${process.env.INSTAGRAM_BASE_URL}/me?fields=${fields}&access_token=${accessToken}`
//     )

//     return {
//       instagramId: response.data.id,
//       username: response.data.username,
//       fullName: response.data.name,
//       profilePicture: response.data.profile_picture_url,
//       followersCount: response.data.followers_count,
//       followingCount: response.data.follows_count,
//       postsCount: response.data.media_count,
//     }
//   } catch (error) {
//     console.error('Error fetching Instagram data:', error)
//     throw error
//   }
// }

// export const refreshInstagramData = async (userId: string) => {
//   try {
//     const integration = await getIntegration(userId)
//     if (integration && integration.integrations.length > 0) {
//       const latestIntegration = integration.integrations[0]
//       const instaData = await fetchInstagramData(latestIntegration.token)
//       await updateIntegrationData(latestIntegration.id, instaData)
//       return { status: 200, data: instaData }
//     }
//     return { status: 404, message: 'No Instagram integration found' }
//   } catch (error) {
//     console.error('Error refreshing Instagram data:', error)
//     return { status: 500, message: 'Error refreshing Instagram data' }
//   }
// }

// // NEW FUNCTIONS BELOW

// /**
//  * Fetch user's Instagram media posts with metadata
//  */
// export const fetchInstagramMedia = async (userId: string, limit: number = 25) => {
//   try {
//     const integration = await getIntegration(userId)
//     if (!integration || integration.integrations.length === 0) {
//       return { status: 404, message: 'No Instagram integration found' }
//     }

//     const accessToken = integration.integrations[0].token
//     const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count'
    
//     const response = await axios.get(
//       `${process.env.INSTAGRAM_BASE_URL}/me/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`
//     )

//     return { status: 200, data: response.data.data }
//   } catch (error) {
//     console.error('Error fetching Instagram media:', error)
//     return { status: 500, message: 'Error fetching Instagram media' }
//   }
// }

// /**
//  * Get insights for a specific media post
//  */
// export const getMediaInsights = async (userId: string, mediaId: string) => {
//   try {
//     const integration = await getIntegration(userId)
//     if (!integration || integration.integrations.length === 0) {
//       return { status: 404, message: 'No Instagram integration found' }
//     }

//     const accessToken = integration.integrations[0].token
//     const metrics = 'engagement,impressions,reach,saved'
    
//     const response = await axios.get(
//       `${process.env.INSTAGRAM_BASE_URL}/${mediaId}/insights?metric=${metrics}&access_token=${accessToken}`
//     )

//     return { status: 200, data: response.data.data }
//   } catch (error) {
//     console.error('Error fetching media insights:', error)
//     return { status: 500, message: 'Error fetching media insights' }
//   }
// }

// /**
//  * Get account insights for specific time period
//  */
// export const getAccountInsights = async (userId: string, period: 'day' | 'week' | 'days_28' = 'week') => {
//   try {
//     const integration = await getIntegration(userId)
//     if (!integration || integration.integrations.length === 0) {
//       return { status: 404, message: 'No Instagram integration found' }
//     }

//     const accessToken = integration.integrations[0].token
//     const metrics = 'impressions,reach,profile_views,website_clicks'
    
//     const response = await axios.get(
//       `${process.env.INSTAGRAM_BASE_URL}/me/insights?metric=${metrics}&period=${period}&access_token=${accessToken}`
//     )

//     return { status: 200, data: response.data.data }
//   } catch (error) {
//     console.error('Error fetching account insights:', error)
//     return { status: 500, message: 'Error fetching account insights' }
//   }
// }

// /**
//  * Refresh access token using long-lived token
//  */
// export const refreshAccessToken = async (userId: string) => {
//   try {
//     const integration = await getIntegration(userId)
//     if (!integration || integration.integrations.length === 0) {
//       return { status: 404, message: 'No Instagram integration found' }
//     }

//     const currentToken = integration.integrations[0].token
    
//     const response = await axios.get(
//       `${process.env.INSTAGRAM_BASE_URL}/refresh_access_token?grant_type=ig_refresh_token&access_token=${currentToken}`
//     )

//     // Update token in database
//     const newExpiryDate = new Date()
//     newExpiryDate.setDate(newExpiryDate.getDate() + 60)
    
//     await updateIntegrationData(integration.integrations[0].id, {
//       token: response.data.access_token,
//       expiresAt: newExpiryDate
//     })

//     return { status: 200, data: { token: response.data.access_token, expiresIn: response.data.expires_in } }
//   } catch (error) {
//     console.error('Error refreshing access token:', error)
//     return { status: 500, message: 'Error refreshing access token' }
//   }
// }

// /**
//  * Check if token is expired or about to expire
//  */
// export const checkTokenExpiry = async (userId: string) => {
//   try {
//     const integration = await getIntegration(userId)
//     if (!integration || integration.integrations.length === 0) {
//       return { status: 404, message: 'No Instagram integration found' }
//     }

//     const expiryDate = integration.integrations[0].expiresAt
//     if (!expiryDate) {
//       return { status: 400, message: 'No expiry date found for token' }
//     }

//     const now = new Date()
//     const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

//     return {
//       status: 200,
//       data: {
//         isExpired: now > expiryDate,
//         daysUntilExpiry,
//         shouldRefresh: daysUntilExpiry <= 7, // Refresh if expires within a week
//         expiryDate
//       }
//     }
//   } catch (error) {
//     console.error('Error checking token expiry:', error)
//     const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
//     return { status: 500, message: `Error checking token expiry: ${errorMessage}` }
//   }
// }

// /**
//  * Get hashtag information and top posts
//  */
// export const searchHashtag = async (userId: string, hashtag: string) => {
//   try {
//     const integration = await getIntegration(userId)
//     if (!integration || integration.integrations.length === 0) {
//       return { status: 404, message: 'No Instagram integration found' }
//     }

//     const accessToken = integration.integrations[0].token
    
//     // First get hashtag ID
//     const hashtagResponse = await axios.get(
//       `${process.env.INSTAGRAM_BASE_URL}/ig_hashtag_search?user_id=${integration.integrations[0].instagramId}&q=${hashtag}&access_token=${accessToken}`
//     )

//     if (hashtagResponse.data.data.length === 0) {
//       return { status: 404, message: 'Hashtag not found' }
//     }

//     const hashtagId = hashtagResponse.data.data[0].id

//     // Get hashtag info and top media
//     const [infoResponse, mediaResponse] = await Promise.all([
//       axios.get(`${process.env.INSTAGRAM_BASE_URL}/${hashtagId}?fields=id,name&access_token=${accessToken}`),
//       axios.get(`${process.env.INSTAGRAM_BASE_URL}/${hashtagId}/top_media?user_id=${integration.integrations[0].instagramId}&fields=id,media_type,media_url,permalink,timestamp&access_token=${accessToken}`)
//     ])

//     return {
//       status: 200,
//       data: {
//         hashtag: infoResponse.data,
//         topMedia: mediaResponse.data.data
//       }
//     }
//   } catch (error) {
//     console.error('Error searching hashtag:', error)
//     return { status: 500, message: 'Error searching hashtag' }
//   }
// }

// /**
//  * Get comments for a specific media post
//  */
// export const getMediaComments = async (userId: string, mediaId: string) => {
//   try {
//     const integration = await getIntegration(userId)
//     if (!integration || integration.integrations.length === 0) {
//       return { status: 404, message: 'No Instagram integration found' }
//     }

//     const accessToken = integration.integrations[0].token
//     const fields = 'id,text,timestamp,username,like_count'
    
//     const response = await axios.get(
//       `${process.env.INSTAGRAM_BASE_URL}/${mediaId}/comments?fields=${fields}&access_token=${accessToken}`
//     )

//     return { status: 200, data: response.data.data }
//   } catch (error) {
//     console.error('Error fetching media comments:', error)
//     return { status: 500, message: 'Error fetching media comments' }
//   }
// }

// /**
//  * Get user mentions in media
//  */
// export const getUserMentions = async (userId: string, limit: number = 25) => {
//   try {
//     const integration = await getIntegration(userId)
//     if (!integration || integration.integrations.length === 0) {
//       return { status: 404, message: 'No Instagram integration found' }
//     }

//     const accessToken = integration.integrations[0].token
//     const fields = 'id,media_type,media_url,permalink,timestamp,caption'
    
//     const response = await axios.get(
//       `${process.env.INSTAGRAM_BASE_URL}/me/tags?fields=${fields}&limit=${limit}&access_token=${accessToken}`
//     )

//     return { status: 200, data: response.data.data }
//   } catch (error) {
//     console.error('Error fetching user mentions:', error)
//     return { status: 500, message: 'Error fetching user mentions' }
//   }
// }

// /**
//  * Bulk operations for multiple integrations
//  */
// export const bulkRefreshIntegrations = async (userId: string) => {
//   try {
//     const integration = await getIntegration(userId)
//     if (!integration || integration.integrations.length === 0) {
//       return { status: 404, message: 'No Instagram integrations found' }
//     }

//     const results = await Promise.allSettled(
//       integration.integrations.map(async (int) => {
//         const instaData = await fetchInstagramData(int.token)
//         await updateIntegrationData(int.id, instaData)
//         return { integrationId: int.id, data: instaData }
//       })
//     )

//     const successful = results.filter(r => r.status === 'fulfilled').map(r => r.value)
//     const failed = results.filter(r => r.status === 'rejected').length

//     return {
//       status: 200,
//       data: {
//         successful: successful.length,
//         failed,
//         results: successful
//       }
//     }
//   } catch (error) {
//     console.error('Error bulk refreshing integrations:', error)
//     return { status: 500, message: 'Error bulk refreshing integrations' }
//   }
// }

// /**
//  * Validate Instagram connection health
//  */
// export const validateConnection = async (userId: string) => {
//   try {
//     const integration = await getIntegration(userId)
//     if (!integration || integration.integrations.length === 0) {
//       return { status: 404, message: 'No Instagram integration found' }
//     }

//     const accessToken = integration.integrations[0].token
    
//     // Test connection with a simple API call
//     const response = await axios.get(
//       `${process.env.INSTAGRAM_BASE_URL}/me?fields=id,username&access_token=${accessToken}`
//     )

//     const tokenExpiry = await checkTokenExpiry(userId)

//     return {
//       status: 200,
//       data: {
//         isValid: true,
//         username: response.data.username,
//         tokenExpiry: tokenExpiry.data
//       }
//     }
//   } catch (error) {
//     console.error('Connection validation failed:', error)
//     const errorMessage = error instanceof Error && 'response' in error && 
//       error.response && typeof error.response === 'object' && 'data' in error.response &&
//       error.response.data && typeof error.response.data === 'object' && 'error' in error.response.data &&
//       error.response.data.error && typeof error.response.data.error === 'object' && 'message' in error.response.data.error
//       ? String(error.response.data.error.message)
//       : 'Connection invalid'
    
//     return {
//       status: 401,
//       data: {
//         isValid: false,
//         error: errorMessage
//       }
//     }
//   }
// }




"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { GoogleGenerativeAI } from "@google/generative-ai";
import { redirect } from 'next/navigation'
import { onCurrentUser } from '../user'
import { createIntegration, getIntegration, updateIntegrationData } from './queries'
import { generateTokens } from '@/lib/fetch'
import axios from 'axios'


// Enhanced logging utility
const logErrors = (functionName: string, error: any, context?: any) => {
  console.error(`🔴 [${functionName}] Error occurred:`, {
    timestamp: new Date().toISOString(),
    error: {
      message: error?.message || 'Unknown error',
      code: error?.code,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      data: error?.response?.data,
      stack: error?.stack?.split('\n').slice(0, 3) // First 3 lines of stack
    },
    context,
    env: {
      baseUrl: process.env.INSTAGRAM_BASE_URL,
      hasClientId: !!process.env.INSTAGRAM_CLIENT_ID,
      hasClientSecret: !!process.env.INSTAGRAM_CLIENT_SECRET,
    }
  })
}

const logInfos = (functionName: string, message: string, data?: any) => {
  console.log(`✅ [${functionName}] ${message}`, data ? { data } : '')
}

const logWarnings = (functionName: string, message: string, data?: any) => {
  console.warn(`⚠️ [${functionName}] ${message}`, data ? { data } : '')
}

export const onOAuthInstagrams = (strategy: 'INSTAGRAM' | 'CRM') => {
  logInfo('onOAuthInstagram', `Redirecting with strategy: ${strategy}`)
  if (strategy === 'INSTAGRAM') {
    const redirectUrl = process.env.INSTAGRAM_EMBEDDED_OAUTH_URL as string
    logInfo('onOAuthInstagram', `Redirect URL: ${redirectUrl}`)
    return redirect(redirectUrl)
  }
}

export const onIntegrates = async (code: string) => {
  const functionName = 'onIntegrate'
  logInfo(functionName, `Starting integration process with code: ${code.substring(0, 10)}...`)
  
  try {
    const user = await onCurrentUser()
    logInfo(functionName, `Current user retrieved: ${user.id}`)

    const integration = await getIntegration(user.id)
    logInfo(functionName, `Integration check result:`, {
      hasIntegration: !!integration,
      integrationCount: integration?.integrations?.length || 0
    })

    if (integration && integration.integrations.length < 5) {
      logInfo(functionName, 'Generating tokens...')
      const token = await generateTokens(code)
      console.log('Token:', {token})

      if (token) {
        logInfo(functionName, 'Token generated successfully, fetching Instagram data...')
        const instaData = await fetchInstagramData(token.access_token)
        logInfo(functionName, 'Instagram data fetched:', instaData)

        const today = new Date()
        const expire_date = today.setDate(today.getDate() + 60)
        
        logInfo(functionName, `Creating integration with expiry: ${new Date(expire_date)}`)
        const create = await createIntegration(
          user.id,
          token.access_token,
          new Date(expire_date),
          instaData
        )
        logInfo(functionName, 'Integration created successfully')
        return { status: 200, data: create }
      }
      
      logWarning(functionName, 'No token received from generateTokens')
      return { status: 401 }
    }
    
    logWarning(functionName, 'Integration limit reached or no integration found', {
      hasIntegration: !!integration,
      count: integration?.integrations?.length
    })
    return { status: 404 }
  } catch (error) {
    logError(functionName, error, { code: code.substring(0, 10) + '...' })
    return { status: 500 }
  }
}

export const fetchInstagramDatas = async (accessToken: string) => {
  const functionName = 'fetchInstagramData'
  logInfo(functionName, `Fetching Instagram data with token: ${accessToken.substring(0, 20)}...`)
  
  try {
    const fields = 'id,username,account_type,media_count,followers_count,follows_count,profile_picture_url'
    const url = `${process.env.INSTAGRAM_BASE_URL}/me?fields=${fields}&access_token=${accessToken}`
    
    logInfo(functionName, `Making request to: ${url.replace(accessToken, 'TOKEN_HIDDEN')}`)
    logInfo(functionName, `Fields requested: ${fields}`)
    
    const response = await axios.get(url)
    
    logInfo(functionName, 'API Response received:', {
      status: response.status,
      statusText: response.statusText,
      dataKeys: Object.keys(response.data),
      data: response.data
    })

    const mappedData = {
      instagramId: response.data.id,
      username: response.data.username,
      fullName: response.data.name,
      profilePicture: response.data.profile_picture_url,
      followersCount: response.data.followers_count,
      followingCount: response.data.follows_count,
      postsCount: response.data.media_count,
    }
    
    logInfo(functionName, 'Data mapped successfully:', mappedData)
    return mappedData
  } catch (error) {
    logError(functionName, error, { 
      tokenPrefix: accessToken.substring(0, 20) + '...',
      baseUrl: process.env.INSTAGRAM_BASE_URL
    })
    throw error
  }
}

export const refreshInstagramDatas = async (userId: string) => {
  const functionName = 'refreshInstagramData'
  logInfo(functionName, `Refreshing data for user: ${userId}`)
  
  try {
    const integration = await getIntegration(userId)
    logInfo(functionName, 'Integration retrieved:', {
      hasIntegration: !!integration,
      integrationCount: integration?.integrations?.length || 0
    })
    
    if (integration && integration.integrations.length > 0) {
      const latestIntegration = integration.integrations[0]
      logInfo(functionName, 'Using integration:', {
        id: latestIntegration.id,
        tokenPrefix: latestIntegration.token.substring(0, 20) + '...',
        expiresAt: latestIntegration.expiresAt
      })
      
      const instaData = await fetchInstagramData(latestIntegration.token)
      await updateIntegrationData(latestIntegration.id, instaData)
      logInfo(functionName, 'Data refreshed successfully')
      return { status: 200, data: instaData }
    }
    
    logWarning(functionName, 'No Instagram integration found')
    return { status: 404, message: 'No Instagram integration found' }
  } catch (error) {
    logError(functionName, error, { userId })
    return { status: 500, message: 'Error refreshing Instagram data' }
  }
}

/**
 * Fetch user's Instagram media posts with metadata
 */
export const fetchInstagramMedias = async (userId: string, limit: number = 25) => {
  const functionName = 'fetchInstagramMedia'
  logInfo(functionName, `Fetching media for user: ${userId}, limit: ${limit}`)
  
  try {
    const integration = await getIntegration(userId)
    if (!integration || integration.integrations.length === 0) {
      logWarning(functionName, 'No Instagram integration found')
      return { status: 404, message: 'No Instagram integration found' }
    }

    const accessToken = integration.integrations[0].token
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count'
    const url = `${process.env.INSTAGRAM_BASE_URL}/me/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`
    
    logInfo(functionName, `Making request to: ${url.replace(accessToken, 'TOKEN_HIDDEN')}`)
    
    const response = await axios.get(url)
    
    logInfo(functionName, 'Media fetched successfully:', {
      status: response.status,
      mediaCount: response.data.data?.length || 0,
      hasNext: !!response.data.paging?.next
    })

    return { status: 200, data: response.data.data }
  } catch (error) {
    logError(functionName, error, { userId, limit })
    return { status: 500, message: 'Error fetching Instagram media' }
  }
}

/**
 * Get insights for a specific media post
 */
export const getMediaInsightss = async (userId: string, mediaId: string) => {
  const functionName = 'getMediaInsights'
  logInfo(functionName, `Getting insights for media: ${mediaId}, user: ${userId}`)
  
  try {
    const integration = await getIntegration(userId)
    if (!integration || integration.integrations.length === 0) {
      logWarning(functionName, 'No Instagram integration found')
      return { status: 404, message: 'No Instagram integration found' }
    }

    const accessToken = integration.integrations[0].token
    const metrics = 'engagement,impressions,reach,saved'
    const url = `${process.env.INSTAGRAM_BASE_URL}/${mediaId}/insights?metric=${metrics}&access_token=${accessToken}`
    
    logInfo(functionName, `Making request to: ${url.replace(accessToken, 'TOKEN_HIDDEN')}`)
    
    const response = await axios.get(url)
    
    logInfo(functionName, 'Insights fetched successfully:', {
      status: response.status,
      insightCount: response.data.data?.length || 0
    })

    return { status: 200, data: response.data.data }
  } catch (error) {
    logError(functionName, error, { userId, mediaId })
    return { status: 500, message: 'Error fetching media insights' }
  }
}

/**
 * Get account insights for specific time period
 */
export const getAccountInsightss = async (userId: string, period: 'day' | 'week' | 'days_28' = 'week') => {
  const functionName = 'getAccountInsights'
  logInfo(functionName, `Getting account insights for user: ${userId}, period: ${period}`)
  
  try {
    const integration = await getIntegration(userId)
    if (!integration || integration.integrations.length === 0) {
      logWarning(functionName, 'No Instagram integration found')
      return { status: 404, message: 'No Instagram integration found' }
    }

    const accessToken = integration.integrations[0].token
    const metrics = 'impressions,reach,profile_views,website_clicks'
    const url = `${process.env.INSTAGRAM_BASE_URL}/me/insights?metric=${metrics}&period=${period}&access_token=${accessToken}`
    
    logInfo(functionName, `Making request to: ${url.replace(accessToken, 'TOKEN_HIDDEN')}`)
    
    const response = await axios.get(url)
    
    logInfo(functionName, 'Account insights fetched successfully:', {
      status: response.status,
      insightCount: response.data.data?.length || 0
    })

    return { status: 200, data: response.data.data }
  } catch (error) {
    logError(functionName, error, { userId, period })
    return { status: 500, message: 'Error fetching account insights' }
  }
}

/**
 * Refresh access token using long-lived token
 */
export const refreshAccessTokens = async (userId: string) => {
  const functionName = 'refreshAccessToken'
  logInfo(functionName, `Refreshing token for user: ${userId}`)
  
  try {
    const integration = await getIntegration(userId)
    if (!integration || integration.integrations.length === 0) {
      logWarning(functionName, 'No Instagram integration found')
      return { status: 404, message: 'No Instagram integration found' }
    }

    const currentToken = integration.integrations[0].token
    const url = `${process.env.INSTAGRAM_BASE_URL}/refresh_access_token?grant_type=ig_refresh_token&access_token=${currentToken}`
    
    logInfo(functionName, `Making refresh request to: ${url.replace(currentToken, 'TOKEN_HIDDEN')}`)
    
    const response = await axios.get(url)
    
    logInfo(functionName, 'Token refreshed successfully:', {
      status: response.status,
      newTokenPrefix: response.data.access_token?.substring(0, 20) + '...',
      expiresIn: response.data.expires_in
    })

    // Update token in database
    const newExpiryDate = new Date()
    newExpiryDate.setDate(newExpiryDate.getDate() + 60)
    
    await updateIntegrationData(integration.integrations[0].id, {
      token: response.data.access_token,
      expiresAt: newExpiryDate
    })

    logInfo(functionName, `Token updated in database with new expiry: ${newExpiryDate}`)

    return { status: 200, data: { token: response.data.access_token, expiresIn: response.data.expires_in } }
  } catch (error) {
    logError(functionName, error, { userId })
    return { status: 500, message: 'Error refreshing access token' }
  }
}

/**
 * Check if token is expired or about to expire
 */
export const checkTokenExpirys = async (userId: string) => {
  const functionName = 'checkTokenExpiry'
  logInfo(functionName, `Checking token expiry for user: ${userId}`)
  
  try {
    const integration = await getIntegration(userId)
    if (!integration || integration.integrations.length === 0) {
      logWarning(functionName, 'No Instagram integration found')
      return { status: 404, message: 'No Instagram integration found' }
    }

    const expiryDate = integration.integrations[0].expiresAt
    logInfo(functionName, `Token expiry date: ${expiryDate}`)
    
    if (!expiryDate) {
      logWarning(functionName, 'No expiry date found for token')
      return { status: 400, message: 'No expiry date found for token' }
    }

    const now = new Date()
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    const result = {
      isExpired: now > expiryDate,
      daysUntilExpiry,
      shouldRefresh: daysUntilExpiry <= 7,
      expiryDate
    }
    
    logInfo(functionName, 'Token expiry check result:', result)

    return {
      status: 200,
      data: result
    }
  } catch (error) {
    logError(functionName, error, { userId })
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return { status: 500, message: `Error checking token expiry: ${errorMessage}` }
  }
}

/**
 * Get hashtag information and top posts
 */
export const searchHashtags = async (userId: string, hashtag: string) => {
  const functionName = 'searchHashtag'
  logInfo(functionName, `Searching hashtag: ${hashtag} for user: ${userId}`)
  
  try {
    const integration = await getIntegration(userId)
    if (!integration || integration.integrations.length === 0) {
      logWarning(functionName, 'No Instagram integration found')
      return { status: 404, message: 'No Instagram integration found' }
    }

    const accessToken = integration.integrations[0].token
    const instagramId = integration.integrations[0].instagramId
    
    logInfo(functionName, `Using Instagram ID: ${instagramId}`)
    
    // First get hashtag ID
    const hashtagSearchUrl = `${process.env.INSTAGRAM_BASE_URL}/ig_hashtag_search?user_id=${instagramId}&q=${hashtag}&access_token=${accessToken}`
    logInfo(functionName, `Hashtag search URL: ${hashtagSearchUrl.replace(accessToken, 'TOKEN_HIDDEN')}`)
    
    const hashtagResponse = await axios.get(hashtagSearchUrl)
    
    logInfo(functionName, 'Hashtag search response:', {
      status: hashtagResponse.status,
      foundHashtags: hashtagResponse.data.data?.length || 0,
      hashtags: hashtagResponse.data.data
    })

    if (hashtagResponse.data.data.length === 0) {
      logWarning(functionName, `Hashtag '${hashtag}' not found`)
      return { status: 404, message: 'Hashtag not found' }
    }

    const hashtagId = hashtagResponse.data.data[0].id
    logInfo(functionName, `Found hashtag ID: ${hashtagId}`)

    // Get hashtag info and top media
    const infoUrl = `${process.env.INSTAGRAM_BASE_URL}/${hashtagId}?fields=id,name&access_token=${accessToken}`
    const mediaUrl = `${process.env.INSTAGRAM_BASE_URL}/${hashtagId}/top_media?user_id=${instagramId}&fields=id,media_type,media_url,permalink,timestamp&access_token=${accessToken}`
    
    logInfo(functionName, `Info URL: ${infoUrl.replace(accessToken, 'TOKEN_HIDDEN')}`)
    logInfo(functionName, `Media URL: ${mediaUrl.replace(accessToken, 'TOKEN_HIDDEN')}`)

    const [infoResponse, mediaResponse] = await Promise.all([
      axios.get(infoUrl),
      axios.get(mediaUrl)
    ])
    
    logInfo(functionName, 'Hashtag data fetched successfully:', {
      infoStatus: infoResponse.status,
      mediaStatus: mediaResponse.status,
      topMediaCount: mediaResponse.data.data?.length || 0
    })

    return {
      status: 200,
      data: {
        hashtag: infoResponse.data,
        topMedia: mediaResponse.data.data
      }
    }
  } catch (error) {
    logError(functionName, error, { userId, hashtag })
    return { status: 500, message: 'Error searching hashtag' }
  }
}

/**
 * Get comments for a specific media post
 */
export const getMediaCommentss = async (userId: string, mediaId: string) => {
  const functionName = 'getMediaComments'
  logInfo(functionName, `Getting comments for media: ${mediaId}, user: ${userId}`)
  
  try {
    const integration = await getIntegration(userId)
    if (!integration || integration.integrations.length === 0) {
      logWarning(functionName, 'No Instagram integration found')
      return { status: 404, message: 'No Instagram integration found' }
    }

    const accessToken = integration.integrations[0].token
    const fields = 'id,text,timestamp,username,like_count'
    const url = `${process.env.INSTAGRAM_BASE_URL}/${mediaId}/comments?fields=${fields}&access_token=${accessToken}`
    
    logInfo(functionName, `Making request to: ${url.replace(accessToken, 'TOKEN_HIDDEN')}`)
    
    const response = await axios.get(url)
    
    logInfo(functionName, 'Comments fetched successfully:', {
      status: response.status,
      commentCount: response.data.data?.length || 0
    })

    return { status: 200, data: response.data.data }
  } catch (error) {
    logError(functionName, error, { userId, mediaId })
    return { status: 500, message: 'Error fetching media comments' }
  }
}

/**
 * Get user mentions in media
 */
export const getUserMentionss = async (userId: string, limit: number = 25) => {
  const functionName = 'getUserMentions'
  logInfo(functionName, `Getting mentions for user: ${userId}, limit: ${limit}`)
  
  try {
    const integration = await getIntegration(userId)
    if (!integration || integration.integrations.length === 0) {
      logWarning(functionName, 'No Instagram integration found')
      return { status: 404, message: 'No Instagram integration found' }
    }

    const accessToken = integration.integrations[0].token
    const fields = 'id,media_type,media_url,permalink,timestamp,caption'
    const url = `${process.env.INSTAGRAM_BASE_URL}/me/tags?fields=${fields}&limit=${limit}&access_token=${accessToken}`
    
    logInfo(functionName, `Making request to: ${url.replace(accessToken, 'TOKEN_HIDDEN')}`)
    
    const response = await axios.get(url)
    
    logInfo(functionName, 'Mentions fetched successfully:', {
      status: response.status,
      mentionCount: response.data.data?.length || 0
    })

    return { status: 200, data: response.data.data }
  } catch (error) {
    logError(functionName, error, { userId, limit })
    return { status: 500, message: 'Error fetching user mentions' }
  }
}

/**
 * Bulk operations for multiple integrations
 */
export const bulkRefreshIntegrationss = async (userId: string) => {
  const functionName = 'bulkRefreshIntegrations'
  logInfo(functionName, `Bulk refreshing integrations for user: ${userId}`)
  
  try {
    const integration = await getIntegration(userId)
    if (!integration || integration.integrations.length === 0) {
      logWarning(functionName, 'No Instagram integrations found')
      return { status: 404, message: 'No Instagram integrations found' }
    }

    logInfo(functionName, `Found ${integration.integrations.length} integrations to refresh`)

    const results = await Promise.allSettled(
      integration.integrations.map(async (int, index) => {
        logInfo(functionName, `Refreshing integration ${index + 1}/${integration.integrations.length}`)
        const instaData = await fetchInstagramData(int.token)
        await updateIntegrationData(int.id, instaData)
        return { integrationId: int.id, data: instaData }
      })
    )

    const successful = results.filter(r => r.status === 'fulfilled').map(r => r.value)
    const failed = results.filter(r => r.status === 'rejected').length

    logInfo(functionName, `Bulk refresh completed: ${successful.length} successful, ${failed} failed`)

    return {
      status: 200,
      data: {
        successful: successful.length,
        failed,
        results: successful
      }
    }
  } catch (error) {
    logError(functionName, error, { userId })
    return { status: 500, message: 'Error bulk refreshing integrations' }
  }
}

/**
 * Validate Instagram connection health
 */
export const validateConnections = async (userId: string) => {
  const functionName = 'validateConnection'
  logInfo(functionName, `Validating connection for user: ${userId}`)
  
  try {
    const integration = await getIntegration(userId)
    logInfo(functionName, 'Integration data:', {
      hasIntegration: !!integration,
      integrationCount: integration?.integrations?.length || 0,
      firstIntegration: integration?.integrations?.[0] ? {
        id: integration.integrations[0].id,
        tokenPrefix: integration.integrations[0].token?.substring(0, 20) + '...',
        expiresAt: integration.integrations[0].expiresAt,
        instagramId: integration.integrations[0].instagramId
      } : null
    })
    
    if (!integration || integration.integrations.length === 0) {
      logWarning(functionName, 'No Instagram integration found')
      return { status: 404, message: 'No Instagram integration found' }
    }

    const accessToken = integration.integrations[0].token
    const url = `${process.env.INSTAGRAM_BASE_URL}/me?fields=id,username&access_token=${accessToken}`
    
    logInfo(functionName, `Making validation request to: ${url.replace(accessToken, 'TOKEN_HIDDEN')}`)
    logInfo(functionName, 'Environment check:', {
      baseUrl: process.env.INSTAGRAM_BASE_URL,
      tokenLength: accessToken?.length,
      tokenPrefix: accessToken?.substring(0, 20) + '...'
    })
    
    // Test connection with a simple API call
    const response = await axios.get(url)
    
    logInfo(functionName, 'Validation API response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    })

    const tokenExpiry = await checkTokenExpiry(userId)
    logInfo(functionName, 'Token expiry check result:', tokenExpiry)

    const result = {
      status: 200,
      data: {
        isValid: true,
        username: response.data.username,
        instagramId: response.data.id,
        tokenExpiry: tokenExpiry.data
      }
    }
    
    logInfo(functionName, 'Connection validation successful:', result)
    return result
    
  } catch (error) {
    logError(functionName, error, { 
      userId,
      baseUrl: process.env.INSTAGRAM_BASE_URL
    })
    
    // Enhanced error message extraction
    let errorMessage = 'Connection invalid'
    let errorDetails = {}
    
    if (axios.isAxiosError(error)) {
      errorDetails = {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        code: error.code,
        message: error.message
      }
      
      if (error.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
    }
    
    logError(functionName, `Connection validation failed with detailed error:`, errorDetails)
    
    return {
      status: 401,
      data: {
        isValid: false,
        error: errorMessage,
        errorDetails
      }
    }
  }
}




//////

//AI INSIGHTS




/**
 * Generate AI-powered content strategy based on user's Instagram data
 */
// export const generateContentStrategy = async (userId: string) => {
//   try {
//     // Fetch user's Instagram data
//     const mediaData = await fetchInstagramMedia(userId, 50)
//     const insightsData = await getAccountInsights(userId, "days_28")

//     if (mediaData.status !== 200 || insightsData.status !== 200) {
//       return { status: 404, message: "Unable to fetch Instagram data" }
//     }

//     // Analyze content performance with AI
//     const { text } = await generateText({
//       model: openai("gpt-4o"),
//       system: `You are an expert Instagram marketing strategist. Analyze the provided Instagram data and generate actionable content strategy recommendations.`,
//       prompt: `
//         Analyze this Instagram account data and provide a comprehensive content strategy:
        
//         Recent Posts: ${JSON.stringify(mediaData.data?.slice(0, 10))}
//         Account Insights: ${JSON.stringify(insightsData.data)}
        
//         Please provide:
//         1. Content themes that perform best
//         2. Optimal posting frequency
//         3. Content type recommendations (photos, videos, reels, stories)
//         4. Engagement optimization strategies
//         5. Growth opportunities
//         6. Specific recommendations with actionable advice
        
//         Format as JSON with the following structure:
//         {
//           "contentThemes": [{"theme": "string", "performance": "string"}],
//           "postingFrequency": {"optimal": "string", "reasoning": "string"},
//           "contentTypes": [{"type": "string", "recommendation": "string"}],
//           "engagementStrategies": [{"strategy": "string", "impact": "string"}],
//           "growthOpportunities": [{"opportunity": "string", "potential": "string"}],
//           "recommendations": [{"title": "string", "description": "string"}],
//           "reports": [{"name": "string", "date": "string"}]
//         }
//       `,
//     })

//     return { status: 200, data: JSON.parse(text) }
//   } catch (error) {
//     console.error("Error generating content strategy:", error)
//     return { status: 500, message: "Error generating content strategy" }
//   }
// }

// /**
//  * Analyze post performance and provide insights
//  */
// export const analyzePostPerformance = async (userId: string, mediaId: string) => {
//   try {
//     const integration = await getIntegration(userId)
//     if (!integration || integration.integrations.length === 0) {
//       return { status: 404, message: "No Instagram integration found" }
//     }

//     // Get post data and insights
//     const mediaData = await fetchInstagramMedia(userId, 100)
//     const specificPost = mediaData.data?.find((post: any) => post.id === mediaId)

//     if (!specificPost) {
//       return { status: 404, message: "Post not found" }
//     }

//     const { text } = await generateText({
//       model: openai("gpt-4o"),
//       system: `You are an Instagram analytics expert. Analyze post performance and provide detailed insights.`,
//       prompt: `
//         Analyze this Instagram post performance:
        
//         Post Data: ${JSON.stringify(specificPost)}
        
//         Provide insights on:
//         1. Performance vs account average
//         2. What made this post successful/unsuccessful
//         3. Recommendations for similar content
//         4. Optimal timing suggestions
//         5. Hashtag effectiveness
        
//         Return as JSON with specific metrics and recommendations.
//       `,
//     })

//     return { status: 200, data: JSON.parse(text) }
//   } catch (error) {
//     console.error("Error analyzing post performance:", error)
//     return { status: 500, message: "Error analyzing post performance" }
//   }
// }

// /**
//  * Get AI-optimized posting times based on audience behavior
//  */
// export const getOptimalPostingTimes = async (userId: string) => {
//   try {
//     const mediaData = await fetchInstagramMedia(userId, 100)
//     const insightsData = await getAccountInsights(userId, "days_28")

//     if (mediaData.status !== 200) {
//       return { status: 404, message: "Unable to fetch media data" }
//     }

//     const { text } = await generateText({
//       model: openai("gpt-4o"),
//       system: `You are a data scientist specializing in social media analytics. Analyze posting patterns and engagement to determine optimal posting times.`,
//       prompt: `
//         Analyze this Instagram data to determine optimal posting times:
        
//         Posts with timestamps and engagement: ${JSON.stringify(mediaData.data)}
//         Account insights: ${JSON.stringify(insightsData.data)}
        
//         Calculate:
//         1. Best days of the week to post
//         2. Optimal hours for maximum engagement
//         3. Content type specific timing (photos vs videos vs reels)
//         4. Audience activity patterns
        
//         Return as JSON with the following structure:
//         {
//           "schedule": [
//             {
//               "day": "Monday",
//               "times": ["7-9 PM", "12-2 PM"]
//             },
//             {
//               "day": "Tuesday",
//               "times": ["8-10 PM", "1-3 PM"]
//             },
//             ...for all days of the week
//           ],
//           "contentTypeTimings": {
//             "photos": ["time ranges"],
//             "videos": ["time ranges"],
//             "reels": ["time ranges"],
//             "stories": ["time ranges"]
//           },
//           "audienceActivityPeaks": ["time ranges"]
//         }
//       `,
//     })

//     return { status: 200, data: JSON.parse(text) }
//   } catch (error) {
//     console.error("Error getting optimal posting times:", error)
//     return { status: 500, message: "Error getting optimal posting times" }
//   }
// }





// // Initialize Gemini (add your API key to environment variables)
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// /**
//  * Generate smart hashtag suggestions based on content and performance
//  */
// export const generateHashtagSuggestions = async (userId: string, contentDescription: string) => {
//   try {
//     const mediaData = await fetchInstagramMedia(userId, 50)

//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
//     const prompt = `
//       You are a hashtag optimization expert. Generate relevant, high-performing hashtags based on content and account performance.
      
//       Generate hashtag suggestions for this content: "${contentDescription}"
      
//       Based on this account's previous posts: ${JSON.stringify(mediaData.data?.slice(0, 10))}
      
//       Provide:
//       1. 10 high-performance hashtags (popular, competitive)
//       2. 10 niche-specific hashtags (targeted, less competitive)
//       3. 5 trending hashtags (current trends)
//       4. 5 branded/community hashtags
      
//       Return as JSON with the following structure:
//       {
//         "high_performance": ["hashtag1", "hashtag2", ...],
//         "niche_specific": ["hashtag1", "hashtag2", ...],
//         "trending": ["hashtag1", "hashtag2", ...],
//         "branded": ["hashtag1", "hashtag2", ...]
//       }
      
//       Do not include explanations, just the JSON object with arrays of hashtags.
//     `;

//     const result = await model.generateContent(prompt);
//     const text = result.response.text();
    
//     // Clean up the response (remove markdown formatting if present)
//     const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

//     return { status: 200, data: JSON.parse(cleanText) }
//   } catch (error) {
//     console.error("Error generating hashtag suggestions:", error)
//     return { status: 500, message: "Error generating hashtag suggestions" }
//   }
// }

// /**
//  * Analyze competitors and provide competitive insights
//  */
// export const analyzeCompetitors = async (userId: string) => {
//   try {
//     const userMediaData = await fetchInstagramMedia(userId, 50)
//     const userInsights = await getAccountInsights(userId, "days_28")

//     // In a real implementation, you'd fetch competitor data from Instagram API
//     // For now, we'll simulate competitor analysis with AI

//     const { text } = await generateText({
//       model: openai("gpt-4o"),
//       system: `You are a competitive intelligence analyst for social media marketing. Analyze account performance and provide competitive insights.`,
//       prompt: `
//         Analyze this Instagram account's competitive position:
        
//         User's Posts: ${JSON.stringify(userMediaData.data?.slice(0, 10))}
//         User's Insights: ${JSON.stringify(userInsights.data)}
        
//         Provide competitive analysis including:
//         1. Content strategy gaps
//         2. Engagement rate benchmarks
//         3. Content type opportunities
//         4. Hashtag strategy improvements
//         5. Posting frequency recommendations
        
//         Return as JSON with the following structure:
//         {
//           "competitors": [
//             {
//               "username": "competitor1",
//               "category": "Fashion Brand",
//               "engagementRate": "5.2%",
//               "comparison": "better/worse",
//               "comparisonText": "vs your 4.2%"
//             },
//             {
//               "username": "competitor2",
//               "category": "Lifestyle Brand",
//               "engagementRate": "3.8%",
//               "comparison": "better/worse",
//               "comparisonText": "vs your 4.2%"
//             }
//           ],
//           "contentGaps": [
//             {"gap": "string", "opportunity": "string"}
//           ],
//           "hashtagRecommendations": [
//             {"hashtag": "string", "reason": "string"}
//           ],
//           "frequencyInsights": {
//             "recommendation": "string",
//             "reasoning": "string"
//           }
//         }
//       `,
//     })

//     return { status: 200, data: JSON.parse(text) }
//   } catch (error) {
//     console.error("Error analyzing competitors:", error)
//     return { status: 500, message: "Error analyzing competitors" }
//   }
// }

// /**
//  * Generate AI-powered captions for content
//  */
// export const generateCaptions = async (userId: string, contentDescription: string, tone = "professional") => {
//   try {
//     const integration = await getIntegration(userId)
//     if (!integration || integration.integrations.length === 0) {
//       return { status: 404, message: "No Instagram integration found" }
//     }

//     // Get user's previous posts to understand their voice
//     const mediaData = await fetchInstagramMedia(userId, 20)
//     const previousCaptions = mediaData.data
//       ?.map((post: any) => post.caption)
//       .filter(Boolean)
//       .slice(0, 10)

//     const { text } = await generateText({
//       model: openai("gpt-4o"),
//       system: `You are a creative copywriter specializing in Instagram content. Generate engaging captions that match the user's brand voice and style.`,
//       prompt: `
//         Generate an Instagram caption for: "${contentDescription}"
        
//         Tone: ${tone}
        
//         Previous captions for voice reference: ${JSON.stringify(previousCaptions)}
        
//         Create a caption that:
//         1. Matches the user's established voice and style
//         2. Includes relevant hashtags
//         3. Encourages engagement
//         4. Is optimized for Instagram's algorithm
//         5. Includes a call-to-action
        
//         Return as JSON with the following structure:
//         {
//           "caption": "The full caption text",
//           "suggestedHashtags": ["hashtag1", "hashtag2", ...],
//           "callToAction": "The specific call to action",
//           "toneAnalysis": "Brief analysis of the tone used"
//         }
//       `,
//     })

//     return { status: 200, data: JSON.parse(text) }
//   } catch (error) {
//     console.error("Error generating captions:", error)
//     return { status: 500, message: "Error generating captions" }
//   }
// }

// /**
//  * Predict engagement for potential posts
//  */
// export const predictEngagement = async (userId: string, postData: any) => {
//   try {
//     const mediaData = await fetchInstagramMedia(userId, 100)

//     const { text } = await generateText({
//       model: openai("gpt-4o"),
//       system: `You are a machine learning expert specializing in social media engagement prediction. Analyze historical data to predict engagement.`,
//       prompt: `
//         Predict engagement for this potential post based on historical data:
        
//         Proposed Post: ${JSON.stringify(postData)}
//         Historical Posts: ${JSON.stringify(mediaData.data)}
        
//         Analyze and predict:
//         1. Expected likes range
//         2. Expected comments range
//         3. Expected reach
//         4. Engagement rate prediction
//         5. Factors affecting performance
        
//         Return as JSON with predictions and confidence scores.
//       `,
//     })

//     return { status: 200, data: JSON.parse(text) }
//   } catch (error) {
//     console.error("Error predicting engagement:", error)
//     return { status: 500, message: "Error predicting engagement" }
//   }
// }

// /**
//  * Get AI-powered audience insights
//  */
// export const getAudienceInsights = async (userId: string) => {
//   try {
//     const mediaData = await fetchInstagramMedia(userId, 100)
//     const insightsData = await getAccountInsights(userId, "days_28")

//     const { text } = await generateText({
//       model: openai("gpt-4o"),
//       system: `You are an audience research specialist. Analyze engagement patterns to provide deep audience insights.`,
//       prompt: `
//         Analyze this Instagram data to understand the audience:
        
//         Posts and Engagement: ${JSON.stringify(mediaData.data)}
//         Account Insights: ${JSON.stringify(insightsData.data)}
        
//         Provide insights on:
//         1. Audience demographics (inferred from engagement patterns)
//         2. Content preferences
//         3. Engagement behavior patterns
//         4. Best content themes for this audience
//         5. Growth opportunities
        
//         Return as JSON with the following structure:
//         {
//           "performanceScores": [
//             {"name": "Overall Score", "value": 87},
//             {"name": "Content Quality", "value": 92},
//             {"name": "Engagement Rate", "value": 73}
//           ],
//           "audienceDemographics": {
//             "ageRanges": ["string"],
//             "interests": ["string"],
//             "activeHours": ["string"]
//           },
//           "contentPreferences": [
//             {"type": "string", "engagement": "string"}
//           ],
//           "growthProjection": {
//             "monthly": "+247",
//             "quarterly": "string"
//           },
//           "growthFactors": [
//             {"name": "Content consistency", "impact": "+15%"},
//             {"name": "Hashtag optimization", "impact": "+23%"},
//             {"name": "Engagement timing", "impact": "+18%"}
//           ],
//           "engagementFactors": [
//             {"name": "Story interactions", "impact": "+12%"},
//             {"name": "Comment responses", "impact": "+8%"},
//             {"name": "Share rate", "impact": "+5%"}
//           ],
//           "currentEngagementRate": "4.2%",
//           "automationSettings": [
//             {"name": "Auto-like relevant posts", "active": true},
//             {"name": "Auto-follow back", "active": false},
//             {"name": "Smart comment replies", "active": true}
//           ]
//         }
//       `,
//     })

//     return { status: 200, data: JSON.parse(text) }
//   } catch (error) {
//     console.error("Error getting audience insights:", error)
//     return { status: 500, message: "Error getting audience insights" }
//   }
// }

// /**
//  * Generate comprehensive growth strategy
//  */
// export const generateGrowthStrategy = async (userId: string) => {
//   try {
//     const mediaData = await fetchInstagramMedia(userId, 100)
//     const insightsData = await getAccountInsights(userId, "days_28")

//     const { text } = await generateText({
//       model: openai("gpt-4o"),
//       system: `You are a growth marketing expert specializing in Instagram. Create comprehensive growth strategies based on data analysis.`,
//       prompt: `
//         Create a growth strategy for this Instagram account:
        
//         Current Performance: ${JSON.stringify(mediaData.data?.slice(0, 20))}
//         Account Insights: ${JSON.stringify(insightsData.data)}
        
//         Develop a strategy including:
//         1. 30-day growth plan
//         2. Content strategy recommendations
//         3. Engagement tactics
//         4. Hashtag strategy
//         5. Collaboration opportunities
//         6. Specific KPIs and targets
        
//         Return as JSON with actionable growth plan.
//       `,
//     })

//     return { status: 200, data: JSON.parse(text) }
//   } catch (error) {
//     console.error("Error generating growth strategy:", error)
//     return { status: 500, message: "Error generating growth strategy" }
//   }
// }

// /**
//  * Create AI-optimized content calendar
//  */
// export const createContentCalendar = async (userId: string, days = 30) => {
//   try {
//     const mediaData = await fetchInstagramMedia(userId, 50)
//     const optimalTimes = await getOptimalPostingTimes(userId)

//     const { text } = await generateText({
//       model: openai("gpt-4o"),
//       system: `You are a content planning expert. Create optimized content calendars based on performance data and best practices.`,
//       prompt: `
//         Create a ${days}-day content calendar for this Instagram account:
        
//         Historical Performance: ${JSON.stringify(mediaData.data?.slice(0, 20))}
//         Optimal Posting Times: ${JSON.stringify(optimalTimes.data)}
        
//         Include:
//         1. Daily posting schedule with optimal times
//         2. Content type variety (photos, videos, reels, stories)
//         3. Content themes and topics
        
//         Return as JSON with the following structure:
//         {
//           "days": [
//             {
//               "date": "Mon, 28",
//               "posts": [
//                 {"type": "reel", "time": "7 PM", "theme": "string"},
//                 {"type": "story", "time": "12 PM", "theme": "string"}
//               ]
//             },
//             ... (for each day)
//           ],
//           "scheduledCount": 12,
//           "scheduleSummary": [
//             {"label": "Next post", "value": "Today 7:00 PM"},
//             {"label": "This week", "value": "5 posts"}
//           ]
//         }
//       `,
//     })

//     return { status: 200, data: JSON.parse(text) }
//   } catch (error) {
//     console.error("Error creating content calendar:", error)
//     return { status: 500, message: "Error creating content calendar" }
//   }
// }

// /**
//  * Analyze content trends and opportunities
//  */
// export const analyzeContentTrends = async (userId: string) => {
//   try {
//     const mediaData = await fetchInstagramMedia(userId, 100)

//     const { text } = await generateText({
//       model: openai("gpt-4o"),
//       system: `You are a trend analyst specializing in social media content. Identify trends and opportunities from content performance data.`,
//       prompt: `
//         Analyze content trends from this Instagram data:
        
//         Posts with Performance Data: ${JSON.stringify(mediaData.data)}
        
//         Identify:
//         1. Top performing content themes
//         2. Emerging content opportunities
//         3. Seasonal trends
//         4. Content format preferences
//         5. Hashtag trends
//         6. Engagement pattern trends
        
//         Return as JSON with the following structure:
//         {
//           "topThemes": [
//             {"theme": "string", "performance": "string"}
//           ],
//           "emergingOpportunities": [
//             {"opportunity": "string", "potential": "string"}
//           ],
//           "formatPreferences": [
//             {"format": "string", "engagement": "string"}
//           ],
//           "hashtagTrends": [
//             {"hashtag": "string", "trend": "string"}
//           ],
//           "growthMetrics": [
//             {"name": "Follower Growth", "description": "+12% this month", "trend": "up"},
//             {"name": "Engagement Rate", "description": "-3% this week", "trend": "down"},
//             {"name": "Story Views", "description": "+8% this week", "trend": "up"}
//           ]
//         }
//       `,
//     })

//     return { status: 200, data: JSON.parse(text) }
//   } catch (error) {
//     console.error("Error analyzing content trends:", error)
//     return { status: 500, message: "Error analyzing content trends" }
//   }
// }

// /**
//  * Generate comprehensive reports
//  */
// export const generateReports = async (userId: string, period: "day" | "week" | "days_28") => {
//   try {
//     const mediaData = await fetchInstagramMedia(userId, 100)
//     const insightsData = await getAccountInsights(userId, period)
//     const contentStrategy = await generateContentStrategy(userId)

//     const { text } = await generateText({
//       model: openai("gpt-4o"),
//       system: `You are a data analyst creating comprehensive Instagram performance reports. Generate detailed, actionable reports with insights and recommendations.`,
//       prompt: `
//         Generate a comprehensive Instagram performance report:
        
//         Period: ${period}
//         Media Data: ${JSON.stringify(mediaData.data?.slice(0, 50))}
//         Insights Data: ${JSON.stringify(insightsData.data)}
//         Content Strategy: ${JSON.stringify(contentStrategy.data)}
        
//         Include:
//         1. Executive summary
//         2. Key performance metrics
//         3. Content performance analysis
//         4. Audience insights
//         5. Growth opportunities
//         6. Actionable recommendations
//         7. Next period strategy
        
//         Return as JSON with comprehensive report structure.
//       `,
//     })

//     return { status: 200, data: JSON.parse(text) }
//   } catch (error) {
//     console.error("Error generating reports:", error)
//     return { status: 500, message: "Error generating reports" }
//   }
// }



// Initialize Gemini (add your API key to environment variables)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/**
 * Helper function to call Gemini API with error handling
 */
const callGemini = async (prompt: string): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  
  // Clean up the response (remove markdown formatting if present)
  return text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
};

export const generateContentStrategy = async (userId: string) => {
  try {
    // Fetch user's Instagram data
    const mediaData = await fetchInstagramMedia(userId, 50)
    const insightsData = await getAccountInsights(userId, "days_28")

    if (mediaData.status !== 200 || insightsData.status !== 200) {
      return { status: 404, message: "Unable to fetch Instagram data" }
    }

    const prompt = `
      You are an expert Instagram marketing strategist. Analyze the provided Instagram data and generate actionable content strategy recommendations.
      
      Analyze this Instagram account data and provide a comprehensive content strategy:
      
      Recent Posts: ${JSON.stringify(mediaData.data?.slice(0, 10))}
      Account Insights: ${JSON.stringify(insightsData.data)}
      
      Please provide:
      1. Content themes that perform best
      2. Optimal posting frequency
      3. Content type recommendations (photos, videos, reels, stories)
      4. Engagement optimization strategies
      5. Growth opportunities
      6. Specific recommendations with actionable advice
      
      Format as JSON with the following structure:
      {
        "contentThemes": [{"theme": "string", "performance": "string"}],
        "postingFrequency": {"optimal": "string", "reasoning": "string"},
        "contentTypes": [{"type": "string", "recommendation": "string"}],
        "engagementStrategies": [{"strategy": "string", "impact": "string"}],
        "growthOpportunities": [{"opportunity": "string", "potential": "string"}],
        "recommendations": [{"title": "string", "description": "string"}],
        "reports": [{"name": "string", "date": "string"}]
      }
    `;

    const text = await callGemini(prompt);
    return { status: 200, data: JSON.parse(text) }
  } catch (error) {
    console.error("Error generating content strategy:", error)
    return { status: 500, message: "Error generating content strategy" }
  }
}

/**
 * Analyze post performance and provide insights
 */
export const analyzePostPerformance = async (userId: string, mediaId: string) => {
  try {
    const integration = await getIntegration(userId)
    if (!integration || integration.integrations.length === 0) {
      return { status: 404, message: "No Instagram integration found" }
    }

    // Get post data and insights
    const mediaData = await fetchInstagramMedia(userId, 100)
    const specificPost = mediaData.data?.find((post: any) => post.id === mediaId)

    if (!specificPost) {
      return { status: 404, message: "Post not found" }
    }

    const prompt = `
      You are an Instagram analytics expert. Analyze post performance and provide detailed insights.
      
      Analyze this Instagram post performance:
      
      Post Data: ${JSON.stringify(specificPost)}
      
      Provide insights on:
      1. Performance vs account average
      2. What made this post successful/unsuccessful
      3. Recommendations for similar content
      4. Optimal timing suggestions
      5. Hashtag effectiveness
      
      Return as JSON with specific metrics and recommendations.
    `;

    const text = await callGemini(prompt);
    return { status: 200, data: JSON.parse(text) }
  } catch (error) {
    console.error("Error analyzing post performance:", error)
    return { status: 500, message: "Error analyzing post performance" }
  }
}

/**
 * Get AI-optimized posting times based on audience behavior
 */
export const getOptimalPostingTimesE = async (userId: string) => {
  try {
    const mediaData = await fetchInstagramMedia(userId, 100)
    const insightsData = await getAccountInsights(userId, "days_28")

    if (mediaData.status !== 200) {
      return { status: 404, message: "Unable to fetch media data" }
    }

    const prompt = `
      You are a data scientist specializing in social media analytics. Analyze posting patterns and engagement to determine optimal posting times.
      
      Analyze this Instagram data to determine optimal posting times:
      
      Posts with timestamps and engagement: ${JSON.stringify(mediaData.data)}
      Account insights: ${JSON.stringify(insightsData.data)}
      
      Calculate:
      1. Best days of the week to post
      2. Optimal hours for maximum engagement
      3. Content type specific timing (photos vs videos vs reels)
      4. Audience activity patterns
      
      Return as JSON with the following structure:
      {
        "schedule": [
          {
            "day": "Monday",
            "times": ["7-9 PM", "12-2 PM"]
          },
          {
            "day": "Tuesday",
            "times": ["8-10 PM", "1-3 PM"]
          }
        ],
        "contentTypeTimings": {
          "photos": ["time ranges"],
          "videos": ["time ranges"],
          "reels": ["time ranges"],
          "stories": ["time ranges"]
        },
        "audienceActivityPeaks": ["time ranges"]
      }
    `;

    const text = await callGemini(prompt);
    return { status: 200, data: JSON.parse(text) }
  } catch (error) {
    console.error("Error getting optimal posting times:", error)
    return { status: 500, message: "Error getting optimal posting times" }
  }
}

/**
 * Generate smart hashtag suggestions based on content and performance
 */
export const generateHashtagSuggestions = async (userId: string, contentDescription: string) => {
  try {
    const mediaData = await fetchInstagramMedia(userId, 50)

    const prompt = `
      You are a hashtag optimization expert. Generate relevant, high-performing hashtags based on content and account performance.
      
      Generate hashtag suggestions for this content: "${contentDescription}"
      
      Based on this account's previous posts: ${JSON.stringify(mediaData.data?.slice(0, 10))}
      
      Provide:
      1. 10 high-performance hashtags (popular, competitive)
      2. 10 niche-specific hashtags (targeted, less competitive)
      3. 5 trending hashtags (current trends)
      4. 5 branded/community hashtags
      
      Return as JSON with the following structure:
      {
        "high_performance": ["hashtag1", "hashtag2"],
        "niche_specific": ["hashtag1", "hashtag2"],
        "trending": ["hashtag1", "hashtag2"],
        "branded": ["hashtag1", "hashtag2"]
      }
      
      Do not include explanations, just the JSON object with arrays of hashtags.
    `;

    const text = await callGemini(prompt);
    return { status: 200, data: JSON.parse(text) }
  } catch (error) {
    console.error("Error generating hashtag suggestions:", error)
    return { status: 500, message: "Error generating hashtag suggestions" }
  }
}

/**
 * Analyze competitors and provide competitive insights
 */
export const analyzeCompetitors = async (userId: string) => {
  try {
    const userMediaData = await fetchInstagramMedia(userId, 50)
    const userInsights = await getAccountInsights(userId, "days_28")

    const prompt = `
      You are a competitive intelligence analyst for social media marketing. Analyze account performance and provide competitive insights.
      
      Analyze this Instagram account's competitive position:
      
      User's Posts: ${JSON.stringify(userMediaData.data?.slice(0, 10))}
      User's Insights: ${JSON.stringify(userInsights.data)}
      
      Provide competitive analysis including:
      1. Content strategy gaps
      2. Engagement rate benchmarks
      3. Content type opportunities
      4. Hashtag strategy improvements
      5. Posting frequency recommendations
      
      Return as JSON with the following structure:
      {
        "competitors": [
          {
            "username": "competitor1",
            "category": "Fashion Brand",
            "engagementRate": "5.2%",
            "comparison": "better/worse",
            "comparisonText": "vs your 4.2%"
          }
        ],
        "contentGaps": [
          {"gap": "string", "opportunity": "string"}
        ],
        "hashtagRecommendations": [
          {"hashtag": "string", "reason": "string"}
        ],
        "frequencyInsights": {
          "recommendation": "string",
          "reasoning": "string"
        }
      }
    `;

    const text = await callGemini(prompt);
    return { status: 200, data: JSON.parse(text) }
  } catch (error) {
    console.error("Error analyzing competitors:", error)
    return { status: 500, message: "Error analyzing competitors" }
  }
}

/**
 * Generate AI-powered captions for content
 */
export const generateCaptions = async (userId: string, contentDescription: string, tone = "professional") => {
  try {
    const integration = await getIntegration(userId)
    if (!integration || integration.integrations.length === 0) {
      return { status: 404, message: "No Instagram integration found" }
    }

    // Get user's previous posts to understand their voice
    const mediaData = await fetchInstagramMedia(userId, 20)
    const previousCaptions = mediaData.data
      ?.map((post: any) => post.caption)
      .filter(Boolean)
      .slice(0, 10)

    const prompt = `
      You are a creative copywriter specializing in Instagram content. Generate engaging captions that match the user's brand voice and style.
      
      Generate an Instagram caption for: "${contentDescription}"
      
      Tone: ${tone}
      
      Previous captions for voice reference: ${JSON.stringify(previousCaptions)}
      
      Create a caption that:
      1. Matches the user's established voice and style
      2. Includes relevant hashtags
      3. Encourages engagement
      4. Is optimized for Instagram's algorithm
      5. Includes a call-to-action
      
      Return as JSON with the following structure:
      {
        "caption": "The full caption text",
        "suggestedHashtags": ["hashtag1", "hashtag2"],
        "callToAction": "The specific call to action",
        "toneAnalysis": "Brief analysis of the tone used"
      }
    `;

    const text = await callGemini(prompt);
    return { status: 200, data: JSON.parse(text) }
  } catch (error) {
    console.error("Error generating captions:", error)
    return { status: 500, message: "Error generating captions" }
  }
}

/**
 * Predict engagement for potential posts
 */
export const predictEngagement = async (userId: string, postData: any) => {
  try {
    const mediaData = await fetchInstagramMedia(userId, 100)

    const prompt = `
      You are a machine learning expert specializing in social media engagement prediction. Analyze historical data to predict engagement.
      
      Predict engagement for this potential post based on historical data:
      
      Proposed Post: ${JSON.stringify(postData)}
      Historical Posts: ${JSON.stringify(mediaData.data)}
      
      Analyze and predict:
      1. Expected likes range
      2. Expected comments range
      3. Expected reach
      4. Engagement rate prediction
      5. Factors affecting performance
      
      Return as JSON with predictions and confidence scores.
    `;

    const text = await callGemini(prompt);
    return { status: 200, data: JSON.parse(text) }
  } catch (error) {
    console.error("Error predicting engagement:", error)
    return { status: 500, message: "Error predicting engagement" }
  }
}

/**
 * Get AI-powered audience insights
 */
export const getAudienceInsightsE = async (userId: string) => {
  try {
    const mediaData = await fetchInstagramMedia(userId, 100)
    const insightsData = await getAccountInsights(userId, "days_28")

    const prompt = `
      You are an audience research specialist. Analyze engagement patterns to provide deep audience insights.
      
      Analyze this Instagram data to understand the audience:
      
      Posts and Engagement: ${JSON.stringify(mediaData.data)}
      Account Insights: ${JSON.stringify(insightsData.data)}
      
      Provide insights on:
      1. Audience demographics (inferred from engagement patterns)
      2. Content preferences
      3. Engagement behavior patterns
      4. Best content themes for this audience
      5. Growth opportunities
      
      Return as JSON with the following structure:
      {
        "performanceScores": [
          {"name": "Overall Score", "value": 87},
          {"name": "Content Quality", "value": 92},
          {"name": "Engagement Rate", "value": 73}
        ],
        "audienceDemographics": {
          "ageRanges": ["string"],
          "interests": ["string"],
          "activeHours": ["string"]
        },
        "contentPreferences": [
          {"type": "string", "engagement": "string"}
        ],
        "growthProjection": {
          "monthly": "+247",
          "quarterly": "string"
        },
        "growthFactors": [
          {"name": "Content consistency", "impact": "+15%"},
          {"name": "Hashtag optimization", "impact": "+23%"},
          {"name": "Engagement timing", "impact": "+18%"}
        ],
        "engagementFactors": [
          {"name": "Story interactions", "impact": "+12%"},
          {"name": "Comment responses", "impact": "+8%"},
          {"name": "Share rate", "impact": "+5%"}
        ],
        "currentEngagementRate": "4.2%",
        "automationSettings": [
          {"name": "Auto-like relevant posts", "active": true},
          {"name": "Auto-follow back", "active": false},
          {"name": "Smart comment replies", "active": true}
        ]
      }
    `;

    const text = await callGemini(prompt);
    return { status: 200, data: JSON.parse(text) }
  } catch (error) {
    console.error("Error getting audience insights:", error)
    return { status: 500, message: "Error getting audience insights" }
  }
}

/**
 * Generate comprehensive growth strategy
 */
export const getAudienceInsights = async (userId: string) => {
  try {
    const mediaData = await fetchInstagramMedia(userId, 100)
    const insightsData = await getAccountInsights(userId, "days_28")
    
    const prompt = `
      You are an audience research specialist. Analyze engagement patterns to provide deep audience insights.
      
      IMPORTANT: Return ONLY valid JSON, no explanatory text, no markdown formatting.
      
      Analyze this Instagram data to understand the audience:
      
      Posts and Engagement: ${JSON.stringify(mediaData.data)}
      Account Insights: ${JSON.stringify(insightsData.data)}
      
      Provide insights on:
      1. Audience demographics (inferred from engagement patterns)
      2. Content preferences
      3. Engagement behavior patterns
      4. Best content themes for this audience
      5. Growth opportunities
      
      Return ONLY the JSON object with this exact structure:
      {
        "performanceScores": [
          {"name": "Overall Score", "value": 87},
          {"name": "Content Quality", "value": 92},
          {"name": "Engagement Rate", "value": 73}
        ],
        "audienceDemographics": {
          "ageRanges": ["string"],
          "interests": ["string"],
          "activeHours": ["string"]
        },
        "contentPreferences": [
          {"type": "string", "engagement": "string"}
        ],
        "growthProjection": {
          "monthly": "+247",
          "quarterly": "string"
        },
        "growthFactors": [
          {"name": "Content consistency", "impact": "+15%"},
          {"name": "Hashtag optimization", "impact": "+23%"},
          {"name": "Engagement timing", "impact": "+18%"}
        ],
        "engagementFactors": [
          {"name": "Story interactions", "impact": "+12%"},
          {"name": "Comment responses", "impact": "+8%"},
          {"name": "Share rate", "impact": "+5%"}
        ],
        "currentEngagementRate": "4.2%",
        "automationSettings": [
          {"name": "Auto-like relevant posts", "active": true},
          {"name": "Auto-follow back", "active": false},
          {"name": "Smart comment replies", "active": true}
        ]
      }
    `;

    const text = await callGemini(prompt);
    
    // Clean the response
    const cleanedText = cleanJsonResponse(text);
    
    return { status: 200, data: JSON.parse(cleanedText) }
  } catch (error) {
    console.error("Error getting audience insights:", error)
    console.error("Raw response:", Text) // Log the raw response for debugging
    return { status: 500, message: "Error getting audience insights" }
  }
}

// Helper function to clean JSON response
function cleanJsonResponse(text: string): string {
  // Remove markdown code blocks
  let cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
  
  // Find the first { and last }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  
  return cleaned.trim();
}


export const generateGrowthStrategy = async (userId: string) => {
  try {
    const mediaData = await fetchInstagramMedia(userId, 100)
    const insightsData = await getAccountInsights(userId, "days_28")

    const prompt = `
      You are a growth marketing expert specializing in Instagram. Create comprehensive growth strategies based on data analysis.
      
      Create a growth strategy for this Instagram account:
      
      Current Performance: ${JSON.stringify(mediaData.data?.slice(0, 20))}
      Account Insights: ${JSON.stringify(insightsData.data)}
      
      Develop a strategy including:
      1. 30-day growth plan
      2. Content strategy recommendations
      3. Engagement tactics
      4. Hashtag strategy
      5. Collaboration opportunities
      6. Specific KPIs and targets
      
      Return as JSON with actionable growth plan.
    `;

    const text = await callGemini(prompt);
    return { status: 200, data: JSON.parse(text) }
  } catch (error) {
    console.error("Error generating growth strategy:", error)
    return { status: 500, message: "Error generating growth strategy" }
  }
}

/**
 * Create AI-optimized content calendar
 */
export const createContentCalendarE = async (userId: string, days = 30) => {
  try {
    const mediaData = await fetchInstagramMedia(userId, 50)
    const optimalTimes = await getOptimalPostingTimes(userId)

    const prompt = `
      You are a content planning expert. Create optimized content calendars based on performance data and best practices.
      
      Create a ${days}-day content calendar for this Instagram account:
      
      Historical Performance: ${JSON.stringify(mediaData.data?.slice(0, 20))}
      Optimal Posting Times: ${JSON.stringify(optimalTimes.data)}
      
      Include:
      1. Daily posting schedule with optimal times
      2. Content type variety (photos, videos, reels, stories)
      3. Content themes and topics
      
      Return as JSON with the following structure:
      {
        "days": [
          {
            "date": "Mon, 28",
            "posts": [
              {"type": "reel", "time": "7 PM", "theme": "string"},
              {"type": "story", "time": "12 PM", "theme": "string"}
            ]
          }
        ],
        "scheduledCount": 12,
        "scheduleSummary": [
          {"label": "Next post", "value": "Today 7:00 PM"},
          {"label": "This week", "value": "5 posts"}
        ]
      }
    `;

    const text = await callGemini(prompt);
    return { status: 200, data: JSON.parse(text) }
  } catch (error) {
    console.error("Error creating content calendar:", error)
    return { status: 500, message: "Error creating content calendar" }
  }
}











// Utility function to clean and extract JSON from AI responses
function extractAndCleanJSON(text: string): string {
  try {
    // Remove common markdown formatting
    let cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '');
    
    // Remove any leading/trailing whitespace
    cleaned = cleaned.trim();
    
    // Find the first opening brace and last closing brace
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    
    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      throw new Error('No valid JSON object found in response');
    }
    
    // Extract just the JSON part
    const jsonString = cleaned.substring(firstBrace, lastBrace + 1);
    
    // Test if it's valid JSON by parsing it
    JSON.parse(jsonString);
    
    return jsonString;
  } catch (error) {
    console.error('Failed to extract JSON:', error);
    console.error('Original text:', text);
    throw new Error(`Invalid JSON response:`);
  }
}

// Enhanced error handling wrapper
async function safeJSONParse(text: string, functionName: string) {
  try {
    const cleanedJSON = extractAndCleanJSON(text);
    return JSON.parse(cleanedJSON);
  } catch (error) {
    console.error(`${functionName} - JSON Parse Error:`, error);
    console.error(`${functionName} - Raw response:`, text);
    throw error;
  }
}

export const getOptimalPostingTimes = async (userId: string) => {
  try {
    const mediaData = await fetchInstagramMedia(userId, 100);
    const insightsData = await getAccountInsights(userId, "days_28");

    if (mediaData.status !== 200) {
      return { status: 404, message: "Unable to fetch media data" };
    }

    const prompt = `
You are a data scientist specializing in social media analytics. Analyze posting patterns and engagement to determine optimal posting times.

CRITICAL: Respond with ONLY valid JSON. No explanatory text, no markdown, no additional comments.

Analyze this Instagram data to determine optimal posting times:

Posts with timestamps and engagement: ${JSON.stringify(mediaData.data)}
Account insights: ${JSON.stringify(insightsData.data)}

Calculate:
1. Best days of the week to post
2. Optimal hours for maximum engagement
3. Content type specific timing (photos vs videos vs reels)
4. Audience activity patterns

Return ONLY this JSON structure:
{
  "schedule": [
    {
      "day": "Monday",
      "times": ["7-9 PM", "12-2 PM"]
    },
    {
      "day": "Tuesday", 
      "times": ["8-10 PM", "1-3 PM"]
    },
    {
      "day": "Wednesday",
      "times": ["7-9 PM", "11 AM-1 PM"]
    },
    {
      "day": "Thursday",
      "times": ["6-8 PM", "12-2 PM"]
    },
    {
      "day": "Friday",
      "times": ["5-7 PM", "10 AM-12 PM"]
    },
    {
      "day": "Saturday",
      "times": ["10 AM-12 PM", "6-8 PM"]
    },
    {
      "day": "Sunday",
      "times": ["2-4 PM", "7-9 PM"]
    }
  ],
  "contentTypeTimings": {
    "photos": ["12-2 PM", "6-8 PM"],
    "videos": ["7-9 PM", "1-3 PM"],
    "reels": ["5-7 PM", "11 AM-1 PM"],
    "stories": ["8-10 AM", "8-10 PM"]
  },
  "audienceActivityPeaks": ["7-9 PM", "12-2 PM", "8-10 AM"]
}`;

    const text = await callGemini(prompt);
    const parsedData = await safeJSONParse(text, 'getOptimalPostingTimes');
    
    return { status: 200, data: parsedData };
  } catch (error) {
    console.error("Error getting optimal posting times:", error);
    return { 
      status: 500, 
      message: "Error getting optimal posting times",
      // error: error.message 
    };
  }
};

export const createContentCalendar = async (userId: string, days = 30) => {
  try {
    const mediaData = await fetchInstagramMedia(userId, 50);
    const optimalTimes = await getOptimalPostingTimes(userId);

    const prompt = `
You are a content planning expert. Create optimized content calendars based on performance data and best practices.

CRITICAL: Respond with ONLY valid JSON. No explanatory text, no markdown, no additional comments.

Create a ${days}-day content calendar for this Instagram account:

Historical Performance: ${JSON.stringify(mediaData.data?.slice(0, 20))}
Optimal Posting Times: ${JSON.stringify(optimalTimes.data)}

Include:
1. Daily posting schedule with optimal times
2. Content type variety (photos, videos, reels, stories)
3. Content themes and topics

Return ONLY this JSON structure:
{
  "days": [
    {
      "date": "Mon, 28",
      "posts": [
        {"type": "reel", "time": "7 PM", "theme": "lifestyle"},
        {"type": "story", "time": "12 PM", "theme": "behind-the-scenes"}
      ]
    },
    {
      "date": "Tue, 29",
      "posts": [
        {"type": "photo", "time": "8 PM", "theme": "product showcase"},
        {"type": "story", "time": "1 PM", "theme": "tips"}
      ]
    }
  ],
  "scheduledCount": 12,
  "scheduleSummary": [
    {"label": "Next post", "value": "Today 7:00 PM"},
    {"label": "This week", "value": "5 posts"},
    {"label": "Total scheduled", "value": "12 posts"}
  ]
}`;

    const text = await callGemini(prompt);
    const parsedData = await safeJSONParse(text, 'createContentCalendar');
    
    return { status: 200, data: parsedData };
  } catch (error) {
    console.error("Error creating content calendar:", error);
    return { 
      status: 500, 
      message: "Error creating content calendar",
      // error: error.message || "E"
    };
  }
};










/**
 * Analyze content trends and opportunities
 */
export const analyzeContentTrends = async (userId: string) => {
  try {
    const mediaData = await fetchInstagramMedia(userId, 100)

    const prompt = `
      You are a trend analyst specializing in social media content. Identify trends and opportunities from content performance data.
      
      Analyze content trends from this Instagram data:
      
      Posts with Performance Data: ${JSON.stringify(mediaData.data)}
      
      Identify:
      1. Top performing content themes
      2. Emerging content opportunities
      3. Seasonal trends
      4. Content format preferences
      5. Hashtag trends
      6. Engagement pattern trends
      
      Return as JSON with the following structure:
      {
        "topThemes": [
          {"theme": "string", "performance": "string"}
        ],
        "emergingOpportunities": [
          {"opportunity": "string", "potential": "string"}
        ],
        "formatPreferences": [
          {"format": "string", "engagement": "string"}
        ],
        "hashtagTrends": [
          {"hashtag": "string", "trend": "string"}
        ],
        "growthMetrics": [
          {"name": "Follower Growth", "description": "+12% this month", "trend": "up"},
          {"name": "Engagement Rate", "description": "-3% this week", "trend": "down"},
          {"name": "Story Views", "description": "+8% this week", "trend": "up"}
        ]
      }
    `;

    const text = await callGemini(prompt);
    return { status: 200, data: JSON.parse(text) }
  } catch (error) {
    console.error("Error analyzing content trends:", error)
    return { status: 500, message: "Error analyzing content trends" }
  }
}

/**
 * Generate comprehensive reports
 */
export const generateReports = async (userId: string, period: "day" | "week" | "days_28") => {
  try {
    const mediaData = await fetchInstagramMedia(userId, 100)
    const insightsData = await getAccountInsights(userId, period)
    const contentStrategy = await generateContentStrategy(userId)

    const prompt = `
      You are a data analyst creating comprehensive Instagram performance reports. Generate detailed, actionable reports with insights and recommendations.
      
      Generate a comprehensive Instagram performance report:
      
      Period: ${period}
      Media Data: ${JSON.stringify(mediaData.data?.slice(0, 50))}
      Insights Data: ${JSON.stringify(insightsData.data)}
      Content Strategy: ${JSON.stringify(contentStrategy.data)}
      
      Include:
      1. Executive summary
      2. Key performance metrics
      3. Content performance analysis
      4. Audience insights
      5. Growth opportunities
      6. Actionable recommendations
      7. Next period strategy
      
      Return as JSON with comprehensive report structure.
    `;

    const text = await callGemini(prompt);
    return { status: 200, data: JSON.parse(text) }
  } catch (error) {
    console.error("Error generating reports:", error)
    return { status: 500, message: "Error generating reports" }
  }
}



//////////////////////



// Enhanced logging utility
const logError = (functionName: string, error: any, context?: any) => {
  console.error(`🔴 [${functionName}] Error occurred:`, {
    timestamp: new Date().toISOString(),
    error: {
      message: error?.message || "Unknown error",
      code: error?.code,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      data: error?.response?.data,
      stack: error?.stack?.split("\n").slice(0, 3), // First 3 lines of stack
    },
    context,
    env: {
      baseUrl: process.env.INSTAGRAM_BASE_URL,
      hasClientId: !!process.env.INSTAGRAM_CLIENT_ID,
      hasClientSecret: !!process.env.INSTAGRAM_CLIENT_SECRET,
    },
  })
}

const logInfo = (functionName: string, message: string, data?: any) => {
  console.log(`✅ [${functionName}] ${message}`, data ? { data } : "")
}

const logWarning = (functionName: string, message: string, data?: any) => {
  console.warn(`⚠️ [${functionName}] ${message}`, data ? { data } : "")
}

export const onOAuthInstagram = (strategy: "INSTAGRAM" | "CRM") => {
  logInfo("onOAuthInstagram", `Redirecting with strategy: ${strategy}`)
  if (strategy === "INSTAGRAM") {
    const redirectUrl = process.env.INSTAGRAM_EMBEDDED_OAUTH_URL as string
    logInfo("onOAuthInstagram", `Redirect URL: ${redirectUrl}`)
    return redirect(redirectUrl)
  }
}

export const onIntegrate = async (code: string) => {
  const functionName = "onIntegrate"
  logInfo(functionName, `Starting integration process with code: ${code.substring(0, 10)}...`)

  try {
    const user = await onCurrentUser()
    logInfo(functionName, `Current user retrieved: ${user.id}`)

    const integration = await getIntegration(user.id)
    logInfo(functionName, `Integration check result:`, {
      hasIntegration: !!integration,
      integrationCount: integration?.integrations?.length || 0,
    })

    if (integration && integration.integrations.length < 5) {
      logInfo(functionName, "Generating tokens...")
      const token = await generateTokens(code)
      console.log("Token:", { token })

      if (token) {
        logInfo(functionName, "Token generated successfully, fetching Instagram data...")
        const instaData = await fetchInstagramData(token.access_token)
        logInfo(functionName, "Instagram data fetched:", instaData)

        const today = new Date()
        const expire_date = today.setDate(today.getDate() + 60)

        logInfo(functionName, `Creating integration with expiry: ${new Date(expire_date)}`)
        const create = await createIntegration(user.id, token.access_token, new Date(expire_date), instaData)
        logInfo(functionName, "Integration created successfully")
        return { status: 200, data: create }
      }

      logWarning(functionName, "No token received from generateTokens")
      return { status: 401 }
    }

    logWarning(functionName, "Integration limit reached or no integration found", {
      hasIntegration: !!integration,
      count: integration?.integrations?.length,
    })
    return { status: 404 }
  } catch (error) {
    logError(functionName, error, { code: code.substring(0, 10) + "..." })
    return { status: 500 }
  }
}

export const fetchInstagramData = async (accessToken: string) => {
  const functionName = "fetchInstagramData"
  logInfo(functionName, `Fetching Instagram data with token: ${accessToken.substring(0, 20)}...`)

  try {
    const fields = "id,username,account_type,media_count,followers_count,follows_count,profile_picture_url"
    const url = `${process.env.INSTAGRAM_BASE_URL}/me?fields=${fields}&access_token=${accessToken}`

    logInfo(functionName, `Making request to: ${url.replace(accessToken, "TOKEN_HIDDEN")}`)
    logInfo(functionName, `Fields requested: ${fields}`)

    const response = await axios.get(url)

    logInfo(functionName, "API Response received:", {
      status: response.status,
      statusText: response.statusText,
      dataKeys: Object.keys(response.data),
      data: response.data,
    })

    const mappedData = {
      instagramId: response.data.id,
      username: response.data.username,
      fullName: response.data.name,
      profilePicture: response.data.profile_picture_url,
      followersCount: response.data.followers_count,
      followingCount: response.data.follows_count,
      postsCount: response.data.media_count,
      accountType: response.data.account_type, // Add account type
    }

    logInfo(functionName, "Data mapped successfully:", mappedData)
    return mappedData
  } catch (error) {
    logError(functionName, error, {
      tokenPrefix: accessToken.substring(0, 20) + "...",
      baseUrl: process.env.INSTAGRAM_BASE_URL,
    })
    throw error
  }
}

export const refreshInstagramData = async (userId: string) => {
  const functionName = "refreshInstagramData"
  logInfo(functionName, `Refreshing data for user: ${userId}`)

  try {
    const integration = await getIntegration(userId)
    logInfo(functionName, "Integration retrieved:", {
      hasIntegration: !!integration,
      integrationCount: integration?.integrations?.length || 0,
    })

    if (integration && integration.integrations.length > 0) {
      const latestIntegration = integration.integrations[0]
      logInfo(functionName, "Using integration:", {
        id: latestIntegration.id,
        tokenPrefix: latestIntegration.token.substring(0, 20) + "...",
        expiresAt: latestIntegration.expiresAt,
      })

      const instaData = await fetchInstagramData(latestIntegration.token)
      await updateIntegrationData(latestIntegration.id, instaData)
      logInfo(functionName, "Data refreshed successfully")
      return { status: 200, data: instaData }
    }

    logWarning(functionName, "No Instagram integration found")
    return { status: 404, message: "No Instagram integration found" }
  } catch (error) {
    logError(functionName, error, { userId })
    return { status: 500, message: "Error refreshing Instagram data" }
  }
}

/**
 * Fetch user's Instagram media posts with metadata
 */
export const fetchInstagramMedia = async (userId: string, limit = 25) => {
  const functionName = "fetchInstagramMedia"
  logInfo(functionName, `Fetching media for user: ${userId}, limit: ${limit}`)

  try {
    const integration = await getIntegration(userId)
    if (!integration || integration.integrations.length === 0) {
      logWarning(functionName, "No Instagram integration found")
      return { status: 404, message: "No Instagram integration found" }
    }

    const accessToken = integration.integrations[0].token
    const fields = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count"
    const url = `${process.env.INSTAGRAM_BASE_URL}/me/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`

    logInfo(functionName, `Making request to: ${url.replace(accessToken, "TOKEN_HIDDEN")}`)

    const response = await axios.get(url)

    logInfo(functionName, "Media fetched successfully:", {
      status: response.status,
      mediaCount: response.data.data?.length || 0,
      hasNext: !!response.data.paging?.next,
    })

    return { status: 200, data: response.data.data }
  } catch (error) {
    logError(functionName, error, { userId, limit })
    return { status: 500, message: "Error fetching Instagram media" }
  }
}

/**
 * Get insights for a specific media post
 */
export const getMediaInsights = async (userId: string, mediaId: string) => {
  const functionName = "getMediaInsights"
  logInfo(functionName, `Getting insights for media: ${mediaId}, user: ${userId}`)

  try {
    const integration = await getIntegration(userId)
    if (!integration || integration.integrations.length === 0) {
      logWarning(functionName, "No Instagram integration found")
      return { status: 404, message: "No Instagram integration found" }
    }

    const accessToken = integration.integrations[0].token
    const metrics = "engagement,impressions,reach,saved"
    const url = `${process.env.INSTAGRAM_BASE_URL}/${mediaId}/insights?metric=${metrics}&access_token=${accessToken}`

    logInfo(functionName, `Making request to: ${url.replace(accessToken, "TOKEN_HIDDEN")}`)

    const response = await axios.get(url)

    logInfo(functionName, "Insights fetched successfully:", {
      status: response.status,
      insightCount: response.data.data?.length || 0,
    })

    return { status: 200, data: response.data.data }
  } catch (error) {
    logError(functionName, error, { userId, mediaId })
    return { status: 500, message: "Error fetching media insights" }
  }
}

/**
 * Get account insights for specific time period - Enhanced with fallbacks
 */
export const getAccountInsights = async (userId: string, period: "day" | "week" | "days_28" = "week") => {
  const functionName = "getAccountInsights"
  logInfo(functionName, `Getting account insights for user: ${userId}, period: ${period}`)

  try {
    const integration = await getIntegration(userId)
    if (!integration || integration.integrations.length === 0) {
      logWarning(functionName, "No Instagram integration found")
      return { status: 404, message: "No Instagram integration found" }
    }

    const accessToken = integration.integrations[0].token

    // First check account type
    const accountInfo = await axios.get(
      `${process.env.INSTAGRAM_BASE_URL}/me?fields=account_type&access_token=${accessToken}`,
    )

    logInfo(functionName, "Account type:", accountInfo.data.account_type)

    // If not a business account, return mock data or limited insights
    if (accountInfo.data.account_type !== "BUSINESS") {
      logWarning(functionName, "Account is not a business account, returning limited insights")

      // Get basic media data to calculate some insights
      const mediaData = await fetchInstagramMedia(userId, 50)
      if (mediaData.status === 200 && mediaData.data) {
        const totalLikes = mediaData.data.reduce((sum: number, post: any) => sum + (post.like_count || 0), 0)
        const totalComments = mediaData.data.reduce((sum: number, post: any) => sum + (post.comments_count || 0), 0)
        const avgLikes = Math.round(totalLikes / mediaData.data.length) || 0
        const avgComments = Math.round(totalComments / mediaData.data.length) || 0

        return {
          status: 200,
          data: [
            {
              name: "average_likes",
              period: period,
              values: [{ value: avgLikes, end_time: new Date().toISOString() }],
              title: "Average Likes",
              description: "Average likes per post",
            },
            {
              name: "average_comments",
              period: period,
              values: [{ value: avgComments, end_time: new Date().toISOString() }],
              title: "Average Comments",
              description: "Average comments per post",
            },
            {
              name: "total_posts",
              period: period,
              values: [{ value: mediaData.data.length, end_time: new Date().toISOString() }],
              title: "Total Posts",
              description: "Total posts in period",
            },
            {
              name: "engagement_rate",
              period: period,
              values: [
                {
                  value: Math.round(((totalLikes + totalComments) / (mediaData.data.length * 100)) * 100) / 100,
                  end_time: new Date().toISOString(),
                },
              ],
              title: "Engagement Rate",
              description: "Estimated engagement rate",
            },
          ],
        }
      }
    }

    // Updated metrics to try - removed "impressions" which is no longer supported in v22+
    // Based on https://developers.facebook.com/docs/instagram-api/reference/ig-user/insights
    const metricsToTry = [
      "reach,profile_views,website_clicks",
      "reach,profile_views",
      "profile_views",
      "online_followers",
      "follower_count",
      "email_contacts",
      "get_directions_clicks",
      "phone_call_clicks",
      "text_message_clicks",
    ]

    for (const metrics of metricsToTry) {
      try {
        const url = `${process.env.INSTAGRAM_BASE_URL}/me/insights?metric=${metrics}&period=${period}&access_token=${accessToken}`
        logInfo(functionName, `Trying metrics: ${metrics}`)
        logInfo(functionName, `Making request to: ${url.replace(accessToken, "TOKEN_HIDDEN")}`)

        const response = await axios.get(url)

        logInfo(functionName, "Account insights fetched successfully:", {
          status: response.status,
          insightCount: response.data.data?.length || 0,
          metrics: metrics,
        })

        return { status: 200, data: response.data.data }
      } catch (metricsError: any) {
        logWarning(functionName, `Failed with metrics ${metrics}:`, {
          status: metricsError?.response?.status,
          message: metricsError?.response?.data?.error?.message,
        })
        continue
      }
    }

    // If all metrics fail, return fallback data
    logWarning(functionName, "All metrics failed, returning fallback data")

    // Get basic media data to calculate some insights as fallback
    const mediaData = await fetchInstagramMedia(userId, 50)
    if (mediaData.status === 200 && mediaData.data) {
      const totalLikes = mediaData.data.reduce((sum: number, post: any) => sum + (post.like_count || 0), 0)
      const totalComments = mediaData.data.reduce((sum: number, post: any) => sum + (post.comments_count || 0), 0)
      const avgLikes = Math.round(totalLikes / mediaData.data.length) || 0
      const avgComments = Math.round(totalComments / mediaData.data.length) || 0
      const recentPosts = mediaData.data.filter((post: any) => {
        const postDate = new Date(post.timestamp)
        const now = new Date()
        const diffDays = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24))
        return diffDays <= (period === "day" ? 1 : period === "week" ? 7 : 28)
      }).length

      return {
        status: 200,
        data: [
          {
            name: "average_likes",
            period: period,
            values: [{ value: avgLikes, end_time: new Date().toISOString() }],
            title: "Average Likes",
            description: "Average likes per post",
          },
          {
            name: "average_comments",
            period: period,
            values: [{ value: avgComments, end_time: new Date().toISOString() }],
            title: "Average Comments",
            description: "Average comments per post",
          },
          {
            name: "recent_posts",
            period: period,
            values: [{ value: recentPosts, end_time: new Date().toISOString() }],
            title: "Recent Posts",
            description: `Posts in the last ${period === "day" ? "day" : period === "week" ? "week" : "28 days"}`,
          },
          {
            name: "engagement_rate",
            period: period,
            values: [
              {
                value: Math.round(((totalLikes + totalComments) / (mediaData.data.length * 100)) * 100) / 100,
                end_time: new Date().toISOString(),
              },
            ],
            title: "Engagement Rate",
            description: "Estimated engagement rate",
          },
        ],
      }
    }

    return {
      status: 200,
      data: [
        {
          name: "insights_unavailable",
          period: period,
          values: [{ value: 0, end_time: new Date().toISOString() }],
          title: "Insights Unavailable",
          description: "Account insights not available for this account type",
        },
      ],
    }
  } catch (error) {
    logError(functionName, error, { userId, period })

    // Return fallback data instead of error
    return {
      status: 200,
      data: [
        {
          name: "insights_unavailable",
          period: period,
          values: [{ value: 0, end_time: new Date().toISOString() }],
          title: "Insights Unavailable",
          description: "Account insights not available for this account type",
        },
      ],
    }
  }
}

/**
 * Refresh access token using long-lived token
 */
export const refreshAccessToken = async (userId: string) => {
  const functionName = "refreshAccessToken"
  logInfo(functionName, `Refreshing token for user: ${userId}`)

  try {
    const integration = await getIntegration(userId)
    if (!integration || integration.integrations.length === 0) {
      logWarning(functionName, "No Instagram integration found")
      return { status: 404, message: "No Instagram integration found" }
    }

    const currentToken = integration.integrations[0].token
    const url = `${process.env.INSTAGRAM_BASE_URL}/refresh_access_token?grant_type=ig_refresh_token&access_token=${currentToken}`

    logInfo(functionName, `Making refresh request to: ${url.replace(currentToken, "TOKEN_HIDDEN")}`)

    const response = await axios.get(url)

    logInfo(functionName, "Token refreshed successfully:", {
      status: response.status,
      newTokenPrefix: response.data.access_token?.substring(0, 20) + "...",
      expiresIn: response.data.expires_in,
    })

    // Update token in database
    const newExpiryDate = new Date()
    newExpiryDate.setDate(newExpiryDate.getDate() + 60)

    await updateIntegrationData(integration.integrations[0].id, {
      token: response.data.access_token,
      expiresAt: newExpiryDate,
    })

    logInfo(functionName, `Token updated in database with new expiry: ${newExpiryDate}`)

    return { status: 200, data: { token: response.data.access_token, expiresIn: response.data.expires_in } }
  } catch (error) {
    logError(functionName, error, { userId })
    return { status: 500, message: "Error refreshing access token" }
  }
}

/**
 * Check if token is expired or about to expire
 */
export const checkTokenExpiry = async (userId: string) => {
  const functionName = "checkTokenExpiry"
  logInfo(functionName, `Checking token expiry for user: ${userId}`)

  try {
    const integration = await getIntegration(userId)
    if (!integration || integration.integrations.length === 0) {
      logWarning(functionName, "No Instagram integration found")
      return { status: 404, message: "No Instagram integration found" }
    }

    const expiryDate = integration.integrations[0].expiresAt
    logInfo(functionName, `Token expiry date: ${expiryDate}`)

    if (!expiryDate) {
      logWarning(functionName, "No expiry date found for token")
      return { status: 400, message: "No expiry date found for token" }
    }

    const now = new Date()
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    const result = {
      isExpired: now > expiryDate,
      daysUntilExpiry,
      shouldRefresh: daysUntilExpiry <= 7,
      expiryDate,
    }

    logInfo(functionName, "Token expiry check result:", result)

    return {
      status: 200,
      data: result,
    }
  } catch (error) {
    logError(functionName, error, { userId })
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return { status: 500, message: `Error checking token expiry: ${errorMessage}` }
  }
}

/**
 * Get hashtag information and top posts
 */
export const searchHashtag = async (userId: string, hashtag: string) => {
  const functionName = "searchHashtag"
  logInfo(functionName, `Searching hashtag: ${hashtag} for user: ${userId}`)

  try {
    const integration = await getIntegration(userId)
    if (!integration || integration.integrations.length === 0) {
      logWarning(functionName, "No Instagram integration found")
      return { status: 404, message: "No Instagram integration found" }
    }

    const accessToken = integration.integrations[0].token
    const instagramId = integration.integrations[0].instagramId

    logInfo(functionName, `Using Instagram ID: ${instagramId}`)

    // First get hashtag ID
    const hashtagSearchUrl = `${process.env.INSTAGRAM_BASE_URL}/ig_hashtag_search?user_id=${instagramId}&q=${hashtag}&access_token=${accessToken}`
    logInfo(functionName, `Hashtag search URL: ${hashtagSearchUrl.replace(accessToken, "TOKEN_HIDDEN")}`)

    const hashtagResponse = await axios.get(hashtagSearchUrl)

    logInfo(functionName, "Hashtag search response:", {
      status: hashtagResponse.status,
      foundHashtags: hashtagResponse.data.data?.length || 0,
      hashtags: hashtagResponse.data.data,
    })

    if (hashtagResponse.data.data.length === 0) {
      logWarning(functionName, `Hashtag '${hashtag}' not found`)
      return { status: 404, message: "Hashtag not found" }
    }

    const hashtagId = hashtagResponse.data.data[0].id
    logInfo(functionName, `Found hashtag ID: ${hashtagId}`)

    // Get hashtag info and top media
    const infoUrl = `${process.env.INSTAGRAM_BASE_URL}/${hashtagId}?fields=id,name&access_token=${accessToken}`
    const mediaUrl = `${process.env.INSTAGRAM_BASE_URL}/${hashtagId}/top_media?user_id=${instagramId}&fields=id,media_type,media_url,permalink,timestamp&access_token=${accessToken}`

    logInfo(functionName, `Info URL: ${infoUrl.replace(accessToken, "TOKEN_HIDDEN")}`)
    logInfo(functionName, `Media URL: ${mediaUrl.replace(accessToken, "TOKEN_HIDDEN")}`)

    const [infoResponse, mediaResponse] = await Promise.all([axios.get(infoUrl), axios.get(mediaUrl)])

    logInfo(functionName, "Hashtag data fetched successfully:", {
      infoStatus: infoResponse.status,
      mediaStatus: mediaResponse.status,
      topMediaCount: mediaResponse.data.data?.length || 0,
    })

    return {
      status: 200,
      data: {
        hashtag: infoResponse.data,
        topMedia: mediaResponse.data.data,
      },
    }
  } catch (error) {
    logError(functionName, error, { userId, hashtag })
    return { status: 500, message: "Error searching hashtag" }
  }
}

/**
 * Get comments for a specific media post
 */
export const getMediaComments = async (userId: string, mediaId: string) => {
  const functionName = "getMediaComments"
  logInfo(functionName, `Getting comments for media: ${mediaId}, user: ${userId}`)

  try {
    const integration = await getIntegration(userId)
    if (!integration || integration.integrations.length === 0) {
      logWarning(functionName, "No Instagram integration found")
      return { status: 404, message: "No Instagram integration found" }
    }

    const accessToken = integration.integrations[0].token
    const fields = "id,text,timestamp,username,like_count"
    const url = `${process.env.INSTAGRAM_BASE_URL}/${mediaId}/comments?fields=${fields}&access_token=${accessToken}`

    logInfo(functionName, `Making request to: ${url.replace(accessToken, "TOKEN_HIDDEN")}`)

    const response = await axios.get(url)

    logInfo(functionName, "Comments fetched successfully:", {
      status: response.status,
      commentCount: response.data.data?.length || 0,
    })

    return { status: 200, data: response.data.data }
  } catch (error) {
    logError(functionName, error, { userId, mediaId })
    return { status: 500, message: "Error fetching media comments" }
  }
}

/**
 * Get user mentions in media
 */
export const getUserMentions = async (userId: string, limit = 25) => {
  const functionName = "getUserMentions"
  logInfo(functionName, `Getting mentions for user: ${userId}, limit: ${limit}`)

  try {
    const integration = await getIntegration(userId)
    if (!integration || integration.integrations.length === 0) {
      logWarning(functionName, "No Instagram integration found")
      return { status: 404, message: "No Instagram integration found" }
    }

    const accessToken = integration.integrations[0].token
    const fields = "id,media_type,media_url,permalink,timestamp,caption"
    const url = `${process.env.INSTAGRAM_BASE_URL}/me/tags?fields=${fields}&limit=${limit}&access_token=${accessToken}`

    logInfo(functionName, `Making request to: ${url.replace(accessToken, "TOKEN_HIDDEN")}`)

    const response = await axios.get(url)

    logInfo(functionName, "Mentions fetched successfully:", {
      status: response.status,
      mentionCount: response.data.data?.length || 0,
    })

    return { status: 200, data: response.data.data }
  } catch (error) {
    logError(functionName, error, { userId, limit })
    return { status: 500, message: "Error fetching user mentions" }
  }
}

/**
 * Bulk operations for multiple integrations
 */
export const bulkRefreshIntegrations = async (userId: string) => {
  const functionName = "bulkRefreshIntegrations"
  logInfo(functionName, `Bulk refreshing integrations for user: ${userId}`)

  try {
    const integration = await getIntegration(userId)
    if (!integration || integration.integrations.length === 0) {
      logWarning(functionName, "No Instagram integrations found")
      return { status: 404, message: "No Instagram integrations found" }
    }

    logInfo(functionName, `Found ${integration.integrations.length} integrations to refresh`)

    const results = await Promise.allSettled(
      integration.integrations.map(async (int, index) => {
        logInfo(functionName, `Refreshing integration ${index + 1}/${integration.integrations.length}`)
        const instaData = await fetchInstagramData(int.token)
        await updateIntegrationData(int.id, instaData)
        return { integrationId: int.id, data: instaData }
      }),
    )

    const successful = results.filter((r) => r.status === "fulfilled").map((r) => r.value)
    const failed = results.filter((r) => r.status === "rejected").length

    logInfo(functionName, `Bulk refresh completed: ${successful.length} successful, ${failed} failed`)

    return {
      status: 200,
      data: {
        successful: successful.length,
        failed,
        results: successful,
      },
    }
  } catch (error) {
    logError(functionName, error, { userId })
    return { status: 500, message: "Error bulk refreshing integrations" }
  }
}

/**
 * Validate Instagram connection health
 */
export const validateConnection = async (userId: string) => {
  const functionName = "validateConnection"
  logInfo(functionName, `Validating connection for user: ${userId}`)

  try {
    const integration = await getIntegration(userId)
    logInfo(functionName, "Integration data:", {
      hasIntegration: !!integration,
      integrationCount: integration?.integrations?.length || 0,
      firstIntegration: integration?.integrations?.[0]
        ? {
            id: integration.integrations[0].id,
            tokenPrefix: integration.integrations[0].token?.substring(0, 20) + "...",
            expiresAt: integration.integrations[0].expiresAt,
            instagramId: integration.integrations[0].instagramId,
          }
        : null,
    })

    if (!integration || integration.integrations.length === 0) {
      logWarning(functionName, "No Instagram integration found")
      return { status: 404, message: "No Instagram integration found" }
    }

    const accessToken = integration.integrations[0].token
    const url = `${process.env.INSTAGRAM_BASE_URL}/me?fields=id,username&access_token=${accessToken}`

    logInfo(functionName, `Making validation request to: ${url.replace(accessToken, "TOKEN_HIDDEN")}`)
    logInfo(functionName, "Environment check:", {
      baseUrl: process.env.INSTAGRAM_BASE_URL,
      tokenLength: accessToken?.length,
      tokenPrefix: accessToken?.substring(0, 20) + "...",
    })

    // Test connection with a simple API call
    const response = await axios.get(url)

    logInfo(functionName, "Validation API response:", {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    })

    const tokenExpiry = await checkTokenExpiry(userId)
    logInfo(functionName, "Token expiry check result:", tokenExpiry)

    const result = {
      status: 200,
      data: {
        isValid: true,
        username: response.data.username,
        instagramId: response.data.id,
        tokenExpiry: tokenExpiry.data,
      },
    }

    logInfo(functionName, "Connection validation successful:", result)
    return result
  } catch (error) {
    logError(functionName, error, {
      userId,
      baseUrl: process.env.INSTAGRAM_BASE_URL,
    })

    // Enhanced error message extraction
    let errorMessage = "Connection invalid"
    let errorDetails = {}

    if (axios.isAxiosError(error)) {
      errorDetails = {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        code: error.code,
        message: error.message,
      }

      if (error.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
    }

    logError(functionName, `Connection validation failed with detailed error:`, errorDetails)

    return {
      status: 401,
      data: {
        isValid: false,
        error: errorMessage,
        errorDetails,
      },
    }
  }
}


