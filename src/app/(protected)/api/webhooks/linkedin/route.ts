import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Verify webhook token
    const token = request.headers.get("x-webhook-token")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Log webhook event
    await prisma.linkedInWebhookLog.create({
      data: {
        eventType: body.event_type || "unknown",
        payload: body,
        processed: false,
      },
    })

    // Process webhook based on event type
    switch (body.event_type) {
      case "message_received":
        // Handle incoming message
        await handleLinkedInMessage(body)
        break
      case "connection_request":
        // Handle connection request
        await handleConnectionRequest(body)
        break
      default:
        console.log("Unknown event type:", body.event_type)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("LinkedIn webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function handleLinkedInMessage(data: any) {
  try {
    const { sender_id, recipient_id, message_content, conversation_id } = data

    // Find the automation rule that should handle this
    const automationRules = await prisma.linkedInAutomationRule.findMany({
      where: { isActive: true },
    })

    for (const rule of automationRules) {
      if (shouldTriggerRule(rule, message_content)) {
        // Create message record
        await prisma.linkedInMessage.create({
          data: {
            linkedInAccountId: rule.linkedInAccountId,
            conversationId: conversation_id,
            senderId: sender_id,
            recipientId: recipient_id,
            content: message_content,
            direction: "inbound",
            status: "received",
            automationRuleId: rule.id,
          },
        })

        // Send automated response
        // This would integrate with LinkedIn API to send the response
        console.log(`Sending response: ${rule.responseContent}`)
      }
    }
  } catch (error) {
    console.error("Error handling LinkedIn message:", error)
  }
}

async function handleConnectionRequest(data: any) {
  try {
    const { sender_id, sender_name } = data

    // Create contact record
    await prisma.linkedInContact.create({
      data: {
        linkedInAccountId: data.account_id,
        linkedInId: sender_id,
        firstName: sender_name?.split(" ")[0] || "Unknown",
        lastName: sender_name?.split(" ")[1] || "",
        connectionStatus: "pending",
      },
    })
  } catch (error) {
    console.error("Error handling connection request:", error)
  }
}

function shouldTriggerRule(rule: any, messageContent: string): boolean {
  if (rule.trigger === "message_keyword" && rule.triggerValue) {
    return messageContent.toLowerCase().includes(rule.triggerValue.toLowerCase())
  }
  if (rule.trigger === "welcome_message") {
    return true
  }
  return false
}

export async function GET(request: NextRequest) {
  // Webhook verification
  const mode = request.nextUrl.searchParams.get("hub.mode")
  const token = request.nextUrl.searchParams.get("hub.verify_token")
  const challenge = request.nextUrl.searchParams.get("hub.challenge")

  if (mode === "subscribe" && token === process.env.LINKEDIN_WEBHOOK_TOKEN) {
    return NextResponse.json(challenge)
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
}
