import crypto from "crypto"

// Ensure these are set as environment variables in your Vercel project
// For ENCRYPTION_KEY: Use a strong, randomly generated 32-byte (64-character hex) key.
// For ENCRYPTION_IV_LENGTH: A common and secure IV length for GCM is 12 bytes.
// You might also generate a unique IV for each encryption and store it with the ciphertext.
// For simplicity, we'll use a fixed IV for this example, but for maximum security,
// generate a unique IV for each encryption and prepend it to the ciphertext.

const ENCRYPTION_KEY = process.env.CREDENTIAL_ENCRYPTION_KEY // Must be 32 bytes (256 bits)
const ENCRYPTION_ALGORITHM = "aes-256-gcm"
const ENCRYPTION_IV_LENGTH = 16 // AES-256-GCM typically uses 12-byte IV, but 16 is also common and works. Let's use 16 for consistency with some examples.
const ENCRYPTION_AUTH_TAG_LENGTH = 16 // GCM authentication tag length

if (!ENCRYPTION_KEY) {
  console.error("ENCRYPTION_KEY environment variable is not set. Encryption/Decryption will fail.")
  // In a production app, you might want to throw an error or handle this more gracefully.
}

// Helper to convert hex string to Buffer
const getKeyBuffer = () => {
  if (!ENCRYPTION_KEY) {
    throw new Error("Encryption key is not defined.")
  }
  return Buffer.from(ENCRYPTION_KEY, "hex")
}

export function encrypt(text: string): string {
  if (!ENCRYPTION_KEY) {
    console.error("Encryption key is missing. Cannot encrypt.")
    return text // Return original text or throw error in production
  }

  try {
    const key = getKeyBuffer()
    const iv = crypto.randomBytes(ENCRYPTION_IV_LENGTH) // Generate a unique IV for each encryption
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv)

    let encrypted = cipher.update(text, "utf8", "hex")
    encrypted += cipher.final("hex")

    const authTag = cipher.getAuthTag() // Get the authentication tag

    // Store IV and authTag with the ciphertext for decryption
    return `${iv.toString("hex")}:${encrypted}:${authTag.toString("hex")}`
  } catch (error) {
    console.error("Encryption failed:", error)
    return text // Return original text or throw error
  }
}

export function decrypt(encryptedText: string): string {
  if (!ENCRYPTION_KEY) {
    console.error("Encryption key is missing. Cannot decrypt.")
    return encryptedText // Return original text or throw error in production
  }

  try {
    const parts = encryptedText.split(":")
    if (parts.length !== 3) {
      throw new Error("Invalid encrypted text format.")
    }

    const iv = Buffer.from(parts[0], "hex")
    const encrypted = parts[1]
    const authTag = Buffer.from(parts[2], "hex")

    const key = getKeyBuffer()
    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, key, iv)
    decipher.setAuthTag(authTag) // Set the authentication tag for verification

    let decrypted = decipher.update(encrypted, "hex", "utf8")
    decrypted += decipher.final("utf8")

    return decrypted
  } catch (error) {
    console.error("Decryption failed:", error)
    return encryptedText // Return original text or throw error
  }
}
