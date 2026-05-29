'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Skill } from '@/types'
import TagInput from '../../_components/TagInput'
import StatusPicker, { type Status } from '../../_components/StatusPicker'

interface Props {
  initial: { bio: string[]; skills: Skill[]; status: Status; scheduledAt: string }
}

export default function AboutForm({ initial }: Props) {
  const router = useRouter()
  const [bio, setBio] = useState<string[]>(initial.bio)
  const [skills, setSkills] = useState<Skill[]>(initial.skills)
  const [status, setStatus] = useState<Status>(initial.status)
  const [scheduledAt, setScheduledAt] = useState(initial.scheduledAt)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function updateBio(i: number, val: string) {
    const next = [...bio]; next[i] = val; setBio(next)
  }
  function addParagraph() { setBio([...bio, '']) }
  function removeParagraph(i: number) { if (bio.length > 1) setBio(bio.filter((_, idx) => idx !== i)) }

  function updateSkillCategory(i: number, category: string) {
    const next = [...skills]; next[i] = { ...next[i], category }; setSkills(next)
  }
  function updateSkillItems(i: number, items: string[]) {
    const next = [...skills]; next[i] = { ...next[i], items }; setSkills(next)
  }
  function addSkillGroup() { setSkills([...skills, { category: '', items: [] }]) }
  function removeSkillGroup(i: number) { setSkills(skills.filter((_, idx) => idx !== i)) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)

    const res = await fetch('/api/admin/about', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bio: bio.filter(Boolean),
        skills,
        status,
        scheduledAt: status === 'scheduled' && scheduledAt ? new Date(scheduledAt).toISOString() : null,
      }),
    })

    if (res.ok) {
      setSaved(true)
      router.refresh()
      setTimeout(() => setSaved(false), 3000)
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
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {/* Bio Paragraphs */}
      <div>
        <label className="block text-zinc-300 text-sm font-mono mb-2">Bio paragraphs</label>
        <div className="space-y-3">
          {bio.map((para, i) => (
            <div key={i} className="flex gap-2">
              <textarea
                value={para}
                onChange={(e) => updateBio(i, e.target.value)}
                rows={3}
                className="flex-1 bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-400 resize-none"
                placeholder={`Paragraph ${i + 1}…`}
              />
              <button type="button" onClick={() => removeParagraph(i)} className="text-zinc-600 hover:text-red-400 text-xl self-start mt-2 transition-colors">×</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addParagraph} className="mt-2 text-green-400 text-sm font-mono hover:text-green-300 transition-colors">
          + Add paragraph
        </button>
      </div>

      {/* Skills */}
      <div>
        <label className="block text-zinc-300 text-sm font-mono mb-3">Skills</label>
        <div className="space-y-4">
          {skills.map((group, i) => (
            <div key={i} className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <input
                  value={group.category}
                  onChange={(e) => updateSkillCategory(i, e.target.value)}
                  placeholder="Category (e.g. Frontend)"
                  className="flex-1 bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-400"
                />
                <button type="button" onClick={() => removeSkillGroup(i)} className="text-zinc-600 hover:text-red-400 text-lg transition-colors">×</button>
              </div>
              <TagInput
                tags={group.items}
                onChange={(items) => updateSkillItems(i, items)}
                placeholder="Add skills, press Enter…"
              />
            </div>
          ))}
        </div>
        <button type="button" onClick={addSkillGroup} className="mt-3 text-green-400 text-sm font-mono hover:text-green-300 transition-colors">
          + Add skill category
        </button>
      </div>

      <StatusPicker
        status={status}
        scheduledAt={scheduledAt}
        onStatusChange={setStatus}
        onScheduledAtChange={setScheduledAt}
      />

      {error && <p className="text-red-400 text-sm font-mono">{error}</p>}
      {saved && <p className="text-green-400 text-sm font-mono">Saved successfully!</p>}

      <button
        type="submit"
        disabled={saving}
        className="px-6 py-2.5 bg-green-400 text-zinc-950 font-semibold text-sm rounded-lg hover:bg-green-300 disabled:opacity-50 transition-colors font-mono"
      >
        {saving ? 'Saving…' : 'Save About Section'}
      </button>
    </form>
  )
}
