'use client'

import { useState, useEffect, memo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import Image from 'next/image'

const nav = [
  { label: 'Dashboard', href: '/admin', icon: '▣' },
  { label: 'Projects', href: '/admin/projects', icon: '◈' },
  { label: 'Experience', href: '/admin/experience', icon: '◉' },
  { label: 'Blog', href: '/admin/blog', icon: '◇' },
  { label: 'About', href: '/admin/about', icon: '◎' },
]

interface User {
  name?: string | null
  email?: string | null
  image?: string | null
}

interface InnerProps {
  user?: User
  collapsed: boolean
  onToggle?: () => void
  onClose?: () => void
}

// Extracted as a stable top-level component so React never remounts it on re-renders
const SidebarInner = memo(function SidebarInner({ user, collapsed, onToggle, onClose }: InnerProps) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`flex items-center border-b border-zinc-800 h-14 px-4 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {collapsed ? (
          <Link href="/admin" className="text-green-400 font-mono font-bold text-lg" onClick={onClose}>P.</Link>
        ) : (
          <Link href="/admin" className="text-green-400 font-mono font-bold text-base" onClick={onClose}>PM. Admin</Link>
        )}
        {onClose && (
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className={`space-y-1 ${collapsed ? 'px-2' : 'px-3'}`}>
          {nav.map(({ label, href, icon }) => {
            const active = href === '/admin' ? pathname === href : pathname.startsWith(href)
            return (
              <li key={href} className="relative group/item">
                <Link
                  href={href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-lg transition-all ${
                    collapsed ? 'justify-center p-2.5' : 'px-3 py-2.5'
                  } ${
                    active
                      ? 'bg-green-400/10 text-green-400 border border-green-400/20'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 border border-transparent'
                  }`}
                >
                  <span className={`text-base leading-none shrink-0 ${collapsed ? 'w-5 text-center' : 'w-5 text-center'}`}>
                    {icon}
                  </span>
                  {!collapsed && <span className="text-sm font-mono flex-1">{label}</span>}
                  {!collapsed && active && <span className="w-1.5 h-1.5 rounded-full bg-green-400" />}
                  {collapsed && active && <span className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-green-400 rounded-l" />}
                </Link>

                {collapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 pointer-events-none opacity-0 group-hover/item:opacity-100 transition-opacity duration-150">
                    <div className="bg-zinc-800 text-zinc-100 text-xs font-mono px-2.5 py-1.5 rounded-lg whitespace-nowrap border border-zinc-700 shadow-xl">
                      {label}
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className={`border-t border-zinc-800 py-3 ${collapsed ? 'px-2' : 'px-4'}`}>
        {!collapsed ? (
          <>
            <div className="flex items-center gap-2.5 mb-3">
              {user?.image ? (
                <Image src={user.image} alt={user.name ?? 'Admin'} width={28} height={28} className="rounded-full ring-2 ring-zinc-700 shrink-0" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-400 text-xs font-mono shrink-0">
                  {user?.name?.[0]?.toUpperCase() ?? 'A'}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-zinc-200 text-xs font-medium truncate">{user?.name}</p>
                <p className="text-zinc-500 text-xs truncate">{user?.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className="text-center py-1.5 text-zinc-500 hover:text-red-400 text-xs font-mono transition-colors rounded-lg hover:bg-zinc-800"
              >
                Sign Out
              </button>
              <Link href="/" target="_blank" className="text-center py-1.5 text-zinc-500 hover:text-green-400 text-xs font-mono transition-colors rounded-lg hover:bg-zinc-800">
                ↗ Site
              </Link>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            {user?.image ? (
              <div className="relative group/avatar">
                <Image src={user.image} alt={user.name ?? 'Admin'} width={28} height={28} className="rounded-full ring-2 ring-zinc-700" />
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 pointer-events-none opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                  <div className="bg-zinc-800 text-zinc-100 text-xs font-mono px-2.5 py-1.5 rounded-lg whitespace-nowrap border border-zinc-700 shadow-xl">
                    {user?.email}
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-400 text-xs font-mono">
                {user?.name?.[0]?.toUpperCase() ?? 'A'}
              </div>
            )}
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="relative group/so p-1.5 text-zinc-500 hover:text-red-400 transition-colors rounded-lg hover:bg-zinc-800"
              aria-label="Sign out"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 pointer-events-none opacity-0 group-hover/so:opacity-100 transition-opacity">
                <div className="bg-zinc-800 text-zinc-100 text-xs font-mono px-2.5 py-1.5 rounded-lg whitespace-nowrap border border-zinc-700 shadow-xl">Sign Out</div>
              </div>
            </button>
          </div>
        )}

        {onToggle && (
          <button
            onClick={onToggle}
            className={`hidden md:flex items-center justify-center w-full mt-2 py-1.5 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-colors ${collapsed ? '' : 'gap-2'}`}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7M18 19l-7-7 7-7" />
            </svg>
            {!collapsed && <span className="text-xs font-mono">Collapse</span>}
          </button>
        )}
      </div>
    </div>
  )
})

interface Props {
  user?: User
  collapsed?: boolean
  onToggle?: () => void
}

export default function AdminSidebar({ user, collapsed = false, onToggle }: Props) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => setMobileOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`max-md:hidden flex flex-col fixed left-0 top-0 h-screen bg-zinc-900 border-r border-zinc-800 z-40 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
        <SidebarInner user={user} collapsed={collapsed} onToggle={onToggle} />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-800 px-4 h-14 flex items-center justify-between">
        <Link href="/admin" className="text-green-400 font-mono font-bold text-base">PM. Admin</Link>
        <button onClick={() => setMobileOpen(true)} aria-label="Open menu" className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile overlay */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`md:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Mobile drawer */}
      <aside className={`md:hidden fixed left-0 top-0 h-screen w-72 bg-zinc-900 border-r border-zinc-800 z-50 flex flex-col transform transition-transform duration-300 ease-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarInner user={user} collapsed={false} onToggle={onToggle} onClose={() => setMobileOpen(false)} />
      </aside>
    </>
  )
}
