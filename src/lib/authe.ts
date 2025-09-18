import { auth } from "@clerk/nextjs/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function getCurrentTenant() {
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    throw new Error("Unauthorized")
  }

  // Find user by clerkId
  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: { tenant: true },
  })

  if (!user) {
    throw new Error("User not found")
  }

  if (!user.tenant) {
    throw new Error("No tenant found for user")
  }

  return {
    user,
    tenant: user.tenant,
    tenantId: user.tenant.id,
  }
}
