import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ExperienceForm from '../_components/ExperienceForm'

type Params = { params: Promise<{ id: string }> }

export default async function EditExperiencePage({ params }: Params) {
  const { id } = await params
  let exp
  try {
    exp = await prisma.experience.findUnique({ where: { id } })
  } catch {}
  if (!exp) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-100 mb-8">Edit Experience</h1>
      <ExperienceForm
        id={exp.id}
        initial={{
          company: exp.company,
          role: exp.role,
          period: exp.period,
          location: exp.location,
          description: exp.description,
          status: exp.status as 'draft' | 'published' | 'scheduled',
          scheduledAt: exp.scheduledAt ? new Date(exp.scheduledAt).toISOString().slice(0, 16) : '',
        }}
      />
    </div>
  )
}
