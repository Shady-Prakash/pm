import type { Skill } from '@/types'
import AboutForm from './_components/AboutForm'
import { skills as staticSkills } from '@/data/portfolio'
import { getAdminAbout } from '@/lib/admin-queries'

export default async function AdminAboutPage() {
  let about = null
  try { about = await getAdminAbout() } catch {}

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-100 mb-8">About Section</h1>
      <AboutForm
        initial={
          about
            ? {
                bio: about.bio,
                skills: about.skills as unknown as Skill[],
                status: about.status as 'draft' | 'published' | 'scheduled',
                scheduledAt: about.scheduledAt ? new Date(about.scheduledAt).toISOString().slice(0, 16) : '',
              }
            : {
                bio: [
                  "I'm a Software Engineer with 5+ years of experience building dynamic, responsive, and scalable web applications — and an AI/ML enthusiast currently deep-diving into automation and Python.",
                  "I've worked across startups and agencies — from building multi-portal enterprise systems at Gurzu Inc to delivering Dishoom University's web platform and shipping a full-stack MVP at Fitch Ratings in 72 hours.",
                  "Pursuing a Master of IT in Artificial Intelligence at Macquarie University, Sydney. I'm passionate about exploring how AI and automation can reshape the way we build software.",
                ],
                skills: staticSkills,
                status: 'draft',
                scheduledAt: '',
              }
        }
      />
    </div>
  )
}
