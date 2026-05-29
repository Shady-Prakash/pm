import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Projects from '@/components/Projects'

describe('Projects', () => {
  it('renders the section heading', () => {
    render(<Projects />)
    expect(screen.getByText('Projects')).toBeInTheDocument()
  })

  it('renders real project titles from CV', () => {
    render(<Projects />)
    expect(screen.getByText('Dishoom University Web Platform')).toBeInTheDocument()
    expect(screen.getByText('Reveiled – Bridal Peer-to-Peer Marketplace')).toBeInTheDocument()
    expect(screen.getByText('Online Blood Bank Management System')).toBeInTheDocument()
  })

  it('renders project tech stacks', () => {
    render(<Projects />)
    expect(screen.getAllByText('Next.js').length).toBeGreaterThan(0)
    expect(screen.getAllByText('TypeScript').length).toBeGreaterThan(0)
    expect(screen.getAllByText('PostgreSQL').length).toBeGreaterThan(0)
  })

  it('renders GitHub link for Codeathon project', () => {
    render(<Projects />)
    const githubLinks = screen.getAllByRole('link', { name: /github repository/i })
    expect(githubLinks.length).toBeGreaterThan(0)
  })
})
