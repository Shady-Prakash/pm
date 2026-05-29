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

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      <AdminSidebar user={user} collapsed={collapsed} onToggle={toggle} />

      {/* Spacer that matches sidebar width — prevents content flash before mount */}
      <div
        className={`hidden md:block shrink-0 transition-all duration-300 ${
          !mounted ? 'w-64' : collapsed ? 'w-16' : 'w-64'
        }`}
      />

      <main className="flex-1 min-w-0 min-h-screen">
        <div className="md:hidden h-14" />
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  )
}
