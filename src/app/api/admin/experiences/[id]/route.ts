import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { revalidateTag } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { TAGS } from '@/lib/admin-queries'

const schema = z.object({
  company: z.string().min(1).optional(),
  role: z.string().min(1).optional(),
  period: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  description: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published', 'scheduled']).optional(),
  scheduledAt: z.string().datetime().optional().nullable(),
  order: z.number().int().optional(),
})

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const experience = await prisma.experience.findUnique({ where: { id } })
    if (!experience) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    revalidateTag(TAGS.experiences); revalidateTag(TAGS.stats)
    return NextResponse.json(experience)
  } catch {
    return NextResponse.json({ error: 'Database unavailable.' }, { status: 503 })
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid data.' }, { status: 400 })

    const { scheduledAt, ...rest } = parsed.data
    const experience = await prisma.experience.update({
      where: { id },
      data: {
        ...rest,
        ...(scheduledAt !== undefined && { scheduledAt: scheduledAt ? new Date(scheduledAt) : null }),
      },
    })
    revalidateTag(TAGS.experiences); revalidateTag(TAGS.stats)
    return NextResponse.json(experience)
  } catch {
    return NextResponse.json({ error: 'Database unavailable.' }, { status: 503 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    await prisma.experience.delete({ where: { id } })
    revalidateTag(TAGS.experiences); revalidateTag(TAGS.stats)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Database unavailable.' }, { status: 503 })
  }
}
