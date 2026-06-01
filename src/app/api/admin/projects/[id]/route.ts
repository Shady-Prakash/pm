import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { revalidateTag } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { TAGS } from '@/lib/admin-queries'

const schema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  tech: z.array(z.string()).optional(),
  liveUrl: z.string().url().optional().or(z.literal('')).nullable(),
  githubUrl: z.string().url().optional().or(z.literal('')).nullable(),
  status: z.enum(['draft', 'published', 'scheduled']).optional(),
  scheduledAt: z.string().datetime().optional().nullable(),
  order: z.number().int().optional(),
})

type Params = { params: Promise<{ id: string }> }

function bustProjectsCache() {
  try { revalidateTag(TAGS.projects, 'max') } catch {}
  try { revalidateTag(TAGS.stats, 'max') } catch {}
}

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const project = await prisma.project.findUnique({ where: { id } })
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(project)
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

    const { scheduledAt, liveUrl, githubUrl, ...rest } = parsed.data
    const project = await prisma.project.update({
      where: { id },
      data: {
        ...rest,
        ...(liveUrl !== undefined && { liveUrl: liveUrl || null }),
        ...(githubUrl !== undefined && { githubUrl: githubUrl || null }),
        ...(scheduledAt !== undefined && { scheduledAt: scheduledAt ? new Date(scheduledAt) : null }),
      },
    })
    bustProjectsCache()
    return NextResponse.json(project)
  } catch {
    return NextResponse.json({ error: 'Database unavailable.' }, { status: 503 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    await prisma.project.delete({ where: { id } })
    bustProjectsCache()
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Database unavailable.' }, { status: 503 })
  }
}
