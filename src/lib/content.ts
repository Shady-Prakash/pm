import { unstable_cache } from 'next/cache'
import { prisma } from './prisma'
import {
  projects as staticProjects,
  experiences as staticExperiences,
  skills as staticSkills,
} from '@/data/portfolio'
import type { Skill } from '@/types'

export const BLOG_PUBLIC_TAG = 'blog-public'

function isVisible(item: { status: string; scheduledAt: Date | null }) {
  if (item.status === 'published') return true
  if (item.status === 'scheduled' && item.scheduledAt && new Date() >= item.scheduledAt) return true
  return false
}

// ─── Projects ────────────────────────────────────────────────────────────────

const getCachedProjects = unstable_cache(
  async () => {
    const rows = await prisma.project.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] })
    return rows.filter(isVisible)
  },
  ['public-projects'],
  { tags: ['projects-public', 'admin-projects'], revalidate: 300 },
)

export async function getProjects() {
  try {
    const rows = await getCachedProjects()
    if (rows.length > 0) return rows
  } catch {}
  return staticProjects
}

// ─── Experiences ─────────────────────────────────────────────────────────────

const getCachedExperiences = unstable_cache(
  async () => {
    const rows = await prisma.experience.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] })
    return rows.filter(isVisible)
  },
  ['public-experiences'],
  { tags: ['experiences-public', 'admin-experiences'], revalidate: 300 },
)

export async function getExperiences() {
  try {
    const rows = await getCachedExperiences()
    if (rows.length > 0) return rows
  } catch {}
  return staticExperiences
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

const getCachedBlogPosts = unstable_cache(
  async () => {
    const rows = await prisma.blogPost.findMany({
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    })
    return rows.filter(isVisible)
  },
  ['public-blog-posts'],
  { tags: [BLOG_PUBLIC_TAG, 'admin-blog'], revalidate: 300 },
)

export async function getBlogPosts() {
  try { return await getCachedBlogPosts() } catch { return [] }
}

const getCachedBlogPost = unstable_cache(
  async (slug: string) => {
    const row = await prisma.blogPost.findUnique({ where: { slug } })
    if (row && isVisible(row)) return row
    return null
  },
  ['public-blog-post'],
  { tags: [BLOG_PUBLIC_TAG, 'admin-blog'], revalidate: 300 },
)

export async function getBlogPost(slug: string) {
  try { return await getCachedBlogPost(slug) } catch { return null }
}

const getCachedBlogListing = unstable_cache(
  async (q: string, tag: string, page: number, pageSize: number) => {
    const visibilityFilter = { OR: [
      { status: 'published' as const },
      { status: 'scheduled' as const, scheduledAt: { lte: new Date() } },
    ]}

    const filters: object[] = [visibilityFilter]
    if (q) filters.push({ OR: [
      { title: { contains: q, mode: 'insensitive' as const } },
      { excerpt: { contains: q, mode: 'insensitive' as const } },
    ]})
    if (tag) filters.push({ tags: { has: tag } })
    const where = filters.length > 1 ? { AND: filters } : visibilityFilter

    const [tagRows, posts, total] = await Promise.all([
      prisma.blogPost.findMany({ where: visibilityFilter, select: { tags: true } }),
      prisma.blogPost.findMany({ where, orderBy: { publishedAt: 'desc' }, skip: (page - 1) * pageSize, take: pageSize }),
      prisma.blogPost.count({ where }),
    ])

    const allTags = [...new Set(tagRows.flatMap((r) => r.tags))].sort()
    return { posts, total, allTags }
  },
  ['public-blog-listing'],
  { tags: [BLOG_PUBLIC_TAG, 'admin-blog'], revalidate: 60 },
)

export async function getBlogListing(q: string, tag: string, page: number, pageSize: number) {
  try { return await getCachedBlogListing(q, tag, page, pageSize) } catch { return { posts: [], total: 0, allTags: [] } }
}

// ─── About ───────────────────────────────────────────────────────────────────

const getCachedAbout = unstable_cache(
  async () => {
    const row = await prisma.about.findFirst({
      where: { OR: [
        { status: 'published' },
        { status: 'scheduled', scheduledAt: { lte: new Date() } },
      ]},
      orderBy: { updatedAt: 'desc' },
    })
    if (row) return { bio: row.bio, skills: row.skills as unknown as Skill[] }
    return null
  },
  ['public-about'],
  { tags: ['about-public', 'admin-about'], revalidate: 300 },
)

export async function getAbout() {
  try {
    const result = await getCachedAbout()
    if (result) return result
  } catch {}
  return { bio: [] as string[], skills: staticSkills }
}
