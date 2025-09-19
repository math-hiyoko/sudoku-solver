import React from 'react'
import { render, screen } from '@testing-library/react'
import NotFoundPage, { Head } from '../404'
import type { PageProps, HeadProps } from 'gatsby'

// Mock Gatsby Link component
jest.mock('gatsby', () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}))

const mockPageProps: PageProps = {
  path: '/404',
  uri: '/404',
  location: {} as any,
  pageContext: {},
  data: {},
  serverData: {},
  children: undefined,
  pageResources: {} as any,
  params: {}
}

const mockHeadProps: HeadProps = {
  location: {} as any,
  params: {},
  data: {},
  pageContext: {},
  serverData: {}
}

describe('NotFoundPage', () => {
  const originalEnv = process.env

  afterEach(() => {
    process.env = originalEnv
  })

  it('renders 404 page content', () => {
    render(<NotFoundPage {...mockPageProps} />)
    expect(screen.getByText('Page not found')).toBeInTheDocument()
    expect(screen.getByText('Go home')).toBeInTheDocument()
  })

  it('shows development message when NODE_ENV is development', () => {
    process.env.NODE_ENV = 'development'
    render(<NotFoundPage {...mockPageProps} />)
    expect(screen.getByText(/Try creating a page in/)).toBeInTheDocument()
    expect(screen.getByText('src/pages/')).toBeInTheDocument()
  })

  it('does not show development message when NODE_ENV is not development', () => {
    process.env.NODE_ENV = 'production'
    render(<NotFoundPage {...mockPageProps} />)
    expect(screen.queryByText(/Try creating a page in/)).not.toBeInTheDocument()
  })

  it('renders link to home page', () => {
    render(<NotFoundPage {...mockPageProps} />)
    const homeLink = screen.getByText('Go home')
    expect(homeLink).toHaveAttribute('href', '/')
  })
})

describe('Head component', () => {
  it('renders correct title', () => {
    const { container } = render(<Head {...mockHeadProps} />)
    const title = container.querySelector('title')
    expect(title?.textContent).toBe('Not found')
  })
})