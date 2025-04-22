

import { type NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const emailId = params.id
  const url = request.nextUrl.searchParams.get("url")

  if (!url) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  try {
    // Update the email status to CLICKED
    await client.email.update({
      where: { id: emailId },
      data: {
        status: "CLICKED",
        clickedAt: new Date(),
      },
    })

    // Redirect to the original URL
    return NextResponse.redirect(new URL(url))
  } catch (error) {
    console.error("Error tracking email click:", error)

    // Still redirect to avoid breaking the user experience
    return NextResponse.redirect(new URL(url))
  }
}

