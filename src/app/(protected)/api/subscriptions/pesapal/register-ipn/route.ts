// app/api/subscriptions/pesapal/register-ipn/route.ts
import { NextRequest, NextResponse } from "next/server"
import { pesapal } from "@/lib/pesapal-client"

export async function POST(req: NextRequest) {
  try {
    // Security: Add authentication check here
    // Only allow this endpoint to be called by admins

    const ipnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/subscriptions/pesapal/callback`
    
    console.log("Registering IPN URL:", ipnUrl)
    
    const ipnId = await pesapal.registerIPN(ipnUrl, "GET")
    
    console.log("IPN registered successfully. ID:", ipnId)
    
    return NextResponse.json({
      success: true,
      ipnId: ipnId,
      message: "IPN registered successfully. Add this ID to your PESAPAL_IPN_ID environment variable.",
    })
  } catch (error: any) {
    console.error("Failed to register IPN:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to register IPN",
      },
      { status: 500 }
    )
  }
}