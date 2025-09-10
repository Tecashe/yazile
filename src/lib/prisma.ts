// import { PrismaClient } from '@prisma/client'

// declare global {
//   var prisma: PrismaClient | undefined
// }

// export const client = globalThis.prisma || new PrismaClient()

// if (process.env.NODE_ENV !== 'production') globalThis.prisma = client

import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

export const client = prisma

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
