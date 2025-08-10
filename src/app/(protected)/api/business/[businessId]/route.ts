import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { businessId: string } }) {
  try {
    const { businessId } = params

    // Mock business data - replace with actual database query
    const mockBusiness = {
      id: businessId,
      businessName: "Sample Business",
      businessType: "Service Business",
      businessDescription: "A sample business for testing",
      industry: "Technology",
      targetAudience: "Small businesses",
      website: "https://example.com",
      instagramHandle: "@samplebusiness",
      whatsappNumber: "+1234567890",
      welcomeMessage: "Welcome to our business!",
      responseLanguage: "English",
      businessHours: "9 AM - 5 PM",
      location: "New York, NY",
      size: "Small",
      logo: null,
    }

    // Simulate database lookup
    // In real implementation, query your database here
    // const business = await prisma.business.findUnique({
    //   where: { id: businessId }
    // })

    // For demo purposes, return mock data if businessId exists
    if (businessId) {
      return NextResponse.json({
        success: true,
        business: mockBusiness,
      })
    } else {
      return NextResponse.json({ success: false, error: "Business not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error fetching business details:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { businessId: string } }) {
  try {
    const { businessId } = params
    const body = await request.json()

    // Mock update - replace with actual database update
    // const updatedBusiness = await prisma.business.update({
    //   where: { id: businessId },
    //   data: body
    // })

    return NextResponse.json({
      success: true,
      business: { id: businessId, ...body },
    })
  } catch (error) {
    console.error("Error updating business details:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
