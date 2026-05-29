'use client'

import { useState } from 'react'
import SectionPagination from './SectionPagination'

interface Experience {
  id: string
  company: string
  role: string
  period: string
  location: string
  description: string[]
}

const PAGE_SIZE = 6

export default function PaginatedExperience({ experiences }: { experiences: Experience[] }) {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(experiences.length / PAGE_SIZE)
  const slice = experiences.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <>
      <div className="relative max-w-3xl">
        <div className="absolute left-0 top-2 bottom-2 w-px bg-zinc-800" />
        <div className="space-y-10">
          {slice.map((exp) => (
            <div key={exp.id} className="relative pl-10">
              <div className="absolute left-0 top-5 w-3 h-3 rounded-full bg-green-400 -translate-x-1/2 ring-4 ring-zinc-950" />
              <article className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-1">
                  <h3 className="text-zinc-100 font-semibold text-lg">{exp.role}</h3>
                  <span className="text-green-400 font-mono text-sm shrink-0">{exp.period}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  <span className="text-zinc-300 font-mono text-sm">{exp.company}</span>
                  <span className="text-zinc-700">·</span>
                  <span className="text-zinc-500 text-sm">{exp.location}</span>
                </div>
                <ul className="space-y-2.5">
                  {exp.description.map((point, i) => (
                    <li key={i} className="flex gap-3 text-zinc-400 text-sm leading-relaxed">
                      <span className="text-green-400 mt-px shrink-0">▹</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          ))}
        </div>
      </div>

      <SectionPagination
        page={page}
        totalPages={totalPages}
        total={experiences.length}
        pageSize={PAGE_SIZE}
        onChange={setPage}
      />
    </>
  )
}
