import { type NextRequest, NextResponse } from "next/server"
import {
  updateWorkflowTemplate,
  deleteWorkflowTemplate,
  publishWorkflowTemplate,
} from "@/actions//workflow-templates"
import { auth } from "@clerk/nextjs/server"
import { onUserInfor } from "@/actions/user"

export async function PATCH(request: NextRequest, { params }: { params: { templateId: string } }) {
  try {
    const user = await onUserInfor()
    const userId = user.data?.id

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { action, ...data } = body

    let result

    if (action === "publish") {
      result = await publishWorkflowTemplate(params.templateId)
    } else {
      result = await updateWorkflowTemplate(params.templateId, data)
    }

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      template: result.template,
      message: result.template?.description,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { templateId: string } }) {
  try {
    const user = await onUserInfor()
    const userId = user.data?.id

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await deleteWorkflowTemplate(params.templateId)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
