import { prisma } from './prisma'

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

// ─── direct queries (no cache — admin always needs fresh data) ────────────────

export async function getAdminProjects(q = '', sort = 'newest') {
  const where = q ? { title: { contains: q, mode: 'insensitive' as const } } : {}
  const rows = await prisma.project.findMany({ where, orderBy: projectsOrder(sort) })
  return { rows, total: rows.length }
}

export async function getAdminExperiences(q = '', sort = 'newest') {
  const where = q
    ? { OR: [{ company: { contains: q, mode: 'insensitive' as const } }, { role: { contains: q, mode: 'insensitive' as const } }] }
    : {}
  const rows = await prisma.experience.findMany({ where, orderBy: experiencesOrder(sort) })
  return { rows, total: rows.length }
}

export async function getAdminBlog(q = '', sort = 'newest') {
  const where = q
    ? { OR: [{ title: { contains: q, mode: 'insensitive' as const } }, { tags: { has: q.toLowerCase() } }] }
    : {}
  const rows = await prisma.blogPost.findMany({ where, orderBy: blogOrder(sort) })
  return { rows, total: rows.length }
}

export async function getAdminAbout() {
  return prisma.about.findFirst({ orderBy: { updatedAt: 'desc' } })
}

export async function getAdminStats() {
  const [projects, experiences, blog, about] = await Promise.all([
    prisma.project.groupBy({ by: ['status'], _count: true }),
    prisma.experience.groupBy({ by: ['status'], _count: true }),
    prisma.blogPost.groupBy({ by: ['status'], _count: true }),
    prisma.about.findFirst({ orderBy: { updatedAt: 'desc' } }),
  ])
  return { projects, experiences, blog, about }
}
