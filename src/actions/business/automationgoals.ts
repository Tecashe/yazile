// "use server"

// import { client } from "@/lib/prisma"
// import { onUserInfor } from "../user"
// import { revalidatePath } from "next/cache"
// import { AutomationGoalType } from "@prisma/client"

// // Define the goal ID type
// type GoalId = 'payments' | 'ecommerce' | 'booking' | 'support' | 'lead_qualification' | 'content_delivery' | 'reviews_feedback' | 'personalized_messaging';

// // Mapping from frontend goal IDs to enum values
// const GOAL_TYPE_MAPPING: Record<GoalId, AutomationGoalType> = {
//   'payments': AutomationGoalType.PAYMENT_PROCESSING,
//   'ecommerce': AutomationGoalType.ECOMMERCE_INTEGRATION,
//   'booking': AutomationGoalType.APPOINTMENT_BOOKING,
//   'support': AutomationGoalType.CUSTOMER_SUPPORT,
//   'lead_qualification': AutomationGoalType.LEAD_QUALIFICATION,
//   'content_delivery': AutomationGoalType.CONTENT_DELIVERY,
//   'reviews_feedback': AutomationGoalType.REVIEWS_FEEDBACK,
//   'personalized_messaging': AutomationGoalType.PERSONALIZED_MARKETING
// }

// // Helper function to check if a goal ID is valid
// const isValidGoalId = (goalId: string): goalId is GoalId => {
//   return goalId in GOAL_TYPE_MAPPING;
// }

// // Create automation goals for a business
// export const createAutomationGoals = async (businessId: string, goalIds: string[]) => {
//   try {
//     const user = await onUserInfor()

//     if (user.status !== 200 || !user.data?.id) {
//       return { status: 401, error: "User not authenticated" }
//     }

//     // Verify the business belongs to the user
//     const business = await client.business.findFirst({
//       where: { 
//         id: businessId,
//         userId: user.data.id 
//       },
//     })

//     if (!business) {
//       return { status: 404, error: "Business not found" }
//     }

//     // Delete existing goals for this business
//     await client.automationGoal.deleteMany({
//       where: { businessId }
//     })

//     // Create new goals
//     const goalsData = goalIds
//       .filter(isValidGoalId) // Filter out invalid goal IDs
//       .map((goalId, index) => ({
//         businessId,
//         goalType: GOAL_TYPE_MAPPING[goalId],
//         priority: index + 1, // Set priority based on selection order
//         isActive: true
//       }))

//     if (goalsData.length === 0) {
//       return { status: 400, error: "No valid automation goals provided" }
//     }

//     const goals = await client.automationGoal.createMany({
//       data: goalsData
//     })

//     revalidatePath("/")
//     revalidatePath("/dashboard")
//     return { status: 201, data: goals }
//   } catch (error) {
//     console.error("Error creating automation goals:", error)
//     return { status: 500, error: "Failed to create automation goals" }
//   }
// }

// // Get automation goals for a business
// export const getAutomationGoals = async (businessId: string) => {
//   try {
//     const user = await onUserInfor()

//     if (user.status !== 200 || !user.data?.id) {
//       return { status: 401, error: "User not authenticated" }
//     }

//     const goals = await client.automationGoal.findMany({
//       where: { 
//         businessId,
//         business: { userId: user.data.id } // Ensure user owns the business
//       },
//       orderBy: { priority: 'asc' }
//     })

//     return { status: 200, data: goals }
//   } catch (error) {
//     console.error("Error fetching automation goals:", error)
//     return { status: 500, error: "Failed to fetch automation goals" }
//   }
// }

// // Get user's business automation goals
// export const getUserBusinessGoals = async () => {
//   try {
//     const user = await onUserInfor()

//     if (user.status !== 200 || !user.data?.id) {
//       return { status: 401, error: "User not authenticated" }
//     }

//     const business = await client.business.findFirst({
//       where: { userId: user.data.id },
//       include: {
//         automationGoals: {
//           orderBy: { priority: 'asc' }
//         }
//       }
//     })

