function GitHubIcon() {
  return (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}

export default function Contact() {
  return (
    <section id="contact" className="py-28 px-6 max-w-6xl mx-auto">
      <div className="mb-14">
        <span className="font-mono text-green-400 text-sm">04.</span>
        <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 mt-1">Get In Touch</h2>
        <div className="mt-3 w-16 h-px bg-green-400" />
      </div>

      <div className="max-w-lg">
        <p className="text-zinc-400 leading-relaxed text-[15px] mb-8">
          I&apos;m currently open to new opportunities. Whether you have a question,
          a project idea, or just want to say hi — my inbox is always open.
          I&apos;ll do my best to get back to you!
        </p>

        <a
          href="mailto:shadyprakash8@gmail.com"
          className="inline-flex items-center gap-2 px-8 py-4 border border-green-400 text-green-400 font-mono text-sm rounded hover:bg-green-400/10 transition-colors mb-12"
        >
          <MailIcon />
          Say Hello
        </a>

        <div className="flex gap-6">
          <a
            href="https://github.com/Shady-Prakash"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-green-400 transition-colors"
            aria-label="GitHub"
          >
            <GitHubIcon />
          </a>
          <a
            href="https://www.linkedin.com/in/prakash-mahat-98b993184/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-green-400 transition-colors"
            aria-label="LinkedIn"
          >
            <LinkedInIcon />
          </a>
          <a
            href="mailto:shadyprakash8@gmail.com"
            className="text-zinc-500 hover:text-green-400 transition-colors"
            aria-label="Email"
          >
            <MailIcon />
          </a>
        </div>
      </div>
    </section>
  )
}
