// import { type NextRequest, NextResponse } from "next/server"
// import { validateVoiceflowRequest } from "@/lib/voiceflow-auth"
// import { getIntegration, logApiCall, getDecryptedCredentials } from "@/lib/integration-service"

// export async function POST(request: NextRequest) {
//   const startTime = Date.now()
//   let integrationId: string | null = null
//   let sessionId: string | null = null
//   let body: any = null

//   try {
//     const rawBody = await request.text()
//     if (!rawBody || rawBody.trim() === "") {
//       return NextResponse.json({ error: "Request body is empty" }, { status: 400 })
//     }

//     body = JSON.parse(rawBody)
//     const {
//       tenantId,
//       sessionId: vfSessionId,
//       eventUri, // The scheduled event URI to cancel
//       cancellationReason = "Cancelled via Instagram DM",
//       notifyInvitee = true,
//       // Optional: specific invitee URI to cancel (for group events)
//       inviteeUri
//     } = body

//     if (!tenantId || !vfSessionId || !eventUri) {
//       return NextResponse.json(
//         {
//           error: "Missing required fields",
//           details: "tenantId, sessionId, and eventUri are required"
//         },
//         { status: 400 }
//       )
//     }

//     sessionId = vfSessionId

//     const isValid = await validateVoiceflowRequest(request, body)
//     if (!isValid) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const integration = await getIntegration(tenantId, "CALENDLY")
//     if (!integration) {
//       return NextResponse.json({ error: "Calendly integration not configured" }, { status: 400 })
//     }

//     integrationId = integration.id
//     const credentials = await getDecryptedCredentials(integration)

//     // First, get event details to verify ownership and get invitee info
//     const eventResponse = await fetch(`https://api.calendly.com/scheduled_events/${eventUri.split('/').pop()}`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${credentials.accessToken}`,
//         "Content-Type": "application/json"
//       }
//     })

//     if (!eventResponse.ok) {
//       const errorData = await eventResponse.json()
//       throw new Error(`Failed to fetch event details: ${errorData.message || "Event not found"}`)
//     }

//     const eventData = await eventResponse.json()
//     const event = eventData.resource

//     // Get invitees for the event
//     const inviteesResponse = await fetch(`https://api.calendly.com/scheduled_events/${event.uri.split('/').pop()}/invitees`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${credentials.accessToken}`,
//         "Content-Type": "application/json"
//       }
//     })

//     if (!inviteesResponse.ok) {
//       const errorData = await inviteesResponse.json()
//       throw new Error(`Failed to fetch invitees: ${errorData.message || "Unknown error"}`)
//     }

//     const inviteesData = await inviteesResponse.json()
//     const invitees = inviteesData.collection || []

//     let cancellationResults = []

//     // If specific invitee URI is provided, cancel only that invitee (for group events)
//     if (inviteeUri) {
//       const targetInvitee = invitees.find((inv: any) => inv.uri === inviteeUri)
//       if (!targetInvitee) {
//         throw new Error("Specified invitee not found in this event")
//       }

//       const cancelResponse = await fetch(`https://api.calendly.com/scheduled_events/${event.uri.split('/').pop()}/invitees/${targetInvitee.uri.split('/').pop()}/cancel`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${credentials.accessToken}`,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           reason: cancellationReason
//         })
//       })

//       if (!cancelResponse.ok) {
//         const errorData = await cancelResponse.json()
//         throw new Error(`Calendly cancellation error: ${errorData.message || "Unknown error"}`)
//       }

//       cancellationResults.push({
//         inviteeUri: targetInvitee.uri,
//         inviteeEmail: targetInvitee.email,
//         status: "cancelled",
//         cancelledAt: new Date().toISOString()
//       })
//     } else {
//       // Cancel the entire event by cancelling all invitees
//       for (const invitee of invitees) {
//         try {
//           const cancelResponse = await fetch(`https://api.calendly.com/scheduled_events/${event.uri.split('/').pop()}/invitees/${invitee.uri.split('/').pop()}/cancel`, {
//             method: "POST",
//             headers: {
//               Authorization: `Bearer ${credentials.accessToken}`,
//               "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//               reason: cancellationReason
//             })
//           })

