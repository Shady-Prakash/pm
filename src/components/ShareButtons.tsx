'use client'

import { useState, useSyncExternalStore } from 'react'
import { getShareLinks } from '@/lib/share'

interface Props {
  url: string
  title: string
}

/** Shared circular icon-button shell so every control looks identical. */
function IconButton({
  label,
  className,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    label: string
    href?: string
  }) {
  const base =
    'flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 text-zinc-400 transition-all duration-150 hover:-translate-y-0.5'
  const cls = `${base} ${className ?? ''}`

  return rest.href ? (
    <a aria-label={label} title={label} target="_blank" rel="noopener noreferrer" className={cls} {...rest}>
      {children}
    </a>
  ) : (
    <button type="button" aria-label={label} title={label} className={cls} {...rest}>
      {children}
    </button>
  )
}

const accentHover =
  'hover:!text-green-400 hover:!border-green-400 hover:shadow-[0_0_14px_rgba(74,222,128,0.35)]'

// navigator.share is mostly mobile. useSyncExternalStore returns `false` on the
// server snapshot, so SSR + first client render agree (no hydration mismatch),
// then React reconciles to the real capability. Subscribe is a no-op — the
// capability never changes for the life of the page.
const noopSubscribe = () => () => {}
function useHasNativeShare() {
  return useSyncExternalStore(
    noopSubscribe,
    () => typeof navigator !== 'undefined' && !!navigator.share,
    () => false,
  )
}

export default function ShareButtons({ url, title }: Props) {
  const [copied, setCopied] = useState(false)
  const canNativeShare = useHasNativeShare()

  const links = getShareLinks(url, title)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* Clipboard unavailable (insecure context / denied) — no-op */
    }
  }

  async function handleNativeShare() {
    try {
      await navigator.share({ title, url })
    } catch {
      /* User dismissed the share sheet — ignore */
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-zinc-500 font-mono text-xs uppercase tracking-wider">Share this article</span>

      <div className="flex flex-wrap items-center gap-2">
        {links.map((p) => (
          <IconButton key={p.name} label={p.name} href={p.href} className={p.brand}>
            <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d={p.icon} />
            </svg>
          </IconButton>
        ))}

        {/* Native share sheet — mobile only */}
        {canNativeShare && (
          <IconButton label="More share options" onClick={handleNativeShare} className={accentHover}>
            <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
            </svg>
          </IconButton>
        )}

        {/* Copy link */}
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy link"
          className={`flex h-9 items-center gap-1.5 rounded-full border px-3 font-mono text-xs transition-all duration-150 ${
            copied
              ? 'border-green-400 text-green-400 shadow-[0_0_12px_rgba(74,222,128,0.35)]'
              : 'border-zinc-700 text-zinc-400 hover:-translate-y-0.5 hover:border-green-400 hover:text-green-400'
          }`}
        >
          <svg className="h-[14px] w-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={copied ? 2.5 : 2} aria-hidden="true">
            {copied ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            ) : (
              <>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H18a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-1.5" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 3H6a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h9a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3Z" />
              </>
            )}
          </svg>
          {copied ? 'Copied!' : 'Copy link'}
        </button>
      </div>
    </div>
  )
}
