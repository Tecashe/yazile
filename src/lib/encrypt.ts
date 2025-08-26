import crypto from "crypto"

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY! // 32 bytes key
const ALGORITHM = "aes-256-cbc"

export function encrypt(text: string): { encrypted: string; iv: string } {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY)
  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")

  return {
    encrypted,
    iv: iv.toString("hex"),
  }
}

export function decrypt(encryptedData: string, ivHex: string): string {
  const iv = Buffer.from(ivHex, "hex")
  const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY)
  let decrypted = decipher.update(encryptedData, "hex", "utf8")
  decrypted += decipher.final("utf8")

  return decrypted
}

export function hashCredentials(credentials: string): string {
  return crypto.createHash("sha256").update(credentials).digest("hex")
}

export function encryptCredentials(credentials: Record<string, any>): { encrypted: string; hash: string } {
  const credentialsString = JSON.stringify(credentials)
  const { encrypted, iv } = encrypt(credentialsString)
  const hash = hashCredentials(credentialsString)

  return {
    encrypted: `${encrypted}:${iv}`,
    hash,
  }
}

export function decryptCredentials(encryptedData: string): Record<string, any> {
  const [encrypted, iv] = encryptedData.split(":")
  const decrypted = decrypt(encrypted, iv)
  return JSON.parse(decrypted)
}
