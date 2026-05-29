'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const pathname = usePathname()
  const isHome = pathname === '/'

  function resolveHref(href: string) {
    if (href.startsWith('#') && !isHome) return `/${href}`
    return href
  }

  function isActive(href: string) {
    if (href.startsWith('/')) return pathname.startsWith(href)
    if (href.startsWith('#') && isHome) return activeSection === href.slice(1)
    return false
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!isHome) return
    const ids = ['about', 'projects', 'experience', 'contact']

    function onScroll() {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const docHeight = document.documentElement.scrollHeight

      // If scrolled to near the bottom, always activate the last section
      if (scrollY + windowHeight >= docHeight - 80) {
        setActiveSection('contact')
        return
      }

      // Activate the last section whose top has crossed 40% down the viewport
      const threshold = windowHeight * 0.4
      let active = ''
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= threshold) active = id
      }
      setActiveSection(active)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-800' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-green-400 font-mono font-bold text-lg tracking-tight">
          PM.
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <a
              key={link.label}
              href={resolveHref(link.href)}
              className={`text-sm font-mono transition-colors ${
                isActive(link.href) ? 'text-green-400' : 'text-zinc-400 hover:text-green-400'
              }`}
            >
              <span className="text-green-400 mr-1">0{i + 1}.</span>
              {link.label}
            </a>
          ))}
        </div>

        <button
          className="md:hidden text-zinc-400 hover:text-green-400 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
            <span
              className={`block w-6 h-0.5 bg-current transition-all duration-300 ${
                menuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-current transition-all duration-300 ${
                menuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-current transition-all duration-300 ${
                menuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </div>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-zinc-800 px-6 pb-6 pt-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={resolveHref(link.href)}
              className={`block py-3 font-mono text-sm transition-colors ${
                isActive(link.href) ? 'text-green-400' : 'text-zinc-400 hover:text-green-400'
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
