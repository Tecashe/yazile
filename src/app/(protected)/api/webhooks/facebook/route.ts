import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Log webhook event
    await prisma.facebookWebhookLog.create({
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
        await handleFacebookMessage(message, value)
      }
    }

    // Handle comments
    if (value.comments) {
      for (const comment of value.comments) {
        await handleFacebookComment(comment, value)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Facebook webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function handleFacebookMessage(message: any, value: any) {
  try {
    const { from, message: messageText, mid, created_time } = message
    const { page_id } = value

    // Find automation rules
    const automationRules = await prisma.facebookAutomationRule.findMany({
      where: { isActive: true },
    })

    for (const rule of automationRules) {
      if (shouldTriggerFacebookRule(rule, messageText)) {
        // Create message record
        await prisma.facebookMessage.create({
          data: {
            facebookPageId: page_id,
            conversationId: from.id,
            senderId: from.id,
            recipientId: page_id,
            content: messageText || "",
            messageType: "text",
            direction: "inbound",
            status: "received",
            source: "messenger",
            automationRuleId: rule.id,
          },
        })

        // Send automated response
        console.log(`Sending Facebook response: ${rule.responseContent}`)
      }
    }
  } catch (error) {
    console.error("Error handling Facebook message:", error)
  }
}

async function handleFacebookComment(comment: any, value: any) {
  try {
    const { from, message: commentText, id, created_time, post_id } = comment
    const { page_id } = value

    // Find automation rules
    const automationRules = await prisma.facebookAutomationRule.findMany({
      where: { isActive: true },
    })

    for (const rule of automationRules) {
      if (rule.trigger === "comment_keyword" && shouldTriggerFacebookRule(rule, commentText)) {
        // Create comment record
        await prisma.facebookComment.create({
          data: {
            facebookPageId: page_id,
            commentId: id,
            postId: post_id,
            userId: from.id,
            content: commentText || "",
            status: "pending",
          },
        })

        // Send automated reply
        console.log(`Sending Facebook comment reply: ${rule.responseContent}`)
      }
    }
  } catch (error) {
    console.error("Error handling Facebook comment:", error)
  }
}

function shouldTriggerFacebookRule(rule: any, messageContent?: string): boolean {
  if (rule.trigger === "message_keyword" && rule.triggerValue && messageContent) {
    return messageContent.toLowerCase().includes(rule.triggerValue.toLowerCase())
  }
  if (rule.trigger === "comment_keyword" && rule.triggerValue && messageContent) {
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

  if (mode === "subscribe" && token === process.env.FACEBOOK_WEBHOOK_TOKEN) {
    return NextResponse.json(challenge)
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
}
