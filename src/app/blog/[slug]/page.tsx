import { getBlogPost, getBlogPosts } from '@/lib/content'
import { renderMarkdown } from '@/lib/markdown'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

// Pre-render all published posts at build time; revalidate every 5 min
export const revalidate = 300

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

type Params = { params: Promise<{ slug: string }> }

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) notFound()

  // renderMarkdown is unstable_cache'd — Shiki only runs once per unique content
  const htmlContent = await renderMarkdown(post.content)

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        <Link href="/blog" className="text-zinc-500 hover:text-green-400 font-mono text-sm transition-colors mb-8 inline-block">
          ← Back to Blog
        </Link>

        <article>
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span key={tag} className="text-green-400 font-mono text-xs">{tag}</span>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-4 leading-tight">
            {post.title}
          </h1>

          <time className="text-zinc-500 text-sm font-mono block mb-10">
            {post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })
              : new Date(post.createdAt).toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })}
          </time>

          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full rounded-xl mb-10 object-cover max-h-80"
            />
          )}

          <div
            className="
              prose prose-invert max-w-none
              prose-headings:text-zinc-100 prose-headings:font-bold prose-headings:tracking-tight
              prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
              prose-p:text-zinc-400 prose-p:leading-relaxed
              prose-a:text-green-400 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-zinc-200 prose-em:text-zinc-300
              prose-li:text-zinc-400 prose-ul:list-disc prose-ol:list-decimal
              prose-blockquote:border-l-green-400 prose-blockquote:text-zinc-400 prose-blockquote:italic
              prose-hr:border-zinc-800 prose-table:text-zinc-300
              prose-thead:border-zinc-700 prose-tr:border-zinc-800
              prose-th:text-zinc-200 prose-td:text-zinc-400
              prose-code:text-zinc-200 prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
              [&_.code-block]:my-6
              [&_pre]:!bg-transparent [&_pre]:!p-0 [&_pre]:!m-0 [&_pre]:!rounded-none
            "
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </article>

        <div className="mt-16 pt-8 border-t border-zinc-800">
          <Link href="/blog" className="text-zinc-500 hover:text-green-400 font-mono text-sm transition-colors">
            ← Back to all articles
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
