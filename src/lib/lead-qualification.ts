// import { client } from "@/lib/prisma"
// import { openai } from "@/lib/openai"
// import type { LeadStatus } from "@prisma/client"

// /**
//  * Analyzes a message for sentiment and intent
//  */
// export async function analyzeMessage(message: string) {
//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-4o",
//       messages: [
//         {
//           role: "system",
//           content: `
//             You are a lead qualification assistant. Analyze the following message for:
//             1. Sentiment (score from -1.0 to 1.0)
//             2. Purchase intent (score from 0 to 10)
//             3. Question intent (is the person asking questions about products/services?)
//             4. Information sharing (is the person sharing personal information?)
//             5. Objections (is the person raising objections or concerns?)
            
//             Respond with a JSON object only, no other text.
//           `,
//         },
//         {
//           role: "user",
//           content: message,
//         },
//       ],
//       response_format: { type: "json_object" },
//     })

//     const analysis = JSON.parse(response.choices[0].message.content || "{}")
//     return analysis
//   } catch (error) {
//     console.error("Error analyzing message:", error)
//     return {
//       sentiment: 0,
//       purchaseIntent: 0,
//       questionIntent: false,
//       informationSharing: false,
//       objections: false,
//     }
//   }
// }

// /**
//  * Processes a new interaction and updates lead scores
//  */
// export async function processInteraction(leadId: string, content: string, type: string, direction: string) {
//   try {
//     // Analyze the message content
//     const analysis = await analyzeMessage(content)

//     // Create the interaction record
//     const interaction = await client.leadInteraction.create({
//       data: {
//         leadId,
//         type,
//         content,
//         direction,
//         sentiment: analysis.sentiment,
//         intent: {
//           purchaseIntent: analysis.purchaseIntent,
//           questionIntent: analysis.questionIntent,
//           informationSharing: analysis.informationSharing,
//           objections: analysis.objections,
//         },
//       },
//     })

//     // Get the lead and its qualification data
//     const lead = await client.lead.findUnique({
//       where: { id: leadId },
//       include: { qualificationData: true },
//     })

//     if (!lead) {
//       throw new Error(`Lead not found: ${leadId}`)
//     }

//     // Update qualification scores
//     let intentScore = lead.qualificationData?.intentScore || 0
//     let sentimentScore = lead.qualificationData?.sentimentScore || 0
//     let recencyScore = lead.qualificationData?.recencyScore || 0

//     // Update intent score based on purchase intent
//     if (analysis.purchaseIntent > 7) {
//       intentScore += 3
//     } else if (analysis.purchaseIntent > 5) {
//       intentScore += 2
//     } else if (analysis.purchaseIntent > 3) {
//       intentScore += 1
//     }

//     // Update sentiment score
//     if (analysis.sentiment > 0.5) {
//       sentimentScore += 2
//     } else if (analysis.sentiment > 0) {
//       sentimentScore += 1
//     } else if (analysis.sentiment < -0.5) {
//       sentimentScore -= 2
//     } else if (analysis.sentiment < 0) {
//       sentimentScore -= 1
//     }

//     // Update recency score (more recent interactions get higher scores)
//     recencyScore = 5 // Reset to max when there's a new interaction

//     // Calculate total score
//     const totalScore = intentScore + sentimentScore + recencyScore

//     // Update the qualification data
//     await client.leadQualificationData.upsert({
//       where: { leadId },
//       update: {
//         intentScore,
//         sentimentScore,
//         recencyScore,
//         aiAnalysis: {
//           ...(lead.qualificationData?.aiAnalysis || {}),
//           [new Date().toISOString()]: analysis,
//         },
//         updatedAt: new Date(),
//       },
//       create: {
//         leadId,
//         intentScore,
//         sentimentScore,
//         recencyScore,
//         aiAnalysis: {
//           [new Date().toISOString()]: analysis,
//         },
//       },
//     })

//     // Update the lead score and last contact date
//     await client.lead.update({
//       where: { id: leadId },
//       data: {
//         score: totalScore,
//         lastContactDate: new Date(),
//         updatedAt: new Date(),
//       },
//     })

