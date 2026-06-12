import { marked, Renderer } from 'marked'
import { codeToHtml } from 'shiki'
import sanitizeHtml from 'sanitize-html'
import { unstable_cache } from 'next/cache'

// Allowlist tuned to preserve marked output + Shiki's <pre>/<span style="color:…">
// code blocks. sanitize-html is pure JS (no jsdom), so it runs on Vercel's
// serverless runtime — unlike isomorphic-dompurify, which crashed there.
const SANITIZE_OPTS: sanitizeHtml.IOptions = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'ul', 'ol', 'li',
    'blockquote', 'code', 'pre', 'span', 'div', 'strong', 'em', 'b', 'i',
    'del', 's', 'hr', 'br', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'figure', 'figcaption',
  ],
  allowedAttributes: {
    '*': ['class', 'style', 'tabindex'],
    a: ['href', 'name', 'target', 'rel'],
    img: ['src', 'alt', 'title'],
  },
  // Shiki emits inline `color` / `background-color`; keep those, drop the rest.
  allowedStyles: {
    '*': {
      color: [/.*/],
      'background-color': [/.*/],
      background: [/.*/],
    },
  },
}

async function _renderMarkdown(content: string): Promise<string> {
  const renderer = new Renderer()
  const codeJobs: Promise<string>[] = []
  const markers: string[] = []

  renderer.code = ({ text, lang }) => {
    const marker = `%%SHIKI_${codeJobs.length}%%`
    markers.push(marker)
    const language = (lang || 'text').toLowerCase()

    codeJobs.push(
      codeToHtml(text, { lang: language, theme: 'dark-plus' })
        .then(
          (html) => `
<div class="code-block">
  <div class="code-block-header">
    <span class="code-block-lang">${language}</span>
    <span class="code-block-dots"><span/><span/><span/></span>
  </div>
  ${html}
</div>`
        )
        .catch(() => `<pre><code>${escapeHtml(text)}</code></pre>`)
    )

    return marker
  }

  // Strip leading # h1 so it doesn't duplicate the page title
  const stripped = content.replace(/^#\s+.+\n?/, '')

  const rawHtml = await marked(stripped, { renderer })
  const resolved = await Promise.all(codeJobs)

  let html = rawHtml
  markers.forEach((m, i) => {
    html = html.replace(m, resolved[i])
  })

  return sanitizeHtml(html, SANITIZE_OPTS)
}

// Keyed by content string — Shiki output is deterministic so cache indefinitely
export const renderMarkdown = unstable_cache(
  _renderMarkdown,
  ['rendered-markdown'],
  { revalidate: false },
)

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