//     if (!business) {
//       return { status: 404, error: "Business not found" }
//     }

//     return { status: 200, data: business.automationGoals }
//   } catch (error) {
//     console.error("Error fetching user business goals:", error)
//     return { status: 500, error: "Failed to fetch business goals" }
//   }
// }

// // Update automation goal configuration
// export const updateAutomationGoalConfig = async (goalId: string, config: any) => {
//   try {
//     const user = await onUserInfor()

//     if (user.status !== 200 || !user.data?.id) {
//       return { status: 401, error: "User not authenticated" }
//     }

//     // Verify the goal belongs to user's business
//     const goal = await client.automationGoal.findFirst({
//       where: { 
//         id: goalId,
//         business: { userId: user.data.id }
//       }
//     })

//     if (!goal) {
//       return { status: 404, error: "Automation goal not found" }
//     }

//     const updatedGoal = await client.automationGoal.update({
//       where: { id: goalId },
//       data: {
//         customConfig: config,
//         updatedAt: new Date()
//       }
//     })

//     revalidatePath("/dashboard")
//     return { status: 200, data: updatedGoal }
//   } catch (error) {
//     console.error("Error updating automation goal config:", error)
//     return { status: 500, error: "Failed to update goal configuration" }
//   }
// }

// // Toggle automation goal active status
// export const toggleAutomationGoal = async (goalId: string) => {
//   try {
//     const user = await onUserInfor()

//     if (user.status !== 200 || !user.data?.id) {
//       return { status: 401, error: "User not authenticated" }
//     }

//     const goal = await client.automationGoal.findFirst({
//       where: { 
//         id: goalId,
//         business: { userId: user.data.id }
//       }
//     })

//     if (!goal) {
//       return { status: 404, error: "Automation goal not found" }
//     }

//     const updatedGoal = await client.automationGoal.update({
//       where: { id: goalId },
//       data: {
//         isActive: !goal.isActive,
//         updatedAt: new Date()
//       }
//     })

//     revalidatePath("/dashboard")
//     return { status: 200, data: updatedGoal }
//   } catch (error) {
//     console.error("Error toggling automation goal:", error)
//     return { status: 500, error: "Failed to toggle goal status" }
//   }
// }

"use server"

import { client } from "@/lib/prisma"
import { onUserInfor } from "../user"
import { revalidatePath } from "next/cache"
import { AutomationGoalType } from "@prisma/client"

// Define the goal ID type
type GoalId =
  | "payments"
  | "ecommerce"
  | "booking"
  | "support"
  | "lead_qualification"
  | "content_delivery"
  | "reviews_feedback"
  | "personalized_messaging"

// Mapping from frontend goal IDs to enum values
const GOAL_TYPE_MAPPING: Record<GoalId, AutomationGoalType> = {
  payments: AutomationGoalType.PAYMENT_PROCESSING,
  ecommerce: AutomationGoalType.ECOMMERCE_INTEGRATION,
  booking: AutomationGoalType.APPOINTMENT_BOOKING,
  support: AutomationGoalType.CUSTOMER_SUPPORT,
  lead_qualification: AutomationGoalType.LEAD_QUALIFICATION,
  content_delivery: AutomationGoalType.CONTENT_DELIVERY,
  reviews_feedback: AutomationGoalType.REVIEWS_FEEDBACK,
  personalized_messaging: AutomationGoalType.PERSONALIZED_MARKETING,
}

// Helper function to check if a goal ID is valid
const isValidGoalId = (goalId: string): goalId is GoalId => {
  return goalId in GOAL_TYPE_MAPPING
}

