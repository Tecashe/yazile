import crypto from "crypto"
import { client } from "@/lib/prisma"

// Encryption configuration
const ENCRYPTION_ALGORITHM = "aes-256-gcm"
const ENCRYPTION_KEY = process.env.CREDENTIAL_ENCRYPTION_KEY
const IV_LENGTH = 16
const AUTH_TAG_LENGTH = 16

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
  console.warn(
    "CREDENTIAL_ENCRYPTION_KEY is not set or not 32 bytes. Secure credential storage will not work properly.",
  )
}

/**
 * Encrypt a credential value
 */
export function encryptCredential(value: string): string {
  if (!ENCRYPTION_KEY) {
    throw new Error("Encryption key is not set")
  }

  try {
    // Generate a random initialization vector
    const iv = crypto.randomBytes(IV_LENGTH)

    // Create cipher
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv, {
      authTagLength: AUTH_TAG_LENGTH,
    })

    // Encrypt the value
    let encrypted = cipher.update(value, "utf8", "hex")
    encrypted += cipher.final("hex")

    // Get the authentication tag
    const authTag = cipher.getAuthTag()

    // Combine IV, encrypted value, and auth tag for storage
    return Buffer.concat([iv, Buffer.from(encrypted, "hex"), authTag]).toString("base64")
  } catch (error) {
    console.error("Error encrypting credential:", error)
    throw new Error("Failed to encrypt credential")
  }
}

/**
 * Decrypt a credential value
 */
export function decryptCredential(encryptedValue: string): string {
  if (!ENCRYPTION_KEY) {
    throw new Error("Encryption key is not set")
  }

  try {
    // Convert from base64 to buffer
    const buffer = Buffer.from(encryptedValue, "base64")

    // Extract IV, encrypted data, and auth tag
    const iv = buffer.subarray(0, IV_LENGTH)
    const authTag = buffer.subarray(buffer.length - AUTH_TAG_LENGTH)
    const encryptedData = buffer.subarray(IV_LENGTH, buffer.length - AUTH_TAG_LENGTH)

    // Create decipher
    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv, {
      authTagLength: AUTH_TAG_LENGTH,
    })

    // Set auth tag
    decipher.setAuthTag(authTag)

    // Decrypt the value
    let decrypted = decipher.update(encryptedData)
    decrypted = Buffer.concat([decrypted, decipher.final()])

    return decrypted.toString("utf8")
  } catch (error) {
    console.error("Error decrypting credential:", error)
    throw new Error("Failed to decrypt credential")
  }
}

/**
 * Store a credential for a workflow
 */
export async function storeWorkflowCredential(
  workflowId: string,
  name: string,
  type: string,
  value: string,
  expiresAt?: Date,
): Promise<string> {
  try {
    // Encrypt the credential value
    const encryptedValue = encryptCredential(value)

    // Store in the database
    const credential = await client.workflowCredential.create({
      data: {
        workflowId,
        name,
        type,
        value: encryptedValue,
        expiresAt,
      },
    })

    return credential.id
  } catch (error) {
    console.error("Error storing workflow credential:", error)
    throw error
  }
}

/**
 * Retrieve a credential for a workflow
 */
export async function getWorkflowCredential(
  workflowId: string,
  credentialId: string,
): Promise<{ id: string; name: string; type: string; value: string; expiresAt: Date | null }> {
  try {
    // Get the credential from the database
    const credential = await client.workflowCredential.findFirst({
      where: {
        id: credentialId,
        workflowId,
      },
    })

    if (!credential) {
      throw new Error(`Credential not found: ${credentialId}`)
    }

    // Check if the credential has expired
    if (credential.expiresAt && credential.expiresAt < new Date()) {
      throw new Error(`Credential has expired: ${credentialId}`)
    }

    // Decrypt the credential value
    const decryptedValue = decryptCredential(credential.value)

    return {
      id: credential.id,
      name: credential.name,
      type: credential.type,
      value: decryptedValue,
      expiresAt: credential.expiresAt,
    }
  } catch (error) {
    console.error("Error retrieving workflow credential:", error)
    throw error
  }
}

/**
 * Update a credential for a workflow
 */
export async function updateWorkflowCredential(
  workflowId: string,
  credentialId: string,
  updates: {
    name?: string
    type?: string
    value?: string
    expiresAt?: Date | null
  },
): Promise<void> {
  try {
    // Get the current credential
    const credential = await client.workflowCredential.findFirst({
      where: {
        id: credentialId,
        workflowId,
      },
    })

    if (!credential) {
      throw new Error(`Credential not found: ${credentialId}`)
    }

    // Prepare update data
    const updateData: any = {}

    if (updates.name !== undefined) {
      updateData.name = updates.name
    }

    if (updates.type !== undefined) {
      updateData.type = updates.type
    }

    if (updates.value !== undefined) {
      updateData.value = encryptCredential(updates.value)
    }

    if (updates.expiresAt !== undefined) {
      updateData.expiresAt = updates.expiresAt
    }

    // Update the credential
    await client.workflowCredential.update({
      where: { id: credentialId },
      data: updateData,
    })
  } catch (error) {
    console.error("Error updating workflow credential:", error)
    throw error
  }
}

/**
 * Delete a credential for a workflow
 */
export async function deleteWorkflowCredential(workflowId: string, credentialId: string): Promise<void> {
  try {
    // Delete the credential
    await client.workflowCredential.deleteMany({
      where: {
        id: credentialId,
        workflowId,
      },
    })
  } catch (error) {
    console.error("Error deleting workflow credential:", error)
    throw error
  }
}

/**
 * Get all credentials for a workflow
 */
export async function getWorkflowCredentials(
  workflowId: string,
): Promise<{ id: string; name: string; type: string; expiresAt: Date | null }[]> {
  try {
    // Get all credentials for the workflow
    const credentials = await client.workflowCredential.findMany({
      where: { workflowId },
      select: {
        id: true,
        name: true,
        type: true,
        expiresAt: true,
      },
    })

    return credentials
  } catch (error) {
    console.error("Error getting workflow credentials:", error)
    throw error
  }
}
