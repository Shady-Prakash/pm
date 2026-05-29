'use client'

import { useState } from 'react'
import SectionPagination from './SectionPagination'

interface Project {
  id: string
  title: string
  description: string
  tech: string[]
  liveUrl?: string | null
  githubUrl?: string | null
}

const PAGE_SIZE = 6

function FolderIcon() {
  return (
    <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  )
}

export default function PaginatedProjects({ projects }: { projects: Project[] }) {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(projects.length / PAGE_SIZE)
  const slice = projects.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slice.map((project) => (
          <article
            key={project.id}
            className="group bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex flex-col hover:border-zinc-700 hover:-translate-y-1 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-5">
              <FolderIcon />
              <div className="flex gap-4">
                {project.githubUrl && (
                  <a href={project.githubUrl} className="text-zinc-400 hover:text-green-400 transition-colors" aria-label={`${project.title} GitHub repository`} target="_blank" rel="noopener noreferrer">
                    <GitHubIcon />
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} className="text-zinc-400 hover:text-green-400 transition-colors" aria-label={`${project.title} live demo`} target="_blank" rel="noopener noreferrer">
                    <ExternalLinkIcon />
                  </a>
                )}
              </div>
            </div>
            <h3 className="text-zinc-100 font-semibold text-lg mb-2 group-hover:text-green-400 transition-colors">
              {project.title}
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed flex-1 mb-5">{project.description}</p>
            <div className="flex flex-wrap gap-3">
              {project.tech.map((t) => (
                <span key={t} className="text-green-400 font-mono text-xs">{t}</span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <SectionPagination
        page={page}
        totalPages={totalPages}
        total={projects.length}
        pageSize={PAGE_SIZE}
        onChange={setPage}
      />
    </>
  )
}
