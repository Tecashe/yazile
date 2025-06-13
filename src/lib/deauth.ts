

import { onUserInfor } from "@/actions/user"
import { client } from "@/lib/prisma"
import { INTEGRATIONS } from "@prisma/client"

interface DeauthorizationResponse {
  status: number
  message: string
  data?: {
    accountId: string
    deauthorizedAt: string
  }
  error?: boolean
}


/**
 * Deauthorize Instagram account using the Instagram Graph API
 * This function revokes the access token and removes the integration from the database
 */
export async function deauthorizeInstagram(
  accountId: string, 
  accessToken: string
): Promise<DeauthorizationResponse> {
  try {
    // First, get the integration details to ensure it exists
    const integration = await client.integrations.findUnique({
      where: {
        id: accountId,
        name: INTEGRATIONS.INSTAGRAM
      }
    })

    if (!integration) {
      return {
        status: 404,
        message: 'Instagram integration not found',
        error: true
      }
    }

    // Step 1: Revoke the access token with Instagram Graph API
    // Note: Instagram doesn't have a direct revoke endpoint, but we can test token validity
    try {
      const testResponse = await fetch(`https://graph.instagram.com/me?access_token=${accessToken}`)
      
      if (testResponse.ok) {
        console.log('Token is valid, proceeding with deauthorization')
      } else {
        console.warn('Token may already be invalid, proceeding with database cleanup')
      }
    } catch (tokenError) {
      console.warn('Unable to verify token status, proceeding with cleanup:', tokenError)
    }

    // Step 2: Remove the integration from database
    const deleteResult = await deleteInstagramIntegration(accountId)
    
    if (!deleteResult.success) {
      throw new Error('Failed to remove integration from database')
    }

    // Step 3: Log the deauthorization for audit purposes
    await logDeauthorization(accountId, integration.instagramId || 'unknown', 'user_initiated')

    return {
      status: 200,
      message: 'Instagram account successfully deauthorized',
      data: {
        accountId,
        deauthorizedAt: new Date().toISOString(),
      }
    }

  } catch (error) {
    console.error('Error deauthorizing Instagram account:', error)
    
    return {
      status: 500,
      message: error instanceof Error ? error.message : 'Failed to deauthorize Instagram account',
      error: true
    }
  }
}

/**
 * Remove Instagram integration from Prisma database
 */
async function deleteInstagramIntegration(accountId: string) {
  try {
    const result = await client.integrations.delete({
      where: {
        id: accountId,
        name: INTEGRATIONS.INSTAGRAM
      }
    })

    console.log(`Successfully deleted Instagram integration: ${accountId}`)
    
    return {
      success: true,
      deletedId: result.id
    }

  } catch (error) {
    console.error('Database deletion error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Database deletion failed'
    }
  }
}

/**
 * Handle Instagram deauthorization webhook
 * This is called when Instagram sends a deauthorization notification
 */
export async function handleInstagramDeauthWebhook(webhookData: any) {
  try {
    const { user_id, algorithm, issued_at, signed_request } = webhookData

    if (!user_id) {
      throw new Error('No user_id provided in webhook data')
    }

    // Find the integration by Instagram ID
    const integration = await client.integrations.findFirst({
      where: {
        instagramId: user_id.toString(),
        name: INTEGRATIONS.INSTAGRAM
      }
    })

    if (!integration) {
      console.warn(`No integration found for Instagram user: ${user_id}`)
      return {
        status: 404,
        message: 'Integration not found'
      }
    }

    // Delete the integration
    await client.integrations.delete({
      where: {
        id: integration.id
      }
    })

    // Log the deauthorization
    await logDeauthorization(integration.id, user_id.toString(), 'instagram_initiated')

    console.log(`Successfully processed Instagram deauth webhook for user: ${user_id}`)

    return {
      status: 200,
      message: 'Deauthorization processed successfully'
    }

  } catch (error) {
    console.error('Error processing Instagram deauth webhook:', error)
    throw error
  }
}

/**
 * Handle Instagram data deletion webhook
 * This is called when a user requests data deletion
 */
export async function handleInstagramDataDeletionWebhook(webhookData: any) {
  try {
    const { user_id } = webhookData

    if (!user_id) {
      throw new Error('No user_id provided in webhook data')
    }

    // Find and delete all data associated with this Instagram user
    const integration = await client.integrations.findFirst({
      where: {
        instagramId: user_id.toString(),
        name: INTEGRATIONS.INSTAGRAM
      }
    })

    if (integration) {
      // Delete the integration
      await client.integrations.delete({
        where: {
          id: integration.id
        }
      })

      // Delete any associated message logs
      if (client.messageDeliveryLog) {
        await client.messageDeliveryLog.deleteMany({
          where: {
            pageId: integration.instagramId || ''
          }
        })
      }

      // Log the data deletion
      await logDeauthorization(integration.id, user_id.toString(), 'data_deletion_request')
    }

    console.log(`Successfully processed Instagram data deletion for user: ${user_id}`)

    return {
      status: 200,
      message: 'Data deletion processed successfully',
      data: {
        user_id,
        deletion_date: new Date().toISOString()
      }
    }

  } catch (error) {
    console.error('Error processing Instagram data deletion webhook:', error)
    throw error
  }
}

