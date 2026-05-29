import { getExperiences } from '@/lib/content'
import PaginatedExperience from './PaginatedExperience'

export default async function Experience() {
  const experiences = await getExperiences()

  return (
    <section id="experience" className="py-28 px-6 max-w-6xl mx-auto">
      <div className="mb-14">
        <span className="font-mono text-green-400 text-sm">03.</span>
        <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 mt-1">Experience</h2>
        <div className="mt-3 w-16 h-px bg-green-400" />
      </div>
      <PaginatedExperience experiences={experiences} />
    </section>
  )
}
