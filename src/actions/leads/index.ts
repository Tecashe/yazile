// "use server"

// import { mergeDuplicateLeads } from "@/lib/lead-qualification"

// export async function handleMergeDuplicates(userId: string) {
//   try {
//     const result = await mergeDuplicateLeads(userId)
//     return { success: true, mergedGroups: result.mergedGroups }
//   } catch (error) {
//     console.error("Error merging duplicates:", error)
//     return { success: false, error: "Failed to merge duplicates" }
//   }
// }

"use server"

import { mergeDuplicateLeads } from "@/lib/lead-qualification"

export async function handleMergeDuplicates(userId: string) {
  try {
    const result = await mergeDuplicateLeads(userId)
    return { success: true, mergedGroups: result.mergedGroups }
  } catch (error) {
    console.error("Error merging duplicates:", error)
    return { success: false, error: "Failed to merge duplicates" }
  }
}
