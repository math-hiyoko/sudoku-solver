import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server.node'
import { I18nextProvider } from 'react-i18next'
import { screen } from '@testing-library/react'
import { createTestI18n, renderWithI18n } from '../../__tests__/utils/i18n-test-utils'
import IndexPage, { Head } from '../index'
import type { PageProps, HeadProps } from 'gatsby'

// Mock environment variables
const originalEnv = process.env
beforeAll(() => {
  process.env = {
    ...originalEnv,
    GATSBY_SUDOKU_LEVEL: '3',
    GATSBY_SUDOKU_MAX_NUM_SOLUTIONS: '1000000',
    GATSBY_SUDOKU_MAX_SOLUTIONS: '30'
  }
})

afterAll(() => {
  process.env = originalEnv
})

const mockLocation = {
  pathname: '/',
  search: '',
  hash: '',
  href: 'http://localhost:8000/',
  origin: 'http://localhost:8000',
  protocol: 'http:',
  host: 'localhost:8000',
  hostname: 'localhost',
  port: '8000',
  state: {},
  key: ''
}

const mockPageProps: PageProps = {
  path: '/',
  uri: '/',
  location: mockLocation as PageProps['location'],
  pageContext: {},
  data: {},
  serverData: {},
  children: undefined,
  pageResources: {
    component: null as unknown as PageProps['pageResources']['component'],
    json: { data: {}, pageContext: {} },
    page: { componentChunkName: '', path: '/', webpackCompilationHash: '' }
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

describe('IndexPage', () => {
  it('renders SudokuSolver component', () => {
    renderWithI18n(<IndexPage {...mockPageProps} />)
    expect(screen.getByText('数独ソルバー')).toBeInTheDocument()
    expect(screen.getByText('問題を入力してください')).toBeInTheDocument()
  })

  it('renders solve and clear buttons', () => {
    renderWithI18n(<IndexPage {...mockPageProps} />)
    expect(screen.getByText('解く')).toBeInTheDocument()
    expect(screen.getByText('クリア')).toBeInTheDocument()
  })
})

describe('Head component', () => {
  it('renders correct title', () => {
    const markup = renderToStaticMarkup(
      <I18nextProvider i18n={createTestI18n()}>
        <Head {...mockHeadProps} />
      </I18nextProvider>
    )
    const page = new DOMParser().parseFromString(markup, 'text/html')
    expect(page.title).toBe('数独ソルバー｜複数解にも対応した無料オンライン数独解答ツール')
  })
})