//     // Check if the lead should be qualified based on score
//     if (totalScore >= 10 && lead.status === "QUALIFYING") {
//       await qualifyLead(leadId)
//     }

//     return interaction
//   } catch (error) {
//     console.error("Error processing interaction:", error)
//     throw error
//   }
// }

// /**
//  * Qualifies a lead based on its score and other criteria
//  */
// export async function qualifyLead(leadId: string) {
//   try {
//     const lead = await client.lead.findUnique({
//       where: { id: leadId },
//       include: { qualificationData: true },
//     })

//     if (!lead) {
//       throw new Error(`Lead not found: ${leadId}`)
//     }

//     // Update the lead status to QUALIFIED
//     await client.lead.update({
//       where: { id: leadId },
//       data: {
//         status: "QUALIFIED",
//         qualifiedDate: new Date(),
//         updatedAt: new Date(),
//       },
//     })

//     return true
//   } catch (error) {
//     console.error("Error qualifying lead:", error)
//     throw error
//   }
// }

// /**
//  * Creates a new lead from an Instagram interaction
//  */
// export async function createLeadFromInstagram(
//   userId: string,
//   automationId: string | null,
//   instagramUserId: string,
//   pageId: string,
//   initialMessage: string,
// ) {
//   try {
//     // Create the lead
//     const lead = await client.lead.create({
//       data: {
//         userId,
//         automationId,
//         instagramUserId,
//         pageId,
//         status: "NEW",
//         source: "instagram",
//       },
//     })

//     // Process the initial interaction
//     await processInteraction(lead.id, initialMessage, "message", "inbound")

//     // Update lead status to QUALIFYING
//     await client.lead.update({
//       where: { id: lead.id },
//       data: {
//         status: "QUALIFYING",
//         updatedAt: new Date(),
//       },
//     })

//     return lead
//   } catch (error) {
//     console.error("Error creating lead from Instagram:", error)
//     throw error
//   }
// }

// /**
//  * Updates a lead's status
//  */
// export async function updateLeadStatus(leadId: string, status: LeadStatus, notes?: string) {
//   try {
//     const updateData: any = {
//       status,
//       updatedAt: new Date(),
//     }

//     // Add status-specific date fields
//     if (status === "QUALIFIED") {
//       updateData.qualifiedDate = new Date()
//     } else if (status === "CONVERTED") {
//       updateData.convertedDate = new Date()
//     }

//     if (notes) {
//       updateData.notes = notes
//     }

//     const lead = await client.lead.update({
//       where: { id: leadId },
//       data: updateData,
//     })

//     return lead
//   } catch (error) {
//     console.error("Error updating lead status:", error)
//     throw error
//   }
// }


// import { client } from "@/lib/prisma"
// import { openai } from "@/lib/openai"
// import type { LeadStatus } from "@prisma/client"

// /**
//  * Analyzes a message for sentiment and intent
//  */
// export async function analyzeMessage(message: string) {
//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-4o",
//       messages: [
//         {
//           role: "system",
//           content: `
//             You are a lead qualification assistant. Analyze the following message for:
//             1. Sentiment (score from -1.0 to 1.0)
//             2. Purchase intent (score from 0 to 10)
//             3. Question intent (is the person asking questions about products/services?)
//             4. Information sharing (is the person sharing personal information?)
//             5. Objections (is the person raising objections or concerns?)
            
//             Respond with a JSON object only, no other text.
//           `,
//         },
//         {
//           role: "user",
//           content: message,
//         },
//       ],
//       response_format: { type: "json_object" },
//     })

//     const analysis = JSON.parse(response.choices[0].message.content || "{}")
//     return analysis
//   } catch (error) {
//     console.error("Error analyzing message:", error)
//     return {
//       sentiment: 0,
//       purchaseIntent: 0,
//       questionIntent: false,
//       informationSharing: false,
//       objections: false,
//     }
//   }
// }

