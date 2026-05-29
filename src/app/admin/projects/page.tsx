import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Suspense } from 'react'
import StatusBadge from '../_components/StatusBadge'
import ProjectsActions from './_components/ProjectsActions'
import SearchSortBar from '../_components/SearchSortBar'
import Pagination from '../_components/Pagination'

const PAGE_SIZE = 5

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'title_asc', label: 'Title A → Z' },
  { value: 'title_desc', label: 'Title Z → A' },
  { value: 'status', label: 'By status' },
]

type SearchParams = Promise<{ q?: string; sort?: string; page?: string }>

function buildOrderBy(sort: string) {
  switch (sort) {
    case 'oldest':     return { createdAt: 'asc' as const }
    case 'title_asc':  return { title: 'asc' as const }
    case 'title_desc': return { title: 'desc' as const }
    case 'status':     return { status: 'asc' as const }
    default:           return { createdAt: 'desc' as const }
  }
}

export default async function AdminProjectsPage({ searchParams }: { searchParams: SearchParams }) {
  const { q = '', sort = 'newest', page: pageStr = '1' } = await searchParams
  const page = Math.max(1, parseInt(pageStr) || 1)

  const where = q ? { title: { contains: q, mode: 'insensitive' as const } } : {}
  const orderBy = buildOrderBy(sort)

  let projects: Awaited<ReturnType<typeof prisma.project.findMany>> = []
  let total = 0

  try {
    ;[projects, total] = await Promise.all([
      prisma.project.findMany({ where, orderBy, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
      prisma.project.count({ where }),
    ])
  } catch {}

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-zinc-100">Projects</h1>
          <p className="text-zinc-500 text-sm mt-1">{total} total</p>
        </div>
        <Link href="/admin/projects/new" className="px-3 md:px-4 py-2 bg-green-400 text-zinc-950 font-semibold text-sm rounded-lg hover:bg-green-300 transition-colors font-mono">
          + New
        </Link>
      </div>

      <div className="mb-5">
        <Suspense>
          <SearchSortBar sortOptions={SORT_OPTIONS} placeholder="Search projects…" />
        </Suspense>
      </div>

      {projects.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <p className="text-zinc-500 mb-4">{q ? `No results for "${q}"` : 'No projects yet.'}</p>
          {!q && <Link href="/admin/projects/new" className="text-green-400 text-sm font-mono hover:underline">Create your first project →</Link>}
        </div>
      ) : (
        <>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-6 py-3 text-zinc-500 text-xs font-mono">Title</th>
                  <th className="text-left px-6 py-3 text-zinc-500 text-xs font-mono">Tech</th>
                  <th className="text-left px-6 py-3 text-zinc-500 text-xs font-mono">Status</th>
                  <th className="text-left px-6 py-3 text-zinc-500 text-xs font-mono">Updated</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 text-zinc-100 text-sm font-medium max-w-48 truncate">{p.title}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {p.tech.slice(0, 3).map((t) => <span key={t} className="text-green-400 text-xs font-mono">{t}</span>)}
                        {p.tech.length > 3 && <span className="text-zinc-600 text-xs">+{p.tech.length - 3}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={p.status} />
                      {p.status === 'scheduled' && p.scheduledAt && (
                        <p className="text-zinc-600 text-xs mt-1 font-mono">{new Date(p.scheduledAt).toLocaleDateString()}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-zinc-500 text-xs font-mono whitespace-nowrap">{new Date(p.updatedAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4"><ProjectsActions id={p.id} status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Suspense>
            <Pagination page={page} totalPages={totalPages} total={total} pageSize={PAGE_SIZE} />
          </Suspense>
        </>
      )}
    </div>
  )
}
