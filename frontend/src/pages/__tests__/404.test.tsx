import React from 'react'
import { screen } from '@testing-library/react'
import { renderWithI18n } from '../../__tests__/utils/i18n-test-utils'
import NotFoundPage, { Head } from '../404'
import type { PageProps, HeadProps } from 'gatsby'

// Mock Gatsby Link component
jest.mock('gatsby', () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}))

const mockLocation = {
  pathname: '/404',
  search: '',
  hash: '',
  href: 'http://localhost:8000/404',
  origin: 'http://localhost:8000',
  protocol: 'http:',
  host: 'localhost:8000',
  hostname: 'localhost',
  port: '8000',
  state: {},
  key: ''
}

const mockPageProps: PageProps = {
  path: '/404',
  uri: '/404',
  location: mockLocation as PageProps['location'],
  pageContext: {},
  data: {},
  serverData: {},
  children: undefined,
  pageResources: {
    component: null as unknown as PageProps['pageResources']['component'],
    json: { data: {}, pageContext: {} },
    page: { componentChunkName: '', path: '/404', webpackCompilationHash: '' }
  },
  params: {}
}

const mockHeadProps: HeadProps = {
  location: mockLocation as HeadProps['location'],
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
    renderWithI18n(<NotFoundPage {...mockPageProps} />)
    expect(screen.getByText('Page not found')).toBeInTheDocument()
    expect(screen.getByText('Go home')).toBeInTheDocument()
  })

  it('shows development message when NODE_ENV is development', () => {
    process.env.NODE_ENV = 'development'
    renderWithI18n(<NotFoundPage {...mockPageProps} />)
    expect(screen.getByText(/Try creating a page in/)).toBeInTheDocument()
    expect(screen.getByText('src/pages/')).toBeInTheDocument()
  })

  it('does not show development message when NODE_ENV is not development', () => {
    process.env.NODE_ENV = 'production'
    renderWithI18n(<NotFoundPage {...mockPageProps} />)
    expect(screen.queryByText(/Try creating a page in/)).not.toBeInTheDocument()
  })

  it('renders link to home page', () => {
    renderWithI18n(<NotFoundPage {...mockPageProps} />)
    const homeLink = screen.getByText('Go home')
    expect(homeLink).toHaveAttribute('href', '/')
  })
})

describe('Head component', () => {
  it('renders correct title', () => {
    const { container } = renderWithI18n(<Head {...mockHeadProps} />)
    const title = container.querySelector('title')
    expect(title?.textContent).toBe('ページが見つかりません | 数独ソルバー')
  })
})