// /**
//  * Processes a new interaction and updates lead scores
//  */
// export async function processInteraction(leadId: string, content: string, type: string, direction: string) {
//   try {
//     // Analyze the message content
//     const analysis = await analyzeMessage(content)

//     // Create the interaction record
//     const interaction = await client.leadInteraction.create({
//       data: {
//         leadId,
//         type,
//         content,
//         direction,
//         sentiment: analysis.sentiment,
//         intent: {
//           purchaseIntent: analysis.purchaseIntent,
//           questionIntent: analysis.questionIntent,
//           informationSharing: analysis.informationSharing,
//           objections: analysis.objections,
//         },
//       },
//     })

//     // Get the lead and its qualification data
//     const lead = await client.lead.findUnique({
//       where: { id: leadId },
//       include: { qualificationData: true },
//     })

//     if (!lead) {
//       throw new Error(`Lead not found: ${leadId}`)
//     }

//     // Update qualification scores
//     let intentScore = lead.qualificationData?.intentScore || 0
//     let sentimentScore = lead.qualificationData?.sentimentScore || 0
//     let recencyScore = lead.qualificationData?.recencyScore || 0

//     // Update intent score based on purchase intent
//     if (analysis.purchaseIntent > 7) {
//       intentScore += 3
//     } else if (analysis.purchaseIntent > 5) {
//       intentScore += 2
//     } else if (analysis.purchaseIntent > 3) {
//       intentScore += 1
//     }

//     // Update sentiment score
//     if (analysis.sentiment > 0.5) {
//       sentimentScore += 2
//     } else if (analysis.sentiment > 0) {
//       sentimentScore += 1
//     } else if (analysis.sentiment < -0.5) {
//       sentimentScore -= 2
//     } else if (analysis.sentiment < 0) {
//       sentimentScore -= 1
//     }

//     // Update recency score (more recent interactions get higher scores)
//     recencyScore = 5 // Reset to max when there's a new interaction

//     // Calculate total score
//     const totalScore = intentScore + sentimentScore + recencyScore

//     // Update the qualification data
//     await client.leadQualificationData.upsert({
//       where: { leadId },
//       update: {
//         intentScore,
//         sentimentScore,
//         recencyScore,
//         aiAnalysis: {
//           ...(lead.qualificationData?.aiAnalysis as Record<string, unknown> || {}),
//           [new Date().toISOString()]: analysis,
//         },
//         updatedAt: new Date(),
//       },
//       create: {
//         leadId,
//         intentScore,
//         sentimentScore,
//         recencyScore,
//         aiAnalysis: {
//           [new Date().toISOString()]: analysis,
//         },
//       },
//     })

//     // Update the lead score and last contact date
//     await client.lead.update({
//       where: { id: leadId },
//       data: {
//         score: totalScore,
//         lastContactDate: new Date(),
//         updatedAt: new Date(),
//       },
//     })

//     // Check if the lead should be qualified based on score
//     if (totalScore >= 10 && lead.status === "QUALIFYING") {
//       await qualifyLead(leadId)
//     }

//     return interaction
//   } catch (error) {
//     console.error("Error processing interaction:", error)
//     throw error
//   }
// }

// /**
//  * Qualifies a lead based on its score and other criteria
//  */
// export async function qualifyLead(leadId: string) {
//   try {
//     const lead = await client.lead.findUnique({
//       where: { id: leadId },
//       include: { qualificationData: true },
//     })

//     if (!lead) {
//       throw new Error(`Lead not found: ${leadId}`)
//     }

//     // Update the lead status to QUALIFIED
//     await client.lead.update({
//       where: { id: leadId },
//       data: {
//         status: "QUALIFIED",
//         qualifiedDate: new Date(),
//         updatedAt: new Date(),
//       },
//     })

//     return true
//   } catch (error) {
//     console.error("Error qualifying lead:", error)
//     throw error
//   }
// }

