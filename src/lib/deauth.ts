
'use server'
import { onUserInfor } from "@/actions/user"
import { client } from "@/lib/prisma"
import { INTEGRATIONS } from "@prisma/client"
import { verifyInstagramWebhook } from '@/utils/instagram'

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
    const userId =  userr.data?.id
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
