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




'use server'

import { redirect } from 'next/navigation'
import { onCurrentUser } from '../user'
import { createIntegration, getIntegration, updateIntegrationData } from './queries'
import { generateTokens } from '@/lib/fetch'
import axios from 'axios'

// Enhanced logging utility
const logError = (functionName: string, error: any, context?: any) => {
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

const logInfo = (functionName: string, message: string, data?: any) => {
  console.log(`✅ [${functionName}] ${message}`, data ? { data } : '')
}

const logWarning = (functionName: string, message: string, data?: any) => {
  console.warn(`⚠️ [${functionName}] ${message}`, data ? { data } : '')
}

export const onOAuthInstagram = (strategy: 'INSTAGRAM' | 'CRM') => {
  logInfo('onOAuthInstagram', `Redirecting with strategy: ${strategy}`)
  if (strategy === 'INSTAGRAM') {
    const redirectUrl = process.env.INSTAGRAM_EMBEDDED_OAUTH_URL as string
    logInfo('onOAuthInstagram', `Redirect URL: ${redirectUrl}`)
    return redirect(redirectUrl)
  }
}

export const onIntegrate = async (code: string) => {
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

export const fetchInstagramData = async (accessToken: string) => {
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

export const refreshInstagramData = async (userId: string) => {
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
export const fetchInstagramMedia = async (userId: string, limit: number = 25) => {
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
export const getMediaInsights = async (userId: string, mediaId: string) => {
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
export const getAccountInsights = async (userId: string, period: 'day' | 'week' | 'days_28' = 'week') => {
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
export const refreshAccessToken = async (userId: string) => {
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
export const checkTokenExpiry = async (userId: string) => {
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
export const searchHashtag = async (userId: string, hashtag: string) => {
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
export const getMediaComments = async (userId: string, mediaId: string) => {
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
export const getUserMentions = async (userId: string, limit: number = 25) => {
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
export const bulkRefreshIntegrations = async (userId: string) => {
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
export const validateConnection = async (userId: string) => {
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