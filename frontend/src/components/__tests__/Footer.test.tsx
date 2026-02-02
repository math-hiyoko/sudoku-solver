import React from 'react'
import { render, screen } from '@testing-library/react'
import Footer from '../Footer'

describe('Footer', () => {
  it('renders footer element', () => {
    render(<Footer />)

    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
  })

  it('renders GitHub source link', () => {
    render(<Footer />)

    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveTextContent('Source: github.com/math-hiyoko/sudoku-solver')
  })

  it('has correct GitHub URL', () => {
    render(<Footer />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://github.com/math-hiyoko/sudoku-solver')
  })

  it('opens link in new tab with security attributes', () => {
    render(<Footer />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
