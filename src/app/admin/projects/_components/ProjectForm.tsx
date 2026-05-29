'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TagInput from '../../_components/TagInput'
import StatusPicker, { type Status } from '../../_components/StatusPicker'

interface Props {
  id?: string
  initial?: {
    title: string
    description: string
    tech: string[]
    liveUrl: string
    githubUrl: string
    status: Status
    scheduledAt: string
  }
}

const defaults = { title: '', description: '', tech: [] as string[], liveUrl: '', githubUrl: '', status: 'draft' as Status, scheduledAt: '' }

export default function ProjectForm({ id, initial }: Props) {
  const router = useRouter()
  const [form, setForm] = useState({ ...defaults, ...initial })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

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
        ? new Date(form.scheduledAt).toISOString()
        : null,
    }

    const res = id
      ? await fetch(`/api/admin/projects/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      : await fetch('/api/admin/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })

    if (res.ok) {
      router.push('/admin/projects')
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-zinc-300 text-sm font-mono mb-1">Title *</label>
        <input
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          required
          className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-400"
          placeholder="Project name"
        />
      </div>

      <div>
        <label className="block text-zinc-300 text-sm font-mono mb-1">Description *</label>
        <textarea
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          required
          rows={3}
          className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-400 resize-none"
          placeholder="Describe the project…"
        />
      </div>

      <div>
        <label className="block text-zinc-300 text-sm font-mono mb-1">Tech Stack *</label>
        <TagInput tags={form.tech} onChange={(tags) => set('tech', tags)} placeholder="React, Next.js, TypeScript…" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-zinc-300 text-sm font-mono mb-1">Live URL</label>
          <input
            value={form.liveUrl}
            onChange={(e) => set('liveUrl', e.target.value)}
            type="url"
            className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-400"
            placeholder="https://…"
          />
        </div>
        <div>
          <label className="block text-zinc-300 text-sm font-mono mb-1">GitHub URL</label>
          <input
            value={form.githubUrl}
            onChange={(e) => set('githubUrl', e.target.value)}
            type="url"
            className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-400"
            placeholder="https://github.com/…"
          />
        </div>
      </div>

      <StatusPicker
        status={form.status}
        scheduledAt={form.scheduledAt}
        onStatusChange={(s) => set('status', s)}
        onScheduledAtChange={(v) => set('scheduledAt', v)}
      />

      {error && <p className="text-red-400 text-sm font-mono">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-green-400 text-zinc-950 font-semibold text-sm rounded-lg hover:bg-green-300 disabled:opacity-50 transition-colors font-mono"
        >
          {saving ? 'Saving…' : id ? 'Save Changes' : 'Create Project'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 border border-zinc-700 text-zinc-400 text-sm rounded-lg hover:border-zinc-600 hover:text-zinc-200 transition-colors font-mono"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
