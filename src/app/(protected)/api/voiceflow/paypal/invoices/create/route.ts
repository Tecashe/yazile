import { type NextRequest, NextResponse } from "next/server"
import { validateVoiceflowRequest } from "@/lib/voiceflow-auth"
import { getIntegration } from "@/lib/integration-service"
import { decrypt } from "@/lib/encrypt"
import { client } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate Voiceflow request
    const isValid = await validateVoiceflowRequest(request, body)
    if (!isValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { tenantId, recipientEmail, items, currency = "USD", note, dueDate } = body

    if (!tenantId || !recipientEmail || !items || !Array.isArray(items)) {
      return NextResponse.json(
        {
          error: "Missing required fields: tenantId, recipientEmail, items",
        },
        { status: 400 },
      )
    }

    // Get PayPal integration
    const integration = await getIntegration(tenantId, "PAYPAL")
    if (!integration) {
      return NextResponse.json(
        {
          error: "PayPal integration not found",
        },
        { status: 404 },
      )
    }

    // Decrypt credentials
    const [encryptedData, ivHex] = integration.encryptedCredentials.split(":")
    const credentials = JSON.parse(decrypt(encryptedData, ivHex))

    // Get PayPal access token
    const tokenResponse = await fetch(
      `${credentials.sandbox ? "https://api.sandbox.paypal.com" : "https://api.paypal.com"}/v1/oauth2/token`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${credentials.clientId}:${credentials.clientSecret}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      },
    )

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Calculate total amount
    const totalAmount = items.reduce((sum: number, item: any) => {
      return sum + item.quantity * item.unitAmount
    }, 0)

    // Create invoice
    const invoiceData = {
      detail: {
        invoice_number: `INV-${Date.now()}`,
        currency_code: currency,
        note: note || "Invoice created via Instagram DM automation",
        payment_term: {
          due_date: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        },
      },
      invoicer: {
        name: {
          business_name: credentials.businessName || "Your Business",
        },
        email_address: credentials.businessEmail,
      },
      primary_recipients: [
        {
          billing_info: {
            email_address: recipientEmail,
          },
        },
      ],
      items: items.map((item: any) => ({
        name: item.name,
        description: item.description || "",
        quantity: item.quantity.toString(),
        unit_amount: {
          currency_code: currency,
          value: item.unitAmount.toFixed(2),
        },
      })),
      configuration: {
        partial_payment: {
          allow_partial_payment: false,
        },
        allow_tip: false,
        tax_calculated_after_discount: true,
        tax_inclusive: false,
      },
      amount: {
        breakdown: {
          item_total: {
            currency_code: currency,
            value: totalAmount.toFixed(2),
          },
        },
      },
    }

    const invoiceResponse = await fetch(
      `${credentials.sandbox ? "https://api.sandbox.paypal.com" : "https://api.paypal.com"}/v2/invoicing/invoices`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoiceData),
      },
    )

    const invoice = await invoiceResponse.json()

    if (!invoiceResponse.ok) {
      throw new Error(`PayPal API error: ${invoice.message || "Unknown error"}`)
    }

    // Send the invoice
    await fetch(
      `${credentials.sandbox ? "https://api.sandbox.paypal.com" : "https://api.paypal.com"}/v2/invoicing/invoices/${invoice.id}/send`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          send_to_recipient: true,
          send_to_invoicer: false,
        }),
      },
    )

    // Log API call
    await client.apiLog.create({
      data: {
        tenantId,
        endpoint: "/api/voiceflow/paypal/invoices/create",
        method: "POST",
        requestBody: JSON.stringify({ recipientEmail, items, totalAmount }),
        responseBody: JSON.stringify({ invoiceId: invoice.id }),
        statusCode: 200,
        duration: 0,
        // success: true,
      },
    })

    return NextResponse.json({
      success: true,
      invoice: {
        id: invoice.id,
        status: invoice.status,
        invoiceNumber: invoice.detail.invoice_number,
        totalAmount: totalAmount,
        currency: currency,
        recipientEmail: recipientEmail,
        dueDate: invoiceData.detail.payment_term.due_date,
        viewUrl: invoice.href,
      },
    })
  } catch (error: any) {
    console.error("PayPal invoice creation error:", error)

    // Log error
    try {
      const body = await request.json()
      await client.apiLog.create({
        data: {
          tenantId: body.tenantId || "unknown",
          endpoint: "/api/voiceflow/paypal/invoices/create",
          method: "POST",
          requestBody: JSON.stringify(body),
          responseBody: JSON.stringify({ error: error.message }),
          statusCode: 500,
          duration: 0,
        //   success: false,
        },
      })
    } catch (logError) {
      console.error("Failed to log API error:", logError)
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create invoice",
      },
      { status: 500 },
    )
  }
}

/*
VOICEFLOW API BLOCK SETUP:
1. Create an API Block in Voiceflow
2. Set Method: POST
3. Set URL: {your_domain}/api/voiceflow/paypal/invoices/create
4. Headers:
   - Content-Type: application/json
   - x-voiceflow-api-key: {your_voiceflow_api_key}
5. Body (JSON):
   {
     "tenantId": "{tenant_id}",
     "recipientEmail": "{customer_email}",
     "items": [
       {
         "name": "Product Name",
         "description": "Product Description",
         "quantity": 1,
         "unitAmount": 99.99
       }
     ],
     "currency": "USD",
     "note": "Custom invoice note",
     "dueDate": "2024-12-31"
   }
6. Response Mapping:
   - success: {response.success}
   - invoice_id: {response.invoice.id}
   - invoice_status: {response.invoice.status}
   - total_amount: {response.invoice.totalAmount}
*/
