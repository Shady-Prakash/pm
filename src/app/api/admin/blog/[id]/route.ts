import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { revalidateTag } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { TAGS } from '@/lib/admin-queries'

const schema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  excerpt: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  coverImage: z.string().url().optional().or(z.literal('')).nullable(),
  status: z.enum(['draft', 'published', 'scheduled']).optional(),
  scheduledAt: z.string().datetime().optional().nullable(),
})

type Params = { params: Promise<{ id: string }> }

function bustBlogCache() {
  try { revalidateTag(TAGS.blog, 'max') } catch {}
  try { revalidateTag(TAGS.stats, 'max') } catch {}
}

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const post = await prisma.blogPost.findUnique({ where: { id } })
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(post)
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

    const { scheduledAt, coverImage, status, ...rest } = parsed.data
    const existing = await prisma.blogPost.findUnique({ where: { id } })

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...rest,
        ...(status !== undefined && { status }),
        ...(coverImage !== undefined && { coverImage: coverImage || null }),
        ...(scheduledAt !== undefined && { scheduledAt: scheduledAt ? new Date(scheduledAt) : null }),
        ...(status === 'published' && !existing?.publishedAt && { publishedAt: new Date() }),
      },
    })
    bustBlogCache()
    return NextResponse.json(post)
  } catch {
    return NextResponse.json({ error: 'Database unavailable.' }, { status: 503 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    await prisma.blogPost.delete({ where: { id } })
    bustBlogCache()
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Database unavailable.' }, { status: 503 })
  }
}
