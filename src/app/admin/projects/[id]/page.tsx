import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProjectForm from '../_components/ProjectForm'

type Params = { params: Promise<{ id: string }> }

export default async function EditProjectPage({ params }: Params) {
  const { id } = await params
  let project
  try {
    project = await prisma.project.findUnique({ where: { id } })
  } catch {}
  if (!project) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-100 mb-8">Edit Project</h1>
      <ProjectForm
        id={project.id}
        initial={{
          title: project.title,
          description: project.description,
          tech: project.tech,
          liveUrl: project.liveUrl ?? '',
          githubUrl: project.githubUrl ?? '',
          status: project.status as 'draft' | 'published' | 'scheduled',
          scheduledAt: project.scheduledAt
            ? new Date(project.scheduledAt).toISOString().slice(0, 16)
            : '',
        }}
      />
    </div>
  )
}
