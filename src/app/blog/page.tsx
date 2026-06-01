import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BlogPagination from '@/components/BlogPagination'
import BlogFilters from '@/components/BlogFilters'
import { getBlogListing } from '@/lib/content'

const PAGE_SIZE = 6

type SearchParams = Promise<{ page?: string; q?: string; tag?: string }>

function PostsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-10 w-full bg-zinc-900 rounded-lg mb-4" />
      <div className="flex flex-wrap gap-2 mb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-6 w-20 bg-zinc-900 rounded-full" />
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="h-48 bg-zinc-800" />
            <div className="p-6 space-y-3">
              <div className="h-3 w-24 bg-zinc-800 rounded" />
              <div className="h-5 w-full bg-zinc-800 rounded" />
              <div className="h-4 w-4/5 bg-zinc-800 rounded" />
              <div className="h-3 w-1/3 bg-zinc-800 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

async function BlogContent({ searchParams }: { searchParams: SearchParams }) {
  const { page: pageStr = '1', q = '', tag = '' } = await searchParams
  const page = Math.max(1, parseInt(pageStr) || 1)

  const { posts, total, allTags } = await getBlogListing(q, tag, page, PAGE_SIZE)
  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <>
      <Suspense>
        <BlogFilters allTags={allTags} q={q} activeTag={tag} />
      </Suspense>

      {posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-zinc-600 font-mono">
            {q || tag ? 'No articles match your filters.' : 'No posts yet — check back soon.'}
          </p>
          {(q || tag) && (
            <a href="/blog" className="mt-4 inline-block text-green-400 font-mono text-sm hover:underline">
              Clear filters
            </a>
          )}
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-8">
            {posts.map((post, i) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <article className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 hover:-translate-y-1 transition-all duration-200 h-full flex flex-col">
                  {post.coverImage && (
                    <div className="relative w-full h-48 overflow-hidden">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized={post.coverImage.endsWith('.gif')}
                        priority={i === 0}
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.slice(0, 3).map((t) => (
                        <span key={t} className="text-green-400 font-mono text-xs">{t}</span>
                      ))}
                    </div>
                    <h2 className="text-zinc-100 font-bold text-lg leading-snug mb-3 group-hover:text-green-400 transition-colors flex-1">
                      {post.title}
                    </h2>
                    <p className="text-zinc-500 text-sm leading-relaxed mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <time className="text-zinc-600 text-xs font-mono">
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString('en-AU', { year: 'numeric', month: 'short', day: 'numeric' })
                          : new Date(post.createdAt).toLocaleDateString('en-AU', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </time>
                      <span className="text-green-400 text-xs font-mono group-hover:text-green-300 transition-colors">
                        Read more →
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          <Suspense>
            <BlogPagination page={page} totalPages={totalPages} total={total} pageSize={PAGE_SIZE} />
          </Suspense>
        </>
      )}
    </>
  )
}

export default function BlogPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 pt-32 pb-20">
        {/* Header renders immediately — no data needed */}
        <div className="mb-14">
          <p className="font-mono text-green-400 text-sm mb-2">writing</p>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-100">Blog & Articles</h1>
          <div className="mt-3 w-16 h-px bg-green-400" />
          <p className="text-zinc-500 mt-4 text-sm">
            Thoughts on software, AI, automation, and things I&apos;m learning.
          </p>
        </div>

        {/* Posts + filters stream in from cache */}
        <Suspense fallback={<PostsSkeleton />}>
          <BlogContent searchParams={searchParams} />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
