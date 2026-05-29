'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import StatusPicker, { type Status } from '../../_components/StatusPicker'

interface Props {
  id?: string
  initial?: {
    company: string
    role: string
    period: string
    location: string
    description: string[]
    status: Status
    scheduledAt: string
  }
}

const defaults = {
  company: '', role: '', period: '', location: '',
  description: [''], status: 'draft' as Status, scheduledAt: '',
}

export default function ExperienceForm({ id, initial }: Props) {
  const router = useRouter()
  const [form, setForm] = useState({ ...defaults, ...initial })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set<K extends keyof typeof defaults>(key: K, value: (typeof defaults)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function setPoint(i: number, val: string) {
    const next = [...form.description]
    next[i] = val
    set('description', next)
  }

  function addPoint() { set('description', [...form.description, '']) }

  function removePoint(i: number) {
    if (form.description.length === 1) return
    set('description', form.description.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      ...form,
      description: form.description.filter(Boolean),
      scheduledAt: form.status === 'scheduled' && form.scheduledAt
        ? new Date(form.scheduledAt).toISOString()
        : null,
    }

    const res = id
      ? await fetch(`/api/admin/experiences/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      : await fetch('/api/admin/experiences', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })

    if (res.ok) {
      router.push('/admin/experience')
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
      <div className="grid grid-cols-2 gap-4">
        {(['company', 'role', 'period', 'location'] as const).map((field) => (
          <div key={field}>
            <label className="block text-zinc-300 text-sm font-mono mb-1 capitalize">{field} *</label>
            <input
              value={form[field]}
              onChange={(e) => set(field, e.target.value)}
              required
              className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-400"
              placeholder={field === 'period' ? '2023 – Present' : ''}
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-zinc-300 text-sm font-mono mb-2">Description bullets *</label>
        <div className="space-y-2">
          {form.description.map((point, i) => (
            <div key={i} className="flex gap-2 items-start">
              <span className="text-green-400 mt-2.5 text-xs shrink-0">▹</span>
              <input
                value={point}
                onChange={(e) => setPoint(i, e.target.value)}
                className="flex-1 bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-400"
                placeholder="Describe what you did…"
              />
              <button
                type="button"
                onClick={() => removePoint(i)}
                className="text-zinc-600 hover:text-red-400 mt-2 transition-colors text-lg leading-none"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addPoint}
          className="mt-2 text-green-400 text-sm font-mono hover:text-green-300 transition-colors"
        >
          + Add bullet
        </button>
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
          {saving ? 'Saving…' : id ? 'Save Changes' : 'Create Entry'}
        </button>
        <button type="button" onClick={() => router.back()} className="px-6 py-2.5 border border-zinc-700 text-zinc-400 text-sm rounded-lg hover:border-zinc-600 hover:text-zinc-200 transition-colors font-mono">
          Cancel
        </button>
      </div>
    </form>
  )
}
