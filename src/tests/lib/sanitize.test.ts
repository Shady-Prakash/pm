import { describe, it, expect } from 'vitest'
import { sanitizeHtml, sanitizeText } from '@/lib/sanitize'

describe('sanitizeHtml', () => {
  it('allows safe tags', () => {
    const result = sanitizeHtml('<strong>Hello</strong>')
    expect(result).toBe('<strong>Hello</strong>')
  })

  it('removes script tags', () => {
    const result = sanitizeHtml('<script>alert("xss")</script>Hello')
    expect(result).not.toContain('<script>')
    expect(result).toContain('Hello')
  })

  it('removes onclick attributes', () => {
    const result = sanitizeHtml('<a href="#" onclick="alert(1)">link</a>')
    expect(result).not.toContain('onclick')
  })

  it('allows safe anchor tags with href', () => {
    const result = sanitizeHtml('<a href="https://example.com">link</a>')
    expect(result).toContain('<a')
    expect(result).toContain('href')
  })

  it('removes onerror attributes', () => {
    const result = sanitizeHtml('<img src="x" onerror="alert(1)">')
    expect(result).not.toContain('onerror')
  })
})

describe('sanitizeText', () => {
  it('strips all HTML tags', () => {
    const result = sanitizeText('<p>Hello <strong>world</strong></p>')
    expect(result).toBe('Hello world')
  })

  it('removes script tags', () => {
    const result = sanitizeText('<script>alert("xss")</script>')
    expect(result).not.toContain('<script>')
  })

  it('returns plain text unchanged', () => {
    const result = sanitizeText('Just plain text')
    expect(result).toBe('Just plain text')
  })

  it('handles empty string', () => {
    expect(sanitizeText('')).toBe('')
  })
})
