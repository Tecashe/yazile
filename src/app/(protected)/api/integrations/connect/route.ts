// still in use - API route for platform integrations
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const connectIntegrationSchema = z.object({
  platform: z.string(),
  apiKey: z.string(),
  webhookUrl: z.string().optional(),
  userId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { platform, apiKey, webhookUrl, userId } = connectIntegrationSchema.parse(body)

    // In production, this would:
    // 1. Validate the API key with the platform
    // 2. Set up webhooks
    // 3. Store encrypted credentials
    // 4. Test the connection

    // For demo purposes, simulate connection validation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate API key validation
    if (apiKey.length < 10) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 400 })
    }

    // Store integration (in production, encrypt the API key)
    if (userId) {
      await prisma.apiIntegration.create({
        data: {
          userId,
          name: `${platform} Integration`,
          type: "social_media",
          endpoint: `https://api.${platform}.com`,
          authType: "api_key",
          authConfig: {
            apiKey: "encrypted_" + apiKey.slice(-4), // In production, properly encrypt
            platform,
          },
          isActive: true,
        },
      })
    }

    return NextResponse.json({
      success: true,
      platform,
      status: "connected",
      message: `Successfully connected to ${platform}`,
    })
  } catch (error) {
    console.error("Integration connection failed:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Connection failed" }, { status: 500 })
  }
}
