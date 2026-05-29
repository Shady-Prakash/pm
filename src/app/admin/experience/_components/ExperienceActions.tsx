'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ExperienceActions({ id, status }: { id: string; status: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function quickPublish() {
    setLoading(true)
    const newStatus = status === 'published' ? 'draft' : 'published'
    await fetch(`/api/admin/experiences/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    router.refresh()
    setLoading(false)
  }

  async function remove() {
    if (!confirm('Delete this entry?')) return
    setLoading(true)
    await fetch(`/api/admin/experiences/${id}`, { method: 'DELETE' })
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-3 justify-end">
      <button onClick={quickPublish} disabled={loading} className={`text-xs font-mono transition-colors ${status === 'published' ? 'text-yellow-400 hover:text-yellow-300' : 'text-green-400 hover:text-green-300'}`}>
        {status === 'published' ? 'Unpublish' : 'Publish'}
      </button>
      <Link href={`/admin/experience/${id}`} className="text-zinc-400 hover:text-zinc-100 text-xs font-mono transition-colors">
        Edit
      </Link>
      <button onClick={remove} disabled={loading} className="text-zinc-600 hover:text-red-400 text-xs font-mono transition-colors">
        Delete
      </button>
    </div>
  )
}