// /**
//  * Creates a new lead from an Instagram interaction
//  */
// export async function createLeadFromInstagram(
//   userId: string,
//   automationId: string | null,
//   instagramUserId: string,
//   pageId: string,
//   initialMessage: string,
// ) {
//   try {
//     // Create the lead
//     const lead = await client.lead.create({
//       data: {
//         userId,
//         automationId,
//         instagramUserId,
//         pageId,
//         status: "NEW",
//         source: "instagram",
//       },
//     })

//     // Process the initial interaction
//     await processInteraction(lead.id, initialMessage, "message", "inbound")

//     // Update lead status to QUALIFYING
//     await client.lead.update({
//       where: { id: lead.id },
//       data: {
//         status: "QUALIFYING",
//         updatedAt: new Date(),
//       },
//     })

//     return lead
//   } catch (error) {
//     console.error("Error creating lead from Instagram:", error)
//     throw error
//   }
// }

// /**
//  * Updates a lead's status
//  */
// export async function updateLeadStatus(leadId: string, status: LeadStatus, notes?: string) {
//   try {
//     const updateData: any = {
//       status,
//       updatedAt: new Date(),
//     }

//     // Add status-specific date fields
//     if (status === "QUALIFIED") {
//       updateData.qualifiedDate = new Date()
//     } else if (status === "CONVERTED") {
//       updateData.convertedDate = new Date()
//     }

//     if (notes) {
//       updateData.notes = notes
//     }

//     const lead = await client.lead.update({
//       where: { id: leadId },
//       data: updateData,
//     })

//     return lead
//   } catch (error) {
//     console.error("Error updating lead status:", error)
//     throw error
//   }
// }

// import { client } from "@/lib/prisma"
// import { openai } from "@/lib/openai"
// import { Prisma } from "@prisma/client"
// import type { Lead, LeadStatus } from "@prisma/client"

/**
 * Analyzes a message for sentiment and intent
 */
// export async function analyzeMessageE(message: string) {
//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-4o",
//       messages: [
//         {
//           role: "system",
//           content: `
//             You are a lead qualification assistant. Analyze the following message for:
//             1. Sentiment (score from -1.0 to 1.0)
//             2. Purchase intent (score from 0 to 10)
//             3. Question intent (is the person asking questions about products/services?)
//             4. Information sharing (is the person sharing personal information?)
//             5. Objections (is the person raising objections or concerns?)
            
//             Respond with a JSON object only, no other text.
//           `,
//         },
//         {
//           role: "user",
//           content: message,
//         },
//       ],
//       response_format: { type: "json_object" },
//     })

//     const analysis = JSON.parse(response.choices[0].message.content || "{}")
//     return analysis
//   } catch (error) {
//     console.error("Error analyzing message:", error)
//     return {
//       sentiment: 0,
//       purchaseIntent: 0,
//       questionIntent: false,
//       informationSharing: false,
//       objections: false,
//     }
//   }
// }

// /**
//  * Processes a new interaction and updates lead scores
//  */
// export async function processInteractionE(leadId: string, content: string, type: string, direction: string) {
//   try {
//     // Analyze the message content
//     const analysis = await analyzeMessage(content)

//     // Create the interaction record
//     const interaction = await client.leadInteraction.create({
//       data: {
//         leadId,
//         type,
//         content,
//         direction,
//         sentiment: analysis.sentiment,
//         intent: {
//           purchaseIntent: analysis.purchaseIntent,
//           questionIntent: analysis.questionIntent,
//           informationSharing: analysis.informationSharing,
//           objections: analysis.objections,
//         },
//         timestamp: new Date(),
//       },
//     })

//     // Get the lead and its qualification data
//     const lead = await client.lead.findUnique({
//       where: { id: leadId },
//       include: { qualificationData: true },
//     })

//     if (!lead) {
//       throw new Error(`Lead not found: ${leadId}`)
//     }

//     // Update qualification scores
//     let intentScore = lead.qualificationData?.intentScore || 0
//     let sentimentScore = lead.qualificationData?.sentimentScore || 0
//     let recencyScore = lead.qualificationData?.recencyScore || 0

