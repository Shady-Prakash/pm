import { prisma } from '@/lib/prisma'
import Link from 'next/link'

async function getStats() {
  try {
    const [projects, experiences, blog, about] = await Promise.all([
      prisma.project.groupBy({ by: ['status'], _count: true }),
      prisma.experience.groupBy({ by: ['status'], _count: true }),
      prisma.blogPost.groupBy({ by: ['status'], _count: true }),
      prisma.about.findFirst({ orderBy: { updatedAt: 'desc' } }),
    ])
    return { projects, experiences, blog, about }
  } catch {
    return { projects: [], experiences: [], blog: [], about: null }
  }
}

function count(groups: { status: string; _count: number }[], status: string) {
  return groups.find((g) => g.status === status)?._count ?? 0
}

export default async function AdminDashboard() {
  const { projects, experiences, blog, about } = await getStats()

  const cards = [
    {
      title: 'Projects',
      href: '/admin/projects',
      published: count(projects, 'published'),
      draft: count(projects, 'draft'),
      scheduled: count(projects, 'scheduled'),
    },
    {
      title: 'Experience',
      href: '/admin/experience',
      published: count(experiences, 'published'),
      draft: count(experiences, 'draft'),
      scheduled: count(experiences, 'scheduled'),
    },
    {
      title: 'Blog',
      href: '/admin/blog',
      published: count(blog, 'published'),
      draft: count(blog, 'draft'),
      scheduled: count(blog, 'scheduled'),
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100">Dashboard</h1>
        <p className="text-zinc-500 text-sm mt-1">Overview of your portfolio content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors group"
          >
            <h2 className="text-zinc-100 font-semibold mb-4 group-hover:text-green-400 transition-colors">
              {card.title}
            </h2>
            <div className="flex gap-6">
              <div>
                <p className="text-2xl font-bold text-green-400">{card.published}</p>
                <p className="text-zinc-500 text-xs font-mono">published</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-400">{card.draft}</p>
                <p className="text-zinc-500 text-xs font-mono">draft</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-400">{card.scheduled}</p>
                <p className="text-zinc-500 text-xs font-mono">scheduled</p>
              </div>
            </div>
          </Link>
        ))}

        <Link
          href="/admin/about"
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors group"
        >
          <h2 className="text-zinc-100 font-semibold mb-2 group-hover:text-green-400 transition-colors">
            About Section
          </h2>
          {about ? (
            <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${
              about.status === 'published'
                ? 'bg-green-400/10 text-green-400 border-green-400/30'
                : about.status === 'scheduled'
                ? 'bg-blue-400/10 text-blue-400 border-blue-400/30'
                : 'bg-zinc-800 text-zinc-400 border-zinc-700'
            }`}>
              {about.status}
            </span>
          ) : (
            <p className="text-zinc-600 text-sm">No content yet</p>
          )}
        </Link>
      </div>

      <div className="flex gap-4">
        <Link href="/admin/projects/new" className="px-4 py-2 bg-green-400 text-zinc-950 font-semibold text-sm rounded-lg hover:bg-green-300 transition-colors font-mono">
          + New Project
        </Link>
        <Link href="/admin/experience/new" className="px-4 py-2 border border-green-400 text-green-400 font-semibold text-sm rounded-lg hover:bg-green-400/10 transition-colors font-mono">
          + New Experience
        </Link>
      </div>
    </div>
  )
}