//           if (cancelResponse.ok) {
//             cancellationResults.push({
//               inviteeUri: invitee.uri,
//               inviteeEmail: invitee.email,
//               status: "cancelled",
//               cancelledAt: new Date().toISOString()
//             })
//           } else {
//             const errorData = await cancelResponse.json()
//             cancellationResults.push({
//               inviteeUri: invitee.uri,
//               inviteeEmail: invitee.email,
//               status: "error",
//               error: errorData.message || "Cancellation failed"
//             })
//           }
//         } catch (error) {
//           cancellationResults.push({
//             inviteeUri: invitee.uri,
//             inviteeEmail: invitee.email,
//             status: "error",
//             error: error instanceof Error ? error.message : "Unknown error"
//           })
//         }
//       }
//     }

//     await logApiCall({
//       tenantId,
//       integrationId,
//       sessionId: vfSessionId,
//       endpoint: "/api/voiceflow/calendly/cancel-event",
//       method: "POST",
//       requestBody: JSON.stringify(body),
//       statusCode: 200,
//       responseBody: JSON.stringify(cancellationResults),
//       duration: Date.now() - startTime
//     })

//     const successfulCancellations = cancellationResults.filter(r => r.status === "cancelled")
//     const failedCancellations = cancellationResults.filter(r => r.status === "error")

//     return NextResponse.json({
//       success: true,
//       eventUri: event.uri,
//       eventName: event.name,
//       originalStartTime: event.start_time,
//       originalEndTime: event.end_time,
//       cancellationReason,
//       results: {
//         total: cancellationResults.length,
//         successful: successfulCancellations.length,
//         failed: failedCancellations.length
//       },
//       cancellations: cancellationResults,
//       message: inviteeUri 
//         ? `Specific invitee cancelled successfully`
//         : `Event cancelled for ${successfulCancellations.length} of ${cancellationResults.length} invitees`
//     })

//   } catch (error) {
//     console.error("Calendly event cancellation error:", error)

//     if (body?.tenantId) {
//       await logApiCall({
//         tenantId: body?.tenantId,
//         integrationId,
//         sessionId,
//         endpoint: "/api/voiceflow/calendly/cancel-event",
//         method: "POST",
//         requestBody: body ? JSON.stringify(body) : undefined,
//         statusCode: 500,
//         error: error instanceof Error ? error.message : "Unknown error",
//         duration: Date.now() - startTime
//       })
//     }