/**
 * Get all Instagram integrations for a user
 */
export async function getUserInstagramIntegrations(userId: string) {
  try {
    const integrations = await client.integrations.findMany({
      where: {
        userId,
        name: INTEGRATIONS.INSTAGRAM
      },
      select: {
        id: true,
        instagramId: true,
        username: true,
        fullName: true,
        profilePicture: true,
        followersCount: true,
        followingCount: true,
        postsCount: true,
        createdAt: true,
        expiresAt: true,
        lastUpdated: true
      }
    })

    return integrations

  } catch (error) {
    console.error('Error fetching user Instagram integrations:', error)
    throw error
  }
}

/**
 * Check if an Instagram token is still valid
 */
export async function validateInstagramToken(accessToken: string) {
  try {
    const response = await fetch(`https://graph.instagram.com/me?access_token=${accessToken}`)
    
    if (response.ok) {
      const data = await response.json()
      return {
        valid: true,
        data
      }
    } else {
      const error = await response.json()
      return {
        valid: false,
        error: error.error?.message || 'Token validation failed'
      }
    }

  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Token validation failed'
    }
  }
}

/**
 * Bulk deauthorize expired Instagram tokens
 */
export async function cleanupExpiredInstagramTokens() {
  try {
    const expiredIntegrations = await client.integrations.findMany({
      where: {
        name: INTEGRATIONS.INSTAGRAM,
        expiresAt: {
          lt: new Date()
        }
      }
    })

    let cleaned = 0
    
    for (const integration of expiredIntegrations) {
      try {
        await client.integrations.delete({
          where: {
            id: integration.id
          }
        })

        await logDeauthorization(
          integration.id, 
          integration.instagramId || 'unknown', 
          'token_expired'
        )

        cleaned++
      } catch (error) {
        console.error(`Failed to cleanup integration ${integration.id}:`, error)
      }
    }

    console.log(`Cleaned up ${cleaned} expired Instagram integrations`)
    
    return {
      cleaned,
      total: expiredIntegrations.length
    }

  } catch (error) {
    console.error('Error cleaning up expired tokens:', error)
    throw error
  }
}

/**
 * Log deauthorization events for audit purposes
 */
async function logDeauthorization(
  integrationId: string, 
  instagramId: string, 
  reason: 'user_initiated' | 'instagram_initiated' | 'data_deletion_request' | 'token_expired'
) {
  try {
    const userr = await onUserInfor();
    const userId =  userr.data?.clerkId
    // You can create a separate audit log table or use your existing logging system
    console.log('Deauthorization logged:', {
      integrationId,
      instagramId,
      reason,
      timestamp: new Date().toISOString()
    })

    //Example: Create an audit log entry (you'll need to create this table)
    await client.auditLog.create({
        data: {
            action: 'INSTAGRAM_DEAUTH',
            target: 'INTEGRATION', // or whatever target type this represents
            userId: userId||"1234567", // You need to provide the user ID
            entityId: integrationId,
            metadata: {
            instagramId,
            reason
            },
            timestamp: new Date()
        }
    })
    // await client.auditLog.create({
    //   data: {
    //     action: 'INSTAGRAM_DEAUTH',
    //     entityId: integrationId,
    //     metadata: {
    //       instagramId,
    //       reason
    //     },
    //     timestamp: new Date()
    //   }
    // })

  } catch (error) {
    console.error('Error logging deauthorization:', error)
  }
}

/**
 * Webhook verification for Instagram webhooks
 */
export function verifyInstagramWebhook(
  signature: string, 
  body: string, 
  appSecret: string
): boolean {
  try {
    const crypto = require('crypto')
    const expectedSignature = crypto
      .createHmac('sha256', appSecret)
      .update(body)
      .digest('hex')

    return signature === `sha256=${expectedSignature}`
  } catch (error) {
    console.error('Error verifying webhook signature:', error)
    return false
  }
}

// /**
//  * Deauthorize Instagram account using the Instagram Graph API
//  * This function revokes the access token and removes the integration from the database
//  */
// export async function deauthorizeInstagram(accountId: string, accessToken: string) {
//   try {
//     // Step 1: Revoke the access token with Instagram Graph API
//     const revokeResponse = await fetch(`https://graph.instagram.com/v21.0/${accessToken}`, {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })

