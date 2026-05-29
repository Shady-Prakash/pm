'use client'

interface Props {
  page: number
  totalPages: number
  total: number
  pageSize: number
  onChange: (page: number) => void
}

export default function SectionPagination({ page, totalPages, total, pageSize, onChange }: Props) {
  if (totalPages <= 1) return null

  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
    .reduce<(number | '…')[]>((acc, p, i, arr) => {
      if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push('…')
      acc.push(p)
      return acc
    }, [])

  return (
    <div className="mt-20 pt-10 border-t border-zinc-800/50 flex flex-col items-center gap-5">
      <p className="text-zinc-600 text-xs font-mono tracking-wide">
        {from}–{to} of {total}
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="group flex items-center gap-1.5 px-4 py-2 rounded-lg border border-zinc-800 text-zinc-500 text-sm font-mono hover:border-green-400/50 hover:text-green-400 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
        >
          <svg className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Prev
        </button>

        <div className="flex items-center gap-1">
          {pages.map((p, i) =>
            p === '…' ? (
              <span key={`e${i}`} className="w-9 text-center text-zinc-600 text-sm font-mono">···</span>
            ) : (
              <button
                key={p}
                onClick={() => onChange(p as number)}
                aria-label={`Page ${p}`}
                aria-current={p === page ? 'page' : undefined}
                className={`w-9 h-9 rounded-lg text-sm font-mono transition-all ${
                  p === page
                    ? 'bg-green-400 text-zinc-950 font-bold shadow-lg shadow-green-400/20'
                    : 'border border-zinc-800 text-zinc-500 hover:border-green-400/50 hover:text-green-400'
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="group flex items-center gap-1.5 px-4 py-2 rounded-lg border border-zinc-800 text-zinc-500 text-sm font-mono hover:border-green-400/50 hover:text-green-400 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
        >
          Next
          <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="flex gap-1.5">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-label={`Go to page ${p}`}
            className={`rounded-full transition-all ${
              p === page
                ? 'w-5 h-1.5 bg-green-400'
                : 'w-1.5 h-1.5 bg-zinc-700 hover:bg-zinc-500'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
