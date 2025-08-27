'use server'

import { client } from '@/lib/prisma'
import { FormSchema } from '@/components/global/businessInfo/businessInfo'

export const createBusiness = async (clerkId: string, businessData: FormSchema) => {
  // Filter only the fields that exist in the Business model
  const businessFields = {
    name: businessData.name,
    businessName: businessData.businessName,
    businessType: businessData.businessType,
    businessDescription: businessData.businessDescription,
    website: businessData.website,
    responseLanguage: businessData.responseLanguage,
  }

  return await client.user.update({
    where: {
      clerkId,
    },
    data: {
      businesses: {
        create: {
          ...businessFields,
          automation: {
            create: {
              name: `${businessData.businessName} Automation`,
              // Add other required automation fields here based on your Automation model
            },
          },
        },
      },
    },
  })
}

export async function getBusinessIdForUser(userId: string) {
  const user = await client.user.findUnique({
    where: { id: userId },
    include: { businesses: { select: { id: true } } },
  })

  if (!user || user.businesses.length === 0) {
    throw new Error("No business found for this user")
  }

  return user.businesses[0].id
}

export const getBusinesses = async (clerkId: string) => {
  return await client.user.findUnique({
    where: {
      clerkId,
    },
    select: {
      businesses: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })
}

export const findBusiness = async (id: string) => {
  return await client.business.findUnique({
    where: {
      id,
    },
    include: {
      User: {
        select: {
          subscription: true,
        },
      },
    },
  })
}

export const updateBusiness = async (
  id: string,
  update: Partial<FormSchema>
) => {
  return await client.business.update({
    where: { id },
    data: update,
  })
}

export const deleteBusiness = async (businessId: string) => {
  try {
    return await client.business.delete({
      where: {
        id: businessId,
      },
    })
  } catch (error) {
    console.error('Error deleting business:', error)
    return null
  }
}

export const getBusinessesForWebhook = async (businessId: string) => {
  return await client.business.findUnique({
    where: {
      id: businessId,
    },   
  })
}

// Updated type to only include fields that exist in the new Business model
type BusinessUpdateData = Partial<FormSchema> & {
  name?: string
  businessName?: string
  businessType?: string
  businessDescription?: string
  website?: string
  responseLanguage?: string
}

export const updateBusines = async (clerkId: string, update: BusinessUpdateData) => {
  console.log(`[updateBusiness] Starting update for business ID: ${clerkId}`)
  console.log(`[updateBusiness] Update data:`, JSON.stringify(update, null, 2))

  try {
    const result = await client.business.update({
      where: { id: clerkId },
      data: update,
    })

    console.log(`[updateBusiness] Update successful. Result:`, JSON.stringify(result, null, 2))
    return result
  } catch (error: unknown) {
    console.error(`[updateBusiness] Error updating business:`, error)
    if (error instanceof Error) {
      console.error(`[updateBusiness] Error stack:`, error.stack)
    }
    throw error
  }
}

export const getBusinessAutomationData = async (clerkId: string) => {
  const business = await client.business.findUnique({
    where: {
      id: clerkId,
    },
    select: {
      id: true,
      name: true,
      businessName: true,
      businessType: true,
      businessDescription: true,
      website: true,
      responseLanguage: true,
      automationId: true,
    },
  })

  if (!business) return null

  return {
    id: business.id,
    name: business.name,
    businessName: business.businessName,
    businessType: business.businessType,
    businessDescription: business.businessDescription,
    website: business.website,
    responseLanguage: business.responseLanguage,
    automationId: business.automationId,
  }
}

export async function getBusinessInfo(businessId: string) {
  try {
    const business = await client.business.findUnique({
      where: { id: businessId },
      select: {
        businessName: true,
        businessType: true,
        businessDescription: true,
        website: true,
        responseLanguage: true,
      },
    })

    return business
  } catch (error) {
    console.error("Error fetching business info:", error)
    throw error
  }
}

export async function saveBusinessInfo(
  businessId: string,
  businessInfo: {
    businessName: string
    businessType: string
    businessDescription: string
    website: string
    responseLanguage: string
  },
) {
  try {
    const updatedBusiness = await client.business.update({
      where: { id: businessId },
      data: businessInfo,
    })

    return updatedBusiness
  } catch (error) {
    console.error("Error saving business info:", error)
    throw error
  }
}

export const getBusinessAutomationDatum = async (clerkId: string) => {
  const business = await client.business.findUnique({
    where: {
      id: clerkId,
    },
    select: {
      id: true,
      name: true,
      businessName: true,
      businessType: true,
      businessDescription: true,
      website: true,
      responseLanguage: true,
      automationId: true,
    },
  })

  if (!business) return null

  return {
    id: business.id,
    name: business.name,
    businessName: business.businessName,
    businessType: business.businessType,
    businessDescription: business.businessDescription,
    website: business.website,
    responseLanguage: business.responseLanguage,
    automationId: business.automationId,
  }
}

////////////

// Add this new function to your queries file
export const getBusinessByUserId = async (clerkId: string) => {
  return await client.user.findUnique({
    where: {
      clerkId,
    },
    select: {
      id: true, // Include userId for tenant integration
      businesses: {
        take: 1, // Only get the first business since user has only one
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })
}

// Alternative: More direct approach - get business directly with user info
export const getBusinessForWebhookByUser = async (clerkId: string) => {
  const result = await client.business.findFirst({
    where: {
      User: {
        clerkId: clerkId
      }
    },
    include: {
      User: {
        select: {
          id: true, // This is the userId you need for tenant integration
          clerkId: true,
        }
      }
    }
  })
  
  return result
}

// Even simpler: to Get business with userId directly
export const getUserBusinessWithId = async (clerkId: string) => {
  return await client.business.findFirst({
    where: {
      User: {
        clerkId: clerkId
      }
    },
    select: {
      id: true,
      name: true,
      businessName: true,
      businessType: true,
      businessDescription: true,
      website: true,
      responseLanguage: true,
      automationId: true,
      userId: true, // This is what you need for fetchTenantIntegrations!
      createdAt: true,
      updatedAt: true,
      // Add any other fields you need
    }
  })
}