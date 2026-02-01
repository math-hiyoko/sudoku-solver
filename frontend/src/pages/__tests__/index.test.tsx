import React from 'react'
import { screen, act } from '@testing-library/react'
import { renderWithI18n } from '../../__tests__/utils/i18n-test-utils'
import IndexPage, { Head } from '../index'
import type { PageProps, HeadProps } from 'gatsby'

// Mock environment variables
const originalEnv = process.env
const originalInnerWidth = window.innerWidth

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

beforeEach(() => {
  // Reset window state
  delete window.admaxads
  // Reset innerWidth
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: originalInnerWidth
  })
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
  // GatsbyのHead APIは<html>タグを含むため、テスト環境でDOM警告が出る
  // これは想定内の動作なので警告を抑制する
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation((message) => {
      // validateDOMNesting警告以外は元のconsole.errorを呼び出す
      if (typeof message === 'string' && message.includes('validateDOMNesting')) {
        return
      }
    })
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('renders correct title', () => {
    const { container } = renderWithI18n(<Head {...mockHeadProps} />)
    const title = container.querySelector('title')
    expect(title?.textContent).toBe('数独ソルバー | 無料オンライン数独解答ツール')
  })
})

describe('Ad functionality', () => {
  it('renders ad container', () => {
    const { container } = renderWithI18n(<IndexPage {...mockPageProps} />)
    const adSlot = container.querySelector('[data-admax-id]')
    expect(adSlot).toBeInTheDocument()
  })

  it('uses PC ad config when window width >= 768', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024
    })

    const { container } = renderWithI18n(<IndexPage {...mockPageProps} />)
    const adSlot = container.querySelector('[data-admax-id="170ab79f44a8ae267d269b78243cdeda"]')
    expect(adSlot).toBeInTheDocument()
  })

  it('uses mobile ad config when window width < 768', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375
    })

    const { container } = renderWithI18n(<IndexPage {...mockPageProps} />)
    const adSlot = container.querySelector('[data-admax-id="9cfd6e04195769cd41c84a6797a06368"]')
    expect(adSlot).toBeInTheDocument()
  })

  it('hides ad container when ad is not loaded', () => {
    const { container } = renderWithI18n(<IndexPage {...mockPageProps} />)

    // Find the ad container (parent of the ad slot)
    const adSlot = container.querySelector('[data-admax-id]')
    const adContainer = adSlot?.parentElement

    // Ad container should be hidden when no ad content is loaded
    expect(adContainer?.style.display).toBe('none')
  })

  it('shows ad container when ad content is loaded', async () => {
    const { container } = renderWithI18n(<IndexPage {...mockPageProps} />)

    const adSlot = container.querySelector('[data-admax-id]')
    const adContainer = adSlot?.parentElement

    // Initially hidden
    expect(adContainer?.style.display).toBe('none')

    // Simulate ad SDK inserting content
    await act(async () => {
      const adContent = document.createElement('iframe')
      adSlot?.appendChild(adContent)
      // Wait for MutationObserver to trigger
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    // Container should now be visible
    expect(adContainer?.style.display).toBe('flex')
  })

  it('sets --ad-banner-height CSS variable to 0 when ad not loaded', () => {
    renderWithI18n(<IndexPage {...mockPageProps} />)

    const height = document.documentElement.style.getPropertyValue('--ad-banner-height')
    expect(height).toBe('0px')
  })

  it('renders LanguageSwitcher component', () => {
    const { container } = renderWithI18n(<IndexPage {...mockPageProps} />)
    const languageSwitcher = container.querySelector('.language-switcher')
    expect(languageSwitcher).toBeInTheDocument()
  })
})