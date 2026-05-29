'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import TagInput from '../../_components/TagInput'
import StatusPicker, { type Status } from '../../_components/StatusPicker'

interface Props {
  id?: string
  initial?: {
    title: string
    slug: string
    excerpt: string
    content: string
    tags: string[]
    coverImage: string
    status: Status
    scheduledAt: string
  }
}

const defaults = {
  title: '', slug: '', excerpt: '', content: '',
  tags: [] as string[], coverImage: '', status: 'draft' as Status, scheduledAt: '',
}

function toSlug(title: string) {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function BlogForm({ id, initial }: Props) {
  const router = useRouter()
  const [form, setForm] = useState({ ...defaults, ...initial })
  const [slugEdited, setSlugEdited] = useState(!!id)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slugEdited) {
      setForm((f) => ({ ...f, slug: toSlug(f.title) }))
    }
  }, [form.title, slugEdited])

  function set<K extends keyof typeof defaults>(key: K, value: (typeof defaults)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      ...form,
      scheduledAt: form.status === 'scheduled' && form.scheduledAt
        ? new Date(form.scheduledAt).toISOString() : null,
      coverImage: form.coverImage || null,
    }

    const res = id
      ? await fetch(`/api/admin/blog/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      : await fetch('/api/admin/blog', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })

    if (res.ok) {
      router.push('/admin/blog')
      router.refresh()
    } else {
      try {
        const data = await res.json()
        setError(typeof data.error === 'string' ? data.error : 'Something went wrong.')
      } catch {
        setError('Something went wrong. Check your database connection.')
      }
    }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div>
        <label className="block text-zinc-300 text-sm font-mono mb-1">Title *</label>
        <input
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          required
          className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-400"
          placeholder="My First Article"
        />
      </div>

      <div>
        <label className="block text-zinc-300 text-sm font-mono mb-1">Slug *</label>
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 text-sm font-mono">/blog/</span>
          <input
            value={form.slug}
            onChange={(e) => { setSlugEdited(true); set('slug', e.target.value) }}
            required
            pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
            className="flex-1 bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-400 font-mono"
            placeholder="my-first-article"
          />
        </div>
        <p className="text-zinc-600 text-xs mt-1 font-mono">Lowercase letters, numbers and hyphens only</p>
      </div>

      <div>
        <label className="block text-zinc-300 text-sm font-mono mb-1">Excerpt *</label>
        <textarea
          value={form.excerpt}
          onChange={(e) => set('excerpt', e.target.value)}
          required
          rows={2}
          className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-400 resize-none"
          placeholder="A short summary shown in the blog list..."
        />
      </div>

      <div>
        <label className="block text-zinc-300 text-sm font-mono mb-1">Content * <span className="text-zinc-500">(Markdown supported)</span></label>
        <textarea
          value={form.content}
          onChange={(e) => set('content', e.target.value)}
          required
          rows={16}
          className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-400 resize-y font-mono leading-relaxed"
          placeholder="# My Article&#10;&#10;Write your content here using Markdown..."
        />
      </div>

      <div>
        <label className="block text-zinc-300 text-sm font-mono mb-1">Tags</label>
        <TagInput tags={form.tags} onChange={(tags) => set('tags', tags)} placeholder="React, Next.js, AI..." />
      </div>

      <div>
        <label className="block text-zinc-300 text-sm font-mono mb-1">Cover Image URL <span className="text-zinc-500">(optional)</span></label>
        <input
          value={form.coverImage}
          onChange={(e) => set('coverImage', e.target.value)}
          type="url"
          className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-400"
          placeholder="https://..."
        />
      </div>

      <StatusPicker
        status={form.status}
        scheduledAt={form.scheduledAt}
        onStatusChange={(s) => set('status', s)}
        onScheduledAtChange={(v) => set('scheduledAt', v)}
      />

      {error && <p className="text-red-400 text-sm font-mono">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="px-6 py-2.5 bg-green-400 text-zinc-950 font-semibold text-sm rounded-lg hover:bg-green-300 disabled:opacity-50 transition-colors font-mono">
          {saving ? 'Saving…' : id ? 'Save Changes' : 'Create Post'}
        </button>
        <button type="button" onClick={() => router.back()} className="px-6 py-2.5 border border-zinc-700 text-zinc-400 text-sm rounded-lg hover:border-zinc-600 hover:text-zinc-200 transition-colors font-mono">
          Cancel
        </button>
      </div>
    </form>
  )
}