//     // Update intent score based on purchase intent
//     if (analysis.purchaseIntent > 7) {
//       intentScore += 3
//     } else if (analysis.purchaseIntent > 5) {
//       intentScore += 2
//     } else if (analysis.purchaseIntent > 3) {
//       intentScore += 1
//     }

//     // Update sentiment score
//     if (analysis.sentiment > 0.5) {
//       sentimentScore += 2
//     } else if (analysis.sentiment > 0) {
//       sentimentScore += 1
//     } else if (analysis.sentiment < -0.5) {
//       sentimentScore -= 2
//     } else if (analysis.sentiment < 0) {
//       sentimentScore -= 1
//     }

//     // Update recency score (more recent interactions get higher scores)
//     recencyScore = 5 // Reset to max when there's a new interaction

//     // Calculate total score
//     const totalScore = intentScore + sentimentScore + recencyScore

//     // Update the qualification data
//     await client.leadQualificationData.upsert({
//       where: { leadId },
//       update: {
//         intentScore,
//         sentimentScore,
//         recencyScore,
//         aiAnalysis: analysis as Prisma.InputJsonValue,
//         updatedAt: new Date(),
//       },
//       create: {
//         leadId,
//         intentScore,
//         sentimentScore,
//         recencyScore,
//         demographicScore: 0,
//         frequencyScore: 0,
//         engagementScore: 0,
//         qualificationData: Prisma.JsonNull,
//         aiAnalysis: analysis as Prisma.InputJsonValue,
//       },
//     })

//     // Update the lead score and last contact date
//     await client.lead.update({
//       where: { id: leadId },
//       data: {
//         score: totalScore,
//         lastInteractionAt: new Date(),
//         updatedAt: new Date(),
//       },
//     })

//     // Check if the lead should be qualified based on score
//     if (totalScore >= 10 && lead.status === "QUALIFYING") {
//       await qualifyLead(leadId)
//     }

//     return interaction
//   } catch (error) {
//     console.error("Error processing interaction:", error)
//     throw error
//   }
// }

// /**
//  * Qualifies a lead based on its score and other criteria
//  */
// export async function qualifyLeadE(leadId: string) {
//   try {
//     const lead = await client.lead.findUnique({
//       where: { id: leadId },
//       include: { qualificationData: true },
//     })

//     if (!lead) {
//       throw new Error(`Lead not found: ${leadId}`)
//     }

//     // Update the lead status to QUALIFIED
//     await client.lead.update({
//       where: { id: leadId },
//       data: {
//         status: "QUALIFIED",
//         updatedAt: new Date(),
//       },
//     })

//     return true
//   } catch (error) {
//     console.error("Error qualifying lead:", error)
//     throw error
//   }
// }

// /**
//  * Creates a new lead from an Instagram interaction
//  */
// export async function createLeadFromInstagramE(
//   userId: string,
//   automationId: string | null,
//   instagramUserId: string,
//   pageId: string,
//   initialMessage: string,
// ) {
//   try {
//     // Create the lead
//     const lead = await client.lead.create({
//       data: {
//         userId,
//         automationId,
//         platformId: pageId,
//         customerId: instagramUserId,
//         status: "NEW",
//         score: 0,
//         totalInteractions: 1,
//         lastInteractionAt: new Date(),
//         sentToN8n: false,
//       },
//     })

//     // Process the initial interaction
//     await processInteraction(lead.id, initialMessage, "message", "inbound")

//     // Update lead status to QUALIFYING
//     await client.lead.update({
//       where: { id: lead.id },
//       data: {
//         status: "QUALIFYING",
//         updatedAt: new Date(),
//       },
//     })

//     return lead
//   } catch (error) {
//     console.error("Error creating lead from Instagram:", error)
//     throw error
//   }
// }

// /**
//  * Updates a lead's status
//  */
// export async function updateLeadStatusE(leadId: string, status: LeadStatus, notes?: string) {
//   try {
//     const updateData: Prisma.LeadUpdateInput = {
//       status,
//       updatedAt: new Date(),
//     }

//     if (notes) {
//       updateData.notes = notes
//     }

