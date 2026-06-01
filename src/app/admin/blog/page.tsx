import Link from 'next/link'
import { Suspense } from 'react'
import StatusBadge from '../_components/StatusBadge'
import BlogActions from './_components/BlogActions'
import SearchSortBar from '../_components/SearchSortBar'
import TableSkeleton from '../_components/TableSkeleton'
import { getAdminBlog } from '@/lib/admin-queries'

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest first' },
  { value: 'oldest',     label: 'Oldest first' },
  { value: 'title_asc',  label: 'Title A → Z'  },
  { value: 'title_desc', label: 'Title Z → A'  },
  { value: 'status',     label: 'By status'    },
]

type SearchParams = Promise<{ q?: string; sort?: string }>

async function BlogTable({ searchParams }: { searchParams: SearchParams }) {
  const { q = '', sort = 'newest' } = await searchParams

  let rows: Awaited<ReturnType<typeof getAdminBlog>>['rows'] = []
  try {
    ;({ rows } = await getAdminBlog(q, sort))
  } catch {}

  return (
    <>
      <div className="mb-5">
        <Suspense><SearchSortBar sortOptions={SORT_OPTIONS} placeholder="Search title or tag…" /></Suspense>
      </div>
      {rows.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <p className="text-zinc-500 mb-4">{q ? `No results for "${q}"` : 'No posts yet.'}</p>
          {!q && <Link href="/admin/blog/new" className="text-green-400 text-sm font-mono hover:underline">Write your first article →</Link>}
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-6 py-3 text-zinc-500 text-xs font-mono">Title</th>
                <th className="text-left px-6 py-3 text-zinc-500 text-xs font-mono">Tags</th>
                <th className="text-left px-6 py-3 text-zinc-500 text-xs font-mono">Status</th>
                <th className="text-left px-6 py-3 text-zinc-500 text-xs font-mono">Date</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {rows.map((post) => (
                <tr key={post.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4 max-w-xs">
                    <p className="text-zinc-100 text-sm font-medium truncate">{post.title}</p>
                    <p className="text-zinc-600 text-xs font-mono mt-0.5">/blog/{post.slug}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((t) => <span key={t} className="text-green-400 text-xs font-mono whitespace-nowrap">{t}</span>)}
                      {post.tags.length > 3 && <span className="text-zinc-600 text-xs">+{post.tags.length - 3}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={post.status} /></td>
                  <td className="px-6 py-4 text-zinc-500 text-xs font-mono whitespace-nowrap">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : new Date(post.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4"><BlogActions id={post.id} status={post.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default function AdminBlogPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-zinc-100">Blog / Articles</h1>
        <Link href="/admin/blog/new" className="px-3 md:px-4 py-2 bg-green-400 text-zinc-950 font-semibold text-sm rounded-lg hover:bg-green-300 transition-colors font-mono">
          + New
        </Link>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <BlogTable searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
