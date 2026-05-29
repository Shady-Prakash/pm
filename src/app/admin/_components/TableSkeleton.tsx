export default function TableSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-9 w-full bg-zinc-800 rounded-lg mb-5" />
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="border-b border-zinc-800 px-6 py-3 flex gap-10">
          {[140, 80, 64, 80].map((w, i) => (
            <div key={i} className="h-3 bg-zinc-800 rounded" style={{ width: w }} />
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="px-6 py-4 border-b border-zinc-800 last:border-0 flex items-center gap-10">
            <div className="h-4 w-48 bg-zinc-800 rounded" />
            <div className="h-4 w-24 bg-zinc-800 rounded" />
            <div className="h-5 w-16 bg-zinc-800 rounded-full" />
            <div className="h-4 w-20 bg-zinc-800 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