//     const lead = await client.lead.update({
//       where: { id: leadId },
//       data: updateData,
//     })

//     return lead
//   } catch (error) {
//     console.error("Error updating lead status:", error)
//     throw error
//   }
// }

// /**
//  * Analyzes a lead based on Instagram interaction
//  */
// export async function analyzeLead(params: {
//   userId: string
//   automationId: string
//   platformId: string
//   customerId: string
//   message: string
//   messageType: "DM" | "COMMENT"
//   timestamp: Date
// }): Promise<Lead | null> {
//   try {
//     const { userId, automationId, platformId, customerId, message, messageType, timestamp } = params

//     // Find existing lead or create a new one
//     let lead = await client.lead.findFirst({
//       where: {
//         customerId,
//         platformId,
//       },
//     })

//     if (!lead) {
//       // Create new lead
//       lead = await createLeadFromInstagram(userId, automationId, customerId, platformId, message)
//     } else {
//       // Process interaction for existing lead
//       await processInteraction(lead.id, message, messageType.toLowerCase(), "inbound")
//     }

//     return lead
//   } catch (error) {
//     console.error("Error analyzing lead:", error)
//     return null
//   }
// }

import { client } from "@/lib/prisma"
import { openai } from "@/lib/openai"
import { Prisma } from "@prisma/client"
import type { LeadStatus,Lead } from "@prisma/client"

/**
 * Analyzes a message for sentiment and intent
 */
export async function analyzeMessage(message: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `
            You are a lead qualification assistant. Analyze the following message for:
            1. Sentiment (score from -1.0 to 1.0)
            2. Purchase intent (score from 0 to 10)
            3. Question intent (is the person asking questions about products/services?)
            4. Information sharing (is the person sharing personal information?)
            5. Objections (is the person raising objections or concerns?)
            
            Respond with a JSON object only, no other text.
          `,
        },
        {
          role: "user",
          content: message,
        },
      ],
      response_format: { type: "json_object" },
    })

    const analysis = JSON.parse(response.choices[0].message.content || "{}")
    return analysis
  } catch (error) {
    console.error("Error analyzing message:", error)
    return {
      sentiment: 0,
      purchaseIntent: 0,
      questionIntent: false,
      informationSharing: false,
      objections: false,
    }
  }
}

/**
 * Processes a new interaction and updates lead scores
 */
export async function processInteraction(leadId: string, content: string, type: string, direction: string) {
  try {
    // Analyze the message content
    const analysis = await analyzeMessage(content)

    // Create the interaction record
    const interaction = await client.leadInteraction.create({
      data: {
        leadId,
        type,
        content,
        direction,
        sentiment: analysis.sentiment,
        intent: analysis.intent || Prisma.JsonNull,
        timestamp: new Date(),
      },
    })

    // Get the lead and its qualification data
    const lead = await client.lead.findUnique({
      where: { id: leadId },
      include: { qualificationData: true },
    })

    if (!lead) {
      throw new Error(`Lead not found: ${leadId}`)
    }

    // Update qualification scores
    let intentScore = lead.qualificationData?.intentScore || 0
    let sentimentScore = lead.qualificationData?.sentimentScore || 0
    let recencyScore = lead.qualificationData?.recencyScore || 0

    // Update intent score based on purchase intent
    if (analysis.purchaseIntent > 7) {
      intentScore += 3
    } else if (analysis.purchaseIntent > 5) {
      intentScore += 2
    } else if (analysis.purchaseIntent > 3) {
      intentScore += 1
    }

    // Update sentiment score
    if (analysis.sentiment > 0.5) {
      sentimentScore += 2
    } else if (analysis.sentiment > 0) {
      sentimentScore += 1
    } else if (analysis.sentiment < -0.5) {
      sentimentScore -= 2
    } else if (analysis.sentiment < 0) {
      sentimentScore -= 1
    }

    // Update recency score (more recent interactions get higher scores)
    recencyScore = 5 // Reset to max when there's a new interaction

    // Calculate total score
    const totalScore = intentScore + sentimentScore + recencyScore

    // Update the qualification data
    await client.leadQualificationData.upsert({
      where: { leadId },
      update: {
        intentScore,
        sentimentScore,
        recencyScore,
        aiAnalysis: analysis as Prisma.InputJsonValue,
        updatedAt: new Date(),
      },
      create: {
        leadId,
        intentScore,
        sentimentScore,
        recencyScore,
        demographicScore: 0,
        frequencyScore: 0,
        engagementScore: 0,
        qualificationData: Prisma.JsonNull,
        aiAnalysis: analysis as Prisma.InputJsonValue,
      },
    })

    // Update the lead score and contact date
    await client.lead.update({
      where: { id: leadId },
      data: {
        score: totalScore,
        updatedAt: new Date(),
      },
    })

    // Check if the lead should be qualified based on score
    if (totalScore >= 10 && lead.status === "QUALIFYING") {
      await qualifyLead(leadId)
    }

    return interaction
  } catch (error) {
    console.error("Error processing interaction:", error)
    throw error
  }
}

