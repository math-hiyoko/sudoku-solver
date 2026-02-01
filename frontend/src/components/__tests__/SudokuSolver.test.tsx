import React from 'react'
import { screen, fireEvent, waitFor, act } from '@testing-library/react'
import { renderWithI18n } from '../../__tests__/utils/i18n-test-utils'
import SudokuSolver from '../SudokuSolver'

// Shared test data
const SOLVED_BOARD = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
]

const createSampleBoard = (key: string) => {
  const boards: Record<string, (number | null)[][]> = {
    sample1: [
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, 3, null, 8, 5],
      [null, null, 1, null, 2, null, null, null, null],
      [null, null, null, 5, null, 7, null, null, null],
      [null, null, 4, null, null, null, 1, null, null],
      [null, 9, null, null, null, null, null, null, null],
      [5, null, null, null, null, null, null, 7, 3],
      [null, null, 2, null, 1, null, null, null, null],
      [null, null, null, null, 4, null, null, null, 9],
    ],
    sample2: [
      [null, null, null, 2, null, null, 7, null, 1],
      [6, null, null, null, 7, null, null, 9, null],
      [null, 9, null, null, null, 4, null, null, null],
      [null, 2, null, 1, null, null, null, 4, null],
      [null, null, 4, null, null, 2, 9, null, null],
      [null, 5, null, null, null, null, null, null, 8],
      [null, null, null, 3, null, null, null, null, 4],
      [null, 4, null, null, 5, null, null, 3, null],
      [7, null, 3, null, null, 8, null, null, null],
    ],
    sample3: [
      [8, null, null, null, null, null, null, null, 3],
      [null, null, 3, 6, null, null, null, null, null],
      [null, 7, null, null, 9, null, 2, null, null],
      [null, 5, null, null, null, 7, null, null, null],
      [null, null, null, null, null, 5, 7, null, null],
      [null, null, null, 1, null, null, null, null, null],
      [null, null, 1, null, null, null, null, 6, 8],
      [null, null, null, null, null, null, null, 1, null],
      [null, 9, null, null, null, null, 4, null, null],
    ],
  }
  return boards[key]
}

// Mock config module
jest.mock('../../config', () => ({
  config: {
    sudokuLevel: 3,
    maxNumSolutions: 1000000,
    maxDisplaySolutions: 30,
    apiUrl: 'https://test-api.example.com/solve',
  },
  boardSize: 9,
  SAMPLE_PUZZLES: [
    { key: 'sample1', board: createSampleBoard('sample1') },
    { key: 'sample2', board: createSampleBoard('sample2') },
    { key: 'sample3', board: createSampleBoard('sample3') },
  ],
  createEmptyBoard: () => Array(9).fill(null).map(() => Array(9).fill(null)),
}))

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

const createApiResponse = (numSolutions: number, isExact = true, solutionCount = 1) => ({
  solutions: Array(solutionCount).fill({ solution: SOLVED_BOARD }),
  num_solutions: numSolutions,
  is_exact_num_solutions: isExact,
})

const createErrorResponse = (type: string, message: string, detail?: unknown[]) => ({
  error: { type, message, detail },
})

