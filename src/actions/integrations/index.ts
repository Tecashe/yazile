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



'use server'

import { redirect } from 'next/navigation'
import { onCurrentUser } from '../user'
import { createIntegration, getIntegration, updateIntegrationData } from './queries'
import { generateTokens } from '@/lib/fetch'
import axios from 'axios'

export const onOAuthInstagram = (strategy: 'INSTAGRAM' | 'CRM') => {
  if (strategy === 'INSTAGRAM') {
    return redirect(process.env.INSTAGRAM_EMBEDDED_OAUTH_URL as string)
  }
}

export const onIntegrate = async (code: string) => {
  const user = await onCurrentUser()

  try {
    const integration = await getIntegration(user.id)

    if (integration && integration.integrations.length < 5) {
      const token = await generateTokens(code)
      console.log('Token:', {token})

      if (token) {
        const instaData = await fetchInstagramData(token.access_token)

        const today = new Date()
        const expire_date = today.setDate(today.getDate() + 60)
        const create = await createIntegration(
          user.id,
          token.access_token,
          new Date(expire_date),
          instaData
        )
        return { status: 200, data: create }
      }
      console.log('🔴 401')
      return { status: 401 }
    }
    console.log('🔴 404')
    return { status: 404 }
  } catch (error) {
    console.log('🔴 500', error)
    return { status: 500 }
  }
}

export const fetchInstagramData = async (accessToken: string) => {
  try {
    const fields = 'id,username,account_type,media_count,followers_count,follows_count,profile_picture_url'
    const response = await axios.get(
      `${process.env.INSTAGRAM_BASE_URL}/me?fields=${fields}&access_token=${accessToken}`
    )

    return {
      instagramId: response.data.id,
      username: response.data.username,
      fullName: response.data.name,
      profilePicture: response.data.profile_picture_url,
      followersCount: response.data.followers_count,
      followingCount: response.data.follows_count,
      postsCount: response.data.media_count,
    }
  } catch (error) {
    console.error('Error fetching Instagram data:', error)
    throw error
  }
}

export const refreshInstagramData = async (userId: string) => {
  try {
    const integration = await getIntegration(userId)
    if (integration && integration.integrations.length > 0) {
      const latestIntegration = integration.integrations[0]
      const instaData = await fetchInstagramData(latestIntegration.token)
      await updateIntegrationData(latestIntegration.id, instaData)
      return { status: 200, data: instaData }
    }
    return { status: 404, message: 'No Instagram integration found' }
  } catch (error) {
    console.error('Error refreshing Instagram data:', error)
    return { status: 500, message: 'Error refreshing Instagram data' }
  }
}

// NEW FUNCTIONS BELOW

/**
 * Fetch user's Instagram media posts with metadata
 */
export const fetchInstagramMedia = async (userId: string, limit: number = 25) => {
  try {
    const integration = await getIntegration(userId)
    if (!integration || integration.integrations.length === 0) {
      return { status: 404, message: 'No Instagram integration found' }
    }

    const accessToken = integration.integrations[0].token
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count'
    
    const response = await axios.get(
      `${process.env.INSTAGRAM_BASE_URL}/me/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`
    )

    return { status: 200, data: response.data.data }
  } catch (error) {
    console.error('Error fetching Instagram media:', error)
    return { status: 500, message: 'Error fetching Instagram media' }
  }
}

/**
 * Get insights for a specific media post
 */
export const getMediaInsights = async (userId: string, mediaId: string) => {
  try {
    const integration = await getIntegration(userId)
    if (!integration || integration.integrations.length === 0) {
      return { status: 404, message: 'No Instagram integration found' }
    }

    const accessToken = integration.integrations[0].token
    const metrics = 'engagement,impressions,reach,saved'
    
    const response = await axios.get(
      `${process.env.INSTAGRAM_BASE_URL}/${mediaId}/insights?metric=${metrics}&access_token=${accessToken}`
    )

    return { status: 200, data: response.data.data }
  } catch (error) {
    console.error('Error fetching media insights:', error)
    return { status: 500, message: 'Error fetching media insights' }
  }
}

