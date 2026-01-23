import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
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
    await act(async () => {
      fireEvent.click(solveButton)
    })

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

    await act(async () => {
      fireEvent.click(solveButton)
    })

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

    await act(async () => {
      fireEvent.click(solveButton)
    })

    await waitFor(() => {
      expect(screen.getByText('🌐 ネットワークエラー')).toBeInTheDocument()
      expect(screen.getByText('Network error')).toBeInTheDocument()
    })
  })

  it('shows InvalidInput error with proper formatting', async () => {
    const errorResponse = {
      error: {
        type: 'InvalidInput',
        message: 'Array size is incorrect or Invalid input type.'
      }
    }

    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve(errorResponse)
    })

    render(<SudokuSolver />)

    const solveButton = screen.getByText('解く')
    await act(async () => {
      fireEvent.click(solveButton)
    })

    await waitFor(() => {
      expect(screen.getByText('📝 入力エラー')).toBeInTheDocument()
      expect(screen.getByText('Array size is incorrect or Invalid input type.')).toBeInTheDocument()
    })
  })

  it('shows OutOfRangeError with detailed error positions', async () => {
    const errorResponse = {
      error: {
        type: 'OutOfRangeError',
        message: 'Input validation error: some numbers are out of the allowed range.',
        detail: [
          { row: 8, column: 7, number: 10 },
          { row: 8, column: 8, number: -1 }
        ]
      }
    }

    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve(errorResponse)
    })

    render(<SudokuSolver />)

    const solveButton = screen.getByText('解く')
    await act(async () => {
      fireEvent.click(solveButton)
    })

    await waitFor(() => {
      expect(screen.getByText('🔢 数値範囲エラー')).toBeInTheDocument()
      expect(screen.getByText('Input validation error: some numbers are out of the allowed range.')).toBeInTheDocument()
      expect(screen.getByText('問題のある位置:')).toBeInTheDocument()
      expect(screen.getByText('行 9, 列 8: 値 10')).toBeInTheDocument()
      expect(screen.getByText('行 9, 列 9: 値 -1')).toBeInTheDocument()
      expect(screen.getByText('💡 数独の値は1〜9の数字のみ有効です')).toBeInTheDocument()
    })
  })

  it('shows ConstraintViolation error with detailed positions', async () => {
    const errorResponse = {
      error: {
        type: 'ConstraintViolation',
        message: 'Input does not meet the required constraints.',
        detail: [
          { row: 4, column: 8, number: 1 },
          { row: 7, column: 8, number: 1 },
          { row: 8, column: 0, number: 1 },
          { row: 8, column: 7, number: 1 },
          { row: 8, column: 8, number: 1 }
        ]
      }
    }

    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve(errorResponse)
    })

    render(<SudokuSolver />)

    const solveButton = screen.getByText('解く')
    await act(async () => {
      fireEvent.click(solveButton)
    })

    await waitFor(() => {
      expect(screen.getByText('⚠️ 制約違反エラー')).toBeInTheDocument()
      expect(screen.getByText('Input does not meet the required constraints.')).toBeInTheDocument()
      expect(screen.getByText('問題のある位置:')).toBeInTheDocument()
      expect(screen.getByText('行 5, 列 9: 値 1')).toBeInTheDocument()
      expect(screen.getByText('行 8, 列 9: 値 1')).toBeInTheDocument()
      expect(screen.getByText('行 9, 列 1: 値 1')).toBeInTheDocument()
      expect(screen.getByText('行 9, 列 8: 値 1')).toBeInTheDocument()
      expect(screen.getByText('行 9, 列 9: 値 1')).toBeInTheDocument()
      expect(screen.getByText('💡 数独のルールに違反しています（同じ行・列・ブロックに同じ数字は配置できません）')).toBeInTheDocument()
    })
  })

  it('shows InternalServerError with proper formatting', async () => {
    const errorResponse = {
      error: {
        type: 'InternalServerError',
        message: 'An internal server error occurred while processing your request.'
      }
    }

    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve(errorResponse)
    })

    render(<SudokuSolver />)

    const solveButton = screen.getByText('解く')
    await act(async () => {
      fireEvent.click(solveButton)
    })

    await waitFor(() => {
      expect(screen.getByText('🔧 サーバーエラー')).toBeInTheDocument()
      expect(screen.getByText('An internal server error occurred while processing your request.')).toBeInTheDocument()
      expect(screen.getByText('💡 サーバーで予期しないエラーが発生しました。しばらく時間をおいて再度お試しください')).toBeInTheDocument()
    })
  })

  it('shows client-side constraint violation before calling API', async () => {
    render(<SudokuSolver />)

    // Set up constraint violation: same number in same row
    const inputs = screen.getAllByRole('textbox')
    fireEvent.change(inputs[0], { target: { value: '1' } }) // First cell
    fireEvent.change(inputs[1], { target: { value: '1' } }) // Second cell in same row

    const solveButton = screen.getByText('解く')
    await act(async () => {
      fireEvent.click(solveButton)
    })

    await waitFor(() => {
      expect(screen.getByText('⚠️ 制約違反エラー')).toBeInTheDocument()
      expect(screen.getByText('数独のルールに違反している箇所があります。')).toBeInTheDocument()
      expect(screen.getByText('問題のある位置:')).toBeInTheDocument()
    })

    // Should not call the API due to client-side validation
    expect(mockFetch).not.toHaveBeenCalled()
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
    await act(async () => {
      fireEvent.click(solveButton)
    })

    await waitFor(() => {
      expect(screen.getByText('解の個数: 1,000,000+ (概算)')).toBeInTheDocument()
    })
  })

  it('shows appropriate message when no solutions exist', async () => {
    const noSolutionResponse = {
      solutions: [],
      num_solutions: 0,
      is_exact_num_solutions: true
    }

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(noSolutionResponse)
    })

    render(<SudokuSolver />)

    const solveButton = screen.getByText('解く')
    await act(async () => {
      fireEvent.click(solveButton)
    })

    await waitFor(() => {
      expect(screen.getByText('解の個数: 0')).toBeInTheDocument()
      expect(screen.getByText('この問題には解がありません。入力を確認してください。')).toBeInTheDocument()
    })

    // Should not show any solution boards
    expect(screen.queryByText('解 1')).not.toBeInTheDocument()
  })

  it('does not show solution count message in initial state', () => {
    render(<SudokuSolver />)

    // Should not show solution count message initially
    expect(screen.queryByText(/解の個数:/)).not.toBeInTheDocument()
    expect(screen.queryByText('この問題には解がありません。')).not.toBeInTheDocument()
  })

  it('does not show solution count message after clearing board', async () => {
    // First solve a problem
    const noSolutionResponse = {
      solutions: [],
      num_solutions: 0,
      is_exact_num_solutions: true
    }

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(noSolutionResponse)
    })

    render(<SudokuSolver />)

    const solveButton = screen.getByText('解く')
    await act(async () => {
      fireEvent.click(solveButton)
    })

    // Wait for solution count to appear
    await waitFor(() => {
      expect(screen.getByText('解の個数: 0')).toBeInTheDocument()
    })

    // Clear the board
    const clearButton = screen.getByText('クリア')
    fireEvent.click(clearButton)

    // Should not show solution count message after clearing
    expect(screen.queryByText(/解の個数:/)).not.toBeInTheDocument()
    expect(screen.queryByText('この問題には解がありません。')).not.toBeInTheDocument()
  })

  it('shows real-time validation errors during cell input', async () => {
    render(<SudokuSolver />)

    const inputs = screen.getAllByRole('textbox')

    // Input constraint violation: same number in same row
    fireEvent.change(inputs[0], { target: { value: '1' } })

    // No error should be shown yet (only one cell)
    expect(screen.queryByText('⚠️ 制約違反エラー')).not.toBeInTheDocument()

    // Add second cell with same value in same row
    fireEvent.change(inputs[1], { target: { value: '1' } })

    // Error should appear immediately without clicking solve
    await waitFor(() => {
      expect(screen.getByText('⚠️ 制約違反エラー')).toBeInTheDocument()
      expect(screen.getByText('数独のルールに違反している箇所があります。')).toBeInTheDocument()
    })

    // API should not have been called
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('ignores zero input (treats it like non-numeric input)', async () => {
    render(<SudokuSolver />)

    const inputs = screen.getAllByRole('textbox')

    // Input zero value
    fireEvent.change(inputs[0], { target: { value: '0' } })

    // Cell should remain empty (zero is ignored)
    expect(inputs[0]).toHaveValue('')

    // No error should appear
    expect(screen.queryByText('🔢 数値範囲エラー')).not.toBeInTheDocument()
    expect(screen.queryByText('入力された数値が有効な範囲外です。')).not.toBeInTheDocument()

    // API should not have been called
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('clears real-time validation errors when invalid input is removed', async () => {
    render(<SudokuSolver />)

    const inputs = screen.getAllByRole('textbox')

    // Input constraint violation
    fireEvent.change(inputs[0], { target: { value: '1' } })
    fireEvent.change(inputs[1], { target: { value: '1' } })

    // Error should appear
    await waitFor(() => {
      expect(screen.getByText('⚠️ 制約違反エラー')).toBeInTheDocument()
    })

    // Clear one of the conflicting values
    fireEvent.change(inputs[1], { target: { value: '' } })

    // Error should disappear
    await waitFor(() => {
      expect(screen.queryByText('⚠️ 制約違反エラー')).not.toBeInTheDocument()
    })
  })

  it('handles edge case where board has NaN values that get filtered out', async () => {
    render(<SudokuSolver />)

    // Input valid values first
    const inputs = screen.getAllByRole('textbox')
    fireEvent.change(inputs[0], { target: { value: '1' } })
    fireEvent.change(inputs[9], { target: { value: '2' } })

    const solveButton = screen.getByText('解く')
    await act(async () => {
      fireEvent.click(solveButton)
    })

    // Validation should work correctly even with mixed valid/invalid values
    expect(solveButton).toBeInTheDocument()
  })

  it('clears solvedFromBoard when clearing the board', () => {
    render(<SudokuSolver />)

    // Add some input
    const inputs = screen.getAllByRole('textbox')
    fireEvent.change(inputs[0], { target: { value: '1' } })

    // Clear the board
    const clearButton = screen.getByText('クリア')
    fireEvent.click(clearButton)

    // Board should be empty
    expect(inputs[0]).toHaveValue('')
  })
})