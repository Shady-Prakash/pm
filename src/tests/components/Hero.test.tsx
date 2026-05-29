import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Hero from '@/components/Hero'

describe('Hero', () => {
  it('renders the name', () => {
    render(<Hero />)
    expect(screen.getByText('Prakash Mahat')).toBeInTheDocument()
  })

  it('renders the tagline', () => {
    render(<Hero />)
    expect(screen.getByText('Software Engineer')).toBeInTheDocument()
  })

  it('renders the View Projects link', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: /view projects/i })).toBeInTheDocument()
  })

  it('renders the Contact Me link', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: /contact me/i })).toBeInTheDocument()
  })

  it('View Projects links to #projects', () => {
    render(<Hero />)
    const link = screen.getByRole('link', { name: /view projects/i })
    expect(link).toHaveAttribute('href', '#projects')
  })
})