// Create automation goals for a business
export const createAutomationGoals = async (businessId: string, goalIds: string[]) => {
  try {
    const user = await onUserInfor()

    if (user.status !== 200 || !user.data?.id) {
      return { status: 401, error: "User not authenticated" }
    }

    // Verify the business belongs to the user
    const business = await client.business.findFirst({
      where: {
        id: businessId,
        userId: user.data.id,
      },
    })

    if (!business) {
      return { status: 404, error: "Business not found" }
    }

    // Delete existing goals for this business
    await client.automationGoal.deleteMany({
      where: { businessId },
    })

    // Create new goals
    const goalsData = goalIds
      .filter(isValidGoalId) // Filter out invalid goal IDs
      .map((goalId, index) => ({
        businessId,
        goalType: GOAL_TYPE_MAPPING[goalId],
        priority: index + 1, // Set priority based on selection order
        isActive: true,
      }))

    if (goalsData.length === 0) {
      return { status: 400, error: "No valid automation goals provided" }
    }

    const goals = await client.automationGoal.createMany({
      data: goalsData,
    })

    revalidatePath("/")
    revalidatePath("/dashboard")
    return { status: 201, data: goals }
  } catch (error) {
    console.error("Error creating automation goals:", error)
    return { status: 500, error: "Failed to create automation goals" }
  }
}

// Get automation goals for a business
export const getAutomationGoals = async (businessId: string) => {
  try {
    const user = await onUserInfor()

    if (user.status !== 200 || !user.data?.id) {
      return { status: 401, error: "User not authenticated" }
    }

    const goals = await client.automationGoal.findMany({
      where: {
        businessId,
        business: { userId: user.data.id }, // Ensure user owns the business
      },
      orderBy: { priority: "asc" },
    })

    return { status: 200, data: goals }
  } catch (error) {
    console.error("Error fetching automation goals:", error)
    return { status: 500, error: "Failed to fetch automation goals" }
  }
}

// Get user's business automation goals
export const getUserBusinessGoals = async () => {
  try {
    const user = await onUserInfor()

    if (user.status !== 200 || !user.data?.id) {
      return { status: 401, error: "User not authenticated" }
    }

    const business = await client.business.findFirst({
      where: { userId: user.data.id },
      include: {
        automationGoals: {
          orderBy: { priority: "asc" },
        },
      },
    })

    if (!business) {
      return { status: 404, error: "Business not found" }
    }

    return { status: 200, data: business.automationGoals }
  } catch (error) {
    console.error("Error fetching user business goals:", error)
    return { status: 500, error: "Failed to fetch business goals" }
  }
}

// Update automation goal configuration
export const updateAutomationGoalConfig = async (goalId: string, config: any) => {
  try {
    const user = await onUserInfor()

    if (user.status !== 200 || !user.data?.id) {
      return { status: 401, error: "User not authenticated" }
    }

    // Verify the goal belongs to user's business
    const goal = await client.automationGoal.findFirst({
      where: {
        id: goalId,
        business: { userId: user.data.id },
      },
    })

    if (!goal) {
      return { status: 404, error: "Automation goal not found" }
    }

    const updatedGoal = await client.automationGoal.update({
      where: { id: goalId },
      data: {
        customConfig: config,
        updatedAt: new Date(),
      },
    })

    revalidatePath("/dashboard")
    return { status: 200, data: updatedGoal }
  } catch (error) {
    console.error("Error updating automation goal config:", error)
    return { status: 500, error: "Failed to update goal configuration" }
  }
}

// Toggle automation goal active status
export const toggleAutomationGoal = async (goalId: string) => {
  try {
    const user = await onUserInfor()

    if (user.status !== 200 || !user.data?.id) {
      return { status: 401, error: "User not authenticated" }
    }

    const goal = await client.automationGoal.findFirst({
      where: {
        id: goalId,
        business: { userId: user.data.id },
      },
    })

    if (!goal) {
      return { status: 404, error: "Automation goal not found" }
    }

    const updatedGoal = await client.automationGoal.update({
      where: { id: goalId },
      data: {
        isActive: !goal.isActive,
        updatedAt: new Date(),
      },
    })

    revalidatePath("/dashboard")
    return { status: 200, data: updatedGoal }
  } catch (error) {
    console.error("Error toggling automation goal:", error)
    return { status: 500, error: "Failed to toggle goal status" }
  }
}