/**
 * Get account insights for specific time period
 */
export const getAccountInsights = async (userId: string, period: 'day' | 'week' | 'days_28' = 'week') => {
  try {
    const integration = await getIntegration(userId)
    if (!integration || integration.integrations.length === 0) {
      return { status: 404, message: 'No Instagram integration found' }
    }

    const accessToken = integration.integrations[0].token
    const metrics = 'impressions,reach,profile_views,website_clicks'
    
    const response = await axios.get(
      `${process.env.INSTAGRAM_BASE_URL}/me/insights?metric=${metrics}&period=${period}&access_token=${accessToken}`
    )

    return { status: 200, data: response.data.data }
  } catch (error) {
    console.error('Error fetching account insights:', error)
    return { status: 500, message: 'Error fetching account insights' }
  }
}

/**
 * Refresh access token using long-lived token
 */
export const refreshAccessToken = async (userId: string) => {
  try {
    const integration = await getIntegration(userId)
    if (!integration || integration.integrations.length === 0) {
      return { status: 404, message: 'No Instagram integration found' }
    }

    const currentToken = integration.integrations[0].token
    
    const response = await axios.get(
      `${process.env.INSTAGRAM_BASE_URL}/refresh_access_token?grant_type=ig_refresh_token&access_token=${currentToken}`
    )

    // Update token in database
    const newExpiryDate = new Date()
    newExpiryDate.setDate(newExpiryDate.getDate() + 60)
    
    await updateIntegrationData(integration.integrations[0].id, {
      token: response.data.access_token,
      expiresAt: newExpiryDate
    })

    return { status: 200, data: { token: response.data.access_token, expiresIn: response.data.expires_in } }
  } catch (error) {
    console.error('Error refreshing access token:', error)
    return { status: 500, message: 'Error refreshing access token' }
  }
}

/**
 * Check if token is expired or about to expire
 */
