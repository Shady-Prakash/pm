import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { revalidateTag } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { TAGS } from '@/lib/admin-queries'

const skillSchema = z.object({
  category: z.string().min(1),
  items: z.array(z.string()),
})

const schema = z.object({
  bio: z.array(z.string()).min(1),
  skills: z.array(skillSchema),
  status: z.enum(['draft', 'published', 'scheduled']),
  scheduledAt: z.string().datetime().optional().nullable(),
})

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const about = await prisma.about.findFirst({ orderBy: { updatedAt: 'desc' } })
  revalidateTag(TAGS.about); revalidateTag(TAGS.stats)
  return NextResponse.json(about)
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { scheduledAt, ...rest } = parsed.data
  const existing = await prisma.about.findFirst({ orderBy: { updatedAt: 'desc' } })

  const data = { ...rest, scheduledAt: scheduledAt ? new Date(scheduledAt) : null }

  const about = existing
    ? await prisma.about.update({ where: { id: existing.id }, data })
    : await prisma.about.create({ data })

  revalidateTag(TAGS.about); revalidateTag(TAGS.stats)
  return NextResponse.json(about)
}
