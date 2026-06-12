import sanitize from 'sanitize-html'

export function sanitizeHtml(dirty: string): string {
  return sanitize(dirty, {
    allowedTags: ['b', 'i', 'em', 'strong', 'a', 'br', 'p', 'ul', 'li', 'code', 'span'],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      '*': ['class'],
    },
  })
}

export function sanitizeText(dirty: string): string {
  return sanitize(dirty, { allowedTags: [], allowedAttributes: {} })
}