export const checkTokenExpiry = async (userId: string) => {
  try {
    const integration = await getIntegration(userId)
    if (!integration || integration.integrations.length === 0) {
      return { status: 404, message: 'No Instagram integration found' }
    }

    const expiryDate = integration.integrations[0].expiresAt
    if (!expiryDate) {
      return { status: 400, message: 'No expiry date found for token' }
    }

    const now = new Date()
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    return {
      status: 200,
      data: {
        isExpired: now > expiryDate,
        daysUntilExpiry,
        shouldRefresh: daysUntilExpiry <= 7, // Refresh if expires within a week
        expiryDate
      }
    }
  } catch (error) {
    console.error('Error checking token expiry:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return { status: 500, message: `Error checking token expiry: ${errorMessage}` }
  }
}

/**
 * Get hashtag information and top posts
 */
export const searchHashtag = async (userId: string, hashtag: string) => {
  try {
    const integration = await getIntegration(userId)
    if (!integration || integration.integrations.length === 0) {
      return { status: 404, message: 'No Instagram integration found' }
    }

    const accessToken = integration.integrations[0].token
    
    // First get hashtag ID
    const hashtagResponse = await axios.get(
      `${process.env.INSTAGRAM_BASE_URL}/ig_hashtag_search?user_id=${integration.integrations[0].instagramId}&q=${hashtag}&access_token=${accessToken}`
    )

    if (hashtagResponse.data.data.length === 0) {
      return { status: 404, message: 'Hashtag not found' }
    }

    const hashtagId = hashtagResponse.data.data[0].id

    // Get hashtag info and top media
    const [infoResponse, mediaResponse] = await Promise.all([
      axios.get(`${process.env.INSTAGRAM_BASE_URL}/${hashtagId}?fields=id,name&access_token=${accessToken}`),
      axios.get(`${process.env.INSTAGRAM_BASE_URL}/${hashtagId}/top_media?user_id=${integration.integrations[0].instagramId}&fields=id,media_type,media_url,permalink,timestamp&access_token=${accessToken}`)
    ])

    return {
      status: 200,
      data: {
        hashtag: infoResponse.data,
        topMedia: mediaResponse.data.data
      }
    }
  } catch (error) {
    console.error('Error searching hashtag:', error)
    return { status: 500, message: 'Error searching hashtag' }
  }
}

/**
 * Get comments for a specific media post
 */
export const getMediaComments = async (userId: string, mediaId: string) => {
  try {
    const integration = await getIntegration(userId)
    if (!integration || integration.integrations.length === 0) {
      return { status: 404, message: 'No Instagram integration found' }
    }

    const accessToken = integration.integrations[0].token
    const fields = 'id,text,timestamp,username,like_count'
    
    const response = await axios.get(
      `${process.env.INSTAGRAM_BASE_URL}/${mediaId}/comments?fields=${fields}&access_token=${accessToken}`
    )

    return { status: 200, data: response.data.data }
  } catch (error) {
    console.error('Error fetching media comments:', error)
    return { status: 500, message: 'Error fetching media comments' }
  }
}

/**
 * Get user mentions in media
 */
export const getUserMentions = async (userId: string, limit: number = 25) => {
  try {
    const integration = await getIntegration(userId)
    if (!integration || integration.integrations.length === 0) {
      return { status: 404, message: 'No Instagram integration found' }
    }

    const accessToken = integration.integrations[0].token
    const fields = 'id,media_type,media_url,permalink,timestamp,caption'
    
    const response = await axios.get(
      `${process.env.INSTAGRAM_BASE_URL}/me/tags?fields=${fields}&limit=${limit}&access_token=${accessToken}`
    )

    return { status: 200, data: response.data.data }
  } catch (error) {
    console.error('Error fetching user mentions:', error)
    return { status: 500, message: 'Error fetching user mentions' }
  }
}

/**
 * Bulk operations for multiple integrations
 */
export const bulkRefreshIntegrations = async (userId: string) => {
  try {
    const integration = await getIntegration(userId)
    if (!integration || integration.integrations.length === 0) {
      return { status: 404, message: 'No Instagram integrations found' }
    }

    const results = await Promise.allSettled(
      integration.integrations.map(async (int) => {
        const instaData = await fetchInstagramData(int.token)
        await updateIntegrationData(int.id, instaData)
        return { integrationId: int.id, data: instaData }
      })
    )

    const successful = results.filter(r => r.status === 'fulfilled').map(r => r.value)
    const failed = results.filter(r => r.status === 'rejected').length

    return {
      status: 200,
      data: {
        successful: successful.length,
        failed,
        results: successful
      }
    }
  } catch (error) {
    console.error('Error bulk refreshing integrations:', error)
    return { status: 500, message: 'Error bulk refreshing integrations' }
  }
}

/**
 * Validate Instagram connection health
 */
export const validateConnection = async (userId: string) => {
  try {
    const integration = await getIntegration(userId)
    if (!integration || integration.integrations.length === 0) {
      return { status: 404, message: 'No Instagram integration found' }
    }

    const accessToken = integration.integrations[0].token
    
    // Test connection with a simple API call
    const response = await axios.get(
      `${process.env.INSTAGRAM_BASE_URL}/me?fields=id,username&access_token=${accessToken}`
    )

    const tokenExpiry = await checkTokenExpiry(userId)

    return {
      status: 200,
      data: {
        isValid: true,
        username: response.data.username,
        tokenExpiry: tokenExpiry.data
      }
    }
  } catch (error) {
    console.error('Connection validation failed:', error)
    const errorMessage = error instanceof Error && 'response' in error && 
      error.response && typeof error.response === 'object' && 'data' in error.response &&
      error.response.data && typeof error.response.data === 'object' && 'error' in error.response.data &&
      error.response.data.error && typeof error.response.data.error === 'object' && 'message' in error.response.data.error
      ? String(error.response.data.error.message)
      : 'Connection invalid'
    
    return {
      status: 401,
      data: {
        isValid: false,
        error: errorMessage
      }
    }
  }
}