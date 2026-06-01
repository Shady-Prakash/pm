import Link from 'next/link'
import { Suspense } from 'react'
import StatusBadge from '../_components/StatusBadge'
import ExperienceActions from './_components/ExperienceActions'
import SearchSortBar from '../_components/SearchSortBar'
import TableSkeleton from '../_components/TableSkeleton'
import { getAdminExperiences } from '@/lib/admin-queries'

const SORT_OPTIONS = [
  { value: 'newest',      label: 'Newest first'  },
  { value: 'oldest',      label: 'Oldest first'  },
  { value: 'company_asc', label: 'Company A → Z' },
  { value: 'role_asc',    label: 'Role A → Z'    },
  { value: 'status',      label: 'By status'     },
]

type SearchParams = Promise<{ q?: string; sort?: string }>

async function ExperienceTable({ searchParams }: { searchParams: SearchParams }) {
  const { q = '', sort = 'newest' } = await searchParams

  let rows: Awaited<ReturnType<typeof getAdminExperiences>>['rows'] = []
  try {
    ;({ rows } = await getAdminExperiences(q, sort))
  } catch {}

  return (
    <>
      <div className="mb-5">
        <Suspense><SearchSortBar sortOptions={SORT_OPTIONS} placeholder="Search company or role…" /></Suspense>
      </div>
      {rows.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <p className="text-zinc-500 mb-4">{q ? `No results for "${q}"` : 'No experience entries yet.'}</p>
          {!q && <Link href="/admin/experience/new" className="text-green-400 text-sm font-mono hover:underline">Add your first role →</Link>}
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-6 py-3 text-zinc-500 text-xs font-mono">Role</th>
                <th className="text-left px-6 py-3 text-zinc-500 text-xs font-mono">Company</th>
                <th className="text-left px-6 py-3 text-zinc-500 text-xs font-mono">Period</th>
                <th className="text-left px-6 py-3 text-zinc-500 text-xs font-mono">Status</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {rows.map((exp) => (
                <tr key={exp.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4 text-zinc-100 text-sm font-medium whitespace-nowrap">{exp.role}</td>
                  <td className="px-6 py-4 text-zinc-400 text-sm whitespace-nowrap">{exp.company}</td>
                  <td className="px-6 py-4 text-zinc-500 text-xs font-mono whitespace-nowrap">{exp.period}</td>
                  <td className="px-6 py-4"><StatusBadge status={exp.status} /></td>
                  <td className="px-6 py-4"><ExperienceActions id={exp.id} status={exp.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default function AdminExperiencePage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-zinc-100">Experience</h1>
        <Link href="/admin/experience/new" className="px-3 md:px-4 py-2 bg-green-400 text-zinc-950 font-semibold text-sm rounded-lg hover:bg-green-300 transition-colors font-mono">
          + New
        </Link>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <ExperienceTable searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
