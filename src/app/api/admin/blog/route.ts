import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { revalidateTag } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { TAGS } from '@/lib/admin-queries'

const schema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  tags: z.array(z.string()),
  coverImage: z.string().url().optional().or(z.literal('')).nullable(),
  status: z.enum(['draft', 'published', 'scheduled']),
  scheduledAt: z.string().datetime().optional().nullable(),
})

function bustBlogCache() {
  revalidateTag(TAGS.blog, { expire: 0 })
}

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const posts = await prisma.blogPost.findMany({ orderBy: [{ createdAt: 'desc' }] })
    return NextResponse.json(posts)
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

    const { scheduledAt, coverImage, ...rest } = parsed.data
    const post = await prisma.blogPost.create({
      data: {
        ...rest,
        coverImage: coverImage || null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        publishedAt: rest.status === 'published' ? new Date() : null,
      },
    })
    bustBlogCache()
    return NextResponse.json(post, { status: 201 })
  } catch (e: unknown) {
    const msg = e instanceof Error && e.message.includes('slug') ? 'A post with this slug already exists.' : 'Database unavailable.'
    return NextResponse.json({ error: msg }, { status: 503 })
  }
}
