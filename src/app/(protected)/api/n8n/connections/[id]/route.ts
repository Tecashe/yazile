// import { type NextRequest, NextResponse } from "next/server"
// import { onUserInfor } from "@/actions/user"
// import { n8nService } from "@/services/n8n-service"

// export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const user = await onUserInfor()
//     const  userId = user.data?.id
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const connectionId = params.id
//     const workflows = await n8nService.getWorkflowConfigs(connectionId)

//     return NextResponse.json({ workflows })
//   } catch (error) {
//     console.error("Error fetching n8n workflows:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const user = await onUserInfor()
//     const  userId = user.data?.id
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const connectionId = params.id
//     await n8nService.deleteConnection(connectionId)

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("Error deleting n8n connection:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// app/api/n8n/connections/[id]/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { onUserInfor } from "@/actions/user"
import { n8nService } from "@/services/n8n-service"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await onUserInfor()
    const userId = user.data?.id
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const connectionId = params.id
    
    // Get connection details
    const connection = await n8nService.getConnection(connectionId)
    if (!connection) {
      return NextResponse.json({ error: "Connection not found" }, { status: 404 })
    }

    // Get workflows for this connection
    const workflows = await n8nService.getWorkflowConfigs(connectionId)
    
    // Get connection statistics
    const stats = await n8nService.getConnectionStats(connectionId)

    return NextResponse.json({ 
      connection,
      workflows,
      stats
    })
  } catch (error) {
    console.error("Error fetching n8n connection details:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await onUserInfor()
    const userId = user.data?.id
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const connectionId = params.id
    const updateData = await req.json()

    const updatedConnection = await n8nService.updateConnection(connectionId, updateData)
    
    return NextResponse.json({ 
      connection: updatedConnection 
    })
  } catch (error) {
    console.error("Error updating n8n connection:", error)
    return NextResponse.json({ 
      error: "Failed to update connection",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await onUserInfor()
    const userId = user.data?.id
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const connectionId = params.id
    await n8nService.deleteConnection(connectionId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting n8n connection:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await onUserInfor()
    const userId = user.data?.id
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const connectionId = params.id
    const connection = await n8nService.getConnection(connectionId)
    if (!connection) {
      return NextResponse.json({ error: "Connection not found" }, { status: 404 })
    }

    const testResult = await n8nService.testConnection(connection)
    
    return NextResponse.json(testResult)
  } catch (error) {
    console.error("Error testing n8n connection:", error)
    return NextResponse.json({ 
      success: false,
      error: "Connection test failed",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}