import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />)
    expect(container.firstChild).toBeTruthy()
  })

  it('displays the venture name in the heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: /ClearPath Environmental/i })).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<App />)
    const navLinks = screen.getAllByRole('navigation')
    expect(navLinks.length).toBeGreaterThan(0)
  })

  it('renders the contact form with required fields', () => {
    render(<App />)
    expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^message$/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()
  })

  it('renders the dark mode toggle', () => {
    render(<App />)
    expect(screen.getByLabelText(/switch to dark mode/i)).toBeInTheDocument()
  })
})
