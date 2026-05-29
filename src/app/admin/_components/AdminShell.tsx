'use client'

import { useState, useEffect } from 'react'
import AdminSidebar from './AdminSidebar'

interface Props {
  user?: { name?: string | null; email?: string | null; image?: string | null }
  children: React.ReactNode
}

export default function AdminShell({ user, children }: Props) {
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('admin-sidebar-collapsed')
    if (stored !== null) setCollapsed(stored === 'true')
    setMounted(true)
  }, [])

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem('admin-sidebar-collapsed', String(next))
      return next
    })
  }

  const ml = !mounted ? 'md:ml-64' : collapsed ? 'md:ml-16' : 'md:ml-64'

  return (
    <div className="min-h-screen bg-zinc-950">
      <AdminSidebar user={user} collapsed={collapsed} onToggle={toggle} />

      <main className={`min-h-screen transition-all duration-300 ${ml}`}>
        <div className="md:hidden h-14" />
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  )
}
