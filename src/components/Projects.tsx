import { getProjects } from '@/lib/content'
import PaginatedProjects from './PaginatedProjects'

export default async function Projects() {
  const projects = await getProjects()

  return (
    <section id="projects" className="py-28 px-6 max-w-6xl mx-auto">
      <div className="mb-14">
        <span className="font-mono text-green-400 text-sm">02.</span>
        <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 mt-1">Projects</h2>
        <div className="mt-3 w-16 h-px bg-green-400" />
      </div>
      <PaginatedProjects projects={projects} />
    </section>
  )
}
