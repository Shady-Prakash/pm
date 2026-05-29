import { marked, Renderer } from 'marked'
import { codeToHtml } from 'shiki'
import DOMPurify from 'isomorphic-dompurify'

export async function renderMarkdown(content: string): Promise<string> {
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

  return DOMPurify.sanitize(html, {
    ADD_ATTR: ['style', 'class', 'tabindex'],
    FORCE_BODY: true,
  })
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
