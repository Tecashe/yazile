// import { type NextRequest, NextResponse } from "next/server"
// import { PrismaClient } from "@prisma/client"

// const prisma = new PrismaClient()

// export async function GET(request: NextRequest) {
//   try {
//     const tenantId = request.headers.get("x-tenant-id") || "default-tenant-id"

//     const integrations = await prisma.integration.findMany({
//       where: {
//         tenantId: tenantId,
//         isActive: true,
//       },
//       select: {
//         id: true,
//         name: true,
//         type: true,
//         isActive: true,
//         capabilities: true,
//         lastSyncAt: true,
//         lastErrorAt: true,
//         errorCount: true,
//       },
//       orderBy: {
//         name: "asc",
//       },
//     })

//     const integrationsWithCapabilities = integrations.map((integration) => {
//       let capabilities: any[] = []

//       try {
//         const capabilitiesData = integration.capabilities ? JSON.parse(integration.capabilities) : {}

//         // Define capabilities based on integration type
//         switch (integration.type) {
//           case "STRIPE":
//             capabilities = [
//               {
//                 id: "create_payment_link",
//                 name: "Create Payment Link",
//                 description: "Generate secure payment links",
//                 enabled: capabilitiesData.create_payment_link !== false,
//               },
//               {
//                 id: "verify_payment",
//                 name: "Verify Payment",
//                 description: "Check payment status",
//                 enabled: capabilitiesData.verify_payment !== false,
//               },
//               {
//                 id: "process_refunds",
//                 name: "Process Refunds",
//                 description: "Issue refunds",
//                 enabled: capabilitiesData.process_refunds !== false,
//               },
//               {
//                 id: "create_customer",
//                 name: "Create Customer",
//                 description: "Create new customers",
//                 enabled: capabilitiesData.create_customer !== false,
//               },
//             ]
//             break
//           case "SHOPIFY":
//             capabilities = [
//               {
//                 id: "get_products",
//                 name: "Get Products",
//                 description: "Retrieve product information",
//                 enabled: capabilitiesData.get_products !== false,
//               },
//               {
//                 id: "create_order",
//                 name: "Create Order",
//                 description: "Generate new orders",
//                 enabled: capabilitiesData.create_order !== false,
//               },
//               {
//                 id: "update_inventory",
//                 name: "Update Inventory",
//                 description: "Modify stock levels",
//                 enabled: capabilitiesData.update_inventory !== false,
//               },
//               {
//                 id: "get_customers",
//                 name: "Get Customers",
//                 description: "Retrieve customer data",
//                 enabled: capabilitiesData.get_customers !== false,
//               },
//             ]
//             break
//           case "CALENDLY":
//             capabilities = [
//               {
//                 id: "create_booking",
//                 name: "Create Booking",
//                 description: "Schedule appointments",
//                 enabled: capabilitiesData.create_booking !== false,
//               },
//               {
//                 id: "check_availability",
//                 name: "Check Availability",
//                 description: "View available slots",
//                 enabled: capabilitiesData.check_availability !== false,
//               },
//               {
//                 id: "cancel_booking",
//                 name: "Cancel Booking",
//                 description: "Cancel appointments",
//                 enabled: capabilitiesData.cancel_booking !== false,
//               },
//               {
//                 id: "get_events",
//                 name: "Get Events",
//                 description: "Retrieve scheduled events",
//                 enabled: capabilitiesData.get_events !== false,
//               },
//             ]
//             break
//           case "SENDGRID":
//             capabilities = [
//               {
//                 id: "send_email",
//                 name: "Send Email",
//                 description: "Send personalized emails",
//                 enabled: capabilitiesData.send_email !== false,
//               },
//               {
//                 id: "send_template",
//                 name: "Send Template",
//                 description: "Use email templates",
//                 enabled: capabilitiesData.send_template !== false,
//               },
//               {
//                 id: "manage_contacts",
//                 name: "Manage Contacts",
//                 description: "Add/update contacts",
//                 enabled: capabilitiesData.manage_contacts !== false,
//               },
//             ]
//             break
//           default:
//             capabilities = []
//         }

//         // Filter only enabled capabilities
//         capabilities = capabilities.filter((cap) => cap.enabled)
//       } catch (error) {
//         console.error(`Failed to parse capabilities for integration ${integration.id}:`, error)
//         capabilities = []
//       }