//     return NextResponse.json(
//       {
//         error: "Failed to cancel Calendly event",
//         details: error instanceof Error ? error.message : "Unknown error"
//       },
//       { status: 500 }
//     )
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { validateVoiceflowRequest } from "@/lib/voiceflow-auth"
import { getIntegration, logApiCall, getDecryptedCredentials } from "@/lib/integration-service"

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  let integrationId: string | null = null
  let sessionId: string | null = null
  let body: any = null

  try {
    const rawBody = await request.text()
    if (!rawBody || rawBody.trim() === "") {
      return NextResponse.json({ error: "Request body is empty" }, { status: 400 })
    }

    body = JSON.parse(rawBody)
    const {
      tenantId,
      sessionId: vfSessionId,
      eventUri, // The scheduled event URI to cancel
      cancellationReason = "Cancelled via API",
      // Optional: specific invitee URI to cancel (for group events)
      inviteeUri
    } = body

    if (!tenantId || !vfSessionId || !eventUri) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: "tenantId, sessionId, and eventUri are required"
        },
        { status: 400 }
      )
    }

    sessionId = vfSessionId

    const isValid = await validateVoiceflowRequest(request, body)
    if (!isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const integration = await getIntegration(tenantId, "CALENDLY")
    if (!integration) {
      return NextResponse.json({ error: "Calendly integration not configured" }, { status: 400 })
    }

    integrationId = integration.id
    const credentials = await getDecryptedCredentials(integration)

    // Extract event UUID from URI (handle both full URI and UUID)
    const eventUuid = eventUri.includes('/') ? eventUri.split('/').pop() : eventUri

    // First, get event details to verify ownership and get invitee info
    const eventResponse = await fetch(`https://api.calendly.com/scheduled_events/${eventUuid}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${credentials.accessToken}`,
        "Content-Type": "application/json"
      }
    })

    if (!eventResponse.ok) {
      const errorData = await eventResponse.json()
      throw new Error(`Failed to fetch event details: ${errorData.message || errorData.title || "Event not found"}`)
    }

    const eventData = await eventResponse.json()
    const event = eventData.resource

    // Get invitees for the event
    const inviteesResponse = await fetch(`https://api.calendly.com/scheduled_events/${eventUuid}/invitees`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${credentials.accessToken}`,
        "Content-Type": "application/json"
      }
    })

    if (!inviteesResponse.ok) {
      const errorData = await inviteesResponse.json()
      throw new Error(`Failed to fetch invitees: ${errorData.message || errorData.title || "Unknown error"}`)
    }

    const inviteesData = await inviteesResponse.json()
    const invitees = inviteesData.collection || []

    if (invitees.length === 0) {
      throw new Error("No invitees found for this event")
    }

    let cancellationResults = []

    // If specific invitee URI is provided, cancel only that invitee (for group events)
    if (inviteeUri) {
      const inviteeUuid = inviteeUri.includes('/') ? inviteeUri.split('/').pop() : inviteeUri
      const targetInvitee = invitees.find((inv: any) => 
        inv.uri.split('/').pop() === inviteeUuid || inv.uri === inviteeUri
      )
      
      if (!targetInvitee) {
        throw new Error("Specified invitee not found in this event")
      }

      const targetInviteeUuid = targetInvitee.uri.split('/').pop()
      
      const cancelResponse = await fetch(`https://api.calendly.com/scheduled_events/${eventUuid}/invitees/${targetInviteeUuid}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${credentials.accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          reason: cancellationReason
        })
      })

      if (!cancelResponse.ok) {
        const errorData = await cancelResponse.json()
        throw new Error(`Calendly cancellation error: ${errorData.message || errorData.title || "Unknown error"}`)
      }

      cancellationResults.push({
        inviteeUri: targetInvitee.uri,
        inviteeEmail: targetInvitee.email,
        inviteeName: targetInvitee.name,
        status: "cancelled",
        cancelledAt: new Date().toISOString()
      })
    } else {
      // Cancel the entire event by cancelling all invitees
      for (const invitee of invitees) {
        try {
          const inviteeUuid = invitee.uri.split('/').pop()
          
          const cancelResponse = await fetch(`https://api.calendly.com/scheduled_events/${eventUuid}/invitees/${inviteeUuid}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${credentials.accessToken}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              reason: cancellationReason
            })
          })

          if (cancelResponse.ok) {
            cancellationResults.push({
              inviteeUri: invitee.uri,
              inviteeEmail: invitee.email,
              inviteeName: invitee.name,
              status: "cancelled",
              cancelledAt: new Date().toISOString()
            })
          } else {
            const errorData = await cancelResponse.json()
            cancellationResults.push({
              inviteeUri: invitee.uri,
              inviteeEmail: invitee.email,
              inviteeName: invitee.name,
              status: "error",
              error: errorData.message || errorData.title || "Cancellation failed"
            })
          }
        } catch (error) {
          cancellationResults.push({
            inviteeUri: invitee.uri,
            inviteeEmail: invitee.email,
            inviteeName: invitee.name,
            status: "error",
            error: error instanceof Error ? error.message : "Unknown error"
          })
        }
      }
    }

    await logApiCall({
      tenantId,
      integrationId,
      sessionId: vfSessionId,
      endpoint: "/api/voiceflow/calendly/cancel-event",
      method: "POST",
      requestBody: JSON.stringify(body),
      statusCode: 200,
      responseBody: JSON.stringify(cancellationResults),
      duration: Date.now() - startTime
    })

    const successfulCancellations = cancellationResults.filter(r => r.status === "cancelled")
    const failedCancellations = cancellationResults.filter(r => r.status === "error")

    return NextResponse.json({
      success: true,
      eventUri: event.uri,
      eventName: event.name,
      originalStartTime: event.start_time,
      originalEndTime: event.end_time,
      cancellationReason,
      results: {
        total: cancellationResults.length,
        successful: successfulCancellations.length,
        failed: failedCancellations.length
      },
      cancellations: cancellationResults,
      message: inviteeUri 
        ? `Specific invitee cancelled successfully`
        : `Event cancelled for ${successfulCancellations.length} of ${cancellationResults.length} invitees`
    })

  } catch (error) {
    console.error("Calendly event cancellation error:", error)

    if (body?.tenantId) {
      await logApiCall({
        tenantId: body?.tenantId,
        integrationId,
        sessionId,
        endpoint: "/api/voiceflow/calendly/cancel-event",
        method: "POST",
        requestBody: body ? JSON.stringify(body) : undefined,
        statusCode: 500,
        error: error instanceof Error ? error.message : "Unknown error",
        duration: Date.now() - startTime
      })
    }

    return NextResponse.json(
      {
        error: "Failed to cancel Calendly event",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}