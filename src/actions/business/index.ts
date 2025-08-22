// "use server"

// import { client } from "@/lib/prisma"
// import { onCurrentUser, onUserInfor } from "../user"
// import { revalidatePath } from "next/cache"

// // Business Profile Actions
// export const getBusinessProfile = async (userId?: string) => {
//   try {
//     const user = userId ? { id: userId } : await onCurrentUser()

//     const business = await client.business.findFirst({
//       where: { userId: user.id },
//     })

//     return { status: 200, data: business }
//   } catch (error) {
//     console.error("Error fetching business profile:", error)
//     return { status: 500, data: null, error: "Failed to fetch business profile" }
//   }
// }

// export const createBusinessProfile = async (data: {
//   name?: string
//   businessName: string
//   businessType: string
//   businessDescription: string
//   website: string
//   responseLanguage: string
//   automationId: string
// }) => {
//   try {
//     const user = await onCurrentUser()

//     // Check if business profile already exists
//     const existingBusiness = await client.business.findFirst({
//       where: { userId: user.id },
//     })

//     if (existingBusiness) {
//       return { status: 400, error: "Business profile already exists" }
//     }

//     const business = await client.business.create({
//       data: {
//         ...data,
//         userId: user.id,
//       },
//     })

//     revalidatePath("/business")
//     return { status: 201, data: business }
//   } catch (error) {
//     console.error("Error creating business profile:", error)
//     return { status: 500, error: "Failed to create business profile" }
//   }
// }

// export const updateBusinessProfile = async (data: {
//   name?: string
//   businessName?: string
//   businessType?: string
//   businessDescription?: string
//   website?: string
//   responseLanguage?: string
// }) => {
//   try {
//     const user = await onCurrentUser()

//     // Check if business profile exists
//     const existingBusiness = await client.business.findFirst({
//       where: { userId: user.id },
//     })

//     if (!existingBusiness) {
//       return { status: 404, error: "Business profile not found" }
//     }

//     const business = await client.business.update({
//       where: { id: existingBusiness.id },
//       data,
//     })

//     revalidatePath("/business")
//     return { status: 200, data: business }
//   } catch (error) {
//     console.error("Error updating business profile:", error)
//     return { status: 500, error: "Failed to update business profile" }
//   }
// }

// // Legacy function for automation-specific business description (if still needed)
// interface SaveBusinessProfileParams {
//   businessId?: string
//   content: string
//   automationId:string
// }

// export async function saveBusinessProfile({ businessId, content }: SaveBusinessProfileParams) {
//   try {
//     const session = await onUserInfor()

//     if (!session?.data?.id) {
//       return {
//         success: false,
//         error: "Unauthorized. Please sign in.",
//       }
//     }

//     // Check if the business exists and belongs to the user
//     const business = await client.business.findUnique({
//       where: {
//         id: businessId,
//         userId: session.data.id,
//       },
//     })

//     if (!business) {
//       return {
//         success: false,
//         error: "Business not found or you don't have permission to modify it.",
//       }
//     }

//     // Update the business description
//     await client.business.update({
//       where: {
//         id: businessId,
//       },
//       data: {
//         businessDescription: content,
//         updatedAt: new Date(),
//       },
//     })

//     revalidatePath("/business")

//     return {
//       success: true,
//     }
//   } catch (error) {
//     console.error("Error saving business profile:", error)
//     return {
//       success: false,
//       error: "Failed to save business profile. Please try again.",
//     }
//   }
// }

// export async function getBusinessProfileDescription(businessId: string) {
//   try {
//     const session = await onUserInfor()

//     if (!session?.data?.id) {
//       return {
//         success: false,
//         error: "Unauthorized. Please sign in.",
//       }
//     }

//     const business = await client.business.findUnique({
//       where: {
//         id: businessId,
//         userId: session.data.id,
//       },
//     })

//     if (!business) {
//       return {
//         success: true,
//         profile: null,
//       }
//     }

//     return {
//       success: true,
//       profile: {
//         id: business.id,
//         content: business.businessDescription,
//         createdAt: business.createdAt,
//         updatedAt: business.updatedAt,
//       },
//     }
//   } catch (error) {
//     console.error("Error fetching business profile:", error)
//     return {
//       success: false,
//       error: "Failed to fetch business profile.",
//     }
//   }
// }

// "use server"

// import { client } from "@/lib/prisma"
// import { onUserInfor } from "../user"
// import { revalidatePath } from "next/cache"

// // Business Profile Actions
// export const getBusinessProfile = async (userId?: string) => {
//   try {
//     const user = await onUserInfor()

//     const business = await client.business.findFirst({
//       where: { userId: user.data?.id },
//     })

