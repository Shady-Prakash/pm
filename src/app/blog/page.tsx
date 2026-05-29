import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BlogPagination from '@/components/BlogPagination'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 6

function isVisible(item: { status: string; scheduledAt: Date | null }) {
  if (item.status === 'published') return true
  if (item.status === 'scheduled' && item.scheduledAt && new Date() >= item.scheduledAt) return true
  return false
}

type SearchParams = Promise<{ page?: string }>

export default async function BlogPage({ searchParams }: { searchParams: SearchParams }) {
  const { page: pageStr = '1' } = await searchParams
  const page = Math.max(1, parseInt(pageStr) || 1)

  let posts: Awaited<ReturnType<typeof prisma.blogPost.findMany>> = []
  let total = 0

  try {
    const where = {
      OR: [
        { status: 'published' },
        { status: 'scheduled', scheduledAt: { lte: new Date() } },
      ],
    }
    ;[posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.blogPost.count({ where }),
    ])
  } catch {}

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        <div className="mb-14">
          <p className="font-mono text-green-400 text-sm mb-2">writing</p>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-100">Blog & Articles</h1>
          <div className="mt-3 w-16 h-px bg-green-400" />
          <p className="text-zinc-500 mt-4 text-sm">
            Thoughts on software, AI, automation, and things I&apos;m learning.
            {total > 0 && <span className="ml-2 text-zinc-600">{total} articles</span>}
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-600 font-mono">No posts yet — check back soon.</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                  <article className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 hover:-translate-y-1 transition-all duration-200 h-full flex flex-col">
                    {post.coverImage && (
                      <div className="relative w-full h-48 overflow-hidden">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized={post.coverImage.endsWith('.gif')}
                        />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-green-400 font-mono text-xs">{tag}</span>
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
              <BlogPagination
                page={page}
                totalPages={totalPages}
                total={total}
                pageSize={PAGE_SIZE}
              />
            </Suspense>
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
