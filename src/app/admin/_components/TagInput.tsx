'use client'

import { useState, KeyboardEvent } from 'react'

interface Props {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

export default function TagInput({ tags, onChange, placeholder = 'Type and press Enter…' }: Props) {
  const [input, setInput] = useState('')

  function add() {
    const val = input.trim()
    if (val && !tags.includes(val)) {
      onChange([...tags, val])
    }
    setInput('')
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { e.preventDefault(); add() }
    if (e.key === 'Backspace' && !input && tags.length > 0) {
      onChange(tags.slice(0, -1))
    }
  }

  return (
    <div className="flex flex-wrap gap-2 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus-within:ring-1 focus-within:ring-green-400 min-h-[44px]">
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 bg-zinc-700 text-zinc-200 text-xs font-mono px-2 py-1 rounded-full"
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(tags.filter((t) => t !== tag))}
            className="text-zinc-400 hover:text-red-400 transition-colors ml-0.5"
          >
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
        onBlur={add}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 min-w-24 bg-transparent text-zinc-100 text-sm outline-none placeholder-zinc-600"
      />
    </div>
  )
}
