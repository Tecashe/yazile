// still in use - API route for testing workflows
import { type NextRequest, NextResponse } from "next/server"
import { WorkflowEngine } from "@/lib/workflow-engine"

export async function POST(request: NextRequest) {
  try {
    const { nodes, testData } = await request.json()

    if (!nodes || !Array.isArray(nodes)) {
      return NextResponse.json({ error: "Invalid workflow nodes" }, { status: 400 })
    }

    const engine = new WorkflowEngine()
    const result = await engine.executeWorkflow(
      nodes,
      testData || {
        message: "Test message",
        sender: {
          id: "test_user",
          username: "testuser",
          platform: "instagram",
        },
      },
    )

    return NextResponse.json({
      success: true,
      result,
      executionTime: result.executionTime,
      nodesExecuted: result.executedNodes?.length || 0,
    })
  } catch (error) {
    console.error("Failed to test workflow:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to test workflow",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
