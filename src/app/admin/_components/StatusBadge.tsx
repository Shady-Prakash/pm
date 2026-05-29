const styles: Record<string, string> = {
  published: 'bg-green-400/10 text-green-400 border-green-400/30',
  draft: 'bg-zinc-800 text-zinc-400 border-zinc-700',
  scheduled: 'bg-blue-400/10 text-blue-400 border-blue-400/30',
}

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-mono border ${styles[status] ?? styles.draft}`}>
      {status}
    </span>
  )
}
