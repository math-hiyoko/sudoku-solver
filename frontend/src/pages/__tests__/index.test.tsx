import React from 'react'
import { render, screen } from '@testing-library/react'
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

const mockPageProps: PageProps = {
  path: '/',
  uri: '/',
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

describe('IndexPage', () => {
  it('renders SudokuSolver component', () => {
    render(<IndexPage {...mockPageProps} />)
    expect(screen.getByText('数独ソルバー')).toBeInTheDocument()
    expect(screen.getByText('問題を入力してください')).toBeInTheDocument()
  })

  it('renders solve and clear buttons', () => {
    render(<IndexPage {...mockPageProps} />)
    expect(screen.getByText('解く')).toBeInTheDocument()
    expect(screen.getByText('クリア')).toBeInTheDocument()
  })
})

describe('Head component', () => {
  it('renders correct title', () => {
    const { container } = render(<Head {...mockHeadProps} />)
    const title = container.querySelector('title')
    expect(title?.textContent).toBe('数独ソルバー')
  })
})