describe('SudokuSolver', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('Initial render', () => {
    it('renders title and buttons', () => {
      renderWithI18n(<SudokuSolver />)
      expect(screen.getByText('数独ソルバー')).toBeInTheDocument()
      expect(screen.getByText('解く')).toBeInTheDocument()
      expect(screen.getByText('クリア')).toBeInTheDocument()
    })

    it('renders 81 input cells', () => {
      renderWithI18n(<SudokuSolver />)
      expect(screen.getAllByRole('textbox')).toHaveLength(81)
    })

    it('renders sample puzzle buttons', () => {
      renderWithI18n(<SudokuSolver />)
      expect(screen.getByText('サンプル1')).toBeInTheDocument()
      expect(screen.getByText('サンプル2')).toBeInTheDocument()
      expect(screen.getByText('サンプル3')).toBeInTheDocument()
    })
  })

  describe('Board interaction', () => {
    it('clears board when clear button is clicked', () => {
      renderWithI18n(<SudokuSolver />)
      const inputs = screen.getAllByRole('textbox')
      fireEvent.change(inputs[0], { target: { value: '5' } })
      fireEvent.click(screen.getByText('クリア'))
      expect(inputs[0]).toHaveValue('')
    })

    it('loads sample puzzle when sample button is clicked', () => {
      renderWithI18n(<SudokuSolver />)
      fireEvent.click(screen.getByText('サンプル1'))
      const inputs = screen.getAllByRole('textbox')
      expect(inputs[14]).toHaveValue('3')  // Row 2, Col 6
      expect(inputs[16]).toHaveValue('8')  // Row 2, Col 8
    })
  })

  describe('Validation', () => {
    it('shows constraint violation error for duplicate values in row', async () => {
      renderWithI18n(<SudokuSolver />)
      const inputs = screen.getAllByRole('textbox')
      fireEvent.change(inputs[0], { target: { value: '1' } })
      fireEvent.change(inputs[1], { target: { value: '1' } })

      await waitFor(() => {
        expect(screen.getByText('⚠️ 制約違反エラー')).toBeInTheDocument()
      })
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('clears validation errors when conflict is resolved', async () => {
      renderWithI18n(<SudokuSolver />)
      const inputs = screen.getAllByRole('textbox')
      fireEvent.change(inputs[0], { target: { value: '1' } })
      fireEvent.change(inputs[1], { target: { value: '1' } })

      await waitFor(() => {
        expect(screen.getByText('⚠️ 制約違反エラー')).toBeInTheDocument()
      })

      fireEvent.change(inputs[1], { target: { value: '' } })

      await waitFor(() => {
        expect(screen.queryByText('⚠️ 制約違反エラー')).not.toBeInTheDocument()
      })
    })

    it('clears errors when loading a sample puzzle', async () => {
      renderWithI18n(<SudokuSolver />)
      const inputs = screen.getAllByRole('textbox')
      fireEvent.change(inputs[0], { target: { value: '1' } })
      fireEvent.change(inputs[1], { target: { value: '1' } })

      await waitFor(() => {
        expect(screen.getByText('⚠️ 制約違反エラー')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('サンプル1'))
      expect(screen.queryByText('⚠️ 制約違反エラー')).not.toBeInTheDocument()
    })
  })

  describe('Solving', () => {
    it('shows loading state while solving', async () => {
      mockFetch.mockImplementation(() =>
        new Promise(resolve =>
          setTimeout(() => resolve({
            ok: true,
            json: () => Promise.resolve(createApiResponse(1))
          }), 100)
        )
      )

      renderWithI18n(<SudokuSolver />)
      await act(async () => {
        fireEvent.click(screen.getByText('解く'))
      })

      expect(screen.getByText('解いています...')).toBeInTheDocument()
      expect(screen.getByText('サンプル1')).toBeDisabled()

      await waitFor(() => {
        expect(screen.queryByText('解いています...')).not.toBeInTheDocument()
      })
    })

    it('displays solution after successful solve', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(createApiResponse(1))
      })

      renderWithI18n(<SudokuSolver />)
      await act(async () => {
        fireEvent.click(screen.getByText('解く'))
      })

      await waitFor(() => {
        expect(screen.getByText(/解の個数:/)).toBeInTheDocument()
        expect(screen.getByText('解 1 / 1')).toBeInTheDocument()
      })
    })

    it('displays no solution message when puzzle has no solution', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(createApiResponse(0, true, 0))
      })

      renderWithI18n(<SudokuSolver />)
      await act(async () => {
        fireEvent.click(screen.getByText('解く'))
      })

      await waitFor(() => {
        expect(screen.getByText('解が見つかりませんでした')).toBeInTheDocument()
      })
    })

    it('shows exact count indicator for large solution counts', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(createApiResponse(1000000, true))
      })

      renderWithI18n(<SudokuSolver />)
      await act(async () => {
        fireEvent.click(screen.getByText('解く'))
      })

      await waitFor(() => {
        expect(screen.getByText('1,000,000+')).toBeInTheDocument()
        expect(screen.getByText('ちょうど')).toBeInTheDocument()
      })
    })
  })

  describe('Solution navigation', () => {
    it('navigates between multiple solutions', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(createApiResponse(3, true, 3))
      })

      renderWithI18n(<SudokuSolver />)
      await act(async () => {
        fireEvent.click(screen.getByText('解く'))
      })

      await waitFor(() => {
        expect(screen.getByText('解 1 / 3')).toBeInTheDocument()
      })

      const prevButton = screen.getByText('←')
      const nextButton = screen.getByText('→')

      expect(prevButton).toBeDisabled()
      expect(nextButton).not.toBeDisabled()

      fireEvent.click(nextButton)
      await waitFor(() => {
        expect(screen.getByText('解 2 / 3')).toBeInTheDocument()
      })

      fireEvent.click(nextButton)
      await waitFor(() => {
        expect(screen.getByText('解 3 / 3')).toBeInTheDocument()
      })
      expect(nextButton).toBeDisabled()

      fireEvent.click(prevButton)
      await waitFor(() => {
        expect(screen.getByText('解 2 / 3')).toBeInTheDocument()
      })
    })

    it('returns to input mode when back button is clicked', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(createApiResponse(1))
      })

      renderWithI18n(<SudokuSolver />)
      await act(async () => {
        fireEvent.click(screen.getByText('解く'))
      })

      await waitFor(() => {
        expect(screen.getByText(/解の個数:/)).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('戻る'))
      expect(screen.getByText('問題を入力してください')).toBeInTheDocument()
      expect(screen.queryByText(/解の個数:/)).not.toBeInTheDocument()
    })
  })

  describe('Error handling', () => {
    it('shows network error on fetch failure', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      renderWithI18n(<SudokuSolver />)
      await act(async () => {
        fireEvent.click(screen.getByText('解く'))
      })

      await waitFor(() => {
        expect(screen.getByText('🌐 ネットワークエラー')).toBeInTheDocument()
        expect(screen.getByText('Network error')).toBeInTheDocument()
      })
    })

    it('shows InvalidInput error from API', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve(createErrorResponse('InvalidInput', 'Invalid input'))
      })

      renderWithI18n(<SudokuSolver />)
      await act(async () => {
        fireEvent.click(screen.getByText('解く'))
      })

      await waitFor(() => {
        expect(screen.getByText('📝 入力エラー')).toBeInTheDocument()
      })
    })

    it('shows OutOfRangeError with details from API', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve(createErrorResponse(
          'OutOfRangeError',
          'Numbers out of range',
          [{ row: 0, column: 0, number: 10 }]
        ))
      })

      renderWithI18n(<SudokuSolver />)
      await act(async () => {
        fireEvent.click(screen.getByText('解く'))
      })

      await waitFor(() => {
        expect(screen.getByText('🔢 数値範囲エラー')).toBeInTheDocument()
        expect(screen.getByText('行 1, 列 1: 値 10')).toBeInTheDocument()
      })
    })

    it('shows ConstraintViolation error with details from API', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve(createErrorResponse(
          'ConstraintViolation',
          'Constraint violation',
          [{ row: 0, column: 0, number: 1 }, { row: 0, column: 1, number: 1 }]
        ))
      })

      renderWithI18n(<SudokuSolver />)
      await act(async () => {
        fireEvent.click(screen.getByText('解く'))
      })

      await waitFor(() => {
        expect(screen.getByText('⚠️ 制約違反エラー')).toBeInTheDocument()
        expect(screen.getByText('行 1, 列 1: 値 1')).toBeInTheDocument()
        expect(screen.getByText('行 1, 列 2: 値 1')).toBeInTheDocument()
      })
    })

    it('shows InternalServerError with hint', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve(createErrorResponse('InternalServerError', 'Server error'))
      })

      renderWithI18n(<SudokuSolver />)
      await act(async () => {
        fireEvent.click(screen.getByText('解く'))
      })

      await waitFor(() => {
        expect(screen.getByText('🔧 サーバーエラー')).toBeInTheDocument()
        expect(screen.getByText(/サーバーで予期しないエラーが発生しました/)).toBeInTheDocument()
      })
    })
  })
})
