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

const VISIBILITY = {
  OR: [
    { status: 'published' },
    { status: 'scheduled', scheduledAt: { lte: new Date() } },
  ],
} as const

export const getProjects = unstable_cache(
  async () => {
    try {
      const rows = await prisma.project.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] })
      const visible = rows.filter(isVisible)
      if (visible.length > 0) return visible
    } catch {}
    return staticProjects
  },
  ['public-projects'],
  { tags: ['projects-public', 'admin-projects'], revalidate: 300 },
)

export const getExperiences = unstable_cache(
  async () => {
    try {
      const rows = await prisma.experience.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] })
      const visible = rows.filter(isVisible)
      if (visible.length > 0) return visible
    } catch {}
    return staticExperiences
  },
  ['public-experiences'],
  { tags: ['experiences-public', 'admin-experiences'], revalidate: 300 },
)

export const getBlogPosts = unstable_cache(
  async () => {
    try {
      const rows = await prisma.blogPost.findMany({
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      })
      return rows.filter(isVisible)
    } catch {}
    return []
  },
  ['public-blog-posts'],
  { tags: [BLOG_PUBLIC_TAG, 'admin-blog'], revalidate: 300 },
)

export const getBlogPost = unstable_cache(
  async (slug: string) => {
    try {
      const row = await prisma.blogPost.findUnique({ where: { slug } })
      if (row && isVisible(row)) return row
    } catch {}
    return null
  },
  ['public-blog-post'],
  { tags: [BLOG_PUBLIC_TAG, 'admin-blog'], revalidate: 300 },
)

// Used by blog listing page: tags + filtered posts + count all in one call
export const getBlogListing = unstable_cache(
  async (q: string, tag: string, page: number, pageSize: number) => {
    try {
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

      // All 3 queries in parallel — single round-trip
      const [tagRows, posts, total] = await Promise.all([
        prisma.blogPost.findMany({ where: visibilityFilter, select: { tags: true } }),
        prisma.blogPost.findMany({ where, orderBy: { publishedAt: 'desc' }, skip: (page - 1) * pageSize, take: pageSize }),
        prisma.blogPost.count({ where }),
      ])

      const allTags = [...new Set(tagRows.flatMap((r) => r.tags))].sort()
      return { posts, total, allTags }
    } catch {}
    return { posts: [], total: 0, allTags: [] }
  },
  ['public-blog-listing'],
  { tags: [BLOG_PUBLIC_TAG, 'admin-blog'], revalidate: 60 },
)

export const getAbout = unstable_cache(
  async () => {
    try {
      const row = await prisma.about.findFirst({
        where: { OR: [
          { status: 'published' },
          { status: 'scheduled', scheduledAt: { lte: new Date() } },
        ]},
        orderBy: { updatedAt: 'desc' },
      })
      if (row) return { bio: row.bio, skills: row.skills as unknown as Skill[] }
    } catch {}
    return { bio: [] as string[], skills: staticSkills }
  },
  ['public-about'],
  { tags: ['about-public', 'admin-about'], revalidate: 300 },
)
