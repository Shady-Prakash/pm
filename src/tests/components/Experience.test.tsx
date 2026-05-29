import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Experience from '@/components/Experience'

describe('Experience', () => {
  it('renders the section heading', () => {
    render(<Experience />)
    expect(screen.getByText('Experience')).toBeInTheDocument()
  })

  it('renders all companies', () => {
    render(<Experience />)
    expect(screen.getByText('Dishoom Limited')).toBeInTheDocument()
    expect(screen.getByText('Gurzu Inc')).toBeInTheDocument()
    expect(screen.getByText('Spyders Lab Private Limited')).toBeInTheDocument()
    expect(screen.getByText('NCT Soft Private Limited')).toBeInTheDocument()
  })

  it('renders time periods', () => {
    render(<Experience />)
    expect(screen.getByText('May 2023 – Mar 2025')).toBeInTheDocument()
    expect(screen.getByText('Aug 2021 – Jan 2023')).toBeInTheDocument()
  })

  it('renders job description bullet points', () => {
    render(<Experience />)
    expect(
      screen.getByText(/improving load speed by 30%/i)
    ).toBeInTheDocument()
  })

  it('renders locations', () => {
    render(<Experience />)
    expect(screen.getByText('Shoreditch, London')).toBeInTheDocument()
  })
})
