import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import SudokuBoard from '../SudokuBoard'

// Mock environment variables
const originalEnv = process.env
beforeAll(() => {
  process.env = {
    ...originalEnv,
    GATSBY_SUDOKU_LEVEL: '3'
  }
})

afterAll(() => {
  process.env = originalEnv
})

const emptyBoard = Array(9).fill(null).map(() => Array(9).fill(null))
const solvedBoard = [
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

describe('SudokuBoard', () => {
  it('renders board with correct title', () => {
    render(<SudokuBoard board={emptyBoard} title="Test Board" />)
    expect(screen.getByText('Test Board')).toBeInTheDocument()
  })

  it('renders 81 cells for a 9x9 board', () => {
    render(<SudokuBoard board={emptyBoard} />)
    const cells = document.querySelectorAll('.sudoku-cell')
    expect(cells).toHaveLength(81)
  })

  it('displays numbers correctly in solved board', () => {
    render(<SudokuBoard board={solvedBoard} />)
    expect(screen.getAllByText('5').length).toBeGreaterThan(0)
  })

  it('renders input board with editable cells', () => {
    const mockOnChange = jest.fn()
    render(
      <SudokuBoard
        board={emptyBoard}
        isInput={true}
        onChange={mockOnChange}
      />
    )
    const inputs = screen.getAllByRole('textbox')
    expect(inputs).toHaveLength(81)
  })

  it('calls onChange when cell value is changed', () => {
    const mockOnChange = jest.fn()
    render(
      <SudokuBoard
        board={emptyBoard}
        isInput={true}
        onChange={mockOnChange}
      />
    )

    const inputs = screen.getAllByRole('textbox')
    fireEvent.change(inputs[0], { target: { value: '5' } })

    expect(mockOnChange).toHaveBeenCalledWith(0, 0, 5)
  })

  it('calls onChange with null when cell is cleared', () => {
    const mockOnChange = jest.fn()
    const boardWithValue = emptyBoard.map((row, rowIndex) =>
      row.map((cell, colIndex) =>
        rowIndex === 0 && colIndex === 0 ? 5 : cell
      )
    )

    render(
      <SudokuBoard
        board={boardWithValue}
        isInput={true}
        onChange={mockOnChange}
      />
    )

    const inputs = screen.getAllByRole('textbox')
    fireEvent.change(inputs[0], { target: { value: '' } })

    expect(mockOnChange).toHaveBeenCalledWith(0, 0, null)
  })

  it('does not allow invalid numbers', () => {
    const mockOnChange = jest.fn()
    render(
      <SudokuBoard
        board={emptyBoard}
        isInput={true}
        onChange={mockOnChange}
      />
    )

    const inputs = screen.getAllByRole('textbox')
    fireEvent.change(inputs[0], { target: { value: '10' } })

    expect(mockOnChange).not.toHaveBeenCalled()
  })

  it('renders without title when not provided', () => {
    render(<SudokuBoard board={emptyBoard} />)
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })
})