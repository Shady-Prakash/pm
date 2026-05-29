'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useTransition, useRef, useState, useEffect, useCallback } from 'react'

interface Props {
  allTags: string[]
  q: string
  activeTag: string
}

export default function BlogFilters({ allTags, q, activeTag }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  const syncScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 2)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2)
  }, [])

  useEffect(() => {
    syncScroll()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', syncScroll, { passive: true })
    const ro = new ResizeObserver(syncScroll)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', syncScroll)
      ro.disconnect()
    }
  }, [allTags, syncScroll])

  // Scroll active tag into view when tag filter changes
  useEffect(() => {
    if (!activeTag) return
    const el = scrollRef.current
    if (!el) return
    const btn = el.querySelector<HTMLButtonElement>(`[data-tag="${activeTag}"]`)
    btn?.scrollIntoView({ inline: 'nearest', behavior: 'smooth', block: 'nearest' })
  }, [activeTag])

  function push(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('page')
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v)
      else params.delete(k)
    })
    startTransition(() => router.push(`${pathname}?${params.toString()}`))
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => push({ q: value }), 350)
  }

  function toggleTag(tag: string) {
    push({ tag: tag === activeTag ? '' : tag })
  }

  function slide(dir: 'left' | 'right') {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -180 : 180, behavior: 'smooth' })
  }

  return (
    <div className={`mb-10 space-y-3 transition-opacity duration-150 ${isPending ? 'opacity-60' : 'opacity-100'}`}>

      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          defaultValue={q}
          onChange={handleSearch}
          placeholder="Search articles…"
          className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-600 text-sm font-mono rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-400 transition-colors"
        />
      </div>

      {/* Tag carousel */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-2">

          {/* Left arrow */}
          <button
            onClick={() => slide('left')}
            aria-label="Scroll left"
            className={`shrink-0 w-6 h-6 flex items-center justify-center rounded-full border border-zinc-700 text-zinc-400 hover:text-green-400 hover:border-green-400 transition-all duration-150 ${
              canLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Scroll track */}
          <div className="relative flex-1 overflow-hidden">
            {/* Left fade */}
            <div
              className={`absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none transition-opacity duration-150 ${
                canLeft ? 'opacity-100' : 'opacity-0'
              }`}
            />

            <div
              ref={scrollRef}
              className="flex gap-2 overflow-x-auto no-scrollbar"
            >
              {allTags.map((tag) => (
                <button
                  key={tag}
                  data-tag={tag}
                  onClick={() => toggleTag(tag)}
                  className={`shrink-0 px-3 py-1 rounded-full text-xs font-mono whitespace-nowrap transition-all duration-150 ${
                    activeTag === tag
                      ? 'bg-green-400 text-zinc-950 font-semibold shadow-[0_0_12px_rgba(74,222,128,0.35)]'
                      : 'bg-zinc-900 border border-zinc-700 text-zinc-400 hover:border-green-400 hover:text-green-400'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Right fade */}
            <div
              className={`absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none transition-opacity duration-150 ${
                canRight ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>

          {/* Right arrow */}
          <button
            onClick={() => slide('right')}
            aria-label="Scroll right"
            className={`shrink-0 w-6 h-6 flex items-center justify-center rounded-full border border-zinc-700 text-zinc-400 hover:text-green-400 hover:border-green-400 transition-all duration-150 ${
              canRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

        </div>
      )}
    </div>
  )
}
