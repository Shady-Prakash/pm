import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

globalForPrisma.prisma ??= new PrismaClient({ log: ['error'] })

export const prisma = globalForPrisma.prisma
