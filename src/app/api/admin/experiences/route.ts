import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { revalidateTag } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { TAGS } from '@/lib/admin-queries'

const schema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  period: z.string().min(1),
  location: z.string().min(1),
  description: z.array(z.string()).min(1),
  status: z.enum(['draft', 'published', 'scheduled']),
  scheduledAt: z.string().datetime().optional().nullable(),
  order: z.number().int().optional(),
})

function bustExperiencesCache() {
  revalidateTag(TAGS.experiences, { expire: 0 })
}

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const experiences = await prisma.experience.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] })
    return NextResponse.json(experiences)
  } catch {
    return NextResponse.json({ error: 'Database unavailable.' }, { status: 503 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid data. Check all required fields.' }, { status: 400 })

    const { scheduledAt, ...rest } = parsed.data
    const experience = await prisma.experience.create({
      data: { ...rest, scheduledAt: scheduledAt ? new Date(scheduledAt) : null },
    })
    bustExperiencesCache()
    return NextResponse.json(experience, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Database unavailable.' }, { status: 503 })
  }
}
