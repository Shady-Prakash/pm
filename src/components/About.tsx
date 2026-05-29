import { getAbout } from '@/lib/content'

export default async function About() {
  const { bio, skills } = await getAbout()

  const bioText: string[] = Array.isArray(bio) && bio.length > 0
    ? bio as string[]
    : [
        "I'm a Software Engineer with 4+ years of experience building dynamic, responsive, and scalable web applications — and an AI/ML enthusiast currently deep-diving into automation and Python.",
        "I've worked across startups and agencies — from building multi-portal enterprise systems at Gurzu Inc to delivering Dishoom University's web platform and shipping a full-stack MVP at Fitch Ratings in 72 hours.",
        "Pursuing a Master of IT in Artificial Intelligence at Macquarie University, Sydney. I'm passionate about exploring how AI and automation can reshape the way we build software.",
      ]

  return (
    <section id="about" className="py-28 px-6 max-w-6xl mx-auto">
      <div className="mb-14">
        <span className="font-mono text-green-400 text-sm">01.</span>
        <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 mt-1">About Me</h2>
        <div className="mt-3 w-16 h-px bg-green-400" />
      </div>

      <div className="grid md:grid-cols-2 gap-14">
        <div className="space-y-5 text-zinc-400 leading-relaxed text-[15px]">
          {bioText.map((para, i) => <p key={i}>{para}</p>)}
        </div>

        <div className="space-y-7">
          {skills.map((group) => (
            <div key={group.category}>
              <h3 className="text-zinc-300 font-mono text-sm mb-3 flex items-center gap-2">
                <span className="text-green-400">▹</span>
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item} className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono rounded-full hover:border-green-400/50 hover:text-green-400 transition-colors cursor-default">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