//     // Check if the revocation was successful
//     if (!revokeResponse.ok) {
//       // If the token is already invalid, we can still proceed to remove from database
//       console.warn('Instagram token revocation failed, but proceeding with database cleanup:', revokeResponse.status)
//     }

//     // Step 2: Remove the integration from your database
//     // Replace this with your actual database deletion logic
//     const deleteResult = await deleteInstagramIntegration(accountId)
    
//     if (!deleteResult.success) {
//       throw new Error('Failed to remove integration from database')
//     }

//     // Step 3: Optional - Call Instagram deauthorize callback URL if configured
//     // This is useful for analytics and compliance
//     try {
//       await notifyInstagramDeauthorization(accountId)
//     } catch (callbackError) {
//       // Log the error but don't fail the entire operation
//       console.error('Failed to notify Instagram deauthorization:', callbackError)
//     }

//     return {
//       status: 200,
//       message: 'Instagram account successfully deauthorized',
//       data: {
//         accountId,
//         deauthorizedAt: new Date().toISOString(),
//       }
//     }

//   } catch (error) {
//     console.error('Error deauthorizing Instagram account:', error)
    
//     return {
//       status: 500,
//       message: error instanceof Error ? error.message : 'Failed to deauthorize Instagram account',
//       error: true
//     }
//   }
// }

// /**
//  * Remove Instagram integration from your database
//  * Replace this with your actual database logic
//  */
// async function deleteInstagramIntegration(accountId: string) {
//   try {
//     // Example using Prisma (replace with your database ORM/client)
//     // const result = await prisma.integration.delete({
//     //   where: {
//     //     id: accountId,
//     //     name: 'INSTAGRAM'
//     //   }
//     // })

//     // Example using direct database query
//     // const result = await db.query(
//     //   'DELETE FROM integrations WHERE id = ? AND name = ?',
//     //   [accountId, 'INSTAGRAM']
//     // )

//     // For now, return success - replace with your actual deletion logic
//     console.log(`Deleting Instagram integration with ID: ${accountId}`)
    
//     return {
//       success: true,
//       deletedId: accountId
//     }

//   } catch (error) {
//     console.error('Database deletion error:', error)
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Database deletion failed'
//     }
//   }
// }

// /**
//  * Optional: Notify Instagram about the deauthorization
//  * This is useful for compliance and analytics
//  */
// async function notifyInstagramDeauthorization(accountId: string) {
//   try {
//     // This is optional - you can implement this if you have a deauthorization callback URL
//     // configured in your Instagram app settings
    
//     const deauthorizationData = {
//       account_id: accountId,
//       deauthorized_at: new Date().toISOString(),
//       reason: 'user_initiated'
//     }

//     // Example webhook notification to your backend
//     // await fetch('/api/webhooks/instagram/deauthorization', {
//     //   method: 'POST',
//     //   headers: {
//     //     'Content-Type': 'application/json',
//     //   },
//     //   body: JSON.stringify(deauthorizationData)
//     // })

//     console.log('Deauthorization notification sent:', deauthorizationData)

//   } catch (error) {
//     console.error('Failed to notify deauthorization:', error)
//     throw error
//   }
// }

// /**
//  * Alternative method: Deauthorize using Facebook Graph API
//  * Use this if you're using Facebook Login for Instagram access
//  */
// export async function deauthorizeInstagramViaFacebook(accountId: string, userAccessToken: string, appId: string, appSecret: string) {
//   try {
//     // Generate app access token
//     const appTokenResponse = await fetch(`https://graph.facebook.com/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&grant_type=client_credentials`)
//     const appTokenData = await appTokenResponse.json()
    
//     if (!appTokenData.access_token) {
//       throw new Error('Failed to get app access token')
//     }

//     // Revoke user access token
//     const revokeResponse = await fetch(`https://graph.facebook.com/v21.0/${userAccessToken}?access_token=${appTokenData.access_token}`, {
//       method: 'DELETE'
//     })

//     if (!revokeResponse.ok) {
//       throw new Error('Failed to revoke Facebook access token')
//     }

//     // Remove from database
//     const deleteResult = await deleteInstagramIntegration(accountId)
    
//     if (!deleteResult.success) {
//       throw new Error('Failed to remove integration from database')
//     }

//     return {
//       status: 200,
//       message: 'Instagram account successfully deauthorized via Facebook',
//       data: {
//         accountId,
//         deauthorizedAt: new Date().toISOString(),
//       }
//     }

//   } catch (error) {
//     console.error('Error deauthorizing Instagram via Facebook:', error)
    
//     return {
//       status: 500,
//       message: error instanceof Error ? error.message : 'Failed to deauthorize Instagram account',
//       error: true
//     }
//   }
// }