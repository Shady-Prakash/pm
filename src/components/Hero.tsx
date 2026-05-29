import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 max-w-6xl mx-auto">
      <div className="pt-20 flex flex-col md:flex-row md:items-center md:justify-between gap-12">
        <div className="flex-1">
          <p className="font-mono text-green-400 text-sm mb-4 tracking-widest">
            Hi, I&apos;m
          </p>
          <h1 className="text-5xl md:text-7xl font-bold text-zinc-100 mb-3 leading-tight">
            Prakash Mahat
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold text-zinc-600 mb-8">
            Software Engineer & AI Enthusiast
          </h2>
          <p className="text-zinc-400 max-w-lg text-lg leading-relaxed mb-10">
            Software Engineer with 4+ years of experience building scalable web apps.
            Currently deep-diving into AI, automation, and Python — exploring how
            intelligent systems can supercharge the way we build and ship products.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#projects"
              className="px-6 py-3 bg-green-400 text-zinc-950 font-semibold rounded font-mono text-sm hover:bg-green-300 transition-colors"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="px-6 py-3 border border-green-400 text-green-400 font-semibold rounded font-mono text-sm hover:bg-green-400/10 transition-colors"
            >
              Contact Me
            </a>
          </div>
        </div>

        <div className="flex-shrink-0 flex justify-center md:justify-end">
          <div className="relative w-56 h-56 md:w-72 md:h-72">
            <div className="absolute inset-0 rounded-full border-2 border-green-400 translate-x-3 translate-y-3" />
            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-zinc-800">
              <Image
                src="/prakash.jpg"
                alt="Prakash Mahat"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
        <span className="text-zinc-700 text-xs font-mono tracking-widest">scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-zinc-700 to-transparent" />
      </div>
    </section>
  )
}
