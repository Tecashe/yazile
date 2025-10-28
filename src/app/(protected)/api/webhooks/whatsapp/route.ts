import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Log webhook event
    await prisma.whatsAppWebhookLog.create({
      data: {
        eventType: body.entry?.[0]?.changes?.[0]?.field || "unknown",
        payload: body,
        processed: false,
      },
    })

    // Process webhook
    const entry = body.entry?.[0]
    if (!entry) return NextResponse.json({ success: true })

    const changes = entry.changes?.[0]
    if (!changes) return NextResponse.json({ success: true })

    const value = changes.value
    if (!value) return NextResponse.json({ success: true })

    // Handle messages
    if (value.messages) {
      for (const message of value.messages) {
        await handleWhatsAppMessage(message, value)
      }
    }

    // Handle status updates
    if (value.statuses) {
      for (const status of value.statuses) {
        await handleWhatsAppStatus(status)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("WhatsApp webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function handleWhatsAppMessage(message: any, value: any) {
  try {
    const { from, text, message_id, timestamp } = message
    const { phone_number_id } = value

    // Find automation rules
    const automationRules = await prisma.whatsAppAutomationRule.findMany({
      where: { isActive: true },
    })

    for (const rule of automationRules) {
      if (shouldTriggerWhatsAppRule(rule, text?.body)) {
        // Create message record
        await prisma.whatsAppMessage.create({
          data: {
            whatsAppAccountId: rule.whatsAppAccountId,
            waId: from,
            phoneNumber: from,
            messageType: "text",
            content: text?.body || "",
            direction: "inbound",
            status: "received",
            automationRuleId: rule.id,
          },
        })

        // Send automated response
        console.log(`Sending WhatsApp response: ${rule.responseContent}`)
      }
    }
  } catch (error) {
    console.error("Error handling WhatsApp message:", error)
  }
}

async function handleWhatsAppStatus(status: any) {
  try {
    const { id, status: messageStatus } = status

    // Update message status
    await prisma.whatsAppMessage.updateMany({
      where: { messageId: id },
      data: { status: messageStatus },
    })
  } catch (error) {
    console.error("Error handling WhatsApp status:", error)
  }
}

function shouldTriggerWhatsAppRule(rule: any, messageContent?: string): boolean {
  if (rule.trigger === "keyword" && rule.triggerValue && messageContent) {
    return messageContent.toLowerCase().includes(rule.triggerValue.toLowerCase())
  }
  if (rule.trigger === "welcome") {
    return true
  }
  return false
}

export async function GET(request: NextRequest) {
  // Webhook verification
  const mode = request.nextUrl.searchParams.get("hub.mode")
  const token = request.nextUrl.searchParams.get("hub.verify_token")
  const challenge = request.nextUrl.searchParams.get("hub.challenge")

  if (mode === "subscribe" && token === process.env.WHATSAPP_WEBHOOK_TOKEN) {
    return NextResponse.json(challenge)
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
}
