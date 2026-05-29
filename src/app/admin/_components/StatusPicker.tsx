'use client'

export type Status = 'draft' | 'published' | 'scheduled'

interface Props {
  status: Status
  scheduledAt: string
  onStatusChange: (s: Status) => void
  onScheduledAtChange: (v: string) => void
}

const options: { value: Status; label: string; color: string }[] = [
  { value: 'draft', label: 'Draft', color: 'text-zinc-400' },
  { value: 'published', label: 'Publish Now', color: 'text-green-400' },
  { value: 'scheduled', label: 'Schedule', color: 'text-blue-400' },
]

export default function StatusPicker({ status, scheduledAt, onStatusChange, onScheduledAtChange }: Props) {
  return (
    <div className="space-y-3">
      <label className="block text-zinc-300 text-sm font-mono mb-2">Status</label>
      <div className="flex gap-3">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border transition-colors ${
              status === opt.value
                ? 'border-green-400 bg-green-400/10'
                : 'border-zinc-700 hover:border-zinc-600'
            }`}
          >
            <input
              type="radio"
              name="status"
              value={opt.value}
              checked={status === opt.value}
              onChange={() => onStatusChange(opt.value)}
              className="accent-green-400"
            />
            <span className={`text-sm font-mono ${opt.color}`}>{opt.label}</span>
          </label>
        ))}
      </div>

      {status === 'scheduled' && (
        <div>
          <label className="block text-zinc-400 text-xs font-mono mb-1">Schedule date & time</label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => onScheduledAtChange(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-400 font-mono"
          />
        </div>
      )}
    </div>
  )
}
