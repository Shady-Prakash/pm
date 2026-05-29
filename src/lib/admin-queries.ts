import { unstable_cache } from 'next/cache'
import { prisma } from './prisma'

export const PAGE_SIZE = 5

export const TAGS = {
  stats:       'admin-stats',
  projects:    'admin-projects',
  experiences: 'admin-experiences',
  blog:        'admin-blog',
  about:       'admin-about',
} as const

// ─── order-by helpers ────────────────────────────────────────────────────────

function projectsOrder(sort: string) {
  switch (sort) {
    case 'oldest':     return { createdAt: 'asc'  as const }
    case 'title_asc':  return { title:     'asc'  as const }
    case 'title_desc': return { title:     'desc' as const }
    case 'status':     return { status:    'asc'  as const }
    default:           return { createdAt: 'desc' as const }
  }
}

function experiencesOrder(sort: string) {
  switch (sort) {
    case 'oldest':      return { createdAt: 'asc'  as const }
    case 'company_asc': return { company:   'asc'  as const }
    case 'role_asc':    return { role:      'asc'  as const }
    case 'status':      return { status:    'asc'  as const }
    default:            return { createdAt: 'desc' as const }
  }
}

function blogOrder(sort: string) {
  switch (sort) {
    case 'oldest':     return { createdAt:   'asc'  as const }
    case 'title_asc':  return { title:       'asc'  as const }
    case 'title_desc': return { title:       'desc' as const }
    case 'status':     return { status:      'asc'  as const }
    default:           return { publishedAt: 'desc' as const }
  }
}

// ─── cached queries ───────────────────────────────────────────────────────────

export const getAdminProjects = unstable_cache(
  async (q = '', sort = 'newest', page = 1) => {
    const where = q ? { title: { contains: q, mode: 'insensitive' as const } } : {}
    const [rows, total] = await Promise.all([
      prisma.project.findMany({ where, orderBy: projectsOrder(sort), skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
      prisma.project.count({ where }),
    ])
    return { rows, total }
  },
  ['admin-projects'],
  { tags: [TAGS.projects, TAGS.stats], revalidate: 60 },
)

export const getAdminExperiences = unstable_cache(
  async (q = '', sort = 'newest', page = 1) => {
    const where = q
      ? { OR: [{ company: { contains: q, mode: 'insensitive' as const } }, { role: { contains: q, mode: 'insensitive' as const } }] }
      : {}
    const [rows, total] = await Promise.all([
      prisma.experience.findMany({ where, orderBy: experiencesOrder(sort), skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
      prisma.experience.count({ where }),
    ])
    return { rows, total }
  },
  ['admin-experiences'],
  { tags: [TAGS.experiences, TAGS.stats], revalidate: 60 },
)

export const getAdminBlog = unstable_cache(
  async (q = '', sort = 'newest', page = 1) => {
    const where = q
      ? { OR: [{ title: { contains: q, mode: 'insensitive' as const } }, { tags: { has: q.toLowerCase() } }] }
      : {}
    const [rows, total] = await Promise.all([
      prisma.blogPost.findMany({ where, orderBy: blogOrder(sort), skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
      prisma.blogPost.count({ where }),
    ])
    return { rows, total }
  },
  ['admin-blog'],
  { tags: [TAGS.blog, TAGS.stats], revalidate: 60 },
)

export const getAdminAbout = unstable_cache(
  async () => prisma.about.findFirst({ orderBy: { updatedAt: 'desc' } }),
  ['admin-about'],
  { tags: [TAGS.about], revalidate: 60 },
)

export const getAdminStats = unstable_cache(
  async () => {
    const [projects, experiences, blog, about] = await Promise.all([
      prisma.project.groupBy({ by: ['status'], _count: true }),
      prisma.experience.groupBy({ by: ['status'], _count: true }),
      prisma.blogPost.groupBy({ by: ['status'], _count: true }),
      prisma.about.findFirst({ orderBy: { updatedAt: 'desc' } }),
    ])
    return { projects, experiences, blog, about }
  },
  ['admin-stats'],
  { tags: [TAGS.stats, TAGS.projects, TAGS.experiences, TAGS.blog, TAGS.about], revalidate: 60 },
)
