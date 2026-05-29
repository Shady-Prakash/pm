import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import BlogForm from '../_components/BlogForm'

type Params = { params: Promise<{ id: string }> }

export default async function EditBlogPostPage({ params }: Params) {
  const { id } = await params
  let post
  try {
    post = await prisma.blogPost.findUnique({ where: { id } })
  } catch {}
  if (!post) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-100 mb-8">Edit Post</h1>
      <BlogForm
        id={post.id}
        initial={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          tags: post.tags,
          coverImage: post.coverImage ?? '',
          status: post.status as 'draft' | 'published' | 'scheduled',
          scheduledAt: post.scheduledAt ? new Date(post.scheduledAt).toISOString().slice(0, 16) : '',
        }}
      />
    </div>
  )
}