//       return {
//         ...integration,
//         capabilities: capabilities.map(({ enabled, ...cap }) => cap), // Remove enabled flag from response
//       }
//     })

//     return NextResponse.json({ integrations: integrationsWithCapabilities })
//   } catch (error) {
//     console.error("Failed to fetch integrations:", error)
//     return NextResponse.json({ error: "Failed to fetch integrations" }, { status: 500 })
//   }
// }
import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getCurrentTenant } from "@/lib/authe"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { tenantId } = await getCurrentTenant()

    const integrations = await prisma.integration.findMany({
      where: {
        tenantId: tenantId,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        type: true,
        isActive: true,
        capabilities: true,
        lastSyncAt: true,
        lastErrorAt: true,
        errorCount: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    const integrationsWithCapabilities = integrations.map((integration) => {
      let capabilities: any[] = []

      try {
        const capabilitiesData = integration.capabilities ? JSON.parse(integration.capabilities) : {}

        // Define capabilities based on integration type
        switch (integration.type) {
          case "STRIPE":
            capabilities = [
              {
                id: "create_payment_link",
                name: "Create Payment Link",
                description: "Generate secure payment links",
                enabled: capabilitiesData.create_payment_link !== false,
              },
              {
                id: "verify_payment",
                name: "Verify Payment",
                description: "Check payment status",
                enabled: capabilitiesData.verify_payment !== false,
              },
              {
                id: "process_refunds",
                name: "Process Refunds",
                description: "Issue refunds",
                enabled: capabilitiesData.process_refunds !== false,
              },
              {
                id: "create_customer",
                name: "Create Customer",
                description: "Create new customers",
                enabled: capabilitiesData.create_customer !== false,
              },
            ]
            break
          case "SHOPIFY":
            capabilities = [
              {
                id: "get_products",
                name: "Get Products",
                description: "Retrieve product information",
                enabled: capabilitiesData.get_products !== false,
              },
              {
                id: "create_order",
                name: "Create Order",
                description: "Generate new orders",
                enabled: capabilitiesData.create_order !== false,
              },
              {
                id: "update_inventory",
                name: "Update Inventory",
                description: "Modify stock levels",
                enabled: capabilitiesData.update_inventory !== false,
              },
              {
                id: "get_customers",
                name: "Get Customers",
                description: "Retrieve customer data",
                enabled: capabilitiesData.get_customers !== false,
              },
            ]
            break
          case "CALENDLY":
            capabilities = [
              {
                id: "create_booking",
                name: "Create Booking",
                description: "Schedule appointments",
                enabled: capabilitiesData.create_booking !== false,
              },
              {
                id: "check_availability",
                name: "Check Availability",
                description: "View available slots",
                enabled: capabilitiesData.check_availability !== false,
              },
              {
                id: "cancel_booking",
                name: "Cancel Booking",
                description: "Cancel appointments",
                enabled: capabilitiesData.cancel_booking !== false,
              },
              {
                id: "get_events",
                name: "Get Events",
                description: "Retrieve scheduled events",
                enabled: capabilitiesData.get_events !== false,
              },
            ]
            break
          case "SENDGRID":
            capabilities = [
              {
                id: "send_email",
                name: "Send Email",
                description: "Send personalized emails",
                enabled: capabilitiesData.send_email !== false,
              },
              {
                id: "send_template",
                name: "Send Template",
                description: "Use email templates",
                enabled: capabilitiesData.send_template !== false,
              },
              {
                id: "manage_contacts",
                name: "Manage Contacts",
                description: "Add/update contacts",
                enabled: capabilitiesData.manage_contacts !== false,
              },
            ]
            break
          default:
            capabilities = []
        }

        // Filter only enabled capabilities
        capabilities = capabilities.filter((cap) => cap.enabled)
      } catch (error) {
        console.error(`Failed to parse capabilities for integration ${integration.id}:`, error)
        capabilities = []
      }

      return {
        ...integration,
        capabilities: capabilities.map(({ enabled, ...cap }) => cap), // Remove enabled flag from response
      }
    })

    return NextResponse.json({ integrations: integrationsWithCapabilities })
  } catch (error) {
    console.error("Failed to fetch integrations:", error)
    return NextResponse.json({ error: "Failed to fetch integrations" }, { status: 500 })
  }
}
