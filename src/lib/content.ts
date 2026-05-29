import { prisma } from './prisma'
import {
  projects as staticProjects,
  experiences as staticExperiences,
  skills as staticSkills,
} from '@/data/portfolio'
import type { Skill } from '@/types'

function isVisible(item: { status: string; scheduledAt: Date | null }) {
  if (item.status === 'published') return true
  if (item.status === 'scheduled' && item.scheduledAt && new Date() >= item.scheduledAt) return true
  return false
}

export async function getProjects() {
  try {
    const rows = await prisma.project.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] })
    const visible = rows.filter(isVisible)
    if (visible.length > 0) return visible
  } catch {}
  return staticProjects
}

export async function getExperiences() {
  try {
    const rows = await prisma.experience.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] })
    const visible = rows.filter(isVisible)
    if (visible.length > 0) return visible
  } catch {}
  return staticExperiences
}

export async function getBlogPosts() {
  try {
    const rows = await prisma.blogPost.findMany({
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    })
    return rows.filter(isVisible)
  } catch {}
  return []
}

export async function getBlogPost(slug: string) {
  try {
    const row = await prisma.blogPost.findUnique({ where: { slug } })
    if (row && isVisible(row)) return row
  } catch {}
  return null
}

export async function getAbout() {
  try {
    const row = await prisma.about.findFirst({
      where: {
        OR: [
          { status: 'published' },
          { status: 'scheduled', scheduledAt: { lte: new Date() } },
        ],
      },
      orderBy: { updatedAt: 'desc' },
    })
    if (row) {
      return { bio: row.bio, skills: row.skills as unknown as Skill[] }
    }
  } catch {}
  return { bio: [] as string[], skills: staticSkills }
}
