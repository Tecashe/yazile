import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"

/**
 * GET /api/crm/sync-settings
 * Fetch sync settings for a user
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Get or create sync settings for the user
    let syncSettings = await client.crmSyncSettings.findUnique({
      where: { userId },
    })

    // If no settings exist, create default ones
    if (!syncSettings) {
      syncSettings = await client.crmSyncSettings.create({
        data: {
          userId,
          autoSyncQualified: true,
          createDealsHighValue: true,
          syncLeadScores: true,
          realTimeSync: true,
        },
      })
    }

    return NextResponse.json({
      autoSyncQualified: syncSettings.autoSyncQualified,
      createDealsHighValue: syncSettings.createDealsHighValue,
      syncLeadScores: syncSettings.syncLeadScores,
      realTimeSync: syncSettings.realTimeSync,
    })
  } catch (error) {
    console.error("Error fetching sync settings:", error)
    return NextResponse.json({ error: "Failed to fetch sync settings" }, { status: 500 })
  }
}

/**
 * POST /api/crm/sync-settings
 * Update sync settings for a user
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, settings } = body

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    if (!settings || typeof settings !== "object") {
      return NextResponse.json({ error: "Settings object is required" }, { status: 400 })
    }

    // Validate settings structure
    const { autoSyncQualified, createDealsHighValue, syncLeadScores, realTimeSync } = settings

    if (
      typeof autoSyncQualified !== "boolean" ||
      typeof createDealsHighValue !== "boolean" ||
      typeof syncLeadScores !== "boolean" ||
      typeof realTimeSync !== "boolean"
    ) {
      return NextResponse.json({ error: "All settings must be boolean values" }, { status: 400 })
    }

    // Update or create sync settings
    const syncSettings = await client.crmSyncSettings.upsert({
      where: { userId },
      update: {
        autoSyncQualified,
        createDealsHighValue,
        syncLeadScores,
        realTimeSync,
        updatedAt: new Date(),
      },
      create: {
        userId,
        autoSyncQualified,
        createDealsHighValue,
        syncLeadScores,
        realTimeSync,
      },
    })

    console.log(`✅ Updated sync settings for user ${userId}:`, {
      autoSyncQualified,
      createDealsHighValue,
      syncLeadScores,
      realTimeSync,
    })

    return NextResponse.json({
      success: true,
      settings: {
        autoSyncQualified: syncSettings.autoSyncQualified,
        createDealsHighValue: syncSettings.createDealsHighValue,
        syncLeadScores: syncSettings.syncLeadScores,
        realTimeSync: syncSettings.realTimeSync,
      },
    })
  } catch (error) {
    console.error("Error updating sync settings:", error)
    return NextResponse.json({ error: "Failed to update sync settings" }, { status: 500 })
  }
}

/**
 * DELETE /api/crm/sync-settings
 * Reset sync settings to defaults for a user
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Reset to default settings
    const defaultSettings = await client.crmSyncSettings.upsert({
      where: { userId },
      update: {
        autoSyncQualified: true,
        createDealsHighValue: true,
        syncLeadScores: true,
        realTimeSync: true,
        updatedAt: new Date(),
      },
      create: {
        userId,
        autoSyncQualified: true,
        createDealsHighValue: true,
        syncLeadScores: true,
        realTimeSync: true,
      },
    })

    console.log(`🔄 Reset sync settings to defaults for user ${userId}`)

    return NextResponse.json({
      success: true,
      settings: {
        autoSyncQualified: defaultSettings.autoSyncQualified,
        createDealsHighValue: defaultSettings.createDealsHighValue,
        syncLeadScores: defaultSettings.syncLeadScores,
        realTimeSync: defaultSettings.realTimeSync,
      },
    })
  } catch (error) {
    console.error("Error resetting sync settings:", error)
    return NextResponse.json({ error: "Failed to reset sync settings" }, { status: 500 })
  }
}
