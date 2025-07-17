import { client } from "@/lib/prisma"
import { decrypt } from "@/lib/encryption"
import { NextResponse } from "next/server"

interface ProxyRequest {
  workflowConfigId: string
  integrationName: string
  payload: Record<string, any> // Data sent from Voiceflow
}

export async function handleIntegrationProxy(
  req: Request,
  integrationName: string,
  action: (decryptedCredentials: Record<string, any>, payload: Record<string, any>) => Promise<any>,
) {
  try {
    const body: ProxyRequest = await req.json()
    const { workflowConfigId, payload } = body

    if (!workflowConfigId) {
      return NextResponse.json({ success: false, error: "Missing workflowConfigId" }, { status: 400 })
    }

    // Fetch the specific integration credential for this workflow config
    const credential = await client.workflowIntegrationCredential.findUnique({
      where: {
        workflowConfigId_integrationName: {
          workflowConfigId: workflowConfigId,
          integrationName: integrationName,
        },
      },
    })

    if (!credential || !credential.isActive) {
      return NextResponse.json(
        { success: false, error: `Credentials for ${integrationName} not found or inactive.` },
        { status: 404 },
      )
    }

    // Decrypt the credentials
    const decryptedCredentialsString = decrypt(credential.encryptedCredentials)
    const decryptedCredentials = JSON.parse(decryptedCredentialsString)

    // Execute the specific integration action
    const result = await action(decryptedCredentials, payload)

    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    console.error(`Error in ${integrationName} proxy:`, error)
    return NextResponse.json(
      { success: false, error: error.message || `Failed to process ${integrationName} request.` },
      { status: 500 },
    )
  }
}
