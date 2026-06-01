import { config } from 'dotenv'
config({ path: '.env.local' })
config({ path: '.env' })
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const result = await prisma.blogPost.updateMany({
  data: { status: 'published', publishedAt: new Date() },
})

console.log(`✓ Published ${result.count} blog posts`)
await prisma.$disconnect()
