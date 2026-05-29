import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

const schema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  tech: z.array(z.string()).min(1),
  liveUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  status: z.enum(['draft', 'published', 'scheduled']),
  scheduledAt: z.string().datetime().optional().nullable(),
  order: z.number().int().optional(),
})

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const projects = await prisma.project.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] })
    return NextResponse.json(projects)
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

    const { scheduledAt, liveUrl, githubUrl, ...rest } = parsed.data
    const project = await prisma.project.create({
      data: {
        ...rest,
        liveUrl: liveUrl || null,
        githubUrl: githubUrl || null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      },
    })
    return NextResponse.json(project, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Database unavailable. Add your MongoDB connection string to .env.local' }, { status: 503 })
  }
}