//     return { status: 200, data: business }
//   } catch (error) {
//     console.error("Error fetching business profile:", error)
//     return { status: 500, data: null, error: "Failed to fetch business profile" }
//   }
// }

// export const createBusinessProfile = async (data: {
//   name?: string
//   businessName: string
//   businessType: string
//   businessDescription: string
//   website: string
//   responseLanguage: string
//   automationId: string
// }) => {
//   try {
//     const user = await onUserInfor()    

//     // Check if business profile already exists
//     const existingBusiness = await client.business.findFirst({
//       where: { userId: user.data?.id },
//     })

//     if (existingBusiness) {
//       return { status: 400, error: "Business profile already exists" }
//     }

//     const automation = await client.automation.findUnique({
//       where: { id: data.automationId },
//     })

//     if (!automation) {
//       return { status: 400, error: "Invalid automation ID" }
//     }

//     const business = await client.business.create({
//       data: {
//         ...data,
//         userId: user.data?.id,
//       },
//     })

//     revalidatePath("/")
//     revalidatePath("/setup")
//     return { status: 201, data: business }
//   } catch (error) {
//     console.error("Error creating business profile:", error)
//     return { status: 500, error: "Failed to create business profile" }
//   }
// }

// export const updateBusinessProfile = async (data: {
//   name?: string
//   businessName?: string
//   businessType?: string
//   businessDescription?: string
//   website?: string
//   responseLanguage?: string
// }) => {
//   try {
//     const user = await onUserInfor()

//     // Check if business profile exists
//     const existingBusiness = await client.business.findFirst({
//       where: { userId: user.data?.id },
//     })

//     if (!existingBusiness) {
//       return { status: 404, error: "Business profile not found" }
//     }

//     const business = await client.business.update({
//       where: { id: existingBusiness.id },
//       data: {
//         ...data,
//         updatedAt: new Date(),
//       },
//     })

//     revalidatePath("/")
//     revalidatePath("/setup")
//     return { status: 200, data: business }
//   } catch (error) {
//     console.error("Error updating business profile:", error)
//     return { status: 500, error: "Failed to update business profile" }
//   }
// }

// // Legacy function for automation-specific business description (if still needed)
// interface SaveBusinessProfileParams {
//   businessId?: string
//   content: string
//   automationId: string
// }

// export async function saveBusinessProfile({ businessId, content }: SaveBusinessProfileParams) {
//   try {
//     const session = await onUserInfor()

//     if (!session?.data?.id) {
//       return {
//         success: false,
//         error: "Unauthorized. Please sign in.",
//       }
//     }

//     // Check if the business exists and belongs to the user
//     const business = await client.business.findUnique({
//       where: {
//         id: businessId,
//         userId: session.data.id,
//       },
//     })

//     if (!business) {
//       return {
//         success: false,
//         error: "Business not found or you don't have permission to modify it.",
//       }
//     }

//     // Update the business description
//     await client.business.update({
//       where: {
//         id: businessId,
//       },
//       data: {
//         businessDescription: content,
//         updatedAt: new Date(),
//       },
//     })

//     revalidatePath("/business")

//     return {
//       success: true,
//     }
//   } catch (error) {
//     console.error("Error saving business profile:", error)
//     return {
//       success: false,
//       error: "Failed to save business profile. Please try again.",
//     }
//   }
// }

// export async function getBusinessProfileDescription(businessId: string) {
//   try {
//     const session = await onUserInfor()

//     if (!session?.data?.id) {
//       return {
//         success: false,
//         error: "Unauthorized. Please sign in.",
//       }
//     }

//     const business = await client.business.findUnique({
//       where: {
//         id: businessId,
//         userId: session.data.id,
//       },
//     })

//     if (!business) {
//       return {
//         success: true,
//         profile: null,
//       }
//     }

//     return {
//       success: true,
//       profile: {
//         id: business.id,
//         content: business.businessDescription,
//         createdAt: business.createdAt,
//         updatedAt: business.updatedAt,
//       },
//     }
//   } catch (error) {
//     console.error("Error fetching business profile:", error)
//     return {
//       success: false,
//       error: "Failed to fetch business profile.",
//     }
//   }
// }


"use server"

import { client } from "@/lib/prisma"
import { onUserInfor } from "../user"
import { revalidatePath } from "next/cache"

// Business Profile Actions
export const getBusinessProfile = async (userId?: string) => {
  try {
    const user = await onUserInfor()

    if (user.status !== 200 || !user.data?.id) {
      return { status: 401, data: null, error: "User not authenticated" }
    }

    const business = await client.business.findFirst({
      where: { userId: user.data.id }, // This should now be the database UUID
    })

    return { status: 200, data: business }
  } catch (error) {
    console.error("Error fetching business profile:", error)
    return { status: 500, data: null, error: "Failed to fetch business profile" }
  }
}