/**
 * Qualifies a lead based on its score and other criteria
 */
export async function qualifyLead(leadId: string) {
  try {
    const lead = await client.lead.findUnique({
      where: { id: leadId },
      include: { qualificationData: true },
    })

    if (!lead) {
      throw new Error(`Lead not found: ${leadId}`)
    }

    // Update the lead status to QUALIFIED
    await client.lead.update({
      where: { id: leadId },
      data: {
        status: "QUALIFIED",
        updatedAt: new Date(),
      },
    })

    return true
  } catch (error) {
    console.error("Error qualifying lead:", error)
    throw error
  }
}

/**
 * Creates a new lead from an Instagram interaction
 */
export async function createLeadFromInstagram(
  userId: string,
  automationId: string | null,
  instagramUserId: string,
  pageId: string,
  initialMessage: string,
) {
  try {
    // Create the lead
    const lead = await client.lead.create({
      data: {
        userId,
        automationId,
        instagramUserId,
        pageId,
        status: "NEW",
        score: 0,
        // interactions: 0,
        sentToN8n: false,
      },
    })

    // Process the initial interaction
    await processInteraction(lead.id, initialMessage, "message", "inbound")

    // Update lead status to QUALIFYING
    await client.lead.update({
      where: { id: lead.id },
      data: {
        status: "QUALIFYING",
      },
    })

    return lead
  } catch (error) {
    console.error("Error creating lead from Instagram:", error)
    throw error
  }
}

/**
 * Updates a lead's status
 */
export async function updateLeadStatus(leadId: string, status: LeadStatus, notes?: string) {
  try {
    const updateData: any = {
      status,
      updatedAt: new Date(),
    }

    if (notes) {
      updateData.notes = notes
    }

    const lead = await client.lead.update({
      where: { id: leadId },
      data: updateData,
    })

    return lead
  } catch (error) {
    console.error("Error updating lead status:", error)
    throw error
  }
}


export async function analyzeLead(params: {
  userId: string
  automationId: string
  platformId: string
  customerId: string
  message: string
  messageType: "DM" | "COMMENT"
  timestamp: Date
}): Promise<Lead | null> {
  try {
    const { userId, automationId, platformId, customerId, message, messageType, timestamp } = params

    // Find existing lead or create a new one
    let lead = await client.lead.findUnique({
      where: { id: userId },
      include: { qualificationData: true },
    })
    // let lead = await client.lead.findFirst({
    //   where: {
    //     customerId,
    //     platformId,
    //   },
    // })

    if (!lead) {
      // Create new lead
      // lead = await createLeadFromInstagram(userId, automationId, customerId, platformId, message)
      await createLeadFromInstagram(userId, automationId, customerId, platformId, message)
    } else {
      // Process interaction for existing lead
      await processInteraction(lead.id, message, messageType.toLowerCase(), "inbound")
    }

    return lead
  } catch (error) {
    console.error("Error analyzing lead:", error)
    return null
  }
}