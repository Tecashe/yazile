import { NextResponse } from "next/server"
import { client } from "@/lib/prisma"
import { encrypt } from "@/lib/encryption" // Assuming you have an encryption utility
import { onUserInfor } from "@/actions/user"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const  user  = await onUserInfor()
    const  userId = user.data?.id

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { id: workflowConfigId } = params
    const credentialsData: Record<string, string> = await request.json() // Expects { "IntegrationName": "credentialValue", ... }

    const workflowConfig = await client.businessWorkflowConfig.findUnique({
      where: { id: workflowConfigId },
      include: { workflowTemplate: true },
    })

    if (!workflowConfig || workflowConfig.businessId !== userId) {
      return new NextResponse("Forbidden: Workflow configuration not found or unauthorized", { status: 403 })
    }

    if (!workflowConfig.workflowTemplate) {
      return new NextResponse("Cannot add credentials to a workflow config without a linked template.", { status: 400 })
    }

    const templateIntegrations = workflowConfig.workflowTemplate.integrations as any[] // Cast to any for now, will be Integration[]

    const createdCredentials = []

    for (const integration of templateIntegrations) {
      const integrationName = integration.name
      const integrationType = integration.category // Using category as type for now

      // Collect all credential field values for this integration
      const credentialValues: Record<string, string> = {}
      let allFieldsProvided = true

      for (const field of integration.credentialFields) {
        const fieldValue = credentialsData[`${integrationName}_${field.name}`] // e.g., "Salesforce_apiKey"
        if (field.required && !fieldValue) {
          allFieldsProvided = false
          break
        }
        if (fieldValue) {
          credentialValues[field.name] = fieldValue
        }
      }

      if (!allFieldsProvided) {
        // Optionally, you can throw an error or just skip this integration if not all required fields are present
        console.warn(`Not all required credential fields provided for integration: ${integrationName}`)
        continue
      }

      // Encrypt the entire credentialValues object as a JSON string
      const encryptedApiKey = encrypt(JSON.stringify(credentialValues))


    

      const credential = await client.workflowIntegrationCredential.create({
        data: {
          workflowConfigId,
          integrationName,
          integrationType,
          encryptedCredentials: encryptedApiKey,
          isActive: true, // Assume active upon submission
        },
      })
      createdCredentials.push(credential)
    }

    return NextResponse.json({ success: true, credentials: createdCredentials }, { status: 201 })
  } catch (error) {
    console.error("Error adding credentials to workflow config:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