export const createBusinessProfile = async (data: {
  name?: string
  businessName: string
  businessType: string
  businessDescription: string
  website: string
  responseLanguage: string
  automationId: string
}) => {
  try {
    const user = await onUserInfor()

    if (user.status !== 200 || !user.data?.id) {
      return { status: 401, error: "User not authenticated" }
    }

    // Check if business profile already exists
    const existingBusiness = await client.business.findFirst({
      where: { userId: user.data.id },
    })

    if (existingBusiness) {
      return { status: 400, error: "Business profile already exists" }
    }

    // Verify automation exists and belongs to the user
    const automation = await client.automation.findFirst({
      where: { 
        id: data.automationId,
        userId: user.data.id // Ensure user owns this automation
      },
    })

    if (!automation) {
      return { status: 400, error: "Invalid automation ID or automation not found" }
    }

    const business = await client.business.create({
      data: {
        ...data,
        userId: user.data.id,
      },
    })

    revalidatePath("/")
    revalidatePath("/setup")
    return { status: 201, data: business }
  } catch (error) {
    console.error("Error creating business profile:", error)
    return { status: 500, error: "Failed to create business profile" }
  }
}

export const updateBusinessProfile = async (data: {
  name?: string
  businessName?: string
  businessType?: string
  businessDescription?: string
  website?: string
  responseLanguage?: string
}) => {
  try {
    const user = await onUserInfor()

    if (user.status !== 200 || !user.data?.id) {
      return { status: 401, error: "User not authenticated" }
    }

    // Check if business profile exists
    const existingBusiness = await client.business.findFirst({
      where: { userId: user.data.id },
    })

    if (!existingBusiness) {
      return { status: 404, error: "Business profile not found" }
    }

    const business = await client.business.update({
      where: { id: existingBusiness.id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    })

    revalidatePath("/")
    revalidatePath("/setup")
    return { status: 200, data: business }
  } catch (error) {
    console.error("Error updating business profile:", error)
    return { status: 500, error: "Failed to update business profile" }
  }
}

// Legacy function for automation-specific business description (if still needed)
interface SaveBusinessProfileParams {
  businessId?: string
  content: string
  automationId: string
}

export async function saveBusinessProfile({ businessId, content }: SaveBusinessProfileParams) {
  try {
    const session = await onUserInfor()

    if (session.status !== 200 || !session.data?.id) {
      return {
        success: false,
        error: "Unauthorized. Please sign in.",
      }
    }

    if (!businessId) {
      return {
        success: false,
        error: "Business ID is required.",
      }
    }

    // Check if the business exists and belongs to the user
    const business = await client.business.findFirst({
      where: {
        id: businessId,
        userId: session.data.id,
      },
    })

    if (!business) {
      return {
        success: false,
        error: "Business not found or you don't have permission to modify it.",
      }
    }

    // Update the business description
    await client.business.update({
      where: {
        id: businessId,
      },
      data: {
        businessDescription: content,
        updatedAt: new Date(),
      },
    })

    revalidatePath("/business")
    revalidatePath("/setup")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error saving business profile:", error)
    return {
      success: false,
      error: "Failed to save business profile. Please try again.",
    }
  }
}

export async function getBusinessProfileDescription(businessId: string) {
  try {
    const session = await onUserInfor()

    if (session.status !== 200 || !session.data?.id) {
      return {
        success: false,
        error: "Unauthorized. Please sign in.",
      }
    }

    const business = await client.business.findFirst({
      where: {
        id: businessId,
        userId: session.data.id,
      },
    })

    if (!business) {
      return {
        success: true,
        profile: null,
      }
    }

    return {
      success: true,
      profile: {
        id: business.id,
        content: business.businessDescription,
        createdAt: business.createdAt,
        updatedAt: business.updatedAt,
      },
    }
  } catch (error) {
    console.error("Error fetching business profile:", error)
    return {
      success: false,
      error: "Failed to fetch business profile.",
    }
  }
}

// Helper function to get user's automations (useful for dropdowns/selection)
export const getUserAutomations = async () => {
  try {
    const user = await onUserInfor()

    if (user.status !== 200 || !user.data?.id) {
      return { status: 401, data: [], error: "User not authenticated" }
    }

    const automations = await client.automation.findMany({
      where: { userId: user.data.id },
      select: {
        id: true,
        name: true,
        active: true,
        platform: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    })

    return { status: 200, data: automations }
  } catch (error) {
    console.error("Error fetching user automations:", error)
    return { status: 500, data: [], error: "Failed to fetch automations" }
  }
}