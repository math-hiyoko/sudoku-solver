import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SudokuSolver from '../SudokuSolver'

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

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

const mockApiResponse = {
  solutions: [
    {
      solution: [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9]
      ]
    }
  ],
  num_solutions: 1,
  is_exact_num_solutions: true
}

describe('SudokuSolver', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('renders main heading', () => {
    render(<SudokuSolver />)
    expect(screen.getByText('数独ソルバー')).toBeInTheDocument()
  })

  it('renders solve and clear buttons', () => {
    render(<SudokuSolver />)
    expect(screen.getByText('解く')).toBeInTheDocument()
    expect(screen.getByText('クリア')).toBeInTheDocument()
  })

  it('renders input board', () => {
    render(<SudokuSolver />)
    expect(screen.getByText('問題を入力してください')).toBeInTheDocument()
    const inputs = screen.getAllByRole('textbox')
    expect(inputs).toHaveLength(81)
  })

  it('clears board when clear button is clicked', () => {
    render(<SudokuSolver />)

    const inputs = screen.getAllByRole('textbox')
    fireEvent.change(inputs[0], { target: { value: '5' } })

    const clearButton = screen.getByText('クリア')
    fireEvent.click(clearButton)

    const clearedInputs = screen.getAllByRole('textbox')
    expect(clearedInputs[0]).toHaveValue('')
  })

  it('shows loading state when solving', async () => {
    mockFetch.mockImplementation(() =>
      new Promise(resolve =>
        setTimeout(() => resolve({
          ok: true,
          json: () => Promise.resolve(mockApiResponse)
        }), 100)
      )
    )

    render(<SudokuSolver />)

    const solveButton = screen.getByText('解く')
    fireEvent.click(solveButton)

    expect(screen.getByText('解いています...')).toBeInTheDocument()
    expect(solveButton).toBeDisabled()

    await waitFor(() => {
      expect(screen.queryByText('解いています...')).not.toBeInTheDocument()
    })
  })

  it('displays solutions after successful solve', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockApiResponse)
    })

    render(<SudokuSolver />)

    const solveButton = screen.getByText('解く')
    fireEvent.click(solveButton)

    await waitFor(() => {
      expect(screen.getByText('解の個数: 1')).toBeInTheDocument()
      expect(screen.getByText('解 1')).toBeInTheDocument()
    })

    expect(mockFetch).toHaveBeenCalledWith(
      'https://4cubkquqti.execute-api.ap-northeast-1.amazonaws.com/solve-sudoku',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    )
  })

  it('shows error message on API failure', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'))

    render(<SudokuSolver />)

    const solveButton = screen.getByText('解く')
    fireEvent.click(solveButton)

    await waitFor(() => {
      expect(screen.getByText(/エラー: Network error/)).toBeInTheDocument()
    })
  })

  it('formats large solution counts correctly', async () => {
    const largeCountResponse = {
      ...mockApiResponse,
      num_solutions: 1000000,
      is_exact_num_solutions: false
    }

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(largeCountResponse)
    })

    render(<SudokuSolver />)

    const solveButton = screen.getByText('解く')
    fireEvent.click(solveButton)

    await waitFor(() => {
      expect(screen.getByText('解の個数: 1,000,000+ (概算)')).toBeInTheDocument()
    })
  })
})